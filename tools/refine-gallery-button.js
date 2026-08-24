const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
html = html.replace('<p>Découvrez la piscine, le jardin tropical et les espaces de vie de la villa.</p>', '');
html = html.replace('>VOIR + <span aria-hidden="true">⊕</span></button>', '>Voir +</button>');
if (html.includes('Découvrez la piscine, le jardin tropical et les espaces de vie de la villa.')) throw new Error('Gallery description removal failed');
if (!html.includes('id="openGallery" type="button">Voir +</button>')) throw new Error('Gallery button label update failed');
fs.writeFileSync(file, html);

const cssFile = 'css/style.css';
let css = fs.readFileSync(cssFile, 'utf8');
css = css.replace(
  '.gallery-heading-actions{display:flex;flex-direction:column;align-items:flex-end;gap:15px;max-width:420px}.gallery-heading-actions p{max-width:none}.gallery-see-more{border:1px solid var(--g);border-radius:5px;background:var(--g);color:#07131b;padding:11px 17px;font:700 10px Montserrat,Arial,sans-serif;letter-spacing:.04em;cursor:pointer;transition:.2s}.gallery-see-more:hover,.gallery-see-more:focus-visible{background:#07131b;color:#fff}',
  '.gallery-heading-actions{display:flex;align-items:flex-end}.gallery-see-more{border:1px solid var(--g);background:transparent;color:var(--g);border-radius:7px;padding:8px 15px;font:600 10px Montserrat,Arial,sans-serif;letter-spacing:.05em;cursor:pointer;transition:.2s}.gallery-see-more:hover,.gallery-see-more:focus-visible{background:var(--g);color:#fff}'
);
if (css.includes('background:var(--g);color:#07131b;padding:11px 17px')) throw new Error('Gallery button CSS update failed');
fs.writeFileSync(cssFile, css);
