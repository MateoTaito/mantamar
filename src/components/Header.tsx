'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useReducedMotion, useScroll, useMotionValueEvent } from 'motion/react';

const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#catalogo', label: 'Catálogo' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#contacto', label: 'Contacto' },
];

const SCROLL_THRESHOLD = 24;

export default function Header() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > SCROLL_THRESHOLD);
  });

  const effectiveScrolled = reduceMotion === true || isScrolled;

  const paddingY = effectiveScrolled ? 'py-3' : 'py-5';
  const letterSpacing = effectiveScrolled ? 'tracking-tight' : 'tracking-wide';

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-copper/15 bg-charcoal/80 backdrop-blur-md transition-colors ${paddingY}`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className={`font-serif text-2xl font-bold ${letterSpacing} text-sand transition-[letter-spacing] duration-300`}
        >
          Mantamar
        </Link>
        <ul className="flex items-center gap-7 text-sm font-medium text-sand/80">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="group relative">
              <a
                href={link.href}
                className="relative inline-block py-1 transition-colors hover:text-sand"
              >
                <span className="font-mono uppercase tracking-widest text-[0.7rem]">
                  {link.label}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-copper transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
