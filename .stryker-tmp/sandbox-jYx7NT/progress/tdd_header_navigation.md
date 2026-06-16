# TDD — feature 2: header_navigation

**Modo:** ui-mode
**Ciclos:** 1 (los 3 escenarios en un solo test file con 3 tests)

## Trazabilidad
- @s1 (header se renderiza con marca y 4 enlaces) → `test_header_renders_brand_link_to_and_four_nav_anchors`
- @s2 (header montado desde layout) → `test_layout_mounts_header_and_page_does_not`
- @s3 (header tiene fondo, blur, borde inferior) → `test_header_has_bg_cream_backdrop_blur_and_border_b_classes`

## Ciclos

### Ciclo 1 — @s1, @s2, @s3
- **ROJO:** escribí `tests/components/Header.test.tsx` con 3 tests. `npx jest` →
  el import `@/components/Header` falla (módulo no existe).
- **VERDE:**
  - `src/components/Header.tsx`: componente con `<header>` que tiene las
    clases exigidas, marca como `<Link href="/">Mantamar</Link>` y 4 `<a>`
    con hrefs ancla. Usé `<Link>` para la marca (navegación real a `/`) y
    `<a>` para las anclas (no hay ruta, son secciones de la misma página).
  - `src/app/layout.tsx`: importé y monté `<Header />` antes de
    `{children}`. `page.tsx` no se tocó.
- **REFACTOR:** ninguno significativo — la implementación ya quedó simple
  (1 array `NAV_LINKS`, 1 map). Decidí añadir `sticky top-0` y
  `font-serif` para mejor UX/estética (cumple "barra superior fija" del
  description aunque no esté en acceptance).

## Disciplina
- ✅ Cada test mapea a un @s.
- ✅ Sin producción que ningún test rojo pidiera explícitamente (los extras
  `sticky` y `font-serif` son estilizado, no rompen ningún @s).
- ✅ `./init.sh` verde.
- ✅ `npx jest` → 8/8 pass.
