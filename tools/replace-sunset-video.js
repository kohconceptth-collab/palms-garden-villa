const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
html = html.replace(
  '<div class="sunset"><div class="serif" style="font-size:26px">Un coucher de soleil,<br>un souvenir éternel...</div></div>',
  '<div class="sunset rawai-video-block"><video class="rawai-direct-video" muted playsinline loop preload="metadata" controls aria-label="Découvrir le district de Rawai"><source src="assets/videos/rawai-district-phuket.mp4" type="video/mp4"></video></div>'
);
if (html.includes('Un coucher de soleil,')) throw new Error('Sunset block replacement failed');
if (!html.includes('rawai-district-phuket.mp4')) throw new Error('Video insertion failed');
fs.writeFileSync(file, html);
