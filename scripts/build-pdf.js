#!/usr/bin/env node
/**
 * Generates a resume PDF from an HTML template using Puppeteer.
 * ATS-friendly selectable text.
 *
 * Usage:
 *   npm run build:pdf
 *   npm run build:pdf:frontend
 *   node scripts/build-pdf.js [outputPath] [htmlPath]
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const HTML = process.argv[3]
  ? path.resolve(process.argv[3])
  : path.join(__dirname, 'resume-pdf.html');
const PDF = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, 'assets', 'Omar-Boza-Resume.pdf');

async function main() {
  if (!fs.existsSync(HTML)) {
    console.error('HTML template not found:', HTML);
    process.exit(1);
  }

  const outDir = path.dirname(PDF);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`file://${HTML}`, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: PDF,
    format: 'Letter',
    printBackground: true,
    margin: { top: '14mm', right: '16mm', bottom: '14mm', left: '16mm' },
  });

  await browser.close();
  console.log(`PDF written to ${PDF}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
