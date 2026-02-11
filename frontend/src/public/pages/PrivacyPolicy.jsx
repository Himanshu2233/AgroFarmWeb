import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../../utils';
import { APP_NAME, CONTACT_INFO, ROUTE_PATHS } from '../../utils/constants';
import { BackButton } from '../../components';

export default function PrivacyPolicy() {
  useDocumentTitle('Privacy Policy');

  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        'We collect information you provide directly to us, including:',
        '• Personal information (name, email, phone number, address)',
        '• Account credentials (email and password)',
        '• Order and booking information',
        '• Payment information (processed securely through our payment partners)',
        '• Profile pictures and preferences',
        '• Communications you send to us',
      ],
    },
    {
      title: '2. How We Use Your Information',
      content: [
        'We use the information we collect to:',
        '• Process and fulfill your orders and bookings',
        '• Create and maintain your account',
        '• Send order confirmations and updates',
        '• Improve our products and services',
        '• Respond to your inquiries and support requests',
        '• Send promotional communications (with your consent)',
        '• Ensure the security of our platform',
      ],
    },
    {
      title: '3. Information Sharing',
      content: [
        'We do not sell, trade, or rent your personal information to third parties. We may share your information with:',
        '• Delivery partners to fulfill your orders',
        '• Payment processors to handle transactions securely',
        '• Service providers who assist in our operations',
        '• Law enforcement when required by law',
      ],
    },
    {
      title: '4. Data Security',
      content: [
        'We implement appropriate technical and organizational measures to protect your personal information, including:',
        '• Encryption of data in transit and at rest',
        '• Secure authentication mechanisms',
        '• Regular security assessments',
        '• Access controls and monitoring',
        'However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.',
      ],
    },
    {
      title: '5. Cookies & Tracking',
      content: [
        'We use cookies and similar technologies to:',
        '• Remember your login session',
        '• Store your preferences',
        '• Analyze website traffic and usage patterns',
        '• Improve user experience',
        'You can control cookie preferences through your browser settings.',
      ],
    },
    {
      title: '6. Your Rights',
      content: [
        'You have the right to:',
        '• Access your personal information',
        '• Correct inaccurate data',
        '• Request deletion of your account and data',
        '• Opt out of promotional communications',
        '• Export your data in a portable format',
        'To exercise these rights, contact us or use the settings in your account profile.',
      ],
    },
    {
      title: '7. Data Retention',
      content: [
        'We retain your personal information for as long as your account is active or as needed to provide you services. We may also retain information to comply with legal obligations, resolve disputes, and enforce our agreements.',
      ],
    },
    {
      title: '8. Children\'s Privacy',
      content: [
        'Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete such information.',
      ],
    },
    {
      title: '9. Changes to This Policy',
      content: [
        'We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.',
      ],
    },
    {
      title: '10. Contact Us',
      content: [
        'If you have any questions or concerns about this Privacy Policy, please contact us:',
        `• Email: ${CONTACT_INFO.email}`,
        `• Phone: ${CONTACT_INFO.phone}`,
        `• Address: ${CONTACT_INFO.address}`,
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
        <div className="max-w-4xl mx-auto relative z-10">
          <BackButton label="Back to Home" className="text-white/80 hover:text-white mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-green-100 text-lg">How we collect, use, and protect your information</p>
          <p className="text-green-200 text-sm mt-3">Last Updated: January 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
        {/* Intro Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed">
                At <strong>{APP_NAME}</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{section.title}</h2>
              <div className="space-y-2">
                {section.content.map((line, i) => (
                  <p key={i} className={`text-gray-600 leading-relaxed ${line.startsWith('•') ? 'pl-4' : ''}`}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Links */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            See also:{' '}
            <Link to={ROUTE_PATHS.TERMS} className="text-green-600 hover:text-green-700 font-medium hover:underline">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
