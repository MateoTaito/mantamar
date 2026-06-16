# AGENTS_2.harness.md — Mapa de navegación para agentes de IA

> Punto de entrada para cualquier agente que trabaje en este repositorio.
> NO es una biblia de reglas: es un **mapa**. Lee solo lo que necesites
> cuando lo necesites (divulgación progresiva).
>
> **Rama `uncle-bob-harness`** — flujo estilo Robert C. Martin:
> conversación → Gherkin → TDD → review → mutación. Ver `docs/workflow.md`.
>
> **Importante:** Este es el mapa del harness SDD. El `AGENTS.md` raíz
> contiene las instrucciones específicas de Next.js 16 (léelo también).

---

## 1. Antes de empezar (obligatorio)

1. Ejecuta `./init.sh` y verifica que termina sin errores. Si falla, **para**
   y resuelve el entorno antes de tocar código.
2. Lee `node_modules/next/dist/docs/index.md` para conocer la versión de
   Next.js instalada.
3. Lee `progress/current.md` para entender en qué estado quedó la última sesión.
4. Lee `feature_list.json` (si existe). Toda feature nueva (`"sdd": true`)
   recorre el pipeline de cinco fases — ver `docs/workflow.md` y §4.
5. Lee `docs/workflow.md` antes de coordinar nada.

## 2. Mapa del repositorio

| Archivo / carpeta            | Qué contiene                                                                | Cuándo leerlo |
|------------------------------|-----------------------------------------------------------------------------|---------------|
| `AGENTS.md`                  | Instrucciones específicas de Next.js 16 (generado por `create-next-app`)    | Antes de cualquier código |
| `AGENTS.harness.md`          | Reglas del orquestador craftsman_lead (flujo SDD)                           | Al coordinar trabajo |
| `AGENTS_2.harness.md`        | Este mapa                                                                   | Al empezar |
| `feature_list.json`          | Lista de tareas con estado (`pending` / `spec_ready` / `in_progress` / `done` / `blocked`) | Al empezar |
| `progress/current.md`        | Estado de la sesión actual                                                  | Al empezar |
| `progress/history.md`        | Bitácora append-only de sesiones anteriores                                 | Si necesitas contexto histórico |
| `project-spec.md`            | Spec conversada: propósito, contrato y decisiones por feature               | Antes de destilar Gherkin o implementar |
| `features/<name>.feature`    | Escenarios Gherkin (el contrato ejecutable que el humano aprueba)           | Antes de empezar el ciclo TDD |
| `docs/workflow.md`           | El pipeline completo y los insights de cada fase                            | Antes de coordinar |
| `docs/tdd.md`                | Las Tres Leyes del TDD; el ciclo Rojo-Verde-Refactor                        | Antes de escribir código |
| `docs/gherkin.md`            | Cómo escribir `.feature`; de Gherkin a test                                 | Antes de redactar/leer escenarios |
| `docs/mutation-testing.md`   | Por qué y cómo; umbral; uso de `tools/mutate.js`                            | Antes de validar la suite |
| `docs/architecture.md`       | Qué significa "hacer un buen trabajo" en este proyecto                      | Antes de implementar |
| `docs/conventions.md`        | Reglas de estilo, nombres, estructura                                       | Antes de escribir código |
| `docs/verification.md`       | Cómo verificar que tu trabajo funciona                                      | Antes de declarar `done` |
| `CHECKPOINTS.harness.md`     | Criterios objetivos de "estado final correcto"                              | Para auto-evaluarte |
| `init.sh`                    | Verificación del entorno del harness                                        | Al empezar y al cerrar |
| `tools/mutate.js`            | Mutador sin dependencias para la prueba de mutación                         | Fase de mutación |
| `tools/stryker.conf.js`      | Config base de Stryker                                                      | Si personalizas mutación |
| `.agents/agents/`            | `craftsman_lead`, `spec_partner`, `gherkin_author`, `tdd_craftsman`, `judge`, `mutation_tester` | Si orquestas trabajo |
| `src/`                       | Código de la aplicación (Next.js 16 + App Router)                          | Para implementar |
| `tests/`                     | Tests automáticos (Jest con `next/jest`)                                    | Para verificar |
| `jest.config.js`             | Configuración de Jest adaptada a Next.js 16                                | Si ajustas tests |
| `jest.setup.js`              | Setup global de Jest (jest-dom matchers)                                    | Si ajustas tests |
| `jest.d.ts`                  | Tipos para matchers personalizados de jest-dom                              | Si añades matchers |
| `postcss.config.mjs`         | Config de PostCSS (Tailwind v4) — **no usar `.js`**                        | Si ajustas CSS |
| `src/app/globals.css`        | Config CSS de Tailwind v4 (`@import "tailwindcss"`)                         | Si ajustas estilos |

