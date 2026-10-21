# 🤖 Proyectos del CDR para el congreso

Sitio web con los proyectos que el **Club de Robótica de la Facultad Politécnica (FP-UNA)** presenta en el **25.º Congreso Internacional de Mecatrónica** (22 al 24 de octubre de 2026, México).

🌐 **Sitio:** <https://fabrilez05.github.io/CDR-showcase-congreso/>
🖨️ **QR para imprimir:** <https://fabrilez05.github.io/CDR-showcase-congreso/qr/>

| Proyecto | Categoría | Sección |
| --- | --- | --- |
| Raiden (雷電) | Sumobot pro | Competencia |
| Taiho (大鵬) | Sumobot amateur | Competencia |
| Minos | Micromouse | Competencia |
| Magnus | Ajedrez inteligente | Competencia |
| Telemaco | Futbot BLE | Extras |
| Simón dice | Juego | Extras |

La documentación técnica de cada robot está en `src/content/proyectos/` y se ve en el sitio.

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

## Desarrollo local

```bash
npm install      # instala las dependencias (solo la primera vez)
npm run dev      # abre el sitio en http://localhost:4321/CDR-showcase-congreso/
npm run ci       # tests + chequeo de tipos + build + verificación de links (lo mismo que corre GitHub)
```

---

## Agregar o editar un proyecto

Cada proyecto es un archivo Markdown en `src/content/proyectos/<id>.md`. El nombre del archivo es la URL: `raiden.md` → `/proyectos/raiden/`.

Arriba va un encabezado con los datos (si falta un campo obligatorio o está mal escrito, el build falla y te dice qué archivo y qué campo):

```yaml
---
nombre: Raiden                 # obligatorio
kanji: 雷電                    # opcional
categoria: sumobot             # obligatorio: sumobot | micromouse | futbot | ajedrez | otro
nivel: Pro                     # opcional, se suma a la etiqueta ("Sumobot · Pro")
extra: false                   # true → aparece en "Extras"
orden: 1                       # obligatorio, orden dentro de su sección
resumen: Una línea para la tarjeta de la portada (máx. 160 caracteres).
descripcion: Un párrafo para el público general.
portada: ../../assets/proyectos/raiden/render.png    # opcional; sin ella se ve "Foto próximamente"
video: ../../assets/proyectos/raiden/video.mp4   # opcional
cifras:                        # opcional, máximo 3
  - { valor: "500 g", etiqueta: Peso }
specs:                         # opcional, tabla "Ficha técnica completa"
  - { nombre: Peso, valor: "500 g" }
pdf: ../../assets/proyectos/raiden/ficha.pdf     # opcional
enlaces:                       # opcional
  - { texto: "Repositorio", url: "https://github.com/..." }
equipo: [Nombre Apellido]      # opcional
---
```

Debajo va el detalle técnico en Markdown normal. **Cada título `##` se convierte en un desplegable** en la página del proyecto.

**Dónde van los archivos:** todo lo de un proyecto (fotos, PDF y videos) va junto en `src/assets/proyectos/<id>/`, y en el encabezado se escribe la ruta relativa al `.md` (`../../assets/proyectos/<id>/...`). Las imágenes se optimizan para el celular; los videos conviene que sean `.mp4` cortos, de menos de 20 MB. Si la ruta apunta a un archivo que no existe, el build falla.

## Imprimir los QR

Abre `/qr/` en el navegador e imprime en A4. Cada QR lleva a la página de su proyecto.

---

## Estructura del repositorio

```
.
├── .github/workflows/deploy.yml   # build y publicación en GitHub Pages
├── public/                        # archivos que se publican tal cual (favicon)
├── scripts/check-links.mjs        # verifica que no haya links internos rotos
├── src/
│   ├── content/proyectos/         # un .md por proyecto
│   ├── assets/
│   │   ├── proyectos/<id>/        # imágenes, PDF y videos de cada proyecto
│   │   └── originales/cdrrr.pdf   # fichas técnicas originales (no se publica)
│   ├── components/                # tarjeta, cifras, ficha técnica, video, placeholder
│   ├── layouts/Base.astro         # estructura común de todas las páginas
│   ├── lib/                       # helpers (URLs, orden, desplegables) con sus tests
│   ├── pages/                     # portada, /proyectos/<id>/, /qr/ y 404
│   └── styles/global.css          # estilo "papel técnico" y modo oscuro
└── docs/superpowers/              # diseño y plan de implementación
```

## Publicación

Cada push a `main` dispara GitHub Actions, que corre `npm run ci` y, si todo pasa, publica en GitHub Pages. **Si el build falla, no se publica nada y el sitio anterior sigue online.**

Configuración única (la hace quien administra el repo): **Settings → Pages → Source: GitHub Actions**.

## Autor

[Fabrilez05](https://github.com/Fabrilez05) y el Club de Robótica de la FP-UNA.
