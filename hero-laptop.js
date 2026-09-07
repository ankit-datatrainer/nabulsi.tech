/* ============================================================
   NABULSI.TECH — Hero 3D Laptop (Three.js)
   A particle-assembled laptop spins in, the lid opens, and an
   animated dashboard powers on — themed to the brand purple.
   Mounted into the hero's right column (#hero-laptop canvas).
   ============================================================ */
(function () {
  "use strict";
  if (typeof THREE === "undefined") return;
  const canvas = document.getElementById("hero-laptop");
  if (!canvas) return;
  const host = canvas.parentElement; // .hero-stage
  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof gsap !== "undefined";
  const PI = Math.PI;
  const FINAL = 1.2; // assembled laptop scale (bigger hero presence)

  function size() { return { w: host.clientWidth || 1, h: host.clientHeight || 1 }; }

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 1.0, 7.9);

  /* ---- lights (brand purples + accent) ---- */
  scene.add(new THREE.AmbientLight(0x6b53c0, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 1.05); key.position.set(4, 6, 6); scene.add(key);
  const lP = new THREE.PointLight(0x8B2CF5, 1.6, 40); lP.position.set(-6, 2, 4); scene.add(lP);
  const lV = new THREE.PointLight(0xc264ff, 1.3, 40); lV.position.set(6, -1, 3); scene.add(lV);
  const lA = new THREE.PointLight(0x1f9ad6, 1.0, 40); lA.position.set(0, 4, -4); scene.add(lA);

  /* ---- laptop (theme-aware brand-purple materials) ---- */
  const laptop = new THREE.Group(); scene.add(laptop);
  const metal = new THREE.MeshStandardMaterial({ metalness: 0.9, roughness: 0.34 });
  const edgeMetal = new THREE.MeshStandardMaterial({ metalness: 0.88, roughness: 0.3 });
  const deckMat = new THREE.MeshStandardMaterial({ metalness: 0.6, roughness: 0.6 });
  const padMat = new THREE.MeshStandardMaterial({ metalness: 0.5, roughness: 0.5 });
  const keyMat = new THREE.MeshStandardMaterial({ metalness: 0.5, roughness: 0.55, emissiveIntensity: 0.4 });

  const PALETTE = {
    light: { metal: 0x4a3a7a, edge: 0x5b4895, deck: 0x2a2150, pad: 0x352a63, key: 0x5a4aa0, keyEmis: 0x7a52e0 },
    dark:  { metal: 0x241a3d, edge: 0x2e2350, deck: 0x161029, pad: 0x1d1640, key: 0x2b2358, keyEmis: 0x2a1a4d }
  };
  function applyTheme() {
    const p = document.documentElement.getAttribute("data-theme") === "dark" ? PALETTE.dark : PALETTE.light;
    metal.color.setHex(p.metal); edgeMetal.color.setHex(p.edge);
    deckMat.color.setHex(p.deck); padMat.color.setHex(p.pad);
    keyMat.color.setHex(p.key); keyMat.emissive.setHex(p.keyEmis);
  }
  applyTheme();
  new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  const BASE_W = 4.2, BASE_D = 2.9, BASE_H = 0.16;
  laptop.add(new THREE.Mesh(new THREE.BoxGeometry(BASE_W, BASE_H, BASE_D), metal));

  const deck = new THREE.Mesh(new THREE.BoxGeometry(BASE_W * 0.9, 0.02, BASE_D * 0.78), deckMat);
  deck.position.set(0, BASE_H / 2 + 0.01, 0.18); laptop.add(deck);

  const pad = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.012, 0.7), padMat);
  pad.position.set(0, BASE_H / 2 + 0.012, BASE_D * 0.5 - 0.55); laptop.add(pad);
  const keyGeo = new THREE.BoxGeometry(0.2, 0.03, 0.16);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) {
    const k = new THREE.Mesh(keyGeo, keyMat);
    k.position.set(-1.55 + c * 0.24, BASE_H / 2 + 0.03, -0.55 + r * 0.22); laptop.add(k);
  }

  /* ---- lid + screen ---- */
  const lid = new THREE.Group();
  lid.position.set(0, BASE_H / 2, -BASE_D / 2); laptop.add(lid);
  const SCREEN_H = 2.7;
  const lidShell = new THREE.Mesh(new THREE.BoxGeometry(BASE_W, SCREEN_H, 0.12), edgeMetal);
  lidShell.position.set(0, SCREEN_H / 2, 0); lid.add(lidShell);

  const sc = document.createElement("canvas"); sc.width = 1024; sc.height = 640;
  const sx = sc.getContext("2d");
  const screenTex = new THREE.CanvasTexture(sc); screenTex.minFilter = THREE.LinearFilter;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(BASE_W * 0.9, SCREEN_H * 0.86),
    new THREE.MeshBasicMaterial({ map: screenTex }));
  screen.position.set(0, SCREEN_H / 2, 0.065); lid.add(screen);
  const glow = new THREE.PointLight(0x8B2CF5, 0, 6); glow.position.set(0, SCREEN_H / 2, 0.6); lid.add(glow);

  const ANG_CLOSED = PI / 2, ANG_OPEN = -0.18;
  lid.rotation.x = ANG_CLOSED;

  /* ---- assembly particle cloud ---- */
  const PCOUNT = 320;
  const pcGeo = new THREE.BufferGeometry();
  const pcPos = new Float32Array(PCOUNT * 3);
  const pcStart = [], pcEnd = [];
  for (let i = 0; i < PCOUNT; i++) {
    const sR = 6 + Math.random() * 4, sa = Math.random() * PI * 2, sb = Math.acos(2 * Math.random() - 1);
    pcStart.push([sR * Math.sin(sb) * Math.cos(sa), sR * Math.sin(sb) * Math.sin(sa), sR * Math.cos(sb)]);
    pcEnd.push([(Math.random() - 0.5) * BASE_W, (Math.random() - 0.2) * 1.6, (Math.random() - 0.5) * BASE_D]);
    pcPos[i * 3] = pcStart[i][0]; pcPos[i * 3 + 1] = pcStart[i][1]; pcPos[i * 3 + 2] = pcStart[i][2];
  }
  pcGeo.setAttribute("position", new THREE.BufferAttribute(pcPos, 3));
  const pcMat = new THREE.PointsMaterial({ color: 0xb98cff, size: 0.09, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending });
  const pcloud = new THREE.Points(pcGeo, pcMat); scene.add(pcloud);

  /* ---- glitter / sparkle field around the laptop (premium shimmer) ---- */
  const SPARK = 170;
  const spGeo = new THREE.BufferGeometry();
  const spPos = new Float32Array(SPARK * 3);
  const spPhase = [];
  for (let i = 0; i < SPARK; i++) {
    spPos[i * 3]     = (Math.random() - 0.5) * 9.5;
    spPos[i * 3 + 1] = (Math.random() - 0.12) * 6.2;
    spPos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 0.5;
    spPhase.push(Math.random() * PI * 2);
  }
  spGeo.setAttribute("position", new THREE.BufferAttribute(spPos, 3));
  const spMat = new THREE.PointsMaterial({ color: 0xc9a0ff, size: 0.07, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  const sparks = new THREE.Points(spGeo, spMat); scene.add(sparks);
  // a second, finer + cooler layer for depth
  const spGeo2 = new THREE.BufferGeometry();
  const spPos2 = new Float32Array(SPARK * 3);
  for (let i = 0; i < SPARK; i++) {
    spPos2[i * 3]     = (Math.random() - 0.5) * 11;
    spPos2[i * 3 + 1] = (Math.random() - 0.1) * 7;
    spPos2[i * 3 + 2] = (Math.random() - 0.5) * 7 - 1;
  }
  spGeo2.setAttribute("position", new THREE.BufferAttribute(spPos2, 3));
  const spMat2 = new THREE.PointsMaterial({ color: 0x8B2CF5, size: 0.045, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  const sparks2 = new THREE.Points(spGeo2, spMat2); scene.add(sparks2);
  let sparkOn = 0;

  const A = { t: 0 };
  laptop.scale.setScalar(0.001);
  laptop.visible = false;

  /* ---- services shown on the screen ---- */
  const SERVICES = [
    { title: "Branding", tag: "Brand Systems", accent: "#CD4800" },
    { title: "SEO", tag: "Rank & Dominate", accent: "#145CFF" },
    { title: "Social Media", tag: "Organic Growth", accent: "#567100" },
    { title: "Web Development", tag: "Built to Convert", accent: "#1f9ad6" },
    { title: "Graphic Design", tag: "Iconic Identity", accent: "#c264ff" },
    { title: "App Development", tag: "iOS & Android", accent: "#CD4800" }
  ];
  let activeSvc = 0, svcProgress = 1, screenOn = 0;

  function roundRect(x, y, w, h, r) { sx.beginPath(); sx.moveTo(x + r, y); sx.arcTo(x + w, y, x + w, y + h, r); sx.arcTo(x + w, y + h, x, y + h, r); sx.arcTo(x, y + h, x, y, r); sx.arcTo(x, y, x + w, y, r); sx.closePath(); }
  function wrap(t, x, y, max, lh) { const words = t.split(" "); let line = "", yy = y; for (const wd of words) { const test = line + wd + " "; if (sx.measureText(test).width > max) { sx.fillText(line, x, yy); line = wd + " "; yy += lh; } else line = test; } sx.fillText(line, x, yy); }

  function drawScreen(time) {
    const w = sc.width, h = sc.height;
    sx.clearRect(0, 0, w, h);
    const bg = sx.createLinearGradient(0, 0, w, h); bg.addColorStop(0, "#160b2e"); bg.addColorStop(1, "#0c0a22");
    sx.fillStyle = bg; sx.fillRect(0, 0, w, h);
    if (screenOn < 0.02) { screenTex.needsUpdate = true; return; }
    sx.globalAlpha = Math.min(1, screenOn);
    sx.strokeStyle = "rgba(150,120,255,0.10)"; sx.lineWidth = 1;
    for (let x = 0; x <= w; x += 48) { sx.beginPath(); sx.moveTo(x, 0); sx.lineTo(x, h); sx.stroke(); }
    for (let y = 0; y <= h; y += 48) { sx.beginPath(); sx.moveTo(0, y); sx.lineTo(w, y); sx.stroke(); }
    // window chrome
    sx.fillStyle = "rgba(255,255,255,0.06)"; roundRect(40, 30, w - 80, 60, 16); sx.fill();
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => { sx.fillStyle = c; sx.beginPath(); sx.arc(78 + i * 34, 60, 9, 0, 7); sx.fill(); });
    sx.fillStyle = "rgba(210,200,255,0.65)"; sx.font = "500 26px Inter, sans-serif"; sx.textAlign = "center";
    sx.fillText("nabulsi.tech / dashboard", w / 2, 69);

    const s = SERVICES[activeSvc], ac = s.accent, ease = Math.min(1, svcProgress), slide = (1 - ease) * 60;
    sx.textAlign = "left";
    sx.fillStyle = ac; sx.globalAlpha = screenOn * ease; roundRect(70, 150 - slide, 18, 52, 6); sx.fill();
    sx.globalAlpha = Math.min(1, screenOn);
    sx.fillStyle = ac; sx.font = '600 30px "Archivo", sans-serif'; sx.fillText(s.tag.toUpperCase(), 110, 168 - slide);
    sx.fillStyle = "#eef0ff"; sx.font = '800 58px "Archivo", sans-serif'; sx.fillText(s.title, 70, 238 - slide);
    sx.fillStyle = "rgba(200,205,235,0.8)"; sx.font = "400 26px Inter, sans-serif";
    wrap("Measurable, compounding growth — designed and engineered by Nabulsi.tech.", 70, 292 - slide, 560, 34);

    // rising metric bars
    const bx = 70, by = h - 70, bw = 66, gap = 30, bn = 8;
    for (let i = 0; i < bn; i++) {
      const phase = time * 1.6 + i * 0.5 + activeSvc, baseH = 0.35 + 0.55 * ((i + 1) / bn);
      const hh = (baseH + 0.18 * Math.sin(phase)) * (h * 0.40) * ease;
      const g = sx.createLinearGradient(0, by, 0, by - hh); g.addColorStop(0, ac + "22"); g.addColorStop(1, ac);
      sx.fillStyle = g; roundRect(bx + i * (bw + gap), by - hh, bw, hh, 8); sx.fill();
    }
    // floating metric pills (right)
    const pills = [["CTR", "+" + (2 + activeSvc) + "." + (activeSvc + 3) + "%"], ["Reach", "x" + (1.6 + activeSvc * 0.3).toFixed(1)], ["ROAS", (3 + activeSvc * 0.4).toFixed(1) + "x"]];
    pills.forEach((p, i) => {
      const px = w - 360, py = 150 + i * 120 + Math.sin(time * 1.4 + i) * 8;
      sx.globalAlpha = screenOn * ease;
      sx.fillStyle = "rgba(255,255,255,0.05)"; roundRect(px, py, 300, 92, 18); sx.fill();
      sx.strokeStyle = ac + "66"; sx.lineWidth = 1.5; roundRect(px, py, 300, 92, 18); sx.stroke();
      sx.fillStyle = "rgba(200,205,235,0.8)"; sx.font = "500 24px Inter, sans-serif"; sx.fillText(p[0], px + 26, py + 38);
      sx.fillStyle = ac; sx.font = '700 40px "Archivo", sans-serif'; sx.fillText(p[1], px + 26, py + 78);
      sx.globalAlpha = Math.min(1, screenOn);
    });
    sx.globalAlpha = 1; screenTex.needsUpdate = true;
  }

  function cycleServices() {
    if (REDUCE || !hasGSAP) return;
    function advance() {
      gsap.fromTo({ p: 0 }, { p: 0 }, {
        p: 1, duration: 0.6, ease: "power2.out",
        onUpdate: function () { svcProgress = this.targets()[0].p; },
        onComplete: function () { gsap.delayedCall(2.6, function () { activeSvc = (activeSvc + 1) % SERVICES.length; svcProgress = 0; advance(); }); }
      });
    }
    advance();
  }

  /* ---- intro ---- */
  let started = false, idle = false;
  function start() {
    if (started) return; started = true;
    laptop.visible = true; laptop.position.x = 0;
    if (REDUCE || !hasGSAP) {
      A.t = 1; laptop.scale.setScalar(FINAL); pcloud.visible = false;
      lid.rotation.x = ANG_OPEN; laptop.rotation.y = -0.3; laptop.rotation.x = 0.04;
      screenOn = 1; glow.intensity = 1.5; activeSvc = 0; svcProgress = 1; sparkOn = 1;
      return;
    }
    const tl = gsap.timeline();
    tl.to(A, { t: 1, duration: 1.6, ease: "power2.inOut", onUpdate: function () { laptop.scale.setScalar(Math.min(FINAL, A.t / 0.7 * FINAL)); } });
    tl.to(pcMat, { opacity: 0, duration: 0.5 }, "-=0.4");
    tl.add(function () { pcloud.visible = false; });
    tl.to(laptop.rotation, { y: laptop.rotation.y + PI * 2, duration: 2.0, ease: "power1.inOut" }, "-=0.2");
    tl.to(lid.rotation, { x: ANG_OPEN, duration: 1.3, ease: "power3.out" }, "-=0.3");
    tl.to({ v: 0 }, { v: 1, duration: 0.6, ease: "power2.out", onUpdate: function () { screenOn = this.targets()[0].v; } }, "-=0.5");
    tl.to(glow, { intensity: 1.6, duration: 0.6 }, "<");
    tl.to({ s: 0 }, { s: 1, duration: 1.4, ease: "power2.out", onUpdate: function () { sparkOn = this.targets()[0].s; } }, "-=1.0");
    tl.add(function () { laptop.rotation.y = 0; idle = true; cycleServices(); });
  }

  if (document.getElementById("loader")) {
    window.addEventListener("loaderComplete", start, { once: true });
    setTimeout(start, 8000); // safety net
  } else {
    window.addEventListener("load", start);
    setTimeout(start, 1200);
  }

  /* ---- pointer parallax ---- */
  let tmx = 0, tmy = 0, mx = 0, my = 0;
  window.addEventListener("pointermove", function (e) {
    tmx = (e.clientX / window.innerWidth - 0.5);
    tmy = (e.clientY / window.innerHeight - 0.5);
  });

  const clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    const t = clock.getElapsedTime();

    if (pcloud.visible) {
      const arr = pcGeo.attributes.position.array;
      const e = A.t < 0 ? 0 : A.t > 1 ? 1 : A.t, ee = e * e * (3 - 2 * e);
      for (let i = 0; i < PCOUNT; i++) {
        arr[i * 3] = pcStart[i][0] + (pcEnd[i][0] - pcStart[i][0]) * ee;
        arr[i * 3 + 1] = pcStart[i][1] + (pcEnd[i][1] - pcStart[i][1]) * ee;
        arr[i * 3 + 2] = pcStart[i][2] + (pcEnd[i][2] - pcStart[i][2]) * ee;
      }
      pcGeo.attributes.position.needsUpdate = true;
      pcloud.rotation.y = t * 0.4;
    }

    if (laptop.visible) {
      laptop.position.y = Math.sin(t * 0.8) * 0.08;
      if (idle) {
        mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
        // continuous gentle sway + pointer parallax = always alive and cool
        const swayY = -0.28 + Math.sin(t * 0.45) * 0.22 + mx * 0.3;
        const swayX = 0.05 + Math.sin(t * 0.6) * 0.04 + my * 0.16;
        laptop.rotation.y += (swayY - laptop.rotation.y) * 0.05;
        laptop.rotation.x += (swayX - laptop.rotation.x) * 0.05;
        laptop.position.x = Math.sin(t * 0.35) * 0.12;
      }
    }

    // glitter shimmer: gentle drift, slow counter-rotation, twinkling opacity
    if (sparkOn > 0) {
      const a1 = spGeo.attributes.position.array;
      for (let i = 0; i < SPARK; i++) {
        a1[i * 3 + 1] += Math.sin(t * 1.4 + spPhase[i]) * 0.0016;
      }
      spGeo.attributes.position.needsUpdate = true;
      sparks.rotation.y = t * 0.06;
      sparks2.rotation.y = -t * 0.04;
      spMat.opacity = sparkOn * (0.55 + 0.45 * Math.sin(t * 2.0));
      spMat2.opacity = sparkOn * (0.4 + 0.35 * Math.sin(t * 1.5 + 1.2));
    }

    drawScreen(t);
    camera.lookAt(0, 0.65, 0);
    renderer.render(scene, camera);
  }

  function resize() {
    const s = size();
    camera.aspect = s.w / s.h; camera.updateProjectionMatrix();
    renderer.setSize(s.w, s.h, false);
  }
  window.addEventListener("resize", resize);
  resize(); frame();
})();
