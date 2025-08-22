import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    console.log('Content API (Supabase) called')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.log('Supabase not configured, returning default content')
      return getDefaultContent()
    }

    // Create admin client to bypass RLS
    const supabase = createClient(supabaseUrl, serviceRoleKey)
    
    console.log('Fetching content sections from Supabase...')
    
    // Fetch content sections
    const { data: sections, error: sectionsError } = await supabase
      .from('content_sections')
      .select('*')
      .eq('active', true)
    
    if (sectionsError) {
      console.error('Error fetching sections:', sectionsError)
      return getDefaultContent()
    }
    
    console.log('Found sections:', sections?.length, sections?.map(s => ({ type: s.type, title: s.title })))

    // Fetch SEO settings
    const { data: seoData, error: seoError } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('active', true)
      .single()
    
    if (seoError) {
      console.log('No SEO settings found:', seoError.message)
    }

    // Transform sections into easier format
    const sectionsMap: any = {}
    sections?.forEach(section => {
      sectionsMap[section.type] = {
        id: section.id,
        title: section.title,
        content: section.content,
        name: section.name
      }
    })

    console.log('Returning Supabase content with sections:', Object.keys(sectionsMap))
    
    const response = NextResponse.json({
      sections: sectionsMap,
      seo: seoData || getDefaultSEO(),
      source: 'supabase'
    })
    
    // Add cache control headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response

  } catch (error: any) {
    console.error('Supabase content API error:', error)
    return getDefaultContent()
  }
}

function getDefaultContent() {
  return NextResponse.json({
    sections: {
      hero: {
        title: 'Your Gateway to Global Maritime Solutions',
        content: 'Professional maritime services with real-time tracking and comprehensive logistics support.'
      },
      about: {
        title: 'Leading Maritime Service Provider',
        content: 'With years of experience in the maritime industry, we provide comprehensive solutions for all your maritime needs.'
      },
      services: {
        title: 'Comprehensive Maritime Services',
        content: 'We offer a complete suite of maritime services designed to streamline your logistics operations.'
      },
      contact: {
        title: 'Get in Touch',
        content: 'Ready to streamline your maritime operations? Contact our expert team today.'
      },
      footer: {
        title: 'Fixing Maritime',
        content: 'Your comprehensive maritime solutions partner trusted worldwide.'
      }
    },
    seo: getDefaultSEO(),
    source: 'default'
  })
}

function getDefaultSEO() {
  return {
    title: 'Fixing Maritime - Professional Maritime Services',
    description: 'Complete maritime solutions including documentation, truck services, tug boat with barge, procurement, freight forwarding, warehousing, and custom clearing.',
    keywords: 'maritime services, freight forwarding, custom clearing, tug boat, barge, warehousing, procurement, export goods',
    ogTitle: 'Fixing Maritime - Professional Maritime Services',
    ogDescription: 'Your trusted partner for comprehensive maritime solutions'
  }
}