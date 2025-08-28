import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAdminFromRequest } from '@/lib/admin-auth'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Try NextAuth session first (for customers)
    const session = await getServerSession(authOptions)
    
    // Try admin authentication (for admins)
    const admin = session?.user?.email ? null : await getAdminFromRequest(request)
    
    if (!session?.user?.email && !admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!prisma) {
      // In demo mode, return mock messages
      const mockMessages = [
        {
          id: '1',
          senderId: 'demo-customer',
          senderName: 'John Doe',
          senderEmail: 'john@example.com',
          senderRole: 'customer',
          receiverId: 'demo-admin',
          receiverName: 'Admin Support',
          receiverEmail: 'admin@fixingmaritime.com',
          receiverRole: 'admin',
          subject: 'Welcome to the messaging system',
          content: 'This is a demo message to show how the messaging system works.',
          threadId: null,
          parentId: null,
          status: 'unread',
          createdAt: new Date().toISOString(),
          readAt: null
        }
      ]
      
      return NextResponse.json({ 
        success: true, 
        messages: mockMessages,
        unreadCount: 1,
        demoMode: true 
      })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'inbox' // 'inbox', 'sent', 'all'
    const status = searchParams.get('status') // 'unread', 'read', 'archived'
    const countOnly = searchParams.get('count') === 'true'
    
    // Get user from database (handle both customer sessions and admin auth)
    let user
    let userRole = 'customer'
    
    if (session?.user?.email) {
      // Customer authentication
      user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      userRole = user.role || 'customer'
    } else if (admin) {
      // Admin authentication - find admin user in database by email
      user = await prisma.user.findUnique({
        where: { email: admin.email }
      })
      if (!user) {
        return NextResponse.json({ error: 'Admin user not found in database' }, { status: 404 })
      }
      userRole = user.role || 'admin'
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Build query based on type and user role
    let whereClause: any = {
      isDeleted: false,
    }

    if (type === 'inbox') {
      whereClause.receiverId = user.id
    } else if (type === 'sent') {
      whereClause.senderId = user.id
    } else {
      // Show all messages for the user
      whereClause.OR = [
        { receiverId: user.id },
        { senderId: user.id }
      ]
    }

    if (status) {
      whereClause.status = status
    }

    // If only count is requested, return just the count
    if (countOnly) {
      const count = await prisma.message.count({
        where: whereClause
      })
      
      return NextResponse.json({
        success: true,
        unreadCount: count
      })
    }

    // Fetch messages
    const messages = await prisma.message.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 100 // Limit to 100 messages
    })

    // Get unread count for inbox
    const unreadCount = await prisma.message.count({
      where: {
        receiverId: user.id,
        status: 'unread',
        isDeleted: false
      }
    })

    return NextResponse.json({
      success: true,
      messages,
      unreadCount,
      userRole
    })

  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Try NextAuth session first (for customers)
    const session = await getServerSession(authOptions)
    
    // Try admin authentication (for admins)
    const admin = session?.user?.email ? null : await getAdminFromRequest(request)
    
    if (!session?.user?.email && !admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!prisma) {
      // In demo mode, simulate successful message sending
      const body = await request.json()
      return NextResponse.json({ 
        success: true, 
        message: {
          id: 'demo-msg-' + Date.now(),
          subject: body.subject,
          content: body.content,
          createdAt: new Date().toISOString()
        },
        demoMode: true 
      })
    }

    const body = await request.json()
    const { receiverId, subject, content, parentId, attachments } = body

    if (!receiverId || !subject || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get sender user (handle both customer sessions and admin auth)
    let sender
    
    if (session?.user?.email) {
      // Customer authentication
      sender = await prisma.user.findUnique({
        where: { email: session.user.email }
      })
      if (!sender) {
        return NextResponse.json({ error: 'Sender not found' }, { status: 404 })
      }
    } else if (admin) {
      // Admin authentication - find admin user in database by email
      sender = await prisma.user.findUnique({
        where: { email: admin.email }
      })
      if (!sender) {
        return NextResponse.json({ error: 'Admin user not found in database' }, { status: 404 })
      }
    } else {
      return NextResponse.json({ error: 'Sender not found' }, { status: 404 })
    }

    // Get receiver user
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    })

    if (!receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 })
    }

    // Determine thread ID
    let threadId = null
    if (parentId) {
      // Get parent message to maintain thread
      const parentMessage = await prisma.message.findUnique({
        where: { id: parentId }
      })
      threadId = parentMessage?.threadId || parentMessage?.id
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: sender.id,
        senderName: sender.name || sender.email,
        senderEmail: sender.email,
        senderRole: sender.role || 'customer',
        receiverId: receiver.id,
        receiverName: receiver.name || receiver.email,
        receiverEmail: receiver.email,
        receiverRole: receiver.role || 'customer',
        subject,
        content,
        parentId,
        threadId,
        attachments: attachments || null
      }
    })

    return NextResponse.json({
      success: true,
      message
    })

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

// Mark message as read
export async function PATCH(request: NextRequest) {
  try {
    // Try NextAuth session first (for customers)
    const session = await getServerSession(authOptions)
    
    // Try admin authentication (for admins)
    const admin = session?.user?.email ? null : await getAdminFromRequest(request)
    
    if (!session?.user?.email && !admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!prisma) {
      // In demo mode, simulate successful message status update
      return NextResponse.json({ 
        success: true, 
        updated: true,
        demoMode: true 
      })
    }

    const body = await request.json()
    const { messageId, status } = body

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID required' }, { status: 400 })
    }

    // Get user (handle both customer sessions and admin auth)
    let user
    
    if (session?.user?.email) {
      // Customer authentication
      user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
    } else if (admin) {
      // Admin authentication - find admin user in database by email
      user = await prisma.user.findUnique({
        where: { email: admin.email }
      })
      if (!user) {
        return NextResponse.json({ error: 'Admin user not found in database' }, { status: 404 })
      }
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update message status
    const message = await prisma.message.updateMany({
      where: {
        id: messageId,
        receiverId: user.id // Only receiver can mark as read
      },
      data: {
        status: status || 'read',
        readAt: status === 'read' ? new Date() : undefined
      }
    })

    return NextResponse.json({
      success: true,
      updated: message.count > 0
    })

  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}