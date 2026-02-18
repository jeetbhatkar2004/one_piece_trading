import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requestOTPSchema } from '@/lib/validation'
import { generateOTP, sendOTPEmail } from '@/lib/otp'

export async function POST(req: NextRequest) {
  try {
    // Fail fast if no email service configured
    const hasGmail = process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD
    const hasResend = !!process.env.RESEND_API_KEY
    if (!hasGmail && !hasResend) {
      console.error('[request-otp] No email service: set GMAIL_USER+GMAIL_APP_PASSWORD or RESEND_API_KEY')
      return NextResponse.json(
        { error: 'Failed to send OTP. Please contact support.' },
        { status: 500 }
      )
    }

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

    // Log full error for debugging in Vercel logs
    console.error('[request-otp] Error:', error?.message ?? error)
    if (error?.cause) console.error('[request-otp] Cause:', error.cause)
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
