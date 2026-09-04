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

/* Complete galaxy theme — original IIITV canvas implementation */
(() => {
 const canvas=document.getElementById('physicsCanvas'); if(!canvas)return;
 document.body.appendChild(canvas); canvas.classList.add('site-physics-canvas');
 const ctx=canvas.getContext('2d'); let w=0,h=0,dpr=1,t=0,last=performance.now();
 const stars=Array.from({length:520},()=>({x:Math.random(),y:Math.random(),z:.08+Math.random()*.92,r:.25+Math.random()*1.35,p:Math.random()*6.28}));
 const neb=Array.from({length:180},()=>({x:Math.random(),y:Math.random(),r:20+Math.random()*140,a:.012+Math.random()*.035}));
 const dust=Array.from({length:180},()=>({x:Math.random(),y:Math.random(),z:.1+Math.random()*.9,v:.001+Math.random()*.003,p:Math.random()*6.28}));
 function resize(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
 function frame(now){
  const dt=Math.min(.04,(now-last)/1000);last=now;t+=dt;ctx.clearRect(0,0,w,h);
  // Deep galaxy base.
  const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#01030a');bg.addColorStop(.45,'#030916');bg.addColorStop(1,'#01040a');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  // Slow nebula clouds.
  for(const n of neb){
   const x=n.x*w+Math.sin(t*.025+n.p)*35,y=n.y*h+Math.cos(t*.021+n.p)*25;
   const g=ctx.createRadialGradient(x,y,0,x,y,n.r);g.addColorStop(0,'rgba(55,105,190,'+n.a+')');g.addColorStop(.55,'rgba(70,55,150,'+(n.a*.45)+')');g.addColorStop(1,'rgba(0,0,0,0)');
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,n.r,0,Math.PI*2);ctx.fill();
  }
  // Milky-way style diagonal dust lane.
  ctx.save();ctx.translate(w*.5,h*.53);ctx.rotate(-.24);
  const mw=ctx.createLinearGradient(-w*.65,0,w*.65,0);mw.addColorStop(0,'rgba(80,130,180,0)');mw.addColorStop(.5,'rgba(105,145,190,.075)');mw.addColorStop(1,'rgba(80,130,180,0)');
  ctx.fillStyle=mw;ctx.fillRect(-w*.7,-h*.09,w*1.4,h*.18);ctx.restore();
  // Deep star field with parallax.
  for(const s of stars){
   s.p+=dt*(.2+s.z*.8);const x=s.x*w+Math.sin(t*.012+s.p)*2*s.z;const y=s.y*h;
   const tw=.55+.45*Math.sin(s.p),a=.16+.60*s.z*tw;
   ctx.fillStyle='rgba(225,238,255,'+a+')';ctx.beginPath();ctx.arc(x,y,s.r*s.z,0,Math.PI*2);ctx.fill();
   if(s.z>.82&&tw>.92){ctx.strokeStyle='rgba(190,225,255,.22)';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x+4,y);ctx.moveTo(x,y-4);ctx.lineTo(x,y+4);ctx.stroke()}
  }
  // Moving cosmic dust.
  for(const p of dust){
   p.x+=dt*p.v;if(p.x>1.05)p.x=-.05;
   const x=p.x*w,y=p.y*h+Math.sin(t*.06+p.p)*8;
   ctx.fillStyle='rgba(100,175,220,'+(.025+.07*p.z)+')';ctx.beginPath();ctx.arc(x,y,1.1*p.z,0,Math.PI*2);ctx.fill();
  }
  // Large orbital paths / physics geometry.
  ctx.save();ctx.translate(w*.72,h*.43);
  for(let i=0;i<8;i++){ctx.rotate(.025*Math.sin(t*.12)+.13);ctx.strokeStyle='rgba(105,180,225,'+(.025+i*.006)+')';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,85+i*58,25+i*23,0,0,Math.PI*2);ctx.stroke()}
  ctx.restore();
  // Subtle gravitational-wave ripples.
  for(let k=0;k<3;k++){ctx.strokeStyle='rgba(90,170,220,'+(.055-k*.012)+')';ctx.lineWidth=1;ctx.beginPath();for(let x=-20;x<w+20;x+=4){const y=h*(.52+k*.12)+Math.sin(x/(190+k*50)-t*(.38-k*.04))* (20+k*10);x<0?ctx.moveTo(x,y):ctx.lineTo(x,y)}ctx.stroke()}
  // A small luminous spacecraft-like photon point travelling through the galaxy.
  const q=(t*.035)%1,x=q*(w+300)-150,y=h*.31+Math.sin(t*.23)*45;
  const trail=ctx.createLinearGradient(x-230,y,x+20,y);trail.addColorStop(0,'rgba(120,210,255,0)');trail.addColorStop(.8,'rgba(100,205,255,.13)');trail.addColorStop(1,'rgba(220,245,255,.28)');
  ctx.strokeStyle=trail;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-230,y);ctx.lineTo(x+20,y);ctx.stroke();ctx.fillStyle='rgba(215,245,255,.75)';ctx.beginPath();ctx.arc(x,y,2.2,0,Math.PI*2);ctx.fill();
  // Distant spectral glow.
  const sy=h*.88,sw=Math.min(330,w*.3),cols=['190,70,100','220,130,65','225,195,70','70,160,105','70,135,210','115,85,185'];
  cols.forEach((c,i)=>{ctx.fillStyle='rgba('+c+',.10)';ctx.fillRect(w*.60+i*sw/6,sy,sw/6-3,3)});
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
