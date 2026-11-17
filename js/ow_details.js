'use strict';
// Detalles del suelo del mapa exterior: matas de pasto que ondulan con una ola de viento y se apartan al pasar,
// piedras, flores y objetos propios de cada planeta con pequeñas animaciones (brillos, burbujas, latidos).
// Se colocan de forma determinista por casilla (no cambian entre visitas) y solo en suelo libre.
(function () {
  // por planeta: colores de las briznas (contaminado / restaurado) y objetos [nombre, dibujo(p, st), anim]
  // anim: 'glow' late con luz · 'bob' se balancea · 'bub' suelta burbujas · null estático
  const DEF = {
    verzara: { grass: { c: ['#3a2a4a', '#5a4468', '#7a6288'], r: ['#0e6a3a', '#1fa043', '#7ae050'] }, tip: { c: '#9a7ab0', r: '#c8ff3a' },
      obj: [['rock', (p, st) => { p.sell(5, 6, 4, 2.6, st === 'r' ? ['#2a4a3a', '#4a6a5a', '#7a9a7a'] : ['#2a2438', '#3e3650', '#564c68']); p.px(4, 4, st === 'r' ? '#5ce050' : '#5a4a6a'); }],
        ['flor', (p, st) => { p.line(4, 7, 4, 4, '#1fa043'); p.ell(4, 3, 1.6, 1.6, st === 'r' ? '#ff5ad8' : '#6a5a7a'); p.px(4, 3, st === 'r' ? '#ffffff' : '#8a7a9a'); }, 'bob'],
        ['vaina', (p, st) => { p.ell(4, 5, 2.6, 2, st === 'r' ? '#2a6a3a' : '#3a2a4a'); p.ell(4, 4, 1.4, 1.2, st === 'r' ? '#c8ff3a' : '#c04ad0'); }, 'bub'],
        ['setita', (p, st) => { p.rect(4, 5, 1, 3, '#e8dcc0'); p.ell(4, 4, 2.4, 1.4, st === 'r' ? '#ff7a3a' : '#5a3a5a'); }]] },
    khazir: { grass: { c: ['#4a3a2a', '#6a5238', '#8a6c48'], r: ['#8a6a20', '#c89a30', '#ffd070'] }, tip: { c: '#8a7a5a', r: '#fff0b0' },
      obj: [['guijarro', (p) => { p.ell(3, 6, 2, 1.4, '#8a6a48'); p.ell(6, 5, 1.6, 1.2, '#a88a60'); p.px(6, 4, '#e8c890'); }],
        ['hueso', (p) => { p.line(1, 6, 7, 4, '#e8dcc0'); p.px(1, 5, '#ffffff'); p.px(7, 3, '#ffffff'); p.px(1, 7, '#c8b890'); }],
        ['cactito', (p, st) => { p.rect(3, 3, 2, 5, st === 'r' ? '#3ab06a' : '#5a6a4a'); p.px(2, 4, st === 'r' ? '#3ab06a' : '#5a6a4a'); p.px(3, 2, st === 'r' ? '#ff6a9a' : '#7a6a5a'); }, 'bob'],
        ['ondas', (p) => { p.line(0, 5, 3, 4, '#e8c890'); p.line(3, 4, 7, 5, '#e8c890'); p.line(1, 7, 6, 6, '#c8a070'); }]] },
    nivorah: { grass: { c: ['#3a4058', '#5a6280', '#7a84a0'], r: ['#5a9ad8', '#a8d8f8', '#ffffff'] }, tip: { c: '#8a94b0', r: '#ffffff' },
      obj: [['esquirla', (p, st) => { p.tri(2, 7, 6, 7, 4, 1, st === 'r' ? '#a8e0ff' : '#6a7490'); p.line(4, 2, 4, 6, '#ffffff'); }, 'glow'],
        ['monticulo', (p) => { p.ell(4, 6, 3.6, 2, '#e8f4ff'); p.ell(3, 5, 1.6, 0.8, '#ffffff'); }],
        ['piedra', (p) => { p.sell(4, 6, 3, 2.2, ['#3a4a6a', '#5a6a8a', '#8a9ab8']); p.rect(2, 4, 4, 1, '#ffffff'); }],
        ['copo', (p, st) => { p.line(4, 2, 4, 7, st === 'r' ? '#c8f0ff' : '#7a84a0'); p.line(2, 4, 6, 6, '#c8f0ff'); p.line(2, 6, 6, 4, '#c8f0ff'); }, 'bob']] },
    thalassyr: { grass: { c: ['#2a2a3e', '#46405a', '#6a6280'], r: ['#0a6a6a', '#16a08a', '#4ae0b0'] }, tip: { c: '#8a7ab0', r: '#b8fff0' },
      obj: [['concha', (p, st) => { p.ell(4, 5, 3, 2.2, st === 'r' ? '#ffd0c8' : '#6a6280'); for (let k = 0; k < 3; k++) p.line(4, 7, 2 + k * 2, 4, st === 'r' ? '#c06a6a' : '#4a4458'); }],
        ['estrella', (p, st) => { const col = st === 'r' ? '#ff7a5a' : '#5a4a5a'; for (let k = 0; k < 5; k++) { const a = k / 5 * 6.28 - 1.57; p.line(4, 5, 4 + Math.cos(a) * 3, 5 + Math.sin(a) * 3, col); } p.px(4, 5, '#ffd166'); }],
        ['alga', (p, st) => { for (let k = 0; k < 3; k++) p.line(2 + k * 2, 7, 2 + k * 2 + (k - 1), 2 + k, st === 'r' ? '#16a08a' : '#3a3448'); }, 'bob'],
        ['coral', (p, st) => { p.line(4, 7, 4, 3, st === 'r' ? '#ff7a8a' : '#4a3a5a'); p.line(4, 5, 6, 3, st === 'r' ? '#ff7a8a' : '#4a3a5a'); p.px(4, 2, '#ffd0d8'); }, 'bub']] },
    umbrelia: { grass: { c: ['#16121c', '#241e2e', '#3a3046'], r: ['#1c1115', '#2c181d', '#442228'] }, tip: { c: '#5a2a6a', r: '#ff4a3a' },
      obj: [['cristal', (p, st) => { p.tri(3, 7, 6, 7, 4, 1, st === 'r' ? '#c8142a' : '#4e0e1e'); p.line(4, 2, 4, 6, st === 'r' ? '#ff8a7a' : '#7a1c2e'); }, 'glow'],
        ['obsidiana', (p) => { p.tri(1, 7, 7, 7, 3, 3, '#16121c'); p.line(3, 3, 6, 6, '#3e3448'); }],
        ['ceniza', (p) => { p.ell(4, 6, 3, 1.4, '#2c2434'); p.px(3, 5, '#5a4a66'); p.px(5, 6, '#ff4a3a'); }, 'glow'],
        ['hueso', (p) => { p.line(1, 6, 7, 5, '#5a5068'); p.px(1, 5, '#7a7088'); p.px(7, 4, '#7a7088'); }]] },
    xertha: { grass: { c: ['#4a3a24', '#6a5636', '#8a744a'], r: ['#c07010', '#e0a020', '#ffd050'] }, tip: { c: '#9a8a60', r: '#fff0a0' },
      obj: [['gota', (p, st) => { p.ell(4, 5, 2, 2.4, st === 'r' ? '#ffb020' : '#6a5a3a'); p.px(3, 4, st === 'r' ? '#fff8d0' : '#9a8a70'); }, 'glow'],
        ['panal', (p, st) => { for (const [x, y] of [[2, 4], [5, 4], [3.5, 6.5]]) P.Sprites.xeHex(p, x, y, 1.6, st === 'r' ? '#e0a020' : '#6a5a3a', st === 'r' ? '#7a3a04' : '#3a3020', null); }],
        ['ambar', (p, st) => { p.tri(2, 7, 6, 7, 4, 1, st === 'r' ? '#ffb020' : '#7a6a4a'); p.line(4, 2, 4, 6, st === 'r' ? '#fff0a0' : '#9a8a70'); }, 'glow'],
        ['huevos', (p, st) => { for (let k = 0; k < 3; k++) p.ell(2 + k * 2, 5, 1, 1.4, st === 'r' ? '#f8f0e0' : '#8a8070'); }, 'bob']] },
    aerthyon: { grass: { c: ['#3a4052', '#525a72', '#727c96'], r: ['#22a8b4', '#56dcd8', '#c8fff4'] }, tip: { c: '#8a94ac', r: '#ffffff' },
      obj: [['pluma', (p, st) => { p.line(1, 7, 7, 2, st === 'r' ? '#ffffff' : '#8a94ac'); p.px(3, 5, st === 'r' ? '#a898ff' : '#5a6280'); p.px(5, 4, st === 'r' ? '#a898ff' : '#5a6280'); }, 'bob'],
        ['nacar', (p, st) => { for (let k = 0; k < 3; k++) p.ell(2 + k * 2, 6 - (k % 2), 1.4, 1.2, st === 'r' ? ['#f4f6ff', '#cdd2ea', '#ffffff'][k] : '#525a72'); }],
        ['cristal', (p, st) => { p.tri(2, 7, 6, 7, 4, 1, st === 'r' ? '#5ae0ff' : '#3a4258'); p.line(4, 2, 4, 6, st === 'r' ? '#ffffff' : '#5a6280'); }, 'glow'],
        ['respiro', (p, st) => { p.ell(4, 6, 3, 1.4, '#3c4676'); p.px(4, 5, st === 'r' ? '#bff6ff' : '#5a6280'); }, 'bub']] },
    dyson: { grass: { c: ['#141822', '#1e2432', '#2c3446'], r: ['#141822', '#1e2432', '#2c3446'] }, tip: { c: '#ff2a4a', r: '#3ac8f0' },
      obj: [['tornillo', (p) => { p.rect(3, 4, 2, 2, '#5e6a86'); p.px(3, 4, '#8a96b4'); }],
        ['cable', (p, st) => { p.line(1, 6, 7, 5, '#2c3446'); p.px(4, 5, st === 'r' ? '#3ac8f0' : '#ff2a4a'); }, 'glow'],
        ['placa', (p) => { p.rect(1, 4, 6, 3, '#1e2432'); p.rect(1, 4, 6, 1, '#404a62'); }],
        ['baliza', (p, st) => { p.rect(3, 3, 2, 4, '#2c3446'); p.px(3, 2, st === 'r' ? '#3ac8f0' : '#ff2a4a'); }, 'glow']] },
    ignaria: { grass: { c: ['#2a2422', '#3a3230', '#4e4440'], r: ['#2a1410', '#4a2618', '#ff6a1a'] }, tip: { c: '#6a5a54', r: '#ffd166' },
      obj: [['brasa', (p, st) => { p.ell(4, 6, 2.6, 1.6, '#2a1e18'); p.px(3, 5, st === 'r' ? '#ff6a1a' : '#5a3a2a'); p.px(5, 6, st === 'r' ? '#ffb030' : '#4a3a2a'); }, 'glow'],
        ['basalto', (p) => { for (let k = 0; k < 3; k++) p.rect(1 + k * 2, 7 - (2 + k), 2, 2 + k, ['#24201c', '#363028', '#4a4238'][k]); }],
        ['obsidiana', (p, st) => { p.tri(1, 7, 7, 7, 4, 2, '#16120f'); p.line(4, 3, 4, 6, st === 'r' ? '#ff6a1a' : '#3a3230'); }, 'glow'],
        ['fumarola', (p, st) => { p.ell(4, 6, 3, 1.4, '#24201c'); p.px(4, 5, st === 'r' ? '#ffb030' : '#4a3a2a'); }, 'bub']] },
    mykoris: { grass: { c: ['#2a2430', '#3e3446', '#564a60'], r: ['#0e3a2a', '#16804a', '#3ad070'] }, tip: { c: '#7a6a8a', r: '#a8ff7a' },
      obj: [['setita', (p, st) => { p.rect(4, 5, 1, 3, '#e8dcc0'); p.ell(4, 4, 2.6, 1.6, st === 'r' ? '#5af0f0' : '#4a4458'); p.px(3, 3, '#ffffff'); }, 'glow'],
        ['setitas', (p, st) => { for (let k = 0; k < 3; k++) { p.px(2 + k * 2, 6, '#e8dcc0'); p.px(2 + k * 2, 5, st === 'r' ? ['#ff7ad8', '#c06aff', '#ffb060'][k] : '#5a4a60'); } }, 'bob'],
        ['bejin', (p, st) => { p.sell(4, 5, 3, 2.6, st === 'r' ? ['#8a7a90', '#c8b8c8', '#ffffff'] : ['#3a3242', '#4e4458', '#665a70']); }, 'bub'],
        ['micelio', (p, st) => { const col = st === 'r' ? '#5ef0a0' : '#5a4a6a'; p.line(0, 6, 3, 5, col); p.line(3, 5, 7, 6, col); p.line(3, 5, 4, 2, col); }, 'glow']] }
  };
  P.OWD = { DEF };
  P.Sprites.buildOwDetails = function () { for (const pl in DEF) DEF[pl].obj.forEach(([n, fn], i) => { for (const st of ['c', 'r']) P.mk('owd_' + pl + '_' + i + '_' + st, 8, 8, 1, p => fn(p, st), { outline: false }); }); };
  (function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildOwDetails(); }; })();

  const H = (a, b, s) => { let h = (a * 374761393 + b * 668265263 + s * 2246822519) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  // pasada de detalles: después de las casillas y antes de los objetos ordenados por profundidad
  P.OWD.draw = function (sc, c, cx, cy, tx0, ty0) {
    const D = DEF[sc.planet] || DEF.verzara, seed = P.hash(sc.planet), t = sc.t, plx = sc.pl.x, ply = sc.pl.y;
    for (let ty = ty0; ty <= ty0 + 17; ty++) for (let tx = tx0; tx <= tx0 + 30; tx++) {
      if (ty < 0 || tx < 0 || ty >= sc.H || tx >= sc.W) continue;
      const g = sc.g[ty][tx]; if (g !== 'g' && g !== 'i' && g !== 'p') continue; if (sc.block && sc.block[ty] && sc.block[ty][tx]) continue;
      const r = H(tx, ty, seed), dens = g === 'g' ? 0.62 : g === 'i' ? 0.32 : 0.14; if (r > dens) continue;
      const st = sc.isRest(sc.regionOf(tx, ty), tx * 16, ty * 16) ? 'r' : 'c', X = tx * 16 - cx, Y = ty * 16 - cy, r2 = H(ty, tx, seed + 7);
      // matas de pasto (no en caminos): olas de viento y se apartan al pasar
      if (g !== 'p' && r2 < 0.7) {
        const G = D.grass[st], n = 3 + Math.floor(r2 * 4), bx = X + 2 + Math.floor(H(tx, ty, seed + 3) * 10), by = Y + 6 + Math.floor(H(tx, ty, seed + 5) * 8), wx = tx * 16 + 8, wy = ty * 16 + 8;
        const wind = Math.sin(t * 0.045 - tx * 0.35 - ty * 0.2) * 1.2, dx = wx - plx, dy = wy - ply, near = Math.abs(dx) < 14 && Math.abs(dy) < 12 ? Math.sign(dx || 1) * 2 : 0;
        for (let k = 0; k < n; k++) { const x0 = bx + k * 2 - n, h = 3 + ((k * 7 + tx) % 3), lean = Math.round((wind + near) * (h / 5)); c.fillStyle = G[k % 2 ? 0 : 1]; c.fillRect(x0, by - h + 1, 1, h - 1); c.fillStyle = G[2]; c.fillRect(x0 + lean, by - h, 1, 1); if (k === 1 && r2 < 0.18) { c.fillStyle = D.tip[st]; c.fillRect(x0 + lean, by - h - 1, 1, 1); } }
      }
      // objeto del planeta (piedra, flor, concha, cristal, seta…)
      if (r2 >= 0.45 || g === 'p') {
        const oi = Math.floor(H(tx, ty, seed + 11) * D.obj.length), o = D.obj[oi], anim = o[2], ox = X + 2 + Math.floor(H(tx, ty, seed + 13) * 7), oy = Y + 2 + Math.floor(H(tx, ty, seed + 17) * 7);
        if (g === 'p' && anim) continue;
        let yy = oy; if (anim === 'bob') yy += Math.round(Math.sin(t * 0.06 + tx + ty) * 0.6);
        if (anim === 'glow' && (tx + ty) % 2 === 0) { const k = (Math.sin(t * 0.05 + tx * 1.7 + ty) + 1) / 2; if (st === 'r' || sc.planet === 'umbrelia') P.drawGlow(c, ox + 4, oy + 5, 6 + k * 3, sc.planet === 'mykoris' ? '#5ef0a0' : sc.planet === 'nivorah' ? '#bff6ff' : '#ff4a3a', 0.15 + k * 0.25); }
        c.drawImage(P.S['owd_' + (DEF[sc.planet] ? sc.planet : 'verzara') + '_' + oi + '_' + st].f[0], ox, yy);
        if (anim === 'bub' && (t + tx * 13 + ty * 7) % 90 < 30) { const k = ((t + tx * 13 + ty * 7) % 90) / 30; c.fillStyle = st === 'r' ? 'rgba(220,255,240,' + (1 - k) + ')' : 'rgba(180,140,220,' + (1 - k) + ')'; c.fillRect(ox + 4, Math.round(oy + 2 - k * 8), 1, 1); }
      }
    }
  };
  // al caminar sobre el pasto se levantan briznas y polvo
  const baseUpd = P.OverworldScene.prototype.update;
  P.OverworldScene.prototype.update = function () {
    baseUpd.apply(this, arguments);
    const pl = this.pl, moving = pl && (Math.abs(pl.vx || 0) + Math.abs(pl.vy || 0) > 0.1 || pl.moving); if (!moving || this.t % 8) return;
    const tx = Math.floor(pl.x / 16), ty = Math.floor((pl.y + 4) / 16), g = this.g[ty] && this.g[ty][tx]; if (g !== 'g' && g !== 'i') return;
    const D = DEF[this.planet] || DEF.verzara, st = this.isRest(this.regionOf(tx, ty), tx * 16, ty * 16) ? 'r' : 'c';
    this.parts.add({ x: pl.x + P.rand(-4, 4), y: pl.y + 4, vx: P.rand(-0.5, 0.5), vy: -P.rand(0.3, 0.8), g: 0.05, life: 22, col: g === 'g' ? P.pick(D.grass[st]) : '#d8c8a8', size: 1 });
  };
})();
