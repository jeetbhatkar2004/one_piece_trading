'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SpeechBubbleProps {
  children: ReactNode
  className?: string
  position?: 'left' | 'right' | 'center'
}

export function SpeechBubble({ children, className = '', position = 'left' }: SpeechBubbleProps) {
  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-white border-2 border-black rounded-lg p-4 shadow-lg ${className}`}
      style={{
        clipPath: position === 'left' 
          ? 'polygon(0 0, 100% 0, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
          : position === 'right'
          ? 'polygon(0 0, 100% 0, calc(100% - 15px) 100%, 0 100%)'
          : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      }}
    >
      {/* Manga speech bubble tail */}
      {position === 'left' && (
        <div className="absolute -bottom-3 left-6 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-black"></div>
      )}
      {position === 'right' && (
        <div className="absolute -bottom-3 right-6 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-black"></div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
