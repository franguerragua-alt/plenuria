'use strict';
// MAGNAROK — Mastodonte de Fuego (IGNÁRIA). Jefe colosal que pelea desde el fondo, detrás del plano de juego.
// Según la referencia: mamut de obsidiana con enormes colmillos curvos, tres ojos rojos en la frente, una cresta de
// fuego, grietas de lava por todo el cuerpo y una trompa por la que corre el magma.
// Solo se le puede dañar cuando apoya la trompa en el suelo: entonces sus grietas brillan (punto débil).
P.MGC = { body: ['#08060a', '#120c10', '#1e161a', '#2c2226', '#3e3236'], tusk: ['#6a6080', '#a89ec0', '#d8d0e8', '#f4f0ff'], lava: ['#7a0a04', '#d0300a', '#ff6a1a', '#ffb030', '#fff0a0'] };
P.Sprites.buildMagnarok = function () {
  const B = P.MGC.body, TK = P.MGC.tusk, LV = P.MGC.lava;
  const cracks = (p, x, y, w, h, n, seed) => { const r = P.RNG(seed); for (let k = 0; k < n; k++) { let cx = x + r.int(0, w), cy = y + r.int(0, h); for (let j = 0; j < 7; j++) { const nx = cx + r.int(-3, 3), ny = cy + r.int(2, 4); p.line(cx, cy, nx, ny, j % 3 ? LV[1] : LV[2]); cx = nx; cy = ny; } } };
  P.mk('mg_body', 320, 200, 1, p => {
    // patas delanteras como pilares, cuerpo, orejas y cabeza abovedada
    for (const lx of [104, 190]) { p.rect(lx, 120, 28, 80, B[1]); p.rect(lx, 120, 4, 80, B[2]); p.rect(lx + 24, 120, 4, 80, B[0]); p.rect(lx - 2, 192, 32, 8, B[2]); cracks(p, lx + 4, 130, 18, 50, 2, lx); }
    p.sell(160, 104, 150, 72, [B[0], B[1], B[2], B[3]]); cracks(p, 30, 70, 260, 70, 7, 3);
    for (const [ex, sd] of [[76, -1], [244, 1]]) { p.sell(ex, 92, 52, 62, [B[0], B[1], B[2], B[3]]); for (let k = 0; k < 6; k++) p.line(ex - sd * 30, 50 + k * 14, ex + sd * 30, 56 + k * 14, B[0]); cracks(p, ex - 30, 60, 60, 60, 2, ex); }
    p.sell(160, 84, 64, 68, [B[0], B[1], B[2], B[3], B[4]]); p.sell(160, 32, 34, 22, [B[1], B[2], B[3], B[4]]);
    for (let k = 0; k < 7; k++) p.line(118 + k * 2, 50 + k * 6, 202 - k * 2, 50 + k * 6, k % 2 ? B[1] : B[2]);
    // cuencas de los tres ojos (el brillo se dibuja en tiempo real)
    for (const [ex, ey, r] of [[160, 58, 8], [138, 78, 7], [182, 78, 7]]) { p.ell(ex, ey, r + 2, r + 1, B[0]); p.ell(ex, ey, r, r - 1, '#2a0606'); }
    // base de la trompa
    p.sell(160, 112, 20, 18, [B[0], B[1], B[2], B[3]]);
    cracks(p, 110, 20, 100, 90, 4, 9);
    // colmillos curvos hacia fuera y arriba
    for (const sd of [-1, 1]) { let x = 160 + sd * 22, y = 122; for (let k = 0; k < 44; k++) { const a = Math.PI / 2 - (k / 44) * 2.4, w = Math.max(2, 9 - k / 6); x += sd * Math.cos(a) * 2.2; y += Math.sin(a) * 2.2; p.rect(Math.round(x - w / 2), Math.round(y - w / 2), Math.round(w), Math.round(w), TK[k < 8 ? 1 : k < 30 ? 2 : 3]); p.px(Math.round(x - w / 2), Math.round(y - w / 2), TK[3]); p.px(Math.round(x + w / 2) - 1, Math.round(y + w / 2) - 1, TK[0]); } }
  }, { up: 0.04, down: 0.1, dark: 0.3 });
  P.mk('mg_lava', 9, 9, 2, (p, f) => { p.ell(4, 4, 3.8, 3.8, f ? LV[3] : LV[2]); p.ell(3, 3, 1.4, 1.4, LV[4]); });
  P.mk('mg_rock', 12, 12, 1, p => { p.sell(6, 6, 5, 4.6, [B[1], B[2], B[3], B[4]]); p.line(3, 5, 8, 8, LV[2]); });
  // retrato del Archivo
  P.mk('magnarok', 160, 100, 1, p => {}, { outline: false });
  { const s = P.S.magnarok.f[0], x = s.getContext('2d'); x.drawImage(P.S.mg_body.f[0], 0, 0, 160, 100); x.fillStyle = '#ff3a1a'; for (const [ex, ey] of [[80, 29], [69, 39], [91, 39]]) { x.fillRect(ex - 2, ey - 2, 4, 4); } x.fillStyle = '#2c2226'; for (let k = 0; k < 12; k++) x.fillRect(77 + Math.sin(k * 0.4) * 2, 58 + k * 3, 7 - k * 0.3, 4); }
};
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildMagnarok(); P.mgHook(); }; })();
P.ARENAS = P.ARENAS || {}; P.ARENAS.magnarok = P.BOSS_ARENA.slice();
// el cuerpo se dibuja detrás de las casillas: se engancha al paso de fondo de los efectos
P.mgHook = function () { if (P.FX._mgHook) return; P.FX._mgHook = true; const base = P.FX.afterBG.bind(P.FX); P.FX.afterBG = function (L, c, cx, cy) { base(L, c, cx, cy); if (L.boss && L.boss.drawBack) L.boss.drawBack(c, cx, cy); }; };

