/* Independent enhancement: all content and navigation work without this file. */
(() => {
  'use strict';
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = preference.matches;
  const localAnimations = [];

  const initPersistentMusic = () => {
    const audio = document.getElementById('bg-audio');
    const button = document.getElementById('music-toggle');
    if (!audio || audio.dataset.persistenceReady === 'true') return;

    const stateKey = 'nabulsi_music_state_v2';
    audio.dataset.persistenceReady = 'true';
    audio.volume = 0.1;
    audio.loop = true;

    const readState = () => {
      try {
        return JSON.parse(localStorage.getItem(stateKey)) || {};
      } catch (_) {
        return {};
      }
    };

    const writeState = (playing = !audio.paused) => {
      try {
        localStorage.setItem(stateKey, JSON.stringify({
          time: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
          playing,
          savedAt: Date.now()
        }));
      } catch (_) {}
    };

    const restorePosition = () => {
      const state = readState();
      let position = Number(state.time) || 0;
      if (state.playing && state.savedAt) {
        position += Math.max(0, (Date.now() - Number(state.savedAt)) / 1000);
      }
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        position %= audio.duration;
      }
      if (position > 0) {
        try { audio.currentTime = position; } catch (_) {}
      }
      return state;
    };

    const attemptPlayback = () => {
      const result = audio.play();
      if (result && typeof result.catch === 'function') {
        result.catch(() => {
          // Browsers may require a gesture before unmuted audio can begin.
          button?.classList.remove('playing');
        });
      }
    };

    restorePosition();
    if (audio.readyState < 1) {
      audio.addEventListener('loadedmetadata', restorePosition, { once: true });
    }

    // Every page load should attempt playback, even if a previous page was paused.
    // Browsers that permit audible autoplay will start immediately.
    attemptPlayback();
    if (audio.readyState < 3) {
      audio.addEventListener('canplay', attemptPlayback, { once: true });
    }

    audio.addEventListener('play', () => {
      button?.classList.add('playing');
      writeState(true);
    });
    audio.addEventListener('pause', () => {
      button?.classList.remove('playing');
      writeState(false);
    });
    audio.addEventListener('timeupdate', () => writeState(!audio.paused));
    addEventListener('pagehide', () => writeState(!audio.paused));
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') writeState(!audio.paused);
    });
  };

  const ready = () => {
    initPersistentMusic();
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

    // Universal Section & Element Animations (Reveal, Fade, Swipe, Stagger)
    const animSelector = '.anim-reveal, .anim-fade, .anim-swipe-left, .anim-swipe-right, .anim-stagger, [data-anim]';
    const animElements = document.querySelectorAll(animSelector);

    if (animElements.length > 0) {
      if (paused || !('IntersectionObserver' in window)) {
        animElements.forEach(el => el.classList.add('in-view'));
      } else {
        const animObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              animObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.08,
          rootMargin: '0px 0px -40px 0px'
        });

        animElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
            setTimeout(() => el.classList.add('in-view'), 60);
          } else {
            animObserver.observe(el);
          }
        });

        // Safety fallback: ensure elements become visible after 2.5s
        setTimeout(() => {
          animElements.forEach(el => el.classList.add('in-view'));
        }, 2500);
      }
    }

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
