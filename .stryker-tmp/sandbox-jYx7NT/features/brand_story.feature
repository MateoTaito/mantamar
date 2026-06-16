Feature: Sección de historia de la marca
  Como visitante quiero leer sobre la propuesta rural y artesana de
  Mantamar para entender la diferencia entre un poncho tejido a mano
  y la moda masiva.

  @s1
  Scenario: La sección "Nosotros" está en la home con el id correcto
    Given que visito la ruta "/"
    When la página termina de renderizar
    Then existe una <section> con id "nosotros"

  @s2
  Scenario: El texto de la historia menciona lana chilena y poncho
    Given que visito la ruta "/"
    When localizo la sección con id "nosotros"
    Then existe un <h2> con un título en español
    And existe un <p> cuyo texto contiene la palabra "lana chilena"
    And el mismo <p> contiene la palabra "poncho"

  @s3
  Scenario: La sección muestra una imagen con el placeholder de producto
    Given que visito la ruta "/"
    When localizo la sección con id "nosotros"
    Then existe un <img> con src "/product_placeholder_2.svg"

  @s4
  Scenario: El layout es de dos columnas en escritorio y una en móvil
    Given que visito la ruta "/"
    When localizo la sección con id "nosotros"
    Then su className incluye "md:grid-cols-2" (layout de dos columnas en md+)
