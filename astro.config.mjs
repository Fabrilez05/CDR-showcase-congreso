// @ts-check
import { defineConfig } from 'astro/config';
import rehypeDesplegables from './src/lib/rehype-desplegables.ts';

export default defineConfig({
  site: 'https://fabrilez05.github.io',
  base: '/CDR-showcase-congreso',
  trailingSlash: 'always',
  markdown: {
    rehypePlugins: [rehypeDesplegables],
  },
});
