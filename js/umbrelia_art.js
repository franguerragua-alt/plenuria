'use strict';
// UMBRÉLIA — La Penumbra Carmesí: arte del planeta (prefijo «um_»).
// Suelo de obsidiana negra y cristales rojos que dan luz. Contaminado: los cristales se apagan a un violeta enfermo.
// Restaurado: los cristales laten en rojo, carmesí y granate con reflejos anaranjados.
P.PAL.umbrelia = {
  c: { soil: ['#060509', '#0d0b12', '#16121c', '#221c2a'], vein: '#5a2a6a', top: ['#120f17', '#1e1924', '#2c2434', '#3e3448'],
    liq: ['#040208', '#120716', '#2a0e30', '#7a3a8a'], thorn: ['#24102a', '#40183c', '#64305a', '#a07098'],
    leaf: ['#100d14', '#1a1620', '#28212e', '#3c3244'], trunk: ['#0c0a10', '#16131a', '#221d28'], glow: '#9a3a8a', flower: ['#7a2a6a', '#5a2a7a', '#8a3a5a'] },
  r: { soil: ['#050306', '#0c070b', '#160d12', '#24141a'], vein: '#ff2a3a', top: ['#100a0d', '#1c1115', '#2c181d', '#442228'],
    liq: ['#2a0008', '#5a000e', '#b0101e', '#ff7a5a'], thorn: ['#6a0010', '#c0102a', '#ff3a48', '#ffd0c8'],
    leaf: ['#120a0e', '#22121a', '#381a24', '#ff4a5a'], trunk: ['#0c080c', '#181216', '#261c22'], glow: '#ff2a3a', flower: ['#ff2a3a', '#ff7a3a', '#ffb0a0', '#ffffff'] }
};
P.UMC = {
  r: ['#6a0612', '#c8142a', '#ff4450', '#ffd8cc'], c: ['#2a0812', '#4e0e1e', '#7a1c2e', '#b0606e'],
  o: ['#7a1a06', '#d0501a', '#ff9a4a', '#ffe0b0'], g: ['#3a0410', '#7a0a20', '#b0203a', '#ff8a8a']
};
P.SKIES_U = {
  day: { r: ['#05040a', '#100814', '#2a0c1e', '#5a1424', '#8a2a2a'], c: ['#040308', '#0a0810', '#140e1c', '#22182a', '#302236'] },
  golden: { r: ['#06040c', '#1a0a1c', '#4a1222', '#9a2a22', '#e0602a'], c: ['#05040a', '#0e0a14', '#1c1424', '#2c2034', '#3c2c44'] },
  dusk: { r: ['#020206', '#05050e', '#0a0c1c', '#16203a', '#3a4a66'], c: ['#020205', '#04040a', '#0a0a14', '#14121e', '#201c2a'] }
};
P.HERO_SKINS.umbria = { name: 'Armadura Umbría', d: '#14080e', m: '#3a1220', l: '#c8142a', h: '#ff8a7a', j: '#050306', e: '#ffffff', eg: '#ff3a3a', acc: '#ff9a4a', w: '#ffd8cc' };
P.SUIT_STYLE = P.SUIT_STYLE || {}; P.SUIT_STYLE.umbria = 'umbra';
P.ART = P.ART || {};
P.ART.umbrelia = {
  p: 'um_', skies: P.SKIES_U, owMusic: 'umbrelia_ow',
  owAmb: lf => 'rgba(6,2,10,' + (0.42 - lf * 0.18) + ')',
  flora: { L: 'farolgeoda', F: 'brasaluz', m: 'ceniciela', U: 'umbracaliz', h: 'granatina', y: 'rosa_obsidiana', g: 'pacevidrio', legend: 'coronalux' },
  tileFlora: { b: 'geoda_resonante', '|': 'filamina', '^': 'espinacristal' }
};

// Prisma de cristal: base (x, y), ancho w, alto h, inclinación por fila. Caras con luz de izquierda a derecha.
P.Sprites.umCrystal = function (p, x, y, w, h, C, lean = 0) {
  const tip = Math.max(2, w * 0.9);
  for (let i = 0; i < h; i++) {
    const cx = x + lean * i, hw = i > h - tip ? (w / 2) * (h - i) / tip : w / 2, yy = Math.round(y - i), l = Math.round(cx - hw), r = Math.round(cx + hw);
    for (let xx = l; xx <= r; xx++) { const u = (xx - l) / Math.max(1, r - l); p.px(xx, yy, u < 0.2 ? C[2] : u < 0.55 ? C[1] : u < 0.88 ? C[0] : C[1]); }
    if (hw > 1.2) p.px(Math.round(cx - hw * 0.4), yy, C[3]);
  }
};
// Racimo de cristales (varios prismas en abanico)
P.Sprites.umCluster = function (p, x, y, s, C, r, n = 5) {
  for (let k = 0; k < n; k++) { const off = (k - (n - 1) / 2), h = (14 + r.int(0, 18) + (n - Math.abs(off) * 2) * 4) * s; P.Sprites.umCrystal(p, x + off * 6 * s, y, Math.max(3, (5 + r.int(0, 3)) * s), h, C, off * 0.12); }
};

