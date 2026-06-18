import { render, screen } from '@testing-library/react';
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
    expect(img.getAttribute('src')).toBe('/product-placeholder-2.svg');
    expect(screen.getByText(/\$/)).toBeInTheDocument();
    const cta = screen.getByRole('link', { name: /consultar por whatsapp/i });
    expect(cta).toBeInTheDocument();
    const href = cta.getAttribute('href') ?? '';
    expect(href.startsWith('https://wa.me/')).toBe(true);
    expect(href).toContain('poncho-andino');
  });

  test('renders "Producto no encontrado" for undefined product', () => {
    render(<ProductDetailPage product={undefined} />);
    expect(
      screen.getByRole('heading', { level: 1, name: /producto no encontrado/i })
    ).toBeInTheDocument();
    const back = screen.getByRole('link', { name: /cat[aá]logo|volver/i });
    expect(back.getAttribute('href')).toBe('#catalogo');
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
});
