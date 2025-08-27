'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, MapPin, Clock, CheckCircle, Truck, Ship, Package, AlertCircle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

// Mock tracking data
const mockTrackingData = {
  'TRK-DOC-001': {
    orderNumber: 'ORD-2024-001',
    service: 'Documentation Services',
    status: 'completed',
    estimatedDelivery: '2024-08-15',
    currentLocation: 'Delivered',
    events: [
      {
        id: 1,
        status: 'Order Placed',
        location: 'Customer Portal',
        timestamp: '2024-08-12 09:00:00',
        description: 'Documentation service order has been placed and confirmed.',
        icon: Package,
      },
      {
        id: 2,
        status: 'Processing Started',
        location: 'Documentation Center',
        timestamp: '2024-08-12 14:30:00',
        description: 'Our team has started processing your documents.',
        icon: Clock,
      },
      {
        id: 3,
        status: 'Documents Prepared',
        location: 'Quality Control',
        timestamp: '2024-08-14 11:00:00',
        description: 'All documents have been prepared and are undergoing quality review.',
        icon: CheckCircle,
      },
      {
        id: 4,
        status: 'Completed',
        location: 'Digital Delivery',
        timestamp: '2024-08-15 16:45:00',
        description: 'Documents have been delivered digitally to your email.',
        icon: CheckCircle,
      },
    ],
  },
  'TRK-FRT-002': {
    orderNumber: 'ORD-2024-002',
    service: 'Freight Forwarding',
    status: 'in_transit',
    estimatedDelivery: '2024-08-25',
    currentLocation: 'Pacific Ocean - En Route to Los Angeles',
    events: [
      {
        id: 1,
        status: 'Order Confirmed',
        location: 'Singapore Port',
        timestamp: '2024-08-18 08:00:00',
        description: 'Freight forwarding order confirmed and cargo received.',
        icon: Package,
      },
      {
        id: 2,
        status: 'Loaded on Vessel',
        location: 'Singapore Port Terminal 3',
        timestamp: '2024-08-19 15:30:00',
        description: 'Container loaded onto vessel MV Pacific Star.',
        icon: Ship,
      },
      {
        id: 3,
        status: 'Departed Singapore',
        location: 'Singapore Strait',
        timestamp: '2024-08-19 22:00:00',
        description: 'Vessel has departed Singapore and is en route to Los Angeles.',
        icon: Ship,
      },
      {
        id: 4,
        status: 'In Transit',
        location: 'Pacific Ocean',
        timestamp: '2024-08-20 12:00:00',
        description: 'Currently sailing across the Pacific Ocean. ETA: August 25th.',
        icon: Ship,
      },
    ],
  },
  'TRK-WHS-003': {
    orderNumber: 'ORD-2024-003',
    service: 'Warehousing',
    status: 'processing',
    estimatedDelivery: 'Ongoing Storage',
    currentLocation: 'Warehouse Facility A-12',
    events: [
      {
        id: 1,
        status: 'Goods Received',
        location: 'Warehouse Reception',
        timestamp: '2024-08-20 10:00:00',
        description: 'Your goods have been received and checked into our warehouse.',
        icon: Package,
      },
      {
        id: 2,
        status: 'Storage Allocated',
        location: 'Warehouse Section A-12',
        timestamp: '2024-08-20 14:00:00',
        description: 'Storage space has been allocated in climate-controlled section.',
        icon: CheckCircle,
      },
    ],
  },
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-100'
    case 'in_transit':
      return 'text-blue-600 bg-blue-100'
    case 'processing':
      return 'text-yellow-600 bg-yellow-100'
    case 'cancelled':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

function TrackOrderContent() {
  const searchParams = useSearchParams()
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get('order') || '')
  const [trackingData, setTrackingData] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number')
      return
    }

    setIsSearching(true)
    setError('')

    try {
      // Try real API first
      const response = await fetch(`/api/track?number=${encodeURIComponent(trackingNumber.trim())}`)
      
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          // Transform API response to match expected format
          const data = result.data
          const transformedData = {
            type: data.type,
            orderNumber: data.trackingNumber || data.id,
            service: data.service,
            status: data.status,
            currentLocation: data.status === 'in_transit' ? 'En Route' : data.status,
            customer: data.customer,
            pickupAddress: data.pickup?.address,
            deliveryAddress: data.delivery?.address,
            cargoType: data.cargo?.type,
            events: data.events || []
          }
          setTrackingData(transformedData)
          return
        }
      }
      
      // Fall back to mock data for demo purposes
      const mockData = mockTrackingData[trackingNumber as keyof typeof mockTrackingData]
      if (mockData) {
        setTrackingData(mockData)
      } else {
        setError('Tracking number not found. Please check and try again.')
        setTrackingData(null)
      }
    } catch (error) {
      console.error('Error fetching tracking data:', error)
      // Fall back to mock data on error
      const mockData = mockTrackingData[trackingNumber as keyof typeof mockTrackingData]
      if (mockData) {
        setTrackingData(mockData)
      } else {
        setError('Unable to connect to tracking service. Please check your connection and try again.')
        setTrackingData(null)
      }
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-primary-900 py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)' 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/85 to-primary-900/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Track Your Order
            </h1>
            <p className="mt-4 text-lg text-gray-100">
              Enter your tracking number to get real-time updates on your shipment
            </p>
          </div>

          {/* Search Bar */}
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                  placeholder="Enter tracking number (e.g., TRK-DOC-001)"
                  className="block w-full rounded-md border-0 py-3 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                onClick={handleSearch}
                disabled={!trackingNumber || isSearching}
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? 'Searching...' : 'Track'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-md bg-red-50 p-4"
          >
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {trackingData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {trackingData.type === 'truck_request' ? 'Request Number' : 'Order Number'}
                  </h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{trackingData.orderNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Service</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{trackingData.service}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(trackingData.status)}`}>
                    {trackingData.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {trackingData.type === 'truck_request' ? 'Customer' : 'Current Location'}
                  </h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {trackingData.type === 'truck_request' ? trackingData.customer : (trackingData.currentLocation || 'Processing')}
                  </p>
                </div>
              </div>
              
              {/* Additional info for truck requests */}
              {trackingData.type === 'truck_request' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Pickup Address</h3>
                      <p className="mt-1 text-sm text-gray-900">{trackingData.pickupAddress}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Delivery Address</h3>
                      <p className="mt-1 text-sm text-gray-900">{trackingData.deliveryAddress}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Cargo Type</h3>
                      <p className="mt-1 text-sm text-gray-900">{trackingData.cargoType}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Tracking History</h2>
              
              <div className="flow-root">
                <ul className="-mb-8">
                  {trackingData.events.map((event: any, eventIdx: number) => {
                    // Map icon string to actual icon component
                    const getIconComponent = (iconName: string) => {
                      switch (iconName) {
                        case 'Package':
                          return Package
                        case 'Clock':
                          return Clock
                        case 'CheckCircle':
                          return CheckCircle
                        case 'Truck':
                          return Truck
                        case 'Ship':
                          return Ship
                        case 'XCircle':
                          return XCircle
                        default:
                          return Package
                      }
                    }
                    
                    const Icon = typeof event.icon === 'string' ? getIconComponent(event.icon) : event.icon
                    const isLast = eventIdx === trackingData.events.length - 1
                    const isCompleted = eventIdx < trackingData.events.length - (trackingData.status === 'completed' || trackingData.status === 'delivered' ? 0 : 1)
                    
                    return (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {!isLast && (
                            <span
                              className={`absolute left-4 top-4 -ml-px h-full w-0.5 ${
                                isCompleted ? 'bg-primary-600' : 'bg-gray-200'
                              }`}
                              aria-hidden="true"
                            />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span
                                className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                  isCompleted ? 'bg-primary-600' : 'bg-gray-400'
                                }`}
                              >
                                <Icon className="h-4 w-4 text-white" aria-hidden="true" />
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{event.status}</p>
                                <p className="text-sm text-gray-500">{event.description}</p>
                                <div className="flex items-center mt-2 text-xs text-gray-400">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {event.location}
                                </div>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                <time dateTime={event.timestamp}>
                                  {new Date(event.timestamp).toLocaleDateString()} <br />
                                  {new Date(event.timestamp).toLocaleTimeString()}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>

            {/* Next Steps */}
            {trackingData.status !== 'completed' && trackingData.status !== 'delivered' && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">What's Next?</h3>
                {trackingData.type === 'truck_request' && (
                  <>
                    {trackingData.status === 'pending' && (
                      <p className="text-blue-800">
                        Your truck request is being reviewed by our operations team. We'll contact you within 2 hours with availability and quote.
                      </p>
                    )}
                    {trackingData.status === 'confirmed' && (
                      <p className="text-blue-800">
                        Your truck request has been confirmed. A driver will be assigned shortly and you'll receive their details.
                      </p>
                    )}
                    {trackingData.status === 'assigned' && (
                      <p className="text-blue-800">
                        A truck has been assigned to your request. The driver will contact you before pickup.
                      </p>
                    )}
                    {trackingData.status === 'in_transit' && (
                      <p className="text-blue-800">
                        Your cargo is currently in transit from {trackingData.pickupAddress} to {trackingData.deliveryAddress}.
                      </p>
                    )}
                  </>
                )}
                {trackingData.type === 'order' && (
                  <>
                    {trackingData.status === 'in_transit' && (
                      <p className="text-blue-800">
                        Your shipment is currently in transit. We'll update you when it reaches the next checkpoint.
                        {trackingData.estimatedDelivery && ` Estimated delivery: ${trackingData.estimatedDelivery}`}
                      </p>
                    )}
                    {trackingData.status === 'processing' && (
                      <p className="text-blue-800">
                        Your order is being processed by our team. You'll receive an update once the next step is completed.
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Demo Tracking Numbers */}
        {!trackingData && !error && (
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Try these demo tracking numbers:</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {Object.keys(mockTrackingData).map((trackingNum) => (
                <button
                  key={trackingNum}
                  onClick={() => {
                    setTrackingNumber(trackingNum)
                    setTimeout(() => handleSearch(), 100)
                  }}
                  className="text-sm bg-white px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow text-primary-600 hover:text-primary-700"
                >
                  {trackingNum}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TrackOrder() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <TrackOrderContent />
    </Suspense>
  )
}