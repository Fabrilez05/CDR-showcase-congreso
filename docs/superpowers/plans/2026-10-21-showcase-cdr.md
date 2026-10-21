# Showcase del CDR — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el `index.html` actual por un sitio Astro estático con una portada, una página por proyecto (destino de los QR) y una hoja de QR imprimible, publicado en GitHub Pages.

**Architecture:**
- El contenido vive en una colección de Astro con un Markdown por proyecto, validado con Zod.
- Los componentes `.astro` sin JS en el cliente renderizan portada, ficha y QR.
- Un plugin rehype convierte cada `##` del cuerpo en un `<details>`.
- GitHub Actions corre test → check → build → check-links y, si todo pasa, publica en Pages.

**Tech Stack:** Astro 7.4.x, Zod 4 (vía `astro/zod`), Vitest 5, `qrcode` 1.5, `@fontsource/barlow-condensed` 5, `withastro/action@v6`, `actions/deploy-pages@v5`, poppler (`pdftoppm`, `pdfseparate`) e ImageMagick (solo local, para extraer recursos).

**Spec:** `docs/superpowers/specs/2026-10-20-showcase-cdr-design.md`

## Global Constraints

- Node.js ≥ 22.22.0 y npm ≥ 9.6.5.
- `astro.config.mjs`: `site: 'https://fabrilez05.github.io'`, `base: '/CDR-showcase-congreso'`, salida estática.
- Todo link interno y todo recurso de `public/` pasa por `url()` (`src/lib/url.ts`). Nada de rutas absolutas escritas a mano.
- Sin JavaScript en el cliente. Sin React, Tailwind ni frameworks de UI.
- Colores del modo claro:
  - fondo `#f5f2e9`;
  - tinta `#163a86`;
  - tarjeta `#fffdf7`;
  - acento/kanji `#c8102e`;
  - cuadrícula de 16 px en tinta al 10 %.
- Colores del modo oscuro (`prefers-color-scheme: dark`):
  - fondo `#1c3f91`;
  - texto y bordes `#ffffff`;
  - cuadrícula en blanco al 12 %;
  - kanji `#ffc2c7`.
- Títulos en Barlow Condensed 900 itálica y mayúsculas. Cuerpo en la fuente del sistema. Cifras y pines en monoespaciada del sistema.
- Celular primero: margen lateral de 16 px y sin scroll horizontal de página. Las tablas hacen scroll dentro de su contenedor.
- Todo el texto visible va en español.
- Commits con el trailer de co-autoría de la sesión.

## Review Focus

- **Dos proyectos con el mismo `orden`:** el orden es determinista (desempate por `id`) y no cambia entre builds. → test en Task 3.
- **Cuerpo de Markdown sin ningún `##`** (ajedrez): no se crean desplegables vacíos ni falla el build. → test en Task 3.
- **Texto antes del primer `##`:** queda visible fuera de los desplegables, no se pierde. → test en Task 3.
- **`url()` con rutas con y sin barra inicial o final, y la raíz `/`:** nunca devuelve `//` ni pierde la base. → test en Task 1.
- **Imprimir `/qr/` desde un navegador en modo oscuro:** la hoja sale en blanco con QR negro y legible. → verificación con `emulateMedia print` + `dark` en Task 6.

---

### Task 1: Scaffold de Astro, helper `url()` y deploy mínimo en Pages

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `src/lib/url.ts`, `src/lib/url.test.ts`, `src/pages/index.astro` (temporal), `.github/workflows/deploy.yml`
- Modify: `.gitignore` (agregar `node_modules/`, `dist/`, `.astro/`)
- Delete: `index.html`

