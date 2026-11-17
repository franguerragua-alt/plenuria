'use strict';
// MYKORIS: chunks propios (24x17), niveles y bosque exterior.
// En este planeta: b seta elástica · T carne fúngica que se retrae con energía micelial · G membrana micelial
// Z nodo micelial · V bombaspora reactiva · O nube de esporas (niebla o reveladora) · J plataforma-pétalo / brote
// W camuflongo (seta que embosca) · Y seta resorte gigante · Q seta faro gigante. Los chunks «my_dark_*» son niebla de esporas densa.
(function () {
  const E = '........................', G = '########################', MM = 'MMMMMMMMMMMMMMMMMMMMMMMM';
  const G3 = [G, G, G], M3 = [MM, MM, MM];
  const pt = (n, rows) => { const out = []; for (let i = 0; i < n; i++) out.push(E); out.push(...rows); if (out.length !== 17 || out.some(r => r.length !== 24)) throw new Error('chunk MYKORIS mal formado: ' + out.length + ' filas · ' + rows.find(r => r.length !== 24)); return out; };
  const solid = n => { const r = []; for (let i = 0; i < n; i++) r.push(G); return r; };
  const col = (x, ch, n) => { const r = []; for (let i = 0; i < n; i++) r.push('.'.repeat(x) + ch + '.'.repeat(23 - x)); return r; };
  Object.assign(P.CHUNKS, {
    my_start: pt(10, [E, '...............Q........', '.........=====..........', '..P........L.......F....', ...G3]),
    // bosque de hongos colosales con repisas
    my_forest: pt(7, ['...........*............', '..........===...........', E, '....===..........===....', E, '.......d................', '..Q.....c....Q......F...', ...G3]),
    // campo de setas elásticas que llevan a una cornisa alta
    my_bounce_field: pt(4, ['...................o....', '..................####..', E, E, E, '.........====...........', E, E, E, '...b.....f.....b........', ...G3]),
    // seta resorte gigante
    my_spring: pt(3, ['..............o.........', '.............####.......', E, E, E, E, E, E, E, E, '....Y.........c.........', ...G3]),
    // valle de micelio: un nodo abre la membrana
    my_mycelium_valley: pt(2, [...col(14, 'G', 11), '........Z.l...G.....L...', ...G3]),
    // zona de crecimiento: la carne fúngica bloquea el paso hasta que el nodo la retrae (luego vuelve a crecer)
    my_growth: pt(6, ['.............#####......', '.............#####......', '.............#####......', '.............#####......', '...............T........', '...............T........', '...............T........', '..Z.....l......T....F...', ...G3]),
    // caverna con niebla de esporas: camuflongos y colgasetas
    my_dark_cave: pt(0, [...solid(4), '#######.........########', '####..............######', '###....v.......v.....###', E, E, '.........====...........', E, E, '..L...W....O......W..L..', ...G3, G]),
    // pantano orgánico
    my_swamp: pt(8, ['............*...........', '...........===..........', E, '....===..........===....', '..F.....................', '####~~~~~##~~~~~~~######', '####~~~~~##~~~~~~~######', G, G]),
    // llanura de esporas: las nubes doradas revelan pétalos ocultos
    my_spore_plains: pt(5, ['..................*.....', '.................===....', E, '............J...........', E, '.......J................', E, '..O.......d.....O.......', '...........l............', ...G3]),
    // ciudad pleyadiana cultivada alrededor de un hongo
    my_city: pt(8, ['...........*............', '......RRRRRRRRRRRR......', '......R..........R......', '..===.R..........R......', E, '..Q.......C.......Q.....', '######RRRRRRRRRRRR######', '######RRRRRRRRRRRR######', G]),
    // red subterránea de raíces y cordones hifales
    my_roots: pt(0, [...solid(3), '#####...........########', '###......|.........#####', '##.......|..........###.', '#........|.......o......', '.........|....####......', '..====...|..............', E, E, E, '..V....B.....c....V..L..', ...G3, G]),
    // jardín bioluminiscente: flores-pétalo que se abren y se cierran
    my_garden: pt(8, ['.........J......J.......', E, E, '....J.......J.......J...', E, '..L..U...h...U...L..F...', ...G3]),
    // gran cámara de los hongos colosales
    my_chamber: pt(0, [...solid(2), '####..............######', '##.....................#', '#.......................', E, '...........=====........', E, E, '....====.........====...', E, E, '..Q.....Y.....b....Q....', ...G3, G]),
    // laboratorio de cultivo del régimen
    my_lab: pt(0, [MM, MM, E, E, '....D..........D........', E, E, '...----........----.....', E, E, '.......MMM....MMM.......', E, '..........G.............', '..Z...s...G..n..s...Z...', ...M3]),
    // bombasporas reactivas junto a un muro de costra
    my_reactive: pt(8, ['..................o.....', '.................BB.....', '...........====.BB......', E, '..V...c..V..c...BB..V...', '................BB......', ...G3]),
    my_checkpoint: pt(10, [E, '..........L.............', '...................y....', '....F....k....h....Q....', ...G3]),
    my_extractor: pt(10, [E, '...==.............==....', '...................g....', '..K.......X.........c.y.', ...G3]),
    my_rescue: pt(10, [E, '..........L.............', '...................y....', '....F......n.......c....', ...G3]),
    my_shrine: pt(9, ['..........RRRR..........', '.........RRRRRR.........', E, E, '..L..Q...r..u..r..Q..F..', ...G3]),
    my_secret: pt(9, ['............*...........', '..........SSSSS.........', '..........S...S.........', '..........S.C.S.........', '..F.......SSSSS....L....', ...G3]),
    my_elite: pt(8, [E, E, '...===............===...', E, E, '..Q.......A.........Q...', ...G3]),
    my_exit: pt(10, ['.........L..............', '........###.............', '.......#####............', '..F...#######.....E.....', ...G3])
  });
  P.MY_DARK = ['my_dark_cave'];

  P.LV.mykoris = {
    planet: 'mykoris',
    levels: [
      { id: 1, name: 'Bosque de los Colosos', sub: 'Sombreros más altos que torres', theme: 'forest', music: 'mykoris', sky: 'dusk',
        rows: [['my_start', 'my_forest', 'my_bounce_field', 'my_checkpoint', 'my_mycelium_valley', 'my_forest', 'my_extractor', 'my_spore_plains', 'my_exit']],
        events: [], stars: [{ t: 'holo', id: 'h41' }],
        intro: [['elara', 'Descenso completado, {N}. MYKORIS, el Bosque de las Esporas Pensantes.'], ['elara', 'Las setas violetas son elásticas: salta sobre ellas para subir.'], ['elara', 'Y si ves un nodo de micelio, dispárale: la energía corre por la red y abre caminos.']] },
      { id: 2, name: 'Valle del Micelio', sub: 'La red que piensa', theme: 'valley', music: 'mykoris', sky: 'day',
        rows: [['my_start', 'my_mycelium_valley', 'my_growth', 'my_checkpoint', 'my_rescue', 'my_forest', 'my_growth', 'my_secret', 'my_extractor', 'my_exit']],
        events: [{ t: 'rescue', npc: 'ylmira' }], stars: [{ t: 'holo', id: 'h42' }, { t: 'res', crys: 2 }],
        intro: [['elara', 'Zonas de crecimiento. La carne fúngica bloquea el paso, pero la energía del micelio la hace retroceder un rato.'], ['elara', 'Date prisa cuando se retraiga: vuelve a crecer. Detecto una pleyadiana viva en una jaula.']] },
      { id: 3, name: 'Cavernas Fúngicas', sub: 'Donde las esporas no dejan ver', theme: 'cave', music: 'mykoris', sky: 'dusk',
        rows: [['my_start', 'my_dark_cave', 'my_roots', 'my_checkpoint', 'my_chamber', 'my_shrine', 'my_dark_cave', 'my_extractor', 'my_exit']],
        events: [], stars: [{ t: 'res', crys: 2 }], ups: ['resorte'],
        intro: [['ylmira', 'La niebla de esporas de estas cuevas apaga la vista. Sigue la luz de las setas faro.'], ['ylmira', 'Y no te fíes de las setas que parecen dormir: algunas muerden. En el santuario guardamos los Pies Micelares.']] },
      { id: 4, name: 'Pantano de las Esporas', sub: 'Agua que respira', theme: 'swamp', music: 'mykoris', sky: 'golden',
        rows: [['my_start', 'my_swamp', 'my_spore_plains', 'my_checkpoint', 'my_swamp', 'my_reactive', 'my_extractor', 'my_exit']],
        events: [], stars: [{ t: 'holo', id: 'h43' }, { t: 'res', bio: 8 }],
        intro: [['ylmira', 'Las bombasporas se hinchan cuando te acercas y te empujan con su soplo. Si les disparas, estallan.'], ['ylmira', 'Úsalas contra los enemigos o para romper la costra. El agua del pantano está enferma: no la pises.']] },
      { id: 5, name: 'Llanura de las Esporas', sub: 'Nubes doradas que muestran lo oculto', theme: 'plains', music: 'mykoris', sky: 'day',
        rows: [['my_start', 'my_spore_plains', 'my_bounce_field', 'my_checkpoint', 'my_elite', 'my_spore_plains', 'my_reactive', 'my_extractor', 'my_exit']],
        events: [], stars: [{ t: 'holo', id: 'h44' }], arenaLock: true,
        intro: [['ylmira', 'Atraviesa las nubes doradas: sus esporas hacen florecer pétalos que estaban escondidos.'], ['elara', 'Y un Micoloso guarda la llanura. Thersek lo ha vuelto loco.']] },
      { id: 6, name: 'Ciudad Micelial', sub: 'Casas que crecen', theme: 'city', music: 'mykoris', sky: 'golden',
        rows: [['my_start', 'my_city', 'my_spring', 'my_checkpoint', 'my_city', 'my_mycelium_valley', 'my_secret', 'my_extractor', 'my_exit']],
        events: [], stars: [{ t: 'holo', id: 'h45' }, { t: 'mem', id: 'm12' }],
        intro: [['ylmira', 'Nuestra ciudad no se construyó: se cultivó. Cada casa es un hongo que aceptó vivir con nosotros.']] },
      { id: 7, name: 'Red de Raíces', sub: 'Bajo el bosque, otro bosque', theme: 'cave', music: 'mykoris', sky: 'dusk',
        rows: [['my_start', 'my_roots', 'my_growth', 'my_checkpoint', 'my_dark_cave', 'my_roots', 'my_shrine', 'my_extractor', 'my_exit']],
        events: [], stars: [{ t: 'res', crys: 3 }], ups: ['lanzaesporas'],
        intro: [['ylmira', 'Bajo el bosque, las raíces y el micelio se entrelazan durante leguas. Todo está conectado.'], ['ylmira', 'En el santuario está el Lanzaesporas de mi pueblo.']] },
      { id: 8, name: 'Jardines Lumínicos', sub: 'Flores que abren y cierran', theme: 'garden', music: 'mykoris', sky: 'dusk',
        rows: [['my_start', 'my_garden', 'my_bounce_field', 'my_checkpoint', 'my_garden', 'my_spring', 'my_extractor', 'my_exit']],
        events: [], stars: [{ t: 'holo', id: 'h46' }],
        intro: [['ylmira', 'Los jardines respiran: sus flores-pétalo se abren y se cierran a su ritmo. Cruza mientras estén abiertas.']] },
      { id: 9, name: 'Cámara del Coloso', sub: 'El corazón del bosque', theme: 'cave', music: 'mykoris', sky: 'dusk',
        rows: [['my_start', 'my_chamber', 'my_growth', 'my_checkpoint', 'my_chamber', 'my_shrine', 'my_secret', 'my_extractor', 'my_exit']],
        events: [], stars: [{ t: 'res', crys: 3 }, { t: 'holo', id: 'h47' }, { t: 'res', bio: 8 }, { t: 'holo', id: 'h48' }], ups: ['quitina'],
        intro: [['ylmira', 'La Cámara del Coloso. Aquí nació el primer hongo de MYKORIS. En el santuario está la Coraza Fúngica.']] },
      { id: 10, name: 'Laboratorio de Cultivo', sub: 'Donde el régimen siembra la podredumbre', theme: 'lab', music: 'facility',
        rows: [['my_start', 'lab_a', 'my_lab', 'my_checkpoint', 'lab_b', 'my_lab', 'lab_a', 'my_exit']],
        events: [{ t: 'transmission', who: 'thersek', lines: [['thersek', 'MYKARON era el rey de este bosque. Pensaba con un millón de raíces.'], ['thersek', 'Ahora piensa con un solo chip: el mío. Ven a hablar con él, K-7.']] }],
        stars: [], intro: [['elara', 'El laboratorio del régimen. Desde aquí cultivan la podredumbre que enferma el bosque.']] },
      { id: 11, name: 'Trono de MYKARON', sub: 'Guarida del Rey Hongo', theme: 'boss', music: 'boss', boss: 'mykaron', sky: 'dusk', arena: 'mykaron',
        intro: [['elara', 'Firma colosal bajo tierra. MYKARON, el Rey Hongo.'], ['elara', 'Está enraizado: se mueve bajo el suelo. Cuando grite, sus láminas quedan expuestas: dispara entonces.'], ['ylmira', 'Sus esferas de esporas tienen colores distintos: la violeta te persigue, la azul rebota y la verde se divide.']] }
    ],
    overworld: {
      w: 60, h: 34, ship: [5, 16], village: [30, 18],
      portals: [[12, 6], [22, 5], [33, 7], [44, 5], [53, 10], [54, 21], [46, 29], [35, 28], [22, 29], [13, 25], [52, 30]],
      lake: [40, 18, 3, 2],
      layout: { paths: 'curvy', plaza: 'round', border: 'trees', lakes: [[40, 18, 3, 2], [18, 15, 2.5, 1.8], [27, 25, 2, 1.4]],
        cracks: [[6, 18, 28, 18], [30, 18, 52, 12], [30, 18, 44, 28], [30, 18, 14, 27], [30, 18, 30, 6]],
        clusters: true, decor: { tree: 0.12, rock: 0.05, goo: 0.04, lamp: 0.03 }, houses: [[-8, -5], [6, -6], [-9, 3], [7, 3], [0, -8]] },
      intro: [['elara', 'MYKORIS: un bosque de hongos gigantes. Las líneas de luz del suelo son micelio: el planeta entero está conectado.'], ['elara', 'Cada portal lleva a un territorio drenado por las extractoras. Libéralos y el bosque volverá a brillar.']]
    }
  };
})();
