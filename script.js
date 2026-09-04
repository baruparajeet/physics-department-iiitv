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

/* New cinematic full-page physics background
   Original animation removed. This background uses a restrained scientific
   visual language: waves, particles, field lines, light/spectrum and depth.
*/
(() => {
  const canvas=document.getElementById('physicsCanvas');
  if(!canvas) return;
  document.body.appendChild(canvas);
  canvas.classList.add('site-physics-canvas');
  const ctx=canvas.getContext('2d');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w=0,h=0,dpr=1,t=0,last=performance.now(),scroll=0,targetScroll=0;

  const dots=Array.from({length:110},()=>({
    x:Math.random(), y:Math.random(), z:.15+Math.random()*.85,
    vx:(Math.random()-.5)*.012, vy:(Math.random()-.5)*.006,
    r:.6+Math.random()*1.8
  }));

  function resize(){
    w=innerWidth; h=innerHeight; dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=w*dpr; canvas.height=h*dpr;
    canvas.style.width=w+'px'; canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function line(x1,y1,x2,y2,a=.12){
    ctx.strokeStyle='rgba(35,105,155,'+a+')';
    ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  }
  function wave(y,amp,len,phase,alpha,width=1){
    ctx.strokeStyle='rgba(25,125,190,'+alpha+')';ctx.lineWidth=width;
    ctx.beginPath();
    for(let x=-20;x<=w+20;x+=4){
      const yy=y+Math.sin(x/len-phase)*amp;
      x===-20?ctx.moveTo(x,yy):ctx.lineTo(x,yy);
    }
    ctx.stroke();
  }
  function draw(now){
    const dt=Math.min(.04,(now-last)/1000); last=now; t+=dt;
    targetScroll=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight);
    scroll+=(targetScroll-scroll)*.035;
    ctx.clearRect(0,0,w,h);

    // Deep, almost invisible scientific grid.
    const grid=56;
    for(let x=(t*5)%grid;x<w;x+=grid) line(x,0,x,h,.035);
    for(let y=(t*2)%grid;y<h;y+=grid) line(0,y,w,y,.035);

    // Large slow travelling waves — the main visual signature.
    wave(h*.25,34,170,t*.75,.18,1.4);
    wave(h*.48,52,230,-t*.55,.13,1.2);
    wave(h*.72,30,145,t*.9,.11,1);

    // Optical light beam sweeping gently through the field.
    const beamY=h*(.36+Math.sin(t*.18)*.08);
    const grad=ctx.createLinearGradient(0,beamY,w,beamY);
    grad.addColorStop(0,'rgba(45,150,220,0)');
    grad.addColorStop(.35,'rgba(45,150,220,.03)');
    grad.addColorStop(.7,'rgba(45,150,220,.14)');
    grad.addColorStop(1,'rgba(45,150,220,0)');
    ctx.strokeStyle=grad;ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(0,beamY);ctx.lineTo(w,beamY-35);ctx.stroke();

    // Field-line arcs create depth without dominating the content.
    const cx=w*(.72-scroll*.12),cy=h*.50;
    for(let i=0;i<7;i++){
      ctx.strokeStyle='rgba(35,115,170,'+(.055+i*.009)+')';
      ctx.lineWidth=1;
      ctx.beginPath();
      ctx.ellipse(cx,cy,100+i*55,45+i*27,t*.04+i*.18,0,Math.PI*2);
      ctx.stroke();
    }

    // Particle field with subtle parallax as the page scrolls.
    for(const p of dots){
      p.x+=p.vx*dt*60; p.y+=p.vy*dt*60;
      if(p.x<-.05)p.x=1.05;if(p.x>1.05)p.x=-.05;
      if(p.y<-.05)p.y=1.05;if(p.y>1.05)p.y=-.05;
      const px=p.x*w, py=(p.y-scroll*.12*p.z)*h;
      const pulse=.65+.35*Math.sin(t*1.4+p.x*12);
      ctx.fillStyle='rgba(30,115,175,'+(0.10*p.z*pulse)+')';
      ctx.beginPath();ctx.arc(px,py,p.r*p.z,0,Math.PI*2);ctx.fill();
    }

    // Subtle photon trail moving across the screen.
    for(let i=0;i<8;i++){
      const q=(t*.045+i/8)%1;
      const x=q*(w+240)-120;
      const y=h*.58+Math.sin(q*Math.PI*5+t*.15)*45;
      ctx.fillStyle='rgba(35,145,205,.20)';
      ctx.beginPath();ctx.arc(x,y,2.2,0,Math.PI*2);ctx.fill();
      line(x-45,y+8,x-5,y,.06);
    }

    // Spectrum: a restrained optical signature near the lower field.
    const sx=w*.68, sy=h*.86, sw=Math.min(300,w*.25);
    const bands=['rgba(190,70,90,.11)','rgba(220,135,60,.11)','rgba(225,190,65,.11)','rgba(70,155,105,.11)','rgba(65,125,190,.11)','rgba(110,80,170,.11)'];
    bands.forEach((col,i)=>{ctx.fillStyle=col;ctx.fillRect(sx+i*sw/6,sy,sw/6-2,4);});

    // Very faint mathematical notation, positioned away from the main copy.
    ctx.font='12px Georgia,serif';ctx.fillStyle='rgba(30,100,150,.12)';
    ['E = hf','λ = h/p','∇ · E = ρ/ε₀','ΔxΔp ≥ ℏ/2'].forEach((s,i)=>{
      ctx.fillText(s,w*.06+(i%2)*w*.16,h*(.30+Math.floor(i/2)*.18));
    });

    if(!reduce) requestAnimationFrame(draw);
  }
  addEventListener('resize',resize);
  addEventListener('scroll',()=>{scrollY&&(scroll=scroll)}, {passive:true});
  resize();draw(performance.now());
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
