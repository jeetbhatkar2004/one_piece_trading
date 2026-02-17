'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid username or password')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-black/20 rounded-lg p-8 shadow-sm"
          >
            <div className="text-center mb-8">
              <h1 className="text-5xl text-black mb-2">WELCOME BACK</h1>
              <div className="accent-line w-32 mx-auto my-4"></div>
              <p className="text-black/60 font-mono text-sm uppercase tracking-wider">Login to continue trading</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-op-red/20 border-2 border-op-red/50 text-op-red px-4 py-3 rounded text-sm font-mono"
                >
                  {error}
                </motion.div>
              )}
              <div>
                <label className="block text-xs text-black/60 font-mono uppercase tracking-wider mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-black/20 rounded text-black font-mono placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-op-red focus:border-op-red"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-xs text-black/60 font-mono uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-black/20 rounded text-black font-mono placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-op-red focus:border-op-red"
                  placeholder="Enter your password"
                />
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-op-red hover:bg-op-orange text-white py-3 rounded font-mono text-sm uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </motion.button>
            </form>
            <p className="mt-6 text-center text-sm text-black/60 font-mono">
              Don't have an account?{' '}
              <Link href="/register" className="text-op-red hover:text-op-orange font-semibold">
                Register
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
