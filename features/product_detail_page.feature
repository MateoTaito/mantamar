Feature: Página de detalle v2 — parallax + duotono
  Como visitante quiero entrar al detalle de un producto en
  /productos/<slug> y ver una ficha con imagen grande en parallax +
  duotono cálido, nombre, descripción, precio CLP, metadata y CTA
  "Consultar por WhatsApp" — y si el slug no existe, ver un estado
  "Producto no encontrado" con enlace al catálogo (no un error 500).

  @s1
  Scenario: page.tsx resuelve el producto por params.slug con await (Next 16)
    # verificación por source inspection
    Given el archivo src/app/productos/[slug]/page.tsx
    When inspecciono su contenido
    Then la firma del componente declara "params: Promise<{ slug: string }>"
    And el cuerpo hace "await params" antes de resolver el slug
    And importa "products" desde src/lib/products.ts para buscar por slug

  @s2
  Scenario: Slug válido renderiza la ficha con nombre, descripción y precio
    Given que visito la ruta "/productos/poncho-andino" (slug existente)
    When la página termina de renderizar
    Then existe un <h1> con el nombre del producto
    And existe un <p> con la descripción del producto
    And existe un precio que contiene el símbolo "$" (formateado en CLP
      vía formatPrice)

  @s3
  Scenario: Slug válido renderiza imagen vía next/image con alt del nombre
    # verificación por source inspection + RTL
    Given el archivo src/components/ProductDetailPage.tsx
    When inspecciono su contenido
    Then importa "next/image" (migra del <img src="/product-placeholder-2.svg">
      de v1)
    And el src es "poncho-mujer.webp" o "poncho-hombre.webp" (rotación
      por slug como en ProductGrid)
    And que visito la ruta "/productos/poncho-andino"
    When la página termina de renderizar
    Then existe un elemento con role "img" y alt con el nombre del
      producto en español

  @s4
  Scenario: Slug válido renderiza CTA "Consultar por WhatsApp" con slug en href
    Given que visito la ruta "/productos/poncho-andino"
    When localizo el <a> con texto "Consultar por WhatsApp"
    Then su href empieza con "https://wa.me/?text="
    And su href contiene el slug "poncho-andino" (URL-encoded vía
      encodeURIComponent)
    And tiene atributo target="_blank"
    And tiene atributo rel="noopener noreferrer"

  @s5
  Scenario: Slug inválido muestra "Producto no encontrado" con enlace al catálogo
    Given que visito la ruta "/productos/no-existe-este-slug"
    When la página termina de renderizar
    Then existe un <h1> con el texto "Producto no encontrado"
    And existe un <a> con href "#catalogo" (o "/#catalogo") para volver
    And la página NO lanza un error 500 ni usa notFound() de Next
      (render normal, no 404)

  @s6
  Scenario: ProductDetailPage es cliente con motion para parallax/duotono/slide-in
    # verificación por source inspection
    Given el archivo src/components/ProductDetailPage.tsx
    When inspecciono su contenido
    Then comienza con la directiva "use client"
    And importa "motion" desde "motion/react" o "framer-motion"
    And importa "useScroll" y "useTransform" para el parallax de la imagen
    And la page (server) pasa el "product" por props al componente
      cliente (separación server/client)

  @s7
  Scenario: Back-link "← Volver al catálogo" a /#catalogo con flecha animada
    # verificación por source inspection + RTL
    Given que visito la ruta "/productos/poncho-andino"
    When localizo el back-link
    Then existe un enlace (Next <Link> o <a>) con texto que contiene
      "Volver al catálogo"
    And el archivo src/components/ProductDetailPage.tsx usa <Link> con
      href "/#catalogo" (no <a href="#catalogo">, porque el detail está
      en /productos/[slug] y debe volver al home + ancla)
    And la flecha "←" empuja en hover (motion whileHover={{ x: -4 }} o
      transición CSS group-hover:-translate-x-1)

  @s8
  Scenario: Metadata con tag de material + slug visible (Geist Mono)
    # verificación por source inspection + RTL
    Given el archivo src/components/ProductDetailPage.tsx
    When inspecciono su JSX
    Then existe un <span> con el material del producto (clase "font-mono"
      y "uppercase")
    And existe un elemento que muestra el slug del producto como
      referencia técnica (Geist Mono)
    And el precio y la metadata tienen slide-in al entrar en viewport
      (x: 20 → 0 + opacity, viewport={{ once: true }})
    And que visito la ruta "/productos/poncho-andino"
    When la página termina de renderizar
    Then el texto contiene el material del producto o el slug

  @s9
  Scenario: Duotono cálido por defecto que cede en hover
    # verificación por source inspection
    Given el archivo src/components/ProductDetailPage.tsx y
      src/app/globals.css
    When inspecciono su contenido
    Then la imagen tiene la clase "duotone" por defecto (compartida con
      ProductGrid)
    And en hover del padre, el duotono cede (clase "group-hover:duotone-off"
      o transición que relaja el filtro)

  @s10
  Scenario: prefers-reduced-motion — ficha estática sin motion
    # verificación por source inspection + RTL
    Given el navegador tiene "prefers-reduced-motion: reduce" activado
    When renderizo el componente ProductDetailPage
    Then el componente lee la preferencia con "useReducedMotion" (o
      equivalente) y ramifica el JSX
    And la imagen es visible sin parallax
    And el duotono queda estático (no cede en hover con motion)
    And el precio y metadata son visibles sin slide-in
    And el back-link tiene hover CSS instantáneo (sin flecha animada)
    And el contenido visible (imagen, h1, precio, metadata, descripción,
      CTA, back-link) está presente independientemente del motion

  @s11
  Scenario: JS deshabilitado — la ficha se renderiza completa en SSR
    # verificación por source inspection
    Given el navegador tiene JavaScript deshabilitado
    When la página dinámica se renderiza server-side (App Router)
    Then el HTML que llega trae la ficha completa (imagen, h1, precio,
      descripción, CTA, back-link)
    And el CTA WhatsApp funciona (es un <a> con href, no requiere JS)
    And el estado inicial de los motion.div slide-in NO oculta
      precio/metadata server-side (el estado animado es excepcional, el
      estático es el baseline accesible)
    And el <h1> no se anima con opacity: 0 initial (crítico para SEO y
      accesibilidad)
