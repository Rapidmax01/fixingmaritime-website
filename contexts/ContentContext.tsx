'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ContentSection {
  id?: string
  title: string
  content: string
  name?: string
}

interface SEOSettings {
  title: string
  description: string
  keywords: string
  ogTitle: string
  ogDescription: string
}

interface ContentData {
  sections: {
    hero?: ContentSection
    about?: ContentSection
    services?: ContentSection
    contact?: ContentSection
    footer?: ContentSection
  }
  seo: SEOSettings
}

interface ContentContextType {
  content: ContentData | null
  loading: boolean
  error: string | null
  refreshContent: () => Promise<void>
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

export const useContent = () => {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider')
  }
  return context
}

interface ContentProviderProps {
  children: ReactNode
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const [content, setContent] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Add cache busting parameter
      const response = await fetch(`/api/content?t=${Date.now()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch content')
      }
      
      const data = await response.json()
      setContent(data)
    } catch (err: any) {
      console.error('Error fetching content:', err)
      setError(err.message)
      
      // Fallback content if API fails
      setContent({
        sections: {
          hero: {
            title: 'Your Gateway to Global Maritime Solutions',
            content: 'Professional maritime services with real-time tracking and comprehensive logistics support.'
          },
          about: {
            title: 'Leading Maritime Service Provider',
            content: 'With years of experience in the maritime industry, we provide comprehensive solutions for all your maritime needs.'
          },
          services: {
            title: 'Comprehensive Maritime Services',
            content: 'We offer a complete suite of maritime services designed to streamline your logistics operations.'
          },
          contact: {
            title: 'Get in Touch',
            content: 'Ready to streamline your maritime operations? Contact our expert team today.'
          },
          footer: {
            title: 'Fixing Maritime',
            content: 'Your comprehensive maritime solutions partner trusted worldwide.'
          }
        },
        seo: {
          title: 'Fixing Maritime - Professional Maritime Services',
          description: 'Complete maritime solutions including documentation, truck services, tug boat with barge, procurement, freight forwarding, warehousing, and custom clearing.',
          keywords: 'maritime services, freight forwarding, custom clearing, tug boat, barge, warehousing, procurement, export goods',
          ogTitle: 'Fixing Maritime - Professional Maritime Services',
          ogDescription: 'Your trusted partner for comprehensive maritime solutions'
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshContent = async () => {
    await fetchContent()
  }

  useEffect(() => {
    fetchContent()
  }, [])

  return (
    <ContentContext.Provider value={{ content, loading, error, refreshContent }}>
      {children}
    </ContentContext.Provider>
  )
}