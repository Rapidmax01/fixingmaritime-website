import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export async function GET(request: NextRequest) {
  try {
    console.log('Content API called, DATABASE_URL exists:', !!process.env.DATABASE_URL)
    
    if (!prisma) {
      console.log('Prisma not available, returning default content')
      // Return default content if database not available
      return NextResponse.json({
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
    }

    try {
      console.log('Attempting to fetch content from database...')
      
      // Fetch content sections
      const sections = await prisma.contentSection.findMany({
        where: { active: true }
      })
      console.log('Found sections:', sections.length, sections.map(s => ({ type: s.type, title: s.title })))

      // Fetch SEO settings
      const seoSettings = await prisma.seoSettings.findFirst({
        where: { active: true }
      })
      console.log('Found SEO settings:', !!seoSettings)

      // Transform sections into easier format
      const sectionsMap: any = {}
      sections.forEach(section => {
        sectionsMap[section.type] = {
          id: section.id,
          title: section.title,
          content: section.content,
          name: section.name
        }
      })

      console.log('Returning database content with sections:', Object.keys(sectionsMap))
      const response = NextResponse.json({
        sections: sectionsMap,
        seo: seoSettings || {
          title: 'Fixing Maritime - Professional Maritime Services',
          description: 'Complete maritime solutions including documentation, truck services, tug boat with barge, procurement, freight forwarding, warehousing, and custom clearing.',
          keywords: 'maritime services, freight forwarding, custom clearing, tug boat, barge, warehousing, procurement, export goods',
          ogTitle: 'Fixing Maritime - Professional Maritime Services',
          ogDescription: 'Your trusted partner for comprehensive maritime solutions'
        }
      })
      
      // Add cache control headers
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      
      return response

    } catch (dbError: any) {
      console.error('Database error in public content API:', dbError)
      // Return default content if database query fails
      return NextResponse.json({
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
    }

  } catch (error: any) {
    console.error('Public content API error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}