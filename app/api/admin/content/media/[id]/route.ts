import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromRequest } from '@/lib/admin-auth'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

// PUT - Update media file
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params
    const body = await request.json()
    const { alt, name } = body

    const mediaFile = await prisma.mediaFile.update({
      where: { id },
      data: {
        ...(alt !== undefined && { alt }),
        ...(name !== undefined && { name }),
        updatedAt: new Date()
      }
    })

    // Convert BigInt to string for JSON serialization
    const serializedFile = {
      ...mediaFile,
      size: mediaFile.size.toString()
    }

    return NextResponse.json({ 
      message: 'Media file updated successfully',
      mediaFile: serializedFile 
    })

  } catch (error: any) {
    console.error('Update media file error:', error)
    return NextResponse.json(
      { message: 'Failed to update media file' },
      { status: 500 }
    )
  }
}

// DELETE - Delete single media file
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    await prisma.mediaFile.delete({
      where: { id }
    })

    return NextResponse.json({ 
      message: 'Media file deleted successfully' 
    })

  } catch (error: any) {
    console.error('Delete media file error:', error)
    return NextResponse.json(
      { message: 'Failed to delete media file' },
      { status: 500 }
    )
  }
}