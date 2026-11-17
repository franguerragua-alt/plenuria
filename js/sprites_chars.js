'use strict';
// Sprites de personajes: protagonista, compañeros, civilizaciones, retratos
P.HERO_SKINS = {
  rojo: { name: 'Armadura de Combate K', d: '#6a0820', m: '#d41e3c', l: '#ff5050', h: '#ffb8a8', j: '#2a0614', e: '#f0ffff', eg: '#3ad8ff', acc: '#ffd166', w: '#f4f0ff' },
  selvatica: { name: 'Armadura Selvática', d: '#0e4a26', m: '#1fa043', l: '#5ce050', h: '#e0ffa0', j: '#0a2a14', e: '#fffff0', eg: '#c8ff3a', acc: '#ff5ad8', w: '#f0ffe0' },
  solar: { name: 'Armadura Solar (prototipo)', d: '#7a3a06', m: '#e08a14', l: '#ffc840', h: '#fff4b0', j: '#3a1a04', e: '#ffffff', eg: '#fff07a', acc: '#ff3a5a', w: '#fffaf0' }
};
P.HERO_F = { idle: 0, run: 2, jump: 8, fall: 9, crouch: 10, dash: 11, hurt: 12, shield: 13, climb: 14, shoot: 16, dead: 17 };
const GUN = { g0: '#1e2232', g1: '#3a4258', g2: '#7a86a4', g3: '#c8d4ec', g4: '#ffffff' };

