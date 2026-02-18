'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react'

export function InteractiveHero() {
  const [stats, setStats] = useState({
    totalVolume: 0,
    activeTraders: 0,
    priceChanges: 0,
  })

  // Simulate live stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        totalVolume: Math.random() * 5000000 + 10000000,
        activeTraders: Math.floor(Math.random() * 500 + 1000),
        priceChanges: Math.floor(Math.random() * 50 + 100),
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-black/20 rounded-full"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Title with animated gradient */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mb-8"
        >
          <motion.h1
            className="font-display text-7xl md:text-9xl font-bold mb-4 tracking-tight relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.span
              className="block text-black"
              animate={{
                textShadow: [
                  '0 0 0px rgba(0,0,0,0)',
                  '0 0 20px rgba(0,0,0,0.1)',
                  '0 0 0px rgba(0,0,0,0)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              THE GRAND LINE
            </motion.span>
            <motion.span
              className="block text-op-red relative"
              animate={{
                textShadow: [
                  '0 0 0px rgba(220,38,38,0)',
                  '0 0 30px rgba(220,38,38,0.3)',
                  '0 0 0px rgba(220,38,38,0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              EXCHANGE
            </motion.span>
          </motion.h1>

          {/* Animated accent line */}
          <motion.div
            className="accent-line w-64 mx-auto my-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        {/* Tagline with typewriter effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-8"
        >
          <motion.p
            className="text-2xl md:text-3xl font-light text-gray-700 mb-4 max-w-3xl mx-auto"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Where Legends Become Tokens
          </motion.p>
          
          <motion.p
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {`Trade the Grand Line's greatest warriors. Build your crew. Conquer the markets.`}
          </motion.p>
        </motion.div>

        {/* Stats + CTA block, aligned so CTA is under the middle card on desktop */}
        <div className="mt-12 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start justify-items-center">
          {/* 24h Volume */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 border border-black/20 rounded-lg backdrop-blur-sm"
          >
            <DollarSign className="w-4 h-4 text-black" />
            <div className="text-left">
              <div className="text-xs font-mono text-black/60 uppercase">24h Volume</div>
              <motion.div
                key={stats.totalVolume}
                initial={{ scale: 1.2, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-sm font-mono font-bold text-black"
              >
                ₿{(stats.totalVolume / 1000000).toFixed(2)}M
              </motion.div>
            </div>
          </motion.div>

          {/* Active Traders (middle card) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.25 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 border border-black/20 rounded-lg backdrop-blur-sm"
          >
            <Activity className="w-4 h-4 text-black" />
            <div className="text-left">
              <div className="text-xs font-mono text-black/60 uppercase">Active Traders</div>
              <motion.div
                key={stats.activeTraders}
                initial={{ scale: 1.2, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-sm font-mono font-bold text-black"
              >
                {stats.activeTraders.toLocaleString()}
              </motion.div>
            </div>
          </motion.div>

          {/* Price Updates */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 border border-black/20 rounded-lg backdrop-blur-sm"
          >
            <TrendingUp className="w-4 h-4 text-green-600" />
            <div className="text-left">
              <div className="text-xs font-mono text-black/60 uppercase">Price Updates</div>
              <motion.div
                key={stats.priceChanges}
                initial={{ scale: 1.2, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-sm font-mono font-bold text-black"
              >
                {stats.priceChanges}/sec
              </motion.div>
            </div>
          </motion.div>

          {/* CTA Button: sits under middle column on md+, full width on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mt-2 col-span-1 md:col-start-2 md:col-span-1 flex justify-center"
          >
            <motion.a
              href="/trading"
              className="px-8 py-4 bg-op-red hover:bg-op-orange text-white rounded-lg font-mono text-sm uppercase tracking-wider border-2 border-op-red transition-colors cursor-pointer"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(220,38,38,0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              Start Trading
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 border-2 border-black/10 rounded-full"
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          scale: { duration: 4, repeat: Infinity },
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-24 h-24 border-2 border-op-red/20 rounded-full"
        animate={{
          rotate: -360,
          scale: [1, 1.3, 1],
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
          scale: { duration: 3, repeat: Infinity },
        }}
      />
    </div>
  )
}
