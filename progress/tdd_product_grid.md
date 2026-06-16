# TDD — feature 5: product_grid

**Modo:** ui-mode
**Ciclos:** 2 (uno crea los componentes, otro añade tests para los helpers
de `products.ts` que la mutación marcó como no cubiertos).

## Trazabilidad
- @s1 (sección con id="catalogo") → `test_home_renders_a_section_with_id_catalogo`
- @s2 (array products con 6+ entradas válidas) → `test_the_products_array_has_at_least_6_valid_entries`
- @s3 (6+ cards enlazando a /productos/<slug>) → `test_the_grid_renders_at_least_6_cards_each_linking_to_productos_slug`
- @s4 (img + h3 + precio con $) → `test_each_card_has_image_h3_with_name_and_price_with_dollar_symbol`
- @s5 (grid responsive) → `test_grid_container_is_responsive_grid_cols_1_sm_grid_cols_2_md_grid_cols_3`
- (extra) `src/lib/products.ts` existe → `test_src_lib_products_ts_exists_and_exports_the_products_array`
- (extra) `getProductBySlug` y `formatPrice` cubiertos → `test_getProductBySlug_...`,
  `test_formatPrice_...` (añadidos en el ciclo 2 para subir la mutación al 100%)

## Ciclos

### Ciclo 1 — @s1..@s5
- **ROJO:** tests fallan (módulos no existen).
- **VERDE:**
  - `src/lib/products.ts` con 6 productos ficticios y los helpers
    `getProductBySlug` y `formatPrice` (usados por F6).
  - `src/components/ProductGrid.tsx` con `ProductCard` (link + img + h3 +
    precio) y `ProductGrid` (section + grid 1/2/3 columnas + map).
  - `src/app/page.tsx` añade `<ProductGrid />` después de BrandStory.
- **REFACTOR:** la primera versión de la grid tenía un wrapper `<div>`
  adicional que el test del responsive no acertaba a encontrar. Lo
  corregí usando `div.grid` en el selector del test (refactor del test,
  no del código).

### Ciclo 2 — C7 (mutación)
- **ROJO (mutación):** Stryker sobre `src/lib/products.ts` mostró 5
  mutantes "no cov" (los helpers `getProductBySlug` y `formatPrice` no
  tenían tests directos; F5 los importa pero no los ejercita
  explícitamente).
- **VERDE:** añadí `test_getProductBySlug_...` y `test_formatPrice_...`
  al mismo archivo `ProductGrid.test.tsx`. Stryker pasa a 10/10 = 100%.

## Disciplina
- ✅ Cada @s tiene un test.
- ✅ Tests verdes: 26/26.
- ✅ Mutación 100% (ProductGrid 4/4, products 10/10).
- ✅ init.sh verde.
