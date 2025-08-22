import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAdminFromRequest } from '@/lib/admin-auth'

function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }
  
  return createClient(supabaseUrl, serviceRoleKey)
}

// GET - Fetch current SEO settings
export async function GET(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    
    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createSupabaseClient()
    
    if (!supabase) {
      return NextResponse.json(
        { message: 'Database not configured' },
        { status: 503 }
      )
    }

    let seoSettings = null
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('active', true)
        .order('createdAt', { ascending: false })
        .limit(1)
        .single()
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error
      }
      
      seoSettings = data
    } catch (dbError: any) {
      // If table doesn't exist, return defaults
      console.error('SEO settings fetch error:', dbError)
      const defaultSettings = {
        title: 'Fixing Maritime - Professional Maritime Services',
        description: 'Complete maritime solutions including documentation, truck services, tug boat with barge, procurement, freight forwarding, warehousing, and custom clearing.',
        keywords: 'maritime services, freight forwarding, custom clearing, tug boat, barge, warehousing, procurement, export goods',
        ogTitle: 'Fixing Maritime - Professional Maritime Services',
        ogDescription: 'Your trusted partner for comprehensive maritime solutions',
        needsMigration: true
      }
      return NextResponse.json({ seoSettings: defaultSettings })
    }

    // If no settings exist, return defaults
    if (!seoSettings) {
      const defaultSettings = {
        title: 'Fixing Maritime - Professional Maritime Services',
        description: 'Complete maritime solutions including documentation, truck services, tug boat with barge, procurement, freight forwarding, warehousing, and custom clearing.',
        keywords: 'maritime services, freight forwarding, custom clearing, tug boat, barge, warehousing, procurement, export goods',
        ogTitle: 'Fixing Maritime - Professional Maritime Services',
        ogDescription: 'Your trusted partner for comprehensive maritime solutions'
      }
      return NextResponse.json({ seoSettings: defaultSettings })
    }

    return NextResponse.json({ seoSettings })

  } catch (error: any) {
    console.error('Fetch SEO settings error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch SEO settings' },
      { status: 500 }
    )
  }
}

// POST - Save SEO settings
export async function POST(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    
    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createSupabaseClient()
    
    if (!supabase) {
      return NextResponse.json(
        { message: 'Database not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { title, description, keywords, ogTitle, ogDescription } = body

    if (!title || !description) {
      return NextResponse.json(
        { message: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Deactivate current settings
    await supabase
      .from('seo_settings')
      .update({ active: false })
      .eq('active', true)

    // Create new settings
    const { data: seoSettings, error } = await supabase
      .from('seo_settings')
      .insert({
        title,
        description,
        keywords: keywords || '',
        ogTitle: ogTitle || title,
        ogDescription: ogDescription || description,
        active: true
      })
      .select()
      .single()
    
    if (error) {
      throw error
    }

    return NextResponse.json({ 
      message: 'SEO settings saved successfully',
      seoSettings 
    })

  } catch (error: any) {
    console.error('Save SEO settings error:', error)
    return NextResponse.json(
      { message: 'Failed to save SEO settings' },
      { status: 500 }
    )
  }
}