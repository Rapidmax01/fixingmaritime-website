// Script to seed initial content data
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

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
    type: 'image',
    url: '/images/hero-bg.jpg',
    size: 2456789,
    mimeType: 'image/jpeg',
    width: 1920,
    height: 1080,
    alt: 'Maritime cargo ship at sunset'
  },
  {
    name: 'truck-services.jpg',
    type: 'image',
    url: '/images/truck-bg.jpg',
    size: 1876543,
    mimeType: 'image/jpeg',
    width: 1600,
    height: 900,
    alt: 'Truck loading cargo at port'
  },
  {
    name: 'warehouse-facility.jpg',
    type: 'image',
    url: '/images/warehouse-bg.jpg',
    size: 3245678,
    mimeType: 'image/jpeg',
    width: 2048,
    height: 1365,
    alt: 'Modern warehouse facility'
  },
  {
    name: 'company-brochure.pdf',
    type: 'document',
    url: '/documents/brochure.pdf',
    size: 4567890,
    mimeType: 'application/pdf'
  },
  {
    name: 'port-operations.mp4',
    type: 'video',
    url: '/videos/port-ops.mp4',
    size: 15678901,
    mimeType: 'video/mp4'
  },
  {
    name: 'team-photo.jpg',
    type: 'image',
    url: '/images/team.jpg',
    size: 1234567,
    mimeType: 'image/jpeg',
    width: 1280,
    height: 854,
    alt: 'Fixing Maritime team photo'
  },
  {
    name: 'service-overview.pdf',
    type: 'document',
    url: '/documents/services.pdf',
    size: 2345678,
    mimeType: 'application/pdf'
  },
  {
    name: 'container-yard.jpg',
    type: 'image',
    url: '/images/container-yard.jpg',
    size: 2987654,
    mimeType: 'image/jpeg',
    width: 1920,
    height: 1280,
    alt: 'Container storage yard'
  }
]

async function seedContent() {
  try {
    console.log('🌱 Seeding content data...')

    // Seed content sections
    console.log('📄 Creating content sections...')
    for (const section of contentSections) {
      await prisma.contentSection.upsert({
        where: { type: section.type },
        update: section,
        create: section
      })
      console.log(`✅ Created/updated ${section.name}`)
    }

    // Seed SEO settings
    console.log('🔍 Creating SEO settings...')
    await prisma.seoSettings.upsert({
      where: { id: 'default' },
      update: seoSettings,
      create: { id: 'default', ...seoSettings }
    })
    console.log('✅ Created/updated SEO settings')

    // Seed media files
    console.log('📸 Creating media files...')
    for (const media of mediaFiles) {
      const existing = await prisma.mediaFile.findFirst({
        where: { name: media.name }
      })
      
      if (!existing) {
        await prisma.mediaFile.create({
          data: {
            ...media,
            size: BigInt(media.size)
          }
        })
        console.log(`✅ Created media file: ${media.name}`)
      } else {
        console.log(`⏭️  Media file already exists: ${media.name}`)
      }
    }

    console.log('🎉 Content seeding completed successfully!')

  } catch (error) {
    console.error('❌ Error seeding content:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedContent()