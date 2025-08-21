'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Settings, 
  BarChart3,
  FileText,
  Ship,
  Truck,
  Warehouse,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { motion } from 'framer-motion'

// Mock admin data
const adminStats = [
  {
    name: 'Total Users',
    value: '1,234',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
    color: 'bg-blue-500'
  },
  {
    name: 'Active Orders',
    value: '89',
    change: '+8%',
    changeType: 'positive',
    icon: Package,
    color: 'bg-green-500'
  },
  {
    name: 'Monthly Revenue',
    value: '$45,678',
    change: '+15%',
    changeType: 'positive',
    icon: DollarSign,
    color: 'bg-purple-500'
  },
  {
    name: 'Services Active',
    value: '7',
    change: '0%',
    changeType: 'neutral',
    icon: Ship,
    color: 'bg-orange-500'
  }
]

const recentActivity = [
  {
    id: 1,
    type: 'order',
    message: 'New order #ORD-2024-089 from Acme Corp',
    time: '2 minutes ago',
    status: 'new'
  },
  {
    id: 2,
    type: 'user',
    message: 'New user registration: john@example.com',
    time: '15 minutes ago',
    status: 'pending'
  },
  {
    id: 3,
    type: 'payment',
    message: 'Payment received for order #ORD-2024-087',
    time: '1 hour ago',
    status: 'completed'
  },
  {
    id: 4,
    type: 'service',
    message: 'Freight forwarding service updated',
    time: '2 hours ago',
    status: 'completed'
  }
]

const quickActions = [
  {
    name: 'User Management',
    description: 'Manage user accounts and permissions',
    href: '/admin/users',
    icon: Users,
    color: 'bg-blue-500'
  },
  {
    name: 'Order Management',
    description: 'View and manage all orders',
    href: '/admin/orders',
    icon: Package,
    color: 'bg-green-500'
  },
  {
    name: 'Service Management',
    description: 'Configure maritime services',
    href: '/admin/services',
    icon: Ship,
    color: 'bg-purple-500'
  },
  {
    name: 'Analytics',
    description: 'View reports and analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    color: 'bg-orange-500'
  },
  {
    name: 'Content Management',
    description: 'Manage website content',
    href: '/admin/content',
    icon: FileText,
    color: 'bg-indigo-500'
  },
  {
    name: 'System Settings',
    description: 'Configure system settings',
    href: '/admin/settings',
    icon: Settings,
    color: 'bg-gray-500'
  }
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'order': return Package
    case 'user': return Users
    case 'payment': return DollarSign
    case 'service': return Ship
    default: return AlertCircle
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return CheckCircle
    case 'pending': return Clock
    case 'new': return AlertCircle
    default: return Clock
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-600'
    case 'pending': return 'text-yellow-600'
    case 'new': return 'text-blue-600'
    default: return 'text-gray-600'
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    
    // Check if user is admin (in demo mode, allow access if logged in)
    if (session?.user) {
      // In production, you would check user role from database
      // For demo: admin@fixingmaritime.com or any user ending with @admin.com
      const isAdminUser = session.user.email?.includes('admin') || 
                         session.user.email === 'admin@fixingmaritime.com'
      setIsAdmin(true) // For demo, allow all logged-in users
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access the admin dashboard.</p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Go to User Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Manage your maritime logistics platform
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                System Online
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {adminStats.map((stat, index) => {
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
                  <div className={`p-3 rounded-full ${stat.color.replace('bg-', 'bg-').replace('-500', '-100')}`}>
                    <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <motion.div
                    key={action.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      href={action.href}
                      className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center">
                        <div className={`p-3 rounded-full ${action.color.replace('bg-', 'bg-').replace('-500', '-100')} mr-4`}>
                          <Icon className={`h-6 w-6 ${action.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{action.name}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="divide-y divide-gray-200">
                {recentActivity.map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.type)
                  const StatusIcon = getStatusIcon(activity.status)
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="p-4"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <ActivityIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <div className="mt-1 flex items-center">
                            <StatusIcon className={`h-4 w-4 mr-1 ${getStatusColor(activity.status)}`} />
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              <div className="p-4 border-t border-gray-200">
                <Link 
                  href="/admin/activity"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  View all activity →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}