---
nombre: Taiho
kanji: 大鵬
categoria: sumobot
nivel: Amateur
orden: 2
resumen: Sumobot radiocontrolado de 303 g con motorreductores de 600 rpm y mando de PS3.
descripcion: >-
  Taiho es nuestro sumobot de categoría amateur. Pesa 303 g, tiene una cuña
  frontal para levantar al rival y se mueve con dos motorreductores amarillos de
  600 rpm. Se controla a distancia con un mando de PlayStation 3 por Bluetooth.
portada: ../../assets/proyectos/taiho/render.png
cifras:
  - { valor: "303 g", etiqueta: Peso }
  - { valor: "600", etiqueta: rpm }
  - { valor: PS3, etiqueta: Control }
specs:
  - { nombre: Dimensiones, valor: "100 × 100 × 72,5 mm" }
  - { nombre: Peso, valor: "303 g" }
  - { nombre: Microcontrolador, valor: ESP32 }
  - { nombre: Sistema de control, valor: "Mando PlayStation 3 (Bluetooth)" }
  - { nombre: Motores, valor: "2 × motorreductores DC de 600 rpm" }
  - { nombre: Tensión de motores, valor: "6–8 V recomendados" }
  - { nombre: Driver de motores, valor: "TC1508A, doble puente H" }
  - { nombre: Batería, valor: "Li-Po 7,4 V, 1200 mAh, 20C" }
  - { nombre: Ruedas, valor: "Ø 40,6 mm exterior / Ø 36,6 mm interior" }
  - { nombre: Estructura, valor: Chasis con cuña frontal }
pdf: fichas/taiho.pdf
---

## Amateur y pro

Taiho y [Raiden](../raiden/) comparten el chasis de 100 × 100 mm, el ESP32, el driver TC1508A y la batería. La diferencia está en los motores: Taiho usa motorreductores de 600 rpm, con más torque y menos velocidad, ideales para empezar; Raiden usa motores N20 de 3000 rpm.
