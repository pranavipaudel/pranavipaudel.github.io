/* =====================================================================
   PIXEL ART — every sprite on the farm is drawn here with code.
   Each function returns a small canvas that the world scales up 2–5×.
   ===================================================================== */
(function () {
  const F = window.FARM;
  const A = (F.art = {});

  A.mk = function (w, h) {
    const cv = document.createElement("canvas");
    cv.width = w; cv.height = h;
    const c = cv.getContext("2d");
    c.imageSmoothingEnabled = false;
    return [cv, c];
  };
  const R = (A.R = function (c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(x, y, w, h); });
  const disc = (A.disc = function (c, cx, cy, r, col) {
    for (let y = -r; y <= r; y++) {
      const w = Math.floor(Math.sqrt(r * r - y * y) + 0.35);
      R(c, cx - w, cy + y, w * 2 + 1, 1, col);
    }
  });
  const ellipse = (A.ellipse = function (c, cx, cy, rx, ry, col) {
    for (let y = -ry; y <= ry; y++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))));
      R(c, cx - w, cy + y, w * 2 + 1, 1, col);
    }
  });
  const line = (A.line = function (c, x0, y0, x1, y1, col, t = 1) {
    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), n = Math.max(dx, dy) || 1;
    for (let i = 0; i <= n; i++) {
      const x = Math.round(x0 + ((x1 - x0) * i) / n), y = Math.round(y0 + ((y1 - y0) * i) / n);
      R(c, x, y, t, t, col);
    }
  });

  /* 1-px outline around every opaque pixel (the classic pixel-art edge) */
  A.outline = function (cv, col, skipBottom) {
    const c = cv.getContext("2d");
    const w = cv.width, h = cv.height;
    const d = c.getImageData(0, 0, w, h).data;
    const op = (x, y) => x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 60;
    c.fillStyle = col;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (op(x, y)) continue;
      if (op(x - 1, y) || op(x + 1, y) || op(x, y - 1) || (!skipBottom && op(x, y + 1))) c.fillRect(x, y, 1, 1);
    }
    return cv;
  };
  A.flip = function (cv) {
    const [o, c] = A.mk(cv.width, cv.height);
    c.translate(cv.width, 0); c.scale(-1, 1); c.drawImage(cv, 0, 0);
    return o;
  };

  /* ------------------------------------------------------------------
     SEASON PALETTES
     ------------------------------------------------------------------ */
  A.SEASONS = {
    spring: {
      key: "spring", name: "Spring",
      grass: "#7bc456", grassD: "#61aa45", grassL: "#9bdb6e", tuft: "#4f9439", speck: ["#f7b6cf", "#ffffff", "#fff3a6"],
      path: "#cf9f62", pathD: "#ad7f47", pathL: "#e3bb82", road: "#c0915a", roadD: "#9e7243",
      soil: "#8a5a32", soilD: "#6b4325", soilL: "#a46e40",
      leaves: [["#6dbb4f", "#4f9a3c", "#93d66b"], ["#f3a6c4", "#d6799f", "#fde0ec"]],
      pine: ["#3f8a4a", "#2c6838", "#5aa863"],
      flowers: ["#f7a1c4", "#fff3a6", "#ffffff", "#b9a7ff"], berry: "#f7a1c4",
      water: "#4aa3d8", waterL: "#9ad9f7", waterD: "#2d76ad", sand: "#ead59c", sandD: "#cfb87d",
      cliff: "#a07a55", cliffD: "#7d5c3f", hill: "#86cc5f", snow: false, sky: ["#8fd3f5", "#cdeefa"]
    },
    summer: {
      key: "summer", name: "Summer",
      grass: "#62b448", grassD: "#4a983b", grassL: "#82cd5f", tuft: "#3d8030", speck: ["#ffe066", "#ffffff"],
      path: "#d1a265", pathD: "#ad7f47", pathL: "#e6bf86", road: "#c3945d", roadD: "#a07445",
      soil: "#8a5a32", soilD: "#6b4325", soilL: "#a46e40",
      leaves: [["#4fa03d", "#3a8030", "#70be53"], ["#5aab45", "#43873a", "#80c862"]],
      pine: ["#357d41", "#255f31", "#4c9a57"],
      flowers: ["#ff6b6b", "#ffd23f", "#ffffff", "#6ba8ff"], berry: "#e2333f",
      water: "#3f9ed6", waterL: "#8fd6f7", waterD: "#2a70a8", sand: "#ecd79e", sandD: "#d1b97f",
      cliff: "#a07a55", cliffD: "#7d5c3f", hill: "#6fbf52", snow: false, sky: ["#6cc4f2", "#c4ecfb"]
    },
    fall: {
      key: "fall", name: "Fall",
      grass: "#b3ab4e", grassD: "#958d3b", grassL: "#cdc365", tuft: "#857c33", speck: ["#e07b28", "#c9502e", "#eab04a"],
      path: "#c9985c", pathD: "#a57843", pathL: "#ddb47c", road: "#b98a55", roadD: "#956a3f",
      soil: "#7f5230", soilD: "#613d22", soilL: "#996440",
      leaves: [["#e07b28", "#b4561c", "#f4a64a"], ["#c9472e", "#9b3322", "#e36b4b"], ["#e8b13c", "#bf8a22", "#f7d26b"]],
      pine: ["#3a7a44", "#285c34", "#50935a"],
      flowers: ["#e8a33a", "#c9502e", "#f5d76e", "#9b59b6"], berry: "#c9502e",
      water: "#3e93c9", waterL: "#86c7ea", waterD: "#2a6a9e", sand: "#e3cc95", sandD: "#c8ad75",
      cliff: "#9b7653", cliffD: "#795a3d", hill: "#c0b75a", snow: false, sky: ["#8cc8ec", "#f6dcb0"]
    },
    winter: {
      key: "winter", name: "Winter",
      grass: "#e9f1f7", grassD: "#cbd9e6", grassL: "#ffffff", tuft: "#bfcfdd", speck: ["#d6e3ee"],
      path: "#cbbcab", pathD: "#ad9d8b", pathL: "#e0d6c9", road: "#bfae9b", roadD: "#a08f7c",
      soil: "#d9d6d3", soilD: "#b9b3ad", soilL: "#efefef",
      leaves: null,
      pine: ["#2f6b3f", "#22543a", "#3f7f50"],
      flowers: [], berry: "#d6334a",
      water: "#bfe3f5", waterL: "#eefaff", waterD: "#8ec6e3", sand: "#e7e3da", sandD: "#cfc9bd",
      cliff: "#8f7a68", cliffD: "#6e5c4e", hill: "#f2f7fb", snow: true, sky: ["#a9cde6", "#e8f2fa"]
    }
  };

  const OUT = "#3b2414";

  /* ------------------------------------------------------------------
     GROUND (tile map → one big canvas)
     g grass · h hill-top · p path · r road · s soil · w water · b sand · c cliff · t stairs
     ------------------------------------------------------------------ */
  A.ground = function (map, S, T) {
    const H = map.length, W = map[0].length;
    const [cv, c] = A.mk(W * T, H * T);
    const rnd = F.rng(7);
    const at = (x, y) => (y < 0 || x < 0 || y >= H || x >= W ? "g" : map[y][x]);
    const grassy = (ch) => ch === "g" || ch === "h";

    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const ch = map[y][x], X = x * T, Y = y * T;
      if (ch === "g" || ch === "h") {
        const base = ch === "h" ? S.hill : S.grass;
        R(c, X, Y, T, T, base);
        for (let i = 0; i < 5; i++) R(c, X + ((rnd() * T) | 0), Y + ((rnd() * T) | 0), 1, 1, rnd() < 0.5 ? S.grassD : S.grassL);
        if (rnd() < 0.35) { const tx = X + 2 + ((rnd() * 10) | 0), ty = Y + 4 + ((rnd() * 9) | 0); R(c, tx, ty, 1, 2, S.tuft); R(c, tx + 2, ty, 1, 2, S.tuft); R(c, tx + 1, ty + 1, 1, 2, S.tuft); }
        if (S.speck.length && rnd() < 0.12) R(c, X + ((rnd() * 14) | 0), Y + ((rnd() * 14) | 0), 1, 1, S.speck[(rnd() * S.speck.length) | 0]);
      } else if (ch === "p") {
        R(c, X, Y, T, T, S.path);
        for (let i = 0; i < 6; i++) R(c, X + ((rnd() * T) | 0), Y + ((rnd() * T) | 0), 1, 1, rnd() < 0.6 ? S.pathD : S.pathL);
        if (rnd() < 0.3) { const px = X + ((rnd() * 13) | 0), py = Y + ((rnd() * 13) | 0); R(c, px, py, 2, 2, S.pathL); R(c, px, py + 2, 2, 1, S.pathD); }
      } else if (ch === "r") {
        R(c, X, Y, T, T, S.road);
        for (let i = 0; i < 5; i++) R(c, X + ((rnd() * T) | 0), Y + ((rnd() * T) | 0), 1, 1, rnd() < 0.6 ? S.roadD : S.pathL);
        const top = at(x, y - 1) !== "r";
        R(c, X, Y + (top ? 5 : 10), T, 1, S.roadD);
        if (top) R(c, X, Y + 6, T, 1, F.shade(S.road, 0.08));
      } else if (ch === "s") {
        R(c, X, Y, T, T, S.soil);
        for (let r = 0; r < 4; r++) { R(c, X, Y + r * 4 + 2, T, 1, S.soilD); R(c, X, Y + r * 4, T, 1, S.soilL); }
        for (let i = 0; i < 3; i++) R(c, X + ((rnd() * T) | 0), Y + ((rnd() * T) | 0), 1, 1, S.soilD);
      } else if (ch === "w") {
        R(c, X, Y, T, T, S.water);
        for (let i = 0; i < 3; i++) R(c, X + ((rnd() * 12) | 0), Y + ((rnd() * T) | 0), 3, 1, S.waterL);
      } else if (ch === "b") {
        R(c, X, Y, T, T, S.sand);
        for (let i = 0; i < 6; i++) R(c, X + ((rnd() * T) | 0), Y + ((rnd() * T) | 0), 1, 1, S.sandD);
      } else if (ch === "c") {
        R(c, X, Y, T, T, S.cliff);
        for (let r = 0; r < T; r += 4) R(c, X, Y + r + 1, T, 1, S.cliffD);
        for (let i = 0; i < 4; i++) R(c, X + ((rnd() * 14) | 0), Y + ((rnd() * 14) | 0), 2, 1, F.shade(S.cliff, 0.15));
        if (at(x, y - 1) === "h") { for (let i = 0; i < T; i++) R(c, X + i, Y, 1, 2 + ((rnd() * 2) | 0), S.hill); }
        if (at(x, y + 1) !== "c" && at(x, y + 1) !== "t") R(c, X, Y + T - 1, T, 1, S.cliffD);
      } else if (ch === "t") {
        R(c, X, Y, T, T, S.cliffD);
        for (let r = 0; r < 4; r++) { R(c, X + 1, Y + r * 4, T - 2, 3, "#b88752"); R(c, X + 1, Y + r * 4 + 3, T - 2, 1, "#7a5230"); }
        if (S.snow) for (let r = 0; r < 4; r++) R(c, X + 3, Y + r * 4, T - 6, 1, "#ffffff");
      }
    }
    /* soft edges: grass nibbles onto paths, darker rims on water */
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const ch = map[y][x], X = x * T, Y = y * T;
      if (ch === "p" || ch === "r" || ch === "s") {
        const col = S.grass;
        if (grassy(at(x, y - 1))) for (let i = 0; i < T; i++) if (rnd() < 0.55) R(c, X + i, Y, 1, 1 + (rnd() < 0.3 ? 1 : 0), col);
        if (grassy(at(x, y + 1))) for (let i = 0; i < T; i++) if (rnd() < 0.55) R(c, X + i, Y + T - 1 - (rnd() < 0.3 ? 1 : 0), 1, 2, col);
        if (grassy(at(x - 1, y))) for (let i = 0; i < T; i++) if (rnd() < 0.55) R(c, X, Y + i, 1 + (rnd() < 0.3 ? 1 : 0), 1, col);
        if (grassy(at(x + 1, y))) for (let i = 0; i < T; i++) if (rnd() < 0.55) R(c, X + T - 1 - (rnd() < 0.3 ? 1 : 0), Y + i, 2, 1, col);
      }
      if (ch === "w") {
        if (at(x, y - 1) !== "w") { R(c, X, Y, T, 2, S.waterD); }
        if (at(x - 1, y) !== "w") R(c, X, Y, 1, T, S.waterD);
        if (at(x + 1, y) !== "w") R(c, X + T - 1, Y, 1, T, S.waterD);
        if (at(x, y + 1) !== "w") R(c, X, Y + T - 1, T, 1, S.waterL);
      }
      if (ch === "b") {
        if (grassy(at(x, y - 1))) for (let i = 0; i < T; i++) if (rnd() < 0.6) R(c, X + i, Y, 1, 1 + (rnd() < 0.4 ? 1 : 0), S.grass);
        if (grassy(at(x, y + 1))) for (let i = 0; i < T; i++) if (rnd() < 0.6) R(c, X + i, Y + T - 1, 1, 1, S.grass);
        if (grassy(at(x - 1, y))) for (let i = 0; i < T; i++) if (rnd() < 0.6) R(c, X, Y + i, 1, 1, S.grass);
        if (grassy(at(x + 1, y))) for (let i = 0; i < T; i++) if (rnd() < 0.6) R(c, X + T - 1, Y + i, 1, 1, S.grass);
      }
      if (ch === "g" && at(x, y - 1) === "c") R(c, X, Y, T, 2, "rgba(0,0,0,0.18)");
    }
    return cv;
  };

  /* ------------------------------------------------------------------
     BUILDINGS
     ------------------------------------------------------------------ */
  function snowCap(c, x0, x1, y, rnd) {
    for (let x = x0; x < x1; x++) R(c, x, y, 1, 2 + ((rnd() * 3) | 0), "#ffffff");
  }

  A.farmhouse = function (S) {
    const [cv, c] = A.mk(96, 90);
    const rnd = F.rng(11);
    // chimney
    R(c, 64, 0, 12, 24, OUT); R(c, 65, 1, 10, 23, "#a85040");
    for (let y = 4; y < 24; y += 4) { R(c, 65, y, 10, 1, "#83382b"); R(c, y % 8 ? 69 : 66, y - 3, 1, 3, "#83382b"); }
    R(c, 63, 0, 14, 3, OUT); R(c, 64, 1, 12, 1, "#9a948a");
    // walls
    R(c, 7, 46, 82, 40, OUT); R(c, 8, 46, 80, 39, "#cf9a5f");
    for (let y = 50; y < 84; y += 5) R(c, 8, y, 80, 1, "#ad7a43");
    for (let y = 46, k = 0; y < 84; y += 5, k++) for (let x = 14 + (k % 2) * 12; x < 86; x += 24) R(c, x, y + 1, 1, 4, "#ad7a43");
    R(c, 8, 46, 3, 39, "#a06a35"); R(c, 85, 46, 3, 39, "#a06a35");
    // foundation
    R(c, 6, 84, 84, 6, OUT); R(c, 7, 84, 82, 5, "#91897b"); R(c, 7, 84, 82, 1, "#aaa293");
    for (let x = 9; x < 88; x += 7) R(c, x, 85, 1, 4, "#716a5e");
    // windows
    const win = (x, y) => {
      R(c, x - 4, y, 4, 15, OUT); R(c, x - 3, y + 1, 2, 13, "#4f86c6"); R(c, x + 18, y, 4, 15, OUT); R(c, x + 19, y + 1, 2, 13, "#4f86c6");
      R(c, x, y, 18, 15, OUT); R(c, x + 1, y + 1, 16, 13, "#f3e6c8"); R(c, x + 3, y + 3, 12, 9, "#86c7e6");
      R(c, x + 3, y + 3, 12, 2, "#bfe6f7"); R(c, x + 8, y + 3, 2, 9, "#f3e6c8"); R(c, x + 3, y + 7, 12, 1, "#f3e6c8");
      R(c, x - 1, y + 15, 20, 4, OUT); R(c, x, y + 16, 18, 2, "#9c6b3c");
      if (!S.snow) for (let i = 0; i < 6; i++) { R(c, x + 1 + i * 3, y + 14, 2, 2, "#4f9a3c"); R(c, x + 1 + i * 3, y + 12 + (i % 2), 2, 2, S.flowers[i % S.flowers.length] || "#fff"); }
      else R(c, x, y + 15, 18, 1, "#ffffff");
    };
    win(16, 57); win(62, 57);
    // door
    R(c, 39, 58, 18, 28, OUT); R(c, 40, 59, 16, 27, "#7a4a25"); R(c, 40, 59, 16, 2, "#93592c");
    for (let x = 44; x < 56; x += 4) R(c, x, 61, 1, 24, "#653b1c");
    R(c, 52, 72, 2, 2, "#f2c14e");
    R(c, 36, 86, 24, 4, OUT); R(c, 37, 86, 22, 3, "#a39b88");
    // lantern
    R(c, 32, 61, 5, 7, OUT); R(c, 33, 62, 3, 5, "#ffd36e"); R(c, 34, 59, 1, 2, OUT);
    // roof
    for (let y = 12; y <= 48; y++) {
      const t = (y - 12) / 36, l = Math.round(22 - t * 22), r = Math.round(74 + t * 22);
      R(c, l, y, r - l, 1, ((y - 12) >> 2) & 1 ? "#b84a31" : "#cf5e3d");
      R(c, l, y, 2, 1, OUT); R(c, r - 2, y, 2, 1, OUT);
    }
    for (let y = 14; y < 47; y += 4) {
      const t = (y - 12) / 36, l = Math.round(22 - t * 22) + 3, r = Math.round(74 + t * 22) - 3;
      for (let x = ((y >> 2) & 1) * 4 + 2; x < 96; x += 8) if (x > l && x < r) R(c, x, y, 1, 3, "#9e3d27");
    }
    R(c, 21, 10, 54, 3, OUT); R(c, 22, 11, 52, 1, "#e98463");
    R(c, 0, 47, 96, 3, OUT); R(c, 1, 47, 94, 1, "#e98463");
    R(c, 8, 50, 80, 2, "rgba(0,0,0,0.22)");
    if (S.snow) {
      for (let y = 12; y < 26; y++) { const t = (y - 12) / 36, l = Math.round(22 - t * 22) + 1, r = Math.round(74 + t * 22) - 1; R(c, l, y, r - l, 1, y > 22 ? "#e6f1f8" : "#ffffff"); }
      for (let x = 2; x < 94; x++) if (rnd() < 0.7) R(c, x, 25 + ((x * 7) % 3), 1, 1, "#ffffff");
      for (let x = 4; x < 94; x += 5) R(c, x, 50, 1, 2 + ((rnd() * 3) | 0), "#dff3ff");
      R(c, 63, 0, 14, 2, "#ffffff");
    }
    return { cv, lights: [[25, 64, 18], [71, 64, 18], [34, 64, 12]], smoke: [70, 0] };
  };

  A.barn = function (S) {
    const [cv, c] = A.mk(112, 106);
    const rnd = F.rng(21);
    // weathervane
    R(c, 55, 0, 2, 12, OUT); R(c, 50, 3, 12, 1, OUT); R(c, 58, 1, 4, 3, OUT); R(c, 51, 2, 2, 3, OUT);
    // walls
    R(c, 5, 54, 102, 48, OUT); R(c, 6, 54, 100, 47, "#c2402f");
    for (let x = 9; x < 106; x += 5) R(c, x, 56, 1, 45, "#a3352a");
    R(c, 6, 54, 100, 2, "#f1ead8"); R(c, 6, 54, 3, 47, "#f1ead8"); R(c, 103, 54, 3, 47, "#f1ead8");
    // side windows
    [[14, 64], [86, 64]].forEach(([x, y]) => { R(c, x, y, 13, 12, "#f1ead8"); R(c, x + 2, y + 2, 9, 8, "#3b2a24"); R(c, x + 6, y + 2, 1, 8, "#f1ead8"); R(c, x + 2, y + 5, 9, 1, "#f1ead8"); });
    // big door
    R(c, 33, 63, 46, 39, OUT); R(c, 34, 64, 44, 38, "#f1ead8"); R(c, 37, 67, 38, 35, "#b13a2b");
    for (let x = 40; x < 75; x += 4) R(c, x, 67, 1, 35, "#962f24");
    R(c, 55, 64, 2, 38, "#f1ead8");
    const X = (x0) => { line(c, x0, 67, x0 + 17, 100, "#f1ead8", 2); line(c, x0 + 17, 67, x0, 100, "#f1ead8", 2); };
    X(37); X(57);
    // foundation
    R(c, 4, 100, 104, 6, OUT); R(c, 5, 100, 102, 5, "#8d8577"); for (let x = 7; x < 106; x += 8) R(c, x, 101, 1, 4, "#6f685d");
    // gambrel roof
    for (let y = 10; y <= 56; y++) {
      const l = y < 30 ? Math.round(36 - (y - 10) * 1.1) : Math.round(14 - (y - 30) * 0.52), r = 112 - l;
      R(c, l, y, r - l, 1, ((y - 10) >> 2) & 1 ? "#6a5a55" : "#7d6c66");
      R(c, l, y, 2, 1, OUT); R(c, r - 2, y, 2, 1, OUT);
    }
    for (let y = 12; y < 55; y += 4) { const l = (y < 30 ? Math.round(36 - (y - 10) * 1.1) : Math.round(14 - (y - 30) * 0.52)) + 3; for (let x = ((y >> 2) & 1) * 5 + 3; x < 112; x += 10) if (x > l && x < 112 - l) R(c, x, y, 1, 3, "#594b47"); }
    R(c, 35, 9, 42, 3, OUT); R(c, 36, 10, 40, 1, "#9c8a83");
    R(c, 13, 29, 86, 2, "#56483f");
    R(c, 0, 55, 112, 3, OUT); R(c, 6, 58, 100, 2, "rgba(0,0,0,0.25)");
    // hay loft
    R(c, 46, 31, 20, 19, OUT); R(c, 47, 32, 18, 17, "#f1ead8"); R(c, 49, 34, 14, 13, "#2e211c");
    R(c, 49, 42, 14, 5, "#e8c35a"); for (let x = 50; x < 63; x += 2) R(c, x, 41, 1, 2, "#e8c35a"); R(c, 49, 45, 14, 1, "#c9a03a");
    if (S.snow) {
      for (let y = 10; y < 22; y++) { const l = Math.round(36 - (y - 10) * 1.1) + 1; R(c, l, y, 112 - 2 * l, 1, "#ffffff"); }
      for (let y = 30; y < 35; y++) { const l = Math.round(14 - (y - 30) * 0.52) + 1; R(c, l, y, 112 - 2 * l, 1, y > 33 ? "#e6f1f8" : "#ffffff"); }
      for (let x = 2; x < 110; x += 6) R(c, x, 58, 1, 2 + ((rnd() * 3) | 0), "#dff3ff");
    }
    return { cv, lights: [[20, 70, 14], [92, 70, 14], [56, 40, 14]] };
  };

  A.greenhouse = function (S) {
    const [cv, c] = A.mk(96, 78);
    const rnd = F.rng(31);
    // interior
    R(c, 4, 10, 88, 58, "#5e9c80");
    for (let i = 0; i < 26; i++) { const x = 8 + ((rnd() * 80) | 0), y = 46 + ((rnd() * 14) | 0); disc(c, x, y, 2 + ((rnd() * 3) | 0), rnd() < 0.5 ? "#3f8a4a" : "#57a85c"); }
    for (let i = 0; i < 14; i++) R(c, 8 + ((rnd() * 80) | 0), 44 + ((rnd() * 12) | 0), 2, 2, ["#ff8fb1", "#ffd23f", "#ffffff", "#c9a7ff"][i % 4]);
    R(c, 6, 60, 84, 3, "#7a5230");
    // glass tint + reflections
    R(c, 4, 34, 88, 30, "rgba(214,242,255,0.38)");
    for (let i = 0; i < 6; i++) line(c, 10 + i * 16, 62, 22 + i * 16, 36, "rgba(255,255,255,0.35)");
    // frames
    R(c, 3, 33, 90, 2, "#f4f7f5"); R(c, 3, 33, 2, 32, "#f4f7f5"); R(c, 91, 33, 2, 32, "#f4f7f5");
    for (let x = 15; x < 90; x += 12) R(c, x, 35, 1, 30, "#e8efec");
    R(c, 4, 48, 88, 1, "#e8efec");
    // roof (glass gable)
    for (let y = 4; y <= 34; y++) {
      const t = (y - 4) / 30, l = Math.round(46 - t * 46), r = Math.round(50 + t * 46);
      R(c, Math.max(0, l), y, Math.min(96, r) - Math.max(0, l), 1, y % 6 === 0 ? "#e8efec" : "rgba(196,236,250,0.88)");
    }
    for (let i = -3; i <= 3; i++) line(c, 48, 4, 48 + i * 15, 34, "#f4f7f5");
    line(c, 46, 4, 0, 34, OUT); line(c, 50, 4, 96, 34, OUT); R(c, 46, 3, 5, 2, OUT);
    R(c, 0, 34, 96, 1, OUT);
    // door
    R(c, 41, 44, 14, 22, "#f4f7f5"); R(c, 43, 46, 10, 20, "rgba(160,215,235,0.95)"); R(c, 47, 46, 1, 20, "#f4f7f5"); R(c, 51, 56, 1, 2, "#c9a03a");
    // brick base
    R(c, 2, 64, 92, 14, OUT); R(c, 3, 65, 90, 12, "#b5654b");
    for (let y = 65; y < 77; y += 3) { R(c, 3, y + 2, 90, 1, "#8f4a36"); for (let x = 3 + ((y / 3) % 2) * 4; x < 93; x += 8) R(c, x, y, 1, 2, "#8f4a36"); }
    R(c, 40, 65, 16, 12, "#7a6a5a"); R(c, 41, 66, 14, 2, "#9a8a7a");
    if (S.snow) { for (let y = 4; y < 12; y++) { const t = (y - 4) / 30, l = Math.round(46 - t * 46) + 1, r = Math.round(50 + t * 46) - 1; R(c, l, y, r - l, 1, "#ffffff"); } snowCap(c, 2, 94, 63, rnd); }
    return { cv, lights: [[24, 50, 20], [72, 50, 20], [48, 44, 14]] };
  };

  A.booth = function (S) {
    const [cv, c] = A.mk(68, 64);
    // back board
    R(c, 6, 18, 56, 26, OUT); R(c, 7, 19, 54, 24, "#b07a42");
    for (let y = 22; y < 43; y += 5) R(c, 7, y, 54, 1, "#93622f");
    const ros = (x, y, col, dk) => { disc(c, x, y, 5, OUT); disc(c, x, y, 4, col); disc(c, x, y, 2, "#f6e7b0"); R(c, x - 3, y + 5, 2, 6, col); R(c, x + 1, y + 5, 2, 6, dk); };
    ros(17, 27, "#3f78c4", "#2a5a96"); ros(34, 27, "#d24a3c", "#9b3226"); ros(51, 27, "#e8b13c", "#bb8a22");
    // posts
    R(c, 3, 8, 6, 56, OUT); R(c, 4, 8, 4, 56, "#8a5a2b"); R(c, 59, 8, 6, 56, OUT); R(c, 60, 8, 4, 56, "#8a5a2b");
    // awning
    for (let x = 0; x < 68; x += 8) { R(c, x, 6, 8, 14, (x / 8) % 2 ? "#f4ecd8" : "#d9473f"); disc(c, x + 4, 20, 4, (x / 8) % 2 ? "#f4ecd8" : "#d9473f"); }
    R(c, 0, 4, 68, 3, OUT); R(c, 0, 6, 68, 1, "rgba(255,255,255,0.4)");
    // counter
    R(c, 1, 44, 66, 20, OUT); R(c, 2, 45, 64, 18, "#9c6b3c"); R(c, 2, 45, 64, 3, "#c99459");
    for (let x = 8; x < 66; x += 7) R(c, x, 48, 1, 15, "#7a4f28");
    // banner
    R(c, 20, 50, 28, 9, OUT); R(c, 21, 51, 26, 7, "#3f78c4"); R(c, 31, 52, 6, 5, "#f2c14e"); R(c, 33, 51, 2, 7, "#f2c14e");
    // top sign
    R(c, 22, 0, 24, 6, OUT); R(c, 23, 1, 22, 4, "#c99459"); R(c, 32, 2, 4, 2, "#d24a3c");
    if (S.snow) for (let x = 0; x < 68; x++) R(c, x, 3, 1, 2, "#ffffff");
    return { cv, lights: [[34, 30, 18]] };
  };

  A.noticeboard = function (S) {
    const [cv, c] = A.mk(36, 42);
    R(c, 4, 8, 5, 34, OUT); R(c, 5, 8, 3, 34, "#8a5a2b"); R(c, 27, 8, 5, 34, OUT); R(c, 28, 8, 3, 34, "#8a5a2b");
    R(c, 1, 8, 34, 24, OUT); R(c, 2, 9, 32, 22, "#6e4423"); R(c, 4, 11, 28, 18, "#c08b52");
    for (let i = 0; i < 30; i++) R(c, 4 + ((i * 7) % 28), 11 + ((i * 5) % 18), 1, 1, "#a8743f");
    R(c, 6, 13, 9, 11, "#fff7e6"); R(c, 7, 15, 7, 1, "#b9a68a"); R(c, 7, 17, 6, 1, "#b9a68a"); R(c, 7, 19, 7, 1, "#b9a68a"); R(c, 10, 12, 2, 2, "#d24a3c");
    R(c, 18, 12, 11, 8, "#fff1a8"); R(c, 19, 14, 8, 1, "#c9a03a"); R(c, 19, 16, 6, 1, "#c9a03a"); R(c, 23, 11, 2, 2, "#3f78c4");
    R(c, 19, 21, 9, 7, "#ffd0dc"); R(c, 20, 23, 6, 1, "#c97a8f"); R(c, 22, 20, 2, 2, "#5aa83a");
    // roof
    R(c, 0, 2, 36, 7, OUT); R(c, 1, 3, 34, 5, "#8f4a36"); R(c, 1, 3, 34, 1, "#b45f47");
    if (S.snow) R(c, 0, 1, 36, 3, "#ffffff");
    return { cv };
  };

  A.mailbox = function (S, flagUp) {
    const [cv, c] = A.mk(18, 28);
    R(c, 7, 12, 4, 16, OUT); R(c, 8, 12, 2, 16, "#8a5a2b");
    R(c, 1, 5, 15, 10, OUT); R(c, 2, 6, 13, 8, "#4f86c6"); R(c, 2, 6, 13, 2, "#7aa7dd"); R(c, 2, 4, 13, 2, OUT); R(c, 3, 3, 11, 1, OUT);
    R(c, 3, 9, 4, 4, "#2f5a8f");
    if (flagUp) { R(c, 15, 1, 2, 10, OUT); R(c, 14, 1, 4, 4, "#d24a3c"); }
    else { R(c, 15, 8, 2, 4, OUT); R(c, 13, 10, 5, 2, "#d24a3c"); }
    if (S.snow) R(c, 2, 2, 13, 2, "#ffffff");
    return { cv };
  };

  A.telescope = function (S) {
    const [cv, c] = A.mk(24, 30);
    line(c, 11, 16, 4, 29, OUT, 2); line(c, 12, 16, 12, 29, OUT, 2); line(c, 13, 16, 20, 29, OUT, 2);
    line(c, 11, 16, 5, 28, "#6e4423"); line(c, 13, 16, 19, 28, "#6e4423");
    for (let i = 0; i < 12; i++) { const x = 5 + i * 1.2, y = 18 - i * 1.4; disc(c, Math.round(x), Math.round(y), 3, OUT); }
    for (let i = 0; i < 12; i++) { const x = 5 + i * 1.2, y = 18 - i * 1.4; disc(c, Math.round(x), Math.round(y), 2, i > 8 ? "#e8c35a" : "#c9a227"); }
    disc(c, 19, 2, 3, OUT); disc(c, 19, 2, 2, "#2b3a67"); R(c, 18, 1, 1, 1, "#9ad9f7");
    R(c, 10, 14, 4, 4, OUT); R(c, 11, 15, 2, 2, "#5f6670");
    return { cv };
  };

  A.coop = function (S) {
    const [cv, c] = A.mk(34, 32);
    R(c, 3, 12, 28, 18, OUT); R(c, 4, 13, 26, 16, "#f1ead8"); for (let x = 7; x < 30; x += 4) R(c, x, 13, 1, 16, "#d8cfb8");
    R(c, 12, 18, 10, 11, OUT); R(c, 13, 19, 8, 10, "#3b2a24");
    for (let y = 2; y < 14; y++) { const l = Math.round(17 - (y - 2) * 1.5); R(c, l, y, 34 - 2 * l, 1, (y >> 1) & 1 ? "#c2402f" : "#a3352a"); }
    line(c, 17, 2, 0, 13, OUT); line(c, 17, 2, 33, 13, OUT);
    R(c, 14, 28, 8, 4, "#9c6b3c"); for (let x = 15; x < 22; x += 2) R(c, x, 29, 1, 3, "#7a4f28");
    if (S.snow) for (let y = 2; y < 7; y++) { const l = Math.round(17 - (y - 2) * 1.5) + 1; R(c, l, y, 34 - 2 * l, 1, "#ffffff"); }
    return { cv };
  };

  A.signpost = function (S) {
    const [cv, c] = A.mk(24, 26);
    R(c, 10, 6, 4, 20, OUT); R(c, 11, 6, 2, 20, "#8a5a2b");
    R(c, 1, 3, 19, 9, OUT); R(c, 2, 4, 17, 7, "#c99459"); R(c, 19, 5, 2, 5, OUT); R(c, 20, 6, 2, 3, OUT); R(c, 19, 6, 1, 3, "#c99459");
    R(c, 4, 6, 10, 1, "#7a4f28"); R(c, 4, 8, 8, 1, "#7a4f28");
    if (S.snow) R(c, 1, 2, 19, 2, "#ffffff");
    return { cv };
  };

  A.lamp = function (S) {
    const [cv, c] = A.mk(12, 32);
    R(c, 5, 10, 2, 22, "#2e2e38"); R(c, 3, 29, 6, 3, "#2e2e38");
    R(c, 2, 2, 8, 9, "#2e2e38"); R(c, 3, 4, 6, 6, "#ffd36e"); R(c, 3, 4, 6, 1, "#fff1b8"); R(c, 1, 1, 10, 2, "#2e2e38"); R(c, 5, 0, 2, 1, "#2e2e38");
    if (S.snow) R(c, 1, 0, 10, 1, "#ffffff");
    return { cv, lights: [[6, 7, 22]] };
  };

  A.scarecrow = function (S) {
    const [cv, c] = A.mk(22, 32);
    R(c, 10, 10, 2, 22, "#8a5a2b");
    R(c, 2, 12, 18, 2, "#8a5a2b");
    R(c, 6, 11, 10, 9, OUT); R(c, 7, 12, 8, 7, "#c8473a"); R(c, 7, 15, 8, 1, "#9b3226"); R(c, 10, 12, 2, 7, "#9b3226");
    R(c, 1, 12, 3, 3, "#e8c35a"); R(c, 18, 12, 3, 3, "#e8c35a");
    disc(c, 11, 6, 4, OUT); disc(c, 11, 6, 3, "#ead39c"); R(c, 9, 6, 1, 1, OUT); R(c, 12, 6, 1, 1, OUT); R(c, 10, 8, 2, 1, OUT);
    R(c, 4, 2, 14, 2, OUT); R(c, 5, 2, 12, 1, "#e8c35a"); R(c, 7, 0, 8, 3, OUT); R(c, 8, 0, 6, 2, "#d9b14a");
    if (S.snow) { R(c, 5, 1, 12, 1, "#ffffff"); R(c, 2, 11, 18, 1, "#ffffff"); }
    return { cv };
  };

  A.pumpkin = function (S, big) {
    const s = big ? 1 : 0;
    const [cv, c] = A.mk(big ? 26 : 12, big ? 20 : 10);
    if (big) {
      ellipse(c, 13, 12, 12, 7, OUT); ellipse(c, 13, 12, 11, 6, "#e07b28");
      ellipse(c, 13, 12, 6, 6, "#ec8f36"); R(c, 7, 7, 1, 10, "#c0621c"); R(c, 13, 6, 1, 12, "#c0621c"); R(c, 19, 7, 1, 10, "#c0621c");
      R(c, 9, 8, 3, 2, "#f6b05a");
      R(c, 12, 2, 3, 5, OUT); R(c, 13, 2, 1, 4, "#5aa83a");
      // ribbon
      disc(c, 21, 6, 4, OUT); disc(c, 21, 6, 3, "#3f78c4"); disc(c, 21, 6, 1, "#f2c14e"); R(c, 19, 9, 2, 5, "#3f78c4"); R(c, 22, 9, 2, 5, "#2a5a96");
      if (S.snow) R(c, 5, 5, 16, 2, "#ffffff");
    } else {
      ellipse(c, 6, 6, 5, 3, OUT); ellipse(c, 6, 6, 4, 2, "#e07b28"); R(c, 6, 4, 1, 5, "#c0621c"); R(c, 5, 1, 2, 3, "#3c7a2a"); R(c, 4, 5, 1, 1, "#f6b05a");
    }
    void s;
    return { cv };
  };

  /* Crops: one sprite per soil tile, changes with the season */
  A.crop = function (S, v) {
    const [cv, c] = A.mk(16, 16);
    const k = S.key;
    if (k === "spring") {
      [[4, 9], [11, 10]].forEach(([x, y], i) => { R(c, x, y - 3, 1, 4, "#3c7a2a"); R(c, x - 2, y - 3, 2, 2, "#6dbb4f"); R(c, x + 1, y - 4, 2, 2, "#6dbb4f"); if ((v + i) % 3 === 0) R(c, x - 1, y - 1, 2, 2, "#f05a6b"); });
    } else if (k === "summer") {
      [[4, 8], [11, 9]].forEach(([x, y], i) => { disc(c, x, y - 2, 3, "#2f6b2a"); disc(c, x, y - 3, 2, "#4f9a3c"); R(c, x - 2, y - 1, 2, 2, (v + i) % 2 ? "#e2333f" : "#ffcc33"); R(c, x + 1, y - 4, 1, 1, "#e2333f"); });
    } else if (k === "fall") {
      ellipse(c, 8, 11, 5, 3, OUT); ellipse(c, 8, 11, 4, 2, v % 3 === 0 ? "#e8b13c" : "#e07b28"); R(c, 8, 9, 1, 5, "#c0621c"); R(c, 7, 6, 2, 3, "#3c7a2a"); R(c, 4, 13, 3, 1, "#3c7a2a"); R(c, 6, 10, 1, 1, "#f6b05a");
    } else {
      ellipse(c, 5, 12, 3, 2, "#ffffff"); ellipse(c, 11, 11, 3, 2, "#f2f7fb"); R(c, 10, 9, 1, 2, "#7a5a3e");
    }
    return { cv };
  };

  /* ------------------------------------------------------------------
     NATURE
     ------------------------------------------------------------------ */
  A.tree = function (S, variant, big) {
    const W = big ? 54 : 34, H = big ? 64 : 46;
    const [cv, c] = A.mk(W, H);
    const rnd = F.rng(100 + variant * 13 + (big ? 7 : 0));
    const cx = W >> 1;
    const tw = big ? 9 : 6;
    // trunk
    const ty = big ? 34 : 26;
    R(c, cx - (tw >> 1) - 1, ty, tw + 2, H - ty, OUT);
    R(c, cx - (tw >> 1), ty, tw, H - ty - 1, "#7a4a25"); R(c, cx - (tw >> 1), ty, 2, H - ty - 1, "#93592c"); R(c, cx + (tw >> 1) - 2, ty, 2, H - ty - 1, "#5e3719");
    R(c, cx - (tw >> 1) - 3, H - 3, tw + 6, 2, "#7a4a25"); R(c, cx - (tw >> 1) - 4, H - 2, tw + 8, 1, OUT);
    if (!S.leaves) {
      // bare winter branches with snow
      const br = big
        ? [[cx, 40, cx - 18, 14], [cx, 36, cx + 18, 12], [cx, 30, cx - 6, 4], [cx, 32, cx + 8, 3], [cx - 10, 24, cx - 22, 20], [cx + 10, 22, cx + 23, 18]]
        : [[cx, 30, cx - 11, 10], [cx, 28, cx + 11, 8], [cx, 24, cx - 3, 3], [cx, 24, cx + 5, 4], [cx - 6, 20, cx - 14, 17], [cx + 6, 18, cx + 14, 15]];
      br.forEach(([a, b, x, y], i) => { line(c, a, b, x, y, OUT, i < 2 ? 3 : 2); line(c, a, b, x, y, "#6e4423", i < 2 ? 2 : 1); line(c, a, b - 1, x, y - 1, "#ffffff", 1); });
      R(c, cx - (tw >> 1), ty - 2, tw, 3, "#7a4a25");
      return { cv };
    }
    const set = S.leaves[variant % S.leaves.length];
    const [base, dark, light] = set;
    const outc = F.shade(dark, -0.45);
    const blobs = big
      ? [[cx, 20, 17], [cx - 13, 27, 11], [cx + 13, 27, 11], [cx, 32, 12], [cx - 9, 13, 9], [cx + 9, 13, 9]]
      : [[cx, 15, 11], [cx - 8, 20, 7], [cx + 8, 20, 7], [cx, 23, 8], [cx - 5, 10, 6], [cx + 5, 10, 6]];
    blobs.forEach(([x, y, r]) => disc(c, x, y, r + 1, outc));
    blobs.forEach(([x, y, r]) => disc(c, x, y, r, dark));
    blobs.forEach(([x, y, r]) => disc(c, x - 1, y - 2, Math.max(1, r - 2), base));
    (big ? [[cx - 8, 9, 5], [cx + 6, 9, 4], [cx - 14, 22, 4], [cx + 2, 18, 4]] : [[cx - 5, 7, 3], [cx + 4, 7, 3], [cx - 9, 16, 2], [cx + 1, 13, 3]]).forEach(([x, y, r]) => disc(c, x, y, r, light));
    for (let i = 0; i < (big ? 60 : 28); i++) {
      const b = blobs[(rnd() * blobs.length) | 0], a = rnd() * 6.28, d = rnd() * b[2] * 0.85;
      R(c, Math.round(b[0] + Math.cos(a) * d), Math.round(b[1] + Math.sin(a) * d), 1, 1, rnd() < 0.5 ? light : dark);
    }
    if (S.key === "spring" && variant % 2 === 0) for (let i = 0; i < (big ? 26 : 12); i++) { const b = blobs[(rnd() * blobs.length) | 0]; R(c, b[0] + ((rnd() * b[2] * 1.4) | 0) - b[2] * 0.7, b[1] + ((rnd() * b[2] * 1.4) | 0) - b[2] * 0.7, 2, 2, rnd() < 0.5 ? "#fde0ec" : "#f7b0cb"); }
    if (S.key === "summer" && variant % 3 === 2) for (let i = 0; i < 7; i++) { const b = blobs[(rnd() * blobs.length) | 0]; R(c, b[0] + ((rnd() * b[2]) | 0) - (b[2] >> 1), b[1] + ((rnd() * b[2]) | 0) - (b[2] >> 1), 2, 2, "#e2333f"); }
    return { cv };
  };

  A.pine = function (S, variant) {
    const [cv, c] = A.mk(26, 44);
    const [base, dark, light] = S.pine;
    R(c, 11, 34, 4, 10, OUT); R(c, 12, 34, 2, 9, "#6e4423");
    const tiers = [[20, 36, 12], [12, 27, 10], [3, 18, 7]];
    tiers.forEach(([y0, y1, hw]) => {
      for (let y = y0; y <= y1; y++) {
        const t = (y - y0) / (y1 - y0), w = Math.max(1, Math.round(hw * (0.3 + 0.7 * t)));
        R(c, 13 - w - 1, y, w * 2 + 2, 1, OUT);
        R(c, 13 - w, y, w, 1, light); R(c, 13, y, w, 1, base);
        if (y === y1) R(c, 13 - w, y, w * 2, 1, dark);
      }
      if (S.snow) for (let y = y0; y < y0 + 4; y++) { const t = (y - y0) / (y1 - y0), w = Math.max(1, Math.round(hw * (0.3 + 0.7 * t))); R(c, 13 - w, y, w * 2, 1, "#ffffff"); }
    });
    R(c, 12, 1, 2, 3, OUT);
    if (S.snow) R(c, 12, 1, 2, 2, "#ffffff");
    void variant;
    return { cv };
  };

  A.bush = function (S, v) {
    const [cv, c] = A.mk(20, 15);
    const rnd = F.rng(300 + v);
    const set = S.leaves ? S.leaves[v % S.leaves.length] : ["#5b8a6a", "#46705a", "#7aa58a"];
    const blobs = [[6, 9, 5], [13, 9, 5], [10, 6, 5]];
    blobs.forEach(([x, y, r]) => disc(c, x, y, r + 1, F.shade(set[1], -0.45)));
    blobs.forEach(([x, y, r]) => disc(c, x, y, r, set[1]));
    blobs.forEach(([x, y, r]) => disc(c, x - 1, y - 1, r - 2, set[0]));
    disc(c, 8, 4, 2, set[2]);
    if (S.snow) { blobs.forEach(([x, y, r]) => { for (let i = -r + 1; i < r; i++) R(c, x + i, y - r + 1 + (Math.abs(i) > r - 2 ? 1 : 0), 1, 2, "#ffffff"); }); }
    else for (let i = 0; i < 5; i++) R(c, 4 + ((rnd() * 12) | 0), 4 + ((rnd() * 8) | 0), 2, 2, S.berry);
    return { cv };
  };

  A.rock = function (S, v) {
    const [cv, c] = A.mk(14, 10);
    ellipse(c, 7, 6, 6, 3, OUT); ellipse(c, 7, 6, 5, 2, "#8f9aa3"); R(c, 4, 4, 4, 1, "#b8c1c8"); R(c, 3, 7, 8, 1, "#6f7880");
    if (S.snow) R(c, 3, 3, 8, 2, "#ffffff");
    void v;
    return { cv };
  };

  A.flowers = function (S, v) {
    const [cv, c] = A.mk(14, 9);
    if (!S.flowers.length) { ellipse(c, 7, 6, 5, 2, "#ffffff"); return { cv }; }
    const rnd = F.rng(500 + v);
    for (let i = 0; i < 4; i++) {
      const x = 1 + ((rnd() * 11) | 0), y = 2 + ((rnd() * 5) | 0), col = S.flowers[(v + i) % S.flowers.length];
      R(c, x, y + 1, 1, 2, "#3c7a2a"); R(c, x - 1, y, 3, 1, col); R(c, x, y - 1, 1, 3, col); R(c, x, y, 1, 1, "#fff3a6");
    }
    return { cv };
  };

  A.stump = function (S) {
    const [cv, c] = A.mk(16, 11);
    ellipse(c, 8, 7, 7, 3, OUT); R(c, 2, 4, 12, 4, OUT); ellipse(c, 8, 4, 6, 2, OUT);
    R(c, 3, 4, 10, 4, "#7a4a25"); ellipse(c, 8, 4, 5, 1, "#d9b07a"); R(c, 7, 4, 2, 1, "#a37a4a");
    if (S.snow) ellipse(c, 8, 3, 5, 1, "#ffffff");
    return { cv };
  };

  A.fenceH = function (S) {
    const [cv, c] = A.mk(16, 16);
    R(c, 0, 5, 16, 3, OUT); R(c, 0, 6, 16, 1, "#c99459"); R(c, 0, 10, 16, 3, OUT); R(c, 0, 11, 16, 1, "#c99459");
    R(c, 1, 2, 4, 14, OUT); R(c, 2, 3, 2, 13, "#a06a35"); R(c, 2, 3, 2, 1, "#c99459");
    if (S.snow) { R(c, 0, 5, 16, 1, "#ffffff"); R(c, 1, 2, 4, 1, "#ffffff"); }
    return { cv };
  };
  A.fencePost = function (S) {
    const [cv, c] = A.mk(16, 16);
    R(c, 6, 2, 4, 14, OUT); R(c, 7, 3, 2, 13, "#a06a35"); R(c, 7, 3, 2, 1, "#c99459");
    if (S.snow) R(c, 6, 2, 4, 1, "#ffffff");
    return { cv };
  };
  A.fenceV = function (S) {
    const [cv, c] = A.mk(16, 16);
    R(c, 6, 0, 4, 16, OUT); R(c, 7, 0, 2, 16, "#c99459");
    R(c, 5, 6, 6, 10, OUT); R(c, 6, 7, 4, 9, "#a06a35");
    if (S.snow) R(c, 6, 6, 4, 1, "#ffffff");
    return { cv };
  };

  A.lilypad = function (S) {
    const [cv, c] = A.mk(8, 5);
    if (S.snow) return { cv };
    ellipse(c, 4, 2, 3, 2, "#3c8a3a"); R(c, 4, 1, 2, 1, S.water); R(c, 2, 1, 1, 1, "#5fb35a");
    return { cv };
  };

  /* Golden acorn, world-sized */
  A.acorn = function () {
    const [cv, c] = A.mk(9, 11);
    R(c, 4, 0, 1, 2, "#5e3719");
    R(c, 1, 2, 7, 3, "#7a4a25"); R(c, 2, 2, 1, 1, "#93592c"); R(c, 5, 3, 1, 1, "#5e3719");
    R(c, 2, 5, 5, 4, "#f2c14e"); R(c, 3, 9, 3, 1, "#d9a12c"); R(c, 2, 5, 1, 2, "#fff1a8"); R(c, 6, 6, 1, 3, "#c98d1e");
    A.outline(cv, OUT);
    return { cv };
  };

  /* ------------------------------------------------------------------
     CHARACTERS
     ------------------------------------------------------------------ */
  const HAIR = "#2a1b15", HAIRL = "#4d3428", SKIN = "#efbf98", SKIND = "#d49b75", EYE = "#24160f", BLUSH = "#f39a9a",
    TOP = "#a9c8ea", TOPD = "#7f9fcf", FLO = "#ffffff", PANTS = "#6b4a33", BOOT = "#3b2414", MOUTH = "#c0685a";

  function farmerFrame(dir, f) {
    const [cv, c] = A.mk(16, 24);
    const b = f % 2 === 1 ? -1 : 0;
    const swing = f === 1 ? 1 : f === 3 ? -1 : 0;
    if (dir === "down") {
      R(c, 3, 5 + b, 10, 12, HAIR);
      R(c, 4, 3 + b, 8, 8, SKIN); R(c, 4, 10 + b, 8, 1, SKIND);
      R(c, 4, 1 + b, 8, 3, HAIR); R(c, 3, 2 + b, 10, 2, HAIR); R(c, 4, 4 + b, 4, 1, HAIR); R(c, 4, 5 + b, 1, 1, HAIR);
      R(c, 3, 4 + b, 1, 8, HAIR); R(c, 12, 4 + b, 1, 8, HAIR); R(c, 6, 1 + b, 3, 1, HAIRL); R(c, 9, 2 + b, 2, 1, HAIRL);
      R(c, 5, 6 + b, 1, 2, EYE); R(c, 10, 6 + b, 1, 2, EYE);
      R(c, 4, 8 + b, 1, 1, BLUSH); R(c, 11, 8 + b, 1, 1, BLUSH); R(c, 7, 9 + b, 2, 1, MOUTH);
      R(c, 7, 11 + b, 2, 1, SKIND);
      R(c, 4, 12 + b, 8, 6, TOP); R(c, 4, 17 + b, 8, 1, TOPD); R(c, 7, 12 + b, 2, 1, "#ffffff");
      R(c, 5, 14 + b, 1, 1, FLO); R(c, 9, 13 + b, 1, 1, FLO); R(c, 10, 16 + b, 1, 1, FLO); R(c, 6, 16 + b, 1, 1, TOPD);
      R(c, 3, 12 + b + swing, 1, 5, TOPD); R(c, 3, 17 + b + swing, 1, 1, SKIN);
      R(c, 12, 12 + b - swing, 1, 5, TOPD); R(c, 12, 17 + b - swing, 1, 1, SKIN);
      R(c, 5, 18 + b, 6, 3, PANTS);
      if (f === 1) { R(c, 5, 20, 2, 1, PANTS); R(c, 5, 21, 2, 2, BOOT); R(c, 9, 20, 2, 2, PANTS); R(c, 9, 22, 2, 2, BOOT); }
      else if (f === 3) { R(c, 9, 20, 2, 1, PANTS); R(c, 9, 21, 2, 2, BOOT); R(c, 5, 20, 2, 2, PANTS); R(c, 5, 22, 2, 2, BOOT); }
      else { R(c, 5, 20, 2, 2, PANTS); R(c, 9, 20, 2, 2, PANTS); R(c, 5, 22, 2, 2, BOOT); R(c, 9, 22, 2, 2, BOOT); }
    } else if (dir === "up") {
      R(c, 4, 12 + b, 8, 6, TOP); R(c, 4, 17 + b, 8, 1, TOPD);
      R(c, 3, 12 + b - swing, 1, 5, TOPD); R(c, 3, 17 + b - swing, 1, 1, SKIN);
      R(c, 12, 12 + b + swing, 1, 5, TOPD); R(c, 12, 17 + b + swing, 1, 1, SKIN);
      R(c, 3, 2 + b, 10, 14, HAIR); R(c, 4, 1 + b, 8, 1, HAIR); R(c, 4, 16 + b, 8, 1, HAIR); R(c, 5, 17 + b, 6, 1, HAIR);
      R(c, 5, 3 + b, 6, 1, HAIRL); R(c, 6, 6 + b, 1, 7, HAIRL); R(c, 9, 7 + b, 1, 6, HAIRL);
      R(c, 5, 18 + b, 6, 3, PANTS);
      if (f === 1) { R(c, 5, 20, 2, 1, PANTS); R(c, 5, 21, 2, 2, BOOT); R(c, 9, 20, 2, 2, PANTS); R(c, 9, 22, 2, 2, BOOT); }
      else if (f === 3) { R(c, 9, 20, 2, 1, PANTS); R(c, 9, 21, 2, 2, BOOT); R(c, 5, 20, 2, 2, PANTS); R(c, 5, 22, 2, 2, BOOT); }
      else { R(c, 5, 20, 2, 2, PANTS); R(c, 9, 20, 2, 2, PANTS); R(c, 5, 22, 2, 2, BOOT); R(c, 9, 22, 2, 2, BOOT); }
    } else {
      // side (facing right)
      R(c, 4, 2 + b, 6, 14, HAIR); R(c, 5, 16 + b, 4, 1, HAIR);
      R(c, 8, 3 + b, 4, 8, SKIN); R(c, 7, 5 + b, 1, 5, SKIN); R(c, 12, 6 + b, 1, 2, SKIN); R(c, 8, 10 + b, 4, 1, SKIND);
      R(c, 5, 1 + b, 7, 3, HAIR); R(c, 10, 3 + b, 2, 1, HAIR); R(c, 7, 3 + b, 1, 3, HAIR); R(c, 6, 1 + b, 3, 1, HAIRL);
      R(c, 10, 6 + b, 1, 2, EYE); R(c, 11, 8 + b, 1, 1, BLUSH); R(c, 11, 9 + b, 1, 1, MOUTH);
      R(c, 8, 11 + b, 2, 1, SKIND);
      R(c, 5, 12 + b, 6, 6, TOP); R(c, 5, 17 + b, 6, 1, TOPD); R(c, 9, 14 + b, 1, 1, FLO); R(c, 6, 15 + b, 1, 1, FLO);
      R(c, 7 + swing, 12 + b, 2, 5, TOPD); R(c, 7 + swing, 17 + b, 2, 1, SKIN);
      R(c, 6, 18 + b, 5, 3, PANTS);
      if (f % 2 === 1) { R(c, 5, 20, 2, 2, PANTS); R(c, 4, 22, 3, 2, BOOT); R(c, 9, 20, 2, 2, PANTS); R(c, 9, 22, 3, 2, BOOT); }
      else { R(c, 7, 20, 3, 2, PANTS); R(c, 7, 22, 4, 2, BOOT); }
    }
    A.outline(cv, "#24160f", true);
    return cv;
  }
  A.farmer = (function () {
    let cache = null;
    return function () {
      if (cache) return cache;
      cache = { down: [], up: [], right: [], left: [] };
      for (let f = 0; f < 4; f++) {
        cache.down.push(farmerFrame("down", f));
        cache.up.push(farmerFrame("up", f));
        const r = farmerFrame("side", f);
        cache.right.push(r); cache.left.push(A.flip(r));
      }
      return cache;
    };
  })();

  A.chicken = function (brown) {
    const frames = [];
    for (let f = 0; f < 2; f++) {
      const [cv, c] = A.mk(13, 11);
      const body = brown ? "#c98a4b" : "#fbfbf7", sh = brown ? "#a86d36" : "#d9d9d2";
      ellipse(c, 5, 7, 4, 3, body); R(c, 1, 4, 2, 3, body); R(c, 1, 3, 1, 1, body);
      R(c, 3, 7, 4, 2, sh);
      const hy = f ? 3 : 0, hx = f ? 1 : 0;
      R(c, 7 + hx, 2 + hy, 3, 4, body); R(c, 8 + hx, 1 + hy, 2, 1, "#e2333f"); R(c, 10 + hx, 3 + hy, 2, 1, "#f2b33d"); R(c, 9 + hx, 3 + hy, 1, 1, "#24160f"); R(c, 9 + hx, 5 + hy, 1, 1, "#e2333f");
      R(c, 4, 10, 1, 1, "#f2b33d"); R(c, 6, 10, 1, 1, "#f2b33d");
      A.outline(cv, "#3b2414", true);
      frames.push(cv);
    }
    return { right: frames, left: frames.map(A.flip) };
  };

  A.cat = function () {
    const frames = [];
    for (let f = 0; f < 2; f++) {
      const [cv, c] = A.mk(18, 12);
      ellipse(c, 10, 8 - f * 0, 6, 3 + (f ? 0 : 0), "#e8964a");
      if (f) R(c, 5, 5, 10, 1, "#e8964a");
      R(c, 8, 5, 1, 2, "#c46f2c"); R(c, 11, 5, 1, 2, "#c46f2c"); R(c, 14, 6, 1, 2, "#c46f2c");
      disc(c, 5, 7, 3, "#e8964a"); R(c, 3, 3, 2, 2, "#e8964a"); R(c, 6, 3, 2, 2, "#e8964a"); R(c, 3, 4, 1, 1, "#f39a9a");
      R(c, 4, 7, 1, 1, "#3b2414"); R(c, 6, 7, 1, 1, "#3b2414"); R(c, 5, 8, 1, 1, "#f39a9a");
      R(c, 13, 10, 4, 1, "#e8964a"); R(c, 16, 9, 1, 1, "#e8964a"); R(c, 6, 10, 6, 1, "#f6c08a");
      A.outline(cv, "#3b2414", true);
      frames.push(cv);
    }
    return frames;
  };

  /* Pony, side view facing right. frame: 0..3 trot, idle uses 0 with tail swish */
  A.pony = function () {
    const frames = [];
    const legsets = [[0, 0, 0, 0], [-2, 1, 2, -1], [0, 0, 0, 0], [2, -1, -2, 1]];
    for (let f = 0; f < 4; f++) {
      const [cv, c] = A.mk(38, 32);
      const B = "#9a6236", BD = "#7a4a25", M = "#3b2414", L = legsets[f], bob = f % 2 ? -1 : 0;
      // tail
      R(c, 3, 11 + bob, 4, 2, M); R(c, 2, 13 + bob, 3, 7, M); R(c, 1, 18 + bob, 2, 3, M);
      // legs
      [[10, L[0]], [14, L[1]], [23, L[2]], [27, L[3]]].forEach(([x, o], i) => {
        R(c, x + o, 20 + bob, 3, 8, i % 2 ? BD : B); R(c, x + o, 28, 3, 2, "#2e211c");
      });
      // body
      R(c, 8, 10 + bob, 22, 11, B); R(c, 9, 9 + bob, 20, 1, B); R(c, 9, 19 + bob, 20, 2, BD); R(c, 10, 11 + bob, 10, 2, "#b47a48");
      // harness
      R(c, 18, 9 + bob, 4, 12, "#c8473a"); R(c, 18, 9 + bob, 4, 1, "#e06a5b");
      // neck + head
      R(c, 25, 4 + bob, 6, 10, B); R(c, 27, 2 + bob, 6, 5, B); R(c, 29, 1 + bob, 7, 6, B); R(c, 33, 4 + bob, 4, 4, "#e6d3bb"); R(c, 35, 5 + bob, 1, 1, "#24160f");
      R(c, 31, 3 + bob, 1, 1, "#24160f"); R(c, 29, 0 + bob, 2, 2, B);
      // mane
      R(c, 24, 2 + bob, 3, 10, M); R(c, 26, 0 + bob, 3, 3, M);
      A.outline(cv, "#24160f", true);
      frames.push(cv);
    }
    return frames;
  };

  /* Side-view cart. crates: 0–3, ang: wheel rotation, rider: draw Pranavi on the bench */
  A.cartSide = function (crates, ang, rider, crateCol) {
    const [cv, c] = A.mk(48, 42);
    if (rider) {
      const fr = A.farmer().right[0];
      c.drawImage(fr, 0, 0, 16, 20, 21, 3, 16, 20);
    }
    const cc = crateCol || "#c99459";
    const crate = (x, y) => { R(c, x, y, 9, 8, OUT); R(c, x + 1, y + 1, 7, 6, cc); R(c, x + 1, y + 1, 7, 1, F.shade(cc, 0.25)); line(c, x + 1, y + 1, x + 7, y + 6, F.shade(cc, -0.25)); };
    const spots = [[3, 11], [11, 11], [7, 4]];
    for (let i = 0; i < Math.min(3, crates); i++) crate(spots[i][0], spots[i][1]);
    // box
    R(c, 1, 18, 36, 12, OUT); R(c, 2, 19, 34, 10, "#a06a35"); R(c, 2, 19, 34, 2, "#c99459");
    for (let x = 9; x < 36; x += 8) R(c, x, 21, 1, 8, "#7a4a25");
    R(c, 2, 24, 34, 1, "#7a4a25");
    // shafts
    R(c, 36, 22, 12, 3, OUT); R(c, 36, 23, 12, 1, "#c99459");
    // wheel
    disc(c, 15, 31, 9, OUT); disc(c, 15, 31, 8, "#8a5a2b"); disc(c, 15, 31, 6, "#2e211c");
    for (let i = 0; i < 4; i++) { const a = ang + (i * Math.PI) / 4; line(c, Math.round(15 - Math.cos(a) * 6), Math.round(31 - Math.sin(a) * 6), Math.round(15 + Math.cos(a) * 6), Math.round(31 + Math.sin(a) * 6), "#c99459"); }
    disc(c, 15, 31, 2, "#f2c14e");
    return cv;
  };

  A.butterfly = function (col) {
    const fr = [];
    for (let f = 0; f < 2; f++) {
      const [cv, c] = A.mk(5, 4);
      if (f) { R(c, 0, 0, 2, 2, col); R(c, 3, 0, 2, 2, col); R(c, 1, 2, 1, 1, col); R(c, 3, 2, 1, 1, col); }
      else { R(c, 1, 0, 1, 3, col); R(c, 3, 0, 1, 3, col); }
      R(c, 2, 0, 1, 4, "#3b2414");
      fr.push(cv);
    }
    return fr;
  };
})();
