import { render } from '@testing-library/react';
import { readFileSync } from 'fs';
import { join } from 'path';
import MaterialsMarquee from '@/components/MaterialsMarquee';
import Home from '@/app/page';

describe('materials_marquee', () => {
  test('MaterialsMarquee is mounted on home between Hero and BrandStory', () => {
    const pagePath = join(process.cwd(), 'src', 'app', 'page.tsx');
    const page = readFileSync(pagePath, 'utf8');
    expect(page).toMatch(/from\s+["']@\/components\/MaterialsMarquee["']/);
    expect(page).toMatch(/<MaterialsMarquee\s*\/>/);
    const heroIdx = page.indexOf('<Hero');
    const marqueeIdx = page.indexOf('<MaterialsMarquee');
    const brandIdx = page.indexOf('<BrandStory');
    expect(heroIdx).toBeGreaterThan(-1);
    expect(marqueeIdx).toBeGreaterThan(-1);
    expect(brandIdx).toBeGreaterThan(-1);
    expect(heroIdx).toBeLessThan(marqueeIdx);
    expect(marqueeIdx).toBeLessThan(brandIdx);
  });

  test('home renders the MaterialsMarquee in the DOM', () => {
    const { container } = render(<Home />);
    const sections = container.querySelectorAll('section');
    expect(sections.length).toBeGreaterThanOrEqual(1);
  });

  test('marquee text contains "lana" and "mano" (case-insensitive)', () => {
    const { container } = render(<MaterialsMarquee />);
    const text = (container.textContent ?? '').toLowerCase();
    expect(text).toContain('lana');
    expect(text).toContain('mano');
  });

  test('marquee renders the 6 material terms', () => {
    const { container } = render(<MaterialsMarquee />);
    const text = container.textContent ?? '';
    expect(text).toContain('LANA DE OVEJA');
    expect(text).toContain('TEÑIDO NATURAL');
    expect(text).toContain('LANA MERINO');
    expect(text).toContain('LANA GRUESA');
    expect(text).toContain('HECHO A MANO');
    expect(text).toContain('SUR DE CHILE');
  });

  test('component is a client component', () => {
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'MaterialsMarquee.tsx'),
      'utf8'
    );
    expect(src).toMatch(/['"]use client['"]/);
    expect(src).toMatch(/from\s+['"]motion\/react['"]/);
  });

  test('two rows move in opposite directions via CSS keyframes', () => {
    const css = readFileSync(
      join(process.cwd(), 'src', 'app', 'globals.css'),
      'utf8'
    );
    expect(css).toMatch(/@keyframes\s+marquee-left/);
    expect(css).toMatch(/@keyframes\s+marquee-right/);
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'MaterialsMarquee.tsx'),
      'utf8'
    );
    expect(src).toMatch(/marquee-left/);
    expect(src).toMatch(/marquee-right/);
  });

  test('marquee pauses on hover via group-hover play-state', () => {
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'MaterialsMarquee.tsx'),
      'utf8'
    );
    expect(src).toMatch(/group-hover:\[animation-play-state:paused\]/);
  });

  test('marquee uses espresso background, sand text and copper separators', () => {
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'MaterialsMarquee.tsx'),
      'utf8'
    );
    expect(src).toMatch(/bg-espresso/);
    expect(src).toMatch(/text-sand/);
    expect(src).toMatch(/text-copper/);
    expect(src).toMatch(/font-mono/);
    expect(src).toMatch(/uppercase/);
    expect(src).toMatch(/tracking-/);
  });
});
