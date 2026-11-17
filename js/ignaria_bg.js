'use strict';
// IGNÁRIA — fondos de alta calidad y magma real.
// · Capas: cielo con estrellas y bruma · nubes de humo con volumen (dos bandas que derivan) · cordillera lejana ·
//   volcanes sombreados con barrancos y ríos de lava · penacho de humo y bombas de lava animados · montañas medias con
//   columnas de basalto y cascadas de lava que fluyen · río de magma con placas de costra, brillo y distorsión de calor.
// · Lava: opaca, animada (costra que fluye, oleaje, burbujas que revientan, chispas) y siempre quema (ver entities.js).
(function () {
  const I = P.IGC, TW = 640, H = P.H, TS = 16, B4 = P.BAYER4;
  I.lavaDim = ['#2a0804', '#5a1606', '#94300c', '#c8561a', '#e88a3a'];
  // el magma contaminado ya no parece agua turbia: es lava apagada, pero lava
  P.PAL.ignaria.c.liq = ['#2a0804', '#5a1606', '#a83a0c', '#e8701e'];
  P.IG_FALLS = { c: [], r: [] }; P.IG_RIVER = { c: [], r: [] };
  const bay = (x, y) => B4[y & 3][x & 3] / 16;
  const LVof = st => st === 'r' ? I.lava : I.lavaDim;
  const pick = (C, s, x, y) => C[Math.max(0, Math.min(C.length - 1, Math.floor((s + (bay(x, y) - 0.5) * 0.22) * C.length)))];

  // ---------- volcán detallado: barrancos, crestas iluminadas, ríos de lava y cráter incandescente ----------
  const volcano = (p, cx, by, w, h, on, LV, r, erupt) => {
    const C = on ? ['#100508', '#1a090d', '#281014', '#3a1a1c', '#522824'] : ['#0c0a0a', '#151212', '#1e1918', '#2a2321', '#382e2b'];
    const seed = r.range(0, 10), tw = 8 + w * 0.06, rows = [];
    for (let y = 0; y <= h; y++) { const t = y / h; rows.push(tw + (w - tw) * Math.pow(t, 1.3) + Math.sin(y * 0.35 + seed) * 1.1 + Math.sin(y * 0.09 + seed * 2) * 2.5 * t); }
    for (let y = 0; y <= h; y++) {
      const ww = rows[y], t = y / h, Y = by - h + y;
      for (let x = Math.round(-ww); x <= Math.round(ww); x++) {
        const u = x / ww, g = Math.sin(u * 10 + seed + y * 0.05 + Math.sin(y * 0.08) * 0.6);
        let s = 0.62 - u * 0.32 + t * 0.12;
        if (g > 0.82) s -= 0.3; else if (g > 0.6) s += 0.14;
        if (u < -0.94) s = 0.95;
        p.px(cx + x, Y, pick(C, Math.max(0, Math.min(0.999, s)), cx + x, Y));
      }
    }
    // ríos de lava que bajan por las laderas (más vivos en el volcán activo)
    const nR = erupt ? 3 : 1;
    for (let k = 0; k < nR; k++) {
      let rel = r.range(-0.55, 0.55); const len = Math.round(h * r.range(erupt ? 0.75 : 0.45, erupt ? 1 : 0.7));
      for (let y = 1; y < len; y++) {
        rel += r.range(-0.03, 0.03); rel = P.clamp(rel, -0.85, 0.85);
        const x = Math.round(cx + rel * rows[y]), Y = by - h + y, ww = y < len * 0.3 ? 1 : 2;
        p.px(x, Y, LV[y < len * 0.5 ? 3 : 2]); if (ww > 1) p.px(x + 1, Y, LV[1]);
        if (y % 3 === 0) p.px(x - 1, Y, LV[1]);
        if (on && y < 12) p.px(x, Y, LV[4]);
      }
      const ex = Math.round(cx + rel * rows[len - 1]), ey = by - h + len; p.ell(ex, ey, 4, 1.4, LV[1]); p.ell(ex, ey, 2, 0.8, LV[2]);
    }
    // cráter
    p.ell(cx, by - h + 1, tw + 1, 2.4, C[0]); p.ell(cx, by - h + 1, tw - 1, 1.6, LV[erupt ? 3 : 1]); if (erupt) p.ell(cx, by - h + 1, tw - 4, 0.9, LV[4]);
    for (let x = -tw; x <= tw; x++) if ((x & 1) === 0) p.px(cx + x, by - h - 1, LV[1]);
  };

  // ---------- cielo: degradado, estrellas que se apagan hacia el horizonte, velos de ceniza tramados, resplandor ----------
  const bgSky = (st, sky) => {
    const on = st === 'r', SK = P.SKIES_I[sky], p = new P.Painter(P.W, H), r = P.RNG(on ? 2102 : 2101);
    p.grad(0, 0, P.W, H, SK[st]);
    for (let i = 0; i < 130; i++) { const y = Math.floor(Math.pow(r(), 1.7) * 130), x = r.int(0, P.W); if (r() < y / 150) continue; p.px(x, y, on ? (y < 50 ? P.pick(['#ffffff', '#ffe8d0', '#ffd166']) : '#c08070') : (y < 50 ? '#8a7e78' : '#4e4440')); }
    for (let i = 0; i < 5; i++) { const x = r.int(10, P.W - 10), y = r.int(8, 70); p.px(x, y, '#ffffff'); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) p.px(x + dx, y + dy, on ? '#ffd8b0' : '#8a7a70'); if (i < 2) for (const [dx, dy] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) p.px(x + dx, y + dy, on ? '#a06050' : '#4a403c'); }
    // velos de ceniza (bandas onduladas con trama, efecto de transparencia en pixel art)
    const VC = on ? ['#5a1a2a', '#7a2a2e', '#a03a2a'] : ['#2a2422', '#342c2a', '#3e3532'];
    for (let b = 0; b < 3; b++) { const base = 70 + b * 28, th = 7 + b * 2, ph = r.range(0, 6);
      for (let x = 0; x < P.W; x++) { const yc = base + Math.sin(x * 0.018 + ph) * 8 + Math.sin(x * 0.006 + b) * 12; for (let y = Math.round(yc - th); y <= yc + th; y++) { const t = 1 - Math.abs(y - yc) / th; if (bay(x, y) < t * 0.42) p.px(x, y, VC[b]); } } }
    // resplandor del horizonte (la lava ilumina el cielo desde abajo)
    const GC = on ? (sky === 'dusk' ? ['#8a1a1a', '#c0381a', '#ff6a2a'] : ['#c04a2a', '#ff7a3a', '#ffb060']) : ['#3a2e2a', '#463a34', '#54463e'];
    for (let y = 168; y < H; y++) { const t = (y - 168) / (H - 168); for (let x = 0; x < P.W; x++) if (bay(x, y) < t * 0.7) p.px(x, y, GC[Math.min(2, Math.floor(t * 3))]); }
    // estratos lejanos iluminados desde abajo
    const SC = on ? ['#ff9a5a', '#c04a3a', '#7a2434', '#4a1428'] : ['#5a4c46', '#463a36', '#342c2a', '#262020'];
    for (let i = 0; i < 3; i++) P.paintStratus(p, r.int(0, P.W), r.int(136, 158), r.int(110, 190), SC, r, { lit: 'bottom', rim: on ? '#ffc070' : '#6a5a52' });
    return p.canvas();
  };

  // ---------- capa lejana: cordillera brumosa + tres volcanes ----------
  const far = st => {
    const on = st === 'r', p = new P.Painter(TW, H), r = P.RNG(on ? 2112 : 2111), LV = LVof(st);
    const HZ = on ? ['#2e0e1c', '#220a16', '#1a0810', '#12060c'] : ['#262020', '#1e1a1a', '#181414', '#121010'];
    let g = 40; for (let x = 0; x < TW; x++) { g += r.range(-1.5, 1.5) + Math.sin(x * 0.013) * 0.5; g = P.clamp(g, 18, 72); const top = Math.round(H - 64 - g); for (let y = top; y < H; y++) p.px(x, y, y === top ? HZ[1] : HZ[0]); }
    volcano(p, 170, H - 44, 118, 132, on, LV, r, true);
    volcano(p, 445, H - 44, 84, 92, on, LV, r, false);
    volcano(p, 585, H - 44, 60, 108, on, LV, r, false);
    for (let x = 0; x < TW; x++) { const yb = H - 47 + Math.round(Math.sin(x * 0.03) * 3 + Math.sin(x * 0.11)); p.px(x, yb, HZ[1]); for (let y = yb + 1; y < H; y++) p.px(x, y, bay(x, y) < (y - yb) / 30 ? HZ[3] : HZ[2]); }
    return p.canvas();
  };

  // ---------- capa media: montañas negras con caras iluminadas, columnas de basalto y cascadas de lava ----------
  const mid = st => {
    const on = st === 'r', p = new P.Painter(TW, H), r = P.RNG(on ? 2122 : 2121), LV = LVof(st);
    const RK = on ? ['#0a0507', '#130809', '#1e0d0d', '#2e1411', '#4a1e14'] : ['#0a0909', '#121010', '#1a1616', '#241e1d', '#302826'];
    const prof = []; let g = 64;
    for (let x = 0; x < TW; x++) { g += r.range(-2.4, 2.4) + (x % 53 === 0 ? r.range(-18, 18) : 0); g = P.clamp(g, 32, 112); prof.push(Math.round(H - 22 - g)); }
    for (let x = 0; x < TW; x++) {
      const sl = prof[(x + 1) % TW] - prof[x], top = prof[x];
      for (let y = top; y < H; y++) {
        const d = (y - top) / (H - top); let s = 0.42 + (sl < 0 ? 0.18 : sl > 0 ? -0.16 : 0) - d * 0.12;
        if (((x * 13 + Math.floor(y / 6) * 7) % 29) === 0) s -= 0.2;
        let col = pick(RK, Math.max(0, Math.min(0.999, s)), x, y);
        if (y > H - 46 && bay(x, y) < (y - (H - 46)) / 46 * 0.55) col = on ? '#3a120c' : '#2a1e1a'; // la lava ilumina las faldas
        p.px(x, y, col);
      }
      p.px(x, top, RK[4]); if (sl < 0 && on) p.px(x, top + 1, '#5a2414');
    }
    if (on) for (let i = 0; i < 18; i++) P.Sprites.igCracks(p, r.int(0, TW), r.int(H - 120, H - 30), 10, 8, P.pick([LV[1], LV[2]]), r, 1);
    // columnas de basalto hexagonales
    for (let i = 0; i < 7; i++) { const x0 = r.int(0, TW - 20), n = r.int(3, 5);
      for (let k = 0; k < n; k++) { const x = x0 + k * 4, hh = r.int(16, 46), top = H - 20 - hh; p.rect(x, top, 4, hh + 20, RK[2]); p.rect(x, top, 1, hh + 20, RK[3]); p.rect(x + 3, top, 1, hh + 20, RK[0]); p.rect(x, top, 4, 1, RK[4]); p.px(x + 1, top, on ? '#7a3018' : '#3e3430'); } }
    // cascadas de lava (la animación las hace fluir)
    const falls = P.IG_FALLS[st] = [];
    for (let i = 0; i < 6; i++) { const x = 30 + i * 104 + r.int(-18, 18), y0 = prof[x] + r.int(3, 12), y1 = H - 22 + r.int(-3, 3); if (y1 - y0 < 16) continue;
      for (let y = y0; y < y1; y++) { p.px(x, y, LV[1]); p.px(x + 1, y, LV[2]); p.px(x + 2, y, LV[1]); }
      p.ell(x + 1, y1, 6, 1.6, LV[1]); p.ell(x + 1, y1, 3, 1, LV[2]); falls.push({ x, y0, y1 }); }
    return p.canvas();
  };

  // ---------- capa cercana: río de magma con placas de costra y rocas en primer plano ----------
  const near = st => {
    const on = st === 'r', p = new P.Painter(TW, H), r = P.RNG(on ? 2132 : 2131), LV = LVof(st), surf = P.IG_RIVER[st] = [];
    for (let x = 0; x < TW; x++) { const y = Math.round(H - 19 + Math.sin(x * 0.05) * 2.5 + Math.sin(x * 0.0123 * 2) * 2); surf.push(y);
      for (let yy = y; yy < H; yy++) { const t = (yy - y) / (H - y); p.px(x, yy, t < 0.25 ? (bay(x, yy) < t * 4 ? LV[2] : LV[3]) : (bay(x, yy) < (t - 0.25) * 1.4 ? LV[1] : LV[2])); }
      p.px(x, y, on ? LV[4] : LV[3]); }
    const CR = on ? ['#1a0806', '#2e0e08'] : ['#140a08', '#22100a'];
    for (let k = 0; k < 34; k++) { const x = r.int(0, TW), y = surf[x] + r.int(3, 14), w = r.int(3, 8); p.ell(x, y, w, 1.4, CR[1]); p.ell(x - 1, y, w - 2, 0.8, CR[0]); p.px(x - w, y, LV[3]); p.px(x + w - 1, y, LV[3]); }
    // rocas y agujas de obsidiana en la orilla, iluminadas por el río desde abajo
    for (let i = 0; i < 11; i++) { const x = r.int(0, TW), hh = r.int(10, 30), w = r.int(5, 12);
      p.tri(x - w, H, x + w, H, x + r.int(-3, 3), H - hh, '#070404');
      for (let k = 0; k < 4; k++) { p.px(x - w + k, H - 1 - k * 2, LV[1]); p.px(x + w - k - 1, H - 1 - k * 2, LV[1]); } }
    return p.canvas();
  };

  // ---------- texturas de lava (periódicas cada 64 px: costra con vetas arriba, magma fundido abajo) ----------
  const lavaTex = st => {
    const on = st === 'r', p = new P.Painter(128, 32), LV = LVof(st), r = P.RNG(on ? 2142 : 2141), CR = on ? ['#1e0806', '#3a1008', '#5a1a0a'] : ['#160806', '#2a0e08', '#3e1408'];
    for (const [y0, n] of [[0, 9], [16, 7]]) {
      const S = []; for (let i = 0; i < n; i++) S.push([r.range(0, 64), r.range(0, 16)]);
      for (let y = 0; y < 16; y++) for (let x = 0; x < 64; x++) {
        let d1 = 99, d2 = 99; for (const [sx, sy] of S) for (const ox of [-64, 0, 64]) for (const oy of [-16, 0, 16]) { const d = Math.hypot(x - sx - ox, (y - sy - oy) * 1.6); if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d; }
        const e = d2 - d1; let col;
        if (y0 === 0) col = y < 2 ? LV[3] : e < 1.1 ? (bay(x, y) < 0.5 ? LV[3] : LV[4]) : e < 2.2 ? LV[2] : d1 < 3 ? CR[0] : CR[(d1 > 6) ? 2 : 1];
        else col = e < 1.2 ? LV[3] : e < 2.6 ? LV[2] : bay(x, y) < Math.min(1, d1 / 9) ? LV[1] : LV[2];
        p.px(x, y0 + y, col); p.px(x + 64, y0 + y, col);
      }
    }
    return p.canvas();
  };

  const base = P.Sprites.buildIgnaria;
  P.Sprites.buildIgnaria = function () {
    base();
    for (const sky in P.SKIES_I) for (const st of ['c', 'r']) P.mkCanvas('ig_bg_sky_' + st + '_' + sky, [bgSky(st, sky)]);
    for (const st of ['c', 'r']) {
      const on = st === 'r';
      P.mkCanvas('ig_bg_far_' + st, [far(st)]); P.mkCanvas('ig_bg_mid_' + st, [mid(st)]); P.mkCanvas('ig_bg_near_' + st, [near(st)]); P.mkCanvas('ig_lavatex_' + st, [lavaTex(st)]);
      const CB = on ? ['#ffb060', '#e0603a', '#a03a3a', '#5a1e30', '#2e0e22'] : ['#7a6a60', '#5a4c46', '#423834', '#2e2624', '#1e1818'];
      const CF = on ? ['#c05a3a', '#8a3236', '#5a1e30', '#3a1228'] : ['#4a3e3a', '#382e2c', '#282020', '#1c1616'];
      P.mk('ig_cloud_' + st, 180, 84, 6, (p, f) => P.paintCloud(p, 90, 58, [150, 118, 136, 100, 146, 112][f], [34, 28, 40, 24, 30, 27][f], CB, P.RNG(2150 + f * 7 + (on ? 3 : 0)), { lit: 'bottom', rim: on ? '#ffc070' : '#6a5a52', flat: false }), { outline: false });
      P.mk('ig_cloudS_' + st, 100, 46, 4, (p, f) => P.paintCloud(p, 50, 32, [78, 64, 84, 70][f], [17, 15, 19, 16][f], CF, P.RNG(2170 + f * 5 + (on ? 3 : 0)), { lit: 'bottom', rim: on ? '#e0804a' : '#4e443e', flat: false }), { outline: false });
      P.mk('ig_puff_' + st, 40, 40, 5, (p, f) => { const rr = [5, 8, 11, 14, 17][f]; P.paintCloud(p, 20, 20 + rr * 0.5, rr * 1.7, rr * 1.05, on ? ['#ff9a5a', '#a04234', '#5a2030', '#33121e'] : ['#6a5c56', '#4a3e3a', '#322a28', '#221c1c'], P.RNG(2180 + f), { lit: 'bottom', flat: false }); }, { outline: false });
    }
  };

  // nubes del cielo: (x, y, variante, banda) — la banda 1 está más cerca y se mueve más
  const CLD = (() => { const r = P.RNG(2190), a = []; for (let i = 0; i < 7; i++) a.push({ x: i * 190 + r.int(0, 80), y: r.int(8, 56), f: i % 4, b: 0 }); for (let i = 0; i < 6; i++) a.push({ x: i * 220 + r.int(0, 90), y: r.int(40, 96), f: i % 6, b: 1 }); return a; })();
  const WR = 1320;
  // distorsión de calor: copia la región a un lienzo auxiliar (copiar un lienzo sobre sí mismo es lentísimo) y la
  // vuelve a pintar en franjas de 2 px desplazadas por una onda
  const HZ = {};
  const heat = (c, x0, y0, w, h, fn) => {
    x0 = Math.max(0, Math.round(x0)); y0 = Math.max(0, Math.round(y0)); w = Math.min(P.W - x0, Math.round(w)); h = Math.min(P.H - y0, Math.round(h)); if (w < 2 || h < 2) return;
    if (!HZ.cv) { HZ.cv = document.createElement('canvas'); HZ.cv.width = P.W; HZ.cv.height = P.H; HZ.x = HZ.cv.getContext('2d'); }
    const s = HZ.x; s.globalCompositeOperation = 'copy'; s.drawImage(c.canvas, x0, y0, w, h, 0, 0, w, h); s.globalCompositeOperation = 'source-over';
    for (let y = 0; y < h; y += 2) { const dx = fn(y0 + y); if (dx) c.drawImage(HZ.cv, 0, y, w, Math.min(2, h - y), x0 + dx, y0 + y, w, Math.min(2, h - y)); }
  };
  const UA = () => P.ART.umbrelia;
  const baseUpd = P.ART.ignaria.levelUpdate;
  Object.assign(P.ART.ignaria, {
    lava: 8, liqAlpha: 1,
    // efectos animados entre capas del fondo (k: 0 tras el cielo · 1 tras la capa lejana · 2 tras la media · 3 tras la cercana)
    bgFx(L, c, cx, vy, k, st, a) {
      const t = L.t, on = st === 'r', LV = LVof(st);
      if (k === 0) {
        if (st === 'c') L._igRf = L.restoredFrac();
        for (const q of CLD) {
          const im = P.S[(q.b ? 'ig_cloud_' : 'ig_cloudS_') + st].f[q.f], par = q.b ? 0.07 : 0.035, dr = q.b ? 0.1 : 0.05;
          const X = ((q.x - cx * par - t * dr) % WR + WR) % WR - 190; if (X > P.W) continue;
          c.globalAlpha = a * (q.b ? 0.96 : 0.82); c.drawImage(im, Math.round(X), Math.round(q.y + vy * 0.06));
        }
      } else if (k === 1) {
        // penacho del volcán activo, resplandor del cráter y bombas de lava
        const off = -((cx * 0.12) % TW), Y = H - 44 - 132 + vy * 0.12 + 14;
        for (const rep of [off, off + TW]) {
          const X = rep + 170; if (X < -120 || X > P.W + 120) continue;
          P.drawGlow(c, X, Y, 28 + Math.sin(t * 0.05) * 5, on ? '#ff6a1a' : '#8a3a1a', (on ? 0.6 : 0.25) * a);
          const ps = []; for (let i = 0; i < 16; i++) ps.push((t * 0.0035 + i / 16) % 1); ps.sort((u, v) => v - u);
          for (const ph of ps) { const px = X + ph * ph * 80 + Math.sin(ph * 7) * 4, py = Y - 4 - ph * 130, fr = Math.min(4, Math.floor(ph * 6)); c.globalAlpha = a * Math.min(1, (1 - ph) * 1.3) * 0.92; c.drawImage(P.S['ig_puff_' + st].f[fr], Math.round(px - 20), Math.round(py - 20)); }
          if (on) for (let i = 0; i < 7; i++) { const T = (t + i * 29) % 90, ph = T / 90, vx = ((i * 37) % 11 - 5) * 0.32, ex = X + vx * T, ey = Y - 2.4 * T + 0.028 * T * T; c.globalAlpha = a * (1 - ph); c.fillStyle = LV[2]; c.fillRect(Math.round(ex - vx * 2), Math.round(ey + 2), 1, 2); c.fillStyle = '#fff0a0'; c.fillRect(Math.round(ex), Math.round(ey), 2, 2); }
        }
      } else if (k === 2) {
        // cascadas que fluyen de verdad
        const off = -((cx * 0.3) % TW), yo = vy * 0.25 + 22;
        for (const f of P.IG_FALLS[st]) for (const rep of [off, off + TW]) {
          const X = Math.round(rep + f.x); if (X < -14 || X > P.W + 14) continue; const len = f.y1 - f.y0, y0 = Math.round(f.y0 + yo);
          c.globalAlpha = a; c.fillStyle = LV[3]; for (let j = 0; j < len; j += 6) c.fillRect(X + (j % 3), y0 + ((j + t * 0.9) % len), 1, 3);
          c.fillStyle = LV[4]; for (let j = 3; j < len; j += 13) c.fillRect(X + 1, y0 + ((j + t * 1.4) % len), 1, 2);
          for (let s = 0; s < 3; s++) { const ph = (t * 0.045 + s / 3) % 1; c.fillStyle = LV[3]; c.fillRect(Math.round(X + 1 + (s - 1) * ph * 7), Math.round(y0 + len - Math.sin(ph * Math.PI) * 6), 1, 1); }
          P.drawGlow(c, X + 1, y0 + len, 13 + Math.sin(t * 0.1 + f.x) * 2, '#ff6a1a', (on ? 0.5 : 0.25) * a); P.drawGlow(c, X + 1, y0 + len * 0.5, 9, '#ff6a1a', (on ? 0.18 : 0.08) * a);
        }
      } else if (k === 3) {
        // brillos que corren por el río, resplandor sumado y distorsión de calor (solo en la última pasada)
        const off = -((cx * 0.55) % TW), yo = vy * 0.45 + 6, surf = P.IG_RIVER[st];
        c.globalAlpha = a;
        for (let i = 0; i < 44; i++) { const lx = (i * 14.5 + t * (0.22 + (i % 3) * 0.09)) % TW; for (const rep of [off, off + TW]) { const X = Math.round(rep + lx); if (X < -6 || X > P.W) continue; c.fillStyle = i % 3 ? LV[3] : LV[4]; c.fillRect(X, Math.round(surf[Math.floor(lx)] + yo + 1 + (i % 4) * 2), 2 + (i % 4), 1); } }
        const gy = Math.round(H - 24 + yo - 26); if (gy < H) { const gr = c.createLinearGradient(0, gy, 0, H); gr.addColorStop(0, 'rgba(255,90,20,0)'); gr.addColorStop(1, on ? 'rgba(255,110,30,0.28)' : 'rgba(200,70,20,0.14)'); c.globalCompositeOperation = 'lighter'; c.fillStyle = gr; c.fillRect(0, gy, P.W, H - gy); c.globalCompositeOperation = 'source-over'; }
        const last = (L._igRf || 0) > 0 ? 'r' : 'c';
        if (st === last) { c.globalAlpha = 1; const y0 = Math.max(0, Math.round(150 + vy * 0.45)); heat(c, 0, y0, P.W, H - y0, y => Math.round(Math.sin(t * 0.12 + y * 0.35) * (0.5 + (y - y0) / Math.max(1, H - y0) * 1.3))); }
      }
      c.globalAlpha = a; c.globalCompositeOperation = 'source-over';
    },
    // lava opaca y animada: costra que fluye, oleaje en la superficie, burbujas que revientan, resplandor
    drawLiquid(L, c, X, Y, tx, ty, st) {
      const t = L.t, im = P.S['ig_lavatex_' + st].f[0], LV = LVof(st);
      if (L.tile(tx, ty - 1) === '~') { const sx = (((tx * 16 - Math.floor(t * 0.12)) % 64) + 64) % 64; c.drawImage(im, sx, 16, 16, 16, X, Y, 16, 16); return; }
      const sx = (((tx * 16 + Math.floor(t * 0.2)) % 64) + 64) % 64; c.drawImage(im, sx, 0, 16, 13, X, Y + 3, 16, 13);
      for (let i = 0; i < 16; i++) { const wx = tx * 16 + i, h = Math.max(0, Math.min(3, Math.round(1.6 + Math.sin(wx * 0.31 + t * 0.07) * 1.1 + Math.sin(wx * 0.13 - t * 0.045) * 0.7)));
        if (h < 3) { c.fillStyle = LV[2]; c.fillRect(X + i, Y + h, 1, 3 - h); } c.fillStyle = (wx + (t >> 3)) % 7 === 0 ? '#fff0a0' : LV[4]; c.fillRect(X + i, Y + h, 1, 1); }
      const bh = ((tx * 73856093) ^ (Math.floor((t + tx * 13) / 54) * 19349663)) >>> 0;
      if (bh % 4 === 0) { const ph = ((t + tx * 13) % 54) / 54, bx = X + 3 + (bh >> 3) % 10;
        if (ph < 0.8) { const rr = Math.round(1 + ph * 2.5); c.fillStyle = LV[3]; c.fillRect(bx - rr, Y + 3 - rr, rr * 2, rr); c.fillStyle = LV[4]; c.fillRect(bx - rr + 1, Y + 3 - rr, 1, 1); }
        else { const k = (ph - 0.8) * 30; c.fillStyle = LV[4]; c.fillRect(bx - 2 - k, Y + 1 - k, 1, 1); c.fillRect(bx + 2 + k, Y + 1 - k, 1, 1); c.fillRect(bx, Y - 1 - k * 1.5, 1, 1); } }
      P.drawGlow(c, X + 8, Y + 3, 14, '#ff6a1a', st === 'r' ? 0.32 : 0.16);
    },
    levelUpdate(L) {
      baseUpd(L);
      // chispas que saltan de la superficie de la lava visible
      if (L.t % 4) return; const cx = L.cam.x, cy = L.cam.y, tx = Math.floor((cx + P.rand(0, P.W)) / TS);
      for (let ty = Math.floor(cy / TS); ty <= Math.floor((cy + P.H) / TS); ty++) if (L.tile(tx, ty) === '~' && L.tile(tx, ty - 1) !== '~') { L.parts.add({ x: tx * TS + P.rand(2, 14), y: ty * TS + 1, vx: P.rand(-0.3, 0.3), vy: -P.rand(0.8, 2.2), g: 0.06, life: P.ri(20, 40), col: P.pick(['#ff6a1a', '#ffb030', '#fff0a0']), size: 1, glow: 3 }); break; }
    },
    // distorsión de calor real sobre la lava (desplaza franjas de la imagen) en lugar de líneas pintadas
    levelDraw(L, c) {
      UA().levelDraw(L, c);
      const cx = Math.round(L.cam.x), cy = Math.round(L.cam.y), tx0 = Math.floor(cx / TS), ty0 = Math.floor(cy / TS);
      for (let ty = ty0; ty <= ty0 + 17; ty++) { let a = -1;
        for (let tx = tx0; tx <= tx0 + 31; tx++) { const s = L.tile(tx, ty) === '~' && L.tile(tx, ty - 1) !== '~';
          if (s && a < 0) a = tx; if ((!s || tx === tx0 + 31) && a >= 0) { const xa = Math.max(0, a * TS - cx), xb = Math.min(P.W, (s ? tx + 1 : tx) * TS - cx), ys = ty * TS - cy;
            if (xb - xa > 2) heat(c, xa, ys - 22, xb - xa, 24, y => Math.round(Math.sin(L.t * 0.16 + y * 0.5) * 1.5 * (1 - (ys - y) / 24)));
            a = -1; } } }
    }
  });
})();
