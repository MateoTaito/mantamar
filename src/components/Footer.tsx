'use client';

import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from 'motion/react';

const SOCIAL_LINKS = [
  { name: 'Instagram', href: '#' },
  { name: 'Facebook', href: '#' },
  { name: 'WhatsApp', href: '#' },
];

function MagneticPill({ name, href }: { name: string; href: string }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });

  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={reduceMotion ? undefined : { x, y }}
      className="inline-flex items-center rounded-full border border-paper/25 px-4 py-1.5 text-sm text-sand transition-colors duration-300 hover:border-copper hover:text-copper motion-reduce:hover:border-paper/40"
    >
      {name}
    </motion.a>
  );
}

export default function Footer() {
  const reduceMotion = useReducedMotion();
  const year = new Date().getFullYear();
  return (
    <footer className="overflow-hidden bg-ink px-6 py-12 text-paper">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-2xl font-bold tracking-tight">
            Mantamar
          </h3>
          <p className="mt-2 max-w-xs text-sm text-paper/70">
            Ponchos y prendas de lana chilena, tejidos a mano en el sur.
          </p>
        </div>
        <div id="contacto">
          <h4 className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-paper/60">
            Contacto
          </h4>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>
              <a
                href="mailto:contacto@mantamar.cl"
                className="transition-colors hover:text-copper"
              >
                contacto@mantamar.cl
              </a>
            </li>
            <li>
              <a
                href="tel:+56912345678"
                className="transition-colors hover:text-copper"
              >
                +56 9 1234 5678
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-paper/60">
            Síguenos
          </h4>
          <ul className="mt-3 flex flex-wrap gap-3 text-sm">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.name}>
                <MagneticPill name={link.name} href={link.href} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-6xl">
        <motion.h2
          initial={reduceMotion ? false : { clipPath: 'inset(0 100% 0 0)' }}
          whileInView={reduceMotion ? undefined : { clipPath: 'inset(0 0 0 0)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] as const }}
          className="font-serif font-bold uppercase leading-none tracking-tight text-paper/15"
          style={{ fontSize: 'clamp(4rem, 14vw, 12rem)' }}
          aria-hidden="true"
        >
          MANTAMAR
        </motion.h2>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-paper/10 pt-6 text-center text-xs text-paper/60">
        © {year} Mantamar. Todos los derechos reservados.
      </div>
    </footer>
  );
}
