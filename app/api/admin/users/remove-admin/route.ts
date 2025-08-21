import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromRequest, canManageAdmins } from '@/lib/admin-auth'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated as super admin
    const currentAdmin = getAdminFromRequest(req)
    
    if (!currentAdmin || !canManageAdmins(currentAdmin)) {
      return NextResponse.json(
        { message: 'Access denied. Super admin privileges required.' },
        { status: 403 }
      )
    }

    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { message: 'Database not configured' },
        { status: 503 }
      )
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Don't allow changing super_admin status
    if (user.role === 'super_admin') {
      return NextResponse.json(
        { message: 'Cannot modify super admin users' },
        { status: 400 }
      )
    }

    // Don't allow removing yourself as admin
    if (user.id === currentAdmin.id) {
      return NextResponse.json(
        { message: 'Cannot remove your own admin privileges' },
        { status: 400 }
      )
    }

    // Update user to customer
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: 'customer' }
    })

    console.log(`Admin privileges removed from ${updatedUser.email} by ${currentAdmin.email}`)

    return NextResponse.json({
      message: 'Admin privileges removed successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role
      }
    })

  } catch (error: any) {
    console.error('Remove admin error:', error)
    return NextResponse.json(
      { message: 'Failed to update user role' },
      { status: 500 }
    )
  }
}