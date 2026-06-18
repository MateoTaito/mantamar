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

  test('section has h2 in Spanish and a paragraph with "lana chilena" and "poncho"', () => {
    const { container } = render(<BrandStory />);
    const section = container.querySelector('section#nosotros');
    expect(section).not.toBeNull();
    const h2 = section?.querySelector('h2');
    expect(h2).not.toBeNull();
    expect((h2?.textContent ?? '').trim().length).toBeGreaterThan(0);
    const p = section?.querySelector('p');
    expect(p).not.toBeNull();
    const text = (p?.textContent ?? '').toLowerCase();
    expect(text).toContain('lana chilena');
    expect(text).toContain('poncho');
  });

  test('section has image pointing to a poncho image', () => {
    const { container } = render(<BrandStory />);
    const section = container.querySelector('section#nosotros');
    const img = section?.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toContain('poncho-mujer.webp');
  });

  test('section has md:grid-cols-2 for two-column desktop layout', () => {
    const { container } = render(<BrandStory />);
    const section = container.querySelector('section#nosotros');
    expect(section).not.toBeNull();
    const className = section?.className ?? '';
    expect(className).toMatch(/md:grid-cols-2/);
  });

  test('page.tsx mounts the BrandStory component', () => {
    const pagePath = join(process.cwd(), 'src', 'app', 'page.tsx');
    const page = readFileSync(pagePath, 'utf8');
    expect(page).toMatch(/from\s+["']@\/components\/BrandStory["']/);
    expect(page).toMatch(/<BrandStory\s*\/>/);
  });
});
