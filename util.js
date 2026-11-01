/* Shared helpers: DOM, storage, color math, pixel-icon set, toasts, lightbox */
(function () {
  const F = (window.FARM = window.FARM || {});

  F.$ = (s, r = document) => r.querySelector(s);
  F.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  F.esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  F.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  F.lerp = (a, b, t) => a + (b - a) * t;
  F.reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Build DOM from an HTML string */
  F.html = function (str) {
    const t = document.createElement("template");
    t.innerHTML = str.trim();
    return t.content.firstElementChild;
  };

  /* localStorage, safely (private windows / blocked storage just fall back) */
  const PREFIX = "pfarm:";
  F.store = {
    get(k, d) {
      try {
        const v = localStorage.getItem(PREFIX + k);
        return v == null ? d : JSON.parse(v);
      } catch (e) { return d; }
    },
    set(k, v) {
      try { localStorage.setItem(PREFIX + k, JSON.stringify(v)); } catch (e) { /* ignore */ }
    }
  };

  /* Deterministic random (so the farm looks the same every visit) */
  F.rng = function (seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  F.hex2rgb = (h) => { h = h.replace("#", ""); if (h.length === 3) h = h.split("").map((c) => c + c).join(""); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  F.rgb2hex = (r, g, b) => "#" + [r, g, b].map((v) => Math.round(F.clamp(v, 0, 255)).toString(16).padStart(2, "0")).join("");
  F.mix = (a, b, t) => { const A = F.hex2rgb(a), B = F.hex2rgb(b); return F.rgb2hex(F.lerp(A[0], B[0], t), F.lerp(A[1], B[1], t), F.lerp(A[2], B[2], t)); };
  F.shade = (c, amt) => (amt < 0 ? F.mix(c, "#000000", -amt) : F.mix(c, "#ffffff", amt));

  /* ------------------------------------------------------------------
     PIXEL ICONS: 16×16 character maps → crisp inline SVG
     ------------------------------------------------------------------ */
  F.PAL = {
    k: "#3b2414", w: "#fff7e6", v: "#ffffff", b: "#9c6b3c", B: "#6e4423", l: "#c99459",
    r: "#d2493b", R: "#8f2f27", g: "#5aa83a", G: "#3c7a2a", y: "#f2c14e", Y: "#c98d1e",
    o: "#e07b28", O: "#b85a2a", u: "#4f86c6", U: "#2f5a8f", c: "#a9dcef", s: "#9aa3ad",
    S: "#5f6670", p: "#f09ab0", P: "#8a5cc0", n: "#2b3a67", m: "#e8b48f", t: "#49b6a8"
  };

  const I = {};
  I.house = ["................", ".......kk.......", "......krrk......", ".....krRrrk.....", "....krrrrRrk....", "...krRrrrrrrk...", "..krrrrrRrrrrk..", ".kkkkkkkkkkkkkk.", "..kllllllllllk..", "..klkkkllllllk..", "..klkcklkkkklk..", "..klkkklkBBklk..", "..klkcklkByklk..", "..klkkklkBBklk..", "..klllllkBBklk..", "..kkkkkkkkkkkk.."];
  I.barn = ["................", "......kkkk......", "....kkRRRRkk....", "...kRRRRRRRRk...", "..kRRRwwwwRRRk..", ".kRRRRwyywRRRRk.", ".kRRRRwwwwRRRRk.", "kkkkkkkkkkkkkkkk", ".krrrrrrrrrrrrk.", ".krwwwwwwwwwwrk.", ".krwkrrrrrrkwrk.", ".krwrkrrrrkrwrk.", ".krwrrkrrkrrwrk.", ".krwrkrrrrkrwrk.", ".krwkrrrrrrkwrk.", ".kkkkkkkkkkkkkk."];
  I.cart = ["................", "................", "................", "....yyy.oo......", "...yyyyyooo.....", ".kkkkkkkkkkkk...", ".kllllllllllk...", ".kbbbbbbbbbbkkkk", ".kllllllllllk...", ".kkkkkkkkkkkk...", "..kkk.....kkk...", ".kSsSk...kSsSk..", ".ksksk...ksksk..", ".kSsSk...kSsSk..", "..kkk.....kkk...", "................"];
  I.telescope = ["...........y....", "..........yyy...", "...........y....", ".........kkk....", "........kyyyk...", ".......kyyYk....", "......kyyYk.....", ".....kyyYk......", "....ksyYk.......", "....kssk........", ".....kk.........", ".....kk.........", "....k.k.k.......", "...k..k..k......", "..k...k...k.....", "................"];
  I.ribbon = ["................", ".....kkkkkk.....", "....kuuuuuuk....", "...kuUuuuuUuk...", "..kuuuyyyyuuuk..", "..kuuyyyyyyuuk..", "..kuuyyyyyyuuk..", "..kuuuyyyyuuuk..", "...kuUuuuuUuk...", "....kuuuuuuk....", ".....kuuuuk.....", "....kuuk.kuuk...", "...kuuk...kuuk..", "...kuk.....kuk..", "...kk.......kk..", "................"];
  I.flower = ["................", ".....kkkkk......", "....kpppppk.....", "....kppyppk.....", "....kpyyypk.....", "....kppyppk.....", ".....kpppk......", "...kk..kg..kk...", "..kggk.kg.kggk..", "...kggkkgkggk...", "....kkkgkkkk....", "...kkkkkkkkkk...", "...kooooooook...", "....kooooook....", "....kOooooOk....", ".....kkkkkk....."];
  I.doc = ["................", "......kk........", ".....krrk.......", "..kkkkrrkkkkk...", "..kwwwwkkwwwwk..", "..kwwwwwwwwwwk..", "..kwsssssssswk..", "..kwwwwwwwwwwk..", "..kwssssssswwk..", "..kwwwwwwwwwwk..", "..kwsssssswwwk..", "..kwwwwwwwwwwk..", "..kwssssssswwk..", "..kwwwwwwwwwwk..", "..kkkkkkkkkkkk..", "................"];
  I.mailbox = ["................", "...........kk...", "....kkkkkkkrrk..", "...kuuuuuuukrk..", "..kuuuuuuuuukk..", "..kuUUUUUUUuk...", "..kukkkkkkkuk...", "..kukwwwwwkuk...", "..kuUUUUUUUuk...", "..kkkkkkkkkkk...", "......kbk.......", "......kbk.......", "......kbk.......", "......kbk.......", "....kkkkkkk.....", "....kgggggk....."];
  I.acorn = ["................", ".......kk.......", "......kBk.......", "....kkkkkkk.....", "...kBbBbBbBk....", "..kbBbBbBbBbk...", "..kkkkkkkkkkk...", "...kyyyyyyyk....", "...kyywyyyYk....", "...kywyyyyYk....", "...kyyyyyyYk....", "....kyyyyYk.....", ".....kyyYk......", "......kYk.......", ".......k........", "................"];
  I.soundOn = ["................", "................", "......k.........", ".....kk...k.....", "....kwk....k....", "kkkkwwk..k..k...", "kwwwwwk...k.k...", "kwwwwwk...k..k..", "kwwwwwk...k..k..", "kwwwwwk...k.k...", "kkkkwwk..k..k...", "....kwk....k....", ".....kk...k.....", "......k.........", "................", "................"];
  I.soundOff = ["................", "................", "......k.........", ".....kk.........", "....kwk.........", "kkkkwwk.r...r...", "kwwwwwk..r.r....", "kwwwwwk...r.....", "kwwwwwk..r.r....", "kwwwwwk.r...r...", "kkkkwwk.........", "....kwk.........", ".....kk.........", "......k.........", "................", "................"];
  I.menu = ["................", "................", "..kkkkkkkkkkkk..", "..kwwwwwwwwwwk..", "..kkkkkkkkkkkk..", "................", "................", "..kkkkkkkkkkkk..", "..kwwwwwwwwwwk..", "..kkkkkkkkkkkk..", "................", "................", "..kkkkkkkkkkkk..", "..kwwwwwwwwwwk..", "..kkkkkkkkkkkk..", "................"];
  I.close = ["................", "................", "..kk........kk..", "..kwk......kwk..", "...kwk....kwk...", "....kwk..kwk....", ".....kwkkwk.....", "......kwwk......", "......kwwk......", ".....kwkkwk.....", "....kwk..kwk....", "...kwk....kwk...", "..kwk......kwk..", "..kk........kk..", "................", "................"];
  I.book = ["................", "................", "..kkk......kkk..", ".kwwwkk..kkwwwk.", ".kwsswwkkwwsswk.", ".kwwwwwwkwwwwwk.", ".kwssswwkwssswk.", ".kwwwwwwkwwwwwk.", ".kwsswwwkwwsswk.", ".kwwwwwwkwwwwwk.", ".kwssswwkwssswk.", ".kwwwkkkkkkkwwk.", ".kkkk......kkkk.", "................", "................", "................"];
  I.star = ["................", ".......kk.......", "......kyyk......", "......kyyk......", ".....kyyyyk.....", "kkkkkkyyyykkkkkk", "kyyyyyyyyyyyyyyk", ".kyyyyyywyyyyyk.", "..kyyyyyyyyyyk..", "...kyyyyyyyyk...", "...kyyyyyyyyk...", "..kyyyykkyyyyk..", "..kyyyk..kyyyk..", ".kyyyk....kyyyk.", ".kkkk......kkkk.", "................"];
  I.sun = ["................", ".......YY.......", "..Y....YY....Y..", "...Y........Y...", "......YYYY......", ".....YyyyyY.....", "....YyyyyyyY....", "YY..YyyyyyyY..YY", "YY..YyyyyyyY..YY", "....YyyyyyyY....", ".....YyyyyY.....", "......YYYY......", "...Y........Y...", "..Y....YY....Y..", ".......YY.......", "................"];
  I.moon = ["................", "......kkkk......", "....kkyyyk......", "...kyyyyk.......", "..kyyyyk........", "..kyyyk.........", ".kyyyyk.........", ".kyyyyk.........", ".kyyyyk.........", ".kyyyyyk........", "..kyyyyyk....kk.", "..kyyyyyykkkkyk.", "...kyyyyyyyyyk..", "....kkyyyyykk...", "......kkkkk.....", "................"];
  I.leaf = ["................", "..........kkkk..", "........kkooook.", "......kkoooooOk.", ".....koooooOook.", "....koooooOoook.", "...kooooOooook..", "...koooOoooook..", "..koooOoooook...", "..kooOoooook....", "..koOooookk.....", "..kOookkk.......", ".kOkkk..........", "kO..............", "k...............", "................"];
  I.snow = ["................", ".......u........", ".....u.u.u......", "......uuu.......", "..u....u....u...", "...u...u...u....", "....u..u..u.....", ".uuuuuuuuuuuuu..", "....u..u..u.....", "...u...u...u....", "..u....u....u...", "......uuu.......", ".....u.u.u......", ".......u........", "................", "................"];
  I.blossom = ["................", "......kkkk......", ".....kppppk.....", "..kkkkppppkkkk..", ".kppppkppkppppk.", ".kpppppkkpppppk.", ".kppppkyykppppk.", "..kkppkyykppkk..", "..kppppkkppppk..", ".kppppkppkppppk.", ".kpppkkppkkpppk.", "..kkk.kppk.kkk..", "......kkkk......", "................", "................", "................"];
  I.download = ["................", "......kkkk......", "......kgGk......", "......kgGk......", "......kgGk......", "...kkkkgGkkkk...", "...kgggggGGGk...", "....kgggGGGk....", ".....kggGGk.....", "......kgGk......", ".......kk.......", "................", "..kk........kk..", "..kbbbbbbbbbbk..", "..kkkkkkkkkkkk..", "................"];
  I.arrow = ["................", "................", "........kk......", "........kwk.....", "........kwwk....", "..kkkkkkkwwwk...", "..kwwwwwwwwwwk..", "..kwwwwwwwwwwwk.", "..kwwwwwwwwwwk..", "..kkkkkkkwwwk...", "........kwwk....", "........kwk.....", "........kk......", "................", "................", "................"];
  I.envelope = ["................", "................", "................", ".kkkkkkkkkkkkkk.", ".kwkwwwwwwwwkwk.", ".kwwkwwwwwwkwwk.", ".kwwwkwwwwkwwwk.", ".kwwwwkwwkwwwwk.", ".kwwwwwkkwwwwwk.", ".kwwwwwwwwwwwwk.", ".kwwwwwwwwwwwwk.", ".kwwwwwwwwwwwwk.", ".kkkkkkkkkkkkkk.", "................", "................", "................"];
  I.linkedin = ["................", "..UUUUUUUUUUUU..", ".UuuuuuuuuuuuuU.", ".UuwwuuuuuuuuuU.", ".UuwwuuuuuuuuuU.", ".UuuuuuuuuuuuuU.", ".UuwwuwwuwwwuuU.", ".UuwwuwwwwwwwuU.", ".UuwwuwwwuuwwuU.", ".UuwwuwwuuuwwuU.", ".UuwwuwwuuuwwuU.", ".UuwwuwwuuuwwuU.", ".UuuuuuuuuuuuuU.", "..UUUUUUUUUUUU..", "................", "................"];
  I.camera = ["................", "................", ".kkkkkkkkkkkkkk.", ".kppppppppppwpk.", ".kppppkkkkppppk.", ".kpppkwwwwkpppk.", ".kppkwwkkwwkppk.", ".kppkwkPPkwkppk.", ".kppkwkPPkwkppk.", ".kppkwwkkwwkppk.", ".kpppkwwwwkpppk.", ".kppppkkkkppppk.", ".kppppppppppppk.", ".kkkkkkkkkkkkkk.", "................", "................"];
  I.cup = ["................", "....s..s..s.....", ".....s..s..s....", "....s..s..s.....", "................", "..kkkkkkkkkkk...", "..kwwwwwwwwwkkk.", "..kBBBBBBBBBk.k.", "..kwwwwwwwwwk.k.", "..kwwwwwwwwwkkk.", "..kwwwwwwwwwk...", "...kwwwwwwwk....", "....kkkkkkk.....", ".kkkkkkkkkkkkk..", "................", "................"];
  I.cap = ["................", "................", ".......kk.......", ".....kknnkk.....", "...kknnnnnnkk...", ".kknnnnnnnnnnkk.", "...kknnnnnnkkyk.", "....kknnnnkk.yk.", "....knnnnnnk..y.", "....knnnnnnk.yyy", ".....kkkkkk.....", "................", "................", "................", "................", "................"];
  I.calendar = ["................", "...k......k.....", "..kkkkkkkkkkkk..", "..krrrrrrrrrrk..", "..kkkkkkkkkkkk..", "..kwwwwwwwwwwk..", "..kwkwkwkwkwwk..", "..kwwwwwwwwwwk..", "..kwkwkwkwkwwk..", "..kwwwwwwwwwwk..", "..kwkwkwrwkwwk..", "..kwwwwwwwwwwk..", "..kkkkkkkkkkkk..", "................", "................", "................"];
  I.wrench = ["................", "..........kkk...", ".........kssk...", "........ksSk.kk.", "........ksk.kssk", ".......ksskksSk.", "......ksssssSk..", ".....kssSSSkk...", "....kssSkkk.....", "...kssSk........", "..kssSk.........", ".kssSk..........", "kssSk...........", "kSSk............", ".kk.............", "................"];
  I.gear = ["................", "................", "..k.............", "..kSk....k....k.", "..kSk....k....k.", "..kSk...kk...kk.", "..kSk..ksk..ksk.", "..kSk.kssk.kssk.", ".kkkkkkkkkkkkkk.", ".kssssssssssssk.", ".ksccsccsccsssk.", ".kssssssssssssk.", ".ksccsccssBBssk.", ".kssssssssBBssk.", ".kkkkkkkkkkkkkk.", "................"];
  I.mountain = ["................", "................", ".......k........", "......kwk.......", ".....kwwwk......", "....kwwwssk.....", "...kwwsssssk.k..", "...ksssssssskwk.", "..kssssSssssssk.", ".ksssSsssssSsssk", "kssssssSsssssssk", "kgggggggggggggGk", "kkkkkkkkkkkkkkkk", "................", "................", "................"];
  I.heart = ["................", "................", "..kkkk..kkkk....", ".krrrrkkrrrrk...", "krrwrrrrrrrrrk..", "krwrrrrrrrrrrk..", "krrrrrrrrrrrrk..", ".krrrrrrrrrrk...", "..krrrrrrrrk....", "...krrrrrrk.....", "....krrrrk......", ".....krrk.......", "......kk........", "................", "................", "................"];
  I.check = ["................", "................", "................", "................", "............kk..", "...........kgk..", "..........kgk...", "..kk.....kgk....", "..kgk...kgk.....", "...kgk.kgk......", "....kgkgk.......", ".....kgk........", "......k.........", "................", "................", "................"];
  I.music = ["................", ".....kkkkkkkk...", ".....kUUUUUUk...", ".....kUkkkkUk...", ".....kUk..kUk...", ".....kUk..kUk...", ".....kUk..kUk...", ".....kUk..kUk...", "...kkkUk.kkkUk..", "..kUUUUkkUUUUk..", "..kUUUUkkUUUUk..", "...kkkk..kkkk...", "................", "................", "................", "................"];
  I.sparkle = ["................", ".......y........", ".......y........", "......yYy.......", "......yYy.......", ".yyyyyYwYyyyyy..", "......yYy.......", "......yYy.......", ".......y........", ".......y........", "................", "................", "................", "................", "................", "................"];
  I.pigeon = ["................", "................", "..........kk....", ".........kssk...", "........kssko...", ".kkk...ksssk....", "kssskkksssk.....", ".kssssssssk.....", "..kssSSSssk.....", "...kssssssk.....", "....kkkkkk......", ".....o..o.......", "................", "................", "................", "................"];
  F.ICONS = I;

  const iconCache = {};
  F.icon = function (name, size = 16, cls = "") {
    const key = name + "|" + size + "|" + cls;
    if (iconCache[key]) return iconCache[key];
    let map = I[name];
    let flip = false;
    if (!map && name === "arrowLeft") { map = I.arrow; flip = true; }
    if (!map) return "";
    let rects = "";
    for (let y = 0; y < 16; y++) {
      const row = map[y] || "";
      let x = 0;
      while (x < 16) {
        const ch = row[x];
        if (!ch || ch === ".") { x++; continue; }
        let x2 = x;
        while (x2 + 1 < 16 && row[x2 + 1] === ch) x2++;
        const w = x2 - x + 1;
        const rx = flip ? 16 - x - w : x;
        rects += `<rect x="${rx}" y="${y}" width="${w}" height="1" fill="${F.PAL[ch] || "#000"}"/>`;
        x = x2 + 1;
      }
    }
    const svg = `<svg class="pxi ${cls}" viewBox="0 0 16 16" width="${size}" height="${size}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${rects}</svg>`;
    iconCache[key] = svg;
    return svg;
  };

  /* ------------------------------------------------------------------
     Toasts
     ------------------------------------------------------------------ */
  F.toast = function (html, opts = {}) {
    let box = F.$("#toasts");
    if (!box) { box = document.createElement("div"); box.id = "toasts"; document.body.appendChild(box); }
    const el = F.html(`<div class="toast ${opts.cls || ""}" role="status">${opts.icon ? F.icon(opts.icon, 24) : ""}<span>${html}</span></div>`);
    box.appendChild(el);
    requestAnimationFrame(() => el.classList.add("in"));
    setTimeout(() => { el.classList.remove("in"); setTimeout(() => el.remove(), 400); }, opts.ms || 3200);
  };

  /* ------------------------------------------------------------------
     Lightbox (images with captions, arrow navigation)
     ------------------------------------------------------------------ */
  const LB = { list: [], i: 0, el: null };
  function lbRender() {
    const it = LB.list[LB.i];
    if (!it) return;
    const img = LB.el.querySelector("img");
    img.src = it[0];
    img.alt = it[1] || "";
    LB.el.querySelector(".lb-cap").textContent = it[1] || "";
    LB.el.querySelector(".lb-count").textContent = LB.list.length > 1 ? `${LB.i + 1} / ${LB.list.length}` : "";
    LB.el.querySelector(".lb-open").href = it[0];
    LB.el.classList.toggle("single", LB.list.length < 2);
  }
  function lbKey(e) {
    if (!LB.el || LB.el.hidden) return;
    if (e.key === "Escape") { e.stopPropagation(); F.lightbox.close(); }
    else if (e.key === "ArrowRight") F.lightbox.step(1);
    else if (e.key === "ArrowLeft") F.lightbox.step(-1);
  }
  F.lightbox = {
    open(list, i = 0) {
      if (!LB.el) {
        LB.el = F.html(`<div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" hidden>
          <div class="lb-frame"><img alt=""><div class="lb-bar"><span class="lb-cap"></span><span class="lb-count"></span><a class="lb-open" target="_blank" rel="noopener">Open full size ${F.icon("arrow", 14)}</a></div></div>
          <button class="lb-btn lb-prev" aria-label="Previous image">${F.icon("arrowLeft", 28)}</button>
          <button class="lb-btn lb-next" aria-label="Next image">${F.icon("arrow", 28)}</button>
          <button class="lb-btn lb-close" aria-label="Close image viewer">${F.icon("close", 28)}</button>
        </div>`);
        document.body.appendChild(LB.el);
        LB.el.addEventListener("click", (e) => { if (e.target === LB.el) F.lightbox.close(); });
        LB.el.querySelector(".lb-prev").onclick = () => F.lightbox.step(-1);
        LB.el.querySelector(".lb-next").onclick = () => F.lightbox.step(1);
        LB.el.querySelector(".lb-close").onclick = () => F.lightbox.close();
        document.addEventListener("keydown", lbKey, true);
      }
      LB.list = list; LB.i = i;
      lbRender();
      LB.el.hidden = false;
      F.audio && F.audio.play("open");
      LB.el.querySelector(".lb-close").focus({ preventScroll: true });
    },
    step(d) { LB.i = (LB.i + d + LB.list.length) % LB.list.length; lbRender(); F.audio && F.audio.play("click"); },
    close() { if (LB.el) { LB.el.hidden = true; F.audio && F.audio.play("close"); } },
    isOpen() { return LB.el && !LB.el.hidden; }
  };

  /* Wire any element with data-lb="src|caption" inside a container to the lightbox, grouped */
  F.bindGallery = function (root) {
    const items = F.$$("[data-lb]", root);
    const list = items.map((el) => el.getAttribute("data-lb").split("|"));
    items.forEach((el, i) => {
      el.addEventListener("click", (e) => { e.preventDefault(); F.lightbox.open(list, i); });
    });
  };

  F.mailto = function (subject, body, to) {
    const p = F.data.person;
    return `mailto:${to || p.email}?subject=${encodeURIComponent(subject || "")}${body ? "&body=" + encodeURIComponent(body) : ""}`;
  };
})();
