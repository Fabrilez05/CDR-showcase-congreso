# 🤖 Proyectos de robótica para el congreso

Sitio web con los proyectos que presentaremos en el congreso: **2 sumobots** (uno amateur y uno avanzado), **1 micromouse**, **2 futbots** y **1 ajedrez inteligente**.

🌐 **Sitio:** `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`

---

## Proyectos

| Categoría | Cantidad | Documentación |
| --- | :---: | --- |
| Sumobot | 2 (amateur y avanzado) | Pendiente |
| Micromouse | 1 | Pendiente |
| Futbot | 2 | Pendiente |
| Ajedrez inteligente | 1 | Pendiente |

Robots documentados hasta ahora (todos basados en **ESP32**):

| Robot | Qué hace | Control |
| --- | --- | --- |
| [Telemaco](#telemaco) | Robot diferencial controlado desde un joystick web | Bluetooth Low Energy (BLE) |
| [Minos](#minos) | Robot que sigue una mano con sensores infrarrojos | Autónomo (IR + encoders + PID) |
| [Raiden](#raiden) | Robot diferencial con varios modos de manejo | Mando Bluetooth (Bluepad32) |

Joystick web para controlar robots por BLE: [hermes-ble-joystick](https://github.com/Fabrilez05/hermes-ble-joystick)

---

## Telemaco

Robot de tracción diferencial controlado por **BLE**. El ESP32 actúa como servidor BLE y recibe coordenadas de un joystick virtual (web o móvil).

- **Nombre BLE:** `Telemaco`
- **Service UUID:** `d3f8007e-c032-43ef-90f7-b042e9910fff`
- **Characteristic RX:** `f85ba695-b4ec-42cf-8127-1c08d2fbce99` (`WRITE` y `WRITE_NR`)
- **Mensaje:** texto con formato `X:0.50,Y:-0.80`, con valores de `-1.0` a `1.0`.

**Pines (puente H):**

| Motor | Adelante | Atrás |
| --- | :---: | :---: |
| Izquierdo | 32 | 33 |
| Derecho | 25 | 26 |

**Control:**

1. Zona muerta de `0.05` en ambos ejes.
2. Mezcla diferencial: izquierda = `Y - X`, derecha = `Y + X`.
3. Límite a `-1.0..1.0` y conversión a PWM de 8 bits (0-255).

**Seguridad:**

- *Watchdog:* si pasan más de **250 ms** sin recibir comandos, los motores se detienen.
- Al desconectarse el cliente BLE, los motores se detienen y el robot vuelve a anunciarse.

---

## Minos

Robot diferencial que **sigue una mano** con sensores infrarrojos y avanza recto con un **PID basado en encoders**. Sketch: `MinosHandFollowTest.ino`.

**Activación:** solo funciona con el DIP switch en `0001`; con cualquier otro valor los motores se detienen.

**Máquina de estados:**

| Estado | Condición | Acción |
| --- | --- | --- |
| `FORWARD` | Ambos sensores frontales detectan | Avanza con corrección PID |
| `STEER_L` | Solo el frontal izquierdo | Gira a la izquierda |
| `STEER_R` | Solo el frontal derecho | Gira a la derecha |
| `IDLE` | Ninguno | Detenido |

**Detalles técnicos:**

- Ciclo de control cada 20 ms.
- Antirrebote: cada sensor debe detectar durante 3 ciclos seguidos (60 ms).
- PID de línea recta: `err = dL - dR` (ticks de encoder por periodo), con `Kp = 8.0`, `Ki = 0.5`, `Kd = 2.0`.
- PWM de 1 kHz y 8 bits.
- Depuración por monitor serie a 115200 baudios.

**Pines:**

| Función | Pines |
| --- | --- |
| Motor izquierdo (adelante / atrás) | 12 / 13 |
| Motor derecho (adelante / atrás) | 27 / 14 |
| IR frontales (derecho / izquierdo) | 25 / 26 |
| IR laterales (izquierdo / derecho) | 32 / 35 |
| Encoders (izquierdo / derecho) | 36 / 39 |
| DIP switch (1 a 4) | 23, 22, 21, 19 |

**Limitaciones:** los sensores son digitales (detectan presencia, no distancia) y los encoders no detectan el sentido de giro, así que el PID solo sirve para avanzar.

---

## Raiden

Robot de tracción diferencial controlado con un **mando Bluetooth** mediante la librería **Bluepad32**. Sketch: `Raiden.ino`.

**Pines (puente H):**

| Motor | Adelante | Atrás | `minPwm` |
| --- | :---: | :---: | :---: |
| Izquierdo | 12 | 13 | 80 |
| Derecho | 27 | 14 | 80 |

**Modos de manejo** (se eligen con **L1 + cruceta**):

| Combinación | Modo | Descripción |
| --- | --- | --- |
| L1 + arriba | Arcade normal | Giro con una palanca |
| L1 + derecha | Tanque normal | Palancas independientes |
| L1 + abajo | Arcade stutter | Al avanzar alterna izquierda y derecha |
| L1 + izquierda | Tanque stutter | Los dos motores avanzan y paran de forma alternada |

En los modos *stutter*, mantener **R2** desactiva el efecto para tener tracción total.

**Seguridad:** los motores se detienen si el mando se desconecta y al cambiar de modo.

**Estado conocido:** la reversa del motor derecho está en revisión (el software envía PWM correctamente, el problema está entre el pin 14, el driver y el motor).

---

## Hardware común

- Microcontrolador **ESP32**.
- Puente H con dos pines PWM por motor (adelante y atrás).
- GND común entre batería, driver y ESP32.
- Recomendado: capacitor de 470 a 1000 µF en la alimentación del driver y 100 nF en cada motor, para evitar caídas de voltaje (*brownout*).

---

## Requisitos para desarrollar el sitio

El sitio se construye con [Astro](https://astro.build/). Para verlo y probarlo en tu computadora necesitas:

| Herramienta | Versión mínima | Para qué |
| --- | --- | --- |
| [Node.js](https://nodejs.org/) | 22.22.0 (se recomienda la última LTS) | Ejecutar Astro y compilar el sitio |
| npm | 9.6.5 (viene incluido con Node.js) | Instalar las dependencias del proyecto |
| [Git](https://git-scm.com/) | Cualquier versión reciente | Clonar el repo y subir cambios |

Para comprobar lo que tienes instalado:

```bash
node --version
npm --version
git --version
```

> Si solo vas a editar textos o agregar fotos, no necesitas instalar nada: puedes hacerlo desde la web de GitHub y el sitio se publica solo con GitHub Actions.

---

## Estructura del repositorio

```
.
├── index.html     # Página del congreso
└── README.md      # Este archivo
```

## Publicar en GitHub Pages

1. Sube `index.html` y `README.md` a la rama `main`.
2. Ve a **Settings → Pages**.
3. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
4. Espera un minuto y abre la URL que aparece.

## Autor

[Fabrilez05](https://github.com/Fabrilez05)
