'use strict';
// Personajes de apoyo: máximo 2 espacios. El cyborg rojo siempre es el protagonista.
P.Companion = class extends P.Ent {
  constructor(L, w, h, id, slot) { const p = L.player; super(L, p.x - 20, p.y, w, h); this.id = id; this.slot = slot; this.cd = 0; this.fly = false; }
  follow(dist, speed = 2.6) {
    const p = this.L.player, tx = p.cx - p.face * dist - this.w / 2;
    const dx = tx - this.x;
    if (Math.abs(p.cx - this.cx) > 260 || Math.abs(p.cy - this.cy) > 180) { this.x = p.x - p.face * 14; this.y = p.y + p.h - this.h; this.vy = 0; this.L.parts.burst(this.cx, this.cy, 6, { col: '#bff6ff', lmin: 8, lmax: 14 }); }
    if (this.fly) {
      const ty = p.y - 10 + Math.sin(this.t * 0.06) * 3;
      this.x += dx * 0.08; this.y += (ty - this.y) * 0.08; this.face = Math.abs(dx) > 4 ? Math.sign(dx) : p.face;
      return Math.abs(dx) > 6;
    }
    let moving = false;
    if (Math.abs(dx) > 10) { this.vx = P.approach(this.vx, Math.sign(dx) * speed, 0.3); this.face = Math.sign(dx); moving = true; }
    else { this.vx = P.approach(this.vx, 0, 0.3); if (Math.abs(this.vx) < 0.2) this.face = p.face; }
    if (this.onGround && ((this.hitWall && moving) || (p.y + p.h < this.y + this.h - 30 && Math.abs(dx) < 50) || (moving && this.ledgeAhead(this.face) && p.y + p.h <= this.y + this.h + 4))) this.vy = -6;
    this.vy = Math.min(this.vy + 0.32, 7); this.move(this.vx, this.vy); if (this.onGround) this.vy = 0;
    if (this.y > this.L.H) { this.x = p.x; this.y = p.y; }
    return moving;
  }
  nearestEnemy(range) {
    let best = null, bd = range;
    for (const e of this.L.ents) if (e.isEnemy && !e.dead && !e.untouchable && !e.passive && e.hp > 0 && !(e instanceof P.Cage)) { const d = P.dist(this.cx, this.cy, e.cx, e.cy); if (d < bd) { bd = d; best = e; } }
    return best;
  }
};

// LUMA — sanación
P.Luma = class extends P.Companion {
  constructor(L, slot) { super(L, 14, 16, 'luma', slot); this.fly = true; this.bigCD = 300; this.pulse = 0; this.healAnim = 0; }
  update() {
    this.t++; this.follow(18 + this.slot * 14);
    const p = this.L.player; if (p.dead) return;
    if (this.bigCD > 0) this.bigCD--;
    if (this.healAnim > 0) this.healAnim--;
    if (p.hp < p.maxHP * 0.45 && this.bigCD <= 0) { this.bigCD = 1200; this.healAnim = 40; p.heal(Math.round(p.maxHP * 0.35)); P.toast('LUMA: reparación de emergencia', { col: '#7dffa0', icon: 'luma', life: 90 }); }
    if (++this.pulse >= 480) { this.pulse = 0; if (p.hp < p.maxHP) { p.heal(4, true); this.healAnim = 20; } }
  }
  get hud() { return { spr: 'luma', cd: this.bigCD / 1200 }; }
  draw(c, cx, cy) {
    const x = Math.round(this.x - 1 - cx), y = Math.round(this.y - 1 - cy), p = this.L.player;
    P.drawGlow(c, x + 8, y + 18, 5, '#7ff8ff', 0.5);
    if (this.healAnim > 0) { c.strokeStyle = '#7dffa0'; c.globalAlpha = this.healAnim / 40; c.beginPath(); c.moveTo(x + 8, y + 9); c.lineTo(p.cx - cx, p.cy - cy); c.stroke(); c.globalAlpha = 1; P.drawGlow(c, p.cx - cx, p.cy - cy, 16, '#7dffa0', this.healAnim / 40); }
    P.spr(c, 'luma', this.healAnim > 0 ? 2 : Math.floor(this.t / 30) % 2, x, y, { flip: this.face < 0 });
  }
};