P.Magnarok = class extends P.Enemy {
  constructor(L, x, floorY) {
    super(L, 240, floorY - 40, 40, 40, { kind: 'magnarok', hp: 1400, dmg: 16, xp: 400, beast: true, spr: null, heavy: true });
    this.maxhp = this.hp = 1400; this.boss = true; this.floorY = floorY; this.face = -1; this.state = 'intro'; this.st = 0; this.phase = 1; this.cd = 80; this.active = false;
    this.name = 'MAGNAROK'; this.title = 'Mastodonte de Fuego'; this.cxW = 240; this.rise = 120; this.tip = { x: this.cxW, y: floorY - 70 }; this.tgt = null; this.marks = []; this.rocks = []; this.restDmg = 0; this.blink = 0; this.eyes = 1; this.mood = 'calm'; this.lastAtk = '';
    this.sync();
  }
  get base() { return { x: this.cxW, y: this.floorY - 112 + this.rise + Math.sin(this.t * 0.03) * 2 }; }
  get vulnerable() { return this.state === 'rest' && !this.dying; }
  sync() { const t = this.tip; if (this.vulnerable) { this.x = t.x - 26; this.y = this.floorY - 44; this.w = 52; this.h = 44; } else { this.x = t.x - 12; this.y = t.y - 12; this.w = 24; this.h = 24; } }
  hit(d, o = {}) {
    if (this.dead || this.dying || !this.active) return;
    if (!this.vulnerable) { if (this.t - (this.noT || -99) > 40) { this.noT = this.t; this.L.popups.push({ x: this.tip.x, y: this.tip.y - 16, text: 'SIN EFECTO', col: '#8a8098', t: 0 }); } P.Audio.sfx('block'); return; }
    d = Math.max(1, Math.round(d)); this.hp -= d; this.restDmg += d; this.flash = 6; this.mood = 'hurt'; this.moodT = 20;
    this.L.popups.push({ x: this.tip.x + P.rand(-10, 10), y: this.floorY - 50, text: String(d), col: '#ffd166', t: 0, big: true });
    this.L.parts.burst(this.tip.x + P.rand(-16, 16), this.floorY - P.rand(6, 30), 5, { col: P.pick(['#ff6a1a', '#ffb030', '#fff0a0']), smin: 0.5, smax: 2.5, lmin: 8, lmax: 16, glow: 3 }); P.Audio.sfx('ehit');
    if (o.poison) this.poisonT = 90;
    if (this.hp <= 0) return this.die();
    const f = this.hp / this.maxhp; if (this.phase === 1 && f < 0.66) this.toPhase(2); else if (this.phase === 2 && f < 0.33) this.toPhase(3);
    // al recibir bastante daño levanta la trompa antes de tiempo
    if (this.restDmg >= (this.phase === 3 ? 130 : 170) && this.state === 'rest') { this.state = 'lift'; this.st = 0; P.Audio.sfx('roar'); P.shake(4, 20); }
  }
  toPhase(n) { this.phase = n; this.L.popups.push({ x: this.cxW, y: 60, text: n === 2 ? '¡MAGNAROK ENFURECE!' : '¡SU CORAZÓN DE HORNO ARDE!', col: '#ff8ad8', t: 0, big: true }); P.Audio.sfx('roar'); P.shake(6, 40); }
  die() {
    if (this.dying) return; this.dying = true; this.hp = 0; this.state = 'death'; this.st = 0; this.isEnemy = false; this.untouchable = true; this.marks = []; this.rocks = [];
    P.State.task('magnarok', 'defeat'); P.State.data.stats.kills++; P.Audio.sfx('roar'); this.L.player.iframes = 400;
    for (const e of this.L.ents) if (e.isEnemy && e !== this && !e.dead && !e.passive) e.die();
  }
  pick() {
    const ph = this.phase, opts = ph === 1 ? ['slam', 'spray', 'slam'] : ph === 2 ? ['slam', 'spray', 'stomp', 'slam'] : ['slam', 'spray', 'stomp', 'eruption', 'slam'];
    let a = P.pick(opts); if (a === this.lastAtk && a !== 'slam' && Math.random() < 0.75) a = 'slam';
    this.lastAtk = a; this.state = a; this.st = 0; this.step = 0;
  }
  // mueve la punta de la trompa hacia (x, y) con suavidad k
  tipTo(x, y, k) { this.tip.x += (x - this.tip.x) * k; this.tip.y += (y - this.tip.y) * k; }
  update() {
    const L = this.L, p = L.player, fy = this.floorY, ph = this.phase, spd = ph === 3 ? 1.3 : ph === 2 ? 1.12 : 1, B = this.base;
    this.t++; if (this.flash > 0) this.flash--; if (this.blink > 0) this.blink--; else if (Math.random() < 0.006 && this.state !== 'death') this.blink = 8;
    if (this.moodT > 0 && --this.moodT === 0) this.mood = 'calm';
    if (this.poisonT > 0) { this.poisonT--; if (this.poisonT % 30 === 0 && this.vulnerable) { this.hp -= 2; if (this.hp <= 0) this.die(); } }
    if (!this.seen && this.rise < 60) { this.seen = true; P.State.see('magnarok'); }
    this.st++;
    switch (this.state) {
      case 'intro': break;
      case 'roar': this.rise = Math.max(0, this.rise - 1.5); this.tipTo(B.x, B.y + 70, 0.05); if (this.st === 80) { P.Audio.sfx('roar'); P.shake(8, 50); this.mood = 'angry'; this.moodT = 60; } if (this.st > 120) { this.state = 'idle'; this.cd = 50; } break;
      case 'idle': this.tipTo(B.x + Math.sin(this.t * 0.03) * 40, B.y + 72 + Math.sin(this.t * 0.05) * 8, 0.05); if (--this.cd <= 0) this.pick(); break;
      case 'slam':
        // 1) levanta la trompa y apunta (aviso) · 2) la baja de golpe · 3) queda apoyada (vulnerable)
        if (this.step === 0) { if (this.st === 1) { this.tgt = P.clamp(p.cx, L.minX + 40, L.maxX - 40); this.marks.push({ x: this.tgt, t: 0, slam: true }); this.mood = 'angry'; P.Audio.sfx('charge'); } this.tipTo(B.x + (this.tgt - B.x) * 0.4, B.y - 30, 0.07); if (this.st > 56 / spd) { this.step = 1; this.st = 0; } }
        else if (this.step === 1) { this.tipTo(this.tgt, fy - 8, 0.4); if (this.st > 7) { P.Audio.sfx('bigexplode'); P.shake(10, 26); P.hitstop = 4; L.parts.burst(this.tgt, fy - 2, 30, { col: P.pick(['#ff6a1a', '#ffb030', '#363028']), smin: 1, smax: 4, g: 0.2, size: 2 }); if (!p.dead && Math.abs(p.cx - this.tgt) < 26 && p.y + p.h > fy - 40) p.hurt(18, this.tgt); for (const s of [-1, 1]) L.add(new P.Proj(L, this.tgt + s * 26, fy - 8, s * (2.4 + ph * 0.4), 0, { dmg: 12, spr: 'mg_lava', life: 120, w: 9, h: 9, glow: '#ff6a1a' })); this.marks = []; this.state = 'rest'; this.st = 0; this.restDmg = 0; this.mood = 'pain'; if (!L.mgTip) { L.mgTip = true; P.toast('¡La trompa está en el suelo! Atácala', { col: P.UIC.gold, life: 120 }); } } }
        break;
      case 'rest': this.tip.y = fy - 8 + Math.sin(this.t * 0.2) * 0.5; if (this.st > (ph === 3 ? 110 : 150)) { this.state = 'lift'; this.st = 0; } break;
      case 'lift': this.tipTo(B.x, B.y + 70, 0.06); this.mood = 'angry'; if (this.st > 40) { this.state = 'idle'; this.cd = 40 / spd; this.mood = 'calm'; } break;
      case 'spray':
        // la trompa escupe magma en arcos (como en la referencia, el magma corre por la trompa)
        this.tipTo(B.x + Math.sin(this.st * 0.04) * 120, fy - 70, 0.06); this.mood = 'angry';
        if (this.st > 30 && this.st % (ph === 3 ? 7 : 10) === 0 && this.st < 130) { P.Audio.sfx('spine'); L.add(new P.Proj(L, this.tip.x, this.tip.y + 6, P.rand(-2.6, 2.6), -P.rand(2, 4), { dmg: 10, spr: 'mg_lava', grav: 0.15, life: 160, w: 8, h: 8, glow: '#ff6a1a' })); }
        if (this.st > 150) { this.state = 'idle'; this.cd = 40 / spd; }
        break;
      case 'stomp':
        // pisotón en el fondo: caen rocas del techo con aviso
        if (this.st === 30) { P.Audio.sfx('bigexplode'); P.shake(12, 30); for (let k = 0; k < (ph === 3 ? 6 : 4); k++) this.rocks.push({ x: P.clamp(p.cx + (k - 1.5) * 50 + P.rand(-15, 15), L.minX + 20, L.maxX - 20), t: 0 }); }
        this.tipTo(B.x, B.y + 60, 0.05); if (this.st > 110) { this.state = 'idle'; this.cd = 40; }
        break;
      case 'eruption':
        if (this.st === 1) { this.marks = []; for (let k = 0; k < 5; k++) this.marks.push({ x: P.clamp(p.cx + (k - 2) * 60, L.minX + 20, L.maxX - 20), t: 0, erupt: true }); P.Audio.sfx('roar'); }
        if (this.st > 120) { this.marks = []; this.state = 'idle'; this.cd = 40; }
        break;
      case 'death':
        this.rise = Math.min(140, this.rise + 0.5); this.tipTo(this.cxW, fy - 6, 0.04); this.eyes = Math.max(0, this.eyes - 0.008);
        if (this.st % 6 === 0) { P.Audio.sfx('explode'); L.parts.burst(this.cxW + P.rand(-120, 120), fy - P.rand(40, 180) + this.rise * 0.5, 10, { col: P.pick(['#ff6a1a', '#ffb030', '#fff0a0', '#d0300a']), smin: 1, smax: 4, lmin: 20, lmax: 40, glow: 4 }); }
        if (this.st === 160) { P.Audio.sfx('bigexplode'); P.shake(14, 50); this.dead = true; P.drop(L, this.cxW, fy - 40, { xp: 400, crys: 9, bio: 14 }); L.onBossDefeated(this); }
        break;
    }
    // avisos en el suelo: rocas que caen y columnas de erupción
    for (const r of this.rocks) { r.t++; if (r.t === 40) L.add(new P.Proj(L, r.x, L.cam.y + 20, 0, 2, { dmg: 12, spr: 'mg_rock', grav: 0.25, life: 200, w: 10, h: 10 })); }
    this.rocks = this.rocks.filter(r => r.t < 50);
    for (const m of this.marks) { m.t++; if (m.erupt && m.t > 50 && m.t < 90) { if (m.t % 2 === 0) L.parts.add({ x: m.x + P.rand(-5, 5), y: fy - 2, vy: -P.rand(3, 6), g: 0.08, life: 24, col: P.pick(['#ff6a1a', '#ffb030', '#fff0a0']), size: 2, glow: 3 }); if (!p.dead && Math.abs(p.cx - m.x) < 11 && p.y + p.h > fy - 80) p.hurt(12, m.x, { env: true }); } }
    // goteo de magma por la trompa
    if (this.t % 6 === 0 && !this.dying) L.parts.add({ x: this.tip.x + P.rand(-4, 4), y: this.tip.y + 6, vy: 1, g: 0.15, life: 30, col: P.pick(['#ff6a1a', '#ffb030']), size: 1, glow: 2 });
    this.sync();
  }
  // trompa: curva de Bézier desde la base hasta la punta, gruesa arriba y estrecha abajo, con anillos y grietas
  trunkPts() { const B = this.base, T = this.tip, C = { x: B.x + (T.x - B.x) * 0.2, y: Math.max(B.y, T.y) + 30 }, pts = []; for (let i = 0; i <= 22; i++) { const t = i / 22, u = 1 - t; pts.push({ x: u * u * B.x + 2 * u * t * C.x + t * t * T.x, y: u * u * B.y + 2 * u * t * C.y + t * t * T.y, w: 22 - t * 12 }); } return pts; }
  drawBack(c, cx, cy) {
    if (this.dead) return;
    const B = this.base, x = Math.round(this.cxW - 160 - cx), y = Math.round(this.floorY - 200 + 6 + this.rise + Math.sin(this.t * 0.03) * 2 - cy), dA = this.state === 'death' ? Math.max(0.2, 1 - this.st / 160) : 1;
    c.globalAlpha = dA;
    P.drawGlow(c, x + 160, y + 100, 140, '#ff3a1a', 0.12 + (this.vulnerable ? 0.08 : 0));
    P.spr(c, 'mg_body', 0, x, y, { flash: this.flash > 0 && this.mood === 'hurt' });
    // grietas que laten
    const k = (Math.sin(this.t * 0.06) + 1) / 2; for (const [gx, gy] of [[60, 100], [250, 90], [115, 160], [205, 165], [160, 120], [100, 70], [220, 70]]) P.drawGlow(c, x + gx, y + gy, 12 + k * 6, '#ff6a1a', 0.15 + k * 0.15);
    // tres ojos: el color transmite su estado
    const col = this.mood === 'angry' ? '#ffd166' : this.mood === 'pain' ? '#ff9a9a' : this.mood === 'hurt' ? '#ffffff' : '#ff3a1a';
    if (this.blink <= 0 && this.eyes > 0) for (const [ex, ey] of [[160, 58], [138, 78], [182, 78]]) { c.fillStyle = col; c.globalAlpha = dA * this.eyes; c.fillRect(x + ex - 3, y + ey - 3, 6, 6); c.fillStyle = '#ffffff'; c.fillRect(x + ex - 1, y + ey - 2, 2, 2); P.drawGlow(c, x + ex, y + ey, 12, col, 0.5 * this.eyes); c.globalAlpha = dA; }
    // cresta de fuego en la frente
    if (!this.dying || this.st < 100) for (let i = 0; i < 2; i++) this.L.parts.add({ x: this.cxW + P.rand(-6, 6), y: y + cy + 14, vy: -P.rand(0.6, 1.6), vx: P.rand(-0.3, 0.3), life: 28, col: P.pick(['#ff6a1a', '#ffb030', '#fff0a0']), size: P.pick([1, 2]), glow: 3 });
    P.drawGlow(c, x + 160, y + 18, 16, '#ffb030', 0.5);
    c.globalAlpha = 1;
  }
  draw(c, cx, cy) {
    const fy = this.floorY;
    for (const m of this.marks) { c.globalAlpha = 0.4 + Math.sin(m.t * 0.5) * 0.3; c.fillStyle = m.slam ? '#ffd166' : '#ff6a1a'; c.fillRect(m.x - cx - (m.slam ? 14 : 8), fy - cy - 2, m.slam ? 28 : 16, 2); c.globalAlpha = 1; if (m.erupt && m.t > 50 && m.t < 90) { const g = c.createLinearGradient(0, fy - cy - 80, 0, fy - cy); g.addColorStop(0, 'rgba(255,240,160,0)'); g.addColorStop(1, 'rgba(255,100,20,0.85)'); c.fillStyle = g; c.fillRect(m.x - cx - 6, fy - cy - 80, 12, 80); } }
    for (const r of this.rocks) { c.globalAlpha = 0.4 + Math.sin(r.t * 0.5) * 0.3; c.fillStyle = '#ff6a1a'; c.fillRect(r.x - cx - 6, fy - cy - 2, 12, 2); c.globalAlpha = 1; }
    if (this.dead) return;
    const pts = this.trunkPts(), vul = this.vulnerable, k = (Math.sin(this.t * 0.25) + 1) / 2, B = this.flash > 0 ? ['#ffffff', '#ffffff', '#ffffff', '#ffffff'] : P.MGC.body;
    // cuerpo de la trompa
    // contorno iluminado por la lava (silueta legible sobre el fondo oscuro), cuerpo de obsidiana y núcleo de magma
    const rim = this.flash > 0 ? '#ffffff' : vul ? (k > 0.5 ? '#ffb030' : '#ff6a1a') : '#a8320c';
    for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; P.arcSeg(c, a.x - cx, a.y - cy, b.x - cx, b.y - cy, a.w + 2, b.w + 2, rim, rim, rim); }
    for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; P.arcSeg(c, a.x - cx, a.y - cy, b.x - cx, b.y - cy, a.w, b.w, this.flash > 0 ? '#ffffff' : '#3a2c30', '#6a5458', B[0]); }
    const core = vul ? (k > 0.5 ? '#fff0a0' : '#ffb030') : '#d0400e';
    for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; P.arcSeg(c, a.x - cx, a.y - cy, b.x - cx, b.y - cy, 2, 2, core, core, core); }
    P.drawGlow(c, pts[11].x - cx, pts[11].y - cy, 30, '#ff6a1a', vul ? 0.3 : 0.12);
    // anillos, grietas y magma que corre por dentro (brillan mucho cuando es vulnerable)
    for (let i = 1; i < pts.length - 1; i += 2) { const a = pts[i]; c.fillStyle = B[3]; c.fillRect(Math.round(a.x - a.w / 2 - cx), Math.round(a.y - cy), Math.round(a.w), 1); if (i % 4 === 1) { c.fillStyle = vul ? (k > 0.5 ? '#fff0a0' : '#ffb030') : '#d0300a'; c.fillRect(Math.round(a.x - 2 - cx), Math.round(a.y - 3 - cy), 4, 4); if (vul) P.drawGlow(c, a.x - cx, a.y - cy, 10, '#ffb030', 0.5); } }
    const T = pts[pts.length - 1]; c.fillStyle = B[1]; c.fillRect(Math.round(T.x - 7 - cx), Math.round(T.y - 3 - cy), 14, 7); c.fillStyle = '#ff6a1a'; c.fillRect(Math.round(T.x - 4 - cx), Math.round(T.y + 2 - cy), 3, 2); c.fillRect(Math.round(T.x + 1 - cx), Math.round(T.y + 2 - cy), 3, 2);
    if (vul) { P.drawGlow(c, T.x - cx, fy - 20 - cy, 34, '#ffb030', 0.25 + k * 0.25); if (this.t % 20 < 10) P.txt(c, '▼', T.x - cx - 2, fy - 64 - cy, '#ffd166'); }
  }
};
P.BOSS_CLASS = P.BOSS_CLASS || {}; P.BOSS_CLASS.magnarok = P.Magnarok;
