'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquarePlus, X, Loader2 } from 'lucide-react'

export function RecommendCharacterButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [characters, setCharacters] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = characters.trim()
    if (!trimmed) {
      setStatus('error')
      setErrorMessage('Please enter at least one character name')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/recommend-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characters: trimmed }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMessage(data.error ?? 'Something went wrong')
        return
      }

      setStatus('success')
      setCharacters('')
    } catch {
      setStatus('error')
      setErrorMessage('Failed to send. Please try again.')
    }
  }

  const handleClose = () => {
    if (status !== 'loading') {
      setIsOpen(false)
      setStatus('idle')
      setErrorMessage('')
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-black/20 rounded-lg font-mono text-sm text-black/80 hover:border-op-red/50 hover:text-op-red transition-all shadow-sm"
      >
        <MessageSquarePlus className="w-4 h-4" />
        Recommend Characters
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border-2 border-black/20 rounded-lg shadow-xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-2xl text-black">Recommend Characters</h3>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={status === 'loading'}
                  className="p-1 rounded hover:bg-black/5 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-black/60 text-sm font-mono mb-4">
                Want to trade a character not yet on the site? Tell us who you&apos;d like to see added.
              </p>

              <form onSubmit={handleSubmit}>
                <textarea
                  value={characters}
                  onChange={(e) => setCharacters(e.target.value)}
                  placeholder="e.g. Shanks, Kuzan, Charlotte Katakuri..."
                  rows={4}
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 border-2 border-black/20 rounded-lg font-mono text-sm resize-none focus:border-op-red/50 focus:outline-none disabled:opacity-50"
                />

                {status === 'error' && (
                  <p className="mt-2 text-sm text-op-red font-mono">{errorMessage}</p>
                )}
                {status === 'success' && (
                  <p className="mt-2 text-sm text-green-600 font-mono">
                    Thanks! Your recommendation has been sent.
                  </p>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={status === 'loading'}
                    className="flex-1 px-4 py-2 border-2 border-black/20 rounded-lg font-mono text-sm hover:bg-black/5 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex-1 px-4 py-2 bg-op-red text-white border-2 border-op-red rounded-lg font-mono text-sm hover:bg-op-red/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Recommendation'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
