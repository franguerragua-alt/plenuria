'use strict';
// KHAZIR — Mar de Arena Cantora: arte del planeta (prefijo de sprites «kz_»)
P.PAL.khazir = {
  // contaminado: arena oxidada, cristales tóxicos rosas, lodo de cristal
  c: { soil: ['#3a1a1e', '#5a2a2c', '#7a3e38', '#9a5a4c'], vein: '#ff5ad0', top: ['#6a2e34', '#a0503e', '#cc7458', '#f0a890'],
    liq: ['#3a0a4a', '#7a1a9a', '#d04ae0', '#ffc8ff'], thorn: ['#4a1a5a', '#a04ad0', '#ff9af0', '#ffffff'],
    leaf: ['#2e3a2a', '#4e5a3a', '#7a8a58', '#c0c890'], trunk: ['#4a2a1a', '#6a4028', '#8a5a38'], glow: '#ff5ad0', flower: ['#ff5ad0', '#c8ff4a', '#ffd166'] },
  // restaurado: arena dorada, oasis turquesa, Umbráceas y flores del desierto
  r: { soil: ['#7a4422', '#a8622e', '#cc823c', '#eeaa5a'], vein: '#3ae0c0', top: ['#c07a2a', '#e8a440', '#ffcc6a', '#fff0b8'],
    liq: ['#0a5a7a', '#1a9ab8', '#5ae8e0', '#f0fffc'], thorn: ['#6a5a2a', '#a89040', '#ffd166', '#ffffff'],
    leaf: ['#126a3a', '#2fa84a', '#7ad860', '#e0ff9a'], trunk: ['#6a4020', '#9a6230', '#c88a48'], glow: '#3ae0c0', flower: ['#ff5a8a', '#ffd166', '#ff8a3a', '#ffffff'] }
};
P.SKIES_K = {
  day: { r: ['#2462d0', '#4a9cf0', '#9ad6f6', '#ffe6c0', '#ffc888'], c: ['#4a3060', '#8a5070', '#c88080', '#eeaa88', '#ffd4a0'], cloud: ['#ffffff', '#fff0dc', '#e0b8a0'], cloudC: ['#ffe0d8', '#e8a8a0', '#a06070'] },
  golden: { r: ['#3050a8', '#8a88c8', '#ffae7a', '#ff8a4a', '#ff6a32'], c: ['#40204a', '#80406a', '#d06a6a', '#ff905a', '#ffc070'], cloud: ['#fff0d8', '#ffc8a0', '#d08070'], cloudC: ['#ffd0c0', '#e09090', '#904060'] },
  dusk: { r: ['#141848', '#4a2a70', '#b04a6a', '#ff7a4a', '#ffc060'], c: ['#120a30', '#3a1a5a', '#80306a', '#d04a6a', '#ff8a5a'], cloud: ['#ffc8d8', '#e088a8', '#6a3a80'], cloudC: ['#ffb0d0', '#c060a0', '#4a2060'] }
};
P.HERO_SKINS.duna = { name: 'Armadura de Duna', d: '#701604', m: '#d8400c', l: '#ff6a1a', h: '#ffa45a', j: '#340a02', e: '#ffffff', eg: '#ff5a2a', acc: '#3ae0c0', w: '#fff0e0' }; // tonos óxido, rojo arcilla y naranja
P.ART = P.ART || {};
P.ART.khazir = {
  p: 'kz_', skies: P.SKIES_K, owMusic: 'khazir_ow',
  owAmb: lf => 'rgba(40,14,10,' + (0.16 - lf * 0.14) + ')',
  flora: { L: 'cactus_farol', F: 'salvia_roja', m: 'bulbo_azufre', U: 'palmera_cristal', h: 'aloe_solar', y: 'rosa_desierto', lily: 'loto_oasis', g: 'dromotauro', legend: 'esfinge' },
  tileFlora: { b: 'calabaza_geiser', '|': 'cuerda_duna', '^': 'cardo_vidrio' }
};

// Umbrácea de Duna: árbol alienígena de KHAZIR. Tronco de hueso retorcido en espiral que se abre en
// ramas acabadas en sombrillas planas de fronda turquesa con flecos rosados; de ellas cuelgan farolillos de semilla.
// En territorio contaminado: corteza gris violácea, sombrillas marchitas y cristales tóxicos.
P.Sprites.kzUmbra = function (p, bx, by, s, st, v, mix) {
  const C0 = st === 'c' ? { bark: ['#3e2e3e', '#6a5a6e', '#9a8aa0', '#c8bcd0'], can: ['#2e2440', '#4e3e66', '#7a6a94', '#b8a0d0'], rim: '#c04ad0', pod: ['#3a2238', '#6a3a5a', '#a07090'], spark: '#ff5ad0' }
    : { bark: ['#7a5a3e', '#b8946a', '#e6cc9a', '#fff4dc'], can: ['#0a4a5a', '#13848c', '#3ec8bc', '#b4fff0'], rim: '#ff5a8a', pod: ['#9a400e', '#ffa82a', '#fff0a0'], spark: '#ffd166' };
  const M = c => mix ? P.Col.mix(c, mix[0], mix[1]) : c, C = {};
  for (const k in C0) C[k] = Array.isArray(C0[k]) ? C0[k].map(M) : M(C0[k]);
  const Q = (dx, dy) => [bx + dx * s, by + dy * s], W = w => Math.max(1, w * s);
  const fork = v ? -84 : -96, steps = Math.max(4, Math.ceil(-fork * s));
  const tx = t => Math.sin(t * 4.6 + v * 2) * 5;
  // raíces abiertas
  for (const sd of [-1, 1]) { const [x0, y0] = Q(sd * 15, 0), [x1, y1] = Q(sd * 3, -16), [x2, y2] = Q(sd * 2, 0); p.tri(x0, y0, x1, y1, x2, y2, C.bark[sd < 0 ? 2 : 0]); }
  // tronco retorcido con surco en espiral
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, [x, y] = Q(tx(t), fork * t), w = W(11 - 5 * t), xl = Math.round(x - w / 2);
    p.rect(xl, Math.round(y), Math.ceil(w), 1, C.bark[1]); p.px(xl, y, C.bark[2]); if (w > 4) p.px(xl + 1, y, C.bark[3]); p.px(xl + Math.ceil(w) - 1, y, C.bark[0]);
    if (w > 3) p.px(xl + 1 + ((i * 0.7) % Math.max(1, w - 2)), y, C.bark[0]);
  }
  const fk = Q(tx(1), fork);
  // ramas (curvas) hacia cada sombrilla
  const discs = v ? [[-26, -124, 19], [16, -150, 23], [-6, -102, 11, 0.62]] : [[-30, -138, 22], [5, -162, 24], [33, -130, 20], [-22, -108, 12, 0.7]];
  for (const [ex, ey, , from] of discs) {
    const sx = from ? Q(tx(from), fork * from)[0] : fk[0], sy = from ? Q(tx(from), fork * from)[1] : fk[1], [exx, eyy] = Q(ex, ey);
    const cx = (sx + exx) / 2 + (exx - sx) * 0.15, cy = Math.min(sy, eyy) + (sy - eyy) * 0.25;
    let px0 = sx, py0 = sy; const n = 12;
    for (let k = 1; k <= n; k++) { const t = k / n, x = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cx + t * t * exx, y = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cy + t * t * eyy; p.thick(px0, py0, x, y, W(4.5 - t * 2.5), C.bark[1]); p.px(px0, py0 - 1, C.bark[2]); px0 = x; py0 = y; }
  }
  // sombrillas: fronda plana con flecos, crestas y farolillos colgantes
  for (const [ex, ey, r] of discs) {
    const [cx, cy] = Q(ex, ey), rx = r * s, ry = Math.max(1.5, r * s * 0.3);
    p.ell(cx, cy + ry * 0.7, rx, ry, C.can[0]); p.ell(cx, cy, rx, ry, C.can[1]); p.ell(cx - rx * 0.15, cy - ry * 0.35, rx * 0.72, ry * 0.55, C.can[2]);
    if (rx > 6) for (let k = 0; k < 5; k++) { const a = Math.PI * (0.15 + k * 0.175); p.line(cx, cy - ry * 0.2, cx + Math.cos(a) * rx * 0.85, cy - Math.sin(a) * ry * 0.75, C.can[1]); }
    p.px(cx - rx * 0.45, cy - ry * 0.55, C.can[3]);
    for (let x = -rx + 1; x <= rx - 1; x += Math.max(2, 3 * s)) p.px(cx + x, cy + ry * Math.sqrt(Math.max(0, 1 - (x / rx) * (x / rx))) + 1, C.rim);
    if (rx > 4) for (let k = -1; k <= 1; k++) { const x = cx + k * rx * 0.45; p.tri(x - W(1.6), cy - ry * 0.4, x + W(1.6), cy - ry * 0.4, x + k * W(1), cy - ry - W(5), C.can[2]); }
    const pods = rx > 8 ? 3 : 1;
    for (let k = 0; k < pods; k++) { const x = cx + (pods === 1 ? 0 : (k - 1) * rx * 0.55), len = (8 + ((k * 7 + v * 3) % 3) * 5) * s, y0 = cy + ry; p.line(x, y0, x, y0 + len, C.can[0]); p.sell(x, y0 + len + W(2.2), W(2.2), W(2.8), C.pod); }
    if (st === 'c' && rx > 6) { p.tri(cx + rx * 0.3, cy - ry * 0.3, cx + rx * 0.3 + W(3), cy - ry * 0.3, cx + rx * 0.3 + W(1.5), cy - ry - W(4), C.spark); }
  }
  if (st === 'c') { const [x, y] = Q(tx(0.35) + 4, fork * 0.35); p.tri(x, y, x + W(4), y, x + W(2), y - W(7), C.spark); }
};

