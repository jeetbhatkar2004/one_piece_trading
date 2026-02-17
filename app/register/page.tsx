'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { storeRefFromUrl, getStoredRef, clearStoredRef } from '@/components/ReferFriendModal'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

type Step = 'email' | 'otp' | 'details'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null)

  useEffect(() => {
    storeRefFromUrl()
  }, [])

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to send OTP')
        return
      }

      setOtpSent(true)
      setStep('otp')
      // In development, surface OTP so it's easy to use
      if (data.code) {
        setDevOtpCode(data.code as string)
        // Also log to console for convenience
        console.log('OTP Code:', data.code)
      } else {
        setDevOtpCode(null)
      }
    } catch (err) {
      setError('Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const refData = getStoredRef()
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: otp,
          username,
          password,
          ...(refData && { refCode: refData.refCode, refClickedAt: refData.refClickedAt }),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed')
        return
      }

      clearStoredRef()
      router.push('/login?registered=true')
    } catch (err) {
      setError('Registration failed')
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
              <h1 className="font-display text-5xl text-black mb-2">JOIN THE CREW</h1>
              <div className="accent-line w-32 mx-auto my-4"></div>
              <p className="text-black/60 font-mono text-sm uppercase tracking-wider">Start trading with 1,000 free berries!</p>
            </div>

            <AnimatePresence mode="wait">
              {step === 'email' && (
                <motion.form
                  key="email"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleRequestOTP}
                  className="space-y-6"
                >
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
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-black/20 rounded text-black font-mono placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-op-red focus:border-op-red"
                      placeholder="your@email.com"
                    />
                    <p className="mt-1 text-xs text-black/40 font-mono">
                      We&apos;ll send you a verification code
                    </p>
                  </div>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-op-red hover:bg-op-orange text-white py-3 rounded font-mono text-sm uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Verification Code'}
                  </motion.button>
                </motion.form>
              )}

              {step === 'otp' && (
                <motion.form
                  key="otp"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleVerifyOTP}
                  className="space-y-6"
                >
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-op-red/20 border-2 border-op-red/50 text-op-red px-4 py-3 rounded text-sm font-mono"
                    >
                      {error}
                    </motion.div>
                  )}
                  {devOtpCode && (
                    <div className="bg-black/5 border border-black/10 px-3 py-2 rounded text-xs font-mono text-black/70">
                      Dev code: <span className="font-semibold">{devOtpCode}</span>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-xs text-black/60 font-mono uppercase tracking-wider mb-2">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      maxLength={6}
                      className="w-full px-4 py-3 bg-white border-2 border-black/20 rounded text-black font-mono placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-op-red focus:border-op-red text-center text-2xl tracking-widest"
                      placeholder="000000"
                    />
                    <p className="mt-1 text-xs text-black/40 font-mono text-center">
                      Enter the 6-digit code sent to {email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs text-black/60 font-mono uppercase tracking-wider mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      minLength={3}
                      maxLength={20}
                      pattern="[a-zA-Z0-9_]+"
                      className="w-full px-4 py-3 bg-white border-2 border-black/20 rounded text-black font-mono placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-op-red focus:border-op-red"
                      placeholder="Choose a username"
                    />
                    <p className="mt-1 text-xs text-black/40 font-mono">
                      3-20 characters, letters, numbers, and underscores only
                    </p>
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
                      minLength={6}
                      className="w-full px-4 py-3 bg-white border-2 border-black/20 rounded text-black font-mono placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-op-red focus:border-op-red"
                      placeholder="Create a password"
                    />
                    <p className="mt-1 text-xs text-black/40 font-mono">Minimum 6 characters</p>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      type="button"
                      onClick={() => {
                        setStep('email')
                        setOtp('')
                        setError('')
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-white border-2 border-black/20 hover:border-black/40 text-black py-3 rounded font-mono text-sm uppercase tracking-wider transition-colors"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-op-red hover:bg-op-orange text-white py-3 rounded font-mono text-sm uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Creating...' : 'Create Account'}
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="mt-6 text-center text-sm text-black/60 font-mono">
              Already have an account?{' '}
              <Link href="/login" className="text-op-red hover:text-op-orange font-semibold">
                Login
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
