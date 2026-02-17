'use client'

// Subtle Grand Line inspired background:
// - Soft parchment gradient
// - Faint grid for a market / map vibe
// - Very minimal animation for calmness

import { motion } from 'framer-motion'

export function MangaBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Base parchment gradient */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 0%, rgba(248, 250, 252, 1) 0, rgba(248, 250, 252, 0) 40%),
            radial-gradient(circle at 80% 100%, rgba(248, 250, 252, 1) 0, rgba(248, 250, 252, 0) 40%),
            linear-gradient(135deg, #fdf5ec 0%, #ffffff 50%, #fef2f2 100%)
          `,
        }}
      />

      {/* Light grid to hint at charts / maps */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Very subtle moving highlight band (Grand Line) */}
      <motion.div
        className="absolute -left-1/2 top-1/3 w-[200%] h-32"
        style={{
          background:
            'linear-gradient(120deg, transparent 0%, rgba(248, 113, 113, 0.08) 40%, rgba(248, 113, 113, 0.12) 50%, rgba(248, 113, 113, 0.08) 60%, transparent 100%)',
        }}
        initial={{ x: '-10%' }}
        animate={{ x: '10%' }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}