**Interfaces:**
- Produces:
  - `url(path: string, base?: string): string`. `base` usa por defecto `import.meta.env.BASE_URL`. Devuelve la ruta con la base antepuesta, exactamente una `/` entre segmentos y la barra final que traiga `path`.
  - `urlAbsoluta(path: string, site?: string, base?: string): string`. `site` usa por defecto `import.meta.env.SITE` y `base` el de `url()`. Equivale a `new URL(url(path, base), site).href`.
  - Scripts npm: `dev`, `build`, `preview`, `test` (`vitest run`), `check` (`astro check`), `ci` (lo completa Task 7; por ahora `npm test && astro check && astro build`).

- [ ] **Step 1: Instalar dependencias**

  ```bash
  npm init -y
  npm i astro@^7.4.1 @fontsource/barlow-condensed@^5 qrcode@^1.5.4
  npm i -D vitest@^5 @astrojs/check typescript @types/qrcode unified rehype-parse rehype-stringify @types/hast
  ```

  En `package.json` poner `"type": "module"`, `"private": true` y `"engines": { "node": ">=22.22.0" }`. `tsconfig.json` extiende `astro/tsconfigs/strict`.

- [ ] **Step 2: Escribir el test que falla, `src/lib/url.test.ts`**

  ```ts
  import { describe, expect, it } from 'vitest';
  import { url, urlAbsoluta } from './url';
  const B = '/CDR-showcase-congreso';
  describe('url', () => {
    it('raíz', () => { expect(url('/', B)).toBe('/CDR-showcase-congreso/'); expect(url('', B)).toBe('/CDR-showcase-congreso/'); });
    it('con y sin barra inicial', () => {
      expect(url('proyectos/raiden/', B)).toBe('/CDR-showcase-congreso/proyectos/raiden/');
      expect(url('/proyectos/raiden/', B)).toBe('/CDR-showcase-congreso/proyectos/raiden/');
    });
    it('base con barra final', () => { expect(url('/qr/', B + '/')).toBe('/CDR-showcase-congreso/qr/'); });
    it('archivo sin barra final', () => { expect(url('fichas/raiden.pdf', B)).toBe('/CDR-showcase-congreso/fichas/raiden.pdf'); });
    it('base raíz', () => { expect(url('/qr/', '/')).toBe('/qr/'); });
    it('nunca dobles barras', () => { expect(url('//qr//', B + '/')).not.toMatch(/\/\//); });
  });
  describe('urlAbsoluta', () => {
    it('combina site y base', () => {
      expect(urlAbsoluta('/proyectos/minos/', 'https://fabrilez05.github.io', B))
        .toBe('https://fabrilez05.github.io/CDR-showcase-congreso/proyectos/minos/');
    });
  });
  ```


- [ ] **Step 3: Correr `npx vitest run src/lib/url.test.ts`.** Esperado: FAIL (no existe el módulo `./url`).

- [ ] **Step 4: Implementar `src/lib/url.ts`** según las firmas de Interfaces. Separar por `/`, filtrar los segmentos vacíos, unirlos y conservar la barra final si `path` la tiene o es la raíz.

- [ ] **Step 5: Correr `npx vitest run`.** Esperado: todos PASS.

- [ ] **Step 6: Config, página temporal y workflow**

  - `astro.config.mjs`: `site`, `base` y `trailingSlash: 'always'`.
  - `src/pages/index.astro`: página temporal con `<h1>Proyectos del CDR</h1>`.
  - `.github/workflows/deploy.yml`:
    - se dispara con `push` a `main` y con `workflow_dispatch`;
    - permisos `contents: read`, `pages: write`, `id-token: write`;
    - `concurrency: pages`;
    - job `build` con `actions/checkout@v5` y `withastro/action@v6` (`build-cmd: npm run ci`);
    - job `deploy` con `needs: build`, environment `github-pages` y `actions/deploy-pages@v5`.
  - Borrar `index.html`.

- [ ] **Step 7: Correr `npm run ci`.** Esperado: tests PASS, `astro check` con 0 errores y `dist/index.html` generado.

