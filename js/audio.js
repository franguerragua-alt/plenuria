'use strict';
// Audio sintetizado: efectos + música procedural por planeta
P.Audio = {
  ac: null, master: null, mus: null, fx: null, noiseBuf: null, track: null, nextT: 0, step: 0, timer: null, lastSfx: {},
  unlock() {
    if (this.ac) { if (this.ac.state === 'suspended') this.ac.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    this.ac = new AC();
    this.master = this.ac.createGain(); this.master.gain.value = 0.9; this.master.connect(this.ac.destination);
    const comp = this.ac.createDynamicsCompressor(); comp.connect(this.master);
    this.mus = this.ac.createGain(); this.mus.connect(comp);
    this.fx = this.ac.createGain(); this.fx.connect(comp);
    // eco suave para la música
    const dl = this.ac.createDelay(); dl.delayTime.value = 0.28; const fb = this.ac.createGain(); fb.gain.value = 0.28;
    const wet = this.ac.createGain(); wet.gain.value = 0.35; this.mus.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(comp);
    this.applyVolume();
    const n = this.ac.sampleRate; this.noiseBuf = this.ac.createBuffer(1, n, n);
    const d = this.noiseBuf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    if (this.pending) { const p = this.pending; this.pending = null; this.music(p.id, p.variant); }
  },
  applyVolume() { if (!this.ac) return; this.mus.gain.value = P.settings.music * 0.55; this.fx.gain.value = P.settings.sfx * 0.7; },
  tone(f, dur, type = 'square', vol = 0.2, slide = 0, when = 0, dest, att = 0.005) {
    if (!this.ac) return;
    const t = this.ac.currentTime + when, o = this.ac.createOscillator(), g = this.ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, slide), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + att); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || this.fx); o.start(t); o.stop(t + dur + 0.05);
  },
  noise(dur, vol = 0.2, freq = 2000, when = 0, dest, type = 'lowpass', slide = 0) {
    if (!this.ac) return;
    const t = this.ac.currentTime + when, s = this.ac.createBufferSource(), f = this.ac.createBiquadFilter(), g = this.ac.createGain();
    s.buffer = this.noiseBuf; s.loop = true; f.type = type; f.frequency.setValueAtTime(freq, t);
    if (slide) f.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest || this.fx); s.start(t, Math.random()); s.stop(t + dur + 0.05);
  },
  sfx(name) {
    if (!this.ac) return;
    const now = performance.now();
    if (this.lastSfx[name] && now - this.lastSfx[name] < 35) return;
    this.lastSfx[name] = now;
    const T = this.tone.bind(this), N = this.noise.bind(this);
    switch (name) {
      case 'shoot': T(880, 0.08, 'square', 0.07, 300); T(1760, 0.04, 'sine', 0.05, 800); break;
      case 'spine': T(600, 0.07, 'sawtooth', 0.06, 1400); N(0.06, 0.08, 4000, 0, null, 'highpass'); break;
      case 'eshoot': T(420, 0.12, 'sawtooth', 0.05, 160); break;
      case 'laser': T(220, 0.5, 'sawtooth', 0.09, 110); T(1200, 0.5, 'square', 0.03, 900); break;
      case 'charge': T(200, 0.7, 'triangle', 0.1, 900); break;
      case 'hit': N(0.08, 0.18, 2500); T(200, 0.06, 'square', 0.06, 90); break;
      case 'ehit': N(0.05, 0.12, 3500); T(330, 0.05, 'square', 0.05, 160); break;
      case 'explode': N(0.5, 0.35, 1200, 0, null, 'lowpass', 80); T(90, 0.4, 'sine', 0.25, 30); break;
      case 'bigexplode': N(1.2, 0.45, 1500, 0, null, 'lowpass', 50); T(60, 1.0, 'sine', 0.35, 25); break;
      case 'jump': T(300, 0.12, 'square', 0.06, 620); break;
      case 'djump': T(500, 0.14, 'triangle', 0.08, 1100); N(0.1, 0.06, 6000, 0, null, 'highpass'); break;
      case 'dash': N(0.18, 0.15, 3000, 0, null, 'bandpass', 600); break;
      case 'land': N(0.06, 0.08, 500); break;
      case 'step': N(0.03, 0.03, 900); break;
      case 'pickup': T(988, 0.07, 'square', 0.06); T(1319, 0.1, 'square', 0.06, 0, 0.06); break;
      case 'xp': T(1568 + Math.random() * 300, 0.05, 'sine', 0.05); break;
      case 'heal': T(523, 0.15, 'sine', 0.08); T(784, 0.2, 'sine', 0.08, 0, 0.1); T(1047, 0.3, 'sine', 0.07, 0, 0.2); break;
      case 'hurt': T(260, 0.2, 'sawtooth', 0.12, 80); N(0.15, 0.15, 1500); break;
      case 'shield': T(660, 0.12, 'sine', 0.06, 990); break;
      case 'block': T(1200, 0.08, 'triangle', 0.09, 700); N(0.05, 0.08, 5000, 0, null, 'highpass'); break;
      case 'parry': T(1568, 0.25, 'triangle', 0.12); T(2093, 0.3, 'sine', 0.1, 0, 0.05); break;
      case 'super': T(110, 1.2, 'sawtooth', 0.15, 880); N(1.2, 0.2, 400, 0, null, 'lowpass', 6000); break;
      case 'select': T(1046, 0.05, 'square', 0.05); break;
      case 'move': T(660, 0.03, 'square', 0.035); break;
      case 'back': T(520, 0.06, 'square', 0.05, 330); break;
      case 'blip': T(700 + Math.random() * 120, 0.025, 'square', 0.025); break;
      case 'unlock': [523, 659, 784, 1047, 1319].forEach((f, i) => T(f, 0.25, 'triangle', 0.08, 0, i * 0.08)); break;
      case 'levelup': [392, 523, 659, 784, 1047].forEach((f, i) => T(f, 0.3, 'square', 0.06, 0, i * 0.07)); T(1568, 0.6, 'triangle', 0.07, 0, 0.35); break;
      case 'codex': T(880, 0.1, 'sine', 0.07); T(1320, 0.18, 'sine', 0.07, 0, 0.08); T(1760, 0.25, 'sine', 0.05, 0, 0.16); break;
      case 'door': N(0.4, 0.12, 600, 0, null, 'bandpass', 200); T(140, 0.3, 'square', 0.04, 70); break;
      case 'roar': N(1.0, 0.3, 500, 0, null, 'bandpass', 150); T(70, 1.0, 'sawtooth', 0.15, 40); T(95, 0.9, 'sawtooth', 0.1, 55); break;
      case 'splash': N(0.3, 0.12, 1800, 0, null, 'bandpass', 400); break;
      case 'break': N(0.25, 0.22, 900); T(120, 0.15, 'square', 0.08, 50); break;
      case 'checkpoint': [784, 988, 1175].forEach((f, i) => T(f, 0.2, 'sine', 0.08, 0, i * 0.07)); break;
      case 'scan': T(1400, 0.4, 'sine', 0.04, 2400); T(700, 0.4, 'sine', 0.03, 1200); break;
      case 'restore': [262, 330, 392, 523, 659, 784, 1047].forEach((f, i) => T(f, 0.8, 'sine', 0.07, 0, i * 0.09)); N(1.5, 0.08, 3000, 0, null, 'highpass'); break;
      case 'bark': N(0.12, 0.2, 700, 0, null, 'bandpass'); T(320, 0.1, 'sawtooth', 0.08, 180); break;
      case 'nova': this.novaVoice(); break;
      case 'death': [440, 370, 311, 262, 196].forEach((f, i) => T(f, 0.3, 'square', 0.07, 0, i * 0.12)); break;
      case 'victory': [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => T(f, 0.3, 'square', 0.07, 0, i * 0.11)); break;
    }
  },
  // voz femenina breve de NOVA: síntesis de voz del navegador + campanilla
  novaVoice() {
    [1319, 1568, 2093].forEach((f, i) => this.tone(f, 0.4, 'sine', 0.06, 0, i * 0.06));
    try {
      if (!window.speechSynthesis) throw 0;
      const u = new SpeechSynthesisUtterance(P.pick(['¡Te tengo!', '¡Aquí estoy!', '¡No te rindas!']));
      u.lang = 'es-ES'; u.pitch = 1.6; u.rate = 1.15; u.volume = Math.min(1, P.settings.sfx + 0.1);
      const vs = speechSynthesis.getVoices().filter(v => v.lang && v.lang.startsWith('es'));
      const fem = vs.find(v => /helena|laura|sabina|paulina|monica|mónica|elvira|lucia|lucía|female|mujer|google español/i.test(v.name));
      if (fem || vs[0]) u.voice = fem || vs[0];
      speechSynthesis.speak(u);
    } catch (e) {
      // respaldo: vocal sintetizada con formantes
      const t = this.ac.currentTime, o = this.ac.createOscillator(), g = this.ac.createGain();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(330, t); o.frequency.linearRampToValueAtTime(440, t + 0.15); o.frequency.linearRampToValueAtTime(380, t + 0.4);
      const f1 = this.ac.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = 850; f1.Q.value = 8;
      const f2 = this.ac.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = 1600; f2.Q.value = 10;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.3, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      o.connect(f1); o.connect(f2); f1.connect(g); f2.connect(g); g.connect(this.fx); o.start(t); o.stop(t + 0.5);
    }
  },

  // ---------------- música ----------------
  TRACKS: {
    title: { bpm: 72, root: 50, scale: [0, 2, 3, 5, 7, 8, 10], prog: [0, 5, 3, 4], lead: 'sine', bass: 'triangle', arp: 'triangle', drums: 0, pad: true, seed: 11 },
    ship: { bpm: 84, root: 53, scale: [0, 2, 4, 6, 7, 9, 11], prog: [0, 3, 5, 4], lead: 'triangle', bass: 'sine', arp: 'sine', drums: 1, pad: true, seed: 23 },
    verzara: { bpm: 100, root: 45, scale: [0, 3, 5, 7, 10], prog: [0, 3, 4, 2], lead: 'triangle', bass: 'triangle', arp: 'square', drums: 2, pad: false, seed: 37, marimba: true },
    verzara_r: { bpm: 104, root: 48, scale: [0, 2, 4, 7, 9], prog: [0, 3, 4, 2], lead: 'triangle', bass: 'sine', arp: 'triangle', drums: 2, pad: true, seed: 37, marimba: true },
    verzara_ow: { bpm: 112, root: 50, scale: [0, 2, 4, 5, 7, 9, 11], prog: [0, 4, 5, 3], lead: 'square', bass: 'triangle', arp: 'triangle', drums: 1, pad: false, seed: 51 },
    facility: { bpm: 116, root: 43, scale: [0, 1, 3, 5, 7, 8, 10], prog: [0, 0, 5, 1], lead: 'sawtooth', bass: 'square', arp: 'square', drums: 3, pad: false, seed: 61 },
    boss: { bpm: 148, root: 40, scale: [0, 1, 3, 5, 7, 8, 11], prog: [0, 5, 1, 4], lead: 'sawtooth', bass: 'sawtooth', arp: 'square', drums: 3, pad: false, seed: 77, vary: true },
    galaxy: { bpm: 66, root: 52, scale: [0, 2, 4, 7, 9], prog: [0, 4, 5, 3], lead: 'sine', bass: 'sine', arp: 'triangle', drums: 0, pad: true, seed: 91 }
  },
  // ---- compositor: forma completa (intro · A · B · A' · puente · clímax) + variación por nivel/jefe ----
  RH8: ['x-xxx-x-', 'xx-xx-x-', 'x--xx-xx', 'x-x-x-xx', 'xxx-x---', 'x-xx-xx-', 'x---x-xx', 'xx-x-xx-', 'x-x.x-x.', 'x.xxx.x-'],
  RH6: ['x-xx-x', 'x--xxx', 'xx-x--', 'x-x-xx', 'x.xx-x', 'xxx-x-'],
  ARPS: [[0, 2, 4, 2, 5, 4, 2, 4], [0, 4, 2, 4, 0, 4, 2, 4], [0, 2, 4, 7, 4, 2, 0, 2], [0, 4, 7, 4, 2, 4, 7, 9], [0, 2, 0, 4, 0, 5, 0, 4], [4, 2, 0, 2, 4, 7, 4, 2]],
  intensity: 1,
  hashStr(s) { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; },
  // 1 = normal · 2 = fase 2 del jefe · 3 = fase final (más tempo, capas extra)
  setIntensity(n) { this.intensity = P.clamp(n | 0, 1, 3); },
  music(id, variant) {
    if (!this.ac) { this.pending = { id, variant }; return; }
    const cur = this.track;
    if (cur && cur.id === id && (variant === undefined || cur.variant === variant)) return;
    const def = this.TRACKS[id]; if (!def) return;
    this.stopMusic(0.5);
    const tr = this.compose(id, def, variant), t0 = this.ac.currentTime;
    // cada pista tiene su propio bus: así el fundido de salida no se mezcla con la siguiente
    tr.out = this.ac.createGain(); tr.out.gain.setValueAtTime(0.0001, t0); tr.out.gain.linearRampToValueAtTime(tr.intense || tr.d.drums >= 3 ? 1.3 : 1, t0 + 0.9); tr.out.connect(this.mus);
    tr.mel = this.ac.createBiquadFilter(); tr.mel.type = 'lowpass'; tr.mel.frequency.value = 2400; tr.mel.Q.value = 0.4; tr.mel.connect(tr.out);
    this.track = tr; this.intensity = 1; this.nextT = t0 + 0.3; this.step = 0;
    this.timer = setInterval(() => this.schedule(), 25);
  },
  stopMusic(fade = 0.3) {
    if (this.timer) clearInterval(this.timer); this.timer = null;
    const tr = this.track; this.track = null; this.pending = null;
    if (tr && tr.out && this.ac) {
      const t = this.ac.currentTime, g = tr.out.gain;
      g.cancelScheduledValues(t); g.setValueAtTime(Math.max(0.0001, g.value), t); g.exponentialRampToValueAtTime(0.0001, t + fade);
      setTimeout(() => { try { tr.out.disconnect(); } catch (e) { } }, (fade + 4) * 1000);
    }
  },
  compose(id, d, variant) {
    const sc = d.scale, L = sc.length, meter = d.meter || 16, len = meter / 2;
    const vh = variant != null ? this.hashStr(variant) : 0;
    const r = P.RNG(d.vary && vh ? d.seed * 131 + vh : d.seed);          // identidad del planeta / tema principal
    const rv = P.RNG(d.seed * 7919 + vh + 3);                              // identidad del nivel o del jefe
    const shift = vh ? rv.pick([0, 0, 2, -2, 3, -3, 5]) : 0, root = d.root + shift;
    const bpm = d.bpm + (vh ? rv.int(-4, 4) : 0);
    const deg = (k, oct = 0) => root + 12 * (oct + Math.floor(k / L)) + sc[((k % L) + L) % L];
    const intense = d.drums >= 2 && d.bpm >= 118, RH = meter === 12 ? this.RH6 : this.RH8;
    // motivo: número = ataque (grado de la escala), '-' = nota ligada, null = silencio
    const gen = (g, rh, k0) => {
      const m = []; let k = k0, last = 0;
      for (const c of rh) {
        if (c !== 'x') { m.push(c === '-' ? '-' : null); continue; }
        m.push(k); let s = g.pick([-1, -1, 1, 1, 1, -2, 2, 0, 3, -3, 4]);
        if (Math.abs(last) >= 3) s = -Math.sign(last);                     // tras un salto, vuelve por grado conjunto
        last = s; k = P.clamp(k + s, L - 2, 2 * L + 3);
      }
      return m;
    };
    const fixed = a => a.map(v => v === null ? '-' : v === 'r' ? null : v + L); // partituras escritas a mano
    const snap = (k, ch) => { let b = k, bd = 99; for (let o = -1; o <= 3; o++) for (const x of [0, 2, 4]) { const c = ch + x + o * L, dd = Math.abs(c - k); if (dd < bd) { bd = dd; b = c; } } return b; };
    // 2º compás de cada frase: eco del motivo y cadencia sobre una nota del acorde
    const respond = (g, m, ch, final) => {
      const h = len / 2, sh = g.pick([1, -1, 2, 0]), out = m.slice(0, h).map(v => typeof v === 'number' ? v + sh : v);
      const nums = out.filter(v => typeof v === 'number'), prev = nums.length ? nums[nums.length - 1] : (m.find(v => typeof v === 'number') || L);
      const tones = []; for (let o = -1; o <= 3; o++) for (const x of (final ? [0] : [0, 2, 4])) { const c = ch + x + o * L; if (c >= L - 2 && c <= 2 * L + 4) tones.push(c); }
      const T = tones.length ? tones.reduce((a, b) => Math.abs(b - prev) < Math.abs(a - prev) ? b : a) : prev, a = T + (g() < 0.5 ? 1 : -1);
      const tail = len === 8 ? (final ? g.pick([[a, T, '-', '-'], [T, '-', '-', '-']]) : g.pick([[a, '-', T, '-'], [a, T, '-', '-'], [null, a, T, '-']]))
        : (final ? [T, '-', '-'] : g.pick([[a, T, '-'], [null, a, T]]));
      return out.concat(tail);
    };
    const phrases = (g, m, chs, fx) => { const seq = g.pick([1, 2, -1]), res = []; for (let p = 0; p < 4; p++) { res.push({ m: p === 2 ? m.map(v => typeof v === 'number' ? v + seq : v) : m, snap: !fx }); res.push({ m: respond(g, m, chs[p * 2 + 1], p % 2 === 1), snap: false }); } return res; };
    const mkLead = (m, ch, doSnap, oct = 0) => {
      const out = [];
      for (let i = 0; i < len; i++) {
        const v = m[i]; if (typeof v !== 'number') { out.push(null); continue; }
        const k = doSnap && (i === 0 || i === len / 2) ? snap(v, ch) : v;     // tiempos fuertes sobre notas del acorde
        let du = 1; while (i + du < len && m[i + du] === '-') du++;
        out.push({ n: deg(k, oct), k, d: du });
      }
      return out;
    };
    let cp = L + 1;
    const ctrFor = ch => {                                                  // contramelodía en blancas, conducción de voces por cercanía
      const res = []; for (let j = 0; j < (meter === 12 ? 1 : 2); j++) { let b = cp, bd = 99; for (let o = -2; o <= 2; o++) for (const x of [0, 2, 4]) { const c = ch + x + o * L; if (c < L - 3 || c > L + 3) continue; const dd = Math.abs(c - cp) + (j && c === cp ? 2 : 0); if (dd < bd) { bd = dd; b = c; } } cp = b; res.push(deg(b, 0)); }
      return res;
    };
    const mA = d.motif ? fixed(d.motif) : gen(r, r.pick(RH), r.int(L, L + 3));
    const mB = d.motifB ? fixed(d.motifB) : gen(rv, rv.pick(RH), rv.int(L - 1, L + 4));
    const prog = d.prog, pl = prog.length, rot = rv.int(1, pl - 1);
    const progB = d.progB || prog.map((_, i) => prog[(i + rot) % pl]);
    const eight = pg => Array.from({ length: 8 }, (_, i) => pg[i % pg.length]);
    const cA = eight(prog), cB = eight(progB), cC = cA.slice(); cC[7] = 4;     // dominante antes de volver al tema
    const BASS = intense ? ['pulse', 'drive'] : d.drums >= 2 ? ['pulse', 'root', 'walk'] : ['root', 'walk', 'pedal'];
    const bA = rv.pick(BASS), bB = rv.pick(BASS.filter(b => b !== bA)), aA = rv.pick(this.ARPS), aB = rv.pick(this.ARPS);
    const dl = d.drums, nI = intense ? 2 : 4, cOct = root <= 52 ? 1 : 0, bars = [];
    for (let j = 0; j < nI; j++) bars.push({ sec: 'intro', ch: prog[j % pl], ped: prog[0], lead: null, bass: intense ? 'pulse' : 'pedal', dr: intense ? Math.max(1, dl - 1) : Math.max(0, dl - 2), arp: aA, rate: 4, pad: true, fill: j === nI - 1 && dl >= 2, cut: 1300 });
    const sect = (sec, g, m, chs, o) => phrases(g, m, chs, sec !== 'B' ? !!d.motif : !!d.motifB).forEach((ph, j) => bars.push(Object.assign({ sec, ch: chs[j], lead: mkLead(ph.m, chs[j], ph.snap, o.oct || 0), crash: j === 0, fill: j === 7 && dl >= 1, kickX: o.kx }, o, o.ctr ? { ctr: ctrFor(chs[j]) } : {})));
    sect('A', r, mA, cA, { bass: bA, dr: dl, arp: aA, rate: 2, pad: d.pad, cut: 3000, kx: rv() < 0.4 });
    sect('B', rv, mB, cB, { bass: bB, dr: Math.min(3, dl + (dl >= 1 ? 1 : 0)), arp: aB, rate: intense ? 1 : 2, pad: d.pad, cut: 3600, kx: rv() < 0.6 });
    sect('A2', r, mA, cA, { bass: bA, dr: dl, arp: aA, rate: 4, pad: true, cut: 3400, ctr: true, kx: rv() < 0.4 });
    const ons = mA.filter(v => typeof v === 'number'), bp = rv.pick([[3, 4, 3, 4], [5, 3, 4, 4], [prog[1 % pl], prog[2 % pl], 4, 4]]);
    for (let j = 0; j < 4; j++) {                                           // puente: tema en aumentación sobre pedal de dominante
      const m = new Array(len).fill('-'); m[0] = ons[(2 * j) % ons.length]; m[len / 2] = ons[(2 * j + 1) % ons.length];
      bars.push({ sec: 'bridge', ch: bp[j], ped: 4, lead: mkLead(m, bp[j], true), bass: intense ? 'pulse' : 'pedal', dr: dl, half: true, arp: aB, rate: 4, pad: true, fill: j === 3 && dl >= 1, cut: 1600 });
    }
    sect('C', r, mA, cC, { bass: intense ? 'drive' : dl >= 1 ? 'pulse' : 'root', dr: Math.min(3, dl + 1), arp: aA, rate: dl >= 2 ? 1 : 2, pad: true, cut: 6000, harm: true, oct: cOct, kx: true });
    return { id, variant, d, bars, deg, bpm, meter, L, intense, loopStart: nI };
  },
  schedule() {
    const tr = this.track, ac = this.ac; if (!tr || !ac) return;
    const d = tr.d, M = tr.meter, I = /_[23]$/.test(tr.id) ? Math.min(2, this.intensity) : this.intensity;
    const six = 60 / Math.min(172, tr.bpm * (I === 3 ? 1.1 : I === 2 ? 1.05 : 1)) / 4, mf = n => 440 * Math.pow(2, (n - 69) / 12);
    if (this.nextT < ac.currentTime - 0.2) this.nextT = ac.currentTime + 0.05;   // pestaña en segundo plano: no ametrallar notas atrasadas
    while (this.nextT < ac.currentTime + 0.15) {
      const s = this.step, i = s % M, bi = Math.floor(s / M), nb = tr.bars.length;
      const idx = bi < nb ? bi : tr.loopStart + (bi - tr.loopStart) % (nb - tr.loopStart);
      const bar = tr.bars[idx], t = Math.max(0, this.nextT - ac.currentTime), ch = bar.ch, mel = tr.mel, bc = bar.ped != null ? bar.ped : ch;
      if (i === 0) { this.sec = bar.sec; mel.frequency.setTargetAtTime(bar.cut * (I === 3 ? 1.3 : 1), this.nextT, 0.6); }
      const bass = (k, du, v = 0.15, oct = -1) => this.tone(mf(tr.deg(k, oct)), six * du, d.bass, v, 0, t, mel, 0.01);
      // bajo
      switch (bar.bass) {
        case 'pedal': if (i === 0) bass(bc, M - 1, 0.14); break;
        case 'root': if (M === 12) { if (i === 0) bass(ch, 4); else if (i === 4 || i === 8) bass(ch + 4, 2, 0.1); } else if (i === 0) bass(ch, 6); else if (i === 8) bass(ch + 4, 4, 0.13); else if (i === 14) bass(ch, 2, 0.11); break;
        case 'walk': if (i % 4 === 0) { const q = i / 4, nx = tr.bars[idx + 1 < nb ? idx + 1 : tr.loopStart].ch, seq = M === 12 ? [0, 2, 4] : [0, 2, 4, nx - ch + (nx > ch ? -1 : 1)]; bass(ch + seq[q], 3.5, 0.14); } break;
        case 'pulse': if (i % 2 === 0) bass(bc, 1.6, i % 4 === 0 ? 0.15 : 0.1, i % 8 === 6 ? 0 : -1); break;
        case 'drive': bass(bc, 0.9, i % 4 === 0 ? 0.15 : 0.08, i % 8 === 7 ? 0 : -1); break;
      }
      // arpegio
      if (d.arp && bar.arp && i % bar.rate === 0) {
        const n = tr.deg(ch + bar.arp[Math.floor(i / bar.rate) % bar.arp.length], 0) + 12;
        this.tone(mf(n), six * (d.marimba ? 1.2 : 0.9) * Math.max(1, bar.rate / 2), d.arp, (d.marimba ? 0.05 : 0.035) * (bar.rate === 1 ? 0.75 : 1), 0, t, mel);
      }
      // melodía (+ armonía a la tercera en el clímax, + octava en la fase final)
      if (bar.lead && i % 2 === 0) {
        const nt = bar.lead[i / 2];
        if (nt) {
          const vol = d.lead === 'sawtooth' ? 0.045 : d.lead === 'square' ? 0.05 : 0.075, du = six * 2 * nt.d * 0.92;
          this.tone(mf(nt.n), du, d.lead, vol, 0, t, mel, 0.015);
          if (bar.harm) this.tone(mf(tr.deg(nt.k - 2, bar.oct || 0)), du, d.lead === 'sawtooth' ? 'triangle' : d.lead, vol * 0.55, 0, t, mel, 0.02);
          if (I === 3) this.tone(mf(nt.n + 12), du * 0.8, 'triangle', vol * 0.35, 0, t, mel, 0.015);
        }
      }
      // contramelodía
      if (bar.ctr) { const span = M / bar.ctr.length; if (i % span === 0) this.tone(mf(bar.ctr[i / span]), six * span * 0.95, 'triangle', 0.045, 0, t, mel, 0.06); }
      // colchón armónico
      if (bar.pad && i === 0) for (const o of [0, 2, 4]) this.tone(mf(tr.deg(ch + o, 0)), six * (M - 1), 'sine', bar.sec === 'intro' || bar.sec === 'bridge' ? 0.045 : 0.032, 0, t, mel, bar.sec === 'intro' ? 0.8 : 0.35);
      this.drumStep(bar, i, t, M, I);
      this.nextT += six; this.step++;
    }
  },
  drumStep(bar, i, t, M, I) {
    const o = this.track.out, lv = bar.dr, T = this.tone.bind(this), N = this.noise.bind(this);
    const kick = (v = 0.25) => T(120, 0.12, 'sine', v, 45, t, o);
    const snare = (v = 0.12) => { N(0.12, v, 1800, t, o, 'bandpass'); T(190, 0.05, 'triangle', v * 0.4, 120, t, o); };
    const hat = (v = 0.04, du = 0.03) => N(du, v, 8000, t, o, 'highpass');
    if (bar.crash && i === 0 && lv >= 1) N(1.4, 0.06, 5500, t, o, 'highpass');
    if (lv <= 0) return;
    if (bar.fill && i >= M - 4 && lv >= 2) {                                 // redoble de transición
      snare(0.06 + (i - (M - 4)) * 0.03);
      if (this.track.intense && i === M - 4) T(170, 0.18, 'sine', 0.2, 80, t, o);
      if (this.track.intense && i === M - 2) T(120, 0.2, 'sine', 0.22, 60, t, o);
      return;
    }
    if (bar.half) { if (i === 0) kick(0.22); if (i === M / 2) snare(0.09); if (i % 4 === 2) hat(0.03); return; }
    if (M === 12) { if (i === 0) kick(lv >= 2 ? 0.24 : 0.14); if ((i === 4 || i === 8) && lv >= 2) snare(0.06); if (i % 2 === 0 && i) hat(0.03); if ((lv >= 3 || I >= 2) && i % 2 === 1) hat(0.018, 0.02); return; }
    if (lv === 1) { if (i % 4 === 2) hat(0.04); if (i === 0) kick(0.12); if (I >= 2 && i % 2 === 1) hat(0.02, 0.02); return; }
    if (i === 0 || i === 8 || (lv >= 3 && i % 4 === 0) || (bar.kickX && i === 10)) kick(lv >= 3 ? 0.27 : 0.24);
    if (i === 4 || i === 12) snare(0.12);
    if (i % 2 === 0) hat(i % 4 === 0 ? 0.035 : 0.05);
    if ((lv >= 3 || I >= 2) && i % 2 === 1) hat(0.02, 0.02);
  }
};
