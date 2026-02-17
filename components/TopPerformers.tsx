'use client'

import { useQuery } from '@tanstack/react-query'
import { CharacterAvatar } from './CharacterAvatar'
import { getCharacterAccentColor } from '@/lib/character-descriptions'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { MangaPanel } from './MangaPanel'

interface Character {
  id: string
  slug: string
  displayName: string
  price: number
  change24h: number
  liquidity: number
}

export function TopPerformers() {
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
    return null
  }

  // Get top 3 by liquidity (most popular)
  const top3 = [...characters]
    .sort((a, b) => b.liquidity - a.liquidity)
    .slice(0, 3)

  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-display text-5xl text-black">TOP PERFORMERS</h2>
        <div className="accent-line flex-1"></div>
        <span className="text-op-red text-sm font-mono">BY LIQUIDITY</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {top3.map((char, index) => {
          const isPositive = char.change24h >= 0
          return (
            <MangaPanel key={char.id} delay={index * 0.1}>
              <Link href={`/c/${char.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm hover:border-op-red/50 transition-all relative overflow-hidden group cursor-pointer"
                  style={{
                    borderLeftWidth: '4px',
                    borderLeftColor: getCharacterAccentColor(char.slug),
                    boxShadow: `inset 0 0 60px ${getCharacterAccentColor(char.slug)}08`,
                  }}
                >
                  {/* Rank Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-display text-xl font-bold border-2 ${
                      index === 0 
                        ? 'bg-op-yellow text-black border-op-yellow' 
                        : index === 1
                        ? 'bg-white text-black border-black'
                        : 'bg-op-orange text-white border-op-orange'
                    }`}>
                      #{index + 1}
                    </div>
                  </div>

                  {/* Background accent */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-op-red opacity-5 blur-2xl group-hover:opacity-10 transition-opacity ${
                    index === 0 ? 'bg-op-yellow' : index === 1 ? 'bg-white' : 'bg-op-orange'
                  }`}></div>

                  <div className="relative z-10">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <CharacterAvatar slug={char.slug} displayName={char.displayName} size="xl" />
                      </motion.div>
                    </div>

                    {/* Name */}
                    <h3 className="font-display text-2xl text-black text-center mb-2">
                      {char.displayName}
                    </h3>

                    {/* Price */}
                    <div className="text-center mb-4">
                      <div className="text-xs text-black/60 font-mono uppercase tracking-wider mb-1">Price</div>
                      <div className="font-display text-3xl text-op-red">
                        ₿{char.price.toFixed(2)}
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-black/5 rounded p-3 border border-black/10">
                        <div className="text-xs text-black/60 font-mono uppercase tracking-wider mb-1">24h Change</div>
                        <div className={`flex items-center gap-1 font-mono font-semibold ${
                          isPositive ? 'text-op-yellow' : 'text-op-red'
                        }`}>
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {isPositive ? '+' : ''}{char.change24h.toFixed(2)}%
                        </div>
                      </div>
                      <div className="bg-black/5 rounded p-3 border border-black/10">
                        <div className="text-xs text-black/60 font-mono uppercase tracking-wider mb-1">Liquidity</div>
                        <div className="font-mono font-semibold text-black">
                          ₿{(char.liquidity / 1000).toFixed(1)}K
                        </div>
                      </div>
                    </div>

                    {/* Trade Button */}
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-center gap-2 bg-op-red hover:bg-op-orange text-white px-4 py-2 rounded font-mono text-xs uppercase tracking-wider transition-colors"
                    >
                      Trade
                      <ArrowRight className="w-3 h-3" />
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </MangaPanel>
          )
        })}
      </div>
    </div>
  )
}
