/* =====================================================================
   PANELS — the wooden windows that open when you walk into a building
   ===================================================================== */
(function () {
  const F = window.FARM, A = F.art, D = () => F.data;

  F.SECTIONS = {
    about: { label: "About Me", place: "The Farmhouse", icon: "house", key: "1" },
    projects: { label: "Projects", place: "The Barn", icon: "barn", key: "2" },
    experience: { label: "Experience", place: "The Road", icon: "cart", key: "3" },
    skills: { label: "Skills", place: "Telescope Hill", icon: "telescope", key: "4" },
    certs: { label: "Certifications", place: "The Fair Booth", icon: "ribbon", key: "5" },
    hobbies: { label: "Hobbies", place: "The Greenhouse", icon: "flower", key: "6" },
    resume: { label: "Résumé", place: "The Noticeboard", icon: "doc", key: "7" },
    contact: { label: "Contact", place: "The Mailbox", icon: "mailbox", key: "8" }
  };

  const P = (F.panel = {});
  const REG = {};
  let root, cur = null;
  P.register = (id, def) => { REG[id] = def; };
  P.current = () => (cur ? cur.id : null);

  function onKey(e) {
    if (!cur) return;
    if (e.key === "Escape" && !F.lightbox.isOpen()) { e.preventDefault(); P.close(); }
    if (e.key === "Tab") {
      const f = F.$$('button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])', root).filter((x) => !x.disabled && x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  P.open = function (id, sub) {
    const def = REG[id];
    if (!def) return;
    root = root || F.$("#panel-root");
    const same = cur && cur.id === id;
    if (cur && cur.cleanup) cur.cleanup();
    const meta = F.SECTIONS[id] || {};
    const title = def.title || meta.label, place = def.sub || meta.place || "", icon = def.icon || meta.icon;
    if (!same) {
      root.innerHTML = `<div class="panel-backdrop"></div><div class="panel-wrap"><section class="panel ${def.cls || ""}" role="dialog" aria-modal="true" aria-labelledby="ph-title">
        <header class="panel-head"><span class="ph-ic">${F.icon(icon, 30)}</span><div><h2 id="ph-title">${F.esc(title)}</h2><div class="ph-sub">${F.esc(place)}</div></div><span class="ph-spacer"></span><button class="x" aria-label="Close (Esc)">${F.icon("close", 26)}</button></header>
        <div class="panel-body ${def.bodyCls || ""}"></div></section></div>`;
      root.classList.add("open");
      root.querySelector(".x").onclick = () => P.close();
      root.querySelector(".panel-backdrop").onclick = () => P.close();
      document.addEventListener("keydown", onKey);
      F.audio.play("open");
    }
    const body = root.querySelector(".panel-body");
    body.innerHTML = "";
    body.className = "panel-body " + (def.bodyCls || "");
    body.scrollTop = 0;
    cur = { id, sub, body, cleanup: null };
    def.render(body, sub, cur);
    F.acorns.bindSecrets(body);
    F.world.setPaused(true);
    document.body.classList.add("panel-open");
    if (!same) setTimeout(() => { const x = root.querySelector(".x"); x && x.focus({ preventScroll: true }); }, 30);
    F.markVisited && F.markVisited(id);
  };
  P.close = function (silent) {
    if (!cur) return;
    if (cur.cleanup) cur.cleanup();
    const id = cur.id;
    cur = null;
    root.classList.remove("open");
    root.innerHTML = "";
    document.removeEventListener("keydown", onKey);
    document.body.classList.remove("panel-open");
    F.world.setPaused(false);
    if (!silent) F.audio.play("close");
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    if (F.onPanelClose) F.onPanelClose(id);
  };

  /* small helpers */
  const btn = (label, attrs = "", cls = "") => `<button class="btn ${cls}" ${attrs}>${label}</button>`;
  const link = (label, href, cls = "", ext = true) => `<a class="btn ${cls}" href="${F.esc(href)}" ${ext && !/^mailto:/.test(href) ? 'target="_blank" rel="noopener"' : ""}>${label}</a>`;
  const secret = (id, label, size = 28) => `<button class="secret" data-acorn="${id}" aria-label="${F.esc(label)}">${F.icon("acorn", size)}<i class="glint"></i></button>`;
  P.helpers = { btn, link, secret };

  /* ------------------------------------------------------------------
     ABOUT — the farmhouse
     ------------------------------------------------------------------ */
  P.register("about", {
    render(body) {
      const d = D(), p = d.person, a = d.about;
      const books = ["#c8473a", "#4f86c6", "#e8b13c", "#5aa83a", "#8a5cc0", "#e07b28", "#2fa3a0", "#c8473a", "#f09ab0"];
      const shelf = (from, to) => books.slice(from, to).map((c, i) => `<i style="background:${c};height:${30 + ((i * 7) % 14)}px"></i>`).join("");
      body.innerHTML = `<div class="pad"><div class="about-grid">
        <aside class="about-side">
          <figure class="polaroid"><span class="tape"></span><img src="${p.photo}" alt="Portrait of ${F.esc(p.name)}"><figcaption class="cap">${F.esc(p.first)} · MSU '27</figcaption></figure>
          <div class="card statsheet">${a.stats.map((s) => `<div class="stat">${F.icon(s.icon, 22)}<div><div class="s-l">${F.esc(s.label)}</div><div class="s-v">${F.esc(s.value)}</div></div></div>`).join("")}</div>
        </aside>
        <div class="about-main">
          <div class="kicker">Welcome to the farmhouse</div>
          <h3 class="hello">${F.esc(a.greeting)}</h3>
          ${a.intro.map((t, i) => `<p class="${i === 0 ? "lead" : ""}">${F.esc(t)}</p>`).join("")}
          <div class="lookfor">${F.icon("sparkle", 26)}<div><b>Looking for</b><br>${F.esc(p.lookingFor)}</div></div>
          <div class="row">
            ${btn(F.icon("doc", 18) + " Résumé", 'data-go="resume"')}
            ${link(F.icon("envelope", 18) + " Email me", "mailto:" + p.email, "paper")}
            ${link(F.icon("linkedin", 18) + " LinkedIn", p.linkedin, "paper")}
            ${btn(F.icon("book", 18) + " Quick view", 'data-quick="1"', "wood")}
          </div>
          <div class="fireside"><h4>Fireside chats</h4><p class="muted">Pull up a chair. Here are a few questions I get asked a lot.</p>
            ${a.chats.map((c, i) => `<details ${i === 0 ? "open" : ""}><summary>${F.esc(c.q)}</summary><p>${F.esc(c.a)}</p></details>`).join("")}
          </div>
          <div class="bookshelf" aria-label="A little bookshelf">${shelf(0, 5)}${secret("about", "Something shiny between the books", 26)}${shelf(5, 9)}</div>
        </div>
      </div></div>`;
      wireCommon(body);
    }
  });

  function wireCommon(body) {
    F.$$("[data-go]", body).forEach((b) => (b.onclick = () => F.open(b.getAttribute("data-go"), b.getAttribute("data-sub") || undefined)));
    F.$$("[data-quick]", body).forEach((b) => (b.onclick = () => F.quick.open()));
    F.bindGallery(body);
  }
  P.wireCommon = wireCommon;

  /* ------------------------------------------------------------------
     PROJECT ART for projects without photos (pixel illustrations)
     ------------------------------------------------------------------ */
  P.projArt = function (kind) {
    const [cv, c] = A.mk(160, 90);
    const R = A.R;
    const grid = (bg, line) => { R(c, 0, 0, 160, 90, bg); for (let x = 0; x < 160; x += 10) R(c, x, 0, 1, 90, line); for (let y = 0; y < 90; y += 10) R(c, 0, y, 160, 1, line); };
    if (kind === "hand") {
      grid("#1d3a5c", "#27507a");
      R(c, 58, 52, 44, 30, "#3b2414"); R(c, 60, 54, 40, 26, "#aab4bf"); R(c, 60, 54, 40, 4, "#d3dae1");
      [[60, 20], [71, 12], [82, 14], [93, 24]].forEach(([x, y], i) => {
        R(c, x - 1, y - 1, 10, 56 - y, "#3b2414"); R(c, x, y, 8, 54 - y, "#c7ced6"); R(c, x, y, 3, 54 - y, "#e3e8ee");
        for (let j = y + 10; j < 52; j += 12) { R(c, x, j, 8, 2, "#f2c14e"); R(c, x + 3, j - 1, 2, 4, "#c98d1e"); }
      });
      R(c, 41, 52, 20, 9, "#3b2414"); R(c, 42, 53, 18, 7, "#c7ced6"); R(c, 36, 44, 10, 12, "#3b2414"); R(c, 37, 45, 8, 10, "#c7ced6"); R(c, 44, 54, 2, 5, "#f2c14e");
      R(c, 64, 80, 32, 10, "#2f5a8f"); R(c, 66, 82, 28, 6, "#4f86c6"); R(c, 70, 84, 6, 2, "#ffd36e");
      for (let i = 0; i < 4; i++) A.line(c, 70 + i * 6, 88, 20 + i * 8, 89, ["#d24a3c", "#f2c14e", "#5aa83a", "#ffffff"][i]);
      R(c, 112, 20, 34, 22, "#3b2414"); R(c, 114, 22, 30, 18, "#0f2236"); A.line(c, 116, 34, 124, 28, "#5aa83a"); A.line(c, 124, 28, 132, 32, "#5aa83a"); A.line(c, 132, 32, 142, 24, "#5aa83a");
    } else if (kind === "shunt") {
      R(c, 0, 0, 160, 90, "#14203a");
      const cols = ["#2a4bd7", "#2f7de0", "#2fc0d8", "#46d38a", "#c9e04a", "#f2b33d", "#e8553a"];
      for (let x = 10; x < 150; x++) for (let y = 34; y < 56; y++) {
        const t = Math.abs(y - 45) / 11, k = Math.max(0, Math.min(6, Math.round((1 - t) * 4 + Math.sin(x / 9) * 1.2 + (x > 110 ? 1.5 : 0))));
        R(c, x, y, 1, 1, cols[k]);
      }
      R(c, 8, 32, 144, 2, "#e8eef5"); R(c, 8, 56, 144, 2, "#e8eef5");
      [[30, 32], [55, 56], [80, 32], [105, 56], [125, 32]].forEach(([x, y]) => R(c, x, y, 6, 2, "#14203a"));
      R(c, 150, 32, 4, 26, "#e8eef5");
      for (let i = 0; i < 6; i++) { const y = 14 + i * 12; for (let x = 4; x < 156; x += 6) R(c, x, y + Math.round(Math.sin((x + i * 20) / 14) * 2), 3, 1, "rgba(160,220,255,.55)"); }
      for (let i = 0; i < 7; i++) R(c, 10 + i * 8, 80, 8, 5, cols[i]);
      R(c, 70, 79, 80, 7, "#14203a");
    } else if (kind === "desk") {
      R(c, 0, 0, 160, 90, "#3a2b4f"); R(c, 0, 70, 160, 20, "#9c6b3c"); R(c, 0, 70, 160, 3, "#c99459");
      R(c, 46, 16, 64, 46, "#1b1b24"); R(c, 50, 20, 56, 34, "#203a5c");
      A.disc(c, 62, 30, 5, "#f2c14e"); R(c, 56, 40, 16, 1, "#9ad9f7"); R(c, 58, 43, 10, 1, "#9ad9f7");
      A.line(c, 76, 44, 82, 36, "#5aa83a"); A.line(c, 82, 36, 88, 40, "#5aa83a"); A.line(c, 88, 40, 100, 26, "#5aa83a");
      R(c, 76, 47, 26, 2, "#e8eef5"); R(c, 76, 51, 18, 2, "#7aa7dd");
      R(c, 74, 62, 8, 8, "#1b1b24"); R(c, 62, 68, 32, 4, "#1b1b24");
      R(c, 118, 40, 20, 30, "#1b1b24"); for (let y = 44; y < 66; y += 3) for (let x = 121; x < 136; x += 3) R(c, x, y, 2, 2, "#555");
      R(c, 24, 50, 6, 20, "#c7ced6"); A.disc(c, 27, 46, 5, "#c7ced6"); R(c, 25, 43, 4, 6, "#7a8692");
      R(c, 8, 10, 30, 16, "#fff7e6"); R(c, 14, 26, 5, 4, "#fff7e6"); R(c, 12, 15, 4, 4, "#3b2414"); R(c, 18, 15, 4, 4, "#3b2414"); R(c, 26, 15, 6, 4, "#d24a3c");
    } else if (kind === "brain") {
      R(c, 0, 0, 160, 90, "#1e2346");
      A.ellipse(c, 80, 42, 30, 22, "#3b2414"); A.ellipse(c, 80, 42, 28, 20, "#f39ab4"); A.ellipse(c, 76, 38, 18, 12, "#f7b6c8");
      for (let i = 0; i < 6; i++) A.line(c, 58 + i * 8, 28 + (i % 2) * 6, 64 + i * 8, 52 - (i % 2) * 8, "#d9718f");
      R(c, 79, 22, 2, 40, "#d9718f");
      for (let x = 0; x < 160; x++) { const y = 78 + Math.round(Math.sin(x / 3) * (x % 40 < 20 ? 2 : 5)); R(c, x, y, 1, 1, "#7ad6ff"); }
      for (let x = 0; x < 160; x++) { const y = 12 + Math.round(Math.sin(x / 5 + 1) * 3); R(c, x, y, 1, 1, "#b6ff8a"); }
    } else if (kind === "heart") {
      R(c, 0, 0, 160, 90, "#1a2b2a");
      for (let x = 0; x < 160; x += 8) R(c, x, 0, 1, 90, "#203836"); for (let y = 0; y < 90; y += 8) R(c, 0, y, 160, 1, "#203836");
      const hx = 80, hy = 34;
      [[-8, -6, 9], [8, -6, 9]].forEach(([dx, dy, r]) => A.disc(c, hx + dx, hy + dy, r + 1, "#3b2414"));
      for (let y = 0; y < 16; y++) R(c, hx - 17 + y, hy + y - 2, 34 - y * 2, 1, "#3b2414");
      [[-8, -6, 9], [8, -6, 9]].forEach(([dx, dy, r]) => A.disc(c, hx + dx, hy + dy, r, "#e2333f"));
      for (let y = 0; y < 15; y++) R(c, hx - 16 + y, hy + y - 2, 32 - y * 2, 1, "#e2333f");
      A.disc(c, hx - 11, hy - 9, 3, "#ff7a86");
      const pts = [[0, 70], [40, 70], [48, 70], [52, 60], [56, 82], [62, 52], [68, 74], [72, 70], [110, 70], [118, 70], [122, 62], [126, 80], [131, 56], [136, 72], [140, 70], [160, 70]];
      for (let i = 0; i < pts.length - 1; i++) A.line(c, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], "#5bf09a");
    }
    return cv;
  };

  /* ------------------------------------------------------------------
     PROJECTS — the barn
     ------------------------------------------------------------------ */
  function crateWin(p) {
    if (p.image) return `<div class="c-win" style="background-image:url('${p.image}')"></div>`;
    return `<div class="c-win" data-art="${p.art}"></div>`;
  }
  function fillArt(root) {
    F.$$("[data-art]", root).forEach((el) => {
      const cv = P.projArt(el.getAttribute("data-art"));
      const px = cv.getContext("2d").getImageData(1, 1, 1, 1).data;
      el.style.background = `rgb(${px[0]},${px[1]},${px[2]})`;
      el.appendChild(cv);
    });
  }
  P.register("projects", {
    bodyCls: "",
    render(body, sub, ctx) {
      const list = D().projects;
      const proj = sub && list.find((p) => p.id === sub);
      if (proj) return renderProject(body, proj, list);
      const feat = list.find((p) => p.featured);
      const rest = list.filter((p) => !p.featured);
      body.innerHTML = `<div class="pad barn-bg" style="min-height:100%">
        <p class="lead">Every crate in this barn holds something I've built, simulated or tested. Pick one and pry it open.</p>
        ${feat ? `<button class="card featured" data-proj="${feat.id}" style="border:0;text-align:left;width:100%;cursor:pointer">
          <div class="f-img" style="background-image:url('${feat.image}')"><span class="ribbon-tag">${F.icon("star", 14)} Featured</span></div>
          <div class="f-body"><div class="kicker">${F.esc(feat.subtitle)}</div><h3 style="font-size:30px">${F.esc(feat.title)}</h3>
            <p>${F.esc(feat.summary)}</p><div class="chips" style="margin-bottom:14px">${feat.tags.map((t) => `<span class="chip">${F.esc(t)}</span>`).join("")}</div>
            <span class="btn green">${F.icon("arrow", 18)} Open this crate</span></div>
        </button>` : ""}
        <div class="crate-grid">${rest.map((p) => `<button class="crate" data-proj="${p.id}">${crateWin(p)}<div class="c-label"><div class="c-title">${F.esc(p.title)}</div><div class="c-sub">${F.esc(p.subtitle)}</div><div class="chips">${p.tags.slice(0, 3).map((t) => `<span class="chip">${F.esc(t)}</span>`).join("")}</div></div></button>`).join("")}</div>
        <div class="haybale">${secret("barn", "Rummage through the hay bale", 30)}<span>A hay bale. It looks like someone hid something in it…</span></div>
      </div>`;
      fillArt(body);
      F.$$("[data-proj]", body).forEach((b) => (b.onclick = () => { F.audio.play("page"); F.open("projects", b.getAttribute("data-proj")); }));
      void ctx;
    }
  });

  function renderProject(body, p, list) {
    const i = list.indexOf(p), prev = list[(i - 1 + list.length) % list.length], next = list[(i + 1) % list.length];
    const imgs = (arr, wide) => `<div class="thumbs ${wide ? "wide" : ""}">${arr.map(([src, cap]) => `<button class="thumb" data-lb="${F.esc(src)}|${F.esc(cap)}"><img src="${F.esc(src)}" alt="${F.esc(cap)}" loading="lazy"><span>${F.esc(cap)}</span></button>`).join("")}</div>`;
    const sec = (s) => `<div class="proj-sec"><h4>${F.esc(s.h)}</h4>
      ${s.formula ? `<div class="formula">${F.esc(s.formula)}</div>` : ""}
      ${s.p ? `<p>${F.esc(s.p)}</p>` : ""}
      ${s.list ? `<ul>${s.list.map((x) => `<li>${F.esc(x)}</li>`).join("")}</ul>` : ""}
      ${s.stats ? `<div class="stats">${s.stats.map(([b, t]) => `<div class="statbox"><b>${F.esc(b)}</b><span>${F.esc(t)}</span></div>`).join("")}</div>` : ""}
      ${s.images ? imgs(s.images, /poster|chart|image\.png/i.test(s.images.map((x) => x[0]).join(" ")) || s.images.length < 2) : ""}
    </div>`;
    const hero = p.image ? `<button class="proj-hero" style="background-image:url('${p.image}')" data-lb="${F.esc(p.image)}|${F.esc(p.title)}" aria-label="View image larger"></button>` : `<div class="proj-hero" data-art="${p.art}"></div>`;
    body.innerHTML = `<div class="pad">
      <div class="row" style="justify-content:space-between;margin-bottom:16px">
        ${btn(F.icon("arrowLeft", 16) + " Back to the barn", 'data-back="1"', "sm wood")}
        <div class="row">${btn(F.icon("arrowLeft", 14), `data-proj="${prev.id}" aria-label="Previous project: ${F.esc(prev.title)}"`, "sm paper")}${btn(F.icon("arrow", 14), `data-proj="${next.id}" aria-label="Next project: ${F.esc(next.title)}"`, "sm paper")}</div>
      </div>
      ${hero}
      <div class="kicker">${F.esc(p.subtitle)}</div>
      <h3 style="font-size:32px">${F.esc(p.title)}</h3>
      <div class="proj-meta">${p.year ? `<span>${F.icon("calendar", 16)} ${F.esc(p.year)}</span>` : ""}${p.role ? `<span>${F.icon("wrench", 16)} ${F.esc(p.role)}</span>` : ""}</div>
      <div class="chips">${p.tags.map((t) => `<span class="chip">${F.esc(t)}</span>`).join("")}</div>
      <p class="lead" style="margin-top:14px">${F.esc(p.summary)}</p>
      ${(p.sections || []).map(sec).join("")}
      ${p.credits ? `<p class="credits">${F.esc(p.credits)}</p>` : ""}
      ${p.links ? `<div class="row" style="margin-top:16px">${p.links.map((l) => link((l.kind === "mail" ? F.icon("envelope", 18) : F.icon("arrow", 18)) + " " + F.esc(l.label), l.href, l.kind === "mail" ? "paper" : "green", l.kind !== "mail")).join("")}</div>` : ""}
      <div class="divider"></div>
      <div class="row" style="justify-content:space-between">${btn(F.icon("arrowLeft", 16) + " " + F.esc(prev.title), `data-proj="${prev.id}"`, "sm paper")}${btn(F.esc(next.title) + " " + F.icon("arrow", 16), `data-proj="${next.id}"`, "sm paper")}</div>
    </div>`;
    fillArt(body);
    F.$("[data-back]", body).onclick = () => { F.audio.play("page"); F.open("projects"); };
    F.$$("[data-proj]", body).forEach((b) => (b.onclick = () => { F.audio.play("page"); F.open("projects", b.getAttribute("data-proj")); }));
    wireCommon(body);
  }

  /* ------------------------------------------------------------------
     RÉSUMÉ — the noticeboard
     ------------------------------------------------------------------ */
  P.register("resume", {
    render(body) {
      const d = D(), p = d.person, e = d.education;
      body.innerHTML = `<div class="pad cork" style="min-height:100%"><div class="notes">
        <div class="note yellow"><span class="pin"></span><h3>${F.icon("doc", 22)} My résumé</h3>
          <p style="font-size:14.5px">Two flavors, same person. Pick the one that fits your role.</p>
          <div class="resume-btns">${p.resumes.map((r) => `<div class="rb"><span class="rb-l">${F.esc(r.label)}</span>${link(F.icon("arrow", 16) + " View", r.file, "sm green")}<a class="btn sm paper" href="${F.esc(r.file)}" download>${F.icon("download", 16)} Download</a></div>`).join("")}</div>
        </div>
        <div class="note"><span class="pin"></span><h3>${F.icon("cap", 22)} Education</h3>
          <div class="item"><b>${F.esc(e.school)}</b><span>${F.esc(e.degree)}<br>${F.esc(e.grad)}</span></div>
          <ul style="font-size:14.5px">${e.details.map((x) => `<li>${F.esc(x)}</li>`).join("")}</ul>
        </div>
        <div class="note green"><span class="pin"></span><h3>${F.icon("star", 22)} At a glance</h3>
          <div class="hl-grid">${d.highlights.map(([b, t]) => `<div><b>${F.esc(b)}</b><span>${F.esc(t)}</span></div>`).join("")}</div>
        </div>
        <div class="note pink">${secret("board", "A pushpin that looks like an acorn", 26).replace('class="secret"', 'class="secret pin"')}<h3>${F.icon("heart", 22)} Leadership & involvement</h3>
          ${d.leadership.map((l) => `<div class="item"><b>${F.esc(l.title)}</b><span>${F.esc(l.text)}</span></div>`).join("")}
        </div>
        <div class="note blue"><span class="pin"></span><h3>${F.icon("envelope", 22)} Say hello</h3>
          <div class="item"><b>Email</b><span><a href="mailto:${p.email}">${F.esc(p.email)}</a></span></div>
          <div class="item"><b>LinkedIn</b><span><a href="${p.linkedin}" target="_blank" rel="noopener">linkedin.com/in/pranavi-paudel</a></span></div>
          <div class="item"><b>Based in</b><span>${F.esc(p.location)}</span></div>
          ${btn(F.icon("mailbox", 18) + " Send a carrier pigeon", 'data-go="contact"', "sm")}
        </div>
        <div class="note wanted"><span class="pin"></span><div class="kicker" style="color:#6b3416">Now hiring?</div><div class="w-title">WANTED</div>
          <p style="margin:10px 0 6px">A team that builds real things: medical devices, machines, production lines.</p>
          <p style="font-size:14.5px" class="muted">Reward: one curious, hardworking engineer who already knows where the shop floor is.</p>
          ${btn(F.icon("cart", 18) + " See my journey", 'data-go="experience"', "sm wood")}
        </div>
      </div></div>`;
      wireCommon(body);
    }
  });

  /* ------------------------------------------------------------------
     CERTIFICATIONS — the fair booth
     ------------------------------------------------------------------ */
  const RIB = { blue: ["#3f78c4", "#2a5a96"], red: ["#d24a3c", "#9b3226"], yellow: ["#e8b13c", "#bb8a22"], purple: ["#8a5cc0", "#64408f"], green: ["#4f9a3c", "#356e28"], orange: ["#e07b28", "#a8561a"], teal: ["#2fa3a0", "#1f7472"] };
  P.rosette = function (color, label) {
    const [cv, c] = A.mk(30, 38);
    const [a, b] = RIB[color] || RIB.blue;
    A.R(c, 8, 18, 6, 19, "#3b2414"); A.R(c, 9, 18, 4, 17, a); A.R(c, 16, 18, 6, 19, "#3b2414"); A.R(c, 17, 18, 4, 17, b);
    A.R(c, 9, 34, 2, 2, "#3b2414"); A.R(c, 19, 34, 2, 2, "#3b2414");
    for (let i = 0; i < 12; i++) { const ang = (i / 12) * Math.PI * 2; A.disc(c, Math.round(15 + Math.cos(ang) * 10), Math.round(14 + Math.sin(ang) * 10), 4, "#3b2414"); }
    for (let i = 0; i < 12; i++) { const ang = (i / 12) * Math.PI * 2; A.disc(c, Math.round(15 + Math.cos(ang) * 10), Math.round(14 + Math.sin(ang) * 10), 3, i % 2 ? a : b); }
    A.disc(c, 15, 14, 8, "#3b2414"); A.disc(c, 15, 14, 7, "#f6e7b0"); A.disc(c, 15, 14, 5, "#fff4cc");
    A.R(c, 13, 11, 5, 1, "#c98d1e"); A.R(c, 12, 13, 7, 2, "#f2c14e"); A.R(c, 13, 15, 5, 2, "#f2c14e"); A.R(c, 14, 17, 3, 1, "#c98d1e");
    cv.className = "rosette"; cv.setAttribute("role", "img"); cv.setAttribute("aria-label", label || "ribbon");
    cv.style.imageRendering = "pixelated";
    return cv;
  };
  P.register("certs", {
    bodyCls: "",
    render(body) {
      const list = D().certs;
      body.innerHTML = `<div class="awning"></div><div class="pad booth-intro">
        <p class="lead">Every fair has a prize table. These are the ribbons I've earned so far. Tap a certificate to see the real thing.</p>
        <div class="ribbons">${list.map((c) => `<article class="card rcard" data-c="${c.id}"><div class="ros"></div><div>
          <div class="r-title">${F.esc(c.title)}</div><div class="r-iss">${F.esc(c.issuer)}</div>
          <div class="r-meta">${c.date ? `<span>${F.esc(c.date)}</span>` : ""}${c.credId ? `<span class="nw">ID ${F.esc(c.credId)}</span>` : ""}</div>
          <p class="r-note">${F.esc(c.note)}</p>
          <div class="row">${c.verify ? link(F.icon("check", 16) + " Verify", c.verify, "sm green") : ""}${c.pdf ? link(F.icon("doc", 16) + " PDF", encodeURI(c.pdf), "sm paper") : ""}</div>
          ${c.image ? `<button class="r-img" data-lb="${F.esc(c.image)}|${F.esc(c.title)}" aria-label="View ${F.esc(c.title)} certificate"><img src="${F.esc(c.image)}" alt="" loading="lazy"></button>` : ""}
        </div></article>`).join("")}</div>
        <div class="prize">${secret("booth", "The prize pumpkin", 34)}<span>The blue-ribbon pumpkin looks a little… hollow?</span></div>
      </div>`;
      list.forEach((c) => { const slot = F.$(`[data-c="${c.id}"] .ros`, body); slot.appendChild(P.rosette(c.ribbon, c.title)); });
      wireCommon(body);
    }
  });

  /* ------------------------------------------------------------------
     HOBBIES — the secret greenhouse
     ------------------------------------------------------------------ */
  P.plant = function (h, stage) {
    const [cv, c] = A.mk(28, 35);
    const R = A.R, O = "#3b2414";
    const col = h.color || "#f7a1c4", cen = h.center || "#ffd23f";
    // pot
    R(c, 6, 24, 16, 3, O); R(c, 7, 25, 14, 1, "#d9784a");
    for (let y = 27; y < 35; y++) { const w = 7 - Math.floor((y - 27) / 3); R(c, 14 - w - 1, y, w * 2 + 2, 1, O); R(c, 14 - w, y, w * 2, 1, y < 29 ? "#c8643a" : "#b4552f"); }
    R(c, 8, 28, 2, 4, "#de8a5c");
    R(c, 8, 23, 12, 2, "#5e3719");
    if (stage === 0) {
      R(c, 13, 17, 2, 7, "#3c7a2a"); R(c, 10, 17, 3, 2, "#5aa83a"); R(c, 15, 15, 3, 2, "#5aa83a"); R(c, 10, 16, 2, 1, "#7cc95a");
      A.outline(cv, O, true);
      return cv;
    }
    if (h.plant === "acorn") {
      R(c, 13, 14, 2, 10, "#3c7a2a"); R(c, 9, 18, 4, 2, "#5aa83a"); R(c, 15, 16, 4, 2, "#5aa83a");
      const ac = A.acorn().cv; c.drawImage(ac, 10, 3);
      return cv;
    }
    const stem = (top) => { R(c, 13, top, 2, 24 - top, "#3c7a2a"); R(c, 8, 17, 5, 3, "#5aa83a"); R(c, 15, 14, 5, 3, "#5aa83a"); R(c, 9, 17, 3, 1, "#7cc95a"); R(c, 16, 14, 3, 1, "#7cc95a"); };
    if (h.plant === "tulip") { stem(9); R(c, 9, 3, 10, 7, col); R(c, 9, 1, 2, 3, col); R(c, 13, 0, 2, 4, col); R(c, 17, 1, 2, 3, col); R(c, 10, 4, 2, 4, F.shade(col, 0.3)); R(c, 13, 6, 2, 3, F.shade(col, -0.2)); }
    else if (h.plant === "daisy") { stem(10); for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; A.disc(c, Math.round(14 + Math.cos(a) * 5), Math.round(6 + Math.sin(a) * 5), 2, col); } A.disc(c, 14, 6, 3, cen); R(c, 13, 5, 1, 1, "#fff3a6"); }
    else if (h.plant === "sun") { stem(11); for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; A.disc(c, Math.round(14 + Math.cos(a) * 6), Math.round(7 + Math.sin(a) * 6), 2, col); } A.disc(c, 14, 7, 4, cen); R(c, 12, 5, 1, 1, "#a8753f"); R(c, 15, 8, 1, 1, "#a8753f"); }
    else if (h.plant === "fern") { R(c, 13, 6, 2, 18, "#2f7a49"); for (let y = 6; y < 22; y += 3) { const w = 2 + Math.floor((y - 4) / 3); R(c, 13 - w, y, w, 2, col); R(c, 15, y - 1, w, 2, col); R(c, 13 - w, y, 1, 1, cen); } R(c, 6, 16, 3, 1, "#7cd39a"); }
    else if (h.plant === "lily") { stem(12); R(c, 8, 6, 4, 7, col); R(c, 16, 6, 4, 7, col); R(c, 12, 2, 4, 9, col); R(c, 6, 4, 3, 3, col); R(c, 19, 4, 3, 3, col); R(c, 13, 8, 2, 4, cen); R(c, 12, 4, 1, 4, F.shade(col, 0.35)); }
    else if (h.plant === "rhodo") { R(c, 13, 12, 2, 12, "#5e3719"); R(c, 6, 14, 7, 3, "#2f6b3f"); R(c, 15, 14, 7, 3, "#2f6b3f"); R(c, 8, 18, 5, 2, "#2f6b3f"); for (const [x, y] of [[9, 7], [14, 4], [19, 7], [11, 11], [17, 11], [14, 9]]) { A.disc(c, x, y, 3, col); R(c, x, y - 1, 1, 1, cen); R(c, x - 1, y, 1, 1, F.shade(col, -0.2)); } }
    else if (h.plant === "clover") { R(c, 13, 10, 2, 14, "#3c7a2a"); for (const [x, y] of [[9, 15], [19, 13]]) { A.disc(c, x - 2, y, 2, "#5aa83a"); A.disc(c, x + 2, y, 2, "#5aa83a"); A.disc(c, x, y - 2, 2, "#5aa83a"); } A.disc(c, 14, 6, 5, col); for (let i = 0; i < 6; i++) R(c, 11 + i, 3 + (i % 3) * 2, 1, 1, cen); }
    A.outline(cv, O, true);
    return cv;
  };
  P.register("hobbies", {
    bodyCls: "glasshouse",
    render(body) {
      const list = D().hobbies.slice();
      const mystery = { id: "__mystery", name: "???", plant: "acorn", text: "" };
      const all = list.concat([mystery]);
      const done = new Set(F.store.get("bloomed", []));
      body.innerHTML = `<div class="pad">
        <p class="lead">Welcome to my secret greenhouse. This is where the non-engineering me grows. Tap a pot to see what blooms.</p>
        <div class="row" style="margin-bottom:24px">${btn(F.icon("flower", 18) + " Bloom them all", 'data-all="1"', "sm green")}</div>
        <div class="shelf-grid">${all.map((h) => `<button class="pot" data-h="${h.id}" aria-label="${h.id === "__mystery" ? "An unlabeled pot" : F.esc(h.name)}"><span class="pslot"></span><span class="tag">${F.esc(h.name)}</span></button>`).join("")}</div>
        <div class="card hobby-note" aria-live="polite"><div class="hn-art"></div><div><h4>Pick a pot</h4><p class="muted" style="margin:0">Each plant is something I love doing when I'm not in CAD.</p></div></div>
      </div>`;
      const noteArt = F.$(".hn-art", body), note = F.$(".hobby-note", body);
      const setPlant = (h, stage) => { const slot = F.$(`[data-h="${h.id}"] .pslot`, body); slot.innerHTML = ""; const cv = P.plant(h, stage); cv.className = "plant"; slot.appendChild(cv); };
      all.forEach((h) => setPlant(h, done.has(h.id) && h.id !== "__mystery" ? 1 : 0));
      F.$$(".pot", body).forEach((b) => { if (done.has(b.getAttribute("data-h"))) b.classList.add("bloomed"); });
      const bloom = (h, quiet) => {
        const b = F.$(`[data-h="${h.id}"]`, body);
        if (h.id === "__mystery") {
          if (F.acorns.has("greenhouse")) { setPlant(mystery, 1); note.querySelector("div:last-child").innerHTML = `<h4>Already harvested</h4><p class="muted" style="margin:0">You found the golden acorn that grew here.</p>`; return; }
          setPlant(h, 1); F.audio.play("bloom");
          setTimeout(() => F.acorns.collect("greenhouse", b), 380);
          note.querySelector("div:last-child").innerHTML = `<h4>A golden acorn!</h4><p style="margin:0">Nobody planted anything here… and yet.</p>`;
          return;
        }
        if (!quiet) F.audio.play("bloom");
        setPlant(h, 1); b.classList.add("bloomed");
        done.add(h.id); F.store.set("bloomed", Array.from(done));
        if (!quiet) {
          noteArt.innerHTML = ""; const big = P.plant(h, 1); big.className = "hn-ic"; noteArt.appendChild(big);
          note.querySelector("div:last-child").innerHTML = `<h4>${F.esc(h.name)}</h4><p style="margin:0">${F.esc(h.text)}</p>`;
        }
      };
      F.$$(".pot", body).forEach((b) => (b.onclick = () => bloom(all.find((h) => h.id === b.getAttribute("data-h")))));
      F.$("[data-all]", body).onclick = () => {
        F.audio.play("bloom");
        list.forEach((h, i) => setTimeout(() => bloom(h, true), i * 90));
        setTimeout(() => {
          note.innerHTML = `<div style="width:100%"><h4>Everything's blooming</h4><ul style="margin:6px 0 0">${list.map((h) => `<li><b>${F.esc(h.name)}:</b> ${F.esc(h.text)}</li>`).join("")}</ul></div>`;
        }, list.length * 90 + 50);
      };
    }
  });

  /* ------------------------------------------------------------------
     ACORN JOURNAL
     ------------------------------------------------------------------ */
  P.register("journal", {
    title: "Acorn Journal", sub: "Golden acorns found around the farm", icon: "acorn", cls: "narrow",
    render(body) {
      const L = F.acorns.list, got = L.filter((a) => F.acorns.has(a.id)).length;
      body.innerHTML = `<div class="pad">
        <p class="lead">There are <b>${L.length} golden acorns</b> hidden around the farm. Find them all to earn something special.</p>
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${L.length}" aria-valuenow="${got}"><i style="width:${(got / L.length) * 100}%"></i></div>
        <div class="journal-list">${L.map((a) => { const has = F.acorns.has(a.id); return `<div class="jrow ${has ? "got" : ""}">${F.icon("acorn", 30, has ? "" : "dim")}<div><b>${has ? F.esc(a.name) : "Not found yet"}</b><span>${F.esc(a.hint)}</span></div>${a.go && !has ? btn("Go", `data-g="${a.go}"`, "sm paper") : has ? F.icon("check", 22) : ""}</div>`; }).join("")}</div>
        ${got >= L.length ? `<div class="row" style="margin-top:18px">${btn(F.icon("cup", 18) + " See my Golden Acorn Pass", 'data-vip="1"')}</div>` : ""}
      </div>`;
      F.$$("[data-g]", body).forEach((b) => (b.onclick = () => { const g = b.getAttribute("data-g"); if (g.startsWith("walk:")) { P.close(true); F.world.walkToAcorn(g.slice(5)); } else F.open(g); }));
      const v = F.$("[data-vip]", body); if (v) v.onclick = () => F.open("vip");
    }
  });

  /* ------------------------------------------------------------------
     GOLDEN ACORN PASS (all acorns found)
     ------------------------------------------------------------------ */
  P.register("vip", {
    title: "Golden Acorn Pass", sub: "You found every acorn!", icon: "acorn", cls: "narrow auto-h",
    render(body) {
      const p = D().person;
      let no = F.store.get("ticketNo", null);
      if (!no) { no = String(1000 + Math.floor(Math.random() * 9000)); F.store.set("ticketNo", no); }
      const subj = `Golden Acorn Pass #${no}: let's grab a coffee!`;
      const bodyTxt = `Hi Pranavi,\n\nI found all ${F.acorns.list.length} golden acorns on your farm and I'm redeeming my pass for a coffee (or chai) chat.\n\nA few times that work for me:\n- \n- \n\n`;
      const book = p.bookingLink ? p.bookingLink : F.mailto(subj, bodyTxt);
      body.innerHTML = `<div class="vip-wrap">
        <div class="ticket" role="img" aria-label="Golden Acorn Pass ticket">
          <div class="t-top"><span>ADMIT ONE</span><span>No. ${no}</span></div>
          <div class="t-title">GOLDEN ACORN PASS</div>
          <div class="t-sub">Good for one coffee (or chai) chat with Pranavi</div>
          <p class="t-note">Thank you for exploring every corner of my farm. Most visitors never find all the acorns. You did, which tells me you're curious and thorough. That's exactly the kind of person I'd love to talk engineering with.</p>
          <div class="t-sign">— Pranavi ✿</div>
        </div>
        <div class="row" style="justify-content:center">
          ${link(F.icon("cup", 18) + (p.bookingLink ? " Book our coffee chat" : " Claim my coffee chat"), book, "green lg", !!p.bookingLink)}
          ${link(F.icon("download", 18) + " Résumé", p.resumes[0].file, "paper lg")}
        </div>
        <p class="muted" style="margin:0;text-align:center;font-size:14px">Your pass is saved in the Acorn Journal (☰ menu) if you want to come back to it.</p>
      </div>`;
      F.confetti();
    }
  });

  /* ------------------------------------------------------------------
     CONTROLS / HELP
     ------------------------------------------------------------------ */
  P.register("help", {
    title: "How to play", sub: "Farm controls", icon: "book", cls: "narrow auto-h",
    render(body) {
      body.innerHTML = `<div class="pad">
        <div class="card" style="margin-bottom:12px"><h4>Walk around</h4><p style="margin:0">Tap or click anywhere on the ground. On a keyboard, use <b>WASD</b> or the <b>arrow keys</b>.</p></div>
        <div class="card" style="margin-bottom:12px"><h4>Go inside</h4><p style="margin:0">Tap a building or its sign, or stand next to it and press <b>E</b>, <b>Space</b> or <b>Enter</b>. Keys <b>1–8</b> jump straight to each section.</p></div>
        <div class="card" style="margin-bottom:12px"><h4>Golden acorns</h4><p style="margin:0">${F.acorns.list.length} are hidden around the farm and inside the buildings. The Acorn Journal in the ☰ menu has hints.</p></div>
        <div class="card"><h4>In a hurry?</h4><p style="margin:0 0 10px">The quick view has everything on one simple page.</p>${btn(F.icon("book", 18) + " Open quick view", 'data-quick="1"', "sm")}</div>
      </div>`;
      wireCommon(body);
    }
  });

  /* ------------------------------------------------------------------
     QUICK VIEW (recruiter mode): one clean, printable page
     ------------------------------------------------------------------ */
  F.quick = {
    open() {
      const el = F.$("#quick");
      const d = D(), p = d.person;
      const exp = d.experience.slice().reverse();
      el.innerHTML = `<div class="qv-top"><span>${F.icon("book", 22)}</span><span class="grow"><span class="qv-label">Quick view</span></span>
          <a class="btn sm paper" href="${p.resumes[0].file}" target="_blank" rel="noopener">${F.icon("doc", 16)} Résumé PDF</a>
          <button class="btn sm green" data-close="1">${F.icon("barn", 16)} Back to the farm</button></div>
        <main class="qv">
          <header class="qv-head"><img src="${p.photo}" alt="${F.esc(p.name)}"><div><h1>${F.esc(p.name)}</h1><div class="t">${F.esc(p.title)} · ${F.esc(p.school)}</div>
            <div class="m">${F.esc(p.degree)} · GPA ${F.esc(p.gpa)} · Graduating ${F.esc(p.grad)}</div>
            <div class="m"><a href="mailto:${p.email}">${F.esc(p.email)}</a> · <a href="${p.linkedin}" target="_blank" rel="noopener">LinkedIn</a> · ${p.resumes.map((r) => `<a href="${r.file}" target="_blank" rel="noopener">Résumé (${F.esc(r.short)})</a>`).join(" · ")}</div></div></header>
          <p style="font-size:17px">${F.esc(d.about.intro[0])} ${F.esc(d.about.intro[1])}</p>
          <p><b>Looking for:</b> ${F.esc(p.lookingFor)}</p>
          <h2>Experience</h2>
          ${exp.map((x) => `<div class="qv-item"><div class="h"><b>${F.esc(x.role)}</b><span>${F.esc(x.dates)}${x.location ? " · " + F.esc(x.location) : ""}</span></div><div class="o">${F.esc(x.org)}</div><ul>${x.bullets.map((b) => `<li>${F.esc(b)}</li>`).join("")}</ul></div>`).join("")}
          <h2>Projects</h2>
          <div class="qv-grid">${d.projects.map((x) => `<div class="qv-card"><b>${F.esc(x.title)}</b><span style="font-size:13.5px;color:#6b5a48">${F.esc(x.subtitle)}</span><p>${F.esc(x.summary)}</p>${x.id === "drainwatch" ? `<p><a href="drainwatch_final.html">Full write-up →</a></p>` : ""}</div>`).join("")}</div>
          <h2>Skills</h2>
          <div class="qv-skills">${d.skills.map((g) => `<div class="g"><b>${F.esc(g.group)}:</b> ${g.stars.map((s) => F.esc(s.name)).join(", ")}</div>`).join("")}</div>
          <h2>Certifications</h2>
          <div class="qv-grid">${d.certs.map((c) => `<div class="qv-card"><b>${F.esc(c.title)}</b><p>${F.esc(c.issuer)}${c.date ? " · " + F.esc(c.date) : ""}${c.verify ? ` · <a href="${c.verify}" target="_blank" rel="noopener">verify</a>` : ""}</p></div>`).join("")}</div>
          <h2>Education & leadership</h2>
          <div class="qv-item"><div class="h"><b>${F.esc(d.education.school)}</b><span>${F.esc(d.education.grad)}</span></div><div class="o">${F.esc(d.education.degree)}</div><ul>${d.education.details.map((x) => `<li>${F.esc(x)}</li>`).join("")}</ul></div>
          <ul>${d.leadership.map((l) => `<li><b>${F.esc(l.title)}:</b> ${F.esc(l.text)}</li>`).join("")}</ul>
          <h2>Outside the lab</h2>
          <p>${d.hobbies.map((h) => F.esc(h.name)).join(" · ")}</p>
        </main>`;
      el.hidden = false;
      el.scrollTop = 0;
      F.$("[data-close]", el).onclick = () => F.quick.close();
      F.world.setPaused(true);
      document.addEventListener("keydown", F.quick._key);
      F.audio.play("page");
      if (location.hash !== "#quick") history.replaceState(null, "", "#quick");
    },
    close() {
      const el = F.$("#quick");
      el.hidden = true;
      document.removeEventListener("keydown", F.quick._key);
      if (!F.panel.current()) F.world.setPaused(false);
      if (location.hash === "#quick") history.replaceState(null, "", location.pathname + location.search);
      F.audio.play("close");
      if (F.onQuickClose) F.onQuickClose();
    },
    _key(e) { if (e.key === "Escape") F.quick.close(); },
    isOpen() { return !F.$("#quick").hidden; }
  };

  /* pixel confetti: falling acorns & leaves */
  F.confetti = function () {
    if (F.reduced) return;
    const cv = document.createElement("canvas");
    cv.className = "confetti";
    document.body.appendChild(cv);
    const s = 3, w = Math.ceil(innerWidth / s), h = Math.ceil(innerHeight / s);
    cv.width = w; cv.height = h; cv.style.width = w * s + "px"; cv.style.height = h * s + "px"; cv.style.imageRendering = "pixelated";
    const c = cv.getContext("2d");
    const ac = A.acorn().cv;
    const cols = ["#f2c14e", "#e07b28", "#5aa83a", "#d24a3c", "#ffffff", "#4f86c6"];
    const bits = Array.from({ length: 90 }, () => ({ x: Math.random() * w, y: -Math.random() * h * 0.5, vy: 60 + Math.random() * 60, vx: (Math.random() - 0.5) * 24, a: Math.random() < 0.18, col: cols[(Math.random() * cols.length) | 0], ph: Math.random() * 6 }));
    let t0 = performance.now();
    function f(t) {
      const dt = Math.min(0.05, (t - t0) / 1000); t0 = t;
      c.clearRect(0, 0, w, h);
      let alive = 0;
      bits.forEach((b) => {
        b.y += b.vy * dt; b.x += (b.vx + Math.sin(t / 300 + b.ph) * 10) * dt;
        if (b.y < h + 12) alive++;
        if (b.a) c.drawImage(ac, Math.round(b.x), Math.round(b.y));
        else { c.fillStyle = b.col; c.fillRect(Math.round(b.x), Math.round(b.y), 2, 1 + (Math.floor(t / 120 + b.ph) % 2)); }
      });
      if (alive) requestAnimationFrame(f); else cv.remove();
    }
    requestAnimationFrame(f);
    F.audio.play("fanfare");
  };
})();
