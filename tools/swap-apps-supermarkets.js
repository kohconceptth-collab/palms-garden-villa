const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

const heroButtonBefore = '<a class="cta" href="#villa">DÉCOUVRIR LA VILLA　⊕</a>';
const heroButtonAfter = '<a class="cta" href="#villa">DÉCOUVRIR LA VILLA</a>';
if (!html.includes(heroButtonBefore)) {
  throw new Error('Bouton « Découvrir la villa » introuvable.');
}
html = html.replace(heroButtonBefore, heroButtonAfter);

const appsMarker = '<div class="panel apps">';
const supermarketsMarker = '<div class="panel essentials-panel">';
const reviewMarker = '<div class="panel review-panel">';
const appsStart = html.indexOf(appsMarker);
const supermarketsStart = html.indexOf(supermarketsMarker, appsStart);
const reviewStart = html.indexOf(reviewMarker, supermarketsStart);

if (appsStart < 0 || supermarketsStart < 0 || reviewStart < 0) {
  throw new Error('Blocs Applications utiles ou Supermarchés introuvables.');
}

const appsBlock = html.slice(appsStart, supermarketsStart);
const supermarketsBlock = html.slice(supermarketsStart, reviewStart);
html = html.slice(0, appsStart) + supermarketsBlock + appsBlock + html.slice(reviewStart);

fs.writeFileSync(file, html);
console.log('Icône du bouton supprimée et blocs Applications/Supermarchés intervertis.');
