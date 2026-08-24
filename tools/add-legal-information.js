const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
const footer = '<footer><div class="wrap footer-compact"><div class="brand"><img class="footer-logo" src="assets/images/image-006.png" alt="Palms Garden Villa"><span><b>PALM</b><small>GARDEN VILLA · RAWAI</small></span></div><div class="footer-wish">We wish you a wonderful stay!</div></div></footer>';
const replacement = '<footer><div class="wrap footer-compact"><div class="brand"><img class="footer-logo" src="assets/images/image-006.png" alt="Palms Garden Villa"><span><b>PALM</b><small>GARDEN VILLA · RAWAI</small></span></div><div class="footer-wish">We wish you a wonderful stay!</div></div><div class="wrap footer-legal"><button id="openLegalInformation" type="button">Legal Information</button><span aria-hidden="true">·</span><span>Powered by Koh Concept</span></div></footer><div class="legal-modal" id="legalInformationModal" aria-hidden="true"><div class="legal-dialog" role="dialog" aria-modal="true" aria-labelledby="legalInformationTitle"><button class="legal-close" id="closeLegalInformation" type="button" aria-label="Close legal information">×</button><div class="kicker">PALMS GARDEN —</div><h2 class="serif" id="legalInformationTitle">Legal Information</h2><section><h3>Website Publisher</h3><p>Palms Garden Villa<br>Operated by: [LEGAL NAME OF OWNER OR OPERATING COMPANY]<br>Phuket, Thailand<br>Contact: [PROFESSIONAL EMAIL]</p></section><section><h3>Hosting Provider</h3><p>SuperHosting.BG Ltd.<br>5 Nikola Tesla Str., BSR 2, 4th Floor<br>1574 Sofia, Bulgaria<br>UIN: 131449987<br>superhosting.bg</p></section><section><h3>Privacy</h3><p>This website does not directly collect personal data and does not use advertising or analytics tracking technologies.</p></section></div></div>';

if (!html.includes(footer)) throw new Error('Footer attendu introuvable.');
html = html.replace(footer, replacement);
fs.writeFileSync(file, html);
console.log('Accès et modal Legal Information ajoutés.');
