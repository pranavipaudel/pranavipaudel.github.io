/* =====================================================================
   TITLE SCREEN — a living pixel landscape behind the wooden sign.
   Matches the visitor's real time of day and season.
   ===================================================================== */
(function () {
  const F = window.FARM, A = F.art;
  const T = (F.title = {});
  let cv, c, s = 3, W = 0, H = 0, running = false, last = 0, t = 0;
  let S, trees = [], clouds = [], birds = [], flakes = [], stars = [];

  function phase() {
    const h = F.world.hours();
    if (h >= 20.5 || h < 5.5) return "night";
    if (h < 7.5) return "dawn";
    if (h >= 17.8) return "dusk";
    return "day";
  }
  const SKY = {
    day: ["#5fb8ee", "#bfe8fb", "#e8f7ff"], dawn: ["#7f8fd6", "#ffb38a", "#ffe2b8"], dusk: ["#6a5fae", "#ff9f7a", "#ffd9a0"], night: ["#0b1233", "#1d2456", "#3a3470"]
  };

  function size() {
    const w = innerWidth, h = innerHeight;
    s = F.clamp(Math.round(Math.min(w / 380, h / 250)), 2, 6);
    W = Math.ceil(w / s); H = Math.ceil(h / s);
    cv.width = W; cv.height = H; cv.style.width = W * s + "px"; cv.style.height = H * s + "px";
    c.imageSmoothingEnabled = false;
    const rnd = F.rng(5);
    trees = [];
    for (let x = -10; x < W + 20; x += 14 + ((rnd() * 22) | 0)) {
      const pine = rnd() < 0.35, v = (rnd() * 3) | 0;
      trees.push({ x, y: hillY(x, 1) + 2 + ((rnd() * 4) | 0), img: (pine ? A.pine(S, v) : A.tree(S, v)).cv });
    }
    clouds = Array.from({ length: 6 }, (_, i) => ({ x: rnd() * W, y: 8 + rnd() * H * 0.25, w: 20 + rnd() * 30, sp: 2 + rnd() * 3 }));
    stars = Array.from({ length: Math.round((W * H) / 300) }, () => ({ x: (rnd() * W) | 0, y: (rnd() * H * 0.6) | 0, p: rnd() * 6 }));
    flakes = Array.from({ length: S.key === "winter" ? 90 : S.key === "fall" ? 26 : S.key === "spring" ? 22 : 0 }, () => ({ x: Math.random() * W, y: Math.random() * H, v: 0.5 + Math.random() }));
  }
  const ridge = (x) => H * 0.5 - (Math.abs(((x * 0.9) % 70) - 35) * 0.9 + Math.sin(x / 23) * 6 + Math.sin(x / 9) * 2 + Math.abs(Math.sin(x / 61)) * 22);
  function hillY(x, layer) {
    if (layer === 0) return H * 0.62 + Math.sin(x / 47) * 8 + Math.sin(x / 19) * 3;
    return H * 0.74 + Math.sin(x / 33 + 2) * 6 + Math.sin(x / 11) * 2;
  }

  function draw() {
    const ph = phase(), sky = SKY[ph], night = ph === "night";
    const g = c.createLinearGradient(0, 0, 0, H * 0.7);
    g.addColorStop(0, sky[0]); g.addColorStop(0.6, sky[1]); g.addColorStop(1, sky[2]);
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    if (night) stars.forEach((st) => { c.fillStyle = `rgba(255,255,240,${0.4 + 0.5 * Math.sin(t * 1.5 + st.p)})`; c.fillRect(st.x, st.y, 1, 1); });
    // sun / moon
    const h = F.world.hours();
    const sunK = F.clamp((h - 6) / 13, 0, 1);
    const bodyX = Math.round(W * (0.15 + 0.7 * (night ? ((h + 6) % 24) / 12 : sunK)));
    const bodyY = Math.round(H * 0.42 - Math.sin((night ? ((h + 6) % 24) / 12 : sunK) * Math.PI) * H * 0.3);
    if (night) { A.disc(c, bodyX, bodyY, 7, "#fff6c9"); A.disc(c, bodyX + 4, bodyY - 2, 6, sky[0]); }
    else { A.disc(c, bodyX, bodyY, 12, "rgba(255,240,170,.35)"); A.disc(c, bodyX, bodyY, 9, ph === "day" ? "#fff3a6" : "#ffd27a"); }
    // clouds
    if (!night) clouds.forEach((cl) => {
      const x = Math.round(((cl.x + t * cl.sp) % (W + 80)) - 40), y = Math.round(cl.y);
      c.fillStyle = ph === "day" ? "rgba(255,255,255,.95)" : "rgba(255,226,210,.9)";
      c.fillRect(x, y, Math.round(cl.w), 5); c.fillRect(x + 5, y - 4, Math.round(cl.w * 0.55), 4); c.fillRect(x + 12, y - 7, Math.round(cl.w * 0.3), 3);
      c.fillStyle = "rgba(160,190,220,.35)"; c.fillRect(x, y + 4, Math.round(cl.w), 1);
    });
    // mountains (snowy peaks)
    const mcol = night ? "#2a3166" : ph === "day" ? "#93aecb" : "#a98aa8";
    for (let x = 0; x < W; x++) {
      const top = Math.round(ridge(x + 13));
      c.fillStyle = mcol; c.fillRect(x, top, 1, H - top);
      c.fillStyle = night ? "#c9d2f0" : "#ffffff";
      const snow = Math.max(0, Math.round((H * 0.5 - 30 - top) * 0.6));
      if (snow) c.fillRect(x, top, 1, Math.min(snow + 2, 12));
    }
    // far hill
    const hc = night ? "#22305a" : F.mix(S.hill, mcol, 0.25);
    for (let x = 0; x < W; x++) { const y = Math.round(hillY(x, 0)); c.fillStyle = hc; c.fillRect(x, y, 1, H - y); }
    // tiny farm on the hill
    const fx = Math.round(W * 0.68), fy = Math.round(hillY(fx, 0));
    const R = A.R;
    R(c, fx - 9, fy - 9, 18, 9, night ? "#1a2347" : "#cf9a5f"); for (let i = 0; i < 6; i++) R(c, fx - 11 + i, fy - 10 - i, 22 - i * 2, 1, night ? "#151c3a" : "#c95a3b");
    R(c, fx + 2, fy - 6, 3, 3, night ? "#ffcf6e" : "#86c7e6"); R(c, fx - 5, fy - 6, 3, 3, night ? "#ffcf6e" : "#86c7e6");
    const bx = fx + 22, by = Math.round(hillY(bx, 0));
    R(c, bx - 10, by - 11, 20, 11, night ? "#1a2347" : "#c2402f"); for (let i = 0; i < 6; i++) R(c, bx - 11 + i, by - 12 - i, 22 - i * 2, 1, night ? "#151c3a" : "#6a5a55");
    R(c, bx - 3, by - 7, 6, 7, night ? "#ffcf6e" : "#f1ead8");
    if (!night) { c.fillStyle = "rgba(240,240,240,.7)"; for (let i = 0; i < 4; i++) c.fillRect(fx + 6 + Math.round(Math.sin(t + i) * 2) + i, fy - 18 - i * 4 - Math.round((t * 6) % 4), 2, 2); }
    // trees
    trees.forEach((tr) => { c.drawImage(tr.img, tr.x, Math.round(tr.y - tr.img.height)); });
    if (night) { c.fillStyle = "rgba(20,26,70,.55)"; c.fillRect(0, 0, W, H); }
    // near hill + fields
    for (let x = 0; x < W; x++) { const y = Math.round(hillY(x, 1)); c.fillStyle = night ? "#1c2a4a" : S.grass; c.fillRect(x, y, 1, H - y); c.fillStyle = night ? "#24345a" : S.grassL; c.fillRect(x, y, 1, 1); }
    const rowsTop = Math.round(H * 0.84);
    for (let y = rowsTop; y < H; y += 6) {
      c.fillStyle = night ? "#2a2236" : S.soil; c.fillRect(0, y, W, 3);
      if (!S.snow) for (let x = ((y / 6) % 2) * 6; x < W; x += 12) { c.fillStyle = night ? "#2b4a3a" : S.key === "fall" ? "#e07b28" : "#4f9a3c"; c.fillRect(x, y - 2, 3, 2); c.fillRect(x + 1, y - 3, 1, 1); }
    }
    // fence
    for (let x = 0; x < W; x += 14) { c.fillStyle = night ? "#3a2f4a" : "#8a5a2b"; c.fillRect(x, rowsTop - 10, 2, 9); }
    c.fillStyle = night ? "#4a3b5a" : "#c99459"; c.fillRect(0, rowsTop - 8, W, 1); c.fillRect(0, rowsTop - 4, W, 1);
    // fireflies / birds
    if (night) for (let i = 0; i < 18; i++) { const a = (Math.sin(t * 2 + i * 1.3) + 1) / 2; c.fillStyle = `rgba(255,240,140,${a})`; c.fillRect(Math.round((i * 53 + Math.sin(t * 0.4 + i) * 20) % W), Math.round(H * 0.7 + (i % 5) * 9 + Math.sin(t + i) * 4), 1, 1); }
    else birds.forEach((b) => { const wing = Math.floor(t * 6 + b.p) % 2; c.fillStyle = "#3b3550"; c.fillRect(Math.round(b.x), Math.round(b.y), 1, 1); c.fillRect(Math.round(b.x) - 2, Math.round(b.y) - wing, 2, 1); c.fillRect(Math.round(b.x) + 1, Math.round(b.y) - wing, 2, 1); });
    // weather
    flakes.forEach((f, i) => {
      c.fillStyle = S.key === "winter" ? "#ffffff" : S.key === "fall" ? ["#e07b28", "#c9472e", "#e8b13c"][i % 3] : i % 2 ? "#f7b6cf" : "#ffffff";
      c.fillRect(Math.round(f.x), Math.round(f.y), S.key === "winter" ? 1 : 2, 1 + (Math.floor(t * 3 + i) % 2));
    });
  }
  function update(dt) {
    t += dt;
    if (Math.random() < dt * 0.25 && birds.length < 6) { const y = H * (0.12 + Math.random() * 0.2); for (let i = 0; i < 3; i++) birds.push({ x: -10 - i * 7, y: y + i * 3, p: Math.random() * 6, v: 14 + Math.random() * 4 }); }
    birds.forEach((b) => (b.x += b.v * dt)); birds = birds.filter((b) => b.x < W + 10);
    flakes.forEach((f) => {
      if (S.key === "winter") { f.y += 12 * f.v * dt; f.x += Math.sin(t + f.v * 9) * 4 * dt; }
      else { f.y += 9 * f.v * dt; f.x += (10 + Math.sin(t * 2 + f.v * 9) * 8) * dt; }
      if (f.y > H) { f.y = -2; f.x = Math.random() * W; } if (f.x > W) f.x = 0;
    });
  }
  function loop(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    update(dt); draw();
    requestAnimationFrame(loop);
  }
  T.start = function (canvas) {
    cv = canvas; c = cv.getContext("2d");
    S = F.world.season();
    size();
    window.addEventListener("resize", size);
    running = true; last = performance.now();
    requestAnimationFrame(loop);
  };
  T.stop = function () { running = false; window.removeEventListener("resize", size); };
})();
