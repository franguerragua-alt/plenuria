'use strict';
// THALASSYR — El Abismo de Coral Eléctrico: arte del planeta (prefijo «th_»)
P.PAL.thalassyr = {
  // contaminado: roca negra aceitosa, coral blanqueado, agua de petróleo eléctrico
  c: { soil: ['#1a1a2a', '#2a2a40', '#3e3a58', '#58507a'], vein: '#ff3aa0', top: ['#3a3a4a', '#5a5868', '#807a90', '#a8a0b8'],
    liq: ['#0a0818', '#1e1438', '#3a2a6a', '#9a7ad8'], thorn: ['#3a2a4a', '#7a5a8a', '#c0a0d0', '#ffffff'],
    leaf: ['#2a2a3e', '#46405a', '#6a6280', '#9a90b0'], trunk: ['#22222e', '#383848', '#545466'], glow: '#ff3aa0', flower: ['#ff3aa0', '#c06aff', '#6a5aff'] },
  // restaurado: arena de nácar, roca turquesa, coral rosado, agua cristalina
  r: { soil: ['#1a4a6a', '#2a6a8a', '#3e8aa8', '#7ac0d0'], vein: '#ff8a7a', top: ['#d8b890', '#f0d8b0', '#fff0d0', '#ffffff'],
    liq: ['#063a7a', '#0a7ab0', '#2ad0e0', '#d8fffa'], thorn: ['#c0405a', '#ff7a8a', '#ffc0c8', '#ffffff'],
    leaf: ['#0a6a6a', '#16a08a', '#4ae0b0', '#b8fff0'], trunk: ['#2a5a5a', '#3a8a7a', '#6ac0a0'], glow: '#5af0ff', flower: ['#ff7a9a', '#ffd166', '#5af0ff', '#ffffff'] }
};
P.SKIES_T = {
  day: { r: ['#0a4a9a', '#1a8ad8', '#5ad0f0', '#c8f8ff', '#fff4e0'], c: ['#141428', '#24243e', '#3a3656', '#5a5272', '#7a7090'], cloud: ['#ffffff', '#e0f8ff', '#a0d8f0'], cloudC: ['#8a80a0', '#5a5478', '#3a3458'] },
  golden: { r: ['#1a2a7a', '#5a4aa8', '#e07a9a', '#ffb07a', '#ffe0a0'], c: ['#160e26', '#2e1e42', '#523058', '#7a4a6a', '#9a6a7a'], cloud: ['#fff0e0', '#ffc0b0', '#c07aa0'], cloudC: ['#8a6a8a', '#5a3a6a', '#3a2450'] },
  dusk: { r: ['#020818', '#061638', '#0a2a5a', '#0e4a7a', '#1a6a9a'], c: ['#040410', '#0a0a1e', '#14122e', '#1e1a3e', '#2a244e'], cloud: ['#5ad0f0', '#2a7ab0', '#14305a'], cloudC: ['#4a3a6a', '#2a2048', '#18122e'] }
};
P.HERO_SKINS.abisal = { name: 'Armadura Abisal', d: '#0a3a5a', m: '#1a9ab0', l: '#5af0e0', h: '#d8fffa', j: '#06202e', e: '#ffffff', eg: '#ff7a9a', acc: '#ffd166', w: '#e8fffc' };
P.ART = P.ART || {};
P.ART.thalassyr = {
  p: 'th_', skies: P.SKIES_T, owMusic: 'thalassyr_ow',
  owAmb: lf => 'rgba(4,12,34,' + (0.28 - lf * 0.2) + ')',
  flora: { L: 'farolalga', F: 'plumaria', m: 'burbujoma', U: 'arborquelpo', h: 'perlimo', y: 'estrella_marea', lily: 'flotalia', g: 'lumareo', legend: 'ondarith' },
  tileFlora: { b: 'geiser_burbujas', '|': 'cordalga', '^': 'erizal' }
};

// KELPATORRE: árbol alienígena de THALASSYR. Tallo ondulante con vejigas de gas brillantes y frondas colgantes como cintas.
P.Sprites.thKelp = function (p, bx, by, s, st, v, mix) {
  const C0 = st === 'c' ? { st: ['#22222e', '#3a3848', '#58546a', '#7a7690'], bl: ['#2a1a3a', '#5a3a6a', '#8a6aa0', '#c0a0d8'], fr: ['#2a2a3e', '#46405a', '#6a6280'] }
    : { st: ['#0a4a4a', '#16807a', '#3ab8a0', '#8af0d0'], bl: ['#a0402a', '#ff8a5a', '#ffd0a0', '#ffffff'], fr: ['#0a6a6a', '#16a08a', '#4ae0b0'] };
  const M = c => mix ? P.Col.mix(c, mix[0], mix[1]) : c, C = {}; for (const k in C0) C[k] = C0[k].map(M);
  const Q = (dx, dy) => [bx + dx * s, by + dy * s], W = w => Math.max(1, w * s), H = v ? 150 : 172, n = Math.max(6, Math.ceil(H * s));
  const sx = t => Math.sin(t * 6 + v) * 9 * (0.3 + t);
  for (let i = 0; i <= n; i++) { const t = i / n, [x, y] = Q(sx(t), -H * t), w = W(7 - 3 * t), xl = Math.round(x - w / 2); p.rect(xl, Math.round(y), Math.ceil(w), 1, C.st[1]); p.px(xl, y, C.st[2]); p.px(xl + Math.ceil(w) - 1, y, C.st[0]); if (i % 7 === 0) p.px(Math.round(x), y, C.st[3]); }
  // frondas en cinta que cuelgan del tallo
  for (let k = 0; k < 7; k++) { const t = 0.35 + k * 0.09, [x, y] = Q(sx(t), -H * t), sd = k % 2 ? 1 : -1, L = (18 + (k % 3) * 8) * s; for (let j = 0; j < L; j++) { const fx = x + sd * (j * 0.7) + Math.sin(j * 0.4 + k) * 1.5 * s, fy = y + j * 0.6; p.px(fx, fy, C.fr[(j >> 2) % 2 ? 1 : 2]); p.px(fx, fy + 1, C.fr[0]); } }
  // vejigas de gas luminosas a lo largo del tallo y en la copa
  const bl = v ? [0.55, 0.78, 1] : [0.45, 0.62, 0.8, 1];
  bl.forEach((t, k) => { const [x, y] = Q(sx(t) + (k % 2 ? 6 : -6), -H * t), r = (k === bl.length - 1 ? 9 : 5) * s; p.sell(x, y, Math.max(1.5, r), Math.max(1.5, r * 1.15), C.bl); if (r > 2) p.px(x - r * 0.4, y - r * 0.4, '#ffffff'); });
};

