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

/* New cinematic full-page physics background — original scene-based renderer */
(() => {
  const canvas=document.getElementById('physicsCanvas');
  if(!canvas) return;
  document.body.appendChild(canvas);
  canvas.classList.add('site-physics-canvas');
  const ctx=canvas.getContext('2d');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w=0,h=0,dpr=1,t=0,last=performance.now(),pageP=0;
  const P=Array.from({length:150},()=>({x:Math.random(),y:Math.random(),z:.15+Math.random()*.85,s:Math.random()*6.28}));
  function resize(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
  function stroke(style,width=1){ctx.strokeStyle=style;ctx.lineWidth=width}
  function wave(y,amp,len,phase,alpha){stroke('rgba(32,120,180,'+alpha+')',1.5);ctx.beginPath();for(let x=-30;x<=w+30;x+=3){let yy=y+Math.sin(x/len-phase)*amp;if(x<0)ctx.moveTo(x,yy);else ctx.lineTo(x,yy)}ctx.stroke()}
  function draw(now){
    const dt=Math.min(.035,(now-last)/1000);last=now;t+=dt;
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    pageP+=(scrollY/max-pageP)*.025;
    ctx.clearRect(0,0,w,h);

    // NASA-like depth: a very restrained star/particle field.
    for(const p of P){
      p.x+=dt*(.004+.006*p.z); p.s+=dt*.4;
      if(p.x>1.05)p.x=-.05;
      const x=p.x*w, y=((p.y-pageP*.16*p.z)%1+1)%1*h;
      const a=.035+.09*p.z*(.65+.35*Math.sin(p.s));
      ctx.fillStyle='rgba(25,105,165,'+a+')';
      ctx.beginPath();ctx.arc(x,y,.5+1.5*p.z,0,Math.PI*2);ctx.fill();
    }

    // SPIE-inspired optics: travelling EM waves and a moving photon packet.
    wave(h*.24,26,150,t*.55,.14);
    wave(h*.48,40,205,-t*.42,.11);
    wave(h*.73,24,125,t*.72,.08);
    const photonX=((t*.08)%1)*(w+300)-150;
    const photonY=h*.48+Math.sin(t*.65)*28;
    const beam=ctx.createLinearGradient(photonX-180,photonY,photonX+30,photonY);
    beam.addColorStop(0,'rgba(55,160,220,0)');beam.addColorStop(.75,'rgba(55,160,220,.16)');beam.addColorStop(1,'rgba(55,160,220,0)');
    ctx.strokeStyle=beam;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(photonX-180,photonY);ctx.lineTo(photonX+30,photonY);ctx.stroke();
    ctx.fillStyle='rgba(45,150,215,.24)';ctx.beginPath();ctx.arc(photonX,photonY,3,0,Math.PI*2);ctx.fill();

    // Scene engine: the background subtly changes as the visitor scrolls.
    const scene=pageP*4;
    const sceneIndex=Math.floor(scene);
    const local=scene-sceneIndex;
    ctx.save();
    ctx.globalAlpha=.65;

    // Atomic / quantum scene.
    const ax=w*(.74-.08*local), ay=h*(.40+.10*local);
    for(let i=0;i<6;i++){
      ctx.save();ctx.translate(ax,ay);ctx.rotate(t*.035+i*.52+local);
      stroke('rgba(40,115,170,'+(.045+i*.012)+')');
      ctx.beginPath();ctx.ellipse(0,0,70+i*34,28+i*15,0,0,Math.PI*2);ctx.stroke();ctx.restore();
    }
    const pulse=18+8*Math.sin(t*1.5);
    const rg=ctx.createRadialGradient(ax,ay,0,ax,ay,45+pulse);
    rg.addColorStop(0,'rgba(55,150,215,.22)');rg.addColorStop(1,'rgba(55,150,215,0)');
    ctx.fillStyle=rg;ctx.beginPath();ctx.arc(ax,ay,45+pulse,0,Math.PI*2);ctx.fill();

    // Quantum probability cloud.
    const qx=w*(.28+.12*Math.sin(t*.11)), qy=h*(.64+.05*Math.sin(t*.18));
    for(let i=0;i<24;i++){
      const ang=i*.73+t*.08, r=28+((i*17)%80);
      const x=qx+Math.cos(ang)*r, y=qy+Math.sin(ang)*r*.55;
      ctx.fillStyle='rgba(75,130,190,'+(.018+.012*(i%4))+')';
      ctx.beginPath();ctx.arc(x,y,5+(i%3)*3,0,Math.PI*2);ctx.fill();
    }

    // Field-line system.
    const fx=w*(.18+.55*local), fy=h*.58;
    for(let i=-4;i<=4;i++){
      stroke('rgba(35,115,170,'+(.035+Math.abs(i)*.008)+')');
      ctx.beginPath();ctx.moveTo(fx-280,fy+i*35);
      ctx.bezierCurveTo(fx-120,fy-100+i*18,fx+120,fy+100-i*18,fx+280,fy+i*35);ctx.stroke();
    }

    // Spectrum signature.
    const sx=w*.62, sy=h*.86, sw=Math.min(340,w*.30);
    const spec=['190,70,90','225,130,55','225,195,55','70,155,100','65,125,195','105,80,175'];
    spec.forEach((rgb,i)=>{ctx.fillStyle='rgba('+rgb+',.11)';ctx.fillRect(sx+i*sw/6,sy,sw/6-3,5)});
    ctx.restore();

    // Tiny equations in negative space, not over the primary copy.
    ctx.font='12px Georgia,serif';ctx.fillStyle='rgba(25,95,145,.10)';
    ['E = hf','λ = h/p','∇ × E = −∂B/∂t','ΔxΔp ≥ ℏ/2'].forEach((s,i)=>ctx.fillText(s,w*.06+(i%2)*w*.17,h*(.30+Math.floor(i/2)*.20)));

    if(!reduce)requestAnimationFrame(draw);
  }
  addEventListener('resize',resize);resize();draw(performance.now());
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
