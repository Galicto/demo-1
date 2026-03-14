"use client";

import Link from 'next/link';
import { ShoppingCart, Search, Package } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { toggleCart, items } = useCartStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-flipkartBlue text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex flex-col items-start gap-0.5">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl tracking-tight italic">
                Lumi<span className="text-flipkartYellow">top</span>
              </span>
            </Link>
            <span className="text-[10px] text-gray-200 hover:underline italic flex items-center gap-1">
              Explore <span className="text-flipkartYellow font-medium">Plus</span>
              <img src="/plus.png" alt="plus" className="w-2.5 h-2.5" />
            </span>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                className="w-full bg-white text-gray-900 rounded-sm py-2 px-4 pr-10 focus:outline-none text-sm shadow-sm"
              />
              <button className="absolute right-0 top-0 h-full px-3 text-flipkartBlue flex items-center justify-center bg-white rounded-r-sm">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            <Link href="/orders" className="group flex items-center space-x-1 hover:text-white transition cursor-pointer">
              <Package size={20} />
              <span className="hidden sm:inline-block font-medium text-sm">Orders</span>
            </Link>
            <button onClick={toggleCart} className="group flex items-center space-x-1 hover:text-white transition cursor-pointer relative">
              <ShoppingCart size={20} />
              <span className="hidden sm:inline-block font-medium text-sm">Cart</span>
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-flipkartYellow text-black text-xs font-bold px-1.5 py-0.5 rounded-full border border-flipkartBlue">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar (Mobile) */}
        <div className="md:hidden pb-3">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full bg-white text-gray-900 rounded-sm py-2 px-4 pr-10 focus:outline-none text-sm shadow-sm"
              />
              <button className="absolute right-0 top-0 h-full px-3 text-flipkartBlue flex items-center justify-center bg-white rounded-r-sm">
                <Search size={20} />
              </button>
            </div>
        </div>
      </div>
    </header>
  );
}
