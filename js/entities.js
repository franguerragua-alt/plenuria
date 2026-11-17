'use strict';
// Entidades: física, jugador, proyectiles, recogibles, enemigos, objetos y NPC
const TS = 16;
P.Ent = class {
  constructor(L, x, y, w, h) { this.L = L; this.x = x; this.y = y; this.w = w; this.h = h; this.vx = 0; this.vy = 0; this.dead = false; this.face = 1; this.t = 0; this.flash = 0; this.onGround = false; this.z = 0; }
  get cx() { return this.x + this.w / 2; } get cy() { return this.y + this.h / 2; }
  // movimiento con colisión de teselas
  move(dx, dy) {
    const L = this.L; this.hitWall = 0; this.hitCeil = false;
    const stepX = Math.abs(dx) > 7 ? 2 : 1;
    for (let s = 0; s < stepX; s++) {
      this.x += dx / stepX;
      const y0 = Math.floor(this.y / TS), y1 = Math.floor((this.y + this.h - 0.01) / TS);
      if (dx > 0) { const tx = Math.floor((this.x + this.w - 0.01) / TS); for (let ty = y0; ty <= y1; ty++) if (L.coll(tx, ty) === 1) { this.x = tx * TS - this.w; this.hitWall = 1; break; } }
      else if (dx < 0) { const tx = Math.floor(this.x / TS); for (let ty = y0; ty <= y1; ty++) if (L.coll(tx, ty) === 1) { this.x = (tx + 1) * TS; this.hitWall = -1; break; } }
    }
    const prevBottom = this.y + this.h;
    this.y += dy; this.onGround = false;
    const x0 = Math.floor((this.x + 1) / TS), x1 = Math.floor((this.x + this.w - 2) / TS);
    if (dy > 0) {
      const ty = Math.floor((this.y + this.h - 0.01) / TS);
      for (let tx = x0; tx <= x1; tx++) { const c = L.coll(tx, ty); if (c === 1 || (c === 2 && prevBottom <= ty * TS + 0.5 && !this.dropT)) { this.y = ty * TS - this.h; this.onGround = true; this.groundTile = L.tile(tx, ty); this.groundTX = tx; this.groundTY = ty; break; } }
    } else if (dy < 0) {
      const ty = Math.floor(this.y / TS);
      for (let tx = x0; tx <= x1; tx++) if (L.coll(tx, ty) === 1) { this.y = (ty + 1) * TS; this.hitCeil = true; break; }
    } else {
      const ty = Math.floor((this.y + this.h) / TS);
      for (let tx = x0; tx <= x1; tx++) { const c = L.coll(tx, ty); if (c === 1 || (c === 2 && !this.dropT)) { this.onGround = true; this.groundTile = L.tile(tx, ty); break; } }
    }
    if (this.x < L.minX) { this.x = L.minX; this.hitWall = -1; }
    if (this.x + this.w > L.maxX) { this.x = L.maxX - this.w; this.hitWall = 1; }
  }
  ledgeAhead(dir) { const tx = Math.floor((dir > 0 ? this.x + this.w + 2 : this.x - 2) / TS), ty = Math.floor((this.y + this.h + 2) / TS); return this.L.coll(tx, ty) === 0 && !this.L.isLiquid(tx, ty); }
  onScreen(m = 0) { const c = this.L.cam; return this.x + this.w > c.x - m && this.x < c.x + P.W + m && this.y + this.h > c.y - m && this.y < c.y + P.H + m; }
  update() { } draw() { }
};

