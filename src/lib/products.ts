export interface Product {
  readonly slug: string;
  readonly name: string;
  readonly price: number;
  readonly description: string;
  readonly material?: string;
}

export const products: readonly Product[] = [
  {
    slug: 'poncho-andino',
    name: 'Poncho Andino',
    price: 89000,
    material: 'Lana de oveja chilena',
    description:
      'Poncho tejido a mano en lana de oveja chilena, con rayas en tonos café y crudo. Corte amplio, ideal para el campo y la ciudad.',
  },
  {
    slug: 'poncho-mapuche',
    name: 'Poncho Mapuche',
    price: 120000,
    material: 'Teñido natural',
    description:
      'Poncho inspirado en textiles mapuche, tejido en telar con lana teñida con tintes naturales. Cada pieza es única.',
  },
  {
    slug: 'chal-lana',
    name: 'Chal de Lana',
    price: 45000,
    material: 'Lana merino chilena',
    description:
      'Chal suave de lana merino chilena, tejido en punto fino. Perfecto para entretiempo.',
  },
  {
    slug: 'bufanda-larga',
    name: 'Bufanda Larga',
    price: 38000,
    material: 'Lana gruesa con flecos',
    description:
      'Bufanda de más de dos metros en lana gruesa, con flecos hechos a mano. Color crudo natural.',
  },
  {
    slug: 'gorro-piloto',
    name: 'Gorro Piloto',
    price: 25000,
    material: 'Lana rústica',
    description:
      'Gorro de lana rústica con orejeras. Tejido en dos agujas por artesanas del sur de Chile.',
  },
  {
    slug: 'mitones-lana',
    name: 'Mitones de Lana',
    price: 22000,
    material: 'Lana gruesa',
    description:
      'Par de mitones de lana gruesa, tejidos a mano. Ideales para el frío del invierno austral.',
  },
] as const;

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(price);
}
