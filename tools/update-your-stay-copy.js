const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
html = html.replace('<span>JUST A FEW MINUTES WALK</span>', '<span>JUST A FEW MINUTES</span>');
html = html.replace('<b>CLOSE TO THE BEACH</b><small>Beach, restaurants &amp; local shops nearby</small>', '<b>RAWAI</b><small>Beach, restaurants &amp; local shops nearby</small>');
if (html.includes('JUST A FEW MINUTES WALK')) throw new Error('WALK removal failed');
if (!html.includes('<b>RAWAI</b><small>Beach, restaurants &amp; local shops nearby</small>')) throw new Error('Rawai title update failed');
fs.writeFileSync(file, html);
