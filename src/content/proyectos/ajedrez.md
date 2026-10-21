---
nombre: Magnus
categoria: ajedrez
orden: 4
resumen: Tablero de ajedrez físico que detecta cada pieza con 64 sensores Hall, ilumina las jugadas y juega contra vos con Stockfish.
descripcion: >-
  Magnus es un tablero de ajedrez de verdad, con piezas de verdad, que sabe dónde
  está cada una. Debajo de cada casilla hay un sensor y un LED: el tablero valida
  tus jugadas, te muestra adónde puede ir la pieza que levantaste y lleva el
  reloj. Podés jugar contra un amigo o contra Magnus, que elige sus jugadas con el
  motor Stockfish.
portada: ../../assets/proyectos/ajedrez/menu-principal.jpg
cifras:
  - { valor: "64", etiqueta: Sensores Hall }
  - { valor: "64", etiqueta: LEDs RGB }
  - { valor: IA, etiqueta: Rival (Stockfish) }
specs:
  - { nombre: Procesador, valor: Raspberry Pi 3 Model B }
  - { nombre: Lectura de sensores, valor: "Arduino Nano (ATmega328P), conectado por USB" }
  - { nombre: Sensores, valor: "64 × Hall A3144, con imanes de neodimio en las piezas" }
  - { nombre: Antighosting, valor: "64 × diodos 1N4148" }
  - { nombre: Manejo de filas, valor: "8 × transistores NPN" }
  - { nombre: Iluminación, valor: "64 × LEDs WS2812B" }
  - { nombre: Pantalla, valor: "Táctil LCD 3,5\" (480 × 320)" }
  - { nombre: Reloj, valor: "2 × fines de carrera como botones" }
  - { nombre: Software, valor: "Python (python-chess) + Stockfish" }
enlaces:
  - { texto: "Código y documentación (tablero-ajedrez-inteligente)", url: "https://github.com/tino7902/tablero-ajedrez-inteligente" }
---

## Cómo se juega

Las jugadas se arman moviendo las piezas y **cuentan recién al apretar el botón del reloj**. Hasta ese momento podés acomodarlas en cualquier orden: enrocar empezando por el rey o por la torre, capturar sacando primero cualquiera de las dos piezas, o cambiar de idea.

- Si la posición es una jugada legal, se aplica y pasa el turno.
- Si no, el botón no hace nada y los LEDs muestran qué corregir.

En el menú se elige el rival: **contra un amigo**, con reloj de 3, 5 o 10 minutos, o **contra Magnus**. La promoción es siempre a dama, porque los sensores detectan que hay una pieza, no cuál es.

## Qué dicen los LEDs

| Color | Significa |
| --- | --- |
| Azul | La pieza que estás moviendo (o las dos del enroque) |
| Blanco tenue | Adónde puede ir, o qué pieza rival puede capturar |
| Verde | La jugada armada, lista para confirmar con el reloj |
| Rojo | Debería haber una pieza y no hay |
| Amarillo | Hay una pieza que no debería estar |

Al empezar, el tablero pide acomodar las piezas: marca en rojo lo que falta y en amarillo lo que sobra. Cuando todo coincide se prende en verde y el reloj arranca con el primer botón.

## Cómo detecta las piezas

Cada pieza tiene un imán de neodimio en la base, con el polo sur hacia abajo, y cada casilla un sensor Hall A3144. Los 64 sensores forman una **matriz de 8 × 8**: el Arduino Nano activa una fila por vez con un transistor NPN y lee las 8 columnas, y le pasa el estado del tablero a la Raspberry Pi por USB. Un diodo por casilla evita las lecturas fantasma (*ghosting*) cuando hay varias piezas en la misma fila.

La Raspberry Pi hace el resto: compara la lectura con la posición, valida las jugadas con `python-chess`, maneja los LEDs y la pantalla, y le pide la jugada a Stockfish cuando juega Magnus.

## De reed switches a sensores Hall

La detección pasó por tres versiones:

1. **v1:** reed switches leídos por la Raspberry Pi con un 74HC138 y un 74HC165.
2. **v2:** sensores Hall con los mismos chips. No funcionó: cada fila de 8 sensores consume unos 35 mA y el 74HC138 garantiza apenas 4–5 mA. La salida que debía marcar 0 V marcaba 1,6 V y los sensores quedaban sin alimentación suficiente.
3. **v3 (actual):** el Arduino Nano barre la matriz con un NPN por fila y alimenta los Hall a 5 V, su tensión de trabajo.
