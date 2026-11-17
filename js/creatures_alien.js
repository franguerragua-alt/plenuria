'use strict';
// Rediseño extraterrestre de la fauna de KHAZIR y NÍVORAH. Mismos tamaños y fotogramas (las mecánicas no cambian).
P.Sprites.buildAlienFauna = function () {
  const MT = ['#1a1c2a', '#2e3346', '#4e5872', '#8a98bc'];
  const leg = (p, x0, y0, x1, y1, x2, y2, c) => { p.line(x0, y0, x1, y1, c); p.line(x1, y1, x2, y2, c); };

  // ======================= KHAZIR =======================
  // KHARVEX: rastreador de seis patas articuladas, tres placas dorsales, tallo ocular y saco luminoso trasero
  const kharvex = (p, f, o) => {
    const w = f === 4, st = w ? 0 : f, by = o.by, cx = o.cx, L = o.len, hgt = w ? 2 : 0;
    for (let i = 0; i < 3; i++) { const lx = cx - L * 0.45 + i * L * 0.45, ph = ((st + i) % 2) * 2; leg(p, lx, by - 6 + hgt, lx - 3, by - 9 + hgt - ph, lx - 4 - ph, by, o.c[0]); leg(p, lx + 2, by - 6 + hgt, lx + 5, by - 9 + hgt - (2 - ph), lx + 6 - ph, by, o.c[1]); }
    p.sell(cx - L * 0.35, by - 7 + hgt, o.sac * 1.2, o.sac, o.sacC); p.px(cx - L * 0.35 - 1, by - 8 + hgt, '#ffffff');
    for (let k = 0; k < 3; k++) { const px = cx - L * 0.15 + k * L * 0.28; p.sell(px, by - 8 + hgt, L * 0.2, 3.6, o.c); p.line(px - L * 0.18, by - 5 + hgt, px + L * 0.18, by - 5 + hgt, o.rim); }
    const ex = cx + L * 0.5 + (w ? -2 : 0), ey = by - (w ? 12 : 16);
    p.line(cx + L * 0.4, by - 9 + hgt, ex - 1, ey + 2, o.c[1]); p.line(cx + L * 0.4 + 1, by - 9 + hgt, ex, ey + 2, o.c[2]);
    p.sell(ex, ey, 2.6, 2.4, [o.c[0], o.c[2], o.c[3]]); p.px(ex + 1, ey, o.eye); p.px(ex + 1, ey - 1, '#ffffff');
    for (const d of [0, 2]) { const ty = by - 7 + hgt + d; p.line(cx + L * 0.45, ty, cx + L * 0.45 + 5 + (w ? -2 : 0), ty + (w ? -4 : 2) - d, o.c[2]); }
  };
  const KSAND = ['#5a3418', '#a8682a', '#e0a24a', '#ffe0a0'];
  P.mk('kz_krazith', 32, 22, 5, (p, f) => kharvex(p, f, { cx: 15, by: 21, len: 16, c: KSAND, rim: '#2ad8c0', eye: '#2ad8c0', sac: 3, sacC: ['#a85a0a', '#ffb030', '#fff0a0'] }));
  P.mk('kz_krazith_cy', 34, 24, 5, (p, f) => { kharvex(p, f, { cx: 16, by: 23, len: 17, c: MT, rim: '#ff3050', eye: '#ff2040', sac: 3, sacC: ['#0a4a5a', '#2ae0e8', '#c0ffff'] }); p.rect(12, 12, 8, 2, '#3a0a14'); p.px(14, 12, '#ff3050'); });
  P.mk('kz_krazith_alfa', 52, 36, 5, (p, f) => {
    kharvex(p, f, { cx: 24, by: 35, len: 28, c: ['#3a1a4a', '#7a3a9a', '#c070e0', '#ffd0ff'], rim: '#ffd166', eye: '#ffef3a', sac: 6, sacC: ['#7a2a0a', '#ff8a2a', '#fff0a0'] });
    for (let i = 0; i < 3; i++) { const x = 18 + i * 8; p.tri(x - 3, 23, x + 3, 23, x + (i - 1) * 2, 12 - (i === 1 ? 4 : 0), '#ffd166'); p.tri(x - 1, 23, x + 3, 23, x + (i - 1) * 2, 14, '#fff4c0'); }
    p.line(44, 24, 48, 14, '#7a3a9a'); p.sell(48, 13, 2.4, 2.2, ['#3a1a4a', '#c070e0', '#ffd0ff']); p.px(49, 13, '#ffef3a');
  });
  // PIRROGLOBO: globo translúcido con núcleo de fuego, tres ojos y dos patas-resorte (0 quieto · 1 salto · 2 escupe)
  P.mk('kz_frog', 20, 17, 3, (p, f) => {
    const y = f === 1 ? 6 : 8, legL = f === 1 ? 9 : 5;
    for (const [x, s] of [[7, -1], [13, 1]]) { for (let k = 0; k < legL; k++) p.px(x + s * (k % 2), y + 4 + k, k % 2 ? '#8a3a0a' : '#e0702a'); p.rect(x - 1, Math.min(16, y + 4 + legL), 3, 1, '#5a2a0a'); }
    p.ell(10, y, 7, 6, '#c8501a'); p.ell(10, y, 6, 5, '#ff9a4a'); p.ell(10, y + 1, 3, 2.5, '#ffd166'); p.px(10, y + 1, '#ffffff');
    for (const sx of [-1, 1]) p.tri(10 + sx * 6, y - 2, 10 + sx * 9, y - 4, 10 + sx * 7, y + 2, '#2ad8c0');
    for (let i = 0; i < 3; i++) { p.ell(7 + i * 3, y - 5, 1.3, 1.3, '#fff4d8'); p.px(7 + i * 3, y - 5, '#1a0a0a'); }
    if (f === 2) { p.rect(13, y + 2, 4, 2, '#3a0a0a'); p.ell(18, y + 2, 2, 2, '#ff8a3a'); p.px(18, y + 1, '#fff0a0'); }
  });
  // VELÁRIDO: planeador en forma de rombo con dos pares de alas membranosas y racimo de ojos
  const velar = (p, f, B, eye, metal) => {
    const up = f ? -3 : 2;
    p.tri(13, 7, 2, 4 + up, 7, 11, B[2]); p.tri(13, 7, 24, 4 + up, 19, 11, B[2]); for (let k = 0; k < 3; k++) { p.line(13, 7, 4 + k * 2, 5 + up + k, B[1]); p.line(13, 7, 22 - k * 2, 5 + up + k, B[1]); }
    p.tri(13, 9, 6, 13 - up, 10, 13, B[1]); p.tri(13, 9, 20, 13 - up, 16, 13, B[1]);
    p.tri(10, 8, 16, 8, 13, 3, B[3]); p.tri(10, 8, 16, 8, 13, 13, B[0]); p.line(13, 13, 13, 15, B[0]); p.px(12, 15, B[1]); p.px(14, 15, B[1]);
    for (const [x, y] of [[12, 6], [14, 6], [13, 7]]) p.px(x, y, eye);
    if (metal) { p.rect(11, 9, 5, 1, MT[3]); p.px(13, 9, '#ff3050'); }
  };
  P.mk('kz_dfly', 26, 16, 2, (p, f) => velar(p, f, ['#5a2a3a', '#a85a5a', '#f0a890', '#ffe0d0'], '#2ad8c0'));
  P.mk('kz_dfly_cy', 26, 16, 2, (p, f) => velar(p, f, MT, '#ff2040', true));
  // CUPULÓN: cúpula de placas hexagonales de cristal sobre seis patitas y una boca-flor sensorial
  P.mk('kz_slug', 28, 15, 2, (p, f) => {
    for (let i = 0; i < 6; i++) { const x = 5 + i * 3.4; p.line(x, 11, x + ((i + f) % 2 ? 1 : -1), 14, '#5a3a1a'); }
    p.sell(13, 9, 11, 6, ['#5a3a1a', '#9a6a3a', '#d0a060', '#fff0c0']);
    for (let i = 0; i < 4; i++) { const x = 6 + i * 4.5, y = 6 + (i % 2); p.tri(x - 2, y + 1, x + 2, y + 1, x, y - 2, '#2ad8c0'); p.tri(x - 2, y + 1, x + 2, y + 1, x, y + 3, '#1a8a7a'); p.px(x, y - 1, '#c0fff4'); }
    p.line(23, 9, 25 + f, 7, '#9a6a3a'); for (let k = 0; k < 3; k++) { const a = -1.2 + k * 1.2; p.line(25 + f, 7, 25 + f + Math.cos(a) * 3, 7 + Math.sin(a) * 3, '#ff5a8a'); } p.px(25 + f, 7, '#ffd166');
  });
  // ZHIRR COLGANTE: cadena de cuentas que cuelga del techo y acaba en una boca-farol (0 cerrada · 1 desplegada y abierta)
  P.mk('kz_vsnake', 12, 34, 2, (p, f) => {
    const L = f ? 26 : 12;
    for (let y = 0; y < L; y += 3) { const x = 6 + Math.round(Math.sin(y * 0.4) * (f ? 1 : 0.5)); p.ell(x, y + 1, 1.8, 1.4, y % 6 ? '#c8862e' : '#7a4a1a'); p.px(x, y, '#f0c060'); }
    const hy = L + 3;
    if (!f) { p.sell(6, hy, 3.4, 3.8, ['#7a2a0a', '#e0702a', '#ffd166', '#ffffff']); p.line(6, hy - 3, 6, hy + 3, '#7a2a0a'); }
    else { for (let k = 0; k < 4; k++) { const a = 0.5 + k * 0.7; p.tri(6, hy, 6 + Math.cos(a) * 6, hy + Math.sin(a) * 6, 6 + Math.cos(a + 0.3) * 4, hy + Math.sin(a + 0.3) * 4, '#e0702a'); p.tri(6, hy, 6 - Math.cos(a) * 6, hy + Math.sin(a) * 6, 6 - Math.cos(a + 0.3) * 4, hy + Math.sin(a + 0.3) * 4, '#e0702a'); } p.ell(6, hy + 1, 2, 2, '#2a0a0a'); p.px(6, hy + 3, '#ffd166'); }
  });
  // VORÁGULO: emerge de la arena con una corona de cinco ojos y una boca de pétalos de arenisca
  P.mk('kz_worm', 24, 28, 4, (p, fr) => {
    const f = [3, 1, 2, 0][fr]; p.ell(12, 26, 11, 2.5, '#c8904a'); p.ell(12, 25, 9, 1.5, '#e8b060');
    if (f === 0) { p.ell(12, 24, 6, 2.5, '#d8a058'); p.px(10, 23, '#2ad8c0'); p.px(14, 23, '#2ad8c0'); return; }
    const h = f === 1 ? 10 : 22, top = 26 - h;
    for (let y = top + 5; y < 26; y++) { const w = 5 + Math.sin(y * 0.5) * 0.6; p.rect(12 - w, y, w * 2, 1, (y >> 1) % 3 ? '#8a5a3a' : '#2ad8c0'); p.px(12 - w, y, '#4a2a1a'); }
    const open = f === 2;
    for (let k = 0; k < 5; k++) { const a = -Math.PI + k * Math.PI / 4, r = open ? 9 : 6; p.tri(12, top + 5, 12 + Math.cos(a - 0.25) * r, top + 5 + Math.sin(a - 0.25) * r * 0.8, 12 + Math.cos(a + 0.25) * r, top + 5 + Math.sin(a + 0.25) * r * 0.8, k % 2 ? '#d8a058' : '#b8783a'); }
    if (open) { p.ell(12, top + 5, 3.5, 2.5, '#2a0a0a'); for (let i = 0; i < 5; i++) p.px(9 + i * 1.5, top + 4, '#fff4d8'); }
    for (let k = 0; k < 5; k++) { const a = -Math.PI + 0.3 + k * 0.62; p.ell(12 + Math.cos(a) * 7, top + 9 + Math.sin(a) * 2, 1.2, 1.2, '#c0fff4'); p.px(12 + Math.cos(a) * 7, top + 9 + Math.sin(a) * 2, '#0a3a3a'); }
  });
  // QUELVARO: zancudo de cuatro patas finas con vejigas de agua luminosas en el lomo y cabeza de martillo
  P.mk('kz_grazer', 38, 28, 3, (p, f) => {
    const st = f === 1 ? 1 : 0, gr = f === 2, B = ['#5a3a2a', '#a8784a', '#e0b080', '#fff0d8'];
    for (const [x, s] of [[9, 1], [13, -1], [25, 1], [29, -1]]) { leg(p, x, 16, x + st * s * 2, 21, x + st * s, 27, B[0]); p.px(x + st * s, 27, '#2a1a10'); }
    p.sell(19, 14, 12, 4.5, B);
    for (const x of [14, 22]) { p.sell(x, 8, 4, 4.5, ['#0a5a6a', '#1a9ab8', '#5ae8e0', '#f0fffc']); p.px(x - 1, 6, '#ffffff'); }
    const hx = gr ? 34 : 33, hy = gr ? 21 : 6; p.line(29, 12, hx - 1, hy + 2, B[1]); p.line(30, 12, hx, hy + 2, B[2]);
    p.rect(hx - 4, hy - 1, 9, 3, B[1]); p.rect(hx - 4, hy - 1, 9, 1, B[3]); p.px(hx - 4, hy, '#1a1a1a'); p.px(hx + 4, hy, '#1a1a1a');
    p.tri(hx - 2, hy - 1, hx + 2, hy - 1, hx - 4, hy - 6, '#ff8a5a'); p.tri(hx - 2, hy - 1, hx + 2, hy - 1, hx + 4, hy - 6, '#ff8a5a');
    p.line(7, 13, 2, 9, B[2]); p.px(2, 8, '#2ad8c0');
  });
  // SSYNTHRA (legendaria): raya de cristal que flota con aletas de cuerdas de arpa
  P.mk('kz_vellorn', 40, 38, 2, (p, f) => {
    const y = 18 + f, C = ['#1a7a8a', '#5ae8e0', '#c0fff8', '#ffffff'];
    for (let k = 0; k < 4; k++) p.line(12 + k * 5, 30, 13 + k * 5, 37, '#5ae8e0');
    p.tri(20, y - 8, 2, y + 2 - f * 3, 20, y + 6, C[1]); p.tri(20, y - 8, 38, y + 2 - f * 3, 20, y + 6, C[1]);
    for (let k = 0; k < 6; k++) { p.line(6 + k * 2.4, y + 1 - f * 2, 18, y - 4, C[2]); p.line(34 - k * 2.4, y + 1 - f * 2, 22, y - 4, C[2]); }
    p.sell(20, y - 1, 5, 7, [C[0], C[1], C[2], C[3]]); p.line(20, y + 6, 20, y + 14, C[1]); p.line(20, y + 14, 22 + f * 2, y + 18, C[2]);
    for (const x of [18, 20, 22]) p.px(x, y - 5, '#ffd166');
  }, { up: 0.1 });

  // ======================= NÍVORAH =======================
  // KREVVUNO: trineo de escamas de hielo, cuatro ojos en tallos y un cuerno-ariete
  const krev = (p, f, o) => {
    const w = f === 4, st = w ? 0 : f, by = o.by, cx = o.cx, L = o.len, dy = w ? 2 : 0;
    for (let i = 0; i < 3; i++) { const lx = cx - L * 0.4 + i * L * 0.4, ph = ((st + i) % 2) * 2; p.line(lx, by - 5 + dy, lx - 1 + ph, by, o.c[0]); p.line(lx + 2, by - 5 + dy, lx + 3 - ph, by, o.c[0]); }
    p.sell(cx, by - 8 + dy, L * 0.55, 4.6, o.c);
    for (let i = 0; i < 5; i++) { const x = cx - L * 0.45 + i * L * 0.22; p.tri(x - 2, by - 9 + dy, x + 2, by - 9 + dy, x, by - 14 + dy, o.c[3]); p.px(x, by - 12 + dy, '#ffffff'); }
    for (let i = 0; i < 4; i++) { const x = cx + L * 0.2 + i * 2, top = by - 15 + dy - (i % 2) * 2; p.line(x, by - 10 + dy, x, top, o.c[1]); p.px(x, top - 1, o.eye); }
    const hx = cx + L * 0.55; p.tri(hx - 1, by - 10 + dy, hx - 1, by - 5 + dy, hx + (w ? 4 : 8), by - 8 + dy - (w ? 3 : 0), o.horn); p.px(hx + (w ? 3 : 7), by - 8 + dy - (w ? 3 : 0), '#ffffff');
  };
  P.mk('nv_krazith', 32, 22, 5, (p, f) => krev(p, f, { cx: 14, by: 21, len: 18, c: ['#2a3a6a', '#4a7ab0', '#8ac4ec', '#e4f6ff'], eye: '#ff8ad8', horn: '#bfefff' }));
  P.mk('nv_krazith_cy', 34, 24, 5, (p, f) => { krev(p, f, { cx: 15, by: 23, len: 19, c: MT, eye: '#ff2040', horn: '#8a98bc' }); p.rect(9, 13, 9, 2, '#3a0a14'); p.px(12, 13, '#5ef0ff'); });
  // THRUMBAR: coloso con tres agujas de hielo luminosas, cuatro ojos y tres trompas-tentáculo
  P.mk('nv_krazith_alfa', 52, 36, 5, (p, f) => {
    const st = f % 4, C = ['#2a2a4a', '#4a4a7a', '#7a7ab0', '#c0c0e8'];
    for (let i = 0; i < 4; i++) { const lx = 10 + i * 9, lift = f < 4 ? ((st + i) % 2) * 2 : 0; p.rect(lx, 24 - lift, 6, 11 + lift, C[0]); p.rect(lx - 1, 33, 8, 2, '#bfefff'); }
    p.sell(24, 18, 18, 11, C);
    for (let i = 0; i < 3; i++) { const x = 15 + i * 9, h = 14 + (i === 1 ? 6 : 0); p.tri(x - 3, 10, x + 3, 10, x, 10 - h, '#5ef0ff'); p.tri(x - 1, 10, x + 3, 10, x, 10 - h + 3, '#d8fff8'); }
    const hx = f === 4 ? 40 : 42; p.sell(hx, 16, 8, 7, C); for (let i = 0; i < 4; i++) { p.ell(hx - 3 + (i % 2) * 5, 13 + Math.floor(i / 2) * 3, 1.2, 1.2, '#ff8ad8'); }
    for (let k = 0; k < 3; k++) { let px = hx - 2 + k * 3, py = 21; for (let j = 0; j < 9; j++) { const nx = px + Math.sin(j * 0.6 + k + f) * 0.8, ny = py + 1.4; p.thick(px, py, nx, ny, 1.6 - j * 0.1, k === 1 ? C[2] : C[1]); px = nx; py = ny; } p.px(px, py, '#5ef0ff'); }
  }, { up: 0.08 });
  // NIVÚLIDO: cúpula de gelatina translúcida con núcleo de copo y un pie-muelle; lanza esferas de escarcha con su tentáculo
  P.mk('nv_frog', 20, 17, 3, (p, f) => {
    const y = f === 1 ? 5 : 7, coil = f === 1 ? 8 : 4;
    for (let k = 0; k < coil; k++) p.px(10 + (k % 2 ? 1 : -1), y + 4 + k, '#5a8ab0'); p.rect(8, Math.min(16, y + 4 + coil), 5, 1, '#3a5a80');
    p.ell(10, y, 7, 5.5, '#8ac4ec'); p.ell(10, y - 1, 6, 4.5, '#c4ecff'); p.ell(8, y - 3, 2, 1, '#ffffff');
    for (let k = 0; k < 3; k++) { const a = k * 1.047; p.line(10 - Math.cos(a) * 2, y + 1 - Math.sin(a) * 2, 10 + Math.cos(a) * 2, y + 1 + Math.sin(a) * 2, '#5ef0ff'); } p.px(10, y + 1, '#ffffff');
    p.px(7, y - 1, '#1a2a4a'); p.px(13, y - 1, '#1a2a4a');
    const tx = f === 2 ? 18 : 16, ty = f === 2 ? y - 5 : y + 3; p.line(15, y + 1, tx, ty, '#5a8ab0'); if (f === 2) p.ell(18, ty - 1, 2, 2, '#ffffff');
    p.line(5, y + 1, 2, y + 4, '#5a8ab0');
  });
  // LUMIVELA: campana flotante con cintas de aurora que ondean
  const lumi = (p, f, bell, rib, metal) => {
    p.ell(13, 5, 7, 4.5, bell[1]); p.ell(13, 4, 5.5, 3, bell[2]); p.px(11, 3, '#ffffff'); p.rect(6, 6, 15, 2, bell[0]);
    for (let k = 0; k < 4; k++) { const x0 = 8 + k * 3.4; for (let y = 8; y < 16; y++) p.px(x0 + Math.round(Math.sin(y * 0.6 + k + f * 2) * 1.2), y, rib[k % rib.length]); }
    if (metal) { p.rect(9, 5, 8, 1, '#ff3050'); p.px(13, 5, '#ffffff'); }
    else { for (const x of [10, 13, 16]) { p.px(x, 5, '#ffffff'); p.px(x, 6, '#1a0a3a'); } p.ell(13, 0.5 + f * 0.5, 5, 1, '#5ef0ff'); p.ell(13, 0.5 + f * 0.5, 3.5, 0.4, bell[0]); p.tri(12, 2, 14, 2, 13, -1, '#d8fff8'); }
  };
  P.mk('nv_dfly', 26, 16, 2, (p, f) => lumi(p, f, ['#4a2a8a', '#8a5ad8', '#d0b0ff'], ['#5ef0c0', '#b48cff', '#5ef0ff']));
  P.mk('nv_dfly_cy', 26, 16, 2, (p, f) => lumi(p, f, MT, ['#8a98bc', '#4e5872'], true));
  // RODAGEL: cuerpo bajo con lomo translúcido lleno de cristales, boca anular con cilios y hileras de cilios-patas
  P.mk('nv_slug', 28, 15, 2, (p, f) => {
    for (let i = 0; i < 9; i++) p.px(4 + i * 2.4, 14 - ((i + f) % 2), '#3a5a80');
    p.sell(13, 9, 11, 5, ['#2a4a6a', '#5a8ab0', '#a8d8f4', '#e8faff']); p.ell(12, 7, 8, 2.5, '#d8f4ff');
    for (let i = 0; i < 4; i++) { const x = 7 + i * 4; p.tri(x - 1.5, 9, x + 1.5, 9, x, 5, '#5ef0ff'); }
    p.ell(25, 9, 3, 3.2, '#2a4a6a'); p.ell(25, 9, 1.8, 2, '#0a1a2a'); for (let k = 0; k < 6; k++) { const a = k * 1.047 + f * 0.5; p.px(25 + Math.cos(a) * 3.6, 9 + Math.sin(a) * 3.6, '#bfefff'); }
  });
  // ESTALACTÓN: vaina de cristal colgante con una rendija ocular; al caer se despliega en estrella
  P.mk('nv_vsnake', 12, 34, 2, (p, f) => {
    if (!f) { p.rect(5, 0, 2, 3, '#8ab4dc'); p.tri(1, 3, 11, 3, 6, 18, '#7ab8e0'); p.tri(1, 3, 6, 3, 6, 18, '#c4ecff'); p.line(4, 9, 8, 9, '#0a1a34'); p.px(6, 9, '#ff8ad8'); return; }
    for (let y = 0; y < 20; y += 2) p.px(6 + (y % 4 ? 1 : 0), y, '#d8f4ff');
    for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + k * 1.257; p.tri(6, 26, 6 + Math.cos(a - 0.35) * 2.5, 26 + Math.sin(a - 0.35) * 2.5, 6 + Math.cos(a) * 6, 26 + Math.sin(a) * 6, '#a8e0ff'); }
    p.ell(6, 26, 2.2, 2.2, '#5a8ab0'); p.px(6, 26, '#ff8ad8');
  });
  // HALÓRIDO: zancudo de seis patas con dos anillos de cristal flotando sobre la cabeza y crin de filamentos
  P.mk('nv_grazer', 38, 28, 3, (p, f) => {
    const st = f === 1 ? 1 : 0, gr = f === 2, B = ['#2a2a4a', '#5a5a8a', '#9a9ac8', '#e0e0ff'];
    for (let i = 0; i < 3; i++) for (const s of [-1, 1]) { const x = 11 + i * 8 + (s > 0 ? 2 : 0); leg(p, x, 16, x + st * s * 2, 21, x + st * s, 27, s > 0 ? B[0] : B[1]); }
    p.sell(20, 13, 12, 5, B); for (let x = 10; x < 30; x += 2) p.line(x, 9, x - 1, 6 - ((x >> 1) % 2), x % 4 ? '#5ef0c0' : '#b48cff');
    const hx = gr ? 34 : 33, hy = gr ? 20 : 8; p.line(29, 11, hx - 1, hy + 2, B[1]); p.sell(hx, hy, 3.5, 3, B); p.px(hx + 1, hy - 1, '#ff8ad8'); p.px(hx + 2, hy, '#ff8ad8');
    if (!gr) { p.ell(hx, hy - 6, 5, 1.6, '#5ef0ff'); p.ell(hx, hy - 6, 3.5, 0.8, '#0a1a34'); p.ell(hx, hy - 9, 3, 1, '#d8fff8'); p.ell(hx, hy - 9, 2, 0.4, '#0a1a34'); }
  });
  // YLVARIS (legendaria): serpiente etérea que flota con aletas de aurora
  P.mk('nv_vellorn', 40, 38, 2, (p, f) => {
    let px = 4, py = 30;
    for (let k = 0; k <= 24; k++) { const t = k / 24, x = 4 + t * 30, y = 28 - Math.sin(t * Math.PI * 1.5 + f * 0.6) * 8 - t * 10; p.thick(px, py, x, y, 3.2 - t * 1.2, k % 3 ? '#8ac4ec' : '#d8f4ff'); if (k % 3 === 0) { p.line(x, y, x - 1, y - 5, k % 6 ? '#5ef0c0' : '#b48cff'); p.line(x, y, x - 1, y + 4, '#b48cff'); } px = x; py = y; }
    p.sell(px + 2, py - 1, 4, 3.2, ['#4a7ab0', '#8ac4ec', '#d8f4ff', '#ffffff']); for (const [x, y] of [[1, -2], [3, -1], [2, 1]]) p.px(px + 2 + x, py - 1 + y, '#ff8ad8');
    for (let k = 0; k < 3; k++) p.line(8 + k * 8, 34, 8 + k * 8 + (f ? 1 : -1), 37, '#5ef0c0');
  }, { up: 0.1 });
};
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildAlienFauna(); }; })();

