import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { quoteBuy, quoteBuyForTokensOut, quoteSell, applySlippage } from '@/lib/amm'
import { quoteSchema } from '@/lib/validation'
import Decimal from 'decimal.js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { slug, side, amountIn, amountInType, slippageBps } = quoteSchema.parse(body)

    const character = await prisma.character.findUnique({
      where: { slug },
      include: { pool: true },
    })

    if (!character || !character.pool) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      )
    }

    const amountInDecimal = new Decimal(amountIn)
    const reserveBerries = new Decimal(character.pool.reserveBerries)
    const reserveTokens = new Decimal(character.pool.reserveTokens)
    const feeBps = character.pool.feeBps

    let quote
    let berriesInForTrade: string | undefined
    if (side === 'BUY') {
      if (amountInType === 'tokens') {
        const result = quoteBuyForTokensOut(reserveBerries, reserveTokens, amountInDecimal, feeBps)
        quote = result
        berriesInForTrade = result.berriesIn.toString()
      } else {
        quote = quoteBuy(reserveBerries, reserveTokens, amountInDecimal, feeBps)
      }
    } else {
      quote = quoteSell(reserveBerries, reserveTokens, amountInDecimal, feeBps)
    }

    const minOut = applySlippage(quote.amountOut, slippageBps)

    const response: Record<string, string> = {
      amountOut: quote.amountOut.toString(),
      fee: quote.fee.toString(),
      priceBefore: quote.priceBefore.toString(),
      priceAfter: quote.priceAfter.toString(),
      minOut: minOut.toString(),
    }
    if (berriesInForTrade) {
      response.berriesIn = berriesInForTrade
    }

    return NextResponse.json(response)
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

    console.error('Quote error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate quote' },
      { status: 500 }
    )
  }
}
