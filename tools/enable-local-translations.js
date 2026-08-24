const fs = require('fs');

const htmlFile='index.html';
let html=fs.readFileSync(htmlFile,'utf8');
const marker='<script src="js/script.js" defer></script>';
const scripts='<script src="js/translations.js" defer></script><script src="js/elena-translations.js" defer></script><script src="js/script.js" defer></script>';
if((html.split(marker).length-1)!==1)throw new Error('Main script marker not found exactly once');
html=html.replace(marker,scripts);
fs.writeFileSync(htmlFile,html);

const scriptFile='js/script.js';
let script=fs.readFileSync(scriptFile,'utf8');
const start=script.indexOf('// Language selector, matching the position and behavior of the provided site.');
if(start<0)throw new Error('Language selector start not found');
const replacement=`// Reliable first-party language selector using the local translation dictionaries.
(function(){
  const selector=document.querySelector('.language-selector');
  const toggle=document.getElementById('languageToggle');
  const menu=document.getElementById('languageMenu');
  const current=document.getElementById('languageCurrent');
  const select=document.getElementById('languageSelect');
  const maps=window.DG_TRANSLATIONS;
  if(!selector||!toggle||!menu||!current||!select||!maps)return;
  const buttons=[...menu.querySelectorAll('[data-language]')];
  const names={fr:'Français',en:'English',th:'ไทย',ru:'Русский','zh-CN':'中文'};
  const supported=Object.keys(names);
  const originalText=new WeakMap();
  const originalAttributes=new WeakMap();
  let activeLanguage=localStorage.getItem('elenaLanguage')||'en';
  if(!supported.includes(activeLanguage))activeLanguage='en';

  const dictionary=language=>maps[language==='zh-CN'?'zh':language]||maps.en;
  const blocked=node=>node.parentElement?.closest('script,style,noscript,.notranslate,[translate="no"]');
  const translateRoot=(root=document.body)=>{
    const words=dictionary(activeLanguage);
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      if(blocked(node))continue;
      if(!originalText.has(node))originalText.set(node,node.nodeValue);
      const source=originalText.get(node);
      const key=source.trim();
      const translated=words[key];
      node.nodeValue=translated?source.replace(key,translated):source;
    }
    root.querySelectorAll('[alt],[title],[aria-label]').forEach(element=>{
      if(element.closest('.notranslate,[translate="no"]'))return;
      if(!originalAttributes.has(element)){
        const saved={};
        ['alt','title','aria-label'].forEach(name=>{if(element.hasAttribute(name))saved[name]=element.getAttribute(name)});
        originalAttributes.set(element,saved);
      }
      const saved=originalAttributes.get(element);
      Object.entries(saved).forEach(([name,source])=>element.setAttribute(name,words[source]||source));
    });
  };
  const sync=()=>{
    const code=activeLanguage==='zh-CN'?'ZH':activeLanguage.toUpperCase();
    current.textContent=code+' · '+names[activeLanguage];
    current.dataset.code=code;
    select.value=activeLanguage;
    buttons.forEach(button=>{
      const active=button.dataset.language===activeLanguage;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-selected',String(active));
    });
    document.documentElement.lang=activeLanguage;
  };
  const apply=language=>{
    activeLanguage=language;
    localStorage.setItem('elenaLanguage',language);
    sync();
    translateRoot();
    document.dispatchEvent(new CustomEvent('site-language-change',{detail:{language}}));
  };
  const close=()=>{menu.hidden=true;selector.classList.remove('is-open');toggle.setAttribute('aria-expanded','false')};
  window.refreshSiteTranslation=()=>translateRoot();
  sync();
  translateRoot();
  toggle.addEventListener('click',()=>{
    const opening=menu.hidden;
    menu.hidden=!opening;
    selector.classList.toggle('is-open',opening);
    toggle.setAttribute('aria-expanded',String(opening));
    if(opening)buttons.find(button=>button.classList.contains('is-active'))?.focus();
  });
  buttons.forEach(button=>button.addEventListener('click',()=>{apply(button.dataset.language);close();toggle.focus()}));
  menu.addEventListener('keydown',event=>{
    if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
    event.preventDefault();
    const focused=Math.max(0,buttons.indexOf(document.activeElement));
    const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(focused+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;
    buttons[next].focus();
  });
  document.addEventListener('click',event=>{if(!selector.contains(event.target))close()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden){close();toggle.focus()}});
})();
`;
script=script.slice(0,start)+replacement;
fs.writeFileSync(scriptFile,script);
