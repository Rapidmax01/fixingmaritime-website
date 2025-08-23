'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ArrowRight, Ship, Truck, Package, FileText, Globe, Anchor } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContent } from '@/contexts/ContentContext'

export default function Hero() {
  const [hoveredService, setHoveredService] = useState<string | null>(null)
  const [currentBackground, setCurrentBackground] = useState(0)
  const { content, loading } = useContent()
  const { data: session } = useSession()

  const services = [
    { icon: FileText, name: 'Documentation', color: 'text-blue-400', link: '/services/documentation' },
    { icon: Truck, name: 'Truck Services', color: 'text-green-400', link: '/services/truck' },
    { icon: Ship, name: 'Tug & Barge', color: 'text-purple-400', link: '/services/tugboat' },
    { icon: Package, name: 'Warehousing', color: 'text-orange-400', link: '/services/warehousing' },
  ]

  const backgroundImages = [
    {
      url: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      title: 'Container Ships at Port'
    },
    {
      url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      title: 'Cargo Trucks'
    },
    {
      url: 'https://images.unsplash.com/photo-1565981063303-78c2e42aaa6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      title: 'Maritime Port Operations'
    },
    {
      url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      title: 'Container Loading'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground((prev) => (prev + 1) % backgroundImages.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Dynamic Background Images */}
      <AnimatePresence>
        {backgroundImages.map((bg, index) => (
          index === currentBackground && (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${bg.url})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-navy-900/80 via-navy-800/70 to-primary-900/80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 left-10 text-white/10"
        >
          <Ship className="h-32 w-32" />
        </motion.div>
        
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 5,
          }}
          className="absolute bottom-32 right-20 text-white/10"
        >
          <Truck className="h-24 w-24" />
        </motion.div>
        
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 right-10 text-white/5"
        >
          <Anchor className="h-40 w-40" />
        </motion.div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
      
      {/* Animated Waves */}
      <div className="absolute bottom-0 left-0 right-0">
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-20 md:h-32 bg-gradient-to-t from-white/10 via-white/5 to-transparent"
          style={{
            clipPath: 'polygon(0% 80%, 10% 60%, 20% 70%, 30% 50%, 40% 65%, 50% 45%, 60% 60%, 70% 40%, 80% 55%, 90% 35%, 100% 50%, 100% 100%, 0% 100%)'
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-12 xl:gap-x-20">
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                {loading ? (
                  'Your Gateway to Global Maritime Solutions'
                ) : (
                  content?.sections?.hero?.title || 'Your Gateway to Global Maritime Solutions'
                )}
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                {loading ? (
                  'From documentation to delivery, we provide comprehensive maritime services that keep your business moving. Track shipments in real-time, manage orders efficiently, and access world-class logistics support.'
                ) : (
                  content?.sections?.hero?.content || 'From documentation to delivery, we provide comprehensive maritime services that keep your business moving. Track shipments in real-time, manage orders efficiently, and access world-class logistics support.'
                )}
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  href={session ? "/dashboard" : "/services"}
                  className="rounded-md bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all duration-200 hover:scale-105"
                >
                  {session ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="inline-block ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/services"
                  className="text-sm font-semibold leading-6 text-white hover:text-primary-400 transition-colors"
                >
                  Explore Services <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.div>

            {/* Quick Service Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <Link key={service.name} href={service.link}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onHoverStart={() => setHoveredService(service.name)}
                      onHoverEnd={() => setHoveredService(null)}
                      className="relative group cursor-pointer"
                    >
                      <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 group-hover:bg-white/20 group-hover:border-white/30 transition-all duration-300">
                        <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all duration-300 group-hover:rotate-3">
                          <Icon className={`h-6 w-6 ${service.color} group-hover:scale-110 transition-transform duration-300`} />
                        </div>
                        <span className="mt-2 text-xs text-gray-300 text-center font-medium group-hover:text-white transition-colors">
                          {service.name}
                        </span>
                      </div>
                      
                      {hoveredService === service.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary-400 rounded-full"
                        />
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </motion.div>

            {/* Background Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 flex justify-center space-x-2"
            >
              {backgroundImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBackground(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentBackground ? 'bg-primary-400 w-6' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </motion.div>
          </div>

          {/* Hero Interactive Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-10 lg:mt-0 lg:col-span-1"
          >
            <div className="relative">
              {/* Floating Cards */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{ scale: 1.05 }}
                className="absolute -top-4 -left-4 bg-white/15 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/20 cursor-pointer group"
              >
                <Ship className="h-8 w-8 text-primary-400 group-hover:text-primary-300 transition-colors" />
                <p className="mt-2 text-sm font-semibold text-white">Live Tracking</p>
                <div className="mt-1 flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="ml-1 text-xs text-gray-300">Active</span>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-4 -right-4 bg-white/15 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/20 cursor-pointer group"
              >
                <Package className="h-8 w-8 text-green-400 group-hover:text-green-300 transition-colors" />
                <p className="mt-2 text-sm font-semibold text-white">Secure Storage</p>
                <div className="mt-1 flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="ml-1 text-xs text-gray-300">Climate Controlled</span>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                whileHover={{ scale: 1.05 }}
                className="absolute top-1/2 -left-8 bg-white/15 backdrop-blur-md rounded-xl p-3 shadow-xl border border-white/20 cursor-pointer group"
              >
                <Truck className="h-6 w-6 text-orange-400 group-hover:text-orange-300 transition-colors" />
                <p className="mt-1 text-xs font-semibold text-white">Fleet Ready</p>
              </motion.div>

              {/* Main Interactive Dashboard */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 cursor-pointer"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-2">Live Dashboard</h3>
                  <p className="text-sm text-gray-300">Real-time maritime logistics</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <motion.div 
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                    className="bg-white/10 rounded-lg p-4 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-white">
                        <motion.span
                          key="active-shipments"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          425+
                        </motion.span>
                      </h3>
                      <Ship className="h-5 w-5 text-primary-400" />
                    </div>
                    <p className="text-xs text-gray-300">Active Shipments</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                    className="bg-white/10 rounded-lg p-4 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-white">98.7%</h3>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Globe className="h-5 w-5 text-green-400" />
                      </motion.div>
                    </div>
                    <p className="text-xs text-gray-300">On-Time Rate</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                    className="bg-white/10 rounded-lg p-4 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-white">50+</h3>
                      <Package className="h-5 w-5 text-orange-400" />
                    </div>
                    <p className="text-xs text-gray-300">Countries Served</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                    className="bg-white/10 rounded-lg p-4 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-white">24/7</h3>
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-xs text-gray-300">Support Online</p>
                  </motion.div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <Link href="/track">
                    <motion.button 
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-primary-600/80 hover:bg-primary-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group"
                    >
                      <span>Track Shipment</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                  
                  <Link href="/services">
                    <motion.button 
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group border border-white/20"
                    >
                      <span>View Services</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}