'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  MessageCircle,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Filter,
  Search,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'
import AdminHeader from '@/components/AdminHeader'

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  service?: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'replied' | 'archived'
  adminResponse?: string
  respondedBy?: string
  respondedAt?: string
  createdAt: string
  updatedAt: string
  readAt?: string
  ipAddress?: string
}

interface StatusSummary {
  unread: number
  read: number
  replied: number
  archived: number
}

export default function AdminContacts() {
  const [admin, setAdmin] = useState<any>(null)
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [statusSummary, setStatusSummary] = useState<StatusSummary>({
    unread: 0,
    read: 0,
    replied: 0,
    archived: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [responseForm, setResponseForm] = useState({
    status: 'replied',
    adminResponse: ''
  })
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchContacts()
    // Mock admin for demo
    setAdmin({ id: '1', email: 'admin@fixingmaritime.com', name: 'Admin User', role: 'admin' })
  }, [statusFilter, currentPage])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/contact?${params}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setContacts(data.contacts || [])
          // Calculate status summary from contacts
          const summary = data.contacts.reduce((acc: StatusSummary, contact: ContactSubmission) => {
            acc[contact.status] = (acc[contact.status] || 0) + 1
            return acc
          }, { unread: 0, read: 0, replied: 0, archived: 0 })
          setStatusSummary(summary)
        }
      } else {
        // Handle different error types
        setContacts([])
        setStatusSummary({
          unread: 0,
          read: 0,
          replied: 0,
          archived: 0
        })
        
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        
        if (response.status === 503) {
          toast.error('Database not available - showing empty state')
        } else {
          toast.error(errorData.error || 'Failed to fetch contact submissions')
        }
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
      setContacts([])
      toast.error('Failed to fetch contact submissions')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (contactId: string, newStatus: string, adminResponse?: string) => {
    try {
      const response = await fetch(`/api/contact/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          adminResponse,
          respondedBy: admin?.id
        })
      })

      if (response.ok) {
        toast.success('Contact submission updated successfully')
        fetchContacts()
        setShowResponseModal(false)
        setSelectedContact(null)
        setResponseForm({
          status: 'replied',
          adminResponse: ''
        })
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update contact submission')
      }
    } catch (error) {
      console.error('Error updating contact:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update contact submission')
    }
  }

  const handleResponseSubmit = () => {
    if (!selectedContact) return
    
    handleStatusUpdate(
      selectedContact.id,
      responseForm.status,
      responseForm.adminResponse
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'read': return <Eye className="h-4 w-4 text-blue-600" />
      case 'replied': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'archived': return <XCircle className="h-4 w-4 text-gray-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800'
      case 'read': return 'bg-blue-100 text-blue-800'
      case 'replied': return 'bg-green-100 text-green-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">Admin authentication required</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AdminHeader admin={admin} onLogout={() => {}} />
      
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
            Contact Submissions
          </h1>
          <p className="mt-2 text-slate-600">Manage and respond to customer contact form submissions</p>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(statusSummary).map(([status, count]) => (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg cursor-pointer transition-all hover:shadow-xl ${
                statusFilter === status ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setStatusFilter(status === statusFilter ? 'all' : status)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 capitalize">{status}</p>
                  <p className="text-2xl font-bold text-slate-900">{count}</p>
                </div>
                {getStatusIcon(status)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <button
            onClick={fetchContacts}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Contacts Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600 mt-4">Loading contact submissions...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No contact submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-slate-200">
                  {filteredContacts.map((contact) => (
                    <motion.tr
                      key={contact.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-slate-400 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-slate-900">{contact.name}</p>
                              <p className="text-sm text-slate-500">{contact.email}</p>
                              {contact.company && (
                                <p className="text-xs text-slate-400">{contact.company}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 text-slate-400 mr-2" />
                          <div>
                            <span className="text-sm text-slate-900">{contact.subject}</span>
                            {contact.service && (
                              <p className="text-xs text-slate-500">Re: {contact.service}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                          {getStatusIcon(contact.status)}
                          <span className="ml-1 capitalize">{contact.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {formatDate(contact.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedContact(contact)
                              setResponseForm({
                                status: contact.status === 'unread' ? 'replied' : contact.status,
                                adminResponse: contact.adminResponse || ''
                              })
                              setShowResponseModal(true)
                            }}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Respond"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Contact Detail Modal */}
        <AnimatePresence>
          {selectedContact && !showResponseModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedContact(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Contact Details</h2>
                    <button
                      onClick={() => setSelectedContact(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <XCircle className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                        <p className="text-sm text-slate-900">{selectedContact.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <p className="text-sm text-slate-900">{selectedContact.email}</p>
                      </div>
                      {selectedContact.phone && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                          <p className="text-sm text-slate-900">{selectedContact.phone}</p>
                        </div>
                      )}
                      {selectedContact.company && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                          <p className="text-sm text-slate-900">{selectedContact.company}</p>
                        </div>
                      )}
                    </div>

                    {selectedContact.service && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Service of Interest</label>
                        <p className="text-sm text-slate-900">{selectedContact.service}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                      <p className="text-sm text-slate-900 font-medium">{selectedContact.subject}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                      <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>

                    {selectedContact.adminResponse && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Admin Response</label>
                        <p className="text-sm text-slate-900 bg-blue-50 p-3 rounded-lg border border-blue-200 whitespace-pre-wrap">
                          {selectedContact.adminResponse}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
                      <button
                        onClick={() => setSelectedContact(null)}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          setResponseForm({
                            status: selectedContact.status === 'unread' ? 'replied' : selectedContact.status,
                            adminResponse: selectedContact.adminResponse || ''
                          })
                          setShowResponseModal(true)
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Respond
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Response Modal */}
        <AnimatePresence>
          {showResponseModal && selectedContact && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-xl max-w-lg w-full"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Respond to Contact</h2>
                    <button
                      onClick={() => setShowResponseModal(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <XCircle className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                      <select
                        value={responseForm.status}
                        onChange={(e) => setResponseForm({ ...responseForm, status: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Response Message</label>
                      <textarea
                        value={responseForm.adminResponse}
                        onChange={(e) => setResponseForm({ ...responseForm, adminResponse: e.target.value })}
                        rows={4}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your response to the customer..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-slate-200">
                    <button
                      onClick={() => setShowResponseModal(false)}
                      className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleResponseSubmit}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}