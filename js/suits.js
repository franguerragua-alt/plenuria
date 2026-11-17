'use strict';
// Trajes con diseño propio. Cada armadura conserva EXACTAMENTE su paleta (d, m, l, h, j, e, eg, acc, w) y solo cambia
// su forma: casco, visor, mochila, hombreras, botas, emblema y accesorios. Mismos tamaños, poses y fotogramas.
//   k      Armadura de Combate K  · casco redondo de serie, visor oval y mochila compacta (inicial, sencilla)
//   selva  Armadura Selvática     · casco de explorador con frondas, visor en flecha, mochila con petate y machete
//   solar  Armadura Solar         · casco alto con aleta, visor panorámico, alas de panel solar y núcleo
//   duna   Armadura de Duna       · turbante sobre el casco, gafas redondas, respirador, bufanda al viento, hombreras por capas
//   hielo  Armadura Glaciar       · casco facetado, visor en rombo, cristales en la nuca, calefactor y crampones
//   abismo Armadura Abisal        · escafandra con portilla de latón, linterna-señuelo, collarín y dos botellas de aire
P.SUIT_STYLE = { rojo: 'k', selvatica: 'selva', solar: 'solar', duna: 'duna', glaciar: 'hielo', abisal: 'abismo' };
(function () {
  const G = { g0: '#1e2232', g1: '#3a4258', g2: '#7a86a4', g3: '#c8d4ec', g4: '#ffffff' }, VD = '#0a0a1c', VM = '#14143a', RF = '#6a7ad0';
  const style = c => (c && c.sid && P.SUIT_STYLE[c.sid]) || 'k';
  // polígono convexo relleno (abanico de triángulos desde el primer vértice)
  const poly = (p, pts, col) => { for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0][0], pts[0][1], pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], col); };

  // ---------------- vista lateral (24x28) ----------------
  P.Sprites.hero = function (p, o, c) {
    const S = style(c), L = o.lean || 0, b = (o.b || 0) + (o.crouch ? 6 : 0), hipY = 19 + b, FY = 27, C4 = [c.d, c.m, c.l, c.h];
    const X = v => v + L, Y = v => v + b;
    const eye = o.hurt ? '#ff5a5a' : c.e, eg = o.hurt ? '#b02020' : c.eg;
    const leg = (hx, fx, fy, back) => {
      const col = back ? c.d : c.m, hi = back ? c.m : c.l;
      let kx = (hx + fx) / 2 + 1.5, ky = (hipY + fy) / 2;
      if (o.crouch) { kx = hx + 5; ky = hipY + 1; }
      p.thick(hx, hipY, kx, ky, 4, col); p.thick(kx, ky, fx, fy - 2, 3.5, col);
      p.rect(Math.round(kx) - 1, Math.round(ky) - 1, 2, 2, hi); if (!back) p.px(Math.round(kx) - 1, Math.round(ky) - 1, c.h);
      const bx = Math.round(fx);
      if (S === 'abismo') { p.rect(bx - 2, fy - 3, 6, 4, back ? G.g0 : G.g1); p.rect(bx - 1, fy - 3, 4, 1, G.g2); p.px(bx + 3, fy - 1, G.g3); return; } // botas lastradas
      p.rect(bx - 2, fy - 2, 6, 3, back ? c.j : c.d); p.rect(bx - 1, fy - 2, 4, 1, hi); p.px(bx + 3, fy, c.j);
      if (S === 'hielo') { p.px(bx - 2, fy, c.h); p.px(bx, fy, c.h); p.px(bx + 2, fy, c.h); } // crampones
      else if (S === 'duna') { p.rect(bx - 1, fy - 4, 3, 1, back ? c.l : c.h); p.px(bx - 1, fy - 3, back ? c.m : c.l); } // vendas
      else if (S === 'solar') { p.px(bx + 3, fy - 1, c.acc); p.px(bx - 2, fy - 1, c.l); }
      else if (S === 'selva') { p.px(bx, fy - 3, c.h); p.px(bx + 1, fy - 4, c.h); } // cordones de bota alta
      else if (S === 'umbra') { p.px(bx + 3, fy - 2, c.l); p.px(bx + 4, fy - 1, c.l); } // punteras de cristal
      else if (S === 'storm') { p.px(bx - 1, fy - 2, c.acc); p.px(bx + 2, fy - 3, c.l); } // botas con aletas
      else if (S === 'volcano') { p.px(bx - 1, fy - 2, c.l); p.px(bx + 2, fy - 3, c.h); } // botas con grietas de lava
      else if (S === 'hive') { p.px(bx + 3, fy - 1, c.acc); p.px(bx - 2, fy - 2, c.l); } // espuelas de quitina
      else if (S === 'fungi') { p.px(bx + 4, fy, c.l); p.px(bx - 3, fy, c.d); p.px(bx + 1, fy - 3, c.acc); } // raíces en las botas
    };
    if (o.dead) {
      p.rect(3, 22, 14, 5, c.m); p.rect(3, 22, 14, 1, c.l); p.rect(4, 25, 12, 2, c.d); p.px(9, 23, c.acc);
      if (S === 'abismo') { p.sell(19, 22, 5.6, 5, C4); p.ell(20, 23, 3.4, 2.8, c.acc); p.ell(20, 23, 2.4, 1.9, VD); p.rect(1, 25, 9, 2, G.g2); p.rect(4, 20, 3, 2, c.l); return; }
      if (S === 'hielo') { poly(p, [[14, 22], [18, 17], [23, 19], [23, 25], [17, 27]], c.m); p.tri(14, 22, 18, 17, 20, 20, c.l); p.tri(19, 22, 23, 21, 21, 25, VD); }
      else p.sell(19, 22, 5, 4.6, C4);
      if (S === 'solar') p.rect(18, 21, 5, 3, VD); else if (S === 'duna') { p.ell(19, 22, 1.4, 1.4, VD); p.ell(22, 22, 1.4, 1.4, VD); p.thick(14, 20, 8, 19, 2, c.h); }
      else if (S === 'selva') { p.tri(18, 21, 23, 22, 19, 25, VD); p.line(15, 18, 9, 17, c.l); }
      else if (S === 'k') { p.ell(20, 23, 3, 2.2, VD); p.px(19, 22, '#3a4680'); }
      else if (S === 'umbra') { p.rect(17, 22, 6, 1, c.eg); p.thick(14, 21, 4, 21, 3, c.d); }
      else if (S === 'fungi') { for (let yy = 0; yy < 4; yy++) { const ww = 7 * Math.sqrt(1 - (yy / 4) ** 2); p.rect(Math.round(19 - ww), Math.round(20 - yy), Math.round(ww * 2), 1, yy < 1 ? c.d : yy > 4 - 2 ? c.l : c.m); } p.px(17, 17, c.h); p.px(21, 18, c.h); }
      p.rect(1, 25, 9, 2, G.g2); p.px(9, 25, G.g3); return;
    }
    leg(10 + L, 10 + L + o.fB[0], FY - o.fB[1], true);
    // ---- mochila / equipo dorsal ----
    if (S === 'k') { p.rect(X(4), Y(12), 4, 8, c.d); p.rect(X(5), Y(13), 2, 5, G.g1); p.px(X(5), Y(13), G.g2); p.rect(X(4), Y(20), 3, 2, G.g1); p.px(X(5), Y(22), '#ff9a3a'); }
    else if (S === 'selva') {
      p.rect(X(2), Y(12), 6, 9, c.d); p.rect(X(2), Y(12), 6, 1, c.m); p.rect(X(2), Y(15), 6, 1, c.j); p.rect(X(3), Y(17), 3, 3, c.m); p.px(X(4), Y(18), c.acc);
      p.sell(X(5), Y(11), 3.6, 1.7, [c.d, c.m, c.l]); p.px(X(3), Y(10), c.h); p.px(X(6), Y(10), c.h); // petate enrollado
      p.thick(X(3), Y(19), X(1), Y(25), 1, G.g2); p.px(X(1), Y(25), G.g3); p.px(X(3), Y(19), c.j); // machete sujeto
    } else if (S === 'solar') {
      p.thick(X(6), Y(13), X(1), Y(7), 2.4, G.g1); p.line(X(5), Y(12), X(2), Y(8), c.l); p.px(X(3), Y(9), c.h); p.px(X(1), Y(7), c.acc); // ala superior
      p.thick(X(6), Y(17), X(1), Y(15), 2.2, G.g1); p.line(X(5), Y(17), X(2), Y(15), c.l); // ala inferior
      p.rect(X(5), Y(12), 3, 9, c.d); p.rect(X(5), Y(13), 2, 6, G.g1); p.ell(X(6), Y(15), 1.3, 1.3, c.eg); p.px(X(6), Y(15), c.w); // núcleo solar
      p.rect(X(5), Y(21), 2, 1, G.g1); p.px(X(5), Y(22), c.eg);
    } else if (S === 'duna') {
      p.rect(X(3), Y(13), 5, 7, c.d); p.rect(X(3), Y(15), 5, 1, c.h); p.px(X(4), Y(17), c.acc);
      p.sell(X(5), Y(12), 3.4, 1.6, [G.g1, G.g2, G.g3]); p.px(X(2), Y(12), G.g1); // depósito de agua
      p.sell(X(5), Y(20.5), 3, 1.3, [c.l, c.h, c.w]); // manta enrollada
    } else if (S === 'hielo') {
      p.rect(X(3), Y(12), 4, 9, G.g1); p.rect(X(3), Y(12), 4, 1, c.l); p.rect(X(3), Y(20), 4, 1, c.l); p.rect(X(4), Y(14), 2, 5, c.eg); p.px(X(4), Y(15), c.w); // calefactor
      p.tri(X(3), Y(12), X(5), Y(12), X(2), Y(8), c.h); p.line(X(4), Y(11), X(3), Y(9), c.w); // cristal que crece en la mochila
    } else if (S === 'storm') {
      p.rect(X(4), Y(11), 4, 9, c.d); p.rect(X(5), Y(13), 2, 5, c.m); p.ell(X(5), Y(9), 2.6, 2.6, c.l); p.px(X(5), Y(9), c.h); p.line(X(2), Y(7), X(8), Y(11), c.h); // rotor de viento dorsal
    } else if (S === 'volcano') {
      p.rect(X(4), Y(12), 4, 9, c.d); p.rect(X(5), Y(14), 2, 5, c.l); p.px(X(5), Y(15), c.h); p.rect(X(4), Y(9), 2, 4, c.m); p.px(X(4), Y(8), '#4a4442'); p.px(X(5), Y(7), '#3a3230'); // fragua dorsal con chimenea
    } else if (S === 'hive') {
      for (const [x0, y0] of [[4, 13], [7, 15], [4, 18], [7, 20]]) P.Sprites.xeHex(p, X(x0), Y(y0), 2.2, c.m, c.d, null); p.px(X(5), Y(16), c.h); // mochila de panal
      p.tri(X(8), Y(12), X(1), Y(9), X(4), Y(16), c.l); p.line(X(8), Y(12), X(2), Y(10), c.h); // placa-ala translúcida
    } else if (S === 'fungi') {
      p.sell(X(5), Y(16), 3.6, 5, [c.d, c.m, c.l]); for (let k = 0; k < 4; k++) p.px(X(4 + (k % 2) * 2), Y(13 + k * 2), c.h); // saco de esporas
      for (const [x0, y0, w] of [[4, 11, 2], [7, 12, 1.6]]) { p.px(X(x0), Y(y0) + 1, c.w); for (let yy = 0; yy < 2; yy++) { const ww = w * Math.sqrt(1 - (yy / 2) ** 2); p.rect(Math.round(X(x0) - ww), Math.round(Y(y0) - yy), Math.round(ww * 2), 1, yy < 1 ? c.d : yy > 2 - 2 ? c.l : c.m); } }
    } else if (S === 'umbra') {
      const hem = Y(24) - Math.max(0, L); p.tri(X(10), Y(11), X(1) - L, hem, X(10), Y(22), c.d); p.line(X(9), Y(11), X(1) - L, hem, c.l); for (let k = 0; k < 4; k++) p.px(X(2 + k * 2) - L, hem - 1 - (k % 2), c.j); p.px(X(4) - L, hem - 4, c.m); // capa raída con forro carmesí
    } else if (S === 'abismo') {
      p.rect(X(1), Y(12), 3, 10, c.m); p.rect(X(1), Y(12), 1, 10, c.d); p.px(X(2), Y(11), c.l); p.px(X(2), Y(13), c.h); // botella 1
      p.rect(X(4), Y(12), 3, 10, c.l); p.rect(X(4), Y(12), 1, 10, c.m); p.px(X(5), Y(11), c.h); p.px(X(5), Y(13), c.w); // botella 2
      p.rect(X(1), Y(15), 6, 1, c.acc); p.px(X(3), Y(10), G.g3);
      p.line(X(3), Y(10), X(5), Y(8), G.g1); p.px(X(6), Y(8), G.g1); // manguera al casco
    }
    // torso
    p.sell(12.5 + L, 16 + b, 5.5, 4.8, C4);
    p.rect(9 + L, 18 + b, 8, 2, c.m);
    p.rect(10 + L, 13 + b, 5, 3, c.l); p.rect(10 + L, 13 + b, 5, 1, c.h); p.px(15 + L, 15 + b, c.w); p.px(16 + L, 16 + b, c.w);
    p.rect(9 + L, 20 + b, 9, 1, c.j); p.px(13 + L, 20 + b, c.acc);
    // emblema y cinturón propios
    if (S === 'k') { p.ell(X(13), Y(17), 1.3, 1.3, c.acc); p.px(X(13), Y(16), '#ffffff'); }
    else if (S === 'selva') { p.px(X(13), Y(16), c.acc); p.px(X(12), Y(17), c.acc); p.px(X(14), Y(17), c.acc); p.px(X(13), Y(18), c.acc); p.px(X(13), Y(17), c.h); p.rect(X(16), Y(19), 2, 2, c.d); }
    else if (S === 'solar') { p.ell(X(13), Y(17), 1.4, 1.4, c.acc); p.px(X(13), Y(17), c.w); for (const [dx, dy] of [[0, -3], [3, 0], [0, 3], [-3, 0]]) p.px(X(13 + dx), Y(17 + dy), c.eg); }
    else if (S === 'duna') { p.line(X(10), Y(13), X(16), Y(19), c.h); p.rect(X(10), Y(19), 2, 2, c.d); p.rect(X(15), Y(19), 2, 2, c.d); p.px(X(13), Y(17), c.acc); } // bandolera y bolsas
    else if (S === 'hielo') { p.px(X(13), Y(17), c.acc); p.px(X(13), Y(15), c.h); p.px(X(13), Y(19), c.h); p.px(X(11), Y(17), c.h); p.px(X(15), Y(17), c.h); }
    else if (S === 'abismo') { p.ell(X(13), Y(17), 1.6, 1.6, G.g3); p.px(X(13), Y(17), VD); p.px(X(14), Y(16), c.acc); } // manómetro
    else if (S === 'umbra') { p.px(X(13), Y(15), c.acc); p.px(X(12), Y(16), c.l); p.px(X(14), Y(16), c.l); p.px(X(13), Y(17), c.eg); p.px(X(13), Y(18), c.l); } // rombo de cristal
    else if (S === 'fungi') { for (let k = 0; k < 6; k++) p.px(X(13) + Math.round(Math.cos(k * 1.05) * 1.6), Y(17) + Math.round(Math.sin(k * 1.05) * 1.6), k % 2 ? c.l : c.acc); } // espiral micelial
    leg(14 + L, 14 + L + o.fA[0], FY - o.fA[1], false);
    // ---- casco ----
    if (S === 'k') {
      p.sell(X(13), Y(7), 6.8, 6.3, C4);
      p.line(X(9), Y(2), X(13), Y(1), c.h); p.px(X(8), Y(3), c.h);
      p.ell(X(15.5), Y(8), 4.6, 3.4, VD); p.ell(X(15.6), Y(7.5), 3.9, 2.3, VM);
      p.line(X(12), Y(6), X(14), Y(5), RF); p.px(X(12), Y(7), '#3a4680'); p.px(X(19), Y(10), '#2a2a60');
      for (const ex of [14, 17]) { p.px(X(ex), Y(8), eye); p.px(X(ex + 1), Y(8), eye); p.px(X(ex), Y(7), eg); p.px(X(ex + 1), Y(9), eg); p.px(X(ex - 1), Y(8), eg); }
      p.ell(X(8.5), Y(8), 1.6, 2.4, c.d); p.px(X(8), Y(7), c.acc);
    } else if (S === 'selva') {
      // frondas que nacen de la nuca
      p.tri(X(10), Y(2), X(12), Y(4), X(2), Y(1), c.m); p.line(X(11), Y(3), X(4), Y(1), c.l);
      p.tri(X(8), Y(5), X(9), Y(8), X(1), Y(5), c.d); p.line(X(8), Y(6), X(3), Y(5), c.m);
      p.sell(X(13), Y(7.4), 6.6, 5.9, C4);
      p.rect(X(8), Y(3), 10, 1, c.d); p.line(X(9), Y(2), X(14), Y(1.6), c.h); // cinta del casco de explorador
      poly(p, [[X(12), Y(6)], [X(19), Y(5)], [X(21), Y(8)], [X(18), Y(11)], [X(13), Y(10)]], VD); // visor en flecha
      poly(p, [[X(13), Y(7)], [X(18), Y(6)], [X(19.5), Y(8)], [X(17), Y(10)], [X(14), Y(9)]], VM);
      p.rect(X(15), Y(8), 4, 1, eye); p.px(X(14), Y(8), eg); p.px(X(19), Y(8), eg); p.px(X(14), Y(6), RF);
      p.rect(X(8), Y(8), 2, 3, c.d); p.px(X(8), Y(9), c.acc); // rejilla lateral
    } else if (S === 'solar') {
      p.tri(X(7), Y(4), X(11), Y(1), X(2), Y(0), c.l); p.line(X(10), Y(1), X(3), Y(0), c.h); // aleta trasera
      p.sell(X(13), Y(7), 6.4, 6.5, C4);
      p.line(X(9), Y(2), X(14), Y(1), c.h);
      p.rect(X(12), Y(5), 9, 5, VD); p.px(X(20), Y(5), c.m); p.px(X(20), Y(9), c.d); p.rect(X(13), Y(6), 7, 3, VM); // visor panorámico
      p.rect(X(12), Y(4), 8, 1, c.l); p.rect(X(12), Y(10), 8, 1, c.d);
      p.rect(X(14), Y(7), 5, 1, eye); p.px(X(13), Y(7), eg); p.px(X(19), Y(7), eg); p.line(X(14), Y(6), X(16), Y(6), RF);
      p.line(X(8), Y(8), X(5), Y(8), c.l); p.px(X(4), Y(8), c.acc); p.px(X(8), Y(9), c.d); // emisor lateral
    } else if (S === 'duna') {
      const fl = (o.b || 0) + Math.round(L * 0.5);
      p.thick(X(8), Y(11), X(3), Y(12 + fl), 2, c.h); p.thick(X(3), Y(12 + fl), X(0), Y(11 + fl * 2), 1.5, c.l); // bufanda al viento
      p.sell(X(13), Y(7), 6.8, 6.3, C4);
      p.sell(X(12.5), Y(3.6), 6.3, 3.1, [c.l, c.h, c.w]); p.line(X(7), Y(5), X(18), Y(4), c.l); p.line(X(8), Y(3), X(16), Y(2), c.w); // turbante
      p.rect(X(7), Y(7), 6, 1, c.j); // correa de las gafas
      for (const gx of [15, 18.5]) { p.ell(X(gx), Y(7.5), 2, 2, c.j); p.ell(X(gx), Y(7.5), 1.3, 1.3, VM); p.px(X(gx), Y(7), eye); p.px(X(gx - 1), Y(8), eg); }
      p.rect(X(16), Y(10), 4, 3, G.g1); p.rect(X(17), Y(10), 2, 1, G.g2); p.px(X(20), Y(11), G.g3); p.px(X(17), Y(12), c.acc); // respirador
      p.rect(X(8), Y(11), 9, 2, c.h); p.rect(X(8), Y(12), 9, 1, c.l); // vuelta de bufanda al cuello
    } else if (S === 'hielo') {
      p.tri(X(8), Y(4), X(10), Y(3), X(5), Y(0), c.h); p.line(X(9), Y(3), X(6), Y(1), c.w); // cristales de la nuca
      p.tri(X(7), Y(7), X(8), Y(9), X(2), Y(5), c.l); p.line(X(7), Y(8), X(3), Y(6), c.h);
      const C = [X(13), Y(7)], pts = [[8, 2], [16, 1], [20, 4], [20, 10], [16, 13], [9, 13], [6, 8]].map(([x, y]) => [X(x), Y(y)]), fc = [c.l, c.h, c.l, c.m, c.d, c.d, c.m];
      for (let i = 0; i < pts.length; i++) { const a = pts[i], q = pts[(i + 1) % pts.length]; p.tri(C[0], C[1], a[0], a[1], q[0], q[1], fc[i]); } // casco facetado
      p.line(X(8), Y(2), X(16), Y(1), c.w);
      p.tri(X(13), Y(8), X(17), Y(5), X(21), Y(8), VD); p.tri(X(13), Y(8), X(21), Y(8), X(17), Y(11), VD); // visor en rombo
      p.tri(X(14.5), Y(8), X(17), Y(6), X(19.5), Y(8), VM); p.tri(X(14.5), Y(8), X(19.5), Y(8), X(17), Y(10), VM);
      p.rect(X(15), Y(8), 5, 1, eye); p.px(X(17), Y(7), eg); p.px(X(17), Y(9), eg); p.px(X(15), Y(7), RF);
    } else if (S === 'storm') {
      p.sell(X(13), Y(7), 6.6, 6.2, C4); p.tri(X(9), Y(3), X(12), Y(2), X(3), Y(-1), c.h); p.tri(X(10), Y(5), X(12), Y(4), X(4), Y(2), c.acc); p.px(X(3), Y(-1), c.acc); // aletas de cuerno barridas hacia atrás
      p.rect(X(13), Y(6), 8, 4, VD); p.rect(X(14), Y(7), 6, 2, c.l); p.line(X(15), Y(7), X(18), Y(8), c.h); p.px(X(16), Y(8), eye); p.px(X(18), Y(8), eye); // visor celeste con un rayo
    } else if (S === 'volcano') {
      p.sell(X(13), Y(7), 6.6, 6.2, C4); p.tri(X(8), Y(4), X(11), Y(3), X(4), Y(-2), c.m); p.tri(X(15), Y(2), X(17), Y(3), X(18), Y(-3), c.m); p.px(X(5), Y(-1), c.h); p.px(X(18), Y(-2), c.h); // cuernos
      p.line(X(9), Y(5), X(11), Y(9), c.l); p.line(X(11), Y(9), X(10), Y(12), c.l); p.px(X(10), Y(9), c.h); // grieta de lava
      p.rect(X(13), Y(6), 8, 4, VD); p.rect(X(14), Y(7), 6, 2, c.l); p.rect(X(15), Y(7), 4, 1, c.h); p.px(X(16), Y(8), eye); p.px(X(18), Y(8), eye); // visor fundido
    } else if (S === 'hive') {
      p.line(X(11), Y(2), X(8), Y(-2), c.d); p.px(X(8), Y(-2), c.acc); p.line(X(14), Y(1), X(15), Y(-3), c.d); p.px(X(15), Y(-3), c.acc); // antenas
      P.Sprites.xeHex(p, X(13), Y(7), 6.4, c.m, c.d, null); p.line(X(9), Y(3), X(14), Y(2), c.h);
      p.ell(X(16), Y(7.5), 4, 3.2, VD); for (const [dx, dy] of [[-2, -1], [0, -1], [2, -1], [-1, 1], [1, 1], [3, 0]]) p.px(X(16 + dx), Y(7.5 + dy), (dx + dy) % 2 ? eg : eye); // ojo compuesto
    } else if (S === 'fungi') {
      p.sell(X(13), Y(7.5), 6.3, 5.8, C4);
      for (let yy = 0; yy < 6; yy++) { const ww = 9.5 * Math.sqrt(1 - (yy / 6) ** 2); p.rect(Math.round(X(12.5) - ww), Math.round(Y(4) - yy), Math.round(ww * 2), 1, yy < 1 ? c.d : yy > 6 - 2 ? c.l : c.m); } for (const [dx, dy] of [[-5, -2], [-1, -4], [4, -2], [1, -1]]) p.ell(X(12.5 + dx), Y(4 + dy), 1, 0.8, c.h); p.line(X(3), Y(4) + 1, X(22), Y(4) + 1, c.l); for (let k = 0; k < 6; k++) p.px(X(5 + k * 3), Y(5), c.eg); // sombrero de hongo con láminas
      p.rect(X(13), Y(6), 7, 4, VD); p.px(X(15), Y(7), eye); p.px(X(18), Y(7), eye); p.px(X(15), Y(8), eg); p.px(X(18), Y(8), eg); p.px(X(14), Y(6), RF);
    } else if (S === 'umbra') {
      for (const [x0, y0, h, ln] of [[9, 3, 6, -0.6], [11, 2, 7, -0.35], [7, 6, 4, -0.9]]) P.Sprites.umCrystal(p, X(x0), Y(y0), 2.4, h, [c.d, c.m, c.l, c.h], ln); // corona de cristal
      p.sell(X(13), Y(7), 6.6, 6.1, C4); p.line(X(9), Y(2), X(14), Y(1.5), c.h);
      p.rect(X(12), Y(6), 9, 3, VD); p.rect(X(13), Y(7), 7, 1, eg); p.px(X(19), Y(7), eye); p.px(X(14), Y(7), eye); // visor en rendija
      p.tri(X(12), Y(9), X(20), Y(9), X(16), Y(12), c.d); p.line(X(13), Y(10), X(18), Y(10), c.m); p.rect(X(8), Y(8), 2, 3, c.d); p.px(X(8), Y(9), c.acc);
    } else if (S === 'abismo') {
      p.line(X(11), Y(1), X(14), Y(0), G.g2); p.line(X(14), Y(0), X(19), Y(0), G.g2); p.line(X(19), Y(0), X(21), Y(2), G.g2); // linterna-señuelo
      p.sell(X(12.5), Y(7), 7.2, 6.6, C4);
      p.line(X(8), Y(3), X(12), Y(1), c.h); p.px(X(7), Y(4), c.h);
      p.rect(X(7), Y(12), 11, 2, G.g2); p.rect(X(7), Y(12), 11, 1, G.g3); p.px(X(9), Y(13), G.g1); p.px(X(14), Y(13), G.g1); // collarín
      p.ell(X(16), Y(7.5), 4, 3.8, c.acc); p.ell(X(16), Y(7.5), 3, 2.8, VD); p.ell(X(16.3), Y(7), 2.1, 1.7, VM); // portilla de latón
      for (const [bx, by] of [[16, 4], [20, 7], [16, 11], [12, 7]]) p.px(X(bx), Y(by), G.g3);
      p.px(X(15), Y(8), eye); p.px(X(17), Y(8), eye); p.px(X(15), Y(9), eg); p.px(X(17), Y(9), eg); p.px(X(15), Y(6), RF);
      p.ell(X(21.5), Y(3), 1.5, 1.5, eg); p.px(X(21), Y(2), c.w); // bulbo luminoso
    }
    // ---- hombrera ----
    if (S === 'k') { p.sell(X(9), Y(13), 4, 3.4, C4); p.line(X(7), Y(12), X(10), Y(11), c.w); }
    else if (S === 'selva') { p.tri(X(5), Y(12), X(13), Y(11), X(9), Y(17), c.m); p.tri(X(5), Y(12), X(11), Y(11), X(7), Y(14), c.l); p.line(X(6), Y(12), X(10), Y(15), c.d); p.px(X(12), Y(11), c.h); }
    else if (S === 'solar') { p.sell(X(9), Y(13), 3.6, 3, C4); p.line(X(6), Y(11), X(11), Y(10), c.w); p.px(X(7), Y(13), c.acc); p.px(X(6), Y(14), c.eg); }
    else if (S === 'duna') { p.rect(X(6), Y(11), 7, 2, c.m); p.rect(X(6), Y(11), 7, 1, c.l); p.rect(X(6), Y(13), 6, 2, c.d); p.rect(X(6), Y(13), 6, 1, c.m); p.rect(X(7), Y(15), 4, 1, c.h); p.px(X(8), Y(16), c.l); p.px(X(10), Y(16), c.l); }
    else if (S === 'hielo') { p.tri(X(5), Y(13), X(12), Y(10), X(11), Y(16), c.m); p.tri(X(5), Y(13), X(12), Y(10), X(9), Y(13), c.l); p.line(X(6), Y(12), X(11), Y(10), c.h); p.px(X(4), Y(13), c.w); }
    else if (S === 'abismo') { p.sell(X(9), Y(13.5), 4.4, 3.6, C4); p.px(X(7), Y(12), G.g3); p.px(X(10), Y(11), G.g3); p.px(X(11), Y(15), G.g3); }
    else if (S === 'umbra') { P.Sprites.umCrystal(p, X(7), Y(13), 2.6, 6, [c.d, c.m, c.l, c.h], -0.35); p.sell(X(9), Y(13), 3.6, 3, C4); p.line(X(7), Y(11), X(11), Y(11), c.h); }
    else if (S === 'storm') { p.sell(X(9), Y(13), 4, 3.4, C4); p.tri(X(5), Y(11), X(9), Y(10), X(6), Y(8), c.acc); p.px(X(8), Y(11), c.h); }
    else if (S === 'volcano') { p.sell(X(9), Y(13), 4, 3.4, C4); p.rect(X(6), Y(10), 3, 2, c.d); p.px(X(7), Y(9), c.l); p.line(X(8), Y(12), X(11), Y(15), c.l); }
    else if (S === 'hive') { P.Sprites.xeHex(p, X(9), Y(13), 3.6, c.m, c.d, null); p.px(X(9), Y(12), c.h); p.px(X(7), Y(11), c.l); }
    else if (S === 'fungi') { p.sell(X(9), Y(13), 3.8, 3.2, C4); p.px(X(8), Y(10), c.w); for (let yy = 0; yy < 2; yy++) { const ww = 2 * Math.sqrt(1 - (yy / 2) ** 2); p.rect(Math.round(X(8) - ww), Math.round(Y(10) - yy), Math.round(ww * 2), 1, yy < 1 ? c.d : yy > 2 - 2 ? c.l : c.m); } p.px(X(11), Y(11), c.acc); }
    // bláster cromado
    const gy = 15 + b + (o.gy || 0), gx = 12 + L - (o.rx || 0);
    p.rect(gx, gy, 11, 4, G.g2); p.rect(gx, gy, 11, 1, G.g3); p.rect(gx, gy + 3, 11, 1, G.g1);
    p.rect(gx + 10, gy + 1, 2, 2, G.g3); p.px(gx + 11, gy + 1, G.g4);
    p.rect(gx + 3, gy - 2, 4, 2, G.g1); p.px(gx + 4, gy - 2, '#5ae8ff');
    p.rect(gx + 6, gy + 1, 3, 1, c.m); p.px(gx + 7, gy + 2, c.l);
    p.rect(gx + 2, gy + 4, 2, 2, G.g1);
    const hx = 13 + L - (o.rx || 0);
    p.sell(hx, gy + 3, 2.4, 2.2, [c.d, c.m, c.l]);
    // dispositivo de muñeca
    if (S === 'selva') p.rect(hx - 3, gy + 2, 2, 3, c.j);
    else if (S === 'solar') { p.rect(hx - 3, gy + 2, 2, 2, G.g1); p.px(hx - 3, gy + 2, c.eg); }
    else if (S === 'duna') { p.rect(hx - 3, gy + 2, 2, 3, c.h); p.px(hx - 2, gy + 3, c.l); }
    else if (S === 'hielo') { p.px(hx - 2, gy + 2, c.eg); p.px(hx - 3, gy + 3, c.h); }
    else if (S === 'abismo') { p.rect(hx - 3, gy + 2, 2, 2, G.g3); p.px(hx - 3, gy + 3, c.acc); }
    else if (S === 'umbra') { p.px(hx - 3, gy + 2, c.l); p.px(hx - 2, gy + 3, c.eg); }
    else if (S === 'storm') { p.px(hx - 3, gy + 2, c.l); p.px(hx - 2, gy + 3, c.acc); }
    else if (S === 'volcano') { p.px(hx - 3, gy + 2, c.l); p.px(hx - 2, gy + 4, c.h); }
    else if (S === 'hive') { p.px(hx - 3, gy + 2, c.l); p.px(hx - 2, gy + 3, c.acc); }
    else if (S === 'fungi') { p.px(hx - 3, gy + 2, c.acc); p.px(hx - 2, gy + 4, c.l); }
  };

  // ---------------- escalada (de espaldas) ----------------
  P.Sprites.heroClimb = function (p, f, c) {
    const S = style(c), a = f ? 1 : -1, C4 = [c.d, c.m, c.l, c.h];
    p.thick(10, 19, 10 - a, 26, 4, c.d); p.thick(14, 19, 14 + a, 25, 4, c.m);
    p.rect(8, 11, 9, 9, c.m); p.rect(8, 11, 1, 9, c.d);
    if (S === 'k') { p.rect(9, 12, 7, 7, c.d); p.rect(10, 13, 5, 5, G.g1); p.px(11, 14, G.g2); p.px(12, 18, '#ff9a3a'); }
    else if (S === 'selva') { p.rect(8, 12, 9, 8, c.d); p.rect(8, 15, 9, 1, c.j); p.px(12, 17, c.acc); p.sell(12.5, 12, 4.6, 1.6, [c.d, c.m, c.l]); p.line(15, 18, 18, 24, G.g2); }
    else if (S === 'solar') { p.thick(9, 13, 3, 9 + a, 2.4, G.g1); p.thick(16, 13, 22, 9 - a, 2.4, G.g1); p.line(8, 13, 4, 10 + a, c.l); p.line(17, 13, 21, 10 - a, c.l); p.rect(10, 12, 5, 7, c.d); p.ell(12.5, 15, 1.4, 1.4, c.eg); p.px(12, 15, c.w); }
    else if (S === 'duna') { p.rect(9, 13, 7, 6, c.d); p.rect(9, 15, 7, 1, c.h); p.sell(12.5, 12.5, 4, 1.5, [G.g1, G.g2, G.g3]); p.thick(11, 11, 9 - a, 18, 2, c.h); }
    else if (S === 'hielo') { p.rect(10, 12, 5, 8, G.g1); p.rect(11, 13, 3, 5, c.eg); p.px(11, 14, c.w); p.rect(10, 12, 5, 1, c.l); }
    else if (S === 'storm') { p.rect(9, 12, 7, 9, c.d); p.ell(12, 13, 2.6, 2.6, c.l); p.px(12, 13, c.h); p.tri(8, 4, 10, 3, 4, 0, c.h); p.tri(15, 3, 17, 4, 21, 0, c.h); }
    else if (S === 'volcano') { p.rect(9, 12, 7, 9, c.d); p.rect(11, 14, 3, 5, c.l); p.px(12, 15, c.h); p.tri(8, 4, 10, 3, 5, -1, c.m); p.tri(15, 3, 17, 4, 20, -1, c.m); }
    else if (S === 'hive') { for (const [x0, y0] of [[10, 13], [15, 13], [12.5, 17], [10, 21], [15, 21]]) P.Sprites.xeHex(p, x0, y0, 2.3, c.m, c.d, null); p.tri(8, 12, 2, 8, 5, 18, c.l); p.tri(17, 12, 23, 8, 20, 18, c.l); }
    else if (S === 'fungi') { p.sell(12.5, 16, 4.6, 5.5, [c.d, c.m, c.l]); for (let k = 0; k < 4; k++) p.px(10 + k * 2, 14 + (k % 2) * 3, c.h); }
    else if (S === 'umbra') { p.rect(7, 11, 11, 12, c.d); p.rect(7, 11, 11, 1, c.l); for (let k = 0; k < 5; k++) p.px(7 + k * 2 + a * 0, 22 + (k % 2), c.j); p.line(12, 12, 12, 21, c.m); }
    else if (S === 'abismo') { p.rect(8, 12, 4, 8, c.m); p.rect(13, 12, 4, 8, c.l); p.px(9, 13, c.h); p.px(14, 13, c.w); p.rect(8, 15, 9, 1, c.acc); }
    p.thick(8, 12, 5, 5 + a * 2, 3, c.m); p.thick(17, 12, 20, 5 - a * 2, 3, c.m); p.sell(5, 4 + a * 2, 1.8, 1.8, C4); p.sell(20, 4 - a * 2, 1.8, 1.8, C4);
    if (S === 'hielo') { poly(p, [[8, 3], [12, 1], [17, 3], [18, 8], [15, 12], [10, 12], [7, 8]], c.m); p.tri(8, 3, 12, 1, 12, 7, c.l); p.tri(12, 1, 17, 3, 12, 7, c.h); p.tri(9, 3, 11, 2, 9, -1, c.h); p.tri(14, 3, 16, 3, 16, 0, c.l); }
    else if (S === 'abismo') { p.sell(12.5, 7, 6.6, 6, C4); p.rect(7, 11, 11, 2, G.g2); p.line(12, 1, 12, 0, G.g2); p.px(12, 0, c.eg); }
    else { p.sell(12.5, 7, 6, 5.6, C4); p.px(10, 4, c.h); p.px(9, 5, c.h); }
    if (S === 'selva') { p.tri(9, 3, 11, 4, 4, -1, c.m); p.tri(14, 3, 16, 4, 21, -1, c.l); p.rect(7, 4, 11, 1, c.d); }
    else if (S === 'solar') { p.rect(12, 1, 1, 6, c.l); p.px(12, 1, c.h); }
    else if (S === 'duna') { p.sell(12.5, 4, 5.6, 2.6, [c.l, c.h, c.w]); p.rect(8, 10, 9, 2, c.h); }
    else if (S === 'umbra') { for (const [x0, ln] of [[10, -0.4], [12.5, 0], [15, 0.4]]) P.Sprites.umCrystal(p, x0, 3, 2.4, 5, [c.d, c.m, c.l, c.h], ln); }
    else if (S === 'fungi') { for (let yy = 0; yy < 5; yy++) { const ww = 9 * Math.sqrt(1 - (yy / 5) ** 2); p.rect(Math.round(12.5 - ww), Math.round(4 - yy), Math.round(ww * 2), 1, yy < 1 ? c.d : yy > 5 - 2 ? c.l : c.m); } p.px(9, 2, c.h); p.px(15, 1, c.h); }
    p.rect(8, 25, 4, 3, S === 'abismo' ? G.g1 : c.j); p.rect(13, 25, 4, 3, S === 'abismo' ? G.g1 : c.j);
  };

  // ---------------- vista cenital del mapa exterior (17x20) ----------------
  const baseTop = P.Sprites.heroTop;
  P.Sprites.heroTop = function (p, dir, f, c) {
    const S = style(c);
    // equipo dorsal que asoma por detrás (se dibuja antes del cuerpo)
    if (S === 'solar') { if (dir === 'side') { p.rect(1, 8, 3, 6, G.g1); p.px(2, 9, c.l); p.px(2, 11, c.l); } else { p.rect(0, 9, 3, 5, G.g1); p.rect(14, 9, 3, 5, G.g1); p.px(1, 10, c.l); p.px(15, 10, c.l); } }
    if (S === 'abismo' && dir !== 'down') { if (dir === 'side') { p.rect(2, 9, 3, 7, c.l); p.px(3, 9, c.h); } }
    baseTop(p, dir, f, c);
    if (S === 'k') return;
    if (S === 'abismo') {
      p.sell(8.5, 6, 5.6, 5.2, [c.d, c.m, c.l, c.h]); p.rect(4, 10, 9, 1, G.g2);
      if (dir === 'down') { p.ell(8.5, 7, 3, 2.6, c.acc); p.ell(8.5, 7, 2, 1.7, VD); p.px(7, 7, c.e); p.px(10, 7, c.e); }
      else if (dir === 'side') { p.ell(11.5, 6.5, 2.6, 2.4, c.acc); p.ell(11.5, 6.5, 1.6, 1.5, VD); p.px(12, 6, c.e); }
      else { p.rect(6, 11, 2, 4, c.l); p.rect(9, 11, 2, 4, c.l); }
      p.px(8, 0, c.eg); p.px(8, 1, G.g2); return;
    }
    if (S === 'hielo') {
      poly(p, [[5, 2], [9, 1], [13, 3], [14, 7], [11, 10], [6, 10], [3, 7]], c.m); p.tri(5, 2, 9, 1, 8, 5, c.h); p.tri(9, 1, 13, 3, 8, 5, c.l);
      p.tri(4, 3, 6, 2, 3, 0, c.h); p.tri(12, 2, 13, 3, 14, 0, c.l);
      if (dir === 'down') { p.tri(5, 7, 8.5, 5, 12, 7, VD); p.tri(5, 7, 12, 7, 8.5, 9, VD); p.rect(7, 7, 4, 1, c.e); }
      else if (dir === 'side') { p.tri(9, 6, 12, 4, 14, 6, VD); p.tri(9, 6, 14, 6, 12, 8, VD); p.px(12, 6, c.e); }
      return;
    }
    if (S === 'selva') {
      p.tri(4, 4, 6, 3, 1, 0, c.m); p.tri(11, 3, 13, 4, 16, 0, c.l); p.rect(4, 3, 9, 1, c.d);
      if (dir === 'down') { poly(p, [[5, 6], [12, 6], [11, 9], [8.5, 10], [6, 9]], VD); p.rect(7, 7, 4, 1, c.e); }
      else if (dir === 'side') { poly(p, [[9, 5], [14, 5], [15, 7], [13, 9], [10, 8]], VD); p.rect(11, 6, 3, 1, c.e); }
      return;
    }
    if (S === 'solar') {
      p.rect(8, 0, 1, 3, c.l); p.px(8, 0, c.h);
      if (dir === 'down') { p.rect(4, 6, 9, 3, VD); p.rect(6, 7, 5, 1, c.e); p.px(5, 7, c.eg); p.px(11, 7, c.eg); }
      else if (dir === 'side') { p.rect(8, 5, 6, 3, VD); p.rect(10, 6, 3, 1, c.e); }
      return;
    }
    if (S === 'storm') {
      p.tri(4, 4, 6, 3, 1, 1, c.h); p.tri(11, 3, 13, 4, 16, 1, c.h);
      if (dir === 'down') { p.rect(5, 6, 7, 3, VD); p.rect(6, 7, 5, 1, c.l); p.px(7, 7, c.h); p.px(10, 7, c.h); } else if (dir === 'side') { p.rect(9, 5, 5, 3, VD); p.rect(10, 6, 3, 1, c.l); } else { p.rect(6, 10, 5, 5, c.d); p.ell(8, 12, 1.6, 1.6, c.l); }
      return;
    }
    if (S === 'volcano') {
      p.tri(4, 4, 6, 3, 2, 0, c.m); p.tri(11, 3, 13, 4, 15, 0, c.m); p.line(6, 4, 7, 8, c.l);
      if (dir === 'down') { p.rect(5, 6, 7, 3, VD); p.rect(6, 7, 5, 1, c.l); p.px(7, 7, c.h); p.px(10, 7, c.h); } else if (dir === 'side') { p.rect(9, 5, 5, 3, VD); p.rect(10, 6, 3, 1, c.l); } else { p.rect(6, 10, 5, 5, c.d); p.px(8, 12, c.l); }
      return;
    }
    if (S === 'hive') {
      P.Sprites.xeHex(p, 8.5, 6, 4.6, c.m, c.d, null); p.px(6, 1, c.acc); p.px(11, 1, c.acc); p.line(7, 2, 6, 1, c.d); p.line(10, 2, 11, 1, c.d);
      if (dir === 'down') { p.ell(8.5, 7, 3, 2.2, VD); p.px(7, 7, c.e); p.px(9, 7, c.eg); p.px(10, 7, c.e); } else if (dir === 'side') { p.ell(11, 6.5, 2.4, 2, VD); p.px(12, 6, c.e); } else { p.rect(6, 10, 5, 5, c.m); p.px(8, 12, c.h); }
      return;
    }
    if (S === 'fungi') {
      for (let yy = 0; yy < 5; yy++) { const ww = 7.5 * Math.sqrt(1 - (yy / 5) ** 2); p.rect(Math.round(8.5 - ww), Math.round(4 - yy), Math.round(ww * 2), 1, yy < 1 ? c.d : yy > 5 - 2 ? c.l : c.m); } p.px(6, 1, c.h); p.px(11, 2, c.h);
      if (dir === 'down') { p.rect(5, 6, 7, 3, VD); p.px(7, 7, c.e); p.px(10, 7, c.e); } else if (dir === 'side') { p.rect(9, 5, 5, 3, VD); p.px(12, 6, c.e); } else p.sell(8.5, 12, 3, 3.5, [c.d, c.m, c.l]);
      return;
    }
    if (S === 'umbra') {
      for (const [x0, ln] of [[6, -0.4], [8.5, 0], [11, 0.4]]) P.Sprites.umCrystal(p, x0, 3, 2, 4, [c.d, c.m, c.l, c.h], ln);
      if (dir === 'down') { p.rect(5, 6, 7, 2, VD); p.rect(6, 6, 5, 1, c.eg); } else if (dir === 'side') { p.rect(9, 5, 5, 2, VD); p.rect(10, 5, 3, 1, c.eg); p.line(4, 10, 2, 16, c.d); } else { p.rect(4, 9, 9, 8, c.d); p.rect(4, 9, 9, 1, c.l); }
      return;
    }
    if (S === 'duna') {
      p.sell(8.5, 3.6, 4.8, 2.4, [c.l, c.h, c.w]); p.rect(4, 10, 9, 1, c.h);
      if (dir === 'down') { p.ell(6.5, 7, 1.6, 1.6, c.j); p.ell(10.5, 7, 1.6, 1.6, c.j); p.px(6, 7, c.e); p.px(10, 7, c.e); p.rect(7, 9, 3, 2, G.g1); p.line(13, 10, 15, 13, c.h); }
      else if (dir === 'side') { p.ell(11.5, 6.5, 1.6, 1.6, c.j); p.px(12, 6, c.e); p.rect(12, 8, 2, 2, G.g1); p.line(4, 10, 1, 12, c.h); }
      else { p.line(8, 10, 8, 15, c.h); p.line(9, 10, 10, 14, c.l); }
    }
  };

  // ---------------- retrato (32x32) ----------------
  P.Sprites.heroPortrait = function (p, c) {
    const S = style(c), C4 = [c.d, c.m, c.l, c.h];
    if (S === 'selva') { p.tri(8, 8, 11, 12, 0, 2, c.m); p.line(9, 9, 2, 3, c.l); p.tri(7, 14, 8, 18, 0, 12, c.d); }
    if (S === 'solar') { p.tri(9, 7, 15, 3, 1, 1, c.l); p.line(13, 4, 3, 1, c.h); }
    if (S === 'hielo') { p.tri(7, 7, 10, 5, 2, 0, c.h); p.tri(23, 6, 26, 8, 30, 0, c.l); }
    if (S === 'abismo') { p.line(16, 3, 21, 0, G.g2); p.line(21, 0, 27, 1, G.g2); p.line(27, 1, 29, 4, G.g2); }
    if (S === 'duna') { p.thick(8, 24, 2, 30, 3, c.h); }
    if (S === 'storm') { p.tri(8, 8, 12, 6, 0, 1, c.h); p.tri(20, 6, 24, 8, 32, 1, c.h); p.px(1, 1, c.acc); p.px(31, 1, c.acc); }
    if (S === 'volcano') { p.tri(8, 8, 12, 6, 2, 0, c.m); p.tri(20, 6, 24, 8, 30, 0, c.m); p.px(3, 1, c.h); p.px(29, 1, c.h); }
    if (S === 'hive') { p.line(10, 6, 5, 0, c.d); p.line(22, 6, 27, 0, c.d); p.ell(5, 1, 1.4, 1.4, c.acc); p.ell(27, 1, 1.4, 1.4, c.acc); }
    if (S === 'fungi') { for (let yy = 0; yy < 9; yy++) { const ww = 16 * Math.sqrt(1 - (yy / 9) ** 2); p.rect(Math.round(16 - ww), Math.round(11 - yy), Math.round(ww * 2), 1, yy < 1 ? c.d : yy > 9 - 2 ? c.l : c.m); } for (const [x0, y0] of [[8, 6], [14, 4], [21, 5], [25, 8], [11, 9]]) p.ell(x0, y0, 1.6, 1.2, c.h); }
    if (S === 'umbra') { for (const [x0, h, ln] of [[9, 12, -0.5], [14, 15, -0.2], [20, 13, 0.25], [25, 9, 0.55]]) P.Sprites.umCrystal(p, x0, 8, 3, h, C4, ln); }
    // hombros
    if (S === 'duna') { p.sell(16, 31, 13, 9, C4); p.sell(5, 26, 5, 4, C4); p.sell(27, 26, 5, 4, C4); for (const s of [-1, 1]) { const cx = 16 + s * 11; p.line(cx - 4, 25, cx + 4, 24, c.l); p.line(cx - 4, 27, cx + 4, 26, c.d); p.line(cx - 4, 29, cx + 4, 28, c.d); } }
    else if (S === 'hielo') { p.sell(16, 31, 13, 9, C4); p.tri(0, 27, 10, 21, 9, 31, c.m); p.tri(0, 27, 10, 21, 6, 25, c.l); p.tri(32, 27, 22, 21, 23, 31, c.m); p.tri(32, 27, 22, 21, 26, 25, c.h); }
    else if (S === 'selva') { p.sell(16, 31, 13, 9, C4); p.tri(0, 25, 11, 23, 5, 31, c.m); p.tri(0, 25, 9, 23, 3, 27, c.l); p.tri(32, 25, 21, 23, 27, 31, c.m); p.tri(32, 25, 23, 23, 29, 27, c.l); }
    else { p.sell(16, 31, 13, 9, C4); p.sell(5, 26, 5, 4, C4); p.sell(27, 26, 5, 4, C4); }
    // casco
    if (S === 'hielo') {
      const C = [16, 14], pts = [[9, 4], [20, 3], [27, 9], [27, 19], [21, 25], [11, 25], [5, 16]], fc = [c.l, c.h, c.l, c.m, c.d, c.d, c.m];
      for (let i = 0; i < pts.length; i++) { const a = pts[i], q = pts[(i + 1) % pts.length]; p.tri(C[0], C[1], a[0], a[1], q[0], q[1], fc[i]); }
      p.tri(8, 15, 17, 9, 26, 15, VD); p.tri(8, 15, 26, 15, 17, 21, VD); p.tri(11, 15, 17, 11, 23, 15, VM); p.tri(11, 15, 23, 15, 17, 19, VM);
      p.rect(12, 15, 10, 1, c.e); p.px(17, 13, c.eg); p.px(17, 17, c.eg); p.px(12, 13, RF);
    } else if (S === 'abismo') {
      p.sell(16, 14, 12, 12, C4); p.rect(5, 24, 22, 3, G.g2); p.rect(5, 24, 22, 1, G.g3);
      p.ell(17, 14, 8, 7.5, c.acc); p.ell(17, 14, 6.2, 5.8, VD); p.ell(17.5, 13, 4.5, 3.8, VM);
      for (const [bx, by] of [[17, 6], [25, 14], [17, 22], [9, 14], [11, 8], [23, 8]]) p.px(bx, by, G.g3);
      for (const ex of [14, 20]) { p.rect(ex - 1, 15, 3, 1, c.eg); p.px(ex, 15, c.e); }
      p.line(12, 11, 14, 9, RF); p.ell(29, 5, 2.2, 2.2, c.eg); p.px(28, 4, c.w);
    } else {
      p.sell(16, 14, 11, 11, C4);
      if (S === 'k') { p.ell(17, 15, 8, 6, VD); p.ell(14, 12, 3, 1.5, '#262c48'); for (const ex of [13, 20]) { p.rect(ex - 1, 15, 3, 1, c.eg); p.rect(ex, 14, 1, 3, c.eg); p.px(ex, 15, c.e); } }
      else if (S === 'selva') { p.rect(5, 7, 22, 2, c.d); p.line(8, 5, 18, 4, c.h); poly(p, [[9, 12], [24, 11], [27, 15], [22, 21], [11, 19]], VD); poly(p, [[11, 13], [23, 12], [25, 15], [21, 19], [12, 18]], VM); p.rect(13, 15, 10, 1, c.e); p.px(12, 15, c.eg); p.px(24, 15, c.eg); p.line(12, 13, 15, 12, RF); }
      else if (S === 'solar') { p.line(9, 5, 18, 4, c.h); p.rect(8, 10, 19, 9, VD); p.rect(9, 11, 17, 7, VM); p.rect(8, 9, 18, 1, c.l); p.rect(8, 19, 18, 1, c.d); p.rect(11, 14, 13, 1, c.e); p.rect(11, 15, 13, 1, c.eg); p.line(10, 12, 15, 12, RF); }
      else if (S === 'storm') { p.sell(16, 14, 11, 11, C4); p.rect(10, 12, 16, 7, VD); p.rect(11, 14, 14, 3, c.l); p.line(13, 14, 22, 16, c.h); p.px(14, 15, c.e); p.px(21, 15, c.e); }
      else if (S === 'volcano') { p.sell(16, 14, 11, 11, C4); p.line(8, 8, 11, 15, c.l); p.line(11, 15, 9, 21, c.l); p.px(11, 15, c.h); p.rect(10, 12, 16, 7, VD); p.rect(11, 14, 14, 3, c.l); p.rect(12, 15, 12, 1, c.h); p.px(14, 15, c.e); p.px(21, 15, c.e); }
      else if (S === 'hive') { P.Sprites.xeHex(p, 16, 14, 11, c.m, c.d, null); p.ell(17, 15, 8, 6, VD); for (let k = 0; k < 9; k++) p.px(12 + (k % 3) * 4 + (Math.floor(k / 3) % 2) * 2, 12 + Math.floor(k / 3) * 3, k % 2 ? c.eg : c.e); p.line(9, 6, 15, 4, c.h); }
      else if (S === 'fungi') { for (let yy = 0; yy < 9; yy++) { const ww = 16 * Math.sqrt(1 - (yy / 9) ** 2); p.rect(Math.round(16 - ww), 11 - yy, Math.round(ww * 2), 1, yy < 1 ? c.d : yy > 7 ? c.l : c.m); } for (const [x0, y0] of [[8, 6], [14, 4], [21, 5], [25, 8], [11, 9]]) p.ell(x0, y0, 1.6, 1.2, c.h); p.line(1, 12, 31, 12, c.l); for (let k = 0; k < 10; k++) p.px(3 + k * 3, 13, c.eg); p.rect(9, 14, 15, 8, VD); p.ell(13, 17, 2, 2, c.eg); p.ell(20, 17, 2, 2, c.eg); p.px(13, 17, c.e); p.px(20, 17, c.e); }
      else if (S === 'umbra') { p.rect(7, 12, 20, 6, VD); p.rect(8, 14, 18, 1, c.eg); p.rect(9, 14, 3, 1, c.e); p.rect(22, 14, 3, 1, c.e); p.tri(9, 19, 25, 19, 17, 25, c.d); p.line(11, 21, 23, 21, c.m); p.rect(4, 24, 24, 3, c.d); p.rect(4, 24, 24, 1, c.l); }
      else if (S === 'duna') {
        p.sell(15, 7, 11, 5.5, [c.l, c.h, c.w]); p.line(5, 9, 26, 7, c.l); p.line(7, 5, 22, 3, c.w);
        p.rect(4, 14, 7, 2, c.j); for (const gx of [15, 22]) { p.ell(gx, 14.5, 3.6, 3.6, c.j); p.ell(gx, 14.5, 2.6, 2.6, VM); p.px(gx, 14, c.e); p.px(gx - 1, 15, c.eg); p.px(gx - 1, 13, RF); }
        p.rect(14, 19, 8, 5, G.g1); p.rect(15, 19, 6, 1, G.g2); p.px(17, 21, c.acc); p.px(19, 21, c.acc); p.px(22, 21, G.g3);
        p.sell(16, 25, 10, 2.2, [c.l, c.h, c.w]); p.line(8, 26, 24, 26, c.l);
      }
    }
    p.rect(10, 28, 12, 1, c.acc);
  };

  // las armaduras de otros planetas se registran después; se marca su id justo antes de construir los sprites
  const baseBuild = P.Sprites.buildChars;
  P.Sprites.buildChars = function () {
    for (const sk in P.HERO_SKINS) Object.defineProperty(P.HERO_SKINS[sk], 'sid', { value: sk, configurable: true });
    baseBuild.call(this);
    for (const sk in P.HERO_SKINS) { const c = P.HERO_SKINS[sk]; P.mk('heropor_' + sk, 32, 32, 1, p => P.Sprites.heroPortrait(p, c)); }
  };
})();
