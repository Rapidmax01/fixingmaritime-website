import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { getAdminFromRequest, canViewUser, canCreateUsers } from '@/lib/admin-auth'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const currentUser = getAdminFromRequest(request)
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      include: {
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Filter users based on role permissions
    const filteredUsers = users.filter(user => canViewUser(currentUser, user.role))

    const usersWithStats = filteredUsers.map(user => {
      const orderCount = user.orders.length
      const totalSpent = user.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0)
      const lastOrderDate = user.orders.length > 0 
        ? user.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
        : null

      return {
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
        orderCount,
        totalSpent,
        lastOrderDate,
        status: user.emailVerified ? 'active' : 'inactive'
      }
    })

    return NextResponse.json({ users: usersWithStats })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const currentUser = getAdminFromRequest(request)
    if (!currentUser || !canCreateUsers(currentUser)) {
      return NextResponse.json({ error: 'Unauthorized to create users' }, { status: 403 })
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
      role = 'customer',
      emailVerified = false 
    } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
    }

    // Role validation based on current user permissions
    const allowedRoles = ['customer']
    if (currentUser.role === 'super_admin') {
      allowedRoles.push('sub_admin', 'admin', 'super_admin')
    } else if (currentUser.role === 'admin') {
      allowedRoles.push('sub_admin')
    }

    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Insufficient permissions to create user with this role' }, { status: 403 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        company,
        phone,
        address,
        city,
        country,
        role,
        emailVerified
      },
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

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}