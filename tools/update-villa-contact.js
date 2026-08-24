const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
html = html.replace('<b>650 m²</b> D\'EXCEPTION', '<b>320 m²</b> D\'EXCEPTION');
html = html.replace(
  '<hr><p>📍 Rawai, Mueang Phuket<br>83130, Thaïlande</p><hr><p>◉ WI-FI : PALM_VILLA</p>',
  '<hr><div class="hero-address"><a class="hero-address-link" href="https://maps.app.goo.gl/FGqQaWS7jSWPc6JS9" target="_blank" rel="noopener noreferrer" aria-label="Ouvrir l’adresse de la villa dans Google Maps"><span aria-hidden="true">📍</span><span><strong>Adresse de la villa</strong><br>67/82 Soi Sylvia<br>Rawai, Mueang, Phuket District 83130</span></a><a class="hero-qr" href="https://maps.app.goo.gl/FGqQaWS7jSWPc6JS9" target="_blank" rel="noopener noreferrer" aria-label="Ouvrir la géolocalisation de la villa"><img src="assets/icons/villa-location-qr.svg" alt="QR code de géolocalisation de la villa"></a></div>'
);

if (!html.includes('<b>320 m²</b> D\'EXCEPTION')) throw new Error('Area replacement failed');
if (!html.includes('villa-location-qr.svg')) throw new Error('Address replacement failed');
if (html.includes('WI-FI : PALM_VILLA')) throw new Error('Wi-Fi line still present');
fs.writeFileSync(file, html);
