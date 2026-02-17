'use client'

import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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

interface MarketSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function MarketSearch({ onSearch, placeholder = 'Search tokens by name...' }: MarketSearchProps) {
  const [query, setQuery] = useState('')
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const { data: characters } = useQuery<Character[]>({
    queryKey: ['characters'],
    queryFn: async () => {
      const res = await fetch('/api/characters')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  // Filter characters for autocomplete
  const autocompleteResults = query && characters
    ? characters
        .filter((char) => {
          const searchLower = query.toLowerCase()
          return (
            char.displayName.toLowerCase().includes(searchLower) ||
            char.slug.toLowerCase().includes(searchLower)
          )
        })
        .slice(0, 5)
    : []

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
    setShowAutocomplete(value.length > 0)
  }

  const clearSearch = () => {
    setQuery('')
    onSearch('')
    setShowAutocomplete(false)
  }

  const handleSelect = (char: Character) => {
    setQuery(char.displayName)
    onSearch(char.displayName)
    setShowAutocomplete(false)
  }

  return (
    <motion.div
      ref={searchRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/40" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => query && setShowAutocomplete(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 bg-white border-2 border-black/20 rounded-lg text-black font-mono placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-op-red focus:border-op-red transition-all"
        />
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/40 hover:text-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {showAutocomplete && autocompleteResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-black/20 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            {autocompleteResults.map((char) => (
              <Link key={char.id} href={`/c/${char.slug}`}>
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                  onClick={() => handleSelect(char)}
                  className="flex items-center gap-3 p-3 border-b border-black/10 last:border-b-0 cursor-pointer"
                >
                  <CharacterAvatar slug={char.slug} displayName={char.displayName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm font-semibold text-black truncate">
                      {char.displayName}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-mono text-xs text-black/60">₿{char.price.toFixed(2)}</span>
                      <span
                        className={`font-mono text-xs font-semibold ${
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
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
