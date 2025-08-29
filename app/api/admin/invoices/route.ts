import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/admin-auth'
import prisma from '@/lib/database'

export const dynamic = 'force-dynamic'

// GET - Fetch all invoices
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!prisma) {
      return NextResponse.json({ 
        success: true, 
        invoices: [],
        demoMode: true 
      })
    }

    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    const status = searchParams.get('status')

    const whereClause: any = {}
    if (customerId) {
      whereClause.customerId = customerId
    }
    if (status) {
      whereClause.status = status
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      invoices
    })

  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}

// POST - Generate new invoice
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      serviceId,
      serviceName,
      description,
      amount,
      tax = 0,
      currency = 'NGN',
      dueDate,
      notes,
      items = []
    } = body

    // Validate required fields
    if (!customerId || !customerName || !customerEmail || !serviceName || !amount) {
      return NextResponse.json({
        error: 'Missing required fields: customerId, customerName, customerEmail, serviceName, amount'
      }, { status: 400 })
    }

    // Generate unique invoice number
    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`
    
    // Calculate total
    const total = parseFloat(amount) + parseFloat(tax || 0)

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerId,
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        customerAddress: customerAddress || null,
        serviceId: serviceId || null,
        serviceName,
        description,
        amount: parseFloat(amount),
        tax: parseFloat(tax || 0),
        total,
        currency,
        status: 'pending',
        dueDate: new Date(dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 days from now
        notes: notes || null,
        items: items.length > 0 ? items : null,
        createdBy: admin.id || admin.email
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Invoice generated successfully',
      invoice
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating invoice:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json({
        error: 'Invoice number already exists'
      }, { status: 409 })
    }

    return NextResponse.json({
      error: 'Failed to generate invoice'
    }, { status: 500 })
  }
}