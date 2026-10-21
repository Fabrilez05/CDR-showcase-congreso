---
nombre: Simón dice
categoria: otro
nivel: Juego
extra: true
orden: 2
resumen: El clásico juego de memoria con luces, sonidos y niveles de dificultad, hecho con un ESP32.
descripcion: >-
  ¿Cuánto podés recordar? El sistema muestra una secuencia de luces y sonidos
  y vos tenés que repetirla con los botones de colores. Cada ronda la secuencia
  se alarga. Antes de empezar podés elegir el nivel de dificultad.
portada: ../../assets/proyectos/simon-dice/diagrama.png
pdf: fichas/simon-dice.pdf
---

## Componentes

- **ESP32:** procesa las entradas de los botones, genera la secuencia y controla las luces y el sonido.
- **LEDs indicadores** (rojo, azul, verde y amarillo): muestran la secuencia que hay que memorizar.
- **Buzzer:** genera el sonido de cada color y las señales de acierto y error.
- **Botones de colores:** el jugador repite la secuencia indicada por el sistema.
- **Botón de dificultad:** permite elegir el nivel antes de comenzar.
