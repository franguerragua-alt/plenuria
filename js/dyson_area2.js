'use strict';
// ESFERA DE DYSON · ÁREA II — EL CORAZÓN TECNOLÓGICO (niveles 6-9). Más luminosa y sofisticada que el Dominio Exterior:
// megaciudad alienígena de torres azules con orbes dorados, núcleo de reactores, laboratorios de experimentación de Thersek y
// el corazón nuclear del complejo biotecnológico, donde espera THERSEK. Mecánica propia: tanques de experimentos que estallan.
(function () {
  const D = P.DSC, M = D.m, W = 640, H = P.H, SET = P.DS.SETS, mk = () => new P.Painter(W, H), cv = p => p.canvas(), B4 = P.BAYER4;
  const BL = ['#0a1030', '#142060', '#20368e', '#3a5ac0', '#6a8ae8'], GO = ['#7a4a0a', '#c0801a', '#ffb030', '#ffe080'];
  // torre de la megaciudad (referencia: azul con orbes dorados y luces verticales)
  const ctower = (p, cx, by, w, h, r, orbs) => { for (let y = 0; y < h; y++) { const t = y / h, ww = w * (1 - t * 0.35) + (y % 30 < 4 ? 2 : 0); p.rect(Math.round(cx - ww), by - y, Math.round(ww * 2), 1, BL[(y >> 4) % 2 ? 1 : 2]); p.px(Math.round(cx - ww), by - y, BL[4]); p.px(Math.round(cx + ww) - 1, by - y, BL[0]); if (y % 30 === 0) p.rect(Math.round(cx - ww - 2), by - y, Math.round(ww * 2 + 4), 2, GO[1]); }
    for (let y = 8; y < h - 8; y += 6) for (let x = Math.round(cx - w + 3); x < cx + w - 3; x += 4) if (r() < 0.45) p.rect(x, by - y, 2, 3, r() < 0.3 ? GO[3] : '#5ae0ff');
    for (let k = 0; k < orbs; k++) { const y = by - h * (0.3 + k * 0.25), rr = w * 0.6; p.sell(cx, y, rr, rr, [GO[0], GO[1], GO[2], GO[3]]); p.ell(cx, y, rr * 0.45, rr * 0.45, BL[0]); p.px(cx, y, '#ffffff'); }
    p.tri(cx - w * 0.5, by - h, cx + w * 0.5, by - h, cx, by - h - w * 2, BL[3]); p.line(cx, by - h - w * 2, cx, by - h - w * 2 - 14, GO[3]); };
  // MEGACIUDAD DE NEÓN: avenida de torres azules y doradas, haces de luz verticales, tráfico de naves
  SET.megacity = () => {
    const r = P.RNG(6101), sky = new P.Painter(P.W, H); sky.grad(0, 0, P.W, H, ['#020a24', '#0a1a4a', '#3a3a6a', '#c07a3a', '#ffb050']); for (let i = 0; i < 80; i++) sky.px(r.int(0, P.W), r.int(0, 110), r() < 0.3 ? '#ffffff' : '#8a96b4');
    for (let y = 120; y < H; y++) for (let x = 0; x < P.W; x++) if (B4[y & 3][x & 3] / 16 < (y - 120) / 220) sky.px(x, y, '#ffd080');
    const far = mk(); for (let i = 0; i < 14; i++) ctower(far, i * 46 + r.int(0, 20), H - 30, r.int(5, 9), r.int(70, 150), r, 0); for (let x = 0; x < W; x++) far.rect(x, H - 30, 1, 30, BL[0]);
    const mid = mk(); const beams = []; for (let i = 0; i < 6; i++) { const x = 40 + i * 110 + r.int(-10, 10), h = r.int(130, 200); ctower(mid, x, H - 16, r.int(10, 16), h, r, r.int(1, 3)); beams.push({ x, top: H - 16 - h }); }
    const mid2 = mk(); for (let i = 0; i < 5; i++) { const x = 70 + i * 130; ctower(mid2, x, H - 4, r.int(14, 22), r.int(80, 130), r, 2); } mid2.rect(0, H - 50, W, 4, BL[2]); mid2.rect(0, H - 50, W, 1, GO[2]); for (let x = 0; x < W; x += 16) mid2.px(x, H - 48, '#5ae0ff');
    const near = mk(); for (let i = 0; i < 7; i++) { const x = i * 96 + r.int(-8, 8); near.rect(x, H - 34, 4, 34, BL[1]); near.sell(x + 2, H - 36, 6, 6, [GO[0], GO[1], GO[2], GO[3]]); }
    return { sky: sky.canvas(), L: [{ im: cv(far), par: 0.1, y: 0 }, { im: cv(mid), par: 0.24, y: 6 }, { im: cv(mid2), par: 0.42, y: 10 }, { im: cv(near), par: 0.66, y: 6 }],
      fx(L, c, cx, vy, k) { const t = L.t;
        if (k === 2) { const off = -((cx * 0.24) % W); for (const b of beams) for (const rep of [off, off + W]) { const X = Math.round(rep + b.x); if (X < -10 || X > P.W + 10) continue; c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.18 + Math.sin(t * 0.03 + b.x) * 0.06; c.fillStyle = '#ffd080'; c.fillRect(X - 2, 0, 4, Math.max(0, b.top + vy * 0.24)); c.globalAlpha = 0.5; c.fillStyle = '#fff4c0'; c.fillRect(X, 0, 1, Math.max(0, b.top + vy * 0.24)); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; } }
        if (k === 1) for (let i = 0; i < 12; i++) { const lane = i % 4, X = ((t * (0.5 + lane * 0.3) * (i % 2 ? 1 : -1) + i * 90) % 720 + 720) % 720 - 120, Y = 40 + lane * 22 + vy * 0.1; P.DS.ship(c, X, Y, 0.5 + (lane % 2) * 0.5, i % 3, '#142060', i % 2 ? '#ffb030' : '#5ae0ff', t); }
        if (k === 0) for (let i = 0; i < 18; i++) { const X = (i * 53 + t * 0.2) % P.W, Y = 130 + (i * 37) % 60; c.fillStyle = 'rgba(255,224,128,' + (0.3 + Math.sin(t * 0.05 + i) * 0.2) + ')'; c.fillRect(Math.round(X), Math.round(Y + vy * 0.03), 1, 1); } } };
  };
  // NÚCLEO DE REACTORES: esferas de energía pulsantes en jaulas, conductos y vapor de refrigeración
  SET.reactor = () => {
    const r = P.RNG(6201), sky = new P.Painter(P.W, H); sky.grad(0, 0, P.W, H, ['#02060e', '#06142a', '#0a2440', '#0e3456', '#123e60']);
    for (let y = 0; y < H; y += 12) for (let x = 0; x < P.W; x++) if ((x + y) % 24 < 2) sky.px(x, y, '#0e3456');
    const far = mk(); const cores = []; for (let i = 0; i < 3; i++) { const x = 110 + i * 210, y = 110; far.sell(x, y, 46, 46, [M[0], M[1], M[2], M[3]]); for (let k = 0; k < 8; k++) { const a = k * 0.785; far.thick(x + Math.cos(a) * 30, y + Math.sin(a) * 30, x + Math.cos(a) * 52, y + Math.sin(a) * 52, 3, M[4]); } far.rect(x - 8, y + 46, 16, H - y - 46, M[2]); cores.push({ x, y }); }
    const mid = mk(); for (let i = 0; i < 12; i++) { const y = 60 + i * 16 + r.int(-4, 4); mid.rect(0, y, W, 3, M[2]); mid.rect(0, y, W, 1, M[4]); for (let x = r.int(0, 40); x < W; x += r.int(30, 60)) mid.rect(x, y - 2, 6, 7, M[3]); }
    const mid2 = mk(); for (let i = 0; i < 6; i++) { const x = 50 + i * 110; mid2.rect(x, H - 120, 26, 120, M[2]); mid2.rect(x, H - 120, 26, 2, M[5]); for (let y = H - 110; y < H - 10; y += 12) mid2.rect(x + 4, y, 18, 6, '#06283a'); }
    const near = mk(); for (let i = 0; i < 9; i++) { const x = i * 74; near.rect(x, H - 20, 60, 20, M[1]); near.rect(x, H - 20, 60, 2, M[3]); near.rect(x + 20, 0, 6, 30 + (i % 3) * 20, M[1]); }
    return { sky: sky.canvas(), L: [{ im: cv(far), par: 0.1, y: 0 }, { im: cv(mid), par: 0.2, y: 0 }, { im: cv(mid2), par: 0.4, y: 6 }, { im: cv(near), par: 0.68, y: 0 }],
      fx(L, c, cx, vy, k) { const t = L.t;
        if (k === 1) { const off = -((cx * 0.1) % W); for (const q of cores) for (const rep of [off, off + W]) { const X = rep + q.x, Y = q.y + vy * 0.1; if (X < -70 || X > P.W + 70) continue; P.Energy.reactor(c, X, Y, 18, t + q.x, '#3ac8f0'); for (let a = 0; a < 3; a++) P.Energy.arc(c, X, Y, X + Math.cos(t * 0.04 + a * 2.1) * 44, Y + Math.sin(t * 0.04 + a * 2.1) * 44, t + a, '#bff6ff', 1, 5); } }
        if (k === 2) { const off = -((cx * 0.2) % W); for (let i = 0; i < 10; i++) { const y = 61 + (i % 12) * 16 + vy * 0.2, X = ((t * 2 + i * 70) % W) + off; c.fillStyle = '#3ac8f0'; c.fillRect(Math.round(((X % W) + W) % W), Math.round(y), 6, 1); } }
        if (k === 3) { const off = -((cx * 0.4) % W); for (let i = 0; i < 6; i++) for (const rep of [off, off + W]) { const X = Math.round(rep + 50 + i * 110); if (X < -30 || X > P.W) continue; for (let j = 0; j < 8; j++) { c.fillStyle = (j + (t >> 3)) % 4 === 0 ? '#bff6ff' : '#14709a'; c.fillRect(X + 6, Math.round(H - 108 + j * 12 + vy * 0.4), 14, 2); } } }
        if (k === 0 && t % 5 === 0) L.parts.add({ x: L.cam.x + P.rand(0, P.W), y: L.cam.y + P.H, vy: -P.rand(0.3, 0.8), vx: P.rand(-0.2, 0.2), life: 160, col: P.pick(['#3a5a7a', '#5a7a9a', '#bff6ff']), size: 1 }); } };
  };
  // LABORATORIOS DE EXPERIMENTACIÓN: tanques verdes con especímenes de los nueve mundos, cables orgánicos, luz biológica
  SET.biolab = () => {
    const r = P.RNG(6301), sky = new P.Painter(P.W, H); sky.grad(0, 0, P.W, H, ['#020804', '#061408', '#0a200e', '#0e2c12', '#123616']);
    const far = mk(); for (let i = 0; i < 8; i++) { const x = i * 84 + 20; far.rect(x, 30, 50, H - 30, M[1]); far.rect(x + 4, 40, 42, 90, '#06200a'); for (let y = 44; y < 126; y += 8) far.rect(x + 8, y, 34, 2, '#0e3a14'); }
    const mid = mk(); const tanks = []; for (let i = 0; i < 5; i++) { const x = 60 + i * 130, h = 110; mid.rect(x - 22, H - 26 - h, 44, h, '#0a2a10'); mid.rect(x - 22, H - 26 - h, 44, 2, '#7dff5a'); mid.rect(x - 26, H - 26, 52, 26, M[3]); mid.rect(x - 26, H - 34 - h, 52, 8, M[3]); tanks.push({ x, y: H - 26 - h / 2, h, kind: i % 5 }); }
    const mid2 = mk(); for (let i = 0; i < 18; i++) { const x0 = r.int(0, W); let x = x0; for (let y = 0; y < r.int(40, 120); y++) { x += Math.sin(y * 0.1 + i) * 0.6; mid2.px(Math.round(x), y, i % 3 ? '#1e3a22' : '#2f5a34'); mid2.px(Math.round(x) + 1, y, '#0e2412'); } }
    const near = mk(); for (let i = 0; i < 8; i++) { const x = i * 84 + r.int(0, 20); near.rect(x, H - 40, 34, 40, M[1]); near.rect(x + 4, H - 36, 26, 14, '#06200a'); near.rect(x + 6, H - 34, 22 * (0.3 + r() * 0.7), 2, '#7dff5a'); }
    return { sky: sky.canvas(), L: [{ im: cv(far), par: 0.1, y: 0 }, { im: cv(mid), par: 0.3, y: 0 }, { im: cv(mid2), par: 0.42, y: 0 }, { im: cv(near), par: 0.68, y: 0 }],
      fx(L, c, cx, vy, k) { const t = L.t;
        if (k === 2) { const off = -((cx * 0.3) % W); for (const q of tanks) for (const rep of [off, off + W]) { const X = Math.round(rep + q.x), Y = Math.round(q.y + vy * 0.3); if (X < -40 || X > P.W + 40) continue; P.drawGlow(c, X, Y, 30, '#7dff5a', 0.25); const bob = Math.sin(t * 0.03 + q.x) * 2; c.fillStyle = '#123a16'; // silueta del espécimen
              if (q.kind === 0) { c.fillRect(X - 8, Y - 6 + bob, 16, 10); c.fillRect(X - 12, Y + 2 + bob, 4, 8); c.fillRect(X + 8, Y + 2 + bob, 4, 8); } else if (q.kind === 1) { c.beginPath(); c.arc(X, Y + bob, 10, 0, 6.3); c.fill(); c.fillRect(X - 2, Y + 8 + bob, 4, 12); } else if (q.kind === 2) { for (let j = 0; j < 6; j++) c.fillRect(X - 10 + j * 4, Y - 10 + bob + Math.sin(j + t * 0.05) * 3, 3, 20); } else if (q.kind === 3) { c.fillRect(X - 3, Y - 16 + bob, 6, 30); c.fillRect(X - 10, Y - 10 + bob, 20, 4); } else { c.beginPath(); c.ellipse(X, Y + bob, 14, 7, 0, 0, 6.3); c.fill(); }
              c.fillStyle = '#ff2a4a'; c.fillRect(X + 2, Y - 2 + bob, 1, 1); for (let j = 0; j < 3; j++) { c.fillStyle = 'rgba(200,255,180,0.6)'; c.fillRect(X - 12 + ((t + j * 13) % 24), Math.round(Y + 40 - ((t * 0.6 + j * 30) % 90)), 1, 1); } } }
        if (k === 0 && t % 4 === 0) L.parts.add({ x: L.cam.x + P.rand(0, P.W), y: L.cam.y + P.rand(0, P.H), vy: -P.rand(0.1, 0.4), life: 120, col: P.pick(['#7dff5a', '#2f7a34', '#d6ffc8']), size: 1, glow: 2 }); } };
  };
  // CORAZÓN NUCLEAR DE EXPERIMENTACIÓN (arena de THERSEK): reactor biológico central, hologramas de los nueve jefes
  SET.biocore = () => {
    const r = P.RNG(6401), sky = new P.Painter(P.W, H); sky.grad(0, 0, P.W, H, ['#020602', '#061206', '#0a1e0a', '#0e2a0e', '#08160a']);
    const far = mk(); far.sell(320, 100, 70, 90, [M[0], M[1], M[2], M[3]]); far.rect(300, 180, 40, H - 180, M[2]); for (let k = 0; k < 10; k++) { const a = k * 0.628; far.thick(320, 100, 320 + Math.cos(a) * 160, 100 + Math.sin(a) * 120, 3, M[2]); }
    const mid = mk(); for (let i = 0; i < 9; i++) { const x = 40 + i * 70; mid.rect(x - 12, 150, 24, 60, M[1]); mid.rect(x - 10, 152, 20, 40, '#06200a'); }
    const near = mk(); near.rect(0, H - 26, W, 26, M[1]); near.rect(0, H - 26, W, 2, '#7dff5a'); for (let x = 0; x < W; x += 30) near.rect(x, H - 24, 2, 24, M[3]);
    const NAMES = ['KRAZTHOR', 'ZARMAKH', 'GLORVAX', 'THALZOR', 'ARACHNARA', 'MYKARON', 'ZYRKALIA', 'MAGNAROK', 'AZHYRION'];
    return { sky: sky.canvas(), L: [{ im: cv(far), par: 0.08, y: 0 }, { im: cv(mid), par: 0.25, y: 0 }, { im: cv(near), par: 0.6, y: 0 }],
      fx(L, c, cx, vy, k) { const t = L.t;
        if (k === 1) { const off = -((cx * 0.08) % W); for (const rep of [off, off + W]) { const X = rep + 320, Y = 100 + vy * 0.08; P.Energy.reactor(c, X, Y, 26, t, '#7dff5a'); for (let a = 0; a < 4; a++) P.Energy.arc(c, X, Y, X + Math.cos(t * 0.03 + a * 1.57) * 70, Y + Math.sin(t * 0.03 + a * 1.57) * 60, t + a, '#d6ffc8', 1, 6); } }
        if (k === 2) { const off = -((cx * 0.25) % W); for (let i = 0; i < 9; i++) for (const rep of [off, off + W]) { const X = Math.round(rep + 40 + i * 70), Y = Math.round(150 + vy * 0.25); if (X < -30 || X > P.W + 30) continue; c.globalAlpha = 0.5 + Math.sin(t * 0.05 + i) * 0.2; for (let j = 0; j < 14; j++) { c.fillStyle = j % 2 ? '#7dff5a' : '#d6ffc8'; c.fillRect(X + Math.round(Math.sin(t * 0.08 + j * 0.6) * 6), Y + 4 + j * 2.6, 2, 1); c.fillRect(X - Math.round(Math.sin(t * 0.08 + j * 0.6) * 6), Y + 4 + j * 2.6, 2, 1); } c.globalAlpha = 1; } } } };
  };

  // ---------- chunks del Área II ----------
  const pt = P.DS_CHUNK, E = '........................', G = '########################', G3 = [G, G, G];
  const col = (x, ch, n) => { const r = []; for (let i = 0; i < n; i++) r.push('.'.repeat(x) + ch + '.'.repeat(23 - x)); return r; };
  Object.assign(P.CHUNKS, {
    ds2_avenue: pt(8, ['......D.........d.......', E, '...=====......=====.....', E, E, '..s.....Q.......s....p..', ...G3]),
    ds2_rails: pt(6, ['...........*............', E, '...........v............', E, '......v..........v......', E, '..s.....................', '####~~~~~~~~~~~~~~~~####', '####~~~~~~~~~~~~~~~~####', G, G]),
    ds2_tubes: pt(3, ['................*.......', '...............#####....', E, E, E, '....=====...............', E, E, E, '.......s................', '..Y...........Y.........', ...G3]),
    ds2_surge: pt(8, ['.........d..............', E, E, '...====.........====....', E, '..W....s....W.....W..s..', ...G3]),
    ds2_console: pt(2, [...col(15, 'G', 11), '....Z......s...G....K...', ...G3]),
    ds2_lab: pt(8, [E, '..........D.............', '.....====.......====....', E, E, '..K......c....K.....s...', ...G3]),
    ds2_holobridge: pt(7, ['.................D......', E, '............J...........', E, '.......J........J.......', E, '..Z.....................', '#####~~~~~~~~~~~~~######', '#####~~~~~~~~~~~~~######', G]),
    ds2_arms: pt(3, [G, G, G, E, '.....O.......O......O...', E, E, E, E, E, '..s......K.........c....', ...G3])
  });
  const AREA2 = [
    { id: 6, name: 'Megaciudad de Neón', sub: 'Área II · El Corazón Tecnológico', theme: 'megacity', bg: 'megacity', area: 2, music: 'dyson_b', sky: 'golden',
      rows: [['ds_start', 'ds2_avenue', 'ds2_rails', 'ds_checkpoint', 'ds2_tubes', 'ds2_avenue', 'ds_secret', 'ds_extractor', 'ds_exit']], events: [], stars: [{ t: 'holo', id: 'h77' }],
      intro: [['elara', 'El Corazón Tecnológico, {N}. Una ciudad entera construida con la luz robada de Plenuria.'], ['elara', 'Los raíles maglev te llevan por encima del plasma. No te caigas.']] },
    { id: 7, name: 'Núcleo de Reactores', sub: 'Área II · El Corazón Tecnológico', theme: 'reactor', bg: 'reactor', area: 2, music: 'dyson_b2', sky: 'dusk',
      rows: [['ds_start', 'ds2_surge', 'ds2_holobridge', 'ds_checkpoint', 'ds2_tubes', 'ds2_surge', 'ds_lasers', 'ds_extractor', 'ds_exit']], events: [], stars: [{ t: 'holo', id: 'h78' }, { t: 'res', crys: 3 }],
      intro: [['elara', 'Los reactores descargan energía por el suelo. Donde los conductos brillen, apártate.']] },
    { id: 8, name: 'Laboratorios de Experimentación', sub: 'Área II · El Corazón Tecnológico', theme: 'biolab', bg: 'biolab', area: 2, music: 'dyson_b3', sky: 'dusk', arenaLock: true,
      rows: [['ds_start', 'ds2_lab', 'ds2_console', 'ds_checkpoint', 'ds2_arms', 'ds_elite', 'ds2_lab', 'ds_extractor', 'ds_exit']],
      events: [{ t: 'transmission', who: 'thersek', lines: [['thersek', 'Bienvenido a mis laboratorios, K-7. Mira los tanques: hay un poco de cada uno de tus nueve mundos.'], ['thersek', 'Y hay un tanque vacío. Lo guardo para ti.']] }],
      stars: [{ t: 'holo', id: 'h79' }],
      intro: [['elara', 'Tanques de experimentación. Si te acercas, revientan y sale lo que haya dentro.'], ['elara', 'Esto es lo que Thersek hacía con las criaturas de los nueve mundos, {N}.']] },
    { id: 9, name: 'Corazón Nuclear de Experimentación', sub: 'Área II · El Corazón Tecnológico', theme: 'boss', bg: 'biocore', area: 2, music: 'boss', boss: 'thersek', sky: 'dusk', arena: 'thersek',
      intro: [['elara', 'THERSEK, el Vicepresidente. Su barrera de energía absorbe casi todo el daño.'], ['elara', 'Cuando clave los tentáculos en el suelo, su núcleo queda expuesto. Ataca entonces.']] }
  ];
  for (const l of AREA2) if (!P.LV.dyson.levels.some(x => x.id === l.id)) P.LV.dyson.levels.push(l);
  P.LV.dyson.levels.sort((a, b) => a.id - b.id);

  // ---------- registros y jefe ----------
  Object.assign(P.D.HOLOS, {
    h77: { title: 'Guía turística de la Esfera', text: 'Bienvenido al Corazón Tecnológico, donde la luz de una estrella entera trabaja para usted. Prohibido mirar al cielo.' },
    h78: { title: 'Informe de reactores', text: 'Rendimiento al 340 %. Si los nueve mundos dejan de alimentarnos, el núcleo aguantará cuatro ciclos. Quizá cinco.' },
    h79: { title: 'Bitácora de Thersek · Tanque 0', text: 'La unidad K-7 no es una máquina con un alma. Es algo con un alma dentro de una máquina. Merek me prohíbe abrirla.' },
    h80: { title: 'Mensaje de N-0', text: '«Siete, cuando Thersek caiga, busca el Parlamento. Gerselle guarda allí lo que queda de la República.»' }
  });
  P.D.BOSSES.thersek = { name: 'THERSEK', title: 'El Vicepresidente', planet: 'dyson', col: '#7dff5a', col2: '#ff2a4a', music: 'thersek' };
  P.D.BOSS_OUTRO.thersek = { lines: [['elara', 'THERSEK cae. Sus tentáculos dejan de moverse.'], ['thersek', 'Quería… saber qué eras, K-7… Abrirte… solo una vez…'], ['thersek', 'Merek lo sabe. Siempre lo supo. Por eso te teme.'], ['hero', '¿Qué es lo que sabe?'], ['thersek', 'Ja… Pregúntale… por qué tu armadura… se cierra sola…'], ['elara', 'Se ha ido. El Corazón Tecnológico está apagándose, {N}.']] };
  P.D.POST_BOSS.thersek = [['gerselle', 'Thersek ha caído. El Parlamento queda en estado de emergencia.'], ['merek', 'Que no entre en el Imperio, Gerselle. Que no llegue al Trono.'], ['gerselle', 'No llegará, presidente. Yo misma lo recibiré.']];
  P.D.ACHIEVEMENTS.push({ id: 'thersek', name: 'Fin del experimento', desc: 'Derrota a THERSEK.' });
  const baseFC = P.D.FIRST_CLEAR.dyson; P.D.FIRST_CLEAR.dyson = (S, id) => { baseFC(S, id); if (id === 9) S.ach('thersek'); };
  Object.assign(P.Audio.TRACKS, {
    dyson_b: { bpm: 108, root: 47, scale: [0, 2, 4, 6, 7, 9, 11], prog: [0, 3, 4, 5], lead: 'triangle', bass: 'sawtooth', arp: 'square', drums: 1, pad: true, seed: 1051 },
    dyson_b2: { bpm: 124, root: 45, scale: [0, 2, 3, 6, 7, 9, 10], prog: [0, 6, 4, 5], lead: 'square', bass: 'sawtooth', arp: 'triangle', drums: 2, pad: true, seed: 1053 },
    dyson_b3: { bpm: 92, root: 43, scale: [0, 1, 4, 5, 7, 8, 10], prog: [0, 1, 4, 1], lead: 'sine', bass: 'sawtooth', arp: 'triangle', drums: 1, pad: true, seed: 1057 },
    thersek_3: { bpm: 150, root: 42, scale: [0, 1, 4, 5, 6, 8, 11], prog: [0, 1, 5, 6], lead: 'sawtooth', bass: 'square', arp: 'sawtooth', drums: 2, pad: true, seed: 1063, motif: [0, 2, 1, 3, 2, 4, 'r', 6] },
    thersek: { bpm: 132, root: 41, scale: [0, 1, 4, 5, 6, 8, 10], prog: [0, 1, 6, 5], lead: 'square', bass: 'sawtooth', arp: 'sawtooth', drums: 2, pad: true, seed: 1061, motif: [0, 2, 1, 3, 2, 4, 'r', 6] }
  });

  // tanque de experimentación (K en el Área II): revienta cuando te acercas y libera un mutante
  P.ExperimentTank = class extends P.Ent {
    constructor(L, x, y) { super(L, x - 10, y - 30, 20, 30); this.full = true; this.ph = (x % 7) * 0.5; }
    update() { this.t++; const L = this.L, p = L.player; if (this.full && Math.abs(p.cx - this.cx) < 60 && Math.abs(p.cy - this.cy) < 60) { this.full = false; P.Audio.sfx('break'); P.shake(3, 10); L.parts.burst(this.cx, this.cy, 20, { col: P.pick(['#7dff5a', '#d6ffc8', '#bff6ff']), smin: 1, smax: 3, g: 0.15, size: 2 }); const e = L.add(Math.random() < 0.5 ? new P.Frog(L, this.cx - 7, this.y + 19) : new P.Crab(L, this.cx - 9, this.y + 30, false)); e.kind = null; e.spr = e instanceof P.Frog ? 'frog' : 'krazith'; e.hp = e.maxhp = 10; } }
    umLight() { return this.full ? [this.cx, this.cy, 36, 0.8] : null; }
    draw(c, cx, cy) { const x = Math.round(this.x - cx), y = Math.round(this.y - cy); c.fillStyle = '#2c3446'; c.fillRect(x - 2, y + 26, 24, 4); c.fillRect(x - 2, y - 2, 24, 3); if (this.full) { c.fillStyle = 'rgba(80,220,90,0.35)'; c.fillRect(x, y + 1, 20, 25); c.fillStyle = '#123a16'; c.fillRect(x + 5, y + 8 + Math.round(Math.sin(this.t * 0.05 + this.ph) * 2), 10, 9); c.fillStyle = '#ff2a4a'; c.fillRect(x + 11, y + 11, 1, 1); P.drawGlow(c, x + 10, y + 14, 16, '#7dff5a', 0.3); } else { c.fillStyle = '#1e3a22'; c.fillRect(x, y + 20, 20, 6); c.fillStyle = '#7dff5a'; c.fillRect(x + 2, y + 24, 3, 1); } c.strokeStyle = '#5e6a86'; c.strokeRect(x + 0.5, y + 0.5, 19, 25); }
  };
  const baseK = P.LV.dyson.spawn.K; P.LV.dyson.spawn.K = (L, x, y, m, R) => { if (L.def.area === 2) L.add(new P.ExperimentTank(L, x, L.snapY(m.x, m.y))); else baseK(L, x, y, m, R); };
  // descargas de reactor (W en el Área II): el mismo impacto, en cian y desde el suelo
  const oDraw = P.OrbitalStrike.prototype.draw; P.OrbitalStrike.prototype.draw = function (c, cx, cy) { if (this.L.def.area !== 2) return oDraw.call(this, c, cx, cy); const x = Math.round(this.cx - cx), y = Math.round(this.y - cy) + 8, ct = this.ct;
    c.fillStyle = '#14709a'; c.fillRect(x - 12, y - 2, 24, 2); if (ct >= 120 && ct < 180) { const k = (ct - 120) / 60; c.fillStyle = (this.t >> 2) % 2 ? '#bff6ff' : '#3ac8f0'; c.fillRect(x - Math.round(12 * k), y - 2, Math.round(24 * k), 2); P.drawGlow(c, x, y - 4, 8 + k * 14, '#3ac8f0', 0.3 + k * 0.4); }
    if (ct >= 180 && ct < 196) { for (let a = 0; a < 3; a++) P.Energy.arc(c, x + (a - 1) * 4, y - 2, x + (a - 1) * 8, y - 110, this.t + a, a === 1 ? '#ffffff' : '#3ac8f0', a === 1 ? 2 : 1, 6); P.drawGlow(c, x, y - 40, 50, '#bff6ff', 0.7); } };
})();
