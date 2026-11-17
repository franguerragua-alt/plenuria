'use strict';
// LA ESFERA DE DYSON — arte (prefijo «ds_»). La megaestructura de los Esqueléticos alrededor de la estrella Plenuria.
// Identidad propia: metal oscuro de placas con costuras luminosas, hueso marfil, neón carmesí imperial y oro; el cian
// marca los sistemas que el jugador ya ha neutralizado. Cada nivel compone su propio fondo (P.DS.SETS), de forma perezosa:
// las capas se pintan la primera vez que se entra en ese nivel.
P.DSC = { m: ['#06070b', '#0c0e15', '#141822', '#1e2432', '#2c3446', '#404a62', '#5e6a86', '#8a96b4'], bone: ['#6a6254', '#a49a82', '#d8d0b8', '#f4eedc'],
  red: ['#2a040c', '#6a0a1a', '#b0102a', '#ff2a4a', '#ff8a9a'], gold: ['#6a4a0e', '#b08a26', '#ffd166', '#fff4c0'], cyan: ['#06283a', '#14709a', '#3ac8f0', '#bff6ff'],
  green: ['#0a2410', '#2f7a34', '#7dff5a', '#d6ffc8'], vio: ['#1a0a2a', '#3e1a6a', '#7a3ad0', '#c08aff'], fire: ['#5a1404', '#c0400a', '#ff8a2a', '#ffd166', '#fff4c0'] };
P.PAL.dyson = {
  c: { soil: ['#0c0e15', '#141822', '#1e2432', '#2c3446'], vein: '#ff2a4a', top: ['#1e2432', '#2c3446', '#404a62', '#8a96b4'], liq: ['#2a040c', '#6a0a1a', '#ff2a4a', '#ff8a9a'],
    thorn: ['#2a040c', '#b0102a', '#ff2a4a', '#ffffff'], leaf: ['#141822', '#2c3446', '#404a62', '#5e6a86'], trunk: ['#0c0e15', '#1e2432', '#2c3446'], glow: '#ff2a4a', flower: ['#ff2a4a', '#ffd166', '#5ae0ff'] },
  r: { soil: ['#0c0e15', '#141822', '#1e2432', '#2c3446'], vein: '#3ac8f0', top: ['#1e2432', '#2c3446', '#404a62', '#bff6ff'], liq: ['#06283a', '#14709a', '#3ac8f0', '#bff6ff'],
    thorn: ['#06283a', '#14709a', '#3ac8f0', '#ffffff'], leaf: ['#141822', '#2c3446', '#404a62', '#5e6a86'], trunk: ['#0c0e15', '#1e2432', '#2c3446'], glow: '#3ac8f0', flower: ['#3ac8f0', '#ffd166', '#bff6ff'] }
};
P.SKIES_D = { day: { c: ['#04050c', '#0a0c1e', '#14183a', '#1e2450', '#2a2e5e'], r: ['#04050c', '#0a0c1e', '#14183a', '#1e2450', '#2a2e5e'] },
  golden: { c: ['#06040a', '#140a1a', '#2a1020', '#4a1a26', '#6a2a2a'], r: ['#06040a', '#140a1a', '#2a1020', '#4a1a26', '#6a2a2a'] },
  dusk: { c: ['#020206', '#06060e', '#0c0c1a', '#141428', '#1c1c36'], r: ['#020206', '#06060e', '#0c0c1a', '#141428', '#1c1c36'] } };
P.ART = P.ART || {};
P.ART.dyson = { p: 'ds_', skies: P.SKIES_D, owMusic: 'dyson_ow', noVeg: true, owAmb: lf => 'rgba(4,4,14,' + (0.32 - lf * 0.12) + ')',
  flora: { L: 'faro_imperial', F: 'cableado', m: 'mina_sensor', U: 'pilono', h: 'celula_reparacion', y: 'flor_aurora', lily: 'boya', g: 'pacenube', legend: 'ballena_celeste' }, tileFlora: { b: 'plataforma_salto', '|': 'cable_escalada', '^': 'rejilla_electrica' } };

