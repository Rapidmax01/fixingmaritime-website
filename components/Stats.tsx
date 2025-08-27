'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Globe, Ship, Clock, Users, TrendingUp, CheckCircle, Package, Anchor } from 'lucide-react'
import AuthLink from './AuthLink'

const stats = [
  { 
    id: 1, 
    name: 'Countries Served', 
    value: 50, 
    suffix: '+',
    icon: Globe,
    color: 'text-blue-400',
    bgColor: 'from-blue-500/20 to-cyan-500/20',
    description: 'Global reach across continents'
  },
  { 
    id: 2, 
    name: 'Shipments Delivered', 
    value: 10000, 
    suffix: '+',
    icon: Package,
    color: 'text-green-400',
    bgColor: 'from-green-500/20 to-emerald-500/20',
    description: 'Successfully completed deliveries'
  },
  { 
    id: 3, 
    name: 'On-Time Delivery Rate', 
    value: 98, 
    suffix: '%',
    icon: Clock,
    color: 'text-yellow-400',
    bgColor: 'from-yellow-500/20 to-orange-500/20',
    description: 'Punctual and reliable service'
  },
  { 
    id: 4, 
    name: 'Happy Clients', 
    value: 500, 
    suffix: '+',
    icon: Users,
    color: 'text-purple-400',
    bgColor: 'from-purple-500/20 to-pink-500/20',
    description: 'Trusted business partners'
  },
]

function Counter({ from, to, duration = 2, suffix = '' }: { from: number; to: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(from)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrame: number

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      
      setCount(Math.floor(progress * (to - from) + from))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount)
      }
    }

    animationFrame = requestAnimationFrame(updateCount)

    return () => cancelAnimationFrame(animationFrame)
  }, [from, to, duration, isInView])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export default function Stats() {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)

  return (
    <div className="relative bg-primary-900 py-24 sm:py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/maritime-banner-bg.avif)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/95 via-primary-800/90 to-primary-900/95" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-10 left-10 text-white/5"
        >
          <Ship className="h-32 w-32" />
        </motion.div>
        
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 30, 0],
            rotate: [0, -15, 15, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 5,
          }}
          className="absolute bottom-10 right-20 text-white/5"
        >
          <Anchor className="h-28 w-28" />
        </motion.div>

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/5"
        >
          <TrendingUp className="h-40 w-40" />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.h2 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Trusted by businesses worldwide
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-lg leading-8 text-gray-300"
            >
              Our performance metrics demonstrate our commitment to excellence
            </motion.p>
          </motion.div>
          
          <dl className="mt-16 grid grid-cols-1 gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              const isHovered = hoveredStat === stat.id
              
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    transition: { duration: 0.2 }
                  }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  onHoverStart={() => setHoveredStat(stat.id)}
                  onHoverEnd={() => setHoveredStat(null)}
                  className={`relative group cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300`}
                >
                  {/* Animated Background */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    animate={isHovered ? {
                      background: [
                        `linear-gradient(135deg, ${stat.bgColor.split(' ')[1]}, ${stat.bgColor.split(' ')[3]})`,
                        `linear-gradient(225deg, ${stat.bgColor.split(' ')[3]}, ${stat.bgColor.split(' ')[1]})`,
                        `linear-gradient(135deg, ${stat.bgColor.split(' ')[1]}, ${stat.bgColor.split(' ')[3]})`
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  <div className="relative p-8">
                    {/* Icon */}
                    <motion.div
                      className="flex justify-center mb-4"
                      animate={isHovered ? { 
                        rotate: [0, -10, 10, 0], 
                        scale: [1, 1.1, 1] 
                      } : {}}
                      transition={{ duration: 0.6 }}
                    >
                      <div className={`p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-300`}>
                        <Icon className={`h-6 w-6 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                      </div>
                    </motion.div>

                    {/* Counter */}
                    <dd className="text-4xl font-bold tracking-tight text-white mb-2">
                      <Counter from={0} to={stat.value} duration={2.5} suffix={stat.suffix} />
                    </dd>
                    
                    {/* Name */}
                    <dt className="text-sm font-semibold leading-6 text-gray-300 group-hover:text-white transition-colors mb-2">
                      {stat.name}
                    </dt>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={isHovered ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                      className="text-xs text-gray-400 overflow-hidden"
                    >
                      {stat.description}
                    </motion.p>

                    {/* Progress Bar */}
                    <motion.div 
                      className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden"
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ delay: index * 0.2 + 1, duration: 1 }}
                    >
                      <motion.div
                        className={`h-full bg-gradient-to-r ${stat.bgColor.replace('/20', '')}`}
                        initial={{ width: '0%' }}
                        whileInView={{ width: '100%' }}
                        transition={{ delay: index * 0.2 + 1.5, duration: 1.5, ease: "easeOut" }}
                      />
                    </motion.div>
                  </div>

                  {/* Hover Glow Effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${stat.color.replace('text-', '').replace('-400', '')}, transparent 70%)`
                    }}
                  />
                </motion.div>
              )
            })}
          </dl>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="mt-16 text-center"
          >
            <p className="text-gray-300 mb-6">Ready to be part of our success story?</p>
            <AuthLink href="/partner-registration">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 hover:border-white/40 transition-all duration-300"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Join Our Network
              </motion.button>
            </AuthLink>
          </motion.div>
        </div>
      </div>
    </div>
  )
}