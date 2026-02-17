'use client'

import { motion } from 'framer-motion'

interface MarketDepthProps {
  currentPrice: number
  liquidity: number
}

export function MarketDepth({ currentPrice, liquidity }: MarketDepthProps) {
  // Simulate order book depth (in a real market, this would come from actual orders)
  const generateDepth = (side: 'buy' | 'sell', levels: number) => {
    const depth = []
    const basePrice = currentPrice
    const spread = currentPrice * 0.02 // 2% spread

    for (let i = 0; i < levels; i++) {
      const offset = (spread / levels) * (i + 1)
      const price = side === 'buy' 
        ? basePrice - offset 
        : basePrice + offset
      const size = Math.random() * (liquidity / 10) + liquidity / 20
      const total = size * price

      depth.push({
        price,
        size,
        total,
      })
    }

    return depth.sort((a, b) => 
      side === 'buy' ? b.price - a.price : a.price - b.price
    )
  }

  const buyOrders = generateDepth('buy', 10)
  const sellOrders = generateDepth('sell', 10)

  return (
    <div className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm">
      <h3 className="font-display text-2xl text-black mb-4">MARKET DEPTH</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Sell Orders (Asks) */}
        <div>
          <div className="text-xs font-mono text-black/60 uppercase tracking-wider mb-2">SELL ORDERS</div>
          <div className="space-y-1">
            {sellOrders.map((order, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded text-xs font-mono hover:bg-red-100 transition-colors"
              >
                <span className="text-red-700">₿{order.price.toFixed(2)}</span>
                <span className="text-black/70">{order.size.toFixed(2)}</span>
                <span className="text-black/50">₿{order.total.toFixed(0)}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Buy Orders (Bids) */}
        <div>
          <div className="text-xs font-mono text-black/60 uppercase tracking-wider mb-2">BUY ORDERS</div>
          <div className="space-y-1">
            {buyOrders.map((order, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded text-xs font-mono hover:bg-green-100 transition-colors"
              >
                <span className="text-green-700">₿{order.price.toFixed(2)}</span>
                <span className="text-black/70">{order.size.toFixed(2)}</span>
                <span className="text-black/50">₿{order.total.toFixed(0)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Price */}
      <div className="mt-4 pt-4 border-t border-black/20 text-center">
        <div className="text-xs font-mono text-black/60 uppercase tracking-wider mb-1">CURRENT PRICE</div>
        <div className="font-display text-3xl text-black">₿{currentPrice.toFixed(2)}</div>
      </div>
    </div>
  )
}