// ================= JUGADOR =================
P.Player = class extends P.Ent {
  constructor(L, x, y) {
    super(L, x, y, 10, 20);
    const st = P.State.stat(); this.st = st;
    this.maxHP = st.maxHP; this.hp = this.maxHP; this.energy = st.startEnergy; this.shield = st.shieldMax;
    this.iframes = 0; this.fireCD = 0; this.coyote = 0; this.jbuf = 0; this.dashCD = 0; this.dashT = 0; this.usedDouble = false;
    this.crouch = false; this.climb = false; this.hurtT = 0; this.runT = 0; this.shieldOn = false; this.parryT = 99; this.shieldIdle = 0;
    this.charge = 0; this.anim = 'idle'; this.af = 0; this.dead = false; this.noHitT = 0; this.lastSafe = { x, y }; this.inLiq = false; this.liqT = 0; this.stepT = 0;
    this.weapon = P.State.data.weapon; this.recoil = 0; this.afterimg = [];
  }
  get skin() { return P.State.data.skin; }
  update() {
    const I = P.input, L = this.L, st = this.st;
    this.t++;
    if (this.dead) { this.vy += 0.3; this.move(0, Math.min(this.vy, 6)); return; }
    if (L.cutscene) { this.vx *= 0.8; this.vy = Math.min(this.vy + 0.32, 7); this.move(this.vx, this.vy); this.anim = this.onGround ? 'idle' : 'fall'; this.crouch = false; this.shieldOn = false; return; }
    if (this.iframes > 0) this.iframes--;
    if (this.fireCD > 0) this.fireCD--;
    if (this.dashCD > 0) this.dashCD--;
    if (this.recoil > 0) this.recoil--;
    this.noHitT++;
    if (this.dropT) this.dropT--;
    const tx = Math.floor(this.cx / TS), tyM = Math.floor(this.cy / TS), tyF = Math.floor((this.y + this.h - 2) / TS);
    this.inLiq = L.isLiquid(tx, tyF) || L.isLiquid(tx, tyM);
    // regeneración
    if ((st.regen && this.noHitT > 300 && this.t % 60 === 0) || (st.photo && this.noHitT > 240 && this.t % 90 === 0)) this.heal(1, true);
    // daño ambiental
    // magma (planetas con lava): quema siempre, ninguna mejora de agua protege; el salto de quemadura te saca hacia arriba
    if (this.inLiq && L.A.lava) { this.liqT++; if (this.liqT % 20 === 1) { this.hurt(L.A.lava, this.cx, { env: true, noKnock: true }); this.vy = -4.8; this.onGround = false; P.shake(1.5, 6); L.parts.burst(this.cx, this.y + this.h, 10, { col: P.pick(['#ff6a1a', '#ffb030', '#fff0a0']), smin: 0.6, smax: 2.4, lmin: 10, lmax: 20, g: 0.1, size: 2, glow: 3 }); } if (this.t % 3 === 0) L.parts.add({ x: this.cx + P.rand(-5, 5), y: this.y + this.h - 4, vy: -P.rand(0.6, 1.4), life: 24, col: P.pick(['#ff6a1a', '#ffb030', '#4a4442']), size: P.pick([1, 2]), glow: 2 }); }
    else if (this.inLiq && !L.restoredAt(this.cx) && !st.thermal && !st.swim && !st.cera) { this.liqT++; if (this.liqT % 30 === 1) this.hurt(6, this.cx, { env: true, noKnock: true }); if (this.t % 4 === 0) L.parts.add({ x: this.cx + P.rand(-5, 5), y: this.y + 4, vy: -0.6, life: 25, col: '#c8ff4a', size: 1 }); }
    else this.liqT = 0;
    if (L.isHazard(tx, tyF) || L.isHazard(Math.floor((this.x + 1) / TS), tyF) || L.isHazard(Math.floor((this.x + this.w - 1) / TS), tyF)) { const hy = tyF * TS + 6; if (this.y + this.h > hy) this.hurt(15, this.cx - this.face, { thorn: true }); }

    // animación de subida al final de una liana
    if (this.mantle) {
      const m = this.mantle; m.t++;
      const k = m.t / 12;
      this.y = P.lerp(m.y0, m.y1, Math.min(1, k * 1.7)); this.x = P.lerp(m.x0, m.x1, P.clamp((k - 0.35) / 0.65, 0, 1));
      this.anim = k < 0.6 ? 'climb' : 'crouch'; this.af += 0.2;
      if (m.t >= 12) { this.x = m.x1; this.y = m.y1; this.vy = 0; this.onGround = true; this.mantle = null; this.anim = 'idle'; this.usedDouble = false; P.Audio.sfx('land'); L.parts.burst(this.cx, this.y + this.h, 4, { col: '#a89880', smin: 0.3, smax: 1, lmin: 8, lmax: 12 }); }
      return;
    }
    if (this.hurtT > 0) { this.hurtT--; this.vy = Math.min(this.vy + 0.32, 7); this.move(this.vx, this.vy); this.vx *= 0.92; this.anim = 'hurt'; return; }

    const left = I.down('left'), right = I.down('right'), dir = (right ? 1 : 0) - (left ? 1 : 0);
    // escalar lianas
    const onVine = L.isVine(tx, tyM) || L.isVine(tx, Math.floor((this.y + 4) / TS));
    if (!this.climb && onVine && (I.down('up') || (I.down('down') && !this.onGround)) && this.dashT <= 0) { this.climb = true; this.x = tx * TS + 3; this.vx = 0; }
    if (this.climb) {
      if (!onVine && !L.isVine(tx, Math.floor((this.y + this.h + 2) / TS))) { this.climb = false; }
      else {
        this.vy = I.down('up') ? -1.5 : I.down('down') ? 1.5 : 0;
        // al llegar a lo alto de la liana, subirse solo a la estructura superior
        if (I.down('up') && !L.isVine(tx, Math.floor((this.y + 2) / TS))) { this.vy = 0; if (this.tryMantle(tx)) return; }
        this.move(0, this.vy);
        if (I.down('up') && this.vy < 0 && this.hitCeil && this.tryMantle(tx)) return;
        if (this.vy) this.af += 0.12;
        this.anim = 'climb'; this.usedDouble = false;
        if (I.pressed('jump')) { this.climb = false; this.vy = -5.4; this.vx = dir * 2; P.Audio.sfx('jump'); }
        else if (dir && !I.down('up') && !I.down('down')) { this.climb = false; this.vx = dir * 1.5; this.face = dir; }
        if (this.onGround && I.down('down')) this.climb = false;
        return;
      }
    }
    // esquiva
    if (I.pressed('dash') && this.dashCD <= 0 && !this.shieldOn) {
      this.dashT = 13; this.dashCD = st.dashCD; this.iframes = Math.max(this.iframes, st.dashIF); this.vy = 0; this.face = dir || this.face; P.Audio.sfx('dash');
      L.parts.burst(this.cx, this.cy, 6, { col: '#ffd0c0', smin: 0.5, smax: 1.5, lmin: 10, lmax: 18 });
    }
    if (this.dashT > 0) {
      this.dashT--; this.vx = this.face * 5.2; this.vy = 0; this.move(this.vx, 0);
      if (this.t % 2 === 0) this.afterimg.push({ x: this.x, y: this.y, f: P.HERO_F.dash, flip: this.face < 0, a: 0.6 });
      this.anim = 'dash'; if (this.dashT === 0) this.vx = this.face * 2.4;
      return;
    }
    // defensa
    const wantShield = I.down('defend') && this.shield > 1;
    if (I.pressed('defend')) { this.parryT = 0; if (this.shield > 1) P.Audio.sfx('shield'); }
    this.parryT++;
    this.shieldOn = wantShield;
    if (this.shieldOn) { this.shield = Math.max(0, this.shield - 0.32 * st.shieldDrain); this.shieldIdle = 0; }
    else { this.shieldIdle++; if (this.shieldIdle > 30) this.shield = Math.min(st.shieldMax, this.shield + (st.escamas ? 1.4 : 0.7)); }
    // agacharse
    const wantCrouch = I.down('down') && this.onGround && !this.inLiq;
    if (wantCrouch !== this.crouch) {
      if (wantCrouch) { this.crouch = true; this.y += 6; this.h = 14; }
      else { const ty = Math.floor((this.y - 7) / TS); let blocked = false; for (let x = Math.floor((this.x + 1) / TS); x <= Math.floor((this.x + this.w - 2) / TS); x++) if (L.coll(x, ty) === 1) blocked = true; if (!blocked) { this.crouch = false; this.y -= 6; this.h = 20; } }
    }
    // movimiento horizontal
    let maxV = this.inLiq ? (this.st.swim ? 1.9 : 1.1) : (this.runT > 26 ? 2.55 : 1.7);
    if (this.shieldOn) maxV = 0.6;
    if (this.crouch) maxV = 0;
    const ice = this.onGround && this.groundTile === 'I', acc = ice ? 0.09 : this.onGround ? 0.38 : 0.3;
    if (this.wallLock > 0) this.wallLock--;
    if (dir && !(this.wallLock > 0)) { this.vx = P.approach(this.vx, dir * maxV, acc); if (!this.shieldOn || !this.charge) this.face = dir; if (this.onGround && Math.abs(this.vx) > 1.4) this.runT++; }
    else { this.vx = P.approach(this.vx, 0, ice ? 0.035 : this.onGround ? 0.42 : 0.12); this.runT = 0; }
    if (!dir || (dir && Math.sign(this.vx) !== dir)) this.runT = 0;
    // saltar
    if (this.onGround) { this.coyote = 6; this.usedDouble = false; } else if (this.coyote > 0) this.coyote--;
    if (I.pressed('jump')) this.jbuf = 7; else if (this.jbuf > 0) this.jbuf--;
    if (this.jbuf > 0) {
      if (I.down('down') && this.onGround && L.coll(Math.floor(this.cx / TS), Math.floor((this.y + this.h + 1) / TS)) === 2) { this.dropT = 10; this.jbuf = 0; this.y += 2; if (this.crouch) { this.crouch = false; this.y -= 6; this.h = 20; } }
      else if (this.coyote > 0) {
        if (this.crouch) { this.crouch = false; this.y -= 6; this.h = 20; }
        this.vy = this.inLiq ? -5.3 : -6.3; this.coyote = 0; this.jbuf = 0; P.Audio.sfx('jump');
        L.parts.burst(this.cx, this.y + this.h, 4, { col: '#c8c0b0', smin: 0.3, smax: 1, lmin: 8, lmax: 14, up: 0.3 });
      } else if (st.swim && this.inLiq) {
        this.vy = -3.4; this.jbuf = 0; P.Audio.sfx('jump');
        for (let i = 0; i < 5; i++) L.parts.add({ x: this.cx + P.rand(-4, 4), y: this.y + this.h, vy: -P.rand(0.3, 1), life: 30, col: '#d8fffa', size: 1 });
      } else if (st.walljump && this.wallT > 0) {
        this.vy = -6.0; this.vx = -this.wallDir * 2.7; this.face = -this.wallDir; this.wallLock = 10; this.wallT = 0; this.jbuf = 0; this.usedDouble = false; P.Audio.sfx('jump');
        for (let i = 0; i < 6; i++) L.parts.add({ x: this.wallDir > 0 ? this.x + this.w : this.x, y: this.cy + P.rand(-4, 6), vx: -this.wallDir * P.rand(0.5, 1.5), vy: P.rand(-1, 0.5), life: 16, col: '#e8d8a8', size: 2 });
      } else if (st.dbl && !this.usedDouble) {
        this.vy = -5.6; this.usedDouble = true; this.jbuf = 0; P.Audio.sfx('djump');
        for (let i = 0; i < 12; i++) L.parts.add({ x: this.cx + P.rand(-4, 4), y: this.y + this.h, vx: P.rand(-1.2, 1.2), vy: P.rand(0.5, 2), life: P.ri(16, 30), col: P.pick(['#9cff6a', '#5ef0d0', '#ffffff']), size: 2, glow: 4, shrink: true });
      }
    }
    if (I.released('jump') && this.vy < -2) this.vy *= 0.6;
    // gravedad
    // aferrarse a la pared con las Garras Reptilianas
    this.wallT = Math.max(0, (this.wallT || 0) - 1); this.sliding = false;
    if (st.walljump && !this.onGround && dir && !this.inLiq) {
      const wx = Math.floor((dir > 0 ? this.x + this.w + 1 : this.x - 1) / TS);
      if (wx >= 0 && wx < L.cols && L.coll(wx, Math.floor((this.y + this.h * 0.5) / TS)) === 1 && L.coll(wx, Math.floor((this.y + 3) / TS)) === 1) {
        this.wallDir = dir; this.wallT = 7; this.sliding = true; this.usedDouble = false;
        if (this.vy > 1.1) { this.vy = 1.1; if (this.t % 4 === 0) L.parts.add({ x: dir > 0 ? this.x + this.w : this.x, y: this.y + 4, vy: -0.3, life: 14, col: '#e8d8a8', size: 1 }); }
      }
    }
    const glide = st.glide && !this.onGround && !this.sliding && !this.inLiq && !this.climb && I.down('jump') && this.vy > 0.5;
    if (glide && this.t % 3 === 0) L.parts.add({ x: this.cx + P.rand(-6, 6), y: this.y, vy: -0.3, life: 16, col: '#bfefff', size: 1 });
    const g = this.inLiq ? 0.17 : 0.32, maxF = glide ? 0.9 : this.sliding ? 1.1 : this.inLiq ? 2 : 7;
    this.vy = Math.min(this.vy + g, maxF);
    const wasGround = this.onGround, prevVy = this.vy;
    this.move(this.vx, this.vy);
    if (this.hitCeil && this.vy < 0) this.vy = 0;
    if (this.onGround) {
      if (this.groundTile === 'b' && prevVy > 0.5) { this.vy = -8.6; this.onGround = false; this.usedDouble = false; L.bounceTile(this.groundTX, this.groundTY); P.Audio.sfx('djump'); }
      else { if (!wasGround && prevVy > 3) { P.Audio.sfx('land'); L.parts.burst(this.cx, this.y + this.h, 5, { col: '#a89880', smin: 0.3, smax: 1.2, lmin: 8, lmax: 14 }); } this.vy = 0; }
      { const gx = Math.floor(this.cx / TS), gy = Math.floor((this.y + this.h + 1) / TS); if (!this.inLiq && this.L.coll(gx, gy) === 1 && this.L.tile(gx, gy) !== 'b' && this.L.coll(gx - 1, gy) === 1 && this.L.coll(gx + 1, gy) === 1) this.lastSafe = { x: this.x, y: this.y }; }
    }
    if (this.onGround && Math.abs(this.vx) > 1 && !this.inLiq) { this.stepT++; if (this.stepT % (this.runT > 26 ? 10 : 14) === 0) { P.Audio.sfx('step'); if (this.runT > 26) L.parts.add({ x: this.cx - this.face * 4, y: this.y + this.h - 1, vx: -this.face * 0.4, vy: -0.3, life: 14, col: '#b0a090', size: 2 }); } }
    // ataque
    const W = P.D.WEAPONS[this.weapon];
    if (!this.shieldOn) {
      const rate = Math.round(W.rate * st.rateMul);
      if (I.pressed('attack') && this.fireCD <= 0) { this.fire(false); this.fireCD = rate; }
      else if (I.down('attack')) {
        if (st.charge) { this.charge++; if (this.charge === 40) P.Audio.sfx('charge'); }
        else if (this.fireCD <= 0) { this.fire(false); this.fireCD = rate; }
      }
      if (I.released('attack')) { if (st.charge && this.charge >= 40) this.fire(true); this.charge = 0; }
    } else this.charge = 0;
    if (I.pressed('swap')) { const ws = P.State.data.weapons; if (ws.length > 1) { const i = (ws.indexOf(this.weapon) + 1) % ws.length; this.weapon = ws[i]; P.State.data.weapon = this.weapon; P.Audio.sfx('select'); P.toast(P.D.WEAPONS[this.weapon].name, { icon: P.D.WEAPONS[this.weapon].icon, life: 70 }); } }
    if (I.pressed('super')) { if (this.energy >= 100) this.superAttack(); else P.Audio.sfx('back'); }
    // animación
    if (this.crouch) this.anim = 'crouch';
    else if (!this.onGround) this.anim = this.vy < 0 ? 'jump' : 'fall';
    else if (this.shieldOn) this.anim = 'shield';
    else if (Math.abs(this.vx) > 0.3) { this.anim = 'run'; this.af += Math.abs(this.vx) * 0.09; }
    else this.anim = this.recoil > 0 ? 'shoot' : 'idle';
  }
  // busca una superficie junto a la cima de la liana y sube el personaje hasta quedar de pie
  tryMantle(vx) {
    const L = this.L;
    let vt = Math.floor((this.y + this.h - 1) / TS); while (vt > 0 && L.isVine(vx, vt - 1)) vt--;
    while (vt < L.rows && !L.isVine(vx, vt)) vt++;
    const free = (x, y) => L.coll(x, y) !== 1 && L.coll(x, y - 1) !== 1;
    const stand = (x, r) => (L.coll(x, r) === 1 || L.coll(x, r) === 2) && free(x, r - 1);
    const cands = [];
    if (stand(vx, vt - 1)) cands.push([vx, vt - 1]);
    for (const s of [this.face || 1, -(this.face || 1)]) for (const r of [vt, vt - 1, vt + 1]) for (const d of [1, 2]) if (stand(vx + s * d, r) && (d === 1 || stand(vx + s, r) || L.coll(vx + s, r) === 0)) cands.push([vx + s * d, r]);
    const c = cands[0]; if (!c) return false;
    const x1 = P.clamp(c[0] * TS + 8 - this.w / 2, c[0] * TS - this.w + 4, c[0] * TS + 12), y1 = c[1] * TS - this.h;
    if (y1 > this.y + 8) return false;
    this.climb = false; this.mantle = { x0: this.x, y0: this.y, x1, y1, t: 0 }; this.vx = this.vy = 0;
    if (x1 !== this.x) this.face = Math.sign(x1 - this.x);
    return true;
  }
  fire(charged) {
    const L = this.L, st = this.st, W = P.D.WEAPONS[this.weapon], P0 = P.State.data;
    const mx = this.face > 0 ? this.x + this.w + 6 : this.x - 10, my = this.y + (this.crouch ? 7 : 8);
    const base = W.dmg * st.dmgMul * (st.weaponMul[this.weapon] || 1);
    P0.stats.shots++; this.recoil = 6;
    if (charged) {
      L.add(new P.Proj(L, mx, my - 3, this.face * 7, 0, { dmg: base * 3.5, owner: 'p', spr: 'b_blaster', w: 14, h: 8, scale: 2, pierce: 3, glow: '#ffd166', big: true }));
      P.Audio.sfx('laser'); P.shake(2, 6); return;
    }
    if (W.bolt) {
      L.add(new P.Proj(L, mx, my - 1, this.face * W.speed, 0, { dmg: base, owner: 'p', spr: W.spr, w: 12, h: 6, life: 50, chainBolt: true, glow: '#5ae0ff' }));
      P.Audio.sfx('laser'); P.shake(1, 3); L.parts.burst(mx, my, 5, { col: '#bff6ff', smin: 0.5, smax: 1.6, lmin: 6, lmax: 12, glow: 3 }); return;
    }
    if (W.magma) {
      L.add(new P.Proj(L, mx, my - 2, this.face * W.speed, -1.2, { dmg: base, owner: 'p', spr: W.spr, w: 10, h: 10, life: 80, grav: 0.07, magmaBurst: true, glow: '#ff6a1a' }));
      P.Audio.sfx('laser'); P.shake(1.5, 4); L.parts.burst(mx, my, 6, { col: '#ffb030', smin: 0.5, smax: 1.8, lmin: 6, lmax: 12 }); return;
    }
    if (W.sting) {
      L.add(new P.Proj(L, mx, my + P.rand(-1.5, 1.5), this.face * W.speed, P.rand(-0.15, 0.15), { dmg: base, owner: 'p', spr: W.spr, w: 10, h: 4, life: 40, pierce: 1, poison: true, rot: true, glow: '#ffd060' }));
      P.Audio.sfx('shoot'); return;
    }
    if (W.spore) {
      L.add(new P.Proj(L, mx, my - 1, this.face * W.speed, -0.6, { dmg: base, owner: 'p', spr: W.spr, w: 8, h: 8, life: 70, grav: 0.05, spore: true, poison: true, glow: '#5ef0a0' }));
      P.Audio.sfx('spine'); L.parts.burst(mx, my, 5, { col: '#a8ff7a', smin: 0.5, smax: 1.5, lmin: 6, lmax: 12 }); return;
    }
    if (W.shard) {
      L.add(new P.Proj(L, mx, my - 1, this.face * W.speed, -0.4, { dmg: base, owner: 'p', spr: W.spr, w: 9, h: 8, life: 60, grav: 0.04, shard: true, glow: '#ff4450' }));
      P.Audio.sfx('laser'); P.shake(1, 3); L.parts.burst(mx, my, 5, { col: '#ff8a7a', smin: 0.5, smax: 1.5, lmin: 6, lmax: 12 }); return;
    }
    if (W.harpoon) {
      L.add(new P.Proj(L, mx, my, this.face * W.speed, 0, { dmg: base, owner: 'p', spr: W.spr, w: 14, h: 4, life: 70, pierce: 3, glow: '#5af0ff' }));
      P.Audio.sfx('laser'); P.shake(1, 3); return;
    }
    if (W.freeze) {
      L.add(new P.Proj(L, mx, my, this.face * W.speed, 0, { dmg: base, owner: 'p', spr: W.spr, w: 10, h: 8, life: 55, freeze: W.freeze, glow: '#bfefff' }));
      P.Audio.sfx('laser'); L.parts.burst(mx, my, 5, { col: '#d8f8ff', smin: 0.5, smax: 1.5, lmin: 6, lmax: 12 }); return;
    }
    if (this.weapon === 'arena') {
      L.add(new P.Proj(L, mx, my - 1, this.face * W.speed, 0, { dmg: base, owner: 'p', spr: 'kz_b_crys', w: 12, h: 6, life: 60, pierce: 3, glow: '#ffc060' }));
      P.Audio.sfx('laser'); P.shake(1.5, 4); L.parts.burst(mx, my, 6, { col: '#ffd890', smin: 0.5, smax: 1.8, lmin: 6, lmax: 12 }); return;
    }
    if (this.weapon === 'espinas') {
      const n = st.spines, spread = n === 5 ? 0.2 : 0.22;
      for (let i = 0; i < n; i++) { const a = (i - (n - 1) / 2) * spread; L.add(new P.Proj(L, mx, my, Math.cos(a) * W.speed * this.face, Math.sin(a) * W.speed, { dmg: base, owner: 'p', spr: 'b_spine', life: 30, poison: true, rot: true })); }
      P.Audio.sfx('spine');
    } else {
      L.add(new P.Proj(L, mx, my, this.face * W.speed, 0, { dmg: base, owner: 'p', spr: 'b_blaster', life: 70, glow: '#ffd166' }));
      P.Audio.sfx('shoot');
    }
    L.parts.add({ x: mx + this.face * 2, y: my + 1, life: 4, col: '#fff6c0', size: 4, glow: 8 });
  }
  superAttack() {
    const L = this.L, st = this.st; this.energy -= 100; this.energy += st.superRefund;
    P.Audio.sfx('super'); P.shake(5, 22); P.hitstop = 6;
    const dmg = 40 * st.superDmg * st.dmgMul;
    L.fx.push({ k: 'ring', x: this.cx, y: this.cy, t: 0, life: 30, r: 150, col: '#ffd166' });
    for (const e of L.ents) {
      if (e.isEnemy && !e.dead && P.dist(this.cx, this.cy, e.cx, e.cy) < 150) e.hit(dmg, { x: this.cx, knock: 4, super: true });
      if (e instanceof P.Proj && e.owner === 'e' && P.dist(this.cx, this.cy, e.cx, e.cy) < 150) e.kill(true);
    }
    if (st.tempestad) {
      if (L.aeFlash !== undefined) L.aeFlash = 1;
      for (const e of L.ents) if (e.isEnemy && !e.dead && !e.passive && e.onScreen && e.onScreen(0)) { e.hit(dmg * 0.9, { x: e.cx, super: true }); for (let j = 0; j < 14; j++) L.parts.add({ x: e.cx + P.rand(-3, 3), y: e.cy - j * 12, vy: 1, life: 14, col: j % 2 ? '#ffffff' : '#5ae0ff', size: 2, glow: 4 }); L.fx.push({ k: 'ring', x: e.cx, y: e.cy, t: 0, life: 18, r: 30, col: '#bff6ff' }); }
    }
    if (st.erupcion) {
      for (let k = 0; k < 6; k++) { const x = L.cam.x + 40 + k * 80; L.fx.push({ k: 'ring', x, y: this.y + this.h, t: -k * 3, life: 26, r: 40, col: '#ff6a1a' }); for (let j = 0; j < 10; j++) L.parts.add({ x: x + P.rand(-6, 6), y: this.y + this.h, vy: -P.rand(3, 7), g: 0.12, life: 30, col: P.pick(['#ff6a1a', '#ffb030', '#fff0a0']), size: 2, glow: 3 }); for (const e of L.ents) if (e.isEnemy && !e.dead && !e.passive && Math.abs(e.cx - x) < 30) e.hit(dmg * 0.9, { x, super: true }); }
    }
    if (st.enjambre) {
      const foes = L.ents.filter(e => e.isEnemy && !e.dead && !e.passive && e.onScreen && e.onScreen(0));
      foes.forEach((e, i) => { for (let k = 0; k < 6; k++) L.parts.add({ x: this.cx + P.rand(-10, 10), y: this.cy + P.rand(-10, 10), vx: (e.cx - this.cx) / 24 + P.rand(-0.6, 0.6), vy: (e.cy - this.cy) / 24 + P.rand(-0.6, 0.6), life: 24, col: P.pick(['#ffd050', '#3a2410']), size: 1 }); e.hit(dmg * 0.6, { x: this.cx, super: true, poison: true }); });
    }
    if (st.micorriza) {
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, x = this.cx + Math.cos(a) * 70, y = this.cy + Math.sin(a) * 30; L.fx.push({ k: 'ring', x, y, t: -i * 2, life: 24, r: 34, col: P.pick(['#5ef0a0', '#ff7ad8', '#c06aff']) }); L.parts.burst(x, y, 6, { col: P.pick(['#5ef0a0', '#ff7ad8', '#ffb060']), smin: 1, smax: 3, glow: 3 }); }
      for (const e of L.ents) if (e.isEnemy && !e.dead && !e.passive && P.dist(this.cx, this.cy, e.cx, e.cy) < 200) e.hit(dmg * 0.8, { x: this.cx, super: true, poison: true });
      this.heal(20);
    }
    if (st.eclipse) {
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; L.add(new P.Proj(L, this.cx, this.cy, Math.cos(a) * 4.5, Math.sin(a) * 4.5, { dmg: dmg * 0.5, owner: 'p', spr: 'um_b_orb', life: 50, pierce: 2, rot: true, glow: '#ff4450' })); }
    }
    if (st.tormenta) {
      const foes = L.ents.filter(e => e.isEnemy && !e.dead && e.onScreen && e.onScreen(0)).sort((a, b) => P.dist(this.cx, this.cy, a.cx, a.cy) - P.dist(this.cx, this.cy, b.cx, b.cy)).slice(0, 5);
      let px = this.cx, py = this.cy; foes.forEach((e, i) => { L.fx.push({ k: 'bolt', x0: px, y0: py, x1: e.cx, y1: e.cy, t: -i * 3, life: 26 }); e.hit(dmg * 0.8, { x: this.cx, super: true }); px = e.cx; py = e.cy; });
    }
    if (st.boreal) {
      for (const e of L.ents) if (e.isEnemy && !e.dead && !e.boss && e.onScreen(20)) { e.stun = Math.max(e.stun || 0, 150); e.frozenT = 150; }
      for (let i = 0; i < 40; i++) L.parts.add({ x: L.cam.x + P.rand(0, P.W), y: L.cam.y + P.rand(0, P.H), vy: P.rand(-0.5, 0.5), life: 40, col: P.pick(['#5ef0c0', '#b48cff', '#bfefff']), size: 2, glow: 3 });
    }
    if (st.quake) {
      for (let k = -14; k <= 14; k++) L.parts.add({ x: this.cx + k * 16, y: this.y + this.h - 2, vy: -P.rand(1, 3), vx: P.rand(-0.5, 0.5), g: 0.15, life: 26 + Math.abs(k) * 2, col: P.pick(['#e8c890', '#c89a5a', '#fff0c8']), size: 2 });
      for (const e of L.ents) if (e.isEnemy && !e.dead && Math.abs(e.cx - this.cx) < 230 && Math.abs((e.y + e.h) - (this.y + this.h)) < 40) e.hit(dmg * 0.8, { x: this.cx, knock: 3, super: true });
    }
    if (st.prism) {
      const by = this.cy - 7, x0 = this.face > 0 ? this.cx : L.cam.x, x1 = this.face > 0 ? L.cam.x + P.W : this.cx;
      L.fx.push({ k: 'beam', x0, x1, y: by, h: 14, t: 0, life: 34 });
      for (const e of L.ents) if (e.isEnemy && !e.dead && e.x + e.w > x0 && e.x < x1 && e.y < by + 14 && e.y + e.h > by) e.hit(dmg * 1.5, { x: this.cx, knock: 3, super: true });
    }
    for (let i = 0; i < 40; i++) { const a = Math.random() * 7; L.parts.add({ x: this.cx, y: this.cy, vx: Math.cos(a) * P.rand(2, 6), vy: Math.sin(a) * P.rand(2, 6), life: P.ri(20, 40), col: P.pick(['#ffd166', '#fff6c0', '#ff8a3a']), size: 2, glow: 5, drag: 0.93, shrink: true }); }
  }
  gainEnergy(n) { this.energy = Math.min(100, this.energy + n * this.st.superGain); }
  heal(n, quiet) { if (this.dead) return; n = Math.round(n * (this.st.healMul || 1)); const before = this.hp; this.hp = Math.min(this.maxHP, this.hp + n); if (!quiet && this.hp > before) { P.Audio.sfx('heal'); for (let i = 0; i < 10; i++) this.L.parts.add({ x: this.cx + P.rand(-6, 6), y: this.cy + P.rand(-8, 8), vy: -P.rand(0.5, 1.5), life: 30, col: '#7dffa0', size: 2, glow: 4 }); } }
  // devuelve true si el ataque fue bloqueado
  blockCheck(srcX) { return this.shieldOn && Math.sign(srcX - this.cx) === this.face; }
  hurt(dmg, srcX, o = {}) {
    if (this.dead || this.L.cutscene) return false;
    if (dmg > 0) dmg = Math.max(1, Math.round(dmg * P.DIFF.get().dmg)); /* daño según la dificultad */
    if (this.iframes > 0 && !o.env) return false;
    if (o.env && this.iframes > 0 && !o.thorn) { /* el entorno ignora invulnerabilidad corta */ }
    if (this.iframes > 0) return false;
    if (!o.env && this.blockCheck(srcX)) {
      dmg = Math.round(dmg * 0.25); this.shield = Math.max(0, this.shield - 10); P.Audio.sfx('block');
      this.vx = -this.face * 1.8; this.iframes = 20;
      if (dmg <= 0) return false;
    }
    const comp = this.L.companions && this.L.companions.find(c => c.tryProtect && c.tryProtect(dmg));
    if (comp) dmg = Math.round(dmg * 0.5);
    dmg = Math.max(1, Math.round(dmg * (this.st.dmgTaken || 1))); this.hp -= dmg; this.noHitT = 0; this.L.noDmg = false;
    P.State.data.stats.dmgTaken += dmg;
    this.iframes = o.thorn ? 45 : 60; P.Audio.sfx('hurt'); P.shake(3, 10); this.flash = 8;
    if (!o.noKnock) { this.vx = (this.cx < srcX ? -1 : 1) * 2.4; this.vy = o.thorn ? -4.5 : -3; this.hurtT = 14; this.climb = false; this.dashT = 0; }
    this.L.parts.burst(this.cx, this.cy, 8, { col: '#ff5a5a', smin: 1, smax: 2.5, lmin: 10, lmax: 20 });
    this.L.popups.push({ x: this.cx, y: this.y - 4, text: '-' + dmg, col: '#ff6a6a', t: 0 });
    if (this.hp <= 0) { this.hp = 0; this.L.onPlayerZero(); }
    return true;
  }
  draw(c, cx, cy) {
    for (const a of this.afterimg) { P.spr(c, 'hero_' + this.skin, a.f, a.x - 7 - cx, a.y - 8 - cy, { flip: a.flip, alpha: a.a * 0.5 }); a.a -= 0.08; }
    this.afterimg = this.afterimg.filter(a => a.a > 0);
    if (this.iframes > 0 && !this.dead && Math.floor(this.t / 3) % 2 && this.dashT <= 0) return;
    const F = P.HERO_F; let f = F.idle;
    switch (this.anim) {
      case 'idle': f = F.idle + (Math.floor(this.t / 30) % 2); break;
      case 'run': f = F.run + (Math.floor(this.af) % 6); break;
      case 'jump': f = F.jump; break; case 'fall': f = F.fall; break; case 'crouch': f = F.crouch; break;
      case 'dash': f = F.dash; break; case 'hurt': f = F.hurt; break; case 'shield': f = F.shield; break;
      case 'climb': f = F.climb + (Math.floor(this.af) % 2); break; case 'shoot': f = F.shoot; break;
    }
    if (this.dead) f = F.dead;
    const ox = Math.round(this.x - 7 - cx), oy = Math.round(this.y + this.h - 28 - cy);
    P.spr(c, 'hero_' + this.skin, f, ox, oy, { flip: this.face < 0, flash: this.flash > 0 });
    if (this.flash > 0) this.flash--;
    if (this.charge > 10) { const r = Math.min(10, this.charge / 4); P.drawGlow(c, this.face > 0 ? ox + 24 : ox - 1, oy + 16 + (this.crouch ? 6 : 0), r, '#ffd166', this.charge >= 40 ? 0.9 : 0.5); }
    if (this.shieldOn) {
      const sx = this.cx - cx + this.face * 9, sy = this.cy - cy, pf = this.parryT < this.st.parryWin;
      c.globalAlpha = 0.35 + Math.sin(this.t * 0.4) * 0.1; c.fillStyle = pf ? '#ffffff' : (this.st.reflect ? '#9cff6a' : '#5ee8ff');
      c.beginPath(); c.ellipse(sx, sy, 5, 14, 0, -Math.PI / 2, Math.PI / 2, this.face < 0); c.fill(); c.globalAlpha = 1;
      P.drawGlow(c, sx, sy, 14, this.st.reflect ? '#9cff6a' : '#5ee8ff', 0.5);
    }
  }
};

