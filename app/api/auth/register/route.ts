import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { verifyOTPSchema } from '@/lib/validation'
import { verifyOTP } from '@/lib/otp'

const REFERRAL_BONUS_BERRIES = 500
const REFERRAL_VALID_DAYS = 7

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, email, password, code, refCode, refClickedAt } = verifyOTPSchema.parse(body)

    // Verify OTP
    const isValidOTP = await verifyOTP(email, code)
    if (!isValidOTP) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.username === username ? 'Username already exists' : 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Validate referral: must be within 7 days of link click
    let referrerId: string | null = null
    if (refCode && refClickedAt) {
      const refAgeMs = Date.now() - refClickedAt
      if (refAgeMs <= REFERRAL_VALID_DAYS * 24 * 60 * 60 * 1000) {
        const referrer = await prisma.user.findUnique({
          where: { username: refCode },
          include: { wallet: true },
        })
        if (referrer && referrer.username !== username) {
          referrerId = referrer.id
        }
      }
    }

    // Create user and wallet in transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          username,
          email,
          passwordHash,
          emailVerified: true,
        },
      })

      await tx.wallet.create({
        data: {
          userId: newUser.id,
          berriesBalance: 1000, // Starting balance
        },
      })

      // Award referral bonus if valid
      if (referrerId) {
        const existingReferral = await tx.referral.findUnique({
          where: { referredUserId: newUser.id },
        })
        if (!existingReferral) {
          await tx.referral.create({
            data: {
              referrerId,
              referredUserId: newUser.id,
              berriesAwarded: REFERRAL_BONUS_BERRIES,
            },
          })
          await tx.wallet.update({
            where: { userId: referrerId },
            data: {
              berriesBalance: {
                increment: REFERRAL_BONUS_BERRIES,
              },
            },
          })
        }
      }

      return newUser
    })

    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
