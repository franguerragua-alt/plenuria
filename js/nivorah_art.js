'use strict';
// NÍVORAH — El Glaciar de las Auroras: arte del planeta (prefijo de sprites «nv_»)
P.PAL.nivorah = {
  // contaminado: nieve de ceniza, hielo negro, lodo helado violeta
  c: { soil: ['#22223a', '#34344e', '#4a4a68', '#64648a'], vein: '#8a6aff', top: ['#4e4866', '#7a7494', '#a49cbc', '#cac4dc'],
    liq: ['#140c2a', '#2e2260', '#5a4aa8', '#b8a8ff'], thorn: ['#2e2e5a', '#6a6ab0', '#b0b0f0', '#ffffff'],
    leaf: ['#34344a', '#52526e', '#7e7e9c', '#b4b4cc'], trunk: ['#262636', '#3e3e54', '#5a5a74'], glow: '#8a6aff', flower: ['#8a6aff', '#c0b0ff', '#ff5ad0'] },
  // restaurado: nieve blanca, hielo azul, agua glaciar y tundra turquesa
  r: { soil: ['#284a6e', '#3a6890', '#5688b4', '#88b6dc'], vein: '#5ef0ff', top: ['#a4c4e4', '#d6eaff', '#f2faff', '#ffffff'],
    liq: ['#0a3466', '#1a64aa', '#58b4ee', '#e0f8ff'], thorn: ['#5a88b0', '#a8e0ff', '#e8faff', '#ffffff'],
    leaf: ['#16665a', '#26987a', '#56d0a8', '#b0ffe0'], trunk: ['#3a4a6a', '#5a6a8e', '#8a9ab8'], glow: '#5ef0ff', flower: ['#ff8ad8', '#b48cff', '#5ef0ff', '#ffffff'] }
};
P.SKIES_N = {
  day: { r: ['#0e2a6a', '#2a5aa8', '#6aa0e0', '#bfe0ff', '#eef8ff'], c: ['#161226', '#2a2240', '#443858', '#625676', '#82769a'], cloud: ['#ffffff', '#e4f2ff', '#a8c4e8'], cloudC: ['#b8b0d0', '#8a80a8', '#4e4870'] },
  golden: { r: ['#14246a', '#4a52a4', '#b088b8', '#ffb4a0', '#ffe0c0'], c: ['#18102a', '#34244a', '#5e3e68', '#8a5a7a', '#b07a8a'], cloud: ['#fff0f0', '#f0c8d8', '#a088b8'], cloudC: ['#c0a0c0', '#8a6a98', '#4a3a68'] },
  dusk: { r: ['#030714', '#081430', '#0e2450', '#15386a', '#1e4c80'], c: ['#05030c', '#0e0818', '#181026', '#221834', '#2e2242'], cloud: ['#a0c0f0', '#6080c0', '#30406a'], cloudC: ['#7a6a9a', '#4a3a6a', '#2a1e40'] }
};
P.HERO_SKINS.glaciar = { name: 'Armadura Glaciar', d: '#1e3a6a', m: '#5a9ad8', l: '#b8e4ff', h: '#ffffff', j: '#0e1a34', e: '#ffffff', eg: '#5ef0ff', acc: '#ff8ad8', w: '#f4fbff' };
P.ART = P.ART || {};
P.ART.nivorah = {
  p: 'nv_', skies: P.SKIES_N, owMusic: 'nivorah_ow',
  owAmb: lf => 'rgba(8,10,30,' + (0.3 - lf * 0.2) + ')',
  flora: { L: 'farol_escarcha', F: 'liquen_azul', m: 'hongo_gelido', U: 'arbol_cristal', h: 'musgo_termal', y: 'edelweiss', lily: 'nenufar_termal', g: 'alce_boreal', legend: 'fenix_boreal' },
  tileFlora: { b: 'fumarola', '|': 'enredadera_artica', '^': 'espina_hielo' }
};

// Candelabro Boreal: árbol alienígena de NÍVORAH. Tronco recto de hielo con médula luminosa y pisos horizontales
// de agujas escarchadas (como una pagoda) de los que cuelgan filamentos de aurora. Contaminado: gris, pisos caídos.
P.Sprites.nvCandela = function (p, bx, by, s, st, v, mix) {
  const C0 = st === 'c' ? { tr: ['#2a2a3c', '#45455c', '#6a6a84', '#9090a8'], core: '#6a5a9a', tier: ['#2a2a40', '#4a4a64', '#70708c', '#a0a0bc'], fil: ['#5a5a70', '#7a7a90'], star: ['#4a3a7a', '#8a6aff', '#c0b0ff'] }
    : { tr: ['#5a7ab0', '#8ab4e0', '#c4e4ff', '#ffffff'], core: '#5ef0ff', tier: ['#2a6a8a', '#4aa8c8', '#9ae4f4', '#f0ffff'], fil: ['#5ef0c0', '#b48cff'], star: ['#3aa8d8', '#bff6ff', '#ffffff'] };
  const M = c => mix ? P.Col.mix(c, mix[0], mix[1]) : c, C = {};
  for (const k in C0) C[k] = Array.isArray(C0[k]) ? C0[k].map(M) : M(C0[k]);
  const Q = (dx, dy) => [bx + dx * s, by + dy * s], W = w => Math.max(1, w * s);
  const top = v ? -150 : -168, steps = Math.max(4, Math.ceil(-top * s));
  // raíces de hielo
  for (const sd of [-1, 1]) { const [x0, y0] = Q(sd * 12, 0), [x1, y1] = Q(sd * 2, -12), [x2, y2] = Q(0, 0); p.tri(x0, y0, x1, y1, x2, y2, C.tr[sd < 0 ? 2 : 0]); }
  // tronco recto, translúcido, con médula luminosa
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, [x, y] = Q(Math.sin(t * 2 + v) * 1.5, top * t), w = W(9 - 5 * t), xl = Math.round(x - w / 2);
    p.rect(xl, Math.round(y), Math.ceil(w), 1, C.tr[1]); p.px(xl, y, C.tr[2]); if (w > 3) p.px(xl + 1, y, C.tr[3]); p.px(xl + Math.ceil(w) - 1, y, C.tr[0]);
    if (w > 4) p.px(Math.round(x), y, i % 6 < 4 ? C.core : C.tr[2]);
  }
  // pisos de agujas, cada vez más estrechos
  const tiers = v ? [[-58, 34], [-92, 26], [-122, 17]] : [[-52, 40], [-84, 32], [-114, 24], [-142, 15]];
  tiers.forEach(([ty, r], i) => {
    const [cx, cy] = Q(Math.sin(ty / top * 2 + v) * 1.5, ty), rx = r * s, ry = Math.max(1.5, r * s * 0.22), droop = st === 'c' ? 0.5 : 0.18;
    // agujas: líneas desde el tronco hacia fuera, curvadas hacia abajo
    const n = Math.max(6, Math.round(rx * 1.2));
    for (let k = 0; k <= n; k++) { const f = k / n * 2 - 1, ex = cx + f * rx, ey = cy + Math.abs(f) * rx * droop + ry * 0.6; p.line(cx, cy, ex, ey, C.tier[1 + (k % 2)]); }
    p.ell(cx, cy + ry * 0.4, rx * 0.95, ry, C.tier[1]); p.ell(cx - rx * 0.1, cy, rx * 0.7, ry * 0.6, C.tier[2]); p.px(cx - rx * 0.4, cy - ry * 0.3, C.tier[3]);
    // escarcha en las puntas y filamentos de aurora colgantes
    for (const sd of [-1, 1]) p.px(cx + sd * rx, cy + rx * droop + ry * 0.6, C.tier[3]);
    if (rx > 5) for (let k = 0; k < (rx > 14 ? 4 : 2); k++) {
      const f = (k + 0.5) / (rx > 14 ? 4 : 2) * 2 - 1, x = cx + f * rx * 0.85, y0 = cy + Math.abs(f) * rx * droop + ry, len = (6 + ((k * 5 + i * 3) % 4) * 3) * s * (st === 'c' ? 0.5 : 1);
      p.line(x, y0, x, y0 + len, C.fil[k % 2]); p.px(x, y0 + len + 1, C.fil[(k + 1) % 2]);
    }
  });
  // estrella de cristal en la copa
  const [sx, sy] = Q(Math.sin(2 + v) * 1.5, top - 4);
  p.tri(sx - W(3), sy, sx + W(3), sy, sx, sy - W(10), C.star[1]); p.tri(sx - W(5), sy - W(4), sx + W(5), sy - W(4), sx, sy + W(2), C.star[0]); p.px(sx, sy - W(5), C.star[2]);
};

