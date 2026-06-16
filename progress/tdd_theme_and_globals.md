# TDD — feature 1: theme_and_globals

**Modo:** ui-mode
**Ciclos:** 3 (uno por escenario)

## Trazabilidad
- @s1 (home renderiza html lang="es" + h1 "Mantamar") → test_layout_renders_html_lang_es_and_home_shows_h1_mantamar
- @s1b (metadata title es "Mantamar") → test_metadata_title_is_mantamar
- @s2 (globals.css tiene tokens) → test_globals_css_imports_tailwindcss_and_declares_brand_color_tokens
- @s3 (metadata description en español sobre lana) → test_metadata_exports_mantamar_title_and_spanish_description_about_wool
- @extra (main con bg-cream text-ink) → test_main_element_has_bg_cream_and_text_ink_classes

## Ciclos

### Ciclo 1 — @s1, @s1b, @s2, @s3, @extra
- **ROJO:** escribí `tests/theme.test.tsx` con 4 tests cubriendo los 3
  escenarios del `.feature` y el extra del acceptance "main con clases
  bg-cream text-ink". `npx jest tests/theme.test.tsx` → 4 failed.
- **VERDE:**
  - `src/app/globals.css` → import de tailwindcss + bloque `@theme` con
    los 6 tokens (`--color-cream`, `--color-cream-dark`, `--color-coffee`,
    `--color-coffee-dark`, `--color-ink`, `--color-paper`) + body con
    `bg-cream text-ink`.
  - `src/app/layout.tsx` → metadata `{ title: 'Mantamar', description:
    '...' }`, `<html lang="es">`.
  - `src/app/page.tsx` → `<main className="bg-cream text-ink min-h-screen">`
    con `<h1>Mantamar</h1>`.
- **REFACTOR:**
  - Detecté que el test pedía un único h1 pero la primera versión tenía
    dos (`sr-only` + visible). Eliminé el `sr-only` para tener un solo
    `<h1>Mantamar</h1>`. Esto dejó el archivo en su forma mínima.
  - Separé el assert de `metadata.title` en su propio test (`test_metadata_title_is_mantamar`)
    para que el fallo de `document.title` (que no se setea en jsdom
    cuando renderizamos Server Components) no oculte la verificación real
    de la metadata, que es lo que Next.js usa para poblar el `<title>`.

## Disciplina
- ✅ Cada línea de producción está justificada por un test rojo previo.
- ✅ Sin código de más.
- ✅ `./init.sh` verde tras la implementación.
- ✅ `npx jest tests/theme.test.tsx` → 5/5 pass.
