'use strict';
// VÉRZARA: biblioteca de chunks (24x17), niveles y mapa exterior
// Teselas: . aire  # suelo  R ruina  M metal  = rama (un sentido)  - rejilla  ~ líquido  ^ espinas  | liana  B rompible  S muro secreto  b saltabulbo
// Entidades: P inicio  E salida  k baliza  X extractora  C cofre  h salvia  * objeto  u mejora  n evento
//  c krazith  K krazith ciber  A alfa  f fluorílido  d zumbadera  D zumbadrón/dron  l limaco  p fauces  v gorgovaina  s soldado
//  g bramoco (solo restaurado)  y orquídea (solo restaurado)  o recursos  L lumbrela  F helecho  m tóxomiceto  U sombrilla micélica  r pilar
P.LV = P.LV || {};
const E = '........................';
const G3 = ['########################', '########################', '########################'];
const ch = (rows) => { const out = []; for (let i = 0; i < 17; i++) out.push(((rows[i] || E) + E).slice(0, 24)); return out; };
const padTop = (n, rows) => { const r = []; for (let i = 0; i < n; i++) r.push(E); return ch(r.concat(rows)); };

P.CHUNKS = {
  air: ch([]),
  start: padTop(10, ['.................L......', '...............======...', '........................', '..P....n.....h......F...', ...G3]),
  flat_a: padTop(10, ['........................', '.........c..............', '.......#####........y...', '....F.#######....c...F..', ...G3]),
  flat_b: padTop(10, ['..............o.........', '.............===........', '......f............g....', '...L.......y.......c..F.', ...G3]),
  steps: padTop(9, ['..............f.........', '...........#######......', '......o....#######..L...', '.....#############.####.', '...F.#############.####.', ...G3]),
  gap_small: padTop(8, ['', '', '..........o.............', '.........===............', '.....d..................', '..F...................y.', '#########...############', '#########...############', '#########...############']),
  pond: padTop(9, ['', '', '........====..====......', '.........d.......d......', '..F...................L.', '######~~~~~~~~~~~~######', '######~~~~~~~~~~~~######', '########################']),
  swamp_long: padTop(8, ['', '...........===..........', '', '........p.........l.....', '.......###.......###....', '......#####....#####....', '###~~~#####~~~~#####~~##', '###~~~#####~~~~#####~~##', '########################']),
  thorns: padTop(11, ['.......o.........o......', '.....====.....=====.....', '....^^^^...f.^^^^^......', ...G3]),
  tree_climb: padTop(3, ['............C...........', '..........|=======......', '..........|.............', '..........|.............', '..........|.............', '......===.|.............', '..........|.............', '..........|.............', '..........|.............', '..........|.............', '..F.......|.......c.y...', ...G3]),
  canopy_high: padTop(8, ['...............*........', '.............#####......', '.............#####......', '........................', '........................', '.....F........L.....f...', ...G3]),
  cave: ch(['########################', '########################', '########################', '########################', '#####.......############', '###...........######....', '......v............v....', '........................', '........................', '........................', '..............BBB.......', '..............B*B.......', '..............BBB.......', '......l...m.............', ...G3]),
  ruins_a: padTop(9, ['..............*.........', '...........RRRRRRR......', '........................', '.....RRRRR..............', '..r.......r.......s.r...', 'RRRRRRRRRRRRRRRRRRRRRRRR', 'RRRRRRRRRRRRRRRRRRRRRRRR', 'RRRRRRRRRRRRRRRRRRRRRRRR']),
  ruins_b: padTop(5, ['......RRRRRRRRRRRR......', '......R..........R......', '......R....L.....R......', '......R..........R......', '......R..........R......', '......R..........R......', '...........C............', '.........RRRRR..........', '...r.......h.....u..r...', 'RRRRRRRRRRRRRRRRRRRRRRRR', 'RRRRRRRRRRRRRRRRRRRRRRRR', 'RRRRRRRRRRRRRRRRRRRRRRRR']),
  facility_a: ch(['MMMMMMMMMMMMMMMMMMMMMMMM', 'MMMMMMMMMMMMMMMMMMMMMMMM', '........................', '.....D..............D...', '........................', '........................', '........................', '........................', '........................', '........................', '...........----.........', '........................', '......MMM.........MMM...', '..s.......o...........s.', 'MMMMMMMMMMMMMMMMMMMMMMMM', 'MMMMMMMMMMMMMMMMMMMMMMMM', 'MMMMMMMMMMMMMMMMMMMMMMMM']),
  facility_b: ch(['MMMMMMMMMMMMMMMMMMMMMMMM', 'MMMMMMMMMMMMMMMMMMMMMMMM', '', '', '', '', '', '', '', '', '', '..-----...........----..', '', '...s.......X.......K....', 'MMMMMMMMMMMMMMMMMMMMMMMM', 'MMMMMMMMMMMMMMMMMMMMMMMM', 'MMMMMMMMMMMMMMMMMMMMMMMM']),
  cell: ch(['MMMMMMMMMMMMMMMMMMMMMMMM', 'MMMMMMMMMMMMMMMMMMMMMMMM', '........................', '........................', '........................', '........................', '.......D................', '........................', '........................', '........................', '........................', '...............MMMMM....', '........................', '..s........n.......s....', 'MMMMMMMMMMMMMMMMMMMMMMMM', 'MMMMMMMMMMMMMMMMMMMMMMMM', 'MMMMMMMMMMMMMMMMMMMMMMMM']),
  extractor_jungle: padTop(10, ['........................', '...==.............==....', '...................g....', '..K.......X.........c.y.', ...G3]),
  checkpoint: padTop(10, ['........................', '........................', '...................y....', '....L....k....h....F....', ...G3]),
  mushroom: padTop(8, ['................*.......', '..............====......', '........................', '...........U............', '........................', '.....m...b.......m....f.', ...G3]),
  bounce_gap: padTop(6, ['..........*.............', '.........====...........', '........................', '........................', '..........===...........', '...............===...d..', '.......b.....b..........', '.......#.....#..........', '#####..#.....#....######', '#####..#.....#....######', '#####..#.....#....######']),
  nest: padTop(10, ['..........cc............', '.........####......K....', '...c....######...c...y..', '..F.....................', ...G3].slice(0, 3).concat(G3)),
  river: padTop(11, ['........................', '.....===.....===....===.', '..d.........d...........', '###~~~~~~~~~~~~~~~~~~###', '###~~~~~~~~~~~~~~~~~~###', '########################']),
  elite_arena: padTop(9, ['', '', '...===............===...', '', '...........A............', ...G3]),
  rescue: padTop(10, ['........................', '........................', '...................y....', '....F......n.......c....', ...G3]),
  exit: padTop(10, ['.........L..............', '........###.............', '.......#####............', '..F...#######.....E.....', ...G3]),
  lab_a: ch(['MMMMMMMMMMMMMMMMMMMMMMMM', 'MMMMMMMMMMMMMMMMMMMMMMMM', '', '', '......D.................', '', '', '', '', '', '', '.....MMMM.....----......', '...................K....', '..f......n......K.......', 'MMMMMMMMMMMMMMMMMMMMMMMM', 'MMMMMMMMMMMMMMMMMMMMMMMM', 'MMMMMMMMMMMMMMMMMMMMMMMM']),
  lab_b: ch(['MMMMMMMMMMMMMMMMMMMMMMMM', 'MMMMMMMMMMMMMMMMMMMMMMMM', '........................', '........................', '.................D......', '........................', '........................', '........................', '........................', '....----................', '........................', '..........MMMM....MMM...', '........................', '...s.....D.....s......o.', 'MMMMMMMMMMMMMMMMMMMMMMMM', 'MMMMMMMMMMMMMMMMMMMMMMMM', 'MMMMMMMMMMMMMMMMMMMMMMMM']),
  dark_canopy: padTop(9, ['', '....L.........L.........', '...=====....=====.......', '........d...........d...', '..L........L.......f....', ...G3]),
  secret_room: padTop(9, ['............*...........', '........#############...', '........S...n....C..#...', '.....###S...........####', '.....###S...........####', ...G3]),
  climb_up: ch(['...........|............', '...........|............', '...........|............', '...........|............', '...........|............', '...........|............', '...........|............', '...........|............', '...........|............', '...........|............', '.......===.|............', '...........|............', '...........|............', '..F........|....c...L...', ...G3]),
  sky_landing: ch(['', '', '', '', '', '', '', '', '...........*............', '.........========.......', '...........|............', '...........|.......=====', '...........|............', '...........|............', '...........|............', '...........|............', '...........|............']),
  sky_a: ch(['', '', '', '', '.......*................', '......====..............', '', '.............C..........', '............=====.......', '', '.......====.............', '=====...........d...====', '', '', '', '', '']),
  sky_b: ch(['', '', '', '', '', '', '', '...............*........', '..............====......', '', '.......====.............', '====..............=====.', '', '', '', '', '']),
  sky_secret: ch(['', '', '', '', '', '...........*............', '..........====..........', '', '.....====.......d.......', '', '..====.............====.', '', '', '', '', '', ''])
};
// nido: corregido para 17 filas
P.CHUNKS.nest = padTop(10, ['........................', '..........cc............', '.........####......K....', '...c....######...c...y..', ...G3]);

