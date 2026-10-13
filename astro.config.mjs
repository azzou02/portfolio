import { defineConfig } from 'astro/config';

// Static output. Vercel serves it as-is (no adapter needed).
export default defineConfig({
  site: 'https://alisonzou.com',
  trailingSlash: 'never',
});
