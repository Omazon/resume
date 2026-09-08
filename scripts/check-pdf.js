#!/usr/bin/env node
/**
 * Builds the resume PDF (if needed) and verifies ATS-extractable text.
 * Run: npm run check:pdf
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PDF = path.join(ROOT, 'assets', 'Omar-Boza-Resume.pdf');

const REQUIRED_SNIPPETS = [
  'Omar Boza',
  'omarboza@gmail.com',
  'PROFESSIONAL SUMMARY',
  'TECHNICAL SKILLS',
  'PROFESSIONAL EXPERIENCE',
  'CERTIFICATIONS',
  'EDUCATION',
  'Your Digital Resource',
  'Jan 2024',
  'Aug 2026',
  'Webflow',
  'WordPress',
  'PHP',
  'JavaScript',
  'CSS',
  'EF SET',
  'C2',
  'Aug 29, 2026',
  'cert.efset.org/B6TnCM',
  '30%',
  'Nicasource',
  'Top Floor Marketing',
  'AIM Services',
  'Target Ogilvy',
];

async function extractPdfText(pdfPath) {
  // pdf-parse v1 exports a function; keep dependency pinned in package.json.
  const pdfParse = require('pdf-parse');
  const buffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(buffer);
  return { text: data.text || '', numpages: data.numpages || 0 };
}

async function main() {
  console.log('Building PDF...');
  execSync('npm run build:pdf', { cwd: ROOT, stdio: 'inherit' });

  if (!fs.existsSync(PDF)) {
    console.error('PDF missing after build:', PDF);
    process.exit(1);
  }

  const stats = fs.statSync(PDF);
  if (stats.size < 1000) {
    console.error(`PDF too small (${stats.size} bytes); likely empty or corrupt`);
    process.exit(1);
  }

  const { text, numpages } = await extractPdfText(PDF);
  const normalized = text.replace(/\s+/g, ' ').trim();

  if (!normalized) {
    console.error('PDF text extraction returned empty content');
    process.exit(1);
  }

  const missing = REQUIRED_SNIPPETS.filter((snippet) => !normalized.includes(snippet));
  if (missing.length) {
    console.error('PDF extraction missing required snippets:');
    for (const snippet of missing) console.error(`  - ${snippet}`);
    console.error('\nExtracted preview:\n', normalized.slice(0, 800));
    process.exit(1);
  }

  // Basic order check for employers (ATS scan order)
  const order = [
    'Your Digital Resource',
    'Nicasource',
    'Top Floor Marketing',
    'AIM Services',
    'Target Ogilvy',
  ];
  let lastIndex = -1;
  for (const company of order) {
    const idx = normalized.indexOf(company);
    if (idx < lastIndex) {
      console.error(`Employer order broken around: ${company}`);
      process.exit(1);
    }
    lastIndex = idx;
  }

  if (numpages < 1 || numpages > 2) {
    console.error(`PDF must contain 1–2 pages; found ${numpages}`);
    process.exit(1);
  }

  console.log(`PDF extraction check passed (${numpages} pages, ${stats.size} bytes, ~${normalized.length} chars).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
