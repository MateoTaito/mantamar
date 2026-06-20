# project-spec.md — Mantamar (v2, rediseño obscuro editorial)

> Spec del sitio "Mantamar": tienda chilena de ponchos de lana tejidos a
> mano. **v2 = rediseño estético completo** del sitio existente. La
> dirección visual pasa de "crema rural" a **casa de oficio premium,
> editorial y obscura** — cruce entre Hermès/Loewe (heritage), revista
> editorial moderna (Another Magazine) y microsite de fashion week con
> motion atrevido. La narrativa de "materiales nobles" (lana como verdad;
> cuero como tono cromático) se transmite vía textura, duotono, copy y
> dirección visual — **sin añadir productos nuevos**.
>
> Modo asistido: la conversación de spec la llevó el `craftsman_lead` con
> el humano; las decisiones están registradas en el encargo y plasmadas
> abajo con su razón y la alternativa descartada. No quedan preguntas
> abiertas.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript estricto**
- **Tailwind v4** (config en `src/app/globals.css`, sin `tailwind.config.js`)
- **`motion`** (la nueva marca de `framer-motion`) para animaciones
  complejas — scroll reveals, parallax, stagger, hover magnético, image
  reveals. **Excepción aprobada** a la regla "solo 3 deps" de
  `docs/architecture.md`.
- **`next/font/google`** para cargar Geist Sans, Geist Mono y Fraunces.
- **Jest + `next/jest`** para tests (sin runner BDD; los escenarios
  Gherkin se traducen a mano a tests de Jest por el `tdd_craftsman`).
- Datos de productos: array estático en `src/lib/products.ts`
  (sin backend, sin base de datos — futuro migrable).

## Invariantes de producto (no renegociables, heredados de v1)

Los tests los exigen y el humano los confirmó explícitamente:

- `products` exporta **6 elementos** con los slugs, nombres y precios
  actuales (`poncho-andino`, `poncho-mapuche`, `chal-lana`,
  `bufanda-larga`, `gorro-piloto`, `mitones-lana`).
- `title: 'Mantamar'` en `metadata`.
- `<html lang="es">`.
- Enlaces a ficha: `/productos/<slug>`.
- Precios formateados en CLP con `$` (ej. `$45.000`).
- `alt` de imágenes en español.
- Slug inválido → estado "Producto no encontrado" (NO 500).

Lo único que puede añadirse al modelo `Product` es un **campo opcional
`material: string`** para alimentar etiquetas de tarjeta y metadata de
detalle. Slugs, nombres y precios **no se tocan**.

## Identidad visual v2

### Dirección

Casa de oficio premium, editorial, obscura. Moderniza el sitio
oscureciendo el canvas base (de `cream` a tinta cálida `charcoal`). El
crema pasa a ser **bloque de contraste editorial**, no el fondo por
defecto. Materiales nobles vía textura (grain), duotono cálido sobre las
fotografías, y tipografía con oficio (serif variable Fraunces para
wordmark y display; Geist Mono para metadata técnica).

### Paleta — 12 tokens en `@theme {}` de `globals.css`

Se conservan los 6 tokens originales (los tests los exigen) y se añaden
6 aditivos:

| Token                  | Hex       | Rol                                                            |
|------------------------|-----------|----------------------------------------------------------------|
| `--color-cream`        | `#F5EDE0` | (original) fondo editorial, ahora bloque de contraste          |
| `--color-cream-dark`   | `#E8D9C0` | (original) variantes de fondo claras                           |
| `--color-coffee`       | `#C9A875` | (original) acentos cálidos                                     |
| `--color-coffee-dark`  | `#8B6F47` | (original) acentos profundos, bordes, hairlines                |
| `--color-ink`          | `#0F0F0F` | (original) texto principal sobre claro, bloques negros         |
| `--color-paper`        | `#FFFFFF` | (original) texto sobre ink (uso residual, ver `sand`)          |
| `--color-charcoal`     | `#1A1714` | **NUEVO** — canvas base obscuro, tinta cálida (más suave que ink) |
| `--color-espresso`     | `#2A1E14` | **NUEVO** — secciones oscuras apiladas, profundidad            |
| `--color-stone`        | `#A89A85` | **NUEVO** — texto secundario sobrio sobre obscuro              |
| `--color-sand`         | `#D9C7A8` | **NUEVO** — off-white cálido sobre obscuro (reemplaza paper clínico en dark) |
| `--color-copper`       | `#B07A4A` | **NUEVO** — acento metálico cálido (CTAs, hairlines, selección) |
| `--color-rust`         | `#8C4A2E` | **NUEVO** — acento "cuero", usar con moderación                |

`body` pasa a `bg-charcoal text-sand`. El `paper` clínico se reserva
para texto sobre `ink` puro en el footer; en el resto del dark canvas
se usa `sand`.

### Tipografía (corrige bug silencioso actual)

Hoy Geist Sans/Mono se declaran en `@theme` vía `--font-geist-sans` /
`--font-geist-mono` pero **nunca se cablean** desde `next/font/google`
en `layout.tsx` → el body cae a Arial. v2 lo corrige:

- **Geist Sans** — body text, UI, párrafos. CSS var `--font-geist-sans`.
- **Geist Mono** — eyebrows, precios, metadata, etiquetas de material
  (guiño técnico "de oficio"). CSS var `--font-geist-mono`.
- **Fraunces** — serif variable con optical-size y SOFT axis, para
  wordmark y headings display (lee "heritage + moderno"). CSS var
  `--font-serif` (conservar nombre existente usado por Header/Footer).

Las tres se cargan vía `next/font/google` en `layout.tsx` con
`variable: '--font-...'` y se exponen al CSS. Escala fluida con
`clamp()` en headings display (ej.
`font-size: clamp(2.5rem, 6vw, 5rem)`).

### Textura y selección

- `public/grain.svg` con textura de fibra sutil, aplicada como overlay
  global (pseudo-elemento o capa fixed, `pointer-events: none`, opacidad
  baja, `mix-blend-mode: overlay` o `soft-light`).
- Selección de texto custom: `::selection { background: var(--color-copper);
  color: var(--color-charcoal); }`.

### Principios de motion (disciplina transversal)

Catálogo de 8 animaciones (A1–A8), distribuidas por feature:

| ID  | Animación                     | Feature              |
|-----|-------------------------------|----------------------|
| A1  | Hero load: clip-path cortina + h1 palabra-por-palabra spring stagger + Ken Burns lento | F3 hero |
| A2  | Hero scroll: parallax imagen sube más lento que el texto + hairline de progreso superior | F3 hero |
| A3  | Marquee materiales: ticker infinito, 2 filas direcciones opuestas, pause on hover | F4 materials_marquee |
| A4  | BrandStory: reveal imagen máscara-from-below + parallax + sello SVG rota ligado al scroll + texto staggered | F5 brand_story |
| A5  | ProductGrid: reveal staggered y-rise + escala imagen; hover magnético (tilt sigue cursor), tag material desliza, hairline dibuja bajo nombre | F6 product_grid |
| A6  | ProductDetail: imagen grande parallax + duotono cede en hover; precio/metadata slide-in; back-link flecha empuja | F8 product_detail_page |
| A7  | Header: scroll-linked shrink + opacidad creciente; underline animada hover nav; wordmark letter-spacing animado | F2 header |
| A8  | Footer: wordmark gigante "MANTAMAR" reveal máscara-wipe; pills sociales hover magnético | F7 footer |

