Feature: Catálogo v2 — layout bento + hover magnético
  Como visitante quiero ver el catálogo de ponchos en una cuadrícula
  bento responsive (1/2/3 columnas) con un producto destacado grande,
  imágenes en duotono cálido, etiquetas de material por producto y
  hover magnético, donde cada tarjeta sea un enlace a
  /productos/<slug> con imagen, nombre y precio CLP — sin que el
  motion deje tarjetas invisibles si JS no está disponible.

  @s1
  Scenario: La cuadrícula está en la home con id "catalogo"
    Given que visito la ruta "/"
    When la página termina de renderizar
    Then existe una <section> con id "catalogo"

  @s2
  Scenario: products.ts exporta al menos 6 productos con slugs/nombres/precios conservados
    # verificación por source inspection
    Given el archivo src/lib/products.ts
    When importo el módulo
    Then el array "products" tiene length >= 6
    And cada elemento tiene slug (string no vacío), name (string en
      español), price (número entero) y description (string en español)
    And la interfaz "Product" declara un campo opcional "material"
      (readonly material?: string)
    And los slugs conservados son: "poncho-andino", "poncho-mapuche",
      "chal-lana", "bufanda-larga", "gorro-piloto", "mitones-lana"

  @s3
  Scenario: La cuadrícula renderiza al menos 6 tarjetas como enlaces
    Given que visito la ruta "/"
    When localizo la sección con id "catalogo"
    Then cuenta al menos 6 enlaces con href que sigue el patrón
      "/productos/<slug>"

  @s4
  Scenario: Cada tarjeta tiene imagen, h3 con nombre y precio con "$"
    Given que visito la ruta "/"
    When localizo la primera tarjeta de producto
    Then existe un elemento con role "img" y alt con el nombre del
      producto en español
    And el archivo src/components/ProductGrid.tsx usa "poncho-mujer.webp"
      o "poncho-hombre.webp" como src (rotación por slug, no placeholder SVG)
    And existe un <h3> con el nombre del producto
    And existe un precio que contiene el símbolo "$" (formateado en CLP
      vía formatPrice)

  @s5
  Scenario: Cada tarjeta muestra una etiqueta de material visible
    Given que visito la ruta "/"
    When localizo una tarjeta de producto
    Then existe un <span> con el material del producto (o un fallback
      "Lana chilena" si el producto no tiene material definido)

  @s6
  Scenario: La cuadrícula es responsive 1/2/3 columnas
    # verificación por source inspection + RTL
    Given el archivo src/components/ProductGrid.tsx
    When inspecciono su JSX
    Then el contenedor de la grid incluye las clases "grid-cols-1",
      "sm:grid-cols-2" y "md:grid-cols-3"
    And que visito la ruta "/"
    When localizo la sección con id "catalogo"
    Then su contenedor incluye las clases "grid-cols-1",
      "sm:grid-cols-2" y "md:grid-cols-3"

  @s7
  Scenario: El layout bento hace que una tarjeta ocupe más espacio
    # verificación por source inspection + RTL
    Given el archivo src/components/ProductGrid.tsx
    When inspecciono su JSX
    Then al menos una tarjeta tiene "col-span-2" o "row-span-2" (bento
      destacado)
    And la primera tarjeta (poncho-andino) es la destacada con
      "md:col-span-2" (decisión D6)

  @s8
  Scenario: El componente es cliente con motion para reveal y hover magnético
    # verificación por source inspection
    Given el archivo src/components/ProductGrid.tsx
    When inspecciono su contenido
    Then comienza con la directiva "use client"
    And importa "motion" desde "motion/react" o "framer-motion"
    And el reveal staggered usa un variant padre con "staggerChildren"
    And el hover magnético usa un handler "onMouseMove" que calcula
      rotateX/rotateY basado en la posición del cursor (tilt sigue cursor,
      no scale)

  @s9
  Scenario: El duotono cálido se aplica por defecto y cede en hover
    # verificación por source inspection
    Given el archivo src/app/globals.css y src/components/ProductGrid.tsx
    When inspecciono su contenido
    Then existe una clase "duotone" en globals.css con un filtro CSS
      (sepia/saturate/contrast que mapea a la paleta coffee/charcoal)
    And la imagen de la tarjeta tiene la clase "duotone" por defecto
    And en hover del padre, el duotono cede (clase "group-hover:duotone-off"
      o transición que relaja el filtro)

  @s10
  Scenario: Tag de material desliza y hairline se dibuja bajo nombre en hover
    # verificación por source inspection
    Given el archivo src/components/ProductGrid.tsx
    When inspecciono su JSX
    Then el tag de material es un <span> (o motion.span) oculto por
      defecto (y: 8px, opacity: 0) que anima a (y: 0, opacity: 1) en
      hover del padre
    And existe una hairline (<span> o motion.div) bajo el nombre con
      "scaleX: 0" → "1" en hover, "origin-left", "h-px" y "bg-copper"

  @s11
  Scenario: prefers-reduced-motion — grid visible, sin hover magnético
    # verificación por source inspection + RTL
    Given el navegador tiene "prefers-reduced-motion: reduce" activado
    When renderizo el componente ProductGrid
    Then el componente lee la preferencia con "useReducedMotion" (o
      equivalente) y ramifica el JSX
    And todas las tarjetas son visibles desde el montaje (sin stagger)
    And no se aplica hover magnético (sin onMouseMove, sin tilt)
    And el tag de material es visible por defecto
    And las tarjetas son navegables por teclado (son <a>)
    And el contenido visible (6 tarjetas con imagen, h3, precio, tag)
      está presente independientemente del motion

  @s12
  Scenario: JS deshabilitado — las 6 tarjetas se ven con hover CSS fallback
    # verificación por source inspection
    Given el navegador tiene JavaScript deshabilitado
    When el componente se renderiza server-side
    Then las 6 tarjetas se renderizan visibles (sin initial="hidden"
      que oculte)
    And existe un hover CSS básico como fallback (ej. "group-hover:shadow-lg"
      o "group-hover:border-copper") además del magnético JS
    And las tarjetas siguen siendo enlaces clickeables sin JS

  @s13
  Scenario: Navegación por teclado — tarjetas con :focus-visible
    # verificación por source inspection
    Given el archivo src/components/ProductGrid.tsx y src/app/globals.css
    When inspecciono su contenido
    Then las tarjetas (enlaces <a>) tienen estilo ":focus-visible"
      (ring copper o hairline)
    And el tag de material aparece también en ":focus-visible" (paridad
      de estados con hover)

  @s14
  Scenario: Touch device — tag visible por defecto vía @media (hover: none)
    # verificación por source inspection
    Given el archivo src/app/globals.css o src/components/ProductGrid.tsx
    When inspecciono su contenido
    Then existe una regla "@media (hover: none)" que muestra el tag de
      material fijo (visible siempre en móvil/touch, no depende de hover)
