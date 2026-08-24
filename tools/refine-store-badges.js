const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
html = html.replace(
  '<img src="assets/images/google-play-app-store.jpg" alt="Disponible sur Google Play et l’App Store" loading="lazy">',
  '<div class="store-badges" role="group" aria-label="Disponible sur Google Play et l’App Store"><span class="store-badge store-badge-play" role="img" aria-label="Disponible sur Google Play"></span><span class="store-badge store-badge-apple" role="img" aria-label="Télécharger dans l’App Store"></span></div>'
);
if (!html.includes('class="store-badges"')) throw new Error('Store badge layout replacement failed');
fs.writeFileSync(file, html);
