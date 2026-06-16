Feature: Catálogo de productos en cuadrícula
  Como visitante quiero ver el catálogo de ponchos en una cuadrícula
  responsive para elegir el que más me guste y entrar a su detalle.

  @s1
  Scenario: La cuadrícula está en la home con el id correcto
    Given que visito la ruta "/"
    When la página termina de renderizar
    Then existe una <section> con id "catalogo"

  @s2
  Scenario: La cuadrícula renderiza al menos 6 productos
    Given que visito la ruta "/"
    When localizo la sección con id "catalogo"
    Then cuenta al menos 6 tarjetas de producto (enlaces a "/productos/<slug>")

  @s3
  Scenario: Cada tarjeta tiene imagen, nombre y precio formateado en CLP
    Given que visito la ruta "/"
    When localizo la primera tarjeta de producto
    Then su <img> apunta a "/product_placeholder_2.svg"
    And su <img> tiene alt con el nombre del producto
    And existe un <h3> con el nombre del producto
    And existe un precio que contiene el símbolo "$"

  @s4
  Scenario: La cuadrícula es responsive
    Given que visito la ruta "/"
    When localizo la sección con id "catalogo"
    Then su contenedor incluye clases que indiquen 1/2/3 columnas:
      "grid-cols-1" y "sm:grid-cols-2" y "md:grid-cols-3"

  @s5
  Scenario: El array de productos tiene al menos 6 elementos válidos
    Given el archivo src/lib/products.ts
    When importo el módulo
    Then el array products tiene length >= 6
    And cada elemento tiene slug (string no vacío), name (string en español),
      price (número entero) y description (string en español)
