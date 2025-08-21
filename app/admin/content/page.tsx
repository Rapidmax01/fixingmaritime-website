'use client'

import Link from 'next/link'
import { ArrowLeft, FileText, Image, Settings, Globe } from 'lucide-react'

export default function AdminContent() {
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
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="mt-2 text-gray-600">
              Manage website content and media
            </p>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Content Management Coming Soon</h3>
          <p className="text-gray-600 mb-6">
            This feature will allow you to manage website content, images, and media files.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 border border-gray-200 rounded-lg">
              <FileText className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Page Content</h4>
              <p className="text-sm text-gray-600">Edit page content and copy</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <Image className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Media Library</h4>
              <p className="text-sm text-gray-600">Manage images and files</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <Globe className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">SEO Settings</h4>
              <p className="text-sm text-gray-600">Optimize for search engines</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}