'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Coins, Wallet } from 'lucide-react'

interface PortfolioSummaryProps {
  berriesBalance: number
  positionsValue: number
  netWorth: number
}

export function PortfolioSummary({ berriesBalance, positionsValue, netWorth }: PortfolioSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm hover:border-op-red/50 transition-colors relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-op-red opacity-5 blur-2xl group-hover:opacity-10 transition-opacity"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <Wallet className="w-6 h-6 text-op-red" />
          </div>
          <div className="text-black/60 text-xs font-mono uppercase tracking-wider mb-2">Berries Balance</div>
          <div className="font-display text-4xl text-black">
            ₿{berriesBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm hover:border-op-red/50 transition-colors relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-op-orange opacity-5 blur-2xl group-hover:opacity-10 transition-opacity"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <Coins className="w-6 h-6 text-op-orange" />
          </div>
          <div className="text-black/60 text-xs font-mono uppercase tracking-wider mb-2">Positions Value</div>
          <div className="font-display text-4xl text-black">
            ₿{positionsValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border-2 border-op-red/50 rounded-lg p-6 shadow-sm hover:border-op-red transition-colors relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-op-red opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-6 h-6 text-op-red" />
          </div>
          <div className="text-black/60 text-xs font-mono uppercase tracking-wider mb-2">Net Worth</div>
          <div className="font-display text-4xl text-op-red">
            ₿{netWorth.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
