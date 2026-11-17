'use strict';
// AZHYRION — el Dragón de las Nubes, jefe final de AERTHYON.
// Una cabeza de dragón celestial flotante y UNA sola cola de tormenta (viento, nubes, filamentos eléctricos, remolinos y
// relámpagos). Sin alas, sin patas, sin cuerpo. Vive detrás del escenario; sus ataques alcanzan el plano de juego.
// Ciclo: concentra energía (cuernos y ojos se encienden, la cola se agita) → ataca → pierde energía y baja la cabeza al
// suelo (vulnerable: la frente brilla) → se eleva. Solo la cabeza recibe daño, y solo mientras está abajo.
P.AZC = { S: ['#07071c', '#0e0e34', '#181854', '#24247a', '#3434a4', '#4a5ad0'], M: ['#1a0838', '#34106a', '#5a1a9a', '#8a3ac8', '#b878f0', '#e0c0ff'],
  H: ['#5a6080', '#8a90b0', '#c8cce4', '#f0f2fc'], G: ['#8a6a1a', '#c8a03a', '#ffd166', '#fff4c0'], MO: ['#2a0414', '#6a0a2e', '#b02456', '#e06a8a'], E: ['#2a6aff', '#5ae0ff', '#bff6ff', '#ffffff'] };
P.AZ_OY = 60;
P.Sprites.buildAzhyrion = function () {
  const Z = P.AZC, S = Z.S, M = Z.M;
  // cabeza (mirando a la izquierda), redibujada para que se lea como dragón de un vistazo: silueta de cráneo en polígono
  // con planos de luz (arriba claro, abajo oscuro), hocico corto y profundo con la nariz levantada, ceja marcada sobre el
  // ojo, púas en las mejillas, mandíbula con colmillos, dos cuernos barridos hacia atrás, cresta y melena que enmarcan
  P.mk('az_head', 250, 240, 3, (P0, fr) => {
    const OY = P.AZ_OY, W = 250, H = 240, B4 = P.BAYER4, open = [0.05, 0.22, 0.44][fr];
    const p = { px: (x, y, c) => P0.px(x, y + OY, c), rect: (x, y, w, h, c) => P0.rect(x, y + OY, w, h, c), tri: (a, b, c1, d, e, f, col) => P0.tri(a, b + OY, c1, d + OY, e, f + OY, col), ell: (x, y, rx, ry, c) => P0.ell(x, y + OY, rx, ry, c), thick: (x0, y0, x1, y1, w, c) => P0.thick(x0, y0 + OY, x1, y1 + OY, w, c), line: (x0, y0, x1, y1, c) => P0.line(x0, y0 + OY, x1, y1 + OY, c) };
    // relleno de polígono por líneas con sombreado por columnas (t = 0 arriba, 1 abajo)
    const poly = (pts, shade) => { const ys = pts.map(q => q[1]), y0 = Math.floor(Math.min(...ys)), y1 = Math.ceil(Math.max(...ys)), mask = [];
      for (let y = y0; y <= y1; y++) { const xs = []; for (let i = 0; i < pts.length; i++) { const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length]; if ((ay <= y + 0.5 && by > y + 0.5) || (by <= y + 0.5 && ay > y + 0.5)) xs.push(ax + (y + 0.5 - ay) / (by - ay) * (bx - ax)); } xs.sort((a, b) => a - b); for (let i = 0; i + 1 < xs.length; i += 2) for (let x = Math.round(xs[i]); x < Math.round(xs[i + 1]); x++) mask.push([x, y]); }
      const top = {}, bot = {}; for (const [x, y] of mask) { if (top[x] == null || y < top[x]) top[x] = y; if (bot[x] == null || y > bot[x]) bot[x] = y; }
      for (const [x, y] of mask) { const t = (y - top[x]) / Math.max(3, bot[x] - top[x]); p.px(x, y, shade(t + (B4[(y + OY) & 3][x & 3] / 16 - 0.5) * 0.16, x, y)); } return { top, bot }; };
    const S = Z.S, M = Z.M, sk = (t, x) => { const back = x > 168 ? 1 : 0; return t < 0.1 ? S[5 - back] : t < 0.34 ? S[4 - back] : t < 0.6 ? S[3 - back] : t < 0.84 ? S[2] : S[1]; };
    // 1 · melena en llamaradas detrás de la cabeza (enmarca la silueta)
    for (let k = 0; k < 22; k++) { const oy = 58 + k * 3.4, ox = 184 + Math.sin(k * 0.7) * 6; let x = ox, y = oy, a = -0.55 + k * 0.05 + Math.sin(k * 1.9) * 0.12; const l = 30 + (k % 4) * 9 + (k > 6 && k < 16 ? 14 : 0);
      for (let j = 0; j < l; j++) { a += Math.sin(j * 0.1 + k) * 0.03; x += Math.cos(a) * 1.4; y += Math.sin(a) * 1.4; const w = Math.max(1, (1 - j / l) * 6), col = M[Math.min(5, 1 + Math.floor(j / l * 4.5))]; p.rect(Math.round(x - w / 2), Math.round(y - w / 2), Math.round(w), Math.round(w), col); } }
    // 2 · cuerno lejano (más oscuro) y púas de las mejillas
    const horn = (x0, y0, len, w0, turn, a0, dark) => { let x = x0, y = y0, a = a0; const pts = []; for (let k = 0; k < len; k++) { a += turn; x += Math.cos(a) * 1.6; y += Math.sin(a) * 1.6; pts.push([x, y, a, k / len]); } const base = t => t > 0.8 ? Z.G[2] : Z.H[dark ? 1 : 2], lite = t => t > 0.8 ? Z.G[3] : Z.H[3], shad = t => t > 0.8 ? Z.G[1] : Z.H[dark ? 0 : 1]; for (const [x1, y1, a1, t] of pts) { const w = Math.max(1.5, w0 * Math.pow(1 - t, 0.8) + 0.8); p.ell(x1, y1, w / 2, w / 2, base(t)); } for (const [x1, y1, a1, t] of pts) { const w = Math.max(1.5, w0 * Math.pow(1 - t, 0.8) + 0.8), nx = -Math.sin(a1), ny = Math.cos(a1); p.px(Math.round(x1 - nx * (w / 2 - 1)), Math.round(y1 - ny * (w / 2 - 1)), lite(t)); p.px(Math.round(x1 + nx * (w / 2 - 1)), Math.round(y1 + ny * (w / 2 - 1)), shad(t)); } pts.forEach(([x1, y1, a1, t], k) => { if (k % 11 === 6 && t < 0.78) { const w = w0 * Math.pow(1 - t, 0.8), nx = -Math.sin(a1), ny = Math.cos(a1); for (let j = -w / 2 + 1; j < w / 2 - 1; j++) p.px(Math.round(x1 + nx * j), Math.round(y1 + ny * j), shad(t)); } }); };
    horn(164, 60, 72, 11, 0.033, -1.15, true);
    for (const [ax, ay, bx, by, tx, ty, col] of [[150, 100, 162, 108, 206, 96, S[3]], [156, 110, 166, 118, 210, 118, S[2]], [148, 116, 156, 124, 192, 136, S[2]]]) { p.tri(ax, ay, bx, by, tx, ty, col); p.line(ax, ay, tx, ty, S[5]); }
    p.tri(160, 106, 196, 100, 172, 116, '#2a4ac0'); p.tri(160, 112, 200, 118, 170, 120, Z.E[0]);
    // 3 · boca abierta (encías y lengua) y mandíbula inferior con colmillos
    const hx = 142, hy = 108, jl = 112, ca = Math.cos(open), sa = Math.sin(open), J = (u, v) => [hx - ca * u + sa * v, hy + sa * u + ca * v];
    if (open > 0.1) { const tip = J(jl - 4, 2); p.tri(26, 100, hx, hy, tip[0], tip[1], Z.MO[0]); p.tri(34, 102, hx - 4, hy + 1, tip[0] + 8, tip[1] - 2, Z.MO[1]); const tg = J(56, 2); p.ell(tg[0], tg[1] - 2, 22, 3, Z.MO[2]); p.ell(tg[0] - 6, tg[1] - 3, 12, 1.6, Z.MO[3]); }
    const jaw = []; for (let u = 0; u <= jl; u += 4) jaw.push(J(u, 0)); for (let u = jl; u >= 0; u -= 4) { const v = 15 - u * 0.075 + (u > 92 ? (u - 92) * 0.35 : 0); jaw.push(J(u, v)); }
    poly(jaw, t => t < 0.18 ? S[4] : t < 0.5 ? S[3] : t < 0.8 ? S[2] : S[1]);
    for (let u = 12; u < jl - 4; u += 8) { const [x, y] = J(u, 0), big = u === 20 || u === 76, l = big ? 7 : 4; p.tri(x - 2, y, x + 2, y, x - sa * l, y - ca * l, '#e8ecff'); }
    // 4 · cráneo: hocico corto y profundo, nariz levantada, frente alta
    const skull = [[188, 64], [170, 54], [142, 55], [124, 60], [112, 67], [100, 72], [84, 78], [60, 82], [42, 85], [34, 79], [26, 82], [20, 90], [22, 98], [40, 102], [80, 104], [118, 106], [144, 110], [162, 116], [182, 108], [194, 88]];
    poly(skull, sk);
    // 5 · detalles: cresta del hocico, fosa nasal, ceja, cuenca del ojo, escamas en media luna, filigrana dorada
    for (const x of [46, 58, 70, 82]) { const y = Math.round(82 - (x - 42) * 0.11 + (x < 50 ? 2 : 0)); p.rect(x, y + 2, 7, 2, S[5]); p.line(x, y + 4, x + 6, y + 4, S[1]); }
    p.ell(30, 88, 3.4, 2.2, S[0]); p.px(29, 87, '#5ae0ff'); p.line(26, 82, 34, 79, '#8ad4ff');
    p.thick(96, 77, 126, 65, 3, S[1]); p.line(96, 75, 126, 63, S[5]); p.line(126, 63, 134, 62, S[5]);
    p.ell(112, 82, 9, 4.6, S[0]); p.line(104, 86, 120, 87, S[1]);
    for (let yy = 66; yy < 104; yy += 9) for (let xx = 136 + ((yy / 9) % 2) * 6; xx < 184; xx += 12) { p.px(xx - 2, yy, S[1]); p.px(xx - 1, yy + 1, S[1]); p.px(xx, yy + 1, S[1]); p.px(xx + 1, yy + 1, S[1]); p.px(xx + 2, yy, S[1]); p.px(xx, yy - 1, S[4]); }
    for (let x = 64; x < 146; x++) { const y = Math.round(97 + (x - 64) * 0.08 + Math.sin(x * 0.18) * 1.4); if (x % 3) p.px(x, y, Z.G[2]); } p.px(146, 104, Z.G[3]); p.ell(146, 104, 2, 2, Z.G[2]);
    // 6 · dientes superiores (colmillos más grandes) sobre la boca
    for (let x = 28; x < 122; x += 7) { const big = x === 35 || x === 91, y = Math.round(101 + (x - 22) * 0.06); p.tri(x - 2, y, x + 2, y, x, y + (big ? 8 : 4), '#f4f6ff'); }
    // 7 · barba atmosférica bajo la mandíbula
    for (let k = 0; k < 8; k++) { const u = 26 + k * 10; let [x, y] = J(u, 12 - k * 0.6), a = 0.95 - k * 0.04; const l = 22 + k * 3;
      for (let j = 0; j < l; j++) { a -= 0.022; x += Math.cos(a) * 1.5; y += Math.sin(a) * 1.5; const w = Math.max(1, (1 - j / l) * 3.4), col = M[Math.min(5, 1 + Math.floor(j / l * 4) + (k % 2))]; p.rect(Math.round(x - w / 2), Math.round(y - w / 2), Math.round(w), Math.round(w), col); } }
    // 8 · cresta de púas y cuerno cercano (el más claro, en primer plano)
    for (let k = 0; k < 7; k++) { const bx = 138 + k * 8, by = 56 + Math.abs(k - 2) * 1.6, h = 14 + Math.sin(k * 1.7) * 4 + (k < 4 ? 6 : 0); p.tri(bx - 4, by + 3, bx + 4, by + 3, bx + 8 + k, by - h, M[2 + (k % 3)]); p.line(bx, by + 1, bx + 7 + k, by - h + 2, M[4]); }
    horn(144, 58, 90, 15, 0.027, -1.7, false);
    // 9 · abrazadera de Thersek en la frente
    p.rect(128, 64, 22, 6, '#3a4258'); p.rect(128, 64, 22, 1, '#7a86a4'); p.rect(136, 65, 3, 3, '#ff3050');
  });
  // bocanadas de la cola de tormenta (nubes con borde eléctrico)
  P.mk('az_puff', 52, 52, 6, (p, f) => { const rr = [5, 8, 11, 14, 18, 22][f]; P.paintCloud(p, 26, 26 + rr * 0.45, rr * 1.8, rr * 1.1, ['#ffffff', '#bfdcff', '#7a96e0', '#4a54a8', '#2a2a6a'], P.RNG(7200 + f), { lit: 'top', rim: '#bff6ff', flat: false }); }, { outline: false });
  // retrato del Archivo
  P.mk('azhyrion', 160, 100, 1, p => {}, { outline: false });
  { const s = P.S.azhyrion.f[0], x = s.getContext('2d'); x.fillStyle = '#5ae0ff'; for (let k = 0; k < 60; k++) { const a = k * 0.12; x.globalAlpha = 0.6; x.fillRect(110 + Math.cos(a) * (40 - k * 0.4), 40 + Math.sin(a) * (26 - k * 0.3), 4, 3); } x.globalAlpha = 1; x.drawImage(P.S.az_head.f[1], 0, 0, 250, 240, 4, -4, 104, 100); x.fillStyle = '#5ae0ff'; x.fillRect(58, 46, 4, 2); }
};
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildAzhyrion(); }; })();
P.ARENAS = P.ARENAS || {}; P.ARENAS.azhyrion = P.BOSS_ARENA.slice();