**Disciplina común a todas las features con motion:**

- Solo se animan `transform` y `opacity` (no `top/left/width/height`).
- `viewport={{ once: true }}` para reveals (no se re-disparan al hacer
  scroll up).
- Springs naturales (no `ease` lineales) para reveals orgánicos.
- **Gate completo con `prefers-reduced-motion: reduce`**: cuando el
  usuario lo tiene activado, **cero motion** — el componente renderiza
  directamente en su estado final estático (sin transforms, sin
  stagger, sin parallax). Esto se logra leyendo la preferencia con
  `useReducedMotion()` de `motion` (o su equivalente) y branch en el
  JSX/CSS.
- El **estado inicial** (sin scroll, sin interacción) debe ser ya
  legible y correcto: si JS está deshabilitado o el componente monta
  sin motion, el contenido se ve en su posición final. Esto es, **los
  reveals no deben dejar contenido invisible por defecto** — el estado
  "animado" es el excepcional, el estático es el baseline accesible.

## Features

### F1 — `theme_and_globals` (Tema y estilos globales v2)

**Propósito:** establecer el cimiento visual obscuro editorial (paleta
extendida + 3 fonts cableadas + grain overlay + reduced-motion).

**Comportamiento:** el sitio renderiza sobre `charcoal` con texto
`sand`, textura `grain.svg` sutil como overlay global, selección de
texto custom copper/charcoal, y un `<html lang="es">` con `body`
tipográficamente cableado a Geist Sans/Mono + Fraunces. Una regla
`@media (prefers-reduced-motion: reduce)` global desactiva todas las
animaciones y transiciones.

**Contrato:**
- `src/app/globals.css` importa Tailwind v4 con `@import "tailwindcss"`
  y declara en un bloque `@theme {}` los **12 tokens** listados arriba
  (6 originales + 6 nuevos), más `--font-sans`, `--font-mono`,
  `--font-serif` apuntando a las CSS vars expuestas por `layout.tsx`.
- `src/app/layout.tsx` cablea `Geist`, `Geist_Mono` y `Fraunces` desde
  `next/font/google` con `variable: '--font-geist-sans'`,
  `'--font-geist-mono'`, `'--font-serif'`, los aplica al `<body>` (o al
  `<html>`), y exporta `metadata` con `title: 'Mantamar'` y
  `description` en español sobre lana chilena. Renderiza
  `<html lang="es">`.
- El `<body>` usa `bg-charcoal text-sand` como canvas obscuro base.
- Existe un overlay de textura `grain` aplicado globalmente (vía
  `body::before` o un `<div>` fixed en `layout.tsx`), con
  `pointer-events: none` y opacidad baja.
- `public/grain.svg` existe y es referenciado desde el CSS/JSX.
- `globals.css` declara al menos una `@keyframes` base y una regla
  `@media (prefers-reduced-motion: reduce)` que desactiva animaciones
  (`animation: none; transition: none;` o equivalente).
- `::selection` usa `background: var(--color-copper);
  color: var(--color-charcoal);`.
- `tests/theme.test.tsx` verifica: `html lang='es'`,
  `metadata.title === 'Mantamar'`, el bloque `@theme` con los 12
  tokens, el cableado de `next/font/google` en `layout.tsx`, y el
  `<body>` con clases `bg-charcoal text-sand`.

**Casos límite:**
- **`prefers-reduced-motion: reduce`** activado → el overlay grain
  sigue visible (es textura estática, no motion), pero ninguna
  `@keyframes` corre. El sitio se ve completo sin animación.
- **JS deshabilitado** → `next/font` inyecta las CSS vars igual (se
  hacen en build), el body mantiene `bg-charcoal text-sand`, el grain
  overlay (vía CSS puro en `body::before`) se ve. Sin JS no hay
  overlays montados desde React, por eso el grain **debe estar en CSS**
  (`body::before`), no en un componente cliente.
- **Font no carga** (red caída) → `next/font` cae a system fallback
  declarado en la stack de `font-family` (ej.
  `Fraunces, Georgia, 'Times New Roman', serif`). El sitio sigue
  legible.

**Decisiones:**
- D1: **conservar los 6 tokens originales** además de añadir 6 nuevos
  (12 totales) — razón: los tests de v1 los exigen y el humano pidió
  basarse en ellos; además `cream`/`coffee`/`ink` siguen teniendo rol
  editorial (contraste, hairlines, footer negro). Descartado:
  reemplazar la paleta vieja por una nueva (rompería tests e
  invariantes).
- D2: `paper` se conserva como token pero se reserva para texto sobre
  `ink` puro (footer); el texto sobre `charcoal`/`espresso` usa `sand`
  — razón: `#FFFFFF` clínico sobre tinta cálida queda frío y
  "hospitalario"; `sand` es off-white cálido que encaja con la
  narrativa de materiales nobles. Descartado: usar `paper` en todo el
  dark canvas.
- D3: grain overlay vía `body::before` en CSS puro (no componente
  React) — razón: sobrevive a JS deshabilitado y a
  `prefers-reduced-motion`; además no añade un nodo React al tree.
  Descartado: un `<div className="grain-overlay" />` montado en
  `layout.tsx` (frágil si JS falla y ensucia el DOM).
- D4: cargar las 3 fonts con `next/font/google` y no con `<link>` en
  head — razón: `next/font` auto-self-hosts, elimina layout shift
  (`size-adjust`), y expone CSS vars limpias. Descartado: `<link>` a
  Google Fonts (CLS, privacidad, rendimiento).
- D5: `::selection` copper/charcoal — razón: el copper es el acento
  metálico cálido de la marca; usarlo de fondo con texto charcoal da
  contraste alto y reafirma la paleta. Descartado: selección default
  del navegador (azul clínico, fuera de paleta).

### F2 — `header_navigation` (Cabecera v2 — scroll-linked)

**Propósito:** header sticky con comportamiento scroll-linked (shrink +
opacidad creciente), wordmark en Fraunces con letter-spacing animado, y
nav con underline animada en hover.

**Comportamiento:** el header se monta desde `layout.tsx` (presente en
todas las páginas). En la parte superior (scroll = 0) es transparente
sobre el hero, con wordmark `Mantamar` a la izquierda (enlace a `/`) y
los enlaces `Inicio`, `Catálogo`, `Nosotros`, `Contacto` a la derecha
(anclas `#inicio`, `#catalogo`, `#nosotros`, `#contacto`). Al hacer
scroll, el header se vuelve opaco (`bg-charcoal/90 backdrop-blur`),
se encoge (padding vertical reduce) y el wordmark reduce su
`letter-spacing`. En hover, cada enlace de nav dibuja una underline
animada (hairline copper que crece de izquierda a derecha).

**Contrato:**
- `src/components/Header.tsx` exporta `Header` (default) y se monta en
  `src/app/layout.tsx`.
- `'use client'` declarado; importa `motion` (o `useScroll`/`useMotionValueEvent`
  de `motion/react`).
