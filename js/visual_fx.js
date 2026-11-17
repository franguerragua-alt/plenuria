'use strict';
// Iluminación global («shaders» en Canvas 2D): gradación de color por planeta con luz direccional, bloom por umbral,
// viñeta, rayos de luz, niebla baja y sombras suaves. Además: variedad visual por nivel (hitos de fondo, atrezo y primer plano).
// Todo es visual: no toca colisiones, entidades ni progresión.
P.FX = {
  // perfiles de luz de cada mundo: [color del lado iluminado, color del lado en sombra, intensidad], sol, niebla y rayos
  GR: {
    verzara: { day: ['#fff0b0', '#1e7a5a', 0.22], golden: ['#ffb070', '#5a2a5a', 0.28], dusk: ['#9a7aff', '#0a2a3a', 0.3], cave: ['#9a8aff', '#0a1a2a', 0.3], sun: [360, 40], fog: '#b8ffd8', rays: '255,244,200' },
    khazir: { day: ['#ffe2a8', '#a85428', 0.26], golden: ['#ff9a50', '#5a1a3a', 0.3], dusk: ['#ff8a8a', '#241a5a', 0.3], cave: ['#ffb060', '#200c06', 0.3], sun: [360, 56], fog: '#ffe0b0', rays: '255,226,170' },
    nivorah: { day: ['#e4f6ff', '#2e4e9a', 0.24], golden: ['#ffc8d8', '#30308a', 0.28], dusk: ['#6ef0c8', '#0a1448', 0.32], cave: ['#8ad8ff', '#08142a', 0.3], sun: [96, 60], fog: '#e0f0ff', rays: '220,240,255' }
  },
  FAC: { facility: ['#a8c4ff', '#24102e', 0.26], lab: ['#a8ffd8', '#141a3a', 0.26] },
  canBloom: (() => { try { return 'filter' in document.createElement('canvas').getContext('2d'); } catch (e) { return false; } })(),
  // ---------- posproceso ----------
  post(c, g) {
    if (!g) return;
    c.save();
    // 1 · gradación con dirección de luz (del sol hacia la esquina opuesta)
    if (g.a > 0) {
      const sx = g.sx == null ? P.W * 0.7 : g.sx, sy = g.sy == null ? 0 : g.sy;
      const gr = c.createLinearGradient(sx, sy, P.W - sx, P.H); gr.addColorStop(0, g.top); gr.addColorStop(1, g.bot);
      c.globalCompositeOperation = 'soft-light'; c.globalAlpha = g.a; c.fillStyle = gr; c.fillRect(0, 0, P.W, P.H);
    }
    // 2 · bloom por umbral: copia reducida con brillo/contraste altos, ampliada con suavizado y sumada
    if (g.bloom > 0 && this.canBloom) {
      if (!this.sm) { const mk = (w, h) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv; }; this.sm = mk(120, 68); this.sm2 = mk(60, 34); this.sx = this.sm.getContext('2d'); this.sx2 = this.sm2.getContext('2d'); }
      const s = this.sx; s.globalCompositeOperation = 'copy'; s.imageSmoothingEnabled = true; s.filter = 'brightness(0.72) contrast(2.8) saturate(1.35)'; s.drawImage(c.canvas, 0, 0, 120, 68); s.filter = 'none';
      const s2 = this.sx2; s2.globalCompositeOperation = 'copy'; s2.imageSmoothingEnabled = true; s2.drawImage(this.sm, 0, 0, 60, 34);
      c.globalCompositeOperation = 'lighter'; c.imageSmoothingEnabled = true;
      c.globalAlpha = g.bloom; c.drawImage(this.sm, 0, 0, P.W, P.H); c.globalAlpha = g.bloom * 0.7; c.drawImage(this.sm2, 0, 0, P.W, P.H);
    }
    // 3 · viñeta
    if (g.vig > 0) { if (!this.vg) { const cv = document.createElement('canvas'); cv.width = P.W; cv.height = P.H; const x = cv.getContext('2d'), rg = x.createRadialGradient(P.W / 2, P.H / 2, P.H * 0.42, P.W / 2, P.H / 2, P.W * 0.62); rg.addColorStop(0, 'rgba(0,0,0,0)'); rg.addColorStop(1, 'rgba(4,2,14,1)'); x.fillStyle = rg; x.fillRect(0, 0, P.W, P.H); this.vg = cv; } c.globalCompositeOperation = 'source-over'; c.globalAlpha = g.vig; c.drawImage(this.vg, 0, 0); }
    c.restore();
  },
  profLevel(L, rf) {
    const G = this.GR[L.planet] || this.GR.verzara, th = L.theme, lv = L.id || 1;
    let b = th === 'facility' || th === 'lab' ? this.FAC[th] : th === 'cave' || th === 'deep' ? (G[th] || G.cave) : G[L.sky] || G.day;
    const dark = L.sky === 'dusk' || th === 'cave' || th === 'deep' || th === 'facility' || th === 'lab';
    // cada nivel tiene un matiz propio (la hora y el aire cambian de un territorio a otro)
    const shift = [0, 0.08, -0.06, 0.12, -0.1][lv % 5], top = P.Col.mix(b[0], lv % 2 ? '#ffffff' : '#ffd8a0', Math.abs(shift));
    return { top, bot: b[1], a: b[2] + (L.def.boss ? 0.06 : 0), bloom: (dark ? 0.3 : 0.17 + (L.sky === 'golden' ? 0.06 : 0)) * (G.bloomMul || 1), vig: L.def.boss ? 0.5 : dark ? 0.42 : 0.26, sx: G.sun[0], sy: 0 };
  },
  profOW(sc) { const G = this.GR[sc.planet] || this.GR.verzara, lf = P.State.liberated(sc.planet) / 10; return { top: G.day[0], bot: P.Col.mix(G.day[1], '#000000', 0.2), a: 0.2, bloom: 0.14 + (1 - lf) * 0.06, vig: 0.3, sx: G.sun[0] }; },
  profShip() { return { top: '#bfe8ff', bot: '#2a1a50', a: 0.2, bloom: 0.26, vig: 0.2, sx: 60 }; },
  profTitle() { return { top: '#c0d8ff', bot: '#3a1060', a: 0.15, bloom: 0.3, vig: 0.25, sx: 384 }; },

  // ---------- capas del nivel ----------
  outdoor(L) { return !['cave', 'facility', 'lab'].includes(L.theme); },
  // hitos lejanos (entre el plano medio y el cercano): cada nivel elige los suyos
  landmarks(L, c, cx, vy) {
    if (!this.outdoor(L) || L.def.boss) return;
    const set = P.LANDMARKS[L.planet]; if (!set) return;
    const lv = L.id || 1, picks = [set[(lv * 2) % set.length], set[(lv * 2 + 3) % set.length]];
    const sp = 560, off = (cx * 0.2) % (sp * 2), a0 = c.globalAlpha; c.globalAlpha = a0 * 0.8;
    for (let k = -1; k < 3; k++) { const im = picks[(k + 4 + Math.floor(cx * 0.2 / (sp * 2)) * 2) % 2 === 0 ? 0 : 1](); const x = k * sp - off + 140 + (lv * 37) % 120; if (x < -im.width || x > P.W) continue; c.drawImage(im, Math.round(x), Math.round(P.H - im.height - 30 + vy * 0.25)); }
    c.globalAlpha = a0;
  },
  afterBG(L, c, cx, cy) {
    // rayos de sol / de aurora desde la fuente de luz del cielo
    if (!this.outdoor(L)) return;
    const G = this.GR[L.planet] || this.GR.verzara, t = L.t, sx = G.sun[0] - cx * 0.02, sy = L.sky === 'golden' ? 110 : L.sky === 'dusk' ? -30 : G.sun[1] - 40;
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 2 + (i - 2.5) * 0.17 + Math.sin(t * 0.004 + i * 1.7) * 0.03, len = 320, w = 10 + (i % 3) * 8;
      const ex = sx + Math.cos(a) * len, ey = sy + Math.sin(a) * len, nx = -Math.sin(a) * w, ny = Math.cos(a) * w;
      const g = c.createLinearGradient(sx, sy, ex, ey); const al = (L.sky === 'dusk' ? 0.03 : 0.055) * (0.7 + 0.3 * Math.sin(t * 0.01 + i));
      g.addColorStop(0, 'rgba(' + G.rays + ',' + al + ')'); g.addColorStop(1, 'rgba(' + G.rays + ',0)');
      c.fillStyle = g; c.beginPath(); c.moveTo(sx, sy); c.lineTo(ex + nx, ey + ny); c.lineTo(ex - nx, ey - ny); c.closePath(); c.fill();
    }
    c.restore();
  },
  // sombras suaves bajo personajes y criaturas
  shadows(L, c, cx, cy) {
    const list = [L.player, ...L.companions, ...L.ents.filter(e => (e.isEnemy || e instanceof P.Walker) && !e.flying && !e.boss && e.onScreen && e.onScreen(20))];
    for (const e of list) {
      if (!e || e.dead || e.hidden) continue;
      const tx = Math.floor((e.x + e.w / 2) / TS), fy = e.y + e.h; let gy = null;
      for (let ty = Math.floor((fy - 1) / TS); ty < Math.floor(fy / TS) + 6; ty++) if (L.coll(tx, ty) >= 1) { gy = ty * TS; break; }
      if (gy == null) continue; const d = Math.max(0, gy - fy), k = 1 - Math.min(1, d / 90); if (k <= 0) continue;
      c.fillStyle = 'rgba(8,4,22,' + (0.32 * k) + ')'; c.beginPath(); c.ellipse(Math.round(e.x + e.w / 2 - cx), Math.round(gy - cy), Math.max(3, e.w * 0.62 * (0.6 + 0.4 * k)), 2.2, 0, 0, 7); c.fill();
    }
  },
  // atrezo propio de cada nivel sobre el suelo (variedad sin tocar colisiones)
  props(L, c, cx, cy) {
    if (!this.outdoor(L) || L.def.boss) return;
    const kinds = P.PROPS[L.planet]; if (!kinds) return;
    if (!L._props) {
      L._props = []; const R = P.RNG(L.id * 131 + P.hash(L.planet) % 1000), lv = L.id || 1, pick = [kinds[lv % kinds.length], kinds[(lv + 2) % kinds.length]], dens = 0.05 + (lv % 4) * 0.02;
      for (let ty = 2; ty < L.rows; ty++) for (let tx = 1; tx < L.cols - 1; tx++) {
        if (L.coll(tx, ty) !== 1 || L.tile(tx, ty) === 'b' || L.tile(tx, ty - 1) !== '.' || L.tile(tx, ty - 2) !== '.') continue;
        if (L.coll(tx - 1, ty) !== 1 || L.coll(tx + 1, ty) !== 1) continue;
        if (R() < dens) L._props.push({ x: tx * TS + 8, y: ty * TS, k: R.pick(pick), v: R.int(0, 1) });
      }
    }
    for (const p of L._props) {
      const X = p.x - cx, Y = p.y - cy; if (X < -30 || X > P.W + 30 || Y < -40 || Y > P.H + 20) continue;
      const s = P.S[p.k]; if (!s) continue; const restored = L.restoredAt(p.x);
      P.spr(c, p.k, restored ? 1 : 0, Math.round(X - s.w / 2), Math.round(Y - s.h + 1));
      if (P.PROP_LIGHT[p.k] && restored) P.drawGlow(c, X, Y - s.h + 4, 12 + Math.sin(L.t * 0.05 + p.x) * 2, P.PROP_LIGHT[p.k], 0.45);
    }
  },
  // primer plano oscuro en la base de la pantalla + niebla baja
  front(L, c, cx, cy) {
    if (!this.outdoor(L)) return;
    const G = this.GR[L.planet] || this.GR.verzara, bottom = L.H - cy;
    if (bottom < P.H + 40) {
      const im = this.fgStrip(L.planet, L.id || 1), off = -((cx * 1.25) % im.width);
      for (let x = off - im.width; x < P.W; x += im.width) c.drawImage(im, Math.round(x), Math.round(bottom - im.height + 2));
    }
    const g = c.createLinearGradient(0, P.H - 70, 0, P.H); g.addColorStop(0, P.Col.rgba(G.fog, 0)); g.addColorStop(1, P.Col.rgba(G.fog, L.sky === 'dusk' ? 0.08 : 0.12));
    c.save(); c.globalCompositeOperation = 'screen'; c.fillStyle = g; c.fillRect(0, P.H - 70, P.W, 70); c.restore();
  },
  revealPlanet(c, scene, pp, x, y, R, key = 'winSeen') {
    const d = P.State.data, seen = d.flags[key] || (d.flags[key] = {}), quiet = key !== 'winSeen';
    const dp = d.planets[pp.id]; if (!seen[pp.id] && dp && (dp.boss || Object.keys(dp.levels || {}).length)) seen[pp.id] = true;
    if (pp.id === 'verzara' || seen[pp.id]) { P.Space.drawPlanet(c, pp.id, x, y, R, P.State.liberated(pp.id) / 10); return; }
    const st = scene._rev || (scene._rev = {}), rk = key + pp.id; if (st[rk] == null) { st[rk] = scene.t; if (!quiet) P.toast('Nuevo destino visible desde la nave: ' + pp.name, { col: P.UIC.cyan, icon: 'i_star', life: 240 }); P.Audio.sfx('unlock'); }
    const k = Math.min(1, (scene.t - st[rk]) / 150);
    c.save(); c.globalAlpha = k; P.Space.drawPlanet(c, pp.id, x, y, R, 0); c.restore();
    if (k < 1) { c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = 'rgba(190,240,255,' + (1 - k) + ')'; c.beginPath(); c.arc(x, y, R + 2 + k * 14, 0, 7); c.stroke(); for (let i = 0; i < 4; i++) { const a = scene.t * 0.05 + i * 1.57; c.fillStyle = '#ffffff'; c.fillRect(Math.round(x + Math.cos(a) * (R + 6)), Math.round(y + Math.sin(a) * (R + 6)), 1, 1); } c.restore(); P.drawGlow(c, x, y, R + 8, '#bff6ff', 0.6 * (1 - k)); }
    else seen[pp.id] = true;
  },
  _fg: {},
  fgStrip(planet, lv) {
    const k = planet + lv; if (this._fg[k]) return this._fg[k];
    const W = 480, H = 26, p = new P.Painter(W, H), r = P.RNG(lv * 71 + P.hash(planet) % 997), col = { verzara: '#06120a', khazir: '#140904', nivorah: '#070c1c' }[planet] || '#08080e', kind = lv % 3;
    for (let x = 0; x < W; x += r.int(10, 26)) {
      if (planet === 'dyson') { const k3 = r.int(0, 3); if (k3 === 0) { p.rect(x, H - 18, 3, 18, col); p.rect(x - 8, H - 16, 20, 2, col); p.rect(x - 8, H - 9, 20, 1, col); } else if (k3 === 1) { p.rect(x, H - 8, r.int(10, 18), 8, col); p.rect(x + 2, H - 12, r.int(6, 10), 4, col); } else if (k3 === 2) { for (let k2 = 0; k2 < 12; k2++) p.px(x + k2 * 2, H - 4 - Math.round(Math.sin(k2 * 0.5) * 3), col); } else p.rect(x, H - 5, 24, 5, col); continue; }
      if (planet === 'nivorah') { const h = r.int(8, 22); p.tri(x, H, x + r.int(5, 10), H, x + r.int(2, 6), H - h, col); }
      else if (planet === 'khazir') { if (kind === 0) p.sell(x, H - 3, r.int(5, 11), r.int(4, 8), [col, col]); else for (let k2 = 0; k2 < 4; k2++) p.line(x + k2 * 2, H, x + k2 * 2 + r.int(-3, 3), H - r.int(6, 14), col); }
      else { for (let k2 = 0; k2 < 5; k2++) { const a = -Math.PI / 2 + (k2 - 2) * 0.35; p.thick(x, H, x + Math.cos(a) * r.int(8, 20), H + Math.sin(a) * r.int(8, 20), 2, col); } }
    }
    p.rect(0, H - 3, W, 3, col);
    return (this._fg[k] = p.canvas());
  }
};

