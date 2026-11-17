'use strict';
// IGNÁRIA — Las Forjas del Núcleo: arte del planeta (prefijo «ig_»).
// Volcanes gigantes en erupción, ríos y lagos de magma, basalto negro con grietas incandescentes, ceniza.
// Contaminado: magma apagado y roca gris sofocada por el humo del régimen. Restaurado: rojo volcánico, naranja
// incandescente, amarillo magma, con brillos blancos cálidos y dorados.
P.PAL.ignaria = {
  c: { soil: ['#0e0c0c', '#1a1616', '#26201e', '#342c28'], vein: '#5a3a2a', top: ['#2a2422', '#3a3230', '#4e4440', '#665a54'],
    liq: ['#140806', '#2a120a', '#4a2010', '#8a4a2a'], thorn: ['#2a1a16', '#4a2e26', '#6a4438', '#9a7060'],
    leaf: ['#1a1414', '#2a2020', '#3e2e2a', '#5a4038'], trunk: ['#100c0c', '#1e1616', '#2e2222'], glow: '#8a3a1a', flower: ['#5a2a1a', '#6a3a2a', '#4a2a2a'] },
  r: { soil: ['#0a0606', '#180c0a', '#2a1410', '#3e1e14'], vein: '#ff7a1a', top: ['#1e1210', '#2e1a14', '#4a2618', '#ff6a1a'],
    liq: ['#7a0a04', '#d0300a', '#ff8a1a', '#ffe070'], thorn: ['#3a0a06', '#a02a0a', '#ff6a1a', '#ffd166'],
    leaf: ['#3a0a06', '#a02a0a', '#ff6a1a', '#ffd166'], trunk: ['#1a0e0a', '#3a1e14', '#5a2e1e'], glow: '#ff7a2a', flower: ['#ff5a1a', '#ffd166', '#ff9a3a', '#ffffff'] }
};
P.IGC = { lava: ['#7a0a04', '#d0300a', '#ff6a1a', '#ffb030', '#fff0a0'], bas: ['#0a0808', '#16120f', '#24201c', '#363028', '#4a4238'], cop: ['#4a1e0a', '#8a3a14', '#c8642a', '#f0a060'], gold: ['#7a4a0a', '#c08a1a', '#ffd166', '#fff4c0'], ash: ['#2a2626', '#4a4442', '#6a6460', '#9a928a'] };
P.SKIES_I = {
  day: { r: ['#1a0a1a', '#4a0e1e', '#a02a1a', '#ff6a1a', '#ffb050'], c: ['#141010', '#221a18', '#302622', '#3e322c', '#4c3e36'] },
  golden: { r: ['#2a0a2a', '#6a1a3a', '#c03a2a', '#ff7a2a', '#ffc070'], c: ['#161212', '#241c1a', '#342824', '#44342e', '#544038'] },
  dusk: { r: ['#05030a', '#140818', '#3a0e2a', '#8a1a2a', '#e04a1a'], c: ['#080606', '#100c0c', '#1a1414', '#241c1a', '#2e2420'] }
};
P.HERO_SKINS.magma = { name: 'Armadura de Magma', d: '#120a08', m: '#2e1a14', l: '#ff6a1a', h: '#ffd166', j: '#060404', e: '#fff4c0', eg: '#ff3a1a', acc: '#ffb030', w: '#fff0d0' };
P.SUIT_STYLE = P.SUIT_STYLE || {}; P.SUIT_STYLE.magma = 'volcano';
P.ART = P.ART || {};
P.ART.ignaria = {
  p: 'ig_', skies: P.SKIES_I, owMusic: 'ignaria_ow',
  owAmb: lf => 'rgba(20,4,2,' + (0.34 - lf * 0.18) + ')',
  flora: { L: 'farol_brasa', F: 'helecho_ceniza', m: 'vaina_azufre', U: 'arbol_basalto', h: 'savia_ignea', y: 'flor_magma', lily: 'nenufar_brasa', g: 'pacecalor', legend: 'titan_magma' },
  tileFlora: { b: 'fumarola', '|': 'liana_cobre', '^': 'espina_obsidiana' }
};
// roca con grietas incandescentes
P.Sprites.igCracks = function (p, x, y, w, h, col, r, n = 3) { for (let k = 0; k < n; k++) { let cx = x + r.int(0, w), cy = y + r.int(0, h); for (let j = 0; j < 6; j++) { const nx = cx + r.int(-3, 3), ny = cy + r.int(1, 3); p.line(cx, cy, nx, ny, col); cx = nx; cy = ny; } } };
// volcán con cráter y río de lava por la ladera
P.Sprites.igVolcano = function (p, cx, by, w, h, C, lava, r, erupt) {
  for (let y = 0; y < h; y++) { const t = y / h, ww = w * (1 - t) ** 0.85 + 6; p.rect(Math.round(cx - ww), by - y, Math.round(ww * 2), 1, C[(t * 3 + (y % 5 === 0 ? 1 : 0)) | 0 % 4 ? 1 : 2] || C[1]); p.px(Math.round(cx - ww), by - y, C[3] || C[2]); }
  p.ell(cx, by - h, 8, 2, lava ? lava[2] : C[0]);
  if (lava) { let x = cx; for (let y = by - h + 2; y < by; y++) { x += r.int(-1, 1); p.px(x, y, lava[y % 4 ? 2 : 3]); if (y % 3 === 0) p.px(x + 1, y, lava[1]); } }
  if (erupt && lava) for (let k = 0; k < 14; k++) { const a = -Math.PI / 2 + r.range(-0.6, 0.6), l = r.int(6, 22); p.line(cx, by - h, cx + Math.cos(a) * l, by - h + Math.sin(a) * l, lava[k % 2 ? 3 : 2]); }
};

