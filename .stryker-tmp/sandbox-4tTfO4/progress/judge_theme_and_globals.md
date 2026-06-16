# Review — feature 1 (theme_and_globals)

**Veredicto:** APPROVED [auto-approved]

## Cobertura de escenarios (@s ↔ test)
- @s1 (home renderiza html lang="es" + h1 Mantamar):
  - [x] cubierto por `test_layout_renders_html_lang_es_and_home_shows_h1_mantamar`
- @s2 (globals.css con tokens):
  - [x] cubierto por `test_globals_css_imports_tailwindcss_and_declares_brand_color_tokens`
- @s3 (metadata en español):
  - [x] cubierto por `test_metadata_exports_mantamar_title_and_spanish_description_about_wool`
- (extra del acceptance) main con bg-cream text-ink:
  - [x] cubierto por `test_main_element_has_bg_cream_and_text_ink_classes`

## Disciplina TDD
- ¿Producción sin test que la pida? NO
- ¿Evidencia de Rojo→Verde→Refactor? SÍ (ver progress/tdd_theme_and_globals.md)

## Calidad
- globals.css: tokens declarados en bloque `@theme {}` (sin `tailwind.config.js`,
  coherente con Tailwind v4). Body con `bg-cream text-ink` aplicado vía CSS.
- layout.tsx: metadata coherente (title + description en español). `lang="es"`
  en el `<html>`. Componente limpio y corto.
- page.tsx: main con las clases exigidas y un único h1 "Mantamar".

## Checkpoints
- C1: [x] entorno listo (init.sh verde)
- C2: [x] una feature in_progress (esta)
- C3: [x] arquitectura respetada (src/app/ y src/lib/ — sin capas nuevas)
- C4: [x] tests en tests/Theme (1 archivo, 5 tests, todos verdes)
- C5: pendiente (cierre de sesión)
- C6: [x] .feature + project-spec.md + cobertura @s↔test
- C7: pendiente (mutation tester)

## Cambios requeridos
- (ninguno)
