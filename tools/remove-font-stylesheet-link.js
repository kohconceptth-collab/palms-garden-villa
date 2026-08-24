const fs = require('fs');
const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
const link = '<link rel="stylesheet" href="assets/fonts/fonts.css">';
if ((html.split(link).length - 1) !== 1) throw new Error('Local font stylesheet link not found exactly once');
html = html.replace(link, '');
fs.writeFileSync(file, html);
