'use strict';
// MYKARON — Rey Hongo (MYKORIS). Según la referencia: sombrero naranja moteado con láminas azules debajo, rostro magenta
// alargado con la boca abierta y hueca, torso de costillas que gotea violeta, brazos larguísimos con garras y un cuerpo
// que termina en raíces magenta y azules hundidas en la tierra. Setitas rojas a su alrededor y esferas de esporas de colores.
P.MKC = { mag: ['#3a0420', '#7a0a4a', '#c01a7a', '#ff4aa8', '#ff9ad8'], blue: ['#0a1a4a', '#1a3a8a', '#2a6ad0', '#5aa8ff'], cap: ['#6a1a06', '#c04a10', '#ff7a1a', '#ffb060', '#fff0d8'], drip: ['#3a0a5a', '#6a1a9a'] };
P.Sprites.buildMykaron = function () {
  const C = P.MKC;
  // sombrero (f1: agrietado)
  P.mk('mk_cap', 92, 44, 2, (p, f) => {
    const cx = 46, by = 34;
    for (let yy = 0; yy < 26; yy++) { const t = yy / 26, ww = 44 * Math.sqrt(1 - t * t); for (let x = -ww; x <= ww; x++) { const lit = -x / 60 - t * 0.6 + 0.6 + (1 - Math.abs(x) / ww) * 0.4; p.px(cx + x, by - yy, C.cap[P.clamp(Math.round(lit * 2.4), 0, 3)]); } }
    for (const [x, y, r] of [[-28, -8, 4], [-12, -16, 5], [8, -20, 4], [24, -12, 5], [34, -4, 3], [-36, -2, 3], [-2, -6, 3], [16, -4, 2.5]]) { p.ell(cx + x, by + y, r, r * 0.8, C.cap[4]); p.px(cx + x - 1, by + y - 1, '#ffffff'); }
    // láminas azules bajo el sombrero
    p.ell(cx, by + 2, 42, 6, C.blue[0]); for (let k = -20; k <= 20; k++) p.line(cx, by + 4, cx + k * 2.1, by + 1, C.blue[k % 2 ? 1 : 2]); p.line(cx - 42, by + 1, cx + 42, by + 1, C.cap[0]);
    if (f) { const V = '#ff4aa8'; p.line(cx - 6, by - 24, cx - 2, by - 8, V); p.line(cx - 2, by - 8, cx - 14, by, V); p.line(cx + 18, by - 18, cx + 26, by - 4, V); }
  }, { up: 0.06, down: 0.12, dark: 0.55 });
  // cuerpo: rostro de boca hueca, torso de costillas que gotea y tronco de raíces (f1: grito con las láminas brillando)
  P.mk('mk_body', 64, 120, 2, (p, f) => {
    const cx = 32;
    // tronco de raíces
    for (let y = 70; y < 120; y++) { const w = 7 + (y - 70) * 0.45; for (let x = -w; x <= w; x++) { const str = Math.sin(x * 0.7 + y * 0.12); p.px(cx + x, y, str > 0.55 ? C.blue[2] : str > 0.1 ? C.mag[2] : str > -0.4 ? C.mag[1] : C.mag[0]); } }
    for (let k = 0; k < 6; k++) { let x = cx + (k - 2.5) * 6, y = 112; for (let j = 0; j < 12; j++) { x += (k - 2.5) * 0.5; y += 0.6; p.px(x, y, j % 3 ? C.mag[2] : C.blue[2]); } }
    // torso con costillas
    for (let y = 30; y < 72; y++) { const w = 7 + Math.sin((y - 30) / 42 * Math.PI) * 3; p.rect(Math.round(cx - w), y, Math.round(w * 2), 1, C.mag[2]); p.px(Math.round(cx - w), y, C.mag[3]); p.px(Math.round(cx + w) - 1, y, C.mag[0]); }
    for (let k = 0; k < 6; k++) { const y = 38 + k * 5; p.line(cx - 8, y, cx - 2, y + 2, C.mag[0]); p.line(cx + 8, y, cx + 2, y + 2, C.mag[0]); p.px(cx - 6, y, C.mag[4]); }
    p.line(cx, 34, cx, 68, C.mag[1]);
    // cuello y rostro alargado con la boca hueca
    for (let y = 2; y < 32; y++) { const w = 6 - Math.abs(y - 14) * 0.12; p.rect(Math.round(cx - w), y, Math.round(w * 2), 1, C.mag[y < 8 ? 3 : 2]); p.px(Math.round(cx - w), y, C.mag[4]); }
    const mo = f ? 1.4 : 1; p.ell(cx, 14, 3.6 * mo, 7 * mo, C.mag[0]); p.ell(cx, 14, 2.6 * mo, 6 * mo, f ? '#ff9ad8' : '#1a0010'); if (!f) p.ell(cx, 15, 1.6, 4, '#0a0006');
    // goteo violeta
    for (let k = 0; k < 7; k++) { const x = cx - 10 + k * 3.3, l = 6 + ((k * 7) % 14); for (let j = 0; j < l; j++) p.px(x, 46 + (k % 3) * 6 + j, j % 4 ? C.drip[1] : C.drip[0]); }
    // setitas rojas al pie
    for (const [x, h] of [[6, 10], [58, 12], [14, 6], [52, 7]]) { p.line(x, 119, x + 1, 119 - h, '#e8dcc0'); p.ell(x + 1, 119 - h, 4, 2.6, '#c0201a'); p.px(x, 118 - h, '#ffd8c8'); }
  }, { up: 0.06, down: 0.12, dark: 0.55 });
  P.mk('mk_minion', 18, 14, 5, (p, f) => { const ph = f === 4 ? 0 : f; for (let k = 0; k < 2; k++) p.line(7 + k * 4, 9, 6 + k * 4 + Math.sin((ph + k) * 1.57) * 2, 13, '#e8dcc0'); p.rect(8, 5, 3, 5, '#e8dcc0'); for (let yy = 0; yy < 5; yy++) { const ww = 7 * Math.sqrt(1 - (yy / 5) ** 2); p.rect(Math.round(9 - ww), 6 - yy, Math.round(ww * 2), 1, yy < 2 ? '#8a1010' : '#d0281a'); } p.px(6, 3, '#ffe0d0'); p.px(11, 2, '#ffe0d0'); p.px(10, 7, '#1a0a0a'); });
  P.mk('mk_orb', 14, 14, 3, (p, f) => { const col = [['#5a1a8a', '#9a3ad8', '#e0a0ff'], ['#0a3a8a', '#2a7ae8', '#a8d8ff'], ['#0a6a2a', '#1ac050', '#a8ffb0']][f]; p.sell(7, 7, 6, 6, col.concat(['#ffffff'])); const g = '#1a0a2a'; if (f === 0) { p.line(7, 4, 7, 10, g); p.line(5, 6, 9, 6, g); } if (f === 1) { p.ell(7, 7, 2, 2, g); p.px(7, 7, col[2]); } if (f === 2) { p.line(5, 5, 9, 5, g); p.line(9, 5, 5, 9, g); p.line(5, 9, 9, 9, g); } });
  // retrato del Archivo: el rey completo
  P.mk('mykaron', 110, 130, 1, p => { const C2 = P.MKC; for (const [sx, up] of [[-1, 1], [1, 0]]) { const shx = 55 + sx * 9, shy = 62, ex = 55 + sx * 30, ey = up ? 30 : 74, hx = 55 + sx * 46, hy = up ? 10 : 70; p.thick(shx, shy, ex, ey, 3, C2.mag[2]); p.thick(ex, ey, hx, hy, 2.5, C2.mag[3]); for (let k = 0; k < 4; k++) p.line(hx, hy, hx + sx * (6 + k), hy - 8 + k * 4, C2.mag[3]); } }, { outline: false });
  { const s = P.S.mykaron.f[0], x = s.getContext('2d'); x.drawImage(P.S.mk_body.f[0], 23, 10); x.drawImage(P.S.mk_cap.f[0], 9, 0); }
};
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildMykaron(); }; })();

