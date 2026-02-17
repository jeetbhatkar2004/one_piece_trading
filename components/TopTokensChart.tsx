'use client'

import { useQuery } from '@tanstack/react-query'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { CharacterAvatar } from './CharacterAvatar'
import { getCharacterAccentColor } from '@/lib/character-descriptions'
import { motion } from 'framer-motion'

interface Character {
  id: string
  slug: string
  displayName: string
  price: number
  change24h: number
  liquidity: number
}

interface CandleData {
  time: string
  [key: string]: string | number | null
}

export function TopTokensChart() {
  const { data: characters, isLoading } = useQuery<Character[]>({
    queryKey: ['characters'],
    queryFn: async () => {
      const res = await fetch('/api/characters')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    refetchInterval: 5000,
  })

  const { data: chartData, isLoading: chartLoading } = useQuery<CandleData[]>({
    queryKey: ['topTokensChart', characters],
    queryFn: async () => {
      if (!characters || characters.length === 0) return []

      // Get top 10 by liquidity (most popular)
      const top10 = [...characters]
        .sort((a, b) => b.liquidity - a.liquidity)
        .slice(0, 10)

      // Fetch candle data for each character
      const promises = top10.map(async (char) => {
        try {
          const res = await fetch(`/api/characters/${char.slug}`)
          if (!res.ok) return null
          const data = await res.json()
          return {
            character: char,
            candles: data.candles || [],
          }
        } catch {
          return null
        }
      })

      const results = await Promise.all(promises)
      const validResults = results.filter(Boolean) as Array<{
        character: Character
        candles: Array<{ time: string; close: string }>
      }>

      // Group candles by time bucket and create chart data
      const timeMap = new Map<string, Record<string, number | string>>()

      validResults.forEach(({ character, candles }) => {
        candles.forEach((candle) => {
          const time = new Date(candle.time).toISOString().split('T')[0]
          if (!timeMap.has(time)) {
            timeMap.set(time, { time })
          }
          const data = timeMap.get(time)!
          data[character.slug] = parseFloat(candle.close)
        })
      })

      // Convert to array and fill missing values
      const chartDataArray: CandleData[] = []
      const sortedTimes = Array.from(timeMap.keys()).sort()

      sortedTimes.forEach((time) => {
        const entry: CandleData = { time }
        validResults.forEach(({ character }) => {
          const data = timeMap.get(time)
          const value = data?.[character.slug]
          entry[character.slug] = value !== undefined ? value : null
        })
        chartDataArray.push(entry)
      })

      return chartDataArray.slice(-30) // Last 30 data points
    },
    enabled: !!characters && characters.length > 0,
    refetchInterval: 10000,
  })

  if (isLoading || chartLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border-2 border-black/20 rounded-lg p-6 h-96 flex items-center justify-center shadow-sm"
      >
        <div className="text-black/60 text-lg font-mono">Loading chart data...</div>
      </motion.div>
    )
  }

  if (!characters || characters.length === 0 || !chartData || chartData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border-2 border-black/20 rounded-lg p-6 h-96 flex items-center justify-center shadow-sm"
      >
        <div className="text-black/60 text-lg font-mono">No chart data available</div>
      </motion.div>
    )
  }

  // Get top 10 characters for legend
  const top10 = [...characters]
    .sort((a, b) => b.liquidity - a.liquidity)
    .slice(0, 10)

  // Use character accent colors for chart lines and legend

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm"
    >
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <h2 className="font-display text-4xl text-black">TOP 10</h2>
          <div className="accent-line flex-1"></div>
        </div>
        <p className="text-black/60 text-sm font-mono uppercase tracking-wider">
          Most Popular Character Tokens
        </p>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis
            dataKey="time"
            stroke="#666"
            tick={{ fill: '#333', fontSize: 11, fontFamily: 'monospace' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="#666"
            tick={{ fill: '#333', fontSize: 11, fontFamily: 'monospace' }}
            label={{ value: 'Price (Berries)', angle: -90, position: 'insideLeft', fill: '#333', fontFamily: 'monospace', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid #dc2626',
              borderRadius: '4px',
              color: '#000',
              fontFamily: 'monospace',
            }}
          />
          <Legend
            wrapperStyle={{ display: 'none' }}
          />
          {top10.map((char) => (
            <Line
              key={char.id}
              type="monotone"
              dataKey={char.slug}
              stroke={getCharacterAccentColor(char.slug)}
              strokeWidth={2}
              dot={false}
              name={char.displayName}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {/* Custom Legend with Avatars */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 pt-6 border-t border-black/20"
      >
        <div className="flex flex-wrap gap-3 justify-center">
          {top10.map((char, index) => (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex items-center gap-2 bg-black/5 px-3 py-2 rounded border border-black/20 hover:border-op-red/50 transition-colors cursor-pointer"
              style={{ borderLeftWidth: '4px', borderLeftColor: getCharacterAccentColor(char.slug) }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getCharacterAccentColor(char.slug) }}
              ></div>
              <CharacterAvatar slug={char.slug} displayName={char.displayName} size="sm" />
              <span className="text-black text-xs font-mono">{char.displayName}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
