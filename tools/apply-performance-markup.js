const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'index.html');
const jsPath = path.join(root, 'js', 'script.js');
let html = fs.readFileSync(htmlPath, 'utf8');
let js = fs.readFileSync(jsPath, 'utf8');

function replaceOnce(text, from, to, label) {
  const count = text.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected 1 match, found ${count}`);
  return text.replace(from, to);
}

html = replaceOnce(
  html,
  '<link rel="preload" as="image" href="assets/images/image-001.webp" fetchpriority="high">',
  '<link rel="preload" as="image" href="assets/images/image-001-mobile.webp" media="(max-width:850px)" fetchpriority="high"><link rel="preload" as="image" href="assets/images/image-001.webp" media="(min-width:851px)" fetchpriority="high">',
  'responsive hero preload'
);
html = replaceOnce(html, '<script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script>', '<script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js" defer></script>', 'deferred Lucide');

for (const [from, to, label] of [
  ['<video class="villa-main-video" muted playsinline preload="metadata">', '<video class="villa-main-video" muted playsinline preload="none">', 'main villa preload'],
  ['<video class="villa-main-video villa-reverse-video" muted playsinline preload="auto" loop', '<video class="villa-main-video villa-reverse-video" muted playsinline preload="none" loop', 'loop villa preload'],
  ['<video class="rawai-direct-video" muted playsinline loop preload="metadata"', '<video class="rawai-direct-video" muted playsinline loop preload="none"', 'Rawai preload']
]) html = replaceOnce(html, from, to, label);

for (const source of [
  'video-001-web.webm', 'video-001-web.mp4',
  'video-002-web.webm', 'video-002-web.mp4',
  'rawai-district-phuket.webm', 'rawai-district-phuket.mp4'
]) {
  html = replaceOnce(html, `source src="assets/videos/${source}"`, `source data-src="assets/videos/${source}"`, source);
}

const legacyStart = '/* Legacy image-sequence implementation retained for reference.';
const legacyIndex = js.indexOf(legacyStart);
if (legacyIndex < 0) throw new Error('legacy gift code start not found');
const legacyEnd = js.indexOf('*/', legacyIndex);
if (legacyEnd < 0) throw new Error('legacy gift code end not found');
js = js.slice(0, legacyIndex) + js.slice(legacyEnd + 2);

fs.writeFileSync(htmlPath, html);
fs.writeFileSync(jsPath, js);
