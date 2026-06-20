Feature: Marquee de materiales — ticker infinito
  Como visitante quiero ver un ticker horizontal con dos filas en
  direcciones opuestas mostrando los materiales nobles y atributos del
  oficio (LANA DE OVEJA · TEÑIDO NATURAL · LANA MERINO · LANA GRUESA ·
  HECHO A MANO · SUR DE CHILE), entre el hero y la historia, para
  reforzar la narrativa de materiales reales sin añadir productos.

  @s1
  Scenario: MaterialsMarquee se monta en la home entre Hero y BrandStory
    # verificación por source inspection + RTL
    Given el archivo src/app/page.tsx
    When inspecciono su JSX
    Then importa y renderiza <MaterialsMarquee>
    And <MaterialsMarquee> aparece entre <Hero> y <BrandStory> en el
      orden del JSX
    And que visito la ruta "/"
    When la página termina de renderizar
    Then el componente MaterialsMarquee está presente en el DOM

  @s2
  Scenario: El marquee renderiza dos filas de texto en movimiento
    Given que visito la ruta "/"
    When localizo el componente MaterialsMarquee
    Then existen 2 elementos contenedores de fila (marquee rows)
    And cada fila contiene la lista de términos de materiales

  @s3
  Scenario: Cada fila repite la lista de materiales al menos una vez
    # verificación por source inspection + RTL
    Given el archivo src/components/MaterialsMarquee.tsx
    When inspecciono su JSX
    Then cada fila repite la lista de términos al menos 2x (para que
      el loop no muestre hueco)
    And que visito la ruta "/"
    When localizo el componente MaterialsMarquee
    Then el texto visible contiene los 6 términos: "LANA DE OVEJA",
      "TEÑIDO NATURAL", "LANA MERINO", "LANA GRUESA", "HECHO A MANO",
      "SUR DE CHILE"

  @s4
  Scenario: El texto menciona "lana" y "hecho a mano"
    Given que visito la ruta "/"
    When localizo el componente MaterialsMarquee
    Then su texto contiene la palabra "lana" (case-insensitive)
    And su texto contiene la palabra "mano" (case-insensitive, parte
      de "HECHO A MANO")

  @s5
  Scenario: Las dos filas se mueven en direcciones opuestas
    # verificación por source inspection (dirección no se mide en jsdom)
    Given el archivo src/components/MaterialsMarquee.tsx y
      src/app/globals.css
    When inspecciono su contenido
    Then existen 2 animaciones (CSS @keyframes o motion) con
      direcciones opuestas (ej. fila 1 x: 0 → -50%, fila 2 x: -50% → 0)
    And las clases de las filas referencian animaciones distintas o
      parámetros distintos que producen direcciones opuestas

  @s6
  Scenario: El componente es un cliente component con motion o CSS animation
    # verificación por source inspection
    Given el archivo src/components/MaterialsMarquee.tsx
    When inspecciono su contenido
    Then comienza con la directiva "use client"
    And importa "motion" desde "motion/react" o "framer-motion"
      (O el movimiento se implementa con CSS @keyframes en globals.css)

  @s7
  Scenario: El marquee frena al hover (pause on hover)
    # verificación por source inspection (hover no se mide en jsdom)
    Given el archivo src/components/MaterialsMarquee.tsx y
      src/app/globals.css
    When inspecciono su contenido
    Then existe una regla ":hover" sobre la fila que settea
      "animation-play-state: paused" (CSS)
      (O un handler onMouseEnter/onMouseLeave en motion que pausa el loop)

  @s8
  Scenario: prefers-reduced-motion — filas estáticas, texto legible
    # verificación por source inspection + RTL
    Given el navegador tiene "prefers-reduced-motion: reduce" activado
    When renderizo el componente MaterialsMarquee
    Then el componente lee la preferencia con "useReducedMotion" (o
      equivalente) y ramifica el JSX/CSS
    And las dos filas se renderizan estáticas (sin movimiento)
    And el texto de los materiales es legible y está presente en el DOM

  @s9
  Scenario: El marquee usa fondo espresso y texto sand con separadores copper
    # verificación por source inspection + RTL
    Given el archivo src/components/MaterialsMarquee.tsx
    When inspecciono su contenido
    Then la sección usa la clase "bg-espresso" (sección oscura apilada
      para profundidad)
    And el texto usa la clase "text-sand"
    And los separadores "·" entre términos usan color "copper"
      (clase "text-copper" o equivalente)
    And la tipografía de los términos es Geist Mono uppercase (clase
      "font-mono" y "uppercase" y "tracking-widest")

  @s10
  Scenario: JS deshabilitado — el marquee sigue funcionando vía CSS @keyframes
    # verificación por source inspection
    Given el navegador tiene JavaScript deshabilitado
    When inspecciono src/app/globals.css y src/components/MaterialsMarquee.tsx
    Then el movimiento del marquee se implementa con CSS "@keyframes"
      (no depende de motion/JS para animarse)
    And las dos filas se ven (estáticas o animadas según CSS) sin JS
