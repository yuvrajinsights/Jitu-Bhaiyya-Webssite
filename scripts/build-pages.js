const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const OUTPUT_DIR = path.resolve(ROOT, 'dist');
const profile = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'profile.json'), 'utf8'));

const routes = [
  { slug: '', title: 'मुख्यपृष्ठ', source: 'index.html' },
  { slug: 'about', title: 'माझ्याविषयी', source: 'about.html' },
  { slug: 'political-journey', title: 'राजकीय प्रवास', source: 'content.html' },
  { slug: 'party-work', title: 'पक्षाचे कार्य', source: 'content.html' },
  { slug: 'social-work', title: 'सामाजिक कार्य', source: 'content.html' },
  { slug: 'department', title: 'समाज कल्याण विभाग', source: 'content.html' },
  { slug: 'schemes', title: 'शासकीय योजना', source: 'content.html' },
  { slug: 'activities', title: 'कार्यक्रम व दौरे', source: 'content.html' },
  { slug: 'news', title: 'बातम्या व माध्यमे', source: 'content.html' },
  { slug: 'gallery', title: 'छायाचित्रे व व्हिडिओ', source: 'content.html' },
  { slug: 'reports', title: 'अहवाल व दस्तऐवज', source: 'content.html' },
  { slug: 'contact', title: 'जनसंपर्क', source: 'content.html' },
  { slug: 'privacy-policy', title: 'गोपनीयता धोरण', source: 'content.html' },
  { slug: 'accessibility', title: 'सुलभता निवेदन', source: 'content.html' }
];

const routeSlugs = new Set([...routes.map((route) => route.slug).filter(Boolean), 'admin']);

function normalizeBasePath(value = '/') {
  const trimmed = String(value).trim().replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}/` : '/';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function jsonForInlineScript(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function renderTemplate(route, basePath) {
  const file = path.join(PUBLIC_DIR, route.source);
  const description = `${profile.fullNameMr} — ${profile.designationMr}. वैयक्तिक प्रोफाइल, सार्वजनिक कार्य आणि पडताळलेली माहिती.`;
  const structuredData = jsonForInlineScript({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.fullNameMr,
    alternateName: profile.fullNameEn,
    jobTitle: profile.designationMr
  });
  let html = fs.readFileSync(file, 'utf8')
    .replaceAll('<!-- PAGE_TITLE -->', escapeHtml(`${profile.fullNameMr} | ${route.title}`))
    .replaceAll('<!-- PAGE_LABEL -->', escapeHtml(route.title))
    .replaceAll('<!-- PAGE_SLUG -->', escapeHtml(route.slug))
    .replaceAll('<!-- PAGE_DESCRIPTION -->', escapeHtml(description))
    .replaceAll('<!-- PAGE_AUTHOR -->', escapeHtml(profile.fullNameEn))
    .replaceAll('<!-- STRUCTURED_DATA -->', structuredData);

  const bootstrap = `<script>window.SITE_BASE_PATH=${jsonForInlineScript(basePath)};window.PUBLIC_PROFILE=${jsonForInlineScript(profile)};</script>`;
  html = html.replace('<head>', `<head>\n  ${bootstrap}`);
  return html.replace(/\b(href|src)=(['"])\/([^'"]*)\2/g, (_match, attribute, quote, value) => {
    const suffixAt = value.search(/[?#]/);
    const pathname = suffixAt < 0 ? value : value.slice(0, suffixAt);
    const suffix = suffixAt < 0 ? '' : value.slice(suffixAt);
    const normalizedPath = pathname.replace(/^\/+/, '');
    if (!normalizedPath) return `${attribute}=${quote}${basePath}${suffix}${quote}`;
    const trailingSlash = routeSlugs.has(normalizedPath) ? '/' : '';
    return `${attribute}=${quote}${basePath}${normalizedPath}${trailingSlash}${suffix}${quote}`;
  });
}

function writePage(relativePath, html) {
  const destination = path.resolve(OUTPUT_DIR, relativePath);
  const relative = path.relative(OUTPUT_DIR, destination);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write outside the Pages output: ${relativePath}`);
  }
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, html);
}

function main() {
  const basePath = normalizeBasePath(process.env.SITE_BASE_PATH || '/');
  const relativeOutput = path.relative(ROOT, OUTPUT_DIR);
  if (relativeOutput !== 'dist') throw new Error('Pages output directory must remain inside this project at dist/.');
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const route of routes) {
    const relativePath = route.slug ? path.join(route.slug, 'index.html') : 'index.html';
    writePage(relativePath, renderTemplate(route, basePath));
  }

  writePage(path.join('admin', 'index.html'), renderTemplate({
    slug: 'admin',
    title: 'प्रशासक माहिती',
    source: 'admin-static.html'
  }, basePath));

  const notFound = `<main lang="mr"><h1>पृष्ठ सापडले नाही</h1><p>हा दुवा उपलब्ध नाही. मुख्यपृष्ठावर परत जा.</p><a href="${basePath}">मुख्यपृष्ठ</a></main>`;
  writePage('404.html', `<!doctype html><html lang="mr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>पृष्ठ सापडले नाही</title><link rel="stylesheet" href="${basePath}site.css"><body>${notFound}</body></html>`);

  for (const file of ['site.css', 'app.js', 'content.js']) {
    fs.copyFileSync(path.join(PUBLIC_DIR, file), path.join(OUTPUT_DIR, file));
  }
  fs.cpSync(path.join(PUBLIC_DIR, 'assets'), path.join(OUTPUT_DIR, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, '.nojekyll'), '');
  console.log(`GitHub Pages files built in dist/ with base path ${basePath}`);
}

main();
