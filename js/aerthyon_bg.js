'use strict';
// AERTHYON — fondos: seis capas reales de parallax y efectos animados.
//   1 cielo (sol, rayos, estrellas, bancos de nubes) · 2 montañas suspendidas e islas lejanas · 3 nubes altas que derivan,
//   pieza escénica propia de cada nivel (ciudad celestial, templo, montañas, bosque, columna de aire, tormenta) y criaturas
//   voladoras · 4 islas flotantes con templos, puentes y cascadas que caen al vacío · 5 mar de nubes con agujas de roca ·
//   6 nubes cercanas y polvo luminoso. Relámpagos lejanos que iluminan la escena, rayos de luz y mar de nubes animado.
(function () {
  const A = P.AEC, TW = 640, H = P.H, B4 = P.BAYER4, bay = (x, y) => B4[y & 3][x & 3] / 16;
  P.AE_FALLS = { c: [], r: [] };
  const CLOUD = { r: { day: ['#ffffff', '#e4f0ff', '#b4cdf0', '#7f9fd8'], golden: ['#fff0d8', '#f8c0b0', '#c088b8', '#7a5a9a'], dusk: ['#8ab4f0', '#4a6aac', '#2a3a74', '#18204a'] },
    c: { day: ['#8a90a0', '#6a7084', '#4e5468', '#363a4c'], golden: ['#8a8088', '#6a6270', '#4e4858', '#363242'], dusk: ['#3e4458', '#2e3446', '#202536', '#151926'] } };

  const bgSky = (st, sky) => {
    const on = st === 'r', SK = P.SKIES_A[sky], p = new P.Painter(P.W, H), r = P.RNG((on ? 4202 : 4201) + sky.length);
    p.grad(0, 0, P.W, H, SK[st]);
    if (sky === 'dusk') { for (let i = 0; i < 140; i++) { const y = Math.floor(Math.pow(r(), 1.5) * 150); p.px(r.int(0, P.W), y, on ? P.pick(['#ffffff', '#bff6ff', '#a898ff']) : '#4a5266'); }
      // nebulosa violeta tramada
      for (let y = 10; y < 120; y++) for (let x = 0; x < P.W; x++) { const v = Math.sin(x * 0.02 + y * 0.05) + Math.sin(x * 0.007 - y * 0.03) * 1.2; if (v > 1.1 && bay(x, y) < (v - 1.1) * 0.5) p.px(x, y, on ? (v > 1.6 ? '#4a3a9a' : '#2a2a6a') : '#1a1c26'); } }
    else if (on) { // sol y halo dorado
      const sx = sky === 'golden' ? 120 : 360, sy = sky === 'golden' ? 150 : 56;
      for (let y = sy - 70; y < sy + 70; y++) for (let x = sx - 90; x < sx + 90; x++) { const d = Math.hypot(x - sx, (y - sy) * 1.2) / 80; if (d < 1 && bay(x, y) < (1 - d) * 0.55) p.px(x, y, d < 0.35 ? '#ffffff' : sky === 'golden' ? '#ffe0a0' : '#e8f8ff'); }
      p.ell(sx, sy, 9, 9, '#ffffff');
      // haces de luz entre las nubes
      for (let k = 0; k < 5; k++) { const a = 1.9 + k * 0.32, w = 6 + k * 3; for (let l = 20; l < 260; l++) for (let j = -w; j <= w; j++) { const x = Math.round(sx + Math.cos(a) * l - Math.sin(a) * j), y = Math.round(sy + Math.sin(a) * l + Math.cos(a) * j); if (bay(x, y) < 0.16 * (1 - l / 260)) p.px(x, y, '#ffffff'); } }
    }
    const C = CLOUD[st][sky];
    for (let i = 0; i < 3; i++) P.paintStratus(p, r.int(0, P.W), r.int(28, 90), r.int(110, 190), C, r, { lit: 'top' });
    // grandes torres de cúmulos sobre el horizonte
    for (let i = 0; i < 5; i++) { const w = r.int(70, 130); P.paintCloud(p, r.int(0, P.W), r.int(176, 196), w, Math.round(w * 0.42), C, r, { lit: 'top', rim: sky === 'dusk' && on ? '#bff6ff' : undefined }); }
    return p.canvas();
  };
  const far = st => {
    const on = st === 'r', p = new P.Painter(TW, H), r = P.RNG(on ? 4212 : 4211);
    const C = on ? ['#1a2a5a', '#2a4080', '#46609e', '#6a86c0'] : ['#1a1c26', '#262a36', '#343a4a', '#464e62'], S = on ? ['#a8c4ec', '#e8f4ff'] : ['#4a5266', '#5e6880'];
    const CF = on ? ['#2a3a6a', '#3a5088', '#5a74a8', '#8aa4d4'] : ['#22242e', '#2c303c', '#383d4c', '#4a5062'];
    // cordillera de picos suspendidos (como en la referencia: picos centrales enormes)
    P.Sprites.aePeak(p, 120, 170, 46, 118, CF, S, r, 0.3); P.Sprites.aePeak(p, 160, 176, 58, 140, C, S, r, 0.35); P.Sprites.aePeak(p, 205, 172, 40, 108, C, S, r, 0.3);
    P.Sprites.aePeak(p, 400, 178, 36, 86, CF, S, r, 0.4); P.Sprites.aePeak(p, 440, 182, 30, 70, C, S, r, 0.5);
    P.Sprites.aePeak(p, 560, 176, 42, 98, CF, S, r, 0.35);
    // islas lejanas
    for (let i = 0; i < 7; i++) P.Sprites.aeIsland(p, r.int(0, TW), r.int(70, 150), r.int(8, 18), r.int(6, 14), CF, on ? [A.turq[1], A.turq[2], A.turq[3]] : null, r);
    // bruma de profundidad (más densa abajo)
    for (let y = 150; y < H; y++) for (let x = 0; x < TW; x++) if (bay(x, y) < (y - 150) / 90) p.px(x, y, on ? '#9ec4ee' : '#3a4052');
    return p.canvas();
  };
  const mid = st => {
    const on = st === 'r', p = new P.Painter(TW, H), r = P.RNG(on ? 4222 : 4221), falls = P.AE_FALLS[st] = [];
    const C = on ? ['#232b52', '#36427a', '#5262a2', '#7e90cc', '#b4c4ec'] : ['#14161e', '#1e2230', '#2a3042', '#3a4258', '#4e566c'], G = on ? [A.turq[1], A.turq[2], A.turq[3]] : ['#3a4052', '#525a72', '#727c96'];
    const isles = [[70, 150, 52, 44], [230, 120, 40, 34], [380, 160, 60, 50], [540, 128, 44, 38]];
    isles.forEach(([cx, ty, w, h], i) => {
      P.Sprites.aeIsland(p, cx, ty, w, h, C, G, r, { glow: on ? A.elec[2] : null });
      // templo o torre sobre la isla
      if (i % 2 === 0) { const tx = cx - 14 + r.int(-8, 8); for (let k = 0; k < 4; k++) p.rect(tx + k * 9, ty - 16, 3, 15, on ? '#e4e8f6' : '#4e566c'); p.rect(tx - 2, ty - 18, 33, 3, on ? A.gold[2] : '#5a6280'); p.tri(tx - 2, ty - 18, tx + 31, ty - 18, tx + 14, ty - 28, on ? '#c8cce4' : '#3a4258'); }
      else { const tx = cx + r.int(-10, 10); p.rect(tx, ty - 34, 7, 33, on ? '#e4e8f6' : '#4e566c'); p.rect(tx, ty - 34, 1, 33, '#ffffff'); p.ell(tx + 3, ty - 36, 5, 4, on ? A.gold[2] : '#5a6280'); p.line(tx + 3, ty - 46, tx + 3, ty - 40, on ? A.gold[3] : '#6a7490'); for (let y = ty - 30; y < ty - 4; y += 8) p.rect(tx + 2, y, 3, 3, on ? A.elec[1] : '#2a3042'); }
      // cascada que cae al vacío desde el borde de la isla
      const fx = cx + Math.round(w * (i % 2 ? -0.55 : 0.5)), fy = ty + 2, len = 70 + r.int(0, 50);
      for (let y = fy; y < fy + len; y++) { const t = (y - fy) / len; for (let k = 0; k < 4; k++) if (bay(fx + k, y) > t * 0.9) p.px(fx + k, y, k === 1 || k === 2 ? (on ? '#ffffff' : '#8a94ac') : (on ? '#bfe0ff' : '#5a6280')); }
      falls.push({ x: fx, y0: fy, y1: fy + len });
    });
    // puentes naturales de piedra entre islas
    for (const [a, b] of [[0, 1], [2, 3]]) { const [x0, y0, w0] = isles[a], [x1, y1, w1] = isles[b], xa = x0 + w0 - 6, xb = x1 - w1 + 6; for (let x = xa; x <= xb; x++) { const t = (x - xa) / (xb - xa), y = Math.round(y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * 10); p.rect(x, y, 1, 4, C[2]); p.px(x, y, C[4]); p.px(x, y + 4, C[1]); } }
    return p.canvas();
  };
  const near = st => {
    const on = st === 'r', p = new P.Painter(TW, H), r = P.RNG(on ? 4232 : 4231), C = on ? ['#ffffff', '#e4f0ff', '#b8d0f0', '#88a8dc'] : ['#7a8090', '#5a6072', '#444a5c', '#30354a'];
    // agujas de roca que salen del mar de nubes
    for (let i = 0; i < 5; i++) { const x = 40 + i * 130 + r.int(-20, 20), h = r.int(40, 90), w = r.int(9, 16); for (let y = 0; y < h; y++) { const ww = w * (1 - y / h) ** 0.8 + 1; for (let k = Math.round(-ww); k <= Math.round(ww); k++) p.px(x + k, H - 30 - y, k < -ww * 0.4 ? (on ? '#3a4a80' : '#262a36') : (on ? '#1c2448' : '#16181f')); } }
    // mar de nubes
    for (let i = 0; i < 12; i++) { const w = r.int(60, 110); P.paintCloud(p, i * 56 + r.int(-10, 10), H - 8 + r.int(-4, 4), w, Math.round(w * 0.3), C, r, { lit: 'top' }); }
    for (let x = 0; x < TW; x++) for (let y = H - 10; y < H; y++) p.px(x, y, C[2]);
    return p.canvas();
  };
  // piezas escénicas de cada nivel
  const SET = {
    peaks: (p, r, on) => { const C = on ? ['#24346a', '#34509a', '#5476c0', '#86a8e4'] : ['#1c1e28', '#282c3a', '#363c50', '#4a5268'], S = on ? ['#c8dcf8', '#ffffff'] : ['#56607a', '#6a748e']; P.Sprites.aePeak(p, 90, 160, 44, 120, C, S, r, 0.5); P.Sprites.aePeak(p, 150, 166, 56, 150, C, S, r, 0.45); P.Sprites.aePeak(p, 210, 162, 42, 116, C, S, r, 0.5); },
    city: (p, r, on) => { const C = on ? ['#2a3460', '#3e4c84', '#5c6ea8', '#8a9cd0'] : ['#1a1c26', '#262a38', '#343a4c', '#454c62'], W = on ? '#e4e8f6' : '#4e566c', Wd = on ? '#b8bcd4' : '#3a4052', L = on ? A.elec[2] : '#2a3042';
      P.Sprites.aeIsland(p, 130, 120, 110, 50, C, null, r, { root: C[0], glow: on ? A.elec[2] : null });
      for (let k = 0; k < 9; k++) { const x = 34 + k * 22 + r.int(-4, 4), h = 24 + r.int(0, 50) + (k === 4 ? 40 : 0), w = k === 4 ? 16 : 10; p.rect(x, 120 - h, w, h, k % 2 ? W : Wd); p.rect(x, 120 - h, 1, h, '#ffffff'); for (let y = 120 - h + 5; y < 116; y += 7) p.rect(x + 3, y, w - 6, 2, L); p.ell(x + w / 2, 120 - h, w / 2 + 1, 4, on ? A.gold[2] : '#5a6280'); p.line(x + w / 2, 120 - h - 12, x + w / 2, 120 - h - 4, on ? A.gold[3] : '#6a7490'); }
      for (let x = 20; x < 240; x++) p.px(x, 96 + Math.round(Math.sin(x * 0.05) * 3), on ? '#ffffff' : '#5a6280'); },
    temple: (p, r, on) => { const C = on ? ['#2a3460', '#3e4c84', '#5c6ea8', '#8a9cd0'] : ['#1a1c26', '#262a38', '#343a4c', '#454c62'], W = on ? '#e4e8f6' : '#4e566c';
      P.Sprites.aeIsland(p, 120, 128, 96, 40, C, on ? [A.turq[1], A.turq[2], A.turq[3]] : null, r);
      for (let k = 0; k < 4; k++) p.rect(40 + k * 12, 128 - (k + 1) * 9, 160 - k * 24, 9, k % 2 ? W : (on ? '#c8cce4' : '#3a4052'));
      for (let k = 0; k < 6; k++) { p.rect(70 + k * 18, 70, 5, 22, W); p.rect(70 + k * 18, 70, 1, 22, '#ffffff'); } p.rect(64, 66, 108, 5, on ? A.gold[2] : '#5a6280'); p.tri(64, 66, 172, 66, 118, 44, on ? '#c8cce4' : '#3a4258');
      for (let k = 0; k <= 30; k++) { const a = Math.PI * k / 30; p.px(118 + Math.cos(a) * 46, 30 - Math.sin(a) * 26 + 20, on ? A.gold[2] : '#5a6280'); } p.ell(118, 54, 4, 4, on ? A.elec[1] : '#2a3042'); },
    forest: (p, r, on) => { const C = on ? ['#2a3460', '#3e4c84', '#5c6ea8', '#8a9cd0'] : ['#1a1c26', '#262a38', '#343a4c', '#454c62'], L = on ? A.vio : ['#1e2230', '#2a2e3e', '#3a4052', '#4e566c', '#5a627a'];
      for (const [cx, ty, w] of [[60, 130, 50], [170, 110, 60], [250, 140, 34]]) { P.Sprites.aeIsland(p, cx, ty, w, 30, C, on ? [A.turq[1], A.turq[2], A.turq[3]] : null, r); for (let k = 0; k < 3; k++) { const tx = cx - w * 0.5 + k * w * 0.5; let x = tx, y = ty; for (let i = 0; i < 40; i++) { x += Math.sin(i * 0.1 + k) * 0.6; y -= 1.4; p.px(x, y, on ? '#c8cce4' : '#3a4052'); p.px(x + 1, y, on ? '#9aa0c4' : '#2a3042'); } for (let j = 0; j < 9; j++) { const a = -Math.PI / 2 + (j - 4) * 0.36; let fx = x, fy = y; for (let i = 0; i < 16; i++) { fx += Math.cos(a); fy += Math.sin(a) * 0.7 + i * 0.06; p.px(fx, fy, L[2 + (i % 2)]); } } } } }
  };
  // aves celestes lejanas (bandadas que cruzan el cielo)
  const buildExtra = () => {
    P.mk('ae_skybird', 12, 7, 2, (p, f) => { p.line(0, f ? 1 : 4, 5, 3, '#e8f0ff'); p.line(11, f ? 1 : 4, 6, 3, '#e8f0ff'); p.px(5, 3, '#ffffff'); p.px(6, 3, '#ffffff'); });
    for (const st of ['c', 'r']) { const on = st === 'r';
      P.mk('ae_cloud_' + st, 180, 84, 6, (p, f) => P.paintCloud(p, 90, 70, [150, 118, 136, 100, 146, 112][f], [40, 32, 46, 28, 36, 30][f], on ? ['#ffffff', '#e8f2ff', '#bcd2f2', '#8aa6d8'] : ['#7a8090', '#5e6476', '#464c5e', '#323748'], P.RNG(4250 + f * 7 + (on ? 3 : 0)), { lit: 'top' }), { outline: false });
      P.mk('ae_cloudS_' + st, 100, 46, 4, (p, f) => P.paintCloud(p, 50, 38, [78, 64, 84, 70][f], [18, 15, 20, 16][f], on ? ['#e8f2ff', '#c4d8f4', '#98b4e0', '#6a86c0'] : ['#5a6072', '#464c5e', '#363b4c', '#282c3a'], P.RNG(4270 + f * 5 + (on ? 3 : 0)), { lit: 'top' }), { outline: false });
      for (const k in SET) { const p = new P.Painter(260, 200); SET[k](p, P.RNG(4300 + k.length * 13), on); P.mkCanvas('ae_set_' + k + '_' + st, [p.canvas()]); }
      // textura del mar de nubes (periódica cada 64 px)
      const p = new P.Painter(128, 32), C = on ? ['#ffffff', '#eef5ff', '#d4e4fa', '#b4cdf0', '#90b0e0'] : ['#8a90a0', '#6e7488', '#5a6072', '#464c5e', '#363b4c'];
      for (let y = 0; y < 32; y++) for (let x = 0; x < 64; x++) { const v = Math.sin(x * 0.2 + y * 0.3) * 0.5 + Math.sin(x * 0.098 * 2 - y * 0.2) * 0.5 + (y < 16 ? -y / 16 : 0.4); const i = Math.max(0, Math.min(4, Math.floor((v + 1.2) * 1.6 + bay(x, y) * 0.8))); p.px(x, y, C[i]); p.px(x + 64, y, C[i]); }
      P.mkCanvas('ae_cloudtex_' + st, [p.canvas()]);
    }
  };
  const base = P.Sprites.buildAerthyon;
  P.Sprites.buildAerthyon = function () {
    base();
    for (const sky in P.SKIES_A) for (const st of ['c', 'r']) P.mkCanvas('ae_bg_sky_' + st + '_' + sky, [bgSky(st, sky)]);
    for (const st of ['c', 'r']) { P.mkCanvas('ae_bg_far_' + st, [far(st)]); P.mkCanvas('ae_bg_mid_' + st, [mid(st)]); P.mkCanvas('ae_bg_near_' + st, [near(st)]); }
    // cueva (por si algún tramo usa el tema): interior de una montaña con cristales
    { const p = new P.Painter(TW, H), r = P.RNG(4251); p.grad(0, 0, TW, H, ['#060a1a', '#0e1630', '#162248', '#060a1a']); for (let i = 0; i < 40; i++) { const x = r.int(0, TW), y = r.int(20, H - 20); p.tri(x - 3, y + 8, x + 3, y + 8, x, y - r.int(4, 12), P.pick(A.elec)); } P.mkCanvas('ae_bg_cave', [p.canvas()]); }
    buildExtra();
  };

  const CLD = (() => { const r = P.RNG(4290), a = []; for (let i = 0; i < 7; i++) a.push({ x: i * 190 + r.int(0, 80), y: r.int(6, 60), f: i % 4, b: 0 }); for (let i = 0; i < 5; i++) a.push({ x: i * 260 + r.int(0, 90), y: r.int(150, 200), f: i % 6, b: 1 }); return a; })(), WR = 1320;
  // fuerza de la tormenta según el nivel y el momento (cambia de intensidad)
  P.aeStorm = L => { const base = L.def.storm != null ? L.def.storm : (L.sky === 'dusk' ? 0.6 : 0); return Math.max(0, Math.min(1, base + Math.sin(L.t * 0.004) * 0.25 + (L.boss && L.boss.storm ? L.boss.storm : 0))); };
  P.ART.aerthyon.bgFx = function (L, c, cx, vy, k, st, a) {
    const t = L.t, on = st === 'r', storm = P.aeStorm(L);
    if (k === 0) {
      if (st === 'c') L._aeRf = L.restoredFrac();
      // relámpagos lejanos (iluminan toda la escena un instante)
      if (storm > 0.05) { const per = Math.round(200 - storm * 120), ph = t % per, seed = Math.floor(t / per); if (ph < 8 && (seed % 3 !== 0 || storm > 0.5)) { const r = P.RNG(seed * 31), x = r.int(40, P.W - 40); c.globalAlpha = a * (1 - ph / 8); P.aeBolt(c, x, -4, x + r.int(-50, 50), r.int(110, 190), seed, ph < 3 ? '#ffffff' : A.elec[2], 2, 3); P.drawGlow(c, x, 60, 90, '#bff6ff', 0.35 * a * (1 - ph / 8)); if (ph === 0) L.aeFlash = Math.max(L.aeFlash || 0, 0.5 + storm * 0.5); } }
      for (const q of CLD) { if (q.b) continue; const im = P.S['ae_cloudS_' + st].f[q.f], X = ((q.x - cx * 0.035 - t * (0.05 + storm * 0.15)) % WR + WR) % WR - 110; if (X > P.W) continue; c.globalAlpha = a * 0.85; c.drawImage(im, Math.round(X), Math.round(q.y + vy * 0.05)); }
    } else if (k === 1) {
      // pieza escénica del nivel
      const set = L.def.set; if (set) { const im = P.S['ae_set_' + set + '_' + st]; if (im) { const X = Math.round(((L.def.setX || 140) - cx * 0.16) % 900), Y = Math.round(40 + vy * 0.16 + Math.sin(t * 0.01) * 2); c.globalAlpha = a; c.drawImage(im.f[0], X < -260 ? X + 900 : X, Y); } }
      if (L.def.column) { // gran columna de aire que gira
        const X = Math.round(((L.def.setX || 300) - cx * 0.18) % 900); for (let y = 0; y < H; y += 3) { const w = 26 + Math.sin(y * 0.03 + t * 0.03) * 6, x = X + Math.sin(y * 0.05 - t * 0.06) * 8; c.globalAlpha = a * 0.16; c.fillStyle = on ? '#e8f4ff' : '#8a90a0'; c.fillRect(Math.round(x - w), y, Math.round(w * 2), 2); c.globalAlpha = a * 0.5; c.fillRect(Math.round(x + Math.sin(y * 0.2 + t * 0.15) * w), y, 2, 1); } }
      if (set === 'storm' || L.def.stormColumn) { // columna de tormenta con su propio rayo
        const X = Math.round(((L.def.setX || 320) - cx * 0.18) % 900); c.globalAlpha = a; for (let i = 0; i < 9; i++) { const im = P.S['ae_cloudS_' + st].f[i % 4]; c.drawImage(im, Math.round(X - 50 + Math.sin(i * 1.3 + t * 0.01) * 14), Math.round(-10 + i * 18)); }
        if (t % 70 < 6) { c.globalAlpha = a; P.aeBolt(c, X, 140, X + ((t / 70 | 0) % 2 ? 30 : -30), 230, t / 70 | 0, '#ffffff', 1, 2); P.drawGlow(c, X, 150, 60, '#bff6ff', 0.4 * a); } }
      // bandadas de aves celestes
      for (let i = 0; i < 3; i++) { const X = ((t * (0.22 + i * 0.07) + i * 420 - cx * 0.1) % 1200 + 1200) % 1200 - 100; if (X > P.W + 40) continue; for (let j = 0; j < 4 + i; j++) { c.globalAlpha = a * 0.8; c.drawImage(P.S.ae_skybird.f[((t >> 3) + j) % 2], Math.round(X - j * 10 + (j % 2) * 4), Math.round(50 + i * 26 + Math.sin(t * 0.02 + j) * 3 + (j % 2) * 5 + vy * 0.1)); } }
    } else if (k === 2) {
      // cascadas que caen al vacío
      const off = -((cx * 0.3) % TW), yo = vy * 0.25 + 22;
      for (const f of P.AE_FALLS[st]) for (const rep of [off, off + TW]) { const X = Math.round(rep + f.x); if (X < -10 || X > P.W + 10) continue; const len = f.y1 - f.y0, y0 = Math.round(f.y0 + yo);
        c.globalAlpha = a; c.fillStyle = on ? '#ffffff' : '#a0a8bc'; for (let j = 0; j < len * 0.8; j += 5) c.fillRect(X + (j % 4), y0 + ((j + t * 1.2) % (len * 0.8)), 1, 3);
        for (let m = 0; m < 3; m++) { const ph = (t * 0.01 + m / 3) % 1; c.globalAlpha = a * (1 - ph) * 0.5; c.fillRect(Math.round(X + 1 + Math.sin(m * 2 + t * 0.03) * 6), Math.round(y0 + len * 0.7 + ph * 30), 3, 2); } }
    } else if (k === 3) {
      // nubes cercanas que derivan
      for (const q of CLD) { if (!q.b) continue; const im = P.S['ae_cloud_' + st].f[q.f], X = ((q.x - cx * 0.7 - t * (0.12 + storm * 0.3)) % WR + WR) % WR - 190; if (X > P.W) continue; c.globalAlpha = a * 0.9; c.drawImage(im, Math.round(X), Math.round(q.y + vy * 0.5)); }
      // rayos de luz que atraviesan las nubes
      if (on && L.sky !== 'dusk' && storm < 0.5) { c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 4; i++) { const x0 = ((i * 150 - cx * 0.2 + Math.sin(t * 0.004 + i) * 30) % 640 + 640) % 640 - 80, g = c.createLinearGradient(x0, 0, x0 - 90, H); g.addColorStop(0, 'rgba(255,255,240,0.13)'); g.addColorStop(1, 'rgba(255,255,240,0)'); c.fillStyle = g; c.globalAlpha = a * (0.6 + Math.sin(t * 0.01 + i * 2) * 0.4); c.beginPath(); c.moveTo(x0, 0); c.lineTo(x0 + 26, 0); c.lineTo(x0 - 60, H); c.lineTo(x0 - 120, H); c.fill(); } c.globalCompositeOperation = 'source-over'; }
    }
    c.globalAlpha = a; c.globalCompositeOperation = 'source-over';
  };
  // mar de nubes animado (las casillas «~» de AERTHYON)
  P.ART.aerthyon.liqAlpha = 0.94;
  P.ART.aerthyon.drawLiquid = function (L, c, X, Y, tx, ty, st) {
    const t = L.t, im = P.S['ae_cloudtex_' + st].f[0], on = st === 'r';
    if (L.tile(tx, ty - 1) === '~') { const sx = (((tx * 16 + Math.floor(t * 0.15)) % 64) + 64) % 64; c.drawImage(im, sx, 16, 16, 16, X, Y, 16, 16); return; }
    const sx = (((tx * 16 + Math.floor(t * 0.25)) % 64) + 64) % 64; c.drawImage(im, sx, 0, 16, 12, X, Y + 4, 16, 12);
    for (let i = 0; i < 16; i++) { const wx = tx * 16 + i, h = Math.max(0, Math.min(4, Math.round(2 + Math.sin(wx * 0.22 + t * 0.03) * 1.6 + Math.sin(wx * 0.09 - t * 0.02) * 0.8))); c.fillStyle = on ? '#eef5ff' : '#6e7488'; c.fillRect(X + i, Y + h, 1, 4 - h); c.fillStyle = on ? '#ffffff' : '#8a90a0'; c.fillRect(X + i, Y + h, 1, 1); }
  };
})();
