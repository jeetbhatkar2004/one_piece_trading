'use client'

import { motion } from 'framer-motion'

export function WaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z"
          fill="#dc2626"
          animate={{
            d: [
              "M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z",
              "M0,100 Q300,150 600,100 T1200,100 L1200,200 L0,200 Z",
              "M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.path
          d="M0,120 Q400,80 800,120 T1200,120 L1200,200 L0,200 Z"
          fill="#ea580c"
          animate={{
            d: [
              "M0,120 Q400,80 800,120 T1200,120 L1200,200 L0,200 Z",
              "M0,120 Q400,160 800,120 T1200,120 L1200,200 L0,200 Z",
              "M0,120 Q400,80 800,120 T1200,120 L1200,200 L0,200 Z",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.path
          d="M0,140 Q500,100 1000,140 T1200,140 L1200,200 L0,200 Z"
          fill="#fbbf24"
          animate={{
            d: [
              "M0,140 Q500,100 1000,140 T1200,140 L1200,200 L0,200 Z",
              "M0,140 Q500,180 1000,140 T1200,140 L1200,200 L0,200 Z",
              "M0,140 Q500,100 1000,140 T1200,140 L1200,200 L0,200 Z",
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </svg>
    </div>
  )
}
