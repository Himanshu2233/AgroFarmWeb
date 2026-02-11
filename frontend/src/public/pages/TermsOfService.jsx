import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../../utils';
import { APP_NAME, CONTACT_INFO, ROUTE_PATHS } from '../../utils/constants';
import { BackButton } from '../../components';

export default function TermsOfService() {
  useDocumentTitle('Terms of Service');

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: [
        `By accessing or using ${APP_NAME}'s website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.`,
        'These terms apply to all visitors, users, and customers of our platform.',
      ],
    },
    {
      title: '2. Account Registration',
      content: [
        'To access certain features, you must create an account. You agree to:',
        '• Provide accurate, current, and complete information',
        '• Maintain the security of your password and account',
        '• Notify us immediately of any unauthorized access',
        '• Accept responsibility for all activities under your account',
        'We reserve the right to suspend or terminate accounts that violate these terms.',
      ],
    },
    {
      title: '3. Products & Services',
      content: [
        'We strive to provide accurate product descriptions, pricing, and availability information. However:',
        '• Prices are subject to change without prior notice',
        '• Product images are for illustration purposes and may vary slightly',
        '• Availability is subject to stock levels and seasonal conditions',
        '• We reserve the right to limit quantities or refuse orders',
        'All products are sourced with care to ensure freshness and quality.',
      ],
    },
    {
      title: '4. Orders & Bookings',
      content: [
        'When you place an order or booking through our platform:',
        '• You are making an offer to purchase the selected products or services',
        '• We will confirm acceptance of your order via email or notification',
        '• We reserve the right to cancel orders due to pricing errors, stock issues, or suspected fraud',
        '• Delivery times are estimates and may vary based on location and availability',
      ],
    },
    {
      title: '5. Pricing & Payment',
      content: [
        '• All prices are listed in Nepalese Rupees (NPR) unless otherwise stated',
        '• Payment must be completed at the time of order',
        '• We accept various payment methods as displayed during checkout',
        '• Taxes and delivery charges may apply and will be shown before payment',
        '• Promotional discounts are subject to specific terms and conditions',
      ],
    },
    {
      title: '6. Delivery & Returns',
      content: [
        `Delivery Policy:`,
        '• We deliver to serviceable areas within Kathmandu Valley and surrounding regions',
        '• Delivery times are estimated and not guaranteed',
        '• You are responsible for providing accurate delivery information',
        '',
        'Return & Refund Policy:',
        '• Fresh produce may be returned within 24 hours if quality is unsatisfactory',
        '• Contact our support team to initiate a return or refund',
        '• Refunds will be processed within 5-7 business days',
        '• Perishable items must meet our return condition requirements',
      ],
    },
    {
      title: '7. User Conduct',
      content: [
        'You agree not to:',
        '• Use our services for any illegal or unauthorized purpose',
        '• Attempt to gain unauthorized access to our systems',
        '• Interfere with or disrupt the platform\'s functionality',
        '• Submit false or misleading information',
        '• Harass, abuse, or harm other users',
        '• Use automated tools to scrape or collect data from our platform',
        '• Resell products purchased through our platform without authorization',
      ],
    },
    {
      title: '8. Intellectual Property',
      content: [
        `All content on ${APP_NAME}, including text, graphics, logos, images, and software, is our property or the property of our licensors and is protected by intellectual property laws.`,
        'You may not reproduce, distribute, modify, or create derivative works without our written consent.',
        'User-submitted content (such as reviews and recipes) remains your property, but you grant us a non-exclusive license to display and use it on our platform.',
      ],
    },
    {
      title: '9. Limitation of Liability',
      content: [
        `${APP_NAME} shall not be liable for:`,
        '• Indirect, incidental, or consequential damages',
        '• Loss of data, profits, or business opportunities',
        '• Damages resulting from service interruptions',
        '• Actions of third-party service providers',
        'Our total liability shall not exceed the amount paid by you for the specific product or service in question.',
      ],
    },
    {
      title: '10. Governing Law',
      content: [
        'These Terms of Service shall be governed by and construed in accordance with the laws of Nepal. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Kathmandu, Nepal.',
      ],
    },
    {
      title: '11. Changes to Terms',
      content: [
        'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to this page. Your continued use of our services after modifications constitutes your acceptance of the updated terms.',
        'We encourage you to review these terms periodically.',
      ],
    },
    {
      title: '12. Contact Us',
      content: [
        'For any questions regarding these Terms of Service, please contact us:',
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
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Terms of Service</h1>
          <p className="text-green-100 text-lg">Please read these terms carefully before using our services</p>
          <p className="text-green-200 text-sm mt-3">Last Updated: January 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
        {/* Intro Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed">
                Welcome to <strong>{APP_NAME}</strong>. These Terms of Service govern your use of our website and services. 
                By using our platform, you acknowledge that you have read, understood, and agree to be bound by these terms.
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
            <Link to={ROUTE_PATHS.PRIVACY} className="text-green-600 hover:text-green-700 font-medium hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
