const fs = require('fs');

const htmlFile = 'index.html';
const jsFile = 'js/script.js';
const cssFile = 'css/style.css';

let html = fs.readFileSync(htmlFile, 'utf8');
const previews = [
  ['IMG-20250930-WA0044', 'Main pool framed by the tropical garden', 'gallery-featured'],
  ['IMG-20250930-WA0013', 'Open-plan dining area overlooking the pool', ''],
  ['IMG-20250930-WA0022', 'Fully equipped kitchen with breakfast island', ''],
  ['IMG-20250930-WA0024', 'Primary bedroom with direct pool access', ''],
  ['IMG-20250930-WA0008', 'Contemporary bathroom with double vanity and walk-in shower', ''],
  ['IMG-20250930-WA0018', 'Landscaped tropical garden with mature palm trees', ''],
  ['IMG-20250930-WA0019', 'Spacious television lounge with garden views', 'gallery-wide']
];
const previewMarkup = previews.map(([name, caption, className]) =>
  `<button class="gallery-item${className ? ` ${className}` : ''}" type="button" aria-label="Enlarge: ${caption}"><img src="assets/images/gallery-palms/thumbs/${name}.webp" data-full="assets/images/gallery-palms/web/${name}.webp" alt="${caption}" loading="lazy" decoding="async" width="720" height="540"></button>`
).join('');
html = html.replace(
  /<div class="gallery-grid">[\s\S]*?<\/div><div class="gallery-heading-actions">/,
  `<div class="gallery-grid">${previewMarkup}</div><div class="gallery-heading-actions">`
);
html = html.replace(
  /<div class="mainpic">[\s\S]*?<\/div><div class="side"><div><\/div><div><\/div><\/div>/,
  '<div class="mainpic"><img src="assets/images/gallery-palms/web/IMG-20250930-WA0030.webp" alt="Private pool and tropical courtyard of Palms Garden Villa" decoding="async"></div><div class="side"><img src="assets/images/gallery-palms/web/IMG-20250930-WA0022.webp" alt="Fully equipped kitchen with breakfast island" decoding="async"><img src="assets/images/gallery-palms/web/IMG-20250930-WA0024.webp" alt="Primary bedroom with direct pool access" decoding="async"></div>'
);
html = html.replace(/(<img src="assets\/images\/gallery-palms\/web\/IMG-20250930-WA(?:0030|0022|0024)\.webp"[^>]*?) loading="lazy"/g, '$1');
html = html.replace(/(<div class="mainpic"><img src="assets\/images\/gallery-palms\/web\/IMG-20250930-)WA0038(\.webp")/, '$1WA0030$2');
html = html
  .replace(/assets\/icons\/villa-location-qr\.svg(?:\?v=[^"']*)?/g, 'assets/icons/villa-location-qr.svg?v=palms-location-2')
  .replace(/css\/style\.css(?:\?v=[^"']*)?/g, 'css/style.css?v=palms-30')
  .replace(/js\/script\.js(?:\?v=[^"']*)?/g, 'js/script.js?v=palms-30')
  .replace(/<b>PALM<\/b><small>GARDEN VILLA/g, '<b>PALMS</b><small>GARDEN VILLA')
  .replaceAll('assets/images/image-001.png', 'assets/images/gallery-palms/web/IMG-20250930-WA0044.webp')
  .replaceAll('assets/images/image-001-mobile.webp', 'assets/images/gallery-palms/web/IMG-20250930-WA0044.webp')
  .replaceAll('assets/images/image-001.webp', 'assets/images/gallery-palms/web/IMG-20250930-WA0044.webp')
  .replace('https://palmsgardenvilla.kohconcept.com/assets/images/gallery-elena/01-piscine-facade.png', 'https://palmsgardenvilla.kohconcept.com/assets/images/gallery-palms/web/IMG-20250930-WA0044.webp');
const headEnd = html.indexOf('</head>');
html = html.slice(0, headEnd).replaceAll('IMG-20250930-WA0044.webp', 'IMG-20250930-WA0038.webp') + html.slice(headEnd);
fs.writeFileSync(htmlFile, html);

const captions = {
  'WA0008': 'Contemporary bathroom with double vanity and walk-in shower',
  'WA0009': 'Long dining table in the bright open-plan living space',
  'WA0010': 'Covered dining area beside the outdoor kitchen',
  'WA0011': 'Garden-facing dining area under the covered terrace',
  'WA0012': 'Naturally lit bathroom with bathtub and walk-in shower',
  'WA0013': 'Open-plan dining area overlooking the pool',
  'WA0014': 'Covered poolside dining terrace',
  'WA0015': 'Dining area with a panoramic view of the private pool',
  'WA0016': 'Open-plan lounge and dining room',
  'WA0017': 'Covered parking and outdoor kitchen area',
  'WA0018': 'Landscaped tropical garden with mature palm trees',
  'WA0019': 'Spacious television lounge with garden views',
  'WA0020': 'Comfortable lounge in a calm contemporary setting',
  'WA0021': 'Modern bathroom vanity and large mirror',
  'WA0022': 'Fully equipped kitchen with breakfast island',
  'WA0023': 'Private swimming pool and sun terrace',
  'WA0024': 'Primary bedroom with direct pool access',
  'WA0025': 'Textured hallway leading to the bedrooms',
  'WA0026': 'Private pool surrounded by lush tropical greenery',
  'WA0028': 'Comfortable guest bedroom with air conditioning',
  'WA0030': 'Pool courtyard framed by palms and tropical plants',
  'WA0031': 'Garden-view guest bedroom',
  'WA0032': 'Sun loungers overlooking the landscaped garden',
  'WA0033': 'Central air-conditioning and lighting controls',
  'WA0034': 'Spacious covered parking area',
  'WA0035': 'Pool steps and decorative tropical planting',
  'WA0036': 'Long pool terrace with sun loungers',
  'WA0037': 'Drinking-water dispenser in the lounge area',
  'WA0038': 'Tropical pool courtyard and palm-lined terrace',
  'WA0039': 'Kitchen island opening onto the living spaces',
  'WA0040': 'Covered terrace looking out over the pool',
  'WA0041': 'Room controls and air-conditioning remotes',
  'WA0042': 'Private villa entrance and intercom',
  'WA0043': 'Practical utility and storage area',
  'WA0044': 'Main pool framed by the tropical garden',
  'WA0045': 'Covered parking with outdoor kitchen and service area'
};
let js = fs.readFileSync(jsFile, 'utf8');
const captionLines = Object.entries(captions).map(([suffix, caption]) =>
  `    'IMG-20250930-${suffix}.webp':'${caption}'`
).join(',\n');
js = js.replace(/  const galleryCaptions=\{[\s\S]*?\n  \};\n  const captionFor=/,
  `  const galleryCaptions={\n${captionLines}\n  };\n  const captionFor=`
);
const allPaths = Object.keys(captions).map(suffix => `    'assets/images/gallery-palms/web/IMG-20250930-${suffix}.webp'`).join(',\n');
js = js.replace(/  const importedPaths=\[[\s\S]*?\n  \];\n  const previewPaths=/,
  `  const importedPaths=[\n${allPaths}\n  ];\n  const previewPaths=`
);
fs.writeFileSync(jsFile, js);

let css = fs.readFileSync(cssFile, 'utf8');
const overrides = `\n/* Palms Garden Villa photography */\n@media(min-width:851px){.hero{background:radial-gradient(ellipse 80% 118% at 5% 50%,rgba(2,12,18,.78) 0%,rgba(2,12,18,.68) 23%,rgba(2,12,18,.51) 39%,rgba(2,12,18,.31) 53%,rgba(2,12,18,.15) 65%,rgba(2,12,18,.055) 75%,transparent 88%),linear-gradient(180deg,rgba(2,12,18,.20) 0%,rgba(2,12,18,.08) 17%,transparent 34%),url('../assets/images/gallery-palms/web/IMG-20250930-WA0038.webp') center/cover no-repeat}}\n@media(max-width:850px){.hero{background:radial-gradient(ellipse 108% 82% at 14% 43%,rgba(2,12,18,.64) 0%,rgba(2,12,18,.54) 24%,rgba(2,12,18,.40) 43%,rgba(2,12,18,.25) 60%,rgba(2,12,18,.12) 76%,rgba(2,12,18,.04) 89%,transparent 100%),url('../assets/images/gallery-palms/web/IMG-20250930-WA0038.webp') center/cover no-repeat}}\n.rawcopy{background:linear-gradient(#06131c66,#06131cdd),url('../assets/images/gallery-palms/web/IMG-20250930-WA0038.webp') center/cover}\n.mainpic img,.side img{width:100%;height:100%;display:block;object-fit:cover}\n.side{min-height:360px}\n`;
if (!css.includes('/* Palms Garden Villa photography */')) css += overrides;
fs.writeFileSync(cssFile, css);

console.log(`Installed ${previews.length} previews and ${Object.keys(captions).length} gallery images.`);
