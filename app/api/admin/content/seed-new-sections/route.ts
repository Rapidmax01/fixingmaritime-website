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

    const newSections = [
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

    let created = 0
    let updated = 0
    const results = []

    for (const section of newSections) {
      try {
        // Try to create or update
        const result = await prisma.contentSection.upsert({
          where: { type: section.type },
          update: {
            name: section.name,
            title: section.title,
            content: section.content,
            updatedAt: new Date()
          },
          create: {
            id: section.id,
            type: section.type,
            name: section.name,
            title: section.title,
            content: section.content,
            active: true
          }
        })
        
        if (result.createdAt === result.updatedAt) {
          created++
        } else {
          updated++
        }
        
        results.push({ type: section.type, status: 'success' })
      } catch (error: any) {
        console.error(`Error seeding section ${section.type}:`, error)
        results.push({ type: section.type, status: 'error', error: error.message })
      }
    }

    return NextResponse.json({ 
      message: 'New content sections seeded successfully',
      created,
      updated,
      results
    })

  } catch (error: any) {
    console.error('Seed new sections error:', error)
    return NextResponse.json(
      { message: 'Failed to seed new sections', error: error.message },
      { status: 500 }
    )
  }
}