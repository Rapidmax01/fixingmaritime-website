'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, FileText, Truck, Ship, Package, Globe, Warehouse, FileCheck, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useContent } from '@/contexts/ContentContext'

const services = [
  {
    id: 'documentation',
    name: 'Documentation Services',
    description: 'Complete documentation solutions for all your maritime needs',
    longDescription: 'Our documentation services handle all aspects of maritime paperwork, from bills of lading to customs declarations. We ensure compliance with international regulations and expedite the documentation process.',
    icon: FileText,
    features: [
      'Bill of Lading preparation',
      'Customs documentation',
      'Certificate of Origin',
      'Commercial invoices',
      'Packing lists',
      'Insurance documentation',
    ],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'truck-services',
    name: 'Truck Services',
    description: 'Reliable ground transportation for cargo delivery',
    longDescription: 'Our fleet of modern trucks provides seamless land transportation for your cargo. With GPS tracking and experienced drivers, we ensure timely and safe delivery.',
    icon: Truck,
    features: [
      'Full truckload (FTL) services',
      'Less than truckload (LTL) options',
      'Real-time GPS tracking',
      'Temperature-controlled transport',
      'Hazmat certified drivers',
      'Door-to-door delivery',
    ],
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'tugboat-barge',
    name: 'Tug Boat & Barge',
    description: 'Professional marine transportation services',
    longDescription: 'Our tug boat and barge services provide efficient marine transportation for oversized cargo, bulk materials, and special projects along coastal and inland waterways.',
    icon: Ship,
    features: [
      'Harbor towing services',
      'Ocean towing capabilities',
      'Barge transportation',
      'Project cargo handling',
      'Emergency response',
      'Salvage operations',
    ],
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'procurement',
    name: 'Procurement Services',
    description: 'Expert sourcing of export goods',
    longDescription: 'We help you source quality products from verified suppliers worldwide. Our procurement experts ensure competitive pricing and quality assurance.',
    icon: Package,
    features: [
      'Supplier verification',
      'Quality control inspections',
      'Price negotiations',
      'Sample procurement',
      'Factory audits',
      'Product sourcing',
    ],
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'freight-forwarding',
    name: 'Freight Forwarding',
    description: 'Global shipping solutions',
    longDescription: 'Our freight forwarding services optimize your supply chain with multimodal transportation options, ensuring cost-effective and timely delivery worldwide.',
    icon: Globe,
    features: [
      'Ocean freight (FCL/LCL)',
      'Air freight services',
      'Multimodal transport',
      'Customs brokerage',
      'Cargo insurance',
      'Door-to-door delivery',
    ],
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'warehousing',
    name: 'Warehousing',
    description: 'Secure storage solutions',
    longDescription: 'Our state-of-the-art warehousing facilities provide secure, climate-controlled storage with advanced inventory management systems.',
    icon: Warehouse,
    features: [
      'Climate-controlled storage',
      'Inventory management',
      'Pick and pack services',
      'Cross-docking',
      'Distribution services',
      '24/7 security monitoring',
    ],
    color: 'from-teal-500 to-green-500',
  },
  {
    id: 'custom-clearing',
    name: 'Custom Clearing',
    description: 'Expert customs clearance services',
    longDescription: 'Navigate complex customs regulations with our experienced team. We ensure smooth clearance and compliance with all import/export requirements.',
    icon: FileCheck,
    features: [
      'Import/export clearance',
      'Tariff classification',
      'Duty optimization',
      'Compliance consulting',
      'Documentation review',
      'Customs audit support',
    ],
    color: 'from-rose-500 to-pink-500',
  },
]

export default function Services() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { content, loading } = useContent()

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-700 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {loading ? 'Our Maritime Services' : (content?.sections?.services?.title || 'Our Maritime Services')}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-100">
              {loading ? (
                'Comprehensive solutions for all your maritime logistics needs'
              ) : (
                content?.sections?.services?.content || 'Comprehensive solutions for all your maritime logistics needs'
              )}
            </p>
          </div>

          {/* Search Bar */}
          <div className="mx-auto mt-10 max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-0 py-3 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600"
                placeholder="Search services..."
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <Link href={`/services/${service.id}`} className="block">
                  <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    
                    <h3 className="mt-6 text-xl font-semibold text-gray-900">
                      {service.name}
                    </h3>
                    
                    <p className="mt-3 text-gray-600">
                      {service.longDescription}
                    </p>

                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-900">Key Features:</h4>
                      <ul className="mt-3 space-y-2">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 text-primary-600">•</span>
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary-600">
                        Request for Quote
                      </span>
                      <div className="inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700">
                        Get Quote
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">
            Need a custom solution?
          </h2>
          <p className="mt-4 text-lg text-gray-100">
            Contact our team to discuss your specific requirements
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary-600 shadow-sm hover:bg-gray-100"
          >
            Get in touch
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}