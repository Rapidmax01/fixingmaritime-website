import { NextRequest, NextResponse } from 'next/server'
import { generateInvoiceFromQuote } from '@/lib/invoice-service'

export async function POST(req: NextRequest) {
  try {
    const { quoteId, adminId } = await req.json()

    if (!quoteId || !adminId) {
      return NextResponse.json(
        { error: 'Quote ID and Admin ID are required' },
        { status: 400 }
      )
    }

    const invoice = await generateInvoiceFromQuote(quoteId, adminId)

    return NextResponse.json({
      success: true,
      message: 'Invoice generated successfully',
      invoice
    })

  } catch (error) {
    console.error('Error generating invoice from quote:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}