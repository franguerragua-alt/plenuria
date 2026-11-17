'use strict';
// THERSEK — el Vicepresidente, jefe del Área II, en el corazón nuclear de su complejo biotecnológico.
// Diseño (referencia): uniforme militar verde con ribetes rojos y medallas, gorra de oficial con insignia dorada, cara de
// calavera con ojos verdes, brazos cibernéticos y tentáculos segmentados con energía verde (animados en tiempo real).
// Su barrera absorbe el 75 % del daño: solo cuando clava los tentáculos en el suelo queda expuesto su núcleo de inyección.
P.Sprites.buildThersek = function () {
  const U = ['#081a0c', '#123a18', '#1e5a24', '#2f7a34', '#4aa850'], R = ['#7a1420', '#c0283a', '#ff5a6a'], G4 = ['#4a300a', '#8a6a1a', '#c0962a', '#ffe08a'];
  const B = ['#a49a82', '#d8d0b8', '#f4eedc'], MT = ['#1c2230', '#2c3446', '#5e6a86', '#8a96b4', '#c4ccdc'], G = ['#2a8a1e', '#7dff5a', '#d6ffc8'], KB = ['#06070c', '#12141c', '#262a38'];
  // [desplazamiento, piernas, brazos (0 abajo · 1 arriba · 2 lanzando), mutado]
  const POSE = [[0, 0, 0, 0], [1, 0, 0, 0], [0, 3, 0, 0], [0, 0, 1, 0], [0, 0, 2, 0], [3, 0, 0, 0], [0, 0, 1, 1], [12, 0, 0, 0]];
  P.mk('thersek', 60, 72, 8, (p, f) => {
    const [by, lg, arm, mut] = POSE[f], kneel = f === 7, eye = mut ? R[2] : G[1];
    // equipo dorsal: dos depósitos de suero verde con tubos (de ahí salen los tentáculos)
    for (const [tx, d] of [[13, -1], [43, 1]]) { p.rect(tx, 14 + by, 5, 16, MT[1]); p.rect(tx, 14 + by, 1, 16, MT[3]); p.rect(tx + 1, 17 + by, 3, 11, G[0]); p.rect(tx + 1, 17 + by, 1, 11, G[1]); p.px(tx + 2, 19 + by, G[2]); p.rect(tx - 1, 13 + by, 7, 2, MT[2]); p.rect(tx - 1, 29 + by, 7, 2, MT[2]); p.line(tx + 2, 31 + by, tx + 2 - d * 2, 36 + by, MT[2]); }
    // piernas: pantalón con franja roja y botas altas lustradas
    if (!kneel) for (const [hx, d] of [[25, -1], [35, 1]]) { const fx = hx + d * lg; p.thick(hx, 48 + by, fx, 60, 6, d < 0 ? U[2] : U[1]); p.line(hx + d * 2, 50 + by, fx + d * 2, 58, R[1]); p.rect(fx - 3, 58, 7, 11, KB[1]); p.rect(fx - 3, 58, 2, 11, KB[2]); p.px(fx - 2, 60, '#8a96b4'); p.rect(fx - 4, 68, 9, 3, KB[0]); p.rect(fx + d * 3, 69, 3, 2, KB[1]); }
    else { p.thick(24, 54, 16, 66, 6, U[2]); p.rect(12, 64, 10, 6, KB[1]); p.thick(36, 54, 44, 62, 6, U[1]); p.thick(44, 62, 46, 70, 6, KB[1]); }
    // abrigo de oficial cruzado: faldones abiertos, botones dorados, solapas con vivo rojo
    const cT = 21 + by, cB = kneel ? 60 : 56;
    for (let y = cT; y <= cB; y++) { const u = (y - cT) / (cB - cT), hw = Math.round(u < 0.55 ? 15 - u * 10 : 9.5 + (u - 0.55) * 14); for (let x = 30 - hw; x <= 30 + hw; x++) { const v = (x - 30 + hw) / (2 * hw); if (u > 0.62 && Math.abs(x - 30) < (u - 0.62) * 9) continue; p.px(x, y, v < 0.1 ? U[4] : v < 0.4 ? U[3] : v < 0.8 ? U[2] : U[1]); } }
    p.line(30, cT + 22, 30, cB, U[0]);
    for (const [a, b2] of [[[22, cT + 1], [28, cT + 14]], [[38, cT + 1], [32, cT + 14]]]) { p.thick(a[0], a[1], b2[0], b2[1], 3, U[1]); p.line(a[0] + (a[0] < 30 ? 2 : -2), a[1], b2[0], b2[1], R[1]); }
    for (let y = cT + 9; y <= cT + 23; y += 5) for (const x of [26, 34]) { p.rect(x, y, 2, 2, G4[1]); p.px(x, y, G4[3]); }
    // cuello alto con hojas de roble y cruz de mando
    p.rect(24, cT - 3, 13, 4, U[2]); p.rect(24, cT - 3, 13, 1, U[4]); p.rect(24, cT - 1, 4, 2, R[1]); p.rect(33, cT - 1, 4, 2, R[1]); p.px(25, cT - 1, G4[3]); p.px(35, cT - 1, G4[3]); p.sell(30, cT + 3, 2, 2, [G4[0], G4[2], G4[3]]); p.px(30, cT + 3, '#ffffff');
    // pasador de condecoraciones, medalla y cordón de ayudante dorado
    [['#c0283a', '#ffd166'], ['#3a5aa0', '#ffffff'], ['#ffd166', '#c0283a'], ['#2f7a34', '#ffd166']].forEach(([c1, c2], i) => { p.rect(18 + (i % 2) * 3, cT + 6 + (i >> 1) * 2, 3, 2, c1); p.px(19 + (i % 2) * 3, cT + 6 + (i >> 1) * 2, c2); });
    p.line(20, cT + 10, 20, cT + 12, R[1]); p.sell(20, cT + 14, 2, 2, [G4[1], G4[2], G4[3]]);
    for (let k = 0; k <= 10; k++) { const u = k / 10; p.px(Math.round(41 - u * 9 + Math.sin(u * Math.PI) * 2), Math.round(cT + 1 + u * 9 + Math.sin(u * Math.PI) * 4), k % 2 ? G4[2] : G4[3]); }
    // cinturón con hebilla de calavera y cartuchera
    p.rect(17, cT + 25, 27, 3, KB[1]); p.rect(17, cT + 25, 27, 1, KB[2]); p.sell(30, cT + 26, 2.5, 2.2, [B[0], B[1], B[2]]); p.px(29, cT + 26, KB[0]); p.px(31, cT + 26, KB[0]); p.rect(37, cT + 27, 5, 5, KB[1]); p.px(38, cT + 28, MT[3]);
    // charreteras doradas con flecos
    for (const ex of [15, 37]) { p.rect(ex, cT, 9, 3, G4[2]); p.rect(ex, cT, 9, 1, G4[3]); p.rect(ex + 1, cT + 1, 7, 1, U[2]); for (let x = ex; x < ex + 9; x += 2) { p.px(x, cT + 3, G4[2]); p.px(x, cT + 4, G4[1]); } }
    // brazos cibernéticos: placas metálicas, conductos de energía verde, codo luminoso y garra de tres dedos
    const sh = [[17, 24 + by], [43, 24 + by]], hands = arm === 1 ? [[12, 5 + by], [48, 5 + by]] : arm === 2 ? [[11, 46 + by], [57, 21 + by]] : [[12, 46 + by], [48, 46 + by]];
    for (let i = 0; i < 2; i++) {
      const [ax, ay] = sh[i], [hx, hy] = hands[i], d = i ? 1 : -1, ex = Math.round((ax + hx) / 2 + d * 3), ey = Math.round((ay + hy) / 2);
      p.thick(ax, ay, ex, ey, 5, MT[1]); p.line(ax - 1, ay, ex - 1, ey, MT[3]); p.line(ax + 1, ay, ex + 1, ey, G[0]);
      p.thick(ex, ey, hx, hy, 4, MT[2]); p.line(ex - 1, ey, hx - 1, hy, MT[4]); p.line(ex + 1, ey, hx + 1, hy, G[1]);
      p.ell(ex, ey, 2.5, 2.5, MT[0]); p.ell(ex, ey, 1.5, 1.5, G[1]); p.px(ex, ey, G[2]);
      const ang = Math.atan2(hy - ey, hx - ex); for (let k = -1; k <= 1; k++) { const a = ang + k * 0.55; p.line(hx, hy, Math.round(hx + Math.cos(a) * 4), Math.round(hy + Math.sin(a) * 4), MT[3]); p.px(Math.round(hx + Math.cos(a) * 4), Math.round(hy + Math.sin(a) * 4), MT[4]); }
      p.ell(hx, hy, 2, 2, MT[1]); p.px(hx, hy, G[2]);
    }
    // cabeza: calavera con pómulos, monóculo cibernético y mandíbula reforzada
    const hx0 = 30, hy0 = 13 + by;
    p.sell(hx0, hy0, 7.5, 8, [B[0], B[1], B[2], '#ffffff']); p.px(hx0 - 7, hy0 + 2, B[0]); p.px(hx0 + 7, hy0 + 2, B[0]); p.line(hx0 - 6, hy0 + 3, hx0 - 4, hy0 + 4, B[0]); p.line(hx0 + 6, hy0 + 3, hx0 + 4, hy0 + 4, B[0]);
    p.rect(hx0 - 5, hy0 - 1, 4, 4, KB[0]); p.px(hx0 - 4, hy0, eye); p.px(hx0 - 3, hy0 + 1, mut ? R[1] : G[0]);
    p.ell(hx0 + 3, hy0 + 1, 3, 3, G4[2]); p.ell(hx0 + 3, hy0 + 1, 2, 2, mut ? R[0] : G[0]); p.px(hx0 + 3, hy0 + 1, eye); p.px(hx0 + 2, hy0, mut ? R[2] : G[2]); p.line(hx0 + 6, hy0 + 1, hx0 + 8, hy0 + 4, MT[3]); p.px(hx0 + 8, hy0 + 5, G[1]);
    p.px(hx0, hy0 + 4, KB[0]); p.px(hx0 - 1, hy0 + 5, KB[0]); p.px(hx0 + 1, hy0 + 5, KB[0]);
    p.rect(hx0 - 4, hy0 + 6, 9, 3, MT[1]); p.rect(hx0 - 4, hy0 + 6, 9, 1, MT[3]); for (let x = hx0 - 3; x <= hx0 + 3; x += 2) p.rect(x, hy0 + 6, 1, 2, B[2]); p.px(hx0 - 4, hy0 + 8, G[1]);
    // gorra de plato de oficial: copa alzada, cinta oscura con vivo rojo, cordón dorado, águila y visera lustrada
    const cy0 = by;
    for (let y = cy0; y <= cy0 + 6; y++) { const hw = y < cy0 + 2 ? 9 + (y - cy0) : 11; for (let x = hx0 - hw; x <= hx0 + hw + 1; x++) p.px(x, y - (x > hx0 ? 1 : 0) * (y === cy0 ? 1 : 0), x < hx0 - hw + 2 ? U[4] : x < hx0 ? U[3] : U[2]); }
    p.line(hx0 - 9, cy0, hx0 + 9, cy0 - 1, U[4]);
    p.rect(hx0 - 10, cy0 + 6, 21, 3, KB[1]); p.rect(hx0 - 10, cy0 + 6, 21, 1, R[1]); p.line(hx0 - 9, cy0 + 8, hx0 + 10, cy0 + 8, G4[2]);
    p.px(hx0, cy0 + 2, G4[3]); p.line(hx0 - 3, cy0 + 2, hx0 - 1, cy0 + 3, G4[2]); p.line(hx0 + 1, cy0 + 3, hx0 + 3, cy0 + 2, G4[2]); p.px(hx0, cy0 + 4, G4[1]); p.sell(hx0, cy0 + 7, 1.5, 1.2, [B[1], B[2], '#ffffff']);
    p.rect(hx0 - 9, cy0 + 9, 20, 2, KB[0]); p.line(hx0 - 6, cy0 + 9, hx0 + 2, cy0 + 9, '#5e6a86'); p.px(hx0 - 4, cy0 + 9, '#ffffff');
    // mutación (fase 3): grietas de suero verde y desgarros
    if (mut) { for (const [x1, y1, x2, y2] of [[hx0 - 6, hy0 - 4, hx0 - 2, hy0 + 2], [hx0 + 4, hy0 - 6, hx0 + 6, hy0 - 1], [20, cT + 4, 24, cT + 12], [36, cT + 14, 40, cT + 20], [26, cT + 18, 28, cT + 24]]) { p.line(x1, y1, x2, y2, G[1]); p.px(x2, y2, G[2]); } for (let x = 18; x <= 42; x += 4) p.tri(x, cB, x + 3, cB, x + 1, cB - 4, KB[0]); }
  });
};
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildThersek(); }; })();
P.ARENAS = P.ARENAS || {}; P.ARENAS.thersek = P.BOSS_ARENA.slice();

