'use client'

import { Navbar } from '@/components/Navbar'
import { InteractiveHero } from '@/components/InteractiveHero'
import { HomeNewsTicker } from '@/components/HomeNewsTicker'
import { TopPerformers } from '@/components/TopPerformers'
import { FeatureSection } from '@/components/FeatureSection'
import { TrendingNow } from '@/components/TrendingNow'
import { QuickStats } from '@/components/QuickStats'
import { MangaBackground } from '@/components/MangaBackground'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black relative overflow-hidden">
      <MangaBackground />
      <Navbar />
      
      <main className="relative z-10">
        {/* Interactive Hero Section */}
        <InteractiveHero />

        {/* Grand Line News Ticker */}
        <HomeNewsTicker />

        {/* Quick Stats Bar */}
        <QuickStats />

        {/* Top Performers */}
        <div className="container mx-auto px-4 py-16">
          <TopPerformers />
        </div>

        {/* Trending Now */}
        <TrendingNow />

        {/* Features Section */}
        <FeatureSection />

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 py-16 text-center"
        >
          <h2 className="font-display text-5xl md:text-6xl text-black mb-6">
            READY TO START TRADING?
          </h2>
          <p className="text-lg text-black/60 font-mono mb-8 max-w-2xl mx-auto">
            Join the Grand Line Exchange and trade your favorite One Piece characters
          </p>
          <motion.a
            href="/trading"
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(220,38,38,0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-12 py-4 bg-op-red hover:bg-op-orange text-white rounded-lg font-mono text-lg uppercase tracking-wider border-2 border-op-red transition-colors cursor-pointer"
          >
            Enter Trading Floor
          </motion.a>
        </motion.div>
      </main>
    </div>
  )
}
