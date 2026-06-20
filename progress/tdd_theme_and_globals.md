# TDD — feature 1: theme_and_globals

**Modo:** ui-mode
**Ciclos:** 1 agrupado (11 escenarios @s1..@s11) — ROJO global → VERDE → REFACTOR
**Archivos tocados:** `tests/theme.test.tsx`, `src/app/globals.css`, `src/app/layout.tsx`, `public/grain.svg`, `src/app/page.tsx`

## Trazabilidad

- @s1 (html lang="es" + metadata.title 'Mantamar') → `@s1 home renderiza html lang="es" y metadata.title es Mantamar` (RTL + metadata). Ya satisfecho por v1; queda como guard de regresión.
- @s2 (globals.css importa tailwindcss + @theme con 12 tokens) → `@s2 globals.css importa tailwindcss y declara los 12 tokens en @theme` (source inspection + regex por token/hex exacto).
- @s3 (layout.tsx cablea Geist, Geist_Mono, Fraunces con variables) → `@s3 layout.tsx cablea Geist, Geist_Mono y Fraunces con variables CSS` (source inspection: imports + nombres de variable + `${...variable}` aplicado a html).
- @s4 (body canvas obscuro charcoal/sand) → `@s4 body y main usan canvas obscuro charcoal con texto sand` (RTL: `document.body.className` + `document.querySelector('main')`). Incluye cambio de `page.tsx` main a `bg-charcoal text-sand`.
- @s5 (grain.svg existe + CSS lo referencia con pointer-events none) → `@s5 existe public/grain.svg y globals.css lo referencia con pointer-events none` (readFileSync + feTurbulence + regex CSS).
- @s6 (::selection copper/charcoal) → `@s6 globals.css declara ::selection copper/charcoal` (source inspection).
- @s7 (@keyframes + gate reduced-motion) → `@s7 globals.css declara @keyframes base y gate de reduced-motion` (source inspection: `@keyframes`, `@media (prefers-reduced-motion: reduce)`, `animation: none`, `transition: none`).
- @s8 (metadata.description en español menciona lana/poncho/chilena) → `@s8 metadata.description en español menciona lana/poncho/chilena` (metadata + regex). Ya satisfecho por v1; description reescrita para incluir 'chilena' explícitamente.
- @s9 (grain NO dentro del bloque reduced-motion) → `@s9 la regla grain NO está dentro del bloque prefers-reduced-motion` (source inspection con helper `extractBlock` de llaves balanceadas; el bloque media NO contiene `grain.svg`).
- @s10 (grain overlay vía body::before, CSS puro, sin componente React) → `@s10 el overlay grain se aplica vía body::before (CSS puro, sin componente React)` (source inspection: `body::before` + `grain.svg` + `pointer-events: none` + layout.tsx sin `grain`/`Grain`).
- @s11 (stacks font-family con fallback serif/sans) → `@s11 stacks font-family declaran fallbacks serif (Georgia/Times) y sans (system-ui/sans-serif)` (source inspection: tokens `--font-sans`/`--font-mono`/`--font-serif` en `@theme` + `Georgia`/`Times New Roman` + `system-ui`/`sans-serif`).

## Ciclos

### ROJO
- Reescribí `tests/theme.test.tsx` con 11 tests (mezcla RTL + source inspection con `readFileSync` + regex). Helper `extractBlock` para verificar estructura de llaves del `@media`.
- `npx jest tests/theme.test.tsx` → 9 failed, 2 passed. Los 2 verdes son @s1 y @s8 (ya satisfechos por v1 — guards de regresión). Fallan @s2..@s7, @s9, @s10, @s11.
- Probe de DOM: en jsdom, React/RTL "adopta" el `<html>`/`<body>` renderizados al documento real (`document.documentElement` y `document.body`), mientras que `main` queda dentro del container. Ajusté @s4 para usar `document.body.className` en vez de `container.querySelector('body')` (que retornaba null).

