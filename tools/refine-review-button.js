const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
html = html.replace('<button class="cta" style="border:0">LAISSER UN COMMENTAIRE →</button>', '<button class="review-button" type="button">Laisser un commentaire →</button>');
if (!html.includes('class="review-button"')) throw new Error('Review button update failed');
fs.writeFileSync(file, html);
