'use strict';
// THALASSYR: chunks propios (24x17), niveles y archipiélago exterior.
// Marcadores nuevos: Q cascada (decorativa) · w electrodisco (flota en el agua). ~ agua (contaminada hasta liberar).
(function () {
  const E = '........................', G = '########################', MM = 'MMMMMMMMMMMMMMMMMMMMMMMM', WW = '~~~~~~~~~~~~~~~~~~~~~~~~';
  const G3 = [G, G, G], M3 = [MM, MM, MM];
  const ch = rows => { const out = []; for (let i = 0; i < 17; i++) out.push(((rows[i] || E) + E).slice(0, 24)); return out; };
  const padTop = (n, rows) => { const r = []; for (let i = 0; i < n; i++) r.push(E); return ch(r.concat(rows)); };
  const solid = n => { const r = []; for (let i = 0; i < n; i++) r.push(G); return r; };
  Object.assign(P.CHUNKS, {
    th_start: padTop(10, [E, '..............L.........', '...........=====........', '..P................F....', ...G3]),
    th_beach: padTop(9, [E, E, '...............o........', '..............###.......', '..F.........#####....l..', '####~~~##########~~~####', '#####~##############~###', G]),
    th_tidepools: padTop(9, ['.......o......f.o.......', '......###.....###.......', '.....#####...#####......', '.....#####...#####......', '..L..#####...#####...F..', '##########~~~###########', '##########~~~###########', G]),
    th_stilts: padTop(9, ['...........d............', '......o..........o......', E, '...======....======.....', E, '###~~~~~~~~~~~~~~~~~####', '###~~~~~~~~~~~~~~~~~####', G]),
    th_islands: padTop(11, ['..........o.............', '.........###......d.....', '...F....#####...........', '######~~#####~~~~~######', '######~~#####~~~~~######', G]),
    // cascadas que caen desde un saliente del acantilado a una poza
    th_waterfall: ch(['........###########.....', '........###########.....', '.........#########......', '.........Q...Q..........', E, E, E, E, E, E, '....===...........===...', '..........===...........', E, '..L......o..........F...', '#######~~~~~~~~~########', '#######~~~~~~~~~########', G]),
    // ruinas lemurianas semihundidas: columnata con dintel y cofre en la sala
    th_sunken: padTop(7, ['...........*............', '......RRRRRRRRRRRR......', '......R..........R......', '......R..........R......', E, E, '..F........C.......r....', '####~~RRRRRRRRRRRR~~####', '####~~RRRRRRRRRRRR~~####', G]),
    th_reef: padTop(10, ['.......o.......o........', '......===.....===.......', E, '..L.^^^^......^^^^...F..', ...G3]),
    th_cave_falls: ch([...solid(4), '########....#######.####', '######......###.......##', '####..Q...........Q....#', E, E, E, '..........====..........', E, E, '..m.....o........U......', '#######~~~~~~###########', '#######~~~~~~###########', G]),
    // fondo marino: superficie en la fila 3 y suelo transitable (se puede cruzar andando y saltando)
    th_deep_a: ch([E, E, E, WW, WW, '~~~~~~w~~~~~~~~~~~~~~~~~', WW, WW, '~~~~~~~~~~~~~~~~~w~~~~~~', WW, WW, '~~~~~~~~~~~###~~~~~~~~~~', '~~~~U~~~~~#####~~~~o~~~~', '~~~~~~~~~#######~~~~~~~~', ...G3]),
    th_deep_b: ch([E, E, E, WW, WW, WW, '~~~~~~~~~~~*~~~~~~~~~~~~', '~~~~~~~~~w~~~~~~~~~~~~~~', '~~~~~~~~~~~~####~~~~~~~~', '~~~~~~~~~~~~~~~~~~w~~~~~', WW, WW, WW, '~~~U~~b~~~~U~~~b~~~~U~~~', ...G3]),
    // cueva submarina abierta: rocas colgantes, pendulinias y electrodiscos
    th_jelly_cave: ch([E, E, E, WW, '~~~~~~####~~~~~~~####~~~', '~~~~~~~v~~~~~~~~~~v~~~~~', '~~~~w~~~~~~~~~~~~~~~~~~~', WW, '~~~~~~~~~~~~~w~~~~~~~~~~', WW, WW, '~~~~~~~~~###~~~~~~~~~~~~', '~~~~~~~~#####~~~~~~~~~~~', '~~m~~~~~~~~~~~~~~~~U~~~~', ...G3]),
    // acantilado escalonado para entrar en el agua (encierra el mar por la izquierda)
    th_dive_in: ch([E, E, '....................L...', '..................######', '..................######', '...............#########', '...............#########', '............############', '............############', '.........###############', '..F......###############', '......##################', '......##################', '...#####################', ...G3]),
    // salida: cuerda de alga junto al acantilado y bajada escalonada
    th_climb_out: ch([E, E, '.......F................', '~~~~|#######............', '~~~~|#######............', '~~~~|#######............', '~~~~|##########.........', '~~~~|##########.........', '~~~~|##########.........', '~~~~|#############......', '~~~~|#############......', '~~~~|#############...L..', '~~~~|################...', '~~~~|################...', ...G3]),
    // laboratorio sumergido: cápsulas de BRASA y BRISA
    th_lab_pods: ch([MM, MM, E, E, '....D............D......', E, E, '...----.........----....', E, E, '.......MMM....MMM.......', E, E, '..s.........n.......s...', ...M3])
  });

  P.LV.thalassyr = {
    planet: 'thalassyr',
    levels: [
      { id: 1, name: 'Costa de Nácar', sub: 'Donde el océano besa la arena', theme: 'coast', music: 'thalassyr', sky: 'day',
        rows: [['th_start', 'th_beach', 'th_tidepools', 'kz_checkpoint', 'th_islands', 'th_sunken', 'kz_extractor', 'th_beach', 'kz_exit']],
        events: [], stars: [{ t: 'holo', id: 'h25' }],
        intro: [['elara', 'Descenso completado, {N}. THALASSYR, el Abismo de Coral Eléctrico.'], ['elara', 'Casi todo este mundo es océano. El agua está contaminada: no te quedes mucho tiempo dentro.'], ['elara', 'Los lemurianos vivían sobre el mar y bajo él. Busca sus ruinas.']] },
      { id: 2, name: 'Puerto Velasal', sub: 'Una ciudad sobre pilotes', theme: 'city', music: 'thalassyr', sky: 'golden',
        rows: [['th_start', 'th_stilts', 'th_islands', 'kz_checkpoint', 'kz_rescue', 'th_stilts', 'th_waterfall', 'kz_secret_room', 'kz_extractor', 'th_stilts', 'kz_exit']],
        events: [{ t: 'rescue', npc: 'maelis' }], stars: [{ t: 'holo', id: 'h26' }],
        intro: [['elara', 'El antiguo puerto lemuriano. Las pasarelas aguantan tu peso.'], ['elara', 'Detecto una lemuriana viva en una jaula del régimen.']] },
      { id: 3, name: 'Arrecife Brillante', sub: 'Coral que canta con la marea', theme: 'reef', music: 'thalassyr', sky: 'day',
        rows: [['th_start', 'th_reef', 'th_tidepools', 'kz_checkpoint', 'th_cave_falls', 'kz_geyser_gap', 'th_reef', 'kz_shrine', 'kz_extractor', 'kz_exit']],
        events: [], stars: [{ t: 'res', crys: 2 }], ups: ['branquias'],
        intro: [['maelis', 'En el santuario del arrecife guardamos las Branquias de Coral. Con ellas podrás nadar libremente.']] },
      { id: 4, name: 'Ruinas de Oshaluun', sub: 'El templo que se tragó el mar', theme: 'ruins', music: 'thalassyr', sky: 'golden',
        rows: [['th_start', 'th_sunken', 'kz_arch_rope', 'kz_high_down', 'kz_checkpoint', 'th_sunken', 'kz_secret_room', 'th_islands', 'kz_extractor', 'kz_exit']],
        events: [], stars: [{ t: 'res', crys: 3 }, { t: 'holo', id: 'h27' }, { t: 'res', bio: 8 }, { t: 'holo', id: 'h28' }],
        intro: [['maelis', 'Oshaluun era nuestra capital. Cuando subió el mar, la dejamos dormir bajo las olas.']] },
      { id: 5, name: 'Mar de Tormentas', sub: 'La lluvia nunca cesa', theme: 'storm', music: 'thalassyr', sky: 'dusk', storm: true,
        rows: [['th_start', 'th_beach', 'th_stilts', 'kz_checkpoint', 'kz_secret_room', 'kz_elite_arena', 'th_islands', 'th_tidepools', 'kz_extractor', 'th_beach', 'kz_exit']],
        events: [], stars: [{ t: 'holo', id: 'h29' }], arenaLock: true,
        intro: [['elara', 'Temporal en el mar. Las rachas te empujarán: agáchate o usa la DEFENSA.'], ['maelis', 'Y el Ordanox ha salido del abismo. Thersek lo ha vuelto loco.']] },
      { id: 6, name: 'Laboratorio Sumergido', sub: 'Dos señales gemelas laten en la oscuridad', theme: 'facility', music: 'facility',
        rows: [['th_start', 'facility_a', 'th_lab_pods', 'kz_checkpoint', 'facility_b', 'cell', 'facility_b', 'kz_exit']],
        events: [{ t: 'twins' }, { t: 'transmission', who: 'gerselle', lines: [['gerselle', '¿Vienes a por los gemelos de combate? Eran el orgullo de la República.'], ['gerselle', 'Ahora son chatarra programada para disparar a quien los despierte. Diviértete, {N}.']] }],
        stars: [], intro: [['elara', 'Un laboratorio lemuriano bajo el mar. Detecto dos robots de combate en estado de reposo.'], ['elara', 'Para reactivarlos habrá que superar su prueba de combate.']] },
      { id: 7, name: 'Cuevas de Marea', sub: 'Cascadas bajo la roca', theme: 'cave', music: 'thalassyr',
        rows: [['th_start', 'th_cave_falls', 'kz_geode', 'kz_checkpoint', 'th_dive_in', 'th_jelly_cave', 'th_climb_out', 'th_cave_falls', 'kz_geode', 'kz_extractor', 'kz_shrine', 'kz_exit']],
        events: [], stars: [{ t: 'holo', id: 'h30' }, { t: 'res', crys: 3 }], ups: ['arpon'],
        intro: [['maelis', 'Nuestros pescadores cazaban con el Arpón de Coral. Atraviesa a varios enemigos y llega muy lejos.']] },
      { id: 8, name: 'Abismo Luminoso', sub: 'La luz del fondo del mar', theme: 'deep', music: 'thalassyr', sky: 'dusk',
        rows: [['th_start', 'th_dive_in', 'th_deep_a', 'th_deep_b', 'th_climb_out', 'kz_checkpoint', 'th_dive_in', 'th_jelly_cave', 'th_deep_a', 'th_deep_b', 'th_climb_out', 'kz_extractor', 'kz_exit']],
        events: [], stars: [{ t: 'holo', id: 'h31' }, { t: 'mem', id: 'm8' }],
        intro: [['elara', 'Bajamos al fondo marino. Con las Branquias puedes nadar: pulsa SALTO dentro del agua para impulsarte.'], ['maelis', 'Cuidado con los electrodiscos. Su descarga duele incluso con armadura.']] },
      { id: 9, name: 'Bosque de Kelp', sub: 'Torres de alga bajo la superficie', theme: 'deep', music: 'thalassyr', sky: 'golden',
        rows: [['th_start', 'th_dive_in', 'th_deep_b', 'th_climb_out', 'th_reef', 'kz_checkpoint', 'th_dive_in', 'th_deep_a', 'th_climb_out', 'kz_shrine', 'th_waterfall', 'kz_secret_room', 'kz_extractor', 'kz_exit']],
        events: [], stars: [{ t: 'res', crys: 3 }, { t: 'holo', id: 'h32' }], ups: ['nacar'],
        intro: [['maelis', 'La Coraza de Nácar se forja con conchas del bosque de kelp. La dejé en el santuario.']] },
      { id: 10, name: 'Plataforma Tritón', sub: 'La perforadora del régimen', theme: 'lab', music: 'facility',
        rows: [['th_start', 'lab_a', 'lab_b', 'kz_checkpoint', 'lab_a', 'facility_b', 'lab_b', 'facility_b', 'kz_exit']],
        events: [{ t: 'transmission', who: 'thersek', lines: [['thersek', 'THALZOR era el guardián de los arrecifes. Le di un cerebro y un generador de cien megavatios.'], ['thersek', 'Ahora es mi pararrayos favorito. Ven a mojarte, {N}.']] }],
        stars: [], intro: [['elara', 'La plataforma petrolera de Thersek. Desde aquí controlan a THALZOR.']] },
      { id: 11, name: 'Trono del Abismo', sub: 'Guarida de THALZOR', theme: 'boss', music: 'boss', boss: 'thalzor', sky: 'dusk', arena: 'thalzor',
        intro: [['elara', 'Firma colosal bajo el agua. THALZOR, el guardián eléctrico de los arrecifes.'], ['elara', 'Cuando el agua brille, sal de ella. Tras electrificarla, su núcleo queda sobrecargado: dispara entonces.'], ['maelis', 'Sus tentáculos salen donde el agua se agita. Y si barre la superficie, ¡salta!']] }
    ],
    overworld: {
      w: 58, h: 36, ship: [5, 6], village: [28, 18],
      portals: [[13, 6], [21, 9], [11, 18], [17, 28], [28, 31], [38, 28], [47, 23], [52, 14], [46, 6], [36, 6], [52, 30]],
      lake: [0, 0, 0.1, 0.1],
      layout: { sea: true, paths: 'curvy', plaza: 'round', border: 'water', islands: [[28, 18, 8, 6], [16, 24, 4, 3], [44, 16, 5, 4], [40, 7, 5, 3], [24, 29, 4, 3]],
        clusters: true, decor: { tree: 0.07, rock: 0.04, goo: 0.05, lamp: 0.02 } },
      intro: [['elara', 'THALASSYR: un archipiélago en un océano infinito. Las pasarelas lemurianas unen las islas.'], ['elara', 'Cada portal lleva a un territorio drenado por las extractoras. Libéralos y el mar volverá a brillar.']]
    }
  };
})();
