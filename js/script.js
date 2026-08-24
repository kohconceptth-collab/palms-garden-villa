// Source script block 1
function hydrateVideoSources(video){
  const sources=[...video.querySelectorAll('source[data-src]')];
  if(!sources.length)return false;
  sources.forEach(source=>{
    source.src=source.dataset.src;
    source.removeAttribute('data-src');
  });
  video.preload='auto';
  video.load();
  return true;
}


// Replace the 100-request image sequence with one smooth, mobile-friendly video.
const giftPoster=document.getElementById('giftFrame');
const giftVideo=document.createElement('video');
giftVideo.id='giftVideo';
giftVideo.muted=true;
giftVideo.playsInline=true;
giftVideo.loop=true;
giftVideo.preload='none';
giftVideo.setAttribute('aria-label',giftPoster.alt);
giftVideo.innerHTML='<source data-src="assets/videos/video-villa-gift-generic-v2.mp4" type="video/mp4">';
giftPoster.replaceWith(giftVideo);

let giftVideoRequested=false;
let giftVideoInView=false;
const playGiftVideo=()=>{
  if(!giftVideoInView)return;
  if(giftVideo.ended||giftVideo.currentTime>=giftVideo.duration-0.05)giftVideo.currentTime=0;
  giftVideo.play().catch(()=>{});
};
if('IntersectionObserver' in window){
  const giftVideoObserver=new IntersectionObserver(entries=>{
    const entry=entries[0];
    giftVideoInView=entry.isIntersecting&&entry.intersectionRatio>=0.3;
    if(giftVideoInView){
      if(!giftVideoRequested){
        giftVideoRequested=true;
        hydrateVideoSources(giftVideo);
      }
      if(giftVideo.readyState>=3)playGiftVideo();
      else giftVideo.addEventListener('canplay',playGiftVideo,{once:true});
    }else{
      giftVideo.pause();
    }
  },{rootMargin:'0px',threshold:[0,0.3,0.7]});
  giftVideoObserver.observe(giftVideo);
}else{
  giftVideoInView=true;
  giftVideoRequested=true;
  hydrateVideoSources(giftVideo);
  giftVideo.addEventListener('canplay',playGiftVideo,{once:true});
}
document.addEventListener('visibilitychange',()=>{
  if(document.hidden)giftVideo.pause();
  else if(giftVideoInView)playGiftVideo();
});

// Source script block 2
// Villa video: full first play, then seamless 15-second ping-pong loop.
// The second embedded video contains: last 15 s forward + the same 15 s reversed.
(function(){
  const videos=document.querySelectorAll('.villa-main-video');
  const main=videos[0], loop=videos[1];
  const block=document.getElementById('villa');
  if(!main||!loop||!block)return;
  const MIDPOINT=15;
  let switched=false;
  let inView=false;
  let mainRequested=false;
  let loopRequested=false;

  function show(el){
    main.style.display=el===main?'block':'none';
    loop.style.display=el===loop?'block':'none';
  }

  function activeVideo(){
    return switched?loop:main;
  }

  // Pre-seek the loop to its reverse half while the main video is playing.
  // At the end of the main video, playback therefore continues from the same
  // visual endpoint but immediately moves backwards, avoiding a visible jump.
  function primeLoop(){
    try { loop.currentTime=MIDPOINT; } catch(e) {}
  }
  function ensureMain(){
    if(mainRequested)return;
    mainRequested=true;
    hydrateVideoSources(main);
  }

  function ensureLoop(){
    if(loopRequested)return;
    loopRequested=true;
    hydrateVideoSources(loop);
    if(loop.readyState>=1)primeLoop();
    else loop.addEventListener('loadedmetadata',primeLoop,{once:true});
  }

  function switchToPingPong(){
    if(switched) return;
    ensureLoop();
    switched=true;
    main.pause();
    const continueLoop=()=>{
      if(Math.abs(loop.currentTime-MIDPOINT)>0.20)loop.currentTime=MIDPOINT;
      show(loop);
      if(inView)loop.play().catch(()=>{});
    };
    if(loop.readyState>=2)continueLoop();
    else loop.addEventListener('canplay',continueLoop,{once:true});
  }

  main.addEventListener('ended',switchToPingPong);
  // Safety fallback for browsers that occasionally delay the ended event.
  main.addEventListener('timeupdate',()=>{
    if(!switched && main.duration && main.duration-main.currentTime<12)ensureLoop();
    if(!switched && main.duration && main.duration-main.currentTime<0.035){
      switchToPingPong();
    }
  });

  show(main);
  if(block && 'IntersectionObserver' in window){
    const preloadObserver=new IntersectionObserver(entries=>{
      if(!entries[0].isIntersecting)return;
      ensureMain();
      preloadObserver.disconnect();
    },{rootMargin:'500px 0px',threshold:0});
    preloadObserver.observe(block);

    const observer=new IntersectionObserver((entries)=>{
      const entry=entries[0];
      inView=entry.isIntersecting && entry.intersectionRatio>=0.15;
      if(inView){
        ensureMain();
        if(activeVideo().readyState>=2)activeVideo().play().catch(()=>{});
        else activeVideo().addEventListener('canplay',()=>{if(inView)activeVideo().play().catch(()=>{})},{once:true});
      }
      else{
        main.pause();
        loop.pause();
      }
    },{threshold:[0,0.15,0.5]});
    observer.observe(block);
  }

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      main.pause();
      loop.pause();
    }else if(inView){
      activeVideo().play().catch(()=>{});
    }
  });
})();

