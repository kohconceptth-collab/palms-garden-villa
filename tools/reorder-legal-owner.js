const fs = require('fs');
const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
const from = 'Website Owner: Chavdar Tiholov<br>Phuket, Thailand';
const to = 'Phuket, Thailand<br>Website Owner: Chavdar Tiholov';
if ((html.split(from).length - 1) !== 1) throw new Error('Legal owner/location block not found exactly once');
html = html.replace(from, to);
fs.writeFileSync(file, html);
