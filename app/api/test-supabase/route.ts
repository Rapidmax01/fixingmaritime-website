import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  console.log('=== SUPABASE PUBLIC ACCESS TEST ===')
  
  try {
    // Test with Supabase client (uses service role key for admin access)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('Supabase URL exists:', !!supabaseUrl)
    console.log('Service role key exists:', !!serviceRoleKey)
    
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ 
        error: 'Missing Supabase configuration',
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!serviceRoleKey
      })
    }

    // Create admin client (bypasses RLS)
    const supabase = createClient(supabaseUrl, serviceRoleKey)
    
    console.log('Testing Supabase connection...')
    
    // Test 1: Basic connection
    const { data: testData, error: testError } = await supabase
      .from('content_sections')
      .select('*')
      .limit(1)
    
    console.log('Supabase query result:', { data: testData, error: testError })
    
    if (testError) {
      return NextResponse.json({
        success: false,
        error: testError.message,
        code: testError.code,
        details: testError.details,
        hint: testError.hint
      })
    }

    // Test 2: Get all content sections
    const { data: sections, error: sectionsError } = await supabase
      .from('content_sections')
      .select('*')
      .eq('active', true)
    
    console.log('All sections:', sections)
    
    return NextResponse.json({
      success: true,
      connection: 'successful',
      sections: sections,
      count: sections?.length || 0
    })

  } catch (error: any) {
    console.error('❌ Supabase test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}