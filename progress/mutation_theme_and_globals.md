# Mutación — feature 1 (theme_and_globals)

**Veredicto:** ADAPTADO
**Score:** 5/6 KILLED = 83% (umbral: 100% sobre líneas nuevas/tocadas)
**Método:** manual (Stryker no aporta valor sobre el código tocado — ver justificación)

## Justificación del método y del veredicto ADAPTADO

F1 es una feature **ui/tema**: de los 5 archivos tocados (`progress/tdd_theme_and_globals.md:5`),
3 son no-JS o source-inspection puros:

- `src/app/globals.css` — **CSS**. Stryker muta JS/TS, no CSS. La mayor parte del
  contrato de F1 (tokens `@theme`, `body::before` grain, `::selection`, `@keyframes`,
  `@media reduced-motion`, fallbacks font-family) vive aquí y se verifica por
  **source inspection** (regex sobre el texto del archivo, no por lógica ramificada).
  Mutar CSS no aplica; equivaldría a regex-testing manual sobre strings, no a
  mutation testing de lógica.
- `public/grain.svg` — **asset estático** (XML). No sujeto a mutación.
- `tests/theme.test.tsx` — es el **test suite**, no código de producción.

Quedan 2 archivos JS/TS con lógica cableable: `src/app/layout.tsx` (47 líneas —
imports de next/font, `htmlClass`, `metadata`, JSX `<html>/<body>`) y
`src/app/page.tsx` (13 líneas — JSX `<main>` con className). Stryker automático
sobre estos 2 archivos tocaría mayormente **string literals** y **JSX attrs**, que
es justo lo que cubre la mutación manual abajo. Por honestidad y control
determinista (regex de source-inspection son sensibles a literales exactos),
se ejecutó mutación **manual** con `npx jest tests/theme.test.tsx` por cada
mutante, restaurando el archivo entre runs.

El veredicto es **ADAPTADO** (no PASS) porque el score sobre los TS tocados es
83% < 100% umbral: 1 mutante sobrevivió. La excepción se documenta abajo
(M4-L4): es una **permissividad del spec** (OR en @s8), no una debilidad del
test — el test implementa fielmente el contrato Gherkin
(`features/theme_and_globals.feature` @s8: `contiene "lana" o "poncho" o
"chilena"`). Endurecer el test a AND violaría el spec. No se excluye como
"equivalente" (cambia comportamiento observable: el texto renderizado); se
reporta como sobreviviente honesto con justificación de origen spec-level.

## Mutantes ejecutados

| #  | Archivo             | Línea | Mutación aplicada                                                                  | Resultado  |
|----|---------------------|-------|------------------------------------------------------------------------------------|------------|
| M1-L1 | src/app/layout.tsx  | 25    | Eliminar `${geistSans.variable}` de `htmlClass`                                    | KILLED     |
| M2-L2 | src/app/layout.tsx  | 28    | `title: 'Mantamar'` → `title: 'Mntmr'`                                             | KILLED     |
| M3-L3 | src/app/layout.tsx  | 40    | `<body className="min-h-full flex flex-col bg-charcoal text-sand">` → sin `bg-charcoal text-sand` | KILLED     |
| M4-L4 | src/app/layout.tsx  | 30    | `description`: 'chilena'→'argentina' (3 ocurrencias)                               | SURVIVED   |
| M1-P1 | src/app/page.tsx    | 7     | `<main className="bg-charcoal text-sand">` → `<main className="bg-cream text-ink">` | KILLED     |
| M2-P2 | src/app/page.tsx    | 7     | `<main>` → `<div>` (mismo className)                                               | KILLED     |

### Detalle de los KILLED

- **M1-L1** → `@s3` falla en `tests/theme.test.tsx:79`
  (`expect(l).toMatch(/\$\{geistSans\.variable\}/)`). El regex de source-inspection
  sobre `layout.tsx` exige la interpolación exacta de la variable Geist Sans.
- **M2-L2** → `@s1` y `@s8` fallan en `tests/theme.test.tsx:41` y `:124`
  (`expect(metadata.title).toBe('Mantamar')`). Doble guard sobre el title exacto.
- **M3-L3** → `@s4` falla en `tests/theme.test.tsx:91`
  (`expect(bodyClass).toMatch(/bg-charcoal/)`). El RTL check sobre
  `document.body.className` atrapa el canvas obscuro.
