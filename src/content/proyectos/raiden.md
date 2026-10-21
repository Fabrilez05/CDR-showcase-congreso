---
nombre: Raiden
kanji: 雷電
categoria: sumobot
nivel: Pro
orden: 1
resumen: Sumobot radiocontrolado con motores N20 de 3000 rpm y cuatro modos de manejo.
descripcion: >-
  Raiden es nuestro sumobot de categoría pro: un robot de 500 g con cuña frontal
  que busca empujar al rival fuera del dohyo. Sus dos motores N20 de 3000 rpm le
  dan velocidad, y se maneja con un mando de PlayStation 3 por Bluetooth.
portada: ../../assets/proyectos/raiden/render.png
cifras:
  - { valor: "500 g", etiqueta: Peso }
  - { valor: "3000", etiqueta: rpm }
  - { valor: PS3, etiqueta: Control }
specs:
  - { nombre: Dimensiones, valor: "100 × 100 × 62,94 mm" }
  - { nombre: Peso, valor: "500 g" }
  - { nombre: Microcontrolador, valor: ESP32 }
  - { nombre: Sistema de control, valor: "Mando PlayStation 3 (Bluetooth)" }
  - { nombre: Motores, valor: "2 × motor N20 DC de 3000 rpm" }
  - { nombre: Tensión de motores, valor: "6–8 V recomendados" }
  - { nombre: Driver de motores, valor: "TC1508A, doble puente H" }
  - { nombre: Batería, valor: "Li-Po 7,4 V, 1200 mAh, 20C" }
  - { nombre: Ruedas, valor: "Ø 27,52 mm exterior / Ø 22,52 mm interior" }
  - { nombre: Estructura, valor: Chasis con cuña frontal }
pdf: fichas/raiden.pdf
---

## Modos de manejo

El mando se conecta con la librería **Bluepad32**. El modo se cambia en cualquier momento con **L1 + cruceta**:

| Combinación | Modo | Descripción |
| --- | --- | --- |
| L1 + ↑ | Arcade | Una palanca para avanzar y girar |
| L1 + → | Tanque | Una palanca por cada motor |
| L1 + ↓ | Arcade stutter | Al avanzar alterna izquierda y derecha |
| L1 + ← | Tanque stutter | Los motores avanzan y paran de forma alternada |

En los modos *stutter*, mantener **R2** desactiva el efecto para tener tracción total.

## Pines y electrónica

| Motor | Adelante | Atrás | PWM mínimo |
| --- | :---: | :---: | :---: |
| Izquierdo | 12 | 13 | 80 |
| Derecho | 27 | 14 | 80 |

Cada motor usa dos pines PWM del ESP32 conectados al puente H TC1508A. Batería, driver y ESP32 comparten GND.

## Seguridad y estado

- Los motores se detienen si el mando se desconecta y cada vez que se cambia de modo.
- **En revisión:** la reversa del motor derecho. El software envía bien el PWM; el problema está entre el pin 14, el driver y el motor.