// ---------- atrezo por planeta (dos fotogramas: contaminado / restaurado) ----------
P.PROPS = { verzara: ['pv_lantern', 'pv_totem', 'pv_shroom', 'pv_crystal'], khazir: ['pk_banner', 'pk_pots', 'pk_bones', 'pk_stone'], nivorah: ['pn_beacon', 'pn_crystal', 'pn_cairn', 'pn_sled'] };
P.PROP_LIGHT = { pv_lantern: '#7dffd0', pv_shroom: '#c08aff', pv_crystal: '#9cff6a', pk_banner: null, pk_stone: '#2ad8c0', pn_beacon: '#5ef0ff', pn_crystal: '#bfefff' };
P.Sprites.buildProps = function () {
  const O = { up: 0.1, down: 0.15 };
  P.mk('pv_lantern', 10, 24, 2, (p, f) => { p.rect(4, 6, 2, 18, '#4a3a2a'); p.rect(2, 22, 6, 2, '#3a2a1a'); p.line(5, 6, 8, 3, '#4a3a2a'); p.sell(8, 6, 2.6, 3, f ? ['#1a8a6a', '#5ef0c0', '#d8fff0', '#ffffff'] : ['#3a2a4a', '#6a4a7a', '#9a7aaa']); }, O);
  P.mk('pv_totem', 12, 22, 2, (p, f) => { p.rect(3, 4, 6, 18, '#5a5a6a'); p.rect(3, 4, 2, 18, '#8a8a9a'); p.rect(2, 2, 8, 3, '#7a7a8a'); p.px(6, 8, f ? '#5ef0c0' : '#7a3a8a'); p.px(6, 13, f ? '#ffd166' : '#5a2a6a'); p.rect(4, 17, 4, 1, '#3a3a4a'); if (f) { p.px(2, 20, '#5cc06a'); p.px(9, 19, '#5cc06a'); } }, O);
  P.mk('pv_shroom', 16, 12, 2, (p, f) => { for (const [x, h, r2] of [[4, 7, 3], [9, 10, 4], [13, 5, 2.5]]) { p.rect(x, 12 - h, 1, h, '#d8c8e8'); p.sell(x, 12 - h, r2, r2 * 0.7, f ? ['#5a2a9a', '#9a5ad8', '#e0b0ff', '#ffffff'] : ['#3a2a3a', '#5a3a5a', '#7a5a7a']); } }, O);
  P.mk('pv_crystal', 12, 14, 2, (p, f) => { const C = f ? ['#1a7a3a', '#5cd06a', '#c8ffb0'] : ['#3a1a4a', '#7a3a9a', '#c08ad8']; p.tri(2, 14, 6, 14, 4, 4, C[1]); p.tri(5, 14, 10, 14, 8, 1, C[1]); p.tri(5, 14, 8, 14, 8, 1, C[2]); p.tri(8, 14, 12, 14, 11, 7, C[0]); }, O);
  P.mk('pk_banner', 12, 26, 2, (p, f) => { p.rect(2, 2, 1, 24, '#5a3418'); p.px(2, 1, '#ffd166'); const c2 = f ? '#2ad8c0' : '#6a3a3a'; for (let y = 4; y < 16; y++) p.rect(3, y, 7 - Math.max(0, y - 12), 1, y % 4 === 0 ? '#ffd166' : c2); p.ell(6, 9, 1.5, 1.5, f ? '#ffd166' : '#3a1a1a'); }, O);
  P.mk('pk_pots', 16, 12, 2, (p, f) => { for (const [x, r2, h] of [[4, 3, 8], [9, 4, 10], [13, 2.5, 6]]) { p.sell(x, 12 - h / 2, r2, h / 2, ['#7a3a1a', '#c8743a', '#f0a860', '#ffe0b0']); p.rect(x - 1, 12 - h - 1, 3, 1, '#7a3a1a'); if (f) p.rect(x - r2 + 1, 12 - h / 2, r2 * 2 - 1, 1, '#2ad8c0'); } if (!f) p.line(9, 4, 11, 9, '#3a1a0a'); }, O);
  P.mk('pk_bones', 22, 12, 2, (p, f) => { p.thick(3, 10, 19, 7, 2.5, '#e8e0cc'); p.ell(3, 10, 2.5, 2, '#f4efe0'); p.ell(19, 7, 2.5, 2, '#f4efe0'); for (let i = 0; i < 4; i++) p.line(6 + i * 3, 9, 7 + i * 3, 3 - (i % 2), '#d8d0bc'); if (f) { p.px(10, 11, '#2fa84a'); p.px(14, 11, '#ff5a8a'); } }, O);
  P.mk('pk_stone', 12, 18, 2, (p, f) => { p.sell(6, 10, 5, 8, ['#7a4a2e', '#b8784a', '#e0a870', '#ffe0b0']); p.ell(6, 8, 2.5, 1.6, '#5a3420'); p.px(6, 8, f ? '#2ad8c0' : '#ff5ad0'); p.rect(3, 13, 6, 1, '#5a3420'); }, O);
  P.mk('pn_beacon', 10, 26, 2, (p, f) => { p.rect(4, 6, 2, 20, '#c8d4e8'); p.rect(4, 6, 1, 20, '#ffffff'); p.rect(2, 24, 6, 2, '#8a98bc'); p.ell(5, 5, 3, 2, '#eef4ff'); p.px(5, 3, f ? '#5ef0ff' : '#5a4a8a'); p.rect(3, 12, 4, 1, '#8a98bc'); }, O);
  P.mk('pn_crystal', 14, 16, 2, (p, f) => { const C = f ? ['#5aa8d8', '#a8e0ff', '#ffffff'] : ['#3a3a6a', '#6a6ab0', '#b0b0f0']; p.tri(1, 16, 5, 16, 3, 6, C[1]); p.tri(4, 16, 10, 16, 7, 1, C[1]); p.tri(4, 16, 7, 16, 7, 1, C[2]); p.tri(8, 16, 13, 16, 11, 8, C[0]); }, O);
  P.mk('pn_cairn', 14, 16, 2, (p, f) => { for (const [y, r2] of [[13, 6], [8, 4.5], [4, 3]]) p.sell(7, y, r2, r2 * 0.7, ['#3a5a7a', '#6a8aaa', '#a8c4e0', '#e8f4ff']); p.ell(7, 2, 3, 1, '#ffffff'); if (f) p.px(7, 8, '#ff8ad8'); }, O);
  P.mk('pn_sled', 22, 12, 2, (p, f) => { p.rect(2, 4, 18, 5, '#6a4a3a'); p.rect(2, 4, 18, 1, '#9a7a5a'); p.line(1, 11, 21, 11, '#8a98bc'); p.line(1, 11, 0, 9, '#8a98bc'); p.rect(4, 9, 1, 2, '#8a98bc'); p.rect(17, 9, 1, 2, '#8a98bc'); p.ell(11, 4, 8, 1.5, '#ffffff'); if (f) { p.rect(6, 1, 4, 3, '#ff8ad8'); p.rect(12, 2, 5, 2, '#5ef0ff'); } }, O);
};

