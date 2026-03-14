"use client";

import Link from 'next/link';
import { CheckCircle2, MessageSquareText } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || `LMT-${Math.floor(Math.random() * 1000000)}`;

  return (
    <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-lg w-full text-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-flipkartYellow to-green-500"></div>
      
      <div className="flex justify-center mb-6">
        <CheckCircle2 size={72} className="text-green-500" />
      </div>
      
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
      <p className="text-gray-600 mb-6">Thank you for shopping with Lumitop. Your order <strong className="text-gray-900">#{orderId}</strong> has been successfully placed.</p>
      
      <div className="bg-green-50 border border-green-200 rounded p-4 mb-8 text-left">
        <h3 className="font-bold text-green-900 mb-1">What happens next?</h3>
        <p className="text-sm text-green-800">We are preparing your lamp for dispatch. You will receive an SMS/WhatsApp with tracking details once shipped (usually within 24 hours).</p>
      </div>

      <a 
        href={`https://wa.me/91XXXXXXXXXX?text=Hi! I just placed order ${orderId}. Can you confirm if it's shipped?`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-4 rounded shadow hover:bg-green-600 transition mb-4 uppercase tracking-wide"
      >
        <MessageSquareText size={20} /> Confirm on WhatsApp
      </a>

      <Link href="/" className="text-flipkartBlue font-bold hover:underline">
        Return to Home
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
