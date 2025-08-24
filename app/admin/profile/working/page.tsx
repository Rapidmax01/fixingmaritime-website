'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, User, AlertCircle, Loader2, Key, Edit3, Save, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface UserProfile {
  id: string
  email: string
  name: string | null
  company: string | null
  role: string
  phone: string | null
  address: string | null
  city: string | null
  country: string | null
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export default function WorkingProfile() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [authStatus, setAuthStatus] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [profileForm, setProfileForm] = useState({
    company: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  })
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    try {
      setLoading(true)
      setError('')

      // Step 1: Check authentication status
      console.log('🔍 Checking authentication status...')
      const authResponse = await fetch('/api/admin/auth/status')
      const authData = await authResponse.json()
      setAuthStatus(authData)
      
      console.log('Auth status:', authData)
      
      if (!authData.authentication?.isAuthenticated) {
        setError('Not authenticated. Please log in to access your profile.')
        setLoading(false)
        return
      }

      // Step 2: Load profile
      console.log('👤 Loading profile...')
      await loadProfile()
      
    } catch (initError: any) {
      console.error('Initialization error:', initError)
      setError(`Initialization failed: ${initError.message}`)
      setLoading(false)
    }
  }

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/admin/auth/profile', {
        method: 'GET',
        credentials: 'include',
      })

      const data = await response.json()
      
      if (response.status === 401) {
        setError('Session expired. Please log in again.')
        return
      }

      if (response.status === 503) {
        setError('Database is currently unavailable. Please try again in a moment.')
        return
      }

      if (!response.ok) {
        setError(`Failed to load profile: ${data.error || 'Unknown error'}`)
        return
      }

      if (data.user) {
        setProfile(data.user)
        setProfileForm({
          company: data.user.company || '',
          phone: data.user.phone || '',
          address: data.user.address || '',
          city: data.user.city || '',
          country: data.user.country || ''
        })
        console.log('✅ Profile loaded successfully')
      } else {
        setError('No profile data received')
      }

    } catch (loadError: any) {
      console.error('Profile load error:', loadError)
      setError(`Failed to load profile: ${loadError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profileForm)
      })

      const data = await response.json()

      if (response.ok) {
        setProfile(data.user)
        setEditing(false)
        toast.success('Profile updated successfully!')
      } else {
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (updateError) {
      console.error('Update error:', updateError)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('All password fields are required')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirmation do not match')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(passwordForm)
      })

      const data = await response.json()

      if (response.ok) {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        toast.success('Password updated successfully!')
      } else {
        toast.error(data.error || 'Failed to update password')
      }
    } catch (passwordError) {
      console.error('Password change error:', passwordError)
      toast.error('Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center text-red-600 mb-4">
            <AlertCircle className="h-6 w-6 mr-2" />
            <h2 className="text-lg font-semibold">Profile Error</h2>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
          
          <div className="space-y-3">
            {!authStatus?.authentication?.isAuthenticated ? (
              <Link
                href="/admin/login"
                className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
              >
                Go to Login
              </Link>
            ) : (
              <button
                onClick={loadProfile}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            )}
            
            <Link
              href="/admin"
              className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-4" />
          <p className="text-gray-600">No profile data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link href="/admin" className="text-blue-600 hover:text-blue-800 mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {profile.name || 'No Name Set'}
              </h2>
              <p className="text-gray-600">{profile.email}</p>
              <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                {profile.role?.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <User className="h-4 w-4 inline mr-2" />
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'password'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Key className="h-4 w-4 inline mr-2" />
                Change Password
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div>
                {!editing ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Your Information</h3>
                      <button
                        onClick={() => setEditing(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <p className="mt-1 text-gray-900">{profile.company || 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="mt-1 text-gray-900">{profile.phone || 'Not specified'}</p>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <p className="mt-1 text-gray-900">{profile.address || 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <p className="mt-1 text-gray-900">{profile.city || 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Country</label>
                        <p className="mt-1 text-gray-900">{profile.country || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Edit Information</h3>
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                        <input
                          type="text"
                          value={profileForm.company}
                          onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter company name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter phone number"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <textarea
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                          rows={2}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter address"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={profileForm.city}
                          onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter city"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          value={profileForm.country}
                          onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter country"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordChange} className="max-w-md space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter current password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Password
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}