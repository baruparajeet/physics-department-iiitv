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

/* Scientifically inspired galaxy + solar-system motion
   Concept: planets orbit the Sun; the Sun/solar system orbits the Milky Way's galactic center;
   the galactic disk rotates differentially. Visual speeds are accelerated for demonstration. */
(() => {
 const canvas=document.getElementById('physicsCanvas'); if(!canvas)return;
 document.body.appendChild(canvas);canvas.classList.add('site-physics-canvas');
 const ctx=canvas.getContext('2d');let w=0,h=0,dpr=1,t=0,last=performance.now();
 const stars=Array.from({length:900},()=>({x:Math.random(),y:Math.random(),z:.08+Math.random()*.92,r:.25+Math.random()*1.5,p:Math.random()*6.28}));
 const arms=Array.from({length:420},()=>({a:Math.random()*Math.PI*2,r:Math.pow(Math.random(),.62),z:Math.random()}));
 const planets=[
  {r:.055,size:2.6,color:'155,175,195',speed:2.2},
  {r:.085,size:3.6,color:'205,155,90',speed:1.55},
  {r:.125,size:4.3,color:'80,155,225',speed:1.15},
  {r:.175,size:5.0,color:'205,115,75',speed:.88},
  {r:.245,size:8.0,color:'175,180,195',speed:.56},
  {r:.33,size:6.4,color:'150,195,215',speed:.39}
 ];
 function resize(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
 function glow(x,y,r,c1,c2){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c1);g.addColorStop(.28,c2);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
 function frame(now){
  const dt=Math.min(.04,(now-last)/1000);last=now;t+=dt;ctx.clearRect(0,0,w,h);
  const bg=ctx.createRadialGradient(w*.5,h*.45,0,w*.5,h*.45,Math.max(w,h)*.75);
  bg.addColorStop(0,'#09152a');bg.addColorStop(.38,'#030918');bg.addColorStop(1,'#010309');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);

  // Milky Way disk: the whole galactic disk slowly rotates around its center.
  const gcx=w*.74,gcy=h*.48,galR=Math.min(w,h)*.48,galRot=t*.018;
  ctx.save();ctx.translate(gcx,gcy);ctx.rotate(galRot);
  glow(0,0,galR*.38,'rgba(150,180,255,.08)','rgba(70,100,210,.035)');
  for(let i=0;i<4;i++){
   ctx.strokeStyle='rgba(125,165,230,'+(.045-i*.006)+')';ctx.lineWidth=1.2;
   ctx.beginPath();ctx.ellipse(0,0,galR*(.25+i*.18),galR*(.10+i*.055),0,0,Math.PI*2);ctx.stroke();
  }
  for(const p of arms){
   const rr=p.r*galR, spiral=p.a+rr/galR*5.0;
   const x=Math.cos(spiral)*rr,y=Math.sin(spiral)*rr*.42;
   const a=.035+.07*(1-p.r)*p.z;
   ctx.fillStyle='rgba(150,195,245,'+a+')';ctx.beginPath();ctx.arc(x,y,.7+1.5*p.z,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
  glow(gcx,gcy,galR*.08,'rgba(255,230,180,.12)','rgba(130,150,230,.035)');

  // Background stars remain mostly fixed relative to the distant universe.
  for(const s of stars){
   s.p+=dt*(.3+s.z);
   const x=(s.x*w+Math.sin(s.p)*3*s.z+w)%w,y=s.y*h;
   const tw=.5+.5*Math.sin(s.p),a=.12+.72*s.z*tw;
   ctx.fillStyle='rgba(225,238,255,'+a+')';ctx.beginPath();ctx.arc(x,y,s.r*s.z,0,Math.PI*2);ctx.fill();
   if(s.z>.9&&tw>.94){ctx.strokeStyle='rgba(205,230,255,.28)';ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x+4,y);ctx.moveTo(x,y-4);ctx.lineTo(x,y+4);ctx.stroke()}
  }

  // The Sun/solar system follows a wide orbit around the galactic center.
  // Real timescales are enormously slower; this is an educational visual acceleration.
  const galacticOrbitR=Math.min(w,h)*.30;
  const solarAngle=t*.035;
  const sx=gcx+Math.cos(solarAngle)*galacticOrbitR;
  const sy=gcy+Math.sin(solarAngle)*galacticOrbitR*.43;
  ctx.save();ctx.translate(gcx,gcy);ctx.rotate(galRot);
  ctx.strokeStyle='rgba(120,180,235,.10)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,galacticOrbitR,galacticOrbitR*.43,0,0,Math.PI*2);ctx.stroke();ctx.restore();

  // Solar-system plane is tilted relative to the viewer.
  const unit=Math.min(w,h),plane=.48;
  glow(sx,sy,unit*.11,'rgba(255,225,145,.15)','rgba(255,150,35,.055)');
  glow(sx,sy,unit*.045,'rgba(255,245,190,.55)','rgba(255,150,35,.15)');
  const sg=ctx.createRadialGradient(sx-unit*.012,sy-unit*.012,0,sx,sy,unit*.034);
  sg.addColorStop(0,'#fffbd8');sg.addColorStop(.42,'rgba(255,213,105,.98)');sg.addColorStop(1,'rgba(235,100,25,.65)');
  ctx.fillStyle=sg;ctx.beginPath();ctx.arc(sx,sy,unit*.034,0,Math.PI*2);ctx.fill();

  // Sun rotation is visualized with surface arcs.
  ctx.save();ctx.translate(sx,sy);ctx.rotate(t*.5);
  for(let i=0;i<7;i++){ctx.strokeStyle='rgba(255,228,135,'+(.11-i*.012)+')';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,unit*(.037+i*.002),unit*(.019+i*.001),i*.27,0,Math.PI*2);ctx.stroke()}
  ctx.restore();

  planets.forEach((p,i)=>{
   const rx=unit*p.r,ry=rx*plane;
   ctx.save();ctx.translate(sx,sy);ctx.rotate(-.18+i*.055);
   ctx.strokeStyle='rgba(125,190,230,'+(.12-i*.009)+')';ctx.lineWidth=1;
   ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2);ctx.stroke();ctx.restore();
   const a=t*p.speed+i*1.35;
   const x=sx+rx*Math.cos(a),y=sy+ry*Math.sin(a);
   glow(x,y,p.size*3,'rgba(100,195,245,.07)','rgba(70,130,190,.02)');
   const pg=ctx.createRadialGradient(x-p.size*.3,y-p.size*.3,0,x,y,p.size);
   pg.addColorStop(0,'rgba(245,250,255,.95)');pg.addColorStop(.25,'rgba('+p.color+',.95)');pg.addColorStop(1,'rgba('+p.color+',.38)');
   ctx.fillStyle=pg;ctx.beginPath();ctx.arc(x,y,p.size,0,Math.PI*2);ctx.fill();
   if(i===4){ctx.strokeStyle='rgba(215,200,165,.45)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y,p.size*2.2,p.size*.55,-.25,0,Math.PI*2);ctx.stroke()}
  });

  // Gravitational-wave style ripples, kept subtle so they don't imply they drive the orbits.
  for(let k=0;k<3;k++){ctx.strokeStyle='rgba(75,180,235,'+(.07-k*.015)+')';ctx.lineWidth=1;ctx.beginPath();for(let x=-30;x<w+30;x+=4){const y=h*(.72+k*.08)+Math.sin(x/(150+k*45)-t*(.65-k*.06))*(16+k*9);x<0?ctx.moveTo(x,y):ctx.lineTo(x,y)}ctx.stroke()}

  // Occasional photons / shooting stars.
  for(let i=0;i<3;i++){const q=(t*(.018+i*.006)+i*.31)%1,x=q*(w+280)-140,y=(.18+i*.22)*h;ctx.strokeStyle='rgba(175,225,255,.26)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-90,y-18);ctx.lineTo(x,y);ctx.stroke()}

  // Educational scale note visually represented by a faint spectrum.
  const sy2=h*.91,sw=Math.min(360,w*.32),cc=['190,70,100','220,130,65','230,200,75','75,165,105','70,140,215','120,85,190'];
  cc.forEach((c,i)=>{ctx.fillStyle='rgba('+c+',.11)';ctx.fillRect(w*.60+i*sw/6,sy2,sw/6-3,3)});
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)requestAnimationFrame(frame);
 }
 addEventListener('resize',resize);resize();frame(performance.now());
})();
/* Compact homepage / click-to-open section navigation — robust */
(() => {
 const ids=['about','people','research','facilities','lab','resources','contact'];
 const homeSections=()=>document.querySelectorAll('main > .section');
 function setHome(){
   document.body.classList.remove('page-view');
   document.body.classList.add('page-home');
   homeSections().forEach(s=>s.style.display=(s.id==='news'?'block':'none'));
   const footer=document.querySelector('footer'); if(footer) footer.style.display='block';
   document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='index.html'));
   window.scrollTo(0,0);
 }
 function setView(id){
   const target=document.getElementById(id); if(!target){setHome();return;}
   document.body.classList.remove('page-home');
   document.body.classList.add('page-view');
   homeSections().forEach(s=>{s.classList.remove('view-active');s.style.display='none'});
   target.classList.add('view-active');target.style.display='block';
   const footer=document.querySelector('footer'); if(footer) footer.style.display=(id==='contact'?'block':'none');
   document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+id));
   window.scrollTo(0,0);
 }
 function navigate(){
   const id=location.hash.replace(/^#/,'');
   if(ids.includes(id)||id==='news'||id==='notices') setView(id==='notices'?'news':id); else setHome();
 }
 document.addEventListener('click',e=>{
   const a=e.target.closest('a'); if(!a)return;
   const href=a.getAttribute('href')||'';
   if(href==='index.html'){e.preventDefault();history.pushState(null,'',location.pathname);setHome();return}
   if(!href.startsWith('#'))return;
   const id=href.slice(1);
   if(id==='news'||id==='notices'){
     if(document.body.classList.contains('page-home')){e.preventDefault();document.getElementById(id==='notices'?'notices':'news')?.scrollIntoView({behavior:'smooth'});}
     return;
   }
   if(!ids.includes(id))return;
   e.preventDefault();
   history.pushState(null,'','#'+id);
   setView(id);
 });
 window.addEventListener('popstate',navigate);
 window.addEventListener('hashchange',navigate);
 navigate();
})();
