/* =====================================================================
   CONTACT — write a note, a carrier pigeon flies off with it and your
   email app opens with the message already filled in.
   ===================================================================== */
(function () {
  const F = window.FARM, A = F.art;

  function pigeonFrames() {
    const fr = [];
    for (let f = 0; f < 2; f++) {
      const [cv, c] = A.mk(26, 20);
      const R = A.R;
      // body
      A.ellipse(c, 12, 11, 7, 4, "#9aa3ad"); R(c, 7, 13, 10, 2, "#c9ced4");
      // neck + head
      R(c, 16, 6, 5, 6, "#7a8fa0"); R(c, 17, 7, 3, 3, "#6fa58a"); A.disc(c, 20, 6, 3, "#8c96a1");
      R(c, 21, 5, 1, 1, "#e8742c"); R(c, 23, 6, 2, 1, "#3b2414");
      // tail
      R(c, 2, 9, 5, 3, "#7a8592"); R(c, 1, 10, 2, 2, "#5f6670");
      // wing
      if (f) { R(c, 8, 2, 8, 3, "#b7bec6"); R(c, 6, 0, 6, 3, "#c9ced4"); R(c, 9, 5, 7, 4, "#a8b0b9"); }
      else { R(c, 7, 12, 9, 5, "#b7bec6"); R(c, 6, 15, 7, 3, "#c9ced4"); R(c, 9, 10, 7, 3, "#a8b0b9"); }
      R(c, 10, 16, 1, 2, "#e88a9a"); R(c, 13, 16, 1, 2, "#e88a9a");
      A.outline(cv, "#3b2414", true);
      fr.push(cv);
    }
    return fr;
  }
  function envelope() {
    const [cv, c] = A.mk(12, 9);
    A.R(c, 0, 0, 12, 9, "#3b2414"); A.R(c, 1, 1, 10, 7, "#fff7e6"); A.line(c, 1, 1, 6, 5, "#c9b79a"); A.line(c, 10, 1, 6, 5, "#c9b79a"); A.R(c, 5, 5, 2, 2, "#d24a3c");
    return cv;
  }

  F.panel.register("contact", {
    render(body, sub, ctx) {
      const p = F.data.person;
      body.innerHTML = `<div class="pad" style="position:relative">
        <p class="lead">Leave a note in my mailbox and a carrier pigeon will fly it over. (It opens your email app with everything filled in, so nothing gets lost.)</p>
        <div class="mail-grid">
          <div>
            <form class="letter" novalidate>
              <button type="button" class="secret stamp" data-acorn="mail" aria-label="An unusual postage stamp"><span class="st-in">${F.icon("acorn", 34)}</span></button>
              <div class="to">To: ${F.esc(p.name)}</div>
              <label for="pf-name">From</label><input id="pf-name" name="name" autocomplete="name" placeholder="Your name">
              <label for="pf-org">Company, team or school <span style="opacity:.7">(optional)</span></label><input id="pf-org" name="org" autocomplete="organization" placeholder="Where you're writing from">
              <label for="pf-msg">Your note</label><textarea id="pf-msg" name="msg" required placeholder="Hi Pranavi! I found your farm and…"></textarea>
              <div class="row" style="justify-content:space-between"><span class="sig">${F.icon("pigeon", 18)} Delivered by carrier pigeon</span><button class="btn green" type="submit">${F.icon("envelope", 18)} Send by pigeon</button></div>
            </form>
            <div class="card sent-box" hidden aria-live="polite">
              <h3>${F.icon("pigeon", 26)} Your pigeon is on its way!</h3>
              <p>Your email app should be open with the note ready. Just press send. If nothing opened, you can email me directly at <b>${F.esc(p.email)}</b>.</p>
              <div class="row"><button class="btn sm paper" data-copy="1">${F.icon("doc", 16)} Copy my email</button><button class="btn sm green" data-again="1">${F.icon("envelope", 16)} Write another note</button><span class="copy-ok" hidden>Copied!</span></div>
            </div>
          </div>
          <div class="routes">
            <div class="card">
              <h4>Other ways to reach me</h4>
              <a class="route" href="mailto:${p.email}">${F.icon("envelope", 30)}<span><span class="r-t">Email</span><span class="r-s">${F.esc(p.email)}</span></span></a>
              <a class="route" href="mailto:${p.altEmail}">${F.icon("envelope", 30)}<span><span class="r-t">Personal email</span><span class="r-s">${F.esc(p.altEmail)}</span></span></a>
              <a class="route" href="${p.linkedin}" target="_blank" rel="noopener">${F.icon("linkedin", 30)}<span><span class="r-t">LinkedIn</span><span class="r-s">linkedin.com/in/pranavi-paudel</span></span></a>
              <a class="route" href="${p.instagram}" target="_blank" rel="noopener">${F.icon("camera", 30)}<span><span class="r-t">Instagram</span><span class="r-s">@pranavipaudel</span></span></a>
            </div>
            <div class="card"><h4>${F.icon("doc", 20)} Résumé</h4><div class="row">${p.resumes.map((r) => `<a class="btn sm paper" href="${F.esc(r.file)}" target="_blank" rel="noopener">${F.esc(r.short)}</a>`).join("")}</div></div>
            <div class="card"><h4>${F.icon("mountain", 20)} Based in</h4><p style="margin:0">${F.esc(p.location)}</p></div>
          </div>
        </div>
        <div class="pigeon-layer"></div>
      </div>`;
      const form = F.$(".letter", body), sent = F.$(".sent-box", body), layer = F.$(".pigeon-layer", body);
      const msg = F.$("#pf-msg", body);
      let running = true;

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = F.$("#pf-name", body).value.trim(), org = F.$("#pf-org", body).value.trim(), text = msg.value.trim();
        if (!text) { msg.focus(); msg.placeholder = "Write a little something first!"; F.audio.play("nope"); form.animate([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 260 }); return; }
        const subject = `Hello from your farm${name ? " (from " + name + ")" : ""}`;
        const bodyTxt = `${text}\n\n— ${name || "A visitor to your farm"}${org ? ", " + org : ""}`;
        const href = F.mailto(subject, bodyTxt);
        fly(form, layer, () => {
          window.location.href = href;
          form.hidden = true; sent.hidden = false;
        });
      });
      F.$("[data-again]", body).onclick = () => { form.classList.remove("folding"); form.hidden = false; sent.hidden = true; msg.value = ""; msg.focus(); };
      F.$("[data-copy]", body).onclick = () => {
        const ok = F.$(".copy-ok", body);
        const done = () => { ok.hidden = false; setTimeout(() => (ok.hidden = true), 1600); F.audio.play("pop"); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(p.email).then(done, done);
        else done();
      };

      function fly(formEl, layerEl, cb) {
        if (F.reduced) { cb(); return; }
        const frames = pigeonFrames(), env = envelope();
        const S = 4;
        const cv = document.createElement("canvas"); cv.width = 26 + 2; cv.height = 32;
        cv.style.width = cv.width * S + "px"; cv.style.height = cv.height * S + "px";
        const c = cv.getContext("2d"); c.imageSmoothingEnabled = false;
        layerEl.appendChild(cv);
        const lr = layerEl.getBoundingClientRect(), fr = formEl.getBoundingClientRect();
        const tx = fr.left - lr.left + fr.width / 2 - 52, ty = fr.top - lr.top + fr.height / 2 - 70;
        const sx = -140, sy = ty + 120, ex = lr.width + 60, ey = -160;
        formEl.classList.add("folding");
        F.audio.play("coo");
        let t0 = performance.now(), lastFlap = 0;
        function step(now) {
          if (!running) return;
          const t = (now - t0) / 1000;
          let x, y, carrying = false;
          if (t < 0.75) { const k = 1 - Math.pow(1 - t / 0.75, 2); x = sx + (tx - sx) * k; y = sy + (ty - sy) * k - Math.sin(k * Math.PI) * 40; }
          else if (t < 0.95) { x = tx; y = ty + Math.sin((t - 0.75) * 30) * 3; carrying = true; }
          else { const k = Math.min(1, (t - 0.95) / 1.15), e2 = k * k; x = tx + (ex - tx) * e2; y = ty + (ey - ty) * e2 + Math.sin(k * 12) * 10; carrying = true; }
          c.clearRect(0, 0, cv.width, cv.height);
          const f = Math.floor(t * 9) % 2;
          c.drawImage(frames[f], 1, 0);
          if (carrying) c.drawImage(env, 8, 19);
          cv.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
          if (t - lastFlap > 0.16) { lastFlap = t; F.audio.play("flap"); }
          if (t < 2.15) requestAnimationFrame(step);
          else { cv.remove(); F.audio.play("whoosh"); cb(); }
        }
        requestAnimationFrame(step);
      }
      ctx.cleanup = () => { running = false; };
    }
  });
})();