- [ ] **Step 8: Activar Pages con GitHub Actions como fuente**

  ```bash
  gh api -X POST repos/Fabrilez05/CDR-showcase-congreso/pages -f build_type=workflow
  ```

  Esperado: JSON con `"build_type": "workflow"`. Si responde 409, ya existía: usar `-X PUT` con el mismo campo.

- [ ] **Step 9: Commit y push**

  `git add -A && git commit -m "Scaffold de Astro con deploy a GitHub Pages" && git push origin main`

- [ ] **Step 10: Verificar el deploy**

  `gh run watch` sobre la última ejecución, luego `curl -sI https://fabrilez05.github.io/CDR-showcase-congreso/ | head -1`.

  Esperado: el run termina en success y el `curl` devuelve `HTTP/2 200`.

---

### Task 2: Estilos globales, layout base y 404

**Files:**
- Create: `src/styles/global.css`, `src/layouts/Base.astro`, `src/pages/404.astro`, `public/favicon.svg`
- Modify: `src/pages/index.astro` (usar `Base`)

**Interfaces:**
- Consumes: `url()` de Task 1.
- Produces:
  - `Base.astro` con props `{ titulo: string; descripcion?: string; sinChrome?: boolean }` y un `<slot />`. Si `sinChrome` es `true`, no muestra header ni footer (lo usa `/qr/`).
  - Variables CSS: `--fondo`, `--tinta`, `--tarjeta`, `--acento`, `--cuadricula`, `--radio: 12px`, `--borde: 2px solid var(--tinta)`.
  - Clases globales:
    - `.contenedor`: max 1100 px, padding lateral de 16 px;
    - `.titulo-display`: Barlow Condensed 900 itálica, mayúsculas;
    - `.kanji`: color `--acento`;
    - `.etiqueta`: píldora con borde;
    - `.seccion-titulo`: mayúscula pequeña, `letter-spacing: .14em`, línea inferior;
    - `.tabla-scroll`: `overflow-x: auto`;
    - `.mono`.

- [ ] **Step 1: `global.css`**

  - Variables del modo claro en `:root` y del oscuro en `@media (prefers-color-scheme: dark) { :root { … } }`, con los valores de Global Constraints.
  - Fondo del `body`: `background-color: var(--fondo)` + dos `linear-gradient` de 1 px con `background-size: 16px 16px`.
  - Importar `@fontsource/barlow-condensed/900-italic.css`.
  - `:focus-visible` con un contorno de 3 px en `--acento`.
  - `img { max-width: 100%; height: auto; }`.

- [ ] **Step 2: `Base.astro`**

  - `<html lang="es">`, `<meta name="viewport">` y `<title>{titulo} · CDR FP-UNA</title>`.
  - `<meta name="description">` y `<meta name="color-scheme" content="light dark">`.
  - Favicon vía `url('favicon.svg')`.
  - Header: barra con "CDR · FP-UNA" (enlace a `url('/')`) y "22–24 OCT".
  - Footer: "Club de Robótica · Facultad Politécnica · Universidad Nacional de Asunción" y un link a `https://github.com/Fabrilez05/CDR-showcase-congreso`.
  - `favicon.svg`: cuadrado `#163a86` con "CDR" en blanco.

- [ ] **Step 3: `404.astro`**

  Usa `Base` con el título "Página no encontrada", el texto "Esta página no existe." y un link "← Volver a los proyectos" a `url('/')`.

- [ ] **Step 4: Correr `npm run ci`.** Esperado: PASS, con `dist/404.html` generado.

- [ ] **Step 5: Verificación visual**

  Abrir `npm run preview` con Playwright (o el navegador) a 390 px y 1280 px, en claro y oscuro (`emulateMedia({ colorScheme })`).

  Esperado:
  - fondo crema con cuadrícula en claro y azul con cuadrícula en oscuro;
  - título en Barlow itálica;
  - sin scroll horizontal (`document.documentElement.scrollWidth <= innerWidth`).

- [ ] **Step 6: Commit.** `git commit -m "Estilos papel técnico, layout base y 404"`

