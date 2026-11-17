'use strict';
// La nave central: Vigía del Alba
P.SHIP_ORDER = ['camarote', 'puente', 'navegacion', 'archivo', 'taller', 'laboratorio', 'arsenal', 'hangar', 'invernadero', 'jardin', 'comunicaciones', 'entrenamiento', 'observatorio', 'habitaciones', 'trofeos', 'civs'];
P.ROOM_COL = { camarote: '#ff8a7a', puente: '#5ee8ff', navegacion: '#b48cff', archivo: '#7dffa0', taller: '#ffd166', laboratorio: '#ff6a5a', arsenal: '#ff8a7a', hangar: '#5ee8ff', invernadero: '#9cff6a', jardin: '#5ef0d0', comunicaciones: '#ffb030', entrenamiento: '#ff8a3a', observatorio: '#bff6ff', habitaciones: '#ffd0a0', trofeos: '#ffd166', civs: '#ff8ad8' };
P.CIV_LORE = {
  pleyadiano: 'Los pleyadianos: botánicos y sanadores. Su arquitectura crece junto a las plantas; visten túnicas claras con bordados vegetales. Creen que toda vida es una conversación.',
  arturiano: 'Los arturianos: ingenieros y astrónomos de piel azul. Diseñaron las naves y las estaciones de la República. Hablan poco y calculan mucho.',
  reptiliano: 'Los reptilianos: guerreros y cazadores de honor. Sus clanes protegían las fronteras. Llevan armaduras de bronce y crestas de colores según su linaje.',
  andromedano: 'Los andromedanos: archivistas y guardianes de la memoria. Encapuchados, con pecas que brillan como estrellas. Ningún dato se pierde mientras vivan.',
  lemuriano: 'Los lemurianos: navegantes de los océanos de THALASSYR. Aletas en las sienes, adornos de coral. Su música viaja bajo el agua durante kilómetros.'
};
P.ShipScene = class {
  constructor(room) { this.startRoom = room || 'puente'; }
  enter() {
    const S = P.State; this.t = 0; this.RW = 192; this.FY = 214;
    this.W = P.SHIP_ORDER.length * this.RW;
    const ri = Math.max(0, P.SHIP_ORDER.indexOf(this.startRoom));
    this.pl = { x: ri * this.RW + 96, y: this.FY, vx: 0, vy: 0, face: 1, af: 0, ground: true };
    this.cam = { x: 0 }; this.updateCam(true);
    this.parts = new P.Particles();
    this.buildNPCs();
    P.Audio.music('ship');
    S.data.ow = null;
    if (!S.data.flags.prologueDone) setTimeout(() => this.prologue(), 400);
    else if (S.data.flags.postBoss) setTimeout(() => this.postBoss(), 500);
  }
  prologue() {
    const S = P.State;
    P.openUI(new P.Dialog([
      ['elara', 'Reinicio completado. Núcleo estable al 12 %. ¿Me oyes, unidad?'],
      ['elara', 'Soy ELARA, la inteligencia de la Vigía del Alba. Has estado en hibernación... mucho tiempo. Mis registros de fecha están corruptos.'],
      ['elara', 'Tu designación de fábrica también está dañada. Necesito un nombre para registrarte en el sistema.']], () => {
      P.openUI(new P.NameEntry(S.data.name, (name) => {
        S.data.name = name;
        P.openUI(new P.Dialog([
          ['elara', 'Registrado. Encantada, {N}.'],
          ['hero', '¿Dónde estamos? ¿Qué ha pasado?'],
          ['elara', 'En el sistema solar de PLENURIA. La República Solar de las cinco civilizaciones cayó. Los Esqueléticos de Merek encerraron nuestra estrella en una Esfera de Dyson.'],
          ['elara', 'Drenan su luz para alimentar su maquinaria de guerra. Los nueve planetas se marchitan.'],
          ['elara', 'La nave está muy dañada; casi todas las salas están cerradas. Pero detecto una señal de vida en VÉRZARA, el mundo selva.'],
          ['elara', 'Ve a la Sala de navegación y desciende. Y {N}... me alegro de que hayas despertado.']], () => { S.data.flags.prologueDone = true; S.save('auto'); }));
      }));
    }));
  }
  postBoss() {
    const S = P.State, which = S.data.flags.postBoss; S.data.flags.postBoss = false; S.data.flags.merekSeen = true;
    const lines = P.D.POST_BOSS[which] || P.D.POST_BOSS.krazthor;
    lines.forEach(l => S.msg(l[0], l[1]));
    P.openUI(new P.Dialog(lines, () => S.autosave()));
  }
  roomX(id) { return P.SHIP_ORDER.indexOf(id) * this.RW; }
  open(id) { return !!P.State.data.rooms[id]; }
  buildNPCs() {
    const S = P.State, d = S.data; this.npcs = [];
    const add = (look, room, off, lines, name) => this.npcs.push({ look, x: this.roomX(room) + off, home: this.roomX(room) + off, face: -1, t: P.ri(0, 99), walk: 0, lines, name });
    if (d.npcs.sylae) add('sylae', 'invernadero', 120, () => {
      const m = d.missions.s_semillas;
      if (m && m.state === 'done') return [['sylae', 'Las Orquídeas Solares han brotado en la nave, {N}. Huelen a luz.']];
      return [['sylae', 'Cada especie que escaneas me ayuda a cultivarla aquí.'], ['sylae', 'Semillas de Orquídea Solar: ' + d.seeds + '/5. Solo brotan en territorios liberados.']];
    });
    if (d.npcs.kairo) add('kairo', 'taller', 60, () => [['kairo', 'He recalibrado el banco de trabajo. Ahora puedo fabricar el Bláster Mk III y baterías solares.'], ['kairo', 'Tráeme chatarra de los Esqueléticos y cristales solares, {N}.']]);
    if (d.npcs.mnemo) add('mnemo', 'archivo', 150, () => { const cp = P.D.planet(S.currentPlanet()), p = Math.round(S.planetCodex(cp.id) * 100); return [['mnemo', 'El Archivo de ' + cp.name + ' está al ' + p + ' %.'], ['mnemo', p < 100 ? 'Observa a las criaturas en libertad cuando la selva sane. Algunas especies solo regresan a territorios restaurados.' : 'Completo. La memoria de la selva está a salvo. Gracias, {N}.']]; });
    if (d.npcs.ssaru) add('ssaru', 'entrenamiento', 130, () => { const m = d.missions.s_cazador; return [['ssaru', 'La simulación de combate está lista. Practica tus paradas perfectas: pulsa DEFENSA justo antes del impacto.'], ['ssaru', m && m.state === 'active' ? 'Quimeras de Thersek destruidas: ' + m.prog + '/12.' : 'Has honrado a los Krazith, metálico.']]; });
    for (const id in (P.D.RESCUE || {})) { const R = P.D.RESCUE[id]; if (d.npcs[id] && R.ship && this.open(R.ship.room)) add(id, R.ship.room, R.ship.off, () => R.ship.talk(S)); }
    // supervivientes en las habitaciones
    if (this.open('habitaciones')) { const lib = S.liberatedAll(); for (let i = 0; i < Math.min(4, Math.floor(lib / 2)); i++) { const civ = ['pleyadiano', 'arturiano', 'reptiliano', 'andromedano'][i]; add(civ + (i % 3), 'habitaciones', 30 + i * 40, null); this.npcs[this.npcs.length - 1].civ = civ; } }
  }
  interactables() {
    const S = P.State, d = S.data, out = [];
    const T = (room, off, label, fn, need = true) => { if (need) out.push({ x: this.roomX(room) + off, label, fn, room }); };
    T('camarote', 50, 'Guardar partida', () => P.openUI(new P.SaveUI('save')));
    T('camarote', 140, 'Cambiar nombre', () => P.openUI(new P.NameEntry(d.name, n => { d.name = n; P.toast('Designación actualizada: ' + n, { col: P.UIC.cyan }); }, true)));
    T('puente', 96, 'Hablar con ELARA', () => this.elaraTalk());
    T('navegacion', 96, 'Mapa galáctico', () => P.openUI(new P.GalaxyMap(pid => { P.goto(new P.OverworldScene(pid)); })));
    T('archivo', 50, 'Archivo Biológico', () => P.openUI(new P.CodexUI()), this.open('archivo'));
    T('taller', 120, 'Banco de trabajo', () => P.openUI(new P.WorkshopUI()), this.open('taller'));
    T('laboratorio', 96, 'Cápsula de modificación', () => P.openUI(new P.SkillUI()), this.open('laboratorio'));
    T('arsenal', 70, 'Armero', () => P.openUI(new P.ArsenalUI()), this.open('arsenal'));
    T('arsenal', 154, 'Vestidor', () => P.openUI(new P.WardrobeUI()), this.open('arsenal'));
    T('hangar', 30, 'Selección de apoyo', () => P.openUI(new P.CompanionUI()), this.open('hangar'));
    T('comunicaciones', 96, 'Consola de comunicaciones', () => P.openUI(new P.CommsUI()), this.open('comunicaciones'));
    T('entrenamiento', 50, 'Simulación de combate', () => { P.Audio.sfx('door'); P.goto(new P.LevelScene('sim', 1)); }, this.open('entrenamiento'));
    T('observatorio', 96, 'Estado del sistema', () => this.observatory(), this.open('observatorio'));
    T('trofeos', 72, 'Galería de trofeos', () => P.openUI(new P.TrophyGalleryUI()), this.open('trofeos'));
    T('trofeos', 163, 'Logros y estadísticas', () => P.openUI(new P.StatsUI()), this.open('trofeos'));
    if (this.open('jardin') && d.creatures.esfinge) T('jardin', 160, 'Observar a la Ssynthra', () => { S.task('esfinge', 'observe', 6); P.openUI(new P.Dialog([['elara', 'La Ssynthra de Cristal se ha tumbado junto al oasis. Su melena canta cuando pasa el aire de los conductos.']])); });
    if (this.open('jardin') && d.creatures.vellorn) T('jardin', 110, 'Observar al Vellorn', () => { S.task('vellorn', 'observe', 6); P.openUI(new P.Dialog([['elara', 'El Vellorn ha aceptado su nuevo hogar. Sus astas brillan con la luz de las Orquídeas.']])); });
    if (this.open('civs')) {
      ['pleyadiano', 'arturiano', 'reptiliano', 'andromedano', 'lemuriano'].forEach((civ, i) => T('civs', 22 + i * 36, 'Espacio ' + P.CIV[civ].name, () => P.openUI(new P.LoreView({ title: P.CIV[civ].name.toUpperCase(), text: P.CIV_LORE[civ] + (this.civPresent(civ) ? '' : ' (Ningún representante a bordo todavía.)') }, 'holo'))));
    }
    // vitrinas holográficas del archivo
    if (this.open('archivo')) this.vitrines().forEach((sp, i) => T('archivo', 80 + i * 22, sp.name, () => P.openUI(new P.CodexUI(sp.id))));
    // cápsulas de compañeros
    if (this.open('hangar')) P.D.COMPANIONS.forEach((cp, i) => T('hangar', 66 + i * 34, S.compUnlocked(cp.id) ? cp.name : 'Cápsula vacía', () => P.openUI(new P.CompanionUI())));
    if (this.open('hangar') && S.compUnlocked('sirio')) T('hangar', 170, 'Acariciar a SIRIO', () => { P.Audio.sfx('bark'); for (let i = 0; i < 8; i++) this.parts.add({ x: this.roomX('hangar') + 174, y: this.FY - 20, vx: P.rand(-0.6, 0.6), vy: -P.rand(0.5, 1.2), life: 50, col: '#ff8ad8', size: 2 }); P.toast('SIRIO mueve la cola', { col: '#bff6ff', icon: 'por_sirio' }); });
    for (const n of this.npcs) out.push({ x: n.x, label: 'Hablar', npc: n, fn: () => { n.face = Math.sign(this.pl.x - n.x) || 1; const ln = n.lines ? n.lines() : [[n.look, P.pick(P.D.VILLAGER_LINES[n.civ]), P.CIV[n.civ].name.replace(/s$/, '')]]; P.openUI(new P.Dialog(ln)); } });
    return out;
  }
  civPresent(civ) { const d = P.State.data; return { pleyadiano: d.npcs.sylae, arturiano: d.npcs.kairo, reptiliano: d.npcs.ssaru, andromedano: d.npcs.mnemo, lemuriano: false }[civ]; }
  vitrines() { const d = P.State.data; return P.D.SPECIES.filter(s => d.codex[s.id] && d.codex[s.id].seen).slice(0, 5); }
  elaraTalk() {
    const S = P.State, d = S.data, cp = P.D.planet(S.currentPlanet()), lib = S.liberated(cp.id), B = P.D.BOSSES[cp.boss];
    let lines;
    if (!lib) lines = [['elara', 'La Sala de navegación está a tu derecha, {N}. Selecciona ' + cp.name + ' y desciende.']];
    else if (!(d.planets[cp.id] && d.planets[cp.id].boss)) lines = [['elara', 'Territorios liberados en ' + cp.name + ': ' + lib + '/10. ' + (lib >= 10 ? (cp.lair || 'La guarida') + ' ya es accesible. ' + B.name + ' te espera.' : 'Cada extractora destruida devuelve energía a la nave.')],
      ['elara', d.sp > 0 ? 'Tienes ' + d.sp + ' punto(s) de habilidad. Visita el Laboratorio de modificaciones.' : 'Recuerda: puedes reparar salas en el Taller con los recursos que recojas.']];
    else lines = [['elara', cp.name + ' es libre, {N}. La nave se siente… más viva. Igual que tú.'], ['elara', 'Sigo analizando la frase de Merek. K-7. Proyecto ALBA. Hay archivos sellados en mi memoria que no puedo abrir todavía.']];
    if (d.mems.m1 && !d.flags.elaraM1) { d.flags.elaraM1 = true; lines.push(['hero', 'ELARA, recuperé un recuerdo. Una voz me llamaba «Siete».'], ['elara', '…No tengo datos sobre eso. Lo siento.'], ['elara', '(Por primera vez, ELARA tarda en responder.)']); }
    P.openUI(new P.Dialog(lines));
  }
  observatory() {
    const S = P.State, lines = [['elara', 'Estado del sistema: ' + P.D.PLANETS.filter(p => S.data.planets[p.id] && S.data.planets[p.id].boss).length + '/9 planetas liberados.'], ['elara', 'Integridad de la nave: ' + Math.round(Object.keys(S.data.rooms).length / P.SHIP_ORDER.length * 100) + ' %. La Esfera de Dyson bloquea el 96 % de la luz de Plenuria.']];
    P.openUI(new P.Dialog(lines));
  }
  update() {
    const I = P.input, pl = this.pl; this.t++;
    if (I.pressed('pause')) { P.openUI(new P.PauseMenu(this)); return; }
    const dir = (I.down('right') ? 1 : 0) - (I.down('left') ? 1 : 0);
    pl.vx = P.approach(pl.vx, dir * (I.down('dash') ? 2.6 : 1.6), 0.3); if (dir) pl.face = dir;
    pl.x = P.clamp(pl.x + pl.vx, 12, this.W - 12);
    if (pl.ground && I.pressed('jump')) { pl.vy = -4.5; pl.ground = false; P.Audio.sfx('jump'); }
    if (!pl.ground) { pl.vy += 0.3; pl.y += pl.vy; if (pl.y >= this.FY) { pl.y = this.FY; pl.ground = true; pl.vy = 0; } }
    if (Math.abs(pl.vx) > 0.2) pl.af += Math.abs(pl.vx) * 0.09;
    for (const n of this.npcs) {
      n.t++; const near = Math.abs(n.x - pl.x) < 30;
      if (near) { n.walk = 0; n.face = Math.sign(pl.x - n.x) || 1; continue; }
      if (n.walk > 0) { n.walk--; n.x += n.face * 0.35; if (Math.abs(n.x - n.home) > 40) { n.face = Math.sign(n.home - n.x); } }
      else if (n.t % 120 === 0 && Math.random() < 0.5) { n.walk = P.ri(30, 90); n.face = P.pick([-1, 1]); }
    }
    this.parts.update();
    if (this.t % 5 === 0 && this.open('invernadero')) this.parts.add({ x: this.roomX('invernadero') + P.rand(10, 180), y: this.FY - P.rand(10, 120), vy: -0.2, life: 80, col: '#9cff6a', size: 1, glow: 2 });
    // interacción
    const list = this.interactables(); let best = null, bd = 18;
    for (const it of list) { const d = Math.abs(it.x - pl.x); if (d < bd) { bd = d; best = it; } }
    this.focus = best;
    if (best && I.pressed('interact')) { P.Audio.sfx('select'); best.fn(); }
    // clic con el ratón sobre un mueble interactivo
    const ck = P.input.click; if (ck && P.frame - ck.t < 3) { P.input.click = null; const z = (this.zones || []).find(z => ck.x >= z.x && ck.x <= z.x + z.w && ck.y >= z.y && ck.y <= z.y + z.h); if (z) { P.Audio.sfx('select'); z.fn(); } }
    // sala actual
    const ri = Math.floor(pl.x / this.RW), id = P.SHIP_ORDER[ri];
    if (id !== this.curRoom) { this.curRoom = id; this.roomT = 0; }
    this.roomT++;
    this.updateCam();
  }
  updateCam(snap) { const tx = P.clamp(this.pl.x - P.W / 2, 0, this.W - P.W); this.cam.x = snap ? tx : this.cam.x + (tx - this.cam.x) * 0.1; }
  drawProps(c, id, x0) {
    const S = P.State, d = S.data, col = P.ROOM_COL[id], FY = this.FY, t = this.t, W = this.RW;
    const glow = (x, y, r, cl, a = 0.6) => P.drawGlow(c, x0 + x, y, r, cl, a);
    const term = (x, cl = col) => { c.fillStyle = '#2c3654'; c.fillRect(x0 + x - 10, FY - 30, 20, 30); c.fillStyle = '#0a1020'; c.fillRect(x0 + x - 8, FY - 28, 16, 12); c.fillStyle = cl; c.globalAlpha = 0.6 + Math.sin(t * 0.1 + x) * 0.2; c.fillRect(x0 + x - 7, FY - 27, 14, 10); c.globalAlpha = 1; glow(x, FY - 22, 14, cl, 0.4); };
    switch (id) {
      case 'camarote':
        c.fillStyle = '#3a2a3a'; c.fillRect(x0 + 24, FY - 18, 52, 18); c.fillStyle = '#7a4a5a'; c.fillRect(x0 + 24, FY - 22, 52, 6); c.fillStyle = '#c8b0c0'; c.fillRect(x0 + 26, FY - 26, 14, 6);
        c.fillStyle = '#2c3654'; c.fillRect(x0 + 130, FY - 60, 22, 46); c.fillStyle = '#8ab4e8'; c.globalAlpha = 0.4; c.fillRect(x0 + 132, FY - 58, 18, 42); c.globalAlpha = 1;
        c.fillStyle = '#ff8a7a'; c.globalAlpha = 0.5; c.fillRect(x0 + 22, FY - 30, 56, 2); c.globalAlpha = 1; P.spr(c, 'heropor_' + d.skin, 0, x0 + 160, FY - 74, { fit: 18 }); c.strokeStyle = '#8a9ac8'; c.strokeRect(x0 + 159.5, FY - 75.5, 19, 19);
        break;
      case 'puente': {
        // consola curva bajo el ventanal, pantallas y sillón de mando
        c.fillStyle = '#2a3452'; c.beginPath(); c.moveTo(x0 + 14, FY - 26); c.quadraticCurveTo(x0 + 96, FY - 40, x0 + 178, FY - 26); c.lineTo(x0 + 178, FY - 16); c.lineTo(x0 + 14, FY - 16); c.fill();
        c.fillStyle = '#5a6a98'; c.beginPath(); c.moveTo(x0 + 14, FY - 26); c.quadraticCurveTo(x0 + 96, FY - 40, x0 + 178, FY - 26); c.lineTo(x0 + 178, FY - 25); c.quadraticCurveTo(x0 + 96, FY - 39, x0 + 14, FY - 25); c.fill();
        for (let i = 0; i < 6; i++) { const sx = x0 + 22 + i * 26, sy = FY - 30 - Math.round(Math.sin((i + 0.5) / 6 * Math.PI) * 6); c.fillStyle = '#0a1426'; c.fillRect(sx, sy, 16, 7); c.fillStyle = i % 2 ? '#5ee8ff' : '#ffd166'; c.globalAlpha = 0.7; for (let k = 0; k < 3; k++) c.fillRect(sx + 2, sy + 1 + k * 2, 4 + ((t / 6 + i * 3 + k * 5) % 10), 1); c.globalAlpha = 1; glow(sx - x0 + 8, sy + 3, 8, i % 2 ? '#5ee8ff' : '#ffd166', 0.3); }
        c.fillStyle = '#3a2a3a'; c.fillRect(x0 + 140, FY - 26, 22, 18); c.fillStyle = '#d41e3c'; c.fillRect(x0 + 142, FY - 36, 18, 12); c.fillStyle = '#ff5a5a'; c.fillRect(x0 + 142, FY - 36, 18, 1); c.fillStyle = '#1a2034'; c.fillRect(x0 + 149, FY - 8, 4, 8);
        const a = 0.55 + Math.sin(t * 0.07) * 0.15; c.globalAlpha = a; P.spr(c, 'npc_elara', Math.floor(t / 40) % 2, x0 + 90, FY - 60); c.globalAlpha = 1; glow(96, FY - 48, 24, '#5ee8ff', 0.5);
        c.fillStyle = '#5ee8ff'; c.globalAlpha = 0.3; c.beginPath(); c.moveTo(x0 + 96, FY - 34); c.lineTo(x0 + 84, FY - 66); c.lineTo(x0 + 108, FY - 66); c.fill(); c.globalAlpha = 1;
        break;
      }
      case 'navegacion': {
        // mesa holográfica con el sistema solar
        c.fillStyle = '#2a3452'; c.beginPath(); c.ellipse(x0 + 96, FY - 18, 44, 7, 0, 0, 7); c.fill(); c.fillStyle = '#1a2034'; c.fillRect(x0 + 70, FY - 18, 52, 18); c.fillStyle = '#b48cff'; c.beginPath(); c.ellipse(x0 + 96, FY - 19, 40, 5, 0, 0, 7); c.fill(); c.fillStyle = '#e8d8ff'; c.fillRect(x0 + 60, FY - 20, 72, 1);
        const cxh = x0 + 96, cyh = 110;
        c.save(); c.globalCompositeOperation = 'lighter'; const bg2 = c.createLinearGradient(0, FY - 20, 0, 60); bg2.addColorStop(0, 'rgba(180,140,255,0.25)'); bg2.addColorStop(1, 'rgba(180,140,255,0)'); c.fillStyle = bg2; c.beginPath(); c.moveTo(x0 + 58, FY - 20); c.lineTo(x0 + 134, FY - 20); c.lineTo(x0 + 176, 56); c.lineTo(x0 + 16, 56); c.fill(); c.restore();
        const dy = P.Space.dyson(4); c.drawImage(dy, Math.round(cxh - dy.width / 2), Math.round(cyh - dy.height / 2));
        for (let i = 0; i < 9; i++) { const p = P.D.PLANETS[i]; if (!P.State.revealed(p.id)) continue; const a = t * 0.004 * (240 / p.orbit) + i * 2.1; c.strokeStyle = 'rgba(200,170,255,0.22)'; c.beginPath(); c.ellipse(cxh, cyh, p.orbit * 0.33, p.orbit * 0.11, 0, 0, 7); c.stroke(); P.FX.revealPlanet(c, this, p, cxh + Math.cos(a) * p.orbit * 0.33, cyh + Math.sin(a) * p.orbit * 0.11, 3, 'holoSeen'); }
        P.scanlines(c, x0 + 16, 56, 160, FY - 76, 0.1);
        break;
      }
      case 'archivo': {
        term(50);
        const vs = this.vitrines();
        for (let i = 0; i < 5; i++) {
          const vx = 80 + i * 22; c.fillStyle = '#2c3654'; c.fillRect(x0 + vx - 9, FY - 8, 18, 8); c.fillStyle = 'rgba(94,232,255,0.12)'; c.fillRect(x0 + vx - 8, FY - 50, 16, 42); c.strokeStyle = 'rgba(94,232,255,0.35)'; c.strokeRect(x0 + vx - 8.5, FY - 50.5, 17, 43);
          const sp = vs[i];
          if (sp) { c.globalAlpha = 0.7 + Math.sin(t * 0.1 + i) * 0.2; P.spr(c, sp.spr, Math.floor(t / 20), x0 + vx - 8, FY - 46 + Math.sin(t * 0.05 + i) * 2, { fit: 16 }); c.globalAlpha = 1; glow(vx, FY - 30, 12, '#5ee8ff', 0.4); }
        }
        // plantas conservadas
        for (let i = 0; i < 3; i++) { c.fillStyle = '#2a4a3a'; c.fillRect(x0 + 20 + i * 8, FY - 70, 6, 14); c.fillStyle = '#7dffa0'; c.fillRect(x0 + 21 + i * 8, FY - 68, 4, 6); }
        P.txt(c, Math.round(S.planetCodex(S.currentPlanet()) * 100) + ' %', x0 + 50, FY - 42, '#7dffa0', { align: 'center' });
        break;
      }
      case 'taller':
        c.fillStyle = '#4a3a2a'; c.fillRect(x0 + 100, FY - 22, 50, 22); c.fillStyle = '#6a5236'; c.fillRect(x0 + 100, FY - 24, 50, 3);
        c.fillStyle = '#6c7488'; c.fillRect(x0 + 110, FY - 32, 12, 8); c.fillRect(x0 + 128, FY - 30, 6, 6);
        if (t % 20 < 10) { glow(130, FY - 28, 6, '#ffd166', 0.8); }
        c.fillStyle = '#2c3654'; c.fillRect(x0 + 20, 60, 40, 80); for (let i = 0; i < 4; i++) { c.fillStyle = '#6c7488'; c.fillRect(x0 + 24 + i * 9, 70, 5, 20); }
        break;
      case 'laboratorio':
        c.fillStyle = '#2c3654'; c.fillRect(x0 + 80, FY - 70, 32, 70); c.fillStyle = 'rgba(255,106,90,0.15)'; c.fillRect(x0 + 84, FY - 66, 24, 62); c.strokeStyle = '#ff6a5a'; c.strokeRect(x0 + 84.5, FY - 66.5, 23, 61);
        glow(96, FY - 36, 22, '#ff6a5a', 0.4 + Math.sin(t * 0.08) * 0.1);
        if (d.sp > 0 && t % 40 < 26) P.txt(c, '+' + d.sp, x0 + 96, FY - 80, P.UIC.gold, { align: 'center' });
        term(40, '#ff6a5a'); term(150, '#ff6a5a');
        break;
      case 'arsenal': {
        c.fillStyle = '#2c3654'; c.fillRect(x0 + 12, 64, 104, 96); c.fillStyle = '#1a2238'; c.fillRect(x0 + 16, 68, 96, 88); c.fillStyle = '#ff8a7a'; c.fillRect(x0 + 16, 68, 96, 1);
        const ws = Object.keys(P.D.WEAPONS); ws.forEach((w, i) => { const own = d.weapons.includes(w), xx = x0 + 22 + (i % 4) * 22, yy = 84 + Math.floor(i / 4) * 30; c.fillStyle = '#3a4668'; c.fillRect(xx - 2, yy + 22, 24, 2); P.spr(c, P.D.WEAPONS[w].icon, 0, xx, yy, { scale: 2, sil: own ? null : '#1a1a24' }); });
        P.Sprites.wardrobe(c, x0 + 128, FY, d, t); this.zones.push({ x: x0 + 128, y: FY - 92, w: 52, h: 92, fn: () => P.openUI(new P.WardrobeUI()) });
        break;
      }
      case 'hangar': {
        term(30);
        P.D.COMPANIONS.forEach((cp, i) => {
          const px = 66 + i * 34, un = S.compUnlocked(cp.id), eq = d.comps.equipped.includes(cp.id);
          c.fillStyle = '#2c3654'; c.fillRect(x0 + px - 14, FY - 56, 28, 56); c.fillStyle = un ? 'rgba(94,232,255,0.15)' : 'rgba(40,40,60,0.4)'; c.fillRect(x0 + px - 12, FY - 52, 24, 46);
          if (un && cp.id !== 'sirio') { const s = P.S[cp.spr]; P.spr(c, cp.spr, Math.floor(t / 30) % 2, x0 + px - s.w / 2, FY - 8 - s.h); if (cp.id === 'twins') P.spr(c, 'brisa', Math.floor(t / 30) % 2, x0 + px - 2, FY - 22); }
          else if (!un) P.txt(c, '?', x0 + px, FY - 34, '#3a4a6a', { align: 'center', scale: 2 });
          c.fillStyle = eq ? '#7dffa0' : un ? '#5ee8ff' : '#5a1a22'; c.fillRect(x0 + px - 4, FY - 60, 8, 2);
        });
        if (S.compUnlocked('sirio')) { c.fillStyle = '#3a3050'; c.fillRect(x0 + 158, FY - 6, 30, 6); P.spr(c, 'sirio', t % 600 < 400 ? 9 : 0, x0 + 158, FY - 21); }
        break;
      }
      case 'invernadero': {
        c.fillStyle = '#1a3a2a'; c.fillRect(x0 + 10, FY - 14, W - 20, 14);
        const n = 3 + S.liberatedAll() * 2;
        for (let i = 0; i < Math.min(n, 20); i++) { const sp = ['fern_r', 'lamp', 'orchid', 'bigmush', 'mush', 'heal'][i % 6]; if (sp === 'orchid' && !(d.missions.s_semillas && d.missions.s_semillas.state === 'done') && i > 2) continue; const s = P.S[sp]; P.spr(c, sp, Math.floor(t / 40 + i) % s.f.length, x0 + 14 + (i * 37) % 170, FY - 12 - s.h + (i % 2) * 2); }
        glow(96, 60, 60, '#9cff6a', 0.15);
        break;
      }
      case 'jardin': {
        c.fillStyle = '#1e5a28'; c.fillRect(x0 + 10, FY - 8, W - 20, 8); c.fillStyle = '#2f8a36'; c.fillRect(x0 + 10, FY - 10, W - 20, 2);
        for (let i = 0; i < 8; i++) P.spr(c, 'fern_r', Math.floor(t / 40 + i) % 2, x0 + 12 + i * 22, FY - 22);
        if (d.flags.santuario) { P.spr(c, 'o_pillar', 0, x0 + 30, FY - 38); P.spr(c, 'o_pillar', 0, x0 + 150, FY - 38); P.txt(c, 'Santuario de Vérzara', x0 + 96, 52, '#5ef0d0', { align: 'center' }); }
        if (d.flags.santuario_khazir) { c.fillStyle = '#e8a440'; c.fillRect(x0 + 120, FY - 10, 60, 2); c.fillStyle = '#1a9ab8'; c.fillRect(x0 + 128, FY - 9, 44, 3); P.spr(c, 'kz_o_pillar', 0, x0 + 176, FY - 38); P.txt(c, 'Oasis de Khazir', x0 + 96, d.flags.santuario ? 62 : 52, '#ffd166', { align: 'center' }); }
        if (d.creatures.esfinge) { glow(160, FY - 22, 26, '#ffe090', 0.3); P.spr(c, 'kz_vellorn', Math.floor(t / 30) % 2, x0 + 136, FY - 38, { flip: Math.floor(t / 520) % 2 === 0 }); }
        if (d.creatures.vellorn) { glow(110, FY - 20, 28, '#bafff0', 0.3); P.spr(c, 'vellorn', Math.floor(t / 30) % 2, x0 + 96, FY - 36, { flip: Math.floor(t / 400) % 2 === 1 }); }
        else if (!d.creatures.esfinge) P.txt(c, 'Hábitats vacíos', x0 + 96, 90, P.UIC.dim, { align: 'center' });
        break;
      }
      case 'comunicaciones':
        term(96, '#ffb030');
        c.fillStyle = '#2c3654'; c.fillRect(x0 + 40, 56, 112, 50); c.fillStyle = '#05060c'; c.fillRect(x0 + 44, 60, 104, 42);
        for (let i = 0; i < 20; i++) { const h = Math.abs(Math.sin(t * 0.1 + i * 0.7)) * 16; c.fillStyle = '#ffb030'; c.fillRect(x0 + 48 + i * 5, 92 - h, 3, h); }
        if (d.msgs.length && t % 50 < 30) P.txt(c, d.msgs.length + ' MSJ', x0 + 96, 64, '#ffb030', { align: 'center' });
        break;
      case 'entrenamiento':
        term(50, '#ff8a3a');
        c.fillStyle = '#2c3654'; c.fillRect(x0 + 120, FY - 40, 4, 40); c.fillStyle = '#ff8a3a'; c.beginPath(); c.arc(x0 + 122, FY - 46, 10, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(x0 + 122, FY - 46, 5, 0, 7); c.fill(); c.fillStyle = '#ff3a5a'; c.beginPath(); c.arc(x0 + 122, FY - 46, 2, 0, 7); c.fill();
        break;
      case 'observatorio': {
        // telescopio y barandilla frente al gran ventanal
        c.fillStyle = '#2a3452'; c.fillRect(x0 + 10, FY - 14, 172, 3); for (let i = 0; i < 9; i++) c.fillRect(x0 + 12 + i * 21, FY - 14, 2, 14); c.fillStyle = '#8a9ac8'; c.fillRect(x0 + 10, FY - 14, 172, 1);
        c.fillStyle = '#3a4668'; c.fillRect(x0 + 150, FY - 30, 4, 30); c.save(); c.translate(x0 + 152, FY - 32); c.rotate(-0.6); c.fillStyle = '#c8d4ec'; c.fillRect(-4, -3, 26, 6); c.fillStyle = '#ffd166'; c.fillRect(18, -3, 4, 6); c.restore();
        break;
      }
      case 'habitaciones':
        for (let i = 0; i < 4; i++) { c.fillStyle = '#2c3654'; c.fillRect(x0 + 14 + i * 44, FY - 50, 34, 50); c.fillStyle = '#ffd0a0'; c.globalAlpha = 0.3; c.fillRect(x0 + 24 + i * 44, FY - 44, 14, 10); c.globalAlpha = 1; }
        break;
      case 'trofeos':
        // galería: nueve cuadros enmarcados y vitrina de logros
        P.drawTrophyWall(this, c, x0, t);
        break;
      case 'civs':
        ['pleyadiano', 'arturiano', 'reptiliano', 'andromedano', 'lemuriano'].forEach((civ, i) => {
          const ax = 22 + i * 36, here = this.civPresent(civ), L = P.CIV[civ];
          c.fillStyle = here ? P.Col.rgba(L.acc, 0.25) : '#141a28'; c.fillRect(x0 + ax - 15, 60, 30, FY - 60);
          c.fillStyle = here ? L.acc : '#2c3654'; c.fillRect(x0 + ax - 15, 58, 30, 3);
          P.spr(c, 'npc_' + civ + '0', 0, x0 + ax - 6, FY - 24, { sil: here ? null : '#1a2030', alpha: here ? 0.85 : 1 });
          if (here) glow(ax, 80, 14, L.acc, 0.4);
        });
        break;
    }
  }
};
