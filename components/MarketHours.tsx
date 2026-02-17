'use client'

import { useQuery } from '@tanstack/react-query'
import { Clock, AlertCircle } from 'lucide-react'

export function MarketHours() {
  const { data: marketStatus } = useQuery({
    queryKey: ['marketStatus'],
    queryFn: async () => {
      const res = await fetch('/api/market/status')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    refetchInterval: 5000,
  })

  const isOpen = marketStatus?.isOpen ?? true
  const lastEvent = marketStatus?.lastEvent

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-black/5 border border-black/20 rounded-lg">
      <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
      {isOpen ? (
        <Clock className="w-4 h-4 text-black/60" />
      ) : (
        <AlertCircle className="w-4 h-4 text-op-red" />
      )}
      <span className="font-mono text-xs text-black/70 uppercase tracking-wider">
        {isOpen ? 'MARKET OPEN' : 'MARKET CLOSED'}
      </span>
      {!isOpen && lastEvent && (
        <span className="font-mono text-xs text-op-red">
          • {lastEvent}
        </span>
      )}
    </div>
  )
}
