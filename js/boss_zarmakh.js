'use strict';
// ZARMAKH — Gusano Gigante Cibernético (jefe de KHAZIR). Cuerpo segmentado que nada bajo la arena. Tres fases.
const ZK_FL = ['#5a2a24', '#a85a44', '#e09068', '#ffd0a8'], ZK_MT = ['#1a1c2a', '#2e3346', '#4e5872', '#8a98bc'], ZK_CORE = ['#0a6a6a', '#2fe0c0', '#c0fff4', '#ffffff'];
// cabeza mirando a la derecha · f: 0 cerrada · 1 entreabierta · 2 abierta · 3 aturdida (núcleo expuesto)
P.Sprites.zkHead = function (p, f, cr) {
  const o = [0, 0.5, 1, 0.55][f], FL = ZK_FL, MT = ZK_MT;
  // cuerpo carnoso con anillos
  p.sell(22, 28, 21, 21, FL);
  for (let k = 0; k < 4; k++) { const x = 5 + k * 6; for (let y = 8; y < 49; y++) { const dx = (x - 22) / 21, dy = (y - 28) / 21; if (dx * dx + dy * dy < 0.9) p.px(x, y, FL[0]); } }
  p.ell(20, 44, 14, 3, FL[2]);
  // boca: interior, anillos de dientes y garganta brillante
  const up = 28 - 5 - o * 12, dn = 28 + 5 + o * 12;
  if (o > 0.2) {
    p.ell(45, 28, 8, 5 + o * 10, '#2a060c'); p.ell(46, 28, 5, 3 + o * 7, '#a8201a'); p.ell(47, 28, 3, 1.5 + o * 4, '#ff8a2a'); p.ell(47, 28, 1.4, 1 + o * 2, '#fff0a0');
    for (let r = 0; r < 2; r++) for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; p.px(45 + Math.cos(a) * (6 - r * 2.5), 28 + Math.sin(a) * (5 + o * 9 - r * 3.5), r ? '#ffe8c8' : '#ffffff'); }
  }
  // mandíbula superior e inferior (placas cibernéticas con dientes)
  p.tri(38, 8, 38, 27, 59, up, MT[2]); p.tri(38, 8, 44, 12, 59, up, MT[3]); p.line(38, 27, 59, up, MT[0]);
  for (let k = 1; k < 6; k++) { const x = 38 + k * 3.5, y = 27 + (up - 27) * k / 6; p.px(x, y + 1, '#fff4d8'); p.px(x, y + 2, '#d8c8a8'); }
  p.tri(38, 29, 38, 48, 59, dn, MT[1]); p.tri(38, 44, 38, 48, 59, dn, MT[0]); p.line(38, 29, 59, dn, MT[2]);
  for (let k = 1; k < 6; k++) { const x = 38 + k * 3.5, y = 29 + (dn - 29) * k / 6; p.px(x, y - 1, '#fff4d8'); p.px(x, y - 2, '#d8c8a8'); }
  // collar metálico con remaches
  p.rect(33, 6, 6, 44, MT[1]); p.rect(33, 6, 2, 44, MT[3]); p.rect(38, 6, 1, 44, MT[0]);
  for (let y = 10; y < 48; y += 7) p.px(36, y, '#ffd166');
  // casco dorsal con crestas
  if (f === 3) { p.rect(12, 1, 18, 3, MT[3]); p.rect(12, 4, 18, 1, MT[0]); p.sell(24, 13, 7, 6, ZK_CORE); p.px(22, 10, '#ffffff'); for (let i = 0; i < 5; i++) p.px(17 + i * 3, 7 + (i % 2), '#ffd166'); }
  else { p.sell(25, 12, 17, 8, MT); for (let k = 0; k < 3; k++) p.tri(13 + k * 8, 7, 19 + k * 8, 7, 15 + k * 8, 0, MT[2]); for (let x = 12; x < 38; x += 5) p.px(x, 15, MT[0]); }
  // visor con tres ojos rojos
  p.rect(26, 15, 13, 5, '#2a0a14'); for (let i = 0; i < 3; i++) { p.px(28 + i * 4, 16, f === 3 ? '#5a2030' : '#ff2040'); p.px(29 + i * 4, 16, f === 3 ? '#3a1020' : '#ff9a9a'); p.px(28 + i * 4, 17, f === 3 ? '#3a1020' : '#c01030'); }
  p.rect(26, 20, 13, 1, '#ffd166');
  if (cr) {
    const K = '#2a0606'; p.line(8, 18, 16, 26, K); p.line(16, 26, 13, 35, K); p.line(16, 26, 24, 30, K); p.line(26, 34, 31, 40, K);
    p.line(44, 12, 50, 18, '#ff8a3a'); p.px(14, 22, '#ffb030'); p.px(30, 38, '#ffb030'); p.px(46, 40, '#5ae8ff'); p.px(20, 6, '#ff2040');
  }
};
P.Sprites.zkSeg = function (p, f, cr) {
  const FL = ZK_FL, MT = ZK_MT;
  p.sell(17, 18, 15, 15, FL);
  for (const x of [6, 10, 25, 29]) for (let y = 4; y < 33; y++) { const dx = (x - 17) / 15, dy = (y - 18) / 15; if (dx * dx + dy * dy < 0.85) p.px(x, y, FL[0]); }
  p.ell(17, 30, 10, 2.5, FL[2]);
  p.rect(14, 3, 7, 30, MT[1]); p.rect(14, 3, 2, 30, MT[3]); p.rect(20, 3, 1, 30, MT[0]);
  p.sell(17, 7, 12, 5, MT); p.tri(13, 4, 21, 4, 16, 0, MT[2]); p.px(16, 1, MT[3]);
  p.px(17, 18, f ? '#ff3050' : '#7a1a2a'); p.px(17, 24, f ? '#5ae8ff' : '#1a4a5a'); p.px(17, 12, '#ffd166');
  if (cr) { p.line(6, 14, 11, 20, '#2a0606'); p.line(23, 22, 28, 27, '#2a0606'); p.px(9, 17, '#ffb030'); }
};
P.Sprites.zkTail = function (p) {
  const MT = ZK_MT;
  p.sell(26, 15, 7, 11, ZK_FL);
  p.tri(0, 15, 22, 4, 22, 26, MT[2]); p.tri(0, 15, 22, 4, 22, 13, MT[3]);
  for (let k = 0; k < 4; k++) { const x = 5 + k * 4.5; p.line(x, 15 - (x * 0.5), x + 3, 15 + (x * 0.5), MT[0]); }
  p.rect(20, 3, 3, 24, MT[1]); p.px(21, 8, '#ff3050'); p.px(1, 15, '#ffffff');
};
P.Sprites.buildZarmakh = function () {
  const shift = (p, ox, oy) => { const q = Object.create(p); q.px = (x, y, c) => P.Painter.prototype.px.call(p, x + ox, y + oy, c); return q; };
  const O = { up: 0.08, down: 0.14, dark: 0.55 };
  P.mk('zk_head', 60, 52, 4, (p, f) => P.Sprites.zkHead(p, f, false), O);
  P.mk('zk_head_c', 60, 52, 4, (p, f) => P.Sprites.zkHead(p, f, true), O);
  P.mk('zk_seg', 34, 34, 2, (p, f) => P.Sprites.zkSeg(p, f, false), O);
  P.mk('zk_seg_c', 34, 34, 2, (p, f) => P.Sprites.zkSeg(p, f, true), O);
  P.mk('zk_tail', 34, 30, 1, p => P.Sprites.zkTail(p), O);
  P.mk('zk_rock', 14, 14, 2, (p, f) => { p.sell(7, 7, 6, 5.5 - f * 0.5, ['#5a3420', '#9a6a3a', '#d8a868', '#fff0c8']); p.px(5, 8, '#5a3420'); p.px(9, 5, '#5a3420'); });
  // retrato del Archivo: el gusano emergiendo de la duna
  P.mk('zarmakh', 128, 96, 1, p => {
    p.ell(46, 88, 44, 7, '#b8742e'); p.ell(46, 86, 38, 4, '#e8a440'); p.ell(30, 84, 9, 3, '#ffcc6a');
    const pts = []; for (let i = 0; i <= 9; i++) { const t = i / 9; pts.push([24 + t * 56 + Math.sin(t * 3.4) * 10, 86 - t * 52 - Math.sin(t * 3.1) * 8]); }
    P.Sprites.zkTail(shift(p, 2, 72));
    for (let i = 0; i < pts.length; i++) { const [x, y] = pts[i]; P.Sprites.zkSeg(shift(p, Math.round(x - 17), Math.round(y - 18)), i % 2, false); }
    P.Sprites.zkHead(shift(p, 66, 8), 2, false);
  }, O);
};

