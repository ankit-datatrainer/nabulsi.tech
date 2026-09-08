/* ==========================================================================
   NABULSI.TECH — HOME PAGE MOTION
   GSAP + ScrollTrigger + Lenis. Every effect degrades gracefully:
   if a CDN fails or the visitor prefers reduced motion, the page still
   renders fully and stays usable.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------- setup */
  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  var hasGSAP = typeof window.gsap !== "undefined";
  var hasST = hasGSAP && typeof window.ScrollTrigger !== "undefined";
  var hasLenis = typeof window.Lenis !== "undefined";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var motion = hasGSAP && !reduced;

  if (hasST) gsap.registerPlugin(ScrollTrigger);

  var loader = $("#loader");
  var curtain = $("#curtain");
  var lenis = null;

  /* Absolute fallback: never leave a visitor stuck behind the preloader. */
  var failSafe = window.setTimeout(function () { hardReveal(); }, 5200);

  function hardReveal() {
    window.clearTimeout(failSafe);
    if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
    if (curtain) curtain.style.display = "none";
    $$(".reveal-y").forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    $$(".line > i").forEach(function (el) { el.style.transform = "none"; });
    var dock = $("#dock");
    if (dock) dock.style.transform = "translate(-50%, 0)";
  }

  /* ------------------------------------------------------- smooth scroll */
  function initScroll() {
    if (!hasLenis || !motion) return;

    lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      touchMultiplier: 1.6
    });

    if (hasST) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  function lockScroll(on) {
    document.body.classList.toggle("is-locked", !!on);
    if (!lenis) return;
    if (on) lenis.stop(); else lenis.start();
  }

  /* ----------------------------------------------------------- utilities */

  /** Wrap the words of an element in spans, keeping whitespace text nodes
   *  intact so `text-align: justify` keeps working. */
  function wrapWords(el) {
    var words = [];
    var frag = document.createDocumentFragment();

    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            var s = document.createElement("span");
            s.className = "word";
            s.textContent = part;
            frag.appendChild(s);
            words.push(s);
          }
        });
      } else if (node.nodeType === 1) {
        node.classList.add("word");
        frag.appendChild(node);
        words.push(node);
      }
    });

    el.innerHTML = "";
    el.appendChild(frag);
    return words;
  }

  /** Seamless horizontal marquee for a row whose children form one "set". */
  function marquee(row, direction, pxPerSecond) {
    if (!motion || !row) return;

    var originals = Array.prototype.slice.call(row.children);
    if (!originals.length) return;

    var styles = window.getComputedStyle(row);
    var gap = parseFloat(styles.columnGap || styles.gap) || 0;

    var setWidth = originals.reduce(function (sum, el) {
      return sum + el.getBoundingClientRect().width + gap;
    }, 0);
    if (setWidth < 10) return;

    var guard = 0;
    while (row.getBoundingClientRect().width < window.innerWidth + setWidth && guard < 12) {
      originals.forEach(function (el) { row.appendChild(el.cloneNode(true)); });
      guard++;
    }

    var from = direction < 0 ? 0 : -setWidth;
    var to = direction < 0 ? -setWidth : 0;

    gsap.set(row, { x: from });
    var tween = gsap.to(row, {
      x: to,
      duration: setWidth / (pxPerSecond || 55),
      ease: "none",
      repeat: -1
    });

    row.addEventListener("mouseenter", function () { tween.timeScale(0.25); });
    row.addEventListener("mouseleave", function () { tween.timeScale(1); });
  }

  /* --------------------------------------------------------- 1. PRELOADER */
  /* The site now renders immediately. Keep this small compatibility hook so
     older cached markup can never delay the page behind a loading animation. */
  function initLoader(done) {
    window.clearTimeout(failSafe);
    hardReveal();
    done();
  }

  /* --------------------------------------------------------- 2. HERO INTRO */
  function initHero() {
    if (!motion) return;

    var titleLines = $$('.hero__title .line > i');
    var figs = $$(".hero__fig");
    var skelBars = $$(".hero .skel i");

    gsap.set(titleLines, { yPercent: 115 });
    gsap.set("#hero-sub", { y: 26, opacity: 0 });
    gsap.set("#hero-cta", { y: 26, opacity: 0 });
    gsap.set(figs, { opacity: 0, scale: 1.14, y: 34 });
    gsap.set(".hero__fig .frame", { opacity: 0, scale: 0.94 });
    gsap.set(skelBars, { scaleX: 0 });
    gsap.set(".hero__scroll", { opacity: 0 });
    gsap.set("#ticker", { opacity: 0, y: 20 });

    var tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.to(titleLines, { yPercent: 0, duration: 1.35, stagger: 0.09 })
      .to("#hero-sub", { y: 0, opacity: 1, duration: 1 }, "-=0.9")
      .to("#hero-cta", { y: 0, opacity: 1, duration: 1 }, "-=0.85")
      .to(figs, {
        opacity: 1, scale: 1, y: 0, duration: 1.5,
        stagger: { each: 0.11, from: "random" }
      }, "-=1.15")
      .to(".hero__fig .frame", { opacity: 1, scale: 1, duration: 1.1, stagger: 0.09 }, "-=1.25")
      .to(skelBars, { scaleX: 1, duration: 0.9, stagger: 0.035 }, "-=1.3")
      .to(".hero__scroll", { opacity: 1, duration: 0.8 }, "-=0.6")
      .to("#ticker", { opacity: 1, y: 0, duration: 0.9 }, "-=0.7")
      .to("#dock", { y: "0%", duration: 1, ease: "expo.out" }, "-=0.55");

    /* Idle float — each frame drifts on its own rhythm */
    figs.forEach(function (fig, i) {
      gsap.to(fig, {
        y: i % 2 === 0 ? -16 : 18,
        duration: 3 + i * 0.45,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.6 + i * 0.2
      });
    });

    /* Mouse parallax */
    if (window.matchMedia("(hover: hover)").matches) {
      var setters = figs.map(function (fig) {
        return {
          el: fig,
          depth: parseFloat(fig.dataset.depth || "0.05"),
          x: gsap.quickTo(fig, "x", { duration: 1.1, ease: "power3.out" }),
          rot: gsap.quickTo(fig, "rotation", { duration: 1.3, ease: "power3.out" })
        };
      });

      window.addEventListener("mousemove", function (e) {
        var dx = e.clientX - window.innerWidth / 2;
        var dy = e.clientY - window.innerHeight / 2;
        setters.forEach(function (s) {
          s.x(-dx * s.depth);
          s.rot((dx * s.depth) / 22 + (dy * s.depth) / 40);
        });
      }, { passive: true });
    }

    /* Scroll parallax — figures drift out at different speeds */
    if (hasST) {
      figs.forEach(function (fig, i) {
        gsap.to(fig, {
          yPercent: -14 - i * 9,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      });

      gsap.to(".hero__content", {
        yPercent: 12,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: "#hero", start: "30% top", end: "bottom top", scrub: true }
      });

      /* The top bar belongs to the hero only — the dock takes over after it,
         which keeps long-form sections completely free of overlapping chrome. */
      gsap.to(".topbar", {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: "#hero", start: "45% top", end: "70% top", scrub: true }
      });
    }
  }

  /* --------------------------------------------------- 3. GENERIC REVEALS */
  function initReveals() {
    if (!motion || !hasST) {
      $$(".reveal-y").forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    $$(".reveal-y").forEach(function (el) {
      gsap.fromTo(el,
        { y: 34, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.15, ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true }
        }
      );
    });

    /* Skeleton bars outside the hero draw in on scroll */
    $$(".skel").forEach(function (group) {
      if (group.closest(".hero")) return;
      gsap.fromTo($$("i", group),
        { scaleX: 0 },
        {
          scaleX: 1, duration: 0.85, stagger: 0.05, ease: "power3.out",
          scrollTrigger: { trigger: group, start: "top 92%", once: true }
        }
      );
    });
  }

  /* ------------------------------------------------------ 4. MANIFESTO */
  function initManifesto() {
    var quote = $("#manifesto-quote");
    if (!quote) return;

    var lines = $$(".mline", quote);
    var words = [];
    lines.forEach(function (line) {
      words = words.concat(wrapWords(line));
    });

    if (!motion || !hasST) return;

    var fillable = words.filter(function (w) { return !w.classList.contains("qm"); });

    gsap.fromTo(fillable,
      { color: "#e4e4e4" },
      {
        color: "#a0a0a0",
        ease: "none",
        stagger: 0.35,
        scrollTrigger: {
          trigger: quote,
          start: "top 82%",
          end: "bottom 58%",
          scrub: 0.6
        }
      }
    );

    gsap.fromTo(lines,
      { yPercent: 22, opacity: 0 },
      {
        yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.08, ease: "expo.out",
        scrollTrigger: { trigger: quote, start: "top 90%", once: true }
      }
    );
  }

  /* ----------------------------------------------------------- 5. WORK */
  function initWork() {
    var title = $("#work-title");
    if (!title || !motion || !hasST) return;

    gsap.fromTo(title,
      { clipPath: "inset(0 0 100% 0)", yPercent: 12 },
      {
        clipPath: "inset(0 0 0% 0)", yPercent: 0, duration: 1.5, ease: "expo.out",
        scrollTrigger: { trigger: title, start: "top 88%", once: true }
      }
    );

    /* Scan the pixel stripes as the section passes — reads as a live signal.
       0.192em == exactly four stripe periods, so it loops without a jump. */
    gsap.to(title, {
      backgroundPositionY: "0.192em",
      ease: "none",
      scrollTrigger: { trigger: title, start: "top bottom", end: "bottom top", scrub: true }
    });

    /* Cards lift with a small alternating drift */
    $$(".wcard").forEach(function (card, i) {
      gsap.fromTo(card,
        { y: 60, opacity: 0, scale: 0.985 },
        {
          y: 0, opacity: 1, scale: 1, duration: 1.25, ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 90%", once: true }
        }
      );

      /* Whole card drifts instead of the image, so the artwork is never clipped */
      gsap.fromTo(card,
        { yPercent: i % 2 ? 1.6 : -1.6 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "top 45%", scrub: true }
        }
      );
    });
  }

  /* -------------------------------------------------------- 6. PROCESS */
  function initProcess() {
    var steps = $$(".pstep");
    if (!steps.length) return;

    if (!motion || !hasST) {
      steps.forEach(function (s) { s.classList.add("is-on"); });
      return;
    }

    steps.forEach(function (step) {
      ScrollTrigger.create({
        trigger: step,
        start: "top 72%",
        end: "bottom 42%",
        toggleClass: { targets: step, className: "is-on" }
      });

      gsap.fromTo(step,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.1, ease: "expo.out",
          scrollTrigger: { trigger: step, start: "top 92%", once: true }
        }
      );
    });
  }

  /* ---------------------------------------------------------- 7. STATS */
  function initStats() {
    var nums = $$("[data-count]");
    if (!nums.length) return;

    if (!motion || !hasST) {
      nums.forEach(function (n) { n.textContent = n.dataset.count; });
      return;
    }

    nums.forEach(function (node) {
      var target = parseFloat(node.dataset.count) || 0;
      var proxy = { v: 0 };

      ScrollTrigger.create({
        trigger: node,
        start: "top 88%",
        once: true,
        onEnter: function () {
          gsap.to(proxy, {
            v: target,
            duration: 1.9,
            ease: "power2.out",
            onUpdate: function () { node.textContent = Math.round(proxy.v); }
          });
        }
      });
    });
  }

  /* ------------------------------------------------------- 8. MARQUEES */
  function initMarquees() {
    marquee($("#ticker-row"), -1, 62);

    $$("[data-marquee]").forEach(function (row) {
      marquee(row, parseInt(row.dataset.marquee, 10) < 0 ? -1 : 1, 78);
    });

    marquee($("#words-track"), -1, 58);
  }

  /* --------------------------------------------------------- 9. CLOSER */
  function initCloser() {
    if (!motion || !hasST) return;

    var lines = $$('.closer__title .line > i');
    gsap.set(lines, { yPercent: 115 });

    gsap.to(lines, {
      yPercent: 0,
      duration: 1.4,
      stagger: 0.1,
      ease: "expo.out",
      scrollTrigger: { trigger: "#closer", start: "top 78%", once: true }
    });
  }

  /* ------------------------------------------------- 10. CURSOR + MAGNET */
  function initCursor() {
    var cursor = $("#cursor");
    if (!cursor || !motion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    var toX = gsap.quickTo(cursor, "x", { duration: 0.42, ease: "power3.out" });
    var toY = gsap.quickTo(cursor, "y", { duration: 0.42, ease: "power3.out" });
    var shown = false;

    window.addEventListener("mousemove", function (e) {
      if (!shown) { gsap.to(cursor, { opacity: 1, duration: 0.3 }); shown = true; }
      toX(e.clientX);
      toY(e.clientY);
    }, { passive: true });

    document.addEventListener("mouseleave", function () {
      gsap.to(cursor, { opacity: 0, duration: 0.25 });
      shown = false;
    });

    $$("[data-cursor]").forEach(function (el) {
      var mode = el.dataset.cursor;
      el.addEventListener("mouseenter", function () {
        cursor.classList.add(mode === "view" ? "is-view" : "is-hot");
      });
      el.addEventListener("mouseleave", function () {
        cursor.classList.remove("is-view", "is-hot");
      });
    });

    /* Magnetic buttons */
    $$(".magnetic").forEach(function (el) {
      var mx = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      var my = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.28);
        my((e.clientY - (r.top + r.height / 2)) * 0.4);
      });
      el.addEventListener("mouseleave", function () { mx(0); my(0); });
    });
  }

  /* ----------------------------------------------------- 11. DOCK + MENU */
  function initMenu() {
    var dock = $("#dock");
    var menu = $("#menu");
    var btnMenu = $("#dock-menu");
    var btnPlus = $("#dock-plus");
    var links = $$(".menu__link > i");
    var blocks = $$(".menu__block");
    var open = false;
    var tl = null;

    if (!menu || !dock) return;

    if (motion) {
      gsap.set(menu, { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(links, { yPercent: 115 });
      gsap.set(blocks, { y: 22, opacity: 0 });

      tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } })
        .to(menu, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: "power4.inOut" })
        .to(links, { yPercent: 0, duration: 1, stagger: 0.07 }, "-=0.45")
        .to(blocks, { y: 0, opacity: 1, duration: 0.8, stagger: 0.07 }, "-=0.7");
    }

    function setOpen(next) {
      open = next;
      menu.classList.toggle("is-open", open);
      dock.classList.toggle("is-open", open);
      [btnMenu, btnPlus].forEach(function (b) {
        if (b) b.setAttribute("aria-expanded", String(open));
      });
      if (btnMenu) btnMenu.textContent = open ? "Close" : "Menu";
      lockScroll(open);

      if (tl) {
        if (open) tl.timeScale(1).play();
        else tl.timeScale(1.7).reverse();
      } else {
        menu.style.clipPath = open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)";
        menu.style.visibility = open ? "visible" : "hidden";
      }
    }

    [btnMenu, btnPlus].forEach(function (b) {
      if (b) b.addEventListener("click", function () { setOpen(!open); });
    });

    $$(".menu__link").forEach(function (a) {
      a.addEventListener("click", function () { if (open) setOpen(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && open) setOpen(false);
    });

    /* Dock hides while the hero is on screen, then rides along */
    if (motion && hasST) {
      ScrollTrigger.create({
        trigger: "#hero",
        start: "60% top",
        onEnter: function () { gsap.to(dock, { y: "0%", duration: 0.7, ease: "expo.out" }); },
        onLeaveBack: function () {
          if (!open) gsap.to(dock, { y: "0%", duration: 0.7, ease: "expo.out" });
        }
      });
    } else {
      dock.style.transform = "translate(-50%, 0)";
    }
  }

  /* -------------------------------------------------- 12. SCROLL PROGRESS */
  function initProgress() {
    var bar = $("#progress-bar");
    if (!bar) return;

    if (motion && hasST) {
      gsap.to(bar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.25 }
      });
      return;
    }

    var onScroll = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (h > 0 ? window.scrollY / h : 0) + ")";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------ 13. CLOCK */
  function initClock() {
    var el = $("#clock");
    if (!el) return;

    var tick = function () {
      var now = new Date();
      try {
        var timeStr = now.toLocaleTimeString("en-US", {
          timeZone: "America/Chicago",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
        el.textContent = timeStr + " CT";
      } catch (e) {
        var ctOffset = -300; // fallback US Central Time
        var ct = new Date(now.getTime() + (now.getTimezoneOffset() + ctOffset) * 60000);
        var h = String(ct.getHours()).padStart(2, "0");
        var m = String(ct.getMinutes()).padStart(2, "0");
        el.textContent = h + ":" + m + " CT";
      }
    };
    tick();
    window.setInterval(tick, 15000);
  }

  /* ------------------------------------------------------------- 14. WHATSAPP FAB */
  function whatsappFab() {
    if (document.querySelector(".wa-fab")) return;
    var a = document.createElement("a");
    a.className = "wa-fab";
    a.href = "https://api.whatsapp.com/send/?phone=19012772195&text&type=phone_number&app_absent=0";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("aria-label", "Chat on WhatsApp");
    a.innerHTML =
      '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.04 4C9.95 4 5 8.95 5 15.04c0 2.13.6 4.13 1.64 5.82L5 28l7.34-1.6a11 11 0 0 0 3.7.64h.01C22.13 27.04 27 22.09 27 16S22.13 4 16.04 4zm0 20.2c-1.16 0-2.3-.31-3.29-.9l-.24-.14-3.9.85.83-3.8-.16-.25a8.2 8.2 0 1 1 6.76 4.24zm4.5-6.14c-.25-.12-1.47-.72-1.7-.8-.23-.08-.4-.12-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.15-.01-.32-.01-.48-.01-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.16 1.73 2.64 4.19 3.7.59.26 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"/></svg>' +
      '<span class="wa-label">Chat with us</span>';
    document.body.appendChild(a);
  }

  /* ------------------------------------------------------------- 15. BOOT */
  function boot() {
    document.documentElement.classList.add("js-ready");

    initScroll();
    initClock();
    initManifesto();   // split words before ScrollTriggers measure layout
    initProgress();
    initMenu();
    initCursor();
    whatsappFab();

    initLoader(function () {
      initHero();
      initReveals();
      initWork();
      initProcess();
      initStats();
      initCloser();
      initMarquees();

      if (hasST) {
        ScrollTrigger.refresh();
        window.setTimeout(function () { ScrollTrigger.refresh(); }, 400);
      }
    });
  }

  /* Wait for fonts so measurements (marquees, justify, splits) are accurate. */
  function start() {
    if (document.fonts && document.fonts.ready) {
      var settled = false;
      var go = function () { if (!settled) { settled = true; boot(); } };
      document.fonts.ready.then(go);
      window.setTimeout(go, 1800);
    } else {
      boot();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  window.addEventListener("load", function () {
    if (hasST) ScrollTrigger.refresh();
  });

  /* Re-measure marquees / triggers on resize (debounced) */
  var rt;
  window.addEventListener("resize", function () {
    window.clearTimeout(rt);
    rt = window.setTimeout(function () {
      if (hasST) ScrollTrigger.refresh();
    }, 250);
  });
})();
