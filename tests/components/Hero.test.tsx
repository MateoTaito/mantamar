import { render, screen } from '@testing-library/react';
import { readFileSync } from 'fs';
import { join } from 'path';
import Hero from '@/components/Hero';
import Home from '@/app/page';

describe('hero_section', () => {
  test('home renders a section with id="inicio"', () => {
    const { container } = render(<Home />);
    const section = container.querySelector('section#inicio');
    expect(section).not.toBeNull();
  });

  test('hero section has image with /poncho-hero.webp and Spanish alt', () => {
    const { container } = render(<Hero />);
    const section = container.querySelector('section#inicio');
    expect(section).not.toBeNull();
    const img = section?.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toContain('poncho-hero.webp');
    const alt = (img?.getAttribute('alt') ?? '').trim();
    expect(alt.length).toBeGreaterThan(0);
    expect(alt).toMatch(/[a-záéíóúñ]/i);
  });

  test('hero section has h1 in Spanish, subtitle p, and CTA to #catalogo', () => {
    render(<Hero />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    const h1Text = h1.textContent ?? '';
    expect(h1Text.toLowerCase()).toMatch(/lana|poncho/);
    const section = screen.getByRole('heading', { level: 1 }).closest('section#inicio');
    const p = section?.querySelector('p');
    expect(p).not.toBeNull();
    expect((p?.textContent ?? '').trim().length).toBeGreaterThan(0);
    const cta = screen.getByRole('link', { name: /ver cat[aá]logo/i });
    expect(cta).toBeInTheDocument();
    expect(cta.getAttribute('href')).toBe('#catalogo');
  });

  test('hero section has min-h-[80vh] (or equivalent large height class)', () => {
    const { container } = render(<Hero />);
    const section = container.querySelector('section#inicio');
    expect(section).not.toBeNull();
    const className = section?.className ?? '';
    expect(className).toMatch(/min-h-\[80vh\]|min-h-screen|min-h-\[/);
  });

  test('page.tsx mounts the Hero component', () => {
    const pagePath = join(process.cwd(), 'src', 'app', 'page.tsx');
    const page = readFileSync(pagePath, 'utf8');
    expect(page).toMatch(/from\s+["']@\/components\/Hero["']/);
    expect(page).toMatch(/<Hero\s*\/>/);
  });
});
