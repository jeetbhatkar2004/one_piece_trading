import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { respondFriendRequestSchema } from '@/lib/validation'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { requestId, accept } = respondFriendRequestSchema.parse(body)

    // Find the friend request
    const friendship = await prisma.friendship.findUnique({
      where: { id: requestId },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    if (!friendship) {
      return NextResponse.json(
        { error: 'Friend request not found' },
        { status: 404 }
      )
    }

    // Check if user is the receiver
    if (friendship.receiverId !== session.user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    if (friendship.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Friend request already processed' },
        { status: 400 }
      )
    }

    // Update friendship status
    const updated = await prisma.friendship.update({
      where: { id: requestId },
      data: {
        status: accept ? 'ACCEPTED' : 'REJECTED',
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    return NextResponse.json({
      id: updated.id,
      sender: updated.sender,
      status: updated.status,
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Friend request response error:', error)
    return NextResponse.json(
      { error: 'Failed to process friend request' },
      { status: 500 }
    )
  }
}
