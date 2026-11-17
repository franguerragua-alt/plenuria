'use strict';
// KRAZTHOR — Cangrejo Espinado Gigante (jefe de VÉRZARA). Tres fases.
P.Krazthor = class extends P.Enemy {
  constructor(L, x, floorY) {
    super(L, x - 42, floorY - 56, 84, 56, { kind: 'krazthor', hp: 900, dmg: 18, xp: 300, beast: true, spr: 'krazthor', heavy: true });
    this.maxhp = this.hp = 1000;
    this.boss = true; this.floorY = floorY; this.face = -1; this.state = 'intro'; this.st = 0; this.phase = 1; this.cd = 80; this.overheat = 0; this.lasers = 0; this.active = false;
    this.name = 'KRAZTHOR'; this.title = 'Cangrejo Espinado Gigante'; this.sink = 0; this.beam = null; this.lastAtk = '';
  }
  get cannon() { // zona del cañón (punto débil)
    return { x: this.face > 0 ? this.cx - 34 : this.cx - 26, y: this.y - 48 + this.sink, w: 60, h: 40 };
  }
  hit(d, o = {}) {
    if (this.dead || this.untouchable || !this.active) return;
    if (this.overheat > 0) d *= 1.5;
    if (this.overheat > 0 && o.proj && P.overlap(o.proj, this.cannon)) { d *= 1.6; this.L.popups.push({ x: this.cx, y: this.y - 34, text: '¡PUNTO DÉBIL!', col: '#ffd166', t: 0 }); }
    super.hit(d, Object.assign({}, o, { knock: 0 }));
    const f = this.hp / this.maxhp;
    if (this.phase === 1 && f < 0.66) this.toPhase(2);
    else if (this.phase === 2 && f < 0.33) this.toPhase(3);
  }
  toPhase(n) {
    this.phase = n; this.state = 'roar'; this.st = 0; P.Audio.sfx('roar'); P.shake(6, 40);
    if (n === 3) { this.spr = 'krazthor_c'; this.L.parts.burst(this.cx, this.y, 30, { col: '#ff5af0', smin: 1, smax: 4, g: 0.1, lmin: 20, lmax: 40 }); }
    this.L.popups.push({ x: this.cx, y: this.y - 40, text: n === 2 ? '¡KRAZTHOR SE ENFURECE!' : '¡EL CAPARAZÓN SE QUIEBRA!', col: '#ff8ad8', t: 0, big: true });
  }
  die() {
    if (this.dying) return;
    this.dying = true; this.hp = 0; this.state = 'death'; this.st = 0; this.isEnemy = false; this.untouchable = true;
    P.State.task('krazthor', 'defeat'); P.State.data.stats.kills++;
    P.Audio.sfx('roar'); this.L.player.iframes = 400;
    for (const e of this.L.ents) if (e.isEnemy && e !== this && !e.dead) e.die();
  }
  pick() {
    const p = this.L.player, dx = p.cx - this.cx, ph = this.phase;
    const opts = [];
    if (Math.abs(dx) < 90) opts.push('snap', 'snap');
    opts.push('spines', 'laser', 'walk');
    if (ph >= 2) opts.push('burrow', 'homing', 'summon');
    if (ph >= 3) opts.push('slam', 'laser', 'burrow');
    let a = P.pick(opts); if (a === this.lastAtk && Math.random() < 0.7) a = P.pick(opts);
    if (a === 'summon' && this.L.ents.filter(e => e instanceof P.Crab && !e.dead).length >= 3) a = 'spines';
    this.lastAtk = a; this.state = a; this.st = 0;
  }
  update() {
    const L = this.L, p = L.player; this.t++; if (this.flash > 0) this.flash--;
    if (this.poisonT > 0) { this.poisonT--; if (this.poisonT % 30 === 0 && this.active) super.hit(2, {}); }
    if (!this.seen && this.onScreen()) { this.seen = true; P.State.see('krazthor'); }
    if (this.overheat > 0) { this.overheat--; if (this.t % 3 === 0) { const c = this.cannon; L.parts.add({ x: c.x + P.rand(0, c.w), y: c.y, vy: -P.rand(0.5, 1.5), life: 30, col: P.pick(['#ffd166', '#ff8a3a', '#ffffff']), size: 2, glow: 3 }); } }
    this.st++;
    const dx = p.cx - this.cx, spd = this.phase === 3 ? 1.35 : 1;
    switch (this.state) {
      case 'intro': return;
      case 'idle': this.vx *= 0.8; if (--this.cd <= 0) this.pick(); break;
      case 'roar': this.vx = 0; if (this.st > 70) { this.state = 'idle'; this.cd = 30; } if (this.st % 10 === 0) P.shake(3, 8); break;
      case 'walk': this.face = Math.sign(dx) || this.face; this.vx = this.face * 0.9 * spd; if (this.st > 70 || Math.abs(dx) < 60) { this.state = 'idle'; this.cd = 20; } break;
      case 'snap':
        this.face = this.st < 20 ? (Math.sign(dx) || this.face) : this.face; this.vx = 0;
        if (this.st === 26 || (this.phase === 3 && this.st === 46)) {
          P.Audio.sfx('hit'); P.shake(3, 8);
          const box = { x: this.face > 0 ? this.x + this.w - 10 : this.x - 40, y: this.floorY - 34, w: 50, h: 30 };
          if (P.overlap(box, p)) p.hurt(22, this.cx);
          L.parts.burst(box.x + box.w / 2, box.y + 20, 8, { col: '#b6f59a', smin: 1, smax: 3 });
        }
        if (this.st > (this.phase === 3 ? 60 : 44)) { this.state = 'idle'; this.cd = 35 / spd; }
        break;
      case 'spines':
        this.vx = 0;
        if (this.st % 18 === 0 && this.st <= 18 * (this.phase + 1)) {
          P.Audio.sfx('spine');
          const n = 3 + this.phase;
          for (let i = 0; i < n; i++) { const vx = P.clamp(dx / 70, -3.5, 3.5) + (i - (n - 1) / 2) * 0.9; L.add(new P.Proj(L, this.cx, this.y - 6, vx, -5.2 - Math.random(), { dmg: 12, spr: 'b_kspine', grav: 0.16, life: 160, rot: true })); }
        }
        if (this.st > 18 * (this.phase + 1) + 30) { this.state = 'idle'; this.cd = 40 / spd; }
        break;
      case 'laser': {
        this.vx = 0; if (this.st < 10) this.face = Math.sign(dx) || this.face;
        const charge = this.phase === 3 ? 42 : 58;
        const high = this.phase === 3 && this.lasers % 2 === 1;
        // rayo bajo: agáchate para esquivarlo · rayo alto: barre las plataformas
        const by = high ? this.floorY - 70 : this.floorY - 22, bh = high ? 14 : 8;
        if (this.st === 1) P.Audio.sfx('charge');
        if (this.st < charge) this.beam = { tele: true, y: by, h: bh, a: this.st / charge };
        else if (this.st === charge) { P.Audio.sfx('laser'); P.shake(5, 30); }
        if (this.st >= charge && this.st < charge + 34) {
          this.beam = { tele: false, y: by, h: bh, a: 1 };
          const bx0 = this.face > 0 ? this.cx + 40 : L.minX, bx1 = this.face > 0 ? L.maxX : this.cx - 40;
          const box = { x: bx0, y: by, w: bx1 - bx0, h: bh };
          if (P.overlap(box, p) && !p.dead) { if (p.blockCheck(this.cx) && p.st.reflect && p.parryT < p.st.parryWin) { this.overheat = 200; } else p.hurt(20, this.cx); }
        }
        if (this.st >= charge + 34) { this.beam = null; this.lasers++; if (this.phase >= 2 && this.lasers % 2 === 0 || this.phase === 3) { this.state = 'vent'; this.st = 0; } else { this.state = 'idle'; this.cd = 40; } }
        break;
      }
      case 'vent': this.vx = 0; if (this.st === 1) { this.overheat = 170; P.toast('¡El cañón se sobrecalienta! Dispara al núcleo', { col: P.UIC.gold, life: 120 }); P.Audio.sfx('door'); } if (this.st > 150) { this.state = 'idle'; this.cd = 20; } break;
      case 'burrow':
        this.vx = 0;
        if (this.st < 30) { this.sink = this.st * 3.5; if (this.st % 4 === 0) L.parts.burst(this.cx + P.rand(-40, 40), this.floorY, 3, { col: '#6a5040', smin: 1, smax: 2.5, g: 0.15 }); }
        else if (this.st < 110) {
          this.sink = 104; this.untouchable = true; this.x += P.clamp(p.cx - this.cx, -2.6 * spd, 2.6 * spd);
          if (this.st % 3 === 0) L.parts.add({ x: this.cx + P.rand(-14, 14), y: this.floorY - 1, vy: -P.rand(1, 2.5), life: 20, col: '#c8ff4a', size: 2 });
          if (this.st > 70 && this.st % 10 === 0) P.Audio.sfx('step');
        } else if (this.st === 110) {
          this.untouchable = false; P.Audio.sfx('explode'); P.shake(7, 20);
          const box = { x: this.cx - 34, y: this.floorY - 50, w: 68, h: 50 }; if (P.overlap(box, p)) p.hurt(24, this.cx);
          for (let i = 0; i < 6; i++) L.add(new P.Proj(L, this.cx, this.floorY - 20, (i - 2.5) * 1.3, -5, { dmg: 10, spr: 'b_kspine', grav: 0.18, life: 140, rot: true }));
          L.parts.burst(this.cx, this.floorY, 30, { col: '#6a5040', smin: 1, smax: 5, g: 0.2, size: 2 });
        } else { this.sink = Math.max(0, 104 - (this.st - 110) * 6); if (this.sink === 0) { this.state = 'idle'; this.cd = 40; } }
        break;
      case 'homing':
        this.vx = 0;
        if (this.st === 20 || this.st === 35 || this.st === 50) {
          const c = this.cannon, sx = this.face > 0 ? c.x + c.w : c.x;
          const pr = new P.Proj(L, sx, c.y + 4, this.face * 2, -1.5, { dmg: 11, spr: 'b_orb', life: 200, w: 8, h: 8, glow: '#ff5af0' });
          pr.homing = true; const up = pr.update.bind(pr);
          pr.update = function () { if (this.homing && this.t < 110 && this.owner === 'e') { const a = Math.atan2(p.cy - this.cy, p.cx - this.cx); this.vx += Math.cos(a) * 0.09; this.vy += Math.sin(a) * 0.09; const s = Math.hypot(this.vx, this.vy); if (s > 2.4) { this.vx *= 2.4 / s; this.vy *= 2.4 / s; } } up(); };
          L.add(pr); P.Audio.sfx('eshoot');
        }
        if (this.st > 70) { this.state = 'idle'; this.cd = 40; }
        break;
      case 'summon':
        this.vx = 0;
        if (this.st === 30) { P.Audio.sfx('roar'); for (const s of [-1, 1]) { const cr = new P.Crab(L, P.clamp(this.cx + s * 150, L.minX + 20, L.maxX - 40), this.floorY - 4, this.phase === 3); L.add(cr); L.parts.burst(cr.cx, this.floorY, 10, { col: '#6a5040', smin: 1, smax: 3, g: 0.2 }); } }
        if (this.st > 60) { this.state = 'idle'; this.cd = 40; }
        break;
      case 'slam':
        if (this.st === 15) { this.vy = -7.5; this.vx = P.clamp(dx / 45, -3, 3); }
        if (this.st > 16) {
          this.vy = Math.min(this.vy + 0.32, 9); this.x += this.vx; this.y += this.vy;
          if (this.y + this.h >= this.floorY) {
            this.y = this.floorY - this.h; this.vy = 0; this.vx = 0; P.Audio.sfx('bigexplode'); P.shake(8, 24);
            for (const s of [-1, 1]) for (let k = 0; k < 2; k++) L.add(new P.Proj(L, this.cx + s * 40, this.floorY - 6, s * (2.6 + k * 1.2), 0, { dmg: 14, spr: 'b_orb', life: 120, w: 10, h: 10, glow: '#ff5af0' }));
            this.state = 'idle'; this.cd = 45;
          }
        }
        break;
      case 'death':
        this.vx = 0;
        if (this.st % 6 === 0) { P.Audio.sfx('explode'); L.parts.burst(this.cx + P.rand(-50, 50), this.cy + P.rand(-30, 20), 12, { col: P.pick(['#ff5af0', '#ffd166', '#b6f59a']), smin: 1, smax: 4, lmin: 20, lmax: 40, glow: 4 }); P.shake(4, 6); }
        if (this.st === 150) { P.Audio.sfx('bigexplode'); P.shake(10, 40); this.dead = true; P.drop(L, this.cx, this.cy, { xp: 300, crys: 6, bio: 10 }); L.onBossDefeated(this); }
        return;
    }
    if (this.state !== 'slam') { this.x += this.vx; }
    this.x = P.clamp(this.x, L.minX + 4, L.maxX - this.w - 4);
    // contacto
    if (!this.untouchable && this.state !== 'death' && !p.dead && P.overlap({ x: this.x + 6, y: this.y + 8 + this.sink, w: this.w - 12, h: this.h - 8 }, p)) p.hurt(this.dmg, this.cx);
  }
  draw(c, cx, cy) {
    const s = P.S[this.spr], L = this.L;
    let frame = 0;
    switch (this.state) {
      case 'walk': frame = 2 + Math.floor(this.t / 8) % 4; break;
      case 'snap': frame = this.st < 24 ? 6 : 7; break;
      case 'roar': case 'summon': frame = 8; break;
      case 'laser': case 'homing': case 'vent': frame = 9; break;
      case 'death': frame = 8; break;
      default: frame = Math.floor(this.t / 30) % 2;
    }
    const x = Math.round(this.cx - s.w / 2 - cx), y = Math.round(this.floorY - s.h - cy + this.sink + (this.state === 'slam' ? this.y + this.h - this.floorY : 0));
    if (this.sink > 0) { c.save(); c.beginPath(); c.rect(x - 10, 0, s.w + 20, this.floorY - cy); c.clip(); }
    const deathShake = this.state === 'death' ? P.rand(-2, 2) : 0;
    P.spr(c, this.spr, frame, x + deathShake, y, { flip: this.face < 0, flash: this.flash > 0 || (this.state === 'death' && this.st % 8 < 3), alpha: this.state === 'death' ? Math.max(0, 1 - (this.st - 100) / 50) : null });
    if (this.sink > 0) c.restore();
    // brillo del núcleo y sobrecalentamiento
    const cn = this.cannon, ncx = this.cx - this.face * 15 - cx;
    if (this.state !== 'death' || this.st < 100) P.drawGlow(c, ncx, this.y - 13 + this.sink - cy, this.overheat > 0 ? 18 + Math.sin(this.t * 0.5) * 4 : 9, this.overheat > 0 ? '#ffd166' : '#ff5af0', 0.7);
    if (this.overheat > 0 && this.t % 20 < 10) P.txt(c, '▼', ncx - 2, cn.y - 14 - cy, '#ffd166');
    // rayo
    if (this.beam && this.state !== 'death') {
      const b = this.beam, bx0 = this.face > 0 ? this.cx + 40 - cx : L.minX - cx, bx1 = this.face > 0 ? L.maxX - cx : this.cx - 40 - cx;
      // rayos desde las bocas de los dos cañones hasta el origen del barrido
      const fx = this.face, top = this.floorY - P.KRAZ.H + this.sink, sx0 = this.cx - P.KRAZ.W / 2;
      const muz = [[78, 39], [80, 53]].map(([mx, my]) => [fx > 0 ? sx0 + mx : sx0 + P.KRAZ.W - mx, top + my]);
      const ox = (fx > 0 ? this.cx + 40 : this.cx - 40) - cx, oy = b.y + b.h / 2 - cy;
      for (const [mx, my] of muz) {
        P.drawGlow(c, mx - cx, my - cy, b.tele ? 4 + b.a * 8 : 10, '#ff5af0', 0.9);
        if (!b.tele) { c.strokeStyle = '#ff5af0'; c.lineWidth = 4; c.beginPath(); c.moveTo(mx - cx, my - cy); c.lineTo(ox, oy); c.stroke(); c.strokeStyle = '#ffe0ff'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(mx - cx, my - cy); c.lineTo(ox, oy); c.stroke(); c.lineWidth = 1; }
      }
      if (b.tele) { c.globalAlpha = 0.25 + b.a * 0.4; c.fillStyle = '#ff5af0'; c.fillRect(bx0, b.y + b.h / 2 - cy, bx1 - bx0, 1); c.globalAlpha = 1; P.drawGlow(c, this.face > 0 ? bx0 : bx1, b.y + b.h / 2 - cy, 6 + b.a * 12, '#ff5af0', 0.8); }
      else {
        c.fillStyle = '#ff5af0'; c.fillRect(bx0, b.y - cy, bx1 - bx0, b.h); c.fillStyle = '#ffd0ff'; c.fillRect(bx0, b.y + 3 - cy, bx1 - bx0, b.h - 6); c.fillStyle = '#ffffff'; c.fillRect(bx0, b.y + b.h / 2 - 1 - cy, bx1 - bx0, 2);
        if (this.t % 2 === 0) L.parts.add({ x: P.rand(bx0, bx1) + cx, y: b.y + P.rand(0, b.h), vy: P.rand(-1, 1), life: 12, col: '#ffd0ff', size: 2, glow: 3 });
      }
    }
  }
};

P.BOSS_CLASS = P.BOSS_CLASS || {}; P.BOSS_CLASS.krazthor = P.Krazthor;
