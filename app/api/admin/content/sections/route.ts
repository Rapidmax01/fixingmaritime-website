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

// GET - Fetch all content sections
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

    try {
      const { data: sections, error } = await supabase
        .from('content_sections')
        .select('*')
        .eq('active', true)
        .order('type', { ascending: true })
      
      if (error) {
        throw error
      }
      
      return NextResponse.json({ sections })
    } catch (dbError: any) {
      console.error('Database error in content sections:', dbError)
      return NextResponse.json({ 
        sections: [], 
        needsMigration: true,
        message: 'Database tables not found. Please run migration first.' 
      })
    }

  } catch (error: any) {
    console.error('Fetch content sections error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch content sections' },
      { status: 500 }
    )
  }
}

// POST - Create or update content section
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
    const { id, type, name, title, content } = body

    if (!type || !name || !title || !content) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    let section
    if (id) {
      // Update existing section
      const { data, error } = await supabase
        .from('content_sections')
        .update({
          name,
          title,
          content,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      section = data
    } else {
      // Upsert by type
      const { data, error } = await supabase
        .from('content_sections')
        .upsert({
          type,
          name,
          title,
          content,
          active: true
        })
        .select()
        .single()
      
      if (error) throw error
      section = data
    }

    return NextResponse.json({ 
      message: 'Content section saved successfully',
      section 
    })

  } catch (error: any) {
    console.error('Save content section error:', error)
    return NextResponse.json(
      { message: 'Failed to save content section' },
      { status: 500 }
    )
  }
}