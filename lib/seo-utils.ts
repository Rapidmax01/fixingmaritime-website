import { Metadata } from 'next'

interface GenerateMetadataProps {
  title: string
  description: string
  path?: string
  image?: string
  keywords?: string
  noIndex?: boolean
}

export function generatePageMetadata({
  title,
  description,
  path = '',
  image = '/maritime-banner-bg.avif',
  keywords,
  noIndex = false,
}: GenerateMetadataProps): Metadata {
  const fullTitle = `${title} | Fixing Maritime - Professional Maritime Services`
  const canonicalUrl = `https://www.fixingmaritime.com${path}`
  
  return {
    title: fullTitle,
    description,
    keywords: keywords || 'maritime services Nigeria, freight forwarding, custom clearing, warehousing',
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: 'Fixing Maritime',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export const seoKeywords = {
  services: 'maritime services Nigeria, freight forwarding Lagos, custom clearing agent Nigeria, warehousing services, truck transportation Nigeria, tug boat services, barge rental Nigeria',
  about: 'about Fixing Maritime, maritime company Nigeria, shipping company Lagos, logistics company Nigeria',
  contact: 'contact Fixing Maritime, maritime services contact, shipping company contact Nigeria',
  trucks: 'truck services Nigeria, haulage services Lagos, truck rental Nigeria, transportation services',
  partners: 'maritime partners Nigeria, business partnership maritime, logistics partnership opportunities',
  careers: 'maritime careers Nigeria, shipping jobs Lagos, logistics careers, maritime employment opportunities',
}