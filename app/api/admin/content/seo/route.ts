import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromRequest } from '@/lib/admin-auth'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

// GET - Fetch current SEO settings
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    
    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { message: 'Database not configured' },
        { status: 503 }
      )
    }

    let seoSettings = null
    try {
      seoSettings = await prisma.seoSettings.findFirst({
        where: { active: true },
        orderBy: { createdAt: 'desc' }
      })
    } catch (dbError: any) {
      // If table doesn't exist, return defaults
      if (dbError.code === 'P2021' || dbError.message.includes('does not exist')) {
        const defaultSettings = {
          title: 'Fixing Maritime - Professional Maritime Services',
          description: 'Complete maritime solutions including documentation, truck services, tug boat with barge, procurement, freight forwarding, warehousing, and custom clearing.',
          keywords: 'maritime services, freight forwarding, custom clearing, tug boat, barge, warehousing, procurement, export goods',
          ogTitle: 'Fixing Maritime - Professional Maritime Services',
          ogDescription: 'Your trusted partner for comprehensive maritime solutions',
          needsMigration: true
        }
        return NextResponse.json({ seoSettings: defaultSettings })
      }
      throw dbError
    }

    // If no settings exist, return defaults
    if (!seoSettings) {
      const defaultSettings = {
        title: 'Fixing Maritime - Professional Maritime Services',
        description: 'Complete maritime solutions including documentation, truck services, tug boat with barge, procurement, freight forwarding, warehousing, and custom clearing.',
        keywords: 'maritime services, freight forwarding, custom clearing, tug boat, barge, warehousing, procurement, export goods',
        ogTitle: 'Fixing Maritime - Professional Maritime Services',
        ogDescription: 'Your trusted partner for comprehensive maritime solutions'
      }
      return NextResponse.json({ seoSettings: defaultSettings })
    }

    return NextResponse.json({ seoSettings })

  } catch (error: any) {
    console.error('Fetch SEO settings error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch SEO settings' },
      { status: 500 }
    )
  }
}

// POST - Save SEO settings
export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    
    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { message: 'Database not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { title, description, keywords, ogTitle, ogDescription } = body

    if (!title || !description) {
      return NextResponse.json(
        { message: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Deactivate current settings
    await prisma.seoSettings.updateMany({
      where: { active: true },
      data: { active: false }
    })

    // Create new settings
    const seoSettings = await prisma.seoSettings.create({
      data: {
        title,
        description,
        keywords: keywords || '',
        ogTitle: ogTitle || title,
        ogDescription: ogDescription || description
      }
    })

    return NextResponse.json({ 
      message: 'SEO settings saved successfully',
      seoSettings 
    })

  } catch (error: any) {
    console.error('Save SEO settings error:', error)
    return NextResponse.json(
      { message: 'Failed to save SEO settings' },
      { status: 500 }
    )
  }
}