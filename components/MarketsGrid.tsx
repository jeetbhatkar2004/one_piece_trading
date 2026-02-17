'use client'

import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { CharacterAvatar } from './CharacterAvatar'

interface Character {
  id: string
  slug: string
  displayName: string
  price: number
  change24h: number
  liquidity: number
}

interface MarketsGridProps {
  searchQuery?: string
}

export function MarketsGrid({ searchQuery = '' }: MarketsGridProps) {
  const [previousPrices, setPreviousPrices] = useState<Record<string, number>>({})
  
  const { data: characters, isLoading } = useQuery<Character[]>({
    queryKey: ['characters'],
    queryFn: async () => {
      const res = await fetch('/api/characters')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    refetchInterval: 3000,
  })

  useEffect(() => {
    if (characters) {
      const newPrices: Record<string, number> = {}
      characters.forEach((char) => {
        newPrices[char.id] = char.price
      })
      setPreviousPrices(newPrices)
    }
  }, [characters])

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border-2 border-black/20 rounded-lg p-8 shadow-sm"
      >
        <div className="text-center text-black/60 py-8 font-mono">Loading markets...</div>
      </motion.div>
    )
  }

  if (!characters || characters.length === 0) {
    return (
      <div className="bg-white border-2 border-black/20 rounded-lg p-8 shadow-sm">
        <div className="text-center text-black/60 py-8">No characters found</div>
      </div>
    )
  }

  // Filter characters based on search query
  const filteredCharacters = searchQuery
    ? characters.filter((char) => {
        const query = searchQuery.toLowerCase()
        return (
          char.displayName.toLowerCase().includes(query) ||
          char.slug.toLowerCase().includes(query)
        )
      })
    : characters

  if (filteredCharacters.length === 0) {
    return (
      <div className="bg-white border-2 border-black/20 rounded-lg p-8 shadow-sm">
        <div className="text-center text-black/60 py-8">
          No tokens found matching &quot;{searchQuery}&quot;
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {filteredCharacters.map((char, index) => {
        const prevPrice = previousPrices[char.id]
        const priceChanged = prevPrice !== undefined && prevPrice !== char.price
        const isUp = prevPrice !== undefined && char.price > prevPrice
        
        return (
          <Link key={char.id} href={`/c/${char.slug}`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white border-2 border-black/20 rounded-lg p-5 shadow-sm hover:border-op-red/50 transition-all relative group min-h-[300px] flex flex-col"
            >
              {/* Rank Badge */}
              <div className="absolute top-3 right-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold border-2 ${
                  index < 3
                    ? index === 0 
                      ? 'bg-op-yellow/90 text-black border-op-yellow' 
                      : index === 1
                      ? 'bg-white/90 text-black border-black'
                      : 'bg-op-orange/90 text-white border-op-orange'
                    : 'bg-black/5 text-black/70 border-black/20'
                }`}>
                  #{index + 1}
                </div>
              </div>

              {/* Circular Avatar - prominent size */}
              <div className="flex justify-center mb-3 mt-1 relative">
                <CharacterAvatar
                  slug={char.slug}
                  displayName={char.displayName}
                  size="2xl"
                  className="justify-center"
                />
              </div>

              {/* Name - allow 2 lines for longer names like "Kuzan (Aokiji)" */}
              <h3 className="font-display text-base font-semibold text-black text-center mb-2 line-clamp-2 leading-tight">
                {char.displayName}
              </h3>

              {/* Price */}
              <div className="text-center mb-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={char.price}
                    initial={{ scale: 1.2, color: priceChanged ? (isUp ? '#16a34a' : '#dc2626') : undefined }}
                    animate={{ scale: 1, color: undefined }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="font-display text-xl text-black"
                  >
                    ₿{char.price.toFixed(2)}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 mt-auto">
                <div className="bg-black/5 rounded p-2 border border-black/10">
                  <div className="text-[10px] text-black/60 font-mono uppercase tracking-wider mb-1">24h</div>
                  <div className={`flex items-center gap-1 font-mono text-xs font-semibold ${
                    char.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {char.change24h >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {char.change24h >= 0 ? '+' : ''}{char.change24h.toFixed(2)}%
                  </div>
                </div>
                <div className="bg-black/5 rounded p-2 border border-black/10">
                  <div className="text-[10px] text-black/60 font-mono uppercase tracking-wider mb-1">Liquidity</div>
                  <div className="font-mono text-xs font-semibold text-black">
                    ₿{(char.liquidity / 1000).toFixed(1)}K
                  </div>
                </div>
              </div>

              {/* Trade Button */}
              <motion.div
                whileHover={{ x: 3 }}
                className="flex items-center justify-center gap-2 bg-op-red hover:bg-op-orange text-white px-3 py-2 rounded font-mono text-xs uppercase tracking-wider transition-colors mt-2"
              >
                Trade
                <ArrowRight className="w-3 h-3" />
              </motion.div>
            </motion.div>
          </Link>
        )
      })}
    </motion.div>
  )
}
