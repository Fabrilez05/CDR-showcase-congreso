import { describe, expect, it } from 'vitest';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import rehypeDesplegables from './rehype-desplegables';

const procesar = (html: string) =>
  unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeDesplegables)
    .use(rehypeStringify)
    .processSync(html)
    .toString();

describe('rehypeDesplegables', () => {
  it('envuelve cada h2 con su contenido', () => {
    expect(procesar('<h2>Pines</h2><p>a</p><h3>x</h3><h2>Modos</h2><p>b</p>')).toBe(
      '<details class="desplegable"><summary>Pines</summary><div class="desplegable-cuerpo"><p>a</p><h3>x</h3></div></details>' +
        '<details class="desplegable"><summary>Modos</summary><div class="desplegable-cuerpo"><p>b</p></div></details>',
    );
  });

  it('conserva lo anterior al primer h2', () => {
    expect(procesar('<p>intro</p><h2>A</h2><p>a</p>')).toMatch(/^<p>intro<\/p><details/);
  });

  it('sin h2 no cambia nada', () => {
    expect(procesar('<p>solo texto</p>')).toBe('<p>solo texto</p>');
  });

  it('h2 sin contenido genera cuerpo vacío', () => {
    expect(procesar('<h2>Vacío</h2>')).toBe(
      '<details class="desplegable"><summary>Vacío</summary><div class="desplegable-cuerpo"></div></details>',
    );
  });

  it('mantiene el formato inline del título', () => {
    expect(procesar('<h2>Modo <code>L1</code></h2>')).toContain('<summary>Modo <code>L1</code></summary>');
  });
});