- Marca `Mantamar` como `<Link href="/">` con clase `font-serif` (Fraunces).
- Enlaces: `[{ href: '#inicio', label: 'Inicio' },
  { href: '#catalogo', label: 'Catálogo' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#contacto', label: 'Contacto' }]`.
- `sticky top-0 z-50` en el `<header>`.
- Comportamiento scroll-linked: uso de `useScroll()` + estado
  `isScrolled` (o `useTransform`) que cambia clases/estilos al superar
  un umbral (ej. `scrollY > 24`). Sin scroll → fondo transparente sobre
  hero; con scroll → `bg-charcoal/90 backdrop-blur` + padding reducido.
- Underline animada en hover: cada `<a>` de nav tiene un
  `::after` (o un `<span>` con `motion`) que escala en X de 0 a 1 al
  `:hover`, color `copper`, altura 1px.
- Wordmark: `letter-spacing` animado (más abierto en top, más cerrado
  al scrollear) vía `useTransform` o transición CSS.
- `prefers-reduced-motion`: el header se renderiza directamente en su
  estado "scrolled" visual estático (con fondo charcoal/90 y padding
  reducido) — sin `useScroll`, sin animación de letter-spacing. La
  underline hover queda como transición CSS instantánea o sin
  transición.
- `tests/components/Header.test.tsx` verifica: texto `Mantamar`
  presente, los 4 enlaces visibles con sus `href`, clase `sticky` en el
  header, y que el componente es cliente (`'use client'` o import de
  `motion`).

**Casos límite:**
- **`prefers-reduced-motion`** → header queda en estado "scrolled"
  estático desde el montaje; sin `useScroll` subscribing. La underline
  hover se desactiva (o es instantánea).
- **JS deshabilitado** → el header se renderiza server-side en su estado
  base (transparente sobre hero, padding completo). Como es `'use
  client'`, el HTML que llega sigue siendo legible y navegable; las
  anclas funcionan; solo el comportamiento scroll-linked no aplica.
  Importante: el estado base **no depende de JS para ser usable**.
- **Scroll = 0 sobre página interna** (ej.
  `/productos/poncho-andino`) → el header transparente debe seguir
  legible sobre el canvas charcoal de la página interna (no hay hero
  oscuro de fondo). Solución: en páginas internas sin hero, el header
  arranca con fondo charcoal/90 desde top (no transparente). Ver
  **PREGUNTA ABIERTA** abajo — resuelta por convención: el header
  siempre arraca con `bg-charcoal/90` al montar, y al hacer scroll
  reduzca padding. La transparencia "sobre hero" se logra dejando que
  el hero tenga `pt` suficiente y el header absolute/transparent solo
  en home. **Decisión concreta:** header siempre `sticky top-0` con
  `bg-charcoal/80 backdrop-blur` desde top (no transparente); el
  scroll-linked solo altera `padding` y `letter-spacing`. Esto evita
  el problema de legibilidad en páginas internas. (Ajuste menor a la
  dirección visual del lead — la legibilidad gana.)

**Decisiones:**
- D1: header siempre con fondo charcoal/80 + backdrop-blur desde top
  (no transparente sobre hero) — razón: legibilidad garantizada en
  páginas internas sin hero; el "shrink" scroll-linked sigue
  cumpliéndose vía padding/letter-spacing. Descartado: header
  transparente sobre hero que se opacifica al scroll (rompe legibilidad
  en `/productos/[slug]`).
- D2: `'use client'` para todo el Header (no extraer sub-componente
  server) — razón: el scroll-linked requiere `useScroll`/estado;
  partirlo añade complejidad sin beneficio. El contenido (marca +
  enlaces) es estático y se hidrata igual. Descartado: Header server
  + sub-componente cliente solo para el comportamiento (más
  aparatoso, no aporta nada porque el markup es trivial).
- D3: underline animada vía CSS `::after` + `transition: transform`
  (no `motion`) — razón: es un hover puramente declarativo, no
  necesita JS; sobrevive a `prefers-reduced-motion` como transición
  instantánea; menos JS. Descartado: underline con `motion` (overkill,
  más paquete JS).
- D4: wordmark con `Link` de Next (no `<a>`) — razón: navega a `/` con
  client-side routing (transición suave entre páginas). Descartado:
  `<a href="/">` (recarga completa, peor UX). Nota: en v1 se usaba
  `<Link>` ya; se conserva.

> **PREGUNTA ABIERTA:** ninguna. El aparente conflicto "header
> transparente sobre hero vs. páginas internas" se cierra con D1.

### F3 — `hero_section` (Hero v2 — cinematic reveal + parallax)

**Propósito:** hero a página completa con reveal cinematográfico al
cargar (clip-path cortina + h1 palabra-por-palabra + Ken Burns lento) y
parallax al scroll (imagen sube más lento que el texto + hairline de
progreso superior).

**Comportamiento:** ocupa `min-h-[80vh]` con la imagen
`/poncho-hero.webp` (full-bleed) y un overlay ink para legibilidad. Al
montar, la imagen se revela con un clip-path de cortina (de
`inset(0 100% 0 0)` a `inset(0 0 0 0)`, duración ~1s, spring suave) y un
Ken Burns lento (scale 1 → 1.08 en ~20s linear infinite). El `<h1>` se
animiza palabra-por-palabra con stagger (cada palabra sube + fade in,
delay incremental 60ms, spring). Al hacer scroll, la imagen sube más
lento que el texto (parallax `y` con `useScroll` + `useTransform`) y
una hairline copper superior crece como barra de progreso de scroll.

**Contrato:**
- `src/components/Hero.tsx` exporta `Hero` (default) y se monta en
  `src/app/page.tsx` con `id="inicio"`.
- `'use client'`; importa `motion` (`useScroll`, `useTransform`,
  `motion.div`, `motion.h1`).
- Sección: `relative min-h-[80vh] overflow-hidden bg-charcoal`.
- Imagen: `src="/poncho-hero.webp"`, `alt` en español (ej.
  `"Poncho de lana chilena tejido a mano sobre fondo del sur"`);
  renderizada con `<img>` o `next/image` (ver D1). `object-cover`,
  `object-center`. Overlay `bg-ink/40` para contraste.
- `<h1>` con titular en español sobre lana chilena o ponchos
  (mantener "Ponchos de lana chilena, tejidos a mano." de v1).
  Cada palabra del h1 envuelta en un `<span className="inline-block">`
  animado con `motion` (stagger).
- `<p>` subtítulo en español (mantener copy actual o refrescar
  manteniendo "materiales nobles" / "sur de Chile").
- `<a href="#catalogo">Ver catálogo</a>` — CTA con estilo copper
  (`bg-copper text-charcoal` o `border border-copper text-sand`).
- Parallax: `useScroll({ target: ref, offset: ['start start', 'end start'] })`
  + `useTransform` para `y` de la imagen (positivo, imagen "baja" al
  subir scroll) y `y` del texto (negativo, texto "sube" más rápido).
- Hairline superior: `<motion.div>` con `scaleX` ligado al progreso de
  scroll, `origin-left`, `h-px`, `bg-copper`, fija arriba del hero.
- `prefers-reduced-motion`: sin clip-path reveal (imagen visible desde
  t=0), sin stagger (h1 visible de una pieza), sin Ken Burns (imagen
  estática), sin parallax (imagen y texto estáticos), sin hairline
  animada (puede quedar estática en `scaleX: 1` o no renderizarse).
