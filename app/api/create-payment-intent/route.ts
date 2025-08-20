import { NextRequest, NextResponse } from 'next/server'

// Temporarily disable Stripe for deployment
// import Stripe from 'stripe'
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2024-06-20',
// })

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json()

    // Temporary response for deployment - Stripe not configured yet
    return NextResponse.json({
      message: 'Payment processing will be available once Stripe is configured. Please check back soon!',
      status: 'coming_soon',
      amount: amount
    })

    // Original Stripe code will be re-enabled once configured:
    /*
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        // Add any order metadata here
        source: 'fixingmaritime-website',
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
    */
  } catch (error) {
    console.error('Payment intent error:', error)
    return NextResponse.json(
      { error: 'Payment service temporarily unavailable' },
      { status: 503 }
    )
  }
}