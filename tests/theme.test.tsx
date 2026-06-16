import { render, screen } from '@testing-library/react';
import { readFileSync } from 'fs';
import { join } from 'path';
import RootLayout from '@/app/layout';
import Home from '@/app/page';
import { metadata } from '@/app/layout';

describe('theme_and_globals', () => {
  test('layout renders html lang="es" and home shows an h1 (placeholder replaced by later features)', () => {
    render(
      <RootLayout>
        <Home />
      </RootLayout>
    );
    const html = document.documentElement;
    expect(html.getAttribute('lang')).toBe('es');
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    expect((h1.textContent ?? '').trim().length).toBeGreaterThan(0);
  });

  test('metadata title is Mantamar (drives document.title at framework level)', () => {
    expect(metadata.title).toBe('Mantamar');
  });

  test('main element has bg-cream and text-ink classes', () => {
    const { container } = render(
      <RootLayout>
        <Home />
      </RootLayout>
    );
    const main = container.querySelector('main');
    expect(main).not.toBeNull();
    const className = main?.className ?? '';
    expect(className).toMatch(/bg-cream/);
    expect(className).toMatch(/text-ink/);
  });

  test('metadata exports Mantamar title and Spanish description about wool', () => {
    expect(metadata.title).toBe('Mantamar');
    const desc = String((metadata as { description?: unknown }).description ?? '');
    expect(desc.length).toBeGreaterThan(0);
    expect(desc.toLowerCase()).toMatch(/lana|poncho/);
  });

  test('globals.css imports tailwindcss and declares the brand color tokens', () => {
    const cssPath = join(process.cwd(), 'src', 'app', 'globals.css');
    const css = readFileSync(cssPath, 'utf8');
    expect(css).toMatch(/@import\s+["']tailwindcss["']/);
    expect(css).toMatch(/@theme\b/);
    const tokens: Array<[string, string]> = [
      ['--color-cream', '#F5EDE0'],
      ['--color-cream-dark', '#E8D9C0'],
      ['--color-coffee', '#C9A875'],
      ['--color-coffee-dark', '#8B6F47'],
      ['--color-ink', '#0F0F0F'],
      ['--color-paper', '#FFFFFF'],
    ];
    for (const [name, value] of tokens) {
      const re = new RegExp(`${name}\\s*:\\s*${value.replace('#', '#')}`, 'i');
      expect(css).toMatch(re);
    }
  });
});