P.MYKARON_ARENA = (function () { const A = P.BOSS_ARENA.slice(); return A; })();
P.ARENAS = P.ARENAS || {}; P.ARENAS.mykaron = P.MYKARON_ARENA;

// esfera de esporas: violeta (te persigue), azul (rebota), verde (se divide en tres)
P.SporeOrb = class extends P.Ent {
  constructor(L, x, y, kind, vx, vy, small) { super(L, x - 6, y - 6, 12, 12); this.kind = kind; this.vx = vx; this.vy = vy; this.life = small ? 120 : 300; this.small = small; this.isOrb = true; }
  update() {
    const L = this.L, p = L.player; this.t++;
    if (this.kind === 0) { const a = Math.atan2(p.cy - this.cy, p.cx - this.cx); this.vx += Math.cos(a) * 0.04; this.vy += Math.sin(a) * 0.04; const s = Math.hypot(this.vx, this.vy); if (s > 1.7) { this.vx *= 1.7 / s; this.vy *= 1.7 / s; } }
    if (this.kind === 1) { this.vy += 0.12; const fy = L.boss ? L.boss.floorY : 224; if (this.y + this.h > fy && this.vy > 0) { this.y = fy - this.h; this.vy *= -0.85; } if (this.x < L.minX + 16 || this.x > L.maxX - 28) this.vx *= -1; }
    this.x += this.vx; this.y += this.vy;
    if (this.kind === 2 && !this.small && this.t === 90) { for (const a of [-0.6, 0, 0.6]) L.add(new P.SporeOrb(L, this.cx, this.cy, 2, Math.sin(a) * 2, -1.5 + Math.abs(a), true)); this.dead = true; L.parts.burst(this.cx, this.cy, 8, { col: '#a8ffb0', smin: 0.5, smax: 2 }); return; }
    if (this.t % 5 === 0) L.parts.add({ x: this.cx, y: this.cy, life: 18, col: ['#c06aff', '#5aa8ff', '#5ef0a0'][this.kind], size: 1, glow: 3 });
    if (!p.dead && P.dist(p.cx, p.cy, this.cx, this.cy) < (this.small ? 8 : 11)) { p.hurt(this.small ? 7 : 10, this.cx); this.dead = true; L.parts.burst(this.cx, this.cy, 6, { col: '#ffffff', smin: 0.5, smax: 2 }); }
    if (--this.life <= 0) this.dead = true;
  }
  draw(c, cx, cy) { const x = Math.round(this.x - cx), y = Math.round(this.y - cy); P.drawGlow(c, x + 6, y + 6, this.small ? 8 : 12, ['#c06aff', '#5aa8ff', '#5ef0a0'][this.kind], 0.45); if (this.small) { c.fillStyle = '#a8ffb0'; c.fillRect(x + 3, y + 3, 6, 6); return; } P.spr(c, 'mk_orb', this.kind, x - 1, y - 1); }
};