- `tests/components/Hero.test.tsx` verifica: sección `id="inicio"` en
  `/`, imagen con `src` apuntando a `/poncho-hero.webp`, `<h1>`
  presente, `<a>` con texto "Ver catálogo" y `href="#catalogo"`,
  clase `min-h-[80vh]` (o equivalente en estilos), y que el componente
  usa `motion` (`'use client'` o import de `motion`).

**Casos límite:**
- **`prefers-reduced-motion`** → todo estático desde t=0: imagen
  visible, h1 legible completo, sin Ken Burns, sin parallax. El
  baseline accesible.
- **JS deshabilitado** → el componente es `'use client'`, pero el HTML
  server-rendered debe traer la imagen, el h1, el `<p>` y el CTA ya
  visibles (sin clases que los oculten por defecto). Crítico: el
  estado inicial de los `motion.div` para reveal **no debe ser
  `opacity: 0` en el SSR** — usar `initial` solo cuando JS esté
  hidratado, o garantizar que sin JS el elemento se ve. Mantra: "el
  estado animado es el excepcional, el estático es el baseline".
- **Scroll = 0** (interacción sin scroll) → imagen revelada, h1
  completo, sin parallax aplicado (todo en posición natural). El
  hero se ve "terminado" desde la carga.
- **Hero muy alto en viewport pequeño** → `min-h-[80vh]` se respeta;
  parallax se calcula contra el `target` correcto (no contra window).

**Decisiones:**
- D1: usar `next/image` para `/poncho-hero.webp` (migrar del `<img>`
  simple de v1) — razón: v2 prioriza calidad visual;
  `next/image` da AVIF/WebP optimizado, lazy y `placeholder="blur"`
  posible. El test v2 actualizado usa `getByRole('img')` o
  `findByAltText` para no depender del `src` literal transformado.
  Descartado: `<img>` simple (de v1, justificado entonces por
  fragilidad del test, pero v2 reescribe tests y acepta `next/image`).
- D2: titular "Ponchos de lana chilena, tejidos a mano." (mantener) —
  razón: encaja con identidad y menciona "lana chilena" + "tejidos a
  mano". Descartado: cambiarlo (rompería copy existente y el test que
  lo busca si lo añaden).
- D3: stagger palabra-por-palabra via `<span>` por palabra + variant
  padre `staggerChildren` — razón: control fino del ritmo editorial.
  Descartado: animar el h1 entero como un bloque (menos dramático,
  pierde el guiño "fashion week").
- D4: Ken Burns con `motion` loop infinito (`repeat: Infinity`,
  `repeatType: 'mirror'` o solo ida) — razón: vida sutil sin
  distraer. Descartado: CSS `@keyframes` (también válido, pero
  uniformidad con el resto de motion en el sitio).
- D5: parallax imagen vs texto con `useTransform` diferente — razón:
  la imagen "queda" mientras el texto "sube" da profundidad
  cinematográfica. Descartado: parallax solo en imagen (menos rico).
- D6: hairline de progreso superior con `scaleX` ligado a
  `scrollYProgress` — razón: guiño editorial "barra de lectura".
  Descartado: ningún indicador (pérdida de detalle).

### F4 — `materials_marquee` (Marquee de materiales — NUEVO)

**Propósito:** ticker infinito horizontal con dos filas en direcciones
opuestas mostrando los materiales nobles y atributos del oficio, entre
el Hero y BrandStory. Refuerza la narrativa de "materiales reales" sin
añadir productos.

**Comportamiento:** dos filas de texto en movimiento horizontal
infinito. Fila superior se mueve de derecha a izquierda; fila inferior
de izquierda a derecha (o viceversa, lo importante es direcciones
opuestas). Cada fila repite la lista de materiales/atributos al menos
una vez para garantizar continuidad visual sin hueco. Al hacer hover
sobre la fila, esta se frena (pause on hover); al sacar el cursor,
reanuda. Tipografía Geist Mono uppercase, con separadores
(`·` o `•`) copper entre términos.

Lista de términos (especificación):
`LANA DE OVEJA · TEÑIDO NATURAL · LANA MERINO · LANA GRUESA · HECHO A MANO · SUR DE CHILE`

**Contrato:**
- `src/components/MaterialsMarquee.tsx` exporta `MaterialsMarquee`
  (default) y se monta en `src/app/page.tsx` **entre** `<Hero>` y
  `<BrandStory>`.
- `'use client'`; importa `motion` o usa CSS animation. Aceptable:
  `motion` con `useAnimationFrame` o `repeat: Infinity` para x
  translation, o CSS `@keyframes marquee` con `animation: marquee
  30s linear infinite`.
- Renderiza **2 filas** (`<div>` por fila), cada una con la lista de
  términos repetida al menos 2x (para que el loop no muestre hueco).
- Direcciones opuestas: fila 1 `x: 0 → -50%`, fila 2 `x: -50% → 0`
  (o equivalentes).
- `pause on hover`: `:hover` sobre la fila settea
  `animation-play-state: paused` (CSS) o `duration: 0` / pausa el
  loop (motion).
- Texto: cada término en `<span>` Geist Mono uppercase tracking-widest,
  separadores `·` en color `copper`. Tamaño fluido (ej.
  `text-sm sm:text-base`).
- Fondo: `bg-espresso` o `bg-charcoal` (sección oscura apilada para
  profundidad), `text-sand`. Padding vertical compacto
  (`py-4` o `py-6`).
- Texto menciona al menos `lana` y `hecho a mano` (están en la lista
  fija).
- `prefers-reduced-motion`: las dos filas se renderizan estáticas (sin
  movimiento), una al lado de la otra, legibles. Equivalente a
  "pausa permanente".
- `tests/components/MaterialsMarquee.test.tsx` verifica: el componente
  se monta en la home, renderiza texto que contiene `lana` y `mano`,
  tiene dos filas (marquee), y es un cliente component / usa `motion`.

**Casos límite:**
- **`prefers-reduced-motion`** → filas estáticas, texto legible
  completo (la repetición 2x queda visible, lo cual es aceptable: se
  ven dos veces los términos, no es un bug).
- **JS deshabilitado** → si se usa CSS `@keyframes`, el marquee
  funciona sin JS. Si se usa `motion`, no funciona pero las dos
  filas se ven estáticas (repetidas 2x). **Recomendación: usar CSS
  `@keyframes` para el marquee** (más resiliente, menos JS, fácil
  `pause on hover` con `:hover`).
- **Viewport muy angosto** (móvil) → los términos se cortan pero el
  ticker sigue continuo; nada de "hueco". La repetición 2x garantiza
  cobertura.
- **Hover mientras anima** → pausa instantánea sin salto visual (el
  `animation-play-state: paused` congela en el frame actual).

**Decisiones:**
- D1: usar CSS `@keyframes` para el movimiento (no `motion`) — razón:
  el marquee es puramente declarativo, no necesita scroll/viewport;
  CSS sobrevive a JS deshabilitado; `pause on hover` es trivial con
  `:hover`. El componente sigue siendo `'use client'` para pasar el
  gate de `prefers-reduced-motion` (o incluso server component con
  CSS puro — pero el test exige `'use client'` o import de `motion`,
  así que se marca `'use client'` y se usa `useReducedMotion` para
  toggle de la clase animada). Descartado: `motion` con
  `useAnimationFrame` (más JS, más frágil).
