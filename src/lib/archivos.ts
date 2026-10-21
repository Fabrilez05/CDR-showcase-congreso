// PDF y videos viven junto a las imágenes, en src/assets/proyectos/<id>/.
// Vite los copia al build (con hash en el nombre) y acá se traduce la ruta
// escrita en el frontmatter a la URL final.

const CONTENIDO = '/src/content/proyectos/';

const archivos = import.meta.glob<string>('/src/assets/proyectos/**/*.{pdf,mp4,webm}', {
  query: '?url',
  import: 'default',
  eager: true,
});

// "../../assets/proyectos/raiden/ficha.pdf" (relativa al .md) → "/src/assets/proyectos/raiden/ficha.pdf"
export function claveArchivo(ruta: string): string {
  return decodeURIComponent(new URL(ruta, 'file://' + CONTENIDO).pathname);
}

export function urlArchivo(ruta: string): string {
  const encontrado = archivos[claveArchivo(ruta)];
  if (!encontrado) throw new Error(`No existe el archivo "${ruta}" (se buscó en ${claveArchivo(ruta)})`);
  return encontrado;
}