// ---------- hitos lejanos (siluetas grandes, generadas una vez) ----------
P.LANDMARKS = {};
(function () {
  const HZ = { lv: 'rgba(170,230,210,0.42)', lk: 'rgba(255,214,170,0.4)', ln: 'rgba(210,232,255,0.42)' };
  const cache = {}, mk = (key, w, h, fn) => () => { if (cache[key]) return cache[key]; const p = new P.Painter(w, h); fn(p, P.RNG(P.hash(key))); const cv = p.canvas(), x = cv.getContext('2d'); x.globalCompositeOperation = 'source-atop'; x.fillStyle = HZ[key.slice(0, 2)]; x.fillRect(0, 0, w, h); return (cache[key] = cv); };
  const V = ['#1e4a3e', '#2e6a52', '#4a8a6a', '#7ab89a'], K = ['#6a3a2a', '#8a5236', '#b0744a', '#d8a070'], N = ['#3a5684', '#5274a8', '#7a9cc8', '#b8d4ee'];
  P.LANDMARKS.verzara = [
    mk('lv0', 160, 150, (p, r) => { p.rect(10, 20, 40, 130, V[1]); p.rect(10, 20, 6, 130, V[2]); p.rect(110, 30, 44, 120, V[1]); p.rect(110, 30, 6, 120, V[2]); for (let x = 50; x < 110; x++) for (let y = 34; y < 150; y++) if ((x * 3 + y * 7 + y) % 9 > 2) p.px(x, y, (y + x) % 5 ? '#9ad8e8' : '#e0faff'); p.ell(80, 146, 40, 6, '#e8fbff'); for (let i = 0; i < 6; i++) p.ell(20 + i * 24, 18 + (i % 2) * 6, 14, 6, V[0]); }),
    mk('lv1', 150, 130, (p, r) => { p.rect(20, 80, 110, 50, V[1]); p.sell(75, 80, 46, 40, V); p.rect(73, 10, 4, 34, V[3]); p.tri(70, 14, 80, 14, 75, 0, '#9cffd0'); for (let i = 0; i < 4; i++) { p.rect(32 + i * 24, 92, 10, 38, V[0]); p.ell(37 + i * 24, 92, 5, 5, V[0]); } }),
    mk('lv2', 170, 120, (p, r) => { for (let i = 0; i < 140; i++) { const x = 15 + i, y = 92 - i * 0.12, h = i < 20 ? 6 + i : 26; p.rect(x, y, 1, h, '#5a6a8a'); p.px(x, y, '#c8d4e8'); if (i % 12 === 6 && i > 20) p.rect(x, y + 8, 4, 3, '#9ae8ff'); } p.tri(110, 80, 140, 80, 120, 50, '#4a5a7a'); p.ell(150, 88, 10, 14, '#3a4a6a'); for (let i = 0; i < 12; i++) p.line(25 + i * 11, 96 - i * 1.3, 27 + i * 11, 116, '#2a8a3a'); p.ell(85, 116, 80, 5, V[1]); }),
    mk('lv3', 160, 160, (p, r) => { for (const [x, h, rr] of [[30, 110, 26], [90, 150, 36], [140, 90, 20]]) { p.rect(x - 3, 160 - h, 6, h, '#c8c0d8'); p.sell(x, 160 - h, rr, rr * 0.5, ['#3a2a6a', '#6a4aa8', '#a88ae0', '#e0d0ff']); for (let k = 0; k < 4; k++) p.px(x - rr / 2 + k * rr / 3, 160 - h + 2, '#ffd8ff'); } }),
    mk('lv4', 150, 120, (p, r) => { for (let k = 0; k <= 40; k++) { const a = Math.PI * k / 40; p.thick(75 - Math.cos(a) * 55, 120 - Math.sin(a) * 90, 75 - Math.cos(a) * 55, 120 - Math.sin(a) * 90, 14, V[1]); } for (let i = 0; i < 8; i++) { const x = 30 + i * 12; for (let y = 30; y < 60 + (i % 3) * 14; y++) p.px(x + Math.sin(y * 0.3) , y, '#3aa850'); } })
  ];
  P.LANDMARKS.khazir = [
    mk('lk0', 180, 120, (p, r) => { p.thick(10, 118, 170, 118, 4, K[1]); for (let i = 0; i < 9; i++) { const x = 20 + i * 18; for (let k = 0; k <= 20; k++) { const a = Math.PI * k / 20; p.px(x + Math.cos(a) * 9, 116 - Math.sin(a) * (60 - Math.abs(i - 4) * 6), '#e8dcc0'); p.px(x + Math.cos(a) * 9 + 1, 116 - Math.sin(a) * (60 - Math.abs(i - 4) * 6), '#c8bca0'); } } p.sell(170, 104, 14, 12, ['#a89878', '#e8dcc0', '#fff8e8']); p.px(172, 100, '#1a1a1a'); }),
    mk('lk1', 180, 100, (p, r) => { p.rect(0, 50, 180, 50, K[1]); p.rect(0, 50, 180, 3, K[3]); for (let x = 0; x < 180; x += 10) p.rect(x, 44, 6, 6, K[1]); for (const x of [30, 140]) { p.rect(x - 12, 20, 24, 80, K[2]); p.rect(x - 12, 20, 24, 3, K[3]); p.rect(x - 3, 40, 6, 10, '#2a140a'); } p.rect(76, 64, 28, 36, '#2a140a'); p.ell(90, 64, 14, 10, '#2a140a'); p.ell(90, 40, 4, 4, '#2ad8c0'); }),
    mk('lk2', 140, 150, (p, r) => { for (let i = 0; i < 7; i++) { const x = 20 + i * 16, h = 50 + r.int(0, 90); p.tri(x - 8, 150, x + 8, 150, x + r.int(-4, 4), 150 - h, i % 2 ? '#c06ad0' : '#5ae8e0'); p.tri(x - 3, 150, x + 8, 150, x + 2, 150 - h + 10, '#ffffff'); } }),
    mk('lk3', 170, 150, (p, r) => { for (const [x, h, w] of [[30, 120, 16], [80, 150, 22], [135, 100, 14]]) { for (let y = 150 - h; y < 150; y++) p.rect(x - w / 2 + Math.sin(y * 0.08) * 3, y, w, 1, (y >> 3) % 2 ? K[1] : K[2]); p.sell(x, 150 - h - 8, w * 0.8, 10, K); } }),
    mk('lk4', 120, 160, (p, r) => { for (let y = 20; y < 160; y++) { const w = 8 + (y - 20) * 0.25; p.px(60 - w, y, MT2()); p.px(60 + w, y, MT2()); if (y % 12 === 0) p.line(60 - w, y, 60 + w, y, MT2()); } p.rect(40, 12, 40, 8, '#4e5872'); p.ell(60, 10, 6, 4, '#c04ad0'); function MT2() { return '#4e5872'; } })
  ];
  P.LANDMARKS.nivorah = [
    mk('ln0', 160, 150, (p, r) => { for (let y = 10; y < 150; y++) { const l = 52 + Math.round(Math.sin(y * 0.15) * 4 + r.range(-1, 1)), rr = 108 + Math.round(Math.cos(y * 0.12) * 4); p.rect(4, y, l - 4, 1, y % 9 < 2 ? N[0] : N[1]); p.rect(rr, y + 6, 156 - rr, 1, y % 11 < 2 ? N[0] : N[1]); } for (let k = 0; k < 14; k++) { const x = 56 + k * 3.6, top = 18 + r.int(0, 10), bot = 120 + r.int(0, 26); for (let y = top; y < bot; y += 1) if ((y + k * 5) % 7 < 5) p.px(x + Math.sin(y * 0.1 + k) * 0.8, y, k % 3 ? '#a8d8f4' : '#e8f8ff'); } p.ell(80, 146, 36, 6, '#d8f0ff'); }),
    mk('ln1', 150, 160, (p, r) => { for (let i = 0; i < 6; i++) { const x = 15 + i * 24, h = 60 + r.int(0, 100); p.tri(x - 12, 160, x + 12, 160, x + r.int(-8, 8), 160 - h, N[2]); p.tri(x - 4, 160, x + 12, 160, x + 2, 160 - h + 12, N[3]); } }),
    mk('ln2', 160, 130, (p, r) => { p.rect(60, 70, 40, 60, '#c8d4e8'); p.rect(60, 70, 6, 60, '#ffffff'); p.ell(80, 60, 50, 22, '#8a98bc'); p.ell(80, 56, 46, 18, '#c8d4e8'); p.ell(80, 56, 30, 10, '#4e5872'); p.line(80, 56, 120, 10, '#8a98bc'); p.px(120, 10, '#5ef0ff'); p.line(40, 120, 30, 80, '#8a98bc'); }),
    mk('ln3', 180, 110, (p, r) => { p.ell(90, 100, 88, 12, '#d8ecff'); for (let k = 0; k <= 30; k++) { const t = k / 30, x = 10 + t * 160, y = 96 - Math.sin(t * Math.PI) * 60; p.ell(x, y, 4, 4, '#eef6ff'); if (k % 2 === 0) { p.line(x, y, x - 6, y + 22, '#d8e8f8'); p.line(x, y, x + 6, y + 22, '#d8e8f8'); } } p.sell(170, 90, 12, 9, ['#a8b8cc', '#eef6ff', '#ffffff']); }),
    mk('ln4', 160, 150, (p, r) => { for (const x of [30, 80, 130]) { p.rect(x - 3, 40, 6, 110, '#c8d4e8'); p.rect(x - 3, 40, 2, 110, '#ffffff'); p.ell(x, 38, 8, 4, '#eef4ff'); p.ell(x, 34, 3, 3, '#5ef0ff'); } for (let x = 30; x < 130; x++) p.px(x, 36 + Math.sin(x * 0.12) * 2, x % 3 ? '#5ef0c0' : '#b48cff'); })
  ];
})();
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildProps(); }; })();
