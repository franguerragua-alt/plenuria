'use strict';
// Exploración exterior del planeta (vista cenital, estilo RPG clásico)
P.OverworldScene = class {
  constructor(planet, fromLevel) { this.planet = planet; this.from = fromLevel; }
  enter() {
    const S = P.State, def = P.LV[this.planet].overworld;
    this.def = def; this.W = def.w; this.H = def.h; this.t = 0;
    this.build();
    // posición inicial
    let sx, sy;
    if (this.from) { const pt = def.portals[this.from - 1]; sx = pt[0] * 16 + 8; sy = pt[1] * 16 + 30; }
    else { sx = def.ship[0] * 16 + 36; sy = def.ship[1] * 16 + 56; }
    this.pl = { x: sx, y: sy, dir: 'down', f: 0, moving: false };
    this.cam = { x: 0, y: 0 }; this.updateCam(true);
    // animación de restauración de una región recién liberada
    this.anim = null;
    if (this.from && S.lvDone(this.planet, this.from)) { const lv = S.lvState(this.planet, this.from); if (!lv.owSeen) { lv.owSeen = true; const pt = def.portals[this.from - 1]; this.anim = { reg: this.from - 1, x: pt[0] * 16 + 8, y: pt[1] * 16 + 8, r: 0 }; P.Audio.sfx('restore'); } }
    this.A = P.ART[this.planet] || P.ART.verzara; P.Audio.music(this.A.owMusic || 'verzara_ow');
    this.parts = new P.Particles();
    S.data.lastPlanet = this.planet;
    const fk = 'owIntro_' + this.planet, seen = S.data.flags[fk] || (this.planet === 'verzara' && S.data.flags.owIntro);
    const intro = def.intro || [['elara', 'Esta es la superficie de VÉRZARA. Cada portal pleyadiano conduce a un territorio contaminado.'], ['elara', 'Libéralos en orden. Cuando la selva sane, verás regresar a sus habitantes. Tu nave te espera en la plataforma de aterrizaje.']];
    if (!seen) { S.data.flags[fk] = true; setTimeout(() => P.openUI(new P.Dialog(intro)), 300); }
  }
  regionOf(x, y) { let best = 0, bd = 1e9; this.def.portals.forEach((p, i) => { const d = (p[0] - x) ** 2 + (p[1] - y) ** 2; if (d < bd) { bd = d; best = i; } }); return best; }
  regionRestored(i) { if (this.anim && this.anim.reg === i) return 'anim'; return P.State.lvDone(this.planet, i + 1); }
  build() {
    const d = this.def, W = d.w, H = d.h, R = P.RNG(this.planet === 'verzara' ? 777 : P.hash(this.planet));
    this.g = []; this.obj = []; this.block = [];
    for (let y = 0; y < H; y++) { this.g.push(new Array(W).fill('g')); this.block.push(new Array(W).fill(0)); }
    const set = (x, y, v) => { if (x >= 0 && y >= 0 && x < W && y < H) this.g[y][x] = v; };
    // lago
    const Lo = d.layout || {}, org = !!d.layout;
    const ell = (cx, cy, rx, ry, v, avoid) => { for (let y = Math.floor(cy - ry - 2); y <= cy + ry + 2; y++) for (let x = Math.floor(cx - rx - 2); x <= cx + rx + 2; x++) { const n = org ? Math.sin(x * 1.7 + y * 0.9) * 0.14 + Math.sin(x * 0.6 - y * 1.3) * 0.12 : 0; if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1 + n && !(avoid && avoid(x, y))) set(x, y, v); } };
    const nearKey = (x, y) => (x >= d.ship[0] - 3 && x <= d.ship[0] + 8 && y >= d.ship[1] - 3 && y <= d.ship[1] + 6) || Math.hypot(x - d.village[0], y - d.village[1]) < 5 || d.portals.some(p => Math.hypot(p[0] - x, p[1] - y) < 3);
    if (Lo.sea) {
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) this.g[y][x] = 'w';
      const isl = (Lo.islands || []).slice(); isl.push([d.ship[0] + 2, d.ship[1] + 2, 6.5, 4.8], [d.village[0], d.village[1], 7, 5]); for (const p of d.portals) isl.push([p[0] + 1, p[1] + 1, 3.8, 3.2]);
      for (const [x, y, rx, ry] of isl) ell(x, y, rx, ry, 'g');
      const beach = []; for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) if (this.g[y][x] === 'g' && (this.g[y - 1][x] === 'w' || this.g[y + 1][x] === 'w' || this.g[y][x - 1] === 'w' || this.g[y][x + 1] === 'w')) beach.push([x, y]);
      for (const [x, y] of beach) this.g[y][x] = 'i';
    }
    for (const lk of (Lo.lakes || [d.lake])) ell(lk[0], lk[1], lk[2], lk[3], 'w');
    for (const ic of (Lo.ice || [])) ell(ic[0], ic[1], ic[2], ic[3], 'i');
    for (const m of (Lo.mesas || [])) ell(m[0], m[1], m[2], m[3], 'm', nearKey);
    for (const [x0, y0, x1, y1] of (Lo.cracks || [])) { const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2); for (let k = 0; k <= n; k++) { const t = k / n, x = Math.round(x0 + (x1 - x0) * t + Math.sin(k * 0.8) * 0.9), y = Math.round(y0 + (y1 - y0) * t + Math.cos(k * 0.6) * 0.6); for (const xx of [x, x + 1]) if (!nearKey(xx, y)) set(xx, y, 'x'); } }
    // caminos
    const pts = [[d.ship[0] + 2, d.ship[1] + 4], ...d.portals.slice(0, 3), [d.village[0], d.village[1]], ...d.portals.slice(3)];
    const stamp = (x, y) => { for (const [ax, ay] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const xx = x + ax, yy = y + ay; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; const g0 = this.g[yy][xx]; set(xx, yy, g0 === 'w' || g0 === 'x' ? 's' : 'p'); } };
    if (Lo.paths === 'curvy') for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], len = Math.max(1, Math.hypot(x1 - x0, y1 - y0)), n = Math.ceil(len * 2), nx = -(y1 - y0) / len, ny = (x1 - x0) / len, amp = Math.min(3, len / 5), ph = i * 1.7;
      for (let k = 0; k <= n; k++) { const t = k / n, w = Math.sin(t * Math.PI) * Math.sin(t * Math.PI * 2 + ph) * amp; stamp(Math.round(x0 + (x1 - x0) * t + nx * w), Math.round(y0 + (y1 - y0) * t + ny * w)); }
    }
    else for (let i = 0; i < pts.length - 1; i++) {
      let [x0, y0] = pts[i]; const [x1, y1] = pts[i + 1];
      while (x0 !== x1) { set(x0, y0, this.g[y0][x0] === 'w' ? 's' : 'p'); set(x0, y0 + 1, this.g[y0 + 1] && this.g[y0 + 1][x0] === 'w' ? 's' : 'p'); x0 += Math.sign(x1 - x0); }
      while (y0 !== y1) { set(x0, y0, this.g[y0][x0] === 'w' ? 's' : 'p'); set(x0 + 1, y0, this.g[y0][x0 + 1] === 'w' ? 's' : 'p'); y0 += Math.sign(y1 - y0); }
    }
    // plaza de la aldea
    const [vx, vy] = d.village;
    if (Lo.plaza === 'round') { for (let y = vy - 3; y <= vy + 3; y++) for (let x = vx - 4; x <= vx + 4; x++) if (((x - vx) / 3.6) ** 2 + ((y - vy) / 2.7) ** 2 <= 1) set(x, y, 's'); }
    else if (Lo.plaza !== 'none') for (let y = vy - 2; y <= vy + 2; y++) for (let x = vx - 3; x <= vx + 3; x++) set(x, y, 's');
    // plataforma de la nave
    for (let y = d.ship[1]; y < d.ship[1] + 4; y++) for (let x = d.ship[0] - 1; x < d.ship[0] + 6; x++) set(x, y, 's');
    const clear = (x, y) => {
      if (this.g[y][x] !== 'g') return false;
      if (Math.abs(x - vx) < 7 && Math.abs(y - vy) < 6) return false;
      if (x >= d.ship[0] - 2 && x <= d.ship[0] + 7 && y >= d.ship[1] - 3 && y <= d.ship[1] + 5) return false;
      for (const p of d.portals) if (Math.abs(p[0] - x) < 3 && Math.abs(p[1] - y) < 3) return false;
      for (let yy = y - 1; yy <= y + 1; yy++) for (let xx = x - 1; xx <= x + 1; xx++) if (this.g[yy] && (this.g[yy][xx] === 'p' || this.g[yy][xx] === 's')) return false;
      return true;
    };
    // borde y vegetación
    const BW = Lo.border || 'trees', DD = Object.assign({ tree: 0.1, rock: 0.025, goo: 0.075, lamp: 0.015 }, Lo.decor || {});
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const th = BW === 'trees' ? 2 : 2 + (Math.sin(x * 0.45 + y * 0.2) + Math.cos(y * 0.5 - x * 0.15) > 0.9 ? 1 : 0);
      const border = x < th || y < th || x >= W - th || y >= H - th;
      if (border) { if (BW === 'trees') { if ((x + y) % 2 === 0) this.obj.push({ k: 'tree', x: x * 16 - 8, y: y * 16 + 16, reg: this.regionOf(x, y) }); } else set(x, y, BW === 'water' ? 'w' : 'm'); this.block[y][x] = 1; continue; }
      if (this.g[y][x] === 'w' || this.g[y][x] === 'm' || this.g[y][x] === 'x') { this.block[y][x] = 1; continue; }
      if (!clear(x, y)) continue;
      const r = R(), cl = Math.sin(x * 0.35 + 1) * Math.cos(y * 0.3) + Math.sin((x + y) * 0.21), tp = Lo.clusters ? (cl > 0.55 ? DD.tree * 4 : DD.tree * 0.2) : DD.tree;
      if (r < tp) { this.obj.push({ k: 'tree', x: x * 16 - 8, y: y * 16 + 16, reg: this.regionOf(x, y) }); this.block[y][x] = 1; }
      else if (r < tp + DD.rock) { this.obj.push({ k: 'rock', x: x * 16, y: y * 16 + 16 }); this.block[y][x] = 1; }
      else if (r < tp + DD.rock + DD.goo) this.obj.push({ k: 'goo', x: x * 16, y: y * 16 + 16, reg: this.regionOf(x, y), v: R.int(0, 2), flat: true });
      else if (r < tp + DD.rock + DD.goo + DD.lamp) this.obj.push({ k: 'lamp', x: x * 16 + 3, y: y * 16 + 16, reg: this.regionOf(x, y) });
    }
    // portales
    d.portals.forEach((p, i) => this.obj.push({ k: 'portal', x: p[0] * 16 - 5, y: p[1] * 16 + 14, lv: i + 1, cx: p[0] * 16 + 8, cy: p[1] * 16 + 6, flat: true }));
    // instalaciones invasoras junto a portales contaminados
    d.portals.forEach((p, i) => { if (i < 10) this.obj.push({ k: 'pylon', x: p[0] * 16 + 30, y: p[1] * 16 - 6, reg: i }); });
    // aldea de Lirae
    (Lo.houses || [[-5, -3], [3, -3], [-6, 2], [4, 2], [-1, -5]]).forEach(([dx, dy], i) => { this.obj.push({ k: 'house', x: (vx + dx) * 16 - 6, y: (vy + dy) * 16 + 22, i }); for (let yy = 0; yy < 2; yy++) for (let xx = 0; xx < 3; xx++) { const bx = vx + dx + xx, by = vy + dy + yy; if (this.block[by]) this.block[by][bx] = 1; } });
    // pilares de ruinas cerca de Lirae
    const p4 = d.portals[3]; if (Lo.pillars !== false) for (let i = 0; i < 4; i++) { const px = p4[0] - 3 + i * 2, py = p4[1] - 3; this.obj.push({ k: 'pillar', x: px * 16, y: py * 16 + 16, broken: i % 2 }); if (this.block[py]) this.block[py][px] = 1; }
    // la nave
    this.obj.push({ k: 'ship', x: d.ship[0] * 16 - 8, y: d.ship[1] * 16 + 40 });
    for (let y = d.ship[1]; y < d.ship[1] + 2; y++) for (let x = d.ship[0]; x < d.ship[0] + 4; x++) this.block[y][x] = 1;
    // habitantes
    this.npcs = [];
    const lib = P.State.liberated(this.planet), civs = ['pleyadiano', 'pleyadiano', 'arturiano', 'reptiliano', 'andromedano', 'pleyadiano', 'lemuriano', 'reptiliano', 'arturiano', 'andromedano'];
    for (let i = 0; i < Math.min(10, lib); i++) {
      const civ = civs[i], near = i % 2 === 0 ? d.village : d.portals[i];
      const hx = (near[0] + R.int(-3, 3)) * 16, hy = (near[1] + R.int(2, 4)) * 16;
      this.npcs.push({ look: civ + (i % 3), civ, x: hx, y: hy, hx, hy, dir: 'down', f: 0, t: R.int(0, 100), mv: 0 });
    }
    const vip = d.vip || { look: 'sylae', civ: 'pleyadiano' };
    if (lib >= 4) this.npcs.push({ look: vip.look, civ: vip.civ, named: vip.look, x: vx * 16, y: (vy + 1) * 16, hx: vx * 16, hy: (vy + 1) * 16, dir: 'down', f: 0, t: 0, mv: 0 });
  }
  solidAt(px, py) { const tx = Math.floor(px / 16), ty = Math.floor(py / 16); if (tx < 0 || ty < 0 || tx >= this.W || ty >= this.H) return true; return this.block[ty][tx] === 1; }
  update() {
    const I = P.input, pl = this.pl, S = P.State; this.t++;
    if (I.pressed('pause')) { P.openUI(new P.PauseMenu(this)); return; }
    if (this.anim) { this.anim.r += 3; if (this.t % 2 === 0) { const a = Math.random() * 7; this.parts.add({ x: this.anim.x + Math.cos(a) * this.anim.r, y: this.anim.y + Math.sin(a) * this.anim.r, vy: -0.5, life: 40, col: P.pick(['#9cff6a', '#5ef0d0', '#ffd166']), size: 2, glow: 3 }); } if (this.anim.r > 260) { this.anim = null; P.toast('La selva se recupera alrededor del portal', { col: P.UIC.green, icon: 'i_leaf' }); } }
    let dx = (I.down('right') ? 1 : 0) - (I.down('left') ? 1 : 0), dy = (I.down('down') ? 1 : 0) - (I.down('up') ? 1 : 0);
    const sp = I.down('dash') ? 2.2 : 1.4;
    pl.moving = !!(dx || dy);
    if (dx && dy) { dx *= 0.707; dy *= 0.707; }
    if (dx) { const nx = pl.x + dx * sp; if (!this.solidAt(nx - 5, pl.y - 3) && !this.solidAt(nx + 5, pl.y - 3) && !this.solidAt(nx - 5, pl.y + 2) && !this.solidAt(nx + 5, pl.y + 2)) pl.x = nx; }
    if (dy) { const ny = pl.y + dy * sp; if (!this.solidAt(pl.x - 5, ny - 3) && !this.solidAt(pl.x + 5, ny - 3) && !this.solidAt(pl.x - 5, ny + 2) && !this.solidAt(pl.x + 5, ny + 2)) pl.y = ny; }
    if (Math.abs(dy) > Math.abs(dx)) pl.dir = dy > 0 ? 'down' : 'up'; else if (dx) { pl.dir = 'side'; pl.flip = dx < 0; }
    if (pl.moving) { pl.f += 0.12 * sp; if (Math.floor(pl.f * 2) % 4 === 0 && this.t % 12 === 0) P.Audio.sfx('step'); }
    // habitantes
    for (const n of this.npcs) {
      n.t++;
      const near = Math.hypot(n.x - pl.x, n.y - pl.y) < 30;
      if (near) { n.mv = 0; const ax = pl.x - n.x, ay = pl.y - n.y; n.dir = Math.abs(ay) > Math.abs(ax) ? (ay > 0 ? 'down' : 'up') : 'side'; n.flip = ax < 0; continue; }
      if (n.mv > 0) {
        n.mv--; const v = { down: [0, 1], up: [0, -1], side: [n.flip ? -1 : 1, 0] }[n.dir], nx = n.x + v[0] * 0.5, ny = n.y + v[1] * 0.5;
        if (!this.solidAt(nx, ny) && Math.hypot(nx - n.hx, ny - n.hy) < 60) { n.x = nx; n.y = ny; n.f += 0.08; } else n.mv = 0;
      } else if (n.t % 90 === 0 && Math.random() < 0.6) { n.dir = P.pick(['down', 'up', 'side']); n.flip = Math.random() < 0.5; n.mv = P.ri(30, 80); }
    }
    this.parts.update();
    // interacción
    this.focus = null;
    for (const o of this.obj) if (o.k === 'portal' && Math.hypot(o.cx - pl.x, o.cy - pl.y) < 18) this.focus = { k: 'portal', o };
    const sh = this.def.ship; if (Math.hypot(sh[0] * 16 + 28 - pl.x, sh[1] * 16 + 40 - pl.y) < 30) this.focus = { k: 'ship' };
    for (const n of this.npcs) if (Math.hypot(n.x - pl.x, n.y - pl.y) < 22) this.focus = { k: 'npc', n };
    if (this.focus && (I.pressed('interact') || I.pressed('confirm'))) this.use(this.focus);
    this.updateCam();
  }
  // nivel con jefe según los datos del nivel (en los planetas es el 11; en la Esfera, 5, 9, 13 y 14)
  isBossLv(id) { const l = P.LV[this.planet] && P.LV[this.planet].levels[id - 1]; return !!(l && l.boss); }
  use(f) {
    const S = P.State;
    if (f.k === 'portal') {
      const lv = f.o.lv;
      if (!S.lvUnlocked(this.planet, lv)) { P.Audio.sfx('back'); P.toast('Portal sellado: libera primero «' + P.LV[this.planet].levels[lv - 2].name + '»', { col: P.UIC.red }); return; }
      if (lv === 11 && this.planet !== 'dyson' && S.liberated(this.planet) < 10 && !P.settings.dev) { P.Audio.sfx('back'); P.toast('La energía de los 10 territorios es necesaria para abrir la Fosa', { col: P.UIC.red }); return; }
      P.Audio.sfx('door'); S.data.ow = { planet: this.planet, lv };
      const LD = P.LV[this.planet].levels[lv - 1]; if (LD && LD.scene && P[LD.scene]) { P.goto(new P[LD.scene](this.planet, lv)); return; }
      P.goto(new P.LevelScene(this.planet, lv));
    } else if (f.k === 'ship') { P.Audio.sfx('door'); S.autosave(); P.goto(new P.ShipScene('navegacion')); }
    else if (f.k === 'npc') {
      const n = f.n;
      if (n.named) P.openUI(new P.Dialog(this.def.vip && this.def.vip.talk ? this.def.vip.talk(P.State.liberated(this.planet)) : [['sylae', P.State.liberated(this.planet) >= 10 ? 'Toda la selva respira, {N}. Dicen que el Vellorn ha vuelto al Claro del Despertar...' : 'Lirae revive, {N}. Cada territorio liberado devuelve a alguien a casa.']]));
      else P.openUI(new P.Dialog([[n.look, P.pick(P.D.VILLAGER_LINES[n.civ]), P.CIV[n.civ].name.replace(/s$/, '')]]));
    }
  }
  updateCam(snap) {
    const tx = P.clamp(this.pl.x - P.W / 2, 0, this.W * 16 - P.W), ty = P.clamp(this.pl.y - P.H / 2, 0, this.H * 16 - P.H);
    if (snap) { this.cam.x = tx; this.cam.y = ty; } else { this.cam.x += (tx - this.cam.x) * 0.12; this.cam.y += (ty - this.cam.y) * 0.12; }
  }
  isRest(reg, x, y) {
    const r = this.regionRestored(reg);
    if (r === 'anim') return Math.hypot(x - this.anim.x, y - this.anim.y) < this.anim.r;
    return r;
  }
  draw(c) {
    const cx = Math.round(this.cam.x), cy = Math.round(this.cam.y), S = P.State;
    P.sprPrefix = this.A.p || '';
    c.fillStyle = '#0a0612'; c.fillRect(0, 0, P.W, P.H);
    const tx0 = Math.floor(cx / 16), ty0 = Math.floor(cy / 16);
    for (let ty = ty0; ty <= ty0 + 17; ty++) for (let tx = tx0; tx <= tx0 + 30; tx++) {
      if (ty < 0 || tx < 0 || ty >= this.H || tx >= this.W) continue;
      const g = this.g[ty][tx], X = tx * 16 - cx, Y = ty * 16 - cy, reg = this.regionOf(tx, ty), st = this.isRest(reg, tx * 16, ty * 16) ? 'r' : 'c';
      if (g === 'g') P.spr(c, 'o_grass_' + st, (tx * 3 + ty * 7) % 3, X, Y);
      else if (g === 'p') P.spr(c, 'o_path', (tx + ty) % 2, X, Y);
      else if (g === 's') P.spr(c, 'o_stone', 0, X, Y);
      else if (g === 'w') P.spr(c, 'o_water_' + st, Math.floor(this.t / 30 + tx) % 2, X, Y);
      else if (g === 'm') { const dn = ty + 1 < this.H && this.g[ty + 1][tx] !== 'm', up = ty > 0 && this.g[ty - 1][tx] !== 'm'; P.spr(c, 'o_cliff_' + st, dn ? 1 : up ? 2 : 0, X, Y); }
      else if (g === 'x') P.spr(c, 'o_crack_' + st, Math.floor(this.t / 40 + tx) % 2, X, Y);
      else if (g === 'i') P.spr(c, 'o_ice_' + st, (tx * 5 + ty * 3) % 2, X, Y);
    }
    if (P.OWD) P.OWD.draw(this, c, cx, cy, tx0, ty0);
    // objetos ordenados por profundidad
    const list = [];
    for (const o of this.obj) if (o.x > cx - 80 && o.x < cx + P.W + 40 && o.y > cy - 20 && o.y < cy + P.H + 60) list.push(o);
    for (const n of this.npcs) list.push({ k: 'npc', n, y: n.y + 6, x: n.x });
    list.push({ k: 'player', y: this.pl.y + 6 });
    list.sort((a, b) => (a.flat ? -1 : 0) - (b.flat ? -1 : 0) || a.y - b.y);
    for (const o of list) if (o.k === 'tree' || o.k === 'rock' || o.k === 'pillar' || o.k === 'npc' || o.k === 'player') { const ox = o.k === 'tree' ? o.x + 17 : o.k === 'npc' ? o.n.x : o.k === 'player' ? this.pl.x : o.x + 8, oy = o.k === 'tree' ? o.y - 1 : o.k === 'npc' || o.k === 'player' ? o.y - 2 : o.y - 1; c.fillStyle = 'rgba(8,4,20,0.22)'; c.beginPath(); c.ellipse(Math.round(ox - cx + 3), Math.round(oy - cy), o.k === 'tree' ? 11 : 6, 3, 0, 0, 7); c.fill(); }
    for (const o of list) this.drawObj(c, o, cx, cy);
    this.parts.draw(c, cx, cy);
    if (this.A.owDraw) this.A.owDraw(this, c, cx, cy);
    // luz ambiental
    const libF = S.liberated(this.planet) / 10;
    P.Light.begin(this.A.owAmb ? this.A.owAmb(libF) : 'rgba(10,4,24,' + (0.4 - libF * 0.28) + ')');
    P.Light.add(this.pl.x - cx, this.pl.y - cy, 80, 1);
    for (const o of list) if (o.k === 'portal' || o.k === 'lamp') P.Light.add(o.x + 12 - cx, o.y - 10 - cy, 40, 0.8); else if (o.k === 'bld' && o.lit) P.Light.add(o.x + 22 - cx, o.y - 16 - cy, 46, 0.75);
    P.Light.end(c);
    P.FX.post(c, P.FX.profOW(this));
    // HUD exterior
    P.sprPrefix = '';
    const pd = P.D.planet(this.planet), head = pd.name + ' · ' + pd.title;
    P.panel(c, 4, 4, Math.max(190, P.txtW(head) + 14), 28, { fill: 'rgba(6,12,26,0.8)', border: P.UIC.green, noAccent: true });
    P.txt(c, head, 10, 9, P.UIC.green);
    if (this.planet === 'dyson') { const n = P.LV.dyson.levels.filter(l => S.lvDone('dyson', l.id)).length; P.txt(c, 'Asalto a la Esfera: ' + n + '/' + P.LV.dyson.levels.length + ' sectores', 10, 20, '#c8d4e8'); }
    else P.txt(c, 'Territorios liberados: ' + S.liberated(this.planet) + '/10' + (S.data.planets[this.planet] && S.data.planets[this.planet].boss ? ' · ' + P.D.BOSSES[pd.boss].name + ' derrotado' : ''), 10, 20, '#c8d4e8');
    const f = this.focus;
    if (f) {
      let label = '', sub = '', col = P.UIC.cyan;
      if (f.k === 'portal') {
        const lv = P.LV[this.planet].levels[f.o.lv - 1], done = S.lvDone(this.planet, lv.id), un = S.lvUnlocked(this.planet, lv.id);
        const isB = this.isBossLv(lv.id);
        label = (isB ? 'JEFE · ' : lv.id + ' · ') + lv.name; sub = !un ? 'SELLADO' : done ? (isB ? 'Derrotado · volver a enfrentarlo' : 'LIBERADO · revisitar') : 'CONTAMINADO · entrar';
        col = !un ? P.UIC.red : done ? P.UIC.green : P.UIC.pink;
        const ls = S.lvState(this.planet, lv.id), nStars = (lv.stars || []).length;
        if (un && !isB) sub += ' · objetos ' + Object.keys(ls.stars).filter(k => k[0] === 's').length + '/' + Math.max(nStars, Object.keys(ls.stars).length);
      } else if (f.k === 'ship') { label = 'Vigía del Alba'; sub = 'Volver a la nave'; }
      else if (f.k === 'bld') { label = f.o.act.name; sub = f.o.act.verb; col = P.UIC.gold; }
      else { label = 'Hablar'; sub = ''; }
      const w = Math.max(P.txtW(label), P.txtW(sub)) + 50;
      P.panel(c, P.W / 2 - w / 2, P.H - 42, w, 30, { border: col });
      P.txt(c, label, P.W / 2, P.H - 37, '#ffffff', { align: 'center' });
      P.keyHint(c, P.W / 2 - w / 2 + 6, P.H - 25, 'interact', sub, col);
    }
  }
  drawObj(c, o, cx, cy) {
    const t = this.t;
    switch (o.k) {
      case 'tree': { const st = this.isRest(o.reg, o.x, o.y) ? 'r' : 'c', n = (P.SP('o_tree_' + st) || { f: [0, 0] }).f.length, fr = o.fr != null ? o.fr : (o.fr = P.hash(o.x + ':' + o.y + this.planet) % n), rig = P.BGL && P.BGL.owRigid[this.planet] && P.BGL.owRigid[this.planet].includes(fr); P.drawSway(c, 'o_tree_' + st, fr % n, o.x - cx, o.y - 40 - cy, { t, ph: o.x * 0.05 + o.y * 0.03, amp: rig ? 0 : 1.2, flutter: 0.3, step: 1, base: 40 }); break; }
      case 'rock': P.spr(c, 'o_rock', 0, o.x - cx, o.y - 16 - cy); break;
      case 'goo': if (this.isRest(o.reg, o.x, o.y)) P.spr(c, 'o_flower', o.v, o.x + 4 - cx, o.y - 12 - cy); else P.spr(c, 'o_goo', Math.floor(t / 30) % 2, o.x - cx, o.y - 16 - cy); break;
      case 'lamp': if (this.isRest(o.reg, o.x, o.y)) { P.drawGlow(c, o.x + 5 - cx, o.y - 12 - cy, 12, '#3fe0d0', 0.5); P.spr(c, 'o_lamp', Math.floor(t / 40) % 2, o.x - cx, o.y - 16 - cy); } break;
      case 'portal': {
        const S = P.State, done = S.lvDone(this.planet, o.lv), un = S.lvUnlocked(this.planet, o.lv);
        const isB = this.isBossLv(o.lv), fr = isB ? 3 : !un ? 0 : done ? 1 : 2;
        P.spr(c, 'o_portal', fr, o.x - cx, o.y - 20 - cy);
        P.drawGlow(c, o.x + 13 - cx, o.y - 9 - cy, 14 + Math.sin(t * 0.08 + o.lv) * 2, ['#b48cff', '#5ef0d0', '#ffd166', '#ff3040'][fr], 0.5);
        P.txt(c, isB ? '☠' : String(o.lv), o.x + 13 - cx, o.y - 30 - cy, done ? '#7dffa0' : un ? '#ffffff' : '#7c8aa8', { align: 'center', outline: true, shadow: '#000' });
        break;
      }
      case 'pylon': if (!this.isRest(o.reg, o.x, o.y + 20)) { P.spr(c, 'extractor', Math.floor(t / 20) % 2, o.x - cx, o.y - 54 + 20 - cy); c.globalAlpha = 0.3; c.fillStyle = '#c04ad0'; c.fillRect(o.x + 17 - cx, 0, 4, o.y - 54 + 20 - cy); c.globalAlpha = 1; } break;
      case 'house': P.spr(c, 'o_house', P.State.liberated(this.planet) > o.i + 3 ? 1 : 0, o.x - cx, o.y - 38 - cy); break;
      case 'pillar': P.spr(c, 'o_pillar', o.broken, o.x - cx, o.y - 30 - cy); break;
      case 'ship': c.fillStyle = 'rgba(0,0,0,0.25)'; c.beginPath(); c.ellipse(o.x + 48 - cx, o.y - 2 - cy, 40, 5, 0, 0, 7); c.fill(); P.spr(c, 'o_ship', Math.floor(t / 10) % 2, o.x - 12 - cx, o.y - 46 - cy + Math.sin(t * 0.03)); P.drawGlow(c, o.x - 6 - cx, o.y - 24 - cy, 8, '#6ae0ff', 0.6); break;
      case 'npc': { const n = o.n, fb = { down: 0, up: 3, side: 6 }[n.dir], fr = fb + (n.mv > 0 ? 1 + Math.floor(n.f * 2) % 2 : 0); P.spr(c, 'npct_' + n.look, fr, Math.round(n.x - 6 - cx), Math.round(n.y - 12 - cy), { flip: n.dir === 'side' && n.flip }); break; }
      case 'player': {
        const pl = this.pl, fb = { down: 0, up: 3, side: 6 }[pl.dir], fr = fb + (pl.moving ? 1 + Math.floor(pl.f * 2) % 2 : 0);
        c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(Math.round(pl.x - 5 - cx), Math.round(pl.y + 3 - cy), 10, 2);
        P.spr(c, 'herot_' + P.State.data.skin, fr, Math.round(pl.x - 8 - cx), Math.round(pl.y - 16 - cy), { flip: pl.dir === 'side' && pl.flip });
        break;
      }
    }
  }
};
