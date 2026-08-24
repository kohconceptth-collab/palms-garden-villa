const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
const before = '<a class="notranslate" translate="no" href="#villa">LA VILLA</a>';
const after = '<a class="notranslate" translate="no" href="#villa"><span id="navVillaLabel">VILLA</span></a>';
if (!html.includes(before)) throw new Error('Lien LA VILLA protégé introuvable.');
html = html.replace(before, after);
fs.writeFileSync(file, html);
console.log('Libellé VILLA préparé pour la traduction contrôlée.');
