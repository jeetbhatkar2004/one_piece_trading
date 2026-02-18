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
  volume24h: number
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

  const totalLiquidity = characters.reduce((sum, c) => sum + c.liquidity, 0)
  const totalVolume24h = characters.reduce((sum, c) => sum + (c.volume24h ?? 0), 0)
  const activeTokens = characters.length
  const avgChange = characters.reduce((sum, c) => sum + c.change24h, 0) / characters.length

  const stats = [
    {
      label: 'Total Liquidity',
      value: `₿${totalLiquidity >= 1000000 ? (totalLiquidity / 1000000).toFixed(2) + 'M' : (totalLiquidity / 1000).toFixed(1) + 'K'}`,
      icon: DollarSign,
      color: 'text-op-red',
    },
    {
      label: '24h Volume',
      value: `₿${totalVolume24h >= 1000000 ? (totalVolume24h / 1000000).toFixed(2) + 'M' : totalVolume24h >= 1000 ? (totalVolume24h / 1000).toFixed(1) + 'K' : totalVolume24h.toFixed(2)}`,
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
    <div className="py-14">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-10 md:gap-x-16 md:gap-y-12">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.4 }}
                className="flex items-baseline gap-3"
              >
                <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${stat.color}`} strokeWidth={2} />
                <div>
                  <div className={`font-display text-2xl md:text-3xl font-bold tracking-tight ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-mono text-black/45 uppercase tracking-widest mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