// Legal information dialog.
(function(){
  const modal=document.getElementById('legalInformationModal');
  const openButton=document.getElementById('openLegalInformation');
  const closeButton=document.getElementById('closeLegalInformation');
  if(!modal||!openButton||!closeButton)return;
  const open=()=>{
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('legal-modal-open');
    closeButton.focus();
  };
  const close=()=>{
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('legal-modal-open');
    openButton.focus();
  };
  openButton.addEventListener('click',open);
  closeButton.addEventListener('click',close);
  modal.addEventListener('click',event=>{if(event.target===modal)close()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&modal.classList.contains('open'))close()});
})();

// Progressive image reveal for the villa album and Rawai destination cards.
(function(){
  const cards=[...document.querySelectorAll('.gallery-item, #rawai .place')];
  if(!cards.length)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){
    cards.forEach(card=>card.classList.add('is-visible'));
    return;
  }
  document.documentElement.classList.add('motion-ready');
  cards.forEach((card,index)=>{
    card.classList.add('visual-card');
    card.style.setProperty('--reveal-delay',`${(index%7)*90}ms`);
  });
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },{threshold:.16,rootMargin:'0px 0px -5%'});
  cards.forEach(card=>observer.observe(card));
})();

// Source script block 3
(function(){
  const brand=document.getElementById('fullscreenBrand');
  if(!brand) return;
  async function toggleFullscreen(){
    try{
      const el=document.documentElement;
      const active=document.fullscreenElement||document.webkitFullscreenElement;
      if(active){
        if(document.exitFullscreen) await document.exitFullscreen();
        else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
        return;
      }
      if(el.requestFullscreen){ await el.requestFullscreen({navigationUI:'hide'}).catch(()=>el.requestFullscreen()); }
      else if(el.webkitRequestFullscreen){ el.webkitRequestFullscreen(); }
    }catch(e){ /* Browser may block fullscreen outside supported contexts. */ }
  }
  brand.addEventListener('click',function(e){e.preventDefault();toggleFullscreen();});
  brand.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();toggleFullscreen();}});
})();

