'use strict';
// MYKORIS — El Bosque de las Esporas Pensantes: arte del planeta (prefijo «my_»).
// Hongos gigantes, micelio luminoso, esporas flotantes. Contaminado: podredumbre gris-violeta y esporas enfermas.
// Restaurado: verde esmeralda y ácido, turquesa, violeta, magenta y azul bioluminiscente sobre marrones orgánicos y cremas.
P.PAL.mykoris = {
  c: { soil: ['#120c10', '#1e161a', '#2c2026', '#3e3036'], vein: '#7a5a8a', top: ['#2a2430', '#3a3242', '#4e4458', '#665a70'],
    liq: ['#0a060c', '#1e1028', '#3a1e48', '#8a6aa0'], thorn: ['#3a2a3a', '#5a4458', '#7a6278', '#a090a8'],
    leaf: ['#2a2430', '#3e3446', '#564a60', '#72667c'], trunk: ['#2a2226', '#3e3438', '#564a4e'], glow: '#9a7aa8', flower: ['#7a5a7a', '#6a5a8a', '#8a6a6a'] },
  r: { soil: ['#140a08', '#24140e', '#382218', '#4e3222'], vein: '#5ef0a0', top: ['#0e3a2a', '#16804a', '#3ad070', '#a8ff7a'],
    liq: ['#04202a', '#0a5a6a', '#1ac0b0', '#bffff0'], thorn: ['#5a1a6a', '#a03ad0', '#e07aff', '#ffe0ff'],
    leaf: ['#3a1a5a', '#7a3ac0', '#c06aff', '#f0c8ff'], trunk: ['#cdbfa0', '#e8dcc0', '#fff4dc'], glow: '#5ef0a0', flower: ['#ff7ad8', '#5ef0a0', '#5ac8ff', '#ffe08a'] }
};
P.MYC = { cap: ['#7a2a10', '#d05a1a', '#ff9a3a', '#ffe0b0'], gill: ['#0a1a4a', '#1a4aa0', '#3a8ae8', '#9ad8ff'], mag: ['#5a0a3a', '#a01a6a', '#e03a9a', '#ff9ad8'], stem: ['#8a7a90', '#c8b8c8', '#ece4ec', '#ffffff'], gre: ['#0a4a2a', '#1aa050', '#5ef0a0', '#d8ffe0'], vio: ['#3a1a6a', '#7a3ac0', '#c06aff', '#f0d8ff'], tq: ['#0a4a5a', '#1aa0b0', '#5af0f0', '#d8ffff'] };
// cada zona (nivel) tiene su propia combinación de luz bioluminiscente
P.MY_ZONE = { 1: ['#5ef0a0', '#c06aff'], 2: ['#c06aff', '#5ac8ff'], 3: ['#5af0f0', '#5ef0a0'], 4: ['#a8ff3a', '#ff7ad8'], 5: ['#ffe08a', '#5ef0a0'], 6: ['#5ac8ff', '#ff7ad8'], 7: ['#ff7ad8', '#c06aff'], 8: ['#5ef0a0', '#5af0f0'], 9: ['#c06aff', '#ffe08a'], 10: ['#5ef0a0', '#5ac8ff'], 11: ['#ff7ad8', '#5ef0a0'] };
P.SKIES_M = {
  day: { r: ['#0a1a3a', '#123a5a', '#1a6a7a', '#3aa08a', '#8ae0b0'], c: ['#141420', '#22202e', '#302c3e', '#423c50', '#565064'] },
  golden: { r: ['#1a0a3a', '#3a1a6a', '#7a3a8a', '#c06a8a', '#ffb08a'], c: ['#18141e', '#28222e', '#3a3040', '#4e4252', '#625464'] },
  dusk: { r: ['#04041a', '#0a0a2e', '#1a124a', '#2a1a6a', '#3a3a8a'], c: ['#06060c', '#0c0c16', '#141220', '#1e1a2c', '#2a2438'] }
};
P.HERO_SKINS.micelial = { name: 'Armadura Micelial', d: '#2a0a3a', m: '#7a3ac0', l: '#5ef0a0', h: '#d8ffe0', j: '#140620', e: '#ffffff', eg: '#ff7ad8', acc: '#ff9a3a', w: '#f0ffe8' };
P.SUIT_STYLE = P.SUIT_STYLE || {}; P.SUIT_STYLE.micelial = 'fungi';
P.ART = P.ART || {};
P.ART.mykoris = {
  p: 'my_', skies: P.SKIES_M, owMusic: 'mykoris_ow',
  owAmb: lf => 'rgba(4,6,20,' + (0.3 - lf * 0.18) + ')',
  flora: { L: 'farolfungo', F: 'velohifa', m: 'bombaspora_flor', U: 'copa_lunar', h: 'seta_balsamo', y: 'orquidea_micelial', lily: 'disco_flotante', g: 'pacespora', legend: 'micoforo' },
  tileFlora: { b: 'seta_resorte', '|': 'cordon_hifal', '^': 'espinagarra' }
};

