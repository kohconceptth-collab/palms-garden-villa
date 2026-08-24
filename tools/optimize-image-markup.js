const fs = require('fs');
const path = require('path');
const sharp = require('C:/Users/trist/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

const root = path.resolve(__dirname, '..');
const images = path.join(root, 'assets', 'images');

(async () => {
  const jpg = path.join(images, 'image-001.jpg');
  const source = fs.existsSync(jpg) ? jpg : path.join(images, 'image-001.webp');
  const target = path.join(images, 'image-001-mobile.webp');
  await sharp(source).resize({width: 900, height: 900, fit: 'inside', withoutEnlargement: true}).webp({quality: 78, effort: 6}).toFile(target);

  const htmlPath = path.join(root, 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  const tags = [...html.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
  const uniqueSources = [...new Set(tags.map(tag => (tag.match(/\bsrc=["']([^"']*)/) || [])[1]).filter(Boolean))];
  const dimensions = new Map();
  for (const src of uniqueSources) {
    if (/^(?:https?:|data:)/.test(src)) continue;
    const file = path.join(root, ...src.split('/'));
    if (!fs.existsSync(file)) continue;
    try {
      const metadata = await sharp(file).metadata();
      if (metadata.width && metadata.height) dimensions.set(src, [metadata.width, metadata.height]);
    } catch {}
  }
  html = html.replace(/<img\b[^>]*>/g, tag => {
    if (/\bwidth=/.test(tag) || /\bheight=/.test(tag)) return tag;
    const src = (tag.match(/\bsrc=["']([^"']*)/) || [])[1];
    const size = dimensions.get(src);
    return size ? tag.slice(0, -1) + ` width="${size[0]}" height="${size[1]}">` : tag;
  });
  fs.writeFileSync(htmlPath, html);
  console.log(`Created ${path.basename(target)}: ${(fs.statSync(target).size / 1024).toFixed(1)} KiB; sized ${dimensions.size} image sources.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
