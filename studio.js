/* Independent enhancement: all content and navigation work without this file. */
(() => {
  'use strict';
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = preference.matches;
  const drawings = [];
  const localAnimations = [];
  const ready = () => {
    const filters = document.createElementNS('http://www.w3.org/2000/svg','svg');
    filters.setAttribute('aria-hidden','true'); filters.setAttribute('width','0'); filters.setAttribute('height','0');
    filters.style.position='absolute';
    filters.innerHTML='<defs><filter id="studio-duotone" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="table" tableValues="0.031 1"/><feFuncG type="table" tableValues="0.4 1"/><feFuncB type="table" tableValues="1 1"/></feComponentTransfer></filter></defs>';
    document.body.prepend(filters);
    const main = document.querySelector('main') || document.querySelector('.hero');
    if (main) {
      if (!main.id) main.id = 'studio-main';
      main.tabIndex = -1;
      const skip = document.createElement('a');
      skip.className = 'studio-skip'; skip.href = '#' + main.id; skip.textContent = 'Skip to content';
      document.body.prepend(skip);
    }
    const progress = document.createElement('div');
    progress.className = 'studio-progress'; progress.setAttribute('aria-hidden','true');
    document.body.append(progress);
    let scrollPending = false;
    const progressUpdate = () => {
      const range = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${range > 0 ? scrollY / range : 0})`;
      scrollPending = false;
    };
    addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(progressUpdate); } }, {passive:true});
    addEventListener('resize', progressUpdate); progressUpdate();

    document.querySelectorAll('#hero,.work-hero,.sv-hero,.ab-hero,.contact-hero,.lottie-panel,.sv-video-wrap,.sv-growth-img').forEach((host) => {
      const art = document.createElement('div'); art.className = 'studio-art'; art.setAttribute('aria-hidden','true');
      const canvas = document.createElement('canvas'); art.append(canvas);
      const label = document.createElement('span'); label.className = 'studio-art-label'; label.textContent = 'Strategy × Design × Technology'; art.append(label);
      host.prepend(art);
      ribbon(canvas, host.matches('.lottie-panel,.sv-video-wrap,.sv-growth-img'));
    });
    const control = document.createElement('button'); control.type = 'button'; control.className = 'studio-motion';
    const sync = () => {
      control.textContent = paused ? 'Play motion' : 'Pause motion';
      control.setAttribute('aria-pressed', String(paused));
      control.setAttribute('aria-label', paused ? 'Play decorative animations' : 'Pause decorative animations');
      document.body.classList.toggle('studio-paused', paused);
      drawings.forEach(d => d());
      localAnimations.forEach(a => paused ? a.finish() : null);
      // Only pause repeating decoration; navigation and reveal timelines remain usable.
      if (window.gsap) window.gsap.globalTimeline.getChildren(true,true,false).forEach(tween => {
        if (tween.repeat() === -1) tween.paused(paused);
      });
    };
    control.addEventListener('click', () => { paused = !paused; sync(); });
    preference.addEventListener('change', e => { paused = e.matches; sync(); });
    document.body.append(control); sync();

    // Animate clip paths, leaving existing transforms and layout untouched.
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (paused || !entry.target.animate) return;
        const a = entry.target.animate([{clipPath:'inset(8% 0 0 0)',filter:'opacity(.35)'},{clipPath:'inset(0 0 0 0)',filter:'opacity(1)'}],{duration:850,easing:'cubic-bezier(.2,.75,.2,1)'});
        localAnimations.push(a);
      }),{threshold:.08});
      document.querySelectorAll('.pstep,.wcard,.tcard,.ab-process-card,.service-content,.sv-growth,.footer-cta').forEach(el => observer.observe(el));
    }

    // Keyboard dismissal and a focus boundary for both existing menu systems.
    const menuButton = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    if (menuButton && menu) {
      if (!menu.id) menu.id = 'studio-mobile-menu';
      menuButton.setAttribute('aria-controls', menu.id);
      const updateMenu = () => {
        const open = menu.classList.contains('open');
        menuButton.setAttribute('aria-expanded', String(open));
        menu.inert = !open;
      };
      new MutationObserver(updateMenu).observe(menu,{attributes:true,attributeFilter:['class']}); updateMenu();
      document.addEventListener('keydown', e => {
        if (!menu.classList.contains('open')) return;
        if (e.key === 'Escape') { menuButton.click(); menuButton.focus(); }
        if (e.key === 'Tab') {
          const links = [...menu.querySelectorAll('a,button')]; const first = links[0], last = links.at(-1);
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); menuButton.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); menuButton.focus(); }
        }
      });
    }
  };

  function ribbon(canvas, inverse) {
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let w=0,h=0,frame=0,visible=true,last=0,time=0,mx=0,my=0;
    // A continuous toroidal ribbon: connected thinking, rendered as fine lines.
    function draw(now) {
      frame=0;
      if (!visible || document.hidden) return;
      if (!paused && last) time += Math.min(now-last,50)*.00018;
      last=now;
      ctx.clearRect(0,0,w,h);
      const size=Math.min(w,h)*.29;
      const angle=time+mx*.16, tilt=.65+my*.14;
      const ca=Math.cos(angle),sa=Math.sin(angle),ct=Math.cos(tilt),st=Math.sin(tilt);
      const strands=w<500?36:56, steps=w<500?120:170;
      for(let j=0;j<strands;j++) {
        const v=j/strands*Math.PI*2;
        ctx.beginPath();
        for(let i=0;i<=steps;i++) {
          const u=i/steps*Math.PI*2;
          const radius=1.12+.36*Math.cos(v+u*3);
          const x=radius*Math.cos(u),y=radius*Math.sin(u),z=.36*Math.sin(v+u*3);
          const xx=x*ca-z*sa,zz=x*sa+z*ca;
          const yy=y*ct-zz*st,depth=y*st+zz*ct;
          const perspective=3.8/(3.8-depth);
          const px=w/2+xx*size*perspective,py=h/2+yy*size*perspective;
          if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
        }
        ctx.strokeStyle=inverse?'rgba(255,255,255,.7)':'rgba(8,102,255,.65)';
        ctx.lineWidth=.8;ctx.stroke();
      }
      if(!paused) frame=requestAnimationFrame(draw);
    }
    function start() { if(frame)cancelAnimationFrame(frame); frame=0;last=0; if(visible&&!document.hidden)frame=requestAnimationFrame(draw); }
    function resize() {
      const rect=canvas.getBoundingClientRect();w=rect.width;h=rect.height;
      const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);start();
    }
    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;start();}).observe(canvas);
    document.addEventListener('visibilitychange',start);
    if(matchMedia('(pointer:fine)').matches) window.addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;},{passive:true});
    drawings.push(start); resize();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',ready);else ready();
})();
