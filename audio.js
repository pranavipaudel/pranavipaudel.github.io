/* Tiny synthesizer: every sound and the background tune are generated live
   with the Web Audio API, so there are no audio files to host. */
(function () {
  const F = window.FARM;
  let ctx = null, master, sfx, music, noiseBuf;
  let enabled = F.store.get("sound", false);
  let musicOn = F.store.get("music", true);
  let seqTimer = null, nextTime = 0, step = 0;
  const listeners = [];

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.55; master.connect(ctx.destination);
      sfx = ctx.createGain(); sfx.gain.value = 0.6; sfx.connect(master);
      music = ctx.createGain(); music.gain.value = 0.0; music.connect(master);
      const len = ctx.sampleRate * 1.0;
      noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === "suspended") ctx.resume();
    return true;
  }

  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function tone(o) {
    const t = (o.t || 0) + ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = o.type || "square";
    osc.frequency.setValueAtTime(o.f, t);
    if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t + (o.dur || 0.1));
    const v = o.vol == null ? 0.2 : o.vol;
    const a = o.attack || 0.005, dur = o.dur || 0.1;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(o.dest || sfx);
    osc.start(t); osc.stop(t + dur + 0.05);
  }
  function noise(o) {
    const t = (o.t || 0) + ctx.currentTime;
    const src = ctx.createBufferSource(); src.buffer = noiseBuf;
    const fl = ctx.createBiquadFilter(); fl.type = o.filter || "lowpass"; fl.frequency.value = o.freq || 800; fl.Q.value = o.q || 1;
    if (o.freq2) fl.frequency.exponentialRampToValueAtTime(o.freq2, t + (o.dur || 0.1));
    const g = ctx.createGain();
    const v = o.vol == null ? 0.2 : o.vol, dur = o.dur || 0.1;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + (o.attack || 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(fl); fl.connect(g); g.connect(sfx);
    src.start(t, Math.random() * 0.5); src.stop(t + dur + 0.05);
  }

  const SFX = {
    click() { tone({ f: 880, dur: 0.05, vol: 0.08 }); },
    hover() { tone({ f: 1320, dur: 0.03, vol: 0.03, type: "triangle" }); },
    open() { tone({ f: 523, dur: 0.09, vol: 0.1, type: "triangle" }); tone({ f: 784, t: 0.07, dur: 0.14, vol: 0.1, type: "triangle" }); },
    close() { tone({ f: 784, dur: 0.08, vol: 0.08, type: "triangle" }); tone({ f: 523, t: 0.06, dur: 0.12, vol: 0.08, type: "triangle" }); },
    step() { noise({ dur: 0.05, vol: 0.05, freq: 500 }); },
    acorn() { [988, 1319, 1568, 1976, 2637].forEach((f, i) => tone({ f, t: i * 0.06, dur: 0.18, vol: 0.09, type: "triangle" })); },
    bloom() { [523, 659, 784, 1047].forEach((f, i) => tone({ f, t: i * 0.08, dur: 0.25, vol: 0.08, type: "sine" })); },
    star() { tone({ f: 1760, f2: 2093, dur: 0.25, vol: 0.06, type: "sine" }); tone({ f: 2637, t: 0.05, dur: 0.2, vol: 0.03, type: "sine" }); },
    coo() { tone({ f: 420, f2: 330, dur: 0.18, vol: 0.12, type: "sine" }); tone({ f: 400, f2: 300, t: 0.22, dur: 0.25, vol: 0.12, type: "sine" }); },
    flap() { noise({ dur: 0.06, vol: 0.12, filter: "bandpass", freq: 1400, q: 0.8 }); },
    whoosh() { noise({ dur: 0.6, vol: 0.12, filter: "bandpass", freq: 400, freq2: 3000, q: 0.7, attack: 0.15 }); },
    hoof() { noise({ dur: 0.04, vol: 0.1, freq: 900 }); tone({ f: 180, dur: 0.04, vol: 0.05, type: "triangle" }); },
    deliver() { noise({ dur: 0.08, vol: 0.15, freq: 300 }); tone({ f: 1047, t: 0.12, dur: 0.2, vol: 0.08, type: "triangle" }); tone({ f: 1568, t: 0.2, dur: 0.25, vol: 0.06, type: "triangle" }); },
    meow() { tone({ f: 650, f2: 900, dur: 0.15, vol: 0.06, type: "sawtooth" }); tone({ f: 900, f2: 560, t: 0.14, dur: 0.22, vol: 0.05, type: "sawtooth" }); },
    cluck() { [0, 0.09, 0.16].forEach((t) => tone({ f: 700 + Math.random() * 200, f2: 500, t, dur: 0.06, vol: 0.05, type: "square" })); },
    splash() { noise({ dur: 0.3, vol: 0.1, filter: "highpass", freq: 1500, freq2: 600 }); },
    pop() { tone({ f: 300, f2: 900, dur: 0.08, vol: 0.08, type: "sine" }); },
    page() { noise({ dur: 0.12, vol: 0.06, filter: "bandpass", freq: 2500, freq2: 1200 }); },
    fanfare() { [[523, 0], [659, 0.12], [784, 0.24], [1047, 0.36], [784, 0.52], [1047, 0.64]].forEach(([f, t]) => tone({ f, t, dur: t > 0.6 ? 0.6 : 0.16, vol: 0.09, type: "square" })); },
    nope() { tone({ f: 220, dur: 0.12, vol: 0.06 }); }
  };

  /* ---------------- Background tune: a gentle 8-bar loop ---------------- */
  const BPM = 84, EIGHTH = 60 / BPM / 2;
  const melody = [[76, 2], [79, 2], [81, 2], [79, 2], [76, 3], [74, 1], [72, 4], [69, 2], [72, 2], [74, 2], [77, 2], [76, 4], [74, 4],
    [79, 2], [81, 1], [79, 1], [76, 2], [72, 2], [74, 2], [76, 2], [79, 4], [81, 2], [79, 2], [77, 2], [74, 2], [72, 6], [null, 2]];
  const melodySteps = [];
  melody.forEach(([n, len]) => { melodySteps.push([n, len]); for (let i = 1; i < len; i++) melodySteps.push(null); });
  const chords = [[48, [60, 64, 67]], [45, [57, 60, 64]], [41, [53, 57, 60]], [43, [55, 59, 62]], [48, [60, 64, 67]], [40, [52, 55, 59]], [41, [53, 57, 60]], [48, [55, 60, 64]]];
  const arp = [0, 1, 2, 1, 0, 1, 2, 1];

  function schedule() {
    while (nextTime < ctx.currentTime + 0.25) {
      const s = step % 64;
      const bar = Math.floor(s / 8), inBar = s % 8;
      let [bass, tri] = chords[bar];
      if (bar === 6 && inBar >= 4) { bass = 43; tri = [55, 59, 62]; }
      const t = nextTime - ctx.currentTime;
      if (inBar === 0 || inBar === 4) tone({ f: mtof(bass), t, dur: EIGHTH * 3.5, vol: 0.18, type: "triangle", attack: 0.02, dest: music });
      tone({ f: mtof(tri[arp[inBar]]), t, dur: EIGHTH * 1.6, vol: 0.06, type: "sine", attack: 0.01, dest: music });
      const m = melodySteps[s];
      if (m && m[0]) tone({ f: mtof(m[0]), t, dur: EIGHTH * m[1] * 0.95, vol: 0.09, type: "triangle", attack: 0.02, dest: music });
      nextTime += EIGHTH; step++;
    }
  }
  function startMusic() {
    if (!ctx || seqTimer) return;
    nextTime = ctx.currentTime + 0.1;
    music.gain.cancelScheduledValues(ctx.currentTime);
    music.gain.setValueAtTime(music.gain.value, ctx.currentTime);
    music.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.5);
    seqTimer = setInterval(schedule, 60);
    schedule();
  }
  function stopMusic() {
    if (!ctx || !seqTimer) return;
    clearInterval(seqTimer); seqTimer = null;
    music.gain.cancelScheduledValues(ctx.currentTime);
    music.gain.setValueAtTime(music.gain.value, ctx.currentTime);
    music.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
  }
  function sync() {
    if (enabled && musicOn) { if (ensure()) startMusic(); } else stopMusic();
    listeners.forEach((fn) => fn());
  }

  F.audio = {
    get enabled() { return enabled; },
    get musicOn() { return musicOn; },
    play(name) {
      if (!enabled || !SFX[name]) return;
      if (!ensure()) return;
      try { SFX[name](); } catch (e) { /* ignore */ }
    },
    setEnabled(v) { enabled = !!v; F.store.set("sound", enabled); if (enabled) ensure(); sync(); if (enabled) SFX.click(); },
    toggle() { this.setEnabled(!enabled); },
    setMusic(v) { musicOn = !!v; F.store.set("music", musicOn); sync(); },
    onChange(fn) { listeners.push(fn); },
    /* call from a user gesture so browsers allow audio */
    unlock() { if (enabled) { ensure(); sync(); } }
  };
})();
