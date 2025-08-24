'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, User, AlertCircle, Loader2 } from 'lucide-react'

export default function SimpleProfile() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<any>(null)
  const [debugInfo, setDebugInfo] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError('')
      setDebugInfo('Attempting to fetch profile...')

      const response = await fetch('/api/admin/auth/profile', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      setDebugInfo(`Response status: ${response.status}`)
      
      const data = await response.json()
      setDebugInfo(prev => prev + `\nResponse data: ${JSON.stringify(data, null, 2)}`)

      if (response.status === 401) {
        setError('Not authenticated. Please log in to the admin panel.')
        setDebugInfo(prev => prev + '\nRedirecting to login...')
        // Redirect to admin login
        window.location.href = '/admin/login'
        return
      }

      if (response.status === 503) {
        setError('Database connection issue. Please check your database configuration.')
        return
      }

      if (!response.ok) {
        setError(`API Error (${response.status}): ${data.error || 'Unknown error'}`)
        return
      }

      if (data.user) {
        setProfile(data.user)
        setDebugInfo(prev => prev + '\n✅ Profile loaded successfully')
      } else {
        setError('No user data received from server')
      }

    } catch (fetchError: any) {
      setError(`Network error: ${fetchError.message}`)
      setDebugInfo(prev => prev + `\nNetwork error: ${fetchError.message}`)
    } finally {
      setLoading(false)
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
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center text-red-600 mb-4">
            <AlertCircle className="h-6 w-6 mr-2" />
            <h2 className="text-lg font-semibold">Profile Loading Error</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
                Show Debug Information
              </summary>
              <div className="mt-2 bg-gray-50 p-3 rounded border text-xs font-mono whitespace-pre-wrap">
                {debugInfo}
              </div>
            </details>
            
            <div className="space-y-2">
              <button
                onClick={loadProfile}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry Loading Profile
              </button>
              
              <Link
                href="/admin"
                className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-center"
              >
                Back to Dashboard
              </Link>
              
              <Link
                href="/admin/login"
                className="block w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
              >
                Go to Login
              </Link>
            </div>
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
          <button
            onClick={loadProfile}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
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
            <h1 className="text-2xl font-bold text-gray-900">Profile (Simple View)</h1>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Company</h3>
              <p className="text-gray-900">{profile.company || 'Not specified'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Phone</h3>
              <p className="text-gray-900">
                {profile.primaryPhone || profile.phone || 'Not specified'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Address</h3>
              <p className="text-gray-900">
                {profile.homeAddress || profile.address || 'Not specified'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
              <p className="text-gray-900">
                {[profile.city, profile.country].filter(Boolean).join(', ') || 'Not specified'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Account Status</h3>
              <p className="text-gray-900">
                {profile.emailVerified ? 'Verified' : 'Unverified'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Member Since</h3>
              <p className="text-gray-900">
                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex space-x-4">
              <Link
                href="/admin/profile"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Full Profile Editor
              </Link>
              
              <Link
                href="/admin/profile/debug"
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Debug Tools
              </Link>
            </div>
          </div>

          <details className="mt-6">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
              Show Raw Profile Data
            </summary>
            <div className="mt-2 bg-gray-50 p-4 rounded border">
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}