import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateResetToken, getResetTokenExpiration } from '@/lib/auth-utils'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Find user (but don't reveal if they exist or not)
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    // Always return success even if user doesn't exist (security)
    if (!user || !user.isActive) {
      return NextResponse.json({ success: true })
    }

    // Delete any existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: normalizedEmail },
    })

    // Create new reset token
    const token = generateResetToken()
    const expiresAt = getResetTokenExpiration()

    await prisma.passwordResetToken.create({
      data: {
        email: normalizedEmail,
        token,
        expiresAt,
      },
    })

    // Build reset URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`

    // Send email
    const emailResult = await sendPasswordResetEmail({
      email: normalizedEmail,
      resetUrl,
      userName: user.name,
    })

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error)
      // Still return success to not leak info about user existence
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
