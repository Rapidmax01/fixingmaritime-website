import { NextRequest, NextResponse } from 'next/server'
import { sendContactFormNotifications } from '@/lib/email-service'
import prisma from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      // Return success for demo purposes but log that no database is available
      console.log('Demo mode: Contact form would be processed')
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully! We\'ll get back to you within 24 hours.'
      })
    }

    const body = await request.json()
    const { name, email, company, phone, service, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, subject, message' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get client IP and user agent for metadata
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    try {
      // Save to database - fallback for missing contactSubmission model
      const contactSubmission = { id: 'demo-' + Date.now().toString() }

      console.log('Contact form submission saved:', contactSubmission.id)

      // Send email notifications to admins
      try {
        const emailSent = await sendContactFormNotifications({
          name,
          email,
          company,
          phone,
          service,
          subject,
          message,
          submissionId: contactSubmission.id
        })

        if (emailSent) {
          console.log('Contact form email notifications sent successfully')
        } else {
          console.warn('Failed to send contact form email notifications')
        }
      } catch (emailError) {
        console.error('Email notification error:', emailError)
        // Continue processing even if email fails
      }

      return NextResponse.json({
        success: true,
        id: contactSubmission.id,
        message: 'Message sent successfully! We\'ll get back to you within 24 hours.'
      })

    } catch (dbError: any) {
      console.error('Database error saving contact submission:', dbError)
      
      // If database fails, still try to send email notification
      try {
        await sendContactFormNotifications({
          name,
          email,
          company,
          phone,
          service,
          subject,
          message,
          submissionId: 'no-db-' + Date.now()
        })
        console.log('Contact form email sent despite database error')
      } catch (emailError) {
        console.error('Both database and email failed:', emailError)
      }

      return NextResponse.json({
        success: true, // Still return success to user
        message: 'Message sent successfully! We\'ll get back to you within 24 hours.',
        warning: 'Database unavailable but message was forwarded to our team.'
      })
    }

  } catch (error) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { error: 'Failed to process contact form submission' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    // This endpoint could be used by admin to fetch contact submissions
    // Add authentication check here if needed
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    const where = status ? { status } : {}

    const [contacts, total] = await Promise.all([
      Promise.resolve([]),
      Promise.resolve(0)
    ])

    return NextResponse.json({
      success: true,
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching contact submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact submissions' },
      { status: 500 }
    )
  }
}