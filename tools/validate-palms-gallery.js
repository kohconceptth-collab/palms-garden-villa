const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('js/script.js', 'utf8');
const references = [...html.matchAll(/(?:src|data-full)="([^"]*gallery-palms[^"]*)"/g)].map(match => match[1]);
const missing = references.filter(reference => !fs.existsSync(reference));
const previews = (html.match(/class="gallery-item/g) || []).length;
const captions = (js.match(/'IMG-20250930-WA\d+\.webp':/g) || []).length;

if (missing.length || previews !== 7 || captions !== 36) {
  throw new Error(JSON.stringify({ missing, previews, captions }, null, 2));
}

console.log(JSON.stringify({ previews, captions, missing: missing.length }));
