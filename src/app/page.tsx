import BrandStory from '@/components/BrandStory';
import Hero from '@/components/Hero';
import MaterialsMarquee from '@/components/MaterialsMarquee';
import ProductGrid from '@/components/ProductGrid';

export default function Home() {
  return (
    <main className="bg-charcoal text-sand">
      <Hero />
      <MaterialsMarquee />
      <BrandStory />
      <ProductGrid />
    </main>
  );
}
