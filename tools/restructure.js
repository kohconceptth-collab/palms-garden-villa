const fs = require('fs');
const path = require('path');

const source = process.argv[2];
if (!source) throw new Error('Usage: node tools/restructure.js <source.html> [--audit]');
const html = fs.readFileSync(source, 'utf8');

const count = (re) => [...html.matchAll(re)].length;
if (process.argv.includes('--audit')) {
  const urls = [...new Set([...html.matchAll(/(?:src|href)=["'](https?:[^"']+)/gi)].map((m) => m[1]))];
  console.log(JSON.stringify({
    bytes: Buffer.byteLength(html),
    styles: count(/<style\b/gi), scripts: count(/<script\b/gi),
    dataUris: count(/data:(?:image|video|font)\//gi), imgs: count(/<img\b/gi),
    videos: count(/<video\b/gi), forms: count(/<form\b/gi),
    iframes: count(/<iframe\b/gi), ids: count(/\sid=/gi), urls,
  }, null, 2));
  console.log('STYLE_BLOCKS', [...html.matchAll(/<style([^>]*)>([\s\S]*?)<\/style>/gi)].map((m, i) => ({i, attrs:m[1], chars:m[2].length})));
  console.log('SCRIPT_BLOCKS', [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)].map((m, i) => ({i, attrs:m[1], chars:m[2].length, head:m[2].trim().slice(0,80)})));
  const mimeCounts = {};
  for (const m of html.matchAll(/data:([^;,]+)(?:;[^,]*)?,/gi)) mimeCounts[m[1]] = (mimeCounts[m[1]] || 0) + 1;
  console.log('MIME_COUNTS', mimeCounts);
  const tags = [...html.matchAll(/<script([^>]*)>[\s\S]*?<\/script>/gi)];
  console.log('SCRIPT_GAPS', tags.slice(0, -1).map((m, i) => ({i, gap: tags[i+1].index - (m.index + m[0].length), sample: html.slice(m.index + m[0].length, tags[i+1].index).replace(/\s+/g,' ').slice(0,160)})));
}

if (!process.argv.includes('--audit')) {
  const root = process.cwd();
  const dirs = ['css', 'js', 'assets/images', 'assets/videos', 'assets/icons'];
  for (const dir of dirs) fs.mkdirSync(path.join(root, dir), { recursive: true });

  const counters = { image: 0, video: 0, font: 0 };
  const extracted = [];
  let rewritten = html.replace(/data:([^;,]+)((?:;[^,]*)?),(.*?)(?=["')])/gis, (full, mime, params, payload) => {
    const normalized = mime.toLowerCase();
    if (!/^(image\/(?:png|jpeg)|video\/mp4)$/.test(normalized) || !/;base64/i.test(params)) return full;
    const kind = normalized.startsWith('video/') ? 'video' : 'image';
    const ext = normalized === 'image/png' ? 'png' : normalized === 'image/jpeg' ? 'jpg' : 'mp4';
    const folder = kind === 'video' ? 'assets/videos' : 'assets/images';
    const filename = `${kind}-${String(++counters[kind]).padStart(3, '0')}.${ext}`;
    const rel = `${folder}/${filename}`;
    const data = Buffer.from(payload.replace(/\s/g, ''), 'base64');
    fs.writeFileSync(path.join(root, rel), data);
    extracted.push({ rel, mime: normalized, bytes: data.length });
    return rel;
  });

  const styles = [];
  let firstStyle = true;
  rewritten = rewritten.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, (_full, attrs, css) => {
    styles.push(`/* Source style block ${styles.length + 1}${attrs.trim() ? ` (${attrs.trim()})` : ''} */\n${css.trim()}`);
    if (firstStyle) {
      firstStyle = false;
      return '<link rel="stylesheet" href="css/style.css">';
    }
    return '';
  });

  const scripts = [];
  let insertedScript = false;
  rewritten = rewritten.replace(/<script([^>]*)>([\s\S]*?)<\/script>/gi, (full, attrs, js) => {
    if (/\bsrc\s*=/.test(attrs)) return full;
    scripts.push(`// Source script block ${scripts.length + 1}\n${js.trim()}`);
    if (!insertedScript) {
      insertedScript = true;
      return '<script src="js/script.js" defer></script>';
    }
    return '';
  });

  const css = styles.join('\n\n').replace(/url\((['"]?)assets\//g, 'url($1../assets/');
  fs.writeFileSync(path.join(root, 'index.html'), rewritten);
  fs.writeFileSync(path.join(root, 'css/style.css'), `${css}\n`);
  fs.writeFileSync(path.join(root, 'js/script.js'), `${scripts.join('\n\n')}\n`);

  console.log(JSON.stringify({ extracted: extracted.length, counters, htmlBytes: Buffer.byteLength(rewritten), cssBytes: Buffer.byteLength(css), jsBytes: Buffer.byteLength(scripts.join('\n\n')) }, null, 2));
}
