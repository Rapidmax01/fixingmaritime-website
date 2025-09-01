'use client'

import Link from 'next/link'
import { FileText, Truck, Ship, Package, Globe, Warehouse, FileCheck, ArrowRight, Clock, CheckCircle, Building, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import AuthLink from './AuthLink'

const services = [
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
    name: 'Custom Clearance Agent',
    description: 'Complete documentation and customs clearance services for all your maritime needs.',
    icon: FileCheck,
    href: '/services/custom-clearing',
    color: 'from-rose-500 to-pink-500',
    bgImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    features: ['Bills of Lading', 'Customs Papers', 'Digital Processing'],
  },
]

interface ServiceCardProps {
  service: typeof services[0]
  isActive: boolean
}

function ServiceCard({ service, isActive }: ServiceCardProps) {
  const Icon = service.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isActive ? 1 : 0.7, 
        scale: isActive ? 1 : 0.95,
        y: isActive ? 0 : 10
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`relative ${isActive ? 'z-10' : 'z-0'}`}
    >
      <Link
        href={service.href}
        className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-[400px]"
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
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
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
              {service.features.slice(0, 3).map((feature, idx) => (
                <span
                  key={feature}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {feature}
                </span>
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
}

export default function ServiceCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Mount effect for hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Auto-advance functionality
  useEffect(() => {
    if (!isMounted) return

    if (isPlaying && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length)
      }, 5000) // 5 seconds per slide
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, isPaused, isMounted])

  // Keyboard navigation
  useEffect(() => {
    if (!isMounted) return

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious()
      } else if (event.key === 'ArrowRight') {
        goToNext()
      } else if (event.key === ' ') {
        event.preventDefault()
        togglePlayPause()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isMounted])

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + services.length) % services.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMouseEnter = () => {
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  // Calculate visible services (show 3 cards on desktop, 1 on mobile)
  const getVisibleServices = () => {
    if (!isMounted || typeof window === 'undefined') return services.slice(0, 3)
    const visibleCount = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1
    const services_copy = [...services, ...services] // Duplicate for seamless loop
    return Array.from({ length: visibleCount }, (_, i) => {
      const index = (currentIndex + i) % services.length
      return services_copy[index]
    })
  }

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
        
        {/* Carousel Container */}
        <div 
          className="mx-auto mt-16 max-w-6xl"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="region"
          aria-label="Services carousel"
        >
          {!isMounted ? (
            // Static fallback during hydration
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {services.slice(0, 3).map((service, index) => (
                <ServiceCard key={service.name} service={service} isActive={index === 0} />
              ))}
            </div>
          ) : (
            <>
              {/* Carousel Content */}
              <div className="relative overflow-hidden rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  <AnimatePresence>
                    {[0, 1, 2].map((offset) => {
                      const serviceIndex = (currentIndex + offset) % services.length
                      const service = services[serviceIndex]
                      return (
                        <motion.div
                          key={`${serviceIndex}-${currentIndex}`}
                          initial={{ opacity: 0, x: 300 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -300 }}
                          transition={{ duration: 0.5, delay: offset * 0.1 }}
                          className={offset >= 1 ? 'hidden md:block' : offset >= 2 ? 'hidden lg:block' : ''}
                        >
                          <ServiceCard 
                            service={service} 
                            isActive={offset === 0}
                          />
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-center mt-8 space-x-6">
            {/* Previous Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToPrevious}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl text-primary-600 hover:text-primary-700 transition-all duration-200 border border-gray-200"
              aria-label="Previous service"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>

            {/* Play/Pause Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlayPause}
              className="p-3 rounded-full bg-primary-600 text-white shadow-lg hover:shadow-xl hover:bg-primary-700 transition-all duration-200"
              aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </motion.button>

            {/* Next Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToNext}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl text-primary-600 hover:text-primary-700 transition-all duration-200 border border-gray-200"
              aria-label="Next service"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center mt-6 space-x-2">
            {services.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to service ${index + 1}: ${services[index].name}`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full max-w-md mx-auto bg-gray-200 rounded-full h-1 overflow-hidden">
            <motion.div
              className="bg-primary-600 h-full"
              initial={{ width: '0%' }}
              animate={{ width: isPlaying && !isPaused ? '100%' : '0%' }}
              transition={{
                duration: isPlaying && !isPaused ? 5 : 0,
                ease: 'linear',
                repeat: isPlaying && !isPaused ? Infinity : 0,
              }}
            />
          </div>

          {/* Service Counter */}
          <div className="text-center mt-4 text-sm text-gray-600">
            <span className="font-semibold text-primary-600">{currentIndex + 1}</span> of {services.length} services
          </div>

              {/* Keyboard Instructions */}
              <div className="text-center mt-2 text-xs text-gray-400">
                Use arrow keys to navigate • Spacebar to play/pause
              </div>
            </>
          )}
        </div>
        
        {/* Fleet Registration CTA remains the same */}
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