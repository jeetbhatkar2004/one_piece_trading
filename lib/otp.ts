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

// For development: log OTP to console instead of sending email
export async function sendOTPEmail(email: string, code: string): Promise<void> {
  // In production, use a service like SendGrid, Resend, etc.
  console.log(`[OTP] Email: ${email}, Code: ${code}`)
  // TODO: Implement actual email sending
}
