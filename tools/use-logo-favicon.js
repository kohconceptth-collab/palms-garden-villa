const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
const before = '<link rel="icon" href="assets/icons/elena-favicon.png?v=2" type="image/png" sizes="1024x1024"><link rel="shortcut icon" href="assets/icons/elena-favicon.png?v=2" type="image/png"><link rel="apple-touch-icon" href="assets/icons/elena-favicon.png?v=2">';
const after = '<link rel="icon" href="assets/icons/elena-favicon.png" type="image/png" sizes="1024x1024"><link rel="shortcut icon" href="assets/icons/elena-favicon.png" type="image/png"><link rel="apple-touch-icon" href="assets/icons/elena-favicon.png">';
if (!html.includes(before)) throw new Error('Anciennes références favicon introuvables.');
html = html.replace(before, after);
fs.writeFileSync(file, html);
console.log('Le favicon utilise désormais le logo Elena.');
