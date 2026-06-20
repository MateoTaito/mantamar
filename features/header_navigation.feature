Feature: Cabecera con navegación principal v2 — scroll-linked
  Como visitante quiero ver una cabecera sticky con la marca "Mantamar"
  en Fraunces y los enlaces Inicio/Catálogo/Nosotros/Contacto, que
  responda al scroll con un shrink sutil, para moverme por el sitio
  desde cualquier página sin perder la marca de vista.

  @s1
  Scenario: El header se monta desde layout.tsx y muestra la marca
    Given el archivo src/app/layout.tsx
    When inspecciono su JSX
    Then importa y renderiza el componente Header
    And src/app/page.tsx no importa Header directamente
    And que visito la ruta "/"
    When la página termina de renderizar
    Then existe un <header> con el texto "Mantamar"

  @s2
  Scenario: El header muestra los 4 enlaces de navegación con sus hrefs
    Given que visito la ruta "/"
    When localizo el <header>
    Then existen 4 enlaces de navegación con los hrefs:
      | texto    | href        |
      | Inicio   | #inicio     |
      | Catálogo | #catalogo   |
      | Nosotros | #nosotros   |
      | Contacto | #contacto   |

  @s3
  Scenario: La marca es un enlace a "/" y el header es sticky top-0
    Given que visito la ruta "/"
    When localizo el <header>
    Then existe un enlace con texto "Mantamar" y href "/"
    And el <header> tiene la clase "sticky" y la clase "top-0"

  @s4
  Scenario: El header es un cliente component con motion para scroll-linked
    # verificación por source inspection
    Given el archivo src/components/Header.tsx
    When inspecciono su contenido
    Then comienza con la directiva "use client"
    And importa "motion" desde "motion/react" o "framer-motion"
    And importa "useScroll" o "useMotionValueEvent" o "useTransform"
      desde "motion/react"

  @s5
  Scenario: El wordmark usa la fuente serif (Fraunces)
    # verificación por source inspection + RTL
    Given que visito la ruta "/"
    When localizo el enlace con texto "Mantamar"
    Then su className incluye "font-serif"
    And el archivo src/components/Header.tsx aplica la clase "font-serif"
      al wordmark

  @s6
  Scenario: Los enlaces de nav tienen underline animada en hover
    # verificación por source inspection (hover no se mide en jsdom)
    Given el archivo src/components/Header.tsx
    When inspecciono su contenido
    Then cada enlace de nav tiene un "::after" (CSS) o un <span> con
      motion que dibuja una underline
    And la underline es color "copper" (bg-copper o border-copper)
    And la underline escala en X de 0 a 1 al hacer hover (transición
      CSS o animación de motion)

  @s7
  Scenario: El header arranca con fondo charcoal/80 + backdrop-blur desde top
    # verificación por source inspection + RTL (decisión D1: legibilidad en
    páginas internas sin hero)
    Given que visito la ruta "/" o la ruta "/productos/poncho-andino"
    When localizo el <header>
    Then su className incluye "bg-charcoal" con opacidad (ej. "bg-charcoal/80"
      o "bg-charcoal/90")
    And su className incluye "backdrop-blur"

  @s8
  Scenario: prefers-reduced-motion — header en estado scrolled estático
    # verificación por source inspection
    Given el navegador tiene "prefers-reduced-motion: reduce" activado
    When inspecciono src/components/Header.tsx
    Then el componente lee la preferencia con "useReducedMotion" (o
      equivalente) y ramifica el JSX/CSS
    And cuando reduced-motion está activo, NO se subscribe a useScroll
      para el comportamiento scroll-linked
    And el header se renderiza directamente en su estado "scrolled"
      visual estático (padding reducido, letter-spacing cerrado)
    And la underline hover se desactiva o es instantánea

  @s9
  Scenario: JS deshabilitado — el header base es legible y navegable
    # verificación por source inspection
    Given el navegador tiene JavaScript deshabilitado
    When el header se renderiza server-side
    Then el estado base incluye marca "Mantamar" y los 4 enlaces con
      sus hrefs (las anclas funcionan sin JS)
    And el estado base NO depende de JS para ser usable
