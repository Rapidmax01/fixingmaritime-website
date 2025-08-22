import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }
  
  return createClient(supabaseUrl, serviceRoleKey)
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    
    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }

    const supabase = createSupabaseClient()
    
    if (!supabase) {
      return NextResponse.json({ 
        message: 'Database not configured',
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }, { status: 503 })
    }

    // First, let's check what tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['users', 'app_users', 'Users'])
    
    console.log('Available tables:', tables)

    // Try to find user in app_users table
    const { data: appUser, error: appUserError } = await supabase
      .from('app_users')
      .select('*')
      .eq('email', email)
      .single()
    
    // Also try users table (in case schema is different)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    // Check case-insensitive as well
    const { data: appUserCI, error: appUserCIError } = await supabase
      .from('app_users')
      .select('*')
      .ilike('email', email)
      .single()

    const foundUser = appUser || user || appUserCI
    
    if (!foundUser) {
      return NextResponse.json({
        message: 'User not found',
        debug: {
          searchedEmail: email,
          appUsersError: appUserError?.message,
          usersError: userError?.message,
          tables: tables?.map(t => t.table_name),
          foundInAppUsers: !!appUser,
          foundInUsers: !!user,
          foundCaseInsensitive: !!appUserCI
        }
      }, { status: 404 })
    }

    // Check password if provided
    let passwordValid = false
    if (password && foundUser.password) {
      passwordValid = await bcrypt.compare(password, foundUser.password)
    }

    return NextResponse.json({
      message: 'User found',
      debug: {
        email: foundUser.email,
        hasPassword: !!foundUser.password,
        passwordValid: passwordValid,
        role: foundUser.role,
        emailVerified: foundUser.emailVerified,
        id: foundUser.id,
        name: foundUser.name,
        tableName: appUser ? 'app_users' : user ? 'users' : 'app_users (case-insensitive)'
      }
    })

  } catch (error: any) {
    console.error('Debug login error:', error)
    return NextResponse.json({
      message: 'Debug failed',
      error: error.message
    }, { status: 500 })
  }
}