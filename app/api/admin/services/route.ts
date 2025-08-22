import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const services = await prisma.service.findMany({
      include: {
        orderItems: {
          include: {
            order: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const servicesWithStats = services.map(service => {
      const orders = service.orderItems.length
      const revenue = service.orderItems.reduce((sum, item) => sum + Number(item.totalPrice), 0)
      
      return {
        id: service.id,
        slug: service.slug,
        name: service.name,
        description: service.description,
        basePrice: Number(service.basePrice || 0),
        priceUnit: service.priceUnit,
        features: service.features || [],
        active: service.active,
        orders,
        revenue,
        rating: 4.5, // Default rating - implement rating system later
        lastUpdated: service.updatedAt.toISOString().split('T')[0],
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      }
    })

    return NextResponse.json({ services: servicesWithStats })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const body = await request.json()
    const { name, slug, description, basePrice, priceUnit, features, active = true } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    const service = await prisma.service.create({
      data: {
        name,
        slug,
        description,
        basePrice: basePrice ? parseFloat(basePrice) : null,
        priceUnit,
        features: features || [],
        active
      }
    })

    return NextResponse.json({ service }, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}