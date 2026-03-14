"use client";

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Star, ShieldCheck, Zap, Truck, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProductPage() {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const [activeImage, setActiveImage] = useState('/product-1.jpg');
  const [selectedColor, setSelectedColor] = useState('Sunset Red');
  const [quantity, setQuantity] = useState(2); // Default 2 for higher AOV per requirements

  const gallery = ['/product-1.jpg', '/product-2.jpg', '/product-3.jpg', '/product-4.jpg'];
  const colors = ['Sunset Red', 'Sun Light', 'Rainbow', 'Halo'];

  const productDetails = {
    id: 'lumi-v1',
    name: 'Lumitop™ Premium Sunset Projection LED Lamp',
    price: 149,
  };

  const handleAddToCart = () => {
    addItem({
      ...productDetails,
      color: selectedColor,
      quantity,
      image: activeImage
    });
    toggleCart(); // Auto-open cart per requirement
  };

  const handleBuyNow = () => {
    addItem({
      ...productDetails,
      color: selectedColor,
      quantity,
      image: activeImage
    });
    router.push('/checkout');
  };

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6 flex items-center space-x-2">
          <span>Home</span> <span>&gt;</span>
          <span>Home Decor</span> <span>&gt;</span>
          <span>Lamps & Lighting</span> <span>&gt;</span>
          <span className="text-gray-900 font-medium">Lumitop™ Sunset Lamp</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Gallery */}
          <div className="md:col-span-5 flex flex-col space-y-4 sticky top-24 h-max">
            <div className="aspect-square bg-gray-100 border border-gray-200 flex items-center justify-center p-4">
               <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white font-bold opacity-80">
                 [Product Image: {activeImage}]
               </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {gallery.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square bg-gray-100 border-2 ${activeImage === img ? 'border-flipkartBlue' : 'border-transparent hover:border-gray-300'}`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-600 opacity-50"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="md:col-span-7 flex flex-col">
            <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2">
              {productDetails.name} (4 Color Filters Included)
            </h1>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                4.8 <Star size={12} className="fill-current" />
              </span>
              <span className="text-sm text-gray-500 font-medium hover:text-flipkartBlue cursor-pointer">12,403 Ratings & 2,194 Reviews</span>
              <img src="/assured.png" alt="Assured" className="h-5 ml-2 object-contain bg-gray-100 px-1 rounded" />
            </div>

            <div className="text-green-700 text-sm font-bold mb-1">Extra ₹850 off</div>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-4xl font-bold text-gray-900">₹{productDetails.price}</span>
              <span className="text-lg text-gray-500 line-through mb-1">₹999</span>
              <span className="text-md font-bold text-green-600 mb-1">85% off</span>
            </div>
            
            <p className="text-sm text-gray-700 mb-6">
              Bring the mesmerizing warmth of a perfect sunset into your room, anytime. Featuring a high-quality optical lens and ultra-bright LED, it creates stunning, atmospheric lighting perfect for photography, relaxation, or romantic dinners.
            </p>

            {/* Configurator */}
            <div className="space-y-6 border-y border-gray-200 py-6 mb-6">
              
              <div>
                <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase">Color Film Choice</h3>
                <div className="flex gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded text-sm ${selectedColor === color ? 'border-flipkartBlue text-flipkartBlue font-bold bg-blue-50/50' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">*Note: All 4 films are included in the box. This just sets your default lens.</p>
              </div>

              <div>
                 <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase">Quantity</h3>
                 <div className="flex items-center gap-3">
                    <select 
                      value={quantity} 
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="border border-gray-300 rounded p-2 focus:outline-none focus:border-flipkartBlue bg-white text-sm"
                    >
                      {[1, 2, 3, 4, 5].map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                    {quantity === 2 && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold border border-yellow-200">Most Popular Choice!</span>}
                 </div>
              </div>

            </div>

            {/* Delivery Details */}
            <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-8">
               <div className="flex items-start gap-4 mb-3">
                 <Truck className="text-gray-400 shrink-0" size={24} />
                 <div>
                   <h4 className="text-sm font-medium text-gray-900">Free Delivery Available</h4>
                   <p className="text-xs text-gray-500">Usually delivered in 3-5 days across India.</p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <CheckCircle2 className="text-green-600 shrink-0" size={24} />
                 <div>
                   <h4 className="text-sm font-medium text-green-700">Cash on Delivery Available</h4>
                   <p className="text-xs text-gray-500">Pay when you receive the product.</p>
                 </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 sticky bottom-0 bg-white p-4 shadow-lg md:shadow-none md:p-0 border-t md:border-none border-gray-200 z-20">
              <button 
                onClick={handleAddToCart}
                className="btn py-4 bg-[#ff9f00] text-white font-bold rounded shadow-[0_1px_2px_0_rgba(0,0,0,0.2)] hover:shadow-md transition uppercase tracking-wide text-lg flex items-center justify-center gap-2"
              >
                 Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="btn py-4 bg-[#fb641b] text-white font-bold rounded shadow-[0_1px_2px_0_rgba(0,0,0,0.2)] hover:shadow-md transition uppercase tracking-wide text-lg flex items-center justify-center gap-2"
              >
                 Buy Now
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
