import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    { icon: <Truck size={28} />, title: "Free Shipping", text: "Across India (Pre-paid)" },
    { icon: <ShieldCheck size={28} />, title: "Secure Checkout", text: "100% encryption" },
    { icon: <RefreshCw size={28} />, title: "7 Days Return", text: "Easy replacements" },
    { icon: <Headphones size={28} />, title: "24/7 Support", text: "WhatsApp assistance" },
  ];

  return (
    <div className="bg-white border-y border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-gray-100">
          {badges.map((b, i) => (
            <div key={i} className="flex flex-col items-center text-center px-4">
              <div className="text-flipkartBlue mb-2">{b.icon}</div>
              <h4 className="font-bold text-sm text-gray-900">{b.title}</h4>
              <p className="text-xs text-gray-500">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
