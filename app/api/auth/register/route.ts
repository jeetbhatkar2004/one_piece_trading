import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { verifyOTPSchema } from '@/lib/validation'
import { verifyOTP } from '@/lib/otp'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, email, password, code } = verifyOTPSchema.parse(body)

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
