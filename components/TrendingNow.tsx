'use client'

import { useQuery } from '@tanstack/react-query'
import { CharacterAvatar } from './CharacterAvatar'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'

interface Character {
  id: string
  slug: string
  displayName: string
  price: number
  change24h: number
  liquidity: number
}

export function TrendingNow() {
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

  // Get top gainers and losers
  const topGainers = [...characters]
    .filter(c => c.change24h > 0)
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 3)

  const topLosers = [...characters]
    .filter(c => c.change24h < 0)
    .sort((a, b) => a.change24h - b.change24h)
    .slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-5xl md:text-6xl text-black mb-4">TRENDING NOW</h2>
        <div className="accent-line w-64 mx-auto"></div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Gainers */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white border-2 border-green-500/20 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="font-display text-3xl text-black">TOP GAINERS</h3>
          </div>
          <div className="space-y-3">
            {topGainers.map((char, idx) => (
              <Link key={char.id} href={`/c/${char.slug}`}>
                <motion.div
                  whileHover={{ x: 5, backgroundColor: 'rgba(22, 163, 74, 0.05)' }}
                  className="flex items-center justify-between p-3 bg-green-500/5 border border-green-500/20 rounded hover:border-green-500/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-green-500/20 rounded font-mono text-xs font-bold text-green-700">
                      #{idx + 1}
                    </div>
                    <CharacterAvatar slug={char.slug} displayName={char.displayName} size="sm" />
                    <div>
                      <div className="font-mono text-sm font-semibold text-black">{char.displayName}</div>
                      <div className="font-mono text-xs text-black/60">₿{char.price.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-green-600">
                      +{char.change24h.toFixed(2)}%
                    </span>
                    <ArrowRight className="w-4 h-4 text-black/40" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Top Losers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white border-2 border-red-500/20 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingDown className="w-6 h-6 text-red-600" />
            <h3 className="font-display text-3xl text-black">TOP LOSERS</h3>
          </div>
          <div className="space-y-3">
            {topLosers.map((char, idx) => (
              <Link key={char.id} href={`/c/${char.slug}`}>
                <motion.div
                  whileHover={{ x: 5, backgroundColor: 'rgba(220, 38, 38, 0.05)' }}
                  className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded hover:border-red-500/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-red-500/20 rounded font-mono text-xs font-bold text-red-700">
                      #{idx + 1}
                    </div>
                    <CharacterAvatar slug={char.slug} displayName={char.displayName} size="sm" />
                    <div>
                      <div className="font-mono text-sm font-semibold text-black">{char.displayName}</div>
                      <div className="font-mono text-xs text-black/60">₿{char.price.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-red-600">
                      {char.change24h.toFixed(2)}%
                    </span>
                    <ArrowRight className="w-4 h-4 text-black/40" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
