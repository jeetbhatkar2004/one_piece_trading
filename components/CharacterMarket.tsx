'use client'

import { useQuery } from '@tanstack/react-query'
import { TradingPanel } from './TradingPanel'
import { PriceChart } from './PriceChart'
import { RecentTrades } from './RecentTrades'
import { CharacterAvatar } from './CharacterAvatar'
import { MarketDepth } from './MarketDepth'
import { MarketStats } from './MarketStats'
import { motion } from 'framer-motion'
import { getCharacterDescription, getCharacterGradientColor, getCharacterAccentColor } from '@/lib/character-descriptions'

interface CharacterData {
  id: string
  slug: string
  displayName: string
  price: number
  pool: {
    reserveBerries: string
    reserveTokens: string
    feeBps: number
  }
  candles: Array<{
    time: string
    open: string
    high: string
    low: string
    close: string
    volume: string
  }>
  recentTrades: Array<{
    id: string
    username: string
    side: string
    tokensOut: string
    berriesOut: string
    price: string
    timestamp: string
  }>
}

export function CharacterMarket({ slug }: { slug: string }) {
  const { data: character, isLoading } = useQuery<CharacterData>({
    queryKey: ['character', slug],
    queryFn: async () => {
      const res = await fetch(`/api/characters/${slug}`)
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    refetchInterval: 5000,
  })

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 text-black/60"
      >
        <div className="animate-pulse font-mono">Loading character data...</div>
      </motion.div>
    )
  }

  if (!character) {
    return (
      <div className="text-center py-8 text-black">
        <div className="font-display text-4xl mb-4">Character not found</div>
        <p className="text-black/60 font-mono">The character you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    )
  }

  // Calculate 24h stats from candles
  const last24h = character.candles.slice(-24)
  const high24h = last24h.length > 0 
    ? Math.max(...last24h.map((c) => parseFloat(c.high)))
    : character.price
  const low24h = last24h.length > 0
    ? Math.min(...last24h.map((c) => parseFloat(c.low)))
    : character.price
  const volume24h = last24h.reduce((sum, c) => sum + parseFloat(c.volume || '0'), 0)
  const price24hAgo = last24h.length > 0 ? parseFloat(last24h[0].close) : character.price
  const change24h = ((character.price - price24hAgo) / price24hAgo) * 100
  const liquidity = parseFloat(character.pool.reserveBerries) * 2

  const accentColor = getCharacterAccentColor(character.slug)
  const gradient = getCharacterGradientColor(character.slug)

  return (
    <div className="space-y-8">
      {/* Header - character-themed */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-2 border-black/20 rounded-lg p-8 pl-10 relative overflow-hidden shadow-sm"
      >
        {/* Character-colored accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-lg"
          style={{ background: gradient }}
        />
        {/* Character-colored glow */}
        <div
          className="absolute top-0 right-0 w-80 h-80 blur-3xl opacity-20"
          style={{ backgroundColor: accentColor }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="shrink-0"
          >
            <div
              className="p-2 rounded-2xl shadow-xl"
              style={{ background: gradient, boxShadow: `0 0 40px ${accentColor}40, 0 25px 50px -12px rgba(0,0,0,0.25)` }}
            >
              <CharacterAvatar slug={character.slug} displayName={character.displayName} size="5xl" />
            </div>
          </motion.div>
          <div className="flex-1 min-w-0">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-5xl text-black mb-2"
            >
              {character.displayName}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-black/60 font-mono text-sm mb-2"
            >
              @{character.slug}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="text-black/80 font-mono text-sm max-w-2xl leading-relaxed"
            >
              {getCharacterDescription(character.slug, character.displayName)}
            </motion.p>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-6 border-t border-black/20"
        >
          <div className="flex items-end gap-6">
            <div>
              <div className="text-xs text-black/50 font-mono uppercase tracking-wider mb-2">Current Price</div>
              <div className="font-display text-5xl" style={{ color: accentColor }}>
                ₿{parseFloat(character.price.toFixed(2))}
              </div>
              <div className={`font-mono text-sm mt-1 ${change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}% (24h)
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Market Stats */}
      <MarketStats
        price={character.price}
        change24h={change24h}
        high24h={high24h}
        low24h={low24h}
        volume24h={volume24h}
        liquidity={liquidity}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart and Trades */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm"
          >
            <h2 className="font-display text-3xl text-black mb-6">PRICE CHART</h2>
            <PriceChart candles={character.candles} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm"
          >
            <h2 className="font-display text-3xl text-black mb-6">RECENT TRADES</h2>
            <RecentTrades trades={character.recentTrades} />
          </motion.div>
        </div>

        {/* Trading Panel and Market Depth */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <TradingPanel character={character} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <MarketDepth currentPrice={character.price} liquidity={liquidity} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
