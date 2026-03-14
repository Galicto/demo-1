"use client";

import { useCartStore } from '@/store/cartStore';
import { ShieldCheck, Truck, ArrowRight, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'COD'
  });

  // OTP State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    setMounted(true);
    if (items.length === 0) {
      router.push('/');
    }
  }, [items.length, router]);

  useEffect(() => {
    let int: NodeJS.Timeout;
    if (showOtpModal && timer > 0) {
      int = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(int);
  }, [showOtpModal, timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone })
      });
      const data = await res.json();
      if (data.success) {
        setShowOtpModal(true);
        setTimer(30);
      } else {
        alert(data.error || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 4) return;
    
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, code })
      });
      const data = await res.json();
      if (data.success) {
        setShowOtpModal(false);
        processOrder();
      } else {
        alert(data.error || "Invalid OTP. Use 1234 for testing if MSG91 is not yet configured.");
      }
    } catch (err) {
      alert("Verification failed. Check network.");
    }
  };

  const processOrder = async () => {
    try {
      // 1. If Online, initiate Razorpay order first
      if (formData.paymentMethod === 'ONLINE') {
         const payRes = await fetch('/api/payment/razorpay', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ amount: getCartTotal(), receipt: `rcpt_${Date.now()}` })
         });
         const payData = await payRes.json();
         // In a real app, open Razorpay Checkout here
         console.log("Razorpay Order Created:", payData);
         alert("Proceeding with Mock Online Payment...");
      }

      // 2. Create the Order in Supabase/Shopify via our API
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items,
          totalAmount: formData.paymentMethod === 'ONLINE' ? Math.floor(getCartTotal() * 0.9) : getCartTotal()
        })
      });
      const data = await res.json();
      
      if (data.success) {
        clearCart();
        router.push(`/success?orderId=${data.orderId}`);
      } else {
        alert(data.error || "Order creation failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Critical error during checkout.");
    }
  };

  if (!mounted || items.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
          <div className="flex items-center text-green-600 gap-1 text-sm font-medium">
            <Lock size={16} /> 256-bit Encrypted
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Form */}
          <div className="md:col-span-7 bg-white p-6 rounded shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">Delivery Details</h2>
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-flipkartBlue" placeholder="Rahul Sharma" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number (For OTP & Tracking)</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">+91</span>
                  <input required type="tel" maxLength={10} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} className="flex-1 w-full border border-gray-300 rounded-r px-3 py-2 text-sm focus:outline-none focus:border-flipkartBlue" placeholder="9876543210" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Layout / Street</label>
                <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-flipkartBlue" placeholder="House/Flat No., Street Name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input required type="text" maxLength={6} value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-flipkartBlue" placeholder="110001" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-flipkartBlue" placeholder="New Delhi" />
                 </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-flipkartBlue">
                  <option value="">Select State</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="UP">Uttar Pradesh</option>
                  {/* other states */}
                </select>
              </div>

              <h2 className="text-lg font-semibold border-b pb-2 mb-4 mt-8">Payment Method</h2>
              <div className="space-y-3">
                 <label className={`block border rounded p-4 flex items-center gap-3 cursor-pointer ${formData.paymentMethod === 'ONLINE' ? 'bg-blue-50 border-flipkartBlue' : 'border-gray-300'}`}>
                    <input type="radio" name="payment" value="ONLINE" checked={formData.paymentMethod === 'ONLINE'} onChange={() => setFormData({...formData, paymentMethod: 'ONLINE'})} className="w-4 h-4 text-flipkartBlue" />
                    <div>
                      <span className="block font-bold text-gray-900">Online Payment (UPI, Cards, NetBanking)</span>
                      <span className="block text-xs text-green-600 font-medium tracking-wide">Get extra 10% OFF instantly</span>
                    </div>
                 </label>
                 <label className={`block border rounded p-4 flex items-center gap-3 cursor-pointer ${formData.paymentMethod === 'COD' ? 'bg-blue-50 border-flipkartBlue' : 'border-gray-300'}`}>
                    <input type="radio" name="payment" value="COD" checked={formData.paymentMethod === 'COD'} onChange={() => setFormData({...formData, paymentMethod: 'COD'})} className="w-4 h-4 text-flipkartBlue" />
                    <span className="font-bold text-gray-900">Cash on Delivery (COD)</span>
                 </label>
              </div>

              <button type="submit" className="w-full bg-[#fb641b] text-white font-bold py-4 rounded shadow hover:bg-orange-600 transition tracking-wide text-lg mt-6 flex items-center justify-center gap-2">
                Place Order <ArrowRight size={20} />
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-5 relative">
             <div className="bg-white p-6 rounded shadow-sm border border-gray-200 sticky top-24">
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">Order Summary</h2>
                <div className="space-y-4 mb-4">
                  {items.map(item => (
                    <div key={item.id+item.color} className="flex gap-4">
                       <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-600 rounded flex-shrink-0 flex items-center justify-center text-[8px] text-white opacity-80 uppercase leading-none text-center">
                         Image
                       </div>
                       <div>
                         <h4 className="font-semibold text-sm line-clamp-2">{item.name}</h4>
                         <p className="text-xs text-gray-500">Color: {item.color}</p>
                         <p className="text-sm font-bold text-gray-900 mt-1">₹{item.price} x {item.quantity}</p>
                       </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                   <div className="flex justify-between">
                     <span>Item Total</span>
                     <span>₹{getCartTotal()}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Delivery charges</span>
                     <span className="text-green-600">FREE</span>
                   </div>
                   {formData.paymentMethod === 'ONLINE' && (
                     <div className="flex justify-between">
                       <span>Prepaid Discount (10%)</span>
                       <span className="text-green-600">-₹{Math.floor(getCartTotal() * 0.1)}</span>
                     </div>
                   )}
                </div>
                
                <div className="border-y mt-4 py-4 flex justify-between items-center bg-gray-50/50">
                  <span className="font-bold text-lg text-gray-900">Total Amount</span>
                  <span className="font-bold text-xl text-gray-900">
                    ₹{formData.paymentMethod === 'ONLINE' ? Math.floor(getCartTotal() * 0.9) : getCartTotal()}
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                  <ShieldCheck size={16} className="text-gray-400" /> Safe and Secure Payments
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Verify Mobile</h3>
            <p className="text-sm text-gray-600 mb-6">Enter the 4-digit code sent to<br/> <span className="font-bold text-gray-900">+91 {formData.phone}</span></p>
            
            <div className="flex justify-center gap-3 mb-6">
              {[0,1,2,3].map(i => (
                <input 
                  key={i} 
                  id={`otp-${i}`}
                  type="text" 
                  maxLength={1} 
                  value={otp[i]}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[i] = e.target.value;
                    setOtp(newOtp);
                    if (e.target.value && i < 3) document.getElementById(`otp-${i+1}`)?.focus();
                  }}
                  className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-md focus:border-flipkartBlue focus:outline-none"
                />
              ))}
            </div>

            <button onClick={handleVerifyOtp} className="w-full bg-flipkartBlue text-white font-bold py-3 rounded mb-4 hover:bg-blue-700 transition">
              Verify & Complete Order
            </button>
            
            {timer > 0 ? (
               <p className="text-xs text-gray-500">Resend OTP in 00:{timer.toString().padStart(2, '0')}</p>
            ) : (
               <button onClick={() => setTimer(30)} className="text-sm text-flipkartBlue font-bold hover:underline">Resend OTP</button>
            )}
            
            <button onClick={() => setShowOtpModal(false)} className="mt-6 text-xs text-gray-400 hover:text-gray-600 underline">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
