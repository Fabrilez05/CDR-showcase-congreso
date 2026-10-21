import { describe, expect, it } from 'vitest';
import { etiqueta, separarYOrdenar } from './proyectos';

const p = (id: string, orden: number, extra = false) => ({ id, data: { orden, extra } });

describe('separarYOrdenar', () => {
  it('separa y ordena por orden', () => {
    const r = separarYOrdenar([p('minos', 3), p('telemaco', 1, true), p('raiden', 1), p('taiho', 2)]);
    expect(r.competencia.map((x) => x.id)).toEqual(['raiden', 'taiho', 'minos']);
    expect(r.extras.map((x) => x.id)).toEqual(['telemaco']);
  });

  it('desempata por id de forma determinista', () => {
    expect(separarYOrdenar([p('b', 1), p('a', 1)]).competencia.map((x) => x.id)).toEqual(['a', 'b']);
  });

  it('no muta la lista original', () => {
    const l = [p('b', 2), p('a', 1)];
    separarYOrdenar(l);
    expect(l[0].id).toBe('b');
  });
});

describe('etiqueta', () => {
  it('combina categoría y nivel', () => {
    expect(etiqueta('sumobot', 'Pro')).toBe('Sumobot · Pro');
    expect(etiqueta('futbot', 'BLE')).toBe('Futbot · BLE');
  });

  it('categoría sola', () => {
    expect(etiqueta('ajedrez')).toBe('Ajedrez inteligente');
    expect(etiqueta('micromouse')).toBe('Micromouse');
  });

  it('otro usa solo el nivel', () => {
    expect(etiqueta('otro', 'Juego')).toBe('Juego');
    expect(etiqueta('otro')).toBe('Proyecto');
  });
});
