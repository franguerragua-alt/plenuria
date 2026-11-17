'use strict';
// GLORVAX — Glorborg Flotante Gigante (jefe de NÍVORAH): erizo de hielo vivo con un anillo cibernético. Tres fases.
// Según la referencia: esfera blanca como la nieve llena de agujeros oscuros, púas grises, gran boca de encías rojas
// con dientes y un cañón láser cibernético que asoma de la boca (mira a la izquierda; se voltea hacia el jugador).
// f: 0 normal · 1 boca entrecerrada · 2 aturdido (boca abierta, cañón caído, púas cortas) · 3 cargando el láser
P.Sprites.glorvaxBody = function (p, f, cr) {
  const cx = 52, cy = 46, R = 29, W = ['#7a7090', '#b8b0c8', '#e4e0ec', '#ffffff'], SP = ['#6a6080', '#a8a0b8', '#e0dce8'];
  // corona trasera de cristales de hielo (más largos y azulados, entre las púas)
  const IC = ['#2a5a90', '#5a9ad8', '#a8dcff', '#ffffff'];
  for (const [a, l, w] of [[-2.28, 25, 4], [-1.82, 30, 5], [-1.38, 27, 4], [-0.92, 24, 4], [-0.47, 21, 3], [0.42, 22, 3], [0.88, 20, 3], [1.33, 18, 3], [2.7, 18, 3]]) {
    const L = f === 2 ? R + l * 0.45 : R + l - (cr && a > 0 ? 8 : 0), bx = cx + Math.cos(a) * (R - 4), by = cy + Math.sin(a) * (R - 4), tx = cx + Math.cos(a) * L, ty = cy + Math.sin(a) * L, nx = -Math.sin(a) * w, ny = Math.cos(a) * w;
    p.tri(bx + nx, by + ny, bx - nx, by - ny, tx, ty, IC[1]); p.tri(bx + nx, by + ny, bx, by, tx, ty, IC[2]); p.line(bx, by, tx, ty, IC[3]); p.px(tx, ty, '#ffffff');
  }
  // púas cónicas alrededor (no en la zona de la boca)
  const spikes = [-2.5, -2.05, -1.6, -1.15, -0.7, -0.25, 0.2, 0.65, 1.1, 1.55, 2.95];
  spikes.forEach((a, i) => {
    const broken = cr && i % 4 === 1, L = f === 2 ? R + 7 : R + 12 + (i % 2) * 5 - (broken ? 8 : 0), w = 6;
    const bx = cx + Math.cos(a) * (R - 3), by = cy + Math.sin(a) * (R - 3), tx = cx + Math.cos(a) * L, ty = cy + Math.sin(a) * L, nx = -Math.sin(a) * w, ny = Math.cos(a) * w;
    p.tri(bx + nx, by + ny, bx - nx, by - ny, tx, ty, SP[0]); p.tri(bx + nx * 0.1, by + ny * 0.1, bx - nx, by - ny, tx, ty, SP[1]); p.line(bx - nx * 0.6, by - ny * 0.6, tx, ty, SP[2]);
  });
  // cuerpo blanco con sombreado gris y moteado
  p.sell(cx, cy, R, R, W);
  for (let i = 0; i < 40; i++) { const a = i * 2.39, r = (i * 7) % R; const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 0.95; p.px(x, y, i % 5 === 0 ? '#5aa0e0' : i % 2 ? W[1] : W[0]); }
  // luz de contorno azul (frío) abajo a la derecha y brillo arriba a la izquierda
  for (let k = 0; k < 40; k++) { const a = -0.2 + k / 40 * 1.9, x = cx + Math.cos(a) * (R - 0.5), y = cy + Math.sin(a) * (R - 0.5); p.px(x, y, '#8ad0ff'); p.px(cx + Math.cos(a) * (R - 1.5), cy + Math.sin(a) * (R - 1.5), '#c8ecff'); }
  for (let k = 0; k < 16; k++) { const a = -2.6 + k / 16 * 1.1; p.px(cx + Math.cos(a) * (R - 3), cy + Math.sin(a) * (R - 3), '#ffffff'); }
  // placa cibernética de Thersek sobre la frente: remaches, luces y una rejilla de refrigeración azul
  p.tri(cx - 12, cy - 24, cx + 16, cy - 24, cx + 2, cy - 31, '#3a3a52'); p.rect(cx - 12, cy - 24, 28, 5, '#2e2a3e'); p.rect(cx - 12, cy - 24, 28, 1, '#7a7a98');
  for (const x of [-10, -2, 6, 14]) p.px(cx + x, cy - 22, '#9a9ab8');
  p.rect(cx - 6, cy - 23, 8, 3, '#0a1a3a'); for (let x = 0; x < 8; x += 2) p.px(cx - 6 + x, cy - 22, f === 3 ? '#ffffff' : '#5af0ff');
  p.px(cx + 10, cy - 23, cr ? '#ff3050' : '#ff8a8a'); p.px(cx + 12, cy - 23, '#ffd166');
  if (cr) { p.line(cx - 12, cy - 19, cx - 8, cy - 14, '#1a1424'); p.px(cx - 9, cy - 15, '#ff5af0'); }
  // agujeros oscuros (como ojos o poros) con borde gris
  for (const [x, y0, r] of [[48, 22, 4], [62, 26, 3.5], [38, 32, 3], [68, 40, 4.5], [56, 46, 3], [44, 44, 2.5], [72, 54, 3.5], [30, 46, 2.5], [60, 60, 2.5]]) { const y = y0 + 4; p.ell(cx + x - 52, y, r + 1, r + 0.6, W[0]); p.ell(cx + x - 52, y, r, r * 0.9, '#0c0814'); p.px(cx + x - 52 - r * 0.4, y - r * 0.4, '#3a3448'); }
  // collar metálico abajo a la derecha con pinchos
  p.rect(58, 68, 22, 5, '#2e2a3a'); p.rect(58, 68, 22, 1, '#6a6880'); for (const x of [62, 70, 78]) p.tri(x - 2, 73, x + 2, 73, x, 79, '#8a8898');
  // boca: encías rojas, dientes y garganta oscura
  const op = f === 1 ? 0.55 : f === 2 ? 1.3 : 1, mx = 33, my = 59, mrx = 17, mry = 12 * op;
  p.ell(mx, my, mrx + 2, mry + 2, '#7a1a1a'); p.ell(mx, my, mrx, mry, '#c0402a'); p.ell(mx + 1, my, mrx - 3, Math.max(1, mry - 3), '#2a0606'); p.ell(mx + 2, my + 1, Math.max(1, mrx - 8), Math.max(1, mry - 6), f === 3 ? '#3ad8ff' : '#7a1010'); if (mry > 6) p.ell(mx + 2, my + 1, Math.max(1, mrx - 12), Math.max(1, mry - 9), f === 3 ? '#ffffff' : '#c02a1a');
  for (let k = 0; k < 6; k++) { const tx = mx - 12 + k * 4.8; p.tri(tx - 1.5, my - mry + 2, tx + 1.5, my - mry + 2, tx, my - mry + 6 * op, '#f4efe0'); p.tri(tx - 1.5, my + mry - 2, tx + 1.5, my + mry - 2, tx + 1, my + mry - 6 * op, '#e8e0cc'); }
  // cañón láser que sale de la boca
  const ang = f === 2 ? 0.75 : 0.32, len = 34, bx0 = mx + 6, by0 = my;
  const ex = bx0 - Math.cos(ang) * len, ey = by0 + Math.sin(ang) * len, nx = Math.sin(ang), ny = Math.cos(ang);
  for (let k = -5; k <= 5; k++) { const col = Math.abs(k) >= 4 ? '#1a1624' : k === -2 || k === -3 ? '#c0402a' : k === 2 ? '#a03020' : '#3a3648'; p.line(bx0 + nx * k, by0 + ny * k, ex + nx * k * 0.8, ey + ny * k * 0.8, col); }
  for (let t = 0.2; t < 0.9; t += 0.18) { const x = bx0 + (ex - bx0) * t, y = by0 + (ey - by0) * t; p.line(x + nx * 5, y + ny * 5, x - nx * 5, y - ny * 5, '#0e0c16'); }
  p.line(bx0 + nx * 1, by0 + ny * 1, ex + nx * 1, ey + ny * 1, f === 3 ? '#bff6ff' : '#5aa8e0'); p.line(bx0 + (ex - bx0) * 0.3, by0 + (ey - by0) * 0.3, bx0 + (ex - bx0) * 0.7, by0 + (ey - by0) * 0.7, f === 3 ? '#ffffff' : '#7ad8ff');
  p.ell(ex, ey, 4, 4, '#1a1624'); p.ell(ex, ey, 2.4, 2.4, f === 3 ? '#ffffff' : '#5af0ff');
  if (cr) { const K = '#2a2438'; p.line(cx - 4, cy - 26, cx + 6, cy - 12, K); p.line(cx + 6, cy - 12, cx + 2, cy, K); p.line(cx + 18, cy - 8, cx + 26, cy + 6, K); p.px(cx + 6, cy - 12, '#ff5af0'); }
};
// boca del cañón en coordenadas locales del sprite (sin voltear)
P.GV_MUZZLE = f => { const ang = f === 2 ? 0.75 : 0.32; return [34 + 6 - Math.cos(ang) * 34, 60 + Math.sin(ang) * 34]; };
P.Sprites.buildGlorvax = function () {
  const O = { up: 0.06, down: 0.12, dark: 0.5 };
  P.mk('gv_body', 100, 100, 4, (p, f) => P.Sprites.glorvaxBody(p, f, false), O);
  P.mk('gv_body_c', 100, 100, 4, (p, f) => P.Sprites.glorvaxBody(p, f, true), O);
  P.mk('glorvax', 100, 100, 1, p => { P.Sprites.glorvaxBody(p, 0, false); for (let k = 0; k < 6; k++) for (let y = 74; y < 90 + (k % 3) * 3; y++) p.px(46 + k * 6 + Math.sin(y * 0.3 + k) * 1.5, y, '#1a1424'); }, O);
  P.mk('gv_mini', 16, 16, 2, (p, f) => { for (let i = 0; i < 6; i++) { const a = i * 1.047 + f * 0.5; p.tri(8 + Math.cos(a) * 4 - Math.sin(a) * 1.5, 8 + Math.sin(a) * 4 + Math.cos(a) * 1.5, 8 + Math.cos(a) * 4 + Math.sin(a) * 1.5, 8 + Math.sin(a) * 4 - Math.cos(a) * 1.5, 8 + Math.cos(a) * 8, 8 + Math.sin(a) * 8, '#b8b0c8'); } p.sell(8, 8, 4.5, 4.5, ['#7a7090', '#b8b0c8', '#e4e0ec', '#ffffff']); p.ell(7, 7, 1.2, 1.2, '#0c0814'); p.ell(10, 10, 1, 1, '#0c0814'); }, { outline: '#1a1424' });
  P.mk('gv_spike', 14, 6, 1, p => { p.tri(0, 0, 0, 5, 13, 2.5, '#b8b0c8'); p.line(0, 2, 12, 2, '#ffffff'); }, { vol: false });
};


