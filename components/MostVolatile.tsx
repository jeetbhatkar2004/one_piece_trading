'use client'

import { useQuery } from '@tanstack/react-query'
import { CharacterAvatar } from './CharacterAvatar'
import { getCharacterAccentColor } from '@/lib/character-descriptions'
import { Zap } from 'lucide-react'
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

export function MostVolatile() {
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

  // Sort by absolute change (most volatile)
  const mostVolatile = [...characters]
    .sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))
    .slice(0, 10)

  return (
    <div className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Zap className="w-5 h-5 text-black" />
        <h3 className="font-display text-2xl text-black">MOST VOLATILE</h3>
      </div>
      <div className="space-y-2">
        {mostVolatile.map((char, idx) => (
          <Link key={char.id} href={`/c/${char.slug}`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ x: 5, backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
              className="relative overflow-hidden flex items-center justify-between p-3 bg-black/5 border border-black/10 rounded hover:border-black/30 transition-all"
              style={{ borderLeftWidth: '4px', borderLeftColor: getCharacterAccentColor(char.slug) }}
            >
              <div
                className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none rounded-r"
                style={{ background: `linear-gradient(to right, transparent 40%, ${getCharacterAccentColor(char.slug)}18 100%)` }}
              />
              <div className="flex items-center gap-3">
                <CharacterAvatar slug={char.slug} displayName={char.displayName} size="sm" />
                <div>
                  <div className="font-mono text-sm font-semibold text-black">{char.displayName}</div>
                  <div className="font-mono text-xs text-black/60">₿{char.price.toFixed(2)}</div>
                </div>
              </div>
              <div className={`font-mono text-sm font-bold ${
                char.change24h >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {char.change24h >= 0 ? '+' : ''}
                {char.change24h.toFixed(2)}%
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}
