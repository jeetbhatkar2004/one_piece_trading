import { prisma } from './prisma'
import { quoteBuy, quoteSell, applySlippage, getSpotPrice } from './amm'
import Decimal from 'decimal.js'
import { TradeSide } from '@prisma/client'

interface ExecuteTradeParams {
  userId: string
  characterId: string
  side: TradeSide
  amountIn: Decimal
  slippageBps: number
  clientNonce: string
  /** Override pool fee (e.g. 0 for fee-free close) */
  overrideFeeBps?: number
}

export async function executeTrade({
  userId,
  characterId,
  side,
  amountIn,
  slippageBps,
  clientNonce,
  overrideFeeBps,
}: ExecuteTradeParams) {
  return await prisma.$transaction(async (tx) => {
    // Lock wallet, position, and pool rows
    const wallet = await tx.wallet.findUnique({
      where: { userId },
      select: { berriesBalance: true },
    })

    if (!wallet) {
      throw new Error('Wallet not found')
    }

    const pool = await tx.pool.findUnique({
      where: { characterId },
    })

    if (!pool) {
      throw new Error('Pool not found')
    }

    // Check idempotency
    const existingTrade = await tx.trade.findUnique({
      where: {
        userId_clientNonce: {
          userId,
          clientNonce,
        },
      },
    })

    if (existingTrade) {
      throw new Error('Trade already executed (idempotency check)')
    }

    // Get or create position
    let position = await tx.position.findUnique({
      where: {
        userId_characterId: {
          userId,
          characterId,
        },
      },
    })

    if (!position) {
      position = await tx.position.create({
        data: {
          userId,
          characterId,
          tokensBalance: 0,
          avgCostBerries: 0,
        },
      })
    }

    // Calculate quote
    const reserveBerries = new Decimal(pool.reserveBerries)
    const reserveTokens = new Decimal(pool.reserveTokens)
    const feeBps = overrideFeeBps !== undefined ? overrideFeeBps : pool.feeBps

    let quote
    if (side === 'BUY') {
      // Check balance
      const walletBalance = new Decimal(wallet.berriesBalance)
      if (walletBalance.lt(amountIn)) {
        throw new Error('Insufficient berries balance')
      }

      quote = quoteBuy(reserveBerries, reserveTokens, amountIn, feeBps)
    } else {
      // Check balance
      const positionBalance = new Decimal(position.tokensBalance)
      if (positionBalance.lt(amountIn)) {
        throw new Error('Insufficient tokens balance')
      }

      quote = quoteSell(reserveBerries, reserveTokens, amountIn, feeBps)
    }

    const minOut = applySlippage(quote.amountOut, slippageBps)

    // Verify slippage protection
    if (quote.amountOut.lt(minOut)) {
      throw new Error('Slippage tolerance exceeded')
    }

    // Update pool
    await tx.pool.update({
      where: { characterId },
      data: {
        reserveBerries: quote.newReserveBerries,
        reserveTokens: quote.newReserveTokens,
        version: { increment: 1 },
      },
    })

    // Update wallet
    if (side === 'BUY') {
      await tx.wallet.update({
        where: { userId },
        data: {
          berriesBalance: {
            decrement: amountIn.toNumber(),
          },
        },
      })
    } else {
      await tx.wallet.update({
        where: { userId },
        data: {
          berriesBalance: {
            increment: quote.amountOut.toNumber(),
          },
        },
      })
    }

    // Update position and calculate average cost
    let newTokensBalance: Decimal
    let newAvgCost: Decimal

    if (side === 'BUY') {
      newTokensBalance = new Decimal(position.tokensBalance).plus(quote.amountOut)
      const totalCost = new Decimal(position.avgCostBerries)
        .mul(position.tokensBalance)
        .plus(amountIn)
      newAvgCost = newTokensBalance.isZero()
        ? new Decimal(0)
        : totalCost.div(newTokensBalance)
    } else {
      newTokensBalance = new Decimal(position.tokensBalance).minus(amountIn)
      newAvgCost = new Decimal(position.avgCostBerries) // Keep avg cost on sell
    }

    await tx.position.update({
      where: {
        userId_characterId: {
          userId,
          characterId,
        },
      },
      data: {
        tokensBalance: newTokensBalance.toNumber(),
        avgCostBerries: newAvgCost.toNumber(),
      },
    })

    // Create trade record
    const trade = await tx.trade.create({
      data: {
        userId,
        characterId,
        side,
        berriesIn: side === 'BUY' ? amountIn.toNumber() : 0,
        berriesOut: side === 'SELL' ? quote.amountOut.toNumber() : 0,
        tokensIn: side === 'SELL' ? amountIn.toNumber() : 0,
        tokensOut: side === 'BUY' ? quote.amountOut.toNumber() : 0,
        feePaid: quote.fee.toNumber(),
        priceBefore: quote.priceBefore.toNumber(),
        priceAfter: quote.priceAfter.toNumber(),
        clientNonce,
      },
    })

    // Update price candle (5-minute buckets)
    const now = new Date()
    const bucketStart = new Date(
      Math.floor(now.getTime() / (5 * 60 * 1000)) * (5 * 60 * 1000)
    )

    const existingCandle = await tx.priceCandle.findUnique({
      where: {
        characterId_bucketStart: {
          characterId,
          bucketStart,
        },
      },
    })

    const currentPrice = quote.priceAfter

    if (existingCandle) {
      await tx.priceCandle.update({
        where: {
          characterId_bucketStart: {
            characterId,
            bucketStart,
          },
        },
        data: {
          high: Decimal.max(new Decimal(existingCandle.high), currentPrice).toNumber(),
          low: Decimal.min(new Decimal(existingCandle.low), currentPrice).toNumber(),
          close: currentPrice.toNumber(),
          volumeBerries: new Decimal(existingCandle.volumeBerries)
            .plus(amountIn)
            .toNumber(),
          volumeTokens: new Decimal(existingCandle.volumeTokens)
            .plus(quote.amountOut)
            .toNumber(),
        },
      })
    } else {
      await tx.priceCandle.create({
        data: {
          characterId,
          bucketStart,
          open: currentPrice.toNumber(),
          high: currentPrice.toNumber(),
          low: currentPrice.toNumber(),
          close: currentPrice.toNumber(),
          volumeBerries: amountIn.toNumber(),
          volumeTokens: quote.amountOut.toNumber(),
        },
      })
    }

    // Get updated balances
    const updatedWallet = await tx.wallet.findUnique({
      where: { userId },
      select: { berriesBalance: true },
    })

    const updatedPosition = await tx.position.findUnique({
      where: {
        userId_characterId: {
          userId,
          characterId,
        },
      },
      select: { tokensBalance: true },
    })

    return {
      tradeId: trade.id,
      newWalletBalance: updatedWallet!.berriesBalance,
      newPositionBalance: updatedPosition!.tokensBalance,
      priceAfter: quote.priceAfter.toNumber(),
      amountOut: quote.amountOut.toNumber(),
    }
  })
}
