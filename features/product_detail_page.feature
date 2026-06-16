Feature: Página de detalle de producto
  Como visitante quiero entrar al detalle de un producto para ver su
  descripción completa y contactarme por WhatsApp.

  @s1
  Scenario: La ficha de un producto válido se renderiza
    Given que visito la ruta "/productos/poncho-andino" (slug existente)
    When la página termina de renderizar
    Then existe un <h1> con el nombre del producto
    And existe un <p> con la descripción del producto
    And existe un <img> con src "/product_placeholder_2.svg"
    And existe un precio con el símbolo "$"
    And existe un <a> con texto "Consultar por WhatsApp" y href que empieza con "https://wa.me/"

  @s2
  Scenario: Un slug inválido muestra estado de no encontrado
    Given que visito la ruta "/productos/no-existe-este-slug"
    When la página termina de renderizar
    Then existe un <h1> con el texto "Producto no encontrado"
    And existe un <a> con href "#catalogo" para volver al catálogo

  @s3
  Scenario: El href de WhatsApp incluye el slug del producto
    Given que visito la ruta "/productos/poncho-andino"
    When localizo el <a> con texto "Consultar por WhatsApp"
    Then su href contiene el slug "poncho-andino" (URL-encoded o como aparece)
