/* =====================================================================
   SKILLS — look through the telescope: every skill is a star, every
   skill group a constellation.
   ===================================================================== */
(function () {
  const F = window.FARM, A = F.art;

  /* constellation shapes: normalized points (-0.5..0.5) + edges */
  const SHAPES = {
    cad: { pts: [[0, -0.5], [-0.17, -0.02], [-0.36, 0.46], [0.17, -0.02], [0.36, 0.46]], edges: [[0, 1], [1, 2], [0, 3], [3, 4], [1, 3]] },
    sim: { pts: [[-0.5, 0.05], [-0.3, -0.28], [-0.1, 0.05], [0.1, 0.32], [0.3, 0.02], [0.5, -0.28]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]] },
    mfg: { pts: [[-0.5, -0.24], [-0.08, -0.3], [0.46, -0.3], [0.34, 0.04], [0.16, 0.42], [-0.18, 0.42]], edges: [[0, 1], [1, 2], [2, 3], [3, 1], [3, 4], [4, 5], [5, 1]] },
    code: { pts: [[-0.46, -0.32], [0, -0.32], [0, 0.04], [0.46, 0.04], [0.46, 0.42], [-0.2, 0.42]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 2]] },
    bio: { pts: [[-0.48, -0.22], [-0.32, 0.26], [-0.16, -0.22], [0, 0.26], [0.16, -0.22], [0.32, 0.26], [0.48, -0.22]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [0, 2], [2, 4], [4, 6]] }
  };
  function shapeFor(g) {
    const sh = SHAPES[g.id];
    if (sh && sh.pts.length >= g.stars.length) return { pts: sh.pts.slice(0, g.stars.length), edges: sh.edges.filter(([a, b]) => a < g.stars.length && b < g.stars.length) };
    const n = g.stars.length;
    const pts = Array.from({ length: n }, (_, i) => [Math.cos((i / n) * 6.28) * 0.45, Math.sin((i / n) * 6.28) * 0.4]);
    return { pts, edges: pts.map((_, i) => [i, (i + 1) % n]) };
  }

  F.sky = {};
  F.sky.mount = function (body, ctxp) {
    const groups = F.data.skills;
    body.innerHTML = `<div class="sky-wrap"><canvas></canvas><div class="sky-labels"></div><div class="sky-tip" hidden></div>
      <div class="sky-ui"><span class="sky-hint">${F.icon("star", 16)} Hover or tap a star · bigger, brighter stars = stronger skills</span><button class="btn sm paper" data-list="1">${F.icon("doc", 16)} List view</button></div>
      <div class="sky-list" tabindex="0"></div></div>`;
    const wrap = F.$(".sky-wrap", body), cv = F.$("canvas", wrap), c = cv.getContext("2d"), labels = F.$(".sky-labels", wrap), tip = F.$(".sky-tip", wrap), listEl = F.$(".sky-list", wrap);

    listEl.innerHTML = `<p style="margin:0;color:#cfd6ff">Every skill, by group. Gold bars show how comfortable I am (out of 5).</p>` + groups.map((g) => `<h4>${F.esc(g.group)} <span style="opacity:.6;font-size:14px">· ${F.esc(g.name)}</span></h4>${g.stars.map((st) => `<div class="skill-row"><span>${F.esc(st.name)}</span><span class="bar">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= st.level ? "on" : ""}"></i>`).join("")}</span><span class="u">${F.esc(st.used || "")}</span></div>`).join("")}`).join("");
    F.$("[data-list]", wrap).onclick = () => { const on = listEl.classList.toggle("on"); F.$("[data-list]", wrap).innerHTML = on ? `${F.icon("star", 16)} Back to the sky` : `${F.icon("doc", 16)} List view`; F.audio.play("page"); };

    let s = 2, W = 0, H = 0, running = true, last = performance.now(), t = 0, appear = 0, focus = null, hover = null, pinned = null;
    let bg = [], stars = [], shooting = null, nextShoot = 3;
    const golden = { x: 0, y: 0, got: F.acorns.has("sky") };

    function layout() {
      const r = { width: wrap.clientWidth, height: wrap.clientHeight };
      if (!r.width || !r.height) return;
      s = Math.max(2, Math.round(Math.min(r.width, r.height) / 320));
      W = Math.ceil(r.width / s); H = Math.ceil(r.height / s);
      cv.width = W; cv.height = H; cv.style.width = W * s + "px"; cv.style.height = H * s + "px";
      c.imageSmoothingEnabled = false;
      const rnd = F.rng(77);
      bg = Array.from({ length: Math.round((W * H) / 260) }, () => ({ x: (rnd() * W) | 0, y: (rnd() * H * 0.86) | 0, p: rnd() * 6.28, b: rnd() }));
      const land = r.width > r.height * 1.05;
      const centers = land ? [[0.17, 0.28], [0.5, 0.2], [0.83, 0.28], [0.32, 0.6], [0.68, 0.6]] : [[0.28, 0.13], [0.72, 0.25], [0.28, 0.4], [0.72, 0.52], [0.38, 0.67]];
      const box = land ? Math.min(W / 4.2, H / 3.3) : Math.min(W / 2.5, H / 6.4);
      stars = [];
      labels.innerHTML = "";
      groups.forEach((g, gi) => {
        const [cx, cy] = centers[gi % centers.length];
        const sh = shapeFor(g);
        g._pts = sh.pts.map(([px, py]) => [Math.round(cx * W + px * box * 1.15), Math.round(cy * H + py * box)]);
        g._edges = sh.edges;
        g.stars.forEach((st, i) => stars.push({ g, st, x: g._pts[i][0], y: g._pts[i][1], tw: Math.random() * 6 }));
        const lb = F.html(`<button class="cname" data-g="${g.id}"><b>${F.esc(g.name)}</b><span>${F.esc(g.group)}</span></button>`);
        const maxY = Math.max(...g._pts.map((p) => p[1]));
        lb.style.left = cx * W * s + "px"; lb.style.top = (maxY + 7) * s + "px";
        lb.onclick = (e) => { e.stopPropagation(); focus = focus === g ? null : g; F.$$(".cname", labels).forEach((x) => x.classList.toggle("on", focus && x.getAttribute("data-g") === focus.id)); F.audio.play("star"); if (focus) showGroupTip(g, lb); else hideTip(); };
        labels.appendChild(lb);
      });
      golden.x = Math.round(W * (land ? 0.93 : 0.88)); golden.y = Math.round(H * (land ? 0.1 : 0.06)) + 12;
    }
    const ro = new ResizeObserver(layout);
    ro.observe(wrap);
    layout();

    function plus(x, y, r, col) { c.fillStyle = col; c.fillRect(x - r, y, r * 2 + 1, 1); c.fillRect(x, y - r, 1, r * 2 + 1); }
    function dline(x0, y0, x1, y1, col, prog) {
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
      c.fillStyle = col;
      for (let i = 0; i <= n * prog; i += 2) c.fillRect(Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), 1, 1);
    }

    function draw() {
      const g = c.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#070b22"); g.addColorStop(0.6, "#151a46"); g.addColorStop(1, "#3a2a5c");
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      // milky way
      for (let i = 0; i < 260; i++) { const k = i / 260, x = (k * W * 1.3 - W * 0.15) | 0, y = (H * 0.75 - k * H * 0.7 + Math.sin(i * 12.9) * 18) | 0; c.fillStyle = `rgba(190,180,255,${0.05 + (Math.sin(i * 7.7) + 1) * 0.04})`; c.fillRect(x, y, 2, 2); }
      bg.forEach((b) => { const a = 0.35 + 0.45 * Math.sin(t * (1 + b.b) + b.p); c.fillStyle = `rgba(255,255,240,${Math.max(0.1, a) * (0.5 + b.b * 0.5)})`; c.fillRect(b.x, b.y, 1, 1); });
      // moon
      const mx = Math.round(W * 0.1), my = Math.round(H * 0.12);
      A.disc(c, mx, my, 9, "#fff6c9"); A.disc(c, mx + 5, my - 3, 8, "#0b1030"); c.fillStyle = "#0b1030";
      // golden acorn star
      if (!golden.got) {
        const tw = (Math.sin(t * 3) + 1) / 2;
        plus(golden.x, golden.y, 1 + Math.round(tw * 2), "#ffd84a");
        c.fillStyle = "#fff6c0"; c.fillRect(golden.x, golden.y, 1, 1);
      }
      // shooting star
      if (shooting) { const k = shooting.t / 0.8; for (let i = 0; i < 14; i++) { c.fillStyle = `rgba(255,255,255,${(1 - i / 14) * (1 - k)})`; c.fillRect(Math.round(shooting.x + shooting.dx * k - i * 2), Math.round(shooting.y + shooting.dy * k - i), 1, 1); } }
      // constellations
      groups.forEach((gr) => {
        const dim = focus && focus !== gr;
        const hl = (hover && hover.g === gr) || focus === gr;
        const col = F.hex2rgb(gr.color);
        const lineCol = `rgba(${col[0]},${col[1]},${col[2]},${dim ? 0.12 : hl ? 0.85 : 0.42})`;
        gr._edges.forEach(([a, b], i) => { const p = F.clamp(appear * 1.6 - i * 0.12, 0, 1); dline(gr._pts[a][0], gr._pts[a][1], gr._pts[b][0], gr._pts[b][1], lineCol, p); });
      });
      stars.forEach((st) => {
        const dim = focus && focus !== st.g;
        const lv = st.st.level || 3;
        const tw = 0.75 + 0.25 * Math.sin(t * 2 + st.tw);
        const isH = hover === st || pinned === st;
        const a = (dim ? 0.3 : 1) * F.clamp(appear * 2, 0, 1);
        const col = F.hex2rgb(st.g.color);
        c.globalAlpha = a;
        if (isH) { c.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},.35)`; c.fillRect(st.x - 4, st.y - 4, 9, 9); }
        const r = lv >= 5 ? 2 : lv >= 4 ? 1 : 0;
        if (r) plus(st.x, st.y, r + (isH ? 1 : 0), `rgba(${col[0]},${col[1]},${col[2]},${tw})`);
        c.fillStyle = "#ffffff"; c.fillRect(st.x, st.y, 1, 1);
        if (lv >= 5) { c.fillStyle = `rgba(255,255,255,${0.5 * tw})`; c.fillRect(st.x - 1, st.y - 1, 3, 3); c.fillStyle = "#fff"; c.fillRect(st.x, st.y, 1, 1); }
        c.globalAlpha = 1;
      });
      // farm silhouette
      const base = H - 30;
      for (let x = 0; x < W; x++) { const y = Math.round(base + Math.sin(x / 40) * 5 + Math.sin(x / 13) * 1.5 - (x > W * 0.7 ? (x - W * 0.7) * 0.18 : 0)); c.fillStyle = "#0a0e26"; c.fillRect(x, y, 1, H - y); }
      const hx = Math.round(W * 0.18), hy = Math.round(base + Math.sin(hx / 40) * 5);
      c.fillStyle = "#0a0e26"; c.fillRect(hx - 12, hy - 14, 24, 14); for (let i = 0; i < 9; i++) c.fillRect(hx - 13 + i, hy - 15 - i, 26 - i * 2, 1); c.fillRect(hx + 6, hy - 24, 3, 8);
      c.fillStyle = "#ffcf6e"; c.fillRect(hx - 8, hy - 9, 3, 3); c.fillRect(hx + 4, hy - 9, 3, 3);
      const bx = Math.round(W * 0.34), by = Math.round(base + Math.sin(bx / 40) * 5);
      c.fillStyle = "#0a0e26"; c.fillRect(bx - 14, by - 16, 28, 16); for (let i = 0; i < 8; i++) c.fillRect(bx - 15 + Math.round(i * 0.6), by - 17 - i, 30 - Math.round(i * 1.2), 1);
      c.fillStyle = "#ffcf6e"; c.fillRect(bx - 2, by - 12, 4, 3);
      const tx = Math.round(W * 0.84), ty = Math.round(base + Math.sin(tx / 40) * 5 - (tx - W * 0.7) * 0.18);
      c.fillStyle = "#0a0e26"; A.line(c, tx, ty - 9, tx - 4, ty, "#0a0e26"); A.line(c, tx, ty - 9, tx + 4, ty, "#0a0e26"); A.line(c, tx - 4, ty - 7, tx + 6, ty - 14, "#0a0e26", 2);
      c.fillRect(tx - 10, ty - 14, 4, 14); c.fillRect(tx - 11, ty - 17, 6, 4); c.fillRect(tx - 12, ty - 15, 2, 9);
      // fireflies on the hill
      for (let i = 0; i < 6; i++) { const a = (Math.sin(t * 2 + i) + 1) / 2; c.fillStyle = `rgba(255,240,140,${a})`; c.fillRect(Math.round((i * 71 + Math.sin(t / 2 + i) * 20) % W), Math.round(base + 8 + (i % 3) * 5), 1, 1); }
    }

    function showStarTip(st) {
      const lv = st.st.level || 3;
      tip.innerHTML = `<b>${F.esc(st.st.name)}</b><div class="pips">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= lv ? "on" : ""}"></i>`).join("")}</div><div class="g">${F.esc(st.g.group)}</div>${st.st.used ? `<div style="margin-top:6px">Used in: ${F.esc(st.st.used)}</div>` : ""}`;
      placeTip(st.x * s, st.y * s);
    }
    function showGroupTip(g, lb) {
      tip.innerHTML = `<b>${F.esc(g.group)}</b><div class="g">${F.esc(g.name)}</div><ul style="margin:6px 0 0;padding-left:16px">${g.stars.map((x) => `<li>${F.esc(x.name)}</li>`).join("")}</ul>`;
      const r = lb.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
      placeTip(r.left - wr.left + r.width / 2, r.top - wr.top + r.height);
    }
    function placeTip(x, y) {
      tip.hidden = false;
      const wr = wrap.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
      let lx = x + 16, ly = y + 12;
      if (lx + tw > wr.width - 8) lx = x - tw - 16;
      if (ly + th > wr.height - 60) ly = y - th - 12;
      tip.style.left = Math.max(8, lx) + "px"; tip.style.top = Math.max(8, ly) + "px";
    }
    function hideTip() { tip.hidden = true; }
    function starAt(ex, ey) {
      const r = cv.getBoundingClientRect(), x = (ex - r.left) / s, y = (ey - r.top) / s;
      let best = null, bd = (14 / s) ** 2;
      stars.forEach((st) => { const d = (st.x - x) ** 2 + (st.y - y) ** 2; if (d < bd) { bd = d; best = st; } });
      const onGold = !golden.got && (golden.x - x) ** 2 + (golden.y - y) ** 2 < (16 / s) ** 2;
      return { best, onGold };
    }
    cv.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      const { best, onGold } = starAt(e.clientX, e.clientY);
      cv.style.cursor = best || onGold ? "pointer" : "default";
      if (best !== hover) { hover = best; if (best) { showStarTip(best); F.audio.play("hover"); } else if (!pinned && !focus) hideTip(); }
    });
    cv.addEventListener("pointerleave", () => { hover = null; if (!pinned && !focus) hideTip(); });
    cv.addEventListener("click", (e) => {
      const { best, onGold } = starAt(e.clientX, e.clientY);
      if (onGold) {
        golden.got = true; F.audio.play("star");
        tip.innerHTML = `<b>That's no star…</b><div style="margin-top:4px">It's a golden acorn! Someone must have tossed it really high.</div>`; placeTip(golden.x * s, golden.y * s);
        F.acorns.collect("sky");
        return;
      }
      if (best) { pinned = best; hover = best; showStarTip(best); F.audio.play("star"); }
      else { pinned = null; focus = null; F.$$(".cname", labels).forEach((x) => x.classList.remove("on")); hideTip(); }
    });

    function loop(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      appear = Math.min(1, appear + dt * 0.7);
      nextShoot -= dt;
      if (nextShoot < 0 && !shooting) { shooting = { x: Math.random() * W * 0.6 + W * 0.2, y: Math.random() * H * 0.25, dx: 70 + Math.random() * 40, dy: 30 + Math.random() * 15, t: 0 }; nextShoot = 5 + Math.random() * 6; }
      if (shooting) { shooting.t += dt; if (shooting.t > 0.8) shooting = null; }
      draw();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    ctxp.cleanup = () => { running = false; ro.disconnect(); };
  };

  F.panel.register("skills", { bodyCls: "flush", render(body, sub, ctx) { F.sky.mount(body, ctx); } });
})();
