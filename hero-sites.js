/* Home hero: the floating browser frames cycle through the websites we built,
   and the reel under the CTA loops seamlessly. Data: work-data.js */
(function () {
  'use strict';

  var DATA = window.NABULSI_WORK || [];
  var map = {};
  DATA.forEach(function (d) { map[d.slug] = d; });
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- reel: clone one set so translateX(-50%) loops seamlessly */
  var track = document.getElementById('hero-reel');
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
          if (name) name.textContent = d.name;
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
