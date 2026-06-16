Feature: Pie de página del sitio
  Como visitante quiero ver el pie de página con los datos de contacto
  y las redes sociales de Mantamar para poder contactarme con la marca.

  @s1
  Scenario: El footer aparece en la home con la marca
    Given que visito la ruta "/"
    When la página termina de renderizar
    Then existe un <footer> con el texto "Mantamar"

  @s2
  Scenario: El footer tiene fondo oscuro y padding generoso
    Given que visito la ruta "/"
    When localizo el <footer>
    Then su className incluye "bg-ink"
    And su className incluye "text-paper"
    And su className incluye "py-12" y "px-6"

  @s3
  Scenario: El footer muestra los enlaces a tres redes sociales
    Given que visito la ruta "/"
    When localizo el <footer>
    Then existen 3 enlaces a redes (Instagram, Facebook, WhatsApp) con href "#"

  @s4
  Scenario: El copyright contiene el año actual dinámico
    Given que visito la ruta "/"
    When localizo el <footer>
    Then su texto contiene el año actual (new Date().getFullYear())

  @s5
  Scenario: El footer está montado desde el layout
    Given el archivo src/app/layout.tsx
    When inspecciono su JSX
    Then importa y renderiza el componente Footer
    And src/app/page.tsx no importa Footer directamente
