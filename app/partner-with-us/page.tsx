'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Truck, Building, Users, ArrowRight, CheckCircle, Shield, Globe } from 'lucide-react'

export default function PartnerWithUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-primary-900 py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: 'url(/maritime-banner-bg.avif)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/95 via-primary-800/90 to-primary-900/95" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-full mb-6"
            >
              <Users className="h-12 w-12 text-white" />
            </motion.div>
            
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              Partner with Fixing Maritime
            </h1>
            
            <p className="text-xl leading-8 text-gray-200 mb-12">
              Join our growing network of trusted partners and expand your business opportunities in the maritime logistics industry.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Partnership Options */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
              Choose Your Partnership Type
            </h2>
            <p className="text-lg leading-8 text-gray-600">
              Select the partnership opportunity that best fits your business model and goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Truck Owner/Operator Partnership */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Header Image */}
                <div className="relative h-48 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/80 to-green-800/80" />
                  
                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-6 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                      <Truck className="h-12 w-12 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Truck Owner/Operator
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    Own trucks or operate a trucking business? Join our network to access consistent cargo loads and grow your revenue.
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3 mb-8">
                    {[
                      'Guaranteed cargo loads',
                      'Competitive payment rates',
                      'Flexible scheduling',
                      'Insurance support',
                      'Fuel advance programs',
                      'Real-time dispatch system'
                    ].map((benefit) => (
                      <div key={benefit} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/register-truck">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center group"
                    >
                      <Truck className="mr-3 h-5 w-5" />
                      Register Your Truck
                      <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Clearing and forwarding or export procurement agency Partnership */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Header Image */}
                <div className="relative h-48 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-blue-800/80" />
                  
                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-6 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                      <Building className="h-12 w-12 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Clearing and forwarding or export procurement agency
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    Experienced in logistics and maritime operations? Become our business partner and earn commissions on every deal.
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3 mb-8">
                    {[
                      'Attractive commission structure',
                      'Marketing support materials',
                      'Training and certification',
                      'Dedicated account management',
                      'Performance bonuses',
                      'Territory protection'
                    ].map((benefit) => (
                      <div key={benefit} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/partner-registration">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center group"
                    >
                      <Building className="mr-3 h-5 w-5" />
                      Become a Partner
                      <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Why Partner With Us */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
              Why Choose Fixing Maritime?
            </h2>
            <p className="text-lg leading-8 text-gray-600">
              Join a trusted network that's transforming maritime logistics across the globe.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                <Globe className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Reach</h3>
              <p className="text-gray-600">
                Access to international markets and cargo opportunities across 50+ countries.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trusted Network</h3>
              <p className="text-gray-600">
                Join a verified network of reliable partners with proven track records.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Dedicated support team available around the clock to help you succeed.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
              Ready to Start Your Partnership?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join hundreds of successful partners who have grown their business with Fixing Maritime. 
              Get started today and unlock new opportunities in maritime logistics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Contact Us First
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}