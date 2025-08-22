import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET(request: NextRequest) {
  const diagnostics = {
    database: {
      configured: !!process.env.DATABASE_URL,
      urlPresent: !!process.env.DATABASE_URL,
      urlLength: process.env.DATABASE_URL?.length || 0,
      urlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...' || 'not set'
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET
    },
    prisma: {
      available: false,
      error: null as any
    }
  }

  // Try to connect to database
  if (process.env.DATABASE_URL) {
    try {
      const prisma = new PrismaClient()
      // Try a simple query
      await prisma.$queryRaw`SELECT 1`
      diagnostics.prisma.available = true
      await prisma.$disconnect()
    } catch (error: any) {
      diagnostics.prisma.error = error.message
    }
  }

  return NextResponse.json(diagnostics)
}