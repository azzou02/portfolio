# alisonzou.com (Astro rebuild)

Static Astro site, plain JavaScript. Deploys to Vercel with no adapter.

- `npm install`, `npm run dev`, `npm run build`
- Design tokens: `src/styles/tokens.css` (from the Figma file "portfolio", page "version 3")
- Layout and chrome: `src/layouts/Base.astro`, `src/components/{Ticker,Nav,Footer}.astro`
- Redirects for retired pages: `vercel.json`

## Fonts
- JejuMyeongjo: Latin subset at `public/fonts/jeju-myeongjo-latin.woff2`. Replace it with the font file from the original source once its license is confirmed.
- DM Sans, JetBrains Mono, Instrument Serif: self-hosted through Fontsource.
