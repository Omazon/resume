#!/usr/bin/env node
/**
 * Validates resume.json structure, dates, and critical ATS keywords.
 * Run: npm run validate
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RESUME_JSON = path.join(ROOT, 'resume.json');
const PDF_HTML = path.join(ROOT, 'scripts', 'resume-pdf.html');
const LLMS = path.join(ROOT, 'llms.txt');
const INDEX = path.join(ROOT, 'index.html');

const REQUIRED_KEYWORDS = ['Webflow', 'WordPress', 'PHP', 'JavaScript', 'CSS', 'AI', 'C2', '30%'];
const errors = [];

function fail(msg) {
  errors.push(msg);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    fail(`Invalid JSON in ${path.relative(ROOT, filePath)}: ${err.message}`);
    return null;
  }
}

function parseYearMonth(value) {
  if (!value) return null;
  const m = String(value).match(/^(\d{4})(?:-(\d{2})(?:-\d{2})?)?$/);
  if (!m) return null;
  return { year: Number(m[1]), month: Number(m[2] || 1), raw: value };
}

function isAfter(a, b) {
  if (a.year !== b.year) return a.year > b.year;
  return a.month > b.month;
}

function main() {
  const resume = readJson(RESUME_JSON);
  if (!resume) {
    reportAndExit();
    return;
  }

  if (!resume.basics?.name) fail('basics.name is required');
  if (!resume.basics?.email) fail('basics.email is required');
  if (!resume.basics?.summary) fail('basics.summary is required');
  if (!resume.basics?.label) fail('basics.label is required');
  if (!Array.isArray(resume.work) || resume.work.length === 0) fail('work[] is required');
  if (!Array.isArray(resume.skills) || resume.skills.length === 0) fail('skills[] is required');
  if (!Array.isArray(resume.certificates) || resume.certificates.length === 0) {
    fail('certificates[] is required (EF SET C2)');
  }

  const now = new Date();
  const today = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    raw: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
  };

  for (const job of resume.work || []) {
    const start = parseYearMonth(job.startDate);
    const end = parseYearMonth(job.endDate);
    if (!start) fail(`Invalid startDate for ${job.name || 'job'}: ${job.startDate}`);
    if (job.endDate && !end) fail(`Invalid endDate for ${job.name || 'job'}: ${job.endDate}`);
    if (start && end && isAfter(start, end)) {
      fail(`startDate after endDate for ${job.name}: ${job.startDate} > ${job.endDate}`);
    }
    if (end && isAfter(end, today)) {
      fail(`Future endDate for ${job.name}: ${job.endDate} (today ${today.raw})`);
    }
  }

  const ydr = (resume.work || []).find((j) => j.name === 'Your Digital Resource');
  if (!ydr) fail('Missing Your Digital Resource work entry');
  if (ydr && ydr.endDate !== '2026-08') {
    fail(`YDR endDate must be 2026-08, got ${ydr.endDate}`);
  }

  const certText = JSON.stringify(resume.certificates || []);
  if (!/EF SET/i.test(certText) || !/C2/i.test(JSON.stringify(resume))) {
    fail('EF SET C2 certification must appear in resume.json');
  }
  const efSet = (resume.certificates || []).find((cert) => /EF SET/i.test(cert.name || ''));
  if (efSet?.date !== '2026-08-29') {
    fail(`EF SET date must be 2026-08-29, got ${efSet?.date || 'missing'}`);
  }
  if (efSet?.url !== 'https://cert.efset.org/B6TnCM') {
    fail('EF SET must use the verifiable credential URL');
  }

  const surfaces = [
    { name: 'resume.json', text: fs.readFileSync(RESUME_JSON, 'utf8') },
    { name: 'scripts/resume-pdf.html', text: fs.readFileSync(PDF_HTML, 'utf8') },
    { name: 'llms.txt', text: fs.readFileSync(LLMS, 'utf8') },
    { name: 'index.html', text: fs.readFileSync(INDEX, 'utf8') },
  ];

  for (const surface of surfaces) {
    for (const keyword of REQUIRED_KEYWORDS) {
      if (!surface.text.includes(keyword)) {
        fail(`${surface.name} missing required keyword: ${keyword}`);
      }
    }
  }

  if (!fs.readFileSync(PDF_HTML, 'utf8').includes('Jan 2024')) {
    fail('PDF template must show YDR as Jan 2024 – Aug 2026');
  }
  if (!fs.readFileSync(PDF_HTML, 'utf8').includes('Aug 2026')) {
    fail('PDF template must show YDR end Aug 2026');
  }
  if (/Lead design/.test(fs.readFileSync(PDF_HTML, 'utf8'))) {
    fail('PDF still uses present-tense "Lead design"; use past tense "Led"');
  }
  if (/skills-table/.test(fs.readFileSync(PDF_HTML, 'utf8'))) {
    fail('PDF still uses skills table; use semantic skill lines for ATS');
  }

  reportAndExit();
}

function reportAndExit() {
  if (errors.length) {
    console.error('Resume validation failed:');
    for (const err of errors) console.error(`  - ${err}`);
    process.exit(1);
  }
  console.log('Resume validation passed.');
}

main();
