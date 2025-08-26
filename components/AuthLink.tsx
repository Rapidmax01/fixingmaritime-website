'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

interface AuthLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function AuthLink({ href, children, className, onClick }: AuthLinkProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (onClick) {
      onClick()
    }

    // If user is not authenticated, redirect to signup with callback
    if (status === 'unauthenticated' || !session) {
      const callbackUrl = encodeURIComponent(href)
      router.push(`/signup?callbackUrl=${callbackUrl}`)
    } else {
      // User is authenticated, go directly to the target URL
      router.push(href)
    }
  }

  // Show as regular link but handle click with authentication logic
  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  )
}