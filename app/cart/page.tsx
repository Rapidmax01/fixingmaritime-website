'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

// Mock cart data - would come from state management in real app
const initialCartItems = [
  {
    id: '1',
    serviceId: 'documentation',
    serviceName: 'Documentation Services',
    plan: 'Professional',
    price: 300,
    quantity: 1,
    features: ['Up to 15 documents', 'Express processing (1-2 days)', 'Priority support', 'Document storage'],
  },
  {
    id: '2',
    serviceId: 'freight',
    serviceName: 'Freight Forwarding',
    plan: 'FCL Shipping',
    price: 2000,
    quantity: 2,
    features: ['Full container', 'Door-to-door option', 'Real-time tracking'],
  },
]

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [isLoading, setIsLoading] = useState(false)

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id))
    toast.success('Item removed from cart')
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  const handleCheckout = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to payment page
      window.location.href = '/checkout'
    }, 2000)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-600">Start adding services to your cart</p>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
          >
            Browse Services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/services"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue shopping
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="mt-2 text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'service' : 'services'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.serviceName}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Plan: {item.plan}
                        </p>
                        <ul className="mt-3 space-y-1">
                          {item.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-2 text-primary-600">•</span>
                              <span className="text-sm text-gray-600">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="ml-6 flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            ${item.price.toLocaleString()} each
                          </p>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Total */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900">Order Total</h3>
                
                <div className="mt-6 space-y-4">
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
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ${total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="mt-6 w-full rounded-md bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>

                <p className="mt-4 text-xs text-gray-500 text-center">
                  Secure checkout powered by Stripe
                </p>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                <h4 className="font-semibold text-gray-900">Why choose us?</h4>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span className="text-sm text-gray-600">24/7 customer support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span className="text-sm text-gray-600">Secure payments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span className="text-sm text-gray-600">Real-time tracking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span className="text-sm text-gray-600">Money-back guarantee</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}