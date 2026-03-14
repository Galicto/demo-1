import Hero from '@/components/home/Hero';
import FeaturedProduct from '@/components/home/FeaturedProduct';
import Benefits from '@/components/home/Benefits';
import Reviews from '@/components/home/Reviews';
import FAQ from '@/components/home/FAQ';
import TrustBadges from '@/components/home/TrustBadges';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <TrustBadges />
      <FeaturedProduct />
      <Benefits />
      <Reviews />
      <FAQ />
    </div>
  );
}

