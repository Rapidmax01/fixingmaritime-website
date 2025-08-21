import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromRequest } from '@/lib/admin-auth'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export async function POST(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    
    if (!admin || admin.role !== 'super_admin') {
      return NextResponse.json(
        { message: 'Unauthorized. Super admin access required.' },
        { status: 401 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { message: 'Database not configured' },
        { status: 503 }
      )
    }

    const contentSections = [
      {
        type: 'hero',
        name: 'Hero Section',
        title: 'Professional Maritime Solutions',
        content: 'Your trusted partner for comprehensive maritime services including documentation, freight forwarding, warehousing, and custom clearing.'
      },
      {
        type: 'about',
        name: 'About Us',
        title: 'Leading Maritime Service Provider',
        content: 'With years of experience in the maritime industry, Fixing Maritime has established itself as a trusted partner for businesses seeking reliable and efficient maritime solutions. Our comprehensive range of services covers every aspect of maritime logistics.'
      },
      {
        type: 'services',
        name: 'Services Overview',
        title: 'Comprehensive Maritime Services',
        content: 'We offer a complete suite of maritime services designed to streamline your logistics operations and ensure smooth sailing for your business ventures.'
      },
      {
        type: 'contact',
        name: 'Contact Information',
        title: 'Get in Touch',
        content: 'Ready to streamline your maritime operations? Contact our expert team today for personalized solutions tailored to your business needs.'
      },
      {
        type: 'footer',
        name: 'Footer Content',
        title: 'Fixing Maritime',
        content: 'Your comprehensive maritime solutions partner. Trusted by businesses worldwide for reliable and efficient maritime services.'
      }
    ]

    const seoSettings = {
      title: 'Fixing Maritime - Professional Maritime Services',
      description: 'Complete maritime solutions including documentation, truck services, tug boat with barge, procurement, freight forwarding, warehousing, and custom clearing.',
      keywords: 'maritime services, freight forwarding, custom clearing, tug boat, barge, warehousing, procurement, export goods',
      ogTitle: 'Fixing Maritime - Professional Maritime Services',
      ogDescription: 'Your trusted partner for comprehensive maritime solutions'
    }

    const mediaFiles = [
      {
        name: 'hero-ship-background.jpg',
        type: 'image' as const,
        url: '/images/hero-bg.jpg',
        size: BigInt(2456789),
        mimeType: 'image/jpeg',
        width: 1920,
        height: 1080,
        alt: 'Maritime cargo ship at sunset'
      },
      {
        name: 'truck-services.jpg',
        type: 'image' as const,
        url: '/images/truck-bg.jpg',
        size: BigInt(1876543),
        mimeType: 'image/jpeg',
        width: 1600,
        height: 900,
        alt: 'Truck loading cargo at port'
      },
      {
        name: 'warehouse-facility.jpg',
        type: 'image' as const,
        url: '/images/warehouse-bg.jpg',
        size: BigInt(3245678),
        mimeType: 'image/jpeg',
        width: 2048,
        height: 1365,
        alt: 'Modern warehouse facility'
      },
      {
        name: 'company-brochure.pdf',
        type: 'document' as const,
        url: '/documents/brochure.pdf',
        size: BigInt(4567890),
        mimeType: 'application/pdf'
      },
      {
        name: 'team-photo.jpg',
        type: 'image' as const,
        url: '/images/team.jpg',
        size: BigInt(1234567),
        mimeType: 'image/jpeg',
        width: 1280,
        height: 854,
        alt: 'Fixing Maritime team photo'
      }
    ]

    // Seed content sections
    for (const section of contentSections) {
      await prisma.contentSection.upsert({
        where: { type: section.type },
        update: section,
        create: section
      })
    }

    // Seed SEO settings  
    await prisma.seoSettings.updateMany({
      where: { active: true },
      data: { active: false }
    })
    
    await prisma.seoSettings.create({
      data: seoSettings
    })

    // Seed media files
    for (const media of mediaFiles) {
      const existing = await prisma.mediaFile.findFirst({
        where: { name: media.name }
      })
      
      if (!existing) {
        await prisma.mediaFile.create({
          data: media
        })
      }
    }

    return NextResponse.json({ 
      message: 'Database seeded successfully',
      seeded: {
        contentSections: contentSections.length,
        seoSettings: 1,
        mediaFiles: mediaFiles.length
      }
    })

  } catch (error: any) {
    console.error('Database seeding error:', error)
    return NextResponse.json(
      { message: 'Failed to seed database', error: error.message },
      { status: 500 }
    )
  }
}