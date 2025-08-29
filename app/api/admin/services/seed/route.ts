import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/database'

export const dynamic = 'force-dynamic'

const seedServices = [
  {
    slug: 'documentation',
    name: 'Documentation Services',
    description: 'Complete maritime documentation and paperwork services including Bills of Lading, Certificates of Origin, Commercial Invoices, and all necessary customs documentation.',
    basePrice: 350.00,
    priceUnit: 'per_shipment',
    features: [
      'Bill of Lading preparation',
      'Certificate of Origin',
      'Commercial Invoice',
      'Packing List',
      'Insurance certificates',
      'Customs declarations',
      'Digital document management',
      'Expedited processing available'
    ],
    active: true
  },
  {
    slug: 'truck-services',
    name: 'Truck Services',
    description: 'Reliable ground transportation for cargo delivery to and from ports with real-time GPS tracking and professional drivers.',
    basePrice: 2.50,
    priceUnit: 'per_mile',
    features: [
      'Local and long-distance transport',
      'Real-time GPS tracking',
      'Temperature-controlled options',
      'Specialized cargo handling',
      '24/7 customer support',
      'Door-to-door delivery',
      'Insurance coverage included',
      'Flexible scheduling'
    ],
    active: true
  },
  {
    slug: 'tugboat-barge',
    name: 'Tug Boat with Barge',
    description: 'Professional tug boat and barge services for safe and efficient marine transportation of heavy cargo and bulk materials.',
    basePrice: 5000.00,
    priceUnit: 'per_trip',
    features: [
      'Heavy machinery transport',
      'Bulk cargo handling',
      'Experienced marine crew',
      'Weather monitoring',
      'Port-to-port service',
      'Load securing systems',
      'Harbor towing services',
      'Emergency response capability'
    ],
    active: true
  },
  {
    slug: 'procurement',
    name: 'Procurement of Export Goods',
    description: 'Expert procurement services for international export with global supplier network, quality assurance, and competitive pricing.',
    basePrice: 2500.00,
    priceUnit: 'per_order',
    features: [
      'Global supplier network',
      'Quality assurance',
      'Competitive pricing',
      'Compliance verification',
      'Logistics coordination',
      'Vendor management',
      'Product sourcing',
      'Risk assessment'
    ],
    active: true
  },
  {
    slug: 'freight-forwarding',
    name: 'Freight Forwarding',
    description: 'Comprehensive freight forwarding solutions with global reach, customs clearance, and end-to-end shipment tracking.',
    basePrice: 650.00,
    priceUnit: 'per_shipment',
    features: [
      'Air and sea freight',
      'Customs clearance',
      'Insurance options',
      'Multi-modal transport',
      'End-to-end tracking',
      'Route optimization',
      'Consolidation services',
      'International expertise'
    ],
    active: true
  },
  {
    slug: 'warehousing',
    name: 'Warehousing',
    description: 'Secure, climate-controlled warehousing facilities with advanced inventory management systems and flexible storage options.',
    basePrice: 125.00,
    priceUnit: 'per_month',
    features: [
      'Climate-controlled storage',
      'Inventory management',
      'Pick and pack services',
      'Security monitoring',
      'Flexible terms',
      'Cross-docking services',
      'Distribution services',
      'Real-time inventory tracking'
    ],
    active: true
  },
  {
    slug: 'custom-clearing',
    name: 'Custom Clearing',
    description: 'Expert customs clearance and compliance services ensuring smooth import/export operations with regulatory expertise.',
    basePrice: 250.00,
    priceUnit: 'per_clearance',
    features: [
      'Import/export clearance',
      'Duty calculation',
      'Compliance verification',
      'Document preparation',
      'Regulatory updates',
      'Tariff classification',
      'License management',
      'Audit support'
    ],
    active: true
  }
]

export async function POST() {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    // Check if services already exist
    const existingServices = await prisma.service.count()
    
    if (existingServices > 0) {
      return NextResponse.json({ 
        message: 'Services already exist in database',
        count: existingServices 
      })
    }

    // Create services
    const createdServices = []
    for (const serviceData of seedServices) {
      const service = await prisma.service.create({
        data: serviceData
      })
      createdServices.push(service)
    }

    return NextResponse.json({ 
      message: 'Services seeded successfully',
      count: createdServices.length,
      services: createdServices 
    })
  } catch (error) {
    console.error('Error seeding services:', error)
    return NextResponse.json({ error: 'Failed to seed services' }, { status: 500 })
  }
}