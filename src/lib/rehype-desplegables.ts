import type { Element, ElementContent, Root, RootContent } from 'hast';

// Cada `##` del Markdown se convierte en un <details>: el h2 es el <summary> y todo
// lo que sigue hasta el próximo h2 va adentro. Así quien edita escribe Markdown normal.

const esH2 = (nodo: RootContent): nodo is Element => nodo.type === 'element' && nodo.tagName === 'h2';

export default function rehypeDesplegables() {
  return (tree: Root) => {
    const resultado: RootContent[] = [];
    let cuerpoActual: ElementContent[] | null = null;

    for (const nodo of tree.children) {
      if (esH2(nodo)) {
        cuerpoActual = [];
        resultado.push({
          type: 'element',
          tagName: 'details',
          properties: { className: ['desplegable'] },
          children: [
            { type: 'element', tagName: 'summary', properties: {}, children: nodo.children },
            { type: 'element', tagName: 'div', properties: { className: ['desplegable-cuerpo'] }, children: cuerpoActual },
          ],
        });
      } else if (cuerpoActual && nodo.type !== 'doctype') {
        cuerpoActual.push(nodo);
      } else {
        resultado.push(nodo);
      }
    }

    tree.children = resultado;
  };
}
