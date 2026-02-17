'use client'

import { useQuery } from '@tanstack/react-query'
import { CharacterAvatar } from './CharacterAvatar'
import { TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Character {
  id: string
  slug: string
  displayName: string
  price: number
  change24h: number
  liquidity: number
}

export function VolumeLeaderboard() {
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

  // Sort by liquidity (trading volume proxy)
  const topVolume = [...characters]
    .sort((a, b) => b.liquidity - a.liquidity)
    .slice(0, 10)

  return (
    <div className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="w-5 h-5 text-black" />
        <h3 className="font-display text-2xl text-black">VOLUME LEADERS</h3>
      </div>
      <div className="space-y-2">
        {topVolume.map((char, idx) => (
          <Link key={char.id} href={`/c/${char.slug}`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ x: 5, backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
              className="flex items-center justify-between p-3 bg-black/5 border border-black/10 rounded hover:border-black/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center bg-black/10 rounded font-mono text-xs font-bold text-black">
                  {idx + 1}
                </div>
                <CharacterAvatar slug={char.slug} displayName={char.displayName} size="sm" />
                <div>
                  <div className="font-mono text-sm font-semibold text-black">{char.displayName}</div>
                  <div className="font-mono text-xs text-black/60">₿{char.price.toFixed(2)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-semibold text-black">
                  ₿{(char.liquidity / 1000).toFixed(1)}K
                </div>
                <div className={`font-mono text-xs ${char.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {char.change24h >= 0 ? '+' : ''}
                  {char.change24h.toFixed(2)}%
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}