// SETA gigante genérica: tallo (con curva), sombrero de geometría variable y láminas luminosas debajo
P.Sprites.myShroom = function (p, x, y, h, w, cap, gill, stem, o = {}) {
  const lean = o.lean || 0, shape = o.shape || 'dome', ch = o.capH || w * 0.5;
  for (let i = 0; i < h; i++) { const t = i / h, sw = (o.stemW || w * 0.18) * (1 - t * 0.25) + (i < 4 ? 2 : 0), sx = x + lean * t * t * h * 0.3; p.rect(Math.round(sx - sw), Math.round(y - i), Math.max(1, Math.round(sw * 2)), 1, stem[(i >> 3) % 2 ? 1 : 2]); p.px(Math.round(sx - sw), y - i, stem[3] || stem[2]); p.px(Math.round(sx + sw) - 1, y - i, stem[0]); }
  const cx = x + lean * h * 0.3, cy = y - h;
  // láminas
  for (let k = -8; k <= 8; k++) p.line(cx, cy + 2, cx + k * w / 9, cy + 1, gill[k % 2 ? 1 : 2]);
  p.line(cx - w, cy + 1, cx + w, cy + 1, gill[0]);
  // sombrero
  for (let yy = 0; yy < ch; yy++) {
    const t = yy / ch, ww = shape === 'flat' ? w * (1 - t * t * t) : shape === 'cone' ? w * (1 - t) : shape === 'bell' ? w * Math.sqrt(1 - t) * (0.7 + 0.3 * (1 - t)) : w * Math.sqrt(1 - t * t);
    p.rect(Math.round(cx - ww), Math.round(cy - yy), Math.round(ww * 2), 1, yy < 2 ? cap[0] : t > 0.75 ? cap[2] : cap[1]);
    p.px(Math.round(cx - ww * 0.5), cy - yy, cap[2]);
  }
  if (o.spots) for (let k = 0; k < o.spots; k++) { const a = -Math.PI * (0.15 + 0.7 * ((k * 0.618) % 1)), rr = w * 0.6 * ((k * 0.37) % 1 + 0.3); p.ell(cx + Math.cos(a) * rr, cy - ch * 0.35 + Math.sin(a) * ch * 0.4, 1.6, 1.2, cap[3]); }
  if (o.drips) for (let k = 0; k < o.drips; k++) { const dx = cx - w + (k + 0.5) * (2 * w / o.drips), dl = 3 + ((k * 7) % 9); for (let j = 0; j < dl; j++) p.px(dx, cy + 2 + j, j === dl - 1 ? '#ffffff' : gill[2]); }
};

