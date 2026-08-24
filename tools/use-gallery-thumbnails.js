const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
const sources = [
  'assets/images/gallery-elena/01-piscine-facade.webp',
  'assets/images/gallery-elena/02-piscine-jardin.webp',
  'assets/images/gallery-elena/full/IMG-20251223-WA0135.webp',
  'assets/images/gallery-elena/full/IMG-20251223-WA0125.webp',
  'assets/images/gallery-elena/full/IMG-20251223-WA0110.webp',
  'assets/images/gallery-elena/06-terrasse-piscine.webp',
  'assets/images/gallery-elena/full/IMG-20251223-WA0138.webp',
];

for (const source of sources) {
  const filename = source.split('/').pop();
  const before = `src="${source}"`;
  const after = `src="assets/images/gallery-thumbs/${filename}" data-full="${source}"`;
  if (!html.includes(before)) throw new Error(`Gallery preview not found: ${source}`);
  html = html.replace(before, after);
}

fs.writeFileSync(file, html);
console.log('Gallery now uses lightweight previews with full-size lightbox images.');
