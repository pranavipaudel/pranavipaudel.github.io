/* =====================================================================
   THE FARM WORLD — tile map, walking farmer, critters, seasons, day/night
   ===================================================================== */
(function () {
  const F = window.FARM, A = F.art;
  const T = 16, W = 38, H = 26, WPX = W * T, HPX = H * T;

  const world = (F.world = {});
  F.state = F.state || { seasonMode: F.store.get("seasonMode", "auto"), timeMode: F.store.get("timeMode", "auto") };

  /* ---------------- map ---------------- */
  function buildMap() {
    const m = [];
    for (let y = 0; y < H; y++) m.push(new Array(W).fill("g"));
    const fill = (x0, y0, x1, y1, ch) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) m[y][x] = ch; };
    fill(31, 2, 35, 6, "h");
    fill(30, 2, 30, 7, "c"); fill(30, 7, 35, 7, "c"); m[7][33] = "t";
    fill(5, 8, 34, 9, "p");
    fill(10, 7, 10, 7, "p");
    fill(17, 10, 18, 21, "p");
    fill(4, 15, 16, 16, "p");
    fill(19, 15, 23, 16, "p");
    fill(0, 22, 37, 23, "r");
    fill(10, 11, 13, 13, "s");
    const cx = 5.5, cy = 19.4, rx = 3.6, ry = 2.3;
    for (let y = 16; y <= 21; y++) for (let x = 1; x <= 10; x++) {
      const d = Math.pow((x + 0.5 - cx) / rx, 2) + Math.pow((y + 0.5 - cy) / ry, 2);
      if (d < 1) m[y][x] = "w"; else if (d < 1.55 && m[y][x] === "g") m[y][x] = "b";
    }
    return m;
  }

  /* ---------------- state ---------------- */
  let map, blocked, S, seasonKey, ground;
  let objects = [], hotspots = [], waterPx = [], critters = [], particles = [], smoke = [], ripples = [], worldAcorns = [];
  let canvas, ctx, labelsEl, promptEl, markerEl;
  let scale = 3, vw = 0, vh = 0, offX = 0, offY = 0;
  const cam = { x: 0, y: 0 };
  const player = { x: 160, y: 140, dir: "down", frame: 0, dist: 0, path: [], target: null, moving: false, stepAcc: 0 };
  const keys = new Set();
  let running = false, paused = false, lastT = 0, time = 0, clickMark = null, hoverId = null, nearId = null;
  let firstMoveDone = F.store.get("moved", false);

  const isBlocked = (tx, ty) => tx < 0 || ty < 0 || tx >= W || ty >= H || blocked[ty * W + tx] === 1;
  const blockRect = (x0, y0, x1, y1) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (x >= 0 && y >= 0 && x < W && y < H) blocked[y * W + x] = 1; };

  function seasonFromDate(d = new Date()) {
    const m = d.getMonth();
    return m >= 2 && m <= 4 ? "spring" : m >= 5 && m <= 7 ? "summer" : m >= 8 && m <= 10 ? "fall" : "winter";
  }
  world.seasonKey = () => seasonKey;
  world.season = () => S;

  /* ---------------- build all objects for a season ---------------- */
  function build() {
    seasonKey = F.state.seasonMode === "auto" ? seasonFromDate() : F.state.seasonMode;
    S = A.SEASONS[seasonKey];
    map = map || buildMap();
    blocked = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const ch = map[y][x]; if (ch === "w" || ch === "c") blocked[y * W + x] = 1; }
    ground = A.ground(map, S, T);
    waterPx = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (map[y][x] === "w") for (let i = 0; i < 3; i++) waterPx.push([x * T + ((i * 5 + y * 3) % 14) + 1, y * T + ((i * 7 + x * 5) % 13) + 2, (x * 13 + y * 7 + i * 3) % 10]);

    objects = []; hotspots = [];
    const add = (spr, left, bottom, extra = {}) => {
      const o = Object.assign({ img: spr.cv || spr, x: left, y: bottom - (spr.cv || spr).height, base: bottom, lights: spr.lights || [] }, extra);
      o.w = o.img.width; o.h = o.img.height;
      objects.push(o);
      return o;
    };
    const hot = (o, id, ix, iy, face, extra = {}) => {
      const d = F.SECTIONS[id];
      const h = Object.assign({ id, o, ix, iy, face, label: d.label, place: d.place, icon: d.icon }, extra);
      hotspots.push(h);
      o.hot = id;
      return h;
    };

    // --- buildings
    const fh = add(A.farmhouse(S), 7 * T, 7 * T + 4);
    blockRect(7, 2, 12, 6);
    hot(fh, "about", 160, 7 * T + 10, "up");
    world.chimney = [fh.x + 70, fh.y + 1];

    const mb = A.mailbox(S, true);
    const mbo = add(mb, 13 * T - 1, 8 * T - 2);
    blockRect(13, 7, 13, 7);
    hot(mbo, "contact", 13 * T + 8, 8 * T + 9, "up");

    const barn = add(A.barn(S), 20 * T, 8 * T + 4);
    blockRect(20, 2, 26, 7);
    hot(barn, "projects", 376, 8 * T + 11, "up");

    add(A.coop(S), 27 * T, 7 * T);
    blockRect(27, 5, 28, 6);

    const tel = add(A.telescope(S), 33 * T - 4, 4 * T + 4);
    blockRect(33, 3, 33, 3);
    hot(tel, "skills", 33 * T + 8, 5 * T + 2, "up");

    const booth = add(A.booth(S), 21 * T - 2, 15 * T + 2);
    blockRect(21, 12, 24, 14);
    hot(booth, "certs", 21 * T + 32, 15 * T + 11, "up");
    add(A.pumpkin(S, true), 25 * T + 4, 15 * T - 1);
    blockRect(25, 14, 25, 14);

    const nb = add(A.noticeboard(S), 19 * T - 2, 12 * T + 2);
    blockRect(19, 11, 20, 11);
    hot(nb, "resume", 19 * T + 16, 12 * T + 11, "up");

    const gh = add(A.greenhouse(S), 2 * T, 15 * T + 2);
    blockRect(2, 11, 7, 14);
    hot(gh, "hobbies", 80, 15 * T + 11, "up");

    // --- cart + pony on the road
    world.ponyFrames = A.pony();
    const cart = add(A.cartSide(3, 0.3, false), 25 * T + 2, 23 * T + 10);
    const pony = add(world.ponyFrames[0], 25 * T + 2 + 44, 23 * T + 10, { pony: true });
    blockRect(26, 22, 29, 23);
    const cartHot = hot(cart, "experience", 24 * T + 4, 23 * T + 2, "right");
    cartHot.extraRect = [pony.x, pony.y, pony.w, pony.h];
    add(A.signpost(S), 23 * T + 2, 22 * T - 1);
    blockRect(23, 21, 23, 21);

    // --- field with fence, crops and scarecrow
    blockRect(9, 10, 14, 14);
    const fh2 = A.fenceH(S), fp = A.fencePost(S), fv = A.fenceV(S);
    for (let x = 9; x <= 14; x++) { add(x === 14 ? fp : fh2, x * T, 10 * T + 16); add(x === 14 ? fp : fh2, x * T, 14 * T + 16); }
    for (let y = 11; y <= 13; y++) { add(fv, 9 * T, y * T + 16); add(fv, 14 * T, y * T + 16); }
    for (let y = 11; y <= 13; y++) for (let x = 10; x <= 13; x++) {
      if (x === 12 && y === 12) continue;
      add(A.crop(S, x + y * 3), x * T, y * T + 15, { crop: true });
    }
    add(A.scarecrow(S), 12 * T - 3, 13 * T + 4);

    // --- lamps
    [[16, 7], [19, 17], [24, 19], [8, 17]].forEach(([x, y]) => { add(A.lamp(S), x * T + 2, (y + 1) * T - 2); blockRect(x, y, x, y); });

    // --- trees: forest border
    const rnd = F.rng(42);
    const tree = (x, y, kind, v) => {
      const spr = kind === "pine" ? A.pine(S, v) : A.tree(S, v, kind === "big");
      const o = add(spr, Math.round(x - spr.cv.width / 2), y, { tree: true });
      blockRect(Math.floor(x / T), Math.floor((y - 4) / T), Math.floor(x / T), Math.floor((y - 4) / T));
      return o;
    };
    for (let x = 6; x < WPX; x += 22) tree(x + ((rnd() * 8) | 0), 18 + ((rnd() * 6) | 0), rnd() < 0.55 ? "pine" : "tree", (rnd() * 3) | 0);
    for (let x = 16; x < WPX; x += 26) if (!(x > 100 && x < 220) && !(x > 300 && x < 440)) tree(x + ((rnd() * 8) | 0), 32 + ((rnd() * 4) | 0), rnd() < 0.5 ? "pine" : "tree", (rnd() * 3) | 0);
    blockRect(0, 0, W - 1, 1);
    for (let y = 44; y < 22 * T; y += 22) { tree(10 + ((rnd() * 6) | 0), y + ((rnd() * 6) | 0), rnd() < 0.5 ? "pine" : "tree", (rnd() * 3) | 0); tree(WPX - 12 - ((rnd() * 6) | 0), y + ((rnd() * 6) | 0), rnd() < 0.5 ? "pine" : "tree", (rnd() * 3) | 0); }
    blockRect(0, 0, 1, 21); blockRect(36, 0, 37, 21);
    for (let x = 8; x < WPX; x += 24) tree(x + ((rnd() * 10) | 0), 24 * T + 14 + ((rnd() * 10) | 0), rnd() < 0.5 ? "pine" : "tree", (rnd() * 3) | 0);
    blockRect(0, 24, W - 1, 25);
    blockRect(0, 22, 0, 23); blockRect(37, 22, 37, 23);
    // inner trees
    [[56, 60, "tree", 0], [90, 108, "tree", 1], [270, 64, "tree", 2], [302, 104, "pine", 0], [470, 168, "tree", 0], [520, 186, "pine", 1], [494, 232, "tree", 1], [548, 262, "tree", 2], [462, 300, "pine", 0], [560, 330, "tree", 0], [292, 300, "tree", 2], [232, 252, "pine", 1]].forEach(([x, y, k, v]) => tree(x, y, k, v));
    // the big old oak by the pond
    tree(11 * T + 8, 21 * T - 2, "big", 0);
    blockRect(11, 19, 12, 20);

    // --- bushes, rocks, flowers, stumps
    const deco = [
      ["bush", 104, 124], ["bush", 214, 122], ["bush", 290, 140], ["bush", 448, 240], ["bush", 140, 290], ["bush", 330, 290], ["bush", 520, 208],
      ["rock", 250, 196], ["rock", 430, 284], ["rock", 200, 360], ["rock", 540, 100], ["rock", 60, 260],
      ["stump", 330, 196], ["stump", 470, 128],
      ["flowers", 60, 200], ["flowers", 240, 140], ["flowers", 256, 290], ["flowers", 420, 196], ["flowers", 520, 60], ["flowers", 500, 290], ["flowers", 160, 260], ["flowers", 586, 80], ["flowers", 300, 250], ["flowers", 236, 220]
    ];
    deco.forEach(([k, x, y], i) => {
      const spr = A[k](S, i);
      add(spr, x - (spr.cv.width >> 1), y, { deco: k });
      if (k === "bush" || k === "rock" || k === "stump") blockRect(Math.floor(x / T), Math.floor((y - 3) / T), Math.floor(x / T), Math.floor((y - 3) / T));
    });
    // lily pads
    [[60, 300], [100, 316], [76, 326]].forEach(([x, y]) => add(A.lilypad(S), x, y, { flat: true }));

    // --- world acorns
    worldAcorns = [];
    const acornSpr = A.acorn();
    [["oak", 13 * T + 6, 20 * T + 10], ["hill", 35 * T + 6, 6 * T + 10]].forEach(([id, x, y]) => {
      if (!F.acorns || !F.acorns.has(id)) worldAcorns.push({ id, x, y, img: acornSpr.cv });
    });

    // --- critters
    if (!critters.length) {
      const ch1 = A.chicken(false), ch2 = A.chicken(true);
      [[350, 158, ch1], [410, 170, ch2], [440, 152, ch1]].forEach(([x, y, fr]) => critters.push({ kind: "chicken", x, y, fr, dir: 1, tx: x, ty: y, wait: Math.random() * 3, peck: 0, area: [292, 146, 470, 184] }));
      critters.push({ kind: "cat", x: 6 * T + 4, y: 7 * T + 12, fr: A.cat(), heart: 0 });
    }
    critters.forEach((c) => { if (c.kind === "butterfly") c.dead = true; });
    critters = critters.filter((c) => !c.dead);
    if (!S.snow) {
      ["#ffffff", "#ffd23f", "#f7a1c4"].forEach((col, i) => critters.push({ kind: "butterfly", x: 150 + i * 120, y: 200 + i * 30, fr: A.butterfly(col), t: Math.random() * 10, vx: 0, vy: 0 }));
    }

    particles = [];
    buildLabels();
  }

  /* ---------------- labels (HTML, crisp text) ---------------- */
  function buildLabels() {
    if (!labelsEl) return;
    labelsEl.innerHTML = "";
    hotspots.forEach((h) => {
      const el = F.html(`<button class="wlabel" data-id="${h.id}" tabindex="-1" aria-hidden="true"><span class="wl-ic">${F.icon(h.icon, 14)}</span><span class="wl-t">${F.esc(h.label)}</span></button>`);
      el.addEventListener("click", (e) => { e.stopPropagation(); world.walkTo(h.id); });
      labelsEl.appendChild(el);
      h.el = el;
    });
    promptEl = F.html(`<div class="wprompt" hidden></div>`);
    labelsEl.appendChild(promptEl);
    markerEl = null;
  }

  /* ---------------- pathfinding (A*, 8-way, no corner cutting) ---------------- */
  function astar(sx, sy, gx, gy) {
    if (isBlocked(gx, gy)) {
      let best = null, bd = 1e9;
      for (let r = 1; r < 6 && !best; r++) for (let y = gy - r; y <= gy + r; y++) for (let x = gx - r; x <= gx + r; x++) {
        if (!isBlocked(x, y)) { const d = (x - gx) ** 2 + (y - gy) ** 2; if (d < bd) { bd = d; best = [x, y]; } }
      }
      if (!best) return null;
      [gx, gy] = best;
    }
    const N = W * H, g = new Float32Array(N).fill(1e9), from = new Int32Array(N).fill(-1), closed = new Uint8Array(N);
    const open = [];
    const s = sy * W + sx, goal = gy * W + gx;
    g[s] = 0; open.push([s, 0]);
    const hfn = (i) => { const x = i % W, y = (i / W) | 0, dx = Math.abs(x - gx), dy = Math.abs(y - gy); return Math.max(dx, dy) + 0.414 * Math.min(dx, dy); };
    while (open.length) {
      let bi = 0;
      for (let i = 1; i < open.length; i++) if (open[i][1] < open[bi][1]) bi = i;
      const [cur] = open.splice(bi, 1)[0];
      if (cur === goal) break;
      if (closed[cur]) continue;
      closed[cur] = 1;
      const cx = cur % W, cy = (cur / W) | 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = cx + dx, ny = cy + dy;
        if (isBlocked(nx, ny)) continue;
        if (dx && dy && (isBlocked(cx + dx, cy) || isBlocked(cx, cy + dy))) continue;
        const ni = ny * W + nx, ng = g[cur] + (dx && dy ? 1.414 : 1);
        if (ng < g[ni]) { g[ni] = ng; from[ni] = cur; open.push([ni, ng + hfn(ni)]); }
      }
    }
    if (from[goal] === -1 && goal !== s) return null;
    const path = [];
    for (let i = goal; i !== -1 && i !== s; i = from[i]) path.push([(i % W) * T + 8, ((i / W) | 0) * T + 10]);
    return path.reverse();
  }
  function clearLine(x0, y0, x1, y1) {
    const d = Math.hypot(x1 - x0, y1 - y0), n = Math.ceil(d / 3);
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n, y = y0 + ((y1 - y0) * i) / n;
      for (const [ox, oy] of [[-5, 0], [5, 0], [0, -5], [-5, -5], [5, -5]]) if (isBlocked(Math.floor((x + ox) / T), Math.floor((y + oy) / T))) return false;
    }
    return true;
  }
  function smooth(pts) {
    if (pts.length < 3) return pts;
    const out = [pts[0]];
    let i = 0;
    while (i < pts.length - 1) {
      let j = pts.length - 1;
      while (j > i + 1 && !clearLine(pts[i][0], pts[i][1], pts[j][0], pts[j][1])) j--;
      out.push(pts[j]); i = j;
    }
    return out;
  }
  function walkToPoint(x, y, onArrive) {
    const sx = Math.floor(player.x / T), sy = Math.floor((player.y - 2) / T);
    const gx = Math.floor(x / T), gy = Math.floor((y - 2) / T);
    let p = astar(sx, sy, gx, gy);
    if (!p) { F.audio.play("nope"); return false; }
    if (!isBlocked(gx, gy)) { p.pop(); p.push([x, y]); }
    p = smooth([[player.x, player.y], ...p]).slice(1);
    player.path = p;
    player.onArrive = onArrive || null;
    if (!firstMoveDone) { firstMoveDone = true; F.store.set("moved", true); }
    return true;
  }

  world.walkTo = function (id) {
    const h = hotspots.find((x) => x.id === id);
    if (!h) return;
    if (Math.hypot(player.x - h.ix, player.y - h.iy) < 6) { arrive(h); return; }
    F.audio.play("click");
    walkToPoint(h.ix, h.iy, () => arrive(h));
  };
  function arrive(h) {
    player.dir = h.face === "right" ? "right" : h.face;
    player.frame = 0;
    if (world.onEnter) world.onEnter(h.id);
  }
  world.teleport = function (id) {
    const h = hotspots.find((x) => x.id === id);
    if (!h) return;
    player.x = h.ix; player.y = h.iy; player.path = []; player.dir = h.face; player.onArrive = null;
    snapCamera();
  };

  /* ---------------- input ---------------- */
  function toWorld(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    return [(clientX - r.left) / scale + cam.x - offX, (clientY - r.top) / scale + cam.y - offY];
  }
  function hotAt(wx, wy) {
    let best = null;
    hotspots.forEach((h) => {
      const o = h.o;
      const inRect = (x, y, w, hh) => wx >= x && wx < x + w && wy >= y && wy < y + hh;
      if (inRect(o.x, o.y, o.w, o.h) || (h.extraRect && inRect(...h.extraRect))) { if (!best || o.base > best.o.base) best = h; }
    });
    return best;
  }
  function onPointerDown(e) {
    if (paused) return;
    F.audio.unlock();
    const [wx, wy] = toWorld(e.clientX, e.clientY);
    // acorns
    for (const a of worldAcorns) if (Math.abs(wx - a.x) < 10 && Math.abs(wy - (a.y - 5)) < 10) { walkToPoint(a.x, a.y + 2, null); return; }
    // critters
    for (const c of critters) {
      if (c.kind === "cat" && wx > c.x - 2 && wx < c.x + 18 && wy > c.y - 12 && wy < c.y + 2) { c.heart = 1.4; F.audio.play("meow"); return; }
      if (c.kind === "chicken" && Math.abs(wx - c.x) < 8 && wy > c.y - 11 && wy < c.y + 2) { c.flee = 1; c.tx = F.clamp(c.x + (Math.random() - 0.5) * 80, c.area[0], c.area[2]); c.ty = F.clamp(c.y + (Math.random() - 0.5) * 30, c.area[1], c.area[3]); F.audio.play("cluck"); return; }
    }
    const h = hotAt(wx, wy);
    if (h) { world.walkTo(h.id); return; }
    const tx = Math.floor(wx / T), ty = Math.floor(wy / T);
    if (map[ty] && map[ty][tx] === "w") { ripples.push({ x: wx, y: wy, t: 0 }); F.audio.play("splash"); return; }
    const crop = objects.find((o) => o.crop && wx >= o.x && wx < o.x + 16 && wy >= o.y && wy < o.y + 16);
    if (crop) { crop.bounce = 0.35; F.audio.play("pop"); for (let i = 0; i < 5; i++) particles.push({ x: wx, y: wy, vx: (Math.random() - 0.5) * 40, vy: -30 - Math.random() * 30, life: 0.7, col: S.key === "fall" ? "#e07b28" : "#6dbb4f", g: 90, s: 1 }); return; }
    if (walkToPoint(wx, wy)) clickMark = { x: wx, y: wy, t: 0 };
  }
  function onPointerMove(e) {
    if (paused) return;
    const [wx, wy] = toWorld(e.clientX, e.clientY);
    const h = hotAt(wx, wy);
    const id = h ? h.id : null;
    let pointer = !!h;
    if (!pointer) {
      for (const c of critters) if ((c.kind === "cat" && wx > c.x - 2 && wx < c.x + 18 && wy > c.y - 12 && wy < c.y + 2) || (c.kind === "chicken" && Math.abs(wx - c.x) < 8 && wy > c.y - 11 && wy < c.y + 2)) pointer = true;
      for (const a of worldAcorns) if (Math.abs(wx - a.x) < 10 && Math.abs(wy - (a.y - 5)) < 10) pointer = true;
    }
    canvas.style.cursor = pointer ? "pointer" : "default";
    if (id !== hoverId) {
      if (hoverId) { const o = hotspots.find((x) => x.id === hoverId); o && o.el && o.el.classList.remove("hl"); }
      hoverId = id;
      if (h && h.el) { h.el.classList.add("hl"); F.audio.play("hover"); }
    }
  }
  const KEYMAP = { ArrowUp: "u", KeyW: "u", ArrowDown: "d", KeyS: "d", ArrowLeft: "l", KeyA: "l", ArrowRight: "r", KeyD: "r" };
  function onKeyDown(e) {
    if (paused || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    const k = KEYMAP[e.code];
    if (k) { keys.add(k); player.path = []; player.onArrive = null; e.preventDefault(); if (!firstMoveDone) { firstMoveDone = true; F.store.set("moved", true); } return; }
    if ((e.code === "KeyE" || e.code === "Enter" || e.code === "Space") && nearId) { e.preventDefault(); const h = hotspots.find((x) => x.id === nearId); arrive(h); }
  }
  function onKeyUp(e) { const k = KEYMAP[e.code]; if (k) keys.delete(k); }

  /* ---------------- update ---------------- */
  function canStand(x, y) {
    for (const [ox, oy] of [[-5, -1], [5, -1], [-5, -5], [5, -5]]) if (isBlocked(Math.floor((x + ox) / T), Math.floor((y + oy) / T))) return false;
    return x > 8 && x < WPX - 8 && y > 8 && y < HPX - 2;
  }
  function update(dt) {
    time += dt;
    const SPEED = 74;
    let vx = 0, vy = 0;
    if (keys.size) {
      if (keys.has("l")) vx -= 1; if (keys.has("r")) vx += 1; if (keys.has("u")) vy -= 1; if (keys.has("d")) vy += 1;
      const n = Math.hypot(vx, vy) || 1; vx = (vx / n) * SPEED * dt; vy = (vy / n) * SPEED * dt;
      if (canStand(player.x + vx, player.y)) player.x += vx; else vx = 0;
      if (canStand(player.x, player.y + vy)) player.y += vy; else vy = 0;
    } else if (player.path.length) {
      const [tx, ty] = player.path[0];
      const dx = tx - player.x, dy = ty - player.y, d = Math.hypot(dx, dy);
      const stepLen = SPEED * dt;
      if (d <= stepLen) { player.x = tx; player.y = ty; player.path.shift(); vx = dx; vy = dy; if (!player.path.length && player.onArrive) { const cb = player.onArrive; player.onArrive = null; cb(); } }
      else { vx = (dx / d) * stepLen; vy = (dy / d) * stepLen; player.x += vx; player.y += vy; }
    }
    const moved = Math.hypot(vx, vy);
    player.moving = moved > 0.01;
    if (player.moving) {
      if (Math.abs(vx) > Math.abs(vy) * 0.9) player.dir = vx > 0 ? "right" : "left"; else player.dir = vy > 0 ? "down" : "up";
      player.dist += moved;
      player.frame = Math.floor(player.dist / 7) % 4;
      player.stepAcc += moved;
      if (player.stepAcc > 14) { player.stepAcc = 0; F.audio.play("step"); }
    } else player.frame = 0;

    // acorns pickup
    for (let i = worldAcorns.length - 1; i >= 0; i--) {
      const a = worldAcorns[i];
      if (Math.abs(player.x - a.x) < 9 && Math.abs(player.y - a.y) < 9) {
        worldAcorns.splice(i, 1);
        for (let k = 0; k < 14; k++) particles.push({ x: a.x, y: a.y - 6, vx: (Math.random() - 0.5) * 70, vy: -Math.random() * 70, life: 0.8, col: k % 2 ? "#f2c14e" : "#fff1a8", g: 60, s: 1 });
        F.acorns.collect(a.id);
      }
    }

    // proximity prompt
    nearId = null;
    if (!player.moving) {
      let bd = 22;
      hotspots.forEach((h) => { const d = Math.hypot(player.x - h.ix, player.y - h.iy); if (d < bd) { bd = d; nearId = h.id; } });
    }

    // critters
    critters.forEach((c) => {
      if (c.kind === "chicken") {
        c.wait -= dt;
        const dx = c.tx - c.x, dy = c.ty - c.y, d = Math.hypot(dx, dy);
        const sp = c.flee ? 60 : 14;
        if (d > 1) { c.x += (dx / d) * Math.min(d, sp * dt); c.y += (dy / d) * Math.min(d, sp * dt); c.dir = dx > 0 ? 1 : -1; c.walk = (c.walk || 0) + dt; }
        else if (c.wait <= 0) {
          c.flee = 0;
          if (Math.random() < 0.5) { c.peck = 0.6; c.wait = 1 + Math.random() * 2; }
          else { c.tx = F.clamp(c.x + (Math.random() - 0.5) * 60, c.area[0], c.area[2]); c.ty = F.clamp(c.y + (Math.random() - 0.5) * 24, c.area[1], c.area[3]); c.wait = 1 + Math.random() * 3; }
        }
        if (c.peck > 0) c.peck -= dt;
      } else if (c.kind === "cat") {
        if (c.heart > 0) c.heart -= dt;
      } else if (c.kind === "butterfly") {
        c.t += dt;
        c.x += Math.sin(c.t * 0.7) * 18 * dt + Math.cos(c.t * 2.1) * 10 * dt;
        c.y += Math.cos(c.t * 0.9) * 12 * dt + Math.sin(c.t * 2.7) * 8 * dt;
        c.x = F.clamp(c.x, 40, WPX - 40); c.y = F.clamp(c.y, 60, HPX - 80);
      }
    });

    // chimney smoke
    if (world.chimney && Math.random() < dt * 2.2) smoke.push({ x: world.chimney[0] + (Math.random() - 0.5) * 3, y: world.chimney[1], life: 2.8, r: 1 });
    smoke.forEach((s) => { s.y -= 9 * dt; s.x += Math.sin((s.life + s.x) * 2) * 3 * dt + 3 * dt; s.life -= dt; s.r += dt * 0.9; });
    smoke = smoke.filter((s) => s.life > 0);

    // seasonal particles in view
    const want = F.reduced ? 0 : S.key === "winter" ? 70 : S.key === "fall" ? 22 : S.key === "spring" ? 18 : 0;
    const seasonal = particles.filter((p) => p.season);
    if (seasonal.length < want && Math.random() < 0.5) {
      const x = cam.x - offX + Math.random() * (vw + 40) - 20, y = cam.y - offY - 6;
      if (S.key === "winter") particles.push({ season: 1, x, y: y + Math.random() * vh * (seasonal.length < 30 ? 1 : 0), vx: -4 + Math.random() * 3, vy: 14 + Math.random() * 12, col: "#ffffff", s: Math.random() < 0.2 ? 2 : 1, life: 30 });
      else if (S.key === "fall") particles.push({ season: 1, x, y, vx: 10 + Math.random() * 8, vy: 14 + Math.random() * 8, col: S.leaves[(Math.random() * 3) | 0][0], s: 2, life: 30, wob: Math.random() * 6 });
      else particles.push({ season: 1, x, y, vx: 12 + Math.random() * 6, vy: 10 + Math.random() * 6, col: Math.random() < 0.6 ? "#f7b6cf" : "#ffffff", s: 2, life: 30, wob: Math.random() * 6 });
    }
    particles.forEach((p) => {
      p.life -= dt;
      if (p.g) p.vy += p.g * dt;
      p.x += (p.vx + (p.wob != null ? Math.sin(time * 2 + p.wob) * 8 : 0)) * dt;
      p.y += p.vy * dt;
      if (p.season && p.y > cam.y - offY + vh + 10) p.life = 0;
    });
    particles = particles.filter((p) => p.life > 0);
    ripples.forEach((r) => (r.t += dt)); ripples = ripples.filter((r) => r.t < 1);
    if (Math.random() < dt * 0.12 && waterPx.length) { const w = waterPx[(Math.random() * waterPx.length) | 0]; ripples.push({ x: w[0], y: w[1], t: 0, fish: true }); }
    objects.forEach((o) => { if (o.bounce > 0) o.bounce -= dt; });
    if (clickMark) { clickMark.t += dt; if (clickMark.t > 0.6) clickMark = null; }

    // camera
    const tx = vw >= WPX ? -(vw - WPX) / 2 : F.clamp(player.x - vw / 2, 0, WPX - vw);
    const ty = vh >= HPX ? -(vh - HPX) / 2 : F.clamp(player.y - 8 - vh / 2, 0, HPX - vh);
    const k = Math.min(1, dt * 7);
    cam.x += (tx - cam.x) * k; cam.y += (ty - cam.y) * k;
  }
  function snapCamera() {
    cam.x = vw >= WPX ? -(vw - WPX) / 2 : F.clamp(player.x - vw / 2, 0, WPX - vw);
    cam.y = vh >= HPX ? -(vh - HPX) / 2 : F.clamp(player.y - 8 - vh / 2, 0, HPX - vh);
  }

  /* ---------------- time of day ---------------- */
  const PHASES = [[0, "#33407e", 0.66], [5, "#33407e", 0.66], [6.3, "#ff9f7a", 0.3], [7.6, "#ffffff", 0], [17, "#ffffff", 0], [18.3, "#ffad66", 0.2], [19.4, "#a06aa8", 0.38], [20.6, "#33407e", 0.62], [24, "#33407e", 0.66]];
  world.hours = function () {
    const m = F.state.timeMode;
    if (m === "day") return 12;
    if (m === "sunset") return 18.9;
    if (m === "night") return 22;
    const d = new Date();
    return d.getHours() + d.getMinutes() / 60;
  };
  world.light = function (hrs = world.hours()) {
    let i = 0;
    while (i < PHASES.length - 1 && PHASES[i + 1][0] <= hrs) i++;
    const a = PHASES[i], b = PHASES[Math.min(i + 1, PHASES.length - 1)];
    const t = b[0] === a[0] ? 0 : (hrs - a[0]) / (b[0] - a[0]);
    const col = F.mix(a[1], b[1], t), str = F.lerp(a[2], b[2], t);
    const night = F.clamp((str - 0.3) / 0.35, 0, 1) * (col === "#ffffff" ? 0 : 1);
    return { col, str, night };
  };

  /* ---------------- render ---------------- */
  function draw() {
    const c = ctx;
    c.globalCompositeOperation = "source-over";
    c.fillStyle = S.snow ? "#9fb7a8" : "#2f5228";
    c.fillRect(0, 0, vw, vh);
    offX = 0; offY = 0;
    const ox = Math.round(-cam.x), oy = Math.round(-cam.y);
    c.drawImage(ground, ox, oy);

    // water shimmer
    c.fillStyle = S.waterL;
    const ph = Math.floor(time * 3);
    waterPx.forEach(([x, y, s]) => { if ((ph + s) % 10 < 2) c.fillRect(x + ox, y + oy, 2, 1); });
    ripples.forEach((r) => {
      const rr = 2 + r.t * 9;
      c.strokeStyle = `rgba(255,255,255,${0.7 * (1 - r.t)})`; c.lineWidth = 1;
      c.beginPath(); c.ellipse(Math.round(r.x + ox) + 0.5, Math.round(r.y + oy) + 0.5, rr, rr * 0.45, 0, 0, Math.PI * 2); c.stroke();
      if (r.fish && r.t < 0.5) { const fy = r.y + oy - Math.sin(r.t * Math.PI * 2) * 7; c.fillStyle = "#e9873b"; c.fillRect(Math.round(r.x + ox - 2 + r.t * 8), Math.round(fy), 4, 2); c.fillStyle = S.waterL; }
    });

    // shadows
    c.fillStyle = "rgba(20,30,10,0.22)";
    const shadow = (x, y, w) => { c.beginPath(); c.ellipse(Math.round(x + ox), Math.round(y + oy), w, w * 0.35, 0, 0, Math.PI * 2); c.fill(); };
    shadow(player.x, player.y - 1, 6);
    critters.forEach((cr) => { if (cr.kind === "chicken") shadow(cr.x, cr.y, 4); });
    objects.forEach((o) => { if (o.tree) shadow(o.x + o.w / 2, o.base - 2, o.w * 0.32); });

    // flat things (lily pads)
    objects.forEach((o) => { if (o.flat) c.drawImage(o.img, Math.round(o.x + ox), Math.round(o.y + oy)); });

    // sorted drawables
    const list = [];
    const vx0 = -ox - 60, vx1 = -ox + vw + 60, vy0 = -oy - 80, vy1 = -oy + vh + 80;
    objects.forEach((o) => { if (!o.flat && o.x + o.w > vx0 && o.x < vx1 && o.y + o.h > vy0 && o.y < vy1) list.push([o.base, o]); });
    list.push([player.y, { player: true }]);
    critters.forEach((cr) => list.push([cr.kind === "butterfly" ? cr.y + 30 : cr.y, { critter: cr }]));
    worldAcorns.forEach((a) => list.push([a.y, { acorn: a }]));
    list.sort((a, b) => a[0] - b[0]);
    const fr = A.farmer();
    for (const [, d] of list) {
      if (d.player) {
        const img = fr[player.dir][player.frame];
        c.drawImage(img, Math.round(player.x - 8 + ox), Math.round(player.y - 24 + oy));
      } else if (d.critter) {
        const cr = d.critter;
        if (cr.kind === "chicken") {
          const f = cr.peck > 0 ? 1 : 0;
          const img = (cr.dir > 0 ? cr.fr.right : cr.fr.left)[f];
          const hop = cr.flee ? Math.abs(Math.sin(time * 18)) * 2 : 0;
          c.drawImage(img, Math.round(cr.x - 6 + ox), Math.round(cr.y - 10 - hop + oy));
        } else if (cr.kind === "cat") {
          c.drawImage(cr.fr[Math.floor(time * 0.8) % 2], Math.round(cr.x + ox), Math.round(cr.y - 11 + oy));
          if (cr.heart > 0) { const hy = cr.y - 16 - (1.4 - cr.heart) * 10; c.globalAlpha = Math.min(1, cr.heart); drawHeart(c, Math.round(cr.x + 5 + ox), Math.round(hy + oy)); c.globalAlpha = 1; }
          else if (Math.floor(time) % 4 < 2) { c.fillStyle = "#ffffff"; c.fillRect(Math.round(cr.x + 14 + ox + (time % 2) * 2), Math.round(cr.y - 16 - (time % 2) * 3 + oy), 3, 1); }
        } else if (cr.kind === "butterfly") {
          c.drawImage(cr.fr[Math.floor(time * 8) % 2], Math.round(cr.x + ox), Math.round(cr.y + oy));
        }
      } else if (d.acorn) {
        const a = d.acorn, bob = Math.round(Math.sin(time * 3) * 1.5);
        c.drawImage(a.img, Math.round(a.x - 4 + ox), Math.round(a.y - 11 + bob + oy));
        const g = (time * 1.3) % 2.5;
        if (g < 0.35) { c.fillStyle = "#ffffff"; const s = g < 0.17 ? 1 : 2; c.fillRect(Math.round(a.x + 3 + ox), Math.round(a.y - 12 + oy) - s, 1, s * 2 + 1); c.fillRect(Math.round(a.x + 3 + ox) - s, Math.round(a.y - 12 + oy), s * 2 + 1, 1); }
      } else {
        let img = d.img;
        let yb = 0;
        if (d.pony) img = world.ponyFrames[0];
        if (d.bounce > 0) yb = -Math.round(Math.sin(d.bounce * 9) * 2);
        c.drawImage(img, Math.round(d.x + ox), Math.round(d.y + oy + yb));
        if (d.pony) { // tail swish
          const sw = Math.floor(time * 1.5) % 3 === 0 ? 1 : 0;
          if (sw) { c.fillStyle = "#3b2414"; c.fillRect(Math.round(d.x + ox), Math.round(d.y + oy + 14), 2, 6); }
        }
      }
    }

    // smoke
    smoke.forEach((s) => { c.fillStyle = `rgba(235,235,235,${Math.min(0.8, s.life / 2.8)})`; const r = Math.round(s.r); c.fillRect(Math.round(s.x + ox - r / 2), Math.round(s.y + oy - r / 2), r + 1, r + 1); });

    // particles
    particles.forEach((p) => { c.fillStyle = p.col; c.fillRect(Math.round(p.x + ox), Math.round(p.y + oy), p.s || 1, p.s === 2 ? 1 + (Math.floor(time * 4 + (p.wob || 0)) % 2) : p.s || 1); });

    // click marker
    if (clickMark) {
      const t = clickMark.t, r = 2 + t * 6;
      c.fillStyle = `rgba(255,255,255,${1 - t / 0.6})`;
      const x = Math.round(clickMark.x + ox), y = Math.round(clickMark.y + oy);
      c.fillRect(x - r, y, 2, 1); c.fillRect(x + r - 1, y, 2, 1); c.fillRect(x, y - (r >> 1), 1, 2); c.fillRect(x, y + (r >> 1) - 1, 1, 2);
    }

    // lighting
    const L = world.light();
    if (L.str > 0.01) {
      c.globalCompositeOperation = "multiply";
      c.fillStyle = F.mix("#ffffff", L.col, L.str);
      c.fillRect(0, 0, vw, vh);
      c.globalCompositeOperation = "source-over";
    }
    if (L.night > 0.05) {
      c.globalCompositeOperation = "lighter";
      objects.forEach((o) => o.lights.forEach(([lx, ly, lr]) => {
        const x = o.x + lx + ox, y = o.y + ly + oy;
        if (x < -40 || y < -40 || x > vw + 40 || y > vh + 40) return;
        const g = c.createRadialGradient(x, y, 1, x, y, lr);
        g.addColorStop(0, `rgba(255,200,110,${0.55 * L.night})`); g.addColorStop(1, "rgba(255,180,90,0)");
        c.fillStyle = g; c.fillRect(x - lr, y - lr, lr * 2, lr * 2);
      }));
      // fireflies
      if (!S.snow) for (let i = 0; i < 14; i++) {
        const fx = ((i * 97 + Math.sin(time * 0.4 + i) * 40) % WPX + WPX) % WPX + ox, fy = ((i * 61 + 120 + Math.cos(time * 0.5 + i * 2) * 30) % (HPX - 120)) + 60 + oy;
        const a = (Math.sin(time * 2 + i * 1.7) + 1) / 2;
        c.fillStyle = `rgba(255,240,140,${a * L.night})`; c.fillRect(Math.round(fx), Math.round(fy), 1, 1);
        c.fillStyle = `rgba(255,240,140,${a * 0.25 * L.night})`; c.fillRect(Math.round(fx) - 1, Math.round(fy) - 1, 3, 3);
      }
      c.globalCompositeOperation = "source-over";
    }
    // soft vignette
    updateLabels(ox, oy);
  }
  function drawHeart(c, x, y) {
    c.fillStyle = "#e2333f";
    c.fillRect(x, y + 1, 2, 2); c.fillRect(x + 3, y + 1, 2, 2); c.fillRect(x + 1, y, 1, 1); c.fillRect(x + 4, y, 1, 1); c.fillRect(x, y + 1, 5, 2); c.fillRect(x + 1, y + 3, 3, 1); c.fillRect(x + 2, y + 4, 1, 1);
  }

  function updateLabels(ox, oy) {
    if (!labelsEl) return;
    const night = world.light().night;
    labelsEl.classList.toggle("night", night > 0.5);
    hotspots.forEach((h) => {
      if (!h.el) return;
      const o = h.o;
      let ax = o.x + o.w / 2, ay = o.y + 2;
      if (h.id === "experience") { ax = o.x + 40; ay = o.y + 4; }
      if (h.id === "contact") ay = o.y - 2;
      h.el.style.transform = `translate(${Math.round((ax + ox) * scale)}px, ${Math.round((ay + oy) * scale)}px) translate(-50%, -100%)`;
      h.el.classList.toggle("near", nearId === h.id);
    });
    if (promptEl) {
      if (nearId && !paused) {
        const h = hotspots.find((x) => x.id === nearId);
        promptEl.hidden = false;
        promptEl.innerHTML = `<kbd>E</kbd> Open <b>${F.esc(h.label)}</b>`;
        promptEl.style.transform = `translate(${Math.round((player.x + ox) * scale)}px, ${Math.round((player.y - 30 + oy) * scale)}px) translate(-50%, -100%)`;
      } else promptEl.hidden = true;
    }
  }

  /* ---------------- loop & sizing ---------------- */
  function resize() {
    const cw = window.innerWidth, ch = window.innerHeight;
    scale = F.clamp(Math.round(Math.min(cw / 440, ch / 290)), 2, 6);
    if (cw < 700) scale = cw < 380 ? 2 : Math.max(2, Math.min(scale, 3));
    vw = Math.ceil(cw / scale); vh = Math.ceil(ch / scale);
    canvas.width = vw; canvas.height = vh;
    canvas.style.width = vw * scale + "px"; canvas.style.height = vh * scale + "px";
    ctx.imageSmoothingEnabled = false;
    snapCamera();
    if (!running && ground) draw();
  }
  function loop(t) {
    if (!running) return;
    requestAnimationFrame(loop);
    const dt = Math.min(0.05, (t - lastT) / 1000 || 0);
    lastT = t;
    if (paused) return;
    update(dt);
    draw();
  }

  world.init = function (cv, labels) {
    canvas = cv; ctx = cv.getContext("2d"); labelsEl = labels;
    build();
    player.x = 168; player.y = 9 * T + 6; player.dir = "down";
    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", () => keys.clear());
  };
  world.start = function () {
    if (running) return;
    running = true; lastT = performance.now();
    requestAnimationFrame(loop);
  };
  world.setPaused = function (p) {
    paused = p;
    keys.clear();
    if (p) { player.path = []; player.onArrive = null; if (promptEl) promptEl.hidden = true; }
    document.body.classList.toggle("world-paused", p);
  };
  world.rebuild = function () { build(); snapCamera(); draw(); };
  world.walkToAcorn = function (id) {
    const a = worldAcorns.find((x) => x.id === id);
    if (a) walkToPoint(a.x, a.y + 2, null);
  };
  world.removeAcorn = function (id) { worldAcorns = worldAcorns.filter((a) => a.id !== id); };
  world.hotspots = () => hotspots;
  world.firstMoveDone = () => firstMoveDone;
  world.T = T;
})();
