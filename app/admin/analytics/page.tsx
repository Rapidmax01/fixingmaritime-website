'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  Calendar,
  Download,
  Filter,
  BarChart3
} from 'lucide-react'
import { motion } from 'framer-motion'

// Mock analytics data
const overviewStats = [
  {
    name: 'Total Revenue',
    value: '$847,231',
    change: '+12.5%',
    changeType: 'positive',
    period: 'vs last month',
    icon: DollarSign
  },
  {
    name: 'Active Users',
    value: '1,234',
    change: '+8.2%',
    changeType: 'positive',
    period: 'vs last month',
    icon: Users
  },
  {
    name: 'Orders Completed',
    value: '2,156',
    change: '+15.3%',
    changeType: 'positive',
    period: 'vs last month',
    icon: Package
  },
  {
    name: 'Conversion Rate',
    value: '3.2%',
    change: '-2.1%',
    changeType: 'negative',
    period: 'vs last month',
    icon: TrendingUp
  }
]

const revenueData = [
  { month: 'Jan', revenue: 45000, orders: 123 },
  { month: 'Feb', revenue: 52000, orders: 145 },
  { month: 'Mar', revenue: 48000, orders: 134 },
  { month: 'Apr', revenue: 61000, orders: 167 },
  { month: 'May', revenue: 67000, orders: 189 },
  { month: 'Jun', revenue: 74000, orders: 203 },
  { month: 'Jul', revenue: 82000, orders: 234 },
  { month: 'Aug', revenue: 89000, orders: 256 }
]

const servicePerformance = [
  { name: 'Freight Forwarding', orders: 312, revenue: 298700, growth: '+18%' },
  { name: 'Tug Boat with Barge', orders: 47, revenue: 234500, growth: '+25%' },
  { name: 'Truck Services', orders: 203, revenue: 78900, growth: '+12%' },
  { name: 'Procurement Services', orders: 89, revenue: 167800, growth: '+8%' },
  { name: 'Warehousing', orders: 178, revenue: 67400, growth: '+5%' },
  { name: 'Documentation Services', orders: 156, revenue: 45600, growth: '+15%' },
  { name: 'Custom Clearing', orders: 124, revenue: 34200, growth: '-3%' }
]

const topCustomers = [
  { name: 'Global Shipping Ltd', orders: 25, revenue: 45600, growth: '+12%' },
  { name: 'Ocean Freight Services', orders: 18, revenue: 32100, growth: '+8%' },
  { name: 'Maritime Solutions Co', orders: 15, revenue: 28900, growth: '+15%' },
  { name: 'Acme Corporation', orders: 12, revenue: 15240, growth: '+5%' },
  { name: 'Port Logistics Inc', orders: 8, revenue: 12800, growth: '-2%' }
]

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('30d')

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              href="/admin"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Admin Dashboard
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
              <p className="mt-2 text-gray-600">
                Track performance and business metrics
              </p>
            </div>
            <div className="flex gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="block px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {overviewStats.map((stat, index) => {
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
                  <div className={`flex items-center ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">{stat.period}</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {revenueData.map((data, index) => (
                <div key={data.month} className="flex items-center">
                  <div className="w-8 text-sm text-gray-600">{data.month}</div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-primary-600 h-2 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-900 text-right">
                    ${(data.revenue / 1000).toFixed(0)}k
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Customers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Top Customers</h3>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <motion.div
                  key={customer.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${customer.revenue.toLocaleString()}
                    </p>
                    <p className={`text-sm ${
                      customer.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {customer.growth}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Service Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Service Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Growth
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Order Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {servicePerformance.map((service, index) => (
                  <motion.tr
                    key={service.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{service.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${service.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        service.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {service.growth}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${Math.round(service.revenue / service.orders).toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}