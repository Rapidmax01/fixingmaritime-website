'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Shield, LogOut, Crown, Users, Package, Ship, BarChart3, Settings, User, Bell, Search, Truck, FileText, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import DatabaseStatus from './DatabaseStatus'
import { useMessageNotifications } from '@/hooks/useMessageNotifications'

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
  { name: 'Dashboard', href: '/admin', icon: Shield, description: 'Main overview' },
  { name: 'Inbox', href: '/admin/inbox', icon: Mail, description: 'Customer messages' },
  { name: 'Users', href: '/admin/users', icon: Users, description: 'User management' },
  { name: 'Orders', href: '/admin/orders', icon: Package, description: 'Order tracking' },
  { name: 'Services', href: '/admin/services', icon: Ship, description: 'Service config' },
  { name: 'Content', href: '/admin/content', icon: FileText, description: 'Website content' },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, description: 'Reports & insights' },
  { name: 'Settings', href: '/admin/settings', icon: Settings, description: 'System settings' },
]

const registrationNavigation = [
  { name: 'Truck Requests', href: '/admin/truck-requests', icon: Truck, description: 'Service requests', badge: '12' },
  { name: 'Truck Registrations', href: '/admin/truck-registrations', icon: Users, description: 'Owner applications', badge: '5' },
  { name: 'Partner Registrations', href: '/admin/partner-registrations', icon: Package, description: 'Agent applications', badge: '3' },
]

export default function AdminHeader({ admin, onLogout }: AdminHeaderProps) {
  const { unreadCount } = useMessageNotifications()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, title: 'New truck registration', message: 'John Doe submitted application', time: '2 min ago', unread: true },
    { id: 2, title: 'Order completed', message: 'Order #ORD-2024-089 delivered', time: '15 min ago', unread: true },
    { id: 3, title: 'System update', message: 'Database backup completed', time: '1 hour ago', unread: false },
  ]

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-slate-50/90 via-blue-50/90 to-indigo-50/90 backdrop-blur-xl shadow-lg border-b border-slate-200/50 sticky top-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-6 py-3" aria-label="Admin Navigation">
        {/* Top Row - Brand and Actions */}
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="relative p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md"
            >
              <Shield className="h-5 w-5 text-white" />
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>
            <div className="ml-3">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Maritime Admin
              </span>
            </div>
          </Link>
          
          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Bar - Compact */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </motion.button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                  >
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                      <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <div className="flex items-start">
                            <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                              <p className="text-xs text-slate-600">{notification.message}</p>
                              <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile */}
            <Link
              href="/admin/profile"
              className="group flex items-center px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
            >
              <div className="relative">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {admin.role === 'super_admin' ? (
                    <Crown className="h-4 w-4 text-white" />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="ml-2 text-left hidden sm:block">
                <div className="font-medium text-slate-900">{admin.name || 'Admin'}</div>
                <div className="text-xs text-slate-500 capitalize">
                  {admin.role.replace('_', ' ')}
                </div>
              </div>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
            >
              <LogOut className="h-4 w-4" />
            </motion.button>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Row - Navigation */}
        <div className="hidden lg:flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-1">
            {adminNavigation.map((item) => {
              const Icon = item.icon
              return (
                <motion.div key={item.name} whileHover={{ y: -2 }}>
                  <Link
                    href={item.href}
                    className="group relative flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200"
                  >
                    <Icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    {item.name}
                    {item.name === 'Inbox' && unreadCount > 0 && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
          
          <div className="flex items-center space-x-1">
            <div className="text-xs text-slate-400 mr-3">Registration Management</div>
            {registrationNavigation.map((item) => {
              const Icon = item.icon
              return (
                <motion.div key={item.name} whileHover={{ y: -2 }}>
                  <Link
                    href={item.href}
                    className="group relative flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-green-600 rounded-lg hover:bg-green-50 transition-all duration-200"
                  >
                    <Icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    {item.name}
                    {item.badge && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </Link>
                </motion.div>
              )
            })}
            
            {admin.role === 'super_admin' && (
              <motion.div whileHover={{ y: -2 }}>
                <Link
                  href="/admin/admins"
                  className="group relative flex items-center px-3 py-2 text-sm font-medium text-yellow-600 hover:text-yellow-700 rounded-lg hover:bg-yellow-50 transition-all duration-200"
                >
                  <Crown className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Super Admin
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-800 px-6 py-6 sm:max-w-sm border-l border-slate-700"
            >
              <div className="flex items-center justify-between mb-8">
                <Link href="/admin" className="flex items-center group" onClick={() => setMobileMenuOpen(false)}>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="relative p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg"
                  >
                    <Shield className="h-6 w-6 text-white" />
                  </motion.div>
                  <div className="ml-3">
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Maritime Admin
                    </span>
                  </div>
                </Link>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </motion.button>
              </div>
              
              {/* Search Bar for Mobile */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                {adminNavigation.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center rounded-xl px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="p-2 bg-slate-700/50 rounded-lg mr-3 group-hover:bg-blue-500/20 transition-colors">
                          <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span>{item.name}</span>
                            {item.name === 'Inbox' && unreadCount > 0 && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">{item.description}</div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
                
                <div className="border-t border-slate-700 my-4 pt-4">
                  <h3 className="px-4 py-2 text-sm font-semibold text-slate-400 uppercase tracking-wide">Registrations</h3>
                </div>
                
                {registrationNavigation.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (adminNavigation.length + index) * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center rounded-xl px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="p-2 bg-slate-700/50 rounded-lg mr-3 group-hover:bg-green-500/20 transition-colors">
                          <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span>{item.name}</span>
                            {item.badge && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">{item.description}</div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
                
                {admin.role === 'super_admin' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (adminNavigation.length + registrationNavigation.length) * 0.1 }}
                  >
                    <Link
                      href="/admin/admins"
                      className="flex items-center rounded-xl px-4 py-3 text-base font-medium text-yellow-300 hover:text-yellow-100 hover:bg-yellow-500/10 transition-all duration-200 group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="p-2 bg-yellow-500/20 rounded-lg mr-3 group-hover:bg-yellow-500/30 transition-colors">
                        <Crown className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <div>Super Admin</div>
                        <div className="text-xs text-yellow-400/70">Manage administrators</div>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </div>
              
              {/* User Profile Section */}
              <div className="mt-8 pt-6 border-t border-slate-700">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      {admin.role === 'super_admin' ? (
                        <Crown className="h-6 w-6 text-white" />
                      ) : (
                        <User className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800"></div>
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-white">{admin.name || 'Admin User'}</div>
                    <div className="text-sm text-slate-400 capitalize">
                      {admin.role.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/admin/profile"
                      className="flex items-center rounded-xl px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="p-2 bg-slate-700/50 rounded-lg mr-3 group-hover:bg-blue-500/20 transition-colors">
                        <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <span>Profile Settings</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <button
                      onClick={() => {
                        onLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center rounded-xl px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-red-600/20 transition-all duration-200 group w-full"
                    >
                      <div className="p-2 bg-slate-700/50 rounded-lg mr-3 group-hover:bg-red-500/20 transition-colors">
                        <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <span>Logout</span>
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}