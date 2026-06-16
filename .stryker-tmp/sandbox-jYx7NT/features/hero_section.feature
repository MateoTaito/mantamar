Feature: Sección hero de la página principal
  Como visitante quiero ver un banner de impacto con la imagen de marca
  y un CTA hacia el catálogo para entender la propuesta en el primer
  vistazo.

  @s1
  Scenario: La sección hero está en la home con el id correcto
    Given que visito la ruta "/"
    When la página termina de renderizar
    Then existe un <section> con id "inicio"

  @s2
  Scenario: La sección hero muestra la imagen placeholder
    Given que visito la ruta "/"
    When localizo la sección con id "inicio"
    Then existe un <img> con src "/hero_placeholder.webp"
    And el atributo alt no está vacío y está en español

  @s3
  Scenario: La sección hero contiene titular, subtítulo y CTA
    Given que visito la ruta "/"
    When localizo la sección con id "inicio"
    Then existe un <h1> con un titular en español sobre lana chilena o ponchos
    And existe un <p> con un subtítulo
    And existe un <a> con texto "Ver catálogo" y href "#catalogo"

  @s4
  Scenario: La sección hero ocupa al menos el 80% del alto de la ventana
    Given que visito la ruta "/"
    When localizo la sección con id "inicio"
    Then su className incluye "min-h-[80vh]" (o equivalente que asegure al menos 80vh)
