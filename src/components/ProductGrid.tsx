import { products, formatPrice, type Product } from '@/lib/products';

export { products, formatPrice, type Product };

export function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={`/productos/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-coffee-dark/10 bg-paper text-ink transition-shadow hover:shadow-lg"
    >
      <div className="aspect-[4/5] w-full overflow-hidden bg-cream-dark">
        <img
          src="/product_placeholder_2.svg"
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-semibold leading-snug">{product.name}</h3>
        <p className="text-base font-medium text-coffee-dark">
          {formatPrice(product.price)}
        </p>
      </div>
    </a>
  );
}

export default function ProductGrid() {
  return (
    <section
      id="catalogo"
      className="mx-auto max-w-6xl px-6 py-20"
    >
      <div className="mb-10 flex flex-col gap-3 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Nuestro catálogo
        </h2>
        <p className="text-base text-ink/70">
          Piezas tejidas a mano, una a una, en lana chilena.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
