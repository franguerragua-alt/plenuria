'use strict';
// Retratos detallados (64x64) de los tres dirigentes Esqueléticos: MEREK, THERSEK y GERSELLE
(function () {
  const BONE = ['#6e6656', '#b8b09a', '#e6e0cc', '#fffaf0'], SOCK = '#0a0408', SOCK2 = '#1e0e14';
  // calavera sombreada; s = escala, eye = color del brillo de las pupilas
  const skull = (p, cx, cy, s, eye, o = {}) => {
    p.sell(cx, cy - 2 * s, 9.2 * s, 9.6 * s, BONE);
    p.sell(cx, cy + 4.5 * s, (o.narrow ? 6.2 : 7.2) * s, 4.6 * s, BONE);
    for (const sx of [-1, 1]) { p.ell(cx + sx * 8.2 * s, cy + 1.5 * s, 1.5 * s, 3 * s, BONE[0]); p.ell(cx + sx * 6.6 * s, cy + 3.6 * s, 1.8 * s, 1.2 * s, BONE[3]); }
    // cuencas y pupilas brillantes
    for (const sx of [-1, 1]) {
      const ex = cx + sx * 3.7 * s, ey = cy + 0.6 * s;
      p.ell(ex, ey, 3.1 * s, 2.7 * s, SOCK2); p.ell(ex, ey + 0.4 * s, 2.4 * s, 2.1 * s, SOCK);
      p.ell(ex, ey + 0.3 * s, 1.5 * s, 1.4 * s, P.Col.shade(eye, -0.35)); p.ell(ex, ey + 0.2 * s, 0.9 * s, 0.9 * s, eye); p.px(ex - 0.6 * s, ey - 0.4 * s, '#ffffff');
      // ceño
      if (o.brow) { p.line(cx + sx * 1.2 * s, cy - 2.2 * s + o.brow * s, cx + sx * 6.8 * s, cy - 3.4 * s, BONE[0]); p.line(cx + sx * 1.2 * s, cy - 3 * s + o.brow * s, cx + sx * 6.8 * s, cy - 4.2 * s, BONE[3]); }
    }
    // cavidad nasal
    p.tri(cx - 1.4 * s, cy + 4.6 * s, cx + 1.4 * s, cy + 4.6 * s, cx, cy + 2.2 * s, SOCK); p.px(cx, cy + 4.2 * s, SOCK2);
    // dientes y mandíbula
    p.sell(cx, cy + 8.6 * s, (o.narrow ? 4.6 : 5.6) * s, 2.8 * s, BONE);
    for (let i = -4; i <= 4; i++) { const tx = cx + i * 1.15 * s; p.rect(Math.round(tx), Math.round(cy + 6.6 * s), Math.max(1, Math.round(s)), Math.round(2.2 * s), i % 2 ? BONE[3] : BONE[2]); p.px(Math.round(tx), Math.round(cy + 6.4 * s), '#3a2a2a'); }
    p.line(cx - 4.8 * s, cy + 7.8 * s, cx + 4.8 * s, cy + 7.8 * s, '#4a3a34');
    if (o.lips) { p.line(cx - 3.6 * s, cy + 6.5 * s, cx + 3.6 * s, cy + 6.5 * s, o.lips); p.line(cx - 3 * s, cy + 8.8 * s, cx + 3 * s, cy + 8.8 * s, o.lips); }
    // grietas y desgaste
    if (o.cracks) { p.line(cx + 2 * s, cy - 10 * s, cx + 3.5 * s, cy - 6 * s, BONE[0]); p.line(cx + 3.5 * s, cy - 6 * s, cx + 2.4 * s, cy - 4 * s, BONE[0]); p.line(cx - 6 * s, cy - 6 * s, cx - 4 * s, cy - 8 * s, BONE[0]); }
    p.ell(cx - 3 * s, cy - 7 * s, 3 * s, 1.4 * s, BONE[3]);
  };

  P.Sprites.villainPortrait = function (p, who) {
    if (who === 'merek') {
      const RED = ['#2a0410', '#6a0a1a', '#b81e30', '#ff6a6a'], BLK = ['#06040a', '#141018', '#2a2230', '#4a3e54'], GOLD = ['#7a4a0a', '#c88a1a', '#ffd166', '#fff4c0'];
      // capa
      p.tri(4, 64, 60, 64, 32, 30, RED[1]); p.tri(8, 64, 20, 64, 22, 36, RED[0]); p.tri(44, 64, 56, 64, 42, 36, RED[0]);
      // báculo con orbe
      p.thick(55, 20, 57, 64, 3, BLK[2]); p.line(55, 20, 56, 64, BLK[3]);
      for (const a of [-2.4, -1.57, -0.7]) p.thick(56, 14, 56 + Math.cos(a) * 7, 14 + Math.sin(a) * 7, 2, GOLD[1]);
      p.sell(56, 12, 5, 5, ['#5a0010', '#d01a2a', '#ff6a6a', '#ffffff']); p.px(54, 10, '#ffffff'); p.px(55, 9, '#ffd0d0');
      // torso: peto negro con caja torácica ósea y gema
      p.sell(32, 56, 17, 12, BLK);
      for (let i = 0; i < 4; i++) { p.line(25, 47 + i * 4, 31, 49 + i * 4, BONE[2]); p.line(39, 47 + i * 4, 33, 49 + i * 4, BONE[2]); p.line(25, 48 + i * 4, 30, 50 + i * 4, BONE[0]); }
      p.rect(31, 45, 2, 18, BONE[1]); p.sell(32, 44, 3, 3, ['#5a0010', '#d01a2a', '#ff6a6a', '#ffffff']);
      // hombreras carmesí con púas
      for (const sx of [-1, 1]) {
        p.sell(32 + sx * 17, 42, 11, 8, RED); p.ell(32 + sx * 17, 47, 10, 2, RED[0]); p.line(32 + sx * 9, 44, 32 + sx * 27, 44, GOLD[1]);
        for (let k = 0; k < 3; k++) p.tri(32 + sx * (11 + k * 5) - 2, 37, 32 + sx * (11 + k * 5) + 2, 37, 32 + sx * (12 + k * 5), 31 - k, BLK[3]);
      }
      // gorjal
      p.sell(32, 36, 9, 4, BLK); p.rect(25, 37, 14, 1, GOLD[1]);
      // cuernos curvos
      // cuernos curvos de toro: salen de las sienes, se abren y suben curvándose hacia dentro
      for (const sx of [-1, 1]) {
        const N = 30;
        for (let k = 0; k <= N; k++) {
          const t = k / N, x = 32 + sx * (8 + 14 * Math.sin(t * 1.7) - 7 * t * t * t), y = 17 - 16 * t + 3 * Math.sin(t * 3.1), w = 5.5 * (1 - t) + 1.3;
          const col = k % 5 === 0 ? '#4a2e14' : t < 0.45 ? '#8a6232' : t < 0.8 ? '#c89a5a' : '#f4dcaa';
          p.thick(x, y, x, y, w, col); if (t < 0.85) p.px(x - sx * w * 0.3, y - w * 0.35, t < 0.5 ? '#b08048' : '#fff0c8');
        }
      }
      skull(p, 32, 22, 1.15, '#ff2a3a', { brow: -1, cracks: true });
      // corona de hierro
      p.rect(23, 9, 18, 3, BLK[2]); for (let i = 0; i < 4; i++) p.tri(24 + i * 5, 9, 28 + i * 5, 9, 26 + i * 5, 4, BLK[3]); p.px(32, 10, '#ff2a3a');
    }
    if (who === 'thersek') {
      const GR = ['#08240f', '#16501f', '#2f8a38', '#6ad060'], MT = ['#1a1e2a', '#3a4258', '#7a86a4', '#c8d4ec'], GOLD = ['#7a4a0a', '#c88a1a', '#ffd166', '#fff4c0'], NEON = '#7dff5a';
      // tentáculos mecánicos tras los hombros
      for (const [sx, ph] of [[-1, 0], [1, 1.3], [-1, 2.4], [1, 3.4]]) {
        let x = 32 + sx * 10, y = 44;
        for (let k = 0; k < 16; k++) { const nx = x + sx * (1.6 + Math.sin(k * 0.5 + ph) * 0.8), ny = y - 1.5 + Math.cos(k * 0.45 + ph) * 1.4; p.thick(nx, ny, nx, ny, 3, k % 3 === 0 ? MT[3] : MT[2]); p.px(nx, ny + 1, MT[0]); x = nx; y = ny; }
        p.ell(x, y, 2.2, 2.2, '#1a4a10'); p.px(x, y, NEON); p.px(x + sx, y - 1, '#e0ffd0');
      }
      // guerrera verde con charreteras, medallas y cinturón
      p.sell(32, 58, 18, 13, GR);
      for (const sx of [-1, 1]) { p.sell(32 + sx * 15, 46, 7, 4, [GOLD[0], GOLD[1], GOLD[2], GOLD[3]]); for (let k = 0; k < 5; k++) p.line(32 + sx * (10 + k * 2), 49, 32 + sx * (10 + k * 2), 52, GOLD[1]); }
      p.rect(31, 44, 2, 20, GR[0]); for (let i = 0; i < 4; i++) p.px(34, 48 + i * 4, GOLD[2]);
      for (let i = 0; i < 3; i++) { p.rect(19 + i * 3, 50, 2, 3, ['#c0283a', '#2a6ad8', '#ffd166'][i]); p.ell(20 + i * 3, 55, 1.2, 1.2, GOLD[2]); }
      p.rect(16, 60, 32, 3, '#141018'); p.sell(32, 61, 3, 2, BONE);
      // cuello alto
      p.rect(25, 38, 14, 5, GR[1]); p.rect(25, 38, 14, 1, GR[3]); p.px(27, 40, GOLD[2]); p.px(36, 40, GOLD[2]);
      skull(p, 32, 25, 1.08, NEON, { brow: 0 });
      // monóculo cibernético sobre el ojo derecho
      p.ell(36, 25.5, 4.2, 4.2, MT[2]); p.ell(36, 25.5, 3.2, 3.2, '#0a2a10'); p.ell(36, 25.5, 2, 2, NEON); p.px(35, 24, '#ffffff'); p.thick(40, 25, 44, 30, 1.5, MT[1]); p.px(44, 31, NEON);
      // gorra de plato militar
      p.sell(32, 12, 15, 5, GR); p.rect(19, 13, 26, 3, '#c0283a'); p.rect(19, 13, 26, 1, '#ff6a6a');
      p.ell(32, 16.5, 14, 2.2, '#0a0a10'); p.line(20, 16, 44, 16, '#3a3a4a');
      p.sell(32, 10, 3.2, 3, [GOLD[0], GOLD[1], GOLD[2], GOLD[3]]); for (const sx of [-1, 1]) p.tri(32 + sx * 2, 10, 32 + sx * 9, 7, 32 + sx * 7, 11, GOLD[1]);
    }
    if (who === 'gerselle') {
      const BLK = ['#040306', '#0e0a12', '#1e1824', '#3a3046'], RED = ['#4a0410', '#9a0e22', '#e02a40', '#ff8a9a'], GOLD = ['#7a4a0a', '#c88a1a', '#ffd166', '#fff4c0'];
      // moño y melena negra brillante
      const HAIR = ['#07050c', '#1a1426', '#3a2e52', '#6a5a8a'];
      p.sell(32, 18, 15, 15, HAIR); p.sell(32, 5, 8.5, 5.5, HAIR); p.ell(29, 3, 3.5, 1.4, HAIR[3]);
      for (const sx of [-1, 1]) { p.thick(32 + sx * 12, 18, 32 + sx * 12.5, 33, 4.5, HAIR[1]); p.line(32 + sx * 11, 13, 32 + sx * 12, 31, HAIR[2]); p.line(32 + sx * 13, 16, 32 + sx * 13, 26, HAIR[3]); }
      for (let k = 0; k < 4; k++) p.line(22 + k * 5, 4 + (k % 2), 24 + k * 5, 2, HAIR[3]);
      // rosas rojas y horquilla dorada
      const rose = (x, y, r) => { p.sell(x, y, r, r, RED); for (let k = 0; k < 3; k++) p.line(x - r * 0.6 + k * r * 0.5, y - r * 0.5, x - r * 0.3 + k * r * 0.4, y + r * 0.3, RED[0]); p.px(x - 1, y - 1, RED[3]); };
      rose(43, 9, 4); rose(48, 14, 3); rose(39, 5, 2.6); p.ell(47, 18, 2.4, 1.2, '#1f6a2e'); p.ell(36, 3, 2.2, 1, '#1f6a2e');
      p.line(18, 8, 28, 5, GOLD[2]); p.px(17, 8, GOLD[3]); p.px(18, 9, '#e02a40');
      // vestido de cuello alto con ribetes rojos y banda militar
      // busto esbelto con vestido de cuello alto, bordados rojos y banda militar
      p.sell(32, 60, 14, 15, BLK); p.sell(32, 47, 12, 4.5, BLK);
      p.rect(27, 37, 10, 9, BLK[2]); p.rect(27, 37, 10, 1, RED[2]); p.rect(27, 45, 10, 1, RED[1]); p.px(32, 41, GOLD[2]);
      for (let i = 0; i < 3; i++) { p.rect(33, 49 + i * 4, 4, 1, RED[2]); p.px(35, 48 + i * 4, RED[3]); }
      for (const sx of [-1, 1]) { p.line(32 + sx * 4, 46, 32 + sx * 11, 50, RED[1]); p.px(32 + sx * 11, 50, RED[3]); }
      p.thick(21, 50, 42, 64, 3, RED[1]); p.line(21, 49, 42, 63, RED[3]); p.sell(28, 55, 2.8, 2.8, [GOLD[0], GOLD[1], GOLD[2], GOLD[3]]); p.px(27, 54, '#ffffff');
      // pendientes
      for (const sx of [-1, 1]) { p.line(32 + sx * 9.5, 27, 32 + sx * 9.5, 31, GOLD[2]); p.ell(32 + sx * 9.5, 32.5, 1.4, 1.8, RED[2]); }
      skull(p, 32, 21, 1.06, '#ff2a4a', { narrow: true });
      // flequillo enmarcando el rostro
      p.tri(21, 8, 34, 8, 23, 17, BLK[1]); p.tri(30, 8, 43, 8, 41, 16, BLK[1]); p.line(24, 9, 25, 15, BLK[3]); p.line(38, 9, 40, 14, BLK[3]);
    }
  };
})();
