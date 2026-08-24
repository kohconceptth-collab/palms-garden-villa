const fs = require('fs');

const file = 'js/script.js';
let script = fs.readFileSync(file, 'utf8');
let replacements = 0;

script = script.replace(/assets\/images\/(image-(?:0(?:19|[2-9][0-9])|1(?:0[0-9]|1[0-8]))\.jpg)/g, (_match, filename) => {
  replacements += 1;
  return `assets/images/gift-hd/${filename}`;
});

if (replacements !== 100) throw new Error(`100 références attendues, ${replacements} trouvées.`);
fs.writeFileSync(file, script);
console.log('Animation reliée aux 100 images HD.');
