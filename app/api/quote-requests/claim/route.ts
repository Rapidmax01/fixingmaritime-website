import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import prisma from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    // Verify user is logged in
    const session = await getServerSession(authOptions)
    if (!(session?.user as any)?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { email, verificationCode } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    try {
      // Find all unclaimed quotes for this email
      const unclaimedQuotes = await prisma.quoteRequest.findMany({
        where: {
          email: email,
          userId: null // Only unclaimed quotes
        }
      })

      if (unclaimedQuotes.length === 0) {
        return NextResponse.json({ 
          error: 'No unclaimed quotes found for this email address' 
        }, { status: 404 })
      }

      // For now, we'll implement a simple claim without email verification
      // In production, you might want to send a verification email
      
      // Claim all quotes for this email to the current user
      const updatedQuotes = await prisma.quoteRequest.updateMany({
        where: {
          email: email,
          userId: null
        },
        data: {
          userId: (session?.user as any)?.id
        }
      })

      return NextResponse.json({
        success: true,
        message: `Successfully claimed ${updatedQuotes.count} quote(s)`,
        claimedCount: updatedQuotes.count,
        quotes: unclaimedQuotes.map(q => ({
          id: q.id,
          serviceName: q.serviceName,
          status: q.status,
          createdAt: q.createdAt
        }))
      })

    } catch (dbError: any) {
      console.error('Database error claiming quotes:', dbError)
      
      if (dbError.code === 'P2021' || dbError.message?.includes('does not exist')) {
        return NextResponse.json({ 
          error: 'Quote system not available' 
        }, { status: 503 })
      }
      
      throw dbError
    }

  } catch (error) {
    console.error('Error claiming quotes:', error)
    return NextResponse.json({ 
      error: 'Failed to claim quotes. Please try again.' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    // Verify user is logged in
    const session = await getServerSession(authOptions)
    if (!(session?.user as any)?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    try {
      // Find unclaimed quotes for this email
      const unclaimedQuotes = await prisma.quoteRequest.findMany({
        where: {
          email: email,
          userId: null
        },
        select: {
          id: true,
          serviceName: true,
          status: true,
          createdAt: true,
          projectDescription: true
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({
        success: true,
        quotes: unclaimedQuotes,
        count: unclaimedQuotes.length
      })

    } catch (dbError: any) {
      console.error('Database error finding unclaimed quotes:', dbError)
      
      if (dbError.code === 'P2021' || dbError.message?.includes('does not exist')) {
        return NextResponse.json({ quotes: [], count: 0 })
      }
      
      throw dbError
    }

  } catch (error) {
    console.error('Error finding unclaimed quotes:', error)
    return NextResponse.json({ 
      error: 'Failed to find quotes' 
    }, { status: 500 })
  }
}