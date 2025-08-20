'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Lock, CreditCard, Check, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Mock cart data
const cartItems = [
  {
    id: '1',
    serviceName: 'Documentation Services',
    plan: 'Professional',
    price: 300,
    quantity: 1,
  },
  {
    id: '2',
    serviceName: 'Freight Forwarding',
    plan: 'FCL Shipping',
    price: 2000,
    quantity: 2,
  },
]

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState('')

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  useEffect(() => {
    // Create PaymentIntent on component mount
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Math.round(total * 100) }), // Convert to cents
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
  }, [total])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const card = elements.getElement(CardElement)

    if (!card) {
      setIsLoading(false)
      return
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: session?.user?.name || '',
          email: session?.user?.email || '',
        },
      }
    })

    if (result.error) {
      toast.error(result.error.message || 'Payment failed')
      setIsLoading(false)
    } else {
      toast.success('Payment successful!')
      router.push('/order-confirmation?payment_intent=' + result.paymentIntent.id)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
        
        <div className="border rounded-md p-4 bg-gray-50">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>

        <div className="mt-4 flex items-center text-sm text-gray-600">
          <Lock className="h-4 w-4 mr-2" />
          Your payment information is encrypted and secure
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full flex items-center justify-center rounded-md bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          <>
            <Lock className="h-4 w-4 mr-2" />
            Complete Payment - ${total.toLocaleString()}
          </>
        )}
      </button>
    </form>
  )
}

export default function Checkout() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to cart
            </Link>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="mt-2 text-gray-600">
              Complete your order securely
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.serviceName}</p>
                        <p className="text-sm text-gray-600">{item.plan} × {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      ${subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-medium text-gray-900">
                      ${tax.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Secure Checkout</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm text-gray-600">SSL encrypted payment</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm text-gray-600">PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm text-gray-600">Money-back guarantee</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div>
              {/* Billing Information */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First name</label>
                    <input
                      type="text"
                      value={session.user?.name?.split(' ')[0] || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last name</label>
                    <input
                      type="text"
                      value={session.user?.name?.split(' ')[1] || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      readOnly
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={session.user?.email || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <CheckoutForm />
            </div>
          </div>
        </div>
      </div>
    </Elements>
  )
}