const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
const domain = 'https://palmgardenvilla.kohconcept.com/';

const headMarker = '<meta property="og:type" content="website">';
if (!html.includes(headMarker)) throw new Error('Métadonnées Open Graph introuvables.');
html = html.replace(headMarker, `<link rel="canonical" href="${domain}"><meta property="og:type" content="website"><meta property="og:url" content="${domain}">`);
html = html.replaceAll('content="assets/images/image-001.png"', `content="${domain}assets/images/image-001.png"`);

const jsonMarker = '<script type="application/ld+json">';
const jsonStart = html.indexOf(jsonMarker);
const jsonEnd = html.indexOf('</script>', jsonStart);
if (jsonStart < 0 || jsonEnd < 0) throw new Error('Données structurées introuvables.');
const contentStart = jsonStart + jsonMarker.length;
const data = JSON.parse(html.slice(contentStart, jsonEnd));
data.url = domain;
data.image = [
  `${domain}assets/images/image-001.png`,
  `${domain}assets/images/gallery-elena/01-piscine-facade.png`,
];
html = html.slice(0, contentStart) + JSON.stringify(data) + html.slice(jsonEnd);

fs.writeFileSync(file, html);
console.log('Domaine public intégré aux métadonnées SEO.');