// ================= PROYECTILES =================
P.Proj = class extends P.Ent {
  constructor(L, x, y, vx, vy, o) {
    super(L, x - (o.w || 6) / 2, y - (o.h || 4) / 2, o.w || 6, o.h || 4);
    this.vx = vx; this.vy = vy; Object.assign(this, { dmg: 5, owner: 'e', life: 120, grav: 0, pierce: 0, hits: [] }, o);
    this.face = vx < 0 ? -1 : 1;
  }
  kill(spark) { this.dead = true; if (spark) this.L.parts.burst(this.cx, this.cy, 5, { col: this.owner === 'p' ? '#ffd166' : '#ff8ad8', smin: 0.5, smax: 2, lmin: 6, lmax: 14 }); }
  update() {
    this.t++; this.vy += this.grav; this.x += this.vx; this.y += this.vy;
    if (--this.life <= 0) return this.kill(false);
    const L = this.L, tx = Math.floor(this.cx / TS), ty = Math.floor(this.cy / TS), tc = L.coll(tx, ty);
    if (tc === 1) {
      if (this.owner === 'p') L.damageTile(tx, ty, this.dmg);
      return this.kill(true);
    }
    if (this.owner === 'p' || this.reflected) {
      for (const e of L.ents) {
        if (!e.isEnemy || e.dead || e.untouchable || this.hits.includes(e)) continue;
        if (P.overlap(this, e)) {
          let d = this.dmg * (this.reflected ? 2 : 1); const st = L.player.st;
          if (Math.random() < st.crit) { d *= 2; this.crit = true; }
          if (e.beast) d *= st.beastDmg;
          e.hit(d, { x: this.cx - this.vx * 3, poison: this.poison, freeze: this.freeze, crit: this.crit, proj: this });
          L.player.gainEnergy(3);
          this.hits.push(e);
          if (this.pierce-- <= 0) return this.kill(true);
        }
      }
    } else {
      const p = L.player;
      if (!p.dead && P.overlap(this, p)) {
        if (p.shieldOn && Math.sign(this.cx - p.cx) === p.face) {
          const perfect = p.parryT < p.st.parryWin;
          if (perfect || p.st.reflect) {
            this.owner = 'p'; this.reflected = true; this.vx = -this.vx * 1.4; this.vy = -this.vy; this.life = 90; this.face = -this.face;
            p.shield = Math.max(0, p.shield - (perfect ? 0 : 6));
            if (perfect && p.st.escamas) p.heal(4, true);
            if (perfect) { P.Audio.sfx('parry'); P.hitstop = 5; P.State.data.stats.parries++; if (P.State.data.stats.parries >= 10) P.State.ach('parada'); L.fx.push({ k: 'ring', x: this.cx, y: this.cy, t: 0, life: 14, r: 26, col: '#ffffff' });
              if (p.st.reflect) for (const e of L.ents) if (e.isEnemy && !e.boss && P.dist(e.cx, e.cy, p.cx, p.cy) < 90) e.stun = 70; }
            else P.Audio.sfx('block');
            return;
          }
          p.shield = Math.max(0, p.shield - 12); P.Audio.sfx('block'); return this.kill(true);
        }
        if (p.hurt(this.dmg, this.cx)) return this.kill(true);
      }
    }
  }
  draw(c, cx, cy) {
    const s = P.SP(this.spr); if (!s) return;
    const x = this.cx - cx, y = this.cy - cy, sc = this.scale || 1;
    if (this.glow) P.drawGlow(c, x, y, this.big ? 14 : 7, this.glow, 0.6);
    if (this.rot && Math.abs(this.vy) > 0.3) { c.save(); c.translate(Math.round(x), Math.round(y)); c.rotate(Math.atan2(this.vy, this.vx)); c.drawImage(s.f[0], -s.w / 2, -s.h / 2); c.restore(); return; }
    P.spr(c, this.spr, Math.floor(this.t / 4), x - s.w * sc / 2, y - s.h * sc / 2, { flip: this.vx < 0, scale: sc > 1 ? sc : 0 });
  }
};

