import { Anchor, Handshake, Globe, Shield, Truck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Partners() {
  const partners = [
    {
      name: 'Global Shipping Alliance',
      type: 'Shipping Line',
      logo: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=100&q=80',
      description: 'Leading container shipping services across major trade routes.'
    },
    {
      name: 'Port Authority Network',
      type: 'Port Operations',
      logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=100&q=80',
      description: 'Strategic partnerships with major ports worldwide.'
    },
    {
      name: 'TruckLogistics Pro',
      type: 'Land Transport',
      logo: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=100&q=80',
      description: 'Comprehensive trucking and inland transportation services.'
    },
    {
      name: 'Maritime Insurance Group',
      type: 'Insurance',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=100&q=80',
      description: 'Specialized maritime and cargo insurance solutions.'
    }
  ]

  const benefits = [
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Access to our worldwide network spanning 50+ countries and major trade routes.'
    },
    {
      icon: Shield,
      title: 'Reliable Partnership',
      description: 'Proven track record of successful collaborations and mutual growth.'
    },
    {
      icon: Truck,
      title: 'Comprehensive Services',
      description: 'End-to-end logistics solutions covering all aspects of maritime trade.'
    },
    {
      icon: Handshake,
      title: 'Mutual Success',
      description: 'Partnerships designed for shared success and long-term growth.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-700 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-gray-200 mb-4">
              <Anchor className="h-8 w-8" />
              <span className="text-xl font-bold">Fixing Maritime</span>
            </Link>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Our Partners
            </h1>
            <p className="mt-4 text-lg text-gray-100">
              Building strong relationships for better maritime logistics
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Partnership Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Why Partner With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-lg mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Current Partners */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Trusted Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <Image 
                      src={partner.logo} 
                      alt={partner.name}
                      width={80}
                      height={48}
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
                      <span className="text-sm bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                        {partner.type}
                      </span>
                    </div>
                    <p className="text-gray-600">{partner.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Partnership Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Partners</h3>
              <p className="text-gray-600 mb-4">
                Join our network of logistics service providers including trucking companies, warehouses, and customs brokers.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Revenue sharing opportunities</li>
                <li>• Access to our client base</li>
                <li>• Joint marketing initiatives</li>
                <li>• Technology integration support</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Technology Partners</h3>
              <p className="text-gray-600 mb-4">
                Collaborate with us to develop innovative maritime technology solutions and digital platforms.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• API integration opportunities</li>
                <li>• Co-development projects</li>
                <li>• Technical support and resources</li>
                <li>• Market expansion support</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Strategic Alliances</h3>
              <p className="text-gray-600 mb-4">
                Form strategic alliances for market expansion, joint ventures, and collaborative growth initiatives.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Market expansion opportunities</li>
                <li>• Joint venture possibilities</li>
                <li>• Shared resources and expertise</li>
                <li>• Long-term growth partnerships</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-lg shadow-sm p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Partner With Us?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Let's explore how we can work together to create value and drive growth in maritime logistics.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Contact Partnership Team
            </Link>
            <button className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Download Partnership Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}