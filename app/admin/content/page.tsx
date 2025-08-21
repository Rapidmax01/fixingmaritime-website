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
  RefreshCw,
  Search,
  Filter,
  Grid3X3,
  List,
  Download,
  Copy,
  ExternalLink,
  Calendar,
  FileImage,
  File,
  Video,
  Music
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

interface MediaFile {
  id: string
  name: string
  type: 'image' | 'document' | 'video' | 'audio'
  url: string
  size: number
  uploadedAt: string
  dimensions?: {
    width: number
    height: number
  }
  alt?: string
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

const mockMediaFiles: MediaFile[] = [
  {
    id: '1',
    name: 'hero-ship-background.jpg',
    type: 'image',
    url: '/images/hero-bg.jpg',
    size: 2456789,
    uploadedAt: '2024-01-15T10:30:00Z',
    dimensions: { width: 1920, height: 1080 },
    alt: 'Maritime cargo ship at sunset'
  },
  {
    id: '2',
    name: 'truck-services.jpg',
    type: 'image',
    url: '/images/truck-bg.jpg',
    size: 1876543,
    uploadedAt: '2024-01-14T14:20:00Z',
    dimensions: { width: 1600, height: 900 },
    alt: 'Truck loading cargo at port'
  },
  {
    id: '3',
    name: 'warehouse-facility.jpg',
    type: 'image',
    url: '/images/warehouse-bg.jpg',
    size: 3245678,
    uploadedAt: '2024-01-13T09:15:00Z',
    dimensions: { width: 2048, height: 1365 },
    alt: 'Modern warehouse facility'
  },
  {
    id: '4',
    name: 'company-brochure.pdf',
    type: 'document',
    url: '/documents/brochure.pdf',
    size: 4567890,
    uploadedAt: '2024-01-12T16:45:00Z'
  },
  {
    id: '5',
    name: 'port-operations.mp4',
    type: 'video',
    url: '/videos/port-ops.mp4',
    size: 15678901,
    uploadedAt: '2024-01-11T11:30:00Z'
  },
  {
    id: '6',
    name: 'team-photo.jpg',
    type: 'image',
    url: '/images/team.jpg',
    size: 1234567,
    uploadedAt: '2024-01-10T13:20:00Z',
    dimensions: { width: 1280, height: 854 },
    alt: 'Fixing Maritime team photo'
  },
  {
    id: '7',
    name: 'service-overview.pdf',
    type: 'document',
    url: '/documents/services.pdf',
    size: 2345678,
    uploadedAt: '2024-01-09T08:15:00Z'
  },
  {
    id: '8',
    name: 'container-yard.jpg',
    type: 'image',
    url: '/images/container-yard.jpg',
    size: 2987654,
    uploadedAt: '2024-01-08T15:40:00Z',
    dimensions: { width: 1920, height: 1280 },
    alt: 'Container storage yard'
  }
]

export default function AdminContent() {
  const router = useRouter()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'media'>('content')
  const [contentSections, setContentSections] = useState<ContentSection[]>(mockContentSections)
  const [seoSettings, setSeoSettings] = useState<SEOSettings>(mockSEOSettings)
  const [isSaving, setIsSaving] = useState(false)
  
  // Media library state
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(mockMediaFiles)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'image' | 'document' | 'video' | 'audio'>('all')
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)

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