// ================= RECOGIBLES =================
P.Pickup = class extends P.Ent {
  constructor(L, x, y, kind, o = {}) {
    super(L, x - 3, y - 3, 7, 7); this.kind = kind; Object.assign(this, o);
    this.vx = o.vx != null ? o.vx : P.rand(-1.5, 1.5); this.vy = o.vy != null ? o.vy : P.rand(-3.5, -1.5); this.life = o.life || 900; this.delay = 15;
  }
  update() {
    this.t++; if (this.delay > 0) this.delay--;
    const p = this.L.player, d = P.dist(this.cx, this.cy, p.cx, p.cy), mag = p.st.magnet * (this.kind === 'xp' ? 1.4 : 1);
    if (this.delay <= 0 && d < mag && !p.dead) { const a = Math.atan2(p.cy - this.cy, p.cx - this.cx), sp = 2.5 + (mag - d) * 0.06; this.vx = Math.cos(a) * sp; this.vy = Math.sin(a) * sp; this.x += this.vx; this.y += this.vy; }
    else { this.vy = Math.min(this.vy + 0.2, 4); this.vx *= 0.96; this.move(this.vx, this.vy); if (this.onGround) { this.vy = 0; this.vx *= 0.8; } }
    if (this.delay <= 0 && d < 10 && !p.dead) this.collect(p);
    if (--this.life <= 0) this.dead = true;
  }
  collect(p) {
    this.dead = true; const S = P.State;
    switch (this.kind) {
      case 'xp': S.addXP(this.n || 1); P.Audio.sfx('xp'); break;
      case 'bio': case 'scrap': case 'crys': S.addRes(this.kind, this.n || 1); P.Audio.sfx('pickup'); this.L.popups.push({ x: this.cx, y: this.y, text: '+' + (this.n || 1), col: { bio: '#9cff6a', scrap: '#c9d1e2', crys: '#ffd166' }[this.kind], t: 0 }); break;
      case 'hp': p.heal(this.n || 15); break;
      case 'en': p.gainEnergy(20); P.Audio.sfx('pickup'); break;
    }
  }
  draw(c, cx, cy) {
    const spr = { xp: 'xp', bio: 'r_bio', scrap: 'r_scrap', crys: 'r_crys', hp: 'i_heart', en: 'i_energy' }[this.kind];
    if (this.life < 120 && this.t % 6 < 3) return;
    const x = this.cx - cx, y = this.cy - cy;
    if (this.kind === 'xp') P.drawGlow(c, x, y, 5, '#5ee8ff', 0.6);
    P.spr(c, spr, Math.floor(this.t / 8), x - P.S[spr].w / 2, y - P.S[spr].h / 2);
  }
};
P.drop = function (L, x, y, o) {
  const xp = o.xp || 0;
  for (let i = 0; i < Math.min(8, Math.ceil(xp / 4)); i++) L.add(new P.Pickup(L, x, y, 'xp', { n: Math.ceil(xp / Math.min(8, Math.ceil(xp / 4))) }));
  for (const k of ['bio', 'scrap', 'crys']) if (o[k]) { const n = o[k]; for (let i = 0; i < Math.min(n, 4); i++) L.add(new P.Pickup(L, x, y, k, { n: Math.ceil(n / Math.min(n, 4)) })); }
  if (o.hp) L.add(new P.Pickup(L, x, y, 'hp', { n: o.hp }));
};

