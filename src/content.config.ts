import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Rutas relativas al .md, igual que portada (p. ej. "../../assets/proyectos/raiden/ficha.pdf").
const rutaAsset = z.string().regex(/^\.\.\/\.\.\/assets\//, 'Debe empezar con ../../assets/ (relativa al .md)');

const proyectos = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/proyectos' }),
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      kanji: z.string().optional(),
      categoria: z.enum(['sumobot', 'micromouse', 'futbot', 'ajedrez', 'otro']),
      nivel: z.string().optional(),
      extra: z.boolean().default(false),
      orden: z.number(),
      resumen: z.string().max(160),
      descripcion: z.string(),
      portada: image().optional(),
      video: rutaAsset.optional(),
      cifras: z.array(z.object({ valor: z.string(), etiqueta: z.string() })).max(3).optional(),
      specs: z.array(z.object({ nombre: z.string(), valor: z.string() })).optional(),
      pdf: rutaAsset.optional(),
      enlaces: z.array(z.object({ texto: z.string(), url: z.url() })).optional(),
      equipo: z.array(z.string()).optional(),
    }),
});

export const collections = { proyectos };
