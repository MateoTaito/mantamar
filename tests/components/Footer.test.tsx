import { render, screen } from '@testing-library/react';
import { readFileSync } from 'fs';
import { join } from 'path';
import Footer from '@/components/Footer';

describe('footer', () => {
  test('footer renders with the Mantamar brand', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).not.toBeNull();
    expect(footer?.textContent ?? '').toMatch(/mantamar/i);
  });

  test('footer has dark background, light text and padding py-12 px-6', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).not.toBeNull();
    const className = footer?.className ?? '';
    expect(className).toMatch(/bg-ink|bg-espresso/);
    expect(className).toMatch(/text-paper|text-sand/);
    expect(className).toMatch(/py-12/);
    expect(className).toMatch(/px-6/);
    expect(className).toMatch(/overflow-hidden/);
  });

  test('footer has links to Instagram, Facebook, and WhatsApp with href="#"', () => {
    render(<Footer />);
    for (const network of ['Instagram', 'Facebook', 'WhatsApp']) {
      const link = screen.getByRole('link', { name: new RegExp(network, 'i') });
      expect(link).toBeInTheDocument();
      expect(link.getAttribute('href')).toBe('#');
    }
  });

  test('footer shows contact email and phone', () => {
    const { container } = render(<Footer />);
    const text = container.textContent ?? '';
    expect(text).toContain('contacto@mantamar.cl');
    expect(text).toContain('+56 9 1234 5678');
  });

  test('copyright contains the current year computed at render time', () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    const footer = screen.getByRole('contentinfo');
    expect(footer.textContent ?? '').toContain(String(year));
    expect(footer.textContent ?? '').toMatch(/todos los derechos reservados/i);
  });

  test('component is a client component using motion', () => {
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'Footer.tsx'),
      'utf8'
    );
    expect(src).toMatch(/['"]use client['"]/);
    expect(src).toMatch(/from\s+['"]motion\/react['"]/);
    expect(src).toMatch(/useReducedMotion/);
  });

  test('giant MANTAMAR wordmark with clip-path reveal and clamp() size', () => {
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'Footer.tsx'),
      'utf8'
    );
    expect(src).toMatch(/MANTAMAR/);
    expect(src).toMatch(/font-serif/);
    expect(src).toMatch(/uppercase/);
    expect(src).toMatch(/clamp\(/);
    expect(src).toMatch(/clip-path|clipPath/);
    expect(src).toMatch(/viewport=\{\{\s*once:\s*true\s*\}\}/);
  });

  test('social pills have magnetic hover via onMouseMove', () => {
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'Footer.tsx'),
      'utf8'
    );
    expect(src).toMatch(/onMouseMove/);
  });

  test('footer is mounted from the layout, not from each page', () => {
    const layoutPath = join(process.cwd(), 'src', 'app', 'layout.tsx');
    const layout = readFileSync(layoutPath, 'utf8');
    expect(layout).toMatch(/from\s+["']@\/components\/Footer["']/);
    expect(layout).toMatch(/<Footer\s*\/>/);
  });
});
