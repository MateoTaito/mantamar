# Review — feature 1 (theme_and_globals)

**Veredicto:** APPROVED

## Cobertura de escenarios (@s ↔ test)

- @s1 (html lang="es" + title 'Mantamar'): [x] `tests/theme.test.tsx:34` — `@s1 home renderiza html lang="es" y metadata.title es Mantamar` (RTL + `metadata.title`).
- @s2 (globals.css importa tailwindcss + @theme con 12 tokens): [x] `tests/theme.test.tsx:44` — regex por `@import "tailwindcss"`, `@theme` y los 12 pares token/hex exactos.
- @s3 (layout.tsx cablea Geist, Geist_Mono, Fraunces con variables): [x] `tests/theme.test.tsx:70` — verifica imports, nombres de variable y `${...variable}` aplicado a `<html>`.
- @s4 (body canvas obscuro charcoal/sand): [x] `tests/theme.test.tsx:84` — `document.body.className` y `main.className` con `bg-charcoal`/`text-sand`.
- @s5 (grain.svg existe + CSS lo referencia con pointer-events none): [x] `tests/theme.test.tsx:99` — `readFileSync` de `public/grain.svg` (`feTurbulence`) + regex CSS.
- @s6 (::selection copper/charcoal): [x] `tests/theme.test.tsx:108` — `::selection` + `background: var(--color-copper)` + `color: var(--color-charcoal)`.
- @s7 (@keyframes + gate reduced-motion): [x] `tests/theme.test.tsx:115` — `@keyframes`, `@media (prefers-reduced-motion: reduce)`, `animation: none`, `transition: none`.
- @s8 (metadata.description en español menciona lana/poncho/chilena): [x] `tests/theme.test.tsx:123` — `desc.toLowerCase()` matchea `lana|poncho|chilena`.
- @s9 (grain NO dentro del bloque reduced-motion): [x] `tests/theme.test.tsx:130` — helper `extractBlock` (llaves balanceadas) afirma que el bloque `@media` NO contiene `grain.svg`.
- @s10 (grain overlay vía body::before, CSS puro, sin componente React): [x] `tests/theme.test.tsx:141` — `body::before` + `grain.svg` + `pointer-events: none` + `layout.tsx` sin `[Gg]rain`.
- @s11 (stacks font-family con fallback serif/sans): [x] `tests/theme.test.tsx:150` — `--font-sans:`/`--font-mono:`/`--font-serif:` + `Georgia|Times New Roman` + `system-ui|sans-serif`.

## Disciplina TDD

- ¿Producción sin test que la pida? **NO**. Trazabilidad verificada línea a línea:
  - `src/app/globals.css:1` (`@import "tailwindcss"`) → @s2.
  - `src/app/globals.css:3-19` (`@theme` + 12 tokens + 3 font tokens) → @s2 (colores) y @s11 (font tokens).
  - `src/app/globals.css:21-25` (`body` charcoal/sand + font-family) → @s4 y @s11.
  - `src/app/globals.css:27-37` (`body::before` grain) → @s5 y @s10.
  - `src/app/globals.css:39-41` (`h1,h2,h3,.font-serif` stack serif) → @s11.
  - `src/app/globals.css:43-46` (`::selection`) → @s6.
  - `src/app/globals.css:48-51` (`@keyframes marquee`) → @s7 (ver nota en Calidad).
  - `src/app/globals.css:53-58` (`@media reduced-motion`) → @s7 y @s9.
  - `src/app/layout.tsx:1-23` (imports next/font + 3 configs) → @s3.
  - `src/app/layout.tsx:25` (`htmlClass` constante) → refactor justificado (mantiene línea ≤100).
  - `src/app/layout.tsx:27-31` (`metadata`) → @s1 y @s8.
  - `src/app/layout.tsx:39` (`<html lang="es">`) → @s1.
  - `src/app/layout.tsx:40` (`<body ... bg-charcoal text-sand>`) → @s4.
  - `public/grain.svg:1` (SVG con `feTurbulence`) → @s5.
  - `src/app/page.tsx:7` (`<main className="bg-charcoal text-sand">`) → @s4.
- ¿Evidencia de Rojo→Verde→Refactor? **SÍ**. Bitácora `progress/tdd_theme_and_globals.md:25` documenta ROJO real (9 failed / 2 passed, donde @s1 y @s8 eran guards de regresión ya verdes de v1), VERDE (`progress/tdd_theme_and_globals.md:44` → 11/11 pass) y REFACTOR en verde (extracción de `htmlClass`, `progress/tdd_theme_and_globals.md:47`).
- **Observación (no bloqueante):** la bitácora declara "1 ciclo agrupado (11 escenarios)" en `progress/tdd_theme_and_globals.md:4`, lo que se desvía del "single test followed by code" de `docs/tdd.md:5`. Es una desviación honesta y pragmática para una feature ui-mode donde 9/11 escenarios son source-inspection de los mismos 3 archivos estáticos; el ciclo Rojo→Verde es observable y real. Se nota para que el `craftsman_lead` lo tenga en cuenta en features con lógica de dominio.

## Calidad

