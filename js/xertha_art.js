'use strict';
// XÉRTHA — La Gran Colmena Hexagonal: arte del planeta (prefijo «xe_»).
// Un mundo colmena vivo: cera, resina, quitina y miel; árboles-panal que gotean, ríos de miel, cristales de ámbar
// y colmenas del tamaño de montañas. Contaminado: cera seca gris-parda y miel rancia. Restaurado: ámbar, oro,
// naranja biológico, con luces verde ácido y turquesa.
P.PAL.xertha = {
  c: { soil: ['#140e08', '#221810', '#33251a', '#463424'], vein: '#6a5a3a', top: ['#2a2218', '#3e3424', '#564830', '#6e5e40'],
    liq: ['#100a04', '#2a1a08', '#4a3010', '#8a6a3a'], thorn: ['#2a2016', '#4a3a26', '#6a5838', '#9a8a60'],
    leaf: ['#2a2418', '#3e3424', '#5a4a30', '#7a6440'], trunk: ['#1e1a12', '#2e281c', '#463c28'], glow: '#8a7a4a', flower: ['#7a6a3a', '#8a7a4a', '#5a4a2a'] },
  r: { soil: ['#3a1e06', '#5a2e0a', '#7a4410', '#a0601a'], vein: '#ffd060', top: ['#a06010', '#e0a020', '#ffd050', '#fff0a0'],
    liq: ['#7a3a04', '#d07a10', '#ffb020', '#fff0a0'], thorn: ['#2a1a0a', '#5a3a14', '#8a5a20', '#e0b060'],
    leaf: ['#6a3a0a', '#c08020', '#ffc040', '#fff0b0'], trunk: ['#3a2008', '#6a3a10', '#9a5a1a'], glow: '#ffd060', flower: ['#ffe080', '#a8ff3a', '#3ae0d0', '#ffffff'] }
};
P.XEC = { amb: ['#7a3a04', '#c07010', '#ffb020', '#ffe080', '#fff8d0'], wax: ['#5a2e0a', '#8a4a10', '#c07a1a', '#f0b040'], chit: ['#1a1008', '#3a2410', '#6a4418', '#a87a30'], acid: ['#2a5a0a', '#5aa01a', '#a8ff3a', '#e8ffb0'], tq: ['#0a4a4a', '#1aa0a0', '#3ae0d0', '#c8fff8'], red: ['#5a1a08', '#a0301a', '#e05a2a', '#ffa070'], grey: ['#2a2218', '#3e3424', '#564830', '#6e5e40'] };
P.SKIES_X = {
  day: { r: ['#3ab0a0', '#8ad8b8', '#d8f0c0', '#fff0c0', '#ffe0a0'], c: ['#4a4a40', '#5a5848', '#6a6450', '#7a7058', '#8a7a60'] },
  golden: { r: ['#5a7aa0', '#c0a080', '#ffc070', '#ffa040', '#ff8a30'], c: ['#3a3630', '#4a4438', '#5a5040', '#6a5a46', '#7a644a'] },
  dusk: { r: ['#0a1a2a', '#1a2a3a', '#4a3a3a', '#8a4a2a', '#c06a20'], c: ['#0e0c0a', '#1a1612', '#26201a', '#322a20', '#3e3426'] }
};
P.HERO_SKINS.colmena = { name: 'Armadura Colmena', d: '#3a2008', m: '#c07010', l: '#ffd050', h: '#fff4c0', j: '#1a0e04', e: '#ffffff', eg: '#3ae0d0', acc: '#a8ff3a', w: '#fffbe8' };
P.SUIT_STYLE = P.SUIT_STYLE || {}; P.SUIT_STYLE.colmena = 'hive';
P.ART = P.ART || {};
P.ART.xertha = {
  p: 'xe_', skies: P.SKIES_X, owMusic: 'xertha_ow',
  owAmb: lf => 'rgba(30,14,2,' + (0.26 - lf * 0.16) + ')',
  flora: { L: 'farol_nectar', F: 'antenaria', m: 'capsula_polen', U: 'arbol_panal', h: 'jalea_real', y: 'flor_hexagonal', lily: 'flor_miel', g: 'pacipodo', legend: 'leviatan_cera' },
  tileFlora: { b: 'vejiga_nectar', '|': 'hilo_cera', '^': 'espina_quitina' }
};

// celda hexagonal (relleno + borde)
P.Sprites.xeHex = function (p, cx, cy, r, fill, rim, hi) {
  for (let y = -r; y <= r; y++) { const w = r * 1.15 - Math.abs(y) * 0.58; for (let x = -w; x <= w; x++) p.px(cx + x, cy + y, Math.abs(y) >= r - 0.5 || Math.abs(x) >= w - 0.8 ? rim : fill); }
  if (hi) p.px(cx - r * 0.4, cy - r * 0.4, hi);
};
// masa de panal (elipse rellena de celdas hexagonales con brillo arriba a la izquierda)
P.Sprites.xeComb = function (p, x, y, rx, ry, C, o = {}) {
  p.sell(x, y, rx, ry, [C[0], C[1], C[2], C[3]]);
  const r = o.cell || 3, dx = r * 2.1, dy = r * 1.8;
  for (let yy = -ry; yy <= ry; yy += dy) for (let xx = -rx; xx <= rx; xx += dx) { const ox = xx + ((Math.round((yy + ry) / dy)) % 2 ? dx / 2 : 0); if ((ox * ox) / (rx * rx) + (yy * yy) / (ry * ry) > 0.8) continue; const lit = (-ox / rx - yy / ry) * 0.5 + 0.5; p.px(x + ox, y + yy, lit > 0.6 ? C[3] : C[0]); p.px(x + ox + 1, y + yy, lit > 0.6 ? C[2] : C[1]); }
  if (o.drips) for (let k = 0; k < o.drips; k++) { const ax = x - rx * 0.8 + (k + 0.5) * (rx * 1.6 / o.drips), dl = 3 + ((k * 7) % 8); for (let j = 0; j < dl; j++) p.px(ax, y + ry * 0.7 + j, j === dl - 1 ? C[3] : C[2]); p.px(ax + 1, y + ry * 0.7, C[2]); }
};
// cristal de ámbar
P.Sprites.xeAmber = function (p, x, y, w, h, C, lean = 0) { if (P.Sprites.umCrystal) P.Sprites.umCrystal(p, x, y, w, h, C, lean); };

