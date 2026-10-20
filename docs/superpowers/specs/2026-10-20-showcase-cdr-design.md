# Showcase del CDR para el 25.º Congreso Internacional de Mecatrónica — Diseño

- **Fecha:** 2026-10-20
- **Evento:** 25.º Congreso Internacional de Mecatrónica (Asociación Mexicana de Mecatrónica), UDM, México, del 22 al 24 de octubre de 2026.
- **Club:** CDR, Club de Robótica de la Facultad Politécnica de la Universidad Nacional de Asunción (FP-UNA), Paraguay.
- **Repo:** `Fabrilez05/CDR-showcase-congreso` (público).
- **URL final:** `https://fabrilez05.github.io/CDR-showcase-congreso/`

## 1. Objetivo y criterios de éxito

Sitio web que muestra los proyectos que el CDR lleva al congreso.

- **Público principal:** visitantes del stand que escanean un QR con el celular.
- **Público secundario:** personas con perfil técnico que quieren el detalle (specs, pines, control).
- **Después del congreso:** sigue sirviendo como portafolio del club.

**Éxito:**

1. Al escanear el QR de un robot, el visitante entiende en ~10 segundos qué es y qué hace.
2. Quien quiera profundizar encuentra la ficha técnica completa en la misma página.
3. Cualquier miembro del club agrega o edita un proyecto editando un archivo Markdown, sin tocar HTML.
4. Un error en el contenido nunca deja el sitio caído: el sitio anterior sigue publicado.
5. El sitio está publicado y probado antes del 22 de octubre.

## 2. Proyectos

| Slug | Nombre | Kanji | Categoría | Nivel / nota | Sección |
| --- | --- | --- | --- | --- | --- |
| `raiden` | Raiden | 雷電 | Sumobot | Pro | Competencia |
| `taiho` | Taiho | 大鵬 | Sumobot | Amateur | Competencia |
| `minos` | Minos | — | Micromouse | Con laberinto de demostración | Competencia |
| `ajedrez` | Ajedrez inteligente (nombre provisorio) | — | Ajedrez | Sin información aún | Competencia |
| `telemaco` | Telemaco | — | Futbot | Control BLE con joystick web | Extras |
| `simon-dice` | Simón dice | — | Juego | ESP32, LEDs, buzzer | Extras |

**Fuentes de contenido:**

- `cdrrr.pdf` (fichas de Taiho, Raiden y Simón dice).
- `README.md` (Telemaco, Minos, Raiden).
- Repo `Fabrilez05/hermes-ble-joystick` (link desde Telemaco).

**Placeholders explícitos:**

- Descripción del ajedrez.
- Autores o equipo de cada proyecto.
- Fotos y videos (llegan durante el congreso).

## 3. Arquitectura

**Stack:**

- **Astro 7** (≥ 7.4) con salida estática y componentes `.astro`.
- CSS propio con variables. Sin React, Tailwind ni otros frameworks de UI.
- **Requisitos de desarrollo:** Node.js ≥ 22.22.0 y npm ≥ 9.6.5. Ya están documentados en el README.

**Hosting:**

- GitHub Pages con Source "GitHub Actions".
- Workflow `.github/workflows/deploy.yml` con `withastro/action`, que se dispara con cada push a `main`.
- `astro.config.mjs` define `site: 'https://fabrilez05.github.io'` y `base: '/CDR-showcase-congreso'`.
- **Todos los links internos y recursos de `public/` pasan por un helper que antepone la base.** Nunca se escriben rutas absolutas a mano.

### Estructura de archivos

```
.
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── .github/workflows/deploy.yml
├── public/
│   ├── fichas/             # taiho.pdf, raiden.pdf, simon-dice.pdf (una página cada uno)
│   ├── videos/             # clips .mp4 (cuando existan)
│   └── favicon.svg
├── scripts/
│   └── check-links.mjs     # verifica links internos en dist/
├── src/
│   ├── content.config.ts   # colección "proyectos" + esquema
│   ├── content/proyectos/  # un .md por proyecto
│   ├── assets/proyectos/   # imágenes por proyecto (las optimiza Astro)
│   ├── components/         # TarjetaProyecto, CifrasClave, FichaTecnica, Placeholder, Video
│   ├── layouts/Base.astro  # <head>, header, footer, estilos globales
│   ├── lib/                # url.ts, proyectos.ts, rehype-desplegables.ts (+ tests)
│   ├── pages/
│   │   ├── index.astro             # portada
│   │   ├── proyectos/[slug].astro  # una página por proyecto (destino del QR)
│   │   ├── qr.astro                # hoja imprimible de QR
│   │   └── 404.astro
│   └── styles/global.css   # tokens de color, tipografía, cuadrícula
└── README.md
```

