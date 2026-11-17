'use strict';
// THALZOR — Pulpo Eléctrico Gigante (jefe de THALASSYR). Emerge del agua entre islotes. Tres fases.
// Manto según la referencia: gran cabeza redonda inclinada, brillo turquesa arriba, un ojo verde incandescente
P.TZC = { edge: '#06143a', dark: '#0e2c6a', body: '#1a56a0', mid: '#2a8ab8', light: '#4ac8c8', glow: '#86ffcc', hi: '#d8fff0', suck: '#bfffe0' };
P.Sprites.thalzorHead = function (p, f, cr) {
  const C = P.TZC, cx = 66, cy = 36, rx = 38, ry = 32;
  // manto: sombreado con luz desde arriba a la izquierda, borde oscuro abajo a la derecha
  for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
    const dx = (x - cx) / rx, dy = (y - cy) / ry, r2 = dx * dx + dy * dy; if (r2 > 1) continue;
    const l = -(dx * -0.45 + dy * -0.85) * 0.75 + Math.sqrt(1 - r2) * 0.5;
    let col = l < -0.05 ? C.edge : l < 0.18 ? C.dark : l < 0.42 ? C.body : l < 0.64 ? C.mid : l < 0.8 ? C.light : C.glow;
    if (((x * 7 + y * 13) % 11) === 0 && l > 0.2) col = l > 0.6 ? C.hi : C.light;
    p.px(x, y, col);
  }
  // gran halo luminoso en lo alto del manto
  for (let y = 0; y < 18; y++) for (let x = 0; x < 26; x++) { const dx = (x - 13) / 13, dy = (y - 9) / 9; if (dx * dx + dy * dy < 1) p.dith(cx - 4 + x - 13, cy - 16 + y - 9, C.light, dx * dx + dy * dy < 0.4 ? C.hi : C.glow, 1 - (dx * dx + dy * dy)); }
  // cuello que baja hacia la base de los brazos
  p.sell(54, 70, 19, 21, [C.edge, C.dark, C.body, C.mid]); p.sell(50, 66, 11, 13, [C.dark, C.body, C.mid, C.light]); for (let y = 54; y < 88; y += 5) p.px(46 + (y % 3), y, C.hi);
  // ojo verde incandescente (lateral)
  const ex = 36, ey = 54;
  p.ell(ex, ey, 9, 7, C.edge); p.ell(ex, ey, 7.5, 6, f === 3 ? '#2a5a4a' : '#1aa060');
  if (f === 3) { p.line(ex - 5, ey, ex + 5, ey, '#0a2a20'); }
  else { p.ell(ex, ey, 5.5, 4.5, f === 2 ? '#d8ffd0' : '#4aff8a'); p.ell(ex, ey, 3.5, 3, '#c8ffd8'); p.ell(ex - 1, ey - 1, 1.6, 1.4, '#ffffff'); }
  for (let k = 0; k < 4; k++) p.line(ex + 9 + k * 2, ey - 6 + k, ex + 14 + k * 3, ey - 9 + k * 2, C.dark);
  // sifón (abierto al escupir tinta)
  p.ell(70, 76, f === 1 ? 5 : 3, f === 1 ? 3.5 : 2.2, C.light); p.ell(70, 76, f === 1 ? 3.5 : 1.8, f === 1 ? 2.4 : 1.2, C.edge);
  // implante de Thersek, discreto en la nuca
  p.rect(88, 20, 12, 6, '#2e3346'); p.rect(88, 20, 12, 1, '#8a98bc'); p.px(94, 22, '#ff3050'); p.line(92, 26, 98, 36, '#4e5872');
  // carga eléctrica: arcos verdes sobre el contorno
  if (f === 2) for (let k = 0; k < 18; k++) { const a = k * 0.35 + 0.2, rr = 1.04 + (k % 3) * 0.04; p.px(cx + Math.cos(a) * rx * rr, cy + Math.sin(a) * ry * rr, k % 2 ? '#ffffff' : C.glow); }
  // núcleo sobrecargado que brilla a través de la piel
  if (f === 3) { for (let k = 0; k < 7; k++) { const a = k * 0.9; p.line(cx + 6, cy, cx + 6 + Math.cos(a) * 22, cy + Math.sin(a) * 18, '#ffb030'); } p.sell(cx + 6, cy, 8, 7, ['#a05a0a', '#ffb030', '#fff0a0', '#ffffff']); }
  if (cr) { const K = '#020818'; p.line(cx - 20, cy - 10, cx - 6, cy + 4, K); p.line(cx - 6, cy + 4, cx - 12, cy + 20, K); p.line(cx + 14, cy - 22, cx + 24, cy - 6, K); p.line(cx + 24, cy - 6, cx + 16, cy + 8, K); p.px(cx - 8, cy + 2, C.glow); p.px(cx + 22, cy - 8, C.glow); }
};
// tentáculo procedural (se dibuja cada fotograma): grueso en la base, enroscado en la punta, con hilera de ventosas
P.tzArm = function (c, x0, y0, ang, len, curl, t, ph, sc, glow) {
  const C = P.TZC, pts = [], n = Math.max(6, Math.round(len / 3)); let x = x0, y = y0, a = ang;
  for (let i = 0; i < n; i++) { const k = i / n; a += Math.sin(t * 0.045 + ph + k * 4) * 0.05 + curl * k * k * 0.42; x += Math.cos(a) * 3; y += Math.sin(a) * 3; pts.push([x, y, Math.max(1, (6.5 - 5.2 * k) * sc), a]); }
  for (let i = pts.length - 1; i >= 0; i--) { const [px, py, r] = pts[i], R = Math.round(r); c.fillStyle = C.edge; c.fillRect(Math.round(px - R - 1), Math.round(py - R - 1), R * 2 + 2, R * 2 + 2); }
  for (let i = pts.length - 1; i >= 0; i--) {
    const [px, py, r, aa] = pts[i], R = Math.round(r), X = Math.round(px - R), Y = Math.round(py - R);
    c.fillStyle = i % 4 < 2 ? C.body : C.mid; c.fillRect(X, Y, R * 2, R * 2);
    c.fillStyle = C.light; c.fillRect(X, Y, Math.max(1, R), Math.max(1, Math.round(R * 0.7)));
    if (i % 2 === 0 && R > 1) { const sx = Math.round(px + Math.cos(aa + Math.PI / 2 * Math.sign(curl || 1)) * r * 0.9), sy = Math.round(py + Math.sin(aa + Math.PI / 2 * Math.sign(curl || 1)) * r * 0.9); c.fillStyle = C.edge; c.fillRect(sx - 1, sy - 1, 3, 3); c.fillStyle = C.suck; c.fillRect(sx - 1, sy - 1, 2, 2); }
  }
  if (glow) { const [px, py] = pts[pts.length - 1]; c.fillStyle = C.glow; c.fillRect(Math.round(px), Math.round(py), 1, 1); }
  return pts;
};
P.Sprites.buildThalzor = function () {
  const O = { up: 0.06, down: 0.1, dark: 0.55 };
  P.mk('tz_head', 110, 92, 4, (p, f) => P.Sprites.thalzorHead(p, f, false), O);
  P.mk('tz_head_c', 110, 92, 4, (p, f) => P.Sprites.thalzorHead(p, f, true), O);
  P.mk('tz_seg', 16, 16, 2, (p, f) => { p.sell(8, 8, 7, 7, ['#06143a', '#1a56a0', '#2a8ab8', '#4ac8c8']); p.ell(10, 9, 2.2, 2, f ? '#bfffe0' : '#4ac8c8'); }, O);
  P.mk('tz_tip', 18, 22, 2, (p, f) => { p.tri(2, 22, 16, 22, 9 + (f ? 2 : -2), 0, '#1a56a0'); p.tri(2, 22, 9, 22, 9 + (f ? 2 : -2), 0, '#4ac8c8'); }, O);
  // retrato del Archivo: cabeza y brazos enroscados (pintado una vez)
  const cv = document.createElement('canvas'); cv.width = 120; cv.height = 110; const x = cv.getContext('2d');
  for (let k = 0; k < 8; k++) P.tzArm(x, 52 + (k - 3.5) * 4, 66, Math.PI / 2 + (k - 3.5) * 0.36, 50 + (k % 3) * 10, k < 4 ? -1 : 1, 40, k * 1.3, 0.85, true);
  P.spr(x, 'tz_head', 0, 6, -4);
  P.mkCanvas('thalzor', [cv]);
};

