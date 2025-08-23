'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle, 
  XCircle,
  Mail,
  Phone,
  Building,
  Eye,
  UserCheck,
  UserX,
  Loader2,
  X,
  Save
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface UserData {
  id: string
  name: string | null
  email: string
  company: string | null
  phone: string | null
  address: string | null
  city: string | null
  country: string | null
  role: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
  orderCount: number
  totalSpent: number
  lastOrderDate: string | null
  status: string
}

// Role-based permissions (should match server-side logic)
const canCreateUsers = (currentUserRole: string) => {
  return ['super_admin', 'admin'].includes(currentUserRole)
}

const canDeleteUsers = (currentUserRole: string) => {
  return ['super_admin', 'admin'].includes(currentUserRole)
}

const canEditUser = (currentUserRole: string, targetUserRole: string) => {
  if (currentUserRole === 'super_admin' && targetUserRole !== 'super_admin') return true
  if (targetUserRole === 'super_admin') return false
  return currentUserRole === 'admin' && targetUserRole !== 'admin'
}

const canDeleteUser = (currentUserRole: string, targetUserRole: string) => {
  if (!canDeleteUsers(currentUserRole)) return false
  if (targetUserRole === 'super_admin') return false
  if (currentUserRole === 'super_admin') return targetUserRole !== 'super_admin'
  if (currentUserRole === 'admin') return !['admin', 'super_admin'].includes(targetUserRole)
  return false
}

