'use client'

import { useState, useEffect } from 'react'

const BETA_PASSWORD = 'fraudmihawk'
const STORAGE_KEY = 'grand-line-beta-access'

export function BetaGate({ children }: { children: React.ReactNode }) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(STORAGE_KEY)
    setHasAccess(stored === BETA_PASSWORD)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmed = password.trim().toLowerCase()
    if (trimmed === BETA_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, BETA_PASSWORD)
      setHasAccess(true)
    } else {
      setError('Incorrect password. Try again.')
      setPassword('')
    }
  }

  if (hasAccess === null) {
    return (
      <div className="min-h-screen bg-black/5 flex items-center justify-center">
        <div className="animate-pulse text-black/40 font-mono">Loading...</div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.8),transparent_30%,transparent_70%,rgba(0,0,0,0.9))]" />
        <div className="relative z-10 text-center max-w-md w-full">
          <h1 className="font-display text-4xl md:text-5xl tracking-wider mb-2 text-white">
            THE GRAND LINE EXCHANGE
          </h1>
          <p className="text-white/60 font-mono text-sm mb-8">
            Beta Access
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg font-mono text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            {error && (
              <p className="text-red-400 text-sm font-mono">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-mono uppercase tracking-wider rounded-lg transition-colors"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
