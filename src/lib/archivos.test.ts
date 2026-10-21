import { describe, expect, it } from 'vitest';
import { claveArchivo, urlArchivo } from './archivos';

describe('claveArchivo', () => {
  it('resuelve relativo a src/content/proyectos/', () => {
    expect(claveArchivo('../../assets/proyectos/raiden/ficha.pdf')).toBe('/src/assets/proyectos/raiden/ficha.pdf');
  });

  it('acepta espacios y tildes', () => {
    expect(claveArchivo('../../assets/proyectos/simon-dice/ficha técnica.pdf')).toBe(
      '/src/assets/proyectos/simon-dice/ficha técnica.pdf',
    );
  });
});

describe('urlArchivo', () => {
  it('encuentra un PDF existente', () => {
    expect(urlArchivo('../../assets/proyectos/raiden/ficha.pdf')).toMatch(/ficha.*\.pdf$/);
  });

  it('falla si el archivo no existe', () => {
    expect(() => urlArchivo('../../assets/proyectos/raiden/no-existe.pdf')).toThrow(/No existe/);
  });
});
