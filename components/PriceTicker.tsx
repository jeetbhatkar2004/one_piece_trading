'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { CharacterAvatar } from './CharacterAvatar'
import Link from 'next/link'

interface Character {
  id: string
  slug: string
  displayName: string
  price: number
  change24h: number
  liquidity: number
}

export function PriceTicker() {
  const { data: characters } = useQuery<Character[]>({
    queryKey: ['characters'],
    queryFn: async () => {
      const res = await fetch('/api/characters')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    refetchInterval: 3000, // Update every 3 seconds
  })

  if (!characters || characters.length === 0) {
    return null
  }

  // Get top movers
  const topGainers = [...characters]
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 5)

  const topLosers = [...characters]
    .sort((a, b) => a.change24h - b.change24h)
    .slice(0, 5)

  return (
    <div className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm mb-6">
      <h2 className="font-display text-3xl text-black mb-4">MARKET TICKER</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div>
          <div className="text-xs font-mono text-green-600 uppercase tracking-wider mb-3">TOP GAINERS</div>
          <div className="space-y-2">
            {topGainers.map((char, idx) => (
              <Link key={char.id} href={`/c/${char.slug}`}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ x: 5, backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
                  className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded hover:border-green-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <CharacterAvatar slug={char.slug} displayName={char.displayName} size="sm" />
                    <div>
                      <div className="font-mono text-sm font-semibold text-black">{char.displayName}</div>
                      <div className="font-mono text-xs text-black/60">₿{char.price.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold text-green-600">
                      +{char.change24h.toFixed(2)}%
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div>
          <div className="text-xs font-mono text-red-600 uppercase tracking-wider mb-3">TOP LOSERS</div>
          <div className="space-y-2">
            {topLosers.map((char, idx) => (
              <Link key={char.id} href={`/c/${char.slug}`}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ x: -5, backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded hover:border-red-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <CharacterAvatar slug={char.slug} displayName={char.displayName} size="sm" />
                    <div>
                      <div className="font-mono text-sm font-semibold text-black">{char.displayName}</div>
                      <div className="font-mono text-xs text-black/60">₿{char.price.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold text-red-600">
                      {char.change24h.toFixed(2)}%
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
