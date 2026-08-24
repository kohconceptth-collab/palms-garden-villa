const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

const replacements = [
  {
    from: '<button class="gallery-item" type="button" aria-label="Agrandir la vue large de la piscine"><img src="assets/images/gallery-elena/03-piscine-vue-large.png" alt="Vue large de la piscine et de la villa" loading="lazy"></button>',
    to: '<button class="gallery-item" type="button" aria-label="Agrandir la cuisine et la salle à manger"><img src="assets/images/gallery-elena/full/IMG-20251223-WA0135.jpg" alt="Cuisine équipée et salle à manger d’Palms Garden Villa" loading="lazy"></button>'
  },
  {
    from: '<button class="gallery-item" type="button" aria-label="Agrandir la terrasse avec transats"><img src="assets/images/gallery-elena/04-piscine-transats.png" alt="Terrasse ensoleillée avec transats au bord de la piscine" loading="lazy"></button>',
    to: '<button class="gallery-item" type="button" aria-label="Agrandir la première chambre"><img src="assets/images/gallery-elena/full/IMG-20251223-WA0125.jpg" alt="Chambre élégante ouverte sur le jardin tropical" loading="lazy"></button>'
  },
  {
    from: '<button class="gallery-item" type="button" aria-label="Agrandir la piscine avec palmier central"><img src="assets/images/gallery-elena/05-piscine-palmier.png" alt="Piscine avec palmier central et terrasse" loading="lazy"></button>',
    to: '<button class="gallery-item" type="button" aria-label="Agrandir la salle de bain"><img src="assets/images/gallery-elena/full/IMG-20251223-WA0110.jpg" alt="Salle de bain raffinée avec baignoire et double vasque" loading="lazy"></button>'
  },
  {
    from: '<button class="gallery-item gallery-wide" type="button" aria-label="Agrandir la terrasse ouverte sur le séjour"><img src="assets/images/gallery-elena/07-terrasse-sejour.png" alt="Terrasse ouverte sur le séjour et l’espace repas" loading="lazy"></button>',
    to: '<button class="gallery-item gallery-wide" type="button" aria-label="Agrandir la chambre principale"><img src="assets/images/gallery-elena/full/IMG-20251223-WA0138.jpg" alt="Chambre principale avec décoration contemporaine" loading="lazy"></button>'
  }
];

for (const { from, to } of replacements) {
  if (!html.includes(from)) throw new Error(`Aperçu introuvable : ${from}`);
  html = html.replace(from, to);
}

fs.writeFileSync(file, html);
console.log('Aperçus de la galerie diversifiés : 3 piscines, 4 intérieurs.');
