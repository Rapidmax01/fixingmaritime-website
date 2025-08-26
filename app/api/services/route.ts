import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export const dynamic = 'force-dynamic'

// Fallback data for when database is not available
const fallbackServices = [
  {
    id: 'documentation',
    slug: 'documentation',
    name: 'Documentation',
    description: 'Complete documentation services for all your maritime needs. From bills of lading to customs paperwork.',
    features: ['Bills of Lading', 'Customs Papers', 'Digital Processing'],
    active: true,
    href: '/services/documentation'
  },
  {
    id: 'truck-services',
    slug: 'truck-services',
    name: 'Truck Services',
    description: 'Reliable ground transportation for cargo delivery to and from ports with real-time tracking.',
    features: ['GPS Tracking', 'Door-to-Door', 'Temperature Control'],
    active: true,
    href: '/services/truck'
  },
  {
    id: 'tugboat-barge',
    slug: 'tugboat-barge',
    name: 'Tug Boat & Barge',
    description: 'Professional tug boat and barge services for safe and efficient marine transportation.',
    features: ['Harbor Towing', 'Ocean Transport', 'Heavy Cargo'],
    active: true,
    href: '/services/tugboat'
  },
  {
    id: 'procurement',
    slug: 'procurement',
    name: 'Procurement',
    description: 'Expert procurement of export goods with quality assurance and competitive pricing.',
    features: ['Quality Control', 'Supplier Vetting', 'Price Negotiation'],
    active: true,
    href: '/services/procurement'
  },
  {
    id: 'freight-forwarding',
    slug: 'freight-forwarding',
    name: 'Freight Forwarding',
    description: 'Global freight forwarding solutions with optimized routes and cost-effective shipping.',
    features: ['Global Network', 'Route Optimization', 'Multimodal Transport'],
    active: true,
    href: '/services/freight'
  },
  {
    id: 'warehousing',
    slug: 'warehousing',
    name: 'Warehousing',
    description: 'Secure, climate-controlled warehousing facilities with inventory management systems.',
    features: ['Climate Control', 'Inventory Management', 'Pick & Pack'],
    active: true,
    href: '/services/warehousing'
  },
  {
    id: 'custom-clearing',
    slug: 'custom-clearing',
    name: 'Custom Clearing',
    description: 'Expert customs clearance services ensuring smooth import/export operations.',
    features: ['Import/Export', 'Compliance', 'Duty Optimization'],
    active: true,
    href: '/services/customs'
  }
]

export async function GET() {
  try {
    if (!prisma) {
      // Return fallback data when database is not available
      return NextResponse.json({ services: fallbackServices })
    }

    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: { createdAt: 'asc' }
    })

    const formattedServices = services.map(service => ({
      id: service.id,
      slug: service.slug,
      name: service.name,
      description: service.description,
      features: Array.isArray(service.features) ? service.features.slice(0, 3) : [],
      active: service.active,
      href: `/services/${service.slug}`
    }))

    return NextResponse.json({ services: formattedServices })
  } catch (error) {
    console.error('Error fetching services:', error)
    
    // Return fallback data on error
    return NextResponse.json({ services: fallbackServices })
  }
}