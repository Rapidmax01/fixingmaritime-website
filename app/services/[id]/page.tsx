'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Phone, Mail, MessageSquare, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

// This would typically come from a database or API
const servicesData = {
  documentation: {
    name: 'Documentation Services',
    description: 'Complete documentation solutions for all your maritime needs',
    longDescription: 'Our comprehensive documentation services handle all aspects of maritime paperwork, ensuring compliance with international regulations while expediting the entire process. We work with experienced professionals who understand the complexities of maritime documentation.',
    icon: '📄',
    features: [
      'Bill of Lading preparation and management',
      'Customs documentation and declarations',
      'Certificate of Origin processing',
      'Commercial invoices and packing lists',
      'Insurance documentation and claims',
      'Letter of Credit documentation',
      'Phytosanitary certificates',
      'Dangerous goods declarations',
    ],
    process: [
      'Submit your documentation requirements',
      'Our experts review and prepare documents',
      'Quality check and compliance verification',
      'Digital delivery of completed documents',
    ],
    pricing: {
      basic: { name: 'Basic Package', price: 150, features: ['Up to 5 documents', 'Standard processing (3-5 days)', 'Email support'] },
      professional: { name: 'Professional', price: 300, features: ['Up to 15 documents', 'Express processing (1-2 days)', 'Priority support', 'Document storage'] },
      enterprise: { name: 'Enterprise', price: 'Custom', features: ['Unlimited documents', 'Same-day processing', 'Dedicated account manager', 'API integration'] },
    },
  },
  truck: {
    name: 'Truck Services',
    description: 'Reliable ground transportation for cargo delivery',
    longDescription: 'Our modern fleet of trucks provides seamless land transportation for your cargo. With real-time GPS tracking, experienced drivers, and a commitment to safety, we ensure your goods reach their destination on time and in perfect condition.',
    icon: '🚛',
    features: [
      'Full truckload (FTL) services',
      'Less than truckload (LTL) options',
      'Real-time GPS tracking',
      'Temperature-controlled transport',
      'Hazmat certified drivers',
      'Door-to-door delivery',
      'Cross-border transportation',
      'Dedicated fleet options',
    ],
    process: [
      'Request a quote with cargo details',
      'Receive competitive pricing',
      'Schedule pickup at your convenience',
      'Track your shipment in real-time',
    ],
    pricing: {
      basic: { name: 'LTL Shipping', price: '$0.50/mile', features: ['Shared truck space', 'Standard delivery', 'Basic tracking'] },
      professional: { name: 'FTL Shipping', price: '$2.50/mile', features: ['Dedicated truck', 'Express delivery', 'Real-time tracking', 'Insurance included'] },
      enterprise: { name: 'Dedicated Fleet', price: 'Custom', features: ['Dedicated trucks', 'Custom routes', 'Priority service', 'Fleet management'] },
    },
  },
  tugboat: {
    name: 'Tug Boat & Barge',
    description: 'Professional marine transportation services',
    longDescription: 'Our tug boat and barge services provide efficient marine transportation for oversized cargo, bulk materials, and special projects. With experienced crews and modern equipment, we handle complex marine logistics with precision.',
    icon: '🚢',
    features: [
      'Harbor towing services',
      'Ocean towing capabilities',
      'Barge transportation',
      'Project cargo handling',
      'Emergency response services',
      'Salvage operations',
      'Heavy lift capabilities',
      'Offshore support',
    ],
    process: [
      'Project consultation and planning',
      'Route and equipment selection',
      'Permits and clearances',
      'Safe execution and delivery',
    ],
    pricing: {
      basic: { name: 'Harbor Towing', price: 'From $5,000', features: ['Local harbor services', 'Standard equipment', 'Basic insurance'] },
      professional: { name: 'Coastal Towing', price: 'From $25,000', features: ['Coastal operations', 'Specialized equipment', 'Comprehensive insurance'] },
      enterprise: { name: 'Project Cargo', price: 'Custom Quote', features: ['Complex projects', 'Multiple vessels', 'Full project management'] },
    },
  },
  procurement: {
    name: 'Procurement Services',
    description: 'Expert sourcing of export goods',
    longDescription: 'We help you source quality products from verified suppliers worldwide. Our procurement experts leverage extensive networks to ensure competitive pricing, quality assurance, and reliable delivery.',
    icon: '📦',
    features: [
      'Supplier verification and vetting',
      'Quality control inspections',
      'Price negotiations',
      'Sample procurement',
      'Factory audits',
      'Product sourcing',
      'Compliance verification',
      'Supply chain optimization',
    ],
    process: [
      'Submit product requirements',
      'Supplier identification and vetting',
      'Sample approval and quality check',
      'Order placement and monitoring',
    ],
    pricing: {
      basic: { name: 'Basic Sourcing', price: '5% commission', features: ['Product sourcing', 'Basic QC', 'Standard support'] },
      professional: { name: 'Managed Procurement', price: '8% commission', features: ['Full procurement', 'Comprehensive QC', 'Factory audits', 'Priority support'] },
      enterprise: { name: 'Strategic Partnership', price: 'Custom', features: ['Dedicated team', 'Strategic sourcing', 'Full supply chain management'] },
    },
  },
  freight: {
    name: 'Freight Forwarding',
    description: 'Global shipping solutions',
    longDescription: 'Our freight forwarding services optimize your supply chain with multimodal transportation options. We handle the complexities of international shipping, ensuring cost-effective and timely delivery worldwide.',
    icon: '🌐',
    features: [
      'Ocean freight (FCL/LCL)',
      'Air freight services',
      'Multimodal transport',
      'Customs brokerage',
      'Cargo insurance',
      'Door-to-door delivery',
      'Consolidation services',
      'Project logistics',
    ],
    process: [
      'Shipping consultation',
      'Route and mode optimization',
      'Booking and documentation',
      'Shipment tracking and delivery',
    ],
    pricing: {
      basic: { name: 'LCL Shipping', price: 'From $50/CBM', features: ['Shared container', 'Port-to-port', 'Basic tracking'] },
      professional: { name: 'FCL Shipping', price: 'From $2,000/container', features: ['Full container', 'Door-to-door option', 'Real-time tracking'] },
      enterprise: { name: 'Contract Rates', price: 'Custom', features: ['Volume discounts', 'Dedicated support', 'Custom solutions'] },
    },
  },
  warehousing: {
    name: 'Warehousing',
    description: 'Secure storage solutions',
    longDescription: 'Our state-of-the-art warehousing facilities provide secure, climate-controlled storage with advanced inventory management systems. We offer flexible storage solutions tailored to your specific needs.',
    icon: '🏭',
    features: [
      'Climate-controlled storage',
      'Real-time inventory management',
      'Pick and pack services',
      'Cross-docking',
      'Distribution services',
      '24/7 security monitoring',
      'WMS integration',
      'Value-added services',
    ],
    process: [
      'Storage needs assessment',
      'Space allocation and setup',
      'Inventory receipt and management',
      'Distribution as required',
    ],
    pricing: {
      basic: { name: 'Pallet Storage', price: '$5/pallet/month', features: ['Basic storage', 'Monthly reporting', 'Standard security'] },
      professional: { name: 'Managed Storage', price: '$15/pallet/month', features: ['Climate control', 'Inventory management', 'Pick & pack services'] },
      enterprise: { name: 'Dedicated Facility', price: 'Custom', features: ['Dedicated space', 'Custom solutions', 'Full integration'] },
    },
  },
  customs: {
    name: 'Custom Clearing',
    description: 'Expert customs clearance services',
    longDescription: 'Navigate complex customs regulations with our experienced team. We ensure smooth clearance and compliance with all import/export requirements, minimizing delays and optimizing duty payments.',
    icon: '✅',
    features: [
      'Import/export clearance',
      'Tariff classification',
      'Duty optimization',
      'Compliance consulting',
      'Documentation review',
      'Customs audit support',
      'Trade agreement utilization',
      'Regulatory updates',
    ],
    process: [
      'Document collection and review',
      'Classification and valuation',
      'Customs submission',
      'Clearance and delivery coordination',
    ],
    pricing: {
      basic: { name: 'Standard Clearance', price: 200, features: ['Basic clearance', 'Standard processing', 'Email support'] },
      professional: { name: 'Express Clearance', price: 400, features: ['Priority clearance', 'Express processing', 'Duty optimization', 'Phone support'] },
      enterprise: { name: 'Managed Services', price: 'Custom', features: ['Dedicated team', 'Compliance management', 'Full integration'] },
    },
  },
}

