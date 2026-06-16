# TDD — feature 6: product_detail_page

**Modo:** ui-mode
**Ciclos:** 3 (crear componente, separar la lógica en un componente
testeable, mutación para subir al 100%)

## Trazabilidad
- @s1 (slug válido → ficha):
  - componente → `test_renders_product_detail_for_a_valid_product`
  - ruta → `test_resolves_a_known_slug_to_a_product`
- @s2 (slug inválido → "Producto no encontrado" + volver):
  - componente → `test_renders_product_no_encontrado_for_undefined_product`
  - ruta → `test_resolves_an_unknown_slug_to_the_not_found_state`
- @s3 (WhatsApp con slug):
  - componente → `test_renders_product_detail_for_a_valid_product`
  (verifica `href.startsWith('https://wa.me/')` y contiene el slug)

## Ciclos

### Ciclo 1 — Crear la página con todo inline
- **ROJO:** escribí `tests/app/product-detail.test.tsx` con 2 tests
  instanciando el page handler de Next con `params: Promise<{slug}>`. La
  página no existía.
- **VERDE:** creé `src/app/productos/[slug]/page.tsx` con la lógica
  inline (NotFound + view + async Page). Para Next 16, `params` es una
  `Promise`, así que `await params`. La ficha válida tiene imagen, h1,
  descripción, precio formateado y CTA WhatsApp con el slug
  URL-encoded.

### Ciclo 2 — Refactor para mutación y testabilidad
- **ROJO (mutación):** Stryker no podía mutar la ruta
  `src/app/productos/[slug]/page.tsx` porque los corchetes se
  interpretaban como character class de glob. Además, todo el JSX
  pesado en un Server Component hace al test de mutación ruidoso.
- **VERDE:** extraje la vista a `src/components/ProductDetailPage.tsx`
  (Server Component puro, sin `params`) y dejé el route handler como un
  wrapper mínimo de 5 líneas que resuelve `getProductBySlug(slug)` y
  pasa el producto al componente. Refactoricé el test para usar
  directamente el componente (testeable) y mantuve dos tests extra sobre
  el route handler (instanciándolo como Server Component).
- Esto también permite que Stryker mute el archivo del componente (sin
  corchetes) y la ruta (con un glob `src/app/productos/*/page.tsx`).

### Ciclo 3 — Mutación al 100%
- **Resultado:** 9/9 mutantes killed (8 en `ProductDetailPage.tsx`, 1 en
  el route handler).

## Disciplina
- ✅ Cada @s tiene al menos un test (componente + ruta).
- ✅ Tests verdes: 30/30.
- ✅ Mutación 100%.
- ✅ init.sh verde.
