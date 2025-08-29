import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/database'

export const dynamic = 'force-dynamic'

// GET - Fetch customer invoices
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!prisma) {
      return NextResponse.json({ 
        success: true, 
        invoices: [],
        demoMode: true 
      })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const whereClause: any = {
      OR: [
        { customerId: (session.user as any)?.id },
        { customerEmail: session.user.email }
      ]
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
    console.error('Error fetching customer invoices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}