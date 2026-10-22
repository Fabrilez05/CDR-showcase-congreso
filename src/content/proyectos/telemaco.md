---
nombre: Telemaco
categoria: futbot
nivel: BLE
extra: true
orden: 1
resumen: Futbot que se maneja desde un joystick en el navegador por Bluetooth Low Energy.
descripcion: >-
  Telemaco es un futbot de tracción diferencial que se controla desde el
  celular: abrís una página web con un joystick virtual, te conectás por
  Bluetooth Low Energy y listo, sin instalar ninguna app.
portada: ../../assets/proyectos/telemaco/render.jpg
cifras:
  - { valor: "250 ms", etiqueta: Watchdog }
  - { valor: BLE, etiqueta: Conexión }
  - { valor: Web, etiqueta: Control }
specs:
  - { nombre: Microcontrolador, valor: ESP32 }
  - { nombre: Conexión, valor: "Bluetooth Low Energy (servidor GATT)" }
  - { nombre: Nombre BLE, valor: Telemaco }
  - { nombre: PWM, valor: "8 bits (0–255)" }
enlaces:
  - { texto: "Joystick web (hermes-ble-joystick)", url: "https://github.com/Fabrilez05/hermes-ble-joystick" }
---

## Protocolo BLE

El ESP32 actúa como servidor BLE y recibe las coordenadas del joystick como texto.

- **Service UUID:** `d3f8007e-c032-43ef-90f7-b042e9910fff`
- **Characteristic RX:** `f85ba695-b4ec-42cf-8127-1c08d2fbce99` (`WRITE` y `WRITE_NR`)
- **Mensaje:** `X:0.50,Y:-0.80`, con valores de `-1.0` a `1.0`.

## Mezcla diferencial

1. Zona muerta de `0.05` en ambos ejes, para evitar movimientos fantasma.
2. Mezcla: izquierda = `Y - X`, derecha = `Y + X`.
3. Límite a `-1.0..1.0` y conversión a PWM de 8 bits (0–255).

## Pines

| Motor | Adelante | Atrás |
| --- | :---: | :---: |
| Izquierdo | 32 | 33 |
| Derecho | 25 | 26 |

## Seguridad

- **Watchdog:** si pasan más de 250 ms sin recibir comandos, los motores se detienen.
- Al desconectarse el cliente BLE, los motores se detienen y el robot vuelve a anunciarse.
