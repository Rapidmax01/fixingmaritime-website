import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import ConditionalLayout from '@/components/ConditionalLayout'
import { Toaster } from 'react-hot-toast'
import PageTracker from '@/components/PageTracker'
import StructuredData, { organizationSchema, localBusinessSchema } from '@/components/StructuredData'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Maritime Logistics Nigeria | Custom Clearing | Tug & Barge Services - Fixing Maritime',
  description: 'Leading maritime solutions provider in Nigeria. Expert custom clearing, car clearing, tug boat & barge services, shipping, and logistics. Professional maritime services for all your cargo needs.',
  keywords: 'maritime logistics, logistics, maritime solution, maritime, tug, barge, logistics Nigeria, shipping, Nigeria maritime services, car clearing, custom, custom clearing, maritime logistics Nigeria, shipping Nigeria, tug boat Nigeria, barge services, custom clearing agent, car clearing Nigeria, maritime company Nigeria, logistics company Nigeria, freight forwarding, warehousing Lagos',
  authors: [{ name: 'Fixing Maritime' }],
  creator: 'Fixing Maritime',
  publisher: 'Fixing Maritime',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.fixingmaritime.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Fixing Maritime - Professional Maritime Services in Nigeria',
    description: 'Your trusted partner for comprehensive maritime solutions. We offer freight forwarding, custom clearing, warehousing, truck services, and more across Nigeria.',
    url: 'https://www.fixingmaritime.com',
    siteName: 'Fixing Maritime',
    images: [
      {
        url: '/maritime-banner-bg.avif',
        width: 1200,
        height: 630,
        alt: 'Fixing Maritime - Professional Maritime Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fixing Maritime - Professional Maritime Services in Nigeria',
    description: 'Complete maritime solutions including freight forwarding, custom clearing, warehousing & more.',
    images: ['/maritime-banner-bg.avif'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
      </head>
      <body className={inter.className}>
        <Providers>
          <PageTracker />
          <StructuredData data={organizationSchema} />
          <StructuredData data={localBusinessSchema} />
          <div className="min-h-screen flex flex-col">
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </div>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  )
}