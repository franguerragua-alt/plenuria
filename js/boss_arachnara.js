'use strict';
// ARACHNARA — Madre Arácnida Roja (UMBRÉLIA). Según la referencia: araña carmesí de patas larguísimas articuladas con púas
// en cada junta, abdomen bulboso estriado con zarcillos encima, cefalotórax con un racimo de ojos oscuros y quelíceros.
// Las patas se dibujan en tiempo real con un paso alterno; abdomen y cabeza son sprites.
P.ARC = { leg: ['#1e0204', '#4a0810', '#7a1018', '#b81e26', '#e84a4a'], far: ['#140103', '#2e050a', '#480a10', '#6a141a'] };
P.Sprites.buildArachnara = function () {
  const A = ['#1a0205', '#3e060c', '#6e0e16', '#a01822', '#d83a3a', '#ff7a6a'];
  // abdomen: bulbo estriado con pelos rígidos (f1: agrietado con vetas de cristal)
  P.mk('ar_abd', 84, 72, 2, (p, f) => {
    const cx = 44, cy = 38;
    for (let y = -32; y <= 32; y++) for (let x = -38; x <= 38; x++) {
      const e = (x * x) / (38 * 38) + (y * y) / (32 * 32); if (e > 1) continue;
      const ridge = Math.sin(x * 0.55 + y * 0.12) * 0.5 + 0.5, lit = -x * 0.012 - y * 0.02 + (1 - e) * 0.9 + ridge * 0.35;
      p.px(cx + x, cy + y, A[P.clamp(Math.round(lit * 3), 0, 4)]);
    }
    for (let k = -5; k <= 5; k++) { const x = cx + k * 6; for (let y = -26; y < 28; y++) if ((x - cx) ** 2 / 1444 + y * y / 1024 < 0.92) p.px(x + Math.round(Math.sin(y * 0.15) * 1), cy + y, A[0]); }
    for (let k = 0; k < 26; k++) { const a = -Math.PI * 0.95 + k / 25 * Math.PI * 0.9, x = cx + Math.cos(a) * 37, y = cy + Math.sin(a) * 31; p.line(x, y, x + Math.cos(a) * 4, y + Math.sin(a) * 4 - 1, A[k % 3 ? 2 : 1]); }
    p.ell(cx + 30, cy + 6, 5, 7, A[0]); p.px(cx + 33, cy + 4, A[3]);
    if (f) { const V = '#ff6a4a'; p.line(cx - 10, cy - 28, cx - 2, cy - 8, V); p.line(cx - 2, cy - 8, cx - 12, cy + 10, V); p.line(cx + 12, cy - 20, cx + 20, cy + 2, V); p.line(cx + 20, cy + 2, cx + 14, cy + 22, V); for (const [x, y] of [[cx - 2, cy - 8], [cx + 20, cy + 2]]) { p.px(x, y, '#ffd8cc'); } }
  }, { up: 0.08, down: 0.14, dark: 0.55 });
  // cefalotórax: racimo de ocho ojos, quelíceros con colmillos e implante de Thersek en la nuca
  P.mk('ar_head', 54, 42, 2, (p, f) => {
    const cx = 24, cy = 22;
    for (let y = -16; y <= 16; y++) for (let x = -22; x <= 22; x++) { const e = x * x / 484 + y * y / 256; if (e > 1) continue; const lit = -x * 0.01 - y * 0.035 + (1 - e) * 1.1 + (Math.sin(x * 0.7) > 0.6 ? 0.25 : 0); p.px(cx + x, cy + y, A[P.clamp(Math.round(lit * 3), 0, 4)]); }
    for (let k = 0; k < 6; k++) p.line(cx - 16 + k * 5, cy - 14 + Math.abs(k - 2.5), cx - 14 + k * 5, cy - 18 + Math.abs(k - 2.5), A[3]);
    // ojos: dos grandes al frente y seis pequeños en arco
    const eye = (x, y, r) => { p.ell(x, y, r + 0.8, r + 0.8, A[0]); p.ell(x, y, r, r, '#08020a'); p.px(x - Math.max(1, r * 0.4), y - Math.max(1, r * 0.4), '#ff6a6a'); if (r > 2) p.px(x - 1, y - 2, '#ffd8cc'); };
    eye(cx + 12, cy - 2, 3.4); eye(cx + 18, cy - 1, 3);
    for (const [x, y] of [[cx + 6, cy - 7], [cx + 11, cy - 9], [cx + 17, cy - 8], [cx + 21, cy - 5], [cx + 7, cy + 2], [cx + 22, cy + 3]]) eye(x, y, 1.5);
    // quelíceros
    const o = f ? 4 : 0; for (const s of [-1, 1]) { p.thick(cx + 18, cy + 8 + s * 2, cx + 26 + o * 0.5, cy + 14 + s * o, 4, A[2]); p.tri(cx + 25 + o * 0.5, cy + 12 + s * o, cx + 29 + o * 0.5, cy + 14 + s * o, cx + 24 + o, cy + 22 + s * o * 0.5, '#f0d8c8'); }
    if (f) p.ell(cx + 27, cy + 15, 3, 2, '#2a0006');
    p.rect(cx - 18, cy - 6, 7, 5, '#3a4258'); p.rect(cx - 18, cy - 6, 7, 1, '#7a86a4'); p.px(cx - 15, cy - 4, '#ff3050');
  }, { up: 0.08, down: 0.14, dark: 0.55 });
  // cría
  P.mk('ar_baby', 18, 12, 5, (p, f) => { const ph = f === 4 ? 0 : f; for (let k = 0; k < 4; k++) { const lx = 4 + k * 3, sw = Math.sin((ph + k) * 1.57) * 1.5; p.line(lx, 6, lx - 2 + sw, 2, '#4a0810'); p.line(lx - 2 + sw, 2, lx - 3 + sw, 11, '#7a1018'); } p.sell(7, 7, 5, 3.5, ['#1a0205', '#6e0e16', '#a01822']); p.sell(13, 7, 3, 2.6, ['#1a0205', '#6e0e16', '#d83a3a']); p.px(15, 6, '#ff7a6a'); });
  P.mk('ar_web', 10, 10, 2, (p, f) => { p.ell(5, 5, 4, 4, '#ffd8cc'); for (let k = 0; k < 4; k++) { const a = k * 0.78 + f * 0.4; p.line(5 - Math.cos(a) * 4, 5 - Math.sin(a) * 4, 5 + Math.cos(a) * 4, 5 + Math.sin(a) * 4, '#ff6a6a'); } p.px(5, 5, '#ffffff'); });
  P.mk('ar_shard', 10, 16, 1, p => P.Sprites.umCrystal(p, 5, 15, 5, 15, P.UMC.r, 0));
  // retrato del Archivo: la araña completa
  P.mk('arachnara', 120, 96, 1, p => {
    const L2 = P.ARC.leg, bx = 66, by = 52;
    const leg = (hx, hy, fx, fy, col) => { const kx = hx + (fx - hx) * 0.35, ky = Math.min(hy, fy) - 34, ax = fx - (fx - hx) * 0.08, ay = fy - 18; p.thick(hx, hy, kx, ky, 4, col[1]); p.thick(kx, ky, ax, ay, 3, col[2]); p.thick(ax, ay, fx, fy, 2, col[1]); p.tri(kx - 2, ky, kx + 2, ky, kx + 1, ky - 5, col[3] || col[2]); p.px(fx, fy, '#f0d8c8'); };
    for (const [dx, j] of [[44, 0], [20, 1], [-26, 2], [-50, 3]]) leg(bx + 4 - j * 5, by + 2, bx + dx, 94, P.ARC.far);
    for (const [dx, j] of [[58, 0], [30, 1], [-34, 2], [-60, 3]]) leg(bx + 6 - j * 5, by + 4, bx + dx, 92, L2);
  }, { outline: false });
  // compone abdomen y cabeza sobre el retrato
  { const s = P.S.arachnara.f[0], x = s.getContext('2d'); x.drawImage(P.S.ar_abd.f[0], 4, 6); x.drawImage(P.S.ar_head.f[0], 60, 32); }
};
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildArachnara(); }; })();

