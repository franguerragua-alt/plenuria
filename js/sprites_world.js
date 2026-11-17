'use strict';
// Arte del mundo (VÉRZARA de día): teselas, cielos, árboles, flora, fauna, invasores, objetos, jefe, mapa exterior, iconos
P.PAL = {
  verzara: {
    // contaminado: día con bruma violeta, musgo magenta y venas de veneno lima
    c: { soil: ['#2a1634', '#3e2250', '#57336a', '#76508a'], vein: '#c8ff4a', top: ['#5a1a6a', '#9a32a8', '#d85cd0', '#ffa8f0'],
      liq: ['#2f6a0a', '#5ab018', '#a8f830', '#f2ffc0'], thorn: ['#4a1058', '#a02aa8', '#ff70e0', '#fff0ff'],
      leaf: ['#123e48', '#1f6e6a', '#3aa888', '#a8f0b0'], trunk: ['#3a2440', '#5e3c66', '#8a5c90'], glow: '#ff6ae8', flower: ['#ff4ad8', '#c8ff4a', '#ffd166'], amb: 'rgba(60,10,80,0.10)' },
    // restaurado: verdes intensos, flores y aguas turquesa
    r: { soil: ['#3a1e14', '#5c321e', '#7e4a2a', '#a8683a'], vein: '#ffd166', top: ['#137a2c', '#2fb83a', '#6ee44a', '#d0ff80'],
      liq: ['#0a5a8a', '#1aa8c8', '#5ef0e8', '#f0fffc'], thorn: ['#1e6a2a', '#40a83a', '#ff6ab0', '#ffe0f0'],
      leaf: ['#0e5a34', '#1f9a48', '#58d850', '#d0ff90'], trunk: ['#4a2c1a', '#7a4e2e', '#b07a4a'], glow: '#5ef0d0', flower: ['#ff5aa8', '#ffd166', '#6ad8ff', '#ffffff', '#ff8a3a'], amb: 'rgba(0,0,0,0)' }
  }
};
// cielos por nivel: día, dorado (tarde), anochecer
P.SKIES = {
  day: { r: ['#1a58d8', '#3a90f0', '#70ccf8', '#c0f2f0', '#fff4c8'], c: ['#2a3a98', '#4a6ad0', '#8a88dc', '#e898c8', '#ffd8a8'], cloud: ['#ffffff', '#e8f4ff', '#a8c8f0'], cloudC: ['#ffe8ff', '#f0c0f0', '#b080d0'] },
  golden: { r: ['#2a5ac0', '#6aa8e8', '#f8d8a0', '#ffb878', '#ff9a6a'], c: ['#4a2a88', '#8a44a8', '#e070a0', '#ffa078', '#ffd890'], cloud: ['#fff8e8', '#ffd8b0', '#e8908a'], cloudC: ['#ffe0f0', '#f0a0c0', '#b06090'] },
  dusk: { r: ['#141850', '#3a2a88', '#9a4a98', '#f07a70', '#ffc878'], c: ['#120a38', '#3a1a68', '#7a2a80', '#d04a80', '#ff9a70'], cloud: ['#ffd0e0', '#e890b8', '#7a4a90'], cloudC: ['#ffb0e0', '#c060b0', '#5a2a7a'] }
};
const RU = ['#8a90b8', '#d8e2ee', '#f4fbff', '#ffffff'], RG = '#3ae0a0', GOLD = ['#a0600a', '#e8a020', '#ffd166', '#fff4c0'], MT = ['#1a1c2a', '#2e3346', '#4e5872', '#8a98bc'];

// ---------- utilidades de dibujo ----------
P.Sprites.foliage = function (p, cx, cy, rx, ry, L, r, flowers, glow) {
  p.ell(cx, cy + ry * 0.18, rx, ry * 0.95, L[0]);
  const n = Math.max(6, Math.round(rx * ry / 9));
  for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()); const s = r.range(0.26, 0.46); p.ell(cx + Math.cos(a) * rx * 0.72 * d, cy + Math.sin(a) * ry * 0.62 * d - ry * 0.12, rx * s, ry * s * 1.15, L[1]); }
  for (let i = 0; i < n * 0.7; i++) { const a = r.range(Math.PI * 1.02, Math.PI * 1.8), d = r.range(0.15, 0.85); const s = r.range(0.16, 0.3); p.ell(cx + Math.cos(a) * rx * 0.72 * d, cy + Math.sin(a) * ry * 0.75 * d, rx * s, ry * s, L[2]); }
  for (let i = 0; i < n * 0.6; i++) { const a = r.range(Math.PI * 1.08, Math.PI * 1.75), d = r.range(0.45, 0.95); p.px(cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d, L[3]); }
  if (flowers) for (let i = 0; i < n * 0.3; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.85; const x = Math.round(cx + Math.cos(a) * rx * d), y = Math.round(cy + Math.sin(a) * ry * d); const c = r.pick(flowers); p.px(x, y, c); p.px(x + 1, y, c); p.px(x, y + 1, c); p.px(x + 1, y + 1, P.Col.shade(c, -0.25)); }
  if (glow) for (let i = 0; i < n * 0.25; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.9; p.px(cx + Math.cos(a) * rx * d, cy + ry * 0.3 + Math.sin(a) * ry * 0.6 * d, glow); }
};
P.Sprites.trunk = function (p, x, top, bot, w, T, r) {
  for (let y = top; y <= bot; y++) {
    const k = (y - top) / Math.max(1, bot - top), flare = y > bot - 18 ? Math.round(((y - (bot - 18)) / 18) ** 2 * w * 0.9) : 0, ww = Math.round(w * (0.75 + k * 0.25)) + flare * 2, x0 = Math.round(x - ww / 2);
    p.rect(x0, y, ww, 1, T[1]); p.rect(x0, y, Math.max(1, Math.round(ww * 0.22)), 1, T[2]); p.rect(x0 + ww - Math.max(1, Math.round(ww * 0.25)), y, Math.max(1, Math.round(ww * 0.25)), 1, T[0]);
  }
  for (let i = 0; i < w / 3; i++) { const bx = Math.round(x - w * 0.3 + r() * w * 0.6), by = r.int(top, bot - 10), L = r.int(6, 22); p.line(bx, by, bx + r.int(-1, 1), by + L, T[0]); }
  for (let i = 0; i < 2; i++) { const kx = Math.round(x + r.range(-w * 0.2, w * 0.2)), ky = r.int(top + 10, bot - 20); p.ell(kx, ky, 2, 3, T[0]); p.px(kx - 1, ky - 1, T[2]); }
};
P.Sprites.vineHang = function (p, x, y, L, col, leaf, bulb, r) {
  for (let i = 0; i < L; i++) { const xx = Math.round(x + Math.sin(i * 0.22 + x) * 1.5); p.px(xx, y + i, col); if (i % 7 === 3) { p.px(xx - 1, y + i, leaf); p.px(xx - 2, y + i + 1, leaf); } if (i % 7 === 6) { p.px(xx + 1, y + i, leaf); p.px(xx + 2, y + i - 1, leaf); } }
  if (bulb) { const xx = Math.round(x + Math.sin(L * 0.22 + x) * 1.5); p.ell(xx, y + L + 1, 1.6, 2, bulb); p.px(xx, y + L, '#ffffff'); }
};

P.Sprites.buildWorld = function () {
  const S = P.Sprites;
  S.buildTiles(); S.buildBackgrounds(); S.buildFlora(); S.buildFauna(); S.buildInvaders(); S.buildObjects(); S.buildIcons(); S.buildOverworld(); S.buildSil();
  S.buildBosses();
};

