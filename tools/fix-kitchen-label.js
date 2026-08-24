const fs = require('fs');
const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
const from = '<b>1<sup>+ 1/2</sup></b>KITCHENS';
const to = '<b>2</b>INDOOR + OUTDOOR<br>KITCHENS';
if ((html.split(from).length - 1) !== 1) throw new Error('Kitchen label not found exactly once');
html = html.replace(from, to);
fs.writeFileSync(file, html);
