import { Anchor, MapPin, Clock, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function Careers() {
  const positions = [
    {
      title: 'Maritime Operations Manager',
      department: 'Operations',
      location: 'Port of Miami, FL',
      type: 'Full-time',
      description: 'Lead our maritime operations team and ensure seamless logistics coordination.',
      requirements: ['5+ years maritime experience', 'Operations management background', 'Strong communication skills']
    },
    {
      title: 'Freight Forwarding Specialist',
      department: 'Logistics',
      location: 'Houston, TX',
      type: 'Full-time',
      description: 'Manage international freight forwarding operations and customer relationships.',
      requirements: ['3+ years freight forwarding', 'Knowledge of customs procedures', 'Multilingual preferred']
    },
    {
      title: 'Customer Service Representative',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
      description: 'Provide exceptional support to our maritime logistics customers.',
      requirements: ['2+ years customer service', 'Maritime industry knowledge', 'Problem-solving skills']
    }
  ]

  const benefits = [
    'Competitive salary and performance bonuses',
    'Comprehensive health, dental, and vision insurance',
    'Retirement savings plan with company matching',
    'Professional development and training opportunities',
    'Flexible work arrangements',
    'Global travel opportunities'
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
              Join Our Crew
            </h1>
            <p className="mt-4 text-lg text-gray-100">
              Build your career with a leading maritime logistics company
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Why Work With Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Why Choose Fixing Maritime?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Opportunities</h3>
              <p className="text-gray-600">Advance your career in the dynamic maritime industry with clear paths for professional development.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Great Team</h3>
              <p className="text-gray-600">Work alongside experienced professionals who are passionate about maritime logistics excellence.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                <MapPin className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Impact</h3>
              <p className="text-gray-600">Make a difference in global trade and commerce through innovative maritime solutions.</p>
            </div>
          </div>
        </div>

        {/* Current Openings */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Current Openings</h2>
          <div className="space-y-6">
            {positions.map((position, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{position.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {position.department}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {position.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {position.type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{position.description}</p>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {position.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="ml-6">
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Benefits & Perks</h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Application Process */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Ready to Set Sail?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Don't see a position that fits? We're always looking for talented individuals to join our crew.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Contact HR Team
            </Link>
            <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Send General Application
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}