---

### Task 3: Colección de contenido, helpers de proyectos y plugin de desplegables

**Files:**
- Create: `src/content.config.ts`, `src/lib/proyectos.ts`, `src/lib/proyectos.test.ts`, `src/lib/rehype-desplegables.ts`, `src/lib/rehype-desplegables.test.ts`
- Modify: `astro.config.mjs` (`markdown.rehypePlugins: [rehypeDesplegables]`)

**Interfaces:**
- Produces:
  - Colección `proyectos`:
    - `defineCollection({ loader: glob({ pattern: '*.md', base: './src/content/proyectos' }), schema: ({ image }) => … })`;
    - campos y tipos **exactamente** como en la tabla de la sección 4 del spec;
    - restricciones: `resumen` con `.max(160)`, `cifras` con `.max(3)`, `extra` con `.default(false)`;
    - `video` y `pdf` son rutas relativas a `public/` sin `/` inicial (p. ej. `fichas/raiden.pdf`);
    - `enlaces[].url` con `z.url()`.
  - `type Categoria = 'sumobot' | 'micromouse' | 'futbot' | 'ajedrez' | 'otro'`.
  - `etiqueta(categoria: Categoria, nivel?: string): string`.
  - `separarYOrdenar<T extends { id: string; data: { extra: boolean; orden: number } }>(lista: T[]): { competencia: T[]; extras: T[] }`.
  - `rehypeDesplegables(): (tree: Root) => void` (export default). Envuelve cada `h2` de primer nivel y todo lo que lo sigue hasta el próximo `h2` en:

    ```html
    <details class="desplegable"><summary>…hijos del h2…</summary><div class="desplegable-cuerpo">…</div></details>
    ```

    Los nodos anteriores al primer `h2` quedan intactos.

- [ ] **Step 1: Escribir los tests que fallan, `src/lib/proyectos.test.ts`**

  ```ts
  const p = (id: string, orden: number, extra = false) => ({ id, data: { orden, extra } });
  it('separa y ordena por orden', () => {
    const r = separarYOrdenar([p('minos', 3), p('telemaco', 1, true), p('raiden', 1), p('taiho', 2)]);
    expect(r.competencia.map(x => x.id)).toEqual(['raiden', 'taiho', 'minos']);
    expect(r.extras.map(x => x.id)).toEqual(['telemaco']);
  });
  it('desempata por id de forma determinista', () => {
    expect(separarYOrdenar([p('b', 1), p('a', 1)]).competencia.map(x => x.id)).toEqual(['a', 'b']);
  });
  it('no muta la lista original', () => { const l = [p('b', 2), p('a', 1)]; separarYOrdenar(l); expect(l[0].id).toBe('b'); });
  it('etiquetas', () => {
    expect(etiqueta('sumobot', 'Pro')).toBe('Sumobot · Pro');
    expect(etiqueta('ajedrez')).toBe('Ajedrez inteligente');
    expect(etiqueta('micromouse')).toBe('Micromouse');
    expect(etiqueta('futbot', 'BLE')).toBe('Futbot · BLE');
    expect(etiqueta('otro', 'Juego')).toBe('Juego');
    expect(etiqueta('otro')).toBe('Proyecto');
  });
  ```

