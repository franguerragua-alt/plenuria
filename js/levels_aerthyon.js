'use strict';
// AERTHYON: chunks propios (24x17), niveles y archipiélago exterior.
// En este planeta: ~ mar de nubes · G sello de tormenta (se abre con energía atmosférica) · b respiradero (te impulsa)
// Z cristal de tormenta (al dispararle libera energía: abre sellos y hace aparecer puentes de nube J cercanos)
// J losa de nube (aparece y se disuelve; junto a un cristal Z solo aparece con su energía) · Y corriente ascendente
// V corriente de viento (empuja y cambia de dirección con aviso) · O torbellino que recorre el suelo y te lanza
// v isla a la deriva (plataforma que flota de un lado a otro) · W punto de impacto de relámpagos (aviso luminoso)
// Q faro de nimbo (se ilumina con la energía de la tormenta cuando te acercas).
(function () {
  const E = '........................', G = '########################';
  const G3 = [G, G, G];
  const pt = (n, rows) => { const out = []; for (let i = 0; i < n; i++) out.push(E); out.push(...rows); if (out.length !== 17 || out.some(r => r.length !== 24)) throw new Error('chunk AERTHYON mal formado: ' + out.length + ' filas · ' + rows.find(r => r.length !== 24)); return out; };
  const col = (x, ch, n) => { const r = []; for (let i = 0; i < n; i++) r.push('.'.repeat(x) + ch + '.'.repeat(23 - x)); return r; };
  Object.assign(P.CHUNKS, {
    ae_start: pt(10, [E, '...............Q........', '.........=====..........', '..P........L.......F....', ...G3]),
    // islas flotantes sobre el mar de nubes, con una isla que va a la deriva
    ae_isles: pt(6, ['..............d.........', E, '..................c.....', '........*.......#####...', '.......###..............', '..F.........v...........', '####................####', '####~~~~~~~~~~~~~~~~####', '####~~~~~~~~~~~~~~~~####', G, G]),
    // corrientes ascendentes que suben a una cornisa alta
    ae_updraft: pt(3, ['...............*........', '..............#####.....', E, E, E, '......====..............', E, E, E, E, '...Y..........Y.....F...', ...G3]),
    // corriente de viento que cambia de dirección sobre un abismo de nubes
    ae_wind: pt(8, ['........d...............', E, E, '..........V.............', E, '..F.......J.........c...', '######..........########', '######~~~~~~~~~~########', G]),
    ae_wind2: pt(6, ['..............*.........', '.........V..............', E, '....===.......===.......', E, E, E, '..F.........c.......d...', ...G3]),
    // torbellino que recorre el suelo y lanza hacia una plataforma alta
    ae_whirl: pt(9, ['..........*.............', '.........===............', E, E, '..l.......O.........c...', ...G3]),
    // relámpagos marcados y un sello de tormenta que abre el cristal
    ae_storm: pt(2, [...col(14, 'G', 11), '...W....Z.....G...W..c..', ...G3]),
    // puentes de nube que aparecen con la energía del cristal
    ae_bridges: pt(7, ['.................d......', E, '............J...........', E, '.......J........J.......', E, '..Z.....................', '#####~~~~~~~~~~~~~######', '#####~~~~~~~~~~~~~######', G]),
    // islas a la deriva
    ae_drift: pt(7, ['...........*............', E, '..............v.........', E, '.......v................', E, '..F.....................', '####~~~~~~~~~~~~~~~~####', '####~~~~~~~~~~~~~~~~####', G]),
    // acantilado: una corriente ascendente sube a la cornisa mientras caen relámpagos
    ae_cliffs: pt(4, ['.................d......', '..................*.....', '..................######', '..................######', '..................######', '.........==.......######', '..................######', '..................######', '..W......W......Y.######', ...G3, G]),
    // bosque celeste de árboles cometa
    ae_forest: pt(8, ['............d...........', E, '.........=====..........', E, E, '..U..f..l.......F...U...', ...G3]),
    // ciudad flotante de piedra blanca
    ae_city: pt(8, ['...........*............', '......RRRRRRRRRRRR......', '......R..........R......', '..===.R..........R......', E, '..Q.......C.......Q.....', '######RRRRRRRRRRRR######', '######RRRRRRRRRRRR######', G]),
    // ruinas flotantes donde aúlla SIRIO (nivel 1)
    ae_sirio: pt(9, ['.........RRRRRR.........', '.........R....R.........', '.........R....R.........', E, '..L.................F...', ...G3]),
    ae_temple: pt(9, ['..........RRRR..........', '.........RRRRRR.........', E, E, '..L..Q...r..u..r..Q..F..', ...G3]),
    ae_secret: pt(9, ['............*...........', '..........SSSSS.........', '..........S...S.........', '..........S.C.S.........', '..F.......SSSSS....L....', ...G3]),
    ae_elite: pt(8, [E, E, '...===............===...', E, E, '..Q.......A.........Q...', ...G3]),
    ae_checkpoint: pt(10, [E, '..........L.............', '...................y....', '....F....k....h....Q....', ...G3]),
    ae_extractor: pt(10, [E, '...==.............==....', '...................g....', '..K.......X.........c.y.', ...G3]),
    ae_rescue: pt(10, [E, '..........L.............', '...................y....', '....F......n.......c....', ...G3]),
    ae_exit: pt(10, ['.........L..............', '........###.............', '.......#####............', '..F...#######.....E.....', ...G3])
  });

  P.LV.aerthyon = {
    planet: 'aerthyon',
    levels: [
      { id: 1, name: 'Islas Flotantes', sub: 'Donde el suelo es una nube', theme: 'plains', music: 'aerthyon', sky: 'day', set: 'peaks', setX: 120,
        rows: [['ae_start', 'ae_isles', 'ae_sirio', 'ae_checkpoint', 'ae_updraft', 'ae_drift', 'ae_extractor', 'ae_isles', 'ae_exit']],
        events: [], stars: [{ t: 'holo', id: 'h65' }],
        intro: [['elara', 'Descenso completado, {N}. AERTHYON, el Archipiélago de las Tormentas.'], ['elara', 'El último mundo. Islas que flotan sobre un mar de nubes… y un régimen que quiere su cielo.'], ['elara', 'Las corrientes ascendentes te suben si te quedas dentro. Y algo aúlla entre esas ruinas flotantes.']] },
      { id: 2, name: 'Bosque Celeste', sub: 'Árboles que nunca tocaron la tierra', theme: 'forest', music: 'aerthyon', sky: 'golden', set: 'forest', setX: 200,
        rows: [['ae_start', 'ae_forest', 'ae_wind', 'ae_checkpoint', 'ae_rescue', 'ae_forest', 'ae_isles', 'ae_secret', 'ae_extractor', 'ae_exit']],
        events: [{ t: 'rescue', npc: 'vaelis' }], stars: [{ t: 'holo', id: 'h66' }, { t: 'res', crys: 2 }],
        intro: [['elara', 'El viento cambia de dirección: mira las estelas antes de saltar.'], ['elara', 'Detecto a un andromedano vivo en una jaula del régimen.']] },
      { id: 3, name: 'Montañas Suspendidas', sub: 'Cumbres que no tocan el suelo', theme: 'mountain', music: 'aerthyon', sky: 'day', set: 'peaks', setX: 300,
        rows: [['ae_start', 'ae_updraft', 'ae_cliffs', 'ae_checkpoint', 'ae_drift', 'ae_temple', 'ae_updraft', 'ae_extractor', 'ae_exit']],
        events: [], stars: [{ t: 'res', crys: 2 }], ups: ['corriente'],
        intro: [['vaelis', 'Las montañas flotan porque el viento las sostiene. Súbete a las corrientes.'], ['vaelis', 'En el templo de la cumbre guardamos las Velas de Corriente.']] },
      { id: 4, name: 'Valle de las Corrientes', sub: 'Aquí el viento tiene voluntad', theme: 'valley', music: 'aerthyon', sky: 'golden', column: true, setX: 340,
        rows: [['ae_start', 'ae_wind', 'ae_whirl', 'ae_checkpoint', 'ae_wind2', 'ae_whirl', 'ae_drift', 'ae_extractor', 'ae_exit']],
        events: [], stars: [{ t: 'holo', id: 'h67' }, { t: 'res', bio: 8 }],
        intro: [['vaelis', 'Los torbellinos recorren el valle. Si te atrapan, te lanzan al cielo: aprovéchalo.']] },
      { id: 5, name: 'Ciudad Flotante de Ael-Vira', sub: 'Torres de nácar sobre las nubes', theme: 'city', music: 'aerthyon', sky: 'day', set: 'city', setX: 160,
        rows: [['ae_start', 'ae_city', 'ae_storm', 'ae_checkpoint', 'ae_elite', 'ae_city', 'ae_extractor', 'ae_exit']],
        events: [], stars: [{ t: 'holo', id: 'h68' }], arenaLock: true,
        intro: [['elara', 'Un Coloso de Nimbo patrulla la ciudad. Sus cuernos cargan electricidad antes de embestir.'], ['vaelis', 'Los sellos de tormenta se abren con la energía de los cristales. Dispárales.']] },
      { id: 6, name: 'Templos del Primer Viento', sub: 'Lo más antiguo de AERTHYON', theme: 'temple', music: 'aerthyon', sky: 'golden', set: 'temple', setX: 220,
        rows: [['ae_start', 'ae_city', 'ae_bridges', 'ae_checkpoint', 'ae_storm', 'ae_secret', 'ae_isles', 'ae_extractor', 'ae_exit']],
        events: [], stars: [{ t: 'holo', id: 'h69' }, { t: 'mem', id: 'm18' }],
        intro: [['vaelis', 'Los primeros templos. Aquí los andromedanos aprendieron a hablar con el viento.'], ['vaelis', 'Y con AZHYRION. Dicen que él les enseñó.']] },
      { id: 7, name: 'Región de las Tormentas', sub: 'El cielo se rompe en relámpagos', theme: 'storm', music: 'aerthyon', sky: 'dusk', set: 'storm', setX: 300, storm: 0.85,
        rows: [['ae_start', 'ae_storm', 'ae_cliffs', 'ae_checkpoint', 'ae_bridges', 'ae_temple', 'ae_wind', 'ae_extractor', 'ae_exit']],
        events: [], stars: [{ t: 'res', crys: 3 }], ups: ['rayo'],
        intro: [['elara', 'Tormenta eléctrica. El suelo se ilumina donde va a caer un rayo: apártate.'], ['vaelis', 'En el templo de la tormenta está el Lanzarrayos Celeste.']] },
      { id: 8, name: 'Observatorio de Tormentas', sub: 'Donde el régimen encadena el clima', theme: 'facility', music: 'facility',
        rows: [['ae_start', 'lab_a', 'ae_storm', 'ae_checkpoint', 'lab_b', 'ae_updraft', 'ae_extractor', 'ae_exit']],
        events: [{ t: 'transmission', who: 'gerselle', lines: [['gerselle', 'Las tormentas de AERTHYON cargan las baterías de la Esfera, K-7.'], ['gerselle', 'AZHYRION es la tormenta. Thersek no lo controla del todo. Nadie lo controla.']] }],
        stars: [{ t: 'holo', id: 'h70' }], intro: [['elara', 'El observatorio del régimen. Desde aquí roban la energía de las tormentas.']] },
      { id: 9, name: 'Acantilados del Mar de Nubes', sub: 'Abajo no hay nada', theme: 'cliffs', music: 'aerthyon', sky: 'dusk', set: 'peaks', setX: 380, storm: 0.45, stormColumn: true,
        rows: [['ae_start', 'ae_cliffs', 'ae_isles', 'ae_checkpoint', 'ae_drift', 'ae_temple', 'ae_secret', 'ae_extractor', 'ae_exit']],
        events: [], stars: [{ t: 'res', crys: 3 }, { t: 'holo', id: 'h71' }, { t: 'res', bio: 8 }, { t: 'holo', id: 'h72' }], ups: ['egida'],
        intro: [['vaelis', 'Los acantilados sobre el mar de nubes. En el templo te espera la Égida de Nimbo.']] },
      { id: 10, name: 'Laboratorio Celeste del Régimen', sub: 'Donde le pusieron una cadena al cielo', theme: 'lab', music: 'facility',
        rows: [['ae_start', 'lab_a', 'ae_bridges', 'ae_checkpoint', 'lab_b', 'ae_storm', 'lab_a', 'ae_exit']],
        events: [{ t: 'transmission', who: 'thersek', lines: [['thersek', 'AZHYRION es más viejo que los andromedanos. Más viejo que tu República.'], ['thersek', 'Le arranqué el cuerpo y le dejé la cabeza y la tormenta. Así cabe en mi Esfera.']] }],
        stars: [], intro: [['elara', 'El laboratorio donde Thersek encadenó a AZHYRION. La última puerta antes del santuario.']] },
      { id: 11, name: 'Santuario Celestial', sub: 'El trono de las tormentas', theme: 'boss', music: 'boss', boss: 'azhyrion', sky: 'dusk', arena: 'azhyrion', storm: 0.25,
        intro: [['elara', 'Firma colosal en el cielo. AZHYRION, el Dragón de las Nubes. El último guardián.'], ['elara', 'Su cabeza es el único punto débil. Cuando baje al suelo agotado, sus cuernos se apagarán y su frente brillará: ataca entonces.'], ['vaelis', 'Vigila su cola, {N}. La tormenta entera vive en ella.']] }
    ],
    overworld: {
      w: 60, h: 34, ship: [5, 15], village: [30, 18],
      portals: [[12, 6], [22, 5], [33, 7], [44, 5], [53, 11], [54, 22], [46, 29], [35, 28], [22, 29], [12, 25], [52, 30]],
      lake: [41, 17, 3, 2],
      layout: { paths: 'curvy', plaza: 'round', border: 'cliff', mesas: [[18, 13, 3, 2.2], [42, 12, 3.4, 2.4], [38, 24, 2.6, 1.8], [10, 31, 2.2, 1.5], [26, 9, 2, 1.5]],
        cracks: [[4, 22, 28, 20], [32, 20, 56, 26]], lakes: [[41, 17, 3.4, 2.2], [20, 24, 2.6, 1.8], [48, 30, 2.2, 1.6], [8, 8, 2, 1.4]],
        clusters: true, decor: { tree: 0.06, rock: 0.05, goo: 0.02, lamp: 0.03 }, houses: [[-8, -6], [6, -7], [-9, 2], [7, 3], [0, -9]] },
      intro: [['elara', 'AERTHYON. Islas sobre un mar de nubes y tormentas que nunca terminan.'], ['elara', 'Cada portal lleva a un territorio drenado por las extractoras. Libéralos y el cielo volverá a ser de los andromedanos.']]
    }
  };
})();
