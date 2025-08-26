'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { 
  Users, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  Calendar,
  Filter,
  Search,
  Download,
  RefreshCw,
  FileText
} from 'lucide-react'
import { motion } from 'framer-motion'
import AdminHeader from '@/components/AdminHeader'

interface PartnerRegistration {
  id: string
  companyName: string
  ownerName: string
  email: string
  phoneNumber: string
  homeAddress: string
  officeWarehouseAddress: string
  bankName: string
  accountNumber: string
  accountName: string
  nextOfKinName: string
  nextOfKinRelationship: string
  nextOfKinAddress: string
  nextOfKinPhone: string
  nationalIdCard?: string
  utilityBill?: string
  cacRegistration?: string
  otherDocuments?: string
  agreedToTerms: boolean
  agreedToPrivacy: boolean
  status: string
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
  { value: 'approved', label: 'Approved', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'suspended', label: 'Suspended', color: 'orange' }
]

const getStatusColor = (status: string) => {
  const statusConfig = statusOptions.find(s => s.value === status)
  return statusConfig?.color || 'gray'
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return Clock
    case 'approved': return CheckCircle
    case 'rejected': return XCircle
    case 'suspended': return XCircle
    default: return Clock
  }
}

export default function PartnerRegistrationsAdmin() {
  const router = useRouter()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [registrations, setRegistrations] = useState<PartnerRegistration[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<PartnerRegistration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRegistration, setSelectedRegistration] = useState<PartnerRegistration | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    checkAdminAuth()
  }, [])

  useEffect(() => {
    if (registrations.length > 0) {
      applyFilters()
    }
  }, [registrations, filterStatus, searchTerm])

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/me')
      if (response.ok) {
        const data = await response.json()
        setAdmin(data.user)
        fetchPartnerRegistrations()
      } else {
        router.push('/admin/login')
        return
      }
    } catch (error) {
      router.push('/admin/login')
      return
    }
  }

  const fetchPartnerRegistrations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/partner-registrations')
      if (response.ok) {
        const data = await response.json()
        setRegistrations(data.registrations || [])
      } else {
        toast.error('Failed to fetch partner registrations')
      }
    } catch (error) {
      toast.error('Error fetching partner registrations')
      console.error('Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = registrations

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(registration => registration.status === filterStatus)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(registration => 
        registration.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredRegistrations(filtered)
  }

  const updateRegistrationStatus = async (registrationId: string, newStatus: string) => {
    try {
      setIsUpdating(true)
      const response = await fetch(`/api/admin/partner-registrations/${registrationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success('Status updated successfully')
        fetchPartnerRegistrations() // Refresh the list
        setSelectedRegistration(null)
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
      'Owner Name', 'Company', 'Email', 'Phone', 'Home Address', 
      'Office Address', 'Bank Name', 'Account Name', 'Status', 'Created At'
    ]
    
    const csvData = filteredRegistrations.map(registration => [
      registration.ownerName,
      registration.companyName,
      registration.email,
      registration.phoneNumber,
      registration.homeAddress,
      registration.officeWarehouseAddress,
      registration.bankName,
      registration.accountName,
      registration.status,
      new Date(registration.createdAt).toLocaleDateString()
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `partner-registrations-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('CSV exported successfully')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading partner registrations...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader admin={admin} onLogout={handleLogout} />
      
      <div className="flex-grow mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Partner Registrations</h1>
              <p className="mt-1 text-gray-600">
                Review and approve partner agent registrations
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchPartnerRegistrations}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by owner, company, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
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
            <div className="text-sm text-gray-600">
              Showing {filteredRegistrations.length} of {registrations.length} registrations
            </div>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No partner registrations found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {registrations.length === 0 
                  ? "No partner registrations have been submitted yet." 
                  : "Try adjusting your filters to see more results."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredRegistrations.map((registration, index) => {
                const StatusIcon = getStatusIcon(registration.status)
                const statusColor = getStatusColor(registration.status)
                
                return (
                  <motion.li
                    key={registration.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <StatusIcon className={`h-5 w-5 text-${statusColor}-500 mr-3`} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {registration.ownerName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {registration.companyName} • {registration.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                            {statusOptions.find(s => s.value === registration.status)?.label || registration.status}
                          </span>
                          <button
                            onClick={() => setSelectedRegistration(registration)}
                            className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {registration.phoneNumber}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span className="truncate max-w-xs">
                            {registration.homeAddress}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-3 w-3 text-gray-400" />
                        Registered: {new Date(registration.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </motion.li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Registration Detail Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Partner Registration Details
                </h3>
                <button
                  onClick={() => setSelectedRegistration(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Owner Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Owner Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.ownerName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.phoneNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Home Address</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.homeAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Business Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company Name</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.companyName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Office/Warehouse Address</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.officeWarehouseAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Bank Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Bank Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.bankName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Account Name</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.accountName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Account Number</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.accountNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Next of Kin */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Next of Kin
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.nextOfKinName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Relationship</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.nextOfKinRelationship}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.nextOfKinPhone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.nextOfKinAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Documents
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">National ID Card</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.nationalIdCard ? 'Uploaded' : 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Utility Bill</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.utilityBill ? 'Uploaded' : 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">CAC Registration</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.cacRegistration ? 'Uploaded' : 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Other Documents</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.otherDocuments ? 'Uploaded' : 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => updateRegistrationStatus(selectedRegistration.id, status.value)}
                        disabled={isUpdating || selectedRegistration.status === status.value}
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          selectedRegistration.status === status.value
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
                  <p>Registered: {new Date(selectedRegistration.createdAt).toLocaleString()}</p>
                  <p>Updated: {new Date(selectedRegistration.updatedAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedRegistration(null)}
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