// ================= TESELAS =================
P.Sprites.buildTiles = function () {
  for (const st of ['c', 'r']) {
    const pal = P.PAL.verzara[st], s = pal.soil, t = pal.top;
    P.mk('t_soil_' + st, 16, 16, 3, (p, v) => {
      const r = P.RNG(50 + v * 7 + (st === 'c' ? 100 : 0));
      p.rect(0, 0, 16, 16, s[1]);
      for (let i = 0; i < 18; i++) { const x = r.int(0, 15), y = r.int(0, 15); p.px(x, y, s[0]); if (r() < 0.5) p.px(x + 1, y, s[0]); }
      for (let i = 0; i < 2; i++) { const x = r.int(2, 13), y = r.int(2, 13), w = r.int(2, 3); p.ell(x, y, w, 1.6, s[2]); p.px(x - 1, y - 1, s[3]); p.px(x, y - 1, s[3]); p.px(x + 1, y + 1, s[0]); }
      if (v === 2) { let x = r.int(2, 6), y = 0; while (y < 16) { p.px(x, y, s[0]); y++; if (r() < 0.4) x += r.pick([-1, 1]); } }
      if (v === 1) { const vx = r.int(4, 11), vy = r.int(4, 9); for (let k = 0; k < 4; k++) p.px(vx + k, vy + Math.round(Math.sin(k) * 1), pal.vein); p.px(vx, vy - 1, '#ffffff'); }
    }, { outline: false });
    P.mk('t_top_' + st, 16, 9, 3, (p, v) => {
      const r = P.RNG(70 + v * 5 + (st === 'c' ? 50 : 0));
      p.rect(0, 3, 16, 4, t[1]); p.rect(0, 3, 16, 1, t[2]); p.rect(0, 6, 16, 1, t[0]);
      for (let x = 0; x < 16; x++) { if (r() < 0.55) p.px(x, 7, t[0]); if (r() < 0.25) p.px(x, 8, t[0]); const h = r.int(0, 3); for (let y = 3 - h; y < 3; y++) p.px(x, y, y === 3 - h ? t[3] : t[2]); }
      for (let i = 0; i < 2; i++) { const x = r.int(1, 14); p.px(x, 4, t[3]); }
      if (r() < 0.7) { const x = r.int(2, 13), c = r.pick(pal.flower); p.px(x, 1, c); p.px(x + 1, 1, c); p.px(x, 0, P.Col.shade(c, 0.4)); p.px(x, 2, t[0]); }
      if (st === 'c') { const dx = r.int(2, 13); p.px(dx, 7, pal.vein); p.px(dx, 8, pal.vein); }
    }, { outline: false });
    P.mk('t_bot_' + st, 16, 7, 2, (p, v) => {
      const r = P.RNG(90 + v);
      for (let i = 0; i < 4; i++) { const x = r.int(0, 15), l = r.int(2, 6); p.line(x, 0, x + r.int(-1, 1), l, s[2]); if (r() < 0.5) p.px(x, l + 1, st === 'c' ? pal.vein : '#7af0e0'); }
    }, { outline: false });
    // decoración automática sobre el suelo
    P.mk('tdeco_' + st, 16, 14, 6, (p, v) => {
      const r = P.RNG(500 + v * 13 + (st === 'c' ? 7 : 0)), L = t, fl = pal.flower;
      const blade = (x, h, lean) => { for (let i = 0; i < h; i++) p.px(Math.round(x + lean * i / h), 13 - i, i > h - 2 ? L[3] : i > h / 2 ? L[2] : L[1]); };
      if (v === 0) for (let i = 0; i < 6; i++) blade(4 + i * 1.5, r.int(3, 7), r.range(-2, 2));
      if (v === 1) for (let i = 0; i < 3; i++) { const x = 3 + i * 4, h = r.int(5, 9); p.line(x, 13, x, 13 - h, L[1]); p.px(x + 1, 13 - h / 2, L[2]); const c = fl[(i + v) % fl.length]; p.px(x - 1, 13 - h, c); p.px(x + 1, 13 - h, c); p.px(x, 12 - h, c); p.px(x, 14 - h, c); p.px(x, 13 - h, '#ffffff'); }
      if (v === 2) { const m = st === 'c' ? ['#5a1a7a', '#c04ad0', '#ff9af0'] : ['#8a2a1a', '#ff5a3a', '#ffb070']; p.rect(5, 9, 1, 4, '#f0e0d0'); p.sell(5, 8, 3, 2, m); p.px(4, 7, '#ffffff'); p.rect(10, 11, 1, 2, '#f0e0d0'); p.sell(10, 10, 2, 1.4, m); }
      if (v === 3) { for (let i = 0; i < 4; i++) blade(5 + i * 2, r.int(6, 10), r.range(-1.5, 1.5)); const c = fl[1 % fl.length]; p.ell(11, 4, 1.5, 2, c); p.px(11, 3, '#ffffff'); p.line(11, 6, 10, 9, L[1]); }
      if (v === 4) { p.sell(9, 11, 4, 2.6, ['#3a3448', '#6a6488', '#a8a4c8', '#e0e0f0']); blade(3, 4, 1); blade(4, 6, -1); blade(14, 4, -1); }
      if (v === 5) { for (let k = 0; k < 4; k++) { const a = -2.6 + k * 0.6; for (let i = 0; i < 8; i++) p.px(Math.round(8 + Math.cos(a) * i), Math.round(13 + Math.sin(a) * i), i > 5 ? L[3] : L[2]); } }
    });
    const lq = pal.liq;
    P.mk('t_liq_' + st, 16, 16, 4, (p, f) => {
      for (let x = 0; x < 16; x++) {
        const h = Math.round(2 + Math.sin((x + f * 4) * 0.4) * 1.3);
        for (let y = h; y < 16; y++) p.dith(x, y, y < h + 3 ? lq[2] : lq[1], lq[1], y < h + 3 ? (y - h) / 3 : 0);
        p.px(x, h, lq[3]); if ((x + f) % 5 === 0) p.px(x, h + 1, lq[3]);
      }
      for (let i = 0; i < 3; i++) { const bx = (i * 6 + f * 3) % 16, by = 14 - ((f * 3 + i * 5) % 9); p.px(bx, by, lq[3]); }
    }, { outline: false });
    P.mk('t_liqb_' + st, 16, 16, 2, (p, f) => { p.grad(0, 0, 16, 16, [lq[1], lq[0]]); for (let i = 0; i < 4; i++) p.px((i * 5 + f * 2) % 16, (i * 7 + f * 3) % 16, lq[2]); }, { outline: false });
    const th = pal.thorn;
    P.mk('t_thorn_' + st, 16, 16, 2, (p, f) => {
      p.ell(8, 14, 9, 3, th[0]); p.ell(8, 13, 7, 2.5, th[1]);
      for (let i = 0; i < 6; i++) { const x = 1 + i * 2.8 + (f ? 1 : 0), h = 5 + (i % 3) * 2; p.tri(x - 1.6, 14, x + 1.6, 14, x, 14 - h, i % 2 ? th[1] : th[0]); p.px(Math.round(x), Math.round(14 - h), th[3]); p.px(Math.round(x) - 1, Math.round(14 - h / 2), th[2]); }
      if (st === 'r') { for (const [x, y] of [[4, 9], [11, 8]]) { p.px(x, y, '#ff6ab0'); p.px(x + 1, y, '#ff6ab0'); p.px(x, y - 1, '#ffd0e8'); } }
    });
    P.mk('t_vine_' + st, 16, 16, 2, (p, v) => {
      for (let y = 0; y < 16; y++) { const x = 8 + Math.round(Math.sin((y + v * 8) * 0.45) * 1.5); p.px(x, y, t[1]); p.px(x + 1, y, t[0]); }
      for (let y = 2; y < 16; y += 5) { const x = 8 + Math.round(Math.sin((y + v * 8) * 0.45) * 1.5); p.ell(x - 3, y, 2, 1.2, t[2]); p.ell(x + 4, y + 2, 2, 1.2, t[1]); p.px(x - 4, y, t[3]); }
      const c = pal.flower[v % pal.flower.length]; p.px(10, 7 + v * 4, c); p.px(11, 7 + v * 4, c); p.px(10, 6 + v * 4, '#ffffff');
    }, { outline: false });
    P.mk('t_branch_' + st, 16, 8, 2, (p, v) => {
      const T = pal.trunk; p.rect(0, 2, 16, 4, T[1]); p.rect(0, 2, 16, 1, T[2]); p.rect(0, 5, 16, 1, T[0]);
      for (let x = v * 3; x < 16; x += 6) { p.px(x, 3, T[0]); p.px(x + 1, 4, T[0]); }
      for (let x = 1 + v * 2; x < 16; x += 5) { p.rect(x, 1, 3, 1, t[1]); p.px(x + 1, 0, t[2]); p.px(x + 1, 6, t[1]); p.px(x + 1, 7, t[2]); }
      p.px(6 + v * 5, 0, pal.flower[0]);
    });
    P.mk('t_bulb_' + st, 16, 16, 3, (p, f) => {
      const ry = [5, 3.5, 6.5][f], rx = [6, 7.5, 5][f], B = st === 'c' ? ['#7a1a8a', '#d04ae0', '#ff9af8', '#ffffff'] : ['#0e7a7a', '#22d0c0', '#a8fff0', '#ffffff'];
      p.rect(7, 12, 2, 4, t[0]); p.tri(2, 16, 8, 11, 14, 16, t[1]); p.tri(4, 16, 8, 12, 12, 16, t[2]);
      p.sell(8, 14 - ry - 1, rx, ry, B); p.px(6, 14 - ry * 2 + 1, '#ffffff'); p.px(5, 14 - ry * 2 + 2, '#ffffff');
      for (let i = -1; i <= 1; i++) p.px(8 + i * 3, 13 - ry * 2 + 2 + Math.abs(i), B[2]);
    });
  }
  P.mk('t_ruin', 16, 16, 3, (p, v) => {
    p.grad(0, 0, 16, 16, [RU[2], RU[1], RU[1], RU[0]]); p.rect(0, 7, 16, 1, RU[0]); p.rect(0, 15, 16, 1, '#6a6e98');
    p.rect(v === 1 ? 4 : 10, 0, 1, 7, RU[0]); p.rect(v === 2 ? 3 : 6, 8, 1, 7, RU[0]);
    p.px(2, 1, RU[3]); p.px(12, 9, RU[3]);
    if (v === 2) { p.rect(6, 3, 4, 1, RG); p.px(7, 2, RG); p.px(8, 4, '#a8ffe0'); }
    if (v === 0) { p.px(13, 4, '#3a9a4a'); p.px(14, 5, '#5ad04a'); p.px(13, 5, '#3a9a4a'); }
    if (v === 1) { p.rect(9, 10, 3, 3, GOLD[1]); p.px(9, 10, GOLD[3]); }
  }, { outline: false });
  P.mk('t_ruintop', 16, 6, 1, p => { p.rect(0, 2, 16, 2, GOLD[1]); p.rect(0, 2, 16, 1, GOLD[3]); for (let x = 1; x < 16; x += 4) p.px(x, 3, RG); p.ell(4, 1, 2.5, 1.2, '#3ab84a'); p.px(3, 0, '#8af05a'); p.rect(11, 1, 3, 1, '#3ab84a'); p.px(12, 0, '#ff6ab0'); }, { outline: false });
  P.mk('t_metal', 16, 16, 3, (p, v) => {
    p.rect(0, 0, 16, 16, MT[1]); p.grad(1, 1, 14, 14, [MT[3], MT[2], MT[2], MT[1]]); p.rect(1, 14, 14, 1, MT[0]);
    for (const [x, y] of [[2, 2], [13, 2], [2, 13], [13, 13]]) p.px(x, y, '#c0c8e0');
    if (v === 1) { p.rect(4, 6, 8, 4, MT[0]); for (let i = 0; i < 4; i++) p.rect(5 + i * 2, 7, 1, 2, MT[3]); }
    if (v === 2) { p.rect(6, 6, 4, 4, '#3a0a14'); p.px(7, 7, '#ff3050'); p.px(8, 8, '#ff3050'); p.px(7, 8, '#ff9aa8'); }
    if (v === 0) { p.rect(3, 8, 10, 1, '#5ae8ff'); }
  }, { outline: false });
  P.mk('t_metaltop', 16, 4, 1, p => { for (let x = 0; x < 16; x++) p.rect(x, 0, 1, 3, ((x >> 2) % 2) ? '#ffcc00' : '#1a1a22'); p.rect(0, 3, 16, 1, MT[0]); }, { outline: false });
  P.mk('t_grate', 16, 8, 1, p => { p.rect(0, 1, 16, 3, MT[2]); p.rect(0, 1, 16, 1, MT[3]); for (let x = 1; x < 16; x += 3) p.rect(x, 2, 1, 2, MT[0]); p.rect(1, 4, 2, 3, MT[1]); p.rect(13, 4, 2, 3, MT[1]); p.px(8, 2, '#5ae8ff'); });
  P.mk('t_crack', 16, 16, 1, p => {
    p.grad(0, 0, 16, 16, ['#9a78c0', '#6a4a90', '#4a3068']); p.line(3, 0, 7, 6, '#24143a'); p.line(7, 6, 5, 11, '#24143a'); p.line(7, 6, 13, 9, '#24143a'); p.line(13, 9, 15, 15, '#24143a'); p.line(5, 11, 2, 16, '#24143a');
    p.px(8, 6, '#e0c8ff'); p.px(4, 2, '#e0c8ff'); p.px(12, 12, '#c8ff4a');
  }, { outline: false });
};

