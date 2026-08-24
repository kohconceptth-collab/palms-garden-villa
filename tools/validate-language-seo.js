const fs = require('fs');
const vm = require('vm');

const context = { window: {} };
vm.createContext(context);
for (const file of ['js/translations.js', 'js/elena-translations.js']) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context);
}

const requiredKeys = [
  '85" CINEMA-SIZE SMART TV', 'BOX TV + NETFLIX',
  'OUTDOOR KITCHEN & SALA', 'SPACIOUS COVERED DINING',
  'VILLA SIZE', 'LAND', 'INDOOR + OUTDOOR', '85″ TV', '2 CARS',
  '3 bedrooms', '3 bathrooms', 'Maximum occupancy: 6 guests',
  'Covered parking for 2 cars', 'Our Wine Shop Selection',
  'View on Google Maps →', 'TROPICAL LUXURY', 'BENEATH THE', 'PALMS',
  'Palm garden living,', 'entirely yours',
  'Wake up to palm-framed pool views, unwind in the tropical garden and share long evenings beneath the spacious sala. Set on 800 m² of private grounds, Palms Garden Villa is designed for effortless stays in Rawai.',
  'Website Publisher', 'Website Owner: Michel Henlin', 'Hosting Provider',
  'Website hosting and technical management: Koh Concept',
  'Infrastructure provider: HOSTINGER PTE LTD', 'Server location: Malaysia', 'Privacy'
];
const missing = [];
for (const language of ['en', 'fr', 'th', 'ru', 'zh']) {
  for (const key of requiredKeys) {
    if (!context.window.DG_TRANSLATIONS[language]?.[key]) missing.push(`${language}: ${key}`);
  }
}

const html = fs.readFileSync('index.html', 'utf8');
const title = html.match(/<title>(.*?)<\/title>/)?.[1] || '';
const description = html.match(/<meta name="description" content="([^"]*)">/)?.[1] || '';
const jsonLd = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1] || '{}');
const checks = {
  languages: missing.length === 0,
  title: title.length >= 30 && title.length <= 60,
  description: description.length >= 110 && description.length <= 160,
  canonical: html.includes('<link rel="canonical" href="https://palmgardenvilla.kohconcept.com/">'),
  structuredData: jsonLd['@type'] === 'VacationRental' && jsonLd.numberOfBedrooms === 3 && jsonLd.numberOfBathroomsTotal === 3,
  distinctStructuredImages: new Set(jsonLd.image || []).size >= 2,
  favicon: html.includes('assets/icons/palms-favicon-192.png')
};

console.log(JSON.stringify({ checks, titleLength: title.length, descriptionLength: description.length, missing }, null, 2));
if (Object.values(checks).some((value) => !value)) process.exitCode = 1;
