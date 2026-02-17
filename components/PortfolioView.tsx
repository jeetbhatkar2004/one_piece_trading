'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CharacterAvatar } from './CharacterAvatar'
import { PortfolioSummary } from './PortfolioSummary'
import { motion } from 'framer-motion'

interface Position {
  characterId: string
  characterSlug: string
  characterName: string
  tokensBalance: string
  avgCostBerries: string
  currentPrice: string
  marketValue: string
  unrealizedPL: string
  unrealizedPLPercent: string
}

interface Portfolio {
  berriesBalance: string
  positions: Position[]
  netWorth: string
}

export function PortfolioView() {
  const { data: session } = useSession()
  const router = useRouter()

  const { data: portfolio, isLoading } = useQuery<Portfolio>({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const res = await fetch('/api/portfolio')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    enabled: !!session,
    refetchInterval: 5000,
  })

  if (!session) {
    return (
      <div className="bg-white border-2 border-black/20 rounded-lg p-8 text-center shadow-sm">
        <p className="text-black/60 mb-4 font-mono">Please login to view your portfolio</p>
        <motion.button
          onClick={() => router.push('/login')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-op-red hover:bg-op-orange text-white px-6 py-3 rounded font-mono text-sm uppercase tracking-wider transition-colors"
        >
          Login
        </motion.button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-black/60">
        <div className="animate-pulse font-mono">Loading portfolio...</div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="text-center py-8 text-black/60">
        <div className="font-mono">Failed to load portfolio</div>
      </div>
    )
  }

  const berriesBalance = parseFloat(portfolio.berriesBalance)
  const netWorth = parseFloat(portfolio.netWorth)
  const positionsValue = netWorth - berriesBalance

  return (
    <div className="space-y-8">
      {/* Portfolio Summary Cards */}
      <PortfolioSummary 
        berriesBalance={berriesBalance}
        positionsValue={positionsValue}
        netWorth={netWorth}
      />

      {/* Holdings Table */}
      <div className="bg-white border-2 border-black/20 rounded-lg overflow-hidden shadow-sm">
        <div className="p-6 border-b border-black/20 bg-black/5">
          <h2 className="font-display text-3xl text-black">HOLDINGS</h2>
        </div>
        {portfolio.positions.length === 0 ? (
          <div className="p-12 text-center text-black/60">
            <div className="text-6xl mb-4">📦</div>
            <p className="font-mono text-lg mb-2">No positions yet</p>
            <p className="font-mono text-sm text-black/50">Start trading to build your portfolio!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-black/10">
              <thead className="bg-black/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-mono text-black/70 uppercase tracking-wider">
                    Character
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-black/70 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-black/70 uppercase tracking-wider">
                    Avg Cost
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-black/70 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-black/70 uppercase tracking-wider">
                    Market Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-black/70 uppercase tracking-wider">
                    P/L
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-black/70 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {portfolio.positions.map((pos) => {
                  const pl = parseFloat(pos.unrealizedPL)
                  const plPercent = parseFloat(pos.unrealizedPLPercent)
                  return (
                    <tr key={pos.characterId} className="hover:bg-black/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <CharacterAvatar slug={pos.characterSlug} displayName={pos.characterName} size="md" />
                          <div>
                            <div className="text-sm font-medium text-black">
                              {pos.characterName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-black">
                          {parseFloat(pos.tokensBalance).toFixed(4)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-black">
                          ₿{parseFloat(pos.avgCostBerries).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-black">
                          ₿{parseFloat(pos.currentPrice).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-black">
                          ₿{parseFloat(pos.marketValue).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-mono font-semibold ${
                            pl >= 0 ? 'text-op-yellow' : 'text-op-red'
                          }`}
                        >
                          {pl >= 0 ? '+' : ''}
                          {pl.toFixed(2)} ({plPercent >= 0 ? '+' : ''}
                          {plPercent.toFixed(2)}%)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/c/${pos.characterSlug}`}
                          className="bg-op-red hover:bg-op-orange text-white px-4 py-2 rounded font-mono text-xs uppercase tracking-wider transition-colors inline-block border border-op-red/50"
                        >
                          Trade →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