P.Sprites.buildXertha = function () {
  const K = P.PAL.xertha, X = P.XEC;
  for (const st of ['c', 'r']) {
    const pal = K[st], s = pal.soil, t = pal.top, on = st === 'r', W = on ? X.wax : X.grey, A = on ? X.amb : X.grey;
    // panal de cera (celdas hexagonales; v1 con miel brillante, v2 con huevos)
    P.mk('xe_t_soil_' + st, 16, 16, 3, (p, v) => { p.rect(0, 0, 16, 16, s[0]); for (const [cx, cy] of [[3, 3], [11, 3], [7, 8], [15, 8], [-1, 8], [3, 13], [11, 13]]) P.Sprites.xeHex(p, cx, cy, 3, v === 1 && (cx + cy) % 2 ? (on ? '#ffb020' : s[2]) : s[1], s[2], on && v === 1 ? '#fff0a0' : null); if (v === 2) { p.ell(7, 8, 1.4, 1.8, on ? '#f8f0e0' : s[3]); p.px(7, 7, '#ffffff'); } }, { outline: false });
    P.mk('xe_t_top_' + st, 16, 9, 3, (p, v) => { const r = P.RNG(1700 + v + (on ? 9 : 0)); p.rect(0, 3, 16, 4, t[1]); p.rect(0, 3, 16, 1, t[2]); p.rect(0, 6, 16, 1, t[0]); for (let x = 0; x < 16; x += 4) p.px(x + v, 2, t[3]); const n = 1 + v % 2; for (let k = 0; k < n; k++) { const x = r.int(1, 14), l = r.int(2, 5); for (let y = 0; y < l; y++) p.px(x, 7 + y, y === l - 1 ? t[3] : t[2]); } }, { outline: false });
    P.mk('xe_t_bot_' + st, 16, 7, 2, (p, v) => { const r = P.RNG(1720 + v); for (let k = 0; k < 3; k++) { const x = r.int(1, 14), l = r.int(2, 6); for (let y = 0; y < l; y++) p.px(x, y, y === l - 1 ? A[3] : A[2]); } });
    P.mk('xe_tdeco_' + st, 16, 14, 6, (p, v) => {
      if (v === 0) { for (let k = 0; k < 3; k++) { const x = 4 + k * 4; p.line(x, 13, x + (k - 1), 6 - k, on ? X.chit[2] : W[2]); p.px(x + (k - 1), 5 - k, on ? X.acid[2] : W[3]); } }
      if (v === 1) { for (let k = 0; k < 4; k++) p.ell(4 + k * 3, 11 - (k % 2), 1.4, 1.8, on ? '#f8f0e0' : W[2]); }
      if (v === 2) { p.ell(8, 12, 4, 2, A[1]); p.ell(7, 11, 2, 1, A[3]); }
      if (v === 3) { p.tri(4, 13, 8, 13, 5, 6, on ? X.chit[1] : W[1]); p.tri(8, 13, 12, 13, 11, 8, on ? X.chit[2] : W[2]); }
      if (v === 4) { for (let k = 0; k < 3; k++) { const x = 4 + k * 4; p.line(x, 13, x, 9, on ? X.acid[1] : W[1]); p.ell(x, 8, 1.4, 1.4, on ? X.tq[2] : W[3]); } }
      if (v === 5) { P.Sprites.xeHex(p, 8, 10, 3, A[1], A[0], A[3]); }
    });
    // miel (espesa, brillos lentos)
    const lq = pal.liq;
    P.mk('xe_t_liq_' + st, 16, 16, 4, (p, f) => { for (let x = 0; x < 16; x++) { const h = Math.round(2 + Math.sin((x + f * 2) * 0.25) * 0.8); for (let y = h; y < 16; y++) p.dith(x, y, y < h + 5 ? lq[2] : lq[1], lq[1], y < h + 5 ? (y - h) / 5 : 0); p.px(x, h, lq[3]); } p.rect((f * 4) % 12, 4, 3, 1, lq[3]); p.px((f * 4 + 7) % 16, 9, lq[3]); }, { outline: false });
    P.mk('xe_t_liqb_' + st, 16, 16, 4, (p, f) => { p.grad(0, 0, 16, 16, [lq[1], P.Col.mix(lq[1], lq[0], 0.5)]); for (let i = 0; i < 3; i++) p.ell((i * 6 + f) % 16, (i * 5 + f * 2) % 16, 1, 1, lq[2]); }, { outline: false });
    // espinas de quitina
    P.mk('xe_t_thorn_' + st, 16, 16, 2, (p, f) => { p.ell(8, 14, 8, 2.5, s[2]); for (let i = 0; i < 5; i++) { const x = 2 + i * 3 + f, h = 6 + (i % 2) * 5; p.tri(x - 1.5, 14, x + 1.5, 14, x + (i % 2 ? 1 : -1), 14 - h, pal.thorn[1]); p.line(x, 13, x + (i % 2 ? 1 : -1), 14 - h, pal.thorn[2]); p.px(x + (i % 2 ? 1 : -1), 14 - h, pal.thorn[3]); } });
    // hilo de cera trepable
    P.mk('xe_t_vine_' + st, 16, 16, 2, (p, v) => { for (let y = 0; y < 16; y++) { const x = 8 + Math.round(Math.sin((y + v * 8) * 0.35)); p.px(x, y, W[2]); p.px(x + 1, y, W[1]); if (y % 5 === 2) p.ell(x, y, 1.2, 1, A[2]); } });
    // puente de panal (un sentido)
    P.mk('xe_t_branch_' + st, 16, 8, 2, (p, v) => { for (let x = 1; x < 16; x += 5) P.Sprites.xeHex(p, x + v, 4, 2.6, W[1], W[0], W[3]); p.line(0, 2, 15, 2, W[3]); for (let x = 3 + v * 2; x < 16; x += 7) { p.px(x, 7, A[2]); p.px(x, 8, A[3]); } });
    // vejiga de néctar (rebote)
    P.mk('xe_t_bulb_' + st, 16, 16, 3, (p, f) => { const sq = [0, 3, 1][f]; p.sell(8, 11 + sq * 0.5, 6.5 + sq * 0.5, 4.5 - sq * 0.6, on ? [X.amb[0], X.amb[1], X.amb[2], X.amb[4]] : [W[0], W[1], W[2], W[3]]); p.ell(6, 9 + sq * 0.5, 1.6, 1, '#ffffff'); p.rect(4, 15, 8, 1, s[2]); });
  }
  // arquitectura de colmena: muros de cera hexagonal con celdas encendidas
  P.mk('xe_t_ruin', 16, 16, 3, (p, v) => { p.rect(0, 0, 16, 16, '#5a2e0a'); for (const [cx, cy] of [[3, 3], [11, 3], [7, 8], [15, 8], [-1, 8], [3, 13], [11, 13]]) P.Sprites.xeHex(p, cx, cy, 3, (cx + cy + v) % 5 === 0 ? '#ffd060' : '#8a4a10', '#3a1e06', null); }, { outline: false });
  P.mk('xe_t_ruintop', 16, 6, 1, p => { p.rect(0, 2, 16, 2, '#c07a1a'); p.rect(0, 2, 16, 1, '#f0b040'); for (let x = 1; x < 16; x += 4) p.px(x, 3, '#3ae0d0'); }, { outline: false });
  P.mk('xe_t_crack', 16, 16, 1, p => { p.rect(0, 0, 16, 16, '#6a5a3a'); for (const [cx, cy] of [[4, 4], [12, 4], [8, 10], [3, 14], [13, 14]]) P.Sprites.xeHex(p, cx, cy, 3, '#8a7a50', '#4a3a20', null); p.line(2, 1, 9, 9, '#2a1a08'); p.line(9, 9, 6, 15, '#2a1a08'); }, { outline: false });
  // resina pegajosa (frena): ámbar brillante con burbujas y gotas
  P.mk('xe_t_unstable', 16, 16, 3, (p, f) => { p.grad(0, 0, 16, 16, ['#ffc040', '#d08010', '#8a4a08']); p.rect(0, 0, 16, 2, '#ffe080'); p.rect(0, 0, 16, 1, '#fff8d0'); for (const [x, y] of [[4, 6], [11, 9], [7, 12]]) { p.ell(x, y + (f === 1 && x === 4 ? -1 : 0), 1.2, 1.2, '#ffe8a0'); p.px(x - 1, y - 1, '#ffffff'); } if (f === 2) { p.px(5, 0, '#fff8d0'); p.px(12, 0, '#fff8d0'); } }, { outline: false });
  // tapón de cera (puerta orgánica que se abre con energía biológica)
  P.mk('xe_t_gate', 16, 16, 2, (p, f) => { p.rect(0, 0, 16, 16, '#3a1e06'); P.Sprites.xeHex(p, 8, 8, 6, f ? '#c07a1a' : '#a06010', '#5a2e0a', '#ffe080'); p.ell(8, 8, 2, 2, f ? '#3ae0d0' : '#1aa0a0'); }, { outline: false });
  // plataforma de panal que se contrae y se expande (f1 = contraída)
  P.mk('xe_t_phase', 16, 8, 2, (p, f) => { if (f) { for (let x = 2; x < 16; x += 5) p.px(x, 4, '#c07a1a'); return; } for (let x = 1; x < 16; x += 5) P.Sprites.xeHex(p, x, 4, 2.8, '#e0a020', '#7a3a04', '#fff0a0'); p.line(0, 1, 15, 1, '#ffd060'); });

  // ================= FONDOS (según la referencia: valle de miel bajo un cielo turquesa) =================
  const bgSky = (st, sky) => {
    const SK = P.SKIES_X[sky], p = new P.Painter(P.W, P.H), r = P.RNG(st === 'c' ? 1801 : 1802); p.grad(0, 0, P.W, P.H, SK[st]);
    const on = st === 'r', CL = on ? ['#fff8e8', '#ffe8c0', '#e8c890'] : ['#8a8270', '#6a6454', '#4a4638'];
    for (let i = 0; i < 6; i++) { const w = r.int(56, 120); P.paintCloud(p, r.int(0, P.W), r.int(36, 124), w, Math.round(w * 0.32), [CL[0], CL[1], CL[2]], r, { lit: 'top' }); }
    for (let i = 0; i < 20; i++) { const x = r.int(4, P.W - 4), y = r.int(4, 150); p.px(x, y, on ? '#fff8d0' : '#9a9080'); if (i % 3 === 0) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) p.px(x + dx, y + dy, on ? '#ffe080' : '#7a7060'); }
    const c = p.canvas(), x = c.getContext('2d'), mx = sky === 'golden' ? 110 : 360, my = sky === 'golden' ? 80 : 40;
    x.globalCompositeOperation = 'lighter'; const g = x.createRadialGradient(mx, my, 6, mx, my, 90); g.addColorStop(0, on ? 'rgba(255,240,180,0.6)' : 'rgba(160,150,120,0.3)'); g.addColorStop(1, 'rgba(255,200,100,0)'); x.fillStyle = g; x.fillRect(mx - 90, my - 90, 180, 180); x.globalCompositeOperation = 'source-over';
    x.fillStyle = on ? '#fff8e0' : '#c8c0a8'; x.beginPath(); x.arc(mx, my, 13, 0, 7); x.fill();
    return c;
  };
  for (const sky in P.SKIES_X) for (const st of ['c', 'r']) P.mkCanvas('xe_bg_sky_' + st + '_' + sky, [bgSky(st, sky)]);
  for (const st of ['c', 'r']) {
    const on = st === 'r', dim = c2 => on ? c2 : P.Col.mix(c2, '#4a4438', 0.72), D = A => A.map(dim);
    // lejos: colmenas-montaña con picos y celdas encendidas
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(on ? 1812 : 1811);
      for (let i = 0; i < 5; i++) { const x = 60 + i * 130 + r.int(-20, 20), h = r.int(70, 130), w = r.int(50, 80); for (let y = 0; y < h; y++) { const ww = w * (1 - y / h) ** 0.8; p.rect(Math.round(x - ww), Math.round(P.H - 40 - y), Math.round(ww * 2), 1, dim(['#c89860', '#b88450', '#d8a870'][(y >> 3) % 3])); } for (let k = 0; k < 8; k++) { const yy = P.H - 50 - r.int(0, h - 20), xx = x + r.int(-w / 2, w / 2); P.Sprites.xeHex(p, xx, yy, 2, dim(on ? '#ffe080' : '#8a7a50'), dim('#8a5a20'), null); } }
      for (let x = 0; x < W; x++) p.rect(x, P.H - 42 + Math.round(Math.sin(x * 0.03) * 3), 1, 42, dim('#c8a060'));
      P.mkCanvas('xe_bg_far_' + st, [p.canvas()]); }
    // medio: árboles-panal que gotean miel, cristales de ámbar y torres de cera
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(on ? 1822 : 1821);
      for (let i = 0; i < 9; i++) { const x = 30 + i * 72 + r.int(-14, 14), h = r.int(30, 60), rr = r.int(14, 24); for (let y = 0; y < h; y++) p.rect(Math.round(x - 3 + Math.sin(y * 0.1) * 2), P.H - 30 - y, 6, 1, dim(['#8a5020', '#a06030'][(y >> 2) % 2])); P.Sprites.xeComb(p, x, P.H - 30 - h - rr * 0.5, rr, rr * 0.75, D(P.XEC.amb), { drips: on ? 5 : 0, cell: 3 }); }
      for (let i = 0; i < 6; i++) P.Sprites.xeAmber(p, r.int(0, W), P.H - 26, r.int(6, 12), r.int(14, 30), D(['#a06010', '#e0a020', '#ffe080', '#ffffff']), r.range(-0.15, 0.15));
      for (let x = 0; x < W; x++) { const y = P.H - 28 + Math.round(Math.sin(x * 0.04) * 3); p.rect(x, y, 1, P.H - y, dim('#8a5010')); p.px(x, y, dim('#ffc040')); }
      P.mkCanvas('xe_bg_mid_' + st, [p.canvas()]); }
    // cerca: río de miel y rocas-panal redondeadas
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(on ? 1832 : 1831);
      for (let x = 0; x < W; x++) { const y = Math.round(P.H - 16 + Math.sin(x * 0.05) * 3); p.rect(x, y, 1, P.H - y, dim('#d08010')); p.px(x, y, dim('#ffe080')); if (x % 9 === 0) p.px(x, y + 4, dim('#fff0a0')); }
      for (let i = 0; i < 16; i++) P.Sprites.xeComb(p, r.int(0, W), P.H - 10, r.int(8, 14), r.int(6, 10), D(['#6a3a0a', '#a0601a', '#d89040', '#ffd080']), { cell: 2 });
      P.mkCanvas('xe_bg_near_' + st, [p.canvas()]); }
    // árboles gigantes: árbol-panal que gotea miel (v0) y torre de cera con ventanas (v1, rígido)
    P.mk('xe_bigtree_' + st, 110, 190, 2, (p, v) => {
      if (v === 0) { for (let y = 0; y < 120; y++) { const w = 7 - y / 40 + (y < 6 ? 3 : 0), sx = 55 + Math.sin(y * 0.04) * 6; p.rect(Math.round(sx - w), 188 - y, Math.round(w * 2), 1, dim(['#6a3a10', '#8a5020', '#a06030'][(y >> 3) % 3])); } for (const [x, y, rx] of [[55, 56, 34], [30, 78, 20], [82, 74, 22]]) P.Sprites.xeComb(p, x, y, rx, rx * 0.78, D(P.XEC.amb), { drips: on ? 7 : 2, cell: 3 }); return; }
      for (let y = 0; y < 170; y++) { const w = 14 - y / 16; p.rect(Math.round(55 - w), 188 - y, Math.round(w * 2), 1, dim(['#a06010', '#c07a1a'][(y >> 4) % 2])); if (y % 16 === 0) p.line(55 - w, 188 - y, 55 + w, 188 - y, dim('#5a2e0a')); }
      for (let k = 0; k < 6; k++) P.Sprites.xeHex(p, 55 + (k % 2 ? 5 : -5), 160 - k * 24, 3, on ? '#3ae0d0' : dim('#6a5a3a'), dim('#5a2e0a'), on ? '#c8fff8' : null);
      P.Sprites.xeComb(p, 55, 22, 12, 9, D(P.XEC.amb), {});
    }, { up: 0.1, down: 0.15, dark: 0.5 });
  }
  // interior de colmena: paredes de celdas con luz interna
  { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(1841); p.grad(0, 0, W, P.H, ['#1a0e04', '#2a1606', '#1e1004', '#0e0802']);
    for (let y = 6; y < P.H; y += 11) for (let x = (y % 22 ? 6 : 0); x < W; x += 13) { const lit = r() < 0.07; P.Sprites.xeHex(p, x, y, 5, lit ? '#e09020' : '#2e1a08', '#120a02', lit ? '#fff0a0' : null); }
    P.mkCanvas('xe_bg_cave', [p.canvas()]); }

  // ================= FLORA =================
  for (const st of ['c', 'r']) { const on = st === 'r', G = P.XEC.grey;
    // ANTENARIA: ramas articuladas como antenas que se agitan
    P.mk('xe_fern_' + st, 22, 16, 2, (p, f) => { for (let k = 0; k < 4; k++) { const a = -Math.PI / 2 + (k - 1.5) * 0.4 + (f ? 0.08 : -0.04); let x = 11, y = 15; for (let j = 0; j < 4; j++) { const nx = x + Math.cos(a + j * 0.25 * (k % 2 ? 1 : -1)) * 3, ny = y + Math.sin(a) * 3; p.line(x, y, nx, ny, on ? P.XEC.chit[2] : G[2]); x = nx; y = ny; } p.px(x, y, on ? P.XEC.acid[2] : G[3]); } });
  }
  P.mk('xe_lamp', 14, 22, 2, (p, f) => { p.line(7, 21, 7, 10, '#6a3a10'); p.sell(7, 7, 4, 5 + f * 0.5, ['#7a3a04', '#ffb020', '#ffe080', '#ffffff']); p.px(6, 5, '#ffffff'); p.px(7, 13, '#ffb020'); });
  P.mk('xe_mush', 18, 16, 2, (p, f) => { p.sell(9, 10 - f, 6, 5 + f, ['#5a5a0a', '#a0a01a', '#e0e040', '#ffffa0']); for (let k = 0; k < 4; k++) p.px(5 + k * 2.5, 8 - f, '#fff8a0'); p.rect(8, 14, 2, 2, '#6a3a10'); });
  P.mk('xe_bigmush', 30, 34, 1, p => { for (let y = 0; y < 18; y++) p.rect(14, 33 - y, 3, 1, '#6a3a10'); P.Sprites.xeComb(p, 15, 12, 12, 9, P.XEC.amb, { drips: 4, cell: 2 }); });
  P.mk('xe_orchid', 14, 16, 2, (p, f) => { p.line(7, 15, 7, 8, '#5aa01a'); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + f * 0.2; P.Sprites.xeHex(p, 7 + Math.cos(a) * 3.6, 6 + Math.sin(a) * 3.2, 1.6, k % 2 ? '#ffe080' : '#3ae0d0', '#a06010', null); } p.px(7, 6, '#ffffff'); });
  P.mk('xe_lily', 18, 6, 1, p => { p.ell(9, 4, 7, 1.6, '#c07010'); P.Sprites.xeHex(p, 9, 3, 2, '#ffe080', '#a06010', '#ffffff'); });
  P.mk('xe_heal', 16, 18, 2, (p, f) => { p.line(8, 17, 8, 9, '#6a3a10'); for (const [x, y] of [[5, 9], [11, 8], [8, 5]]) { p.sell(x, y - f, 2.6, 2.6, ['#c06aa0', '#ff9ad8', '#ffe0f0', '#ffffff']); } });

  // ================= FAUNA (anatomías alienígenas, no insectos terrestres) =================
  // QUITINÓPODO: caparazón en domo con ojos en pedúnculos y seis patas articuladas
  const crawl = (p, f, cy2) => { const ph = f === 4 ? 0 : f; for (let k = 0; k < 3; k++) { const lx = 9 + k * 6, sw = Math.sin((ph + k) * 1.57) * 2; p.line(lx, 15, lx - 3 + sw, 18, P.XEC.chit[1]); p.line(lx - 3 + sw, 18, lx - 2 + sw, 21, P.XEC.chit[0]); } p.sell(15, 13, 11, 6, cy2 ? ['#2a2a3a', '#4a4a5a', '#6a6a7a', '#9a9aaa'] : P.XEC.chit); for (let k = 0; k < 3; k++) P.Sprites.xeHex(p, 9 + k * 6, 11, 2, cy2 ? '#3a4258' : '#c07a1a', cy2 ? '#1e2232' : '#3a2410', null); for (const [x, h] of [[23, 6], [27, 4]]) { p.line(x, 12, x + 1, 12 - h, P.XEC.chit[2]); p.ell(x + 1, 12 - h, 1.4, 1.4, cy2 ? '#ff3050' : '#3ae0d0'); } if (f === 4) p.line(26, 14, 30, 15, '#ffe080'); };
  P.mk('xe_krazith', 32, 22, 5, (p, f) => crawl(p, f, false));
  P.mk('xe_krazith_cy', 34, 24, 5, (p, f) => { crawl(p, f, true); p.rect(8, 6, 14, 3, '#3a4258'); p.rect(8, 6, 14, 1, '#7a86a4'); });
  // ACORAZADO MELÍFERO: mole con caparazón de placas, cuernos y un depósito de miel en el lomo
  P.mk('xe_krazith_alfa', 52, 36, 5, (p, f) => { const ph = f === 4 ? 0 : f; for (let k = 0; k < 4; k++) { const lx = 12 + k * 9, sw = Math.sin((ph + k) * 1.57) * 3; p.thick(lx, 26, lx + sw, 35, 3, P.XEC.chit[0]); } p.sell(26, 22, 22, 11, P.XEC.chit); for (let k = 0; k < 5; k++) p.line(10 + k * 8, 13, 12 + k * 8, 31, P.XEC.chit[0]); P.Sprites.xeComb(p, 22, 11, 10, 6, P.XEC.amb, { cell: 2 }); p.tri(44, 18, 52, 12, 47, 22, P.XEC.chit[3]); p.tri(42, 22, 51, 26, 44, 26, P.XEC.chit[3]); p.ell(43, 21, 2, 2, f === 4 ? '#ff3050' : '#a8ff3a'); });
  // SALTÁMBAR: saltador ágil de patas traseras enormes y cuerpo de ámbar translúcido
  P.mk('xe_frog', 20, 17, 3, (p, f) => { const y = f === 1 ? -3 : 0; p.line(5, 12 + y, 2, 6 + y * 0.5, P.XEC.chit[1]); p.line(2, 6 + y * 0.5, 3, 16, P.XEC.chit[1]); p.sell(11, 11 + y, 6, 4, ['#7a3a04', '#ffb020', '#ffe080', '#fff8d0']); p.px(10, 10 + y, '#a8ff3a'); p.ell(16, 9 + y, 2, 2, P.XEC.chit[1]); p.px(17, 8 + y, '#3ae0d0'); if (f === 2) p.ell(19, 10, 1.5, 1.5, '#ffe080'); });
  // ZUMBÓPTERO: organismo volador con cuatro alas translúcidas en cruz y un único ojo central
  const zumb = (p, f, cy2) => { const up = f ? -2 : 2; for (const sd of [-1, 1]) { p.ell(13 + sd * 7, 6 + up * 0.5, 5, 2, cy2 ? '#a0aabe' : '#c8fff0'); p.ell(13 + sd * 6, 10 - up * 0.5, 4, 1.6, cy2 ? '#8c96aa' : '#fff0b4'); } p.sell(13, 8, 3.4, 3.4, cy2 ? ['#2a2a3a', '#4a4a5a', '#7a7a8a'] : ['#7a3a04', '#c07010', '#ffd050']); p.ell(13, 8, 1.6, 1.6, cy2 ? '#ff3050' : '#0a0a0a'); p.px(12, 7, '#ffffff'); p.line(13, 11, 13, 14, P.XEC.chit[2]); };
  P.mk('xe_dfly', 26, 16, 2, (p, f) => zumb(p, f, false));
  P.mk('xe_dfly_cy', 26, 16, 2, (p, f) => { zumb(p, f, true); p.rect(11, 3, 5, 2, '#3a4258'); });
  // PORTAMIEL: transportador de recursos con un globo de miel a la espalda
  P.mk('xe_slug', 28, 15, 2, (p, f) => { for (let k = 0; k < 5; k++) p.line(6 + k * 4, 12, 5 + k * 4 + (f ? 1 : -1), 14, P.XEC.chit[1]); p.sell(14, 10, 10, 3, P.XEC.chit); p.sell(13, 5 - f * 0.5, 6, 5, ['#7a3a04', '#ffb020', '#ffe080', '#ffffff']); p.ell(24, 10, 2, 2, P.XEC.chit[2]); p.px(25, 9, '#a8ff3a'); });
  // COLGAPANAL: cuelga del techo de las colmenas y cae
  P.mk('xe_vsnake', 12, 34, 2, (p, f) => { for (let y = 0; y < 22 + f * 6; y++) p.px(6, y, '#c07a1a'); const y0 = 22 + f * 6; P.Sprites.xeComb(p, 6, y0 + 4, 5, 5, P.XEC.amb, { cell: 2 }); p.ell(6, y0 + 7, 1.4, 1.4, '#0a0a0a'); for (let k = 0; k < 3; k++) p.line(3 + k * 3, y0 + 8, 2 + k * 3, y0 + 11, P.XEC.chit[1]); });
  // CÁLIZ ÁMBAR: flor-trampa de pétalos de quitina
  P.mk('xe_maw', 26, 34, 3, (p, f) => { p.thick(13, 34, 13, 18, 3, '#5aa01a'); const o = [0, 4, 8][f]; for (const sd of [-1, 1]) p.tri(13, 18, 13 + sd * (6 + o), 6 - o * 0.3, 13 + sd * 2, 6, P.XEC.chit[2]); p.ell(13, 14, 4 + o * 0.4, 3, f ? '#2a0e04' : '#ffb020'); if (o) for (let k = 0; k < 4; k++) p.px(10 + k * 2, 11, '#fff8d0'); });
  // PACÍPODO (restaurado): caminante pacífico de seis patas largas con una colmena diminuta en el lomo
  P.mk('xe_grazer', 38, 28, 3, (p, f) => { const ph = f === 2 ? 0 : f; for (let k = 0; k < 6; k++) p.line(8 + k * 4, 16, 6 + k * 4 + (k % 2 ? 1 : -1) * ph * 2, 27, P.XEC.chit[1]); p.sell(19, 14, 12, 4.5, ['#5a2e0a', '#a06010', '#e0a020', '#ffe080']); P.Sprites.xeComb(p, 17, 8, 5, 4, P.XEC.amb, { cell: 2 }); p.line(30, 13, 34, 8, P.XEC.chit[2]); p.ell(34, 7, 2.4, 2, P.XEC.chit[2]); p.px(35, 6, '#3ae0d0'); });
  // LEVIATÁN DE CERA (legendario): coloso de las profundidades con un panal luminoso por espalda
  P.mk('xe_vellorn', 40, 38, 2, (p, f) => { p.sell(20, 22, 18, 10, ['#3a1e06', '#6a3a10', '#a06030', '#d8a060']); P.Sprites.xeComb(p, 20, 15, 14, 7, ['#7a3a04', '#ffb020', '#ffe080', '#ffffff'], { cell: 2 }); for (let k = 0; k < 6; k++) p.line(8 + k * 5, 30, 7 + k * 5 + (f ? 1 : -1), 37, P.XEC.chit[1]); p.ell(35, 22, 2, 2, '#3ae0d0'); });
  // GUARDIÁN DE COLMENA: centinela acorazado con escudo frontal de quitina
  P.mk('xe_wraith', 20, 24, 3, (p, f) => { p.line(7, 18, 5, 23, P.XEC.chit[0]); p.line(12, 18, 14, 23, P.XEC.chit[0]); p.sell(9, 13, 6, 7, P.XEC.chit); p.sell(9, 5, 4, 4, P.XEC.chit); p.ell(11, 5, 1.4, 1.4, f === 2 ? '#ff3050' : '#a8ff3a'); p.line(8, 1, 6, -1, P.XEC.chit[2]); p.line(10, 1, 12, -1, P.XEC.chit[2]); const sx = f === 1 ? 17 : 15; p.rect(sx, 6, 3, 14, '#a07a30'); p.rect(sx, 6, 1, 14, '#e0b060'); for (let y = 8; y < 20; y += 4) P.Sprites.xeHex(p, sx + 1, y, 1.4, '#ffd060', '#5a3a14', null); });
  P.mk('xe_b_glob', 7, 7, 2, (p, f) => { p.ell(3, 3, 3, 3, f ? '#ffe080' : '#ffb020'); p.px(2, 2, '#ffffff'); });
  P.mk('xe_b_orb', 8, 8, 2, (p, f) => { p.ell(4, 4, 3.4, 3.4, f ? '#a8ff3a' : '#ffd050'); p.px(3, 3, '#ffffff'); });
  P.mk('xe_b_kspine', 12, 5, 1, p => { p.tri(0, 1, 0, 4, 11, 2, '#e0b060'); p.line(1, 2, 10, 2, '#fff8d0'); });
  P.mk('xe_gate', 34, 46, 1, p => { for (let k = 0; k <= 20; k++) { const a = Math.PI * k / 20; p.thick(17 - Math.cos(a) * 13, 44 - Math.sin(a) * 34, 17 - Math.cos(a) * 13, 44 - Math.sin(a) * 34, 5, k % 3 ? '#a06010' : '#e0a020'); } p.rect(2, 42, 30, 4, '#5a2e0a'); P.Sprites.xeHex(p, 17, 14, 4, '#3ae0d0', '#0a4a4a', '#ffffff'); });
  const ic = (n, fn) => P.mk('i_' + n, 10, 10, 1, fn);
  ic('grip', p => { p.ell(5, 6, 3.5, 2.5, '#ffb020'); for (let k = 0; k < 3; k++) p.line(2 + k * 3, 8, 1 + k * 3, 9, '#6a3a10'); });
  ic('stinger', p => { p.tri(1, 4, 1, 6, 9, 5, '#e0b060'); p.px(9, 5, '#ffffff'); p.rect(0, 4, 3, 3, '#3a4258'); });
  ic('wax', p => { P.Sprites.xeHex(p, 5, 5, 4, '#e0a020', '#7a3a04', '#fff0a0'); });
  ic('swarm', p => { for (const [x, y] of [[2, 3], [6, 2], [4, 6], [8, 6], [7, 8]]) { p.px(x, y, '#ffd050'); p.px(x + 1, y, '#3a2410'); } });

  // ================= MAPA EXTERIOR =================
  for (const st of ['c', 'r']) { const on = st === 'r', dim = c2 => on ? c2 : P.Col.mix(c2, '#4a4438', 0.72);
    P.mk('xe_o_grass_' + st, 16, 16, 3, (p, v) => { p.rect(0, 0, 16, 16, dim('#c07a1a')); for (const [cx, cy] of [[3, 3], [11, 3], [7, 9], [15, 9], [-1, 9], [3, 15], [11, 15]]) P.Sprites.xeHex(p, cx, cy, 3, dim(v === 1 && cx === 7 ? '#ffd050' : '#d08a2a'), dim('#a06010'), null); }, { outline: false });
    P.mk('xe_o_water_' + st, 16, 16, 2, (p, f) => { const lq = P.PAL.xertha[st].liq; p.rect(0, 0, 16, 16, lq[2]); for (let k = 0; k < 3; k++) p.rect((k * 6 + f * 2) % 14, 3 + k * 5, 3, 1, lq[3]); }, { outline: false });
    P.mk('xe_o_tree_' + st, 34, 42, 2, (p, v) => { p.ell(17, 40, 12, 2.5, '#2a1606'); for (let y = 0; y < 16; y++) p.rect(15 + Math.round(Math.sin(y * 0.2)), 40 - y, 4, 1, dim('#6a3a10')); P.Sprites.xeComb(p, 17, 16 - v * 2, 13 - v * 2, 11 - v, P.XEC.amb.map(dim), { drips: on ? 4 : 0, cell: 2 }); });
    P.mk('xe_o_ice_' + st, 16, 16, 2, (p, v) => { p.rect(0, 0, 16, 16, dim('#e0a020')); p.rect(0, 4 + v * 4, 16, 1, dim('#ffe080')); }, { outline: false });
    P.mk('xe_o_cliff_' + st, 16, 16, 3, (p, v) => { p.rect(0, 0, 16, 16, dim('#7a4410')); for (let x = 0; x < 16; x += 4) p.rect(x, 0, 2, 16, dim('#a0601a')); if (v === 2) { p.rect(0, 0, 16, 3, dim('#ffd050')); for (let x = 2; x < 16; x += 5) p.px(x, 3, dim('#ffb020')); } if (v === 1) p.rect(0, 12, 16, 4, '#3a1e06'); }, { outline: false });
    P.mk('xe_o_crack_' + st, 16, 16, 2, (p, f) => { const lq = P.PAL.xertha[st].liq; p.rect(0, 0, 16, 16, dim('#c07a1a')); for (let x = 0; x < 16; x++) { const y = 7 + Math.round(Math.sin(x * 0.4 + f) * 1.5); p.rect(x, y, 1, 3, lq[2]); p.px(x, y, lq[3]); } }, { outline: false });
  }
  P.mk('xe_o_path', 16, 16, 2, (p, v) => { p.rect(0, 0, 16, 16, '#e8c070'); for (let k = 0; k < 5; k++) p.px((k * 5 + v * 3) % 16, (k * 7) % 16, '#c8a050'); }, { outline: false });
  P.mk('xe_o_stone', 16, 16, 1, p => { p.rect(0, 0, 16, 16, '#5a2e0a'); for (const [cx, cy] of [[4, 4], [12, 4], [8, 11], [0, 11], [16, 11]]) P.Sprites.xeHex(p, cx, cy, 4, '#a06010', '#3a1e06', '#e0a020'); }, { outline: false });
  P.mk('xe_o_goo', 16, 16, 2, (p, f) => { p.ell(8, 11, 6, 3, '#2a1a08'); p.ell(8, 10, 4, 2, '#4a3010'); p.px(6 + f, 9, '#8a6a3a'); }, { outline: false });
  P.mk('xe_o_lamp', 10, 16, 2, (p, f) => { p.line(5, 15, 5, 7, '#6a3a10'); p.sell(5, 5, 3, 3.5 + f * 0.3, ['#7a3a04', '#ffb020', '#ffe080', '#ffffff']); });
  P.mk('xe_o_rock', 16, 16, 1, p => { P.Sprites.xeAmber(p, 8, 15, 8, 12, ['#a06010', '#e0a020', '#ffe080', '#ffffff'], 0.1); });
  P.mk('xe_o_pillar', 14, 30, 2, (p, f) => { if (f) { P.Sprites.xeHex(p, 7, 25, 4, '#a06010', '#5a2e0a', null); return; } for (let y = 0; y < 26; y++) p.rect(4, 29 - y, 6, 1, ['#a06010', '#c07a1a'][(y >> 2) % 2]); P.Sprites.xeHex(p, 7, 4, 3, '#3ae0d0', '#0a4a4a', '#ffffff'); });
  P.mk('xe_o_house', 44, 38, 2, (p, f) => { P.Sprites.xeComb(p, 22, 24, 18, 13, f ? P.XEC.amb : P.XEC.grey, { cell: 3, drips: f ? 4 : 0 }); p.rect(19, 28, 6, 9, '#2a1606'); });
  P.mk('xe_o_flower', 8, 8, 3, (p, v) => { p.line(4, 7, 4, 4, '#5aa01a'); P.Sprites.xeHex(p, 4, 3, 2, ['#ffe080', '#3ae0d0', '#a8ff3a'][v], '#a06010', null); });
};
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildXertha(); }; })();
