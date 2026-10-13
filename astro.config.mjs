import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Static output. Vercel serves it as-is (no adapter needed).
export default defineConfig({
  site: 'https://alisonzou.com',
  trailingSlash: 'never',
  integrations: [mdx()],
});
