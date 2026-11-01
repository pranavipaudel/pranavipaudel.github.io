/* =====================================================================
   EXPERIENCE — "The Road": drive the cart through the seasons and stop
   at every job and lab, oldest to newest.
   ===================================================================== */
(function () {
  const F = window.FARM, A = F.art;
  const MONTH_PX = 64;
  const RS = {
    spring: { sky: ["#8fd3f5", "#e3f6ff"], far: "#a7c7d6", hill: "#7cc45a", hillD: "#61aa45", grass: "#86cf5e", grassD: "#61aa45", road: "#cf9f62", roadD: "#ad7f47", leaves: A.SEASONS.spring },
    summer: { sky: ["#64c0f0", "#cdeefa"], far: "#94bccc", hill: "#5fb246", hillD: "#479439", grass: "#6cc04f", grassD: "#4a983b", road: "#d1a265", roadD: "#ad7f47", leaves: A.SEASONS.summer },
    fall: { sky: ["#86c3ea", "#f8d9aa"], far: "#b7aec0", hill: "#c2a94e", hillD: "#9e8a3a", grass: "#c3b257", grassD: "#9e8f3e", road: "#c9985c", roadD: "#a57843", leaves: A.SEASONS.fall },
    winter: { sky: ["#a3c9e3", "#eef5fb"], far: "#d2deea", hill: "#eef4f8", hillD: "#cddbe6", grass: "#f4f8fb", grassD: "#d3dfe9", road: "#cbbcab", roadD: "#ad9d8b", leaves: A.SEASONS.winter }
  };
  const seasonOfMonth = (m) => (m >= 2 && m <= 4 ? "spring" : m >= 5 && m <= 7 ? "summer" : m >= 8 && m <= 10 ? "fall" : "winter");
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const toIdx = (s) => { const [y, m] = s.split("-").map(Number); return y * 12 + (m - 1); };

  /* ---------- buildings for the stops ---------- */
  const bcache = {};
  function building(kind) {
    if (bcache[kind]) return bcache[kind];
    const R = A.R, O = "#3b2414";
    let cv, c;
    if (kind === "lab") {
      [cv, c] = A.mk(58, 46);
      R(c, 3, 14, 52, 32, O); R(c, 4, 15, 50, 31, "#b5654b");
      for (let y = 17; y < 46; y += 4) { R(c, 4, y, 50, 1, "#94503a"); for (let x = 4 + ((y >> 2) % 2) * 4; x < 54; x += 8) R(c, x, y - 3, 1, 3, "#94503a"); }
      R(c, 0, 9, 58, 6, O); R(c, 1, 10, 56, 4, "#5f6670");
      [[9, 20], [41, 20]].forEach(([x, y]) => { R(c, x, y, 10, 10, O); R(c, x + 1, y + 1, 8, 8, "#9ad9f7"); R(c, x + 1, y + 1, 8, 2, "#c9eefc"); R(c, x + 5, y + 1, 1, 8, O); });
      R(c, 23, 26, 12, 20, O); R(c, 24, 27, 10, 19, "#2f5a8f"); R(c, 32, 36, 1, 2, "#f2c14e");
      R(c, 22, 0, 14, 10, O); R(c, 23, 1, 12, 8, "#fff7e6"); R(c, 28, 2, 2, 3, "#5aa83a"); R(c, 26, 5, 6, 3, "#5aa83a");
    } else if (kind === "hall") {
      [cv, c] = A.mk(64, 48);
      for (let y = 0; y < 13; y++) { const w = Math.round(31 * (y / 12)); R(c, 32 - w, y + 1, w * 2, 1, y === 12 ? O : "#ece2c8"); R(c, 32 - w - 1, y + 1, 1, 1, O); R(c, 32 + w, y + 1, 1, 1, O); }
      R(c, 1, 13, 62, 4, O); R(c, 2, 14, 60, 2, "#f6efdc");
      R(c, 3, 17, 58, 27, O); R(c, 4, 18, 56, 26, "#d9cdb0");
      for (let x = 7; x < 60; x += 10) { R(c, x, 18, 5, 26, "#f6efdc"); R(c, x + 4, 18, 1, 26, "#bfb193"); }
      R(c, 26, 28, 12, 16, O); R(c, 27, 29, 10, 15, "#7a2a2a");
      R(c, 0, 44, 64, 4, O); R(c, 1, 44, 62, 3, "#a39b88");
      A.disc(c, 32, 8, 3, "#8f2f27");
    } else if (kind === "hospital") {
      [cv, c] = A.mk(58, 50);
      R(c, 3, 8, 52, 42, O); R(c, 4, 9, 50, 41, "#f4f6f8"); R(c, 4, 9, 50, 3, "#dfe5ea");
      R(c, 0, 4, 58, 5, O); R(c, 1, 5, 56, 3, "#4f86c6");
      for (let r = 0; r < 2; r++) for (let x = 8; x < 52; x += 11) if (!(r === 1 && x > 18 && x < 36)) { R(c, x, 16 + r * 13, 8, 8, O); R(c, x + 1, 17 + r * 13, 6, 6, "#9ad9f7"); }
      R(c, 22, 32, 14, 18, O); R(c, 23, 33, 12, 17, "#9ad9f7"); R(c, 28, 33, 1, 17, O);
      R(c, 24, 0, 10, 10, "#fff"); R(c, 27, 1, 4, 8, "#d24a3c"); R(c, 25, 3, 8, 4, "#d24a3c");
    } else if (kind === "factory") {
      [cv, c] = A.mk(70, 50);
      R(c, 52, 0, 8, 26, O); R(c, 53, 1, 6, 25, "#9b4a3a"); R(c, 53, 4, 6, 2, "#f1ead8");
      for (let i = 0; i < 4; i++) { for (let y = 0; y < 12; y++) { R(c, 2 + i * 14, 12 + y, Math.round(14 * (y / 11)) + 1, 1, y < 2 ? O : "#7d8794"); } R(c, 2 + i * 14 + 13, 12, 2, 12, O); R(c, 3 + i * 14 + 11, 13, 2, 11, "#9ad9f7"); }
      R(c, 1, 23, 66, 27, O); R(c, 2, 24, 64, 26, "#a7b0ba");
      for (let x = 6; x < 64; x += 6) R(c, x, 24, 1, 26, "#8d96a1");
      R(c, 8, 30, 16, 20, O); R(c, 9, 31, 14, 19, "#5f6670"); for (let y = 33; y < 50; y += 3) R(c, 9, y, 14, 1, "#4d535c");
      R(c, 30, 30, 30, 9, O); R(c, 31, 31, 28, 7, "#f4f6f8"); R(c, 33, 33, 24, 3, "#3b4a5a");
      R(c, 36, 41, 10, 9, O); R(c, 37, 42, 8, 8, "#2f5a8f");
    } else {
      [cv, c] = A.mk(40, 50);
      R(c, 18, 18, 4, 32, O); R(c, 19, 18, 2, 32, "#8a5a2b");
      R(c, 2, 14, 36, 20, O); R(c, 3, 15, 34, 18, "#c99459");
      for (let y = 19; y < 33; y += 5) R(c, 3, y, 34, 1, "#a8763f");
      R(c, 16, 18, 8, 2, O); R(c, 22, 20, 2, 4, O); R(c, 18, 24, 4, 2, O); R(c, 18, 28, 4, 2, O);
      const ac = A.acorn().cv; c.drawImage(ac, 15, 2);
    }
    bcache[kind] = cv;
    return cv;
  }

  /* ---------- the scene ---------- */
  F.road = {};
  F.road.mount = function (body, ctxp, sub) {
    const d = F.data;
    const exps = d.experience.slice().sort((a, b) => toIdx(a.start) - toIdx(b.start));
    const first = toIdx(exps[0].start) - 2;
    const last = toIdx(exps[exps.length - 1].start) + 3;
    const LEN = (last - first + 3) * MONTH_PX;
    const stops = exps.map((e) => ({ e, x: (toIdx(e.start) - first) * MONTH_PX + 24 }));
    stops.push({ e: { id: "__next", short: "Your team?", building: "next" }, x: (last - first) * MONTH_PX + 24 });

    body.innerHTML = `<div class="road-wrap">
      <div class="road-stage" aria-label="A cart driving down a road through the seasons"><canvas></canvas><div class="road-tags"></div></div>
      <div class="road-bar">
        <button class="btn sm paper" data-a="first" aria-label="Back to the start">${F.icon("arrowLeft", 16)}${F.icon("arrowLeft", 16)}</button>
        <button class="btn sm paper" data-a="prev">${F.icon("arrowLeft", 16)} Prev</button>
        <div class="road-dots" aria-hidden="true"></div>
        <button class="btn sm green" data-a="next">Next stop ${F.icon("arrow", 16)}</button>
        <button class="btn sm wood" data-a="list">${F.icon("doc", 16)} List</button>
      </div>
      <div class="road-card-wrap" aria-live="polite"></div>
      <div class="timeline-list"></div>
    </div>`;
    const wrap = F.$(".road-wrap", body), stage = F.$(".road-stage", body), cv = F.$("canvas", stage), c = cv.getContext("2d");
    const tagsEl = F.$(".road-tags", body), dotsEl = F.$(".road-dots", body), cardEl = F.$(".road-card-wrap", body), listEl = F.$(".timeline-list", body);

    // list view
    listEl.innerHTML = `<p class="lead">My journey so far, newest first.</p>` + exps.slice().reverse().map((e) => `<div class="tl-item"><img src="${F.esc(e.logo)}" alt=""><div><div class="kicker">${F.esc(e.dates)}${e.location ? " · " + F.esc(e.location) : ""}</div><h4 style="font-size:20px;margin:0">${F.esc(e.role)}</h4><div style="font-weight:700;color:var(--ink-2)">${F.esc(e.org)}</div><ul style="margin-top:8px">${e.bullets.map((b) => `<li>${F.esc(b)}</li>`).join("")}</ul></div></div>`).join("") + `<div class="row" style="margin-top:16px"><button class="btn sm green" data-a="list">${F.icon("cart", 16)} Back to the road</button></div>`;

    // tags
    stops.forEach((s, i) => {
      const t = F.html(`<button class="road-tag" data-i="${i}">${s.e.logo ? `<span class="rt-board"><img src="${F.esc(s.e.logo)}" alt=""></span>` : ""}<span class="rt-name">${F.esc(s.e.short)}</span></button>`);
      t.onclick = () => driveTo(i);
      tagsEl.appendChild(t); s.tag = t;
    });
    const years = [];
    for (let m = first; m <= last + 2; m++) if (m % 12 === 0) { const t = F.html(`<span class="year-tag">${m / 12}</span>`); tagsEl.appendChild(t); years.push({ x: (m - first) * MONTH_PX + 4, el: t }); }
    // dots
    stops.forEach((s, i) => { const b = F.html(`<button class="rd" style="left:${(s.x / LEN) * 100}%" aria-label="${F.esc(s.e.short)}"></button>`); b.onclick = () => driveTo(i); dotsEl.appendChild(b); s.dot = b; });
    const cartDot = F.html(`<span class="rd-cart">${F.icon("cart", 22)}</span>`); dotsEl.appendChild(cartDot);

    // state
    let s = 2, vw = 0, LH = 0, groundTop = 0, roadY = 0, camX = 0;
    const cart = { x: -10, v: 0, target: null, wheel: 0, dist: 0, hoofAcc: 0 };
    let curIdx = -2, running = true, lastT = performance.now(), t = 0;
    const delivered = new Set(F.store.get("delivered", []));
    const flying = [];
    const keys = new Set();
    const particles = [];
    const treeCache = {};
    const ponyFr = A.pony();
    const rnd = F.rng(9);
    const trees = []; for (let x = 10; x < LEN * 0.75 + 600; x += 26 + ((rnd() * 22) | 0)) trees.push({ x, v: (rnd() * 3) | 0, pine: rnd() < 0.25 });
    const clouds = Array.from({ length: 8 }, (_, i) => ({ x: i * 90 + rnd() * 50, y: 6 + rnd() * 26, w: 18 + rnd() * 20 }));

    function seasonAt(wx) {
      const mf = first + wx / MONTH_PX, m = Math.floor(mf), fr = mf - m;
      const a = seasonOfMonth(((m % 12) + 12) % 12), b = seasonOfMonth((((m + 1) % 12) + 12) % 12);
      return { a, b, t: a === b ? 0 : Math.max(0, (fr - 0.5) * 2) };
    }
    const colAt = (wx, key) => { const q = seasonAt(wx); return q.t ? F.mix(RS[q.a][key], RS[q.b][key], q.t) : RS[q.a][key]; };
    const domSeason = (wx) => { const q = seasonAt(wx); return q.t > 0.5 ? q.b : q.a; };

    function size() {
      const r = { width: stage.clientWidth, height: stage.clientHeight };
      if (!r.width || !r.height) return;
      s = Math.max(2, Math.round(r.height / 150));
      vw = Math.ceil(r.width / s); LH = Math.ceil(r.height / s);
      cv.width = vw; cv.height = LH; cv.style.width = vw * s + "px"; cv.style.height = LH * s + "px";
      c.imageSmoothingEnabled = false;
      groundTop = LH - 44; roadY = LH - 28;
    }
    const ro = new ResizeObserver(() => size());
    ro.observe(stage);
    size();

    function treeSpr(season, v, pine) {
      const k = season + v + (pine ? "p" : "");
      if (!treeCache[k]) treeCache[k] = (pine ? A.pine(A.SEASONS[season], v) : A.tree(A.SEASONS[season], v)).cv;
      return treeCache[k];
    }
    const mountain = (x) => 22 + Math.sin(x / 37) * 9 + Math.sin(x / 13 + 1) * 4 + Math.abs(Math.sin(x / 71)) * 14;
    const hillH = (x) => 12 + Math.sin(x / 29) * 5 + Math.sin(x / 11 + 2) * 2;

    function draw() {
      const cx = camX;
      const q = domSeason(cx + vw / 2), P = RS[q];
      // sky
      const g = c.createLinearGradient(0, 0, 0, groundTop);
      g.addColorStop(0, P.sky[0]); g.addColorStop(1, P.sky[1]);
      c.fillStyle = g; c.fillRect(0, 0, vw, LH);
      // sun
      A.disc(c, vw - 30, 18, 8, "#fff3b0"); A.disc(c, vw - 30, 18, 6, "#ffe066");
      // clouds
      clouds.forEach((cl) => { const x = Math.round(((cl.x - cx * 0.08 - t * 4) % (vw + 80) + vw + 80) % (vw + 80) - 40); c.fillStyle = "rgba(255,255,255,.9)"; c.fillRect(x, Math.round(cl.y), Math.round(cl.w), 4); c.fillRect(x + 4, Math.round(cl.y) - 3, Math.round(cl.w * 0.5), 3); c.fillRect(x + 8, Math.round(cl.y) + 4, Math.round(cl.w * 0.6), 2); });
      // mountains (Himalaya nod)
      for (let sx = 0; sx < vw; sx++) {
        const wx = cx * 0.2 + sx, h = Math.round(mountain(wx)), top = groundTop - 14 - h;
        c.fillStyle = colAt(cx + sx, "far"); c.fillRect(sx, top, 1, groundTop - top);
        const snowLine = Math.max(0, h - 22);
        if (snowLine > 0) { c.fillStyle = "#ffffff"; c.fillRect(sx, top, 1, Math.min(snowLine, 6)); }
      }
      // hills
      for (let sx = 0; sx < vw; sx++) {
        const wx = cx * 0.45 + sx, h = Math.round(hillH(wx)), top = groundTop - h;
        c.fillStyle = colAt(cx + sx, "hill"); c.fillRect(sx, top, 1, groundTop - top + 2);
        c.fillStyle = colAt(cx + sx, "hillD"); c.fillRect(sx, top, 1, 1);
      }
      // trees (parallax .7)
      trees.forEach((tr) => {
        const sx = Math.round(tr.x - cx * 0.7);
        if (sx < -40 || sx > vw + 10) return;
        const season = domSeason(cx + sx);
        const img = treeSpr(season, tr.v, tr.pine);
        c.drawImage(img, sx, groundTop + 4 - img.height);
      });
      // ground & road
      for (let sx = 0; sx < vw; sx += 2) {
        c.fillStyle = colAt(cx + sx, "grass"); c.fillRect(sx, groundTop, 2, LH - groundTop);
        c.fillStyle = colAt(cx + sx, "road"); c.fillRect(sx, roadY, 2, 13);
      }
      c.fillStyle = "rgba(0,0,0,.12)"; c.fillRect(0, roadY + 4, vw, 1); c.fillRect(0, roadY + 9, vw, 1);
      // details on the ground (fence, flowers, snow tufts)
      for (let wx = Math.floor(cx / 24) * 24; wx < cx + vw + 24; wx += 24) {
        const sx = Math.round(wx - cx), season = domSeason(wx);
        c.fillStyle = "#3b2414"; c.fillRect(sx, groundTop - 2, 3, 10);
        c.fillStyle = "#a06a35"; c.fillRect(sx + 1, groundTop - 1, 1, 9);
        c.fillStyle = "#c99459"; c.fillRect(sx, groundTop + 1, 24, 1); c.fillRect(sx, groundTop + 5, 24, 1);
        const fy = roadY + 17 + ((wx / 24) % 3);
        if (season === "winter") { c.fillStyle = "#ffffff"; c.fillRect(sx + 8, fy, 4, 1); }
        else { const fl = A.SEASONS[season].flowers; c.fillStyle = fl[(wx / 24) % fl.length | 0]; c.fillRect(sx + 9, fy, 2, 2); c.fillStyle = "#3c7a2a"; c.fillRect(sx + 9, fy + 2, 1, 2); }
      }
      // stops
      stops.forEach((st, i) => {
        const img = building(st.e.building || "lab");
        const sx = Math.round(st.x - cx - img.width / 2);
        if (sx < -80 || sx > vw + 10) return;
        c.drawImage(img, sx, groundTop + 6 - img.height);
        if (delivered.has(st.e.id) && st.e.id !== "__next") { c.fillStyle = "#3b2414"; c.fillRect(sx + img.width - 12, groundTop - 1, 9, 8); c.fillStyle = "#c99459"; c.fillRect(sx + img.width - 11, groundTop, 7, 6); }
        if (i === curIdx && st.e.id !== "__next") { const fy = Math.round(groundTop - img.height - 4 + Math.sin(t * 4) * 1.5); c.fillStyle = "#d24a3c"; c.fillRect(Math.round(st.x - cx) - 1, fy - 6, 3, 3); }
      });
      // flying crates
      flying.forEach((f) => { const k = Math.min(1, f.t / 0.6); const x = f.x0 + (f.x1 - f.x0) * k, y = f.y0 + (f.y1 - f.y0) * k - Math.sin(k * Math.PI) * 26; c.fillStyle = "#3b2414"; c.fillRect(Math.round(x - cx), Math.round(y), 9, 8); c.fillStyle = "#c99459"; c.fillRect(Math.round(x - cx) + 1, Math.round(y) + 1, 7, 6); });
      // cart + pony
      const remaining = stops.filter((st) => st.e.id !== "__next" && !delivered.has(st.e.id)).length;
      const moving = Math.abs(cart.v) > 2;
      const bob = moving ? Math.round(Math.abs(Math.sin(t * 12))) : 0;
      const cartImg = A.cartSide(Math.min(3, remaining), cart.wheel, true, "#c99459");
      const px = Math.round(cart.x - cx), py = roadY + 11;
      c.fillStyle = "rgba(0,0,0,.18)"; c.fillRect(px + 2, py - 1, 76, 2);
      c.drawImage(cartImg, px, py - 42 - bob);
      const pf = moving ? ponyFr[Math.floor(cart.dist / 6) % 4] : ponyFr[0];
      c.drawImage(pf, px + 44, py - 31);
      // dust
      particles.forEach((p) => { c.fillStyle = `rgba(230,210,170,${p.life})`; c.fillRect(Math.round(p.x - cx), Math.round(p.y), 2, 2); });
      // seasonal weather
      const nfx = q === "winter" ? 40 : q === "fall" ? 14 : q === "spring" ? 10 : 0;
      for (let i = 0; i < nfx; i++) {
        const sx = ((i * 53 + t * (q === "winter" ? 6 : 22)) % (vw + 20)) - 10, sy = ((i * 37 + t * (q === "winter" ? 16 : 12)) % (LH + 10)) - 5;
        c.fillStyle = q === "winter" ? "#ffffff" : q === "fall" ? ["#e07b28", "#c9472e", "#e8b13c"][i % 3] : i % 2 ? "#f7b6cf" : "#ffffff";
        c.fillRect(Math.round(sx), Math.round(sy), q === "winter" ? 1 : 2, 1 + (Math.floor(t * 3 + i) % 2));
      }
      // tags
      stops.forEach((st, i) => {
        const img = building(st.e.building || "lab");
        st.tag.style.left = (st.x - cx) * s + "px";
        st.tag.style.top = (groundTop + 2 - img.height - 6) * s + "px";
        st.tag.classList.toggle("cur", i === curIdx);
        st.tag.style.visibility = st.x - cx > -60 && st.x - cx < vw + 60 ? "visible" : "hidden";
      });
      years.forEach((y) => { y.el.style.left = (y.x - cx) * s + "px"; y.el.style.top = (roadY + 15) * s + "px"; });
      cartDot.style.left = ((cart.x + 30) / LEN) * 100 + "%";
    }

    function setCurrent(i) {
      if (i === curIdx) return;
      curIdx = i;
      stops.forEach((st, k) => { st.dot.classList.toggle("cur", k === i); st.dot.classList.toggle("done", k < i); });
      if (i < 0) {
        cardEl.innerHTML = `<div class="road-intro"><div class="big">Hop on the cart!</div><p>This road runs through every season of my journey so far, from my first research lab in 2024 to my most recent internship. Press <b>Next stop</b>, tap a sign, or hold <b>→</b> to drive.</p><button class="btn green" data-a="next">${F.icon("cart", 18)} Let's go</button></div>`;
        F.$("[data-a=next]", cardEl).onclick = () => driveTo(0);
        return;
      }
      const e = stops[i].e;
      if (e.id === "__next") {
        cardEl.innerHTML = `<div class="road-card"><div class="logo" style="display:grid;place-items:center;background:#fff1b8">${F.icon("sparkle", 56)}</div><div>
          <div class="kicker">${F.esc(F.data.person.grad)} and beyond</div><div class="role">Next stop: your team?</div>
          <p style="margin-top:8px">The road keeps going. I'm looking for ${F.esc(F.data.person.lookingFor.replace(/\.$/, "").replace(/^Co-op/, "co-op"))}. If that sounds like your team, I'd love to hear from you.</p>
          <div class="row">${F.panel.helpers.btn(F.icon("mailbox", 18) + " Send a pigeon", 'data-go="contact"', "green")}${F.panel.helpers.btn(F.icon("doc", 18) + " Résumé", 'data-go="resume"', "paper")}<span class="muted" style="font-family:var(--px);font-size:14px">psst, something's on that sign</span>${F.panel.helpers.secret("road", "The golden acorn on top of the sign", 30)}</div>
        </div></div>`;
        F.panel.wireCommon(cardEl); F.acorns.bindSecrets(cardEl);
        return;
      }
      cardEl.innerHTML = `<div class="road-card"><div class="logo" style="background-image:url('${F.esc(e.logo)}')" role="img" aria-label="${F.esc(e.org)} logo"></div><div>
        <div class="kicker">Stop ${i + 1} of ${stops.length - 1} · ${e.kind === "industry" ? "Industry" : "Research"}</div>
        <div class="role">${F.esc(e.role)}</div><div class="org">${F.esc(e.org)}</div>
        <div class="when">${F.icon("calendar", 16)} ${F.esc(e.dates)}${e.location ? " · " + F.esc(e.location) : ""}</div>
        <ul>${e.bullets.map((b) => `<li>${F.esc(b)}</li>`).join("")}</ul>
        <div class="chips">${e.skills.map((k) => `<span class="chip">${F.esc(k)}</span>`).join("")}</div>
        ${e.journal ? `<div class="journal"><b>${F.icon("book", 16)} From my notebook</b>${F.esc(e.journal)}</div>` : ""}
      </div></div>`;
      cardEl.scrollTop = 0;
    }
    function nearestIdx() {
      let idx = -1;
      stops.forEach((st, i) => { if (cart.x + 30 >= st.x - 6) idx = i; });
      return idx;
    }
    function driveTo(i) {
      i = F.clamp(i, 0, stops.length - 1);
      cart.target = stops[i].x - 30;
      F.audio.play("click");
    }

    function update(dt) {
      t += dt;
      const SP = 70;
      if (keys.has("r")) { cart.target = null; cart.v = F.lerp(cart.v, SP * 1.4, Math.min(1, dt * 4)); }
      else if (keys.has("l")) { cart.target = null; cart.v = F.lerp(cart.v, -SP * 1.4, Math.min(1, dt * 4)); }
      else if (cart.target != null) {
        const dx = cart.target - cart.x, dist = Math.abs(dx);
        const want = Math.sign(dx) * Math.min(Math.max(SP + 20, dist * 2.4), 560);
        cart.v = F.lerp(cart.v, want, Math.min(1, dt * 5));
        if (dist < 1.2 || Math.sign(dx) !== Math.sign(cart.v) && dist < 6) { cart.x = cart.target; cart.v = 0; cart.target = null; }
      } else cart.v = F.lerp(cart.v, 0, Math.min(1, dt * 6));
      const nx = F.clamp(cart.x + cart.v * dt, -10, LEN - 90);
      const moved = nx - cart.x; cart.x = nx;
      cart.dist += Math.abs(moved); cart.wheel += moved / 8;
      if (Math.abs(moved) > 0.05) {
        cart.hoofAcc += Math.abs(moved);
        if (cart.hoofAcc > 11) { cart.hoofAcc = 0; F.audio.play("hoof"); }
        if (Math.random() < 0.4) particles.push({ x: cart.x + 6, y: roadY + 8 + Math.random() * 3, life: 0.6 });
      }
      particles.forEach((p) => { p.life -= dt; p.y -= 6 * dt; p.x -= Math.sign(cart.v) * 10 * dt; });
      for (let i = particles.length - 1; i >= 0; i--) if (particles[i].life <= 0) particles.splice(i, 1);
      flying.forEach((f) => (f.t += dt));
      for (let i = flying.length - 1; i >= 0; i--) if (flying[i].t >= 0.6) { delivered.add(flying[i].id); F.store.set("delivered", Array.from(delivered)); flying.splice(i, 1); F.audio.play("deliver"); }
      // arrival + delivery
      const ni = nearestIdx();
      if (ni !== curIdx) setCurrent(ni);
      if (ni >= 0 && Math.abs(cart.v) < 3 && Math.abs(cart.x + 30 - stops[ni].x) < 4) {
        const id = stops[ni].e.id;
        if (id !== "__next" && !delivered.has(id) && !flying.some((f) => f.id === id)) flying.push({ id, t: 0, x0: cart.x + 10, y0: roadY - 30, x1: stops[ni].x + building(stops[ni].e.building).width / 2 - 12, y1: groundTop - 1 });
      }
      // camera
      const target = F.clamp(cart.x + 40 - vw * 0.45, -20, Math.max(-20, LEN - vw));
      camX = F.lerp(camX, target, Math.min(1, dt * 6));
      camX = Math.round(camX);
    }
    function loop(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
      update(dt); draw();
      requestAnimationFrame(loop);
    }

    // controls
    const act = (a) => {
      const ti = cart.target != null ? stops.findIndex((st) => Math.abs(st.x - 30 - cart.target) < 1) : -1;
      if (a === "next") { if (ti >= 0) driveTo(ti + 1); else driveTo(nearestIdx() + 1); }
      else if (a === "prev") { if (ti >= 0) driveTo(ti - 1); else { const i = nearestIdx(); const atStop = i >= 0 && Math.abs(cart.x + 30 - stops[i].x) < 8; driveTo(atStop ? i - 1 : i); } }
      else if (a === "first") driveTo(0);
      else if (a === "list") { wrap.classList.toggle("list"); F.audio.play("page"); }
    };
    body.addEventListener("click", (e) => { const b = e.target.closest("[data-a]"); if (b && body.contains(b) && !b.closest(".road-card-wrap")) act(b.getAttribute("data-a")); });
    const KM = { ArrowRight: "r", KeyD: "r", ArrowLeft: "l", KeyA: "l" };
    const kd = (e) => {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      const k = KM[e.code]; if (k) { keys.add(k); e.preventDefault(); }
      if (e.code === "Space" || e.code === "Enter") { if (!e.target.closest || !e.target.closest("button,a")) { e.preventDefault(); act("next"); } }
    };
    const ku = (e) => { const k = KM[e.code]; if (k) keys.delete(k); };
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    let drag = null;
    stage.addEventListener("pointerdown", (e) => { if (e.target.closest(".road-tag")) return; drag = { x: e.clientX, cx: cart.x }; stage.setPointerCapture(e.pointerId); stage.style.cursor = "grabbing"; F.audio.unlock(); });
    stage.addEventListener("pointermove", (e) => { if (!drag) return; cart.target = F.clamp(drag.cx - (e.clientX - drag.x) / s * 1.6, -10, LEN - 90); });
    const end = () => { drag = null; stage.style.cursor = ""; };
    stage.addEventListener("pointerup", end); stage.addEventListener("pointercancel", end);
    stage.addEventListener("wheel", (e) => { e.preventDefault(); cart.target = F.clamp((cart.target ?? cart.x) + (e.deltaY + e.deltaX) * 0.6, -10, LEN - 90); }, { passive: false });

    // start position
    let start = -1;
    if (sub) start = stops.findIndex((st) => st.e.id === sub);
    if (start >= 0) { cart.x = stops[start].x - 30; }
    camX = F.clamp(cart.x + 40 - vw * 0.45, -20, Math.max(-20, LEN - vw));
    setCurrent(nearestIdx());
    requestAnimationFrame(loop);

    ctxp.cleanup = () => { running = false; ro.disconnect(); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  };

  F.panel.register("experience", { bodyCls: "flush", render(body, sub, ctx) { F.road.mount(body, ctx, sub); } });
})();