P.Sprites.buildNivorah = function () {
  const K = P.PAL.nivorah, MT = ['#1a1c2a', '#2e3346', '#4e5872', '#8a98bc'];
  const WH = ['#8aa0c8', '#c8d8f0', '#eef6ff', '#ffffff'], ART = ['#8a9ab8', '#c8d4e8', '#eef4ff', '#ffffff'], CY = '#5ef0ff';
  // ================= TESELAS =================
  for (const st of ['c', 'r']) {
    const pal = K[st], s = pal.soil, t = pal.top;
    P.mk('nv_t_soil_' + st, 16, 16, 3, (p, v) => {
      const r = P.RNG(310 + v * 7 + (st === 'c' ? 3 : 0));
      p.rect(0, 0, 16, 16, s[1]);
      for (let i = 0; i < 3; i++) { const x = r.int(0, 12), y = r.int(0, 12), w = r.int(3, 6); p.line(x, y, x + w, y + r.int(-2, 2), s[0]); p.px(x + 1, y - 1, s[2]); }
      for (let i = 0; i < 2; i++) { const x = r.int(2, 13), y = r.int(2, 13); p.tri(x - 2, y + 2, x + 2, y + 2, x, y - 2, s[2]); p.px(x, y - 1, s[3]); }
      if (v === 1) { const x = r.int(3, 11), y = r.int(4, 10); p.tri(x, y + 2, x + 2, y + 2, x + 1, y - 2, st === 'c' ? '#5a4a9a' : '#9ae8ff'); p.px(x + 1, y - 1, st === 'c' ? '#8a6aff' : '#ffffff'); }
    }, { outline: false });
    // capa de nieve con bordes redondeados y brillos
    P.mk('nv_t_top_' + st, 16, 9, 3, (p, v) => {
      const r = P.RNG(330 + v * 5 + (st === 'c' ? 9 : 0));
      p.rect(0, 3, 16, 4, t[2]); p.rect(0, 6, 16, 1, t[1]);
      for (let x = 0; x < 16; x++) { const h = Math.round(1.5 + Math.sin(x * 0.6 + v * 2) * 1.2); for (let y = 3 - h; y < 3; y++) p.px(x, y, t[3]); if (r() < 0.4) p.px(x, 7, t[1]); }
      for (let i = 0; i < 2; i++) p.px(r.int(1, 14), r.int(2, 4), '#ffffff');
      if (st === 'c') { p.px(r.int(1, 14), 4, t[0]); p.px(r.int(1, 14), 5, t[0]); }
    }, { outline: false });
    // carámbanos bajo los salientes
    P.mk('nv_t_bot_' + st, 16, 7, 2, (p, v) => { const r = P.RNG(350 + v); for (let i = 0; i < 4; i++) { const x = r.int(1, 14), l = r.int(2, 6); p.tri(x - 1, 0, x + 1, 0, x, l, st === 'c' ? '#5a5a8a' : '#bfefff'); p.px(x, 0, '#ffffff'); } }, { outline: false });
    P.mk('nv_tdeco_' + st, 16, 14, 6, (p, v) => {
      const L = pal.leaf;
      if (v === 0) { for (let i = 0; i < 5; i++) { const x = 3 + i * 2.4, h = 4 + (i % 3) * 2; p.line(x, 13, x + (i - 2) * 0.6, 13 - h, L[1]); p.px(x + (i - 2) * 0.6, 13 - h, L[3]); } }
      if (v === 1) { p.ell(8, 12, 6, 2.5, pal.top[2]); p.ell(6, 11, 3, 1.5, pal.top[3]); }
      if (v === 2) { p.tri(5, 13, 9, 13, 7, 4, st === 'c' ? '#4a4a8a' : '#a8e8ff'); p.tri(8, 13, 12, 13, 11, 7, st === 'c' ? '#6a5aaa' : '#d8f8ff'); p.px(7, 6, '#ffffff'); }
      if (v === 3) { p.sell(9, 11, 4.5, 3, [s[0], s[1], s[2], s[3]]); p.ell(9, 8.5, 3.5, 1, pal.top[3]); }
      if (v === 4) { if (st === 'r') for (let i = 0; i < 3; i++) { const x = 4 + i * 4, c2 = pal.flower[i]; p.line(x, 13, x, 9 - i, L[1]); for (let k = 0; k < 4; k++) p.px(x + [1, -1, 0, 0][k], 8 - i + [0, 0, 1, -1][k], c2); p.px(x, 8 - i, '#ffffff'); } else { p.line(6, 13, 6, 8, '#5a5a70'); p.line(10, 13, 11, 9, '#5a5a70'); } }
      if (v === 5) { for (let i = 0; i < 3; i++) p.line(5 + i * 3, 13, 4 + i * 3 + (i - 1) * 2, 7, L[2]); p.px(5, 8, pal.top[3]); p.px(11, 8, pal.top[3]); }
    });
    const lq = pal.liq;
    P.mk('nv_t_liq_' + st, 16, 16, 4, (p, f) => {
      for (let x = 0; x < 16; x++) { const h = Math.round(2 + Math.sin((x + f * 4) * 0.4) * 1); for (let y = h; y < 16; y++) p.dith(x, y, y < h + 3 ? lq[2] : lq[1], lq[1], y < h + 3 ? (y - h) / 3 : 0); p.px(x, h, lq[3]); }
      // placas de hielo flotando en la superficie
      p.rect((f * 3) % 12, 1, 5, 2, lq[3]); p.px((f * 3) % 12 + 1, 1, '#ffffff');
      if (st === 'c') { p.px(3, 9, '#8a6aff'); p.px(12, 12, '#8a6aff'); }
    }, { outline: false });
    P.mk('nv_t_liqb_' + st, 16, 16, 2, (p, f) => { p.grad(0, 0, 16, 16, [lq[1], lq[0]]); for (let i = 0; i < 4; i++) p.px((i * 5 + f * 2) % 16, (i * 7 + f * 3) % 16, lq[2]); }, { outline: false });
    const th = pal.thorn;
    P.mk('nv_t_thorn_' + st, 16, 16, 2, (p, f) => { p.ell(8, 14, 8, 2.5, s[1]); for (let i = 0; i < 5; i++) { const x = 2 + i * 3 + (f ? 1 : 0), h = 7 + (i % 2) * 5; p.tri(x - 2, 14, x + 2, 14, x, 14 - h, th[1]); p.line(x, 14, x, 15 - h, th[2]); p.px(x, 14 - h, th[3]); } });
    // enredadera ártica con flores de escarcha
    P.mk('nv_t_vine_' + st, 16, 16, 2, (p, v) => {
      for (let y = 0; y < 16; y++) { const x = 8 + Math.round(Math.sin((y + v * 8) * 0.45) * 1.2); p.px(x, y, st === 'c' ? '#5a5a74' : '#3a8a7a'); p.px(x + 1, y, st === 'c' ? '#34344a' : '#1a5a4a'); }
      for (let y = 2; y < 16; y += 5) { p.ell(5, y, 2, 1.2, pal.leaf[1]); p.ell(11, y + 2, 2, 1.2, pal.leaf[2]); p.px(5, y - 1, pal.top[3]); }
    }, { outline: false });
    // puente de hielo con pilotes (un sentido)
    P.mk('nv_t_branch_' + st, 16, 8, 2, (p, v) => { p.rect(0, 1, 16, 4, st === 'c' ? '#5a5a80' : '#a8d8f4'); p.rect(0, 1, 16, 1, st === 'c' ? '#8a8ab0' : '#ffffff'); p.rect(0, 4, 16, 1, st === 'c' ? '#3a3a5a' : '#5a98c8'); p.px(3 + v * 6, 2, '#ffffff'); p.line(0, 6, 15, 6, st === 'c' ? '#2a2a40' : '#3a6890'); });
    // fumarola termal (rebote): chorro de vapor
    P.mk('nv_t_bulb_' + st, 16, 16, 3, (p, f) => {
      p.ell(8, 15, 7, 1.5, s[0]); p.sell(8, 12, 6, 3.5, [s[0], s[1], s[2], s[3]]); p.ell(8, 10, 3, 1.2, st === 'c' ? '#2a1a4a' : '#0a2a4a'); p.ell(8, 10, 2, 0.8, st === 'c' ? '#8a6aff' : '#ffb060');
      const h = [3, 8, 5][f]; for (let i = 0; i < h; i++) p.px(8 + Math.round(Math.sin(i + f) * 1.2), 9 - i, i % 2 ? '#ffffff' : '#d8ecff');
    });
    P.mk('nv_t_ice_' + st, 16, 16, 3, (p, v) => {
      const I = st === 'c' ? ['#3a3a6a', '#5a5a90', '#8a8ac0', '#c8c8f0'] : ['#5aa8d8', '#8ad0f0', '#c4ecff', '#ffffff'];
      p.grad(0, 0, 16, 16, [I[2], I[1], I[1], I[0]]); p.rect(0, 0, 16, 1, I[3]); p.line(2 + v * 3, 3, 6 + v * 3, 7, I[3]); p.line(3 + v * 3, 3, 7 + v * 3, 7, I[2]);
      p.rect(0, 15, 16, 1, I[0]); if (v === 2) { p.line(10, 9, 14, 13, I[0]); p.px(12, 10, I[3]); }
    }, { outline: false });
  }
  // ruinas arturianas: paneles blancos de observatorio
  P.mk('nv_t_ruin', 16, 16, 3, (p, v) => { p.grad(0, 0, 16, 16, [ART[2], ART[1], ART[1], ART[0]]); p.rect(0, 0, 16, 1, ART[3]); p.rect(0, 15, 16, 1, '#5a6a8a'); p.rect(0, 7, 16, 1, ART[0]); p.rect(v === 1 ? 5 : 11, 0, 1, 7, ART[0]); if (v === 2) { p.rect(4, 9, 8, 4, '#2a3a5a'); p.rect(5, 10, 6, 2, CY); } if (v === 0) p.px(3, 3, CY); }, { outline: false });
  P.mk('nv_t_ruintop', 16, 6, 1, p => { p.rect(0, 2, 16, 2, '#eef6ff'); p.rect(0, 2, 16, 1, '#ffffff'); for (let x = 2; x < 16; x += 5) p.px(x, 3, CY); }, { outline: false });
  P.mk('nv_t_crack', 16, 16, 1, p => { p.grad(0, 0, 16, 16, ['#88b6dc', '#5688b4', '#3a6890']); p.line(3, 0, 7, 6, '#1a2a4a'); p.line(7, 6, 5, 11, '#1a2a4a'); p.line(7, 6, 13, 9, '#1a2a4a'); p.line(5, 11, 2, 16, '#1a2a4a'); p.px(8, 6, '#ffffff'); }, { outline: false });

  // ================= FONDOS =================
  const bgSky = (st, sky) => {
    const SK = P.SKIES_N[sky], p = new P.Painter(P.W, P.H), r = P.RNG(st === 'c' ? 141 : 142);
    p.grad(0, 0, P.W, P.H, SK[st]);
    for (let i = 0; i < (sky === 'dusk' ? 140 : sky === 'golden' ? 40 : 12); i++) p.px(r.int(0, P.W), r.int(0, 150), r() < 0.25 ? '#ffffff' : '#a8c8ff');
    const c = p.canvas(), x = c.getContext('2d');
    // auroras: cortinas onduladas (verdes y violetas; enfermizas y tenues en territorio contaminado)
    if (sky !== 'day' || st === 'r') {
      x.globalCompositeOperation = 'lighter';
      const bands = st === 'r' ? [['94,240,192', 0.32], ['180,140,255', 0.22], ['94,232,255', 0.18]] : [['138,106,255', 0.12], ['120,90,150', 0.08]];
      bands.forEach(([col, a], b) => {
        for (let xx = 0; xx < P.W; xx += 2) {
          const y0 = 30 + b * 18 + Math.sin(xx * 0.02 + b * 1.7) * 14 + Math.sin(xx * 0.051 + b) * 6, h = 40 + Math.sin(xx * 0.03 + b * 2) * 18;
          const g = x.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, 'rgba(' + col + ',0)'); g.addColorStop(0.7, 'rgba(' + col + ',' + (a * (sky === 'day' ? 0.5 : 1)) + ')'); g.addColorStop(1, 'rgba(' + col + ',0)');
          x.fillStyle = g; x.fillRect(xx, y0, 2, h);
        }
      });
      x.globalCompositeOperation = 'source-over';
    }
    // sol pálido tras la Esfera
    const sx = 96, sy = sky === 'dusk' ? 200 : sky === 'golden' ? 120 : 60;
    if (sky !== 'dusk') { x.globalCompositeOperation = 'lighter'; const gl = x.createRadialGradient(sx, sy, 2, sx, sy, 90); gl.addColorStop(0, 'rgba(240,248,255,0.7)'); gl.addColorStop(1, 'rgba(160,200,255,0)'); x.fillStyle = gl; x.fillRect(sx - 90, sy - 90, 180, 180); x.globalCompositeOperation = 'source-over'; x.fillStyle = '#f4fbff'; x.beginPath(); x.arc(sx, sy, 12, 0, 7); x.fill(); x.strokeStyle = st === 'c' ? 'rgba(40,30,70,0.5)' : 'rgba(120,140,190,0.35)'; x.lineWidth = 1; for (let i = -2; i <= 2; i++) { x.beginPath(); x.ellipse(sx, sy, 16, 16 * Math.abs(Math.cos(i * 0.55)) + 1, 0, 0, 7); x.stroke(); } }
    // nubes altas
    const CL = st === 'c' ? SK.cloudC : SK.cloud;
    x.globalAlpha = 0.72; x.drawImage(P.cloudLayer(cp => { for (let i = 0; i < 4; i++) P.paintStratus(cp, r.int(0, P.W), r.int(44, 120), r.int(90, 170), [CL[0], CL[1], CL[2]], r, { lit: 'top' }); }), 0, 0); x.globalAlpha = 1;
    return c;
  };
  for (const sky in P.SKIES_N) for (const st of ['c', 'r']) P.mkCanvas('nv_bg_sky_' + st + '_' + sky, [bgSky(st, sky)]);
  for (const st of ['c', 'r']) {
    const hz = P.SKIES_N.day[st][3], pal = K[st];
    // lejos: cordillera glaciar de picos afilados con nieve
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(st === 'c' ? 151 : 152);
      const R0 = P.Col.mix(st === 'c' ? '#3a3a58' : '#4a6a9a', hz, 0.5), R1 = P.Col.mix(st === 'c' ? '#5a5a78' : '#7aa0cc', hz, 0.45), SN = P.Col.mix(st === 'c' ? '#9a94b4' : '#f4fbff', hz, 0.2);
      let x = -20; while (x < W + 40) { const w = r.int(50, 110), h = r.int(70, 120), bx = x + w / 2, by = 190;
        for (let yy = by - h; yy < P.H; yy++) { const k = (yy - (by - h)) / h, half = Math.min(w, k * w * 0.9); p.rect(bx - half, yy, half, 1, R1); p.rect(bx, yy, half, 1, R0); if (k < 0.28) { p.rect(bx - half, yy, half * 2, 1, SN); } }
        x += w * 0.7; }
      P.mkCanvas('nv_bg_far_' + st, [p.canvas()]); }
    // medio: acantilados de hielo, cúpulas de observatorios arturianos y candelabros lejanos
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(st === 'c' ? 161 : 162);
      const I0 = P.Col.mix(st === 'c' ? '#2e2e4a' : '#3a6a9a', hz, 0.25), I1 = P.Col.mix(st === 'c' ? '#46466a' : '#6aa4d4', hz, 0.25), I2 = P.Col.mix(st === 'c' ? '#7a7aa0' : '#c4ecff', hz, 0.15);
      for (let i = 0; i < 4; i++) { const x0 = i * 160 + r.int(-10, 20), w = r.int(80, 120), top = r.int(110, 150);
        for (let yy = top; yy < P.H; yy++) { const ww = w + Math.round((yy - top) * 0.15); p.rect(x0 - ww / 2, yy, ww, 1, I1); p.rect(x0 - ww / 2, yy, 3, 1, I2); for (let k = 0; k < 4; k++) p.px(x0 - ww / 2 + 8 + k * (ww / 4), yy, (yy + k * 7) % 11 < 2 ? I0 : I1); }
        p.rect(x0 - w / 2, top, w, 3, P.Col.mix('#ffffff', hz, 0.2));
        if (i % 2 === 0) { const dx = x0 + r.int(-20, 20); p.sell(dx, top - 1, 14, 10, [I0, I1, I2, '#ffffff'].map(c2 => P.Col.mix(c2, hz, 0.15))); p.rect(dx - 15, top - 1, 30, 3, I0); p.rect(dx - 1, top - 18, 2, 8, I0); p.px(dx, top - 19, st === 'c' ? '#8a6aff' : CY); p.rect(dx - 4, top - 6, 8, 2, st === 'c' ? '#2a2a40' : '#ffd166'); } }
      for (let i = 0; i < 8; i++) P.Sprites.nvCandela(p, r.int(10, 630), P.H - r.int(2, 24), r.range(0.22, 0.32), st, i % 2, [hz, 0.35]);
      P.mkCanvas('nv_bg_mid_' + st, [p.canvas()]); }
    // cerca: ventisqueros
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(st === 'c' ? 171 : 172), D = st === 'c' ? ['#5a5474', '#7a7494'] : ['#bcd8f0', '#eef8ff'];
      for (let x = 0; x < W; x++) { const y = Math.round(P.H - 16 + Math.sin(x * 0.025) * 7 + Math.sin(x * 0.07) * 2); p.rect(x, y, 1, P.H - y, D[0]); p.px(x, y, D[1]); p.px(x, y + 1, D[1]); }
      for (let i = 0; i < 10; i++) { const x = r.int(0, W); p.tri(x - 4, P.H - 12, x + 4, P.H - 12, x, P.H - 24 - r.int(0, 8), st === 'c' ? '#4a4a7a' : '#a8e0ff'); }
      P.mkCanvas('nv_bg_near_' + st, [p.canvas()]); }
    // árboles gigantes: Candelabro Boreal (v0) y antena arturiana (v1, rígida)
    P.mk('nv_bigtree_' + st, 110, 190, 2, (p, v) => {
      if (v === 0) { P.Sprites.nvCandela(p, 55, 188, 1, st, 0); return; }
      const A = st === 'c' ? ['#3a3a52', '#5a5a74', '#8a8aa4', '#b0b0c8'] : ART;
      p.rect(38, 176, 34, 14, A[0]); p.rect(38, 176, 34, 2, A[2]); p.rect(44, 168, 22, 8, A[1]);
      for (let y = 60; y < 168; y++) { const w = 6 + Math.round((y - 60) / 108 * 6); p.rect(55 - w / 2, y, w, 1, A[1]); p.px(55 - w / 2, y, A[3]); p.px(55 + w / 2 - 1, y, A[0]); if (y % 14 === 0) p.rect(55 - w / 2 - 2, y, w + 4, 2, A[0]); }
      for (let y = 70; y < 160; y += 14) { p.line(55 - 5, y, 55 + 5, y + 14, A[0]); p.line(55 + 5, y, 55 - 5, y + 14, A[0]); }
      p.ell(55, 48, 20, 6, A[1]); p.ell(55, 46, 18, 4, A[2]); p.rect(54, 30, 2, 18, A[0]); p.ell(55, 28, 3, 3, st === 'c' ? '#8a6aff' : CY); p.px(54, 27, '#ffffff');
      for (const s2 of [-1, 1]) { p.line(55, 40, 55 + s2 * 16, 30, A[0]); p.px(55 + s2 * 16, 29, st === 'c' ? '#5a4a9a' : '#ff5a8a'); }
      if (st === 'c') { p.line(48, 100, 62, 120, '#1a1a2a'); for (const x of [42, 70]) p.tri(x - 3, 176, x + 3, 176, x, 164, '#6a5aaa'); }
      else for (let k = 0; k < 2; k++) p.ell(46 + k * 18, 175, 7, 2, '#ffffff');
    }, { up: 0.1, down: 0.15, dark: 0.5 });
  }
  { // cueva de hielo: capas de techo y suelo con carámbanos y cristales anclados
    const W = 640, p = new P.Painter(W, P.H), r = P.RNG(399); p.grad(0, 0, W, P.H, ['#060c1c', '#0e1e3a', '#14284a', '#08101e']);
    const CR = [['#2a6a9a', '#7ad8ff', '#e8faff'], ['#4a3a8a', '#b48cff', '#efe6ff'], ['#1a6a6a', '#5ef0c0', '#d8fff0']];
    for (let l = 0; l < 3; l++) {
      const col = ['#0e1a30', '#16264a', '#1e3460'][l], hi = ['#1e2e50', '#2a4470', '#3a5a8a'][l]; let h = 46 + l * 18, g = 40 + l * 14; const top = [], bot = [];
      for (let x = 0; x < W; x++) { h += r.range(-2.2, 2.2); h = P.clamp(h, 26 + l * 16, 88 + l * 14); g += r.range(-2, 2); g = P.clamp(g, 22 + l * 12, 70 + l * 12); const ht = Math.round(h - l * 14), gb = Math.round(P.H - g + l * 16); top[x] = ht; bot[x] = gb; p.rect(x, 0, 1, ht, col); p.px(x, ht - 1, hi); p.rect(x, gb, 1, P.H - gb, col); p.px(x, gb, hi); }
      for (let i = 0; i < 14; i++) { const x = r.int(4, W - 6), len = r.int(6, 18 + l * 6); p.tri(x - 2, top[x] - 1, x + 2, top[x] - 1, x, top[x] + len, P.Col.mix('#bfefff', col, 0.4 - l * 0.1)); p.px(x, top[x] + len - 1, '#ffffff'); }
      for (let i = 0; i < 6; i++) { const c2 = r.pick(CR), x = r.int(4, W - 6), s = r.int(2, 4 + l * 2), base = bot[x] + 2; p.tri(x - s / 2, base, x + s / 2, base, x, base - s * 2.4, c2[1]); p.tri(x - s / 2, base, x, base, x, base - s * 2.4, c2[0]); p.px(x, base - s * 2, c2[2]); }
    }
    P.mkCanvas('nv_bg_cave', [p.canvas()]); }

  // ================= FLORA =================
  for (const st of ['c', 'r']) {
    const L = K[st].leaf;
    // liquen azul: tallos cristalinos en abanico
    P.mk('nv_fern_' + st, 22, 16, 2, (p, f) => { for (let i = 0; i < 9; i++) { const a = -2.8 + i * 0.32 + (f ? 0.04 : 0), Ln = 7 + (i % 3) * 3; for (let k = 0; k < Ln; k++) p.px(11 + Math.cos(a) * k, 15 + Math.sin(a) * k, k > Ln - 2 ? (st === 'r' ? '#ffffff' : '#a0a0c0') : L[1 + (k % 2)]); } });
  }
  P.mk('nv_lamp', 14, 22, 2, (p, f) => { p.line(7, 21, 7, 8, '#3a8a7a'); p.line(7, 8, 10, 5, '#3a8a7a'); p.ell(4, 18, 3, 1.2, '#26987a'); p.ell(10, 15, 3, 1.2, '#56d0a8'); p.sell(10, 8 + f * 0.5, 3.2, 3.8, ['#2a8ac8', '#7ad8ff', '#d8f8ff', '#ffffff']); p.px(10, 11 + f, '#ffffff'); p.rect(9, 4, 3, 1, '#3a8a7a'); });
  P.mk('nv_mush', 18, 16, 2, (p, f) => { p.ell(9, 15, 6, 1.4, '#2a2a40'); p.rect(8, 9, 3, 6, '#c8c0e8'); p.sell(9, 8 - f, 7, 4.5 + f * 0.4, ['#4a2a8a', '#8a5ad8', '#c8a8ff', '#ffffff']); for (let i = 0; i < 4; i++) p.px(5 + i * 3, 7 - f + (i % 2), '#ffffff'); p.line(4, 10 - f, 3, 13 - f, '#c8a8ff'); p.line(14, 10 - f, 15, 13 - f, '#c8a8ff'); });
  P.mk('nv_bigmush', 30, 34, 1, p => { p.rect(14, 18, 3, 16, '#5a8ab0'); for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.42, L = 12 + (i % 2) * 5; p.thick(15, 20, 15 + Math.cos(a) * L, 20 + Math.sin(a) * L, 2.5, i % 2 ? '#a8e8ff' : '#7ad0f4'); p.px(15 + Math.cos(a) * L, 20 + Math.sin(a) * L, '#ffffff'); } p.ell(15, 20, 4, 3, '#d8f8ff'); p.px(14, 19, '#ffffff'); });
  P.mk('nv_orchid', 14, 16, 2, (p, f) => { p.line(7, 15, 7, 8, '#26987a'); p.ell(4, 13, 3, 1.2, '#56d0a8'); for (let i = 0; i < 5; i++) { const a = i * 1.257 + f * 0.2; p.thick(7, 5, 7 + Math.cos(a) * 4, 5 + Math.sin(a) * 4, 1.6, '#ffffff'); p.px(7 + Math.cos(a) * 4, 5 + Math.sin(a) * 4, '#d8ecff'); } p.ell(7, 5, 1.6, 1.6, '#ffd166'); });
  P.mk('nv_lily', 18, 6, 1, p => { p.ell(9, 3, 8.5, 2.3, '#26987a'); p.ell(8, 2.5, 6, 1.4, '#56d0a8'); for (let i = 0; i < 5; i++) p.ell(11 + Math.cos(i * 1.25) * 2, 1.5 + Math.sin(i * 1.25), 1.2, 1, '#ff8ad8'); p.px(11, 1, '#ffffff'); });
  P.mk('nv_heal', 16, 18, 2, (p, f) => { for (let i = 0; i < 7; i++) p.ell(3 + i * 1.7, 16 - (i % 3), 2.2, 1.6, f ? '#5a5a70' : (i % 2 ? '#3aa87a' : '#5ad0a0')); if (!f) { p.sell(8, 8, 3.5, 4, ['#a8400a', '#ff8a3a', '#ffd090', '#ffffff']); p.rect(7, 6, 3, 1, '#ffffff'); p.rect(8, 5, 1, 3, '#ffffff'); } });

  // ================= FAUNA =================
  // Glotón Ártico (cuadrúpedo peludo que embiste)
  const glot = (p, f, o) => {
    const w = f === 4, st = w ? 0 : f;
    for (let i = 0; i < 4; i++) { const lx = o.cx - o.rx * 0.7 + i * o.rx * 0.46, lift = ((st + i) % 2) * 2; p.thick(lx, o.by - 6, lx + (i < 2 ? -1 : 1), o.by - 1 - lift, 2.2, o.c[0]); }
    p.sell(o.cx, o.by - 8 + (w ? 2 : 0), o.rx, o.ry, o.c); for (let i = 0; i < 6; i++) p.px(o.cx - o.rx + 3 + i * 3, o.by - 8 - o.ry + 2 + (w ? 2 : 0), o.c[3]);
    p.thick(o.cx - o.rx, o.by - 9, o.cx - o.rx - 5, o.by - 13, 2.4, o.c[1]);
    const hx = o.cx + o.rx + (w ? -1 : 1), hy = o.by - 10 + (w ? 3 : 0); p.sell(hx, hy, o.rx * 0.5, o.ry * 0.7, o.c); p.px(hx + 2, hy - 1, o.eye); p.tri(hx - 2, hy - o.ry * 0.6, hx, hy - o.ry * 0.6, hx - 1, hy - o.ry - 1, o.c[0]);
    p.rect(hx + 1, hy + 2, 3, 1, '#ffffff'); if (o.stripe) p.line(o.cx - o.rx + 2, o.by - 8, o.cx + o.rx - 2, o.by - 8, o.stripe);
  };
  P.mk('nv_krazith', 32, 22, 5, (p, f) => glot(p, f, { cx: 15, by: 21, rx: 9, ry: 5, c: ['#3a2a2a', '#6a4a3a', '#9a7a5a', '#d8c8a8'], eye: '#ffd166', stripe: '#e8d8b0' }));
  P.mk('nv_krazith_cy', 34, 24, 5, (p, f) => { glot(p, f, { cx: 16, by: 23, rx: 10, ry: 5.5, c: MT, eye: '#ff2040' }); p.rect(10, 11, 10, 3, '#3a0a14'); p.px(12, 12, '#ff3050'); p.px(18, 12, CY); });
  // Mamut de Escarcha (mini jefe): lana, colmillos curvos y escarcha en el lomo
  P.mk('nv_krazith_alfa', 52, 36, 5, (p, f) => {
    const st = f % 4, C = ['#3a2a3a', '#6a5a7a', '#a090b0', '#e0d8f0'];
    for (let i = 0; i < 4; i++) { const lx = 12 + i * 8, lift = f < 4 ? ((st + i) % 2) * 2 : 0; p.rect(lx, 25 - lift, 6, 10 + lift, C[0]); p.rect(lx, 33, 6, 2, '#1a1424'); }
    p.sell(24, 18, 17, 11, C); for (let i = 0; i < 8; i++) p.line(10 + i * 4, 22, 9 + i * 4, 28, C[0]);
    for (let i = 0; i < 4; i++) p.tri(14 + i * 6, 9, 18 + i * 6, 9, 16 + i * 6, 3 - (i % 2) * 2, '#bfefff');
    const hx = f === 4 ? 40 : 42; p.sell(hx, 15, 8, 8, C); p.px(hx + 2, 12, '#ffef3a');
    p.thick(hx + 4, 19, hx + 4, 33, 3, C[1]); p.thick(hx + 4, 33, hx + 7, 34, 2, C[1]);
    for (const [dy, s] of [[0, 1], [2, 0.8]]) { let px = hx + 2, py = 19 + dy; for (let k = 0; k < 8; k++) { const a = 0.3 + k * 0.32 * s; const nx = px + Math.cos(a) * 1.6, ny = py + Math.sin(a) * 1.6 - 0.6; p.thick(px, py, nx, ny, 2, '#fff8e0'); px = nx; py = ny; } }
  }, { up: 0.08 });
  // Pingüino Saltarín: 0 de pie · 1 salto (aletas abiertas) · 2 lanza bola de nieve
  P.mk('nv_frog', 20, 17, 3, (p, f) => {
    const y = f === 1 ? 6 : 8; p.sell(10, y + 2, 5.5, 7, ['#0e1428', '#1e2a48', '#3a4a70', '#6a7aa0']); p.ell(11, y + 4, 3.5, 5, '#ffffff'); p.ell(11, y + 3, 2.5, 3.5, '#eef6ff');
    p.sell(11, y - 4, 4, 3.5, ['#0e1428', '#1e2a48', '#3a4a70']); p.px(13, y - 5, '#ffffff'); p.px(13, y - 4, '#0e1428'); p.tri(14, y - 3, 18, y - 2, 14, y - 1, '#ffb030');
    const fl = f === 1 ? -4 : f === 2 ? 3 : 0; p.thick(6, y, 3, y + 4 + fl, 2, '#1e2a48'); p.thick(15, y + 1, 17, y + 5 + (f === 2 ? -6 : fl), 2, '#1e2a48');
    p.rect(7, 15, 3, 2, '#ffb030'); p.rect(11, 15, 3, 2, '#ffb030'); if (f === 2) { p.ell(18, y - 3, 2.2, 2.2, '#ffffff'); }
  });
  // Polilla Aurora y Dron Gélido
  P.mk('nv_dfly', 26, 16, 2, (p, f) => {
    const wy = f ? 2 : 6; p.ell(8, wy + 3, 7, 5 - f, '#5ef0c0'); p.ell(18, wy + 3, 7, 5 - f, '#b48cff'); p.ell(8, wy + 3, 4, 3, '#d8fff0'); p.ell(18, wy + 3, 4, 3, '#efe6ff'); p.px(8, wy + 3, '#ffffff'); p.px(18, wy + 3, '#ffffff');
    p.sell(13, 10, 2.5, 4.5, ['#2a2a4a', '#5a5a8a', '#a0a0d0']); p.line(12, 5, 10, 2, '#a0a0d0'); p.line(14, 5, 16, 2, '#a0a0d0');
  });
  P.mk('nv_dfly_cy', 26, 16, 2, (p, f) => { p.sell(13, 9, 7, 4, MT); p.rect(4, 6 - f, 18, 2, MT[2]); p.rect(2, 5 - f, 4, 1, MT[3]); p.rect(20, 5 - f, 4, 1, MT[3]); p.ell(13, 10, 2.5, 2, CY); p.px(12, 9, '#ffffff'); p.rect(11, 13, 4, 2, '#2a3346'); });
  // Foca Glaciar
  P.mk('nv_slug', 28, 15, 2, (p, f) => { p.sell(13, 9, 11, 5.5, ['#3a4a6a', '#6a84a8', '#a8c0dc', '#e8f4ff']); for (let i = 0; i < 5; i++) p.px(6 + i * 3, 7 + (i % 2), '#3a4a6a'); p.sell(23 + f, 7, 4, 3.5, ['#3a4a6a', '#6a84a8', '#a8c0dc']); p.px(25 + f, 6, '#0a0a14'); p.px(26 + f, 8, '#0a0a14'); p.line(27 + f, 8, 29 + f, 7, '#e8f4ff'); p.tri(1, 9 - f, 4, 11, 1, 13 + f, '#3a4a6a'); p.tri(9, 13, 13, 13, 10, 15, '#3a4a6a'); });
  // Murciélago de Hielo: 0 colgado y plegado · 1 en picado
  P.mk('nv_vsnake', 12, 34, 2, (p, f) => {
    const B = ['#1a1a34', '#3a3a6a', '#7a7ab8'];
    if (!f) { p.line(6, 0, 6, 2, '#8a98bc'); p.sell(6, 8, 3.5, 6, B); p.tri(2, 4, 3, 12, 5, 8, B[0]); p.tri(10, 4, 9, 12, 7, 8, B[0]); p.px(5, 11, CY); p.px(7, 11, CY); return; }
    for (let y = 0; y < 20; y += 3) p.px(6, y, '#bfefff');
    p.sell(6, 26, 3, 4, B); p.tri(0, 20, 6, 24, 1, 30, B[1]); p.tri(12, 20, 6, 24, 11, 30, B[1]); p.px(5, 27, CY); p.px(7, 27, CY); p.px(6, 30, '#ffffff');
  });
  // Flor Carámbano (planta mutada que muerde)
  P.mk('nv_maw', 26, 34, 3, (p, f) => {
    p.rect(11, 16, 4, 18, '#2a6a7a'); p.rect(11, 16, 1, 18, '#5aa8b8'); p.ell(7, 28, 5, 2, '#26987a'); p.ell(19, 25, 5, 2, '#26987a');
    const open = f > 0 ? (f === 1 ? 6 : 9) : 1, hx = 13 + (f === 2 ? 3 : 0), hy = 11, T = ['#3a3a8a', '#6a8ad8', '#bfe8ff', '#ffffff'];
    p.sell(hx, hy - open / 2, 9, 5, T); p.sell(hx, hy + open / 2 + 2, 8.5, 4, [T[0], T[1], T[2]]);
    for (let i = 0; i < 4; i++) p.tri(hx - 7 + i * 4, hy - open / 2 - 3, hx - 5 + i * 4, hy - open / 2 - 3, hx - 6 + i * 4, hy - open / 2 - 9, '#e8faff');
    if (open > 2) { p.rect(hx - 7, hy - open / 2 + 3, 14, open, '#0e0a2a'); for (let i = -6; i <= 6; i += 2) { p.px(hx + i, hy - open / 2 + 3, '#ffffff'); p.px(hx + i + 1, hy + open / 2 + 2, '#ffffff'); } }
  });
  // Alce Boreal (solo restaurado) con cornamenta de cristal
  P.mk('nv_grazer', 38, 28, 3, (p, f) => {
    const st = f === 1 ? 1 : 0, gr = f === 2, B = ['#3a2a2a', '#7a5a4a', '#b08a6a', '#e8d0b0'];
    for (const [x, s] of [[10, 1], [14, -1], [25, 1], [29, -1]]) { p.thick(x, 17, x + st * s, 26, 2.2, '#4a3a3a'); p.rect(x + st * s - 1, 26, 3, 2, '#1a1414'); }
    p.sell(19, 14, 12, 6, B); p.ell(19, 10, 9, 2, '#eef6ff');
    const hx = gr ? 33 : 32, hy = gr ? 20 : 8; p.thick(28, 12, hx - 2, hy + 2, 3, B[1]); p.sell(hx, hy, 4, 3.2, B); p.px(hx + 2, hy - 1, '#0a0a14');
    if (!gr) for (const sd of [-1, 1]) { p.line(hx - 1, hy - 3, hx - 1 + sd * 4, hy - 9, '#bfefff'); p.line(hx - 1 + sd * 2, hy - 6, hx - 1 + sd * 5, hy - 6, '#bfefff'); p.px(hx - 1 + sd * 4, hy - 10, '#ffffff'); }
  });
  // Fénix Boreal (legendario): ave de hielo con cola de aurora
  P.mk('nv_vellorn', 40, 38, 2, (p, f) => {
    for (let k = 0; k < 5; k++) { const c2 = ['#5ef0c0', '#b48cff', '#5ef0ff', '#ff8ad8', '#5ef0c0'][k]; p.thick(14, 22, 2 - f + k * 0.5, 26 + k * 2.5, 2, c2); }
    p.thick(16, 32, 15, 37, 1.5, '#8a98bc'); p.thick(22, 32, 23, 37, 1.5, '#8a98bc');
    p.sell(19, 24, 9, 8, ['#4a7ab0', '#8ac4ec', '#d8f4ff', '#ffffff']);
    p.tri(12, 20, 26, 20, 8 - f * 3, 6 + f * 4, '#a8e0ff'); p.tri(14, 20, 24, 20, 12 - f * 2, 10 + f * 3, '#e8faff');
    p.sell(29, 14, 5, 4.5, ['#4a7ab0', '#8ac4ec', '#d8f4ff']); p.tri(33, 14, 38, 15, 33, 16, '#ffd166'); p.px(30, 13, '#0a0a14');
    for (let i = 0; i < 3; i++) p.line(27 + i * 2, 10, 26 + i * 3, 4 - (i % 2) * 2, i % 2 ? '#5ef0c0' : '#b48cff');
  }, { up: 0.1 });
  P.mk('nv_b_glob', 7, 7, 2, (p, f) => { p.ell(3.5, 3.5, 3, 3 - f * 0.4, '#ffffff'); p.px(2, 2, '#d8ecff'); p.px(4, 5, '#a8c8e8'); }, { vol: false });
  P.mk('nv_b_orb', 8, 8, 2, (p, f) => { p.ell(4, 4, 3.5, 3.5, f ? '#7ad8ff' : '#4aa8e0'); p.ell(3, 3, 1.5, 1.5, '#ffffff'); }, { outline: false });
  P.mk('nv_b_kspine', 12, 5, 1, p => { p.tri(0, 0, 0, 4, 11, 2, '#a8e0ff'); p.line(0, 2, 10, 2, '#ffffff'); }, { vol: false });
  P.mk('nv_b_crio', 12, 8, 2, (p, f) => { p.ell(7, 4, 4.5, 3, f ? '#bff6ff' : '#7ad8ff'); p.ell(7, 4, 2, 1.5, '#ffffff'); for (let i = 0; i < 3; i++) p.px(2 - i + f, 2 + i * 2, '#d8f8ff'); }, { vol: false });
  P.mk('nv_icicle', 10, 18, 2, (p, f) => { p.rect(1, 0, 8, 2, '#8ab4dc'); p.tri(1, 1, 9, 1, 5 + (f ? 1 : 0), 17, '#bfefff'); p.tri(1, 1, 5, 1, 5 + (f ? 1 : 0), 17, '#ffffff'); if (f) { p.line(3, 4, 6, 8, '#5a8ab0'); } });
  // portal arturiano
  P.mk('nv_gate', 34, 46, 1, p => {
    p.rect(0, 40, 34, 6, ART[1]); p.rect(0, 40, 34, 1, ART[3]);
    for (const x of [1, 27]) { p.grad(x, 8, 6, 32, [ART[2], ART[1], ART[0]]); p.rect(x + 2, 14, 2, 20, '#2a3a5a'); p.rect(x + 2, 16, 2, 2, CY); p.rect(x + 2, 26, 2, 2, CY); }
    p.ell(17, 9, 17, 7, ART[1]); p.ell(17, 8, 15, 5, ART[2]); p.ell(17, 9, 9, 4, '#2a3a5a'); p.ell(17, 9, 5, 2, CY); p.px(16, 8, '#ffffff');
  });
  const ic = (n, fn) => P.mk('i_' + n, 10, 10, 1, fn, { outline: '#05050a', vol: false });
  ic('glide', p => { p.tri(0, 5, 9, 5, 4.5, 1, '#bfefff'); p.line(4, 5, 4, 9, '#8ab4dc'); p.px(4, 9, '#ffffff'); });
  ic('crio', p => { for (let k = 0; k < 3; k++) { const a = k * 1.047; p.line(5 - Math.cos(a) * 4, 5 - Math.sin(a) * 4, 5 + Math.cos(a) * 4, 5 + Math.sin(a) * 4, '#7ad8ff'); } p.px(5, 5, '#ffffff'); });
  ic('thermo', p => { p.rect(4, 1, 3, 6, '#e8f4ff'); p.ell(5.5, 7.5, 2.5, 2.2, '#ff5a3a'); p.rect(5, 3, 1, 4, '#ff5a3a'); });
  ic('aurora', p => { for (let x = 0; x < 10; x++) { p.px(x, 3 + Math.round(Math.sin(x * 0.8) * 1.5), '#5ef0c0'); p.px(x, 6 + Math.round(Math.sin(x * 0.8 + 1) * 1.5), '#b48cff'); } });

  // ================= PERSONAJES =================
  P.Sprites.registerLook('yrsa', Object.assign({}, P.CIV.arturiano, { cloth: '#e8f4ff', clothD: '#a8c0dc', acc: '#5ef0ff', hair: '#ffffff', hairD: '#c8d8f0', h: 22 }));

  // ================= MAPA EXTERIOR =================
  for (const st of ['c', 'r']) {
    const pal = K[st], T = pal.top;
    P.mk('nv_o_grass_' + st, 16, 16, 3, (p, v) => {
      const r = P.RNG(1300 + v + (st === 'c' ? 9 : 0)); p.rect(0, 0, 16, 16, T[2]);
      for (let i = 0; i < 5; i++) { const x = r.int(0, 13), y = r.int(0, 15); p.rect(x, y, 3, 1, T[1]); }
      for (let i = 0; i < 4; i++) p.px(r.int(0, 15), r.int(0, 15), T[3]);
      if (v === 2) { if (st === 'r') { p.px(5, 6, '#26987a'); p.px(6, 5, '#56d0a8'); p.px(11, 11, '#ff8ad8'); } else { p.tri(5, 9, 8, 9, 6, 4, pal.vein); } }
    }, { outline: false });
    P.mk('nv_o_water_' + st, 16, 16, 2, (p, f) => { p.grad(0, 0, 16, 16, st === 'c' ? [pal.liq[1], pal.liq[0]] : [pal.liq[1], pal.liq[0]]); for (let i = 0; i < 3; i++) p.rect((i * 5 + f * 3) % 13, (i * 5 + 3) % 16, 3, 2, st === 'c' ? '#3a3a6a' : '#d8ecff'); }, { outline: false });
    P.mk('nv_o_tree_' + st, 34, 42, 2, (p, f) => P.Sprites.nvCandela(p, 17, 41, 0.23, st, f));
    P.mk('nv_o_cliff_' + st, 16, 16, 3, (p, v) => { const I = st === 'c' ? ['#2a2a44', '#3e3e5e', '#5a5a80', '#8a8ab0'] : ['#3a6a9a', '#5a8ab8', '#a8d0f0', '#ffffff']; if (v === 1) { p.grad(0, 0, 16, 16, [I[2], I[1], I[0]]); p.rect(0, 0, 16, 2, I[3]); for (let x = 1; x < 16; x += 4) p.tri(x, 2, x + 2, 2, x + 1, 7, I[3]); return; } p.rect(0, 0, 16, 16, I[3]); p.rect(0, 10, 16, 1, I[2]); if (v === 2) p.rect(0, 0, 16, 2, '#ffffff'); }, { outline: false });
    P.mk('nv_o_crack_' + st, 16, 16, 2, (p, f) => { p.rect(0, 0, 16, 16, st === 'c' ? '#100c20' : '#0a1a34'); p.grad(0, 0, 16, 4, [st === 'c' ? '#5a5a80' : '#a8d8f4', st === 'c' ? '#1a1430' : '#14305a']); p.px(4 + f * 5, 9, st === 'c' ? '#5a4a9a' : '#5ef0ff'); p.px(11 - f * 3, 12, st === 'c' ? '#3a2a6a' : '#3a8ab8'); }, { outline: false });
    P.mk('nv_o_ice_' + st, 16, 16, 2, (p, v) => { const I = st === 'c' ? ['#3a3a6a', '#5a5a90', '#8a8ac0'] : ['#7ab8e0', '#a8dcf8', '#e4f6ff']; p.rect(0, 0, 16, 16, I[1]); p.line(1 + v * 4, 2, 6 + v * 4, 7, I[2]); p.line(2 + v * 4, 2, 7 + v * 4, 7, I[2]); p.px(12 - v * 6, 12, I[0]); p.px(13 - v * 6, 12, I[0]); }, { outline: false });
  }
  P.mk('nv_o_path', 16, 16, 2, (p, v) => { const r = P.RNG(1320 + v); p.rect(0, 0, 16, 16, '#b8cce4'); for (let i = 0; i < 10; i++) p.px(r.int(0, 15), r.int(0, 15), r() < 0.5 ? '#d8e6f6' : '#98b0cc'); for (let y = 3; y < 16; y += 6) { p.px(4 + v * 6, y, '#8aa0bc'); p.px(5 + v * 6, y + 1, '#8aa0bc'); } }, { outline: false });
  P.mk('nv_o_stone', 16, 16, 1, p => { p.rect(0, 0, 16, 16, '#c4dcf0'); p.rect(0, 0, 16, 1, '#ffffff'); p.rect(0, 8, 16, 1, '#8aa8c8'); p.rect(8, 0, 1, 8, '#8aa8c8'); p.rect(4, 8, 1, 8, '#8aa8c8'); p.px(12, 3, CY); }, { outline: false });
  P.mk('nv_o_goo', 16, 16, 2, (p, f) => { p.ell(8, 11, 6, 3, '#2a2244'); p.tri(4, 12, 8, 12, 6, 2 + f, '#8a6aff'); p.tri(8, 12, 12, 12, 10, 5, '#5a4a9a'); p.px(6, 5 + f, '#ffffff'); }, { outline: false });
  P.mk('nv_o_lamp', 10, 16, 2, (p, f) => { p.rect(4, 6, 2, 10, '#3a8a7a'); p.sell(5, 4, 3.4, 3.5 + f * 0.3, ['#2a8ac8', '#7ad8ff', '#d8f8ff', '#ffffff']); });
  P.mk('nv_o_rock', 16, 16, 1, p => { p.sell(8, 10, 7, 5.5, ['#3a5a7a', '#5a7a9a', '#8aa8c8', '#c4dcf0']); p.ell(8, 6, 6, 2.5, '#ffffff'); p.ell(7, 5.5, 4, 1.4, '#eef6ff'); });
  P.mk('nv_o_pillar', 14, 30, 2, (p, f) => { if (f) { p.rect(5, 18, 4, 12, '#8a98bc'); p.line(5, 18, 9, 13, '#5a6a8a'); return; } p.rect(6, 6, 2, 24, '#c8d4e8'); p.rect(5, 6, 1, 24, '#ffffff'); p.ell(7, 6, 6, 2, '#eef4ff'); p.px(7, 3, CY); p.rect(2, 28, 10, 2, '#8a98bc'); });
  // iglú-observatorio (0 dañado · 1 restaurado)
  P.mk('nv_o_house', 44, 38, 2, (p, f) => {
    if (!f) { p.sell(22, 30, 16, 9, ['#3a3a52', '#5a5a74', '#7a7a98', '#9a9ab8']); p.rect(6, 30, 32, 6, '#3a3a52'); p.tri(14, 22, 22, 18, 20, 28, '#2a2a3a'); p.rect(18, 30, 7, 6, '#0a0a14'); p.tri(28, 36, 34, 36, 31, 26, '#8a6aff'); return; }
    p.sell(22, 28, 17, 11, ['#8aa8c8', '#c4dcf0', '#eef6ff', '#ffffff']); p.rect(5, 28, 34, 8, '#c4dcf0'); for (let k = 0; k < 3; k++) p.line(8 + k * 4, 22 + k * 3, 36 - k * 4, 22 + k * 3, '#a8c4e0');
    p.sell(22, 30, 6, 5, ['#8aa8c8', '#c4dcf0', '#eef6ff']); p.rect(19, 30, 6, 6, '#2a3a5a'); p.rect(20, 31, 4, 5, '#ffd166'); p.rect(30, 14, 2, 8, '#8a98bc'); p.ell(31, 13, 3, 1.5, '#eef4ff'); p.px(31, 11, CY);
    p.px(9, 33, '#ff8ad8'); p.px(36, 33, '#ff8ad8');
  });
  P.mk('nv_o_flower', 8, 8, 3, (p, v) => { const c2 = ['#ff8ad8', '#b48cff', '#5ef0ff'][v]; p.line(4, 7, 4, 4, '#26987a'); for (let k = 0; k < 4; k++) p.px(4 + [1, -1, 0, 0][k], 3 + [0, 0, 1, -1][k], c2); p.px(4, 3, '#ffffff'); });

  P.Sprites.buildGlorvax();
};

(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildNivorah(); }; })();
