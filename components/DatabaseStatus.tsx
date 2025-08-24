'use client'

import { useState, useEffect } from 'react'
import { Database, AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface DatabaseStatus {
  isHealthy: boolean
  lastChecked: string
  responseTime?: number
}

export default function DatabaseStatus() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [waking, setWaking] = useState(false)

  const checkDatabaseStatus = async () => {
    const startTime = Date.now()
    
    try {
      const response = await fetch('/api/admin/auth/profile', {
        method: 'HEAD' // Just check if endpoint responds
      })
      
      const responseTime = Date.now() - startTime
      
      setStatus({
        isHealthy: response.ok || response.status === 401, // 401 is fine, means DB is up but no auth
        lastChecked: new Date().toISOString(),
        responseTime
      })
    } catch (error) {
      setStatus({
        isHealthy: false,
        lastChecked: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  const wakeDatabase = async () => {
    setWaking(true)
    
    try {
      const response = await fetch('/api/admin/database/wake', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Database is now active!')
        await checkDatabaseStatus() // Recheck status
      } else {
        toast.error(data.message || 'Failed to wake database')
      }
    } catch (error) {
      toast.error('Error communicating with wake service')
    } finally {
      setWaking(false)
    }
  }

  useEffect(() => {
    checkDatabaseStatus()
    
    // Check status every 30 seconds
    const interval = setInterval(checkDatabaseStatus, 30000)
    
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center">
          <Loader2 className="h-5 w-5 animate-spin text-gray-500 mr-2" />
          <span className="text-sm text-gray-600">Checking database status...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Database className="h-5 w-5 text-gray-700 mr-3" />
          <div>
            <div className="flex items-center">
              {status?.isHealthy ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              )}
              <span className="font-medium text-sm">
                Database {status?.isHealthy ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Last checked: {status?.lastChecked ? new Date(status.lastChecked).toLocaleTimeString() : 'Never'}
              {status?.responseTime && (
                <span className="ml-2">({status.responseTime}ms)</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={checkDatabaseStatus}
            disabled={loading}
            className="text-xs text-gray-500 hover:text-gray-700 p-1"
            title="Refresh status"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          {!status?.isHealthy && (
            <button
              onClick={wakeDatabase}
              disabled={waking}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center"
            >
              {waking ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  Waking...
                </>
              ) : (
                'Wake DB'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}