### VERDE
- `src/app/globals.css`:
  - `@import "tailwindcss"` + `@theme {}` con los 12 tokens (6 originales EXACTOS + 6 nuevos EXACTOS) + `--font-sans: var(--font-geist-sans)`, `--font-mono: var(--font-geist-mono)`, `--font-serif: var(--font-serif)`.
  - `body { background: var(--color-charcoal); color: var(--color-sand); font-family: var(--font-sans), system-ui, Arial, sans-serif; }` (canvas obscuro + fallback sans).
  - `body::before` overlay grain (fixed, inset 0, pointer-events none, opacity 0.06, url('/grain.svg'), mix-blend-mode overlay) — CSS puro, sobrevive a JS deshabilitado.
  - `h1, h2, h3, .font-serif { font-family: var(--font-serif), Georgia, 'Times New Roman', serif; }` (fallback serif para @s11).
  - `::selection { background: var(--color-copper); color: var(--color-charcoal); }`.
  - `@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }` (keyframe base; servirá para F4 marquee — permitido por el contrato @s7).
  - `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }` — el grain NO está aquí (es textura estática).
- `src/app/layout.tsx`:
  - `import { Geist, Geist_Mono, Fraunces } from 'next/font/google'` con `subsets: ['latin']`, `display: 'swap'`, variables `--font-geist-sans`/`--font-geist-mono`/`--font-serif`.
  - `<html lang="es" className={htmlClass}>` donde `htmlClass = \`h-full antialiased ${geistSans.variable} ${geistMono.variable} ${fraunces.variable}\`` (extraído a constante para mantener línea ≤100 chars).
  - `<body className="min-h-full flex flex-col bg-charcoal text-sand">`.
  - `metadata` con `title: 'Mantamar'` y `description` en español mencionando 'casa de oficio chilena', 'ponchos', 'lana chilena'.
- `public/grain.svg`: SVG con `feTurbulence` (fractalNoise, baseFrequency 0.9, numOctaves 2, stitchTiles stitch) rellenando el viewport.
- `src/app/page.tsx`: `<main className="bg-charcoal text-sand">` (era `bg-cream text-ink` — parte del cambio de canvas obscuro de F1).
- `npx jest tests/theme.test.tsx` → 11/11 pass.

### REFACTOR
- Extraje `htmlClass` a una constante en `layout.tsx` para no superar 100 chars en el JSX del `<html>`.
- Verificación de build CSS: la línea `--font-serif: var(--font-serif)` del `@theme` es auto-referencial, pero en el CSS compilado la regla unlayered de next/font (`.fraunces...__variable { --font-serif: "Fraunces", "Fraunces Fallback" }`) gana sobre `@layer theme { :root { --font-serif: var(--font-serif) } }` por cascade layers. `--font-serif` resuelve a Fraunces correctamente; la utility `font-serif` funciona.
- Sin comentarios añadidos, comillas simples, imports ordenados (type → next → locales), líneas ≤100 chars.

## Verificaciones finales

- `npx jest tests/theme.test.tsx` → 11 passed, 11 total.
- `npx jest` (suite completa) → 7 suites, 41 passed, 41 total. Las features v1 (Header, Hero, BrandStory, ProductGrid, Footer, product-detail) NO se rompieron: sus tests no aserten `bg-cream` en main/body.
- `npx tsc --noEmit` → limpio (sin output).
- `npx eslint src/app/layout.tsx src/app/page.tsx tests/theme.test.tsx` → limpio (sin errors). `src/app/globals.css` no tiene config eslint (warning esperado). Los 91 errors del `npm run lint` global viven en `.stryker-tmp/`, `tools/mutate.js`, `jest.config.js`, `ProductDetailPage.tsx` — ninguno en archivos de F1.
- `npx next build` → ✓ Compiled successfully, 4/4 static pages generadas.

## Disciplina
- ✅ Cada línea de producción está justificada por un test rojo previo (los 3 font tokens en `@theme` están cubiertos por @s11 que verifica `--font-sans`/`--font-mono`/`--font-serif:` en globals.css; los 12 color tokens por @s2).
- ✅ Sin código de features futuras (la `@keyframes marquee` es parte de @s7 — keyframe base permitido por el contrato).
- ✅ No se tocaron Header/Hero/BrandStory/ProductGrid/Footer/ProductDetailPage/products.ts.
- ✅ Refactor solo en verde.
- ✅ Status `in_progress` conservado en `feature_list.json` — no marcado `done` (espera judge + mutation_tester).