- **M1-P1** → `@s4` falla en `tests/theme.test.tsx:95`
  (`expect(main?.className ?? '').toMatch(/bg-charcoal/)`). El check sobre
  `document.querySelector('main').className` atrapa el canvas del main.
- **M2-P2** → `@s4` falla en `tests/theme.test.tsx:94`
  (`expect(main).not.toBeNull()`). Cambiar `<main>` por `<div>` hace que
  `querySelector('main')` retorne null — el guard estructural atrapa el tag.

## Mutantes sobrevivientes

- **src/app/layout.tsx:30** — `description`: reemplazar 'chilena' por 'argentina'
  (las 3 ocurrencias: "casa de oficio chilena", "lana chilena", "sur de Chile"→"sur de Argentina").
  - **Resultado:** SURVIVED. `@s8` usa
    `expect(desc.toLowerCase()).toMatch(/lana\|poncho\|chilena/)` (OR). Tras la
    mutación, la descripción aún contiene 'lana' ("prendas de lana argentina")
    y 'poncho' ("ponchos y prendas"), por lo que el regex OR matchea y @s8 pasa.
    Las otras 10 specs no tocan `description`.
  - **Origen del hueco:** NO es debilidad del test. El spec Gherkin @s8
    (`features/theme_and_globals.feature`) dice literalmente: `description es un
    string en español que contiene "lana" o "poncho" o "chilena"` — contrato OR
    explícito. El test implementa fielmente ese OR. Endurecer el test a AND
    (exigir los 3 términos) **violaría el spec**. El hueco es **spec-level**:
    el spec acepta cualquiera de los 3 términos como evidencia suficiente de
    "casa de oficio chilena de lana/ponchos".
  - **Acción recomendada (no bloqueante, fuera de mutation_tester):** si se
    quiere cerrar este hueco, el `spec_partner` debe endurecer @s8 a AND
    (`contiene "lana" Y "poncho" Y "chilena"`) y el `tdd_craftsman` debe cambiar
    el regex a `/^(?=.*lana)(?=.*poncho)(?=.*chilena)/`. Es una decisión de
    producto, no de test. No se aplica en esta pasada.

## Excepciones documentadas

1. **`src/app/globals.css` (CSS) no sujeto a mutación JS.** Stryker muta
   JS/TS; el CSS de F1 (58 líneas: `@import`, `@theme` con 12 tokens + 3 font
   tokens, `body`, `body::before` grain, `h1/h2/h3` stack, `::selection`,
   `@keyframes marquee`, `@media reduced-motion`) se valida por source
   inspection regex en `tests/theme.test.tsx` (@s2, @s5, @s6, @s7, @s9, @s10,
   @s11). Mutar strings CSS manualmente sería regex-testing de literales, no
   mutation testing de lógica ramificada — fuera del alcance de la herramienta
   y del método. El `judge` ya aprobó esta cobertura por source inspection
   (`progress/judge_theme_and_globals.md:5-17`).
2. **`public/grain.svg` (XML asset) no sujeto a mutación.** Verificado por
   `readFileSync` + regex `feTurbulence` en @s5.
3. **M4-L4 (sobreviviente) es permissividad spec-level, no test weakness.**
   Justificado arriba. No se excluye como "equivalente" (cambia comportamiento
   observable); se reporta como sobreviviente honesto con causa raíz en el
   contrato OR de @s8.

## Verificación de disciplina

- ✅ Cada mutación se restauró antes de la siguiente (verificado con
  `npx jest tests/theme.test.tsx` → 11/11 pass al final y `git diff --stat`
  sin diffs residuales más allá de los cambios propios de F1).
- ✅ No se editó `src/` ni `tests/` para forzar PASS — solo se aplicaron
  mutaciones temporales y se restauraron.
- ✅ Método documentado (manual, con justificación de por qué no Stryker auto).
- ✅ Score reportado honestamente (83% sobre TS, < 100% umbral).
- ✅ Sobreviviente documentado con causa raíz y acción recomendada al
  `spec_partner`/`tdd_craftsman`.

## Salida final

```
ADAPTADO -> progress/mutation_theme_and_globals.md (score 83% sobre TS; 1 sobreviviente spec-level; CSS fuera de scope JS-mutation)
```
