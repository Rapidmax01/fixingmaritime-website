'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, Clock, CheckCircle, XCircle, Plus, Eye, TrendingUp, DollarSign, Ship, Truck, Bell, Mail, MessageSquare, Link2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QuoteClaimModal from '@/components/QuoteClaimModal'

// Icon mapping for stats
const getStatIcon = (iconName: string) => {
  switch (iconName) {
    case 'Package': return Package
    case 'DollarSign': return DollarSign
    case 'CheckCircle': return CheckCircle
    case 'Ship': return Ship
    default: return Package
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'in_transit':
      return 'bg-blue-100 text-blue-800'
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircle
    case 'in_transit':
      return Clock
    case 'processing':
      return Clock
    case 'cancelled':
      return XCircle
    default:
      return Package
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.email) {
      console.log('Fetching notifications for:', session.user.email)
      fetchNotifications()
      fetchUnreadCount()
      fetchDashboardStats()
    }
  }, [session])

  const fetchNotifications = async () => {
    try {
      const userId = (session?.user as any)?.id || ''
      const response = await fetch(`/api/notifications?email=${session?.user?.email}&userId=${userId}&limit=10`)
      console.log('Notifications response:', response.status, response.ok)
      if (response.ok) {
        const data = await response.json()
        console.log('Notifications data:', data)
        setNotifications(data.notifications || [])
      } else {
        console.error('Notifications API error:', response.status, await response.text())
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const userId = (session?.user as any)?.id || ''
      const response = await fetch(`/api/notifications?email=${session?.user?.email}&userId=${userId}&count=true`)
      console.log('Unread count response:', response.status, response.ok)
      if (response.ok) {
        const data = await response.json()
        console.log('Unread count data:', data)
        setUnreadCount(data.unreadCount || 0)
      } else {
        console.error('Unread count API error:', response.status, await response.text())
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true)
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Convert icon strings to components
          const statsWithIcons = data.stats.map((stat: any) => ({
            ...stat,
            icon: getStatIcon(stat.icon)
          }))
          setStats(statsWithIcons)
          setOrders(data.orders || [])
        }
      } else {
        console.error('Failed to fetch dashboard stats')
        // Keep empty arrays as fallback
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Keep empty arrays as fallback
    } finally {
      setStatsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: session?.user?.email, 
          action: 'mark_read' 
        })
      })
      if (response.ok) {
        fetchNotifications()
        fetchUnreadCount()
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleQuotesClaimed = () => {
    // Refresh notifications when quotes are claimed
    fetchNotifications()
    fetchUnreadCount()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session.user?.name?.split(' ')[0]}
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your maritime logistics from your dashboard
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            {/* Notifications Bell */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </motion.button>
              
              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto"
                  >
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-sm text-gray-500">{unreadCount} unread</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                          <Mail className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {notifications.map((notification: any) => (
                            <motion.div
                              key={notification.id}
                              whileHover={{ backgroundColor: '#f9fafb' }}
                              className={`p-4 cursor-pointer transition-colors ${
                                notification.status === 'unread' ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                              }`}
                              onClick={() => {
                                if (notification.status === 'unread') {
                                  markAsRead(notification.id)
                                }
                              }}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                  {notification.type === 'quote_response' && (
                                    <MessageSquare className="w-5 h-5 text-blue-600" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium ${
                                    notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'
                                  }`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-2">
                                    {formatDate(notification.createdAt)}
                                  </p>
                                </div>
                                {notification.status === 'unread' && (
                                  <div className="flex-shrink-0">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-200 bg-gray-50">
                        <button className="w-full text-center text-sm text-primary-600 hover:text-primary-800 font-medium py-2 rounded-lg hover:bg-primary-50 transition-colors">
                          View all notifications
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/request-truck">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
              >
                <Truck className="w-4 h-4 mr-2" />
                Request a Truck
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {statsLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-20"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-12"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                </div>
              </motion.div>
            ))
          ) : (
            stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-primary-100 rounded-full">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </motion.div>
              )
            })
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link
              href="/services"
              className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Plus className="h-5 w-5 text-primary-600 mr-2" />
              <span className="font-medium text-gray-900">New Order</span>
            </Link>
            <Link
              href="/track"
              className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Eye className="h-5 w-5 text-primary-600 mr-2" />
              <span className="font-medium text-gray-900">Track Order</span>
            </Link>
            <Link
              href="/invoices"
              className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <DollarSign className="h-5 w-5 text-primary-600 mr-2" />
              <span className="font-medium text-gray-900">View Invoices</span>
            </Link>
            <Link
              href="/support"
              className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Package className="h-5 w-5 text-primary-600 mr-2" />
              <span className="font-medium text-gray-900">Support</span>
            </Link>
            <button
              onClick={() => setShowClaimModal(true)}
              className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Link2 className="h-5 w-5 text-primary-600 mr-2" />
              <span className="font-medium text-gray-900">Claim Quotes</span>
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link
                href="/orders"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {orders.length === 0 ? (
              <div className="p-6 text-center">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-4">Get started by requesting a service quote</p>
                <Link
                  href="/services"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Request Service
                </Link>
              </div>
            ) : (
              orders.map((order, index) => {
                const StatusIcon = getStatusIcon(order.status)
                return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <StatusIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${order.amount}</p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                      <Link
                        href={`/track?order=${order.trackingNumber}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Quote Claim Modal */}
      <QuoteClaimModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        onQuotesClaimed={handleQuotesClaimed}
      />
    </div>
  )
}