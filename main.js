/* ============================================
   NABULSI.TECH — Award-Winning JS V2
   DZINR-inspired interactions + effects
   ============================================ */

/* ========== HOME THEME — shared pages stay in the index light theme ========== */
document.documentElement.setAttribute('data-theme', 'light');

function initApp() {

  /* ========== HERO VIDEO FADE SYSTEM ========== */
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    let fadeRaf = null;
    let fadingOutRef = false;

    function cancelFade() {
      if (fadeRaf) { cancelAnimationFrame(fadeRaf); fadeRaf = null; }
    }

    function animateFade(from, to, duration, onDone) {
      cancelFade();
      const start = performance.now();
      heroVideo.style.opacity = from;
      function tick(now) {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        heroVideo.style.opacity = from + (to - from) * t;
        if (t < 1) {
          fadeRaf = requestAnimationFrame(tick);
        } else {
          fadeRaf = null;
          if (onDone) onDone();
        }
      }
      fadeRaf = requestAnimationFrame(tick);
    }

    function fadeIn() {
      fadingOutRef = false;
      const current = parseFloat(heroVideo.style.opacity) || 0;
      animateFade(current, 1, 500);
    }

    function fadeOutAndLoop() {
      if (fadingOutRef) return;
      fadingOutRef = true;
      const current = parseFloat(heroVideo.style.opacity) || 1;
      animateFade(current, 0, 500);
    }

    heroVideo.addEventListener('loadeddata', function() {
      heroVideo.play().then(fadeIn).catch(fadeIn);
    });

    heroVideo.addEventListener('timeupdate', function() {
      if (heroVideo.duration && heroVideo.currentTime > 0) {
        const remaining = heroVideo.duration - heroVideo.currentTime;
        if (remaining <= 0.55) {
          fadeOutAndLoop();
        }
      }
    });

    heroVideo.addEventListener('ended', function() {
      cancelFade();
      heroVideo.style.opacity = '0';
      setTimeout(function() {
        heroVideo.currentTime = 0;
        fadingOutRef = false;
        heroVideo.play().then(fadeIn).catch(fadeIn);
      }, 100);
    });

    // Kick off
    heroVideo.play().then(fadeIn).catch(function() {
      // Autoplay blocked — fade in on first interaction
      document.addEventListener('click', function onFirst() {
        heroVideo.play().then(fadeIn).catch(function(){});
        document.removeEventListener('click', onFirst);
      });
    });
  }

  /* ========== LOADING SCREEN — WHITE THEME w/ ORBITING ICONS ========== */
  const loader = document.getElementById('loader');
  const loaderLetters = document.querySelectorAll('.loader-letter');
  const loaderSubtext = document.querySelector('.loader-subtext');

  if (loader) {
    const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasGSAP = (typeof gsap !== 'undefined');
    const TAU = Math.PI * 2;

    // --- Orbit icons (brand-palette service glyphs) ---
    const LOADER_ICONS = [
      '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6" stroke="#145CFF" stroke-width="2"/><path d="M20 20l-3.5-3.5" stroke="#145CFF" stroke-width="2" stroke-linecap="round"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="#CD4800" stroke-width="2" stroke-linecap="round"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="14" rx="2" stroke="#567100" stroke-width="2"/><path d="M3 8h18" stroke="#567100" stroke-width="2"/><path d="M9 12l-2 2 2 2M13 12l2 2-2 2" stroke="#567100" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none"><circle cx="6" cy="12" r="2.4" stroke="#145CFF" stroke-width="2"/><circle cx="18" cy="6" r="2.4" stroke="#145CFF" stroke-width="2"/><circle cx="18" cy="18" r="2.4" stroke="#145CFF" stroke-width="2"/><path d="M8 11l8-4M8 13l8 4" stroke="#145CFF" stroke-width="1.6"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none"><path d="M3 11l18-7-7 18-2.5-7.5L3 11z" stroke="#CD4800" stroke-width="2" stroke-linejoin="round"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="#567100" stroke-width="2"/><path d="M8 8h8M8 12h8M8 16h5" stroke="#567100" stroke-width="1.8" stroke-linecap="round"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none"><path d="M4 16l5-5 3 3 7-8" stroke="#145CFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 6h4v4" stroke="#145CFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none"><path d="M9 8l-4 4 4 4M15 8l4 4-4 4" stroke="#CD4800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    ];

    const orbit = document.getElementById('loader-orbit');
    const barfill = document.getElementById('loader-barfill');
    const pct = document.getElementById('loader-pct');

    const iconEls = [];
    if (orbit) {
      LOADER_ICONS.forEach((svg) => {
        const el = document.createElement('div');
        el.className = 'l-ico';
        el.innerHTML = svg;
        orbit.appendChild(el);
        iconEls.push(el);
      });
    }

    // Circular orbit — radius clamped so icons always stay on screen, hugging the text
    const ICON_HALF = window.innerWidth <= 480 ? 20 : (window.innerWidth <= 768 ? 23 : 29);
    const bound = Math.min(window.innerWidth, window.innerHeight) / 2 - (ICON_HALF + 12);
    const R = Math.max(110, Math.min(bound, 340));

    function flipLettersIn() {
      loaderLetters.forEach((letter, i) => {
        setTimeout(() => letter.classList.add('visible'), 200 + i * 80);
      });
    }
    function showSubtext() {
      if (loaderSubtext) loaderSubtext.classList.add('visible');
    }
    function exitLoader() {
      loader.classList.add('exit-glow');
      setTimeout(() => {
        loader.classList.add('hidden');
        window.dispatchEvent(new Event('loaderComplete'));
      }, 600);
    }

    if (hasGSAP && !REDUCE_MOTION) {
      // Icons drift IN from further out, settle in a ring, then gently bob (no orbit over text)
      iconEls.forEach((el, i) => {
        const a = (i / iconEls.length) * TAU;
        const x = Math.cos(a) * R, y = Math.sin(a) * R;
        const d = 0.1 + i * 0.06;
        gsap.set(el, { x: x * 1.5, y: y * 1.5, scale: 0.5, opacity: 0 });
        gsap.to(el, { x: x, y: y, scale: 1, opacity: 1, duration: 1.1, delay: d, ease: 'power3.out',
          onComplete: function () {
            // gentle continuous float in place — stays around the ring, never over the text
            gsap.to(el, { y: y - (6 + Math.random() * 8), duration: 1.6 + Math.random(),
              repeat: -1, yoyo: true, ease: 'sine.inOut' });
          }
        });
      });

      // Brand letters + subtext
      setTimeout(flipLettersIn, 500);
      setTimeout(showSubtext, 1200);

      // Progress bar 0 -> 100
      gsap.to({ p: 0 }, {
        p: 100, duration: 2.8, ease: 'power1.inOut',
        onUpdate: function () {
          const v = Math.round(this.targets()[0].p);
          if (barfill) barfill.style.width = v + '%';
          if (pct) pct.textContent = v + '%';
        },
        onComplete: function () {
          // Icons converge IN to the center (toward the brand text) then disappear
          gsap.killTweensOf(iconEls);
          gsap.to(iconEls, {
            x: 0, y: 0, scale: 0.3, opacity: 0,
            duration: 0.7, ease: 'power3.in', stagger: 0.03
          });
          setTimeout(exitLoader, 650);
        }
      });
    } else {
      // Reduced-motion / no-GSAP fallback — keep it simple & quick
      iconEls.forEach((el, i) => {
        const a = (i / iconEls.length) * TAU;
        el.style.transform = `translate(${Math.cos(a) * R}px, ${Math.sin(a) * R}px)`;
        el.style.opacity = '1';
      });
      flipLettersIn();
      setTimeout(showSubtext, 600);
      let v = 0;
      const tick = setInterval(() => {
        v = Math.min(100, v + 8);
        if (barfill) barfill.style.width = v + '%';
        if (pct) pct.textContent = v + '%';
        if (v >= 100) { clearInterval(tick); setTimeout(exitLoader, 200); }
      }, 60);
    }

    // Fallback safety — never leave the page stuck behind the loader
    setTimeout(() => {
      if (loader && !loader.classList.contains('hidden')) {
        exitLoader();
      }
    }, 6000);
  }

  try {
    if (typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    } else {
      console.warn("GSAP is not loaded. Animations will be disabled.");
    }
  } catch (e) {
    console.error("GSAP Registration error:", e);
  }

  /* ========== PREMIUM TESTIMONIALS ANIMATION (ECHOES) ========== */
  const testimonialsSection = document.querySelector('.testimonials-section');
  if (testimonialsSection && typeof gsap !== 'undefined') {
    const cards = gsap.utils.toArray('.testimonial-card');
    
    // 1. Cinematic Staggered Entrance
    gsap.fromTo(cards, 
      { 
        y: 150, 
        opacity: 0,
        rotationX: 15,
        transformPerspective: 1000
      }, 
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: testimonialsSection,
          start: "top 75%",
        }
      }
    );

    // 2. Soft Parallax Movement while scrolling
    cards.forEach((card, i) => {
      gsap.to(card, {
        yPercent: (i % 2 === 0) ? -15 : -30,
        ease: "none",
        scrollTrigger: {
          trigger: testimonialsSection,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });
    });

    // 3. Magnetic/3D Hover Effect on MouseMove
    if (window.matchMedia('(hover: hover)').matches && window.innerWidth > 768) {
      cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = ((y - centerY) / centerY) * -5;
          const rotateY = ((x - centerX) / centerX) * 5;
          
          gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            duration: 0.4,
            ease: "power2.out"
          });
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.6,
            ease: "power3.out"
          });
        });
      });
    }
  }

  /* ========== OUR CLIENTS — LEGACY (section removed, kept for reference) ========== */
  const ocSection = document.querySelector('.oc-section');
  if (ocSection && typeof gsap !== 'undefined') {
    const ocBgs = gsap.utils.toArray('.oc-bg');
    const ocRows = gsap.utils.toArray('.oc-row');
    const ocCounterCurrent = ocSection.querySelector('.oc-counter-current');
    const ocProgressFill = ocSection.querySelector('.oc-progress-fill');
    const totalOC = ocRows.length;
    let lastOCIndex = -1;

    // Force initial state: client #1 active, everything visible
    ocRows.forEach(r => r.classList.remove('active'));
    ocBgs.forEach(b => b.classList.remove('active'));
    ocRows[0].classList.add('active');
    ocBgs[0].classList.add('active');
    if (ocCounterCurrent) ocCounterCurrent.textContent = '01';

    // Separate observer to reveal heading/label as soon as section enters viewport
    const ocRevealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          ocSection.classList.add('in-view');
          ocRevealObs.disconnect();
        }
      });
    }, { threshold: 0.05 });
    ocRevealObs.observe(ocSection);

    // Main scroll-driven trigger for client switching
    ScrollTrigger.create({
      trigger: ".oc-scroll-track",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.1,
      onUpdate: (self) => {
        const progress = self.progress; // 0 at pin start, 1 at end

        // Progress bar
        if (ocProgressFill) ocProgressFill.style.height = (progress * 100) + '%';

        // Give each client an equal slice of the scroll.
        // Clamp so client #1 (index 0) is active from progress 0 to 0.1,
        // client #2 from 0.1 to 0.2, etc.
        const activeIndex = Math.min(
          Math.floor(progress * totalOC),
          totalOC - 1
        );

        if (activeIndex !== lastOCIndex) {
          // Update rows
          ocRows.forEach((row, i) => {
            row.classList.toggle('active', i === activeIndex);
          });

          // Crossfade backgrounds
          ocBgs.forEach((bg, i) => {
            bg.classList.toggle('active', i === activeIndex);
          });

          // Update counter with a scale pop
          if (ocCounterCurrent) {
            ocCounterCurrent.textContent = String(activeIndex + 1).padStart(2, '0');
            ocCounterCurrent.style.transform = 'scale(1.15)';
            setTimeout(() => {
              ocCounterCurrent.style.transform = 'scale(1)';
            }, 200);
          }

          lastOCIndex = activeIndex;
        }
      }
    });
  }


  /* ========== CUSTOM CURSOR ========== */
  const isHoverable = window.matchMedia('(hover: hover)').matches;
  if (isHoverable && window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    let cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    function animateCursor() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverables = document.querySelectorAll('a, button, .floating-card, .tilt-card, .glass-card, .service-card');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  /* ========== ABOUT MANIFESTO — AWARD-LEVEL GSAP ANIMATIONS ========== */
  const manifestoSection = document.getElementById('about-manifesto');
  if (manifestoSection && typeof gsap !== 'undefined') {

    // --- Orbs activation ---
    ScrollTrigger.create({
      trigger: manifestoSection,
      start: 'top 80%',
      onEnter: () => manifestoSection.classList.add('orbs-active'),
    });

    // --- Heading lines clip-reveal ---
    const lineInners = gsap.utils.toArray('.manifesto-line-inner');
    lineInners.forEach((inner, i) => {
      gsap.to(inner, {
        y: '0%',
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: inner.parentElement,
          start: 'top 85%',
        },
        delay: i * 0.15,
      });
    });

    // --- Tag acid fade in ---
    const tagAcid = manifestoSection.querySelector('.tag-acid');
    if (tagAcid) {
      gsap.from(tagAcid, {
        opacity: 0, y: 20, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: tagAcid, start: 'top 85%' },
      });
    }

    // --- Typewriter (triggered by scroll) ---
    const aboutTypewriter = document.getElementById('about-typewriter');
    if (aboutTypewriter) {
      const aboutText = "We exist at the intersection of high-end editorial aesthetics and functional rawness. We craft digital experiences that stand out, make noise, and leave a mark.";
      let aboutTyped = false;
      ScrollTrigger.create({
        trigger: aboutTypewriter,
        start: 'top 80%',
        onEnter: () => {
          if (aboutTyped) return;
          aboutTyped = true;
          let i = 0;
          const typeInterval = setInterval(() => {
            i++;
            aboutTypewriter.innerHTML = aboutText.slice(0, i) +
              (i < aboutText.length ? '<span class="about-cursor"></span>' : '');
            if (i >= aboutText.length) clearInterval(typeInterval);
          }, 28);
        },
      });
    }

    // --- Timeline line fill on scroll (scrub) ---
    const timelineFill = document.getElementById('timeline-fill');
    const timelineRight = document.querySelector('.about-manifesto-right');
    if (timelineFill && timelineRight) {
      gsap.to(timelineFill, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: timelineRight,
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: 0.5,
        },
      });
    }

    // --- Timeline cards: staggered scroll-driven entrance ---
    const timelineItems = gsap.utils.toArray('.about-timeline-item');
    timelineItems.forEach((item, i) => {
      const card = item.querySelector('.about-value-card');
      const icon = item.querySelector('.about-value-icon');
      const num = item.querySelector('.about-value-number');
      const title = item.querySelector('.about-value-title');
      const desc = item.querySelector('.about-value-desc');

      // Card entrance
      gsap.from(item, {
        opacity: 0, x: 60, duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: item, start: 'top 80%' },
      });

      // Icon pop
      if (icon) {
        gsap.from(icon, {
          scale: 0, rotation: -90, opacity: 0, duration: 0.7, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: item, start: 'top 75%' },
          delay: 0.2,
        });
      }

      // Inner content stagger
      const innerEls = [num, title, desc].filter(Boolean);
      innerEls.forEach((el, j) => {
        gsap.from(el, {
          opacity: 0, y: 20, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 75%' },
          delay: 0.3 + j * 0.1,
        });
      });

      // Activate dot when card enters
      ScrollTrigger.create({
        trigger: item,
        start: 'top 65%',
        onEnter: () => item.classList.add('active'),
      });

      // Subtle parallax on the card while scrolling
      gsap.to(card, {
        y: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    // --- Mouse-follow glow on cards ---
    const tiltCards = document.querySelectorAll('.about-value-card[data-tilt]');
    tiltCards.forEach(card => {
      const glow = card.querySelector('.about-card-glow');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (glow) {
          glow.style.left = x + 'px';
          glow.style.top = y + 'px';
        }
        // 3D tilt
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 800,
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0, rotateY: 0,
          duration: 0.6, ease: 'elastic.out(1, 0.5)',
          transformPerspective: 800,
        });
      });
    });
  }

  // About stats counter
  const aboutStatNums = document.querySelectorAll('.about-stat-num[data-target]');
  if (aboutStatNums.length && typeof IntersectionObserver !== 'undefined') {
    const statsObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(el.dataset.target, 10);
          const duration = 1500;
          const start = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(animate);
            else el.textContent = target;
          };
          requestAnimationFrame(animate);
          statsObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    aboutStatNums.forEach(el => statsObs.observe(el));
  }

  /* ========== SCROLL PROGRESS BAR ========== */
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      progressBar.style.transform = `scaleX(${p})`;
    }, { passive: true });
  }

  /* ========== NAVBAR SCROLL ========== */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ========== MOBILE MENU ========== */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ========== TEXT SPLIT REVEAL (DZINR-style) ========== */
  const splitLines = document.querySelectorAll('.split-line:not(.hero-title .split-line)');
  const splitObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        splitObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  splitLines.forEach(el => splitObserver.observe(el));

  /* ========== PRO GSAP HERO ANIMATION ========== */
  if (typeof gsap !== 'undefined') {
    const initHeroAnim = () => {
      const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });
      
      // Set initial states
      gsap.set('.hero-line-inner', { y: "110%", rotateZ: 3 });
      gsap.set('.hero-desc', { y: 30, opacity: 0 });
      gsap.set('.hero-btns a', { y: 30, opacity: 0 });
      gsap.set('.hero .tag-acid', { y: 20, opacity: 0 });
      
      heroTimeline
        .to('.hero .tag-acid', {
          y: 0,
          opacity: 1,
          duration: 0.8
        })
        .to('.hero-line-inner', {
          y: "0%",
          rotateZ: 0,
          duration: 1.2,
          stagger: 0.12
        }, "-=0.6")
        .to('.hero-desc', {
          y: 0,
          opacity: 1,
          duration: 1
        }, "-=0.8")
        .to('.hero-btns a', {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1
        }, "-=0.6");
    };

    if (document.getElementById('loader')) {
      window.addEventListener('loaderComplete', initHeroAnim);
    } else {
      // If no loader, start immediately or on DOM load
      setTimeout(initHeroAnim, 100);
    }
  }

  /* ========== INDIVIDUAL REVEAL (Methodology) ========== */
  const revealUpEls = document.querySelectorAll('.reveal-up');
  const revealUpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealUpObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealUpEls.forEach(el => revealUpObserver.observe(el));

  /* ========== STANDARD REVEAL ========== */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));

  /* ========== DIVIDER REVEAL ========== */
  const dividers = document.querySelectorAll('.divider');
  const dividerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        dividerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  dividers.forEach(d => dividerObserver.observe(d));

  /* ========== MAGNETIC HOVER ========== */
  if (isHoverable) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ========== 3D TILT CARDS ========== */
  if (isHoverable) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      const inner = card.querySelector('.tilt-card-inner');
      if (!inner) return;
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const deltaX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const deltaY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        inner.style.transform = `rotateX(${-deltaY * 4}deg) rotateY(${deltaX * 4}deg) scale3d(1.02,1.02,1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        inner.style.transform = 'rotateX(0) rotateY(0) scale3d(1,1,1)';
      });
    });
  }

  /* ========== PARALLAX IMAGES ========== */
  const parallaxImages = document.querySelectorAll('.parallax-img');
  function updateParallax() {
    parallaxImages.forEach(img => {
      const rect = img.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const windowCenter = window.innerHeight / 2;
      const dist = Math.abs(center - windowCenter);
      const scale = 1 + 0.08 * (1 - Math.min(dist / window.innerHeight, 1));
      img.style.transform = `scale(${scale})`;
    });
  }
  if (parallaxImages.length > 0) {
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  /* ========== CINEMATIC STATS — AWARD-LEVEL ========== */
  const statsCinematic = document.getElementById('stats-cinematic');
  if (statsCinematic) {
    const statCards = statsCinematic.querySelectorAll('.stat-cinematic-card');
    const statNumbers = statsCinematic.querySelectorAll('.stat-cinematic-number');

    // Mouse-follow spotlight on each card
    statCards.forEach(card => {
      const spotlight = card.querySelector('.stat-card-spotlight');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (spotlight) {
          spotlight.style.left = x + 'px';
          spotlight.style.top = y + 'px';
        }
      });

      // Subtle 3D tilt
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const inner = card.querySelector('.stat-card-inner');
        if (inner) {
          inner.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
        }
      });
      card.addEventListener('mouseleave', () => {
        const inner = card.querySelector('.stat-card-inner');
        if (inner) {
          inner.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
          inner.style.transition = 'transform 0.6s var(--ease-out-expo), border-color 0.5s, background 0.5s, box-shadow 0.5s';
        }
      });
      card.addEventListener('mouseenter', () => {
        const inner = card.querySelector('.stat-card-inner');
        if (inner) inner.style.transition = 'border-color 0.5s, background 0.5s, box-shadow 0.5s';
      });
    });

    // Set progress bar CSS custom properties
    statCards.forEach(card => {
      const fill = card.querySelector('.stat-progress-fill');
      if (fill) {
        card.style.setProperty('--stat-bar-width', fill.dataset.width + '%');
      }
    });

    // IntersectionObserver: reveal cards + count up + progress bars
    let statsAnimated = false;
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statsCinematic.classList.add('in-view');

          // Reveal cards with stagger
          statCards.forEach((card, i) => {
            setTimeout(() => card.classList.add('revealed'), i * 120);
          });

          // Count up numbers with GSAP
          if (typeof gsap !== 'undefined') {
            statNumbers.forEach((el, i) => {
              const target = parseInt(el.getAttribute('data-count'), 10);
              const card = el.closest('.stat-cinematic-card');
              gsap.to(el, {
                innerHTML: target,
                duration: 2.5,
                delay: 0.3 + i * 0.15,
                ease: "power4.out",
                snap: { innerHTML: 1 },
                onUpdate() { el.textContent = Math.round(parseFloat(el.innerHTML)); },
                onComplete() { if (card) card.classList.add('counted'); }
              });
            });
          }

          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.2 });

    statsObserver.observe(statsCinematic);
  }

  /* ========== CINEMATIC 3D METHODOLOGY (GSAP + Three.js) ========== */
  // 1. 3D Card Reveal (Initial Fade In)
  const panels = document.querySelectorAll('.cinematic-3d-panel');
  if (panels.length > 0) {
    gsap.fromTo(panels,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".methodology-cinematic-wrapper",
          start: "top 70%",
        }
      }
    );

    // 2. Sequential highlight & Line Draw on scroll
    gsap.to('.timeline-path-glow', {
      strokeDashoffset: 0,
      scrollTrigger: {
        trigger: ".methodology-cinematic-wrapper",
        start: "center center",
        end: "+=250%",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const totalPanels = panels.length;
          const activeIndex = Math.floor(progress * totalPanels);
          
          panels.forEach((panel, i) => {
            if (i === activeIndex && progress < 0.95) {
              panel.classList.add('is-active');
            } else {
              panel.classList.remove('is-active');
            }
          });
        }
      }
    });

    // 3. Mouse Tilt Interaction
    panels.forEach(panel => {
      panel.addEventListener('mousemove', (e) => {
        const rect = panel.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        gsap.to(panel, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.5,
          ease: "power2.out"
        });
      });
      
      panel.addEventListener('mouseleave', () => {
        gsap.to(panel, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.8,
          ease: "power2.out"
        });
      });
    });
  }

  // 4. Three.js Particle Atmosphere
  const methodContainer = document.getElementById('methodology-canvas-container');
  if (methodContainer && typeof THREE !== 'undefined') {
    const sceneM = new THREE.Scene();
    const cameraM = new THREE.PerspectiveCamera(75, methodContainer.clientWidth / methodContainer.clientHeight, 0.1, 1000);
    const rendererM = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    rendererM.setSize(methodContainer.clientWidth, methodContainer.clientHeight);
    rendererM.setPixelRatio(window.devicePixelRatio);
    methodContainer.appendChild(rendererM.domElement);

    const geoM = new THREE.BufferGeometry();
    const countM = 300;
    const posM = new Float32Array(countM * 3);
    for(let i=0; i<countM * 3; i++) {
      posM[i] = (Math.random() - 0.5) * 40;
    }
    geoM.setAttribute('position', new THREE.BufferAttribute(posM, 3));
    
    const matM = new THREE.PointsMaterial({
      size: 0.15,
      color: 0x8B2CF5,
      transparent: true,
      opacity: 0.5,
      blending: THREE.NormalBlending
    });
    
    const particlesM = new THREE.Points(geoM, matM);
    sceneM.add(particlesM);
    cameraM.position.z = 10;

    let mouseM = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
      mouseM.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseM.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animateMethod() {
      requestAnimationFrame(animateMethod);
      particlesM.rotation.x += 0.0003;
      particlesM.rotation.y += 0.0005;
      
      // Subtle parallax based on mouse
      cameraM.position.x += (mouseM.x * 2 - cameraM.position.x) * 0.02;
      cameraM.position.y += (mouseM.y * 2 - cameraM.position.y) * 0.02;
      cameraM.lookAt(sceneM.position);

      rendererM.render(sceneM, cameraM);
    }
    animateMethod();

    window.addEventListener('resize', () => {
      if (!methodContainer) return;
      cameraM.aspect = methodContainer.clientWidth / methodContainer.clientHeight;
      cameraM.updateProjectionMatrix();
      rendererM.setSize(methodContainer.clientWidth, methodContainer.clientHeight);
    });
  }

  /* ========== ARE YOU READY TEXT REVEAL ========== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const textReveal = document.querySelector('.are-you-ready-text-reveal');
    
    if (textReveal) {
      // Split text into individual spans for each character
      const text = textReveal.textContent.trim();
      textReveal.textContent = '';
      
      const chars = [];
      for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        // Start dim
        span.style.color = 'rgba(255, 255, 255, 0.1)';
        textReveal.appendChild(span);
        chars.push(span);
      }
      
      // Animate characters to full white sequentially as you scroll
      gsap.to(chars, {
        color: '#ffffff',
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.are-you-ready-section',
          start: 'top top',
          end: 'bottom bottom', // Ends when the 200vh section finishes scrolling
          scrub: 0.5            // Smooth catching up
        }
      });
    }
  }

  /* ========== CTA FLIP EFFECT ========== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const flipBanner = document.querySelector('.flip-on-scroll');
    if (flipBanner) {
      // Start flipped completely backwards (180deg) or flat (90deg) and scaled down slightly
      gsap.fromTo(flipBanner, 
        { 
          rotateX: 60,
          scale: 0.8,
          opacity: 0,
          y: 100
        }, 
        {
          rotateX: 0,
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-flip-container",
            start: "top 85%", // Start animation when the top of the container hits 85% of viewport
            end: "top 40%",   // End animation when it reaches 40%
            scrub: 1          // Smooth 3D scrubbing
          }
        }
      );
    }
  }

  /* ========== VIDEO FLIP EFFECT ========== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const videoFlip = document.querySelector('.video-flip-on-scroll');
    if (videoFlip) {
      // Start flipped slightly backwards and scaled down
      gsap.fromTo(videoFlip, 
        { 
          rotateX: 45,
          scale: 0.8,
          opacity: 0,
          y: 50
        }, 
        {
          rotateX: 0,
          scale: 1,
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".video-flip-container",
            start: "top 95%", // Start very early so it's a long, slow flip
            end: "center center", // Finish exactly when it reaches the center of the screen
            scrub: 2          // High scrub value makes it very smooth and slow
          }
        }
      );
    }
  }

  /* ========== HORIZONTAL SCROLL (All Sections) ========== */
  const hScrollSections = document.querySelectorAll('.horizontal-scroll-section');
  if (hScrollSections.length > 0) {
    hScrollSections.forEach(section => {
      const isMobileDisabled = window.innerWidth <= 768 && !section.classList.contains('mobile-hscroll');
      if (isMobileDisabled) return;

      const track = section.querySelector('.horizontal-scroll-track');
      if (track) {
        function setTrackHeight() {
          // Calculate the total width of the track
          const trackWidth = track.scrollWidth;
          const viewportWidth = window.innerWidth;
          // The scroll height needed = track width - viewport width + 100vh
          section.style.height = `calc(${trackWidth - viewportWidth}px + 100vh)`;
        }
        setTrackHeight();
        window.addEventListener('resize', setTrackHeight);

        window.addEventListener('scroll', () => {
          const rect = section.getBoundingClientRect();
          const end = section.offsetHeight - window.innerHeight;
          if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
             const progress = Math.abs(rect.top) / end;
             const maxT = track.scrollWidth - window.innerWidth;
             track.style.transform = `translateX(-${progress * maxT}px)`;
          } else if (rect.top > 0) {
             track.style.transform = `translateX(0px)`;
          } else if (rect.bottom < window.innerHeight) {
             const maxT = track.scrollWidth - window.innerWidth;
             track.style.transform = `translateX(-${maxT}px)`;
          }
        }, { passive: true });
      }
    });
  }


  /* ========== STICKY CARD STACK OBSERVER ========== */
  const stackedCards = document.querySelectorAll('.stacked-card');
  const sidebarNumber = document.getElementById('sidebar-number');
  const sidebarListItems = document.querySelectorAll('.services-list li');

  if (stackedCards.length > 0 && sidebarNumber && sidebarListItems.length > 0) {
    const updateActiveCard = () => {
      let activeIndex = 0;
      stackedCards.forEach((card, i) => {
        const stickyTop = parseInt(window.getComputedStyle(card).top) || 0;
        // If the card has reached or passed its sticky top position
        if (card.getBoundingClientRect().top <= stickyTop + 5) {
          activeIndex = i;
        }
      });

      const displayIndex = activeIndex + 1;
      sidebarNumber.textContent = displayIndex < 10 ? '0' + displayIndex : displayIndex;

      sidebarListItems.forEach((li, i) => {
        if (i === activeIndex) {
          li.classList.add('active');
        } else {
          li.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', updateActiveCard, { passive: true });
    // Initial check on load
    updateActiveCard();
  }

  /* ========== SMOOTH ANCHOR ========== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ========== FILTER BAR (Work Page) ========== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');
  if (filterBtns.length > 0 && projectItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active to clicked
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectItems.forEach(item => {
          // Reset opacity for transition
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          
          setTimeout(() => {
            if (filterValue === 'all' || item.getAttribute('data-category').includes(filterValue)) {
              item.classList.remove('hidden');
              // Small delay to allow display:block to apply before opacity transition
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
              }, 50);
            } else {
              item.classList.add('hidden');
            }
          }, 300); // match CSS transition duration
        });
      });
    });
  }

  /* ========== FLOATING ACTION BUTTONS (Back to Top & Music) ========== */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 800) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const musicToggleBtn = document.getElementById('music-toggle');
  const bgAudio = document.getElementById('bg-audio');
  if (musicToggleBtn && bgAudio) {
    // Show the button immediately
    musicToggleBtn.classList.add('visible');

    // Set volume to 60%
    bgAudio.volume = 0.6;

    // --- Cross-page persistence via localStorage ---
    const MUSIC_KEY = 'nabulsi_music_playing';
    const MUSIC_TIME_KEY = 'nabulsi_music_time';
    const wasPlaying = localStorage.getItem(MUSIC_KEY) === 'true';
    const savedTime = parseFloat(localStorage.getItem(MUSIC_TIME_KEY) || '0');

    // If music was playing on the previous page, resume it
    if (wasPlaying) {
      bgAudio.currentTime = savedTime;
      bgAudio.play().then(() => {
        musicToggleBtn.classList.add('playing');
      }).catch(e => console.log('Audio resume failed:', e));
    }

    // Save position periodically so page navigation doesn't lose it
    setInterval(() => {
      if (!bgAudio.paused) {
        localStorage.setItem(MUSIC_TIME_KEY, String(bgAudio.currentTime));
      }
    }, 500);

    // Save state before leaving the page
    window.addEventListener('beforeunload', () => {
      localStorage.setItem(MUSIC_KEY, String(!bgAudio.paused));
      localStorage.setItem(MUSIC_TIME_KEY, String(bgAudio.currentTime));
    });

    // Toggle on click
    musicToggleBtn.addEventListener('click', () => {
      if (!bgAudio.paused) {
        // Currently playing → pause
        bgAudio.pause();
        musicToggleBtn.classList.remove('playing');
        localStorage.setItem(MUSIC_KEY, 'false');
      } else {
        // Currently paused → play
        bgAudio.play().then(() => {
          musicToggleBtn.classList.add('playing');
          localStorage.setItem(MUSIC_KEY, 'true');
        }).catch(e => console.log('Audio play failed:', e));
      }
    });
  }

  smoothBgTransitions();
  whatsappFab();
}

/* ========== WHATSAPP FLOATING BUTTON (left, site-wide) ========== */
function whatsappFab() {
  if (document.querySelector('.wa-fab')) return;
  var a = document.createElement('a');
  a.className = 'wa-fab';
  a.href = 'https://api.whatsapp.com/send/?phone=19012772195&text&type=phone_number&app_absent=0';
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.setAttribute('aria-label', 'Chat on WhatsApp');
  a.innerHTML =
    '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.04 4C9.95 4 5 8.95 5 15.04c0 2.13.6 4.13 1.64 5.82L5 28l7.34-1.6a11 11 0 0 0 3.7.64h.01C22.13 27.04 27 22.09 27 16S22.13 4 16.04 4zm0 20.2c-1.16 0-2.3-.31-3.29-.9l-.24-.14-3.9.85.83-3.8-.16-.25a8.2 8.2 0 1 1 6.76 4.24zm4.5-6.14c-.25-.12-1.47-.72-1.7-.8-.23-.08-.4-.12-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.15-.01-.32-.01-.48-.01-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.16 1.73 2.64 4.19 3.7.59.26 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"/></svg>' +
    '<span class="wa-label">Chat with us</span>';
  document.body.appendChild(a);
}

/* ========== SMOOTH SECTION BACKGROUND CROSSFADE ==========
   A fixed layer behind all content that crossfades between the page
   colour and the dark contrast bands as they pass the viewport centre,
   so light↔dark section changes read as one smooth transition. */
function smoothBgTransitions() {
  const bands = Array.prototype.slice.call(
    document.querySelectorAll('.marquee-section, .are-you-ready-section, .stand-out-section')
  );
  if (!bands.length) return;

  // bands carry their colour via the fader now — make them transparent
  bands.forEach(el => { el.style.background = 'transparent'; });

  const fader = document.createElement('div');
  fader.className = 'bg-fader';
  document.body.insertBefore(fader, document.body.firstChild);

  function palette() {
    const cs = getComputedStyle(document.documentElement);
    return {
      base: cs.getPropertyValue('--color-background').trim(),
      band: cs.getPropertyValue('--band-bg').trim()
    };
  }
  let colors = palette();
  fader.style.backgroundColor = colors.base;

  let lastDark = null;
  function update() {
    const vh = window.innerHeight;
    // go dark once a band has entered the lower viewport, stay dark until it
    // has mostly left the top — keeps the band's light text on a dark bg
    const enter = vh * 0.72, leave = vh * 0.28;
    let dark = false;
    for (let i = 0; i < bands.length; i++) {
      const r = bands[i].getBoundingClientRect();
      if (r.top <= enter && r.bottom >= leave) { dark = true; break; }
    }
    if (dark !== lastDark) {
      lastDark = dark;
      fader.style.backgroundColor = dark ? colors.band : colors.base;
    }
  }
  (function tick() { update(); requestAnimationFrame(tick); })();

  new MutationObserver(() => {
    colors = palette();
    lastDark = null; // force re-apply with the new palette
    update();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

/* ============================================
   PRO-LEVEL UPGRADES: LENIS, BARBA.JS, THREE.JS
   ============================================ */

// 1. THREE.JS BACKGROUND
function initThreeJSBackground() {
  if (typeof THREE === 'undefined') return;
  
  if (document.getElementById('three-bg-canvas')) return; // already exists

  const canvas = document.createElement('canvas');
  canvas.id = 'three-bg-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 300;
  const posArray = new Float32Array(particlesCount * 3);
  for(let i=0; i<particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15;
  }
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x8b2cf5,
    transparent: true,
    opacity: 0.5
  });
  
  const particlesMesh = new THREE.Points(particlesGeometry, material);
  scene.add(particlesMesh);
  camera.position.z = 5;

  let mouseX = 0;
  let mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;
    
    particlesMesh.position.x += (mouseX - particlesMesh.position.x) * 0.05;
    particlesMesh.position.y += (-mouseY - particlesMesh.position.y) * 0.05;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// 2. LENIS SMOOTH SCROLL
let lenis;
function initLenis() {
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time)=>{
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }
}

// 3. BARBA.JS PAGE TRANSITIONS
function initBarba() {
  if (typeof barba === 'undefined') return;
  barba.init({
    sync: true,
    transitions: [{
      name: 'opacity-transition',
      leave(data) {
        return gsap.to(data.current.container, { opacity: 0, duration: 0.4 });
      },
      enter(data) {
        window.scrollTo(0, 0);
        if (lenis) lenis.scrollTo(0, { immediate: true });
        
        gsap.set(data.next.container, { opacity: 0 });
        
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.getAll().forEach(t => t.kill());
        }

        return gsap.to(data.next.container, { opacity: 1, duration: 0.4, delay: 0.1 });
      },
      after(data) {
        if (typeof initApp === 'function') {
           setTimeout(() => {
             initApp();
             ScrollTrigger.refresh();
           }, 50);
        }
      }
    }]
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initThreeJSBackground();
  initLenis();
  initBarba();
});
