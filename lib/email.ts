const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

interface EmailData {
  to: string
  subject: string
  html: string
  text: string
}

export async function sendEmail(data: EmailData): Promise<boolean> {
  if (!process.env.BREVO_API_KEY) {
    console.log('Email Demo Mode - Would send:')
    console.log('From: admin@fixingmaritime.com')
    console.log('To:', data.to)
    console.log('Subject:', data.subject)
    console.log('Preview:', data.text.substring(0, 100) + '...')
    return true
  }

  try {
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'admin@fixingmaritime.com'

    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Fixing Maritime', email: senderEmail },
        to: [{ email: data.to }],
        subject: data.subject,
        htmlContent: data.html,
        textContent: data.text,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Brevo API error:', error)
      return false
    }

    console.log('Email sent successfully via Brevo to:', data.to)
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

export function generateVerificationEmail(name: string, verificationUrl: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email - Fixing Maritime</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Fixing Maritime</h1>
          <h2>Welcome Aboard!</h2>
        </div>
        <div class="content">
          <p>Hello ${name},</p>

          <p>Thank you for joining Fixing Maritime! We're excited to have you as part of our maritime logistics family.</p>

          <p>To complete your registration and start using our services, please verify your email address by clicking the button below:</p>

          <p style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </p>

          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px; font-family: monospace;">
            ${verificationUrl}
          </p>

          <p><strong>This verification link will expire in 24 hours.</strong></p>

          <p>Once verified, you'll be able to:</p>
          <ul>
            <li>Access your dashboard</li>
            <li>Place orders for maritime services</li>
            <li>Track your shipments in real-time</li>
            <li>Manage your account preferences</li>
          </ul>

          <p>If you didn't create an account with us, please ignore this email.</p>

          <p>Need help? Contact our support team at <a href="mailto:fixmaritime@gmail.com">fixmaritime@gmail.com</a></p>

          <p>Best regards,<br>The Fixing Maritime Team</p>
        </div>
        <div class="footer">
          <p>Fixing Maritime | Professional Maritime Logistics Solutions</p>
          <p>This email was sent to ${name} regarding account verification.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
Welcome to Fixing Maritime!

Hello ${name},

Thank you for joining Fixing Maritime! To complete your registration, please verify your email address by visiting:

${verificationUrl}

This verification link will expire in 24 hours.

Once verified, you'll have access to:
- Your personalized dashboard
- All maritime logistics services
- Real-time shipment tracking
- Account management tools

If you didn't create an account with us, please ignore this email.

Need help? Contact us at fixmaritime@gmail.com

Best regards,
The Fixing Maritime Team
  `

  return { html, text }
}