// ================= ENEMIGOS =================
P.Enemy = class extends P.Ent {
  constructor(L, x, y, w, h, o) {
    super(L, x, y, w, h);
    Object.assign(this, { kind: null, hp: 10, dmg: 10, xp: 6, drops: {}, natural: false, cyber: false, beast: true, flying: false, spr: null, sw: w, sh: h, ox: 0, oy: 0 }, o);
    this.isEnemy = true; this.maxhp = this.hp = Math.round(this.hp * (L.diff || 1)); this._hp0 = this.maxhp; this.home = { x, y }; this.state = 'idle'; this.st = 0; this.stun = 0; this.poisonT = 0; this.seen = false; this.obsT = 0;
    this.passive = this.natural && L.restoredAt(x);
  }
  hit(d, o = {}) {
    if (this.dead) return;
    d = Math.max(1, Math.round(d)); this.hp -= d; this.flash = 6;
    if (this.passive) { this.passive = false; this.angry = true; }
    if (o.poison) this.poisonT = 90;
    if (o.freeze && !this.boss) { this.stun = Math.max(this.stun, o.freeze); this.frozenT = o.freeze; }
    if (o.knock && !this.heavy) { this.vx = Math.sign(this.cx - o.x) * o.knock; if (!this.flying) this.vy = -1.5; }
    this.L.popups.push({ x: this.cx + P.rand(-4, 4), y: this.y - 2, text: String(d), col: o.crit ? '#ffd166' : o.super ? '#ff8a3a' : '#ffffff', t: 0, big: o.crit });
    this.L.parts.burst(this.cx, this.cy, 4, { col: this.cyber ? '#ffd166' : '#9cff6a', smin: 0.5, smax: 2, lmin: 6, lmax: 14 });
    P.Audio.sfx('ehit');
    if (this.hp <= 0) this.die();
  }
  die() {
    this.dead = true; const L = this.L, S = P.State;
    L.player.gainEnergy(5);
    if (L.sim) { L.parts.burst(this.cx, this.cy, 14, { col: '#5ee8ff', smin: 1, smax: 3, lmin: 14, lmax: 30 }); P.Audio.sfx('hit'); L.simKills = (L.simKills || 0) + 1; return; }
    S.data.stats.kills++;
    if (this.kind) S.task(this.kind, 'defeat');
    if (this.cyber) { S.data.stats.cyber++; S.missionProg('s_cazador'); }
    P.drop(L, this.cx, this.cy, Object.assign({ xp: this.xp }, this.drops, Math.random() < 0.08 * P.DIFF.get().heal ? { hp: 12 } : {}));
    L.parts.burst(this.cx, this.cy, 14, { col: this.cyber ? '#ffb030' : '#5cc06a', smin: 1, smax: 3, lmin: 14, lmax: 30, g: 0.1 });
    if (this.cyber || !this.beast) { L.parts.burst(this.cx, this.cy, 8, { col: '#6c7488', smin: 1, smax: 3, g: 0.15, size: 2 }); P.Audio.sfx('explode'); }
    else P.Audio.sfx('hit');
  }
  commonUpdate() {
    this.t++; if (this.flash > 0) this.flash--;
    if (this.poisonT > 0) { this.poisonT--; if (this.poisonT % 30 === 0) this.hit(2, {}); if (this.t % 6 === 0) this.L.parts.add({ x: this.cx + P.rand(-5, 5), y: this.cy, vy: -0.6, life: 18, col: '#9cff6a' }); }
    if (!this.seen && this.kind && this.onScreen(-8)) { this.seen = true; P.State.see(this.kind, this.L.restoredAt(this.cx)); }
    // observación de comportamientos naturales
    const p = this.L.player;
    if (this.passive && this.kind && !p.dead) {
      const d = P.dist(this.cx, this.cy, p.cx, p.cy);
      if (d < 110 && !P.input.down('attack')) { this.obsT++; if (this.obsT % 60 === 0) P.State.task(this.kind, 'observe', 1); }
    }
    if (this.stun > 0) { this.stun--; this.vx *= 0.85; return true; }
    // daño por contacto
    if (!this.passive && this.dmg && !p.dead && P.overlap(this, p) && !this.harmless) p.hurt(this.dmg, this.cx);
    return false;
  }
  gravityMove() { this.vy = Math.min(this.vy + 0.3, 7); this.move(this.vx, this.vy); if (this.onGround) this.vy = 0; if (this.y > this.L.H + 40) this.dead = true; }
  drawSpr(c, cx, cy, frame, o = {}) {
    const s = P.SP(this.spr); if (!s) return;
    const x = Math.round(this.cx - s.w / 2 - cx + (o.dx || 0)), y = Math.round(this.y + this.h - s.h - cy + this.oy);
    P.spr(c, this.spr, frame, x, y, { flip: this.face < 0, flash: this.flash > 0 });
    if (this.poisonT > 0) P.drawGlow(c, x + s.w / 2, y + s.h / 2, s.w * 0.6, '#9cff6a', 0.25);
    if (this.frozenT > 0) { this.frozenT--; c.globalAlpha = 0.45; c.fillStyle = '#bfefff'; c.fillRect(x + 2, y + 2, s.w - 4, s.h - 4); c.globalAlpha = 1; P.drawGlow(c, x + s.w / 2, y + s.h / 2, s.w * 0.6, '#7ad8ff', 0.3); }
    if (!this.natural || this.angry) { if (this.t % 40 < 2 && !this.passive && this.L.restoredAt(this.cx) === false && this.natural) P.drawGlow(c, x + s.w / 2, y + 4, 8, '#c04ad0', 0.4); }
    if (this.passive && this.kind && this.obsT > 0 && this.obsT % 60 > 0 && P.State.data.codex[this.kind] && !P.State.data.codex[this.kind].done && P.dist(this.cx, this.cy, this.L.player.cx, this.L.player.cy) < 110) {
      const a = (this.obsT % 60) / 60 * Math.PI * 2; c.strokeStyle = '#5ee8ff'; c.lineWidth = 1; c.beginPath(); c.arc(this.cx - cx, this.y - cy - 8, 4, -Math.PI / 2, -Math.PI / 2 + a); c.stroke();
    }
    if (this.hp < this.maxhp && !this.boss && !this.passive) { P.bar(c, Math.round(this.cx - cx - 8), Math.round(this.y - cy - 5), 16, 3, this.hp / this.maxhp, '#ff5a6a'); }
  }
};