// BRASA y BRISA — gemelos de apoyo ofensivo (un solo espacio)
P.Twin = class extends P.Companion {
  constructor(L, slot, blue) { super(L, 10, 12, 'twins', slot); this.blue = blue; this.cd = blue ? 30 : 0; this.off = 0; this.shoot = 0; }
  update() {
    this.t++;
    if (this.off > 0) { this.off--; this.vx = 0; this.vy = Math.min(this.vy + 0.3, 6); this.move(0, this.vy); if (this.off === 0) { P.Audio.sfx('select'); } return; }
    const moving = this.follow(16 + this.slot * 14 + (this.blue ? 14 : 0), 2.8); this.moving = moving;
    if (this.cd > 0) this.cd--; if (this.shoot > 0) this.shoot--;
    const e = this.nearestEnemy(170);
    if (e && this.cd <= 0) {
      this.face = Math.sign(e.cx - this.cx) || 1; this.shoot = 10; this.cd = P.ri(48, 66);
      const a = Math.atan2(e.cy - (this.y + 5), e.cx - this.cx);
      this.L.add(new P.Proj(this.L, this.cx + this.face * 6, this.y + 5, Math.cos(a) * 5, Math.sin(a) * 5, { dmg: 3 + P.State.data.lv * 0.4, owner: 'p', spr: 'b_red', life: 50, glow: this.blue ? '#7fe8ff' : '#ff6a5a', rot: true }));
      P.Audio.sfx('shoot');
    }
    for (const en of this.L.ents) if (en.isEnemy && !en.dead && !en.passive && en.dmg && P.overlap(en, this)) { this.off = 240; this.L.parts.burst(this.cx, this.cy, 8, { col: '#ffd166', lmin: 8, lmax: 16 }); P.Audio.sfx('hurt'); break; }
  }
  get hud() { return { spr: 'brasa', cd: 0 }; }
  draw(c, cx, cy) {
    const spr = this.blue ? 'brisa' : 'brasa';
    let f = Math.floor(this.t / 30) % 2;
    if (this.off > 0) f = 7; else if (this.shoot > 0) f = 6; else if (this.moving) f = 2 + Math.floor(this.t / 5) % 4;
    P.spr(c, spr, f, Math.round(this.x - 1 - cx), Math.round(this.y + this.h - 14 - cy), { flip: this.face < 0 });
    if (this.off > 0 && this.t % 20 < 10) P.txt(c, 'z', this.x + 6 - cx, this.y - 6 - cy, '#7c8aa8');
  }
};

// NOVA — rescate de emergencia. Acompaña al jugador a pie aunque no haga nada; cuando la salud llega a cero se eleva
// junto a él, lanza el rescate y vuelve a su lado.
P.Nova = class extends P.Companion {
  constructor(L, slot) { super(L, 14, 22, 'nova', slot); this.used = false; this.hidden = false; }
  update() {
    this.t++;
    if (this.seq != null) {
      const p = this.L.player; this.seq++;
      const tx = p.cx + 26 * -p.face, ty = p.y - 30;
      if (this.seq < 40) { this.x += (tx - this.x) * 0.12; this.y += (ty - this.y) * 0.12; if (this.seq % 2 === 0) this.L.parts.add({ x: this.cx + P.rand(-4, 4), y: this.cy + 8, vy: 1, life: 20, col: '#ff8ad8', size: 2, glow: 4 }); }
      if (this.seq === 40) this.L.novaStrike(this);
      // tras el rescate baja de nuevo a su lado
      if (this.seq > 100) { const gx = p.cx - p.face * (24 + this.slot * 14) - this.w / 2, gy = p.y + p.h - this.h; this.x += (gx - this.x) * 0.15; this.y += (gy - this.y) * 0.15; }
      if (this.seq > 130) { this.seq = null; this.vx = 0; this.vy = 0; }
      return;
    }
    this.moving = this.follow(24 + this.slot * 14, 2.7);
  }
  appear() { this.hidden = false; this.seq = 0; this.used = true; P.Audio.sfx('nova'); }
  get hud() { return { spr: 'i_heart', cd: this.used ? 1 : 0, used: this.used }; }
  draw(c, cx, cy) {
    if (this.hidden) return;
    const x = Math.round(this.x - 2 - cx), y = Math.round(this.y + this.h - 24 - cy), rescue = this.seq != null;
    if (rescue) P.drawGlow(c, x + 9, y + 12, 26 + Math.sin(this.t * 0.3) * 4, '#ff6fb3', 0.7);
    else P.drawGlow(c, x + 9, y + 14, 8, '#ff6fb3', 0.18);
    const f = rescue ? (this.seq > 30 && this.seq < 100 ? 2 : 0) : this.moving ? Math.floor(this.t / 6) % 2 : Math.floor(this.t / 30) % 2;
    P.spr(c, 'nova', f, x, y + (this.moving && !rescue && Math.floor(this.t / 6) % 2 ? -1 : 0), { flip: this.face < 0 });
  }
};

