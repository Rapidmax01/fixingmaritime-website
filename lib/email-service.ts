import nodemailer from 'nodemailer'

interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

// Configure Brevo SMTP service
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
})

export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_KEY) {
      console.log('Email service not configured - email would be sent:', data.subject)
      return true // Return true in development to avoid blocking
    }

    await transporter.sendMail({
      from: `"Fixing Maritime" <${process.env.BREVO_SENDER_EMAIL || 'noreply@fixingmaritime.com'}>`,
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

export function generateNewMessageEmail(data: {
  senderName: string
  senderEmail: string
  subject: string
  content: string
  attachmentCount?: number
}) {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0046A5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8f9fa; }
        .message-details { background: white; padding: 20px; margin-top: 20px; border-left: 4px solid #0046A5; }
        .button { display: inline-block; padding: 10px 20px; background: #0046A5; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Customer Message</h1>
        </div>
        
        <div class="content">
            <p>You have received a new message from a customer:</p>
            
            <div class="message-details">
                <p><strong>From:</strong> ${data.senderName} (${data.senderEmail})</p>
                <p><strong>Subject:</strong> ${data.subject}</p>
                ${data.attachmentCount ? `<p><strong>Attachments:</strong> ${data.attachmentCount} file(s)</p>` : ''}
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p><strong>Message:</strong></p>
                <p>${data.content.replace(/\n/g, '<br>')}</p>
            </div>
            
            <a href="https://www.fixingmaritime.com/admin/inbox" class="button">View Message in Admin Portal</a>
        </div>
        
        <div class="footer">
            <p>This is an automated message from Fixing Maritime.</p>
            <p>Please log in to the admin portal to reply to this message.</p>
        </div>
    </div>
</body>
</html>
  `

  const text = `
New Customer Message

From: ${data.senderName} (${data.senderEmail})
Subject: ${data.subject}
${data.attachmentCount ? `Attachments: ${data.attachmentCount} file(s)` : ''}

Message:
${data.content}

---

View and reply to this message at: https://www.fixingmaritime.com/admin/inbox

This is an automated message from Fixing Maritime.
  `

  return { html, text }
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

export function generateContactFormEmail(data: {
  name: string
  email: string
  company?: string
  phone?: string
  service?: string
  subject: string
  message: string
  submissionId: string
}): { subject: string; html: string; text: string } {
  const { name, email, company, phone, service, subject, message, submissionId } = data
  
  const emailSubject = `New Contact Form Submission: ${subject} - Fixing Maritime`
  
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
        .contact-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .message-content { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
        .urgent { color: #dc2626; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 New Contact Form Submission</h1>
          <p class="urgent">A customer has submitted a contact form</p>
        </div>
        
        <div class="content">
          <div class="contact-details">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            ${phone ? `<p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
            ${service ? `<p><strong>Service of Interest:</strong> ${service}</p>` : ''}
            <p><strong>Submission ID:</strong> ${submissionId}</p>
          </div>
          
          <div class="message-content">
            <h3>Subject: ${subject}</h3>
            <h4>Message:</h4>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <p><strong>⏰ Response Required:</strong> Please respond to this inquiry within 24 hours to maintain excellent customer service.</p>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.fixingmaritime.com'}/admin/contacts" class="button">
            View in Admin Portal
          </a>
          
          <p><strong>Quick Actions:</strong></p>
          <p>• Reply directly to this email to respond to the customer</p>
          <p>• Visit the admin portal to manage all contact submissions</p>
          <p>• Forward this to relevant team members if needed</p>
        </div>
        
        <div class="footer">
          <p>© 2024 Fixing Maritime Admin System</p>
          <p>This is an automated notification from your website contact form</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
🚨 NEW CONTACT FORM SUBMISSION - Fixing Maritime

Customer Information:
- Name: ${name}
- Email: ${email}
${company ? `- Company: ${company}` : ''}
${phone ? `- Phone: ${phone}` : ''}
${service ? `- Service of Interest: ${service}` : ''}
- Submission ID: ${submissionId}

Subject: ${subject}

Message:
${message}

⏰ Response Required: Please respond within 24 hours.

Quick Actions:
• Reply directly to this email to respond to the customer
• Visit the admin portal: ${process.env.NEXT_PUBLIC_APP_URL || 'https://www.fixingmaritime.com'}/admin/contacts

This is an automated notification from your website contact form.
  `.trim()

  return { subject: emailSubject, html, text }
}

export async function sendContactFormNotifications(contactData: {
  name: string
  email: string
  company?: string
  phone?: string
  service?: string
  subject: string
  message: string
  submissionId: string
}): Promise<boolean> {
  const adminEmails = ['fixmaritime@gmail.com']
  const emailContent = generateContactFormEmail(contactData)
  
  try {
    // Send to all admin emails
    const emailPromises = adminEmails.map(email => 
      sendEmail({
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      })
    )
    
    const results = await Promise.allSettled(emailPromises)
    const successes = results.filter(r => r.status === 'fulfilled' && r.value === true).length
    
    console.log(`Contact form notifications: ${successes}/${adminEmails.length} emails sent successfully`)
    
    // Return true if at least one email was sent successfully
    return successes > 0
  } catch (error) {
    console.error('Failed to send contact form notifications:', error)
    return false
  }
}

export async function sendQuoteFormNotifications(quoteData: {
  name: string
  email: string
  company?: string
  phone?: string
  serviceName: string
  projectDescription: string
  timeline?: string
  budget?: string
  quoteId: string
}): Promise<boolean> {
  const adminEmails = ['fixmaritime@gmail.com']
  
  const emailSubject = `New Quote Request: ${quoteData.serviceName} - Fixing Maritime`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #16a34a, #22c55e); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .quote-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a; }
        .message-content { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
        .button { display: inline-block; background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
        .urgent { color: #dc2626; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💰 New Quote Request</h1>
          <p class="urgent">A customer has requested a quote</p>
        </div>
        
        <div class="content">
          <div class="quote-details">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${quoteData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${quoteData.email}">${quoteData.email}</a></p>
            ${quoteData.company ? `<p><strong>Company:</strong> ${quoteData.company}</p>` : ''}
            ${quoteData.phone ? `<p><strong>Phone:</strong> <a href="tel:${quoteData.phone}">${quoteData.phone}</a></p>` : ''}
            <p><strong>Quote ID:</strong> ${quoteData.quoteId}</p>
          </div>
          
          <div class="quote-details">
            <h3>Quote Request Details</h3>
            <p><strong>Service:</strong> ${quoteData.serviceName}</p>
            ${quoteData.timeline ? `<p><strong>Timeline:</strong> ${quoteData.timeline}</p>` : ''}
            ${quoteData.budget ? `<p><strong>Budget:</strong> ${quoteData.budget}</p>` : ''}
          </div>
          
          <div class="message-content">
            <h3>Project Description:</h3>
            <p style="white-space: pre-wrap;">${quoteData.projectDescription}</p>
          </div>
          
          <p><strong>⏰ Response Required:</strong> Please provide a quote within 24-48 hours for optimal customer satisfaction.</p>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.fixingmaritime.com'}/admin/quotes" class="button">
            Respond to Quote
          </a>
          
          <p><strong>Quick Actions:</strong></p>
          <p>• Visit the admin portal to respond with pricing</p>
          <p>• Call the customer directly if urgent</p>
          <p>• Forward to relevant service team</p>
        </div>
        
        <div class="footer">
          <p>© 2024 Fixing Maritime Admin System</p>
          <p>This is an automated notification from your quote request system</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
💰 NEW QUOTE REQUEST - Fixing Maritime

Customer Information:
- Name: ${quoteData.name}
- Email: ${quoteData.email}
${quoteData.company ? `- Company: ${quoteData.company}` : ''}
${quoteData.phone ? `- Phone: ${quoteData.phone}` : ''}
- Quote ID: ${quoteData.quoteId}

Quote Request Details:
- Service: ${quoteData.serviceName}
${quoteData.timeline ? `- Timeline: ${quoteData.timeline}` : ''}
${quoteData.budget ? `- Budget: ${quoteData.budget}` : ''}

Project Description:
${quoteData.projectDescription}

⏰ Response Required: Please provide a quote within 24-48 hours.

Visit the admin portal to respond: ${process.env.NEXT_PUBLIC_APP_URL || 'https://www.fixingmaritime.com'}/admin/quotes

This is an automated notification from your quote request system.
  `.trim()

  try {
    // Send to all admin emails
    const emailPromises = adminEmails.map(email => 
      sendEmail({
        to: email,
        subject: emailSubject,
        html: html,
        text: text
      })
    )
    
    const results = await Promise.allSettled(emailPromises)
    const successes = results.filter(r => r.status === 'fulfilled' && r.value === true).length
    
    console.log(`Quote request notifications: ${successes}/${adminEmails.length} emails sent successfully`)
    
    // Return true if at least one email was sent successfully
    return successes > 0
  } catch (error) {
    console.error('Failed to send quote request notifications:', error)
    return false
  }
}

export function generateTruckRegistrationEmail(data: {
  ownerName: string
  email: string
  companyName: string
  truckMake: string
  truckModel: string
  truckYear: number
  plateNumber: string
  registrationId: string
}): { subject: string; html: string; text: string } {
  const { ownerName, email, companyName, truckMake, truckModel, truckYear, plateNumber, registrationId } = data
  
  const emailSubject = `New Truck Registration: ${truckMake} ${truckModel} - Fixing Maritime`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .registration-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669; }
        .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
        .urgent { color: #dc2626; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚛 New Truck Registration</h1>
          <p class="urgent">A new truck has been registered for partnership</p>
        </div>
        
        <div class="content">
          <div class="registration-details">
            <h3>Owner Information</h3>
            <p><strong>Name:</strong> ${ownerName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Registration ID:</strong> ${registrationId}</p>
          </div>
          
          <div class="registration-details">
            <h3>Vehicle Information</h3>
            <p><strong>Make:</strong> ${truckMake}</p>
            <p><strong>Model:</strong> ${truckModel}</p>
            <p><strong>Year:</strong> ${truckYear}</p>
            <p><strong>Plate Number:</strong> ${plateNumber}</p>
          </div>
          
          <p><strong>⏰ Action Required:</strong> Please review this registration application within 48 hours. Complete verification includes:</p>
          
          <ul>
            <li>Document verification (ID, vehicle papers, insurance)</li>
            <li>Background check</li>
            <li>Vehicle inspection</li>
            <li>Partnership agreement signing</li>
          </ul>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.fixingmaritime.com'}/admin/truck-registrations" class="button">
            Review Registration
          </a>
          
          <p><strong>Next Steps:</strong></p>
          <p>• Visit the admin portal to review all registration details</p>
          <p>• Contact the owner for any clarifications</p>
          <p>• Schedule vehicle inspection if documents are approved</p>
        </div>
        
        <div class="footer">
          <p>© 2024 Fixing Maritime Admin System</p>
          <p>This is an automated notification from your truck registration system</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
🚛 NEW TRUCK REGISTRATION - Fixing Maritime

Owner Information:
- Name: ${ownerName}
- Email: ${email}
- Company: ${companyName}
- Registration ID: ${registrationId}

Vehicle Information:
- Make: ${truckMake}
- Model: ${truckModel}
- Year: ${truckYear}
- Plate Number: ${plateNumber}

⏰ Action Required: Please review within 48 hours.

Review checklist:
• Document verification (ID, vehicle papers, insurance)
• Background check
• Vehicle inspection
• Partnership agreement signing

Visit the admin portal to review: ${process.env.NEXT_PUBLIC_APP_URL || 'https://www.fixingmaritime.com'}/admin/truck-registrations

This is an automated notification from your truck registration system.
  `.trim()

  return { subject: emailSubject, html, text }
}

export function generateTruckRegistrationConfirmationEmail(data: {
  ownerName: string
  companyName: string
  truckMake: string
  truckModel: string
  truckYear: number
  plateNumber: string
  registrationId: string
}): { subject: string; html: string; text: string } {
  const { ownerName, companyName, truckMake, truckModel, truckYear, plateNumber, registrationId } = data
  
  const subject = `Registration Received - ${truckMake} ${truckModel} - Fixing Maritime`
  
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
        .registration-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .next-steps { background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Registration Received!</h1>
          <p>Thank you for joining our truck network</p>
        </div>
        
        <div class="content">
          <p>Dear ${ownerName},</p>
          
          <p>We have successfully received your truck registration application. Thank you for your interest in partnering with Fixing Maritime!</p>
          
          <div class="registration-details">
            <h3>Your Registration Details</h3>
            <p><strong>Registration ID:</strong> ${registrationId}</p>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Vehicle:</strong> ${truckMake} ${truckModel} (${truckYear})</p>
            <p><strong>Plate Number:</strong> ${plateNumber}</p>
            <p><strong>Status:</strong> Under Review</p>
          </div>
          
          <div class="next-steps">
            <h3>What Happens Next?</h3>
            <ol>
              <li><strong>Document Verification (1-2 business days)</strong>
                <br>Our team will review all submitted documents</li>
              <li><strong>Background Check</strong>
                <br>Standard verification process for all partners</li>
              <li><strong>Vehicle Inspection</strong>
                <br>Physical inspection may be required</li>
              <li><strong>Partnership Agreement</strong>
                <br>Final contract signing and onboarding</li>
            </ol>
          </div>
          
          <p><strong>Timeline:</strong> The complete review process typically takes 2-3 business days.</p>
          
          <p><strong>Important Notes:</strong></p>
          <ul>
            <li>Please ensure all documents are current and valid</li>
            <li>Keep your phone available for any verification calls</li>
            <li>We may request additional documents if needed</li>
          </ul>
          
          <p>We'll keep you updated on your application status via email. If you have any questions or need to update any information, please don't hesitate to contact us.</p>
          
          <p>Welcome to the Fixing Maritime family!</p>
          
          <p>Best regards,<br>
          The Fixing Maritime Partnership Team</p>
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
Dear ${ownerName},

Thank you for registering your truck with Fixing Maritime!

We have successfully received your application and our team is now reviewing it.

Your Registration Details:
- Registration ID: ${registrationId}
- Company: ${companyName}
- Vehicle: ${truckMake} ${truckModel} (${truckYear})
- Plate Number: ${plateNumber}
- Status: Under Review

What Happens Next?
1. Document Verification (1-2 business days)
2. Background Check
3. Vehicle Inspection (if required)
4. Partnership Agreement & Onboarding

Timeline: 2-3 business days for complete review

Important Notes:
• Please ensure all documents are current and valid
• Keep your phone available for verification calls
• We may request additional documents if needed

We'll keep you updated via email throughout the process.

If you have any questions, please contact us at admin@fixingmaritime.com

Welcome to the Fixing Maritime family!

Best regards,
The Fixing Maritime Partnership Team
  `.trim()

  return { subject, html, text }
}

export async function sendTruckRegistrationNotifications(registrationData: {
  ownerName: string
  email: string
  companyName: string
  truckMake: string
  truckModel: string
  truckYear: number
  plateNumber: string
  registrationId: string
}): Promise<boolean> {
  const adminEmails = ['fixmaritime@gmail.com']
  
  try {
    // Send notification to admin team
    const adminEmailContent = generateTruckRegistrationEmail(registrationData)
    const adminEmailPromises = adminEmails.map(email => 
      sendEmail({
        to: email,
        subject: adminEmailContent.subject,
        html: adminEmailContent.html,
        text: adminEmailContent.text
      })
    )
    
    // Send confirmation to truck owner
    const ownerEmailContent = generateTruckRegistrationConfirmationEmail(registrationData)
    const ownerEmailPromise = sendEmail({
      to: registrationData.email,
      subject: ownerEmailContent.subject,
      html: ownerEmailContent.html,
      text: ownerEmailContent.text
    })
    
    // Wait for all emails to be sent
    const results = await Promise.allSettled([...adminEmailPromises, ownerEmailPromise])
    const successes = results.filter(r => r.status === 'fulfilled' && r.value === true).length
    
    console.log(`Truck registration notifications: ${successes}/${results.length} emails sent successfully`)
    
    // Return true if at least one email was sent successfully
    return successes > 0
  } catch (error) {
    console.error('Failed to send truck registration notifications:', error)
    return false
  }
}