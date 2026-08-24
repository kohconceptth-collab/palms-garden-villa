const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
const videos = [
  ['assets/videos/video-001-web.mp4', 'assets/videos/video-001-web.webm'],
  ['assets/videos/video-002-web.mp4', 'assets/videos/video-002-web.webm'],
  ['assets/videos/rawai-district-phuket.mp4', 'assets/videos/rawai-district-phuket.webm'],
];

for (const [mp4, webm] of videos) {
  const mp4Source = `<source src="${mp4}" type="video/mp4">`;
  const sources = `<source src="${webm}" type="video/webm">${mp4Source}`;
  if (!html.includes(mp4Source)) throw new Error(`MP4 source not found: ${mp4}`);
  html = html.replace(mp4Source, sources);
}

fs.writeFileSync(file, html);
console.log('WebM sources added before MP4 fallbacks.');
