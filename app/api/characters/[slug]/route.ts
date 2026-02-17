import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSpotPrice } from '@/lib/amm'
import Decimal from 'decimal.js'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const character = await prisma.character.findUnique({
      where: { slug: params.slug },
      include: {
        pool: true,
      },
    })

    if (!character || !character.pool) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      )
    }

    const currentPrice = getSpotPrice(
      new Decimal(character.pool.reserveBerries),
      new Decimal(character.pool.reserveTokens)
    )

    // Get candles for chart (last 7 days, 1 hour buckets)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const candles = await prisma.priceCandle.findMany({
      where: {
        characterId: character.id,
        bucketStart: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: { bucketStart: 'asc' },
    })

    // Get recent trades
    const recentTrades = await prisma.trade.findMany({
      where: { characterId: character.id },
      include: {
        user: {
          select: { username: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      id: character.id,
      slug: character.slug,
      displayName: character.displayName,
      price: currentPrice.toNumber(),
      pool: {
        reserveBerries: character.pool.reserveBerries.toString(),
        reserveTokens: character.pool.reserveTokens.toString(),
        feeBps: character.pool.feeBps,
      },
      candles: candles.map((c: typeof candles[0]) => ({
        time: c.bucketStart.toISOString(),
        open: c.open.toString(),
        high: c.high.toString(),
        low: c.low.toString(),
        close: c.close.toString(),
        volume: c.volumeBerries.toString(),
      })),
      recentTrades: recentTrades.map((t: typeof recentTrades[0]) => ({
        id: t.id,
        username: t.user.username,
        side: t.side,
        tokensOut: t.tokensOut.toString(),
        berriesOut: t.berriesOut.toString(),
        price: t.priceAfter.toString(),
        timestamp: t.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Error fetching character:', error)
    return NextResponse.json(
      { error: 'Failed to fetch character' },
      { status: 500 }
    )
  }
}
