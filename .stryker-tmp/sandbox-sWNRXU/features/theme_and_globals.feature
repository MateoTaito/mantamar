Feature: Tema y estilos globales de la marca Mantamar
  Como visitante del sitio quiero ver la identidad visual de Mantamar
  (fondo crema, texto en negro, marca en español) para reconocer la
  tienda de lana chilena desde el primer vistazo.

  @s1
  Scenario: La home renderiza en español con la marca
    Given que visito la ruta "/"
    When la página termina de renderizar
    Then el elemento <html> tiene el atributo lang con valor "es"
    And el <title> del documento es "Mantamar"
    And existe un <h1> con el texto "Mantamar"

  @s2
  Scenario: La paleta de la marca está declarada en globals.css
    Given el archivo src/app/globals.css
    When inspecciono su contenido
    Then contiene "@import \"tailwindcss\""
    And contiene un bloque "@theme" con los tokens
      | token          | valor     |
      | --color-cream  | #F5EDE0   |
      | --color-cream-dark | #E8D9C0 |
      | --color-coffee | #C9A875   |
      | --color-coffee-dark | #8B6F47 |
      | --color-ink    | #0F0F0F   |
      | --color-paper  | #FFFFFF   |

  @s3
  Scenario: El layout declara metadata en español sobre la tienda
    Given el archivo src/app/layout.tsx
    When inspecciono su metadata exportada
    Then title es "Mantamar"
    And description es un string en español que menciona "lana" o "poncho"
