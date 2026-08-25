const fs = require('fs');
const vm = require('vm');

const context = { window: {} };
vm.createContext(context);
for (const file of ['js/translations.js', 'js/elena-translations.js']) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context);
}

const keys = [
  'Restaurants','Spa & massages','Bars & nightlife','Motorbikes for rent',
  'Seafood market and beachfront restaurants',
  'French & Italian cuisine, steaks, pizza and seafood',
  'French semi-gastronomic restaurant','Gastro bar','Italian restaurant',
  'Healthy breakfast and lunch','Healthy food','Mexican restaurant',
  'Wine shop with home delivery','Spa, sauna, pool, massages, restaurant and bar',
  'Massage at the shop or directly at the villa','CBD massage at home',
  'Bars and nightlife venue','Local bar','Nightclub and bars',
  'Scooter and motorbike rental','Scooter rental','Motorbike rental',
  'WhatsApp','Google Maps','Website'
];
const maps = context.window.DG_TRANSLATIONS;
const missing = keys.flatMap(key => ['fr','th','ru','zh']
  .filter(language => !maps[language]?.[key])
  .map(language => ({ key, language })));
console.log(JSON.stringify({ dynamicKeys: keys.length, missingCount: missing.length, missing }, null, 2));
process.exitCode = missing.length ? 1 : 0;