P.BOSS_ARENA = ['#............................#', '#............................#', '#............................#', '#............................#', '#............................#', '#............................#', '#............................#', '#............................#', '#............................#', '#............................#', '#....=====..........=====....#',
  '#............................#', '#............................#', '#..P.........................#', '##############################', '##############################', '##############################'];

P.LV.verzara = {
  planet: 'verzara',
  levels: [
    { id: 1, name: 'Claro del Despertar', sub: 'El primer aliento de la selva', theme: 'jungle', music: 'verzara',
      rows: [['start', 'flat_a', 'steps', 'checkpoint', 'gap_small', 'tree_climb', 'extractor_jungle', 'flat_b', 'exit']],
      events: [{ t: 'tip', text: 'Muévete con ←→ / A D. Salta con ESPACIO (mantén para saltar más alto).', tutorial: 'move' }],
      stars: [{ t: 'holo', id: 'h1' }], tips: true,
      intro: [['elara', 'Descenso completado, {N}. Bienvenido a VÉRZARA, la Fronda Bioluminiscente.'], ['elara', 'Detecto una extractora Esquelética drenando la energía de este claro. Destrúyela y la selva podrá respirar.'], ['elara', 'ATAQUE: {attack}. DEFENSA (mantener): {defend}. SUPERATAQUE: {super}. Esquivar: {dash}.']] },
    { id: 2, name: 'Pantano de Fluorita', sub: 'Aguas que brillan y queman', theme: 'swamp', music: 'verzara',
      rows: [['start', 'pond', 'swamp_long', 'checkpoint', 'rescue', 'thorns', 'canopy_high', 'pond', 'extractor_jungle', 'swamp_long', 'exit']],
      events: [{ t: 'rescue', npc: 'sylae' }], stars: [{ t: 'holo', id: 'h2' }],
      intro: [['elara', 'El agua del pantano está contaminada: no permanezcas mucho tiempo en ella.'], ['elara', 'Capto una firma de vida pleyadiana. Alguien sigue aquí.']] },
    { id: 3, name: 'Raíces del Ceibárbora', sub: 'Hacia el dosel del árbol más antiguo', theme: 'jungle', music: 'verzara',
      rows: [['air', 'sky_landing', 'sky_a', 'sky_b', 'sky_secret', 'air', 'air', 'air', 'air', 'air'],
        ['start', 'climb_up', 'flat_a', 'cave', 'checkpoint', 'tree_climb', 'canopy_high', 'extractor_jungle', 'steps', 'exit']],
      events: [], stars: [{ t: 'res', crys: 2 }, { t: 'holo', id: 'h3' }, { t: 'res', bio: 6 }, { t: 'mem', id: 'm1' }, { t: 'res', crys: 1 }],
      intro: [['elara', 'Las lianas de Vidlumbre resisten tu peso. Mantén ↑ junto a una para trepar.']] },
    { id: 4, name: 'Ruinas de Lirae', sub: 'El templo de los botánicos', theme: 'ruins', music: 'verzara',
      rows: [['start', 'ruins_a', 'steps', 'ruins_b', 'checkpoint', 'canopy_high', 'secret_room', 'ruins_a', 'extractor_jungle', 'exit']],
      events: [{ t: 'rescue', npc: 'mnemo', hidden: true }], stars: [{ t: 'holo', id: 'h4' }, { t: 'res', crys: 2 }, { t: 'res', bio: 8 }, { t: 'res', crys: 1 }], ups: ['doble_salto'],
      intro: [['sylae', 'Lirae... mi ciudad. El templo guardaba una reliquia: el Propulsor de Esporas. Úsalo, {N}.']] },
    { id: 5, name: 'Río Fluorescente', sub: 'La corriente que une la selva', theme: 'swamp', music: 'verzara',
      rows: [['start', 'river', 'gap_small', 'river', 'checkpoint', 'elite_arena', 'bounce_gap', 'river', 'extractor_jungle', 'exit']],
      events: [], stars: [{ t: 'holo', id: 'h5' }], arenaLock: true,
      intro: [['elara', 'Lectura anómala río abajo: un Krazith de tamaño excesivo. Mutación por radiación, probablemente.']] },
    { id: 6, name: 'Extractora Gris-7', sub: 'Instalación del régimen', theme: 'facility', music: 'facility',
      rows: [['start', 'facility_a', 'facility_b', 'checkpoint', 'facility_a', 'cell', 'facility_b', 'exit']],
      events: [{ t: 'rescue', npc: 'kairo' }], stars: [{ t: 'holo', id: 'h6' }, { t: 'res', scrap: 10 }],
      intro: [['elara', 'Una instalación completa del régimen. Dos extractoras. Cuidado con los Legionarios Esqueléticos.']],
      outro: [['gerselle', 'Unidad sin registrar en VÉRZARA. Soy Gerselle, Primera Ministra de la República Solar. La legítima.'], ['gerselle', 'Has destruido propiedad del Estado. Ríndete y serás reciclado con honores, {N}. Sí, conozco tu nombre.']] },
    { id: 7, name: 'Bosque de Esporas', sub: 'Donde el aire tiene memoria', theme: 'jungle', music: 'verzara',
      rows: [['start', 'mushroom', 'bounce_gap', 'mushroom', 'checkpoint', 'ruins_b', 'cave', 'extractor_jungle', 'mushroom', 'exit']],
      events: [], stars: [{ t: 'res', crys: 1 }, { t: 'holo', id: 'h7' }, { t: 'res', bio: 10 }, { t: 'res', crys: 2 }], ups: ['espinas'],
      intro: [['sylae', 'Las Sombrillas Micélicas conectan toda la selva. Si escuchas con atención, casi parecen susurrar.']] },
    { id: 8, name: 'Nido de Krazith', sub: 'El hogar de la especie dominante', theme: 'jungle', music: 'verzara',
      rows: [['start', 'nest', 'steps', 'nest', 'checkpoint', 'cave', 'secret_room', 'nest', 'extractor_jungle', 'exit']],
      events: [{ t: 'rescue', npc: 'ssaru', hidden: true }], stars: [{ t: 'res', crys: 2 }, { t: 'mem', id: 'm2' }, { t: 'res', bio: 10 }],
      intro: [['elara', 'El nido de los Krazith. Los naturales solo defienden su territorio; los cibernéticos atacan a todo.']] },
    { id: 9, name: 'Dosel Nocturno', sub: 'La selva bajo un sol encerrado', theme: 'dark', music: 'verzara', dark: true,
      rows: [['air', 'air', 'sky_landing', 'sky_a', 'sky_secret', 'air', 'air', 'air', 'air'],
        ['start', 'dark_canopy', 'climb_up', 'dark_canopy', 'checkpoint', 'ruins_b', 'dark_canopy', 'extractor_jungle', 'exit']],
      events: [], stars: [{ t: 'res', crys: 2 }, { t: 'res', bio: 8 }, { t: 'res', crys: 3 }, { t: 'res', crys: 1 }], ups: ['membrana'],
      intro: [['elara', 'Sin la luz de Plenuria, el dosel vive en noche perpetua. Las Lumbrelas serán tu única guía.']] },
    { id: 10, name: 'Laboratorio Sección V', sub: 'Los experimentos de Thersek', theme: 'lab', music: 'facility',
      rows: [['start', 'lab_a', 'lab_b', 'checkpoint', 'lab_a', 'facility_b', 'lab_b', 'facility_b', 'exit']],
      events: [{ t: 'transmission', who: 'thersek', lines: [['thersek', 'Ah, la pieza que faltaba. ¿Sabes lo que llevas dentro, pequeño soldado?'], ['thersek', 'Mi querido Krazthor lleva un trocito de lo mismo. Ve a saludarlo, {N}. Os parecéis más de lo que crees.']] }],
      stars: [{ t: 'holo', id: 'h8' }],
      intro: [['elara', 'Laboratorio biológico de Thersek. Aquí crearon a las criaturas cibernéticas. Ten cuidado, {N}.']] },
    { id: 11, name: 'Fosa de Coral Espinado', sub: 'Guarida de KRAZTHOR', theme: 'boss', music: 'boss', boss: 'krazthor',
      intro: [['elara', 'Firma colosal detectada. KRAZTHOR, el antiguo rey de los Krazith.'], ['elara', 'Thersek le injertó un cañón prismático. Cuando se sobrecaliente, ataca el núcleo del cañón.'], ['elara', 'Si apunta el rayo a ras de suelo, agáchate. Si lo eleva, baja de las ramas. Y usa la DEFENSA contra sus púas.']] }
  ],
  overworld: {
    w: 54, h: 34, ship: [5, 5], village: [23, 17],
    portals: [[7, 12], [13, 19], [8, 26], [18, 28], [29, 25], [37, 28], [41, 18], [34, 10], [45, 7], [49, 15], [48, 27]],
    lake: [30, 6, 6, 3]
  }
};
// Simulación holográfica de la Zona de entrenamiento
P.LV.sim = { planet: 'sim', levels: [{ id: 1, name: 'Simulación de combate', sub: 'Hologramas de entrenamiento de Ssaru', theme: 'lab', music: 'facility', sim: true,
  rows: [['start', 'lab_a', 'elite_arena', 'lab_b', 'facility_a', 'nest', 'thorns', 'flat_a']], events: [], stars: [] }] };
