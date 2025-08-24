import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/admin-auth'
import { ensureDatabaseConnection } from '@/lib/database-wake'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Only allow super_admin to wake database
    const currentUser = getAdminFromRequest(request)
    if (!currentUser || currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log(`Database wake requested by admin: ${currentUser.email}`)
    
    const isAwake = await ensureDatabaseConnection()
    
    if (isAwake) {
      return NextResponse.json({ 
        success: true,
        message: 'Database is now active and ready to receive connections',
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({ 
        success: false,
        message: 'Failed to establish database connection. The database may be experiencing issues.',
        timestamp: new Date().toISOString()
      }, { status: 503 })
    }

  } catch (error) {
    console.error('Error in database wake endpoint:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error while attempting to wake database',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}