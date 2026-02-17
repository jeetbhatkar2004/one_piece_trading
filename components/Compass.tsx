'use client'

import { motion } from 'framer-motion'
import { Navigation } from 'lucide-react'

interface CompassProps {
  direction?: 'N' | 'S' | 'E' | 'W'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Compass({ direction = 'N', size = 'md', className = '' }: CompassProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }

  const rotations: Record<string, number> = {
    N: 0,
    E: 90,
    S: 180,
    W: 270,
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} relative ${className}`}
      animate={{ rotate: rotations[direction] }}
      transition={{ duration: 0.5 }}
    >
      {/* Compass Circle */}
      <div className="w-full h-full rounded-full border-4 border-black bg-white shadow-lg relative">
        {/* Center point */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-op-red rounded-full z-10"></div>
        
        {/* Needle */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Navigation className="w-6 h-6 text-op-red" />
        </motion.div>

        {/* Directions */}
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-display font-bold text-black">N</div>
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-display font-bold text-black">S</div>
        <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-xs font-display font-bold text-black">W</div>
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs font-display font-bold text-black">E</div>
      </div>
    </motion.div>
  )
}
