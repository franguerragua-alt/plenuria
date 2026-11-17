'use strict';
// ZYRKALIA — Reina Esférica Colménica (XÉRTHA). Según la referencia: esfera de celdas hexagonales anaranjadas, cada
// una con un ojo negro brillante, un gran ojo central, púas finas alrededor; debajo, un núcleo de acero con cuatro
// patas mecánicas articuladas y una pata central con taladro que se clava en el suelo.
P.ZKC = { cell: ['#5a2a06', '#a85a10', '#e08a20', '#ffc050', '#ffe8a0'], steel: ['#2a3040', '#4a5468', '#7a8aa0', '#b8c8dc', '#e8f0ff'], spike: ['#6a3a10', '#c08040', '#f0c080'] };
P.Sprites.buildZyrkalia = function () {
  const C = P.ZKC;
  // f: 0 ojos abiertos · 1 celdas cerradas (parpadeo) · 2 ojo central abierto y brillante (vulnerable)
  const body = (p, f, cr) => {
    const cx = 48, cy = 46, R = 34;
    // púas finas
    for (let k = 0; k < 22; k++) { const a = k / 22 * Math.PI * 2 + 0.1, l = R + 8 + (k % 3) * 4 - (cr && k % 5 === 0 ? 7 : 0); p.line(cx + Math.cos(a) * (R - 2), cy + Math.sin(a) * (R - 2), cx + Math.cos(a) * l, cy + Math.sin(a) * l, C.spike[k % 2]); p.px(cx + Math.cos(a) * l, cy + Math.sin(a) * l, C.spike[2]); p.px(cx + Math.cos(a) * (l - 1), cy + Math.sin(a) * (l - 1), '#2a1a08'); }
    p.sell(cx, cy, R, R, [C.cell[0], C.cell[1], C.cell[2], C.cell[3]]);
    // celdas hexagonales con un ojo cada una (en proyección esférica)
    for (let gy = -3; gy <= 3; gy++) for (let gx = -3; gx <= 3; gx++) {
      const ux = (gx + (gy % 2 ? 0.5 : 0)) * 0.3, uy = gy * 0.27, d2 = ux * ux + uy * uy; if (d2 > 0.78) continue;
      const z = Math.sqrt(1 - d2), x = cx + ux * R, y = cy + uy * R, r = 4.6 * (0.55 + z * 0.5), lit = (-ux - uy) * 0.6 + z * 0.6;
      const center = gx === 0 && gy === 0; if (center) continue;
      P.Sprites.xeHex ? P.Sprites.xeHex(p, x, y, r, C.cell[P.clamp(Math.round(1 + lit * 2.2), 1, 3)], C.cell[0], lit > 0.7 ? C.cell[4] : null) : null;
      if (f === 1) p.line(x - r * 0.5, y, x + r * 0.5, y, '#2a1406');
      else { p.ell(x, y, r * 0.48, r * 0.48, '#0a0604'); p.px(x - r * 0.2, y - r * 0.2, '#8a6a4a'); if (cr && (gx + gy) % 3 === 0) p.px(x, y, '#ff3050'); }
    }
    // ojo central
    const er = f === 2 ? 9 : 7; P.Sprites.xeHex(p, cx, cy, er + 2, C.cell[2], C.cell[0], C.cell[4]);
    p.ell(cx, cy, er * 0.7, er * 0.7, f === 2 ? '#3ae0d0' : '#0a0604'); if (f === 2) { p.ell(cx, cy, er * 0.4, er * 0.4, '#c8fff8'); p.px(cx, cy, '#ffffff'); } else { p.px(cx - 2, cy - 2, '#a0806a'); p.px(cx - 1, cy - 2, '#ffffff'); }
    if (cr) { const V = '#ff4a2a'; p.line(cx - 20, cy - 22, cx - 8, cy - 6, V); p.line(cx + 12, cy - 26, cx + 22, cy - 8, V); p.line(cx + 22, cy - 8, cx + 14, cy + 10, V); }
    // núcleo de acero bajo la esfera
    p.sell(cx, cy + R - 2, 14, 7, [C.steel[0], C.steel[1], C.steel[2], C.steel[3]]); for (let k = -2; k <= 2; k++) p.px(cx + k * 5, cy + R - 4, C.steel[4]);
  };
  P.mk('zk_body', 96, 96, 3, (p, f) => body(p, f, false), { up: 0.06, down: 0.12, dark: 0.55 });
  P.mk('zk_body_c', 96, 96, 3, (p, f) => body(p, f, true), { up: 0.06, down: 0.12, dark: 0.55 });
  P.mk('zk_glob', 9, 9, 2, (p, f) => { p.ell(4, 4, 3.6, 3.6, f ? '#ffd050' : '#ffb020'); p.ell(3, 3, 1.4, 1.4, '#fff8d0'); });
  // retrato del Archivo: esfera sobre sus patas
  P.mk('zyrkalia', 110, 120, 1, p => { const S2 = P.ZKC.steel; for (const [fx, kx, ky] of [[8, 22, 70], [102, 88, 70], [30, 40, 86], [80, 70, 86]]) { p.thick(55, 70, kx, ky, 4, S2[2]); p.thick(kx, ky, fx, 118, 3, S2[1]); p.ell(kx, ky, 3, 3, S2[3]); } p.thick(55, 76, 55, 112, 5, S2[2]); p.tri(52, 112, 58, 112, 55, 119, S2[3]); }, { outline: false });
  { const s = P.S.zyrkalia.f[0], x = s.getContext('2d'); x.drawImage(P.S.zk_body.f[0], 7, 0); }
};
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildZyrkalia(); }; })();

