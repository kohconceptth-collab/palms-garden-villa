const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
html = html.replace('<div class="fact"><b>24/7</b>CONFORT</div>', '');
html = html.replace('<div class="fact"><b>4.5</b>SALLES DE BAIN</div>', '<div class="fact"><b>4</b>SALLES DE BAINS</div>');
html = html.replace('<div class="fact"><b>2</b>CUISINES</div>', '<div class="fact"><b>1</b>CUISINE</div>');
if (html.includes('<b>24/7</b>CONFORT')) throw new Error('Comfort fact removal failed');
if (!html.includes('<div class="fact"><b>4</b>SALLES DE BAINS</div>')) throw new Error('Bathroom count update failed');
if (!html.includes('<div class="fact"><b>1</b>CUISINE</div>')) throw new Error('Kitchen count update failed');
fs.writeFileSync(file, html);

const cssFile = 'css/style.css';
let css = fs.readFileSync(cssFile, 'utf8');
css = css.replace(
  ".side div{background:url('../assets/images/image-003.png') 75% 55%/cover}.side div+div{background-position:25% 60%}",
  ".side div{background:url('../assets/images/gallery-elena/06-terrasse-piscine.png') center/cover}.side div+div{background-image:url('../assets/images/villa-preview-bathroom.jpg');background-position:center}"
);
css = css.replace(/\n\/\* Distinct villa gallery previews \*\/[\s\S]*$/, '\n');
if (css.includes("image-003.png') 75% 55%/cover")) throw new Error('Preview CSS replacement failed');
fs.writeFileSync(cssFile, css);