// ================= FONDOS =================
P.Sprites.buildBackgrounds = function () {
  for (const sky in P.SKIES) for (const st of ['c', 'r']) P.mkCanvas('bg_sky_' + st + '_' + sky, [P.Sprites.bgSky(st, sky)]);
  for (const st of ['c', 'r']) {
    const pal = P.PAL.verzara[st];
    P.mkCanvas('bg_far_' + st, [P.Sprites.bgFar(pal, st)]);
    P.mkCanvas('bg_mid_' + st, [P.Sprites.bgMid(pal, st)]);
    P.mkCanvas('bg_near_' + st, [P.Sprites.bgNear(pal, st)]);
    // árboles gigantes del plano medio (en el mundo, detrás de las teselas)
    P.mk('bigtree_' + st, 110, 190, 2, (p, v) => {
      const r = P.RNG(900 + v * 31 + (st === 'c' ? 3 : 0));
      P.Sprites.trunk(p, 55, 40, 189, 18 + v * 4, pal.trunk, r);
      for (let i = 0; i < 3; i++) { const bx = 55 + (i - 1) * 22, by = 60 + i * 14; p.thick(55, by + 20, bx + (i - 1) * 10, by, 3, pal.trunk[1]); }
      P.Sprites.foliage(p, 55, 36, 52, 26, pal.leaf, r, pal.flower, pal.glow);
      P.Sprites.foliage(p, 22 + v * 6, 52, 22, 13, pal.leaf, r, pal.flower, null);
      P.Sprites.foliage(p, 88 - v * 4, 48, 22, 14, pal.leaf, r, pal.flower, null);
      for (let i = 0; i < 8; i++) P.Sprites.vineHang(p, r.int(10, 100), r.int(50, 62), r.int(14, 46), pal.leaf[1], pal.leaf[2], r() < 0.6 ? pal.glow : null, r);
    }, { up: 0.1, down: 0.15, dark: 0.5 });
  }
  P.mkCanvas('bg_cave', [P.Sprites.bgCave()]);
  P.mkCanvas('bg_fac', [P.Sprites.bgFacility(false)]);
  P.mkCanvas('bg_lab', [P.Sprites.bgFacility(true)]);
};
P.Sprites.bgSky = function (st, sky) {
  const SK = P.SKIES[sky], cols = SK[st], p = new P.Painter(P.W, P.H), r = P.RNG(st === 'c' ? 5 : 6);
  p.grad(0, 0, P.W, P.H, cols);
  if (sky === 'dusk') for (let i = 0; i < 90; i++) p.px(r.int(0, P.W), r.int(0, 120), r() < 0.2 ? '#ffffff' : '#c8c0ff');
  // nubes
  const CL = st === 'c' ? SK.cloudC : SK.cloud;
  const cloud = (cx, cy, w) => { P.paintCloud(p, cx, cy + 4, w, Math.round(w * 0.3), [CL[0], CL[1], CL[2]], r, { lit: 'top' }); };
  for (let i = 0; i < 6; i++) cloud(r.int(0, P.W), r.int(34, 130), r.int(46, 112));
  for (let i = 0; i < 4; i++) P.paintStratus(p, r.int(0, P.W), r.int(144, 175), r.int(70, 160), [CL[0], CL[1], CL[2]], r, { lit: 'top' });
  const c = p.canvas(), x = c.getContext('2d');
  // la estrella Plenuria atrapada en la Esfera de Dyson
  const sx = 372, sy = sky === 'dusk' ? 150 : sky === 'golden' ? 110 : 62;
  x.globalCompositeOperation = 'lighter';
  const gl = x.createRadialGradient(sx, sy, 4, sx, sy, 120); gl.addColorStop(0, 'rgba(255,240,190,0.75)'); gl.addColorStop(0.3, 'rgba(255,200,120,0.25)'); gl.addColorStop(1, 'rgba(255,160,80,0)');
  x.fillStyle = gl; x.fillRect(sx - 120, sy - 120, 240, 240);
  for (let i = 0; i < 6; i++) { const a = -0.2 + i * 0.38; x.fillStyle = 'rgba(255,240,200,0.05)'; x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx + Math.cos(a + 1.2) * 600, sy + Math.sin(a + 1.2) * 600); x.lineTo(sx + Math.cos(a + 1.32) * 600, sy + Math.sin(a + 1.32) * 600); x.fill(); }
  x.globalCompositeOperation = 'source-over';
  x.fillStyle = '#fff6d0'; x.beginPath(); x.arc(sx, sy, 15, 0, 7); x.fill(); x.fillStyle = '#ffffff'; x.beginPath(); x.arc(sx - 3, sy - 3, 9, 0, 7); x.fill();
  x.strokeStyle = st === 'c' ? 'rgba(40,10,60,0.9)' : 'rgba(60,40,90,0.55)'; x.lineWidth = 2;
  for (let i = -2; i <= 2; i++) { x.beginPath(); x.ellipse(sx, sy, 21, 21 * Math.abs(Math.cos(i * 0.55)) + 1, 0, 0, 7); x.stroke(); }
  x.beginPath(); x.arc(sx, sy, 21, 0, 7); x.stroke();
  // luna lejana
  x.fillStyle = st === 'c' ? 'rgba(230,200,255,0.55)' : 'rgba(240,255,250,0.5)'; x.beginPath(); x.arc(90, 40, 11, 0, 7); x.fill();
  x.fillStyle = 'rgba(255,255,255,0.25)'; x.beginPath(); x.arc(86, 37, 4, 0, 7); x.fill();
  return c;
};
P.Sprites.bgFar = function (pal, st) {
  const W = 640, p = new P.Painter(W, P.H), r = P.RNG(st === 'c' ? 11 : 12), hz = P.SKIES.day[st][3];
  const A = pal.leaf.map(c => P.Col.mix(c, hz, 0.62));
  // cordilleras
  for (let l = 0; l < 2; l++) {
    let h = 120 + l * 26; const col = P.Col.mix(st === 'c' ? '#7a5aa8' : '#5a8ab8', hz, 0.55 - l * 0.15), hi = P.Col.mix(col, '#ffffff', 0.25);
    for (let x = 0; x < W; x++) { h += Math.sin(x * 0.013 + l) * 0.9 + r.range(-0.9, 0.9); h = P.clamp(h, 90 + l * 20, 170 + l * 20); p.rect(x, Math.round(h), 1, P.H - Math.round(h), col); if (r() < 0.5) p.px(x, Math.round(h), hi); }
  }
  // árboles paraguas lejanos
  for (let i = 0; i < 9; i++) {
    const x = Math.round(i * W / 9 + r.int(-20, 20)), top = r.int(110, 150);
    p.rect(x - 2, top, 4, P.H - top, A[0]); p.rect(x - 2, top, 1, P.H - top, A[1]);
    const w = r.int(18, 34); p.ell(x, top, w, w * 0.32, A[1]); p.ell(x - 4, top - 3, w * 0.7, w * 0.18, A[2]); p.ell(x, top + 3, w * 0.9, w * 0.18, A[0]);
    for (let k = 0; k < 5; k++) p.px(x + r.int(-w, w), top + r.int(-2, 3), pal.glow);
  }
  p.grad(0, 200, W, 70, [P.Col.mix(A[0], hz, 0.3), A[0]]);
  return p.canvas();
};
P.Sprites.bgMid = function (pal, st) {
  const W = 640, p = new P.Painter(W, P.H), r = P.RNG(st === 'c' ? 21 : 22), hz = P.SKIES.day[st][3];
  const L = pal.leaf.map(c => P.Col.mix(c, hz, 0.32)), T = pal.trunk.map(c => P.Col.mix(c, hz, 0.35));
  for (let i = 0; i < 5; i++) {
    const x = Math.round(i * W / 5 + r.int(-30, 30)), top = r.int(60, 100), w = r.int(12, 20);
    P.Sprites.trunk(p, x, top, P.H - 1, w, T, r);
    P.Sprites.foliage(p, x, top - 4, r.int(36, 52), r.int(16, 22), L, r, pal.flower.map(c => P.Col.mix(c, hz, 0.3)), pal.glow);
    for (let k = 0; k < 5; k++) P.Sprites.vineHang(p, x + r.int(-40, 40), top + 8, r.int(10, 40), L[1], L[2], r() < 0.5 ? pal.glow : null, r);
  }
  // matorrales del fondo
  for (let x = 0; x < W; x += r.int(18, 30)) P.Sprites.foliage(p, x, P.H - r.int(4, 14), r.int(14, 24), r.int(8, 12), L, r, null, null);
  return p.canvas();
};
P.Sprites.bgNear = function (pal, st) {
  const W = 640, p = new P.Painter(W, P.H), r = P.RNG(st === 'c' ? 31 : 32);
  const L = pal.leaf.map(c => P.Col.shade(c, -0.08));
  // helechos y arbustos en la base
  for (let x = 0; x < W; x += r.int(26, 46)) {
    const h = r.int(16, 30);
    for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * 0.36; for (let i = 0; i < h; i++) { const xx = Math.round(x + Math.cos(a) * i), yy = Math.round(P.H + Math.sin(a) * i); p.px(xx, yy, i > h - 4 ? L[3] : L[1]); if (i % 3 === 0) { p.px(xx - 1, yy, L[2]); p.px(xx + 1, yy + 1, L[0]); } } }
  }
  return p.canvas();
};
P.Sprites.bgCave = function () {
  const p = new P.Painter(640, P.H), r = P.RNG(99);
  p.grad(0, 0, 640, P.H, ['#1a1036', '#2a1a52', '#3a2068', '#1e1440']);
  for (let l = 0; l < 3; l++) {
    const col = ['#2a1a4a', '#3a2460', '#4a2e78'][l];
    let h = 60 + l * 20; for (let x = 0; x < 640; x++) { h += r.range(-2, 2); h = P.clamp(h, 30 + l * 20, 100 + l * 20); p.rect(x, 0, 1, h - l * 10, col); p.rect(x, P.H - h + 20 + l * 15, 1, h, col); }
  }
  for (let i = 0; i < 40; i++) {
    const x = r.int(0, 630), y = r.int(60, 220), s = r.int(3, 8), c = r.pick([['#5a1a8a', '#b04ae0', '#f0c0ff'], ['#0a6a6a', '#2fe0c0', '#c0fff4'], ['#8a5a0a', '#ffc040', '#fff0b0']]);
    p.tri(x - s / 2, y, x + s / 2, y, x, y - s * 2.2, c[1]); p.tri(x - s / 2, y, x, y, x, y - s * 2.2, c[0]); p.px(x, y - s * 2.2 + 1, c[2]);
  }
  return p.canvas();
};
P.Sprites.bgFacility = function (lab) {
  const p = new P.Painter(640, P.H), r = P.RNG(lab ? 202 : 201);
  p.grad(0, 0, 640, P.H, lab ? ['#123a3a', '#1a5048', '#163a3a'] : ['#1c1e30', '#2a2c44', '#1a1a2a']);
  for (let x = 0; x < 640; x += 64) {
    p.rect(x, 0, 48, P.H, lab ? '#1c4a44' : '#262a40'); p.rect(x, 0, 2, P.H, lab ? '#2a6a5a' : '#3a4060');
    for (let y = 20; y < P.H; y += 34) { p.rect(x + 6, y, 36, 2, lab ? '#2a6a5a' : '#3a4060'); p.px(x + 8, y + 5, r() < 0.5 ? '#ff3050' : '#3fe08a'); p.px(x + 10, y + 5, '#5ae8ff'); }
  }
  for (let i = 0; i < 6; i++) { const y = r.int(30, 200); p.rect(0, y, 640, 4, '#2a2e40'); p.rect(0, y, 640, 1, '#5a6280'); }
  if (lab) for (let x = 20; x < 640; x += 110) {
    p.rect(x, 104, 34, 8, '#4a5068'); p.rect(x, 198, 34, 8, '#4a5068'); p.grad(x + 3, 112, 28, 86, ['#3ad8a0', '#1a8a6a', '#0a5a4a']); p.rect(x + 3, 112, 28, 2, '#a8ffd8');
    const k = r.int(0, 2);
    if (k === 0) { p.ell(x + 17, 160, 9, 6, '#2fd0b8'); for (let s = 0; s < 4; s++) p.px(x + 11 + s * 4, 153, '#ff8a2a'); p.px(x + 22, 156, '#ff4a8a'); }
    if (k === 1) { p.ell(x + 17, 150, 6, 9, '#b04ae0'); p.px(x + 17, 146, '#ff9af0'); }
    if (k === 2) { p.ell(x + 17, 165, 10, 4, '#5ad050'); p.rect(x + 10, 150, 14, 4, '#a8b4d0'); }
    for (let b = 0; b < 5; b++) p.px(x + 6 + b * 5, 190 - ((b * 17) % 60), '#e0fff4');
  } else for (let x = 40; x < 640; x += 150) {
    p.rect(x, 60, 40, 160, '#2a2c40'); p.rect(x + 4, 64, 32, 152, '#34384e'); p.rect(x + 15, 0, 10, 60, '#30344a'); p.grad(x + 10, 120, 20, 30, ['#e070ff', '#9a34c0', '#5a1a7a']);
    p.rect(x + 4, 64, 32, 3, '#ffcc00');
  }
  return p.canvas();
};

