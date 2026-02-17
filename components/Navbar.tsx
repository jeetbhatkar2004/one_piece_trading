'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white border-b border-black/10 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-3xl text-black hover:text-op-red transition-colors flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="The Grand Line Exchange"
              width={100}
              height={100}
              className="object-contain"
              unoptimized
            />
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
                <Link
                  href="/feed"
                  className="text-black/70 hover:text-op-red transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  Feed
                </Link>
                <Link
                  href="/friends"
                  className="text-black/70 hover:text-op-red transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  Friends
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
    </nav>
  )
}
