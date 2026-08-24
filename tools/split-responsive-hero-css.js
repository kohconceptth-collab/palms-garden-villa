const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', 'css', 'style.css');
let css = fs.readFileSync(file, 'utf8');
const desktop = "linear-gradient(90deg,rgba(2,12,18,.94),rgba(2,12,18,.55) 38%,rgba(2,12,18,.18) 68%,rgba(2,12,18,.48)),url('../assets/images/image-001.webp') center/cover no-repeat";
const from = `.hero{min-height:700px;color:#fff;position:relative;background:${desktop}}`;
const to = `.hero{min-height:700px;color:#fff;position:relative;background:#06131c}@media(min-width:851px){.hero{background:${desktop}}}`;
const count = css.split(from).length - 1;
if (count !== 1) throw new Error(`Expected one base Hero rule, found ${count}`);
css = css.replace(from, to);
fs.writeFileSync(file, css);
