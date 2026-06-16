# project-spec.md — Mantamar

> Spec conversada del sitio "Mantamar": tienda de lana chilena y ponchos
> tejidos a mano. Estética: atrevida, moderna, clásica y rural — simple
> pero no minimalista. Sitio estático (App Router de Next.js 16 + Tailwind v4).
>
> Modo fast: spec escrita directamente desde los acceptance criteria de
> `feature_list.json` (no se debatió punto por punto con el humano, las
> decisiones quedan registradas abajo con su razón y la alternativa descartada).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript estricto**
- **Tailwind v4** (config en `src/app/globals.css`, sin `tailwind.config.js`)
- **Jest + `next/jest`** para tests (sin runner BDD, escenarios Gherkin
  se traducen a mano a tests de Jest por el `tdd_craftsman`)
- Datos de productos: array estático en `src/lib/products.ts`
  (sin backend, sin base de datos — futuro migrable)

## Identidad visual

- **Paleta** (declarada como tokens en `@theme {}` en `globals.css`):
  - `cream` `#F5EDE0` — fondo principal
  - `cream-dark` `#E8D9C0` — variantes de fondo
  - `coffee` `#C9A875` — acentos cálidos
  - `coffee-dark` `#8B6F47` — acentos profundos y bordes
  - `ink` `#0F0F0F` — texto principal y bloques oscuros
  - `paper` `#FFFFFF` — texto sobre `ink`
- **Estilo**: atrevido, moderno, clásico, rural. Simple pero no minimalista.
  Tipografía por defecto (Geist Sans + Geist Mono de `next/font/google`).

## Features

### F1 — `theme_and_globals` (Tema y estilos globales)

**Propósito:** establecer el cimiento visual (paleta + tipografía + idioma).

**Comportamiento:** la home renderiza sobre fondo crema, con texto en ink
y un `<h1>Mantamar</h1>` placeholder que las features siguientes irán
reemplazando.

**Contrato:**
- `src/app/globals.css` importa Tailwind v4 con `@import "tailwindcss"` y
  declara los 6 tokens en un bloque `@theme {}`.
- `src/app/layout.tsx` exporta `metadata` con `title: 'Mantamar'` y
  `description` en español sobre la tienda, y renderiza `<html lang="es">`.
- `src/app/page.tsx` renderiza un `<main>` con clases `bg-cream text-ink` y
  un `<h1>Mantamar</h1>`.

**Casos límite:** ninguno adicional al render esperado.

**Decisiones:**
- D1: usar `<html lang="es">` desde F1 (no en F2) — razón: la spec de marca
  es multi-feature, fijar el idioma al definir el tema es más coherente.
  Descartado: hacerlo en F2 (header).
- D2: declarar tokens como `--color-*` en `@theme {}` de Tailwind v4 —
  razón: convención de Tailwind v4, las clases `bg-cream`, `text-ink`, etc.
  se generan automáticamente. Descartado: usar `tailwind.config.js` (Tailwind
  v4 lo desaconseja).

### F2 — `header_navigation` (Cabecera con navegación principal)

**Propósito:** barra superior fija con la marca y los enlaces de navegación.

**Comportamiento:** el header se muestra en todas las páginas (montado
desde `src/app/layout.tsx`), con la marca a la izquierda enlazando a `/` y
los enlaces `Inicio`, `Catálogo`, `Nosotros`, `Contacto` a la derecha.

**Contrato:**
- `src/components/Header.tsx` exporta `Header` y se monta en `layout.tsx`.
- Marca `Mantamar` como enlace a `/` y enlaces a `#inicio`, `#catalogo`,
  `#nosotros`, `#contacto`.
- Fondo `bg-cream/90 backdrop-blur` con borde inferior `border-b
  border-coffee-dark/20`.

**Casos límite:** ninguno (es un presentacional estático).

**Decisiones:**
- D1: `<a>` y `<Link>` (Next) para la marca hacia `/` y `<a>` con `href`
  ancla para el resto — razón: las anclas (`#inicio`, etc.) son a secciones
  de la misma página, no a rutas. Descartado: usar `<Link>` para las anclas
  (overkill, no aporta navegación real).
