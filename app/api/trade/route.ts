import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { executeTrade } from '@/lib/trade-execution'
import { tradeSchema } from '@/lib/validation'
import { isMarketOpen } from '@/lib/market-status'
import Decimal from 'decimal.js'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if market is open
    const marketOpen = await isMarketOpen()
    if (!marketOpen) {
      return NextResponse.json(
        { error: 'Market is currently closed. Trading will resume after the Grand Line event.' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { slug, side, amountIn, slippageBps, clientNonce } = tradeSchema.parse(body)

    const character = await prisma.character.findUnique({
      where: { slug },
    })

    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      )
    }

    const amountInDecimal = new Decimal(amountIn)

    if (amountInDecimal.lte(0)) {
      return NextResponse.json(
        { error: 'Amount must be positive' },
        { status: 400 }
      )
    }

    // Max trade size check (optional safety)
    if (amountInDecimal.gt(1000000)) {
      return NextResponse.json(
        { error: 'Trade size too large' },
        { status: 400 }
      )
    }

    const result = await executeTrade({
      userId: session.user.userId,
      characterId: character.id,
      side: side as any,
      amountIn: amountInDecimal,
      slippageBps,
      clientNonce,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    if (error.message) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.error('Trade error:', error)
    return NextResponse.json(
      { error: 'Trade execution failed' },
      { status: 500 }
    )
  }
}
