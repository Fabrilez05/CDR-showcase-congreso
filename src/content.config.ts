import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Rutas relativas a public/, sin "/" inicial (p. ej. "fichas/raiden.pdf").
const rutaPublica = z.string().regex(/^[^/]/, 'Debe ser relativa a public/, sin "/" inicial');

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
      video: rutaPublica.optional(),
      cifras: z.array(z.object({ valor: z.string(), etiqueta: z.string() })).max(3).optional(),
      specs: z.array(z.object({ nombre: z.string(), valor: z.string() })).optional(),
      pdf: rutaPublica.optional(),
      enlaces: z.array(z.object({ texto: z.string(), url: z.url() })).optional(),
      equipo: z.array(z.string()).optional(),
    }),
});

export const collections = { proyectos };
