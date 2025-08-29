'use client'

import { useState, useEffect } from 'react'

interface RegistrationCounts {
  truckRequests: number
  truckRegistrations: number
  partnerRegistrations: number
  loading: boolean
}

export function useRegistrationCounts(): RegistrationCounts {
  const [counts, setCounts] = useState<RegistrationCounts>({
    truckRequests: 0,
    truckRegistrations: 0,
    partnerRegistrations: 0,
    loading: true
  })

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [truckRequestsRes, truckRegistrationsRes, partnerRegistrationsRes] = await Promise.all([
          fetch('/api/admin/truck-requests'),
          fetch('/api/admin/truck-registrations'),
          fetch('/api/admin/partner-registrations')
        ])

        const [truckRequestsData, truckRegistrationsData, partnerRegistrationsData] = await Promise.all([
          truckRequestsRes.json(),
          truckRegistrationsRes.json(),
          partnerRegistrationsRes.json()
        ])

        setCounts({
          truckRequests: truckRequestsData.requests?.length || 0,
          truckRegistrations: truckRegistrationsData.registrations?.length || 0,
          partnerRegistrations: partnerRegistrationsData.registrations?.length || 0,
          loading: false
        })
      } catch (error) {
        console.error('Error fetching registration counts:', error)
        setCounts(prev => ({ ...prev, loading: false }))
      }
    }

    fetchCounts()
  }, [])

  return counts
}