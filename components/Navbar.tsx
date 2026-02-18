'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ReferFriendModal } from './ReferFriendModal'
import { Users } from 'lucide-react'

export function Navbar() {
  const { data: session } = useSession()
  const [showReferModal, setShowReferModal] = useState(false)

  const { data: friendsData } = useQuery<{ pendingReceived: unknown[] }>({
    queryKey: ['friends'],
    queryFn: async () => {
      const res = await fetch('/api/friends')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    enabled: !!session,
    refetchInterval: 30000,
  })

  const notificationCount = friendsData?.pendingReceived?.length ?? 0

  return (
    <nav className="bg-white border-b border-black/10 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-3xl text-black hover:text-op-red transition-colors flex items-center">
            <span>
              <span className="text-black">THE GRAND LINE</span>{' '}
              <span className="text-op-red">EXCHANGE</span>
            </span>
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="/trading"
              className="text-black/70 hover:text-op-red transition-colors font-medium text-sm uppercase tracking-wider"
            >
              Trading Floor
            </Link>
            {session ? (
              <>
                <motion.button
                  onClick={() => setShowReferModal(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1.5 text-black/70 hover:text-op-red transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  <Users className="w-4 h-4" />
                  Refer a Friend
                </motion.button>
                <Link
                  href="/feed"
                  className="text-black/70 hover:text-op-red transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  Feed
                </Link>
                <Link
                  href="/friends"
                  className="relative inline-flex items-center text-black/70 hover:text-op-red transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  Friends
                  {notificationCount > 0 && (
                    <span className="absolute -top-2 -right-4 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-op-red text-[10px] font-bold text-white px-1 pointer-events-none">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/portfolio"
                  className="text-black/70 hover:text-op-red transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  Portfolio
                </Link>
                <Link
                  href="/leaderboard"
                  className="text-black/70 hover:text-op-red transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  Leaderboard
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-black/60 text-xs font-mono border border-black/20 px-3 py-1 rounded">
                    @{session.user.username}
                  </span>
                  <motion.button
                    onClick={() => signOut()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-op-red hover:bg-op-orange text-white px-6 py-2 rounded font-medium transition-colors text-sm uppercase tracking-wider"
                  >
                    Logout
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-black/70 hover:text-op-red transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-op-red hover:bg-op-orange text-white px-6 py-2 rounded font-medium transition-colors text-sm uppercase tracking-wider"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {session?.user?.username && (
        <ReferFriendModal
          isOpen={showReferModal}
          onClose={() => setShowReferModal(false)}
          username={session.user.username}
        />
      )}
    </nav>
  )
}
