Feature: Sección hero v2 — cinematic reveal + parallax
  Como visitante quiero ver un hero a página completa con imagen
  /poncho-hero.webp, titular en español sobre lana chilena, subtítulo y
  CTA "Ver catálogo", que se revele cinematográficamente al cargar y
  responda al scroll con parallax — sin dejar contenido invisible si
  JS o motion no están disponibles.

  @s1
  Scenario: La sección hero está en la home con id "inicio"
    Given que visito la ruta "/"
    When la página termina de renderizar
    Then existe una <section> con id "inicio"

  @s2
  Scenario: La sección ocupa al menos el 80% del alto de la ventana
    Given que visito la ruta "/"
    When localizo la sección con id "inicio"
    Then su className incluye "min-h-[80vh]" (o una clase equivalente
      que asegure al menos 80vh de altura mínima)

  @s3
  Scenario: La imagen hero apunta a /poncho-hero.webp con alt en español
    Given que visito la ruta "/"
    When localizo la sección con id "inicio"
    Then existe un elemento con role "img" (next/image o <img>)
    And su alt es un string no vacío en español
    And el archivo src/components/Hero.tsx referencia el src
      "/poncho-hero.webp"

  @s4
  Scenario: El hero contiene h1, subtítulo y CTA "Ver catálogo"
    Given que visito la ruta "/"
    When localizo la sección con id "inicio"
    Then existe un <h1> con un titular en español sobre lana chilena o
      ponchos (mantiene "Ponchos de lana chilena, tejidos a mano.")
    And existe un <p> con un subtítulo en español
    And existe un <a> con texto "Ver catálogo" y href "#catalogo"

  @s5
  Scenario: El componente es cliente con motion para reveal, stagger y parallax
    # verificación por source inspection
    Given el archivo src/components/Hero.tsx
    When inspecciono su contenido
    Then comienza con la directiva "use client"
    And importa "motion" desde "motion/react" o "framer-motion"
    And importa "useScroll" y "useTransform" desde "motion/react"

  @s6
  Scenario: El h1 se animiza palabra-por-palabra con stagger
    # verificación por source inspection
    Given el archivo src/components/Hero.tsx
    When inspecciono su JSX
    Then cada palabra del <h1> está envuelta en un <span> con clase
      "inline-block"
    And esos <span> están animados con motion (variant padre con
      staggerChildren o transición con delay incremental)

  @s7
  Scenario: prefers-reduced-motion — todo estático desde t=0, contenido visible
    # verificación por source inspection + RTL
    Given el navegador tiene "prefers-reduced-motion: reduce" activado
    When renderizo el componente Hero
    Then el componente lee la preferencia con "useReducedMotion" (o
      equivalente) y ramifica el JSX
    And la imagen es visible desde t=0 (sin clip-path reveal)
    And el <h1> es legible completo (sin stagger)
    And no se aplica Ken Burns ni parallax
    And el contenido visible (imagen, h1, p, CTA) está presente
      independientemente del motion

  @s8
  Scenario: JS deshabilitado — el estado SSR no oculta el contenido
    # verificación por source inspection
    Given el navegador tiene JavaScript deshabilitado
    When el componente se renderiza server-side
    Then el HTML que llega trae la imagen, el h1, el <p> y el CTA ya
      visibles (sin clases que los oculten por defecto)
    And el estado inicial de los motion.div para reveal NO declara
      "opacity: 0" en el SSR — el "initial" solo aplica cuando JS está
      hidratado, o el estado estático es el baseline accesible

  @s9
  Scenario: Scroll = 0 — el hero se ve "terminado" desde la carga
    Given que visito la ruta "/" sin hacer scroll
    When la página termina de renderizar
    Then la imagen está revelada
    And el h1 está completo
    And no hay parallax aplicado (todo en posición natural)
