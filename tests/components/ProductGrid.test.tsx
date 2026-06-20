import { render, screen } from '@testing-library/react';
import { readFileSync } from 'fs';
import { join } from 'path';
import ProductGrid, { products } from '@/components/ProductGrid';
import { getProductBySlug, formatPrice } from '@/lib/products';
import Home from '@/app/page';

describe('product_grid', () => {
  test('home renders a section with id="catalogo"', () => {
    const { container } = render(<Home />);
    expect(container.querySelector('section#catalogo')).not.toBeNull();
  });

  test('the products array has at least 6 valid entries with optional material field', () => {
    expect(products.length).toBeGreaterThanOrEqual(6);
    for (const p of products) {
      expect(typeof p.slug).toBe('string');
      expect(p.slug.length).toBeGreaterThan(0);
      expect(typeof p.name).toBe('string');
      expect(p.name.length).toBeGreaterThan(0);
      expect(typeof p.price).toBe('number');
      expect(Number.isInteger(p.price)).toBe(true);
      expect(typeof p.description).toBe('string');
      expect(p.description.length).toBeGreaterThan(0);
    }
    const slugs = new Set(products.map((p) => p.slug));
    expect(slugs.size).toBe(products.length);
  });

  test('Product interface declares optional material field and slugs are conserved', () => {
    const lib = readFileSync(
      join(process.cwd(), 'src', 'lib', 'products.ts'),
      'utf8'
    );
    expect(lib).toMatch(/readonly\s+material\?\s*:\s*string/);
    for (const slug of [
      'poncho-andino',
      'poncho-mapuche',
      'chal-lana',
      'bufanda-larga',
      'gorro-piloto',
      'mitones-lana',
    ]) {
      expect(lib).toContain(slug);
    }
  });

  test('the grid renders at least 6 cards, each linking to /productos/<slug>', () => {
    render(<ProductGrid />);
    const links = screen.getAllByRole('link');
    const productLinks = links.filter((link) =>
      /^\/productos\/[a-z0-9-]+$/i.test(link.getAttribute('href') ?? '')
    );
    expect(productLinks.length).toBeGreaterThanOrEqual(6);
    for (const p of products) {
      const link = screen.getByRole('link', { name: new RegExp(p.name, 'i') });
      expect(link.getAttribute('href')).toBe(`/productos/${p.slug}`);
    }
  });

  test('each card has image, h3 with name, price with $ and material tag', () => {
    const { container } = render(<ProductGrid />);
    const cards = container.querySelectorAll('a[href^="/productos/"]');
    expect(cards.length).toBeGreaterThanOrEqual(6);
    for (const card of cards) {
      const img = card.querySelector('img');
      expect(img).not.toBeNull();
      const src = img?.getAttribute('src') ?? '';
      expect(src).toMatch(/poncho-(mujer|hombre)\.webp/);
      const alt = img?.getAttribute('alt') ?? '';
      expect(alt.length).toBeGreaterThan(0);
      const h3 = card.querySelector('h3');
      expect(h3).not.toBeNull();
      expect((h3?.textContent ?? '').trim().length).toBeGreaterThan(0);
      const text = card.textContent ?? '';
      expect(text).toContain('$');
    }
  });

  test('each card shows a material tag span', () => {
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'ProductGrid.tsx'),
      'utf8'
    );
    expect(src).toMatch(/product-tag/);
    expect(src).toMatch(/material|Lana chilena/);
  });

  test('grid container is responsive (grid-cols-1 sm:grid-cols-2 md:grid-cols-3)', () => {
    const { container } = render(<ProductGrid />);
    const section = container.querySelector('section#catalogo');
    expect(section).not.toBeNull();
    const grid = section?.querySelector('div.grid');
    expect(grid).not.toBeNull();
    const className = grid?.className ?? '';
    expect(className).toMatch(/grid-cols-1/);
    expect(className).toMatch(/sm:grid-cols-2/);
    expect(className).toMatch(/md:grid-cols-3/);
  });

  test('bento layout: first card (poncho-andino) is featured with md:col-span-2', () => {
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'ProductGrid.tsx'),
      'utf8'
    );
    expect(src).toMatch(/md:col-span-2|col-span-2|row-span-2/);
    expect(src).toMatch(/featured/);
  });

  test('component is a client component with motion, staggered reveal and magnetic hover', () => {
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'ProductGrid.tsx'),
      'utf8'
    );
    expect(src).toMatch(/['"]use client['"]/);
    expect(src).toMatch(/from\s+['"]motion\/react['"]/);
    expect(src).toMatch(/staggerChildren/);
    expect(src).toMatch(/onMouseMove/);
    expect(src).toMatch(/rotateX|rotateY/);
    expect(src).toMatch(/useReducedMotion/);
  });

  test('duotone filter exists in globals.css and is applied on card images', () => {
    const css = readFileSync(
      join(process.cwd(), 'src', 'app', 'globals.css'),
      'utf8'
    );
    expect(css).toMatch(/\.duotone\b/);
    expect(css).toMatch(/sepia|saturate|contrast/);
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'ProductGrid.tsx'),
      'utf8'
    );
    expect(src).toMatch(/duotone/);
  });

  test('focus-visible and hover:none (touch) support declared', () => {
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'ProductGrid.tsx'),
      'utf8'
    );
    expect(src).toMatch(/focus-visible/);
    const css = readFileSync(
      join(process.cwd(), 'src', 'app', 'globals.css'),
      'utf8'
    );
    expect(css).toMatch(/@media\s*\(hover:\s*none\)/);
  });

  test('src/lib/products.ts exists and exports the products array', () => {
    const libPath = join(process.cwd(), 'src', 'lib', 'products.ts');
    const content = readFileSync(libPath, 'utf8');
    expect(content).toMatch(/export\s+(const|let|var)\s+products/);
  });

  test('getProductBySlug returns the product for a known slug and undefined for an unknown one', () => {
    const known = getProductBySlug('poncho-andino');
    expect(known?.name).toBe('Poncho Andino');
    expect(getProductBySlug('nope-nope-nope')).toBeUndefined();
  });

  test('formatPrice formats an integer CLP price in Spanish locale with $ symbol', () => {
    const formatted = formatPrice(45000);
    expect(formatted).toContain('$');
    expect(formatted).toMatch(/45\.000|45,000/);
  });
});
