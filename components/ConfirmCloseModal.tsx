'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ConfirmCloseModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  characterName: string
  tokensBalance: string
  marketValue: string
  avgCostBerries?: string
  unrealizedPL?: string
  unrealizedPLPercent?: string
  isClosing?: boolean
}

export function ConfirmCloseModal({
  isOpen,
  onClose,
  onConfirm,
  characterName,
  tokensBalance,
  marketValue,
  avgCostBerries = '0',
  unrealizedPL,
  unrealizedPLPercent,
  isClosing = false,
}: ConfirmCloseModalProps) {
  const totalCost = parseFloat(tokensBalance || '0') * parseFloat(avgCostBerries || '0')
  const pl = unrealizedPL !== undefined && unrealizedPL !== ''
    ? parseFloat(unrealizedPL)
    : (parseFloat(marketValue || '0') - totalCost)
  const plNum = Number.isNaN(pl) ? 0 : pl
  const plPercent = unrealizedPLPercent !== undefined && unrealizedPLPercent !== ''
    ? parseFloat(unrealizedPLPercent)
    : totalCost > 0 ? ((plNum / totalCost) * 100) : 0
  const plPercentNum = Number.isNaN(plPercent) ? 0 : plPercent
  return (
    <AnimatePresence>
      {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white border-2 border-black/20 rounded-lg shadow-xl max-w-md w-full p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-2xl text-black">Close Position</h3>
            <button
              onClick={onClose}
              disabled={isClosing}
              className="p-1 text-black/60 hover:text-black transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-black/70 mb-4 font-mono text-sm">
            Close your entire <span className="font-semibold text-black">{characterName}</span> position at current market price?
          </p>
          <div className="bg-black/5 rounded p-3 mb-6 font-mono text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-black/60">Tokens</span>
              <span className="text-black font-semibold">{parseFloat(tokensBalance).toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60">Avg Cost</span>
              <span className="text-black font-semibold">₿{parseFloat(avgCostBerries).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60">Est. Proceeds</span>
              <span className="text-black font-semibold">₿{parseFloat(marketValue).toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 mt-2 border-t border-black/10">
              <span className="text-black/60">Est. P/L</span>
              <span className={`font-semibold ${plNum >= 0 ? 'text-op-yellow' : 'text-op-red'}`}>
                {plNum >= 0 ? '+' : ''}₿{plNum.toFixed(2)} ({plPercentNum >= 0 ? '+' : ''}{plPercentNum.toFixed(2)}%)
              </span>
            </div>
            <p className="text-xs text-black/50 font-mono mt-2">No fees on close</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isClosing}
              className="flex-1 py-3 rounded font-mono text-sm uppercase tracking-wider border-2 border-black/20 text-black/70 hover:border-black/40 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isClosing}
              className="flex-1 py-3 rounded font-mono text-sm uppercase tracking-wider bg-op-red hover:bg-op-orange text-white border-2 border-op-red transition-colors disabled:opacity-50"
            >
              {isClosing ? 'Closing...' : 'Confirm Close'}
            </button>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  )
}
