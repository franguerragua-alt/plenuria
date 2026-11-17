'use strict';
// LA ESFERA DE DYSON — datos, acceso desde el mapa galáctico, fondos compuestos por nivel, legiones y mecánicas del
// Dominio Exterior (impactos orbitales, barreras láser, prensas, nodos de energía, puentes de luz, plataformas de carga).
// La Esfera no se añade a la lista de los nueve planetas (muchas pantallas cuentan exactamente nueve): tiene su propia
// entrada, P.D.DYSON, que P.D.planet() también devuelve.
(function () {
  const D = P.D, T = 'dyson', C = P.DSC, TSZ = 16;
  D.DYSON = { id: T, name: 'ESFERA DE DYSON', desc: 'Megaestructura', title: 'El corazón del régimen', civ: 'andromedano', col: ['#1e2432', '#ff2a4a', '#ffd166'], ready: true, boss: 'merek', lair: 'el Trono del Imperio',
    info: 'Megaestructura de los Esqueléticos alrededor de la estrella Plenuria. El Dominio Exterior, el Corazón Tecnológico y el Imperio Esquelético protegen el Trono de MEREK.',
    unlocked: () => P.settings.dev || P.D.PLANETS.every(p => P.State.data.planets[p.id] && P.State.data.planets[p.id].boss) };
  const basePlanet = D.planet; D.planet = id => basePlanet(id) || (id === T ? D.DYSON : undefined);
  D.BOSSES.nemesis = { name: 'NÉMESIS', title: 'La Unidad Oscura', planet: T, col: '#ff2a4a', col2: '#ffd166', music: 'nemesis' };

  // ---------- registros y memorias del Área I ----------
  Object.assign(D.HOLOS, {
    h73: { title: 'Orden de defensa · Muelles', text: 'Toda nave no registrada será derribada. Toda nave registrada será inspeccionada. Toda inspección termina en derribo.' },
    h74: { title: 'Bitácora de un artillero', text: 'Los cañones apuntan hacia fuera. Nadie me ha explicado nunca qué esperamos que venga de fuera.' },
    h75: { title: 'Ficha técnica · Protocolo NÉMESIS', text: 'Unidad de contención basada en el diseño K. Núcleo ALBA invertido. Objetivo: anular a la unidad K-7. Autorizado: Presidente Merek.' },
    h76: { title: 'Mensaje de N-0', text: '«Siete, NÉMESIS no es una copia tuya. Es lo que el régimen cree que eres. No te pareces en nada.»' }
  });
  Object.assign(D.MISSIONS, {
    s_ecos_d: { count: d => ['h73', 'h74', 'h75', 'h76'].filter(h => d.holos[h]).length, name: 'Ecos de la Esfera', giver: 'ELARA', desc: 'Recupera los registros holográficos del régimen ocultos en la Esfera de Dyson.', goal: 4, reward: { xp: 400, crys: 4 } }
  });
  D.ACHIEVEMENTS.push({ id: 'nemesis', name: 'Frente al espejo', desc: 'Derrota a NÉMESIS.' });
  D.SPECIES.push({ id: 'caminante_asedio', col: 'fauna', planet: T, variant: 'cibernética', spr: 'ds_krazith_alfa', name: 'Caminante de Asedio', sci: 'Máquina de guerra del régimen', rarity: 'rara', habitat: 'Forja de la Legión.', behavior: 'Bípedo blindado con cañón dorsal.', diet: 'Ninguna.', abilities: 'Embestida y fuego de cobertura.', danger: 4, eco: 'Ninguno.', lore: 'Los legionarios lo llaman «el yunque».', tasks: ['seen', { k: 'defeat', n: 1 }] });
  P.HERO_SKINS.nemesis = { name: 'Armadura Némesis', d: '#0a0a10', m: '#1e1e2c', l: '#ff2a4a', h: '#ff8a9a', j: '#040406', e: '#ffffff', eg: '#ff2a4a', acc: '#ffd166', w: '#ffffff' };
  P.SUIT_STYLE.nemesis = 'storm';
  D.BOSS_OUTRO.nemesis = { skin: 'nemesis', lines: [['elara', 'NÉMESIS se detiene. Su núcleo ALBA se apaga despacio.'], ['nemesis', 'Me hicieron… para ser tú. Sin dudas. Sin recuerdos.'], ['nemesis', 'Pero tú… tienes algo dentro… que ellos no supieron copiar.'], ['hero', '¿El qué?'], ['nemesis', 'Pregúntale… a Merek… quién te puso… el nombre…'], ['elara', 'Se ha apagado, {N}. He recuperado su blindaje: puedes vestirlo en el Arsenal.']] };
  D.POST_BOSS.nemesis = [['thersek', '¡NÉMESIS! Once ciclos de trabajo… y la rompe en un día.'], ['gerselle', 'Te lo dije, Thersek. Las copias nunca están a la altura del original.'], ['merek', 'Cuidado con lo que dices, Gerselle. El original no sabe lo que es.'], ['merek', 'Que siga bajando, {N}. El Corazón Tecnológico es de Thersek. Que te enseñe sus juguetes.']];
  D.FIRST_CLEAR = D.FIRST_CLEAR || {};
  D.FIRST_CLEAR.dyson = (S, id) => { if (id === 2) S.startMission('s_ecos_d'); if (id === 5) S.ach('nemesis'); };
  P.SPEAKERS.nemesis = { name: 'NÉMESIS', por: 'por_nemesis', col: '#ff2a4a', tx: true };

  // ---------- música (Área I y superficie) ----------
  Object.assign(P.Audio.TRACKS, {
    dyson_ow: { bpm: 76, root: 41, scale: [0, 2, 3, 5, 7, 8, 10], prog: [0, 5, 3, 4], lead: 'triangle', bass: 'sawtooth', arp: 'square', drums: 0, pad: true, seed: 1011 },
    dyson_a: { bpm: 112, root: 40, scale: [0, 1, 3, 5, 7, 8, 10], prog: [0, 1, 5, 6], lead: 'square', bass: 'sawtooth', arp: 'square', drums: 2, pad: true, seed: 1021 },
    dyson_a2: { bpm: 120, root: 42, scale: [0, 2, 3, 5, 7, 8, 11], prog: [0, 4, 5, 3], lead: 'sawtooth', bass: 'sawtooth', arp: 'square', drums: 2, pad: true, seed: 1023 },
    dyson_a3: { bpm: 104, root: 38, scale: [0, 1, 3, 5, 6, 8, 10], prog: [0, 6, 5, 1], lead: 'square', bass: 'sawtooth', arp: 'sawtooth', drums: 2, pad: true, seed: 1027 },
    galactic: { bpm: 96, root: 43, scale: [0, 2, 3, 5, 7, 8, 10], prog: [0, 5, 3, 4], lead: 'sawtooth', bass: 'sawtooth', arp: 'triangle', drums: 2, pad: true, seed: 1041, motif: [0, null, 4, null, 3, 2, 4, null] },
    galactic_2: { bpm: 118, root: 45, scale: [0, 2, 3, 5, 7, 8, 11], prog: [0, 3, 5, 4], lead: 'sawtooth', bass: 'sawtooth', arp: 'square', drums: 2, pad: true, seed: 1043, motif: [0, null, 4, null, 3, 2, 4, null] },
    galactic_3: { bpm: 136, root: 46, scale: [0, 1, 3, 5, 7, 8, 10], prog: [0, 6, 5, 4], lead: 'sawtooth', bass: 'square', arp: 'sawtooth', drums: 2, pad: true, seed: 1047, motif: [0, null, 4, null, 3, 2, 4, null] },
    nemesis: { bpm: 140, root: 40, scale: [0, 1, 3, 5, 7, 8, 10], prog: [0, 5, 1, 4], lead: 'sawtooth', bass: 'square', arp: 'sawtooth', drums: 2, pad: true, seed: 1031, motif: [0, 0, 3, null, 0, 0, 4, 3] }
  });

  // ---------- luz, ambiente y fondo compuesto ----------
  P.FX.GR.dyson = { bloomMul: 1.1, day: ['#9ab4ff', '#060814', 0.24], golden: ['#ffb08a', '#140608', 0.28], dusk: ['#ff6a7a', '#040208', 0.3], cave: ['#ff6a7a', '#040208', 0.32], deep: ['#ff6a7a', '#040208', 0.34], sun: [240, 30], fog: '#3a2a4a', rays: '255,200,180' };
  const UA = P.ART.umbrelia;
  Object.assign(P.ART.dyson, {
    civs: ['arturiano', 'pleyadiano', 'reptiliano', 'andromedano', 'lemuriano'], rigidTrees: [0, 1], treeVariants: [0, 1],
    stone: ['#1e1a22', '#ffd166', '#0c0a0e', '#ff2a4a', '#f4eedc'], strata: ['rgba(255,42,74,0.05)', 'rgba(0,0,0,0)', 'rgba(0,0,10,0.18)', 'rgba(0,0,0,0)', 'rgba(255,209,102,0.04)', 'rgba(0,0,10,0.12)'],
    postMap(L) { L.umDark = []; L.darkK = 0; },
    // cada nivel compone su fondo: cielo + planos con parallax propio + efectos animados entre planos
    drawBG(L, c, cx, cy, rf) {
      const S = P.DS.set(L.def.bg || 'dock'), vy = L.H - P.H - cy;
      c.drawImage(S.sky, 0, Math.round(vy * 0.03)); if (S.fx) S.fx(L, c, cx, vy, 0);
      S.L.forEach((ly, i) => { const im = ly.im, w = im.width, off = -((cx * ly.par) % w); for (let x = off - (off > 0 ? w : 0); x < P.W; x += w) c.drawImage(im, Math.round(x), Math.round(vy * ly.par + ly.y)); if (S.fx) S.fx(L, c, cx, vy, i + 1); });
      c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    },
    ambient(L, cx, cy, rf) { if (L.t % 6 === 0) L.parts.add({ x: cx + P.rand(0, P.W), y: cy + P.rand(0, P.H), vx: P.rand(-0.15, 0.15), vy: -P.rand(0.05, 0.2), life: 160, col: P.pick(['#8a96b4', '#ff8a9a', '#5e6a86']), size: 1 }); return true; },
    lights(L, cx, cy) { UA.lights(L, cx, cy); },
    drawTile(L, c, ch, X0, Y0, tx, ty, st) { if (ch === 'G') { P.spr(c, 't_gate', (L.t >> 5) % 2, X0, Y0); P.drawGlow(c, X0 + 8, Y0 + 8, 8, '#ff2a4a', 0.18); } },
    levelDraw(L, c) { UA.levelDraw(L, c); if ((L.aeFlash || 0) > 0.02) { c.globalCompositeOperation = 'lighter'; c.fillStyle = 'rgba(255,120,140,' + (L.aeFlash * 0.18).toFixed(3) + ')'; c.fillRect(0, 0, P.W, P.H); c.globalCompositeOperation = 'source-over'; L.aeFlash *= 0.85; } },
    owDraw(sc, c) { for (let i = 0; i < 16; i++) { const x = ((i * 131 + sc.t * 0.3) % (P.W + 20)) - 10, y = (i * 47) % P.H, a = (Math.sin(sc.t * 0.05 + i) + 1) / 2; c.fillStyle = 'rgba(' + (i % 3 ? '255,90,110,' : '90,224,255,') + (0.2 + a * 0.5) + ')'; c.fillRect(Math.round(x), Math.round(y), 1, 1); } }
  });
  P.LANDMARKS.dyson = []; P.PROPS.dyson = []; P.ARCH.dyson = { civ: 'andromedano', types: ['house', 'special', 'hut', 'shop', 'tower'], extra: [[-10, -1, 'lab'], [9, -1, 'hut']] };

  // ---------- mecánicas del Dominio Exterior ----------
  // Impacto orbital (W): un círculo rojo marca el suelo, la mira se cierra y cae un rayo de los cañones
  P.OrbitalStrike = class extends P.Ent {
    constructor(L, x, y) { super(L, x - 14, y - 8, 28, 8); this.ph = (x * 7) % 220; }
    get ct() { return (this.L.t + this.ph) % 220; }
    update() { this.t++; const L = this.L, p = L.player, ct = this.ct;
      if (ct === 120) P.Audio.sfx('charge');
      if (ct === 180) { P.Audio.sfx('bigexplode'); P.shake(4, 12); L.aeFlash = 0.6; L.fx.push({ k: 'ring', x: this.cx, y: this.y + 6, t: 0, life: 22, r: 50, col: '#ff2a4a' }); L.parts.burst(this.cx, this.y + 6, 18, { col: P.pick(['#ffffff', '#ff8a9a', '#ff2a4a', '#ffd166']), smin: 1, smax: 4, g: 0.15, size: 2, glow: 3 }); }
      if (ct >= 180 && ct < 194 && !p.dead && Math.abs(p.cx - this.cx) < 18 && p.y + p.h > this.y - 90) p.hurt(16, this.cx, { env: true }); }
    umLight() { const ct = this.ct; return ct >= 120 && ct < 196 ? [this.cx, this.y - 10, ct >= 180 ? 120 : 40, 1] : null; }
    draw(c, cx, cy) { const x = Math.round(this.cx - cx), y = Math.round(this.y - cy) + 8, ct = this.ct;
      if (ct >= 120 && ct < 180) { const k = (ct - 120) / 60, r = Math.round(20 - k * 12); c.globalAlpha = 0.4 + k * 0.5; c.strokeStyle = '#ff2a4a'; c.beginPath(); c.ellipse(x, y - 1, r + 2, 3, 0, 0, 6.3); c.stroke(); c.fillStyle = '#ffffff'; c.fillRect(x - r, y - 1, 2, 1); c.fillRect(x + r - 1, y - 1, 2, 1); c.globalAlpha = 1; P.drawGlow(c, x, y - 4, 8 + k * 16, '#ff2a4a', 0.3 + k * 0.4); }
      if (ct >= 180 && ct < 196) { const w = 14 - Math.abs(ct - 184); P.Energy.laser(c, x, -Math.round(cy) % 40 - 20, x, y - 1, this.t, '#ff2a4a', Math.max(2, w)); P.drawGlow(c, x, y - 12, 50, '#ff8a9a', 0.8); } }
  };
  // Barrera láser (V): haz vertical que se apaga un momento; parpadea antes de volver
  P.LaserGate = class extends P.Ent {
    constructor(L, x, y, m) { super(L, x - 3, 0, 6, 0); const tx = m.x; let top = m.y; while (top > 0 && L.coll(tx, top - 1) !== 1 && m.y - top < 8) top--; this.y0 = top * TSZ; this.y1 = (m.y + 1) * TSZ; this.y = this.y0; this.h = this.y1 - this.y0; this.ph = (m.x * 23) % 190; }
    get ct() { return (this.L.t + this.ph) % 190; }
    get on() { const t = this.ct; return t < 110 || (t >= 160 && (t >> 2) % 2 === 0) || t >= 176; }
    update() { this.t++; const p = this.L.player, ct = this.ct, lethal = ct < 110 || ct >= 176; if (lethal && !p.dead && P.overlap(this, p)) p.hurt(12, this.cx, { env: true }); }
    umLight() { return this.on ? [this.cx, this.y0 + this.h / 2, 50, 0.9] : null; }
    draw(c, cx, cy) { const x = Math.round(this.cx - cx), y0 = Math.round(this.y0 - cy), y1 = Math.round(this.y1 - cy), ct = this.ct, lethal = ct < 110 || ct >= 176;
      c.fillStyle = '#2c3446'; c.fillRect(x - 5, y0, 10, 4); c.fillRect(x - 5, y1 - 4, 10, 4); c.fillStyle = lethal ? '#ff2a4a' : ct >= 160 ? '#ffd166' : '#3a4258'; c.fillRect(x - 2, y0 + 3, 4, 1); c.fillRect(x - 2, y1 - 4, 4, 1);
      if (this.on) { P.Energy.laser(c, x, y0 + 4, x, y1 - 4, this.t, lethal ? '#ff2a4a' : '#ffd166', lethal ? 3 : 1); } }
  };
  // Prensa industrial (O): cuelga del techo; se ilumina en rojo, baja de golpe y vuelve a subir
  P.Crusher = class extends P.Ent {
    constructor(L, x, y, m) { super(L, x - 14, 0, 28, 14); let top = m.y; while (top > 0 && L.coll(m.x, top - 1) !== 1) top--; let bot = m.y; while (bot < L.rows - 1 && L.coll(m.x, bot + 1) !== 1) bot++; this.top = top * TSZ; this.bot = (bot + 1) * TSZ; this.hy = this.top; this.ph = (m.x * 31) % 170; }
    get ct() { return (this.L.t + this.ph) % 170; }
    update() { this.t++; const L = this.L, p = L.player, ct = this.ct, low = this.bot - 14;
      if (ct < 80) this.hy = this.top; else if (ct < 110) this.hy = this.top + ((ct >> 1) % 2); else if (ct < 118) this.hy = this.top + (low - this.top) * ((ct - 110) / 8); else if (ct < 138) this.hy = low; else this.hy = low - (low - this.top) * ((ct - 138) / 32);
      if (ct === 118) { P.Audio.sfx('bigexplode'); P.shake(5, 10); L.parts.burst(this.cx, this.bot - 2, 14, { col: P.pick(['#8a96b4', '#ffd166', '#2c3446']), smin: 1, smax: 3, g: 0.2, size: 2 }); }
      this.y = this.hy; if (ct >= 110 && ct < 140 && !p.dead && P.overlap({ x: this.x + 2, y: this.top, w: this.w - 4, h: this.hy + 14 - this.top }, p)) p.hurt(20, this.cx, { env: true }); }
    umLight() { const ct = this.ct; return ct >= 80 && ct < 118 ? [this.cx, this.hy + 14, 40, 0.9] : null; }
    draw(c, cx, cy) { const x = Math.round(this.x - cx), top = Math.round(this.top - cy), y = Math.round(this.hy - cy), ct = this.ct, warn = ct >= 80 && ct < 118;
      c.fillStyle = '#1e2432'; c.fillRect(x + 10, top, 8, y - top); c.fillStyle = '#404a62'; c.fillRect(x + 10, top, 2, y - top);
      c.fillStyle = '#2c3446'; c.fillRect(x, y, 28, 14); c.fillStyle = '#5e6a86'; c.fillRect(x, y, 28, 2); for (let k = 0; k < 4; k++) { c.fillStyle = (k + (ct >> 3)) % 2 ? '#ffd166' : '#1e2432'; c.fillRect(x + 2 + k * 6, y + 10, 4, 3); }
      c.fillStyle = warn && (this.t >> 2) % 2 ? '#ff2a4a' : '#6a0a1a'; c.fillRect(x + 12, y + 4, 4, 3); if (warn) { P.drawGlow(c, x + 14, y + 6, 14, '#ff2a4a', 0.5); c.globalAlpha = 0.25; c.fillStyle = '#ff2a4a'; c.fillRect(x + 2, Math.round(this.bot - cy) - 2, 24, 2); c.globalAlpha = 1; } }
  };
  // Nodo de energía (Z): al dispararle libera energía que abre compuertas y enciende los puentes de luz cercanos
  P.PowerNode = class extends P.ResonanceCrystal {
    hit() { if (this.charge < 0.3) { P.Audio.sfx('block'); return; } P.umPulse(this.L, this.cx, this.cy, 150 + 140 * this.charge, this, '#ffd166'); this.L.aeFlash = 0.3; this.charge = 0; this.flash = 8; }
    draw(c, cx, cy) { const x = Math.round(this.x - cx), y = Math.round(this.y - cy), full = this.charge >= 1; P.drawGlow(c, x + 8, y + 14, 18 + this.charge * 24, '#ffd166', 0.2 + this.charge * 0.35); P.spr(c, 'rescrys', full ? 2 : this.charge > 0.3 ? 1 : 0, x - 2, y - 2, { flash: this.flash > 0 }); c.fillStyle = '#06070b'; c.fillRect(x, y + 34, 16, 2); c.fillStyle = full ? '#ffffff' : '#ffd166'; c.fillRect(x, y + 34, Math.round(16 * this.charge), 2); }
  };
  // Puente de luz sólida (J)
  P.Hardlight = class extends P.PhasePlatform {
    draw(c, cx, cy) { const x = Math.round(this.x - cx), y = Math.round(this.y - cy); if (!this.on) { c.globalAlpha = 0.4; for (let k = 0; k < 3; k++) P.spr(c, 't_phase', 1, x + k * TSZ, y); c.globalAlpha = 1; return; } if (this.warn() && (this.t >> 2) % 2) c.globalAlpha = 0.5; P.drawGlow(c, x + 24, y + 4, 24, '#3ac8f0', 0.35); for (let k = 0; k < 3; k++) P.spr(c, 't_phase', 0, x + k * TSZ, y); c.globalAlpha = 1; }
  };
  // Pretoriano (K): escudo de energía que bloquea de frente
  P.Praetorian = class extends P.HiveGuardian { constructor(L, x, y) { super(L, x, y); this.kind = null; this.hp = this.maxhp = Math.round(56 * (L.diff || 1)); } };

  // marcadores de la Esfera
  const gy = (L, m) => L.snapY(m.x, m.y), livery = L => ['soldier', 'soldier', 'soldier_b', 'soldier_c', 'soldier_c'][L.def.area || 1];
  const nk = e => { e.kind = null; return e; };
  P.LV.dyson.spawn = {
    s: (L, x, y) => { const e = L.add(new P.Soldier(L, x - 5, y - 14)); e.spr = livery(L); },
    c: (L, x, y) => L.add(nk(new P.Crab(L, x - 9, y, false))),
    K: (L, x, y, m) => L.add(new P.Praetorian(L, x, gy(L, m))),
    A: (L, x, y, m, R) => { const e = L.add(new P.Alpha(L, x - 20, y)); e.kind = 'caminante_asedio'; },
    f: (L, x, y) => L.add(nk(new P.Frog(L, x - 7, y - 11))),
    d: (L, x, y) => L.add(nk(new P.Fly(L, x - 8, y - 20, false))),
    D: (L, x, y) => L.add(nk(new P.Fly(L, x - 8, y - 20, true))),
    l: (L, x, y) => L.add(nk(new P.Slug(L, x - 10, y - 8))),
    p: (L, x, y) => L.add(nk(new P.Maw(L, x - 6, y - 16))),
    h: (L, x, y) => { const e = L.add(new P.HealPlant(L, x, y)); e.light = '#7dff5a'; },
    Q: (L, x, y, m) => { const e = L.add(new P.StormLantern(L, x, gy(L, m))); e.species = null; e.lightCol = '#ff2a4a'; },
    Y: (L, x, y, m) => L.add(new P.Updraft(L, x, gy(L, m))),
    Z: (L, x, y, m) => L.add(new P.PowerNode(L, x, gy(L, m))),
    J: (L, x, y, m) => L.add(new P.Hardlight(L, x, y, m)),
    v: (L, x, y, m) => L.add(new P.DriftIsle(L, x, y, m)),
    W: (L, x, y, m) => L.add(new P.OrbitalStrike(L, x, gy(L, m))),
    V: (L, x, y, m) => L.add(new P.LaserGate(L, x, y, m)),
    O: (L, x, y, m) => L.add(new P.Crusher(L, x, y, m))
  };
  P.LV.dyson.overworld.vip = { look: 'vaelis', civ: 'andromedano', talk: lib => [['vaelis', 'El Consejo te sigue desde aquí, {N}. Cinco pueblos, un solo campamento. Nunca pensé que lo vería.']] };
})();
