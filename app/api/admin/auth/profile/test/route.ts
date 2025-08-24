import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ 
        error: 'No DATABASE_URL environment variable found',
        env: {
          hasUrl: !!process.env.DATABASE_URL,
          urlPreview: process.env.DATABASE_URL?.slice(0, 30) + '...'
        }
      }, { status: 503 })
    }

    // Test database connection
    await prisma.$queryRaw`SELECT 1 as test`
    
    // Test app_users table access
    const userCount = await prisma.user.count()
    
    // Test specific admin user
    const adminUser = await prisma.user.findFirst({
      where: { 
        role: { in: ['admin', 'super_admin'] }
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true
      }
    })

    return NextResponse.json({
      status: 'success',
      database: 'connected',
      userCount,
      adminUser,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}