// charco de ácido que dejan sus viales
P.AcidPool = class extends P.Ent {
  constructor(L, x, y) { super(L, x - 16, y - 4, 32, 4); this.life = 240; }
  update() { this.t++; const p = this.L.player; if (--this.life <= 0) this.dead = true; if (!p.dead && this.life > 20 && P.overlap(this, p) && p.onGround) p.hurt(8, this.cx, { env: true }); if (this.t % 6 === 0) this.L.parts.add({ x: this.cx + P.rand(-14, 14), y: this.y + 2, vy: -P.rand(0.3, 0.8), life: 20, col: P.pick(['#7dff5a', '#d6ffc8']), size: 1 }); }
  draw(c, cx, cy) { const x = Math.round(this.x - cx), y = Math.round(this.y - cy), a = Math.min(1, this.life / 30); c.globalAlpha = a; c.fillStyle = '#2f7a34'; c.fillRect(x, y + 1, 32, 3); c.fillStyle = '#7dff5a'; c.fillRect(x + 2, y + 1, 28, 1); for (let k = 0; k < 4; k++) if ((this.t + k * 9) % 30 < 15) c.fillRect(x + 4 + k * 7, y, 2, 1); c.globalAlpha = 1; P.drawGlow(c, x + 16, y + 2, 16, '#7dff5a', 0.25 * a); }
};

