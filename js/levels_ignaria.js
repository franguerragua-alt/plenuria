'use strict';
// IGNÁRIA: chunks propios (24x17), niveles y valle volcánico exterior.
// En este planeta: ~ magma · T suelo que se agrieta y suelta lava · G compuerta de obsidiana · b fumarola (chorro de vapor)
// Z cristal térmico (guarda energía volcánica) · J losa de basalto que emerge y se hunde en el magma
// Y géiser de calor (erupciones periódicas con aviso) · V roca que se desprende del techo · O nube de ceniza
// W guardián de forja · Q formación de cristal de magma. Los chunks «ig_deep*» son las profundidades sin luz.
(function () {
  const E = '........................', G = '########################', MM = 'MMMMMMMMMMMMMMMMMMMMMMMM';
  const G3 = [G, G, G], M3 = [MM, MM, MM];
  const pt = (n, rows) => { const out = []; for (let i = 0; i < n; i++) out.push(E); out.push(...rows); if (out.length !== 17 || out.some(r => r.length !== 24)) throw new Error('chunk IGNÁRIA mal formado: ' + out.length + ' filas · ' + rows.find(r => r.length !== 24)); return out; };
  const solid = n => { const r = []; for (let i = 0; i < n; i++) r.push(G); return r; };
  const col = (x, ch, n) => { const r = []; for (let i = 0; i < n; i++) r.push('.'.repeat(x) + ch + '.'.repeat(23 - x)); return r; };
  Object.assign(P.CHUNKS, {
    ig_start: pt(10, [E, '...............Q........', '.........=====..........', '..P........L.......F....', ...G3]),
    // llanuras de ceniza con géiseres
    ig_ash_plains: pt(9, [E, '.....d..............O...', E, '.......===......===.....', '..Q.....c....Y......F...', ...G3]),
    ig_ash_plains_b: pt(8, ['..............o.........', E, '...........====.........', E, '...===.............===..', '.L......l....Q.....c....', ...G3]),
    // montañas de basalto en columnas
    ig_basalt: pt(4, ['..............o.........', '.............###........', '.............###........', '.........###.###........', '.........###.###.###....', '.....###.###.###.###....', '.....###.###.###.###....', '..F..###.###.###.###.L..', '.....###.###.###.###....', '.....###.###.###.###....', ...G3]),
    // gran campo de lava con losas que emergen y se hunden
    ig_lava_field: pt(8, ['..........d.............', E, E, '......J.....J.....J.....', E, '..F.....................', '###~~~~~~~~~~~~~~~~~~~##', '###~~~~~~~~~~~~~~~~~~~##', G]),
    // suelo que se agrieta sobre el magma
    ig_cracking: pt(9, ['..........o.............', E, E, '...........d............', '..F.....................', '####TTTT....TTTT....####', '####~~~~~~~~~~~~~~~~####', G]),
    // cueva incandescente con rocas que caen
    ig_cave: pt(0, [...solid(4), '#######..V......V.######', '####..............######', '###..........v.......###', E, E, '.........====...........', E, E, '..Q.......W.......c..Q..', ...G3, G]),
    // cráter activo: erupciones periódicas
    ig_crater: pt(8, ['..........o..o..........', E, '.......====..====.......', E, E, '..Y......Y.....Y.....F..', ...G3]),
    // ciudad reptiliana en la ladera
    ig_city: pt(8, ['...........*............', '......RRRRRRRRRRRR......', '......R..........R......', '..===.R..........R......', E, '..Q.......C.......Q.....', '######RRRRRRRRRRRR######', '######RRRRRRRRRRRR######', G]),
    // compuerta de obsidiana que abre un cristal térmico
    ig_city_gate: pt(2, [...col(14, 'G', 11), '........Z.l...G.....L...', ...G3]),
    // puentes sobre el océano de magma (se activan con energía térmica)
    ig_bridges: pt(7, ['.................d......', E, '............J...........', E, '.......J........J.......', E, '..Z.....................', '#####~~~~~~~~~~~~~######', '#####~~~~~~~~~~~~~######', G]),
    // grandes forjas
    ig_forge: pt(0, [MM, MM, E, E, '....D..........D........', E, E, '...----........----.....', E, E, '.......MMM....MMM.......', E, '..........G.............', '..Z...s...G..n..s...Y...', 'MMMMMTTTTMMMMMMTTTTMMMMM', MM, MM]),
    // profundidades del volcán (sin luz)
    ig_deep: pt(0, [...solid(4), '######..V.......########', '###.....................', '##...W..........W.......', E, E, '........=====...........', E, E, '..Q.......O.......Y..Q..', ...G3, G]),
    // fumarolas que impulsan hacia una cornisa
    ig_vents: pt(4, ['..................o.....', '.................####...', E, E, E, '..........====..........', E, E, E, '..b.....f.......b.......', ...G3]),
    ig_checkpoint: pt(10, [E, '..........L.............', '...................y....', '....F....k....h....Q....', ...G3]),
    ig_extractor: pt(10, [E, '...==.............==....', '...................g....', '..K.......X.........c.y.', ...G3]),
    ig_rescue: pt(10, [E, '..........L.............', '...................y....', '....F......n.......c....', ...G3]),
    ig_shrine: pt(9, ['..........RRRR..........', '.........RRRRRR.........', E, E, '..L..Q...r..u..r..Q..F..', ...G3]),
    ig_secret: pt(9, ['............*...........', '..........SSSSS.........', '..........S...S.........', '..........S.C.S.........', '..F.......SSSSS....L....', ...G3]),
    ig_elite: pt(8, [E, E, '...===............===...', E, E, '..Q.......A.........Q...', ...G3]),
    ig_exit: pt(10, ['.........L..............', '........###.............', '.......#####............', '..F...#######.....E.....', ...G3])
  });
  P.IG_DARK = ['ig_deep'];

  P.LV.ignaria = {
    planet: 'ignaria',
    levels: [
      { id: 1, name: 'Llanuras de Ceniza', sub: 'El suelo todavía humea', theme: 'plains', music: 'ignaria', sky: 'day',
        rows: [['ig_start', 'ig_ash_plains', 'ig_ash_plains_b', 'ig_checkpoint', 'ig_cracking', 'ig_city_gate', 'ig_extractor', 'ig_ash_plains', 'ig_exit']],
        events: [], stars: [{ t: 'holo', id: 'h57' }],
        intro: [['elara', 'Descenso completado, {N}. IGNÁRIA, las Forjas del Núcleo.'], ['elara', 'Los géiseres burbujean antes de estallar: aléjate cuando veas el suelo brillar.'], ['elara', 'Y el suelo con grietas se rompe si te quedas encima. Debajo hay magma.']] },
      { id: 2, name: 'Montes de Basalto', sub: 'Columnas que tocan el humo', theme: 'mountain', music: 'ignaria', sky: 'golden',
        rows: [['ig_start', 'ig_basalt', 'ig_vents', 'ig_checkpoint', 'ig_rescue', 'ig_basalt', 'ig_ash_plains_b', 'ig_secret', 'ig_extractor', 'ig_exit']],
        events: [{ t: 'rescue', npc: 'ashkar' }], stars: [{ t: 'holo', id: 'h58' }, { t: 'res', crys: 2 }],
        intro: [['elara', 'Las fumarolas lanzan chorros de vapor: úsalas para subir.'], ['elara', 'Detecto a un reptiliano vivo en una jaula del régimen.']] },
      { id: 3, name: 'Campos de Lava', sub: 'Losas que flotan sobre el fuego', theme: 'lavafield', music: 'ignaria', sky: 'dusk',
        rows: [['ig_start', 'ig_lava_field', 'ig_cracking', 'ig_checkpoint', 'ig_lava_field', 'ig_shrine', 'ig_vents', 'ig_extractor', 'ig_exit']],
        events: [], stars: [{ t: 'res', crys: 2 }], ups: ['vapor'],
        intro: [['ashkar', 'Las losas de basalto suben y bajan con el magma. Cruza cuando estén arriba.'], ['ashkar', 'En el santuario guardamos las Toberas de Vapor.']] },
      { id: 4, name: 'Cuevas Incandescentes', sub: 'Donde la roca brilla por dentro', theme: 'cave', music: 'ignaria', sky: 'dusk',
        rows: [['ig_start', 'ig_cave', 'ig_vents', 'ig_checkpoint', 'ig_cave', 'ig_cracking', 'ig_extractor', 'ig_exit']],
        events: [], stars: [{ t: 'holo', id: 'h59' }, { t: 'res', bio: 8 }],
        intro: [['ashkar', 'Mira el techo. Las rocas sueltas tiemblan antes de caer.']] },
      { id: 5, name: 'Cráter Activo', sub: 'El volcán respira', theme: 'crater', music: 'ignaria', sky: 'dusk',
        rows: [['ig_start', 'ig_crater', 'ig_lava_field', 'ig_checkpoint', 'ig_elite', 'ig_crater', 'ig_extractor', 'ig_exit']],
        events: [], stars: [{ t: 'holo', id: 'h60' }], arenaLock: true,
        intro: [['elara', 'Un Titán de Magma ha emergido del cráter. Su núcleo fundido es el punto débil.']] },
      { id: 6, name: 'Ciudad de las Laderas', sub: 'Una ciudad que vive con el volcán', theme: 'city', music: 'ignaria', sky: 'golden',
        rows: [['ig_start', 'ig_city', 'ig_city_gate', 'ig_checkpoint', 'ig_city', 'ig_basalt', 'ig_secret', 'ig_extractor', 'ig_exit']],
        events: [], stars: [{ t: 'holo', id: 'h61' }, { t: 'mem', id: 'm16' }],
        intro: [['ashkar', 'Nuestra ciudad. Los guardianes de forja protegen las calles: su escudo de obsidiana para todo lo que llega de frente.']] },
      { id: 7, name: 'Puentes del Océano de Magma', sub: 'Un paso en falso y no hay vuelta', theme: 'bridges', music: 'ignaria', sky: 'dusk',
        rows: [['ig_start', 'ig_bridges', 'ig_lava_field', 'ig_checkpoint', 'ig_bridges', 'ig_shrine', 'ig_cracking', 'ig_extractor', 'ig_exit']],
        events: [], stars: [{ t: 'res', crys: 3 }], ups: ['magma'],
        intro: [['ashkar', 'Los puentes de basalto solo emergen con la energía de los cristales térmicos. Dispárales.'], ['ashkar', 'En el santuario está el Cañón de Magma.']] },
      { id: 8, name: 'Grandes Forjas', sub: 'El martillo del régimen', theme: 'facility', music: 'facility',
        rows: [['ig_start', 'ig_forge', 'ig_cracking', 'ig_checkpoint', 'ig_forge', 'ig_vents', 'ig_extractor', 'ig_exit']],
        events: [{ t: 'transmission', who: 'gerselle', lines: [['gerselle', 'Las forjas de IGNÁRIA fabrican las placas de la Esfera, K-7.'], ['gerselle', 'MAGNAROK las alimenta con su propio fuego. Ve a pedirle que pare.']] }],
        stars: [{ t: 'holo', id: 'h62' }], intro: [['elara', 'Las forjas del régimen. El suelo de las fundiciones también se agrieta.']] },
      { id: 9, name: 'Corazón del Volcán', sub: 'Donde nace el magma', theme: 'cave', music: 'ignaria', sky: 'dusk',
        rows: [['ig_start', 'ig_deep', 'ig_vents', 'ig_checkpoint', 'ig_deep', 'ig_shrine', 'ig_secret', 'ig_extractor', 'ig_exit']],
        events: [], stars: [{ t: 'res', crys: 3 }, { t: 'holo', id: 'h63' }, { t: 'res', bio: 8 }, { t: 'holo', id: 'h64' }], ups: ['basalto'],
        intro: [['ashkar', 'El corazón del volcán. La ceniza no deja ver nada. En el santuario está la Piel de Basalto.']] },
      { id: 10, name: 'Fundición del Régimen', sub: 'Donde encadenaron al mastodonte', theme: 'lab', music: 'facility',
        rows: [['ig_start', 'lab_a', 'ig_forge', 'ig_checkpoint', 'lab_b', 'ig_forge', 'lab_a', 'ig_exit']],
        events: [{ t: 'transmission', who: 'thersek', lines: [['thersek', 'MAGNAROK dormía bajo el volcán desde antes de que existieran los reptilianos.'], ['thersek', 'Le di tres ojos nuevos y un corazón de horno. Ahora su trompa escupe magma por mí.']] }],
        stars: [], intro: [['elara', 'La fundición donde Thersek encadenó a MAGNAROK. Desde aquí controlan su trompa.']] },
      { id: 11, name: 'Guarida de MAGNAROK', sub: 'El Mastodonte de Fuego', theme: 'boss', music: 'boss', boss: 'magnarok', sky: 'dusk', arena: 'magnarok',
        intro: [['elara', 'Firma colosal detrás del escenario. MAGNAROK, el Mastodonte de Fuego.'], ['elara', 'Es demasiado grande para dañarlo… salvo su trompa. Cuando la clave en el suelo, sus grietas brillarán: dispara entonces.'], ['ashkar', 'Si escupe magma por la trompa, busca refugio. ¡Y vigila las rocas que caen cuando pisa!']] }
    ],
    overworld: {
      w: 60, h: 34, ship: [5, 15], village: [30, 18],
      portals: [[12, 6], [22, 5], [33, 7], [44, 5], [53, 11], [54, 22], [46, 29], [35, 28], [22, 29], [12, 25], [52, 30]],
      lake: [41, 17, 3, 2],
      layout: { paths: 'curvy', plaza: 'round', border: 'cliff', mesas: [[18, 13, 3, 2.2], [42, 12, 3.4, 2.4], [38, 24, 2.6, 1.8], [10, 31, 2.2, 1.5], [26, 9, 2, 1.5]],
        cracks: [[4, 22, 28, 20], [32, 20, 56, 26], [30, 4, 30, 14], [36, 18, 54, 8]], lakes: [[41, 17, 3, 2], [20, 24, 2.4, 1.6], [48, 30, 2, 1.4]],
        clusters: true, decor: { tree: 0.05, rock: 0.08, goo: 0.03, lamp: 0.025 }, houses: [[-8, -6], [6, -7], [-9, 2], [7, 3], [0, -9]] },
      intro: [['elara', 'IGNÁRIA. Ríos de magma y volcanes que no paran de humear.'], ['elara', 'Cada portal lleva a un territorio drenado por las extractoras. Libéralos y el fuego volverá a ser vida, no arma.']]
    }
  };
})();