// ---------- nombres y fichas del Archivo ----------
(function () {
  const S = (id, o) => { const s = P.D.species(id); if (s) Object.assign(s, o); };
  // KHAZIR · fauna
  S('escorpion', { name: 'Kharvex', sci: 'Hexapodon dunaris', behavior: 'Patrulla la arena sobre seis patas articuladas. Cuando algo invade su madriguera, embiste con el tallo ocular hacia atrás.', abilities: 'Un saco trasero que almacena luz solar y la libera de noche.', lore: 'Los cachorros reptilianos aprendían a rastrear siguiendo las huellas de seis puntos del Kharvex.' });
  S('escorpion_cy', { name: 'Kharvex Ciberforjado', sci: 'Hexapodon dunaris (mod. Thersek)', abilities: 'Placas de titanio y una célula de energía en lugar del saco solar.' });
  S('escorpion_rey', { name: 'Kharvex Soberano', sci: 'Hexapodon rex (mutación inducida)', behavior: 'Antiguo patriarca de la colonia, enloquecido por la radiación. Embiste, salta y dispara espinas de su corona.', abilities: 'Corona de aletas doradas y dos tallos oculares.', lore: 'Los clanes lo llamaban «el que no cede la sombra».' });
  S('escarabajo', { name: 'Pirroglobo', sci: 'Pyrosphaera saltans', behavior: 'Bota sobre dos patas-resorte. Si se siente amenazado escupe gotas de su núcleo ardiente.', abilities: 'Un núcleo de fuego visible a través de su piel translúcida y tres ojos frontales.', lore: 'De noche, los oasis se llenaban de pirroglobos brillando como farolillos.' });
  S('buitre', { name: 'Velárido', sci: 'Rhombovelum canyonis', behavior: 'Planea sobre las corrientes calientes con dos pares de alas membranosas y cae en picado sobre los intrusos.', abilities: 'Un racimo de tres ojos que ve el calor.', lore: 'Ver tres veláridos juntos anunciaba lluvia en la tradición del clan solar.' });
  S('halcon_dron', { name: 'Velárido Dron', sci: 'Rhombovelum canyonis (mod. Thersek)', abilities: 'Alas de aleación y óptica roja.', lore: 'Thersek los llama «ojos del gusano».' });
  S('tortuga', { name: 'Cupulón', sci: 'Hexacupula dunaria', behavior: 'Camina despacio sobre seis patitas bajo una cúpula de placas de cristal. Embiste si la acorralan.', diet: 'Raíces y minerales de la arena.', abilities: 'Cúpula de placas hexagonales casi indestructible y una boca-flor sensorial.', lore: 'Hay cupulones más viejos que la República Solar.' });
  S('serpiente', { name: 'Zhirr Colgante', sci: 'Catenaria luminosa', behavior: 'Cuelga del techo como una cadena de cuentas y cae sobre su presa abriendo su boca-farol.', abilities: 'Una boca de pétalos que brilla para atraer insectos.', lore: 'Varkh asegura que es más paciente que cualquier cazador.' });
  S('arenicola', { name: 'Vorágulo', sci: 'Pentoculus arenae', behavior: 'Espera enterrado y emerge cuando algo pisa cerca: abre su boca de pétalos de arenisca, escupe arena y vuelve a hundirse.', abilities: 'Una corona de cinco ojos y anillos bioluminiscentes.', lore: 'Es pariente diminuto del Gran Gusano. Los clanes lo temen y lo respetan.' });
  S('dromotauro', { name: 'Quelvaro', sci: 'Hydrocystis ambulans', behavior: 'Zancudo pacífico que viaja en caravana de oasis en oasis.', abilities: 'Dos vejigas luminosas en el lomo que guardan agua durante meses.', lore: 'Los clanes viajaban a lomos de los quelvaros y pintaban sus vejigas con el color de su clan.' });
  S('esfinge', { name: 'Ssynthra de Cristal', sci: 'Citharaia crystallina', behavior: 'Raya de cristal que flota sobre las dunas restauradas.', abilities: 'Aletas de cuerdas de cristal que cantan con el viento.', lore: 'Las dunas «cantan» porque la Ssynthra les enseñó a hacerlo.' });
  // KHAZIR · flora
  S('cactus_farol', { name: 'Lumbrespina', sci: 'Spinolucerna dunaris' }); S('salvia_roja', { name: 'Pluma Ígnea', sci: 'Pyropenna arenaria' });
  S('bulbo_azufre', { name: 'Sulfúnculo', sci: 'Sulfurella toxica' }); S('calabaza_geiser', { name: 'Vaporbulbo', sci: 'Vaporbulbus saliens' });
  S('cuerda_duna', { name: 'Filamento de Duna', sci: 'Funis deserti' }); S('cardo_vidrio', { name: 'Vitrespina', sci: 'Vitrospina toxica' });
  S('cactus_fauces', { name: 'Fauceespina', sci: 'Spinomandibula vorax', lore: 'Su forma natural se llamaba «Sonrisa del Oasis».' }); S('aloe_solar', { name: 'Solénquima', sci: 'Heliochyma medica', lore: 'Ningún cazador del clan salía al desierto sin una hoja de Solénquima.' });
  S('loto_oasis', { name: 'Nimbalis del Oasis', sci: 'Nimbalis purificans' }); S('rosa_desierto', { name: 'Coronela Solar', sci: 'Coronella heliaca', lore: 'Varkh quiere plantarlas en el santuario de su clan.', eco: 'Alimenta a la Ssynthra de Cristal.' });
  // NÍVORAH · fauna
  S('gloton', { name: 'Krevvuno', sci: 'Glacioscutum cornutum', behavior: 'Se desliza sobre sus seis patas-zanco y carga con su cuerno-ariete contra lo que se acerca a su madriguera.', abilities: 'Escamas de hielo vivo y cuatro ojos en tallos.', lore: 'Los arturianos decían que un krevvuno nunca se pierde en la ventisca.' });
  S('gloton_cy', { name: 'Krevvuno Ciberblindado', sci: 'Glacioscutum cornutum (mod. Thersek)' });
  S('mamut', { name: 'Thrumbar de Escarcha', sci: 'Tristrombus borealis (mutación inducida)', behavior: 'Coloso pacífico enloquecido por los implantes. Embiste y lanza fragmentos de sus agujas de hielo.', abilities: 'Tres agujas luminosas en el lomo y tres trompas-tentáculo.', lore: 'Los arturianos los guiaban con cánticos durante las migraciones.' });
  S('pinguino', { name: 'Nivúlido', sci: 'Gelatinoides nivalis', behavior: 'Bota sobre su pie-muelle y lanza esferas de escarcha con su tentáculo.', diet: 'Microcristales del deshielo.', abilities: 'Cuerpo de gelatina translúcida con un núcleo en forma de copo.', lore: 'Las crías arturianas aprendían a lanzar bolas de nieve imitándolos.' });
  S('polilla', { name: 'Lumivela', sci: 'Campanula volans', behavior: 'Campana flotante que sigue la luz de las auroras arrastrando cintas de colores.', abilities: 'Cintas que reflejan la aurora.', lore: 'Se dice que las auroras son millones de lumivelas flotando a la vez.', eco: 'Poliniza las flores del glaciar.' });
  S('dron_gelido', { name: 'Lumivela Dron', sci: 'Campanula volans (mod. Thersek)' });
  S('foca', { name: 'Rodagel', sci: 'Cilioderma glacialis', behavior: 'Se arrastra despacio sobre hileras de cilios. Embiste si la acorralan.', diet: 'Algas de hielo que filtra con su boca anular.', abilities: 'Lomo translúcido lleno de cristales.', lore: 'Su canto bajo el hielo da nombre al Lago de los Susurros.' });
  S('murcielago', { name: 'Estalactón', sci: 'Stellapendula crystallina', behavior: 'Cuelga del techo como una vaina de cristal y, al caer, se despliega en una estrella de púas.', abilities: 'Cuerpo de cristal casi transparente.', lore: 'Sus colonias brillan como lámparas cuando reflejan la luz.' });
  S('alce_boreal', { name: 'Halórido', sci: 'Halocornis hexapus', behavior: 'Pasta tranquilo bajo la aurora sobre seis patas finas.', abilities: 'Dos anillos de cristal que flotan sobre su cabeza y captan la luz.', lore: 'Sus anillos solo se forman donde la aurora vuelve a brillar.' });
  S('fenix_boreal', { name: 'Ylvaris Boreal', sci: 'Serpentaurora volans', behavior: 'Serpiente etérea que flota sobre la nieve; sus aletas encienden las auroras.', abilities: 'Cuerpo de luz helada y aletas de aurora.', lore: 'Los arturianos fechaban sus calendarios por sus apariciones.', eco: 'Se dice que cada aurora es un vuelo de Ylvaris.' });
  // NÍVORAH · flora
  S('farol_escarcha', { name: 'Campanila de Escarcha', sci: 'Campanula glacialis' }); S('liquen_azul', { name: 'Cianopluma', sci: 'Cyanopenna glacialis', eco: 'Alimento de los Halóridos.' });
  S('hongo_gelido', { name: 'Criomiceto', sci: 'Cryomyces toxicus' }); S('arbol_cristal', { name: 'Prismarbusto', sci: 'Crystalloramus nivalis' });
  S('enredadera_artica', { name: 'Hilonieve', sci: 'Filonivea scandens' }); S('espina_hielo', { name: 'Glacispina', sci: 'Glacies acuta' });
  S('flor_caramb', { name: 'Fauces de Escarcha', sci: 'Cryomandibula vorax' }); S('musgo_termal', { name: 'Calorílico', sci: 'Thermolichen medicum' });
  S('nenufar_termal', { name: 'Velo Termal', sci: 'Velamen calidum' }); S('edelweiss', { name: 'Estrellina Polar', sci: 'Stellaria polaris', eco: 'Alimenta a Ylvaris Boreal.' });
  // recompensas y semillas con los nombres nuevos
  P.D.CODEX_REWARDS.khazir.all.name = 'Oasis de Khazir + Ssynthra'; P.D.CODEX_REWARDS.khazir.all.desc = 'Un oasis para los Jardines y la legendaria Ssynthra de Cristal se traslada a la nave.';
  P.D.CODEX_REWARDS.nivorah.all.name = 'Glaciar de la nave + Ylvaris'; P.D.CODEX_REWARDS.nivorah.all.desc = 'Un rincón helado para los Jardines y la legendaria Ylvaris Boreal se traslada a la nave.';
  P.ART.khazir.seedName = 'Semilla de Coronela Solar'; P.ART.nivorah.seedName = 'Semilla de Estrellina Polar';
  P.D.MISSIONS.s_rosas.name = 'Coronelas para el santuario'; P.D.MISSIONS.s_rosas.desc = 'Varkh necesita 5 semillas de Coronela Solar. Solo brotan en territorios liberados de KHAZIR.';
  P.D.MISSIONS.s_edelweiss.desc = 'Yrsa necesita 5 semillas de Estrellina Polar. Solo brotan en territorios liberados de NÍVORAH.';
})();
