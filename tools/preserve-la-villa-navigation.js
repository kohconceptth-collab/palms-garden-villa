const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
const before = '<a href="#villa">LA VILLA</a>';
const after = '<a class="notranslate" translate="no" href="#villa">LA VILLA</a>';
if (!html.includes(before)) throw new Error('Lien de navigation LA VILLA introuvable.');
html = html.replace(before, after);
fs.writeFileSync(file, html);
console.log('Le libellé LA VILLA est conservé dans toutes les langues.');
