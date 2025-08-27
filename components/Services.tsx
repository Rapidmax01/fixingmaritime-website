'use client'

import Link from 'next/link'
import { FileText, Truck, Ship, Package, Globe, Warehouse, FileCheck, ArrowRight, Clock, CheckCircle, Building } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import AuthLink from './AuthLink'

const services = [
  {
    name: 'Documentation',
    description: 'Complete documentation services for all your maritime needs. From bills of lading to customs paperwork.',
    icon: FileText,
    href: '/services/documentation',
    color: 'from-blue-500 to-cyan-500',
    bgImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    features: ['Bills of Lading', 'Customs Papers', 'Digital Processing'],
  },
  {
    name: 'Truck Services',
    description: 'Reliable ground transportation for cargo delivery to and from ports with real-time tracking.',
    icon: Truck,
    href: '/request-truck',
    color: 'from-green-500 to-emerald-500',
    bgImage: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    features: ['GPS Tracking', 'Door-to-Door', 'Temperature Control'],
  },
  {
    name: 'Tug Boat & Barge',
    description: 'Professional tug boat and barge services for safe and efficient marine transportation.',
    icon: Ship,
    href: '/services/tugboat-barge',
    color: 'from-purple-500 to-pink-500',
    bgImage: '/tug-boat.png',
    features: ['Harbor Towing', 'Ocean Transport', 'Heavy Cargo'],
  },
  {
    name: 'Procurement',
    description: 'Expert procurement of export goods with quality assurance and competitive pricing.',
    icon: Package,
    href: '/services/procurement',
    color: 'from-orange-500 to-red-500',
    bgImage: '/agro-product.jpg',
    features: ['Quality Control', 'Supplier Vetting', 'Price Negotiation'],
  },
  {
    name: 'Freight Forwarding',
    description: 'Global freight forwarding solutions with optimized routes and cost-effective shipping.',
    icon: Globe,
    href: '/services/freight-forwarding',
    color: 'from-indigo-500 to-blue-500',
    bgImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    features: ['Global Network', 'Route Optimization', 'Multimodal Transport'],
  },
  {
    name: 'Warehousing',
    description: 'Secure, climate-controlled warehousing facilities with inventory management systems.',
    icon: Warehouse,
    href: '/services/warehousing',
    color: 'from-teal-500 to-green-500',
    bgImage: 'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    features: ['Climate Control', 'Inventory Management', 'Pick & Pack'],
  },
  {
    name: 'Custom Clearing',
    description: 'Expert customs clearance services ensuring smooth import/export operations.',
    icon: FileCheck,
    href: '/services/custom-clearing',
    color: 'from-rose-500 to-pink-500',
    bgImage: '/custom-clearing.jpg',
    features: ['Import/Export', 'Compliance', 'Duty Optimization'],
  },
]

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="relative bg-gray-50 py-24 sm:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.h2 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-base font-semibold leading-7 text-primary-600"
          >
            Comprehensive Solutions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Our Maritime Services
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-gray-600"
          >
            End-to-end maritime solutions tailored to your business needs. Order, track, and manage all services from one platform.
          </motion.p>
        </motion.div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon
            const isHovered = hoveredIndex === index
            
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <Link
                  href={service.href}
                  className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  {/* Background Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${service.bgImage})` }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-80 group-hover:opacity-70 transition-opacity duration-300`} />
                    
                    {/* Floating Icon */}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      animate={isHovered ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>

                    {/* Status Indicator */}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                        <span className="text-xs text-white font-medium">Available</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold leading-8 text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                      {service.name}
                    </h3>
                    
                    <p className="text-sm leading-6 text-gray-600 flex-1 mb-4">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {service.features.map((feature, idx) => (
                          <motion.span
                            key={feature}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 0.9 }}
                            transition={{ delay: idx * 0.1 }}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {feature}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                    
                    {/* CTA */}
                    <motion.div 
                      className="flex items-center text-sm font-semibold text-primary-600 group-hover:text-primary-700"
                      whileHover={{ x: 5 }}
                    >
                      <span>Get Started</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-primary-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  />
                </Link>
              </motion.div>
            )
          })}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-col items-center justify-center"
        >
          <div className="max-w-4xl mx-auto relative overflow-hidden rounded-2xl shadow-2xl">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/truck-park.jpg')` }}
              />
              {/* Gradient Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-emerald-900/85 to-green-800/90" />
              {/* Additional decorative overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
            
            {/* Content Container */}
            <div className="relative z-10 p-8 lg:p-12">
            <div className="text-center">
              <motion.h3 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-2xl lg:text-3xl font-bold text-white mb-6 drop-shadow-lg"
              >
                Maximize Your Earning Potential – Join Our Professional Fleet Network
              </motion.h3>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg leading-relaxed text-gray-100 mb-8 space-y-4"
              >
                <p>
                  We invite you to take advantage of consistent job opportunities for your truck(s) by joining our established fleet. Our platform connects truck owners with reliable work assignments, ensuring steady income streams for your trucks.
                </p>
                
                <p>
                  To register your truck(s) on our platform and begin accessing available jobs, simply tap "Get Started" below.
                </p>
                
                <p className="font-semibold text-green-300">
                  Join our network today and start maximizing your trucking business potential.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AuthLink
                  href="/register-truck"
                  className="group relative inline-flex items-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-10 py-4 text-lg font-semibold text-white shadow-2xl hover:from-green-400 hover:to-emerald-400 hover:shadow-green-500/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 transition-all duration-300 border border-green-400/30"
                >
                  <Truck className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                  <span>Get Started</span>
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  
                  {/* Animated background effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </AuthLink>
              </motion.div>

              {/* Additional visual elements */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-6 flex items-center justify-center space-x-8 text-sm text-green-300"
              >
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Consistent Work</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Steady Income</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Professional Network</span>
                </div>
              </motion.div>
            </div>
          </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}