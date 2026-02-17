'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check } from 'lucide-react'

interface ReferFriendModalProps {
  isOpen: boolean
  onClose: () => void
  username: string
}

const REF_STORAGE_KEY = 'grandline_ref'

export function ReferFriendModal({ isOpen, onClose, username }: ReferFriendModalProps) {
  const [copied, setCopied] = useState(false)
  const referralUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/register?ref=${encodeURIComponent(username)}`
    : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select and copy
      const input = document.createElement('input')
      input.value = referralUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white border-2 border-black/20 rounded-lg shadow-xl max-w-md w-full p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-2xl text-black">Refer a Friend</h3>
            <button
              onClick={onClose}
              className="p-1 text-black/60 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-black/70 mb-4 font-mono text-sm">
            Share your link. When your friend creates an account <strong>within the next 7 days</strong>, you&apos;ll get <strong className="text-op-yellow">500 berries</strong>!
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={referralUrl}
              className="flex-1 px-4 py-3 bg-black/5 border-2 border-black/10 rounded font-mono text-sm text-black truncate"
            />
            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-3 bg-op-red hover:bg-op-orange text-white rounded font-mono text-sm uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export function storeRefFromUrl() {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const ref = params.get('ref')
  if (ref) {
    try {
      localStorage.setItem(REF_STORAGE_KEY, JSON.stringify({
        ref,
        ts: Date.now(),
      }))
    } catch {}
  }
}

export function getStoredRef(): { refCode: string; refClickedAt: number } | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(REF_STORAGE_KEY)
    if (!stored) return null
    const { ref, ts } = JSON.parse(stored)
    return { refCode: ref, refClickedAt: ts }
  } catch {
    return null
  }
}

export function clearStoredRef() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(REF_STORAGE_KEY)
  } catch {}
}
