import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, FileCheck, Car, Package, Shield, Clock, Award, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Custom Clearing Agent Nigeria | Car Clearing Services | Import & Export',
  description: 'Professional custom clearing and car clearing services in Nigeria. Licensed customs agents for fast clearance at Nigerian ports. Expert handling of import/export documentation.',
  keywords: 'custom clearing, custom clearing agent, car clearing, custom clearing Nigeria, car clearing Nigeria, customs clearance, import clearing, export clearing, clearing agent Lagos, Nigerian customs, port clearing services',
  alternates: {
    canonical: '/custom-clearing',
  },
}

export default function CustomClearingPage() {
  const services = [
    {
      title: 'Car Clearing Services',
      description: 'Complete car clearing from all Nigerian ports with proper documentation',
      icon: Car,
      features: [
        'New and used vehicle clearing',
        'Duty calculation and payment',
        'VREG and customs documentation',
        'Inspection coordination',
      ],
    },
    {
      title: 'General Cargo Clearing',
      description: 'Expert custom clearing for all types of commercial goods',
      icon: Package,
      features: [
        'Container cargo clearing',
        'Bulk cargo documentation',
        'LCL and FCL shipments',
        'Hazardous goods clearance',
      ],
    },
    {
      title: 'Import/Export Documentation',
      description: 'Complete handling of all customs paperwork and compliance',
      icon: FileCheck,
      features: [
        'Form M processing',
        'PAAR and SGD handling',
        'Certificate of origin',
        'Pre-arrival assessment',
      ],
    },
    {
      title: 'Express Clearing Services',
      description: 'Fast-track custom clearing for urgent shipments',
      icon: Clock,
      features: [
        '24-48 hour clearance',
        'VIP customs processing',
        'Emergency clearing services',
        'Weekend operations',
      ],
    },
  ]

  const ports = [
    'Apapa Port Complex',
    'Tin Can Island Port',
    'PTML Terminal',
    'Onne Port',
    'Calabar Port',
    'Warri Port',
  ]

  const clearingProcess = [
    { step: '1', title: 'Document Submission', desc: 'Submit all required import/export documents' },
    { step: '2', title: 'Customs Assessment', desc: 'We handle customs valuation and duty assessment' },
    { step: '3', title: 'Payment Processing', desc: 'Facilitate all customs duties and charges payment' },
    { step: '4', title: 'Physical Examination', desc: 'Coordinate customs inspection when required' },
    { step: '5', title: 'Release & Delivery', desc: 'Obtain release order and arrange delivery' },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Professional Custom Clearing Services in Nigeria
            </h1>
            <p className="text-xl mb-8 text-green-100">
              Licensed custom clearing agents providing fast, reliable car clearing and cargo 
              clearance services at all Nigerian ports. Your trusted partner for hassle-free 
              customs clearance.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/contact"
                className="rounded-md bg-white px-6 py-3 text-base font-semibold text-green-900 shadow-sm hover:bg-green-50 transition-colors"
              >
                Get Clearing Quote
              </Link>
              <a
                href="tel:+234XXXXXXXXX"
                className="rounded-md bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-green-500 transition-colors inline-flex items-center gap-2"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Our Custom Clearing Services
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            From car clearing to complex commercial shipments, we handle all aspects of customs 
            clearance with expertise and efficiency.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <Icon className="h-10 w-10 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                            <Shield className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Custom Clearing Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {clearingProcess.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
                {index < clearingProcess.length - 1 && (
                  <ArrowRight className="hidden md:block h-6 w-6 text-gray-400 mx-auto mt-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ports Coverage */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Custom Clearing at All Nigerian Ports
              </h2>
              <p className="text-gray-600 mb-6">
                As licensed custom clearing agents, we operate at all major Nigerian ports, 
                ensuring fast and efficient clearance wherever your cargo arrives. Our team 
                of experienced customs brokers handles all documentation and procedures.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {ports.map((port, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">{port}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors mt-8"
              >
                Start Clearing Process <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-green-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Licensed by Nigerian Customs Service</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>25+ years clearing experience</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Fast car clearing specialist</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Transparent pricing, no hidden fees</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>24/7 customs support</span>
                </li>
              </ul>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Need urgent clearing?</p>
                <a href="tel:+234XXXXXXXXX" className="flex items-center gap-2 text-green-600 font-semibold">
                  <Phone className="h-4 w-4" />
                  Call our clearing hotline
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">
            Expert Custom Clearing Agents in Nigeria
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              Fixing Maritime is a leading custom clearing agent in Nigeria, specializing in 
              car clearing and general cargo clearance services. Our team of licensed customs 
              brokers ensures smooth, hassle-free clearing at all Nigerian ports including 
              Apapa, Tin Can Island, PTML, and Onne.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">
              Comprehensive Car Clearing Services
            </h3>
            <p>
              Our car clearing services cover both new and used vehicles, with expert handling 
              of all customs documentation, duty calculations, and VREG processing. We ensure 
              your vehicles clear customs quickly and comply with all Nigerian regulations.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">
              Custom Clearing for All Cargo Types
            </h3>
            <p>
              Beyond car clearing, we provide custom clearing services for:
            </p>
            <ul>
              <li>Commercial goods and merchandise</li>
              <li>Industrial equipment and machinery</li>
              <li>Raw materials and commodities</li>
              <li>Personal effects and household goods</li>
              <li>Specialized and project cargo</li>
            </ul>
            <p className="mt-4">
              Choose Fixing Maritime for reliable custom clearing services in Nigeria. Our 
              expertise in customs procedures, combined with strong relationships with customs 
              officials, ensures your cargo clears quickly and efficiently.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-900 text-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Clear Your Cargo?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Get professional custom clearing services from Nigeria's trusted clearing agents.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="rounded-md bg-white px-8 py-3 text-base font-semibold text-green-900 shadow-sm hover:bg-green-50 transition-colors"
            >
              Get Clearing Quote
            </Link>
            <a
              href="tel:+234XXXXXXXXX"
              className="rounded-md border-2 border-white px-8 py-3 text-base font-semibold text-white hover:bg-white hover:text-green-900 transition-colors inline-flex items-center gap-2"
            >
              <Phone className="h-4 w-4" /> Speak to Agent
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}