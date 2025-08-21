import nodemailer from 'nodemailer'

// Create reusable transporter object using Gmail SMTP
const createTransporter = () => {
  // Check if Gmail credentials are configured
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return null
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // info@fixingmaritime.com
      pass: process.env.GMAIL_APP_PASSWORD // App-specific password
    }
  })
}

interface EmailData {
  to: string
  subject: string
  html: string
  text: string
}

export async function sendEmail(data: EmailData): Promise<boolean> {
  const transporter = createTransporter()
  
  // If no transporter (credentials not configured), log to console (demo mode)
  if (!transporter) {
    console.log('📧 Email Demo Mode - Would send:')
    console.log('From: info@fixingmaritime.com')
    console.log('To:', data.to)
    console.log('Subject:', data.subject)
    console.log('Preview:', data.text.substring(0, 100) + '...')
    return true
  }
  
  try {
    // Send email using Gmail SMTP
    const result = await transporter.sendMail({
      from: '"Fixing Maritime" <info@fixingmaritime.com>',
      to: data.to,
      subject: data.subject,
      html: data.html,
      text: data.text,
    })
    
    console.log('✅ Email sent successfully via Gmail:', result.messageId)
    return true
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    // Don't throw error - allow signup to continue
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
          <h1>⚓ Fixing Maritime</h1>
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
          
          <p>Need help? Contact our support team at <a href="mailto:support@fixingmaritime.com">support@fixingmaritime.com</a></p>
          
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

Need help? Contact us at support@fixingmaritime.com

Best regards,
The Fixing Maritime Team
  `

  return { html, text }
}