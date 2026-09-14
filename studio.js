/* Independent enhancement: all content and navigation work without this file. */
(() => {
  'use strict';
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = preference.matches;
  const localAnimations = [];

  const ready = () => {
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

    const sync = () => {
      document.body.classList.toggle('studio-paused', paused);
      localAnimations.forEach(a => paused ? a.finish() : null);
      if (window.gsap) window.gsap.globalTimeline.getChildren(true,true,false).forEach(tween => {
        if (tween.repeat() === -1) tween.paused(paused);
      });
    };
    preference.addEventListener('change', e => { paused = e.matches; sync(); });
    sync();

    // Subtle fade in
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (paused || !entry.target.animate) return;
        const a = entry.target.animate([{opacity:.35},{opacity:1}],{duration:650,easing:'ease-out'});
        localAnimations.push(a);
      }),{threshold:.08});
      document.querySelectorAll('.pstep,.wcard,.tcard,.ab-process-card,.service-content,.sv-growth,.footer-cta').forEach(el => observer.observe(el));
    }

    // Keyboard dismissal and a focus boundary for menus
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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();
