'use strict';
// NÉMESIS — la Unidad Oscura, jefa del Área I (El Dominio Exterior). El protocolo que Merek mandó activar en NÍVORAH:
// una unidad K con el núcleo ALBA invertido, espejo negro y carmesí de K-7. Lucha a ras de suelo y copia tus movimientos.
// Solo se la castiga de verdad cuando pierde el equilibrio: bloquea los disparos de frente con la guardia y recibe daño
// crítico durante la recuperación tras la embestida o el golpe. Fases: 1 duelo · 2 golpe sísmico y misiles · 3 sobrecarga.
P.Sprites.buildNemesis = function () {
  const A = ['#06060a', '#12121c', '#22222e', '#363648', '#56567a', '#8a8aac'], R = '#ff2a4a', RD = '#8a0a1e', V = '#ff6a7a';
  // pose: [desplazamiento del torso, pierna delantera, pierna trasera, brazo (0 abajo · 1 apuntando · 2 cruzado), inclinación]
  const POSE = [[0, 0, 0, 0, 0], [1, 0, 0, 0, 0], [0, 3, -3, 0, 1], [0, -3, 3, 0, 1], [0, 1, -1, 1, 0], [3, 6, -6, 1, 3], [1, 1, -1, 2, 0], [10, 2, 2, 0, 0]];
  P.mk('nemesis', 40, 44, 8, (p, f) => {
    const [by, lf, lb, arm, lean] = POSE[f], k = f === 7;
    // aletas dorsales (como cuernos barridos hacia atrás)
    for (const [ox, h, col] of [[14, 12, A[2]], [11, 9, A[1]]]) { p.tri(ox + lean, 8 + by, ox + 3 + lean, 10 + by, ox - 7 + lean, 8 + by - h, col); p.line(ox + lean, 8 + by, ox - 7 + lean, 8 + by - h, R); }
    // piernas
    if (!k) { p.thick(18 + lean, 30 + by, 18 + lb + lean, 43, 4, A[1]); p.thick(23 + lean, 30 + by, 23 + lf + lean, 43, 4, A[2]); p.px(18 + lb + lean, 37, R); p.px(23 + lf + lean, 37, R); p.rect(15 + lb + lean, 42, 6, 2, A[3]); p.rect(20 + lf + lean, 42, 6, 2, A[4]); }
    else { p.thick(16, 34, 12, 43, 4, A[1]); p.thick(24, 34, 30, 41, 4, A[2]); p.rect(28, 40, 7, 3, A[3]); }
    // torso con núcleo ALBA invertido
    p.rect(14 + lean, 15 + by, 14, 16, A[2]); p.rect(14 + lean, 15 + by, 1, 16, A[3]); p.rect(27 + lean, 15 + by, 1, 16, A[0]); p.line(16 + lean, 18 + by, 21 + lean, 28 + by, RD); p.line(26 + lean, 18 + by, 21 + lean, 28 + by, RD);
    p.ell(21 + lean, 21 + by, 3, 3, A[0]); p.ell(21 + lean, 21 + by, 2, 2, R); p.px(21 + lean, 20 + by, '#ffffff');
    // hombreras
    p.sell(13 + lean, 16 + by, 4, 3.4, [A[1], A[3], A[4], A[5]]); p.sell(28 + lean, 16 + by, 4, 3.4, [A[1], A[3], A[4], A[5]]); p.px(28 + lean, 14 + by, R);
    // cabeza: casco con visor rojo en ranura
    p.sell(21 + lean, 9 + by, 6, 6, [A[0], A[2], A[3], A[4]]); p.rect(18 + lean, 8 + by, 10, 3, '#0a0408'); p.rect(19 + lean, 9 + by, 8, 1, V); p.px(26 + lean, 9 + by, '#ffffff'); p.rect(17 + lean, 3 + by, 9, 2, A[3]); p.px(21 + lean, 3 + by, R);
    // brazos: el derecho es un cañón
    if (arm === 1) { p.rect(26 + lean, 18 + by, 13, 4, A[3]); p.rect(26 + lean, 18 + by, 13, 1, A[5]); p.rect(37 + lean, 19 + by, 2, 2, R); }
    else if (arm === 2) { p.rect(16 + lean, 19 + by, 14, 4, A[3]); p.rect(16 + lean, 19 + by, 14, 1, A[5]); p.rect(28 + lean, 17 + by, 3, 8, R); }
    else { p.rect(26 + lean, 18 + by, 4, 11, A[3]); p.rect(26 + lean, 27 + by, 6, 3, A[4]); p.px(31 + lean, 28 + by, R); }
    p.rect(11 + lean, 18 + by, 4, 10, A[1]);
  });
  P.mk('por_nemesis', 32, 32, 1, p => { p.rect(0, 0, 32, 32, '#06060a'); p.sell(16, 17, 11, 12, [A[0], A[2], A[3], A[4]]); p.rect(8, 14, 17, 5, '#0a0408'); p.rect(9, 15, 15, 2, V); p.px(22, 15, '#ffffff'); p.tri(6, 10, 9, 12, 1, 0, A[2]); p.line(6, 10, 1, 0, R); p.rect(10, 5, 12, 3, A[3]); p.px(16, 5, R); });
};
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildNemesis(); }; })();
P.ARENAS = P.ARENAS || {}; P.ARENAS.nemesis = P.BOSS_ARENA.slice();

