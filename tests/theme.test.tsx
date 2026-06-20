import { render } from '@testing-library/react';
import { readFileSync } from 'fs';
import { join } from 'path';
import RootLayout, { metadata } from '@/app/layout';
import Home from '@/app/page';

const read = (rel: string): string =>
  readFileSync(join(process.cwd(), rel), 'utf8');

const css = (): string => read('src/app/globals.css');

const layoutSrc = (): string => read('src/app/layout.tsx');

function extractBlock(src: string, openIdx: number): string {
  let depth = 0;
  let out = '';
  for (let i = openIdx; i < src.length; i += 1) {
    const ch = src[i];
    if (ch === '{') {
      depth += 1;
      out += ch;
    } else if (ch === '}') {
      depth -= 1;
      out += ch;
      if (depth === 0) break;
    } else {
      out += ch;
    }
  }
  return out;
}

describe('theme_and_globals', () => {
  test('@s1 home renderiza html lang="es" y metadata.title es Mantamar', () => {
    render(
      <RootLayout>
        <Home />
      </RootLayout>
    );
    expect(document.documentElement.getAttribute('lang')).toBe('es');
    expect(metadata.title).toBe('Mantamar');
  });

  test('@s2 globals.css importa tailwindcss y declara los 12 tokens en @theme', () => {
    const c = css();
    expect(c).toMatch(/@import\s+["']tailwindcss["']/);
    expect(c).toMatch(/@theme\b/);
    const original: Array<[string, string]> = [
      ['--color-cream', '#F5EDE0'],
      ['--color-cream-dark', '#E8D9C0'],
      ['--color-coffee', '#C9A875'],
      ['--color-coffee-dark', '#8B6F47'],
      ['--color-ink', '#0F0F0F'],
      ['--color-paper', '#FFFFFF'],
    ];
    const nuevo: Array<[string, string]> = [
      ['--color-charcoal', '#1A1714'],
      ['--color-espresso', '#2A1E14'],
      ['--color-stone', '#A89A85'],
      ['--color-sand', '#D9C7A8'],
      ['--color-copper', '#B07A4A'],
      ['--color-rust', '#8C4A2E'],
    ];
    for (const [name, value] of [...original, ...nuevo]) {
      const re = new RegExp(`${name}\\s*:\\s*${value}`, 'i');
      expect(c).toMatch(re);
    }
  });

  test('@s3 layout.tsx cablea Geist, Geist_Mono y Fraunces con variables CSS', () => {
    const l = layoutSrc();
    expect(l).toMatch(/next\/font\/google/);
    expect(l).toMatch(/\bGeist\b/);
    expect(l).toMatch(/Geist_Mono/);
    expect(l).toMatch(/Fraunces/);
    expect(l).toMatch(/['"]--font-geist-sans['"]/);
    expect(l).toMatch(/['"]--font-geist-mono['"]/);
    expect(l).toMatch(/['"]--font-serif['"]/);
    expect(l).toMatch(/\$\{geistSans\.variable\}/);
    expect(l).toMatch(/\$\{geistMono\.variable\}/);
    expect(l).toMatch(/\$\{fraunces\.variable\}/);
  });

  test('@s4 body y main usan canvas obscuro charcoal con texto sand', () => {
    render(
      <RootLayout>
        <Home />
      </RootLayout>
    );
    const bodyClass = document.body.className ?? '';
    expect(bodyClass).toMatch(/bg-charcoal/);
    expect(bodyClass).toMatch(/text-sand/);
    const main = document.querySelector('main');
    expect(main).not.toBeNull();
    expect(main?.className ?? '').toMatch(/bg-charcoal/);
    expect(main?.className ?? '').toMatch(/text-sand/);
  });

  test('@s5 existe public/grain.svg y globals.css lo referencia con pointer-events none', () => {
    const grainPath = join(process.cwd(), 'public', 'grain.svg');
    const grain = readFileSync(grainPath, 'utf8');
    expect(grain).toMatch(/feTurbulence/);
    const c = css();
    expect(c).toMatch(/grain\.svg/);
    expect(c).toMatch(/pointer-events:\s*none/);
  });

  test('@s6 globals.css declara ::selection copper/charcoal', () => {
    const c = css();
    expect(c).toMatch(/::selection/);
    expect(c).toMatch(/background:\s*var\(--color-copper\)/);
    expect(c).toMatch(/color:\s*var\(--color-charcoal\)/);
  });

  test('@s7 globals.css declara @keyframes base y gate de reduced-motion', () => {
    const c = css();
    expect(c).toMatch(/@keyframes/);
    expect(c).toMatch(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/);
    expect(c).toMatch(/animation:\s*none/);
    expect(c).toMatch(/transition:\s*none/);
  });

  test('@s8 metadata.description en español menciona lana/poncho/chilena', () => {
    expect(metadata.title).toBe('Mantamar');
    const desc = String(metadata.description ?? '');
    expect(desc.length).toBeGreaterThan(0);
    expect(desc.toLowerCase()).toMatch(/lana|poncho|chilena/);
  });

  test('@s9 la regla grain NO está dentro del bloque prefers-reduced-motion', () => {
    const c = css();
    const mediaIdx = c.indexOf('@media (prefers-reduced-motion: reduce)');
    expect(mediaIdx).toBeGreaterThan(-1);
    const openIdx = c.indexOf('{', mediaIdx);
    const block = extractBlock(c, openIdx);
    expect(block).toMatch(/animation:\s*none/);
    expect(block).toMatch(/transition:\s*none/);
    expect(block).not.toMatch(/grain\.svg/);
  });

  test('@s10 el overlay grain se aplica vía body::before (CSS puro, sin componente React)', () => {
    const c = css();
    expect(c).toMatch(/body::before/);
    expect(c).toMatch(/grain\.svg/);
    expect(c).toMatch(/pointer-events:\s*none/);
    const l = layoutSrc();
    expect(l).not.toMatch(/[Gg]rain/);
  });

  test('@s11 stacks font-family declaran fallbacks serif (Georgia/Times) y sans (system-ui/sans-serif)', () => {
    const c = css();
    expect(c).toMatch(/--font-sans\s*:/);
    expect(c).toMatch(/--font-mono\s*:/);
    expect(c).toMatch(/--font-serif\s*:/);
    expect(c).toMatch(/Georgia|Times New Roman/);
    expect(c).toMatch(/system-ui|sans-serif/);
  });
});
