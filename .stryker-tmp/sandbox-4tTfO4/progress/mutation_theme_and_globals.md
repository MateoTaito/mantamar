# Mutación — feature 1 (theme_and_globals)

**Veredicto:** PASS [auto-approved]
**Score:** 5/5 = 100% (umbral: 100%)
**Método:** automático (Stryker 8.7.1 con jest-runner)

## Configuración

`tools/mutate.js` actualizado a ESM (`.mjs`) y a Stryker 8.7.1:

- Bug original: Stryker 8 no acepta `--configFile` (es argumento posicional).
- Bug original: los plugins no se autodetectan desde pnpm; hay que
  listarlos explícitamente en `plugins`.
- Bug original: el `typescript-checker` falla al instrumentar (1 error sin
  mutantes). Decisión: desactivarlo. La verificación de tipos ya la hace
  el flujo estándar (`tsc --noEmit` vía `next build` / `next typegen`).
  Documentado como adaptación en `[adaptación] sin typescript-checker`.

## Mutantes ejecutados

### src/app/page.tsx
| # | Mutación esperada          | Resultado |
|---|----------------------------|-----------|
| 1 | string 'Mantamar' mutada   | KILLED (`test_layout_renders_html_lang_es_and_home_shows_h1_mantamar`) |

**Score:** 1/1 = 100%

### src/app/layout.tsx
| # | Mutación esperada          | Resultado |
|---|----------------------------|-----------|
| 1 | 'es' → 'en' (lang)         | KILLED (`test_layout_renders_html_lang_es_and_home_shows_h1_mantamar`) |
| 2 | 'Mantamar' → otro (title)  | KILLED (`test_metadata_title_is_mantamar`) |
| 3 | 'Mantamar' en metadata     | KILLED (`test_metadata_exports_mantamar_title_and_spanish_description_about_wool`) |
| 4 | description string mutada  | KILLED (`test_metadata_exports_mantamar_title_and_spanish_description_about_wool`) |

**Score:** 4/4 = 100%

## Total feature
- **Mutantes:** 5
- **Killed:** 5
- **Survived:** 0
- **No cov:** 0
- **Errors:** 0
- **Score:** 100% (umbral 100%)

## Mutantes sobrevivientes
- (ninguno)
