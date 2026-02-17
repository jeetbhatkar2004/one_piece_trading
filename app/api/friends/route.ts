import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all friendships (pending, accepted)
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: session.user.userId },
          { receiverId: session.user.userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Separate into different categories
    const friends = friendships
      .filter((f) => f.status === 'ACCEPTED')
      .map((f) => ({
        id: f.id,
        user: f.senderId === session.user.userId ? f.receiver : f.sender,
        isSender: f.senderId === session.user.userId,
      }))

    const pendingSent = friendships
      .filter((f) => f.senderId === session.user.userId && f.status === 'PENDING')
      .map((f) => ({
        id: f.id,
        user: f.receiver,
      }))

    const pendingReceived = friendships
      .filter((f) => f.receiverId === session.user.userId && f.status === 'PENDING')
      .map((f) => ({
        id: f.id,
        user: f.sender,
      }))

    return NextResponse.json({
      friends,
      pendingSent,
      pendingReceived,
    })
  } catch (error) {
    console.error('Get friends error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch friends' },
      { status: 500 }
    )
  }
}
