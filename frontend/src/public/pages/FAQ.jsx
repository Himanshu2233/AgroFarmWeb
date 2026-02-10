import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../../utils';
import { APP_NAME, CONTACT_INFO, ROUTE_PATHS } from '../../utils/constants';
import { BackButton } from '../../components';

const faqs = [
  {
    category: 'Orders & Delivery',
    questions: [
      {
        q: 'How do I place an order?',
        a: 'Simply browse our products, select the items you want, and click "Book Now". You can then choose your preferred quantity and complete the booking through your account.',
      },
      {
        q: 'What are the delivery hours?',
        a: `We deliver during our operating hours: ${CONTACT_INFO.hours}. You will receive a notification when your order is out for delivery.`,
      },
      {
        q: 'Do you deliver outside Kathmandu Valley?',
        a: 'Currently, we primarily serve the Kathmandu Valley and surrounding areas. We are working on expanding our delivery network to other regions of Nepal.',
      },
      {
        q: 'How can I track my order?',
        a: 'You can track your order status by logging into your account and visiting the "My Bookings" section. You\'ll see real-time status updates for all your orders.',
      },
    ],
  },
  {
    category: 'Products & Quality',
    questions: [
      {
        q: 'Are your products organic?',
        a: 'We source our products from trusted local farms that follow sustainable farming practices. Many of our products are organically grown, and we clearly label organic items on our platform.',
      },
      {
        q: 'How do you ensure product freshness?',
        a: 'Our products are sourced directly from farms and delivered to you within hours of harvest. We maintain cold chain storage and careful handling throughout the delivery process.',
      },
      {
        q: 'Can I request specific products?',
        a: 'Yes! If you\'re looking for a specific product that isn\'t listed on our platform, please contact our support team. We\'ll do our best to source it for you.',
      },
    ],
  },
  {
    category: 'Account & Payments',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click the "Register" button on the top right corner, fill in your details, and verify your email address. Once verified, you can start placing orders immediately.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept various payment methods including cash on delivery, mobile payments (eSewa, Khalti), and bank transfers. Payment options are displayed during checkout.',
      },
      {
        q: 'How do I update my profile information?',
        a: 'Log into your account and go to the "Profile" section. You can update your name, phone number, address, and profile picture at any time.',
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes, you can delete your account from the Profile page under the "Security" tab. Please note that this action is permanent and cannot be undone.',
      },
    ],
  },
  {
    category: 'Animals & Livestock',
    questions: [
      {
        q: 'Can I visit the farm to see the animals?',
        a: 'Yes! We welcome farm visits. Please contact us in advance to schedule a visit. Our team will be happy to show you around and introduce you to our animals.',
      },
      {
        q: 'How do animal bookings work?',
        a: 'Browse our available animals, click "Enquire" on the animal you\'re interested in, and fill out the enquiry form. Our team will contact you to discuss details, pricing, and arrangements.',
      },
    ],
  },
  {
    category: 'Refunds & Returns',
    questions: [
      {
        q: 'What is your refund policy?',
        a: 'We offer refunds for products that arrive damaged, spoiled, or significantly different from the description. Refund requests must be made within 24 hours of delivery. See our full Refund Policy for details.',
      },
      {
        q: 'How long does a refund take?',
        a: 'Approved refunds are processed within 5-7 business days and credited to your original payment method. You\'ll receive an email confirmation once the refund is processed.',
      },
    ],
  },
];

export default function FAQ() {
  useDocumentTitle('FAQ');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
        <div className="max-w-4xl mx-auto relative z-10">
          <BackButton label="Back to Home" className="text-white/80 hover:text-white mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Frequently Asked Questions</h1>
          <p className="text-green-100 text-lg">Find answers to common questions about {APP_NAME}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
        {/* Quick Contact */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💬</span>
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed">
                Can't find what you're looking for? Contact our support team at{' '}
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-green-600 font-medium hover:underline">
                  {CONTACT_INFO.email}
                </a>{' '}
                or call us at{' '}
                <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="text-green-600 font-medium hover:underline">
                  {CONTACT_INFO.phone}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqs.map((category) => (
            <div key={category.category} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-8 py-5 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">{category.category}</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {category.questions.map((item, i) => {
                  const key = `${category.category}-${i}`;
                  const isOpen = openItems[key];
                  return (
                    <div key={i}>
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full px-8 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-800 pr-4">{item.q}</span>
                        <svg
                          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <p className="px-8 pb-5 text-gray-600 leading-relaxed">{item.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            See also:{' '}
            <Link to="/refund" className="text-green-600 hover:text-green-700 font-medium hover:underline">
              Refund Policy
            </Link>
            {' · '}
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