- [ ] **Step 2: Escribir los tests que fallan, `src/lib/rehype-desplegables.test.ts`**

  Usar el helper `procesar(html) = unified().use(rehypeParse, { fragment: true }).use(rehypeDesplegables).use(rehypeStringify).processSync(html).toString()`.

  ```ts
  it('envuelve cada h2 con su contenido', () => {
    expect(procesar('<h2>Pines</h2><p>a</p><h3>x</h3><h2>Modos</h2><p>b</p>')).toBe(
      '<details class="desplegable"><summary>Pines</summary><div class="desplegable-cuerpo"><p>a</p><h3>x</h3></div></details>' +
      '<details class="desplegable"><summary>Modos</summary><div class="desplegable-cuerpo"><p>b</p></div></details>');
  });
  it('conserva lo anterior al primer h2', () => {
    expect(procesar('<p>intro</p><h2>A</h2><p>a</p>')).toMatch(/^<p>intro<\/p><details/);
  });
  it('sin h2 no cambia nada', () => { expect(procesar('<p>solo texto</p>')).toBe('<p>solo texto</p>'); });
  it('h2 sin contenido genera cuerpo vacío', () => {
    expect(procesar('<h2>Vacío</h2>')).toBe('<details class="desplegable"><summary>Vacío</summary><div class="desplegable-cuerpo"></div></details>');
  });
  it('mantiene el formato inline del título', () => {
    expect(procesar('<h2>Modo <code>L1</code></h2>')).toContain('<summary>Modo <code>L1</code></summary>');
  });
  ```

  Si Astro deja nodos de texto `"\n"` entre bloques, deben quedar dentro del cuerpo. Los tests usan HTML sin saltos para fijar el resultado exacto.

- [ ] **Step 3: Correr `npx vitest run`.** Esperado: los dos archivos nuevos fallan porque los módulos no existen.

- [ ] **Step 4: Implementar `proyectos.ts` y `rehype-desplegables.ts`**

  - `proyectos.ts`: mapa de nombres `{ sumobot: 'Sumobot', micromouse: 'Micromouse', futbot: 'Futbot', ajedrez: 'Ajedrez inteligente', otro: 'Proyecto' }`. Para `otro` con `nivel`, devuelve solo el `nivel`.
  - `rehype-desplegables.ts`: recorre solo `tree.children` (no hace falta `unist-util-visit`).

- [ ] **Step 5: Correr `npx vitest run`.** Esperado: todos PASS.

- [ ] **Step 6: Escribir el esquema en `src/content.config.ts` y registrar el plugin**

  Importar `z` de `astro/zod`, `glob` de `astro/loaders` y `defineCollection` de `astro:content`. Registrar el plugin en `astro.config.mjs`.

- [ ] **Step 7: Probar el esquema con un proyecto inválido**

  Crear temporalmente `src/content/proyectos/prueba.md` sin `resumen` y correr `npx astro build`. Esperado: FAIL con un mensaje que menciona `prueba` y `resumen`. Borrar el archivo.

- [ ] **Step 8: Commit.** `git commit -m "Colección de proyectos, etiquetas, orden y plugin de desplegables"`

---

### Task 4: Componentes, portada y página de proyecto

**Files:**
- Create:
  - `src/components/TarjetaProyecto.astro`, `Placeholder.astro`, `CifrasClave.astro`, `FichaTecnica.astro`, `Video.astro`;
  - `src/pages/proyectos/[slug].astro`;
  - `src/content/proyectos/raiden.md` (contenido real, sirve de muestra);
  - `src/assets/proyectos/raiden/render.png` (lo extrae Task 5; mientras tanto se puede usar un recorte provisional).
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes:
  - `Base` (Task 2);
  - `url`, `etiqueta`, `separarYOrdenar` (Tasks 1 y 3);
  - `getCollection('proyectos')` y `render(entry)` de `astro:content`.
- Produces:
  - `TarjetaProyecto` con prop `{ proyecto: CollectionEntry<'proyectos'> }`;
  - `Placeholder` con prop `{ texto?: string }` (por defecto "Foto próximamente");
  - `CifrasClave` con prop `{ cifras: { valor: string; etiqueta: string }[] }`;
  - `FichaTecnica` con prop `{ specs: { nombre: string; valor: string }[] }`: un `<details class="desplegable" open>` con el summary "Ficha técnica completa";
  - `Video` con prop `{ src: string }`: `<video controls preload="metadata" playsinline>` con `src={url(src)}`.

