'use client'

import { useState } from 'react'
import { Anchor, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const faqs = [
    {
      category: 'General',
      questions: [
        {
          question: 'What services does Fixing Maritime offer?',
          answer: 'We provide comprehensive maritime logistics services including documentation services, truck services, tug boat with barge operations, procurement of export goods, freight forwarding, warehousing, and custom clearing services.'
        },
        {
          question: 'How do I get a quote for my shipment?',
          answer: 'You can get a quote by visiting our services page, selecting the service you need, and filling out the quote request form. Our team will respond within 2 hours during business hours.'
        },
        {
          question: 'What countries do you serve?',
          answer: 'We have a global network spanning over 50 countries with partnerships at major ports worldwide. Contact us to confirm service availability in your specific location.'
        }
      ]
    },
    {
      category: 'Shipping & Logistics',
      questions: [
        {
          question: 'How long does international shipping take?',
          answer: 'Shipping times vary by destination and service type. Ocean freight typically takes 15-45 days depending on the route, while air freight takes 3-7 days. Express services are available for urgent shipments.'
        },
        {
          question: 'Can I track my shipment in real-time?',
          answer: 'Yes! All our shipments include real-time tracking. You\'ll receive a tracking number once your order is processed, and you can monitor your shipment\'s progress through our tracking portal.'
        },
        {
          question: 'What types of cargo can you handle?',
          answer: 'We handle various types of cargo including containerized goods, bulk cargo, hazardous materials (with proper documentation), perishables, and oversized equipment. Special handling requirements can be accommodated.'
        }
      ]
    },
    {
      category: 'Documentation & Customs',
      questions: [
        {
          question: 'What documents do I need for international shipping?',
          answer: 'Required documents typically include commercial invoice, packing list, bill of lading, and export/import permits. Specific requirements vary by country and cargo type. Our documentation team will guide you through the process.'
        },
        {
          question: 'Do you handle customs clearance?',
          answer: 'Yes, we provide comprehensive customs clearance services including duty calculation, documentation review, customs broker services, and expedited clearance for urgent shipments.'
        },
        {
          question: 'How long does customs clearance take?',
          answer: 'Standard customs clearance typically takes 1-3 business days. However, times can vary based on cargo type, documentation completeness, and customs workload. Express clearance services are available.'
        }
      ]
    },
    {
      category: 'Pricing & Payment',
      questions: [
        {
          question: 'How is shipping cost calculated?',
          answer: 'Shipping costs depend on factors including cargo weight/volume, destination, service type, and any special requirements. We provide transparent, all-inclusive quotes with no hidden fees.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, bank transfers, and digital wallets through our secure payment gateway. Payment terms can be arranged for established business customers.'
        },
        {
          question: 'Do you offer insurance for shipments?',
          answer: 'Yes, we offer comprehensive cargo insurance to protect your shipments. Insurance coverage varies by service type and cargo value. We recommend insurance for all high-value shipments.'
        }
      ]
    },
    {
      category: 'Support & Emergency',
      questions: [
        {
          question: 'What if there\'s an emergency with my shipment?',
          answer: 'Call our 24/7 emergency hotline at +1 (555) 911-SHIP for urgent shipment issues. Our emergency response team will immediately assist with any critical situations.'
        },
        {
          question: 'How can I contact customer support?',
          answer: 'You can reach us through our contact form, email at info@fixingmaritime.com, or phone at +1 (555) 123-4567. Our support team is available Monday-Friday 8AM-6PM EST.'
        },
        {
          question: 'What happens if my shipment is delayed?',
          answer: 'We proactively monitor all shipments and notify customers of any delays. Our team works to minimize delays and find alternative solutions. Delay notifications include updated delivery estimates and next steps.'
        }
      ]
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  let questionIndex = 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-700 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-gray-200 mb-4">
              <Anchor className="h-8 w-8" />
              <span className="text-xl font-bold">Fixing Maritime</span>
            </Link>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-gray-100">
              Find answers to common questions about our maritime logistics services
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        {/* Search Box */}
        <div className="mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for answers..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <button className="absolute right-3 top-3 text-gray-400 hover:text-primary-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const currentIndex = questionIndex++
                  return (
                    <div key={faqIndex} className="bg-white rounded-lg shadow-sm">
                      <button
                        onClick={() => toggleFAQ(currentIndex)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 rounded-lg"
                      >
                        <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                        {openFAQ === currentIndex ? (
                          <ChevronUp className="h-5 w-5 text-primary-600" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      {openFAQ === currentIndex && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our customer support team is here to help.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Contact Support
            </Link>
            <a
              href="tel:+15551234567"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Call: +1 (555) 123-4567
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}