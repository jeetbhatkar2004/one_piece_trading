import { Resend } from 'resend'
import { prisma } from './prisma'

const OTP_EXPIRY_MINUTES = 10

export async function generateOTP(email: string): Promise<string> {
  // Generate 6-digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES)
  
  // Invalidate any existing OTPs for this email
  await prisma.otp.updateMany({
    where: {
      email,
      used: false,
      expiresAt: { gt: new Date() },
    },
    data: {
      used: true,
    },
  })
  
  // Create new OTP
  await prisma.otp.create({
    data: {
      email,
      code,
      expiresAt,
    },
  })
  
  return code
}

export async function verifyOTP(email: string, code: string): Promise<boolean> {
  const otp = await prisma.otp.findFirst({
    where: {
      email,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  
  if (!otp) {
    return false
  }
  
  // Mark as used
  await prisma.otp.update({
    where: { id: otp.id },
    data: { used: true },
  })
  
  return true
}

export async function sendOTPEmail(email: string, code: string): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    console.error('[OTP] RESEND_API_KEY not configured - OTP not sent. Email:', email, 'Code:', code)
    throw new Error('Email service not configured. Please contact support.')
  }

  const resend = new Resend(resendApiKey)
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'Grand Line Exchange <onboarding@resend.dev>',
    to: [email],
    subject: 'Your verification code - Grand Line Exchange',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h2 style="color:#dc2626;">Grand Line Exchange</h2>
        <p>Your verification code is:</p>
        <p style="font-size:28px;font-weight:bold;letter-spacing:4px;color:#1f2937;">${code}</p>
        <p style="color:#6b7280;font-size:14px;">This code expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
        <p style="color:#6b7280;font-size:14px;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="color:#9ca3af;font-size:12px;">Sent from The Grand Line Exchange</p>
      </div>
    `,
  })

  if (error) {
    console.error('[OTP] Resend error:', error)
    throw new Error('Failed to send verification email')
  }

  // In development, also log for convenience
  if (process.env.NODE_ENV === 'development') {
    console.log(`[OTP] Sent to ${email}, Code: ${code}`)
  }
}
