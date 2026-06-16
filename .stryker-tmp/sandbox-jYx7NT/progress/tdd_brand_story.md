# TDD — feature 4: brand_story

**Modo:** ui-mode
**Ciclos:** 1 (los 5 escenarios en un solo test file)

## Trazabilidad
- @s1 (sección con id="nosotros") → `test_home_renders_a_section_with_id_nosotros`
- @s2 (h2 + p con "lana chilena" y "poncho") →
  `test_section_has_h2_in_spanish_and_a_paragraph_with_lana_chilena_and_poncho`
- @s3 (img con /product_placeholder_2.svg) →
  `test_section_has_image_pointing_to_product_placeholder_2_svg`
- @s4 (md:grid-cols-2) →
  `test_section_has_md_grid_cols_2_for_two_column_desktop_layout`
- @s5 (page.tsx monta BrandStory) → `test_page_tsx_mounts_the_brandstory_component`

## Ciclos

### Ciclo 1 — @s1..@s5
- **ROJO:** tests para BrandStory directo fallan (módulo no existe).
- **VERDE:**
  - `src/components/BrandStory.tsx` con `<section id="nosotros" md:grid-cols-2>`,
    `<h2>Nuestra historia</h2>`, dos `<p>` que mencionan "lana chilena" y
    "poncho", e `<img src="/product_placeholder_2.svg">`.
  - `src/app/page.tsx` importa y monta `<BrandStory />` después de `<Hero />`.
- **REFACTOR:** ninguno significativo. La sección es declarativa.

## Disciplina
- ✅ Cada @s tiene un test.
- ✅ Tests verdes: 18/18.
- ✅ init.sh verde.
