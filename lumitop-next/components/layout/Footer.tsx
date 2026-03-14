import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 pb-6 text-sm border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-gray-400 uppercase font-semibold mb-4 text-xs">About</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white hover:underline transition">Contact Us</Link></li>
              <li><Link href="/" className="hover:text-white hover:underline transition">About Us</Link></li>
              <li><Link href="/" className="hover:text-white hover:underline transition">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-400 uppercase font-semibold mb-4 text-xs">Help</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white hover:underline transition">Payments</Link></li>
              <li><Link href="/" className="hover:text-white hover:underline transition">Shipping</Link></li>
              <li><Link href="/" className="hover:text-white hover:underline transition">Cancellation & Returns</Link></li>
              <li><Link href="/" className="hover:text-white hover:underline transition">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-400 uppercase font-semibold mb-4 text-xs">Policy</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white hover:underline transition">Return Policy</Link></li>
              <li><Link href="/" className="hover:text-white hover:underline transition">Terms of Use</Link></li>
              <li><Link href="/" className="hover:text-white hover:underline transition">Security</Link></li>
              <li><Link href="/" className="hover:text-white hover:underline transition">Privacy</Link></li>
            </ul>
          </div>
          <div className="pl-0 md:pl-6 md:border-l border-gray-700">
            <h3 className="text-gray-400 uppercase font-semibold mb-4 text-xs">Mail Us:</h3>
            <p className="mb-4">
              Lumitop Internet Private Limited,<br />
              Buildings Alyssa, Begonia &<br />
              Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103,<br />
              Karnataka, India
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs">
          <div className="flex space-x-6 mb-4 md:mb-0">
             <span className="flex items-center gap-1"><span className="text-flipkartYellow">★</span> 100% Secure Payments</span>
             <span className="flex items-center gap-1"><span className="text-flipkartYellow">★</span> Fast Delivery</span>
             <span className="flex items-center gap-1"><span className="text-flipkartYellow">★</span> Return Guarantee</span>
          </div>
          <p>© 2026 Lumitop.com. Built with Next.js.</p>
        </div>
      </div>
    </footer>
  );
}