P.Mykaron = class extends P.Enemy {
  constructor(L, x, floorY) {
    super(L, 300, floorY - 150, 64, 150, { kind: 'mykaron', hp: 1200, dmg: 16, xp: 340, beast: true, spr: null, heavy: true });
    this.maxhp = this.hp = 1200; this.boss = true; this.floorY = floorY; this.face = -1; this.state = 'intro'; this.st = 0; this.phase = 1; this.cd = 60; this.active = false;
    this.name = 'MYKARON'; this.title = 'Rey Hongo'; this.bx = 330; this.sink = 150; this.marks = []; this.spikes = []; this.lastAtk = ''; this.arm = [{ a: 0, ext: 0 }, { a: 0, ext: 0 }]; this.claw = null;
    this.sync();
  }
  get exposed() { return this.state === 'scream'; }
  sync() { this.x = this.bx - 30; this.y = this.floorY - 150 + this.sink; this.w = 60; this.h = Math.max(4, 150 - this.sink); }
  hit(d, o = {}) {
    if (this.dead || this.dying || !this.active || this.sink > 90) return;
    const m = this.exposed ? 2 : 0.8; d = Math.max(1, Math.round(d * m)); this.hp -= d; this.flash = 6;
    this.L.popups.push({ x: this.bx + P.rand(-8, 8), y: this.floorY - 130 + this.sink, text: String(d), col: m > 1 ? '#ffd166' : '#ff9ad8', t: 0, big: m > 1 });
    if (m > 1 && this.t - (this.txtT || -99) > 50) { this.txtT = this.t; this.L.popups.push({ x: this.bx, y: this.floorY - 150 + this.sink, text: '¡LÁMINAS EXPUESTAS!', col: '#ffd166', t: 0 }); }
    this.L.parts.burst(this.bx + P.rand(-14, 14), this.floorY - 90 + this.sink + P.rand(-20, 20), 4, { col: P.pick(['#ff4aa8', '#c06aff', '#5aa8ff']), smin: 0.5, smax: 2, lmin: 6, lmax: 14 }); P.Audio.sfx(m < 1 ? 'block' : 'ehit');
    if (o.poison) this.poisonT = 90;
    if (this.hp <= 0) return this.die();
    const f = this.hp / this.maxhp; if (this.phase === 1 && f < 0.66) this.toPhase(2); else if (this.phase === 2 && f < 0.33) this.toPhase(3);
  }
  toPhase(n) { this.phase = n; this.L.popups.push({ x: this.bx, y: this.floorY - 170, text: n === 2 ? '¡LAS RAÍCES DESPIERTAN!' : '¡SU SOMBRERO SE AGRIETA!', col: '#ff8ad8', t: 0, big: true }); this.L.parts.burst(this.bx, this.floorY - 120, 30, { col: '#ff7a1a', smin: 1, smax: 4, g: 0.1 }); P.Audio.sfx('roar'); P.shake(5, 30); }
  die() {
    if (this.dying) return; this.dying = true; this.hp = 0; this.state = 'death'; this.st = 0; this.isEnemy = false; this.untouchable = true; this.claw = null; this.spikes = [];
    P.State.task('mykaron', 'defeat'); P.State.data.stats.kills++; P.Audio.sfx('roar'); this.L.player.iframes = 400;
    for (const e of this.L.ents) if ((e.isEnemy && e !== this && !e.dead && !e.passive) || e.isOrb) e.dead = true;
  }
  pick() {
    const ph = this.phase, opts = ph === 1 ? ['claw', 'orbs', 'claw', 'orbs', 'burrow'] : ph === 2 ? ['claw', 'orbs', 'roots', 'brood', 'burrow'] : ['claw', 'orbs', 'roots', 'roots', 'brood', 'burrow'];
    let a = P.pick(opts); if (a === this.lastAtk && Math.random() < 0.75) a = P.pick(opts);
    if (a === 'brood' && this.L.ents.filter(e => e.mkBaby && !e.dead).length >= 3) a = 'orbs';
    this.lastAtk = a; this.state = a; this.st = 0; this.step = 0;
  }
  shoulder(sd) { return [this.bx + sd * 9, this.floorY - 86 + this.sink]; }
  update() {
    const L = this.L, p = L.player, fy = this.floorY, ph = this.phase, spd = ph === 3 ? 1.3 : ph === 2 ? 1.12 : 1;
    this.t++; if (this.flash > 0) this.flash--;
    if (this.poisonT > 0) { this.poisonT--; if (this.poisonT % 30 === 0 && this.active) { this.hp -= 2; if (this.hp <= 0) this.die(); } }
    if (!this.seen && this.sink < 100) { this.seen = true; P.State.see('mykaron'); }
    if (this.state !== 'death') this.face = p.cx > this.bx ? 1 : -1;
    this.st++;
    const relax = () => { for (const a of this.arm) { a.a += (0 - a.a) * 0.1; a.ext += (0 - a.ext) * 0.1; } };
    switch (this.state) {
      case 'intro': break;
      case 'roar': this.sink = Math.max(0, this.sink - 2.2); if (this.st % 4 === 0 && this.sink > 0) L.parts.burst(this.bx + P.rand(-30, 30), fy - 2, 3, { col: '#4e3222', smin: 1, smax: 3, g: 0.2, size: 2 }); if (this.st === 70) { P.Audio.sfx('roar'); P.shake(6, 40); } if (this.st > 110) { this.state = 'idle'; this.cd = 40; } break;
      case 'idle': relax(); if (--this.cd <= 0) this.pick(); break;
      case 'claw': {
        // levanta un brazo (aviso) y barre hasta donde estabas
        const sd = this.face, A = this.arm[sd > 0 ? 1 : 0];
        if (this.step === 0) { A.a += (-1.1 - A.a) * 0.1; A.ext += (0.3 - A.ext) * 0.1; if (this.st > 36 / spd) { this.step = 1; this.st = 0; this.tgt = [p.cx, p.cy]; P.Audio.sfx('dash'); } }
        else if (this.step === 1) { const [sx, sy] = this.shoulder(sd), k = Math.min(1, this.st / 12), ang = Math.atan2(this.tgt[1] - sy, (this.tgt[0] - sx) * sd); A.a = -1.1 + (ang + 1.1) * k; A.ext = Math.min(1, Math.hypot(this.tgt[0] - sx, this.tgt[1] - sy) / 120) * k + 0.3 * (1 - k); const [hx, hy] = this.hand(sd); this.claw = [hx, hy]; if (!p.dead && P.dist(hx, hy, p.cx, p.cy) < 16) p.hurt(14, hx); if (this.st > 20) { this.step = 2; this.st = 0; this.claw = null; } }
        else { relax(); if (this.st > 24) { this.state = Math.random() < 0.35 ? 'scream' : 'idle'; this.st = 0; this.cd = 34 / spd; } }
        break;
      }
      case 'orbs': {
        const n = ph === 3 ? 5 : ph === 2 ? 4 : 3; this.arm[0].a += (-0.6 - this.arm[0].a) * 0.1; this.arm[1].a += (-0.6 - this.arm[1].a) * 0.1;
        if (this.st % 20 === 0 && this.st / 20 <= n && this.st > 0) { const k = (this.st / 20 + this.t) % 3, sx = this.bx + P.rand(-30, 30), sy = fy - 150 + this.sink; L.add(new P.SporeOrb(L, sx, sy, k, (p.cx > this.bx ? 1 : -1) * P.rand(1, 2.2), -P.rand(0.5, 1.5))); P.Audio.sfx('spine'); }
        if (this.st > 20 * n + 40) { this.state = Math.random() < 0.5 ? 'scream' : 'idle'; this.st = 0; this.cd = 36 / spd; }
        break;
      }
      case 'roots':
        relax(); if (this.st === 1) { P.Audio.sfx('roar'); this.marks = []; const n = ph === 3 ? 4 : 3; for (let i = 0; i < n; i++) this.marks.push({ x: P.clamp(p.cx + (i - (n - 1) / 2) * 46, L.minX + 20, L.maxX - 20), t: 0 }); }
        if (this.st > 110) { this.state = 'scream'; this.st = 0; }
        break;
      case 'brood':
        relax(); if (this.st === 20) { P.Audio.sfx('roar'); for (let i = 0; i < (ph === 3 ? 3 : 2); i++) { const e = L.add(new P.Crab(L, this.bx + (i ? 40 : -50), fy, false)); e.spr = 'mk_minion'; e.kind = null; e.hp = e.maxhp = 8; e.mkBaby = true; L.parts.burst(e.cx, e.cy, 8, { col: '#d0281a', smin: 1, smax: 2 }); } }
        if (this.st > 50) { this.state = 'idle'; this.cd = 40; }
        break;
      case 'scream':
        // abre la boca y brillan las láminas: vulnerable
        relax(); if (this.st === 1) { P.Audio.sfx('roar'); P.shake(4, 30); L.fx.push({ k: 'ring', x: this.bx, y: fy - 120 + this.sink, t: 0, life: 30, r: 90, col: '#ff9ad8' }); P.toast('¡Grita! Dispara a sus láminas', { col: P.UIC.gold, life: 80 }); }
        if (this.st > (ph === 3 ? 80 : 110)) { this.state = 'idle'; this.cd = 30; }
        break;
      case 'burrow':
        relax(); if (this.step === 0) { this.sink = Math.min(150, this.sink + 3); if (this.st % 4 === 0) L.parts.burst(this.bx + P.rand(-30, 30), fy - 2, 3, { col: '#4e3222', smin: 1, smax: 3, g: 0.2, size: 2 }); if (this.sink >= 150) { this.step = 1; this.st = 0; this.tx = P.clamp(p.cx + (p.cx > 240 ? -140 : 140), L.minX + 60, L.maxX - 60); } }
        else if (this.step === 1) { this.bx += P.clamp(this.tx - this.bx, -3.5, 3.5); if (this.t % 3 === 0) L.parts.add({ x: this.bx + P.rand(-10, 10), y: fy - 2, vy: -P.rand(1, 2.5), vx: P.rand(-1, 1), g: 0.15, life: 26, col: '#6a4a32', size: 2 }); if (Math.abs(this.tx - this.bx) < 3) { this.step = 2; this.st = 0; P.Audio.sfx('bigexplode'); P.shake(6, 20); if (!p.dead && Math.abs(p.cx - this.bx) < 34 && p.y + p.h > fy - 50) p.hurt(12, this.bx); } }
        else { this.sink = Math.max(0, this.sink - 5); if (this.sink <= 0) { this.state = 'idle'; this.cd = 40; } }
        break;
      case 'death':
        this.sink = Math.min(120, this.sink + 0.6); if (this.st % 6 === 0) { P.Audio.sfx('explode'); L.parts.burst(this.bx + P.rand(-40, 40), fy - 140 + this.sink + P.rand(0, 100), 10, { col: P.pick(['#ff4aa8', '#ff7a1a', '#5aa8ff', '#c06aff']), smin: 1, smax: 4, lmin: 20, lmax: 40, glow: 4 }); }
        if (this.st === 150) { P.Audio.sfx('bigexplode'); P.shake(12, 40); for (let i = 0; i < 60; i++) { const a = Math.random() * 7; L.parts.add({ x: this.bx, y: fy - 80, vx: Math.cos(a) * P.rand(1, 6), vy: Math.sin(a) * P.rand(1, 6) - 1, g: 0.12, life: P.ri(30, 70), col: P.pick(['#ff9ad8', '#5ef0a0', '#ffb060', '#5aa8ff']), size: 3, shrink: true }); } this.dead = true; P.drop(L, this.bx, fy - 80, { xp: 340, crys: 7, bio: 12 }); L.onBossDefeated(this); }
        break;
    }
    // raíces que brotan del suelo con aviso
    for (const m of this.marks) { m.t++; if (m.t === 40) { this.spikes.push({ x: m.x, t: 0 }); P.Audio.sfx('break'); L.parts.burst(m.x, fy - 2, 8, { col: '#6a4a32', smin: 1, smax: 3, g: 0.2 }); } }
    this.marks = this.marks.filter(m => m.t < 40);
    for (const s of this.spikes) { s.t++; if (s.t > 4 && s.t < 30 && !p.dead && Math.abs(p.cx - s.x) < 10 && p.y + p.h > fy - 48) p.hurt(14, s.x); }
    this.spikes = this.spikes.filter(s => s.t < 36);
    this.sync();
    if (this.active && !this.dying && this.sink < 60 && !p.dead && Math.abs(p.cx - this.bx) < 22 && p.y + p.h > fy - 140 + this.sink) p.hurt(this.dmg, this.bx);
    if (this.t % 7 === 0 && !this.dying && this.sink < 100) L.parts.add({ x: this.bx + P.rand(-12, 12), y: fy - 80 + this.sink, vy: 0.5, g: 0.12, life: 40, col: P.pick(['#6a1a9a', '#3a0a5a']), size: 1 });
  }
  // brazo largo de dos tramos con garras: a = ángulo (0 = horizontal hacia fuera), ext = extensión 0..1
  hand(sd) { const A = this.arm[sd > 0 ? 1 : 0], [sx, sy] = this.shoulder(sd), sway = Math.sin(this.t * 0.05 + sd) * 0.15, a = A.a + sway + (sd > 0 ? 0.35 : 0.5), l = 34 + A.ext * 56; const ex = sx + sd * Math.cos(a - 0.6) * 30, ey = sy + Math.sin(a - 0.6) * 30; return [ex + sd * Math.cos(a) * l, ey + Math.sin(a) * l, ex, ey]; }
  drawArm(c, sd, cx, cy) {
    const [sx, sy] = this.shoulder(sd), [hx, hy, ex, ey] = this.hand(sd), C = this.flash > 0 ? ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'] : P.MKC.mag;
    P.arcSeg(c, sx - cx, sy - cy, ex - cx, ey - cy, 4, 3.5, C[2], C[4], C[0]); P.arcSeg(c, ex - cx, ey - cy, hx - cx, hy - cy, 3.5, 2.5, C[2], C[4], C[0]);
    c.fillStyle = C[1]; c.fillRect(Math.round(ex - cx) - 2, Math.round(ey - cy) - 2, 4, 4);
    // garras: cinco dedos largos y curvos
    const a = Math.atan2(hy - ey, hx - ex); for (let k = 0; k < 5; k++) { const fa = a + (k - 2) * 0.32; let x = hx, y = hy; for (let j = 0; j < 12; j++) { x += Math.cos(fa + j * 0.06 * sd); y += Math.sin(fa + j * 0.06 * sd); c.fillStyle = j > 8 ? C[4] : C[3]; c.fillRect(Math.round(x - cx), Math.round(y - cy), 1, 1); } }
    // goteo de los brazos
    if ((this.t + sd * 7) % 30 < 15) { c.fillStyle = P.MKC.drip[1]; c.fillRect(Math.round(ex - cx), Math.round(ey - cy) + 3, 1, 3 + (this.t >> 2) % 4); }
  }
  draw(c, cx, cy) {
    const fy = this.floorY;
    for (const m of this.marks) { c.globalAlpha = 0.4 + Math.sin(m.t * 0.5) * 0.3; c.fillStyle = '#ff9ad8'; c.fillRect(m.x - cx - 8, fy - cy - 2, 16, 2); c.globalAlpha = 1; }
    for (const s of this.spikes) { const h = Math.min(48, s.t * 8) * (s.t > 26 ? (36 - s.t) / 10 : 1), x = s.x - cx; for (let k = -1; k <= 1; k++) { c.fillStyle = k ? P.MKC.mag[1] : P.MKC.mag[2]; c.beginPath(); c.moveTo(x + k * 6 - 4, fy - cy); c.lineTo(x + k * 6 + 4, fy - cy); c.lineTo(x + k * 6 + k * 2, fy - cy - h * (k ? 0.7 : 1)); c.fill(); } }
    if (this.sink >= 150 && this.state !== 'burrow') return;
    const dA = this.state === 'death' ? Math.max(0, 1 - (this.st - 110) / 40) : 1; c.globalAlpha = dA;
    // recorte para que se hunda en la tierra
    c.save(); c.beginPath(); c.rect(0, 0, P.W, fy - cy + 2); c.clip();
    const bx = Math.round(this.bx - cx), top = Math.round(fy - 150 + this.sink - cy), scr = this.state === 'scream';
    P.drawGlow(c, bx, top + 70, 70, scr ? '#ff9ad8' : '#c06aff', scr ? 0.35 : 0.18);
    this.drawArm(c, -this.face, cx, cy);
    P.spr(c, 'mk_body', scr ? 1 : 0, bx - 32, top + 30, { flash: this.flash > 0 });
    P.spr(c, 'mk_cap', this.phase === 3 ? 1 : 0, bx - 46 + Math.round(Math.sin(this.t * 0.04) * 2), top - 14 + (this.state === 'death' ? Math.min(20, this.st * 0.15) : 0), { flash: this.flash > 0 });
    if (scr) { P.drawGlow(c, bx, top + 40, 40, '#5aa8ff', 0.5 + Math.sin(this.t * 0.3) * 0.15); if (this.t % 20 < 10) P.txt(c, '▼', bx - 2, top - 8, '#ffd166'); }
    this.drawArm(c, this.face, cx, cy);
    c.restore(); c.globalAlpha = 1;
    // montículo de tierra donde está enraizado
    c.fillStyle = '#2a1a12'; c.beginPath(); c.ellipse(bx, fy - cy, 34, 5, 0, Math.PI, 0); c.fill();
  }
};
P.BOSS_CLASS = P.BOSS_CLASS || {}; P.BOSS_CLASS.mykaron = P.Mykaron;
