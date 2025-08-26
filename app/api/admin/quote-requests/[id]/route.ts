import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    let quoteRequest = null
    
    try {
      quoteRequest = await prisma.quoteRequest.findUnique({
        where: { id: params.id }
      })
    } catch (dbError: any) {
      console.error('Database error:', dbError)
      
      if (dbError.code === 'P2021' || dbError.message?.includes('does not exist')) {
        return NextResponse.json({ 
          error: 'Quote request system not yet available' 
        }, { status: 503 })
      }
      throw dbError
    }

    if (!quoteRequest) {
      return NextResponse.json({ error: 'Quote request not found' }, { status: 404 })
    }

    return NextResponse.json({ quoteRequest })

  } catch (error) {
    console.error('Error fetching quote request:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch quote request' 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const body = await request.json()
    const { 
      status, 
      adminResponse, 
      quotedAmount, 
      quotedCurrency = 'USD',
      respondedBy 
    } = body

    // Validation
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    const validStatuses = ['pending', 'quoted', 'accepted', 'rejected', 'completed']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updateData: any = {
      status,
      updatedAt: new Date()
    }

    if (adminResponse !== undefined) {
      updateData.adminResponse = adminResponse
      updateData.respondedBy = respondedBy
      updateData.respondedAt = new Date()
    }

    if (quotedAmount !== undefined) {
      updateData.quotedAmount = quotedAmount
      updateData.quotedCurrency = quotedCurrency
    }

    let quoteRequest = null
    
    try {
      quoteRequest = await prisma.quoteRequest.update({
        where: { id: params.id },
        data: updateData
      })
    } catch (dbError: any) {
      console.error('Database error:', dbError)
      
      if (dbError.code === 'P2021' || dbError.message?.includes('does not exist')) {
        return NextResponse.json({ 
          error: 'Quote request system not yet available' 
        }, { status: 503 })
      }
      throw dbError
    }

    return NextResponse.json({ 
      success: true, 
      quoteRequest 
    })

  } catch (error) {
    console.error('Error updating quote request:', error)
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Quote request not found' }, { status: 404 })
    }
    return NextResponse.json({ 
      error: 'Failed to update quote request' 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    try {
      await prisma.quoteRequest.delete({
        where: { id: params.id }
      })
    } catch (dbError: any) {
      console.error('Database error:', dbError)
      
      if (dbError.code === 'P2021' || dbError.message?.includes('does not exist')) {
        return NextResponse.json({ 
          error: 'Quote request system not yet available' 
        }, { status: 503 })
      }
      throw dbError
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting quote request:', error)
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json({ error: 'Quote request not found' }, { status: 404 })
    }
    return NextResponse.json({ 
      error: 'Failed to delete quote request' 
    }, { status: 500 })
  }
}