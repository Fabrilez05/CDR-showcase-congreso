// Verifica que todos los links internos del sitio compilado apunten a archivos que existen.
// Uso: node scripts/check-links.mjs [dir=dist]
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, posix, relative, sep } from 'node:path';

const BASE = '/CDR-showcase-congreso/';
const dir = process.argv[2] ?? 'dist';

function* archivosHtml(carpeta) {
  for (const nombre of readdirSync(carpeta)) {
    const ruta = join(carpeta, nombre);
    if (statSync(ruta).isDirectory()) yield* archivosHtml(ruta);
    else if (nombre.endsWith('.html')) yield ruta;
  }
}

function enlaces(html) {
  const encontrados = [];
  for (const [, attr, valor] of html.matchAll(/\s(href|src|srcset)="([^"]*)"/g)) {
    const valores = attr === 'srcset' ? valor.split(',').map((v) => v.trim().split(/\s+/)[0]) : [valor];
    encontrados.push(...valores.filter(Boolean));
  }
  return encontrados;
}

const esExterno = (href) => /^(https?:|mailto:|tel:|data:|#)/.test(href);

// Ruta pública de la página (p. ej. /CDR-showcase-congreso/proyectos/taiho/) para resolver links relativos.
function rutaDePagina(archivo) {
  const rel = relative(dir, archivo).split(sep).join('/');
  return BASE + rel.replace(/index\.html$/, '');
}

function existe(rutaAbsoluta) {
  const sinQuery = decodeURIComponent(rutaAbsoluta.split(/[?#]/)[0]);
  if (!sinQuery.startsWith(BASE)) return false;
  const local = join(dir, sinQuery.slice(BASE.length));
  if (sinQuery.endsWith('/')) return existsSync(join(local, 'index.html'));
  return existsSync(local);
}

const rotos = [];
for (const archivo of archivosHtml(dir)) {
  const pagina = rutaDePagina(archivo);
  for (const href of enlaces(readFileSync(archivo, 'utf8'))) {
    if (esExterno(href)) continue;
    const absoluta = href.startsWith('/') ? href : posix.join(posix.dirname(pagina + 'x'), href) + (href.endsWith('/') ? '/' : '');
    if (!existe(absoluta)) rotos.push(`${relative(dir, archivo)} → ${href}`);
  }
}

if (rotos.length) {
  console.error(`Links internos rotos (${rotos.length}):\n` + rotos.map((r) => `  ${r}`).join('\n'));
  process.exit(1);
}
console.log('Links internos OK');
