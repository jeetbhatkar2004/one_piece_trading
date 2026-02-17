'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface MangaPanelProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function MangaPanel({ children, className = '', delay = 0 }: MangaPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={`relative ${className}`}
    >
      {/* Manga panel border */}
      <div className="absolute inset-0 border-4 border-black/30 rounded-lg pointer-events-none" 
           style={{
             clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
           }}
      />
      
      {/* Corner decorations */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-black/40"></div>
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-black/40"></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-black/40"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