- [ ] **Step 1: `raiden.md` de muestra**

  Frontmatter:
  - `nombre: Raiden`, `kanji: 雷電`, `categoria: sumobot`, `nivel: Pro`, `orden: 1`;
  - `resumen`: "Sumobot radiocontrolado con motores N20 de 3000 rpm y cuatro modos de manejo.";
  - `descripcion`: una o dos oraciones para el público general;
  - `portada: ../../assets/proyectos/raiden/render.png`;
  - `cifras`: `500 g`/Peso, `3000`/rpm, `PS3`/Control;
  - `specs`: las 10 filas de la ficha del PDF (spec §2);
  - `pdf: fichas/raiden.pdf`.

  Cuerpo:
  - `## Modos de manejo`: tabla L1 + cruceta, y el párrafo sobre R2;
  - `## Pines y electrónica`: tabla con izq. 12/13 y der. 27/14, `minPwm` 80;
  - `## Seguridad y estado`: se detiene al desconectarse el mando o al cambiar de modo; la reversa del motor derecho está en revisión.

- [ ] **Step 2: Componentes**

  - `TarjetaProyecto`:
    - todo el componente es un `<a href={url(`proyectos/${id}/`)}>`;
    - contiene un `<Image>` de `astro:assets` con `alt={`Imagen de ${nombre}`}`, `widths={[400, 800]}` y `sizes="(min-width: 900px) 540px, 100vw"`, o `Placeholder` si no hay portada;
    - abajo, el nombre (`.titulo-display`), el kanji, la etiqueta y el resumen.
  - Tablas generadas por Markdown: envolverlas en scroll con CSS (`.desplegable-cuerpo table { display: block; overflow-x: auto; }`).

- [ ] **Step 3: `index.astro`**

  Usa `Base` con el título "Proyectos". Contiene:
  - el título "Proyectos del CDR";
  - el subtítulo exacto del spec §5;
  - `.seccion-titulo` "Competencia" con las tarjetas de `competencia`;
  - `.seccion-titulo` "Extras" con las de `extras`, y la sección se omite si `extras` está vacío.

  Grilla de 1 columna, que pasa a 2 desde 900 px.

- [ ] **Step 4: `proyectos/[slug].astro`**

  `getStaticPaths` devuelve `params.slug = entry.id`. Orden de bloques según spec §5:
  1. "← Todos los proyectos";
  2. portada o `Placeholder`;
  3. nombre, kanji y etiqueta;
  4. descripción;
  5. `CifrasClave` (si hay cifras);
  6. `Video` (si hay video);
  7. `.seccion-titulo` "Para los curiosos", que se muestra si hay specs o cuerpo;
  8. `FichaTecnica` (si hay specs);
  9. `<Content />`;
  10. enlaces (`target="_blank" rel="noopener"`);
  11. botón "Descargar ficha técnica (PDF)" a `url(pdf)` (si hay pdf);
  12. "Equipo" (si hay equipo).

- [ ] **Step 5: Correr `npm run ci`.** Esperado: PASS, con `dist/proyectos/raiden/index.html` generado. `grep -c '<details class="desplegable"' dist/proyectos/raiden/index.html` debe dar 4 (ficha + 3 secciones).

- [ ] **Step 6: Verificación visual a 390 px y 1280 px, en claro y oscuro, de `/` y `/proyectos/raiden/`**

  Esperado:
  - coincide con los mockups elegidos (tarjetas grandes, ficha en capas);
  - los desplegables abren sin JS;
  - no hay scroll horizontal.

- [ ] **Step 7: Commit.** `git commit -m "Portada en lista y página de proyecto en capas"`

---

### Task 5: Recursos del PDF y contenido de los 6 proyectos

**Files:**
- Create:
  - `src/assets/proyectos/{raiden,taiho}/render.png` y `src/assets/proyectos/simon-dice/diagrama.png`;
  - `public/fichas/{taiho,raiden,simon-dice}.pdf`;
  - `src/content/proyectos/{taiho,minos,ajedrez,telemaco,simon-dice}.md`.

