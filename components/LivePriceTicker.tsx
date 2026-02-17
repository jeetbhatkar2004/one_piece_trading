'use client'

import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { CharacterAvatar } from './CharacterAvatar'
import { getCharacterAccentColor } from '@/lib/character-descriptions'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Character {
  id: string
  slug: string
  displayName: string
  price: number
  change24h: number
  liquidity: number
}

export function LivePriceTicker() {
  const { data: characters } = useQuery<Character[]>({
    queryKey: ['characters'],
    queryFn: async () => {
      const res = await fetch('/api/characters')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    refetchInterval: 2000, // Update every 2 seconds for live feel
  })

  const [previousPrices, setPreviousPrices] = useState<Record<string, number>>({})

  useEffect(() => {
    if (characters) {
      const newPrices: Record<string, number> = {}
      characters.forEach((char) => {
        newPrices[char.id] = char.price
      })
      setPreviousPrices(newPrices)
    }
  }, [characters])

  if (!characters || characters.length === 0) {
    return null
  }

  // Sort by liquidity (most traded)
  const sortedCharacters = [...characters].sort((a, b) => b.liquidity - a.liquidity).slice(0, 20)

  return (
    <div className="bg-white border-2 border-black/20 rounded-lg p-2 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-mono text-black/60 uppercase tracking-wider">LIVE MARKET</span>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-3 min-w-max">
          <AnimatePresence mode="popLayout">
            {sortedCharacters.map((char) => {
              const prevPrice = previousPrices[char.id]
              const priceChanged = prevPrice !== undefined && prevPrice !== char.price
              const isUp = prevPrice !== undefined && char.price > prevPrice

              return (
                <Link key={char.id} href={`/c/${char.slug}`}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      backgroundColor: priceChanged ? (isUp ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)') : 'transparent'
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="relative overflow-hidden flex items-center gap-2 px-3 py-1.5 border border-black/10 rounded hover:border-black/30 transition-all min-w-[180px]"
                    style={{ borderLeftWidth: '3px', borderLeftColor: getCharacterAccentColor(char.slug) }}
                  >
                    <div
                      className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none rounded-r"
                      style={{ background: `linear-gradient(to right, transparent 30%, ${getCharacterAccentColor(char.slug)}18 100%)` }}
                    />
                    <CharacterAvatar slug={char.slug} displayName={char.displayName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-xs font-semibold text-black truncate">
                        {char.displayName}
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.span
                          key={char.price}
                          initial={{ scale: 1.2, color: priceChanged ? (isUp ? '#16a34a' : '#dc2626') : '#000' }}
                          animate={{ scale: 1, color: '#000' }}
                          className="font-mono text-xs font-bold"
                        >
                          ₿{char.price.toFixed(2)}
                        </motion.span>
                        <span
                          className={`font-mono text-[10px] font-semibold ${
                            char.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {char.change24h >= 0 ? '+' : ''}
                          {char.change24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
