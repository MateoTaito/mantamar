'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

export default function BrandStory() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const sealRotate = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <section
      id="nosotros"
      ref={ref}
      className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 py-24 md:grid-cols-[5fr_6fr] md:gap-20 md:py-32"
    >
      <div className="relative flex flex-col gap-6">
        <motion.span
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-copper"
        >
          Nosotros · Oficio
        </motion.span>
        <motion.h2
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
        >
          Nuestra historia
        </motion.h2>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="max-w-xl text-lg leading-relaxed text-sand/80"
        >
          Mantamar nace del encuentro entre el campo chileno y el oficio
          artesano. Tejemos poncho de lana chilena con técnicas heredadas,
          en pequeños talleres del sur, donde cada pieza lleva el tiempo y
          las manos de quien la hace.
        </motion.p>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl text-lg leading-relaxed text-sand/80"
        >
          Creemos en una moda lenta, en los materiales nobles y en el
          valor de lo hecho a mano. Por eso cada poncho que sale de
          Mantamar es único: una prenda para usar muchos años, no una
          temporada.
        </motion.p>

        <motion.div
          style={reduceMotion ? undefined : { rotate: sealRotate }}
          className="absolute -right-4 -top-16 hidden md:block"
        >
          <Image
            src="/seal.svg"
            alt="Sello Hecho a mano"
            width={120}
            height={120}
            className="opacity-90"
          />
        </motion.div>
      </div>

      <motion.div
        initial={reduceMotion ? false : { clipPath: 'inset(100% 0 0 0)' }}
        whileInView={reduceMotion ? undefined : { clipPath: 'inset(0 0 0 0)' }}
        viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-espresso md:translate-y-6"
      >
        <motion.div style={reduceMotion ? undefined : { y: imageY }} className="h-full w-full">
          <Image
            src="/poncho-mujer.webp"
            alt="Artesana tejiendo un poncho de lana chilena en el sur"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-copper/20" />
      </motion.div>
    </section>
  );
}