Se elimina el `index.html` anterior. `cdrrr.pdf` queda en la raíz como fuente original (no se publica); el sitio usa los tres PDF de `public/fichas/`.

## 4. Modelo de contenido

Colección `proyectos` (loader `glob` sobre `src/content/proyectos/*.md`). El esquema se valida con Zod al compilar.

| Campo | Tipo | Obligatorio | Uso |
| --- | --- | --- | --- |
| `nombre` | string | sí | Título |
| `kanji` | string | no | Se muestra en rojo junto al nombre |
| `categoria` | enum `sumobot` \| `micromouse` \| `futbot` \| `ajedrez` \| `otro` | sí | Etiqueta |
| `nivel` | string | no | Se agrega a la etiqueta ("Sumobot · Pro") |
| `extra` | boolean (por defecto `false`) | no | `true` → sección "Extras" |
| `orden` | number | sí | Orden dentro de su sección (ascendente) |
| `resumen` | string (≤ 160 caracteres) | sí | Una línea en la tarjeta de la portada |
| `descripcion` | string | sí | Párrafo para el público general en la página del proyecto |
| `portada` | image() | no | Imagen de tarjeta y cabecera; sin ella → placeholder |
| `video` | string (ruta dentro de `public/`) | no | Sin video → no se muestra el bloque |
| `cifras` | lista de `{ valor, etiqueta }`, máx. 3 | no | Las 3 cifras clave |
| `specs` | lista de `{ nombre, valor }` | no | Desplegable "Ficha técnica completa" |
| `pdf` | string (ruta dentro de `public/`) | no | Botón "Descargar ficha técnica (PDF)" |
| `enlaces` | lista de `{ texto, url }` | no | Links externos (p. ej. hermes-ble-joystick) |
| `equipo` | lista de string | no | Placeholder hasta tener los nombres |

**Cuerpo del Markdown:** el detalle técnico libre. **Cada encabezado `##` se convierte en un desplegable** (`<details>`): el `##` es el título y todo lo que sigue, hasta el próximo `##`, es el contenido. Lo hace el plugin `rehype-desplegables`, así quien edita solo escribe Markdown normal.

## 5. Páginas

### Portada (`/`)

1. Barra superior: "CDR · FP-UNA" y "22–24 OCT".
2. Título "Proyectos del CDR" y subtítulo: "Club de Robótica de la Facultad Politécnica (UNA, Paraguay) en el 25.º Congreso Internacional de Mecatrónica".
3. Sección **Competencia**: lista de tarjetas grandes a todo el ancho (imagen, nombre, kanji, etiqueta y resumen). Cada tarjeta enlaza a su página.
4. Sección **Extras**: el mismo formato de tarjeta.
5. Footer: CDR, FP-UNA, link a GitHub.

En pantallas anchas (≥ 900 px) las tarjetas pasan a una grilla de 2 columnas. El ancho máximo del contenido es de ~1100 px.

### Página de proyecto (`/proyectos/<slug>/`)

Organizada en capas:

1. "← Todos los proyectos".
2. Imagen de portada o placeholder.
3. Nombre, kanji y etiqueta.
4. Descripción para el público general.
5. Cifras clave (hasta 3 casillas).
6. Video, si existe.
7. **"Para los curiosos":**
   - desplegable "Ficha técnica completa" (generado desde `specs`, abierto por defecto);
   - un desplegable por cada `##` del cuerpo (cerrados por defecto).
8. Enlaces externos y botón del PDF, si existen.
9. Equipo, si existe.

### QR (`/qr/`)

- Hoja pensada para imprimir en A4: una celda por proyecto con el QR (SVG), el nombre, el kanji y la URL corta.
- Los QR se generan **al compilar** con el paquete `qrcode`, a partir de `site + base + /proyectos/<slug>/`.
- Hay CSS de impresión: sin header ni footer, celdas sin cortes de página y fondo blanco.

