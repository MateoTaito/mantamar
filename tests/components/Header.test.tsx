import { render, screen } from '@testing-library/react';
import { readFileSync } from 'fs';
import { join } from 'path';
import Header from '@/components/Header';

describe('header_navigation', () => {
  test('header renders brand link to / and four nav anchors', () => {
    render(<Header />);
    const brand = screen.getByRole('link', { name: /mantamar/i });
    expect(brand).toBeInTheDocument();
    expect(brand.getAttribute('href')).toBe('/');

    const expected = [
      { text: /inicio/i, href: '#inicio' },
      { text: /cat[aá]logo/i, href: '#catalogo' },
      { text: /nosotros/i, href: '#nosotros' },
      { text: /contacto/i, href: '#contacto' },
    ];
    for (const { text, href } of expected) {
      const link = screen.getByRole('link', { name: text });
      expect(link).toBeInTheDocument();
      expect(link.getAttribute('href')).toBe(href);
    }
  });

  test('header has bg-cream, backdrop-blur and border-b classes', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).not.toBeNull();
    const className = header?.className ?? '';
    expect(className).toMatch(/bg-cream/);
    expect(className).toMatch(/backdrop-blur/);
    expect(className).toMatch(/border-b/);
    expect(className).toMatch(/border-coffee-dark/);
  });

  test('layout mounts Header (and page.tsx does not)', () => {
    const layoutPath = join(process.cwd(), 'src', 'app', 'layout.tsx');
    const pagePath = join(process.cwd(), 'src', 'app', 'page.tsx');
    const layout = readFileSync(layoutPath, 'utf8');
    const page = readFileSync(pagePath, 'utf8');
    expect(layout).toMatch(/from\s+["']@\/components\/Header["']/);
    expect(layout).toMatch(/<Header\s*\/>/);
    expect(page).not.toMatch(/from\s+["']@\/components\/Header["']/);
  });
});
