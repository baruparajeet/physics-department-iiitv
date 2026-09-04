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

/* Rich animated galaxy + solar system physics background */
(() => {
 const canvas=document.getElementById('physicsCanvas'); if(!canvas)return;
 document.body.appendChild(canvas); canvas.classList.add('site-physics-canvas');
 const ctx=canvas.getContext('2d'); let w=0,h=0,dpr=1,t=0,last=performance.now();
 const stars=Array.from({length:850},()=>({x:Math.random(),y:Math.random(),z:.08+Math.random()*.92,r:.25+Math.random()*1.5,p:Math.random()*6.28}));
 const dust=Array.from({length:260},()=>({a:Math.random()*Math.PI*2,r:.1+Math.random()*.55,z:.2+Math.random()*.8,v:.0007+Math.random()*.002}));
 const shoots=Array.from({length:5},()=>({p:Math.random(),y:.1+Math.random()*.75,s:.35+Math.random()*.55}));
 const planets=[
   {r:.075,size:3.2,color:'130,170,205',speed:1.7},
   {r:.13,size:5.0,color:'205,155,90',speed:1.15},
   {r:.19,size:4.2,color:'85,155,220',speed:.82},
   {r:.27,size:7.2,color:'185,120,75',speed:.52},
   {r:.36,size:10,color:'150,175,205',speed:.30}
 ];
 function resize(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
 function glow(x,y,r,c1,c2){
   const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c1);g.addColorStop(.28,c2);g.addColorStop(1,'rgba(0,0,0,0)');
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
 }
 function frame(now){
   const dt=Math.min(.04,(now-last)/1000);last=now;t+=dt;
   ctx.clearRect(0,0,w,h);
   const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#01020a');bg.addColorStop(.45,'#040817');bg.addColorStop(1,'#01040b');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);

   // Large drifting nebula fields.
   glow(w*.16+Math.sin(t*.025)*35,h*.30,Math.max(w,h)*.42,'rgba(40,90,190,.055)','rgba(55,65,150,.035)');
   glow(w*.72+Math.cos(t*.018)*45,h*.63,Math.max(w,h)*.48,'rgba(95,45,165,.045)','rgba(30,90,170,.025)');
   glow(w*.48,h*.08+Math.sin(t*.02)*30,Math.max(w,h)*.36,'rgba(40,150,210,.04)','rgba(20,70,140,.02)');

   // Milky Way: dense diagonal stellar band.
   ctx.save();ctx.translate(w*.5,h*.5);ctx.rotate(-.27);
   for(let i=0;i<7;i++){
     const band=ctx.createLinearGradient(-w*.8,0,w*.8,0);
     band.addColorStop(0,'rgba(90,135,190,0)');
     band.addColorStop(.18,'rgba(110,150,205,.018)');
     band.addColorStop(.5,'rgba(160,185,220,.055)');
     band.addColorStop(.82,'rgba(110,150,205,.018)');
     band.addColorStop(1,'rgba(90,135,190,0)');
     ctx.fillStyle=band;ctx.fillRect(-w*.8,-h*.045+i*h*.014,w*1.6,h*.012);
   }
   ctx.restore();

   // Stars with parallax and twinkle.
   for(const s of stars){
     s.p+=dt*(.35+s.z*1.2);
     const px=(s.x*w+Math.sin(t*.018+s.p)*4*s.z+w)%w, py=s.y*h;
     const tw=.48+.52*Math.sin(s.p),a=.12+.78*s.z*tw;
     ctx.fillStyle='rgba(225,238,255,'+a+')';ctx.beginPath();ctx.arc(px,py,s.r*s.z,0,Math.PI*2);ctx.fill();
     if(s.z>.88&&tw>.93){ctx.strokeStyle='rgba(195,225,255,.30)';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(px-5,py);ctx.lineTo(px+5,py);ctx.moveTo(px,py-5);ctx.lineTo(px,py+5);ctx.stroke()}
   }

   // Spiral-galaxy dust particles.
   const gcx=w*.76,gcy=h*.45;
   for(const p of dust){
     p.a+=dt*p.v*6;
     const rr=p.r*Math.min(w,h)*.95;
     const spiral=p.a+rr/(Math.min(w,h)*.75)*4;
     const x=gcx+Math.cos(spiral)*rr, y=gcy+Math.sin(spiral)*rr*.55;
     const alpha=.025+.055*p.z;
     ctx.fillStyle='rgba(135,185,225,'+alpha+')';ctx.beginPath();ctx.arc(x,y,1+p.z*1.2,0,Math.PI*2);ctx.fill();
   }

   // Solar system focal point.
   const sx=w*.48,sy=h*.48,unit=Math.min(w,h);
   glow(sx,sy,unit*.13,'rgba(255,235,170,.18)','rgba(255,160,50,.075)');
   glow(sx,sy,unit*.055,'rgba(255,245,195,.55)','rgba(255,155,35,.18)');
   const sunG=ctx.createRadialGradient(sx-unit*.012,sy-unit*.012,0,sx,sy,unit*.034);
   sunG.addColorStop(0,'#fff8d0');sunG.addColorStop(.45,'rgba(255,211,105,.96)');sunG.addColorStop(1,'rgba(235,105,25,.65)');
   ctx.fillStyle=sunG;ctx.beginPath();ctx.arc(sx,sy,unit*.034,0,Math.PI*2);ctx.fill();

   // Rotating solar surface arcs.
   ctx.save();ctx.translate(sx,sy);ctx.rotate(t*.55);
   for(let i=0;i<6;i++){ctx.strokeStyle='rgba(255,225,125,'+(0.10-i*.012)+')';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,unit*(.038+i*.002),unit*(.020+i*.001),i*.35,0,Math.PI*2);ctx.stroke()}
   ctx.restore();

   // Planetary orbits.
   planets.forEach((p,i)=>{
     const rx=unit*p.r,ry=rx*(.38+.05*Math.sin(i));
     ctx.save();ctx.translate(sx,sy);ctx.rotate(-.16+i*.07);
     ctx.strokeStyle='rgba(125,190,225,'+(.08-i*.009)+')';ctx.lineWidth=1;
     ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2);ctx.stroke();ctx.restore();
     const a=t*p.speed+i*1.55;
     const x=sx+rx*Math.cos(a),y=sy+ry*Math.sin(a);
     glow(x,y,p.size*3,'rgba(100,190,240,.06)','rgba(70,130,190,.025)');
     const pg=ctx.createRadialGradient(x-p.size*.3,y-p.size*.3,0,x,y,p.size);
     pg.addColorStop(0,'rgba(235,245,255,.9)');pg.addColorStop(.2,'rgba('+p.color+',.95)');pg.addColorStop(1,'rgba('+p.color+',.45)');
     ctx.fillStyle=pg;ctx.beginPath();ctx.arc(x,y,p.size,0,Math.PI*2);ctx.fill();
     if(i===3){ctx.strokeStyle='rgba(205,190,160,.42)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y,p.size*2.1,p.size*.55,-.2,0,Math.PI*2);ctx.stroke()}
   });

   // Travelling gravitational-wave ribbons.
   for(let k=0;k<3;k++){
     ctx.strokeStyle='rgba(75,180,235,'+(.065-k*.014)+')';ctx.lineWidth=1;
     ctx.beginPath();
     for(let x=-30;x<w+30;x+=4){
       const y=h*(.68+k*.09)+Math.sin(x/(130+k*55)-t*(.75-k*.1))*(18+k*10);
       x<0?ctx.moveTo(x,y):ctx.lineTo(x,y);
     }ctx.stroke();
   }

   // Shooting stars.
   shoots.forEach(s=>{
     s.p=(s.p+dt*.035*s.s)%1;
     const x=s.p*(w+260)-130,y=s.y*h;
     const len=70+90*s.s;
     ctx.strokeStyle='rgba(180,225,255,.32)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x-len,y-len*.18);ctx.lineTo(x,y);ctx.stroke();
   });

   // Photon/laser beam.
   const q=(t*.055)%1,bx=q*(w+360)-180,by=h*.28+Math.sin(t*.55)*28;
   const beam=ctx.createLinearGradient(bx-260,by,bx+30,by);
   beam.addColorStop(0,'rgba(80,200,255,0)');beam.addColorStop(.72,'rgba(80,200,255,.10)');beam.addColorStop(1,'rgba(200,245,255,.42)');
   ctx.strokeStyle=beam;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(bx-260,by);ctx.lineTo(bx+30,by);ctx.stroke();
   glow(bx,by,12,'rgba(190,240,255,.20)','rgba(100,200,255,.05)');

   // Bottom spectral line.
   const sy2=h*.91,sw=Math.min(360,w*.32),cc=['190,70,100','220,130,65','230,200,75','75,165,105','70,140,215','120,85,190'];
   cc.forEach((c,i)=>{ctx.fillStyle='rgba('+c+',.12)';ctx.fillRect(w*.60+i*sw/6,sy2,sw/6-3,3)});

   if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)requestAnimationFrame(frame);
 }
 addEventListener('resize',resize);resize();frame(performance.now());
})();/* Compact homepage / click-to-open section navigation */
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
