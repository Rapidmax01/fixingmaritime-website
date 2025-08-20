import { Anchor } from 'lucide-react'
import Link from 'next/link'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700">
            <Anchor className="h-8 w-8" />
            <span className="text-xl font-bold">Fixing Maritime</span>
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              Last updated: August 20, 2024
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using Fixing Maritime's services, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Services Offered</h2>
            <p className="text-gray-600 mb-4">
              Fixing Maritime provides comprehensive maritime logistics services including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Documentation services</li>
              <li>Truck services and land transportation</li>
              <li>Tug boat with barge operations</li>
              <li>Procurement of export goods</li>
              <li>Freight forwarding solutions</li>
              <li>Warehousing and storage</li>
              <li>Custom clearing services</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
            <p className="text-gray-600 mb-4">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for maintaining the confidentiality of your account.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Payment Terms</h2>
            <p className="text-gray-600 mb-4">
              Payment for services must be made according to the terms specified in your service agreement. We reserve the right to suspend or terminate services for non-payment.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Liability and Insurance</h2>
            <p className="text-gray-600 mb-4">
              Fixing Maritime maintains appropriate insurance coverage for our operations. Our liability is limited to the terms specified in individual service contracts and applicable maritime law.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Force Majeure</h2>
            <p className="text-gray-600 mb-4">
              Fixing Maritime shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to weather conditions, port strikes, government actions, or natural disasters.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Privacy Policy</h2>
            <p className="text-gray-600 mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Termination</h2>
            <p className="text-gray-600 mb-4">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please contact us through our website or customer service channels.
            </p>

            <div className="mt-12 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                These terms constitute the entire agreement between you and Fixing Maritime regarding the use of our services.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}