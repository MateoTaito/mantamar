'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';

import { formatPrice, type Product } from '@/lib/products';

const productImages = ['/poncho-mujer.webp', '/poncho-hombre.webp'];

function imageFor(slug: string): string {
  return productImages[slug.charCodeAt(slug.length - 1) % productImages.length];
}

function NotFound() {
  return (
    <main className="bg-charcoal text-sand">
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-32 text-center">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-copper">
          404 · Producto
        </span>
        <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
          Producto no encontrado
        </h1>
        <p className="text-lg text-sand/70">
          No encontramos el producto que buscás. Volvé al catálogo para
          seguir explorando.
        </p>
        <Link
          href="/#catalogo"
          className="group mt-2 inline-flex items-center gap-2 rounded-full bg-copper px-8 py-3 text-base font-semibold text-charcoal transition-colors hover:bg-sand"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          Volver al catálogo
        </Link>
      </section>
    </main>
  );
}

function ProductDetailView({ product }: { product: Product }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  const whatsappText = encodeURIComponent(
    `Hola, me interesa el producto ${product.slug}`
  );
  const whatsappHref = `https://wa.me/?text=${whatsappText}`;
  const material = product.material ?? 'Lana chilena';

  return (
    <main className="bg-charcoal text-sand">
      <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <Link
          href="/#catalogo"
          className="group mb-10 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-sand/60 transition-colors hover:text-copper"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          Volver al catálogo
        </Link>

        <div
          ref={ref}
          className="grid grid-cols-1 items-start gap-12 md:grid-cols-2"
        >
          <motion.div
            initial={reduceMotion ? false : { clipPath: 'inset(0 0 100% 0)' }}
            animate={reduceMotion ? undefined : { clipPath: 'inset(0 0 0 0)' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
            className="group relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-espresso"
          >
            <motion.div
              style={reduceMotion ? undefined : { y: imageY }}
              className="h-full w-full"
            >
              <Image
                src={imageFor(product.slug)}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="duotone object-cover"
              />
            </motion.div>
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-copper/20" />
          </motion.div>

          <div className="flex flex-col gap-6">
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, x: 20 }}
              animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-copper"
            >
              {material}
            </motion.span>

            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, x: 20 }}
              animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
            >
              {product.name}
            </motion.h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, x: 20 }}
              animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-mono text-2xl font-medium text-copper"
            >
              {formatPrice(product.price)}
            </motion.p>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, x: 20 }}
              animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-lg leading-relaxed text-sand/80"
            >
              {product.description}
            </motion.p>

            <motion.span
              initial={reduceMotion ? false : { opacity: 0, x: 20 }}
              animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-sand/40"
            >
              REF · {product.slug}
            </motion.span>

            <motion.a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              initial={reduceMotion ? false : { opacity: 0, x: 20 }}
              animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-copper px-8 py-3 text-base font-semibold text-charcoal transition-colors hover:bg-sand"
            >
              Consultar por WhatsApp
            </motion.a>
          </div>
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