- D2: lista de términos fija (6 términos) — razón: cubre los
  materiales del catálogo actual (lana de oveja, merino, gruesa) +
  atributos del oficio (teñido natural, hecho a mano, sur de Chile).
  Descartado: derivar dinámicamente del campo `material` de cada
  producto (puede haber duplicados o huecos; la lista curada es más
  fuerte editorialmente).
- D3: separadores `·` en copper — razón: ritmo visual, refuerza
  paleta. Descartado: `•` (más pesado) o `|` (demasiado técnico).
- D4: fondo `bg-espresso` — razón: apila una sección oscura más
  profunda que `charcoal` para crear ritmo "charcoal → espresso →
  charcoal" entre hero y brand story. Descartado: `bg-charcoal`
  (monótono, sin profundidad).

### F5 — `brand_story` (Historia v2 — editorial asimétrico + sello)

**Propósito:** bloque "Nosotros" con layout editorial asimétrico,
reveal de imagen con máscara-from-below, parallax, sello SVG "Hecho a
mano" que rota ligado al scroll, y texto staggered. Mantiene mención
explícita de `lana chilena` y `poncho`.

**Comportamiento:** dos columnas en escritorio con asimetría editorial
(texto a un lado, imagen al otro, no 50/50 sino ~45/55 o con offset
vertical). Al entrar en viewport, la imagen se revela con
máscara-from-below (clip-path de `inset(100% 0 0 0)` a `inset(0 0 0 0)`)
y parallax sutil. El `<h2>` y los `<p>` se staggered (suben + fade in).
Un sello SVG "Hecho a mano" (`/seal.svg`) se posiciona absoluto sobre
la imagen o el bloque, y rota ligado al scroll (ej. `rotate: 0 → 45deg`
a lo largo del scroll de la sección).

**Contrato:**
- `src/components/BrandStory.tsx` exporta `BrandStory` (default) y se
  monta en `src/app/page.tsx` con `id="nosotros"`.
- `'use client'`; importa `motion` (`useScroll`, `useTransform`,
  `motion.div`/`motion.h2`/`motion.p`).
- `<h2>` con título en español (mantener "Nuestra historia" o refrescar
  manteniendo tono).
- `<p>` (uno o más) que mencione explícitamente las palabras
  `lana chilena` y `poncho` (literales — el test las busca).
- Layout: `grid grid-cols-1 md:grid-cols-2` con asimetría (ej.
  `md:grid-cols-[5fr_6fr]` o columnas con `pt` distinto). Colapsa a
  1 columna por debajo de `md`.
- Imagen: `src="/poncho-mujer.webp"`, `alt` en español. **Migrar de
  `<img>`/placeholder SVG a `next/image`** (la versión actual ya usa
  `next/image` con `poncho-mujer.webp` — mantener). Tamaño `aspect-[4/5]`
  o similar, `object-cover`.
- Reveal imagen: `clip-path` animado desde `inset(100% 0 0 0)` (imagen
  tapada desde abajo) a `inset(0 0 0 0)` (visible), spring suave,
  `viewport={{ once: true }}`.
- Parallax imagen: `useScroll` con `target` de la sección, `useTransform`
  para `y` sutil (±20-40px).
- Texto staggered: variant padre con `staggerChildren`, cada `<p>` y el
  `<h2>` hijo suben + fade in.
- Sello: existe `public/seal.svg` con texto "Hecho a mano" (en circle
  o badge). Referenciado en la sección, posicionado absoluto (ej.
  esquina superior derecha del bloque de imagen o sobre el texto).
  Rotación ligada a `scrollYProgress` de la sección: `rotate: 0 → 30deg`
  (o similar) con `useTransform`.
- `prefers-reduced-motion`: sin reveal clip-path (imagen visible desde
  t=0), sin parallax, sin stagger (texto visible), sin rotación de
  sello (sello estático en su ángulo base, ej. `rotate: 0` o un ángulo
  fijo que se vea bien).
- `tests/components/BrandStory.test.tsx` verifica: sección `id="nosotros"`
  en `/`, texto contiene `lana chilena` y `poncho`, imagen apunta a
  `/poncho-mujer.webp`, y el componente usa `motion`.

**Casos límite:**
- **`prefers-reduced-motion`** → imagen visible completa, texto
  legible, sello estático. Sin motion.
- **JS deshabilitado** → imagen, h2 y p se renderizan server-side
  visibles (estado final). El sello SVG aparece estático. Crítico:
  `initial="hidden"` no debe ocultar server-side — usar la misma
  técnica que F3 (estado animado es excepcional, estático es baseline).
- **`public/seal.svg` no encontrado** → si el SVG falta, el `<img>` o
  inline SVG cae a alt vacío o error. El componente debe tener un alt
  en español (ej. `"Sello Hecho a mano"`) y el SVG debe existir (es
  parte del contrato de F5 — crearlo si no está).
- **Hover sobre el sello** → sin comportamiento especial (es
  decorativo; no es interactivo). Opcional: rotación extra en hover,
  pero no exigido.
- **`poncho-mujer.webp` ya existe** en `public/` (verificado en el
  estado actual) — no hace falta crearlo.

**Decisiones:**
- D1: mantener `next/image` para la imagen (no volver a `<img>`) —
  razón: v2 estandariza en `next/image` para todas las fotos reales;
  la imagen ya está cableada así en el estado actual. Descartado:
  `<img>` simple (regresión).
- D2: asimetría editorial vía `grid-cols-[5fr_6fr]` (no 50/50) —
  razón: el lead pidió "editorial asimétrico"; 5/6 da un ligero
  offset que se lee intencional. Descartado: 50/50 (simétrico,
  pierde el guiño editorial) o 40/60 (demasiado desigual, rompe
  balance).
- D3: sello como `<img src="/seal.svg">` con `alt` (no inline SVG) —
  razón: reutilizable, cacheable, y el test puede verificar su
  presencia vía `findByAltText('Sello Hecho a mano')` o similar.
  Descartado: inline SVG en el componente (más markup, no cacheable,
  peor DX).
- D4: rotación del sello ligada al scroll con `useTransform(
  scrollYProgress, [0, 1], [0, 30])` — razón: el sello "gira" a
  medida que pasas la sección, guiño cinético de microsite de
  fashion week. Descartado: rotación continua infinita (distractor,
  cansa).
- D5: título "Nuestra historia" (mantener) — razón: idiomático y
  encaja con el tono. Descartado: "Sobre nosotros" (más frío).
- D6: imagen a la derecha en escritorio (mantener) — razón: lectura
  occidental Izq→Der, texto primero. Descartado: invertir.

### F6 — `product_grid` (Catálogo v2 — bento + hover magnético)

**Propósito:** catálogo con layout bento (producto destacado grande +
resto en cuadrícula), imágenes en duotono cálido, etiquetas de material
por producto, hover magnético (tilt que sigue el cursor), reveal
staggered al entrar en viewport. Cada tarjeta sigue siendo un enlace a
`/productos/<slug>` con imagen, nombre y precio CLP.

