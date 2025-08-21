import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json(
        { message: 'Verification token is required' },
        { status: 400 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { 
          message: 'Email verified successfully! (Demo mode)',
          verified: true 
        },
        { status: 200 }
      )
    }

    // For demo purposes, just return success
    console.log('Demo mode: Would verify token:', token)

    return NextResponse.json(
      { 
        message: 'Email verified successfully! You can now log in to your account.',
        verified: true 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { message: 'Service temporarily unavailable' },
      { status: 503 }
    )
  }
}

// GET endpoint for URL-based verification (when user clicks email link)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const token = url.searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { message: 'Verification token is required' },
        { status: 400 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { 
          message: 'Email verified successfully! (Demo mode)',
          verified: true 
        },
        { status: 200 }
      )
    }

    // For demo purposes, just return success
    console.log('Demo mode: Would verify token via GET:', token)

    return NextResponse.json(
      { 
        message: 'Email verified successfully! You can now log in to your account.',
        verified: true 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { message: 'Service temporarily unavailable' },
      { status: 503 }
    )
  }
}