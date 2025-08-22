import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET(request: NextRequest) {
  console.log('=== DATABASE TEST API ===')
  
  let prisma: PrismaClient | null = null
  
  try {
    // Test 1: Check environment
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length || 0)
    
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ 
        error: 'DATABASE_URL not found',
        env: Object.keys(process.env).filter(key => key.includes('DATABASE'))
      })
    }

    // Test 2: Create Prisma client
    console.log('Creating Prisma client...')
    prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    })
    
    // Test 3: Test basic connection
    console.log('Testing database connection...')
    await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Basic connection successful')

    // Test 4: Check if tables exist
    console.log('Checking if content_sections table exists...')
    const tableCheck = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('content_sections', 'seo_settings', 'media_files')
    `
    console.log('Found tables:', tableCheck)

    // Test 5: Try to fetch content sections with raw SQL
    console.log('Fetching content sections with raw SQL...')
    const rawSections = await prisma.$queryRaw`
      SELECT id, type, name, title, content, active 
      FROM content_sections 
      WHERE active = true
      ORDER BY type
    `
    console.log('Raw sections result:', rawSections)

    // Test 6: Try with Prisma ORM
    console.log('Fetching with Prisma ORM...')
    const ormSections = await prisma.contentSection.findMany({
      where: { active: true }
    })
    console.log('ORM sections result:', ormSections)

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      tests: {
        databaseUrl: !!process.env.DATABASE_URL,
        connection: 'successful',
        tables: tableCheck,
        rawQuery: rawSections,
        ormQuery: ormSections
      }
    })

  } catch (error: any) {
    console.error('❌ Database test failed:', error)
    
    if (prisma) {
      try {
        await prisma.$disconnect()
      } catch (disconnectError) {
        console.error('Error disconnecting:', disconnectError)
      }
    }

    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      code: error.code
    }, { status: 500 })
  }
}