// ================= FLORA =================
P.Sprites.buildFlora = function () {
  for (const st of ['c', 'r']) {
    const L = P.PAL.verzara[st].leaf;
    P.mk('fern_' + st, 22, 16, 2, (p, f) => {
      for (let i = 0; i < 6; i++) {
        const a = -2.75 + i * 0.5 + (f ? 0.07 : -0.04), Ln = 12 - Math.abs(i - 2.5) * 1.6;
        for (let k = 0; k < Ln; k++) { const x = 11 + Math.cos(a) * k, y = 15 + Math.sin(a) * k; p.px(x, y, k > Ln - 3 ? L[3] : L[1]); if (k % 2 === 0 && k > 2) { p.px(x + Math.cos(a - 1.4) * 2, y + Math.sin(a - 1.4) * 2, L[2]); p.px(x + Math.cos(a + 1.4) * 2, y + Math.sin(a + 1.4) * 2, L[0]); } }
      }
    });
  }
  P.mk('lamp', 14, 22, 2, (p, f) => {
    p.line(7, 21, 7, 10, '#2a8a3a'); p.line(7, 16, 3, 13, '#2a8a3a'); p.ell(3, 12, 2.5, 1.5, '#4ad050'); p.ell(11, 15, 2.5, 1.5, '#4ad050'); p.line(7, 18, 11, 15, '#2a8a3a');
    for (let i = 0; i < 5; i++) { const a = Math.PI + i * Math.PI / 4; p.ell(7 + Math.cos(a) * 4, 8 + Math.sin(a) * 2.5, 2, 1.3, '#ff7ac8'); }
    p.sell(7, 7, 4.3, 4.6 + f * 0.4, ['#0a8aa8', '#2ae0e8', '#b0fff8', '#ffffff']); p.px(5, 4, '#ffffff'); p.px(6, 4, '#ffffff');
  });
  P.mk('mush', 18, 16, 2, (p, f) => {
    p.rect(5, 9, 3, 7, '#f4e8dc'); p.rect(5, 9, 1, 7, '#ffffff'); p.rect(12, 11, 2, 5, '#f4e8dc');
    p.sell(6.5, 8, 6, 3.6 - f * 0.4, ['#a01a1a', '#ff3a2a', '#ff8a5a', '#ffffff']); p.sell(12.5, 10, 4, 2.4, ['#7a1a9a', '#c04ae0', '#ff9af8']);
    for (const [x, y] of [[3, 7], [6, 6], [9, 7], [5, 9]]) p.px(x, y, '#fff6e0'); p.px(12, 9, '#ffffff'); p.px(14, 10, '#ffffff');
  });
  P.mk('orchid', 14, 16, 2, (p, f) => {
    p.line(7, 15, 7, 7, '#2fa83a'); p.ell(4, 12, 3, 1.4, '#4ad050'); p.ell(10, 13, 3, 1.4, '#2fa83a');
    for (let i = 0; i < 5; i++) { const a = i * 1.256 + f * 0.3 - 1.57; p.ell(7 + Math.cos(a) * 3, 5 + Math.sin(a) * 3, 2, 2, i % 2 ? '#ffd166' : '#ffb030'); }
    p.ell(7, 5, 1.6, 1.6, '#ff6a2a'); p.px(7, 4, '#ffffff');
  });
  P.mk('lily', 18, 6, 1, p => { p.ell(9, 3, 8.5, 2.3, '#2fb83a'); p.ell(8, 2.5, 6, 1.4, '#6ee44a'); p.rect(9, 1, 1, 3, '#137a2c'); p.ell(12, 1.5, 2.2, 1.6, '#ff6ab0'); p.px(12, 0, '#ffe0f0'); p.px(11, 1, '#ffd166'); });
  P.mk('bigmush', 30, 34, 1, p => {
    p.rect(13, 14, 5, 20, '#f4e8dc'); p.rect(13, 14, 2, 20, '#ffffff'); p.rect(17, 14, 1, 20, '#c8b8a8'); p.ell(15, 33, 6, 1.5, '#c8b8a8');
    p.ell(15, 15, 14, 3, '#ff8ad0'); for (let x = 3; x < 28; x += 2) p.line(x, 14, 15 + (x - 15) * 0.4, 17, '#e05ab0');
    p.sell(15, 10, 14.5, 7.5, ['#3a1a8a', '#7a3ae0', '#b07aff', '#f0e0ff']);
    for (const [x, y] of [[7, 8], [13, 4], [20, 7], [17, 11], [9, 12], [24, 11]]) { p.ell(x, y, 1.4, 1.2, '#7afcff'); p.px(x, y, '#ffffff'); }
  });
  P.mk('heal', 16, 18, 2, (p, f) => {
    for (let i = 0; i < 5; i++) p.ell(3 + i * 2.6, 14 + (i % 2), 2.2, 1.4, i % 2 ? '#2fa83a' : '#4ad050');
    p.line(8, 17, 8, 10, '#2fa83a');
    if (!f) { p.sell(8, 7, 5, 5.4, ['#1a4ad0', '#3a9aff', '#b0e0ff', '#ffffff']); p.rect(7, 5, 3, 1, '#ffffff'); p.rect(8, 4, 1, 3, '#ffffff'); p.px(5, 4, '#ffffff'); }
    else p.ell(8, 11, 3.5, 2, '#5a6a8a');
  });
};