### 404

Página con el mismo estilo y un link a la portada.

## 6. Diseño visual

**Estilo "papel técnico"** (variante C, elegida en los mockups):

- **Modo claro:**
  - fondo crema `#f5f2e9` con cuadrícula de 16 px en azul al 10 %;
  - tinta `#163a86`;
  - tarjetas `#fffdf7` con borde de 2 px en tinta;
  - kanji y acentos en rojo `#c8102e`.
- **Modo oscuro** (`prefers-color-scheme: dark`), plano azul (variante A):
  - fondo `#1c3f91` con cuadrícula blanca al 12 %;
  - texto y bordes blancos;
  - kanji en rojo claro `#ffc2c7`, con contraste AA sobre el azul.
- Todos los colores son variables CSS en `:root`, redefinidas en el bloque oscuro.
- **Tipografía:**
  - nombres y títulos en **Barlow Condensed 900 itálica**, en mayúsculas, autoalojada con `@fontsource/barlow-condensed`;
  - cuerpo en la fuente del sistema;
  - cifras, pines y valores en monoespaciada del sistema;
  - kanji con la fuente CJK del sistema.
- **Placeholder de imagen o video:** rayado diagonal en tinta al 7 % con el texto "Foto próximamente".
- **Accesibilidad:**
  - contraste AA en los dos modos;
  - `alt` en todas las imágenes;
  - foco visible;
  - los desplegables son `<details>` nativos, así que funcionan sin JavaScript.
- **Celular primero:** márgenes laterales de 16 px y sin scroll horizontal. Las tablas anchas hacen scroll dentro de su contenedor.
- **JavaScript en el cliente:** ninguno.

## 7. Recursos iniciales

- **Renders de Taiho y Raiden:** se recortan de las páginas del PDF renderizadas a 300 dpi y se guardan en `src/assets/proyectos/<slug>/render.png`.
- **Diagrama de Simón dice:** se toma de la página 3 del PDF.
- **PDF por ficha:** `pdfseparate` sobre `cdrrr.pdf` (página 1 → taiho, 2 → raiden, 3 → simon-dice). Si algún PDF resultante supera 4 MB, se informa y se publica igual.

## 8. Manejo de errores

- **Campo inválido u obligatorio faltante:** `astro build` falla y Zod indica el archivo y el campo.
- **Imagen referenciada que no existe:** el build falla.
- **Opcionales ausentes** (portada, video, cifras, specs, pdf, enlaces, equipo): se omite el bloque, salvo la portada, que muestra el placeholder.
- **Deploy:** el job de publicación depende del job de build. Si el build falla, Pages mantiene la versión anterior.
- **Links internos rotos en `dist/`:** `scripts/check-links.mjs` termina con error. Corre en CI antes de publicar.

## 9. Verificación

- **Tests unitarios (Vitest)** para `src/lib/`:
  - `url()` antepone la base correctamente, con y sin barra final;
  - `proyectos.ts` separa competencia y extras y los ordena por `orden`;
  - `rehype-desplegables` convierte las secciones `##` en `<details>`.
- `astro check` sin errores.
- `astro build` sin errores ni advertencias de contenido.
- `node scripts/check-links.mjs` sin errores.
- Revisión visual con capturas a 390 px y 1280 px de ancho, en modo claro y oscuro, de la portada, una página de proyecto y `/qr/`.
- Después del deploy, `curl` a la URL publicada devuelve 200 en la portada, en cada `/proyectos/<slug>/` y en `/qr/`.
- El script `npm test` corre Vitest. En CI van, en orden: test, check, build y verificación de links, y solo entonces se publica.

## 10. Fuera de alcance

- Filtros o búsqueda en la portada.
- Varios idiomas.
- Interruptor manual de modo oscuro (se sigue al sistema).
- Analítica, formularios y backend.
- Página "sobre el club" y galería de fotos por proyecto (más de una imagen).

## 11. Orden de implementación (resumen)

1. Scaffold de Astro, workflow y **deploy mínimo en Pages el mismo día** para validar la publicación.
2. Estilos globales, layout y componentes.
3. Modelo de contenido, plugin de desplegables y helpers, con sus tests.
4. Contenido de los 6 proyectos y recursos extraídos del PDF.
5. Página de QR, 404 y README actualizado.
6. Verificación completa y deploy final.
