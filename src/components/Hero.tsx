'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

const TITLE = 'Ponchos de lana chilena, tejidos a mano.';
const SUBTITLE =
  'Prendas únicas hechas por artesanas y artesanos del sur de Chile. Tradición, oficio y materiales nobles.';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 0.8]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const words = TITLE.split(' ');

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-espresso"
    >
      <motion.div
        style={reduceMotion ? undefined : { y: imageY, scale: imageScale }}
        className="absolute inset-0"
      >
        <Image
          src="/poncho-hero.webp"
          alt="Poncho de lana chilena tejido a mano sobre el sur de Chile"
          fill
          priority
          className="object-cover object-top"
        />
        <motion.div
          style={reduceMotion ? { opacity: 0.6 } : { opacity: overlayOpacity }}
          className="absolute inset-0 bg-ink"
        />
      </motion.div>

      <motion.div
        style={reduceMotion ? undefined : { y: textY }}
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-7 px-6 text-center text-paper"
      >
        <motion.span
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-copper"
        >
          Sur de Chile · Hecho a mano
        </motion.span>

        <h1 className="font-serif text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          {words.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.25 + i * 0.06,
                type: 'spring',
                stiffness: 120,
                damping: 18,
              }}
              className="inline-block"
            >
              {word}
              {i < words.length - 1 ? '\u00A0' : ''}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="max-w-xl text-base leading-relaxed text-sand/90 sm:text-lg"
        >
          {SUBTITLE}
        </motion.p>

        <motion.a
          href="#catalogo"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          whileHover={reduceMotion ? undefined : { scale: 1.04 }}
          className="mt-2 inline-flex items-center justify-center rounded-full bg-copper px-8 py-3 text-base font-semibold text-charcoal transition-colors hover:bg-sand"
        >
          Ver catálogo
        </motion.a>
      </motion.div>

      <motion.div
        style={reduceMotion ? undefined : { width: progressWidth }}
        className="absolute bottom-0 left-0 z-20 h-px bg-copper"
      />
    </section>
  );
}
