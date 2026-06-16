Feature: Cabecera con navegación principal
  Como visitante quiero ver la marca y los enlaces de navegación
  (Inicio, Catálogo, Nosotros, Contacto) en una barra superior para
  poder moverme por el sitio desde cualquier página.

  @s1
  Scenario: El header se renderiza en la home con la marca y los enlaces
    Given que visito la ruta "/"
    When la página termina de renderizar
    Then existe un <header> con el texto "Mantamar" como enlace a "/"
    And existen enlaces con hrefs "#inicio", "#catalogo", "#nosotros" y "#contacto"
    And los textos "Inicio", "Catálogo", "Nosotros" y "Contacto" están visibles

  @s2
  Scenario: El header está montado desde el layout (no por página)
    Given el archivo src/app/layout.tsx
    When inspecciono su JSX
    Then importa y renderiza el componente Header
    And src/app/page.tsx no importa Header directamente

  @s3
  Scenario: El header tiene fondo crema translúcido con blur y borde inferior
    Given que visito la ruta "/"
    When localizo el <header>
    Then contiene la clase CSS "bg-cream" o "bg-cream/90"
    And contiene "backdrop-blur"
    And tiene "border-b" en su lista de clases
