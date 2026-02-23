'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { useContent } from '@/contexts/ContentContext'

const navigation = {
  company: [
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Partners', href: '/partners' },
    { name: 'Press', href: '/press' },
  ],
  support: [
    { name: 'Contact', href: '/contact' },
    { name: 'Track Order', href: '/track' },
    { name: 'FAQ', href: '/maritime-faq' },
    { name: 'Terms', href: '/terms' },
    { name: 'Privacy', href: '/privacy' },
  ],
}

export default function Footer() {
  const { content, loading } = useContent()
  return (
    <footer className="bg-navy-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-6 pt-12 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-6">
            <div>
              <span className="text-xl font-bold text-white">
                {loading ? 'Fixing Maritime' : (content?.sections?.footer?.title || 'Fixing Maritime')}
              </span>
            </div>
            <p className="text-sm leading-6 text-gray-300">
              {loading ? (
                'Your trusted partner for comprehensive maritime solutions. From documentation to freight forwarding, we handle it all.'
              ) : (
                content?.sections?.footer?.content || 'Your trusted partner for comprehensive maritime solutions. From documentation to freight forwarding, we handle it all.'
              )}
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
              <ul role="list" className="mt-4 space-y-3">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
              <ul role="list" className="mt-4 space-y-3">
                {navigation.support.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-white/10 pt-6 sm:mt-16 lg:mt-20">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <a href="mailto:info@fixingmaritime.com" className="text-sm text-gray-300 hover:text-white">info@fixingmaritime.com</a>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <a href="https://wa.me/2349073989943" className="text-sm text-green-400 hover:text-green-300">+2349073989943</a>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-300">Africa Office: 1st floor suit 4 plaza beside st. Joseph Catholic church Kirikiri Industrial area, Lagos, Nigeria</span>
            </div>
          </div>
          <p className="mt-6 text-xs leading-5 text-gray-400">
            &copy; {new Date().getFullYear()} Fixing Maritime. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}