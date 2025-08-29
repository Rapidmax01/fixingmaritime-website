import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAdminFromRequest } from '@/lib/admin-auth'
import prisma from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Try NextAuth session first (for customers)
    const session = await getServerSession(authOptions)
    
    // Try admin authentication (for admins)
    const admin = session?.user?.email ? null : await getAdminFromRequest(request)
    
    if (!session?.user?.email && !admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!prisma) {
      // Return mock users in demo mode
      const mockUsers = session?.user?.email 
        ? [
            // Customer sees only admins
            { id: 'demo-admin', name: 'Admin Support', email: 'admin@fixingmaritime.com', role: 'admin' }
          ]
        : [
            // Admin sees all users
            { id: 'demo-customer-1', name: 'John Doe', email: 'john@example.com', role: 'customer' },
            { id: 'demo-customer-2', name: 'Jane Smith', email: 'jane@example.com', role: 'customer' },
            { id: 'demo-customer-3', name: 'Bob Wilson', email: 'bob@company.com', role: 'customer' }
          ]
      
      return NextResponse.json({ 
        success: true, 
        users: mockUsers,
        userRole: admin ? admin.role : 'customer',
        demoMode: true 
      })
    }

    // Get current user (handle both customer sessions and admin auth)
    let currentUser
    
    if (session?.user?.email) {
      // Customer authentication
      currentUser = await prisma.user.findUnique({
        where: { email: session.user.email }
      })
      if (!currentUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
    } else if (admin) {
      // Admin authentication - find admin user in database by email
      currentUser = await prisma.user.findUnique({
        where: { email: admin.email }
      })
      if (!currentUser) {
        // If admin not in database, create a virtual admin user
        currentUser = {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role || 'admin'
        } as any
      }
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let users
    
    // If admin, get all users. If customer, only get admins
    if (currentUser.role === 'admin' || currentUser.role === 'super_admin') {
      users = await prisma.user.findMany({
        where: currentUser.id.startsWith('demo-') ? {} : {
          id: { not: currentUser.id } // Exclude current user only if not demo
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      // Customers can only message admins
      users = await prisma.user.findMany({
        where: {
          OR: [
            { role: 'admin' },
            { role: 'super_admin' }
          ]
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      users,
      userRole: currentUser.role
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}