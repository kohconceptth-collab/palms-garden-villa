const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
const before = '<div class="links"><a href="#villa">LA VILLA</a><a href="#experience">EXPÉRIENCES</a><a href="#services">SERVICES</a><a href="#guide">GUIDE</a><a href="#rawai">RAWAI</a><a href="#gallery">GALERIE</a></div>';
const after = '<div class="links"><a href="#experience">EXPÉRIENCES</a><a href="#villa">LA VILLA</a><a href="#guide">GUIDE</a><a href="#gallery">GALERIE</a><a href="#rawai">RAWAI</a><a href="#services">SERVICES</a></div>';
if (!html.includes(before)) throw new Error('Navigation principale introuvable.');
html = html.replace(before, after);

fs.writeFileSync(file, html);
console.log('Navigation réordonnée selon les sections.');
