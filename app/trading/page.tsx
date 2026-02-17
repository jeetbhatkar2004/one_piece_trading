'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { MarketsGrid } from '@/components/MarketsGrid'
import { MarketSearch } from '@/components/MarketSearch'
import { TopTokensChart } from '@/components/TopTokensChart'
import { StatsCards } from '@/components/StatsCards'
import { PriceTicker } from '@/components/PriceTicker'
import { MarketSummary } from '@/components/MarketSummary'
import { MarketHours } from '@/components/MarketHours'
import { VolumeLeaderboard } from '@/components/VolumeLeaderboard'
import { MostVolatile } from '@/components/MostVolatile'
import { MangaBackground } from '@/components/MangaBackground'
import { RecommendCharacterButton } from '@/components/RecommendCharacterButton'
import { motion } from 'framer-motion'

export default function TradingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  return (
    <div className="min-h-screen bg-white text-black relative overflow-hidden">
      <MangaBackground />
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-5xl md:text-7xl text-black mb-2">TRADING FLOOR</h1>
              <p className="text-lg text-black/60 font-mono">Real-time market data and trading</p>
            </div>
            <MarketHours />
          </div>
        </motion.div>

        {/* Search Bar - Top of Page */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <MarketSearch onSearch={setSearchQuery} />
        </motion.div>

        {/* Market Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <MarketSummary />
        </motion.div>

        {/* Market Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <PriceTicker />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <StatsCards />
        </motion.div>

        {/* Market Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <VolumeLeaderboard />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <MostVolatile />
          </motion.div>
        </div>

        {/* Top Tokens Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-6"
        >
          <TopTokensChart />
        </motion.div>

        {/* Markets Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-display text-4xl text-black">ALL MARKETS</h2>
            <div className="accent-line flex-1"></div>
            <span className="text-op-red text-sm font-mono">ALL CHARACTERS</span>
          </div>
          
          <MarketsGrid searchQuery={searchQuery} />
        </motion.div>

        {/* Recommend Characters - Bottom of page */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 pt-8 border-t-2 border-black/10 flex justify-center"
        >
          <RecommendCharacterButton />
        </motion.div>
      </main>
    </div>
  )
}
