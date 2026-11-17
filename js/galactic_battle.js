'use strict';
// LA BATALLA GALÁCTICA — nivel 1 de la Esfera de Dyson. Modalidad propia: naves en 2D con desplazamiento vertical.
// Fases: presentación del Consejo (cinemática) → choque de flotas → defensas orbitales (cada civilización interviene con su
// acción reconocible) → asalto al Bastión del Escudo (cinco emisores) → núcleo del Cañón Orbital (cuenta atrás contra la nave
// insignia) → el escudo de la Esfera cae. Controles: moverse · ATAQUE dispara · Esquivar (giro con invulnerabilidad) ·
// SUPERATAQUE «Golpe del Consejo» cuando el medidor está lleno. Si te derriban, reintentas la fase en curso.
P.GB = {
  CIVS: [
    { id: 'arturiano', name: 'ARTURIANOS', ship: 'Aurora de Arcturus', who: 'zelvan', col: '#5ae0ff', col2: '#ffffff', act: 'Rayo de Arcturus', line: 'La ingeniería de Arcturus os abre paso. Que ningún escudo resista.' },
    { id: 'pleyadiano', name: 'PLEYADIANOS', ship: 'Lirio de las Pléyades', who: 'sylae', col: '#ff9ad8', col2: '#ffd166', act: 'Aliento de las Pléyades', line: 'La vida de nueve mundos viaja en esta nave. Cuidaremos de ti.' },
    { id: 'reptiliano', name: 'REPTILIANOS', ship: 'Garra de Ssa-Khor', who: 'ashkar', col: '#ff8a3a', col2: '#7dff5a', act: 'Lluvia de Ssa-Khor', line: 'Esta vez el fuego es nuestro. ¡Que tiemblen sus forjas!' },
    { id: 'andromedano', name: 'ANDROMEDANOS', ship: 'Velo de Andrómeda', who: 'vaelis', col: '#a898ff', col2: '#bff6ff', act: 'Velo de Andrómeda', line: 'Hemos memorizado cada corriente de su escudo. Os protegeremos.' },
    { id: 'lemuriano', name: 'LEMURIANOS', ship: 'Marea de Lemuria', who: 'maelis', col: '#3ae0d0', col2: '#ff7a9a', act: 'Marea de Lemuria', line: 'Las mareas de THALASSYR empujan con nosotros. ¡Adelante!' }
  ],
  built: false,
  build() {
    if (this.built) return; this.built = true; const D = P.DSC, M = D.m;
    // nave del jugador: el caza rojo de K-7
    P.mk('gb_ship', 18, 20, 3, (p, f) => { p.tri(9, 0, 3, 16, 15, 16, '#c0283a'); p.tri(9, 3, 6, 14, 12, 14, '#ff4a5a'); p.rect(1, 11, 4, 7, '#7a1622'); p.rect(13, 11, 4, 7, '#7a1622'); p.rect(8, 6, 3, 4, '#5ee8ff'); p.px(9, 7, '#ffffff'); p.rect(6, 16, 2, 2 + f, f === 2 ? '#ffffff' : '#ffd166'); p.rect(11, 16, 2, 2 + f, f === 2 ? '#ffffff' : '#ffd166'); });
    // las cinco naves del Consejo (miran hacia arriba)
    const C = this.CIVS;
    P.mk('gb_c0', 56, 64, 1, p => { p.tri(28, 0, 10, 50, 46, 50, '#d8f0ff'); p.tri(28, 6, 16, 46, 40, 46, '#8ad4ff'); p.tri(10, 40, 0, 60, 20, 50, '#bff6ff'); p.tri(46, 40, 56, 60, 36, 50, '#bff6ff'); p.rect(26, 10, 4, 34, C[0].col); p.rect(24, 50, 8, 10, '#3a6ab8'); p.px(28, 12, '#ffffff'); for (const x of [18, 28, 38]) p.rect(x - 2, 56, 4, 6, '#5ae0ff'); p.rect(20, 30, 16, 2, '#ffd166'); });
    P.mk('gb_c1', 60, 60, 1, p => { for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.55; p.sell(30 + Math.cos(a) * 14, 30 + Math.sin(a) * 18, 9, 14, ['#a04a88', '#e07ac0', '#ffc0e8', '#ffffff']); } p.sell(30, 34, 12, 14, ['#7a3a6a', '#c060a0', '#ff9ad8', '#ffe0f4']); p.ell(30, 32, 5, 5, '#ffd166'); p.px(30, 30, '#ffffff'); for (const x of [22, 38]) p.rect(x - 2, 50, 4, 8, '#ff9ad8'); });
    P.mk('gb_c2', 64, 60, 1, p => { p.rect(14, 10, 36, 44, '#5a3a1a'); p.rect(14, 10, 36, 3, '#c0702a'); p.rect(16, 14, 32, 36, '#7a4a20'); for (const sd of [-1, 1]) { p.tri(32 + sd * 18, 4, 32 + sd * 30, 20, 32 + sd * 18, 30, '#3a6a2a'); p.tri(32 + sd * 30, 20, 32 + sd * 32, 0, 32 + sd * 24, 12, '#ff8a3a'); } p.rect(28, 0, 8, 14, '#c0702a'); p.rect(30, 0, 4, 4, '#ffd166'); for (let k = 0; k < 4; k++) p.rect(18 + k * 8, 30, 4, 6, '#ff8a3a'); for (const x of [22, 32, 42]) p.rect(x - 3, 54, 6, 6, '#ff6a1a'); });
    P.mk('gb_c3', 60, 60, 1, p => { p.ell(30, 32, 26, 12, '#2a1a5a'); p.ell(30, 32, 22, 9, '#000000'); for (let a = 0; a < 6.28; a += 0.04) p.px(30 + Math.cos(a) * 24, 32 + Math.sin(a) * 10.5, '#a898ff'); p.rect(27, 4, 6, 50, '#4a3a9a'); p.rect(28, 4, 2, 50, '#c0b0ff'); p.tri(30, 0, 24, 12, 36, 12, '#e0d8ff'); p.ell(30, 32, 5, 5, '#bff6ff'); for (const x of [16, 44]) p.rect(x - 2, 40, 4, 8, '#7a6ad8'); p.rect(27, 54, 6, 6, '#a898ff'); });
    P.mk('gb_c4', 64, 56, 1, p => { p.tri(32, 6, 0, 40, 64, 40, '#0e6a7a'); p.tri(32, 12, 8, 38, 56, 38, '#1aa8b0'); p.sell(32, 26, 9, 18, ['#06404a', '#1aa8b0', '#3ae0d0', '#c8fff8']); for (const sd of [-1, 1]) p.tri(32 + sd * 20, 38, 32 + sd * 28, 52, 32 + sd * 12, 42, '#ff7a9a'); p.rect(30, 40, 4, 14, '#0e6a7a'); p.px(32, 18, '#ffffff'); for (const x of [26, 38]) p.rect(x - 2, 44, 4, 8, '#3ae0d0'); });
    // flota del régimen
    P.mk('gb_int', 14, 14, 2, (p, f) => { p.tri(7, 13, 1, 2, 13, 2, M[4]); p.tri(7, 10, 4, 3, 10, 3, M[2]); p.rect(0, 1, 3, 6, D.red[2]); p.rect(11, 1, 3, 6, D.red[2]); p.px(7, 6, f ? '#ffffff' : D.red[3]); });
    P.mk('gb_fighter', 20, 18, 2, (p, f) => { p.rect(6, 2, 8, 14, M[3]); p.rect(6, 2, 8, 1, M[6]); p.tri(6, 4, 0, 14, 6, 14, M[2]); p.tri(14, 4, 20, 14, 14, 14, M[2]); p.sell(10, 10, 3, 3, D.bone); p.px(9, 10, M[0]); p.px(11, 10, M[0]); p.rect(9, 15, 2, 3, f ? '#ffffff' : D.red[3]); });
    P.mk('gb_gunship', 34, 26, 2, (p, f) => { p.rect(4, 4, 26, 16, M[3]); p.rect(4, 4, 26, 2, M[6]); p.rect(0, 10, 34, 6, M[2]); for (const x of [6, 16, 26]) { p.rect(x, 19, 3, 6, M[4]); p.px(x + 1, 24, f ? '#ffffff' : D.red[3]); } p.rect(12, 8, 10, 6, D.red[1]); p.sell(17, 11, 3, 3, D.bone); });
    P.mk('gb_pod', 30, 30, 2, (p, f) => { p.sell(15, 15, 13, 13, [M[1], M[3], M[5], M[6]]); for (let k = 0; k < 8; k++) { const a = k * 0.785; p.rect(Math.round(15 + Math.cos(a) * 12) - 1, Math.round(15 + Math.sin(a) * 12) - 1, 3, 3, M[2]); } p.sell(15, 15, 6, 6, [D.red[0], D.red[1], D.red[3], D.red[4]]); p.px(15, 15, f ? '#ffffff' : D.red[4]); });
    P.mk('gb_cruiser', 110, 40, 1, p => { p.rect(10, 12, 90, 16, M[3]); p.rect(10, 12, 90, 2, M[6]); p.tri(100, 12, 110, 20, 100, 28, M[4]); p.rect(30, 4, 40, 8, M[2]); for (let x = 14; x < 96; x += 6) p.px(x, 20, D.red[3]); p.rect(0, 16, 10, 8, M[1]); p.rect(2, 18, 6, 4, D.red[2]); });
    P.mk('gb_rock', 16, 16, 3, (p, f) => { p.sell(8, 8, 6 + f, 5 + f % 2, [M[1], M[2], M[4], M[5]]); p.px(6, 6, M[6]); });
  }
};

