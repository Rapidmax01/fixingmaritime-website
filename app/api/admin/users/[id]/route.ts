import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { getAdminFromRequest, canViewUser, canEditUser, canDeleteUser } from '@/lib/admin-auth'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const currentUser = getAdminFromRequest(request)
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            totalAmount: true,
            status: true,
            paymentStatus: true,
            createdAt: true,
            orderItems: {
              include: {
                service: {
                  select: {
                    name: true,
                    slug: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!canViewUser(currentUser, user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const orderCount = user.orders.length
    const totalSpent = user.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0)

    const userWithStats = {
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
      phone: user.phone,
      address: user.address,
      city: user.city,
      country: user.country,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      orders: user.orders,
      orderCount,
      totalSpent,
      status: user.emailVerified ? 'active' : 'inactive'
    }

    return NextResponse.json({ user: userWithStats })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const currentUser = getAdminFromRequest(request)
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      name, 
      email, 
      password, 
      company, 
      phone, 
      address, 
      city, 
      country, 
      role,
      emailVerified 
    } = body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!canEditUser(currentUser, existingUser.role)) {
      return NextResponse.json({ error: 'Insufficient permissions to edit this user' }, { status: 403 })
    }

    // Role validation - only super_admin can change roles to admin/super_admin
    if (role && role !== existingUser.role) {
      if (currentUser.role !== 'super_admin') {
        return NextResponse.json({ error: 'Only super admins can change user roles' }, { status: 403 })
      }
      
      // Prevent changing super_admin roles by anyone other than super_admin
      if (existingUser.role === 'super_admin' && currentUser.role !== 'super_admin') {
        return NextResponse.json({ error: 'Cannot change role of super admin users' }, { status: 403 })
      }
    }

    // If email is being changed, check for conflicts
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      })

      if (emailExists) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
      }
    }

    // Prepare update data
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (company !== undefined) updateData.company = company
    if (phone !== undefined) updateData.phone = phone
    if (address !== undefined) updateData.address = address
    if (city !== undefined) updateData.city = city
    if (country !== undefined) updateData.country = country
    if (role !== undefined) updateData.role = role
    if (emailVerified !== undefined) updateData.emailVerified = emailVerified

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 12)
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        phone: true,
        address: true,
        city: true,
        country: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const currentUser = getAdminFromRequest(request)
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!canDeleteUser(currentUser, user.role)) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to delete this user' 
      }, { status: 403 })
    }

    // Check if user has orders
    const orderCount = await prisma.order.count({
      where: { userId: params.id }
    })

    if (orderCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete user with ${orderCount} orders. Consider deactivating instead.` 
      }, { status: 409 })
    }

    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}