import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-flipkartBlue flex flex-col items-center justify-center text-center px-4 pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-black/20 z-0 mix-blend-multiply"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <span className="inline-block px-3 py-1 bg-flipkartYellow text-black text-xs font-bold rounded-full uppercase tracking-wider mb-2 animate-pulse shadow-md">
          Trending #1 in Home Decor
        </span>
        
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-lg text-balance leading-tight">
          Transform Your <span className="text-flipkartYellow">Reality.</span><br />
          Experience the Golden Hour.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto drop-shadow-md">
          Bring the mesmerizing warmth of a perfect sunset into your room, anytime. The Lumitop Premium Projection Lamp.
        </p>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="#featured" className="bg-flipkartYellow hover:bg-yellow-400 text-black font-bold text-lg px-8 py-4 rounded shadow-lg hover:shadow-xl transition flex items-center gap-2">
            Buy Now at ₹149 <ArrowRight size={20} />
          </Link>
          <p className="text-sm text-white/90 font-medium">Over <strong className="text-flipkartYellow">10,000+</strong> units sold this week!</p>
        </div>
      </div>
    </section>
  );
}
