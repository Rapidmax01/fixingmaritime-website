import Script from 'next/script'

interface StructuredDataProps {
  data: Record<string, any>
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  )
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Fixing Maritime',
  alternateName: 'Fixing Maritime Services',
  url: 'https://www.fixingmaritime.com',
  logo: 'https://www.fixingmaritime.com/logo.png',
  description: 'Professional maritime services company in Nigeria offering freight forwarding, custom clearing, warehousing, truck services, and comprehensive maritime solutions.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'NG',
    addressRegion: 'Lagos',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+234-XXX-XXX-XXXX',
      contactType: 'customer service',
      availableLanguage: ['en'],
    },
  ],
  sameAs: [
    'https://www.facebook.com/fixingmaritime',
    'https://www.twitter.com/fixingmaritime',
    'https://www.linkedin.com/company/fixingmaritime',
  ],
  foundingDate: '2020',
  founder: {
    '@type': 'Person',
    name: 'Raphael Ugochukwu U.',
    jobTitle: 'CEO & Founder',
  },
}

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.fixingmaritime.com/#business',
  name: 'Fixing Maritime',
  image: 'https://www.fixingmaritime.com/maritime-banner-bg.avif',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'NG',
    addressRegion: 'Lagos',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 6.5244,
    longitude: 3.3792,
  },
  url: 'https://www.fixingmaritime.com',
  telephone: '+234-XXX-XXX-XXXX',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '14:00',
    },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Maritime Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Freight Forwarding',
          description: 'International freight forwarding services for import and export',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Custom Clearing',
          description: 'Professional custom clearance services for all types of goods',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Warehousing',
          description: 'Secure warehousing and storage solutions',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Truck Services',
          description: 'Reliable truck transportation services across Nigeria',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Tug Boat & Barge',
          description: 'Marine transportation with tug boats and barges',
        },
      },
    ],
  },
}

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
})

export const serviceSchema = (service: {
  name: string
  description: string
  image?: string
  provider?: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: service.name,
  name: service.name,
  description: service.description,
  image: service.image,
  provider: {
    '@type': 'Organization',
    name: service.provider || 'Fixing Maritime',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Nigeria',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: `${service.name} Services`,
  },
})

export const faqSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
})