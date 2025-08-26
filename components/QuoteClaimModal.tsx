'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Search, Link2, CheckCircle, AlertCircle, Clock, Package } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Quote {
  id: string
  serviceName: string
  status: string
  createdAt: string
  projectDescription: string
}

interface QuoteClaimModalProps {
  isOpen: boolean
  onClose: () => void
  onQuotesClaimed?: () => void
}

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  quoted: { color: 'bg-blue-100 text-blue-800', icon: Package },
  accepted: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  rejected: { color: 'bg-red-100 text-red-800', icon: X },
  completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle }
}

export default function QuoteClaimModal({ isOpen, onClose, onQuotesClaimed }: QuoteClaimModalProps) {
  const [step, setStep] = useState<'search' | 'confirm' | 'success'>('search')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [foundQuotes, setFoundQuotes] = useState<Quote[]>([])
  const [claimedCount, setClaimedCount] = useState(0)

  const handleSearch = async () => {
    if (!email) {
      toast.error('Please enter an email address')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/quote-requests/claim?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (response.ok) {
        setFoundQuotes(data.quotes)
        setStep(data.count > 0 ? 'confirm' : 'search')
        
        if (data.count === 0) {
          toast('No unclaimed quotes found for this email address', {
            icon: '📭',
            duration: 4000,
          })
        }
      } else {
        toast.error(data.error || 'Failed to search for quotes')
      }
    } catch (error) {
      console.error('Error searching quotes:', error)
      toast.error('Failed to search for quotes')
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/quote-requests/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setClaimedCount(data.claimedCount)
        setStep('success')
        toast.success(`Successfully claimed ${data.claimedCount} quote(s)!`)
        onQuotesClaimed?.()
      } else {
        toast.error(data.error || 'Failed to claim quotes')
      }
    } catch (error) {
      console.error('Error claiming quotes:', error)
      toast.error('Failed to claim quotes')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep('search')
    setEmail('')
    setFoundQuotes([])
    setClaimedCount(0)
    onClose()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={handleClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
        >
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              onClick={handleClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
              <Link2 className="h-6 w-6 text-primary-600" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                {step === 'search' && 'Claim Your Quotes'}
                {step === 'confirm' && 'Confirm Quote Claiming'}
                {step === 'success' && 'Quotes Claimed Successfully!'}
              </h3>

              {step === 'search' && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-4">
                    If you requested quotes before creating an account, you can claim them here to see all your notifications in one place.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="claim-email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type="email"
                          id="claim-email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder="Enter email used for quotes"
                          disabled={loading}
                        />
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <button
                      onClick={handleSearch}
                      disabled={loading || !email}
                      className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Search for Quotes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {step === 'confirm' && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Found {foundQuotes.length} unclaimed quote(s) for <strong>{email}</strong>:
                  </p>

                  <div className="max-h-60 overflow-y-auto space-y-3 mb-4">
                    {foundQuotes.map((quote) => {
                      const statusInfo = statusConfig[quote.status as keyof typeof statusConfig] || statusConfig.pending
                      const StatusIcon = statusInfo.icon
                      
                      return (
                        <div key={quote.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-900">{quote.serviceName}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {quote.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-1 line-clamp-2">
                            {quote.projectDescription}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(quote.createdAt)}
                          </p>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setStep('search')}
                      className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleClaim}
                      disabled={loading}
                      className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                          Claiming...
                        </>
                      ) : (
                        `Claim ${foundQuotes.length} Quote(s)`
                      )}
                    </button>
                  </div>
                </div>
              )}

              {step === 'success' && (
                <div className="mt-4 text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    Successfully claimed <strong>{claimedCount}</strong> quote(s)! You can now see all your notifications in your dashboard.
                  </p>
                  <button
                    onClick={handleClose}
                    className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}