- D2: header NO fixed (no se exige en acceptance); el acceptance solo pide
  fondo, blur y borde. Razón: "fija" en la descripción no está en los
  criterios verificables; lo tomamos como estilizado y mantenemos la
  semántica del acceptance. Descartado: hacerlo `sticky top-0` (lo añadimos
  visualmente porque mejora UX, pero el test no lo exige).

### F3 — `hero_section` (Sección hero de la página principal)

**Propósito:** banner a página completa con imagen, titular, subtítulo y CTA.

**Comportamiento:** ocupa ≥ 80% del alto de la ventana, con
`/hero_placeholder.webp` de fondo, `<h1>` titular en español, `<p>`
subtítulo y un `<a>Ver catálogo</a>` que enlaza a `#catalogo`.

**Contrato:**
- `public/hero_placeholder.webp` existe.
- `src/components/Hero.tsx` exporta `Hero`, se monta en `page.tsx` con
  `id="inicio"`.
- Sección con `min-h-[80vh]`, `<img>` (o `next/image`) con
  `src="/hero_placeholder.webp"` y `alt` en español, `<h1>` titular,
  `<p>` subtítulo, `<a>Ver catálogo</a>` con `href="#catalogo"`.

**Casos límite:** ninguno.

**Decisiones:**
- D1: usar `<img>` simple (no `next/image`) — razón: el test verifica el
  atributo `src`; con `next/image` el `src` se transforma a una URL
  interna y los tests deben usar `getByRole('img')` para evitar la
  fragilidad. Para mantener el test del acceptance literal, usamos `<img>`.
  Descartado: `next/image` (añade fricción sin beneficio visible en un
  placeholder).
- D2: titular concreto "Ponchos de lana chilena, tejidos a mano." — razón:
  encaja con la identidad (rural + clásico + atrevido) y menciona explícitamente
  "lana chilena" y "ponchos" para reforzar la marca. Descartado: titular
  genérico ("Bienvenido a Mantamar").

### F4 — `brand_story` (Sección de historia de la marca)

**Propósito:** bloque "Nosotros" que refuerza la identidad de marca.

**Comportamiento:** dos columnas en escritorio (texto + imagen), una columna
en móvil. Menciona explícitamente "lana chilena" y "poncho".

**Contrato:**
- `src/components/BrandStory.tsx` exporta `BrandStory`, se monta en `page.tsx`
  con `id="nosotros"`.
- `<h2>` con título en español y `<p>` que mencione "lana chilena" y "poncho".
- Layout `md:grid-cols-2` con imagen `src="/product_placeholder_2.svg"`.

**Casos límite:** ninguno.

**Decisiones:**
- D1: título "Nuestra historia" — razón: idiomático y simple, encaja con el
  tono clásico. Descartado: "Sobre nosotros" (más frío, menos rural).
- D2: imagen a la derecha en escritorio — razón: la lectura occidental va
  de izquierda a derecha, texto primero capta la atención. Descartado:
  invertir (imagen primero).

### F5 — `product_grid` (Catálogo de productos en cuadrícula)

**Propósito:** grid responsive de productos ficticios.

**Comportamiento:** cuadrícula 1/2/3 columnas (móvil/sm/md+) con tarjetas
enlazando a `/productos/<slug>`. Cada tarjeta: imagen, nombre, precio CLP.

**Contrato:**
- `public/product_placeholder_2.svg` existe.
- `src/lib/products.ts` exporta array `products` con al menos 6 elementos
  `{ slug, name, price, description }`.
- `src/components/ProductGrid.tsx` y `ProductCard.tsx` se montan en `page.tsx`
  con `id="catalogo"`. Cada `ProductCard` es un enlace a `/productos/<slug>`
  con `<img src="/product_placeholder_2.svg" alt={name}>`, `<h3>{name}</h3>`
  y precio formateado en CLP (ej. `$45.000`).
