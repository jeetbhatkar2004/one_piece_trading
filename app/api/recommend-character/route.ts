import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Resend } from 'resend'
import { authOptions } from '@/lib/auth'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const recipientEmail = process.env.RECOMMENDATIONS_EMAIL
    if (!recipientEmail) {
      console.error('RECOMMENDATIONS_EMAIL not configured')
      return NextResponse.json(
        { error: 'Recommendations are temporarily unavailable' },
        { status: 500 }
      )
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return NextResponse.json(
        { error: 'Recommendations are temporarily unavailable' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { characters } = body as { characters: string }

    if (!characters || typeof characters !== 'string') {
      return NextResponse.json(
        { error: 'Please enter at least one character name' },
        { status: 400 }
      )
    }

    const trimmed = characters.trim()
    if (!trimmed) {
      return NextResponse.json(
        { error: 'Please enter at least one character name' },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)
    const user = session?.user as { username?: string; name?: string; email?: string } | undefined
    const submittedBy = user?.username ?? user?.name ?? user?.email ?? 'Anonymous'

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'Grand Line Exchange <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: `[Grand Line Exchange] Character Recommendation`,
      html: `
        <h2>New Character Recommendation</h2>
        <p><strong>Submitted by:</strong> ${submittedBy}</p>
        <p><strong>Suggested characters:</strong></p>
        <pre style="background:#f4f4f4;padding:12px;border-radius:6px;white-space:pre-wrap;">${trimmed}</pre>
        <p><em>Sent from The Grand Line Exchange</em></p>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send recommendation. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Recommend character error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}