// Protagonista lateral (24x28): casco con brillo, visor lacado, armadura por placas y bláster cromado
P.Sprites.hero = function (p, o, c) {
  const L = o.lean || 0, b = (o.b || 0) + (o.crouch ? 6 : 0), hipY = 19 + b, FY = 27, C4 = [c.d, c.m, c.l, c.h];
  const leg = (hx, fx, fy, back) => {
    const col = back ? c.d : c.m, hi = back ? c.m : c.l;
    let kx = (hx + fx) / 2 + 1.5, ky = (hipY + fy) / 2;
    if (o.crouch) { kx = hx + 5; ky = hipY + 1; }
    p.thick(hx, hipY, kx, ky, 4, col); p.thick(kx, ky, fx, fy - 2, 3.5, col);
    p.rect(Math.round(kx) - 1, Math.round(ky) - 1, 2, 2, hi); if (!back) p.px(Math.round(kx) - 1, Math.round(ky) - 1, c.h);
    p.rect(Math.round(fx) - 2, fy - 2, 6, 3, back ? c.j : c.d); p.rect(Math.round(fx) - 1, fy - 2, 4, 1, hi); p.px(Math.round(fx) + 3, fy, c.j);
  };
  if (o.dead) {
    p.rect(3, 22, 14, 5, c.m); p.rect(3, 22, 14, 1, c.l); p.rect(4, 25, 12, 2, c.d); p.px(9, 23, c.acc);
    p.sell(19, 22, 5, 4.6, C4); p.ell(20, 23, 3, 2.2, '#0a0a1c'); p.px(19, 22, '#3a4680');
    p.rect(1, 25, 9, 2, GUN.g2); p.px(9, 25, GUN.g3); return;
  }
  leg(10 + L, 10 + L + o.fB[0], FY - o.fB[1], true);
  // mochila con propulsor
  p.rect(4 + L, 12 + b, 4, 8, c.d); p.rect(5 + L, 13 + b, 2, 5, GUN.g1); p.px(5 + L, 13 + b, GUN.g2); p.rect(4 + L, 20 + b, 3, 2, GUN.g1); p.px(5 + L, 22 + b, '#ff9a3a');
  // torso
  p.sell(12.5 + L, 16 + b, 5.5, 4.8, C4);
  p.rect(9 + L, 18 + b, 8, 2, c.m);
  p.rect(10 + L, 13 + b, 5, 3, c.l); p.rect(10 + L, 13 + b, 5, 1, c.h); p.px(15 + L, 15 + b, c.w); p.px(16 + L, 16 + b, c.w);
  p.rect(9 + L, 20 + b, 9, 1, c.j); p.px(13 + L, 20 + b, c.acc);
  p.ell(13 + L, 17 + b, 1.3, 1.3, c.acc); p.px(13 + L, 16 + b, '#ffffff');
  leg(14 + L, 14 + L + o.fA[0], FY - o.fA[1], false);
  // casco
  p.sell(13 + L, 7 + b, 6.8, 6.3, C4);
  p.line(9 + L, 2 + b, 13 + L, 1 + b, c.h); p.px(8 + L, 3 + b, c.h);
  p.ell(15.5 + L, 8 + b, 4.6, 3.4, '#0a0a1c'); p.ell(15.6 + L, 7.5 + b, 3.9, 2.3, '#14143a');
  p.line(12 + L, 6 + b, 14 + L, 5 + b, '#6a7ad0'); p.px(12 + L, 7 + b, '#3a4680'); p.px(19 + L, 10 + b, '#2a2a60');
  const eye = o.hurt ? '#ff5a5a' : c.e, eg = o.hurt ? '#b02020' : c.eg;
  for (const ex of [14, 17]) { p.px(ex + L, 8 + b, eye); p.px(ex + 1 + L, 8 + b, eye); p.px(ex + L, 7 + b, eg); p.px(ex + 1 + L, 9 + b, eg); p.px(ex - 1 + L, 8 + b, eg); }
  p.ell(8.5 + L, 8 + b, 1.6, 2.4, c.d); p.px(8 + L, 7 + b, c.acc);
  // hombrera
  p.sell(9 + L, 13 + b, 4, 3.4, C4); p.line(7 + L, 12 + b, 10 + L, 11 + b, c.w);
  // bláster cromado
  const gy = 15 + b + (o.gy || 0), gx = 12 + L - (o.rx || 0);
  p.rect(gx, gy, 11, 4, GUN.g2); p.rect(gx, gy, 11, 1, GUN.g3); p.rect(gx, gy + 3, 11, 1, GUN.g1);
  p.rect(gx + 10, gy + 1, 2, 2, GUN.g3); p.px(gx + 11, gy + 1, GUN.g4);
  p.rect(gx + 3, gy - 2, 4, 2, GUN.g1); p.px(gx + 4, gy - 2, '#5ae8ff');
  p.rect(gx + 6, gy + 1, 3, 1, c.m); p.px(gx + 7, gy + 2, c.l);
  p.rect(gx + 2, gy + 4, 2, 2, GUN.g1);
  p.sell(13 + L - (o.rx || 0), gy + 3, 2.4, 2.2, [c.d, c.m, c.l]);
};
P.Sprites.heroClimb = function (p, f, c) {
  const a = f ? 1 : -1, C4 = [c.d, c.m, c.l, c.h];
  p.thick(10, 19, 10 - a, 26, 4, c.d); p.thick(14, 19, 14 + a, 25, 4, c.m);
  p.rect(8, 11, 9, 9, c.m); p.rect(8, 11, 1, 9, c.d); p.rect(9, 12, 7, 7, c.d); p.rect(10, 13, 5, 5, GUN.g1); p.px(11, 14, GUN.g2); p.px(12, 18, '#ff9a3a');
  p.thick(8, 12, 5, 5 + a * 2, 3, c.m); p.thick(17, 12, 20, 5 - a * 2, 3, c.m); p.sell(5, 4 + a * 2, 1.8, 1.8, C4); p.sell(20, 4 - a * 2, 1.8, 1.8, C4);
  p.sell(12.5, 7, 6, 5.6, C4); p.px(10, 4, c.h); p.px(9, 5, c.h);
  p.rect(8, 25, 4, 3, c.j); p.rect(13, 25, 4, 3, c.j);
};
P.Sprites.heroTop = function (p, dir, f, c) {
  const st = f === 1 ? 1 : f === 2 ? -1 : 0;
  if (dir === 'down' || dir === 'up') {
    p.rect(5, 15 + Math.max(0, st), 3, 4 - Math.max(0, st), c.d); p.rect(9, 15 + Math.max(0, -st), 3, 4 - Math.max(0, -st), c.d);
    p.rect(4, 9, 9, 7, c.m); p.rect(4, 9, 1, 7, c.d); p.rect(12, 9, 1, 7, c.d);
    p.sell(4, 10, 2.5, 2.3, [c.d, c.m, c.l]); p.sell(13, 10, 2.5, 2.3, [c.d, c.m, c.l]);
    if (dir === 'down') { p.rect(6, 11, 5, 2, c.l); p.px(8, 13, c.acc); p.rect(12, 12, 2, 5, GUN.g2); p.px(12, 16, GUN.g3); }
    else { p.rect(6, 10, 5, 5, c.d); p.rect(7, 11, 3, 3, GUN.g2); }
    p.sell(8.5, 6, 5, 4.8, [c.d, c.m, c.l, c.h]);
    if (dir === 'down') { p.ell(8.5, 7.2, 3.6, 2.4, '#0b0b16'); p.px(7, 7, c.e); p.px(10, 7, c.e); p.px(7, 6, c.eg); p.px(10, 6, c.eg); }
  } else {
    p.rect(6 + st, 15, 3, 4, c.d); p.rect(9 - st, 15, 3, 4, c.m);
    p.rect(4, 9, 3, 6, c.d); p.rect(6, 9, 7, 7, c.m); p.rect(6, 9, 1, 7, c.d);
    p.sell(8, 10, 2.6, 2.4, [c.d, c.m, c.l]);
    p.rect(9, 12, 7, 2, GUN.g2); p.px(15, 12, GUN.g3);
    p.sell(8.5, 6, 5, 4.8, [c.d, c.m, c.l, c.h]); p.ell(11, 6.5, 3, 2.4, '#0b0b16'); p.px(11, 6, c.e); p.px(13, 6, c.e);
  }
};

