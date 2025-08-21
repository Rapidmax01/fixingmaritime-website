import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export interface AdminUser {
  id: string
  email: string
  name?: string
  role: string
}

export function verifyAdminToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || 'fallback-secret'
    ) as any

    if (decoded.role !== 'admin') {
      return null
    }

    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    }
  } catch (error) {
    return null
  }
}

export function getAdminFromRequest(request: NextRequest): AdminUser | null {
  const token = request.cookies.get('admin-token')?.value
  if (!token) {
    return null
  }

  return verifyAdminToken(token)
}