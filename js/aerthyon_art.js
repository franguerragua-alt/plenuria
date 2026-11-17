'use strict';
// AERTHYON — El Archipiélago de las Tormentas: arte del planeta (prefijo «ae_»).
// Islas flotantes de piedra nacarada, montañas suspendidas, mares de nubes, cascadas que caen al vacío y tormentas
// eléctricas. Contaminado: gris tormenta, nubes sucias y piedra apagada. Restaurado: azul celeste, turquesa luminoso,
// blanco nacarado, violeta atmosférico y oro celestial.
P.PAL.aerthyon = {
  c: { soil: ['#14161e', '#1e2230', '#2a3042', '#3a4258'], vein: '#5a6280', top: ['#2a2e3e', '#3a4052', '#525a72', '#727c96'],
    liq: ['#20263a', '#30384e', '#4a5470', '#6a7690'], thorn: ['#2a2e44', '#3e4460', '#5a6280', '#8a94b0'],
    leaf: ['#2a2e3e', '#3e4458', '#5a627a', '#7a84a0'], trunk: ['#1e2230', '#2e3446', '#464e66'], glow: '#7a8ab0', flower: ['#5a6a8a', '#6a7a9a', '#4a5a7a'] },
  r: { soil: ['#262c50', '#3c4676', '#5c6aa0', '#8e9cd0'], vein: '#bfe8ff', top: ['#127a8a', '#22a8b4', '#56dcd8', '#c8fff4'],
    liq: ['#8aaee0', '#b4d0f4', '#dceaff', '#ffffff'], thorn: ['#3a4a8a', '#6a8ad8', '#bfe8ff', '#ffffff'],
    leaf: ['#3a2a8a', '#6a5ad8', '#a89aff', '#e8e0ff'], trunk: ['#9aa0c4', '#c8cce4', '#f0f2fc'], glow: '#bfe8ff', flower: ['#ffd166', '#bfe8ff', '#e8a0ff', '#ffffff'] }
};
P.AEC = { pearl: ['#6a7094', '#9aa0c0', '#cdd2ea', '#f4f6ff'], gold: ['#7a5a12', '#c0962a', '#ffd166', '#fff4c0'], storm: ['#1e2232', '#2e3448', '#464e68', '#6a7490'],
  elec: ['#2a6aff', '#5ae0ff', '#bff6ff', '#ffffff'], vio: ['#241650', '#3e2c8a', '#6a5ad0', '#a898ff', '#e0d8ff'], turq: ['#0a5a6a', '#16949e', '#4cd8d4', '#bffff4'] };
P.SKIES_A = {
  day: { r: ['#0e2a7a', '#2058c0', '#4a98e8', '#9ad4f8', '#e8f8ff'], c: ['#1a1e2e', '#2a3044', '#3a4258', '#4e566c', '#646c82'] },
  golden: { r: ['#1a1450', '#4a2a8a', '#a05aa8', '#f0a070', '#ffe0a0'], c: ['#1c1a26', '#2c2836', '#3e3846', '#524a56', '#686068'] },
  dusk: { r: ['#030616', '#0a1440', '#162c70', '#24489a', '#3a6ab8'], c: ['#06070c', '#0e1018', '#161a26', '#202634', '#2c3242'] }
};
P.HERO_SKINS.celeste = { name: 'Armadura Celeste', d: '#16285a', m: '#2e5ab8', l: '#8ad4ff', h: '#ffffff', j: '#0a1230', e: '#ffffff', eg: '#5ef0ff', acc: '#ffd166', w: '#ffffff' };
P.SUIT_STYLE = P.SUIT_STYLE || {}; P.SUIT_STYLE.celeste = 'storm';
P.ART = P.ART || {};
P.ART.aerthyon = {
  p: 'ae_', skies: P.SKIES_A, owMusic: 'aerthyon_ow',
  owAmb: lf => 'rgba(8,14,40,' + (0.3 - lf * 0.18) + ')',
  flora: { L: 'farol_nimbo', F: 'helecho_viento', m: 'vaina_estratos', U: 'arbol_cometa', h: 'rocio_celeste', y: 'flor_aurora', lily: 'loto_nube', g: 'pacenube', legend: 'ballena_celeste' },
  tileFlora: { b: 'respiradero', '|': 'liana_plata', '^': 'espina_cristal' }
};