**Interfaces:**
- Consumes: el esquema de Task 3.

- [ ] **Step 1: Extraer imágenes**

  - Correr `pdftoppm -r 300 -png cdrrr.pdf <scratch>/p`.
  - Recortar con `magick` el render 3D de cada sumobot. Coordenadas aproximadas a 70 dpi: Raiden en la página 2 (x 15–165, y 70–172) y Taiho en la página 1 (x 420–568, y 70–172). A 300 dpi multiplicar por 4,29 y dejar margen para no cortar el robot.
  - Página 3 completa → `diagrama.png`.
  - Revisar visualmente cada recorte.

- [ ] **Step 2: Dividir el PDF**

  `pdfseparate -f 1 -l 1 cdrrr.pdf public/fichas/taiho.pdf`, y lo mismo para la página 2 (raiden) y la 3 (simon-dice). Revisar los tamaños con `ls -lh` y avisar si alguno supera 4 MB.

- [ ] **Step 3: Escribir los 5 `.md` restantes**

  Usar como fuentes el PDF y el README (spec §2). Valores fijos:

  | id | orden | extra | nivel | cifras | pdf | otros |
  | --- | --- | --- | --- | --- | --- | --- |
  | taiho | 2 | no | Amateur | 303 g / Peso, 600 / rpm, PS3 / Control | fichas/taiho.pdf | specs de la página 1 |
  | minos | 3 | no | — | 20 ms / Ciclo, 60 ms / Antirrebote, PID / Control | — | cuerpo: `## Cómo sigue la mano` (estados), `## Control PID`, `## Pines y electrónica`, `## Limitaciones`; la descripción menciona el laberinto de demostración |
  | ajedrez | 4 | no | — | — | — | `nombre: Ajedrez inteligente`; `descripcion: "Tablero de ajedrez inteligente. Pronto publicaremos más información."`; sin cuerpo |
  | telemaco | 1 | sí | BLE | 250 ms / Watchdog, BLE / Conexión, Web / Control | — | `enlaces: [{ texto: "Joystick web (hermes-ble-joystick)", url: https://github.com/Fabrilez05/hermes-ble-joystick }]`; cuerpo: `## Protocolo BLE`, `## Mezcla diferencial`, `## Pines`, `## Seguridad` |
  | simon-dice | 2 | sí | Juego | — | fichas/simon-dice.pdf | `categoria: otro`; `portada: diagrama.png`; cuerpo: `## Componentes` (LEDs, buzzer, ESP32, botones, botón de dificultad) |

  Ningún proyecto lleva `equipo` (placeholder del spec).

- [ ] **Step 4: Correr `npm run ci`.** Esperado: PASS, con 6 páginas en `dist/proyectos/*/index.html`.

- [ ] **Step 5: Revisar las 6 páginas a 390 px.** Esperado: textos sin errores de tipeo, kanji solo en Taiho y Raiden, y placeholders en Minos, ajedrez y Telemaco.

- [ ] **Step 6: Commit.** `git commit -m "Contenido de los 6 proyectos y recursos de las fichas"`

---

### Task 6: Hoja de QR imprimible

**Files:**
- Create: `src/pages/qr.astro`

**Interfaces:**
- Consumes:
  - `urlAbsoluta` (Task 1);
  - `separarYOrdenar` (Task 3);
  - `Base` con `sinChrome` (Task 2);
  - `QRCode.toString(texto, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } })` de `qrcode`.

- [ ] **Step 1: `qr.astro`**

  - Usa `Base` con `titulo="QR"` y `sinChrome`.
  - Grilla de celdas (competencia y luego extras). Cada celda tiene:
    - el SVG del QR (`set:html`) a 45 mm de ancho;
    - el nombre y el kanji;
    - la URL sin `https://`.
  - CSS:
    - `@media print { body { background: #fff !important; color: #000 !important } .celda { break-inside: avoid } }`;
    - `@page { size: A4; margin: 10mm }`;
    - en pantalla, 2 columnas en celular y 3 en escritorio.

