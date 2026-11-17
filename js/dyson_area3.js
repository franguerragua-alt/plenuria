'use strict';
// ESFERA DE DYSON · ÁREA III — EL IMPERIO ESQUELÉTICO (niveles 10-13). El centro de poder: avenida de los monumentos,
// hangares imperiales, el Palacio de Gobierno del Área Burguesa y el Parlamento, donde espera GERSELLE con su traje robótico.
// Mecánica propia: reflectores de vigilancia (W en el Área III) que dan la alarma si te iluminan.
(function () {
  const D = P.DSC, M = D.m, W = 640, H = P.H, SET = P.DS.SETS, mk = () => new P.Painter(W, H), cv = p => p.canvas(), B4 = P.BAYER4;
  const BK = ['#06040a', '#100a12', '#1c141e', '#2a1e2a', '#3e2c3a'], RD = D.red, GO = D.gold, BO = D.bone;
  // estatua colosal de un líder (silueta con rasgos: cuernos y báculo para Merek, gorra para Thersek, moño para Gerselle)
  const statue = (p, cx, by, s, who) => { const C = [BK[1], BK[2], BK[3], BK[4]]; p.rect(cx - 22 * s, by - 16 * s, 44 * s, 16 * s, BK[2]); p.rect(cx - 22 * s, by - 16 * s, 44 * s, 2 * s, GO[1]);
    p.rect(cx - 9 * s, by - 70 * s, 18 * s, 54 * s, C[1]); p.rect(cx - 9 * s, by - 70 * s, 3 * s, 54 * s, C[3]); p.sell(cx, by - 80 * s, 8 * s, 9 * s, [BO[0], BO[1], BO[2], BO[3]]); p.rect(cx - 4 * s, by - 82 * s, 3 * s, 3 * s, BK[0]); p.rect(cx + 1 * s, by - 82 * s, 3 * s, 3 * s, BK[0]);
    p.rect(cx - 16 * s, by - 68 * s, 32 * s, 8 * s, C[2]);
    if (who === 'merek') { for (const sd of [-1, 1]) { p.thick(cx + sd * 6 * s, by - 86 * s, cx + sd * 14 * s, by - 98 * s, 3 * s, BK[3]); p.thick(cx + sd * 14 * s, by - 98 * s, cx + sd * 10 * s, by - 106 * s, 2 * s, BK[3]); } p.rect(cx + 14 * s, by - 100 * s, 3 * s, 84 * s, BK[3]); p.sell(cx + 15.5 * s, by - 104 * s, 5 * s, 5 * s, [RD[0], RD[1], RD[2], RD[3]]); p.tri(cx - 16 * s, by - 62 * s, cx + 16 * s, by - 62 * s, cx, by - 16 * s, RD[1]); }
    if (who === 'thersek') { p.rect(cx - 10 * s, by - 92 * s, 20 * s, 5 * s, '#123a18'); p.rect(cx - 12 * s, by - 88 * s, 24 * s, 2 * s, BK[0]); p.px(cx, by - 91 * s, GO[2]); for (const sd of [-1, 1]) p.thick(cx + sd * 10 * s, by - 60 * s, cx + sd * 24 * s, by - 40 * s, 2 * s, BK[3]); }
    if (who === 'gerselle') { p.sell(cx, by - 92 * s, 7 * s, 6 * s, [BK[0], BK[1], BK[2], BK[3]]); p.px(cx + 4 * s, by - 92 * s, RD[3]); p.rect(cx - 9 * s, by - 70 * s, 18 * s, 54 * s, BK[1]); p.line(cx - 2 * s, by - 68 * s, cx + 4 * s, by - 40 * s, RD[2]); } };
  // AVENIDA DE LOS MONUMENTOS: estatuas de los tres líderes, estandartes, agujas del palacio, focos y desfile
  SET.monuments = () => {
    const r = P.RNG(7101), sky = new P.Painter(P.W, H); sky.grad(0, 0, P.W, H, ['#06020a', '#14040e', '#2a0a14', '#4a0e18', '#6a1a1a']); for (let i = 0; i < 60; i++) sky.px(r.int(0, P.W), r.int(0, 100), '#8a5a6a');
    const far = mk(); for (let i = 0; i < 9; i++) P.DS.tower(far, 30 + i * 72, H - 40, r.int(6, 10), r.int(90, 170), [BK[0], BK[1], BK[2], BK[3], BK[4], GO[1]], RD[2], r, { taper: 0.8, ant: 18, fins: i % 3 === 0 });
    const mid = mk(); ['thersek', 'merek', 'gerselle'].forEach((w, i) => statue(mid, 110 + i * 210, H - 30, i === 1 ? 1.7 : 1.3, w));
    const mid2 = mk(); for (let i = 0; i < 8; i++) { const x = 30 + i * 80; mid2.rect(x, 40, 3, H - 40, BK[3]); mid2.rect(x + 3, 46, 22, 90, RD[1]); mid2.rect(x + 3, 46, 22, 2, GO[2]); mid2.tri(x + 3, 136, x + 25, 136, x + 14, 146, RD[1]); mid2.sell(x + 14, 80, 6, 6, [BO[1], BO[2], BO[3], '#ffffff']); mid2.px(x + 12, 80, BK[0]); mid2.px(x + 16, 80, BK[0]); }
    const near = mk(); for (let i = 0; i < 10; i++) { const x = i * 66; near.rect(x, H - 18, 50, 18, BK[2]); near.rect(x, H - 18, 50, 2, GO[1]); near.rect(x + 22, H - 46, 6, 28, BK[3]); near.sell(x + 25, H - 50, 5, 4, [RD[0], RD[1], RD[3], RD[4]]); }
    return { sky: sky.canvas(), L: [{ im: cv(far), par: 0.1, y: 0 }, { im: cv(mid), par: 0.22, y: 0 }, { im: cv(mid2), par: 0.4, y: 0 }, { im: cv(near), par: 0.66, y: 0 }],
      fx(L, c, cx, vy, k) { const t = L.t;
        if (k === 0) for (let i = 0; i < 4; i++) { const a = Math.sin(t * 0.008 + i * 1.6) * 0.5 - Math.PI / 2, X = 60 + i * 120; c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.08; c.fillStyle = '#ffd0c0'; c.beginPath(); c.moveTo(X, H); c.lineTo(X + Math.cos(a - 0.05) * 400, H + Math.sin(a - 0.05) * 400); c.lineTo(X + Math.cos(a + 0.05) * 400, H + Math.sin(a + 0.05) * 400); c.fill(); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; }
        if (k === 3) for (let i = 0; i < 26; i++) { const X = ((t * 0.4 + i * 22 - cx * 0.4) % 600 + 600) % 600 - 40, Y = Math.round(H - 36 + vy * 0.4), step = (t >> 3) % 2; c.fillStyle = '#100a12'; c.fillRect(Math.round(X), Y, 5, 10); c.fillStyle = '#d8d0b8'; c.fillRect(Math.round(X) + 1, Y - 4, 3, 4); c.fillStyle = '#1c141e'; c.fillRect(Math.round(X) + (step ? 0 : 3), Y + 10, 2, 3); c.fillStyle = '#ff2a4a'; c.fillRect(Math.round(X) + 2, Y - 3, 1, 1); } } };
  };
  // HANGARES DEL IMPERIO: nave capital en construcción, grúas, puertas al espacio y cazas despegando
  SET.hangar = () => {
    const r = P.RNG(7201), sky = new P.Painter(P.W, H); sky.grad(0, 0, P.W, H, ['#04040a', '#0a0a14', '#12121e', '#1a1a28', '#101018']); for (let x = 80; x < 400; x++) for (let y = 30; y < 120; y++) if ((x * 7 + y * 13) % 97 === 0) sky.px(x, y, '#ffffff'); sky.rect(80, 30, 320, 2, M[5]); sky.rect(80, 120, 320, 2, M[5]); sky.rect(78, 30, 2, 92, M[5]); sky.rect(400, 30, 2, 92, M[5]);
    const far = mk(); far.rect(60, 90, 520, 60, BK[2]); far.rect(60, 90, 520, 3, BK[4]); far.tri(580, 90, 640, 120, 580, 150, BK[3]); for (let x = 70; x < 570; x += 12) far.rect(x, 110, 6, 4, r() < 0.4 ? RD[3] : BK[1]); far.rect(120, 70, 160, 20, BK[1]); for (let x = 60; x < 580; x += 40) P.DS.truss(far, x, 90, x + 20, 40, M[3], 4);
    const mid = mk(); for (let i = 0; i < 4; i++) { const x = 40 + i * 160; mid.rect(x, 20, 8, H - 20, M[2]); mid.rect(x - 40, 20, 90, 8, M[3]); mid.rect(x - 40, 20, 90, 1, M[6]); }
    const mid2 = mk(); for (let i = 0; i < 6; i++) { const x = 20 + i * 110; mid2.rect(x, H - 60, 70, 60, M[1]); mid2.rect(x, H - 60, 70, 2, GO[1]); for (let k2 = 0; k2 < 3; k2++) mid2.rect(x + 8 + k2 * 20, H - 50, 14, 22, M[0]); }
    const near = mk(); for (let i = 0; i < 8; i++) { const x = i * 84; near.rect(x, H - 22, 70, 22, BK[1]); near.rect(x, H - 22, 70, 2, M[4]); for (let k2 = 0; k2 < 5; k2++) near.rect(x + 4 + k2 * 14, H - 16, 8, 3, (k2 + i) % 2 ? GO[1] : BK[0]); }
    return { sky: sky.canvas(), L: [{ im: cv(far), par: 0.12, y: 0 }, { im: cv(mid), par: 0.26, y: 0 }, { im: cv(mid2), par: 0.42, y: 0 }, { im: cv(near), par: 0.68, y: 0 }],
      fx(L, c, cx, vy, k) { const t = L.t;
        if (k === 0) for (let i = 0; i < 6; i++) { const ph = (t * 0.6 + i * 80) % 480, X = 400 - ph * 0.7, Y = 110 - ph * 0.15; if (X > 70) P.DS.ship(c, X, Y + vy * 0.03, 0.5, 0, '#2c3446', '#ff2a4a', t); }
        if (k === 1) { const off = -((cx * 0.12) % W); for (let i = 0; i < 8; i++) for (const rep of [off, off + W]) { const X = Math.round(rep + 80 + i * 64), Y = Math.round(92 + vy * 0.12); if ((t + i * 23) % 50 < 6) { P.drawGlow(c, X, Y, 10, '#ffd166', 0.8); c.fillStyle = '#ffffff'; c.fillRect(X, Y, 1, 1); } } }
        if (k === 2) { const off = -((cx * 0.26) % W); for (let i = 0; i < 4; i++) for (const rep of [off, off + W]) { const X = Math.round(rep + 40 + i * 160 + Math.sin(t * 0.01 + i) * 34), Y = Math.round(28 + vy * 0.26); c.fillStyle = '#404a62'; c.fillRect(X - 6, Y, 12, 6); c.fillStyle = '#5e6a86'; c.fillRect(X, Y + 6, 1, 40 + (i % 2) * 20); c.fillStyle = '#2c3446'; c.fillRect(X - 8, Y + 46 + (i % 2) * 20, 16, 10); } } } };
  };
  // PALACIO DE GOBIERNO (Área Burguesa): columnas de mármol negro y oro, lámparas de araña, retratos de los líderes, ventanal
  SET.palace = () => {
    const r = P.RNG(7301), sky = new P.Painter(P.W, H); sky.grad(0, 0, P.W, H, ['#080410', '#120818', '#1c0c1e', '#2a1222', '#160a14']);
    sky.rect(150, 20, 180, 150, '#1a2a5a'); for (let y = 20; y < 170; y++) for (let x = 150; x < 330; x++) if (B4[y & 3][x & 3] / 16 < (y - 20) / 200) sky.px(x, y, '#fff0c0'); for (let i = 0; i < 9; i++) { const x = 160 + i * 20, h = r.int(40, 110); sky.rect(x, 170 - h, 10, h, '#2a3a7a'); sky.px(x + 4, 170 - h - 2, '#ffd166'); } sky.rect(146, 16, 188, 4, GO[1]); sky.rect(146, 170, 188, 4, GO[1]); sky.rect(238, 20, 4, 150, BK[2]);
    const far = mk(); for (let i = 0; i < 3; i++) { const x = 70 + i * 220; far.rect(x - 30, 40, 60, 80, GO[0]); far.rect(x - 26, 44, 52, 72, BK[1]); far.sell(x, 70, 12, 14, [BO[0], BO[1], BO[2], BO[3]]); far.rect(x - 4, 66, 3, 3, BK[0]); far.rect(x + 2, 66, 3, 3, BK[0]); far.rect(x - 18, 86, 36, 28, ['#123a18', BK[2], '#1c141e'][i]); if (i === 1) for (const sd of [-1, 1]) far.thick(x + sd * 6, 58, x + sd * 14, 48, 2, BK[3]); if (i === 2) far.sell(x, 56, 9, 6, [BK[0], BK[1], BK[2], BK[3]]); if (i === 0) far.rect(x - 10, 54, 20, 4, '#123a18'); }
    const mid = mk(); for (let i = 0; i < 8; i++) { const x = 20 + i * 82; mid.rect(x, 0, 16, H, BK[2]); mid.rect(x, 0, 3, H, BK[4]); mid.rect(x + 13, 0, 3, H, BK[0]); mid.rect(x - 4, 30, 24, 6, GO[1]); mid.rect(x - 4, H - 40, 24, 8, GO[1]); mid.rect(x + 6, 40, 4, H - 90, RD[1]); }
    const near = mk(); for (let i = 0; i < 5; i++) { const x = 60 + i * 130; near.line(x, 0, x, 30, GO[1]); for (let k2 = 0; k2 < 5; k2++) near.line(x, 30, x - 20 + k2 * 10, 46, GO[1]); near.rect(x - 22, 46, 44, 3, GO[2]); }
    const lamps = [60, 190, 320, 450, 580];
    return { sky: sky.canvas(), L: [{ im: cv(far), par: 0.14, y: 0 }, { im: cv(mid), par: 0.32, y: 0 }, { im: cv(near), par: 0.6, y: 0 }],
      fx(L, c, cx, vy, k) { const t = L.t;
        if (k === 3) { const off = -((cx * 0.6) % W); for (const x of lamps) for (const rep of [off, off + W]) { const X = Math.round(rep + x), Y = Math.round(48 + vy * 0.6); if (X < -30 || X > P.W + 30) continue; for (let k2 = 0; k2 < 5; k2++) { const fl = (t + k2 * 7 + x) % 20 < 2; c.fillStyle = fl ? '#ffffff' : '#ffd166'; c.fillRect(X - 20 + k2 * 10, Y, 2, 3); } P.drawGlow(c, X, Y + 2, 30, '#ffd080', 0.35); } }
        if (k === 0) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.07 + Math.sin(t * 0.01) * 0.02; c.fillStyle = '#fff0c0'; c.beginPath(); c.moveTo(150, 20 + vy * 0.03); c.lineTo(330, 20 + vy * 0.03); c.lineTo(400, H); c.lineTo(90, H); c.fill(); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; } } };
  };
  // PARLAMENTO (arena de GERSELLE): gradas en semicírculo, estrado, pantallas holográficas, cúpula de luz
  SET.parliament = () => {
    const r = P.RNG(7401), sky = new P.Painter(P.W, H); sky.grad(0, 0, P.W, H, ['#e8ecf6', '#c8d0e4', '#a8b0c8', '#8890a8', '#6a7088']);
    for (let y = 0; y < 40; y++) { const w = 160 - y * 2; sky.ell(240, y, w, 8, y < 30 ? '#f4f6ff' : '#d8dcec'); } for (let y = 0; y < H; y++) for (let x = 200; x < 280; x++) if (B4[y & 3][x & 3] / 16 < 0.25 * (1 - y / H)) sky.px(x, y, '#ffffff');
    const far = mk(); for (let i = 0; i < 4; i++) { const x = 70 + i * 170; far.rect(x - 30, 50, 60, 100, '#1a5a7a'); far.rect(x - 26, 54, 52, 92, '#2a8ab0'); far.sell(x, 90, 12, 18, ['#5ae0ff', '#8ae8ff', '#bff6ff', '#ffffff']); far.rect(x - 2, 104, 4, 30, '#bff6ff'); far.rect(x - 10, 116, 20, 3, '#bff6ff'); far.rect(x - 34, 46, 68, 4, GO[1]); }
    const mid = mk(); for (let i = 0; i < 8; i++) { const x = i * 84; mid.rect(x, 0, 18, H, '#c8ccd8'); mid.rect(x, 0, 4, H, '#ffffff'); mid.rect(x + 14, 0, 4, H, '#8a90a8'); mid.rect(x - 4, 0, 26, 10, GO[1]); mid.rect(x - 4, H - 70, 26, 6, GO[1]); }
    const near = mk(); for (let row = 0; row < 4; row++) for (let x = 0; x < W; x += 22) { const y = H - 70 + row * 16; near.rect(x + 2, y, 18, 10, '#1c2a3a'); near.rect(x + 2, y, 18, 2, '#2c3e52'); near.rect(x + 4, y + 10, 14, 4, '#3a4a5e'); near.px(x + 10, y + 4, '#5ae0ff'); }
    return { sky: sky.canvas(), L: [{ im: cv(far), par: 0.1, y: 0 }, { im: cv(mid), par: 0.24, y: 0 }, { im: cv(near), par: 0.5, y: 10 }],
      fx(L, c, cx, vy, k) { const t = L.t;
        if (k === 1) { const off = -((cx * 0.1) % W); for (let i = 0; i < 4; i++) for (const rep of [off, off + W]) { const X = Math.round(rep + 70 + i * 170), Y = Math.round(54 + vy * 0.1); if (X < -40 || X > P.W + 40) continue; for (let row = 0; row < 18; row++) if ((row + (t >> 2)) % 9 === 0) { c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(X - 26, Y + row * 5, 52, 1); } if ((t >> 5) % 4 === i) { c.fillStyle = 'rgba(255,42,74,0.25)'; c.fillRect(X - 26, Y, 52, 92); } } } } };
  };

  // ---------- chunks del Área III ----------
  const pt = P.DS_CHUNK, E = '........................', G = '########################', G3 = [G, G, G];
  const col = (x, ch, n) => { const r = []; for (let i = 0; i < n; i++) r.push('.'.repeat(x) + ch + '.'.repeat(23 - x)); return r; };
  Object.assign(P.CHUNKS, {
    ds3_parade: pt(8, ['........D.........D.....', E, '...RRRRR........RRRRR...', E, E, '..s....K......s....K....', ...G3]),
    ds3_lights: pt(8, [E, '.....d...........d......', '.....====....====.......', E, E, '...W......s.......W.....', ...G3]),
    ds3_hangar: pt(6, ['..............D.........', E, '.........v..............', E, '...v...........v........', '..s.....................', E, '####~~~~~~~~~~~~~~~~####', '####~~~~~~~~~~~~~~~~####', G, G]),
    ds3_gallery: pt(3, ['RRRRRRRRRRRRRRRRRRRRRRRR', E, E, '.....O.........O........', E, E, E, E, E, '..s....V......K....V....', ...G3, G]),
    ds3_vault: pt(2, [...col(15, 'G', 11), '....Z......K...G....s...', ...G3]),
    ds3_stair: pt(4, ['...................*....', '..................RRRRRR', '..............RRRR......', '..........RRRR..........', '......RRRR..............', E, '..s.......D.............', E, E, '..W.........s.......K...', ...G3])
  });
  const AREA3 = [
    { id: 10, name: 'Avenida de los Monumentos', sub: 'Área III · El Imperio Esquelético', theme: 'monuments', bg: 'monuments', area: 3, music: 'dyson_c', sky: 'dusk',
      rows: [['ds_start', 'ds3_parade', 'ds3_lights', 'ds_checkpoint', 'ds3_stair', 'ds3_parade', 'ds_secret', 'ds_extractor', 'ds_exit']], events: [], stars: [{ t: 'holo', id: 'h81' }],
      intro: [['elara', 'El Imperio Esquelético, {N}. Mira esas estatuas: así se ven a sí mismos.'], ['elara', 'Los reflectores dan la alarma si te iluminan. Muévete entre sus barridos.']] },
    { id: 11, name: 'Hangares del Imperio', sub: 'Área III · El Imperio Esquelético', theme: 'hangar', bg: 'hangar', area: 3, music: 'dyson_c2', sky: 'dusk',
      rows: [['ds_start', 'ds3_hangar', 'ds3_lights', 'ds_checkpoint', 'ds_elite', 'ds3_hangar', 'ds_lift', 'ds_extractor', 'ds_exit']], events: [], stars: [{ t: 'holo', id: 'h82' }, { t: 'res', crys: 4 }], arenaLock: true,
      intro: [['elara', 'Los hangares donde construían la flota que destruyó la República. Hay un caminante de asedio custodiando la nave capital.']] },
    { id: 12, name: 'Palacio de Gobierno', sub: 'Área III · El Imperio Esquelético · Área Burguesa', theme: 'palace', bg: 'palace', area: 3, music: 'dyson_c3', sky: 'golden',
      rows: [['ds_start', 'ds3_gallery', 'ds3_vault', 'ds_checkpoint', 'ds3_stair', 'ds3_gallery', 'ds3_lights', 'ds_extractor', 'ds_exit']],
      events: [{ t: 'transmission', who: 'gerselle', lines: [['gerselle', 'Estás pisando mármol de NÍVORAH y oro de KHAZIR, K-7. El Área Burguesa no se construyó sola.'], ['gerselle', 'Sube al Parlamento. Votaremos tu destino. El resultado ya lo conozco.']] }],
      stars: [{ t: 'holo', id: 'h83' }],
      intro: [['elara', 'El Palacio de Gobierno. Esos retratos… son ellos tres. Y hay un cuarto marco, vacío.']] },
    { id: 13, name: 'El Parlamento', sub: 'Área III · El Imperio Esquelético', theme: 'boss', bg: 'parliament', area: 3, music: 'boss', boss: 'gerselle', sky: 'day', arena: 'gerselle',
      intro: [['elara', 'GERSELLE, la Primera Ministra, dentro de un traje robótico de combate.'], ['elara', 'Sus abanicos desvían lo que le llega de frente. Rodéala o castígala cuando se lance.']] }
  ];
  for (const l of AREA3) if (!P.LV.dyson.levels.some(x => x.id === l.id)) P.LV.dyson.levels.push(l);
  P.LV.dyson.levels.sort((a, b) => a.id - b.id);

  Object.assign(P.D.HOLOS, {
    h81: { title: 'Placa de la Avenida', text: '«A MEREK, que trajo el orden. A THERSEK, que trajo el progreso. A GERSELLE, que trajo la ley.» Debajo, una línea borrada a golpes.' },
    h82: { title: 'Registro de hangar', text: 'Flota de pacificación lista. Destino: la República Solar. Motivo oficial: protegerla de sí misma.' },
    h83: { title: 'Acta del Parlamento · Sesión 1', text: 'Se declara vacante la Presidencia de la República. El presidente electo no comparece. Se nombra a Merek presidente en funciones.' },
    h84: { title: 'Mensaje de N-0', text: '«Siete, ya casi estás. Cuando llegues al Trono, no le dejes hablar demasiado. Miente bien.»' }
  });
  P.D.BOSSES.gerselle = { name: 'GERSELLE', title: 'La Primera Ministra', planet: 'dyson', col: '#ff2a4a', col2: '#f4eedc', music: 'gerselle' };
  P.D.BOSS_OUTRO.gerselle = { lines: [['elara', 'El traje de GERSELLE se apaga. Ella sale de la cabina, sin fuerzas.'], ['gerselle', 'La legítima… Yo era la legítima. Firmé el acta… cuando tú no viniste.'], ['hero', '¿Cuándo yo no vine?'], ['gerselle', 'Ah… no lo recuerdas. Claro. Te lo quitaron todo… menos la armadura.'], ['gerselle', 'Ve al Trono. Que te lo cuente él. A mí ya no me queda nada que gobernar.'], ['elara', 'El camino al Trono del Imperio está abierto, {N}. Pero la cúpula lo protege.']] };
  P.D.POST_BOSS.gerselle = [['merek', 'Gerselle… Thersek… NÉMESIS. Todos han caído.'], ['merek', 'Ven, entonces. Te espero en mi Trono. Y trae a tus cinco barcas: las necesitarás para atravesar mi cúpula.']];
  P.D.ACHIEVEMENTS.push({ id: 'gerselle', name: 'Moción de censura', desc: 'Derrota a GERSELLE.' });
  const baseFC = P.D.FIRST_CLEAR.dyson; P.D.FIRST_CLEAR.dyson = (S, id) => { baseFC(S, id); if (id === 13) S.ach('gerselle'); };
  Object.assign(P.Audio.TRACKS, {
    dyson_c: { bpm: 84, root: 38, scale: [0, 2, 3, 5, 7, 8, 11], prog: [0, 5, 6, 4], lead: 'sawtooth', bass: 'sawtooth', arp: 'square', drums: 2, pad: true, seed: 1071 },
    dyson_c2: { bpm: 116, root: 40, scale: [0, 1, 3, 5, 7, 8, 10], prog: [0, 6, 5, 6], lead: 'square', bass: 'sawtooth', arp: 'square', drums: 2, pad: true, seed: 1073 },
    dyson_c3: { bpm: 72, root: 44, scale: [0, 2, 3, 5, 7, 8, 11], prog: [0, 3, 6, 4], lead: 'triangle', bass: 'sine', arp: 'triangle', drums: 0, pad: true, seed: 1077 },
    gerselle: { bpm: 126, root: 42, scale: [0, 1, 3, 5, 7, 8, 11], prog: [0, 3, 1, 4], lead: 'square', bass: 'sawtooth', arp: 'triangle', drums: 2, pad: true, seed: 1081, meter: 12, motif: [4, null, null, 5, 4, 2], motifB: [0, null, 2, 4, null, 7] },
    gerselle_3: { bpm: 148, root: 43, scale: [0, 1, 3, 5, 6, 8, 11], prog: [0, 1, 3, 5], lead: 'sawtooth', bass: 'square', arp: 'sawtooth', drums: 2, pad: true, seed: 1083, meter: 12, motif: [4, null, null, 5, 4, 2], motifB: [0, null, 2, 4, null, 7] }
  });

  // reflector de vigilancia (W en el Área III): un haz barre el suelo; si te ilumina, suena la alarma y llega un dron
  P.Searchlight = class extends P.Ent {
    constructor(L, x, y) { super(L, x - 6, y - 70, 12, 70); this.base = y; this.ph = (x * 3) % 400; this.cool = 0; }
    get beamX() { return this.cx + Math.sin((this.L.t + this.ph) * 0.012) * 70; }
    update() { this.t++; const L = this.L, p = L.player; if (this.cool > 0) this.cool--; const bx = this.beamX;
      if (!p.dead && this.cool === 0 && Math.abs(p.cx - bx) < 14 && p.y + p.h > this.base - 40) { this.cool = 240; this.alarm = 90; P.Audio.sfx('charge'); P.toast('¡ALARMA! Te han detectado', { col: P.UIC.red, life: 80 }); const e = L.add(new P.Fly(L, bx - 8, this.base - 120, true)); e.kind = null; L.fx.push({ k: 'ring', x: bx, y: this.base, t: 0, life: 20, r: 40, col: '#ff2a4a' }); }
      if (this.alarm > 0) this.alarm--; }
    umLight() { return [this.beamX, this.base - 4, 30, 0.9]; }
    draw(c, cx, cy) { const x = Math.round(this.cx - cx), top = Math.round(this.y - cy), bx = Math.round(this.beamX - cx), by = Math.round(this.base - cy), al = this.alarm > 0 && (this.t >> 3) % 2;
      c.fillStyle = '#2a1e2a'; c.fillRect(x - 3, top, 6, by - top); c.fillStyle = '#c0962a'; c.fillRect(x - 6, top - 4, 12, 5); c.fillStyle = al ? '#ff2a4a' : '#fff0c0'; c.fillRect(x - 2, top - 2, 4, 2);
      c.globalCompositeOperation = 'lighter'; c.globalAlpha = al ? 0.3 : 0.16; c.fillStyle = al ? '#ff5a6a' : '#fff0c0'; c.beginPath(); c.moveTo(x - 2, top); c.lineTo(x + 2, top); c.lineTo(bx + 14, by); c.lineTo(bx - 14, by); c.fill(); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
      c.globalAlpha = 0.5; c.fillStyle = al ? '#ff2a4a' : '#fff0c0'; c.fillRect(bx - 14, by - 2, 28, 2); c.globalAlpha = 1; }
  };
  const baseW = P.LV.dyson.spawn.W; P.LV.dyson.spawn.W = (L, x, y, m, R) => { if (L.def.area === 3) L.add(new P.Searchlight(L, x, L.snapY(m.x, m.y))); else baseW(L, x, y, m, R); };
})();
