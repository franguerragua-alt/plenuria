'use strict';
// KHAZIR: biblioteca de chunks (24x17), niveles y mapa exterior
// Mismas teselas y marcadores que VÉRZARA; en KHAZIR cada letra se reinterpreta (ver khazir_data.js):
//  c escorpión  K escorpión ciber  A escorpión emperador  f escarabajo  d buitre  D halcón-dron  l tortuga  p cactus fauces
//  v serpiente de cornisa  w arenícola  ~ arena movediza (lodo de cristal / oasis)  | cuerda  b calabaza géiser  ^ cardo de vidrio
(function () {
  const E = '........................', G = '########################', RR = 'RRRRRRRRRRRRRRRRRRRRRRRR';
  const G3 = [G, G, G], R3 = [RR, RR, RR];
  const ch = rows => { const out = []; for (let i = 0; i < 17; i++) out.push(((rows[i] || E) + E).slice(0, 24)); return out; };
  const padTop = (n, rows) => { const r = []; for (let i = 0; i < n; i++) r.push(E); return ch(r.concat(rows)); };
  const solid = n => { const r = []; for (let i = 0; i < n; i++) r.push(G); return r; };
  Object.assign(P.CHUNKS, {
    kz_start: padTop(10, [E, '..............L.........', '.............====.......', '..P................F....', ...G3]),
    kz_dunes_a: padTop(9, [E, E, '..............o.........', '............#####.......', '..F...w..U.#######...c..', ...G3]),
    kz_dunes_b: padTop(10, [E, '........====............', '...........d............', '...L...............p..F.', '#####~~~~~~~~~~~~~######', '#####~~~~~~~~~~~~~######', G]),
    kz_quicksand: padTop(11, [E, '..........o.............', '...f.....###.......l....', '####~~~~#####~~~~#######', '####~~~~#####~~~~#######', G]),
    kz_dune_jumps: padTop(9, ['...........o............', '..........###...........', '.........#####......c...', '....#....#####....#####.', '.w.###..#######..######.', '#######~########~#######', '#######~########~#######', G]),
    kz_terraces: padTop(8, ['.................o......', '...............#####....', '...........#########....', '.......#############....', '.......#############..L.', '..c..###############....', ...G3]),
    kz_canyon_climb: ch([E, E, E, E, E, E, E, '..............c....F....', '...........|############', '...........|############', '...........|############', '....o......|############', '...====....|############', '..F........|############', ...G3]),
    kz_mesa_down: ch([E, E, E, E, E, E, E, '...F...K................', '###########.............', '###########.......o.....', '###########.....====....', '###############.........', '###############.........', '###############.....c.L.', ...G3]),
    // atajo secreto: hueco estrecho entre un pilar colgante y la meseta (solo con salto de pared)
    kz_arch_rope: ch([E, E, '..........F.............', '.......|################', '.......|.##*.###########', '.......|.##..###########', '.......|.##..###########', '.......|.##..###########', '.......|.##..###########', '.......|.##..###########', '.......|.##..###########', '.......|.....###########', '.......|.....###########', '..c....|.....###########', ...G3]),
    kz_high_down: ch([E, E, '..F.....................', '#######.................', '#######.................', '#######.................', '#######...====..........', '#######.................', '#######.........o.......', '#######........====.....', '#######.................', '#######.................', '#######.................', '#######...c.........L...', ...G3]),
    kz_bridge: padTop(11, ['................D.......', '..........o.............', '...c....................', '######============######', '######............######', '######............######']),
    kz_overhang: ch([...solid(6), '#########.......########', '####................####', '...v................v...', E, E, '...........===..........', E, '..f.......o.........c...', ...G3]),
    kz_geode: ch([...solid(6), '#######......###########', '####..............######', '...v...............v....', E, E, '........====..BBB.......', '..............B*B.......', '......w...m...BBB...U...', ...G3]),
    kz_cave_b: ch([...solid(7), '#######..........#######', '####................####', E, '..........##............', '.........####......o....', '........######...====...', '..m....########.......w.', ...G3]),
    kz_crystal_gap: ch([...solid(6), '######.............#####', '###....................#', E, E, '.......o................', '......===....===........', E, '..L.....................', '####~~~~~~~~~~~~~~~~####', '####~~~~~~~~~~~~~~~~####', G]),
    kz_oasis_pool: padTop(10, [E, '......===....===........', '..y.....................', '..L..................p..', '####~~~~~~~~~~~~~~~~####', '####~~~~~~~~~~~~~~~~####', G]),
    kz_thorns: padTop(11, ['.......o.........o......', '.....====.....=====.....', '....^^^^...f.^^^^^......', ...G3]),
    kz_geyser_gap: padTop(6, ['..........*.............', '.........====...........', E, E, '..........===...........', '...............===...d..', '.......b.....b..........', '.......#.....#..........', '#####..#.....#....######', '#####..#.....#....######', '#####..#.....#....######']),
    kz_storm_flats: padTop(10, ['..........d.............', E, E, '..F..w.......l..w....F..', ...G3]),
    // zigurat con cámara oculta tras un muro de tierra (S)
    kz_ziggurat: padTop(5, ['...........*............', '..........RRR...........', '.........RRRRR..........', '........RRRRRRR.........', '.......RRRRRRRRR........', '......RRRRRRRRRRR.......', '.....RRRRRRRRRRRRR......', '....S..........RRRR.....', '..r.S....n..C..RRRR..r..', ...R3]),
    kz_shrine: padTop(9, ['..........RRRR..........', '.........RRRRRR.........', E, E, '....r...r..u...r...r....', ...R3]),
    kz_secret_room: padTop(9, ['............*...........', '........#############...', '........S........C..#...', '.....###S...........####', '.....###S...........####', ...G3]),
    kz_elite_arena: padTop(9, [E, E, '...===............===...', E, '...........A............', ...G3]),
    kz_extractor: padTop(10, [E, '...==.............==....', '...................g....', '..K.......X.........c.y.', ...G3]),
    kz_checkpoint: padTop(10, [E, E, '...................y....', '....L....k....h....F....', ...G3]),
    kz_rescue: padTop(10, [E, E, '...................y....', '....F......n.......c....', ...G3]),
    kz_exit: padTop(10, ['.........L..............', '........###.............', '.......#####............', '..F...#######.....E.....', ...G3])
  });

  P.LV.khazir = {
    planet: 'khazir',
    levels: [
      { id: 1, name: 'Dunas del Amanecer', sub: 'El mar de arena despierta', theme: 'desert', music: 'khazir', sky: 'day',
        rows: [['kz_start', 'kz_dunes_a', 'kz_terraces', 'kz_checkpoint', 'kz_quicksand', 'kz_ziggurat', 'kz_extractor', 'kz_dunes_b', 'kz_exit']],
        events: [], stars: [{ t: 'holo', id: 'h9' }],
        intro: [['elara', 'Descenso completado, {N}. Bienvenido a KHAZIR, el Mar de Arena Cantora.'], ['elara', 'Las extractoras han convertido los oasis en lodo de cristal. No te hundas en él.'], ['elara', 'Y vigila los montículos que se mueven: las Vorágulos acechan bajo la arena.']] },
      { id: 2, name: 'Oasis Marchito', sub: 'El agua que se volvió cristal', theme: 'oasis', music: 'khazir', sky: 'day',
        rows: [['kz_start', 'kz_oasis_pool', 'kz_thorns', 'kz_checkpoint', 'kz_rescue', 'kz_dune_jumps', 'kz_secret_room', 'kz_extractor', 'kz_quicksand', 'kz_exit']],
        events: [{ t: 'rescue', npc: 'varkh' }], stars: [{ t: 'holo', id: 'h10' }],
        intro: [['elara', 'Este oasis abastecía a tres clanes reptilianos. Ahora es un cementerio de cristal.'], ['elara', 'Capto una firma de vida reptiliana encerrada en una jaula del régimen.']] },
      { id: 3, name: 'Cañón de los Vientos', sub: 'Paredes que silban al atardecer', theme: 'canyon', music: 'khazir', sky: 'golden',
        rows: [['kz_start', 'kz_dunes_a', 'kz_canyon_climb', 'kz_mesa_down', 'kz_checkpoint', 'kz_bridge', 'kz_overhang', 'kz_geyser_gap', 'kz_shrine', 'kz_extractor', 'kz_exit']],
        events: [], stars: [{ t: 'res', crys: 2 }], ups: ['garras'],
        intro: [['varkh', 'El santuario del cañón guarda las Garras de mis ancestros. Con ellas, ninguna pared te detendrá.'], ['elara', 'Trepa por las cuerdas de duna: mantén ↑ junto a una.']] },
      { id: 4, name: 'Templo Enterrado de Ssa-Khor', sub: 'Los zigurats del clan solar', theme: 'ruins', music: 'khazir', sky: 'day',
        rows: [['kz_start', 'kz_ziggurat', 'kz_arch_rope', 'kz_high_down', 'kz_checkpoint', 'kz_terraces', 'kz_secret_room', 'kz_ziggurat', 'kz_extractor', 'kz_exit']],
        events: [], stars: [{ t: 'res', crys: 3 }, { t: 'holo', id: 'h11' }, { t: 'res', bio: 8 }, { t: 'holo', id: 'h12' }],
        intro: [['elara', 'Con las Garras Reptilianas puedes aferrarte a una pared y saltar a la de enfrente.'], ['elara', 'Hay huecos estrechos entre las rocas que esconden tesoros. Y algunos muros de tierra no son tan sólidos como parecen.']] },
      { id: 5, name: 'Mar de Dunas Cantoras', sub: 'La tormenta tiene voz', theme: 'storm', music: 'khazir', sky: 'day', storm: true,
        rows: [['kz_start', 'kz_storm_flats', 'kz_dune_jumps', 'kz_checkpoint', 'kz_secret_room', 'kz_elite_arena', 'kz_dunes_a', 'kz_quicksand', 'kz_extractor', 'kz_storm_flats', 'kz_exit']],
        events: [], stars: [{ t: 'holo', id: 'h13' }], arenaLock: true,
        intro: [['elara', 'Tormenta de arena en formación. Las ráfagas te empujarán: agáchate o usa la DEFENSA para resistirlas.'], ['varkh', 'Y el Kharvex Soberano vive en estas dunas. Thersek lo ha vuelto loco.']] },
      { id: 6, name: 'Refinería Ósea', sub: 'Donde el desierto se convierte en energía', theme: 'facility', music: 'facility',
        rows: [['kz_start', 'facility_a', 'facility_b', 'kz_checkpoint', 'facility_a', 'cell', 'facility_b', 'kz_exit']],
        events: [{ t: 'transmission', who: 'gerselle', lines: [['gerselle', 'Otra vez tú. Esta refinería abastece el Área Burguesa de la Esfera. Tus amigos reptilianos comían arena antes de nosotros.'], ['gerselle', 'Ahora al menos sirven para algo. Apártate de mis tuberías, {N}.']] }],
        stars: [],
        intro: [['elara', 'Una refinería Esquelética. Bombea la energía de los oasis directamente hacia la Esfera.']],
        outro: [['gerselle', 'Dos refinerías perdidas. Thersek me aseguró que su gusano protegería las dunas.'], ['gerselle', 'Que lo haga. Ya lo verás, {N}: la Garganta de Arena no devuelve a nadie.']] },
      { id: 7, name: 'Cuevas de Geoda', sub: 'El corazón de cristal del planeta', theme: 'cave', music: 'khazir',
        rows: [['kz_start', 'kz_cave_b', 'kz_geode', 'kz_checkpoint', 'kz_crystal_gap', 'kz_overhang', 'kz_geode', 'kz_extractor', 'kz_shrine', 'kz_exit']],
        events: [], stars: [{ t: 'holo', id: 'h14' }, { t: 'res', crys: 3 }], ups: ['arena'],
        intro: [['elara', 'Bajo las dunas hay geodas gigantes. Los clanes forjaban aquí sus armas con arena solar.'], ['varkh', 'El Cañón de Arena de mi clan duerme en este santuario. Dispara cristales que atraviesan a varios enemigos.']] },
      { id: 8, name: 'Necrópolis de los Clanes', sub: 'Donde descansan los grandes cazadores', theme: 'ruins', music: 'khazir', sky: 'golden',
        rows: [['kz_start', 'kz_ziggurat', 'kz_terraces', 'kz_checkpoint', 'kz_arch_rope', 'kz_high_down', 'kz_ziggurat', 'kz_extractor', 'kz_exit']],
        events: [{ t: 'rescue', npc: 'zul', hidden: true }], stars: [{ t: 'res', crys: 3 }, { t: 'holo', id: 'h15' }, { t: 'mem', id: 'm4' }],
        intro: [['elara', 'Detecto un latido dentro de uno de los zigurats. Busca un muro de tierra en su base.']] },
      { id: 9, name: 'Tormenta Carmesí', sub: 'El cielo arde sobre las dunas', theme: 'storm', music: 'khazir', sky: 'dusk', storm: true,
        rows: [['kz_start', 'kz_storm_flats', 'kz_bridge', 'kz_overhang', 'kz_checkpoint', 'kz_dune_jumps', 'kz_geyser_gap', 'kz_shrine', 'kz_secret_room', 'kz_quicksand', 'kz_extractor', 'kz_exit']],
        events: [], stars: [{ t: 'res', crys: 2 }, { t: 'holo', id: 'h16' }], ups: ['escamas'],
        intro: [['elara', 'La tormenta se tiñe de rojo con el polvo de las extractoras.'], ['zul', 'En el santuario forjé unas Escamas de Basilisco antes de la invasión. Tómalas, metálico.']] },
      { id: 10, name: 'Excavadora Prima', sub: 'La máquina que despertó al gusano', theme: 'lab', music: 'facility',
        rows: [['kz_start', 'lab_a', 'lab_b', 'kz_checkpoint', 'lab_a', 'facility_b', 'lab_b', 'facility_b', 'kz_exit']],
        events: [{ t: 'transmission', who: 'thersek', lines: [['thersek', '¿Te gusta mi excavadora? Perforamos hasta el nido del Gran Gusano y le pusimos un cerebro nuevo.'], ['thersek', 'ZARMAKH tenía un instinto tan... desordenado. Ahora solo obedece. Ve a verlo, {N}. Tiene hambre.']] }],
        stars: [],
        intro: [['elara', 'La excavadora de Thersek. Desde aquí controlan el núcleo neural de ZARMAKH.']] },
      { id: 11, name: 'Garganta de Arena', sub: 'Guarida de ZARMAKH', theme: 'boss', music: 'boss', boss: 'zarmakh', sky: 'golden',
        intro: [['elara', 'Firma colosal bajo la arena. ZARMAKH, el Gran Gusano de KHAZIR.'], ['elara', 'Cuando la arena tiemble bajo tus pies, apártate: emergerá justo ahí.'], ['elara', 'Si carga por la superficie, sube a las cornisas. Al chocar contra la pared quedará aturdido y su núcleo quedará expuesto.'], ['varkh', 'Su cuerpo está blindado, {N}. Apunta siempre a la cabeza.']] }
    ],
    overworld: {
      w: 60, h: 32, ship: [4, 13], village: [30, 23],
      portals: [[11, 6], [13, 24], [22, 28], [20, 10], [27, 5], [38, 5], [48, 7], [55, 15], [50, 24], [42, 28], [55, 27]],
      lake: [30, 15, 6, 3],
      layout: { paths: 'curvy', plaza: 'round', border: 'cliff', mesas: [[16, 17, 3, 2.2], [45, 15, 4, 3], [35, 10, 2.2, 1.6], [8, 28, 2.5, 1.5]],
        decor: { tree: 0.03, rock: 0.05, goo: 0.06, lamp: 0.012 }, houses: [[-9, -10], [6, -11], [-10, -4], [7, -4], [-2, 2]] },
      intro: [['elara', 'Esta es la superficie de KHAZIR. Las dunas cubren ciudades enteras de los clanes reptilianos.'], ['elara', 'Cada portal te llevará a un territorio drenado por las extractoras. Libéralos y el desierto volverá a cantar.']]
    }
  };
})();
