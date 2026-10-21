import { describe, expect, it } from 'vitest';
import { url, urlAbsoluta } from './url';

const B = '/CDR-showcase-congreso';

describe('url', () => {
  it('raíz', () => {
    expect(url('/', B)).toBe('/CDR-showcase-congreso/');
    expect(url('', B)).toBe('/CDR-showcase-congreso/');
  });

  it('con y sin barra inicial', () => {
    expect(url('proyectos/raiden/', B)).toBe('/CDR-showcase-congreso/proyectos/raiden/');
    expect(url('/proyectos/raiden/', B)).toBe('/CDR-showcase-congreso/proyectos/raiden/');
  });

  it('base con barra final', () => {
    expect(url('/qr/', B + '/')).toBe('/CDR-showcase-congreso/qr/');
  });

  it('archivo sin barra final', () => {
    expect(url('fichas/raiden.pdf', B)).toBe('/CDR-showcase-congreso/fichas/raiden.pdf');
  });

  it('base raíz', () => {
    expect(url('/qr/', '/')).toBe('/qr/');
  });

  it('nunca dobles barras', () => {
    expect(url('//qr//', B + '/')).not.toMatch(/\/\//);
  });
});

describe('urlAbsoluta', () => {
  it('combina site y base', () => {
    expect(urlAbsoluta('/proyectos/minos/', 'https://fabrilez05.github.io', B)).toBe(
      'https://fabrilez05.github.io/CDR-showcase-congreso/proyectos/minos/',
    );
  });
});
