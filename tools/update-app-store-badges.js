const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
html = html.replace(
  '<div><img src="assets/images/image-017.png" alt="12Go"><span>Transport & billets</span></div></div></div>',
  '<div><img src="assets/images/image-017.png" alt="12Go"><span>Transport & billets</span></div></div><div class="store-availability"><span>Disponible sur</span><img src="assets/images/google-play-app-store.jpg" alt="Disponible sur Google Play et l’App Store" loading="lazy"></div></div>'
);
if (!html.includes('class="store-availability"')) throw new Error('Store badges insertion failed');
fs.writeFileSync(file, html);
