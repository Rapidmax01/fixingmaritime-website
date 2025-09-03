import { Anchor } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Fixing Maritime',
  description: 'Learn how Fixing Maritime collects, uses, and protects your personal information. Our commitment to data privacy and security for maritime services in Nigeria.',
  keywords: 'privacy policy, data protection, maritime privacy, personal information, GDPR compliance Nigeria',
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              Last updated: August 20, 2024
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Personal information (name, email address, phone number)</li>
              <li>Company information and business details</li>
              <li>Shipping and logistics preferences</li>
              <li>Payment and billing information</li>
              <li>Communications with our support team</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Provide, maintain, and improve our maritime logistics services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and administrative messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Information Sharing</h2>
            <p className="text-gray-600 mb-4">
              We may share your information in the following situations:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>With service providers who perform services on our behalf</li>
              <li>With shipping partners and logistics providers when necessary for service delivery</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transaction (merger, acquisition, etc.)</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Data Retention</h2>
            <p className="text-gray-600 mb-4">
              We retain personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required by law.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Your Rights</h2>
            <p className="text-gray-600 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Access and update your personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to processing of your personal information</li>
              <li>Request data portability</li>
              <li>Withdraw consent where applicable</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-600 mb-4">
              We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Third-Party Services</h2>
            <p className="text-gray-600 mb-4">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites and encourage you to read their privacy policies.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. International Transfers</h2>
            <p className="text-gray-600 mb-4">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-600 mb-4">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">11. Changes to Privacy Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">12. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this privacy policy or our data practices, please contact us through our website or customer service channels.
            </p>

            <div className="mt-12 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Your Privacy Matters:</strong> We are committed to protecting your personal information and being transparent about how we use it.
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