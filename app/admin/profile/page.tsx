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
  Shield,
  Clock,
  Camera,
  Settings,
  Star,
  Globe,
  Briefcase
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface UserProfile {
  id: string
  email: string
  name: string | null
  company: string | null
  role: string
  // Enhanced phone fields
  primaryPhone: string | null
  cellPhone: string | null
  homePhone: string | null
  workPhone: string | null
  // Enhanced address fields
  homeAddress: string | null
  officeAddress: string | null
  city: string | null
  state: string | null
  country: string | null
  postalCode: string | null
  // Legacy fields for backward compatibility
  phone: string | null
  address: string | null
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
    // Enhanced phone fields
    primaryPhone: '',
    cellPhone: '',
    homePhone: '',
    workPhone: '',
    // Enhanced address fields
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
        // Initialize form with current data, supporting both enhanced and legacy fields
        setProfileForm({
          company: data.user.company || '',
          // Enhanced phone fields (with fallback to legacy field)
          primaryPhone: data.user.primaryPhone || data.user.phone || '',
          cellPhone: data.user.cellPhone || '',
          homePhone: data.user.homePhone || '',
          workPhone: data.user.workPhone || '',
          // Enhanced address fields (with fallback to legacy field)
          homeAddress: data.user.homeAddress || data.user.address || '',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200/20 to-blue-300/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-200/20 to-primary-300/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary-400/10 to-blue-400/5 rounded-full blur-2xl"></div>
      </div>
      {/* Header */}
      <div className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-sm bg-white/80 shadow-lg border-b border-white/20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link
                  href="/admin"
                  className="group flex items-center text-gray-600 hover:text-primary-700 mr-6 transition-all duration-200"
                >
                  <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to Dashboard
                </Link>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Profile Settings</h1>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Profile Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative group mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-blue-600/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-6">
                {/* Avatar */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative group cursor-pointer"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 border-2 border-white rounded-full"></div>
                </motion.div>
                
                {/* Profile Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {profile.name || 'Welcome!'}
                    </h2>
                    <Star className="h-6 w-6 text-yellow-400 fill-current" />
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm font-medium">{profile.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      profile.role === 'super_admin' ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200' :
                      profile.role === 'admin' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200' :
                      profile.role === 'sub_admin' ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200' :
                      'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-200'
                    } shadow-sm`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {getRoleLabel(profile.role)}
                    </span>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      Member since {formatDate(profile.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="mt-6 lg:mt-0 flex space-x-6 lg:flex-col lg:space-x-0 lg:space-y-2">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-3 bg-white/50 rounded-xl border border-white/30 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="text-2xl font-bold text-primary-600">100%</div>
                  <div className="text-xs text-gray-600">Complete</div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-3 bg-white/50 rounded-xl border border-white/30 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="text-2xl font-bold text-green-600">Active</div>
                  <div className="text-xs text-gray-600">Status</div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative group mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-blue-600/10 rounded-2xl blur opacity-50"></div>
          <div className="relative backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl border border-white/20">
            <div className="border-b border-white/30">
              <nav className="flex space-x-1 p-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('profile')}
                  className={`relative flex-1 py-4 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  {activeTab === 'profile' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg"
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center">
                    <User className="h-4 w-4 mr-2" />
                    Profile Information
                  </span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('password')}
                  className={`relative flex-1 py-4 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                    activeTab === 'password'
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  {activeTab === 'password' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg"
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </span>
                </motion.button>
              </nav>
            </div>
          </div>

          <div className="p-8 relative z-10">
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
                    <div className="space-y-8 relative z-20">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Your Information</h3>
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('Edit Profile clicked')
                            setEditingProfile(true)
                          }}
                          className="relative z-30 inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Profile
                        </motion.button>
                      </div>

                      {/* Basic Information - Read Only */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          Basic Information
                        </h4>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-xl blur opacity-50"></div>
                          <div className="relative backdrop-blur-sm bg-white/80 border border-white/30 rounded-xl p-6 shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="space-y-2"
                              >
                                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                  Name
                                </label>
                                <p className="text-lg font-medium text-gray-900">{profile.name || 'Not set'}</p>
                                <p className="text-xs text-gray-500 flex items-center">
                                  <Settings className="h-3 w-3 mr-1" />
                                  Name cannot be changed
                                </p>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="space-y-2"
                              >
                                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                  Email
                                </label>
                                <p className="text-lg font-medium text-gray-900">{profile.email}</p>
                                <p className="text-xs text-gray-500 flex items-center">
                                  <Settings className="h-3 w-3 mr-1" />
                                  Email cannot be changed
                                </p>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Company Information */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                            <Building className="h-4 w-4 text-white" />
                          </div>
                          Company Information
                        </h4>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 to-pink-100/20 rounded-xl blur opacity-50"></div>
                          <div className="relative backdrop-blur-sm bg-white/80 border border-white/30 rounded-xl p-6 shadow-lg">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className="flex items-center space-x-4"
                            >
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                                <Briefcase className="h-6 w-6 text-purple-600" />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700">Company</label>
                                <p className="text-xl font-bold text-gray-900">{profile.company || 'Not specified'}</p>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Contact Information */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                            <Phone className="h-4 w-4 text-white" />
                          </div>
                          Contact Information
                        </h4>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 to-emerald-100/20 rounded-xl blur opacity-50"></div>
                          <div className="relative backdrop-blur-sm bg-white/80 border border-white/30 rounded-xl p-6 shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <Phone className="h-4 w-4 text-white" />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-semibold text-green-800">Primary Phone</label>
                                    <p className="text-lg font-medium text-green-900">{profile.primaryPhone || profile.phone || 'Not set'}</p>
                                  </div>
                                </div>
                              </motion.div>
                              
                              {profile.cellPhone && (
                                <motion.div
                                  whileHover={{ scale: 1.02, y: -2 }}
                                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                      <Phone className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-semibold text-blue-800">Cell Phone</label>
                                      <p className="text-lg font-medium text-blue-900">{profile.cellPhone}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                              
                              {profile.homePhone && (
                                <motion.div
                                  whileHover={{ scale: 1.02, y: -2 }}
                                  className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                      <Phone className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-semibold text-orange-800">Home Phone</label>
                                      <p className="text-lg font-medium text-orange-900">{profile.homePhone}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                              
                              {profile.workPhone && (
                                <motion.div
                                  whileHover={{ scale: 1.02, y: -2 }}
                                  className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                      <Phone className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-semibold text-purple-800">Work Phone</label>
                                      <p className="text-lg font-medium text-purple-900">{profile.workPhone}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Address Information */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                            <MapPin className="h-4 w-4 text-white" />
                          </div>
                          Address Information
                        </h4>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/20 to-purple-100/20 rounded-xl blur opacity-50"></div>
                          <div className="relative backdrop-blur-sm bg-white/80 border border-white/30 rounded-xl p-6 shadow-lg">
                            <div className="space-y-6">
                              {/* Home Address */}
                              {(profile.homeAddress || profile.address) && (
                                <motion.div
                                  whileHover={{ scale: 1.01, y: -2 }}
                                  className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200"
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mt-1">
                                      <MapPin className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-semibold text-indigo-800 mb-2">Home Address</label>
                                      <p className="text-indigo-900 leading-relaxed">{profile.homeAddress || profile.address}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                              
                              {/* Office Address */}
                              {profile.officeAddress && (
                                <motion.div
                                  whileHover={{ scale: 1.01, y: -2 }}
                                  className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200"
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mt-1">
                                      <Building className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-semibold text-purple-800 mb-2">Office Address</label>
                                      <p className="text-purple-900 leading-relaxed">{profile.officeAddress}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                              
                              {/* Location Details */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  className="text-center p-4 bg-white/60 rounded-lg border border-white/40 shadow-sm"
                                >
                                  <Globe className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                                  <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                                  <p className="text-sm font-medium text-gray-900">{profile.city || 'Not set'}</p>
                                </motion.div>
                                
                                {profile.state && (
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="text-center p-4 bg-white/60 rounded-lg border border-white/40 shadow-sm"
                                  >
                                    <MapPin className="h-6 w-6 text-green-500 mx-auto mb-2" />
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                                    <p className="text-sm font-medium text-gray-900">{profile.state}</p>
                                  </motion.div>
                                )}
                                
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  className="text-center p-4 bg-white/60 rounded-lg border border-white/40 shadow-sm"
                                >
                                  <Globe className="h-6 w-6 text-red-500 mx-auto mb-2" />
                                  <label className="block text-xs font-semibold text-gray-700 mb-1">Country</label>
                                  <p className="text-sm font-medium text-gray-900">{profile.country || 'Not set'}</p>
                                </motion.div>
                                
                                {profile.postalCode && (
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="text-center p-4 bg-white/60 rounded-lg border border-white/40 shadow-sm"
                                  >
                                    <Mail className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Postal Code</label>
                                    <p className="text-sm font-medium text-gray-900">{profile.postalCode}</p>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    // Profile Edit Mode
                    <form onSubmit={handleProfileSubmit} className="space-y-8">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Edit Your Information</h3>
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => setEditingProfile(false)}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </motion.button>
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

                      {/* Contact Information */}
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                          <Phone className="h-5 w-5 mr-2" />
                          Contact Information
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Primary Phone <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              value={profileForm.primaryPhone}
                              onChange={(e) => setProfileForm({ ...profileForm, primaryPhone: e.target.value })}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="e.g., +1 (555) 123-4567"
                            />
                            <p className="text-xs text-gray-500 mt-1">This will be your main contact number</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                      {/* Address Information */}
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                          <MapPin className="h-5 w-5 mr-2" />
                          Address Information
                        </h4>
                        <div className="space-y-6">
                          {/* Home Address */}
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
                          
                          {/* Office Address */}
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
                          
                          {/* Location Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                              <input
                                type="text"
                                value={profileForm.state}
                                onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="State or Province"
                              />
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
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                              <input
                                type="text"
                                value={profileForm.postalCode}
                                onChange={(e) => setProfileForm({ ...profileForm, postalCode: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Postal/Zip Code"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex justify-end pt-8 border-t border-white/20"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          disabled={saving}
                          className="relative overflow-hidden inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-primary-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="relative z-10 flex items-center">
                            {saving ? (
                              <>
                                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="h-5 w-5 mr-3" />
                                Save Changes
                              </>
                            )}
                          </span>
                        </motion.button>
                      </motion.div>
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
                  <div className="max-w-3xl">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center mb-8"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
                          <Key className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div className="ml-6">
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Change Password</h3>
                        <p className="text-lg text-gray-600 mt-1">Update your account password for enhanced security</p>
                      </div>
                    </motion.div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      {/* Current Password */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                          Current Password
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-red-100/30 to-pink-100/30 rounded-xl blur opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            className="relative w-full border-0 backdrop-blur-sm bg-white/90 rounded-xl px-6 py-4 pr-12 text-lg focus:ring-2 focus:ring-primary-500 focus:bg-white shadow-lg transition-all duration-200"
                            placeholder="Enter your current password"
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </motion.button>
                        </div>
                      </motion.div>

                      {/* New Password */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                          New Password
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-100/30 to-blue-100/30 rounded-xl blur opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="relative w-full border-0 backdrop-blur-sm bg-white/90 rounded-xl px-6 py-4 pr-12 text-lg focus:ring-2 focus:ring-primary-500 focus:bg-white shadow-lg transition-all duration-200"
                            placeholder="Enter your new password"
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </motion.button>
                        </div>

                        {/* Password Strength Indicator */}
                        {passwordForm.newPassword && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-4"
                          >
                            <div className="flex items-center mb-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-3 mr-4 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(getPasswordStrength(passwordForm.newPassword) / 5) * 100}%` }}
                                  transition={{ duration: 0.5 }}
                                  className={`h-3 rounded-full ${getStrengthColor(getPasswordStrength(passwordForm.newPassword))}`}
                                />
                              </div>
                              <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                                getPasswordStrength(passwordForm.newPassword) <= 2 ? 'text-red-600 bg-red-100' :
                                getPasswordStrength(passwordForm.newPassword) <= 3 ? 'text-yellow-600 bg-yellow-100' :
                                getPasswordStrength(passwordForm.newPassword) <= 4 ? 'text-blue-600 bg-blue-100' : 'text-green-600 bg-green-100'
                              }`}>
                                {getStrengthText(getPasswordStrength(passwordForm.newPassword))}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Confirm New Password */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                          Confirm New Password
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-xl blur opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="relative w-full border-0 backdrop-blur-sm bg-white/90 rounded-xl px-6 py-4 pr-12 text-lg focus:ring-2 focus:ring-primary-500 focus:bg-white shadow-lg transition-all duration-200"
                            placeholder="Confirm your new password"
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </motion.button>
                        </div>
                        {passwordForm.newPassword && passwordForm.confirmPassword && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-3"
                          >
                            {passwordForm.newPassword !== passwordForm.confirmPassword ? (
                              <div className="flex items-center px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                                <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                                <p className="text-sm font-medium text-red-700">Passwords do not match</p>
                              </div>
                            ) : (
                              <div className="flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                <p className="text-sm font-medium text-green-700">Passwords match perfectly!</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Security Tips */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-xl blur opacity-50"></div>
                        <div className="relative backdrop-blur-sm bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border border-blue-200/50 rounded-xl p-6 shadow-lg">
                          <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                              <Shield className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-lg font-bold text-blue-800">Password Security Tips</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                              'Use at least 8 characters',
                              'Include uppercase and lowercase letters',
                              'Add numbers and special characters',
                              'Avoid common words or personal information',
                              'Don\'t reuse passwords from other accounts',
                              'Consider using a password manager'
                            ].map((tip, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="flex items-center space-x-3 p-2 bg-white/60 rounded-lg border border-white/40"
                              >
                                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                                <span className="text-sm font-medium text-blue-800">{tip}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>

                      {/* Submit Button */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex justify-end pt-8"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                          className="relative overflow-hidden inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="relative z-10 flex items-center">
                            {saving ? (
                              <>
                                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <Save className="h-5 w-5 mr-3" />
                                Update Password
                              </>
                            )}
                          </span>
                        </motion.button>
                      </motion.div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}