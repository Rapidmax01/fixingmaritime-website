'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Truck, User, Mail, Phone, MapPin, FileText, CreditCard, Upload, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface TruckFormData {
  // Owner Information
  ownerName: string
  email: string
  mobilePhone: string
  homeAddress: string
  city: string
  state: string
  zipCode: string
  
  // Business Information
  companyName: string
  businessType: 'individual' | 'company'
  officeGarageAddress: string
  taxId: string
  yearsInBusiness: string
  areYouOwner: boolean
  connectionToTrucks: string
  positionInCompany: string
  
  // Next of Kin Information
  nextOfKinName: string
  nextOfKinAddress: string
  nextOfKinPhone: string
  nextOfKinRelationship: string
  
  // Bank Account Details
  bankName: string
  accountNumber: string
  accountName: string
  
  // Truck Information
  truckMake: string
  truckModel: string
  truckYear: string
  plateNumber: string
  vinNumber: string
  truckType: string
  capacity: string
  
  // Insurance & Documents
  insuranceProvider: string
  insuranceExpiry: string
  licenseExpiry: string
  
  // Service Areas
  serviceAreas: string[]
  willingToRelocate: boolean
  
  // Additional Info
  experience: string
  specializations: string[]
  additionalNotes: string
  
  // Document Uploads (file names/URLs)
  nationalIdCard: string
  utilityBill: string
  vehicleLicense: string
  proofOfOwnership: string
  hackneyPermit: string
  roadWorthiness: string
  
  // Agreement
  agreedToTerms: boolean
  agreedToPrivacy: boolean
}

const truckTypes = [
  'Flatbed',
  'Dry Van', 
  'Refrigerated',
  'Container Chassis',
  'Lowboy',
  'Step Deck',
  'Dump Truck',
  'Tanker',
  'Car Carrier',
  'Other'
]

const specializationOptions = [
  'Hazmat Transport',
  'Oversized Loads',
  'Refrigerated Goods',
  'Fragile Items',
  'Construction Materials',
  'Automotive Transport',
  'Expedited Delivery',
  'Long Distance Haul',
  'Local Delivery',
  'Port to Port'
]

const statesAndCities = {
  'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Oakland', 'Long Beach'],
  'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
  'Florida': ['Miami', 'Tampa', 'Orlando', 'Jacksonville', 'Fort Lauderdale'],
  'New York': ['New York City', 'Buffalo', 'Albany', 'Rochester', 'Syracuse'],
  'Illinois': ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Peoria']
}

