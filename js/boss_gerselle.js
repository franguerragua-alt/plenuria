'use strict';
// GERSELLE — la Primera Ministra, jefa del Área III, en el Parlamento, a los mandos de su traje robótico de combate.
// Diseño (referencia): calavera con moño negro adornado con flores rojas y vestido negro de cuello alto con bordado rojo;
// el traje repite esa elegancia (laca negra, bordado carmesí, marfil) y ella se ve en la cabina.
// Combate de posición: sus abanicos de guerra DESVÍAN lo que le llega de frente mientras no ataca. Rodéala o castígala
// tras la estocada. Fases: 1 moción de censura · 2 estado de excepción (decretos láser y drones) · 3 disolución (sin coraza).
P.Sprites.buildGerselle = function () {
  const K = ['#06040a', '#141018', '#241c26', '#3a2c38', '#5a4454'], R = ['#6a0a1a', '#b0102a', '#ff2a4a', '#ff8a9a'], IV = ['#a49a82', '#d8d0b8', '#f4eedc'];
  const G4 = ['#4a300a', '#8a6a1a', '#c0962a', '#ffe08a'], GL = ['#0c1824', '#16283a', '#22405a', '#5a8ab0'];
  // [desplazamiento, zancada, brazo del abanico (0 reposo · 1 lanzando · 2 estocada · 3 arriba), roto]
  const POSE = [[0, 0, 0, 0], [1, 0, 0, 0], [0, 4, 0, 0], [0, -4, 0, 0], [0, 0, 1, 0], [4, 6, 2, 0], [0, 0, 3, 0], [0, 0, 0, 1], [10, 0, 0, 0]];
  const rose = (p, x, y) => { p.px(x - 1, y, R[1]); p.px(x + 1, y, R[1]); p.px(x, y - 1, R[2]); p.px(x, y + 1, R[0]); p.px(x, y, R[3]); p.px(x - 1, y + 1, K[4]); };
  // abanico de guerra: papel plisado carmesí, varillas de laca, borde dorado y arco bordado
  const fan = (p, cx, cy, a0, spread, r) => {
    const n = 9;
    for (let rr = 3; rr <= r; rr++) for (let s = -1; s <= 1; s += 1 / (rr * 1.3)) { const a = a0 + s * spread / 2, band = Math.min(n - 1, Math.floor((s + 1) / 2 * n)); p.px(Math.round(cx + Math.cos(a) * rr), Math.round(cy + Math.sin(a) * rr), rr >= r - 1 ? G4[2] : band % 2 ? R[1] : R[2]); }
    for (let k = 0; k <= n; k++) { const a = a0 + (k / n - 0.5) * spread; p.line(cx, cy, Math.round(cx + Math.cos(a) * (r - 2)), Math.round(cy + Math.sin(a) * (r - 2)), K[1]); }
    if (spread > 0.8) for (let k = 0; k <= 12; k++) { const a = a0 + (k / 12 - 0.5) * spread * 0.9; p.px(Math.round(cx + Math.cos(a) * r * 0.62), Math.round(cy + Math.sin(a) * r * 0.62), k % 2 ? R[3] : G4[3]); }
    p.ell(cx, cy, 1.6, 1.6, G4[2]); p.px(cx, cy, IV[2]);
  };
  P.mk('gerselle', 80, 90, 9, (p, f) => {
    const [by, st, arm, broken] = POSE[f], top = 52 + by, bot = 86;
    // piernas mecánicas finas con tacón (se ven bajo el vestido; enteras si la coraza está rota)
    for (const [hx, d] of [[35, -1], [45, 1]]) { const fx = hx + d * Math.abs(st) * 0.5 + (d < 0 ? -st : st) * 0.5; p.thick(hx, top + 6, fx, bot, 3, K[2]); p.line(hx - 1, top + 6, fx - 1, bot, K[4]); p.sell(Math.round((hx + fx) / 2), Math.round((top + 6 + bot) / 2), 2, 2, [IV[0], IV[1], IV[2]]); p.rect(Math.round(fx) - 3, bot, 7, 3, K[1]); p.rect(Math.round(fx) - 3, bot, 7, 1, K[4]); p.px(Math.round(fx) + 3 * d, bot + 2, G4[2]); p.px(Math.round(fx) + 4 * d, bot + 3, G4[2]); }
    // falda-armadura: tres volantes de laca que se abren como un vestido, con bordado carmesí y ribete dorado
    const tiers = broken ? 1 : 3;
    for (let tr = 0; tr < tiers; tr++) {
      const y0 = top + Math.round((bot - top) * tr / 3), y1 = top + Math.round((bot - top) * (tr + 1) / 3);
      for (let y = y0; y <= y1; y++) {
        const u = (y - top) / (bot - top), hw = 9 + u * 21, sk = st * u * 0.7, xl = Math.round(40 - hw + sk), xr = Math.round(40 + hw + sk);
        for (let x = xl; x <= xr; x++) { const v = (x - xl) / Math.max(1, xr - xl); p.px(x, y, v < 0.1 ? K[4] : v < 0.38 ? K[3] : v < 0.78 ? K[2] : K[1]); }
        if (y === y1) { p.line(xl, y, xr, y, G4[2]); p.line(xl, y - 1, xr, y - 1, K[1]); }
        if (y === y1 - 3) for (let x = xl + 2; x <= xr - 2; x++) { p.px(x, y - ((x >> 1) % 2), R[1]); if (x % 10 === 0) rose(p, x, y - 4); }
      }
    }
    if (broken) { const y1 = top + Math.round((bot - top) / 3); for (let x = 30; x <= 50; x += 3) p.tri(x, y1, x + 3, y1, x + 1 + (x % 2), y1 + 4 + (x % 5), K[2]); p.px(36, y1 + 1, G4[3]); p.px(44, y1 + 2, '#ffd166'); }
    else for (let k = -2; k <= 2; k++) { const xa = 40 + k * 3, xb = Math.round(40 + k * 9 + st * 0.7); p.line(xa, top + 3, xb, bot - 2, K[1]); if (k % 2) p.line(xa + 1, top + 3, xb + 1, bot - 2, k < 0 ? K[4] : K[3]); }
    // corsé de laca con ballenas, enredadera bordada, broche dorado y fajín
    const cT = 28 + by, cB = 52 + by;
    for (let y = cT; y <= cB; y++) { const u = (y - cT) / (cB - cT), hw = Math.round(8 + 5.5 * Math.pow(1 - u, 1.2)); for (let x = 40 - hw; x <= 40 + hw; x++) { const v = (x - 40 + hw) / (2 * hw); p.px(x, y, v < 0.14 ? K[4] : v < 0.45 ? K[3] : v < 0.82 ? K[2] : K[1]); } }
    for (const dx of [-6, -3, 3, 6]) { p.line(40 + dx, cT + 4, 40 + Math.round(dx * 0.7), cB - 1, K[1]); p.px(40 + dx, cT + 4, K[4]); }
    if (!broken) { for (let y = cT + 6; y < cB - 2; y++) { p.px(40 + ((y >> 1) % 2 ? 1 : -1), y, R[2]); if (y % 4 === 0) { p.px(38, y, R[1]); p.px(42, y + 1, R[1]); } } rose(p, 37, cT + 14); rose(p, 43, cT + 19); }
    else { p.rect(34, cT + 8, 12, 12, K[0]); for (let k = 0; k < 4; k++) p.rect(35 + k * 3, cT + 8, 1, 12, K[3]); p.sell(40, cT + 14, 3, 3, [R[0], R[1], R[2], '#ffffff']); p.line(34, cT + 8, 37, cT + 11, G4[3]); p.line(46, cT + 19, 43, cT + 16, IV[1]); }
    p.sell(40, cT + 5, 3, 3, [G4[0], G4[1], G4[2], G4[3]]); p.px(40, cT + 5, R[2]);
    p.rect(40 - 9, cB - 1, 19, 3, R[1]); p.rect(40 - 9, cB - 1, 19, 1, R[2]); p.rect(40 - 9, cB + 1, 19, 1, G4[2]); p.tri(41, cB, 46, cB + 7, 43, cB + 1, R[1]);
    // cuello alto en abanico (gola) detrás de la cabina, con varillas y borde carmesí
    for (let rr = 10; rr <= 18; rr++) for (let a = Math.PI * 1.05; a <= Math.PI * 1.95; a += 0.6 / rr) { const x = Math.round(40 + Math.cos(a) * rr * 1.05), y = Math.round(25 + by + Math.sin(a) * rr * 0.95); p.px(x, y, rr >= 17 ? R[2] : rr === 16 ? R[0] : ((Math.round(a * 14) % 2) ? K[2] : K[3])); }
    for (let k = 0; k <= 8; k++) { const a = Math.PI * (1.05 + k * 0.1125); p.line(40, 25 + by, Math.round(40 + Math.cos(a) * 17), Math.round(25 + by + Math.sin(a) * 16), K[1]); p.px(Math.round(40 + Math.cos(a) * 18), Math.round(25 + by + Math.sin(a) * 17), G4[3]); }
    // hombreras redondas con rosa
    for (const sx of [27, 53]) { p.sell(sx, 31 + by, 6, 5, [K[1], K[2], K[3], K[4]]); p.line(sx - 5, 34 + by, sx + 5, 34 + by, G4[2]); rose(p, sx, 29 + by); }
    // brazos articulados y abanicos
    const sh = [[27, 33 + by], [53, 33 + by]];
    const hands = arm === 3 ? [[15, 9 + by], [65, 9 + by]] : arm === 1 ? [[18, 55 + by], [73, 36 + by]] : arm === 2 ? [[17, 44 + by], [76, 45 + by]] : [[18, 55 + by], [62, 55 + by]];
    const fans = arm === 3 ? [[-Math.PI * 0.72, 2.1, 13], [-Math.PI * 0.28, 2.1, 13]] : arm === 1 ? [[Math.PI * 0.62, 0.7, 10], [-0.12, 2.3, 15]] : arm === 2 ? [[Math.PI * 0.95, 1.6, 12], [0.02, 0.32, 16]] : [[Math.PI * 0.64, 0.7, 10], [Math.PI * 0.36, 0.7, 10]];
    for (let i = 0; i < 2; i++) {
      const [ax, ay] = sh[i], [hx, hy] = hands[i], d = i ? 1 : -1, ex = Math.round((ax + hx) / 2 + d * 4), ey = Math.round((ay + hy) / 2 + 2);
      p.thick(ax, ay, ex, ey, 3, K[3]); p.thick(ex, ey, hx, hy, 3, K[2]); p.line(ax, ay - 1, ex, ey - 1, K[4]); p.sell(ex, ey, 2, 2, [IV[0], IV[1], IV[2]]);
      if (!broken || arm) fan(p, hx, hy, fans[i][0], fans[i][1], fans[i][2]); else fan(p, hx, hy, fans[i][0], 0.3, 9);
      p.ell(hx, hy, 2, 2, IV[1]); p.px(hx, hy, G4[3]);
    }
    // cabina de cristal: GERSELLE dentro (calavera con moño negro y flores rojas)
    const hy = 21 + by;
    p.ell(40, hy, 12, 11, K[0]); p.sell(40, hy, 11, 10, [GL[0], GL[1], GL[2], GL[3]]);
    p.sell(40, hy - 7, 5.5, 4, [K[0], K[1], K[2], K[3]]); p.px(38, hy - 9, K[4]); p.line(35, hy - 7, 45, hy - 8, G4[2]); rose(p, 35, hy - 6); rose(p, 45, hy - 6); rose(p, 40, hy - 11);
    p.sell(40, hy + 1, 5, 5.5, [IV[0], IV[1], IV[2], '#ffffff']); p.rect(37, hy, 2, 2, K[0]); p.rect(41, hy, 2, 2, K[0]); p.px(37, hy, R[2]); p.px(42, hy, R[2]); p.px(40, hy + 3, K[0]); for (let x = 37; x <= 43; x += 2) p.px(x, hy + 5, K[0]);
    p.rect(37, hy + 7, 7, 2, K[1]); p.px(40, hy + 7, R[2]);
    for (let k = 0; k < 6; k++) p.px(32 + k, hy - 6 + k, k < 3 ? '#9ad0f0' : GL[3]); p.px(33, hy - 4, '#ffffff');
    for (let a = 0.15; a < Math.PI - 0.15; a += 0.07) p.px(Math.round(40 + Math.cos(a) * 11.5), Math.round(hy + Math.sin(a) * 10.5), G4[2]);
    if (broken) { p.line(43, hy - 8, 47, hy - 1, '#e8f4ff'); p.line(45, hy - 4, 49, hy - 5, '#e8f4ff'); p.line(44, hy - 6, 41, hy + 2, '#9ad0f0'); }
  });
  P.mk('fanblade', 16, 16, 4, (p, f) => { fan(p, 8, 8, f * Math.PI / 2, Math.PI * 1.5, 7); });
};
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildGerselle(); }; })();
P.ARENAS = P.ARENAS || {}; P.ARENAS.gerselle = P.BOSS_ARENA.slice();

