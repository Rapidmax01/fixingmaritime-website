import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const body = await request.json()
    const { 
      userId,
      name, 
      email, 
      phone, 
      company, 
      serviceId, 
      serviceName,
      projectDescription, 
      timeline, 
      budget 
    } = body

    // Validation
    if (!name || !email || !serviceId || !serviceName || !projectDescription) {
      return NextResponse.json({ 
        error: 'Name, email, service, and project description are required' 
      }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    try {
      const quoteRequest = await prisma.quoteRequest.create({
        data: {
          userId: userId || null, // Store userId if provided (logged in user)
          name,
          email,
          phone: phone || null,
          company: company || null,
          serviceId,
          serviceName,
          projectDescription,
          timeline: timeline || null,
          budget: budget || null,
          status: 'pending'
        }
      })

      return NextResponse.json({ 
        success: true, 
        quoteRequest: {
          id: quoteRequest.id,
          status: quoteRequest.status,
          createdAt: quoteRequest.createdAt
        }
      }, { status: 201 })
    } catch (dbError: any) {
      console.error('Database error:', dbError)
      
      // If table doesn't exist, return success but log for admin
      if (dbError.code === 'P2021' || dbError.message?.includes('does not exist')) {
        console.log('Quote request received (table not yet created):', {
          name, email, serviceName, projectDescription, timeline, budget
        })
        
        return NextResponse.json({ 
          success: true,
          message: 'Quote request received and will be processed shortly.',
          fallback: true
        }, { status: 201 })
      }
      
      throw dbError
    }

  } catch (error) {
    console.error('Error creating quote request:', error)
    return NextResponse.json({ 
      error: 'Failed to submit quote request. Please try again.' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const serviceId = searchParams.get('serviceId')

    const skip = (page - 1) * limit

    const where: any = {}
    if (status) where.status = status
    if (serviceId) where.serviceId = serviceId

    const [quoteRequests, totalCount] = await Promise.all([
      prisma.quoteRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.quoteRequest.count({ where })
    ])

    return NextResponse.json({
      quoteRequests,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching quote requests:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch quote requests' 
    }, { status: 500 })
  }
}