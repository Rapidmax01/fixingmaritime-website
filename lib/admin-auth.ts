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

    if (!['sub_admin', 'admin', 'super_admin'].includes(decoded.role)) {
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

export function isAdmin(user: AdminUser | null): boolean {
  return user?.role === 'admin'
}

export function isSubAdmin(user: AdminUser | null): boolean {
  return user?.role === 'sub_admin'
}

export function canManageAdmins(user: AdminUser | null): boolean {
  return isSuperAdmin(user)
}

export function canCreateUsers(user: AdminUser | null): boolean {
  return isSuperAdmin(user) || isAdmin(user)
}

export function canDeleteUsers(user: AdminUser | null): boolean {
  return isSuperAdmin(user) || isAdmin(user)
}

export function canApproveUsers(user: AdminUser | null): boolean {
  return isSuperAdmin(user) || isAdmin(user) || isSubAdmin(user)
}

export function canPromoteUsers(user: AdminUser | null): boolean {
  return isSuperAdmin(user)
}

export function canViewUser(currentUser: AdminUser | null, targetUserRole: string): boolean {
  if (isSuperAdmin(currentUser)) return true
  if (targetUserRole === 'super_admin') return false // Hide super_admins from others
  return isAdmin(currentUser) || isSubAdmin(currentUser)
}

export function canEditUser(currentUser: AdminUser | null, targetUserRole: string): boolean {
  if (isSuperAdmin(currentUser) && targetUserRole !== 'super_admin') return true
  if (targetUserRole === 'super_admin') return false // Can't edit super_admins
  return isAdmin(currentUser) && targetUserRole !== 'admin'
}

export function canDeleteUser(currentUser: AdminUser | null, targetUserRole: string): boolean {
  if (!canDeleteUsers(currentUser)) return false
  if (targetUserRole === 'super_admin') return false // Can't delete super_admins
  if (isSuperAdmin(currentUser)) return targetUserRole !== 'super_admin'
  if (isAdmin(currentUser)) return !['admin', 'super_admin'].includes(targetUserRole)
  return false
}

export async function getAdminFromRequest(request: NextRequest): Promise<AdminUser | null> {
  const token = request.cookies.get('admin-token')?.value
  if (!token) {
    // In demo mode, return demo admin when no token exists
    if (process.env.NODE_ENV === 'development' || !process.env.DATABASE_URL) {
      return {
        id: 'demo-admin',
        email: 'admin@fixingmaritime.com',
        name: 'Demo Admin',
        role: 'super_admin'
      }
    }
    return null
  }

  return verifyAdminToken(token)
}