// misil buscador: lento, gira hacia el jugador y se puede derribar
P.NemMissile = class extends P.Ent {
  constructor(L, x, y, a) { super(L, x - 3, y - 3, 7, 7); this.a = a; this.v = 1.5; this.isEnemy = true; this.hp = 1; this.harmless = true; this.life = 300; }
  hit() { this.boom(); }
  boom() { if (this.dead) return; this.dead = true; const L = this.L; P.Audio.sfx('explode'); L.parts.burst(this.cx, this.cy, 12, { col: P.pick(['#ff2a4a', '#ffd166', '#ffffff']), smin: 1, smax: 3, glow: 3 }); L.fx.push({ k: 'ring', x: this.cx, y: this.cy, t: 0, life: 14, r: 18, col: '#ff2a4a' }); }
  update() { this.t++; const L = this.L, p = L.player; if (--this.life <= 0) return this.boom(); const ta = Math.atan2(p.cy - this.cy, p.cx - this.cx); let da = ta - this.a; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2; this.a += P.clamp(da, -0.035, 0.035); this.v = Math.min(2.6, this.v + 0.01); this.x += Math.cos(this.a) * this.v; this.y += Math.sin(this.a) * this.v;
    if (this.t % 2 === 0) L.parts.add({ x: this.cx - Math.cos(this.a) * 4, y: this.cy - Math.sin(this.a) * 4, life: 14, col: P.pick(['#ff8a9a', '#5e6a86']), size: 1 });
    if (!p.dead && P.overlap(this, p)) { p.hurt(10, this.cx); this.boom(); } if (L.coll(Math.floor(this.cx / 16), Math.floor(this.cy / 16)) === 1) this.boom(); }
  draw(c, cx, cy) { const x = Math.round(this.cx - cx), y = Math.round(this.cy - cy); c.fillStyle = '#8a8aac'; c.fillRect(x - 2, y - 1, 5, 3); c.fillStyle = (this.t >> 2) % 2 ? '#ffffff' : '#ff2a4a'; c.fillRect(Math.round(x + Math.cos(this.a) * 3), Math.round(y + Math.sin(this.a) * 3), 2, 2); P.drawGlow(c, x, y, 8, '#ff2a4a', 0.4); }
};
// eco de sobrecarga: silueta que cruza la arena a ras de suelo tras marcar su recorrido
P.NemClone = class extends P.Ent {
  constructor(L, dir, delay, y) { super(L, dir > 0 ? L.minX - 30 : L.maxX + 10, y, 20, 40); this.dir = dir; this.delay = delay; }
  update() { this.t++; const L = this.L, p = L.player; if (this.t < this.delay) return; this.x += this.dir * 8; if (!p.dead && P.overlap(this, p)) p.hurt(12, this.cx); if (this.x < L.minX - 60 || this.x > L.maxX + 40) this.dead = true; }
  draw(c, cx, cy) { const y = Math.round(this.y - cy); if (this.t < this.delay) { c.globalAlpha = 0.25 + ((this.t >> 2) % 2) * 0.25; c.fillStyle = '#ff2a4a'; c.fillRect(0, y + 18, P.W, 2); c.globalAlpha = 1; return; } for (let k = 0; k < 4; k++) { c.globalAlpha = 0.6 - k * 0.14; P.spr(c, 'nemesis', 5, Math.round(this.x - cx - this.dir * k * 10) - 10, y - 4, { flip: this.dir < 0, sil: '#ff2a4a' }); } c.globalAlpha = 1; }
};