// Krazith (natural o cibernético)
P.Crab = class extends P.Enemy {
  constructor(L, x, y, cyber) {
    super(L, x, y - 8, cyber ? 20 : 18, cyber ? 14 : 11, cyber ? { kind: 'krazith_cy', hp: 24, dmg: 14, xp: 10, drops: { scrap: 2 }, cyber: true, spr: 'krazith_cy' } : { kind: 'krazith', hp: 14, dmg: 12, xp: 6, drops: { bio: 1 }, natural: true, spr: 'krazith' });
    this.face = Math.random() < 0.5 ? -1 : 1; this.speed = cyber ? 0.55 : 0.5; this.cd = P.ri(60, 120);
  }
  update() {
    if (this.commonUpdate()) { this.gravityMove(); return; }
    const p = this.L.player, dx = p.cx - this.cx, ady = Math.abs(p.cy - this.cy);
    this.st++;
    if (this.passive) {
      if (this.state !== 'walk' && this.st > 90) { this.state = 'walk'; this.st = 0; this.face = P.pick([-1, 1]); }
      if (this.state === 'walk') { this.vx = this.face * 0.3; if (this.st > 120) { this.state = 'idle'; this.st = 0; this.vx = 0; } }
      if (this.hitWall || (this.onGround && this.ledgeAhead(this.face))) { this.face *= -1; this.vx = -this.vx; }
      this.gravityMove(); return;
    }
    switch (this.state) {
      case 'idle': case 'walk':
        this.vx = this.face * this.speed;
        if (this.hitWall || (this.onGround && this.ledgeAhead(this.face))) { this.face *= -1; this.vx = this.face * this.speed; }
        if (this.cyber) { if (--this.cd <= 0 && Math.abs(dx) < 220 && ady < 60) { this.state = 'aim'; this.st = 0; this.face = Math.sign(dx) || 1; } }
        else if (Math.abs(dx) < 95 && ady < 30) { this.state = 'wind'; this.st = 0; this.face = Math.sign(dx) || 1; }
        break;
      case 'wind': this.vx = 0; if (this.st > 22) { this.state = 'charge'; this.st = 0; } break;
      case 'charge': this.vx = this.face * 2.5; if (this.st > 32 || this.hitWall || (this.onGround && this.ledgeAhead(this.face))) { this.state = 'walk'; this.st = 0; this.vx = 0; } break;
      case 'aim': this.vx = 0; if (this.st === 25) { this.L.add(new P.Proj(this.L, this.cx + this.face * 6, this.y + 1, this.face * 3, -0.2, { dmg: 10, spr: 'b_red', glow: '#ff3040', life: 110 })); P.Audio.sfx('eshoot'); } if (this.st > 40) { this.state = 'walk'; this.cd = P.ri(90, 150); } break;
    }
    this.gravityMove();
  }
  draw(c, cx, cy) { const f = (this.state === 'wind' || this.state === 'aim') ? 4 : Math.floor(this.t / (this.state === 'charge' ? 4 : 9)) % 4; this.drawSpr(c, cx, cy, Math.abs(this.vx) > 0.05 || this.state === 'wind' || this.state === 'aim' ? f : 0); }
};

P.Frog = class extends P.Enemy {
  constructor(L, x, y) { super(L, x, y - 4, 14, 11, { kind: 'frog', hp: 10, dmg: 10, xp: 6, drops: { bio: 1 }, natural: true, spr: 'frog' }); this.cd = P.ri(40, 100); this.face = -1; }
  update() {
    if (this.commonUpdate()) { this.gravityMove(); return; }
    const p = this.L.player, dx = p.cx - this.cx;
    if (this.onGround) {
      this.vx *= 0.7;
      if (--this.cd <= 0) {
        if (this.passive) { this.face = P.pick([-1, 1]); this.vy = -3.5; this.vx = this.face * 1.1; this.cd = P.ri(80, 160); }
        else if (Math.abs(dx) < 150 && Math.abs(dx) > 40 && Math.random() < 0.5) {
          this.face = Math.sign(dx); this.spit = 18; this.cd = P.ri(70, 110);
          this.L.add(new P.Proj(this.L, this.cx + this.face * 6, this.y + 2, this.face * P.clamp(Math.abs(dx) / 45, 1.4, 3.2), -2.8, { dmg: 9, spr: 'b_glob', grav: 0.14, life: 120 })); P.Audio.sfx('splash');
        } else { this.face = Math.abs(dx) < 200 ? Math.sign(dx) || 1 : P.pick([-1, 1]); this.vy = -4.4; this.vx = this.face * 1.7; this.cd = P.ri(60, 110); }
      }
    }
    if (this.spit > 0) this.spit--;
    if (this.hitWall) this.vx = 0;
    this.gravityMove();
  }
  draw(c, cx, cy) { this.drawSpr(c, cx, cy, this.spit > 0 ? 2 : (!this.onGround ? 1 : 0)); }
};

P.Fly = class extends P.Enemy {
  constructor(L, x, y, cyber) {
    super(L, x, y, 16, 9, cyber ? { kind: L.theme === 'facility' || L.theme === 'lab' ? null : 'dfly_cy', hp: 12, dmg: 10, xp: 8, drops: { scrap: 1 }, cyber: true, flying: true, spr: L.theme === 'facility' || L.theme === 'lab' ? 'drone' : 'dfly_cy', beast: !(L.theme === 'facility' || L.theme === 'lab') }
      : { kind: 'dfly', hp: 6, dmg: 8, xp: 5, drops: { bio: 1 }, natural: true, flying: true, spr: 'dfly' });
    this.isCyber = cyber; this.cd = P.ri(60, 120); this.ph = Math.random() * 7;
  }
  update() {
    if (this.commonUpdate()) { this.x += this.vx; return; }
    const p = this.L.player, dx = p.cx - this.cx, dy = p.cy - this.cy, d = Math.hypot(dx, dy);
    this.ph += 0.05;
    if (this.state === 'swoop') {
      this.st++; this.x += this.vx; this.y += this.vy;
      if (this.st > 40) { this.state = 'back'; }
    } else {
      let tx = this.home.x + Math.sin(this.ph) * 30, ty = this.home.y + Math.sin(this.ph * 1.7) * 10;
      if (this.isCyber && d < 200) { tx = p.cx - Math.sign(dx || 1) * 90; ty = p.cy - 50; this.face = Math.sign(dx) || 1; }
      this.x += (tx - this.cx) * 0.03; this.y += (ty - this.cy) * 0.03;
      if (!this.isCyber) this.face = Math.cos(this.ph) > 0 ? 1 : -1;
      if (!this.passive && --this.cd <= 0 && d < 170) {
        if (this.isCyber) { const a = Math.atan2(dy, dx); this.L.add(new P.Proj(this.L, this.cx, this.cy + 2, Math.cos(a) * 3, Math.sin(a) * 3, { dmg: 9, spr: 'b_red', glow: '#ff3040', life: 110, rot: true })); P.Audio.sfx('eshoot'); this.cd = P.ri(90, 140); }
        else if (d < 120) { this.state = 'swoop'; this.st = 0; const a = Math.atan2(dy, dx); this.vx = Math.cos(a) * 2.6; this.vy = Math.sin(a) * 2.6; this.face = Math.sign(this.vx); this.cd = P.ri(100, 160); }
        else this.cd = 30;
      }
      if (this.state === 'back' && Math.abs(this.cy - this.home.y) < 8) this.state = 'idle';
    }
    if (this.L.coll(Math.floor(this.cx / TS), Math.floor(this.cy / TS)) === 1) { this.x -= this.vx * 2; this.y -= this.vy * 2; this.state = 'back'; }
  }
  draw(c, cx, cy) { this.drawSpr(c, cx, cy, Math.floor(this.t / 3) % 2); }
};

P.Slug = class extends P.Enemy {
  constructor(L, x, y) { super(L, x, y - 2, 20, 8, { kind: 'slug', hp: 22, dmg: 8, xp: 7, drops: { bio: 2 }, natural: true, spr: 'slug' }); this.face = -1; }
  update() {
    if (this.commonUpdate()) { this.gravityMove(); return; }
    const p = this.L.player, dx = p.cx - this.cx;
    if (!this.passive && Math.abs(dx) < 140 && Math.abs(p.cy - this.cy) < 40) this.face = Math.sign(dx) || 1;
    const pulse = Math.floor(this.t / 20) % 2;
    this.vx = pulse ? this.face * (this.passive ? 0.15 : 0.32) : 0;
    if (this.hitWall || (this.onGround && this.ledgeAhead(this.face))) this.face *= -1;
    if (!this.passive && this.t % 40 === 0) this.L.parts.add({ x: this.cx - this.face * 8, y: this.y + this.h - 1, life: 120, col: '#c8ff4a', size: 2, fade: true });
    this.gravityMove();
  }
  draw(c, cx, cy) { this.drawSpr(c, cx, cy, Math.floor(this.t / 20) % 2); }
};

P.Maw = class extends P.Enemy {
  constructor(L, x, y) { super(L, x - 2, y - 14, 16, 30, { kind: 'fauces', hp: 20, dmg: 0, xp: 9, drops: { bio: 3 }, spr: 'maw', heavy: true }); this.cd = 60; this.face = -1; }
  update() {
    if (this.commonUpdate()) return;
    const p = this.L.player, dx = p.cx - this.cx; this.face = Math.sign(dx) || this.face;
    this.st++;
    if (this.state === 'bite') {
      if (this.st === 14) { const box = { x: this.face > 0 ? this.cx : this.cx - 30, y: this.y, w: 30, h: 22 }; if (P.overlap(box, p)) p.hurt(14, this.cx); P.Audio.sfx('hit'); }
      if (this.st > 30) { this.state = 'idle'; this.st = 0; }
    } else if (Math.abs(dx) < 34 && Math.abs(p.cy - this.cy) < 30) { this.state = 'bite'; this.st = 0; }
    else if (--this.cd <= 0 && Math.abs(dx) < 170) { this.cd = 110; this.L.add(new P.Proj(this.L, this.cx + this.face * 8, this.y + 6, this.face * P.clamp(Math.abs(dx) / 50, 1.2, 3), -2.6, { dmg: 9, spr: 'b_orb', grav: 0.13, life: 130 })); P.Audio.sfx('eshoot'); this.open = 12; }
    if (this.open > 0) this.open--;
  }
  draw(c, cx, cy) { this.drawSpr(c, cx, cy, this.state === 'bite' ? (this.st < 14 ? 1 : 2) : this.open > 0 ? 1 : 0); }
};

P.VSnake = class extends P.Enemy {
  constructor(L, x, y) {
    super(L, x - 3, y, 6, 16, { kind: 'vsnake', hp: 10, dmg: 0, xp: 7, drops: { bio: 1 }, natural: true, spr: 'vsnake', heavy: true });
    let ty = Math.floor(y / TS); while (ty > 0 && L.coll(Math.floor((x) / TS), ty - 1) !== 1) ty--; this.y = ty * TS; this.top = this.y;
  }
  update() {
    if (this.commonUpdate()) return;
    const p = this.L.player; this.st++;
    if (this.state === 'idle') { this.h = 16; if (!this.passive && Math.abs(p.cx - this.cx) < 18 && p.y > this.y && p.y - this.y < 90) { this.state = 'drop'; this.st = 0; } }
    else { this.h = 32; if (this.st > 6 && this.st < 30 && P.overlap(this, p)) p.hurt(12, this.cx); if (this.st > 50) { this.state = 'idle'; this.st = 0; } }
  }
  draw(c, cx, cy) { const s = P.S.vsnake; P.spr(c, 'vsnake', this.state === 'drop' ? 1 : 0, Math.round(this.cx - 6 - cx), Math.round(this.top - cy), { flash: this.flash > 0 }); }
};

