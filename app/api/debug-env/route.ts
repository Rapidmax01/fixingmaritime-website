import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const dbUrl = process.env.DATABASE_URL
  
  return NextResponse.json({
    hasDbUrl: !!dbUrl,
    urlLength: dbUrl?.length || 0,
    urlPrefix: dbUrl?.substring(0, 50) + '...' || 'not set',
    environment: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => 
      key.includes('DATABASE') || key.includes('SUPABASE')
    )
  })
}