# Sesión actual

> Estado de la sesión activa. Se vacía al cerrar y se archiva en `history.md`.

## Feature en curso

`theme_and_globals` (F1) — Tema y estilos globales v2

## Estado

- Feature: #1 — theme_and_globals
- Fase: implementación TDD (ui-mode)
- Escenarios: @s1..@s11

## Notas

- Contrato aprobado en `features/theme_and_globals.feature`.
- Modo UI: RTL + source inspection + `tsc --noEmit` + `next build`.
- Sin `motion` en F1 (la feature declara "sin depender de JS ni de motion").
