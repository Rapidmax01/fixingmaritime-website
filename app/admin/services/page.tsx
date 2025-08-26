'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Plus, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Eye,
  Package,
  Truck,
  Ship,
  FileText,
  Warehouse,
  Navigation,
  Users,
  DollarSign,
  MessageCircle,
  TrendingUp,
  ToggleLeft,
  ToggleRight,
  Loader2,
  X,
  Save
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface ServiceData {
  id: string
  slug: string
  name: string
  description: string
  features: string[]
  active: boolean
  requests: number
  rating: number
  lastUpdated: string
}

// Icon mapping
const getServiceIcon = (slug: string) => {
  const iconMap: { [key: string]: any } = {
    'documentation': FileText,
    'truck-services': Truck,
    'tugboat-barge': Ship,
    'procurement': Package,
    'freight-forwarding': Navigation,
    'warehousing': Warehouse,
    'custom-clearing': FileText
  }
  return iconMap[slug] || Package
}

// Mock services data
const mockServices = [
  {
    id: 1,
    name: 'Documentation Services',
    description: 'Complete maritime documentation and paperwork services',
    category: 'Documentation',
    icon: FileText,
    features: [
      'Bill of Lading preparation',
      'Certificate of Origin',
      'Commercial Invoice',
      'Packing List',
      'Insurance certificates'
    ],
    active: true,
    requests: 156,
    rating: 4.8,
    lastUpdated: '2024-08-15'
  },
  {
    id: 2,
    name: 'Truck Services',
    description: 'Reliable ground transportation for your cargo',
    category: 'Transportation',
    icon: Truck,
    features: [
      'Local and long-distance transport',
      'Real-time GPS tracking',
      'Temperature-controlled options',
      'Specialized cargo handling',
      '24/7 customer support'
    ],
    active: true,
    requests: 203,
    rating: 4.6,
    lastUpdated: '2024-08-18'
  },
  {
    id: 3,
    name: 'Tug Boat with Barge',
    description: 'Heavy cargo transportation via water routes',
    category: 'Marine Transport',
    icon: Ship,
    features: [
      'Heavy machinery transport',
      'Bulk cargo handling',
      'Experienced marine crew',
      'Weather monitoring',
      'Port-to-port service'
    ],
    active: true,
    requests: 47,
    rating: 4.9,
    lastUpdated: '2024-08-20'
  },
  {
    id: 4,
    name: 'Procurement of Export Goods',
    description: 'Source and procure goods for international export',
    category: 'Procurement',
    icon: Package,
    features: [
      'Global supplier network',
      'Quality assurance',
      'Competitive pricing',
      'Compliance verification',
      'Logistics coordination'
    ],
    active: true,
    requests: 89,
    rating: 4.7,
    lastUpdated: '2024-08-12'
  },
  {
    id: 5,
    name: 'Freight Forwarding',
    description: 'Comprehensive freight forwarding solutions',
    category: 'Logistics',
    icon: Navigation,
    features: [
      'Air and sea freight',
      'Customs clearance',
      'Insurance options',
      'Multi-modal transport',
      'End-to-end tracking'
    ],
    active: true,
    requests: 312,
    rating: 4.8,
    lastUpdated: '2024-08-19'
  },
  {
    id: 6,
    name: 'Warehousing',
    description: 'Secure storage and inventory management',
    category: 'Storage',
    icon: Warehouse,
    features: [
      'Climate-controlled storage',
      'Inventory management',
      'Pick and pack services',
      'Security monitoring',
      'Flexible terms'
    ],
    active: true,
    requests: 178,
    rating: 4.5,
    lastUpdated: '2024-08-16'
  },
  {
    id: 7,
    name: 'Custom Clearing',
    description: 'Expert customs clearance and compliance',
    category: 'Compliance',
    icon: FileText,
    features: [
      'Import/export clearance',
      'Duty calculation',
      'Compliance verification',
      'Document preparation',
      'Regulatory updates'
    ],
    active: false,
    requests: 124,
    rating: 4.4,
    lastUpdated: '2024-07-28'
  }
]

