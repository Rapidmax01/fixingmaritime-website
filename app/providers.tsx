'use client'

import { SessionProvider } from 'next-auth/react'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ContentProvider } from '@/contexts/ContentContext'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }))

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ContentProvider>
          {children}
        </ContentProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}