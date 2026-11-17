'use strict';
// Fondos multicapa para los nueve planetas.
//  capa 1  cielo + horizonte (bg_sky)            · ya existente
//  capa 2  cordilleras lejanas (bg_far) + VEGETACIÓN LEJANA (siluetas con bruma, parallax 0.16)
//  capa 3  plano medio (bg_mid) + hitos + VEGETACIÓN MEDIA (parallax 0.34, se mece)
//  capa 4  plano cercano (bg_near) + VEGETACIÓN CERCANA grande (parallax 0.6) + árboles gigantes del mundo
//  capa 5  partículas y criaturas ambientales propias de cada planeta
//  capa 6  siluetas que pasan delante de la cámara (parallax 1.35, solo en el borde inferior)
// Cada planeta tiene su propio catálogo de especies (estructuras distintas, no recoloreados) y cada nivel
// elige su propia combinación de especies, densidad, agrupación y alturas.
(function () {
  const PALX = {
    xertha: { c: { leaf: ['#2a2418', '#3e3424', '#5a4a30', '#7a6440'], trunk: ['#1e1a12', '#2e281c', '#463c28'], flower: ['#7a6a3a', '#8a7a4a', '#5a4a2a'], glow: '#a08a40' }, r: { leaf: ['#7a5010', '#d0a020', '#ffd060', '#fff0b0'], trunk: ['#4a3010', '#7a5018', '#b07a28'], flower: ['#ffe080', '#ff9a3a', '#fff4c0', '#ffffff'], glow: '#ffd060' } },
    ignaria: { c: { leaf: ['#1a1414', '#2a2020', '#3e2e2a', '#5a4038'], trunk: ['#100c0c', '#1e1616', '#2e2222'], flower: ['#5a2a1a', '#6a3a2a', '#4a2a2a'], glow: '#8a3a1a' }, r: { leaf: ['#3a0a06', '#a02a0a', '#ff6a1a', '#ffd166'], trunk: ['#1a0e0a', '#3a1e14', '#5a2e1e'], flower: ['#ff5a1a', '#ffd166', '#ff9a3a', '#ffffff'], glow: '#ff7a2a' } },
    aerthyon: { c: { leaf: ['#2a2e3e', '#3e4458', '#5a627a', '#7a84a0'], trunk: ['#1e2230', '#2e3446', '#464e66'], flower: ['#5a6a8a', '#6a7a9a', '#4a5a7a'], glow: '#7a8ab0' }, r: { leaf: ['#3a6aa0', '#7ab8e8', '#bfe8ff', '#ffffff'], trunk: ['#4a5a8a', '#7a8ac0', '#a8b8e8'], flower: ['#bfe8ff', '#ffd0f0', '#fff4c0', '#ffffff'], glow: '#bfe8ff' } }
  };
  const pal = (pl, st) => { const K = (P.PAL[pl] || PALX[pl] || P.PAL.verzara)[st]; return { L: K.leaf, T: K.trunk || K.leaf, F: K.flower || [K.glow, K.glow, K.glow], G: K.glow || K.leaf[3] }; };
  const on = st => st === 'r';
  // ---------- catálogo de especies: (p, x, y, s, C, r, st) dibujan con la base en (x, y) y escala s ----------
  const trunk = (p, x0, y0, x1, y1, w0, w1, C) => { const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0)); for (let i = 0; i <= n; i++) { const t = i / n, w = w0 + (w1 - w0) * t, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; p.rect(Math.round(x - w / 2), Math.round(y), Math.max(1, Math.round(w)), 1, C[1]); p.px(Math.round(x - w / 2), y, C[2] || C[1]); p.px(Math.round(x + w / 2) - 1, y, C[0]); } };
  const blob = (p, x, y, rx, ry, C) => p.sell(x, y, Math.max(1, rx), Math.max(1, ry), C);
  const crys = (p, x, y, w, h, C, ln) => P.Sprites.umCrystal ? P.Sprites.umCrystal(p, x, y, w, h, C, ln || 0) : p.tri(x - w / 2, y, x + w / 2, y, x, y - h, C[1]);
  P.VEG = {
    verzara: [
      { id: 'bulbo', draw(p, x, y, s, C, r, st) { const h = 70 * s; let cx = x; for (let i = 0; i < h; i += 4) { const nx = x + Math.sin(i * 0.06 + r() * 2) * 6 * s; trunk(p, cx, y - i, nx, y - i - 4, 7 * s, 6 * s, C.T); cx = nx; } for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.55, bx = cx + Math.cos(a) * 18 * s, by = y - h + Math.sin(a) * 10 * s; p.line(cx, y - h, bx, by, C.T[1]); for (let j = 0; j < 6 * s; j++) p.px(bx, by + j, C.L[1]); blob(p, bx, by + 7 * s, 3 * s, 4 * s, [C.L[0], C.F[0], C.F[1] || C.G]); } blob(p, cx, y - h, 10 * s, 6 * s, C.L); } },
      { id: 'lianar', draw(p, x, y, s, C, r) { const h = 86 * s; trunk(p, x, y, x + 3 * s, y - h, 4 * s, 3 * s, C.T); for (let k = 0; k < 4; k++) { const by = y - h + k * 14 * s, sd = k % 2 ? 1 : -1, bx = x + sd * (10 + k * 3) * s; p.line(x, by, bx, by - 6 * s, C.T[1]); blob(p, bx, by - 6 * s, 7 * s, 4 * s, C.L); for (let j = 0; j < 4; j++) { const lx = bx - 5 * s + j * 3 * s, ll = (10 + r() * 22) * s; for (let q = 0; q < ll; q++) p.px(lx + Math.sin(q * 0.3 + j) * 0.8, by - 4 * s + q, C.L[(q >> 2) % 2 ? 1 : 2]); } } } },
      { id: 'paraguas', draw(p, x, y, s, C, r) { const h = 60 * s, lean = (r() - 0.5) * 14 * s; trunk(p, x, y, x + lean, y - h, 5 * s, 3 * s, C.T); for (let k = 0; k < 3; k++) { const w = (26 - k * 7) * s, yy = y - h + k * 6 * s - 4 * s, ox = lean + (r() - 0.5) * 8 * s; p.ell(x + ox, yy, w, 3 * s, C.L[1]); p.ell(x + ox - w * 0.2, yy - 1, w * 0.7, 1.6 * s, C.L[2]); p.line(x + ox - w, yy + 1, x + ox + w, yy + 1, C.L[0]); } } },
      { id: 'jarra', draw(p, x, y, s, C, r) { for (let k = 0; k < 3; k++) { const ox = (k - 1) * 12 * s, h = (26 + k * 9 + r() * 8) * s; for (let i = 0; i < h; i++) { const w = (4 + Math.sin(i / h * 3) * 3) * s; p.rect(Math.round(x + ox - w), Math.round(y - i), Math.round(w * 2), 1, C.L[i % 5 ? 1 : 0]); } p.ell(x + ox, y - h, 5 * s, 2 * s, C.F[0]); p.ell(x + ox, y - h, 3 * s, 1, C.L[0]); } } },
      { id: 'espino', draw(p, x, y, s, C, r) { const br = (x0, y0, a, l, d) => { if (d > 3 || l < 3) return; const x1 = x0 + Math.cos(a) * l, y1 = y0 + Math.sin(a) * l; p.line(x0, y0, x1, y1, C.T[d % 2 ? 1 : 2]); p.px(x1, y1, C.F[0]); br(x1, y1, a - 0.5 - r() * 0.3, l * 0.7, d + 1); br(x1, y1, a + 0.45 + r() * 0.3, l * 0.68, d + 1); }; br(x, y, -Math.PI / 2 + (r() - 0.5) * 0.4, 22 * s, 0); } }
    ],
    khazir: [
      { id: 'columna', draw(p, x, y, s, C, r) { const h = 64 * s; for (let i = 0; i < h; i++) { const w = (6 + Math.sin(i * 0.25) * 1.2) * s; p.rect(Math.round(x - w), Math.round(y - i), Math.round(w * 2), 1, C.L[1]); for (let k = -2; k <= 2; k++) p.px(Math.round(x + k * w / 2.5 + Math.sin(i * 0.2 + k) * 0.6), y - i, k % 2 ? C.L[2] : C.L[0]); } for (const sd of [-1, 1]) { const ay = y - h * (0.4 + r() * 0.2); for (let i = 0; i < 10 * s; i++) p.rect(Math.round(x + sd * (6 * s + i)), Math.round(ay - i * 0.3), 3, 3, C.L[1]); const tx = x + sd * 16 * s; trunk(p, tx, ay - 3 * s, tx, ay - 18 * s, 5 * s, 4 * s, C.L); blob(p, tx, ay - 19 * s, 3 * s, 3 * s, [C.F[0], C.F[1] || C.G, C.G]); } blob(p, x, y - h, 6 * s, 4 * s, [C.F[0], C.F[1] || C.G, C.G]); } },
      { id: 'abanico', draw(p, x, y, s, C, r) { for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * 0.32 + (r() - 0.5) * 0.1, l = (24 + r() * 10) * s; for (let j = 0; j < l; j++) { const w = Math.sin(j / l * Math.PI) * 5 * s; p.line(x + Math.cos(a) * j - w * Math.sin(a) * 0.3, y + Math.sin(a) * j, x + Math.cos(a) * j + w * 0.4, y + Math.sin(a) * j, C.L[j % 4 ? 1 : 2]); } } } },
      { id: 'piedra', draw(p, x, y, s, C, r) { const h = 40 * s; for (let i = 0; i < h; i++) { const w = (9 - i / h * 5 + Math.sin(i * 0.5) * 1.5) * s; p.rect(Math.round(x - w), Math.round(y - i), Math.round(w * 2), 1, i % 7 ? '#8a6a48' : '#6a4a30'); } for (let k = 0; k < 7; k++) blob(p, x + (r() - 0.5) * 16 * s, y - h - r() * 8 * s, 3 * s, 2.5 * s, [C.F[0], C.F[1] || C.G, '#ffffff']); } },
      { id: 'espiral', draw(p, x, y, s, C, r) { const h = 70 * s; for (let i = 0; i < h; i++) { const sx = Math.sin(i * 0.12) * 6 * s, w = (4 - i / h * 2) * s; p.rect(Math.round(x + sx - w), Math.round(y - i), Math.round(w * 2), 1, C.T[(i >> 2) % 2 ? 1 : 2]); if (i % 12 === 6) { for (let k = 0; k < 4; k++) p.line(x + sx, y - i, x + sx + (k - 1.5) * 4 * s, y - i - 5 * s, C.L[2]); } } } },
      { id: 'mata', draw(p, x, y, s, C, r) { for (let k = 0; k < 4; k++) { const bx = x + (k - 1.5) * 9 * s, rr = (5 + r() * 4) * s; blob(p, bx, y - rr, rr, rr * 0.8, C.L); for (let j = 0; j < 5; j++) p.px(bx + (r() - 0.5) * rr * 2, y - rr * 1.6 - r() * 2, C.L[3] || C.L[2]); } } }
    ],
    nivorah: [
      { id: 'pino_cristal', draw(p, x, y, s, C, r) { trunk(p, x, y, x, y - 20 * s, 4 * s, 3 * s, C.T); for (let k = 0; k < 5; k++) { const w = (18 - k * 3) * s, yy = y - 16 * s - k * 12 * s; p.tri(x - w, yy, x + w, yy, x, yy - 14 * s, C.L[1]); p.tri(x - w, yy, x, yy, x, yy - 14 * s, C.L[2]); p.line(x - w, yy, x + w, yy, '#ffffff'); } } },
      { id: 'sauce', draw(p, x, y, s, C, r) { const h = 50 * s; trunk(p, x, y, x - 4 * s, y - h, 6 * s, 4 * s, C.T); for (let k = 0; k < 9; k++) { const a = -Math.PI / 2 + (k - 4) * 0.33, bx = x - 4 * s + Math.cos(a) * 18 * s, by = y - h + Math.sin(a) * 6 * s; p.line(x - 4 * s, y - h, bx, by, C.T[1]); const ll = (14 + r() * 20) * s; for (let j = 0; j < ll; j++) p.px(bx + Math.sin(j * 0.2) * 0.6, by + j, j % 6 === 5 ? '#ffffff' : C.L[2]); } } },
      { id: 'coral_hielo', draw(p, x, y, s, C, r) { const br = (x0, y0, a, l, d) => { if (d > 4) return; const x1 = x0 + Math.cos(a) * l, y1 = y0 + Math.sin(a) * l; p.thick(x0, y0, x1, y1, Math.max(1, (4 - d) * s), C.L[d % 2 ? 1 : 2]); if (d === 4) p.px(x1, y1, '#ffffff'); br(x1, y1, a - 0.6, l * 0.72, d + 1); br(x1, y1, a + 0.55, l * 0.7, d + 1); }; br(x, y, -Math.PI / 2 + (r() - 0.5) * 0.3, 14 * s, 0); } },
      { id: 'aguja', draw(p, x, y, s, C, r) { const h = 90 * s; for (let i = 0; i < h; i++) { const w = Math.max(1, (4 - i / h * 3.5) * s); p.rect(Math.round(x - w), Math.round(y - i), Math.round(w * 2), 1, C.L[i % 3 ? 1 : 2]); } for (let k = 0; k < 3; k++) { const yy = y - h * (0.35 + k * 0.2); p.ell(x, yy, (12 - k * 3) * s, 2 * s, C.L[2]); p.line(x - (12 - k * 3) * s, yy, x + (12 - k * 3) * s, yy, '#ffffff'); } } },
      { id: 'arbusto', draw(p, x, y, s, C, r) { for (let k = 0; k < 3; k++) { const bx = x + (k - 1) * 10 * s, rr = (7 + r() * 3) * s; blob(p, bx, y - rr * 0.7, rr, rr * 0.7, [C.T[0], C.L[1], C.L[2]]); p.ell(bx, y - rr * 1.25, rr * 0.9, rr * 0.35, '#f4fbff'); } } }
    ],
    thalassyr: [
      { id: 'abanico_coral', draw(p, x, y, s, C, r) { trunk(p, x, y, x, y - 12 * s, 4 * s, 3 * s, C.T); for (let k = 0; k < 9; k++) { const a = -Math.PI + 0.25 + k * 0.33, l = (26 + r() * 8) * s; p.line(x, y - 12 * s, x + Math.cos(a) * l, y - 12 * s + Math.sin(a) * l * 0.9, C.F[0]); } for (let rr = 8; rr < 34; rr += 7) for (let a = -Math.PI + 0.3; a < -0.3; a += 0.18) p.px(x + Math.cos(a) * rr * s, y - 12 * s + Math.sin(a) * rr * s * 0.9, C.F[1] || C.G); } },
      { id: 'anemona', draw(p, x, y, s, C, r) { const h = 60 * s; for (let i = 0; i < h; i++) { const sx = Math.sin(i * 0.08) * 4 * s; p.rect(Math.round(x + sx - 3 * s), Math.round(y - i), Math.round(6 * s), 1, C.T[(i >> 3) % 2 ? 1 : 2]); } const tx = x + Math.sin(h * 0.08) * 4 * s; for (let k = 0; k < 10; k++) { const a = -Math.PI + k * 0.35; let px2 = tx, py2 = y - h; for (let j = 0; j < 12 * s; j++) { px2 += Math.cos(a + Math.sin(j * 0.3) * 0.4); py2 += Math.sin(a) * 0.8; p.px(px2, py2, j > 9 * s ? C.F[0] : C.L[2]); } } } },
      { id: 'kelp_burbuja', draw(p, x, y, s, C, r) { const h = 84 * s; for (let i = 0; i < h; i++) p.px(x + Math.sin(i * 0.1) * 5 * s, y - i, C.L[1]); for (let k = 0; k < 6; k++) { const yy = y - h * (0.2 + k * 0.14); blob(p, x + Math.sin((y - yy) * 0.1) * 5 * s + (k % 2 ? 4 : -4) * s, yy, 3.2 * s, 3.6 * s, [C.L[0], C.F[0], C.F[1] || C.G]); } } },
      { id: 'esponja', draw(p, x, y, s, C, r) { for (let k = 0; k < 4; k++) { const bx = x + (k - 1.5) * 8 * s, h = (14 + r() * 22) * s; p.rect(Math.round(bx - 3 * s), Math.round(y - h), Math.round(6 * s), Math.round(h), C.F[k % 2] || C.G); p.rect(Math.round(bx - 3 * s), Math.round(y - h), 1, Math.round(h), C.L[0]); p.ell(bx, y - h, 3 * s, 1.4 * s, C.L[0]); } } },
      { id: 'pluma', draw(p, x, y, s, C, r) { const h = 56 * s; p.line(x, y, x + 4 * s, y - h, C.T[1]); for (let i = 8; i < h; i += 3) { const t = i / h, w = Math.sin(t * Math.PI) * 10 * s; p.line(x + 4 * s * t, y - i, x + 4 * s * t - w, y - i - 3 * s, C.L[2]); p.line(x + 4 * s * t, y - i, x + 4 * s * t + w, y - i - 3 * s, C.L[1]); } } }
    ],
    umbrelia: [
      { id: 'racimo', rigid: true, draw(p, x, y, s, C, r, st) { const U = P.UMC || {}, CC = on(st) ? U.r : U.c; for (let k = 0; k < 5; k++) crys(p, x + (k - 2) * 6 * s, y, Math.max(2, (4 + r() * 3) * s), (14 + r() * 20 + (2 - Math.abs(k - 2)) * 10) * s, CC, (k - 2) * 0.12); } },
      { id: 'aguja_obs', rigid: true, draw(p, x, y, s, C, r, st) { const h = 80 * s; for (let i = 0; i < h; i++) { const w = Math.max(1, (7 - i / h * 6) * s); p.rect(Math.round(x - w), Math.round(y - i), Math.round(w * 2), 1, i % 9 ? '#16121c' : '#241e2e'); p.px(Math.round(x - w), y - i, '#2c2434'); } crys(p, x, y - h + 2, 3 * s, 12 * s, on(st) ? P.UMC.r : P.UMC.c, 0); } },
      { id: 'fusion', rigid: true, draw(p, x, y, s, C, r, st) { const h = 50 * s; for (let i = 0; i < h; i++) p.rect(Math.round(x + Math.sin(i * 0.15) * 3 * s - 2 * s), Math.round(y - i), Math.round(4 * s), 1, '#1e1924'); for (let k = 0; k < 4; k++) crys(p, x + Math.sin(k * 1.7) * 6 * s, y - h * (0.3 + k * 0.2), 2.5 * s, 7 * s, on(st) ? P.UMC.r : P.UMC.c, (k % 2 ? 0.3 : -0.3)); } },
      { id: 'arco', rigid: true, draw(p, x, y, s, C, r) { for (let k = 0; k <= 20; k++) { const a = Math.PI * k / 20; p.thick(x - Math.cos(a) * 22 * s, y - Math.sin(a) * 40 * s, x - Math.cos(a) * 22 * s, y - Math.sin(a) * 40 * s, 5 * s, k % 4 ? '#16121c' : '#241e2e'); } } },
      { id: 'geoda', rigid: true, draw(p, x, y, s, C, r, st) { blob(p, x, y - 9 * s, 13 * s, 9 * s, ['#0a080e', '#16121c', '#241e2e']); p.ell(x + 3 * s, y - 10 * s, 7 * s, 5 * s, on(st) ? '#7a0a20' : '#2a1030'); for (let k = 0; k < 4; k++) crys(p, x + (k - 1.5) * 3 * s + 3 * s, y - 7 * s, 2 * s, (3 + r() * 4) * s, on(st) ? P.UMC.r : P.UMC.c, 0); } }
    ],
    mykoris: [
      { id: 'sombrilla', soft: true, draw(p, x, y, s, C, r, st) { const h = 70 * s, w = (24 + r() * 8) * s, lean = (r() - 0.5) * 8 * s; for (let i = 0; i < h; i++) { const sw = (5 - i / h * 1.5) * s; p.rect(Math.round(x + lean * i / h - sw), Math.round(y - i), Math.round(sw * 2), 1, C.T[(i >> 3) % 2 ? 1 : 2]); } const cx = x + lean; for (let yy = 0; yy < 12 * s; yy++) { const ww = w * Math.sqrt(1 - (yy / (12 * s)) ** 2); p.rect(Math.round(cx - ww), Math.round(y - h - yy), Math.round(ww * 2), 1, yy < 3 ? C.L[0] : C.L[1 + (yy > 8 * s ? 1 : 0)]); } for (let k = -6; k <= 6; k++) p.line(cx, y - h + 1, cx + k * w / 7, y - h + 2, C.G); for (let k = 0; k < 8; k++) { const dx = (r() - 0.5) * w * 1.8, dl = (4 + r() * 14) * s; for (let j = 0; j < dl; j++) p.px(cx + dx, y - h + 2 + j, j === Math.floor(dl) - 1 ? '#ffffff' : C.G); } } },
      { id: 'torre', soft: true, draw(p, x, y, s, C, r) { const h = 90 * s; for (let i = 0; i < h; i++) p.rect(Math.round(x - 3 * s), Math.round(y - i), Math.round(6 * s), 1, C.T[(i >> 2) % 2 ? 1 : 2]); for (let k = 0; k < 4; k++) { const yy = y - h * (0.3 + k * 0.22), w = (16 - k * 3 + r() * 3) * s; p.ell(x, yy, w, 3.5 * s, C.L[1]); p.ell(x - w * 0.2, yy - 1.5 * s, w * 0.6, 1.5 * s, C.L[2]); p.line(x - w, yy + 2 * s, x + w, yy + 2 * s, C.G); } } },
      { id: 'bulbo', soft: true, draw(p, x, y, s, C, r) { for (let k = 0; k < 3; k++) { const bx = x + (k - 1) * 11 * s, rr = (6 + r() * 5 + (k === 1 ? 4 : 0)) * s; trunk(p, bx, y, bx, y - rr, 3 * s, 2.5 * s, C.T); blob(p, bx, y - rr * 1.6, rr, rr * 0.9, [C.L[0], C.F[0], C.F[1] || C.G, '#ffffff']); for (let j = 0; j < 4; j++) p.px(bx + (r() - 0.5) * rr, y - rr * 1.6 + (r() - 0.6) * rr * 0.8, '#ffffff'); } } },
      { id: 'colmenilla', soft: true, draw(p, x, y, s, C, r) { const h = 64 * s; trunk(p, x, y, x, y - h * 0.4, 6 * s, 5 * s, C.T); for (let i = 0; i < h * 0.6; i++) { const t = i / (h * 0.6), w = (8 * (1 - t * 0.8)) * s; p.rect(Math.round(x - w), Math.round(y - h * 0.4 - i), Math.round(w * 2), 1, C.F[0]); if (i % 4 === 0) for (let xx = -w; xx < w; xx += 3 * s) p.px(x + xx + (i % 8 ? 1 : 0), y - h * 0.4 - i, C.L[0]); } } },
      { id: 'coral', soft: true, draw(p, x, y, s, C, r) { const br = (x0, y0, a, l, d) => { if (d > 3) { p.ell(x0, y0, 1.6 * s, 1.6 * s, C.G); return; } const x1 = x0 + Math.cos(a) * l, y1 = y0 + Math.sin(a) * l; p.thick(x0, y0, x1, y1, Math.max(1, (3.5 - d * 0.7) * s), C.F[d % 2] || C.G); br(x1, y1, a - 0.4 - r() * 0.3, l * 0.78, d + 1); br(x1, y1, a + 0.4 + r() * 0.3, l * 0.75, d + 1); }; br(x, y, -Math.PI / 2, 14 * s, 0); } },
      { id: 'campana', soft: true, draw(p, x, y, s, C, r) { const h = 46 * s; for (let i = 0; i < h; i++) p.px(x + Math.sin(i * 0.15) * 2 * s, y - i, C.T[2]); for (let yy = 0; yy < 14 * s; yy++) { const ww = (4 + yy * 0.8) * s; p.rect(Math.round(x - ww), Math.round(y - h + yy), Math.round(ww * 2), 1, yy % 3 ? C.G : '#ffffff'); } for (let k = 0; k < 5; k++) for (let j = 0; j < (6 + r() * 10) * s; j++) p.px(x - 10 * s + k * 5 * s, y - h + 14 * s + j, C.G); } }
    ],
    xertha: [
      { id: 'pilar_hex', rigid: true, draw(p, x, y, s, C, r) { const h = 70 * s; for (let i = 0; i < h; i++) { const w = 7 * s; p.rect(Math.round(x - w), Math.round(y - i), Math.round(w * 2), 1, C.T[1]); if (i % 7 === 0) p.line(x - w, y - i, x + w, y - i, C.L[2]); } p.tri(x - 7 * s, y - h, x + 7 * s, y - h, x, y - h - 8 * s, C.L[2]); } },
      { id: 'cera', draw(p, x, y, s, C, r) { const h = 60 * s; trunk(p, x, y, x + 2 * s, y - h, 6 * s, 4 * s, C.T); blob(p, x + 2 * s, y - h, 16 * s, 9 * s, C.L); for (let k = 0; k < 6; k++) { const dx = (k - 2.5) * 5 * s; for (let j = 0; j < (5 + r() * 12) * s; j++) p.px(x + 2 * s + dx, y - h + 6 * s + j, C.L[2]); } } },
      { id: 'miel', draw(p, x, y, s, C, r) { for (let k = 0; k < 3; k++) { const bx = x + (k - 1) * 9 * s, h = (20 + r() * 20) * s; p.line(bx, y, bx, y - h, C.T[2]); blob(p, bx, y - h, 4 * s, 5 * s, [C.T[1], C.F[0], C.F[2] || C.G]); } } },
      { id: 'panal', rigid: true, draw(p, x, y, s, C, r) { for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * 0.3, l = 30 * s; for (let j = 4; j < l; j += 4) { const hx = x + Math.cos(a) * j, hy = y + Math.sin(a) * j; p.ell(hx, hy, 2 * s, 1.8 * s, C.L[(j / 4) % 2 ? 1 : 2]); } } } },
      { id: 'polen', draw(p, x, y, s, C, r) { p.line(x, y, x, y - 40 * s, C.T[1]); blob(p, x, y - 44 * s, 8 * s, 8 * s, [C.L[1], C.F[0], C.F[2] || C.G]); for (let k = 0; k < 8; k++) p.px(x + (r() - 0.5) * 22 * s, y - 44 * s + (r() - 0.5) * 22 * s, C.F[0]); } }
    ],
    ignaria: [
      { id: 'basalto', draw(p, x, y, s, C, r) { const h = 64 * s; let cx = x; for (let i = 0; i < h; i += 3) { const nx = x + Math.sin(i * 0.08) * 5 * s; trunk(p, cx, y - i, nx, y - i - 3, 7 * s, 6 * s, ['#0e0a0a', '#1e1616', '#2e2222']); cx = nx; } for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * 0.4; p.line(cx, y - h, cx + Math.cos(a) * 16 * s, y - h + Math.sin(a) * 12 * s, '#2e2222'); blob(p, cx + Math.cos(a) * 16 * s, y - h + Math.sin(a) * 12 * s, 3 * s, 2.5 * s, [C.L[0], C.L[1], C.L[2]]); } } },
      { id: 'lava_coral', draw(p, x, y, s, C, r) { const br = (x0, y0, a, l, d) => { if (d > 3) return; const x1 = x0 + Math.cos(a) * l, y1 = y0 + Math.sin(a) * l; p.thick(x0, y0, x1, y1, Math.max(1, (4 - d) * s), d > 1 ? C.L[2] : '#1e1616'); br(x1, y1, a - 0.5, l * 0.7, d + 1); br(x1, y1, a + 0.5, l * 0.7, d + 1); }; br(x, y, -Math.PI / 2, 16 * s, 0); } },
      { id: 'vaina', draw(p, x, y, s, C, r) { for (let k = 0; k < 4; k++) { const bx = x + (k - 1.5) * 7 * s, h = (24 + r() * 26) * s; p.line(bx, y, bx + 2, y - h, '#2e2222'); blob(p, bx + 2, y - h, 2.5 * s, 5 * s, ['#1e1616', '#3e2e2a', C.G]); } } },
      { id: 'carbon', draw(p, x, y, s, C, r) { const br = (x0, y0, a, l, d) => { if (d > 3) return; const x1 = x0 + Math.cos(a) * l, y1 = y0 + Math.sin(a) * l; p.thick(x0, y0, x1, y1, Math.max(1, (5 - d) * s), '#140e0e'); if (d === 3) p.px(x1, y1, C.G); br(x1, y1, a - 0.7, l * 0.6, d + 1); br(x1, y1, a + 0.4, l * 0.75, d + 1); }; br(x, y, -Math.PI / 2 + 0.2, 26 * s, 0); } },
      { id: 'flor_calor', draw(p, x, y, s, C, r) { p.line(x, y, x, y - 30 * s, '#3e2e2a'); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; blob(p, x + Math.cos(a) * 5 * s, y - 32 * s + Math.sin(a) * 5 * s, 3 * s, 3 * s, [C.F[0], C.F[1] || C.G, '#ffffff']); } } }
    ],
    aerthyon: [
      { id: 'cometa', draw(p, x, y, s, C, r) { const h = 70 * s; p.line(x, y, x + 6 * s, y - h, C.T[2]); for (let k = 0; k < 4; k++) { const yy = y - h * (0.4 + k * 0.17), xx = x + 6 * s * (0.4 + k * 0.17); p.tri(xx, yy, xx + (14 + k * 2) * s, yy + 6 * s, xx + 2 * s, yy + 12 * s, C.L[k % 2 ? 1 : 2]); } } },
      { id: 'globo', draw(p, x, y, s, C, r) { for (let k = 0; k < 3; k++) { const h = (36 + k * 14 + r() * 10) * s, bx = x + (k - 1) * 8 * s + Math.sin(k) * 4; p.line(x + (k - 1) * 3, y, bx, y - h, C.T[2]); blob(p, bx, y - h - 5 * s, 5 * s, 6 * s, [C.L[1], C.L[2], C.F[0], '#ffffff']); } } },
      { id: 'junco', draw(p, x, y, s, C, r) { for (let k = 0; k < 6; k++) { const h = (40 + r() * 40) * s, bend = (6 + r() * 6) * s; for (let i = 0; i < h; i++) p.px(x + (k - 2.5) * 3 * s + (i / h) ** 2 * bend, y - i, C.L[i % 5 ? 1 : 2]); } } },
      { id: 'campanilla', rigid: true, draw(p, x, y, s, C, r) { p.line(x, y, x, y - 50 * s, C.T[2]); p.line(x - 14 * s, y - 50 * s, x + 14 * s, y - 50 * s, C.T[2]); for (let k = 0; k < 5; k++) { const bx = x - 12 * s + k * 6 * s, l = (6 + r() * 10) * s; p.line(bx, y - 50 * s, bx, y - 50 * s + l, C.T[1]); p.rect(Math.round(bx - 1), Math.round(y - 50 * s + l), 2, Math.round(4 * s), C.F[0]); } } },
      { id: 'cinta', draw(p, x, y, s, C, r) { const h = 60 * s; p.line(x, y, x, y - h, C.T[1]); for (let k = 0; k < 4; k++) { let px2 = x, py2 = y - h * (0.5 + k * 0.15); for (let j = 0; j < 22 * s; j++) { px2 += 1; py2 += Math.sin(j * 0.3 + k) * 0.6; p.px(px2, py2, C.F[k % 2] || C.G); } } } }
    ]
  };

  // ---------- sprites: cada especie en 3 variantes naturales (tamaño, ramificación, inclinación) ----------
  P.BGL = { comp: {}, hz: {}, owRigid: { umbrelia: [0, 1] } };
  P.Sprites.buildVeg = function () {
    for (const pl in P.VEG) P.VEG[pl].forEach((sp, i) => {
      for (const st of ['c', 'r']) P.mk('veg_' + pl + '_' + i + '_' + st, 64, 100, 3, (p, v) => { const C = pal(pl, st); sp.draw(p, 32, 99, [0.62, 0.8, 0.98][v], C, P.RNG(P.hash(pl + sp.id) + v * 17), st); });
    });
    // nuevos árboles gigantes del mundo para cada planeta (más modelos además de los existentes)
    const big = { verzara: [0, 1], khazir: [0, 3], nivorah: [1, 3], thalassyr: [1, 0], umbrelia: [0, 2], mykoris: [0, 1, 3], xertha: [0, 1], ignaria: [0, 3], aerthyon: [1, 3] };
    for (const pl in big) {
      const pre = (P.ART[pl] && P.ART[pl].p) || '';
      for (const st of ['c', 'r']) {
        const S = P.S[pre + 'bigtree_' + st]; if (!S) continue;
        for (const si of big[pl]) { const sp = P.VEG[pl][si], tmp = P.mk('_bt_tmp', 110, 190, 1, p => sp.draw(p, 55, 188, 1.85, pal(pl, st), P.RNG(P.hash(pl + sp.id + 'big')), st), { up: 0.1, down: 0.15, dark: 0.5 }); S.f.push(tmp.f[0]); }
      }
      const A = P.ART[pl]; if (!A || A._bigDone) continue; A._bigDone = true;
      const n0 = (P.S[pre + 'bigtree_c'] ? P.S[pre + 'bigtree_c'].f.length : 2) - big[pl].length, extra = big[pl].map((_, k) => n0 + k);
      A.treeVariants = (A.treeVariants || [0, 1]).concat(extra, extra);
      A.rigidTrees = (A.rigidTrees || []).concat(extra.filter((_, k) => P.VEG[pl][big[pl][k]].rigid));
    }
    // mapa exterior: cuatro modelos más de árbol por planeta, sacados de su catálogo (tamaños y estructuras distintas)
    for (const pl in P.VEG) {
      const pre = (P.ART[pl] && P.ART[pl].p) || '';
      for (const st of ['c', 'r']) {
        const S = P.S[pre + 'o_tree_' + st]; if (!S || S._owDone) continue; S._owDone = true; const n0 = S.f.length;
        P.VEG[pl].slice(0, 5).forEach((sp, k) => { if (k === 4 && P.VEG[pl].length < 5) return; const tmp = P.mk('_ow_tmp', 34, 42, 1, p => { p.ell(17, 40, 10, 2.2, '#06080a'); sp.draw(p, 17, 41, [0.42, 0.36, 0.46, 0.4, 0.38][k], pal(pl, st), P.RNG(P.hash(pl + sp.id + 'ow' + k)), st); }); S.f.push(tmp.f[0]); if (st === 'c' && sp.rigid) (P.BGL.owRigid[pl] = P.BGL.owRigid[pl] || []).push(n0 + k); });
      }
    }
    // criaturas ambientales del cielo (2 fotogramas) propias de cada planeta
    const CR = {
      verzara: (p, f) => { p.tri(1, 4 + f, 6, 3, 4, 5, '#2a4a3a'); p.tri(11, 4 + f, 6, 3, 8, 5, '#2a4a3a'); p.px(6, 4, '#c8ff3a'); },
      khazir: (p, f) => { p.ell(6, 4, 5, 1.5 + f * 0.5, '#7a4a28'); p.px(10, 4, '#ffd166'); p.line(0, 4, 2, 4 + f, '#5a3418'); },
      nivorah: (p, f) => { p.tri(2, 3 + f * 2, 6, 4, 5, 6, '#c8e8ff'); p.tri(10, 3 + f * 2, 6, 4, 7, 6, '#c8e8ff'); p.px(6, 5, '#ffffff'); },
      thalassyr: (p, f) => { p.line(1, 3 + f, 6, 5, '#e8fffc'); p.line(11, 3 + f, 6, 5, '#e8fffc'); p.px(6, 5, '#5a7a8a'); },
      umbrelia: (p, f) => { p.tri(2, 4 - f, 6, 4, 5, 6, '#1a1620'); p.tri(10, 4 - f, 6, 4, 7, 6, '#1a1620'); p.px(4, 4, '#ff4450'); p.px(8, 4, '#ff4450'); },
      mykoris: (p, f) => { p.ell(6, 3, 4, 2.5, '#5ef0a0'); p.px(5, 2, '#ffffff'); for (let k = 0; k < 3; k++) p.px(4 + k * 2, 6 + ((k + f) % 2), '#c04ad0'); },
      xertha: (p, f) => { p.ell(6, 4, 2.5, 2, '#d0a020'); p.line(4, 3 - f, 2, 1, '#fff0b0'); p.line(8, 3 - f, 10, 1, '#fff0b0'); },
      ignaria: (p, f) => { p.tri(2, 4 + f, 6, 4, 5, 6, '#2e2222'); p.tri(10, 4 + f, 6, 4, 7, 6, '#2e2222'); p.px(6, 5, '#ff7a2a'); },
      aerthyon: (p, f) => { p.ell(6, 4, 3, 3, '#ffffff'); for (let k = 0; k < 4; k++) p.line(6, 4, 6 + Math.cos(k * 1.57 + f * 0.4) * 5, 4 + Math.sin(k * 1.57 + f * 0.4) * 5, '#bfe8ff'); }
    };
    for (const pl in CR) P.mk('critter_' + pl, 12, 8, 2, CR[pl], { outline: false });
  };
  (function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildVeg(); }; })();

  // versión con bruma de un sprite (se cachea por planeta, cielo y capa) para separar los planos
  const hazed = (name, frame, col, k) => {
    const key = name + ':' + frame + ':' + col + ':' + k; if (P.BGL.hz[key]) return P.BGL.hz[key];
    const src = P.S[name].f[frame], cv = document.createElement('canvas'); cv.width = src.width; cv.height = src.height; const x = cv.getContext('2d'); x.drawImage(src, 0, 0);
    x.globalCompositeOperation = 'source-atop'; x.globalAlpha = k; x.fillStyle = col; x.fillRect(0, 0, cv.width, cv.height);
    P.mkCanvas('vh_' + key, [cv]); return (P.BGL.hz[key] = 'vh_' + key);
  };
  // composición propia de cada nivel: especies, densidad, agrupación y alturas (con semilla planeta + nivel)
  P.BGL.compose = function (L) {
    const key = L.planet + ':' + (L.id || 0); if (P.BGL.comp[key]) return P.BGL.comp[key];
    const cat = P.VEG[L.planet] || P.VEG.verzara, R = P.RNG(P.hash('veg' + key)), n = cat.length;
    const pickSet = k => { const ids = []; while (ids.length < k) { const i = R.int(0, n - 1); if (!ids.includes(i)) ids.push(i); } return ids; };
    const dens = 0.7 + R() * 0.7, mk = (f, sp, gap, haze, yj, sway) => { const ids = pickSet(sp), W = (L.W || 4000) * f + P.W + 200, objs = []; let x = R.int(-40, 40); while (x < W) { const grp = R() < 0.35 ? R.int(2, 4) : 1; for (let g = 0; g < grp; g++) objs.push({ x: x + g * R.int(10, 22), sp: R.pick(ids), v: R.int(0, 2), yo: R.int(0, yj), ph: R() * 6 }); x += Math.round(R.int(gap[0], gap[1]) / dens); } return { f, objs, haze, sway }; };
    const comp = [mk(0.16, 2, [26, 60], 0.55, 10, false), mk(0.34, 3, [60, 130], 0.32, 8, 'soft'), mk(0.6, 2, [170, 320], 0.12, 4, true)];
    comp.front = []; { let x = R.int(200, 400); const W = (L.W || 4000) * 1.35 + P.W; while (x < W) { comp.front.push({ x, sp: R.int(0, n - 1), v: R.int(1, 2) }); x += R.int(420, 900); } }
    comp.critT = R.int(120, 400);
    return (P.BGL.comp[key] = comp);
  };
  // dibuja una capa de vegetación (i = 0 lejana, 1 media, 2 cercana) para el estado st
  P.BGL.layer = function (L, c, cx, vy, i, st) {
    if (L.A && L.A.noVeg) return;
    if (L.def.boss && i === 0) return;
    const comp = P.BGL.compose(L), Ly = comp[i], cat = P.VEG[L.planet] || P.VEG.verzara, pl = P.VEG[L.planet] ? L.planet : 'verzara';
    const skies = (L.A.skies || P.SKIES)[L.sky] || P.SKIES.day, hz = skies[st][3], base = [P.H - 22 + vy * 0.14, P.H - 12 + vy * 0.28, P.H + 6 + vy * 0.47][i];
    for (const o of Ly.objs) {
      const x = Math.round(o.x - cx * Ly.f); if (x < -70 || x > P.W + 10) continue;
      const name = hazed('veg_' + pl + '_' + o.sp + '_' + st, o.v, hz, Ly.haze), y = Math.round(base + o.yo - 100);
      if (Ly.sway && !cat[o.sp].rigid && (Ly.sway === true || cat[o.sp].soft || (o.sp + i) % 2 === 0)) P.drawSway(c, name, 0, x - 32, y, { t: L.t, ph: o.ph + o.x * 0.01, amp: cat[o.sp].soft ? 0.8 : 1.4, flutter: 0.3, base: 99 }); else c.drawImage(P.S[name].f[0], x - 32, y);
    }
    // criaturas ambientales que cruzan el cielo detrás del plano medio
    if (i === 1 && st === 'c') {
      const cr = L.bgCrit || (L.bgCrit = []);
      if (L.t % comp.critT === 0) { const dir = Math.random() < 0.5 ? 1 : -1, n = P.ri(1, 4), y0 = P.rand(30, 110); for (let k = 0; k < n; k++) cr.push({ x: dir > 0 ? -20 - k * 14 : P.W + 20 + k * 14, y: y0 + P.rand(-8, 8), vx: dir * P.rand(0.4, 0.8), ph: Math.random() * 6 }); }
      for (const q of cr) { q.x += q.vx; q.ph += 0.08; P.spr(c, 'critter_' + pl, Math.floor(q.ph * 2) % 2, Math.round(q.x), Math.round(q.y + Math.sin(q.ph) * 3), { flip: q.vx < 0 }); }
      L.bgCrit = cr.filter(q => q.x > -60 && q.x < P.W + 60);
    }
  };
  // capa 6: siluetas cercanas que pasan delante de la cámara por el borde inferior (no tapan la zona de juego)
  P.BGL.front = function (L, c, cx, cy) {
    if (L.A && L.A.noVeg) return;
    if (L.def.boss) return;
    const comp = P.BGL.compose(L), pl = P.VEG[L.planet] ? L.planet : 'verzara', bottom = L.H - cy;
    for (const o of comp.front) {
      const x = Math.round(o.x - cx * 1.35); if (x < -70 || x > P.W + 10) continue;
      const name = hazed('veg_' + pl + '_' + o.sp + '_c', o.v, '#05040a', 0.9);
      c.globalAlpha = 0.85; c.drawImage(P.S[name].f[0], x - 32, Math.round(Math.min(P.H, bottom) - 52)); c.globalAlpha = 1;
    }
  };
  // capa 5: partículas propias de cada planeta (se suman a las de su ambiente)
  P.BGL.ambient = function (L, cx, cy, rf) {
    if (L.A && L.A.noVeg) return;
    if (L.theme === 'facility' || L.theme === 'lab') return;
    const pl = L.planet, t = L.t, add = o => L.parts.add(o);
    if (pl === 'verzara' && t % 9 === 0) add({ x: cx + P.rand(0, P.W), y: cy + P.rand(40, P.H), vx: P.rand(-0.2, 0.2), vy: P.rand(-0.2, 0.1), life: 120, col: Math.random() < rf ? '#d8ff6a' : '#b06aff', size: 1, glow: 4, fn: q => { q.glow = (q.life % 40) < 20 ? 4 : 0; } });
    if (pl === 'khazir' && t % 5 === 0) add({ x: cx - 10, y: cy + P.rand(P.H * 0.4, P.H), vx: P.rand(2, 3.5), vy: P.rand(-0.1, 0.1), life: 200, col: P.pick(['#e8c890', '#c8a070']), size: 1 });
    if (pl === 'nivorah' && t % 300 === 0) for (let k = 0; k < 14; k++) add({ x: cx + P.W + 10, y: cy + P.rand(20, P.H), vx: -P.rand(3, 5), vy: P.rand(0.2, 0.6), life: 160, col: '#ffffff', size: P.pick([1, 2]) });
    if (pl === 'thalassyr' && t % 14 === 0) add({ x: cx + P.rand(0, P.W), y: cy + P.H + 4, vy: -P.rand(0.3, 0.7), life: 200, col: '#d8fffa', size: 1, fn: q => { q.vx = Math.sin(q.life * 0.1) * 0.3; } });
  };
})();
