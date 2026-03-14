"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      q: "Does it come with different colors?",
      a: "Yes! Every single lamp comes with 4 interchangeable color films (Sunset, Sun, Rainbow, and Halo). You can swap them in seconds to change the vibe."
    },
    {
      q: "Is it battery powered or plug-in?",
      a: "The lamp is powered via a standard USB cable (included). You can plug it into any phone charger brick, power bank, or laptop."
    },
    {
      q: "How long does delivery take?",
      a: "We offer fast 3-5 day delivery across India. Cash on Delivery is available to 99% of pincodes."
    },
    {
      q: "What is your return policy?",
      a: "We offer a 7-day hassle-free replacement policy if you receive a damaged or defective product. Just message us on WhatsApp with a video of the issue."
    }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full text-left px-6 py-4 font-bold text-gray-900 flex justify-between items-center focus:outline-none"
              >
                {faq.q}
                <ChevronDown size={20} className={`transform transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} />
              </button>
              
              {openIdx === idx && (
                <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