// ---------- civilizaciones ----------
P.CIV = {
  pleyadiano: { name: 'Pleyadianos', skin: '#ffe2f2', skinD: '#e0a8c8', hair: '#fff2a8', hairD: '#e8c060', cloth: '#f4faff', clothD: '#a8c0e8', acc: '#3ae890', eye: '#2ac0ff', head: 'round', hairStyle: 'long', h: 20 },
  arturiano: { name: 'Arturianos', skin: '#5aa4ff', skinD: '#2a64c8', hair: null, cloth: '#e0e8f8', clothD: '#8a9ac0', acc: '#ffc030', eye: '#101830', head: 'long', h: 22 },
  reptiliano: { name: 'Reptilianos', skin: '#46c24a', skinD: '#1e7a34', hair: '#ff9a2a', hairD: '#c0601a', cloth: '#d08a40', clothD: '#7a4a20', acc: '#ff4a2a', eye: '#ffe14a', head: 'crest', h: 21 },
  andromedano: { name: 'Andromedanos', skin: '#7a5ad8', skinD: '#4a34a0', hair: null, cloth: '#3a2a8a', clothD: '#22185a', acc: '#ff6ae0', eye: '#ffffff', head: 'hood', freckle: '#cdbcff', h: 19 },
  lemuriano: { name: 'Lemurianos', skin: '#3ae0d0', skinD: '#1a9a98', hair: '#2a7ad0', hairD: '#1a4a90', cloth: '#fff2d8', clothD: '#d0b080', acc: '#ff5a4a', eye: '#1b2b40', head: 'fin', h: 20 }
};
P.Sprites.npcSide = function (p, L, f, walk) {
  const H = L.h, top = 24 - H, b = (!walk && f === 1) ? 1 : 0;
  const ph = walk ? [[2, 0], [0, 1], [-2, 0], [0, 1]][f] : [0, 0];
  const fx = 6, by = 23;
  // piernas / túnica
  p.thick(fx - 1, by - 5, fx - 1 - ph[0] * 0.6, by, 2, L.clothD);
  p.thick(fx + 1, by - 5, fx + 1 + ph[0] * 0.6, by, 2, L.clothD);
  p.rect(fx - 3, top + 9 + b, 7, H - 13, L.cloth); p.rect(fx - 3, top + 9 + b, 1, H - 13, L.clothD);
  p.rect(fx - 4, by - 6, 9, 2, L.cloth); p.rect(fx - 3, top + 11 + b, 7, 1, L.acc);
  // brazo
  p.thick(fx, top + 10 + b, fx + 1 + (walk ? -ph[0] * 0.5 : 0), top + 15 + b, 2, L.clothD); p.px(fx + 1 + (walk ? -ph[0] * 0.5 : 0), top + 16 + b, L.skin);
  // cabeza
  const hy = top + 5 + b;
  if (L.hairStyle === 'long') { p.rect(fx - 4, hy - 2, 5, 9, L.hair); p.rect(fx - 4, hy + 4, 2, 3, L.hairD); }
  if (L.head === 'hood') p.sell(fx, hy, 4.6, 5, [L.clothD, L.cloth, L.cloth]);
  if (L.head === 'long') p.sell(fx + 0.5, hy - 1, 3.6, 5.2, [L.skinD, L.skin, P.Col.shade(L.skin, 0.25)]);
  else p.sell(fx + 0.5, hy, 3.6, 3.8, [L.skinD, L.skin, P.Col.shade(L.skin, 0.25)]);
  if (L.head === 'crest') { p.px(fx - 1, hy - 4, L.hair); p.px(fx - 2, hy - 3, L.hair); p.px(fx, hy - 5, L.hair); p.px(fx - 3, hy - 2, L.hairD); }
  if (L.head === 'fin') { p.tri(fx - 3, hy - 1, fx - 6, hy - 3, fx - 4, hy + 2, L.skinD); }
  if (L.hairStyle === 'long') { p.rect(fx - 3, hy - 4, 6, 2, L.hair); p.px(fx + 3, hy - 3, L.hair); }
  if (L.head === 'hood') { p.rect(fx - 4, hy - 4, 6, 2, L.cloth); p.px(fx + 2, hy - 1, L.freckle); p.px(fx + 3, hy + 1, L.freckle); }
  p.px(fx + 3, hy, L.eye); if (L.head === 'long') p.px(fx + 3, hy - 1, L.eye);
  if (L.head === 'crest') p.px(fx + 4, hy + 1, L.skinD);
};
P.Sprites.npcTop = function (p, L, dir, f) {
  const st = f === 1 ? 1 : f === 2 ? -1 : 0, cx = 6;
  p.rect(cx - 3, 12 + Math.max(0, st), 2, 3, L.clothD); p.rect(cx + 1, 12 + Math.max(0, -st), 2, 3, L.clothD);
  p.rect(cx - 4, 7, 8, 7, L.cloth); p.rect(cx - 4, 7, 1, 7, L.clothD); p.rect(cx - 4, 9, 8, 1, L.acc);
  const hy = 4;
  if (L.hairStyle === 'long' && dir !== 'down') p.rect(cx - 4, hy, 8, 7, L.hair);
  if (L.head === 'hood') p.sell(cx, hy, 4.6, 4.4, [L.clothD, L.cloth, L.cloth]);
  if (dir !== 'up' || !L.hair) p.sell(cx, hy + (L.head === 'long' ? -1 : 0), 3.6, L.head === 'long' ? 4.6 : 3.6, [L.skinD, L.skin, P.Col.shade(L.skin, 0.25)]);
  if (L.hairStyle === 'long') { p.rect(cx - 4, hy - 3, 8, 2, L.hair); if (dir === 'down') { p.rect(cx - 4, hy - 1, 1, 6, L.hair); p.rect(cx + 3, hy - 1, 1, 6, L.hair); } }
  if (L.head === 'crest') { p.rect(cx - 1, hy - 4, 2, 3, L.hair); }
  if (L.head === 'fin') { p.px(cx - 4, hy, L.skinD); p.px(cx + 3, hy, L.skinD); p.px(cx - 5, hy - 1, L.skinD); p.px(cx + 4, hy - 1, L.skinD); }
  if (dir === 'down') { p.px(cx - 2, hy, L.eye); p.px(cx + 1, hy, L.eye); }
  if (dir === 'side') { p.px(cx + 2, hy, L.eye); }
  if (dir === 'up' && L.head === 'hood') p.rect(cx - 3, hy - 3, 6, 6, L.clothD);
};
P.Sprites.portrait = function (p, L) {
  const cx = 16;
  p.sell(cx, 31, 12, 9, [L.clothD, L.cloth, P.Col.shade(L.cloth, 0.3)]); p.rect(cx - 9, 26, 18, 1, L.acc);
  if (L.hairStyle === 'long') { p.ell(cx, 17, 10, 12, L.hairD); p.ell(cx, 15, 9.5, 10, L.hair); }
  if (L.head === 'hood') p.sell(cx, 15, 11, 12, [L.clothD, L.cloth, P.Col.shade(L.cloth, 0.2)]);
  p.rect(cx - 2, 21, 4, 4, L.skinD);
  const long = L.head === 'long';
  p.sell(cx, long ? 12 : 14, long ? 7 : 7.5, long ? 11 : 8.5, [L.skinD, L.skin, P.Col.shade(L.skin, 0.25), P.Col.shade(L.skin, 0.45)]);
  if (L.head === 'crest') { for (let i = 0; i < 5; i++) p.tri(cx - 6 + i * 3, 7 - (i % 2) * 2, cx - 4 + i * 3, 1 + (i === 2 ? -1 : 0), cx - 2 + i * 3, 7, i % 2 ? L.hairD : L.hair); }
  if (L.head === 'fin') { p.tri(cx - 7, 12, cx - 13, 6, cx - 8, 17, L.skinD); p.tri(cx + 7, 12, cx + 13, 6, cx + 8, 17, L.skinD); p.px(cx - 10, 9, L.acc); p.px(cx + 10, 9, L.acc); }
  if (L.hairStyle === 'long') { p.ell(cx, 7, 8, 3.5, L.hair); p.rect(cx - 8, 7, 3, 9, L.hair); p.rect(cx + 6, 7, 2, 6, L.hair); }
  if (L.hair && L.head === 'fin') { p.ell(cx, 6, 7, 3, L.hair); }
  if (L.head === 'hood') { p.ell(cx, 5, 9, 4, L.cloth); for (const [fx, fy] of [[-4, 17], [4, 17], [-5, 15], [5, 16], [0, 19]]) p.px(cx + fx, fy, L.freckle); }
  const ey = long ? 14 : 15, big = L.head === 'long';
  for (const s of [-1, 1]) {
    const ex = cx + s * 3 - (s > 0 ? 1 : 0);
    if (big) { p.ell(ex + 0.5, ey, 2.2, 1.6, L.eye); p.px(ex, ey - 1, '#8ab4ff'); }
    else { p.rect(ex - 1, ey - 1, 2, 2, '#ffffff'); p.px(ex - (s > 0 ? 0 : 0), ey, L.eye); p.px(ex - 1, ey, L.eye); }
  }
  if (L.head === 'crest') { p.px(cx - 4, ey, '#000'); p.px(cx + 2, ey, '#000'); }
  p.rect(cx - 2, ey + (long ? 7 : 5), 4, 1, L.skinD);
  if (L.mark) p.px(cx, ey - 5, L.mark);
};