// ================= FAUNA =================
P.Sprites.buildFauna = function () {
  // Krazith: caparazón amplio, púas, pinza grande y ojos pedunculados
  const crab = (p, f, o) => {
    const cx = o.cx, by = o.by, st = f < 4 ? f : 0, up = f === 4;
    for (let i = 0; i < 3; i++) { const lx = cx - o.rx * 0.65 + i * o.rx * 0.6, lift = ((st + i) % 2) * 2; p.thick(lx, by - o.ry - 1, lx - 3, by - 3 - lift, 1.6, o.leg[0]); p.thick(lx - 3, by - 3 - lift, lx - 2, by, 1.2, o.leg[1]); p.px(lx - 2, by, o.leg[2]); }
    p.sell(cx, by - o.ry - 2, o.rx, o.ry, o.c);
    p.ell(cx + 1, by - o.ry * 0.55 - 1, o.rx * 0.82, o.ry * 0.35, o.belly);
    for (let i = 0; i < 6; i++) { const a = Math.PI * 1.15 + i * 0.13 * Math.PI, x = cx + Math.cos(a) * o.rx * 0.6, y = by - o.ry - 2 + Math.sin(a) * o.ry * 0.5; p.px(x, y, o.c[0]); }
    for (let i = 0; i < o.sp; i++) { const a = Math.PI + 0.3 + i * (Math.PI - 0.6) / (o.sp - 1), x = cx + Math.cos(a) * o.rx * 0.9, y = by - o.ry - 2 + Math.sin(a) * o.ry * 0.9, L = o.spL + (i % 2) * 2; p.tri(x - 1.4, y + 1, x + 1.4, y + 1, x + Math.cos(a) * L * 0.6, y + Math.sin(a) * L, o.spk[1]); p.px(Math.round(x + Math.cos(a) * L * 0.6), Math.round(y + Math.sin(a) * L), o.spk[2]); p.px(Math.round(x), Math.round(y), o.spk[0]); }
    const clx = cx + o.rx + 2, cly = by - o.ry + (up ? -5 : 0);
    p.thick(cx + o.rx - 3, by - o.ry - 1, clx, cly, 2, o.claw[0]);
    p.sell(clx + 2, cly, 3.4, 2.8, o.claw); p.px(clx + 5, cly - (up ? 3 : 1), o.claw[3]); p.px(clx + 4, cly + 1, o.claw[0]);
    if (up) { p.px(clx + 5, cly - 1, o.claw[0]); }
    for (const [dx, h] of [[0.45, 4], [0.75, 3]]) { const ex = cx + o.rx * dx, ey = by - o.ry * 2 - 2; p.line(ex, ey + 2, ex + 1, ey - h + 2, o.c[0]); p.ell(ex + 1, ey - h + 1, 1.3, 1.3, o.eye); p.px(ex + 1, ey - h, '#ffffff'); }
  };
  P.mk('krazith', 30, 19, 5, (p, f) => crab(p, f, { cx: 13, by: 18, rx: 9, ry: 4.5, c: ['#0a4a5a', '#139a9a', '#3ae0c0', '#c0fff4'], belly: '#ffe0a8', sp: 6, spL: 3, spk: ['#c04a1a', '#ff8a2a', '#ffe070'], claw: ['#b84a14', '#ff7a2a', '#ffb060', '#fff0c0'], leg: ['#0a6a6a', '#e07a2a', '#ffd070'], eye: '#ff3a8a' }));
  P.mk('krazith_cy', 32, 22, 5, (p, f) => {
    crab(p, f, { cx: 14, by: 21, rx: 10, ry: 5.5, c: MT, belly: '#5a6a90', sp: 4, spL: 3, spk: ['#2a2e40', '#a8b4d0', '#ffffff'], claw: ['#3a1a50', '#8a3ab0', '#c070f0', '#ffd0ff'], leg: [MT[1], MT[2], MT[3]], eye: '#ff2040' });
    p.rect(8, 6, 11, 4, MT[2]); p.rect(8, 6, 11, 1, MT[3]); p.rect(16, 4, 9, 2, '#4a5068'); p.rect(24, 4, 2, 2, '#ff3050'); p.px(11, 8, '#ff3050'); p.px(13, 8, '#5ae8ff'); p.rect(6, 12, 4, 2, '#8a3ab0');
  });
  P.mk('krazith_alfa', 50, 34, 5, (p, f) => {
    crab(p, f, { cx: 22, by: 33, rx: 16, ry: 8.5, c: ['#2a0e5a', '#5a2ab0', '#9a6af0', '#e8c8ff'], belly: '#ffd0f0', sp: 9, spL: 5, spk: ['#a0600a', '#ffc040', '#fff4c0'], claw: ['#6a1a8a', '#c04ae0', '#ff8af8', '#ffffff'], leg: ['#3a1a6a', '#ffb030', '#fff0a0'], eye: '#ffef3a' });
    for (let i = 0; i < 3; i++) { p.tri(16 + i * 6, 11, 20 + i * 6, 11, 18 + i * 6, 2 - (i === 1 ? 2 : 0), GOLD[2]); p.px(18 + i * 6, 3 - (i === 1 ? 2 : 0), '#ffffff'); }
    p.rect(14, 13, 18, 2, GOLD[1]); p.px(20, 13, '#ff3a8a'); p.px(26, 13, '#5ae8ff');
  });
  P.mk('frog', 20, 17, 3, (p, f) => {
    const C = ['#0e6a2a', '#2ec03a', '#90f45a', '#e8ffc0'];
    if (f === 1) { p.thick(5, 13, 1, 16, 2, C[0]); p.thick(13, 13, 18, 16, 2, C[0]); p.sell(10, 8, 6.5, 4.6, C); }
    else { p.ell(5, 13, 3.4, 2.8, C[0]); p.ell(14, 14, 3, 1.8, C[1]); p.sell(10, 10, 7.5, 5, C); }
    const y = f === 1 ? 8 : 10;
    p.ell(11, y + 3, 5, 1.6, '#ffe070');
    for (const [x, yy] of [[6, y - 1], [9, y - 2], [7, y + 1], [12, y - 1]]) { p.px(x, yy, '#3af0f0'); p.px(x + 1, yy, '#a0ffff'); }
    p.sell(13, y - 4, 2.8, 2.6, C); p.ell(14, y - 5, 1.6, 1.6, '#ffe03a'); p.px(14, y - 5, '#101010'); p.px(13, y - 6, '#ffffff');
    if (f === 2) { p.rect(15, y, 5, 2, '#ff4a8a'); p.px(19, y, '#ffc0d8'); }
  });
  const fly = (p, f, wing, wing2, body, head, eye, metal) => {
    const wy = f ? 11 : 1, dir = f ? -1 : 1;
    for (const [wx, Ln] of [[10, 8], [14, 7]]) { for (let k = 0; k < Ln; k++) { const x = wx - k * 0.75, y = 7 - dir * k * (6 / Ln); p.px(x, y, wing); p.px(x + 1, y, k % 3 ? wing : wing2); p.px(x + 2, y - dir, wing2); } p.px(wx - Ln * 0.75, wy, '#ffffff'); }
    const seg = body; for (let x = 2; x < 16; x++) p.px(x, 7, seg[(x >> 1) % seg.length]); p.px(1, 7, seg[0]); p.rect(14, 6, 3, 3, seg[1]);
    p.sell(18.5, 7, 2.6, 2.4, head); p.px(19, 6, eye); p.px(20, 7, eye); p.px(19, 5, '#ffffff');
    if (metal) { p.rect(5, 6, 4, 3, MT[2]); p.px(6, 7, '#ff3050'); p.rect(15, 9, 4, 1, MT[0]); }
  };
  P.mk('dfly', 23, 14, 2, (p, f) => fly(p, f, '#b8f8ff', '#ffffff', ['#3a5ae0', '#a04ae0', '#3ae0e0', '#5af07a'], ['#0a5a3a', '#1aa86a', '#5af0a0', '#ffffff'], '#ff3a6a'), { up: 0.05 });
  P.mk('dfly_cy', 23, 14, 2, (p, f) => fly(p, f, '#c0c8e0', '#ff8a9a', [MT[2], MT[3], MT[2], '#5a6278'], MT, '#ff2040', true));
  P.mk('slug', 26, 13, 2, (p, f) => {
    const L = f ? 21 : 18, x0 = 23 - L, C = ['#6a0e7a', '#b032c8', '#ff78e8', '#ffd8fa'];
    p.ell(x0 + L / 2, 9, L / 2, 3.6, C[0]); p.sell(x0 + L / 2, 8, L / 2 - 1, 3.2, C);
    p.ell(x0 + L / 2, 8.5, 2.4, 1.6, '#ffef4a'); p.px(x0 + L / 2 - 1, 8, '#ffffff'); p.px(x0 + L / 2 + 4, 8, '#c8ff4a'); p.px(x0 + L / 2 - 5, 9, '#c8ff4a');
    p.line(23, 6, 25, 2, C[1]); p.line(21, 6, 22, 2, C[1]); p.ell(25, 1.5, 1, 1, '#ffef4a'); p.ell(22, 1.5, 1, 1, '#ffef4a');
  });
  P.mk('maw', 26, 34, 3, (p, f) => {
    p.ell(5, 30, 5, 2.4, '#2fb83a'); p.ell(20, 29, 5, 2.4, '#4ad050'); p.ell(12, 32, 7, 2, '#137a2c');
    p.thick(13, 33, 13 + (f === 2 ? 3 : 0), 16, 3, '#2a9a3a'); p.px(12, 24, '#ffd166'); p.px(15, 20, '#ffd166');
    const open = f > 0 ? (f === 1 ? 6 : 9) : 1, hx = 13 + (f === 2 ? 3 : 0), hy = 12;
    const T = ['#6a0a3a', '#d02a6a', '#ff6a9a', '#ffd0e0'];
    p.sell(hx, hy - open / 2, 10, 5.5, T); p.sell(hx, hy + open / 2 + 2, 9.5, 4.5, [T[0], T[1], T[2]]);
    if (open > 2) { p.rect(hx - 8, hy - open / 2 + 3, 16, open, '#3a0a1a'); for (let i = -7; i <= 7; i += 2) { p.px(hx + i, hy - open / 2 + 3, '#ffffff'); p.px(hx + i + 1, hy + open / 2 + 2, '#ffffff'); } p.rect(hx - 3, hy + 1, 7, 2, '#ff5a8a'); }
    for (const [x, y] of [[hx - 6, hy - 6], [hx + 3, hy - 8], [hx - 1, hy - 9], [hx + 7, hy - 4]]) { p.px(x, y, '#ffe03a'); p.px(x + 1, y, '#ffe03a'); }
  });
  P.mk('vsnake', 12, 34, 2, (p, f) => {
    const L = f ? 32 : 18;
    for (let y = 0; y < L; y++) { const x = 6 + Math.round(Math.sin(y * 0.5) * (f ? 1 : 2)); p.rect(x - 1, y, 3, 1, y % 4 === 0 ? '#ffe03a' : y % 4 === 1 ? '#6ee44a' : '#2fb83a'); }
    const hy = L - 1, hx = 6 + Math.round(Math.sin(hy * 0.5) * (f ? 1 : 2));
    p.sell(hx, hy, 3.2, 2.8, ['#137a2c', '#2fb83a', '#8af05a']); p.px(hx - 1, hy, '#ff2a4a'); p.px(hx + 1, hy, '#ff2a4a'); p.ell(hx + 2, hy - 3, 2, 1, '#6ee44a');
    if (f) { p.px(hx, hy + 3, '#ff5a8a'); p.px(hx, hy + 4, '#ff5a8a'); }
  });
  P.mk('grazer', 38, 27, 3, (p, f) => {
    const st = f === 1 ? 1 : 0, gr = f === 2, B = ['#6a4028', '#a87048', '#e0b07a', '#fff0d0'];
    for (const [x, s] of [[10, 1], [14, -1], [25, 1], [29, -1]]) { p.thick(x, 16, x + st * s, 25, 3, '#5a3a24'); p.rect(x + st * s - 1, 25, 3, 2, '#2a1a10'); }
    p.sell(19, 13, 14, 7.5, B); p.ell(19, 17, 11, 2.5, B[3]);
    P.Sprites.foliage(p, 18, 7, 12, 3.5, ['#137a2c', '#2fb83a', '#6ee44a', '#d0ff80'], P.RNG(4), ['#ff5aa8', '#ffd166', '#6ad8ff'], null);
    for (let x = 9; x < 29; x += 4) p.px(x, 12 + (x % 3), '#5ef0e0');
    const hx = gr ? 34 : 33, hy = gr ? 19 : 10;
    p.sell(hx, hy, 4.4, 3.8, B); p.px(hx + 2, hy - 1, '#1a1a1a'); p.px(hx + 2, hy - 2, '#ffffff'); p.ell(hx + 3, hy + 2, 1.6, 1, '#ff9a9a');
    p.line(hx - 2, hy - 3, hx - 5, hy - 7, '#fff0d0'); p.line(hx - 5, hy - 7, hx - 3, hy - 9, '#fff0d0'); p.line(hx, hy - 3, hx + 1, hy - 8, '#fff0d0');
    p.thick(5, 12, 1, 9, 2, B[2]); p.px(1, 8, '#6ee44a');
  });
  P.mk('vellorn', 38, 38, 2, (p, f) => {
    const g = ['#2a8a9a', '#6ae0e8', '#d0fffa', '#ffffff'];
    for (const [x, s] of [[11, 1], [14, -1], [24, 1], [27, -1]]) { p.thick(x, 24, x + s * f, 36, 2, '#4ab0c0'); p.px(x + s * f, 37, GOLD[2]); }
    p.sell(19, 21, 12, 6.5, g);
    for (let i = 0; i < 7; i++) p.px(10 + i * 3, 18 + (i % 2), GOLD[2]);
    p.thick(28, 19, 31, 12, 3, g[1]); p.sell(32, 11, 3.8, 3.2, g); p.px(34, 10, '#2a3a5a'); p.px(34, 9, '#ffffff'); p.ell(35, 13, 1.4, 0.8, '#ff9ac0');
    for (const s of [-1, 1]) { p.line(31, 7, 31 + s * 2, 2, GOLD[2]); p.line(31 + s, 4, 33 + s * 3, 0, GOLD[1]); p.line(31 + s * 2, 3, 29 + s * 3, 0, GOLD[3]); p.px(31 + s * 2, 1, '#ffffff'); }
    for (let i = 0; i < 5; i++) p.line(8, 18 + i, 2 - f, 14 + i * 2, i % 2 ? g[2] : g[1]);
  }, { up: 0.1 });
};

