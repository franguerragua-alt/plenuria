'use strict';
// UMBRÉLIA: chunks propios (24x17), niveles y valle exterior.
// Teselas nuevas: T suelo inestable · G barrera de cristal (se disuelve con un pulso).
// Marcadores nuevos: Z cristal de resonancia · V cristal explosivo · O corrupción · J plataforma cristalina · W umbrátil · Y cristal suspendido
//                    Q (en este planeta) monolito de cristal que ilumina. Los chunks «um_dark_*» son zonas de oscuridad absoluta.
(function () {
  const E = '........................', G = '########################', MM = 'MMMMMMMMMMMMMMMMMMMMMMMM';
  const G3 = [G, G, G], M3 = [MM, MM, MM];
  // comprueba que cada chunk tenga exactamente 17 filas de 24 columnas
  const pt = (n, rows) => { const out = []; for (let i = 0; i < n; i++) out.push(E); out.push(...rows); if (out.length !== 17 || out.some(r => r.length !== 24)) throw new Error('chunk UMBRÉLIA mal formado: ' + out.length + ' filas · ' + rows.find(r => r.length !== 24)); return out; };
  const solid = n => { const r = []; for (let i = 0; i < n; i++) r.push(G); return r; };
  Object.assign(P.CHUNKS, {
    um_start: pt(10, [E, '...............Y........', '.........=====..........', '..P........Q.......F....', ...G3]),
    // llanura negra con monolitos de cristal gigantes
    um_plains: pt(9, [E, '.....Y.............d....', E, '.......===......===.....', '..Q.....c....Q......F...', ...G3]),
    um_plains_b: pt(8, ['..............Y.........', E, '...........====.........', '....o...................', '...===.............===..', '.L......l....Q.....c....', ...G3]),
    // bosque de formaciones cristalinas: cristales explosivos junto a un muro agrietado
    um_crystal_forest: pt(7, ['...........*............', '..........===...........', E, '....===.........===.....', E, '..Q..U...f...V..B..U.Q..', '#################B######', '########################', G, G]),
    // suelo inestable sobre un foso de espinas
    um_unstable_run: pt(9, ['..........Y.............', E, E, '...........d............', '..F.....................', '####TTTT....TTTT....####', '####^^^^^^^^^^^^^^^^####', G]),
    um_unstable_climb: pt(4, ['..................o.....', '.................TTTT...', E, '...........TTT..........', E, '......TTT...............', E, '..TTT..........Y........', E, '..F.......l..........L..', ...G3]),
    // cavernas en oscuridad absoluta: umbrátiles y faroles de geoda
    um_dark_cave_a: pt(0, [...solid(5), '#######.........########', '####..............######', '###..W.........W.....###', E, E, '.........====...........', E, '..L.......Y.......W..L..', ...G3, G]),
    um_dark_cave_b: pt(0, [...solid(4), '######.......###########', '###..........|.....#####', '##...........|.......###', '#....W.......|.........#', '.............|..........', '...====......|....====..', E, E, '..Z.......W......Y...L..', ...G3, G]),
    // abismo con puentes de cristal que aparecen y desaparecen
    um_abyss_bridge: pt(8, ['..........Y.............', E, E, '......J.....J.....J.....', E, '..F.....................', '###...................##', '###^^^^^^^^^^^^^^^^^^^##', G]),
    um_abyss_pulse: pt(7, ['.................Y......', E, '............J...........', E, '.......J........J.......', E, '..Z.....................', '#####.............######', '#####^^^^^^^^^^^^^######', G]),
    // montañas negras con grietas luminosas y filamentos para trepar
    um_mountain: pt(1, ['..........Y.............', E, E, '...........o............', '..........#####.........', '..........#####.........', '.....d....#####.........', '.......###########......', '.......###########......', '.......###########......', '....#################...', '.........B..............', '..F...V..B......c....L..', ...G3]),
    // gran caverna subterránea: geodas resonantes y monolitos
    um_cavern: pt(0, [...solid(3), '######..........########', '###....................#', '##........Y.............', E, E, '...........=====........', E, E, '..Q.....U.......Q....h..', '#####bb#####bb##########', ...solid(4)]),
    // campo de cristales suspendidos y plataformas rítmicas
    um_float_field: pt(5, ['....Y.........Y.........', E, '.........J.........Y....', E, '....J.........J.........', '..............d.........', E, '..F......Q..........F...', '#########...############', '#########^^^############', G, G]),
    // ruinas andromedanas cubiertas de mineral
    um_ruins: pt(8, ['...........*............', '......RRRRRRRRRRRR......', '......R..........R......', '..===.R..........R......', E, '..O.......C.......Q.....', '######RRRRRRRRRRRR######', '######RRRRRRRRRRRR######', G]),
    // zona de corrupción purgable con un cristal de resonancia
    um_corruption: pt(8, ['................Y.......', E, '.......====.............', E, '..Z.......O.....O....F..', '...........l............', ...G3]),
    // barrera de cristal que solo se abre con la resonancia
    um_gate_puzzle: pt(2, ['..............G..Y......', '..............G.........', '..............G.........', '..............G.........', '..............G.........', '..............G.........', '..............G.........', '..............G.........', '..............G.........', '..............G.........', '..............G.........', '........Z.c...G.....L...', ...G3]),
    // instalación del régimen alimentada por energía roja
    um_facility: pt(0, [MM, MM, E, E, '....D..........D........', E, E, '...----........----.....', E, E, '.......MMM....MMM.......', E, '..........G.............', '..Z...s...G..n..s...Z...', ...M3]),
    // explosivos para despejar a un grupo de enemigos y un muro
    um_blast: pt(8, ['..................o.....', '.................BB.....', '...........====.BB......', E, '..V...c..V..c...BB..V...', '................BB......', '................BB......', ...G3].slice(0, 9).concat([])),
    um_checkpoint: pt(10, [E, '..........Y.............', '...................y....', '....L....k....h....Q....', ...G3]),
    um_extractor: pt(10, [E, '...==.............==....', '...................g....', '..K.......X.........c.y.', ...G3]),
    um_rescue: pt(10, [E, '..........Y.............', '...................y....', '....F......n.......c....', ...G3]),
    um_shrine: pt(9, ['..........RRRR..........', '.........RRRRRR.........', E, E, '..L..Q...r..u..r..Q..F..', ...G3]),
    um_secret: pt(9, ['............*...........', '..........SSSSS.........', '..........S...S.........', '..........S.C.S.........', '..F.......SSSSS....L....', E, ...G3, G].slice(0, 8)),
    um_elite: pt(8, [E, E, '...===............===...', E, E, '..Q.......A.........Q...', ...G3]),
    // refugio secreto de N-0: la cápsula de NOVA y tres cristales que alimentan la cámara
    um_refuge: pt(0, [MM, MM, E, E, '....D............D......', E, E, '...----.........----....', E, E, '.......MMM....MMM.......', E, E, '..Z.........n.......Z...', ...M3]),
    um_exit: pt(10, ['.........Y..............', '........###.............', '.......#####............', '..F...#######.....E.....', ...G3])
  });
  P.UM_DARK = ['um_dark_cave_a', 'um_dark_cave_b'];

  P.LV.umbrelia = {
    planet: 'umbrelia',
    levels: [
      { id: 1, name: 'Llanura de Obsidiana', sub: 'Donde la luz es roja', theme: 'plains', music: 'umbrelia', sky: 'dusk',
        rows: [['um_start', 'um_plains', 'um_gate_puzzle', 'um_checkpoint', 'um_plains_b', 'um_crystal_forest', 'um_extractor', 'um_plains', 'um_exit']],
        events: [], stars: [{ t: 'holo', id: 'h33' }],
        intro: [['elara', 'Descenso completado, {N}. UMBRÉLIA, la Penumbra Carmesí.'], ['elara', 'Aquí la luz no viene del cielo: viene de los cristales. Quédate cerca de ellos.'], ['elara', 'Los cristales de resonancia guardan energía. Dispárales y liberarán un pulso que abre las barreras de cristal.']] },
      { id: 2, name: 'Bosque de Cuarzo Rojo', sub: 'Columnas que laten', theme: 'forest', music: 'umbrelia', sky: 'day',
        rows: [['um_start', 'um_crystal_forest', 'um_blast', 'um_checkpoint', 'um_rescue', 'um_plains_b', 'um_blast', 'um_secret', 'um_extractor', 'um_exit']],
        events: [{ t: 'rescue', npc: 'kaelun' }], stars: [{ t: 'holo', id: 'h34' }, { t: 'res', crys: 2 }],
        intro: [['elara', 'Cristales inestables. Si les disparas, estallan: úsalos contra los enemigos o para derribar muros agrietados.'], ['elara', 'No te quedes al lado cuando parpadeen. Y detecto a un andromedano vivo en una jaula.']] },
      { id: 3, name: 'Cavernas Sin Luz', sub: 'La oscuridad respira', theme: 'cave', music: 'umbrelia', sky: 'dusk',
        rows: [['um_start', 'um_dark_cave_a', 'um_cavern', 'um_checkpoint', 'um_dark_cave_b', 'um_shrine', 'um_dark_cave_a', 'um_extractor', 'um_exit']],
        events: [], stars: [{ t: 'res', crys: 2 }], ups: ['vision'],
        intro: [['kaelun', 'Las Cavernas Sin Luz. Los umbrátiles solo se dejan ver cerca de la luz.'], ['kaelun', 'Usa los faroles de geoda y los pulsos de resonancia para orientarte. En el santuario guardamos el Ojo Umbrío.']] },
      { id: 4, name: 'Abismo de Cristal', sub: 'Puentes que vienen y van', theme: 'abyss', music: 'umbrelia', sky: 'dusk',
        rows: [['um_start', 'um_abyss_bridge', 'um_plains', 'um_checkpoint', 'um_abyss_pulse', 'um_unstable_run', 'um_abyss_bridge', 'um_extractor', 'um_exit']],
        events: [], stars: [{ t: 'holo', id: 'h35' }, { t: 'res', bio: 8 }],
        intro: [['kaelun', 'Los puentes de cristal laten a su ritmo: aparecen, brillan y se apagan. Cruza cuando estén firmes.'], ['kaelun', 'Algunos solo despiertan con un pulso de resonancia. Y cuidado con la obsidiana fina: se agrieta bajo tus pies.']] },
      { id: 5, name: 'Montes de la Grieta', sub: 'La montaña sangra luz', theme: 'mountain', music: 'umbrelia', sky: 'golden',
        rows: [['um_start', 'um_mountain', 'um_unstable_climb', 'um_checkpoint', 'um_elite', 'um_unstable_run', 'um_blast', 'um_extractor', 'um_exit']],
        events: [], stars: [{ t: 'holo', id: 'h36' }], arenaLock: true,
        intro: [['elara', 'Un Geodonte ha bajado de los montes. Su núcleo late dentro de la geoda: ese es su punto débil.']] },
      { id: 6, name: 'El Refugio Secreto', sub: 'Una señal llamada N-0', theme: 'facility', music: 'facility',
        rows: [['um_start', 'um_facility', 'um_refuge', 'um_checkpoint', 'um_facility', 'um_exit']],
        events: [{ t: 'transmission', who: 'merek', lines: [['merek', 'Así que has encontrado el refugio. Ella también lo encontró, hace mucho.'], ['merek', 'Despiértala si quieres, {N}. Pero recuerda quién la apagó.']] }, { t: 'nova' }],
        stars: [{ t: 'holo', id: 'h37' }], intro: [['elara', 'Esta instalación no aparece en ningún registro del régimen. La energía viene de los cristales.'], ['elara', 'Hay una cápsula de estasis dentro. Los cristales de la cámara están descargados.']] },
      { id: 7, name: 'Gran Caverna Carmesí', sub: 'El corazón hueco del planeta', theme: 'cave', music: 'umbrelia', sky: 'dusk',
        rows: [['um_start', 'um_cavern', 'um_corruption', 'um_checkpoint', 'um_dark_cave_b', 'um_cavern', 'um_shrine', 'um_extractor', 'um_exit']],
        events: [], stars: [{ t: 'res', crys: 3 }], ups: ['esquirla'],
        intro: [['kaelun', 'La corrupción del régimen se acumula aquí. Si la atraviesas te drenará hasta dejarte al límite, pero nunca te matará.'], ['kaelun', 'Un pulso de resonancia la disipa un rato. En el santuario está el Lanzaesquirlas de mi pueblo.']] },
      { id: 8, name: 'Campos Suspendidos', sub: 'Cristales que olvidaron caer', theme: 'field', music: 'umbrelia', sky: 'day',
        rows: [['um_start', 'um_float_field', 'um_plains_b', 'um_checkpoint', 'um_abyss_pulse', 'um_float_field', 'um_gate_puzzle', 'um_extractor', 'um_exit']],
        events: [], stars: [{ t: 'holo', id: 'h38' }, { t: 'mem', id: 'm10' }],
        intro: [['elara', 'Cristales que flotan sin nada que los sostenga. Mis sensores no lo entienden.'], ['kaelun', 'Son los ecos de la gran resonancia. Antes cantaban.']] },
      { id: 9, name: "Ruinas de Vel'Umbra", sub: 'La ciudad que se volvió mineral', theme: 'ruins', music: 'umbrelia', sky: 'golden',
        rows: [['um_start', 'um_ruins', 'um_corruption', 'um_checkpoint', 'um_unstable_climb', 'um_ruins', 'um_shrine', 'um_secret', 'um_extractor', 'um_exit']],
        events: [], stars: [{ t: 'res', crys: 3 }, { t: 'holo', id: 'h39' }, { t: 'res', bio: 8 }, { t: 'holo', id: 'h40' }], ups: ['obsidiana'],
        intro: [["kaelun", "Vel'Umbra era nuestra capital. Los cristales crecieron sobre ella cuando el régimen apagó el sol."], ['kaelun', 'En el santuario guardamos la Piel de Obsidiana: la corrupción no podrá tocarte.']] },
      { id: 10, name: 'Forja de la Penumbra', sub: 'Donde el régimen bebe de los cristales', theme: 'lab', music: 'facility',
        rows: [['um_start', 'lab_a', 'um_facility', 'um_checkpoint', 'lab_b', 'um_facility', 'lab_a', 'um_exit']],
        events: [{ t: 'transmission', who: 'thersek', lines: [['thersek', 'ARACHNARA tejía redes de luz entre los cristales. Le di hambre. Mucha hambre.'], ['thersek', 'Ahora teje con lo que sea que caiga en su nido. ¿Vienes, K-7?']] }],
        stars: [], intro: [['elara', 'La forja del régimen. Desde aquí drenan la energía de los cristales hacia la Esfera.']] },
      { id: 11, name: 'Nido de ARACHNARA', sub: 'Guarida de la Madre Arácnida', theme: 'boss', music: 'boss', boss: 'arachnara', sky: 'dusk', arena: 'arachnara',
        intro: [['elara', 'Firma biológica enorme en el techo de la caverna. ARACHNARA, la Madre Arácnida Roja.'], ['elara', 'Sus patas son de cristal: no le hagas caso a la coraza y espera a que baje el abdomen.'], ['kaelun', 'Si teje la red de luz, no pises los hilos encendidos. Cuando se cuelgue del techo, ¡dispárale al vientre!']] }
    ],
    overworld: {
      w: 60, h: 34, ship: [5, 15], village: [30, 17],
      portals: [[12, 7], [20, 4], [26, 9], [36, 5], [47, 6], [54, 14], [50, 25], [40, 29], [28, 28], [16, 26], [53, 30]],
      lake: [44, 18, 3, 2],
      layout: { paths: 'curvy', plaza: 'none', border: 'cliff', mesas: [[19, 15, 3, 2.2], [40, 12, 3.5, 2.5], [37, 22, 2.4, 1.8], [10, 30, 2.4, 1.6], [56, 21, 2, 2.6]],
        cracks: [[8, 20, 22, 23], [33, 31, 46, 22], [42, 8, 52, 11], [23, 5, 30, 12]], lakes: [[44, 18, 3, 2], [21, 30, 2.4, 1.5]],
        clusters: true, decor: { tree: 0.05, rock: 0.06, goo: 0.04, lamp: 0.02 }, houses: [[-8, -6], [6, -7], [-9, 2], [7, 3], [0, -9]] },
      intro: [['elara', 'UMBRÉLIA. Un valle de obsidiana bajo un sol eclipsado. Solo los cristales dan luz.'], ['elara', 'Cada portal lleva a un territorio drenado por las extractoras. Libéralos y los cristales volverán a latir en rojo.']]
    }
  };
})();
