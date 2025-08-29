import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/admin-auth'
import prisma from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    
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

    console.log('Starting database migration...')

    // Create tables using raw SQL since Prisma might not have the schema yet
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "content_sections" (
          "id" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "content" TEXT NOT NULL,
          "active" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "content_sections_pkey" PRIMARY KEY ("id")
        );
      `
      console.log('Created content_sections table')
    } catch (error: any) {
      console.error('Error creating content_sections:', error.message)
    }

    try {
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "content_sections_type_key" ON "content_sections"("type");
      `
      console.log('Created content_sections index')
    } catch (error: any) {
      console.error('Error creating content_sections index:', error.message)
    }

    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "seo_settings" (
          "id" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "keywords" TEXT NOT NULL,
          "ogTitle" TEXT NOT NULL,
          "ogDescription" TEXT NOT NULL,
          "active" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "seo_settings_pkey" PRIMARY KEY ("id")
        );
      `
      console.log('Created seo_settings table')
    } catch (error: any) {
      console.error('Error creating seo_settings:', error.message)
    }

    // Simplified media files table without ENUM
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "media_files" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "url" TEXT NOT NULL,
          "size" BIGINT NOT NULL,
          "mimeType" TEXT,
          "width" INTEGER,
          "height" INTEGER,
          "alt" TEXT,
          "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "media_files_pkey" PRIMARY KEY ("id")
        );
      `
      console.log('Created media_files table')
    } catch (error: any) {
      console.error('Error creating media_files:', error.message)
    }

    console.log('Tables created, starting data seeding...')

    // Now seed initial data with error handling
    const contentSections = [
      {
        id: 'hero-section',
        type: 'hero',
        name: 'Hero Section',
        title: 'Professional Maritime Solutions',
        content: 'Your trusted partner for comprehensive maritime services including documentation, freight forwarding, warehousing, and custom clearing.'
      },
      {
        id: 'about-section',
        type: 'about',
        name: 'About Us',
        title: 'Leading Maritime Service Provider',
        content: 'With years of experience in the maritime industry, Fixing Maritime has established itself as a trusted partner for businesses seeking reliable and efficient maritime solutions.'
      },
      {
        id: 'services-section',
        type: 'services',
        name: 'Services Overview',
        title: 'Comprehensive Maritime Services',
        content: 'We offer a complete suite of maritime services designed to streamline your logistics operations and ensure smooth sailing for your business ventures.'
      },
      {
        id: 'contact-section',
        type: 'contact',
        name: 'Contact Information',
        title: 'Get in Touch',
        content: 'Ready to streamline your maritime operations? Contact our expert team today for personalized solutions tailored to your business needs.'
      },
      {
        id: 'footer-section',
        type: 'footer',
        name: 'Footer Content',
        title: 'Fixing Maritime',
        content: 'Your comprehensive maritime solutions partner. Trusted by businesses worldwide for reliable and efficient maritime services.'
      },
      {
        id: 'story-section',
        type: 'story',
        name: 'Our Story',
        title: 'Our Story',
        content: 'Founded in 1999 by Raphael Ugochukwu U., Fixing Maritime began as a small documentation service for local shipping companies. With a vision to simplify maritime logistics, we\'ve grown into a comprehensive solution provider. Today, we leverage cutting-edge technology while maintaining the personal touch that has made us a trusted partner for businesses of all sizes.'
      },
      {
        id: 'mission-section',
        type: 'mission',
        name: 'Mission Statement',
        title: 'Our Mission',
        content: 'Our mission is to be the bridge between your cargo and its destination, ensuring every shipment arrives safely, on time, and within budget.'
      },
      {
        id: 'values-section',
        type: 'values',
        name: 'Our Values',
        title: 'Our Values',
        content: 'These core principles guide everything we do: Excellence - We strive for excellence in every aspect of our service delivery. Customer-Centric - Our clients are at the heart of everything we do. Global Reach - With partners worldwide, we provide seamless solutions. Reliability - Count on us for timely, dependable service.'
      },
      {
        id: 'leadership-section',
        type: 'leadership',
        name: 'Leadership Team',
        title: 'Leadership Team',
        content: 'Meet the experts behind Fixing Maritime who bring decades of experience and innovative thinking to maritime logistics solutions.'
      }
    ]

    // Insert content sections with error handling
    let sectionsSeeded = 0
    for (const section of contentSections) {
      try {
        await prisma.$executeRaw`
          INSERT INTO "content_sections" ("id", "type", "name", "title", "content", "active", "createdAt", "updatedAt")
          VALUES (${section.id}, ${section.type}, ${section.name}, ${section.title}, ${section.content}, true, NOW(), NOW())
          ON CONFLICT ("type") DO UPDATE SET
            "name" = EXCLUDED."name",
            "title" = EXCLUDED."title", 
            "content" = EXCLUDED."content",
            "updatedAt" = NOW()
        `
        sectionsSeeded++
        console.log(`Seeded content section: ${section.type}`)
      } catch (error: any) {
        console.error(`Error seeding content section ${section.type}:`, error.message)
      }
    }

    // Insert SEO settings with error handling
    let seoSeeded = 0
    try {
      const seoId = 'default-seo'
      await prisma.$executeRaw`
        INSERT INTO "seo_settings" ("id", "title", "description", "keywords", "ogTitle", "ogDescription", "active", "createdAt", "updatedAt")
        VALUES (
          ${seoId}, 
          'Fixing Maritime - Professional Maritime Services',
          'Complete maritime solutions including documentation, truck services, tug boat with barge, procurement, freight forwarding, warehousing, and custom clearing.',
          'maritime services, freight forwarding, custom clearing, tug boat, barge, warehousing, procurement, export goods',
          'Fixing Maritime - Professional Maritime Services',
          'Your trusted partner for comprehensive maritime solutions',
          true,
          NOW(),
          NOW()
        )
        ON CONFLICT ("id") DO UPDATE SET
          "title" = EXCLUDED."title",
          "description" = EXCLUDED."description",
          "keywords" = EXCLUDED."keywords",
          "ogTitle" = EXCLUDED."ogTitle",
          "ogDescription" = EXCLUDED."ogDescription",
          "updatedAt" = NOW()
      `
      seoSeeded = 1
      console.log('Seeded SEO settings')
    } catch (error: any) {
      console.error('Error seeding SEO settings:', error.message)
    }

    // Insert sample media files with error handling
    const mediaFiles = [
      {
        id: 'hero-bg-img',
        name: 'hero-ship-background.jpg',
        type: 'image',
        url: '/images/hero-bg.jpg',
        size: 2456789,
        mimeType: 'image/jpeg',
        width: 1920,
        height: 1080,
        alt: 'Maritime cargo ship at sunset'
      },
      {
        id: 'truck-services-img',
        name: 'truck-services.jpg',
        type: 'image',
        url: '/images/truck-bg.jpg',
        size: 1876543,
        mimeType: 'image/jpeg',
        width: 1600,
        height: 900,
        alt: 'Truck loading cargo at port'
      }
    ]

    let mediaSeeded = 0
    for (const media of mediaFiles) {
      try {
        await prisma.$executeRaw`
          INSERT INTO "media_files" ("id", "name", "type", "url", "size", "mimeType", "width", "height", "alt", "uploadedAt", "updatedAt")
          VALUES (
            ${media.id}, ${media.name}, ${media.type}, ${media.url}, ${media.size}, 
            ${media.mimeType}, ${media.width}, ${media.height}, ${media.alt}, NOW(), NOW()
          )
          ON CONFLICT ("id") DO NOTHING
        `
        mediaSeeded++
        console.log(`Seeded media file: ${media.name}`)
      } catch (error: any) {
        console.error(`Error seeding media file ${media.name}:`, error.message)
      }
    }

    console.log('Migration completed successfully')

    return NextResponse.json({ 
      message: 'Database migration and seeding completed successfully',
      migrated: {
        contentSections: sectionsSeeded,
        seoSettings: seoSeeded,
        mediaFiles: mediaSeeded
      }
    })

  } catch (error: any) {
    console.error('Database migration error:', error)
    return NextResponse.json(
      { message: 'Failed to migrate database', error: error.message },
      { status: 500 }
    )
  }
}