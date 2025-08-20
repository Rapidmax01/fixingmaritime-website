'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Package, Clock, CheckCircle, XCircle, Plus, Eye, TrendingUp, DollarSign, Ship } from 'lucide-react'
import { motion } from 'framer-motion'

// Mock data - would come from API in real app
const mockOrders = [
  {
    id: 'ORD-2024-001',
    service: 'Documentation Services',
    status: 'completed',
    amount: 300,
    date: '2024-08-15',
    trackingNumber: 'TRK-DOC-001',
  },
  {
    id: 'ORD-2024-002',
    service: 'Freight Forwarding',
    status: 'in_transit',
    amount: 2500,
    date: '2024-08-18',
    trackingNumber: 'TRK-FRT-002',
  },
  {
    id: 'ORD-2024-003',
    service: 'Warehousing',
    status: 'processing',
    amount: 150,
    date: '2024-08-20',
    trackingNumber: 'TRK-WHS-003',
  },
]

const stats = [
  {
    name: 'Active Orders',
    value: '12',
    change: '+2.1%',
    changeType: 'positive',
    icon: Package,
  },
  {
    name: 'Total Spent',
    value: '$15,240',
    change: '+4.5%',
    changeType: 'positive',
    icon: DollarSign,
  },
  {
    name: 'Completed Orders',
    value: '48',
    change: '+12%',
    changeType: 'positive',
    icon: CheckCircle,
  },
  {
    name: 'Shipments In Transit',
    value: '8',
    change: '-2%',
    changeType: 'negative',
    icon: Ship,
  },
]

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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user?.name?.split(' ')[0]}
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your maritime logistics from your dashboard
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => {
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
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            {mockOrders.map((order, index) => {
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
            })}
          </div>
        </div>
      </div>
    </div>
  )
}