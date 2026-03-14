"use client";

import Link from 'next/link';
import { Star, ShieldCheck, Zap } from 'lucide-react';
import { useState } from 'react';

export default function FeaturedProduct() {
  const [activeImage, setActiveImage] = useState('/product-1.jpg');
  
  // Note: Replace with actual product image URLs from public folder later
  const gallery = [
    '/product-1.jpg', 
    '/product-2.jpg', 
    '/product-3.jpg', 
    '/product-4.jpg'
  ];

  return (
    <section id="featured" className="py-12 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Gallery Segment */}
          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200 flex items-center justify-center">
               <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
                 -80% OFF
               </div>
               {/* Fallback box for image */}
               <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-600 rounded flex items-center justify-center text-white font-bold opacity-80">
                 [Product Image Placeholder: {activeImage}]
               </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {gallery.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square bg-gray-100 rounded border-2 overflow-hidden ${activeImage === img ? 'border-flipkartBlue' : 'border-transparent hover:border-gray-300'}`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-600 opacity-50"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Details Segment */}
          <div className="flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-2">
              Lumitop™ Premium Sunset Projection LED Lamp (4 Colors in 1)
            </h2>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                4.8 <Star size={12} className="fill-current" />
              </span>
              <span className="text-sm text-gray-500 font-medium">12,403 Ratings & 2,194 Reviews</span>
              <img src="/assured.png" alt="Assured" className="h-5 ml-2 object-contain bg-gray-100 px-1 rounded" />
            </div>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-gray-900">₹149</span>
              <span className="text-lg text-gray-500 line-through">₹999</span>
              <span className="text-sm font-bold text-green-600">85% off</span>
            </div>
            
            <p className="text-sm text-gray-700 mb-6 leading-relaxed">
              Instantly change the vibe of your room with the viral Lumitop Sunset Lamp. 
              Featuring a high-quality optical lens and ultra-bright LED, it creates stunning, 
              atmospheric lighting perfect for photography, relaxation, or romantic dinners.
            </p>

            <div className="space-y-4 mb-8">
               <div className="flex items-start gap-3">
                 <ShieldCheck className="text-flipkartBlue shrink-0" size={20} />
                 <div>
                   <h4 className="font-semibold text-sm text-gray-900">1 Year Warranty</h4>
                   <p className="text-xs text-gray-500">Free replacement for manufacturing defects.</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <Zap className="text-flipkartYellow shrink-0" size={20} />
                 <div>
                   <h4 className="font-semibold text-sm text-gray-900">Fast Delivery</h4>
                   <p className="text-xs text-gray-500">Usually delivered in 3-5 business days across India.</p>
                 </div>
               </div>
            </div>

            {/* CTA's */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <Link href="/product/lamp" className="btn flex items-center justify-center bg-white text-gray-900 border-2 border-gray-300 py-4 font-bold rounded shadow-sm hover:bg-gray-50 transition uppercase tracking-wide">
                View Details
              </Link>
              <Link href="/checkout" className="btn flex items-center justify-center bg-flipkartYellow text-black py-4 font-bold rounded shadow-sm hover:shadow-md transition uppercase tracking-wide">
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
