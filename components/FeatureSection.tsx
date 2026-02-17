'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Shield, Zap, Users } from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: 'Bragging rights',
    description: 'You can brag to your friends about having better one piece takes!',
    color: 'text-op-red',
  },
  {
    icon: Shield,
    title: 'Mental Peace',
    description: 'Do not have to deal with dweebs on reddit having shit one piece takes',
    color: 'text-op-yellow',
  },
  {
    icon: Zap,
    title: 'Its Fun',
    description: 'Most importantly, watching and thinking about original one piece theories is fun!',
    color: 'text-op-orange',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Everyone else has the same edge as you. No insider info.',
    color: 'text-op-red',
  },
]

export function FeatureSection() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-5xl md:text-6xl text-black mb-4">WHY TRADE HERE?</h2>
        <div className="accent-line w-64 mx-auto mb-6"></div>
        <p className="text-lg text-black/60 font-mono max-w-2xl mx-auto">
          The most exciting way to trade your favorite One Piece characters
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm hover:border-op-red/50 transition-all"
            >
              <div className={`w-12 h-12 rounded-lg bg-black/5 flex items-center justify-center mb-4 ${feature.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl text-black mb-2">{feature.title}</h3>
              <p className="text-sm text-black/60 font-mono">{feature.description}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
