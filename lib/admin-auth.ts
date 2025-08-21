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

    if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
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

export function isSuperAdmin(user: AdminUser | null): boolean {
  return user?.role === 'super_admin'
}

export function canManageAdmins(user: AdminUser | null): boolean {
  return isSuperAdmin(user)
}

export function getAdminFromRequest(request: NextRequest): AdminUser | null {
  const token = request.cookies.get('admin-token')?.value
  if (!token) {
    return null
  }

  return verifyAdminToken(token)
}