const getAvailableRoles = (currentUserRole: string) => {
  const baseRoles = [
    { value: 'customer', label: 'Customer' }
  ]
  
  if (currentUserRole === 'super_admin') {
    baseRoles.push(
      { value: 'sub_admin', label: 'Sub Admin' },
      { value: 'admin', label: 'Admin' },
      { value: 'super_admin', label: 'Super Admin' }
    )
  } else if (currentUserRole === 'admin') {
    baseRoles.push(
      { value: 'sub_admin', label: 'Sub Admin' }
    )
  }
  
  return baseRoles
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'super_admin': return 'Super Admin'
    case 'admin': return 'Admin' 
    case 'sub_admin': return 'Sub Admin'
    case 'customer': return 'Customer'
    default: return role
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
    case 'suspended':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return CheckCircle
    case 'inactive':
      return XCircle
    case 'suspended':
      return Ban
    default:
      return XCircle
  }
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const [currentUserRole, setCurrentUserRole] = useState<string>('customer') // Will be fetched from auth
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    role: 'customer',
    emailVerified: true
  })

  // Fetch users data
  useEffect(() => {
    fetchUsers()
    // TODO: Fetch current user role from auth context/API
    setCurrentUserRole('super_admin') // Temporary - should come from auth
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      
      if (response.ok) {
        setUsers(data.users || [])
        setError(null)
      } else {
        setError('Failed to fetch users')
        console.error('Error fetching users:', data.error)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      company: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      role: 'customer',
      emailVerified: true
    })
  }

  const handleAddUser = () => {
    resetForm()
    setShowAddModal(true)
  }

  const handleEditUser = (user: UserData) => {
    setCurrentUser(user)
    setFormData({
      name: user.name || '',
      email: user.email,
      password: '',
      company: user.company || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      country: user.country || '',
      role: user.role,
      emailVerified: user.emailVerified
    })
    setShowEditModal(true)
    setSelectedUser(null)
  }

  const handleDeleteUser = (user: UserData) => {
    setCurrentUser(user)
    setShowDeleteModal(true)
    setSelectedUser(null)
  }

  const handleViewUser = (user: UserData) => {
    setCurrentUser(user)
    setShowViewModal(true)
    setSelectedUser(null)
  }

  const handleSuspendUser = async (user: UserData) => {
    try {
      const action = user.status === 'active' ? 'suspend' : 'activate'
      const response = await fetch(`/api/admin/users/${user.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        toast.success(`User ${action === 'suspend' ? 'suspended' : 'activated'} successfully`)
        await fetchUsers()
      } else {
        toast.error('Failed to update user status')
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      toast.error('Failed to update user status')
    }
    setSelectedUser(null)
  }

  const handleSubmitUser = async (isEdit = false) => {
    try {
      const url = isEdit ? `/api/admin/users/${currentUser?.id}` : '/api/admin/users'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(`User ${isEdit ? 'updated' : 'created'} successfully`)
        await fetchUsers()
        setShowAddModal(false)
        setShowEditModal(false)
        resetForm()
      } else {
        const data = await response.json()
        toast.error(data.error || `Failed to ${isEdit ? 'update' : 'create'} user`)
      }
    } catch (error) {
      console.error('Error submitting user:', error)
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} user`)
    }
  }

  const confirmDeleteUser = async () => {
    if (!currentUser) return

    try {
      const response = await fetch(`/api/admin/users/${currentUser.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('User deleted successfully')
        await fetchUsers()
        setShowDeleteModal(false)
        setCurrentUser(null)
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.company?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    suspended: users.filter(u => u.status === 'suspended').length
  }

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
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="mt-2 text-gray-600">
                Manage user accounts and permissions
                {error && (
                  <span className="block text-sm text-orange-600 mt-1">
                    ⚠️ {error}
                  </span>
                )}
              </p>
            </div>
            {canCreateUsers(currentUserRole) && (
              <button 
                onClick={handleAddUser}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading users...</span>
          </div>
        )}

        {!loading && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{stats.total}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <XCircle className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Inactive</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.inactive}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <Ban className="h-4 w-4 text-red-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Suspended</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.suspended}</p>
                  </div>
                </div>
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
                      placeholder="Search users..."
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Users ({filteredUsers.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Spent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user, index) => {
                      const StatusIcon = getStatusIcon(user.status)
                      return (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {user.name ? user.name.split(' ').map(n => n[0]).join('') : user.email[0].toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name || 'No name'}</div>
                                <div className="text-sm text-gray-500">{getRoleLabel(user.role)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className="flex items-center mb-1">
                                <Mail className="h-3 w-3 mr-2 text-gray-400" />
                                {user.email}
                              </div>
                              {user.phone && (
                                <div className="flex items-center mb-1">
                                  <Phone className="h-3 w-3 mr-2 text-gray-400" />
                                  {user.phone}
                                </div>
                              )}
                              {user.company && (
                                <div className="flex items-center">
                                  <Building className="h-3 w-3 mr-2 text-gray-400" />
                                  {user.company}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.orderCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${user.totalSpent.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="relative">
                              <button
                                onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              {selectedUser === user.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                  <div className="py-1">
                                    <button 
                                      onClick={() => handleViewUser(user)}
                                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </button>
                                    {canEditUser(currentUserRole, user.role) && (
                                      <button 
                                        onClick={() => handleEditUser(user)}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit User
                                      </button>
                                    )}
                                    <button 
                                      onClick={() => handleSuspendUser(user)}
                                      disabled={!canEditUser(currentUserRole, user.role) || (user.role === 'super_admin' && user.status === 'active')}
                                      className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                                        !canEditUser(currentUserRole, user.role) || (user.role === 'super_admin' && user.status === 'active')
                                          ? 'text-gray-400 cursor-not-allowed' 
                                          : 'text-gray-700 hover:bg-gray-100'
                                      }`}
                                    >
                                      {user.status === 'active' ? (
                                        <>
                                          <UserX className="h-4 w-4 mr-2" />
                                          {currentUserRole === 'sub_admin' ? 'Approve/Suspend' : 'Suspend User'}
                                        </>
                                      ) : (
                                        <>
                                          <UserCheck className="h-4 w-4 mr-2" />
                                          {currentUserRole === 'sub_admin' ? 'Approve' : 'Activate User'}
                                        </>
                                      )}
                                    </button>
                                    {canDeleteUser(currentUserRole, user.role) && (
                                      <button 
                                        onClick={() => handleDeleteUser(user)}
                                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete User
                                      </button>
                                    )}
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
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No users found matching your search criteria.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Modals */}
        <AnimatePresence>
          {/* Add User Modal */}
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Add New User</h2>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleSubmitUser(false) }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          {getAvailableRoles(currentUserRole).map(role => (
                            <option key={role.value} value={role.value}>{role.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="emailVerified"
                          checked={formData.emailVerified}
                          onChange={(e) => setFormData({ ...formData, emailVerified: e.target.checked })}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="emailVerified" className="ml-2 text-sm text-gray-700">
                          Email Verified
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Create User
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Edit User Modal */}
          {showEditModal && currentUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowEditModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Edit User</h2>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleSubmitUser(true) }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password (leave empty to keep current)</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          disabled={currentUser?.role === 'super_admin' || currentUserRole !== 'super_admin'}
                          className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                            currentUser?.role === 'super_admin' || currentUserRole !== 'super_admin' ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                        >
                          {getAvailableRoles(currentUserRole).map(role => (
                            <option key={role.value} value={role.value}>{role.label}</option>
                          ))}
                        </select>
                        {(currentUser?.role === 'super_admin' || currentUserRole !== 'super_admin') && (
                          <p className="text-xs text-gray-500 mt-1">
                            {currentUser?.role === 'super_admin' 
                              ? 'Super admin role cannot be changed' 
                              : 'Only super admins can change user roles'}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="editEmailVerified"
                          checked={formData.emailVerified}
                          onChange={(e) => setFormData({ ...formData, emailVerified: e.target.checked })}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="editEmailVerified" className="ml-2 text-sm text-gray-700">
                          Email Verified
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Update User
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && currentUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Delete User</h2>
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete "{currentUser.name || currentUser.email}"? 
                    This action cannot be undone and will fail if the user has existing orders.
                  </p>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeleteUser}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete User
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* View User Modal */}
          {showViewModal && currentUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowViewModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{currentUser.name || 'No name provided'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="mt-1 text-gray-900">{currentUser.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Role</h3>
                        <p className="mt-1 text-gray-900">{getRoleLabel(currentUser.role)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Status</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentUser.status)}`}>
                          {currentUser.status}
                        </span>
                      </div>
                    </div>

                    {(currentUser.company || currentUser.phone) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {currentUser.company && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Company</h3>
                            <p className="mt-1 text-gray-900">{currentUser.company}</p>
                          </div>
                        )}
                        {currentUser.phone && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                            <p className="mt-1 text-gray-900">{currentUser.phone}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {(currentUser.address || currentUser.city || currentUser.country) && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Address</h3>
                        <div className="text-gray-900">
                          {currentUser.address && <p>{currentUser.address}</p>}
                          {(currentUser.city || currentUser.country) && (
                            <p>{[currentUser.city, currentUser.country].filter(Boolean).join(', ')}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                        <p className="mt-1 text-xl font-bold text-gray-900">{currentUser.orderCount}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
                        <p className="mt-1 text-xl font-bold text-gray-900">${currentUser.totalSpent.toLocaleString()}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                        <p className="mt-1 text-gray-900">{new Date(currentUser.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          currentUser.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {currentUser.emailVerified ? 'Email Verified' : 'Email Not Verified'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Last updated: {new Date(currentUser.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
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