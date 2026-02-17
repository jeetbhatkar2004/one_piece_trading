import { NextResponse } from 'next/server'
import { getMarketStatus } from '@/lib/market-status'

export async function GET() {
  try {
    const status = await getMarketStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error('Error fetching market status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market status' },
      { status: 500 }
    )
  }
}