// retratos de los dirigentes Esqueléticos
P.Sprites.skullPortrait = function (p, who) {
  const cx = 16, bone = '#e8e2cf', boneD = '#a59d86', sock = '#140a10';
  const cl = { merek: ['#2a0c10', '#7a1622', '#c0283a'], thersek: ['#123d1c', '#2f7a34', '#4db04a'], gerselle: ['#0c0a10', '#1d1822', '#36303e'] }[who];
  p.sell(cx, 31, 13, 9, [cl[0], cl[1], cl[2]]);
  if (who === 'gerselle') { p.ell(cx, 13, 11, 10, '#140f18'); p.ell(cx + 6, 6, 4, 3, '#7a1622'); p.px(cx + 5, 5, '#c0283a'); p.px(cx + 7, 6, '#c0283a'); }
  p.sell(cx, 14, 7.5, 8.5, [boneD, bone, '#fffbea']);
  p.rect(cx - 4, 21, 8, 3, bone); for (let i = -3; i < 4; i += 2) p.px(cx + i, 22, boneD);
  p.ell(cx - 3, 14, 2.4, 2.4, sock); p.ell(cx + 3, 14, 2.4, 2.4, sock);
  const eye = { merek: '#ff3040', thersek: '#7dff5a', gerselle: '#ff4060' }[who];
  p.px(cx - 3, 14, eye); p.px(cx + 3, 14, eye); p.px(cx, 18, sock); p.px(cx - 1, 18, sock);
  if (who === 'merek') { p.tri(cx - 7, 9, cx - 13, 1, cx - 5, 6, '#c08a3a'); p.tri(cx + 7, 9, cx + 13, 1, cx + 5, 6, '#c08a3a'); p.rect(cx - 12, 24, 24, 2, '#c0283a'); }
  if (who === 'thersek') { p.rect(cx - 9, 5, 18, 3, '#2a5a2a'); p.rect(cx - 7, 2, 14, 4, '#3a7a3a'); p.px(cx, 3, '#ffd166'); for (const s of [-1, 1]) { p.thick(cx + s * 10, 26, cx + s * 15, 18, 2, '#3e4250'); p.px(cx + s * 15, 17, '#7dff5a'); } }
};

