'use strict';
// Arquitectura propia de cada planeta en los asentamientos del mapa exterior y edificios interactivos.
// Seis tipos estructuralmente distintos por mundo. Fotograma 0: dañado/apagado · 1: restaurado e iluminado.
P.ARCH = {
  verzara: { civ: 'pleyadiano', types: ['house', 'special', 'hut', 'shop', 'tower'], extra: [[-10, -1, 'lab'], [8, -2, 'hut'], [-4, 5, 'hut']] },
  khazir: { civ: 'reptiliano', types: ['house', 'special', 'hut', 'shop', 'tower'], extra: [[-14, 1, 'lab'], [11, 1, 'hut'], [4, 4, 'hut']] },
  nivorah: { civ: 'arturiano', types: ['house', 'special', 'hut', 'shop', 'tower'], extra: [[-9, -1, 'lab'], [8, -1, 'hut'], [-4, 5, 'hut']] }
};
P.ARCH_SIZE = { hut: [30, 30], house: [44, 46], tower: [28, 62], shop: [46, 36], lab: [48, 44], special: [44, 50] };
P.Sprites.buildArch = function () {
  const W = (p, x, y, w, h, lit, c) => { p.rect(x, y, w, h, lit ? c : '#1a1424'); if (lit) p.px(x, y, '#ffffff'); };
  const S = P.ARCH_SIZE;
  // ---------------- VÉRZARA · arquitectura orgánica pleyadiana ----------------
  const V = (type, f) => (p) => {
    const lit = f === 1, wood = lit ? ['#5a3a1a', '#8a5a2a', '#b8843a'] : ['#2e2228', '#4a3438', '#6a4a4a'], leaf = lit ? ['#1f7a3a', '#3ac04a', '#8af06a'] : ['#2a3a3a', '#3a4a48', '#5a6a5a'], gl = '#7dffd0';
    if (type === 'hut') { // vaina-semilla sobre zancos con techo de hoja cónico
      for (const x of [8, 22]) p.rect(x, 22, 2, 8, wood[0]); p.sell(15, 18, 11, 8, [wood[0], wood[1], wood[2], '#d8a85a']); p.tri(2, 13, 28, 13, 15, 0, leaf[1]); p.tri(2, 13, 15, 13, 15, 0, leaf[2]); p.ell(15, 19, 3.5, 4, '#1a0a0a'); W(p, 14, 17, 2, 3, lit, gl); }
    if (type === 'house') { // casa-árbol de dos pisos alrededor de un tronco
      p.rect(19, 6, 8, 40, wood[0]); p.rect(19, 6, 2, 40, wood[2]); p.sell(14, 32, 13, 10, [wood[0], wood[1], wood[2], '#e0b060']); p.sell(30, 18, 12, 9, [wood[0], wood[1], wood[2], '#e0b060']);
      p.ell(23, 4, 20, 7, leaf[0]); p.ell(20, 2, 14, 5, leaf[1]); p.ell(28, 6, 9, 3, leaf[2]); for (const [x, y] of [[10, 30], [16, 32], [28, 17], [34, 18]]) { p.ell(x, y, 2, 2, lit ? gl : '#1a1424'); } p.rect(11, 38, 5, 8, '#1a0a0a'); for (let y = 24; y < 44; y += 4) p.line(36, y, 40, y, wood[2]); }
    if (type === 'tower') { // aguja de lianas con bulbo luminoso
      for (let y = 14; y < 62; y++) { const w = 6 + Math.floor((y - 14) / 16) * 2; p.rect(14 - w / 2, y, w, 1, (y % 6 < 3) ? wood[1] : leaf[0]); } p.sell(14, 10, 9, 9, lit ? ['#1a8a6a', '#5ef0c0', '#d8fff0', '#ffffff'] : ['#2a2a3a', '#4a4a5a', '#6a6a7a']); for (const y of [26, 40, 52]) W(p, 12, y, 3, 3, lit, '#ffd166'); p.rect(11, 56, 6, 6, '#1a0a0a'); }
    if (type === 'shop') { // mercado de flores: toldo de pétalos gigantes y cestas
      p.rect(4, 18, 38, 18, wood[1]); p.rect(4, 18, 38, 2, wood[2]); for (let i = 0; i < 5; i++) { const x = 4 + i * 8; p.sell(x + 4, 12, 5, 6, lit ? (i % 2 ? ['#a0205a', '#ff5a9a', '#ffb0d0'] : ['#a0602a', '#ffb030', '#ffe0a0']) : ['#3a2a3a', '#5a3a4a', '#6a4a5a']); }
      for (const x of [10, 22, 34]) { p.sell(x, 28, 4, 3, [wood[0], wood[1], wood[2]]); p.px(x - 1, 26, lit ? '#ff5a5a' : '#3a2a2a'); p.px(x + 1, 26, lit ? '#ffd166' : '#3a2a2a'); } p.rect(2, 34, 42, 2, wood[0]); }
    if (type === 'lab') { // invernadero de cúpula de vidrio con plantas dentro
      p.rect(2, 34, 44, 10, wood[1]); p.sell(24, 34, 21, 22, lit ? ['#3a7a8a', '#7ac8d8', '#c8f4ff', '#ffffff'] : ['#2a2a3a', '#3a3a4a', '#4a4a5a', '#5a5a6a']); for (let k = -2; k <= 2; k++) p.line(24 + k * 8, 14 + Math.abs(k) * 3, 24 + k * 10, 34, wood[0]); p.line(4, 26, 44, 26, wood[0]);
      for (const x of [14, 24, 34]) { p.line(x, 34, x, 24, leaf[1]); p.ell(x, 23, 3, 2, leaf[2]); } p.rect(21, 36, 6, 8, '#1a0a0a'); }
    if (type === 'special') { // santuario-archivo: arco de piedra con cristal suspendido
      p.rect(4, 44, 36, 6, '#8a90b8'); p.rect(6, 14, 8, 30, '#b8c2dc'); p.rect(30, 14, 8, 30, '#b8c2dc'); p.rect(6, 14, 2, 30, '#f4fbff'); for (let k = 0; k <= 16; k++) { const a = Math.PI * k / 16; p.thick(22 - Math.cos(a) * 12, 16 - Math.sin(a) * 12, 22 - Math.cos(a) * 12, 16 - Math.sin(a) * 12, 4, '#b8c2dc'); }
      p.tri(18, 28, 26, 28, 22, 16, lit ? '#3ae0a0' : '#4a3a6a'); p.tri(18, 28, 26, 28, 22, 38, lit ? '#1a9a6a' : '#3a2a5a'); p.px(21, 24, '#ffffff'); p.rect(4, 44, 36, 1, '#e8a020'); }
  };
  // ---------------- KHAZIR · adobe, arenisca y bronce del Clan Solar ----------------
  const K = (type, f) => (p) => {
    const lit = f === 1, ad = lit ? ['#a8622e', '#d8964a', '#f4c47a', '#fff0c8'] : ['#4a2a2a', '#6a3a34', '#8a5048', '#a06a5a'], tq = lit ? '#2ad8c0' : '#3a2a3a', gl = '#ffd166';
    if (type === 'hut') { p.sell(15, 22, 13, 9, ad); p.rect(2, 22, 26, 8, ad[1]); p.rect(12, 22, 6, 8, '#2a140a'); p.rect(12, 22, 6, 1, tq); W(p, 5, 20, 3, 2, lit, gl); }
    if (type === 'house') { // dos volúmenes escalonados de techo plano con vigas y escalera exterior
      p.rect(2, 22, 40, 24, ad[1]); p.rect(2, 22, 40, 2, ad[3]); p.rect(14, 6, 26, 16, ad[2]); p.rect(14, 6, 26, 2, ad[3]); for (const x of [4, 12, 18, 26, 34]) p.rect(x, x < 14 ? 20 : 4, 2, 2, '#5a3418');
      for (let k = 0; k < 6; k++) p.rect(4 + k * 2, 44 - k * 4, 3, 2, ad[0]); W(p, 20, 12, 4, 4, lit, gl); W(p, 30, 12, 4, 4, lit, gl); W(p, 26, 30, 4, 4, lit, gl); p.rect(32, 34, 7, 12, '#2a140a'); p.rect(32, 34, 7, 1, tq); }
    if (type === 'tower') { // torre de viento con rejillas
      p.rect(5, 12, 18, 50, ad[1]); p.rect(5, 12, 3, 50, ad[3]); p.rect(3, 8, 22, 5, ad[2]); for (const y of [16, 22]) for (let x = 7; x < 21; x += 3) p.rect(x, y, 2, 4, '#2a140a'); W(p, 12, 34, 4, 5, lit, gl); W(p, 12, 46, 4, 5, lit, gl); p.rect(10, 54, 8, 8, '#2a140a'); p.px(14, 6, tq); }
    if (type === 'shop') { // bazar: tienda de lona a rayas con tinajas
      p.tri(0, 16, 46, 16, 23, 0, lit ? '#e05a3a' : '#5a2a2a'); for (let x = 4; x < 44; x += 8) p.tri(x, 16, x + 4, 16, 23, 0, lit ? '#ffe0a0' : '#6a4a4a'); p.rect(4, 16, 38, 20, ad[1]); p.rect(4, 16, 38, 2, ad[3]);
      for (const x of [10, 20, 32]) { p.sell(x, 31, 4, 5, ['#7a3a1a', '#c8743a', '#f0a860']); p.rect(x - 4, 30, 8, 1, tq); } W(p, 24, 22, 5, 3, lit, gl); }
    if (type === 'lab') { // forja del clan: chimenea, yunque y brasas
      p.rect(2, 20, 44, 24, ad[1]); p.rect(2, 20, 44, 2, ad[3]); p.rect(32, 2, 10, 20, ad[0]); p.rect(32, 2, 10, 2, ad[2]); if (lit) for (let k = 0; k < 4; k++) p.ell(37 + k, 0 + k * 0, 2, 1.5, '#d8c8b8');
      p.rect(8, 26, 18, 14, '#2a140a'); p.ell(17, 34, 6, 3, lit ? '#ff8a2a' : '#4a1a0a'); p.ell(17, 34, 3, 1.5, lit ? '#fff0a0' : '#5a2a1a'); p.rect(30, 34, 10, 4, '#3a3a4a'); p.rect(32, 38, 6, 6, '#2a2a3a'); }
    if (type === 'special') { // pequeño zigurat-santuario con ojo turquesa
      for (let k = 0; k < 4; k++) p.rect(4 + k * 5, 42 - k * 10, 36 - k * 10, 10, k % 2 ? ad[2] : ad[1]); p.rect(4, 42, 36, 1, ad[3]); p.ell(22, 18, 4, 3, '#5a3418'); p.ell(22, 18, 2.5, 2, tq); p.px(21, 17, '#ffffff'); p.rect(18, 42, 8, 8, '#2a140a'); p.tri(19, 6, 25, 6, 22, 0, lit ? gl : ad[0]); }
  };
  // ---------------- NÍVORAH · módulos y cúpulas arturianas ----------------
  const N = (type, f) => (p) => {
    const lit = f === 1, wh = lit ? ['#8aa8c8', '#c4dcf0', '#eef6ff', '#ffffff'] : ['#3a3a52', '#5a5a74', '#7a7a98', '#9a9ab8'], cy = lit ? '#5ef0ff' : '#3a2a5a', gl = '#ffd166';
    if (type === 'hut') { p.sell(15, 24, 13, 9, wh); p.rect(2, 24, 26, 6, wh[1]); for (let k = 0; k < 2; k++) p.line(5 + k * 3, 18 + k * 3, 25 - k * 3, 18 + k * 3, wh[0]); p.sell(15, 26, 5, 4, [wh[0], wh[1], wh[2]]); p.rect(13, 26, 4, 4, '#1a2a4a'); }
    if (type === 'house') { // módulos habitables apilados en cápsula
      p.rect(2, 26, 40, 20, wh[1]); p.ell(2, 36, 4, 10, wh[0]); p.ell(42, 36, 4, 10, wh[2]); p.rect(10, 8, 28, 18, wh[2]); p.ell(10, 17, 4, 9, wh[1]); p.ell(38, 17, 4, 9, wh[3]);
      for (const [x, y] of [[16, 16], [26, 16], [10, 34], [22, 34]]) { p.ell(x, y, 3, 3, wh[0]); p.ell(x, y, 2, 2, lit ? gl : '#1a1a2a'); } p.rect(32, 34, 6, 12, '#1a2a4a'); p.rect(20, 4, 2, 5, '#8a98bc'); p.px(21, 3, cy); }
    if (type === 'tower') { // torre-observatorio con cúpula y ranura de telescopio
      p.rect(7, 22, 14, 40, wh[1]); p.rect(7, 22, 3, 40, wh[3]); p.sell(14, 20, 11, 10, wh); p.rect(13, 10, 3, 12, '#1a2a4a'); p.line(14, 12, 24, 4, '#8a98bc'); W(p, 12, 34, 4, 4, lit, gl); W(p, 12, 46, 4, 4, lit, gl); p.rect(10, 54, 8, 8, '#1a2a4a'); }
    if (type === 'shop') { // puesto comercial con letrero luminoso y cajas
      p.rect(4, 14, 38, 22, wh[1]); p.rect(4, 14, 38, 3, wh[3]); p.rect(10, 6, 26, 7, '#2a3a5a'); for (let x = 12; x < 34; x += 4) p.rect(x, 8, 2, 3, lit ? '#ff8ad8' : '#3a2a4a'); p.rect(10, 22, 18, 10, '#1a2a4a'); if (lit) p.rect(11, 23, 16, 8, '#ffd166');
      for (const x of [32, 38]) { p.rect(x - 3, 28, 6, 6, '#6a4a3a'); p.rect(x - 3, 28, 6, 1, '#9a7a5a'); } }
    if (type === 'lab') { // laboratorio con antena parabólica
      p.rect(2, 22, 44, 22, wh[1]); p.rect(2, 22, 44, 3, wh[3]); for (let x = 6; x < 42; x += 8) W(p, x, 30, 5, 4, lit, cy); p.rect(30, 34, 8, 10, '#1a2a4a');
      p.ell(14, 12, 10, 5, '#8a98bc'); p.ell(14, 11, 8, 3.5, '#c8d4e8'); p.line(14, 12, 14, 22, '#8a98bc'); p.line(14, 11, 20, 3, '#8a98bc'); p.px(20, 2, cy); p.rect(38, 8, 2, 14, '#8a98bc'); p.px(39, 7, '#ff3050'); }
    if (type === 'special') { // faro de aurora / centro médico
      p.rect(8, 30, 28, 20, wh[1]); p.rect(8, 30, 28, 3, wh[3]); p.rect(19, 6, 6, 24, wh[2]); p.ell(22, 6, 7, 4, wh[1]); p.ell(22, 4, 4, 3, lit ? '#5ef0c0' : '#3a2a5a');
      p.rect(19, 36, 6, 2, lit ? '#ff5a6a' : '#4a2a3a'); p.rect(21, 34, 2, 6, lit ? '#ff5a6a' : '#4a2a3a'); p.rect(12, 42, 6, 8, '#1a2a4a'); if (lit) for (let x = 0; x < 44; x++) p.px(x, 2 + Math.round(Math.sin(x * 0.3) * 1.5), x % 3 ? '#5ef0c0' : '#b48cff'); }
  };
  for (const [pre, fn] of [['', V], ['kz_', K], ['nv_', N]]) for (const t in S) P.mk(pre + 'b_' + t, S[t][0], S[t][1], 2, (p, f) => fn(t, f)(p), { up: 0.1, down: 0.16, dark: 0.5 });
};
(function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildArch(); }; })();

