#!/usr/bin/env node
/**
 * Generates assets/Omar-Boza-Resume.pdf from scripts/resume-pdf.html using Puppeteer.
 * The template is a clean, ATS-friendly resume document (selectable text).
 * Run: npm run build:pdf
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const HTML = path.join(__dirname, 'resume-pdf.html');
const PDF = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, 'assets', 'Omar-Boza-Resume.pdf');

async function main() {
  if (!fs.existsSync(HTML)) {
    console.error('scripts/resume-pdf.html not found');
    process.exit(1);
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
