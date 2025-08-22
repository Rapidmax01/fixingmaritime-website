'use client'

import Head from 'next/head'
import { useContent } from '@/contexts/ContentContext'

export default function DynamicHead() {
  const { content, loading } = useContent()

  if (loading || !content) {
    return null
  }

  const seo = content.seo

  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta property="og:title" content={seo.ogTitle} />
      <meta property="og:description" content={seo.ogDescription} />
      <meta property="og:url" content="https://www.fixingmaritime.com" />
      <meta property="og:site_name" content="Fixing Maritime" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.ogTitle} />
      <meta name="twitter:description" content={seo.ogDescription} />
    </Head>
  )
}