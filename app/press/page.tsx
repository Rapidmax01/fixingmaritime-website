import { Anchor, Calendar, Download, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function Press() {
  const pressReleases = [
    {
      title: 'Fixing Maritime Expands Global Network with New Asian Partnerships',
      date: 'August 15, 2024',
      excerpt: 'Strategic partnerships with major Asian ports strengthen our commitment to global maritime logistics excellence.',
      category: 'Partnership'
    },
    {
      title: 'Company Achieves 500,000+ Successful Shipments Milestone',
      date: 'July 28, 2024',
      excerpt: 'Fixing Maritime celebrates a major milestone in maritime logistics, showcasing growth and customer trust.',
      category: 'Milestone'
    },
    {
      title: 'Revolutionary Digital Platform Streamlines Maritime Documentation',
      date: 'June 10, 2024',
      excerpt: 'New technology platform reduces documentation processing time by 75% while improving accuracy and compliance.',
      category: 'Technology'
    },
    {
      title: 'Fixing Maritime Wins Maritime Excellence Award 2024',
      date: 'May 22, 2024',
      excerpt: 'Industry recognition for outstanding service quality and innovation in maritime logistics solutions.',
      category: 'Award'
    }
  ]

  const mediaKit = [
    {
      name: 'Company Logo (PNG)',
      type: 'Image',
      size: '2.3 MB'
    },
    {
      name: 'Company Fact Sheet',
      type: 'PDF',
      size: '450 KB'
    },
    {
      name: 'Executive Bios',
      type: 'PDF',
      size: '1.2 MB'
    },
    {
      name: 'High-res Photos',
      type: 'ZIP',
      size: '15.7 MB'
    }
  ]

  const mediaContacts = [
    {
      name: 'Sarah Johnson',
      title: 'Director of Communications',
      email: 'press@fixingmaritime.com',
      phone: '+1 (555) 123-4567'
    },
    {
      name: 'Michael Chen',
      title: 'Public Relations Manager',
      email: 'media@fixingmaritime.com',
      phone: '+1 (555) 123-4568'
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
              Press Center
            </h1>
            <p className="mt-4 text-lg text-gray-100">
              Latest news, press releases, and media resources
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Press Releases */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Press Releases</h2>
              <div className="space-y-8">
                {pressReleases.map((release, index) => (
                  <article key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {release.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {release.date}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{release.title}</h3>
                    <p className="text-gray-600 mb-4">{release.excerpt}</p>
                    <div className="flex items-center gap-4">
                      <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                        Read Full Release
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        Download PDF
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* In The News */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Fixing Maritime in the News</h2>
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        "Leading Maritime Innovation" - Shipping Weekly
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Industry publication highlights Fixing Maritime's technological innovations and market leadership.
                      </p>
                      <span className="text-sm text-gray-500">August 5, 2024</span>
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400 ml-4" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        "Sustainable Maritime Solutions" - Green Logistics Today
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Feature article on Fixing Maritime's commitment to environmental sustainability in logistics.
                      </p>
                      <span className="text-sm text-gray-500">July 18, 2024</span>
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400 ml-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Media Contacts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Media Contacts</h3>
              <div className="space-y-4">
                {mediaContacts.map((contact, index) => (
                  <div key={index} className="pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                    <h4 className="font-medium text-gray-900">{contact.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{contact.title}</p>
                    <p className="text-sm text-primary-600 hover:text-primary-700">
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    </p>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Kit */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Media Kit</h3>
              <div className="space-y-3">
                {mediaKit.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.type} • {item.size}</p>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700">
                Download Full Media Kit
              </button>
            </div>

            {/* Quick Facts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Facts</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Founded:</span>
                  <span className="text-gray-600 ml-2">2018</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Headquarters:</span>
                  <span className="text-gray-600 ml-2">Maritime City, MC</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Global Network:</span>
                  <span className="text-gray-600 ml-2">50+ Countries</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Employees:</span>
                  <span className="text-gray-600 ml-2">500+</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">CEO:</span>
                  <span className="text-gray-600 ml-2">Raphael Ugochukwu U.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}