**Comportamiento:** grid responsive 1/2/3 columnas. Al menos una tarjeta
ocupa más espacio (col-span/row-span mayor) — el "destacado" bento. Al
entrar en viewport, las tarjetas se revelan con stagger (y-rise + fade
in). Por defecto, las imágenes están en duotono cálido (filtro
`sepia`/`saturate`/`contrast` que mapea a la paleta coffee/charcoal).
En hover sobre una tarjeta: el tilt sigue el cursor (rotación 3D sutil,
`rotateX`/`rotateY` basado en posición del mouse), el tag de material
desliza desde abajo, y una hairline copper se dibuja bajo el nombre.
El duotono cede (la imagen recupera color o se intensifica).

**Contrato:**
- `src/lib/products.ts` exporta `products` con los **6 elementos
  existentes** (slugs/nombres/precios conservados). Cada producto puede
  tener un campo opcional `material: string` (ej. `'Lana de oveja'`,
  `'Lana merino'`, `'Lana gruesa'`). La interfaz `Product` se extiende
  con `readonly material?: string`.
- `src/components/ProductGrid.tsx` se monta en `src/app/page.tsx` con
  `id="catalogo"`. Sigue exponiendo `ProductCard` (named export) y
  `products`/`formatPrice`/`Product` (re-exportados como en v1 para
  que los tests los importen desde ahí).
- Cada `ProductCard` es un enlace a `/productos/<slug>` con:
  - `<img>` o `next/image` con `src` `"poncho-mujer.webp"` o
    `"poncho-hombre.webp"` (rotación por slug como en v1), `alt` con
    el nombre del producto (en español, ej. `"Poncho Andino"`).
  - `<h3>` con el nombre.
  - Precio formateado en CLP con `$` (ej. `$89.000`) vía
    `formatPrice` existente.
  - Etiqueta de material visible (un `<span>` con el `material` del
    producto, o un fallback como `'Lana chilena'` si no tiene).
- Grid responsive: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3`. Al
  menos una tarjeta con `col-span-2` o `row-span-2` (bento destacado).
  Recomendado: la primera tarjeta (`poncho-andino`) es la destacada.
- Duotono: clase CSS `duotone` aplicada a la imagen, con
  `filter: sepia(0.4) saturate(0.8) contrast(1.1)` o similar (definir
  en `globals.css`). En hover, clase `group-hover:duotone-off` o
  transición que relaja el filtro.
- `'use client'`; importa `motion` para reveal staggered (variant
  padre `staggerChildren`, hijos y-rise + fade) y hover magnético.
- Hover magnético: handler `onMouseMove` calcula posición relativa del
  cursor y settea `rotateX`/`rotateY` en un `motion.div` wrapper (con
  `perspective` en el padre). En `onMouseLeave`, reset a 0 con spring.
- Tag de material: `<motion.span>` oculto por defecto (`y: 8px,
  opacity: 0`), animado a `y: 0, opacity: 1` en hover del padre.
- Hairline bajo nombre: `<span>` o `<motion.div>` con `scaleX: 0` →
  `1` en hover, `origin-left`, `h-px bg-copper`.
- `prefers-reduced-motion`: sin reveal staggered (todas las tarjetas
  visibles desde el montaje), sin hover magnético (sin
  `onMouseMove`, sin tilt), sin tag deslizante (tag visible por
  defecto), sin hairline animada (hairline estática visible o
  ausente). El duotono puede mantenerse o ceder (es estático, no
  motion).
- `tests/components/ProductGrid.test.tsx` verifica: grid renderiza al
  menos 6 tarjetas en `/productos/<slug>` (enlaces), cada tarjeta con
  imagen, `<h3>` con nombre, precio con `$`, etiqueta de material;
  grid responsive (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3`); y el
  componente usa `motion`.

**Casos límite:**
- **`prefers-reduced-motion`** → grid visible completo desde t=0, sin
  stagger, sin hover magnético. Tag de material visible. Hairline
  estática. Tarjetas navegables por teclado.
- **JS deshabilitado** → las 6 tarjetas se renderizan server-side
  visibles (sin `initial="hidden"` que oculte). El hover magnético no
  aplica (sin `onMouseMove`), pero las tarjetas siguen siendo
  enlaces clickeables con estilo hover CSS básico (ej.
  `group-hover:shadow-lg` o `group-hover:border-copper`). **El hover
  CSS básico debe estar como fallback** además del magnético JS.
- **Navegación por teclado** (Tab + Enter) → las tarjetas son `<a>`,
  reciben focus, deben tener `:focus-visible` estilo (ring copper o
  hairline). El tag de material debería aparecer en `:focus-visible`
  también (paridad de estados).
- **Producto sin `material`** (campo opcional) → la tarjeta muestra un
  fallback `'Lana chilena'` (o el grid no muestra tag para ese
  producto — pero el test espera "etiqueta de material visible", así
  que mejor fallback). Asegurar que los 6 productos actuales
  tengan `material` definido al migrar (recomendado, no exigido por
  el acceptance).
- **Touch device** (sin hover) → sin hover magnético, sin tag
  deslizante. En touch el tag puede estar visible por defecto, o
  aparecer en `:active` breve. Aceptable: tag visible siempre en
  móvil (`@media (hover: none)` lo muestra fijo).

**Decisiones:**
- D1: `Product` extiende con `material?: string` (opcional, no
  required) — razón: el acceptance dice "puede tener un campo
  opcional `material`"; añadirlo como opcional no rompe tests
  existentes que no lo usen. Descartado: hacerlo required (rompe
  invariantes "slugs/nombres/precios conservados" si algún producto
  no lo trae).
- D2: mantener `<img>` o `next/image` para las fotos de tarjeta —
  razón: v1 usaba `next/image`; v2 mantiene. El test v2 busca el
  `src` del `next/image` (aceptando la transformación) o usa
  `findByAltText`. Recomendado `next/image` para consistencia con
  Hero/BrandStory. Descartado: `<img>` simple.
- D3: duotono vía CSS `filter` (no SVG matrix) — razón: simple,
  performante, degrada bien. Descartado: duotono SVG con matrix
  (más fiel pero pesado y complejo).
- D4: hover magnético con `onMouseMove` + `rotateX/rotateY` (no
  `scale` al hover) — razón: el lead pidió "tilt sigue cursor";
  scale es hover genérico, tilt es "magnético" cinematográfico.
  Descartado: `scale: 1.05` al hover (menos distintivo).
- D5: tag de material visible siempre en móvil (`@media (hover:
  none)`) — razón: en touch no hay hover, el tag sería inaccesible
  si solo aparece en hover. Descartado: tag oculto en móvil (pérdida
  de info).
- D6: bento destacado = primera tarjeta (`poncho-andino`) con
  `md:col-span-2` — razón: el primer producto del array es el más
  caro ($89.000, segundo más caro después de Mapuche $120.000); lo
  destacamos visualmente. Descartado: destacar por precio máximo
  (Mapuche) — cambia el orden visual del array. Alternativa
  descartada: destacar el más caro automáticamente (lógica extra).
- D7: `ProductCard` recibe `product: Product` por props (no hace
  fetch) — razón: el array es estático, compartido con la página de
  detalle. (Heredado de v1.)