// arena: caverna con techo de estalactitas (donde ancla sus hilos) y dos repisas de cristal
P.ARACHNARA_ARENA = (function () { const A = P.BOSS_ARENA.slice(); A[0] = '#'.repeat(30); A[1] = A[1].split('').map((ch, i) => (i % 7 === 2 || i % 7 === 3) ? '#' : ch).join(''); return A; })();
P.ARENAS = P.ARENAS || {}; P.ARENAS.arachnara = P.ARACHNARA_ARENA;

// segmento de pata nítido (sin antialias): cuadrados a lo largo de la línea con brillo arriba y sombra abajo
P.arcSeg = function (c, x0, y0, x1, y1, w0, w1, col, hi, lo) {
  const n = Math.max(2, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
  for (let i = 0; i <= n; i++) { const t = i / n, w = w0 + (w1 - w0) * t, x = Math.round(x0 + (x1 - x0) * t - w / 2), y = Math.round(y0 + (y1 - y0) * t - w / 2), s = Math.max(1, Math.round(w)); c.fillStyle = col; c.fillRect(x, y, s, s); if (s > 1) { c.fillStyle = hi; c.fillRect(x, y, 1, 1); c.fillStyle = lo; c.fillRect(x + s - 1, y + s - 1, 1, 1); } }
};
P.Arachnara = class extends P.Enemy {
  constructor(L, x, floorY) {
    super(L, 300, -200, 100, 60, { kind: 'arachnara', hp: 1100, dmg: 16, xp: 320, beast: true, spr: null, heavy: true });
    this.maxhp = this.hp = 1100; this.boss = true; this.floorY = floorY; this.face = -1; this.state = 'intro'; this.st = 0; this.phase = 1; this.cd = 60; this.active = false;
    this.name = 'ARACHNARA'; this.title = 'Madre Arácnida Roja'; this.bx = 330; this.by = -60; this.vy = 0; this.vx = 0; this.mode = 'air'; this.threads = []; this.marks = []; this.lastAtk = ''; this.thread = true;
    this.feet = []; for (let i = 0; i < 8; i++) this.feet.push({ x: this.bx, y: floorY, mv: 0, fx: 0, tx: 0 });
    this.sync();
  }
  get floorBy() { return this.floorY - 46; }
  get exposed() { return this.state === 'weave' || this.state === 'hang' || (this.state === 'rain' && this.mode === 'air'); }
  sync() { this.x = this.bx - 50 - this.face * 18; this.y = this.by - 34; this.w = 100; this.h = 60; }
  hit(d, o = {}) {
    if (this.dead || this.dying || !this.active || this.by < 0) return;
    const m = this.exposed ? 2 : 0.8; d = Math.max(1, Math.round(d * m)); this.hp -= d; this.flash = 6;
    this.L.popups.push({ x: this.bx + P.rand(-8, 8), y: this.by - 44, text: String(d), col: m > 1 ? '#ffd166' : '#ff9a9a', t: 0, big: m > 1 });
    if (m > 1 && this.t - (this.txtT || -99) > 50) { this.txtT = this.t; this.L.popups.push({ x: this.bx, y: this.by - 60, text: '¡VIENTRE EXPUESTO!', col: '#ffd166', t: 0 }); }
    this.L.parts.burst(this.bx - this.face * 30 + P.rand(-14, 14), this.by + P.rand(-14, 10), 4, { col: P.pick(['#c02028', '#ff6a5a']), smin: 0.5, smax: 2, lmin: 6, lmax: 14 }); P.Audio.sfx(m < 1 ? 'block' : 'ehit');
    if (o.poison) this.poisonT = 90;
    if (this.hp <= 0) return this.die();
    const f = this.hp / this.maxhp; if (this.phase === 1 && f < 0.66) this.toPhase(2); else if (this.phase === 2 && f < 0.33) this.toPhase(3);
  }
  toPhase(n) {
    this.phase = n; this.L.popups.push({ x: this.bx, y: this.by - 70, text: n === 2 ? '¡ARACHNARA TEJE SU RED!' : '¡SU ABDOMEN SE AGRIETA!', col: '#ff8ad8', t: 0, big: true });
    this.L.parts.burst(this.bx, this.by, 30, { col: '#ff6a5a', smin: 1, smax: 4, g: 0.1, lmin: 20, lmax: 40 }); P.Audio.sfx('roar'); P.shake(5, 30);
  }
  die() {
    if (this.dying) return; this.dying = true; this.hp = 0; this.state = 'death'; this.st = 0; this.isEnemy = false; this.untouchable = true; this.threads = [];
    P.State.task('arachnara', 'defeat'); P.State.data.stats.kills++; P.Audio.sfx('roar'); this.L.player.iframes = 400;
    for (const e of this.L.ents) if (e.isEnemy && e !== this && !e.dead && !e.passive) e.die();
  }
  pick() {
    const ph = this.phase, opts = ph === 1 ? ['lunge', 'spit', 'lunge', 'spit'] : ph === 2 ? ['lunge', 'spit', 'weave', 'brood', 'weave'] : ['lunge', 'weave', 'rain', 'spit', 'brood', 'rain'];
    let a = P.pick(opts); if (a === this.lastAtk && Math.random() < 0.75) a = P.pick(opts);
    if (a === 'brood' && this.L.ents.filter(e => e.arcBaby && !e.dead).length >= 3) a = 'spit';
    this.lastAtk = a; this.state = a; this.st = 0; this.step = 0;
  }
  toCeiling(tx) { this.mode = 'air'; this.thread = true; this.bx += (tx - this.bx) * 0.05; this.by += (84 - this.by) * 0.07; return Math.abs(this.by - 84) < 4; }
  land() { this.mode = 'floor'; this.by = this.floorBy; this.vy = 0; this.thread = false; P.Audio.sfx('bigexplode'); P.shake(6, 18); this.L.parts.burst(this.bx, this.floorY - 2, 18, { col: '#2c2434', smin: 1, smax: 4, g: 0.2, size: 2 }); }
  update() {
    const L = this.L, p = L.player, fy = this.floorY, ph = this.phase, spd = ph === 3 ? 1.3 : ph === 2 ? 1.12 : 1, x0 = L.minX + 70, x1 = L.maxX - 70;
    this.t++; if (this.flash > 0) this.flash--;
    if (this.poisonT > 0) { this.poisonT--; if (this.poisonT % 30 === 0 && this.active) { this.hp -= 2; if (this.hp <= 0) this.die(); } }
    if (!this.seen && this.by > 0) { this.seen = true; P.State.see('arachnara'); }
    if (this.state !== 'death' && this.mode === 'floor' && this.state !== 'lunge') this.face = p.cx > this.bx ? 1 : -1;
    this.st++;
    switch (this.state) {
      case 'intro': break;
      case 'roar':
        if (this.mode === 'air') { this.by += (this.floorBy - this.by) * 0.06; if (this.by > this.floorBy - 3) this.land(); }
        if (this.st === 70) { P.Audio.sfx('roar'); P.shake(6, 40); }
        if (this.st > 110 && this.mode === 'floor') { this.state = 'idle'; this.cd = 40; }
        break;
      case 'idle': {
        const tx = P.clamp(p.cx - this.face * 120, x0, x1), dx = tx - this.bx; this.vx = P.clamp(dx * 0.03, -1.1 * spd, 1.1 * spd); this.bx += this.vx;
        if (--this.cd <= 0) this.pick(); break;
      }
      case 'lunge':
        if (this.step === 0) { this.by = this.floorBy + Math.min(8, this.st * 0.3); if (this.st > 34 / spd) { this.step = 1; this.vx = P.clamp((p.cx - this.bx) / 38, -6, 6); this.vy = -7; this.mode = 'air'; this.thread = false; P.Audio.sfx('charge'); } }
        else if (this.step === 1) { this.bx = P.clamp(this.bx + this.vx, x0 - 30, x1 + 30); this.vy += 0.36; this.by += this.vy; if (this.by >= this.floorBy && this.vy > 0) { this.land(); for (const s of [-1, 1]) L.add(new P.Proj(L, this.bx + s * 40, fy - 8, s * (2.6 + (ph - 1) * 0.6), 0, { dmg: 12, spr: 'ar_shard', life: 120, w: 8, h: 14, glow: '#ff4450' })); this.step = 2; this.st = 0; } }
        else if (this.st > 30) { this.state = 'idle'; this.cd = 40 / spd; }
        break;
      case 'spit': {
        const n = ph === 3 ? 5 : ph === 2 ? 4 : 3, mx = this.bx + this.face * 34, my = this.by + 8;
        if (this.st % 18 === 0 && this.st / 18 <= n && this.st > 0) { P.Audio.sfx('spine'); const tx = p.cx + P.rand(-30, 30); L.add(new P.Proj(L, mx, my, (tx - mx) / 48, -3.6, { dmg: 11, spr: 'ar_web', grav: 0.15, life: 160, w: 9, h: 9, glow: '#ff6a6a' })); }
        if (this.st > 18 * n + 30) { this.state = 'idle'; this.cd = 36 / spd; }
        break;
      }
      case 'weave':
        // sube al techo y tiende hilos de luz: primero un aviso tenue, después arden. Mientras teje, el vientre queda expuesto
        if (this.step === 0) { if (this.toCeiling(240) && this.st > 40) { this.step = 1; this.st = 0; const n = ph === 3 ? 4 : 3, gaps = [60, 160, 260, 360, 440].sort(() => Math.random() - 0.5).slice(0, n); this.threads = gaps.map(g => ({ x0: L.minX + P.clamp(g + P.rand(-60, 60), 20, 460), x1: L.minX + g, t: 0 })); P.Audio.sfx('charge'); } }
        else if (this.step === 1) { this.bx += (240 + Math.sin(this.st * 0.05) * 30 - this.bx) * 0.05; for (const th of this.threads) th.t++; if (this.st === 60) { P.Audio.sfx('laser'); P.shake(3, 60); }
          if (this.st > 60) for (const th of this.threads) { const ax = th.x0, ay = 32, bxx = th.x1, byy = fy, vx = bxx - ax, vy = byy - ay, t = P.clamp(((p.cx - ax) * vx + (p.cy - ay) * vy) / (vx * vx + vy * vy), 0, 1); if (!p.dead && Math.hypot(ax + vx * t - p.cx, ay + vy * t - p.cy) < 7) { p.hurt(12, ax + vx * t); break; } }
          if (this.st > 160) { this.threads = []; this.state = 'hang'; this.st = 0; } }
        break;
      case 'hang': this.by += (120 - this.by) * 0.08; this.bx += (P.clamp(p.cx, x0, x1) - this.bx) * 0.01; if (this.st === 1) P.toast('¡Cuelga del techo! Dispara a su vientre', { col: P.UIC.gold, life: 90 }); if (this.st > (ph === 3 ? 70 : 95)) { this.state = 'drop'; this.st = 0; this.vy = 0; this.thread = false; } break;
      case 'drop': this.vy += 0.4; this.by += this.vy; if (this.by >= this.floorBy) { this.land(); this.state = 'idle'; this.cd = 40; } break;
      case 'brood':
        if (this.st === 20) { P.Audio.sfx('roar'); for (let i = 0; i < (ph === 3 ? 3 : 2); i++) { const e = L.add(new P.Crab(L, this.bx - this.face * 30 + (i - 1) * 16, fy, false)); e.spr = 'ar_baby'; e.kind = null; e.hp = e.maxhp = 8; e.arcBaby = true; L.parts.burst(e.cx, e.cy, 8, { col: '#ff6a5a', smin: 1, smax: 2 }); } }
        if (this.st > 50) { this.state = 'idle'; this.cd = 40; }
        break;
      case 'rain':
        if (this.step === 0) { if (this.toCeiling(P.clamp(p.cx, x0, x1)) && this.st > 30) { this.step = 1; this.st = 0; P.Audio.sfx('roar'); P.shake(5, 50); } }
        else { if (this.st % 12 === 0 && this.st < 130) this.marks.push({ x: P.clamp(p.cx + P.rand(-110, 110), L.minX + 24, L.maxX - 24), t: 0 }); if (this.st > 150) { this.state = 'drop'; this.st = 0; this.vy = 0; } }
        break;
      case 'death':
        this.by += (this.floorBy + 18 - this.by) * 0.05; this.mode = 'floor';
        if (this.st % 6 === 0) { P.Audio.sfx('explode'); L.parts.burst(this.bx + P.rand(-50, 40), this.by + P.rand(-30, 20), 10, { col: P.pick(['#ff4450', '#ffd8cc', '#c02028', '#ff9a4a']), smin: 1, smax: 4, lmin: 20, lmax: 40, glow: 4 }); }
        if (this.st === 150) { P.Audio.sfx('bigexplode'); P.shake(12, 40); for (let i = 0; i < 60; i++) { const a = Math.random() * 7; L.parts.add({ x: this.bx, y: this.by, vx: Math.cos(a) * P.rand(1, 6), vy: Math.sin(a) * P.rand(1, 6) - 1, g: 0.15, life: P.ri(30, 70), col: P.pick(['#ff4450', '#ffd8cc', '#c02028']), size: 3, shrink: true }); } this.dead = true; P.drop(L, this.bx, this.by, { xp: 320, crys: 7, bio: 10 }); L.onBossDefeated(this); }
        break;
    }
    // lluvia de esquirlas con aviso
    for (const m of this.marks) { m.t++; if (m.t === 36) L.add(new P.Proj(L, m.x, L.cam.y + 30, 0, 2.6, { dmg: 12, spr: 'ar_shard', grav: 0.25, life: 200, w: 8, h: 14, glow: '#ff4450' })); }
    this.marks = this.marks.filter(m => m.t < 50);
    this.updateFeet(); this.sync();
    if (this.active && !this.dying && this.state !== 'hang' && !p.dead && Math.hypot(p.cx - (this.bx - this.face * 14), p.cy - this.by) < 32) p.hurt(this.dmg, this.bx);
    if (this.t % 9 === 0 && !this.dying) { const f = this.feet[P.ri(0, 7)]; L.parts.add({ x: f.x, y: f.y - 20, vy: 0.4, g: 0.12, life: 40, col: '#8a121a', size: 1 }); }
  }
  // patas: 4 cercanas y 4 lejanas. En el suelo cada pie se queda quieto hasta que se aleja de su sitio y da un paso (grupos alternos)
  hip(i) { const j = i % 4; return [this.bx + this.face * (10 - j * 7), this.by + 2]; }
  rest(i) { const j = i % 4, near = i < 4, off = near ? [82, 46, -36, -72][j] : [64, 30, -22, -56][j]; return this.bx + this.face * off; }
  updateFeet() {
    const fy = this.floorY;
    for (let i = 0; i < 8; i++) {
      const f = this.feet[i], [hx, hy] = this.hip(i), j = i % 4;
      if (this.mode !== 'floor' || this.state === 'death') {
        const curl = this.state === 'death' ? Math.min(1, this.st / 80) : 0, tx = hx + this.face * [38, 22, -20, -36][j] * (i < 4 ? 1 : 0.8) * (1 - curl * 0.6), ty = hy + 30 + j * 3 + Math.sin(this.t * 0.2 + i) * 3 - curl * 20;
        f.x += (tx - f.x) * 0.25; f.y += (ty - f.y) * 0.25; f.mv = 0; continue;
      }
      const r = this.rest(i);
      if (f.mv > 0) { f.mv = Math.min(1, f.mv + 0.12); f.x = f.fx + (f.tx - f.fx) * f.mv; f.y = fy - Math.sin(f.mv * Math.PI) * 12; if (f.mv >= 1) { f.mv = 0; f.y = fy; } continue; }
      f.y += (fy - f.y) * 0.4;
      const other = this.feet.some((g, k) => k % 2 !== i % 2 && g.mv > 0);
      if (Math.abs(f.x - r) > 24 && !other) { f.mv = 0.01; f.fx = f.x; f.tx = r + Math.sign(r - f.x) * 10; }
    }
  }
  drawLeg(c, i, cx, cy) {
    const near = i < 4, C = this.flash > 0 ? ['#ffffff', '#ffffff', '#ffd8cc', '#ffffff', '#ffffff'] : near ? P.ARC.leg : P.ARC.far.concat(['#6a141a']);
    const [hx0, hy0] = this.hip(i), f = this.feet[i], hx = hx0 - cx, hy = hy0 - cy, fx = f.x - cx, fyy = f.y - cy, dx = fx - hx;
    const air = this.mode !== 'floor', kx = hx + dx * 0.35, ky = Math.min(hy, fyy) - (air ? 22 : 50) - (i % 4 === 0 || i % 4 === 3 ? 6 : 0), ax = fx - dx * 0.08, ay = fyy - (air ? 10 : 24);
    P.arcSeg(c, hx, hy, kx, ky, near ? 6 : 5, near ? 5 : 4, C[1], C[3], C[0]);
    P.arcSeg(c, kx, ky, ax, ay, near ? 5 : 4, near ? 3.5 : 3, C[2], C[4] || C[3], C[0]);
    P.arcSeg(c, ax, ay, fx, fyy, near ? 3.5 : 3, 1, C[1], C[3], C[0]);
    // púas en las juntas y garra
    c.fillStyle = C[3]; c.fillRect(Math.round(kx) - 1, Math.round(ky) - 5, 2, 4); c.fillRect(Math.round(kx) + (dx > 0 ? 2 : -3), Math.round(ky) - 3, 1, 2); c.fillRect(Math.round(ax) + (dx > 0 ? 2 : -3), Math.round(ay) - 3, 2, 2);
    c.fillStyle = C[0]; c.fillRect(Math.round(kx) - 2, Math.round(ky), 4, 2);
    c.fillStyle = '#f0d8c8'; c.fillRect(Math.round(fx), Math.round(fyy) - 1, 1, 2);
  }
  draw(c, cx, cy) {
    const L = this.L, fy = this.floorY;
    for (const m of this.marks) { c.globalAlpha = 0.4 + Math.sin(m.t * 0.5) * 0.3; c.fillStyle = '#ff4450'; c.fillRect(m.x - cx - 6, fy - cy - 2, 12, 2); c.globalAlpha = 1; }
    if (this.by < -40) return;
    const dA = this.state === 'death' ? Math.max(0, 1 - (this.st - 110) / 40) : 1; c.globalAlpha = dA;
    // hilos de luz
    for (const th of this.threads) { const act = th.t > 60, x0 = th.x0 - cx, y0 = 32 - cy, x1 = th.x1 - cx, y1 = fy - cy; c.strokeStyle = act ? '#ff4450' : 'rgba(255,90,90,' + (0.15 + th.t / 60 * 0.3) + ')'; c.lineWidth = act ? 3 : 1; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); if (act) { c.strokeStyle = '#ffd8cc'; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); P.drawGlow(c, x1, y1 - 4, 14, '#ff4450', 0.5); } c.lineWidth = 1; }
    // hilo del que cuelga
    const ax = this.bx - this.face * 38, ay = this.by - 10;
    if (this.thread && this.mode === 'air') { c.fillStyle = 'rgba(255,200,190,0.7)'; c.fillRect(Math.round(ax - cx), 0, 1, Math.max(0, Math.round(ay - 30 - cy))); }
    P.drawGlow(c, this.bx - cx, this.by - cy, 70, '#ff2a3a', 0.18);
    for (let i = 4; i < 8; i++) this.drawLeg(c, i, cx, cy);
    // abdomen con zarcillos
    const tilt = this.exposed ? 10 : 0, A = Math.round(ax - cx - 42), B = Math.round(ay - cy - 36 - tilt);
    for (let k = 0; k < 7; k++) { let x = ax - cx - 24 + k * 8, y = ay - cy - 34 - tilt; c.fillStyle = k % 2 ? '#5a0a10' : '#3e060c'; for (let s = 0; s < 18 + (k % 3) * 6; s++) { const a = -Math.PI / 2 + Math.sin(s * 0.25 + this.t * 0.05 + k) * (0.6 + s * 0.04) * (k % 2 ? 1 : -1); x += Math.cos(a); y += Math.sin(a); c.fillRect(Math.round(x), Math.round(y), 1, 1); } c.fillStyle = '#c02028'; c.fillRect(Math.round(x), Math.round(y), 1, 1); }
    P.spr(c, 'ar_abd', this.phase === 3 ? 1 : 0, A, B, { flip: this.face < 0, flash: this.flash > 0 });
    if (this.exposed) { P.drawGlow(c, ax - cx, ay - cy + 14, 26, '#ffd166', 0.3 + Math.sin(this.t * 0.2) * 0.15); }
    P.spr(c, 'ar_head', this.state === 'spit' || (this.state === 'lunge' && this.step === 0) ? 1 : 0, Math.round(this.bx - cx - 27 + this.face * 10), Math.round(this.by - cy - 21), { flip: this.face < 0, flash: this.flash > 0 });
    for (let i = 0; i < 4; i++) this.drawLeg(c, i, cx, cy);
    c.globalAlpha = 1;
    if (this.exposed && this.t % 20 < 10) P.txt(c, '▼', ax - cx - 2, ay - cy - 52, '#ffd166');
  }
};
P.BOSS_CLASS = P.BOSS_CLASS || {}; P.BOSS_CLASS.arachnara = P.Arachnara;
