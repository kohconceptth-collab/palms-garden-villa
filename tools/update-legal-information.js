const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

const replacements = [
  ['Operated by: [LEGAL NAME OF OWNER OR OPERATING COMPANY]', 'Website Owner: Chavdar Tiholov'],
  ['Contact: [PROFESSIONAL EMAIL]', 'Contact: <a href="mailto:office@biomind.bg">office@biomind.bg</a>'],
  ['Powered by Koh Concept', 'Website by Koh Concept Co., Ltd.']
];

for (const [from, to] of replacements) {
  const count = html.split(from).length - 1;
  if (count !== 1) throw new Error(`Expected one occurrence of: ${from}; found ${count}`);
  html = html.replace(from, to);
}

fs.writeFileSync(file, html);
