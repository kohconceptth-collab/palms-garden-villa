const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourcePath = process.argv[2];
if (!sourcePath) throw new Error('Usage: node tools/validate.js <source.html>');

const source = fs.readFileSync(sourcePath, 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css/style.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'js/script.js'), 'utf8');
const failures = [];

const localRefs = new Set();
for (const text of [index, css, js]) {
  for (const m of text.matchAll(/(?:src|href)=["']([^"'#]+)|url\(["']?([^"')]+)|["']((?:\.\.\/)?assets\/(?:images|videos|icons)\/[^"']+)["']/gi)) {
    const ref = m[1] || m[2] || m[3];
    if (!ref || ref.includes('${') || /^(?:https?:|mailto:|tel:|javascript:|data:)/i.test(ref)) continue;
    const base = text === css ? path.join(root, 'css') : text === js ? root : root;
    const absolute = path.resolve(base, ref);
    localRefs.add(absolute);
    if (!fs.existsSync(absolute)) failures.push(`Missing local resource: ${ref}`);
  }
}

const ids = new Set([...index.matchAll(/\sid=["']([^"']+)/gi)].map((m) => m[1]));
for (const m of index.matchAll(/href=["']#([^"']+)/gi)) {
  if (!ids.has(m[1])) failures.push(`Broken internal anchor: #${m[1]}`);
}

const tagCount = (text, tag) => [...text.matchAll(new RegExp(`<${tag}\\b`, 'gi'))].length;
const expectedDelta = { section: 4, button: 22, a: 17, img: 16, video: 1, source: 1 };
for (const tag of ['header','nav','main','section','article','button','a','img','video','source']) {
  const before = tagCount(source, tag);
  const after = tagCount(index, tag);
  if (after !== before + (expectedDelta[tag] || 0)) failures.push(`Unexpected element count for <${tag}>: ${before} -> ${after}`);
}

const sourceWithoutStyles = source.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
const sourceIds = [...sourceWithoutStyles.matchAll(/\sid=["']([^"']+)/gi)].map((m) => m[1]).sort();
const outputIds = [...index.matchAll(/\sid=["']([^"']+)/gi)].map((m) => m[1]).sort();
const expectedIds = [...sourceIds, 'galleryLightbox', 'openGallery', 'serviceModal', 'serviceModalClose', 'serviceModalGrid', 'serviceModalTitle', 'languageToggle', 'languageCurrent', 'languageMenu', 'languageSelect', 'google_translate_element', 'navVillaLabel', 'openLegalInformation', 'legalInformationModal', 'closeLegalInformation', 'legalInformationTitle'].sort();
if (JSON.stringify(expectedIds) !== JSON.stringify(outputIds)) failures.push('ID/anchor inventory changed');
if (/data:(?:image|video|font)\//i.test(index + css + js)) failures.push('Embedded data URI remains');
if (!index.includes('css/style.css') || !index.includes('js/script.js')) failures.push('External CSS/JS link missing');

const result = {
  ok: failures.length === 0,
  failures,
  localReferences: localRefs.size,
  files: {
    images: fs.readdirSync(path.join(root, 'assets/images')).filter((n) => /^image-\d{3}\.(?:jpg|png)$/.test(n)).length,
    videos: fs.readdirSync(path.join(root, 'assets/videos')).filter((n) => /^video-\d{3}\.mp4$/.test(n)).length,
    importedGalleryPhotos: fs.readdirSync(path.join(root, 'assets/images/gallery-elena/full')).filter((n) => /\.(?:jpg|jpeg|png|webp)$/i.test(n)).length,
  },
};
if (result.files.importedGalleryPhotos !== 58) {
  result.ok = false;
  result.failures.push(`Expected 58 imported gallery photos, found ${result.files.importedGalleryPhotos}`);
}
console.log(JSON.stringify(result, null, 2));
process.exitCode = result.ok ? 0 : 1;
