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

  test('footer has bg-ink, text-paper, py-12, px-6 classes', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).not.toBeNull();
    const className = footer?.className ?? '';
    expect(className).toMatch(/bg-ink/);
    expect(className).toMatch(/text-paper/);
    expect(className).toMatch(/py-12/);
    expect(className).toMatch(/px-6/);
  });

  test('footer has links to Instagram, Facebook, and WhatsApp with href="#"', () => {
    render(<Footer />);
    for (const network of ['Instagram', 'Facebook', 'WhatsApp']) {
      const link = screen.getByRole('link', { name: new RegExp(network, 'i') });
      expect(link).toBeInTheDocument();
      expect(link.getAttribute('href')).toBe('#');
    }
  });

  test('copyright contains the current year computed at render time', () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    const footer = screen.getByRole('contentinfo');
    expect(footer.textContent ?? '').toContain(String(year));
  });

  test('footer is mounted from the layout, not from each page', () => {
    const layoutPath = join(process.cwd(), 'src', 'app', 'layout.tsx');
    const layout = readFileSync(layoutPath, 'utf8');
    expect(layout).toMatch(/from\s+["']@\/components\/Footer["']/);
    expect(layout).toMatch(/<Footer\s*\/>/);
  });
});
