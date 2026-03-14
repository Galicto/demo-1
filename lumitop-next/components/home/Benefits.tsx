import { Sun, Moon, Sparkles, Camera } from 'lucide-react';

export default function Benefits() {
  const benefits = [
    {
      icon: <Sun size={32} className="text-orange-500" />,
      title: 'Golden Hour, Anytime',
      desc: 'Replicate the exact warm, glowing light of a perfect sunset in your bedroom. No waiting.'
    },
    {
      icon: <Camera size={32} className="text-purple-500" />,
      title: 'Level Up Your Feed',
      desc: 'The secret lighting weapon for Instagram models, TikTok creators, and stunning photography.'
    },
    {
      icon: <Moon size={32} className="text-blue-500" />,
      title: 'Better Sleep & Mood',
      desc: 'Warm optical lighting helps reduce stress and promotes melatonin production before bed.'
    },
    {
      icon: <Sparkles size={32} className="text-yellow-500" />,
      title: '4 Colors in 1',
      desc: 'Comes with interchangeable color films (Sunset, Sun, Rainbow, Halo) for multiple moods.'
    }
  ];

  return (
    <section className="py-16 bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Everyone is Obsessed</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            It’s not just a lamp; it’s an experience. Transform any plain wall into a masterpiece of light and shadow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition">
              <div className="mb-4 bg-gray-50 p-4 rounded-full">
                {b.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{b.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
