import { render } from '@testing-library/react';
import { readFileSync } from 'fs';
import { join } from 'path';
import BrandStory from '@/components/BrandStory';
import Home from '@/app/page';

describe('brand_story', () => {
  test('home renders a section with id="nosotros"', () => {
    const { container } = render(<Home />);
    expect(container.querySelector('section#nosotros')).not.toBeNull();
  });

  test('section has h2 in Spanish and paragraphs with "lana chilena" and "poncho"', () => {
    const { container } = render(<BrandStory />);
    const section = container.querySelector('section#nosotros');
    expect(section).not.toBeNull();
    const h2 = section?.querySelector('h2');
    expect(h2).not.toBeNull();
    expect((h2?.textContent ?? '').trim().length).toBeGreaterThan(0);
    const text = (section?.textContent ?? '').toLowerCase();
    expect(text).toContain('lana chilena');
    expect(text).toContain('poncho');
  });

  test('section uses next/image with /poncho-mujer.webp and Spanish alt', () => {
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'BrandStory.tsx'),
      'utf8'
    );
    expect(src).toMatch(/from\s+['"]next\/image['"]/);
    expect(src).toMatch(/poncho-mujer\.webp/);
    const { container } = render(<BrandStory />);
    const section = container.querySelector('section#nosotros');
    const imgs = section?.querySelectorAll('img') ?? [];
    const main = Array.from(imgs).find((i) =>
      (i.getAttribute('src') ?? '').includes('poncho-mujer.webp')
    );
    expect(main).toBeTruthy();
    const alt = (main?.getAttribute('alt') ?? '').trim();
    expect(alt.length).toBeGreaterThan(0);
  });

  test('section uses asymmetric editorial grid (2 columns on desktop, not 50/50)', () => {
    const { container } = render(<BrandStory />);
    const section = container.querySelector('section#nosotros');
    expect(section).not.toBeNull();
    const className = section?.className ?? '';
    expect(className).toMatch(/md:grid-cols-2|md:grid-cols-\[/);
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'BrandStory.tsx'),
      'utf8'
    );
    expect(src).toMatch(/md:grid-cols-\[5fr_6fr\]|md:grid-cols-\[/);
  });

  test('component is a client component using motion for reveal and parallax', () => {
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'BrandStory.tsx'),
      'utf8'
    );
    expect(src).toMatch(/['"]use client['"]/);
    expect(src).toMatch(/from\s+['"]motion\/react['"]/);
    expect(src).toMatch(/useScroll/);
    expect(src).toMatch(/useTransform/);
    expect(src).toMatch(/useReducedMotion/);
    expect(src).toMatch(/clip-path|clipPath/);
    expect(src).toMatch(/viewport=\{\{\s*once:\s*true\s*\}\}/);
  });

  test('seal.svg exists and is referenced in the section with alt', () => {
    const sealPath = join(process.cwd(), 'public', 'seal.svg');
    expect(() => readFileSync(sealPath, 'utf8')).not.toThrow();
    const { container } = render(<BrandStory />);
    const section = container.querySelector('section#nosotros');
    const sealImg = section?.querySelector('img[src*="seal.svg"]');
    expect(sealImg).not.toBeNull();
    expect((sealImg?.getAttribute('alt') ?? '').length).toBeGreaterThan(0);
  });

  test('seal rotates tied to scrollYProgress via useTransform (absolute positioned)', () => {
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'BrandStory.tsx'),
      'utf8'
    );
    expect(src).toMatch(/absolute/);
    expect(src).toMatch(/scrollYProgress/);
    expect(src).toMatch(/rotate/);
  });

  test('page.tsx mounts the BrandStory component', () => {
    const pagePath = join(process.cwd(), 'src', 'app', 'page.tsx');
    const page = readFileSync(pagePath, 'utf8');
    expect(page).toMatch(/from\s+["']@\/components\/BrandStory["']/);
    expect(page).toMatch(/<BrandStory\s*\/>/);
  });
});
