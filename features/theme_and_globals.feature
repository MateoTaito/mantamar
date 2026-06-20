Feature: Tema y estilos globales v2 — rediseño obscuro editorial
  Como visitante quiero que el sitio se renderice sobre un canvas obscuro
  cálido (charcoal) con textura de fibra, tipografía cableada (Geist +
  Fraunces) y selección de texto copper, para percibir una casa de oficio
  premium desde el primer vistazo — sin depender de JS ni de motion.

  @s1
  Scenario: La home renderiza en español con la marca en el title
    Given que visito la ruta "/"
    When la página termina de renderizar
    Then el elemento <html> tiene el atributo lang con valor "es"
    And el <title> del documento es "Mantamar"

  @s2
  Scenario: globals.css importa Tailwind v4 y declara los 12 tokens en @theme
    # verificación por source inspection
    Given el archivo src/app/globals.css
    When inspecciono su contenido
    Then contiene la línea "@import \"tailwindcss\""
    And contiene un bloque "@theme" con los 6 tokens originales
      | token                  | valor     |
      | --color-cream          | #F5EDE0   |
      | --color-cream-dark     | #E8D9C0   |
      | --color-coffee         | #C9A875   |
      | --color-coffee-dark    | #8B6F47   |
      | --color-ink            | #0F0F0F   |
      | --color-paper          | #FFFFFF   |
    And el mismo bloque declara los 6 tokens nuevos
      | token                  | valor     |
      | --color-charcoal       | #1A1714   |
      | --color-espresso       | #2A1E14   |
      | --color-stone          | #A89A85   |
      | --color-sand           | #D9C7A8   |
      | --color-copper         | #B07A4A   |
      | --color-rust           | #8C4A2E   |

  @s3
  Scenario: layout.tsx cablea Geist, Geist_Mono y Fraunces desde next/font/google
    # verificación por source inspection
    Given el archivo src/app/layout.tsx
    When inspecciono su contenido
    Then importa "Geist", "Geist_Mono" y "Fraunces" desde "next/font/google"
    And cada llamada a la fuente declara variable con "--font-geist-sans",
      "--font-geist-mono" y "--font-serif" respectivamente
    And las variables se aplican al <body> o al <html>

  @s4
  Scenario: El <body> usa canvas obscuro charcoal con texto sand
    Given que visito la ruta "/"
    When localizo el elemento <body>
    Then su className incluye "bg-charcoal"
    And su className incluye "text-sand"

  @s5
  Scenario: Existe public/grain.svg referenciado como overlay global vía CSS
    # verificación por source inspection
    Given el directorio public/
    When inspecciono su contenido
    Then existe el archivo "grain.svg"
    And el archivo src/app/globals.css referencia "grain.svg" (en body::before
      o en una regla de overlay global)
    And la regla que aplica el grain declara "pointer-events: none"

  @s6
  Scenario: globals.css declara ::selection copper/charcoal
    # verificación por source inspection
    Given el archivo src/app/globals.css
    When inspecciono su contenido
    Then contiene una regla "::selection"
    And esa regla declara "background: var(--color-copper)"
    And esa regla declara "color: var(--color-charcoal)"

  @s7
  Scenario: globals.css declara @keyframes base y gate de reduced-motion
    # verificación por source inspection
    Given el archivo src/app/globals.css
    When inspecciono su contenido
    Then contiene al menos una declaración "@keyframes"
    And contiene un bloque "@media (prefers-reduced-motion: reduce)"
    And ese bloque desactiva animaciones con "animation: none" o
      "transition: none" (o reglas equivalentes que las neutralicen)

  @s8
  Scenario: metadata.description está en español y menciona lana chilena
    # verificación por source inspection
    Given el archivo src/app/layout.tsx
    When inspecciono la metadata exportada
    Then title es "Mantamar"
    And description es un string en español que contiene "lana" o "poncho"
      o "chilena"

  @s9
  Scenario: prefers-reduced-motion activado — el grain sigue visible sin motion
    # verificación por source inspection (no medible en jsdom vía layout)
    Given el navegador tiene "prefers-reduced-motion: reduce" activado
    When inspecciono src/app/globals.css
    Then la regla "@media (prefers-reduced-motion: reduce)" desactiva
      animaciones y transiciones
    And la regla del overlay grain NO está dentro de ese @media (el grain
      es textura estática, sigue visible)
    And el sitio se ve completo sin animación

  @s10
  Scenario: JS deshabilitado — el grain overlay sobrevive vía CSS body::before
    # verificación por source inspection
    Given el navegador tiene JavaScript deshabilitado
    When inspecciono src/app/globals.css
    Then el overlay de grain se aplica vía "body::before" (CSS puro)
    And no depende de un componente React cliente para montarse
    And el <body> mantiene las clases "bg-charcoal text-sand"

  @s11
  Scenario: Font no carga — fallback declarado en la stack font-family
    # verificación por source inspection
    Given la red cae y next/font no puede cargar las fuentes
    When inspecciono el CSS generado por next/font y globals.css
    Then la stack de font-family para serif incluye un fallback del sistema
      (ej. "Georgia" o "Times New Roman")
    And la stack para sans incluye un fallback genérico (ej. "system-ui"
      o "sans-serif")
    And el sitio sigue legible
