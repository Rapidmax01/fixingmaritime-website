'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Key,
  User,
  Save,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Phone,
  MapPin,
  Mail,
  Building,
  Edit3,
  X,
  Star
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface UserProfile {
  id: string
  email: string
  name: string | null
  company: string | null
  role: string
  primaryPhone: string | null
  cellPhone: string | null
  homePhone: string | null
  workPhone: string | null
  homeAddress: string | null
  officeAddress: string | null
  city: string | null
  state: string | null
  country: string | null
  postalCode: string | null
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminProfile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editingProfile, setEditingProfile] = useState(false)
  
  // Password change form
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Profile form
  const [profileForm, setProfileForm] = useState({
    company: '',
    primaryPhone: '',
    cellPhone: '',
    homePhone: '',
    workPhone: '',
    homeAddress: '',
    officeAddress: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/auth/profile')
      const data = await response.json()
      
      if (response.ok) {
        setProfile(data.user)
        // Initialize form with current data
        setProfileForm({
          company: data.user.company || '',
          primaryPhone: data.user.primaryPhone || '',
          cellPhone: data.user.cellPhone || '',
          homePhone: data.user.homePhone || '',
          workPhone: data.user.workPhone || '',
          homeAddress: data.user.homeAddress || '',
          officeAddress: data.user.officeAddress || '',
          city: data.user.city || '',
          state: data.user.state || '',
          country: data.user.country || '',
          postalCode: data.user.postalCode || ''
        })
      } else {
        toast.error('Failed to load profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Connection error')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate that primary phone is set if any phone is provided
    const hasPhones = profileForm.cellPhone || profileForm.homePhone || profileForm.workPhone
    if (hasPhones && !profileForm.primaryPhone) {
      toast.error('Please select a primary phone number')
      return
    }

    setSaving(true)
    
    try {
      const response = await fetch('/api/admin/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Profile updated successfully!')
        setProfile(data.user)
        setEditingProfile(false)
      } else {
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Connection error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('All fields are required')
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
        body: JSON.stringify(passwordForm)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Password updated successfully!')
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        toast.error(data.error || 'Failed to update password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Connection error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1
    return strength
  }

  const getStrengthColor = (strength: number) => {
    if (strength <= 1) return 'bg-red-500'
    if (strength <= 2) return 'bg-orange-500'
    if (strength <= 3) return 'bg-yellow-500'
    if (strength <= 4) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStrengthText = (strength: number) => {
    if (strength <= 1) return 'Very Weak'
    if (strength <= 2) return 'Weak'
    if (strength <= 3) return 'Fair'
    if (strength <= 4) return 'Good'
    return 'Strong'
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mr-3" />
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Unable to load your profile information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/admin"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center">
                <User className="h-6 w-6 text-primary-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-semibold text-gray-900">{profile.name || 'No Name Set'}</h2>
                  <p className="text-gray-600 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {profile.email}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      profile.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                      profile.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                      profile.role === 'sub_admin' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getRoleLabel(profile.role)}
                    </span>
                    <span className="ml-3 text-sm text-gray-500">
                      Member since {formatDate(profile.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <User className="h-4 w-4 inline mr-2" />
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'password'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Key className="h-4 w-4 inline mr-2" />
                Change Password
              </button>
            </nav>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {!editingProfile ? (
                    // Profile Display Mode
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Your Information</h3>
                        <button
                          onClick={() => setEditingProfile(true)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Profile
                        </button>
                      </div>

                      {/* Basic Information - Read Only */}
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                          <User className="h-5 w-5 mr-2" />
                          Basic Information
                        </h4>
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Name</label>
                              <p className="mt-1 text-sm text-gray-900">{profile.name || 'Not set'}</p>
                              <p className="text-xs text-gray-500">Name cannot be changed</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Email</label>
                              <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
                              <p className="text-xs text-gray-500">Email cannot be changed</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Company Information */}
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                          <Building className="h-5 w-5 mr-2" />
                          Company Information
                        </h4>
                        <div className="bg-white border border-gray-200 rounded-md p-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Company</label>
                            <p className="mt-1 text-sm text-gray-900">{profile.company || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Phone Numbers */}
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                          <Phone className="h-5 w-5 mr-2" />
                          Phone Numbers
                        </h4>
                        <div className="bg-white border border-gray-200 rounded-md p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 flex items-center">
                                Primary Phone
                                {profile.primaryPhone && <Star className="h-3 w-3 ml-1 text-yellow-500" />}
                              </label>
                              <p className="mt-1 text-sm text-gray-900">{profile.primaryPhone || 'Not set'}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Cell Phone</label>
                              <p className="mt-1 text-sm text-gray-900">{profile.cellPhone || 'Not set'}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Home Phone</label>
                              <p className="mt-1 text-sm text-gray-900">{profile.homePhone || 'Not set'}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Work Phone</label>
                              <p className="mt-1 text-sm text-gray-900">{profile.workPhone || 'Not set'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Address Information */}
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                          <MapPin className="h-5 w-5 mr-2" />
                          Address Information
                        </h4>
                        <div className="bg-white border border-gray-200 rounded-md p-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Home Address</label>
                              <p className="mt-1 text-sm text-gray-900">{profile.homeAddress || 'Not set'}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Office Address</label>
                              <p className="mt-1 text-sm text-gray-900">{profile.officeAddress || 'Not set'}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">City</label>
                                <p className="mt-1 text-sm text-gray-900">{profile.city || 'Not set'}</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">State</label>
                                <p className="mt-1 text-sm text-gray-900">{profile.state || 'Not set'}</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                                <p className="mt-1 text-sm text-gray-900">{profile.postalCode || 'Not set'}</p>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Country</label>
                              <p className="mt-1 text-sm text-gray-900">{profile.country || 'Not set'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Profile Edit Mode
                    <form onSubmit={handleProfileSubmit} className="space-y-8">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Edit Your Information</h3>
                        <button
                          type="button"
                          onClick={() => setEditingProfile(false)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </button>
                      </div>

                      {/* Company Information */}
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                          <Building className="h-5 w-5 mr-2" />
                          Company Information
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                            <input
                              type="text"
                              value={profileForm.company}
                              onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Enter company name"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Phone Numbers */}
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                          <Phone className="h-5 w-5 mr-2" />
                          Phone Numbers
                        </h4>
                        <div className="space-y-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <p className="text-sm text-blue-800">
                              <Star className="h-4 w-4 inline mr-1" />
                              Primary phone number will be used as your main contact number.
                            </p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                Primary Phone <Star className="h-3 w-3 ml-1 text-yellow-500" />
                              </label>
                              <input
                                type="tel"
                                value={profileForm.primaryPhone}
                                onChange={(e) => setProfileForm({ ...profileForm, primaryPhone: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="e.g., +1 (555) 123-4567"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Cell Phone</label>
                              <input
                                type="tel"
                                value={profileForm.cellPhone}
                                onChange={(e) => setProfileForm({ ...profileForm, cellPhone: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="e.g., +1 (555) 123-4567"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Home Phone</label>
                              <input
                                type="tel"
                                value={profileForm.homePhone}
                                onChange={(e) => setProfileForm({ ...profileForm, homePhone: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="e.g., +1 (555) 123-4567"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Work Phone</label>
                              <input
                                type="tel"
                                value={profileForm.workPhone}
                                onChange={(e) => setProfileForm({ ...profileForm, workPhone: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="e.g., +1 (555) 123-4567"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Address Information */}
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                          <MapPin className="h-5 w-5 mr-2" />
                          Address Information
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Home Address</label>
                            <textarea
                              value={profileForm.homeAddress}
                              onChange={(e) => setProfileForm({ ...profileForm, homeAddress: e.target.value })}
                              rows={2}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Enter your home address"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Office Address</label>
                            <textarea
                              value={profileForm.officeAddress}
                              onChange={(e) => setProfileForm({ ...profileForm, officeAddress: e.target.value })}
                              rows={2}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Enter your office address"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                              <input
                                type="text"
                                value={profileForm.city}
                                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="City"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                              <input
                                type="text"
                                value={profileForm.state}
                                onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="State/Province"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                              <input
                                type="text"
                                value={profileForm.postalCode}
                                onChange={(e) => setProfileForm({ ...profileForm, postalCode: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Postal Code"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                            <input
                              type="text"
                              value={profileForm.country}
                              onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Country"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end pt-4 border-t">
                        <button
                          type="submit"
                          disabled={saving}
                          className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                </motion.div>
              )}

              {activeTab === 'password' && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="max-w-2xl">
                    <div className="flex items-center mb-6">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Key className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
                        <p className="text-sm text-gray-600">Update your account password for security</p>
                      </div>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      {/* Current Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter your current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter your new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {passwordForm.newPassword && (
                          <div className="mt-2">
                            <div className="flex items-center mb-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(getPasswordStrength(passwordForm.newPassword))}`}
                                  style={{ width: `${(getPasswordStrength(passwordForm.newPassword) / 5) * 100}%` }}
                                />
                              </div>
                              <span className={`text-xs font-medium ${
                                getPasswordStrength(passwordForm.newPassword) <= 2 ? 'text-red-600' :
                                getPasswordStrength(passwordForm.newPassword) <= 3 ? 'text-yellow-600' :
                                getPasswordStrength(passwordForm.newPassword) <= 4 ? 'text-blue-600' : 'text-green-600'
                              }`}>
                                {getStrengthText(getPasswordStrength(passwordForm.newPassword))}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Confirm New Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Confirm your new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                          <p className="mt-1 text-xs text-red-600 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Passwords do not match
                          </p>
                        )}
                        {passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword === passwordForm.confirmPassword && (
                          <p className="mt-1 text-xs text-green-600 flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Passwords match
                          </p>
                        )}
                      </div>

                      {/* Security Tips */}
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">Password Security Tips:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Use at least 8 characters</li>
                          <li>• Include uppercase and lowercase letters</li>
                          <li>• Add numbers and special characters</li>
                          <li>• Avoid common words or personal information</li>
                          <li>• Don't reuse passwords from other accounts</li>
                        </ul>
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end pt-4">
                        <button
                          type="submit"
                          disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                          className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}