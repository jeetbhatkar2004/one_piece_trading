'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { DollarSign, Activity, Users, TrendingUp } from 'lucide-react'

interface Character {
  id: string
  slug: string
  displayName: string
  price: number
  change24h: number
  liquidity: number
}

export function QuickStats() {
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

  const totalMarketCap = characters.reduce((sum, c) => sum + c.liquidity, 0)
  const totalVolume24h = characters.reduce((sum, c) => {
    return sum + (c.liquidity * Math.abs(c.change24h) / 100)
  }, 0)
  const activeTokens = characters.length
  const avgChange = characters.reduce((sum, c) => sum + c.change24h, 0) / characters.length

  const stats = [
    {
      label: 'Total Market Cap',
      value: `₿${(totalMarketCap / 1000000).toFixed(2)}M`,
      icon: DollarSign,
      color: 'text-op-red',
    },
    {
      label: '24h Volume',
      value: `₿${(totalVolume24h / 1000).toFixed(1)}K`,
      icon: Activity,
      color: 'text-op-yellow',
    },
    {
      label: 'Active Tokens',
      value: `${activeTokens}`,
      icon: TrendingUp,
      color: 'text-op-orange',
    },
    {
      label: 'Avg 24h Change',
      value: `${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}%`,
      icon: Users,
      color: avgChange >= 0 ? 'text-green-600' : 'text-red-600',
    },
  ]

  return (
    <div className="bg-black/5 border-y-2 border-black/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-3">
                  <div className={`w-12 h-12 rounded-full bg-white border-2 border-black/20 flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className={`font-display text-3xl md:text-4xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs font-mono text-black/60 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
