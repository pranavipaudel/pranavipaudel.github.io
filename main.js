/* =====================================================================
   MAIN — boot, HUD, toolbar, menu, golden acorns, routing
   ===================================================================== */
(function () {
  const F = window.FARM;
  const $ = F.$;

  /* ------------------------------------------------------------------
     Golden acorns
     ------------------------------------------------------------------ */
  const found = new Set(F.store.get("acorns", []));
  F.acorns = {
    list: [
      { id: "oak", name: "Under the old oak", hint: "The big oak by the pond drops more than leaves.", go: "walk:oak" },
      { id: "hill", name: "Edge of Telescope Hill", hint: "Something glints in the far corner of the hilltop.", go: "walk:hill" },
      { id: "about", name: "Farmhouse bookshelf", hint: "Farmhouse: look between the books.", go: "about" },
      { id: "barn", name: "Barn hay bale", hint: "Barn: hay hides things.", go: "projects" },
      { id: "booth", name: "Prize pumpkin", hint: "Fair booth: the prize pumpkin looks hollow.", go: "certs" },
      { id: "greenhouse", name: "The unlabeled pot", hint: "Greenhouse: one pot was never labeled.", go: "hobbies" },
      { id: "sky", name: "Not a star", hint: "Night sky: one star twinkles gold.", go: "skills" },
      { id: "road", name: "End of the road", hint: "The road: drive all the way to the very end.", go: "experience" },
      { id: "board", name: "Nutty pushpin", hint: "Noticeboard: one pushpin looks… nutty.", go: "resume" },
      { id: "mail", name: "Acorn stamp", hint: "Mailbox: look closely at the stamp.", go: "contact" }
    ],
    has: (id) => found.has(id),
    count: () => found.size,
    collect(id, fromEl) {
      if (found.has(id)) return;
      found.add(id);
      F.store.set("acorns", Array.from(found));
      F.audio.play("acorn");
      F.world.removeAcorn(id);
      F.$$(`[data-acorn="${id}"]`).forEach((el) => el.classList.add("found"));
      const n = found.size, total = this.list.length;
      if (fromEl) flyToCounter(fromEl);
      setTimeout(updateCounter, fromEl ? 650 : 0);
      F.toast(n === total ? `All ${total} golden acorns found!` : `Golden acorn found! <b>${n}/${total}</b>`, { icon: "acorn", cls: "gold" });
      if (n === total) setTimeout(() => F.open("vip"), 1300);
    },
    bindSecrets(root) {
      F.$$("[data-acorn]", root).forEach((el) => {
        const id = el.getAttribute("data-acorn");
        if (found.has(id)) { el.classList.add("found"); return; }
        el.addEventListener("click", (e) => { e.stopPropagation(); F.acorns.collect(id, el); });
      });
    }
  };
  function updateCounter() {
    const b = $("#acorn-btn");
    if (!b) return;
    b.querySelector(".n").textContent = `${found.size}/${F.acorns.list.length}`;
    b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
  }
  function flyToCounter(el) {
    const a = el.getBoundingClientRect(), b = $("#acorn-btn").getBoundingClientRect();
    const fl = F.html(`<div style="position:fixed;z-index:300;left:${a.left + a.width / 2 - 16}px;top:${a.top + a.height / 2 - 16}px;transition:transform .6s cubic-bezier(.5,-0.4,.6,1),opacity .6s;pointer-events:none">${F.icon("acorn", 32)}</div>`);
    document.body.appendChild(fl);
    requestAnimationFrame(() => { fl.style.transform = `translate(${b.left + 20 - a.left - a.width / 2}px, ${b.top + 6 - a.top - a.height / 2}px) scale(.7)`; });
    setTimeout(() => fl.remove(), 650);
  }

  /* ------------------------------------------------------------------
     Visited sections (little green dot on the toolbar)
     ------------------------------------------------------------------ */
  const visited = new Set(F.store.get("visited", []));
  F.markVisited = function (id) {
    if (!F.SECTIONS[id]) return;
    visited.add(id); F.store.set("visited", Array.from(visited));
    const s = $(`#toolbar [data-go="${id}"]`); if (s) s.classList.add("done");
  };

  /* ------------------------------------------------------------------
     Routing
     ------------------------------------------------------------------ */
  let entered = false;
  F.open = function (id, sub) {
    if (id === "quick") { F.quick.open(); return; }
    if (!entered) enterFarm(true);
    closeMenu();
    if (F.SECTIONS[id] && !F.panel.current()) F.world.teleport(id);
    F.panel.open(id, sub);
    const h = "#" + id + (sub ? "/" + sub : "");
    if (location.hash !== h && F.SECTIONS[id]) history.pushState(null, "", h);
  };
  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) { if (F.panel.current()) F.panel.close(true); if (F.quick.isOpen()) F.quick.close(); return; }
    const [id, sub] = h.split("/");
    if (id === "quick") { F.quick.open(); return; }
    if (F.SECTIONS[id] || id === "journal" || id === "help") {
      if (!entered) enterFarm(true);
      if (F.SECTIONS[id] && !F.panel.current()) F.world.teleport(id);
      F.panel.open(id, sub);
    }
  }
  window.addEventListener("popstate", route);
  F.world.onEnter = (id) => F.open(id);

  /* ------------------------------------------------------------------
     HUD
     ------------------------------------------------------------------ */
  function buildHUD() {
    const p = F.data.person;
    const order = ["about", "projects", "experience", "skills", "certs", "hobbies", "resume", "contact"];
    const app = $("#app");
    app.insertAdjacentHTML("beforeend", `
      <div id="hud-left">
        <button class="hud-box nameplate" data-go="about" aria-label="About ${F.esc(p.name)}"><img class="np-face" src="${p.photo}" alt=""><span><span class="np-name" style="display:block">${F.esc(p.name)}</span><span class="np-sub" style="display:block">Mech & Biomed Engineer · MSU '27</span></span></button>
        <button class="btn sm wood" id="qv-btn">${F.icon("book", 16)} Quick view</button>
      </div>
      <div id="hud-right">
        <div class="hud-box clock" aria-live="off"><div class="c-date"></div><div class="c-time"></div><div class="c-season"></div></div>
        <div class="hud-row">
          <button class="hud-box acorn-count" id="acorn-btn" aria-label="Acorn journal">${F.icon("acorn", 24)}<span class="n">${found.size}/${F.acorns.list.length}</span></button>
          <button class="hud-box icon-btn" id="snd-btn"></button>
          <button class="hud-box icon-btn" id="menu-btn" aria-label="Menu" aria-expanded="false">${F.icon("menu", 24)}</button>
        </div>
      </div>
      <div class="hud-box menu-pop" id="menu" hidden role="menu"></div>
      <nav id="toolbar" class="hud-box" aria-label="Farm sections">${order.map((id) => { const s = F.SECTIONS[id]; return `<div class="slot-wrap"><button class="slot ${visited.has(id) ? "done" : ""}" data-go="${id}" aria-label="${s.label} (${s.key})"><span class="k">${s.key}</span>${F.icon(s.icon, 36)}</button><span class="tip">${s.label}</span></div>`; }).join("")}</nav>
      <div class="hud-box hint-bubble" id="hint" hidden></div>`);
    F.$$("[data-go]", app).forEach((b) => (b.onclick = () => { F.audio.play("click"); F.open(b.getAttribute("data-go")); }));
    $("#qv-btn").onclick = () => F.quick.open();
    $("#acorn-btn").onclick = () => F.open("journal");
    $("#snd-btn").onclick = () => F.audio.toggle();
    $("#menu-btn").onclick = (e) => { e.stopPropagation(); $("#menu").hidden ? openMenu() : closeMenu(); };
    document.addEventListener("click", (e) => { if (!$("#menu").hidden && !e.target.closest("#menu")) closeMenu(); });
    F.audio.onChange(syncSound);
    syncSound();
    tickClock(); setInterval(tickClock, 15000);
  }
  function syncSound() {
    const on = F.audio.enabled;
    const b = $("#snd-btn");
    if (b) { b.innerHTML = F.icon(on ? "soundOn" : "soundOff", 24); b.setAttribute("aria-label", on ? "Sound on (M)" : "Sound off (M)"); b.title = on ? "Sound on" : "Sound off"; }
    const t = $("#title-sound");
    if (t) t.innerHTML = `${F.icon(on ? "soundOn" : "soundOff", 18)} Sound ${on ? "on" : "off"}`;
    if (!$("#menu").hidden) renderMenu();
  }
  function tickClock() {
    const box = $(".clock");
    if (!box) return;
    const d = new Date(), mode = F.state.timeMode;
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    box.querySelector(".c-date").textContent = `${days[d.getDay()]}. ${months[d.getMonth()]} ${d.getDate()}`;
    let time;
    if (mode === "auto") { let h = d.getHours(); const m = d.getMinutes(); const ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12; time = `${h}:${String(m).padStart(2, "0")} ${ap}`; }
    else time = mode === "day" ? "12:00 pm" : mode === "sunset" ? "6:54 pm" : "10:00 pm";
    box.querySelector(".c-time").textContent = time;
    const key = F.world.seasonKey(), ic = { spring: "blossom", summer: "sun", fall: "leaf", winter: "snow" }[key];
    const hrs = F.world.hours(), night = hrs >= 20.5 || hrs < 5.5;
    box.querySelector(".c-season").innerHTML = `${F.icon(night ? "moon" : ic, 16)} ${F.art.SEASONS[key].name}${F.state.seasonMode !== "auto" ? "*" : ""}`;
  }

  /* menu */
  const SEASON_CYCLE = ["auto", "spring", "summer", "fall", "winter"], TIME_CYCLE = ["auto", "day", "sunset", "night"];
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  function renderMenu() {
    const m = $("#menu");
    m.innerHTML = `
      <button data-m="quick" role="menuitem">${F.icon("book", 22)} Quick view <span class="m-val">1 page</span></button>
      <button data-m="journal" role="menuitem">${F.icon("acorn", 22)} Acorn journal <span class="m-val">${found.size}/${F.acorns.list.length}</span></button>
      ${found.size >= F.acorns.list.length ? `<button data-m="vip" role="menuitem">${F.icon("cup", 22)} Golden Acorn Pass</button>` : ""}
      <hr>
      <button data-m="sound" role="menuitem">${F.icon(F.audio.enabled ? "soundOn" : "soundOff", 22)} Sound <span class="m-val">${F.audio.enabled ? "On" : "Off"}</span></button>
      <button data-m="music" role="menuitem">${F.icon("music", 22)} Music <span class="m-val">${F.audio.musicOn ? "On" : "Off"}</span></button>
      <button data-m="season" role="menuitem">${F.icon({ spring: "blossom", summer: "sun", fall: "leaf", winter: "snow" }[F.world.seasonKey()], 22)} Season <span class="m-val">${F.state.seasonMode === "auto" ? "Auto (" + F.art.SEASONS[F.world.seasonKey()].name + ")" : cap(F.state.seasonMode)}</span></button>
      <button data-m="time" role="menuitem">${F.icon(F.state.timeMode === "night" ? "moon" : "sun", 22)} Time of day <span class="m-val">${cap(F.state.timeMode)}</span></button>
      <hr>
      <button data-m="help" role="menuitem">${F.icon("book", 22)} How to play</button>
      <button data-m="title" role="menuitem">${F.icon("house", 22)} Title screen</button>`;
    F.$$("[data-m]", m).forEach((b) => (b.onclick = (e) => { e.stopPropagation(); menuAction(b.getAttribute("data-m")); }));
  }
  function menuAction(a) {
    F.audio.play("click");
    if (a === "quick") { closeMenu(); F.quick.open(); }
    else if (a === "journal" || a === "help" || a === "vip") { closeMenu(); F.open(a); }
    else if (a === "sound") { F.audio.toggle(); renderMenu(); }
    else if (a === "music") { F.audio.setMusic(!F.audio.musicOn); if (!F.audio.enabled) F.audio.setEnabled(true); renderMenu(); }
    else if (a === "season") { F.state.seasonMode = SEASON_CYCLE[(SEASON_CYCLE.indexOf(F.state.seasonMode) + 1) % SEASON_CYCLE.length]; F.store.set("seasonMode", F.state.seasonMode); F.world.rebuild(); tickClock(); renderMenu(); }
    else if (a === "time") { F.state.timeMode = TIME_CYCLE[(TIME_CYCLE.indexOf(F.state.timeMode) + 1) % TIME_CYCLE.length]; F.store.set("timeMode", F.state.timeMode); tickClock(); renderMenu(); }
    else if (a === "title") { closeMenu(); showTitle(); }
  }
  function openMenu() {
    const m = $("#menu"); renderMenu(); m.hidden = false;
    const r = $("#menu-btn").getBoundingClientRect();
    m.style.top = r.bottom + 8 + "px";
    $("#menu-btn").setAttribute("aria-expanded", "true");
    const first = m.querySelector("button"); first && first.focus({ preventScroll: true });
  }
  function closeMenu() { const m = $("#menu"); if (m && !m.hidden) { m.hidden = true; $("#menu-btn").setAttribute("aria-expanded", "false"); } }

  /* hint bubble for first-time visitors */
  function showHint() {
    if (F.world.firstMoveDone()) return;
    const h = $("#hint");
    const touch = matchMedia("(hover: none)").matches;
    h.innerHTML = touch ? `${F.icon("sparkle", 18)} Tap anywhere to walk · tap a building to go inside` : `${F.icon("sparkle", 18)} Click anywhere (or use WASD) to walk · click a building to go inside`;
    h.hidden = false;
    const iv = setInterval(() => { if (F.world.firstMoveDone() || F.panel.current()) { h.hidden = true; clearInterval(iv); } }, 400);
    setTimeout(() => { h.hidden = true; clearInterval(iv); }, 14000);
  }

  /* ------------------------------------------------------------------
     Title screen
     ------------------------------------------------------------------ */
  function enterFarm(instant) {
    const t = $("#title");
    if (!entered) { entered = true; F.world.start(); }
    if (!t.classList.contains("gone")) {
      t.classList.add("gone");
      setTimeout(() => F.title.stop(), instant ? 0 : 650);
      document.removeEventListener("keydown", titleKeys);
      if (!instant) { F.audio.unlock(); F.audio.play("open"); setTimeout(showHint, 700); }
    }
    F.world.setPaused(!!F.panel.current() || F.quick.isOpen());
  }
  function showTitle() {
    if (F.panel.current()) F.panel.close(true);
    const t = $("#title");
    t.classList.remove("gone");
    F.title.start($("#title-canvas"));
    F.world.setPaused(true);
    document.addEventListener("keydown", titleKeys);
    setTimeout(() => $("#enter-btn").focus({ preventScroll: true }), 50);
  }
  function titleKeys(e) {
    if (F.quick.isOpen()) return;
    if ((e.key === "Enter" || e.key === " ") && !e.target.closest("button, a")) { e.preventDefault(); enterFarm(); }
  }

  /* ------------------------------------------------------------------
     Global shortcuts
     ------------------------------------------------------------------ */
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key === "Escape") closeMenu();
    if (!entered || F.quick.isOpen() || !$("#title").classList.contains("gone")) return;
    if (e.code === "KeyM") { F.audio.toggle(); return; }
    if (F.panel.current()) return;
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 8) { const id = Object.keys(F.SECTIONS).find((k) => F.SECTIONS[k].key === String(n)); if (id) F.open(id); }
    if (e.code === "KeyJ") F.open("journal");
    if (e.code === "KeyQ") F.quick.open();
  });

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  function boot() {
    F.world.init($("#world"), $("#world-labels"));
    buildHUD();
    $("#enter-btn").onclick = () => enterFarm();
    $("#title-quick").onclick = () => F.quick.open();
    $("#title-sound").onclick = () => F.audio.toggle();
    syncSound();
    F.onQuickClose = () => { if (!$("#title").classList.contains("gone")) F.world.setPaused(true); };
    const h = location.hash.slice(1);
    if (h) {
      $("#title").classList.add("gone");
      entered = true; F.world.start();
      route();
    } else {
      F.world.setPaused(true);
      F.title.start($("#title-canvas"));
      document.addEventListener("keydown", titleKeys);
      F.world.start();
    }
    const tip = $("#title-tip");
    if (tip) tip.innerHTML = `${F.icon("acorn", 18)} ${F.acorns.list.length} golden acorns are hidden around the farm. Find them all for a surprise.`;
    try { console.log("%c🌱 Hi there, fellow engineer! This whole farm is hand-drawn in code. Every sprite is a few fillRect() calls.", "font:14px monospace;color:#3c7a2a"); } catch (e) { /* noop */ }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
