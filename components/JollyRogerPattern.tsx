'use client'

import { motion } from 'framer-motion'

export function JollyRogerPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.02] overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl"
          style={{
            left: `${(i * 5) % 100}%`,
            top: `${(i * 7) % 100}%`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.01, 0.03, 0.01],
          }}
          transition={{
            duration: 20 + (i % 10),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        >
          🏴‍☠️
        </motion.div>
      ))}
    </div>
  )
}
