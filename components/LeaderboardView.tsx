'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { CharacterAvatar } from './CharacterAvatar'
import { JollyRogerBadge } from './JollyRogerBadge'
import { celebrateRank } from '@/lib/confetti'
import { useEffect } from 'react'

interface LeaderboardEntry {
  userId: string
  username: string
  netWorth: number
  rank: number
}

interface Leaderboard {
  seasonId: string
  leaderboard: LeaderboardEntry[]
}

export function LeaderboardView() {
  const { data: leaderboard, isLoading } = useQuery<Leaderboard>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const res = await fetch('/api/leaderboard')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    refetchInterval: 30000,
  })

  // Celebrate top 3 ranks on mount
  useEffect(() => {
    if (leaderboard?.leaderboard) {
      const topThree = leaderboard.leaderboard.filter(e => e.rank <= 3)
      topThree.forEach(entry => {
        setTimeout(() => celebrateRank(entry.rank), entry.rank * 500)
      })
    }
  }, [leaderboard])

  if (isLoading) {
    return (
      <div className="text-center py-8 text-black/60">
        <div className="animate-pulse font-mono">Loading leaderboard...</div>
      </div>
    )
  }

  if (!leaderboard || leaderboard.leaderboard.length === 0) {
    return (
      <div className="text-center py-8 text-black/60 font-mono">
        No leaderboard data available
      </div>
    )
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  return (
    <div className="bg-white border-2 border-black/20 rounded-lg overflow-hidden shadow-sm">
      <div className="p-6 border-b border-black/20 bg-black/5">
        <h2 className="font-display text-3xl text-black">TOP TRADERS</h2>
        <p className="text-black/60 font-mono text-xs uppercase tracking-wider mt-1">Current season rankings</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-black/10">
          <thead className="bg-black/5">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-mono text-black/70 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-xs font-mono text-black/70 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-4 text-left text-xs font-mono text-black/70 uppercase tracking-wider">
                Net Worth
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {leaderboard.leaderboard.map((entry) => {
              const isTopThree = entry.rank <= 3
              return (
                <motion.tr
                  key={entry.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: entry.rank * 0.05 }}
                  className={`hover:bg-black/5 transition-colors ${
                    isTopThree ? 'bg-black/5' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {getRankIcon(entry.rank) && (
                        <span className="text-2xl">{getRankIcon(entry.rank)}</span>
                      )}
                      <JollyRogerBadge rank={entry.rank} size="md" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <CharacterAvatar slug={entry.username} displayName={entry.username} size="sm" />
                      <div className="text-sm font-mono text-black">
                        @{entry.username}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-display text-op-red">
                      ₿{entry.netWorth.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
