import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { postSchema } from '@/lib/validation'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    const session = await getServerSession(authOptions)
    const currentUserId = session?.user?.userId

    return NextResponse.json({
      posts: posts.map((post) => ({
        id: post.id,
        username: post.user.username,
        content: post.content,
        likesCount: post.likesCount,
        isLiked: currentUserId
          ? post.likes.some((like) => like.userId === currentUserId)
          : false,
        createdAt: post.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { content } = postSchema.parse(body)

    const post = await prisma.post.create({
      data: {
        userId: session.user.userId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    return NextResponse.json({
      id: post.id,
      username: post.user.username,
      content: post.content,
      likesCount: post.likesCount,
      isLiked: false,
      createdAt: post.createdAt.toISOString(),
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create post error:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
