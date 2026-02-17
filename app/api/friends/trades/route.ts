import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Decimal } from 'decimal.js'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all accepted friendships
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: session.user.userId, status: 'ACCEPTED' },
          { receiverId: session.user.userId, status: 'ACCEPTED' },
        ],
      },
    })

    const friendIds = friendships.map((f) =>
      f.senderId === session.user.userId ? f.receiverId : f.senderId
    )

    if (friendIds.length === 0) {
      return NextResponse.json({ trades: [] })
    }

    // Get recent trades from friends
    const trades = await prisma.trade.findMany({
      where: {
        userId: { in: friendIds },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        character: {
          select: {
            id: true,
            slug: true,
            displayName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    })

    return NextResponse.json({
      trades: trades.map((t) => ({
        id: t.id,
        username: t.user.username,
        character: {
          slug: t.character.slug,
          displayName: t.character.displayName,
        },
        side: t.side,
        tokensOut: t.tokensOut.toString(),
        berriesOut: t.berriesOut.toString(),
        price: t.priceAfter.toString(),
        timestamp: t.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Get friends trades error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch friends trades' },
      { status: 500 }
    )
  }
}
