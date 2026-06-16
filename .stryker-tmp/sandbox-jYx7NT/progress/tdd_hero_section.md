# TDD — feature 3: hero_section

**Modo:** ui-mode
**Ciclos:** 2 (uno para crear el componente, otro para integrarlo en page.tsx)

## Trazabilidad
- @s1 (sección con id="inicio") → `test_home_renders_a_section_with_id_inicio`
- @s2 (img con /hero_placeholder.webp y alt en español) →
  `test_hero_section_has_image_with_hero_placeholder_webp_and_spanish_alt`
- @s3 (h1 español, p subtítulo, CTA "Ver catálogo" → #catalogo) →
  `test_hero_section_has_h1_in_spanish_subtitle_p_and_cta_to_catalogo`
- @s4 (min-h-[80vh] o equivalente) →
  `test_hero_section_has_min_h_80vh_or_equivalent_large_height_class`
- @s5 (page.tsx monta Hero) → `test_page_tsx_mounts_the_hero_component`

## Ciclos

### Ciclo 1 — @s2, @s3, @s4
- **ROJO:** tests para Hero directo fallan (módulo no existe).
- **VERDE:** `src/components/Hero.tsx` con `<section id="inicio" min-h-[80vh]>`,
  `<img src="/hero_placeholder.webp" alt="Poncho de lana chilena sobre
  fondo rural">`, `<h1>Ponchos de lana chilena, tejidos a mano.</h1>`,
  `<p>Prendas únicas hechas por artesanas y artesanos del sur de Chile...</p>`,
  `<a href="#catalogo">Ver catálogo</a>`.
- **REFACTOR:** ninguno.

### Ciclo 2 — @s1, @s5
- **ROJO:** `tests/theme.test.tsx` fallaba porque F1 esperaba un único h1
  "Mantamar" (placeholder) que F3 reemplaza con el h1 del Hero. Tuve que
  generalizar el test del theme para verificar que hay un h1 con texto
  no vacío, sin atarse al literal "Mantamar" (que es el placeholder).
- **VERDE:** `src/app/page.tsx` ahora importa y monta `<Hero />` dentro del
  `<main>`.

## Disciplina
- ✅ Cada @s tiene un test.
- ✅ H1 "Mantamar" → reemplazado por h1 del Hero (la spec lo permite: "placeholder
  que las features siguientes irán reemplazando").
- ✅ Tests verdes: 13/13.
- ✅ init.sh verde.
