'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { 
  Truck, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin,
  Package,
  User,
  Phone,
  Mail,
  Calendar,
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react'
import { motion } from 'framer-motion'
import AdminHeader from '@/components/AdminHeader'

interface TruckRequest {
  id: string
  companyName: string
  contactName: string
  email: string
  phoneNumber: string
  pickupAddress: string
  deliveryAddress: string
  cargoType: string
  cargoWeight: string
  cargoValue: string
  specialInstructions?: string
  serviceType: string
  urgency: string
  status: string
  trackingNumber?: string
  createdAt: string
  updatedAt: string
}

interface AdminUser {
  id: string
  email: string
  name?: string
  role: string
}

const statusOptions = [
  { value: 'pending', label: 'Pending Review', color: 'yellow' },
  { value: 'quoted', label: 'Quote Sent', color: 'blue' },
  { value: 'confirmed', label: 'Confirmed', color: 'green' },
  { value: 'assigned', label: 'Truck Assigned', color: 'purple' },
  { value: 'in_transit', label: 'In Transit', color: 'indigo' },
  { value: 'delivered', label: 'Delivered', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' }
]

const getStatusColor = (status: string) => {
  const statusConfig = statusOptions.find(s => s.value === status)
  return statusConfig?.color || 'gray'
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return Clock
    case 'quoted': return Package
    case 'confirmed': return CheckCircle
    case 'assigned': return Truck
    case 'in_transit': return Truck
    case 'delivered': return CheckCircle
    case 'cancelled': return XCircle
    default: return Clock
  }
}

