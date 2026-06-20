'use client';

import { useReducedMotion } from 'motion/react';

const MATERIALS = [
  'LANA DE OVEJA',
  'TEÑIDO NATURAL',
  'LANA MERINO',
  'LANA GRUESA',
  'HECHO A MANO',
  'SUR DE CHILE',
];

function Row({ direction }: { direction: 'left' | 'right' }) {
  const items = [...MATERIALS, ...MATERIALS, ...MATERIALS, ...MATERIALS];
  const animationName = direction === 'left' ? 'marquee-left' : 'marquee-right';
  return (
    <div className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div
        style={{ animationName }}
        className="flex shrink-0 items-center gap-8 whitespace-nowrap py-3 will-change-transform [animation-duration:38s] [animation-iteration-count:infinite] [animation-timing-function:linear] group-hover:[animation-play-state:paused] motion-reduce:[animation:none]"
      >
        {items.map((m, i) => (
          <span key={`${m}-${i}`} className="flex items-center gap-8">
            <span className="font-mono text-sm uppercase tracking-[0.35em] text-sand/85">
              {m}
            </span>
            <span aria-hidden="true" className="text-copper">
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MaterialsMarquee() {
  useReducedMotion();
  return (
    <section
      aria-label="Materiales y oficio"
      className="border-y border-copper/15 bg-espresso py-2"
    >
      <Row direction="left" />
      <Row direction="right" />
    </section>
  );
}
