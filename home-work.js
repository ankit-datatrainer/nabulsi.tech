/* ==========================================================================
   NABULSI.TECH — HOME: LIVE WORK STACK
   Featured websites stack on scroll (each card pins, the next slides over it
   and the one beneath recedes). Screens tilt toward the pointer, scroll their
   site on hover and open the live preview on click (site-preview.js).
   Data: window.NABULSI_WORK (work-data.js).
   ========================================================================== */
(function () {
  'use strict';

  var DATA = window.NABULSI_WORK || [];
  var stack = document.getElementById('hw-stack');
  if (!DATA.length || !stack) return;

  var IMG = 'assets/work/';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hover = window.matchMedia('(hover: hover)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  var hasST = hasGsap && typeof window.ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  var ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4.5 11.5l7-7M11.5 4.5H6M11.5 4.5V10"/></svg>';
  var EYE = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2"/></svg>';

  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var wanted = (stack.getAttribute('data-featured') || '').split(',');
  var featured = [];
  wanted.forEach(function (slug) {
    DATA.forEach(function (d) { if (d.slug === slug) featured.push(d); });
  });
  if (!featured.length) featured = DATA.slice(0, 6);
  var rest = DATA.filter(function (d) { return featured.indexOf(d) < 0; });

  /* ------------------------------------------------------------ RENDER */
  stack.innerHTML = featured.map(function (d, i) {
    return '' +
      '<article class="hw-card" style="--accent:' + d.accent + ';--i:' + i + '" aria-label="' + esc(d.name) + ' — our work">' +
        '<div class="hw-card__body">' +
          '<div class="hw-card__info">' +
            '<div class="hw-card__meta"><span class="hw-card__num">' + pad(i + 1) + '<small>/' + pad(featured.length) + '</small></span><span class="wk-badge">Our work</span></div>' +
            '<h3 class="hw-card__name">' + esc(d.name) + '</h3>' +
            '<p class="hw-card__cat"><span>' + esc(d.label) + '</span><span class="hw-card__type">' + esc(d.type) + '</span></p>' +
            '<p class="hw-card__desc">' + esc(d.desc) + '</p>' +
            '<ul class="hw-card__tags">' + d.tags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
            '<div class="hw-card__actions">' +
              '<button class="wk-btn wk-btn--solid" type="button" data-preview="' + d.slug + '">' + EYE + '<span>Live preview</span></button>' +
              '<a class="wk-btn wk-btn--light" href="' + d.url + '" target="_blank" rel="noopener">Visit website ' + ARROW + '</a>' +
            '</div>' +
          '</div>' +
          '<div class="hw-card__media">' +
            '<div class="hw-tilt">' +
              '<div class="wk-browser" role="button" tabindex="0" data-preview="' + d.slug + '" aria-label="Open the live preview of ' + esc(d.name) + '">' +
                '<div class="wk-chrome wk-chrome--dark" aria-hidden="true"><i></i><i></i><i></i><span>' + esc(d.domain) + '</span></div>' +
                '<div class="wk-browser__screen" style="background-image:url(' + IMG + d.slug + '-thumb.webp)">' +
                  '<img class="wk-browser__page" src="' + IMG + d.slug + '-full.webp" alt="' + esc(d.name) + ' website, designed and built by Nabulsi.tech" width="1080" loading="lazy" decoding="async">' +
                  '<span class="wk-browser__scrollhint" aria-hidden="true"><b></b></span>' +
                  '<span class="hw-glare" aria-hidden="true"></span>' +
                  '<span class="wk-browser__cta" aria-hidden="true"><i></i>Click to explore live</span>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="wk-phone" aria-hidden="true"><img src="' + IMG + d.slug + '-mobile.webp" alt="" loading="lazy" decoding="async"></div>' +
          '</div>' +
          '<span class="hw-card__shade" aria-hidden="true"></span>' +
        '</div>' +
      '</article>';
  }).join('');

  /* 6 fits whole rows at 1, 2 and 3 columns */
  var MORE_VISIBLE = 6;
  var more = document.getElementById('hw-more');
  if (more) {
    more.innerHTML = rest.map(function (d, i) {
      return '' +
        '<article class="hw-mini' + (i >= MORE_VISIBLE ? ' is-extra' : '') + '" style="--accent:' + d.accent + '">' +
          '<button class="hw-mini__shot" type="button" data-preview="' + d.slug + '" aria-label="Preview ' + esc(d.name) + ' live">' +
            '<span class="wk-chrome" aria-hidden="true"><i></i><i></i><i></i><span>' + esc(d.domain) + '</span></span>' +
            '<span class="hw-mini__img"><img src="' + IMG + d.slug + '-thumb.webp" alt="' + esc(d.name) + ' website" width="800" height="500" loading="lazy" decoding="async"></span>' +
            '<span class="hw-mini__peek" aria-hidden="true">' + EYE + 'Live preview</span>' +
          '</button>' +
          '<div class="hw-mini__foot">' +
            '<div><h4>' + esc(d.name) + '</h4><p>' + esc(d.label) + '</p></div>' +
            '<a class="hw-mini__visit" href="' + d.url + '" target="_blank" rel="noopener" aria-label="Visit ' + esc(d.name) + ' (opens in a new tab)">' + ARROW + '</a>' +
          '</div>' +
        '</article>';
    }).join('');

    /* the rest of the sites wait behind a "show all" so the home page stays tight */
    var extra = rest.length - MORE_VISIBLE;
    if (extra > 0) {
      var wrap = document.createElement('div');
      wrap.className = 'hw-more__expand';
      wrap.innerHTML = '<button class="hw-more__btn" type="button" aria-expanded="false" aria-controls="hw-more">' +
        '<span>Show ' + extra + ' more live sites</span><i aria-hidden="true">+</i></button>';
      more.parentNode.insertBefore(wrap, more.nextSibling);
      var btn = wrap.querySelector('button');
      btn.addEventListener('click', function () {
        var open = !more.classList.contains('is-expanded');
        more.classList.toggle('is-expanded', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.querySelector('span').textContent = open ? 'Show fewer' : 'Show ' + extra + ' more live sites';
        if (open && hasGsap && !reduce) {
          gsap.fromTo($$('.hw-mini.is-extra', more), { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.05, ease: 'expo.out', clearProps: 'transform,opacity' });
        }
        if (!open) {
          var top = more.getBoundingClientRect().top + window.pageYOffset - 120;
          if (window.lenis) window.lenis.scrollTo(top, { duration: 1 }); else window.scrollTo({ top: top, behavior: 'smooth' });
        }
        if (hasST) ScrollTrigger.refresh();
      });
    }
  }

  if (window.NabulsiPreview) window.NabulsiPreview.bindBrowsers(stack);

  var cards = $$('.hw-card', stack);

  /* ------------------------------------------- pointer tilt + glare */
  if (hover && !reduce && hasGsap) {
    cards.forEach(function (card) {
      var media = card.querySelector('.hw-card__media');
      var tilt = card.querySelector('.hw-tilt');
      var glare = card.querySelector('.hw-glare');
      if (!media || !tilt) return;
      gsap.set(tilt, { transformPerspective: 1400 });
      var rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.9, ease: 'power3.out' });
      var ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.9, ease: 'power3.out' });
      media.addEventListener('mousemove', function (e) {
        var r = media.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        ry(x * 12);
        rx(-y * 9);
        if (glare) {
          glare.style.setProperty('--gx', ((x + 0.5) * 100).toFixed(1) + '%');
          glare.style.setProperty('--gy', ((y + 0.5) * 100).toFixed(1) + '%');
        }
      });
      media.addEventListener('mouseleave', function () { rx(0); ry(0); });
    });
  }

  /* ---------------------------------------------------- scroll motion */
  if (!hasST || reduce) return;

  var mm = gsap.matchMedia();

  mm.add('(min-width: 900px)', function () {
    cards.forEach(function (card, i) {
      var body = card.querySelector('.hw-card__body');

      /* copy and screen rise in as the card arrives */
      gsap.from(card.querySelectorAll('.hw-card__info > *'), {
        y: 46, opacity: 0, duration: 1.1, stagger: 0.07, ease: 'expo.out',
        scrollTrigger: { trigger: card, start: 'top 78%', once: true }
      });
      gsap.from(card.querySelector('.hw-card__media'), {
        y: 90, rotationX: 16, opacity: 0, transformPerspective: 1600, transformOrigin: '50% 100%',
        duration: 1.5, ease: 'expo.out',
        scrollTrigger: { trigger: card, start: 'top 82%', once: true }
      });

      /* the card beneath recedes as the next one slides over it */
      var next = cards[i + 1];
      if (!next) return;
      var depth = Math.min(3, cards.length - 1 - i);
      var st = {
        trigger: next,
        start: 'top bottom',
        end: function () { return 'top ' + (parseFloat(getComputedStyle(next).top) || 100) + 'px'; },
        scrub: true,
        invalidateOnRefresh: true
      };
      gsap.to(body, { scale: 1 - depth * 0.04, ease: 'none', scrollTrigger: st });
      gsap.to(card.querySelector('.hw-card__shade'), { opacity: 0.6, ease: 'none', scrollTrigger: st });
    });
  });

  mm.add('(max-width: 899px)', function () {
    cards.forEach(function (card) {
      gsap.from(card, {
        y: 70, opacity: 0, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: card, start: 'top 88%', once: true }
      });
    });
  });

  gsap.from($$('.hw-mini:not(.is-extra)'), {
    y: 60, opacity: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out',
    scrollTrigger: { trigger: '#hw-more', start: 'top 85%', once: true }
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
