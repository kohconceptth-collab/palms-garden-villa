const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
const before = '<div class="fact"><b>1</b>KITCHEN</div>';
const after = '<div class="fact"><b>1<sup>+ 1/2</sup></b>KITCHENS</div>';

if (!html.includes(before)) throw new Error('Kitchen count not found.');
html = html.replace(before, after);
fs.writeFileSync(file, html);
console.log('Kitchen count updated to 1 + 1/2.');