P.Nemesis = class extends P.Enemy {
  constructor(L, x, floorY) {
    super(L, 330, -80, 20, 40, { kind: null, hp: 1500, dmg: 12, xp: 450, beast: false, cyber: true, spr: 'nemesis', heavy: true });
    this.maxhp = this.hp = 1500; this.boss = true; this.floorY = floorY; this.face = -1; this.state = 'intro'; this.st = 0; this.phase = 1; this.cd = 60; this.active = false;
    this.name = 'NÉMESIS'; this.title = 'La Unidad Oscura'; this.glowCol = '#ff2a4a'; this.trail = []; this.blocks = 0; this.last = ''; this.frame = 0;
  }
  get spd() { return [1, 1, 1.2, 1.4][this.phase]; }
  hit(d, o = {}) {
    if (this.dead || this.dying || !this.active || this.state === 'shift' || this.state === 'roar') return;
    const front = o.x == null || Math.sign(o.x - this.cx) === this.face;
    if (this.state === 'guard' && front) { this.blocks++; this.flash = 2; if (this.t - (this.noT || -99) > 20) { this.noT = this.t; this.L.popups.push({ x: this.cx, y: this.y - 8, text: 'BLOQUEADO', col: '#8a98b8', t: 0 }); } P.Audio.sfx('block'); this.L.parts.burst(this.cx + this.face * 12, this.cy, 4, { col: '#ff8a9a', smin: 0.5, smax: 2, glow: 2 }); return; }
    const crit = this.state === 'recover'; if (crit) { d *= 1.6; o = Object.assign({}, o, { crit: true }); }
    super.hit(d, Object.assign({}, o, { knock: 0 }));
    if (!this.dying && !this.dead) { const f = this.hp / this.maxhp; if (this.phase === 1 && f < 0.66) this.toPhase(2); else if (this.phase === 2 && f < 0.33) this.toPhase(3); }
  }
  toPhase(n) { this.phase = n; this.state = 'shift'; this.st = 0; this.vx = 0; this.trail = []; P.shake(7, 30); P.Audio.sfx('roar'); this.L.fx.push({ k: 'ring', x: this.cx, y: this.cy, t: 0, life: 40, r: 140, col: '#ff2a4a' }); for (const e of this.L.ents) if (e instanceof P.NemMissile || e instanceof P.NemClone) e.dead = true;
    this.L.popups.push({ x: this.cx, y: this.y - 20, text: n === 2 ? '«¿ESO ES TODO, K-7?»' : '«SOBRECARGA ALBA: 100 %»', col: '#ff8a9a', t: 0, big: true }); }
  die() {
    if (this.dying) return; this.dying = true; this.hp = 0; this.state = 'death'; this.st = 0; this.vx = 0; this.isEnemy = false; this.untouchable = true; this.L.player.iframes = 400;
    for (const e of this.L.ents) if ((e instanceof P.NemMissile || e instanceof P.NemClone) || (e.isEnemy && e !== this && !e.passive)) e.dead = true; P.Audio.sfx('roar');
  }
  pick() {
    const ph = this.phase, pool = ph === 1 ? ['burst', 'dash', 'guard', 'burst', 'dash'] : ph === 2 ? ['burst', 'dash', 'guard', 'slam', 'missiles', 'slam'] : ['dash', 'slam', 'missiles', 'clones', 'sweep', 'clones', 'burst'];
    let a = P.pick(pool); if (a === this.last) a = P.pick(pool); this.last = a; this.state = a; this.st = 0; this.vx = 0;
  }
  shoot(spd, dy = 0) { const L = this.L; L.add(new P.Proj(L, this.cx + this.face * 16, this.y + 18 + dy, this.face * spd, 0, { dmg: 10, spr: 'b_kspine', w: 10, h: 4, life: 120, glow: '#ff2a4a' })); P.Audio.sfx('laser'); L.parts.burst(this.cx + this.face * 18, this.y + 19, 4, { col: '#ff8a9a', smin: 0.5, smax: 1.5, glow: 2 }); }
  update() {
    const L = this.L, p = L.player, fy = this.floorY, ph = this.phase, spd = this.spd;
    this.t++; this.st++; if (this.flash > 0) this.flash--;
    if (this.state === 'dash' || this.state === 'slam') { this.trail.push([this.x, this.y]); if (this.trail.length > 6) this.trail.shift(); } else if (this.trail.length && this.t % 2 === 0) this.trail.shift();
    const toward = Math.sign(p.cx - this.cx) || 1, dist = Math.abs(p.cx - this.cx);
    switch (this.state) {
      case 'intro': this.y = -80; break;
      case 'roar': // desciende con los propulsores encendidos
        if (this.y + this.h < fy) { this.y = Math.min(fy - this.h, this.y + 3.2); if (this.t % 2 === 0) L.parts.add({ x: this.cx + P.rand(-5, 5), y: this.y + this.h, vy: P.rand(1, 3), life: 18, col: P.pick(['#ff2a4a', '#ffd166']), size: 2, glow: 3 }); }
        else if (!this.landed) { this.landed = true; this.st = 0; P.Audio.sfx('bigexplode'); P.shake(8, 24); L.fx.push({ k: 'ring', x: this.cx, y: fy, t: 0, life: 30, r: 90, col: '#ff2a4a' }); L.popups.push({ x: this.cx, y: this.y - 14, text: '«UNIDAD K-7. OBJETIVO CONFIRMADO.»', col: '#ff8a9a', t: 0 }); }
        else if (this.st > 60) { this.state = 'idle'; this.cd = 40; } this.face = toward; break;
      case 'idle': { this.face = toward; const want = dist > 150 ? toward : dist < 90 ? -toward : 0; this.vx = want * 1.1 * spd; if (--this.cd <= 0) this.pick(); this.gravityMove(); break; }
      case 'burst': { this.face = toward; this.vx = 0; const n = 2 + ph, aim = 18 / spd; if (this.st > aim && (this.st - aim) % 9 === 0 && (this.st - aim) / 9 < n) this.shoot(4.4 + ph * 0.3, ph === 3 && (this.st >> 3) % 2 ? -10 : 0); if (this.st > aim + n * 9 + 20) { this.state = 'idle'; this.cd = 50 / spd; } this.gravityMove(); break; }
      case 'dash': { // se agacha (aviso: línea roja en el suelo) y embiste hasta la pared; luego queda expuesta
        if (this.st === 1) { this.face = toward; this.ddir = toward; P.Audio.sfx('charge'); }
        if (this.st < 24 / spd) { this.vx = 0; this.gravityMove(); break; }
        this.vx = this.ddir * (6.5 + ph * 0.5); this.gravityMove(); this.dmgNow = 18;
        if (this.hitWall || this.x < L.minX + 4 || this.x + this.w > L.maxX - 4) { this.vx = 0; this.state = 'recover'; this.st = 0; P.shake(4, 10); P.Audio.sfx('hit'); this.dmgNow = 0; if (!L.nemTip) { L.nemTip = true; P.toast('¡NÉMESIS ha perdido el equilibrio! Ahora recibe daño crítico', { col: P.UIC.gold, life: 120 }); } }
        break; }
      case 'recover': this.vx = 0; this.gravityMove(); if (this.st > (ph === 3 ? 38 : 50)) { this.state = 'idle'; this.cd = 30; } break;
      case 'guard': { this.face = toward; this.vx = 0; this.gravityMove(); if (this.st > 80 || this.blocks >= 4) { const counter = this.blocks >= 2; this.blocks = 0; if (counter) { this.state = 'riposte'; this.st = 0; } else { this.state = 'idle'; this.cd = 30; } } break; }
      case 'riposte': // contragolpe tras bloquear: onda a ras de suelo
        this.vx = 0; this.gravityMove(); if (this.st === 10) { P.Audio.sfx('bigexplode'); P.shake(4, 12); this.waves = (this.waves || []).concat([{ x: this.cx, d: this.face, t: 0 }]); } if (this.st > 30) { this.state = 'idle'; this.cd = 40; } break;
      case 'slam': { // salta sobre el jugador y golpea el suelo: ondas a los dos lados; luego queda expuesta
        if (this.st === 1) { this.vy = -9; this.tx = P.clamp(p.cx, L.minX + 30, L.maxX - 30); this.onGround = false; P.Audio.sfx('dash'); }
        if (this.st < 40 && this.y + this.h < fy - 2) { this.x += (this.tx - this.cx) * 0.1; this.vy = Math.min(this.vy + 0.35, this.st > 26 ? 10 : 3); this.y += this.vy; if (this.st > 26 && this.st < 30) this.vy = 9; }
        else { if (this.y + this.h >= fy - 2 && !this.slammed) { this.slammed = true; this.y = fy - this.h; P.Audio.sfx('bigexplode'); P.shake(9, 22); L.fx.push({ k: 'ring', x: this.cx, y: fy, t: 0, life: 26, r: 70, col: '#ff2a4a' }); this.waves = (this.waves || []).concat([{ x: this.cx, d: -1, t: 0 }, { x: this.cx, d: 1, t: 0 }]); if (!p.dead && Math.abs(p.cx - this.cx) < 26 && p.y + p.h > fy - 30) p.hurt(16, this.cx); }
          if (this.slammed) { this.state = 'recover'; this.st = 0; this.slammed = false; } else this.y = Math.min(fy - this.h, this.y + 6); }
        break; }
      case 'missiles': this.face = toward; this.vx = 0; this.gravityMove(); if (this.st % 14 === 0 && this.st <= 14 * (2 + ph)) { L.add(new P.NemMissile(L, this.cx - this.face * 6, this.y + 2, -Math.PI / 2 + this.face * 0.4 + P.rand(-0.3, 0.3))); P.Audio.sfx('spine'); } if (this.st > 14 * (2 + ph) + 40) { this.state = 'idle'; this.cd = 40; } break;
      case 'clones': // dos ecos marcan su carril y cruzan la arena; luego embiste ella
        this.vx = 0; this.gravityMove(); if (this.st === 1) { L.add(new P.NemClone(L, 1, 40, fy - 40)); L.add(new P.NemClone(L, -1, 70, fy - 40)); P.Audio.sfx('charge'); } if (this.st > 110) { this.state = 'dash'; this.st = 0; } break;
      case 'sweep': { // carga un haz que barre la arena a una altura (baja: salta · alta: quédate en el suelo)
        if (this.st === 1) { this.high = Math.random() < 0.5; this.face = toward; P.Audio.sfx('charge'); } this.vx = 0; this.gravityMove();
        const by = this.high ? fy - 34 : fy - 10, warn = 44; this.beam = { y: by, warn: this.st < warn, on: this.st >= warn && this.st < warn + 34 };
        if (this.beam.on && !p.dead && p.y < by + 3 && p.y + p.h > by - 3) p.hurt(14, this.cx);
        if (this.st >= warn + 34) { this.beam = null; this.state = 'recover'; this.st = 10; } break; }
      case 'shift': // transición de fase: se arrodilla, la armadura se agrieta y se levanta más rápida
        this.vx = 0; this.gravityMove(); if (this.st % 6 === 0) L.parts.add({ x: this.cx + P.rand(-10, 10), y: this.cy + P.rand(-14, 14), vy: -P.rand(0.5, 1.5), life: 30, col: P.pick(['#ff2a4a', '#ffd166', '#ffffff']), size: 1, glow: 3 }); if (this.st > 80) { this.state = 'idle'; this.cd = 30; } break;
      case 'death':
        this.vx = 0; this.gravityMove(); if (this.st % 7 === 0) { P.Audio.sfx('explode'); L.parts.burst(this.cx + P.rand(-12, 12), this.cy + P.rand(-16, 10), 8, { col: P.pick(['#ff2a4a', '#ffd166', '#ffffff', '#56567a']), smin: 1, smax: 3, glow: 3 }); }
        if (this.st === 40) L.popups.push({ x: this.cx, y: this.y - 16, text: '«…K-7…»', col: '#ff8a9a', t: 0 });
        if (this.st === 130) { P.Audio.sfx('bigexplode'); P.shake(10, 30); L.fx.push({ k: 'ring', x: this.cx, y: this.cy, t: 0, life: 40, r: 120, col: '#ff2a4a' }); this.dead = true; P.drop(L, this.cx, this.cy, { xp: 450, crys: 10, scrap: 20 }); L.onBossDefeated(this); }
        break;
    }
    if (this.state !== 'sweep') this.beam = null;
    // ondas de choque a ras de suelo
    if (this.waves) { for (const w of this.waves) { w.t++; w.x += w.d * (3 + ph * 0.4); if (!p.dead && Math.abs(p.cx - w.x) < 9 && p.y + p.h > fy - 16) p.hurt(12, w.x - w.d * 10); if (w.t % 2 === 0) L.parts.add({ x: w.x, y: fy - 2, vy: -P.rand(1, 2.5), life: 14, col: P.pick(['#ff2a4a', '#ffffff']), size: 1 }); } this.waves = this.waves.filter(w => w.x > L.minX - 10 && w.x < L.maxX + 10); }
    // contacto
    if (this.active && !this.dying && !p.dead && P.overlap(this, p) && ['dash', 'slam', 'idle', 'burst'].includes(this.state)) p.hurt(this.state === 'dash' ? 18 : 10, this.cx);
    if (this.x < L.minX + 2) this.x = L.minX + 2; if (this.x + this.w > L.maxX - 2) this.x = L.maxX - 2 - this.w;
    this.frame = this.state === 'death' || this.state === 'shift' || this.state === 'recover' ? 7 : this.state === 'guard' ? 6 : this.state === 'dash' && this.st >= 24 / this.spd ? 5 : this.state === 'dash' ? 7 : this.state === 'burst' || this.state === 'riposte' || this.state === 'sweep' ? 4 : Math.abs(this.vx) > 0.2 ? 2 + ((this.t >> 3) % 2) : (this.t >> 5) % 2;
  }
  draw(c, cx, cy) {
    if (this.dead) return; const L = this.L, fy = this.floorY;
    // estelas
    this.trail.forEach(([tx, ty], i) => { c.globalAlpha = 0.12 + i * 0.06; P.spr(c, 'nemesis', 5, Math.round(tx + this.w / 2 - 20 - cx), Math.round(ty + this.h - 44 - cy), { flip: this.face < 0, sil: '#ff2a4a' }); }); c.globalAlpha = 1;
    // avisos
    if (this.state === 'dash' && this.st < 24 / this.spd) { c.globalAlpha = 0.3 + ((this.st >> 2) % 2) * 0.3; c.fillStyle = '#ff2a4a'; const x0 = this.ddir > 0 ? this.cx : L.minX, x1 = this.ddir > 0 ? L.maxX : this.cx; c.fillRect(Math.round(x0 - cx), Math.round(fy - 20 - cy), Math.round(x1 - x0), 1); c.globalAlpha = 1; }
    if (this.state === 'slam' && this.st < 30) { c.globalAlpha = 0.4; c.fillStyle = '#ff2a4a'; c.fillRect(Math.round(this.tx - 14 - cx), Math.round(fy - 2 - cy), 28, 2); c.globalAlpha = 1; }
    if (this.beam) { const y = Math.round(this.beam.y - cy); if (this.beam.warn) { c.globalAlpha = 0.25 + ((this.st >> 2) % 2) * 0.3; c.fillStyle = '#ffd166'; c.fillRect(0, y, P.W, 1); c.globalAlpha = 1; P.drawGlow(c, this.cx + this.face * 16 - cx, this.y + 18 - cy, 10 + this.st * 0.3, '#ff2a4a', 0.6); } if (this.beam.on) P.Energy.laser(c, this.face > 0 ? this.cx + 16 - cx : 0, y, this.face > 0 ? P.W : this.cx - 16 - cx, y, this.t, '#ff2a4a', 4); }
    // cuerpo
    const s = P.S.nemesis, x = Math.round(this.cx - 20 - cx), y = Math.round(this.y + this.h - 44 - cy);
    if (this.state === 'recover') P.drawGlow(c, x + 20, y + 22, 26, '#ffd166', 0.4 + ((this.t >> 2) % 2) * 0.2);
    P.AnimFX.boss(c, this, 'nemesis', this.frame, x, y, { flip: this.face < 0, flash: this.flash > 0 }, cx, cy, { dis: [60, 130], noTrail: true });
    // núcleo: brilla más a cada fase · grietas desde la fase 2
    P.drawGlow(c, x + 20 + (this.face < 0 ? 0 : 1), y + 21, 6 + this.phase * 3, '#ff2a4a', 0.35 + this.phase * 0.1);
    if (this.phase >= 2) { c.fillStyle = this.phase === 3 ? '#ffd166' : '#ff2a4a'; c.fillRect(x + 16, y + 16, 1, 3); c.fillRect(x + 24, y + 24, 1, 2); }
    if (this.phase === 3 && !this.dying) P.Energy.arc(c, x + 10, y + 6, x + 30, y + 30, this.t, '#ff8a9a', 1, 4);
    if (this.state === 'guard') P.Energy.shield(c, x + 20 + this.face * 10, y + 22, 18, this.t, '#ff2a4a', this.flash > 0 ? 1 : 0);
    if (this.waves) for (const w of this.waves) { const wx = Math.round(w.x - cx), wy = Math.round(fy - cy); c.fillStyle = '#ffffff'; for (let k = 0; k < 7; k++) c.fillRect(wx - w.d * k * 2, wy - 14 + k * 2, 2, 2); P.drawGlow(c, wx, wy - 6, 12, '#ff2a4a', 0.5); }
  }
};
P.BOSS_CLASS = P.BOSS_CLASS || {}; P.BOSS_CLASS.nemesis = P.Nemesis;
