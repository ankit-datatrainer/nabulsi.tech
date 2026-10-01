/* ==========================================================================
   NABULSI.TECH — SITE PREVIEW KIT (shared by index.html and work.html)
   · Live preview modal: browse a website we built without leaving the page.
     Any element with data-preview="<slug>" opens it.
   · Browser mockups (.wk-browser) scroll their full-page capture on hover.
   Data: window.NABULSI_WORK (work-data.js). Styles: site-preview.css.
   ========================================================================== */
(function () {
  'use strict';

  var DATA = window.NABULSI_WORK || [];
  if (!DATA.length) return;

  var IMG = 'assets/work/';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function bySlug(slug) {
    for (var i = 0; i < DATA.length; i++) if (DATA[i].slug === slug) return i;
    return -1;
  }
  /* work.html: main.js's top-level `let lenis`; index.html: home.js sets window.lenis */
  function getLenis() {
    try { return (typeof lenis !== 'undefined' && lenis) || window.lenis || null; } catch (e) { return window.lenis || null; }
  }

  var ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4.5 11.5l7-7M11.5 4.5H6M11.5 4.5V10"/></svg>';

  /* ------------------------------------------------ hover-scroll mockups */
  function bindBrowser(el) {
    if (el.__wkBound) return;
    el.__wkBound = true;
    var img = $('.wk-browser__page', el);
    var screen = $('.wk-browser__screen', el);
    if (!img || !screen) return;
    el.addEventListener('mouseenter', function () {
      if (reduce) return;
      var d = img.offsetHeight - screen.offsetHeight;
      if (d <= 0) return;
      el.style.setProperty('--wk-dur', Math.min(16, Math.max(3, d / 240)).toFixed(2) + 's');
      img.style.transform = 'translate3d(0,' + (-d) + 'px,0)';
      el.classList.add('is-scrolled');
    });
    el.addEventListener('mouseleave', function () {
      el.style.setProperty('--wk-dur', '1.2s');
      img.style.transform = 'translate3d(0,0,0)';
      el.classList.remove('is-scrolled');
    });
  }
  function bindBrowsers(root) { $$('.wk-browser', root).forEach(bindBrowser); }

  /* ------------------------------------------------------------ modal */
  var MARKUP =
    '<div class="lp__backdrop" data-lp-close></div>' +
    '<div class="lp__window" role="dialog" aria-modal="true" aria-labelledby="lp-name">' +
      '<header class="lp__top">' +
        '<div class="lp__title"><span class="wk-badge">Our work</span><h3 id="lp-name">Project</h3><span id="lp-cat"></span></div>' +
        '<div class="lp__devices" role="group" aria-label="Preview size">' +
          '<button type="button" class="is-on" data-device="desktop" aria-pressed="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="8.5" rx="1.2"/><path d="M5.5 14h5M8 11v3"/></svg>Desktop</button>' +
          '<button type="button" data-device="tablet" aria-pressed="false"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="1.5" width="10" height="13" rx="1.5"/><path d="M7 12.5h2"/></svg>Tablet</button>' +
          '<button type="button" data-device="mobile" aria-pressed="false"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="4.5" y="1.5" width="7" height="13" rx="1.5"/><path d="M7.2 12.5h1.6"/></svg>Mobile</button>' +
        '</div>' +
        '<div class="lp__actions">' +
          '<button class="lp__icon" type="button" data-lp-prev aria-label="Previous website"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg></button>' +
          '<button class="lp__icon" type="button" data-lp-next aria-label="Next website"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg></button>' +
          /* no href until a site is chosen: main.js binds smooth-scroll to a[href^="#"] */
          '<a class="wk-btn wk-btn--solid" id="lp-visit" target="_blank" rel="noopener"><span>Visit website</span> ' + ARROW + '</a>' +
          '<button class="lp__icon lp__close" id="lp-close" type="button" data-lp-close aria-label="Close preview"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg></button>' +
        '</div>' +
      '</header>' +
      '<div class="lp__stage">' +
        '<div class="lp__device" id="lp-device" data-device="desktop">' +
          '<div class="wk-chrome"><i></i><i></i><i></i><span class="lp__url" id="lp-url"></span><span class="lp__mode" id="lp-mode">Live site</span></div>' +
          '<div class="lp__viewport">' +
            '<iframe id="lp-frame" title="Live website preview" src="about:blank" allow="fullscreen" referrerpolicy="strict-origin-when-cross-origin"></iframe>' +
            '<div class="lp__snap" id="lp-snap" tabindex="0" data-lenis-prevent><img id="lp-snap-img" alt=""></div>' +
            '<div class="lp__loader" id="lp-loader"><img id="lp-loader-img" alt=""><span></span>Loading the live site&hellip;</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<p class="lp__note" id="lp-note"></p>' +
    '</div>';

  var lp = $('#lp');
  if (!lp) {
    lp = document.createElement('div');
    lp.className = 'lp';
    lp.id = 'lp';
    lp.setAttribute('aria-hidden', 'true');
    lp.setAttribute('inert', '');
    lp.setAttribute('data-lenis-prevent', '');
    lp.innerHTML = MARKUP;
    document.body.appendChild(lp);
  }

  var state = { i: -1, mode: 'live', device: 'desktop', timer: null, lastFocus: null };

  function show(i) {
    var d = DATA[i];
    state.i = i;
    lp.style.setProperty('--accent', d.accent);
    $('#lp-name').textContent = d.name;
    $('#lp-cat').textContent = d.label;
    $('#lp-url').textContent = d.domain;
    var visit = $('#lp-visit');
    visit.href = d.url;
    visit.setAttribute('aria-label', 'Visit ' + d.name + ' (opens in a new tab)');
    $('#lp-loader-img').src = IMG + d.slug + '-hero.webp';
    setMode(d.embed ? 'live' : 'snap');
  }

  function snapSrc() {
    var d = DATA[state.i];
    return IMG + d.slug + (state.device === 'mobile' && !d.embed ? '-mobile-full.webp' : '-full.webp');
  }

  function setMode(mode) {
    var d = DATA[state.i];
    var frame = $('#lp-frame');
    var loader = $('#lp-loader');
    var label = $('#lp-mode');
    var note = $('#lp-note');
    state.mode = mode;
    clearTimeout(state.timer);
    lp.classList.toggle('is-snap', mode === 'snap');
    label.classList.toggle('is-snap', mode === 'snap');

    if (mode === 'live') {
      label.textContent = 'Live site';
      note.innerHTML = 'You&rsquo;re browsing the <b>live website</b> right here &mdash; scroll and click freely. ' +
        '<button type="button" data-lp-to="snap">Show full-page capture</button>';
      loader.classList.remove('is-done');
      frame.title = d.name + ' — live website preview';
      frame.src = d.url;
      /* never leave the loader up if a slow site is still working */
      state.timer = setTimeout(function () { loader.classList.add('is-done'); }, 9000);
    } else {
      label.textContent = 'Full-page capture';
      note.innerHTML = d.embed
        ? 'Showing a scrollable <b>full-page capture</b>. <button type="button" data-lp-to="live">Load the live site</button>'
        : 'This site blocks embedding, so you&rsquo;re scrolling a <b>full-page capture</b> of it. Hit &ldquo;Visit website&rdquo; for the live experience.';
      frame.src = 'about:blank';
      loader.classList.add('is-done');
      $('#lp-snap-img').src = snapSrc();
      $('#lp-snap-img').alt = d.name + ' — full-page capture';
      $('#lp-snap').scrollTop = 0;
    }
  }

  function setDevice(dev) {
    state.device = dev;
    $('#lp-device').setAttribute('data-device', dev);
    $$('.lp__devices button', lp).forEach(function (b) {
      var on = b.getAttribute('data-device') === dev;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (state.mode === 'snap') $('#lp-snap-img').src = snapSrc();
  }

  function open(slug) {
    var i = bySlug(slug);
    if (i < 0) return;
    state.lastFocus = document.activeElement;
    show(i);
    lp.classList.add('is-open');
    lp.setAttribute('aria-hidden', 'false');
    lp.removeAttribute('inert');
    document.documentElement.classList.add('lp-open');
    var l = getLenis();
    if (l) l.stop();
    setTimeout(function () { $('#lp-close').focus({ preventScroll: true }); }, 60);
  }

  function close() {
    if (!lp.classList.contains('is-open')) return;
    lp.classList.remove('is-open');
    lp.setAttribute('aria-hidden', 'true');
    lp.setAttribute('inert', '');
    document.documentElement.classList.remove('lp-open');
    clearTimeout(state.timer);
    var l = getLenis();
    if (l) l.start();
    /* unload the site once the window has closed so it stops running */
    setTimeout(function () {
      if (!lp.classList.contains('is-open')) $('#lp-frame').src = 'about:blank';
    }, 700);
    if (state.lastFocus && state.lastFocus.focus) state.lastFocus.focus({ preventScroll: true });
  }

  var frame = $('#lp-frame');
  frame.addEventListener('load', function () {
    var src = frame.getAttribute('src');
    if (src && src !== 'about:blank' && state.mode === 'live') {
      clearTimeout(state.timer);
      $('#lp-loader').classList.add('is-done');
    }
  });

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-preview]');
    if (t) { e.preventDefault(); open(t.getAttribute('data-preview')); return; }
    if (!lp.classList.contains('is-open')) return;
    if (e.target.closest('[data-lp-close]')) { close(); return; }
    if (e.target.closest('[data-lp-prev]')) { show((state.i - 1 + DATA.length) % DATA.length); return; }
    if (e.target.closest('[data-lp-next]')) { show((state.i + 1) % DATA.length); return; }
    var m = e.target.closest('[data-lp-to]');
    if (m) { setMode(m.getAttribute('data-lp-to')); return; }
    var dv = e.target.closest('[data-device]');
    if (dv && dv.closest('.lp__devices')) setDevice(dv.getAttribute('data-device'));
  });

  document.addEventListener('keydown', function (e) {
    if (!lp.classList.contains('is-open')) {
      var t = e.target.closest && e.target.closest('.wk-browser[data-preview]');
      if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(t.getAttribute('data-preview')); }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowRight') show((state.i + 1) % DATA.length);
    else if (e.key === 'ArrowLeft') show((state.i - 1 + DATA.length) % DATA.length);
    else if (e.key === 'Tab') {
      var f = $$('button, a[href], iframe, [tabindex="0"]', $('.lp__window', lp)).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  window.NabulsiPreview = { open: open, close: close, bindBrowsers: bindBrowsers };
})();