// Catmull-Rom: curva suave que pasa por los puntos de control
const azSpline = (K, n) => { const out = []; for (let i = 0; i < n; i++) { const u = i / (n - 1) * (K.length - 1), k = Math.min(K.length - 2, Math.floor(u)), t = u - k, p0 = K[Math.max(0, k - 1)], p1 = K[k], p2 = K[k + 1], p3 = K[Math.min(K.length - 1, k + 2)], t2 = t * t, t3 = t2 * t;
  out.push({ x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3), y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3) }); } return out; };
const azLine = (c, x0, y0, x1, y1, w) => { const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)))); for (let k = 0; k <= n; k++) c.fillRect(Math.round(x0 + (x1 - x0) * k / n), Math.round(y0 + (y1 - y0) * k / n), w, w); };

P.Azhyrion = class extends P.Enemy {
  constructor(L, x, floorY) {
    super(L, 240, floorY - 60, 40, 40, { kind: 'azhyrion', hp: 1600, dmg: 0, xp: 500, beast: true, spr: null, heavy: true });
    this.maxhp = this.hp = 1600; this.boss = true; this.harmless = true; this.dmg = 0; this.floorY = floorY; this.face = -1; this.state = 'intro'; this.st = 0; this.phase = 1; this.cd = 80; this.active = false;
    this.name = 'AZHYRION'; this.title = 'Dragón de las Nubes'; this.cxW = 240; this.home = { x: 318, y: 112 }; this.head = { x: 330, y: -120 };
    this.jaw = 0; this.glow = 0; this.amp = 1; this.lift = 0; this.blink = 0; this.look = 0; this.eyes = 1; this.mood = 'calm'; this.moodT = 0; this.storm = 0.1;
    this.hz = []; this.restDmg = 0; this.lastAtk = ''; this.combo = 0; this.dissolve = 0; this.clear = 0; this.tailPts = []; this.sync();
  }
  get vulnerable() { return this.state === 'rest' && !this.dying; }
  get spd() { return this.phase === 3 ? 1.35 : this.phase === 2 ? 1.15 : 1; }
  // colisión propia: solo la cabeza, y solo cuando está abajo
  sync() { const H = this.head; if (this.vulnerable) { this.x = H.x - 96; this.y = H.y - 40; this.w = 140; this.h = this.floorY - this.y; } else { this.x = H.x - 30; this.y = H.y - 40; this.w = 60; this.h = 50; } }
  hit(d, o = {}) {
    if (this.dead || this.dying || !this.active) return;
    if (!this.vulnerable) { if (this.t - (this.noT || -99) > 40) { this.noT = this.t; this.L.popups.push({ x: this.head.x - 40, y: this.head.y - 20, text: 'SIN EFECTO', col: '#8a98b8', t: 0 }); } P.Audio.sfx('block'); return; }
    d = Math.max(1, Math.round(d)); this.hp -= d; this.restDmg += d; this.flash = 6; this.mood = 'hurt'; this.moodT = 18;
    this.L.popups.push({ x: this.head.x - 50 + P.rand(-14, 14), y: this.head.y - 30, text: String(d), col: '#ffd166', t: 0, big: true });
    this.L.parts.burst(this.head.x - 60 + P.rand(-20, 20), this.head.y + P.rand(-10, 20), 5, { col: P.pick(['#5ae0ff', '#bff6ff', '#ffffff', '#ffd166']), smin: 0.5, smax: 2.5, glow: 3 }); P.Audio.sfx('ehit');
    if (o.poison) this.poisonT = 90;
    if (this.hp <= 0) return this.die();
    const f = this.hp / this.maxhp; if (this.phase === 1 && f < 0.66) this.toPhase(2); else if (this.phase === 2 && f < 0.33) this.toPhase(3);
    if (this.restDmg >= (this.phase === 3 ? 150 : 200) && this.state === 'rest') { this.state = 'ascend'; this.st = 0; P.Audio.sfx('roar'); }
  }
  toPhase(n) {
    this.phase = n; P.shake(8, 40); P.Audio.sfx('roar'); this.L.aeFlash = 1;
    this.L.popups.push({ x: this.cxW, y: 70, text: n === 2 ? '¡LA FURIA CELESTIAL!' : '¡LA TORMENTA DEFINITIVA!', col: '#bff6ff', t: 0, big: true });
    if (n === 3) { this.storm = 0.75; P.Audio.stopMusic(); P.Audio.music('azhyrion_3'); } else this.storm = 0.4;
  }
  die() {
    if (this.dying) return; this.dying = true; this.hp = 0; this.state = 'death'; this.st = 0; this.isEnemy = false; this.untouchable = true; this.hz = [];
    P.State.task('azhyrion', 'defeat'); P.State.data.stats.kills++; P.Audio.sfx('roar'); this.L.player.iframes = 600; P.Audio.stopMusic();
    for (const e of this.L.ents) if (e.isEnemy && e !== this && !e.dead && !e.passive) e.die(); for (const e of this.L.ents) if (e instanceof P.AzTwister) e.dead = true;
  }
  moveHead(x, y, k) { this.head.x += (x - this.head.x) * k; this.head.y += (y - this.head.y) * k; }
  // concentración de energía antes de cada ataque y elección del ataque
  pick() {
    const ph = this.phase, opts = ph === 1 ? ['gust', 'bolt', 'pressure', 'rain'] : ph === 2 ? ['gust', 'bolt', 'pressure', 'rain', 'stormfall', 'twister'] : ['bolt', 'pressure', 'rain', 'stormfall', 'twister', 'gust'];
    let a = P.pick(opts); if (a === this.lastAtk) a = P.pick(opts); this.lastAtk = a; this.state = a; this.st = 0; this.step = 0;
  }
  mark(x, at, o = {}) { const L = this.L; this.hz.push(Object.assign({ k: 'mark', x: P.clamp(x, L.minX + 16, L.maxX - 16), t: 0, at, r: 18, dmg: 14 }, o)); }
  update() {
    const L = this.L, p = L.player, fy = this.floorY, ph = this.phase, spd = this.spd, H = this.head;
    this.t++; this.st++; if (this.flash > 0) this.flash--; if (this.blink > 0) this.blink--; else if (Math.random() < 0.007 && this.state !== 'death') this.blink = 7;
    if (this.moodT > 0 && --this.moodT === 0) this.mood = this.state === 'rest' ? 'tired' : 'calm';
    if (this.poisonT > 0) { this.poisonT--; if (this.poisonT % 30 === 0 && this.vulnerable) { this.hp -= 2; if (this.hp <= 0) this.die(); } }
    if (!this.seen && H.y > 0) { this.seen = true; P.State.see('azhyrion'); }
    this.look += (P.clamp((p.cx - (H.x - 110)) / 80, -2, 2) - this.look) * 0.1;
    const bob = Math.sin(this.t * 0.021) * 8, sway = Math.sin(this.t * 0.012) * 30;
    switch (this.state) {
      case 'intro': this.moveHead(this.home.x, -60, 0.02); break;
      case 'roar': this.moveHead(this.home.x, this.home.y, 0.03); if (this.st === 70) { this.jaw = 2; P.Audio.sfx('roar'); P.shake(9, 50); L.aeFlash = 1; this.mood = 'angry'; this.moodT = 60; } if (this.st === 120) this.jaw = 0; if (this.st > 140) { this.state = 'idle'; this.cd = 60; } break;
      case 'idle': this.moveHead(this.home.x + sway, this.home.y + bob, 0.05); this.glow = Math.max(0, this.glow - 0.03); this.amp += (1 - this.amp) * 0.05; if (--this.cd <= 0) { this.state = 'charge'; this.st = 0; P.Audio.sfx('charge'); } break;
      case 'charge':
        // observa al jugador, sus cuernos y ojos se iluminan y la cola se agita acumulando electricidad
        this.moveHead(this.home.x + 14, this.home.y - 6 + bob * 0.4, 0.05); this.glow = Math.min(1, this.st / (60 / spd)); this.amp = 1 + this.glow * (ph === 3 ? 1.6 : 0.9); this.mood = 'focus';
        if (this.st % 4 === 0) L.parts.add({ x: H.x - 20 + P.rand(-40, 40), y: H.y - 50 + P.rand(-20, 20), vx: (H.x - 20 - (H.x - 20)) * 0, vy: P.rand(0.3, 1), life: 20, col: P.pick(['#5ae0ff', '#ffffff', '#ffd166']), size: 1, glow: 3 });
        if (this.st > 64 / spd) this.pick(); break;
      case 'gust': { // Ráfaga celestial: corriente horizontal a ras de suelo o en alto
        if (this.st === 1) { this.band = ph > 1 && Math.random() < 0.5 ? 'high' : 'low'; this.gdir = p.cx < H.x - 60 ? -1 : 1; this.jaw = 1; }
        const warn = 46 / spd, dur = this.band === 'low' ? 42 : 70, y0 = this.band === 'low' ? fy - 26 : fy - 92, y1 = this.band === 'low' ? fy : fy - 40;
        this.gust = { y0, y1, dir: this.gdir, warn: this.st < warn, k: this.st };
        if (this.st >= warn && this.st < warn + dur) { this.jaw = 2; if (this.st === Math.ceil(warn)) { P.Audio.sfx('dash'); P.shake(4, 20); } if (!p.dead && p.y + p.h > y0 && p.y < y1) { P.aePushX(L, p, this.gdir * 2.6); p.hurt(10, p.cx - this.gdir * 10, { env: true }); } if (this.st % 2 === 0) L.parts.add({ x: this.gdir > 0 ? L.minX : L.maxX, y: P.rand(y0, y1), vx: this.gdir * P.rand(6, 9), life: 70, col: P.pick(['#ffffff', '#dceaff', '#bff6ff']), size: P.pick([1, 2]) }); }
        if (this.st >= warn + dur) { this.gust = null; this.jaw = 0; this.endAttack(); } break; }
      case 'bolt': { // Relámpago dirigido: los ojos se iluminan, marca el suelo y lanza un rayo desde la cabeza
        const n = ph, gap = 52 / spd;
        if (this.st === 1) this.mood = 'angry';
        if (this.st % Math.round(gap) === 1 && this.st < n * gap) { this.mark(p.cx + p.vx * 18, 46 / spd, { fromHead: true, r: 20, dmg: 15 }); P.Audio.sfx('charge'); this.eyeFlash = 30; }
        if (this.st > n * gap + 50 / spd) this.endAttack(); break; }
      case 'pressure': { // Onda de presión: abre la mandíbula y libera una onda que recorre el suelo
        if (this.st < 44 / spd) { this.jaw = this.st > 20 / spd ? 2 : 1; this.moveHead(this.home.x + sway * 0.3, this.home.y + 10, 0.05); if (this.st % 3 === 0) L.parts.add({ x: H.x - 90 + P.rand(-20, 20), y: H.y + 20 + P.rand(-10, 10), vx: P.rand(1, 2), vy: P.rand(-0.5, 0.5), life: 16, col: '#ffffff', size: 1, glow: 3 }); }
        if (this.st === Math.ceil(44 / spd)) { P.Audio.sfx('bigexplode'); P.shake(8, 24); L.aeFlash = 0.5; this.hz.push({ k: 'ring', x: H.x - 90, y: H.y + 20, t: 0 }); const sx = P.clamp(H.x - 90, L.minX + 20, L.maxX - 20); for (const d of [-1, 1]) this.hz.push({ k: 'wave', x: sx, dir: d, t: 0, v: ph === 3 ? 3.8 : 3.1 }); if (ph === 3) for (const d of [-1, 1]) this.hz.push({ k: 'wave', x: sx, dir: d, t: -34, v: 3.1 }); }
        if (this.st > 44 / spd + 20) this.jaw = 0; if (this.st > 44 / spd + (ph === 3 ? 90 : 60)) this.endAttack(); break; }
      case 'rain': { // Lluvia eléctrica: descargas por todo el escenario, anunciadas antes
        if (this.st === 1) { const n = 5 + ph * 2, xs = []; let tries = 0; while (xs.length < n && tries++ < 200) { const x = P.rand(L.minX + 20, L.maxX - 20); if (xs.every(v => Math.abs(v - x) > 46)) xs.push(x); } xs.forEach((x, i) => this.mark(x, 56 / spd + (i % 2) * 14)); this.lift = 1; }
        if (this.st > 110) { this.lift = 0; this.endAttack(); } break; }
      case 'stormfall': { // Tormenta descendente: la cola se eleva y las descargas barren el suelo
        if (this.st === 1) { this.lift = 1; const dir = p.cx < this.cxW ? 1 : -1, n = 8, passes = ph === 3 ? 2 : 1; for (let pass = 0; pass < passes; pass++) for (let i = 0; i < n; i++) { const x = dir > 0 ? L.minX + 24 + i * 56 : L.maxX - 24 - i * 56; this.mark(x, 44 / spd + i * 11 + pass * 70, { r: 22 }); } }
        if (this.st > (ph === 3 ? 230 : 150)) { this.lift = 0; this.endAttack(); } break; }
      case 'twister': { // Torbellino: cruza el escenario y altera el movimiento
        if (this.st === 20) { const d = p.cx < H.x - 60 ? -1 : 1, x = d < 0 ? L.maxX - 30 : L.minX + 30; L.add(new P.AzTwister(L, x, fy, d, ph)); P.Audio.sfx('dash'); }
        this.moveHead(this.home.x + sway, this.home.y + bob, 0.05); if (this.st > 140) this.endAttack(); break; }
      case 'combo': if (this.st > 16) this.pick(); break;
      case 'descend': { // pierde energía y baja la cabeza hasta el suelo
        const tx = P.clamp(p.cx + (p.cx < this.cxW ? 120 : -20), L.minX + 130, L.maxX - 40); this.moveHead(tx, fy - 64, 0.05); this.glow = Math.max(0, this.glow - 0.05); this.amp += (0.4 - this.amp) * 0.05; this.mood = 'tired';
        if (this.st > 60) { this.state = 'rest'; this.st = 0; this.restDmg = 0; P.shake(3, 10); L.parts.burst(H.x - 40, fy - 4, 20, { col: P.pick(['#ffffff', '#bff6ff', '#8a94ac']), smin: 1, smax: 3, g: 0.1 }); if (!L.azTip) { L.azTip = true; P.toast('¡La cabeza ha bajado al suelo! Atácala ahora', { col: P.UIC.gold, life: 140 }); } } break; }
      case 'rest': this.head.y = fy - 64 + Math.sin(this.t * 0.06) * 1.5; this.mood = this.moodT > 0 ? this.mood : 'tired'; if (this.st > [0, 180, 140, 110][ph]) { this.state = 'ascend'; this.st = 0; } break;
      case 'ascend': this.moveHead(this.home.x, this.home.y, 0.05); this.amp += (1 - this.amp) * 0.05; this.mood = 'calm'; if (this.st > 50) { this.state = 'idle'; this.cd = (ph === 3 ? 40 : 70) / spd; } break;
      case 'death': this.updateDeath(); break;
    }
    if (this.eyeFlash > 0) this.eyeFlash--;
    if (this.state !== 'gust') this.gust = null;
    // amenazas que alcanzan el plano de juego
    for (const h of this.hz) {
      h.t++;
      if (h.k === 'mark' && h.t === Math.round(h.at)) { P.Audio.sfx('explode'); P.shake(3, 8); L.aeFlash = Math.max(L.aeFlash || 0, 0.6); L.parts.burst(h.x, fy - 2, 14, { col: P.pick(['#ffffff', '#bff6ff', '#5ae0ff']), smin: 1, smax: 3.5, g: 0.12, size: 2, glow: 3 }); if (!p.dead && Math.abs(p.cx - h.x) < h.r && p.y + p.h > fy - 90) p.hurt(p.st && p.st.egida ? Math.round(h.dmg / 2) : h.dmg, h.x, { env: true }); }
      if (h.k === 'wave' && h.t > 0) { h.x += h.dir * h.v; if (!p.dead && Math.abs(p.cx - h.x) < 10 && p.y + p.h > fy - 18) p.hurt(13, h.x - h.dir * 10, { env: true }); if (h.t % 2 === 0) L.parts.add({ x: h.x, y: fy - 2, vy: -P.rand(1, 2.5), vx: h.dir * 0.5, life: 16, col: P.pick(['#ffffff', '#bff6ff']), size: 1 }); }
    }
    this.hz = this.hz.filter(h => h.k === 'mark' ? h.t < h.at + 12 : h.k === 'wave' ? h.x > L.minX - 20 && h.x < L.maxX + 20 : h.t < 30);
    // chispas que salen de la cola
    if (this.t % 3 === 0 && this.tailPts.length && !this.dying) { const q = this.tailPts[P.ri(0, this.tailPts.length - 1)]; L.parts.add({ x: q.x + P.rand(-6, 6), y: q.y + P.rand(-6, 6), vx: P.rand(-0.4, 0.4), vy: P.rand(-0.3, 0.3), life: 30, col: P.pick(['#ffffff', '#bff6ff', '#a898ff']), size: 1, glow: 3 }); }
    // respiración: vaho que sale de la nariz
    if (this.t % 90 === 0 && !this.dying) for (let k = 0; k < 6; k++) L.parts.add({ x: H.x - 128 + P.rand(-2, 2), y: H.y + 6, vx: -P.rand(0.4, 1), vy: -P.rand(0, 0.3), life: 40, col: '#dceaff', size: 1 });
    this.sync();
  }
  endAttack() {
    const ph = this.phase;
    if (ph >= 2 && this.combo === 0 && Math.random() < (ph === 3 ? 0.85 : 0.4)) { this.combo = 1; this.state = 'combo'; this.st = 0; return; }
    this.combo = 0; this.state = 'descend'; this.st = 0; this.jaw = 0;
  }
  updateDeath() {
    const L = this.L, fy = this.floorY, st = this.st, H = this.head;
    // deja de atacar · la cabeza baja despacio · la cola se apaga y se deshace en partículas · el cielo se despeja
    this.moveHead(this.cxW + 60, fy - 70, 0.012); this.mood = 'solemn'; this.amp += (0.3 - this.amp) * 0.02; this.glow = 0; this.jaw = st > 240 && st < 290 ? 1 : 0;
    this.storm = Math.max(-0.6, this.storm - 0.01); this.clear = Math.min(1, Math.max(0, (st - 60) / 200));
    if (st > 40) this.dissolve = Math.min(1, (st - 40) / 200);
    if (st > 40 && st < 250) for (let k = 0; k < 3; k++) { const n = this.tailPts.length, i = Math.floor(n * (1 - this.dissolve)) + P.ri(-2, 2), q = this.tailPts[P.clamp(i, 0, n - 1)]; if (q) L.parts.add({ x: q.x + P.rand(-10, 10), y: q.y + P.rand(-10, 10), vx: P.rand(-0.6, 0.6), vy: -P.rand(0.3, 1.2), life: 60, col: P.pick(['#ffffff', '#bff6ff', '#ffd166', '#a898ff']), size: P.pick([1, 2]), glow: 4 }); }
    if (st === 260) { P.Audio.sfx('bigexplode'); P.shake(16, 60); L.aeFlash = 1.2; L.fx.push({ k: 'ring', x: H.x - 40, y: H.y, t: 0, life: 50, r: 260, col: '#bff6ff' }); for (let k = 0; k < 60; k++) L.parts.add({ x: H.x - 40 + P.rand(-60, 60), y: H.y + P.rand(-50, 40), vx: P.rand(-3, 3), vy: -P.rand(1, 5), life: 80, col: P.pick(['#ffffff', '#bff6ff', '#ffd166']), size: 2, glow: 5 }); }
    if (st > 260) this.eyes = Math.max(0, this.eyes - 0.02);
    if (st === 360) { this.dead = true; P.drop(L, this.cxW, fy - 40, { xp: 500, crys: 12, bio: 18 }); L.onBossDefeated(this); }
  }
  // puntos de la cola: nace detrás de la cabeza y recorre el cielo nadando
  tail() {
    const H = this.head, t = this.t, a = this.amp, lf = this.lift * 28, dr = this.state === 'rest' || this.state === 'descend' ? 22 : 0, cw = this.cxW;
    const K = [{ x: H.x + 82, y: H.y + 4 }, { x: H.x + 150, y: H.y - 40 - lf * 0.5 }, { x: cw + 200, y: 74 - lf + dr }, { x: cw + 70, y: 44 - lf + dr }, { x: cw - 100, y: 62 - lf + dr }, { x: cw - 200, y: 112 - lf * 0.5 + dr }, { x: cw - 168, y: 158 + dr }];
    for (let i = 1; i < K.length; i++) { K[i].x += Math.sin(t * 0.02 + i * 1.3) * 16 * a; K[i].y += Math.cos(t * 0.017 + i * 1.1) * 12 * a; }
    const pts = azSpline(K, 64);
    for (let i = 1; i < pts.length - 1; i++) { const s = i / pts.length, dx = pts[i + 1].x - pts[i - 1].x, dy = pts[i + 1].y - pts[i - 1].y, l = Math.hypot(dx, dy) || 1, off = Math.sin(s * 14 - t * 0.08) * 7 * a * (0.3 + s); pts[i].x += -dy / l * off; pts[i].y += dx / l * off; pts[i].nx = -dy / l; pts[i].ny = dx / l; }
    pts.forEach((q, i) => { const s = i / pts.length; q.w = (22 + this.phase * 3) * Math.pow(1 - s, 0.7) * (this.phase === 3 ? 1.25 : 1) + 3; q.nx = q.nx || 0; q.ny = q.ny || 1; });
    return (this.tailPts = pts);
  }
  drawBack(c, cx, cy) {
    if (this.dead) return;
    const H = this.head, t = this.t, Z = P.AZC, vis = this.state === 'intro' ? 0.6 : 1, n0 = 64;
    // el cielo se despeja al final
    if (this.clear > 0) { c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(0, 0, 0, P.H); g.addColorStop(0, 'rgba(120,160,255,' + (0.18 * this.clear) + ')'); g.addColorStop(1, 'rgba(255,220,160,' + (0.3 * this.clear) + ')'); c.fillStyle = g; c.fillRect(0, 0, P.W, P.H); c.globalCompositeOperation = 'source-over'; }
    // tercera fase: las nubes giran alrededor del dragón
    if (this.phase === 3 && !this.dying) for (let k = 0; k < 18; k++) { const a = t * 0.012 + k * 0.35, rr = 120 + (k % 3) * 34, im = P.S.az_puff.f[2 + (k % 4)]; c.globalAlpha = 0.55; c.drawImage(im, Math.round(H.x - 60 + Math.cos(a) * rr * 1.3 - 26 - cx), Math.round(H.y - 10 + Math.sin(a) * rr * 0.55 - 26 - cy)); }
    c.globalAlpha = vis;
    // COLA DE TORMENTA
    const pts = this.tail(), n = Math.floor(pts.length * (1 - this.dissolve)), en = this.dying ? Math.max(0, 1 - this.st / 140) : this.state === 'rest' || this.state === 'descend' ? 0.35 : 1;
    for (let i = 0; i < n; i += 6) P.drawGlow(c, pts[i].x - cx, pts[i].y - cy, pts[i].w * 1.7, this.phase === 3 ? '#6a8aff' : '#3a6aff', 0.12 * vis);
    c.globalAlpha = vis;
    for (let i = n - 1; i >= 0; i--) { const q = pts[i], W = q.w * 1.35, f = W > 34 ? 5 : W > 27 ? 4 : W > 20 ? 3 : W > 14 ? 2 : W > 8 ? 1 : 0; c.drawImage(P.S.az_puff.f[f], Math.round(q.x - 26 - cx), Math.round(q.y - 26 - cy)); if (i % 3 === 0 && f > 1) { const o = Math.sin(i * 1.7 + t * 0.03) * q.w * 0.45; c.drawImage(P.S.az_puff.f[f - 1], Math.round(q.x + q.nx * o - 26 - cx), Math.round(q.y + q.ny * o - 26 - cy)); } }
    if (en > 0) {
      // núcleo de energía, filamentos eléctricos y remolinos que recorren la cola
      c.globalAlpha = vis * en; c.fillStyle = (t >> 1) % 3 ? '#bff6ff' : '#ffffff';
      for (let i = 1; i < n; i++) azLine(c, pts[i - 1].x - cx, pts[i - 1].y - cy, pts[i].x - cx, pts[i].y - cy, 2);
      for (const sd of [-1, 1]) { c.fillStyle = sd > 0 ? '#5ae0ff' : '#a898ff'; for (let i = 1; i < n; i++) { const o0 = Math.sin((i - 1) * 0.5 + t * 0.12 * sd) * pts[i - 1].w * 0.5, o1 = Math.sin(i * 0.5 + t * 0.12 * sd) * pts[i].w * 0.5; azLine(c, pts[i - 1].x + pts[i - 1].nx * o0 - cx, pts[i - 1].y + pts[i - 1].ny * o0 - cy, pts[i].x + pts[i].nx * o1 - cx, pts[i].y + pts[i].ny * o1 - cy, 1); } }
      for (let k = 0; k < 4; k++) { const i = Math.floor(((t * 0.006 * (this.phase === 3 ? 1.8 : 1) + k / 4) % 1) * n); if (!pts[i]) continue; const q = pts[i]; P.drawGlow(c, q.x - cx, q.y - cy, q.w * 0.9, '#bff6ff', 0.35 * en); for (let j = 0; j < 10; j++) { const a = t * 0.25 + j * 0.63, rr = q.w * (0.25 + j * 0.05); c.globalAlpha = vis * en * (1 - j / 12); c.fillStyle = j % 2 ? '#ffffff' : '#5ae0ff'; c.fillRect(Math.round(q.x + Math.cos(a) * rr - cx), Math.round(q.y + Math.sin(a) * rr * 0.6 - cy), 2, 1); } }
      // relámpagos que recorren su longitud de forma irregular
      const fq = this.state === 'charge' ? 3 : this.phase === 3 ? 4 : 9;
      if (t % fq < 2 && n > 10) { const i = P.ri(0, n - 9), j = i + P.ri(4, 8); c.globalAlpha = vis * en; P.aeBolt(c, pts[i].x - cx, pts[i].y - cy, pts[j].x - cx, pts[j].y - cy, t, '#ffffff', 1, 1); P.drawGlow(c, pts[i].x - cx, pts[i].y - cy, 24, '#bff6ff', 0.4 * en); }
      // remolino en la punta
      const e = pts[n - 1]; if (e && this.dissolve < 0.9) { c.fillStyle = '#ffffff'; for (let k = 0; k < 14; k++) { const a = t * 0.15 + k * 0.6, rr = 3 + k * 1.1; c.globalAlpha = vis * en * (1 - k / 14); c.fillRect(Math.round(e.x + Math.cos(a) * rr - cx), Math.round(e.y + Math.sin(a) * rr * 0.7 - cy), 2, 1); } }
    }
    // CABEZA
    if (this.eyes <= 0 && this.st > 300) { c.globalAlpha = 1; return; }
    c.globalAlpha = vis * (this.state === 'death' && this.st > 270 ? Math.max(0, 1 - (this.st - 270) / 70) : 1);
    const X = Math.round(H.x - 150 - cx), Y = Math.round(H.y - 96 - cy);
    // melena viva y bigotes que flotan con el viento (detrás y delante del cráneo)
    for (let k = 0; k < 9; k++) { let x = X + 190, y = Y + 64 + k * 8; c.fillStyle = Z.M[2 + (k % 4)]; for (let j = 0; j < 30; j++) { x += 1.5; y += Math.sin(j * 0.25 + t * 0.07 + k) * 1.1 - 0.2; c.fillRect(Math.round(x), Math.round(y), j < 20 ? 2 : 1, j < 20 ? 2 : 1); } }
    P.spr(c, 'az_head', this.jaw, X, Y - P.AZ_OY, { flash: this.flash > 0 && this.mood === 'hurt' });
    for (const [sx, sy, len, ph] of [[42, 104, 46, 0], [60, 108, 38, 1.5], [120, 124, 30, 3]]) { let x = X + sx, y = Y + sy; c.fillStyle = '#bff6ff'; for (let j = 0; j < len; j++) { x -= 1.2; y += 0.5 + Math.sin(j * 0.18 + t * 0.06 + ph) * 0.9; c.globalAlpha = vis * (1 - j / len) * 0.9; c.fillRect(Math.round(x), Math.round(y), 1, 1); } }
    c.globalAlpha = vis;
    // cuernos y frente que se iluminan al concentrar energía
    if (this.glow > 0.05) { P.drawGlow(c, X + 175, Y + 4, 30 + this.glow * 20, '#bff6ff', this.glow * 0.6); P.drawGlow(c, X + 205, Y + 14, 24 + this.glow * 16, '#5ae0ff', this.glow * 0.5); if (this.t % 6 < 3) { c.globalAlpha = this.glow; P.aeBolt(c, X + 170, Y + 2, X + 190 + P.ri(-10, 10), Y - 16, this.t, '#ffffff', 1, 0); c.globalAlpha = vis; } }
    // punto débil: la frente brilla mientras la cabeza está abajo
    const fx = X + 128, fy2 = Y + 72;
    if (this.vulnerable) { const k = (Math.sin(this.t * 0.2) + 1) / 2; P.drawGlow(c, X + 110, Y + 92, 70 + k * 10, '#ffd166', 0.22 + k * 0.14); P.drawGlow(c, fx, fy2, 26 + k * 12, '#ffd166', 0.6 + k * 0.3); for (let j = 0; j < 3; j++) { c.fillStyle = '#ffd166'; c.globalAlpha = 0.6; c.fillRect(Math.round(fx - 14 + ((this.t * 2 + j * 20) % 40) - 6), Math.round(fy2 - 8 + j * 6), 2, 1); } c.globalAlpha = vis; c.fillStyle = k > 0.5 ? '#ffffff' : '#ffd166'; c.fillRect(fx - 2, fy2 - 2, 4, 4); if (this.t % 20 < 12) P.txt(c, '▼', fx - 3, Y + 26, '#ffd166', { outline: true }); }
    else if (!this.dying) { c.fillStyle = (this.t >> 4) % 2 ? '#ff3050' : '#a01030'; c.fillRect(X + 136, Y + 65, 3, 3); }
    // ojo: color según la emoción, la pupila sigue al jugador, parpadeo y párpado cansado
    if (this.eyes > 0) {
      const col = this.eyeFlash > 0 ? '#ffffff' : { calm: '#5ae0ff', focus: '#ffffff', angry: '#ff3a6a', tired: '#7a8ab0', hurt: '#ffd166', solemn: '#bff6ff' }[this.mood] || '#5ae0ff', ex = X + 112, ey = Y + 81;
      c.globalAlpha = vis * this.eyes;
      if (this.blink > 0) { c.fillStyle = Z.S[3]; c.fillRect(ex - 8, ey, 16, 1); }
      else { const lid = this.mood === 'tired' || this.mood === 'solemn' ? 2 : 0; c.fillStyle = col; for (const [w, dy] of [[6, -2], [12, -1], [14, 0], [12, 1], [6, 2]]) if (dy >= -2 + lid) c.fillRect(ex - w / 2, ey + dy, w, 1); c.fillStyle = '#07071c'; c.fillRect(Math.round(ex - 1 + this.look), ey - 2 + lid, 2, 5 - lid); c.fillStyle = '#ffffff'; c.fillRect(Math.round(ex - 4 + this.look), ey - 1 + lid, 1, 1); if (lid) { c.fillStyle = Z.S[3]; c.fillRect(ex - 7, ey - 3, 14, lid + 1); } P.drawGlow(c, ex, ey, 14 + (this.mood === 'focus' ? 8 : 0), col, 0.5 * this.eyes); }
    }
    c.globalAlpha = 1;
  }
  draw(c, cx, cy) {
    if (this.dead) return;
    const fy = this.floorY, L = this.L, H = this.head;
    for (const h of this.hz) {
      if (h.k === 'mark') { const left = h.at - h.t; if (left > 0) { const k = 1 - left / h.at; c.globalAlpha = 0.35 + k * 0.5 + ((h.t >> 2) % 2) * 0.15; c.fillStyle = '#5ae0ff'; c.fillRect(Math.round(h.x - h.r - cx), fy - cy - 2, h.r * 2, 2); c.fillStyle = '#ffffff'; c.fillRect(Math.round(h.x - h.r * k - cx), fy - cy - 1, Math.round(h.r * 2 * k), 1); c.globalAlpha = 1; P.drawGlow(c, h.x - cx, fy - cy - 4, 8 + k * 16, '#5ae0ff', 0.3 + k * 0.3);
          if (h.fromHead && left < 20) { c.globalAlpha = 0.4; c.fillStyle = '#bff6ff'; azLine(c, H.x - 112 - cx, H.y - 15 - cy, h.x - cx, fy - 4 - cy, 1); c.globalAlpha = 1; } }
        else if (left > -10) { const sx = h.fromHead ? H.x - 112 : h.x + ((h.t * 7) % 13) - 6, sy = h.fromHead ? H.y - 15 : L.cam.y - 10; P.aeBolt(c, sx - cx, sy - cy, h.x - cx, fy - 2 - cy, h.t + Math.round(h.x), '#ffffff', 3, 2); P.aeBolt(c, sx - cx + 2, sy - cy, h.x - cx, fy - 2 - cy, h.t + 3, '#5ae0ff', 1, 0); P.drawGlow(c, h.x - cx, fy - 12 - cy, 44, '#bff6ff', 0.8); } }
      if (h.k === 'wave' && h.t > 0) { const x = Math.round(h.x - cx), y = fy - cy; c.fillStyle = '#ffffff'; for (let k = 0; k < 9; k++) c.fillRect(x - h.dir * k * 2, y - 16 + k * 1.8, 2, 2); c.fillStyle = '#bff6ff'; c.fillRect(x - h.dir * 6, y - 6, 3, 6); P.drawGlow(c, x, y - 8, 16, '#bff6ff', 0.5); }
      if (h.k === 'ring') { c.strokeStyle = 'rgba(220,240,255,' + (1 - h.t / 30) + ')'; c.lineWidth = 2; c.beginPath(); c.ellipse(Math.round(h.x - cx), Math.round(h.y - cy), 20 + h.t * 6, 10 + h.t * 3, 0, 0, 6.3); c.stroke(); c.lineWidth = 1; }
    }
    // ráfaga: aviso con estelas tenues y luego el muro de viento
    const g = this.gust; if (g) { const y0 = g.y0 - cy, hh = g.y1 - g.y0;
      if (g.warn) { c.globalAlpha = 0.25 + ((this.t >> 3) % 2) * 0.2; c.fillStyle = '#ffd166'; c.fillRect(0, y0, P.W, 1); c.fillRect(0, y0 + hh, P.W, 1); c.globalAlpha = 0.2; c.fillStyle = '#ffffff'; for (let k = 0; k < 8; k++) c.fillRect(((k * 61 + this.t * 2 * g.dir) % P.W + P.W) % P.W, y0 + 3 + (k * 7) % (hh - 4), 14, 1); c.globalAlpha = 1; }
      else { c.globalAlpha = 0.3; c.fillStyle = '#dceaff'; c.fillRect(0, y0, P.W, hh); c.globalAlpha = 0.85; c.fillStyle = '#ffffff'; for (let k = 0; k < 22; k++) c.fillRect(((k * 47 + this.t * 9 * g.dir) % P.W + P.W) % P.W, y0 + 2 + (k * 5) % (hh - 3), 22 + (k % 3) * 8, 1); c.globalAlpha = 1; } }
  }
  // barra de vida del jefe final: marco de nácar y oro, nombre con brillo celeste y segmentos de fase
  drawBar(c) {
    const w = 320, x0 = (P.W - w) / 2, y0 = P.H - 18, t = this.t;
    c.fillStyle = 'rgba(6,10,30,0.7)'; c.fillRect(x0 - 8, y0 - 16, w + 16, 28);
    c.fillStyle = '#ffd166'; for (const [x, d] of [[x0 - 8, 1], [x0 + w + 7, -1]]) { c.fillRect(x, y0 - 16, 1, 28); c.fillRect(x, y0 - 16, 6 * d, 1); c.fillRect(x, y0 + 11, 6 * d, 1); }
    P.drawGlow(c, P.W / 2, y0 - 10, 40, '#5ae0ff', 0.25 + Math.sin(t * 0.05) * 0.1);
    P.txt(c, this.name, P.W / 2, y0 - 13, '#ffffff', { align: 'center', outline: true, shadow: '#0a1a4a' });
    P.txt(c, this.title, x0 + w, y0 - 13, '#8ad4ff', { align: 'right' }); P.txt(c, 'FASE ' + ['I', 'II', 'III'][this.phase - 1], x0, y0 - 13, this.phase === 3 ? '#ff8ab0' : '#ffd166');
    this.ghost = this.ghost == null ? this.hp : P.approach(this.ghost, this.hp, this.maxhp * 0.004);
    c.fillStyle = '#0a1028'; c.fillRect(x0, y0, w, 7); c.fillStyle = '#ffffff'; c.fillRect(x0, y0, Math.round(w * this.ghost / this.maxhp), 7);
    const fw = Math.round(w * this.hp / this.maxhp), g = c.createLinearGradient(x0, 0, x0 + w, 0); g.addColorStop(0, this.phase === 3 ? '#a898ff' : '#2a6aff'); g.addColorStop(1, this.phase === 3 ? '#ff8ab0' : '#5ae0ff'); c.fillStyle = g; c.fillRect(x0, y0, fw, 7);
    c.fillStyle = 'rgba(255,255,255,0.5)'; c.fillRect(x0, y0, fw, 1); if (fw > 2 && t % 40 < 20) { c.fillStyle = '#ffffff'; c.fillRect(x0 + fw - 2, y0, 2, 7); }
    for (const f of [0.66, 0.33]) { c.fillStyle = '#ffd166'; c.fillRect(Math.round(x0 + w * f), y0 - 1, 1, 9); }
    c.strokeStyle = '#8ad4ff'; c.strokeRect(x0 - 0.5, y0 - 0.5, w + 1, 8);
    if (this.vulnerable && t % 30 < 18) P.txt(c, '¡VULNERABLE!', P.W / 2, y0 + 9, '#ffd166', { align: 'center', outline: true });
  }
};
// torbellino del dragón: cruza el escenario, te lanza y te desorienta
P.AzTwister = class extends P.Ent {
  constructor(L, x, fy, dir, ph) { super(L, x - 17, fy - 72, 34, 72); this.dir = dir; this.v = 1.4 + ph * 0.25; this.cool = 0; }
  update() { this.t++; const L = this.L, p = L.player; this.x += this.dir * this.v; if (this.cool > 0) this.cool--; if (this.x < L.minX - 60 || this.x > L.maxX + 30) this.dead = true;
    if (!p.dead && this.cool === 0 && P.overlap(this, p)) { this.cool = 60; p.vy = -7; p.onGround = false; p.aeDizzy = 60; p.hurt(8, this.cx, { env: true }); P.aePushX(L, p, this.dir * 8); }
    if (this.t % 2 === 0) L.parts.add({ x: this.cx + P.rand(-14, 14), y: this.y + this.h - 2, vx: P.rand(-1.5, 1.5), vy: -P.rand(1, 3.5), life: 26, col: P.pick(['#ffffff', '#bff6ff', '#8a94ac']), size: 1 }); }
  draw(c, cx, cy) { const x = Math.round(this.cx - cx), y = Math.round(this.y - cy); for (let k = 0; k < 18; k++) { const w = 4 + k * 1.2, yy = y + this.h - k * 4, s = Math.sin(this.t * 0.45 + k * 0.7) * (2 + k * 0.5); c.globalAlpha = 0.35 + (k % 2) * 0.3; c.fillStyle = k % 3 ? '#e8f0ff' : '#ffffff'; c.fillRect(Math.round(x - w + s), yy, Math.round(w * 2), 2); if (k % 4 === 0) { c.fillStyle = '#5ae0ff'; c.fillRect(Math.round(x + s + Math.cos(this.t * 0.45 + k) * w), yy, 2, 1); } } c.globalAlpha = 1; P.drawGlow(c, x, y + this.h / 2, 26, '#bff6ff', 0.25); }
};
P.BOSS_CLASS = P.BOSS_CLASS || {}; P.BOSS_CLASS.azhyrion = P.Azhyrion;
