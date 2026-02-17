'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { celebrateTrade } from '@/lib/confetti'
import { AlertCircle } from 'lucide-react'

interface CharacterData {
  id: string
  slug: string
  displayName: string
  price: number
}

interface Quote {
  amountOut: string
  fee: string
  priceBefore: string
  priceAfter: string
  minOut: string
}

export function TradingPanel({ character }: { character: CharacterData }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')
  const [amountIn, setAmountIn] = useState('')
  const [slippageBps, setSlippageBps] = useState(100) // 1%
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check market status
  const { data: marketStatus } = useQuery({
    queryKey: ['marketStatus'],
    queryFn: async () => {
      const res = await fetch('/api/market/status')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    refetchInterval: 5000,
  })

  const isMarketOpen = marketStatus?.isOpen ?? true

  useEffect(() => {
    if (!amountIn || parseFloat(amountIn) <= 0) {
      setQuote(null)
      return
    }

    const fetchQuote = async () => {
      try {
        const res = await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: character.slug,
            side,
            amountIn,
            slippageBps,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          setError(data.error || 'Failed to get quote')
          setQuote(null)
          return
        }

        const data = await res.json()
        setQuote(data)
        setError('')
      } catch (err) {
        setError('Failed to get quote')
        setQuote(null)
      }
    }

    const timeoutId = setTimeout(fetchQuote, 300) // Debounce
    return () => clearTimeout(timeoutId)
  }, [character.slug, side, amountIn, slippageBps])

  const handleTrade = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    if (!quote || !amountIn) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const clientNonce = crypto.randomUUID()
      const res = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: character.slug,
          side,
          amountIn,
          slippageBps,
          clientNonce,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Trade failed')
        return
      }

      // Success - celebrate and reset
      celebrateTrade()
      setAmountIn('')
      setQuote(null)
      router.refresh()
    } catch (err) {
      setError('Trade execution failed')
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm">
        <p className="text-center text-black/60 mb-4 font-mono text-sm">Please login to trade</p>
        <motion.button
          onClick={() => router.push('/login')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-op-red hover:bg-op-orange text-white py-3 rounded font-mono text-sm uppercase tracking-wider transition-colors"
        >
          Login
        </motion.button>
      </div>
    )
  }

  if (!isMarketOpen) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white border-2 border-op-red/30 rounded-lg p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-op-red" />
          <h2 className="font-display text-2xl text-black">MARKET CLOSED</h2>
        </div>
        <p className="text-black/70 mb-2 font-mono text-sm">
          The Grand Line Exchange is currently closed due to a special event.
        </p>
        {marketStatus?.lastEvent && (
          <p className="text-op-red font-mono text-sm font-semibold mb-4">
            Event: {marketStatus.lastEvent}
          </p>
        )}
        <p className="text-black/60 font-mono text-xs">
          Trading will resume when the market reopens. Prices may gap when trading resumes.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm"
    >
      <h2 className="font-display text-3xl text-black mb-6">TRADE</h2>

      <div className="flex gap-2 mb-6">
        <motion.button
          onClick={() => {
            setSide('BUY')
            setAmountIn('')
            setQuote(null)
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex-1 py-3 rounded font-mono text-sm uppercase tracking-wider transition-all ${
            side === 'BUY'
              ? 'bg-op-yellow text-black font-bold border-2 border-op-yellow'
              : 'bg-white text-black/70 border-2 border-black/20 hover:border-black/40'
          }`}
        >
          Buy
        </motion.button>
        <motion.button
          onClick={() => {
            setSide('SELL')
            setAmountIn('')
            setQuote(null)
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex-1 py-3 rounded font-mono text-sm uppercase tracking-wider transition-all ${
            side === 'SELL'
              ? 'bg-op-red text-white font-bold border-2 border-op-red'
              : 'bg-white text-black/70 border-2 border-black/20 hover:border-black/40'
          }`}
        >
          Sell
        </motion.button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-black/60 font-mono uppercase tracking-wider mb-2">
            {side === 'BUY' ? 'Berries In' : 'Tokens In'}
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-3 bg-white border-2 border-black/20 rounded text-black font-mono placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-op-red focus:border-op-red"
          />
        </div>

        <div>
          <label className="block text-xs text-black/60 font-mono uppercase tracking-wider mb-2">
            Slippage Tolerance
          </label>
          <select
            value={slippageBps}
            onChange={(e) => setSlippageBps(parseInt(e.target.value))}
            className="w-full px-4 py-3 bg-white border-2 border-black/20 rounded text-black font-mono focus:outline-none focus:ring-2 focus:ring-op-red focus:border-op-red"
          >
            <option value={50}>0.5%</option>
            <option value={100}>1%</option>
            <option value={200}>2%</option>
            <option value={500}>5%</option>
          </select>
        </div>

        <AnimatePresence>
          {quote && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-black/5 border-2 border-black/10 p-4 rounded space-y-3"
            >
              <div className="flex justify-between">
                <span className="text-xs text-black/60 font-mono uppercase">
                  {side === 'BUY' ? 'Tokens Out' : 'Berries Out'}
                </span>
                <span className="text-sm font-mono text-black font-semibold">
                  {parseFloat(quote.amountOut).toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-black/60 font-mono uppercase">Fee</span>
                <span className="text-sm font-mono text-black/80">{parseFloat(quote.fee).toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-black/60 font-mono uppercase">Price</span>
                <span className="text-sm font-mono text-black/80">
                  ₿{parseFloat(quote.priceAfter).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-black/50 font-mono pt-2 border-t border-black/10">
                <span>Min. Out</span>
                <span>{parseFloat(quote.minOut).toFixed(4)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-op-red/20 border-2 border-op-red/50 text-op-red px-4 py-3 rounded text-sm font-mono"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleTrade}
          disabled={!quote || loading || !amountIn}
          whileHover={!loading && quote ? { scale: 1.02 } : {}}
          whileTap={!loading && quote ? { scale: 0.98 } : {}}
          className="w-full bg-op-red hover:bg-op-orange text-white py-3 rounded font-mono text-sm uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-op-red/50"
        >
          {loading ? 'Executing...' : `${side} ${character.displayName}`}
        </motion.button>
      </div>
    </motion.div>
  )
}