// SIRIO — el Sabueso Celestial
P.Sirio = class extends P.Companion {
  constructor(L, slot) { super(L, 22, 14, 'sirio', slot); this.biteCD = 0; this.protCD = 0; this.sniffCD = 120; this.idleT = 0; this.pose = 'stand'; this.marks = []; this.alerted = false; this.biteT = 0; this.protT = 0; }
  update() {
    this.t++; const L = this.L, p = L.player;
    for (const k of ['biteCD', 'protCD', 'sniffCD']) if (this[k] > 0) this[k]--;
    if (this.biteT > 0) this.biteT--; if (this.protT > 0) this.protT--;
    const e = this.nearestEnemy(150);
    // alerta de jefe
    if (!this.alerted) { const b = L.ents.find(x => x.boss && !x.dead); if (b && P.dist(b.cx, b.cy, this.cx, this.cy) < 420) { this.alerted = true; P.Audio.sfx('bark'); P.toast('SIRIO percibe una presencia colosal…', { col: '#bff6ff', icon: 'por_sirio', life: 150 }); this.pose = 'growl'; this.growlT = 60; } }
    if (this.growlT > 0) { this.growlT--; this.vx = 0; this.vy = Math.min(this.vy + 0.32, 7); this.move(0, this.vy); return; }
    // morder
    if (e && P.dist(e.cx, e.cy, this.cx, this.cy) < 34 && this.biteCD <= 0) {
      this.face = Math.sign(e.cx - this.cx) || 1; this.biteCD = 55; this.biteT = 14; e.hit(7 + P.State.data.lv * 0.6, { x: this.cx, knock: 1.5 }); P.Audio.sfx('bark');
    }
    // perseguir enemigos cercanos al jugador
    if (e && P.dist(e.cx, e.cy, p.cx, p.cy) < 120 && !e.flying) {
      const dx = e.cx - this.cx; this.vx = P.approach(this.vx, Math.sign(dx) * 3, 0.35); this.face = Math.sign(dx);
      if (this.onGround && this.hitWall) this.vy = -6;
      this.vy = Math.min(this.vy + 0.32, 7); this.move(this.vx, this.vy); if (this.onGround) this.vy = 0;
      this.pose = this.biteT > 0 ? 'bite' : 'run'; this.idleT = 0;
    } else {
      const mv = this.follow(26 + this.slot * 16, 3.0);
      if (mv) { this.pose = 'run'; this.idleT = 0; }
      else { this.idleT++; this.pose = e ? 'growl' : this.idleT > 180 ? 'sit' : 'stand'; if (this.idleT > 900) this.pose = 'lie'; }
      if (!this.onGround) this.pose = 'run';
    }
    // olfatear secretos
    if (this.sniffCD <= 0) {
      this.sniffCD = 240;
      const found = L.findSecretsNear(this.cx, this.cy, 150);
      if (found.length) { for (const f of found) this.marks.push({ x: f.x, y: f.y, t: 240 }); this.sniffT = 40; P.Audio.sfx('scan'); }
    }
    if (this.sniffT > 0) { this.sniffT--; this.pose = 'sniff'; }
    for (const m of this.marks) m.t--; this.marks = this.marks.filter(m => m.t > 0);
  }
  tryProtect(dmg) {
    if (dmg < 14 || this.protCD > 0 || Math.random() > 0.35) return false;
    this.protCD = 900; this.protT = 30; const p = this.L.player; this.x = p.cx - this.w / 2 + p.face * 10; this.y = p.y + p.h - this.h; P.Audio.sfx('bark');
    P.toast('¡SIRIO te protege!', { col: '#bff6ff', life: 80 }); return true;
  }
  get hud() { return { spr: 'i_paw', cd: this.protCD / 900 }; }
  draw(c, cx, cy) {
    const fr = { sit: 0, stand: 1, run: 2 + Math.floor(this.t / 5) % 4, bite: 6, growl: 7, sniff: 8, lie: 9 }[this.pose];
    const x = Math.round(this.cx - 16 - cx), y = Math.round(this.y + this.h - 21 - cy);
    P.drawGlow(c, x + 16, y + 10, 18, '#bff6ff', 0.18);
    if (this.protT > 0) P.drawGlow(c, x + 16, y + 10, 26, '#5ee8ff', this.protT / 30);
    P.spr(c, 'sirio', fr, x, y, { flip: this.face < 0 });
    for (const m of this.marks) { if (m.t % 30 < 20) { P.drawGlow(c, m.x - cx, m.y - cy, 10, '#5ee8ff', 0.6); P.txt(c, '!', m.x - cx - 1, m.y - cy - 16, '#bff6ff'); } }
    // trampas cercanas
    const L = this.L;
    for (let ty = Math.floor((this.cy - 60) / 16); ty <= Math.floor((this.cy + 60) / 16); ty++) for (let tx = Math.floor((this.cx - 90) / 16); tx <= Math.floor((this.cx + 90) / 16); tx++) if (L.isHazard(tx, ty)) { c.strokeStyle = 'rgba(255,90,106,' + (0.3 + Math.sin(this.t * 0.2) * 0.2) + ')'; c.strokeRect(tx * 16 - cx + 0.5, ty * 16 - cy + 0.5, 15, 15); }
  }
};

P.makeCompanions = function (L) {
  const out = [], eq = P.State.data.comps.equipped.filter(id => P.State.compUnlocked(id)).slice(0, 2);
  eq.forEach((id, slot) => {
    if (id === 'luma') out.push(new P.Luma(L, slot));
    if (id === 'twins') { out.push(new P.Twin(L, slot, false)); out.push(new P.Twin(L, slot, true)); }
    if (id === 'nova') out.push(new P.Nova(L, slot));
    if (id === 'sirio') out.push(new P.Sirio(L, slot));
  });
  if (eq.length >= 2) P.State.ach('escuadra');
  return out;
};
