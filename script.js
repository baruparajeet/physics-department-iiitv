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

/* Advanced physics visualization: continuous motion + scroll-driven quantum zoom */
(() => {
  const canvas = document.getElementById('physicsCanvas');
  const hero = document.querySelector('.hero-physics');
  if (!canvas || !hero) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w=0,h=0,dpr=1,t=0,scrollP=0,last=performance.now();

  const particles = Array.from({length:90},(_,i)=>({
    a:Math.random()*Math.PI*2,r:.18+Math.random()*.78,s:.15+Math.random()*.8,
    z:Math.random(),size:.5+Math.random()*2
  }));

  function resize(){
    const r=canvas.getBoundingClientRect();
    dpr=Math.min(devicePixelRatio||1,2); w=r.width; h=r.height;
    canvas.width=w*dpr; canvas.height=h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function physicsProgress(){
    const r=hero.getBoundingClientRect();
    const travel=Math.max(1,r.height-window.innerHeight*.35);
    return Math.max(0,Math.min(1,-r.top/travel));
  }
  function line(x1,y1,x2,y2,a=.2){
    ctx.strokeStyle='rgba(23,105,170,'+a+')';ctx.lineWidth=1;ctx.beginPath();
    ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  }
  function draw(now){
    const dt=Math.min(.04,(now-last)/1000); last=now; t+=dt;
    scrollP=physicsProgress();
    const zoom=1+scrollP*5.8;
    ctx.clearRect(0,0,w,h);

    const cx=w*.72, cy=h*.48;
    ctx.save();

    // Scientific coordinate/grid layer
    ctx.globalAlpha=.22+scrollP*.18;
    const grid=42;
    for(let x=0;x<w;x+=grid) line(x,0,x,h,.10);
    for(let y=0;y<h;y+=grid) line(0,y,w,y,.10);
    ctx.globalAlpha=1;

    // Rotating atomic system
    const orbitBase=Math.min(w,h)*(.17+scrollP*.12);
    for(let k=0;k<3;k++){
      ctx.save();ctx.translate(cx,cy);ctx.rotate(t*(.28+k*.09)+(k*Math.PI/3));
      ctx.scale(1,.36+k*.08);ctx.strokeStyle='rgba(23,105,170,'+(0.26-scrollP*.08)+')';
      ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(0,0,orbitBase*(1+k*.16),orbitBase*(.9+k*.08),0,0,Math.PI*2);ctx.stroke();
      const ea=t*(.7+k*.17)+k*2.1;
      const ex=Math.cos(ea)*orbitBase*(1+k*.16),ey=Math.sin(ea)*orbitBase*(.9+k*.08);
      ctx.fillStyle='#1769aa';ctx.shadowBlur=12;ctx.shadowColor='#1c8bd1';ctx.beginPath();ctx.arc(ex,ey,4+k,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.restore();
    }

    // Zooming quantum field
    const rings=9;
    for(let i=0;i<rings;i++){
      const rr=orbitBase*(.35+i*.23)*zoom;
      if(rr>Math.max(w,h)*1.8) continue;
      ctx.strokeStyle='rgba(28,139,209,'+(Math.max(0,.16-i*.012)*(scrollP+.25))+')';
      ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.stroke();
    }

    // Electromagnetic field waves
    for(let k=0;k<4;k++){
      ctx.beginPath();
      for(let x=0;x<=w*.9;x+=5){
        const y=h*(.29+k*.105)+Math.sin(x*.018-t*(1.8+k*.15)+k)*10*(1+scrollP*1.4);
        if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.strokeStyle='rgba(23,105,170,'+(0.10+scrollP*.10)+')';ctx.lineWidth=1.5;ctx.stroke();
    }

    // Prominent propagating electromagnetic wave inspired by the supplied reference
    // The wave travels continuously across the hero even when the page is not scrolling.
    {
      const wx = w * 0.38;
      const wy = h * 0.53;
      const ww = w * 0.64;
      const amp = Math.min(72, h * 0.13) * (1 + scrollP * 0.18);
      const cycles = 2.15;
      const phase = t * 2.2;
      const show = 0.78;

      ctx.save();
      ctx.translate(wx, wy);

      // Propagation axis
      ctx.strokeStyle = 'rgba(70,105,125,.32)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-35,0); ctx.lineTo(ww+35,0); ctx.stroke();

      // Arrow head on propagation direction
      ctx.fillStyle = 'rgba(70,105,125,.55)';
      ctx.beginPath();
      ctx.moveTo(ww+35,0); ctx.lineTo(ww+20,-6); ctx.lineTo(ww+20,6); ctx.closePath(); ctx.fill();

      // Electric-field wave
      ctx.beginPath();
      for(let x=0;x<=ww;x+=3){
        const y=Math.sin((x/ww)*Math.PI*2*cycles-phase)*amp;
        if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.strokeStyle='rgba(20,145,215,.88)';
      ctx.lineWidth=3;
      ctx.shadowBlur=10;
      ctx.shadowColor='rgba(20,145,215,.38)';
      ctx.stroke();
      ctx.shadowBlur=0;

      // Magnetic-field wave, perpendicular visual component
      ctx.beginPath();
      for(let x=0;x<=ww;x+=3){
        const y=Math.cos((x/ww)*Math.PI*2*cycles-phase)*amp*.78;
        if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.strokeStyle='rgba(120,205,55,.82)';
      ctx.lineWidth=2.5;
      ctx.stroke();

      // Field "ribs" make the propagation direction visually obvious.
      for(let i=0;i<44;i++){
        const x=(i/43)*ww;
        const ey=Math.sin((x/ww)*Math.PI*2*cycles-phase)*amp;
        const my=Math.cos((x/ww)*Math.PI*2*cycles-phase)*amp*.78;
        ctx.strokeStyle='rgba(20,145,215,.24)';
        ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,ey); ctx.stroke();
        ctx.strokeStyle='rgba(120,205,55,.20)';
        ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,my); ctx.stroke();
      }

      // Moving energy markers
      for(let i=0;i<7;i++){
        const q=((t*.12+i/7)%1);
        const x=q*ww;
        const y=Math.sin((x/ww)*Math.PI*2*cycles-phase)*amp;
        ctx.fillStyle='rgba(20,145,215,.9)';
        ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();
      }

      ctx.fillStyle='rgba(23,105,170,.58)';
      ctx.font='600 10px Segoe UI,Arial';
      ctx.fillText('ELECTROMAGNETIC WAVE',0,-amp-13);
      ctx.restore();
    }

    // Laser beams
    ctx.globalCompositeOperation='screen';
    for(let k=0;k<3;k++){
      const y=h*(.23+k*.27)+Math.sin(t*.7+k)*12;
      const grad=ctx.createLinearGradient(0,y,w*.82,y);
      grad.addColorStop(0,'rgba(28,139,209,0)');grad.addColorStop(.25,'rgba(28,139,209,.12)');
      grad.addColorStop(.72,'rgba(28,139,209,.48)');grad.addColorStop(1,'rgba(28,139,209,0)');
      ctx.strokeStyle=grad;ctx.lineWidth=2+k*.7;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w*.9,y-35+k*18);ctx.stroke();
    }
    ctx.globalCompositeOperation='source-over';

    // Particle cloud; particles accelerate outward during scroll
    particles.forEach(p=>{
      const rr=orbitBase*(1+p.r*2.4)*(1+scrollP*3.2);
      const a=p.a+t*p.s*(.4+scrollP*1.5);
      const x=cx+Math.cos(a)*rr;
      const y=cy+Math.sin(a)*rr*.62;
      if(x<-20||x>w+20||y<-20||y>h+20)return;
      ctx.fillStyle='rgba(23,105,170,'+(0.18+p.z*.45)+')';
      ctx.beginPath();ctx.arc(x,y,p.size*(1+scrollP),0,Math.PI*2);ctx.fill();
    });

    // Nucleus glow
    const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,70+scrollP*110);
    glow.addColorStop(0,'rgba(28,139,209,.32)');glow.addColorStop(.35,'rgba(28,139,209,.13)');glow.addColorStop(1,'rgba(28,139,209,0)');
    ctx.fillStyle=glow;ctx.beginPath();ctx.arc(cx,cy,100+scrollP*120,0,Math.PI*2);ctx.fill();

    // Quantum probability cloud appears as user zooms in
    if(scrollP>.12){
      ctx.globalAlpha=Math.min(1,(scrollP-.12)*1.8);
      for(let i=0;i<28;i++){
        const a=i*.9+t*.12, rr=(35+Math.sin(i*2.7+t)*24)*(1+scrollP*2);
        const x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr*.7;
        ctx.strokeStyle='rgba(23,105,170,.22)';ctx.beginPath();
        ctx.arc(x,y,5+Math.abs(Math.sin(i+t))*9,0,Math.PI*2);ctx.stroke();
      }
      ctx.globalAlpha=1;
    }

    // Spectrum bands
    const sx=w*.58, sy=h*.86, sw=Math.min(390,w*.38);
    const spectrum=['rgba(180,60,80,.28)','rgba(220,130,60,.28)','rgba(230,190,70,.30)','rgba(70,160,110,.30)','rgba(70,130,190,.32)','rgba(110,80,180,.28)'];
    spectrum.forEach((col,i)=>{ctx.fillStyle=col;ctx.fillRect(sx+i*sw/6,sy,sw/6-2,5+scrollP*9)});
    ctx.fillStyle='rgba(23,105,170,.45)';ctx.font='10px Segoe UI,Arial';ctx.fillText('SPECTRUM / ENERGY',sx,sy-7);

    // Minimal equation labels, drifting with zoom
    ctx.fillStyle='rgba(23,105,170,.32)';ctx.font='12px Georgia,serif';
    const labels=['E = hf','F = q(E + v × B)','λ = h/p','∇ · E = ρ/ε₀','ΔxΔp ≥ ℏ/2'];
    labels.forEach((s,i)=>{
      const x=w*(.58+(i%2)*.18)-scrollP*70;
      const y=h*(.18+i*.13);
      ctx.fillText(s,x,y);
    });

    ctx.restore();
    if(!reduce) requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);
  window.addEventListener('scroll',()=>{ if(reduce){scrollP=physicsProgress();} },{passive:true});
  resize(); draw(performance.now());
})();
