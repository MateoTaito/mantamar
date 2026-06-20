Feature: Pie v2 — wordmark reveal + pills magnéticas
  Como visitante quiero ver un footer obscuro con la marca "Mantamar",
  datos de contacto, 3 redes sociales, copyright con año dinámico y un
  wordmark gigante "MANTAMAR" que se revela al entrar en viewport —
  sin que el motion oculte contenido si JS no está disponible.

  @s1
  Scenario: El footer se monta desde layout.tsx y aparece en la home
    Given el archivo src/app/layout.tsx
    When inspecciono su JSX
    Then importa y renderiza el componente Footer
    And src/app/page.tsx no importa Footer directamente
    And que visito la ruta "/"
    When la página termina de renderizar
    Then existe un <footer> con el texto "Mantamar"

  @s2
  Scenario: El footer tiene fondo obscuro, texto claro y padding generoso
    Given que visito la ruta "/"
    When localizo el <footer>
    Then su className incluye "bg-ink" (o "bg-espresso")
    And su className incluye "text-paper" (o "text-sand")
    And su className incluye "py-12" y "px-6" (padding mínimo)

  @s3
  Scenario: El footer muestra bloque de contacto con email y teléfono
    Given que visito la ruta "/"
    When localizo el <footer>
    Then su texto contiene el email "contacto@mantamar.cl"
    And su texto contiene el teléfono "+56 9 1234 5678"

  @s4
  Scenario: El footer muestra 3 enlaces a redes con href "#"
    Given que visito la ruta "/"
    When localizo el <footer>
    Then existen 3 enlaces a redes con href "#":
      | red       |
      | Instagram |
      | Facebook  |
      | WhatsApp  |

  @s5
  Scenario: El copyright contiene el año actual calculado dinámicamente
    # verificación por source inspection + RTL
    Given el archivo src/components/Footer.tsx
    When inspecciono su contenido
    Then declara "const year = new Date().getFullYear()" (o equivalente
      que calcula el año en runtime)
    And el texto de copyright incluye "{year}" interpolado
    And que visito la ruta "/"
    When localizo el <footer>
    Then su texto contiene el año actual (ej. "2026")
    And su texto contiene "Mantamar" y "Todos los derechos reservados"

  @s6
  Scenario: El componente es cliente con motion para reveal y hover magnético
    # verificación por source inspection
    Given el archivo src/components/Footer.tsx
    When inspecciono su contenido
    Then comienza con la directiva "use client"
    And importa "motion" desde "motion/react" o "framer-motion"

  @s7
  Scenario: Wordmark gigante "MANTAMAR" con reveal clip-path al entrar en viewport
    # verificación por source inspection
    Given el archivo src/components/Footer.tsx
    When inspecciono su JSX
    Then existe un <motion.h2> (o <motion.div>) con texto "MANTAMAR"
    And usa la fuente serif (Fraunces) con clase "font-serif" y
      "uppercase"
    And su tamaño es display vía "clamp()" (ej. clamp(4rem, 12vw, 12rem))
    And el reveal usa clip-path (de "inset(0 100% 0 0)" a
      "inset(0 0 0 0)") con viewport={{ once: true }}

  @s8
  Scenario: Pills sociales con hover magnético (tilt + desplazamiento)
    # verificación por source inspection
    Given el archivo src/components/Footer.tsx
    When inspecciono su JSX
    Then cada enlace social es un <motion.a> (o <a> con motion wrapper)
    And tiene hover magnético con handler "onMouseMove" que aplica
      tilt/translateY sutil (misma disciplina que ProductGrid)

  @s9
  Scenario: prefers-reduced-motion — wordmark estático, pills con hover CSS
    # verificación por source inspection + RTL
    Given el navegador tiene "prefers-reduced-motion: reduce" activado
    When renderizo el componente Footer
    Then el componente lee la preferencia con "useReducedMotion" (o
      equivalente) y ramifica el JSX
    And el wordmark gigante "MANTAMAR" es visible desde t=0 (sin reveal
      clip-path)
    And las pills sociales tienen hover CSS básico ("border-copper
      text-copper" o similar) en lugar del magnético JS
    And el contenido visible (marca, contacto, redes, copyright) está
      presente independientemente del motion

  @s10
  Scenario: JS deshabilitado — footer visible completo en SSR
    # verificación por source inspection
    Given el navegador tiene JavaScript deshabilitado
    When el componente se renderiza server-side
    Then el HTML que llega trae el wordmark, el contacto, las redes y
      el copyright visibles (estado final)
    And el año se calcula en runtime (al ser 'use client', se hidrata
      con la fecha del cliente; el test tolera esto)

  @s11
  Scenario: El wordmark gigante no rompe el layout — overflow controlado
    # verificación por source inspection
    Given el archivo src/components/Footer.tsx
    When inspecciono su JSX
    Then el contenedor del wordmark (o el footer) tiene "overflow-hidden"
      para recortar limpio el wordmark gigante en viewports pequeños
    And el tamaño del wordmark se controla con "clamp()" (no desborda)
