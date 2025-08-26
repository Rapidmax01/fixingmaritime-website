import nodemailer from 'nodemailer'

interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

// Configure Gmail service using existing environment variables
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.log('Email service not configured - email would be sent:', data.subject)
      return true // Return true in development to avoid blocking
    }

    await transporter.sendMail({
      from: `"Fixing Maritime" <${process.env.GMAIL_USER}>`,
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    })

    console.log('Email sent successfully to:', data.to)
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

export function generateQuoteResponseEmail(data: {
  customerName: string
  serviceName: string
  adminResponse: string
  quotedAmount?: number
  quotedCurrency?: string
  status: string
  quoteId: string
}): { subject: string; html: string; text: string } {
  const { customerName, serviceName, adminResponse, quotedAmount, quotedCurrency, status, quoteId } = data
  
  const subject = `Quote Response: ${serviceName} - Fixing Maritime`
  
  const statusMessage = {
    quoted: 'We have prepared a quote for your request',
    accepted: 'Your quote has been accepted',
    rejected: 'We cannot proceed with your request at this time',
    completed: 'Your service has been completed'
  }[status] || 'Your quote has been updated'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .quote-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; text-transform: capitalize; }
        .status-quoted { background: #dbeafe; color: #1e40af; }
        .status-accepted { background: #dcfce7; color: #166534; }
        .status-rejected { background: #fef2f2; color: #dc2626; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Quote Response</h1>
          <p>${statusMessage}</p>
        </div>
        
        <div class="content">
          <p>Dear ${customerName},</p>
          
          <p>We have reviewed your quote request for <strong>${serviceName}</strong>.</p>
          
          <div class="quote-details">
            <h3>Quote Details</h3>
            <p><strong>Status:</strong> <span class="status-badge status-${status}">${status}</span></p>
            <p><strong>Quote ID:</strong> ${quoteId}</p>
            ${quotedAmount ? `<p><strong>Quoted Amount:</strong> ${quotedCurrency} ${quotedAmount.toLocaleString()}</p>` : ''}
            
            <h4>Our Response:</h4>
            <p style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
              ${adminResponse.replace(/\n/g, '<br>')}
            </p>
          </div>
          
          <p>You can view and manage your quote requests in your customer dashboard.</p>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.fixingmaritime.com'}/dashboard" class="button">
            View Dashboard
          </a>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>
          The Fixing Maritime Team</p>
        </div>
        
        <div class="footer">
          <p>© 2024 Fixing Maritime. All rights reserved.</p>
          <p>Email: admin@fixingmaritime.com | Phone: +234 XXX XXX XXXX</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
Dear ${customerName},

We have reviewed your quote request for ${serviceName}.

${statusMessage}

Quote Details:
- Status: ${status.toUpperCase()}
- Quote ID: ${quoteId}
${quotedAmount ? `- Quoted Amount: ${quotedCurrency} ${quotedAmount.toLocaleString()}` : ''}

Our Response:
${adminResponse}

You can view and manage your quote requests in your customer dashboard at:
${process.env.NEXT_PUBLIC_APP_URL || 'https://www.fixingmaritime.com'}/dashboard

If you have any questions, please contact us at admin@fixingmaritime.com

Best regards,
The Fixing Maritime Team
  `.trim()

  return { subject, html, text }
}