P.Sprites.buildIgnaria = function () {
  const K = P.PAL.ignaria, I = P.IGC;
  for (const st of ['c', 'r']) {
    const pal = K[st], s = pal.soil, t = pal.top, on = st === 'r', LV = on ? I.lava : I.ash;
    // basalto con grietas que brillan
    P.mk('ig_t_soil_' + st, 16, 16, 3, (p, v) => { const r = P.RNG(1900 + v + (on ? 9 : 0)); p.rect(0, 0, 16, 16, s[1]); for (let k = 0; k < 3; k++) { const x = r.int(0, 12), y = r.int(0, 12); p.rect(x, y, r.int(3, 5), r.int(2, 4), s[2]); p.px(x, y, s[3]); } if (v > 0) P.Sprites.igCracks(p, 0, 0, 14, 10, v === 1 ? pal.vein : LV[1], r, v); if (v === 2 && on) p.px(r.int(3, 12), r.int(3, 12), I.lava[4]); }, { outline: false });
    P.mk('ig_t_top_' + st, 16, 9, 3, (p, v) => { const r = P.RNG(1920 + v + (on ? 9 : 0)); p.rect(0, 3, 16, 4, t[1]); p.rect(0, 3, 16, 1, t[2]); p.rect(0, 6, 16, 1, t[0]); for (let x = 0; x < 16; x++) if (r() < 0.25) p.px(x, 2, I.ash[2]); if (on && v) { const x = r.int(2, 13); p.line(x, 4, x + 2, 6, I.lava[2]); p.px(x + 1, 5, I.lava[3]); } }, { outline: false });
    P.mk('ig_t_bot_' + st, 16, 7, 2, (p, v) => { const r = P.RNG(1940 + v); for (let k = 0; k < 2; k++) { const x = r.int(2, 13), l = r.int(2, 5); for (let y = 0; y < l; y++) p.px(x, y, y === l - 1 ? LV[3] : s[2]); } });
    P.mk('ig_tdeco_' + st, 16, 14, 6, (p, v) => {
      if (v === 0) { for (let k = 0; k < 3; k++) p.rect(4 + k * 3, 13 - (3 + k * 2), 2, 3 + k * 2, I.bas[2 + (k % 2)]); }
      if (v === 1) { p.ell(8, 12, 5, 2, s[2]); p.ell(7, 11, 2, 1, LV[2]); p.px(7, 11, LV[4]); }
      if (v === 2) { for (let k = 0; k < 4; k++) p.px(3 + k * 3, 12 - (k % 2), I.ash[2 + (k % 2)]); p.rect(2, 13, 12, 1, I.ash[1]); }
      if (v === 3) { p.tri(5, 13, 11, 13, 8, 5, I.bas[3]); p.line(8, 6, 8, 12, LV[2]); }
      if (v === 4) { for (let k = 0; k < 3; k++) { const x = 4 + k * 4; p.line(x, 13, x, 8 - k, I.cop[1]); p.ell(x, 7 - k, 1.4, 1.4, on ? I.gold[2] : I.ash[2]); } }
      if (v === 5) { p.sell(8, 11, 5, 3, [I.bas[1], I.bas[2], I.bas[3]]); P.Sprites.igCracks(p, 4, 9, 7, 2, LV[2], P.RNG(v), 1); }
    });
    // magma: superficie agrietada que se mueve, burbujas
    const lq = pal.liq;
    P.mk('ig_t_liq_' + st, 16, 16, 4, (p, f) => { for (let x = 0; x < 16; x++) { const h = Math.round(2 + Math.sin((x + f * 3) * 0.4) * 1); for (let y = h; y < 16; y++) p.dith(x, y, y < h + 4 ? lq[2] : lq[1], lq[1], y < h + 4 ? (y - h) / 4 : 0); p.px(x, h, lq[3]); } for (let k = 0; k < 3; k++) { const x = (k * 6 + f * 4) % 16, y = 6 + k * 3; p.line(x, y, x + 3, y + 1, lq[0]); } if (f % 2) p.ell((f * 5) % 14 + 1, 3, 1.4, 1, lq[3]); }, { outline: false });
    P.mk('ig_t_liqb_' + st, 16, 16, 4, (p, f) => { p.grad(0, 0, 16, 16, [lq[1], P.Col.mix(lq[1], lq[0], 0.5)]); for (let k = 0; k < 4; k++) { const x = (k * 5 + f * 3) % 16, y = (k * 7 + f) % 16; p.line(x, y, x + 2, y + 2, lq[0]); p.px(x + 1, y, lq[2]); } }, { outline: false });
    // espinas de obsidiana
    P.mk('ig_t_thorn_' + st, 16, 16, 2, (p, f) => { p.ell(8, 14, 8, 2.5, s[2]); for (let i = 0; i < 4; i++) { const x = 2 + i * 4 + f, h = 7 + (i % 2) * 5; p.tri(x - 2, 14, x + 2, 14, x + (i % 2 ? 1 : -1), 14 - h, I.bas[3]); p.line(x, 13, x + (i % 2 ? 1 : -1), 14 - h, on ? I.lava[2] : I.bas[4]); } });
    // liana de cobre trepable
    P.mk('ig_t_vine_' + st, 16, 16, 2, (p, v) => { for (let y = 0; y < 16; y++) { const x = 8 + Math.round(Math.sin((y + v * 8) * 0.4)); p.px(x, y, I.cop[2]); p.px(x + 1, y, I.cop[1]); if (y % 4 === 1) p.px(x - 1, y, on ? I.gold[2] : I.cop[3]); } });
    // pasarela de basalto (un sentido)
    P.mk('ig_t_branch_' + st, 16, 8, 2, (p, v) => { p.rect(0, 2, 16, 3, I.bas[2]); p.rect(0, 2, 16, 1, I.bas[4]); for (let x = 3 + v * 4; x < 16; x += 8) { p.px(x, 3, LV[2]); p.px(x, 5, LV[1]); } p.rect(0, 5, 16, 1, I.bas[0]); });
    // fumarola: chorro de vapor que impulsa
    P.mk('ig_t_bulb_' + st, 16, 16, 3, (p, f) => { p.sell(8, 13, 7, 3, [I.bas[1], I.bas[2], I.bas[3]]); p.ell(8, 12, 3, 1.2, '#0a0606'); const h = [3, 10, 6][f]; for (let i = 0; i < h; i++) p.ell(8 + Math.round(Math.sin(i + f) * 1.5), 11 - i * 1.1, 1.4 + i * 0.12, 1, i % 2 ? '#e8e0d8' : '#ffffff'); });
  }
  // ciudad reptiliana: basalto tallado con remates de cobre y runas incandescentes
  P.mk('ig_t_ruin', 16, 16, 3, (p, v) => { p.grad(0, 0, 16, 16, ['#3a2a22', '#2a1e18', '#1e1612']); p.rect(0, 0, 16, 2, '#8a3a14'); p.rect(0, 1, 16, 1, '#c8642a'); p.line(0, 9, 15, 9, '#120c0a'); p.line(v * 5 + 2, 2, v * 5 + 2, 9, '#120c0a'); if (v === 1) { p.rect(6, 4, 4, 3, '#ff6a1a'); p.px(7, 5, '#ffe070'); } if (v === 2) { p.ell(11, 12, 2, 2, '#c8642a'); p.px(11, 12, '#ffd166'); } }, { outline: false });
  P.mk('ig_t_ruintop', 16, 6, 1, p => { p.rect(0, 2, 16, 2, '#c8642a'); p.rect(0, 2, 16, 1, '#f0a060'); for (let x = 2; x < 16; x += 5) p.px(x, 3, '#ff6a1a'); }, { outline: false });
  P.mk('ig_t_crack', 16, 16, 1, p => { p.rect(0, 0, 16, 16, '#24201c'); p.line(3, 0, 7, 7, '#ff6a1a'); p.line(7, 7, 4, 15, '#ff6a1a'); p.line(7, 7, 13, 10, '#d0300a'); p.px(7, 7, '#ffe070'); }, { outline: false });
  // suelo que se agrieta antes de soltar lava (0 intacto · 1 grietas · 2 a punto)
  P.mk('ig_t_unstable', 16, 16, 3, (p, f) => { p.rect(0, 0, 16, 16, '#24201c'); p.rect(0, 0, 16, 2, '#363028'); p.rect(0, 0, 16, 1, '#4a4238'); const V = f === 0 ? '#5a2a1a' : f === 1 ? '#ff6a1a' : '#ffe070'; p.line(4, 2, 6, 9, V); p.line(6, 9, 3, 15, V); if (f) { p.line(6, 9, 12, 11, V); p.line(12, 11, 13, 15, V); } if (f > 1) { p.line(10, 2, 12, 11, V); p.ell(7, 9, 1.5, 1.5, '#fff0a0'); } }, { outline: false });
  // compuerta de obsidiana (se abre con energía térmica)
  P.mk('ig_t_gate', 16, 16, 2, (p, f) => { p.rect(1, 0, 14, 16, '#16120f'); p.rect(1, 0, 1, 16, '#363028'); for (let y = 2; y < 16; y += 5) { p.rect(3, y, 10, 2, '#4a1e0a'); p.px(8, y, f ? '#ffb030' : '#ff6a1a'); } p.rect(14, 0, 1, 16, '#0a0808'); }, { outline: false });
  // losa de basalto que emerge del magma (f1 = sumergida)
  P.mk('ig_t_phase', 16, 8, 2, (p, f) => { if (f) { for (let x = 0; x < 16; x += 3) p.px(x, 6, '#ffb030'); return; } p.rect(0, 2, 16, 4, '#24201c'); p.rect(0, 2, 16, 1, '#4a4238'); for (let x = 1; x < 16; x += 4) p.px(x, 6, '#ff6a1a'); p.px(5, 3, '#ffd166'); });

  // ================= FONDOS (según la referencia: volcán en erupción y ríos de lava bajo un cielo estrellado) =================
  const bgSky = (st, sky) => {
    const SK = P.SKIES_I[sky], p = new P.Painter(P.W, P.H), r = P.RNG(st === 'c' ? 2001 : 2002); p.grad(0, 0, P.W, P.H, SK[st]);
    for (let i = 0; i < 90; i++) p.px(r.int(0, P.W), r.int(0, 110), st === 'r' ? P.pick(['#ffffff', '#ffd166', '#ff8a5a']) : '#6a5a54');
    for (let i = 0; i < 5; i++) { const x = r.int(10, P.W - 10), y = r.int(8, 90); p.px(x, y, '#ffffff'); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [2, 0], [-2, 0], [0, 2], [0, -2]]) p.px(x + dx, y + dy, st === 'r' ? '#ffd8b0' : '#8a7a70'); }
    // nubes de humo iluminadas desde abajo
    const CL = st === 'r' ? ['#3a1a3a', '#6a2a3a', '#c04a2a', '#ff8a3a'] : ['#1e1a1a', '#2a2422', '#3a322e', '#4a403a'];
    for (let i = 0; i < 6; i++) { const cx = r.int(0, P.W), cy = r.int(40, 120), w = r.int(40, 90); for (let k = 0; k < 6; k++) { const x = cx - w / 2 + k * w / 5, y = cy - Math.abs(k - 2.5) * 3; p.ell(x, y, w / 5, 10, CL[1]); p.ell(x, y + 4, w / 6, 6, CL[2]); p.ell(x, y + 7, w / 7, 3, CL[3]); } }
    return p.canvas();
  };
  for (const sky in P.SKIES_I) for (const st of ['c', 'r']) P.mkCanvas('ig_bg_sky_' + st + '_' + sky, [bgSky(st, sky)]);
  for (const st of ['c', 'r']) {
    const on = st === 'r', LV = on ? I.lava : I.ash;
    // lejos: volcanes gigantes con siluetas distintas (uno en erupción) y columnas de humo
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(on ? 2012 : 2011), C = ['#1a0a10', '#2a1218', '#3a1a1e', '#4a2424'];
      P.Sprites.igVolcano(p, 160, P.H - 40, 110, 120, C, on ? I.lava : null, r, on); P.Sprites.igVolcano(p, 430, P.H - 40, 80, 80, C, on ? I.lava : null, r, false); P.Sprites.igVolcano(p, 570, P.H - 40, 60, 100, C, null, r, false);
      for (let x = 0; x < W; x++) p.rect(x, P.H - 42 + Math.round(Math.sin(x * 0.03) * 3), 1, 44, C[0]);
      P.mkCanvas('ig_bg_far_' + st, [p.canvas()]); }
    // medio: montañas de roca negra con cascadas de lava y columnas de basalto
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(on ? 2022 : 2021);
      let g = 60; for (let x = 0; x < W; x++) { g += r.range(-3, 3) + (x % 47 === 0 ? r.range(-18, 18) : 0); g = P.clamp(g, 30, 110); const top = Math.round(P.H - 20 - g); p.rect(x, top, 1, P.H - top, '#120a0c'); p.px(x, top, '#2a1a1c'); }
      for (let i = 0; i < 6; i++) { const x = 40 + i * 110 + r.int(-20, 20); for (let y = P.H - 100 + r.int(0, 30); y < P.H - 20; y++) { p.px(x, y, LV[y % 3 ? 2 : 3]); p.px(x + 1, y, LV[1]); } }
      for (let i = 0; i < 8; i++) { const x = r.int(0, W), h = r.int(20, 50); for (let k = 0; k < 3; k++) p.rect(x + k * 5, P.H - 20 - h + k * 4, 4, h - k * 4, I.bas[1 + (k % 2)]); }
      P.mkCanvas('ig_bg_mid_' + st, [p.canvas()]); }
    // cerca: río de magma agrietado
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(on ? 2032 : 2031);
      for (let x = 0; x < W; x++) { const y = Math.round(P.H - 16 + Math.sin(x * 0.05) * 3); p.rect(x, y, 1, P.H - y, LV[1]); p.px(x, y, LV[3]); }
      for (let k = 0; k < 40; k++) { const x = r.int(0, W), y = P.H - r.int(2, 12); p.line(x, y, x + r.int(3, 8), y + r.int(-1, 1), LV[0]); }
      for (let i = 0; i < 10; i++) { const x = r.int(0, W); p.tri(x - 10, P.H, x + 12, P.H, x + r.int(-4, 4), P.H - r.int(10, 22), '#0a0606'); }
      P.mkCanvas('ig_bg_near_' + st, [p.canvas()]); }
    // árboles gigantes: árbol de corteza de basalto con hojas de brasa (v0) y torre-forja reptiliana (v1, rígida)
    P.mk('ig_bigtree_' + st, 110, 190, 2, (p, v) => {
      const r = P.RNG(2040 + v + (on ? 9 : 0));
      if (v === 0) { let cx = 55; for (let y = 0; y < 130; y += 2) { const nx = 55 + Math.sin(y * 0.03) * 8, w = 9 - y / 30; p.rect(Math.round(nx - w), 188 - y, Math.round(w * 2), 2, I.bas[(y >> 3) % 2 ? 2 : 3]); if (y % 16 === 0 && on) p.px(nx, 188 - y, I.lava[2]); cx = nx; } for (let k = 0; k < 9; k++) { const a = -Math.PI / 2 + (k - 4) * 0.36, l = 30 + r.int(0, 18), ex = cx + Math.cos(a) * l, ey = 58 + Math.sin(a) * l * 0.8; p.thick(cx, 60, ex, ey, 2, I.bas[2]); p.sell(ex, ey, 7, 5, on ? [I.lava[0], I.lava[1], I.lava[2], I.lava[3]] : [I.ash[0], I.ash[1], I.ash[2], I.ash[3]]); } return; }
      for (let y = 0; y < 150; y++) { const w = 16 - y / 14; p.rect(Math.round(55 - w), 188 - y, Math.round(w * 2), 1, ['#2a1e18', '#3a2a22'][(y >> 4) % 2]); if (y % 16 === 0) p.line(55 - w, 188 - y, 55 + w, 188 - y, '#8a3a14'); }
      for (let k = 0; k < 5; k++) { p.rect(51, 168 - k * 28, 8, 6, '#0a0606'); if (on) p.rect(52, 169 - k * 28, 6, 4, I.lava[2]); }
      p.rect(46, 30, 18, 12, '#3a2a22'); p.rect(48, 26, 14, 4, '#8a3a14'); for (let k = 0; k < 6; k++) p.ell(55 + P.rand(-3, 3), 22 - k * 3, 3 + k * 0.6, 2.4, k % 2 ? '#3a3230' : '#2a2422');
    }, { up: 0.1, down: 0.15, dark: 0.5 });
  }
  // cueva incandescente
  { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(2051); p.grad(0, 0, W, P.H, ['#0a0404', '#140806', '#1e0a06', '#0a0404']);
    for (let l = 0; l < 2; l++) { let g = 30 + l * 18; for (let x = 0; x < W; x++) { g += r.range(-3, 3); g = P.clamp(g, 14 + l * 14, 64 + l * 14); p.rect(x, 0, 1, Math.round(g - l * 12), l ? '#100806' : '#1a0c08'); const gb = Math.round(P.H - g + l * 10); p.rect(x, gb, 1, P.H - gb, l ? '#100806' : '#1a0c08'); } }
    for (let i = 0; i < 26; i++) P.Sprites.igCracks(p, r.int(0, W), r.int(10, P.H - 20), 12, 10, P.pick(['#ff6a1a', '#d0300a', '#ffb030']), r, 1);
    P.mkCanvas('ig_bg_cave', [p.canvas()]); }

  // ================= FLORA =================
  for (const st of ['c', 'r']) { const on = st === 'r';
    // HELECHO DE CENIZA: frondas negras con nervios de brasa
    P.mk('ig_fern_' + st, 22, 16, 2, (p, f) => { for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.4 + (f ? 0.05 : 0); let x = 11, y = 15; for (let j = 0; j < 10; j++) { x += Math.cos(a); y += Math.sin(a); p.px(x, y, I.bas[3]); if (j % 2) p.px(x + 1, y, on ? I.lava[2] : I.ash[2]); } } });
  }
  P.mk('ig_lamp', 14, 22, 2, (p, f) => { p.rect(6, 9, 2, 13, I.bas[2]); p.tri(3, 10, 11, 10, 7, 2, I.bas[3]); p.ell(7, 7, 2.4, 2 + f * 0.3, I.lava[3]); p.px(7, 6, I.lava[4]); });
  P.mk('ig_mush', 18, 16, 2, (p, f) => { p.sell(9, 10 - f, 6, 5 + f, ['#5a5a0a', '#b0a01a', '#f0e040', '#ffffa0']); for (let k = 0; k < 3; k++) p.px(6 + k * 3, 7 - f, '#ffffff'); p.rect(8, 14, 2, 2, I.bas[2]); });
  P.mk('ig_bigmush', 30, 34, 1, p => { for (let y = 0; y < 22; y++) p.rect(13, 33 - y, 4, 1, I.bas[(y >> 2) % 2 ? 2 : 3]); for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * 0.5; p.thick(15, 12, 15 + Math.cos(a) * 12, 12 + Math.sin(a) * 8, 2, I.bas[2]); p.ell(15 + Math.cos(a) * 12, 12 + Math.sin(a) * 8, 3, 2.4, I.lava[2]); } });
  P.mk('ig_orchid', 14, 16, 2, (p, f) => { p.line(7, 15, 7, 8, I.bas[3]); for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2 + f * 0.3; p.tri(7, 6, 7 + Math.cos(a) * 5, 6 + Math.sin(a) * 4, 7 + Math.cos(a + 0.4) * 4, 6 + Math.sin(a + 0.4) * 3, k % 2 ? I.lava[2] : I.gold[2]); } p.ell(7, 6, 1.4, 1.4, '#ffffff'); });
  P.mk('ig_lily', 18, 6, 1, p => { p.ell(9, 4, 7, 1.6, I.bas[2]); p.ell(9, 3, 3, 1, I.lava[3]); });
  P.mk('ig_heal', 16, 18, 2, (p, f) => { p.line(8, 17, 8, 9, I.bas[3]); for (const [x, y] of [[5, 8], [11, 7], [8, 4]]) p.sell(x, y - f, 2.4, 2.4, [I.gold[0], I.gold[1], I.gold[2], I.gold[3]]); });

  // ================= FAUNA =================
  // ESCORIÁPODO: criatura pequeña de roca que vive entre las piedras; lomo de escoria con brasas
  const crawl = (p, f, cy2) => { const ph = f === 4 ? 0 : f; for (let k = 0; k < 4; k++) { const lx = 8 + k * 5, sw = Math.sin((ph + k) * 1.57) * 2; p.line(lx, 16, lx - 2 + sw, 21, I.bas[2]); } p.sell(15, 14, 11, 5, cy2 ? ['#2a2a3a', '#4a4a5a', '#6a6a7a', '#9a9aaa'] : [I.bas[0], I.bas[1], I.bas[2], I.bas[3]]); for (let k = 0; k < 4; k++) p.tri(7 + k * 5, 11, 11 + k * 5, 11, 9 + k * 5, 6 - (k % 2) * 2, cy2 ? '#3a4258' : I.bas[3]); if (!cy2) for (let k = 0; k < 3; k++) p.px(9 + k * 5, 12, I.lava[2]); p.ell(26, 14, 2, 1.6, cy2 ? '#ff3050' : I.lava[3]); if (f === 4) p.line(27, 15, 31, 16, I.lava[3]); };
  P.mk('ig_krazith', 32, 22, 5, (p, f) => crawl(p, f, false));
  P.mk('ig_krazith_cy', 34, 24, 5, (p, f) => { crawl(p, f, true); p.rect(8, 4, 14, 3, '#3a4258'); p.rect(8, 4, 14, 1, '#7a86a4'); });
  // TITÁN DE MAGMA (alfa): mole que emerge del magma con caparazón mineral y núcleo fundido
  P.mk('ig_krazith_alfa', 52, 36, 5, (p, f) => { const ph = f === 4 ? 0 : f; for (let k = 0; k < 4; k++) { const lx = 12 + k * 9, sw = Math.sin((ph + k) * 1.57) * 3; p.thick(lx, 26, lx + sw, 35, 4, I.bas[1]); } p.sell(26, 21, 22, 12, [I.bas[0], I.bas[1], I.bas[2], I.bas[3]]); P.Sprites.igCracks(p, 8, 12, 34, 16, I.lava[2], P.RNG(f + 5), 4); for (let k = 0; k < 5; k++) p.tri(10 + k * 8, 12, 16 + k * 8, 12, 13 + k * 8, 3 - (k % 2) * 3, I.bas[3]); p.ell(45, 20, 3, 2.4, f === 4 ? '#ffffff' : I.lava[3]); });
  // SALAMANDRA DE BRASA: saltadora que deja chispas
  P.mk('ig_frog', 20, 17, 3, (p, f) => { const y = f === 1 ? -2 : 0; p.sell(10, 12 + y, 7, 3.6, [I.bas[1], I.bas[2], I.cop[1], I.cop[2]]); for (let k = 0; k < 3; k++) p.px(6 + k * 3, 10 + y, I.lava[3]); p.line(4, 14 + y, 2, 16, I.bas[2]); p.line(15, 14 + y, 17, 16, I.bas[2]); p.ell(16, 11 + y, 2, 1.6, I.cop[2]); p.px(17, 10 + y, '#ffffff'); if (f === 2) p.ell(19, 12, 1.6, 1.6, I.lava[3]); });
  // CENIZÁLIDO: volador de alas membranosas de ceniza que planea sobre los volcanes
  const fly = (p, f, cy2) => { const up = f ? -3 : 2; for (const sd of [-1, 1]) { p.tri(13, 8, 13 + sd * 12, 6 + up, 13 + sd * 7, 12, cy2 ? '#4a4a5a' : I.bas[2]); p.line(13, 8, 13 + sd * 12, 6 + up, cy2 ? '#7a7a8a' : I.lava[2]); } p.sell(13, 9, 3, 4, cy2 ? ['#2a2a3a', '#4a4a5a', '#7a7a8a'] : [I.bas[0], I.bas[2], I.cop[2]]); p.px(13, 8, cy2 ? '#ff3050' : I.lava[3]); };
  P.mk('ig_dfly', 26, 16, 2, (p, f) => fly(p, f, false));
  P.mk('ig_dfly_cy', 26, 16, 2, (p, f) => { fly(p, f, true); p.rect(11, 5, 5, 2, '#3a4258'); });
  // REPTALAVA: oruga de placas que se desliza sobre superficies calientes
  P.mk('ig_slug', 28, 15, 2, (p, f) => { for (let k = 0; k < 6; k++) { const x = 5 + k * 3.6, y = 10 + Math.sin(k * 0.9 + f * 2); p.sell(x, y, 2.6, 2.6, [I.bas[1], I.bas[2], I.bas[3]]); p.px(x, y + 2, I.lava[2]); } p.px(25, 9, I.lava[4]); });
  // ACECHADOR DE ESTALACTITA: depredador de las cuevas que cuelga del techo
  P.mk('ig_vsnake', 12, 34, 2, (p, f) => { for (let y = 0; y < 24 + f * 6; y++) { const w = Math.max(1, 4 - y / 8); p.rect(6 - w, y, w * 2, 1, I.bas[(y >> 2) % 2 ? 2 : 3]); } const y0 = 24 + f * 6; p.ell(6, y0 + 2, 3, 2.4, I.bas[3]); p.px(5, y0 + 2, I.lava[3]); p.px(7, y0 + 2, I.lava[3]); if (f) for (let k = 0; k < 3; k++) p.line(3 + k * 3, y0 + 4, 2 + k * 3, y0 + 8, I.bas[2]); });
  // CÁLIZ DE BRASA: planta carnívora de pétalos minerales
  P.mk('ig_maw', 26, 34, 3, (p, f) => { p.thick(13, 34, 13, 18, 3, I.bas[2]); const o = [0, 4, 8][f]; for (const sd of [-1, 1]) p.tri(13, 18, 13 + sd * (6 + o), 6 - o * 0.3, 13 + sd * 2, 6, I.bas[3]); p.ell(13, 14, 4 + o * 0.4, 3, f ? '#2a0606' : I.lava[2]); if (o) for (let k = 0; k < 4; k++) p.px(10 + k * 2, 11, I.lava[4]); });
  // PACECALOR (restaurado): herbívoro de caparazón poroso que se calienta junto a las fumarolas
  P.mk('ig_grazer', 38, 28, 3, (p, f) => { const ph = f === 2 ? 0 : f; for (let k = 0; k < 4; k++) p.line(10 + k * 6, 16, 10 + k * 6 + (k % 2 ? 1 : -1) * ph * 2, 27, I.bas[2]); p.sell(19, 13, 12, 6, [I.cop[0], I.cop[1], I.cop[2], I.cop[3]]); for (let k = 0; k < 6; k++) p.ell(12 + k * 3, 10 + (k % 2) * 3, 1, 1, I.cop[0]); p.line(30, 13, 34, 9, I.cop[1]); p.ell(34, 8, 3, 2.4, I.cop[2]); p.px(35, 7, I.lava[3]); });
  // TITÁN DE MAGMA legendario: coloso que se baña en lava
  P.mk('ig_vellorn', 40, 38, 2, (p, f) => { p.sell(20, 22, 18, 12, [I.bas[0], I.bas[1], I.bas[2], I.bas[3]]); P.Sprites.igCracks(p, 6, 14, 28, 16, I.gold[2], P.RNG(7 + f), 5); for (let k = 0; k < 4; k++) p.thick(8 + k * 8, 32, 8 + k * 8 + (f ? 1 : -1), 37, 3, I.bas[1]); p.ell(35, 18, 2.4, 2, '#ffffff'); for (let k = 0; k < 3; k++) p.tri(10 + k * 9, 12, 16 + k * 9, 12, 13 + k * 9, 4, I.bas[3]); });
  // GUARDIÁN DE FORJA: centinela reptiliano acorazado con escudo de obsidiana
  P.mk('ig_wraith', 20, 24, 3, (p, f) => { p.line(7, 18, 5, 23, I.bas[1]); p.line(12, 18, 14, 23, I.bas[1]); p.sell(9, 13, 6, 7, [I.cop[0], I.cop[1], I.cop[2], I.cop[3]]); p.sell(9, 5, 4, 4, [I.bas[1], I.bas[2], I.bas[3]]); p.tri(6, 2, 9, 2, 7, -2, I.cop[2]); p.ell(11, 5, 1.4, 1.2, f === 2 ? '#ffffff' : I.lava[3]); const sx = f === 1 ? 17 : 15; p.rect(sx, 5, 3, 15, I.bas[2]); p.rect(sx, 5, 1, 15, I.bas[4]); for (let y = 7; y < 20; y += 4) p.px(sx + 1, y, I.lava[2]); });
  P.mk('ig_b_glob', 7, 7, 2, (p, f) => { p.ell(3, 3, 3, 3, f ? I.lava[3] : I.lava[2]); p.px(2, 2, '#ffffff'); });
  P.mk('ig_b_orb', 8, 8, 2, (p, f) => { p.ell(4, 4, 3.6, 3.6, f ? I.lava[3] : I.lava[2]); p.ell(3, 3, 1.4, 1.4, I.lava[4]); });
  P.mk('ig_b_kspine', 12, 5, 1, p => { p.tri(0, 1, 0, 4, 11, 2, I.bas[3]); p.line(1, 2, 10, 2, I.lava[3]); });
  P.mk('ig_rock', 12, 12, 2, (p, f) => { p.sell(6, 6, 5, 4.6, [I.bas[0], I.bas[2], I.bas[3], I.bas[4]]); P.Sprites.igCracks(p, 2, 2, 7, 5, I.lava[2], P.RNG(f), 1); });
  P.mk('ig_gate', 34, 46, 1, p => { for (let k = 0; k <= 20; k++) { const a = Math.PI * k / 20; p.thick(17 - Math.cos(a) * 13, 44 - Math.sin(a) * 34, 17 - Math.cos(a) * 13, 44 - Math.sin(a) * 34, 5, k % 3 ? I.bas[2] : I.cop[2]); } p.rect(2, 42, 30, 4, I.bas[1]); p.ell(17, 14, 4, 4, I.lava[3]); p.px(17, 14, '#ffffff'); });
  const ic = (n, fn) => P.mk('i_' + n, 10, 10, 1, fn);
  ic('steam', p => { p.rect(2, 7, 6, 2, I.bas[3]); for (let k = 0; k < 4; k++) p.ell(5 + (k % 2), 5 - k, 1.4, 1, '#ffffff'); });
  ic('magmagun', p => { p.rect(1, 4, 5, 3, '#3a4258'); p.ell(7, 5, 2.6, 2.6, I.lava[2]); p.px(7, 4, I.lava[4]); });
  ic('basalt', p => { for (let k = 0; k < 3; k++) p.rect(1 + k * 3, 2 + (k % 2), 2, 7, I.bas[3 + (k % 2) * 0]); p.px(4, 5, I.lava[2]); });
  ic('eruption', p => { P.Sprites.igVolcano(p, 5, 9, 4, 6, [I.bas[1], I.bas[2], I.bas[3]], I.lava, P.RNG(1), true); });

  // ================= MAPA EXTERIOR =================
  for (const st of ['c', 'r']) { const on = st === 'r', LV = on ? I.lava : I.ash;
    P.mk('ig_o_grass_' + st, 16, 16, 3, (p, v) => { const r = P.RNG(2100 + v + (on ? 9 : 0)); p.rect(0, 0, 16, 16, on ? '#1a0e0a' : '#1e1a18'); for (let k = 0; k < 6; k++) p.px(r.int(0, 15), r.int(0, 15), on ? '#2a1410' : '#2a2422'); if (v === 1) P.Sprites.igCracks(p, 2, 2, 10, 8, LV[2], r, 1); if (v === 2) p.px(r.int(2, 13), r.int(2, 13), LV[3]); }, { outline: false });
    P.mk('ig_o_water_' + st, 16, 16, 2, (p, f) => { const lq = P.PAL.ignaria[st].liq; p.rect(0, 0, 16, 16, lq[2]); for (let k = 0; k < 4; k++) p.line((k * 5 + f * 3) % 16, (k * 4) % 16, (k * 5 + f * 3) % 16 + 3, (k * 4) % 16 + 1, lq[0]); p.px((f * 7) % 16, 8, lq[3]); }, { outline: false });
    P.mk('ig_o_tree_' + st, 34, 42, 2, (p, v) => { p.ell(17, 40, 12, 2.5, '#0a0404'); if (v === 0) { for (let y = 0; y < 26; y++) p.rect(15, 40 - y, 4, 1, I.bas[(y >> 2) % 2 ? 2 : 3]); for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.5; p.sell(17 + Math.cos(a) * 9, 14 + Math.sin(a) * 6, 4, 3, on ? [I.lava[0], I.lava[1], I.lava[2], I.lava[3]] : [I.ash[0], I.ash[1], I.ash[2], I.ash[3]]); } } else { for (let k = 0; k < 4; k++) p.rect(8 + k * 5, 40 - (14 + k * 6 - (k > 2 ? 8 : 0)), 4, 14 + k * 6 - (k > 2 ? 8 : 0), I.bas[2 + (k % 2)]); if (on) p.px(15, 20, I.lava[3]); } });
    P.mk('ig_o_ice_' + st, 16, 16, 2, (p, v) => { p.rect(0, 0, 16, 16, on ? '#3a3230' : '#2a2422'); for (let k = 0; k < 5; k++) p.px(2 + k * 3, 5 + v * 4, I.ash[3]); }, { outline: false });
    P.mk('ig_o_cliff_' + st, 16, 16, 3, (p, v) => { p.rect(0, 0, 16, 16, '#120a0a'); for (let x = 0; x < 16; x += 4) p.rect(x, 0, 3, 16, I.bas[1 + (x % 8 ? 1 : 0)]); if (v === 2) { p.rect(0, 0, 16, 2, I.bas[3]); p.px(6, 1, LV[2]); } if (v === 1) p.rect(0, 13, 16, 3, '#060404'); }, { outline: false });
    P.mk('ig_o_crack_' + st, 16, 16, 2, (p, f) => { const lq = P.PAL.ignaria[st].liq; p.rect(0, 0, 16, 16, on ? '#1a0e0a' : '#1e1a18'); for (let x = 0; x < 16; x++) { const y = 7 + Math.round(Math.sin(x * 0.5 + f) * 1.5); p.rect(x, y, 1, 2, lq[2]); p.px(x, y, lq[3]); } }, { outline: false });
  }
  P.mk('ig_o_path', 16, 16, 2, (p, v) => { p.rect(0, 0, 16, 16, '#3a3230'); for (let k = 0; k < 5; k++) p.px((k * 5 + v * 3) % 16, (k * 7) % 16, '#4e4440'); }, { outline: false });
  P.mk('ig_o_stone', 16, 16, 1, p => { p.rect(0, 0, 16, 16, '#2a1e18'); p.rect(0, 7, 16, 1, '#120c0a'); p.rect(7, 0, 1, 7, '#120c0a'); p.rect(11, 8, 1, 8, '#120c0a'); p.px(3, 3, '#c8642a'); }, { outline: false });
  P.mk('ig_o_goo', 16, 16, 2, (p, f) => { p.ell(8, 11, 6, 3, '#140806'); p.ell(8, 10, 4, 2, '#4a2010'); p.px(6 + f, 9, '#8a4a2a'); }, { outline: false });
  P.mk('ig_o_lamp', 10, 16, 2, (p, f) => { p.rect(4, 6, 2, 10, I.bas[2]); p.ell(5, 4, 2.4, 2.4 + f * 0.3, I.lava[3]); p.px(5, 3, I.lava[4]); });
  P.mk('ig_o_rock', 16, 16, 1, p => { p.sell(8, 10, 7, 5.5, [I.bas[0], I.bas[1], I.bas[2], I.bas[3]]); P.Sprites.igCracks(p, 4, 7, 8, 4, I.lava[2], P.RNG(3), 1); });
  P.mk('ig_o_pillar', 14, 30, 2, (p, f) => { if (f) { p.rect(3, 22, 8, 8, I.bas[2]); return; } for (let k = 0; k < 3; k++) p.rect(2 + k * 4, 29 - (20 + k * 4), 3, 20 + k * 4, I.bas[2 + (k % 2)]); p.px(7, 6, I.lava[3]); });
  P.mk('ig_o_house', 44, 38, 2, (p, f) => { p.tri(4, 36, 40, 36, 22, 10, f ? '#3a2a22' : '#2a2422'); p.rect(18, 26, 8, 10, '#0a0606'); if (f) p.rect(19, 27, 6, 4, I.lava[2]); p.rect(30, 14, 4, 12, I.bas[2]); });
  P.mk('ig_o_flower', 8, 8, 3, (p, v) => { p.line(4, 7, 4, 4, I.bas[3]); p.ell(4, 3, 1.8, 1.8, [I.lava[2], I.gold[2], I.lava[3]][v]); });
};
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildIgnaria(); }; })();