P.Sprites.buildMykoris = function () {
  const K = P.PAL.mykoris, M = P.MYC;
  for (const st of ['c', 'r']) {
    const pal = K[st], s = pal.soil, t = pal.top, on = st === 'r', G = on ? M.gre : ['#2a2430', '#3e3446', '#564a60', '#72667c'], V = on ? M.vio : G;
    // suelo orgánico con hilos de micelio luminoso
    P.mk('my_t_soil_' + st, 16, 16, 3, (p, v) => { const r = P.RNG(1410 + v + (on ? 9 : 0)); p.rect(0, 0, 16, 16, s[1]); for (let k = 0; k < 6; k++) p.px(r.int(0, 15), r.int(0, 15), s[2]); for (let k = 0; k < 2; k++) p.ell(r.int(2, 13), r.int(2, 13), 1.6, 1, s[0]); let x = r.int(0, 15), y = r.int(0, 4); for (let k = 0; k < 14; k++) { p.px(x, y, v === 1 ? pal.vein : s[3]); x += r() < 0.5 ? 1 : 0; y += 1; if (r() < 0.3) x -= 1; } if (v === 2) { p.px(r.int(3, 12), r.int(3, 12), pal.vein); p.px(r.int(3, 12), r.int(3, 12), on ? '#c06aff' : s[3]); } }, { outline: false });
    // manto fúngico con setitas y musgo
    P.mk('my_t_top_' + st, 16, 9, 3, (p, v) => { const r = P.RNG(1430 + v + (on ? 9 : 0)); p.rect(0, 3, 16, 4, t[1]); p.rect(0, 3, 16, 1, t[2]); p.rect(0, 6, 16, 1, t[0]); for (let x = 0; x < 16; x++) if (r() < 0.4) p.px(x, 2, t[2]); const n = v + 1; for (let k = 0; k < n; k++) { const x = r.int(1, 14), h = r.int(1, 3), col = on ? P.pick([M.cap, M.vio, M.tq, M.mag]) : [s[2], s[3], s[3]]; for (let y = 0; y < h; y++) p.px(x, 3 - y, M.stem[1]); p.rect(x - 1, 2 - h, 3, 1, col[1] || col[0]); p.px(x, 1 - h, col[2] || col[1]); } }, { outline: false });
    P.mk('my_t_bot_' + st, 16, 7, 2, (p, v) => { const r = P.RNG(1450 + v); for (let k = 0; k < 3; k++) { const x = r.int(1, 14), l = r.int(2, 6); for (let y = 0; y < l; y++) p.px(x + (y % 3 === 2 ? 1 : 0), y, y === l - 1 ? pal.vein : s[3]); } });
    P.mk('my_tdeco_' + st, 16, 14, 6, (p, v) => {
      const col = [on ? M.cap : G, on ? M.vio : G, on ? M.tq : G, on ? M.mag : G, on ? M.gre : G, on ? M.gill : G][v];
      if (v === 0) { P.Sprites.myShroom(p, 8, 13, 6, 5, col, M.gill, M.stem, { spots: 3, shape: 'dome' }); }
      if (v === 1) { for (let k = 0; k < 3; k++) P.Sprites.myShroom(p, 4 + k * 4, 13, 3 + k, 2, col, col, M.stem, { shape: 'cone', capH: 3 }); }
      if (v === 2) { p.ell(8, 12, 6, 2, col[1]); for (let k = 0; k < 5; k++) p.px(3 + k * 2.5, 11, col[3]); }
      if (v === 3) { for (let k = 0; k < 4; k++) { for (let j = 0; j < 6 + k; j++) p.px(3 + k * 3 + Math.sin(j * 0.6) * 0.8, 13 - j, col[1]); p.px(3 + k * 3, 6 - k, col[3]); } }
      if (v === 4) { P.Sprites.myShroom(p, 7, 13, 8, 4, col, col, M.stem, { shape: 'bell', capH: 4 }); P.Sprites.myShroom(p, 12, 13, 4, 2, col, col, M.stem, {}); }
      if (v === 5) { p.sell(8, 11, 5, 3, [s[1], s[2], s[3]]); for (let k = 0; k < 4; k++) p.px(5 + k * 2, 9, on ? '#5ef0a0' : s[3]); }
    });
    const lq = pal.liq;
    P.mk('my_t_liq_' + st, 16, 16, 4, (p, f) => { for (let x = 0; x < 16; x++) { const h = Math.round(2 + Math.sin((x + f * 4) * 0.3) * 1); for (let y = h; y < 16; y++) p.dith(x, y, y < h + 4 ? lq[2] : lq[1], lq[1], y < h + 4 ? (y - h) / 4 : 0); p.px(x, h, lq[3]); } for (let i = 0; i < 2; i++) p.ell((i * 8 + f * 2) % 16, 7 + i * 4, 1.2, 1.2, lq[3]); }, { outline: false });
    P.mk('my_t_liqb_' + st, 16, 16, 4, (p, f) => { p.grad(0, 0, 16, 16, [lq[1], P.Col.mix(lq[1], lq[0], 0.6)]); for (let i = 0; i < 4; i++) p.px((i * 5 + f * 2) % 16, (i * 7 + f * 3) % 16, lq[2]); }, { outline: false });
    // espinagarra: hongo de púas venenosas (daña)
    P.mk('my_t_thorn_' + st, 16, 16, 2, (p, f) => { p.ell(8, 14, 8, 2.5, s[2]); for (let i = 0; i < 5; i++) { const x = 2 + i * 3 + f, h = 6 + (i % 2) * 5; p.thick(x, 14, x + (i % 2 ? 1 : -1), 14 - h, 2, pal.thorn[1]); p.px(x + (i % 2 ? 1 : -1), 14 - h, pal.thorn[3]); p.ell(x, 13 - h * 0.5, 1, 1, pal.thorn[2]); } });
    // cordón hifal (se trepa)
    P.mk('my_t_vine_' + st, 16, 16, 2, (p, v) => { for (let y = 0; y < 16; y++) { const x = 8 + Math.round(Math.sin((y + v * 8) * 0.4) * 1.5); p.px(x, y, M.stem[1]); p.px(x + 1, y, M.stem[0]); if (y % 4 === 1) { p.px(x - 1, y, on ? '#5ef0a0' : s[3]); p.px(x + 2, y + 1, on ? '#c06aff' : s[3]); } } });
    // repisa de hongo (plataforma de un sentido)
    P.mk('my_t_branch_' + st, 16, 8, 2, (p, v) => { const C = on ? (v ? M.cap : M.tq) : G; p.rect(0, 2, 16, 3, C[1]); p.rect(0, 2, 16, 1, C[2]); for (let x = 1; x < 16; x += 3) p.line(x, 5, x + 1, 6, on ? M.gill[2] : G[0]); p.px(4 + v * 6, 1, C[3]); });
    // seta resorte (rebote elástico)
    P.mk('my_t_bulb_' + st, 16, 16, 3, (p, f) => { const sq = [0, 3, 1][f]; p.rect(7, 10 + sq, 2, 6 - sq, M.stem[1]); for (let yy = 0; yy < 6 - sq; yy++) { const ww = 7.5 * Math.sqrt(1 - (yy / (6 - sq)) ** 2) + sq * 0.6; p.rect(Math.round(8 - ww), 11 + sq - yy, Math.round(ww * 2), 1, yy < 2 ? (on ? M.mag[0] : G[0]) : (on ? M.mag[1] : G[1])); } for (let k = 0; k < 3; k++) p.px(4 + k * 4, 8 + sq, on ? M.mag[3] : G[3]); });
  }
  // ruinas pleyadianas cultivadas: corteza de hongo trenzada con nódulos
  P.mk('my_t_ruin', 16, 16, 3, (p, v) => { p.grad(0, 0, 16, 16, ['#e8dcc0', '#cdbfa0', '#a89878']); for (let y = 2; y < 16; y += 4) p.line(0, y, 15, y + (v % 2 ? 1 : -1), '#8a7a5a'); p.ell(5 + v * 3, 8, 1.6, 1.6, '#5ef0a0'); p.rect(0, 15, 16, 1, '#6a5a3a'); }, { outline: false });
  P.mk('my_t_ruintop', 16, 6, 1, p => { p.rect(0, 2, 16, 2, '#fff4dc'); for (let x = 1; x < 16; x += 4) { p.px(x, 1, '#c06aff'); p.px(x, 0, '#f0d8ff'); } }, { outline: false });
  P.mk('my_t_crack', 16, 16, 1, p => { p.rect(0, 0, 16, 16, '#3a2a2a'); for (let k = 0; k < 5; k++) p.line(k * 4, 0, k * 4 + 2, 16, '#2a1a1a'); p.line(3, 3, 12, 12, '#7a5a8a'); p.line(12, 3, 4, 13, '#7a5a8a'); }, { outline: false });
  // zona de crecimiento: carne fúngica que se retrae con la energía del micelio (f0 crecida · f1 brotando · f2 retraída)
  P.mk('my_t_unstable', 16, 16, 3, (p, f) => { if (f === 2) { p.ell(8, 15, 6, 1.5, '#3a1a4a'); return; } const g = f ? 4 : 0; p.rect(1, g, 14, 16 - g, '#5a1a5a'); p.rect(1, g, 14, 2, '#a03a9a'); for (let k = 0; k < 4; k++) p.ell(3 + k * 3.5, g + 5 + (k % 2) * 5, 1.5, 1.5, '#e07aff'); p.line(1, 15, 14, 15, '#2a0a2a'); }, { outline: false });
  // membrana micelial (se abre con la energía de un nodo)
  P.mk('my_t_gate', 16, 16, 2, (p, f) => { p.rect(2, 0, 12, 16, f ? '#1a6a5a' : '#145a4a'); for (let y = 0; y < 16; y += 3) p.line(2, y + (f ? 1 : 0), 13, y + 2, '#5ef0a0'); p.rect(2, 0, 1, 16, '#0a2a22'); p.rect(13, 0, 1, 16, '#0a2a22'); p.px(8, 8, '#d8ffe0'); }, { outline: false });
  // plataforma-pétalo (flor fúngica que se abre y se cierra; f1 = cerrada)
  P.mk('my_t_phase', 16, 8, 2, (p, f) => { if (f) { for (let x = 0; x < 16; x += 3) p.px(x, 4, '#c06aff'); return; } p.ell(8, 4, 8, 2.6, '#a03ad0'); p.ell(8, 3, 6, 1.4, '#e07aff'); p.px(8, 3, '#ffe0ff'); for (let x = 1; x < 16; x += 5) p.px(x, 6, '#5a1a6a'); });

  // ================= FONDOS (según la referencia: bosque bioluminiscente bajo un cielo estrellado) =================
  const bgSky = (st, sky) => {
    const SK = P.SKIES_M[sky], p = new P.Painter(P.W, P.H), r = P.RNG(st === 'c' ? 1501 : 1502); p.grad(0, 0, P.W, P.H, SK[st]);
    for (let i = 0; i < 120; i++) p.px(r.int(0, P.W), r.int(0, 160), st === 'r' ? P.pick(['#ffffff', '#5ef0a0', '#c06aff', '#5af0f0', '#ffe08a']) : P.pick(['#8a8098', '#5a5468']));
    for (let i = 0; i < 9; i++) { const x = r.int(10, P.W - 10), y = r.int(10, 130), c2 = st === 'r' ? P.pick(['#5af0f0', '#ff9ad8', '#ffe08a']) : '#9a90a8'; p.px(x, y, '#ffffff'); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) p.px(x + dx, y + dy, c2); if (i % 3 === 0) for (const [dx, dy] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) p.px(x + dx, y + dy, c2); }
    const c = p.canvas(), x = c.getContext('2d');
    // luna verdosa con halo
    const mx = sky === 'golden' ? 110 : 360, my = sky === 'golden' ? 70 : 44;
    x.globalCompositeOperation = 'lighter'; const g = x.createRadialGradient(mx, my, 6, mx, my, 80); g.addColorStop(0, st === 'r' ? 'rgba(120,255,200,0.45)' : 'rgba(150,140,170,0.3)'); g.addColorStop(1, 'rgba(60,120,120,0)'); x.fillStyle = g; x.fillRect(mx - 80, my - 80, 160, 160); x.globalCompositeOperation = 'source-over';
    x.fillStyle = st === 'r' ? '#d8ffe8' : '#b8b0c0'; x.beginPath(); x.arc(mx, my, 12, 0, 7); x.fill(); x.fillStyle = st === 'r' ? '#9ae8c8' : '#8a8298'; x.beginPath(); x.arc(mx - 4, my - 2, 3, 0, 7); x.arc(mx + 4, my + 4, 2, 0, 7); x.fill();
    const hz = x.createLinearGradient(0, 130, 0, 210); hz.addColorStop(0, 'rgba(60,200,180,0)'); hz.addColorStop(1, st === 'r' ? 'rgba(60,220,190,0.28)' : 'rgba(110,100,130,0.25)'); x.fillStyle = hz; x.fillRect(0, 130, P.W, 80);
    return c;
  };
  for (const sky in P.SKIES_M) for (const st of ['c', 'r']) P.mkCanvas('my_bg_sky_' + st + '_' + sky, [bgSky(st, sky)]);
  for (const st of ['c', 'r']) {
    const on = st === 'r', dim = c2 => on ? c2 : P.Col.mix(c2, '#3a3448', 0.75);
    // lejos: siluetas de setas colosales sobre colinas de micelio
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(on ? 1512 : 1511); let g = 60; for (let x = 0; x < W; x++) { g += r.range(-2, 2); g = P.clamp(g, 40, 90); p.rect(x, P.H - g, 1, g, on ? '#123a4a' : '#1e1c2a'); }
      for (let i = 0; i < 8; i++) { const x = 30 + i * 80 + r.int(-20, 20), h = r.int(60, 120), w = r.int(18, 34); P.Sprites.myShroom(p, x, P.H - 50, h, w, [dim('#1a5a6a'), dim('#2a7a8a'), dim('#3a9aa0'), dim('#5ac0c0')], [dim('#2aa0a0'), dim('#3ac0c0'), dim('#7ae8e0'), dim('#bff8f0')], [dim('#2a4a5a'), dim('#2e5466'), dim('#3a6070'), dim('#4a7080')], { shape: P.pick(['flat', 'dome', 'bell']), drips: on ? 5 : 0 }); }
      P.mkCanvas('my_bg_far_' + st, [p.canvas()]); }
    // medio: bosque luminoso de setas y torres fúngicas
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(on ? 1522 : 1521);
      for (let i = 0; i < 12; i++) { const x = 20 + i * 54 + r.int(-14, 14), h = r.int(40, 90), w = r.int(12, 26), col = P.pick([P.MYC.gre, P.MYC.vio, P.MYC.tq]); P.Sprites.myShroom(p, x, P.H - 24, h, w, col.map(dim), col.map(dim), [dim('#5a4a6a'), dim('#6a5a7a'), dim('#7a6a8a'), dim('#8a7a9a')], { shape: P.pick(['flat', 'dome', 'flat']), drips: on ? 7 : 0, lean: r.range(-0.2, 0.2) }); }
      for (let x = 0; x < W; x++) { const y = P.H - 26 + Math.round(Math.sin(x * 0.05) * 3); p.rect(x, y, 1, P.H - y, on ? '#0e2a22' : '#16141e'); }
      P.mkCanvas('my_bg_mid_' + st, [p.canvas()]); }
    // cerca: matorral de setas pequeñas de colores (crema, naranja, violeta)
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(on ? 1532 : 1531);
      for (let x = 0; x < W; x++) { const y = Math.round(P.H - 14 + Math.sin(x * 0.07) * 3); p.rect(x, y, 1, P.H - y, on ? '#0a1e16' : '#100e16'); }
      for (let i = 0; i < 26; i++) { const col = P.pick([P.MYC.cap, P.MYC.vio, P.MYC.gre, P.MYC.mag]); P.Sprites.myShroom(p, r.int(0, W), P.H - 10, r.int(6, 16), r.int(4, 9), col.map(dim), col.map(dim), P.MYC.stem.map(dim), { spots: on ? 3 : 0, shape: 'dome' }); }
      P.mkCanvas('my_bg_near_' + st, [p.canvas()]); }
    // árboles gigantes base: sombrilla luminosa que gotea (v0) y torre de sombreros escalonados (v1)
    P.mk('my_bigtree_' + st, 110, 190, 2, (p, v) => {
      const cap = on ? (v ? P.MYC.vio : P.MYC.gre) : [dim('#2a3a3a'), dim('#3a5a5a'), dim('#4a7070'), dim('#6a9090')], gill = on ? P.MYC.gill : cap;
      if (v === 0) { P.Sprites.myShroom(p, 55, 188, 150, 46, cap, on ? P.MYC.gre : cap, P.MYC.stem.map(dim), { shape: 'flat', capH: 16, drips: 12, lean: -0.1 }); return; }
      for (let i = 0; i < 180; i++) { const sw = 6 - i / 60; p.rect(Math.round(55 - sw), 188 - i, Math.round(sw * 2), 1, P.MYC.stem.map(dim)[(i >> 3) % 2 ? 1 : 2]); }
      for (let k = 0; k < 5; k++) { const yy = 188 - 40 - k * 32, w = 30 - k * 4; for (let q = 0; q < 6; q++) { const ww = w * Math.sqrt(1 - (q / 6) ** 2); p.rect(Math.round(55 - ww), yy - q, Math.round(ww * 2), 1, cap[q < 2 ? 0 : q > 4 ? 2 : 1]); } p.line(55 - w, yy + 1, 55 + w, yy + 1, gill[2]); }
    }, { up: 0.1, down: 0.15, dark: 0.5 });
  }
  // caverna fúngica
  { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(1541); p.grad(0, 0, W, P.H, ['#060a10', '#0a1018', '#0c121c', '#060a0e']);
    for (let l = 0; l < 2; l++) { let g = 30 + l * 18; for (let x = 0; x < W; x++) { g += r.range(-3, 3); g = P.clamp(g, 14 + l * 14, 64 + l * 14); p.rect(x, 0, 1, Math.round(g - l * 12), l ? '#0a0e14' : '#101620'); const gb = Math.round(P.H - g + l * 10); p.rect(x, gb, 1, P.H - gb, l ? '#0a0e14' : '#101620'); } }
    for (let i = 0; i < 30; i++) { const col = P.pick([P.MYC.gre, P.MYC.tq, P.MYC.vio]); P.Sprites.myShroom(p, r.int(0, W), r() < 0.5 ? P.H - r.int(20, 50) : r.int(30, 60), r.int(6, 20), r.int(4, 10), col, col, P.MYC.stem, { shape: 'dome', drips: 3 }); }
    P.mkCanvas('my_bg_cave', [p.canvas()]); }

  // ================= FLORA =================
  for (const st of ['c', 'r']) { const on = st === 'r', G = ['#2a2430', '#3e3446', '#564a60', '#72667c'];
    // VELOHIFA: frondas de hifas plumosas
    P.mk('my_fern_' + st, 22, 16, 2, (p, f) => { for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.4 + f * 0.05; let x = 11, y = 15; for (let j = 0; j < 12; j++) { x += Math.cos(a); y += Math.sin(a); p.px(x, y, on ? P.MYC.tq[1] : G[1]); if (j % 2) p.px(x + 1, y - 1, on ? P.MYC.tq[2] : G[2]); } p.px(x, y, on ? '#ffffff' : G[3]); } });
  }
  P.mk('my_lamp', 14, 22, 2, (p, f) => { P.Sprites.myShroom(p, 7, 21, 12, 6, P.MYC.tq, P.MYC.tq, P.MYC.stem, { shape: 'bell', capH: 7, drips: 3 }); p.ell(7, 10, 2, 1.5 + f * 0.4, '#ffffff'); });
  P.mk('my_mush', 18, 16, 2, (p, f) => { p.sell(9, 10 - f, 7, 5 + f, ['#3a1a3a', '#7a3a7a', '#c06ac0', '#ffd8ff']); for (let k = 0; k < 5; k++) p.px(4 + k * 2.5, 8 - f, '#ffffff'); p.rect(8, 14, 2, 2, P.MYC.stem[1]); });
  P.mk('my_bigmush', 30, 34, 1, p => P.Sprites.myShroom(p, 15, 33, 22, 14, P.MYC.vio, P.MYC.gre, P.MYC.stem, { shape: 'flat', capH: 6, drips: 6 }));
  P.mk('my_orchid', 14, 16, 2, (p, f) => { p.line(7, 15, 7, 7, P.MYC.stem[1]); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + f * 0.3; p.line(7, 6, 7 + Math.cos(a) * 5, 6 + Math.sin(a) * 4, k % 2 ? '#5ef0a0' : '#ff7ad8'); } p.ell(7, 6, 1.6, 1.6, '#ffe08a'); });
  P.mk('my_lily', 18, 6, 1, p => { p.ell(9, 4, 7, 1.8, '#1aa0b0'); p.ell(9, 3, 4, 1, '#5af0f0'); });
  P.mk('my_heal', 16, 18, 2, (p, f) => { for (let k = 0; k < 3; k++) P.Sprites.myShroom(p, 4 + k * 4, 17, 5 + k * 2 - f, 3, P.MYC.cap, P.MYC.cap, P.MYC.stem, { shape: 'dome', spots: 2 }); });

  // ================= FAUNA (alienígena) =================
  // SPOROCARPO: bola de esporas que camina sobre zancos
  const sporo = (p, f, cy2) => { const ph = f === 4 ? 0 : f; for (let k = 0; k < 3; k++) { const lx = 10 + k * 6, sw = Math.sin((ph + k) * 1.57) * 2; p.line(lx, 13, lx + sw, 21, P.MYC.stem[0]); } p.sell(16, 10, 10, 6, cy2 ? ['#2a2a3a', '#4a4a5a', '#6a6a7a', '#9a9aaa'] : ['#3a1a5a', '#7a3ac0', '#c06aff', '#f0d8ff']); for (let k = 0; k < 6; k++) p.ell(9 + k * 2.6, 6 + (k % 2), 1.2, 1.2, cy2 ? '#ff3050' : '#5ef0a0'); if (f === 4) for (let k = 0; k < 5; k++) p.px(8 + k * 4, 1 + (k % 2), '#d8ffe0'); p.rect(24, 9, 3, 2, cy2 ? '#ff3050' : '#ffe08a'); };
  P.mk('my_krazith', 32, 22, 5, (p, f) => sporo(p, f, false));
  P.mk('my_krazith_cy', 34, 24, 5, (p, f) => { sporo(p, f, true); p.rect(9, 3, 14, 3, '#3a4258'); p.rect(9, 3, 14, 1, '#7a86a4'); });
  // MICOLOSO: seta colosal caminante, guardiana del bosque
  P.mk('my_krazith_alfa', 52, 36, 5, (p, f) => { const ph = f === 4 ? 0 : f; for (let k = 0; k < 4; k++) { const lx = 12 + k * 9, sw = Math.sin((ph + k) * 1.57) * 3; p.thick(lx, 24, lx + sw, 35, 3, P.MYC.stem[0]); } p.sell(26, 22, 14, 8, P.MYC.stem); P.Sprites.myShroom(p, 26, 20, 4, 24, P.MYC.cap, P.MYC.gill, P.MYC.stem, { shape: 'dome', capH: 14, spots: 7 }); p.ell(34, 22, 2.5, 2, f === 4 ? '#ff3050' : '#0a1a4a'); p.px(35, 21, '#ffffff'); });
  // SALTAHONGO: sombrero saltarín con un ojo bajo las láminas
  P.mk('my_frog', 20, 17, 3, (p, f) => { const y = f === 1 ? -2 : 0; p.line(6, 13 + y, 4, 16, P.MYC.stem[0]); p.line(14, 13 + y, 16, 16, P.MYC.stem[0]); P.Sprites.myShroom(p, 10, 13 + y, 3, 8, P.MYC.mag, P.MYC.gill, P.MYC.stem, { shape: 'dome', capH: 6, spots: 3 }); p.ell(12, 11 + y, 1.6, 1.4, '#ffffff'); p.px(13, 11 + y, '#0a0a1a'); if (f === 2) p.ell(17, 11, 2, 1.5, '#5ef0a0'); });
  // HIFÁLIDA: polilla-medusa con alas de láminas que esparce esporas
  const hifa = (p, f, cy2) => { const up = f ? -3 : 2; for (const sd of [-1, 1]) { for (let k = 0; k < 5; k++) p.line(13, 8, 13 + sd * (6 + k * 1.4), 8 + up - 2 + k, cy2 ? '#4a4a5a' : (k % 2 ? '#5af0f0' : '#1aa0b0')); } p.sell(13, 8, 3, 3.5, cy2 ? ['#2a2a3a', '#4a4a5a', '#7a7a8a'] : P.MYC.vio); p.px(13, 7, cy2 ? '#ff3050' : '#ffffff'); for (let k = 0; k < 3; k++) p.px(12 + k, 12 + ((k + f) % 2), '#5ef0a0'); };
  P.mk('my_dfly', 26, 16, 2, (p, f) => hifa(p, f, false));
  P.mk('my_dfly_cy', 26, 16, 2, (p, f) => { hifa(p, f, true); p.rect(11, 5, 5, 3, '#3a4258'); });
  // REPTAMICELIO: gusano segmentado que se desliza sobre el micelio
  P.mk('my_slug', 28, 15, 2, (p, f) => { for (let k = 0; k < 7; k++) { const x = 4 + k * 3.4, y = 10 + Math.sin(k * 0.9 + f * 2) * 1.5; p.sell(x, y, 2.6, 2.4, k % 2 ? P.MYC.gre : P.MYC.tq); } p.px(26, 9, '#ffffff'); p.line(26, 8, 27, 5, P.MYC.gre[2]); });
  // COLGASETA: seta que cuelga del techo y se descuelga
  P.mk('my_vsnake', 12, 34, 2, (p, f) => { for (let y = 0; y < 24 + f * 6; y++) p.px(6 + Math.sin(y * 0.3) * 0.8, y, P.MYC.stem[1]); const y0 = 24 + f * 6; for (let yy = 0; yy < 6; yy++) { const ww = 5 * Math.sqrt(1 - (yy / 6) ** 2); p.rect(Math.round(6 - ww), y0 + yy, Math.round(ww * 2), 1, yy > 3 ? P.MYC.cap[0] : P.MYC.cap[1]); } p.ell(6, y0 + 3, 1.2, 1.2, '#ffe08a'); });
  // TRAMPA LAMINAR: sombrero carnívoro que se abre en láminas dentadas
  P.mk('my_maw', 26, 34, 3, (p, f) => { p.thick(13, 34, 13, 18, 4, P.MYC.stem[1]); const o = [0, 4, 8][f]; for (const sd of [-1, 1]) { for (let yy = 0; yy < 8; yy++) { const ww = 9 * Math.sqrt(1 - (yy / 8) ** 2); p.rect(Math.round(13 + sd * o * 0.5 - ww), 16 - yy - (sd > 0 ? 0 : o * 0.3), Math.round(ww * 2), 1, P.MYC.mag[yy < 2 ? 0 : 1]); } } if (o) { p.ell(13, 15, o, 3, '#2a0620'); for (let k = 0; k < 5; k++) p.tri(13 - o + k * o / 2.5, 12, 13 - o + k * o / 2.5 + 2, 12, 13 - o + k * o / 2.5 + 1, 15, '#ffe0f0'); } });
  // PACESPORA (restaurado): rumiante de cuello largo que pasta esporas
  P.mk('my_grazer', 38, 28, 3, (p, f) => { const ph = f === 2 ? 0 : f; for (let k = 0; k < 4; k++) p.line(10 + k * 6, 16, 10 + k * 6 + (k % 2 ? 1 : -1) * ph * 2, 27, P.MYC.stem[0]); p.sell(19, 14, 11, 4.5, ['#2a1a4a', '#5a3a8a', '#8a6ac0', '#c8b0ff']); p.line(29, 13, 33, 5, '#8a6ac0'); P.Sprites.myShroom(p, 33, 5, 1, 4, P.MYC.gre, P.MYC.gre, P.MYC.stem, { shape: 'dome', capH: 3 }); for (let k = 0; k < 4; k++) p.px(12 + k * 4, 10, '#5ef0a0'); });
  // GRAN MICÓFORO (legendario): ballena fúngica flotante con un bosque en el lomo
  P.mk('my_vellorn', 40, 38, 2, (p, f) => { p.sell(20, 22, 18, 9, ['#0a2a4a', '#1a5a8a', '#3a9ac8', '#9ae0ff']); for (let k = 0; k < 6; k++) P.Sprites.myShroom(p, 7 + k * 5, 15, 3 + (k % 3) * 2, 3, [P.MYC.gre, P.MYC.vio, P.MYC.mag][k % 3], P.MYC.gill, P.MYC.stem, { shape: 'dome' }); for (let k = 0; k < 5; k++) for (let y = 30; y < 36 + (k % 2) * 2; y++) p.px(10 + k * 5 + Math.sin(y + f) * 1, y, '#5af0f0'); p.px(34, 21, '#ffffff'); });
  // CAMUFLONGO: parece una seta inofensiva hasta que abre su boca
  P.mk('my_wraith', 20, 24, 3, (p, f) => { P.Sprites.myShroom(p, 10, 23, 10 - f * 2, 8, P.MYC.cap, P.MYC.gill, P.MYC.stem, { shape: 'dome', capH: 7, spots: 4 }); if (f) { p.ell(10, 17 - f, 4, 2 + f, '#2a0620'); for (let k = 0; k < 4; k++) p.px(7 + k * 2, 16 - f, '#ffffff'); p.px(7, 12 - f * 2, '#ff3050'); p.px(13, 12 - f * 2, '#ff3050'); } });
  P.mk('my_b_glob', 7, 7, 2, (p, f) => { p.ell(3, 3, 3, 3, f ? '#5ef0a0' : '#c06aff'); p.px(2, 2, '#ffffff'); });
  P.mk('my_b_orb', 8, 8, 2, (p, f) => { p.ell(4, 4, 3.6, 3.6, f ? '#5af0f0' : '#5ef0a0'); p.ell(3, 3, 1.4, 1.4, '#ffffff'); });
  P.mk('my_b_kspine', 12, 5, 1, p => { p.tri(0, 1, 0, 4, 11, 2, '#ffe08a'); p.line(1, 2, 10, 2, '#ffffff'); });
  P.mk('my_gate', 34, 46, 1, p => { P.Sprites.myShroom(p, 6, 46, 30, 6, P.MYC.vio, P.MYC.gre, P.MYC.stem, { shape: 'dome' }); P.Sprites.myShroom(p, 28, 46, 30, 6, P.MYC.vio, P.MYC.gre, P.MYC.stem, { shape: 'dome' }); for (let x = 6; x <= 28; x++) p.px(x, 12 + Math.round(Math.sin((x - 6) / 22 * Math.PI) * -6), '#5ef0a0'); });
  const ic = (n, fn) => P.mk('i_' + n, 10, 10, 1, fn);
  ic('spring', p => P.Sprites.myShroom(p, 5, 9, 3, 4, P.MYC.mag, P.MYC.gill, P.MYC.stem, { shape: 'dome' }));
  ic('sporegun', p => { p.rect(1, 4, 5, 3, '#3a4258'); p.ell(7, 5, 2.5, 2.5, '#5ef0a0'); });
  ic('chitin', p => { p.sell(5, 5, 4, 4, P.MYC.vio); p.px(4, 4, '#ffffff'); });
  ic('mycorrhiza', p => { for (let k = 0; k < 4; k++) p.line(5, 9, 1 + k * 3, 2, '#5ef0a0'); p.ell(5, 3, 2, 2, '#ff7ad8'); });

  // ================= MAPA EXTERIOR =================
  for (const st of ['c', 'r']) { const on = st === 'r', dim = c2 => on ? c2 : P.Col.mix(c2, '#3a3448', 0.75);
    P.mk('my_o_grass_' + st, 16, 16, 3, (p, v) => { const r = P.RNG(1600 + v + (on ? 9 : 0)); p.rect(0, 0, 16, 16, on ? '#0e3a2a' : '#1e1c26'); for (let k = 0; k < 6; k++) p.px(r.int(0, 15), r.int(0, 15), on ? '#16804a' : '#2a2632'); if (v) { const x = r.int(3, 12), y = r.int(5, 12); p.px(x, y, P.MYC.stem[2]); p.rect(x - 1, y - 1, 3, 1, dim(P.pick([P.MYC.cap, P.MYC.vio, P.MYC.mag])[1])); } }, { outline: false });
    P.mk('my_o_water_' + st, 16, 16, 2, (p, f) => { const lq = P.PAL.mykoris[st].liq; p.rect(0, 0, 16, 16, lq[1]); for (let k = 0; k < 3; k++) p.rect((k * 6 + f * 3) % 14, 3 + k * 5, 3, 1, lq[2]); }, { outline: false });
    P.mk('my_o_tree_' + st, 34, 42, 2, (p, v) => { p.ell(17, 40, 12, 2.5, '#06080a'); P.Sprites.myShroom(p, 17, 40, v ? 30 : 22, v ? 10 : 15, (v ? P.MYC.vio : P.MYC.gre).map(dim), P.MYC.gill.map(dim), P.MYC.stem.map(dim), { shape: v ? 'bell' : 'flat', capH: v ? 9 : 6, drips: on ? 5 : 0 }); });
    P.mk('my_o_ice_' + st, 16, 16, 2, (p, v) => { p.rect(0, 0, 16, 16, on ? '#16804a' : '#2a2632'); for (let k = 0; k < 4; k++) p.px(2 + k * 4, 6 + v * 3, on ? '#5ef0a0' : '#3e3446'); }, { outline: false });
    P.mk('my_o_cliff_' + st, 16, 16, 3, (p, v) => { p.rect(0, 0, 16, 16, on ? '#24140e' : '#1e161a'); for (let k = 0; k < 4; k++) p.line(k * 4, 0, k * 4 + 1, 16, on ? '#382218' : '#2c2026'); if (v === 2) { p.rect(0, 0, 16, 3, on ? '#16804a' : '#3a3242'); p.px(5, 1, P.MYC.cap[2]); } if (v === 1) p.rect(0, 13, 16, 3, '#0a0608'); }, { outline: false });
    P.mk('my_o_crack_' + st, 16, 16, 2, (p, f) => { p.rect(0, 0, 16, 16, on ? '#0e3a2a' : '#1e1c26'); const V = on ? (f ? '#a8ff7a' : '#5ef0a0') : '#5a4a6a'; p.line(0, 8, 6, 6, V); p.line(6, 6, 10, 10, V); p.line(10, 10, 16, 7, V); p.line(6, 6, 7, 1, V); }, { outline: false });
  }
  P.mk('my_o_path', 16, 16, 2, (p, v) => { p.rect(0, 0, 16, 16, '#4e3222'); for (let k = 0; k < 6; k++) p.px((k * 5 + v * 3) % 16, (k * 7) % 16, '#6a4a32'); }, { outline: false });
  P.mk('my_o_stone', 16, 16, 1, p => { p.rect(0, 0, 16, 16, '#cdbfa0'); p.line(0, 7, 15, 8, '#a89878'); p.line(7, 0, 8, 15, '#a89878'); p.px(3, 3, '#5ef0a0'); }, { outline: false });
  P.mk('my_o_goo', 16, 16, 2, (p, f) => { p.ell(8, 11, 6, 3, '#1e1028'); p.ell(8, 10, 4, 2, '#3a1e48'); p.px(6 + f, 9, '#8a6aa0'); }, { outline: false });
  P.mk('my_o_lamp', 10, 16, 2, (p, f) => P.Sprites.myShroom(p, 5, 15, 9, 4, P.MYC.tq, P.MYC.tq, P.MYC.stem, { shape: 'bell', capH: 5, drips: 2 + f }));
  P.mk('my_o_rock', 16, 16, 1, p => { P.Sprites.myShroom(p, 8, 15, 5, 7, P.MYC.cap, P.MYC.gill, P.MYC.stem, { shape: 'dome', spots: 3 }); });
  P.mk('my_o_pillar', 14, 30, 2, (p, f) => P.Sprites.myShroom(p, 7, 29, f ? 12 : 24, f ? 5 : 6, P.MYC.vio, P.MYC.gre, P.MYC.stem, { shape: 'cone', capH: 6 }));
  P.mk('my_o_house', 44, 38, 2, (p, f) => { P.Sprites.myShroom(p, 22, 37, 18, 20, f ? P.MYC.cap : P.MYC.cap.map(c2 => P.Col.mix(c2, '#3a3448', 0.7)), P.MYC.gill, P.MYC.stem, { shape: 'dome', capH: 12, spots: f ? 6 : 0 }); p.rect(19, 28, 6, 9, '#3a2a1a'); });
  P.mk('my_o_flower', 8, 8, 3, (p, v) => P.Sprites.myShroom(p, 4, 7, 3, 3, [P.MYC.cap, P.MYC.vio, P.MYC.gre][v], P.MYC.gill, P.MYC.stem, { shape: 'dome' }));
};
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildMykoris(); }; })();
