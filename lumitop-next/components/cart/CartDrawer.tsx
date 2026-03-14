"use client";

import { useCartStore } from '@/store/cartStore';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getCartTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={toggleCart}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag />
            Your Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
          </h2>
          <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <ShoppingBag size={48} className="opacity-20" />
              <p>Your cart is empty.</p>
              <button 
                onClick={toggleCart}
                className="btn bg-flipkartBlue text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.color}`} className="flex gap-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                  {/* Fallback image placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-[8px] text-white opacity-80 uppercase leading-none text-center p-1">
                    {item.name}
                  </div>
                </div>
                <div className="flex-grow flex flex-col">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm text-gray-900 leading-tight">{item.name}</h3>
                    <button onClick={() => removeItem(item.id, item.color)} className="text-gray-400 hover:text-red-500">
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Color: {item.color}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center border border-gray-300 rounded bg-white">
                      <button 
                        onClick={() => updateQuantity(item.id, item.color, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.color, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between mb-4">
              <span className="text-gray-600 font-medium">Subtotal</span>
              <span className="text-xl font-bold text-gray-900">₹{getCartTotal()}</span>
            </div>
            <Link 
              href="/checkout"
              onClick={toggleCart}
              className="w-full bg-flipkartYellow text-black font-bold py-3 px-4 rounded shadow hover:bg-yellow-400 transition flex justify-center uppercase tracking-wide"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
