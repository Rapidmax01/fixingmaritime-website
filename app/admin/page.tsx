'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { 
  Users, 
  User,
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
  Clock,
  LogOut,
  Shield,
  Crown
} from 'lucide-react'
import { motion } from 'framer-motion'
import AdminHeader from '@/components/AdminHeader'
import DatabaseStatus from '@/components/DatabaseStatus'

interface AdminUser {
  id: string
  email: string
  name?: string
  role: string
}

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
    name: 'Quote Requests',
    value: '89',
    change: '+8%',
    changeType: 'positive',
    icon: Package,
    color: 'bg-green-500'
  },
  {
    name: 'Pending Quotes',
    value: '23',
    change: '+5%',
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
    type: 'quote',
    message: 'New quote request for Documentation Services from Acme Corp',
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
    type: 'quote',
    message: 'Quote response sent for Freight Forwarding service',
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
    name: 'Quote Requests',
    description: 'Manage customer quote requests',
    href: '/admin/quotes',
    icon: DollarSign,
    color: 'bg-blue-500'
  },
  {
    name: 'Service Management',
    description: 'Configure maritime services',
    href: '/admin/services',
    icon: Ship,
    color: 'bg-green-500'
  },
  {
    name: 'User Management',
    description: 'View and manage all users',
    href: '/admin/users',
    icon: Users,
    color: 'bg-purple-500'
  },
  {
    name: 'Content Management',
    description: 'Manage website content',
    href: '/admin/content',
    icon: FileText,
    color: 'bg-orange-500'
  },
  {
    name: 'Analytics',
    description: 'View reports and analytics',
    href: '/admin/analytics',
    icon: BarChart3,
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
    case 'quote': return DollarSign
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
  const router = useRouter()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/me')
      if (response.ok) {
        const data = await response.json()
        setAdmin(data.user)
      } else {
        router.push('/admin/login')
        return
      }
    } catch (error) {
      router.push('/admin/login')
      return
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        toast.success('Logged out successfully')
        router.push('/admin/login')
      } else {
        toast.error('Failed to logout')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access the admin dashboard.</p>
          <Link 
            href="/admin/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Go to Admin Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <AdminHeader admin={admin} onLogout={handleLogout} />
      <div className="flex-grow mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Database Status */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <DatabaseStatus />
        </motion.div>
        
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-slate-600 text-lg">
                Welcome back, <span className="font-semibold text-blue-600">{admin.name || admin.email}</span>
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
              >
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium">System Online</span>
              </motion.div>
              <div className="hidden md:flex items-center px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg">
                <User className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-slate-700 capitalize">
                  {admin.role.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {adminStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl p-6 border border-white/20 transition-all duration-300 overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{stat.name}</p>
                      <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    </div>
                    <motion.div 
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className={`relative p-3 rounded-2xl ${stat.color.replace('bg-', 'bg-').replace('-500', '-100')} shadow-lg group-hover:shadow-xl transition-shadow`}
                    >
                      <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                      <div className={`absolute inset-0 rounded-2xl ${stat.color.replace('bg-', 'bg-').replace('-500', '-200')} opacity-0 group-hover:opacity-20 transition-opacity`}></div>
                    </motion.div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      stat.changeType === 'positive' ? 'bg-green-100 text-green-700' : 
                      stat.changeType === 'negative' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <TrendingUp className={`w-3 h-3 mr-1 ${
                        stat.changeType === 'negative' ? 'rotate-180' : ''
                      }`} />
                      {stat.change}
                    </div>
                    <span className="text-xs text-slate-500 ml-2">vs last month</span>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.color.replace('bg-', 'bg-')} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Quick Actions</h2>
              <p className="text-slate-600">Access commonly used admin functions</p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <motion.div
                    key={action.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    whileHover={{ y: -3, scale: 1.02 }}
                  >
                    <Link
                      href={action.href}
                      className="group relative block p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-300 overflow-hidden"
                    >
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.color.replace('bg-', 'from-').replace('-500', '-50')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      
                      <div className="relative flex items-center">
                        <motion.div 
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          className={`p-4 rounded-2xl ${action.color.replace('bg-', 'bg-').replace('-500', '-100')} shadow-lg group-hover:shadow-xl transition-shadow mr-4`}
                        >
                          <Icon className={`h-7 w-7 ${action.color.replace('bg-', 'text-')}`} />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-800">{action.name}</h3>
                          <p className="text-sm text-slate-600 mt-1">{action.description}</p>
                        </div>
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                        </div>
                      </div>

                      {/* Hover Effect */}
                      <div className={`absolute bottom-0 left-0 right-0 h-1 ${action.color.replace('bg-', 'bg-')} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Live Activity</h2>
              <p className="text-slate-600">Real-time system updates</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Recent Events</h3>
                  <div className="flex items-center text-xs text-slate-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    Live
                  </div>
                </div>
                
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const ActivityIcon = getActivityIcon(activity.type)
                    const StatusIcon = getStatusIcon(activity.status)
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                        className="group relative flex items-start p-4 rounded-xl hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="flex-shrink-0 relative">
                          <div className={`p-2 rounded-full ${
                            activity.status === 'completed' ? 'bg-green-100' :
                            activity.status === 'pending' ? 'bg-yellow-100' :
                            'bg-blue-100'
                          }`}>
                            <ActivityIcon className={`h-4 w-4 ${
                              activity.status === 'completed' ? 'text-green-600' :
                              activity.status === 'pending' ? 'text-yellow-600' :
                              'text-blue-600'
                            }`} />
                          </div>
                          {index !== recentActivity.length - 1 && (
                            <div className="absolute top-8 left-1/2 w-px h-6 bg-slate-200 transform -translate-x-1/2"></div>
                          )}
                        </div>
                        
                        <div className="ml-4 flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 leading-relaxed">
                            {activity.message}
                          </p>
                          <div className="mt-2 flex items-center">
                            <StatusIcon className={`h-3 w-3 mr-1 ${getStatusColor(activity.status)}`} />
                            <span className="text-xs text-slate-500">{activity.time}</span>
                          </div>
                        </div>
                        
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-6 pt-4 border-t border-slate-100"
                >
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors py-2 rounded-lg hover:bg-blue-50">
                    View all activity →
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}