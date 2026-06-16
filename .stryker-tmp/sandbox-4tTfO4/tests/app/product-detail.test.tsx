// @ts-nocheck
import { render, screen } from '@testing-library/react';
import ProductDetailPage from '@/app/productos/[slug]/page';
import { products } from '@/lib/products';

describe('product_detail_page', () => {
  test('renders product detail for a valid slug', async () => {
    const Page = await ProductDetailPage({ params: Promise.resolve({ slug: 'poncho-andino' }) });
    render(Page);

    const product = products.find((p) => p.slug === 'poncho-andino')!;
    const h1 = screen.getByRole('heading', { level: 1, name: product.name });
    expect(h1).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toBe('/product_placeholder_2.svg');
    expect(screen.getByText(/\$/)).toBeInTheDocument();
    const cta = screen.getByRole('link', { name: /consultar por whatsapp/i });
    expect(cta).toBeInTheDocument();
    const href = cta.getAttribute('href') ?? '';
    expect(href.startsWith('https://wa.me/')).toBe(true);
    expect(href).toContain('poncho-andino');
  });

  test('renders "Producto no encontrado" for an invalid slug', async () => {
    const Page = await ProductDetailPage({ params: Promise.resolve({ slug: 'no-existe-este-slug' }) });
    render(Page);
    expect(screen.getByRole('heading', { level: 1, name: /producto no encontrado/i })).toBeInTheDocument();
    const back = screen.getByRole('link', { name: /cat[aá]logo|volver/i });
    expect(back.getAttribute('href')).toBe('#catalogo');
  });
});
