// Todas las rutas internas pasan por acá: el sitio vive bajo /CDR-showcase-congreso/
// en GitHub Pages, así que nunca se escriben rutas absolutas a mano.

export function url(path: string, base: string = import.meta.env.BASE_URL): string {
  const segmentos = [...base.split('/'), ...path.split('/')].filter(Boolean);
  const conBarraFinal = path === '' || path.endsWith('/');
  const ruta = '/' + segmentos.join('/');
  return conBarraFinal && ruta !== '/' ? ruta + '/' : ruta;
}

export function urlAbsoluta(
  path: string,
  site: string = import.meta.env.SITE,
  base: string = import.meta.env.BASE_URL,
): string {
  return new URL(url(path, base), site).href;
}