// isla flotante: superficie con hierba, cuerpo de roca que se estrecha hacia abajo y raíces o cristales colgando
P.Sprites.aeIsland = function (p, cx, ty, w, h, C, G, r, o = {}) {
  const pts = []; for (let i = 0; i <= w * 2; i++) { const u = (i - w) / w; pts.push(h * Math.pow(Math.max(0, 1 - u * u), 0.75) * (0.78 + 0.22 * Math.sin(i * 0.31 + cx))); }
  for (let i = 0; i <= w * 2; i++) { const x = cx - w + i, d = Math.round(pts[i]), u = (i - w) / w;
    for (let y = 0; y <= d; y++) { const t = y / Math.max(1, d); let s = 0.78 - t * 0.55 - u * 0.22; if (((x * 7 + y * 3) % 11) === 0) s -= 0.14; if (y < 2) s = 0.95; p.px(x, ty + y, C[Math.max(0, Math.min(C.length - 1, Math.floor(s * C.length)))]); } }
  if (G) for (let i = 0; i <= w * 2; i++) { const x = cx - w + i; p.px(x, ty, G[0]); p.px(x, ty - 1, G[1]); if ((i * 13) % 5 === 0) p.px(x, ty - 2, G[2]); }
  if (o.roots !== false) for (let k = 0; k < Math.max(2, Math.round(w / 6)); k++) { const i = r.int(Math.round(w * 0.3), Math.round(w * 1.7)), x = cx - w + i, y0 = ty + Math.round(pts[i] * 0.85), l = r.int(3, 5 + Math.round(h / 3)); for (let j = 0; j < l; j++) p.px(x + Math.round(Math.sin(j * 0.4 + k)), y0 + j, o.root || C[1]); if (o.glow) p.px(x, y0 + l, o.glow); }
};
// montaña suspendida: picos afilados con crestas iluminadas, nieve nacarada y base invertida que flota
P.Sprites.aePeak = function (p, cx, by, w, h, C, snow, r, under = 0.45) {
  const seed = r.range(0, 9);
  for (let y = 0; y <= h; y++) { const t = y / h, ww = w * Math.pow(t, 0.95) + Math.sin(y * 0.5 + seed) * 1.4 * t + 1, Y = by - h + y;
    for (let x = Math.round(-ww); x <= Math.round(ww); x++) { const u = x / Math.max(1, ww), g = Math.sin(u * 7 + seed + y * 0.08); let s = u < -0.05 ? 0.78 : 0.34; if (g > 0.85) s -= 0.18; else if (g > 0.65 && u < 0) s += 0.12; s -= t * 0.18;
      let col = C[Math.max(0, Math.min(C.length - 1, Math.floor(s * C.length)))]; if (snow && t < 0.22 + Math.sin(x * 0.7) * 0.05 && u < 0.4) col = u < 0 ? snow[1] : snow[0]; p.px(cx + x, Y, col); } }
  if (under > 0) { const uh = Math.round(h * under); for (let y = 1; y <= uh; y++) { const ww = w * (1 - y / uh) ** 1.4 + 1; for (let x = Math.round(-ww); x <= Math.round(ww); x++) p.px(cx + x, by + y, x < 0 ? C[1] : C[0]); } }
};
// rayo quebrado (también lo usan los efectos animados)
P.aeBolt = function (c, x0, y0, x1, y1, seed, col, w = 1, branches = 2) {
  const r = P.RNG(seed), n = Math.max(4, Math.round(Math.hypot(x1 - x0, y1 - y0) / 9)); let px = x0, py = y0; c.fillStyle = col;
  for (let i = 1; i <= n; i++) { const t = i / n, nx = x0 + (x1 - x0) * t + (i < n ? r.range(-7, 7) : 0), ny = y0 + (y1 - y0) * t + (i < n ? r.range(-3, 3) : 0), m = Math.max(Math.abs(nx - px), Math.abs(ny - py)) | 0;
    for (let k = 0; k <= m; k++) c.fillRect(Math.round(px + (nx - px) * k / Math.max(1, m)), Math.round(py + (ny - py) * k / Math.max(1, m)), w, w);
    if (branches > 0 && i > 1 && i < n - 1 && r() < 0.3) { branches--; P.aeBolt(c, nx, ny, nx + r.range(-30, 30), ny + r.range(10, 30), seed + i * 7, col, 1, 0); c.fillStyle = col; }
    px = nx; py = ny; }
};

