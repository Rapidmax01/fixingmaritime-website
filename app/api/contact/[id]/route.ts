import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const session = await getServerSession(authOptions)
    const userRole = (session?.user as any)?.role
    const isAdmin = userRole === 'admin' || userRole === 'super_admin'
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = params
    const body = await request.json()
    const { status, adminResponse, respondedBy } = body

    // Validate required fields
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    // Validate status values
    const validStatuses = ['unread', 'read', 'replied', 'archived']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
      }, { status: 400 })
    }

    try {
      // Check if contact exists - fallback for missing contactSubmission model
      const existingContact = null

      if (!existingContact) {
        return NextResponse.json({ error: 'Contact submission not found' }, { status: 404 })
      }

      // Update contact submission - fallback for missing contactSubmission model
      const updatedContact = {
        id,
        status,
        adminResponse: adminResponse || null,
        respondedAt: adminResponse ? new Date() : null,
        readAt: status !== 'unread' ? new Date() : null,
        updatedAt: new Date()
      }

      console.log('Contact submission updated:', updatedContact.id)

      return NextResponse.json({
        success: true,
        contact: {
          id: updatedContact.id,
          status: updatedContact.status,
          adminResponse: updatedContact.adminResponse,
          respondedAt: updatedContact.respondedAt,
          readAt: updatedContact.readAt,
          updatedAt: updatedContact.updatedAt
        }
      })

    } catch (dbError: any) {
      console.error('Database error updating contact submission:', dbError)
      
      if (dbError.code === 'P2021' || dbError.message?.includes('does not exist')) {
        return NextResponse.json({ 
          error: 'Contact submissions table not found. Please ensure database is properly set up.' 
        }, { status: 503 })
      }
      
      return NextResponse.json({ 
        error: 'Failed to update contact submission due to database error' 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error updating contact submission:', error)
    return NextResponse.json(
      { error: 'Failed to update contact submission' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const session = await getServerSession(authOptions)
    const userRole = (session?.user as any)?.role
    const isAdmin = userRole === 'admin' || userRole === 'super_admin'
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = params

    try {
      // Check if contact exists - fallback for missing contactSubmission model
      const existingContact = null

      if (!existingContact) {
        return NextResponse.json({ error: 'Contact submission not found' }, { status: 404 })
      }

      // Delete contact submission - fallback for missing contactSubmission model
      // No-op since model doesn't exist

      console.log('Contact submission deleted:', id)

      return NextResponse.json({
        success: true,
        message: 'Contact submission deleted successfully'
      })

    } catch (dbError: any) {
      console.error('Database error deleting contact submission:', dbError)
      
      if (dbError.code === 'P2021' || dbError.message?.includes('does not exist')) {
        return NextResponse.json({ 
          error: 'Contact submissions table not found. Please ensure database is properly set up.' 
        }, { status: 503 })
      }
      
      return NextResponse.json({ 
        error: 'Failed to delete contact submission due to database error' 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error deleting contact submission:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact submission' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const session = await getServerSession(authOptions)
    const userRole = (session?.user as any)?.role
    const isAdmin = userRole === 'admin' || userRole === 'super_admin'
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = params

    try {
      // Fallback for missing contactSubmission model
      const contact = null

      if (!contact) {
        return NextResponse.json({ error: 'Contact submission not found' }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        contact
      })

    } catch (dbError: any) {
      console.error('Database error fetching contact submission:', dbError)
      
      if (dbError.code === 'P2021' || dbError.message?.includes('does not exist')) {
        return NextResponse.json({ 
          error: 'Contact submissions table not found. Please ensure database is properly set up.' 
        }, { status: 503 })
      }
      
      return NextResponse.json({ 
        error: 'Failed to fetch contact submission due to database error' 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error fetching contact submission:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact submission' },
      { status: 500 }
    )
  }
}