export default function AdminServices() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [services, setServices] = useState<ServiceData[]>([
    {
      id: '1',
      slug: 'documentation',
      name: 'Documentation Services',
      description: 'Complete maritime documentation and paperwork services',
      features: ['Bills of Lading', 'Customs Papers', 'Digital Processing'],
      active: true,
      requests: 156,
      rating: 4.8,
      lastUpdated: '2025-08-22'
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [currentService, setCurrentService] = useState<ServiceData | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    features: [''],
    active: true
  })

  // Fetch services data
  useEffect(() => {
    const loadServices = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/admin/services')
        const data = await response.json()
        
        if (response.ok && data.services && data.services.length > 0) {
          setServices(data.services)
          setError(null)
        } else {
          setError('No services found - using demo data')
        }
      } catch (error) {
        console.error('Error fetching services:', error)
        setError('Connection error - using demo data')
      } finally {
        setLoading(false)
      }
    }
    
    loadServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/services')
      const data = await response.json()
      
      if (response.ok && data.services) {
        setServices(data.services)
        setError(null)
      } else {
        throw new Error(data.error || 'Failed to fetch services')
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      setError('Connection error - using fallback data')
      
      // Simple fallback data that matches our interface
      setServices([
        {
          id: '1',
          slug: 'documentation',
          name: 'Documentation Services',
          description: 'Complete maritime documentation and paperwork services',
          features: ['Bills of Lading', 'Customs Papers', 'Digital Processing'],
          active: true,
          requests: 156,
          rating: 4.8,
          lastUpdated: '2025-08-22'
        },
        {
          id: '2',
          slug: 'truck-services',
          name: 'Truck Services',
          description: 'Reliable ground transportation for cargo delivery',
          features: ['GPS Tracking', 'Door-to-Door', 'Temperature Control'],
          active: true,
          requests: 203,
          rating: 4.6,
          lastUpdated: '2025-08-22'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const totalRequests = services.reduce((sum, service) => sum + service.requests, 0)
  const activeServices = services.filter(service => service.active).length
  const avgRating = services.length > 0 ? services.reduce((sum, service) => sum + service.rating, 0) / services.length : 0

  const toggleServiceStatus = async (serviceId: string) => {
    try {
      const service = services.find(s => s.id === serviceId)
      if (!service) return

      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !service.active })
      })

      if (response.ok) {
        await fetchServices() // Refresh data
        toast.success(`Service ${service.active ? 'deactivated' : 'activated'} successfully`)
      } else {
        toast.error('Failed to update service status')
      }
    } catch (error) {
      console.error('Error toggling service status:', error)
      toast.error('Failed to update service status')
    }
  }

  const seedServices = async () => {
    try {
      const response = await fetch('/api/admin/services/seed', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (response.ok) {
        toast.success(`Services seeded: ${data.count || 0} services added`)
        await fetchServices()
      } else {
        toast.error(data.error || 'Failed to seed services')
      }
    } catch (error) {
      console.error('Error seeding services:', error)
      toast.error('Failed to seed services')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      features: [''],
      active: true
    })
  }

  const handleAddService = () => {
    resetForm()
    setShowAddModal(true)
  }

  const handleEditService = (service: ServiceData) => {
    setCurrentService(service)
    setFormData({
      name: service.name,
      slug: service.slug,
      description: service.description,
      features: service.features,
      active: service.active
    })
    setShowEditModal(true)
    setSelectedService(null)
  }

  const handleDeleteService = (service: ServiceData) => {
    setCurrentService(service)
    setShowDeleteModal(true)
    setSelectedService(null)
  }

  const handleViewService = (service: ServiceData) => {
    setCurrentService(service)
    setShowViewModal(true)
    setSelectedService(null)
  }

  const handleSubmitService = async (isEdit = false) => {
    try {
      const payload = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== '')
      }

      const url = isEdit ? `/api/admin/services/${currentService?.id}` : '/api/admin/services'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast.success(`Service ${isEdit ? 'updated' : 'created'} successfully`)
        await fetchServices()
        setShowAddModal(false)
        setShowEditModal(false)
        resetForm()
      } else {
        const data = await response.json()
        toast.error(data.error || `Failed to ${isEdit ? 'update' : 'create'} service`)
      }
    } catch (error) {
      console.error('Error submitting service:', error)
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} service`)
    }
  }

  const confirmDeleteService = async () => {
    if (!currentService) return

    try {
      const response = await fetch(`/api/admin/services/${currentService.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Service deleted successfully')
        await fetchServices()
        setShowDeleteModal(false)
        setCurrentService(null)
      } else {
        toast.error('Failed to delete service')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error('Failed to delete service')
    }
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData({ ...formData, features: newFeatures })
  }

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] })
  }

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index)
    setFormData({ ...formData, features: newFeatures })
  }

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
              <p className="mt-2 text-gray-600">
                Configure and manage maritime services
                {error && (
                  <span className="block text-sm text-orange-600 mt-1">
                    ⚠️ {error}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={seedServices}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Package className="h-4 w-4 mr-2" />
                Seed Services
              </button>
              <button 
                onClick={handleAddService}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Services</p>
                <p className="text-2xl font-semibold text-gray-900">{activeServices}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-semibold text-gray-900">{totalRequests.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Quote-Based Pricing</p>
                <p className="text-2xl font-semibold text-gray-900">All Services</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-semibold text-gray-900">{avgRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading services...</span>
          </div>
        )}

        {/* Services Grid */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map((service, index) => {
              const ServiceIcon = getServiceIcon(service.slug)
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <ServiceIcon className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-500">Request for Quote</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleServiceStatus(service.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        {service.active ? (
                          <ToggleRight className="h-6 w-6 text-green-500" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-gray-400" />
                        )}
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {selectedService === service.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button 
                                onClick={() => handleViewService(service)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </button>
                              <button 
                                onClick={() => handleEditService(service)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Service
                              </button>
                              <button 
                                onClick={() => handleDeleteService(service)}
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Service
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-gray-600">{service.description}</p>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                      {service.features.length > 3 && (
                        <li className="text-primary-600 text-xs">
                          +{service.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Base Price</p>
                      <p className="text-lg font-semibold text-gray-900">
                        Request for Quote
                      </p>
                      <p className="text-xs text-gray-500">Request for Quote</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Requests</p>
                      <p className="text-lg font-semibold text-gray-900">{service.requests}</p>
                      <p className="text-xs text-gray-500">total</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pricing</p>
                      <p className="text-lg font-semibold text-gray-900">
                        Quote-based
                      </p>
                      <p className="text-xs text-gray-500">total</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Rating:</span>
                      <span className="ml-1 text-sm font-medium text-gray-900">{service.rating}/5</span>
                      <div className="ml-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-3 w-3 ${i < Math.floor(service.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      service.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Last updated: {service.lastUpdated}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
          </div>
        )}

        {/* Modals */}
        <AnimatePresence>
          {/* Add Service Modal */}
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Add New Service</h2>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleSubmitService(false) }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Slug</label>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          placeholder="e.g., documentation-services"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <MessageCircle className="h-5 w-5 text-blue-600 mr-2" />
                          <h4 className="text-sm font-medium text-blue-800">Pricing Policy</h4>
                        </div>
                        <p className="text-sm text-blue-700 mt-2">
                          All services are quote-based. Customers can request a quote for personalized pricing based on their specific needs.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            placeholder="Enter feature"
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                          {formData.features.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addFeature}
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        + Add Feature
                      </button>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="active"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                        Active Service
                      </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Create Service
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Edit Service Modal */}
          {showEditModal && currentService && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowEditModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Service</h2>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleSubmitService(true) }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Slug</label>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <MessageCircle className="h-5 w-5 text-blue-600 mr-2" />
                          <h4 className="text-sm font-medium text-blue-800">Pricing Policy</h4>
                        </div>
                        <p className="text-sm text-blue-700 mt-2">
                          All services are quote-based. Customers can request a quote for personalized pricing based on their specific needs.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            placeholder="Enter feature"
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                          {formData.features.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addFeature}
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        + Add Feature
                      </button>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="editActive"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="editActive" className="ml-2 text-sm text-gray-700">
                        Active Service
                      </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Update Service
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && currentService && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Delete Service</h2>
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete "{currentService.name}"? This action cannot be undone.
                  </p>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeleteService}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete Service
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* View Service Modal */}
          {showViewModal && currentService && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowViewModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Service Details</h2>
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Service Name</h3>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{currentService.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Slug</h3>
                        <p className="mt-1 text-gray-900">{currentService.slug}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="mt-1 text-gray-900">{currentService.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Base Price</h3>
                        <p className="mt-1 text-xl font-bold text-gray-900">Request for Quote</p>
                        <p className="text-sm text-gray-500">Request for Quote</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Total Requests</h3>
                        <p className="mt-1 text-xl font-bold text-gray-900">{currentService.requests}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Pricing</h3>
                        <p className="mt-1 text-xl font-bold text-gray-900">Quote-based</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {currentService.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                            <span className="text-gray-900">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          currentService.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {currentService.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Last updated: {currentService.lastUpdated}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}