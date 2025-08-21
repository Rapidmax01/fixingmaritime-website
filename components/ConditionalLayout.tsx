'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Check if we're on an admin page
  const isAdminPage = pathname?.startsWith('/admin')
  
  if (isAdminPage) {
    // Admin pages handle their own headers
    return (
      <main className="flex-grow">
        {children}
      </main>
    )
  }
  
  // Regular site layout with header and footer
  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  )
}