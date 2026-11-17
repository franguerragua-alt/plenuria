'use strict';
// NÍVORAH: chunks propios (24x17), niveles y mapa exterior. Tesela nueva: I = hielo resbaladizo.
// En NÍVORAH: c glotón · K glotón ciber · A mamut · f pingüino · d polilla aurora · D dron gélido · l foca
//  p flor carámbano · v murciélago de hielo · w carámbano que cae · ~ agua glaciar / lodo helado · b fumarola
(function () {
  const E = '........................', G = '########################', MM = 'MMMMMMMMMMMMMMMMMMMMMMMM', RR = 'RRRRRRRRRRRRRRRRRRRRRRRR';
  const G3 = [G, G, G], M3 = [MM, MM, MM], R3 = [RR, RR, RR];
  const ch = rows => { const out = []; for (let i = 0; i < 17; i++) out.push(((rows[i] || E) + E).slice(0, 24)); return out; };
  const padTop = (n, rows) => { const r = []; for (let i = 0; i < n; i++) r.push(E); return ch(r.concat(rows)); };
  const solid = n => { const r = []; for (let i = 0; i < n; i++) r.push(G); return r; };
  Object.assign(P.CHUNKS, {
    nv_start: padTop(10, [E, '..............L.........', '.............====.......', '..P................F....', ...G3]),
    nv_drifts: padTop(8, [E, E, '.................o......', '...............####.....', '......f.....#########...', '..F...###############...', ...G3]),
    nv_ice_run: padTop(10, [E, '.........o..........o...', E, '...d....................', 'IIIIII...IIIIIII...IIIII', '######...#######...#####', '######...#######...#####']),
    nv_frozen_lake: padTop(10, [E, E, E, '.l.L................F...', '####~~~II~~~II~~~~II####', '####~~~II~~~II~~~~II####', G]),
    nv_crevasse: padTop(11, ['.........o..............', '.................d......', '...c....................', '######============######', '######............######', '######............######']),
    nv_icicle_cave: ch([...solid(5), '##########....##########', '########..........######', '######..............####', '.....w.....w......w.....', E, E, '..........===...........', E, '..c.......o.......f.....', ...G3]),
    nv_glide_gap: padTop(8, [E, '.........o....o.........', E, E, E, '..L.................F...', '########.....###########', '########.....###########', '########.....###########']),
    nv_observatory: padTop(9, ['............*...........', '........RRRRRRRRRRRRR...', '........S........C..R...', '.....RRRS...........RRRR', '.....RRRS...........RRRR', ...R3]),
    nv_pines: padTop(10, [E, E, '..........y.............', '..U....L.....U....F..g..', ...G3]),
    nv_ice_steps: padTop(8, ['.................o......', '...............IIIII....', '...........IIII#####....', '.......IIII#########....', '.......#############..L.', '..c..II#############....', ...G3]),
    // estación médica: tres componentes en lo alto y el generador de la cápsula de LUMA
    nv_medbay: ch([MM, MM, E, E, '....*..............*....', '...----...........----..', E, E, '........----...---......', E, E, '....MMM.........MMM.....', '...........*............', '..s...........n.....s...', ...M3])
  });

  P.LV.nivorah = {
    planet: 'nivorah',
    levels: [
      { id: 1, name: 'Llanura de Escarcha', sub: 'Donde la nieve guarda silencio', theme: 'snow', music: 'nivorah', sky: 'day',
        rows: [['nv_start', 'nv_drifts', 'nv_ice_run', 'kz_checkpoint', 'nv_frozen_lake', 'nv_observatory', 'kz_extractor', 'nv_pines', 'kz_exit']],
        events: [], stars: [{ t: 'holo', id: 'h17' }],
        intro: [['elara', 'Descenso completado, {N}. NÍVORAH, el Glaciar de las Auroras.'], ['elara', 'Cuidado con el hielo azul: resbala. Frena antes de los bordes.'], ['elara', 'El agua del deshielo está contaminada y helada. No te quedes dentro.']] },
      { id: 2, name: 'Lago de los Susurros', sub: 'El hielo canta bajo los pies', theme: 'snow', music: 'nivorah', sky: 'day',
        rows: [['nv_start', 'nv_frozen_lake', 'kz_thorns', 'kz_checkpoint', 'kz_rescue', 'nv_ice_run', 'nv_observatory', 'kz_extractor', 'nv_frozen_lake', 'kz_exit']],
        events: [{ t: 'rescue', npc: 'yrsa' }], stars: [{ t: 'holo', id: 'h18' }],
        intro: [['elara', 'Señal arturiana en el lago. Alguien sobrevivió a la caída de los observatorios.']] },
      { id: 3, name: 'Grietas Azules', sub: 'El glaciar se abre en abismos', theme: 'snow', music: 'nivorah', sky: 'golden',
        rows: [['nv_start', 'nv_crevasse', 'nv_glide_gap', 'kz_checkpoint', 'nv_icicle_cave', 'kz_geyser_gap', 'nv_glide_gap', 'kz_shrine', 'kz_extractor', 'kz_exit']],
        events: [], stars: [{ t: 'res', crys: 2 }], ups: ['planeo'],
        intro: [['yrsa', 'Los arturianos cruzábamos las grietas planeando con capas térmicas. Guardé una en el templete del glaciar.'], ['elara', 'Los carámbanos del techo se desprenden si pasas debajo. Escucha cómo crujen.']] },
      { id: 4, name: 'Observatorio de Vel-Thara', sub: 'Cúpulas que miraban las estrellas', theme: 'ruins', music: 'nivorah', sky: 'day',
        rows: [['nv_start', 'nv_observatory', 'kz_arch_rope', 'kz_high_down', 'kz_checkpoint', 'nv_ice_steps', 'kz_secret_room', 'nv_observatory', 'kz_extractor', 'kz_exit']],
        events: [], stars: [{ t: 'res', crys: 3 }, { t: 'holo', id: 'h19' }, { t: 'res', bio: 8 }, { t: 'holo', id: 'h20' }],
        intro: [['yrsa', 'Desde Vel-Thara medíamos la luz de Plenuria. Cuando la Esfera se cerró, los telescopios solo vieron oscuridad.']] },
      { id: 5, name: 'Ventisca Eterna', sub: 'El viento no se detiene nunca', theme: 'storm', music: 'nivorah', sky: 'day', storm: true,
        rows: [['nv_start', 'nv_drifts', 'nv_ice_run', 'kz_checkpoint', 'kz_secret_room', 'kz_elite_arena', 'nv_crevasse', 'nv_frozen_lake', 'kz_extractor', 'nv_drifts', 'kz_exit']],
        events: [], stars: [{ t: 'holo', id: 'h21' }], arenaLock: true,
        intro: [['elara', 'Ventisca en formación. Agáchate o usa la DEFENSA para que no te arrastre.'], ['yrsa', 'Y algo enorme se mueve en la nieve. Un thrumbar… con implantes.']] },
      { id: 6, name: 'Estación Médica Congelada', sub: 'Algo duerme en la cámara criogénica', theme: 'facility', music: 'facility',
        rows: [['nv_start', 'facility_a', 'nv_medbay', 'kz_checkpoint', 'facility_b', 'cell', 'facility_b', 'kz_exit']],
        events: [{ t: 'luma' }, { t: 'transmission', who: 'gerselle', lines: [['gerselle', 'Esa estación era propiedad de la República. Ahora es mía, como todo lo demás.'], ['gerselle', 'Si despiertas a ese cacharro médico, {N}, que sea para que te remiende antes de que te encuentre.']] }],
        stars: [{ t: 'comp' }, { t: 'comp' }, { t: 'comp' }],
        intro: [['elara', 'La estación médica arturiana. Detecto una cápsula criogénica activa… y un generador sin energía.'], ['elara', 'Necesitamos tres componentes médicos para reactivarlo. Están en lo alto de la sala.']] },
      { id: 7, name: 'Cavernas de Cristal', sub: 'Bajo el hielo, la luz se quiebra', theme: 'cave', music: 'nivorah',
        rows: [['nv_start', 'kz_cave_b', 'kz_geode', 'kz_checkpoint', 'nv_icicle_cave', 'kz_overhang', 'kz_geode', 'kz_extractor', 'kz_shrine', 'kz_exit']],
        events: [], stars: [{ t: 'holo', id: 'h22' }, { t: 'res', crys: 3 }], ups: ['crio'],
        intro: [['yrsa', 'En estas cavernas forjamos el Cañón Criogénico. Congela a los enemigos un instante. Úsalo bien.']] },
      { id: 8, name: 'Bosque de Candelabros', sub: 'Árboles de hielo bajo la aurora', theme: 'snow', music: 'nivorah', sky: 'golden',
        rows: [['nv_start', 'nv_pines', 'nv_ice_steps', 'kz_checkpoint', 'kz_arch_rope', 'kz_high_down', 'kz_geyser_gap', 'nv_observatory', 'kz_extractor', 'kz_exit']],
        events: [], stars: [{ t: 'res', crys: 3 }, { t: 'mem', id: 'm6' }, { t: 'holo', id: 'h23' }],
        intro: [['elara', 'Los Candelabros Boreales almacenan la luz de las auroras. Cuando el bosque sana, brillan de noche.']] },
      { id: 9, name: 'Aurora Rota', sub: 'El cielo se desgarra en violeta', theme: 'storm', music: 'nivorah', sky: 'dusk', storm: true,
        rows: [['nv_start', 'nv_drifts', 'nv_crevasse', 'kz_overhang', 'kz_checkpoint', 'nv_glide_gap', 'kz_shrine', 'nv_ice_run', 'kz_secret_room', 'kz_extractor', 'kz_exit']],
        events: [], stars: [{ t: 'holo', id: 'h24' }], ups: ['termico'],
        intro: [['yrsa', 'El Núcleo Térmico de mi equipo de expedición te protegerá del agua helada. Lo escondí en el templete.']] },
      { id: 10, name: 'Criolaboratorio Theta', sub: 'Donde Thersek congela sus errores', theme: 'lab', music: 'facility',
        rows: [['nv_start', 'lab_a', 'lab_b', 'kz_checkpoint', 'lab_a', 'facility_b', 'lab_b', 'facility_b', 'kz_exit']],
        events: [{ t: 'transmission', who: 'thersek', lines: [['thersek', 'GLORVAX era una criatura de las auroras. Inofensiva, aburrida. Ahora piensa con mi chip.'], ['thersek', 'Y odia el calor, {N}. Tu núcleo solar le resultará… irresistible.']] }],
        stars: [], intro: [['elara', 'El criolaboratorio de Thersek. Desde aquí controlan a GLORVAX.']] },
      { id: 11, name: 'Corazón del Glaciar', sub: 'Guarida de GLORVAX', theme: 'boss', music: 'boss', boss: 'glorvax', sky: 'dusk',
        intro: [['elara', 'Firma colosal sobre el lago helado. GLORVAX, el Glorborg de las auroras.'], ['elara', 'Sus púas de hielo desvían los disparos. Cuando se estrelle contra el suelo, quedará aturdido: dispara a su ojo.'], ['yrsa', 'Si baja y apunta el ojo al suelo, prepárate para saltar.']] }
    ],
    overworld: {
      w: 56, h: 36, ship: [5, 5], village: [12, 28],
      portals: [[13, 7], [22, 5], [9, 17], [21, 30], [30, 27], [40, 30], [49, 20], [46, 9], [36, 5], [27, 11], [28, 18]],
      lake: [44, 26, 3, 2],
      layout: { paths: 'curvy', plaza: 'round', border: 'water', ice: [[28, 18, 8, 5]], lakes: [[44, 26, 3, 2]],
        cracks: [[14, 13, 21, 21], [33, 8, 40, 13], [37, 30, 47, 25]], clusters: true, decor: { tree: 0.08, rock: 0.03, goo: 0.05, lamp: 0.02 } },
      intro: [['elara', 'NÍVORAH. Un mar helado rodea el glaciar, y en el centro duerme un lago de hielo eterno.'], ['elara', 'Los portales arturianos siguen activos. Libera los territorios y las auroras volverán a brillar.']]
    }
  };
})();
