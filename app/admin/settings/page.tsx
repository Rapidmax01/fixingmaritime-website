'use client'

import Link from 'next/link'
import { ArrowLeft, Settings, Database, Mail, Shield, Bell } from 'lucide-react'

export default function AdminSettings() {
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="mt-2 text-gray-600">
              Configure system settings and preferences
            </p>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Database className="h-6 w-6 text-primary-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Database Settings</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Current database connection status and configuration.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Connection Status:</span>
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Database Type:</span>
                <span className="text-sm text-gray-900">PostgreSQL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Provider:</span>
                <span className="text-sm text-gray-900">Supabase</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-primary-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Email Settings</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Configure email service for notifications and communications.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email Provider:</span>
                <span className="text-sm text-gray-900">Demo Mode</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Verification Emails:</span>
                <span className="text-sm font-medium text-blue-600">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">From Address:</span>
                <span className="text-sm text-gray-900">noreply@fixingmaritime.com</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-primary-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Security and authentication configuration.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Authentication:</span>
                <span className="text-sm text-gray-900">NextAuth.js</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">OAuth Providers:</span>
                <span className="text-sm text-gray-900">Google</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email Verification:</span>
                <span className="text-sm font-medium text-green-600">Required</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Bell className="h-6 w-6 text-primary-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Configure system notifications and alerts.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">New Order Alerts:</span>
                <span className="text-sm font-medium text-green-600">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">User Registration:</span>
                <span className="text-sm font-medium text-green-600">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">System Alerts:</span>
                <span className="text-sm font-medium text-green-600">Enabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Settings className="h-6 w-6 text-primary-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">System Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600">Framework</p>
              <p className="text-lg font-semibold text-gray-900">Next.js 14</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Deployment</p>
              <p className="text-lg font-semibold text-gray-900">Vercel</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Domain</p>
              <p className="text-lg font-semibold text-gray-900">fixingmaritime.com</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Environment</p>
              <p className="text-lg font-semibold text-gray-900">Production</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}