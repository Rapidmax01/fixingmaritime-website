import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/admin-auth'
import prisma from '@/lib/database'

export const dynamic = 'force-dynamic'

// GET - Fetch single invoice
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!prisma) {
      return NextResponse.json({ 
        error: 'Database not available' 
      }, { status: 503 })
    }

    const { id } = params
    
    const invoice = await prisma.invoice.findUnique({
      where: { id }
    })

    if (!invoice) {
      return NextResponse.json({
        error: 'Invoice not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      invoice
    })

  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json({
      error: 'Failed to fetch invoice'
    }, { status: 500 })
  }
}

// PATCH - Update invoice status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!prisma) {
      return NextResponse.json({ 
        error: 'Database not available' 
      }, { status: 503 })
    }

    const { id } = params
    const body = await request.json()
    const { status, paymentMethod, paymentRef, notes } = body

    const validStatuses = ['pending', 'paid', 'overdue', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        error: 'Invalid status. Must be: pending, paid, overdue, cancelled'
      }, { status: 400 })
    }

    const updateData: any = {
      status,
      updatedAt: new Date()
    }

    if (status === 'paid') {
      updateData.paidAt = new Date()
      if (paymentMethod) updateData.paymentMethod = paymentMethod
      if (paymentRef) updateData.paymentRef = paymentRef
    }

    if (notes) {
      updateData.notes = notes
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: 'Invoice updated successfully',
      invoice
    })

  } catch (error: any) {
    console.error('Error updating invoice:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json({
        error: 'Invoice not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      error: 'Failed to update invoice'
    }, { status: 500 })
  }
}