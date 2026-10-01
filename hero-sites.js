/* Home hero: the floating browser frames cycle through the websites we built,
   and the reel under the CTA loops seamlessly. Data: work-data.js */
(function () {
  'use strict';

  var DATA = window.NABULSI_WORK || [];
  var map = {};
  DATA.forEach(function (d) { map[d.slug] = d; });
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- reel: every site from the data (the static HTML is the no-JS fallback) */
  var track = document.getElementById('hero-reel');
  if (track && DATA.length) {
    track.innerHTML = DATA.map(function (d) {
      return '<a class="hero__reel-item" href="work.html#site-' + d.slug + '">' +
        '<span class="hero__bar" aria-hidden="true"><i></i><i></i><i></i><em>' + esc(d.domain) + '</em></span>' +
        '<img src="assets/work/' + d.slug + '-thumb.webp" alt="' + esc(d.name) + ' website" loading="lazy" width="800" height="500" />' +
        '<span class="hero__reel-cap"><span class="hero__reel-name">' + esc(d.name) + '</span></span></a>';
    }).join('');
    /* constant drift speed however many sites there are */
    track.style.animationDuration = (DATA.length * 4.6) + 's';
  }

  /* ---------- reel: clone one set so translateX(-50%) loops seamlessly */
  if (track && !reduce) {
    Array.prototype.slice.call(track.children).forEach(function (item) {
      var clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('tabindex', '-1');
      track.appendChild(clone);
    });
    track.classList.add('is-looping');
  }

  /* ---------- floating frames: wipe to the next site every few seconds */
  if (reduce) return;
  var figs = Array.prototype.slice.call(document.querySelectorAll('.hero__site[data-cycle]'));

  figs.forEach(function (fig, f) {
    var list = fig.getAttribute('data-cycle').split(',').filter(function (s) { return map[s]; });
    if (list.length < 2) return;
    var shot = fig.querySelector('.hero__shot');
    var url = fig.querySelector('.hero__bar em');
    var name = fig.querySelector('.hero__site-tag span');
    var idx = 0;
    var busy = false;

    function next() {
      if (busy || document.hidden) return;
      busy = true;
      idx = (idx + 1) % list.length;
      var d = map[list[idx]];
      var img = new Image(800, 500);
      img.alt = d.name + ' website, designed and built by Nabulsi.tech';
      img.className = 'is-entering';
      img.src = 'assets/work/' + d.slug + '-thumb.webp';

      var reveal = function () {
        shot.appendChild(img);
        /* two frames so the entering state is painted before it transitions */
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { img.classList.remove('is-entering'); });
        });
        /* relabel mid-wipe, once the new site covers most of the frame */
        setTimeout(function () {
          if (url) url.textContent = d.domain;
          if (name) name.textContent = d.short || d.name;
        }, 550);
        fig.href = 'work.html#site-' + d.slug;
        fig.setAttribute('aria-label', d.name + ' website — our work');
        setTimeout(function () {
          Array.prototype.slice.call(shot.querySelectorAll('img')).forEach(function (el) {
            if (el !== img) el.remove();
          });
          busy = false;
        }, 1400);
      };

      if (img.decode) img.decode().then(reveal, function () { busy = false; });
      else img.onload = reveal;
    }

    /* staggered so the four frames never change at the same moment */
    setTimeout(function () {
      next();
      setInterval(next, 4600 + f * 400);
    }, 2800 + f * 1150);
  });
})();
