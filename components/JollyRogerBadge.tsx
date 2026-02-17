'use client'

import { motion } from 'framer-motion'

interface JollyRogerBadgeProps {
  rank: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function JollyRogerBadge({ rank, size = 'md', className = '' }: JollyRogerBadgeProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
  }

  const getRankColor = () => {
    if (rank === 1) return 'bg-op-yellow text-black border-op-yellow'
    if (rank === 2) return 'bg-white text-black border-black'
    if (rank === 3) return 'bg-op-orange text-white border-op-orange'
    return 'bg-black text-white border-black'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      className={`${sizeClasses[size]} ${getRankColor()} rounded-full border-2 flex items-center justify-center font-display font-bold shadow-lg relative ${className}`}
    >
      <span>#{rank}</span>
      {/* Jolly Roger decoration */}
      {rank <= 3 && (
        <motion.div
          className="absolute -top-1 -right-1 text-lg"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🏴‍☠️
        </motion.div>
      )}
    </motion.div>
  )
}
