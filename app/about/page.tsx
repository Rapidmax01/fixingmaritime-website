'use client'

import { motion } from 'framer-motion'
import { Award, Users, Globe, Clock, Ship, Anchor } from 'lucide-react'
import { useContent } from '@/contexts/ContentContext'

const stats = [
  { name: 'Years of Experience', value: '25+' },
  { name: 'Countries Served', value: '50+' },
  { name: 'Happy Clients', value: '1,000+' },
  { name: 'Shipments Delivered', value: '100,000+' },
]

const values = [
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for excellence in every aspect of our service delivery, ensuring the highest quality standards.',
  },
  {
    icon: Users,
    title: 'Customer-Centric',
    description: 'Our clients are at the heart of everything we do. We tailor our solutions to meet your unique needs.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'With partners worldwide, we provide seamless maritime logistics solutions across the globe.',
  },
  {
    icon: Clock,
    title: 'Reliability',
    description: 'Count on us for timely, dependable service. We understand that your cargo is your business.',
  },
]

const team = [
  {
    name: 'Raphael Ugochukwu U.',
    role: 'Founder & CEO',
    bio: '30+ years in maritime industry, former naval officer with extensive experience in international shipping.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80',
  },
  {
    name: 'Maximus U.',
    role: 'Head of Technology',
    bio: 'Tech innovator bringing cutting-edge solutions to maritime logistics with AI and IoT integration.',
    image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80',
  },
]

export default function About() {
  const { content, loading } = useContent()
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 to-primary-700 min-h-[60vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-primary-700/90" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-10 text-white/10"
          >
            <Ship className="h-24 w-24" />
          </motion.div>
          
          <motion.div
            animate={{
              y: [0, 15, 0],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-20 right-20 text-white/10"
          >
            <Anchor className="h-32 w-32" />
          </motion.div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.div 
              className="flex justify-center mb-8"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <Anchor className="h-16 w-16 text-primary-300" />
              </div>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
            >
              {loading ? 'About Fixing Maritime' : (content?.sections?.about?.title || 'About Fixing Maritime')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-lg leading-8 text-gray-100"
            >
              {loading ? (
                'For over 25 years, we\'ve been the trusted partner for businesses worldwide, providing comprehensive maritime logistics solutions that keep global trade moving.'
              ) : (
                content?.sections?.about?.content || 'For over 25 years, we\'ve been the trusted partner for businesses worldwide, providing comprehensive maritime logistics solutions that keep global trade moving.'
              )}
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-10 grid grid-cols-3 gap-6"
            >
              {[
                { value: '25+', label: 'Years' },
                { value: '50+', label: 'Countries' },
                { value: '1000+', label: 'Clients' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                >
                  <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                  <p className="text-sm text-gray-300">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by thousands worldwide
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Our numbers tell the story of our commitment to excellence
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  {stat.value}
                </dd>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-16 sm:gap-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Our Story</h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Founded in 1999 by Raphael Ugochukwu U., Fixing Maritime began as a small 
                  documentation service for local shipping companies. With a vision to simplify 
                  maritime logistics, we've grown into a comprehensive solution provider.
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Today, we leverage cutting-edge technology while maintaining the personal touch 
                  that has made us a trusted partner for businesses of all sizes. From startups 
                  to Fortune 500 companies, we adapt our services to meet your unique needs.
                </p>
              </motion.div>
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8">
                  <Ship className="h-24 w-24 text-primary-600 mx-auto mb-6" />
                  <blockquote className="text-center">
                    <p className="text-lg font-medium text-gray-900">
                      "Our mission is to be the bridge between your cargo and its destination, 
                      ensuring every shipment arrives safely, on time, and within budget."
                    </p>
                    <footer className="mt-4">
                      <p className="text-sm font-semibold text-primary-600">Raphael Ugochukwu U.</p>
                      <p className="text-sm text-gray-600">Founder & CEO</p>
                    </footer>
                  </blockquote>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              These core principles guide everything we do
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4 p-6 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{value.title}</h3>
                    <p className="mt-2 text-gray-600">{value.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Leadership Team
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Meet the experts behind Fixing Maritime
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {team.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  className="mx-auto h-24 w-24 rounded-full"
                  src={person.image}
                  alt={person.name}
                />
                <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900 text-center">
                  {person.name}
                </h3>
                <p className="text-base leading-7 text-primary-600 text-center">{person.role}</p>
                <p className="mt-4 text-sm leading-6 text-gray-600 text-center">{person.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-900">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to work with us?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-100">
              Join thousands of satisfied clients who trust Fixing Maritime with their logistics needs.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/contact"
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get in touch
              </a>
              <a
                href="/services"
                className="text-sm font-semibold leading-6 text-white hover:text-gray-100"
              >
                View services <span aria-hidden="true">→</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}