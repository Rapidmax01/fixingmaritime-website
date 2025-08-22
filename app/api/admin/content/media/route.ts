import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromRequest } from '@/lib/admin-auth'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

// GET - Fetch all media files
export async function GET(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    
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

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    let whereClause: any = {}
    
    if (type && type !== 'all') {
      whereClause.type = type
    }
    
    if (search) {
      whereClause.name = {
        contains: search,
        mode: 'insensitive'
      }
    }

    let mediaFiles = []
    try {
      mediaFiles = await prisma.mediaFile.findMany({
        where: whereClause,
        orderBy: { uploadedAt: 'desc' }
      })
    } catch (dbError: any) {
      console.error('Media files database error:', dbError)
      // If table doesn't exist, return empty array
      if (dbError.code === 'P2021' || dbError.message?.includes('does not exist') || dbError.message?.includes('relation')) {
        return NextResponse.json({ 
          mediaFiles: [], 
          needsMigration: true,
          message: 'Database tables not found. Please run migration first.' 
        })
      }
      throw dbError
    }

    // Convert BigInt to string for JSON serialization
    const serializedFiles = mediaFiles.map(file => ({
      ...file,
      size: file.size ? file.size.toString() : '0'
    }))

    return NextResponse.json({ mediaFiles: serializedFiles })

  } catch (error: any) {
    console.error('Fetch media files error:', error)
    // Return empty array as fallback to prevent breaking the admin panel
    return NextResponse.json({ 
      mediaFiles: [],
      error: 'Failed to fetch media files',
      message: 'Media management is available but encountered an error'
    })
  }
}

// POST - Upload new media file
export async function POST(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    
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
    const { name, type, url, size, mimeType, width, height, alt } = body

    if (!name || !type || !url || !size) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const mediaFile = await prisma.mediaFile.create({
      data: {
        name,
        type,
        url,
        size: BigInt(size),
        mimeType,
        width,
        height,
        alt
      }
    })

    // Convert BigInt to string for JSON serialization
    const serializedFile = {
      ...mediaFile,
      size: mediaFile.size.toString()
    }

    return NextResponse.json({ 
      message: 'Media file uploaded successfully',
      mediaFile: serializedFile 
    })

  } catch (error: any) {
    console.error('Upload media file error:', error)
    return NextResponse.json(
      { message: 'Failed to upload media file' },
      { status: 500 }
    )
  }
}

// DELETE - Delete multiple media files
export async function DELETE(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    
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
    const { fileIds } = body

    if (!fileIds || !Array.isArray(fileIds)) {
      return NextResponse.json(
        { message: 'File IDs are required' },
        { status: 400 }
      )
    }

    await prisma.mediaFile.deleteMany({
      where: {
        id: {
          in: fileIds
        }
      }
    })

    return NextResponse.json({ 
      message: `${fileIds.length} file(s) deleted successfully` 
    })

  } catch (error: any) {
    console.error('Delete media files error:', error)
    return NextResponse.json(
      { message: 'Failed to delete media files' },
      { status: 500 }
    )
  }
}