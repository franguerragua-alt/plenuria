'use strict';
// LA ESFERA DE DYSON: chunks propios (24x17), niveles y superficie interior (mapa exterior).
// Estructura (HISTORIA.md §4): 1 batalla galáctica · 2-5 Área I El Dominio Exterior (jefe NÉMESIS) · 6-9 Área II El Corazón
// Tecnológico (jefe THERSEK) · 10-13 Área III El Imperio Esquelético (jefa GERSELLE) · 14 El Trono del Imperio (MEREK).
// Marcadores propios: ~ plasma · G compuerta blindada · b plataforma de salto · s legionario · K pretoriano con escudo
// c araña de mantenimiento · A caminante de asedio · f mina saltarina · d dron explorador · D dron de combate · l gusano de cables
// p torreta de pinza · Q pilono holográfico · Z nodo de energía (abre compuertas y enciende puentes J) · J puente de luz sólida
// v plataforma de carga · Y elevador gravitatorio · W impacto orbital (aviso) · V barrera láser · O prensa industrial
// X nodo de defensa (hay que destruirlos para abrir la salida).
(function () {
  const E = '........................', G = '########################', G3 = [G, G, G];
  const pt = (n, rows) => { const out = []; for (let i = 0; i < n; i++) out.push(E); out.push(...rows); if (out.length !== 17 || out.some(r => r.length !== 24)) throw new Error('chunk ESFERA mal formado: ' + out.length + ' filas · ' + rows.find(r => r.length !== 24)); return out; };
  const col = (x, ch, n) => { const r = []; for (let i = 0; i < n; i++) r.push('.'.repeat(x) + ch + '.'.repeat(23 - x)); return r; };
  P.DS_CHUNK = pt;
  Object.assign(P.CHUNKS, {
    ds_start: pt(10, [E, '...............Q........', '.........=====..........', '..P.....................', ...G3]),
    // ÁREA I · plataformas de aterrizaje sobre canales de plasma, con una plataforma de carga
    ds_dock_pads: pt(6, ['..............d.........', E, '..................s.....', '........*.......#####...', '.......###..............', '....s.......v...........', '####................####', '####~~~~~~~~~~~~~~~~####', '####~~~~~~~~~~~~~~~~####', G, G]),
    ds_dock_cranes: pt(9, ['....d...........D.......', E, '.....=====....=====.....', E, '..s.....c.........s.....', ...G3]),
    ds_gate: pt(2, [...col(14, 'G', 11), '...s....Z.....G....s....', ...G3]),
    ds_hardlight: pt(7, ['.................D......', E, '............J...........', E, '.......J........J.......', E, '..Z.....................', '#####~~~~~~~~~~~~~######', '#####~~~~~~~~~~~~~######', G]),
    ds_lift: pt(3, ['...............*........', '..............#####.....', E, E, E, '......====..............', E, E, E, '...................s....', '...Y..........Y.........', ...G3]),
    ds_strike: pt(8, ['........D...............', E, E, '....====........====....', E, '..W.....s...W.......W...', ...G3]),
    ds_lasers: pt(8, [E, E, '.......====.............', E, E, '...V.......V......V..s..', ...G3]),
    ds_crusher: pt(3, [G, G, G, E, '....O.....O.....O.......', E, E, E, E, E, '..s.......c.........s...', ...G3]),
    ds_elite: pt(8, [E, E, '...===............===...', E, E, '..Q.......A.........Q...', ...G3]),
    ds_secret: pt(9, ['............*...........', '..........SSSSS.........', '..........S...S.........', '..........S.C.S.........', '..........SSSSS....Q....', ...G3]),
    ds_checkpoint: pt(10, [E, '..........Q.............', E, '.........k....h.........', ...G3]),
    ds_extractor: pt(10, [E, '...==.............==....', E, '..K.......X.........s...', ...G3]),
    ds_exit: pt(10, ['.........Q..............', '........###.............', '.......#####............', '......#######.....E.....', ...G3])
  });

  const PORTALS = [[8, 16], [14, 7], [22, 5], [30, 6], [38, 4], [47, 7], [53, 12], [55, 20], [50, 27], [42, 30], [33, 29], [24, 30], [15, 27], [30, 17]];
  P.LV.dyson = {
    planet: 'dyson',
    levels: [
      { id: 1, name: 'La Batalla Galáctica', sub: 'Las cinco naves del Consejo', scene: 'GalacticBattle', theme: 'space', music: 'galactic', sky: 'dusk' },
      { id: 2, name: 'Muelles de Desembarco', sub: 'Área I · El Dominio Exterior', theme: 'dock', bg: 'dock', area: 1, music: 'dyson_a', sky: 'day',
        rows: [['ds_start', 'ds_dock_pads', 'ds_dock_cranes', 'ds_checkpoint', 'ds_lift', 'ds_dock_pads', 'ds_gate', 'ds_extractor', 'ds_exit']],
        events: [], stars: [{ t: 'holo', id: 'h73' }],
        intro: [['elara', 'Hemos aterrizado en el casco exterior de la Esfera, {N}. El Dominio Exterior: sus defensas.'], ['elara', 'Destruye los nodos de defensa para abrir paso. Los nodos de energía amarillos abren las compuertas blindadas.']] },
      { id: 3, name: 'Baterías de Defensa Orbital', sub: 'Área I · El Dominio Exterior', theme: 'battery', bg: 'battery', area: 1, music: 'dyson_a2', sky: 'golden',
        rows: [['ds_start', 'ds_strike', 'ds_hardlight', 'ds_checkpoint', 'ds_lasers', 'ds_strike', 'ds_secret', 'ds_extractor', 'ds_exit']],
        events: [], stars: [{ t: 'holo', id: 'h74' }, { t: 'res', crys: 3 }],
        intro: [['elara', 'Los cañones orbitales disparan contra la flota del Consejo. Y contra ti: donde el suelo brille, va a caer un impacto.'], ['elara', 'Las barreras láser se apagan unos segundos. Cuenta antes de cruzar.']] },
      { id: 4, name: 'Forja de la Legión', sub: 'Área I · El Dominio Exterior', theme: 'forge', bg: 'forge', area: 1, music: 'dyson_a3', sky: 'dusk', arenaLock: true,
        rows: [['ds_start', 'ds_crusher', 'ds_lasers', 'ds_checkpoint', 'ds_elite', 'ds_crusher', 'ds_lift', 'ds_extractor', 'ds_exit']],
        events: [{ t: 'transmission', who: 'gerselle', lines: [['gerselle', 'Aquí fabricamos un legionario cada once segundos, K-7. Puedes romperlos más deprisa, si quieres.'], ['gerselle', 'NÉMESIS te espera arriba. La hicimos pensando en ti.']] }],
        stars: [{ t: 'holo', id: 'h75' }],
        intro: [['elara', 'La forja de los legionarios. Las prensas avisan antes de bajar: mira el destello rojo.'], ['elara', 'Un caminante de asedio custodia la cadena de montaje.']] },
      { id: 5, name: 'Plataforma de Vigilancia Ω', sub: 'Área I · El Dominio Exterior', theme: 'boss', bg: 'watch', area: 1, music: 'boss', boss: 'nemesis', sky: 'dusk', arena: 'nemesis',
        intro: [['elara', 'Firma de energía idéntica a la tuya, {N}. Misma tecnología ALBA… pero oscura.'], ['elara', 'NÉMESIS. El protocolo que Merek mandó activar. Cuidado: copia tus movimientos.']] }
    ],
    overworld: {
      w: 62, h: 36, ship: [4, 17], village: [30, 17],
      get portals() { return PORTALS.slice(0, P.LV.dyson.levels.length); },
      lake: [41, 18, 3, 2],
      layout: { paths: 'curvy', plaza: 'round', border: 'cliff', mesas: [[18, 13, 3, 2.2], [44, 12, 3.4, 2.4], [38, 24, 2.6, 1.8], [12, 31, 2.2, 1.5]],
        cracks: [[4, 22, 28, 20], [32, 20, 58, 26], [30, 4, 30, 14]], lakes: [[41, 18, 3.4, 2.2], [20, 24, 2.6, 1.8], [50, 31, 2.2, 1.6]],
        clusters: true, decor: { tree: 0.05, rock: 0.05, goo: 0.02, lamp: 0.04 }, houses: [[-8, -6], [6, -7], [-9, 2], [7, 3], [0, -9]] },
      intro: [['elara', 'La superficie interior de la Esfera de Dyson, {N}. Sobre nosotros, Plenuria, encerrada.'], ['elara', 'El Consejo ha montado un campamento junto a la nave. Cada portal lleva a un sector del régimen.']]
    }
  };
})();
