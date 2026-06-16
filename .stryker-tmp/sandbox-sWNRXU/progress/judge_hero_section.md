# Review — feature 3 (hero_section)

**Veredicto:** APPROVED [auto-approved]

## Cobertura de escenarios (@s ↔ test)
- @s1 (sección con id="inicio"):
  - [x] `test_home_renders_a_section_with_id_inicio`
- @s2 (img con /hero_placeholder.webp y alt en español):
  - [x] `test_hero_section_has_image_with_hero_placeholder_webp_and_spanish_alt`
- @s3 (h1 español, subtítulo, CTA "Ver catálogo"):
  - [x] `test_hero_section_has_h1_in_spanish_subtitle_p_and_cta_to_catalogo`
- @s4 (≥ 80vh):
  - [x] `test_hero_section_has_min_h_80vh_or_equivalent_large_height_class`
- @s5 (page.tsx monta Hero):
  - [x] `test_page_tsx_mounts_the_hero_component`

## Disciplina TDD
- ¿Producción sin test que la pida? NO
- ¿Evidencia de Rojo→Verde→Refactor? SÍ (ver progress/tdd_hero_section.md)

## Calidad
- `Hero.tsx`: imagen absoluta con overlay para legibilidad, h1 grande con
  titular en español, CTA con buen contraste.
- `page.tsx`: ahora solo monta `<Hero />` dentro del `<main>`.
- Se actualizó `tests/theme.test.tsx` para que el h1 placeholder de F1
  deje de ser literal (la spec de F1 dice "placeholder que las features
  siguientes irán reemplazando"). Sigue validando que hay un h1 con texto.

## Checkpoints
- C1: [x], C2: [x], C3: [x], C4: [x] (13/13 pass), C6: [x]

## Cambios requeridos
- (ninguno)
