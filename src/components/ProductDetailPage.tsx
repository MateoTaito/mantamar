import { formatPrice, type Product } from '@/lib/products';

function NotFound() {
  return (
    <main className="bg-cream text-ink">
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-32 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Producto no encontrado
        </h1>
        <p className="text-lg text-ink/70">
          No encontramos el producto que buscás. Volvé al catálogo para
          seguir explorando.
        </p>
        <a
          href="#catalogo"
          className="inline-flex items-center justify-center rounded-full bg-ink px-8 py-3 text-base font-semibold text-paper transition-colors hover:bg-coffee-dark"
        >
          Volver al catálogo
        </a>
      </section>
    </main>
  );
}

function ProductDetailView({ product }: { product: Product }) {
  const whatsappText = encodeURIComponent(
    `Hola, me interesa el producto ${product.slug}`
  );
  const whatsappHref = `https://wa.me/?text=${whatsappText}`;
  return (
    <main className="bg-cream text-ink">
      <section className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-12 px-6 py-16 md:grid-cols-2">
        <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-cream-dark">
          <img
            src="/product_placeholder_2.svg"
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold text-coffee-dark">
            {formatPrice(product.price)}
          </p>
          <p className="text-lg leading-relaxed text-ink/80">
            {product.description}
          </p>
          <a
            href={whatsappHref}
            className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-ink px-8 py-3 text-base font-semibold text-paper transition-colors hover:bg-coffee-dark"
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}

export default function ProductDetailPage({
  product,
}: {
  product: Product | undefined;
}) {
  if (!product) return <NotFound />;
  return <ProductDetailView product={product} />;
}
