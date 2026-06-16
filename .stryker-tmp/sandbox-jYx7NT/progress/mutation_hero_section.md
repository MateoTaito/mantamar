# Mutación — feature 3 (hero_section)

**Veredicto:** PASS [auto-approved]
**Score:** 1/1 = 100% (umbral: 100%)
**Método:** automático (Stryker 8.7.1 con jest-runner)

## Mutantes ejecutados

### src/components/Hero.tsx
| # | Mutación | Resultado |
|---|----------|-----------|
| 1 | string 'inicio' en id mutada | KILLED |

**Score:** 1/1 = 100%

## Total feature
- **Mutantes:** 1
- **Killed:** 1
- **Survived:** 0
- **Score:** 100% (umbral 100%)

## Nota
- Stryker con sus mutadores por defecto generó pocos mutantes sobre el
  JSX de Hero (el `'inicio'` literal es el más obvio). El resto de la
  lógica (clases, h1, p, a) es declarativa en JSX. La cobertura del test
  sigue siendo alta (5 tests verifican la sección desde varios ángulos).
