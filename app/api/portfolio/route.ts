import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSpotPrice } from '@/lib/amm'
import Decimal from 'decimal.js'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.userId },
    })

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    const positions = await prisma.position.findMany({
      where: {
        userId: session.user.userId,
        tokensBalance: { gt: 0 },
      },
      include: {
        character: {
          include: {
            pool: true,
          },
        },
      },
    })

    const positionsWithValue = await Promise.all(
      positions.map(async (pos: typeof positions[0]) => {
        if (!pos.character.pool) {
          return null
        }

        const currentPrice = getSpotPrice(
          new Decimal(pos.character.pool.reserveBerries),
          new Decimal(pos.character.pool.reserveTokens)
        )

        const tokensBalance = new Decimal(pos.tokensBalance)
        const marketValue = tokensBalance.mul(currentPrice)
        const avgCost = new Decimal(pos.avgCostBerries)
        const totalCost = tokensBalance.mul(avgCost)
        const unrealizedPL = marketValue.minus(totalCost)
        const unrealizedPLPercent = avgCost.isZero()
          ? new Decimal(0)
          : unrealizedPL.div(totalCost).mul(100)

        return {
          characterId: pos.character.id,
          characterSlug: pos.character.slug,
          characterName: pos.character.displayName,
          tokensBalance: tokensBalance.toString(),
          avgCostBerries: avgCost.toString(),
          currentPrice: currentPrice.toString(),
          marketValue: marketValue.toString(),
          unrealizedPL: unrealizedPL.toString(),
          unrealizedPLPercent: unrealizedPLPercent.toString(),
        }
      })
    )

    // Calculate total net worth
    const berriesBalance = new Decimal(wallet.berriesBalance)
    const positionsValue = positionsWithValue.reduce(
      (sum, pos) => sum.plus(new Decimal(pos?.marketValue || 0)),
      new Decimal(0)
    )
    const netWorth = berriesBalance.plus(positionsValue)

    return NextResponse.json({
      berriesBalance: berriesBalance.toString(),
      positions: positionsWithValue.filter(Boolean),
      netWorth: netWorth.toString(),
    })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}
