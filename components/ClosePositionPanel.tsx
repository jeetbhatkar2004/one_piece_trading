'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { CharacterAvatar } from './CharacterAvatar'
import { getCharacterAccentColor } from '@/lib/character-descriptions'
import { ConfirmCloseModal } from './ConfirmCloseModal'
import { motion } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'

interface Position {
  characterId: string
  characterSlug: string
  characterName: string
  tokensBalance: string
  avgCostBerries: string
  currentPrice: string
  marketValue: string
  unrealizedPL?: string
  unrealizedPLPercent?: string
}

interface Portfolio {
  positions: Position[]
}

export function ClosePositionPanel() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [confirmingClose, setConfirmingClose] = useState<Position | null>(null)

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

  const closeMutation = useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch('/api/position/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to close position')
      }
      return res.json()
    },
    onSuccess: () => {
      setConfirmingClose(null)
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      queryClient.invalidateQueries({ queryKey: ['characters'] })
    },
    onError: () => {
      setConfirmingClose(null)
    },
  })

  if (!session) {
    return null
  }

  const positions = portfolio?.positions ?? []
  if (positions.length === 0 && !isLoading) {
    return null
  }

  const handleCloseClick = (pos: Position) => {
    setConfirmingClose(pos)
  }

  const handleConfirmClose = () => {
    if (confirmingClose) {
      closeMutation.mutate(confirmingClose.characterSlug)
    }
  }

  const handleCancelClose = () => {
    if (!closeMutation.isPending) setConfirmingClose(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 bg-white border-2 border-black/20 rounded-lg p-4 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <X className="w-5 h-5 text-op-red" />
        <h3 className="font-display text-xl text-black">CLOSE POSITIONS</h3>
      </div>
      <p className="text-sm text-black/60 font-mono mb-4">
        Sell your entire position at current market price
      </p>
      {isLoading ? (
        <div className="flex items-center gap-2 py-4 text-black/50">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="font-mono text-sm">Loading positions...</span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {positions.map((pos) => {
            const slug = pos.characterSlug
            const isClosing = closeMutation.isPending && closeMutation.variables === slug
            return (
              <motion.div
                key={pos.characterId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 px-4 py-3 bg-black/5 border border-black/10 rounded-lg hover:border-op-red/30 transition-colors"
                style={{ borderLeftWidth: '4px', borderLeftColor: getCharacterAccentColor(slug) }}
              >
                <CharacterAvatar slug={slug} displayName={pos.characterName} size="sm" />
                <div className="min-w-0">
                  <div className="font-mono text-sm font-semibold text-black truncate">
                    {pos.characterName}
                  </div>
                  <div className="font-mono text-xs text-black/60">
                    {parseFloat(pos.tokensBalance).toFixed(4)} tokens · ₿{parseFloat(pos.marketValue).toFixed(2)}
                  </div>
                </div>
                <motion.button
                  onClick={() => handleCloseClick(pos)}
                  disabled={isClosing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="shrink-0 px-4 py-2 bg-op-red hover:bg-op-orange disabled:opacity-50 text-white text-xs font-mono uppercase tracking-wider rounded border border-op-red/50 transition-colors flex items-center gap-2"
                >
                  {isClosing ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Closing...
                    </>
                  ) : (
                    'Close'
                  )}
                </motion.button>
              </motion.div>
            )
          })}
        </div>
      )}

      <ConfirmCloseModal
        isOpen={!!confirmingClose}
        onClose={handleCancelClose}
        onConfirm={handleConfirmClose}
        characterName={confirmingClose?.characterName ?? ''}
        tokensBalance={confirmingClose?.tokensBalance ?? '0'}
        marketValue={confirmingClose?.marketValue ?? '0'}
        avgCostBerries={confirmingClose?.avgCostBerries}
        unrealizedPL={confirmingClose?.unrealizedPL}
        unrealizedPLPercent={confirmingClose?.unrealizedPLPercent}
        isClosing={closeMutation.isPending}
      />
    </motion.div>
  )
}
