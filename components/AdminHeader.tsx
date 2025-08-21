'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Shield, LogOut, Crown, Users, Package, Ship, BarChart3, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AdminUser {
  id: string
  email: string
  name?: string
  role: string
}

interface AdminHeaderProps {
  admin: AdminUser
  onLogout: () => void
}

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: Shield },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Orders', href: '/admin/orders', icon: Package },
  { name: 'Services', href: '/admin/services', icon: Ship },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminHeader({ admin, onLogout }: AdminHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  return (
    <header className="bg-red-600 shadow-sm sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Admin Navigation">
        <div className="flex lg:flex-1">
          <Link href="/admin" className="-m-1.5 p-1.5 flex items-center">
            <Shield className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-bold text-white">Admin Portal</span>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-6">
          {adminNavigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center text-sm font-semibold leading-6 text-white hover:text-red-200 transition-colors"
              >
                <Icon className="h-4 w-4 mr-1" />
                {item.name}
              </Link>
            )
          })}
          
          {admin.role === 'super_admin' && (
            <Link
              href="/admin/admins"
              className="flex items-center text-sm font-semibold leading-6 text-yellow-200 hover:text-yellow-100 transition-colors"
            >
              <Crown className="h-4 w-4 mr-1" />
              Manage Admins
            </Link>
          )}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <div className="flex items-center text-sm text-white">
            <div className="flex items-center">
              {admin.role === 'super_admin' ? (
                <Crown className="h-4 w-4 text-yellow-200 mr-1" />
              ) : (
                <Shield className="h-4 w-4 text-white mr-1" />
              )}
              <span className="font-medium">{admin.name || admin.email}</span>
              <span className="ml-2 text-xs text-red-200">
                ({admin.role.replace('_', ' ')})
              </span>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center text-sm font-semibold leading-6 text-white hover:text-red-200 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </button>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <div className={`lg:hidden ${mobileMenuOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 z-50" />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-red-600 px-6 py-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="-m-1.5 p-1.5 flex items-center">
              <Shield className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white">Admin Portal</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-red-500/20">
              <div className="space-y-2 py-6">
                {adminNavigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-red-500"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      {item.name}
                    </Link>
                  )
                })}
                
                {admin.role === 'super_admin' && (
                  <Link
                    href="/admin/admins"
                    className="-mx-3 flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-yellow-200 hover:bg-red-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Crown className="h-5 w-5 mr-2" />
                    Manage Admins
                  </Link>
                )}
              </div>
              
              <div className="py-6">
                <div className="text-white text-sm mb-4">
                  <div className="flex items-center mb-2">
                    {admin.role === 'super_admin' ? (
                      <Crown className="h-4 w-4 text-yellow-200 mr-1" />
                    ) : (
                      <Shield className="h-4 w-4 text-white mr-1" />
                    )}
                    <span className="font-medium">{admin.name || admin.email}</span>
                  </div>
                  <span className="text-xs text-red-200">
                    {admin.role.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <button
                  onClick={() => {
                    onLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="-mx-3 flex items-center rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-red-500 w-full text-left"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}