// ---------------- funciones reales de los edificios ----------------
P.ARCH_ACT = {
  special: { name: 'Archivo del asentamiento', verb: 'Consultar el Archivo Biológico', fn: sc => { const ui = new P.CodexUI(); const i = P.D.PLANETS.findIndex(p => p.id === sc.planet); if (i >= 0) ui.pi = i; P.openUI(ui); } },
  lab: { name: 'Centro de investigación', verb: 'Mejorar habilidades', fn: sc => { if (P.State.data.rooms.laboratorio) P.openUI(new P.SkillUI()); else sc.bldTalk('Los investigadores aún no tienen dónde instalar tus mejoras. Libera el segundo territorio de VÉRZARA para reactivar el Laboratorio de la nave.'); } },
  shop: { name: 'Taller local', verb: 'Fabricar y reparar', fn: sc => { if (P.State.data.rooms.taller) P.openUI(new P.WorkshopUI()); else sc.bldTalk('Sin el Taller de la nave no podemos compartir planos. Libera un territorio para reactivarlo.'); } },
  tower: { name: 'Tablón de misiones', verb: 'Ver misiones', fn: () => P.openUI(new P.MissionsUI()) },
  house: { name: 'Casa del consejo', verb: 'Hablar', fn: sc => sc.elderTalk() },
  hut: { name: 'Almacén comunal', verb: 'Pedir provisiones', fn: sc => sc.storeTalk() }
};
(function () {
  const OW = P.OverworldScene.prototype, baseBuild = OW.build, baseUpdate = OW.update, baseDrawObj = OW.drawObj;
  OW.build = function () {
    baseBuild.call(this);
    const A = P.ARCH[this.planet]; if (!A) return;
    const d = this.def, [vx, vy] = d.village;
    // las casas existentes pasan a ser edificios de distintos tipos
    for (const o of this.obj) if (o.k === 'house') { o.k = 'bld'; o.type = A.types[o.i % A.types.length]; }
    // edificios adicionales solo donde el terreno está libre
    let n = 5;
    for (const [dx, dy, type] of A.extra) {
      const bx = vx + dx, by = vy + dy; let ok = true;
      const treeAt = (xx, yy) => this.obj.find(o => o.k === 'tree' && Math.floor((o.x + 8) / 16) === xx && Math.floor((o.y - 16) / 16) === yy);
      for (let yy = by; yy <= by + 2 && ok; yy++) for (let xx = bx; xx <= bx + 2; xx++) { if (!this.g[yy] || this.g[yy][xx] !== 'g' || (this.block[yy][xx] && !treeAt(xx, yy))) { ok = false; break; } }
      if (ok) for (let yy = by; yy <= by + 2; yy++) for (let xx = bx; xx <= bx + 2; xx++) { const tr = treeAt(xx, yy); if (tr) { this.obj.splice(this.obj.indexOf(tr), 1); this.block[yy][xx] = 0; } }
      for (const p of d.portals) if (Math.abs(p[0] - bx) < 5 && Math.abs(p[1] - by) < 5) ok = false;
      if (!ok) continue;
      this.obj.push({ k: 'bld', type, x: bx * 16 - 6, y: by * 16 + 22, i: n++ });
      for (let yy = by; yy < by + 2; yy++) for (let xx = bx; xx < bx + 3; xx++) this.block[yy][xx] = 1;
    }
    for (const o of this.obj) if (o.k === 'bld') { o.act = P.ARCH_ACT[o.type]; o.dx = o.x + 22; o.dy = o.y + 4; }
  };
  OW.bldTalk = function (text) { const A = P.ARCH[this.planet], look = A.civ + '1'; P.openUI(new P.Dialog([[look, text, P.CIV[A.civ].name.replace(/s$/, '')]])); };
  // información real del planeta: progreso, próximo territorio y objetos pendientes
  OW.elderTalk = function () {
    const S = P.State, pid = this.planet, pd = P.D.planet(pid), lib = S.liberated(pid), lv = P.LV[pid].levels, next = lv.find(l => !S.lvDone(pid, l.id));
    let missing = 0; for (const l of lv) if (S.lvDone(pid, l.id) && l.stars) missing += l.stars.filter((s, i) => !S.lvState(pid, l.id).stars['s' + i]).length;
    const lines = [lib >= 10 ? pd.name + ' respira de nuevo gracias a ti, {N}. Nuestros hijos crecerán bajo un cielo limpio.' : 'Has liberado ' + lib + ' de 10 territorios de ' + pd.name + '.'];
    if (next) lines.push(next.id === 11 ? 'Solo queda ' + (pd.lair || 'la guarida') + '. ' + P.D.BOSSES[pd.boss].name + ' te espera.' : 'El siguiente territorio es «' + next.name + '»: ' + next.sub.toLowerCase() + '.');
    lines.push(missing ? 'Los exploradores dicen que aún quedan ' + missing + ' objetos ocultos en los territorios que ya liberaste.' : 'No queda nada oculto en los territorios liberados. Buen trabajo.');
    lines.push('El Archivo de ' + pd.name + ' está al ' + Math.round(S.planetCodex(pid) * 100) + ' %.');
    const A = P.ARCH[this.planet], look = A.civ + '0'; P.openUI(new P.Dialog(lines.map(t => [look, t, 'Consejo de ' + pd.name])));
  };
  // recompensa única del almacén al liberar la mitad del planeta
  OW.storeTalk = function () {
    const S = P.State, k = 'store_' + this.planet, lib = S.liberated(this.planet);
    if (S.data.flags[k]) return this.bldTalk('Las provisiones ya son tuyas, {N}. Que te sirvan bien.');
    if (lib < 5) return this.bldTalk('El almacén está vacío por culpa de las extractoras. Libera ' + (5 - lib) + ' territorio(s) más y lo llenaremos para ti.');
    S.data.flags[k] = true; S.addRes('crys', 4); S.addRes('bio', 10); S.addRes('scrap', 8); P.Audio.sfx('unlock');
    P.toast('Provisiones: +4 Cristal solar · +10 Biomasa · +8 Chatarra', { col: P.UIC.gold, icon: 'i_crys', life: 220 });
    this.bldTalk('Hemos llenado el almacén gracias a ti. Toma: cristales, biomasa y chatarra para tu nave.');
  };
  OW.update = function () {
    baseUpdate.call(this);
    if (P.ui.length || P.scene !== this) return;
    if (!this.focus) { let best = null, bd = 26; for (const o of this.obj) if (o.k === 'bld' && o.act) { const dd = Math.hypot(o.dx - this.pl.x, o.dy - this.pl.y); if (dd < bd) { bd = dd; best = o; } } if (best) this.focus = { k: 'bld', o: best }; }
    if (this.focus && this.focus.k === 'bld' && (P.input.pressed('interact') || P.input.pressed('confirm'))) { P.Audio.sfx('select'); this.focus.o.act.fn(this); }
  };
  OW.drawObj = function (c, o, cx, cy) {
    if (o.k !== 'bld') return baseDrawObj.call(this, c, o, cx, cy);
    const sz = P.ARCH_SIZE[o.type], lit = P.State.liberated(this.planet) > o.i + 3, X = Math.round(o.x + 22 - sz[0] / 2 - cx), Y = Math.round(o.y - sz[1] - cy);
    c.fillStyle = 'rgba(8,4,20,0.28)'; c.beginPath(); c.ellipse(X + sz[0] / 2 + 3, o.y - cy - 1, sz[0] * 0.55, 4, 0, 0, 7); c.fill();
    P.spr(c, 'b_' + o.type, lit ? 1 : 0, X, Y); o.lit = lit;
    if (lit) P.drawGlow(c, X + sz[0] / 2, Y + sz[1] * 0.55, sz[0] * 0.45, '#ffd890', 0.16 + Math.sin(this.t * 0.03 + o.i) * 0.04);
    if (o.act) { const bob = Math.round(Math.sin(this.t * 0.08 + o.i) * 1.5), f = this.focus && this.focus.o === o; P.txt(c, '◆', X + sz[0] / 2 - 2, Y - 9 + bob, f ? '#ffffff' : '#ffd166'); }
  };
})();
