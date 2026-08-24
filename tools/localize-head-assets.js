const fs = require('fs');
const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
const from = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">';
const to = '<link rel="preload" href="assets/fonts/montserrat-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="assets/fonts/cormorant-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="assets/fonts/fonts.css">';
if ((html.split(from).length - 1) !== 1) throw new Error('Google Fonts head block not found exactly once');
html = html.replace(from, to);
fs.writeFileSync(file, html);