P.ZYRKALIA_ARENA = P.BOSS_ARENA.slice();
P.ARENAS = P.ARENAS || {}; P.ARENAS.zyrkalia = P.ZYRKALIA_ARENA;

P.Zyrkalia = class extends P.Enemy {
  constructor(L, x, floorY) {
    super(L, 300, -200, 72, 72, { kind: 'zyrkalia', hp: 1300, dmg: 16, xp: 360, beast: true, spr: null, heavy: true });
    this.maxhp = this.hp = 1300; this.boss = true; this.floorY = floorY; this.face = -1; this.state = 'intro'; this.st = 0; this.phase = 1; this.cd = 60; this.active = false;
    this.name = 'ZYRKALIA'; this.title = 'Reina Esférica Colménica'; this.bx = 320; this.by = -120; this.drill = 0; this.marks = []; this.lastAtk = ''; this.blink = 0;
    this.feet = [-70, -34, 34, 70].map(o => ({ o, x: this.bx + o, y: floorY, mv: 0, fx: 0, tx: 0, lift: 0 }));
    this.sync();
  }
  get standY() { return this.floorY - 96; }
  get exposed() { return this.state === 'drill' && this.step === 2; }
  get frame() { return this.exposed ? 2 : this.blink > 0 ? 1 : 0; }
  sync() { this.x = this.bx - 36; this.y = this.by - 36; this.w = 72; this.h = 72; }
  hit(d, o = {}) {
    if (this.dead || this.dying || !this.active || this.by < 0) return;
    const m = this.exposed ? 2 : 0.8; d = Math.max(1, Math.round(d * m)); this.hp -= d; this.flash = 6;
    this.L.popups.push({ x: this.bx + P.rand(-8, 8), y: this.by - 44, text: String(d), col: m > 1 ? '#ffd166' : '#ffd8a0', t: 0, big: m > 1 });
    if (m > 1 && this.t - (this.txtT || -99) > 50) { this.txtT = this.t; this.L.popups.push({ x: this.bx, y: this.by - 58, text: '¡OJO CENTRAL EXPUESTO!', col: '#ffd166', t: 0 }); }
    this.L.parts.burst(this.bx + P.rand(-20, 20), this.by + P.rand(-20, 20), 4, { col: P.pick(['#ffb020', '#fff0a0']), smin: 0.5, smax: 2, lmin: 6, lmax: 14 }); P.Audio.sfx(m < 1 ? 'block' : 'ehit');
    if (o.poison) this.poisonT = 90;
    if (this.hp <= 0) return this.die();
    const f = this.hp / this.maxhp; if (this.phase === 1 && f < 0.66) this.toPhase(2); else if (this.phase === 2 && f < 0.33) this.toPhase(3);
  }
  toPhase(n) { this.phase = n; this.L.popups.push({ x: this.bx, y: this.by - 70, text: n === 2 ? '¡LA COLMENA DESPIERTA!' : '¡SUS CELDAS SE AGRIETAN!', col: '#ff8ad8', t: 0, big: true }); this.L.parts.burst(this.bx, this.by, 30, { col: '#ffb020', smin: 1, smax: 4, g: 0.1 }); P.Audio.sfx('roar'); P.shake(5, 30); }
  die() {
    if (this.dying) return; this.dying = true; this.hp = 0; this.state = 'death'; this.st = 0; this.isEnemy = false; this.untouchable = true; this.marks = [];
    P.State.task('zyrkalia', 'defeat'); P.State.data.stats.kills++; P.Audio.sfx('roar'); this.L.player.iframes = 400;
    for (const e of this.L.ents) if (e.isEnemy && e !== this && !e.dead && !e.passive) e.die();
  }
  pick() {
    const ph = this.phase, opts = ph === 1 ? ['volley', 'stomp', 'drill', 'volley'] : ph === 2 ? ['volley', 'stomp', 'drill', 'swarm', 'stomp'] : ['volley', 'stomp', 'drill', 'swarm', 'stomp', 'drill'];
    let a = P.pick(opts); if (a === this.lastAtk && Math.random() < 0.75) a = P.pick(opts);
    if (a === 'swarm' && this.L.ents.filter(e => e.zkKid && !e.dead).length >= 4) a = 'volley';
    this.lastAtk = a; this.state = a; this.st = 0; this.step = 0;
  }
  updateFeet() {
    const fy = this.floorY;
    for (const f of this.feet) {
      const rest = this.bx + f.o;
      if (this.state === 'death') { f.y = Math.min(fy, f.y + 1); continue; }
      if (f.stab) continue;
      if (f.mv > 0) { f.mv = Math.min(1, f.mv + 0.1); f.x = f.fx + (f.tx - f.fx) * f.mv; f.y = fy - Math.sin(f.mv * Math.PI) * 14; if (f.mv >= 1) { f.mv = 0; f.y = fy; P.Audio.sfx('step'); this.L.parts.burst(f.x, fy - 1, 3, { col: '#c8a060', smin: 0.5, smax: 1.5, g: 0.2 }); } continue; }
      f.y = fy; const busy = this.feet.some(g => g.mv > 0);
      if (Math.abs(f.x - rest) > 20 && !busy) { f.mv = 0.01; f.fx = f.x; f.tx = rest + Math.sign(rest - f.x) * 8; }
    }
  }
  update() {
    const L = this.L, p = L.player, fy = this.floorY, ph = this.phase, spd = ph === 3 ? 1.3 : ph === 2 ? 1.12 : 1, x0 = L.minX + 80, x1 = L.maxX - 80;
    this.t++; if (this.flash > 0) this.flash--; if (this.blink > 0) this.blink--; else if (Math.random() < 0.006) this.blink = 8;
    if (this.poisonT > 0) { this.poisonT--; if (this.poisonT % 30 === 0 && this.active) { this.hp -= 2; if (this.hp <= 0) this.die(); } }
    if (!this.seen && this.by > 0) { this.seen = true; P.State.see('zyrkalia'); }
    this.st++;
    switch (this.state) {
      case 'intro': break;
      case 'roar': this.by += (this.standY - this.by) * 0.05; if (this.st === 60) { P.Audio.sfx('roar'); P.shake(6, 40); } if (this.st > 100) { this.state = 'idle'; this.cd = 40; } break;
      case 'idle': { this.by += (this.standY + Math.sin(this.t * 0.05) * 3 - this.by) * 0.1; const tx = P.clamp(p.cx + (p.cx > this.bx ? -110 : 110), x0, x1); this.bx += P.clamp((tx - this.bx) * 0.02, -0.9 * spd, 0.9 * spd); if (--this.cd <= 0) this.pick(); break; }
      case 'volley': {
        // las celdas se abren y escupen miel en abanico
        const n = ph === 3 ? 12 : ph === 2 ? 10 : 8, shots = ph === 3 ? 3 : 2;
        if (this.st % 34 === 0 && this.st <= 34 * shots) { P.Audio.sfx('spine'); for (let i = 0; i < n; i++) { const a = -Math.PI + (i + 0.5) / n * Math.PI + (this.st / 34) * 0.15; L.add(new P.Proj(L, this.bx + Math.cos(a) * 34, this.by + Math.sin(a) * 34, Math.cos(a) * 2.6 * spd, Math.sin(a) * 2.6 * spd - 0.6, { dmg: 11, spr: 'zk_glob', grav: 0.06, life: 220, w: 8, h: 8, glow: '#ffb020' })); } }
        if (this.st > 34 * shots + 30) { this.state = 'idle'; this.cd = 40 / spd; }
        break;
      }
      case 'stomp': {
        // levanta una (o dos) patas sobre una marca brillante y la clava
        if (this.st === 1) { this.marks = []; const legs = ph === 1 ? [this.feet[p.cx > this.bx ? 3 : 0]] : [this.feet[0], this.feet[3]]; legs.forEach((f, i) => { const tx = P.clamp(i === 0 && legs.length === 1 ? p.cx : (i === 0 ? Math.min(p.cx, this.bx - 20) : Math.max(p.cx, this.bx + 20)), L.minX + 20, L.maxX - 20); f.stab = { tx, t: 0, x0: f.x }; this.marks.push({ x: tx, t: 0 }); }); P.Audio.sfx('charge'); }
        for (const f of this.feet) if (f.stab) { const s = f.stab; s.t++; if (s.t < 34) { f.x += (s.tx - f.x) * 0.12; f.y = fy - Math.min(40, s.t * 2); } else if (s.t < 40) { f.y = Math.min(fy, f.y + 12); if (f.y >= fy && !s.hit) { s.hit = true; P.Audio.sfx('bigexplode'); P.shake(5, 14); L.parts.burst(f.x, fy - 2, 14, { col: P.pick(['#c8a060', '#ffb020']), smin: 1, smax: 3, g: 0.2, size: 2 }); if (!p.dead && Math.abs(p.cx - f.x) < 16 && p.y + p.h > fy - 30) p.hurt(15, f.x); } } else if (s.t > 56) f.stab = null; }
        if (this.st > 70) { this.feet.forEach(f => f.stab = null); this.marks = []; this.state = 'idle'; this.cd = 34 / spd; }
        break;
      }
      case 'drill':
        // se agacha, clava el taladro (onda sísmica) y deja el ojo central abierto
        if (this.step === 0) { this.drill = Math.min(1, this.drill + 0.04); this.by += (this.standY + 14 - this.by) * 0.08; if (this.st > 34 / spd) { this.step = 1; this.st = 0; } }
        else if (this.step === 1) { this.drill = Math.min(1.6, this.drill + 0.2); if (this.st === 4) { P.Audio.sfx('bigexplode'); P.shake(9, 26); for (const s of [-1, 1]) L.add(new P.Proj(L, this.bx + s * 20, fy - 8, s * (2.4 + ph * 0.4), 0, { dmg: 13, spr: 'zk_glob', life: 140, w: 10, h: 10, glow: '#ffb020' })); L.parts.burst(this.bx, fy - 2, 26, { col: P.pick(['#c8a060', '#ffd050']), smin: 1, smax: 4, g: 0.2, size: 2 }); } if (this.st > 10) { this.step = 2; this.st = 0; P.toast('¡Taladro clavado! Dispara a su ojo central', { col: P.UIC.gold, life: 80 }); } }
        else if (this.step === 2) { if (this.st > (ph === 3 ? 80 : 105)) { this.step = 3; this.st = 0; } }
        else { this.drill = Math.max(0, this.drill - 0.05); this.by += (this.standY - this.by) * 0.08; if (this.drill <= 0) { this.state = 'idle'; this.cd = 30; } }
        break;
      case 'swarm':
        if (this.st === 20) { P.Audio.sfx('roar'); for (let i = 0; i < (ph === 3 ? 3 : 2); i++) { const e = L.add(new P.Fly(L, this.bx - 8 + (i - 1) * 24, this.by - 10, false)); e.kind = 'zumboptero'; e.zkKid = true; L.parts.burst(e.cx, e.cy, 8, { col: '#ffe080', smin: 1, smax: 2 }); } }
        if (this.st > 50) { this.state = 'idle'; this.cd = 40; }
        break;
      case 'death':
        this.by = Math.min(fy - 34, this.by + this.st * 0.02); if (this.st % 6 === 0) { P.Audio.sfx('explode'); L.parts.burst(this.bx + P.rand(-36, 36), this.by + P.rand(-36, 36), 10, { col: P.pick(['#ffb020', '#fff0a0', '#ff8a3a', '#3ae0d0']), smin: 1, smax: 4, lmin: 20, lmax: 40, glow: 4 }); }
        if (this.st === 150) { P.Audio.sfx('bigexplode'); P.shake(12, 40); for (let i = 0; i < 60; i++) { const a = Math.random() * 7; L.parts.add({ x: this.bx, y: this.by, vx: Math.cos(a) * P.rand(1, 6), vy: Math.sin(a) * P.rand(1, 6) - 1, g: 0.15, life: P.ri(30, 70), col: P.pick(['#ffb020', '#fff0a0', '#c07010']), size: 3, shrink: true }); } this.dead = true; P.drop(L, this.bx, this.by, { xp: 360, crys: 8, bio: 12 }); L.onBossDefeated(this); }
        break;
    }
    for (const m of this.marks) m.t++;
    this.updateFeet(); this.sync();
    if (this.active && !this.dying && !p.dead && (P.dist(p.cx, p.cy, this.bx, this.by) < 34 || (this.drill > 0.5 && Math.abs(p.cx - this.bx) < 7 && p.y + p.h > this.by + 34))) p.hurt(this.dmg, this.bx);
  }
  draw(c, cx, cy) {
    const fy = this.floorY;
    for (const m of this.marks) { c.globalAlpha = 0.4 + Math.sin(m.t * 0.5) * 0.3; c.fillStyle = '#ffd060'; c.fillRect(m.x - cx - 8, fy - cy - 2, 16, 2); c.globalAlpha = 1; }
    if (this.by < -60) return;
    const dA = this.state === 'death' ? Math.max(0, 1 - (this.st - 110) / 40) : 1, S = this.flash > 0 ? ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'] : P.ZKC.steel; c.globalAlpha = dA;
    const hubY = this.by + 34;
    P.drawGlow(c, this.bx - cx, this.by - cy, 60, this.phase === 3 ? '#ff6a3a' : '#ffb020', 0.2);
    // patas mecánicas: dos traseras (oscuras) y dos delanteras; rodillas altas con articulaciones atornilladas
    const leg = (f, back) => { const hx = this.bx + Math.sign(f.o) * (back ? 8 : 14), kx = hx + (f.x - hx) * 0.55, ky = Math.min(hubY, f.y) - (back ? 18 : 26), C = back ? [S[0], S[1], S[1], S[2]] : S; P.arcSeg(c, hx - cx, hubY - cy, kx - cx, ky - cy, back ? 5 : 6, back ? 4 : 5, C[1], C[3], C[0]); P.arcSeg(c, kx - cx, ky - cy, f.x - cx, f.y - cy, back ? 4 : 5, 2, C[2], C[3], C[0]); c.fillStyle = C[3]; c.fillRect(Math.round(kx - cx) - 3, Math.round(ky - cy) - 3, 6, 6); c.fillStyle = C[0]; c.fillRect(Math.round(kx - cx) - 1, Math.round(ky - cy) - 1, 2, 2); for (let k = 1; k < 4; k++) { const t = k / 4; c.fillStyle = C[0]; c.fillRect(Math.round(kx + (f.x - kx) * t - cx) - 2, Math.round(ky + (f.y - ky) * t - cy), 4, 1); } };
    leg(this.feet[1], true); leg(this.feet[2], true);
    // pata central con taladro
    const dl = (fy - hubY - 4) * Math.min(1, 0.55 + this.drill * 0.3), dy = hubY + dl; P.arcSeg(c, this.bx - cx, hubY - cy, this.bx - cx, dy - cy, 8, 6, S[2], S[4], S[0]); for (let y = hubY + 6; y < dy; y += 7) { c.fillStyle = S[0]; c.fillRect(Math.round(this.bx - cx) - 4, Math.round(y - cy), 8, 1); }
    c.fillStyle = S[3]; c.beginPath(); c.moveTo(this.bx - cx - 5, dy - cy); c.lineTo(this.bx - cx + 5, dy - cy); c.lineTo(this.bx - cx, dy - cy + 10 + this.drill * 4); c.fill(); if (this.drill > 0.3 && (this.t >> 1) % 2) { c.fillStyle = S[4]; c.fillRect(Math.round(this.bx - cx) - 1, Math.round(dy - cy) + 2, 2, 6); }
    P.spr(c, this.phase === 3 ? 'zk_body_c' : 'zk_body', this.frame, Math.round(this.bx - 48 - cx), Math.round(this.by - 46 - cy + Math.sin(this.t * 0.07) * 1.5), { flash: this.flash > 0 });
    if (this.exposed) { P.drawGlow(c, this.bx - cx, this.by - cy, 22, '#3ae0d0', 0.5 + Math.sin(this.t * 0.3) * 0.2); if (this.t % 20 < 10) P.txt(c, '▼', this.bx - cx - 2, this.by - cy - 58, '#ffd166'); }
    leg(this.feet[0], false); leg(this.feet[3], false);
    c.globalAlpha = 1;
  }
};
P.BOSS_CLASS = P.BOSS_CLASS || {}; P.BOSS_CLASS.zyrkalia = P.Zyrkalia;