  // Media library functions
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return FileImage
      case 'document': return File
      case 'video': return Video
      case 'audio': return Music
      default: return File
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newFiles: MediaFile[] = Array.from(files).map((file, index) => ({
        id: `upload-${Date.now()}-${index}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' :
              file.type.startsWith('audio/') ? 'audio' : 'document',
        url: URL.createObjectURL(file),
        size: file.size,
        uploadedAt: new Date().toISOString(),
        dimensions: file.type.startsWith('image/') ? { width: 1200, height: 800 } : undefined
      }))

      setMediaFiles(prev => [...newFiles, ...prev])
      toast.success(`${files.length} file(s) uploaded successfully`)
    } catch (error) {
      toast.error('Failed to upload files')
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  const deleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setMediaFiles(prev => prev.filter(file => file.id !== fileId))
      setSelectedFiles(prev => prev.filter(id => id !== fileId))
      toast.success('File deleted successfully')
    } catch (error) {
      toast.error('Failed to delete file')
    }
  }

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const copyFileUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('File URL copied to clipboard')
  }

  const filteredMediaFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || file.type === filterType
    return matchesSearch && matchesFilter
  })

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
          <div className="space-y-6">
            {/* Media Library Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Media Library</h3>
                  <p className="text-sm text-gray-500">
                    {filteredMediaFiles.length} of {mediaFiles.length} files
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload Files'}
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  
                  {selectedFiles.length > 0 && (
                    <button
                      onClick={() => {
                        selectedFiles.forEach(deleteFile)
                        setSelectedFiles([])
                      }}
                      className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected ({selectedFiles.length})
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search files..."
                      className="pl-10 pr-4 py-2 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="all">All Files</option>
                    <option value="image">Images</option>
                    <option value="document">Documents</option>
                    <option value="video">Videos</option>
                    <option value="audio">Audio</option>
                  </select>
                  
                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-red-50 text-red-600' : 'text-gray-400'}`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 border-l ${viewMode === 'list' ? 'bg-red-50 text-red-600' : 'text-gray-400'}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Grid/List */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {filteredMediaFiles.length === 0 ? (
                <div className="text-center py-12">
                  <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || filterType !== 'all' ? 'No files found' : 'No files yet'}
                  </h4>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filterType !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Upload your first file to get started.'
                    }
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredMediaFiles.map((file, index) => {
                    const FileIcon = getFileIcon(file.type)
                    const isSelected = selectedFiles.includes(file.id)
                    
                    return (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`relative group cursor-pointer rounded-lg border-2 transition-all ${
                          isSelected 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleFileSelection(file.id)}
                      >
                        <div className="aspect-square p-3">
                          {file.type === 'image' ? (
                            <div className="w-full h-full bg-gray-100 rounded overflow-hidden">
                              <img
                                src={file.url}
                                alt={file.alt || file.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                  target.nextElementSibling?.classList.remove('hidden')
                                }}
                              />
                              <div className="hidden w-full h-full flex items-center justify-center">
                                <FileIcon className="h-8 w-8 text-gray-400" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded">
                              <FileIcon className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  copyFileUrl(file.url)
                                }}
                                className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
                                title="Copy URL"
                              >
                                <Copy className="h-3 w-3 text-gray-600" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedFile(file)
                                }}
                                className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
                                title="View Details"
                              >
                                <Eye className="h-3 w-3 text-gray-600" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteFile(file.id)
                                }}
                                className="p-1 bg-white rounded shadow-sm hover:bg-red-50 text-red-600"
                                title="Delete"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          
                          {isSelected && (
                            <div className="absolute top-2 left-2">
                              <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-2 border-t">
                          <p className="text-xs font-medium text-gray-900 truncate" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredMediaFiles.map((file, index) => {
                    const FileIcon = getFileIcon(file.type)
                    const isSelected = selectedFiles.includes(file.id)
                    
                    return (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={`flex items-center p-3 rounded-lg border transition-all ${
                          isSelected 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleFileSelection(file.id)}
                          className="h-4 w-4 text-red-600 rounded focus:ring-red-500"
                        />
                        
                        <div className="ml-3 flex items-center min-w-0 flex-1">
                          {file.type === 'image' ? (
                            <img
                              src={file.url}
                              alt={file.alt || file.name}
                              className="h-10 w-10 rounded object-cover mr-3"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                target.nextElementSibling?.classList.remove('hidden')
                              }}
                            />
                          ) : null}
                          <div className={`${file.type !== 'image' ? 'flex items-center justify-center h-10 w-10 bg-gray-100 rounded mr-3' : 'hidden'}`}>
                            <FileIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <span>{formatFileSize(file.size)}</span>
                              {file.dimensions && (
                                <span className="ml-2">{file.dimensions.width}x{file.dimensions.height}</span>
                              )}
                              <span className="ml-2">{new Date(file.uploadedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => copyFileUrl(file.url)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Copy URL"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => window.open(file.url, '_blank')}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Open"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setSelectedFile(file)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteFile(file.id)}
                            className="p-1 text-red-400 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* File Details Modal */}
            {selectedFile && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">File Details</h3>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {selectedFile.type === 'image' && (
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={selectedFile.url}
                            alt={selectedFile.alt || selectedFile.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            File Name
                          </label>
                          <p className="text-sm text-gray-900">{selectedFile.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            File Size
                          </label>
                          <p className="text-sm text-gray-900">{formatFileSize(selectedFile.size)}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            File Type
                          </label>
                          <p className="text-sm text-gray-900 capitalize">{selectedFile.type}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Date
                          </label>
                          <p className="text-sm text-gray-900">
                            {new Date(selectedFile.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {selectedFile.dimensions && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Dimensions
                              </label>
                              <p className="text-sm text-gray-900">
                                {selectedFile.dimensions.width} x {selectedFile.dimensions.height}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          File URL
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={selectedFile.url}
                            readOnly
                            className="flex-1 text-sm bg-gray-50 border border-gray-300 rounded px-3 py-2"
                          />
                          <button
                            onClick={() => copyFileUrl(selectedFile.url)}
                            className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                      
                      {selectedFile.type === 'image' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alt Text
                          </label>
                          <input
                            type="text"
                            value={selectedFile.alt || ''}
                            onChange={(e) => {
                              setSelectedFile({ ...selectedFile, alt: e.target.value })
                              setMediaFiles(prev => prev.map(file => 
                                file.id === selectedFile.id 
                                  ? { ...file, alt: e.target.value }
                                  : file
                              ))
                            }}
                            placeholder="Enter alt text for accessibility..."
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => deleteFile(selectedFile.id)}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete File
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}