P.THALZOR_ARENA = ['#............................#', '#............................#', '#............................#', '#............................#', '#............................#', '#............................#', '#............................#', '#............................#', '#............................#', '#............................#',
  '#....=====..........=====....#', '#............................#', '#............................#', '#..P.........................#', '#######~~~~~~####~~~~~~#######', '#######~~~~~~####~~~~~~#######', '#######~~~~~~####~~~~~~#######'];

P.Thalzor = class extends P.Enemy {
  constructor(L, x, floorY) {
    super(L, 205, floorY + 40, 70, 50, { kind: 'thalzor', hp: 1000, dmg: 16, xp: 300, beast: true, spr: 'tz_head', heavy: true });
    this.maxhp = this.hp = 1000; this.boss = true; this.floorY = floorY; this.face = -1; this.state = 'intro'; this.st = 0; this.phase = 1; this.cd = 60; this.active = false;
    this.name = 'THALZOR'; this.title = 'Pulpo Eléctrico Gigante'; this.hx = 240; this.hy = floorY + 90; this.tents = []; this.marks = []; this.over = 0; this.shockT = 0; this.lastAtk = '';
    this.sync();
  }
  sync() { this.x = this.hx - 35; this.y = this.hy - 30; }
  get under() { return this.hy > this.floorY + 10; }
  hit(d, o = {}) {
    if (this.dead || this.dying || !this.active || this.under) return;
    let m = 1, txt = null; if (this.over > 0) { m = 2; txt = '¡NÚCLEO SOBRECARGADO!'; }
    this.dmgBoss(d * m, o, this.hx, this.hy - 40, txt, m > 1);
  }
  dmgBoss(d, o, x, y, txt, big) {
    d = Math.max(1, Math.round(d)); this.hp -= d; this.flash = 6;
    this.L.popups.push({ x: x + P.rand(-6, 6), y, text: String(d), col: big ? '#ffd166' : '#ffffff', t: 0, big });
    if (txt && this.t - (this.txtT || -99) > 50) { this.txtT = this.t; this.L.popups.push({ x, y: y - 14, text: txt, col: '#ffd166', t: 0 }); }
    this.L.parts.burst(x, y + 20, 5, { col: '#b08aff', smin: 0.5, smax: 2, lmin: 6, lmax: 14 }); P.Audio.sfx('ehit');
    if (o.poison) this.poisonT = 90;
    if (this.hp <= 0) return this.die();
    const f = this.hp / this.maxhp; if (this.phase === 1 && f < 0.66) this.toPhase(2); else if (this.phase === 2 && f < 0.33) this.toPhase(3);
  }
  toPhase(n) { this.phase = n; this.state = 'roar'; this.st = 0; if (n === 3) this.spr = 'tz_head_c'; for (const t of this.tents) t.st = Math.max(t.st, t.up + t.hold); this.L.popups.push({ x: this.hx, y: this.hy - 70, text: n === 2 ? '¡THALZOR ELECTRIFICA EL MAR!' : '¡SU IMPLANTE SE AGRIETA!', col: '#ff8ad8', t: 0, big: true }); }
  die() { if (this.dying) return; this.dying = true; this.hp = 0; this.state = 'death'; this.st = 0; this.isEnemy = false; this.untouchable = true; this.shockT = 0; P.State.task('thalzor', 'defeat'); P.State.data.stats.kills++; P.Audio.sfx('roar'); this.L.player.iframes = 400; for (const e of this.L.ents) if (e.isEnemy && e !== this && !e.dead) e.die(); }
  pick() {
    const ph = this.phase, opts = ph === 1 ? ['slam', 'slam', 'ink'] : ph === 2 ? ['slam', 'ink', 'shock', 'slam'] : ['slam', 'shock', 'dive', 'ink', 'sweep'];
    let a = P.pick(opts); if (a === this.lastAtk && Math.random() < 0.7) a = P.pick(opts); this.lastAtk = a; this.state = a; this.st = 0;
  }
  // un tentáculo: aviso de ondas, sube, se queda (se le puede golpear) y se retira
  tentacle(x, o = {}) { this.tents.push(Object.assign({ x, st: 0, tele: 40, up: 14, hold: 70, h: 0, maxH: 150, sweep: 0, hp: 1 }, o)); }
  update() {
    const L = this.L, p = L.player, fy = this.floorY, ph = this.phase, spd = ph === 3 ? 1.3 : 1;
    this.t++; if (this.flash > 0) this.flash--; if (this.over > 0) this.over--; this.st++;
    if (this.poisonT > 0) { this.poisonT--; if (this.poisonT % 30 === 0 && this.active) this.dmgBoss(2, {}, this.hx, this.hy - 30, null); }
    if (!this.seen && !this.under) { this.seen = true; P.State.see('thalzor'); }
    const rest = fy - 70 + Math.sin(this.t * 0.03) * 4;
    switch (this.state) {
      case 'intro': break;
      case 'roar': this.hy += (rest - this.hy) * 0.05; if (this.st === 40) { P.Audio.sfx('roar'); P.shake(6, 40); } if (this.st > 90) { this.state = 'idle'; this.cd = 30; } break;
      case 'idle': this.hy += (rest - this.hy) * 0.05; this.hx += (240 + Math.sin(this.t * 0.01) * 30 - this.hx) * 0.02; if (--this.cd <= 0) this.pick(); break;
      case 'slam': this.hy += (rest - this.hy) * 0.05;
        if (this.st === 1) { const n = ph === 1 ? 1 : ph === 2 ? 2 : 3; for (let i = 0; i < n; i++) this.tentacle(P.clamp(p.cx + (i - (n - 1) / 2) * 70, 30, 450), { tele: 40 - i * 4 + (i * 10) }); }
        if (this.st > 140) { this.state = 'idle'; this.cd = 40 / spd; } break;
      case 'sweep': if (this.st === 1) { this.tentacle(this.hx < 240 ? 470 : 10, { sweep: this.hx < 240 ? -1 : 1, maxH: 26, hold: 120, tele: 50 }); P.toast('¡Barrido! Salta o sube a las cornisas', { col: P.UIC.red, life: 90 }); } if (this.st > 200) { this.state = 'idle'; this.cd = 40; } break;
      case 'ink': this.hy += (rest - 6 - this.hy) * 0.05; if (this.st % 26 === 0 && this.st <= 26 * (ph + 1)) { P.Audio.sfx('splash'); for (let i = 0; i < 3 + ph; i++) { const vx = P.clamp((p.cx - this.hx) / 60, -3.4, 3.4) + (i - (2 + ph) / 2) * 0.9; L.add(new P.Proj(L, this.hx, this.hy + 20, vx, -4 - Math.random(), { dmg: 11, spr: 'b_orb', grav: 0.15, life: 180, w: 8, h: 8, glow: '#ff7a9a' })); } } if (this.st > 26 * (ph + 1) + 30) { this.state = 'idle'; this.cd = 40 / spd; } break;
      case 'shock':
        // carga, electrifica el agua y lanza rayos marcados; después su núcleo queda expuesto
        this.hy += (rest - 20 - this.hy) * 0.05;
        if (this.st === 1) { P.Audio.sfx('charge'); P.toast('¡El agua se electrifica! Quédate en tierra', { col: P.UIC.gold, life: 100 }); }
        if (this.st === 50) { this.shockT = 100; P.Audio.sfx('laser'); P.shake(5, 40); }
        if (this.st > 50 && this.st < 150 && this.st % 20 === 0) this.marks.push({ x: P.clamp(p.cx + P.rand(-90, 90), 30, 450), t: 0 });
        if (this.st > 160) { this.state = 'over'; this.st = 0; this.over = ph === 3 ? 90 : 120; P.toast('¡Núcleo sobrecargado! Dispárale', { col: P.UIC.gold, life: 100 }); }
        break;
      case 'over': this.hy += (fy - 14 - this.hy) * 0.08; if (this.over <= 0) { this.state = 'idle'; this.cd = 30; } break;
      case 'dive': if (this.st < 40) this.hy += 3; else if (this.st === 40) { this.hx = p.cx < 240 ? 380 : 100; } else { this.hy += (rest - this.hy) * 0.08; if (this.st === 60) { this.tentacle(P.clamp(p.cx, 30, 450), { tele: 24 }); } if (this.st > 110) { this.state = 'idle'; this.cd = 20; } } break;
      case 'death': this.hy += 0.4; if (this.st % 6 === 0) { P.Audio.sfx('explode'); L.parts.burst(this.hx + P.rand(-40, 40), this.hy + P.rand(-30, 20), 10, { col: P.pick(['#b08aff', '#5af0ff', '#ffffff', '#ff7a9a']), smin: 1, smax: 4, lmin: 20, lmax: 40, glow: 4 }); } if (this.st === 150) { P.Audio.sfx('bigexplode'); P.shake(12, 40); this.dead = true; this.tents = []; P.drop(L, this.hx, this.hy - 30, { xp: 300, crys: 6, bio: 10 }); L.onBossDefeated(this); } break;
    }
    // tentáculos
    for (const t of this.tents) {
      t.st++;
      if (t.st < t.tele) { if (t.st % 6 === 0) L.parts.add({ x: t.x + P.rand(-12, 12), y: fy - 2, vy: -P.rand(0.5, 1.8), life: 18, col: '#bff6ff', size: 2 }); continue; }
      const k = t.st - t.tele;
      if (k < t.up) t.h = t.maxH * k / t.up; else if (k < t.up + t.hold) t.h = t.maxH; else t.h = Math.max(0, t.maxH * (1 - (k - t.up - t.hold) / 16));
      if (t.sweep && k >= t.up) t.x += t.sweep * 3.2;
      if (k === 1) { P.Audio.sfx('explode'); P.shake(4, 10); L.parts.burst(t.x, fy, 14, { col: '#d8fffa', smin: 1, smax: 4, g: 0.2, size: 2 }); }
      const box = t.sweep ? { x: t.x - 18, y: fy - t.h - 6, w: 36, h: t.h + 6 } : { x: t.x - 9, y: fy - t.h, w: 18, h: t.h };
      if (!p.dead && !this.dying && t.h > 6 && P.overlap(box, p)) p.hurt(15, t.x);
      t.box = box; t.done = k > t.up + t.hold + 16;
    }
    this.tents = this.tents.filter(t => !t.done);
    // agua electrificada
    if (this.shockT > 0) { this.shockT--; if (p.inLiq && !p.dead && this.shockT % 25 === 0) p.hurt(12, p.cx, { env: true, noKnock: true }); }
    for (const m of this.marks) { m.t++; if (m.t === 30) { P.Audio.sfx('laser'); const bx = { x: m.x - 8, y: 0, w: 16, h: fy }; if (!p.dead && P.overlap(bx, p)) p.hurt(14, m.x); m.bolt = 10; } if (m.bolt) m.bolt--; }
    this.marks = this.marks.filter(m => m.t < 42);
    this.sync();
    if (this.active && !this.dying && !this.under && this.state !== 'over' && !p.dead && P.overlap({ x: this.hx - 30, y: this.hy - 30, w: 60, h: 50 }, p)) p.hurt(this.dmg, this.hx);
  }
  // los tentáculos también reciben disparos (daño reducido)
  get hitBoxes() { return this.tents.filter(t => t.h > 10).map(t => t.box); }
  draw(c, cx, cy) {
    const L = this.L, fy = this.floorY, s = P.S[this.spr];
    // agua electrificada: chispas sobre las teselas de agua
    if (this.shockT > 0) for (let ty = 13; ty < L.rows; ty++) for (let tx = 0; tx < L.cols; tx++) if (L.tile(tx, ty) === '~' && L.tile(tx, ty - 1) !== '~' && (tx + this.t) % 3 === 0) { c.strokeStyle = this.t % 4 < 2 ? '#ffffff' : '#5af0ff'; c.beginPath(); c.moveTo(tx * 16 - cx, ty * 16 + 3 - cy); c.lineTo(tx * 16 + 6 - cx, ty * 16 + 1 + P.rand(-2, 2) - cy); c.lineTo(tx * 16 + 12 - cx, ty * 16 + 4 - cy); c.stroke(); P.drawGlow(c, tx * 16 + 8 - cx, ty * 16 + 4 - cy, 8, '#5af0ff', 0.4); }
    // rayos marcados
    for (const m of this.marks) { if (m.bolt) { c.strokeStyle = '#ffffff'; c.lineWidth = 2; c.beginPath(); let y = 0, x = m.x - cx; c.moveTo(x, 0); while (y < fy - cy) { y += 14; x = m.x - cx + P.rand(-6, 6); c.lineTo(x, y); } c.stroke(); c.lineWidth = 1; P.drawGlow(c, m.x - cx, fy - cy, 20, '#5af0ff', 0.8); } else { c.globalAlpha = 0.4 + Math.sin(m.t * 0.6) * 0.3; c.fillStyle = '#5af0ff'; c.fillRect(m.x - cx - 7, fy - cy - 2, 14, 2); c.globalAlpha = 1; } }
    // cabeza (recortada por la superficie del agua)
    if (this.hy - 60 < fy) {
      c.save(); c.beginPath(); c.rect(0, 0, P.W, fy - cy + 6); c.clip();
      P.drawGlow(c, this.hx - cx, this.hy - cy, 60, this.over > 0 ? '#ffd166' : '#7a5aff', 0.25);
      const fr = this.over > 0 ? 3 : this.state === 'shock' && this.st < 50 ? 2 : this.state === 'ink' ? 1 : 0;
      const sh = this.state === 'death' ? P.rand(-2, 2) : 0, bx = this.hx - 12 - cx + sh, by = this.hy + 22 - cy, fade = this.state === 'death' ? Math.max(0, 1 - (this.st - 110) / 40) : 1;
      if (fade < 1) c.globalAlpha = fade;
      // brazos traseros (se abren hacia los lados y se enroscan)
      for (let k = 0; k < 4; k++) P.tzArm(c, bx + (k - 1.5) * 6, by - 4, k < 2 ? Math.PI - 0.5 - k * 0.5 : 0.5 + (k - 2) * 0.5, 70 + k * 6, k < 2 ? 1 : -1, this.t, k * 1.7, 1, true);
      P.spr(c, this.spr, fr, Math.round(this.hx - 66 - cx + sh), Math.round(this.hy - 62 - cy), { flash: this.flash > 0 || (this.state === 'death' && this.st % 8 < 3) });
      // brazos delanteros que cuelgan y se rizan sobre el agua
      for (let k = 0; k < 5; k++) P.tzArm(c, bx + (k - 2) * 7, by, Math.PI / 2 + (k - 2) * 0.42, 58 + (k % 3) * 12, k < 2 ? -1 : 1, this.t, k * 2.3 + 1, 1.05, true);
      // filamentos eléctricos alrededor (más intensos al cargar)
      const charge = this.state === 'shock' || this.shockT > 0 ? 1 : 0.25;
      if (Math.random() < charge) { c.strokeStyle = Math.random() < 0.5 ? '#86ffcc' : '#ffffff'; c.beginPath(); let lx = this.hx + P.rand(-60, 60) - cx, ly = this.hy + P.rand(-40, 30) - cy; c.moveTo(lx, ly); for (let i = 0; i < 4; i++) { lx += P.rand(-8, 8); ly += P.rand(-6, 10); c.lineTo(lx, ly); } c.stroke(); }
      c.globalAlpha = 1;
      c.restore();
      if (this.over > 0 && this.t % 20 < 10) P.txt(c, '▼', this.hx - cx - 2, this.hy - 66 - cy, '#ffd166');
    }
    for (const t of this.tents) {
      if (t.h <= 0) { c.fillStyle = 'rgba(200,255,250,' + (0.3 + Math.sin(t.st * 0.5) * 0.2) + ')'; c.beginPath(); c.ellipse(t.x - cx, fy - cy, 10 + t.st * 0.2, 3, 0, 0, 7); c.fill(); continue; }
      // tentáculo de ataque: sale del agua y se enrosca en la punta; el barrido avanza tumbado sobre la superficie
      if (t.sweep) { P.tzArm(c, t.x - cx + t.sweep * 70, fy - cy + 2, t.sweep > 0 ? -Math.PI + 0.25 : -0.25, 84, t.sweep > 0 ? 1 : -1, this.t, 2, 1.25, true); continue; }
      P.tzArm(c, t.x - cx, fy - cy + 4, -Math.PI / 2 + Math.sin(this.t * 0.05 + t.x) * 0.06, t.h + 12, t.x % 2 ? 1 : -1, this.t, t.x * 0.1, 1.35, true);
      c.fillStyle = 'rgba(220,255,250,0.7)'; c.beginPath(); c.ellipse(t.x - cx, fy - cy + 1, 14, 3, 0, 0, 7); c.fill();
    }
  }
};
// los disparos que tocan un tentáculo dañan a THALZOR a la mitad
(function () {
  const base = P.Proj.prototype.update;
  P.Proj.prototype.update = function () {
    base.call(this);
    if (this.dead || this.owner !== 'p') return;
    const b = this.L.boss; if (!b || !(b instanceof P.Thalzor) || !b.active || b.dying) return;
    for (const box of b.hitBoxes) if (P.overlap(this, box) && !this.hits.includes(box)) { this.hits.push(box); b.dmgBoss(this.dmg * 0.5, {}, this.cx, this.cy - 10, null); if (this.pierce-- <= 0) { this.kill(true); return; } }
  };
})();
P.BOSS_CLASS = P.BOSS_CLASS || {}; P.BOSS_CLASS.thalzor = P.Thalzor;
P.ARENAS = P.ARENAS || {}; P.ARENAS.thalzor = P.THALZOR_ARENA;
