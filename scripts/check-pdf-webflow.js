#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PDF = path.join(ROOT, 'assets', 'Omar-Boza-Resume-Webflow.pdf');

const REQUIRED_SNIPPETS = [
  'Omar Boza',
  'Webflow Developer',
  'approximately 3 years',
  'Figma-to-Webflow',
  'Client-First',
  'Webflow CMS',
  'Webflow Localization',
  'Custom Code Embeds',
  'GSAP',
  'Finsweet Attributes',
  'HubSpot Tracking',
  'Google Analytics',
  'Google Tag Manager',
  'Mailchimp Webhooks',
  'WordPress-to-Webflow Migration',
  'Core Web Vitals',
  'Webflow MCP',
  'three concurrent projects',
  '20-30 minutes',
  'Juno Counseling',
  'Elevare Dental',
  'RapiStaffing',
  'Your Digital Resource',
  'Advanced Custom Fields (ACF)',
  'Sucuri',
  'Shopify',
  'EF SET C2',
  'cert.efset.org/B6TnCM',
];

async function main() {
  console.log('Building Webflow PDF...');
  execSync('npm run build:pdf:webflow', { cwd: ROOT, stdio: 'inherit' });

  if (!fs.existsSync(PDF)) throw new Error(`PDF missing after build: ${PDF}`);
  const stats = fs.statSync(PDF);
  if (stats.size < 1000) throw new Error(`PDF too small: ${stats.size} bytes`);

  const pdfParse = require('pdf-parse');
  const data = await pdfParse(fs.readFileSync(PDF));
  const normalized = (data.text || '').replace(/\s+/g, ' ').trim();
  const missing = REQUIRED_SNIPPETS.filter((snippet) => !normalized.includes(snippet));

  if (missing.length) {
    console.error('Webflow PDF extraction missing required snippets:');
    for (const snippet of missing) console.error(`  - ${snippet}`);
    process.exit(1);
  }

  if (data.numpages < 1 || data.numpages > 2) {
    throw new Error(`Webflow PDF must contain 1-2 pages; found ${data.numpages}`);
  }

  console.log(`Webflow PDF check passed (${data.numpages} pages, ${stats.size} bytes, ~${normalized.length} chars).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
