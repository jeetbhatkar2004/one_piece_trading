'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Coins } from 'lucide-react'
import { MangaPanel } from './MangaPanel'

interface Character {
  id: string
  slug: string
  displayName: string
  price: number
  change24h: number
  liquidity: number
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
  hover: {
    scale: 1.02,
    y: -2,
    transition: {
      type: 'spring',
      stiffness: 300,
    },
  },
}

export function StatsCards() {
  const { data: characters, isLoading } = useQuery<Character[]>({
    queryKey: ['characters'],
    queryFn: async () => {
      const res = await fetch('/api/characters')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    refetchInterval: 5000,
  })

  if (isLoading || !characters) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-black/5 border border-black/20 rounded-lg p-6 animate-pulse"
          >
            <div className="h-4 bg-black/10 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-black/10 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  const totalLiquidity = characters.reduce((sum, c) => sum + c.liquidity, 0)
  const avgPrice = characters.reduce((sum, c) => sum + c.price, 0) / characters.length
  const topGainer = [...characters].sort((a, b) => b.change24h - a.change24h)[0]
  const topLoser = [...characters].sort((a, b) => a.change24h - b.change24h)[0]

  const stats = [
    {
      label: 'Total Liquidity',
      value: `₿${(totalLiquidity / 1000).toFixed(1)}K`,
      icon: DollarSign,
      accent: 'op-red',
      change: null, // No change value
    },
    {
      label: 'Average Price',
      value: `₿${avgPrice.toFixed(2)}`,
      icon: Coins,
      accent: 'op-orange',
      change: null, // No change value
    },
    {
      label: 'Top Gainer (24h)',
      value: topGainer?.displayName || 'N/A',
      change: topGainer ? `+${topGainer.change24h.toFixed(2)}%` : null,
      icon: TrendingUp,
      accent: 'op-yellow',
    },
    {
      label: 'Top Loser (24h)',
      value: topLoser?.displayName || 'N/A',
      change: topLoser ? `${topLoser.change24h.toFixed(2)}%` : null,
      icon: TrendingDown,
      accent: 'op-red',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <MangaPanel key={index} delay={index * 0.1}>
            <motion.div
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-white border-2 border-black/20 rounded-lg p-6 hover:border-op-red/50 transition-colors relative overflow-hidden group h-full flex flex-col"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.accent} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`}></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-${stat.accent} bg-opacity-10 border-2 border-${stat.accent} border-opacity-30`}>
                    <Icon className={`w-6 h-6 text-${stat.accent}`} />
                  </div>
                </div>
                <div className="text-black/60 text-xs font-mono uppercase tracking-wider mb-2">{stat.label}</div>
                <div className="text-black text-2xl font-display mb-1">{stat.value}</div>
                <div className="mt-auto">
                  {stat.change ? (
                    <motion.div
                      className={`text-sm font-mono ${
                        stat.change.startsWith('+') ? 'text-op-yellow' : 'text-op-red'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {stat.change}
                    </motion.div>
                  ) : (
                    <div className="text-sm font-mono text-transparent">—</div>
                  )}
                </div>
              </div>
            </motion.div>
          </MangaPanel>
        )
      })}
    </div>
  )
}
