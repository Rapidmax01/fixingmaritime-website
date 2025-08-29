import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest, canApproveUsers, canEditUser } from '@/lib/admin-auth'

import prisma from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const currentUser = await getAdminFromRequest(request)
    if (!currentUser || !canApproveUsers(currentUser)) {
      return NextResponse.json({ error: 'Unauthorized to manage user status' }, { status: 403 })
    }

    const body = await request.json()
    const { action, emailVerified } = body

    if (!['activate', 'suspend'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Use "activate" or "suspend"' }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if current user can modify this user's status
    if (!canEditUser(currentUser, user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions to modify this user status' }, { status: 403 })
    }

    // Prevent suspending super_admin users
    if (user.role === 'super_admin' && action === 'suspend') {
      return NextResponse.json({ error: 'Cannot suspend super admin users' }, { status: 403 })
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        emailVerified: action === 'activate' ? true : false
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        updatedAt: true
      }
    })

    return NextResponse.json({ 
      user: updatedUser,
      message: `User ${action === 'activate' ? 'activated' : 'suspended'} successfully`
    })
  } catch (error) {
    console.error('Error updating user status:', error)
    return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 })
  }
}