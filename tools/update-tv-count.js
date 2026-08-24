const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
const replacements = [
  ['<b>5 LARGE TVs</b>', '<b>85" CINEMA-SIZE SMART TV</b>'],
  ['<b>5 TV</b>NETFLIX', '<b>85″ TV</b>BOX TV + NETFLIX'],
];

for (const [before, after] of replacements) {
  if (!html.includes(before)) throw new Error(`Text not found: ${before}`);
  html = html.replace(before, after);
}

fs.writeFileSync(file, html);
console.log('TV count updated from 5 to 1 in both locations.');