### F7 — `footer` (Pie v2 — wordmark reveal + pills magnéticas)

**Propósito:** footer obscuro con wordmark gigante `MANTAMAR` reveal
con máscara-wipe al entrar en viewport, y pills sociales con hover
magnético. Mantiene marca, contacto, 3 redes (Instagram, Facebook,
WhatsApp) y copyright con año dinámico.

**Comportamiento:** footer en `bg-ink text-paper` o `bg-espresso
text-sand`, padding `py-12 px-6` mínimo. Al entrar en viewport, un
wordmark gigante "MANTAMAR" (tamaño display, Fraunces, uppercase,
`clamp(4rem, 12vw, 12rem)`) se revela con máscara-wipe (clip-path o
`background-clip: text` con un gradiente que se desplaza). Las pills
sociales (Instagram, Facebook, WhatsApp) tienen hover magnético similar
al de las tarjetas de producto (tilt + desplazamiento sutil). Mantiene
contacto y copyright con año dinámio.

**Contrato:**
- `src/components/Footer.tsx` exporta `Footer` (default) y se monta en
  `src/app/layout.tsx`.
- `'use client'`; importa `motion`.
- Marca `Mantamar` presente (en bloque de contacto + como wordmark
  gigante `MANTAMAR`).
- Bloque de contacto: email y teléfono placeholder literales
  (`contacto@mantamar.cl`, `+56 9 1234 5678`).
- 3 enlaces a redes: `[{ name: 'Instagram', href: '#' }, { name:
  'Facebook', href: '#' }, { name: 'WhatsApp', href: '#' }]`.
- Fondo obscuro: `bg-ink text-paper` (mantener v1) o `bg-espresso
  text-sand`. Recomendado: `bg-ink text-paper` para el bloque
  principal y wordmark en `text-cream/10` o `text-espresso` como
  "ghost" gigante.
- Padding `py-12 px-6` mínimo.
- Copyright: `© {year} Mantamar. Todos los derechos reservados.` con
  `const year = new Date().getFullYear();` calculado en runtime.
- Wordmark gigante: `<motion.h2>` o `<motion.div>` con texto
  `MANTAMAR`, tamaño display vía `clamp()`, Fraunces. Reveal con
  `clip-path` (de `inset(0 100% 0 0)` a `inset(0 0 0 0)`) o
  `background-clip: text` + gradiente animado. `viewport={{ once: true }}`.
- Pills sociales: cada una `<motion.a>` con hover magnético
  (`onMouseMove` → tilt/desplazamiento sutil, igual disciplina que F6).
- `prefers-reduced-motion`: sin reveal del wordmark (visible desde
  t=0), sin hover magnético (pills con hover CSS básico:
  `border-copper text-copper`).
- `tests/components/Footer.test.tsx` verifica: footer aparece en `/`,
  contiene `Mantamar`, copyright con año actual, tres enlaces a redes
  (Instagram, Facebook, WhatsApp), y el componente usa `motion`.

**Casos límite:**
- **`prefers-reduced-motion`** → wordmark gigante visible estático,
  pills con hover CSS simple. Sin motion.
- **JS deshabilitado** → footer server-rendered visible completo
  (wordmark, contacto, redes, copyright). El año se calcula en
  runtime (server render usa la fecha del servidor o del build; al
  ser `'use client'`, se hidrata con la fecha del cliente — el test
  v1 ya tolera esto).
- **Año dinámico / cambio de año en CI** → `new Date().getFullYear()`
  en runtime. El test verifica que el año actual aparece en el
  copyright.
- **Hover magnético en touch** → sin `onMouseMove`, pills con
  `:active` estilo fallback. Hover CSS básico siempre presente.
- **Wordmark gigante desborda viewport** → `overflow-hidden` en el
  footer o contenedor del wordmark; `text-9xl` o `clamp` controla el
  tamaño. Debe verse recortado limpio, no romper layout.

**Decisiones:**
- D1: wordmark gigante como `<motion.h2>` con `clip-path` reveal (no
  `background-clip: text` + gradiente) — razón: el clip-path es más
  simple y consistente con los reveals de F3/F5. Descartado:
  `background-clip: text` (más experimental, soporte variable).
- D2: hover magnético en pills igual disciplina que F6 (tilt suave +
  translateY) — razón: unidad visual; el sitio entero habla el mismo
  idioma de hover. Descartado: solo `scale` (menos distintivo).
- D3: año con `new Date().getFullYear()` en runtime dentro del
  componente (heredado de v1) — razón: el acceptance lo pide
  explícitamente. Descartado: pasar año como prop (más fricción).
- D4: email/tel placeholder literales (heredados de v1) — razón: el
  acceptance dice "placeholder". Descartado: inventar otros (sin
  valor).
- D5: `bg-ink text-paper` (mantener v1) para el footer — razón: es
  el bloque más oscuro del sitio, ancla el fondo; el wordmark
  gigante "ghost" en `text-cream/10` o `text-espresso` da el
  contraste editorial. Descartado: `bg-espresso` (más cálido pero
  menos contraste con el charcoal del body).

### F8 — `product_detail_page` (Detalle v2 — parallax + duotono)

**Propósito:** ruta `/productos/[slug]` con imagen grande en parallax +
duotono cálido que cede en hover, precio/metadata slide-in, back-link
con flecha animada. Migración del `<img>` placeholder SVG a `next/image`
con foto real. Mantiene el estado "Producto no encontrado" para slug
inválido.

**Comportamiento:** página dinámica que resuelve el producto por
`params.slug` (firma Next 16, `await`). Si no existe, renderiza estado
"Producto no encontrado" + enlace a `#catalogo`. Si existe, ficha con
imagen grande (parallax sutil al scroll), `<h1>` con nombre, precio +
metadata (material, slug) que slide-in al entrar en viewport,
descripción, y CTA "Consultar por WhatsApp" con `href
https://wa.me/?text=...`. Un back-link "← Volver al catálogo" con
flecha que empuja (se desplaza a la izquierda en hover). La imagen está
en duotono cálido por defecto y cede (recupera color) en hover.

**Contrato:**
- `src/app/productos/[slug]/page.tsx` es la ruta dinámica. Resuelve el
  producto desde `src/lib/products.ts` por `params.slug` (firma Next
  16: `params: Promise<{ slug: string }>`, hacer `await`).
- Si no existe: `<h1>Producto no encontrado</h1>` + `<a
  href="#catalogo">Volver al catálogo</a>` (no `notFound()` de Next,
  no 500).
- Si existe: renderiza `ProductDetailPage` (el componente cliente en
  `src/components/ProductDetailPage.tsx`) pasándole el `product`.
