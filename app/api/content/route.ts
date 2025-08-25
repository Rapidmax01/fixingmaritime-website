import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      // Return default content if database not available
      return NextResponse.json({
        sections: {
          hero: {
            title: 'Your Gateway to Global Maritime Solutions',
            content: 'Your trusted partner for comprehensive maritime solutions.'
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
      // Fetch content sections
      const sections = await prisma.contentSection.findMany({
        where: { active: true }
      })

      // Fetch SEO settings
      const seoSettings = await prisma.seoSettings.findFirst({
        where: { active: true }
      })

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

      return NextResponse.json({
        sections: sectionsMap,
        seo: seoSettings || {
          title: 'Fixing Maritime - Professional Maritime Services',
          description: 'Complete maritime solutions including documentation, truck services, tug boat with barge, procurement, freight forwarding, warehousing, and custom clearing.',
          keywords: 'maritime services, freight forwarding, custom clearing, tug boat, barge, warehousing, procurement, export goods',
          ogTitle: 'Fixing Maritime - Professional Maritime Services',
          ogDescription: 'Your trusted partner for comprehensive maritime solutions'
        }
      })

    } catch (dbError: any) {
      console.error('Database error in public content API:', dbError)
      // Return default content if database query fails
      return NextResponse.json({
        sections: {
          hero: {
            title: 'Your Gateway to Global Maritime Solutions',
            content: 'Your trusted partner for comprehensive maritime solutions.'
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