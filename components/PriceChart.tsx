'use client'

import { CandlestickChart } from './CandlestickChart'

interface Candle {
  time: string
  open: string
  high: string
  low: string
  close: string
  volume: string
}

export function PriceChart({ candles }: { candles: Candle[] }) {
  return <CandlestickChart candles={candles} height={400} />
}
