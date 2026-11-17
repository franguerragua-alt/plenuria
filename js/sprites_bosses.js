'use strict';
// Arte de los jefes planetarios (uno por planeta; se generan al arrancar)

// ================= KRAZTHOR =================
// Cangrejo-erizo colosal, fiel a la referencia: cuerpo redondo verde moteado, púas cónicas plateadas,
// ojo morado furioso con ceja, boca dentada con mandíbula azul, patas cortas con garras y cañones láser de Thersek.
// Fotogramas: 0-1 respirar · 2-5 caminar · 6 pinza abierta · 7 pinzazo · 8 rugido · 9 cañones apuntando al frente
P.KRAZ = { W: 128, H: 104, OY: 8 };
P.Sprites.krazthor = function (p, f, cracked) {
  const G = cracked ? ['#0e2a12', '#1e5a22', '#3a8a34', '#62b84a', '#a8e080'] : ['#0a3a14', '#1a7a24', '#38b83a', '#78e84a', '#c8ff7a'];
  const SP = cracked ? ['#2a2440', '#5a5480', '#9a94c0', '#e0dcf8'] : ['#2e2c58', '#6a6aa8', '#b8b8e8', '#ffffff'];
  const MET = ['#141830', '#22345e', '#3a6aa8', '#7ac8f0'], LASER = '#ff5af0', TOOTH = ['#c8c0b0', '#f0ead8', '#ffffff', '#ffffff'];
  const walk = f >= 2 && f <= 5 ? f - 2 : -1, breath = f === 1 ? 1 : 0, roar = f === 8, aim = f === 9;
  const cx = 60, cy = 48 + breath + (roar ? -3 : 0), RX = 40, RY = 30 - breath;
  const r = P.RNG(1234);
  // cono sombreado (púas, dientes y garras)
  const cone = (x, y, a, L, w, C) => {
    const nx = Math.cos(a), ny = Math.sin(a), qx = -ny, qy = nx, tx = x + nx * L, ty = y + ny * L;
    p.tri(x + qx * w, y + qy * w, x - qx * w, y - qy * w, tx, ty, C[1]);
    const s = (qx * -0.6 + qy * -0.8) > 0 ? 1 : -1;
    p.tri(x + s * qx * w, y + s * qy * w, x + s * qx * w * 0.1, y + s * qy * w * 0.1, tx, ty, C[2]);
    p.tri(x - s * qx * w, y - s * qy * w, x - s * qx * w * 0.5, y - s * qy * w * 0.5, tx, ty, C[0]);
    p.px(tx, ty, C[3]);
  };
  // pata corta segmentada con garra puntiaguda
  const leg = (x, y0, lift, far, i) => {
    const C = far ? [G[0], G[1], G[2], G[3]] : [G[1], G[2], G[3], G[4]], band = far ? '#0a2a10' : G[0];
    const out = i % 2 ? 1 : -1;
    p.sell(x, y0 - lift, 6.5, 5.5, C); p.rect(Math.round(x - 6), Math.round(y0 - lift + 2), 12, 2, band); p.px(x - 3, y0 - lift - 3, C[3]);
    p.sell(x + out * 2, y0 + 7 - lift, 5, 4.5, C); p.rect(Math.round(x + out * 2 - 4), Math.round(y0 + 9 - lift), 8, 1, band);
    cone(x + out * 3, y0 + 10 - lift, Math.PI / 2 - out * 0.45, Math.max(5, 95 - (y0 + 10 - lift)), 4.2, C);
    cone(x + out * 4, y0 + 6 - lift, -Math.PI / 2 + out * 0.9, 5, 1.8, SP);
    cone(x - 3, y0 - lift - 3, -Math.PI / 2 - 0.4, 6, 2, SP);
  };
  const ph = i => walk >= 0 ? [0, 3, 5, 2][(walk + i) % 4] : 0;
  // patas traseras (lado lejano)
  [30, 48, 66].forEach((x, i) => leg(x, 76, ph(i + 1), true, i));
  // módulo mecánico trasero
  p.rect(10, 34, 16, 14, MET[1]); p.rect(10, 34, 16, 2, MET[3]); p.rect(10, 46, 16, 2, MET[0]);
  p.ell(15, 41, 3, 3, '#3a0a4a'); p.ell(15, 41, 2, 2, '#b04ae0'); p.px(14, 40, '#ffd0ff'); p.rect(20, 37, 4, 8, '#3ad850'); p.px(21, 38, '#c8ffb0');
  // cuerpo redondo con bultos
  p.sell(cx, cy, RX, RY, [G[0], G[1], G[2], G[3]]);
  for (let k = 0; k < 30; k++) {
    const a = k / 30 * Math.PI * 2, bx = cx + Math.cos(a) * RX * 0.93, by = cy + Math.sin(a) * RY * 0.93;
    if (by > cy + RY * 0.7) continue;
    const lit = Math.cos(a) * -0.55 + Math.sin(a) * -0.8; p.ell(bx, by, 4, 3.5, lit > 0.3 ? G[3] : lit > -0.3 ? G[2] : G[1]);
  }
  p.sell(cx - 6, cy - 6, RX * 0.72, RY * 0.66, [G[1], G[2], G[3], G[4]]);
  // manchas oscuras y motas (piel de sapo)
  for (let i = 0; i < 70; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.9, x = cx + Math.cos(a) * RX * d, y = cy + Math.sin(a) * RY * d;
    if (x > cx + 16 && y > cy - 16) continue;
    const s = r.range(0.8, 2.6); p.ell(x, y, s, s * 0.85, r() < 0.7 ? G[0] : '#0e4a18'); if (s > 1.6) p.px(x - 1, y - 1, G[1]);
  }
  for (let i = 0; i < 50; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.85; p.px(cx + Math.cos(a) * RX * d, cy + Math.sin(a) * RY * d, r() < 0.5 ? G[4] : G[3]); }
  // púas cónicas plateadas por todo el lomo
  const spikes = [[-2.9, 12], [-2.6, 15], [-2.3, 13], [-2.05, 16], [-1.8, 12], [-1.55, 15], [-1.3, 12], [-1.05, 14], [-0.8, 11], [-0.55, 12], [-0.3, 10], [3.0, 11], [2.75, 9], [2.5, 8]];
  spikes.forEach(([a, L], i) => {
    const bx = cx + Math.cos(a) * RX * 0.92, by = cy + Math.sin(a) * RY * 0.92;
    cone(bx, by, a, cracked && i % 3 === 0 ? L * 0.45 : L + (breath && i % 2 ? 1 : 0), 3.6, SP);
  });
  for (let i = 0; i < 10; i++) { const x = cx - 28 + (i % 5) * 10 + (i > 4 ? 5 : 0), y = cy - 12 + (i > 4 ? 13 : 0) + (i % 2) * 3; cone(x, y, -1.4 - (i % 3) * 0.3, 7, 2.4, SP); }
  // mandíbula azul y boca dentada
  p.ell(cx + 20, cy + 17, 22, 9, '#1a3ab0'); p.ell(cx + 20, cy + 15, 20, 7, '#2a6ad8'); p.ell(cx + 18, cy + 13, 15, 3, '#6ab8ff'); p.px(cx + 10, cy + 12, '#d0f0ff'); p.px(cx + 11, cy + 12, '#d0f0ff');
  const mo = roar ? 9 : 2;
  p.ell(cx + 22, cy + 8 + mo / 2, 18, 2.5 + mo / 2, '#3a0a1a');
  if (roar) { p.ell(cx + 22, cy + 12, 12, 3, '#c02a4a'); p.ell(cx + 22, cy + 13, 6, 1.5, '#ff6a8a'); }
  for (let i = 0; i < 9; i++) cone(cx + 6 + i * 4, cy + 6, Math.PI / 2, 4 + (i % 2), 1.6, TOOTH);
  for (let i = 0; i < 6; i++) cone(cx + 9 + i * 5, cy + 11 + mo, -Math.PI / 2, 3 + (i % 2), 1.4, TOOTH);
  // ojo morado furioso con ceja
  const ex = cx + 26, ey = cy - 9;
  p.ell(ex, ey, 8, 7.5, '#14061e'); p.ell(ex + 1, ey + 1, 6.5, 6, '#3a0a52'); p.sell(ex + 1, ey + 1, 5, 4.6, ['#4a0a6a', '#8a2ab0', '#c060e8', '#ffd0ff']);
  p.ell(ex + 2, ey + 2, 2.2, 2.2, '#12001e'); p.rect(ex - 2, ey - 2, 2, 2, '#ffffff'); p.px(ex + 4, ey + 4, '#ff9af0');
  p.thick(ex - 10, ey - 9, ex + 8, ey - 3, 4, G[0]); p.line(ex - 10, ey - 11, ex + 8, ey - 5, G[2]);
  // patas delanteras (lado cercano) y pinza
  [[36, 0], [54, 2], [74, 1]].forEach(([x, i]) => leg(x, 79, ph(i), false, i));
  if (f === 6 || f === 7) {
    const ext = f === 7 ? 12 : 0, ax = 90 + ext, ay = 74 - (f === 6 ? 6 : 0), C = [G[1], G[2], G[3], G[4]];
    p.thick(84, 78, ax, ay, 9, G[2]); p.sell(ax, ay, 6, 5, C); p.rect(ax - 5, ay + 2, 10, 2, G[0]);
    const op = f === 6 ? 0.55 : 0.12;
    cone(ax + 4, ay - 1, -op, 20, 5.5, C); cone(ax + 4, ay + 3, op * 0.8, 17, 4.5, [G[0], G[1], G[2], G[3]]);
    cone(ax + 8, ay - 4, -1.5, 6, 2, SP); cone(ax + 14, ay - 3, -1.2, 5, 2, SP);
  } else leg(94, 79, ph(3), false, 3);
  // cañones láser robóticos sobre el lomo
  const barrel = (x0, y0, a, len, w) => {
    const nx = Math.cos(a), ny = Math.sin(a), qx = -ny, qy = nx;
    for (let t = 0; t <= len; t += 0.5) for (let k = -w / 2; k <= w / 2; k += 0.5) {
      const u = (k + w / 2) / w; let col = u < 0.25 ? MET[3] : u < 0.55 ? MET[2] : u < 0.85 ? MET[1] : MET[0];
      if (Math.floor(t) % 9 < 2 && t > 3) col = Math.floor(t / 9) % 2 ? '#3ad850' : '#a03ad0';
      if (t > len - 4) col = u < 0.4 ? '#c8d4ec' : '#4a5470';
      p.px(x0 + nx * t + qx * k, y0 + ny * t + qy * k, col);
    }
    const mx = x0 + nx * (len + 1), my = y0 + ny * (len + 1);
    p.ell(mx, my, 2.2, 2.2, LASER); p.px(mx, my, '#ffffff');
  };
  const a = aim ? 0.3 : -0.5;
  // montura trasera con núcleo
  p.rect(26, 16, 26, 14, '#2a1a4a'); p.rect(26, 16, 26, 2, '#7a5ab8'); p.rect(26, 28, 26, 2, '#160a28'); p.ell(49, 27, 4, 3.5, '#3a0a4a'); p.ell(49, 27, 2.6, 2.4, cracked ? '#ffd0ff' : LASER); p.px(48, 26, '#ffffff');
  p.px(30, 20, '#3ad850'); p.px(34, 20, '#ffd166'); p.px(38, 20, '#3ad850');
  barrel(36, 18, a, aim ? 44 : 40, 10);
  p.rect(30, 30, 20, 9, '#2a1a4a'); p.rect(30, 30, 20, 2, '#7a5ab8');
  barrel(40, 33, a, aim ? 42 : 38, 9);
  cone(28, 16, -2.3, 7, 2.2, SP); cone(50, 16, -1.2, 6, 2, SP);
  if (cracked) {
    const K = ['#ff5af0', '#ffe0ff'];
    p.line(cx - 20, cy - 14, cx - 8, cy - 2, K[0]); p.line(cx - 8, cy - 2, cx - 14, cy + 10, K[0]); p.line(cx + 4, cy - 22, cx + 12, cy - 8, K[1]);
    p.line(cx - 30, cy + 2, cx - 20, cy - 8, K[1]); p.line(cx + 12, cy - 8, cx + 8, cy + 2, K[0]);
    p.px(52, 12, '#ffd166'); p.px(78, 8, '#ffffff'); p.px(46, 18, '#ff8a3a');
  }
};
P.Sprites.buildBosses = function () {
  const shifted = (p, oy) => { const q = Object.create(p); q.px = (x, y, c) => P.Painter.prototype.px.call(p, x, y + oy, c); return q; };
  for (const cr of [0, 1]) P.mk(cr ? 'krazthor_c' : 'krazthor', P.KRAZ.W, P.KRAZ.H, 10, (p, f) => P.Sprites.krazthor(shifted(p, P.KRAZ.OY), f, cr), { up: 0.08, down: 0.14, dark: 0.55 });
};
