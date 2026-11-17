'use strict';
// XÉRTHA: chunks propios (24x17), niveles y valle exterior de la colmena.
// En este planeta: T resina pegajosa (frena) · G tapón de cera (se abre con energía biológica) · ~ miel
// Z cámara de energía biológica · J plataforma de panal (se contrae y se expande, o se extiende con energía)
// O nube de polen (dorada: revela panales · densa: tapa la vista) · Y conducto orgánico (lleva al conducto pareja)
// V nido que suelta zumbópteros · W guardián de colmena · Q cámara de incubación luminosa · b vejiga de néctar
// Los chunks «xe_ancient*» son profundidades sin luz.
(function () {
  const E = '........................', G = '########################', MM = 'MMMMMMMMMMMMMMMMMMMMMMMM';
  const G3 = [G, G, G], M3 = [MM, MM, MM];
  const pt = (n, rows) => { const out = []; for (let i = 0; i < n; i++) out.push(E); out.push(...rows); if (out.length !== 17 || out.some(r => r.length !== 24)) throw new Error('chunk XÉRTHA mal formado: ' + out.length + ' filas · ' + rows.find(r => r.length !== 24)); return out; };
  const solid = n => { const r = []; for (let i = 0; i < n; i++) r.push(G); return r; };
  const col = (x, ch, n) => { const r = []; for (let i = 0; i < n; i++) r.push('.'.repeat(x) + ch + '.'.repeat(23 - x)); return r; };
  Object.assign(P.CHUNKS, {
    xe_start: pt(10, [E, '...............Q........', '.........=====..........', '..P........L.......F....', ...G3]),
    // llanuras exteriores de la colmena
    xe_plains: pt(9, [E, '.....d..............d...', E, '.......===......===.....', '..Q.....c....Q......F...', ...G3]),
    xe_plains_b: pt(8, ['..............o.........', E, '...........====.........', E, '...===.............===..', '.L......l....Q.....c....', ...G3]),
    // bosque de antenarias y árboles-panal
    xe_forest: pt(8, ['...........*............', '..........===...........', E, '....===..........===....', E, '..F..U...f...U..F...F...', ...G3]),
    // llanuras de resina pegajosa entre charcas de miel
    xe_resin_flats: pt(9, ['............o...........', '...........===..........', E, '..F.....................', '###TTTTTT##~~~~##TTTT###', '###TTTTTT##~~~~##TTTT###', G, G]),
    xe_honey_pools: pt(8, ['......o..........o......', '.....===........===.....', E, '..L.....................', '####~~~~##b#~~~~~~######', '####~~~~####~~~~~~######', '####~~~~####~~~~~~######', G, G]),
    // túneles de cera con nidos y colgapanales
    xe_tunnel: pt(0, [...solid(4), '#######.........########', '####..............######', '###...v.........v....###', E, E, '.........====...........', E, E, '..L....V.....W.....Q....', ...G3, G]),
    // conducto orgánico que sube a una cornisa inalcanzable
    xe_conduit: pt(3, ['..............o..o......', '.............Y..........', '............#########...', E, E, E, E, E, E, E, '..Y......c..........F...', ...G3]),
    // cámaras de incubación: nidos, celdas luminosas y polen denso
    xe_incubator: pt(0, [...solid(3), '####..........#####.####', '##....................##', '#..........Q............', E, E, '....=====.......====....', E, E, E, '..Q...V....O.....V...Q..', ...G3, G]),
    // ciudad colmena
    xe_city: pt(8, ['...........*............', '......RRRRRRRRRRRR......', '......R..........R......', '..===.R..........R......', E, '..Q.......C.......Q.....', '######RRRRRRRRRRRR######', '######RRRRRRRRRRRR######', G]),
    // puerta de cera que abre una cámara de energía biológica
    xe_city_gate: pt(2, [...col(14, 'G', 11), '........Z.l...G.....L...', ...G3]),
    // puentes suspendidos que se extienden con energía
    xe_bridges: pt(7, ['.................d......', E, '............J...........', E, '.......J........J.......', E, '..Z.....................', '#####.............######', '#####^^^^^^^^^^^^^######', G]),
    // panales que se contraen y se expanden sobre un foso de quitina
    xe_bridges_b: pt(8, ['..........d.............', E, E, '......J.....J.....J.....', E, '..F.....................', '###...................##', '###^^^^^^^^^^^^^^^^^^^##', G]),
    // nubes de polen dorado que revelan panales ocultos
    xe_pollen: pt(5, ['..................*.....', '.................===....', E, '............J...........', E, '.......J................', E, '..O.......d.....O.......', '...........l............', ...G3]),
    // fábrica melífera del régimen
    xe_factory: pt(0, [MM, MM, E, E, '....D..........D........', E, E, '...----........----.....', E, E, '.......MMM....MMM.......', E, '..........G.............', '..Z...s...G..n..s...Z...', 'MMMMMTTTTMMMMMMTTTTMMMMM', MM, MM]),
    // profundidades de la colmena ancestral (sin luz)
    xe_ancient: pt(0, [...solid(4), '######..........########', '###.....................', '##...W..........W.......', E, E, '........=====...........', E, E, '..Q.......O.......W..Q..', ...G3, G]),
    // zona protegida por guardianes
    xe_guardian: pt(8, ['..........o.o.o.........', '.........#######........', E, E, E, '..F......W......W....L..', ...G3]),
    // ascenso con vejigas de néctar
    xe_climb: pt(4, ['..................o.....', '.................####...', E, E, E, '..........====..........', E, E, E, '..b.....f.......b.......', ...G3]),
    xe_checkpoint: pt(10, [E, '..........L.............', '...................y....', '....F....k....h....Q....', ...G3]),
    xe_extractor: pt(10, [E, '...==.............==....', '...................g....', '..K.......X.........c.y.', ...G3]),
    xe_rescue: pt(10, [E, '..........L.............', '...................y....', '....F......n.......c....', ...G3]),
    xe_shrine: pt(9, ['..........RRRR..........', '.........RRRRRR.........', E, E, '..L..Q...r..u..r..Q..F..', ...G3]),
    xe_secret: pt(9, ['............*...........', '..........SSSSS.........', '..........S...S.........', '..........S.C.S.........', '..F.......SSSSS....L....', ...G3]),
    xe_elite: pt(8, [E, E, '...===............===...', E, E, '..Q.......A.........Q...', ...G3]),
    xe_exit: pt(10, ['.........L..............', '........###.............', '.......#####............', '..F...#######.....E.....', ...G3])
  });
  P.XE_DARK = ['xe_ancient'];

  P.LV.xertha = {
    planet: 'xertha',
    levels: [
      { id: 1, name: 'Llanuras de la Colmena', sub: 'Donde el suelo es panal', theme: 'plains', music: 'xertha', sky: 'day',
        rows: [['xe_start', 'xe_plains', 'xe_honey_pools', 'xe_checkpoint', 'xe_plains_b', 'xe_city_gate', 'xe_extractor', 'xe_plains', 'xe_exit']],
        events: [], stars: [{ t: 'holo', id: 'h49' }],
        intro: [['elara', 'Descenso completado, {N}. XÉRTHA, la Gran Colmena Hexagonal.'], ['elara', 'Todo aquí parece vivo: el suelo, las torres, hasta las montañas. Son colmenas.'], ['elara', 'Las cámaras de energía biológica abren los tapones de cera. Dispárales para activarlas.']] },
      { id: 2, name: 'Bosque de Antenarias', sub: 'Ramas que escuchan', theme: 'forest', music: 'xertha', sky: 'golden',
        rows: [['xe_start', 'xe_forest', 'xe_climb', 'xe_checkpoint', 'xe_rescue', 'xe_forest', 'xe_pollen', 'xe_secret', 'xe_extractor', 'xe_exit']],
        events: [{ t: 'rescue', npc: 'zelvan' }], stars: [{ t: 'holo', id: 'h50' }, { t: 'res', crys: 2 }],
        intro: [['elara', 'Las nubes de polen dorado hacen crecer panales donde antes no había nada. Atraviésalas.'], ['elara', 'Detecto a un arturiano vivo en una jaula del régimen.']] },
      { id: 3, name: 'Mares de Resina', sub: 'Ámbar que no suelta', theme: 'resin', music: 'xertha', sky: 'day',
        rows: [['xe_start', 'xe_resin_flats', 'xe_honey_pools', 'xe_checkpoint', 'xe_resin_flats', 'xe_shrine', 'xe_climb', 'xe_extractor', 'xe_exit']],
        events: [], stars: [{ t: 'res', crys: 2 }], ups: ['adherencia'],
        intro: [['zelvan', 'La resina ámbar te frena: pisarla es como caminar sobre miel fría.'], ['zelvan', 'En el santuario guardamos las Patas Adherentes. Con ellas la resina no te detendrá.']] },
      { id: 4, name: 'Túneles de Cera', sub: 'La colmena por dentro', theme: 'cave', music: 'xertha', sky: 'dusk',
        rows: [['xe_start', 'xe_tunnel', 'xe_conduit', 'xe_checkpoint', 'xe_tunnel', 'xe_conduit', 'xe_extractor', 'xe_exit']],
        events: [], stars: [{ t: 'holo', id: 'h51' }, { t: 'res', bio: 8 }],
        intro: [['zelvan', 'Los conductos orgánicos llevan de una cámara a otra. Entra en uno y saldrás por su pareja.'], ['zelvan', 'Y cuidado con los nidos: sueltan zumbópteros mientras sigan en pie.']] },
      { id: 5, name: 'Cámaras de Incubación', sub: 'Miles de celdas que respiran', theme: 'cave', music: 'xertha', sky: 'dusk',
        rows: [['xe_start', 'xe_incubator', 'xe_tunnel', 'xe_checkpoint', 'xe_elite', 'xe_incubator', 'xe_guardian', 'xe_extractor', 'xe_exit']],
        events: [], stars: [{ t: 'holo', id: 'h52' }], arenaLock: true,
        intro: [['zelvan', 'Las cámaras de incubación brillan cuando algo se acerca. Y un Acorazado Melífero guarda la sala central.'], ['elara', 'Thersek lo ha blindado. Busca las juntas de su caparazón.']] },
      { id: 6, name: 'Ciudad Colmena', sub: 'Una civilización dentro de un panal', theme: 'city', music: 'xertha', sky: 'golden',
        rows: [['xe_start', 'xe_city', 'xe_city_gate', 'xe_checkpoint', 'xe_city', 'xe_guardian', 'xe_secret', 'xe_extractor', 'xe_exit']],
        events: [], stars: [{ t: 'holo', id: 'h53' }, { t: 'mem', id: 'm14' }],
        intro: [['zelvan', 'Nuestra ciudad. Los guardianes de colmena protegen las calles: su escudo para todo lo que llega de frente.'], ['zelvan', 'Rodéalos o espera a que bajen el escudo para atacar.']] },
      { id: 7, name: 'Puentes Suspendidos', sub: 'Entre torres del tamaño de montañas', theme: 'bridges', music: 'xertha', sky: 'dusk',
        rows: [['xe_start', 'xe_bridges_b', 'xe_bridges', 'xe_checkpoint', 'xe_bridges', 'xe_shrine', 'xe_bridges_b', 'xe_extractor', 'xe_exit']],
        events: [], stars: [{ t: 'res', crys: 3 }], ups: ['aguijon'],
        intro: [['zelvan', 'Los panales flotantes se contraen y se expanden. Algunos puentes solo se extienden con energía biológica.'], ['zelvan', 'En el santuario está el Lanzaguijones.']] },
      { id: 8, name: 'Fábrica Melífera', sub: 'Producción sin descanso', theme: 'facility', music: 'facility',
        rows: [['xe_start', 'xe_factory', 'xe_resin_flats', 'xe_checkpoint', 'xe_factory', 'xe_conduit', 'xe_extractor', 'xe_exit']],
        events: [{ t: 'transmission', who: 'gerselle', lines: [['gerselle', 'La miel de XÉRTHA alimenta a media flota, K-7. ¿Vas a dejarnos sin postre?'], ['gerselle', 'La Reina ZYRKALIA no te dejará. Le dimos patas nuevas.']] }],
        stars: [{ t: 'holo', id: 'h54' }], intro: [['elara', 'Una planta de producción: el régimen convierte la miel en combustible para la Esfera.']] },
      { id: 9, name: 'Colmena Ancestral', sub: 'Las profundidades más antiguas', theme: 'cave', music: 'xertha', sky: 'dusk',
        rows: [['xe_start', 'xe_ancient', 'xe_conduit', 'xe_checkpoint', 'xe_ancient', 'xe_shrine', 'xe_guardian', 'xe_secret', 'xe_extractor', 'xe_exit']],
        events: [], stars: [{ t: 'res', crys: 3 }, { t: 'holo', id: 'h55' }, { t: 'res', bio: 8 }, { t: 'holo', id: 'h56' }], ups: ['cera'],
        intro: [['zelvan', 'La colmena ancestral. Aquí abajo la luz no llega y el polen es tan denso que no se ve nada.'], ['zelvan', 'En el santuario está la Coraza de Cera.']] },
      { id: 10, name: 'Laboratorio de la Reina', sub: 'Donde la convirtieron en máquina', theme: 'lab', music: 'facility',
        rows: [['xe_start', 'lab_a', 'xe_factory', 'xe_checkpoint', 'lab_b', 'xe_factory', 'lab_a', 'xe_exit']],
        events: [{ t: 'transmission', who: 'thersek', lines: [['thersek', 'ZYRKALIA era la mente de toda la colmena. Mil ojos, una sola voluntad.'], ['thersek', 'Le di patas de acero y un taladro. Ahora la colmena va donde yo digo.']] }],
        stars: [], intro: [['elara', 'El laboratorio donde Thersek transformó a la Reina. Desde aquí controlan sus patas.']] },
      { id: 11, name: 'Trono de ZYRKALIA', sub: 'Guarida de la Reina Esférica', theme: 'boss', music: 'boss', boss: 'zyrkalia', sky: 'dusk', arena: 'zyrkalia',
        intro: [['elara', 'Firma colosal. ZYRKALIA, la Reina Esférica Colménica, sobre patas de acero.'], ['elara', 'Cada celda es un ojo. Cuando hunda el taladro en el suelo, su ojo central quedará abierto: dispara ahí.'], ['zelvan', 'Sus patas golpean donde el suelo brilla. ¡Y no te quedes debajo cuando suelte el enjambre!']] }
    ],
    overworld: {
      w: 60, h: 34, ship: [5, 15], village: [30, 18],
      portals: [[12, 6], [22, 5], [33, 7], [44, 5], [53, 11], [54, 22], [46, 29], [35, 28], [22, 29], [12, 25], [52, 30]],
      lake: [41, 17, 3, 2],
      layout: { paths: 'curvy', plaza: 'round', border: 'cliff', mesas: [[18, 13, 3, 2.2], [42, 12, 3.4, 2.4], [38, 24, 2.6, 1.8], [10, 31, 2.2, 1.5]],
        cracks: [[4, 22, 28, 20], [32, 20, 56, 26], [30, 4, 30, 14]], lakes: [[41, 17, 3, 2], [20, 24, 2.4, 1.6]],
        clusters: true, decor: { tree: 0.08, rock: 0.06, goo: 0.03, lamp: 0.025 }, houses: [[-8, -6], [6, -7], [-9, 2], [7, 3], [0, -9]] },
      intro: [['elara', 'XÉRTHA. Un valle de panal y ríos de miel entre colmenas del tamaño de montañas.'], ['elara', 'Cada portal lleva a un territorio drenado por las extractoras. Libéralos y la colmena volverá a brillar.']]
    }
  };
})();