// ================= INVASORES =================
P.Sprites.buildInvaders = function () {
  P.mk('soldier', 18, 26, 6, (p, f) => {
    const A = ['#141020', '#282238', '#443c58', '#6e6488'], N = '#ff2a4a', walk = f >= 1 && f <= 4, st = walk ? [[2, 0], [0, 1], [-2, 0], [0, 1]][f - 1] : [0, 0];
    p.thick(7, 17, 7 - st[0], 25, 3, A[1]); p.thick(10, 17, 10 + st[0], 25 - st[1], 3, A[2]); p.px(7 - st[0], 21, N); p.px(10 + st[0], 21, N);
    p.rect(5, 10, 8, 8, A[2]); p.rect(5, 10, 1, 8, A[1]); p.rect(6, 13, 6, 1, N); p.sell(5, 11, 2.6, 2.4, A); p.px(9, 15, '#ffd166');
    p.sell(9.5, 6, 4.4, 4.4, ['#b0a890', '#f0ead8', '#ffffff']); p.rect(5, 1, 9, 3, A[1]); p.rect(5, 1, 9, 1, A[3]); p.rect(8, 0, 3, 1, N);
    p.rect(10, 5, 4, 2, '#140a10'); p.px(11, 5, N); p.px(13, 5, N); p.rect(9, 9, 4, 1, '#b0a890'); p.px(10, 9, '#140a10'); p.px(12, 9, '#140a10');
    const gx = f === 5 ? 9 : 8; p.rect(gx, 13, 10, 2, '#4a5068'); p.rect(gx, 13, 10, 1, '#a8b4d0'); p.px(gx + 9, 13, N); p.px(gx + 1, 15, '#2e3346'); p.rect(gx - 1, 13, 3, 3, '#f0ead8');
  });
  P.mk('drone', 18, 15, 2, (p, f) => {
    p.rect(1, 1, 16, 1, f ? '#c0c8e0' : '#6a7090'); p.rect(8, 1, 2, 3, MT[2]);
    p.sell(9, 8, 6.5, 5.5, MT); p.ell(10, 8, 3.4, 3.4, '#3a0a14'); p.ell(10.5, 8, 2, 2, '#ff2a4a'); p.px(10, 7, '#ffc0c8');
    p.rect(3, 12, 2, 2, '#ff3050'); p.rect(13, 12, 2, 2, '#ff3050'); p.px(5, 5, '#5ae8ff');
  });
  P.mk('extractor', 38, 54, 2, (p, f) => {
    p.rect(2, 44, 34, 10, MT[1]); p.rect(2, 44, 34, 2, MT[3]); for (let x = 3; x < 35; x += 4) p.rect(x, 47, 2, 3, ((x >> 2) % 2) ? '#ffcc00' : '#1a1a22');
    p.rect(6, 50, 3, 4, '#7a2a9a'); p.rect(29, 50, 3, 4, '#7a2a9a');
    p.rect(9, 14, 20, 30, MT[2]); p.rect(9, 14, 2, 30, MT[3]); p.rect(27, 14, 2, 30, MT[1]);
    p.rect(12, 18, 14, 22, '#1a0a24'); const lvl = f ? 23 : 27; p.grad(13, lvl, 12, 39 - lvl, ['#ff9af8', '#c04ae0', '#7a1aa0']); p.rect(13, lvl, 12, 1, '#ffffff');
    p.px(15, lvl + 4, '#c8ff4a'); p.px(21, lvl + 8, '#c8ff4a'); p.px(18, lvl + 11, '#c8ff4a');
    p.rect(12, 18, 1, 22, '#8a98bc'); p.rect(25, 18, 1, 22, '#8a98bc');
    p.rect(6, 6, 26, 8, MT[1]); p.rect(6, 6, 26, 1, MT[3]); p.rect(14, 0, 10, 6, MT[2]); p.rect(16, 0, 6, 2, '#ff9af8');
    p.sell(19, 30, 4, 4, ['#b0a890', '#f0ead8', '#ffffff']); p.px(18, 30, '#140a10'); p.px(20, 30, '#140a10');
    p.px(8, 9, f ? '#ff2a4a' : '#5a0a14'); p.px(30, 9, f ? '#5a0a14' : '#ff2a4a');
    p.thick(4, 44, 1, 54, 2, MT[2]); p.thick(34, 44, 37, 54, 2, MT[2]);
  });
};

