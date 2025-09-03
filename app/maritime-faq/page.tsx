import type { Metadata } from 'next'
import StructuredData, { faqSchema } from '@/components/StructuredData'
import { ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Maritime Services FAQ | Custom Clearing Questions | Shipping FAQ Nigeria',
  description: 'Frequently asked questions about maritime logistics, custom clearing, car clearing, tug & barge services, and shipping in Nigeria. Get answers from industry experts.',
  keywords: 'maritime FAQ, custom clearing questions, car clearing FAQ, shipping FAQ Nigeria, tug boat questions, barge services FAQ, logistics questions',
  alternates: {
    canonical: '/maritime-faq',
  },
}

const faqs = [
  {
    question: "What is custom clearing and why do I need it in Nigeria?",
    answer: "Custom clearing is the process of getting goods through customs barriers for importers and exporters. In Nigeria, you need custom clearing services to legally import or export goods, calculate and pay duties, and ensure compliance with Nigerian Customs regulations. Our licensed agents handle all documentation and procedures.",
  },
  {
    question: "How long does car clearing take at Nigerian ports?",
    answer: "Car clearing typically takes 3-7 business days, depending on documentation completeness and customs inspection requirements. With our express car clearing services, we can expedite the process to 24-48 hours for urgent cases. Factors affecting timeline include duty payment, physical examination, and port congestion.",
  },
  {
    question: "What documents are required for custom clearing in Nigeria?",
    answer: "Essential documents include Bill of Lading, Commercial Invoice, Packing List, Form M, PAAR (Pre-Arrival Assessment Report), Single Goods Declaration (SGD), Certificate of Origin, and SONCAP certificate for regulated products. Our custom clearing agents ensure all documentation is properly prepared.",
  },
  {
    question: "What are tug and barge services used for?",
    answer: "Tug and barge services are used for marine transportation of heavy cargo, offshore support operations, harbor towage, and bulk material transport. In Nigeria's oil & gas industry, tugs and barges are essential for moving drilling rigs, transporting equipment to offshore platforms, and supporting construction projects.",
  },
  {
    question: "How much does custom clearing cost in Nigeria?",
    answer: "Custom clearing costs vary based on cargo type, value, and applicable duties. Costs include customs duty (5-35%), VAT (7.5%), clearing agent fees, and port charges. We provide transparent quotations with no hidden charges. Contact us for a detailed breakdown based on your specific shipment.",
  },
  {
    question: "What is maritime logistics?",
    answer: "Maritime logistics encompasses all activities involved in moving goods by sea, including shipping, port operations, cargo handling, documentation, customs clearance, and inland transportation. Our maritime logistics services provide end-to-end solutions from origin to final destination in Nigeria.",
  },
  {
    question: "Can you clear cars from USA, UK, or Canada in Nigerian ports?",
    answer: "Yes, we specialize in clearing vehicles from USA, UK, Canada, and other countries at all Nigerian ports. We handle both new and used vehicles, ensure proper duty calculation, coordinate inspections, and manage all documentation including VREG requirements.",
  },
  {
    question: "What ports do you provide custom clearing services?",
    answer: "We provide custom clearing services at all major Nigerian ports including Apapa Port, Tin Can Island Port, PTML Terminal, Onne Port, Calabar Port, and Warri Port. Our nationwide network ensures efficient clearing regardless of port of entry.",
  },
  {
    question: "How do I track my shipment with Fixing Maritime?",
    answer: "You can track your shipment through our online tracking system using your tracking number or Bill of Lading. We provide real-time updates on cargo location, customs status, and estimated delivery time. Our 24/7 customer support is also available for tracking assistance.",
  },
  {
    question: "What makes Fixing Maritime different from other clearing agents?",
    answer: "Fixing Maritime combines 25+ years of experience with modern technology, licensed customs expertise, transparent pricing, and comprehensive services including maritime logistics, custom clearing, car clearing, tug & barge operations, and warehousing. Our one-stop solution approach saves time and costs.",
  },
  {
    question: "Do you handle project cargo and oversized shipments?",
    answer: "Yes, we specialize in project cargo handling including oversized equipment, heavy machinery, and industrial materials. Our tug and barge services, combined with specialized handling equipment and expert logistics planning, ensure safe transport of any size cargo.",
  },
  {
    question: "What are your warehousing capabilities?",
    answer: "We offer secure, climate-controlled warehousing facilities in strategic locations across Nigeria. Our warehouses feature 24/7 security, inventory management systems, and can handle various cargo types including general goods, hazardous materials, and temperature-sensitive products.",
  },
]

export default function MaritimeFAQPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <StructuredData data={faqSchema(faqs)} />
      
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to know about maritime logistics, custom clearing, and shipping services in Nigeria
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <summary className="flex justify-between items-center cursor-pointer p-6 hover:bg-gray-50 transition-colors">
                <h2 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h2>
                <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
              </summary>
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>

        {/* SEO Content Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">
            Your Trusted Maritime Services Partner in Nigeria
          </h2>
          <div className="prose prose-gray max-w-none">
            <p>
              Fixing Maritime is Nigeria's leading provider of comprehensive maritime solutions. 
              Whether you need custom clearing for your imports, car clearing services, maritime 
              logistics coordination, or tug and barge operations, our experienced team delivers 
              reliable, efficient services at competitive rates.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3">Our Core Services</h3>
            <ul className="space-y-2">
              <li>
                <strong>Custom Clearing:</strong> Licensed customs brokers for all Nigerian ports
              </li>
              <li>
                <strong>Car Clearing:</strong> Specialized vehicle clearing from USA, UK, Canada
              </li>
              <li>
                <strong>Maritime Logistics:</strong> End-to-end shipping and logistics solutions
              </li>
              <li>
                <strong>Tug & Barge:</strong> Marine transportation and offshore support
              </li>
              <li>
                <strong>Freight Forwarding:</strong> International shipping coordination
              </li>
              <li>
                <strong>Warehousing:</strong> Secure storage and distribution services
              </li>
            </ul>
            <p className="mt-6">
              Have more questions? Contact our customer service team 24/7 for personalized 
              assistance with your maritime and logistics needs.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 mb-6">
            Still have questions? We're here to help!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="tel:+234XXXXXXXXX"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}