- `ProductDetailPage` (cliente): envuelve la ficha en motion.
  - Imagen grande: `next/image` con `src` `"poncho-mujer.webp"` o
    `"poncho-hombre.webp"` (rotación por slug como en ProductGrid), `alt`
    con el nombre del producto (español). `aspect-[4/5]` o `aspect-[3/4]`,
    `object-cover`. **Migrar del `<img src="/product-placeholder-2.svg">`
    actual a `next/image` con foto real.**
  - Duotono cálido por defecto (clase CSS `duotone` compartida con F6),
    cede en hover (`group-hover:duotone-off` o transición).
  - Parallax sutil: `useScroll` con `target` de la sección de imagen,
    `useTransform` para `y` (±20-40px).
  - `<h1>{name}</h1>` (ya visible sin motion — el h1 es crítico para
    SEO y accesibilidad, no se anima con `opacity: 0` initial).
  - `<p>{description}</p>`.
  - Precio formateado CLP con `$` (`formatPrice` existente).
  - Metadata: tag de material (`<span>` Geist Mono uppercase) + slug
    visible como referencia técnica (guiño "de oficio").
  - Precio + metadata con `slide-in` al entrar en viewport (x: 20 → 0
    + opacity, `viewport={{ once: true }}`).
  - `<a href="https://wa.me/?text=...">Consultar por WhatsApp</a>`
    con `target="_blank" rel="noopener noreferrer"`. El `text` es
    `encodeURIComponent(\`Hola, me interesa el producto ${product.slug}\`)`
    (mantener v1).
  - Back-link: `<Link href="/#catalogo">` (Next Link, para routing)
    o `<a href="/#catalogo">` con texto "← Volver al catálogo" y
    flecha que "empuja" en hover (transición `translate-x` negativa
    al hover, o `motion` con `whileHover`).
- `prefers-reduced-motion`: sin parallax, sin duotono animado (queda
  estático), sin slide-in (precio/metadata visibles), sin flecha
  animada (back-link con hover CSS instantáneo o sin él).
- `tests/app/product-detail.test.tsx` con al menos 2 tests:
  - Slug válido: renderiza nombre, precio con `$`, enlace WhatsApp
    apuntando a `https://wa.me/?text=...`.
  - Slug inválido: renderiza `<h1>Producto no encontrado</h1>` y
    `<a href="#catalogo">`.

**Casos límite:**
- **Slug inválido** → estado "Producto no encontrado" + enlace a
  `#catalogo`. No 500, no 404 con `notFound()` (mantener v1).
- **`prefers-reduced-motion`** → ficha estática: imagen visible, h1,
  precio, metadata, descripción, CTA, back-link. Sin motion.
- **JS deshabilitado** → la página dinámica es server-rendered
  (App Router); el HTML llega con la ficha completa (imagen, h1,
  precio, etc.). El `ProductDetailPage` cliente se hidrata encima;
  sin JS, el HTML base sigue siendo legible y el CTA WhatsApp
  funciona (`<a>` con `href`). Crítico: el estado inicial de los
  `motion.div` slide-in **no oculta** precio/metadata server-side.
- **Año dinámico** — no aplica a F8 (no hay copyright en la ficha;
  el footer está en el layout y sí lo tiene, ya cubierto en F7).
- **Migración `<img>` → `next/image`**: el estado actual usa
  `<img src="/product-placeholder-2.svg">`. v2 migra a `next/image`
  con `poncho-mujer.webp` o `poncho-hombre.webp` (rotación por slug
  como en grid). El test v2 actualizado usa `findByAltText` o
  `getByRole('img')` para no depender del `src` transformado por
  `next/image`.

**Decisiones:**
- D1: `params` como `Promise` y `await` (firma Next 16) — razón:
  Next.js 16 cambió la firma; ignorar produce warnings/runtime
  errors. (Heredado de v1, mantenido.)
- D2: WhatsApp placeholder con número faltante en `wa.me/` (mantener
  v1) — razón: el acceptance permite el placeholder. URL:
  `https://wa.me/?text=Hola,%20me%20interesa%20el%20producto%20<slug>`
  con el slug URL-encoded.
- D3: estado "no encontrado" como render normal (no `notFound()`) —
  razón: el acceptance pide enlace a `#catalogo` (ancla), no 404.
  (Heredado de v1.)
- D4: **migrar `<img>` placeholder SVG a `next/image` con foto real**
  — razón: v2 prioriza calidad visual; el placeholder SVG es el
  único `<img>` no-`next/image` que queda en v1; v2 lo elimina.
  Descartado: mantener `<img>` (regresión, contradice la dirección
  visual v2).
- D5: el componente `ProductDetailPage` (cliente) recibe `product` por
  props desde la page (server) — razón: separa la lógica server
  (resolución de slug) de la capa cliente (motion). La page es
  server, el componente es `'use client'`. Descartado: hacer toda la
  page cliente (pierde SEO server-render del h1).
- D6: back-link con `<Link href="/#catalogo">` (no `<a>`) — razón:
  navega de vuelta al home con client-side routing y salta al ancla
  `#catalogo` (paridad con navegación interna). Descartado: `<a
  href="/#catalogo">` (recarga completa). Nota: en v1 era `<a
  href="#catalogo">` porque no había que volver a `/`; en v2 el
  detail está en `/productos/[slug]`, así que el back-link debe ir a
  `/#catalogo` para volver al home y saltar al ancla.
- D7: flecha del back-link "empuja" en hover vía `whileHover={{
  x: -4 }}` (motion) o transición CSS `group-hover:-translate-x-1` —
  razón: guiño cinematográfico "salí por aquí". Descartado: sin
  animación (pierde detalle).
- D8: metadata con tag de material + slug visible (Geist Mono) —
  razón: refuerza el guiño "de oficio" (información técnica
  expuesta); el slug como referencia única de la pieza. Descartado:
  solo precio (menos rico).

## Convenciones transversales (heredadas de v1, vigentes)

- **Estilo:** TypeScript estricto, sin comentarios por defecto, comillas
  simples, template literals para interpolación, líneas ≤ 100 chars.
- **Imports:** React primero, luego Next, luego locales. Una línea por
  módulo.
- **Nombres:** componentes `PascalCase.tsx`, funciones/variables
  `camelCase`, constantes `UPPER_SNAKE`, hooks `useFoo`.
- **Estructura de componente:** `'use client'` (si es cliente) →
  imports → `interface Props` → `export default function Name({...}: Props)`.
- **Tests:** un archivo por componente en `tests/` (o `tests/components/`,
  `tests/app/`), con `describe(...)` y nombres descriptivos
  `test renders ...`. RTL + `jest-dom`.
- **Arquitectura:** tres capas — `src/lib/` (lógica), `src/components/`
  (presentacionales), `src/app/` (rutas). No introducir capas nuevas.
- **Motion:** solo `transform`/`opacity`, `viewport={{ once: true }}`,
  springs naturales, gate completo con `prefers-reduced-motion`, estado
  estático como baseline accesible (los `initial="hidden"` no deben
  ocultar server-side).

## Dependencias (excepción aprobada)

- **`motion`** — añadido a `package.json` para todas las features con
  animación (F2, F3, F4, F5, F6, F7, F8). F1 (globals) no lo usa
  directamente. **Excepción aprobada** a la regla "solo 3 deps" de
  `docs/architecture.md` (decisión del humano).

## Preguntas abiertas

Ninguna. Las 4 decisiones del humano (catálogo solo estético, dep
`motion`, spec+tests reescritos, alcance todo el sitio) cierran todos
los frentes. Los casos límite (slug inválido, año dinámico,
`prefers-reduced-motion`, migración de imagen BrandStory/detalle, hover
magnético sin JS, interacción sin scroll) están cubiertos arriba con
decisión concreta y alternativa descartada.
