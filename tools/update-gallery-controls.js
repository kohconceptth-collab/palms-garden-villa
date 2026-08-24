const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
html = html.replace(
  '<p>Découvrez la piscine, le jardin tropical et les espaces de vie de la villa.</p></div><div class="gallery-grid">',
  '<div class="gallery-heading-actions"><p>Découvrez la piscine, le jardin tropical et les espaces de vie de la villa.</p><button class="gallery-see-more" id="openGallery" type="button">VOIR + <span aria-hidden="true">⊕</span></button></div></div><div class="gallery-grid">'
);
html = html.replace(
  '<div class="gallery-lightbox" id="galleryLightbox" aria-hidden="true"><button class="gallery-close"',
  '<div class="gallery-lightbox" id="galleryLightbox" aria-hidden="true"><a class="gallery-download" href="#" download aria-label="Télécharger cette image"><i data-lucide="download" aria-hidden="true"></i></a><button class="gallery-close"'
);
if (!html.includes('id="openGallery"')) throw new Error('Gallery button insertion failed');
if (!html.includes('class="gallery-download"')) throw new Error('Download control insertion failed');
fs.writeFileSync(file, html);