P.Thersek = class extends P.Enemy {
  constructor(L, x, floorY) {
    super(L, 340, floorY - 58, 26, 58, { kind: null, hp: 1700, dmg: 12, xp: 500, beast: false, cyber: true, spr: 'thersek', heavy: true });
    this.maxhp = this.hp = 1700; this.boss = true; this.floorY = floorY; this.face = -1; this.state = 'intro'; this.st = 0; this.phase = 1; this.cd = 60; this.active = false;
    this.name = 'THERSEK'; this.title = 'El Vicepresidente'; this.glowCol = '#7dff5a'; this.y = floorY - 58; this.tents = []; this.targets = []; this.last = ''; this.frame = 0; this.surge = null; this.sweepT = null;
    for (let i = 0; i < 4; i++) this.tents.push({ x: 0, y: 0, tx: 0, ty: 0, i });
  }
  get spd() { return [1, 1, 1.15, 1.35][this.phase]; }
  get exposed() { return this.state === 'stuck' && !this.dying; }
  anchor(i) { const sd = i % 2 ? 1 : -1; return { x: this.cx + sd * (12 + (i >> 1) * 3), y: this.y + 16 + (i >> 1) * 4 }; }
  hit(d, o = {}) {
    if (this.dead || this.dying || !this.active || this.state === 'shift' || this.state === 'roar') return;
    if (!this.exposed) { d *= 0.25; if (this.t - (this.noT || -99) > 30) { this.noT = this.t; this.L.popups.push({ x: this.cx, y: this.y - 10, text: 'BARRERA', col: '#7dff5a', t: 0 }); } this.barrierHit = 10; }
    else { d *= 1.25; o = Object.assign({}, o, { crit: true }); }
    super.hit(d, Object.assign({}, o, { knock: 0 }));
    if (!this.dying && !this.dead) { const f = this.hp / this.maxhp; if (this.phase === 1 && f < 0.66) this.toPhase(2); else if (this.phase === 2 && f < 0.33) this.toPhase(3); }
  }
  toPhase(n) { this.phase = n; this.state = 'shift'; this.st = 0; this.targets = []; this.surge = null; this.sweepT = null; P.Audio.sfx('roar'); P.shake(7, 30); this.L.fx.push({ k: 'ring', x: this.cx, y: this.cy, t: 0, life: 40, r: 150, col: '#7dff5a' });
    if (n === 2) for (let i = 0; i < 2; i++) this.tents.push({ x: 0, y: 0, tx: 0, ty: 0, i: this.tents.length });
    this.L.popups.push({ x: this.cx, y: this.y - 24, text: n === 2 ? '«INYECCIÓN DE SUERO: 300 %»' : '«¡MIRA LO QUE ME HAS OBLIGADO A HACER!»', col: '#d6ffc8', t: 0, big: true }); if (n === 3) { P.Audio.stopMusic(); P.Audio.music('thersek_3'); } }
  die() { if (this.dying) return; this.dying = true; this.hp = 0; this.state = 'death'; this.st = 0; this.isEnemy = false; this.untouchable = true; this.L.player.iframes = 400; this.targets = []; this.surge = null; this.sweepT = null; for (const e of this.L.ents) if (e.isEnemy && e !== this && !e.passive) e.die(); P.Audio.sfx('roar'); }
  pick() { const ph = this.phase, pool = ph === 1 ? ['lash', 'vials', 'lash'] : ph === 2 ? ['lash', 'vials', 'summon', 'surge', 'lash'] : ['lash', 'sweep', 'leap', 'surge', 'vials', 'leap']; let a = P.pick(pool); if (a === this.last && a !== 'lash') a = 'lash'; this.last = a; this.state = a; this.st = 0; this.vx = 0; }
  update() {
    const L = this.L, p = L.player, fy = this.floorY, ph = this.phase, spd = this.spd; this.t++; this.st++; if (this.flash > 0) this.flash--; if (this.barrierHit > 0) this.barrierHit--;
    const toward = Math.sign(p.cx - this.cx) || 1;
    switch (this.state) {
      case 'intro': break;
      case 'roar': this.face = toward; if (this.st === 30) { P.Audio.sfx('roar'); P.shake(5, 20); L.popups.push({ x: this.cx, y: this.y - 18, text: '«¡MI ESPÉCIMEN FAVORITO!»', col: '#d6ffc8', t: 0 }); } if (this.st > 90) { this.state = 'idle'; this.cd = 50; } break;
      case 'idle': this.face = toward; this.vx = toward * (Math.abs(p.cx - this.cx) > 140 ? 0.7 : Math.abs(p.cx - this.cx) < 70 ? -0.7 : 0) * spd; if (--this.cd <= 0) this.pick(); this.gravityMove(); break;
      case 'lash': { // marca puntos del suelo con anillos verdes y los golpea con los tentáculos; luego quedan clavados
        this.vx = 0; this.gravityMove(); const n = Math.min(this.tents.length, 2 + ph);
        if (this.st === 1) { this.targets = []; for (let i = 0; i < n; i++) this.targets.push({ x: P.clamp(i === 0 ? p.cx : p.cx + (i % 2 ? 1 : -1) * (30 + i * 26), L.minX + 16, L.maxX - 16), t: 0 }); P.Audio.sfx('charge'); }
        const warn = 46 / spd; this.targets.forEach(tg => tg.t++);
        if (this.st === Math.ceil(warn)) { P.Audio.sfx('bigexplode'); P.shake(6, 14); for (const tg of this.targets) { L.parts.burst(tg.x, fy - 2, 10, { col: P.pick(['#7dff5a', '#2f7a34', '#ffffff']), smin: 1, smax: 3, g: 0.15, size: 2 }); if (!p.dead && Math.abs(p.cx - tg.x) < 16 && p.y + p.h > fy - 40) p.hurt(15, tg.x); } this.state = 'stuck'; this.st = 0; if (!L.thTip) { L.thTip = true; P.toast('¡Sus tentáculos están clavados! El núcleo queda expuesto', { col: P.UIC.gold, life: 120 }); } }
        break; }
      case 'stuck': this.vx = 0; this.gravityMove(); if (this.st > [0, 80, 64, 50][ph]) { this.targets = []; this.state = 'idle'; this.cd = 40 / spd; } break;
      case 'vials': this.face = toward; this.vx = 0; this.gravityMove(); if (this.st % 16 === 0 && this.st <= 16 * (2 + ph)) { const tx = p.cx + P.rand(-50, 50), dx = tx - this.cx, tt = 50; L.add(new P.Proj(L, this.cx, this.y + 10, dx / tt, -3.2, { dmg: 8, spr: 'b_glob', grav: 0.13, life: 160, w: 7, h: 7, glow: '#7dff5a', acid: true })); P.Audio.sfx('spine'); } if (this.st > 16 * (2 + ph) + 50) { this.state = 'idle'; this.cd = 40; } break;
      case 'summon': this.vx = 0; this.gravityMove(); if (this.st === 30) { for (const sx of [L.minX + 40, L.maxX - 40]) { const e = L.add(new P.Frog(L, sx - 7, fy - 11)); e.kind = null; e.spr = 'frog'; e.hp = e.maxhp = 12; L.parts.burst(sx, fy - 20, 14, { col: '#7dff5a', smin: 1, smax: 3, glow: 3 }); } P.Audio.sfx('break'); } if (this.st > 70) { this.state = 'idle'; this.cd = 40; } break;
      case 'surge': // el suelo se electrifica por mitades (aviso amarillo, luego descarga)
        this.vx = 0; this.gravityMove(); if (this.st === 1) { this.surge = { left: p.cx < (L.minX + L.maxX) / 2, t: 0 }; P.Audio.sfx('charge'); } this.surge.t++;
        if (this.surge.t > 50 && this.surge.t < 110) { const mid = (L.minX + L.maxX) / 2, inLeft = p.cx < mid; if (!p.dead && p.onGround && inLeft === this.surge.left) p.hurt(10, p.cx, { env: true }); }
        if (this.surge.t === 50) { P.Audio.sfx('explode'); P.shake(3, 10); } if (this.surge.t > 120) { this.surge = null; this.state = 'idle'; this.cd = 30; } break;
      case 'sweep': // tentáculo que barre el suelo de lado a lado (salta)
        this.vx = 0; this.gravityMove(); if (this.st === 1) { this.sweepT = { dir: -toward, x: toward > 0 ? L.minX : L.maxX, t: 0 }; P.Audio.sfx('charge'); } const sw = this.sweepT; sw.t++;
        if (sw.t > 36) { sw.x += (sw.startDir || (sw.startDir = toward > 0 ? 1 : -1)) * 6; if (!p.dead && Math.abs(p.cx - sw.x) < 10 && p.y + p.h > fy - 14) p.hurt(13, sw.x); }
        if (sw.x < L.minX - 20 || sw.x > L.maxX + 20) { this.sweepT = null; this.state = 'stuck'; this.st = 30; } break;
      case 'leap': // salta hacia el jugador y aplasta el suelo; al caer queda expuesto un instante
        if (this.st === 1) { this.vy = -8.5; this.ltx = P.clamp(p.cx, L.minX + 30, L.maxX - 30); this.onGround = false; P.Audio.sfx('dash'); }
        if (this.st < 60 && !(this.st > 10 && this.y + this.h >= fy - 1)) { this.x += (this.ltx - this.cx) * 0.08; this.vy = Math.min(this.vy + 0.32, 9); this.y = Math.min(fy - this.h, this.y + this.vy); }
        else { this.y = fy - this.h; P.Audio.sfx('bigexplode'); P.shake(9, 20); L.fx.push({ k: 'ring', x: this.cx, y: fy, t: 0, life: 24, r: 70, col: '#7dff5a' }); if (!p.dead && Math.abs(p.cx - this.cx) < 40 && p.y + p.h > fy - 24) p.hurt(16, this.cx); this.targets = [{ x: this.cx - 30, t: 99 }, { x: this.cx + 30, t: 99 }]; this.state = 'stuck'; this.st = 20; } break;
      case 'shift': this.vx = 0; this.gravityMove(); if (this.st % 5 === 0) L.parts.add({ x: this.cx + P.rand(-14, 14), y: this.cy + P.rand(-20, 20), vy: -P.rand(0.5, 1.5), life: 30, col: P.pick(['#7dff5a', '#d6ffc8', '#ffffff']), size: 1, glow: 3 }); if (this.st > 90) { this.state = 'idle'; this.cd = 30; } break;
      case 'death': this.vx = 0; this.gravityMove(); if (this.st % 8 === 0) { P.Audio.sfx('explode'); L.parts.burst(this.cx + P.rand(-14, 14), this.cy + P.rand(-20, 10), 8, { col: P.pick(['#7dff5a', '#d6ffc8', '#ffffff', '#5e6a86']), smin: 1, smax: 3, glow: 3 }); }
        if (this.st === 150) { P.Audio.sfx('bigexplode'); P.shake(10, 30); L.fx.push({ k: 'ring', x: this.cx, y: this.cy, t: 0, life: 40, r: 140, col: '#7dff5a' }); this.dead = true; P.drop(L, this.cx, this.cy, { xp: 500, crys: 12, bio: 20 }); L.onBossDefeated(this); } break;
    }
    // tentáculos: oscilan, apuntan a sus objetivos o quedan clavados
    this.tents.forEach((tn, i) => { const a = this.anchor(i), tg = this.targets[i];
      let tx, ty; if (this.state === 'death') { tx = a.x + (i % 2 ? 20 : -20); ty = fy - 2; } else if (tg && (this.state === 'stuck' || (this.state === 'lash' && tg.t > 30))) { tx = tg.x; ty = fy - 2; } else if (tg && this.state === 'lash') { tx = a.x + (tg.x - a.x) * 0.3; ty = a.y - 40; } else if (this.sweepT && i === 0 && this.sweepT.t > 36) { tx = this.sweepT.x; ty = fy - 8; } else { tx = a.x + Math.sin(this.t * 0.04 + i * 1.7) * (30 + i * 6) + (i % 2 ? 24 : -24); ty = a.y - 20 + Math.cos(this.t * 0.05 + i) * 18; }
      tn.x += (tx - tn.x) * (this.state === 'lash' && tg && tg.t > 30 ? 0.5 : 0.12); tn.y += (ty - tn.y) * (this.state === 'lash' && tg && tg.t > 30 ? 0.5 : 0.12); });
    if (this.x < L.minX + 2) this.x = L.minX + 2; if (this.x + this.w > L.maxX - 2) this.x = L.maxX - 2 - this.w;
    if (this.active && !this.dying && !p.dead && P.overlap(this, p)) p.hurt(10, this.cx);
    this.frame = this.state === 'death' ? 7 : this.state === 'shift' ? 3 : this.phase === 3 ? 6 : this.state === 'vials' ? 4 : this.state === 'lash' || this.state === 'summon' ? 3 : Math.abs(this.vx) > 0.2 ? 2 : (this.t >> 5) % 2;
  }
  draw(c, cx, cy) {
    if (this.dead) return; const L = this.L, fy = this.floorY, t = this.t;
    // suelo electrificado
    if (this.surge) { const mid = (L.minX + L.maxX) / 2, x0 = this.surge.left ? L.minX : mid, k = this.surge.t; c.globalAlpha = k < 50 ? 0.2 + ((k >> 2) % 2) * 0.25 : 0.6; c.fillStyle = k < 50 ? '#ffd166' : '#7dff5a'; c.fillRect(Math.round(x0 - cx), Math.round(fy - 3 - cy), Math.round(mid - L.minX), 3); c.globalAlpha = 1; if (k >= 50 && k < 110) for (let i = 0; i < 6; i++) P.Energy.arc(c, x0 - cx + i * 40, fy - cy, x0 - cx + i * 40 + 30, fy - 2 - cy, t + i, '#d6ffc8', 1, 4); }
    // avisos de los golpes
    for (const tg of this.targets) if (this.state === 'lash' && tg.t < 46 / this.spd) { const k = tg.t / (46 / this.spd); c.strokeStyle = '#7dff5a'; c.globalAlpha = 0.4 + k * 0.5; c.beginPath(); c.ellipse(Math.round(tg.x - cx), Math.round(fy - 2 - cy), 16 - k * 8, 3, 0, 0, 6.3); c.stroke(); c.globalAlpha = 1; }
    if (this.sweepT && this.sweepT.t <= 36) { c.globalAlpha = 0.3 + ((t >> 2) % 2) * 0.3; c.fillStyle = '#7dff5a'; c.fillRect(0, Math.round(fy - 8 - cy), P.W, 1); c.globalAlpha = 1; }
    // tentáculos (segmentos negros con articulaciones verdes)
    for (let i = 0; i < this.tents.length; i++) { const tn = this.tents[i], a = this.anchor(i), mx = (a.x + tn.x) / 2 + (i % 2 ? 12 : -12), my = Math.min(a.y, tn.y) - 22, n = 12; let px = a.x, py = a.y;
      for (let s = 1; s <= n; s++) { const u = s / n, x = (1 - u) * (1 - u) * a.x + 2 * (1 - u) * u * mx + u * u * tn.x, y = (1 - u) * (1 - u) * a.y + 2 * (1 - u) * u * my + u * u * tn.y, w0 = 8 - u * 4.5; P.arcSeg(c, px - cx, py - cy, x - cx, y - cy, w0 + 2, w0 + 1.6, '#06080c', '#06080c', '#06080c'); P.arcSeg(c, px - cx, py - cy, x - cx, y - cy, w0, w0 - 0.4, '#2a3444', '#7a8aa4', '#141820'); if (s % 3 === 0) { c.fillStyle = this.phase === 3 ? '#ff5a6a' : '#7dff5a'; c.fillRect(Math.round(x - cx) - 1, Math.round(y - cy) - 1, 2, 2); } px = x; py = y; }
      c.fillStyle = '#d6ffc8'; c.fillRect(Math.round(tn.x - cx) - 1, Math.round(tn.y - cy) - 1, 3, 3); P.drawGlow(c, tn.x - cx, tn.y - cy, 8, '#7dff5a', 0.5); }
    // cuerpo, barrera y núcleo de inyección
    const s = P.S.thersek, x = Math.round(this.cx - s.w / 2 - cx), y = Math.round(this.y + this.h - s.h - cy), mx = x + s.w / 2;
    P.AnimFX.boss(c, this, 'thersek', this.frame, x, y, { flip: this.face < 0, flash: this.flash > 0 }, cx, cy, { dis: [80, 150], trail: ['leap'], col: '#7dff5a' });
    if (this.exposed) { const k = (Math.sin(t * 0.25) + 1) / 2; P.drawGlow(c, mx, y + 36, 24 + k * 8, '#ffd166', 0.5 + k * 0.3); c.fillStyle = k > 0.5 ? '#ffffff' : '#ffd166'; c.fillRect(mx - 1, y + 35, 3, 3); }
    else if (!this.dying && this.active) { P.Energy.shield(c, mx, y + 38, 34, t, '#7dff5a', this.barrierHit > 0 ? 1 : 0); }
    if (this.phase === 3 && !this.dying) P.drawGlow(c, mx, y + 34, 32, '#ff5a6a', 0.2 + Math.sin(t * 0.1) * 0.1);
  }
};
// los viales dejan charcos de ácido al romperse
(function () { const base = P.Proj.prototype.kill; P.Proj.prototype.kill = function (spark) { if (this.acid && !this.acidDone && !this.dead) { this.acidDone = true; const L = this.L, fy = L.boss && L.boss.floorY; if (fy && this.cy > fy - 40) L.add(new P.AcidPool(L, this.cx, fy)); L.parts.burst(this.cx, this.cy, 8, { col: P.pick(['#7dff5a', '#d6ffc8']), smin: 1, smax: 2.5, glow: 2 }); } return base.call(this, spark); }; })();
P.BOSS_CLASS = P.BOSS_CLASS || {}; P.BOSS_CLASS.thersek = P.Thersek;
