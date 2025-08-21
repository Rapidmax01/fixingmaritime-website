'use client'

import { useState } from 'react'
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
  TrendingUp,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import { motion } from 'framer-motion'

// Mock services data
const mockServices = [
  {
    id: 1,
    name: 'Documentation Services',
    description: 'Complete maritime documentation and paperwork services',
    category: 'Documentation',
    icon: FileText,
    price: {
      min: 200,
      max: 500,
      currency: 'USD',
      type: 'per_shipment'
    },
    features: [
      'Bill of Lading preparation',
      'Certificate of Origin',
      'Commercial Invoice',
      'Packing List',
      'Insurance certificates'
    ],
    active: true,
    orders: 156,
    revenue: 45600,
    rating: 4.8,
    lastUpdated: '2024-08-15'
  },
  {
    id: 2,
    name: 'Truck Services',
    description: 'Reliable ground transportation for your cargo',
    category: 'Transportation',
    icon: Truck,
    price: {
      min: 150,
      max: 800,
      currency: 'USD',
      type: 'per_mile'
    },
    features: [
      'Local and long-distance transport',
      'Real-time GPS tracking',
      'Temperature-controlled options',
      'Specialized cargo handling',
      '24/7 customer support'
    ],
    active: true,
    orders: 203,
    revenue: 78900,
    rating: 4.6,
    lastUpdated: '2024-08-18'
  },
  {
    id: 3,
    name: 'Tug Boat with Barge',
    description: 'Heavy cargo transportation via water routes',
    category: 'Marine Transport',
    icon: Ship,
    price: {
      min: 2000,
      max: 8000,
      currency: 'USD',
      type: 'per_trip'
    },
    features: [
      'Heavy machinery transport',
      'Bulk cargo handling',
      'Experienced marine crew',
      'Weather monitoring',
      'Port-to-port service'
    ],
    active: true,
    orders: 47,
    revenue: 234500,
    rating: 4.9,
    lastUpdated: '2024-08-20'
  },
  {
    id: 4,
    name: 'Procurement of Export Goods',
    description: 'Source and procure goods for international export',
    category: 'Procurement',
    icon: Package,
    price: {
      min: 500,
      max: 5000,
      currency: 'USD',
      type: 'per_order'
    },
    features: [
      'Global supplier network',
      'Quality assurance',
      'Competitive pricing',
      'Compliance verification',
      'Logistics coordination'
    ],
    active: true,
    orders: 89,
    revenue: 167800,
    rating: 4.7,
    lastUpdated: '2024-08-12'
  },
  {
    id: 5,
    name: 'Freight Forwarding',
    description: 'Comprehensive freight forwarding solutions',
    category: 'Logistics',
    icon: Navigation,
    price: {
      min: 300,
      max: 2000,
      currency: 'USD',
      type: 'per_shipment'
    },
    features: [
      'Air and sea freight',
      'Customs clearance',
      'Insurance options',
      'Multi-modal transport',
      'End-to-end tracking'
    ],
    active: true,
    orders: 312,
    revenue: 298700,
    rating: 4.8,
    lastUpdated: '2024-08-19'
  },
  {
    id: 6,
    name: 'Warehousing',
    description: 'Secure storage and inventory management',
    category: 'Storage',
    icon: Warehouse,
    price: {
      min: 50,
      max: 200,
      currency: 'USD',
      type: 'per_month'
    },
    features: [
      'Climate-controlled storage',
      'Inventory management',
      'Pick and pack services',
      'Security monitoring',
      'Flexible terms'
    ],
    active: true,
    orders: 178,
    revenue: 67400,
    rating: 4.5,
    lastUpdated: '2024-08-16'
  },
  {
    id: 7,
    name: 'Custom Clearing',
    description: 'Expert customs clearance and compliance',
    category: 'Compliance',
    icon: FileText,
    price: {
      min: 100,
      max: 400,
      currency: 'USD',
      type: 'per_clearance'
    },
    features: [
      'Import/export clearance',
      'Duty calculation',
      'Compliance verification',
      'Document preparation',
      'Regulatory updates'
    ],
    active: false,
    orders: 124,
    revenue: 34200,
    rating: 4.4,
    lastUpdated: '2024-07-28'
  }
]

export default function AdminServices() {
  const [selectedService, setSelectedService] = useState<number | null>(null)

  const totalOrders = mockServices.reduce((sum, service) => sum + service.orders, 0)
  const totalRevenue = mockServices.reduce((sum, service) => sum + service.revenue, 0)
  const activeServices = mockServices.filter(service => service.active).length
  const avgRating = mockServices.reduce((sum, service) => sum + service.rating, 0) / mockServices.length

  const toggleServiceStatus = (serviceId: number) => {
    // In a real app, this would make an API call
    console.log(`Toggle service ${serviceId}`)
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
              </p>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </button>
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
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{totalOrders.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">${totalRevenue.toLocaleString()}</p>
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockServices.map((service, index) => {
            const ServiceIcon = service.icon
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
                        <p className="text-sm text-gray-500">{service.category}</p>
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
                              <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </button>
                              <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Service
                              </button>
                              <button className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
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
                      <p className="text-sm font-medium text-gray-600">Price Range</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${service.price.min}-${service.price.max}
                      </p>
                      <p className="text-xs text-gray-500">{service.price.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Orders</p>
                      <p className="text-lg font-semibold text-gray-900">{service.orders}</p>
                      <p className="text-xs text-gray-500">total</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Revenue</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${service.revenue.toLocaleString()}
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
      </div>
    </div>
  )
}