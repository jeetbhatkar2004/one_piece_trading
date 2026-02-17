import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { executeTrade } from '@/lib/trade-execution'
import { isMarketOpen } from '@/lib/market-status'
import Decimal from 'decimal.js'
import { z } from 'zod'

const closeSchema = z.object({
  slug: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const marketOpen = await isMarketOpen()
    if (!marketOpen) {
      return NextResponse.json(
        { error: 'Market is currently closed.' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { slug } = closeSchema.parse(body)

    const character = await prisma.character.findUnique({
      where: { slug },
    })

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    const position = await prisma.position.findUnique({
      where: {
        userId_characterId: {
          userId: session.user.userId,
          characterId: character.id,
        },
      },
    })

    if (!position) {
      return NextResponse.json(
        { error: 'No position to close for this character' },
        { status: 400 }
      )
    }

    const tokensBalance = new Decimal(position.tokensBalance)
    if (tokensBalance.lte(0)) {
      return NextResponse.json(
        { error: 'Position already closed' },
        { status: 400 }
      )
    }

    const avgCostBerries = new Decimal(position.avgCostBerries)

    const result = await executeTrade({
      userId: session.user.userId,
      characterId: character.id,
      side: 'SELL',
      amountIn: tokensBalance,
      slippageBps: 20, // 0.2% slippage for full close
      clientNonce: crypto.randomUUID(),
      overrideFeeBps: 0, // No fees when closing a position
    })

    const berriesReceived = new Decimal(result.amountOut)
    const totalCost = avgCostBerries.mul(tokensBalance)
    const realizedPnL = berriesReceived.minus(totalCost)

    await prisma.closedPosition.create({
      data: {
        userId: session.user.userId,
        characterId: character.id,
        tokensClosed: tokensBalance.toNumber(),
        avgCostBerries: avgCostBerries.toNumber(),
        closePrice: result.priceAfter,
        berriesReceived: berriesReceived.toNumber(),
        realizedPnL: realizedPnL.toNumber(),
      },
    })

    return NextResponse.json({
      success: true,
      berriesReceived: berriesReceived.toString(),
      realizedPnL: realizedPnL.toString(),
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Close position error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to close position' },
      { status: 400 }
    )
  }
}
