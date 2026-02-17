import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSpotPrice } from '@/lib/amm'
import Decimal from 'decimal.js'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const seasonId = searchParams.get('season') || 'default-season'

    // Get all users with wallets
    const users = await prisma.user.findMany({
      include: {
        wallet: true,
        positions: {
          include: {
            character: {
              include: {
                pool: true,
              },
            },
          },
        },
      },
    })

    // Calculate net worth for each user
    const leaderboard = await Promise.all(
      users.map(async (user) => {
        if (!user.wallet) {
          return null
        }

        let netWorth = new Decimal(user.wallet.berriesBalance)

        for (const position of user.positions) {
          if (position.tokensBalance > 0 && position.character.pool) {
            const currentPrice = getSpotPrice(
              new Decimal(position.character.pool.reserveBerries),
              new Decimal(position.character.pool.reserveTokens)
            )
            netWorth = netWorth.plus(
              new Decimal(position.tokensBalance).mul(currentPrice)
            )
          }
        }

        return {
          userId: user.id,
          username: user.username,
          netWorth: netWorth.toNumber(),
        }
      })
    )

    // Sort by net worth descending
    const sorted = leaderboard
      .filter(Boolean)
      .sort((a, b) => b!.netWorth - a!.netWorth)
      .map((entry, index) => ({
        ...entry!,
        rank: index + 1,
      }))

    return NextResponse.json({
      seasonId,
      leaderboard: sorted.slice(0, 100), // Top 100
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}