export default function ServiceDetail() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedPlan, setSelectedPlan] = useState<string>('professional')
  const [quantity, setQuantity] = useState(1)

  const serviceId = params.id as string
  const service = servicesData[serviceId as keyof typeof servicesData]

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Service not found</h1>
          <Link href="/services" className="mt-4 text-primary-600 hover:text-primary-700">
            Back to services
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!session) {
      router.push('/login')
      return
    }

    // Add to cart logic here
    toast.success('Service added to cart!')
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-700 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center text-sm text-white hover:text-gray-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to services
          </Link>
          
          <div className="mt-8 flex items-center">
            <span className="text-6xl mr-6">{service.icon}</span>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {service.name}
              </h1>
              <p className="mt-4 text-xl text-gray-100">
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
              <p className="mt-4 text-lg text-gray-600">
                {service.longDescription}
              </p>

              <h3 className="mt-12 text-xl font-bold text-gray-900">Key Features</h3>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {service.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="ml-3 text-gray-600">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <h3 className="mt-12 text-xl font-bold text-gray-900">How It Works</h3>
              <div className="mt-6 space-y-4">
                {service.process.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <span className="ml-4 text-gray-600">{step}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Pricing Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-xl font-bold text-gray-900">Pricing Plans</h3>
              <div className="mt-6 space-y-4">
                {Object.entries(service.pricing).map(([key, plan]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`cursor-pointer rounded-lg border-2 p-6 transition-all ${
                      selectedPlan === key
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPlan(key)}
                  >
                    <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                          <span className="ml-2 text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <button
                onClick={handleAddToCart}
                className="mt-6 flex w-full items-center justify-center rounded-md bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </button>

              <div className="mt-8 rounded-lg bg-gray-50 p-6">
                <h4 className="font-semibold text-gray-900">Need Help?</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Our experts are here to help you choose the right plan.
                </p>
                <div className="mt-4 space-y-3">
                  <a href="tel:+15551234567" className="flex items-center text-sm text-primary-600 hover:text-primary-700">
                    <Phone className="mr-2 h-4 w-4" />
                    +1 (555) 123-4567
                  </a>
                  <a href="mailto:sales@fixingmaritime.com" className="flex items-center text-sm text-primary-600 hover:text-primary-700">
                    <Mail className="mr-2 h-4 w-4" />
                    sales@fixingmaritime.com
                  </a>
                  <Link href="/contact" className="flex items-center text-sm text-primary-600 hover:text-primary-700">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Live Chat
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}