'use client'

import { useState } from 'react'
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
  AlertTriangle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function AdminProfile() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('All fields are required')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New password and confirmation do not match')
      return
    }

    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Password updated successfully!')
        setFormData({
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
      setLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    let feedback = []
    
    if (password.length >= 8) strength += 1
    else feedback.push('At least 8 characters')
    
    if (/[a-z]/.test(password)) strength += 1
    else feedback.push('Lowercase letter')
    
    if (/[A-Z]/.test(password)) strength += 1
    else feedback.push('Uppercase letter')
    
    if (/[0-9]/.test(password)) strength += 1
    else feedback.push('Number')
    
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1
    else feedback.push('Special character')
    
    return { strength, feedback }
  }

  const passwordStrength = getPasswordStrength(formData.newPassword)

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
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Key className="h-5 w-5 text-primary-600" />
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                <p className="text-sm text-gray-600">Update your account password for security</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
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
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
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
                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength.strength)}`}
                          style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${
                        passwordStrength.strength <= 2 ? 'text-red-600' :
                        passwordStrength.strength <= 3 ? 'text-yellow-600' :
                        passwordStrength.strength <= 4 ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        {getStrengthText(passwordStrength.strength)}
                      </span>
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="flex items-start">
                        <AlertTriangle className="h-3 w-3 text-orange-500 mr-1 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600">
                          Missing: {passwordStrength.feedback.join(', ')}
                        </p>
                      </div>
                    )}
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
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Passwords do not match
                  </p>
                )}
                {formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
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
                  disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
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
        </div>
      </div>
    </div>
  )
}