P.Glorvax = class extends P.Enemy {
  constructor(L, x, floorY) {
    super(L, 216, -120, 60, 60, { kind: 'glorvax', hp: 1000, dmg: 18, xp: 300, beast: true, spr: 'gv_body', heavy: true });
    this.maxhp = this.hp = 1000; this.boss = true; this.floorY = floorY; this.face = -1; this.state = 'intro'; this.st = 0; this.phase = 1; this.cd = 60; this.active = false;
    this.name = 'GLORVAX'; this.title = 'Glorborg Flotante Gigante'; this.gx = 240; this.gy = -90; this.vy = 0; this.marks = []; this.lastAtk = ''; this.beam = null; this.blink = 0; this.vol = 0;
    this.sync();
  }
  sync() { this.x = this.gx - 30; this.y = this.gy - 30; }
  get frame() { if (this.state === 'grounded') return 2; if (this.state === 'beam' && this.st < 60) return 3; return this.blink > 0 ? 1 : 0; }
  hit(d, o = {}) {
    if (this.dead || this.dying || !this.active || this.gy < 0) return;
    let m = 1, txt = null; if (this.state === 'grounded') { m = 2; txt = '¡BOCA EXPUESTA!'; } else if (this.state !== 'beam') m = 0.7;
    d = Math.max(1, Math.round(d * m)); this.hp -= d; this.flash = 6;
    this.L.popups.push({ x: this.gx + P.rand(-6, 6), y: this.gy - 40, text: String(d), col: m > 1 ? '#ffd166' : m < 1 ? '#a8c4e8' : '#ffffff', t: 0, big: m > 1 });
    if (txt && this.t - (this.txtT || -99) > 50) { this.txtT = this.t; this.L.popups.push({ x: this.gx, y: this.gy - 54, text: txt, col: '#ffd166', t: 0 }); }
    this.L.parts.burst(this.gx + P.rand(-20, 20), this.gy + P.rand(-20, 20), 4, { col: '#bfefff', smin: 0.5, smax: 2, lmin: 6, lmax: 14 }); P.Audio.sfx(m < 1 ? 'block' : 'ehit');
    if (o.poison) this.poisonT = 90;
    if (this.hp <= 0) return this.die();
    const f = this.hp / this.maxhp; if (this.phase === 1 && f < 0.66) this.toPhase(2); else if (this.phase === 2 && f < 0.33) this.toPhase(3);
  }
  toPhase(n) {
    this.phase = n; this.state = 'roar'; this.st = 0; this.beam = null; if (n === 3) this.spr = 'gv_body_c';
    this.L.parts.burst(this.gx, this.gy, 30, { col: '#bfefff', smin: 1, smax: 4, g: 0.1, lmin: 20, lmax: 40 });
    this.L.popups.push({ x: this.gx, y: this.gy - 60, text: n === 2 ? '¡GLORVAX SE ENFURECE!' : '¡SU CORAZA DE HIELO SE AGRIETA!', col: '#ff8ad8', t: 0, big: true });
  }
  die() {
    if (this.dying) return; this.dying = true; this.hp = 0; this.state = 'death'; this.st = 0; this.isEnemy = false; this.untouchable = true; this.beam = null;
    P.State.task('glorvax', 'defeat'); P.State.data.stats.kills++; P.Audio.sfx('roar'); this.L.player.iframes = 400;
    for (const e of this.L.ents) if (e.isEnemy && e !== this && !e.dead) e.die();
  }
  pick() {
    const ph = this.phase, opts = ph === 1 ? ['volley', 'slam', 'volley'] : ph === 2 ? ['volley', 'slam', 'hail', 'minions'] : ['volley', 'slam', 'hail', 'beam', 'beam', 'slam'];
    let a = P.pick(opts); if (a === this.lastAtk && Math.random() < 0.75) a = P.pick(opts);
    if (a === 'minions' && this.L.ents.filter(e => e.glorbito && !e.dead).length >= 3) a = 'volley';
    this.lastAtk = a; this.state = a; this.st = 0; this.step = 0;
  }
  float(tx, ty, k) { this.gx += (tx - this.gx) * k; this.gy += (ty - this.gy) * k; }
  update() {
    const L = this.L, p = L.player, fy = this.floorY, ph = this.phase, spd = ph === 3 ? 1.3 : 1, x0 = L.minX + 60, x1 = L.maxX - 60;
    this.t++; if (this.flash > 0) this.flash--; if (this.blink > 0) this.blink--; else if (Math.random() < 0.006) this.blink = 8;
    if (this.poisonT > 0) { this.poisonT--; if (this.poisonT % 30 === 0 && this.active) { this.hp -= 2; if (this.hp <= 0) this.die(); } }
    if (!this.seen && this.gy > 0) { this.seen = true; P.State.see('glorvax'); }
    this.st++;
    switch (this.state) {
      case 'intro': break;
      case 'roar': this.float(P.clamp(this.gx, x0, x1), 86, 0.05); if (this.st === 40) { P.Audio.sfx('roar'); P.shake(6, 40); } if (this.st > 90) { this.state = 'idle'; this.cd = 30; } break;
      case 'idle': this.float(P.clamp(p.cx + Math.sin(this.t * 0.02) * 70, x0, x1), 84 + Math.sin(this.t * 0.04) * 14, 0.025 * spd); if (--this.cd <= 0) this.pick(); break;
      case 'volley': {
        this.float(this.gx, 80, 0.05); const n = ph === 3 ? 12 : ph === 2 ? 10 : 8, shots = ph === 3 ? 3 : 2;
        if (this.st % 32 === 0 && this.st <= 32 * shots) { P.Audio.sfx('spine'); this.vol++; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + this.vol * 0.3; L.add(new P.Proj(L, this.gx + Math.cos(a) * 36, this.gy + Math.sin(a) * 36, Math.cos(a) * 2.4 * spd, Math.sin(a) * 2.4 * spd, { dmg: 11, spr: 'gv_spike', life: 200, rot: true, w: 8, h: 8, glow: '#a8e0ff' })); } }
        if (this.st > 32 * shots + 30) { this.state = 'idle'; this.cd = 40 / spd; }
        break;
      }
      case 'slam': {
        if (this.step === 0) { this.float(P.clamp(p.cx, x0, x1), 44, 0.08); if (this.st > 40) { this.step = 1; this.vy = 0; P.Audio.sfx('charge'); } }
        else if (this.step === 1) { this.vy = Math.min(this.vy + 0.45, 9); this.gy += this.vy;
          if (this.gy + 36 >= fy) { this.gy = fy - 36; P.Audio.sfx('bigexplode'); P.shake(9, 26); L.parts.burst(this.gx, fy - 2, 30, { col: '#e8f4ff', smin: 1, smax: 5, g: 0.2, size: 2 });
            for (const s of [-1, 1]) for (let k = 0; k < (ph === 1 ? 1 : 2); k++) L.add(new P.Proj(L, this.gx + s * 44, fy - 6, s * (2.4 + k * 1.3), 0, { dmg: 13, spr: 'b_orb', life: 140, w: 10, h: 10, glow: '#7ad8ff' }));
            this.state = 'grounded'; this.st = 0; } }
        break;
      }
      case 'grounded': this.gy = fy - 36 + Math.sin(this.st * 0.3) * 0.6; if (this.st === 1) P.toast('¡Aturdido! Dispara a su ojo', { col: P.UIC.gold, life: 90 }); if (this.st > (ph === 3 ? 80 : 110)) { this.state = 'rise'; this.st = 0; } break;
      case 'rise': this.float(this.gx, 84, 0.05); if (this.st > 40) { this.state = 'idle'; this.cd = 30; } break;
      case 'hail': this.float(240, 50, 0.05); if (this.st === 20) { P.Audio.sfx('roar'); P.shake(5, 60); } if (this.st > 20 && this.st % 12 === 0 && this.st < 120) this.marks.push({ x: P.clamp(p.cx + P.rand(-120, 120), L.minX + 24, L.maxX - 24), t: 0 }); if (this.st > 150) { this.state = 'idle'; this.cd = 40; } break;
      case 'minions':
        this.float(this.gx, 70, 0.05);
        if (this.st === 30) { P.Audio.sfx('roar'); for (const s of [-1, 1]) { const e = L.add(new P.Fly(L, this.gx + s * 50 - 8, this.gy - 10, true)); e.spr = 'gv_mini'; e.kind = null; e.glorbito = true; e.hp = e.maxhp = 12; L.parts.burst(e.cx, e.cy, 10, { col: '#bfefff', smin: 1, smax: 3 }); } }
        if (this.st > 60) { this.state = 'idle'; this.cd = 40; }
        break;
      case 'beam': {
        // se coloca en un lado y barre el suelo con un rayo desde el ojo: salta cuando pase bajo tus pies
        if (this.st === 1) { this.side = p.cx < 240 ? 1 : -1; P.Audio.sfx('charge'); }
        const hx = this.side > 0 ? L.maxX - 70 : L.minX + 70; this.float(hx, 70, 0.08);
        if (this.st < 60) this.beam = { tele: true, a: this.st / 60, px: hx - this.side * 50 };
        else if (this.st < 150) { if (this.st === 60) { P.Audio.sfx('laser'); P.shake(4, 80); } const k = (this.st - 60) / 90, px = hx - this.side * (50 + k * (L.maxX - L.minX - 160)); this.beam = { tele: false, px };
          const [ex, ey] = this.muzzle(); for (let i = 0; i <= 40; i++) { const t = i / 40, bx = ex + (px - ex) * t, by = ey + (fy - ey) * t; if (!p.dead && bx > p.x - 2 && bx < p.x + p.w + 2 && by > p.y && by < p.y + p.h) { p.hurt(16, ex); break; } }
          if (this.t % 2 === 0) L.parts.add({ x: px, y: fy - 2, vy: -P.rand(1, 3), vx: P.rand(-1, 1), life: 18, col: P.pick(['#3ad8ff', '#bff6ff', '#ffffff']), size: 2, glow: 3 }); }
        else { this.beam = null; this.state = 'idle'; this.cd = 40; }
        break;
      }
      case 'death':
        this.float(this.gx, Math.min(fy - 36, this.gy + 1.2), 1); if (this.st % 6 === 0) { P.Audio.sfx('explode'); L.parts.burst(this.gx + P.rand(-36, 36), this.gy + P.rand(-36, 36), 10, { col: P.pick(['#bfefff', '#ffffff', '#ff5af0', '#5ef0ff']), smin: 1, smax: 4, lmin: 20, lmax: 40, glow: 4 }); }
        if (this.st === 150) { P.Audio.sfx('bigexplode'); P.shake(12, 40); for (let i = 0; i < 60; i++) { const a = Math.random() * 7; L.parts.add({ x: this.gx, y: this.gy, vx: Math.cos(a) * P.rand(1, 6), vy: Math.sin(a) * P.rand(1, 6) - 1, g: 0.15, life: P.ri(30, 70), col: P.pick(['#bfefff', '#ffffff', '#7ad8ff']), size: 3, shrink: true }); } this.dead = true; P.drop(L, this.gx, this.gy, { xp: 300, crys: 6, bio: 10 }); L.onBossDefeated(this); }
        break;
    }
    // granizo: carámbanos con aviso
    for (const m of this.marks) { m.t++; if (m.t === 36) L.add(new P.Proj(L, m.x, L.cam.y - 14, 0, 2.5, { dmg: 12, spr: 'icicle', grav: 0.25, life: 200, w: 8, h: 14 })); }
    this.marks = this.marks.filter(m => m.t < 50);
    this.sync();
    if (this.active && !this.dying && this.state !== 'grounded' && !p.dead && Math.hypot(p.cx - this.gx, p.cy - this.gy) < 34) p.hurt(this.dmg, this.gx);
  }
  get faceR() { if (this.state !== 'beam' || this._fr == null) this._fr = this.L.player.cx > this.gx; return this._fr; }
  muzzle() { const [mx, my] = P.GV_MUZZLE(this.frame); return [this.gx + (this.faceR ? 52 - mx : mx - 52), this.gy + my - 46]; }
  draw(c, cx, cy) {
    const L = this.L, fy = this.floorY, s = P.S[this.spr];
    for (const m of this.marks) { c.globalAlpha = 0.4 + Math.sin(m.t * 0.5) * 0.3; c.fillStyle = '#5ef0ff'; c.fillRect(m.x - cx - 6, fy - cy - 2, 12, 2); c.globalAlpha = 1; }
    if (this.gy < -60) return;
    // sombra en el suelo según la altura
    const hgt = P.clamp((fy - this.gy) / 200, 0, 1); c.fillStyle = 'rgba(10,20,50,' + (0.35 - hgt * 0.2) + ')'; c.beginPath(); c.ellipse(this.gx - cx, fy - cy, 36 - hgt * 14, 5 - hgt * 2, 0, 0, 7); c.fill();
    const dA = this.state === 'death' ? Math.max(0, 1 - (this.st - 110) / 40) : 1, sh = this.state === 'death' ? P.rand(-2, 2) : 0;
    const X = Math.round(this.gx - (this.faceR ? 48 : 52) - cx + sh), Y = Math.round(this.gy - 46 - cy + Math.sin(this.t * 0.06) * 1.5);
    // tentáculos oscuros que gotean bajo el cuerpo
    if (dA > 0.2) for (let k = 0; k < 7; k++) { const x0 = this.gx - 18 + k * 6, y0 = this.gy + 22, L2 = 18 + ((k * 7) % 4) * 7; let px2 = x0, py2 = y0; c.fillStyle = '#1a1424'; for (let j = 0; j < L2; j++) { px2 = x0 + Math.sin(this.t * 0.06 + k + j * 0.15) * (j / L2) * 4; py2 = y0 + j; c.fillRect(Math.round(px2 - cx), Math.round(py2 - cy), j < 6 ? 2 : 1, 1); } c.fillStyle = '#d8d4e0'; c.fillRect(Math.round(px2 - cx) - 1, Math.round(py2 - cy), 3, 3); if ((this.t + k * 37) % 120 === 0) L.parts.add({ x: px2, y: py2 + 3, vy: 1, g: 0.2, life: 60, col: '#d8d4e0', size: 2 }); }
    P.drawGlow(c, this.gx - cx, this.gy - cy, 50, this.phase === 3 ? '#ff8af0' : '#7ad8ff', 0.25);
    if (dA > 0.3) {
      const k = (Math.sin(this.t * 0.07) + 1) / 2; c.strokeStyle = 'rgba(160,220,255,' + (0.12 + k * 0.15) + ')'; c.beginPath(); c.arc(this.gx - cx, this.gy - cy, 46 + k * 6, 0, 7); c.stroke();
      if (this.t % 4 === 0) { const a = Math.random() * 7, r = P.rand(34, 60); L.parts.add({ x: this.gx + Math.cos(a) * r, y: this.gy + Math.sin(a) * r, vx: -Math.cos(a) * 0.3, vy: -Math.sin(a) * 0.3 + 0.2, life: 40, col: P.pick(['#ffffff', '#bfefff', '#7ad8ff']), size: 1, glow: 3 }); }
      if (this.t % 6 === 0 && this.state !== 'death') { const [mx, my] = this.muzzle(), dir = this.faceR ? 1 : -1; L.parts.add({ x: mx - dir * 6, y: my - 6, vx: dir * P.rand(0.2, 0.7), vy: -P.rand(0.1, 0.4), life: 50, col: 'rgba(220,245,255,0.7)', size: 3, fade: true }); }
    }
    // fragmentos de hielo en órbita
    for (let i = 0; i < 4; i++) { const a = this.t * 0.03 + i * 1.57, ox = Math.cos(a) * 52, oy = Math.sin(a) * 18; if (oy < 0) { c.fillStyle = '#bfefff'; c.fillRect(Math.round(this.gx + ox - cx) - 1, Math.round(this.gy + oy - cy) - 2, 3, 4); } }
    P.spr(c, this.spr, this.frame, X, Y, { flip: this.faceR, flash: this.flash > 0 || (this.state === 'death' && this.st % 8 < 3), alpha: dA < 1 ? dA : null });
    // destello azul en la boca del cañón
    if (dA > 0.3) { const [mx, my] = this.muzzle(); P.drawGlow(c, mx - cx, my - cy + Math.sin(this.t * 0.06) * 1.5, this.frame === 3 ? 14 : 7, '#5af0ff', 0.8); }
    for (let i = 0; i < 4; i++) { const a = this.t * 0.03 + i * 1.57, ox = Math.cos(a) * 52, oy = Math.sin(a) * 18; if (oy >= 0) { c.fillStyle = '#ffffff'; c.fillRect(Math.round(this.gx + ox - cx) - 1, Math.round(this.gy + oy - cy) - 2, 3, 4); } }
    if (this.state === 'grounded' && this.t % 20 < 10) P.txt(c, '▼', this.gx - cx - 2, this.gy - 50 - cy, '#ffd166');
    if (this.beam) {
      const [mx0, my0] = this.muzzle(), ex = mx0 - cx, ey = my0 - cy, px = this.beam.px - cx, py = fy - cy;
      if (this.beam.tele) { c.globalAlpha = 0.2 + this.beam.a * 0.5; c.strokeStyle = '#5af0ff'; c.beginPath(); c.moveTo(ex, ey); c.lineTo(px, py); c.stroke(); c.globalAlpha = 1; P.drawGlow(c, ex, ey, 6 + this.beam.a * 14, '#5af0ff', 0.9); }
      else { for (const [w, col] of [[9, '#1a6ab0'], [5, '#3ad8ff'], [2, '#ffffff']]) { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(ex, ey); c.lineTo(px, py); c.stroke(); } c.lineWidth = 1; P.drawGlow(c, ex, ey, 16, '#5af0ff', 0.9); P.drawGlow(c, px, py, 14, '#bff6ff', 0.8); }
    }
  }
};
P.BOSS_CLASS = P.BOSS_CLASS || {}; P.BOSS_CLASS.glorvax = P.Glorvax;
