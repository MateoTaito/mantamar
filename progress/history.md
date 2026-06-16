# Historial de sesiones

> Append-only. Cada sesión cerrada añade una entrada al final.

---

## Sesión 0 — Importación del harness SDD

**Fecha:** 2026-06-15
**Operación:** Import del harness `nextjs-sdd-harness-import` al proyecto `paginas_familia`.

**Acciones realizadas:**

1. Inicialización de Next.js 16 (App Router + TypeScript + Tailwind v4 + ESLint + src/)
2. Importación de 5 subagentes SDD en `.agents/agents/`
3. Importación de 7 documentos de flujo en `docs/`
4. Configuración de Jest con `next/jest` (adaptado a Next.js 16)
5. Creación de `jest.setup.js` y `jest.d.ts`
6. Omisión de `tailwind.config.js` y `postcss.config.js` (Tailwind v4 usa CSS)
7. Importación de `init.sh` adaptado (single-app, no monorepo)
8. Importación de `tools/mutate.js` y `tools/stryker.conf.js`
9. Creación de plantillas `progress/current.md` y `progress/history.md`
10. Adaptación de `package.json` con scripts y devDependencies

**Notas:**

- `feature_list.json` y `project-spec.md` no creados (se generarán al
  iniciar la primera feature con `spec_partner`).
- Ejemplos del harness omitidos (eran de una app de tareas de demo, no
  del proyecto real).
- `jest.config.harness.js` preservado como referencia histórica
  (incompatible con Next.js 16).
- Versiones de deps alineadas con Next.js 16 / React 19.

---

## Sesión 1 — Implementación de Mantamar (7 features sdd) — modo auto-approve

**Fecha:** 2026-06-15
**Operación:** ejecutar el pipeline SDD completo sobre las 7 features de
`feature_list.json`, en modo **auto-approve** (sin pausa para aprobación
humana de escenarios ni de veredictos; el `craftsman_lead` documenta cada
auto-aprobación con `[auto-approved]` en las bitácoras).

### Features cerradas (7/7 `done`)

| # | Feature               | Status | Tests | Mutación |
|---|-----------------------|--------|-------|----------|
| 1 | theme_and_globals     | done   | 5/5   | 100% (5/5)  |
| 2 | header_navigation     | done   | 3/3   | 100% (15/15) |
| 3 | hero_section          | done   | 5/5   | 100% (1/1) |
| 4 | brand_story           | done   | 5/5   | 100% (1/1) |
| 5 | product_grid          | done   | 8/8   | 100% (14/14) |
| 6 | product_detail_page   | done   | 4/4   | 100% (9/9) |
| 7 | footer                | done   | 5/5   | 100% (12/12) |

**Total global: 35/35 tests verde · 57/57 mutantes killed · 0 mutantes sobrevivientes.**

### Artefactos producidos

- `project-spec.md` con las 7 features (modo fast, decisiones registradas).
- 7 archivos `features/<name>.feature` (Gherkin) con escenarios `@s1..@sn`.
- `src/app/{layout,page}.tsx` + `src/app/globals.css` (F1).
- 6 componentes en `src/components/`: `Header`, `Hero`, `BrandStory`,
  `ProductGrid` (con `ProductCard`), `ProductDetailPage`, `Footer`.
- `src/lib/products.ts` con array estático + helpers (`getProductBySlug`,
  `formatPrice`).
- `src/app/productos/[slug]/page.tsx` (route handler).
- 7 archivos de test en `tests/` y `tests/components/`, `tests/app/`.
- 14 bitácoras en `progress/`: `tdd_<name>.md`, `judge_<name>.md`,
  `mutation_<name>.md` (2 por feature).

### Adaptaciones del harness en esta sesión

- `tools/mutate.js` migrado de `module.exports` (CJS) a `export default`
  (ESM) por incompatibilidad con Stryker 8.7.1.
- Habilitada lista explícita de plugins (`@stryker-mutator/jest-runner`):
  el auto-descubrimiento de plugins no funciona con el layout de pnpm
  de este proyecto.
- Desactivado `typescript-checker` en Stryker: rompe la instrumentación
  de TSX (1 error sin mutantes). La verificación de tipos queda cubierta
  por `npx tsc --noEmit` y `npx next build`.
- Detección de globs en `tools/mutate.js` para aceptar rutas con
  corchetes (rutas dinámicas tipo `src/app/productos/[slug]/page.tsx`).
- Refactor de F6: la lógica de la ficha se extrajo a
  `src/components/ProductDetailPage.tsx` para que Stryker pudiera mutarla
  (la ruta con corchetes no es mutable directamente). El route handler
  pasó a ser un wrapper mínimo de 5 líneas.

### Verificación final

- `./init.sh` → exit 0
- `npx tsc --noEmit` → 0 errores
- `npx eslint src/ tests/` → 0 errores (4 warnings intencionales de
  `<img>` por D1 de `project-spec.md`)
- `npx next build` → 4 páginas generadas, TypeScript compila
- `npx jest` → 35/35 verde
- Mutación agregada sobre 10 archivos productivos: 57/57 = 100%

