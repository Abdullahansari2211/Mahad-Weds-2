(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Opening reveal: scroll stays locked until the guest opens the invitation.
  const opening = $('#opening');
  function openInvitation(){
    opening.classList.add('is-open');
    document.body.classList.remove('locked');
    if (!reduceMotion) startAmbient();
    setTimeout(() => opening.remove(), 1100);
  }
  $('#openInvite').addEventListener('click', openInvitation);
  $('#openInvite').addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') openInvitation();
  });

  // Countdown uses the fixed +05:30 offset requested in the brief.
  const target = new Date('2026-12-27T20:00:00+05:30').getTime();
  function updateCountdown(){
    const remaining = target - Date.now();
    if (remaining <= 0) {
      $('#countdownClock').innerHTML = '<p class="just-married">Just Married</p>';
      $('#countdownNote').textContent = 'A beautiful new chapter has begun.';
      return;
    }
    const values = {
      days: Math.floor(remaining / 86400000),
      hours: Math.floor((remaining % 86400000) / 3600000),
      minutes: Math.floor((remaining % 3600000) / 60000),
      seconds: Math.floor((remaining % 60000) / 1000)
    };
    Object.entries(values).forEach(([id, value]) => { const node = document.getElementById(id); if(node) node.textContent = String(value).padStart(2,'0'); });
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Scroll reveal.
  const revealNodes = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), {threshold: .12});
    revealNodes.forEach(node => observer.observe(node));
  } else revealNodes.forEach(node => node.classList.add('visible'));

  // A soft shower of illustrated blossoms and individual rose petals.
  function startAmbient(){
    if (reduceMotion) return;
    const field = $('#flowerField');
    if (!field || field.childElementCount) return;
    const mobile = window.innerWidth < 600;
    const bloomCount = mobile ? 8 : 13;
    for(let i=0;i<bloomCount;i++){
      const bloom = document.createElement('span');
      bloom.className = 'flower bloom';
      bloom.setAttribute('aria-hidden','true');
      for(let p=0;p<8;p++){
        const petal = document.createElement('i');
        petal.style.setProperty('--petal-angle', `${p*45}deg`);
        bloom.appendChild(petal);
      }
      const core = document.createElement('b');
      bloom.appendChild(core);
      bloom.style.left = `${Math.random()*100}%`;
      bloom.style.animationDuration = `${23+Math.random()*22}s`;
      bloom.style.animationDelay = `${-Math.random()*36}s`;
      bloom.style.setProperty('--bloom-size', `${mobile ? 13+Math.random()*8 : 16+Math.random()*12}px`);
      bloom.style.opacity = `${.46+Math.random()*.38}`;
      field.appendChild(bloom);
    }
    const petalCount = mobile ? 10 : 18;
    for(let i=0;i<petalCount;i++){
      const petal = document.createElement('span');
      petal.className = 'flower falling-petal';
      petal.setAttribute('aria-hidden','true');
      petal.style.left = `${Math.random()*100}%`;
      petal.style.animationDuration = `${14+Math.random()*18}s`;
      petal.style.animationDelay = `${-Math.random()*28}s`;
      petal.style.setProperty('--petal-width', `${5+Math.random()*5}px`);
      petal.style.setProperty('--petal-height', `${9+Math.random()*8}px`);
      petal.style.opacity = `${.38+Math.random()*.4}`;
      field.appendChild(petal);
    }
  }

  // Candle-like warm cursor glow with a short, fading particle trail.
  const canvas = $('#cursorCanvas'), ctx = canvas.getContext('2d');
  let points = [], raf = 0, pointer = {x:-100,y:-100}, lastMove = 0;
  function resizeCanvas(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(innerWidth*dpr); canvas.height = Math.floor(innerHeight*dpr);
    canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resizeCanvas();
  function drawGlow(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    const now = performance.now();
    points = points.filter(p => now-p.t < 650);
    points.forEach((p,i) => {
      const age = (now-p.t)/650, alpha = (1-age)*.27;
      const radius = 3 + (1-age)*8;
      const gradient = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,radius*3.2);
      gradient.addColorStop(0,`rgba(255,226,174,${alpha})`);
      gradient.addColorStop(.35,`rgba(210,158,86,${alpha*.55})`);
      gradient.addColorStop(1,'rgba(210,158,86,0)');
      ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(p.x,p.y,radius*3.2,0,Math.PI*2);ctx.fill();
    });
    if(now-lastMove<1500 || points.length) raf=requestAnimationFrame(drawGlow); else raf=0;
  }
  function addPoint(x,y){
    pointer={x,y};lastMove=performance.now();points.push({x,y,t:lastMove});
    if(points.length>24)points.shift();
    if(!raf)raf=requestAnimationFrame(drawGlow);
  }
  if(!reduceMotion && matchMedia('(pointer:fine)').matches){
    window.addEventListener('pointermove',e=>addPoint(e.clientX,e.clientY),{passive:true});
  }
  window.addEventListener('pointerdown',e=>{
    if(matchMedia('(pointer:coarse)').matches && !reduceMotion){
      const ripple=document.createElement('span');ripple.className='tap-ripple';ripple.style.left=`${e.clientX}px`;ripple.style.top=`${e.clientY}px`;
      $('#tapRippleLayer').appendChild(ripple);setTimeout(()=>ripple.remove(),950);
    }
  },{passive:true});
  window.addEventListener('resize',resizeCanvas,{passive:true});

  // A dotted S-curve with a small plane that tracks the guest's scroll.
  const svg=$('#flightPath'), base=$('#planeBase'), travelled=$('#planeTravelled'), plane=$('#planeGroup');
  let pathLength=0;
  function buildFlightPath(){
    const pageHeight=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);
    svg.setAttribute('viewBox',`0 0 ${innerWidth} ${pageHeight}`);
    svg.style.height=`${pageHeight}px`;
    const w=innerWidth, h=pageHeight;
    const d=`M ${w*.13} 0 C ${w*.88} ${h*.12}, ${w*.12} ${h*.23}, ${w*.86} ${h*.36} S ${w*.14} ${h*.62}, ${w*.86} ${h*.76} S ${w*.18} ${h*.91}, ${w*.72} ${h}`;
    base.setAttribute('d',d);travelled.setAttribute('d',d);
    pathLength=base.getTotalLength();base.style.strokeDasharray='1 15';travelled.style.strokeDasharray='12 12';
    updatePlane();
  }
  function updatePlane(){
    if(!pathLength)return;
    const maxScroll=document.documentElement.scrollHeight-innerHeight;
    const progress=maxScroll>0?scrollY/maxScroll:0;
    const point=base.getPointAtLength(Math.max(0,Math.min(1,progress))*pathLength);
    const ahead=base.getPointAtLength(Math.min(pathLength,Math.max(0,Math.min(1,progress))*pathLength+2));
    const angle=Math.atan2(ahead.y-point.y,ahead.x-point.x)*180/Math.PI;
    plane.setAttribute('transform',`translate(${point.x-32},${point.y-24}) rotate(${angle},32,24)`);
    travelled.style.strokeDasharray=`${progress*pathLength} ${pathLength}`;
  }
  buildFlightPath();
  window.addEventListener('scroll',updatePlane,{passive:true});
  window.addEventListener('resize',buildFlightPath,{passive:true});
  if('ResizeObserver' in window)new ResizeObserver(buildFlightPath).observe(document.body);

  // Gallery lightbox with keyboard and swipe support.
  const galleryImages=$$('.gallery-item img').map(img=>({src:img.src,alt:img.alt}));
  const lightbox=$('#lightbox'), lightboxImage=$('#lightboxImage'), counter=$('#lightboxCounter');
  let current=0,touchX=0;
  function showImage(index){
    current=(index+galleryImages.length)%galleryImages.length;
    lightboxImage.src=galleryImages[current].src;lightboxImage.alt=galleryImages[current].alt;
    counter.textContent=`${current+1} / ${galleryImages.length}`;
  }
  function openLightbox(index){showImage(index);lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
  function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.style.overflow='';}
  $$('.gallery-item').forEach(btn=>btn.addEventListener('click',()=>openLightbox(Number(btn.dataset.index))));
  $('#lightboxClose').addEventListener('click',closeLightbox);
  $('#lightboxPrev').addEventListener('click',()=>showImage(current-1));
  $('#lightboxNext').addEventListener('click',()=>showImage(current+1));
  lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});
  lightbox.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].screenX;},{passive:true});
  lightbox.addEventListener('touchend',e=>{const dx=e.changedTouches[0].screenX-touchX;if(Math.abs(dx)>45)showImage(current+(dx<0?1:-1));},{passive:true});
  window.addEventListener('keydown',e=>{
    if(e.key==='Escape'){closeLightbox();if(!opening.classList.contains('is-open')){}}
    if(lightbox.classList.contains('open')&&e.key==='ArrowRight')showImage(current+1);
    if(lightbox.classList.contains('open')&&e.key==='ArrowLeft')showImage(current-1);
  });

  // Lantern wish interaction.
  $('#wishLantern').addEventListener('click',()=>{
    for(let i=0;i<3;i++){
      const lantern=document.createElement('span');lantern.className='lantern';lantern.textContent='♧';
      lantern.style.left=`${38+i*12}%`;lantern.style.setProperty('--drift',`${(i-1)*70}px`);
      lantern.style.animationDelay=`${i*.35}s`;document.body.appendChild(lantern);setTimeout(()=>lantern.remove(),5600);
    }
  });


  // Download an iCalendar file containing each supplied celebration.
  $('#addCalendar').addEventListener('click',()=>{
    const events=[
      {name:'Mehndi',start:'20261226T200000',end:'20261226T230000'},
      {name:'Barat',start:'20261227T200000',end:'20261227T230000'},
      {name:'Walima',start:'20261228T193000',end:'20261228T223000'}
    ];
    const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Mahad Wedding//Celebrations//EN','CALSCALE:GREGORIAN'];
    events.forEach((event,i)=>{
      lines.push('BEGIN:VEVENT',`UID:mahad-wedding-${i+1}@invitation.local`,`DTSTAMP:${stamp}`,
        `DTSTART;TZID=Asia/Karachi:${event.start}`,`DTEND;TZID=Asia/Karachi:${event.end}`,
        `SUMMARY:${event.name} — Muhammad Mahad & Mrs. Mahad`,'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    const blob=new Blob([lines.join('\r\n')],{type:'text/calendar;charset=utf-8'});
    const url=URL.createObjectURL(blob), link=document.createElement('a');
    link.href=url;link.download='mahad-wedding-celebrations.ics';document.body.appendChild(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  });

  // Local wedding song supplied by the user. Try autoplay; browser policies may require a gesture.
  const video=$('#weddingVideo'), toggle=$('#musicToggle'), status=$('#musicStatus');
  const musicPlayer=$('#musicPlayer'), progress=$('#musicProgress');
  let musicStarted=false;

  function setMusicState(playing){
    toggle.innerHTML=playing?'<span>Ⅱ</span>':'<span>▶</span>';
    toggle.setAttribute('aria-label',playing?'Pause wedding song':'Play wedding song');
    musicPlayer.classList.toggle('is-playing',playing);
    if(playing){status.textContent='Now playing · enjoy the melody';}
    else if(video.ended){status.textContent='Song finished · tap to play again';}
    else if(video.currentTime>0){status.textContent='Paused · tap to continue';}
  }

  async function startWeddingSong(){
    if(!video)return;
    try{
      video.muted=false;
      video.volume=1;
      await video.play();
      musicStarted=true;
      setMusicState(true);
    }catch(error){
      // Audible autoplay is commonly blocked until the visitor interacts with the page.
      status.textContent='Tap the golden play button to start music';
      setMusicState(false);
    }
  }

  toggle.addEventListener('click',async()=>{
    if(video.paused || video.ended){
      if(video.ended)video.currentTime=0;
      await startWeddingSong();
    }else{
      video.pause();
      setMusicState(false);
    }
  });

  video.addEventListener('play',()=>setMusicState(true));
  video.addEventListener('pause',()=>{if(!video.ended)setMusicState(false);});
  video.addEventListener('ended',()=>{setMusicState(false);progress.style.width='0%';});
  video.addEventListener('timeupdate',()=>{
    if(video.duration)progress.style.width=`${(video.currentTime/video.duration)*100}%`;
  });
  video.addEventListener('error',()=>{status.textContent='Song file could not be loaded';});

  // Attempt immediately, then retry once on the visitor's first interaction if blocked.
  startWeddingSong();
  const retryAutoplay=()=>{
    if(!musicStarted && video.paused)startWeddingSong();
    window.removeEventListener('pointerdown',retryAutoplay);
    window.removeEventListener('keydown',retryAutoplay);
    window.removeEventListener('touchstart',retryAutoplay);
  };
  window.addEventListener('pointerdown',retryAutoplay,{once:true,passive:true});
  window.addEventListener('keydown',retryAutoplay,{once:true});
  window.addEventListener('touchstart',retryAutoplay,{once:true,passive:true});
})();
