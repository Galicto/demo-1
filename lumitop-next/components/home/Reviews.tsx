import { Star } from 'lucide-react';

export default function Reviews() {
  const reviews = [
    {
      name: "Priya Sharma",
      date: "2 Days Ago",
      rating: 5,
      title: "Absolutely magical!",
      text: "Bought this after seeing it on Reels. The light quality is insane. It genuinely looks like the sun is setting in my room. Fast delivery too!",
      city: "Mumbai"
    },
    {
      name: "Rahul Verma",
      date: "1 Week Ago",
      rating: 5,
      title: "Best background light for videos",
      text: "If you make content, you NEED this. It gives that perfect aesthetic glow without needing expensive studio lights. The 4 color filters are a bonus.",
      city: "Delhi"
    },
    {
      name: "Sneha Reddy",
      date: "2 Weeks Ago",
      rating: 4,
      title: "Great product, solid build",
      text: "The heavy metal base keeps it very stable. It doesn't feel cheap at all. Deducted one star just because I wish the cable was a bit longer.",
      city: "Hyderabad"
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Loved by over 10,000+ Indians</h2>
        <div className="flex justify-center items-center gap-2 mb-10">
          <div className="flex text-green-600">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-current" />)}
          </div>
          <span className="font-bold text-gray-900">4.8/5 Average Rating</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-green-600">
                  {[...Array(r.rating)].map((_, idx) => <Star key={idx} size={14} className="fill-current" />)}
                </div>
                <span className="text-xs text-gray-500 font-medium">{r.date}</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{r.title}</h4>
              <p className="text-sm text-gray-600 mb-4 line-clamp-4">"{r.text}"</p>
              <div className="text-xs text-gray-500 font-medium flex items-center justify-between mt-auto">
                <span>{r.name} </span>
                <span className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-full">{r.city}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
