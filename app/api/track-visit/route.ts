import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'
import { getSession } from 'next-auth/react'

// Helper function to parse user agent
function parseUserAgent(ua: string | null) {
  if (!ua) return { device: 'Unknown', browser: 'Unknown', os: 'Unknown' }
  
  // Simple user agent parsing
  const device = /mobile|android|iphone|ipad/i.test(ua) ? 'Mobile' : 'Desktop'
  
  let browser = 'Unknown'
  if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Safari')) browser = 'Safari'
  else if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Edge')) browser = 'Edge'
  else if (ua.includes('Opera')) browser = 'Opera'
  
  let os = 'Unknown'
  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'
  
  return { device, browser, os }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      sessionId,
      page,
      pathname,
      referrer,
      duration
    } = body

    if (!sessionId || !page || !pathname) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!prisma) {
      // If database not available, just log and return success
      console.log('Page visit:', { page, pathname, duration })
      return NextResponse.json({ success: true, message: 'Visit logged (no db)' })
    }

    // Get user session if available
    let userId = null
    try {
      // Try to get the user from cookies/headers
      const authHeader = req.headers.get('authorization')
      if (authHeader) {
        // Simple extraction of user ID from auth header if present
        userId = authHeader.split(' ')[1] // Assuming Bearer token format
      }
    } catch (error) {
      // User might not be logged in, which is fine
    }

    // Get user agent and IP
    const userAgent = req.headers.get('user-agent')
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    
    // Parse user agent
    const { device, browser, os } = parseUserAgent(userAgent)

    // Create page visit record in database
    try {
      const pageVisit = await prisma.pageVisit.create({
        data: {
          sessionId,
          userId,
          page,
          pathname,
          referrer: referrer || null,
          userAgent: userAgent || null,
          ip: ip.split(',')[0].trim(), // Get first IP if multiple
          device,
          browser,
          os,
          duration: duration || null
        }
      })

      return NextResponse.json({
        success: true,
        visitId: pageVisit.id,
        message: 'Visit tracked successfully'
      })
    } catch (dbError: any) {
      // Fallback to console logging if database fails
      console.log('Page visit tracked (DB error):', { 
        sessionId, page, pathname, device, browser, os, duration,
        error: dbError.message
      })
      
      return NextResponse.json({
        success: true,
        visitId: `visit_${Date.now()}`,
        message: 'Visit logged (DB error)'
      })
    }

  } catch (error) {
    console.error('Error tracking page visit:', error)
    return NextResponse.json(
      { error: 'Failed to track visit' },
      { status: 500 }
    )
  }
}