P.Sprites.buildAerthyon = function () {
  const K = P.PAL.aerthyon, A = P.AEC;
  for (const st of ['c', 'r']) {
    const pal = K[st], s = pal.soil, t = pal.top, on = st === 'r', EL = on ? A.elec : A.storm;
    // piedra nacarada en estratos, con vetas de cristal celeste
    P.mk('ae_t_soil_' + st, 16, 16, 3, (p, v) => { const r = P.RNG(3900 + v + (on ? 9 : 0)); p.rect(0, 0, 16, 16, s[1]); p.rect(0, 5, 16, 1, s[0]); p.rect(0, 11, 16, 1, s[0]); for (let k = 0; k < 3; k++) { const x = r.int(0, 12), y = r.int(0, 12); p.rect(x, y, r.int(3, 6), 2, s[2]); p.px(x, y, s[3]); } if (v > 0) { const x = r.int(2, 12); p.line(x, 1, x + 2, 9, pal.vein); if (v === 2 && on) p.px(x + 1, 5, '#ffffff'); } }, { outline: false });
    // césped turquesa que ondea con flores blancas diminutas
    P.mk('ae_t_top_' + st, 16, 9, 3, (p, v) => { const r = P.RNG(3920 + v + (on ? 9 : 0)); p.rect(0, 3, 16, 4, t[1]); p.rect(0, 3, 16, 1, t[2]); p.rect(0, 6, 16, 1, t[0]); for (let x = 0; x < 16; x++) if (r() < 0.45) p.px(x, 2 - (x % 3 === 0 ? 1 : 0), t[2]); if (v) { const x = r.int(2, 13); p.px(x, 1, on ? '#ffffff' : t[3]); p.px(x + 1, 2, on ? A.gold[2] : t[3]); } }, { outline: false });
    P.mk('ae_t_bot_' + st, 16, 8, 2, (p, v) => { const r = P.RNG(3940 + v); for (let k = 0; k < 3; k++) { const x = r.int(1, 14), l = r.int(2, 7); for (let y = 0; y < l; y++) p.px(x + (y > 3 ? 1 : 0), y, y === l - 1 ? (on ? A.elec[2] : s[3]) : s[2]); } });
    P.mk('ae_tdeco_' + st, 16, 14, 6, (p, v) => {
      if (v === 0) { for (let k = 0; k < 4; k++) p.ell(4 + k * 3, 11 - (k % 2), 2.4, 2, k % 2 ? A.pearl[3] : A.pearl[2]); p.rect(2, 12, 12, 1, A.pearl[1]); }
      if (v === 1) { p.tri(6, 13, 10, 13, 8, 3, on ? A.elec[1] : A.storm[3]); p.line(8, 4, 8, 12, on ? '#ffffff' : A.storm[2]); p.tri(10, 13, 13, 13, 12, 8, on ? A.vio[3] : A.storm[2]); }
      if (v === 2) { for (let k = 0; k < 3; k++) { const x = 5 + k * 3; for (let y = 0; y < 8; y++) p.px(x + Math.round(Math.sin(y * 0.6 + k) * 1.2), 13 - y, k === 1 ? (on ? A.vio[3] : t[2]) : t[2]); } }
      if (v === 3) { p.rect(7, 4, 2, 9, A.pearl[1]); p.rect(4, 4, 8, 1, A.pearl[2]); for (const x of [4, 8, 11]) p.rect(x, 5, 1, 3, on ? A.gold[2] : A.storm[3]); }
      if (v === 4) { for (let k = 0; k < 4; k++) p.ell(3 + k * 3.4, 12 - (k % 2), 1.6, 1.2, k % 2 ? s[3] : s[2]); }
      if (v === 5) { p.line(8, 13, 8, 7, t[1]); p.ell(8, 5, 2.4, 2.4, on ? A.elec[2] : A.storm[3]); p.px(8, 4, '#ffffff'); }
    });
    // mar de nubes (si no hay dibujo propio)
    const lq = pal.liq;
    P.mk('ae_t_liq_' + st, 16, 16, 4, (p, f) => { for (let x = 0; x < 16; x++) { const h = Math.round(2 + Math.sin((x + f * 3) * 0.5) * 1.4); for (let y = h; y < 16; y++) p.px(x, y, y < h + 2 ? lq[3] : y < h + 6 ? lq[2] : lq[1]); } });
    P.mk('ae_t_liqb_' + st, 16, 16, 4, (p, f) => { p.grad(0, 0, 16, 16, [lq[1], lq[0]]); for (let k = 0; k < 3; k++) p.ell((k * 6 + f * 2) % 16, (k * 5 + 3) % 16, 3, 1.4, lq[2]); });
    // espinas de cristal
    P.mk('ae_t_thorn_' + st, 16, 16, 2, (p, f) => { p.ell(8, 14, 8, 2.5, s[2]); for (let i = 0; i < 4; i++) { const x = 2 + i * 4 + f, h = 7 + (i % 2) * 5; p.tri(x - 2, 14, x + 2, 14, x + (i % 2 ? 1 : -1), 14 - h, pal.thorn[1]); p.line(x, 13, x + (i % 2 ? 1 : -1), 14 - h, pal.thorn[3]); } });
    P.mk('ae_t_vine_' + st, 16, 16, 2, (p, v) => { for (let y = 0; y < 16; y++) { const x = 8 + Math.round(Math.sin((y + v * 8) * 0.4)); p.px(x, y, A.pearl[2]); p.px(x + 1, y, A.pearl[1]); if (y % 5 === 2) p.px(x - 1, y, on ? A.elec[2] : A.pearl[3]); } });
    // pasarela de piedra flotante (un sentido)
    P.mk('ae_t_branch_' + st, 16, 8, 2, (p, v) => { p.rect(0, 2, 16, 3, A.pearl[1]); p.rect(0, 2, 16, 1, A.pearl[3]); for (let x = 3 + v * 4; x < 16; x += 8) p.px(x, 3, on ? A.gold[2] : A.storm[3]); p.rect(0, 5, 16, 1, A.pearl[0]); });
    // respiradero: corriente que impulsa hacia arriba
    P.mk('ae_t_bulb_' + st, 16, 16, 3, (p, f) => { p.sell(8, 13, 7, 3, [A.pearl[0], A.pearl[1], A.pearl[2]]); p.ell(8, 12, 3, 1.2, '#0a1028'); const h = [3, 10, 6][f]; for (let i = 0; i < h; i++) { const x = 8 + Math.round(Math.sin(i * 0.9 + f) * 2.5); p.px(x, 11 - i, i % 2 ? (on ? A.elec[2] : '#c8d0e0') : '#ffffff'); p.px(16 - x, 11 - i, '#e8f0ff'); } });
  }
  // templos de piedra blanca con remates dorados
  P.mk('ae_t_ruin', 16, 16, 3, (p, v) => { p.grad(0, 0, 16, 16, ['#e4e8f6', '#c8cce4', '#a6acc8']); p.rect(0, 0, 16, 2, A.gold[1]); p.rect(0, 1, 16, 1, A.gold[2]); p.line(0, 9, 15, 9, '#8a90b0'); p.line(v * 5 + 2, 2, v * 5 + 2, 9, '#8a90b0'); if (v === 1) { p.rect(6, 4, 4, 3, A.elec[1]); p.px(7, 5, '#ffffff'); } if (v === 2) { p.ell(11, 12, 2, 2, A.gold[2]); p.px(11, 12, '#ffffff'); } }, { outline: false });
  P.mk('ae_t_ruintop', 16, 6, 1, p => { p.rect(0, 2, 16, 2, A.gold[1]); p.rect(0, 2, 16, 1, A.gold[3]); for (let x = 2; x < 16; x += 5) p.px(x, 3, A.elec[2]); }, { outline: false });
  P.mk('ae_t_crack', 16, 16, 1, p => { p.rect(0, 0, 16, 16, '#5c6aa0'); p.line(3, 0, 7, 7, '#1a2040'); p.line(7, 7, 4, 15, '#1a2040'); p.line(7, 7, 13, 10, '#1a2040'); p.px(7, 7, A.elec[2]); }, { outline: false });
  // sello de tormenta (se abre con energía atmosférica)
  P.mk('ae_t_gate', 16, 16, 2, (p, f) => { p.rect(1, 0, 14, 16, '#c8cce4'); p.rect(1, 0, 1, 16, '#ffffff'); p.rect(14, 0, 1, 16, '#8a90b0'); for (let y = 2; y < 16; y += 5) { p.rect(3, y, 10, 2, '#3a4a8a'); p.px(8, y, f ? '#ffffff' : A.elec[1]); } }, { outline: false });
  // losa de nube sólida que aparece y se disuelve (f1 = disuelta)
  P.mk('ae_t_phase', 16, 8, 2, (p, f) => { if (f) { for (let x = 1; x < 16; x += 3) p.px(x, 5, '#bfe8ff'); return; } for (let k = 0; k < 4; k++) p.ell(2 + k * 4, 4, 3, 2.4, k % 2 ? '#ffffff' : '#e4f0ff'); p.rect(0, 5, 16, 2, '#b4c8ec'); p.px(5, 3, '#ffffff'); p.px(11, 2, A.gold[3]); });

  // ================= ÁRBOLES GIGANTES =================
  for (const st of ['c', 'r']) { const on = st === 'r', pal = K[st];
    // ÁRBOL COMETA: tronco curvo y ligero de corteza nacarada, frondas violetas translúcidas y semillas que flotan
    // CAMPANARIO DEL VIENTO (rígido): torre natural de cristal con campanas que suenan con las corrientes
    P.mk('ae_bigtree_' + st, 110, 190, 2, (p, v) => {
      const r = P.RNG(4040 + v + (on ? 9 : 0)), T = pal.trunk, L = pal.leaf;
      if (v === 0) { let x = 55, y = 188; const pts = []; for (let i = 0; i < 70; i++) { x = 55 + Math.sin(i * 0.05) * 16 - i * 0.12; y = 188 - i * 2; pts.push([x, y]); const w = Math.max(1.5, 6 - i / 16); p.rect(Math.round(x - w), y - 1, Math.round(w * 2), 2, T[(i >> 2) % 2 ? 1 : 2]); p.px(Math.round(x - w), y, T[2]); }
        const [hx, hy] = pts[pts.length - 1];
        for (let k = 0; k < 11; k++) { const a = -Math.PI / 2 + (k - 5) * 0.3, l = 26 + r.int(0, 22); let fx = hx, fy = hy; for (let j = 0; j < l; j++) { fx += Math.cos(a + j * 0.03 * (k < 5 ? -1 : 1)); fy += Math.sin(a + j * 0.03) * 0.8 + j * 0.035; p.px(fx, fy, L[j < l * 0.5 ? 2 : 1]); if (j % 3 === 0) { p.px(fx + 1, fy + 1, L[3]); p.px(fx - 1, fy + 2, L[1]); } } p.ell(fx, fy + 1, 2, 1.6, on ? A.gold[2] : L[2]); }
        for (let k = 0; k < 7; k++) p.px(hx + r.int(-30, 30), hy - r.int(4, 30), on ? '#ffffff' : L[3]); return; }
      for (let y = 0; y < 150; y++) { const w = 10 - y / 18; p.rect(Math.round(55 - w), 188 - y, Math.round(w * 2), 1, y % 20 < 2 ? A.gold[on ? 2 : 0] : (y >> 3) % 2 ? T[1] : T[2]); if (y % 3 === 0) p.px(Math.round(55 - w), 188 - y, '#ffffff'); }
      for (let k = 0; k < 4; k++) { const y = 150 - k * 30; p.line(55, y, 55 + (k % 2 ? 26 : -26), y + 6, T[1]); const bx = 55 + (k % 2 ? 26 : -26); p.tri(bx - 4, y + 16, bx + 4, y + 16, bx, y + 6, on ? A.gold[2] : T[0]); p.px(bx, y + 17, on ? '#ffffff' : T[2]); }
      p.tri(45, 40, 65, 40, 55, 6, on ? A.elec[1] : T[2]); p.line(55, 8, 55, 38, '#ffffff'); p.ell(55, 30, 3, 3, on ? '#ffffff' : T[1]);
    }, { up: 0.08, down: 0.12, dark: 0.45 });
  }

  // ================= FLORA =================
  for (const st of ['c', 'r']) { const on = st === 'r', pal = K[st];
    // HELECHO DE VIENTO: frondas en cinta que se doblan con la corriente
    P.mk('ae_fern_' + st, 22, 16, 2, (p, f) => { for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.32; let x = 11, y = 15; for (let j = 0; j < 11; j++) { x += Math.cos(a + j * 0.06 * (f ? 1.6 : 1)); y += Math.sin(a); p.px(x, y, pal.top[1]); if (j % 2) p.px(x + 1, y, on ? pal.top[3] : pal.top[2]); } } });
  }
  P.mk('ae_lamp', 14, 22, 2, (p, f) => { p.line(7, 22, 7, 12, A.pearl[1]); p.ell(7, 7 - f, 3.4, 3.4, A.elec[1]); p.ell(7, 7 - f, 2, 2, A.elec[2]); p.px(6, 6 - f, '#ffffff'); for (let k = 0; k < 3; k++) p.px(4 + k * 3, 12 - f + (k % 2), A.pearl[3]); });
  P.mk('ae_mush', 18, 16, 2, (p, f) => { p.sell(9, 9 - f, 6, 5 + f, [A.vio[1], A.vio[2], A.vio[3], A.vio[4]]); for (let k = 0; k < 3; k++) p.px(6 + k * 3, 6 - f, '#ffffff'); p.rect(8, 13, 2, 3, A.pearl[1]); });
  P.mk('ae_bigmush', 30, 34, 1, p => { for (let y = 0; y < 24; y++) p.px(15 + Math.round(Math.sin(y * 0.15) * 3), 33 - y, A.pearl[2 - (y % 2)]); for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * 0.42; let x = 15 + Math.sin(24 * 0.15) * 3, y = 10; for (let j = 0; j < 12; j++) { x += Math.cos(a); y += Math.sin(a) * 0.7 + j * 0.05; p.px(x, y, A.vio[2 + (j % 2)]); } } });
  P.mk('ae_orchid', 14, 16, 2, (p, f) => { p.line(7, 15, 7, 8, A.turq[1]); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + f * 0.3; p.tri(7, 6, 7 + Math.cos(a) * 6, 6 + Math.sin(a) * 4, 7 + Math.cos(a + 0.45) * 4, 6 + Math.sin(a + 0.45) * 3, k % 2 ? A.vio[3] : A.gold[2]); } p.ell(7, 6, 1.4, 1.4, '#ffffff'); });
  P.mk('ae_lily', 18, 6, 1, p => { p.ell(9, 4, 7, 1.6, A.pearl[2]); p.ell(9, 3, 3, 1, A.elec[2]); p.px(9, 2, '#ffffff'); });
  P.mk('ae_heal', 16, 18, 2, (p, f) => { p.line(8, 17, 8, 9, A.turq[1]); for (const [x, y] of [[5, 8], [11, 7], [8, 4]]) p.sell(x, y - f, 2.4, 2.4, [A.turq[1], A.turq[2], A.turq[3], '#ffffff']); });

  // ================= FAUNA =================
  // NUBÍCOLA: pequeño caminante de patas de cristal con un caparazón de nube en el lomo
  const crawl = (p, f, cy2) => { const ph = f === 4 ? 0 : f; for (let k = 0; k < 4; k++) { const lx = 8 + k * 5, sw = Math.sin((ph + k) * 1.57) * 2; p.line(lx, 15, lx - 2 + sw, 21, cy2 ? '#7a86a4' : A.elec[1]); } p.sell(15, 14, 10, 4.5, cy2 ? ['#2a2a3a', '#4a4a5a', '#6a6a7a', '#9a9aaa'] : [A.pearl[0], A.pearl[1], A.pearl[2], A.pearl[3]]); for (let k = 0; k < 4; k++) p.ell(8 + k * 5, 10 - (k % 2) * 2, 3.4, 3, cy2 ? '#4a5268' : k % 2 ? '#ffffff' : '#e4f0ff'); p.ell(26, 14, 2, 1.6, cy2 ? '#ff3050' : A.elec[2]); p.px(27, 13, '#ffffff'); if (f === 4) p.line(27, 15, 31, 16, A.elec[2]); };
  P.mk('ae_krazith', 32, 22, 5, (p, f) => crawl(p, f, false));
  P.mk('ae_krazith_cy', 34, 24, 5, (p, f) => { crawl(p, f, true); p.rect(8, 4, 14, 3, '#3a4258'); p.rect(8, 4, 14, 1, '#7a86a4'); });
  // COLOSO DE NIMBO (alfa): bestia acorazada con melena de nubes de tormenta y cuernos que chisporrotean
  P.mk('ae_krazith_alfa', 52, 36, 5, (p, f) => { const ph = f === 4 ? 0 : f; for (let k = 0; k < 4; k++) { const lx = 12 + k * 9, sw = Math.sin((ph + k) * 1.57) * 3; p.thick(lx, 26, lx + sw, 35, 4, A.storm[1]); } p.sell(26, 22, 21, 11, [A.storm[0], A.storm[1], A.storm[2], A.storm[3]]); for (let k = 0; k < 7; k++) p.ell(8 + k * 5.5, 13 - (k % 2) * 3, 5, 4, k % 2 ? '#5a6280' : '#7a84a4'); for (let k = 0; k < 6; k++) p.ell(8 + k * 6, 11 - (k % 2) * 3, 3, 2, '#c8d0e8'); p.line(44, 14, 50, 4, A.pearl[2]); p.line(46, 15, 52, 9, A.pearl[2]); p.px(50, 4, A.elec[2]); p.ell(45, 20, 3, 2.4, f === 4 ? '#ffffff' : A.elec[2]); if (f === 4) for (let k = 0; k < 3; k++) p.line(48, 4 + k * 3, 51, 2 + k * 3, '#ffffff'); });
  // SALTABRISA: saltadora con aletas membranosas que planea un instante en cada salto
  P.mk('ae_frog', 20, 17, 3, (p, f) => { const y = f === 1 ? -2 : 0; p.sell(10, 12 + y, 6, 3.4, [A.turq[0], A.turq[1], A.turq[2], A.turq[3]]); for (const sd of [-1, 1]) p.tri(10, 11 + y, 10 + sd * 9, 7 + y - (f === 1 ? 3 : 0), 10 + sd * 5, 13 + y, A.vio[3]); p.line(5, 14 + y, 3, 16, A.turq[0]); p.line(15, 14 + y, 17, 16, A.turq[0]); p.ell(15, 11 + y, 2, 1.6, A.turq[2]); p.px(16, 10 + y, '#ffffff'); if (f === 2) p.ell(19, 12, 1.6, 1.6, A.elec[2]); });
  // VELACIELO: raya planeadora con cintas en la cola
  const fly = (p, f, cy2) => { const up = f ? -3 : 2; for (const sd of [-1, 1]) { p.tri(13, 8, 13 + sd * 12, 6 + up, 13 + sd * 6, 12, cy2 ? '#4a4a5a' : A.vio[2]); p.line(13, 8, 13 + sd * 12, 6 + up, cy2 ? '#7a7a8a' : A.vio[4]); } p.sell(13, 9, 3, 4, cy2 ? ['#2a2a3a', '#4a4a5a', '#7a7a8a'] : [A.vio[1], A.vio[3], '#ffffff']); for (let k = 0; k < 3; k++) p.px(13 + Math.round(Math.sin(k + f) * 1), 13 + k, cy2 ? '#6a6a7a' : A.elec[2]); p.px(13, 8, cy2 ? '#ff3050' : '#ffffff'); };
  P.mk('ae_dfly', 26, 16, 2, (p, f) => fly(p, f, false));
  P.mk('ae_dfly_cy', 26, 16, 2, (p, f) => { fly(p, f, true); p.rect(11, 5, 5, 2, '#3a4258'); });
  // ORUGA DE ESTRATOS: segmentos nacarados con penachos de nube
  P.mk('ae_slug', 28, 15, 2, (p, f) => { for (let k = 0; k < 6; k++) { const x = 5 + k * 3.6, y = 10 + Math.sin(k * 0.9 + f * 2); p.sell(x, y, 2.6, 2.6, [A.pearl[0], A.pearl[1], A.pearl[3]]); p.ell(x, y - 3, 1.6, 1.2, '#ffffff'); } p.px(25, 9, A.elec[2]); });
  P.mk('ae_vsnake', 12, 34, 2, (p, f) => { for (let y = 0; y < 24 + f * 6; y++) { const w = Math.max(1, 4 - y / 8); p.rect(6 - w, y, w * 2, 1, A.pearl[(y >> 2) % 2 ? 1 : 2]); } const y0 = 24 + f * 6; p.ell(6, y0 + 2, 3, 2.4, A.pearl[2]); p.px(5, y0 + 2, A.elec[2]); p.px(7, y0 + 2, A.elec[2]); });
  // BOCA DE TORMENTA: planta carnívora de mandíbulas que crepitan
  P.mk('ae_maw', 26, 34, 3, (p, f) => { p.thick(13, 34, 13, 18, 3, A.storm[2]); const o = [0, 4, 8][f]; for (const sd of [-1, 1]) p.tri(13, 18, 13 + sd * (6 + o), 6 - o * 0.3, 13 + sd * 2, 6, A.storm[3]); p.ell(13, 14, 4 + o * 0.4, 3, f ? '#0a1028' : A.elec[1]); if (o) for (let k = 0; k < 4; k++) p.px(10 + k * 2, 11, A.elec[3]); });
  // PACENUBE (restaurado): herbívoro de seis patas con sacos de aire que le hacen flotar a ratos
  P.mk('ae_grazer', 38, 28, 3, (p, f) => { const ph = f === 2 ? 0 : f; for (let k = 0; k < 4; k++) p.line(10 + k * 6, 18, 10 + k * 6 + (k % 2 ? 1 : -1) * ph * 2, 27, A.pearl[1]); p.sell(19, 16, 12, 5, [A.pearl[0], A.pearl[1], A.pearl[2], A.pearl[3]]); for (let k = 0; k < 3; k++) p.sell(12 + k * 7, 8 - (k % 2) * 2, 4, 4, [A.vio[2], A.vio[3], A.vio[4], '#ffffff']); p.line(30, 15, 34, 11, A.pearl[1]); p.ell(34, 10, 3, 2.4, A.pearl[2]); p.px(35, 9, A.elec[1]); });
  // BALLENA CELESTE legendaria: nada entre las nubes
  P.mk('ae_vellorn', 40, 38, 2, (p, f) => { p.sell(20, 20, 17, 9, [A.vio[1], A.vio[2], A.vio[3], A.vio[4]]); p.ell(20, 24, 13, 4, '#e8f0ff'); for (let k = 0; k < 5; k++) p.px(10 + k * 5, 15 + (k % 2), '#ffffff'); p.tri(3, 20, -2, 13 + f * 3, -2, 26 - f * 3, A.vio[2]); for (const sd of [-1, 1]) p.tri(20, 22, 26, 22, 24 + sd, 33 + f, A.vio[3]); p.ell(33, 18, 1.6, 1.6, '#ffffff'); p.px(33, 18, A.vio[0]); for (let k = 0; k < 4; k++) p.px(14 + k * 4, 10 - f, A.gold[2]); });
  P.mk('ae_wraith', 20, 24, 3, (p, f) => { p.line(7, 18, 5, 23, A.pearl[1]); p.line(12, 18, 14, 23, A.pearl[1]); p.sell(9, 13, 6, 7, [A.pearl[0], A.pearl[1], A.pearl[2], A.pearl[3]]); p.sell(9, 5, 4, 4, [A.storm[1], A.storm[2], A.storm[3]]); p.ell(11, 5, 1.4, 1.2, f === 2 ? '#ffffff' : A.elec[2]); const sx = f === 1 ? 17 : 15; p.rect(sx, 4, 3, 16, A.pearl[2]); p.rect(sx, 4, 1, 16, '#ffffff'); for (let y = 6; y < 20; y += 4) p.px(sx + 1, y, A.elec[1]); });
  P.mk('ae_b_glob', 7, 7, 2, (p, f) => { p.ell(3, 3, 3, 3, f ? A.elec[2] : A.elec[1]); p.px(2, 2, '#ffffff'); });
  P.mk('ae_b_orb', 8, 8, 2, (p, f) => { p.ell(4, 4, 3.6, 3.6, f ? A.elec[1] : A.elec[0]); p.ell(3, 3, 1.4, 1.4, '#ffffff'); });
  P.mk('ae_b_bolt', 14, 7, 2, (p, f) => { const ys = f ? [3, 1, 5, 2, 4, 3] : [3, 5, 1, 4, 2, 3]; for (let k = 0; k < 5; k++) p.line(k * 3, ys[k], k * 3 + 3, ys[k + 1], k % 2 ? '#ffffff' : A.elec[2]); p.px(13, 3, '#ffffff'); });
  P.mk('ae_b_kspine', 12, 5, 1, p => { p.tri(0, 1, 0, 4, 11, 2, A.pearl[2]); p.line(1, 2, 10, 2, A.elec[2]); });
  P.mk('ae_rock', 12, 12, 2, (p, f) => { p.sell(6, 6, 5, 4.6, [A.pearl[0], A.pearl[1], A.pearl[2], A.pearl[3]]); p.px(4, 4, f ? A.elec[2] : '#ffffff'); });
  P.mk('ae_gate', 34, 46, 1, p => { for (let k = 0; k <= 20; k++) { const a = Math.PI * k / 20; p.thick(17 - Math.cos(a) * 13, 44 - Math.sin(a) * 34, 17 - Math.cos(a) * 13, 44 - Math.sin(a) * 34, 5, k % 3 ? A.pearl[2] : A.gold[2]); } p.rect(2, 42, 30, 4, A.pearl[1]); p.ell(17, 14, 4, 4, A.elec[1]); p.px(17, 14, '#ffffff'); });
  const ic = (n, fn) => P.mk('i_' + n, 10, 10, 1, fn);
  ic('wind', p => { for (let k = 0; k < 3; k++) { p.line(1, 3 + k * 2, 7 - k, 3 + k * 2, '#ffffff'); p.px(8 - k, 2 + k * 2, A.elec[2]); } });
  ic('bolt', p => { p.line(6, 0, 3, 5, A.elec[2]); p.line(3, 5, 6, 5, '#ffffff'); p.line(6, 5, 3, 9, A.elec[2]); });
  ic('aegis', p => { p.sell(5, 5, 4, 4.4, [A.elec[0], A.elec[1], A.elec[2], '#ffffff']); p.line(5, 2, 5, 8, A.gold[2]); });
  ic('tempest', p => { p.ell(5, 3, 4, 2.4, A.storm[3]); p.ell(4, 2, 2, 1.4, '#ffffff'); p.line(5, 5, 3, 8, A.elec[2]); p.line(3, 8, 6, 9, '#ffffff'); });

  // ================= MAPA EXTERIOR =================
  for (const st of ['c', 'r']) { const on = st === 'r', pal = K[st];
    P.mk('ae_o_grass_' + st, 16, 16, 3, (p, v) => { const r = P.RNG(4100 + v + (on ? 9 : 0)); p.rect(0, 0, 16, 16, pal.top[1]); for (let k = 0; k < 7; k++) p.px(r.int(0, 15), r.int(0, 15), pal.top[k % 2 ? 2 : 0]); if (v === 1) p.px(r.int(2, 13), r.int(2, 13), on ? '#ffffff' : pal.top[3]); if (v === 2) p.px(r.int(2, 13), r.int(2, 13), on ? A.gold[2] : pal.top[3]); }, { outline: false });
    P.mk('ae_o_water_' + st, 16, 16, 2, (p, f) => { const lq = pal.liq; p.rect(0, 0, 16, 16, lq[1]); for (let k = 0; k < 4; k++) p.ell((k * 5 + f * 3) % 16, (k * 4 + 2) % 16, 3, 1.4, lq[2]); p.px((f * 7) % 16, 8, lq[3]); }, { outline: false });
    P.mk('ae_o_tree_' + st, 34, 42, 2, (p, v) => { if (v === 0) { for (let y = 0; y < 26; y++) p.px(17 + Math.round(Math.sin(y * 0.12) * 3), 40 - y, pal.trunk[(y >> 2) % 2 ? 1 : 2]); for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * 0.42; let x = 17 + Math.sin(26 * 0.12) * 3, y = 14; for (let j = 0; j < 10; j++) { x += Math.cos(a); y += Math.sin(a) * 0.7 + j * 0.05; p.px(x, y, pal.leaf[2 + (j % 2)]); } } } else { for (let y = 0; y < 30; y++) { const w = 4 - y / 10; p.rect(Math.round(17 - w), 40 - y, Math.round(w * 2), 1, pal.trunk[(y >> 3) % 2 ? 1 : 2]); } p.tri(13, 12, 21, 12, 17, 0, on ? A.elec[1] : pal.trunk[2]); p.line(17, 2, 17, 11, '#ffffff'); } });
    P.mk('ae_o_ice_' + st, 16, 16, 2, (p, v) => { p.rect(0, 0, 16, 16, on ? A.pearl[2] : '#3a4052'); for (let k = 0; k < 5; k++) p.px(2 + k * 3, 5 + v * 4, on ? '#ffffff' : '#525a72'); }, { outline: false });
    P.mk('ae_o_cliff_' + st, 16, 16, 3, (p, v) => { p.rect(0, 0, 16, 16, pal.soil[1]); for (let x = 0; x < 16; x += 4) p.rect(x, 0, 3, 16, pal.soil[2 - (x % 8 ? 1 : 0)]); if (v === 2) { p.rect(0, 0, 16, 2, pal.top[2]); } if (v === 1) p.rect(0, 12, 16, 4, on ? '#bfe0ff' : '#2a3042'); }, { outline: false });
    P.mk('ae_o_crack_' + st, 16, 16, 2, (p, f) => { p.rect(0, 0, 16, 16, pal.top[1]); for (let x = 0; x < 16; x++) { const y = 7 + Math.round(Math.sin(x * 0.5 + f) * 1.5); p.rect(x, y, 1, 2, on ? '#dceaff' : '#20263a'); p.px(x, y, on ? '#ffffff' : '#4a5470'); } }, { outline: false });
  }
  P.mk('ae_o_path', 16, 16, 2, (p, v) => { p.rect(0, 0, 16, 16, '#c8cce4'); for (let k = 0; k < 5; k++) p.px((k * 5 + v * 3) % 16, (k * 7) % 16, '#e4e8f6'); p.rect(0, 15, 16, 1, '#9aa0c4'); }, { outline: false });
  P.mk('ae_o_stone', 16, 16, 1, p => { p.rect(0, 0, 16, 16, '#e4e8f6'); p.rect(0, 7, 16, 1, '#9aa0c4'); p.rect(7, 0, 1, 7, '#9aa0c4'); p.rect(11, 8, 1, 8, '#9aa0c4'); p.px(3, 3, A.gold[2]); }, { outline: false });
  P.mk('ae_o_goo', 16, 16, 2, (p, f) => { p.ell(8, 11, 6, 3, '#1a2030'); p.ell(8, 10, 4, 2, '#3a4a6a'); p.px(6 + f, 9, A.elec[1]); }, { outline: false });
  P.mk('ae_o_lamp', 10, 16, 2, (p, f) => { p.rect(4, 6, 2, 10, A.pearl[1]); p.ell(5, 4, 2.4, 2.4 + f * 0.3, A.elec[1]); p.px(5, 3, '#ffffff'); });
  P.mk('ae_o_rock', 16, 16, 1, p => { p.sell(8, 10, 7, 5.5, [A.pearl[0], A.pearl[1], A.pearl[2], A.pearl[3]]); p.px(6, 7, '#ffffff'); });
  P.mk('ae_o_pillar', 14, 30, 2, (p, f) => { if (f) { p.rect(3, 22, 8, 8, A.pearl[1]); return; } p.rect(4, 4, 6, 26, A.pearl[2]); p.rect(4, 4, 1, 26, '#ffffff'); p.rect(2, 2, 10, 3, A.gold[2]); p.rect(2, 27, 10, 3, A.pearl[1]); });
  P.mk('ae_o_house', 44, 38, 2, (p, f) => { p.rect(8, 18, 28, 18, f ? '#e4e8f6' : '#8a90b0'); p.ell(22, 18, 14, 9, f ? '#c8cce4' : '#6a7094'); p.rect(20, 26, 6, 10, '#1a2040'); if (f) p.rect(21, 27, 4, 3, A.elec[2]); p.line(22, 2, 22, 9, A.gold[2]); p.px(22, 1, '#ffffff'); });
  P.mk('ae_o_flower', 8, 8, 3, (p, v) => { p.line(4, 7, 4, 4, A.turq[1]); p.ell(4, 3, 1.8, 1.8, [A.vio[3], A.gold[2], A.elec[2]][v]); });
};
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildAerthyon(); }; })();
