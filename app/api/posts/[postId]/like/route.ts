import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const postId = params.postId

    // Check if already liked
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: session.user.userId,
        },
      },
    })

    if (existingLike) {
      // Unlike
      await prisma.$transaction([
        prisma.postLike.delete({
          where: { id: existingLike.id },
        }),
        prisma.post.update({
          where: { id: postId },
          data: {
            likesCount: { decrement: 1 },
          },
        }),
      ])

      return NextResponse.json({ liked: false })
    } else {
      // Like
      await prisma.$transaction([
        prisma.postLike.create({
          data: {
            postId,
            userId: session.user.userId,
          },
        }),
        prisma.post.update({
          where: { id: postId },
          data: {
            likesCount: { increment: 1 },
          },
        }),
      ])

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Like post error:', error)
    return NextResponse.json(
      { error: 'Failed to like post' },
      { status: 500 }
    )
  }
}
