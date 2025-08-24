'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Database, User, Loader2 } from 'lucide-react'

export default function ProfileDebug() {
  const [status, setStatus] = useState('loading')
  const [logs, setLogs] = useState<string[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState('')

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    debugProfile()
  }, [])

  const debugProfile = async () => {
    try {
      setStatus('testing')
      addLog('🔍 Starting profile debug...')
      
      // Test 1: Database connection
      addLog('📡 Testing database connection...')
      try {
        const testResponse = await fetch('/api/admin/auth/profile/test')
        const testData = await testResponse.json()
        
        if (testResponse.ok) {
          addLog('✅ Database connection successful')
          addLog(`📊 User count: ${testData.userCount}`)
          addLog(`👤 Admin user found: ${testData.adminUser?.email}`)
        } else {
          addLog(`❌ Database test failed: ${testData.error}`)
          setError(`Database test failed: ${testData.error}`)
          setStatus('error')
          return
        }
      } catch (testError: any) {
        addLog(`❌ Database test request failed: ${testError.message}`)
        setError(`Database test request failed: ${testError.message}`)
        setStatus('error')
        return
      }

      // Test 2: Profile API
      addLog('👤 Testing profile API...')
      try {
        const profileResponse = await fetch('/api/admin/auth/profile')
        const profileData = await profileResponse.json()
        
        addLog(`📄 Profile API status: ${profileResponse.status}`)
        addLog(`📄 Profile API response: ${JSON.stringify(profileData, null, 2)}`)
        
        if (profileResponse.ok) {
          addLog('✅ Profile API successful')
          setProfile(profileData.user)
          setStatus('success')
        } else {
          addLog(`❌ Profile API failed: ${profileData.error}`)
          setError(`Profile API failed: ${profileData.error}`)
          setStatus('error')
        }
      } catch (profileError: any) {
        addLog(`❌ Profile API request failed: ${profileError.message}`)
        setError(`Profile API request failed: ${profileError.message}`)
        setStatus('error')
      }
      
    } catch (error: any) {
      addLog(`💥 Unexpected error: ${error.message}`)
      setError(`Unexpected error: ${error.message}`)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <Database className="h-6 w-6 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Profile Debug</h1>
          </div>
          
          <div className="flex items-center mb-4">
            {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />}
            {status === 'testing' && <Loader2 className="h-5 w-5 animate-spin text-yellow-500 mr-2" />}
            {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500 mr-2" />}
            {status === 'error' && <AlertCircle className="h-5 w-5 text-red-500 mr-2" />}
            <span className="font-medium capitalize">{status}</span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-1 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {profile && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">Profile Loaded Successfully</h3>
                  <div className="mt-2">
                    <div className="text-sm text-green-700">
                      <p><strong>Email:</strong> {profile.email}</p>
                      <p><strong>Name:</strong> {profile.name || 'Not set'}</p>
                      <p><strong>Role:</strong> {profile.role}</p>
                      <p><strong>Company:</strong> {profile.company || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Debug Logs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Debug Logs</h2>
          <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-sm">No logs yet...</p>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div key={index} className="text-xs font-mono text-gray-700">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <button
              onClick={debugProfile}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Re-run Debug
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}