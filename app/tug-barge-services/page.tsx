import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Ship, Anchor, Package, Shield, MapPin, Clock, Phone } from 'lucide-react'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Tug Boat & Barge Services Nigeria | Marine Transportation | Tug & Barge Rental',
  description: 'Professional tug boat and barge services in Nigeria. Marine transportation, offshore support, harbor towage, and barge rental for oil & gas, construction, and cargo operations.',
  keywords: 'tug, barge, tug boat services, barge services, tug boat Nigeria, barge Nigeria, marine transportation, tug and barge, offshore tug, harbor tug, barge rental, marine logistics, tug boat rental',
  alternates: {
    canonical: '/tug-barge-services',
  },
}

export default function TugBargeServicesPage() {
  const services = [
    {
      title: 'Harbor Tug Services',
      description: 'Professional harbor towage and ship assist operations',
      features: [
        'Ship berthing and unberthing',
        'Harbor escort services',
        'Emergency response towing',
        'Pilot boat services',
      ],
    },
    {
      title: 'Offshore Tug Operations',
      description: 'Deep sea towing and offshore support services',
      features: [
        'Rig moving and positioning',
        'Offshore platform support',
        'Deep sea towage',
        'Salvage operations',
      ],
    },
    {
      title: 'Barge Transportation',
      description: 'Reliable barge services for bulk and project cargo',
      features: [
        'Deck cargo transportation',
        'Bulk material transport',
        'Project cargo handling',
        'Container barge services',
      ],
    },
    {
      title: 'Specialized Marine Services',
      description: 'Custom marine solutions for unique requirements',
      features: [
        'Oil & gas support',
        'Construction materials transport',
        'Heavy lift operations',
        'Marine logistics coordination',
      ],
    },
  ]

  const capabilities = [
    { metric: '50+', label: 'Tug Boats' },
    { metric: '100+', label: 'Barges' },
    { metric: '5000HP', label: 'Max Tug Power' },
    { metric: '10,000T', label: 'Max Barge Capacity' },
  ]

  const operationAreas = [
    'Lagos Port Complex',
    'Niger Delta Region',
    'Bonny Terminal',
    'Escravos Terminal',
    'Forcados Terminal',
    'Brass Terminal',
    'Qua Iboe Terminal',
    'Calabar Port',
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-700 text-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Tug Boat & Barge Services in Nigeria
            </h1>
            <p className="text-xl mb-8 text-cyan-100">
              Leading provider of tug and barge services for marine transportation, offshore 
              operations, and harbor support. Professional marine solutions for Nigeria's 
              oil & gas and maritime industries.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/contact"
                className="rounded-md bg-white px-6 py-3 text-base font-semibold text-blue-900 shadow-sm hover:bg-blue-50 transition-colors"
              >
                Request Tug/Barge Quote
              </Link>
              <a
                href="tel:+234XXXXXXXXX"
                className="rounded-md bg-cyan-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-cyan-500 transition-colors inline-flex items-center gap-2"
              >
                <Phone className="h-4 w-4" /> 24/7 Marine Support
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Capabilities */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Marine Fleet Capabilities
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {capabilities.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-cyan-600 mb-2">{item.metric}</div>
                <div className="text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Comprehensive Tug & Barge Services
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            From harbor operations to offshore projects, our tug and barge fleet delivers 
            reliable marine transportation solutions across Nigerian waters.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-start gap-4">
                  <Ship className="h-10 w-10 text-cyan-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <Anchor className="h-4 w-4 text-cyan-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operation Areas */}
      <section className="py-16 bg-cyan-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Operating Across Nigerian Waters
              </h2>
              <p className="text-gray-600 mb-6">
                Our tug and barge operations cover all major Nigerian ports and offshore 
                terminals. With strategic positioning of our marine assets, we provide 
                rapid response and reliable service throughout the region.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {operationAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-cyan-600" />
                    <span className="text-gray-700">{area}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Check Fleet Availability <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image
                src="/tug-boat.png"
                alt="Tug boat and barge operations"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Why Choose Our Tug & Barge Services?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Modern fleet with latest navigation equipment</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Experienced marine crew and operators</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>24/7 operational support and monitoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Full marine insurance coverage</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Compliance with NIMASA regulations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Competitive rates and flexible contracts</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Quick Response Team</h3>
              <p className="text-gray-600 mb-6">
                Our marine operations center provides round-the-clock support for all 
                tug and barge operations. Contact us anytime for immediate assistance.
              </p>
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">24/7 Marine Operations</p>
                  <a href="tel:+234XXXXXXXXX" className="flex items-center gap-2 text-cyan-600 font-semibold text-lg">
                    <Phone className="h-5 w-5" />
                    +234 XXX XXX XXXX
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Emergency Response</p>
                  <a href="tel:+234XXXXXXXXX" className="flex items-center gap-2 text-red-600 font-semibold text-lg">
                    <Clock className="h-5 w-5" />
                    +234 XXX XXX XXXX
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">
            Nigeria's Premier Tug & Barge Service Provider
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              Fixing Maritime operates one of Nigeria's largest and most modern tug and barge 
              fleets, providing essential marine transportation services to the oil & gas 
              industry, construction sector, and general cargo operations. Our tug boats and 
              barges are strategically positioned across Nigerian waters for rapid deployment.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">
              Professional Tug Boat Services
            </h3>
            <p>
              Our tug boat services encompass harbor towage, offshore support, and emergency 
              response operations. With tugboats ranging from 1,500HP to 5,000HP, we handle 
              vessels of all sizes in Nigerian ports and offshore locations.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">
              Versatile Barge Solutions
            </h3>
            <p>
              Our barge fleet includes flat-top barges, tank barges, and specialized barges 
              for project cargo. Whether you need to transport construction materials, oil & 
              gas equipment, or general cargo, our barges provide safe and efficient marine 
              transportation.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">
              Industries We Serve
            </h3>
            <ul>
              <li>Oil & Gas exploration and production</li>
              <li>Marine construction and dredging</li>
              <li>Port and terminal operations</li>
              <li>Offshore wind and renewable energy</li>
              <li>Heavy industry and infrastructure</li>
            </ul>
            <p className="mt-4">
              Trust Fixing Maritime for all your tug and barge requirements in Nigeria. Our 
              commitment to safety, reliability, and operational excellence makes us the 
              preferred marine service provider for major projects across the region.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-cyan-900 to-blue-900 text-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need Tug or Barge Services?
          </h2>
          <p className="text-xl mb-8 text-cyan-100">
            Get reliable marine transportation solutions from Nigeria's trusted tug and barge operator.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="rounded-md bg-white px-8 py-3 text-base font-semibold text-cyan-900 shadow-sm hover:bg-cyan-50 transition-colors"
            >
              Get Fleet Quote
            </Link>
            <a
              href="tel:+234XXXXXXXXX"
              className="rounded-md border-2 border-white px-8 py-3 text-base font-semibold text-white hover:bg-white hover:text-cyan-900 transition-colors inline-flex items-center gap-2"
            >
              <Phone className="h-4 w-4" /> Call Marine Ops
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}