// ---------- utilidades de dibujo de megaestructuras ----------
P.DS = {
  SETS: {}, cache: {},
  B4: () => P.BAYER4,
  // panel metálico con costuras, remaches y una franja de luces
  panel(p, x, y, w, h, C, lit, r) { p.rect(x, y, w, h, C[2]); p.rect(x, y, w, 1, C[4]); p.rect(x, y, 1, h, C[3]); p.rect(x, y + h - 1, w, 1, C[0]); p.rect(x + w - 1, y, 1, h, C[1]); for (let k = 0; k < Math.floor(w / 10); k++) { p.px(x + 3 + k * 10, y + 2, C[5]); p.px(x + 3 + k * 10, y + h - 3, C[1]); } if (lit) for (let k = 0; k < w - 4; k += 3) if (r() < 0.7) p.px(x + 2 + k, y + Math.floor(h / 2), lit); },
  // torre alienígena: perfil que se estrecha, aletas, anillos, ventanas iluminadas y antena con baliza
  tower(p, cx, by, w, h, C, lit, r, o = {}) {
    for (let y = 0; y < h; y++) { const t = y / h, ww = Math.max(1.5, w * (1 - t * (o.taper || 0.55)) * (y % 23 < 3 && t > 0.1 ? 1.12 : 1)), Y = by - y; p.rect(Math.round(cx - ww), Y, Math.round(ww * 2), 1, C[2]); p.px(Math.round(cx - ww), Y, C[4]); p.px(Math.round(cx + ww) - 1, Y, C[0]); if (y % 23 === 0 && t > 0.1) p.rect(Math.round(cx - ww - 1), Y, Math.round(ww * 2 + 2), 1, C[5]); }
    for (let y = 6; y < h - 10; y += 5) { const t = y / h, ww = w * (1 - t * (o.taper || 0.55)); for (let x = Math.round(cx - ww + 2); x < cx + ww - 2; x += 3) if (r() < (o.dens || 0.35)) p.px(x, by - y, r() < 0.15 ? '#ffffff' : lit); }
    if (o.fins) for (const sd of [-1, 1]) p.tri(cx + sd * w * 0.9, by - h * 0.25, cx + sd * w * 1.7, by - h * 0.02, cx + sd * w * 0.9, by - h * 0.55, C[1]);
    p.line(cx, by - h, cx, by - h - (o.ant || 10), C[5]); p.px(cx, by - h - (o.ant || 10), o.beacon || '#ff2a4a');
  },
  // viga de celosía entre dos puntos
  truss(p, x0, y0, x1, y1, col, w = 4) { const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / w)), dx = (x1 - x0) / n, dy = (y1 - y0) / n, l = Math.hypot(dx, dy) || 1, nx = -dy / l * w / 2, ny = dx / l * w / 2; p.line(x0 + nx, y0 + ny, x1 + nx, y1 + ny, col); p.line(x0 - nx, y0 - ny, x1 - nx, y1 - ny, col); for (let i = 0; i < n; i++) p.line(x0 + dx * i + (i % 2 ? nx : -nx), y0 + dy * i + (i % 2 ? ny : -ny), x0 + dx * (i + 1) + (i % 2 ? -nx : nx), y0 + dy * (i + 1) + (i % 2 ? -ny : ny), col); },
  // nave (silueta con motor encendido), mirando a la derecha
  ship(c, x, y, s, kind, col, eng, t) { x = Math.round(x); y = Math.round(y); c.fillStyle = col; if (kind === 0) { c.fillRect(x - 5 * s, y - 1 * s, 10 * s, 2 * s); c.fillRect(x - 3 * s, y - 3 * s, 4 * s, 6 * s); c.fillRect(x + 4 * s, y - s / 2, 3 * s, s); } else if (kind === 1) { c.fillRect(x - 9 * s, y - 2 * s, 16 * s, 4 * s); c.fillRect(x - 6 * s, y - 4 * s, 8 * s, 8 * s); c.fillRect(x + 7 * s, y - s, 4 * s, 2 * s); } else { c.fillRect(x - 16 * s, y - 3 * s, 30 * s, 6 * s); c.fillRect(x - 10 * s, y - 6 * s, 14 * s, 12 * s); c.fillRect(x + 14 * s, y - 2 * s, 6 * s, 4 * s); c.fillRect(x - 4 * s, y - 9 * s, 3 * s, 3 * s); }
    c.fillStyle = (t >> 2) % 2 ? eng : '#ffffff'; const ex = kind === 0 ? -5 : kind === 1 ? -9 : -16; c.fillRect(x + ex * s - 2, y - 1, 2, 2); },
  // superficie exterior de la Esfera: placas en perspectiva hacia el horizonte curvo
  hull(p, W, yh, C, lit, r) { for (let y = yh; y < P.H; y++) { const t = (y - yh) / (P.H - yh); for (let x = 0; x < W; x++) { const curve = Math.round(Math.pow((x - W / 2) / (W / 2), 2) * 6); if (y < yh + curve) continue; p.px(x, y, C[t < 0.3 ? 2 : t < 0.7 ? 1 : 0]); } if ((y - yh) % Math.max(2, Math.round(3 + t * 14)) === 0) for (let x = 0; x < W; x++) if ((x + y) % 2) p.px(x, y, C[3]); }
    for (let k = -14; k <= 14; k++) { const x0 = W / 2 + k * 6, x1 = W / 2 + k * 60; p.line(x0, yh + 4, x1, P.H, C[3]); } for (let k = 0; k < 60; k++) p.px(r.int(0, W), r.int(yh + 4, P.H), lit); },
  // cielo exterior: espacio con nebulosa, estrellas y los planetas liberados a lo lejos
  space(p, C, r, o = {}) { p.grad(0, 0, P.W, P.H, C); for (let i = 0; i < 160; i++) p.px(r.int(0, P.W), r.int(0, P.H), r() < 0.15 ? '#ffffff' : r() < 0.5 ? '#8a96b4' : '#4a5270'); for (let i = 0; i < 6; i++) { const x = r.int(10, P.W - 10), y = r.int(6, 140); p.px(x, y, '#ffffff'); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) p.px(x + dx, y + dy, '#8ab4f0'); }
    const NB = o.neb || ['#2a1a4a', '#3a1a5a', '#5a2a6a'], B4 = P.BAYER4; for (let y = 0; y < 160; y++) for (let x = 0; x < P.W; x++) { const v = Math.sin(x * 0.012 + y * 0.03) + Math.sin(x * 0.031 - y * 0.017) * 0.8 + (o.nebY ? -Math.abs(y - o.nebY) / 40 : 0); if (v > 0.9 && B4[y & 3][x & 3] / 16 < (v - 0.9) * 0.6) p.px(x, y, NB[Math.min(2, Math.floor((v - 0.9) * 3))]); } }
};