P.Sprites.buildUmbrelia = function () {
  const K = P.PAL.umbrelia, U = P.UMC, BAS = ['#0a0810', '#16121e', '#241e2e', '#3a3046'];
  const CR = st => st === 'c' ? U.c : U.r;
  // ================= TESELAS =================
  for (const st of ['c', 'r']) {
    const pal = K[st], s = pal.soil, t = pal.top, C = CR(st);
    // obsidiana con caras vítreas, vetas luminosas y esquirlas incrustadas
    P.mk('um_t_soil_' + st, 16, 16, 3, (p, v) => {
      const r = P.RNG(710 + v * 7 + (st === 'c' ? 3 : 0)); p.rect(0, 0, 16, 16, s[1]);
      for (let k = 0; k < 3; k++) { const x = r.int(0, 12), y = r.int(0, 12); p.tri(x, y, x + r.int(3, 6), y + 1, x + 1, y + r.int(3, 5), s[2]); p.px(x + 1, y + 1, s[3]); }
      for (let k = 0; k < 2; k++) { const x = r.int(1, 14), y = r.int(1, 14); p.px(x, y, s[0]); p.px(x + 1, y, s[0]); }
      if (v === 1) { let x = r.int(2, 6), y = 0; while (y < 16) { p.px(x, y, pal.vein); y++; if (r() < 0.4) x += r() < 0.5 ? -1 : 1; } }
      if (v === 2) { const x = r.int(3, 11), y = r.int(5, 12); p.tri(x - 2, y + 2, x + 2, y + 2, x, y - 3, C[1]); p.px(x - 1, y, C[2]); p.px(x, y - 2, C[3]); }
    }, { outline: false });
    // costra superior negra con esquirlas que asoman
    P.mk('um_t_top_' + st, 16, 9, 3, (p, v) => {
      const r = P.RNG(730 + v * 5 + (st === 'c' ? 9 : 0)); p.rect(0, 3, 16, 4, t[1]); p.rect(0, 3, 16, 1, t[2]); p.rect(0, 6, 16, 1, t[0]);
      for (let x = 0; x < 16; x++) if ((x + v) % 5 === 0) p.px(x, 2, t[2]);
      const n = v === 2 ? 2 : 1; for (let k = 0; k < n; k++) { const x = r.int(2, 13), h = r.int(2, 5); for (let y = 0; y < h; y++) { p.px(x, 3 - y, y === h - 1 ? C[3] : C[1]); if (y < h - 2) p.px(x + 1, 3 - y, C[0]); } }
      if (st === 'r' && v === 1) p.px(r.int(1, 14), 4, '#ff6a3a');
    }, { outline: false });
    P.mk('um_t_bot_' + st, 16, 7, 2, (p, v) => { const r = P.RNG(750 + v); for (let i = 0; i < 2; i++) { const x = r.int(2, 13), l = r.int(3, 6); for (let y = 0; y < l; y++) p.px(x, y, y === l - 1 ? C[2] : s[2]); p.px(x + 1, 0, s[2]); } });
    P.mk('um_tdeco_' + st, 16, 14, 6, (p, v) => {
      const L = pal.leaf, r = P.RNG(770 + v);
      if (v === 0) { for (let k = 0; k < 3; k++) P.Sprites.umCrystal(p, 5 + k * 3, 13, 2, 4 + k * 2 + (k === 1 ? 3 : 0), C, (k - 1) * 0.15); }
      if (v === 1) { for (let i = 0; i < 4; i++) { const x = 3 + i * 3; for (let y = 0; y < 5 + i % 2 * 3; y++) p.px(x + Math.round(Math.sin(y * 0.7 + i)), 13 - y, L[1 + (y % 2)]); p.px(x + Math.round(Math.sin((5 + i % 2 * 3) * 0.7 + i)), 13 - (5 + i % 2 * 3), pal.glow); } }
      if (v === 2) { p.sell(8, 11, 5, 3, [s[0], s[1], s[2], s[3]]); p.px(6, 10, C[2]); p.px(10, 11, C[1]); }
      if (v === 3) { for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.4; p.line(8, 13, 8 + Math.cos(a) * 6, 13 + Math.sin(a) * 7, L[2]); p.px(8 + Math.cos(a) * 6, 13 + Math.sin(a) * 7, st === 'r' ? '#ff7a3a' : L[3]); } }
      if (v === 4) { P.Sprites.umCrystal(p, 8, 13, 4, 10, C, 0.1); P.Sprites.umCrystal(p, 4, 13, 2, 5, C, -0.2); }
      if (v === 5) { for (let k = 0; k < 6; k++) p.px(r.int(2, 14), r.int(9, 13), k % 2 ? C[2] : C[1]); p.rect(3, 13, 10, 1, s[2]); }
    });
    // charcas: icor oscuro (contaminado) o lago de luz carmesí (restaurado)
    const lq = pal.liq;
    P.mk('um_t_liq_' + st, 16, 16, 4, (p, f) => {
      for (let x = 0; x < 16; x++) { const h = Math.round(2 + Math.sin((x + f * 4) * 0.35) * 1.1); for (let y = h; y < 16; y++) p.dith(x, y, y < h + 4 ? lq[2] : lq[1], lq[1], y < h + 4 ? (y - h) / 4 : 0); p.px(x, h, lq[3]); }
      for (let i = 0; i < 3; i++) p.px((i * 6 + f * 3) % 16, 6 + i * 3, lq[3]);
    }, { outline: false });
    P.mk('um_t_liqb_' + st, 16, 16, 4, (p, f) => { p.grad(0, 0, 16, 16, [lq[1], P.Col.mix(lq[1], lq[0], 0.6)]); for (let i = 0; i < 4; i++) p.px((i * 5 + f * 2) % 16, (i * 7 + f * 3) % 16, lq[2]); }, { outline: false });
    // espinas de cristal (dañan)
    P.mk('um_t_thorn_' + st, 16, 16, 2, (p, f) => { p.ell(8, 14, 8, 2.5, s[2]); for (let i = 0; i < 4; i++) P.Sprites.umCrystal(p, 2 + i * 4 + f, 15, 3, 8 + (i % 2) * 5, pal.thorn, (i % 2 ? 0.12 : -0.12)); });
    // filamina: hebra mineral luminosa que se puede trepar
    P.mk('um_t_vine_' + st, 16, 16, 2, (p, v) => { for (let y = 0; y < 16; y++) { const x = 8 + Math.round(Math.sin((y + v * 8) * 0.45)); p.px(x, y, s[3]); p.px(x + 1, y, s[2]); if (y % 5 === 2) { p.px(x - 1, y, C[2]); p.px(x + 2, y, C[1]); } } });
    // pasarela de cristal (un sentido): lámina fina con nervios
    P.mk('um_t_branch_' + st, 16, 8, 2, (p, v) => { p.rect(0, 2, 16, 3, C[1]); p.rect(0, 2, 16, 1, C[2]); p.rect(0, 4, 16, 1, C[0]); for (let x = 2 + v * 3; x < 16; x += 6) p.px(x, 3, C[3]); p.line(0, 5, 15, 5, s[2]); });
    // geoda resonante (rebota)
    P.mk('um_t_bulb_' + st, 16, 16, 3, (p, f) => { p.ell(8, 15, 7, 1.5, s[0]); p.sell(8, 12, 7, 4, [s[1], s[2], s[3]]); p.ell(8, 11, 4.5, 2.4, C[0]); for (let k = 0; k < 4; k++) P.Sprites.umCrystal(p, 5 + k * 2, 12, 2, 2 + ((k + f) % 3), C, 0); });
  }
  // ruinas andromedanas de basalto con runas rojas
  P.mk('um_t_ruin', 16, 16, 3, (p, v) => { p.grad(0, 0, 16, 16, ['#1e1824', '#141018', '#0e0b12']); p.rect(0, 15, 16, 1, '#050408'); p.line(0, 7, 15, 7, '#08060c'); p.line(v * 5 + 3, 0, v * 5 + 3, 7, '#08060c'); p.line(v * 4 + 8, 8, v * 4 + 8, 15, '#08060c'); if (v === 1) { p.rect(5, 2, 1, 4, '#ff2a3a'); p.rect(5, 2, 3, 1, '#ff2a3a'); p.px(7, 4, '#ff2a3a'); } if (v === 2) { p.tri(9, 13, 12, 13, 11, 9, '#c8142a'); p.px(10, 11, '#ff8a7a'); } }, { outline: false });
  P.mk('um_t_ruintop', 16, 6, 1, p => { p.rect(0, 2, 16, 2, '#2a2232'); p.rect(0, 2, 16, 1, '#3e3448'); for (let x = 2; x < 16; x += 5) p.px(x, 3, '#ff2a3a'); }, { outline: false });
  P.mk('um_t_crack', 16, 16, 1, p => { p.rect(0, 0, 16, 16, '#141018'); p.line(3, 0, 7, 6, '#ff2a3a'); p.line(7, 6, 5, 11, '#ff2a3a'); p.line(7, 6, 13, 9, '#c8142a'); p.line(5, 11, 2, 16, '#c8142a'); p.px(7, 6, '#ffd8cc'); }, { outline: false });
  // suelo inestable: obsidiana fina con grietas que se encienden (0 intacta · 1 agrietándose · 2 a punto de romper)
  P.mk('um_t_unstable', 16, 16, 3, (p, f) => {
    p.rect(0, 0, 16, 16, '#141018'); p.rect(0, 0, 16, 2, '#2c2434'); p.rect(0, 0, 16, 1, '#3e3448');
    for (const x of [2, 7, 12]) p.px(x, 1, f ? '#ff6a3a' : '#5a2a3a');
    const V = f === 0 ? '#3a1a24' : f === 1 ? '#c8142a' : '#ff8a5a';
    p.line(4, 2, 6, 8, V); p.line(6, 8, 3, 15, V); if (f > 0) { p.line(6, 8, 11, 10, V); p.line(11, 10, 13, 15, V); } if (f > 1) { p.line(9, 2, 11, 10, V); p.line(1, 6, 6, 8, V); }
    p.rect(0, 15, 16, 1, '#050408');
  }, { outline: false });
  // barrera de cristal (se disuelve con un pulso de resonancia)
  P.mk('um_t_gate', 16, 16, 2, (p, f) => { const C = f ? U.o : U.r; p.rect(1, 0, 14, 16, C[0]); for (let y = 0; y < 16; y++) { p.px(3, y, C[2]); p.px(4, y, C[1]); p.px(12, y, C[1]); } p.tri(5, 16, 11, 16, 8, 3, C[1]); p.line(6, 13, 8, 4, C[3]); p.rect(0, 0, 1, 16, '#2a0a10'); p.rect(15, 0, 1, 16, '#2a0a10'); }, { outline: false });
  // plataforma cristalina que aparece y desaparece (f1 = contorno fantasma)
  P.mk('um_t_phase', 16, 8, 2, (p, f) => { if (f) { for (let x = 0; x < 16; x += 2) { p.px(x, 2, '#ff4450'); p.px(x + 1, 5, '#7a0a20'); } return; } p.rect(0, 2, 16, 4, U.r[1]); p.rect(0, 2, 16, 1, U.r[3]); p.rect(0, 5, 16, 1, U.r[0]); for (let x = 1; x < 16; x += 5) p.tri(x, 6, x + 3, 6, x + 1, 8, U.r[0]); p.px(5, 3, '#ffffff'); p.px(11, 4, U.r[2]); });

  // ================= FONDOS =================
  const bgSky = (st, sky) => {
    const SK = P.SKIES_U[sky], p = new P.Painter(P.W, P.H), r = P.RNG(st === 'c' ? 941 : 942); p.grad(0, 0, P.W, P.H, SK[st]);
    for (let i = 0; i < 140; i++) p.px(r.int(0, P.W), r.int(0, 150), r() < 0.14 ? '#ff4a5a' : r() < 0.4 ? '#c8c8e0' : '#5a5a7a');
    for (let i = 0; i < 6; i++) { const x = r.int(10, P.W - 10), y = r.int(10, 120); p.px(x, y, '#ffffff'); p.px(x - 1, y, '#8a8aa8'); p.px(x + 1, y, '#8a8aa8'); p.px(x, y - 1, '#8a8aa8'); p.px(x, y + 1, '#8a8aa8'); }
    const c = p.canvas(), x = c.getContext('2d');
    // luna eclipsada con corona roja
    const mx = sky === 'golden' ? 120 : 330, my = sky === 'golden' ? 70 : 46;
    x.globalCompositeOperation = 'lighter'; const g = x.createRadialGradient(mx, my, 8, mx, my, 70); g.addColorStop(0, st === 'r' ? 'rgba(255,60,60,0.55)' : 'rgba(150,60,170,0.35)'); g.addColorStop(1, 'rgba(120,0,20,0)'); x.fillStyle = g; x.fillRect(mx - 70, my - 70, 140, 140); x.globalCompositeOperation = 'source-over';
    x.fillStyle = '#050307'; x.beginPath(); x.arc(mx, my, 14, 0, 7); x.fill(); x.strokeStyle = st === 'r' ? 'rgba(255,120,100,0.9)' : 'rgba(190,120,210,0.7)'; x.beginPath(); x.arc(mx, my, 14.5, 0, 7); x.stroke();
    // bruma fría en el horizonte del valle (contraste con el rojo)
    const hz = x.createLinearGradient(0, 120, 0, 200); hz.addColorStop(0, 'rgba(60,80,120,0)'); hz.addColorStop(0.6, sky === 'golden' ? 'rgba(160,70,60,0.35)' : 'rgba(110,130,170,0.32)'); hz.addColorStop(1, 'rgba(60,70,100,0.1)'); x.fillStyle = hz; x.fillRect(0, 120, P.W, 80);
    return c;
  };
  for (const sky in P.SKIES_U) for (const st of ['c', 'r']) P.mkCanvas('um_bg_sky_' + st + '_' + sky, [bgSky(st, sky)]);
  for (const st of ['c', 'r']) {
    const C = CR(st), on = st === 'r';
    // lejos: cordilleras negras dentadas con bruma azulada y puntos de cristal en las crestas
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(st === 'c' ? 951 : 952);
      for (let l = 0; l < 2; l++) { const col = l ? '#0c0c16' : '#1a1e2c', hi = l ? '#16182a' : '#2a3044'; let g = 70 + l * 20; for (let x = 0; x < W; x++) { g += r.range(-4, 4) + (x % 37 === 0 ? r.range(-14, 14) : 0); g = P.clamp(g, 40 + l * 26, 120 + l * 20); const top = Math.round(190 - g + l * 26); p.rect(x, top, 1, P.H - top, col); p.px(x, top, hi); if (l === 0 && x % 23 === 0 && on) { p.px(x, top + 2, '#ff4450'); p.px(x, top + 3, '#8a0a20'); } } }
      P.mkCanvas('um_bg_far_' + st, [p.canvas()]); }
    // medio: peñascos con racimos de cristal gigantes y rocas suspendidas imposibles
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(st === 'c' ? 961 : 962);
      let g = 50; for (let x = 0; x < W; x++) { g += r.range(-3, 3); g = P.clamp(g, 30, 80); const top = Math.round(P.H - g); p.rect(x, top, 1, g, '#09070c'); p.px(x, top, '#1a1420'); }
      for (let i = 0; i < 7; i++) { const x = 40 + i * 90 + r.int(-20, 20); P.Sprites.umCluster(p, x, P.H - 40 - r.int(0, 20), 0.7 + r() * 0.5, on ? U.r : U.c, r, 3 + r.int(0, 3)); }
      for (let i = 0; i < 3; i++) { const x = 110 + i * 200, y = 70 + r.int(0, 30); p.tri(x - 18, y, x + 18, y, x + 2, y + 34, '#0c0a10'); p.rect(x - 18, y - 4, 36, 5, '#16121c'); P.Sprites.umCrystal(p, x, y - 4, 5, 16, on ? U.r : U.c, 0.05); }
      P.mkCanvas('um_bg_mid_' + st, [p.canvas()]); }
    // cerca: suelo rocoso negro con esquirlas
    { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(st === 'c' ? 971 : 972);
      for (let x = 0; x < W; x++) { const y = Math.round(P.H - 14 + Math.sin(x * 0.05) * 3 + Math.sin(x * 0.17) * 1.5); p.rect(x, y, 1, P.H - y, '#050407'); p.px(x, y, '#141018'); }
      for (let i = 0; i < 14; i++) P.Sprites.umCrystal(p, r.int(0, W), P.H - 12, r.int(3, 6), r.int(6, 16), C, r.range(-0.2, 0.2));
      P.mkCanvas('um_bg_near_' + st, [p.canvas()]); }
    // «árboles» gigantes: Monolito Carmesí (v0) y aguja de obsidiana con anillo de cristales suspendidos (v1). Rígidos.
    P.mk('um_bigtree_' + st, 110, 190, 2, (p, v) => {
      const r = P.RNG(980 + v + (on ? 7 : 0));
      if (v === 0) { p.sell(55, 186, 30, 6, BAS); P.Sprites.umCrystal(p, 55, 186, 16, 168, C, 0.03); P.Sprites.umCrystal(p, 38, 186, 9, 96, C, -0.1); P.Sprites.umCrystal(p, 74, 186, 10, 120, C, 0.09); P.Sprites.umCrystal(p, 28, 186, 5, 44, C, -0.25); P.Sprites.umCrystal(p, 86, 186, 6, 56, C, 0.22); return; }
      for (let y = 30; y < 188; y++) { const w = 6 + (y - 30) / 9; p.rect(55 - w / 2, y, w, 1, BAS[(y >> 3) % 2 ? 1 : 2]); p.px(55 - w / 2, y, BAS[3]); }
      p.tri(49, 32, 61, 32, 55, 6, BAS[2]); P.Sprites.umCrystal(p, 55, 30, 5, 22, C, 0);
      for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2, x = 55 + Math.cos(a) * 30, y = 70 + Math.sin(a) * 9; P.Sprites.umCrystal(p, x, y + 6, 4, 12, C, 0); }
      for (let y = 60; y < 180; y += 22) { p.px(55, y, on ? '#ff4450' : '#5a2a6a'); p.px(55, y + 1, on ? '#8a0a20' : '#2a1030'); }
    }, { up: 0.1, down: 0.15, dark: 0.5 });
  }
  // caverna: paredes negras con vetas y geodas encendidas
  { const W = 640, p = new P.Painter(W, P.H), r = P.RNG(991); p.grad(0, 0, W, P.H, ['#08060c', '#0c0810', '#100a12', '#07050a']);
    for (let l = 0; l < 2; l++) { let g = 30 + l * 20; for (let x = 0; x < W; x++) { g += r.range(-3, 3); g = P.clamp(g, 14 + l * 16, 70 + l * 16); p.rect(x, 0, 1, Math.round(g - l * 14), l ? '#0a080e' : '#120e16'); const gb = Math.round(P.H - g + l * 12); p.rect(x, gb, 1, P.H - gb, l ? '#0a080e' : '#120e16'); } }
    for (let i = 0; i < 12; i++) P.Sprites.umCluster(p, r.int(0, W), P.H - r.int(16, 50), 0.4 + r() * 0.4, U.g, r, 3);
    for (let i = 0; i < 40; i++) p.px(r.int(0, W), r.int(40, 200), r() < 0.5 ? '#5a1020' : '#2a0a14');
    P.mkCanvas('um_bg_cave', [p.canvas()]); }

  // ================= FLORA =================
  for (const st of ['c', 'r']) {
    const L = K[st].leaf, gl = st === 'r' ? '#ff5a3a' : '#7a3a8a';
    // BRASALUZ: frondas negras rígidas que terminan en ascuas
    P.mk('um_fern_' + st, 22, 16, 2, (p, f) => { for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * 0.36 + (f ? 0.05 : 0), ln = 9 + (k % 3) * 2; let x = 11, y = 15; for (let j = 0; j < ln; j++) { x += Math.cos(a); y += Math.sin(a); p.px(x, y, L[1 + (j % 2)]); if (j % 3 === 1) p.px(x + 1, y, L[0]); } p.px(x, y, gl); p.px(x, y - 1, st === 'r' ? '#ffd0a0' : '#a06aaa'); } });
  }
  // FAROL DE GEODA: tallo mineral con una geoda abierta que da luz
  P.mk('um_lamp', 14, 22, 2, (p, f) => { p.rect(6, 9, 2, 13, '#1e1924'); p.px(6, 14, '#3a3046'); p.sell(7, 7, 5, 5, ['#0c0a10', '#1e1924', '#2c2434']); p.ell(7, 7, 3, 3, f ? '#ff6a3a' : '#c8142a'); P.Sprites.umCrystal(p, 7, 9, 2, 5, P.UMC.r, 0); p.px(6, 6, '#ffd8cc'); });
  // CENICIELA: hongo de ceniza que suelta esporas negras
  P.mk('um_mush', 18, 16, 2, (p, f) => { p.rect(8, 9, 2, 7, '#2a2232'); p.sell(9, 8 - f, 7, 4, ['#0c0a10', '#1a1620', '#2c2434']); for (let k = 0; k < 4; k++) p.px(4 + k * 3, 9 - f, '#7a3a8a'); p.px(6, 6 - f, '#5a4a66'); });
  // UMBRACÁLIZ: cáliz orgánico fusionado con cristal
  P.mk('um_bigmush', 30, 34, 1, p => { p.thick(15, 34, 15, 16, 4, '#1a1620'); p.line(13, 32, 14, 18, '#2c2434'); for (let y = 0; y < 10; y++) { const w = 4 + y * 1.1; p.rect(15 - w, 16 - y, w * 2, 1, y > 7 ? '#2c2434' : '#14101a'); } P.Sprites.umCrystal(p, 15, 10, 5, 12, P.UMC.r, 0); P.Sprites.umCrystal(p, 9, 9, 3, 7, P.UMC.g, -0.2); P.Sprites.umCrystal(p, 21, 9, 3, 8, P.UMC.g, 0.2); });
  // ROSA DE OBSIDIANA: flor de pétalos negros con corazón de granate (semilla de misión)
  P.mk('um_orchid', 14, 16, 2, (p, f) => { p.line(7, 15, 7, 8, '#2a2232'); for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2 + f * 0.3; p.sell(7 + Math.cos(a) * 3, 6 + Math.sin(a) * 2.6, 2.4, 2, ['#0c0a10', '#241e2e', '#3a3046']); } p.ell(7, 6, 1.6, 1.6, '#ff2a3a'); p.px(7, 5, '#ffd8cc'); });
  P.mk('um_lily', 18, 6, 1, p => { p.ell(9, 4, 7, 1.6, '#16121c'); P.Sprites.umCrystal(p, 9, 4, 3, 4, P.UMC.r, 0); });
  // GRANATINA: planta curativa con bayas de granate
  P.mk('um_heal', 16, 18, 2, (p, f) => { for (let k = 0; k < 4; k++) p.line(8, 17, 3 + k * 3, 8 + (k % 2) * 2, '#2c2434'); for (const [x, y] of [[4, 8], [8, 6], [12, 9]]) { p.ell(x, y - f, 2.2, 2.2, '#c8142a'); p.px(x - 1, y - 1 - f, '#ffd8cc'); } });

  // ================= FAUNA (extraterrestre, de oscuridad y mineral) =================
  // FRACTÁRIDO: reptador de patas finas con lomo de cristales y un ojo en rendija
  const crawler = (p, f, C, cy2) => {
    const ph = f === 4 ? 0 : f; for (let k = 0; k < 4; k++) { const lx = 7 + k * 5, sw = Math.sin((ph + k) * 1.57) * 2; p.line(lx, 15, lx - 3 + sw, 21, '#16121c'); p.line(lx - 3 + sw, 21, lx - 4 + sw, 21, '#2c2434'); }
    p.sell(15, 14, 12, 4.5, ['#08060c', '#16121c', '#241e2e', '#3a3046']);
    for (let k = 0; k < 4; k++) P.Sprites.umCrystal(p, 8 + k * 4, 12, 3, 4 + (k % 2) * 4 + (f === 4 ? 3 : 0), C, -0.15);
    p.sell(26, 14, 4.5, 3.5, ['#0c0a10', '#1e1924', '#2c2434']); p.rect(26, 13, 4, 1, cy2 || C[2]); p.px(29, 13, '#ffffff');
    if (f === 4) for (let k = 0; k < 3; k++) p.px(10 + k * 4, 4 - k % 2, C[3]);
  };
  P.mk('um_krazith', 32, 22, 5, (p, f) => crawler(p, f, P.UMC.r));
  P.mk('um_krazith_cy', 34, 24, 5, (p, f) => { crawler(p, f, P.UMC.c, '#ff3a3a'); p.rect(10, 9, 12, 3, '#3a4258'); p.rect(10, 9, 12, 1, '#7a86a4'); p.px(15, 10, '#ff3050'); p.rect(25, 11, 6, 2, '#3a4258'); });
  // GEODONTE: coloso con caparazón de geoda partido; dentro late un núcleo rojo
  P.mk('um_krazith_alfa', 52, 36, 5, (p, f) => {
    const ph = f === 4 ? 0 : f; for (let k = 0; k < 3; k++) { const lx = 12 + k * 12, sw = Math.sin((ph + k) * 1.57) * 3; p.thick(lx, 24, lx - 2 + sw, 35, 3, '#16121c'); }
    p.sell(26, 20, 22, 12, ['#06050a', '#120e16', '#1e1924', '#2c2434']);
    p.tri(14, 14, 36, 14, 26, 26, '#2a0610'); p.ell(26, 18, f === 4 ? 9 : 7, f === 4 ? 6 : 4, '#c8142a'); p.ell(26, 18, 3, 2, '#ffd8cc');
    for (let k = 0; k < 7; k++) P.Sprites.umCrystal(p, 10 + k * 5, 14 - Math.abs(k - 3), 3, 6 + (3 - Math.abs(k - 3)) * 3, P.UMC.r, (k - 3) * 0.08);
    p.sell(46, 22, 6, 5, ['#08060c', '#16121c', '#241e2e']); p.rect(46, 21, 5, 1, '#ff4450'); p.px(51, 24, '#ffd8cc');
  });
  // PULSÁPODO: saco de cristal que salta y destella
  P.mk('um_frog', 20, 17, 3, (p, f) => { const y = f === 1 ? -2 : 0; p.line(4, 14 + y, 2, 16, '#16121c'); p.line(16, 14 + y, 18, 16, '#16121c'); p.sell(10, 10 + y, 7, 5.5, ['#0c0a10', '#1a1620', '#2a2232']); P.Sprites.umCrystal(p, 10, 9 + y, 6, 8, P.UMC.r, 0); if (f === 2) { p.ell(16, 9, 3, 2, '#ff6a3a'); p.px(17, 9, '#ffffff'); } p.px(15, 11 + y, '#ff4450'); });
  // LUCERNA UMBRÍA: polilla de alas negras con ocelos rojos que brillan
  const moth = (p, f, cy2) => { const up = f ? -3 : 2; for (const s of [-1, 1]) { p.tri(13, 8, 13 + s * 12, 8 + up, 13 + s * 8, 13, '#120e16'); p.tri(13, 8, 13 + s * 10, 8 + up, 13 + s * 6, 11, '#1e1924'); p.ell(13 + s * 7, 9 + up * 0.4, 1.8, 1.8, cy2 ? '#3a4258' : '#c8142a'); p.px(13 + s * 7, 9 + up * 0.4, cy2 ? '#ff3050' : '#ffd8cc'); } p.sell(13, 9, 2.5, 4, ['#08060c', '#1a1620', '#2c2434']); p.line(13, 5, 11, 2, '#2c2434'); p.line(13, 5, 15, 2, '#2c2434'); };
  P.mk('um_dfly', 26, 16, 2, (p, f) => moth(p, f, false));
  P.mk('um_dfly_cy', 26, 16, 2, (p, f) => { moth(p, f, true); p.rect(11, 7, 5, 4, '#3a4258'); p.px(13, 8, '#ff3050'); });
  // VELO DE CENIZA: criatura plana de sombra con brasas en el lomo
  P.mk('um_slug', 28, 15, 2, (p, f) => { for (let x = 2; x < 26; x++) { const h = Math.round(4 + Math.sin(x * 0.4 + f * 2) * 1.5); p.rect(x, 14 - h, 1, h, x % 3 ? '#100d14' : '#1a1620'); } for (let k = 0; k < 5; k++) p.px(5 + k * 4, 10 + Math.round(Math.sin(k + f * 2)), k % 2 ? '#ff6a3a' : '#c8142a'); p.rect(23, 9, 2, 1, '#ff4450'); });
  // COLGACUARZO: estalactita viva con señuelo luminoso
  P.mk('um_vsnake', 12, 34, 2, (p, f) => { for (let y = 0; y < 26 + f * 6; y++) { const w = Math.max(1, 4 - y / 9); p.rect(6 - w, y, w * 2, 1, y % 4 ? '#16121c' : '#241e2e'); } P.Sprites.umCrystal(p, 6, 8, 3, 6, P.UMC.c, 0); p.ell(6, 27 + f * 6, 2.4, 2.4, '#ff4450'); p.px(5, 26 + f * 6, '#ffffff'); if (f) { p.line(3, 30, 1, 33, '#2c2434'); p.line(9, 30, 11, 33, '#2c2434'); } });
  // FAUCE GEÓDICA: planta-geoda que se abre en dos valvas con dientes de cuarzo
  P.mk('um_maw', 26, 34, 3, (p, f) => { p.thick(13, 34, 13, 20, 4, '#16121c'); const o = [0, 5, 9][f]; p.sell(13 - o * 0.5, 14, 9, 8, ['#06050a', '#14101a', '#241e2e']); p.sell(13 + o * 0.5, 14, 9, 8, ['#06050a', '#14101a', '#241e2e']); if (o) { p.ell(13, 14, o, 6, '#2a0610'); for (let k = 0; k < 4; k++) { p.tri(13 - o + k * o / 2, 9, 13 - o + k * o / 2 + 2, 9, 13 - o + k * o / 2 + 1, 13, '#ffd8cc'); } p.ell(13, 15, 2, 2, '#ff4450'); } else p.line(13, 7, 13, 21, '#c8142a'); });
  // PACEVIDRIO (restaurado): zancudo pacífico de patas largas y astas de cristal
  P.mk('um_grazer', 38, 28, 3, (p, f) => { const ph = f === 2 ? 0 : f; for (let k = 0; k < 4; k++) { const lx = 10 + k * 6, sw = (k % 2 ? 1 : -1) * ph * 2; p.line(lx, 15, lx + sw, 27, '#2c2434'); } p.sell(19, 13, 11, 4, ['#0c0a10', '#1e1924', '#2c2434', '#3e3448']); p.line(29, 12, 33, 6, '#2c2434'); p.sell(33, 5, 3.5, 2.6, ['#0c0a10', '#1e1924', '#2c2434']); P.Sprites.umCrystal(p, 32, 3, 2, 5, P.UMC.r, -0.3); P.Sprites.umCrystal(p, 35, 3, 2, 4, P.UMC.r, 0.3); p.px(35, 5, '#ff4450'); for (let k = 0; k < 4; k++) p.px(12 + k * 4, 10, '#c8142a'); });
  // CORONA LUMÍNICA (legendaria): medusa de cristal que flota sobre el valle
  P.mk('um_vellorn', 40, 38, 2, (p, f) => { p.sell(20, 12, 15, 9, ['#3a0410', '#7a0a20', '#c8142a', '#ff8a8a']); p.ell(20, 12, 9, 5, '#ff4450'); p.ell(18, 10, 3, 2, '#ffd8cc'); for (let k = 0; k < 6; k++) { const x = 9 + k * 4.5; for (let y = 20; y < 34 + (k % 2) * 3; y++) p.px(x + Math.sin(y * 0.4 + k + f) * 1.5, y, y % 3 ? '#7a0a20' : '#ff4450'); } for (let k = 0; k < 5; k++) P.Sprites.umCrystal(p, 10 + k * 5, 5, 2, 4 + (k % 2) * 3, P.UMC.r, 0); });
  // UMBRÁTIL: espectro de sombra con dos ojos (solo se ve cerca de la luz)
  P.mk('um_wraith', 20, 24, 3, (p, f) => { for (let y = 2; y < 22; y++) { const w = 7 - Math.abs(y - 9) * 0.25 + (y > 14 ? Math.sin(y + f * 2) : 0); p.rect(10 - w, y, w * 2, 1, y < 14 ? '#0c0810' : '#08060a'); } for (let k = 0; k < 4; k++) p.px(4 + k * 4, 22 + (k + f) % 2, '#0c0810'); p.rect(6, 8, 3, 2, '#ff2a3a'); p.rect(12, 8, 3, 2, '#ff2a3a'); p.px(7, 8, '#ffd8cc'); p.px(13, 8, '#ffd8cc'); if (f === 2) p.ell(10, 13, 3, 2, '#2a0610'); }, { outline: false });
  // proyectiles de cristal
  P.mk('um_b_glob', 7, 7, 2, (p, f) => { p.ell(3, 3, 3, 3, f ? '#ff6a3a' : '#c8142a'); p.px(2, 2, '#ffd8cc'); });
  P.mk('um_b_orb', 8, 8, 2, (p, f) => { p.tri(0, 4, 8, 4 - f, 4, 0, '#ff4450'); p.tri(0, 4, 8, 4 + f, 4, 8, '#8a0a20'); p.px(3, 3, '#ffffff'); });
  P.mk('um_b_kspine', 12, 5, 1, p => { P.Sprites.umCrystal(p, 2, 2, 3, 1, P.UMC.r, 0); p.tri(0, 1, 0, 4, 11, 2, '#c8142a'); p.line(1, 2, 10, 2, '#ffd8cc'); });
  // portal: arco de basalto con una lente de cristal rojo
  P.mk('um_gate', 34, 46, 1, p => { for (let k = 0; k <= 20; k++) { const a = Math.PI * k / 20; p.thick(17 - Math.cos(a) * 13, 44 - Math.sin(a) * 34, 17 - Math.cos(a) * 13, 44 - Math.sin(a) * 34, 5, k % 4 ? '#16121c' : '#2c2434'); } p.rect(2, 42, 30, 4, '#0c0a10'); P.Sprites.umCrystal(p, 17, 14, 6, 10, P.UMC.r, 0); for (const x of [6, 28]) p.px(x, 30, '#ff4450'); });
  // iconos de mejoras
  const ic = (n, fn) => P.mk('i_' + n, 10, 10, 1, fn);
  ic('umbra_eye', p => { p.ell(5, 5, 4.5, 3, '#2c2434'); p.ell(5, 5, 2, 2, '#ff2a3a'); p.px(4, 4, '#ffffff'); });
  ic('resonance', p => { P.Sprites.umCrystal(p, 5, 9, 4, 9, P.UMC.r, 0); p.px(1, 3, '#ff8a7a'); p.px(9, 3, '#ff8a7a'); });
  ic('obsidian', p => { p.tri(1, 8, 9, 8, 5, 1, '#241e2e'); p.tri(3, 8, 7, 8, 5, 3, '#3e3448'); p.px(5, 5, '#ff2a3a'); });
  ic('shardgun', p => { p.rect(1, 4, 6, 3, '#3a4258'); P.Sprites.umCrystal(p, 8, 8, 2, 6, P.UMC.r, 0.2); });
  ic('eclipse', p => { p.ell(5, 5, 4.5, 4.5, '#ff4450'); p.ell(5, 5, 3.5, 3.5, '#050307'); p.px(2, 2, '#ffd8cc'); });

  // ================= MAPA EXTERIOR =================
  for (const st of ['c', 'r']) {
    const C = CR(st), on = st === 'r';
    P.mk('um_o_grass_' + st, 16, 16, 3, (p, v) => { const r = P.RNG(1100 + v + (on ? 9 : 0)); p.rect(0, 0, 16, 16, on ? '#0e090d' : '#0c0a10'); for (let k = 0; k < 5; k++) p.px(r.int(0, 15), r.int(0, 15), on ? '#1e1418' : '#1a1620'); if (v === 1) p.px(r.int(2, 13), r.int(2, 13), C[1]); if (v === 2) { const x = r.int(3, 12), y = r.int(5, 12); p.px(x, y, C[2]); p.px(x, y - 1, C[3]); p.px(x + 1, y, C[0]); } }, { outline: false });
    P.mk('um_o_water_' + st, 16, 16, 2, (p, f) => { const lq = K[st].liq; p.rect(0, 0, 16, 16, lq[1]); for (let k = 0; k < 3; k++) p.rect((k * 6 + f * 3) % 14, 3 + k * 5, 3, 1, lq[2]); if (f) p.px(8, 8, lq[3]); }, { outline: false });
    P.mk('um_o_tree_' + st, 34, 42, 2, (p, v) => { const r = P.RNG(1120 + v); p.ell(17, 40, 12, 2.5, '#050407'); if (v === 0) P.Sprites.umCluster(p, 17, 40, 0.9, C, r, 5); else { P.Sprites.umCrystal(p, 17, 40, 8, 38, C, 0.04); P.Sprites.umCrystal(p, 9, 40, 4, 16, C, -0.2); P.Sprites.umCrystal(p, 25, 40, 4, 20, C, 0.2); } });
    P.mk('um_o_ice_' + st, 16, 16, 2, (p, v) => { p.rect(0, 0, 16, 16, '#16121c'); for (let k = 0; k < 4; k++) p.line(k * 4 + v, 0, k * 4 + 3 + v, 16, '#1e1924'); p.px(5 + v * 6, 7, C[1]); }, { outline: false });
    P.mk('um_o_cliff_' + st, 16, 16, 3, (p, v) => { p.rect(0, 0, 16, 16, '#0a080e'); for (let k = 0; k < 3; k++) p.tri(k * 6, 16, k * 6 + 6, 16, k * 6 + 3, 3 + (k % 2) * 4, '#16121c'); if (v === 1) { p.rect(0, 12, 16, 4, '#050407'); p.px(4, 11, C[1]); } if (v === 2) { p.rect(0, 0, 16, 2, '#241e2e'); P.Sprites.umCrystal(p, 11, 6, 3, 5, C, 0); } }, { outline: false });
    P.mk('um_o_crack_' + st, 16, 16, 2, (p, f) => { p.rect(0, 0, 16, 16, '#0c0a10'); const V = on ? (f ? '#ff6a3a' : '#ff2a3a') : (f ? '#7a3a8a' : '#5a2a6a'); p.line(0, 8, 5, 6, V); p.line(5, 6, 10, 9, V); p.line(10, 9, 16, 7, V); p.px(5, 7, on ? '#ffd8cc' : '#a06a9a'); }, { outline: false });
  }
  P.mk('um_o_path', 16, 16, 2, (p, v) => { p.rect(0, 0, 16, 16, '#1e1924'); for (let k = 0; k < 4; k++) p.line(k * 5 + v, 0, k * 5 + 2 + v, 16, '#16121c'); p.px(8, 8, '#2c2434'); }, { outline: false });
  P.mk('um_o_stone', 16, 16, 1, p => { p.rect(0, 0, 16, 16, '#241e2e'); p.rect(0, 7, 16, 1, '#14101a'); p.rect(7, 0, 1, 7, '#14101a'); p.rect(11, 8, 1, 8, '#14101a'); p.px(3, 3, '#ff2a3a'); p.px(13, 12, '#c8142a'); }, { outline: false });
  P.mk('um_o_goo', 16, 16, 2, (p, f) => { p.ell(8, 11, 6, 3, '#08040c'); p.ell(8, 10, 4, 2, '#2a0e30'); p.px(6 + f, 9, '#9a3a8a'); p.px(10, 10 - f, '#5a2a6a'); }, { outline: false });
  P.mk('um_o_lamp', 10, 16, 2, (p, f) => { p.rect(4, 7, 2, 9, '#1e1924'); P.Sprites.umCrystal(p, 5, 8, 4, 7 + f, P.UMC.r, 0); });
  P.mk('um_o_rock', 16, 16, 1, p => { p.sell(8, 10, 7, 5.5, ['#050407', '#0e0b12', '#1a1620', '#2c2434']); p.px(5, 8, '#c8142a'); });
  P.mk('um_o_pillar', 14, 30, 2, (p, f) => { if (f) { p.rect(3, 22, 8, 8, '#16121c'); P.Sprites.umCrystal(p, 7, 22, 4, 6, P.UMC.c, 0.2); return; } P.Sprites.umCrystal(p, 7, 30, 7, 28, P.UMC.r, 0); });
  P.mk('um_o_house', 44, 38, 2, (p, f) => { p.tri(4, 36, 40, 36, 22, 8, f ? '#241e2e' : '#16121c'); p.tri(22, 8, 40, 36, 30, 36, '#0c0a10'); P.Sprites.umCrystal(p, 22, 12, 5, 10, f ? P.UMC.r : P.UMC.c, 0); p.rect(19, 28, 6, 8, '#050407'); });
  P.mk('um_o_flower', 8, 8, 3, (p, v) => { P.Sprites.umCrystal(p, 4, 8, 2, 4 + v, [P.UMC.r, P.UMC.o, P.UMC.g][v], 0); });
};
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildUmbrelia(); }; })();
