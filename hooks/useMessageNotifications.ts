'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

export function useMessageNotifications() {
  const { data: session } = useSession()
  const [unreadCount, setUnreadCount] = useState(0)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const fetchUnreadCount = useCallback(async () => {
    if (!session?.user?.email) return

    try {
      const response = await fetch('/api/messages?type=inbox&status=unread&count=true')
      if (response.ok) {
        const data = await response.json()
        const newUnreadCount = data.unreadCount || 0
        
        // Show notification if unread count increased
        if (lastChecked && newUnreadCount > unreadCount && unreadCount > 0) {
          toast.success(`You have ${newUnreadCount - unreadCount} new message(s)`)
        }
        
        setUnreadCount(newUnreadCount)
        setLastChecked(new Date())
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }, [session?.user?.email, unreadCount, lastChecked])

  // Poll for new messages every 30 seconds
  useEffect(() => {
    if (!session?.user?.email) return

    // Initial fetch
    fetchUnreadCount()

    // Set up polling interval
    const interval = setInterval(fetchUnreadCount, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [session?.user?.email, fetchUnreadCount])

  return {
    unreadCount,
    refreshUnreadCount: fetchUnreadCount
  }
}