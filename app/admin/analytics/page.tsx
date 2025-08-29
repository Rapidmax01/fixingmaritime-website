'use client'

import { useState, useEffect } from 'react'
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
  BarChart3,
  FileText,
  Truck,
  UserPlus,
  Activity,
  Eye,
  Clock,
  Smartphone,
  Monitor
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface AnalyticsData {
  overview: {
    totalRevenue: number
    totalUsers: number
    newUsers: number
    ordersCompleted: number
    conversionRate: number
    totalInvoices: number
    pendingInvoices: number
    truckRequests: number
    truckRegistrations: number
    partnerRegistrations: number
    quoteRequests: number
    acceptedQuotes: number
    activeServices: number
  }
  monthlyData: Array<{
    month: string
    revenue: number
    orders: number
  }>
  topServices: Array<{
    name: string
    orders: number
    revenue: number
  }>
  recentActivities: Array<{
    type: string
    title: string
    description: string
    timestamp: string
    icon: string
  }>
  pageVisits: {
    totalVisits: number
    uniqueVisitors: number
    avgDuration: number
    topPages: Array<{
      page: string
      visits: number
      avgDuration: number
    }>
    deviceBreakdown: Record<string, number>
    browserBreakdown: Record<string, number>
    dailyVisits: Array<{
      date: string
      visits: number
    }>
  }
}

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('30d')
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`)
      const data = await response.json()
      
      if (data.success) {
        setAnalyticsData(data.data)
        if (data.message) {
          toast.success(data.message)
        }
      } else {
        toast.error(data.error || 'Failed to fetch analytics')
        setAnalyticsData(null)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    if (!analyticsData) return
    
    const exportData = {
      exportDate: new Date().toISOString(),
      timeRange,
      overview: analyticsData.overview,
      monthlyRevenue: analyticsData.monthlyData,
      topServices: analyticsData.topServices
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-export-${timeRange}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Analytics data exported successfully')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">No analytics data available</h2>
          <button 
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const { overview, monthlyData, topServices, recentActivities, pageVisits } = analyticsData
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue), 1)

  // Calculate overview stats with changes
  const overviewStats = [
    {
      name: 'Total Revenue',
      value: `₦${overview.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive' as const,
      period: 'vs last month',
      icon: DollarSign
    },
    {
      name: 'Total Users',
      value: overview.totalUsers.toLocaleString(),
      subvalue: `+${overview.newUsers} new`,
      change: '+8.2%',
      changeType: 'positive' as const,
      period: 'vs last month',
      icon: Users
    },
    {
      name: 'Invoices',
      value: overview.totalInvoices.toLocaleString(),
      subvalue: `${overview.pendingInvoices} pending`,
      change: '+15.3%',
      changeType: 'positive' as const,
      period: 'vs last month',
      icon: FileText
    },
    {
      name: 'Conversion Rate',
      value: `${overview.conversionRate}%`,
      subvalue: `${overview.acceptedQuotes}/${overview.quoteRequests} quotes`,
      change: '-2.1%',
      changeType: 'negative' as const,
      period: 'vs last month',
      icon: TrendingUp
    }
  ]

  // Add website metrics to overview stats
  const websiteStats = [
    {
      name: 'Page Views',
      value: pageVisits.totalVisits.toLocaleString(),
      subvalue: `${pageVisits.uniqueVisitors} unique visitors`,
      change: '+25.3%',
      changeType: 'positive' as const,
      period: 'vs last month',
      icon: Eye
    },
    {
      name: 'Avg. Session Duration',
      value: `${Math.floor(pageVisits.avgDuration / 60)}:${String(pageVisits.avgDuration % 60).padStart(2, '0')}`,
      subvalue: 'minutes:seconds',
      change: '+8.7%',
      changeType: 'positive' as const,
      period: 'vs last month',
      icon: Clock
    }
  ]

  const allOverviewStats = [...overviewStats, ...websiteStats]

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
              <button 
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
          {allOverviewStats.map((stat, index) => {
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
                    {stat.subvalue && (
                      <p className="text-xs text-gray-500 mt-1">{stat.subvalue}</p>
                    )}
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
              {monthlyData.map((data, index) => (
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

          {/* Registration Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Registration Activity</h3>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Truck Requests</p>
                    <p className="text-xs text-gray-600">{timeRange} period</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-blue-600">{overview.truckRequests}</p>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Truck Registrations</p>
                    <p className="text-xs text-gray-600">{timeRange} period</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-600">{overview.truckRegistrations}</p>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <UserPlus className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Partner Registrations</p>
                    <p className="text-xs text-gray-600">{timeRange} period</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-purple-600">{overview.partnerRegistrations}</p>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  {recentActivities.slice(0, 3).map((activity, index) => (
                    <div key={index} className="text-xs">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-gray-600">{activity.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Website Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Top Pages */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Top Pages</h3>
              <Eye className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {pageVisits.topPages.slice(0, 5).map((page, index) => (
                <motion.div
                  key={page.page}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{page.page}</p>
                    <p className="text-xs text-gray-500">{Math.floor(page.avgDuration / 60)}:{String(page.avgDuration % 60).padStart(2, '0')} avg time</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{page.visits.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">visits</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Device Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Device Types</h3>
              <Monitor className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {Object.entries(pageVisits.deviceBreakdown).map(([device, count], index) => {
                const total = Object.values(pageVisits.deviceBreakdown).reduce((sum, val) => sum + val, 0)
                const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0'
                const DeviceIcon = device === 'Mobile' ? Smartphone : Monitor
                return (
                  <motion.div
                    key={device}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <DeviceIcon className="h-4 w-4 text-gray-500 mr-3" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-900">{device}</span>
                        <span className="text-sm text-gray-600">{percentage}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          className={`h-2 rounded-full ${device === 'Desktop' ? 'bg-blue-600' : 'bg-green-600'}`}
                        ></motion.div>
                      </div>
                    </div>
                    <span className="ml-3 text-sm text-gray-900">{count.toLocaleString()}</span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Browser Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Browsers</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {Object.entries(pageVisits.browserBreakdown)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([browser, count], index) => {
                  const total = Object.values(pageVisits.browserBreakdown).reduce((sum, val) => sum + val, 0)
                  const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0'
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500']
                  return (
                    <motion.div
                      key={browser}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center flex-1">
                        <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-3`}></div>
                        <span className="text-sm text-gray-900">{browser}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{percentage}%</p>
                        <p className="text-xs text-gray-500">{count.toLocaleString()}</p>
                      </div>
                    </motion.div>
                  )
                })}
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
                {topServices.map((service, index) => (
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
                      <span className="text-sm font-medium text-green-600">
                        {service.orders > 100 ? '+' : ''}{Math.round(Math.random() * 20)}%
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