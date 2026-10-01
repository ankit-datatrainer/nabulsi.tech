/* ==========================================================================
   NABULSI.TECH — WORK PAGE: LIVE WEBSITE SHOWCASE
   Renders the hero wall, the horizontal slide showcase and the project index
   from window.NABULSI_WORK. The live preview modal is site-preview.js.
   ========================================================================== */
(function () {
  'use strict';

  var DATA = window.NABULSI_WORK || [];
  var CATS = window.NABULSI_WORK_CATS || {};
  if (!DATA.length) return;

  var IMG = 'assets/work/';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hover = window.matchMedia('(hover: hover)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  var hasST = hasGsap && typeof window.ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  var ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4.5 11.5l7-7M11.5 4.5H6M11.5 4.5V10"/></svg>';
  var EYE = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2"/></svg>';

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function bySlug(slug) {
    for (var i = 0; i < DATA.length; i++) if (DATA[i].slug === slug) return i;
    return -1;
  }
  function chrome(domain, dark) {
    return '<div class="wk-chrome' + (dark ? ' wk-chrome--dark' : '') + '" aria-hidden="true"><i></i><i></i><i></i><span>' + esc(domain) + '</span></div>';
  }
  function catCount() {
    var seen = {};
    DATA.forEach(function (d) { seen[d.cat] = 1; });
    return Object.keys(seen).length;
  }
  /* main.js owns the page's Lenis instance (a top-level `let lenis`) */
  function getLenis() {
    try { return (typeof lenis !== 'undefined' && lenis) || null; } catch (e) { return null; }
  }
  /* Lenis caches the page height (ResizeObserver, debounced); after the pin
     changes length it would clamp scrollTo() to the old height. */
  function remeasureScroll() {
    var l = getLenis();
    if (l && typeof l.resize === 'function') l.resize();
  }
  /* document offset that ignores transforms (reveal tweens offset the panels) */
  function docTop(el) {
    var y = 0;
    for (var n = el; n; n = n.offsetParent) y += n.offsetTop;
    return y;
  }

  /* ------------------------------------------------------------ RENDER */
  function renderWall() {
    var wall = $('#wk-wall-plane');
    if (!wall) return;
    var cols = [[], [], []];
    DATA.forEach(function (d, i) { cols[i % 3].push(d); });
    /* no lazy-loading: inside the 3D plane Chrome misjudges visibility and never loads them */
    /* seconds per tile, per column (the original 4-tile columns ran 46s / 52s / 40s) */
    var PACE = [11.5, 13, 10];
    wall.innerHTML = cols.map(function (col, c) {
      var tiles = col.map(function (d) {
        return '<div class="wk-tile" data-preview="' + d.slug + '">' + chrome(d.domain) +
          '<img src="' + IMG + d.slug + '-thumb.webp" alt="" width="800" height="500" decoding="async"></div>';
      }).join('');
      /* doubled so the vertical loop is seamless; duration keeps the drift speed constant */
      return '<div class="wk-wall__col"><div class="wk-wall__track" style="animation-duration:' + (col.length * PACE[c]).toFixed(1) + 's">' +
        tiles + tiles + '</div></div>';
    }).join('');
  }

  function renderBand() {
    var band = $('#wk-band-track');
    if (!band) return;
    var set = '<span>' + DATA.map(function (d) { return esc(d.name) + ' <b>&#10022;</b>'; }).join(' ') + '</span>';
    band.innerHTML = set + set;
    /* ~5s per name keeps the original drift speed whatever the count */
    band.style.animationDuration = (DATA.length * 5) + 's';
  }

  function renderPanels(list) {
    var track = $('#wk-track');
    if (!track) return;
    track.innerHTML = list.map(function (d, i) {
      return '' +
        '<article class="wk-panel" id="site-' + d.slug + '" style="--accent:' + d.accent + '" aria-label="' + esc(d.name) + ' — our work">' +
          '<div class="wk-panel__info">' +
            '<span class="wk-panel__num" aria-hidden="true">' + pad(i + 1) + '</span>' +
            '<div class="wk-panel__meta"><span class="wk-badge">Our work</span><span class="wk-panel__cat">' + esc(d.label) + '</span></div>' +
            '<h3 class="wk-panel__name">' + esc(d.name) + '</h3>' +
            '<p class="wk-panel__desc">' + esc(d.desc) + '</p>' +
            '<ul class="wk-tags">' + d.tags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
            '<div class="wk-panel__actions">' +
              '<button class="wk-btn wk-btn--solid" type="button" data-preview="' + d.slug + '">' + EYE + '<span>Live preview</span></button>' +
              '<a class="wk-btn wk-btn--light" href="' + d.url + '" target="_blank" rel="noopener">Visit website ' + ARROW + '</a>' +
            '</div>' +
            '<span class="wk-panel__credit">Designed &amp; developed by <b>Nabulsi.tech</b></span>' +
          '</div>' +
          '<div class="wk-panel__media">' +
            '<div class="wk-browser" role="button" tabindex="0" data-preview="' + d.slug + '" aria-label="Open the live preview of ' + esc(d.name) + '">' +
              chrome(d.domain, true) +
              /* the (already cached) thumb stands in while the full capture loads */
              '<div class="wk-browser__screen" style="background-image:url(' + IMG + d.slug + '-thumb.webp)">' +
                '<img class="wk-browser__page" src="' + IMG + d.slug + '-full.webp" alt="' + esc(d.name) + ' website, designed and built by Nabulsi.tech" width="1080" loading="lazy" decoding="async">' +
                '<span class="wk-browser__scrollhint" aria-hidden="true"><b></b></span>' +
                '<span class="wk-browser__cta" aria-hidden="true"><i></i>Click to explore live</span>' +
              '</div>' +
            '</div>' +
            '<div class="wk-phone" aria-hidden="true"><img src="' + IMG + d.slug + '-mobile.webp" alt="" loading="lazy" decoding="async"></div>' +
          '</div>' +
        '</article>';
    }).join('');
  }

  function renderIndex() {
    var list = $('#wk-list');
    var filters = $('#wk-filters');
    if (!list) return;
    list.innerHTML = DATA.map(function (d, i) {
      return '' +
        '<li class="wk-row" data-cat="' + d.cat + '" data-slug="' + d.slug + '">' +
          '<button class="wk-row__main" type="button" data-preview="' + d.slug + '" aria-label="Preview ' + esc(d.name) + ' live">' +
            '<span class="wk-row__num">' + pad(i + 1) + '</span>' +
            '<span class="wk-row__name"><img src="' + IMG + d.slug + '-thumb.webp" alt="" loading="lazy" width="800" height="500"><span>' + esc(d.name) + '</span></span>' +
            '<span class="wk-row__cat">' + esc(d.label) + '</span>' +
            '<span class="wk-row__type">' + esc(d.type) + '</span>' +
          '</button>' +
          '<a class="wk-row__visit" href="' + d.url + '" target="_blank" rel="noopener" aria-label="Visit ' + esc(d.name) + ' (opens in a new tab)"><span>Visit</span> ' + ARROW + '</a>' +
        '</li>';
    }).join('');

    if (filters) {
      var counts = {};
      DATA.forEach(function (d) { counts[d.cat] = (counts[d.cat] || 0) + 1; });
      var html = '<button class="wk-filter is-on" type="button" data-filter="all" aria-pressed="true">All <sup>' + DATA.length + '</sup></button>';
      Object.keys(CATS).forEach(function (k) {
        if (counts[k]) html += '<button class="wk-filter" type="button" data-filter="' + k + '" aria-pressed="false">' + esc(CATS[k]) + ' <sup>' + counts[k] + '</sup></button>';
      });
      filters.innerHTML = html;
    }
  }

  renderWall();
  renderBand();
  renderIndex();

  /* ------------------------------------------------------------ HERO */
  function initHero() {
    var hero = $('#wk-hero');
    if (!hero) return;
    var counters = $$('[data-wk-count]', hero);

    function countUp(el, delay) {
      var key = el.getAttribute('data-wk-count');
      var target = key === 'total' ? DATA.length : key === 'cats' ? catCount() : (parseInt(key, 10) || 0);
      if (!hasGsap || reduce) { el.textContent = target; return; }
      el.textContent = '0';
      var o = { v: 0 };
      gsap.to(o, {
        v: target, duration: 1.8, delay: delay, ease: 'power3.out',
        onUpdate: function () { el.textContent = Math.round(o.v); }
      });
    }

    if (!hasGsap || reduce) {
      counters.forEach(function (c) { countUp(c, 0); });
      $$('.wk-hero__scribble path', hero).forEach(function (p) { p.style.strokeDashoffset = '0'; });
      return;
    }

    var lines = $$('.wk-line > span', hero);
    var cols = $$('.wk-wall__col', hero);
    gsap.set(lines, { yPercent: 115 });
    gsap.set(['.wk-hero .wk-kicker', '.wk-hero__lede', '.wk-hero__cta', '.wk-stats'], { y: 24, opacity: 0 });
    gsap.set(cols, { y: 160, opacity: 0 });

    var tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 });
    tl.to('.wk-hero .wk-kicker', { y: 0, opacity: 1, duration: 0.9 })
      .to(lines, { yPercent: 0, duration: 1.4, stagger: 0.12 }, '-=0.7')
      .to('.wk-hero__scribble path', { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, '-=0.6')
      .to('.wk-hero__lede', { y: 0, opacity: 1, duration: 1 }, '-=1.1')
      .to('.wk-hero__cta', { y: 0, opacity: 1, duration: 1 }, '-=0.85')
      .to('.wk-stats', { y: 0, opacity: 1, duration: 1 }, '-=0.8')
      .to(cols, { y: 0, opacity: 1, duration: 1.8, stagger: 0.14 }, 0.25);
    counters.forEach(function (c, i) { countUp(c, 1.1 + i * 0.12); });

    /* Wall reacts to the pointer */
    var tilt = $('.wk-wall__tilt', hero);
    if (tilt && hover) {
      var rx = gsap.quickTo(tilt, 'rotationX', { duration: 1.2, ease: 'power3.out' });
      var ry = gsap.quickTo(tilt, 'rotationY', { duration: 1.2, ease: 'power3.out' });
      hero.addEventListener('mousemove', function (e) {
        var x = e.clientX / window.innerWidth - 0.5;
        var y = e.clientY / window.innerHeight - 0.5;
        ry(x * 10);
        rx(-y * 8);
      }, { passive: true });
      hero.addEventListener('mouseleave', function () { rx(0); ry(0); });
    }

    /* Scroll: copy lifts away, the wall pushes toward the camera.
       Desktop only — on phones the hero is tall and the copy is still being read. */
    if (hasST && window.matchMedia('(min-width: 900px)').matches) {
      gsap.to('.wk-hero__inner', {
        yPercent: -18, opacity: 0.1, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
      });
      if (tilt) {
        gsap.to(tilt, {
          scale: 1.22, yPercent: -8, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
        });
      }
    }
  }

  /* ------------------------------------------------------ LIVE SHOWCASE */
  /* The slider shows one set at a time (Featured, All, or an industry) so the
     pinned scroll stays a sensible length; picking a chip rebuilds it. */
  var showcaseTween = null;
  var showcaseList = [];
  var showcaseMM = null;
  var showcaseFilter = 'featured';
  var SHORT = window.NABULSI_WORK_CATS_SHORT || {};

  function listFor(f) {
    if (f === 'all') return DATA.slice();
    if (f === 'featured') {
      var feat = DATA.filter(function (d) { return d.featured; });
      return feat.length ? feat : DATA.slice();
    }
    return DATA.filter(function (d) { return d.cat === f; });
  }

  function renderChips() {
    var wrap = $('#wk-live-chips');
    if (!wrap) return;
    var counts = {};
    DATA.forEach(function (d) { counts[d.cat] = (counts[d.cat] || 0) + 1; });
    var chips = [['featured', 'Featured', listFor('featured').length], ['all', 'All', DATA.length]];
    Object.keys(CATS).forEach(function (k) { if (counts[k]) chips.push([k, SHORT[k] || CATS[k], counts[k]]); });
    wrap.innerHTML = chips.map(function (c) {
      var on = c[0] === showcaseFilter;
      return '<button class="wk-chip' + (on ? ' is-on' : '') + '" type="button" data-show="' + c[0] + '" aria-pressed="' + on + '">' +
        esc(c[1]) + '<sup>' + c[2] + '</sup></button>';
    }).join('');
  }

  function initShowcase() {
    var section = $('#wk-live');
    var track = $('#wk-track');
    if (!section || !track) return;
    var cur = $('#wk-cur');
    var total = $('#wk-total');
    var now = $('#wk-now');
    var bar = $('#wk-bar');
    var last = -1;

    function setActive(i) {
      if (i === last) return;
      last = i;
      var d = showcaseList[i];
      if (!d) return;
      if (cur) cur.textContent = pad(i + 1);
      if (now) now.textContent = d.name;
      section.style.setProperty('--accent', d.accent);
    }

    function build() {
      if (showcaseMM) { showcaseMM.revert(); showcaseMM = null; }
      showcaseTween = null;
      showcaseList = listFor(showcaseFilter);
      renderPanels(showcaseList);
      if (window.NabulsiPreview) window.NabulsiPreview.bindBrowsers(track);
      if (total) total.textContent = pad(showcaseList.length);
      if (bar) bar.style.transform = 'scaleX(0)';
      last = -1;
      setActive(0);
      track.style.transform = '';
      if (track.parentNode) track.parentNode.scrollLeft = 0;

      if (!hasST || reduce) return;
      var panels = $$('.wk-panel', track);
      var n = panels.length;
      showcaseMM = gsap.matchMedia();

      /* Desktop: pin and slide the projects sideways as the page scrolls */
      showcaseMM.add('(min-width: 900px)', function () {
        section.classList.add('is-pinned');
        var distance = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
        showcaseTween = gsap.to(track, {
          x: function () { return -distance(); },
          ease: 'none',
          scrollTrigger: {
            id: 'wk-live',
            trigger: section,
            start: 'top top',
            end: function () { return '+=' + distance(); },
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
            /* refresh before everything below it, even when rebuilt after them */
            refreshPriority: 1,
            invalidateOnRefresh: true,
            onUpdate: function (self) {
              if (bar) bar.style.transform = 'scaleX(' + self.progress.toFixed(4) + ')';
              setActive(Math.min(n - 1, Math.round(self.progress * (n - 1))));
            }
          }
        });

        panels.forEach(function (p) {
          gsap.fromTo(p.querySelector('.wk-browser'),
            { rotationY: -26, scale: 0.84, xPercent: 10, transformOrigin: '0% 50%' },
            {
              rotationY: 0, scale: 1, xPercent: 0, ease: 'none',
              scrollTrigger: { trigger: p, containerAnimation: showcaseTween, start: 'left 100%', end: 'left 25%', scrub: true }
            });
          gsap.fromTo(p.querySelectorAll('.wk-panel__info > *'),
            { x: 90, opacity: 0 },
            {
              x: 0, opacity: 1, stagger: 0.06, ease: 'none',
              scrollTrigger: { trigger: p, containerAnimation: showcaseTween, start: 'left 92%', end: 'left 40%', scrub: true }
            });
          /* opacity only — the phone's CSS float animation owns its transform */
          gsap.fromTo(p.querySelector('.wk-phone'),
            { opacity: 0 },
            {
              opacity: 1, ease: 'none',
              scrollTrigger: { trigger: p, containerAnimation: showcaseTween, start: 'left 80%', end: 'left 30%', scrub: true }
            });
        });

        return function () { showcaseTween = null; section.classList.remove('is-pinned'); };
      });

      /* Small screens: stacked panels that rise in */
      showcaseMM.add('(max-width: 899px)', function () {
        panels.forEach(function (p, i) {
          gsap.from(p, {
            y: 70, opacity: 0, duration: 1.1, ease: 'expo.out',
            scrollTrigger: {
              trigger: p, start: 'top 88%', once: true,
              onEnter: function () { setActive(i); }
            }
          });
        });
      });
    }

    /* switch sets: rebuild from the top of the section so nobody lands mid-slide */
    function setFilter(f, opts) {
      opts = opts || {};
      if (!f || f === showcaseFilter) return;
      showcaseFilter = f;
      $$('.wk-chip', section).forEach(function (c) {
        var on = c.getAttribute('data-show') === f;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      var st = hasST && ScrollTrigger.getById('wk-live');
      var inPin = !!(st && window.pageYOffset > st.start + 2);
      build();
      if (hasST) {
        /* the rebuilt pin is now the newest trigger; re-sort so it measures first */
        if (ScrollTrigger.sort) ScrollTrigger.sort();
        ScrollTrigger.refresh();
      }
      remeasureScroll();
      var nst = hasST && ScrollTrigger.getById('wk-live');
      if (inPin && nst && !opts.noScroll) {
        var l = getLenis();
        if (l) l.scrollTo(nst.start + 1, { immediate: true, force: true });
        else window.scrollTo(0, nst.start + 1);
      }
      /* desktop only: on phones build()'s own per-panel reveal already plays */
      if (hasGsap && !reduce && !opts.noScroll && showcaseTween) {
        gsap.from($$('.wk-panel', track), { opacity: 0, y: 40, duration: 0.9, stagger: 0.06, ease: 'expo.out', clearProps: 'opacity,transform' });
      }
    }
    initShowcase.setFilter = setFilter;

    section.addEventListener('click', function (e) {
      var chip = e.target.closest('.wk-chip');
      if (chip) setFilter(chip.getAttribute('data-show'));
    });

    /* Section heading reveal */
    if (hasST && !reduce) {
      gsap.from('.wk-live__head > *', {
        y: 40, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: section, start: 'top 75%', once: true }
      });
    }

    renderChips();
    build();
  }

  /* ------------------------------------------------------------ INDEX */
  function initIndex() {
    var list = $('#wk-list');
    if (!list) return;
    var rows = $$('.wk-row', list);

    /* Filters */
    $$('.wk-filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        $$('.wk-filter').forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        var shown = [];
        rows.forEach(function (r) {
          var match = f === 'all' || r.getAttribute('data-cat') === f;
          r.classList.toggle('is-hidden', !match);
          if (match) shown.push(r);
        });
        if (hasGsap && !reduce) {
          gsap.fromTo(shown, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: 'expo.out', overwrite: true });
        }
        if (hasST) ScrollTrigger.refresh();
      });
    });

    /* Rows rise in */
    if (hasST && !reduce) {
      gsap.from(rows, {
        y: 40, opacity: 0, duration: 1, stagger: 0.06, ease: 'expo.out',
        scrollTrigger: { trigger: list, start: 'top 85%', once: true }
      });
      gsap.from('.wk-index__head > *', {
        y: 40, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: '.wk-index__head', start: 'top 85%', once: true }
      });
    }

    /* Floating preview that trails the cursor */
    var float = $('#wk-float');
    if (!float || !hover || !hasGsap) return;
    var fImg = $('img', float);
    var fUrl = $('.wk-chrome span', float);
    var tx = 0, ty = 0, x = 0, y = 0, vx = 0, visible = false, raf = null;

    function loop() {
      var nx = x + (tx - x) * 0.14;
      var ny = y + (ty - y) * 0.14;
      vx = nx - x;
      x = nx; y = ny;
      gsap.set(float, { x: x, y: y, rotation: Math.max(-10, Math.min(10, vx * 0.6)) });
      raf = visible ? requestAnimationFrame(loop) : null;
    }
    function show(d) {
      if (fImg.getAttribute('src') !== IMG + d.slug + '-thumb.webp') fImg.src = IMG + d.slug + '-thumb.webp';
      if (fUrl) fUrl.textContent = d.domain;
      if (!visible) {
        visible = true;
        x = tx; y = ty;
        gsap.to(float, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
        if (!raf) raf = requestAnimationFrame(loop);
      }
    }
    function hide() {
      visible = false;
      gsap.to(float, { opacity: 0, scale: 0.6, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    }
    /* sits beside the cursor, flipping to the left near the right edge */
    function aim(e) {
      var w = float.offsetWidth;
      var h = float.offsetHeight;
      tx = e.clientX + 36 + w > window.innerWidth - 12 ? e.clientX - 36 - w : e.clientX + 36;
      /* stay below the fixed navbar and above the bottom edge */
      ty = Math.min(Math.max(e.clientY, 92 + h / 2 + 12), window.innerHeight - h / 2 - 12);
    }
    gsap.set(float, { xPercent: 0, yPercent: -50, scale: 0.6 });
    list.addEventListener('mousemove', aim, { passive: true });
    rows.forEach(function (r) {
      r.addEventListener('mouseenter', function (e) {
        aim(e);
        show(DATA[bySlug(r.getAttribute('data-slug'))]);
      });
    });
    list.addEventListener('mouseleave', hide);
    $$('.wk-row__visit', list).forEach(function (a) {
      a.addEventListener('mouseenter', hide);
      a.addEventListener('mouseleave', function () { var r = a.closest('.wk-row'); if (r) show(DATA[bySlug(r.getAttribute('data-slug'))]); });
    });
    window.addEventListener('scroll', function () { if (visible) hide(); }, { passive: true });
  }

  /* ------------------------------------------------------- DEEP LINKS */
  function initDeepLink() {
    var m = /^#site-([\w-]+)$/.exec(window.location.hash);
    if (!m) return;
    if (bySlug(m[1]) < 0) return;
    var go = function () {
      var inSet = function () {
        for (var k = 0; k < showcaseList.length; k++) if (showcaseList[k].slug === m[1]) return k;
        return -1;
      };
      /* not in the current set (e.g. not featured): show everything */
      if (inSet() < 0 && initShowcase.setFilter) initShowcase.setFilter('all', { noScroll: true });
      var i = Math.max(0, inSet());
      /* the pin may just have changed length: let Lenis see the new page height */
      remeasureScroll();
      var st = hasST && ScrollTrigger.getById('wk-live');
      var y;
      if (st && showcaseTween) {
        y = st.start + (st.end - st.start) * (showcaseList.length > 1 ? i / (showcaseList.length - 1) : 0);
      } else {
        var el = document.getElementById('site-' + m[1]);
        if (!el) return;
        /* layout offset, not getBoundingClientRect: the panel may still carry its
           70px reveal offset; 90px clears the fixed navbar */
        y = docTop(el) - 90;
        /* unpinned desktop: the panels sit in a sideways strip */
        var vp = el.closest('.wk-live__viewport');
        if (vp && vp.scrollWidth > vp.clientWidth) {
          vp.scrollLeft = el.offsetLeft - (vp.clientWidth - el.offsetWidth) / 2;
          y = docTop(document.getElementById('wk-live'));
        }
      }
      var l = getLenis();
      if (l) l.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
      if (hasST) ScrollTrigger.update();
    };
    if (document.readyState === 'complete') setTimeout(go, 200);
    else window.addEventListener('load', function () { setTimeout(go, 200); });
  }

  initHero();
  initShowcase();   /* binds the hover-scroll mockups itself (site-preview.js) */
  initIndex();
  initDeepLink();

  /* Images change panel heights on some viewports — keep pin maths honest */
  if (hasST) window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
