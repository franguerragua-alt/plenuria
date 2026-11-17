'use strict';
// MEREK — el Presidente, jefe final del juego, en el Trono del Imperio.
// Diseño (referencia): armadura negra y roja, cuernos curvos, calavera de ojos rojos, costillas expuestas, capa y báculo
// con un orbe de energía roja. Tres fases (HISTORIA.md §5): 1 caballero (cuerpo a cuerpo) · 2 gigante detrás del escenario
// (patrón de jefe gigante: solo su puño apoyado en el suelo recibe daño) · 3 mutación (bestia brutal e impredecible).
P.Sprites.buildMerek = function () {
  const K = ['#08060a', '#16101a', '#241a26', '#36283a', '#4e3a50'], R = ['#4a0810', '#8a0e1c', '#d0202e', '#ff5a6a'], B = ['#8a8070', '#c8bea4', '#f4eedc'], GD = '#c0962a';
  const POSE = [[0, 0, 0], [1, 0, 0], [0, 4, 0], [0, -4, 0], [0, 0, 1], [2, 3, 2], [0, 0, 3], [12, 0, 0]];
  const horns = (p, cx, cy, s) => { for (const sd of [-1, 1]) { let x = cx + sd * 5 * s, y = cy - 4 * s, a = -Math.PI / 2 - sd * 0.9; for (let k = 0; k < 18; k++) { a += sd * 0.13; x += Math.cos(a) * 1.3 * s; y += Math.sin(a) * 1.3 * s; const w = Math.max(1, (3.2 - k / 6) * s); p.rect(Math.round(x - w / 2), Math.round(y - w / 2), Math.round(w), Math.round(w), k % 3 ? R[1] : R[0]); p.px(Math.round(x - w / 2), Math.round(y - w / 2), R[2]); } } };
  P.mk('merek', 64, 84, 8, (p, f) => {
    const [by, st, staff] = POSE[f], kneel = f === 7;
    // capa
    p.tri(14, 26 + by, 50, 26 + by, 54, 82, R[0]); p.tri(14, 26 + by, 10, 82, 54, 82, R[1]); p.line(10, 82, 54, 82, R[2]);
    // piernas acorazadas con rodilleras rojas
    if (!kneel) { p.thick(25, 56 + by, 25 - st, 82, 7, K[2]); p.thick(39, 56 + by, 39 + st, 82, 7, K[3]); p.sell(25 - st / 2, 66 + by / 2, 4.5, 4.5, [R[0], R[1], R[2], R[3]]); p.sell(39 + st / 2, 66 + by / 2, 4.5, 4.5, [R[0], R[1], R[2], R[3]]); p.rect(19 - st, 79, 12, 5, K[1]); p.rect(33 + st, 79, 12, 5, K[1]); }
    else { p.thick(24, 64, 16, 82, 7, K[2]); p.thick(40, 64, 50, 80, 7, K[3]); p.sell(18, 74, 4.5, 4.5, [R[0], R[1], R[2], R[3]]); }
    // torso: placas negras, costillas de hueso expuestas, faja roja con hebilla y tabardo
    p.rect(18, 28 + by, 28, 30, K[2]); p.rect(18, 28 + by, 3, 30, K[4]); p.rect(43, 28 + by, 3, 30, K[0]);
    for (let k = 0; k < 5; k++) { p.line(25, 33 + by + k * 4, 31, 31 + by + k * 4, B[1]); p.line(39, 33 + by + k * 4, 33, 31 + by + k * 4, B[1]); p.px(32, 31 + by + k * 4, B[2]); } p.rect(31, 30 + by, 2, 22, B[0]);
    p.rect(18, 52 + by, 28, 5, R[1]); p.rect(18, 52 + by, 28, 1, R[2]); p.sell(32, 54 + by, 3, 3, [R[0], R[2], R[3], '#ffffff']); p.rect(29, 57 + by, 6, 22, R[1]); p.rect(29, 57 + by, 6, 1, R[2]); p.tri(29, 79, 35, 79, 32, 83, R[1]);
    // hombreras rojas con borde de hueso
    for (const sd of [-1, 1]) { const x0 = 32 + sd * 18; p.sell(x0, 28 + by, 10, 8, [R[0], R[1], R[2], R[3]]); p.rect(x0 - 9, 33 + by, 18, 2, B[1]); p.tri(x0 - 3, 22 + by, x0 + 3, 22 + by, x0 + sd * 2, 15 + by, K[3]); }
    // cabeza: calavera con ojos rojos y cuernos curvos
    horns(p, 32, 14 + by, 1); p.sell(32, 16 + by, 7, 8, [B[0], B[1], B[2], '#ffffff']); p.rect(27, 14 + by, 4, 4, K[0]); p.rect(33, 14 + by, 4, 4, K[0]); p.px(28, 15 + by, '#ff2a4a'); p.px(35, 15 + by, '#ff2a4a'); p.rect(31, 19 + by, 2, 2, K[0]); for (let x = 28; x < 37; x += 2) p.px(x, 22 + by, K[0]); p.rect(25, 23 + by, 14, 3, R[1]);
    // báculo con orbe rojo y guantelete
    const hx = staff === 1 ? 50 : staff === 2 ? 58 : staff === 3 ? 56 : 52, hy = staff === 1 ? 12 : staff === 2 ? 40 : staff === 3 ? 32 : 44;
    p.thick(44, 32 + by, hx, hy + by, 5, K[3]); p.sell(hx, hy + by, 3.4, 3.4, [K[1], K[2], R[1]]);
    const top = staff === 1 ? [hx, hy - 30] : staff === 2 ? [hx + 6, hy + 14] : staff === 3 ? [hx + 8, hy - 6] : [hx, hy - 34], bot = staff === 1 ? [hx, hy + 18] : staff === 2 ? [hx - 14, hy - 26] : staff === 3 ? [hx - 20, hy + 6] : [hx, hy + 30];
    p.thick(bot[0], bot[1] + by, top[0], top[1] + by, 2, K[1]); p.sell(top[0], top[1] + by, 4, 4, [R[0], R[1], R[2], '#ffd0d4']); p.thick(18, 32 + by, 14, 50 + by, 5, K[3]); p.sell(14, 51 + by, 3.4, 3.4, [K[1], K[2], R[1]]);
  });
  // MEREK gigante (de la cintura arriba). Hombreras de tres lamas con filigrana dorada, calavera imperial, remaches,
  // púas curvas y cañón; peto con placas laterales, caja torácica abierta y engaste del reactor; brazos segmentados.
  // El núcleo, los ojos y las bocas de los cañones se dibujan en tiempo real (mismas coordenadas que antes).
  const G4 = ['#4a300a', '#8a6a1a', GD, '#ffe08a'];
  const rivet = (p, x, y) => { p.rect(x, y, 2, 2, G4[1]); p.px(x, y, G4[3]); };
  const arc = (cx, cy, rx, ry, a0, a1, st, fn) => { for (let a = a0; a <= a1; a += st) fn(Math.round(cx + Math.cos(a) * rx), Math.round(cy + Math.sin(a) * ry), a); };
  P.mk('merek_giant', 320, 240, 1, p => {
    // capa con pliegues y ribete dorado
    p.tri(60, 90, 260, 90, 300, 240, R[0]); p.tri(60, 90, 20, 240, 300, 240, R[1]);
    for (let i = 0; i < 9; i++) { const xt = 68 + i * 23, xb = 28 + i * 33; p.line(xt, 92, xb, 240, R[0]); p.line(xt + 1, 92, xb + 2, 240, i % 2 ? R[2] : R[1]); }
    p.rect(60, 89, 200, 2, G4[2]);
    // brazos: placas segmentadas, codera roja con púa y brazal
    for (const sd of [-1, 1]) {
      const x0 = 160 + sd * 78, ax = x0 + sd * 40, bx = x0 + sd * 54, at = t => [Math.round(ax + (bx - ax) * t), Math.round(130 + 90 * t)];
      p.thick(ax, 130, bx, 220, 18, K[3]); p.thick(ax - 6, 130, bx - 6, 220, 3, K[4]); p.thick(ax + 6, 130, bx + 6, 220, 3, K[1]);
      for (const t of [0.22, 0.34, 0.7]) { const [px, py] = at(t); p.rect(px - 12, py - 2, 24, 5, K[2]); p.rect(px - 12, py - 2, 24, 1, K[4]); p.rect(px - 12, py + 2, 24, 1, K[0]); rivet(p, px - 10, py); rivet(p, px + 8, py); }
      const [ex, ey] = at(0.5); p.sell(ex, ey, 14, 10, [R[0], R[1], R[2], R[3]]); arc(ex, ey, 13, 9, 0.2, Math.PI - 0.2, 0.08, (x, y) => p.px(x, y, G4[2]));
      p.tri(ex + sd * 11, ey - 4, ex + sd * 11, ey + 4, ex + sd * 26, ey - 3, K[2]); p.line(ex + sd * 12, ey - 3, ex + sd * 25, ey - 3, K[4]);
      const [vx, vy] = at(0.88); p.sell(vx, vy, 13, 14, [K[1], K[2], K[3], K[4]]); p.rect(vx - 12, vy - 1, 24, 2, R[1]); p.rect(vx - 12, vy - 1, 24, 1, R[3]); rivet(p, vx - 6, vy - 8); rivet(p, vx + 4, vy - 8);
    }
    // peto: placas laterales (lamas) con ribete dorado, galones y remaches
    p.rect(100, 96, 120, 144, K[2]); p.rect(100, 96, 6, 144, K[4]); p.rect(214, 96, 6, 144, K[0]);
    for (const sd of [-1, 1]) {
      const xa = sd < 0 ? 100 : 196;
      for (let k = 0; k < 4; k++) {
        const y = 98 + k * 27; p.rect(xa, y, 24, 25, sd < 0 ? K[3] : K[2]); p.rect(xa, y, 24, 1, K[4]); p.rect(xa, y + 24, 24, 1, K[0]); p.rect(sd < 0 ? xa + 23 : xa, y, 1, 25, G4[2]);
        rivet(p, xa + 3, y + 3); rivet(p, xa + 19, y + 3); p.line(xa + 7, y + 10, xa + 12, y + 16, G4[2]); p.line(xa + 12, y + 16, xa + 17, y + 10, G4[2]); p.px(xa + 12, y + 12, G4[3]);
      }
    }
    // caja torácica abierta: hueco profundo, costillas con volumen y esternón por vértebras
    for (let y = 98; y < 208; y++) for (let x = 124; x < 196; x++) p.dith(x, y, K[0], K[1], Math.max(0, Math.abs(x - 160) - 22) / 14);
    for (let k = 0; k < 7; k++) { const y = 112 + k * 14; for (const sd of [-1, 1]) { const xo = 160 + sd * 34, xi = 160 + sd * 5; p.thick(xo, y + 8, xi, y, 4, B[0]); p.thick(xo, y + 7, xi, y - 1, 2, B[1]); p.line(xo, y + 6, xi, y - 2, B[2]); } }
    for (let y = 100; y < 206; y += 9) { if (Math.abs(y + 3 - 150) < 24) continue; p.rect(155, y, 10, 7, B[1]); p.rect(155, y, 10, 1, B[2]); p.rect(155, y + 6, 10, 1, B[0]); }
    // engaste dorado del reactor con abrazaderas
    p.ell(160, 150, 22, 22, K[1]); p.sell(160, 150, 19, 19, G4); p.ell(160, 150, 15, 15, K[0]);
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, x = Math.round(160 + Math.cos(a) * 18), y = Math.round(150 + Math.sin(a) * 18); p.rect(x - 2, y - 2, 4, 4, K[3]); p.px(x - 2, y - 2, K[4]); }
    // fajín con tachuelas, hebilla de calavera y tabardo
    p.rect(100, 208, 120, 18, R[1]); p.rect(100, 208, 120, 2, R[2]); p.rect(100, 224, 120, 2, R[0]); p.rect(100, 207, 120, 1, G4[2]); p.rect(100, 226, 120, 1, G4[2]);
    for (let x = 106; x < 216; x += 12) if (Math.abs(x - 160) > 18) { p.rect(x, 215, 3, 3, G4[1]); p.px(x, 215, G4[3]); }
    p.sell(160, 217, 16, 10, G4); p.sell(160, 216, 7, 7, [B[0], B[1], B[2], '#ffffff']); p.rect(156, 214, 3, 3, K[0]); p.rect(161, 214, 3, 3, K[0]); p.px(157, 215, R[3]); p.px(162, 215, R[3]); p.rect(158, 220, 4, 1, K[0]);
    p.rect(144, 227, 32, 13, R[1]); p.rect(144, 227, 1, 13, G4[2]); p.rect(175, 227, 1, 13, G4[2]); p.tri(152, 229, 168, 229, 160, 239, R[2]);
    // gorguera de tres lamas bajo la calavera
    for (let k = 2; k >= 0; k--) { const w = 64 + k * 12, x = 160 - w / 2, y = 88 + k * 6; p.rect(x, y, w, 7, k % 2 ? K[2] : K[3]); p.rect(x, y, w, 1, K[4]); p.rect(x, y + 6, w, 1, G4[2]); }
    p.sell(160, 104, 4, 3, [R[0], R[2], R[3], '#ffffff']);
    // HOMBRERAS
    for (const sd of [-1, 1]) {
      const x0 = 160 + sd * 78, y0 = 100;
      p.ell(x0 + sd * 2, y0 + 6, 49, 37, K[1]);
      // lama inferior rematada con vértebras y dientes de hueso
      p.sell(x0 + sd * 5, y0 + 20, 45, 15, [R[0], R[0], R[1], R[2]]);
      for (let i = -5; i <= 5; i++) { const bx = x0 + sd * 5 + i * 8, by = Math.round(y0 + 33 - i * i * 0.3); p.tri(bx - 2, by + 2, bx + 2, by + 2, bx, by + 7, B[1]); p.px(bx, by + 3, B[2]); p.sell(bx, by, 4, 3, [B[0], B[1], B[2], '#ffffff']); p.px(bx - 4, by, K[0]); }
      // lama media con filo dorado
      p.sell(x0 + sd * 3, y0 + 8, 47, 18, [R[0], R[1], R[2], R[3]]);
      arc(x0 + sd * 3, y0 + 8, 46, 17, 0.15, Math.PI - 0.15, 0.02, (x, y) => p.px(x, y, G4[2]));
      // cúpula superior con filo dorado, luz de borde y banda grabada
      p.sell(x0, y0 - 4, 44, 27, [R[0], R[1], R[2], R[3]]);
      arc(x0, y0 - 4, 43, 26, 0.1, Math.PI - 0.1, 0.02, (x, y) => { p.px(x, y, G4[2]); p.px(x, y - 1, G4[1]); });
      arc(x0, y0 - 4, 44, 27, Math.PI + 0.3, 2 * Math.PI - 0.3, 0.02, (x, y) => p.px(x, y, R[3]));
      arc(x0, y0 - 4, 32, 18, Math.PI + 0.35, 2 * Math.PI - 0.35, 0.03, (x, y, a) => { p.px(x, y, G4[2]); if (Math.round(a * 20) % 6 === 0) { p.px(x, y - 1, G4[3]); p.px(x, y + 1, G4[1]); } });
      for (const s2 of [-1, 1]) { const vx = x0 + s2 * 24, vy = y0 + 4; arc(vx, vy, 5, 4, 0, Math.PI * 1.6, 0.2, (x, y) => p.px(x, y, G4[2])); p.px(vx, vy, G4[3]); }
      // emblema: calavera imperial con laurel dorado
      const ex = x0 + sd * 4, ey = y0 - 6;
      arc(ex, ey + 1, 13, 12, Math.PI * 0.6, Math.PI * 1.4, 0.1, (x, y) => { p.px(x, y, G4[2]); p.px(x - 1, y - 1, G4[3]); });
      arc(ex, ey + 1, 13, 12, -Math.PI * 0.4, Math.PI * 0.4, 0.1, (x, y) => { p.px(x, y, G4[2]); p.px(x + 1, y - 1, G4[3]); });
      p.sell(ex, ey, 8, 9, [B[0], B[1], B[2], '#ffffff']); p.rect(ex - 5, ey - 2, 4, 4, K[0]); p.rect(ex + 1, ey - 2, 4, 4, K[0]); p.px(ex - 4, ey - 1, R[3]); p.px(ex + 2, ey - 1, R[3]); p.px(ex, ey + 3, K[0]); for (let x = ex - 4; x <= ex + 4; x += 2) p.px(x, ey + 7, K[0]);
      // remaches por el borde y arañazos de batalla
      for (let i = 0; i < 9; i++) { const a = Math.PI * (0.12 + i * 0.095); rivet(p, Math.round(x0 + Math.cos(a) * 38), Math.round(y0 - 4 + Math.sin(a) * 21)); }
      p.line(x0 - sd * 26, y0 - 14, x0 - sd * 14, y0 - 8, R[0]); p.line(x0 - sd * 26, y0 - 15, x0 - sd * 14, y0 - 9, R[3]); p.line(x0 + sd * 22, y0 + 12, x0 + sd * 31, y0 + 6, R[0]);
      // tres púas curvas hacia fuera
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + sd * (0.55 + i * 0.38), Ls = 24 - i * 5; let x = x0 + Math.cos(a) * 40, y = y0 - 4 + Math.sin(a) * 24, d = a;
        for (let k = 0; k < Ls; k++) { d += sd * 0.035; x += Math.cos(d) * 1.2; y += Math.sin(d) * 1.2; const w = Math.max(1, Math.round(7 * (1 - k / Ls))); p.rect(Math.round(x - w / 2), Math.round(y - w / 2), w, w, K[2]); p.px(Math.round(x - w / 2), Math.round(y - w / 2), K[4]); if (k > Ls - 4) p.px(Math.round(x), Math.round(y), R[2]); }
      }
      // cañón del hombro: base con remaches, cuerpo con rejillas incandescentes y cañón con anillo dorado
      p.sell(x0, 82, 16, 6, [K[1], K[2], K[3], K[4]]); rivet(p, x0 - 12, 82); rivet(p, x0 + 10, 82);
      p.rect(x0 - 11, 58, 22, 24, K[3]); p.rect(x0 - 11, 58, 3, 24, K[4]); p.rect(x0 + 8, 58, 3, 24, K[1]);
      for (const vy of [64, 69, 74]) { p.rect(x0 - 6, vy, 12, 2, K[0]); p.rect(x0 - 5, vy, 10, 1, R[2]); }
      p.rect(x0 - 8, 44, 16, 15, K[2]); p.rect(x0 - 8, 44, 2, 15, K[4]); p.rect(x0 - 9, 47, 18, 2, K[4]); p.rect(x0 - 9, 55, 18, 3, G4[2]); p.rect(x0 - 9, 55, 18, 1, G4[3]);
      p.ell(x0, 50, 6, 4, K[1]); p.ell(x0, 50, 4, 2.5, '#000000'); p.px(x0 - 2, 49, R[3]);
    }
    // cabeza: calavera con cuernos (sin cambios en la posición de los ojos)
    p.rect(132, 90, 56, 4, R[1]);
    horns(p, 160, 52, 4.4); p.sell(160, 58, 30, 34, [B[0], B[1], B[2], '#ffffff']); p.rect(138, 46, 16, 16, K[0]); p.rect(166, 46, 16, 16, K[0]); p.rect(156, 66, 8, 8, K[0]); for (let x = 140; x < 182; x += 6) p.rect(x, 84, 3, 6, K[0]);
  }, { up: 0.04, down: 0.1, dark: 0.35 });
  // guantelete del gigante: nudilleras rojas, dedos articulados, dorso con calavera y puño con remaches
  P.mk('merek_fist', 64, 48, 2, (p, f) => {
    p.sell(32, 27, 28, 19, [K[1], K[2], K[3], K[4]]);
    for (let k = 0; k < 4; k++) {
      const x = 8 + k * 13; p.rect(x, 7, 11, 18, K[3]); p.rect(x, 7, 2, 18, K[4]); p.rect(x + 9, 7, 2, 18, K[1]); p.rect(x, 15, 11, 1, K[0]); p.rect(x, 16, 11, 1, K[4]);
      p.rect(x + 1, 2, 9, 6, R[1]); p.rect(x + 1, 2, 9, 1, R[3]); p.rect(x + 1, 7, 9, 1, R[0]); p.px(x + 5, 4, G4[3]); p.tri(x + 3, 2, x + 7, 2, x + 5, -1, K[2]);
    }
    p.sell(32, 31, 13, 6, [R[0], R[1], R[2], R[3]]); arc(32, 31, 12, 5, 0.2, Math.PI - 0.2, 0.1, (x, y) => p.px(x, y, G4[2])); p.sell(32, 30, 4, 4, [B[0], B[1], B[2], '#ffffff']); p.px(31, 30, K[0]); p.px(33, 30, K[0]);
    p.rect(4, 38, 56, 8, R[1]); p.rect(4, 38, 56, 1, G4[2]); p.rect(4, 45, 56, 1, G4[2]); for (let x = 8; x < 58; x += 8) rivet(p, x, 41);
    if (f) for (let k = 0; k < 5; k++) p.line(10 + k * 10, 24, 14 + k * 10, 37, R[3]);
  });
  // MEREK mutado: bestia colosal (el doble que antes) de lomo acorazado, costillas abiertas, cuatro ojos, cuernos y garras
  P.mk('merek_beast', 216, 154, 6, (p, f) => {
    const o = 10, run = f === 1 || f === 2, ph = f === 2 ? 1 : 0, pounce = f === 3, roar = f === 4, stun = f === 5, by = (stun ? 12 : pounce ? -12 : 0) + o;
    // zarcillos de energía oscura (cola)
    for (let k = 0; k < 4; k++) { let x = 40, y = 50 + by + k * 10; for (let j = 0; j < 30; j++) { x -= 1.1; y += Math.sin(j * 0.32 + k + f) * 1.4; const w = Math.max(1, Math.round(4 - j / 9)); p.rect(Math.round(x), Math.round(y), w, w, j % 6 === 0 ? R[2] : K[3]); if (j % 6 === 0) p.px(Math.round(x), Math.round(y) - 1, R[3]); } }
    // patas: muslo, rodilla roja, espolón y garras de hueso (las traseras más oscuras)
    for (const [lx, k, col] of [[52, 0, K[1]], [80, 1, K[2]], [140, 2, K[1]], [168, 3, K[2]]]) {
      const sw = run ? (k % 2 === ph ? 12 : -12) : 0, ly = (pounce ? 112 : 132) + o, kx = Math.round(lx + sw * 0.4 + (k < 2 ? -6 : 6)), ky = Math.round(84 + by + (ly - 84 - by) * 0.45);
      p.thick(lx, 84 + by, kx, ky, 14, col); p.thick(kx, ky, lx + sw, ly, 11, col); p.thick(lx - 4, 84 + by, kx - 4, ky, 3, K[4]);
      p.sell(kx, ky, 7, 6, [R[0], R[1], R[2], R[3]]); p.tri(kx - 3, ky - 4, kx + 3, ky - 4, kx + (k < 2 ? -8 : 8), ky - 14, K[3]);
      for (let c2 = 0; c2 < 4; c2++) { const cx2 = lx + sw - 8 + c2 * 5; p.thick(cx2, ly, cx2 - 3 + c2 * 2, ly + 10, 2, B[1]); p.px(cx2 - 3 + c2 * 2, ly + 10, B[2]); }
    }
    // cuerpo, placas dorsales, costillas abiertas con tendones y núcleo
    p.sell(112, 72 + by, 80, 36, [K[0], K[1], K[2], K[3]]);
    for (let k = 0; k < 8; k++) { const px2 = 52 + k * 15, py2 = Math.round(44 + by + Math.abs(k - 3.5) * 2); p.sell(px2, py2, 9, 6, [K[1], K[2], K[3], K[4]]); p.line(px2 - 7, py2 + 4, px2 + 7, py2 + 4, K[0]); }
    for (let k = 0; k < 7; k++) { const x1 = 80 + k * 12; p.thick(x1, 52 + by, x1 - 8, 94 + by, 4, B[0]); p.thick(x1, 52 + by, x1 - 8, 94 + by, 2, B[1]); p.line(x1 + 1, 52 + by, x1 - 7, 94 + by, B[2]); if (k < 6) p.line(x1 + 2, 74 + by, x1 + 8, 72 + by, R[1]); }
    p.sell(112, 74 + by, 16, 14, [R[0], R[1], R[2], R[3]]); p.sell(110, 71 + by, 6, 5, [R[2], R[3], '#ffd0d4', '#ffffff']);
    for (const [x1, y1, x2, y2] of [[60, 66, 72, 80], [150, 60, 162, 76], [130, 92, 142, 100]]) p.line(x1, y1 + by, x2, y2 + by, R[2]);
    // espinas del lomo
    for (let k = 0; k < 9; k++) { const sx = 46 + k * 15; p.tri(sx, 44 + by, sx + 10, 44 + by, sx + 7, 18 + by - (k % 2) * 12, k % 2 ? R[1] : K[3]); p.line(sx + 2, 42 + by, sx + 6, 22 + by - (k % 2) * 12, k % 2 ? R[3] : K[4]); }
    // cabeza: cráneo con cuernos, cuatro ojos, grieta y mandíbula de colmillos
    const hx = 184, hy = 60 + by + (roar ? -8 : 0); horns(p, hx, hy - 4, 2.2);
    p.sell(hx, hy, 24, 18, [B[0], B[1], B[2], '#ffffff']); p.rect(hx - 20, hy + 2, 40, 3, B[0]); p.line(hx - 2, hy - 13, hx + 2, hy - 3, B[0]);
    for (const [ex, ey] of [[hx - 9, hy - 7], [hx + 5, hy - 7], [hx - 13, hy + 1], [hx + 9, hy + 1]]) { p.rect(ex, ey, 5, 4, K[0]); p.rect(ex + 1, ey + 1, 3, 2, '#ff2a4a'); p.px(ex + 1, ey + 1, '#ffd0d4'); }
    const jo = roar || pounce ? 16 : 6; p.rect(hx - 14, hy + 12, 36, jo, R[0]); p.rect(hx - 14, hy + 12, 36, 2, K[0]); if (jo > 10) p.rect(hx - 8, hy + 16, 24, jo - 8, R[1]);
    for (let x = hx - 13; x < hx + 22; x += 5) { p.tri(x, hy + 12, x + 4, hy + 12, x + 2, hy + 19, B[2]); p.tri(x, hy + 12 + jo, x + 4, hy + 12 + jo, x + 2, hy + 5 + jo, B[2]); }
  });
};
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildMerek(); }; })();
P.ARENAS = P.ARENAS || {}; P.ARENAS.merek = P.BOSS_ARENA.slice();
P.MerekOrb = class extends P.NemMissile { draw(c, cx, cy) { P.Energy.plasma(c, Math.round(this.cx - cx), Math.round(this.cy - cy), 4, this.t, ['#a0101e', '#ff5a6a', '#ffffff']); } };

