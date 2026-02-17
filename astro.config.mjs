import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://portfolio-website-9c9.pages.dev/',
  integrations: [tailwind(), mdx(), sitemap()],
  output: 'static'
});