- [ ] **Step 2: Correr `npm run ci`.** Esperado: PASS. `grep -c '<svg' dist/qr/index.html` da 6.

- [ ] **Step 3: Verificar que los QR decodifican**

  Hacer una captura de `/qr/` y decodificarla (con `zbarimg` si está instalado, si no con el lector del celular). Esperado: 6 URLs que coinciden con `https://fabrilez05.github.io/CDR-showcase-congreso/proyectos/<slug>/`.

- [ ] **Step 4: Verificar la impresión**

  Generar el PDF de la página con Playwright `page.pdf({ format: 'A4' })` tras `emulateMedia({ media: 'print', colorScheme: 'dark' })`. Esperado: fondo blanco, QR negro y ninguna celda partida entre páginas.

- [ ] **Step 5: Commit.** `git commit -m "Hoja de QR imprimible"`

---

### Task 7: Verificación de links, CI completo y README

**Files:**
- Create: `scripts/check-links.mjs`
- Modify: `package.json` (`ci`), `README.md`

**Interfaces:**
- Produces: `node scripts/check-links.mjs [dir=dist]`. Termina con código 1 y lista `archivo → href` si algún `href` o `src` interno no resuelve a un archivo en `dist/`.

- [ ] **Step 1: `check-links.mjs`**

  - Recorre los `.html` de `dist/` y extrae `href`/`src`/`srcset` con una regex.
  - Ignora `http(s):`, `mailto:` y `#…`.
  - Exige que la ruta empiece con `/CDR-showcase-congreso/`.
  - Quita la base y resuelve contra `dist/`: si termina en `/`, busca `index.html`.

- [ ] **Step 2: Probar que detecta errores**

  Agregar a mano `<a href="/CDR-showcase-congreso/no-existe/">` en un HTML de `dist/` y correr el script. Esperado: exit 1 con ese href listado. Correrlo de nuevo tras `npm run build`. Esperado: exit 0.

- [ ] **Step 3: Completar el script `ci`**

  `"ci": "npm test && astro check && astro build && node scripts/check-links.mjs"`. Correr `npm run ci`. Esperado: PASS.

- [ ] **Step 4: README**

  - Sacar la documentación de los robots (ya vive en los `.md`).
  - Dejar:
    - intro y URL del sitio;
    - "Requisitos para desarrollar el sitio" (ya existe);
    - "Desarrollo local" (`npm install`, `npm run dev`, `npm run ci`);
    - "Agregar o editar un proyecto": campos del frontmatter, que cada `##` es un desplegable, dónde van las imágenes y los videos;
    - "Imprimir los QR" (`/qr/`);
    - estructura del repo;
    - "Publicación" (automática con GitHub Actions; si el build falla, el sitio anterior sigue online);
    - autor.

- [ ] **Step 5: Commit.** `git commit -m "Verificación de links en CI y README actualizado"`

---

### Task 8: Verificación final y publicación

- [ ] **Step 1: Correr `npm run ci`.** Esperado: PASS de punta a punta.

- [ ] **Step 2: Capturas finales**

  A 390 px y 1280 px, en claro y oscuro, de `/`, `/proyectos/raiden/`, `/proyectos/ajedrez/` (caso sin datos) y `/qr/`. Esperado: sin scroll horizontal y con contraste legible.

- [ ] **Step 3: Push**

  `git push origin main` y `gh run watch`. Esperado: los jobs build y deploy en success.

- [ ] **Step 4: Verificar la URL publicada**

  `for p in "" proyectos/{raiden,taiho,minos,ajedrez,telemaco,simon-dice}/ qr/ fichas/raiden.pdf; do curl -s -o /dev/null -w "%{http_code} $p\n" https://fabrilez05.github.io/CDR-showcase-congreso/$p; done`

  Esperado: todas devuelven 200.
