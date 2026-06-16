# Mutación — feature 5 (product_grid)

**Veredicto:** PASS [auto-approved]
**Score:** 14/14 = 100% (umbral: 100%)

## Mutantes ejecutados

### src/components/ProductGrid.tsx
| # | Mutación | Resultado |
|---|----------|-----------|
| 1-4 | strings (`/productos/`, formato de href, alt) | KILLED |

**Score:** 4/4 = 100%

### src/lib/products.ts
| # | Mutación | Resultado |
|---|----------|-----------|
| 1-5 | strings y constantes de productos | KILLED |
| 6-10 | lógica de getProductBySlug y formatPrice | KILLED (gracias a `test_getProductBySlug_...` y `test_formatPrice_...` añadidos en el ciclo 2 de TDD) |

**Score:** 10/10 = 100%

## Total feature
- **Mutantes:** 14 (4 + 10)
- **Killed:** 14
- **Survived:** 0
- **Score:** 100% (umbral 100%)
