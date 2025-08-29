import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/admin-auth'

import prisma from '@/lib/database'

// GET - Fetch all content sections
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

    try {
      const sections = await prisma.contentSection.findMany({
        where: { active: true },
        orderBy: { type: 'asc' }
      })
      return NextResponse.json({ sections })
    } catch (dbError: any) {
      // If table doesn't exist, return empty array with migration flag
      if (dbError.code === 'P2021' || dbError.message?.includes('does not exist') || dbError.message?.includes('relation')) {
        return NextResponse.json({ 
          sections: [], 
          needsMigration: true,
          message: 'Database tables not found. Please run migration first.' 
        })
      }
      // For other errors, still return empty array but log the error
      console.error('Database error in content sections:', dbError)
      return NextResponse.json({ 
        sections: [], 
        error: 'Database error occurred'
      })
    }

  } catch (error: any) {
    console.error('Fetch content sections error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch content sections' },
      { status: 500 }
    )
  }
}

// POST - Create or update content section
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
    const { id, type, name, title, content } = body

    if (!type || !name || !title || !content) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    let section
    if (id) {
      // Update existing section
      section = await prisma.contentSection.update({
        where: { id },
        data: {
          name,
          title,
          content,
          updatedAt: new Date()
        }
      })
    } else {
      // Create new section or upsert by type
      section = await prisma.contentSection.upsert({
        where: { type },
        update: {
          name,
          title,
          content,
          updatedAt: new Date()
        },
        create: {
          type,
          name,
          title,
          content
        }
      })
    }

    return NextResponse.json({ 
      message: 'Content section saved successfully',
      section 
    })

  } catch (error: any) {
    console.error('Save content section error:', error)
    return NextResponse.json(
      { message: 'Failed to save content section' },
      { status: 500 }
    )
  }
}