P.Soldier = class extends P.Enemy {
  constructor(L, x, y) { super(L, x, y - 8, 10, 22, { kind: null, hp: 20, dmg: 10, xp: 10, drops: { scrap: 2 }, cyber: false, beast: false, spr: 'soldier' }); this.face = -1; this.cd = P.ri(30, 90); this.burst = 0; }
  update() {
    if (this.commonUpdate()) { this.gravityMove(); return; }
    const p = this.L.player, dx = p.cx - this.cx, ady = Math.abs(p.cy - this.cy);
    this.st++;
    if (this.state === 'aim') {
      this.vx = 0; this.face = Math.sign(dx) || this.face;
      if (this.st > 26 && this.st % 9 === 0 && this.burst < 3) { this.burst++; this.L.add(new P.Proj(this.L, this.cx + this.face * 10, this.y + 7, this.face * 3.6, 0, { dmg: 9, spr: 'b_red', glow: '#ff3040', life: 100 })); P.Audio.sfx('eshoot'); }
      if (this.st > 60) { this.state = 'walk'; this.st = 0; this.cd = P.ri(70, 120); }
    } else {
      this.vx = this.face * 0.6;
      if (this.hitWall || (this.onGround && this.ledgeAhead(this.face))) this.face *= -1;
      if (--this.cd <= 0 && Math.abs(dx) < 210 && ady < 40) { this.state = 'aim'; this.st = 0; this.burst = 0; }
    }
    this.gravityMove();
  }
  draw(c, cx, cy) { this.drawSpr(c, cx, cy, this.state === 'aim' ? 5 : 1 + Math.floor(this.t / 8) % 4); }
};

P.Alpha = class extends P.Enemy {
  constructor(L, x, y) { super(L, x, y - 20, 40, 26, { kind: 'krazith_alfa', hp: 170, dmg: 16, xp: 60, drops: { bio: 6, crys: 2 }, spr: 'krazith_alfa', heavy: true }); this.boss = false; this.mini = true; this.face = -1; this.cd = 90; }
  update() {
    if (this.commonUpdate()) { this.gravityMove(); return; }
    const p = this.L.player, dx = p.cx - this.cx; this.st++;
    if (!this.L.arena && Math.abs(dx) < 200) this.L.startArena(this);
    switch (this.state) {
      case 'idle': this.vx = this.face * 0.6; if (this.hitWall) this.face *= -1; if (--this.cd <= 0) { this.state = P.pick(['charge', 'jump', 'spines']); this.st = 0; this.face = Math.sign(dx) || 1; } break;
      case 'charge': this.vx = this.st < 25 ? 0 : this.face * 3.4; if (this.st > 25 && this.hitWall) { P.shake(4, 10); P.Audio.sfx('break'); this.stun = 40; this.state = 'idle'; this.cd = 70; } if (this.st > 90) { this.state = 'idle'; this.cd = 60; } break;
      case 'jump': if (this.st === 15) { this.vy = -6.5; this.vx = P.clamp(dx / 40, -2.5, 2.5); } if (this.st > 20 && this.onGround) { P.shake(4, 12); P.Audio.sfx('explode'); for (const s of [-1, 1]) this.L.add(new P.Proj(this.L, this.cx + s * 20, this.y + this.h - 5, s * 2.8, 0, { dmg: 12, spr: 'b_orb', life: 70, w: 8, h: 8 })); this.state = 'idle'; this.cd = 70; this.vx = 0; } break;
      case 'spines': this.vx = 0; if (this.st === 20 || this.st === 35) { for (let i = -1; i <= 1; i++) this.L.add(new P.Proj(this.L, this.cx, this.y, P.clamp(dx / 60, -3, 3) + i * 0.8, -4.5, { dmg: 10, spr: 'b_kspine', grav: 0.15, life: 140, rot: true })); P.Audio.sfx('spine'); } if (this.st > 50) { this.state = 'idle'; this.cd = 60; } break;
    }
    this.gravityMove();
  }
  die() { super.die(); this.L.endArena(); P.shake(6, 20); P.Audio.sfx('bigexplode'); }
  draw(c, cx, cy) { this.drawSpr(c, cx, cy, this.state === 'spines' || (this.state === 'charge' && this.st < 25) ? 4 : Math.floor(this.t / 7) % 4); if (this.hp < this.maxhp) { P.bar(c, Math.round(this.cx - cx - 20), Math.round(this.y - cy - 8), 40, 4, this.hp / this.maxhp, '#ffd166'); } }
};

// Criatura pacífica (solo en territorio restaurado)
P.Grazer = class extends P.Enemy {
  constructor(L, x, y, kind) { const sp = P.D.species(kind) || {}, leg = sp.rarity === 'legendaria'; super(L, x, y - 12, leg ? 26 : 30, leg ? 28 : 20, { kind, hp: 999, dmg: 0, xp: 0, natural: true, spr: sp.spr || kind, harmless: true }); this.legend = leg; this.passive = true; this.untouchable = true; this.face = 1; }
  update() {
    this.commonUpdate(); this.passive = true; this.st++;
    if (this.state === 'walk') { this.vx = this.face * 0.35; if (this.st > 100 || this.hitWall || (this.onGround && this.ledgeAhead(this.face))) { this.state = 'graze'; this.st = 0; this.vx = 0; } }
    else if (this.st > P.ri(90, 200)) { this.state = 'walk'; this.st = 0; this.face = P.pick([-1, 1]); }
    this.gravityMove();
    if (this.legend && this.t % 5 === 0) this.L.parts.add({ x: this.cx + P.rand(-12, 12), y: this.y + P.rand(0, 10), vy: -0.4, life: 40, col: '#ffd166', size: 1, glow: 3 });
  }
  draw(c, cx, cy) { if (this.legend) P.drawGlow(c, this.cx - cx, this.cy - cy, 30, '#bafff0', 0.25); this.drawSpr(c, cx, cy, this.legend ? Math.floor(this.t / 30) % 2 : this.state === 'walk' ? Math.floor(this.t / 12) % 2 : 2); }
};

// ================= OBJETOS =================
P.Extractor = class extends P.Ent {
  constructor(L, x, y) { super(L, x - 12, y - 46, 24, 46); this.isEnemy = true; this.hp = this.maxhp = Math.round(70 * (L.diff || 1)); this.heavy = true; this.untouchable = false; this.objective = true; }
  hit(d) {
    if (this.dead) return; this.hp -= Math.round(d); this.flash = 5; P.Audio.sfx('ehit');
    this.L.parts.burst(this.cx + P.rand(-8, 8), this.cy + P.rand(-15, 15), 3, { col: '#e0b0ff', smin: 0.5, smax: 2 });
    if (this.hp <= 0) {
      this.dead = true; P.Audio.sfx('bigexplode'); P.shake(7, 30); P.hitstop = 8;
      for (let i = 0; i < 50; i++) this.L.parts.add({ x: this.cx + P.rand(-12, 12), y: this.cy + P.rand(-20, 20), vx: P.rand(-3, 3), vy: P.rand(-5, 1), g: 0.12, life: P.ri(30, 60), col: P.pick(['#9a4ad0', '#e0b0ff', '#ffb030', '#6c7488']), size: 2, glow: 4, shrink: true });
      P.drop(this.L, this.cx, this.cy, { xp: 30, scrap: 4, crys: 1 });
      this.L.onExtractorDestroyed(this);
    }
  }
  update() {
    this.t++; if (this.flash > 0) this.flash--;
    if (this.t % 3 === 0) this.L.parts.add({ x: this.cx + P.rand(-2, 2), y: this.y - 4, vy: -P.rand(2, 4), life: 30, col: P.pick(['#c04ad0', '#e0b0ff']), size: 2, glow: 4 });
    if (this.t % 7 === 0) { const a = Math.random() * Math.PI, r = 60; this.L.parts.add({ x: this.cx + Math.cos(a) * r, y: this.y + this.h + 2, vx: -Math.cos(a) * 1.2, vy: -0.4, life: 50, col: '#5ef0d0', size: 1 }); }
  }
  draw(c, cx, cy) {
    const x = Math.round(this.cx - 19 - cx), y = Math.round(this.y + this.h - 54 - cy);
    c.globalAlpha = 0.35 + Math.sin(this.t * 0.2) * 0.15; c.fillStyle = '#c04ad0'; c.fillRect(x + 17, -10, 4, y + 10); c.globalAlpha = 1;
    P.spr(c, 'extractor', Math.floor(this.t / 20) % 2, x, y, { flash: this.flash > 0 });
    P.drawGlow(c, x + 19, y + 28, 18, '#c04ad0', 0.4);
    P.bar(c, x + 4, y - 6, 30, 3, this.hp / this.maxhp, '#c04ad0');
  }
};

P.Item = class extends P.Ent { // holograma, memoria, semilla, mejora, recurso oculto
  constructor(L, x, y, def, key) { super(L, x - 5, y - 10, 10, 12); this.def = def; this.key = key; this.by = this.y; }
  update() {
    this.t++; this.y = this.by + Math.sin(this.t * 0.06) * 2;
    const p = this.L.player;
    if (!p.dead && P.overlap(this, p)) this.L.collectItem(this);
  }
  draw(c, cx, cy) {
    const d = this.def, spr = { holo: 'holo', mem: 'memory', seed: 'seed', up: 'upgrade', res: 'r_crys', comp: 'i_thermo' }[d.t] || 'r_crys';
    const col = { holo: '#5ee8ff', mem: '#ff8a5a', seed: '#ffd166', up: '#ffd166', res: '#ffd166', comp: '#57ff7a' }[d.t] || '#ffd166';
    P.drawGlow(c, this.cx - cx, this.cy - cy, d.t === 'up' ? 18 : 10, col, 0.5 + Math.sin(this.t * 0.1) * 0.2);
    const s = P.SP(spr); P.spr(c, spr, Math.floor(this.t / 8), this.cx - s.w / 2 - cx, this.cy - s.h / 2 - cy);
  }
};

P.Chest = class extends P.Ent {
  constructor(L, x, y, key, opened) { super(L, x - 8, y - 12, 16, 12); this.key = key; this.open = opened; this.interact = !opened; }
  get prompt() { return 'Abrir'; }
  use() {
    if (this.open) return; this.open = true; this.interact = false; P.Audio.sfx('unlock');
    this.L.lvs.chests[this.key] = true;
    const r = P.RNG(P.hash(this.key));
    P.drop(this.L, this.cx, this.y, { xp: 15, bio: r.int(1, 4), scrap: r.int(1, 4), crys: r() < 0.6 ? r.int(1, 2) : 0 });
    for (let i = 0; i < 16; i++) this.L.parts.add({ x: this.cx + P.rand(-6, 6), y: this.y, vx: P.rand(-1, 1), vy: -P.rand(1, 3), life: 30, col: '#ffd166', size: 1, glow: 3 });
  }
  update() { this.t++; }
  draw(c, cx, cy) { P.spr(c, 'chest', this.open ? 1 : 0, this.x - 1 - cx, this.y - 2 - cy); }
};