- `src/app/globals.css`: 58 líneas, sin números mágicos (los hex son el contrato de tokens de `feature_list.json:9`), sin duplicación, una regla por bloque. ✓
- `src/app/layout.tsx`: 47 líneas. `RootLayout` es corta y de un solo motivo. `htmlClass` extraído a constante (`layout.tsx:25`) evita la línea larga y cumple el límite de 100 chars de `docs/conventions.md:9`. Imports ordenados (type → next → locales), comillas simples, sin comentarios. ✓
- `src/app/page.tsx`: 13 líneas, mínimo, sin lógica. ✓
- `public/grain.svg`: SVG válido mínimo con `feTurbulence`. ✓
- `tests/theme.test.tsx`: helper `extractBlock` (`theme.test.tsx:14-31`) es corto, con nombre revelador y un solo motivo. Tests descriptivos con tag `@s` en el nombre. ✓
  - **Observación (no bloqueante):** renderizar `<RootLayout>` (que emite `<html><body>`) vía RTL produce un `console.error` de jsdom "`<html>` cannot be a child of `<div>`" en `tests/theme.test.tsx:35`. Es una limitación conocida de jsdom/RTL al renderizar el layout completo; los tests pasan y es solo ruido de consola. En una futura pasada podría aislar la verificación de `<html>`/`<body>` sin envolver en el container de RTL, pero no afecta la validez de la cobertura.
- **Observación (no bloqueante):** `src/app/globals.css:48` nombra el keyframe `marquee` con `translateX(-50%)`, contenido que anticipa F4 (`materials_marquee`). @s7 solo exige que exista un `@keyframes` (cualquiera), así que la declaración está justificada por el test; el nombre específico es un hint forward-looking. No es producción que ningún test exige en el sentido estricto (el `@keyframes` sí lo exige @s7), pero conviene recordarlo para que F4 no lo dé por hecho sin su propio test rojo.
- **Arquitectura:** F1 NO usa `motion` ni `'use client'` (verificado por grep en `src/app/` — solo aparece `motion` dentro del selector `@media (prefers-reduced-motion: reduce)` de `globals.css:53`). Respeta `docs/architecture.md` (capa `src/app/`, sin nuevas dependencias — `next/font/google` es built-in). No `console.log()`. ✓
- **Scope de feature:** `git diff` confirma que NO se tocaron `src/components/*`, `src/lib/products.ts` ni `src/app/productos/[slug]/page.tsx`. Solo `src/app/{globals.css,layout.tsx,page.tsx}`, `tests/theme.test.tsx` y `public/grain.svg`. ✓ `page.tsx:7` pasó de `bg-cream text-ink` a `bg-charcoal text-sand` como exige @s4. ✓

## Verificaciones ejecutadas

- `./init.sh` → exit 0 (entorno listo, 8 features, 1 in_progress / 7 spec_ready).
- `npx jest tests/theme.test.tsx` → 11 passed, 11 total (exit 0).
- `npx jest` (suite completa) → 7 suites, 41 passed, 41 total (exit 0). Las features v1 siguen verdes.
- `npx tsc --noEmit` → limpio, sin output (exit 0).
- `npx next build` → ✓ Compiled successfully, 4/4 rutas (/, /_not-found, /productos/[slug]) (exit 0).

## Checkpoints

- C1 (arnés completo): [x] — `init.sh` verde; base y docs presentes.
- C2 (estado coherente): [x] — una sola feature `in_progress` (`theme_and_globals`); features `done` previas con tests verdes (41 passed); `progress/current.md` describe solo la sesión activa de F1.
- C3 (arquitectura): [x] — `src/` solo `app/components/lib`; sin dependencias nuevas; sin `console.log()`; sin `motion` en F1.
- C4 (verificación real): [x] — `tests/` con test por componente/función; RTL + source inspection (sin mocks innecesarios); 41 tests verdes.
- C5 (sesión cerrada): [x] — F1 no deja archivos sospechosos propios (`public/grain.svg` es entrega justificada por @s5).
  - **Nota repo-higiene (fuera de scope de F1):** existen untracked `public/logo.webp`, `public/logo_wide.webp` y `features/materials_marquee.feature` que no son entregables de F1 (probablemente de `spec_partner`/sesiones previas). El `craftsman_lead` debería decidir su trackeo, pero no bloquean F1.
- C6 (contrato Gherkin): [x] — `features/theme_and_globals.feature` con `@s1..@s11`, cada `Then` medible; mapa `@s → test` en `progress/tdd_theme_and_globals.md:9-19`; sin producción que ningún test rojo pidiera.
- C7 (mutación): [ ] — puerta del `mutation_tester`, no del `judge`. Se ejecuta tras esta aprobación.

## Cambios requeridos

Ninguno. Observaciones no bloqueantes registradas arriba para seguimiento:
1. Ciclo TDD agrupado (no one-test-at-a-time estricto) — honesto y pragmático para ui-mode source-inspection.
2. `@keyframes marquee` anticipa F4 — la declaración cumple @s7; recordar a F4 que necesita su propio test rojo.
3. `console.error` de jsdom al renderizar `<RootLayout>` en RTL — ruido cosmético, tests pasan.
4. Untracked `public/logo.webp`, `public/logo_wide.webp`, `features/materials_marquee.feature` — fuera de scope de F1, pendiente de decisión por `craftsman_lead`.
