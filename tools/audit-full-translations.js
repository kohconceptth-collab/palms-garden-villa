const fs = require('fs');
const vm = require('vm');

const context = { window: {} };
vm.createContext(context);
for (const file of ['js/translations.js', 'js/elena-translations.js']) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context);
}
const maps = context.window.DG_TRANSLATIONS;
const html = fs.readFileSync('index.html', 'utf8');
const decode = (value) => value
  .replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'")
  .replaceAll('&apos;', "'").replaceAll('&nbsp;', ' ').replaceAll('&times;', '×')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
const stack = [{ tag: '#root', blocked: false }];
const keys = new Set();
const tokens = html.match(/<[^>]+>|[^<]+/g) || [];
for (const token of tokens) {
  if (token.startsWith('</')) { if (stack.length > 1) stack.pop(); continue; }
  if (token.startsWith('<')) {
    if (/^<!/.test(token)) continue;
    const tag = token.match(/^<\s*([\w-]+)/)?.[1]?.toLowerCase();
    if (!tag) continue;
    const parentBlocked = stack.at(-1).blocked;
    const blocked = parentBlocked || ['head', 'script', 'style', 'noscript'].includes(tag)
      || /\bclass="[^"]*\bnotranslate\b/.test(token) || /\btranslate="no"/.test(token);
    if (!blocked) {
      for (const attr of ['alt', 'title', 'aria-label']) {
        const value = token.match(new RegExp(`\\b${attr}="([^"]*)"`))?.[1];
        if (value?.trim()) keys.add(decode(value.trim()));
      }
    }
    if (!/\/\s*>$/.test(token) && !['meta','link','img','br','hr','source','input'].includes(tag)) stack.push({ tag, blocked });
    continue;
  }
  if (!stack.at(-1).blocked) {
    const key = decode(token).replace(/\s+/g, ' ').trim();
    if (key) keys.add(key);
  }
}

const neutralKeys = new Set(['RA Wine','Makro','Lotus’s','Tops','Tops Daily','Big C','PTT','PTT Station','Bangchak','GrabFood','Grab','12Go','WhatsApp','Netflix','RAWAI','PALMS','PALMS GARDEN —','Palms Garden Villa','Phuket, Thailand','Phuket International Hospital','BIG BUDDHA','Big Buddha','NAI HARN BEACH','Nai Harn Beach','PROMTHEP CAPE','Promthep Cape','RAWAI BEACH','Rawai Beach','RAWAI SEA MARKET','Rawai Sea Market','WAT CHALONG','Wat Chalong','67/82 Soi Sylvia','Rawai, Mueang, Phuket District 83130','16 Raffles Quay, #33-03, Hong Leong Building','Singapore 048581']);
const languageNeutral = /^(?:[\d\s:×+·★°%²″".,()\/—-]+|\d+(?:×\d+)?\s*m(?:²)?|\d+\s*min|☀️\s*31°C|[‹›✦📍️])$/iu;
const missing = [];
for (const key of [...keys].sort()) {
  if (neutralKeys.has(key) || languageNeutral.test(key) || /^(?:https?:|[\w.-]+\.(?:com|co|ltd))/.test(key)) continue;
  const absent = ['fr','th','ru','zh'].filter(language => !maps[language]?.[key]);
  if (absent.length) missing.push({ key, languages: absent });
}
console.log(JSON.stringify({ visibleAndAccessibleKeys: keys.size, missingCount: missing.length, missing }, null, 2));
process.exitCode = missing.length ? 1 : 0;