P.LOOKS = {}; // apariencias registradas (para diálogos y retratos)
P.Sprites.registerLook = function (id, L) {
  P.LOOKS[id] = L;
  P.mk('npc_' + id, 12, 24, 6, (p, i) => P.Sprites.npcSide(p, L, i < 2 ? i : i - 2, i >= 2));
  P.mk('npct_' + id, 12, 16, 9, (p, i) => P.Sprites.npcTop(p, L, ['down', 'up', 'side'][Math.floor(i / 3)], i % 3));
  P.mk('por_' + id, 32, 32, 1, p => P.Sprites.portrait(p, L));
};

// ---------- compañeros ----------
P.Sprites.luma = function (p, f) {
  const b = f === 1 ? 1 : 0, W = ['#9aa6b8', '#e9eef6', '#ffffff', '#ffffff'];
  p.sell(8, 10 + b, 6, 6.5, W);
  p.ell(8, 8 + b, 4, 3.2, '#0b0b16'); p.rect(7, 6 + b, 2, 5, '#57ff7a'); p.rect(6, 7 + b, 4, 3, '#57ff7a'); p.px(7, 7 + b, '#c8ffd0');
  p.sell(2, 12 + b, 1.8, 2, W); p.sell(14, 12 + b, 1.8, 2, W); p.px(14, 12 + b, '#57ff7a');
  p.rect(6, 16 + b, 4, 1, '#7d8798'); if (f !== 2) p.px(8, 17 + b, '#7ff8ff');
  if (f === 2) { p.px(1, 10, '#57ff7a'); p.px(15, 10, '#57ff7a'); p.px(8, 1, '#57ff7a'); }
};
P.Sprites.twin = function (p, f, blue) {
  const c = blue ? ['#14306a', '#2b5fc0', '#5e97ff', '#a8ccff'] : ['#5a0b16', '#b3202a', '#e2453f', '#ff9c86'], eye = blue ? '#7fe8ff' : '#ff6a5a';
  const off = f === 7, st = (f >= 2 && f <= 5) ? [[1, 0], [0, 1], [-1, 0], [0, 1]][f - 2] : [0, 0], b = f === 1 ? 1 : 0;
  p.rect(3 + st[0], 11, 2, 3 - st[1], c[0]); p.rect(7 - st[0], 11, 2, 3, c[0]);
  p.rect(3, 7 + b, 6, 5, c[1]); p.rect(3, 7 + b, 1, 5, c[0]); p.rect(4, 9 + b, 4, 1, '#3e4250');
  p.sell(6, 4 + b + (off ? 2 : 0), 4.4, 4, c);
  p.ell(7, 4.5 + b + (off ? 2 : 0), 3, 2, '#0b0b16');
  if (!off) { p.px(6, 4 + b, eye); p.px(8, 4 + b, eye); }
  if (blue) { p.px(4, 0 + b, '#a8ccff'); p.px(4, 1 + b, '#5e97ff'); } else { p.rect(3, 2 + b, 6, 1, c[3]); }
  const gx = f === 6 ? 7 : 6;
  if (!off) { p.rect(gx, 8 + b, 5, 2, '#5d6374'); p.px(gx + 5, 8 + b, '#a6aec0'); }
};
P.Sprites.nova = function (p, f) {
  const c = ['#8a2a5c', '#ff6fb3', '#ff9fd0', '#ffe0f0'], b = f === 1 ? 1 : 0;
  p.thick(7, 16, 6, 23, 3, c[0]); p.thick(11, 16, 12, 23, 3, c[1]); p.rect(5, 22, 4, 2, c[0]); p.rect(11, 22, 4, 2, c[0]);
  p.rect(5, 10 + b, 9, 7, c[1]); p.rect(5, 10 + b, 1, 7, c[0]); p.rect(7, 11 + b, 4, 2, c[2]); p.px(9, 14 + b, '#ffffff');
  p.ell(9, 17, 5, 1.5, c[1]);
  p.sell(9.5, 5 + b, 5.6, 5, c); p.ell(10.5, 6 + b, 3.8, 2.8, '#120a16'); p.px(9, 5 + b, '#5a3a6a');
  p.px(9, 6 + b, '#ffd6ef'); p.px(12, 6 + b, '#ffd6ef');
  p.px(8, 0 + b, '#ff3d8a'); p.px(10, 0 + b, '#ff3d8a'); p.rect(8, 1 + b, 3, 1, '#ff3d8a'); p.px(9, 2 + b, '#ff3d8a');
  p.sell(5, 11 + b, 2.6, 2.4, c);
  const up = f === 2 || f === 3;
  if (up) { p.line(15, 2, 15, 20, '#c8c8d8'); p.ell(15, 2, 2, 2, '#ff6fd0'); p.px(15, 1, '#ffffff'); p.thick(12, 11, 15, 8, 2, c[1]); }
  else { p.line(15, 6 + b, 15, 23, '#c8c8d8'); p.tri(13, 5 + b, 17, 5 + b, 15, 1 + b, '#ff6fd0'); p.px(15, 3 + b, '#ffffff'); p.thick(12, 13 + b, 15, 13 + b, 2, c[1]); }
};
P.Sprites.wolf = function (p, f) {
  const W = ['#8d97ab', '#dfe6f2', '#ffffff', '#ffffff'], A = '#a9b3c6', A2 = '#6e7890', gem = '#5ee8ff';
  const pose = ['sit', 'stand', 'run', 'run', 'run', 'run', 'bite', 'growl', 'sniff', 'lie'][f];
  const ri = f - 2;
  if (pose === 'lie') {
    p.sell(15, 15, 11, 4.5, W); p.sell(26, 14, 4.5, 3.6, W); p.tri(24, 10, 26, 6, 27, 11, W[1]); p.px(28, 14, gem); p.rect(29, 15, 2, 1, '#2a2a36');
    p.thick(4, 15, 1, 12, 2, W[1]); p.rect(14, 12, 6, 2, A); p.px(16, 12, gem); return;
  }
  if (pose === 'sit') {
    p.sell(13, 13, 7, 6, W); p.rect(8, 16, 12, 3, W[1]); p.rect(17, 12, 2, 7, W[1]); p.rect(19, 17, 3, 2, W[0]);
    p.thick(6, 16, 2, 11, 3, W[1]); p.px(2, 10, W[2]);
    p.sell(19, 7, 4.2, 4, W); p.tri(16, 5, 17, 0, 19, 4, W[1]); p.tri(19, 4, 21, 0, 22, 5, W[1]); p.px(18, 2, '#f5b8c8');
    p.rect(22, 8, 4, 2, W[1]); p.px(25, 8, '#2a2a36'); p.px(21, 6, gem); p.rect(16, 3, 5, 1, A); p.px(18, 3, gem);
    p.rect(11, 9, 6, 2, A); p.px(13, 9, gem); return;
  }
  let lift = [0, 0, 0, 0], body = 0;
  if (pose === 'run') { lift = [[2, 0, 0, 2], [1, 1, 1, 0], [0, 2, 2, 0], [1, 1, 0, 1]][ri]; body = ri % 2; }
  const by = 11 + (pose === 'growl' ? 1 : 0) + (pose === 'sniff' ? 1 : 0);
  // patas
  const legs = [[6, -1], [9, 1], [19, -1], [22, 1]];
  legs.forEach(([lx, s], i) => { const ext = pose === 'run' ? (i % 2 ? 2 : -2) * (ri < 2 ? 1 : -1) : 0; p.thick(lx, by + 3, lx + ext, 19 - lift[i], 2, i % 2 ? W[1] : W[0]); p.rect(lx + ext - 1, 18 - lift[i], 3, 1, A2); });
  p.thick(4, by, 0, by - 5 + body * 2, 3, W[1]); p.px(0, by - 6 + body * 2, W[2]);
  p.sell(14, by + body * 0.5, 10, 4.6, W);
  p.rect(10, by - 4, 9, 2, A); p.px(13, by - 4, gem); p.rect(9, by - 2, 2, 3, A2);
  const hx = pose === 'sniff' ? 25 : 24, hy = pose === 'sniff' ? by + 2 : by - 4;
  p.sell(hx, hy, 4.4, 3.8, W);
  p.tri(hx - 3, hy - 2, hx - 2, hy - 7, hx, hy - 3, W[1]); p.tri(hx, hy - 3, hx + 1, hy - 7, hx + 2, hy - 2, W[1]);
  p.rect(hx + 3, hy, 4, pose === 'bite' ? 1 : 2, W[1]); p.px(hx + 6, hy, '#2a2a36');
  if (pose === 'bite' || pose === 'growl') { p.rect(hx + 3, hy + 2, 4, 1, W[1]); p.px(hx + 4, hy + 1, '#ffffff'); p.px(hx + 6, hy + 1, '#ffffff'); p.px(hx + 5, hy + 1, '#7a1622'); }
  p.px(hx + 1, hy - 1, gem); p.rect(hx - 2, hy - 4, 4, 1, A);
};

