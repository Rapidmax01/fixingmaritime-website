'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { 
  FileText, 
  Image, 
  Globe, 
  Edit3, 
  Save, 
  X, 
  Plus,
  Eye,
  Settings,
  Upload,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { motion } from 'framer-motion'
import AdminHeader from '@/components/AdminHeader'

interface AdminUser {
  id: string
  email: string
  name?: string
  role: string
}

interface ContentSection {
  id: string
  name: string
  title: string
  content: string
  type: 'hero' | 'about' | 'services' | 'contact' | 'footer'
  isEditing?: boolean
}

interface SEOSettings {
  title: string
  description: string
  keywords: string
  ogTitle: string
  ogDescription: string
}

const mockContentSections: ContentSection[] = [
  {
    id: '1',
    name: 'Hero Section',
    title: 'Professional Maritime Solutions',
    content: 'Your trusted partner for comprehensive maritime services including documentation, freight forwarding, warehousing, and custom clearing.',
    type: 'hero'
  },
  {
    id: '2', 
    name: 'About Us',
    title: 'Leading Maritime Service Provider',
    content: 'With years of experience in the maritime industry, Fixing Maritime has established itself as a trusted partner for businesses seeking reliable and efficient maritime solutions. Our comprehensive range of services covers every aspect of maritime logistics.',
    type: 'about'
  },
  {
    id: '3',
    name: 'Services Overview', 
    title: 'Comprehensive Maritime Services',
    content: 'We offer a complete suite of maritime services designed to streamline your logistics operations and ensure smooth sailing for your business ventures.',
    type: 'services'
  },
  {
    id: '4',
    name: 'Contact Information',
    title: 'Get in Touch',
    content: 'Ready to streamline your maritime operations? Contact our expert team today for personalized solutions tailored to your business needs.',
    type: 'contact'
  },
  {
    id: '5',
    name: 'Footer Content',
    title: 'Fixing Maritime',
    content: 'Your comprehensive maritime solutions partner. Trusted by businesses worldwide for reliable and efficient maritime services.',
    type: 'footer'
  }
]

const mockSEOSettings: SEOSettings = {
  title: 'Fixing Maritime - Professional Maritime Services',
  description: 'Complete maritime solutions including documentation, truck services, tug boat with barge, procurement, freight forwarding, warehousing, and custom clearing.',
  keywords: 'maritime services, freight forwarding, custom clearing, tug boat, barge, warehousing, procurement, export goods',
  ogTitle: 'Fixing Maritime - Professional Maritime Services',
  ogDescription: 'Your trusted partner for comprehensive maritime solutions'
}