P.Sprites.buildDyson = function () {
  const K = P.PAL.dyson, D = P.DSC, M = D.m;
  for (const st of ['c', 'r']) {
    const pal = K[st], on = st === 'r', L = on ? D.cyan : D.red;
    // casco de la Esfera: placas con costuras, remaches y conductos que brillan
    P.mk('ds_t_soil_' + st, 16, 16, 3, (p, v) => { p.rect(0, 0, 16, 16, M[2]); p.rect(0, 0, 16, 1, M[3]); p.rect(0, 7, 16, 1, M[1]); p.rect(7, 0, 1, 7, M[1]); p.rect(11, 8, 1, 8, M[1]); p.px(2, 2, M[5]); p.px(13, 10, M[5]); p.px(4, 12, M[4]); if (v === 1) { p.rect(2, 10, 7, 2, M[0]); p.rect(3, 10, 5, 1, L[2]); } if (v === 2) { p.rect(9, 2, 5, 3, M[1]); p.px(10, 3, L[3]); p.px(12, 3, D.gold[2]); } }, { outline: false });
    // pasarela superior con franja de peligro y luces de borde
    P.mk('ds_t_top_' + st, 16, 9, 3, (p, v) => { p.rect(0, 2, 16, 5, M[4]); p.rect(0, 2, 16, 1, M[6]); p.rect(0, 6, 16, 1, M[1]); for (let x = (v * 3) % 6; x < 16; x += 6) { p.rect(x, 4, 3, 2, on ? D.cyan[1] : D.gold[1]); } p.px(v * 5 + 2, 3, L[3]); }, { outline: false });
    P.mk('ds_t_bot_' + st, 16, 8, 2, (p, v) => { for (let k = 0; k < 2; k++) { const x = 3 + k * 8 + v; p.line(x, 0, x + (k ? 2 : -1), 6, M[3]); p.px(x + (k ? 2 : -1), 7, L[2]); } p.rect(6, 0, 4, 2, M[1]); });
    P.mk('ds_tdeco_' + st, 16, 14, 6, (p, v) => {
      if (v === 0) { p.rect(2, 4, 12, 10, M[3]); p.rect(2, 4, 12, 1, M[5]); p.rect(3, 7, 10, 1, M[1]); p.rect(7, 9, 2, 2, L[2]); }
      if (v === 1) { p.rect(5, 6, 6, 8, M[2]); for (let k = 0; k < 3; k++) p.rect(6, 7 + k * 2, 4, 1, M[0]); p.px(8, 5, L[3]); }
      if (v === 2) { p.rect(3, 2, 10, 7, M[1]); p.rect(4, 3, 8, 5, on ? D.cyan[0] : D.red[0]); for (let k = 0; k < 3; k++) p.rect(5, 4 + k, 2 + ((k * 3) % 5), 1, L[2]); p.rect(7, 9, 2, 5, M[3]); }
      if (v === 3) { p.rect(1, 9, 14, 3, M[3]); p.rect(1, 9, 14, 1, M[5]); p.rect(3, 6, 3, 3, M[4]); p.rect(10, 6, 3, 3, M[4]); }
      if (v === 4) { p.sell(8, 11, 4, 3, D.bone); p.rect(6, 10, 1, 1, M[0]); p.rect(9, 10, 1, 1, M[0]); }
      if (v === 5) { p.rect(7, 4, 2, 10, M[4]); p.ell(8, 3, 2, 2, (v + (on ? 1 : 0)) % 2 ? L[3] : L[2]); }
    });
    // plasma de los canales de energía
    const lq = pal.liq;
    P.mk('ds_t_liq_' + st, 16, 16, 4, (p, f) => { for (let x = 0; x < 16; x++) { const h = Math.round(2 + Math.sin((x + f * 4) * 0.5) * 1.2); for (let y = h; y < 16; y++) p.px(x, y, y < h + 2 ? lq[3] : (x + y + f) % 7 === 0 ? lq[2] : lq[1]); p.px(x, h, '#ffffff'); } });
    P.mk('ds_t_liqb_' + st, 16, 16, 4, (p, f) => { p.grad(0, 0, 16, 16, [lq[1], lq[0]]); for (let k = 0; k < 3; k++) p.line((k * 6 + f * 3) % 16, 0, (k * 6 + f * 3 + 4) % 16, 15, lq[2]); });
    // rejilla electrificada
    P.mk('ds_t_thorn_' + st, 16, 16, 2, (p, f) => { p.rect(0, 12, 16, 4, M[3]); p.rect(0, 12, 16, 1, M[5]); for (let x = 1; x < 16; x += 3) { p.line(x, 12, x + (f ? 1 : -1), 6, M[5]); p.px(x + (f ? 1 : -1), 5, L[3]); } if (f) for (let x = 0; x < 16; x += 2) p.px(x, 8 + (x % 4 ? 1 : 0), L[2]); });
    P.mk('ds_t_vine_' + st, 16, 16, 2, (p, v) => { p.rect(6, 0, 1, 16, M[5]); p.rect(9, 0, 1, 16, M[3]); for (let y = v * 2; y < 16; y += 4) p.rect(6, y, 4, 1, M[6]); });
    P.mk('ds_t_branch_' + st, 16, 8, 2, (p, v) => { p.rect(0, 2, 16, 3, M[3]); p.rect(0, 2, 16, 1, M[6]); for (let x = 1 + v * 2; x < 16; x += 4) p.px(x, 3, M[0]); p.px(v ? 3 : 11, 4, L[2]); });
    // plataforma de salto (te impulsa)
    P.mk('ds_t_bulb_' + st, 16, 16, 3, (p, f) => { p.rect(1, 12, 14, 4, M[3]); p.rect(1, 12, 14, 1, M[6]); p.rect(3, 10, 10, 2, M[4]); const h = [2, 9, 5][f]; for (let i = 0; i < h; i++) { p.px(5 + (i % 2), 9 - i, L[3]); p.px(10 - (i % 2), 9 - i, L[2]); } p.rect(6, 10, 4, 1, L[2]); });
  }
  // arquitectura imperial: piedra negra pulida con molduras de oro y neón carmesí
  P.mk('ds_t_ruin', 16, 16, 3, (p, v) => { p.grad(0, 0, 16, 16, ['#1e1a22', '#141016', '#0c0a0e']); p.rect(0, 0, 16, 2, D.gold[1]); p.rect(0, 1, 16, 1, D.gold[2]); p.line(0, 9, 15, 9, '#060408'); p.line(v * 5 + 2, 2, v * 5 + 2, 9, '#060408'); if (v === 1) { p.rect(6, 4, 4, 3, D.red[3]); p.px(7, 5, '#ffffff'); } if (v === 2) { p.sell(11, 12, 2, 2, D.bone); } }, { outline: false });
  P.mk('ds_t_ruintop', 16, 6, 1, p => { p.rect(0, 2, 16, 2, D.gold[1]); p.rect(0, 2, 16, 1, D.gold[3]); for (let x = 2; x < 16; x += 5) p.px(x, 3, D.red[3]); }, { outline: false });
  P.mk('ds_t_crack', 16, 16, 1, p => { p.rect(0, 0, 16, 16, M[2]); p.line(3, 0, 7, 7, M[0]); p.line(7, 7, 4, 15, M[0]); p.line(7, 7, 13, 10, M[0]); p.px(7, 7, D.red[3]); }, { outline: false });
  // compuerta blindada (se abre con la energía de un nodo)
  P.mk('ds_t_gate', 16, 16, 2, (p, f) => { p.rect(1, 0, 14, 16, M[3]); p.rect(1, 0, 1, 16, M[5]); p.rect(14, 0, 1, 16, M[0]); for (let y = 1; y < 16; y += 4) { p.rect(3, y, 10, 2, f ? D.gold[1] : D.gold[0]); p.px(8, y, f ? '#ffffff' : D.red[3]); } }, { outline: false });
  // puente de luz sólida (aparece y se apaga)
  P.mk('ds_t_phase', 16, 8, 2, (p, f) => { if (f) { for (let x = 1; x < 16; x += 3) p.px(x, 4, D.cyan[2]); return; } p.rect(0, 2, 16, 4, D.cyan[1]); p.rect(0, 2, 16, 1, D.cyan[3]); p.rect(0, 5, 16, 1, D.cyan[0]); for (let x = 2; x < 16; x += 5) p.px(x, 3, '#ffffff'); });

  // ================= LEGIONES ESQUELÉTICAS =================
  // legionario (base: el soldado del régimen) en tres libreas: Dominio (carmesí), Corazón (verde de laboratorio) e Imperio (negro y oro)
  const soldier = (A, N, crest) => (p, f) => { const walk = f >= 1 && f <= 4, st = walk ? [[2, 0], [0, 1], [-2, 0], [0, 1]][f - 1] : [0, 0];
    p.thick(7, 17, 7 - st[0], 25, 3, A[1]); p.thick(10, 17, 10 + st[0], 25 - st[1], 3, A[2]); p.px(7 - st[0], 21, N); p.px(10 + st[0], 21, N);
    p.rect(5, 10, 8, 8, A[2]); p.rect(5, 10, 1, 8, A[1]); p.rect(6, 13, 6, 1, N); p.sell(5, 11, 2.6, 2.4, A); p.px(9, 15, D.gold[2]);
    p.sell(9.5, 6, 4.4, 4.4, [D.bone[1], D.bone[3], '#ffffff']); p.rect(5, 1, 9, 3, A[1]); p.rect(5, 1, 9, 1, A[3]); if (crest) p.rect(7, -1 + 1, 5, 1, crest);
    p.rect(10, 5, 4, 2, '#140a10'); p.px(11, 5, N); p.px(13, 5, N); p.rect(9, 9, 4, 1, D.bone[1]); p.px(10, 9, '#140a10'); p.px(12, 9, '#140a10');
    const gx = f === 5 ? 9 : 8; p.rect(gx, 13, 10, 2, '#4a5068'); p.rect(gx, 13, 10, 1, '#a8b4d0'); p.px(gx + 9, 13, N); p.rect(gx - 1, 13, 3, 3, D.bone[3]); };
  P.mk('ds_soldier', 18, 26, 6, soldier(['#14080c', '#3a1018', '#6a1a24', '#a02a36'], '#ff2a4a', D.red[3]));
  P.mk('ds_soldier_b', 18, 26, 6, soldier(['#0a140c', '#1e3a22', '#2f5a34', '#4a8a50'], '#7dff5a', D.green[2]));
  P.mk('ds_soldier_c', 18, 26, 6, soldier(['#0a0808', '#1c1618', '#2e2428', '#c0962a'], '#ff2a4a', D.gold[2]));
  // pretoriano con escudo de energía (élite): bloquea de frente
  P.mk('ds_wraith', 20, 24, 3, (p, f) => { p.line(7, 18, 5, 23, M[3]); p.line(12, 18, 14, 23, M[3]); p.sell(9, 13, 6, 7, [M[1], M[3], M[5], M[6]]); p.sell(9, 5, 4, 4, [D.bone[1], D.bone[2], D.bone[3]]); p.rect(6, 1, 7, 2, D.gold[1]); p.ell(11, 5, 1.4, 1.2, f === 2 ? '#ffffff' : D.red[3]); const sx = f === 1 ? 17 : 15; p.rect(sx, 3, 3, 17, D.red[1]); p.rect(sx, 3, 1, 17, D.red[3]); for (let y = 5; y < 20; y += 3) p.px(sx + 1, y, D.red[4]); });
  // araña de mantenimiento (c alternativo / K blindada)
  const crawl = (p, f, arm) => { const ph = f === 4 ? 0 : f; for (let k = 0; k < 4; k++) { const lx = 8 + k * 5, sw = Math.sin((ph + k) * 1.57) * 2; p.line(lx, 14, lx - 3 + sw, 21, M[5]); p.px(lx - 3 + sw, 21, M[6]); } p.sell(15, 13, 10, 5, [M[1], M[3], M[5], M[6]]); p.rect(9, 10, 12, 2, arm ? D.red[1] : M[4]); p.ell(26, 13, 2.6, 2.2, M[2]); p.px(27, 12, D.red[3]); p.px(25, 13, D.red[3]); if (f === 4) p.line(28, 14, 31, 15, D.red[3]); };
  P.mk('ds_krazith', 32, 22, 5, (p, f) => crawl(p, f, false));
  P.mk('ds_krazith_cy', 34, 24, 5, (p, f) => { crawl(p, f, true); p.rect(8, 4, 14, 3, '#3a4258'); p.rect(8, 4, 14, 1, '#7a86a4'); p.px(14, 3, D.red[3]); });
  // caminante de asedio (A): mole de dos patas con cañón dorsal
  P.mk('ds_krazith_alfa', 52, 36, 5, (p, f) => { const ph = f === 4 ? 0 : f; for (const [lx, k] of [[16, 0], [34, 1]]) { const sw = Math.sin((ph + k * 2) * 1.57) * 3; p.thick(lx, 22, lx + sw, 34, 5, M[2]); p.rect(lx + sw - 4, 33, 9, 3, M[4]); } p.rect(8, 8, 36, 16, M[3]); p.rect(8, 8, 36, 2, M[6]); p.rect(8, 22, 36, 2, M[1]); for (let k = 0; k < 4; k++) p.rect(12 + k * 8, 13, 5, 2, D.red[1]); p.rect(40, 12, 10, 6, M[4]); p.rect(46, 13, 4, 3, f === 4 ? '#ffffff' : D.red[3]); p.rect(14, 2, 22, 6, M[2]); p.rect(34, 3, 16, 3, M[5]); p.px(49, 4, D.red[3]); p.sell(26, 15, 4, 4, D.bone); });
  // mina saltarina (f)
  P.mk('ds_frog', 20, 17, 3, (p, f) => { const y = f === 1 ? -3 : 0; p.sell(10, 11 + y, 6, 4, [M[1], M[3], M[5], M[6]]); p.rect(6, 9 + y, 8, 1, D.red[2]); p.px(10, 8 + y, f === 2 ? '#ffffff' : D.red[3]); for (const sd of [-1, 1]) p.line(10 + sd * 4, 14 + y, 10 + sd * 7, 16, M[4]); });
  // dron explorador (d) y dron de combate con calavera (D)
  const fly = (p, f, cy2) => { const up = f ? -2 : 1; for (const sd of [-1, 1]) { p.rect(13 + sd * 8 - 3, 4 + up, 6, 2, M[4]); p.line(13 + sd * 4, 7, 13 + sd * 8, 5 + up, M[5]); } p.sell(13, 9, 5, 4, [M[1], M[3], M[5], M[6]]); if (cy2) { p.sell(13, 9, 3, 3, D.bone); p.px(12, 9, M[0]); p.px(14, 9, M[0]); p.px(13, 12, D.red[3]); } else p.ell(15, 9, 1.6, 1.6, D.red[3]); };
  P.mk('ds_dfly', 26, 16, 2, (p, f) => fly(p, f, false));
  P.mk('ds_dfly_cy', 26, 16, 2, (p, f) => fly(p, f, true));
  // gusano de cables (l)
  P.mk('ds_slug', 28, 15, 2, (p, f) => { for (let k = 0; k < 6; k++) { const x = 5 + k * 3.6, y = 10 + Math.sin(k * 0.9 + f * 2); p.sell(x, y, 2.6, 2.6, [M[1], M[3], M[5]]); p.px(x, y + 2, k % 2 ? D.red[2] : D.gold[1]); } p.px(25, 9, D.red[3]); });
  P.mk('ds_vsnake', 12, 34, 2, (p, f) => { for (let y = 0; y < 24 + f * 6; y++) p.rect(5, y, 2, 1, M[(y >> 2) % 2 ? 4 : 5]); const y0 = 24 + f * 6; p.sell(6, y0 + 2, 3, 2.4, [M[1], M[3], M[5]]); p.px(5, y0 + 2, D.red[3]); p.px(7, y0 + 2, D.red[3]); });
  // torreta de pinza (p)
  P.mk('ds_maw', 26, 34, 3, (p, f) => { p.rect(9, 20, 8, 14, M[3]); p.rect(9, 20, 8, 1, M[6]); const o = [0, 3, 6][f]; for (const sd of [-1, 1]) p.tri(13, 18, 13 + sd * (6 + o), 6 - o * 0.3, 13 + sd * 2, 6, M[5]); p.ell(13, 13, 4, 3, f ? '#ffffff' : D.red[3]); });
  P.mk('ds_grazer', 38, 28, 3, (p, f) => { p.rect(6, 12, 26, 10, M[3]); p.rect(6, 12, 26, 1, M[6]); for (let k = 0; k < 4; k++) p.ell(10 + k * 6, 23, 3, 3, M[2]); p.rect(28, 8, 8, 6, M[4]); p.px(34, 10, D.cyan[2]); });
  P.mk('ds_vellorn', 40, 38, 2, (p, f) => { p.sell(20, 20, 16, 8, [M[1], M[3], M[5], M[6]]); p.rect(6, 18, 28, 2, D.cyan[2]); p.px(34, 18, '#ffffff'); });
  // proyectiles
  P.mk('ds_b_glob', 7, 7, 2, (p, f) => { p.ell(3, 3, 3, 3, f ? D.red[4] : D.red[3]); p.px(2, 2, '#ffffff'); });
  P.mk('ds_b_orb', 8, 8, 2, (p, f) => { p.ell(4, 4, 3.6, 3.6, f ? D.red[3] : D.red[2]); p.ell(3, 3, 1.4, 1.4, '#ffffff'); });
  P.mk('ds_b_kspine', 12, 5, 1, p => { p.rect(0, 1, 11, 3, D.red[3]); p.rect(2, 2, 9, 1, '#ffffff'); });
  P.mk('ds_rock', 12, 12, 2, (p, f) => { p.rect(2, 2, 8, 8, M[4]); p.rect(2, 2, 8, 1, M[6]); p.px(5, 5, f ? D.red[3] : M[1]); });
  P.mk('ds_gate', 34, 46, 1, p => { for (let k = 0; k <= 20; k++) { const a = Math.PI * k / 20; p.thick(17 - Math.cos(a) * 13, 44 - Math.sin(a) * 34, 17 - Math.cos(a) * 13, 44 - Math.sin(a) * 34, 5, k % 3 ? M[4] : D.gold[2]); } p.rect(2, 42, 30, 4, M[3]); p.ell(17, 14, 4, 4, D.red[3]); p.px(17, 14, '#ffffff'); });
  // flora técnica (los marcadores de flora del motor, reinterpretados)
  for (const st of ['c', 'r']) P.mk('ds_fern_' + st, 22, 16, 2, (p, f) => { for (let k = 0; k < 4; k++) { const x = 4 + k * 5; p.line(x, 15, x + (f ? 1 : 0), 8 + (k % 2) * 2, M[5]); p.px(x + (f ? 1 : 0), 7 + (k % 2) * 2, st === 'r' ? D.cyan[2] : D.red[3]); } });
  P.mk('ds_lamp', 14, 22, 2, (p, f) => { p.rect(6, 6, 2, 16, M[4]); p.rect(3, 4, 8, 3, M[5]); p.rect(4, 5, 6, 1, f ? D.red[4] : D.red[3]); });
  P.mk('ds_mush', 18, 16, 2, (p, f) => { p.sell(9, 12, 6, 3, [M[1], M[3], M[5]]); p.px(9, 10 - f, D.red[3]); });
  P.mk('ds_bigmush', 30, 34, 1, p => { p.rect(13, 4, 4, 30, M[4]); p.rect(13, 4, 1, 30, M[6]); for (let k = 0; k < 3; k++) p.rect(8, 8 + k * 8, 14, 2, M[3]); p.px(15, 2, D.red[3]); });
  P.mk('ds_heal', 16, 18, 2, (p, f) => { p.rect(4, 6, 8, 12, M[3]); p.rect(5, 7, 6, 8, D.green[0]); p.rect(7, 9 - f, 2, 4, D.green[2]); p.rect(6, 10 - f, 4, 2, D.green[2]); });
  P.mk('ds_orchid', 14, 16, 2, (p, f) => { p.line(7, 15, 7, 8, M[5]); p.ell(7, 6, 3, 3, f ? D.gold[2] : D.gold[1]); });
  P.mk('ds_lily', 18, 6, 1, p => { p.rect(2, 2, 14, 3, M[4]); p.px(9, 2, D.cyan[2]); });
  P.mk('ds_drift', 48, 22, 1, p => { p.rect(0, 3, 48, 6, M[4]); p.rect(0, 3, 48, 1, M[6]); for (let x = 3; x < 48; x += 8) p.rect(x, 9, 3, 6 + (x % 16 ? 0 : 4), M[2]); p.rect(20, 9, 8, 3, D.cyan[1]); p.px(23, 13, D.cyan[3]); });
  P.mk('ds_column', 40, 56, 2, (p, f) => { p.rect(14, 10, 12, 46, M[3]); p.rect(14, 10, 1, 46, M[6]); p.rect(10, 50, 20, 6, M[4]); p.rect(12, 6, 16, 4, D.gold[1]); p.rect(16, 16, 8, 18, f ? D.cyan[1] : D.red[1]); for (let y = 18; y < 33; y += 3) p.rect(17, y, 6, 1, f ? D.cyan[3] : D.red[3]); });
  P.mk('ds_rescrys', 20, 34, 3, (p, f) => { p.rect(5, 26, 10, 8, M[3]); p.rect(5, 26, 10, 1, M[6]); const C = f === 0 ? [M[2], M[4], M[5]] : f === 1 ? [D.red[1], D.red[3], D.red[4]] : [D.gold[1], D.gold[2], '#ffffff']; p.ell(10, 15, 7, 10, C[0]); p.ell(10, 15, 5, 8, C[1]); p.ell(9, 12, 2, 3, C[2]); for (let k = 0; k < 3; k++) p.rect(3 + k * 6, 4 + (k % 2) * 4, 2, 22, M[5]); });
  const ic = (n, fn) => P.mk('i_' + n, 10, 10, 1, fn);
  ic('mirror', p => { p.rect(2, 1, 6, 8, M[5]); p.rect(3, 2, 4, 6, D.red[3]); p.px(4, 3, '#ffffff'); });
  ic('skullk', p => { p.sell(5, 4, 3.4, 3.4, D.bone); p.px(4, 4, M[0]); p.px(6, 4, M[0]); p.rect(4, 7, 3, 2, D.bone[2]); });

  // ================= SUPERFICIE INTERIOR (mapa exterior) =================
  for (const st of ['c', 'r']) { const on = st === 'r', L = on ? D.cyan : D.red;
    P.mk('ds_o_grass_' + st, 16, 16, 3, (p, v) => { p.rect(0, 0, 16, 16, M[2]); p.rect(0, 0, 16, 1, M[3]); p.rect(0, 0, 1, 16, M[3]); if (v === 1) p.px(8, 8, L[2]); if (v === 2) { p.rect(3, 3, 4, 4, M[1]); p.px(4, 4, M[5]); } }, { outline: false });
    P.mk('ds_o_water_' + st, 16, 16, 2, (p, f) => { p.rect(0, 0, 16, 16, L[1]); for (let k = 0; k < 4; k++) p.rect((k * 5 + f * 3) % 16, (k * 4) % 16, 4, 1, L[2]); p.px((f * 7) % 16, 8, '#ffffff'); }, { outline: false });
    P.mk('ds_o_tree_' + st, 34, 42, 2, (p, v) => { if (v === 0) { p.rect(15, 8, 4, 33, M[4]); p.rect(15, 8, 1, 33, M[6]); for (let k = 0; k < 3; k++) p.rect(10, 14 + k * 9, 14, 2, M[3]); p.px(17, 6, L[3]); } else { P.DS.truss(p, 17, 41, 17, 6, M[5], 6); p.rect(12, 4, 10, 3, M[4]); p.px(17, 3, L[3]); } });
    P.mk('ds_o_ice_' + st, 16, 16, 2, (p, v) => { p.rect(0, 0, 16, 16, M[3]); for (let k = 0; k < 4; k++) p.rect(1 + k * 4, 5 + v * 4, 2, 2, M[5]); }, { outline: false });
    P.mk('ds_o_cliff_' + st, 16, 16, 3, (p, v) => { p.rect(0, 0, 16, 16, M[1]); for (let x = 0; x < 16; x += 4) p.rect(x, 0, 3, 16, M[2 + (x % 8 ? 1 : 0)]); if (v === 2) { p.rect(0, 0, 16, 2, M[5]); p.px(6, 1, L[3]); } if (v === 1) p.rect(0, 13, 16, 3, M[0]); }, { outline: false });
    P.mk('ds_o_crack_' + st, 16, 16, 2, (p, f) => { p.rect(0, 0, 16, 16, M[2]); for (let x = 0; x < 16; x++) { p.rect(x, 7, 1, 2, L[1]); if ((x + f * 3) % 5 === 0) p.px(x, 7, L[3]); } }, { outline: false });
  }
  P.mk('ds_o_path', 16, 16, 2, (p, v) => { p.rect(0, 0, 16, 16, M[4]); for (let x = (v * 4) % 8; x < 16; x += 8) p.rect(x, 7, 4, 2, D.gold[1]); p.rect(0, 0, 16, 1, M[6]); }, { outline: false });
  P.mk('ds_o_stone', 16, 16, 1, p => { p.rect(0, 0, 16, 16, '#1e1a22'); p.rect(0, 0, 16, 2, D.gold[1]); p.rect(7, 2, 1, 14, '#0c0a0e'); p.px(3, 6, D.red[3]); }, { outline: false });
  P.mk('ds_o_goo', 16, 16, 2, (p, f) => { p.rect(3, 9, 10, 4, M[1]); p.rect(4, 10, 8, 2, D.red[1]); p.px(6 + f * 3, 10, D.red[3]); }, { outline: false });
  P.mk('ds_o_lamp', 10, 16, 2, (p, f) => { p.rect(4, 5, 2, 11, M[4]); p.rect(2, 3, 6, 2, f ? D.cyan[3] : D.cyan[2]); });
  P.mk('ds_o_rock', 16, 16, 1, p => { p.rect(3, 6, 10, 8, M[3]); p.rect(3, 6, 10, 1, M[6]); p.rect(5, 9, 6, 1, M[1]); });
  P.mk('ds_o_pillar', 14, 30, 2, (p, f) => { if (f) { p.rect(3, 22, 8, 8, M[3]); return; } p.rect(4, 4, 6, 26, M[4]); p.rect(4, 4, 1, 26, M[6]); p.rect(2, 2, 10, 3, D.gold[1]); p.px(7, 1, D.red[3]); });
  P.mk('ds_o_house', 44, 38, 2, (p, f) => { p.rect(6, 16, 32, 20, f ? M[4] : M[3]); p.rect(6, 16, 32, 1, M[6]); p.tri(4, 16, 40, 16, 22, 6, f ? '#2a4ac0' : M[2]); p.rect(19, 26, 6, 10, M[0]); if (f) p.rect(20, 27, 4, 3, D.cyan[2]); });
  P.mk('ds_o_flower', 8, 8, 3, (p, v) => { p.rect(3, 4, 2, 4, M[5]); p.px(4, 3, [D.cyan[2], D.gold[2], D.red[3]][v]); });
};
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildDyson(); }; })();

