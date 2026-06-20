import { render, screen } from '@testing-library/react';
import { readFileSync } from 'fs';
import { join } from 'path';
import ProductDetailPage from '@/components/ProductDetailPage';
import { products } from '@/lib/products';

describe('product_detail_page (component)', () => {
  test('renders product detail for a valid product', () => {
    const product = products.find((p) => p.slug === 'poncho-andino')!;
    render(<ProductDetailPage product={product} />);
    const h1 = screen.getByRole('heading', { level: 1, name: product.name });
    expect(h1).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toMatch(/poncho-(mujer|hombre)\.webp/);
    expect((img.getAttribute('alt') ?? '').length).toBeGreaterThan(0);
    expect(screen.getByText(/\$/)).toBeInTheDocument();
    const cta = screen.getByRole('link', { name: /consultar por whatsapp/i });
    expect(cta).toBeInTheDocument();
    const href = cta.getAttribute('href') ?? '';
    expect(href.startsWith('https://wa.me/')).toBe(true);
    expect(href).toContain('poncho-andino');
    expect(cta.getAttribute('target')).toBe('_blank');
    expect(cta.getAttribute('rel')).toContain('noopener');
  });

  test('renders "Producto no encontrado" for undefined product with link back', () => {
    render(<ProductDetailPage product={undefined} />);
    expect(
      screen.getByRole('heading', { level: 1, name: /producto no encontrado/i })
    ).toBeInTheDocument();
    const back = screen.getByRole('link', { name: /volver al cat[aá]logo/i });
    expect(back.getAttribute('href')).toMatch(/#catalogo/);
  });

  test('component is a client component using motion for parallax and slide-in', () => {
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'ProductDetailPage.tsx'),
      'utf8'
    );
    expect(src).toMatch(/['"]use client['"]/);
    expect(src).toMatch(/from\s+['"]motion\/react['"]/);
    expect(src).toMatch(/useScroll/);
    expect(src).toMatch(/useTransform/);
    expect(src).toMatch(/useReducedMotion/);
  });

  test('uses next/image (migrated from placeholder svg)', () => {
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'ProductDetailPage.tsx'),
      'utf8'
    );
    expect(src).toMatch(/from\s+['"]next\/image['"]/);
    expect(src).not.toMatch(/product-placeholder-2\.svg/);
  });

  test('back-link uses Next Link to /#catalogo with animated arrow', () => {
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'ProductDetailPage.tsx'),
      'utf8'
    );
    expect(src).toMatch(/from\s+['"]next\/link['"]/);
    expect(src).toMatch(/href=["']\/#catalogo["']/);
    expect(src).toMatch(/←/);
    expect(src).toMatch(/group-hover:-translate-x-1/);
  });

  test('metadata shows material tag and slug reference in Geist Mono', () => {
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'ProductDetailPage.tsx'),
      'utf8'
    );
    expect(src).toMatch(/font-mono/);
    expect(src).toMatch(/uppercase/);
    expect(src).toMatch(/material/);
    expect(src).toMatch(/REF/);
    expect(src).toMatch(/product\.slug/);
  });
});

describe('product_detail_page (route handler)', () => {
  test('resolves a known slug to a product', async () => {
    const Page = (await import('@/app/productos/[slug]/page')).default;
    const jsx = await Page({ params: Promise.resolve({ slug: 'poncho-andino' }) });
    const { container } = render(jsx);
    expect(container.textContent).toContain('Poncho Andino');
  });

  test('resolves an unknown slug to the not-found state', async () => {
    const Page = (await import('@/app/productos/[slug]/page')).default;
    const jsx = await Page({ params: Promise.resolve({ slug: 'no-existe-este-slug' }) });
    const { container } = render(jsx);
    expect(container.textContent).toContain('Producto no encontrado');
  });

  test('route uses Next 16 signature: params is Promise and awaited', () => {
    const src = readFileSync(
      join(process.cwd(), 'src', 'app', 'productos', '[slug]', 'page.tsx'),
      'utf8'
    );
    expect(src).toMatch(/params:\s*Promise<\s*\{\s*slug:\s*string\s*\}\s*>/);
    expect(src).toMatch(/await\s+params/);
  });
});
