'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, Users, Shield, Mail, Calendar } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  emailVerified: boolean
  createdAt: string
  hasPassword: boolean
}

export default function DebugUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/debug-users')
      const data = await response.json()
      
      if (response.ok) {
        setUsers(data.users || [])
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch users')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const getRoleBadge = (role: string) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-800 border-purple-200',
      admin: 'bg-blue-100 text-blue-800 border-blue-200', 
      sub_admin: 'bg-green-100 text-green-800 border-green-200',
      customer: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    
    return colors[role as keyof typeof colors] || colors.customer
  }

  const getRoleLabel = (role: string) => {
    const labels = {
      super_admin: 'Super Admin',
      admin: 'Admin',
      sub_admin: 'Sub Admin', 
      customer: 'Customer'
    }
    
    return labels[role as keyof typeof labels] || role
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center">
          <RefreshCw className="h-6 w-6 animate-spin text-primary-600 mr-3" />
          <span className="text-gray-600">Loading users...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              href="/admin"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Debug Users</h1>
              <p className="mt-2 text-gray-600">
                Check all users in the database to debug login issues
              </p>
            </div>
            <button
              onClick={fetchUsers}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              All Users ({users.length})
            </h3>
          </div>

          {users.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No users found in the database</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {users.map((user) => (
                <div key={user.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {user.name || 'No name set'}
                        </h4>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Mail className="h-4 w-4 mr-1" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          Created: {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}>
                        <Shield className="h-3 w-3 mr-1" />
                        {getRoleLabel(user.role)}
                      </span>
                      
                      <div className="flex flex-col items-center space-y-1">
                        <span className={`text-xs px-2 py-1 rounded ${user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {user.emailVerified ? 'Verified' : 'Unverified'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${user.hasPassword ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.hasPassword ? 'Has Password' : 'No Password'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin Users Summary */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-blue-800 font-medium mb-2">Admin Users Summary:</h4>
          <div className="text-blue-700 text-sm space-y-1">
            <p>• Super Admins: {users.filter(u => u.role === 'super_admin').length}</p>
            <p>• Admins: {users.filter(u => u.role === 'admin').length}</p>
            <p>• Users with passwords: {users.filter(u => u.hasPassword).length}</p>
            <p>• Verified emails: {users.filter(u => u.emailVerified).length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}