P.GalacticBattle = class {
  constructor(planet, lv) { this.planet = planet || 'dyson'; this.lv = lv || 1; }
  enter() {
    P.GB.build(); this.t = 0; this.pt = 0; this.ph = 'intro'; this.sub = null; this.scroll = 0;
    this.pl = { x: 240, y: 230, hp: 100, cd: 0, dash: 0, dcd: 0, inv: 0, meter: 0, dead: false };
    this.shots = []; this.foes = []; this.eb = []; this.fx = []; this.parts = new P.Particles(); this.council = P.GB.CIVS.map((c, i) => ({ i, x: 60 + i * 90, y: 330, ty: 236 - [10, 0, 14, 0, 10][i], arrived: false, beam: 0, glow: 0 })); this.calls = [];
    this.fleet = []; for (let i = 0; i < 260; i++) { const ally = i % 2 === 0; this.fleet.push({ x: Math.random() * 480, y: ally ? 140 + Math.random() * 120 : 40 + Math.random() * 110, vx: (Math.random() - 0.5) * 0.6, vy: ally ? -0.15 - Math.random() * 0.2 : 0.1 + Math.random() * 0.2, ally, col: ally ? P.pick(['#5ae0ff', '#ff9ad8', '#ff8a3a', '#a898ff', '#3ae0d0']) : P.pick(['#ff2a4a', '#ff5a6a', '#b0102a']), s: Math.random() < 0.15 ? 2 : 1, alive: true }); }
    this.caps = []; this.sphereR = 150; this.shieldHP = 1; this.retries = 0; this.bastion = null; this.core = null;
    P.Audio.music('galactic'); this.sayIdx = 0; this.sub = null; this.subT = 0;
    this.script = [
      [40, 0], [130, 1], [220, 2], [310, 3], [400, 4],
      [500, ['elara', 'El Consejo de las Cinco Civilizaciones al completo, {N}. Cinco naves, cinco pueblos.']],
      [600, ['merek', 'Cinco barcas y un cyborg. Os estaba esperando.']],
      [700, ['elara', '¡Flota enemiga saliendo de la Esfera! Cientos de naves. Tú abres camino: el Consejo te cubre.']]
    ];
  }
  // texto inferior de la cinemática
  say(who, text) { this.sub = { who, text: P.State.fmt(text) }; this.subT = 0; }
  call(i) { const c = P.GB.CIVS[i], s = this.council[i]; s.glow = 60; this.calls.push({ i, t: 0 }); P.Audio.sfx('super'); P.GLFX.wave(s.x, s.y, 0.8); this.flashText = { text: '¡' + c.name + '! · ' + c.act.toUpperCase(), col: c.col, t: 0 };
    const pl = this.pl;
    if (i === 0) { for (const f of this.foes) if (Math.abs(f.x - s.x) < 40 || Math.abs(f.x - pl.x) < 30) this.hurtFoe(f, 30); this.beams = (this.beams || []).concat([{ x: s.x, t: 0, col: c.col, w: 18 }, { x: pl.x, t: 0, col: c.col, w: 10 }]); }
    if (i === 1) { pl.hp = Math.min(100, pl.hp + 30); for (let k = 0; k < 30; k++) this.parts.add({ x: pl.x + P.rand(-14, 14), y: pl.y + P.rand(-10, 10), vy: -P.rand(0.5, 2), life: 40, col: P.pick(['#ff9ad8', '#ffd166', '#ffffff']), size: 2, glow: 3 }); }
    if (i === 2) { for (const f of this.foes.slice(0, 10)) this.rockets = (this.rockets || []).concat([{ x: s.x, y: s.y - 20, tgt: f, t: 0 }]); }
    if (i === 3) pl.veil = 300;
    if (i === 4) { this.eb.forEach(b => { b.vy -= 4; b.dead = true; }); this.waveFx = 40; for (let k = 0; k < 40; k++) this.parts.add({ x: P.rand(0, 480), y: 270, vy: -P.rand(3, 6), life: 40, col: P.pick(['#3ae0d0', '#bff6ff']), size: 2 }); } }
  hurtFoe(f, d) { if (f.dead) return; f.hp -= d; f.flash = 4; if (f.hp <= 0) { f.dead = true; this.boom(f.x, f.y, f.big ? 2 : 1); this.pl.meter = Math.min(100, this.pl.meter + (f.big ? 12 : 4)); this.kills = (this.kills || 0) + 1; } }
  boom(x, y, k = 1) { P.Audio.sfx(k > 1 ? 'bigexplode' : 'explode'); for (let i = 0; i < 10 * k; i++) this.parts.add({ x, y, vx: P.rand(-2, 2) * k, vy: P.rand(-2, 2) * k, life: 20 + k * 10, col: P.pick(['#ffffff', '#ffd166', '#ff8a2a', '#ff2a4a']), size: P.pick([1, 2]), glow: 3 }); this.fx.push({ x, y, t: 0, r: 10 * k }); if (k > 1) { P.shake(3 * k, 10 * k); P.GLFX.wave(x, y, 0.5 * k); } }
  spawn(kind, x, y, o = {}) { const B = { int: { hp: 3, w: 12, spr: 'gb_int' }, fighter: { hp: 5, w: 16, spr: 'gb_fighter' }, gunship: { hp: 18, w: 30, spr: 'gb_gunship', big: true }, pod: { hp: 34, w: 26, spr: 'gb_pod', big: true }, rock: { hp: 8, w: 14, spr: 'gb_rock' } }[kind]; this.foes.push(Object.assign({ kind, x, y, t: 0, vx: 0, vy: 1, cd: P.ri(40, 90), flash: 0 }, B, o)); }
  fireAt(x, y, spd, n = 1, spread = 0.25, col = '#ff2a4a') { const p = this.pl, a0 = Math.atan2(p.y - y, p.x - x); for (let k = 0; k < n; k++) { const a = a0 + (k - (n - 1) / 2) * spread; this.eb.push({ x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, r: 2, col }); } }
  ring(x, y, n, spd, off = 0, col = '#ff5a6a') { for (let k = 0; k < n; k++) { const a = off + k / n * Math.PI * 2; this.eb.push({ x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, r: 2, col }); } }
  setPhase(ph) { this.ph = ph; this.pt = 0; this.foes = []; this.eb = []; this.label = null; if (ph !== 'outro') this.sub = null; this.flashText = { text: { fleet: 'CHOQUE DE FLOTAS', defenses: 'DEFENSAS ORBITALES', assault: 'ASALTO AL BASTIÓN DEL ESCUDO', core: '¡EL CAÑÓN ORBITAL APUNTA A LA NAVE INSIGNIA!', outro: 'EL ESCUDO DE LA ESFERA HA CAÍDO' }[ph] || '', col: ph === 'core' ? '#ff5a6a' : '#ffd166', t: 0 };
    P.Audio.music(ph === 'assault' || ph === 'core' ? 'galactic_3' : ph === 'defenses' ? 'galactic_2' : 'galactic');
    if (ph === 'assault') this.bastion = { x: 240, y: 46, em: [0, 1, 2, 3, 4].map(i => ({ i, x: 96 + i * 72, y: 58 + Math.abs(i - 2) * -6, hp: 70, max: 70 })), t: 0 };
    if (ph === 'core') { this.core = { x: 240, y: 52, hp: 160, max: 160, timer: 1500 }; }
    this.ckpt = { ph, hp: this.pl.hp };
  }
  update() {
    const I = P.input, p = this.pl; this.t++; this.pt++; this.scroll += this.ph === 'intro' ? 0.6 : 1.2;
    if (this.flashText) this.flashText.t++;
    if (this.sub) this.subT++;
    // ---------- cinemática de presentación ----------
    if (this.ph === 'intro') {
      for (const s of this.council) if (s.arrived || this.pt > 40 + s.i * 90) { s.arrived = true; s.y += (s.ty - s.y) * 0.04; }
      for (const [at, what] of this.script) if (this.pt === at) { if (typeof what === 'number') { const c = P.GB.CIVS[what]; this.say(c.who, c.line); this.label = { i: what, t: 0 }; this.council[what].glow = 50; P.Audio.sfx('door'); } else this.say(what[0], what[1]); }
      if (this.label) this.label.t++;
      if (this.pt > 600) this.sphereR += 0.3;
      if (this.pt > 820 || (this.pt > 60 && I.pressed('confirm'))) { for (const s of this.council) { s.arrived = true; s.y = s.ty; } this.sub = null; this.label = null; this.setPhase('fleet'); }
      this.updateFleet(); this.parts.update(); return;
    }
    if (this.ph === 'outro') { this.updateFleet(); this.parts.update(); for (const s of this.council) s.y -= Math.min(4, this.pt * 0.03); p.y -= Math.min(5, this.pt * 0.04);
      if (this.pt === 1) this.say('elara', '¡El escudo ha caído! El Consejo entra por la brecha. Bajamos al casco exterior, {N}.');
      if (this.pt > 300 || (this.pt > 90 && I.pressed('confirm'))) this.finish(); return; }
    // ---------- jugador ----------
    if (p.dead) { if (I.pressed('confirm')) this.retry(); this.parts.update(); this.updateFleet(); return; }
    const sp = p.dash > 0 ? 3.6 : 2.2; let dx = (I.down('right') ? 1 : 0) - (I.down('left') ? 1 : 0), dy = (I.down('down') ? 1 : 0) - (I.down('up') ? 1 : 0); if (dx && dy) { dx *= 0.72; dy *= 0.72; }
    p.x = P.clamp(p.x + dx * sp, 10, 470); p.y = P.clamp(p.y + dy * sp, 40, 258);
    p.bank = P.approach(p.bank || 0, dx, 0.12); // inclinación al girar
    for (const o of [-3, 3]) this.parts.add({ x: p.x + o + P.rand(-1, 1) - p.bank * 2, y: p.y + 9, vx: -dx * 0.3, vy: P.rand(1, 2.4) + (dy > 0 ? 0 : 1) + (p.dash > 0 ? 2 : 0), life: p.dash > 0 ? 16 : 9, col: P.pick(['#5ee8ff', '#ffffff', '#2a8aff']), size: 1, glow: 2 });
    if (p.cd > 0) p.cd--; if (I.down('attack') && p.cd <= 0) { p.cd = 6; for (const o of [-5, 5]) this.shots.push({ x: p.x + o, y: p.y - 8, vy: -7 }); P.Audio.sfx('laser'); }
    if (p.dcd > 0) p.dcd--; if (p.dash > 0) p.dash--; if (I.pressed('dash') && p.dcd <= 0) { p.dash = 18; p.dcd = 50; p.inv = Math.max(p.inv, 24); P.Audio.sfx('dash'); }
    if (p.inv > 0) p.inv--; if (p.veil > 0) p.veil--;
    // reparación automática: tras 1 s sin recibir daño, el casco se recupera poco a poco (~6 % por segundo)
    p.calm = (p.calm || 0) + 1;
    if (p.hp < 100 && p.calm > 60) { p.hp = Math.min(100, p.hp + 0.1); if (this.pt % 10 === 0) this.parts.add({ x: p.x + P.rand(-8, 8), y: p.y + P.rand(-6, 6), vy: -P.rand(0.3, 1), life: 26, col: P.pick(['#57ff7a', '#c8ffd4']), size: 1, glow: 2 }); }
    if (I.pressed('super') && p.meter >= 100) { p.meter = 0; this.councilStrike(); }
    // ---------- disparos ----------
    for (const s of this.shots) { s.y += s.vy; if (s.y < -10) s.dead = true;
      for (const f of this.foes) if (!f.dead && Math.abs(s.x - f.x) < f.w / 2 + 2 && Math.abs(s.y - f.y) < f.w / 2 + 2) { s.dead = true; this.hurtFoe(f, 1); break; }
      if (!s.dead && this.bastion) for (const e of this.bastion.em) if (e.hp > 0 && this.bastion.open && Math.abs(s.x - e.x) < 10 && Math.abs(s.y - e.y) < 10) { s.dead = true; e.hp--; e.flash = 4; if (e.hp <= 0) this.emitterDown(e); break; }
      if (!s.dead && this.core && Math.abs(s.x - this.core.x) < 16 && Math.abs(s.y - this.core.y) < 14) { s.dead = true; this.core.hp--; this.core.flash = 4; P.Audio.sfx('ehit'); }
    }
    this.shots = this.shots.filter(s => !s.dead);
    // ---------- fases ----------
    const pt = this.pt;
    if (this.ph === 'fleet') {
      if (pt % 50 === 0 && pt < 2100) for (let k = 0; k < 4; k++) this.spawn('int', 60 + ((pt / 50 + k * 3) % 8) * 52, -10 - k * 18, { zig: k % 2 ? 1 : -1 });
      if (pt % 140 === 70 && pt < 2100) { this.spawn('fighter', P.rand(40, 440), -12, { dive: true }); this.spawn('fighter', P.rand(40, 440), -30, { dive: true }); }
      if (pt % 420 === 300 && pt < 2100) this.spawn('gunship', P.rand(80, 400), -16);
      if (pt % 600 === 200) this.caps.push({ x: -120, y: P.rand(60, 120), hp: 3, t: 0 });
      if (pt === 400) this.call(0); if (pt === 1100) this.call(2); if (pt === 1700) this.call(4);
      if (pt > 2280 && this.foes.length === 0) this.setPhase('defenses');
    } else if (this.ph === 'defenses') {
      if (pt % 300 === 60 && pt < 1800) this.spawn('pod', 80 + ((pt / 300) % 4) * 100, -20);
      if (pt % 36 === 0 && pt < 1900) this.spawn('rock', P.rand(20, 460), -12, { vy: P.rand(0.8, 1.6), vx: P.rand(-0.3, 0.3) });
      if (pt % 90 === 45 && pt < 1900) for (let k = 0; k < 3; k++) this.spawn('int', 100 + k * 140, -10, { zig: 1 });
      if (pt === 300) this.call(1); if (pt === 800) this.call(3); if (pt === 1300) this.call(0);
      if (pt > 2000 && this.foes.length === 0) this.setPhase('assault');
    } else if (this.ph === 'assault') {
      const B = this.bastion; B.t++; B.open = (B.t % 300) < 200; this.sphereR = Math.min(320, this.sphereR + 0.2);
      if (B.t % (B.open ? 40 : 26) === 0) B.em.filter(e => e.hp > 0).forEach((e, k) => { if (B.open) this.fireAt(e.x, e.y + 6, 1.8, 3, 0.3); else this.ring(e.x, e.y + 6, 10, 1.4, B.t * 0.05 + k); });
      if (pt % 120 === 60) for (let k = 0; k < 2; k++) this.spawn('fighter', P.rand(40, 440), -12, { dive: true });
      // el Consejo apunta a los emisores, uno por civilización
      if (pt % 240 === 120) { const alive = B.em.filter(e => e.hp > 0); if (alive.length) { const e = P.pick(alive); this.beams = (this.beams || []).concat([{ x: e.x, t: 0, col: P.GB.CIVS[e.i].col, w: 12, toY: e.y }]); e.hp = Math.max(1, e.hp - 10); this.council[e.i].glow = 40; } }
      if (B.em.every(e => e.hp <= 0)) this.setPhase('core');
    } else if (this.ph === 'core') {
      const K = this.core; K.timer--; if (K.flash > 0) K.flash--;
      if (pt % 30 === 0) this.ring(K.x, K.y + 10, 14 + Math.floor((1500 - K.timer) / 300) * 2, 1.3, pt * 0.04, '#ffd166');
      if (pt % 45 === 20) this.fireAt(K.x, K.y + 10, 2.4, 5, 0.18);
      if (pt % 180 === 90) for (let i = 0; i < 5; i++) { this.beams = (this.beams || []).concat([{ x: K.x + (i - 2) * 6, t: 0, col: P.GB.CIVS[i].col, w: 6, toY: K.y }]); K.hp = Math.max(1, K.hp - 2); }
      if (K.hp <= 0 && !K.dead) { K.dead = true; this.coreBlast(); }
      if (K.timer <= 0 && !K.dead) this.failCore();
      if (K.dead && pt - K.deadAt > 160) this.setPhase('outro');
    }
    // ---------- enemigos ----------
    for (const f of this.foes) { if (f.dead) continue; f.t++; if (f.flash > 0) f.flash--;
      if (f.kind === 'int') { f.y += 1.4; f.x += Math.sin(f.t * 0.06) * 1.6 * f.zig; if (f.t % 80 === 40) this.fireAt(f.x, f.y, 2.2); }
      else if (f.kind === 'fighter') { if (f.t < 50) f.y += 1.6; else { const a = Math.atan2(p.y - f.y, p.x - f.x); f.vx += Math.cos(a) * 0.06; f.vy = Math.min(3, f.vy + 0.05); f.x += P.clamp(f.vx, -2, 2); f.y += f.vy; } if (f.t === 46) this.fireAt(f.x, f.y, 2.6, 2, 0.2); }
      else if (f.kind === 'gunship') { f.y += f.y < 60 ? 0.8 : 0.1; f.x += Math.sin(f.t * 0.02) * 0.6; if (f.t % 70 === 0) this.fireAt(f.x, f.y + 10, 2, 3, 0.3); if (f.t > 600) f.y += 1; }
      else if (f.kind === 'pod') { f.y += f.y < 70 ? 0.6 : 0.05; if (f.t % 60 === 0) this.ring(f.x, f.y, 12, 1.5, f.t * 0.1); if (f.t > 520) f.y += 1.2; }
      else if (f.kind === 'rock') { f.y += f.vy; f.x += f.vx; }
      if (f.y > 290 || f.x < -40 || f.x > 520) f.dead = true;
      if (!f.dead && p.inv <= 0 && Math.abs(f.x - p.x) < f.w / 2 + 4 && Math.abs(f.y - p.y) < f.w / 2 + 4) { this.hurtPlayer(14); this.hurtFoe(f, 5); }
    }
    this.foes = this.foes.filter(f => !f.dead);
    for (const b of this.eb) { b.x += b.vx; b.y += b.vy; if (b.x < -10 || b.x > 490 || b.y < -10 || b.y > 280) b.dead = true;
      if (p.veil > 0 && Math.hypot(b.x - p.x, b.y - p.y) < 22) { b.dead = true; continue; }
      if (!b.dead && p.inv <= 0 && Math.abs(b.x - p.x) < 3 && Math.abs(b.y - p.y) < 4) { b.dead = true; this.hurtPlayer(10); } }
    this.eb = this.eb.filter(b => !b.dead); if (this.eb.length > 420) this.eb.splice(0, this.eb.length - 420);
    if (this.rockets) { for (const r of this.rockets) { r.t++; const tg = r.tgt; if (!tg || tg.dead) { r.dead = true; continue; } const a = Math.atan2(tg.y - r.y, tg.x - r.x); r.x += Math.cos(a) * 5; r.y += Math.sin(a) * 5; this.parts.add({ x: r.x, y: r.y, life: 10, col: '#ff8a3a', size: 1 }); if (Math.hypot(tg.x - r.x, tg.y - r.y) < 8) { r.dead = true; this.hurtFoe(tg, 20); } } this.rockets = this.rockets.filter(r => !r.dead); }
    if (this.beams) { for (const b of this.beams) b.t++; this.beams = this.beams.filter(b => b.t < 30); }
    for (const c of this.caps) { c.t++; c.x += 0.5; if (c.t % 200 === 150) { c.hp--; this.boom(c.x + 50, c.y + 20, 2); } if (c.hp <= 0 || c.x > 600) c.dead = true; } this.caps = this.caps.filter(c => !c.dead);
    for (const s of this.council) { s.y += (s.ty - s.y) * 0.04; if (s.glow > 0) s.glow--; }
    this.updateFleet(); this.parts.update(); for (const f of this.fx) f.t++; this.fx = this.fx.filter(f => f.t < 16);
  }
  updateFleet() { const t = this.t; for (const s of this.fleet) { if (!s.alive) { if (Math.random() < 0.01) { s.alive = true; s.y = s.ally ? 290 : -10; } continue; } s.x += s.vx; s.y += s.vy + 0.15; if (s.x < -5) s.x = 485; if (s.x > 485) s.x = -5; if (s.y > 285 || s.y < -15) { s.y = s.ally ? 280 : -5; } }
    if (t % 3 === 0) { const a = P.pick(this.fleet), b = P.pick(this.fleet); if (a.alive && b.alive && a.ally !== b.ally && Math.abs(a.x - b.x) < 120) { (this.zaps = this.zaps || []).push({ x0: a.x, y0: a.y, x1: b.x, y1: b.y, col: a.col, t: 0 }); if (Math.random() < 0.3) { b.alive = false; this.parts.add({ x: b.x, y: b.y, life: 14, col: '#ffd166', size: 2, glow: 3 }); } } }
    if (this.zaps) { for (const z of this.zaps) z.t++; this.zaps = this.zaps.filter(z => z.t < 6); } }
  hurtPlayer(d) { const p = this.pl; if (p.inv > 0 || p.dead) return; p.hp -= Math.max(1, Math.round(d * P.DIFF.get().dmg)); p.inv = 40; p.calm = 0; P.Audio.sfx('hurt'); P.shake(3, 8); P.GLFX.pulseChroma(1.5); if (p.hp <= 0) { p.dead = true; p.hp = 0; this.boom(p.x, p.y, 2); P.Audio.sfx('bigexplode'); } }
  councilStrike() { P.Audio.sfx('super'); P.shake(6, 30); P.GLFX.flashScreen('#ffffff', 0.5); P.GLFX.wave(240, 135, 1.6); this.eb = []; for (const f of this.foes) this.hurtFoe(f, 12); if (this.core) this.core.hp = Math.max(1, this.core.hp - 12); if (this.bastion) this.bastion.em.forEach(e => { if (e.hp > 0) e.hp = Math.max(1, e.hp - 10); }); this.beams = (this.beams || []).concat(this.council.map(s => ({ x: s.x, t: 0, col: P.GB.CIVS[s.i].col, w: 14 }))); this.flashText = { text: '¡GOLPE DEL CONSEJO!', col: '#ffffff', t: 0 }; }
  emitterDown(e) { this.boom(e.x, e.y, 2); const c = P.GB.CIVS[e.i]; this.flashText = { text: 'EMISOR ' + (e.i + 1) + ' DESTRUIDO · ' + c.name, col: c.col, t: 0 }; this.council[e.i].glow = 80; }
  coreBlast() { const K = this.core; K.deadAt = this.pt; P.Audio.sfx('bigexplode'); P.shake(14, 80); P.GLFX.flashScreen('#ffffff', 0.9); P.GLFX.wave(K.x, K.y, 1.6); for (let k = 0; k < 12; k++) setTimeout(() => this.boom(K.x + P.rand(-140, 140), K.y + P.rand(-20, 60), 2), k * 90); this.eb = []; this.foes = []; this.shatter = 1; }
  failCore() { const K = this.core; K.dead = true; this.beamFire = 60; P.Audio.sfx('bigexplode'); P.shake(12, 40); P.GLFX.flashScreen('#ff5a6a', 0.7); this.say('elara', '¡La nave insignia ha perdido sus escudos! Reintentamos el ataque al núcleo, {N}.'); setTimeout(() => { if (this.ph === 'core') { this.core = null; this.setPhase('core'); this.pl.hp = Math.max(this.pl.hp, 60); } }, 1600); }
  retry() { const c = this.ckpt || { ph: 'fleet', hp: 100 }; this.pl.dead = false; this.pl.hp = 100; this.pl.inv = 90; this.retries++; this.bastion = null; this.core = null; this.setPhase(c.ph); }
  finish() { if (this.done) return; this.done = true; const S = P.State, lv = S.lvState(this.planet, this.lv); const first = !lv.done; lv.done = true; if (first && P.D.FIRST_CLEAR[this.planet]) P.D.FIRST_CLEAR[this.planet](S, this.lv); S.addXP(300); S.autosave(); P.goto(new P.OverworldScene(this.planet, this.lv)); }
  // ---------- dibujo ----------
  draw(c) {
    const t = this.t, sc = this.scroll;
    c.fillStyle = '#03030a'; c.fillRect(0, 0, P.W, P.H);
    const g = c.createLinearGradient(0, 0, 0, P.H); g.addColorStop(0, '#0a0614'); g.addColorStop(0.6, '#06061a'); g.addColorStop(1, '#020208'); c.fillStyle = g; c.fillRect(0, 0, P.W, P.H);
    // estrellas en tres capas
    for (let l = 0; l < 3; l++) { c.fillStyle = ['#4a5270', '#8a96b4', '#ffffff'][l]; for (let i = 0; i < 40; i++) { const x = (i * 97 + l * 31) % P.W, y = ((i * 53 + l * 71) + sc * (0.3 + l * 0.5)) % P.H; c.fillRect(x, Math.round(y), 1, l === 2 ? 2 : 1); } }
    // nebulosa
    for (let i = 0; i < 5; i++) { const y = ((i * 90 + sc * 0.2) % 400) - 80; P.drawGlow(c, (i * 113) % P.W, y, 80, i % 2 ? '#3a1a5a' : '#5a1a2a', 0.18); }
    // la Esfera de Dyson domina el horizonte superior
    const R = this.sphereR, scy = -R + 70 + (this.ph === 'intro' ? 0 : 0);
    P.drawGlow(c, 240, scy + R, R * 0.6, '#ff8a3a', 0.25);
    c.fillStyle = '#0c0e15'; c.beginPath(); c.arc(240, scy, R, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#2c3446'; c.lineWidth = 1; for (let k = -8; k <= 8; k++) { c.beginPath(); c.ellipse(240, scy, Math.abs(k) * R / 8.5, R, 0, 0, Math.PI); c.stroke(); } for (let k = 1; k < 6; k++) { c.beginPath(); c.ellipse(240, scy, R, R * k / 6, 0, 0, Math.PI); c.stroke(); }
    for (let i = 0; i < 40; i++) { const a = i * 0.157, x = 240 + Math.cos(a) * R * 0.94, y = scy + Math.sin(a) * R * 0.94; if (y > 0) { c.fillStyle = (t + i * 7) % 60 < 30 ? '#ff2a4a' : '#6a0a1a'; c.fillRect(Math.round(x), Math.round(y), 2, 2); } }
    for (let i = 0; i < 6; i++) { const a = 0.4 + i * 0.4, x = 240 + Math.cos(a) * R * 0.6, y = scy + Math.sin(a) * R * 0.6; if (y > 0) P.drawGlow(c, x, y, 10 + Math.sin(t * 0.05 + i) * 3, '#ffd166', 0.5); }
    if (this.ph !== 'outro' && !this.shatter) { c.globalAlpha = 0.25 + Math.sin(t * 0.05) * 0.08; c.strokeStyle = '#ff5a6a'; c.beginPath(); c.arc(240, scy, R + 10, 0, Math.PI); c.stroke(); c.globalAlpha = 1; }
    if (this.shatter) { this.shatter++; for (let i = 0; i < 40; i++) { const a = i * 0.08, d = R + 10 + this.shatter * (1 + (i % 5) * 0.4); c.fillStyle = i % 2 ? '#ff8a9a' : '#ffffff'; c.globalAlpha = Math.max(0, 1 - this.shatter / 160); c.fillRect(Math.round(240 + Math.cos(a) * d), Math.round(scy + Math.sin(a) * d), 3, 2); } c.globalAlpha = 1; }
    // cruceros del régimen cruzando a media distancia
    for (const cp of this.caps) { c.globalAlpha = 0.85; c.drawImage(P.S.gb_cruiser.f[0], Math.round(cp.x), Math.round(cp.y)); c.globalAlpha = 1; }
    // batalla de flotas al fondo: cientos de naves
    for (const s of this.fleet) if (s.alive) { c.fillStyle = s.col; c.fillRect(Math.round(s.x), Math.round(s.y), s.s, s.s); }
    if (this.zaps) for (const z of this.zaps) { c.globalAlpha = 1 - z.t / 6; c.strokeStyle = z.col; c.beginPath(); c.moveTo(z.x0, z.y0); c.lineTo(z.x1, z.y1); c.stroke(); } c.globalAlpha = 1;
    // bastión del escudo y núcleo del cañón
    if (this.bastion && this.ph === 'assault') { const B = this.bastion; c.fillStyle = '#141822'; c.fillRect(40, 30, 400, 34); c.fillStyle = '#404a62'; c.fillRect(40, 30, 400, 2); for (const e of B.em) { const alive = e.hp > 0; c.fillStyle = alive ? (e.flash > 0 ? '#ffffff' : '#2c3446') : '#0c0e15'; c.fillRect(e.x - 10, e.y - 10, 20, 20); if (alive) { P.Energy.reactor(c, e.x, e.y, 6, t + e.i * 10, P.GB.CIVS[e.i].col); if (!B.open) P.Energy.shield(c, e.x, e.y, 13, t, '#ff5a6a', 0); c.fillStyle = '#06070b'; c.fillRect(e.x - 10, e.y + 12, 20, 2); c.fillStyle = P.GB.CIVS[e.i].col; c.fillRect(e.x - 10, e.y + 12, Math.round(20 * e.hp / e.max), 2); } e.flash = Math.max(0, (e.flash || 0) - 1); } }
    if (this.core && !this.core.dead) { const K = this.core, k = 1 - K.timer / 1500; c.fillStyle = '#141822'; c.fillRect(170, 20, 140, 44); c.fillStyle = '#404a62'; c.fillRect(170, 20, 140, 2); P.Energy.reactor(c, K.x, K.y, 10 + k * 6, t, k > 0.7 ? '#ffffff' : '#ff2a4a'); if (K.flash > 0) P.drawGlow(c, K.x, K.y, 24, '#ffffff', 0.6); for (let i = 0; i < 4; i++) P.Energy.arc(c, K.x, K.y, K.x + (i - 1.5) * 50, 30, t + i, '#ff8a9a', 1, 5);
      c.fillStyle = '#06070b'; c.fillRect(140, 8, 200, 4); c.fillStyle = '#ff2a4a'; c.fillRect(140, 8, Math.round(200 * K.timer / 1500), 4); P.txt(c, 'CARGA DEL CAÑÓN ORBITAL · NÚCLEO ' + Math.ceil(K.hp / K.max * 100) + ' %', 240, 14, '#ff8a9a', { align: 'center' }); }
    if (this.beamFire > 0) { this.beamFire--; P.Energy.laser(c, 240, 50, this.council[2].x, this.council[2].y, t, '#ff2a4a', 8); }
    // rayos del Consejo
    if (this.beams) for (const b of this.beams) { const s = this.council.find(q => Math.abs(q.x - b.x) < 30) || { y: 260 }; P.Energy.laser(c, b.x, b.toY != null ? b.toY : -10, b.x, s.y - 20, t, b.col, Math.max(1, b.w * (1 - b.t / 30))); }
    // naves del Consejo
    for (const s of this.council) { const im = P.S['gb_c' + s.i].f[0]; if (s.glow > 0) P.drawGlow(c, s.x, s.y, 50, P.GB.CIVS[s.i].col, s.glow / 80); c.drawImage(im, Math.round(s.x - im.width / 2), Math.round(s.y - im.height / 2 + Math.sin(t * 0.03 + s.i) * 2)); for (let k = 0; k < 2; k++) P.drawGlow(c, s.x + (k ? 10 : -10), s.y + im.height / 2 + 2, 6 + (t % 4), P.GB.CIVS[s.i].col, 0.6); }
    if (this.waveFx > 0) { this.waveFx--; c.globalAlpha = this.waveFx / 40; c.fillStyle = '#3ae0d0'; c.fillRect(0, P.H - (40 - this.waveFx) * 7, P.W, 6); c.globalAlpha = 1; }
    // enemigos, cohetes, disparos y balas
    for (const f of this.foes) { const im = P.S[f.spr].f[(t >> 3) % P.S[f.spr].f.length]; if (f.kind !== 'rock') P.drawGlow(c, f.x, f.y - im.height / 2 + 1, 3 + f.w * 0.12 + ((t + f.x) >> 1) % 2, f.big ? '#ffb02a' : '#ff5a3a', 0.6); c.drawImage(im, Math.round(f.x - im.width / 2), Math.round(f.y - im.height / 2)); if (f.flash > 0) P.drawGlow(c, f.x, f.y, f.w, '#ffffff', 0.5); }
    if (this.rockets) for (const r of this.rockets) { c.fillStyle = '#ffd166'; c.fillRect(Math.round(r.x) - 1, Math.round(r.y) - 1, 2, 3); }
    c.fillStyle = '#ffd166'; for (const s of this.shots) { c.fillRect(Math.round(s.x), Math.round(s.y), 1, 5); }
    for (const b of this.eb) { c.fillStyle = b.col; c.fillRect(Math.round(b.x) - 1, Math.round(b.y) - 1, 3, 3); c.fillStyle = '#ffffff'; c.fillRect(Math.round(b.x), Math.round(b.y), 1, 1); }
    for (const f of this.fx) { c.strokeStyle = 'rgba(255,220,160,' + (1 - f.t / 16) + ')'; c.beginPath(); c.arc(Math.round(f.x), Math.round(f.y), f.r + f.t * 2, 0, 6.3); c.stroke(); }
    this.parts.draw(c, 0, 0);
    // jugador
    const p = this.pl; if (this.ph !== 'intro' && !p.dead && (p.inv <= 0 || (t >> 2) % 2)) { const im = P.S.gb_ship.f[(t >> 2) % 3], bk = p.bank || 0; c.save(); c.translate(Math.round(p.x), Math.round(p.y)); c.scale(1 - Math.abs(bk) * 0.22, 1); c.translate(Math.round(bk * 1.5), 0); c.drawImage(im, -9, -10); c.restore(); P.drawGlow(c, p.x - bk * 2, p.y + 9, 5 + ((t >> 1) % 2), '#5ee8ff', 0.7); if (p.dash > 0) P.drawGlow(c, p.x, p.y, 16, '#ffffff', 0.4); if (p.veil > 0) P.Energy.shield(c, p.x, p.y, 20, t, '#a898ff', 0); c.fillStyle = '#ffffff'; c.fillRect(Math.round(p.x), Math.round(p.y), 1, 1); }
    // HUD
    if (this.ph !== 'intro' && this.ph !== 'outro') { P.panel(c, 4, 4, 128, 30); P.txt(c, 'ALA DEL ALBA', 10, 8, '#ff8a9a'); c.fillStyle = '#06070b'; c.fillRect(10, 18, 116, 4); c.fillStyle = p.hp > 30 ? '#57ff7a' : '#ff2a4a'; c.fillRect(10, 18, Math.round(116 * p.hp / 100), 4); if (p.hp < 100 && p.calm > 60 && !p.dead) { c.fillStyle = (t >> 3) % 2 ? '#ffffff' : '#c8ffd4'; c.fillRect(9 + Math.round(116 * p.hp / 100), 18, 2, 4); } c.fillStyle = '#06070b'; c.fillRect(10, 25, 116, 3); c.fillStyle = p.meter >= 100 ? ((t >> 3) % 2 ? '#ffffff' : '#ffd166') : '#ffd166'; c.fillRect(10, 25, Math.round(116 * p.meter / 100), 3); if (p.meter >= 100) P.txt(c, 'GOLPE DEL CONSEJO: ' + P.input.label('super'), 138, 22, '#ffd166'); }
    if (this.flashText && this.flashText.t < 150) { c.globalAlpha = Math.min(1, (150 - this.flashText.t) / 30); P.txt(c, this.flashText.text, P.W / 2, 112, this.flashText.col, { align: 'center', outline: true, shadow: '#000' }); c.globalAlpha = 1; }
    // cinemática: franjas, presentación de cada nave y subtítulos
    if (this.ph === 'intro' || this.ph === 'outro') { c.fillStyle = '#000'; c.fillRect(0, 0, P.W, 22); c.fillRect(0, P.H - 22, P.W, 22); }
    if (this.label && this.label.t < 110) { const C = P.GB.CIVS[this.label.i], s = this.council[this.label.i]; c.globalAlpha = Math.min(1, this.label.t / 15, (110 - this.label.t) / 20); P.txt(c, C.name, s.x, s.y - 52, C.col, { align: 'center', outline: true, shadow: '#000' }); P.txt(c, '«' + C.ship + '»', s.x, s.y - 42, '#ffffff', { align: 'center', outline: true, shadow: '#000' }); c.globalAlpha = 1; }
    if (this.sub && this.subT < 260) { const sp = P.SPEAKERS[this.sub.who] || { name: this.sub.who.toUpperCase(), col: '#ffffff' }; P.txt(c, sp.name, 14, P.H - 18, sp.col || '#ffffff'); P.txt(c, this.sub.text.slice(0, Math.floor(this.subT * 1.5)), 14, P.H - 9, '#e8f0ff'); }
    if (this.ph === 'intro' && this.pt > 60) P.txt(c, P.input.label('confirm') + ' · saltar', P.W - 8, 8, '#5e6a86', { align: 'right' });
    if (p.dead) { c.fillStyle = 'rgba(4,2,10,0.7)'; c.fillRect(0, 100, P.W, 60); P.txt(c, 'ALA DEL ALBA DERRIBADA', P.W / 2, 116, '#ff5a6a', { align: 'center' }); P.txt(c, P.input.label('confirm') + ' · reintentar la fase', P.W / 2, 134, '#ffffff', { align: 'center' }); }
  }
};