P.Merek = class extends P.Enemy {
  constructor(L, x, floorY) {
    super(L, 320, floorY - 70, 26, 70, { kind: null, hp: 3000, dmg: 14, xp: 1000, beast: false, cyber: true, spr: 'merek', heavy: true });
    this.FORM_HP = [2100, 2100, 2400]; this.maxhp = this.hp = this.FORM_HP[0]; this.sub = 1; this.boss = true; this.floorY = floorY; this.face = -1; this.state = 'intro'; this.st = 0; this.phase = 1; this.form = 'knight'; this.cd = 60; this.active = false;
    this.name = 'MEREK'; this.title = 'El Presidente'; this.glowCol = '#ff2a4a'; this.marks = []; this.beams = []; this.last = ''; this.frame = 0; this.gy = 0; this.fist = null; this.cxW = 240;
  }
  get spd() { return (1 + (this.phase - 1) * 0.12) * (1 + (this.sub - 1) * 0.08); }
  get intensity() { return this.sub; } // la música sube con cada subfase
  get vulnerable() { if (this.form === 'giant') return !!(this.fist && this.fist.planted); return true; }
  hit(d, o = {}) {
    if (this.dead || this.dying || !this.active || ['shift', 'ascend', 'collapse', 'roar', 'sub'].includes(this.state)) return;
    const L = this.L;
    if (this.form === 'giant') { if (!this.vulnerable) { if (this.t - (this.noT || -99) > 40) { this.noT = this.t; L.popups.push({ x: this.cxW, y: 80, text: 'SIN EFECTO', col: '#8a98b8', t: 0 }); } P.Audio.sfx('block'); return; } d *= 1.2; }
    else if (this.form === 'knight') { if (this.state === 'stagger') { d *= 1.5; o = Object.assign({}, o, { crit: true }); } else { d *= 0.5; this.auraHit = 8; } }
    else if (this.form === 'beast' && this.state === 'b_stun') { d *= 1.5; o = Object.assign({}, o, { crit: true }); }
    if (this.phase < 3 && d >= this.hp) d = Math.max(1, this.hp - 1); // las formas 1 y 2 no mueren: dan paso a la siguiente
    super.hit(d, Object.assign({}, o, { knock: 0 }));
    if (this.dying || this.dead || this.state === 'ascend' || this.state === 'collapse') return;
    if (this.phase < 3 && this.hp <= 1) { this.toPhase(this.phase + 1); return; }
    const f = this.hp / this.maxhp; if (this.sub === 1 && f < 2 / 3) this.toSub(2); else if (this.sub === 2 && f < 1 / 3) this.toSub(3);
  }
  toPhase(n) { this.phase = n; this.maxhp = this.hp = this.FORM_HP[n - 1]; this.sub = 1; this.refill = 0; this.ghost = null; this.dbl = 0; this.chain = 0; this.waves = []; this.st = 0; this.marks = []; this.beams = []; this.fist = null; P.Audio.sfx('roar'); P.shake(10, 50); const L = this.L;
    if (n === 2) { this.state = 'ascend'; L.popups.push({ x: this.cx, y: this.y - 24, text: '«¿CREES QUE ESTE CUERPO ES TODO LO QUE SOY?»', col: '#ff8a9a', t: 0, big: true }); P.Audio.stopMusic(); }
    else { this.state = 'collapse'; L.popups.push({ x: this.cxW, y: 60, text: '«¡NO VOLVERÁS A QUITÁRMELO!»', col: '#ff8a9a', t: 0, big: true }); P.Audio.stopMusic(); } }
  // subfase: Merek se detiene, concentra energía, estalla y vuelve con ataques nuevos
  toSub(n) {
    const L = this.L; this.sub = n; this.state = 'sub'; this.st = 0; this.marks = []; this.beams = []; this.waves = []; this.fist = null; this.dbl = 0; this.chain = 0; this.vx = 0;
    const LINES = [['«¿Eso es todo? Mi aura apenas ha temblado.»', '«Te enseñaré por qué gobierno las estrellas.»'], ['«Este trono es una máquina, y yo soy su corazón.»', '«¡Todo el reactor arderá contigo!»'], ['«No... necesito... ningún cuerpo...»', '«¡TE ARRANCARÉ DE MI ESFERA!»']];
    const G = this.form === 'giant'; L.popups.push({ x: G ? this.cxW : this.cx, y: G ? 70 : this.y - 24, text: LINES[this.phase - 1][n - 2], col: '#ff8a9a', t: 0, big: true });
    P.Audio.sfx('roar'); P.shake(6, 30);
  }
  die() { if (this.phase < 3 && !this.dying) { this.hp = 1; this.toPhase(this.phase + 1); return; } if (this.dying) return; this.dying = true; this.hp = 0; this.state = 'death'; this.st = 0; this.isEnemy = false; this.untouchable = true; this.marks = []; this.beams = []; this.fist = null; this.L.player.iframes = 600; for (const e of this.L.ents) if ((e.isEnemy && e !== this && !e.passive) || e instanceof P.MerekOrb) { if (e.die) e.die(); else e.dead = true; } P.Audio.sfx('roar'); P.Audio.stopMusic(); }
  pick() { const s = this.sub; let pool; // cada subfase añade ataques al repertorio
    if (this.form === 'knight') pool = ['combo', 'orbs', 'spikes', 'combo'].concat(s >= 2 ? ['blink', 'k_wave'] : [], s >= 3 ? ['k_rain', 'blink'] : []);
    else if (this.form === 'giant') pool = ['g_fist', 'g_eyes', 'g_cannon', 'g_fist'].concat(s >= 2 ? ['g_staff', 'g_double'] : [], s >= 3 ? ['g_quake', 'g_double'] : []);
    else pool = ['b_charge', 'b_pounce', 'b_swipe', 'b_charge'].concat(s >= 2 ? ['b_roar', 'b_tendrils'] : [], s >= 3 ? ['b_frenzy', 'b_tendrils'] : []);
    let a = P.pick(pool); if (a === this.last) a = P.pick(pool); this.last = a;
    if (a === 'g_double') { this.dbl = 1; a = 'g_fist'; } if (a === 'b_frenzy') { this.chain = 2; a = 'b_pounce'; }
    this.state = a; this.st = 0; this.vx = 0; }
  mark(x, at, o = {}) { const L = this.L; this.marks.push(Object.assign({ x: P.clamp(x, L.minX + 14, L.maxX - 14), t: 0, at, r: 16, dmg: 14, col: '#ff2a4a' }, o)); }
  update() {
    const L = this.L, p = L.player, fy = this.floorY, ph = this.phase, spd = this.spd; this.t++; this.st++; if (this.flash > 0) this.flash--; if (this.auraHit > 0) this.auraHit--;
    const toward = Math.sign(p.cx - this.cx) || 1, dist = Math.abs(p.cx - this.cx);
    switch (this.state) {
      case 'intro': break;
      case 'roar': this.face = toward; if (this.st === 20) { P.Audio.sfx('door'); L.popups.push({ x: this.cx, y: this.y - 20, text: '«ARRODÍLLATE ANTE TU PRESIDENTE»', col: '#ff8a9a', t: 0 }); } if (this.st === 70) { P.Audio.sfx('roar'); P.shake(8, 30); L.fx.push({ k: 'ring', x: this.cx, y: this.cy, t: 0, life: 40, r: 120, col: '#ff2a4a' }); } if (this.st > 110) { this.state = 'idle'; this.cd = 40; } break;
      // ---------- fase 1: caballero ----------
      case 'idle': this.face = toward; this.vx = toward * (dist > 70 ? 1.3 : 0) * spd; if (--this.cd <= 0) this.pick(); this.gravityMove(); break;
      case 'combo': { // tres golpes de báculo, cada uno avisado; al acabar queda aturdido
        this.gravityMove(); const k = Math.floor(this.st / 30), s = this.st % 30;
        if (k < (this.sub >= 3 ? 4 : 3)) { if (s === 1) { this.face = toward; this.vx = toward * 2.6; P.Audio.sfx('charge'); } if (s > 6) this.vx *= 0.8; if (s === 16) { P.Audio.sfx('dash'); L.parts.burst(this.cx + this.face * 26, this.cy, 8, { col: P.pick(['#ff2a4a', '#ffffff']), smin: 1, smax: 3, glow: 3 }); } if (s >= 16 && s < 22 && !p.dead && Math.abs(p.cx - (this.cx + this.face * 24)) < 26 && Math.abs(p.cy - this.cy) < 40) p.hurt(15, this.cx); }
        else { this.state = 'stagger'; this.st = 0; this.vx = 0; if (!L.mkTip) { L.mkTip = true; P.toast('¡MEREK ha bajado la guardia! Su aura no le protege ahora', { col: P.UIC.gold, life: 120 }); } } break; }
      case 'stagger': this.vx = 0; this.gravityMove(); if (this.st > 50) { this.state = 'idle'; this.cd = 30; } break;
      case 'orbs': this.face = toward; this.vx = 0; this.gravityMove(); if (this.st % 20 === 0 && this.st <= 20 * (2 + this.sub)) { L.add(new P.MerekOrb(L, this.cx + this.face * 20, this.y + 4, -Math.PI / 2 + this.face * 0.6)); P.Audio.sfx('spine'); } if (this.st > 60 + 20 * this.sub) { this.state = 'idle'; this.cd = 40; } break;
      case 'spikes': this.face = toward; this.vx = 0; this.gravityMove(); if (this.st === 10) { for (const dir of (this.sub >= 2 ? [this.face, -this.face] : [this.face])) for (let k = 1; k <= 9; k++) this.mark(this.cx + dir * k * 24, 26 + k * 6, { r: 11, dmg: 13, spike: true }); P.Audio.sfx('charge'); } if (this.st > 110) { this.state = 'idle'; this.cd = 30; } break;
      case 'blink': if (this.st === 1) { this.bx = P.clamp(p.cx - p.face * 50, L.minX + 30, L.maxX - 30); this.fade = 1; P.Audio.sfx('charge'); } if (this.st < 30) this.fade = 1 - this.st / 30; if (this.st === 30) { this.x = this.bx - this.w / 2; this.face = Math.sign(p.cx - this.bx) || 1; } if (this.st > 30) this.fade = Math.min(1, (this.st - 30) / 10); if (this.st === 44) { this.state = 'combo'; this.st = 14; } this.gravityMove(); break;
      case 'k_wave': { // golpe de báculo contra el suelo: dos ondas que hay que saltar (dos golpes en la subfase 3)
        this.vx = 0; this.gravityMove(); this.face = toward; const n = this.sub >= 3 ? 2 : 1, s = this.st % 40;
        if (this.st < n * 40) { if (s === 1) P.Audio.sfx('charge'); if (s < 26 && this.st % 3 === 0) L.parts.add({ x: this.cx + this.face * 26 + P.rand(-6, 6), y: this.y + P.rand(-6, 10), vy: -P.rand(0.5, 1.5), life: 18, col: P.pick(['#ff2a4a', '#ffd166']), size: 2, glow: 3 });
          if (s === 26) { P.Audio.sfx('bigexplode'); P.shake(8, 16); L.fx.push({ k: 'ring', x: this.cx, y: fy, t: 0, life: 22, r: 70, col: '#ff2a4a' }); L.parts.burst(this.cx, fy - 4, 14, { col: P.pick(['#ff2a4a', '#ffd166', '#36283a']), smin: 1, smax: 3.5, g: 0.2, size: 2 }); this.waves = (this.waves || []).concat([{ x: this.cx - 20, d: -1 }, { x: this.cx + 20, d: 1 }]); } }
        if (this.st > n * 40 + 30) { this.state = 'idle'; this.cd = 30; } break; }
      case 'k_rain': // lluvia de hojas carmesí sobre todo el salón, en orden salteado
        this.vx = 0; this.gravityMove(); this.face = toward;
        if (this.st === 10) { P.Audio.sfx('charge'); const n = 12; for (let k = 0; k < n; k++) this.mark(L.minX + 20 + (L.maxX - L.minX - 40) * ((k * 7) % n) / (n - 1), 40 + k * 7, { r: 12, dmg: 12, meteor: true }); }
        if (this.st > 150) { this.state = 'idle'; this.cd = 30; } break;
      case 'sub': { // transición de subfase
        this.vx = 0; const G = this.form === 'giant'; if (!G) this.gravityMove();
        const ox = G ? this.cxW : this.cx, oy = G ? this.floorY - 86 + this.gy : this.cy;
        if (this.st < 60 && this.st % 2 === 0) { const a = P.rand(0, 6.28), r = P.rand(50, 90); L.parts.add({ x: ox + Math.cos(a) * r, y: oy + Math.sin(a) * r, vx: -Math.cos(a) * r / 26, vy: -Math.sin(a) * r / 26, life: 26, col: P.pick(['#ff2a4a', '#ffd166', '#ffffff']), size: 2, glow: 3 }); }
        if (this.st === 60) { P.Audio.sfx('bigexplode'); P.shake(10, 30); P.GLFX.flashScreen('#ff5a6a', 0.45); P.GLFX.wave(ox - L.cam.x, oy - L.cam.y, 1.2); P.GLFX.pulseChroma(2); L.fx.push({ k: 'ring', x: ox, y: oy, t: 0, life: 34, r: 150, col: '#ffd166' }); }
        if (this.st > 85) { this.state = this.form === 'knight' ? 'idle' : G ? 'g_idle' : 'b_idle'; this.cd = 30; } break; }
      case 'ascend': // absorbe la energía del reactor del trono y crece detrás del escenario
        this.vx = 0; this.gravityMove(); if (this.st % 4 === 0) L.parts.add({ x: this.cx + P.rand(-40, 40), y: this.cy + P.rand(-60, 20), vx: (this.cx - (this.cx + P.rand(-40, 40))) * 0.02, vy: -P.rand(1, 2), life: 30, col: P.pick(['#ff2a4a', '#ffd166', '#ffffff']), size: 2, glow: 3 });
        if (this.st === 90) { P.Audio.sfx('bigexplode'); P.shake(14, 60); P.GLFX.flashScreen('#ff5a6a', 0.7); P.GLFX.wave(this.cx - L.cam.x, this.cy - L.cam.y, 1.6); this.form = 'giant'; this.gy = 140; P.Audio.music('merek_2'); }
        if (this.form === 'giant') this.gy = Math.max(0, this.gy - 3); if (this.st > 150) { this.state = 'g_idle'; this.cd = 40; } break;
      // ---------- fase 2: gigante ----------
      case 'g_idle': if (--this.cd <= 0) this.pick(); break;
      case 'g_fist': { // la sombra marca el sitio, el puño cae, se queda apoyado (vulnerable) y vuelve
        if (this.st === 1) { this.fist = { x: P.clamp(p.cx, L.minX + 40, L.maxX - 40), y: -60, planted: false, side: p.cx < this.cxW ? -1 : 1 }; P.Audio.sfx('charge'); }
        const F = this.fist, warn = 50 / spd; if (this.st < warn) { F.y = -60; F.x += (P.clamp(p.cx, L.minX + 40, L.maxX - 40) - F.x) * 0.05; }
        else if (!F.planted) { F.y += 22; if (F.y >= fy - 46) { F.y = fy - 46; F.planted = true; F.pt = 0; P.Audio.sfx('bigexplode'); P.shake(12, 26); L.fx.push({ k: 'ring', x: F.x, y: fy, t: 0, life: 26, r: 90, col: '#ff2a4a' }); if (!p.dead && Math.abs(p.cx - F.x) < 34 && p.y + p.h > fy - 50) p.hurt(20, F.x); this.waves = [{ x: F.x - 34, d: -1 }, { x: F.x + 34, d: 1 }]; if (!L.mfTip) { L.mfTip = true; P.toast('¡Su puño está en el suelo! Atácalo', { col: P.UIC.gold, life: 120 }); } } }
        else { F.pt++; if (F.pt > [0, 130, 115, 100][this.sub]) { F.planted = false; F.y -= 8; if (F.y < -60) { this.fist = null; if (this.dbl) { this.dbl = 0; this.st = 0; } else { this.state = 'g_idle'; this.cd = 40 / spd; } } } } break; }
      case 'g_eyes': // dos haces de los ojos barren el suelo, avisados con una línea
        if (this.st === 1) { this.beams = [{ x: L.minX + 10, d: 1 }, { x: L.maxX - 10, d: -1 }].concat(this.sub >= 3 ? [{ x: this.cxW - 4, d: -1, s: 0.6 }, { x: this.cxW + 4, d: 1, s: 0.6 }] : []); P.Audio.sfx('charge'); }
        if (this.st > 50) for (const b of this.beams) { b.x += b.d * 3.4 * spd * (b.s || 1); if (!p.dead && Math.abs(p.cx - b.x) < 8 && p.y + p.h > fy - 30) p.hurt(14, b.x, { env: true }); }
        if (this.st > 50 + 140 / spd) { this.beams = []; this.state = 'g_idle'; this.cd = 30; } break;
      case 'g_cannon': if (this.st === 1) { const n = 6 + (this.sub - 1) * 2; for (let k = 0; k < n; k++) this.mark(p.cx + (k - (n - 1) / 2) * 40 + P.rand(-8, 8), 60 + k * 8, { r: 16, dmg: 14 }); P.Audio.sfx('explode'); } if (this.st > 130) { this.state = 'g_idle'; this.cd = 30; } break;
      case 'g_staff': if (this.st === 1) { for (let k = 0; k < 8; k++) this.mark(P.rand(L.minX + 20, L.maxX - 20), 50 + k * 10, { r: 14, dmg: 12, meteor: true }); P.Audio.sfx('charge'); } if (this.st > 150) { this.state = 'g_idle'; this.cd = 30; } break;
      case 'g_quake': // golpea el suelo fuera de cámara: cascotes del techo y ondas desde las dos paredes
        if (this.st === 1) P.Audio.sfx('charge');
        if (this.st === 30) { P.Audio.sfx('bigexplode'); P.shake(14, 40); this.waves = [{ x: L.minX + 6, d: 1 }, { x: L.maxX - 6, d: -1 }]; for (let k = 0; k < 10; k++) this.mark(P.rand(L.minX + 20, L.maxX - 20), 40 + k * 9, { r: 13, dmg: 12, meteor: true }); }
        if (this.st > 170) { this.state = 'g_idle'; this.cd = 30; } break;
      case 'collapse': // el gigante se agrieta y una bestia sale de él
        if (this.st % 6 === 0) { P.Audio.sfx('explode'); L.parts.burst(this.cxW + P.rand(-120, 120), P.rand(40, 200), 10, { col: P.pick(['#ff2a4a', '#ffd166', '#ffffff', '#36283a']), smin: 1, smax: 4, glow: 3 }); }
        if (this.st === 100) { P.Audio.sfx('bigexplode'); P.shake(16, 60); P.GLFX.flashScreen('#ffffff', 0.8); this.form = 'beast'; this.vx = 0; this.x = this.cxW - 58; this.y = fy - 110; this.w = 116; this.h = 100; this.vy = -6; this.spr = 'merek_beast'; P.Audio.music('merek_3'); }
        if (this.form === 'beast') this.gravityMove(); if (this.st > 150) { this.state = 'b_idle'; this.cd = 30; } break;
      // ---------- fase 3: mutación ----------
      // la bestia se mueve al doble de velocidad que el caballero de la fase 1 (1,3)
      case 'b_idle': this.face = toward; this.vx = toward * 2.6 * (1 + (this.sub - 1) * 0.08); if ((this.cd -= 1.5) <= 0) this.pick(); this.gravityMove(); break;
      case 'b_charge': if (this.st === 1) { this.face = toward; this.cdir = toward; P.Audio.sfx('roar'); } if (this.st < 20) { this.vx = 0; this.gravityMove(); break; } this.vx = this.cdir * 9; this.gravityMove(); if (this.hitWall || this.x < L.minX + 4 || this.x + this.w > L.maxX - 4) { this.vx = 0; this.state = 'b_stun'; this.st = 0; P.shake(10, 20); P.Audio.sfx('bigexplode'); for (let k = 0; k < 4; k++) this.mark(P.rand(L.minX + 20, L.maxX - 20), 50 + k * 10, { r: 12, dmg: 10, meteor: true }); } break;
      case 'b_stun': this.vx = 0; this.gravityMove(); if (this.st > 55) { this.state = 'b_idle'; this.cd = 20; } break;
      case 'b_pounce': if (this.st === 1) { this.vy = -8; this.ptx = P.clamp(p.cx, L.minX + 40, L.maxX - 40); this.onGround = false; P.Audio.sfx('dash'); } this.x += (this.ptx - this.cx) * 0.07; this.vy = Math.min(this.vy + 0.32, 9); this.y += this.vy; if (this.y + this.h >= fy && this.st > 8) { this.y = fy - this.h; this.vy = 0; P.Audio.sfx('bigexplode'); P.shake(9, 18); L.fx.push({ k: 'ring', x: this.cx, y: fy, t: 0, life: 22, r: 70, col: '#ff2a4a' }); if (!p.dead && Math.abs(p.cx - this.cx) < 76 && p.y + p.h > fy - 40) p.hurt(17, this.cx); if (this.chain > 0) { this.chain--; this.state = 'b_pounce'; this.st = 0; } else { this.state = 'b_idle'; this.cd = 26; } } break;
      case 'b_roar': this.vx = 0; this.gravityMove(); if (this.st === 20) { P.Audio.sfx('roar'); P.shake(12, 40); L.fx.push({ k: 'ring', x: this.cx, y: this.cy, t: 0, life: 30, r: 160, col: '#ff2a4a' }); if (!p.dead && Math.abs(p.cx - this.cx) < 130 && p.onGround) p.hurt(10, this.cx); for (let k = 0; k < 6; k++) this.mark(P.rand(L.minX + 20, L.maxX - 20), 40 + k * 8, { r: 12, dmg: 11, meteor: true }); } if (this.st > 70) { this.state = 'b_idle'; this.cd = 30; } break;
      case 'b_tendrils': this.vx = 0; this.gravityMove(); if (this.st === 10) { const n = this.sub >= 3 ? 7 : 5; for (let k = 0; k < n; k++) this.mark(p.cx + (k - (n - 1) / 2) * 50, 40 + k * 4, { r: 14, dmg: 13, dark: true }); P.Audio.sfx('charge'); } if (this.st > 90) { this.state = 'b_idle'; this.cd = 20; } break;
      case 'b_swipe': { this.gravityMove(); const s = this.st % 20, k = Math.floor(this.st / 20); if (k < 2) { if (s === 1) { this.face = toward; this.vx = toward * 4; } this.vx *= 0.9; if (s === 9) P.Audio.sfx('dash'); if (s >= 9 && s < 14 && !p.dead && Math.abs(p.cx - (this.cx + this.face * 70)) < 46 && Math.abs(p.cy - this.cy) < 64) p.hurt(14, this.cx); } else { this.state = 'b_idle'; this.cd = 24; } break; }
      case 'death':
        this.vx = 0; if (this.form === 'beast' || this.form === 'knight') this.gravityMove(); if (this.st % 6 === 0) { P.Audio.sfx('explode'); L.parts.burst(this.cx + P.rand(-30, 30), this.cy + P.rand(-30, 20), 10, { col: P.pick(['#ff2a4a', '#ffd166', '#ffffff', '#36283a']), smin: 1, smax: 4, glow: 3 }); }
        if (this.st === 120 && this.form === 'beast') { this.form = 'knight'; this.spr = 'merek'; this.w = 26; this.h = 70; this.y = fy - 70; this.x = this.cx - 13; }
        if (this.st === 200) { P.Audio.sfx('bigexplode'); P.shake(14, 50); P.GLFX.flashScreen('#ffffff', 0.9); L.fx.push({ k: 'ring', x: this.cx, y: this.cy, t: 0, life: 50, r: 200, col: '#ffd166' }); this.dead = true; L.onBossDefeated(this); } break;
    }
    // amenazas marcadas: pinchos, proyectiles, meteoros y zarcillos de energía oscura
    for (const m of this.marks) { m.t++; if (m.t === Math.round(m.at)) { P.Audio.sfx('explode'); L.parts.burst(m.x, fy - 4, 10, { col: m.dark ? P.pick(['#7a3aff', '#140820', '#c08aff']) : P.pick(['#ff2a4a', '#ffd166', '#ffffff']), smin: 1, smax: 3.5, g: 0.15, size: 2, glow: 3 }); if (!p.dead && Math.abs(p.cx - m.x) < m.r && p.y + p.h > fy - (m.spike || m.dark ? 34 : 60)) p.hurt(m.dmg, m.x, { env: true }); } }
    this.marks = this.marks.filter(m => m.t < m.at + 18);
    if (this.waves) { for (const w of this.waves) { w.x += w.d * 3.6; if (!p.dead && Math.abs(p.cx - w.x) < 9 && p.y + p.h > fy - 16) p.hurt(12, w.x); } this.waves = this.waves.filter(w => w.x > L.minX - 10 && w.x < L.maxX + 10); }
    // colisión según la forma
    if (this.form === 'giant') { const F = this.fist; if (F && F.planted) { this.x = F.x - 30; this.y = F.y; this.w = 60; this.h = 46; } else { this.x = this.cxW - 20; this.y = 40; this.w = 40; this.h = 40; } }
    else { if (this.x < L.minX + 2) this.x = L.minX + 2; if (this.x + this.w > L.maxX - 2) this.x = L.maxX - 2 - this.w; const hb = this.form === 'beast' ? { x: this.face > 0 ? this.x + this.w * 0.4 : this.x, y: this.y, w: this.w * 0.6, h: this.h } : this; // la bestia solo hiere con la cabeza y las garras delanteras
    if (this.active && !this.dying && !p.dead && P.overlap(hb, p) && !['stagger', 'b_stun', 'ascend', 'collapse', 'sub'].includes(this.state)) p.hurt(this.form === 'beast' ? 14 : 10, this.cx); }
    this.frame = this.form === 'beast' ? (this.state === 'b_stun' || this.state === 'death' ? 5 : this.state === 'b_pounce' ? 3 : this.state === 'b_roar' ? 4 : Math.abs(this.vx) > 0.3 ? 1 + ((this.t >> 2) % 2) : 0)
      : (this.state === 'death' || this.state === 'stagger' ? 7 : this.state === 'combo' ? ((this.st % 30) < 16 ? 4 : 5) : this.state === 'k_wave' ? ((this.st % 40) < 26 ? 6 : 5) : this.state === 'orbs' || this.state === 'spikes' || this.state === 'ascend' || this.state === 'k_rain' || this.state === 'sub' ? 6 : Math.abs(this.vx) > 0.2 ? 2 + ((this.t >> 3) % 2) : (this.t >> 5) % 2);
  }
  // el gigante, detrás de las casillas
  drawBack(c, cx, cy) {
    if (this.dead || this.form !== 'giant' && this.state !== 'collapse') return; const t = this.t, X = Math.round(this.cxW - 160 - cx), Y = Math.round(this.floorY - 236 + this.gy + Math.sin(t * 0.02) * 2 - cy);
    if (this.state === 'collapse') { c.globalAlpha = Math.max(0, 1 - this.st / 100); } P.drawGlow(c, X + 160, Y + 150, 150, '#ff2a4a', 0.15);
    c.drawImage(P.S.merek_giant.f[0], X, Y); const k = (Math.sin(t * 0.06) + 1) / 2;
    P.Energy.reactor(c, X + 160, Y + 150, 10 + k * 4, t, this.fist && this.fist.planted ? '#ffd166' : '#ff2a4a');
    for (const ex of [146, 174]) { P.drawGlow(c, X + ex, Y + 54, 12 + (this.state === 'g_eyes' ? 10 : 0), '#ff2a4a', 0.8); c.fillStyle = '#ffffff'; c.fillRect(X + ex - 1, Y + 53, 2, 2); }
    for (const sd of [-1, 1]) if (this.state === 'g_cannon' && this.st < 40) P.drawGlow(c, X + 160 + sd * 78, Y + 52, 14, '#ffd166', 0.8);
    if (this.state === 'collapse') for (let i = 0; i < 6; i++) P.Energy.arc(c, X + 100 + i * 24, Y + 90, X + 110 + i * 22, Y + 220, t + i, '#ff8a9a', 1, 6);
    if (!(this.fist && this.fist.planted) && !(this.fist && this.state === 'g_fist')) for (const sd of [-1, 1]) c.drawImage(P.S.merek_fist.f[0], Math.round(X + 160 + sd * 132 - 32), Y + 196);
    c.globalAlpha = 1;
  }
  draw(c, cx, cy) {
    if (this.dead) return; const L = this.L, fy = this.floorY, t = this.t;
    for (const m of this.marks) if (m.t < m.at) { const k = m.t / m.at; c.globalAlpha = 0.35 + k * 0.5; if (m.dark) { c.fillStyle = '#7a3aff'; c.fillRect(Math.round(m.x - m.r - cx), Math.round(fy - 2 - cy), m.r * 2, 2); } else { c.strokeStyle = m.spike ? '#ff8a9a' : '#ffd166'; c.beginPath(); c.ellipse(Math.round(m.x - cx), Math.round(fy - 2 - cy), m.r - k * 6, 3, 0, 0, 6.3); c.stroke(); } if (m.meteor) { c.fillStyle = '#ff5a6a'; c.fillRect(Math.round(m.x - cx), Math.round(fy - cy - (1 - k) * 220), 3, 5); P.drawGlow(c, m.x - cx, fy - cy - (1 - k) * 220, 8, '#ff2a4a', 0.6); } c.globalAlpha = 1; }
      else if (m.t < m.at + 14) { if (m.spike) { c.fillStyle = '#ff2a4a'; for (let k2 = -1; k2 <= 1; k2++) { c.beginPath(); c.moveTo(m.x - cx + k2 * 6 - 3, fy - cy); c.lineTo(m.x - cx + k2 * 6 + 3, fy - cy); c.lineTo(m.x - cx + k2 * 6, fy - cy - 18 - (k2 ? 0 : 8)); c.fill(); } } else if (m.dark) P.Energy.dark(c, m.x - cx, fy - cy, 28, t); else P.drawGlow(c, m.x - cx, fy - 10 - cy, 30, '#ffd166', 0.8); }
    for (const b of this.beams) if (this.st < 50) { c.globalAlpha = 0.3 + ((this.st >> 2) % 2) * 0.3; c.fillStyle = '#ff2a4a'; c.fillRect(Math.round(b.x - cx), 0, 1, P.H); c.globalAlpha = 1; } else P.Energy.laser(c, this.cxW - cx + (b.d > 0 ? -14 : 14), this.floorY - 236 + 54 + this.gy - cy, b.x - cx, fy - cy, t, '#ff2a4a', 4);
    if (this.waves) for (const w of this.waves) { const wx = Math.round(w.x - cx), wy = Math.round(fy - cy); c.fillStyle = '#ffffff'; for (let k = 0; k < 7; k++) c.fillRect(wx - w.d * k * 2, wy - 14 + k * 2, 2, 2); P.drawGlow(c, wx, wy - 6, 12, '#ff2a4a', 0.5); }
    if (this.form === 'giant') { const F = this.fist; if (F) { if (!F.planted && F.y < 0) { c.globalAlpha = 0.3 + ((t >> 2) % 2) * 0.2; c.fillStyle = '#000'; c.beginPath(); c.ellipse(Math.round(F.x - cx), Math.round(fy - 1 - cy), 30, 4, 0, 0, 6.3); c.fill(); c.globalAlpha = 1; } c.drawImage(P.S.merek_fist.f[F.planted ? 1 : 0], Math.round(F.x - 32 - cx), Math.round(F.y - cy)); if (F.planted) { const k = (Math.sin(t * 0.2) + 1) / 2; P.drawGlow(c, F.x - cx, F.y + 24 - cy, 34, '#ffd166', 0.3 + k * 0.3); if (t % 20 < 12) P.txt(c, '▼', F.x - cx - 3, F.y - 12 - cy, '#ffd166', { outline: true }); } } return; }
    if (this.state === 'collapse' && this.form === 'giant') return;
    const s = P.S[this.spr], x = Math.round(this.cx - s.w / 2 - cx), y = Math.round(this.y + this.h - s.h - cy);
    if (this.state === 'stagger' || this.state === 'b_stun') P.drawGlow(c, x + s.w / 2, y + s.h / 2, 34, '#ffd166', 0.45 + ((t >> 2) % 2) * 0.2);
    c.globalAlpha = this.fade != null && this.state === 'blink' ? Math.max(0.05, this.fade) : 1;
    P.AnimFX.boss(c, this, this.spr, this.frame, x, y, { flip: this.face < 0, flash: this.flash > 0 }, cx, cy, { dis: [130, 200], trail: ['blink', 'combo', 'b_charge', 'b_pounce', 'b_swipe'] }); c.globalAlpha = 1;
    if (this.form === 'knight') { const orb = [x + (this.face > 0 ? 52 : 12), y + 10]; P.drawGlow(c, orb[0], orb[1], 12 + Math.sin(t * 0.1) * 3, '#ff2a4a', 0.6); if (this.state !== 'stagger' && !this.dying) P.Energy.shield(c, x + s.w / 2, y + s.h / 2, 30, t, '#ff2a4a', this.auraHit > 0 ? 1 : 0); for (const ex of [28, 35]) P.drawGlow(c, x + (this.face > 0 ? ex : s.w - ex), y + 15, 4, '#ff2a4a', 0.8); }
    if (this.form === 'beast') { P.drawGlow(c, x + s.w / 2 + this.face * 4, y + 84, 30, '#ff2a4a', 0.5); if (!this.dying) P.Energy.dark(c, x + (this.face > 0 ? 24 : s.w - 24), y + 74, 24, t); }
  }
  // barra de vida final: tres segmentos con el nombre de cada forma
  drawBar(c) {
    const w = 340, x0 = (P.W - w) / 2, y0 = P.H - 18, t = this.t;
    c.fillStyle = 'rgba(8,2,6,0.75)'; c.fillRect(x0 - 8, y0 - 16, w + 16, 28); c.fillStyle = '#c0962a'; for (const [x, d] of [[x0 - 8, 1], [x0 + w + 7, -1]]) { c.fillRect(x, y0 - 16, 1, 28); c.fillRect(x, y0 - 16, 6 * d, 1); c.fillRect(x, y0 + 11, 6 * d, 1); }
    P.drawGlow(c, P.W / 2, y0 - 10, 40, '#ff2a4a', 0.25 + Math.sin(t * 0.05) * 0.1);
    P.txt(c, this.name, P.W / 2, y0 - 13, '#ffffff', { align: 'center', outline: true, shadow: '#3a0a10' }); P.txt(c, ['', 'EL PRESIDENTE', 'EL COLOSO', 'LA BESTIA'][this.phase], x0 + w, y0 - 13, '#ff8a9a', { align: 'right' }); const lab = 'FASE ' + ['I', 'II', 'III'][this.phase - 1] + ' · ' + this.sub + '/3'; P.txt(c, lab, x0, y0 - 13, '#ffd166');
    for (let i = 0; i < 3; i++) { const px = x0 + P.txtW(lab) + 8 + i * 8, on = i >= this.phase - 1; c.fillStyle = on ? (i === this.phase - 1 ? ((t >> 4) % 2 ? '#ffffff' : '#ff2a4a') : '#ff2a4a') : '#3a1a20'; c.fillRect(px, y0 - 11, 4, 4); c.fillRect(px + 1, y0 - 12, 2, 6); }
    this.refill = Math.min(1, (this.refill == null ? 1 : this.refill) + 0.012); const hp = this.hp * this.refill;
    this.ghost = this.ghost == null || hp > this.ghost ? hp : P.approach(this.ghost, hp, this.maxhp * 0.004);
    c.fillStyle = '#0a0406'; c.fillRect(x0, y0, w, 7); c.fillStyle = '#ffffff'; c.fillRect(x0, y0, Math.round(w * this.ghost / this.maxhp), 7);
    const GC = [['#6a0a1a', '#ff2a4a'], ['#7a3a08', '#ffb02a'], ['#3a0a4a', '#d02aff']][this.phase - 1], g = c.createLinearGradient(x0, 0, x0 + w, 0); g.addColorStop(0, GC[0]); g.addColorStop(1, GC[1]); c.fillStyle = g; c.fillRect(x0, y0, Math.round(w * hp / this.maxhp), 7);
    if (this.refill < 1) { c.fillStyle = '#ffffff'; c.fillRect(x0 + Math.round(w * hp / this.maxhp) - 2, y0, 2, 7); }
    for (const f of [2 / 3, 1 / 3]) { c.fillStyle = '#ffd166'; c.fillRect(Math.round(x0 + w * f), y0 - 2, 1, 11); } c.strokeStyle = '#ff8a9a'; c.strokeRect(x0 - 0.5, y0 - 0.5, w + 1, 8);
  }
};
P.BOSS_CLASS = P.BOSS_CLASS || {}; P.BOSS_CLASS.merek = P.Merek;
