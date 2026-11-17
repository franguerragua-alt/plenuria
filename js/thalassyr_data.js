'use strict';
// THALASSYR — datos, efectos de agua, arquitectura lemuriana y entidades propias
(function () {
  const D = P.D, T = 'thalassyr';
  Object.assign(D.planet(T), { ready: true, lair: 'el Trono del Abismo' });
  Object.assign(D.BOSSES.thalzor, { col: '#b08aff', col2: '#5af0ff' });

  // ---------- armas y mejoras ----------
  D.WEAPONS.arpon = { name: 'Arpón de Coral', icon: 'i_harpoon', planet: T, desc: 'Arma de los pescadores lemurianos. Un arpón rápido de largo alcance que atraviesa a tres enemigos.', dmg: 11, rate: 26, speed: 8.5, spr: 'th_b_harpoon', harpoon: true };
  Object.assign(D.UPGRADES, {
    branquias: { name: 'Branquias de Coral', icon: 'i_gills', kind: 'Movimiento', planet: T, desc: 'Respiras bajo el agua: NADAS pulsando SALTO dentro del agua, te mueves más rápido sumergido y el agua contaminada ya no te daña.' },
    arpon: { name: 'Arpón de Coral', icon: 'i_harpoon', kind: 'ATAQUE', planet: T, desc: 'Nueva arma: arpón de largo alcance que atraviesa a varios enemigos. Cambia de arma con ' },
    nacar: { name: 'Coraza de Nácar', icon: 'i_nacar', kind: 'DEFENSA', planet: T, desc: 'Placas de nácar lemuriano: recibes un 15 % menos de daño.' },
    tormenta: { name: 'Corazón de Tormenta', icon: 'i_storm', kind: 'SUPERATAQUE', planet: T, desc: 'Núcleo arrancado de THALZOR. El Pulso Solar lanza rayos en cadena a cinco enemigos.' }
  });
  D.RECIPES.push({ id: 'arpon_mk2', name: 'Arpón de Coral Mk II', desc: '+30 % de daño del Arpón de Coral.', cost: { scrap: 14, crys: 3 }, req: [], needUp: 'arpon', needNpc: 'maelis' });

  // ---------- Archivo Biológico ----------
  const sp = o => Object.assign({ planet: T, variant: 'natural' }, o);
  const TZ = D.SPECIES.findIndex(s => s.id === 'thalzor'); if (TZ >= 0) D.SPECIES.splice(TZ, 1);
  D.SPECIES.push(
    sp({ id: 'coralix', col: 'fauna', spr: 'th_krazith', name: 'Corálix', sci: 'Coralloreptans flabellata', rarity: 'común', habitat: 'Costas y arrecifes poco profundos.', behavior: 'Reptador de coral vivo. Embiste con sus pinzas-abanico si algo se acerca a su arrecife.', diet: 'Plancton luminoso.', abilities: 'Cuerpo de coral que se regenera y un racimo de tres ojos.', danger: 2, eco: 'Construye arrecifes nuevos con su propio cuerpo.', lore: 'Los niños lemurianos marcaban la edad de un corálix contando sus ramas.', tasks: ['seen', { k: 'defeat', n: 3 }, { k: 'observe', n: 4 }] }),
    sp({ id: 'coralix_cy', col: 'fauna', spr: 'th_krazith_cy', name: 'Corálix Cibernético', sci: 'Coralloreptans flabellata (mod. Thersek)', rarity: 'poco común', variant: 'cibernética', base: 'coralix', habitat: 'Perímetro de las extractoras.', behavior: 'Centinela blindado que dispara plasma.', diet: 'Sondas del régimen.', abilities: 'Placas de titanio sobre el coral muerto.', danger: 3, eco: 'Ninguno.', lore: 'Etiqueta: «LOTE C-X. PLATAFORMA TRITÓN».', tasks: ['seen', { k: 'defeat', n: 6 }] }),
    sp({ id: 'ordanox', col: 'fauna', spr: 'th_krazith_alfa', name: 'Ordanox Abisal', sci: 'Spiraconcha titanica (mutación inducida)', rarity: 'rara', variant: 'mutada', base: 'coralix', habitat: 'Mar de Tormentas.', behavior: 'Coloso de las profundidades enloquecido por la radiación. Embiste, salta y dispara púas.', diet: 'Bancos enteros de plancton.', abilities: 'Caparazón en espiral y tentáculos eléctricos.', danger: 4, eco: 'Removía el fondo marino y oxigenaba el abismo.', lore: 'Los lemurianos lo llamaban «el que mueve las mareas».', tasks: ['seen', { k: 'defeat', n: 1 }] }),
    sp({ id: 'burbujon', col: 'fauna', spr: 'th_frog', name: 'Burbujón', sci: 'Hydrosphaera oculata', rarity: 'común', habitat: 'Pozas de marea.', behavior: 'Esfera de agua viva con un ojo flotando dentro. Salta y escupe burbujas a presión.', diet: 'Microalgas.', abilities: 'Piel tan fina que se ve su interior.', danger: 1, eco: 'Limpia las pozas de algas tóxicas.', lore: 'Los pescadores decían que un burbujón mira en todas direcciones a la vez.', tasks: ['seen', { k: 'defeat', n: 3 }, { k: 'observe', n: 4 }] }),
    sp({ id: 'planeforo', col: 'fauna', spr: 'th_dfly', name: 'Planéforo', sci: 'Planovela electrica', rarity: 'común', habitat: 'Sobre las olas.', behavior: 'Planea sobre el mar con aletas en cinta y se lanza contra los intrusos.', diet: 'Insectos marinos.', abilities: 'Manchas eléctricas que guían a la bandada.', danger: 1, eco: 'Poliniza las flores flotantes.', lore: 'Al atardecer, sus bandadas dibujan letras sobre el mar.', tasks: ['seen', { k: 'observe', n: 3 }] }),
    sp({ id: 'planeforo_dron', col: 'fauna', spr: 'th_dfly_cy', name: 'Planéforo Dron', sci: 'Planovela electrica (mod. Thersek)', rarity: 'poco común', variant: 'cibernética', base: 'planeforo', habitat: 'Cielos de las plataformas.', behavior: 'Patrulla y dispara láseres.', diet: 'Batería salina.', abilities: 'Aletas de aleación.', danger: 2, eco: 'Ninguno.', lore: 'Thersek los llama «gaviotas de bolsillo».', tasks: ['seen', { k: 'defeat', n: 5 }] }),
    sp({ id: 'mantorra', col: 'fauna', spr: 'th_slug', name: 'Mantorra', sci: 'Tapetum ambulans', rarity: 'común', habitat: 'Rocas húmedas de la costa.', behavior: 'Alfombra viva que ondula sus bordes para avanzar. Embiste si la acorralan.', diet: 'Algas incrustadas.', abilities: 'Dos antenas luminosas.', danger: 1, eco: 'Pule las rocas y deja espacio para el coral nuevo.', lore: 'Las abuelas lemurianas tejían alfombras imitando sus dibujos.', tasks: ['seen', { k: 'defeat', n: 2 }, { k: 'restored' }] }),
    sp({ id: 'pendulinia', col: 'fauna', spr: 'th_vsnake', name: 'Pendulinia', sci: 'Lampadia pendula', rarity: 'poco común', habitat: 'Techos de cuevas marinas.', behavior: 'Cuelga un cebo luminoso y se descuelga sobre quien se acerca.', diet: 'Pequeños nadadores atraídos por la luz.', abilities: 'Fauces de filamentos.', danger: 2, eco: 'Regula la población de las cuevas.', lore: 'Sus luces guiaban a los buceadores… o los perdían.', tasks: ['seen', { k: 'defeat', n: 2 }] }),
    sp({ id: 'electrodisco', col: 'fauna', spr: 'th_jelly', name: 'Electrodisco', sci: 'Discomedusa voltaica', rarity: 'poco común', habitat: 'Aguas profundas.', behavior: 'Sube y baja con la corriente. Descarga electricidad al contacto.', diet: 'Electricidad del agua.', abilities: 'Filamentos que almacenan energía.', danger: 3, eco: 'Equilibra la carga eléctrica del océano.', lore: 'Los lemurianos los usaban como lámparas en sus ciudades sumergidas.', tasks: ['seen', { k: 'defeat', n: 3 }] }),
    sp({ id: 'lumareo', col: 'fauna', spr: 'th_grazer', name: 'Lumáreo', sci: 'Tripodus velifer', rarity: 'rara', restoredOnly: true, habitat: 'Costas restauradas.', behavior: 'Trípode pacífico que pasea por la orilla.', diet: 'Algas de la orilla.', abilities: 'Velas de concha que brillan al anochecer.', danger: 0, eco: 'Esparce esporas de alga por la costa.', lore: 'Un lumáreo en la orilla anuncia buena pesca.', tasks: ['seen', { k: 'observe', n: 5 }] }),
    sp({ id: 'ondarith', col: 'fauna', spr: 'th_vellorn', name: 'Ondarith', sci: 'Hydrocupola gigantea', rarity: 'legendaria', restoredOnly: true, habitat: 'Solo aparece en un THALASSYR completamente restaurado.', behavior: 'Caminante de marea con una cúpula de agua llena de luces vivas.', diet: 'Luz de las lunas.', abilities: 'Su cúpula guarda un pequeño océano.', danger: 0, eco: 'Se dice que cada estrella de su cúpula es una especie salvada.', lore: 'Los lemurianos creían que Ondarith llevaba el primer mar dentro de sí.', tasks: ['seen', { k: 'observe', n: 6 }] }),
    sp({ id: 'thalzor', col: 'fauna', spr: 'thalzor', boss: true, name: 'THALZOR', title: 'Pulpo Eléctrico Gigante', sci: 'Fulgoteuthis rex (mod. Thersek)', rarity: 'única', variant: 'cibernética', habitat: 'Trono del Abismo.', behavior: 'Guardián de los arrecifes. El generador de Thersek lo convirtió en un pararrayos viviente.', diet: 'Energía eléctrica del océano.', abilities: 'Tentáculos, tinta, electrificación del agua y rayos.', danger: 5, eco: 'Sus descargas mantenían vivos los arrecifes de coral eléctrico.', lore: 'Los lemurianos le cantaban en las noches de tormenta.', tasks: ['seen', { k: 'defeat', n: 1 }] }),
    sp({ id: 'farolalga', col: 'flora', spr: 'th_lamp', name: 'Farolalga', sci: 'Lucernalga trina', rarity: 'común', habitat: 'Costas y cuevas.', behavior: 'Tres bulbos que brillan con la marea.', diet: 'Luz y sales.', abilities: 'Ilumina su entorno.', danger: 0, eco: 'Guía a los planéforos de noche.', lore: 'Los muelles lemurianos se iluminaban con farolalgas.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'plumaria', col: 'flora', spr: 'th_fern_r', name: 'Plumaria Marina', sci: 'Plumaria undulans', rarity: 'común', habitat: 'Rocas de la costa.', behavior: 'Ondula aunque no haya viento.', diet: 'Fotosíntesis.', abilities: 'Filtra el agua salada.', danger: 0, eco: 'Refugio de larvas.', lore: 'Sus puntas rosadas anuncian la marea alta.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'burbujoma', col: 'flora', spr: 'th_mush', name: 'Burbujoma', sci: 'Bullomyces toxicus', rarity: 'poco común', habitat: 'Zonas contaminadas.', behavior: 'Revienta en nubes de esporas al detectar vibraciones.', diet: 'Toxinas.', abilities: 'Esporas irritantes.', danger: 3, eco: 'Absorbe el petróleo del agua.', lore: 'Los lemurianos la llamaban «la limpiadora triste».', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'arborquelpo', col: 'flora', spr: 'th_bigmush', name: 'Arborquelpo', sci: 'Laminaria arborea', rarity: 'poco común', habitat: 'Bosques submarinos.', behavior: 'Crece hacia la superficie sostenido por vejigas de gas.', diet: 'Luz filtrada.', abilities: 'Vejigas luminosas.', danger: 0, eco: 'Bosques enteros dependen de él.', lore: 'Su tallo más largo midió lo mismo que una torre de Oshaluun.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'geiser_burbujas', col: 'flora', spr: 'th_t_bulb_r', name: 'Géiser de Burbujas', sci: 'Fons bullans', rarity: 'común', habitat: 'Fondos volcánicos.', behavior: 'Expulsa columnas de burbujas.', diet: 'Gases del subsuelo.', abilities: 'Impulsa a quien lo pisa.', danger: 0, eco: 'Oxigena el agua.', lore: 'Los niños jugaban a ver quién subía más alto.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'cordalga', col: 'flora', spr: 'th_t_vine_r', name: 'Cordalga', sci: 'Funalga scandens', rarity: 'común', habitat: 'Paredes de roca y muelles.', behavior: 'Trepa buscando la luz.', diet: 'Fotosíntesis.', abilities: 'Fibras que resisten el peso de un cyborg.', danger: 0, eco: 'Une rocas y pasarelas.', lore: 'Las amarras lemurianas se trenzaban con cordalga.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'erizal', col: 'flora', spr: 'th_t_thorn_c', name: 'Erizal Coralino', sci: 'Echinocorallium acutum', rarity: 'común', habitat: 'Arrecifes alterados.', behavior: 'Crece en púas donde el coral murió.', diet: 'Minerales.', abilities: 'Púas punzantes.', danger: 2, eco: 'Protege el arrecife mientras se recupera.', lore: 'Cuando el agua sana, sus púas se vuelven rosadas.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'abisomaca', col: 'flora', spr: 'th_maw', name: 'Abisómaca', sci: 'Spiramandibula vorax', rarity: 'poco común', variant: 'mutada', habitat: 'Costas contaminadas.', behavior: 'Bulbo de coral carnívoro con fauces en espiral.', diet: 'Carnívora.', abilities: 'Escupe semillas de coral.', danger: 3, eco: 'En su forma natural, filtraba plancton.', lore: 'Su forma natural se llamaba «Copa de Marea».', tasks: ['seen', { k: 'defeat', n: 2 }] }),
    sp({ id: 'perlimo', col: 'flora', spr: 'th_heal', name: 'Perlimo', sci: 'Margarita medica', rarity: 'poco común', habitat: 'Junto a las ruinas.', behavior: 'Forma una perla de savia curativa.', diet: 'Minerales marinos.', abilities: 'Repara tejidos y circuitos.', danger: 0, eco: 'Medicina de la fauna herida.', lore: 'Cada perla tarda una luna en formarse.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'flotalia', col: 'flora', spr: 'th_lily', name: 'Flotalia', sci: 'Natans lucida', rarity: 'poco común', restoredOnly: true, habitat: 'Aguas limpias.', behavior: 'Flota y brilla sobre la superficie.', diet: 'Fotosíntesis.', abilities: 'Purifica el agua.', danger: 0, eco: 'Refugio de los burbujones.', lore: 'Marcaba los caminos seguros entre las islas.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'estrella_marea', col: 'flora', spr: 'th_orchid', name: 'Estrella de Marea', sci: 'Astraea marina', rarity: 'rara', restoredOnly: true, habitat: 'Territorios liberados.', behavior: 'Abre sus pétalos con la marea alta.', diet: 'Luz de las lunas.', abilities: 'Semillas que flotan durante años.', danger: 0, eco: 'Alimenta a Ondarith.', lore: 'Maelis quiere plantarlas en los Jardines de la nave.', tasks: ['seen', { k: 'scan' }] })
  );
  D.CODEX_REWARDS.thalassyr = {
    fauna: { name: 'Sangre de Perla', desc: 'Mod cyborg: +20 de salud máxima.', mod: 'perla' },
    flora: { name: 'Savia de Marea', desc: 'Mod cyborg: las curaciones son un 15 % más potentes.', mod: 'marea' },
    all: { name: 'Arrecife de la nave + Ondarith', desc: 'Un arrecife para los Jardines y el legendario Ondarith se traslada a la nave.', creature: 'ondarith' }
  };
  Object.assign(D.MISSIONS, {
    s_ecos_t: { count: d => ['h25', 'h26', 'h27', 'h28', 'h29', 'h30', 'h31', 'h32'].filter(h => d.holos[h]).length, name: 'Ecos del océano', giver: 'ELARA', desc: 'Recupera los 8 registros holográficos ocultos en THALASSYR.', goal: 8, reward: { xp: 260, crys: 3 } },
    s_maelis: { name: 'La cartógrafa de las mareas', giver: 'ELARA', desc: 'Una lemuriana está prisionera en Puerto Velasal.', goal: 1, reward: { xp: 140 } },
    s_twins: { name: 'Los gemelos dormidos', giver: 'Maelis', desc: 'Supera la prueba de combate del Laboratorio Sumergido para reactivar a BRASA y BRISA.', goal: 1, reward: { xp: 220, crys: 2 } },
    s_estrellas: { count: d => d.seeds_s_estrellas || 0, name: 'Estrellas para el arrecife', giver: 'Maelis', desc: 'Maelis necesita 5 semillas de Estrella de Marea. Solo brotan en territorios liberados de THALASSYR.', goal: 5, reward: { xp: 190, crys: 4 } }
  });
  D.ACHIEVEMENTS.push({ id: 'thalzor', name: 'Pararrayos', desc: 'Derrota a THALZOR.' }, { id: 'lib_thalassyr', name: 'El mar brilla', desc: 'Libera los 10 territorios de THALASSYR.' }, { id: 'twins', name: 'Fuego y viento', desc: 'Reactiva a BRASA y BRISA.' });
  Object.assign(D.HOLOS, {
    h25: { title: 'Bitácora de Maelis · Mareas', text: 'Las mareas ya no siguen a las lunas. Siguen a las extractoras. El mar se vacía de luz un palmo cada noche.' },
    h26: { title: 'Orden Esquelética 412 · Gerselle', text: 'El océano de THALASSYR conduce la electricidad mejor que cualquier cable. Conviertan el planeta en una batería.' },
    h27: { title: 'Inscripción de Oshaluun', text: '«Somos el océano del Pacto. Cuando el mar suba, no huiremos: aprenderemos a respirarlo.»' },
    h28: { title: 'Plano de las Branquias de Coral', text: 'Las branquias lemurianas no son una máscara: son coral vivo que se une a quien lo lleva. Solo aceptan a quien respeta el mar.' },
    h29: { title: 'Canción de la tormenta', text: '«Duerme, guardián, bajo la ola; la luz del abismo nunca está sola. Cinco faros en la costa, cinco voces en el mar; cuando el sol regrese, volveremos a cantar.»' },
    h30: { title: 'Informe de la República · BRASA y BRISA', text: 'Prototipos gemelos de escolta. Fuego y viento. Diseñados para proteger a las unidades K en misión. Asignados a K-7.' },
    h31: { title: 'Bitácora de Thersek · Proyecto T', text: 'El guardián de los arrecifes produce más electricidad que una central. Con un buen cerebro, será la batería perfecta de la Esfera.' },
    h32: { title: 'Mensaje cifrado · N-0', text: '«Si recibes esto, Siete, no vengas a buscarme todavía. UMBRÉLIA guarda algo que Merek teme. Sigue liberando los mundos.»' }
  });
  Object.assign(D.MEMORIES, {
    m8: { title: 'Fragmento de memoria · Los gemelos', text: 'Dos robots, uno rojo y uno azul, discuten quién te protegerá primero. N-0 se ríe: «Los dos, tontos. Siempre los dos».' },
    m9: { title: 'Fragmento de memoria · El mar', text: 'Sumergido, escuchas una voz bajo el agua: «Las unidades K abren la Esfera. Pero la llave completa sois tú y N-0 juntos».' }
  });
  D.BOSS_OUTRO.thalzor = { up: 'tormenta', skin: 'abisal', mem: 'm9', lines: [['elara', 'THALZOR se detiene. El generador de Thersek se ha quemado.'], ['maelis', 'Míralo, {N}… vuelve al abismo, despacio. Los arrecifes ya brillan otra vez.'], ['elara', 'He extraído un núcleo de tormenta del implante. Tu Pulso Solar podrá lanzar rayos en cadena.'], ['hero', 'Otra pieza de ALBA dentro de un guardián.'], ['elara', 'Cuatro de nueve. Integrando… ahora.']] };
  D.POST_BOSS.thalzor = [['thersek', 'Mi pararrayos… ¿Sabes cuánto costaba ese generador, K-7?'], ['gerselle', 'NÉMESIS está casi lista, Thersek. Deja de llorar por tus mascotas.'], ['merek', 'Cuatro mundos. Interesante. Ve a UMBRÉLIA, {N}. Allí encontrarás lo que buscas… y lo lamentarás.'], ['elara', 'Transmisión cortada. UMBRÉLIA… el mensaje de N-0 hablaba de ese mundo.'], ['elara', 'Las rutas aún no están abiertas. Descansa, {N}. BRASA y BRISA ya montan guardia.']];
  D.FIRST_CLEAR = D.FIRST_CLEAR || {};
  D.FIRST_CLEAR.thalassyr = (S, id) => { if (id === 1) { S.startMission('s_ecos_t'); S.startMission('s_maelis'); } if (S.liberated(T) >= 10) S.ach('lib_thalassyr'); if (id === 11) S.ach('thalzor'); };
  D.RESCUE = D.RESCUE || {};
  D.RESCUE.maelis = { name: 'Maelis', mission: 's_maelis', lines: [['maelis', '¿Un cyborg? ¿Rojo? ¿Con el sello de la República? Las mareas me han traído un milagro.'], ['maelis', 'Soy Maelis, cartógrafa de las mareas de Velasal. Me encerraron por esconder los mapas de Oshaluun.'], ['hero', 'Soy {N}. Vengo a devolverle la luz a este océano.'], ['maelis', 'Entonces necesitarás a BRASA y BRISA. Duermen en el Laboratorio Sumergido. Te enseñaré el camino.'], ['elara', 'Teletransporte preparado. Bienvenida a bordo, Maelis.']],
    onRescue: S => { S.startMission('s_twins'); S.startMission('s_estrellas'); },
    ship: { room: 'civs', off: 110, talk: S => [['maelis', S.data.comps.unlocked.twins ? 'BRASA y BRISA no paran de discutir. Eso es buena señal: están contentos.' : 'Los gemelos siguen dormidos en el Laboratorio Sumergido. Su prueba es dura, pero tú puedes.'], ['maelis', 'Semillas de Estrella de Marea: ' + (S.data.seeds_s_estrellas || 0) + '/5.']] } };
  P.SPEAKERS.maelis = { name: 'Maelis', por: 'por_maelis', col: '#5af0e0' };
  P.D.VILLAGER_LINES.lemuriano.push('Las mareas vuelven a seguir a las lunas. Por fin.', 'Mi barca vuelve a tener luz. Gracias, viajero.', 'Oshaluun respira bajo las olas. Algún día volveremos a visitarla.');

  // ---------- música (acuática y lenta, con arpegios brillantes) ----------
  Object.assign(P.Audio.TRACKS, {
    thalassyr: { bpm: 80, root: 48, scale: [0, 2, 3, 5, 7, 9, 10], prog: [0, 3, 5, 4], lead: 'sine', bass: 'sine', arp: 'triangle', drums: 1, pad: true, seed: 311, marimba: true },
    thalassyr_r: { bpm: 86, root: 50, scale: [0, 2, 4, 7, 9], prog: [0, 4, 5, 3], lead: 'sine', bass: 'triangle', arp: 'sine', drums: 1, pad: true, seed: 311, marimba: true },
    thalassyr_ow: { bpm: 92, root: 53, scale: [0, 2, 4, 5, 7, 9, 11], prog: [0, 5, 3, 4], lead: 'triangle', bass: 'sine', arp: 'triangle', drums: 0, pad: true, seed: 323 }
  });

  // ---------- luz y ambiente ----------
  P.FX.GR.thalassyr = { bloomMul: 0.55, day: ['#7ae8f0', '#06246a', 0.3], golden: ['#ffc8a8', '#1a2a6a', 0.28], dusk: ['#5ae8ff', '#06103a', 0.32], cave: ['#5ae8e0', '#041428', 0.32], deep: ['#5ad0ff', '#020c2a', 0.34], sun: [300, 50], fog: '#a0f0ff', rays: '180,250,255' };
  const KA = P.ART.khazir;
  Object.assign(P.ART.thalassyr, {
    seedMission: 's_estrellas', seedName: 'Semilla de Estrella de Marea', holoMission: 's_ecos_t',
    civs: ['lemuriano', 'lemuriano', 'pleyadiano', 'lemuriano', 'andromedano'], rigidTrees: [1], treeVariants: [0, 0, 0, 1],
    stone: ['#ece0d0', '#ffffff', '#c8b8a8', '#2ae0d0', '#ff7a8a'],
    strata: ['rgba(120,240,255,0.07)', 'rgba(0,0,0,0)', 'rgba(0,20,60,0.12)', 'rgba(0,0,0,0)', 'rgba(255,200,180,0.05)', 'rgba(0,20,60,0.08)'],
    stormCols: ['#bfeaff', '#ffffff', '#8ac0e0'], stormHaze: '60,110,160', stormStreak: '200,235,255', stormStreak2: '120,170,220',
    // los marcadores colocados dentro del agua no deben dejar huecos de aire
    postMap(L) { for (const m of L.markers) { const x = m.x, y = m.y; if (L.tile(x - 1, y) === '~' || L.tile(x + 1, y) === '~' || (L.tile(x, y - 1) === '~' && L.tile(x, y + 1) === '~')) L.map[y][x] = '~'; } },
    ambient(L, cx, cy, rf) {
      if (L.theme === 'facility' || L.theme === 'lab') return false;
      // gotas de lluvia fina / brisa marina y motas bioluminiscentes
      if (L.t % 5 === 0) L.parts.add({ x: cx + P.rand(0, P.W), y: cy + P.rand(0, P.H), vx: P.rand(0.2, 0.6), vy: P.rand(-0.15, 0.05), life: P.ri(60, 120), col: Math.random() < rf ? P.pick(['#c8fffc', '#5af0ff', '#ffffff']) : P.pick(['#8a7ab0', '#ff3aa0']), size: 1, glow: L.theme === 'deep' || L.theme === 'cave' ? 3 : 0 });
      return true;
    },
    levelUpdate(L) {
      if (L.def.storm) KA.levelUpdate(L);
      const c = L.cam, rf = L.restoredFrac();
      // burbujas desde el fondo y nadadores luminosos en el agua visible
      if (L.t % 4 === 0) for (let k = 0; k < 2; k++) {
        const tx = Math.floor((c.x + P.rand(0, P.W)) / TS), ty = Math.floor((c.y + P.rand(0, P.H)) / TS);
        if (L.tile(tx, ty) === '~' && L.tile(tx, ty + 1) !== '~') L.parts.add({ x: tx * TS + P.rand(2, 14), y: ty * TS + 12, vy: -P.rand(0.4, 0.9), life: 80, col: '#d8fffa', size: 1, fn: q => { q.vx = Math.sin(q.life * 0.2) * 0.3; if (L.tile(Math.floor(q.x / TS), Math.floor(q.y / TS)) !== '~') q.life = 0; } });
        else if (L.tile(tx, ty) === '~' && L.tile(tx, ty - 1) === '~' && Math.random() < 0.3) { const dir = P.pick([-1, 1]); L.parts.add({ x: tx * TS + 8, y: ty * TS + 8, vx: dir * P.rand(0.4, 0.9), life: 140, col: Math.random() < rf ? P.pick(['#ffd166', '#5af0ff', '#ff9ab0']) : '#8a7ab0', size: 2, glow: 3, fade: false, fn: q => { q.vy = Math.sin(q.life * 0.12) * 0.3; if (L.tile(Math.floor(q.x / TS), Math.floor(q.y / TS)) !== '~') { q.vx = -q.vx; q.x += q.vx * 2; } } }); }
      }
    },
    // agua: tonos por profundidad, espuma en las orillas, reflejos y cáusticas sobre la roca
    levelDraw(L, c) {
      const cx = Math.round(L.cam.x), cy = Math.round(L.cam.y), t = L.t, tx0 = Math.floor(cx / TS), ty0 = Math.floor(cy / TS);
      for (let ty = ty0; ty <= ty0 + 17; ty++) for (let tx = tx0; tx <= tx0 + 30; tx++) {
        const ch = L.tile(tx, ty), X = tx * TS - cx, Y = ty * TS - cy;
        if (ch === '~') {
          let d = 0; while (d < 8 && L.tile(tx, ty - d - 1) === '~') d++;
          if (d > 0) { c.fillStyle = 'rgba(2,10,40,' + Math.min(L.theme === 'deep' ? 0.16 : 0.4, d * (L.theme === 'deep' ? 0.025 : 0.055)) + ')'; c.fillRect(X, Y, 16, 16); }
          else {
            // superficie: brillo móvil y espuma junto a las orillas
            c.fillStyle = 'rgba(220,255,255,0.55)'; const o = (t * 0.6 + tx * 11) % 24; if (o < 14) c.fillRect(X + o, Y + 2, 3, 1);
            if (P.SOLID[L.tile(tx - 1, ty)] === 1 || P.SOLID[L.tile(tx + 1, ty)] === 1) { c.fillStyle = 'rgba(255,255,255,0.8)'; for (let i = 0; i < 4; i++) c.fillRect(X + (P.SOLID[L.tile(tx - 1, ty)] === 1 ? i * 2 : 14 - i * 2), Y + 2 + ((t >> 3) + i) % 3, 2, 1); }
          }
        } else if (ch === '|' && (L.tile(tx - 1, ty) === '~' || L.tile(tx + 1, ty) === '~')) { c.fillStyle = L.tile(tx, ty - 1) === '~' || L.tile(tx - 1, ty - 1) === '~' ? 'rgba(20,120,170,0.42)' : 'rgba(20,120,170,0.3)'; c.fillRect(X, Y + (L.tile(tx - 1, ty - 1) === '~' || L.tile(tx, ty - 1) === '|' ? 0 : 3), 16, 16);
        } else if (P.SOLID[ch] === 1) {
          // cáusticas sobre la roca bajo el agua y reflejos del agua sobre muros cercanos a la superficie
          if (L.tile(tx, ty - 1) === '~') { c.fillStyle = 'rgba(160,255,255,0.18)'; for (let i = 0; i < 3; i++) c.fillRect(X + ((t >> 2) + i * 6 + tx * 3) % 16, Y + 1 + i * 3, 3, 1); }
          else if (L.tile(tx, ty + 1) === '~' || L.tile(tx, ty + 2) === '~') { if (L.tile(tx - 1, ty) === '.' || L.tile(tx + 1, ty) === '.' || L.tile(tx, ty - 1) === '.') { c.fillStyle = 'rgba(140,240,255,' + (0.1 + Math.sin(t * 0.06 + tx) * 0.05) + ')'; c.fillRect(X, Y + 8 + Math.round(Math.sin(t * 0.05 + tx) * 2), 16, 2); } }
        }
      }
      if (L.def.storm) KA.levelDraw(L, c);
    },
    owDraw(sc, c, cx, cy) {
      // destellos sobre el mar y espuma en las costas del archipiélago
      for (let i = 0; i < 18; i++) { const x = ((i * 97 + sc.t * 0.3) % (P.W + 40)) - 20, y = (i * 53) % P.H; const tx = Math.floor((x + cx) / 16), ty = Math.floor((y + cy) / 16); if (sc.g[ty] && sc.g[ty][tx] === 'w' && (sc.t + i * 13) % 60 < 30) { c.fillStyle = 'rgba(230,255,255,0.7)'; c.fillRect(Math.round(x), Math.round(y), 3, 1); } }
    }
  });

  // ---------- hitos lejanos, atrezo y arquitectura lemuriana ----------
  (function () {
    const cache = {}, HZ = 'rgba(170,230,255,0.4)', mk = (key, w, h, fn) => () => { if (cache[key]) return cache[key]; const p = new P.Painter(w, h); fn(p, P.RNG(P.hash(key))); const cv = p.canvas(), x = cv.getContext('2d'); x.globalCompositeOperation = 'source-atop'; x.fillStyle = HZ; x.fillRect(0, 0, w, h); return (cache[key] = cv); };
    const A = ['#1a5a6a', '#2a7a8a', '#4aa0a8', '#8ad0d0'], NA = ['#c8b8a8', '#ece0d0', '#fff8f0'];
    P.LANDMARKS.thalassyr = [
      // islas flotantes con cascadas que caen al mar
      mk('lt0', 180, 150, (p, r) => { for (const [x, y, w] of [[40, 30, 28], [120, 50, 36]]) { p.ell(x, y, w, 8, '#3aa07a'); for (let k = 0; k < w; k++) { const d = (1 - Math.abs(k - w / 2) / (w / 2)) * 24; p.rect(x - w / 2 + k, y, 1, d, A[1]); } for (let yy = y + 6; yy < 150; yy++) p.px(x + 4 + Math.sin(yy * 0.2), yy, (yy % 4) ? '#c8fffc' : '#ffffff'); } }),
      // ciudad de conchas sobre pilotes
      mk('lt1', 190, 120, (p, r) => { for (let i = 0; i < 6; i++) { const x = 15 + i * 32, h = 30 + r.int(0, 40); for (let k = 0; k < 3; k++) p.rect(x - 8 + k * 8, 100, 2, 20, '#5a3a20'); for (let y = 0; y < h; y++) { const w = 8 - y / (h / 6); p.rect(x - w, 100 - y, w * 2, 1, NA[(y >> 3) % 2]); } p.px(x, 100 - h - 1, '#2ae0d0'); } p.rect(0, 100, 190, 3, '#a07a50'); }),
      // gran arco marino
      mk('lt2', 170, 130, (p, r) => { for (let k = 0; k <= 40; k++) { const a = Math.PI * k / 40; p.thick(85 - Math.cos(a) * 62, 130 - Math.sin(a) * 100, 85 - Math.cos(a) * 62, 130 - Math.sin(a) * 100, 18, A[1]); } for (let k = 0; k < 12; k++) p.line(30 + k * 10, 40 + (k % 3) * 4, 30 + k * 10, 60 + (k % 4) * 6, '#3aa07a'); }),
      // cabeza colosal sumergida de una estatua lemuriana
      mk('lt3', 150, 120, (p, r) => { p.sell(75, 80, 50, 46, [NA[0], NA[1], NA[2], '#ffffff']); p.rect(30, 90, 90, 30, A[1]); p.ell(58, 70, 8, 4, A[0]); p.ell(92, 70, 8, 4, A[0]); p.tri(70, 74, 80, 74, 75, 88, NA[0]); for (let k = 0; k < 6; k++) p.tri(40 + k * 14, 40, 46 + k * 14, 40, 43 + k * 14, 20 - (k % 2) * 6, '#2ae0d0'); }),
      // faro de concha en espiral
      mk('lt4', 90, 160, (p, r) => { for (let y = 20; y < 160; y++) { const w = 6 + (y - 20) / 10; p.rect(45 - w, y, w * 2, 1, NA[(Math.floor((y - 20) / 10) % 2)]); } p.sell(45, 18, 10, 9, [NA[0], NA[1], NA[2], '#ffffff']); p.ell(45, 12, 4, 3, '#5af0ff'); })
    ];
    P.PROPS.thalassyr = ['pt_shell', 'pt_buoy', 'pt_coral', 'pt_net'];
    Object.assign(P.PROP_LIGHT, { pt_buoy: '#5af0ff', pt_coral: '#ff9ab0' });
  })();
  P.ARCH.thalassyr = { civ: 'lemuriano', types: ['house', 'special', 'hut', 'shop', 'tower'], extra: [[-10, -1, 'lab'], [9, -1, 'hut'], [-4, 4, 'hut']] };
  P.Sprites.buildThalassyrExtra = function () {
    const O = { up: 0.1, down: 0.15 }, NA = ['#c8b8a8', '#ece0d0', '#fff8f0', '#ffffff'];
    P.mk('pt_shell', 16, 12, 2, (p, f) => { p.sell(8, 8, 7, 5, f ? ['#c06a6a', '#ffa0a0', '#ffd8d0', '#ffffff'] : ['#3a3448', '#504a62', '#6a6280']); for (let k = 0; k < 5; k++) p.line(8, 12, 2 + k * 3, 4, f ? '#c06a6a' : '#2a2438'); }, O);
    P.mk('pt_buoy', 10, 24, 2, (p, f) => { p.rect(4, 8, 2, 16, '#5a3a20'); p.sell(5, 7, 4, 4, f ? ['#a0402a', '#ff7a5a', '#ffd0a0', '#ffffff'] : ['#2a2a3a', '#4a4a5a', '#6a6a7a']); p.px(5, 3, f ? '#5af0ff' : '#3a2a5a'); p.rect(3, 21, 4, 3, '#3a2a1a'); }, O);
    P.mk('pt_coral', 14, 16, 2, (p, f) => { const C = f ? ['#c0405a', '#ff7a8a', '#ffd0d8'] : ['#3a2a4a', '#5a4a6a', '#7a6a8a']; for (const [x, h] of [[3, 10], [7, 15], [11, 8]]) { p.thick(x, 16, x, 16 - h, 2, C[1]); p.thick(x, 16 - h * 0.6, x + 2, 16 - h * 0.8, 1.5, C[1]); p.px(x, 16 - h, C[2]); } }, O);
    P.mk('pt_net', 22, 20, 2, (p, f) => { for (const x of [2, 19]) p.rect(x, 2, 2, 18, '#5a3a20'); for (let y = 4; y < 16; y += 3) p.line(3, y, 19, y + 1, f ? '#e0c090' : '#5a4a3a'); for (let x = 4; x < 19; x += 3) p.line(x, 4, x, 16, f ? '#e0c090' : '#5a4a3a'); for (const x of [6, 12, 16]) p.ell(x, 17, 1.6, 1.6, f ? '#ff7a5a' : '#3a2a2a'); }, O);
    // arquitectura lemuriana: palafito, casa-caracola, faro, mercado flotante, estación de cristal semisumergida, templo de perla
    const W = (p, x, y, w, h, lit, c) => { p.rect(x, y, w, h, lit ? c : '#1a1424'); if (lit) p.px(x, y, '#ffffff'); };
    const TT = (type, f) => (p) => {
      const lit = f === 1, sh = lit ? NA : ['#3a3448', '#504a62', '#6a6280', '#8a82a0'], wood = lit ? ['#5a3a20', '#a07a50', '#e0c090'] : ['#2a2020', '#4a3a3a', '#6a5a5a'], wa = lit ? '#1a9ad0' : '#1e1438', gl = '#ffd166', tq = lit ? '#2ae0d0' : '#3a2a5a';
      if (type === 'hut') { p.rect(0, 26, 30, 4, wa); for (const x of [5, 14, 23]) p.rect(x, 16, 2, 14, wood[0]); p.rect(2, 16, 26, 3, wood[1]); p.sell(15, 12, 11, 7, [wood[0], wood[1], wood[2], '#fff0c0']); p.tri(2, 10, 28, 10, 15, 0, lit ? '#16a08a' : '#2a2a3e'); W(p, 9, 10, 3, 3, lit, gl); W(p, 18, 10, 3, 3, lit, gl); }
      if (type === 'house') { p.rect(0, 42, 44, 4, wa); for (const x of [6, 20, 34]) p.rect(x, 34, 2, 10, wood[0]); for (let k = 0; k < 26; k++) { const a = k * 0.42, r = 18 - k * 0.6; p.sell(22 + Math.cos(a) * (18 - r) * 0.5, 22 + Math.sin(a) * (18 - r) * 0.4, r * 0.7, r * 0.55, [sh[0], sh[1], sh[2], sh[3]]); } p.ell(22, 22, 3, 3, tq); W(p, 10, 26, 4, 4, lit, gl); W(p, 30, 18, 4, 4, lit, gl); p.rect(18, 30, 6, 6, '#0a1a2a'); }
      if (type === 'tower') { for (let y = 10; y < 62; y++) { const w = 4 + (y - 10) / 9; p.rect(14 - w, y, w * 2, 1, sh[Math.floor((y - 10) / 8) % 2 ? 1 : 2]); } p.sell(14, 9, 7, 6, [sh[0], sh[1], sh[2], sh[3]]); p.ell(14, 6, 3, 2.5, lit ? '#5af0ff' : '#3a2a5a'); W(p, 12, 26, 4, 4, lit, gl); W(p, 12, 40, 4, 4, lit, gl); p.rect(11, 54, 6, 8, '#0a1a2a'); }
      if (type === 'shop') { p.rect(0, 30, 46, 6, wa); p.rect(2, 24, 42, 6, wood[1]); p.rect(2, 24, 42, 1, wood[2]); for (let i = 0; i < 3; i++) { const x = 4 + i * 14; p.rect(x, 10, 1, 14, wood[0]); p.rect(x + 11, 10, 1, 14, wood[0]); p.tri(x - 1, 11, x + 13, 11, x + 6, 3, lit ? ['#ff7a8a', '#ffd166', '#2ae0d0'][i] : '#3a2a3a'); } for (const x of [9, 23, 37]) p.sell(x, 21, 3, 2.5, lit ? ['#c06a3a', '#ff9a5a', '#ffd0a0'] : ['#2a2020', '#3a2a2a', '#4a3a3a']); }
      if (type === 'lab') { p.rect(0, 30, 48, 14, wa); p.sell(24, 30, 20, 20, lit ? ['#1a6a8a', '#5ac8e0', '#c8f8ff', '#ffffff'] : ['#1e1a30', '#2e2a44', '#3e3a58', '#504a6a']); for (let k = -2; k <= 2; k++) p.line(24 + k * 8, 12 + Math.abs(k) * 3, 24 + k * 9, 30, sh[0]); p.rect(2, 29, 44, 2, sh[1]); for (let k = 0; k < 5; k++) p.ell(10 + k * 7, 36 + (k % 2) * 3, 1.5, 1.5, lit ? '#d8fffa' : '#3a3458'); W(p, 20, 20, 8, 5, lit, tq); p.rect(40, 6, 2, 16, '#8a98bc'); p.px(41, 5, '#ff3050'); }
      if (type === 'special') { p.rect(2, 44, 40, 6, sh[0]); for (let k = 0; k <= 20; k++) { const a = Math.PI * k / 20; p.thick(22 - Math.cos(a) * 16, 44 - Math.sin(a) * 36, 22 - Math.cos(a) * 16, 44 - Math.sin(a) * 36, 5, k % 4 ? sh[1] : sh[2]); } p.sell(22, 24, 7, 7, lit ? ['#a0a0b8', '#e8e8f8', '#ffffff', '#ffffff'] : ['#2a2a3a', '#3a3a4a', '#4a4a5a']); p.px(20, 22, lit ? '#ffd0ff' : '#3a2a4a'); for (let k = 0; k < 5; k++) p.thick(8 + k * 7, 44, 8 + k * 7 + (k % 2 ? 2 : -2), 38, 2, lit ? '#ff7a8a' : '#3a2a4a'); }
    };
    for (const t in P.ARCH_SIZE) P.mk('th_b_' + t, P.ARCH_SIZE[t][0], P.ARCH_SIZE[t][1], 2, (p, f) => TT(t, f)(p), { up: 0.1, down: 0.16, dark: 0.5 });
  };
  (function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildThalassyrExtra(); }; })();

  // ---------- entidades propias ----------
  // Cascada decorativa: cae desde el techo o saliente hasta el agua o el suelo, con espuma y bruma
  P.Waterfall = class extends P.Ent {
    constructor(L, x, y, m) { let ty = m.y; while (ty > 0 && L.coll(m.x, ty - 1) !== 1) ty--; let by = m.y; while (by < L.rows - 1 && L.coll(m.x, by) !== 1 && !L.isLiquid(m.x, by)) by++; super(L, m.x * TS + 2, ty * TS, 12, (by - ty) * TS + 4); this.light = '#bff6ff'; }
    update() { this.t++; if (this.t % 3 === 0) this.L.parts.add({ x: this.cx + P.rand(-8, 8), y: this.y + this.h - 2, vx: P.rand(-0.6, 0.6), vy: -P.rand(0.3, 1.2), life: 30, col: P.pick(['#ffffff', '#d8fffa']), size: P.pick([1, 2]) }); }
    draw(c, cx, cy) {
      const x = Math.round(this.x - cx), y = Math.round(this.y - cy);
      for (let yy = 0; yy < this.h; yy += 16) P.spr(c, 'fall', (this.t >> 2) + (yy >> 4), x - 2, y + yy);
      c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.ellipse(x + 6, y + this.h - 2, 12 + Math.sin(this.t * 0.2) * 2, 3, 0, 0, 7); c.fill();
      P.drawGlow(c, x + 6, y + this.h - 4, 16, '#bff6ff', 0.35);
    }
  };
  // Electrodisco: flota subiendo y bajando dentro del agua; descarga al contacto
  P.Jellybob = class extends P.Enemy {
    constructor(L, x, y) { super(L, x - 8, y - 16, 16, 16, { kind: 'electrodisco', hp: 14, dmg: 12, xp: 8, drops: { bio: 2 }, natural: true, spr: 'jelly', flying: true }); this.ph = Math.random() * 7; this.by = this.y; }
    update() { if (this.commonUpdate()) return; this.ph += 0.03; this.y = this.by + Math.sin(this.ph) * 22; this.x = this.home.x + Math.sin(this.ph * 0.5) * 10; if (this.t % 20 === 0 && !this.passive) this.L.parts.add({ x: this.cx + P.rand(-6, 6), y: this.cy, life: 10, col: '#ffffff', size: 1, glow: 3 }); }
    draw(c, cx, cy) { P.drawGlow(c, this.cx - cx, this.cy - cy, 14, '#a08aff', 0.4); this.drawSpr(c, cx, cy, this.passive ? Math.floor(this.t / 20) % 2 : (this.t % 40 < 6 ? 2 : Math.floor(this.t / 12) % 2)); }
  };
  // Cápsulas de BRASA y BRISA: su prueba de combate en dos oleadas
  P.TwinPods = class extends P.Ent {
    constructor(L, x, y) { super(L, x - 22, y - 34, 44, 34); this.wave = 0; }
    get interact() { return !P.State.data.comps.unlocked.twins && !this.L.arena; }
    get prompt() { return 'Iniciar prueba de combate'; }
    use() {
      this.L.say([['elara', 'Las cápsulas responden. Inicio de la prueba de combate: dos oleadas de objetivos hostiles.'], ['hero', 'Adelante. Estoy listo.']], () => {
        const L = this.L, x0 = Math.floor(this.cx / (24 * TS)) * 24 * TS; L.arena = { x0, x1: x0 + 24 * TS, e: this }; L.minX = x0; L.maxX = x0 + 24 * TS; P.Audio.music('boss'); this.spawnWave();
      });
    }
    spawnWave() {
      const L = this.L, x0 = L.arena.x0; this.wave++; P.Audio.sfx('roar'); P.toast('Oleada ' + this.wave + '/2', { col: P.UIC.red, life: 90 });
      this.foes = [];
      if (this.wave === 1) for (let i = 0; i < 3; i++) { const e = L.add(new P.Fly(L, x0 + 80 + i * 110, this.y - 60, true)); e.kind = 'planeforo_dron'; this.foes.push(e); }
      else for (let i = 0; i < 3; i++) { const e = L.add(new P.Crab(L, x0 + 60 + i * 130, this.y + this.h - 8, true)); e.kind = 'coralix_cy'; this.foes.push(e); }
      for (const e of this.foes) L.parts.burst(e.cx, e.cy, 12, { col: '#5af0ff', smin: 1, smax: 3 });
    }
    update() {
      this.t++; const L = this.L;
      if (L.arena && L.arena.e === this && this.foes && this.foes.every(e => e.dead)) {
        if (this.wave < 2) this.spawnWave();
        else {
          L.endArena(); this.foes = null; const S = P.State;
          L.say([['elara', 'Prueba superada. Reactivando las cápsulas…'], ['brasa', '¡Sistemas de fuego en línea! ¿Dónde están los malos?'], ['brisa', 'Sistemas de viento en línea. Calma, hermano. Ya los ha derrotado {N}.'], ['brasa', 'Hmpf. Entonces protegeremos a {N}. ¡Los dos!'], ['brisa', 'Siempre los dos.']], () => {
            S.data.comps.unlocked.twins = true; S.missionDone('s_twins'); S.ach('twins'); S.addXP(60); P.toast('BRASA y BRISA se unen a tu equipo (Bahía de apoyo)', { col: P.UIC.green, icon: 'por_twins', life: 260 });
          });
        }
      }
    }
    draw(c, cx, cy) {
      const x = Math.round(this.x - cx), y = Math.round(this.y - cy), on = !!P.State.data.comps.unlocked.twins;
      for (const [dx, col, spr] of [[0, '#ff5a3a', 'brasa'], [24, '#5ab0ff', 'brisa']]) {
        c.fillStyle = '#2e3346'; c.fillRect(x + dx, y + 4, 20, 30); c.fillStyle = '#8a98bc'; c.fillRect(x + dx, y + 4, 20, 2);
        c.fillStyle = on ? 'rgba(0,0,0,0.3)' : 'rgba(150,220,255,0.3)'; c.fillRect(x + dx + 3, y + 8, 14, 22);
        if (!on) P.spr(c, spr, 0, x + dx + 2, y + 12 + Math.round(Math.sin(this.t * 0.05 + dx)));
        P.drawGlow(c, x + dx + 10, y + 20, 14, col, 0.3 + Math.sin(this.t * 0.07 + dx) * 0.1);
      }
    }
  };
  P.SPEAKERS.brasa = P.SPEAKERS.brasa || { name: 'BRASA', por: 'por_twins', col: '#ff7a5a' };
  P.SPEAKERS.brisa = P.SPEAKERS.brisa || { name: 'BRISA', por: 'por_twins', col: '#7ac8ff' };

  // marcadores reinterpretados en THALASSYR
  const rk = (e, kind) => { e.kind = kind; return e; };
  P.LV.thalassyr.spawn = {
    c: (L, x, y) => L.add(rk(new P.Crab(L, x - 9, y, false), 'coralix')),
    K: (L, x, y, m, R) => L.add(R ? rk(new P.Crab(L, x - 9, y, false), 'coralix') : rk(new P.Crab(L, x - 10, y, true), 'coralix_cy')),
    A: (L, x, y, m, R) => { if (!R) L.add(rk(new P.Alpha(L, x - 20, y), 'ordanox')); },
    f: (L, x, y) => L.add(rk(new P.Frog(L, x - 7, y - 11), 'burbujon')),
    d: (L, x, y) => L.add(rk(new P.Fly(L, x - 8, y - 20, false), 'planeforo')),
    D: (L, x, y, m, R) => { const fac = L.theme === 'facility' || L.theme === 'lab'; if (!R) { const e = L.add(new P.Fly(L, x - 8, y - 20, true)); if (!fac) e.kind = 'planeforo_dron'; } else if (!fac) L.add(rk(new P.Fly(L, x - 8, y - 20, false), 'planeforo')); },
    l: (L, x, y) => L.add(rk(new P.Slug(L, x - 10, y - 8), 'mantorra')),
    p: (L, x, y, m, R) => { if (!R) L.add(rk(new P.Maw(L, x - 6, y - 16), 'abisomaca')); else L.add(new P.Decor(L, x, y, 'fern_r', 'plumaria')); },
    v: (L, x, y, m) => L.add(rk(new P.VSnake(L, x, m.y * TS), 'pendulinia')),
    w: (L, x, y) => L.add(new P.Jellybob(L, x, y)),
    Q: (L, x, y, m) => L.add(new P.Waterfall(L, x, y, m))
  };
  P.LV.thalassyr.levels.find(l => l.id === 6).events[0].spawn = (L, x, y) => L.add(new P.TwinPods(L, x, y));
  P.LV.thalassyr.overworld.vip = { look: 'maelis', civ: 'lemuriano', talk: lib => [['maelis', lib >= 10 ? 'El mar brilla de nuevo, {N}. Y dicen que Ondarith camina otra vez por la Costa de Nácar.' : 'Cada territorio liberado devuelve la luz a una parte del océano. Las mareas te lo agradecen.']] };
})();