// Source script block 4
(function(){const m=document.getElementById('houseRulesModal'),o=document.getElementById('openHouseRules'),c=document.getElementById('closeHouseRules');if(!m||!o)return;const open=()=>{m.classList.add('open');m.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'};const close=()=>{m.classList.remove('open');m.setAttribute('aria-hidden','true');document.body.style.overflow=''};o.addEventListener('click',open);c&&c.addEventListener('click',close);m.addEventListener('click',e=>{if(e.target===m)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&m.classList.contains('open'))close()})})();

// Photo album lightbox.
(function(){
  const modal=document.getElementById('galleryLightbox');
  const previews=[...document.querySelectorAll('.gallery-item img')];
  const galleryCaptions={
    'IMG-20250930-WA0008.webp':'Contemporary bathroom with double vanity and walk-in shower',
    'IMG-20250930-WA0009.webp':'Long dining table in the bright open-plan living space',
    'IMG-20250930-WA0010.webp':'Covered dining area beside the outdoor kitchen',
    'IMG-20250930-WA0011.webp':'Garden-facing dining area under the covered terrace',
    'IMG-20250930-WA0012.webp':'Naturally lit bathroom with bathtub and walk-in shower',
    'IMG-20250930-WA0013.webp':'Open-plan dining area overlooking the pool',
    'IMG-20250930-WA0014.webp':'Covered poolside dining terrace',
    'IMG-20250930-WA0015.webp':'Dining area with a panoramic view of the private pool',
    'IMG-20250930-WA0016.webp':'Open-plan lounge and dining room',
    'IMG-20250930-WA0017.webp':'Covered parking and outdoor kitchen area',
    'IMG-20250930-WA0018.webp':'Landscaped tropical garden with mature palm trees',
    'IMG-20250930-WA0019.webp':'Spacious television lounge with garden views',
    'IMG-20250930-WA0020.webp':'Comfortable lounge in a calm contemporary setting',
    'IMG-20250930-WA0021.webp':'Modern bathroom vanity and large mirror',
    'IMG-20250930-WA0022.webp':'Fully equipped kitchen with breakfast island',
    'IMG-20250930-WA0023.webp':'Private swimming pool and sun terrace',
    'IMG-20250930-WA0024.webp':'Primary bedroom with direct pool access',
    'IMG-20250930-WA0025.webp':'Textured hallway leading to the bedrooms',
    'IMG-20250930-WA0026.webp':'Private pool surrounded by lush tropical greenery',
    'IMG-20250930-WA0028.webp':'Comfortable guest bedroom with air conditioning',
    'IMG-20250930-WA0030.webp':'Pool courtyard framed by palms and tropical plants',
    'IMG-20250930-WA0031.webp':'Garden-view guest bedroom',
    'IMG-20250930-WA0032.webp':'Sun loungers overlooking the landscaped garden',
    'IMG-20250930-WA0033.webp':'Central air-conditioning and lighting controls',
    'IMG-20250930-WA0034.webp':'Spacious covered parking area',
    'IMG-20250930-WA0035.webp':'Pool steps and decorative tropical planting',
    'IMG-20250930-WA0036.webp':'Long pool terrace with sun loungers',
    'IMG-20250930-WA0037.webp':'Drinking-water dispenser in the lounge area',
    'IMG-20250930-WA0038.webp':'Tropical pool courtyard and palm-lined terrace',
    'IMG-20250930-WA0039.webp':'Kitchen island opening onto the living spaces',
    'IMG-20250930-WA0040.webp':'Covered terrace looking out over the pool',
    'IMG-20250930-WA0041.webp':'Room controls and air-conditioning remotes',
    'IMG-20250930-WA0042.webp':'Private villa entrance and intercom',
    'IMG-20250930-WA0043.webp':'Practical utility and storage area',
    'IMG-20250930-WA0044.webp':'Main pool framed by the tropical garden',
    'IMG-20250930-WA0045.webp':'Covered parking with outdoor kitchen and service area'
  };
  const captionFor=(src,index=0)=>galleryCaptions[src.split('/').pop()]||`Palms Garden Villa — photo ${index+1}`;
  const importedPaths=[
    'assets/images/gallery-palms/web/IMG-20250930-WA0008.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0009.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0010.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0011.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0012.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0013.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0014.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0015.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0016.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0017.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0018.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0019.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0020.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0021.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0022.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0023.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0024.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0025.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0026.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0028.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0030.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0031.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0032.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0033.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0034.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0035.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0036.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0037.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0038.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0039.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0040.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0041.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0042.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0043.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0044.webp',
    'assets/images/gallery-palms/web/IMG-20250930-WA0045.webp'
  ];
  const previewPaths=new Set(previews.map(item=>item.dataset.full||item.getAttribute('src')));
  const uniqueImportedPaths=importedPaths.filter(photoPath=>!previewPaths.has(photoPath));
  previews.forEach((item,index)=>{
    const caption=captionFor(item.dataset.full||item.getAttribute('src'),index);
    item.alt=caption;
    item.closest('button')?.setAttribute('aria-label',`Enlarge: ${caption}`);
  });
  const items=[
    ...previews.map((item,index)=>({src:item.dataset.full||item.src,alt:captionFor(item.dataset.full||item.getAttribute('src'),index),trigger:item.closest('button')})),
    ...uniqueImportedPaths.map((src,index)=>({src,alt:captionFor(src,index+previews.length),trigger:null}))
  ];
  if(!modal||!items.length)return;
  const image=modal.querySelector('figure img');
  const caption=modal.querySelector('figcaption');
  const download=modal.querySelector('.gallery-download');
  const openAll=document.getElementById('openGallery');
  let current=0;
  let renderToken=0;
  const preloadAdjacent=index=>{
    [-1,1].forEach(offset=>{
      const neighbour=items[(index+offset+items.length)%items.length];
      const preload=new Image();
      preload.decoding='async';
      preload.src=neighbour.src;
      preload.decode?.().catch(()=>{});
    });
  };
  const show=index=>{
    current=(index+items.length)%items.length;
    const token=++renderToken;
    image.classList.add('is-changing');
    image.src=items[current].src;
    image.alt=items[current].alt;
    caption.textContent=items[current].alt;
    const reveal=()=>{
      if(token!==renderToken)return;
      requestAnimationFrame(()=>image.classList.remove('is-changing'));
    };
    if(image.complete)reveal();
    else image.addEventListener('load',reveal,{once:true});
    preloadAdjacent(current);
    window.refreshSiteTranslation?.();
    if(download){
      download.href=items[current].src;
      download.download=items[current].src.split('/').pop()||'palm-garden-villa.jpg';
    }
  };
  const open=index=>{show(index);modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('gallery-open');modal.querySelector('.gallery-close').focus()};
  const close=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('gallery-open');(items[current].trigger||openAll).focus()};
  previews.forEach((item,index)=>item.closest('button').addEventListener('click',()=>open(index)));
  if(openAll)openAll.addEventListener('click',()=>open(0));
  modal.querySelector('.gallery-close').addEventListener('click',close);
  modal.querySelector('.gallery-prev').addEventListener('click',()=>show(current-1));
  modal.querySelector('.gallery-next').addEventListener('click',()=>show(current+1));
  const figure=modal.querySelector('figure');
  let touchStartX=0;
  let touchStartY=0;
  figure.addEventListener('touchstart',event=>{
    if(event.touches.length!==1)return;
    touchStartX=event.touches[0].clientX;
    touchStartY=event.touches[0].clientY;
  },{passive:true});
  figure.addEventListener('touchend',event=>{
    if(!event.changedTouches.length)return;
    const deltaX=event.changedTouches[0].clientX-touchStartX;
    const deltaY=event.changedTouches[0].clientY-touchStartY;
    if(Math.abs(deltaX)<45||Math.abs(deltaX)<=Math.abs(deltaY)*1.15)return;
    show(current+(deltaX<0?1:-1));
  },{passive:true});
  modal.addEventListener('click',event=>{if(event.target===modal)close()});
  document.addEventListener('keydown',event=>{if(!modal.classList.contains('open'))return;if(event.key==='Escape')close();if(event.key==='ArrowLeft')show(current-1);if(event.key==='ArrowRight')show(current+1)});
})();

// On tablet and mobile, place the practical-information card below the hero.
(function(){
  const hero=document.querySelector('.hero');
  const heroMain=document.querySelector('.hero-main');
  const card=heroMain&&heroMain.querySelector('.glass');
  if(!hero||!heroMain||!card)return;
  const marker=document.createComment('hero-information-card');
  card.before(marker);
  const media=window.matchMedia('(max-width:850px)');
  const placeCard=()=>{
    if(media.matches){
      hero.after(card);
      card.classList.add('glass-detached');
    }else{
      marker.after(card);
      card.classList.remove('glass-detached');
    }
  };
  placeCard();
  if(media.addEventListener)media.addEventListener('change',placeCard);
  else media.addListener(placeCard);
})();

// Play the Rawai video only while its block is visible.
(function(){
  const video=document.querySelector('.rawai-direct-video');
  if(!video)return;
  let requested=false;
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting&&entry.intersectionRatio>=0.35){
        if(!requested){
          requested=true;
          hydrateVideoSources(video);
        }
        if(video.readyState>=2)video.play().catch(()=>{});
        else video.addEventListener('canplay',()=>video.play().catch(()=>{}),{once:true});
      }else{
        video.pause();
      }
    });
  },{threshold:[0,.35,.75]});
  observer.observe(video);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause()});
})();

