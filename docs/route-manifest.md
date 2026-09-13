# Production route check

The Astro astro:build:done integration records the pages and assets from each
production build in the ignored .astro/route-manifest.json report. The report
uses Astro's resolved output directory, so it remains valid when the adapter or
build layout changes. pnpm test:routes checks that Astro's generated pages have
emitted HTML files, generated assets exist, and the development-only fixture is
absent from production and the sitemap. The check prints the complete generated
route list for review.
