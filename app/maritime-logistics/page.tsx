import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Ship, Truck, Package, Globe, CheckCircle, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Maritime Logistics Solutions Nigeria | Shipping & Logistics Services',
  description: 'Professional maritime logistics services in Nigeria. Complete logistics solutions including shipping, cargo handling, documentation, and transportation. Your trusted maritime partner.',
  keywords: 'maritime logistics, logistics Nigeria, maritime solution, shipping logistics, cargo logistics, Nigeria logistics services, maritime transportation, freight logistics',
  alternates: {
    canonical: '/maritime-logistics',
  },
}

export default function MaritimeLogisticsPage() {
  const services = [
    {
      title: 'Complete Maritime Solutions',
      description: 'End-to-end maritime logistics services tailored for Nigerian businesses',
      icon: Ship,
    },
    {
      title: 'Integrated Logistics Network',
      description: 'Seamless logistics coordination from port to final destination',
      icon: Globe,
    },
    {
      title: 'Cargo Management',
      description: 'Professional handling of all cargo types with real-time tracking',
      icon: Package,
    },
    {
      title: 'Transportation & Distribution',
      description: 'Reliable logistics and distribution across Nigeria',
      icon: Truck,
    },
  ]

  const benefits = [
    'Expert maritime logistics management',
    'Real-time cargo tracking and updates',
    'Competitive logistics pricing',
    'Professional documentation handling',
    'Customs clearance expertise',
    'Nationwide logistics network',
    'Emergency logistics support 24/7',
    'Dedicated logistics coordinators',
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-primary-700 text-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Maritime Logistics Solutions in Nigeria
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Your trusted partner for comprehensive maritime and logistics services. 
              We provide complete shipping solutions, cargo management, and logistics coordination 
              throughout Nigeria.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/contact"
                className="rounded-md bg-white px-6 py-3 text-base font-semibold text-blue-900 shadow-sm hover:bg-blue-50 transition-colors"
              >
                Get Logistics Quote
              </Link>
              <Link
                href="/services"
                className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Maritime Logistics Services
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div
                  key={index}
                  className="relative bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <Icon className="h-12 w-12 text-primary-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Why Choose Our Maritime Logistics?
              </h2>
              <p className="text-gray-600 mb-8">
                With over 25 years of experience in maritime logistics, we understand the unique 
                challenges of shipping and logistics in Nigeria. Our comprehensive solutions ensure 
                your cargo reaches its destination safely and on time.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Get Started Today</h3>
              <p className="text-gray-700 mb-6">
                Experience seamless maritime logistics with Nigeria's trusted shipping partner. 
                Contact us for customized logistics solutions.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Request Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="mt-6 pt-6 border-t border-primary-100">
                <p className="text-sm text-gray-600 mb-2">Need immediate assistance?</p>
                <a href="tel:+234XXXXXXXXX" className="flex items-center gap-2 text-primary-600 font-semibold">
                  <Phone className="h-4 w-4" />
                  Call us now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">
            Leading Maritime Logistics Provider in Nigeria
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              Fixing Maritime stands as Nigeria's premier maritime logistics company, offering 
              comprehensive shipping and logistics solutions across the nation. Our maritime 
              expertise spans cargo handling, vessel operations, and integrated logistics management.
            </p>
            <p className="mt-4">
              As a full-service logistics provider, we handle everything from port operations 
              to final delivery. Our maritime solutions include freight forwarding, customs 
              clearance, warehousing, and distribution - making us your one-stop logistics partner.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">
              Our Logistics Capabilities
            </h3>
            <ul>
              <li>International shipping and maritime freight</li>
              <li>Port logistics and cargo handling</li>
              <li>Inland transportation and distribution</li>
              <li>Supply chain management solutions</li>
              <li>Maritime documentation and compliance</li>
              <li>Real-time logistics tracking systems</li>
            </ul>
            <p className="mt-4">
              Trust Fixing Maritime for all your logistics needs in Nigeria. From maritime 
              shipping to inland logistics, we deliver excellence at every step of your 
              supply chain.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Your Maritime Logistics Journey
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of satisfied clients who trust us with their shipping and logistics needs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="rounded-md bg-white px-8 py-3 text-base font-semibold text-primary-900 shadow-sm hover:bg-primary-50 transition-colors"
            >
              Get Free Quote
            </Link>
            <Link
              href="/services"
              className="rounded-md border-2 border-white px-8 py-3 text-base font-semibold text-white hover:bg-white hover:text-primary-900 transition-colors"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}