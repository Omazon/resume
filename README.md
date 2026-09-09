# Omar Boza — Resume / Portfolio

Personal resume and portfolio site optimized for humans, ATS systems, and AI crawlers.

**Live:** [omazon.github.io/resume](https://omazon.github.io/resume/)

## Stack

- Static HTML
- [Tailwind CSS 4](https://tailwindcss.com/)
- GSAP + ScrollTrigger (CDN) for scroll-driven motion, contextual cursor, and pointer depth; pure-WebGL amber light field in the hero (CSS gradient fallback)
- Structured data: JSON-LD, [JSON Resume](https://jsonresume.org/) (`resume.json`), [llms.txt](https://llmstxt.org/)

## Development

```bash
npm install
npm run watch:css   # dev — rebuild CSS on change
npm run build       # production CSS build
npm run build:pdf   # generate PDF (requires puppeteer)
```

## Project structure

```
index.html              Main site
resume.json             Machine-readable resume (JSON Resume schema)
llms.txt                Summary for LLM crawlers
robots.txt              Crawler rules (includes AI bots)
sitemap.xml             Sitemap
src/input.css           Tailwind source
assets/css/             Compiled CSS
assets/js/site.js       Nav, cursor, GSAP masks/parallax, pinned horizontal section, count-ups
assets/js/hero-scene.js WebGL light-field background (no library)
scripts/build-pdf.js    PDF generator
```

## Deploy

Pushes to `main` deploy automatically via GitHub Actions to GitHub Pages.

Enable Pages in repo settings: **Settings → Pages → Source: GitHub Actions**.

## ATS / AI parsing

- `/resume.json` — full structured resume
- `/llms.txt` — plain-text summary for LLMs
- JSON-LD `Person` + work history in `<head>`
- Download PDF via hero button or `/assets/Omar-Boza-Resume.pdf`

## License

ISC
