---
nombre: Minos
categoria: micromouse
orden: 3
resumen: Micromouse autónomo con sensores infrarrojos, encoders y control PID.
descripcion: >-
  Minos es nuestro micromouse: un robot autónomo pensado para recorrer
  laberintos. En el stand lo vas a ver en un laberinto pequeño de demostración y
  en modo "sigue la mano", donde detecta tu mano con sensores infrarrojos y
  avanza recto gracias a un control PID basado en encoders.
cifras:
  - { valor: "20 ms", etiqueta: Ciclo de control }
  - { valor: "60 ms", etiqueta: Antirrebote }
  - { valor: PID, etiqueta: Control }
specs:
  - { nombre: Microcontrolador, valor: ESP32 }
  - { nombre: Sensores, valor: "4 × infrarrojos (2 frontales, 2 laterales)" }
  - { nombre: Odometría, valor: "2 × encoders" }
  - { nombre: Control, valor: "PID sobre la diferencia de ticks" }
  - { nombre: PWM, valor: "1 kHz, 8 bits" }
  - { nombre: Activación, valor: "DIP switch en 0001" }
---

## Cómo sigue la mano

Solo funciona con el DIP switch en `0001`; con cualquier otro valor los motores se detienen.

| Estado | Cuándo | Qué hace |
| --- | --- | --- |
| `FORWARD` | Ambos sensores frontales detectan | Avanza recto con corrección PID |
| `STEER_L` | Solo el frontal izquierdo | Gira a la izquierda |
| `STEER_R` | Solo el frontal derecho | Gira a la derecha |
| `IDLE` | Ninguno | Detenido |

Cada sensor tiene que detectar durante 3 ciclos seguidos (60 ms) para contar, así se ignora la luz infrarroja ambiental.

## Control PID

El PID mantiene las dos ruedas sincronizadas comparando los ticks de los encoders en cada ciclo de 20 ms:

- Error: `err = dL - dR` (ticks por periodo de cada rueda).
- Constantes: `Kp = 8.0`, `Ki = 0.5`, `Kd = 2.0`.
- Depuración por monitor serie a 115200 baudios.

## Pines y electrónica

| Función | Pines |
| --- | --- |
| Motor izquierdo (adelante / atrás) | 12 / 13 |
| Motor derecho (adelante / atrás) | 27 / 14 |
| IR frontales (derecho / izquierdo) | 25 / 26 |
| IR laterales (izquierdo / derecho) | 32 / 35 |
| Encoders (izquierdo / derecho) | 36 / 39 |
| DIP switch (1 a 4) | 23, 22, 21, 19 |

## Limitaciones

Los sensores son digitales (detectan presencia, no distancia) y los encoders no detectan el sentido de giro, así que el PID solo se usa para avanzar.
