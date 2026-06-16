# TDD — feature 7: footer

**Modo:** ui-mode
**Ciclos:** 1

## Trazabilidad
- @s1 (footer con marca "Mantamar") → `test_footer_renders_with_the_mantamar_brand`
- @s2 (3 redes sociales con href="#") → `test_footer_has_links_to_instagram_facebook_and_whatsapp_with_href_hash`
- @s3 (clases bg-ink, text-paper, py-12, px-6) →
  `test_footer_has_bg_ink_text_paper_py_12_px_6_classes`
- @s4 (año dinámico) → `test_copyright_contains_the_current_year_computed_at_render_time`
- @s5 (footer en layout, no en page) → `test_footer_is_mounted_from_the_layout_not_from_each_page`

## Ciclos

### Ciclo 1 — @s1..@s5
- **ROJO:** tests para Footer fallan (módulo no existe).
- **VERDE:**
  - `src/components/Footer.tsx`: 3 columnas (marca, contacto, redes),
    array `SOCIAL_LINKS` para evitar duplicación, año calculado con
    `new Date().getFullYear()` en cada render.
  - `src/app/layout.tsx`: importa y monta `<Footer />` después del
    contenido, dentro de un wrapper `<div className="flex-1">` para que
    el footer quede al final de la página.
- **REFACTOR:** ninguno significativo. La estructura es declarativa.

## Disciplina
- ✅ Cada @s tiene un test.
- ✅ Tests verdes: 35/35.
- ✅ Mutación 100% (12/12 en Footer.tsx).
- ✅ init.sh verde.