P.Sprites.buildChars = function () {
  // protagonista: todas las skins
  const poses = [
    { fA: [1, 0], fB: [-2, 0] }, { fA: [1, 0], fB: [-2, 0], b: 1 },
    ...[[3, 0], [1, 0], [-1, 0], [-3, 1], [-1, 2], [2, 2]].map((fa, i) => { const j = (i + 3) % 6, fb = [[3, 0], [1, 0], [-1, 0], [-3, 1], [-1, 2], [2, 2]][j]; return { fA: fa, fB: fb, b: [0, 1, 1, 0, 1, 1][i], lean: 1 }; }),
    { fA: [2, 4], fB: [-3, 2] }, { fA: [2, 0], fB: [-3, 1] }, { fA: [0, 0], fB: [0, 0], crouch: 1 },
    { fA: [4, 2], fB: [-5, 3], lean: 2, b: 1 }, { fA: [1, 0], fB: [-3, 0], lean: -1, gy: 2, hurt: 1 }, { fA: [2, 0], fB: [-2, 0], gy: 2 },
    null, null, { fA: [1, 0], fB: [-2, 0], rx: 1 }, { dead: 1 }
  ];
  for (const sk in P.HERO_SKINS) {
    const c = P.HERO_SKINS[sk];
    P.mk('hero_' + sk, 24, 28, poses.length, (p, i) => { if (i === 14 || i === 15) P.Sprites.heroClimb(p, i - 14, c); else P.Sprites.hero(p, poses[i], c); });
    P.mk('herot_' + sk, 17, 20, 9, (p, i) => P.Sprites.heroTop(p, ['down', 'up', 'side'][Math.floor(i / 3)], i % 3, c));
    P.mk('heropor_' + sk, 32, 32, 1, p => {
      p.sell(16, 31, 13, 9, [c.d, c.m, c.l, c.h]); p.sell(5, 26, 5, 4, [c.d, c.m, c.l, c.h]); p.sell(27, 26, 5, 4, [c.d, c.m, c.l, c.h]);
      p.sell(16, 14, 11, 11, [c.d, c.m, c.l, c.h]); p.ell(17, 15, 8, 6, '#0b0b16'); p.ell(14, 12, 3, 1.5, '#262c48');
      for (const ex of [13, 20]) { p.rect(ex - 1, 15, 3, 1, c.eg); p.rect(ex, 14, 1, 3, c.eg); p.px(ex, 15, c.e); }
      p.rect(10, 26, 12, 1, c.acc);
    });
  }
  // civilizaciones (genéricos con variaciones)
  for (const id in P.CIV) {
    const base = P.CIV[id];
    for (let v = 0; v < 3; v++) {
      const L = Object.assign({}, base);
      if (v === 1) { L.cloth = P.Col.shade(base.cloth, -0.15); L.acc = P.Col.mix(base.acc, '#ffffff', 0.3); L.h = base.h - 1; }
      if (v === 2) { L.cloth = P.Col.mix(base.cloth, base.acc, 0.35); L.clothD = P.Col.shade(L.cloth, -0.35); L.h = base.h + 1; if (L.hair) L.hair = P.Col.shade(base.hair, -0.2); }
      P.Sprites.registerLook(id + v, L);
    }
  }
  // personajes con nombre
  P.Sprites.registerLook('sylae', Object.assign({}, P.CIV.pleyadiano, { cloth: '#d8f5e2', clothD: '#7fbf95', acc: '#3fd27a', hair: '#fff6d0', mark: '#6fe39a' }));
  P.Sprites.registerLook('kairo', Object.assign({}, P.CIV.arturiano, { cloth: '#b8c2d6', acc: '#ffb347', h: 23, mark: '#ffd166' }));
  P.Sprites.registerLook('mnemo', Object.assign({}, P.CIV.andromedano, { cloth: '#3a2a6a', acc: '#ffd166', h: 18 }));
  P.Sprites.registerLook('ssaru', Object.assign({}, P.CIV.reptiliano, { cloth: '#8a5a2a', acc: '#ff4a2a', h: 23 }));
  P.Sprites.registerLook('elara', { skin: '#7ff8ff', skinD: '#2fb8d8', hair: '#c8ffff', hairD: '#5ee8ff', cloth: '#5ee8ff', clothD: '#2a9ac8', acc: '#ffffff', eye: '#ffffff', head: 'round', hairStyle: 'long', h: 22 });
  for (const w of ['merek', 'thersek', 'gerselle']) P.mk('por_' + w, 64, 64, 1, p => P.Sprites.villainPortrait(p, w), { up: 0.08, down: 0.12, dark: 0.55 });
  // compañeros
  P.mk('luma', 16, 19, 3, (p, i) => P.Sprites.luma(p, i));
  P.mk('brasa', 13, 14, 8, (p, i) => P.Sprites.twin(p, i, false));
  P.mk('brisa', 13, 14, 8, (p, i) => P.Sprites.twin(p, i, true));
  P.mk('nova', 18, 24, 4, (p, i) => P.Sprites.nova(p, i));
  P.mk('sirio', 32, 21, 10, (p, i) => P.Sprites.wolf(p, i));
  // retratos de compañeros
  P.mk('por_luma', 32, 32, 1, p => { p.sell(16, 17, 13, 13, ['#9aa6b8', '#e9eef6', '#ffffff', '#ffffff']); p.ell(16, 14, 9, 7, '#0b0b16'); p.rect(14, 9, 4, 11, '#57ff7a'); p.rect(11, 12, 10, 4, '#57ff7a'); p.rect(15, 10, 1, 3, '#c8ffd0'); });
  P.mk('por_twins', 32, 32, 1, p => { const tw = (x, c, e) => { p.sell(x, 14, 8, 8, c); p.ell(x + 1, 15, 6, 4, '#0b0b16'); p.px(x - 1, 15, e); p.px(x + 3, 15, e); p.rect(x - 6, 24, 12, 8, c[1]); }; tw(9, ['#5a0b16', '#b3202a', '#e2453f', '#ff9c86'], '#ff6a5a'); tw(23, ['#14306a', '#2b5fc0', '#5e97ff', '#a8ccff'], '#7fe8ff'); });
  P.mk('por_nova', 32, 32, 1, p => { const c = ['#8a2a5c', '#ff6fb3', '#ff9fd0', '#ffe0f0']; p.sell(16, 31, 12, 8, c); p.sell(16, 15, 11, 11, c); p.ell(17, 16, 8, 6, '#120a16'); p.px(13, 16, '#ffd6ef'); p.px(20, 16, '#ffd6ef'); p.rect(12, 14, 2, 1, '#ff9fd0'); p.rect(19, 14, 2, 1, '#ff9fd0'); p.rect(14, 2, 2, 2, '#ff3d8a'); p.rect(17, 2, 2, 2, '#ff3d8a'); p.rect(14, 4, 5, 1, '#ff3d8a'); p.px(16, 5, '#ff3d8a'); });
  P.mk('por_sirio', 32, 32, 1, p => { const W = ['#8d97ab', '#dfe6f2', '#ffffff', '#ffffff']; p.sell(15, 19, 11, 10, W); p.tri(6, 12, 9, 0, 13, 10, W[1]); p.tri(18, 10, 22, 0, 25, 12, W[1]); p.sell(22, 22, 7, 5, W); p.px(29, 21, '#2a2a36'); p.rect(11, 15, 3, 2, '#5ee8ff'); p.rect(19, 15, 3, 2, '#5ee8ff'); p.rect(10, 8, 12, 2, '#a9b3c6'); p.px(16, 8, '#5ee8ff'); });
};
