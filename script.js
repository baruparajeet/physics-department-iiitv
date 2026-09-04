const search=document.getElementById('siteSearch');
if(search){search.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const q=search.value.trim().toLowerCase();if(!q)return;const cards=[...document.querySelectorAll('.experiment-card')];const hit=cards.find(c=>c.innerText.toLowerCase().includes(q));if(hit){hit.scrollIntoView({behavior:'smooth',block:'center'});hit.style.outline='3px solid #56b9ef';setTimeout(()=>hit.style.outline='',1600)}else{alert('No matching experiment found on this page.')}})}

/* Scroll-linked physics hero */
(() => {
  const hero = document.querySelector('.hero-physics');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  const updatePhysics = () => {
    const rect = hero.getBoundingClientRect();
    const travel = Math.max(1, rect.height - window.innerHeight * 0.35);
    const progress = Math.max(0, Math.min(1, -rect.top / travel));
    hero.style.setProperty('--p', progress.toFixed(4));
    ticking = false;
  };

  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updatePhysics);
    }
  };

  window.addEventListener('scroll', requestUpdate, {passive:true});
  window.addEventListener('resize', requestUpdate);
  updatePhysics();
})();

/* Original IIITV cinematic aerospace-style background */
(() => {
 const canvas=document.getElementById('physicsCanvas'); if(!canvas)return;
 document.body.appendChild(canvas); canvas.classList.add('site-physics-canvas');
 const ctx=canvas.getContext('2d'); let w=0,h=0,dpr=1,t=0,last=performance.now();
 const stars=Array.from({length:260},()=>({x:Math.random(),y:Math.random(),z:.15+Math.random()*.85,s:.4+Math.random()*1.6}));
 const dust=Array.from({length:90},()=>({x:Math.random(),y:Math.random(),z:.1+Math.random()*.9,v:.001+Math.random()*.004}));
 function resize(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
 function frame(now){
  const dt=Math.min(.04,(now-last)/1000);last=now;t+=dt;ctx.clearRect(0,0,w,h);
  const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#02070b');g.addColorStop(.55,'#07131b');g.addColorStop(1,'#020609');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  for(const s of stars){s.x+=dt*.0008*s.z;if(s.x>1.02)s.x=-.02;const x=s.x*w,y=s.y*h;ctx.fillStyle='rgba(220,240,250,'+(0.18*s.z)+')';ctx.beginPath();ctx.arc(x,y,s.s*s.z,0,Math.PI*2);ctx.fill()}
  for(const p of dust){p.x+=dt*p.v;if(p.x>1.1)p.x=-.1;const x=p.x*w,y=p.y*h;ctx.fillStyle='rgba(80,170,215,'+(0.035+.05*p.z)+')';ctx.beginPath();ctx.arc(x,y,1.2*p.z,0,Math.PI*2);ctx.fill()}
  // horizon glow / cinematic atmosphere
  const hy=h*.66, glow=ctx.createRadialGradient(w*.56,hy,0,w*.56,hy,w*.62);glow.addColorStop(0,'rgba(55,145,205,.12)');glow.addColorStop(.5,'rgba(30,95,145,.035)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  // slow orbital arcs
  ctx.save();ctx.translate(w*.70,h*.45);
  for(let i=0;i<5;i++){ctx.rotate(.08*Math.sin(t*.08)+i*.22);ctx.strokeStyle='rgba(110,185,220,'+(.045+i*.008)+')';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,100+i*70,30+i*25,0,0,Math.PI*2);ctx.stroke()}
  ctx.restore();
  // luminous physics wave travelling across the scene
  for(let j=0;j<2;j++){ctx.strokeStyle='rgba(70,175,225,'+(j?'.075':'.11')+')';ctx.lineWidth=j?1:1.4;ctx.beginPath();for(let x=-40;x<w+40;x+=4){const y=h*(.48+j*.13)+Math.sin(x/(150+j*55)-t*(.65-j*.12))* (28+j*12);x<0?ctx.moveTo(x,y):ctx.lineTo(x,y)}ctx.stroke()}
  // laser/photon streak
  const q=(t*.055)%1,x=q*(w+260)-130,y=h*.34+Math.sin(t*.45)*18;
  const beam=ctx.createLinearGradient(x-220,y,x+25,y);beam.addColorStop(0,'rgba(75,190,235,0)');beam.addColorStop(.8,'rgba(75,190,235,.15)');beam.addColorStop(1,'rgba(150,230,255,0)');
  ctx.strokeStyle=beam;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-220,y);ctx.lineTo(x+25,y);ctx.stroke();ctx.fillStyle='rgba(180,235,255,.45)';ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fill();
  // subtle spectrum at bottom
  const colors=['rgba(180,70,90,.13)','rgba(220,130,60,.13)','rgba(225,190,65,.13)','rgba(70,160,100,.13)','rgba(70,130,205,.13)','rgba(115,80,180,.13)'];colors.forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(w*.62+i*w*.06,h*.88,w*.055,3)});
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)requestAnimationFrame(frame);
 }
 addEventListener('resize',resize);resize();frame(performance.now());
})();
/* Compact homepage / click-to-open section navigation */
(() => {
  const valid = new Set(['about','people','research','facilities','lab','resources','news','notices','contact']);
  const home = () => {
    document.body.classList.add('page-home');
    document.body.classList.remove('page-view');
    document.querySelectorAll('main > .section').forEach(el => {
      el.classList.remove('view-active');
      el.style.display = el.id === 'news' ? 'block' : 'none';
    });
    const footer = document.querySelector('footer');
    if (footer) {
      footer.classList.remove('view-active');
      footer.style.display = 'block';
    }
    window.scrollTo({top:0,left:0,behavior:'auto'});
    document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === 'index.html'));
  };
  const openView = id => {
    if(id === 'notices') id = 'news';
    const target=document.getElementById(id);
    if(!target){ home(); return; }
    document.body.classList.remove('page-home');
    document.body.classList.add('page-view');
    document.querySelectorAll('main > .section, footer').forEach(el => {
      el.classList.remove('view-active');
      el.style.display = 'none';
    });
    target.classList.add('view-active');
    target.style.display = 'block';
    document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#'+id));
    window.scrollTo({top:0,left:0,behavior:'auto'});
  };
  const route = () => {
    const id=location.hash.replace('#','').trim();
    if(valid.has(id)) openView(id); else home();
  };
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href^="#"]');
    if(!a) return;
    const id=a.getAttribute('href').slice(1);
    if(!valid.has(id)) return;
    if(id === 'home') { e.preventDefault(); history.pushState(null,'',location.pathname); home(); return; }
    // News/Notices are intentionally part of the homepage flow.
    if((id === 'news' || id === 'notices') && document.body.classList.contains('page-home')){
      e.preventDefault();
      const target=document.getElementById(id === 'notices' ? 'notices' : 'news');
      if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }
    e.preventDefault();
    history.pushState(null,'','#'+id);
    route();
  });
  window.addEventListener('popstate',route);
  window.addEventListener('hashchange',route);
  route();
})();