// Selected services pop-ups, sourced from the provided guest-guide project.
(function(){
  const modal=document.getElementById('serviceModal');
  const grid=document.getElementById('serviceModalGrid');
  const title=document.getElementById('serviceModalTitle');
  const closeButton=document.getElementById('serviceModalClose');
  if(!modal||!grid||!title||!closeButton)return;
  const kohDescriptions={
    fr:'Koh Massage crée des produits de bien-être au CBD et se spécialise dans les expériences de massage premium à domicile. Découvrez le menu en ligne.',
    en:'Koh Massage crafts CBD wellness products and specializes in premium at-home massage experiences. Discover the menu online.',
    th:'Koh Massage ผลิตผลิตภัณฑ์เพื่อสุขภาพจาก CBD และเชี่ยวชาญด้านประสบการณ์นวดระดับพรีเมียมถึงที่พัก ดูเมนูออนไลน์',
    ru:'Koh Massage производит оздоровительную продукцию с CBD и специализируется на премиальном массаже на дому. Ознакомьтесь с меню онлайн.',
    'zh-CN':'Koh Massage 专注于 CBD 健康产品，并提供高品质上门按摩体验。在线查看服务菜单。'
  };
  const kohDescription=()=>kohDescriptions[document.documentElement.lang]||kohDescriptions.en;
  const catalog={
    restaurants:{title:'Restaurants',items:[
      ['Rawai Seafood Market','Seafood market and beachfront restaurants','assets/images/partners/partner-07-abd90aa194ef.webp','', 'https://maps.app.goo.gl/5EkqRgpVwc4kAxXeA'],
      ['Costa Grill Restaurant','French & Italian cuisine, steaks, pizza and seafood','assets/images/partners/partner-08-88ab7a37225a.webp','https://wa.me/66918741184','https://maps.app.goo.gl/XPKujwdZAEnCfX9y6'],
      ['Zen Eat Restaurant','French semi-gastronomic restaurant','assets/images/partners/partner-09-8007ace5f3bc.webp','https://wa.me/66643572979','https://maps.app.goo.gl/3RQpjBep64AvTyev9'],
      ['Happy Jack Restaurant','Gastro bar','assets/images/partners/partner-10-c83ffa2bcc73.webp','https://wa.me/66929656207','https://maps.app.goo.gl/CZXnxJ9Cgh13kzir6'],
      ['Groov Restaurant','Gastro bar','assets/images/partners/partner-11-d2da1dbea443.webp','https://wa.me/66986863787','https://maps.app.goo.gl/VDT5AZLd7P4BcivN8'],
      ['Gusto Restaurant','Italian restaurant','assets/images/partners/partner-12-5519ef857252.webp','https://wa.me/66625430885','https://maps.app.goo.gl/62t2ZijziHXBWCSy7'],
      ['Boost','Healthy breakfast and lunch','assets/images/partners/partner-13-6b07cd0cbb13.webp','https://wa.me/66652649792','https://maps.app.goo.gl/o2DWNXPydfDJHrdL9'],
      ['Pure Prep','Healthy food','assets/images/partners/partner-14-3dbea95c144e.webp','https://wa.me/66952604608','https://maps.app.goo.gl/me9FXfC7vFzxqac87'],
      ['Lucha Cantina','Mexican restaurant','assets/images/partners/partner-15-4a2d064fe017.webp','https://wa.me/66839798906','https://maps.app.goo.gl/AyBHesVEAHDMkmA8A'],
      ['Crème Café','Wine shop with home delivery','assets/images/partners/partner-16-4ca756ba1f3f.webp','https://wa.me/66806545718','https://www.google.com/maps/search/?api=1&query=Cr%C3%A8me%20Caf%C3%A9%20Rawai%2035%2F32%20Moo%201%20Phuket']
    ]},
    spa:{title:'Spa & massages',items:[
      ['Ton Mai Spa','Spa, sauna, pool, massages, restaurant and bar','assets/images/partners/partner-17-2631d458d7ec.webp','https://wa.me/66631175211','https://maps.app.goo.gl/3wo3fLe6bm9C2T7x8'],
      ['Water Lily Spa','Spa, sauna, pool, massages, restaurant and bar','assets/images/partners/partner-18-1f34277443bf.webp','https://wa.me/66838389059','https://maps.app.goo.gl/cX2wnQJCtd8AgM3XA'],
      ['Mermaids Massage','Massage at the shop or directly at the villa','assets/images/partners/partner-19-fd8df8f1e487.webp',['https://wa.me/66801926595','https://wa.me/66993270737'],'https://maps.app.goo.gl/5ANSmLxKn1AUWWiQ7'],
      ['Koh Massage','CBD massage at home','assets/images/partners/partner-20-d6b13eba047c.webp','https://wa.me/66923690809','https://www.kohmassage.com']
    ]},
    bars:{title:'Bars & nightlife',items:[
      ['Gilbis Plaza','Bars and nightlife venue','assets/images/partners/partner-22-a5b635b2dace.webp','','https://www.google.com/maps/search/?api=1&query=Gilbis%20Plaza%20Saiyuan%20Road%20Rawai%20Phuket'],
      ['Larva Bar','Local bar','assets/images/partners/partner-23-b1f3499bd0a0.webp','','https://www.google.com/maps/search/?api=1&query=Larva%20Bar%20Soi%20Saiyuan%20Rawai%20Phuket'],
      ["The Laguna Night's Club",'Nightclub and bars','assets/images/partners/partner-24-72a75c9bbc06.webp','','https://www.google.com/maps/search/?api=1&query=The%20Laguna%20Night%27s%20Club%20Rawai%20Phuket']
    ]},
    motorbikes:{title:'Motorbikes for rent',items:[
      ["Min's Club Motorbikes",'Scooter and motorbike rental','assets/images/partners/partner-25-485ba6400a41.webp','https://wa.me/66985816675','https://www.google.com/maps/search/?api=1&query=Min%27s%20Club%20Phuket%2025%2F95%20Moo%201%20Rawai'],
      ['La Calle Motorbikes','Scooter rental','assets/images/partners/partner-26-13a9fe603927.webp','https://wa.me/66840485661','https://www.google.com/maps/place/La+Calle+Rawai+motorbike+for+rent/@7.7926468,98.3252577,17z'],
      ['Loïc Motorbikes','Motorbike rental','assets/images/partners/partner-04-a225f537c952.webp','','https://www.google.com/maps/search/?api=1&query=Lo%C3%AFc%20Motorbikes%20Rawai%20Phuket']
    ]}
  };
  let opener=null;
  const close=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('service-modal-open');opener?.focus()};
  const open=(key,button)=>{
    const category=catalog[key];
    if(!category)return;
    opener=button;
    title.textContent=category.title;
    grid.innerHTML=category.items.map(([name,description,image,whatsapp,map])=>{const whatsappLinks=(Array.isArray(whatsapp)?whatsapp:[whatsapp]).filter(Boolean);const isKoh=name==='Koh Massage';return `<article class="service-result"><img src="${image}" alt="${name}" loading="lazy"><div><h3>${name}</h3><p${isKoh?' class="notranslate" translate="no" data-localized-service="koh"':''}>${isKoh?kohDescription():description}</p><div class="service-result-actions">${whatsappLinks.map((url,index)=>`<a href="${url}" target="_blank" rel="noopener noreferrer">WhatsApp${whatsappLinks.length>1?` ${index+1}`:''}</a>`).join('')}${map?`<a href="${map}" target="_blank" rel="noopener noreferrer">${map.includes('kohmassage.com')?'Website':'Google Maps'}</a>`:''}</div></div></article>`}).join('');
    window.refreshSiteTranslation?.();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('service-modal-open');
    closeButton.focus();
  };
  document.querySelectorAll('[data-service-category]').forEach(button=>button.addEventListener('click',()=>open(button.dataset.serviceCategory,button)));
  closeButton.addEventListener('click',close);
  modal.addEventListener('click',event=>{if(event.target===modal)close()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&modal.classList.contains('open'))close()});
  document.addEventListener('site-language-change',()=>{const description=grid.querySelector('[data-localized-service="koh"]');if(description)description.textContent=kohDescription()});
})();

// Reliable first-party language selector using the local translation dictionaries.
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