export default function TruckRequestsAdmin() {
  const router = useRouter()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [requests, setRequests] = useState<TruckRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<TruckRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<TruckRequest | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    checkAdminAuth()
  }, [])

  useEffect(() => {
    if (requests.length > 0) {
      applyFilters()
    }
  }, [requests, filterStatus, searchTerm])

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/me')
      if (response.ok) {
        const data = await response.json()
        setAdmin(data.user)
        fetchTruckRequests()
      } else {
        router.push('/admin/login')
        return
      }
    } catch (error) {
      router.push('/admin/login')
      return
    }
  }

  const fetchTruckRequests = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/truck-requests')
      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests || [])
      } else {
        toast.error('Failed to fetch truck requests')
      }
    } catch (error) {
      toast.error('Error fetching truck requests')
      console.error('Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = requests

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(request => request.status === filterStatus)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.cargoType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredRequests(filtered)
  }

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      setIsUpdating(true)
      const response = await fetch(`/api/admin/truck-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success('Status updated successfully')
        fetchTruckRequests() // Refresh the list
        setSelectedRequest(null)
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      toast.error('Error updating status')
      console.error('Update error:', error)
    } finally {
      setIsUpdating(false)
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

  const exportToCSV = () => {
    const headers = [
      'Tracking Number', 'Company', 'Contact', 'Email', 'Phone', 
      'Pickup Address', 'Delivery Address', 'Cargo Type', 'Weight', 
      'Value', 'Status', 'Created At'
    ]
    
    const csvData = filteredRequests.map(request => [
      request.trackingNumber || request.id,
      request.companyName,
      request.contactName,
      request.email,
      request.phoneNumber,
      request.pickupAddress,
      request.deliveryAddress,
      request.cargoType,
      request.cargoWeight,
      request.cargoValue,
      request.status,
      new Date(request.createdAt).toLocaleDateString()
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `truck-requests-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('CSV exported successfully')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading truck requests...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <AdminHeader admin={admin} onLogout={handleLogout} />
      
      <div className="flex-grow mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Truck Requests
              </h1>
              <p className="mt-2 text-slate-600 text-lg">
                Manage and track all truck service requests
              </p>
              <div className="flex items-center mt-3">
                <div className="flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  {filteredRequests.length} Active Requests
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={fetchTruckRequests}
                className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-xl text-slate-700 bg-white/70 backdrop-blur-sm hover:bg-white hover:shadow-lg transition-all duration-200"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={exportToCSV}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Search Requests</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by company, contact, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 block w-full rounded-xl border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 transition-all py-3"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full rounded-xl border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 transition-all py-3"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="w-full p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
              <div className="text-sm text-slate-600">
                <div className="font-medium text-slate-900">
                  {filteredRequests.length} of {requests.length} requests
                </div>
                <div className="text-xs mt-1">
                  {requests.length > 0 ? `${Math.round((filteredRequests.length / requests.length) * 100)}% shown` : 'No requests'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Requests Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm shadow-xl overflow-hidden rounded-2xl border border-white/20"
        >
          {filteredRequests.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-6"
              >
                <Truck className="h-10 w-10 text-blue-600" />
              </motion.div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No truck requests found</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                {requests.length === 0 
                  ? "No truck requests have been submitted yet. New requests will appear here automatically." 
                  : "Try adjusting your search or filter criteria to find the requests you're looking for."}
              </p>
            </motion.div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredRequests.map((request, index) => {
                const StatusIcon = getStatusIcon(request.status)
                const statusColor = getStatusColor(request.status)
                
                return (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                    whileHover={{ x: 4 }}
                    className="group relative hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200"
                  >
                    <div className="px-6 py-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <motion.div 
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className={`p-2 rounded-xl bg-${statusColor}-100 mr-4 group-hover:shadow-md transition-shadow`}
                          >
                            <StatusIcon className={`h-5 w-5 text-${statusColor}-600`} />
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-lg font-semibold text-slate-900 group-hover:text-blue-900 transition-colors">
                                  {request.companyName}
                                </p>
                                <p className="text-sm text-slate-600 mt-1">
                                  <span className="font-medium">{request.contactName}</span> • {request.email}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 ml-4">
                          <motion.span 
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-${statusColor}-100 text-${statusColor}-800 border border-${statusColor}-200`}
                          >
                            {statusOptions.find(s => s.value === request.status)?.label || request.status}
                          </motion.span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedRequest(request)}
                            className="inline-flex items-center p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <Eye className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-sm text-slate-600">
                          <div className="p-1.5 bg-blue-100 rounded-lg mr-3">
                            <MapPin className="h-3.5 w-3.5 text-blue-600" />
                          </div>
                          <div className="truncate">
                            <span className="font-medium">{request.pickupAddress}</span>
                            <span className="mx-2 text-slate-400">→</span>
                            <span className="font-medium">{request.deliveryAddress}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <div className="p-1.5 bg-green-100 rounded-lg mr-3">
                            <Package className="h-3.5 w-3.5 text-green-600" />
                          </div>
                          <div>
                            <span className="font-medium">{request.cargoType}</span>
                            <span className="mx-1 text-slate-400">•</span>
                            <span>{request.cargoWeight}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1.5 text-slate-400" />
                          <span>Created {new Date(request.createdAt).toLocaleString()}</span>
                        </div>
                        {request.trackingNumber && (
                          <div className="flex items-center px-2 py-1 bg-slate-100 rounded-lg">
                            <span className="font-mono font-medium">#{request.trackingNumber}</span>
                          </div>
                        )}
                      </div>

                      {/* Hover Effect Border */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-400 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-200"></div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Truck Request Details
                </h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <p className="text-sm text-gray-900">{selectedRequest.companyName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                    <p className="text-sm text-gray-900">{selectedRequest.contactName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{selectedRequest.phoneNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pickup Address</label>
                    <p className="text-sm text-gray-900">{selectedRequest.pickupAddress}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                    <p className="text-sm text-gray-900">{selectedRequest.deliveryAddress}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cargo Type</label>
                    <p className="text-sm text-gray-900">{selectedRequest.cargoType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Weight</label>
                    <p className="text-sm text-gray-900">{selectedRequest.cargoWeight}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cargo Value</label>
                    <p className="text-sm text-gray-900">${selectedRequest.cargoValue}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service Type</label>
                    <p className="text-sm text-gray-900">{selectedRequest.serviceType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Urgency</label>
                    <p className="text-sm text-gray-900">{selectedRequest.urgency}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tracking Number</label>
                    <p className="text-sm text-gray-900">{selectedRequest.trackingNumber || 'Not assigned'}</p>
                  </div>
                </div>

                {selectedRequest.specialInstructions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Special Instructions</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedRequest.specialInstructions}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => updateRequestStatus(selectedRequest.id, status.value)}
                        disabled={isUpdating || selectedRequest.status === status.value}
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          selectedRequest.status === status.value
                            ? `bg-${status.color}-100 text-${status.color}-800 cursor-not-allowed`
                            : `bg-gray-100 text-gray-700 hover:bg-${status.color}-100 hover:text-${status.color}-800`
                        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <p>Created: {new Date(selectedRequest.createdAt).toLocaleString()}</p>
                  <p>Updated: {new Date(selectedRequest.updatedAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}