'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

// Generate or get session ID
function getSessionId(): string {
  const KEY = 'fm_session_id'
  let sessionId = sessionStorage.getItem(KEY)
  
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem(KEY, sessionId)
  }
  
  return sessionId
}

export default function PageTracker() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const startTime = useRef<number>(Date.now())
  const pageTracked = useRef<boolean>(false)

  useEffect(() => {
    // Reset tracking flag when pathname changes
    pageTracked.current = false
    startTime.current = Date.now()

    // Track page visit
    const trackVisit = async (duration?: number) => {
      if (pageTracked.current && !duration) return // Prevent duplicate initial tracking
      
      try {
        const sessionId = getSessionId()
        const pageName = getPageName(pathname)
        
        await fetch('/api/track-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(session?.user && { 'Authorization': `User ${session.user.email}` })
          },
          body: JSON.stringify({
            sessionId,
            page: pageName,
            pathname,
            referrer: document.referrer,
            duration
          })
        })
        
        if (!duration) {
          pageTracked.current = true
        }
      } catch (error) {
        // Silently fail for page tracking errors
        console.warn('Page tracking temporarily unavailable:', error instanceof Error ? error.message : 'Unknown error')
      }
    }

    // Track initial page load
    trackVisit()

    // Track page duration on unmount or page change
    return () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000)
      if (duration > 0) {
        trackVisit(duration)
      }
    }
  }, [pathname, session])

  // Also track when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000)
      if (duration > 0) {
        const sessionId = getSessionId()
        const pageName = getPageName(pathname)
        
        navigator.sendBeacon('/api/track-visit', JSON.stringify({
          sessionId,
          page: pageName,
          pathname,
          referrer: document.referrer,
          duration
        }))
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [pathname])

  return null // This component doesn't render anything
}

// Helper function to get human-readable page names
function getPageName(pathname: string): string {
  const routes: Record<string, string> = {
    '/': 'Home',
    '/services': 'Services',
    '/about': 'About Us',
    '/contact': 'Contact',
    '/login': 'Login',
    '/register': 'Register',
    '/dashboard': 'Customer Dashboard',
    '/orders': 'My Orders',
    '/invoices': 'My Invoices',
    '/quote-request': 'Request Quote',
    '/partner-with-us': 'Partner With Us',
    '/truck-registration': 'Truck Registration',
    '/admin': 'Admin Dashboard',
    '/admin/users': 'Admin - Users',
    '/admin/orders': 'Admin - Orders',
    '/admin/services': 'Admin - Services',
    '/admin/content': 'Admin - Content',
    '/admin/analytics': 'Admin - Analytics',
    '/admin/invoices': 'Admin - Invoices',
    '/admin/quotes': 'Admin - Quotes',
    '/admin/inbox': 'Admin - Inbox',
    '/admin/truck-requests': 'Admin - Truck Requests',
    '/admin/truck-registrations': 'Admin - Truck Registrations',
    '/admin/partner-registrations': 'Admin - Partner Registrations'
  }

  // Check for exact match
  if (routes[pathname]) {
    return routes[pathname]
  }

  // Check for dynamic routes
  if (pathname.startsWith('/services/')) {
    return 'Service Detail'
  }
  if (pathname.startsWith('/admin/orders/')) {
    return 'Admin - Order Detail'
  }
  if (pathname.startsWith('/orders/')) {
    return 'Order Detail'
  }

  // Default fallback
  return pathname
}