export default function AdminContent() {
  const router = useRouter()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'media'>('content')
  const [contentSections, setContentSections] = useState<ContentSection[]>(mockContentSections)
  const [seoSettings, setSeoSettings] = useState<SEOSettings>(mockSEOSettings)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/me')
      if (response.ok) {
        const data = await response.json()
        setAdmin(data.user)
      } else {
        router.push('/admin/login')
        return
      }
    } catch (error) {
      router.push('/admin/login')
      return
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        toast.success('Logged out successfully')
        router.push('/admin/login')
      } else {
        toast.error('Failed to logout')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const startEditing = (sectionId: string) => {
    setContentSections(sections => 
      sections.map(section => 
        section.id === sectionId 
          ? { ...section, isEditing: true }
          : { ...section, isEditing: false }
      )
    )
  }

  const cancelEditing = (sectionId: string) => {
    setContentSections(sections => 
      sections.map(section => 
        section.id === sectionId 
          ? { ...section, isEditing: false }
          : section
      )
    )
  }

  const updateContent = (sectionId: string, field: 'title' | 'content', value: string) => {
    setContentSections(sections =>
      sections.map(section =>
        section.id === sectionId
          ? { ...section, [field]: value }
          : section
      )
    )
  }

  const saveSection = async (sectionId: string) => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setContentSections(sections =>
        sections.map(section =>
          section.id === sectionId
            ? { ...section, isEditing: false }
            : section
        )
      )
      
      toast.success('Content updated successfully')
    } catch (error) {
      toast.error('Failed to update content')
    } finally {
      setIsSaving(false)
    }
  }

  const saveSEOSettings = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('SEO settings updated successfully')
    } catch (error) {
      toast.error('Failed to update SEO settings')
    } finally {
      setIsSaving(false)
    }
  }

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'hero': return '🚢'
      case 'about': return '📋'
      case 'services': return '⚓'
      case 'contact': return '📞'
      case 'footer': return '🔗'
      default: return '📄'
    }
  }

  if (isLoading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader admin={admin} onLogout={handleLogout} />
      <div className="flex-grow mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
              <p className="mt-1 text-gray-600">
                Manage website content, SEO settings, and media files
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Live Site
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'content'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Page Content
              </button>
              <button
                onClick={() => setActiveTab('seo')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'seo'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Globe className="h-4 w-4 inline mr-2" />
                SEO Settings
              </button>
              <button
                onClick={() => setActiveTab('media')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'media'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Image className="h-4 w-4 inline mr-2" />
                Media Library
              </button>
            </nav>
          </div>
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {contentSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getSectionIcon(section.type)}</span>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{section.name}</h3>
                        <p className="text-sm text-gray-500">
                          {section.type.charAt(0).toUpperCase() + section.type.slice(1)} section
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!section.isEditing ? (
                        <button
                          onClick={() => startEditing(section.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => saveSection(section.id)}
                            disabled={isSaving}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                          >
                            {isSaving ? (
                              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4 mr-1" />
                            )}
                            Save
                          </button>
                          <button
                            onClick={() => cancelEditing(section.id)}
                            disabled={isSaving}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {section.isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateContent(section.id, 'title', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content
                        </label>
                        <textarea
                          rows={4}
                          value={section.content}
                          onChange={(e) => updateContent(section.id, 'content', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Title</h4>
                        <p className="text-gray-700">{section.title}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Content</h4>
                        <p className="text-gray-700 leading-relaxed">{section.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>
                  <p className="text-sm text-gray-500">
                    Optimize your website for search engines
                  </p>
                </div>
                <button
                  onClick={saveSEOSettings}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {isSaving ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save SEO Settings
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={seoSettings.title}
                    onChange={(e) => setSeoSettings({ ...seoSettings, title: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    placeholder="Enter page title..."
                  />
                  <p className="mt-1 text-xs text-gray-500">Recommended: 50-60 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={seoSettings.description}
                    onChange={(e) => setSeoSettings({ ...seoSettings, description: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    placeholder="Enter meta description..."
                  />
                  <p className="mt-1 text-xs text-gray-500">Recommended: 150-160 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={seoSettings.keywords}
                    onChange={(e) => setSeoSettings({ ...seoSettings, keywords: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    placeholder="keyword1, keyword2, keyword3..."
                  />
                  <p className="mt-1 text-xs text-gray-500">Separate keywords with commas</p>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Open Graph (Social Media)</h4>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OG Title
                      </label>
                      <input
                        type="text"
                        value={seoSettings.ogTitle}
                        onChange={(e) => setSeoSettings({ ...seoSettings, ogTitle: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                        placeholder="Title for social media sharing..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OG Description
                      </label>
                      <textarea
                        rows={2}
                        value={seoSettings.ogDescription}
                        onChange={(e) => setSeoSettings({ ...seoSettings, ogDescription: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                        placeholder="Description for social media sharing..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Media Library</h3>
                  <p className="text-sm text-gray-500">
                    Manage images and files for your website
                  </p>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Media
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Media Library Coming Soon</h4>
                <p className="text-gray-600 mb-4">
                  Upload and manage images, documents, and other media files for your website.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Image className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <h5 className="font-medium text-gray-900 text-sm">Images</h5>
                    <p className="text-xs text-gray-600">JPG, PNG, GIF, WebP</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <FileText className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <h5 className="font-medium text-gray-900 text-sm">Documents</h5>
                    <p className="text-xs text-gray-600">PDF, DOC, XLS</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Settings className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <h5 className="font-medium text-gray-900 text-sm">Optimization</h5>
                    <p className="text-xs text-gray-600">Auto-resize & compress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}