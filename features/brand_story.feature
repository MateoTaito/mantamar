Feature: Sección de historia v2 — editorial asimétrico + sello
  Como visitante quiero leer la historia de Mantamar en un layout
  editorial asimétrico con imagen /poncho-mujer.webp, un sello "Hecho
  a mano" que rota ligado al scroll, y texto que mencione explícitamente
  "lana chilena" y "poncho" — para entender el oficio artesanal sin
  que el motion deje contenido invisible si JS no está disponible.

  @s1
  Scenario: La sección "Nosotros" está en la home con id "nosotros"
    Given que visito la ruta "/"
    When la página termina de renderizar
    Then existe una <section> con id "nosotros"

  @s2
  Scenario: La sección tiene un <h2> con título en español
    Given que visito la ruta "/"
    When localizo la sección con id "nosotros"
    Then existe un <h2> con un título en español (ej. "Nuestra historia")

  @s3
  Scenario: El texto menciona explícitamente "lana chilena" y "poncho"
    Given que visito la ruta "/"
    When localizo la sección con id "nosotros"
    Then existe un <p> cuyo texto contiene la frase "lana chilena"
    And existe un <p> cuyo texto contiene la palabra "poncho"

  @s4
  Scenario: El layout es dos columnas en escritorio y una en móvil
    # verificación por source inspection + RTL
    Given el archivo src/components/BrandStory.tsx
    When inspecciono su JSX
    Then el contenedor usa "grid-cols-1" (móvil) y "md:grid-cols-2"
      (escritorio)
    And la asimetría editorial se logra con "md:grid-cols-[5fr_6fr]"
      o columnas con padding/offset distinto (no 50/50 simétrico)
    And que visito la ruta "/"
    When localizo la sección con id "nosotros"
    Then su className incluye "md:grid-cols-2"

  @s5
  Scenario: La imagen apunta a /poncho-mujer.webp vía next/image con alt
    # verificación por source inspection + RTL
    Given el archivo src/components/BrandStory.tsx
    When inspecciono su contenido
    Then importa "next/image" (no usa <img> simple)
    And el src del image es "/poncho-mujer.webp" (no placeholder SVG)
    And que visito la ruta "/"
    When localizo la sección con id "nosotros"
    Then existe un elemento con role "img" y alt en español no vacío

  @s6
  Scenario: El componente es cliente con motion para reveal y parallax
    # verificación por source inspection
    Given el archivo src/components/BrandStory.tsx
    When inspecciono su contenido
    Then comienza con la directiva "use client"
    And importa "motion" desde "motion/react" o "framer-motion"
    And importa "useScroll" y "useTransform" desde "motion/react"
    And el reveal de imagen usa clip-path animado (inset(100% 0 0 0) →
      inset(0 0 0 0)) con viewport={{ once: true }}

  @s7
  Scenario: Existe public/seal.svg y se referencia en la sección
    Given el directorio public/
    When inspecciono su contenido
    Then existe el archivo "seal.svg"
    And que visito la ruta "/"
    When localizo la sección con id "nosotros"
    Then existe un elemento (img o inline SVG) que referencia "/seal.svg"
    And ese elemento tiene alt en español (ej. "Sello Hecho a mano")

  @s8
  Scenario: El sello rota ligado al scroll
    # verificación por source inspection (rotación por scroll no medible en jsdom)
    Given el archivo src/components/BrandStory.tsx
    When inspecciono su contenido
    Then el sello está posicionado absoluto (clase "absolute" o
      "position: absolute")
    And su rotación está ligada a "scrollYProgress" vía "useTransform"
      (ej. rotate: 0 → 30deg a lo largo del scroll de la sección)

  @s9
  Scenario: prefers-reduced-motion — imagen, texto y sello estáticos
    # verificación por source inspection + RTL
    Given el navegador tiene "prefers-reduced-motion: reduce" activado
    When renderizo el componente BrandStory
    Then el componente lee la preferencia con "useReducedMotion" (o
      equivalente) y ramifica el JSX
    And la imagen es visible desde t=0 (sin reveal clip-path)
    And el texto es legible (sin stagger)
    And el sello está estático en su ángulo base (sin rotación ligada
      a scroll)
    And el contenido visible (imagen, h2, p, sello) está presente
      independientemente del motion

  @s10
  Scenario: JS deshabilitado — imagen, h2 y p se renderizan visibles en SSR
    # verificación por source inspection
    Given el navegador tiene JavaScript deshabilitado
    When el componente se renderiza server-side
    Then el HTML que llega trae la imagen, el h2 y los <p> visibles
      (estado final)
    And el sello SVG aparece estático
    And el estado inicial con "initial=\"hidden\"" NO oculta el
      contenido server-side — el estado animado es excepcional, el
      estático es el baseline accesible