// abanico de guerra lanzado: sale, frena y vuelve a su mano
P.FanBlade = class extends P.Ent {
  constructor(L, owner, dir, y) { super(L, owner.cx - 7, y, 14, 14); this.o = owner; this.vx = dir * 6.5; this.back = false; }
  update() { this.t++; const p = this.L.player, o = this.o; if (!this.back) { this.vx *= 0.955; if (Math.abs(this.vx) < 0.5) this.back = true; this.x += this.vx; } else { const dx = o.cx - this.cx, dy = o.cy - this.cy, d = Math.hypot(dx, dy) || 1; this.x += dx / d * 5.5; this.y += dy / d * 5.5; if (d < 14 || o.dead) this.dead = true; }
    if (!p.dead && P.overlap(this, p)) p.hurt(11, this.cx); if (this.t % 3 === 0) this.L.parts.add({ x: this.cx, y: this.cy, life: 10, col: '#ff2a4a', size: 1 }); }
  draw(c, cx, cy) { P.spr(c, 'fanblade', (this.t >> 1) % 4, Math.round(this.x - 1 - cx), Math.round(this.y - 1 - cy)); P.drawGlow(c, this.cx - cx, this.cy - cy, 10, '#ff2a4a', 0.35); }
};

P.Gerselle = class extends P.Enemy {
  constructor(L, x, floorY) {
    super(L, 340, floorY - 72, 32, 72, { kind: null, hp: 1800, dmg: 12, xp: 550, beast: false, cyber: true, spr: 'gerselle', heavy: true });
    this.maxhp = this.hp = 1800; this.boss = true; this.floorY = floorY; this.face = -1; this.state = 'intro'; this.st = 0; this.phase = 1; this.cd = 60; this.active = false;
    this.name = 'GERSELLE'; this.title = 'La Primera Ministra'; this.glowCol = '#ff2a4a'; this.y = floorY - 72; this.marks = []; this.beams = []; this.last = ''; this.frame = 0;
  }
  get spd() { return [1, 1, 1.15, 1.45][this.phase]; }
  get guarded() { return this.phase < 3 && ['idle', 'fans', 'salvo', 'drones'].includes(this.state); }
  hit(d, o = {}) {
    if (this.dead || this.dying || !this.active || this.state === 'shift' || this.state === 'roar') return;
    const front = o.x == null || Math.sign(o.x - this.cx) === this.face;
    if (this.guarded && front) { // desvía el disparo de vuelta
      const L = this.L, p = L.player; L.add(new P.Proj(L, this.cx + this.face * 18, this.y + 30, Math.sign(p.cx - this.cx) * 4.2, (p.cy - this.y - 30) / 60, { dmg: 7, spr: 'b_kspine', w: 10, h: 4, life: 100, glow: '#ff2a4a' }));
      if (this.t - (this.noT || -99) > 24) { this.noT = this.t; L.popups.push({ x: this.cx, y: this.y - 6, text: 'DESVIADO', col: '#ff8a9a', t: 0 }); } P.Audio.sfx('block'); this.fanFlash = 6; return; }
    if (this.state === 'stagger') { d *= 1.5; o = Object.assign({}, o, { crit: true }); }
    super.hit(d, Object.assign({}, o, { knock: 0 }));
    if (!this.dying && !this.dead) { const f = this.hp / this.maxhp; if (this.phase === 1 && f < 0.66) this.toPhase(2); else if (this.phase === 2 && f < 0.33) this.toPhase(3); }
  }
  toPhase(n) { this.phase = n; this.state = 'shift'; this.st = 0; this.marks = []; this.beams = []; P.Audio.sfx('roar'); P.shake(7, 30); const L = this.L; L.fx.push({ k: 'ring', x: this.cx, y: this.cy, t: 0, life: 40, r: 150, col: '#ff2a4a' });
    L.popups.push({ x: this.cx, y: this.y - 20, text: n === 2 ? '«SE DECLARA EL ESTADO DE EXCEPCIÓN»' : '«¡QUEDA DISUELTO EL PARLAMENTO!»', col: '#f4eedc', t: 0, big: true });
    if (n === 3) { P.Audio.stopMusic(); P.Audio.music('gerselle_3'); for (let k = 0; k < 30; k++) L.parts.add({ x: this.cx + P.rand(-20, 20), y: this.cy + P.rand(-20, 20), vx: P.rand(-4, 4), vy: -P.rand(2, 6), g: 0.2, life: 60, col: P.pick(['#241c26', '#3a2c38', '#ff2a4a', '#c0962a']), size: 2 }); } }
  die() { if (this.dying) return; this.dying = true; this.hp = 0; this.state = 'death'; this.st = 0; this.isEnemy = false; this.untouchable = true; this.marks = []; this.beams = []; this.L.player.iframes = 400; for (const e of this.L.ents) if ((e.isEnemy && e !== this && !e.passive) || e instanceof P.FanBlade) { if (e.die) e.die(); else e.dead = true; } P.Audio.sfx('roar'); }
  pick() { const ph = this.phase, pool = ph === 1 ? ['fans', 'salvo', 'slash', 'fans'] : ph === 2 ? ['fans', 'salvo', 'slash', 'decree', 'drones', 'decree'] : ['dance', 'slash', 'decree', 'fans', 'dance']; let a = P.pick(pool); if (a === this.last) a = P.pick(pool); this.last = a; this.state = a; this.st = 0; this.vx = 0; }
  update() {
    const L = this.L, p = L.player, fy = this.floorY, ph = this.phase, spd = this.spd; this.t++; this.st++; if (this.flash > 0) this.flash--; if (this.fanFlash > 0) this.fanFlash--;
    const toward = Math.sign(p.cx - this.cx) || 1;
    switch (this.state) {
      case 'intro': break;
      case 'roar': this.face = toward; if (this.st === 20) { P.Audio.sfx('door'); L.popups.push({ x: this.cx, y: this.y - 16, text: '«ORDEN EN LA SALA»', col: '#f4eedc', t: 0 }); } if (this.st === 60) { P.Audio.sfx('roar'); P.shake(6, 20); } if (this.st > 90) { this.state = 'idle'; this.cd = 40; } break;
      case 'idle': this.face = toward; { const d = Math.abs(p.cx - this.cx); this.vx = toward * (d > 160 ? 1 : d < 80 ? -0.8 : 0) * spd; } if (--this.cd <= 0) this.pick(); this.gravityMove(); break;
      case 'fans': this.face = toward; this.vx = 0; this.gravityMove(); if (this.st === 18) L.add(new P.FanBlade(L, this, this.face, this.y + 24)); if (this.st === 34 && ph >= 2) L.add(new P.FanBlade(L, this, this.face, this.y + 44)); if (this.st > 80) { this.state = 'idle'; this.cd = 40 / spd; } break;
      case 'salvo': this.face = toward; this.vx = 0; this.gravityMove(); if (this.st === 10) { this.marks = []; for (let k = 0; k < 4 + ph; k++) this.marks.push({ x: P.clamp(p.cx + (k - (3 + ph) / 2) * 44 + P.rand(-10, 10), L.minX + 14, L.maxX - 14), t: 0 }); P.Audio.sfx('spine'); for (let k = 0; k < 6; k++) L.parts.add({ x: this.cx + P.rand(-10, 10), y: this.y + 20, vy: -P.rand(4, 7), life: 30, col: '#ffd166', size: 2, glow: 3 }); }
        if (this.st > 120) { this.marks = []; this.state = 'idle'; this.cd = 30; } break;
      case 'slash': // se agacha (aviso), se lanza con una estocada de abanico y queda aturdida
        if (this.st === 1) { this.face = toward; this.sdir = toward; P.Audio.sfx('charge'); }
        if (this.st < 26 / spd) { this.vx = 0; this.gravityMove(); break; }
        this.vx = this.sdir * 7; this.gravityMove(); if (!p.dead && Math.abs(p.cx - (this.cx + this.sdir * 20)) < 22 && Math.abs(p.cy - this.cy) < 34) p.hurt(16, this.cx);
        if (this.st > 26 / spd + 22 || this.hitWall) { this.vx = 0; this.state = 'stagger'; this.st = 0; P.shake(3, 8); if (!L.geTip) { L.geTip = true; P.toast('¡GERSELLE se ha quedado sin guardia! Ataca ahora', { col: P.UIC.gold, life: 120 }); } } break;
      case 'stagger': this.vx = 0; this.gravityMove(); if (this.st > [0, 60, 50, 40][ph]) { this.state = 'idle'; this.cd = 30; } break;
      case 'decree': // decretos láser desde la cúpula: columnas que avisan y luego queman, siempre con huecos
        this.vx = 0; this.gravityMove(); if (this.st === 1) { this.beams = []; const n = 5 + ph, gap = P.ri(0, n - 1); for (let k = 0; k < n; k++) if (k !== gap && k !== gap + 1) this.beams.push({ x: L.minX + 30 + k * ((L.maxX - L.minX - 60) / (n - 1)), t: 0 }); P.Audio.sfx('charge'); }
        for (const b of this.beams) { b.t++; if (b.t > 50 && b.t < 82 && !p.dead && Math.abs(p.cx - b.x) < 9) p.hurt(13, b.x, { env: true }); if (b.t === 50) P.Audio.sfx('laser'); }
        if (this.st > 90) { this.beams = []; this.state = 'idle'; this.cd = 30; } break;
      case 'drones': this.vx = 0; this.gravityMove(); if (this.st === 20) for (const sx of [L.minX + 60, L.maxX - 60]) { const e = L.add(new P.Fly(L, sx - 8, 60, true)); e.kind = null; } if (this.st > 50) { this.state = 'idle'; this.cd = 40; } break;
      case 'dance': // sin coraza: danza de abanicos que cruza la sala dos veces
        if (this.st === 1) { this.ddir = toward; P.Audio.sfx('dash'); } this.vx = this.ddir * 4.2; this.gravityMove(); if (this.hitWall || this.x < L.minX + 4 || this.x + this.w > L.maxX - 4) { this.ddir *= -1; this.turns = (this.turns || 0) + 1; }
        if (!p.dead && P.overlap({ x: this.x - 10, y: this.y + 10, w: this.w + 20, h: this.h - 10 }, p)) p.hurt(13, this.cx); if (this.t % 2 === 0) L.parts.add({ x: this.cx + P.rand(-14, 14), y: this.cy + P.rand(-10, 10), life: 12, col: '#ff2a4a', size: 1, glow: 2 });
        if (this.turns >= 2) { this.turns = 0; this.state = 'stagger'; this.st = 0; } break;
      case 'shift': this.vx = 0; this.gravityMove(); if (this.st > 80) { this.state = 'idle'; this.cd = 30; } break;
      case 'death': this.vx = 0; this.gravityMove(); if (this.st % 8 === 0) { P.Audio.sfx('explode'); L.parts.burst(this.cx + P.rand(-18, 18), this.cy + P.rand(-24, 14), 8, { col: P.pick(['#ff2a4a', '#f4eedc', '#c0962a', '#3a2c38']), smin: 1, smax: 3, glow: 3 }); }
        if (this.st === 150) { P.Audio.sfx('bigexplode'); P.shake(10, 30); L.fx.push({ k: 'ring', x: this.cx, y: this.cy, t: 0, life: 40, r: 140, col: '#ff2a4a' }); this.dead = true; P.drop(L, this.cx, this.cy, { xp: 550, crys: 14, scrap: 24 }); L.onBossDefeated(this); } break;
    }
    // misiles que caen sobre las marcas
    for (const m of this.marks) { m.t++; if (m.t === 60) { P.Audio.sfx('explode'); L.fx.push({ k: 'ring', x: m.x, y: fy, t: 0, life: 16, r: 26, col: '#ffd166' }); L.parts.burst(m.x, fy - 4, 10, { col: P.pick(['#ffd166', '#ff8a2a', '#ffffff']), smin: 1, smax: 3, g: 0.15, size: 2, glow: 3 }); if (!p.dead && Math.abs(p.cx - m.x) < 16 && p.y + p.h > fy - 30) p.hurt(12, m.x, { env: true }); } }
    if (this.x < L.minX + 2) this.x = L.minX + 2; if (this.x + this.w > L.maxX - 2) this.x = L.maxX - 2 - this.w;
    if (this.active && !this.dying && !p.dead && P.overlap(this, p) && this.state !== 'dance') p.hurt(10, this.cx);
    this.frame = this.state === 'death' || this.state === 'stagger' ? 8 : this.phase === 3 && this.state !== 'slash' ? 7 : this.state === 'slash' ? (this.st < 26 / this.spd ? 8 : 5) : this.state === 'fans' ? 4 : this.state === 'decree' || this.state === 'salvo' || this.state === 'drones' || this.state === 'shift' ? 6 : Math.abs(this.vx) > 0.2 ? 2 + ((this.t >> 3) % 2) : (this.t >> 5) % 2;
  }
  draw(c, cx, cy) {
    if (this.dead) return; const L = this.L, fy = this.floorY, t = this.t;
    for (const b of this.beams) { const x = Math.round(b.x - cx); if (b.t < 50) { c.globalAlpha = 0.25 + ((b.t >> 2) % 2) * 0.3; c.fillStyle = '#ff2a4a'; c.fillRect(x - 1, 0, 2, Math.round(fy - cy)); c.globalAlpha = 1; } else if (b.t < 82) P.Energy.laser(c, x, 0, x, Math.round(fy - cy), t, '#ff2a4a', 4); }
    for (const m of this.marks) if (m.t < 60) { const k = m.t / 60; c.strokeStyle = '#ffd166'; c.globalAlpha = 0.4 + k * 0.5; c.beginPath(); c.ellipse(Math.round(m.x - cx), Math.round(fy - 2 - cy), 14 - k * 6, 3, 0, 0, 6.3); c.stroke(); c.globalAlpha = 1; c.fillStyle = '#ffd166'; c.fillRect(Math.round(m.x - cx), Math.round(fy - 2 - cy - (1 - k) * 200), 2, 4); }
    if (this.state === 'slash' && this.st < 26 / this.spd) { c.globalAlpha = 0.3 + ((this.st >> 2) % 2) * 0.3; c.fillStyle = '#ff2a4a'; c.fillRect(Math.round(this.cx - cx), Math.round(this.cy - cy), this.sdir * 160, 1); c.globalAlpha = 1; }
    const S = P.S.gerselle, x = Math.round(this.cx - S.w / 2 - cx), y = Math.round(this.y + this.h - S.h - cy), mx = x + S.w / 2;
    if (this.state === 'stagger') P.drawGlow(c, mx, y + 42, 34, '#ffd166', 0.45 + ((t >> 2) % 2) * 0.2);
    P.AnimFX.boss(c, this, 'gerselle', this.frame, x, y, { flip: this.face < 0, flash: this.flash > 0 }, cx, cy, { dis: [80, 150], trail: ['slash', 'dance'] });
    if (this.guarded && this.active && !this.dying) { const fx = mx + this.face * 34; P.drawGlow(c, fx, y + 42, 14 + (this.fanFlash || 0) * 2, '#ff2a4a', 0.25 + (this.fanFlash || 0) * 0.08); }
    if (this.phase === 3 && !this.dying) P.Energy.arc(c, mx - 12, y + 34, mx + 12, y + 58, t, '#ff8a9a', 1, 4);
  }
};
P.BOSS_CLASS = P.BOSS_CLASS || {}; P.BOSS_CLASS.gerselle = P.Gerselle;