export default function RegisterTruck() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  const [formData, setFormData] = useState<TruckFormData>({
    ownerName: '',
    email: '',
    mobilePhone: '',
    homeAddress: '',
    city: '',
    state: '',
    zipCode: '',
    companyName: '',
    businessType: 'individual',
    officeGarageAddress: '',
    taxId: '',
    yearsInBusiness: '',
    areYouOwner: true,
    connectionToTrucks: '',
    positionInCompany: '',
    nextOfKinName: '',
    nextOfKinAddress: '',
    nextOfKinPhone: '',
    nextOfKinRelationship: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    truckMake: '',
    truckModel: '',
    truckYear: '',
    plateNumber: '',
    vinNumber: '',
    truckType: '',
    capacity: '',
    insuranceProvider: '',
    insuranceExpiry: '',
    licenseExpiry: '',
    serviceAreas: [],
    willingToRelocate: false,
    experience: '',
    specializations: [],
    additionalNotes: '',
    nationalIdCard: '',
    utilityBill: '',
    vehicleLicense: '',
    proofOfOwnership: '',
    hackneyPermit: '',
    roadWorthiness: '',
    agreedToTerms: false,
    agreedToPrivacy: false
  })

  const updateFormData = (field: keyof TruckFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSpecializationToggle = (specialization: string) => {
    const current = formData.specializations
    if (current.includes(specialization)) {
      updateFormData('specializations', current.filter(s => s !== specialization))
    } else {
      updateFormData('specializations', [...current, specialization])
    }
  }

  const handleServiceAreaToggle = (area: string) => {
    const current = formData.serviceAreas
    if (current.includes(area)) {
      updateFormData('serviceAreas', current.filter(s => s !== area))
    } else {
      updateFormData('serviceAreas', [...current, area])
    }
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.ownerName && formData.email && formData.mobilePhone && formData.homeAddress
      case 2:
        return formData.companyName && formData.officeGarageAddress && formData.businessType && formData.yearsInBusiness && formData.positionInCompany && (!formData.areYouOwner ? formData.connectionToTrucks : true)
      case 3:
        return formData.nextOfKinName && formData.nextOfKinAddress && formData.nextOfKinPhone && formData.nextOfKinRelationship
      case 4:
        return formData.bankName && formData.accountNumber && formData.accountName
      case 5:
        return formData.truckMake && formData.truckModel && formData.truckYear && formData.plateNumber && formData.truckType
      case 6:
        return formData.insuranceProvider && formData.insuranceExpiry && formData.licenseExpiry
      case 7:
        return formData.nationalIdCard && formData.utilityBill && formData.vehicleLicense && formData.proofOfOwnership && formData.hackneyPermit && formData.roadWorthiness
      case 8:
        return formData.serviceAreas.length > 0 && formData.experience
      case 9:
        return formData.agreedToTerms && formData.agreedToPrivacy
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 10))
    } else {
      toast.error('Please fill in all required fields')
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(9)) {
      toast.error('Please fill in all required fields and agree to terms')
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/truck-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setCurrentStep(10)
        toast.success('Registration submitted successfully!')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Network error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: 'Personal Info', description: 'Basic contact information' },
    { number: 2, title: 'Business Details', description: 'Company information' },
    { number: 3, title: 'Next of Kin', description: 'Emergency contact' },
    { number: 4, title: 'Bank Details', description: 'Payment information' },
    { number: 5, title: 'Truck Details', description: 'Vehicle specifications' },
    { number: 6, title: 'Insurance', description: 'Insurance and licenses' },
    { number: 7, title: 'Documents', description: 'Required uploads' },
    { number: 8, title: 'Services', description: 'Service areas' },
    { number: 9, title: 'Agreement', description: 'Terms and conditions' },
    { number: 10, title: 'Complete', description: 'Registration confirmation' }
  ]

  if (submitSuccess && currentStep === 10) {
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
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Homepage
          </Link>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Truck className="h-12 w-12 text-primary-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Join Our Truck Network</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Partner with Fixing Maritime and expand your business opportunities. 
              Join our network of trusted transportation providers.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step.number <= currentStep 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.number}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p className={`text-sm font-semibold ${
                      step.number <= currentStep ? 'text-primary-600' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    step.number < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
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
                    Official Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={formData.mobilePhone}
                      onChange={(e) => updateFormData('mobilePhone', e.target.value)}
                      className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                      placeholder="+234 xxx xxx xxxx"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
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
                      placeholder="Complete home address with city, state, country"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => updateFormData('state', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => updateFormData('zipCode', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="12345"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Business Information */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Business Information</h2>
              
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
                    placeholder="Your company/business name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Office/Garage Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.officeGarageAddress}
                    onChange={(e) => updateFormData('officeGarageAddress', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Business/garage address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Type *
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => updateFormData('businessType', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="individual">Individual/Sole Proprietor</option>
                    <option value="company">Company/Corporation</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years in Business *
                  </label>
                  <select
                    value={formData.yearsInBusiness}
                    onChange={(e) => updateFormData('yearsInBusiness', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Select years</option>
                    <option value="less-than-1">Less than 1 year</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What is your position in the company? *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.positionInCompany}
                    onChange={(e) => updateFormData('positionInCompany', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Owner, Manager, Driver, etc."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Are you the owner of the trucks? *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="areYouOwner"
                      checked={formData.areYouOwner === true}
                      onChange={() => updateFormData('areYouOwner', true)}
                      className="mr-2 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">Yes, I am the owner</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="areYouOwner"
                      checked={formData.areYouOwner === false}
                      onChange={() => updateFormData('areYouOwner', false)}
                      className="mr-2 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">No, I am not the owner</span>
                  </label>
                </div>
              </div>
              
              {!formData.areYouOwner && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What is your connection to the trucks? *
                  </label>
                  <input
                    type="text"
                    required={!formData.areYouOwner}
                    value={formData.connectionToTrucks}
                    onChange={(e) => updateFormData('connectionToTrucks', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Relationship to truck owner or business"
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Next of Kin Information */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Next of Kin Information</h2>
              
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
                      placeholder="Full name of next of kin"
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
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Next of Kin Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.nextOfKinAddress}
                      onChange={(e) => updateFormData('nextOfKinAddress', e.target.value)}
                      className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Complete address of next of kin"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship with Next of Kin *
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
              </div>
            </motion.div>
          )}

          {/* Step 4: Bank Account Details */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Bank Account Details</h2>
              
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
                      placeholder="e.g., First Bank, GTBank, Access Bank"
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
                    placeholder="10-digit account number"
                  />
                </div>
                
                <div>
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
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Payment Information</h3>
                <p className="text-sm text-blue-800">
                  Your account details will be used for receiving payments. Fixing Maritime collects 5% of each loading transaction, and payments are disbursed within 24 hours.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Required Documents (Upload after approval)</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Commercial Driver's License (CDL)</li>
                  <li>• Vehicle Registration</li>
                  <li>• Commercial Insurance Certificate</li>
                  <li>• Safety Inspection Certificate</li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* Step 5: Truck Details */}
          {currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Truck Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Truck Make *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.truckMake}
                    onChange={(e) => updateFormData('truckMake', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="e.g., Volvo, Mercedes, MAN, Scania"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Truck Model *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.truckModel}
                    onChange={(e) => updateFormData('truckModel', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Model name/number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.truckYear}
                    onChange={(e) => updateFormData('truckYear', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="2020"
                    min="1990"
                    max="2025"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Plate Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.plateNumber}
                    onChange={(e) => updateFormData('plateNumber', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Vehicle registration number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    VIN Number
                  </label>
                  <input
                    type="text"
                    value={formData.vinNumber}
                    onChange={(e) => updateFormData('vinNumber', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Vehicle identification number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Truck Type *
                  </label>
                  <select
                    value={formData.truckType}
                    onChange={(e) => updateFormData('truckType', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Select truck type</option>
                    {truckTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Load Capacity
                  </label>
                  <input
                    type="text"
                    value={formData.capacity}
                    onChange={(e) => updateFormData('capacity', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="e.g., 30 tons, 40 tons"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Specializations (Optional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {specializationOptions.map(spec => (
                    <label key={spec} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.specializations.includes(spec)}
                        onChange={() => handleSpecializationToggle(spec)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Trucking Experience *
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => updateFormData('experience', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Select experience level</option>
                  <option value="less-than-1">Less than 1 year</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => updateFormData('additionalNotes', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  rows={4}
                  placeholder="Any additional information, special equipment, certifications, etc."
                />
              </div>
            </motion.div>
          )}

          {/* Step 6: Insurance & Licensing */}
          {currentStep === 6 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Insurance & Licensing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Insurance Provider *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.insuranceProvider}
                    onChange={(e) => updateFormData('insuranceProvider', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Insurance company name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Insurance Expiry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.insuranceExpiry}
                    onChange={(e) => updateFormData('insuranceExpiry', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Driving License Expiry *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.licenseExpiry}
                    onChange={(e) => updateFormData('licenseExpiry', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 7: Document Uploads */}
          {currentStep === 7 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Required Documents</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    1. National Identification Card *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nationalIdCard}
                    onChange={(e) => updateFormData('nationalIdCard', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Confirm you have your national ID ready for upload"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    2. Utility Bill (Electricity/Water/Gas) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.utilityBill}
                    onChange={(e) => updateFormData('utilityBill', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Confirm you have recent utility bill"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    3. Vehicle License *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.vehicleLicense}
                    onChange={(e) => updateFormData('vehicleLicense', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Vehicle registration document"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    4. Proof of Ownership *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.proofOfOwnership}
                    onChange={(e) => updateFormData('proofOfOwnership', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Vehicle ownership certificate"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    5. Hackney Permit *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.hackneyPermit}
                    onChange={(e) => updateFormData('hackneyPermit', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Commercial vehicle permit"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    6. Road Worthiness Certificate *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.roadWorthiness}
                    onChange={(e) => updateFormData('roadWorthiness', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Vehicle roadworthiness certificate"
                  />
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-medium text-yellow-900 mb-2">Document Upload Information</h3>
                <p className="text-sm text-yellow-800">
                  After your application is approved, you will receive instructions for uploading these documents securely.
                  Please ensure all documents are current and clearly readable.
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 8: Service Areas & Experience */}
          {currentStep === 8 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Service Areas & Experience</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Service Areas *
                </label>
                <input
                  type="text"
                  required
                  value={formData.serviceAreas.join(', ')}
                  onChange={(e) => updateFormData('serviceAreas', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="e.g., Lagos, Abuja, Port Harcourt, Kano (separate with commas)"
                />
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.willingToRelocate}
                    onChange={(e) => updateFormData('willingToRelocate', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Willing to relocate for long-term contracts
                  </span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Trucking Experience *
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => updateFormData('experience', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Select experience level</option>
                  <option value="less-than-1">Less than 1 year</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Specializations (Optional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {specializationOptions.map(spec => (
                    <label key={spec} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.specializations.includes(spec)}
                        onChange={() => handleSpecializationToggle(spec)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => updateFormData('additionalNotes', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  rows={4}
                  placeholder="Any additional information about your services, special equipment, etc."
                />
              </div>
            </motion.div>
          )}

          {/* Step 9: Terms & Agreement */}
          {currentStep === 9 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Terms & Conditions</h2>
              
              <div className="p-6 bg-gray-50 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-4">Partnership Agreement</h3>
                <div className="text-sm text-gray-700 space-y-3">
                  <p>
                    By registering with Fixing Maritime Logistics, you agree to the following terms:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Five percent (5%) of the total amount paid for each loading of your truck from any of our loading points will be collected by Fixing Maritime Logistics.</li>
                    <li>You will never contact any of our associates without the permission of Fixing Maritime Logistics, as doing so causes confusion in the workspace.</li>
                    <li>Fixing Maritime Logistics will never contact your driver without your permission.</li>
                    <li>Payment will be disbursed immediately or within 24 hours.</li>
                    <li>Fixing Maritime Logistics will not partake or be held responsible if your truck breaks down on the road or in case of an accident.</li>
                    <li>This agreement is binding to the law of the Federal Republic of Nigeria.</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    required
                    checked={formData.agreedToTerms}
                    onChange={(e) => updateFormData('agreedToTerms', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I have read and agree to the terms and conditions of Fixing Maritime Logistics *
                  </span>
                </label>
              </div>
              
              <div className="p-6 bg-blue-50 rounded-lg border">
                <h3 className="font-semibold text-blue-900 mb-4">Privacy Policy</h3>
                <p className="text-sm text-blue-800">
                  We do not share your details with third parties, except in cases where we find you wanting. 
                  Your personal and business information is protected and will only be used for business purposes 
                  related to your partnership with Fixing Maritime Logistics.
                </p>
              </div>
              
              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    required
                    checked={formData.agreedToPrivacy}
                    onChange={(e) => updateFormData('agreedToPrivacy', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I acknowledge and agree to the privacy policy *
                  </span>
                </label>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>
            
            {currentStep < 9 ? (
              <button
                onClick={nextStep}
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
    </div>
  )
}