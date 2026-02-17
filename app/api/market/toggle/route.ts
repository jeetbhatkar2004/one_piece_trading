import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { closeMarket, reopenMarket } from '@/lib/market-status'
import { z } from 'zod'

const toggleSchema = z.object({
  action: z.enum(['close', 'open']),
  eventName: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin check here
    // For now, allow any logged-in user (you can restrict this later)
    // if (session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    const body = await req.json()
    const { action, eventName } = toggleSchema.parse(body)

    if (action === 'close') {
      await closeMarket(eventName || 'Market Closure')
      return NextResponse.json({ 
        success: true, 
        message: 'Market closed',
        eventName: eventName || 'Market Closure',
      })
    } else {
      await reopenMarket()
      return NextResponse.json({ 
        success: true, 
        message: 'Market reopened with price gaps',
      })
    }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error toggling market:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to toggle market' },
      { status: 500 }
    )
  }
}