// ================= FONDOS POR NIVEL (Área I · El Dominio Exterior) =================
// Cada escena: cielo + 4 planos con parallax propio + efectos animados entre planos (+ primer plano en levelDraw).
(function () {
  const D = P.DSC, M = D.m, W = 640, H = P.H, mk = () => new P.Painter(W, H), cv = p => p.canvas();
  const SET = P.DS.SETS;
  // MUELLES DE DESEMBARCO: casco exterior de la Esfera hacia el horizonte, marcos de atraque, grúas y contenedores
  SET.dock = () => {
    const r = P.RNG(5101), sky = new P.Painter(P.W, H); P.DS.space(sky, ['#04050c', '#0a0c1e', '#14183a', '#2a1e4a', '#3a2450'], r, { nebY: 60 });
    sky.sell(400, 50, 16, 16, ['#0a2a14', '#1f7a3a', '#5ccf4a', '#c8ffb0']); sky.sell(80, 90, 7, 7, ['#3a1a5a', '#6a3ac0', '#a07aff', '#e8d8ff']); for (let a = 0; a < 6.28; a += 0.02) sky.px(80 + Math.cos(a) * 13, 90 + Math.sin(a) * 3, '#bfe8ff');
    const far = mk(); P.DS.hull(far, W, 176, [M[1], M[2], M[3], M[4]], D.red[3], r); for (let i = 0; i < 6; i++) P.DS.tower(far, 40 + i * 110 + r.int(-20, 20), 178, r.int(5, 9), r.int(40, 80), [M[0], M[1], M[2], M[3], M[4], M[5]], D.red[2], r, { ant: 14 });
    const mid = mk(); for (let i = 0; i < 4; i++) { const x = 30 + i * 165, w = 90, y = 120; mid.rect(x, y, 6, H - y, M[3]); mid.rect(x + w, y, 6, H - y, M[3]); mid.rect(x, y, w + 6, 6, M[4]); mid.rect(x, y, w + 6, 1, M[6]); for (let k = 0; k < 8; k++) mid.px(x + 4 + k * 12, y + 3, k % 2 ? D.red[3] : D.gold[2]); P.DS.truss(mid, x + 3, y + 6, x + w / 2, y + 40, M[4], 4); P.DS.truss(mid, x + w + 3, y + 6, x + w / 2, y + 40, M[4], 4); mid.rect(x + 10, H - 40, w - 14, 4, M[4]); for (let k = 0; k < 6; k++) mid.px(x + 14 + k * 12, H - 41, D.red[3]); }
    const mid2 = mk(); for (let i = 0; i < 9; i++) { const x = i * 72 + r.int(-8, 8), n = r.int(2, 5); for (let k = 0; k < n; k++) P.DS.panel(mid2, x, H - 30 - k * 14, 30, 14, [M[0], M[1], M[2], M[3], M[5]], k % 2 ? D.red[2] : null, r); }
    for (let i = 0; i < 3; i++) { const x = 80 + i * 210; mid2.rect(x, 60, 5, H - 60, M[3]); mid2.rect(x - 60, 56, 90, 6, M[4]); mid2.rect(x - 60, 56, 90, 1, M[6]); mid2.line(x - 50, 62, x - 50, 100, M[5]); mid2.rect(x - 56, 100, 12, 8, M[3]); }
    const near = mk(); for (let i = 0; i < 6; i++) { const x = i * 112 + r.int(-10, 10), h = r.int(40, 70); near.rect(x, H - h, 26, h, M[1]); near.rect(x, H - h, 26, 2, M[3]); near.px(x + 13, H - h + 5, D.red[3]); for (let y = H - h + 10; y < H; y += 8) near.rect(x + 3, y, 20, 1, M[0]); }
    return { sky: sky.canvas(), L: [{ im: cv(far), par: 0.08, y: 0 }, { im: cv(mid), par: 0.22, y: 6 }, { im: cv(mid2), par: 0.4, y: 10 }, { im: cv(near), par: 0.62, y: 12 }],
      fx(L, c, cx, vy, k) { const t = L.t;
        if (k === 0) for (let i = 0; i < 9; i++) { const lane = i % 3, s = 1 + (i % 2), X = ((t * (0.4 + lane * 0.25) + i * 140) % 760) - 120, Y = 40 + lane * 26 + Math.sin(t * 0.01 + i) * 3 + vy * 0.05; P.DS.ship(c, X, Y, s * 0.5 + 0.5, i % 3, i % 4 === 0 ? '#2a3446' : '#1a2030', i % 2 ? '#ff2a4a' : '#5ae0ff', t); }
        if (k === 3) for (let i = 0; i < 3; i++) { const X = Math.round(((80 + i * 210 - cx * 0.4) % W + W) % W) - 40, sw = Math.sin(t * 0.01 + i * 2) * 26, Y = Math.round(100 + vy * 0.4 + 10); c.fillStyle = '#2c3446'; c.fillRect(X + Math.round(sw) - 6, Y, 12, 8); c.fillStyle = '#ff2a4a'; c.fillRect(X + Math.round(sw), Y + 8, 1, 1); }
        if (k === 4) { for (let i = 0; i < 5; i++) { const X = Math.round(((i * 140 - cx * 0.62) % W + W) % W), on = (t + i * 17) % 60 < 30; if (on) P.drawGlow(c, X + 13, H - 50 + vy * 0.62, 10, '#ff2a4a', 0.5); } } } };
  };
  // BATERÍAS DE DEFENSA ORBITAL: cañones colosales en el horizonte, generadores de escudo, radares
  SET.battery = () => {
    const r = P.RNG(5201), sky = new P.Painter(P.W, H); P.DS.space(sky, ['#060408', '#140814', '#2a0e1a', '#4a1424', '#6a2026'], r, { neb: ['#3a0a1a', '#5a1424', '#7a2030'], nebY: 80 });
    for (let y = 0; y < 200; y++) for (let x = 0; x < 170; x++) { const d = Math.hypot(x - 20, (y - 40) * 1.2) / 150; if (d < 1 && P.BAYER4[y & 3][x & 3] / 16 < (1 - d) * 0.6) sky.px(x, y, d < 0.3 ? '#fff4c0' : '#ffb050'); }
    const far = mk(); P.DS.hull(far, W, 184, [M[1], M[2], M[3], M[4]], D.red[3], r); const cannons = [];
    for (let i = 0; i < 3; i++) { const bx = 100 + i * 220, by = 184, a = -1.2 + i * 0.25, len = 140; for (let k = 0; k < len; k++) { const x = bx + Math.cos(a) * k, y = by + Math.sin(a) * k, w = 10 - k / 22; far.rect(Math.round(x - w / 2), Math.round(y - w / 2), Math.round(w), Math.round(w), k % 20 < 2 ? M[5] : M[2]); far.px(Math.round(x - w / 2), Math.round(y - w / 2), M[4]); } far.sell(bx, by - 6, 22, 12, [M[0], M[1], M[3], M[4]]); cannons.push({ x: bx + Math.cos(a) * len, y: by + Math.sin(a) * len, a }); }
    const mid = mk(); const domes = []; for (let i = 0; i < 4; i++) { const x = 60 + i * 160 + r.int(-10, 10), h = r.int(60, 90); P.DS.tower(mid, x, H - 20, 8, h, [M[0], M[1], M[2], M[3], M[4], M[5]], D.red[2], r, { fins: true, ant: 8, taper: 0.4 }); domes.push({ x, y: H - 20 - h - 8 }); }
    const mid2 = mk(); const dishes = []; for (let i = 0; i < 5; i++) { const x = 30 + i * 130, h = r.int(30, 50); mid2.rect(x - 2, H - h, 4, h, M[3]); mid2.rect(x - 10, H - 12, 20, 12, M[2]); dishes.push({ x, y: H - h }); }
    const near = mk(); for (let i = 0; i < 10; i++) { const x = i * 66 + r.int(-6, 6); near.rect(x, H - 24, 40, 24, M[1]); near.rect(x, H - 24, 40, 2, M[3]); for (let k = 0; k < 4; k++) near.rect(x + 3 + k * 10, H - 18, 6, 2, D.gold[0]); }
    return { sky: sky.canvas(), L: [{ im: cv(far), par: 0.1, y: 0 }, { im: cv(mid), par: 0.24, y: 4 }, { im: cv(mid2), par: 0.42, y: 8 }, { im: cv(near), par: 0.64, y: 10 }],
      fx(L, c, cx, vy, k) { const t = L.t;
        if (k === 1) { const off = -((cx * 0.1) % W); cannons.forEach((q, i) => { const ph = (t + i * 70) % 210; if (ph < 26) for (const rep of [off, off + W]) { const x0 = rep + q.x, y0 = q.y + vy * 0.1; P.Energy.laser(c, x0, y0, x0 + Math.cos(q.a) * 300, y0 + Math.sin(q.a) * 300, t, '#ff2a4a', 4 - Math.floor(ph / 8)); if (ph === 0) L.aeFlash = 0.35; } }); }
        if (k === 2) { const off = -((cx * 0.24) % W); for (const d of domes) for (const rep of [off, off + W]) { const X = rep + d.x; if (X < -40 || X > P.W + 40) continue; P.Energy.shield(c, X, d.y + vy * 0.24, 14, t, '#ff5a6a', 0); } }
        if (k === 3) { const off = -((cx * 0.42) % W); for (const d of dishes) for (const rep of [off, off + W]) { const X = Math.round(rep + d.x), Y = Math.round(d.y + vy * 0.42); if (X < -20 || X > P.W + 20) continue; const a = Math.sin(t * 0.02 + d.x) * 0.9, w = Math.round(Math.abs(Math.cos(a)) * 10) + 2; c.fillStyle = '#404a62'; c.fillRect(X - w, Y - 8, w * 2, 3); c.fillStyle = '#8a96b4'; c.fillRect(X - w, Y - 8, w * 2, 1); c.fillStyle = '#ff2a4a'; c.fillRect(X, Y - 10, 1, 2); } }
        if (k === 0) for (let i = 0; i < 24; i++) { const X = ((t * (0.6 + (i % 4) * 0.2) + i * 37) % 560) - 40, Y = 30 + (i * 13) % 90 + Math.sin(t * 0.05 + i) * 4; c.fillStyle = i % 3 ? '#4a5270' : '#ff2a4a'; c.fillRect(Math.round(X), Math.round(Y), 2, 1); } } };
  };
  // FORJA DE LA LEGIÓN: naves de producción, brazos robóticos, cintas con legionarios, coladas de metal fundido
  SET.forge = () => {
    const r = P.RNG(5301), sky = new P.Painter(P.W, H); sky.grad(0, 0, P.W, H, ['#060404', '#120808', '#1e0c0a', '#2e120a', '#401a0c']); for (let i = 0; i < 40; i++) { const x = r.int(0, P.W), y = r.int(0, 120); sky.rect(x, y, r.int(10, 40), 1, '#2a1410'); }
    const far = mk(); for (let i = 0; i < 5; i++) { const x = i * 130 + r.int(0, 20), w = r.int(90, 120), h = r.int(110, 160); far.rect(x, H - h, w, h, M[1]); far.rect(x, H - h, w, 3, M[3]); for (let y = H - h + 12; y < H - 10; y += 14) for (let xx = x + 6; xx < x + w - 6; xx += 10) if (r() < 0.6) far.rect(xx, y, 5, 6, r() < 0.3 ? D.fire[2] : D.fire[1]); far.tri(x, H - h, x + w, H - h, x + w / 2, H - h - 20, M[2]); for (let k = 0; k < 2; k++) far.rect(x + 14 + k * 50, H - h - 40, 8, 40, M[2]); }
    const mid = mk(); const arms = []; for (let i = 0; i < 4; i++) { const x = 70 + i * 160; mid.rect(x - 8, 40, 16, H - 40, M[2]); mid.rect(x - 8, 40, 16, 2, M[4]); mid.rect(x - 30, 30, 60, 10, M[3]); arms.push(x); }
    mid.rect(0, 30, W, 3, M[3]); for (let x = 0; x < W; x += 12) mid.px(x, 31, D.fire[2]);
    const mid2 = mk(); const pours = []; for (let i = 0; i < 3; i++) { const x = 100 + i * 210; mid2.sell(x, H - 70, 26, 18, [M[0], M[1], M[3], M[4]]); mid2.rect(x - 8, H - 56, 16, 56, M[2]); mid2.rect(x - 30, H - 14, 60, 14, M[1]); mid2.rect(x - 26, H - 14, 52, 3, D.fire[2]); pours.push(x); }
    const near = mk(); for (let i = 0; i < 8; i++) { const x = i * 84 + r.int(-10, 10); near.rect(x, 0, 8, H, M[1]); near.rect(x, 0, 2, H, M[3]); for (let y = 10; y < H; y += 30) near.rect(x - 3, y, 14, 4, M[2]); } for (let i = 0; i < 6; i++) { const x0 = r.int(0, W); for (let k = 0; k < 30; k++) near.px(x0 + Math.round(Math.sin(k * 0.4) * 2), k * 3, M[4]); }
    return { sky: sky.canvas(), L: [{ im: cv(far), par: 0.1, y: 0 }, { im: cv(mid), par: 0.25, y: 0 }, { im: cv(mid2), par: 0.42, y: 6 }, { im: cv(near), par: 0.7, y: 0 }],
      fx(L, c, cx, vy, k) { const t = L.t;
        if (k === 2) { const off = -((cx * 0.25) % W); for (const x of arms) for (const rep of [off, off + W]) { const X = rep + x, Y = 40 + vy * 0.25; if (X < -60 || X > P.W + 60) continue; const a = Math.sin(t * 0.03 + x) * 0.8 + 1.4, ex = X + Math.cos(a) * 30, ey = Y + Math.sin(a) * 30; c.fillStyle = '#404a62'; for (let s = 0; s <= 10; s++) c.fillRect(Math.round(X + (ex - X) * s / 10), Math.round(Y + (ey - Y) * s / 10), 3, 3); c.fillRect(Math.round(ex) - 4, Math.round(ey), 8, 3); if ((t + x) % 40 < 4) { P.drawGlow(c, ex, ey + 4, 10, '#ffd166', 0.8); c.fillStyle = '#ffffff'; c.fillRect(Math.round(ex), Math.round(ey) + 4, 1, 1); } }
          // cinta con legionarios recién fabricados
          for (let i = 0; i < 14; i++) { const X = ((t * 0.5 + i * 46 - cx * 0.25) % 640 + 640) % 640 - 40, Y = Math.round(28 + vy * 0.25 - 22); c.fillStyle = '#1c1618'; c.fillRect(Math.round(X), Y + 6, 6, 14); c.fillStyle = '#d8d0b8'; c.fillRect(Math.round(X) + 1, Y + 2, 4, 4); c.fillStyle = '#ff2a4a'; c.fillRect(Math.round(X) + 3, Y + 3, 1, 1); } }
        if (k === 3) { const off = -((cx * 0.42) % W); for (const x of pours) for (const rep of [off, off + W]) { const X = Math.round(rep + x + 18), Y = Math.round(H - 70 + vy * 0.42 + 6); if (X < -30 || X > P.W + 30) continue; P.Energy.fire(c, X, H - 14 + vy * 0.42, 10, 6 + Math.sin(t * 0.2) * 2, t); for (let y = Y; y < H - 14 + vy * 0.42; y++) { c.fillStyle = (y + t) % 4 < 2 ? '#ffd166' : '#ff8a2a'; c.fillRect(X, y, 2, 1); } } }
        if (k === 0 && t % 3 === 0) L.parts.add({ x: L.cam.x + P.rand(0, P.W), y: L.cam.y + P.H, vy: -P.rand(0.5, 1.4), vx: P.rand(-0.3, 0.3), life: 90, col: P.pick(['#ff8a2a', '#ffd166', '#5a1404']), size: 1, glow: 2 }); } };
  };
  // PLATAFORMA DE VIGILANCIA Ω (arena de NÉMESIS): la estrella eclipsada tras el borde de la Esfera y pantallas de vigilancia
  SET.watch = () => {
    const r = P.RNG(5401), sky = new P.Painter(P.W, H); P.DS.space(sky, ['#020206', '#08061a', '#160a2a', '#2a0a2a', '#3a0a22'], r, { neb: ['#2a0a2a', '#4a0a2a', '#6a1a3a'], nebY: 120 });
    for (let a = Math.PI; a < Math.PI * 2; a += 0.004) { const x = 240 + Math.cos(a) * 200, y = 230 + Math.sin(a) * 120; sky.px(x, y, '#fff4c0'); sky.px(x, y - 1, '#ffd166'); sky.px(x, y + 1, '#ff8a2a'); }
    const far = mk(); for (let x = 0; x < W; x++) { const y = Math.round(200 + Math.sin(x * 0.01) * 4); far.rect(x, y, 1, H - y, M[1]); far.px(x, y, M[4]); } P.DS.tower(far, 320, 200, 18, 150, [M[0], M[1], M[2], M[3], M[4], M[5]], D.red[2], r, { fins: true, taper: 0.7, dens: 0.2, ant: 20 }); far.sell(320, 60, 12, 12, [D.red[0], D.red[1], D.red[3], D.red[4]]); far.ell(320, 60, 4, 6, '#000000');
    const mid = mk(); for (let i = 0; i < 4; i++) { const x = 40 + i * 160; mid.rect(x, 110, 70, 44, M[1]); mid.rect(x + 2, 112, 66, 40, D.red[0]); mid.rect(x + 30, 154, 10, H - 154, M[2]); }
    const near = mk(); near.rect(0, H - 30, W, 4, M[4]); near.rect(0, H - 30, W, 1, M[6]); for (let x = 0; x < W; x += 24) { near.rect(x, H - 30, 3, 30, M[3]); near.px(x + 1, H - 29, D.red[3]); }
    return { sky: sky.canvas(), L: [{ im: cv(far), par: 0.08, y: 0 }, { im: cv(mid), par: 0.25, y: 0 }, { im: cv(near), par: 0.6, y: 0 }],
      fx(L, c, cx, vy, k) { const t = L.t;
        if (k === 1) { const off = -((cx * 0.08) % W); for (const rep of [off, off + W]) { const X = rep + 320, Y = 60 + vy * 0.08; P.drawGlow(c, X, Y, 26 + Math.sin(t * 0.05) * 4, '#ff2a4a', 0.5); const lx = Math.sin(t * 0.02) * 4; c.fillStyle = '#ffffff'; c.fillRect(Math.round(X + lx), Math.round(Y - 2), 1, 2); } }
        if (k === 2) { const off = -((cx * 0.25) % W); for (let i = 0; i < 4; i++) for (const rep of [off, off + W]) { const X = Math.round(rep + 40 + i * 160), Y = Math.round(110 + vy * 0.25); if (X < -80 || X > P.W + 10) continue; c.fillStyle = '#ff2a4a'; for (let row = 0; row < 8; row++) { const w = ((t * (1 + i) + row * 23 + i * 7) % 50); c.globalAlpha = 0.55; c.fillRect(X + 6, Y + 6 + row * 4, w, 1); } c.globalAlpha = 0.8; c.fillStyle = '#f4eedc'; c.fillRect(X + 54, Y + 10, 8, 8); c.fillStyle = '#2a040c'; c.fillRect(X + 55, Y + 12, 2, 2); c.fillRect(X + 59, Y + 12, 2, 2); c.globalAlpha = 1; if ((t >> 4) % 4 === i) { c.fillStyle = 'rgba(255,42,74,0.15)'; c.fillRect(X + 2, Y + 2, 66, 40); } } } } };
  };
  P.DS.set = key => P.DS.cache[key] || (P.DS.cache[key] = (SET[key] || SET.dock)());
})();
