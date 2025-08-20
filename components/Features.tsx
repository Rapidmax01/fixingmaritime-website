'use client'

import { Shield, Clock, Globe, CreditCard, Users, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    name: 'Real-Time Tracking',
    description: 'Monitor your shipments 24/7 with our advanced GPS tracking system. Get instant updates on location and status.',
    icon: Clock,
  },
  {
    name: 'Secure Payments',
    description: 'Multiple payment options with bank-level encryption. Pay securely with credit cards, bank transfers, or digital wallets.',
    icon: CreditCard,
  },
  {
    name: 'Global Network',
    description: 'Access to a worldwide network of ports, carriers, and logistics partners for seamless international shipping.',
    icon: Globe,
  },
  {
    name: 'Insurance Coverage',
    description: 'Comprehensive cargo insurance options to protect your valuable shipments throughout the journey.',
    icon: Shield,
  },
  {
    name: 'Expert Support',
    description: 'Dedicated account managers and 24/7 customer support to assist with all your maritime logistics needs.',
    icon: Users,
  },
  {
    name: 'Analytics Dashboard',
    description: 'Detailed analytics and reporting tools to optimize your supply chain and reduce shipping costs.',
    icon: BarChart3,
  },
]

export default function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Why Choose Us</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for maritime logistics
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform combines cutting-edge technology with decades of maritime expertise to deliver exceptional service.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col"
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                      <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </motion.div>
              )
            })}
          </dl>
        </div>
      </div>
    </div>
  )
}