## 3. Reglas duras (no negociables)

- **Una sola feature a la vez.** No mezcles cambios de varias tareas en la misma sesión.
- **No declares una tarea `done` sin pruebas verdes Y umbral de mutación
  superado.** Ejecuta `./init.sh` y la prueba de mutación.
- **No saltes la conversación de spec ni la destilación Gherkin.** Toda
  feature con `"sdd": true` pasa por `spec_partner` y `gherkin_author`.
- **No saltes la puerta de aprobación humana** sobre los `.feature`. El
  `craftsman_lead` detiene el flujo en `spec_ready` y espera.
- **TDD estricto: un test a la vez.** Nada de producción sin un test rojo
  que la pida (`docs/tdd.md`).
- **Documenta lo que haces** en `progress/current.md` mientras trabajas.
- **Deja el repositorio limpio** antes de cerrar la sesión (ver §5).
- **Si no sabes algo, busca en `docs/`** antes de inventarlo.
- **Lee `node_modules/next/dist/docs/`** antes de escribir código en `src/`.

## 4. Flujo de trabajo (pipeline)

```
pending
  → [spec_partner]   conversación → project-spec.md
  → [gherkin_author] project-spec.md → features/<name>.feature   (status: spec_ready)
  → ⏸ HUMANO APRUEBA los escenarios
  → in_progress
  → [tdd_craftsman]  Rojo → Verde → Refactor (un test a la vez)
  → [judge]          review (el juego entero)
  → [mutation_tester] mata mutantes; valida que los tests muerden
  → done
```

1. El `craftsman_lead` detecta la primera feature `pending` con `"sdd": true`.
2. Lanza `spec_partner` (conversa y debate) → `project-spec.md`.
3. Lanza `gherkin_author` → `features/<name>.feature`, status `spec_ready`.
4. **Pausa.** El humano lee los escenarios y aprueba (o pide cambios).
5. Aprobado → status `in_progress` y lanza `tdd_craftsman`.
6. El `tdd_craftsman` recorre cada escenario `@s` con ciclos Rojo-Verde-Refactor.
7. El `judge` revisa cobertura, disciplina TDD y calidad; aprueba o rechaza.
8. El `mutation_tester` corre `tools/mutate.js`; exige el umbral.
9. Si todo pasa, el `tdd_craftsman` marca `done` y mueve el resumen a
   `progress/history.md`.

## 5. Cierre de sesión (lifecycle)

Antes de terminar:

1. Ejecuta `./init.sh` — todo verde.
2. Corre la prueba de mutación sobre lo tocado — supera el umbral.
3. Si la tarea está acabada: marca `status: "done"` en `feature_list.json`.
4. Mueve el resumen de `progress/current.md` al final de `progress/history.md`.
5. Vacía `progress/current.md` dejando solo la plantilla.
6. No dejes archivos temporales, ni `console.log()` de debug, ni TODOs sin contexto.

## 6. Si te bloqueas

- Relee la sección relevante de `docs/`.
- Para código Next.js 16, busca en `node_modules/next/dist/docs/`.
- Si la herramienta no hace lo que esperas, **no inventes un workaround**:
  documenta el bloqueo en `progress/current.md` y para la sesión.
