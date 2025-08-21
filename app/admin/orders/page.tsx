'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Edit, 
  Eye, 
  CheckCircle, 
  Clock,
  XCircle,
  Package,
  Truck,
  Ship,
  FileText,
  Warehouse,
  Navigation
} from 'lucide-react'
import { motion } from 'framer-motion'

// Mock order data
const mockOrders = [
  {
    id: 'ORD-2024-089',
    customer: 'John Smith',
    customerEmail: 'john.smith@acmecorp.com',
    service: 'Documentation Services',
    status: 'completed',
    priority: 'normal',
    amount: 350,
    orderDate: '2024-08-20',
    dueDate: '2024-08-25',
    trackingNumber: 'TRK-DOC-089',
    notes: 'Urgent customs documentation required'
  },
  {
    id: 'ORD-2024-088',
    customer: 'Sarah Johnson',
    customerEmail: 'sarah.j@maritimeco.com',
    service: 'Freight Forwarding',
    status: 'in_transit',
    priority: 'high',
    amount: 2800,
    orderDate: '2024-08-18',
    dueDate: '2024-08-28',
    trackingNumber: 'TRK-FRT-088',
    notes: 'Container #MSKU7834562'
  },
  {
    id: 'ORD-2024-087',
    customer: 'Michael Chen',
    customerEmail: 'mchen@globalship.com',
    service: 'Warehousing',
    status: 'processing',
    priority: 'normal',
    amount: 180,
    orderDate: '2024-08-19',
    dueDate: '2024-08-26',
    trackingNumber: 'TRK-WHS-087',
    notes: 'Temperature controlled storage needed'
  },
  {
    id: 'ORD-2024-086',
    customer: 'Emily Rodriguez',
    customerEmail: 'emily@oceanfreight.com',
    service: 'Tug Boat with Barge',
    status: 'pending',
    priority: 'urgent',
    amount: 4500,
    orderDate: '2024-08-21',
    dueDate: '2024-08-24',
    trackingNumber: 'TRK-TUG-086',
    notes: 'Heavy machinery transport'
  },
  {
    id: 'ORD-2024-085',
    customer: 'David Wilson',
    customerEmail: 'dwilson@portlogistics.com',
    service: 'Custom Clearing',
    status: 'cancelled',
    priority: 'low',
    amount: 275,
    orderDate: '2024-08-17',
    dueDate: '2024-08-22',
    trackingNumber: 'TRK-CUS-085',
    notes: 'Cancelled by customer request'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'in_transit':
      return 'bg-blue-100 text-blue-800'
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'pending':
      return 'bg-orange-100 text-orange-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800'
    case 'high':
      return 'bg-orange-100 text-orange-800'
    case 'normal':
      return 'bg-blue-100 text-blue-800'
    case 'low':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getServiceIcon = (service: string) => {
  switch (service.toLowerCase()) {
    case 'documentation services':
      return FileText
    case 'freight forwarding':
      return Truck
    case 'warehousing':
      return Warehouse
    case 'tug boat with barge':
      return Ship
    case 'custom clearing':
      return Navigation
    default:
      return Package
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircle
    case 'in_transit':
    case 'processing':
      return Clock
    case 'pending':
      return Clock
    case 'cancelled':
      return XCircle
    default:
      return Package
  }
}

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesService = serviceFilter === 'all' || order.service === serviceFilter
    
    return matchesSearch && matchesStatus && matchesService
  })

  const stats = {
    total: mockOrders.length,
    pending: mockOrders.filter(o => o.status === 'pending').length,
    processing: mockOrders.filter(o => o.status === 'processing').length,
    in_transit: mockOrders.filter(o => o.status === 'in_transit').length,
    completed: mockOrders.filter(o => o.status === 'completed').length,
    cancelled: mockOrders.filter(o => o.status === 'cancelled').length
  }

  const services = Array.from(new Set(mockOrders.map(order => order.service)))

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
              <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="mt-2 text-gray-600">
                View and manage all customer orders
              </p>
            </div>
            <div className="flex gap-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-semibold text-orange-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-semibold text-yellow-600">{stats.processing}</div>
            <div className="text-sm text-gray-600">Processing</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-semibold text-blue-600">{stats.in_transit}</div>
            <div className="text-sm text-gray-600">In Transit</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-semibold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-semibold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="in_transit">In Transit</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Services</option>
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Orders ({filteredOrders.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order, index) => {
                  const ServiceIcon = getServiceIcon(order.service)
                  const StatusIcon = getStatusIcon(order.status)
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.id}</div>
                          <div className="text-sm text-gray-500">{order.trackingNumber}</div>
                          <div className="text-xs text-gray-400">{order.orderDate}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                          <div className="text-sm text-gray-500">{order.customerEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ServiceIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{order.service}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                          {order.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative">
                          <button
                            onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {selectedOrder === order.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                              <div className="py-1">
                                <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </button>
                                <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Update Status
                                </button>
                                <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                  <Package className="h-4 w-4 mr-2" />
                                  Track Order
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}