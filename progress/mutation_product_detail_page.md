# Mutación — feature 6 (product_detail_page)

**Veredicto:** PASS [auto-approved]
**Score:** 9/9 = 100% (umbral: 100%)

## Mutantes ejecutados

### src/components/ProductDetailPage.tsx
| # | Mutación | Resultado |
|---|----------|-----------|
| 1-8 | strings (textos, alt, href whatsapp, encodeURIComponent, formatPrice) | KILLED |

**Score:** 8/8 = 100%

### src/app/productos/\[slug\]/page.tsx (route handler)
| # | Mutación | Resultado |
|---|----------|-----------|
| 1 | paso de `product` a `<ProductDetailPage>` | KILLED por `test_resolves_a_known_slug_to_a_product` |

**Score:** 1/1 = 100%

## Total feature
- **Mutantes:** 9
- **Killed:** 9
- **Survived:** 0
- **Score:** 100% (umbral 100%)

## Nota
- El route handler con corchetes en la ruta no es directamente mutable
  por Stryker (los `[slug]` se confunden con character class del glob).
  Solución: `tools/mutate.js` actualizado para detectar globs y aceptar
  `src/app/productos/*/page.tsx` como patrón, además de usar la ruta
  absoluta cuando el target es un archivo único con corchetes.