P.Beacon = class extends P.Ent {
  constructor(L, x, y) { super(L, x - 6, y - 24, 12, 24); this.on = false; }
  update() {
    this.t++; const p = this.L.player;
    if (!this.on && !p.dead && P.overlap(this, p)) {
      this.on = true; this.L.checkpoint = { x: this.x, y: this.y + 4 }; P.Audio.sfx('checkpoint'); p.heal(Math.round(p.maxHP * 0.3), true);
      P.toast('Baliza de salto activada', { col: P.UIC.green, life: 100 });
      for (let i = 0; i < 20; i++) this.L.parts.add({ x: this.cx, y: this.y + 4, vx: P.rand(-1.5, 1.5), vy: P.rand(-3, -0.5), life: 40, col: '#7dffa0', size: 1, glow: 3 });
    }
  }
  draw(c, cx, cy) { if (this.on) P.drawGlow(c, this.cx - cx, this.y + 4 - cy, 16 + Math.sin(this.t * 0.1) * 3, '#3fe08a', 0.6); P.spr(c, 'beacon', this.on ? 1 : 0, this.x - cx, this.y - cy); }
};

P.Gate = class extends P.Ent {
  constructor(L, x, y) { super(L, x - 16, y - 44, 32, 44); }
  get open() { return this.L.extractorsLeft === 0 && !this.L.arena; }
  update() {
    this.t++; const p = this.L.player;
    if (this.open && !p.dead && Math.abs(p.cx - this.cx) < 8 && p.y + p.h > this.y + 20) this.L.finish();
    if (!this.open && !p.dead && Math.abs(p.cx - this.cx) < 30 && !this.warned) { this.warned = true; P.toast('Portal sellado: destruye las extractoras (' + this.L.extractorsLeft + ')', { col: P.UIC.red }); }
    if (Math.abs(p.cx - this.cx) > 60) this.warned = false;
  }
  draw(c, cx, cy) {
    const x = Math.round(this.x - 1 - cx), y = Math.round(this.y - 2 - cy);
    if (this.open) {
      c.save(); c.beginPath(); c.ellipse(x + 17, y + 26, 10, 16, 0, 0, 7); c.clip();
      for (let i = 0; i < 6; i++) { c.strokeStyle = ['#5ef0d0', '#7dffa0', '#bafff0'][i % 3]; c.globalAlpha = 0.6; c.beginPath(); c.ellipse(x + 17, y + 26, 10 - i * 1.5, 16 - i * 2.4, this.t * 0.05 + i, 0, 5); c.stroke(); }
      c.restore(); c.globalAlpha = 1; P.drawGlow(c, x + 17, y + 26, 26, '#5ef0d0', 0.6);
    } else {
      c.globalAlpha = 0.5 + Math.sin(this.t * 0.15) * 0.2; c.fillStyle = '#ff3a5a'; c.fillRect(x + 8, y + 12, 18, 30); c.globalAlpha = 1;
      for (let i = 0; i < 4; i++) { c.fillStyle = '#ffb0b8'; c.fillRect(x + 8, y + 12 + ((this.t + i * 8) % 30), 18, 1); }
    }
    P.spr(c, 'gate', 0, x, y);
  }
};

// Decoración interactiva / escaneable
P.Decor = class extends P.Ent {
  constructor(L, x, y, spr, species, o = {}) {
    const s = P.SP(spr); super(L, x - s.w / 2, y - s.h, s.w, s.h); this.spr = spr; this.species = species; Object.assign(this, o);
    this.seen = false; this.ph = Math.random() * 100;
    const sp = species && P.D.species(species); this.sway = sp && sp.col === 'flora' && this.frame == null ? (s.h > 24 ? 1.4 : 1) : 0;
  }
  get interact() { return this.species && !this.scanned(); }
  scanned() { const e = P.State.data.codex[this.species]; if (!e) return false; const sp = P.D.species(this.species); const i = sp.tasks.findIndex(t => t.k === 'scan'); return i < 0 || e.prog[i] >= 1; }
  get prompt() { return 'Escanear'; }
  use() { this.L.startScan(this); }
  update() {
    this.t++;
    if (!this.seen && this.species && this.onScreen(-10)) { this.seen = true; P.State.see(this.species, this.L.restoredAt(this.cx)); }
    if (this.toxic) {
      const p = this.L.player;
      if (this.puff > 0) { this.puff--; if (this.puff % 4 === 0) this.L.parts.add({ x: this.cx + P.rand(-10, 10), y: this.y + P.rand(-4, 6), vy: -0.3, vx: P.rand(-0.4, 0.4), life: 50, col: '#ffb030', size: 3, fade: true }); if (P.dist(p.cx, p.cy, this.cx, this.cy - 4) < 20) p.hurt(6, this.cx, { noKnock: true }); }
      else if (!this.L.restoredAt(this.cx) && P.dist(p.cx, p.cy, this.cx, this.cy) < 36 && this.t % 120 > 60) { this.puff = 60; }
    }
  }
  draw(c, cx, cy) {
    const x = Math.round(this.x - cx), y = Math.round(this.y - cy);
    if (this.light) P.drawGlow(c, x + this.w / 2, y + 6, 16 + Math.sin((this.t + this.ph) * 0.05) * 2, this.light, 0.5);
    if (this.sway) { const n = P.SP(this.spr).f.length, still = /fern/.test(this.spr); P.drawSway(c, this.spr, still ? 0 : Math.floor((this.t + this.ph) / 50) % n, x, y, { t: this.L.t, ph: this.ph + this.x * 0.02, amp: this.sway, flutter: 0.35, step: 1 }); return; }
    P.spr(c, this.spr, this.frame != null ? this.frame : Math.floor((this.t + this.ph) / 40) % (P.SP(this.spr).f.length), x, y);
  }
};

P.HealPlant = class extends P.Decor {
  constructor(L, x, y) { super(L, x, y, 'heal', L.fl ? L.fl('h', 'salvia') : 'salvia', { light: '#3fa0ff' }); this.used = false; }
  get interact() { return !this.used || !this.scanned(); }
  get prompt() { return this.used ? 'Escanear' : 'Usar / escanear'; }
  use() {
    if (!this.used) { this.used = true; this.light = null; this.L.player.heal(45); if (!this.scanned()) P.State.task(this.species, 'scan'); }
    else this.L.startScan(this);
  }
  draw(c, cx, cy) { const x = Math.round(this.x - cx), y = Math.round(this.y - cy); if (!this.used) P.drawGlow(c, x + 7, y + 6, 12, '#3fa0ff', 0.6); P.spr(c, 'heal', this.used ? 1 : 0, x, y); }
};

// Jaula de rescate (se rompe a disparos)
P.Cage = class extends P.Ent {
  constructor(L, x, y, npc) { super(L, x - 15, y - 32, 30, 32); this.npc = npc; this.isEnemy = true; this.hp = 30; this.maxhp = 30; this.heavy = true; this.broken = false; this.beast = false; }
  hit(d) { if (this.broken) return; this.hp -= d; this.flash = 4; P.Audio.sfx('block'); if (this.hp <= 0) { this.broken = true; this.isEnemy = false; P.Audio.sfx('break'); this.L.parts.burst(this.cx, this.cy, 16, { col: '#a6aec0', smin: 1, smax: 3, g: 0.15 }); this.L.onCageBroken(this); } }
  update() { this.t++; if (this.flash > 0) this.flash--; }
  draw(c, cx, cy) { P.spr(c, 'cage', this.broken ? 1 : 0, this.x - cx, this.y - cy, { flash: this.flash > 0 }); if (!this.broken) P.bar(c, Math.round(this.cx - cx - 10), Math.round(this.y - cy - 5), 20, 3, this.hp / this.maxhp, '#a6aec0'); }
};

// NPC que camina (vista lateral)
P.D.VILLAGER_LINES = {
  pleyadiano: ['¡Las Lumbrelas vuelven a brillar! Hacía ciclos que no las veía.', 'Mi abuela decía que la selva canta cuando está sana. ¿La oyes, {N}?', 'Replantaremos Lirae, hoja por hoja.'],
  arturiano: ['Las extractoras dejaron cicatrices en las raíces. Las repararemos.', 'Tu armadura tiene un diseño de la República. Fascinante ingeniería.', 'Calculo que la selva tardará tres estaciones en recuperarse del todo.'],
  reptiliano: ['Los Krazith vuelven a cazar como antes. Así debe ser.', 'Peleas bien, metálico. Para ser tan rojo.', 'Mi clan te debe una deuda de honor.'],
  andromedano: ['He registrado cada especie que vuelve. La memoria de la selva no se perderá.', 'Las estrellas ya no se ven desde aquí... la Esfera las tapa. Algún día.', 'Hay registros tuyos en los archivos antiguos, {N}. Fragmentados, pero están.'],
  lemuriano: ['El agua vuelve a ser clara. El océano de Thalassyr nos espera.']
};
P.Walker = class extends P.Ent {
  constructor(L, x, y, look, civ, lines, name) {
    super(L, x - 5, y - 20, 10, 20); this.look = look; this.civ = civ; this.lines = lines; this.npcName = name; this.face = P.pick([-1, 1]); this.home = x; this.interact = true;
  }
  get prompt() { return 'Hablar'; }
  use() { const S = P.State; const line = this.lines ? this.lines : P.pick(P.D.VILLAGER_LINES[this.civ] || ['...']); this.face = Math.sign(this.L.player.cx - this.cx) || 1; this.L.say(Array.isArray(line) ? line : [[this.look, line, this.npcName || P.CIV[this.civ].name.slice(0, -1)]]); }
  update() {
    this.t++; this.st = (this.st || 0) + 1;
    const p = this.L.player, near = P.dist(p.cx, p.cy, this.cx, this.cy) < 40;
    if (near) { this.vx = 0; this.face = Math.sign(p.cx - this.cx) || this.face; }
    else if (this.walking) { this.vx = this.face * 0.4; if (this.st > 80 || Math.abs(this.cx - this.home) > 60 || this.hitWall || (this.onGround && this.ledgeAhead(this.face))) { this.walking = false; this.st = 0; if (Math.abs(this.cx - this.home) > 60) this.face = Math.sign(this.home - this.cx); } }
    else { this.vx = 0; if (this.st > 100 + (this.home % 60)) { this.walking = true; this.st = 0; if (Math.random() < 0.5) this.face *= -1; } }
    this.vy = Math.min(this.vy + 0.3, 6); this.move(this.vx, this.vy); if (this.onGround) this.vy = 0;
  }
  draw(c, cx, cy) { const f = this.walking ? 2 + Math.floor(this.t / 8) % 4 : Math.floor(this.t / 40) % 2; P.spr(c, 'npc_' + this.look, f, Math.round(this.cx - 6 - cx), Math.round(this.y + this.h - 24 - cy), { flip: this.face < 0 }); }
};
