'use client'

// Subtle Grand Line inspired background:
// - Base gradient
// - One Piece world map outline (bottom layer)
// - Faint grid on top for map vibe
// - Very minimal animation for calmness

import Image from 'next/image'
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

      {/* One Piece world map outline - bottom layer, low opacity, soft lines */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/one_piece_map_outline.png"
          alt=""
          fill
          className="object-contain opacity-[0.15]"
          priority
          sizes="100vw"
        />
      </div>

      {/* Map-style coordinate grid: fine lines + bolder degree lines (above map) */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Bolder lines every 5 units (latitude/longitude style) */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.06) 1.5px, transparent 1.5px),
            linear-gradient(to bottom, rgba(0,0,0,0.06) 1.5px, transparent 1.5px)
          `,
          backgroundSize: '200px 200px',
        }}
      />
      {/* Subtle compass roses - map flare */}
      <svg
        className="absolute top-6 right-6 w-14 h-14 text-black/[0.035]"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <circle cx="16" cy="16" r="14" />
        <line x1="16" y1="4" x2="16" y2="12" />
        <line x1="16" y1="20" x2="16" y2="28" />
        <line x1="4" y1="16" x2="12" y2="16" />
        <line x1="20" y1="16" x2="28" y2="16" />
        <line x1="8" y1="8" x2="12" y2="12" />
        <line x1="20" y1="20" x2="24" y2="24" />
        <line x1="20" y1="8" x2="24" y2="12" />
        <line x1="8" y1="20" x2="12" y2="24" />
      </svg>
      <svg
        className="absolute bottom-6 left-6 w-12 h-12 text-black/[0.03]"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <circle cx="16" cy="16" r="14" />
        <line x1="16" y1="4" x2="16" y2="12" />
        <line x1="16" y1="20" x2="16" y2="28" />
        <line x1="4" y1="16" x2="12" y2="16" />
        <line x1="20" y1="16" x2="28" y2="16" />
      </svg>

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