P.Sprites.buildThalassyr = function () {
  const K = P.PAL.thalassyr, MT = ['#1a1c2a', '#2e3346', '#4e5872', '#8a98bc'], NAC = ['#c8b8a8', '#ece0d0', '#fff8f0', '#ffffff'], TQ = '#2ae0d0', CO = '#ff7a8a';
  // ================= TESELAS =================
  for (const st of ['c', 'r']) {
    const pal = K[st], s = pal.soil, t = pal.top;
    // roca marina con estratos y conchas incrustadas
    P.mk('th_t_soil_' + st, 16, 16, 3, (p, v) => {
      const r = P.RNG(510 + v * 7 + (st === 'c' ? 3 : 0)); p.rect(0, 0, 16, 16, s[1]);
      for (let y = 0; y < 16; y++) if ((y + v * 2) % 6 === 0) for (let x = 0; x < 16; x++) p.px(x, y, (x + y) % 5 ? s[2] : s[0]);
      for (let i = 0; i < 3; i++) { const x = r.int(1, 13), y = r.int(1, 13); p.ell(x, y, 1.4, 1, s[0]); }
      if (v === 1) { const x = r.int(3, 11), y = r.int(4, 11); p.ell(x, y, 2.2, 1.6, st === 'c' ? '#4a3a5a' : NAC[1]); p.line(x - 1, y, x + 1, y - 1, st === 'c' ? '#2a1a3a' : NAC[0]); }
      if (v === 2 && st === 'r') p.px(r.int(2, 13), r.int(2, 13), TQ);
    }, { outline: false });
    // capa superior: arena de nácar con espuma seca y conchitas
    P.mk('th_t_top_' + st, 16, 9, 3, (p, v) => {
      const r = P.RNG(530 + v * 5 + (st === 'c' ? 9 : 0)); p.rect(0, 3, 16, 4, t[1]); p.rect(0, 3, 16, 1, t[2]); p.rect(0, 6, 16, 1, t[0]);
      for (let x = 0; x < 16; x++) { const h = Math.round(1 + Math.sin(x * 0.5 + v) * 0.8); for (let y = 3 - h; y < 3; y++) p.px(x, y, t[2]); if (r() < 0.3) p.px(x, 7, t[0]); }
      if (st === 'r') { p.px(r.int(1, 14), 2, '#ffffff'); if (v === 2) { p.px(5, 1, CO); p.px(6, 1, '#ffd0c8'); } }
      else { p.px(r.int(1, 14), 4, '#1a1a2a'); p.px(r.int(1, 14), 5, '#2a1a3a'); }
    }, { outline: false });
    P.mk('th_t_bot_' + st, 16, 7, 2, (p, v) => { const r = P.RNG(550 + v); for (let i = 0; i < 3; i++) { const x = r.int(1, 14), l = r.int(2, 6); for (let y = 0; y < l; y++) p.px(x + Math.round(Math.sin(y)), y, st === 'c' ? '#3a3a50' : pal.leaf[1 + (y % 2)]); } }, { outline: false });
    P.mk('th_tdeco_' + st, 16, 14, 6, (p, v) => {
      const L = pal.leaf;
      if (v === 0) { for (let i = 0; i < 4; i++) for (let y = 0; y < 8 + i * 2; y++) p.px(4 + i * 3 + Math.round(Math.sin(y * 0.6 + i) * 1), 13 - y, L[1 + (y % 2)]); }
      if (v === 1) { p.ell(8, 12, 5, 2.5, st === 'c' ? '#4a3a5a' : NAC[1]); for (let k = 0; k < 4; k++) p.line(8, 13, 4 + k * 3, 10, st === 'c' ? '#2a1a3a' : NAC[0]); }
      if (v === 2) { for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.45; p.thick(8, 13, 8 + Math.cos(a) * 6, 13 + Math.sin(a) * 7, 1.6, st === 'c' ? '#5a4a6a' : CO); } }
      if (v === 3) { p.sell(9, 11, 4.5, 3, [s[0], s[1], s[2], s[3]]); p.px(8, 9, st === 'c' ? '#ff3aa0' : '#ffffff'); }
      if (v === 4) { if (st === 'r') for (let i = 0; i < 3; i++) { const x = 4 + i * 4; p.line(x, 13, x, 9 - i, L[1]); p.ell(x, 8 - i, 1.6, 1.6, pal.flower[i]); p.px(x, 8 - i, '#ffffff'); } else { p.tri(5, 13, 9, 13, 7, 7, '#3a2a4a'); } }
      if (v === 5) { p.ell(6, 12, 3, 2, st === 'c' ? '#2a2a3a' : '#ff9a6a'); p.ell(11, 12, 2.5, 1.6, st === 'c' ? '#3a2a4a' : '#ffd166'); for (let k = 0; k < 5; k++) p.px(4 + k * 2, 11, st === 'c' ? '#1a1a2a' : '#fff0d0'); }
    });
    // agua: superficie con cresta de espuma, reflejos y transparencia por profundidad
    const lq = pal.liq;
    P.mk('th_t_liq_' + st, 16, 16, 4, (p, f) => {
      for (let x = 0; x < 16; x++) { const h = Math.round(2 + Math.sin((x + f * 4) * 0.39) * 1.3 + Math.sin((x * 2 - f * 3) * 0.3) * 0.5); for (let y = h; y < 16; y++) p.dith(x, y, y < h + 4 ? lq[2] : lq[1], lq[1], y < h + 4 ? (y - h) / 4 : 0); p.px(x, h, lq[3]); if ((x + f * 3) % 7 < 2) p.px(x, h - 1, '#ffffff'); }
      for (let i = 0; i < 3; i++) { const x = (i * 6 + f * 2) % 15, y = 6 + i * 3; p.rect(x, y, 3, 1, lq[3]); }
      if (st === 'c') { p.px((f * 5) % 16, 4, '#ff3aa0'); p.px((f * 5 + 8) % 16, 9, '#c06aff'); }
    }, { outline: false });
    P.mk('th_t_liqb_' + st, 16, 16, 4, (p, f) => { p.grad(0, 0, 16, 16, [lq[1], P.Col.mix(lq[1], lq[0], 0.5)]); for (let i = 0; i < 5; i++) p.px((i * 5 + f * 2) % 16, (i * 7 + f * 3) % 16, lq[2]); if (f % 2) p.px((f * 4 + 3) % 16, (f * 5) % 16, '#ffffff'); }, { outline: false });
    // erizal coralino (púas)
    const th = pal.thorn;
    P.mk('th_t_thorn_' + st, 16, 16, 2, (p, f) => { p.ell(8, 14, 8, 2.5, s[1]); for (let i = 0; i < 5; i++) { const x = 2 + i * 3 + (f ? 1 : 0), h = 6 + (i % 2) * 5; p.thick(x, 14, x + (i % 2 ? 1 : -1), 14 - h, 2, th[1]); p.px(x + (i % 2 ? 1 : -1), 14 - h, th[3]); p.px(x, 12 - h / 2, th[2]); } });
    // cordalga (cuerda de alga que se puede trepar)
    P.mk('th_t_vine_' + st, 16, 16, 2, (p, v) => {
      for (let y = 0; y < 16; y++) { const x = 8 + Math.round(Math.sin((y + v * 8) * 0.5) * 1.5); p.px(x, y, pal.leaf[1]); p.px(x + 1, y, pal.leaf[0]); if (y % 4 === 0) p.px(x - 1, y, pal.leaf[2]); }
      for (let y = 3; y < 16; y += 6) { p.sell(5, y, 1.8, 1.8, st === 'c' ? ['#3a2a4a', '#5a4a6a', '#7a6a8a'] : ['#a0402a', '#ff8a5a', '#ffd0a0']); }
    }, { outline: false });
    // pasarela de tablas sobre pilotes (un sentido)
    P.mk('th_t_branch_' + st, 16, 8, 2, (p, v) => { for (let x = 0; x < 16; x += 4) { p.rect(x, 2, 3, 3, st === 'c' ? '#4a3a3a' : '#a07a50'); p.rect(x, 2, 3, 1, st === 'c' ? '#6a5a5a' : '#e0c090'); } p.line(0, 5, 15, 5, st === 'c' ? '#2a2020' : '#5a3a20'); p.px(3 + v * 7, 1, st === 'c' ? '#3a3a4a' : '#5af0ff'); });
    // géiser de burbujas (rebote)
    P.mk('th_t_bulb_' + st, 16, 16, 3, (p, f) => {
      p.ell(8, 15, 7, 1.5, s[0]); p.sell(8, 12, 6, 3.5, st === 'c' ? ['#2a1a3a', '#4a2a5a', '#7a4a8a'] : ['#a0402a', '#ff7a6a', '#ffc0a0', '#ffffff']); p.ell(8, 10, 2.5, 1, '#0a1a2a');
      const h = [3, 9, 6][f]; for (let i = 0; i < h; i++) p.ell(8 + Math.round(Math.sin(i + f) * 1.5), 9 - i * 1.2, 1 + (i % 3 === 0 ? 0.6 : 0), 1, i % 2 ? '#ffffff' : '#bff6ff');
    });
  }
  // ruinas lemurianas: piedra de nácar con incrustaciones turquesa
  P.mk('th_t_ruin', 16, 16, 3, (p, v) => { p.grad(0, 0, 16, 16, [NAC[2], NAC[1], NAC[1], NAC[0]]); p.rect(0, 15, 16, 1, '#8a7a6a'); for (let x = 0; x < 16; x += 4) p.line(x, 0, x + 2, 15, NAC[0]); p.ell(8, 8, 3, 3, v === 2 ? TQ : NAC[0]); p.px(7, 7, '#ffffff'); if (v === 1) { p.line(2, 12, 6, 14, '#1a6a6a'); p.px(3, 13, '#3ae0b0'); } }, { outline: false });
  P.mk('th_t_ruintop', 16, 6, 1, p => { p.rect(0, 2, 16, 2, '#fff8f0'); p.rect(0, 2, 16, 1, '#ffffff'); for (let x = 1; x < 16; x += 4) p.px(x, 3, TQ); }, { outline: false });
  P.mk('th_t_crack', 16, 16, 1, p => { p.grad(0, 0, 16, 16, ['#7ac0d0', '#3e8aa8', '#2a6a8a']); p.line(3, 0, 7, 6, '#0a2a3a'); p.line(7, 6, 5, 11, '#0a2a3a'); p.line(7, 6, 13, 9, '#0a2a3a'); p.line(5, 11, 2, 16, '#0a2a3a'); p.px(8, 6, '#ffffff'); }, { outline: false });

  // ================= FONDOS =================
  const bgSky = (st, sky) => {
    const SK = P.SKIES_T[sky], p = new P.Painter(P.W, P.H), r = P.RNG(st === 'c' ? 241 : 242); p.grad(0, 0, P.W, P.H, SK[st]);
    if (sky === 'dusk') for (let i = 0; i < 100; i++) p.px(r.int(0, P.W), r.int(0, 140), r() < 0.2 ? '#ffffff' : '#a8e8ff');
    const c = p.canvas(), x = c.getContext('2d'), sx = 300, sy = sky === 'dusk' ? 40 : sky === 'golden' ? 128 : 50;
    // dos lunas (una grande y anillada) o el sol tras la Esfera
    x.globalCompositeOperation = 'lighter'; const gl = x.createRadialGradient(sx, sy, 2, sx, sy, 110); gl.addColorStop(0, sky === 'dusk' ? 'rgba(160,240,255,0.5)' : 'rgba(255,250,230,0.8)'); gl.addColorStop(1, 'rgba(120,220,255,0)'); x.fillStyle = gl; x.fillRect(sx - 110, sy - 110, 220, 220); x.globalCompositeOperation = 'source-over';
    x.fillStyle = sky === 'dusk' ? '#d8fbff' : '#fffbe8'; x.beginPath(); x.arc(sx, sy, sky === 'dusk' ? 14 : 16, 0, 7); x.fill();
    if (sky === 'dusk') { x.fillStyle = '#9ad8f0'; x.beginPath(); x.arc(sx - 4, sy - 3, 4, 0, 7); x.fill(); x.strokeStyle = 'rgba(160,240,255,0.6)'; x.beginPath(); x.ellipse(sx, sy, 26, 5, -0.3, 0, 7); x.stroke(); x.fillStyle = 'rgba(220,250,255,0.6)'; x.beginPath(); x.arc(120, 70, 6, 0, 7); x.fill(); }
    else { x.strokeStyle = st === 'c' ? 'rgba(40,20,60,0.5)' : 'rgba(80,120,160,0.3)'; for (let i = -2; i <= 2; i++) { x.beginPath(); x.ellipse(sx, sy, 21, 21 * Math.abs(Math.cos(i * 0.55)) + 1, 0, 0, 7); x.stroke(); } }
    const CL = st === 'c' ? SK.cloudC : SK.cloud;
    x.drawImage(P.cloudLayer(cp => { for (let i = 0; i < 3; i++) { const w = r.int(60, 110); P.paintCloud(cp, r.int(0, P.W), r.int(40, 112), w, Math.round(w * 0.3), [CL[0], CL[1], CL[2]], r, { lit: 'top' }); } for (let i = 0; i < 3; i++) P.paintStratus(cp, r.int(0, P.W), r.int(24, 150), r.int(80, 170), [CL[0], CL[1], CL[2]], r, { lit: 'top' }); }), 0, 0);
    // horizonte oceánico con brillo
    const hy = 176; const og = x.createLinearGradient(0, hy, 0, P.H); og.addColorStop(0, st === 'c' ? '#2a2648' : '#1a8ac8'); og.addColorStop(1, st === 'c' ? '#100c22' : '#063a7a'); x.fillStyle = og; x.fillRect(0, hy, P.W, P.H - hy);
    for (let k = 0; k < 40; k++) { x.fillStyle = st === 'c' ? 'rgba(160,120,220,0.3)' : 'rgba(220,255,255,0.5)'; x.fillRect(r.int(0, P.W), hy + r.int(2, 60), r.int(4, 16), 1); }
    x.fillStyle = st === 'c' ? 'rgba(200,170,255,0.25)' : 'rgba(255,255,240,0.55)'; x.fillRect(sx - 20, hy + 1, 40, 1); x.fillRect(sx - 10, hy + 4, 20, 1);
    return c;
  };
  for (const sky in P.SKIES_T) for (const st of ['c', 'r']) P.mkCanvas('th_bg_sky_' + st + '_' + sky, [bgSky(st, sky)]);
  for (const st of ['c', 'r']) {
    const hz = P.SKIES_T.day[st][3], pal = K[st];
    // lejos: islas-pilar sobre el mar y arcos naturales
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(st === 'c' ? 251 : 252);
      const R0 = P.Col.mix(st === 'c' ? '#2a2840' : '#1a6a7a', hz, 0.5), R1 = P.Col.mix(st === 'c' ? '#3a3654' : '#2a8a8a', hz, 0.45), G0 = P.Col.mix(st === 'c' ? '#3a3a50' : '#2aa07a', hz, 0.45);
      for (let i = 0; i < 6; i++) { const x = i * 110 + r.int(-20, 20), w = r.int(18, 34), h = r.int(40, 80), top = 180 - h; p.rect(x, top, w, h, R1); p.rect(x + w - 4, top, 4, h, R0); p.ell(x + w / 2, top, w * 0.7, 5, G0); if (i % 2 === 0) for (let y = top + 4; y < 180; y++) p.px(x + w / 2 + Math.sin(y * 0.3) * 1, y, P.Col.mix('#ffffff', hz, 0.4)); }
      for (let k = 0; k <= 30; k++) { const a = Math.PI * k / 30; p.thick(400 - Math.cos(a) * 40, 182 - Math.sin(a) * 36, 400 - Math.cos(a) * 40, 182 - Math.sin(a) * 36, 7, R1); }
      P.mkCanvas('th_bg_far_' + st, [p.canvas()]); }
    // medio: ciudad lemuriana sobre pilotes (cúpulas de concha, torres en espiral) o ruinas negras
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(st === 'c' ? 261 : 262);
      const A = (c2, k) => P.Col.mix(c2, hz, k == null ? 0.3 : k), shell = st === 'c' ? ['#3a3448', '#504a62', '#6a6280'] : ['#d8c8b8', '#f4e8d8', '#ffffff'];
      for (let i = 0; i < 7; i++) { const x = 40 + i * 90 + r.int(-10, 10), base = 196;
        for (let k = 0; k < 4; k++) p.rect(x - 14 + k * 9, base, 2, 40, A(st === 'c' ? '#2a2020' : '#6a4a30'));
        p.rect(x - 18, base - 3, 36, 3, A(st === 'c' ? '#3a2a2a' : '#a07a50'));
        if (i % 3 === 0) { for (let y = 0; y < 50; y++) { const w = 8 - y / 8; p.rect(x - w, base - 3 - y, w * 2, 1, A(shell[(y >> 3) % 2])); } p.px(x, base - 54, A(st === 'c' ? '#ff3aa0' : TQ, 0.1)); }
        else { p.sell(x, base - 10, 14, 10, shell.map(c2 => A(c2)).concat(A('#ffffff'))); for (const dx of [-6, 0, 6]) p.px(x + dx, base - 10, st === 'c' ? A('#1a1a2a', 0.1) : A('#ffd166', 0.05)); } }
      for (let i = 0; i < 6; i++) P.Sprites.thKelp(p, r.int(10, 630), P.H - r.int(4, 18), r.range(0.22, 0.3), st, i % 2, [hz, 0.35]);
      P.mkCanvas('th_bg_mid_' + st, [p.canvas()]); }
    // cerca: olas que rompen contra las rocas
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(st === 'c' ? 271 : 272), D = st === 'c' ? ['#1a1830', '#2e2a4a', '#8a7ab0'] : ['#0a5a8a', '#1a8ab8', '#ffffff'];
      for (let x = 0; x < W; x++) { const y = Math.round(P.H - 14 + Math.sin(x * 0.04) * 3); p.rect(x, y, 1, P.H - y, D[0]); p.px(x, y, D[1]); if (Math.sin(x * 0.04) > 0.6) p.px(x, y - 1, D[2]); }
      for (let i = 0; i < 9; i++) { const x = r.int(0, W); p.sell(x, P.H - 12, r.int(6, 10), r.int(5, 8), st === 'c' ? ['#14141e', '#22222e', '#34344a'] : ['#1a3a4a', '#2a5a6a', '#4a8a8a', '#8ac0c0']); p.ell(x, P.H - 16, 6, 1.5, D[2]); }
      P.mkCanvas('th_bg_near_' + st, [p.canvas()]); }
    // árboles gigantes: Kelpatorre (v0) y faro de concha lemuriano (v1, rígido)
    P.mk('th_bigtree_' + st, 110, 190, 2, (p, v) => {
      if (v === 0) { P.Sprites.thKelp(p, 55, 188, 1, st, 0); return; }
      const S2 = st === 'c' ? ['#2a2838', '#3e3a52', '#5a5470', '#7a7490'] : NAC;
      for (let y = 40; y < 186; y++) { const w = 10 + Math.floor((y - 40) / 30) * 2; p.rect(55 - w / 2, y, w, 1, S2[(Math.floor((y - 40) / 8) % 2) ? 1 : 2]); p.px(55 - w / 2, y, S2[3]); p.px(55 + w / 2 - 1, y, S2[0]); }
      for (let y = 46; y < 180; y += 8) p.line(55 - 5, y, 55 + 5, y + 6, S2[0]);
      p.sell(55, 36, 10, 8, [S2[0], S2[1], S2[2], S2[3]]); p.rect(53, 22, 4, 10, S2[1]); p.ell(55, 22, 5, 3, st === 'c' ? '#ff3aa0' : '#5af0ff'); p.px(54, 21, '#ffffff');
      for (const y of [80, 120, 160]) { p.rect(53, y, 4, 4, '#1a2a3a'); if (st === 'r') p.rect(54, y + 1, 2, 2, '#ffd166'); }
      if (st === 'r') for (let k = 0; k < 3; k++) P.Sprites.vineHang(p, 49 + k * 6, 140 + k * 8, 26, '#16a08a', '#4ae0b0', null, P.RNG(k));
    }, { up: 0.1, down: 0.15, dark: 0.5 });
  }
  // abismo submarino: rayos desde la superficie, arrecifes en silueta y nieve marina
  { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(499); p.grad(0, 0, W, P.H, ['#0a6a9a', '#06407a', '#04204a', '#020c22']);
    for (let l = 0; l < 3; l++) { const col = ['#04304a', '#062a40', '#082236'][l]; let g = 40 + l * 16; for (let x = 0; x < W; x++) { g += r.range(-2, 2); g = P.clamp(g, 20 + l * 14, 70 + l * 14); const gb = Math.round(P.H - g + l * 14); p.rect(x, gb, 1, P.H - gb, col); } }
    for (let i = 0; i < 16; i++) { const x = r.int(0, W), h = r.int(20, 70); for (let y = 0; y < h; y++) p.px(x + Math.sin(y * 0.3) * 2, P.H - 20 - y, y % 3 ? '#0a5a5a' : '#16807a'); }
    for (let i = 0; i < 160; i++) p.px(r.int(0, W), r.int(0, P.H), r() < 0.5 ? '#5ab0d0' : '#8ad8f0');
    P.mkCanvas('th_bg_deep', [p.canvas()]); P.mkCanvas('th_bg_cave', [p.canvas()]); }

  // ================= FLORA =================
  for (const st of ['c', 'r']) { const L = K[st].leaf; P.mk('th_fern_' + st, 22, 16, 2, (p, f) => { for (let i = 0; i < 7; i++) { for (let y = 0; y < 8 + (i % 3) * 3; y++) p.px(4 + i * 2.4 + Math.round(Math.sin(y * 0.5 + i + f) * 1.2), 15 - y, L[1 + (y % 2)]); p.px(4 + i * 2.4, 15 - 8 - (i % 3) * 3, st === 'r' ? '#ff9ab0' : '#5a4a6a'); } }); }
  P.mk('th_lamp', 14, 22, 2, (p, f) => { for (let y = 8; y < 22; y++) p.px(7 + Math.round(Math.sin(y * 0.4) * 1), y, '#16a08a'); p.ell(4, 18, 3, 1.2, '#4ae0b0'); for (let k = 0; k < 3; k++) p.sell(7 + (k - 1) * 3, 6 + (k % 2) * 2 - f * 0.5, 2.2, 2.6, ['#0a6a8a', '#2ae0f0', '#c8fffc', '#ffffff']); });
  P.mk('th_mush', 18, 16, 2, (p, f) => { for (let i = 0; i < 4; i++) { const x = 4 + i * 3.4, h = 6 + (i % 2) * 4 + f; p.sell(x, 15 - h, 2.5, h / 2 + 1, ['#5a1a5a', '#a03aa0', '#e07ae0', '#ffffff']); } p.ell(9, 15, 7, 1.2, '#2a1a2a'); });
  P.mk('th_bigmush', 30, 34, 1, p => P.Sprites.thKelp(p, 15, 33, 0.18, 'r', 1));
  P.mk('th_orchid', 14, 16, 2, (p, f) => { p.line(7, 15, 7, 9, '#16a08a'); for (let k = 0; k < 5; k++) { const a = k * 1.257 + f * 0.3; p.tri(7, 6, 7 + Math.cos(a) * 5, 6 + Math.sin(a) * 5, 7 + Math.cos(a + 0.4) * 3, 6 + Math.sin(a + 0.4) * 3, k % 2 ? '#ffd166' : '#ff9a6a'); } p.ell(7, 6, 1.6, 1.6, '#ffffff'); });
  P.mk('th_lily', 18, 6, 1, p => { p.ell(9, 3, 8.5, 2.3, '#16a08a'); p.ell(8, 2.5, 6, 1.3, '#4ae0b0'); for (let i = 0; i < 3; i++) p.ell(6 + i * 3, 1.5, 1.2, 1.2, '#bff6ff'); p.px(9, 1, '#ffffff'); });
  P.mk('th_heal', 16, 18, 2, (p, f) => { for (let i = 0; i < 5; i++) p.thick(8, 17, 8 + (i - 2) * 3, 10 - Math.abs(i - 2), 1.5, f ? '#5a5a70' : '#16a08a'); if (!f) { p.sell(8, 7, 4, 4, ['#a0a0b8', '#e8e8f8', '#ffffff', '#ffffff']); p.px(7, 6, '#ffd0ff'); } });

  // ================= FAUNA (extraterrestre) =================
  // CORÁLIX: reptador de coral vivo con racimo de ojos y dos pinzas-abanico
  const coral = (p, f, o) => {
    const w = f === 4, st = w ? 0 : f, by = o.by, cx = o.cx, L = o.len;
    for (let i = 0; i < 4; i++) { const lx = cx - L * 0.4 + i * L * 0.27, ph = ((st + i) % 2) * 2; p.line(lx, by - 5, lx - 2 + ph, by, o.c[0]); }
    p.sell(cx, by - 7 + (w ? 1 : 0), L * 0.5, 5, o.c);
    for (let i = 0; i < 6; i++) { const x = cx - L * 0.4 + i * L * 0.16; p.line(x, by - 11, x + (i % 2 ? 1 : -1), by - 15 - (i % 3), o.cor); p.px(x + (i % 2 ? 1 : -1), by - 16 - (i % 3), '#ffffff'); }
    const hx = cx + L * 0.5; for (const [dx, dy] of [[0, -9], [2, -8], [1, -10]]) p.px(hx + dx, by + dy + (w ? 2 : 0), o.eye);
    for (const s of [-1, 1]) { const fx = hx + 3, fy = by - 6 + s * 2 + (w ? -3 : 0); for (let k = 0; k < 3; k++) p.line(fx, fy, fx + 4 + k, fy + s * (k - 1) * 2 - (w ? 2 : 0), o.c[2]); }
  };
  P.mk('th_krazith', 32, 22, 5, (p, f) => coral(p, f, { cx: 14, by: 21, len: 18, c: ['#6a1a3a', '#c0405a', '#ff8a8a', '#ffd8d0'], cor: '#ff9ab0', eye: '#5af0ff' }));
  P.mk('th_krazith_cy', 34, 24, 5, (p, f) => { coral(p, f, { cx: 15, by: 23, len: 19, c: MT, cor: '#8a98bc', eye: '#ff2040' }); p.rect(9, 13, 9, 2, '#3a0a14'); p.px(12, 13, '#5af0ff'); });
  // ORDANOX ABISAL: coloso de coral con caparazón en espiral y tentáculos eléctricos
  P.mk('th_krazith_alfa', 52, 36, 5, (p, f) => {
    const st = f % 4, C = ['#1a2a5a', '#2a5aa0', '#5aa0e0', '#c0e8ff'];
    for (let i = 0; i < 5; i++) { const lx = 8 + i * 8, sw = f < 4 ? Math.sin((st + i) * 1.5) * 2 : 0; p.thick(lx, 26, lx + sw, 35, 2.5, C[1]); p.px(lx + sw, 35, '#5af0ff'); }
    p.sell(24, 18, 18, 11, C); for (let k = 0; k < 18; k++) { const a = k * 0.6, r = 2 + k * 0.6; p.px(22 + Math.cos(a) * r, 15 + Math.sin(a) * r * 0.7, '#ffffff'); }
    for (let i = 0; i < 4; i++) p.tri(10 + i * 9, 10, 15 + i * 9, 10, 12 + i * 9, 2 - (i % 2) * 2, '#ff8a8a');
    const hx = f === 4 ? 40 : 43; p.sell(hx, 18, 7, 6, C); for (const [x, y] of [[-2, -2], [2, -2], [0, 1]]) p.ell(hx + x, 18 + y, 1.2, 1.2, '#ffd166');
    if (f === 4) for (let k = 0; k < 6; k++) p.px(46 + k, 12 + (k % 2) * 3, '#5af0ff');
  }, { up: 0.08 });
  // BURBUJÓN: esfera translúcida llena de agua con un ojo flotando dentro; salta y escupe burbujas
  P.mk('th_frog', 20, 17, 3, (p, f) => {
    const y = f === 1 ? 6 : 8; p.ell(10, y + 1, 7, 6.5, '#0a6a9a'); p.ell(10, y, 6.5, 6, '#4ad0f0'); p.ell(10, y + 1, 5, 4.5, '#8af0ff'); p.ell(8, y - 3, 2, 1.2, '#ffffff');
    p.ell(11, y + 1, 2, 2, '#ffffff'); p.px(12, y + 1, '#0a1a2a');
    for (const s of [-1, 1]) p.line(10 + s * 4, y + 6, 10 + s * (f === 1 ? 6 : 5), 16, '#2a8ab0');
    if (f === 2) { p.ell(17, y - 1, 2, 2, '#bff6ff'); p.px(16, y - 2, '#ffffff'); }
  });
  // PLANÉFORO: planeador plano translúcido con aletas en cinta y manchas eléctricas
  const plan = (p, f, B, sp, metal) => { const up = f ? -2 : 2; p.ell(13, 8, 9, 3, B[1]); p.ell(13, 7, 7, 1.6, B[2]); for (let k = 0; k < 3; k++) { p.line(4 - k, 8 + k, 0 - k, 8 + up + k * 2, B[2]); p.line(22 + k, 8 + k, 26 + k, 8 + up + k * 2, B[2]); } for (const x of [8, 13, 18]) p.px(x, 8, sp); p.line(13, 11, 13, 15, B[0]); if (metal) { p.rect(10, 7, 6, 1, '#ff3050'); } };
  P.mk('th_dfly', 26, 16, 2, (p, f) => plan(p, f, ['#0a4a6a', '#2a9ac0', '#a0f0ff'], '#ffd166'));
  P.mk('th_dfly_cy', 26, 16, 2, (p, f) => plan(p, f, MT, '#ff2040', true));
  // MANTORRA: alfombra viva de bordes ondulantes con dos antenas luminosas
  P.mk('th_slug', 28, 15, 2, (p, f) => { for (let x = 3; x < 25; x++) { const y = 11 + Math.round(Math.sin(x * 0.6 + f * 2) * 1.2); p.rect(x, y - 3, 1, 4, x % 2 ? '#6a2a7a' : '#9a4aa8'); p.px(x, y + 1, '#d08ae0'); } for (let k = 0; k < 4; k++) p.px(8 + k * 4, 9, '#ffd166'); for (const s of [0, 1]) { p.line(24, 9, 26 + s, 4 + s * 2, '#9a4aa8'); p.px(26 + s, 3 + s * 2, '#5af0ff'); } });
  // PENDULINIA: cebo luminoso que cuelga del techo y se descuelga con fauces de filamentos
  P.mk('th_vsnake', 12, 34, 2, (p, f) => { const L = f ? 26 : 12; for (let y = 0; y < L; y++) p.px(6 + Math.round(Math.sin(y * 0.4) * (f ? 1 : 0.5)), y, '#5ab0c0'); const hy = L + 2; p.ell(6, hy, 3.5, 3.5, f ? '#ff7a9a' : '#5af0ff'); p.ell(6, hy, 2, 2, '#ffffff'); if (f) for (let k = 0; k < 6; k++) { const a = k * 1.047; p.line(6, hy, 6 + Math.cos(a) * 6, hy + Math.sin(a) * 5 + 2, '#ff9ab0'); } });
  // ABISÓMACA (planta mutada): bulbo de coral con fauces en espiral
  P.mk('th_maw', 26, 34, 3, (p, f) => {
    for (let y = 16; y < 34; y++) p.px(13 + Math.round(Math.sin(y * 0.4) * 1.5), y, '#16807a'); p.ell(7, 28, 5, 2, '#16a08a'); p.ell(19, 25, 5, 2, '#16a08a');
    const open = f > 0 ? (f === 1 ? 6 : 9) : 1, hx = 13 + (f === 2 ? 3 : 0), hy = 11, T = ['#6a1a3a', '#c0405a', '#ff8a8a', '#ffd8d0'];
    p.sell(hx, hy - open / 2, 9, 5, T); p.sell(hx, hy + open / 2 + 2, 8.5, 4, [T[0], T[1], T[2]]);
    for (let k = 0; k < 5; k++) p.line(hx - 7 + k * 3.5, hy - open / 2 - 3, hx - 8 + k * 3.5, hy - open / 2 - 8, '#ff9ab0');
    if (open > 2) { p.rect(hx - 7, hy - open / 2 + 3, 14, open, '#1a0a2a'); for (let i = -6; i <= 6; i += 2) { p.px(hx + i, hy - open / 2 + 3, '#ffffff'); p.px(hx + i + 1, hy + open / 2 + 2, '#ffffff'); } }
  });
  // LUMÁREO: trípode costero con velas de concha luminosas
  P.mk('th_grazer', 38, 28, 3, (p, f) => {
    const st = f === 1 ? 1 : 0, gr = f === 2, B = ['#3a2a4a', '#6a5a8a', '#a090c0', '#e0d8f8'];
    for (const [x, s] of [[11, 1], [19, -1], [27, 1]]) { p.line(x, 16, x + st * s * 2, 21, B[0]); p.line(x + st * s * 2, 21, x + st * s, 27, B[0]); }
    p.sell(19, 14, 11, 4.5, B); for (let k = 0; k < 3; k++) { const x = 12 + k * 7; p.tri(x - 3, 12, x + 3, 12, x, 2 + (k % 2) * 3, k % 2 ? '#ffd8c8' : '#f4e8d8'); p.line(x, 12, x, 4 + (k % 2) * 3, '#ff9ab0'); }
    const hx = gr ? 33 : 32, hy = gr ? 20 : 10; p.line(28, 13, hx - 1, hy + 1, B[1]); p.sell(hx, hy, 3.5, 2.6, B); p.px(hx + 2, hy - 1, '#5af0ff'); p.px(hx + 2, hy + 1, '#5af0ff');
  });
  // ONDARITH (legendario): caminante de marea con una cúpula de agua llena de lucecitas
  P.mk('th_vellorn', 40, 38, 2, (p, f) => {
    for (const [x, s] of [[10, 1], [20, -1], [30, 1]]) { p.line(20, 20, x + s * f, 30, '#8ad8f0'); p.line(x + s * f, 30, x, 37, '#8ad8f0'); }
    p.ell(20, 12, 13, 11, '#1a8ac8'); p.ell(20, 11, 12, 10, '#5ad0f0'); p.ell(20, 10, 10, 8, '#a8f0ff'); p.ell(15, 6, 3, 2, '#ffffff');
    for (let k = 0; k < 7; k++) { const a = k * 0.9 + f * 0.4; p.px(20 + Math.cos(a) * (3 + k % 3 * 2), 12 + Math.sin(a) * (2 + k % 2 * 2), k % 2 ? '#ffd166' : '#ff7a9a'); }
    p.ell(20, 21, 9, 2, '#d8fffa'); for (const x of [12, 20, 28]) p.px(x, 21, '#ffd166');
  }, { up: 0.1 });
  // ELECTRODISCO: disco gelatinoso que sube y baja en el agua y da descargas
  P.mk('th_jelly', 18, 18, 3, (p, f) => { p.ell(9, 6, 8, 5, '#3a2a8a'); p.ell(9, 5, 7, 4, '#7a5ad8'); p.ell(9, 4, 5, 2.5, '#c0a8ff'); for (let k = 0; k < 4; k++) { const x = 3 + k * 4; for (let y = 9; y < 17; y++) p.px(x + Math.round(Math.sin(y * 0.6 + k + f * 2) * 1), y, (y + f) % 3 ? '#a08aff' : '#ffffff'); } if (f === 2) { p.line(1, 3, 4, 8, '#ffffff'); p.line(17, 3, 14, 8, '#ffffff'); } p.px(7, 4, '#ffffff'); p.px(11, 4, '#ffffff'); });
  P.mk('th_b_glob', 7, 7, 2, (p, f) => { p.ell(3.5, 3.5, 3, 3 - f * 0.4, '#8af0ff'); p.px(2, 2, '#ffffff'); }, { vol: false });
  P.mk('th_b_orb', 8, 8, 2, (p, f) => { p.ell(4, 4, 3.5, 3.5, f ? '#ff7a9a' : '#c0405a'); p.ell(3, 3, 1.5, 1.5, '#ffd8d0'); }, { outline: false });
  P.mk('th_b_kspine', 12, 5, 1, p => { p.tri(0, 0, 0, 4, 11, 2, '#5af0ff'); p.line(0, 2, 10, 2, '#ffffff'); }, { vol: false });
  P.mk('th_b_harpoon', 16, 5, 2, (p, f) => { p.line(0, 2, 12, 2, '#e0c090'); p.tri(11, 0, 11, 4, 15, 2, f ? '#ffffff' : '#5af0ff'); p.px(1, 1, '#ff7a9a'); p.px(1, 3, '#ff7a9a'); }, { vol: false });
  // portal lemuriano: arco de nácar con un anillo de agua
  P.mk('th_gate', 34, 46, 1, p => { p.rect(0, 40, 34, 6, NAC[1]); p.rect(0, 40, 34, 1, NAC[3]); for (let k = 0; k <= 30; k++) { const a = Math.PI * k / 30; p.thick(17 - Math.cos(a) * 14, 40 - Math.sin(a) * 34, 17 - Math.cos(a) * 14, 40 - Math.sin(a) * 34, 5, k % 5 ? NAC[1] : NAC[2]); } p.ell(17, 6, 4, 3, TQ); p.px(16, 5, '#ffffff'); for (const y of [16, 26, 36]) { p.px(4, y, TQ); p.px(29, y, TQ); } });
  P.mk('th_fall', 16, 16, 4, (p, f) => { for (let x = 0; x < 16; x++) for (let y = 0; y < 16; y++) { const k = (y + f * 4 + (x * 7) % 5) % 8; p.px(x, y, k < 2 ? '#ffffff' : k < 5 ? '#8af0ff' : '#3ab8e0'); } }, { outline: false });
  const ic = (n, fn) => P.mk('i_' + n, 10, 10, 1, fn, { outline: '#05050a', vol: false });
  ic('gills', p => { for (let k = 0; k < 3; k++) p.line(2, 2 + k * 3, 8, 3 + k * 3, '#5af0ff'); p.px(1, 1, '#ffffff'); });
  ic('harpoon', p => { p.line(0, 9, 8, 1, '#e0c090'); p.tri(6, 0, 9, 0, 9, 3, '#5af0ff'); });
  ic('nacar', p => { p.ell(5, 5, 4, 4, '#ece0d0'); p.ell(4, 4, 2, 2, '#ffffff'); p.px(6, 6, '#ff9ab0'); });
  ic('storm', p => { p.line(6, 0, 3, 5, '#ffd166'); p.line(3, 5, 7, 5, '#ffd166'); p.line(7, 5, 3, 9, '#ffd166'); });

  // ================= PERSONAJES =================
  P.Sprites.registerLook('maelis', Object.assign({}, P.CIV.lemuriano, { skin: '#5af0e0', skinD: '#1aa0a0', hair: '#ff7a9a', hairD: '#c0405a', cloth: '#f4e8d8', clothD: '#c8b8a8', acc: '#ffd166', h: 21 }));

  // ================= MAPA EXTERIOR (archipiélago) =================
  for (const st of ['c', 'r']) {
    const pal = K[st], T = pal.top;
    P.mk('th_o_grass_' + st, 16, 16, 3, (p, v) => { const r = P.RNG(1500 + v + (st === 'c' ? 9 : 0)); p.rect(0, 0, 16, 16, st === 'c' ? '#4a4658' : '#2aa07a'); for (let i = 0; i < 6; i++) p.px(r.int(0, 15), r.int(0, 15), st === 'c' ? '#3a3648' : '#4ae0b0'); if (v === 2) { p.rect(3, 9, 4, 3, T[1]); p.px(4, 9, T[2]); } if (v === 1 && st === 'r') p.px(9, 6, '#ff9ab0'); }, { outline: false });
    P.mk('th_o_water_' + st, 16, 16, 2, (p, f) => { p.grad(0, 0, 16, 16, st === 'c' ? ['#1e1438', '#0a0818'] : ['#1a9ad0', '#0a5aa0']); for (let i = 0; i < 4; i++) p.rect((i * 5 + f * 3) % 13, (i * 4 + 2) % 16, 3, 1, st === 'c' ? '#5a4a8a' : '#c8fffc'); if (f) p.px(7, 11, '#ffffff'); }, { outline: false });
    P.mk('th_o_tree_' + st, 34, 42, 2, (p, f) => P.Sprites.thKelp(p, 17, 41, 0.22, st, f));
    P.mk('th_o_ice_' + st, 16, 16, 2, (p, v) => { p.rect(0, 0, 16, 16, st === 'c' ? '#6a6070' : '#f0d8b0'); for (let i = 0; i < 6; i++) p.px((i * 5 + v * 3) % 16, (i * 7) % 16, st === 'c' ? '#4a4458' : '#fff0d0'); }, { outline: false });
  }
  P.mk('th_o_path', 16, 16, 2, (p, v) => { p.rect(0, 0, 16, 16, '#e0c8a0'); for (let i = 0; i < 10; i++) p.px((i * 7 + v * 3) % 16, (i * 5) % 16, i % 2 ? '#f4e0b8' : '#c8a878'); }, { outline: false });
  // pasarela de madera (también sirve de puente sobre el agua)
  P.mk('th_o_stone', 16, 16, 1, p => { p.rect(0, 0, 16, 16, '#0a5aa0'); for (let y = 0; y < 16; y += 4) { p.rect(0, y, 16, 3, '#a07a50'); p.rect(0, y, 16, 1, '#e0c090'); } p.rect(1, 0, 1, 16, '#5a3a20'); p.rect(14, 0, 1, 16, '#5a3a20'); }, { outline: false });
  P.mk('th_o_goo', 16, 16, 2, (p, f) => { p.ell(8, 11, 6, 3, '#1a1028'); p.ell(8, 10, 4, 2, '#3a2a6a'); p.px(6 + f, 9, '#ff3aa0'); p.px(10, 10 - f, '#c06aff'); }, { outline: false });
  P.mk('th_o_lamp', 10, 16, 2, (p, f) => { p.rect(4, 6, 2, 10, '#16807a'); p.sell(5, 4, 3, 3.4 + f * 0.3, ['#0a6a8a', '#2ae0f0', '#c8fffc', '#ffffff']); });
  P.mk('th_o_rock', 16, 16, 1, p => { p.sell(8, 10, 7, 5.5, ['#1a3a4a', '#2a5a6a', '#4a8a8a', '#8ac0c0']); p.ell(5, 7, 2, 1.4, NAC[2]); });
  P.mk('th_o_pillar', 14, 30, 2, (p, f) => { if (f) { p.rect(4, 20, 6, 10, NAC[0]); p.tri(4, 20, 10, 20, 6, 15, NAC[1]); return; } for (let y = 4; y < 30; y++) { const w = 6 - y / 10; p.rect(7 - w / 2, y, w, 1, NAC[(y >> 2) % 2 ? 1 : 2]); } p.px(7, 2, TQ); });
  P.mk('th_o_house', 44, 38, 2, (p, f) => { p.sell(22, 26, 16, 10, f ? NAC : ['#3a3448', '#504a62', '#6a6280', '#8a82a0']); for (const x of [10, 22, 34]) p.rect(x, 30, 2, 8, '#5a3a20'); });
  P.mk('th_o_flower', 8, 8, 3, (p, v) => { const c2 = ['#ff9ab0', '#ffd166', '#5af0ff'][v]; p.line(4, 7, 4, 4, '#16a08a'); p.ell(4, 3, 2, 2, c2); p.px(4, 3, '#ffffff'); });

  P.Sprites.buildThalzor();
};
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildThalassyr(); }; })();
