import { PrismaClient } from '@prisma/client'
import { sendEmail, generateQuoteResponseEmail } from './email-service'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

interface CreateNotificationData {
  recipientEmail: string
  recipientName?: string
  type: string
  title: string
  message: string
  relatedId?: string
  relatedType?: string
  data?: any
}

export async function createNotification(notificationData: CreateNotificationData) {
  try {
    if (!prisma) {
      console.log('Database not available - notification would be created:', notificationData.title)
      return { success: false, error: 'Database not available' }
    }

    const notification = await prisma.notification.create({
      data: {
        recipientEmail: notificationData.recipientEmail,
        recipientName: notificationData.recipientName,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        relatedId: notificationData.relatedId,
        relatedType: notificationData.relatedType,
        data: notificationData.data || {},
        status: 'unread',
        emailSent: false
      }
    })

    return { success: true, notification }
  } catch (error) {
    console.error('Failed to create notification:', error)
    return { success: false, error: 'Failed to create notification' }
  }
}

export async function sendQuoteResponseNotification(
  quoteRequest: any,
  adminResponse: string,
  quotedAmount?: number,
  quotedCurrency?: string
) {
  try {
    // Create inbox notification
    const notificationData = {
      recipientEmail: quoteRequest.email,
      recipientName: quoteRequest.name,
      type: 'quote_response',
      title: `Quote Response: ${quoteRequest.serviceName}`,
      message: adminResponse,
      relatedId: quoteRequest.id,
      relatedType: 'quote_request',
      data: {
        serviceName: quoteRequest.serviceName,
        quotedAmount,
        quotedCurrency,
        status: quoteRequest.status
      }
    }

    const notificationResult = await createNotification(notificationData)
    
    // Generate and send email
    const emailData = generateQuoteResponseEmail({
      customerName: quoteRequest.name,
      serviceName: quoteRequest.serviceName,
      adminResponse,
      quotedAmount,
      quotedCurrency,
      status: quoteRequest.status,
      quoteId: quoteRequest.id
    })

    const emailSent = await sendEmail({
      to: quoteRequest.email,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text
    })

    // Update notification with email status
    if (notificationResult.success && notificationResult.notification && prisma) {
      try {
        await prisma.notification.update({
          where: { id: notificationResult.notification.id },
          data: {
            emailSent,
            emailSentAt: emailSent ? new Date() : null
          }
        })
      } catch (updateError) {
        console.error('Failed to update notification email status:', updateError)
      }
    }

    return {
      success: true,
      notificationCreated: notificationResult.success,
      emailSent
    }
  } catch (error) {
    console.error('Failed to send quote response notification:', error)
    return {
      success: false,
      error: 'Failed to send notification'
    }
  }
}

export async function getNotifications(email: string, limit = 20, offset = 0) {
  try {
    if (!prisma) {
      return { notifications: [], totalCount: 0 }
    }

    const [notifications, totalCount] = await Promise.all([
      prisma.notification.findMany({
        where: { recipientEmail: email },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.notification.count({
        where: { recipientEmail: email }
      })
    ])

    return { notifications, totalCount }
  } catch (error) {
    console.error('Failed to get notifications:', error)
    return { notifications: [], totalCount: 0 }
  }
}

export async function markNotificationAsRead(notificationId: string, userEmail: string) {
  try {
    if (!prisma) {
      return { success: false, error: 'Database not available' }
    }

    const notification = await prisma.notification.update({
      where: { 
        id: notificationId,
        recipientEmail: userEmail // Security check
      },
      data: {
        status: 'read',
        readAt: new Date()
      }
    })

    return { success: true, notification }
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
    return { success: false, error: 'Failed to update notification' }
  }
}

export async function getUnreadNotificationCount(email: string) {
  try {
    if (!prisma) {
      return { count: 0 }
    }

    const count = await prisma.notification.count({
      where: {
        recipientEmail: email,
        status: 'unread'
      }
    })

    return { count }
  } catch (error) {
    console.error('Failed to get unread count:', error)
    return { count: 0 }
  }
}