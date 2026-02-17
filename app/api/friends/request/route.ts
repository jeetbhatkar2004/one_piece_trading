import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { friendRequestSchema } from '@/lib/validation'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { username } = friendRequestSchema.parse(body)

    // Can't send request to yourself
    if (username === session.user.username) {
      return NextResponse.json(
        { error: 'Cannot send friend request to yourself' },
        { status: 400 }
      )
    }

    // Find the user to send request to
    const receiver = await prisma.user.findUnique({
      where: { username },
    })

    if (!receiver) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if friendship already exists
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: session.user.userId, receiverId: receiver.id },
          { senderId: receiver.id, receiverId: session.user.userId },
        ],
      },
    })

    if (existingFriendship) {
      if (existingFriendship.status === 'ACCEPTED') {
        return NextResponse.json(
          { error: 'Already friends' },
          { status: 400 }
        )
      }
      if (existingFriendship.status === 'PENDING') {
        return NextResponse.json(
          { error: 'Friend request already pending' },
          { status: 400 }
        )
      }
    }

    // Create friend request
    const friendship = await prisma.friendship.create({
      data: {
        senderId: session.user.userId,
        receiverId: receiver.id,
        status: 'PENDING',
      },
      include: {
        receiver: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    return NextResponse.json({
      id: friendship.id,
      receiver: friendship.receiver,
      status: friendship.status,
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Friend request error:', error)
    return NextResponse.json(
      { error: 'Failed to send friend request' },
      { status: 500 }
    )
  }
}
