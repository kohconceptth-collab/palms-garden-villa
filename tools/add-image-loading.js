const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

html = html.replace(/<img\b[^>]*>/gi, (tag) => {
  if (/src=["'](?:assets\/images\/image-006\.webp|assets\/icons\/villa-location-qr\.svg)["']/i.test(tag)) {
    return /\bdecoding=/i.test(tag) ? tag : tag.replace(/>$/, ' decoding="async">');
  }
  let result = tag;
  if (!/\bloading=/i.test(result)) result = result.replace(/>$/, ' loading="lazy">');
  if (!/\bdecoding=/i.test(result)) result = result.replace(/>$/, ' decoding="async">');
  return result;
});

fs.writeFileSync(file, html);
console.log('Lazy loading and asynchronous decoding applied.');
