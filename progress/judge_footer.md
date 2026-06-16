# Review — feature 7 (footer)

**Veredicto:** APPROVED [auto-approved]

## Cobertura
- @s1..@s5: cubiertos (ver `progress/tdd_footer.md`).

## Disciplina TDD
- ¿Producción sin test? NO
- ¿R→V→R documentado? SÍ

## Calidad
- `Footer.tsx`: 3 secciones (marca, contacto, redes), array
  `SOCIAL_LINKS` para no duplicar. Año con `new Date().getFullYear()`.
  Email y teléfono como `mailto:` y `tel:` (mejor UX).
- `layout.tsx`: Footer dentro de `<div className="flex-1">` para empujar
  al final (con `flex-col` del body y `min-h-full`).
- Sin TODOs, sin console.log.

## Checkpoints
- C1..C4, C6: [x]
- C7: PASS 100%