// ================= OBJETOS =================
P.Sprites.buildObjects = function () {
  P.mk('gate', 34, 46, 1, p => {
    p.rect(0, 40, 34, 6, RU[1]); p.rect(0, 40, 34, 1, RU[3]);
    p.grad(1, 8, 6, 32, [RU[2], RU[1], RU[0]]); p.grad(27, 8, 6, 32, [RU[2], RU[1], RU[0]]);
    for (let a = 0; a <= 24; a++) { const t = Math.PI * a / 24; p.thick(17 - Math.cos(t) * 14, 12 - Math.sin(t) * 10, 17 - Math.cos(t) * 14, 12 - Math.sin(t) * 10, 4, RU[1]); }
    for (let a = 0; a <= 24; a++) { const t = Math.PI * a / 24; p.px(Math.round(17 - Math.cos(t) * 12), Math.round(12 - Math.sin(t) * 8), GOLD[2]); }
    for (let y = 14; y < 38; y += 6) { p.px(3, y, RG); p.px(30, y, RG); p.px(4, y, '#a8ffe0'); }
    p.ell(17, 3, 2.5, 2.5, RG); p.px(16, 2, '#ffffff');
    p.ell(4, 39, 4, 2, '#2fb83a'); p.ell(30, 39, 4, 2, '#2fb83a'); p.px(3, 37, '#ff6ab0'); p.px(31, 37, '#ffd166');
  });
  P.mk('beacon', 12, 26, 2, (p, f) => {
    p.rect(2, 22, 8, 4, RU[0]); p.rect(2, 22, 8, 1, RU[3]); p.rect(5, 6, 2, 16, RU[1]); p.rect(5, 6, 1, 16, RU[3]); p.rect(3, 12, 6, 1, GOLD[2]);
    p.sell(6, 4, 3.6, 3.6, f ? ['#0a8a5a', '#2fe08a', '#c8ffd8', '#ffffff'] : ['#4a4a6a', '#7a7a9a', '#a8a8c8']);
  });
  P.mk('chest', 18, 14, 2, (p, f) => {
    p.rect(1, 6, 16, 8, '#a86a2a'); p.rect(1, 6, 16, 1, '#e8a85a'); p.rect(1, 13, 16, 1, '#5a3410'); p.rect(4, 6, 2, 8, GOLD[2]); p.rect(12, 6, 2, 8, GOLD[2]);
    if (!f) { p.rect(1, 2, 16, 5, '#c07a34'); p.rect(1, 2, 16, 1, '#f0b870'); p.rect(7, 4, 4, 3, GOLD[2]); p.px(8, 5, RG); p.px(9, 5, RG); }
    else { p.rect(1, 0, 16, 3, '#c07a34'); p.rect(3, 4, 12, 2, GOLD[3]); p.px(5, 3, '#ffffff'); p.px(12, 3, '#ffffff'); }
  });
  P.mk('holo', 10, 14, 4, (p, f) => {
    const w = [4, 3, 1, 3][f];
    p.tri(5 - w, 7, 5 + w, 7, 5, 0, '#5ee8ff'); p.tri(5 - w, 7, 5 + w, 7, 5, 13, '#2a8ad8'); if (w > 1) { p.line(5, 1, 5, 12, '#d0fcff'); p.px(5 - w + 1, 6, '#ffffff'); }
  });
  P.mk('memory', 10, 12, 2, (p, f) => { p.tri(1, 6, 9, 6, 5, 0, f ? '#ff9a5a' : '#ffd166'); p.tri(1, 6, 9, 6, 5, 11, '#e0283a'); p.px(5, 3, '#ffffff'); p.px(4, 4, '#ffffff'); });
  P.mk('seed', 8, 8, 2, (p, f) => { p.sell(4, 4, 3, 3, ['#c06010', '#ffb030', '#ffe890', '#ffffff']); if (f) p.px(4, 1, '#ffffff'); });
  P.mk('pedestal', 24, 12, 1, p => { p.grad(2, 4, 20, 8, [RU[2], RU[1]]); p.rect(2, 4, 20, 1, GOLD[2]); p.rect(0, 10, 24, 2, RU[0]); for (let x = 5; x < 20; x += 4) p.px(x, 7, RG); });
  P.mk('upgrade', 16, 16, 4, (p, f) => {
    p.sell(8, 8, 6, 6, ['#a05a0a', '#ffb030', '#ffe890', '#ffffff']);
    const a = f * Math.PI / 2; for (let i = 0; i < 4; i++) { const b = a + i * Math.PI / 2; p.px(Math.round(8 + Math.cos(b) * 7), Math.round(8 + Math.sin(b) * 7), '#ffffff'); }
    p.rect(7, 4, 2, 8, '#ffffff'); p.rect(4, 7, 8, 2, '#ffffff');
  });
  P.mk('cage', 30, 32, 2, (p, f) => {
    p.rect(0, 0, 30, 3, MT[2]); p.rect(0, 29, 30, 3, MT[2]); p.rect(0, 0, 30, 1, MT[3]);
    if (!f) for (let x = 2; x < 30; x += 5) { p.rect(x, 3, 2, 26, MT[3]); p.rect(x, 3, 1, 26, '#c8d0e8'); }
    else { for (let x = 2; x < 30; x += 10) { p.rect(x, 3, 2, 4, MT[3]); p.rect(x + 5, 24, 2, 5, MT[3]); } }
    p.px(14, 1, '#ff2a4a'); p.px(15, 1, '#ff2a4a');
  });
  P.mk('r_bio', 8, 8, 1, p => { p.sell(4, 4, 3.5, 3.5, ['#137a2c', '#3ac84a', '#9cff6a', '#ffffff']); p.line(4, 1, 4, 6, '#137a2c'); });
  P.mk('r_scrap', 8, 8, 1, p => { p.ell(4, 4, 3.5, 3.5, '#8a94b0'); p.ell(4, 4, 1.5, 1.5, '#2c303c'); for (const [x, y] of [[4, 0], [0, 4], [7, 4], [4, 7]]) p.px(x, y, '#e0e8f8'); });
  P.mk('r_crys', 8, 10, 1, p => { p.tri(1, 5, 7, 5, 4, 0, '#ffe890'); p.tri(1, 5, 7, 5, 4, 9, '#ffb030'); p.px(3, 3, '#ffffff'); });
  P.mk('xp', 4, 4, 2, (p, f) => { p.rect(1, 0, 2, 4, f ? '#d0fcff' : '#5ee8ff'); p.rect(0, 1, 4, 2, f ? '#d0fcff' : '#5ee8ff'); }, { outline: false });
  P.mk('b_blaster', 10, 4, 2, (p, f) => { p.rect(0, 1, 10, 2, '#ffd166'); p.rect(4, 0, 6, 4, '#fff6c0'); p.rect(7, 1, 3, 2, '#ffffff'); if (f) p.rect(0, 1, 3, 2, '#ff8a3a'); }, { outline: false });
  P.mk('b_spine', 8, 3, 1, p => { p.rect(0, 1, 6, 1, '#9cff6a'); p.rect(4, 0, 2, 3, '#5ccf4a'); p.px(7, 1, '#ffffff'); p.px(6, 1, '#c8ff4a'); }, { vol: false });
  P.mk('b_orb', 8, 8, 2, (p, f) => { p.ell(4, 4, 3.5, 3.5, f ? '#ff5af0' : '#c04ad0'); p.ell(4, 4, 2, 2, '#ffd0ff'); }, { outline: false });
  P.mk('b_red', 8, 4, 1, p => { p.rect(0, 1, 8, 2, '#ff3040'); p.rect(3, 0, 5, 4, '#ff8a8a'); p.rect(5, 1, 3, 2, '#ffffff'); }, { outline: false });
  P.mk('b_glob', 7, 7, 2, (p, f) => { p.ell(3.5, 3.5, 3, 3 - f * 0.5, '#a6ff3a'); p.px(2, 2, '#ffffff'); }, { vol: false });
  P.mk('b_kspine', 12, 5, 1, p => { p.tri(0, 0, 0, 4, 11, 2, '#d03aa0'); p.line(0, 2, 10, 2, '#ffc0ec'); }, { vol: false });
  P.mk('o_pillar', 14, 30, 2, (p, f) => { if (f) { p.grad(3, 18, 8, 12, [RU[2], RU[1]]); p.rect(2, 16, 10, 3, RU[2]); p.tri(3, 18, 8, 18, 4, 14, RU[1]); p.px(4, 20, '#3ab84a'); } else { p.grad(3, 4, 8, 26, [RU[2], RU[1], RU[0]]); p.rect(3, 4, 2, 26, RU[3]); p.rect(1, 1, 12, 4, RU[2]); p.rect(1, 1, 12, 1, GOLD[2]); p.rect(1, 26, 12, 4, RU[0]); p.px(7, 12, RG); p.px(7, 18, RG); p.ell(5, 27, 3, 1.5, '#2fb83a'); } });
};

// ================= ICONOS =================
P.Sprites.buildIcons = function () {
  const ic = (n, fn) => P.mk('i_' + n, 10, 10, 1, fn, { outline: '#05050a', vol: false });
  ic('bio', p => { p.sell(5, 5, 4, 4, ['#137a2c', '#3ac84a', '#9cff6a', '#ffffff']); p.line(5, 1, 5, 8, '#137a2c'); });
  ic('scrap', p => { p.ell(5, 5, 4, 4, '#8a94b0'); p.ell(5, 5, 1.6, 1.6, '#2c303c'); for (const [x, y] of [[5, 0], [0, 5], [9, 5], [5, 9]]) p.px(x, y, '#e0e8f8'); });
  ic('crys', p => { p.tri(2, 5, 8, 5, 5, 0, '#ffe890'); p.tri(2, 5, 8, 5, 5, 9, '#ffb030'); p.px(4, 3, '#ffffff'); });
  ic('heart', p => { p.ell(3, 3.5, 2.5, 2.5, '#ff3a5a'); p.ell(7, 3.5, 2.5, 2.5, '#ff3a5a'); p.tri(0.5, 4, 9.5, 4, 5, 9, '#ff3a5a'); p.px(2, 2, '#ffd0d8'); });
  ic('heartg', p => { p.ell(3, 3.5, 2.5, 2.5, '#5a4a5a'); p.ell(7, 3.5, 2.5, 2.5, '#5a4a5a'); p.tri(0.5, 4, 9.5, 4, 5, 9, '#5a4a5a'); });
  ic('energy', p => { p.tri(6, 0, 1, 6, 5, 6, '#ffd166'); p.tri(4, 4, 9, 4, 3, 10, '#ffd166'); p.px(5, 2, '#ffffff'); });
  ic('shield', p => { p.rect(1, 1, 8, 5, '#5ee8ff'); p.tri(1, 5, 9, 5, 5, 9.5, '#5ee8ff'); p.rect(3, 2, 2, 3, '#d0fcff'); });
  ic('blaster', p => { p.rect(0, 3, 8, 3, '#8a94b0'); p.rect(7, 3, 3, 2, '#e0e8f8'); p.rect(1, 6, 2, 3, '#4a5068'); p.px(4, 4, '#ff3a5a'); });
  ic('spines', p => { for (let i = 0; i < 3; i++) p.line(0, 2 + i * 3, 9, 1 + i * 3 + (i - 1), '#9cff6a'); p.px(9, 4, '#ffffff'); });
  ic('xp', p => { p.rect(4, 0, 2, 10, '#5ee8ff'); p.rect(0, 4, 10, 2, '#5ee8ff'); p.rect(3, 3, 4, 4, '#d0fcff'); });
  ic('star', p => { p.tri(5, 0, 2, 9, 8, 9, '#ffd166'); p.tri(0, 3, 10, 3, 5, 7, '#ffd166'); });
  ic('skull', p => { p.sell(5, 4, 4, 4, ['#b0a890', '#f0ead8', '#ffffff']); p.rect(3, 7, 4, 2, '#f0ead8'); p.px(3, 4, '#140a10'); p.px(6, 4, '#140a10'); });
  ic('leaf', p => { p.ell(5, 5, 3, 4.5, '#5ccf4a'); p.line(5, 1, 5, 9, '#137a2c'); });
  ic('paw', p => { p.ell(5, 6.5, 3, 2.5, '#e8f4ff'); for (const x of [1.5, 4, 6, 8.5]) p.ell(x, 2.5, 1.2, 1.4, '#e8f4ff'); });
  ic('lock', p => { p.rect(1, 4, 8, 6, '#7c8aa8'); p.rect(2, 0, 6, 1, '#7c8aa8'); p.rect(2, 0, 1, 5, '#7c8aa8'); p.rect(7, 0, 1, 5, '#7c8aa8'); p.px(5, 7, '#1a1a1a'); });
  ic('jump', p => { p.tri(1, 9, 9, 9, 5, 4, '#ffb030'); p.tri(2, 5, 8, 5, 5, 0, '#ffe890'); });
  ic('mem', p => { p.tri(1, 5, 9, 5, 5, 0, '#ffd166'); p.tri(1, 5, 9, 5, 5, 10, '#e0283a'); });
  ic('holo', p => { p.tri(2, 5, 8, 5, 5, 0, '#5ee8ff'); p.tri(2, 5, 8, 5, 5, 10, '#2a8ad8'); });
  ic('trophy', p => { p.rect(2, 0, 6, 5, '#ffd166'); p.rect(4, 5, 2, 3, '#ffb030'); p.rect(2, 8, 6, 2, '#a06010'); p.px(1, 1, '#ffd166'); p.px(8, 1, '#ffd166'); });
};