P.Sprites.buildKhazir = function () {
  const S = P.Sprites, K = P.PAL.khazir, GOLD = ['#8a5a0a', '#e8a020', '#ffd166', '#fff4c0'], MT = ['#1a1c2a', '#2e3346', '#4e5872', '#8a98bc'];
  const SAND = ['#9a6a3a', '#d8a868', '#f4d498', '#fff4d8'], STONE = ['#7a4a2e', '#b8784a', '#e0a870', '#ffe0b0'], TURQ = '#2ad8c0';
  // ================= TESELAS =================
  for (const st of ['c', 'r']) {
    const pal = K[st], s = pal.soil, t = pal.top;
    P.mk('kz_t_soil_' + st, 16, 16, 3, (p, v) => {
      const r = P.RNG(150 + v * 7 + (st === 'c' ? 3 : 0));
      p.rect(0, 0, 16, 16, s[1]);
      for (let y = 0; y < 16; y++) if ((y + v * 3) % 5 === 0) for (let x = 0; x < 16; x++) p.px(x, y, (x + y) % 7 === 0 ? s[0] : s[2]);
      for (let y = 0; y < 16; y++) if ((y + v * 3) % 5 === 1) for (let x = 0; x < 16; x++) if (r() < 0.3) p.px(x, y, s[0]);
      for (let i = 0; i < 2; i++) { const x = r.int(2, 13), y = r.int(2, 13); p.ell(x, y, 1.6, 1.1, s[3]); p.px(x + 1, y + 1, s[0]); }
      if (v === 1 && st === 'c') { const x = r.int(3, 11), y = r.int(4, 10); p.tri(x, y + 2, x + 2, y + 2, x + 1, y - 1, '#a03a8a'); p.px(x + 1, y, '#e070c8'); }
      if (v === 1 && st === 'r') { p.px(r.int(3, 12), r.int(3, 12), TURQ); }
    }, { outline: false });
    P.mk('kz_t_top_' + st, 16, 9, 3, (p, v) => {
      const r = P.RNG(170 + v * 5 + (st === 'c' ? 9 : 0));
      p.rect(0, 3, 16, 4, t[1]); p.rect(0, 3, 16, 1, t[2]); p.rect(0, 6, 16, 1, t[0]);
      for (let x = 0; x < 16; x++) { const h = Math.round(1 + Math.sin(x * 0.7 + v) * 1); for (let y = 3 - h; y < 3; y++) p.px(x, y, y === 3 - h ? t[3] : t[2]); if (r() < 0.5) p.px(x, 7, t[0]); }
      for (let x = v; x < 16; x += 5) p.px(x, 4, t[0]);
      if (st === 'c' && v !== 2) { const x = r.int(2, 12); p.tri(x, 3, x + 3, 3, x + 1, -1 + v, pal.vein); p.px(x + 1, 1, '#ffffff'); }
      if (st === 'r' && v === 2) { const x = r.int(3, 12); p.px(x, 1, '#2fa84a'); p.px(x + 1, 0, '#7ad860'); p.px(x - 1, 1, '#2fa84a'); }
    }, { outline: false });
    P.mk('kz_t_bot_' + st, 16, 7, 2, (p, v) => { const r = P.RNG(190 + v); for (let i = 0; i < 3; i++) { const x = r.int(1, 14), l = r.int(1, 4); p.line(x, 0, x, l, s[2]); if (st === 'c' && r() < 0.5) p.px(x, l + 1, pal.vein); } }, { outline: false });
    // decoración automática: cactus, matas secas, huesos, piedras, flores, cristales
    P.mk('kz_tdeco_' + st, 16, 14, 6, (p, v) => {
      const L = pal.leaf;
      if (v === 0) { p.rect(7, 4, 3, 10, L[1]); p.rect(7, 4, 1, 10, L[2]); p.rect(4, 7, 3, 2, L[1]); p.rect(4, 5, 2, 3, L[1]); p.rect(10, 8, 3, 2, L[1]); p.rect(11, 6, 2, 3, L[2]); for (let y = 5; y < 13; y += 3) p.px(10, y, L[3]); if (st === 'r') { p.px(8, 3, '#ff5a8a'); p.px(9, 3, '#ffd166'); } }
      if (v === 1) for (let i = 0; i < 6; i++) { const x = 4 + i * 1.5; for (let k = 0; k < 4 + (i % 3); k++) p.px(Math.round(x + (i - 2.5) * k * 0.25), 13 - k, st === 'r' ? L[2] : '#a08a5a'); }
      if (v === 2) { p.ell(8, 12, 5, 1.5, '#e8e0cc'); p.ell(5, 11, 2, 1.6, '#f4efe0'); p.px(4, 11, '#3a2a2a'); p.rect(9, 11, 5, 1, '#d8d0bc'); p.px(13, 10, '#e8e0cc'); }
      if (v === 3) { p.sell(9, 11, 4.5, 3, [STONE[0], STONE[1], STONE[2], STONE[3]]); p.sell(4, 12, 2.5, 2, [STONE[0], STONE[1], STONE[2]]); }
      if (v === 4) { if (st === 'r') { for (let i = 0; i < 3; i++) { const x = 4 + i * 4, c2 = pal.flower[i]; p.line(x, 13, x, 9 - i, L[1]); p.px(x - 1, 8 - i, c2); p.px(x + 1, 8 - i, c2); p.px(x, 7 - i, c2); p.px(x, 8 - i, '#ffffff'); } } else { p.tri(5, 13, 9, 13, 7, 5, '#a04ad0'); p.tri(8, 13, 12, 13, 10, 8, '#ff5ad0'); p.px(7, 7, '#ffffff'); } }
      if (v === 5) { p.tri(6, 13, 10, 13, 8, 6, st === 'c' ? '#ff5ad0' : '#ffc860'); p.tri(9, 13, 13, 13, 12, 9, st === 'c' ? '#a04ad0' : '#e8a020'); p.px(8, 8, '#ffffff'); }
    });
    // arena movediza: lodo de cristal (c) / agua de oasis (r)
    const lq = pal.liq;
    P.mk('kz_t_liq_' + st, 16, 16, 4, (p, f) => {
      for (let x = 0; x < 16; x++) { const h = Math.round(2 + Math.sin((x + f * 4) * 0.4) * 1.2); for (let y = h; y < 16; y++) p.dith(x, y, y < h + 3 ? lq[2] : lq[1], lq[1], y < h + 3 ? (y - h) / 3 : 0); p.px(x, h, lq[3]); }
      for (let i = 0; i < 3; i++) p.px((i * 6 + f * 3) % 16, 14 - ((f * 3 + i * 5) % 9), lq[3]);
      if (st === 'c') { p.tri(3, 9, 6, 9, 4, 4, '#ff9af0'); p.tri(11, 12, 14, 12, 12, 7, '#ff9af0'); }
    }, { outline: false });
    P.mk('kz_t_liqb_' + st, 16, 16, 2, (p, f) => { p.grad(0, 0, 16, 16, [lq[1], lq[0]]); for (let i = 0; i < 4; i++) p.px((i * 5 + f * 2) % 16, (i * 7 + f * 3) % 16, lq[2]); }, { outline: false });
    // cardo de vidrio (espinas)
    const th = pal.thorn;
    P.mk('kz_t_thorn_' + st, 16, 16, 2, (p, f) => {
      p.ell(8, 14, 8, 2.5, '#5a3a2a');
      for (let i = 0; i < 5; i++) { const x = 2 + i * 3 + (f ? 1 : 0), h = 6 + (i % 2) * 4; p.tri(x - 1.5, 14, x + 1.5, 14, x, 14 - h, th[1]); p.line(x, 14, x, 14 - h + 1, th[2]); p.px(x, 14 - h, th[3]); }
    });
    // enredadera de cuerda en las paredes del cañón
    P.mk('kz_t_vine_' + st, 16, 16, 2, (p, v) => {
      for (let y = 0; y < 16; y++) { const x = 8 + Math.round(Math.sin((y + v * 8) * 0.5) * 1); p.px(x, y, st === 'c' ? '#8a6a4a' : '#7a5a2a'); p.px(x + 1, y, '#4a3018'); if (y % 3 === 0) p.px(x - 1, y, '#c8a06a'); }
      for (let y = 3; y < 16; y += 6) { p.ell(5, y, 2, 1.2, pal.leaf[1]); p.ell(11, y + 2, 2, 1.2, pal.leaf[2]); }
    }, { outline: false });
    // puente de tablones con cuerda (plataforma de un sentido)
    P.mk('kz_t_branch_' + st, 16, 8, 2, (p, v) => {
      for (let x = 0; x < 16; x += 4) { p.rect(x, 2, 3, 4, '#9a6230'); p.rect(x, 2, 3, 1, '#d0a060'); p.rect(x + 2, 2, 1, 4, '#5a3418'); }
      p.line(0, 1, 15, 1, '#e8d0a0'); p.px(4 + v * 6, 1, '#7a5a3a'); p.line(0, 6, 15, 6, '#6a4a2a');
    });
    // calabaza géiser (rebote)
    P.mk('kz_t_bulb_' + st, 16, 16, 3, (p, f) => {
      const ry = [5, 3.5, 6.5][f], rx = [6, 7.5, 5][f], B = st === 'c' ? ['#6a1a7a', '#c04ad0', '#ff9af0', '#ffffff'] : ['#8a4a0a', '#e8902a', '#ffcc6a', '#ffffff'];
      p.ell(8, 15, 7, 1.5, '#5a3a1a'); p.sell(8, 14 - ry, rx, ry, B);
      for (let i = -1; i <= 1; i++) p.line(8 + i * 3, 14 - ry * 2 + 2, 8 + i * 4, 14, B[0]);
      p.rect(7, 13 - ry * 2, 2, 2, '#2fa84a'); p.px(6, 14 - ry * 2 + 2, '#ffffff');
    });
  }
  P.mk('kz_t_ruin', 16, 16, 3, (p, v) => {
    p.grad(0, 0, 16, 16, [STONE[2], STONE[1], STONE[1], STONE[0]]); p.rect(0, 7, 16, 1, STONE[0]); p.rect(0, 15, 16, 1, '#5a3420');
    p.rect(v === 1 ? 5 : 11, 0, 1, 7, STONE[0]); p.rect(v === 2 ? 3 : 7, 8, 1, 7, STONE[0]); p.px(2, 1, STONE[3]); p.px(12, 9, STONE[3]);
    if (v === 2) { p.rect(5, 2, 6, 3, '#5a3420'); p.rect(6, 3, 4, 1, TURQ); p.px(7, 2, GOLD[2]); }
    if (v === 0) { p.line(9, 10, 13, 10, '#5a3420'); p.line(11, 9, 11, 13, '#5a3420'); }
  }, { outline: false });
  P.mk('kz_t_ruintop', 16, 6, 1, p => { p.rect(0, 2, 16, 2, GOLD[1]); p.rect(0, 2, 16, 1, GOLD[3]); for (let x = 1; x < 16; x += 4) p.px(x, 3, TURQ); p.ell(5, 1, 2, 1, '#e8c890'); }, { outline: false });
  P.mk('kz_t_crack', 16, 16, 1, p => { p.grad(0, 0, 16, 16, [STONE[2], STONE[1], STONE[0]]); p.line(3, 0, 7, 6, '#3a1e10'); p.line(7, 6, 5, 11, '#3a1e10'); p.line(7, 6, 13, 9, '#3a1e10'); p.line(13, 9, 15, 15, '#3a1e10'); p.line(5, 11, 2, 16, '#3a1e10'); p.px(8, 6, STONE[3]); }, { outline: false });

  // ================= FONDOS =================
  const bgSky = (st, sky) => {
    const SK = P.SKIES_K[sky], cols = SK[st], p = new P.Painter(P.W, P.H), r = P.RNG(st === 'c' ? 41 : 42);
    p.grad(0, 0, P.W, P.H, cols);
    if (sky === 'dusk') for (let i = 0; i < 80; i++) p.px(r.int(0, P.W), r.int(0, 110), r() < 0.2 ? '#ffffff' : '#d8c8ff');
    const CL = st === 'c' ? SK.cloudC : SK.cloud;
    for (let i = 0; i < 5; i++) P.paintStratus(p, r.int(0, P.W), r.int(28, 120), r.int(80, 180), [CL[0], CL[1], CL[2]], r, { lit: 'top' });
    for (let i = 0; i < 2; i++) { const w = r.int(50, 80); P.paintCloud(p, r.int(0, P.W), r.int(50, 110), w, Math.round(w * 0.24), [CL[0], CL[1], CL[2]], r, { lit: 'top' }); }
    if (st === 'c') for (let y = 150; y < P.H; y++) for (let x = 0; x < P.W; x++) if (((x * 7 + y * 13) % 23) === 0) p.px(x, y, '#e8a090');
    const c = p.canvas(), x = c.getContext('2d'), sx = 360, sy = sky === 'dusk' ? 160 : sky === 'golden' ? 118 : 56;
    x.globalCompositeOperation = 'lighter';
    const gl = x.createRadialGradient(sx, sy, 4, sx, sy, 150); gl.addColorStop(0, 'rgba(255,245,210,0.85)'); gl.addColorStop(0.3, 'rgba(255,190,110,0.3)'); gl.addColorStop(1, 'rgba(255,140,60,0)');
    x.fillStyle = gl; x.fillRect(sx - 150, sy - 150, 300, 300); x.globalCompositeOperation = 'source-over';
    x.fillStyle = '#fffbe8'; x.beginPath(); x.arc(sx, sy, 19, 0, 7); x.fill();
    x.strokeStyle = st === 'c' ? 'rgba(60,20,50,0.55)' : 'rgba(110,70,70,0.3)'; x.lineWidth = 1;
    for (let i = -2; i <= 2; i++) { x.beginPath(); x.ellipse(sx, sy, 25, 25 * Math.abs(Math.cos(i * 0.55)) + 1, 0, 0, 7); x.stroke(); }
    x.beginPath(); x.arc(sx, sy, 25, 0, 7); x.stroke();
    x.fillStyle = st === 'c' ? 'rgba(255,210,220,0.45)' : 'rgba(255,250,240,0.45)'; x.beginPath(); x.arc(70, 46, 9, 0, 7); x.fill(); x.beginPath(); x.arc(98, 60, 5, 0, 7); x.fill();
    return c;
  };
  for (const sky in P.SKIES_K) for (const st of ['c', 'r']) P.mkCanvas('kz_bg_sky_' + st + '_' + sky, [bgSky(st, sky)]);
  for (const st of ['c', 'r']) {
    const hz = P.SKIES_K.day[st][3], pal = K[st];
    // lejos: dunas, mesetas y zigurats reptilianos
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(st === 'c' ? 51 : 52);
      const C1 = P.Col.mix(st === 'c' ? '#a05a5a' : '#c88a5a', hz, 0.55), C2 = P.Col.mix(st === 'c' ? '#7a3a4a' : '#a86a40', hz, 0.45);
      for (let i = 0; i < 5; i++) { const x = r.int(0, W), w = r.int(40, 90), h = r.int(30, 60), y = 175 - h; p.rect(x, y, w, h + 100, C2); p.rect(x, y, w, 2, P.Col.mix(C2, '#ffffff', 0.2)); for (let k = 0; k < 3; k++) p.rect(x, y + 8 + k * 9, w, 1, P.Col.mix(C2, '#000000', 0.12)); }
      for (let i = 0; i < 2; i++) { const x = 120 + i * 320 + r.int(-30, 30), b = 175; for (let k = 0; k < 5; k++) p.rect(x - 34 + k * 7, b - 10 - k * 9, 68 - k * 14, 10, P.Col.mix(C2, '#ffe0b0', 0.1 + k * 0.03)); p.rect(x - 3, b - 58, 6, 6, P.Col.mix(C2, '#000', 0.25)); }
      for (let x = 0; x < W; x++) { const y = Math.round(180 + Math.sin(x * 0.02) * 8 + Math.sin(x * 0.051 + 1) * 5); p.rect(x, y, 1, P.H - y, C1); p.px(x, y, P.Col.mix(C1, '#ffffff', 0.3)); }
      P.mkCanvas('kz_bg_far_' + st, [p.canvas()]); }
    // medio: mesetas estratificadas, arco de roca y Umbráceas lejanas
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(st === 'c' ? 61 : 62);
      const R0 = P.Col.mix(st === 'c' ? '#6a2e30' : '#9a5a32', hz, 0.25), R1 = P.Col.mix(st === 'c' ? '#8a4440' : '#c47a40', hz, 0.25), R2 = P.Col.mix(st === 'c' ? '#b06a5a' : '#e8a860', hz, 0.2);
      for (let i = 0; i < 4; i++) {
        const x = i * 160 + r.int(-10, 30), w = r.int(70, 110), top = r.int(95, 140);
        for (let y = top; y < P.H; y++) { const ww = w + Math.round((y - top) * 0.25); p.rect(x - ww / 2, y, ww, 1, ((y - top) >> 3) % 2 ? R0 : R1); p.rect(x - ww / 2, y, 2, 1, R2); }
        p.rect(x - w / 2, top, w, 3, R2);
      }
      for (let k = 0; k <= 28; k++) { const a = Math.PI * k / 28; p.thick(330 - Math.cos(a) * 46, 170 - Math.sin(a) * 50, 330 - Math.cos(a) * 46, 170 - Math.sin(a) * 50, 10, R1); }
      for (let i = 0; i < 7; i++) P.Sprites.kzUmbra(p, r.int(10, 630), P.H - r.int(4, 30), r.range(0.26, 0.38), st, i % 2, [hz, 0.35]);
      P.mkCanvas('kz_bg_mid_' + st, [p.canvas()]); }
    // cerca: cresta de duna con rocas y matas
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(st === 'c' ? 71 : 72), D = st === 'c' ? ['#6a3238', '#8a4a44'] : ['#b8742e', '#d89a48'];
      for (let x = 0; x < W; x++) { const y = Math.round(P.H - 16 + Math.sin(x * 0.03) * 6); p.rect(x, y, 1, P.H - y, D[0]); p.px(x, y, D[1]); }
      for (let i = 0; i < 12; i++) { const x = r.int(0, W), y = P.H - 14; p.sell(x, y, r.int(5, 9), r.int(4, 7), [STONE[0], STONE[1], STONE[2], STONE[3]].map(c2 => st === 'c' ? P.Col.mix(c2, '#6a2e4a', 0.4) : c2)); }
      for (let i = 0; i < 14; i++) { const x = r.int(0, W); for (let k = 0; k < 5; k++) for (let j = 0; j < 8; j++) p.px(Math.round(x + (k - 2) * j * 0.3), P.H - 16 - j, st === 'c' ? '#8a7a5a' : pal.leaf[1]); }
      P.mkCanvas('kz_bg_near_' + st, [p.canvas()]); }
    // árboles gigantes del plano medio: Umbrácea de Duna (v0) y obelisco reptiliano (v1)
    P.mk('kz_bigtree_' + st, 110, 190, 2, (p, v) => {
      const r = P.RNG(950 + v * 7 + (st === 'c' ? 3 : 0));
      if (v === 0) {
        P.Sprites.kzUmbra(p, 55, 188, 1, st, 0);
      } else {
        // obelisco del clan: base escalonada, fuste con glifos y piramidión dorado
        const GC = st === 'c' ? ['#5a3a2a', '#8a6a3a', '#b8925a', '#d8b880'] : GOLD;
        p.rect(30, 178, 50, 12, STONE[0]); p.rect(30, 178, 50, 2, STONE[2]); p.rect(36, 170, 38, 8, STONE[1]); p.rect(36, 170, 38, 2, STONE[3]);
        for (let y = 78; y < 170; y++) { const w = 14 + Math.round((y - 78) / 92 * 6); p.rect(55 - w / 2, y, w, 1, STONE[1]); p.rect(55 - w / 2, y, 3, 1, STONE[2]); p.rect(55 - w / 2, y, 1, 1, STONE[3]); p.rect(55 + w / 2 - 3, y, 3, 1, STONE[0]); }
        p.tri(47, 79, 63, 79, 55, 62, GC[1]); p.tri(47, 79, 55, 79, 55, 62, GC[2]); p.px(55, 63, GC[3]); p.rect(46, 78, 18, 2, GC[0]);
        for (let k = 0; k < 4; k++) {
          const gy = 88 + k * 20, gc = st === 'c' ? '#ff5ad0' : TURQ;
          p.rect(50, gy, 10, 1, '#5a3420'); p.rect(50, gy + 12, 10, 1, '#5a3420');
          if (k % 2 === 0) { p.ell(55, gy + 6, 3, 2, '#5a3420'); p.px(55, gy + 6, gc); } else { p.line(51, gy + 9, 55, gy + 3, '#5a3420'); p.line(55, gy + 3, 59, gy + 9, '#5a3420'); p.px(55, gy + 6, gc); }
        }
        if (st === 'c') { p.line(58, 100, 54, 116, '#3a1e10'); p.line(54, 116, 57, 130, '#3a1e10'); for (const [x, s] of [[40, 7], [70, 9], [64, 5]]) { p.tri(x - 3, 178, x + 3, 178, x, 178 - s * 1.6, '#c04ad0'); p.tri(x - 1, 178, x + 3, 178, x + 1, 178 - s, '#ff9af0'); } }
        else { for (let k = 0; k < 3; k++) P.Sprites.vineHang(p, 49 + k * 6, 128 + k * 6, 24, '#2fa84a', '#7ad860', null, r); for (const x of [34, 76]) { p.rect(x - 1, 172, 2, 6, '#2fa84a'); p.px(x, 171, '#ff5a8a'); } }
      }
    }, { up: 0.1, down: 0.15, dark: 0.5 });
  }
  { // geoda: capas de roca en techo y suelo, cristales que crecen desde la roca (nunca flotando)
    const W = 640, p = new P.Painter(W, P.H), r = P.RNG(199); p.grad(0, 0, W, P.H, ['#1a0c0a', '#3a1c14', '#4a2618', '#24100c']);
    const CR = [['#7a3a0a', '#ffb030', '#fff0b0'], ['#6a1a7a', '#ff5ad0', '#ffd0ff'], ['#0a5a6a', '#2fe0c0', '#c0fff4']];
    for (let i = 0; i < 18; i++) { const x = r.int(0, W), y = r.int(80, 190), c2 = r.pick(CR)[1]; for (let k = 0; k < 40; k++) { const a = r() * 7, d = r() * 26; p.dith(Math.round(x + Math.cos(a) * d), Math.round(y + Math.sin(a) * d * 0.6), '#3a1c14', P.Col.mix(c2, '#3a1c14', 0.7), 0.5); } }
    const top = [], bot = [];
    for (let l = 0; l < 3; l++) {
      const col = ['#2e160e', '#42200f', '#583018'][l], hi = ['#3e2014', '#5a2e1a', '#74402a'][l];
      top[l] = []; bot[l] = []; let h = 50 + l * 18, g = 40 + l * 16;
      for (let x = 0; x < W; x++) {
        h += r.range(-2.2, 2.2); h = P.clamp(h, 26 + l * 16, 90 + l * 14); g += r.range(-2, 2); g = P.clamp(g, 22 + l * 12, 70 + l * 12);
        const ht = Math.round(h - l * 14), gb = Math.round(P.H - g + l * 16);
        top[l][x] = ht; bot[l][x] = gb;
        p.rect(x, 0, 1, ht, col); p.px(x, ht - 1, hi); p.rect(x, gb, 1, P.H - gb, col); p.px(x, gb, hi);
      }
      // cristales anclados al borde de esta capa
      for (let i = 0; i < 9; i++) {
        const c2 = r.pick(CR);
        for (const down of [true, false]) {
          const x = r.int(4, W - 6), base = down ? top[l][x] - 2 : bot[l][x] + 2, s = r.int(2, 4 + l * 2), n = r.int(1, 3);
          for (let k = 0; k < n; k++) { const xx = x + (k - 1) * (s + 1), len = s * (2.4 - k * 0.5) * (k === 1 ? 1.2 : 1), dir = down ? 1 : -1;
            p.tri(xx - s / 2, base, xx + s / 2, base, xx + (k - 1) * 1.5, base + dir * len, c2[1]); p.tri(xx - s / 2, base, xx, base, xx + (k - 1) * 1.5, base + dir * len, c2[0]); p.px(xx + (k - 1), base + dir * (len - 2), c2[2]); }
        }
      }
    }
    P.mkCanvas('kz_bg_cave', [p.canvas()]); }

  // ================= FLORA =================
  for (const st of ['c', 'r']) {
    const L = K[st].leaf;
    P.mk('kz_fern_' + st, 22, 16, 2, (p, f) => { for (let i = 0; i < 9; i++) { const a = -2.9 + i * 0.33 + (f ? 0.05 : 0), Ln = 9 + (i % 3) * 2; for (let k = 0; k < Ln; k++) p.px(11 + Math.cos(a) * k, 15 + Math.sin(a) * k, k > Ln - 3 ? (st === 'r' ? '#ff5a5a' : '#c0a080') : L[1 + (k % 2)]); } });
  }
  P.mk('kz_lamp', 14, 22, 2, (p, f) => {
    p.rect(5, 6, 4, 16, '#2fa84a'); p.rect(5, 6, 1, 16, '#7ad860'); p.rect(1, 11, 4, 3, '#2fa84a'); p.rect(1, 8, 2, 4, '#2fa84a'); p.rect(9, 13, 4, 3, '#2fa84a'); p.rect(11, 10, 2, 4, '#7ad860');
    for (let y = 8; y < 21; y += 3) { p.px(9, y, '#e8ffd0'); p.px(4, y + 1, '#e8ffd0'); }
    p.sell(7, 4, 3.4, 3.6 + f * 0.4, ['#0a8aa8', '#2ae0e8', '#b0fff8', '#ffffff']); p.px(6, 2, '#ffffff');
  });
  P.mk('kz_mush', 18, 16, 2, (p, f) => {
    p.ell(9, 15, 7, 1.4, '#5a3a1a'); p.sell(9, 10 - f, 6, 5 + f * 0.5, ['#8a6a0a', '#e8c020', '#fff070', '#ffffff']);
    for (let i = 0; i < 4; i++) p.px(5 + i * 3, 9 - f + (i % 2), '#8a6a0a'); p.rect(8, 3 - f, 2, 3, '#c89a20'); p.px(8, 2 - f, '#fff8a0');
  });
  P.mk('kz_bigmush', 30, 34, 1, p => {
    for (let y = 12; y < 34; y++) { const x = 15 + Math.round(Math.sin(y * 0.15)); p.rect(x - 2, y, 4, 1, y % 4 ? '#8a6a8a' : '#5a3a5a'); p.px(x - 2, y, '#d0b0e8'); }
    for (let k = 0; k < 7; k++) { const a = -Math.PI + k * Math.PI / 6; for (let j = 0; j < 14; j++) p.px(15 + Math.cos(a) * j, 12 + Math.sin(a) * j * 0.6 + j * j * 0.02, j > 10 ? '#ffffff' : ['#3ad8e0', '#8afcff'][(j >> 1) % 2]); }
    for (const [x, y] of [[13, 14], [17, 15], [15, 17]]) p.ell(x, y, 1.6, 1.6, '#ffb030');
  });
  P.mk('kz_orchid', 14, 16, 2, (p, f) => {
    p.line(7, 15, 7, 8, '#2fa84a'); p.ell(4, 13, 3, 1.3, '#4ad050'); p.ell(10, 12, 3, 1.3, '#2fa84a');
    for (let i = 0; i < 6; i++) { const a = i * 1.047 + f * 0.25; p.ell(7 + Math.cos(a) * 3, 5 + Math.sin(a) * 2.6, 2, 1.8, i % 2 ? '#ff5a8a' : '#ff8ab0'); }
    p.ell(7, 5, 1.6, 1.6, '#ffd166'); p.px(7, 4, '#ffffff');
  });
  P.mk('kz_lily', 18, 6, 1, p => { p.ell(9, 3, 8.5, 2.3, '#2fa84a'); p.ell(8, 2.5, 6, 1.4, '#7ad860'); for (let i = 0; i < 5; i++) p.ell(11 + Math.cos(i * 1.25) * 2, 1.5 + Math.sin(i * 1.25), 1.2, 1, '#ffffff'); p.px(11, 1, '#ffd166'); });
  P.mk('kz_heal', 16, 18, 2, (p, f) => {
    for (let i = 0; i < 6; i++) { const a = -2.9 + i * 0.5; p.thick(8, 16, 8 + Math.cos(a) * 8, 16 + Math.sin(a) * 9, 2, f ? '#7a8a5a' : '#3ab86a'); p.px(8 + Math.cos(a) * 8, 16 + Math.sin(a) * 9, '#c8ffd8'); }
    if (!f) { p.sell(8, 6, 3.5, 4, ['#a06a0a', '#ffb030', '#ffe080', '#ffffff']); p.rect(7, 4, 3, 1, '#ffffff'); p.rect(8, 3, 1, 3, '#ffffff'); }
  });

  // ================= FAUNA =================
  // Escorpión de Duna: patas, pinzas grandes y cola curvada con aguijón
  const scorp = (p, f, o) => {
    const cx = o.cx, by = o.by, st = f < 4 ? f : 0, strike = f === 4;
    for (let i = 0; i < 4; i++) { const lx = cx - o.rx * 0.7 + i * o.rx * 0.45, lift = ((st + i) % 2) * 2; p.thick(lx, by - o.ry, lx - 3, by - 2 - lift, 1.4, o.c[0]); p.line(lx - 3, by - 2 - lift, lx - 4, by, o.c[0]); }
    p.sell(cx, by - o.ry - 1, o.rx, o.ry, o.c); for (let i = -2; i <= 2; i++) p.line(cx + i * o.rx * 0.32, by - o.ry * 2, cx + i * o.rx * 0.32, by - 2, o.c[0]);
    // cola segmentada
    let tx = cx - o.rx + 1, ty = by - o.ry - 1;
    const segs = 5;
    for (let k = 0; k < segs; k++) { const a = -2.4 + k * (strike ? 0.62 : 0.5); tx += Math.cos(a) * o.seg; ty += Math.sin(a) * o.seg * 1.1; p.sell(tx, ty, o.seg * 0.6, o.seg * 0.55, o.c); }
    p.tri(tx - 1, ty, tx + 4, ty - 1, tx + 3 + (strike ? 3 : 1), ty + 4, o.sting); p.px(tx + 3 + (strike ? 3 : 1), ty + 4, '#ffffff');
    // pinzas
    for (const [dy, s] of [[0, 1], [3, 0.8]]) { const ax = cx + o.rx - 2, ay = by - o.ry + dy; p.thick(ax, ay, ax + 5 * s, ay - 1, 1.6, o.c[1]); p.sell(ax + 7 * s, ay - 1, 2.6 * s, 2 * s, o.c); p.px(ax + 9 * s, ay - 2, o.c[3]); }
    p.px(cx + o.rx * 0.6, by - o.ry * 2 + 1, o.eye); p.px(cx + o.rx * 0.8, by - o.ry * 2 + 2, o.eye);
  };
  P.mk('kz_krazith', 32, 22, 5, (p, f) => scorp(p, f, { cx: 15, by: 21, rx: 8, ry: 3.5, seg: 3, c: ['#6a3a0a', '#c87a1a', '#f0b040', '#fff0a0'], sting: '#ff3a3a', eye: '#1a1a1a' }));
  P.mk('kz_krazith_cy', 34, 24, 5, (p, f) => { scorp(p, f, { cx: 16, by: 23, rx: 9, ry: 4, seg: 3.2, c: MT, sting: '#ff2040', eye: '#ff2040' }); p.rect(11, 14, 9, 3, '#3a0a14'); p.px(13, 15, '#ff3050'); p.px(17, 15, '#5ae8ff'); });
  P.mk('kz_krazith_alfa', 52, 36, 5, (p, f) => { scorp(p, f, { cx: 24, by: 35, rx: 14, ry: 6, seg: 5, c: ['#3a0a3a', '#8a2a8a', '#d060d0', '#ffd0ff'], sting: '#ffd166', eye: '#ffef3a' }); for (let i = 0; i < 3; i++) p.tri(18 + i * 6, 23, 22 + i * 6, 23, 20 + i * 6, 16 - (i === 1 ? 2 : 0), GOLD[2]); });
  // Escarabajo Bombardero (salta y escupe ácido caliente)
  P.mk('kz_frog', 20, 17, 3, (p, f) => {
    const C = ['#0a3a5a', '#1a7aa8', '#4ac8e8', '#d0f8ff'], y = f === 1 ? 7 : 9;
    for (let i = 0; i < 3; i++) p.line(6 + i * 4, y + 4, 4 + i * 4 - (f === 1 ? 2 : 0), 16, '#1a1a2a');
    p.sell(10, y, 8, 5.5, C); p.line(10, y - 5, 10, y + 4, C[0]); p.px(7, y - 3, '#ffffff'); p.px(12, y - 2, C[3]);
    p.sell(17, y + 1, 3, 2.6, ['#4a2a0a', '#c87a1a', '#f0b040']); p.px(18, y, '#1a1a1a'); p.line(19, y - 1, 21, y - 3, '#4a2a0a');
    if (f === 2) { p.ell(3, y + 2, 2.2, 2, '#ff8a3a'); p.px(2, y + 1, '#fff0a0'); }
  });
  // Buitre de Cañón y Halcón-Dron
  const bird = (p, f, B, head, eye, metal) => {
    const wy = f ? 4 : 10; p.tri(4, 8, 22, 8, 12, wy - 6, B[1]); p.tri(6, 8, 20, 8, 12, wy - 3, B[2]); for (let k = 0; k < 4; k++) p.line(6 + k * 4, 8, 7 + k * 4, wy - 4 + Math.abs(k - 1.5), B[0]);
    p.sell(12, 10, 6, 3.2, B); p.tri(4, 9, 7, 9, 1, 13, B[0]);
    p.sell(19, 8, 3, 2.6, head); p.tri(21, 8, 25, 9, 21, 10, '#ffd166'); p.px(20, 7, eye);
    if (metal) { p.rect(9, 9, 6, 2, MT[2]); p.px(11, 9, '#ff3050'); }
  };
  P.mk('kz_dfly', 26, 16, 2, (p, f) => bird(p, f, ['#4a2a1a', '#8a5a34', '#c89060', '#f0d0a0'], ['#d8a8a0', '#f0c8c0', '#ffffff'], '#1a1a1a'));
  P.mk('kz_dfly_cy', 26, 16, 2, (p, f) => bird(p, f, MT, MT, '#ff2040', true));
  // Tortuga de Arena (lenta, acorazada)
  P.mk('kz_slug', 28, 15, 2, (p, f) => {
    for (const [x, s] of [[7, 1], [19, -1]]) p.rect(x + (f ? s : 0), 10, 3, 4, '#6a5a3a');
    p.sell(13, 8, 11, 6, ['#5a3a1a', '#9a6a3a', '#d0a060', '#fff0c0']);
    for (let i = 0; i < 3; i++) { p.ell(7 + i * 6, 7, 2.5, 2, '#5a3a1a'); p.ell(7 + i * 6, 6.5, 1.6, 1.2, '#e8c070'); }
    p.sell(25 + f, 10, 3, 2.4, ['#5a6a3a', '#8a9a5a', '#c0c890']); p.px(26 + f, 9, '#1a1a1a');
  });
  // Cactus Fauces (planta carnívora mutada)
  P.mk('kz_maw', 26, 34, 3, (p, f) => {
    p.rect(10, 16, 6, 18, '#2a8a3a'); p.rect(10, 16, 2, 18, '#5ad050'); for (let y = 18; y < 33; y += 3) { p.px(9, y, '#fff0c0'); p.px(16, y + 1, '#fff0c0'); }
    p.rect(4, 22, 6, 3, '#2a8a3a'); p.rect(4, 18, 3, 5, '#2a8a3a'); p.rect(16, 24, 6, 3, '#2a8a3a'); p.rect(19, 20, 3, 5, '#5ad050');
    const open = f > 0 ? (f === 1 ? 6 : 9) : 1, hx = 13 + (f === 2 ? 3 : 0), hy = 11, T = ['#2a6a2a', '#3aa83a', '#8ae860', '#e0ffb0'];
    p.sell(hx, hy - open / 2, 9.5, 5.5, T); p.sell(hx, hy + open / 2 + 2, 9, 4.5, [T[0], T[1], T[2]]);
    for (let i = 0; i < 5; i++) p.px(hx - 6 + i * 3, hy - open / 2 - 4, '#ff5a8a');
    if (open > 2) { p.rect(hx - 8, hy - open / 2 + 3, 16, open, '#4a0a1a'); for (let i = -7; i <= 7; i += 2) { p.px(hx + i, hy - open / 2 + 3, '#ffffff'); p.px(hx + i + 1, hy + open / 2 + 2, '#ffffff'); } }
  });
  // Serpiente de Cornisa
  P.mk('kz_vsnake', 12, 34, 2, (p, f) => {
    const L = f ? 32 : 18;
    for (let y = 0; y < L; y++) { const x = 6 + Math.round(Math.sin(y * 0.5) * (f ? 1 : 2)); p.rect(x - 1, y, 3, 1, y % 4 === 0 ? '#3a2a1a' : y % 4 === 1 ? '#f0c060' : '#c8862e'); }
    const hy = L - 1, hx = 6 + Math.round(Math.sin(hy * 0.5) * (f ? 1 : 2));
    p.sell(hx, hy, 3.2, 2.8, ['#6a4a1a', '#c8862e', '#f0c060']); p.px(hx - 1, hy, '#1a1a1a'); p.px(hx + 1, hy, '#1a1a1a');
    if (f) { p.px(hx, hy + 3, '#ff3a5a'); p.px(hx - 1, hy + 4, '#ff3a5a'); p.px(hx + 1, hy + 4, '#ff3a5a'); }
  });
  // Dromotauro (herbívoro de duna, solo en territorio restaurado)
  P.mk('kz_grazer', 38, 28, 3, (p, f) => {
    const st = f === 1 ? 1 : 0, gr = f === 2, B = ['#7a4a2a', '#c08050', '#e8b080', '#fff0d8'];
    for (const [x, s] of [[10, 1], [14, -1], [25, 1], [29, -1]]) { p.thick(x, 17, x + st * s, 26, 2.5, '#6a3a1a'); p.rect(x + st * s - 1, 26, 3, 2, '#2a1a10'); }
    p.sell(19, 14, 13, 6.5, B); p.sell(16, 7, 5, 4, B); p.sell(23, 7, 4, 3.5, B);
    for (let i = 0; i < 6; i++) { p.px(10 + i * 3, 12, i % 2 ? '#3ae0c0' : '#ffd166'); }
    const hx = gr ? 34 : 33, hy = gr ? 20 : 9;
    p.thick(29, 12, hx - 2, hy + 2, 3, B[1]); p.sell(hx, hy, 4, 3.2, B); p.px(hx + 2, hy - 1, '#1a1a1a'); p.px(hx + 3, hy + 1, '#ff9a8a');
    p.line(hx - 2, hy - 3, hx - 3, hy - 6, '#f0e0c0');
    p.thick(6, 13, 2, 18, 2, B[2]); p.px(2, 19, '#2a1a10');
  });
  // Esfinge de Cristal (legendaria)
  P.mk('kz_vellorn', 40, 38, 2, (p, f) => {
    const G = ['#8a5a1a', '#e8b040', '#ffe090', '#ffffff'], C = ['#1a8a9a', '#5ae8e0', '#d0fffa'];
    for (const [x, s] of [[11, 1], [15, -1], [26, 1], [30, -1]]) { p.thick(x, 25, x + s * f, 36, 2.5, G[0]); p.rect(x + s * f - 1, 36, 4, 2, G[1]); }
    p.sell(21, 23, 13, 6.5, G); for (let i = 0; i < 5; i++) p.tri(12 + i * 4, 18, 15 + i * 4, 18, 13 + i * 4, 12 - (i % 2) * 3, C[1]);
    p.sell(33, 13, 5.5, 5, G); p.ell(33, 8, 6, 3.5, C[1]); p.ell(32, 7, 4, 2, C[2]); p.px(35, 12, '#1a2a4a'); p.px(35, 11, '#ffffff');
    for (let i = 0; i < 4; i++) p.tri(29 + i * 3, 5, 31 + i * 3, 5, 30 + i * 3, 0 - (i % 2), C[0]);
    p.thick(9, 22, 3 - f, 15, 2, G[2]); p.ell(3 - f, 14, 2, 2, C[1]);
  }, { up: 0.1 });
  // Arenícola: gusano juvenil que acecha bajo la arena
  P.mk('kz_worm', 24, 28, 4, (p, fr) => {
    const f = [3, 1, 2, 0][fr]; // 0 asomado (ficha) · 1 asoma · 2 boca abierta · 3 montículo
    const C = ['#6a2a2a', '#c86a5a', '#f0a090', '#ffe0d8'];
    p.ell(12, 26, 11, 2.5, '#c8904a'); p.ell(12, 25, 9, 1.5, '#e8b060');
    if (f === 0) { p.ell(12, 24, 6, 2.5, '#d8a058'); return; }
    const h = f === 1 ? 10 : 22, top = 26 - h;
    for (let y = top + 6; y < 26; y++) { const w = 6 + Math.sin(y * 0.6) * 0.6; p.rect(12 - w, y, w * 2, 1, (y >> 1) % 2 ? C[1] : C[2]); p.px(12 - w, y, C[0]); }
    p.sell(12, top + 5, 7, 5, C);
    if (f === 2) { p.ell(12, top + 5, 5, 3.5, '#2a0a0a'); for (let i = 0; i < 6; i++) { const a = i * 1.05; p.px(12 + Math.cos(a) * 4, top + 5 + Math.sin(a) * 3, '#fff8e0'); } }
    else { p.line(7, top + 5, 17, top + 5, C[0]); }
    p.rect(8, top + 8, 8, 1, MT[2]); p.px(12, top + 8, '#ff3050');
  });
  P.mk('kz_b_kspine', 12, 5, 1, p => { p.tri(0, 0, 0, 4, 11, 2, '#c87a1a'); p.line(0, 2, 10, 2, '#fff0a0'); p.px(11, 2, '#ff3a3a'); }, { vol: false });
  P.mk('kz_b_glob', 7, 7, 2, (p, f) => { p.ell(3.5, 3.5, 3, 3 - f * 0.5, '#ff8a3a'); p.px(2, 2, '#fff0a0'); }, { vol: false });
  P.mk('kz_b_orb', 8, 8, 2, (p, f) => { p.ell(4, 4, 3.5, 3.5, f ? '#e8b060' : '#c8904a'); p.ell(3, 3, 1.5, 1.5, '#fff0c0'); }, { outline: false });
  P.mk('kz_b_crys', 14, 6, 2, (p, f) => { p.tri(0, 1, 0, 5, 13, 3, f ? '#ffe090' : '#ffc060'); p.tri(3, 2, 3, 4, 13, 3, '#ffffff'); p.px(1, 3, '#ff8a3a'); }, { vol: false });
  // portal de templo reptiliano
  P.mk('kz_gate', 34, 46, 1, p => {
    p.rect(0, 40, 34, 6, STONE[1]); p.rect(0, 40, 34, 1, STONE[3]);
    p.grad(1, 10, 6, 30, [STONE[2], STONE[1], STONE[0]]); p.grad(27, 10, 6, 30, [STONE[2], STONE[1], STONE[0]]);
    p.rect(0, 4, 34, 7, STONE[1]); p.rect(0, 4, 34, 2, STONE[3]); p.tri(0, 4, 34, 4, 17, -2, STONE[2]);
    for (const x of [4, 30]) { p.sell(x, 13, 3.5, 3, ['#1a6a5a', TURQ, '#a0fff0', '#ffffff']); p.px(x + 1, 12, '#1a1a1a'); }
    for (let y = 18; y < 38; y += 5) { p.px(3, y, GOLD[2]); p.px(30, y, GOLD[2]); }
    p.ell(17, 7, 2.5, 2, TURQ); p.px(16, 6, '#ffffff');
  });
  // iconos de las mejoras de KHAZIR
  const ic = (n, fn) => P.mk('i_' + n, 10, 10, 1, fn, { outline: '#05050a', vol: false });
  ic('claw', p => { for (let i = 0; i < 3; i++) { p.line(2 + i * 3, 9, 3 + i * 3, 2, '#e8d8a8'); p.px(3 + i * 3, 1, '#ffffff'); } p.rect(1, 8, 8, 2, '#c8862e'); });
  ic('sand', p => { p.tri(0, 3, 0, 7, 9, 5, '#ffc060'); p.tri(2, 4, 2, 6, 9, 5, '#ffffff'); });
  ic('scale', p => { for (let y = 0; y < 3; y++) for (let x = 0; x < 3 - (y % 2); x++) p.ell(2 + x * 3 + (y % 2) * 1.5, 2 + y * 3, 1.6, 1.6, y % 2 ? '#3ab86a' : '#5ad08a'); });
  ic('quake', p => { p.rect(0, 8, 10, 2, '#c8862e'); p.line(1, 7, 4, 2, '#ffd166'); p.line(4, 2, 6, 6, '#ffd166'); p.line(6, 6, 9, 1, '#ffd166'); });

  // ================= PERSONAJES =================
  P.Sprites.registerLook('varkh', Object.assign({}, P.CIV.reptiliano, { skin: '#3ab06a', skinD: '#1a6a3a', hair: '#ffd166', hairD: '#c88a1a', cloth: '#e8e0c8', clothD: '#a8987a', acc: '#2ad8c0', h: 22, mark: '#2ad8c0' }));
  P.Sprites.registerLook('zul', Object.assign({}, P.CIV.reptiliano, { skin: '#6a8a3a', skinD: '#3a5a1a', hair: '#ff6a2a', hairD: '#a83a10', cloth: '#5a3a2a', clothD: '#3a2418', acc: '#ffb030', h: 23 }));

  // ================= MAPA EXTERIOR =================
  for (const st of ['c', 'r']) {
    const pal = K[st], T = pal.top;
    P.mk('kz_o_grass_' + st, 16, 16, 3, (p, v) => {
      const r = P.RNG(700 + v + (st === 'c' ? 9 : 0)); p.rect(0, 0, 16, 16, T[1]);
      for (let y = 0; y < 16; y += 4) for (let x = 0; x < 16; x++) if (Math.sin((x + y * 2 + v * 3) * 0.6) > 0.6) p.px(x, y + 1, T[2]);
      for (let i = 0; i < 6; i++) p.px(r.int(0, 15), r.int(0, 15), T[0]);
      if (v === 2) { if (st === 'r') { p.px(5, 6, '#2fa84a'); p.px(6, 5, '#7ad860'); p.px(11, 11, '#ff5a8a'); } else { p.tri(5, 9, 8, 9, 6, 4, pal.vein); } }
    }, { outline: false });
    // meseta vista desde arriba: 0 cima · 1 pared sur con estratos · 2 cima con borde norte iluminado
    P.mk('kz_o_cliff_' + st, 16, 16, 3, (p, v) => {
      const R0 = st === 'c' ? ['#4a2228', '#6a3238', '#8a4a44', '#b06a5a'] : ['#7a4a2a', '#a86a3a', '#d0904a', '#f0c070'], r = P.RNG(880 + v);
      if (v === 1) { for (let y = 0; y < 16; y++) p.rect(0, y, 16, 1, y < 3 ? R0[2] : (y >> 2) % 2 ? R0[1] : R0[0]); p.rect(0, 0, 16, 1, R0[3]); for (let i = 0; i < 4; i++) p.px(r.int(0, 15), r.int(4, 14), R0[0]); p.rect(0, 14, 16, 2, 'rgba(0,0,0,0)'); return; }
      p.rect(0, 0, 16, 16, R0[2]); for (let i = 0; i < 8; i++) p.px(r.int(0, 15), r.int(0, 15), i % 2 ? R0[1] : R0[3]); if (v === 2) { p.rect(0, 0, 16, 2, R0[3]); p.rect(0, 2, 16, 1, R0[1]); }
      if (st === 'r' && v === 0) { p.px(5, 6, '#2fa84a'); p.px(11, 10, '#7ad860'); }
    }, { outline: false });
    P.mk('kz_o_water_' + st, 16, 16, 2, (p, f) => { p.grad(0, 0, 16, 16, st === 'c' ? [pal.liq[1], pal.liq[0]] : [pal.liq[2], pal.liq[1]]); for (let i = 0; i < 4; i++) p.rect((i * 5 + f * 3) % 14, (i * 4 + 2) % 16, 3, 1, pal.liq[3]); }, { outline: false });
    P.mk('kz_o_tree_' + st, 34, 42, 2, (p, f) => P.Sprites.kzUmbra(p, 17, 41, 0.235, st, f));
  }
  P.mk('kz_o_stone', 16, 16, 1, p => { p.rect(0, 0, 16, 16, STONE[2]); p.rect(0, 0, 16, 1, STONE[3]); p.rect(0, 8, 16, 1, STONE[1]); p.rect(8, 0, 1, 8, STONE[1]); p.rect(4, 8, 1, 8, STONE[1]); p.px(12, 3, TURQ); p.px(2, 12, GOLD[2]); }, { outline: false });
  P.mk('kz_o_goo', 16, 16, 2, (p, f) => { p.ell(8, 11, 6, 3, '#5a2a4a'); p.tri(4, 12, 8, 12, 6, 2 + f, '#ff5ad0'); p.tri(8, 12, 12, 12, 10, 5, '#a04ad0'); p.px(6, 5 + f, '#ffffff'); }, { outline: false });
  P.mk('kz_o_lamp', 10, 16, 2, (p, f) => { p.rect(4, 6, 2, 10, '#2fa84a'); p.sell(5, 4, 3.4, 3.5 + f * 0.3, ['#0a8aa8', '#2ae0e8', '#b0fff8', '#ffffff']); });
  P.mk('kz_o_rock', 16, 16, 1, p => { p.sell(8, 9, 7, 6, [STONE[0], STONE[1], STONE[2], STONE[3]]); p.line(2, 9, 14, 9, STONE[0]); });
  P.mk('kz_o_pillar', 14, 30, 2, (p, f) => { if (f) { p.grad(3, 18, 8, 12, [STONE[2], STONE[1]]); p.tri(3, 18, 8, 18, 4, 13, STONE[1]); } else { p.grad(3, 6, 8, 24, [STONE[2], STONE[1], STONE[0]]); p.tri(3, 6, 11, 6, 7, 0, STONE[2]); p.px(7, 12, TURQ); p.px(7, 18, GOLD[2]); } });
  P.mk('kz_o_house', 44, 38, 2, (p, f) => {
    if (!f) { p.rect(6, 22, 32, 14, STONE[0]); p.tri(6, 22, 16, 12, 22, 22, STONE[1]); p.rect(14, 28, 6, 8, '#1a0a0a'); p.tri(26, 36, 32, 36, 29, 26, '#ff5ad0'); return; }
    p.rect(6, 20, 32, 16, SAND[2]); p.rect(6, 20, 2, 16, SAND[1]); p.sell(22, 20, 16, 11, [STONE[1], STONE[2], SAND[2], SAND[3]]);
    p.rect(18, 26, 8, 10, '#5a3418'); p.rect(19, 27, 6, 9, TURQ); p.rect(9, 25, 5, 4, '#2a1a10'); p.rect(30, 25, 5, 4, '#2a1a10'); p.px(22, 9, GOLD[2]);
    p.rect(3, 33, 4, 3, '#2fa84a'); p.px(4, 32, '#ff5a8a'); p.rect(37, 33, 4, 3, '#2fa84a');
  });
  P.mk('kz_o_flower', 8, 8, 3, (p, v) => { const c2 = ['#ff5a8a', '#ffd166', '#ff8a3a'][v]; p.line(4, 7, 4, 4, '#2fa84a'); p.ell(4, 3, 2, 2, c2); p.px(4, 3, '#ffffff'); });
  P.mk('kz_o_path', 16, 16, 2, (p, v) => { const r = P.RNG(820 + v); p.rect(0, 0, 16, 16, '#b8784a'); for (let i = 0; i < 12; i++) p.px(r.int(0, 15), r.int(0, 15), r() < 0.5 ? '#d89a60' : '#8a5a36'); }, { outline: false });

  // ================= ZARMAKH =================
  P.Sprites.buildZarmakh();
};

// encadenar la construcción del arte de KHAZIR después de la de VÉRZARA
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildKhazir(); }; })();
