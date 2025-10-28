import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'General',
      questions: [
        {
          q: 'What services does ManpowerPro provide?',
          a: 'We provide comprehensive manpower solutions across four main categories: Security Services (armed/unarmed), Labor Services (skilled/unskilled), Technical Staff (IT, engineering), and Medical Professionals (nurses, doctors, support staff).',
        },
        {
          q: 'How do I get started?',
          a: 'Simply register for an account on our platform, browse our services, and submit a request with your specific requirements. Our team will review your request and get back to you within 24 hours.',
        },
        {
          q: 'What areas do you serve?',
          a: 'We currently serve businesses across the United States. Contact us to confirm service availability in your specific location.',
        },
      ],
    },
    {
      category: 'Request Process',
      questions: [
        {
          q: 'How long does it take to fulfill a request?',
          a: 'Response time varies based on the type and urgency of your request. We typically respond within 24 hours and can deploy staff within 48-72 hours for most requests. Urgent requests can be expedited.',
        },
        {
          q: 'Can I track my request status?',
          a: 'Yes! Once logged in, you can access your dashboard to view the real-time status of all your requests, from submission to completion.',
        },
        {
          q: 'Can I modify or cancel a request?',
          a: 'You can modify requests that are still in "Pending" status through your dashboard. For requests already in progress, please contact our support team for assistance.',
        },
      ],
    },
    {
      category: 'Professionals & Quality',
      questions: [
        {
          q: 'How are professionals vetted?',
          a: 'All professionals undergo comprehensive background checks, credential verification, and skills assessment. We also verify licenses, certifications, and past employment history.',
        },
        {
          q: 'Are professionals insured?',
          a: 'Yes, all our professionals are covered by liability insurance. Specific coverage details vary by service type and can be discussed during the request process.',
        },
        {
          q: 'What if I\'m not satisfied with a professional?',
          a: 'Client satisfaction is our priority. If you\'re not satisfied, contact us immediately and we\'ll work to resolve the issue, including providing a replacement if necessary.',
        },
      ],
    },
    {
      category: 'Pricing & Payment',
      questions: [
        {
          q: 'How is pricing determined?',
          a: 'Pricing depends on the service type, duration, skill level required, and location. We provide transparent quotes before any commitment. Contact us for a customized quote.',
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept credit cards, ACH transfers, and wire transfers. Payment terms can be discussed based on your organization\'s requirements.',
        },
        {
          q: 'Are there any hidden fees?',
          a: 'No. We believe in transparent pricing. All costs will be clearly outlined in your service agreement before you commit.',
        },
      ],
    },
    {
      category: 'Account & Security',
      questions: [
        {
          q: 'Is my information secure?',
          a: 'Absolutely. We use industry-standard encryption and security measures to protect your data. We comply with all relevant data protection regulations.',
        },
        {
          q: 'Can multiple users from my company access the account?',
          a: 'Yes, we offer multi-user access for business accounts. Contact us to set up additional users with appropriate permissions.',
        },
        {
          q: 'What if I forget my password?',
          a: 'Click the "Forgot Password" link on the login page, and we\'ll send you instructions to reset your password via email.',
        },
      ],
    },
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Find answers to common questions about our services
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqs.map((category, catIndex) => (
            <div key={catIndex}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100 mb-4">{category.category}</h2>
              <div className="space-y-3">
                {category.questions.map((faq, qIndex) => {
                  const isOpen = openIndex === `${catIndex}-${qIndex}`;
                  return (
                    <div key={qIndex} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                      <button
                        onClick={() => toggleFAQ(catIndex, qIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-left font-semibold text-gray-900 dark:text-gray-100 dark:text-gray-100">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="text-primary-600 flex-shrink-0 ml-4" size={20} />
                        ) : (
                          <ChevronDown className="text-gray-400 dark:text-gray-500 flex-shrink-0 ml-4" size={20} />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Still have questions?</h2>
          <p className="text-primary-100 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <a
            href="/contact"
            className="bg-white dark:bg-gray-800 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;


