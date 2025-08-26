'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'

const benefits = [
  'Free account setup',
  'No hidden fees',
  '24/7 customer support',
  'Start shipping today',
]

export default function CTA() {
  const { data: session } = useSession()
  
  // Don't show CTA to signed-in users
  if (session) {
    return null
  }
  
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative isolate overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16"
        >
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to streamline your maritime logistics?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-100">
            Join hundreds of businesses that trust Fixing Maritime for their shipping needs. Get started in minutes.
          </p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center text-white">
                <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/signup"
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200 hover:scale-105"
            >
              Create Free Account
              <ArrowRight className="inline-block ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold leading-6 text-white hover:text-gray-100"
            >
              Contact Sales <span aria-hidden="true">→</span>
            </Link>
          </div>
          
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle cx={512} cy={512} r={512} fill="url(#gradient)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="gradient">
                <stop stopColor="#7dd3fc" />
                <stop offset={1} stopColor="#0284c7" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
    </div>
  )
}