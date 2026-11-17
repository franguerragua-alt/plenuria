'use strict';
// Animación secundaria de la Esfera de Dyson (solo dibujo, no toca lógica ni colisiones):
// aplastar y estirar al saltar/aterrizar, anticipación antes de cada ataque, retroceso al recibir golpes,
// polvo al pisar, estelas de imágenes residuales y desintegración en brasas al morir.
P.AnimFX = {
  IDLE: ['idle', 'g_idle', 'b_idle', 'intro', 'roar', 'death', 'stagger', 'b_stun', 'recover', 'stuck', 'shift', 'sub'],
  st(e) { return e._afx || (e._afx = { trail: [], sq: 0, air: false, vy: 0, rec: 0, fl: 0, lt: -1, ls: e.state }); },
  // avanza una vez por fotograma lógico del ente
  step(e) {
    const A = this.st(e); if (A.lt === e.t) return A; A.lt = e.t;
    const L = e.L, g = !!e.onGround;
    if (g && A.air && A.vy > 2.2) { A.sq = Math.min(0.26, A.vy * 0.035); this.dust(L, e.cx, e.y + e.h, Math.min(10, 3 + (A.vy | 0)), e.dustCol); }
    else if (!g && !A.air && (e.vy || 0) < -2) A.sq = -Math.min(0.2, -e.vy * 0.025);
    A.air = !g; A.vy = e.vy || 0;
    if (e.boss && e.state !== A.ls) { if (!this.IDLE.includes(e.state) && Math.abs(A.sq) < 0.05) A.sq = 0.1; A.ls = e.state; } // pequeño agacharse antes de atacar
    A.sq *= 0.8; if (Math.abs(A.sq) < 0.01) A.sq = 0;
    if ((e.flash || 0) > A.fl) A.rec = e.boss ? 1.6 : 2.6; A.fl = e.flash || 0; A.rec = Math.max(0, A.rec - 0.4);
    if (g && Math.abs(e.vx || 0) > 1.4 && e.t % 8 === 0) this.dust(L, e.cx - Math.sign(e.vx) * e.w * 0.4, e.y + e.h, 2, e.dustCol);
    return A;
  },
  dust(L, x, y, n, col) { for (let i = 0; i < n; i++) L.parts.add({ x: x + P.rand(-6, 6), y: y - 1, vx: P.rand(-1.2, 1.2), vy: -P.rand(0.2, 0.9), life: P.ri(14, 24), col: col || P.pick(['#8a96b4', '#5e6a86', '#c8d4e8']), size: P.pick([1, 2]) }); },
  // dibuja fn() con aplastar/estirar anclado a los pies y el retroceso del golpe
  wrap(c, e, cx, cy, fn) {
    const A = this.step(e), p = e.L.player, dir = p ? -(Math.sign(p.cx - e.cx) || 1) : 0, ox = Math.round(A.rec * dir), sq = A.sq;
    if (!ox && !sq) { fn(); return; }
    const ax = Math.round(e.cx - cx), ay = Math.round(e.y + e.h - cy);
    c.save(); c.translate(ax + ox, ay); if (sq) c.scale(1 + sq * 0.7, 1 - sq); c.translate(-ax, -ay); fn(); c.restore();
  },
  // sprite de jefe: estela teñida, deformación, retroceso y desintegración final
  boss(c, e, spr, frame, x, y, o, cx, cy, cfg = {}) {
    const A = this.step(e), S = P.SP(spr); if (!S) return;
    const fast = !cfg.noTrail && !e.dying && (Math.abs(e.vx || 0) > 2.8 || (cfg.trail && cfg.trail.includes(e.state)));
    if (A.tk !== e.t) { A.tk = e.t; for (const q of A.trail) q.life--; A.trail = A.trail.filter(q => q.life > 0); if (fast && e.t % 2 === 0) A.trail.push({ x: x + cx, y: y + cy, f: frame, flip: o.flip, life: 12 }); }
    const ga = c.globalAlpha;
    for (const q of A.trail) { c.globalAlpha = ga * (q.life / 12) * 0.4; P.spr(c, spr, q.f, Math.round(q.x - cx), Math.round(q.y - cy), { flip: q.flip, sil: cfg.col || e.glowCol || '#ff2a4a' }); }
    c.globalAlpha = ga;
    const dis = cfg.dis && e.state === 'death' ? P.clamp((e.st - cfg.dis[0]) / (cfg.dis[1] - cfg.dis[0]), 0, 1) : 0;
    this.wrap(c, e, cx, cy, () => {
      if (dis <= 0) { P.spr(c, spr, frame, x, y, o); return; }
      const cut = Math.round(S.h * dis); c.save(); c.beginPath(); c.rect(x - 6, y + cut, S.w + 12, S.h - cut + 4); c.clip(); P.spr(c, spr, frame, x, y, o); c.restore();
      this.embers(e, S, frame, x + cx, y + cy, cut, o.flip);
    });
  },
  // brasas con el color real de los píxeles del borde que se deshace
  embers(e, S, frame, wx, wy, row, flip) {
    const A = this.st(e); if (A.et === e.t || row >= S.h) return; A.et = e.t;
    const i = ((frame | 0) % S.f.length + S.f.length) % S.f.length, cache = S._px || (S._px = {});
    if (cache[i] === undefined) { try { cache[i] = S.f[i].getContext('2d').getImageData(0, 0, S.w, S.h).data; } catch (err) { cache[i] = null; } }
    const d = cache[i]; if (!d) return;
    for (let k = 0; k < 7; k++) {
      const u = P.ri(0, S.w - 1), j = (row * S.w + u) * 4; if (d[j + 3] < 40) continue;
      const col = '#' + ((1 << 24) | (d[j] << 16) | (d[j + 1] << 8) | d[j + 2]).toString(16).slice(1);
      e.L.parts.add({ x: wx + (flip ? S.w - 1 - u : u), y: wy + row, vx: P.rand(-0.5, 0.5), vy: -P.rand(0.4, 1.6), life: P.ri(26, 48), col, size: P.pick([1, 1, 2]), glow: 2 });
    }
  }
};
