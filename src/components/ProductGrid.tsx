'use client';

import Image from 'next/image';
import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from 'motion/react';

import { products, formatPrice, type Product } from '@/lib/products';

export { products, formatPrice, type Product };

const productImages = ['/poncho-mujer.webp', '/poncho-hombre.webp'];

function imageFor(slug: string): string {
  return productImages[slug.charCodeAt(slug.length - 1) % productImages.length];
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function MagneticCard({ product, featured }: { product: Product; featured: boolean }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });

  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 8);
    rotateX.set(py * -8);
  }

  function onMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  const material = product.material ?? 'Lana chilena';
  const span = featured ? 'md:col-span-2' : '';

  return (
    <motion.div variants={item} className={span}>
      <motion.a
        ref={ref}
        href={`/productos/${product.slug}`}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={
          reduceMotion
            ? undefined
            : { rotateX, rotateY, transformPerspective: 800 }
        }
        whileHover={reduceMotion ? undefined : { y: -6 }}
        className="group flex h-full flex-col overflow-hidden rounded-sm border border-copper/15 bg-espresso text-sand transition-colors duration-300 hover:border-copper/50 focus-visible:border-copper focus-visible:outline-none"
      >
        <div
          className={`relative w-full overflow-hidden bg-charcoal ${
            featured ? 'aspect-[16/11]' : 'aspect-[4/5]'
          }`}
        >
          <Image
            src={imageFor(product.slug)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="duotone object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
          <span className="product-tag absolute left-4 top-4 bg-charcoal/70 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-copper opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:opacity-100">
            {material}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <h3 className="font-serif text-xl font-semibold leading-snug">
            {product.name}
          </h3>
          <span className="h-px w-8 origin-left scale-x-100 bg-copper transition-all duration-500 group-hover:w-full" />
          <p className="font-mono text-base font-medium tracking-wide text-copper">
            {formatPrice(product.price)}
          </p>
        </div>
      </motion.a>
    </motion.div>
  );
}

export default function ProductGrid() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="catalogo" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="mb-12 flex flex-col gap-4">
        <motion.span
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-copper"
        >
          Catálogo · Lana chilena
        </motion.span>
        <motion.h2
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-serif text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Nuestro catálogo
        </motion.h2>
        <p className="max-w-xl text-base text-sand/70">
          Piezas tejidas a mano, una a una, en lana chilena.
        </p>
      </div>
      <motion.div
        variants={container}
        initial={reduceMotion ? false : 'hidden'}
        whileInView={reduceMotion ? undefined : 'show'}
        viewport={{ once: true }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"
      >
        {products.map((product, i) => (
          <MagneticCard key={product.slug} product={product} featured={i === 0} />
        ))}
      </motion.div>
    </section>
  );
}
