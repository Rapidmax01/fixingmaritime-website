'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Truck, User, Mail, Phone, MapPin, FileText, CreditCard, Upload, CheckCircle, Building } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface PartnerFormData {
  // Company & Owner Information
  companyName: string
  ownerName: string
  email: string
  phoneNumber: string
  homeAddress: string
  officeWarehouseAddress: string
  
  // Bank Account Details
  bankName: string
  accountNumber: string
  accountName: string
  
  // Next of Kin Information
  nextOfKinName: string
  nextOfKinRelationship: string
  nextOfKinAddress: string
  nextOfKinPhone: string
  
  // Document Uploads (file names/URLs)
  nationalIdCard: string
  utilityBill: string
  cacRegistration: string
  otherDocuments: string
  
  // Agreement
  agreedToTerms: boolean
  agreedToPrivacy: boolean
}

export default function PartnerRegistration() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  const [formData, setFormData] = useState<PartnerFormData>({
    // Company & Owner Information
    companyName: '',
    ownerName: '',
    email: '',
    phoneNumber: '',
    homeAddress: '',
    officeWarehouseAddress: '',
    
    // Bank Account Details
    bankName: '',
    accountNumber: '',
    accountName: '',
    
    // Next of Kin Information
    nextOfKinName: '',
    nextOfKinRelationship: '',
    nextOfKinAddress: '',
    nextOfKinPhone: '',
    
    // Document Uploads
    nationalIdCard: '',
    utilityBill: '',
    cacRegistration: '',
    otherDocuments: '',
    
    // Agreement
    agreedToTerms: false,
    agreedToPrivacy: false
  })

  const updateFormData = (field: keyof PartnerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validatePage = (page: number) => {
    switch (page) {
      case 1:
        // Company & Owner info
        return formData.companyName && formData.ownerName && formData.email && 
               formData.phoneNumber && formData.homeAddress && formData.officeWarehouseAddress;
      case 2:
        // Next of Kin & Bank details
        return formData.nextOfKinName && formData.nextOfKinRelationship && 
               formData.nextOfKinAddress && formData.nextOfKinPhone &&
               formData.bankName && formData.accountNumber && formData.accountName;
      case 3:
        // Documents & Agreement
        return formData.nationalIdCard && formData.utilityBill && 
               formData.cacRegistration && formData.agreedToTerms && 
               formData.agreedToPrivacy;
      default:
        return true;
    }
  }

  const nextPage = () => {
    if (validatePage(currentPage)) {
      setCurrentPage(prev => Math.min(prev + 1, 4))
    } else {
      toast.error('Please fill in all required fields')
    }
  }

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validatePage(3)) {
      toast.error('Please fill in all required fields and agree to terms')
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/partner-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setCurrentPage(4)
        toast.success('Registration submitted successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Network error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const pages = [
    { number: 1, title: 'Company & Owner Info', description: 'Company name, owner details, addresses' },
    { number: 2, title: 'Next of Kin & Bank', description: 'Emergency contact and bank details' },
    { number: 3, title: 'Documents & Agreement', description: 'Upload required documents and agree to terms' },
    { number: 4, title: 'Complete', description: 'Registration confirmation' }
  ]

  // Show success page after submission
  if (submitSuccess && currentPage === 4) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted!</h2>
            <p className="text-gray-600">
              Thank you for your interest in partnering with Fixing Maritime. We'll review your application and get back to you within 2-3 business days.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
              <ul className="text-sm text-blue-800 space-y-1 text-left">
                <li>• Document verification (1-2 days)</li>
                <li>• Background check completion</li>
                <li>• Partnership agreement review</li>
                <li>• Onboarding and system setup</li>
              </ul>
            </div>
            
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Homepage
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Homepage
          </Link>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Building className="h-12 w-12 text-primary-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Partner Registration</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join Fixing Maritime as a trusted partner. Register your clearing and forwarding agency or export procurement agency.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {pages.map((page, index) => (
                <div key={page.number} className={`flex-1 ${index < pages.length - 1 ? 'pr-2' : ''}`}>
                  <div className="relative">
                    <div className={`h-2 rounded-full ${
                      currentPage >= page.number ? 'bg-primary-600' : 'bg-gray-200'
                    }`} />
                    <div className={`absolute -top-1 ${
                      index === 0 ? 'left-0' : index === pages.length - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2'
                    }`}>
                      <div className={`w-4 h-4 rounded-full ${
                        currentPage >= page.number ? 'bg-primary-600' : 'bg-gray-300'
                      } border-2 border-white`} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className={`text-xs font-medium ${
                      currentPage >= page.number ? 'text-primary-600' : 'text-gray-500'
                    }`}>{page.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{page.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Page 1: Company & Owner Information */}
          {currentPage === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Company & Owner Information</h2>
              
              {/* Company Information Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Company Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => updateFormData('companyName', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Your Transport Company Ltd"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Owner's Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.ownerName}
                        onChange={(e) => updateFormData('ownerName', e.target.value)}
                        className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="contact@company.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                        className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="+234 xxx xxx xxxx"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Address Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Address Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Home Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.homeAddress}
                        onChange={(e) => updateFormData('homeAddress', e.target.value)}
                        className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Complete home address"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Office/Warehouse Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.officeWarehouseAddress}
                        onChange={(e) => updateFormData('officeWarehouseAddress', e.target.value)}
                        className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Office/warehouse location"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Page 2: Next of Kin & Bank Details */}
          {currentPage === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Next of Kin & Bank Details</h2>
              
              {/* Next of Kin Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Next of Kin Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Next of Kin Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.nextOfKinName}
                        onChange={(e) => updateFormData('nextOfKinName', e.target.value)}
                        className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Full name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relationship *
                    </label>
                    <select
                      value={formData.nextOfKinRelationship}
                      onChange={(e) => updateFormData('nextOfKinRelationship', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="">Select relationship</option>
                      <option value="spouse">Spouse</option>
                      <option value="parent">Parent</option>
                      <option value="child">Child</option>
                      <option value="sibling">Sibling</option>
                      <option value="friend">Friend</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Next of Kin Home Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.nextOfKinAddress}
                        onChange={(e) => updateFormData('nextOfKinAddress', e.target.value)}
                        className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Complete address"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Next of Kin Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={formData.nextOfKinPhone}
                        onChange={(e) => updateFormData('nextOfKinPhone', e.target.value)}
                        className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="+234 xxx xxx xxxx"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bank Account Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Bank Account Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name *
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.bankName}
                        onChange={(e) => updateFormData('bankName', e.target.value)}
                        className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Bank name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.accountNumber}
                      onChange={(e) => updateFormData('accountNumber', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Account number"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.accountName}
                      onChange={(e) => updateFormData('accountName', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Account holder name"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Page 3: Documents & Agreement */}
          {currentPage === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Documents & Agreement</h2>
              
              {/* Document Notice */}
              <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800 mb-1">Important Document Requirements</p>
                    <p className="text-sm text-amber-700">All documents must be valid and clearly readable. Expired or unclear documents will result in application rejection.</p>
                  </div>
                </div>
              </div>
              
              {/* Document Uploads Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Required Documents</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <Upload className="h-4 w-4 mr-2 text-gray-500" />
                        National Identity Card *
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        required
                        onChange={(e) => updateFormData('nationalIdCard', e.target.files?.[0]?.name || '')}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Valid government-issued ID (NIN, Driver's License, Passport)</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <Upload className="h-4 w-4 mr-2 text-gray-500" />
                        Utility Bill *
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        required
                        onChange={(e) => updateFormData('utilityBill', e.target.files?.[0]?.name || '')}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Recent utility bill (electricity, water, or gas) not older than 3 months</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <Upload className="h-4 w-4 mr-2 text-gray-500" />
                        CAC Registration *
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        required
                        onChange={(e) => updateFormData('cacRegistration', e.target.files?.[0]?.name || '')}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Company registration certificate from CAC</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <Upload className="h-4 w-4 mr-2 text-gray-500" />
                        Other Supporting Documents
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        multiple
                        onChange={(e) => updateFormData('otherDocuments', Array.from(e.target.files || []).map(f => f.name).join(', '))}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Any additional documents to support your application (optional)</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Agreement Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Terms & Conditions</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={formData.agreedToTerms}
                        onChange={(e) => updateFormData('agreedToTerms', e.target.checked)}
                        className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        I agree to the <Link href="/terms" className="text-primary-600 hover:underline">Terms and Conditions</Link> and 
                        confirm that all information provided is accurate and complete. *
                      </span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={formData.agreedToPrivacy}
                        onChange={(e) => updateFormData('agreedToPrivacy', e.target.checked)}
                        className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        I have read and agree to the <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>. *
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>
          
          {currentPage < 3 ? (
            <button
              onClick={nextPage}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Next
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Application
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}