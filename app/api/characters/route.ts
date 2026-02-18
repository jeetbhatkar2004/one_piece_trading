import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSpotPrice } from '@/lib/amm'
import Decimal from 'decimal.js'

export async function GET() {
  try {
    const characters = await prisma.character.findMany({
      where: { isActive: true },
      include: {
        pool: true,
      },
      orderBy: { displayName: 'asc' },
    })

    const now = new Date()
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const result = await Promise.all(
      characters.map(async (char: typeof characters[0]) => {
        if (!char.pool) {
          return null
        }

        const currentPrice = getSpotPrice(
          new Decimal(char.pool.reserveBerries),
          new Decimal(char.pool.reserveTokens)
        )

        // Get price 24h ago from candles
        const candles24h = await prisma.priceCandle.findMany({
          where: {
            characterId: char.id,
            bucketStart: { gte: twentyFourHoursAgo },
          },
          select: { volumeBerries: true },
        })

        const volume24h = candles24h.reduce(
          (sum, c) => sum.plus(new Decimal(c.volumeBerries)),
          new Decimal(0)
        )

        const candle24hAgo = await prisma.priceCandle.findFirst({
          where: {
            characterId: char.id,
            bucketStart: {
              lte: twentyFourHoursAgo,
            },
          },
          orderBy: { bucketStart: 'desc' },
        })

        const price24hAgo = candle24hAgo
          ? new Decimal(candle24hAgo.close)
          : currentPrice

        const change24h = price24hAgo.isZero()
          ? new Decimal(0)
          : currentPrice.minus(price24hAgo).div(price24hAgo).mul(100)

        const liquidity = new Decimal(char.pool.reserveBerries).mul(2) // Total value locked (TVL)

        return {
          id: char.id,
          slug: char.slug,
          displayName: char.displayName,
          price: currentPrice.toNumber(),
          change24h: change24h.toNumber(),
          liquidity: liquidity.toNumber(),
          volume24h: volume24h.toNumber(),
        }
      })
    )

    return NextResponse.json(result.filter(Boolean))
  } catch (error) {
    console.error('Error fetching characters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    )
  }
}
