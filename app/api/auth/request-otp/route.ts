import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requestOTPSchema } from '@/lib/validation'
import { generateOTP, sendOTPEmail } from '@/lib/otp'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = requestOTPSchema.parse(body)

    // Check if email is already registered
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Generate and send OTP
    const code = await generateOTP(email)
    await sendOTPEmail(email, code)

    return NextResponse.json({
      message: 'OTP sent to email',
      // In development, return code for testing
      ...(process.env.NODE_ENV === 'development' && { code }),
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid email', details: error.errors },
        { status: 400 }
      )
    }

    console.error('OTP request error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
