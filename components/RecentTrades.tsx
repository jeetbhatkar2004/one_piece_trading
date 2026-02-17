'use client'

interface Trade {
  id: string
  username: string
  side: string
  tokensOut: string
  berriesOut: string
  price: string
  timestamp: string
}

export function RecentTrades({ trades }: { trades: Trade[] }) {
  if (trades.length === 0) {
    return (
      <div className="text-black/60 text-center py-8 bg-black/5 rounded border-2 border-black/10">
        <div className="font-mono text-sm">No trades yet. Be the first to trade!</div>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {trades.slice(0, 20).map((trade) => (
        <div
          key={trade.id}
          className="flex items-center justify-between py-3 px-4 border-b border-black/10 hover:bg-black/5 transition-colors rounded"
        >
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded font-mono text-xs uppercase tracking-wider border-2 ${
                trade.side === 'BUY'
                  ? 'bg-op-yellow/20 text-op-yellow border-op-yellow/50'
                  : 'bg-op-red/20 text-op-red border-op-red/50'
              }`}
            >
              {trade.side}
            </span>
            <span className="text-sm font-mono text-black">@{trade.username}</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-mono font-semibold text-black">
              {parseFloat(trade.tokensOut).toFixed(4)} tokens
            </div>
            <div className="text-xs font-mono text-black/50">
              ₿{parseFloat(trade.price).toFixed(2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
