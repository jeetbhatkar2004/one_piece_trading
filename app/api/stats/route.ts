import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Decimal from 'decimal.js'

export async function GET() {
  try {
    const now = new Date()
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    // Total 24h volume from all candles
    const candles = await prisma.priceCandle.findMany({
      where: { bucketStart: { gte: twentyFourHoursAgo } },
      select: { volumeBerries: true },
    })
    const totalVolume24h = candles.reduce(
      (sum, c) => sum.plus(new Decimal(c.volumeBerries)),
      new Decimal(0)
    )

    // Unique traders and trade count in last 24h
    const trades = await prisma.trade.findMany({
      where: { createdAt: { gte: twentyFourHoursAgo } },
      select: { userId: true },
    })
    const uniqueTraders = new Set(trades.map((t) => t.userId)).size
    const tradesCount = trades.length

    return NextResponse.json({
      totalVolume24h: totalVolume24h.toString(),
      activeTraders: uniqueTraders,
      trades24h: tradesCount,
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { totalVolume24h: '0', activeTraders: 0, trades24h: 0 },
      { status: 200 }
    )
  }
}
