import BrandStory from '@/components/BrandStory';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';

export default function Home() {
  return (
    <main className="bg-cream text-ink">
      <Hero />
      <BrandStory />
      <ProductGrid />
    </main>
  );
}
