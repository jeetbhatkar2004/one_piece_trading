'use client'

import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react'

interface MarketStatsProps {
  price: number
  change24h: number
  high24h: number
  low24h: number
  volume24h: number
  liquidity: number
}

export function MarketStats({
  price,
  change24h,
  high24h,
  low24h,
  volume24h,
  liquidity,
}: MarketStatsProps) {
  const stats = [
    {
      label: '24h High',
      value: `₿${high24h.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      label: '24h Low',
      value: `₿${low24h.toFixed(2)}`,
      icon: TrendingDown,
      color: 'text-red-600',
    },
    {
      label: '24h Volume',
      value: `₿${(volume24h / 1000).toFixed(1)}K`,
      icon: Activity,
      color: 'text-black',
    },
    {
      label: 'Liquidity',
      value: `₿${(liquidity / 1000).toFixed(1)}K`,
      icon: BarChart3,
      color: 'text-black',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <div
            key={idx}
            className="bg-white border-2 border-black/20 rounded-lg p-4 hover:border-black/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs font-mono text-black/60 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <div className={`text-lg font-mono font-semibold ${stat.color}`}>
              {stat.value}
            </div>
          </div>
        )
      })}
    </div>
  )
}
