'use client'

import { useQuery } from '@tanstack/react-query'
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

interface Character {
  id: string
  slug: string
  displayName: string
  price: number
  change24h: number
  liquidity: number
  volume24h?: number
}

export function MarketSummary() {
  const { data: characters } = useQuery<Character[]>({
    queryKey: ['characters'],
    queryFn: async () => {
      const res = await fetch('/api/characters')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    refetchInterval: 5000,
  })

  if (!characters || characters.length === 0) {
    return null
  }

  // Real market metrics from API
  const totalLiquidity = characters.reduce((sum, c) => sum + c.liquidity, 0)
  const totalVolume24h = characters.reduce((sum, c) => sum + (c.volume24h ?? 0), 0)

  const gainers = characters.filter((c) => c.change24h > 0).length
  const losers = characters.filter((c) => c.change24h < 0).length
  const unchanged = characters.length - gainers - losers

  const avgChange = characters.reduce((sum, c) => sum + c.change24h, 0) / characters.length
  const marketSentiment = avgChange >= 0 ? 'BULLISH' : 'BEARISH'

  const stats = [
    {
      label: 'Total Liquidity',
      value: `₿${totalLiquidity >= 1000000 ? (totalLiquidity / 1000000).toFixed(2) + 'M' : (totalLiquidity / 1000).toFixed(1) + 'K'}`,
      icon: DollarSign,
      color: 'text-black',
    },
    {
      label: '24h Volume',
      value: `₿${totalVolume24h >= 1000000 ? (totalVolume24h / 1000000).toFixed(2) + 'M' : totalVolume24h >= 1000 ? (totalVolume24h / 1000).toFixed(1) + 'K' : totalVolume24h.toFixed(2)}`,
      icon: Activity,
      color: 'text-black',
    },
    {
      label: 'Market Sentiment',
      value: marketSentiment,
      icon: avgChange >= 0 ? TrendingUp : TrendingDown,
      color: avgChange >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      label: 'Active Tokens',
      value: `${characters.length}`,
      icon: BarChart3,
      color: 'text-black',
    },
  ]

  return (
    <div className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm">
      <h2 className="font-display text-3xl text-black mb-6">MARKET SUMMARY</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-black/5 border border-black/10 rounded-lg p-4 hover:border-black/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-xs font-mono text-black/60 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <div className={`text-xl font-mono font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Market Breadth */}
      <div className="pt-6 border-t border-black/20">
        <div className="text-xs font-mono text-black/60 uppercase tracking-wider mb-3">MARKET BREADTH</div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="font-mono text-sm text-black">
              <span className="text-black/60">Gainers: </span>
              <span className="font-semibold text-green-600">{gainers}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="font-mono text-sm text-black">
              <span className="text-black/60">Losers: </span>
              <span className="font-semibold text-red-600">{losers}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span className="font-mono text-sm text-black">
              <span className="text-black/60">Unchanged: </span>
              <span className="font-semibold">{unchanged}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
