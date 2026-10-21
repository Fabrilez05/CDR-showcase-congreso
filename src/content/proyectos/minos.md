---
nombre: Minos
categoria: micromouse
orden: 3
resumen: Micromouse autónomo que explora el laberinto, lo mapea y calcula la ruta con flood fill.
descripcion: >-
  Minos es nuestro micromouse: un robot autónomo que recorre un laberinto sin
  ayuda. En el stand lo vas a ver explorar el laberinto de demostración, detectar
  las paredes con sensores infrarrojos, dibujar el mapa en su memoria y decidir
  el camino al centro con el algoritmo flood fill. Al llegar, regresa solo a la
  casilla de inicio.
cifras:
  - { valor: "16 × 16", etiqueta: Laberinto configurable }
  - { valor: "Flood fill", etiqueta: Algoritmo }
  - { valor: "4 × IR", etiqueta: Sensores de pared }
specs:
  - { nombre: Microcontrolador, valor: ESP32 }
  - { nombre: Sensores, valor: "4 × infrarrojos digitales (2 frontales, 2 laterales)" }
  - { nombre: Odometría, valor: "2 × encoders flying-fish" }
  - { nombre: Control, valor: "Proporcional sobre la diferencia de ticks" }
  - { nombre: PWM, valor: "20 kHz, 8 bits" }
  - { nombre: Navegación, valor: "Flood fill con mapa de paredes en tiempo real" }
---

## Cómo resuelve el laberinto

1. **Inicio:** espera 3 s para colocarlo en la esquina inferior izquierda mirando al norte.
2. **Sensado:** en cada celda lee los infrarrojos y anota las paredes de enfrente, izquierda y derecha. La pared frontal solo cuenta si ambos sensores frontales la detectan.
3. **Flood fill:** recalcula la distancia de cada celda a la meta.
4. **Decisión:** avanza hacia la celda vecina con menor distancia y sin pared; en caso de empate prefiere seguir recto.
5. **Movimiento:** gira 90° o avanza una celda contando ticks de los encoders.

El recorrido tiene dos fases: primero va al centro del laberinto (las 4 celdas centrales) y después regresa a la casilla de inicio. Si queda sin ruta posible, se detiene y lo avisa por el monitor serie.

## Avance recto

Para ir recto, Minos compara los ticks de las dos ruedas y corrige la velocidad de cada motor con un control proporcional (`Kp = 2.0`). Los giros de 90° se hacen por conteo de ticks, sin giroscopio.

| Parámetro | Valor |
| --- | --- |
| Velocidad de crucero | 120 de 255 |
| Velocidad de giro | 110 de 255 |
| Ticks por celda | 40 |
| Ticks por giro de 90° | 14 |

## Pines y electrónica

| Función | Pines |
| --- | --- |
| Motor izquierdo (adelante / atrás) | 13 / 12 |
| Motor derecho (adelante / atrás) | 27 / 14 |
| IR frontales (derecho / izquierdo) | 25 / 26 |
| IR laterales (izquierdo / derecho) | 32 / 35 |
| Encoders (izquierdo / derecho) | 36 / 39 |

## Limitaciones

- Los sensores son digitales: detectan presencia de pared, no distancia, así que no centra al robot entre paredes.
- Los giros son a lazo abierto, por lo que el error se acumula con el tiempo.
- Hace una sola pasada de exploración; todavía no tiene carrera rápida por la ruta más corta.