- Grid responsive: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3`.

**Casos límite:**
- Productos con precio 0 o negativo: NO se contemplan (datos ficticios,
  asumimos coherentes).
- Slug duplicado: NO se contemplan (datos estáticos validados a mano).

**Decisiones:**
- D1: usar `<img>` simple (no `next/image`) — razón: misma que en F3,
  simplicidad y test estable.
- D2: precio formateado con `Intl.NumberFormat('es-CL', { style: 'currency',
  currency: 'CLP', maximumFractionDigits: 0 })` — razón: localización
  correcta en español chileno. Descartado: formateo manual con
  `.toLocaleString('es-CL')` (más frágil).
- D3: `ProductCard` recibe `product: Product` por props (no hace fetch) —
  razón: el array es estático y compartido con la página de detalle.
- D4: `ProductCard` como `<a>` (no `<Link>`) — razón: ver D1 de F2, los
  tests esperan un `href` literal; usamos `<a>` para mantener paridad.
  En una versión con navegación real se migrará a `<Link>`.

### F6 — `product_detail_page` (Página de detalle de producto)

**Propósito:** ficha de producto en `/productos/[slug]`.

**Comportamiento:** renderiza la ficha del producto por slug. Si el slug
no existe, muestra "Producto no encontrado" + enlace de vuelta al catálogo.

**Contrato:**
- `src/app/productos/[slug]/page.tsx` resuelve el producto desde
  `src/lib/products.ts` por `params.slug`.
- Si no existe: `<h1>Producto no encontrado</h1>` + `<a href="#catalogo">Volver al catálogo</a>`.
- Si existe: `<img src="/product_placeholder_2.svg">`, `<h1>{name}</h1>`,
  `<p>{description}</p>`, precio formateado CLP y `<a>Consultar por
  WhatsApp</a>` con `href="https://wa.me/?text=<mensaje con slug>"`.

**Casos límite:**
- Slug inválido → "Producto no encontrado" (NO 500).

**Decisiones:**
- D1: pasar `params` como `Promise` y hacer `await` — razón: Next.js 16
  cambió la firma de `params` y `searchParams` a `Promise`; ignorar esto
  produce warning/runtime errors.
- D2: WhatsApp placeholder con número faltante en `wa.me/` — razón: el
  acceptance dice explícitamente "placeholder del número, el href puede
  ser un literal". Usamos `https://wa.me/?text=Hola,%20me%20interesa%20el%20producto%20<slug>`
  con el slug URL-encoded.
- D3: para la página de "no encontrado", seguimos renderizando la página
  con un h1 visible (no `notFound()` de Next) — razón: el acceptance
  pide un enlace de vuelta al catálogo (con `href="#catalogo"` ancla),
  no un comportamiento 404 estándar.

### F7 — `footer` (Pie de página del sitio)

**Propósito:** pie con marca, contacto, redes sociales y copyright dinámico.

**Comportamiento:** aparece en todas las páginas (montado desde `layout.tsx`),
fondo oscuro (`bg-ink text-paper`), contiene marca + contacto + 3 redes
(Instagram, Facebook, WhatsApp) + copyright con año dinámico.

**Contrato:**
- `src/components/Footer.tsx` exporta `Footer`, montado en `layout.tsx`.
- Marca `Mantamar`, contacto (email y teléfono placeholder), 3 enlaces
  con `href="#"` a Instagram, Facebook, WhatsApp.
- `bg-ink text-paper py-12 px-6` mínimo.
- Copyright contiene el año actual calculado dinámicamente.

**Casos límite:**
- Año bisiesto / cambio de año en CI: la fecha se calcula en runtime con
  `new Date().getFullYear()`.

**Decisiones:**
- D1: año calculado con `new Date().getFullYear()` en el render (no en
  build) — razón: el acceptance dice "calculado dinámicamente dentro del
  componente". Descartado: pasar el año como prop desde el layout (más
  fricción sin valor).
- D2: email y teléfono como literales placeholder — razón: el acceptance
  dice "placeholder". Usamos `contacto@mantamar.cl` y `+56 9 1234 5678`.

## Convenciones transversales

- **Estilo:** TypeScript estricto, sin comentarios por defecto, comillas
  simples, template literals para interpolación, líneas ≤ 100 chars.
- **Imports:** React primero, luego Next, luego locales. Una línea por
  módulo.
- **Nombres:** componentes `PascalCase.tsx`, funciones/variables `camelCase`,
  constantes `UPPER_SNAKE`.
- **Tests:** un archivo por componente en `tests/`, con `describe(...)` y
  nombres descriptivos `test renders ...`. RTL + `jest-dom`.
- **Arquitectura:** tres capas — `src/lib/` (lógica), `src/components/`
  (presentacionales), `src/app/` (rutas). No introducir capas nuevas.
