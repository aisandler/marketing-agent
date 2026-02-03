import { Resend } from 'resend'

// Lazy initialize Resend client to avoid build errors when API key is missing
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured - password reset emails will not be sent')
    return null
  }
  return new Resend(apiKey)
}

interface SendPasswordResetEmailParams {
  email: string
  resetUrl: string
  userName?: string
}

export async function sendPasswordResetEmail({
  email,
  resetUrl,
  userName,
}: SendPasswordResetEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient()
    if (!resend) {
      return { success: false, error: 'Email service not configured' }
    }

    const fromAddress = process.env.EMAIL_FROM || 'Partner Portal <noreply@example.com>'
    const portalName = process.env.PORTAL_NAME || 'Partner Portal'

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: `Reset your password - ${portalName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1a365d 0%, #0891b2 100%); padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">${portalName}</h1>
            </div>

            <!-- Content -->
            <div style="padding: 32px 24px;">
              <p style="margin: 0 0 16px; color: #0f172a; font-size: 16px;">
                Hi${userName ? ` ${userName}` : ''},
              </p>
              <p style="margin: 0 0 24px; color: #475569; font-size: 15px; line-height: 1.6;">
                We received a request to reset your password. Click the button below to create a new password.
              </p>

              <!-- Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}"
                   style="display: inline-block; background: linear-gradient(135deg, #1a365d 0%, #0891b2 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                  Reset Password
                </a>
              </div>

              <p style="margin: 0 0 16px; color: #475569; font-size: 14px; line-height: 1.6;">
                This link will expire in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email.
              </p>

              <p style="margin: 24px 0 0; padding-top: 24px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 13px;">
                If the button doesn't work, copy and paste this link into your browser:
                <br>
                <a href="${resetUrl}" style="color: #0891b2; word-break: break-all;">${resetUrl}</a>
              </p>
            </div>

            <!-- Footer -->
            <div style="padding: 16px 24px; background: #f8fafc; text-align: center;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                ${portalName}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Failed to send password reset email:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    }
  }
}