// segmento del cuerpo: recibe disparos y transmite el daño (reducido) a la cabeza
P.ZarmakhSeg = class extends P.Ent {
  constructor(L, boss, i) { super(L, boss.hx - 12, boss.hy - 12, 24, 24); this.boss = boss; this.i = i; this.isEnemy = true; this.beast = true; this.heavy = true; this.untouchable = true; this.k = 1 - i * 0.032; }
  hit(d, o = {}) { this.boss.hitSeg(this, d, o); }
  die() { }
  update() { }
  draw() { }
};

P.Zarmakh = class extends P.Enemy {
  constructor(L, x, floorY) {
    super(L, 220, floorY + 60, 36, 32, { kind: 'zarmakh', hp: 1000, dmg: 20, xp: 300, beast: true, spr: 'zk_head', heavy: true });
    this.maxhp = this.hp = 1000;
    this.boss = true; this.floorY = floorY; this.face = -1; this.state = 'intro'; this.st = 0; this.phase = 1; this.cd = 70; this.active = false;
    this.name = 'ZARMAKH'; this.title = 'Gusano Gigante Cibernético'; this.lastAtk = '';
    this.hx = 240; this.hy = floorY + 70; this.hvx = 0; this.hvy = 0; this.ang = -Math.PI / 2; this.mouth = 0; this.stuck = 0;
    this.N = 11; this.GAP = 7; this.trail = [];
    for (let i = 0; i < this.N * this.GAP + 20; i++) this.trail.push({ x: this.hx, y: this.hy + i * 2 });
    this.segs = []; for (let i = 0; i < this.N; i++) this.segs.push(L.add(new P.ZarmakhSeg(L, this, i)));
    this.tremor = null; this.beam = null; this.marks = []; this.holes = [];
    this.sync();
  }
  get visible() { return this.hy < this.floorY + 4; }
  sync() {
    this.x = this.hx - this.w / 2; this.y = this.hy - this.h / 2;
    for (const s of this.segs) {
      const q = this.trail[Math.min(this.trail.length - 1, (s.i + 1) * this.GAP)], r = 24 * s.k;
      s.w = s.h = r; s.x = q.x - r / 2; s.y = q.y - r / 2; s.ax = q.x; s.ay = q.y;
      s.untouchable = this.dying || s.gone || q.y > this.floorY + 2;
    }
  }
  record() {
    // puntos cada 2 px a lo largo del recorrido de la cabeza (aunque avance varios px por fotograma)
    let t = this.trail[0], d = Math.hypot(this.hx - t.x, this.hy - t.y);
    if (d > 120) { this.trail.unshift({ x: this.hx, y: this.hy }); d = 0; }
    while (d >= 2) { t = this.trail[0]; const k = 2 / d; this.trail.unshift({ x: t.x + (this.hx - t.x) * k, y: t.y + (this.hy - t.y) * k }); d -= 2; }
    while (this.trail.length > this.N * this.GAP + 20) this.trail.pop();
  }
  allUnder() { for (let i = 0; i <= this.N; i++) if (this.trail[Math.min(this.trail.length - 1, i * this.GAP)].y < this.floorY + 16) return false; return true; }
  // dirige la cabeza hacia un punto con giro limitado (movimiento serpenteante)
  steer(tx, ty, spd, turn) {
    const want = Math.atan2(ty - this.hy, tx - this.hx); let da = want - this.ang;
    while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
    this.ang += P.clamp(da, -turn, turn); this.hvx = Math.cos(this.ang) * spd; this.hvy = Math.sin(this.ang) * spd;
    this.hx += this.hvx; this.hy += this.hvy;
    return Math.hypot(tx - this.hx, ty - this.hy);
  }
  aimAt(tx, ty, turn) { const want = Math.atan2(ty - this.hy, tx - this.hx); let da = want - this.ang; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI; this.ang += P.clamp(da, -turn, turn); }
  get mouthPos() { return { x: this.hx + Math.cos(this.ang) * 24, y: this.hy + Math.sin(this.ang) * 24 }; }
  hit(d, o = {}) {
    if (this.dead || this.dying || !this.active || !this.visible) return;
    let m = 1, txt = null;
    if (this.stuck > 0) { m = 2.5; txt = '¡NÚCLEO EXPUESTO!'; } else if (this.mouth > 0.6) { m = 1.3; txt = '¡EN LA BOCA!'; }
    this.applyDmg(d * m, o, this.hx, this.hy - 20, txt);
  }
  hitSeg(s, d, o) { if (this.dead || this.dying || !this.active || s.untouchable) return; this.applyDmg(d * (this.stuck > 0 ? 0.6 : 0.25), o, s.ax, s.ay - 10, null, true); s.flash = 5; }
  applyDmg(d, o, x, y, txt, armor) {
    d = Math.max(1, Math.round(d)); this.hp -= d; this.flash = armor ? 2 : 6;
    this.L.popups.push({ x: x + P.rand(-4, 4), y, text: String(d), col: armor ? '#a8b4c8' : o.crit ? '#ffd166' : o.super ? '#ff8a3a' : '#ffffff', t: 0, big: o.crit });
    if (txt && (this.t - (this.txtT || -99)) > 50) { this.txtT = this.t; this.L.popups.push({ x, y: y - 12, text: txt, col: '#ffd166', t: 0 }); }
    this.L.parts.burst(x, y + 10, armor ? 3 : 5, { col: armor ? '#c8d4e8' : '#ff9a6a', smin: 0.5, smax: 2, lmin: 6, lmax: 14 });
    P.Audio.sfx(armor ? 'block' : 'ehit');
    if (o.poison) this.poisonT = 90;
    if (this.hp <= 0) return this.die();
    const f = this.hp / this.maxhp;
    if (this.phase === 1 && f < 0.66) this.toPhase(2); else if (this.phase === 2 && f < 0.33) this.toPhase(3);
  }
  toPhase(n) {
    this.phase = n; this.stuck = 0; this.beam = null; this.tremor = null; this.state = 'roar'; this.st = 0;
    if (n === 3) { this.L.parts.burst(this.hx, this.hy, 30, { col: '#ffb030', smin: 1, smax: 4, g: 0.1, lmin: 20, lmax: 40 }); }
    this.L.popups.push({ x: this.hx, y: this.hy - 50, text: n === 2 ? '¡ZARMAKH SE ENFURECE!' : '¡SU BLINDAJE SE AGRIETA!', col: '#ff8ad8', t: 0, big: true });
  }
  die() {
    if (this.dying) return;
    this.dying = true; this.hp = 0; this.state = 'death'; this.st = 0; this.isEnemy = false; this.untouchable = true; this.stuck = 0; this.beam = null; this.tremor = null;
    P.State.task('zarmakh', 'defeat'); P.State.data.stats.kills++;
    P.Audio.sfx('roar'); this.L.player.iframes = 400;
    for (const e of this.L.ents) if (e.isEnemy && !(e instanceof P.ZarmakhSeg) && e !== this && !e.dead) e.die();
  }
  pick() {
    const ph = this.phase, opts = ph === 1 ? ['dive', 'dive', 'spit'] : ph === 2 ? ['dive', 'spit', 'charge', 'laser'] : ['dive', 'charge', 'laser', 'quake', 'charge'];
    let a = P.pick(opts); if (a === this.lastAtk && Math.random() < 0.75) a = P.pick(opts);
    this.lastAtk = a; this.state = a; this.st = 0; this.step = 0; this.reps = ph === 3 && a === 'dive' ? 2 : 1;
  }
  sand(x, n, s = 3) { this.L.parts.burst(x, this.floorY - 2, n, { col: P.pick(['#e8a440', '#ffcc6a', '#c07a2a']), smin: 1, smax: s, g: 0.2, size: 2, up: 1 }); }
  update() {
    const L = this.L, p = L.player; this.t++; if (this.flash > 0) this.flash--;
    for (const s of this.segs) if (s.flash > 0) s.flash--;
    if (this.poisonT > 0) { this.poisonT--; if (this.poisonT % 30 === 0 && this.active && this.visible) this.applyDmg(2, {}, this.hx, this.hy - 20, null); }
    if (!this.seen && this.visible && this.onScreen()) { this.seen = true; P.State.see('zarmakh'); }
    const wasVis = this.visible;
    this.st++;
    const fy = this.floorY, ph = this.phase, spd = ph === 3 ? 1.25 : 1, x0 = L.minX + 40, x1 = L.maxX - 40;
    this.mouth = P.approach(this.mouth, 0, 0.05);
    switch (this.state) {
      case 'intro': break;
      case 'roar': {
        // emerge en el centro (o donde esté), ruge y vuelve a sumergirse
        const tx = P.clamp(this.hx, x0 + 40, x1 - 40);
        if (this.st < 200 && this.hy > fy - 96) { this.steer(tx, fy - 110, 3.2, 0.12); this.rt = 0; }
        else { this.rt = (this.rt || 0) + 1; this.aimAt(p.cx, p.cy, 0.05); this.mouth = 1; if (this.rt === 1) { P.Audio.sfx('roar'); P.shake(6, 50); } if (this.rt % 8 === 0) this.sand(this.hx + P.rand(-60, 60), 4); if (this.rt > 70) { this.state = 'submerge'; this.st = 0; } }
        break;
      }
      case 'submerge':
        this.steer(this.hx + Math.cos(this.ang) * 10, fy + 80, 2.6 * spd, 0.09);
        if (this.hy > fy + 50) { this.state = 'idle'; this.st = 0; this.cd = (ph === 3 ? 30 : 50); }
        break;
      case 'idle': {
        // nada bajo la arena siguiendo al jugador hasta que todo el cuerpo está enterrado
        const tx = P.clamp(p.cx + Math.sin(this.t * 0.03) * 60, x0, x1);
        this.steer(tx, fy + 70 + Math.sin(this.t * 0.07) * 10, 2.4, 0.06);
        if (this.hy < fy + 40) this.hy = fy + 40;
        if (this.t % 9 === 0) L.parts.add({ x: this.hx + P.rand(-6, 6), y: fy - 1, vy: -P.rand(0.5, 1.5), life: 18, col: '#d8a058', size: 2 });
        if (--this.cd <= 0 && this.allUnder()) this.pick();
        break;
      }
      case 'dive': {
        const tele = ph === 3 ? 34 : ph === 2 ? 44 : 54;
        if (this.step === 0) {
          // antes de avisar, el cuerpo entero debe estar bajo la arena
          if (!this.allUnder()) { this.steer(P.clamp(p.cx, x0, x1), fy + 70, 2.6, 0.08); this.st = 0; break; }
          // temblor de aviso bajo el jugador
          if (this.st === 1) { this.tx = P.clamp(p.cx, x0, x1); P.Audio.sfx('step'); }
          if (this.st < tele * 0.6) this.tx = P.approach(this.tx, P.clamp(p.cx, x0, x1), 2.2);
          this.hx = P.approach(this.hx, this.tx, 6); this.hy = fy + 50; this.ang = -Math.PI / 2;
          this.tremor = { x: this.tx, a: this.st / tele };
          if (this.st % 4 === 0) { this.sand(this.tx + P.rand(-14, 14), 2, 2); P.shake(1.5, 4); }
          if (this.st >= tele) {
            this.tremor = null; this.step = 1; this.st = 0; this.hx = this.tx; this.hy = fy + 26;
            const dir = p.cx > this.hx + 10 ? 1 : p.cx < this.hx - 10 ? -1 : (this.hx < 240 ? 1 : -1);
            this.hvx = dir * (ph === 3 ? 2.6 : 2.1); this.hvy = -8.6; this.mouth = 1;
            P.Audio.sfx('explode'); P.shake(6, 18); this.sand(this.hx, 26, 5); this.holes.push({ x: this.hx, t: 0 });
          }
        } else {
          this.hvy += 0.2; this.hx += this.hvx; this.hy += this.hvy; this.ang = Math.atan2(this.hvy, this.hvx); this.mouth = this.hvy < 0 ? 1 : 0.4;
          if (this.hx < x0 - 20 || this.hx > x1 + 20) this.hvx *= -0.4;
          // en la cima escupe arena (fase 2+)
          if (ph >= 2 && Math.abs(this.hvy) < 0.2 && !this.spat) { this.spat = true; this.spitVolley(3, 3.2); }
          if (this.hvy > 0 && this.hy > fy + 60) {
            this.spat = false;
            if (--this.reps > 0) { this.step = 0; this.st = 0; } else { this.state = 'idle'; this.st = 0; this.cd = 40 / spd; }
          }
        }
        break;
      }
      case 'spit': {
        if (this.step === 0) { if (this.st === 1) this.sx = P.clamp(p.cx + (p.cx < 240 ? 120 : -120), x0, x1); this.steer(this.sx, fy + 60, 3, 0.1); if (this.st > 20 && Math.abs(this.hx - this.sx) < 12) { this.step = 1; this.st = 0; this.sand(this.sx, 16, 4); P.Audio.sfx('explode'); } }
        else if (this.step === 1) { this.steer(this.sx, fy - 74, 3.4, 0.14); if (this.hy < fy - 66 || this.st > 70) { this.step = 2; this.st = 0; } }
        else {
          this.aimAt(p.cx, p.cy - 30, 0.06); this.hy += Math.sin(this.st * 0.1) * 0.4;
          const n = ph === 3 ? 4 : 3;
          if (this.st === 20 || this.st === 46 || this.st === 72) { this.spitVolley(n, 3); }
          if (this.st > 15 && this.st < 80) this.mouth = 1;
          if (this.st > 92) { this.state = 'submerge'; this.st = 0; }
        }
        break;
      }
      case 'charge': {
        // carga por la superficie hasta chocar contra la pared: queda aturdido
        if (this.step === 0) {
          if (this.st === 1) { this.cdir = p.cx < 240 ? -1 : 1; this.sx = this.cdir > 0 ? x0 - 6 : x1 + 6; this.hx = this.sx; this.hy = fy + 50; this.ang = -Math.PI / 2; }
          this.tremor = { x: this.sx, a: Math.min(1, this.st / 40) }; if (this.st % 5 === 0) this.sand(this.sx + P.rand(-12, 12), 2, 2);
          if (this.st > 40) { this.tremor = null; this.step = 1; this.st = 0; P.Audio.sfx('explode'); this.sand(this.sx, 20, 4); this.holes.push({ x: this.sx, t: 0 }); }
        } else if (this.step === 1) {
          this.steer(this.sx + this.cdir * 30, fy - 20, 3, 0.12);
          if (this.hy < fy - 14) { this.step = 2; this.st = 0; this.ang = this.cdir > 0 ? 0 : Math.PI; P.Audio.sfx('roar'); P.toast('¡ZARMAKH carga! Sube a las cornisas', { col: P.UIC.red, life: 110 }); }
        } else if (this.step === 2) {
          // ruge antes de lanzarse (aviso)
          this.mouth = 1; this.hy = fy - 18 + Math.sin(this.st * 0.5) * 1.5; if (this.st % 6 === 0) P.shake(2, 5);
          if (this.st > 30) { this.step = 3; this.st = 0; }
        } else if (this.step === 3) {
          const v = (ph === 3 ? 3.9 : 3.2); this.hx += this.cdir * v; this.hy = fy - 18 + Math.sin(this.st * 0.35) * 2; this.ang = this.cdir > 0 ? 0 : Math.PI; this.mouth = 0.6;
          if (this.st % 3 === 0) this.sand(this.hx - this.cdir * 20, 2, 3);
          if ((this.cdir > 0 && this.hx > L.maxX - 44) || (this.cdir < 0 && this.hx < L.minX + 44)) {
            P.Audio.sfx('bigexplode'); P.shake(9, 30); this.sand(this.hx + this.cdir * 18, 30, 5);
            for (let i = 0; i < 5; i++) L.add(new P.Proj(L, this.hx + this.cdir * 10, fy - 70, -this.cdir * P.rand(0.6, 2.4), -P.rand(2, 4), { dmg: 10, spr: 'zk_rock', grav: 0.2, life: 160, w: 10, h: 10 }));
            this.state = 'stuck'; this.st = 0; this.stuck = ph === 3 ? 140 : 170;
            P.toast('¡Aturdido! Dispara al núcleo de su cabeza', { col: P.UIC.gold, life: 120 });
          }
        }
        break;
      }
      case 'stuck':
        this.hy = fy - 16 + Math.sin(this.st * 0.15); this.ang = (this.cdir > 0 ? 0 : Math.PI) + Math.sin(this.st * 0.2) * 0.06;
        if (this.st % 12 === 0) L.parts.add({ x: this.hx - this.cdir * 6, y: this.hy - 26, vy: -0.6, vx: P.rand(-0.5, 0.5), life: 30, col: P.pick(['#ffd166', '#5ae8ff']), size: 2, glow: 3 });
        if (--this.stuck <= 0) { this.stuck = 0; this.state = 'submerge'; this.st = 0; this.ang = -this.cdir * 0.3 + (this.cdir > 0 ? Math.PI : 0); }
        break;
      case 'laser': {
        // se alza en el centro y barre con un rayo de plasma de arena
        if (this.step === 0) { if (this.st === 1) this.sx = P.clamp(p.cx < 240 ? 330 : 150, x0, x1); this.steer(this.sx, fy + 60, 3, 0.1); if (this.st > 20 && Math.abs(this.hx - this.sx) < 12) { this.step = 1; this.st = 0; this.sand(this.sx, 16, 4); P.Audio.sfx('explode'); } }
        else if (this.step === 1) { this.steer(this.sx, fy - 120, 3.4, 0.12); if (this.hy < fy - 112 || this.st > 90) { this.step = 2; this.st = 0; this.ang = Math.atan2(p.cy - this.hy, p.cx - this.hx) + (p.cx > this.hx ? -0.5 : 0.5); P.Audio.sfx('charge'); } }
        else {
          const charge = ph === 3 ? 44 : 56, fire = 56;
          if (this.st < charge) { this.aimAt(p.cx, p.cy, 0.03); this.beam = { tele: true, a: this.st / charge }; this.mouth = this.st / charge; }
          else if (this.st < charge + fire) {
            if (this.st === charge) { P.Audio.sfx('laser'); P.shake(5, 30); }
            this.aimAt(p.cx, p.cy, ph === 3 ? 0.016 : 0.011); this.beam = { tele: false, a: 1 }; this.mouth = 1;
            const m = this.mouthPos, ca = Math.cos(this.ang), sa = Math.sin(this.ang);
            for (let d = 0; d < 460; d += 5) {
              const bx = m.x + ca * d, by = m.y + sa * d; if (by > fy) { if (this.t % 2 === 0) L.parts.add({ x: bx, y: fy - 2, vy: -P.rand(1, 3), vx: P.rand(-1, 1), life: 16, col: P.pick(['#ffb030', '#fff0a0']), size: 2, glow: 3 }); break; }
              if (!p.dead && bx > p.x - 3 && bx < p.x + p.w + 3 && by > p.y - 3 && by < p.y + p.h + 3) { p.hurt(18, m.x); break; }
            }
          } else { this.beam = null; this.state = 'submerge'; this.st = 0; }
        }
        break;
      }
      case 'quake': {
        // derrumbe: rocas caen del cañón (aviso en el suelo)
        if (this.step === 0) { this.steer(240, fy + 60, 3, 0.1); if (this.st > 20 && Math.abs(this.hx - 240) < 14) { this.step = 1; this.st = 0; this.sand(240, 20, 4); P.Audio.sfx('explode'); } }
        else if (this.step === 1) { this.steer(240, fy - 96, 3.4, 0.14); if (this.hy < fy - 88 || this.st > 70) { this.step = 2; this.st = 0; P.Audio.sfx('roar'); P.shake(8, 90); } }
        else {
          this.mouth = 1; this.aimAt(240, -100, 0.08);
          if (this.st % 11 === 0 && this.st < 100) this.marks.push({ x: P.clamp(p.cx + P.rand(-110, 110), x0 - 20, x1 + 20), t: 0 });
          if (this.st > 120) { this.state = 'submerge'; this.st = 0; }
        }
        break;
      }
      case 'death': {
        if (this.st < 60) this.steer(P.clamp(this.hx, x0 + 40, x1 - 40), fy - 100, 2, 0.1);
        else { this.ang = -Math.PI / 2 + Math.sin(this.st * 0.25) * 0.7; this.mouth = 1; }
        if (this.st % 6 === 0) { P.Audio.sfx('explode'); L.parts.burst(this.hx + P.rand(-20, 20), this.hy + P.rand(-20, 20), 8, { col: P.pick(['#ffb030', '#ff5a3a', '#5ae8ff']), smin: 1, smax: 3, lmin: 20, lmax: 40, glow: 4 }); }
        // los segmentos estallan de la cola a la cabeza
        const k = Math.floor((this.st - 50) / 9);
        if (k >= 0 && k < this.N && (this.st - 50) % 9 === 0) { const s = this.segs[this.N - 1 - k]; s.gone = true; P.Audio.sfx('explode'); P.shake(3, 8); L.parts.burst(s.ax, s.ay, 18, { col: P.pick(['#ffb030', '#8a98bc', '#e09068']), smin: 1, smax: 4, g: 0.15, size: 2, glow: 3 }); }
        if (this.st === 50 + this.N * 9 + 30) { P.Audio.sfx('bigexplode'); P.shake(12, 40); this.dead = true; for (const s of this.segs) s.dead = true; P.drop(L, this.hx, this.hy, { xp: 300, crys: 6, bio: 10 }); L.onBossDefeated(this); }
        break;
      }
    }
    this.record(); this.sync();
    // salir o entrar en la arena: explosión de arena en el punto de cruce
    if (wasVis !== this.visible && this.state !== 'intro') { this.sand(this.hx, 14, 4); if (!this.holes.some(h => Math.abs(h.x - this.hx) < 20 && h.t < 40)) this.holes.push({ x: this.hx, t: 0 }); }
    for (const h of this.holes) h.t++; this.holes = this.holes.filter(h => h.t < 160);
    // marcas de derrumbe
    for (const m of this.marks) { m.t++; if (m.t === 40) L.add(new P.Proj(L, m.x, L.cam.y - 12, 0, 2.5, { dmg: 13, spr: 'zk_rock', grav: 0.22, life: 200, w: 12, h: 12 })); }
    this.marks = this.marks.filter(m => m.t < 60);
    // contacto (la cabeza y los segmentos visibles)
    if (this.active && !this.dying && !p.dead) {
      if (this.visible && P.overlap({ x: this.hx - 16, y: this.hy - 14, w: 32, h: 28 }, p)) p.hurt(this.dmg, this.hx);
      else if (this.state !== 'stuck') for (const s of this.segs) if (!s.untouchable && P.overlap({ x: s.x + 3, y: s.y + 3, w: s.w - 6, h: s.h - 6 }, p)) { p.hurt(14, s.ax); break; }
    }
  }
  spitVolley(n, sp) {
    const L = this.L, p = L.player, m = this.mouthPos; this.mouth = 1; P.Audio.sfx('splash');
    for (let i = 0; i < n; i++) { const dx = p.cx - m.x, vx = P.clamp(dx / 55, -3.4, 3.4) + (i - (n - 1) / 2) * 0.85; L.add(new P.Proj(L, m.x, m.y, vx, -sp - Math.random() * 0.8, { dmg: 11, spr: 'b_orb', grav: 0.15, life: 180, w: 8, h: 8, glow: '#ffb030' })); }
  }
  rot(c, name, frame, x, y, ang, k, flash) {
    const s = P.S[name], i = frame % s.f.length; let im = s.f[i];
    if (flash) im = s.wf[i] || (s.wf[i] = P._tint(s.f[i], '#ffffff'));
    c.save(); c.translate(Math.round(x), Math.round(y)); c.rotate(ang); if (Math.cos(ang) < 0) c.scale(1, -1);
    c.drawImage(im, Math.round(-s.w * k / 2), Math.round(-s.h * k / 2), Math.round(s.w * k), Math.round(s.h * k)); c.restore();
  }
  draw(c, cx, cy) {
    const L = this.L, fy = this.floorY, cr = this.phase === 3, dA = this.state === 'death' ? Math.max(0, 1 - (this.st - (50 + this.N * 9)) / 30) : 1;
    // agujeros en la arena
    for (const h of this.holes) { const a = Math.min(1, (160 - h.t) / 60); c.globalAlpha = a; c.fillStyle = '#5a3418'; c.beginPath(); c.ellipse(h.x - cx, fy - cy + 1, 18, 4, 0, 0, 7); c.fill(); c.fillStyle = '#e8a440'; c.beginPath(); c.ellipse(h.x - cx, fy - cy - 1, 22, 3, 0, Math.PI, 7); c.fill(); c.globalAlpha = 1; }
    // temblor de aviso
    if (this.tremor) { const t = this.tremor, x = t.x - cx + P.rand(-1, 1) * t.a * 2, y = fy - cy; c.fillStyle = '#c07a2a'; c.beginPath(); c.ellipse(x, y, 10 + t.a * 16, 2 + t.a * 6, 0, Math.PI, 7); c.fill(); c.fillStyle = '#ffcc6a'; c.beginPath(); c.ellipse(x, y - 1, 6 + t.a * 12, 1 + t.a * 4, 0, Math.PI, 7); c.fill(); if (this.t % 16 < 8) P.txt(c, '!', x - 2, y - 26 - t.a * 6, '#ff3a5a'); }
    // marcas de derrumbe
    for (const m of this.marks) { c.globalAlpha = 0.4 + Math.sin(m.t * 0.5) * 0.3; c.fillStyle = '#ff3a5a'; c.fillRect(m.x - cx - 7, fy - cy - 2, 14, 2); c.globalAlpha = 1; }
    if (this.hy > fy + 40 && this.allUnder()) return;
    c.save(); c.beginPath(); c.rect(0, 0, P.W, fy - cy); c.clip();
    if (dA < 1) c.globalAlpha = dA;
    const sh = this.state === 'death' ? P.rand(-1.5, 1.5) : 0;
    // cuerpo: de la cola a la cabeza
    for (let i = this.N - 1; i >= 0; i--) {
      const s = this.segs[i]; if (s.gone) continue;
      const q = this.trail[Math.min(this.trail.length - 1, (i + 1) * this.GAP)], q2 = this.trail[Math.min(this.trail.length - 1, i * this.GAP)];
      const a = Math.atan2(q2.y - q.y, q2.x - q.x);
      if (q.y - 20 > fy) continue;
      if (i === this.N - 1) this.rot(c, 'zk_tail', 0, q.x - cx + sh, q.y - cy, a, s.k + 0.1, s.flash > 0);
      else this.rot(c, cr ? 'zk_seg_c' : 'zk_seg', (Math.floor(this.t / 10) + i) % 2, q.x - cx + sh, q.y - cy, a, s.k, s.flash > 0);
    }
    // cabeza
    const fr = this.stuck > 0 ? 3 : this.mouth > 0.7 ? 2 : this.mouth > 0.25 ? 1 : 0;
    if (this.hy - 30 < fy) {
      if (this.stuck > 0) P.drawGlow(c, this.hx - cx, this.hy - cy - 12, 20 + Math.sin(this.t * 0.4) * 4, '#2fe0c0', 0.7);
      this.rot(c, cr ? 'zk_head_c' : 'zk_head', fr, this.hx - cx + sh, this.hy - cy, this.ang, 1, this.flash > 0 || (this.state === 'death' && this.st % 8 < 3));
      const ca = Math.cos(this.ang), sa = Math.sin(this.ang), ly = ca < 0 ? 9 : -9, eye = { x: this.hx + 5 * ca - ly * sa, y: this.hy + 5 * sa + ly * ca };
      if (this.stuck <= 0 && this.state !== 'death') P.drawGlow(c, eye.x - cx, eye.y - cy, 6, '#ff2040', 0.6);
      if (this.mouth > 0.5) { const m = this.mouthPos; P.drawGlow(c, m.x - cx, m.y - cy, 10 + this.mouth * 6, '#ff8a2a', 0.5); }
      if (this.stuck > 0 && this.t % 20 < 10) P.txt(c, '▼', this.hx - cx - 2, this.hy - cy - 44, '#ffd166');
    }
    c.globalAlpha = 1; c.restore();
    // rayo
    if (this.beam) {
      const m = this.mouthPos, ca = Math.cos(this.ang), sa = Math.sin(this.ang); let len = 460;
      for (let d = 0; d < 460; d += 4) if (m.y + sa * d > fy) { len = d; break; }
      const x0 = m.x - cx, y0 = m.y - cy, x1 = x0 + ca * len, y1 = y0 + sa * len;
      if (this.beam.tele) { c.globalAlpha = 0.2 + this.beam.a * 0.5; c.strokeStyle = '#ffb030'; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.globalAlpha = 1; P.drawGlow(c, x0, y0, 4 + this.beam.a * 12, '#ffb030', 0.9); }
      else {
        for (const [w, col] of [[11, '#c8301a'], [7, '#ffb030'], [3, '#fff6c0']]) { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); }
        c.lineWidth = 1; P.drawGlow(c, x0, y0, 18, '#ffb030', 0.9); P.drawGlow(c, x1, y1, 16, '#ffd166', 0.8);
      }
    }
  }
};

P.BOSS_CLASS = P.BOSS_CLASS || {}; P.BOSS_CLASS.zarmakh = P.Zarmakh;
