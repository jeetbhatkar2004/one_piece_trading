'use client'

import { motion } from 'framer-motion'
import { Megaphone } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

interface Character {
  id: string
  slug: string
  displayName: string
  price: number
  change24h: number
  liquidity: number
}

function buildHeadlines(characters: Character[]): string[] {
  if (!characters || characters.length === 0) {
    return [
      'Markets are quiet across the Grand Line. Start trading to move the seas.',
      'No major moves yet. Will Luffy, Zoro, or Shanks lead the next rally?',
    ]
  }

  const sortedByChange = [...characters].sort(
    (a, b) => b.change24h - a.change24h
  )
  const sortedByLiquidity = [...characters].sort(
    (a, b) => b.liquidity - a.liquidity
  )

  const topGainer = sortedByChange[0]
  const topLoser = sortedByChange[sortedByChange.length - 1]
  const mostLiquid = sortedByLiquidity[0]
  const secondLiquid = sortedByLiquidity[1]

  const headlines: string[] = []

  if (topGainer) {
    headlines.push(
      `${topGainer.displayName} rallies ${topGainer.change24h.toFixed(
        2
      )}% as traders pile into the Grand Line.`
    )
  }

  if (topLoser && topLoser.id !== topGainer?.id) {
    headlines.push(
      `${topLoser.displayName} slips ${Math.abs(topLoser.change24h).toFixed(
        2
      )}% after a wave of profit-taking.`
    )
  }

  if (mostLiquid) {
    headlines.push(
      `${mostLiquid.displayName} leads liquidity with ₿${(
        mostLiquid.liquidity / 1000
      ).toFixed(1)}K on The Grand Line Exchange.`
    )
  }

  if (secondLiquid && secondLiquid.id !== mostLiquid.id) {
    headlines.push(
      `${secondLiquid.displayName} emerges as a favorite pick among Grand Line speculators.`
    )
  }

  // Fallback to at least 2–3 headlines
  if (headlines.length < 3 && mostLiquid) {
    headlines.push(
      `Rumors swirl as traders debate whether ${mostLiquid.displayName} is overbought or just warming up.`
    )
  }

  return headlines
}

export function HomeNewsTicker() {
  const { data: characters } = useQuery<Character[]>({
    queryKey: ['characters', 'news-ticker'],
    queryFn: async () => {
      const res = await fetch('/api/characters')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    refetchInterval: 30_000, // refresh headlines every 30s based on live data
  })

  const items = buildHeadlines(characters || [])

  return (
    <div className="border-y-2 border-black/10 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4 overflow-hidden">
        <div className="flex items-center gap-2 shrink-0">
          <Megaphone className="w-4 h-4 text-op-red" />
          <span className="font-mono text-xs uppercase tracking-wider text-black/60">
            Grand Line Wire
          </span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <motion.div
            className="flex gap-12 whitespace-nowrap"
            initial={{ x: 0 }}
            animate={{ x: '-50%' }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {[...items, ...items].map((text, idx) => (
              <span
                key={idx}
                className="font-mono text-xs md:text-sm text-black/70"
              >
                {text}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}


