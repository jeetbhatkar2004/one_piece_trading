'use client'

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'
import { useState } from 'react'

interface Candle {
  time: string
  open: string
  high: string
  low: string
  close: string
  volume: string
}

interface CandlestickChartProps {
  candles: Candle[]
  height?: number
}

type TimeRange = '1D' | '1W' | '1M' | '3M' | '6M' | 'YTD' | 'ALL'

export function CandlestickChart({ candles, height = 400 }: CandlestickChartProps) {
  const [range, setRange] = useState<TimeRange>('1D')

  if (candles.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-black/50 bg-black/5 rounded border-2 border-black/10">
        <div className="text-center">
          <div className="font-mono text-sm mb-2">No price data available yet</div>
          <div className="font-mono text-xs text-black/40">Start trading to see the chart!</div>
        </div>
      </div>
    )
  }

  // Process candles for display
  const chartData = candles
    .map((c) => {
      const open = parseFloat(c.open)
      const high = parseFloat(c.high)
      const low = parseFloat(c.low)
      const close = parseFloat(c.close)
      const volume = parseFloat(c.volume || '0')
      const isUp = close >= open
      const date = new Date(c.time)

      return {
        time: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        fullTime: date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        timestamp: date.getTime(),
        open,
        high,
        low,
        close,
        volume,
        isUp,
        // For visualization
        change: close - open,
        changePercent: ((close - open) / open) * 100,
      }
    })
    .sort((a, b) => a.timestamp - b.timestamp)

  // Determine available range
  const firstTimestamp = chartData[0].timestamp
  const lastTimestamp = chartData[chartData.length - 1].timestamp

  const now = lastTimestamp

  const rangeToMs: Record<'1D' | '1W' | '1M' | '3M' | '6M', number> = {
    '1D': 24 * 60 * 60 * 1000,
    '1W': 7 * 24 * 60 * 60 * 1000,
    '1M': 30 * 24 * 60 * 60 * 1000,
    '3M': 90 * 24 * 60 * 60 * 1000,
    '6M': 180 * 24 * 60 * 60 * 1000,
  }

  let filteredData = chartData

  if (range === 'ALL') {
    filteredData = chartData
  } else if (range === 'YTD') {
    const lastDate = new Date(now)
    const ytdStart = new Date(lastDate.getFullYear(), 0, 1).getTime()
    const from = Math.max(ytdStart, firstTimestamp)
    filteredData = chartData.filter((d) => d.timestamp >= from)
  } else {
    const ms = rangeToMs[range]
    const from = Math.max(now - ms, firstTimestamp)
    filteredData = chartData.filter((d) => d.timestamp >= from)
  }

  // Fallback if filtering removed everything
  if (filteredData.length === 0) {
    filteredData = chartData
  }

  // Calculate 24h stats
  const last24h = filteredData.slice(-24)
  const high24h = last24h.length > 0 ? Math.max(...last24h.map((d) => d.high)) : filteredData[filteredData.length - 1]?.close || 0
  const low24h = last24h.length > 0 ? Math.min(...last24h.map((d) => d.low)) : filteredData[filteredData.length - 1]?.close || 0
  const volume24h = last24h.reduce((sum, d) => sum + d.volume, 0)
  const currentPrice = filteredData[filteredData.length - 1]?.close || 0
  const price24hAgo = filteredData[0]?.close || currentPrice
  const change24h = price24hAgo > 0 ? ((currentPrice - price24hAgo) / price24hAgo) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2">
          {(['1D', '1W', '1M', '3M', '6M', 'YTD', 'ALL'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded font-mono text-xs uppercase tracking-wider transition-colors ${
                range === r
                  ? 'bg-black text-white border-2 border-black'
                  : 'bg-white text-black/70 border-2 border-black/20 hover:border-black/40'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* 24h Stats */}
        <div className="flex items-center gap-6 text-xs font-mono flex-wrap">
          <div>
            <span className="text-black/60">24h High: </span>
            <span className="text-black font-semibold">₿{high24h.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-black/60">24h Low: </span>
            <span className="text-black font-semibold">₿{low24h.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-black/60">24h Vol: </span>
            <span className="text-black font-semibold">₿{(volume24h / 1000).toFixed(1)}K</span>
          </div>
          <div>
            <span className="text-black/60">24h Change: </span>
            <span className={change24h >= 0 ? 'text-green-600' : 'text-red-600'}>
              {change24h >= 0 ? '+' : ''}
              {change24h.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Chart with OHLC visualization */}
      <div className="bg-white border-2 border-black/10 rounded p-4">
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis
              dataKey="time"
              stroke="#666"
              tick={{ fill: '#333', fontSize: 10, fontFamily: 'monospace' }}
              angle={-45}
              textAnchor="end"
              height={40}
            />
            <YAxis
              yAxisId="price"
              orientation="right"
              stroke="#666"
              tick={{ fill: '#333', fontSize: 10, fontFamily: 'monospace' }}
              label={{ value: 'Price (₿)', angle: 90, position: 'insideRight', fill: '#333', fontFamily: 'monospace', fontSize: 10 }}
            />
            <YAxis
              yAxisId="volume"
              orientation="left"
              stroke="#666"
              tick={{ fill: '#333', fontSize: 10, fontFamily: 'monospace' }}
              label={{ value: 'Volume', angle: -90, position: 'insideLeft', fill: '#333', fontFamily: 'monospace', fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                border: '2px solid #000',
                borderRadius: '4px',
                color: '#000',
                fontFamily: 'monospace',
                fontSize: '12px',
              }}
              formatter={(value: number | string, name: string) => {
                const num = typeof value === 'number' ? value : parseFloat(value)
                if (name === 'volume') {
                  return [`₿${num.toFixed(2)}`, 'Volume']
                }
                return [`₿${num.toFixed(2)}`, name.charAt(0).toUpperCase() + name.slice(1)]
              }}
              labelFormatter={(_, items) => {
                const item = items && items[0]
                const payload = item && (item.payload as any)
                return payload?.fullTime ? `Time: ${payload.fullTime}` : ''
              }}
            />
            <ReferenceLine yAxisId="price" y={currentPrice} stroke="#666" strokeDasharray="2 2" />
            
            {/* High-Low lines (invisible helpers, could be extended to full candlesticks later) */}
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="high"
              stroke="transparent"
              strokeWidth={0}
              dot={false}
            />
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="low"
              stroke="transparent"
              strokeWidth={0}
              dot={false}
            />
            
            {/* Close price line (main price line) */}
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="close"
              stroke="#000"
              strokeWidth={2}
              dot={false}
              name="Close"
            />
            
            {/* Volume bars with color coding */}
            <Bar yAxisId="volume" dataKey="volume" fill="rgba(0, 0, 0, 0.15)" name="Volume">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.isUp ? 'rgba(22, 163, 74, 0.2)' : 'rgba(220, 38, 38, 0.2)'} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-black"></div>
            <span className="text-black/60">Close Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-green-500/20"></div>
            <span className="text-black/60">Up Volume</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-red-500/20"></div>
            <span className="text-black/60">Down Volume</span>
          </div>
        </div>
      </div>
    </div>
  )
}
