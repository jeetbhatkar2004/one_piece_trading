'use client'

import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CharacterAvatar } from './CharacterAvatar'
import { getCharacterAccentColor } from '@/lib/character-descriptions'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'

interface Character {
  id: string
  slug: string
  displayName: string
  price: number
  change24h: number
  liquidity: number
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
}

interface MarketsTableProps {
  searchQuery?: string
}

export function MarketsTable({ searchQuery = '' }: MarketsTableProps) {
  const [previousPrices, setPreviousPrices] = useState<Record<string, number>>({})
  
  const { data: characters, isLoading } = useQuery<Character[]>({
    queryKey: ['characters'],
    queryFn: async () => {
      const res = await fetch('/api/characters')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    refetchInterval: 3000, // More frequent updates for live feel
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
      className="bg-white border-2 border-black/20 rounded-lg overflow-hidden shadow-sm"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-black/10">
          <thead className="bg-black/5">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-mono text-black/70 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-xs font-mono text-black/70 uppercase tracking-wider">
                Character
              </th>
              <th className="px-6 py-4 text-left text-xs font-mono text-black/70 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-mono text-black/70 uppercase tracking-wider">
                24h Change
              </th>
              <th className="px-6 py-4 text-left text-xs font-mono text-black/70 uppercase tracking-wider">
                Liquidity
              </th>
              <th className="px-6 py-4 text-left text-xs font-mono text-black/70 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-black/10"
          >
            {filteredCharacters.map((char, index) => (
              <motion.tr
                key={char.id}
                variants={itemVariants}
                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
                className="transition-colors duration-200 cursor-pointer"
                style={{ borderLeftWidth: '4px', borderLeftColor: getCharacterAccentColor(char.slug) }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-black/50">#{index + 1}</span>
                    {index < 3 && (
                      <span className="text-lg">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <CharacterAvatar slug={char.slug} displayName={char.displayName} size="md" />
                    </motion.div>
                    <div>
                      <div className="text-sm font-medium text-black">
                        {char.displayName}
                      </div>
                      <div className="text-xs text-black/50 font-mono">@{char.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={char.price}
                      initial={{ scale: 1.2, color: previousPrices[char.id] !== undefined && char.price > previousPrices[char.id] ? '#16a34a' : previousPrices[char.id] !== undefined && char.price < previousPrices[char.id] ? '#dc2626' : '#000' }}
                      animate={{ scale: 1, color: '#000' }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm font-mono font-semibold"
                    >
                      ₿{char.price.toFixed(2)}
                    </motion.div>
                  </AnimatePresence>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <motion.div
                    className={`text-sm font-mono flex items-center gap-1 ${
                      char.change24h >= 0 ? 'text-op-yellow' : 'text-op-red'
                    }`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {char.change24h >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {char.change24h >= 0 ? '+' : ''}
                    {char.change24h.toFixed(2)}%
                  </motion.div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-black/70">
                    ₿{char.liquidity.toLocaleString()}
                  </div>
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium relative overflow-hidden"
                  style={{ background: `linear-gradient(to right, transparent 60%, ${getCharacterAccentColor(char.slug)}12 100%)` }}
                >
                  <Link href={`/c/${char.slug}`}>
                    <motion.div
                      className="bg-op-red hover:bg-op-orange text-white px-4 py-2 rounded font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 border border-op-red/50"
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Trade
                      <ArrowRight className="w-3 h-3" />
                    </motion.div>
                  </Link>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </motion.div>
  )
}
