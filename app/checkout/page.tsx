'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Lock, CreditCard, Check, ArrowLeft, User, Mail, Phone, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutFormProps {
  isGuest: boolean
}

const CheckoutForm = ({ isGuest }: CheckoutFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [cartItems, setCartItems] = useState<any[]>([])
  
  // Guest checkout form fields
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })

  useEffect(() => {
    // Load cart items from sessionStorage or from user's cart
    if (isGuest) {
      const guestOrder = sessionStorage.getItem('guestOrder')
      if (guestOrder) {
        const order = JSON.parse(guestOrder)
        setCartItems([{
          id: '1',
          serviceName: order.serviceName,
          plan: order.plan,
          price: typeof order.price === 'number' ? order.price : parseFloat(order.price.replace(/[^0-9.]/g, '')),
          quantity: order.quantity
        }])
      }
    } else {
      // TODO: Load from user's saved cart
      setCartItems([])
    }
  }, [isGuest])

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  useEffect(() => {
    if (total > 0) {
      // Create PaymentIntent on component mount
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(total * 100) }), // Convert to cents
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch((error) => {
          console.error('Error creating payment intent:', error)
          toast.error('Failed to initialize payment')
        })
    }
  }, [total])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    // Validate guest info if guest checkout
    if (isGuest) {
      if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
        toast.error('Please fill in all required fields')
        return
      }
    }

    setIsLoading(true)

    const card = elements.getElement(CardElement)

    if (!card) {
      setIsLoading(false)
      return
    }

    const billingDetails = isGuest ? {
      name: guestInfo.name,
      email: guestInfo.email,
      phone: guestInfo.phone,
      address: {
        line1: guestInfo.address,
        city: guestInfo.city,
        state: guestInfo.state,
        postal_code: guestInfo.zipCode,
        country: 'US'
      }
    } : {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: billingDetails,
      }
    })

    if (result.error) {
      toast.error(result.error.message || 'Payment failed')
      setIsLoading(false)
    } else {
      toast.success('Payment successful!')
      // Clear guest order if guest checkout
      if (isGuest) {
        sessionStorage.removeItem('guestOrder')
      }
      router.push('/order-confirmation?payment_intent=' + result.paymentIntent.id)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Guest Information Form */}
      {isGuest && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                  className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                  className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                  className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={guestInfo.address}
                  onChange={(e) => setGuestInfo({ ...guestInfo, address: e.target.value })}
                  className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="123 Main St"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Guest Checkout:</strong> You'll receive an order confirmation email with tracking details. 
              Consider <Link href="/signup" className="underline font-medium">creating an account</Link> for easier order management.
            </p>
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
        
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">{item.serviceName}</p>
                <p className="text-sm text-gray-500">{item.plan} × {item.quantity}</p>
              </div>
              <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <p className="text-gray-600">Subtotal</p>
              <p className="text-gray-900">${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-gray-600">Tax (8%)</p>
              <p className="text-gray-900">${tax.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <p>Total</p>
              <p>${total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
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
        disabled={!stripe || isLoading || cartItems.length === 0}
        className="w-full flex items-center justify-center rounded-md bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Pay ${total.toFixed(2)}
          </>
        )}
      </button>
    </form>
  )
}

export default function Checkout() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isGuest = searchParams.get('guest') === 'true'

  // Redirect to login if not authenticated and not guest checkout
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session && !isGuest) {
      router.push('/login')
    }
  }, [session, status, isGuest, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mb-8">
          <Link
            href="/services"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to services
          </Link>
          
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            {isGuest ? 'Guest Checkout' : 'Checkout'}
          </h1>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
          <div className="lg:col-span-8">
            <Elements stripe={stripePromise}>
              <CheckoutForm isGuest={isGuest} />
            </Elements>
          </div>

          {/* Security badges */}
          <div className="mt-8 lg:col-span-4 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Secure Checkout</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">SSL Encrypted</p>
                    <p className="text-sm text-gray-500">Your information is protected</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">PCI Compliant</p>
                    <p className="text-sm text-gray-500">We meet the highest security standards</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Money-back Guarantee</p>
                    <p className="text-sm text-gray-500">100% satisfaction or your money back</p>
                  </div>
                </div>
              </div>

              {isGuest && (
                <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                  <p className="text-sm text-primary-800">
                    <strong>Why create an account?</strong><br />
                    Track orders, save preferences, and get exclusive member benefits.
                  </p>
                  <Link
                    href="/signup"
                    className="mt-2 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Sign up now →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}