(() => {
  const canvas = document.getElementById('plot');
  const ctx = canvas.getContext('2d');
  const nInput = document.getElementById('quantumN');
  const lInput = document.getElementById('boxLength');
  const massInput = document.getElementById('massRatio');
  const nValue = document.getElementById('nValue');
  const lValue = document.getElementById('lValue');
  const mValue = document.getElementById('mValue');
  const energy = document.getElementById('energy');
  const status = document.getElementById('status');
  const waveSelect = document.getElementById('waveMode');
  const playBtn = document.getElementById('play');
  const runBtn = document.getElementById('run');
  const resetBtn = document.getElementById('reset');
  const speedInput = document.getElementById('speed');
  let animation = null;
  let phase = 0;

  const h = 6.62607015e-34;
  const me = 9.1093837e-31;
  const eV = 1.602176634e-19;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(500, Math.floor(r.width * dpr));
    canvas.height = Math.max(300, Math.floor(r.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function values() {
    const n = Number(nInput.value);
    const Lnm = Number(lInput.value);
    const mr = Number(massInput.value);
    const L = Lnm * 1e-9;
    const m = mr * me;
    const E = (n*n*h*h)/(8*m*L*L)/eV;
    return { n, Lnm, mr, E };
  }

  function updateLabels() {
    const v = values();
    nValue.textContent = v.n;
    lValue.textContent = v.Lnm.toFixed(2) + ' nm';
    mValue.textContent = v.mr.toFixed(2) + ' mₑ';
    energy.textContent = v.E.toFixed(5) + ' eV';
  }

  function drawGrid(x, y, w, h) {
    ctx.strokeStyle = '#e4edf4';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const yy = y + h * i / 5;
      ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x+w, yy); ctx.stroke();
    }
    for (let i = 0; i <= 10; i++) {
      const xx = x + w * i / 10;
      ctx.beginPath(); ctx.moveTo(xx, y); ctx.lineTo(xx, y+h); ctx.stroke();
    }
  }

  function draw() {
    updateLabels();
    const rect = canvas.getBoundingClientRect();
    const W = rect.width, H = rect.height;
    ctx.clearRect(0, 0, W, H);
    const {n} = values();
    const mode = waveSelect.value;
    const left = 58, right = 24, top = 30, bottom = 48;
    const x = left, y = top, w = Math.max(100, W-left-right), hgt = Math.max(120, H-top-bottom);
    drawGrid(x,y,w,hgt);

    ctx.strokeStyle = '#193f66'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x,y+hgt/2); ctx.lineTo(x+w,y+hgt/2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y+hgt); ctx.stroke();

    ctx.fillStyle = '#526477'; ctx.font = '12px Segoe UI, Arial';
    ctx.fillText('x / L', x+w-28, y+hgt/2+20);
    ctx.fillText(mode === 'probability' ? '|ψ|²' : 'ψ', 10, y+12);
    ctx.fillText('0', x-4, y+hgt+20); ctx.fillText('L', x+w-4, y+hgt+20);

    if (mode === 'potential') {
      ctx.fillStyle = '#dce7ef';
      ctx.fillRect(x, y, 8, hgt); ctx.fillRect(x+w-8, y, 8, hgt);
      ctx.fillStyle = '#526477'; ctx.fillText('∞', x+1, y+18); ctx.fillText('∞', x+w-7, y+18);
      return;
    }

    ctx.beginPath();
    const amp = mode === 'probability' ? hgt*0.42 : hgt*0.34;
    for (let i=0;i<=600;i++) {
      const t=i/600;
      const psi=Math.sin(n*Math.PI*t);
      const yy=mode==='probability' ? y+hgt/2-amp*psi*psi : y+hgt/2-amp*psi*Math.cos(phase);
      const xx=x+w*t;
      if(i===0) ctx.moveTo(xx,yy); else ctx.lineTo(xx,yy);
    }
    ctx.strokeStyle='#1769aa'; ctx.lineWidth=3; ctx.stroke();

    if (mode === 'probability') {
      ctx.beginPath();
      for (let i=0;i<=600;i++) {
        const t=i/600, psi=Math.sin(n*Math.PI*t), yy=y+hgt/2-amp*psi*psi, xx=x+w*t;
        if(i===0) ctx.moveTo(xx,y+hgt/2); ctx.lineTo(xx,yy);
      }
      ctx.strokeStyle='rgba(23,105,170,.18)'; ctx.stroke();
    }
  }

  function run() {
    phase = 0; status.textContent = 'Simulation complete — numerical solution updated.'; draw();
  }

  function togglePlay() {
    if (animation) {
      cancelAnimationFrame(animation); animation=null; playBtn.textContent='▶ Animate'; status.textContent='Animation paused.'; return;
    }
    playBtn.textContent='⏸ Pause';
    const step=()=>{ phase += Number(speedInput.value)*0.025; draw(); animation=requestAnimationFrame(step); };
    animation=requestAnimationFrame(step);
  }

  [nInput,lInput,massInput,waveSelect,speedInput].forEach(el=>el.addEventListener('input', updateLabels));
  [nInput,lInput,massInput,waveSelect].forEach(el=>el.addEventListener('change', draw));
  runBtn.addEventListener('click',run);
  playBtn.addEventListener('click',togglePlay);
  resetBtn.addEventListener('click',()=>{ if(animation){cancelAnimationFrame(animation);animation=null;playBtn.textContent='▶ Animate';} nInput.value=1;lInput.value=1;massInput.value=1;waveSelect.value='wavefunction';speedInput.value=1;status.textContent='Parameters reset to default values.';draw(); });
  window.addEventListener('resize',resize);
  resize();
})();