// ================= MAPA EXTERIOR =================
P.Sprites.buildOverworld = function () {
  for (const st of ['c', 'r']) {
    const pal = P.PAL.verzara[st], T = pal.top;
    P.mk('o_grass_' + st, 16, 16, 3, (p, v) => {
      const r = P.RNG(300 + v + (st === 'c' ? 9 : 0)); p.rect(0, 0, 16, 16, T[1]);
      for (let i = 0; i < 14; i++) { const x = r.int(0, 15), y = r.int(1, 15); p.px(x, y, r() < 0.5 ? T[0] : T[2]); p.px(x, y - 1, T[2]); }
      if (v === 2) { const c = r.pick(pal.flower); p.px(5, 6, c); p.px(6, 6, c); p.px(5, 5, '#ffffff'); p.px(11, 11, r.pick(pal.flower)); }
      if (v === 1) p.px(9, 4, T[3]);
    }, { outline: false });
    P.mk('o_water_' + st, 16, 16, 2, (p, f) => { p.grad(0, 0, 16, 16, [pal.liq[2], pal.liq[1]]); for (let i = 0; i < 4; i++) p.rect((i * 5 + f * 3) % 14, (i * 4 + 2) % 16, 3, 1, pal.liq[3]); }, { outline: false });
    P.mk('o_tree_' + st, 34, 42, 2, (p, f) => {
      const r = P.RNG(600 + f + (st === 'c' ? 5 : 0));
      p.rect(14, 24, 6, 16, pal.trunk[1]); p.rect(14, 24, 2, 16, pal.trunk[2]); p.tri(10, 40, 14, 32, 15, 40, pal.trunk[0]); p.tri(24, 40, 20, 32, 19, 40, pal.trunk[0]);
      P.Sprites.foliage(p, 17, 15, 16, 11, pal.leaf, r, pal.flower, pal.glow);
    });
    P.mk('o_goo', 16, 16, 2, (p, f) => { p.ell(8, 8, 7, 6, '#4a8a10'); p.ell(8, 8, 5.5, 4.5, '#9ae020'); p.px(6 + f, 6, '#f0ffc0'); p.px(10, 9 - f, '#c8ff4a'); p.ell(4, 11, 1.5, 1, '#e05ed8'); }, { outline: false });
  }
  P.mk('o_path', 16, 16, 2, (p, v) => { const r = P.RNG(400 + v); p.rect(0, 0, 16, 16, '#c8a070'); for (let i = 0; i < 14; i++) p.px(r.int(0, 15), r.int(0, 15), r() < 0.5 ? '#e0bc88' : '#a87e50'); }, { outline: false });
  P.mk('o_stone', 16, 16, 1, p => { p.rect(0, 0, 16, 16, RU[1]); p.rect(0, 0, 16, 1, RU[3]); p.rect(0, 8, 16, 1, RU[0]); p.rect(8, 0, 1, 8, RU[0]); p.rect(4, 8, 1, 8, RU[0]); p.px(12, 3, RG); }, { outline: false });
  P.mk('o_rock', 16, 16, 1, p => { p.sell(8, 9, 7, 6, ['#4a4068', '#7a6aa0', '#a898c8', '#e0d8f8']); p.ell(5, 13, 3, 1.5, '#2fb83a'); });
  P.mk('o_portal', 26, 20, 4, (p, f) => {
    p.ell(13, 12, 12, 7, RU[0]); p.ell(13, 11, 11, 6, RU[1]); p.ell(13, 11, 8, 4, ['#3a1a6a', '#0a6a6a', '#8a6a0a', '#6a0a1a'][f]); p.ell(12, 10, 5, 2, ['#7a4ab0', '#3ae0c0', '#ffd166', '#ff3a5a'][f]);
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; p.px(Math.round(13 + Math.cos(a) * 10), Math.round(11 + Math.sin(a) * 5.5), f === 1 ? '#5ef0d0' : f === 2 ? '#ffd166' : f === 3 ? '#ff3040' : '#b48cff'); }
  });
  P.mk('o_house', 44, 38, 2, (p, f) => {
    if (!f) { p.rect(4, 22, 36, 14, RU[0]); p.tri(4, 22, 14, 10, 18, 22, RU[1]); p.rect(26, 18, 8, 18, RU[1]); p.rect(12, 28, 6, 8, '#2a1a2a'); p.ell(30, 32, 6, 2, '#7ac020'); return; }
    p.rect(6, 20, 32, 16, '#f4faff'); p.rect(6, 20, 2, 16, '#b0c4e0'); p.sell(22, 20, 17, 12, ['#1a9a6a', '#3ad89a', '#a8ffd8', '#ffffff']);
    p.rect(18, 26, 8, 10, '#5a3a1a'); p.rect(19, 27, 6, 9, '#6fe39a'); p.rect(9, 25, 5, 4, '#6ad8ff'); p.rect(30, 25, 5, 4, '#6ad8ff'); p.px(22, 8, '#ffd166');
    for (let i = 0; i < 4; i++) p.px(8 + i * 9, 35, ['#ff5aa8', '#ffd166', '#6ad8ff', '#ff8a3a'][i]);
  });
  P.mk('o_ship', 96, 44, 2, (p, f) => P.Sprites.shipSide(p, 96, 44, f));
  P.mk('ship_big', 192, 88, 2, (p, f) => P.Sprites.shipSide(p, 192, 88, f));
  P.mk('o_flower', 8, 8, 3, (p, v) => { const c = ['#ff5aa8', '#ffd166', '#6ad8ff'][v]; p.line(4, 7, 4, 4, '#2fb83a'); p.ell(4, 3, 2, 2, c); p.px(4, 3, '#ffffff'); });
  P.mk('o_lamp', 10, 16, 2, (p, f) => { p.line(5, 15, 5, 6, '#2a8a3a'); p.sell(5, 4, 3.5, 3.5 + f * 0.3, ['#0a8aa8', '#2ae0e8', '#b0fff8', '#ffffff']); });
};
P.Sprites.buildSil = function () {
  const K = '#3a3a4a', sil = (id, fn) => P.mk('sil_' + id, 48, 48, 1, fn, { outline: false });
  sil('zarmakh', p => { for (let i = 0; i < 40; i++) p.ell(4 + i, 30 + Math.sin(i * 0.25) * 10 - i * 0.4, 6 - i * 0.05, 6, K); p.tri(40, 8, 47, 4, 44, 14, K); });
  sil('glorvax', p => { p.ell(24, 24, 15, 15, K); for (let i = 0; i < 10; i++) { const a = i / 10 * 7; p.tri(24 + Math.cos(a) * 12, 24 + Math.sin(a) * 12, 24 + Math.cos(a + 0.3) * 12, 24 + Math.sin(a + 0.3) * 12, 24 + Math.cos(a + 0.15) * 22, 24 + Math.sin(a + 0.15) * 22, K); } });
  sil('thalzor', p => { p.ell(24, 14, 13, 11, K); for (let i = 0; i < 6; i++) for (let k = 0; k < 24; k++) p.rect(Math.round(13 + i * 4.4 + Math.sin(k * 0.4 + i) * 3), 22 + k, 2, 2, K); });
  sil('arachnara', p => { p.ell(24, 22, 9, 8, K); p.ell(24, 33, 12, 9, K); for (const s of [-1, 1]) for (let i = 0; i < 4; i++) { p.thick(24 + s * 6, 22 + i * 3, 24 + s * (16 + i * 2), 10 + i * 5, 2, K); p.thick(24 + s * (16 + i * 2), 10 + i * 5, 24 + s * (21 + i), 46, 2, K); } });
  sil('mykaron', p => { p.ell(24, 14, 22, 11, K); p.rect(17, 18, 14, 28, K); p.thick(17, 26, 6, 18, 3, K); p.thick(31, 26, 42, 18, 3, K); });
  sil('zyrkalia', p => { p.ell(24, 20, 16, 16, K); for (const s of [-1, 1]) { p.thick(24 + s * 8, 32, 24 + s * 18, 46, 2, K); p.thick(24 + s * 4, 34, 24 + s * 8, 47, 2, K); } });
  sil('magnarok', p => { p.ell(24, 22, 18, 13, K); for (const x of [12, 20, 28, 36]) p.rect(x - 3, 30, 6, 17, K); p.thick(10, 22, 2, 36, 3, K); p.ell(8, 30, 8, 3, K); p.tri(18, 10, 22, 2, 26, 10, K); });
  sil('azhyrion', p => { for (let i = 0; i < 46; i++) p.ell(2 + i, 30 + Math.sin(i * 0.2) * 8, 4, 4, K); p.tri(16, 26, 30, 26, 10, 2, K); p.tri(22, 26, 36, 26, 40, 4, K); p.ell(44, 22, 5, 4, K); });
};

// (el exterior de la nave está en space_art.js)


// juego de arte por planeta: prefijo de sprites y cielos
P.ART = P.ART || {}; P.ART.verzara = { p: '', skies: P.SKIES };
