'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { CharacterAvatar } from './CharacterAvatar'
import { getCharacterAccentColor } from '@/lib/character-descriptions'

interface FriendTrade {
  id: string
  username: string
  character: {
    slug: string
    displayName: string
  }
  side: string
  tokensOut: string
  berriesOut: string
  price: string
  timestamp: string
}

export function FriendsTradesFeed() {
  const { data: session } = useSession()

  const { data, isLoading } = useQuery<{ trades: FriendTrade[] }>({
    queryKey: ['friends-trades'],
    queryFn: async () => {
      const res = await fetch('/api/friends/trades')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    enabled: !!session,
    refetchInterval: 10000,
  })

  if (!session) {
    return (
      <div className="bg-white border-2 border-black/20 rounded-lg p-8 text-center shadow-sm">
        <p className="text-black/60 mb-4 font-mono">Please login to view friends&apos; trades</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-black/60">
        <div className="animate-pulse font-mono">Loading friends&apos; trades...</div>
      </div>
    )
  }

  if (!data || data.trades.length === 0) {
    return (
      <div className="bg-white border-2 border-black/20 rounded-lg p-8 text-center shadow-sm">
        <p className="text-black/60 font-mono mb-2">No trades from friends yet</p>
        <p className="text-black/40 font-mono text-sm">Add friends to see their trading activity!</p>
      </div>
    )
  }

  return (
    <div className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm">
      <h2 className="font-display text-3xl text-black mb-6">FRIENDS&apos; TRADES</h2>
      <div className="space-y-3">
        {data.trades.map((trade, index) => (
          <motion.div
            key={trade.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 5, backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
            className="flex items-center justify-between p-4 bg-black/5 rounded border border-black/10 hover:border-op-red/50 transition-all"
            style={{ borderLeftWidth: '4px', borderLeftColor: getCharacterAccentColor(trade.character.slug) }}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-op-red/20 border border-op-red/50 flex items-center justify-center">
                  <span className="text-xs font-mono text-op-red font-bold">
                    {trade.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-mono text-sm text-black font-medium">@{trade.username}</span>
              </div>
              
              <span
                className={`px-3 py-1 rounded font-mono text-xs uppercase tracking-wider border-2 ${
                  trade.side === 'BUY'
                    ? 'bg-op-yellow/20 text-op-yellow border-op-yellow/50'
                    : 'bg-op-red/20 text-op-red border-op-red/50'
                }`}
              >
                {trade.side}
              </span>

              <div className="flex items-center gap-2">
                <CharacterAvatar slug={trade.character.slug} displayName={trade.character.displayName} size="sm" />
                <span className="font-mono text-sm text-black">{trade.character.displayName}</span>
              </div>

              <div className="text-sm font-mono text-black/60">
                {parseFloat(trade.tokensOut).toFixed(4)} tokens
              </div>
            </div>

            <Link href={`/c/${trade.character.slug}`}>
              <motion.div
                whileHover={{ scale: 1.1, x: 5 }}
                className="flex items-center gap-2 text-op-red hover:text-op-orange transition-colors cursor-pointer"
              >
                <span className="font-mono text-xs">View</span>
                <ArrowRight className="w-3 h-3" />
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
