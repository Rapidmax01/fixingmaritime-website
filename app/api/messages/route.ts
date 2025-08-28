import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!prisma) {
      return NextResponse.json({ 
        success: true, 
        messages: [],
        demoMode: true 
      })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'inbox' // 'inbox', 'sent', 'all'
    const status = searchParams.get('status') // 'unread', 'read', 'archived'
    const countOnly = searchParams.get('count') === 'true'
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userRole = user.role || 'customer'
    
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
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const body = await request.json()
    const { receiverId, subject, content, parentId } = body

    if (!receiverId || !subject || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get sender user
    const sender = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!sender) {
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
        threadId
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
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const body = await request.json()
    const { messageId, status } = body

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID required' }, { status: 400 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
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