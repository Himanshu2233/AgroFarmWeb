import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../../utils';
import { APP_NAME, CONTACT_INFO, ROUTE_PATHS } from '../../utils/constants';
import { BackButton } from '../../components';

export default function RefundPolicy() {
  useDocumentTitle('Refund Policy');

  const sections = [
    {
      title: '1. Overview',
      content: [
        `At ${APP_NAME}, we want you to be completely satisfied with your purchase. If you are not happy with your order, we are here to help.`,
        'This Refund Policy outlines the conditions under which refunds are provided for products purchased through our platform.',
      ],
    },
    {
      title: '2. Fresh Produce Returns',
      content: [
        'Due to the perishable nature of our products:',
        '• Returns must be initiated within 24 hours of delivery',
        '• Products must show clear signs of quality issues (damaged, spoiled, or not as described)',
        '• Photo evidence of the issue is required for processing',
        '• We may arrange a replacement instead of a refund at our discretion',
      ],
    },
    {
      title: '3. Eligibility for Refunds',
      content: [
        'You may be eligible for a refund if:',
        '• The product received is significantly different from what was ordered',
        '• The product is damaged or spoiled upon delivery',
        '• The order was not delivered within the estimated timeframe',
        '• There was an error in billing or incorrect charges',
      ],
    },
    {
      title: '4. Non-Refundable Items',
      content: [
        'The following are generally not eligible for refunds:',
        '• Products that have been consumed or used',
        '• Orders cancelled after the product has been dispatched',
        '• Issues reported more than 24 hours after delivery',
        '• Products that were correctly delivered as ordered',
      ],
    },
    {
      title: '5. How to Request a Refund',
      content: [
        'To request a refund:',
        '• Contact our support team within 24 hours of delivery',
        '• Provide your order number and details of the issue',
        '• Include photos of the product showing the problem',
        '• Our team will review your request within 1-2 business days',
      ],
    },
    {
      title: '6. Refund Processing',
      content: [
        '• Approved refunds will be processed within 5-7 business days',
        '• Refunds will be credited to the original payment method',
        '• You will receive an email confirmation once the refund is processed',
        '• Partial refunds may be issued for partially affected orders',
      ],
    },
    {
      title: '7. Cancellation Policy',
      content: [
        '• Orders can be cancelled before they are dispatched for a full refund',
        '• Once an order is dispatched, cancellation may not be possible',
        '• Subscription orders can be cancelled at any time before the next billing cycle',
      ],
    },
    {
      title: '8. Contact Us',
      content: [
        'For refund requests or questions about this policy:',
        `• Email: ${CONTACT_INFO.email}`,
        `• Phone: ${CONTACT_INFO.phone}`,
        `• Hours: ${CONTACT_INFO.hours}`,
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
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Refund Policy</h1>
          <p className="text-green-100 text-lg">Our commitment to your satisfaction</p>
          <p className="text-green-200 text-sm mt-3">Last Updated: January 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">↩️</span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We stand behind the quality of our products. If something isn't right with your order, 
              our team is ready to make it right.
            </p>
          </div>
        </div>

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

        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            See also:{' '}
            <Link to={ROUTE_PATHS.PRIVACY} className="text-green-600 hover:text-green-700 font-medium hover:underline">
              Privacy Policy
            </Link>
            {' · '}
            <Link to={ROUTE_PATHS.TERMS} className="text-green-600 hover:text-green-700 font-medium hover:underline">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
