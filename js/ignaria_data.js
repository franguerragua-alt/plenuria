'use strict';
// IGNÁRIA — datos, mecánicas volcánicas (géiseres, rocas que caen, suelo que se agrieta y suelta lava, losas que
// emergen del magma, cristales térmicos, compuertas, ceniza), luz de magma y arquitectura reptiliana de las forjas.
(function () {
  const D = P.D, T = 'ignaria', I = P.IGC, TSZ = 16;
  Object.assign(D.planet(T), { ready: true, lair: 'la Guarida de MAGNAROK' });
  Object.assign(D.BOSSES.magnarok, { col: '#ff6a1a', col2: '#ffd166' });

  // ---------- armas y mejoras ----------
  D.WEAPONS.magma = { name: 'Cañón de Magma', icon: 'i_magmagun', planet: T, desc: 'Lanza una bola de magma lenta y pesada que estalla al impactar y quema a los enemigos cercanos.', dmg: 14, rate: 30, speed: 4.2, spr: 'ig_b_orb', magma: true };
  Object.assign(D.UPGRADES, {
    vapor: { name: 'Toberas de Vapor', icon: 'i_steam', kind: 'Movimiento', planet: T, desc: 'Las fumarolas te lanzan más alto y los géiseres te impulsan en vez de quemarte.' },
    magma: { name: 'Cañón de Magma', icon: 'i_magmagun', kind: 'ATAQUE', planet: T, desc: 'Nueva arma: bolas de magma que estallan y queman alrededor. Cambia de arma con ' },
    basalto: { name: 'Piel de Basalto', icon: 'i_basalt', kind: 'DEFENSA', planet: T, desc: 'Recibes un 12 % menos de daño y las rocas que caen ya no te hacen daño.' },
    erupcion: { name: 'Corazón de la Erupción', icon: 'i_eruption', kind: 'SUPERATAQUE', planet: T, desc: 'Núcleo arrancado de MAGNAROK. El Pulso Solar levanta columnas de magma por toda la pantalla.' }
  });
  D.RECIPES.push({ id: 'magma_mk2', name: 'Cañón de Magma Mk II', desc: '+30 % de daño del Cañón de Magma.', cost: { scrap: 20, crys: 4 }, req: [], needUp: 'magma', needNpc: 'ashkar' });

  // ---------- Archivo Biológico ----------
  const sp = o => Object.assign({ planet: T, variant: 'natural' }, o);
  const MG = D.SPECIES.findIndex(s => s.id === 'magnarok'); if (MG >= 0) D.SPECIES.splice(MG, 1);
  D.SPECIES.push(
    sp({ id: 'escoriapodo', col: 'fauna', spr: 'ig_krazith', name: 'Escoriápodo', sci: 'Scoriapus petrosus', rarity: 'común', habitat: 'Entre las rocas de ceniza.', behavior: 'Pequeño ser de roca con un lomo de escoria y brasas. Embiste a quien pisa su roca.', diet: 'Minerales calientes.', abilities: 'Sus brasas no se apagan nunca.', danger: 2, eco: 'Remueve la ceniza y la vuelve tierra fértil.', lore: 'Los reptilianos los usaban como estufas portátiles.', tasks: ['seen', { k: 'defeat', n: 3 }, { k: 'observe', n: 4 }] }),
    sp({ id: 'escoriapodo_cy', col: 'fauna', spr: 'ig_krazith_cy', name: 'Escoriápodo Cibernético', sci: 'Scoriapus petrosus (mod. Thersek)', rarity: 'poco común', variant: 'cibernética', base: 'escoriapodo', habitat: 'Perímetro de las extractoras.', behavior: 'Centinela blindado que dispara plasma.', diet: 'Carbón de las forjas.', abilities: 'Placas de titanio sobre la escoria.', danger: 3, eco: 'Ninguno.', lore: 'Etiqueta: «LOTE I-E. GRANDES FORJAS».', tasks: ['seen', { k: 'defeat', n: 6 }] }),
    sp({ id: 'titan_menor', col: 'fauna', spr: 'ig_krazith_alfa', name: 'Titán de Magma', sci: 'Magmatitan rupestris (mutación inducida)', rarity: 'rara', variant: 'mutada', base: 'escoriapodo', habitat: 'Cráter activo.', behavior: 'Mole que emerge del magma con un caparazón mineral. Embiste, salta y escupe roca.', diet: 'Magma.', abilities: 'Núcleo fundido bajo la coraza.', danger: 4, eco: 'Removía los lagos de lava y los mantenía vivos.', lore: 'Los reptilianos decían que es una piedra que aprendió a caminar.', tasks: ['seen', { k: 'defeat', n: 1 }] }),
    sp({ id: 'salamandra_brasa', col: 'fauna', spr: 'ig_frog', name: 'Salamandra de Brasa', sci: 'Salamandra ignita', rarity: 'común', habitat: 'Superficies calientes.', behavior: 'Saltadora que se desplaza sobre la roca ardiente y escupe chispas.', diet: 'Insectos de ceniza.', abilities: 'Camina sobre roca a mil grados.', danger: 1, eco: 'Enciende los nidos de los cenizálidos.', lore: 'Si una salamandra te sigue, tu fuego es bueno.', tasks: ['seen', { k: 'defeat', n: 3 }, { k: 'observe', n: 4 }] }),
    sp({ id: 'cenizalido', col: 'fauna', spr: 'ig_dfly', name: 'Cenizálido', sci: 'Cinerala volans', rarity: 'común', habitat: 'Cielos de los volcanes.', behavior: 'Planea sobre las columnas de humo con alas membranosas de ceniza.', diet: 'Partículas calientes.', abilities: 'Vuela en las corrientes térmicas.', danger: 1, eco: 'Dispersa las semillas de la flor de magma.', lore: 'Cuando vuelan en círculo, el volcán va a despertar.', tasks: ['seen', { k: 'observe', n: 3 }] }),
    sp({ id: 'cenizalido_dron', col: 'fauna', spr: 'ig_dfly_cy', name: 'Cenizálido Dron', sci: 'Cinerala volans (mod. Thersek)', rarity: 'poco común', variant: 'cibernética', base: 'cenizalido', habitat: 'Grandes forjas.', behavior: 'Patrulla y dispara láseres.', diet: 'Batería térmica.', abilities: 'Alas de aleación.', danger: 2, eco: 'Ninguno.', lore: 'Thersek los llama «chispas».', tasks: ['seen', { k: 'defeat', n: 5 }] }),
    sp({ id: 'reptalava', col: 'fauna', spr: 'ig_slug', name: 'Reptalava', sci: 'Lavarepens laminatus', rarity: 'común', habitat: 'Coladas de lava enfriándose.', behavior: 'Oruga de placas que se desliza sobre superficies calientes.', diet: 'Costra de lava.', abilities: 'Sus placas aguantan el magma.', danger: 1, eco: 'Pule la costra y deja paso a la flora volcánica.', lore: 'Por donde pasa una reptalava, la roca queda lisa.', tasks: ['seen', { k: 'defeat', n: 2 }, { k: 'restored' }] }),
    sp({ id: 'acechador', col: 'fauna', spr: 'ig_vsnake', name: 'Acechador de Estalactita', sci: 'Stalactidraco insidiator', rarity: 'poco común', habitat: 'Techos de las cuevas incandescentes.', behavior: 'Depredador que cuelga del techo como una estalactita y cae sobre su presa.', diet: 'Salamandras.', abilities: 'Indistinguible de la roca.', danger: 2, eco: 'Controla las poblaciones de las cuevas.', lore: 'Si una estalactita tiene ojos, corre.', tasks: ['seen', { k: 'defeat', n: 2 }] }),
    sp({ id: 'guardian_forja', col: 'fauna', spr: 'ig_wraith', name: 'Guardián de Forja', sci: 'Custos fornacis', rarity: 'poco común', habitat: 'Ciudades y forjas.', behavior: 'Centinela reptiliano con escudo de obsidiana. Bloquea de frente y embiste.', diet: 'Carne asada al volcán.', abilities: 'Escudo forjado en el núcleo.', danger: 3, eco: 'Protege las ciudades de las laderas.', lore: 'Un guardián de forja jura no retroceder jamás. Casi nunca lo cumple.', tasks: ['seen', { k: 'defeat', n: 3 }] }),
    sp({ id: 'pacecalor', col: 'fauna', spr: 'ig_grazer', name: 'Pacecalor', sci: 'Thermopascens porosus', rarity: 'rara', restoredOnly: true, habitat: 'Junto a las fuentes termales.', behavior: 'Herbívoro de caparazón poroso que se calienta junto a las fumarolas.', diet: 'Musgo de azufre.', abilities: 'Su caparazón guarda calor durante días.', danger: 0, eco: 'Convive con todas las especies de las laderas.', lore: 'Los niños reptilianos duermen apoyados en un pacecalor.', tasks: ['seen', { k: 'observe', n: 5 }] }),
    sp({ id: 'titan_magma', col: 'fauna', spr: 'ig_vellorn', name: 'Gran Titán de Magma', sci: 'Magmatitan rex', rarity: 'legendaria', restoredOnly: true, habitat: 'Solo aparece en una IGNÁRIA completamente restaurada.', behavior: 'Coloso que se baña en los lagos de lava con grietas doradas.', diet: 'El calor del núcleo.', abilities: 'Su paso enciende la roca.', danger: 0, eco: 'Dicen que los volcanes duermen cuando él duerme.', lore: 'Los reptilianos lo llaman «el que mantiene el fuego vivo».', tasks: ['seen', { k: 'observe', n: 6 }] }),
    sp({ id: 'magnarok', col: 'fauna', spr: 'magnarok', boss: true, name: 'MAGNAROK', title: 'Mastodonte de Fuego', sci: 'Mammuthus ignis (mod. Thersek)', rarity: 'única', variant: 'cibernética', habitat: 'Guarida de MAGNAROK.', behavior: 'Dormía bajo el volcán desde el principio del mundo. Thersek le dio tres ojos nuevos y un corazón de horno.', diet: 'Magma del núcleo.', abilities: 'Trompa colosal, chorros de magma, pisotones que derriban el techo.', danger: 5, eco: 'Su respiración mantenía activos los volcanes del planeta.', lore: 'Los reptilianos le dedicaban sus primeras forjas.', tasks: ['seen', { k: 'defeat', n: 1 }] }),
    sp({ id: 'farol_brasa', col: 'flora', spr: 'ig_lamp', name: 'Farol de Brasa', sci: 'Prunalampas', rarity: 'común', habitat: 'Toda la región volcánica.', behavior: 'Brasa viva dentro de una caperuza de roca.', diet: 'Calor del suelo.', abilities: 'Ilumina su entorno.', danger: 0, eco: 'Calienta a las crías de salamandra.', lore: 'Las casas reptilianas se iluminan con faroles de brasa.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'helecho_ceniza', col: 'flora', spr: 'ig_fern_r', name: 'Helecho de Ceniza', sci: 'Pteris cinerea', rarity: 'común', habitat: 'Llanuras de ceniza.', behavior: 'Frondas negras con nervios incandescentes.', diet: 'Ceniza mineral.', abilities: 'Resiste la lluvia de ceniza.', danger: 0, eco: 'Fija la ceniza al suelo.', lore: 'Sus nervios brillan más antes de una erupción.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'vaina_azufre', col: 'flora', spr: 'ig_mush', name: 'Vaina de Azufre', sci: 'Sulphurocapsa', rarity: 'poco común', habitat: 'Zonas contaminadas.', behavior: 'Revienta en nubes de azufre al notar vibraciones.', diet: 'Gases volcánicos.', abilities: 'Gas irritante.', danger: 3, eco: 'Absorbe los gases del régimen.', lore: 'Los reptilianos la usaban para ahuyentar a los acechadores.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'arbol_basalto', col: 'flora', spr: 'ig_bigmush', name: 'Árbol de Basalto', sci: 'Arbor basaltica', rarity: 'poco común', habitat: 'Laderas.', behavior: 'Corteza de roca y hojas minerales incandescentes.', diet: 'Calor del subsuelo.', abilities: 'Sus hojas guardan brasas.', danger: 0, eco: 'Da sombra y calor a la vez.', lore: 'Su corteza se usa para forjar empuñaduras.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'cristal_magma', col: 'flora', spr: 'ig_column', name: 'Cristal de Magma', sci: 'Crystallus igneus', rarity: 'común', habitat: 'Cuevas y cráteres.', behavior: 'Formación mineral que se enciende cuando algo se acerca.', diet: 'Calor.', abilities: 'Guarda energía volcánica.', danger: 0, eco: 'Ilumina las cuevas.', lore: 'Los cristales térmicos de las forjas se tallan de estas formaciones.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'fumarola', col: 'flora', spr: 'ig_t_bulb_r', name: 'Fumarola', sci: 'Fumarola vivens', rarity: 'común', habitat: 'Suelos volcánicos.', behavior: 'Respiradero que lanza chorros de vapor.', diet: 'Gases del núcleo.', abilities: 'Impulsa a quien la pisa.', danger: 0, eco: 'Libera la presión del volcán.', lore: 'Los mensajeros reptilianos viajaban de fumarola en fumarola.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'liana_cobre', col: 'flora', spr: 'ig_t_vine_r', name: 'Liana de Cobre', sci: 'Liana cuprea', rarity: 'común', habitat: 'Paredes de las forjas.', behavior: 'Enredadera metálica que crece hacia el calor.', diet: 'Cobre disuelto.', abilities: 'Resiste el peso de un cyborg.', danger: 0, eco: 'Une las piedras sueltas.', lore: 'Las cadenas de la ciudad se trenzan con liana de cobre.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'espina_obsidiana', col: 'flora', spr: 'ig_t_thorn_r', name: 'Espina de Obsidiana', sci: 'Spina obsidiana', rarity: 'común', habitat: 'Bordes de los cráteres.', behavior: 'Crece en púas de vidrio volcánico.', diet: 'Minerales.', abilities: 'Púas afiladísimas.', danger: 2, eco: 'Protege los nidos de cenizálidos.', lore: 'Cuando el volcán sana, sus puntas brillan.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'caliz_brasa', col: 'flora', spr: 'ig_maw', name: 'Cáliz de Brasa', sci: 'Calyx ignitus vorax', rarity: 'poco común', variant: 'mutada', habitat: 'Zonas contaminadas.', behavior: 'Planta carnívora de pétalos minerales.', diet: 'Carnívora.', abilities: 'Escupe semillas ardientes.', danger: 3, eco: 'En su forma natural, guardaba agua de las nubes de vapor.', lore: 'Su forma natural se llamaba «Copa del Vapor».', tasks: ['seen', { k: 'defeat', n: 2 }] }),
    sp({ id: 'savia_ignea', col: 'flora', spr: 'ig_heal', name: 'Savia Ígnea', sci: 'Sapa ignea', rarity: 'poco común', habitat: 'Junto a las fumarolas.', behavior: 'Gotas doradas de savia caliente.', diet: 'Calor.', abilities: 'Repara tejidos y circuitos.', danger: 0, eco: 'Medicina de la fauna herida.', lore: 'Los herreros se la ponen en las quemaduras.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'flor_magma', col: 'flora', spr: 'ig_orchid', name: 'Flor de Magma', sci: 'Flos magmae', rarity: 'rara', restoredOnly: true, habitat: 'Territorios liberados.', behavior: 'Se abre al detectar cambios de temperatura.', diet: 'Calor.', abilities: 'Sus semillas aguantan el magma.', danger: 0, eco: 'Alimenta a los pacecalor.', lore: 'Ashkar quiere plantarlas en los Jardines de la nave.', tasks: ['seen', { k: 'scan' }] })
  );
  D.CODEX_REWARDS.ignaria = {
    fauna: { name: 'Sangre de Escoria', desc: 'Mod cyborg: +8 % de daño.', mod: 'escoria' },
    flora: { name: 'Savia de Brasa', desc: 'Mod cyborg: las curaciones son un 10 % más potentes.', mod: 'brasa' },
    all: { name: 'Fragua de la nave + Gran Titán de Magma', desc: 'Una fuente termal para los Jardines y el legendario Gran Titán de Magma se traslada a la nave.', creature: 'titan_magma' }
  };
  Object.assign(D.MISSIONS, {
    s_ecos_i: { count: d => ['h57', 'h58', 'h59', 'h60', 'h61', 'h62', 'h63', 'h64'].filter(h => d.holos[h]).length, name: 'Ecos del volcán', giver: 'ELARA', desc: 'Recupera los 8 registros holográficos ocultos en IGNÁRIA.', goal: 8, reward: { xp: 340, crys: 3 } },
    s_ashkar: { name: 'El herrero de las laderas', giver: 'ELARA', desc: 'Un reptiliano está prisionero en los Montes de Basalto.', goal: 1, reward: { xp: 180 } },
    s_flores_i: { count: d => d.seeds_s_flores_i || 0, name: 'Flores de magma', giver: 'Ashkar', desc: 'Ashkar necesita 5 semillas de Flor de Magma. Solo brotan en territorios liberados de IGNÁRIA.', goal: 5, reward: { xp: 230, crys: 4 } }
  });
  D.ACHIEVEMENTS.push({ id: 'magnarok', name: 'Domador de colosos', desc: 'Derrota a MAGNAROK.' }, { id: 'lib_ignaria', name: 'El fuego vuelve a ser vida', desc: 'Libera los 10 territorios de IGNÁRIA.' });
  Object.assign(D.HOLOS, {
    h57: { title: 'Bitácora de Ashkar · Las forjas', text: 'Las forjas ya no hacen herramientas. Solo placas, placas y más placas para la Esfera. El volcán tose humo negro.' },
    h58: { title: 'Orden Esquelética 902 · Gerselle', text: 'Producción de placas al 400 %. Si el mastodonte se cansa, que le den más carbón.' },
    h59: { title: 'Registro geológico reptiliano', text: 'El suelo agrietado de las cuevas guarda magma debajo. Ninguna roca de IGNÁRIA es de fiar.' },
    h60: { title: 'Canción del cráter', text: '«Fuego que duerme, fuego que canta; la roca respira, la lava levanta. Cuando el coloso apoye la trompa, el volcán sabrá quién lo escucha.»' },
    h61: { title: 'Crónica de la ciudad', text: 'Construimos en la ladera porque el volcán nos da calor y metal. A cambio, le cantamos. Era un buen trato.' },
    h62: { title: 'Informe de forja', text: 'Lote 77 de placas para el Anillo Sur de la Esfera. Calidad: impecable. Mano de obra: prescindible. Firmado: Gerselle.' },
    h63: { title: 'Inscripción del núcleo', text: '«MAGNAROK no es una bestia: es el pulmón del volcán. Si lo matáis, IGNÁRIA se enfría para siempre.»' },
    h64: { title: 'Mensaje de N-0', text: '«Siete, la Esfera tiene un punto débil: el corazón que la alimenta. Lo vi en los planos de XÉRTHA. Te lo enseñaré cuando lleguemos a AERTHYON.»' }
  });
  Object.assign(D.MEMORIES, {
    m16: { title: 'Fragmento de memoria · La forja', text: 'Un herrero reptiliano martillea tu armadura roja. «Te la hago con el fuego del volcán», dice. «Así no te enfriarás nunca.»' },
    m17: { title: 'Fragmento de memoria · El coloso', text: 'MAGNAROK te mira con sus ojos de siempre, ya sin los tres ojos de Thersek. Barrita, y el volcán entero responde.' }
  });
  D.BOSS_OUTRO.magnarok = { up: 'erupcion', skin: 'magma', mem: 'm17', lines: [['elara', 'MAGNAROK se detiene. El horno de Thersek se ha apagado en su pecho.'], ['ashkar', 'Míralo, {N}… vuelve a respirar despacio. El volcán respira con él.'], ['elara', 'He extraído un núcleo de erupción del implante. Tu Pulso Solar levantará columnas de magma.'], ['hero', 'Ocho piezas de ALBA. Solo queda AERTHYON.'], ['elara', 'Ocho de nueve. Integrando… ahora.']] };
  D.POST_BOSS.magnarok = [['thersek', '¡Mi horno! Esas forjas eran las mejores de la Esfera, K-7.'], ['gerselle', 'Ya no importa, Thersek. El Anillo Sur está terminado.'], ['merek', 'Ocho mundos. Solo te queda el cielo, {N}. Y el cielo es mío.'], ['elara', 'Transmisión cortada. La última ruta aún no está abierta. Descansa, {N}.']];
  D.FIRST_CLEAR = D.FIRST_CLEAR || {};
  D.FIRST_CLEAR.ignaria = (S, id) => { if (id === 1) { S.startMission('s_ecos_i'); S.startMission('s_ashkar'); } if (S.liberated(T) >= 10) S.ach('lib_ignaria'); if (id === 11) S.ach('magnarok'); };
  D.RESCUE = D.RESCUE || {};
  D.RESCUE.ashkar = { name: 'Ashkar', mission: 's_ashkar', lines: [['ashkar', '¿Un cyborg rojo? ¿Con esa armadura? Yo conozco esa forja.'], ['ashkar', 'Soy Ashkar, herrero de las laderas. Me encerraron por negarme a fundir más placas para la Esfera.'], ['hero', 'Soy {N}. Vengo a apagar esas forjas.'], ['ashkar', 'Entonces tendrás que hablar con MAGNAROK. El régimen lo usa como horno.'], ['elara', 'Teletransporte preparado. Bienvenido a bordo, Ashkar.']],
    onRescue: S => { S.startMission('s_flores_i'); },
    ship: { room: 'entrenamiento', off: 60, talk: S => [['ashkar', 'Tu armadura tiene buenas costuras. Las hice yo, hace mucho. No te acuerdas, ¿verdad?'], ['ashkar', 'Semillas de Flor de Magma: ' + (S.data.seeds_s_flores_i || 0) + '/5.']] } };
  P.SPEAKERS.ashkar = { name: 'Ashkar', por: 'por_ashkar', col: '#ff8a3a' };
  P.D.VILLAGER_LINES.reptiliano.push('El volcán vuelve a cantar. Esta noche se oye en toda la ladera.', 'Mi forja vuelve a hacer herramientas, no placas. Gracias, viajero.', 'Los pacecalor han vuelto a las fumarolas.');

  // ---------- música ----------
  Object.assign(P.Audio.TRACKS, {
    ignaria: { bpm: 88, root: 40, scale: [0, 1, 4, 5, 7, 8, 10], prog: [0, 1, 5, 4], lead: 'sawtooth', bass: 'sawtooth', arp: 'triangle', drums: 1, pad: true, seed: 811 },
    ignaria_r: { bpm: 92, root: 42, scale: [0, 2, 4, 5, 7, 9, 10], prog: [0, 4, 5, 3], lead: 'triangle', bass: 'sawtooth', arp: 'triangle', drums: 1, pad: true, seed: 811 },
    ignaria_ow: { bpm: 96, root: 45, scale: [0, 2, 3, 5, 7, 8, 10], prog: [0, 5, 3, 4], lead: 'triangle', bass: 'sine', arp: 'triangle', drums: 0, pad: true, seed: 817 }
  });

  // ---------- luz y ambiente ----------
  P.FX.GR.ignaria = { bloomMul: 1.15, day: ['#ff8a4a', '#1a0408', 0.3], golden: ['#ffa050', '#200408', 0.32], dusk: ['#ff6a2a', '#0a0206', 0.34], cave: ['#ff6a2a', '#0a0204', 0.36], deep: ['#ff6a2a', '#0a0204', 0.36], sun: [160, 60], fog: '#ff8a4a', rays: '255,140,80' };
  const UA = P.ART.umbrelia;
  const darkAt = (L, px) => { for (const [a, b] of L.umDark || []) if (px >= a && px < b) return true; return false; };
  Object.assign(P.ART.ignaria, {
    seedMission: 's_flores_i', seedName: 'Semilla de Flor de Magma', holoMission: 's_ecos_i',
    civs: ['reptiliano', 'reptiliano', 'arturiano', 'reptiliano', 'andromedano'], rigidTrees: [1], treeVariants: [0, 1],
    stone: ['#2a1e18', '#c8642a', '#120c0a', '#ff6a1a', '#ffd166'],
    strata: ['rgba(255,106,26,0.06)', 'rgba(0,0,0,0)', 'rgba(20,0,0,0.16)', 'rgba(0,0,0,0)', 'rgba(255,200,80,0.04)', 'rgba(10,0,0,0.12)'],
    postMap(L) { L.umDark = []; L.igCr = {}; L.igBroken = []; L.igSpurts = []; (L.def.rows || []).forEach(row => row.forEach((ch, i) => { if (P.IG_DARK.includes(ch)) L.umDark.push([i * 24 * TSZ, (i + 1) * 24 * TSZ]); })); },
    ambient(L, cx, cy, rf) {
      if (L.theme === 'facility' || L.theme === 'lab') { if (L.t % 5 === 0) L.parts.add({ x: cx + P.rand(0, P.W), y: cy + P.H, vy: -P.rand(0.5, 1.2), life: 120, col: P.pick(['#ff6a1a', '#ffb030']), size: 1, glow: 3 }); return true; }
      // ceniza que cae y chispas que suben del suelo
      if (L.t % 3 === 0) L.parts.add({ x: cx + P.rand(0, P.W), y: cy - 4, vx: P.rand(-0.2, 0.3), vy: P.rand(0.2, 0.5), life: 240, col: P.pick(['#4a4442', '#6a6460', '#2a2626']), size: 1 });
      if (L.t % 4 === 0) L.parts.add({ x: cx + P.rand(0, P.W), y: cy + P.H + 2, vx: P.rand(-0.3, 0.3), vy: -P.rand(0.5, 1.3), life: P.ri(80, 140), col: Math.random() < 0.3 + rf * 0.5 ? P.pick(['#ff6a1a', '#ffb030', '#fff0a0']) : '#8a4a2a', size: 1, glow: 3, fn: q => { q.vx += P.rand(-0.03, 0.03); } });
      return true;
    },
    lightAmb(L, amb, rf) { if ((L.darkK || 0) < 0.02) return amb; const base = amb ? parseFloat(amb.split(',')[3]) : 0, a = base + (0.86 - base) * L.darkK; return 'rgba(8,2,0,' + a.toFixed(3) + ')'; },
    // la lava ilumina de verdad lo que tiene cerca
    lights(L, cx, cy) {
      UA.lights(L, cx, cy);
      const tx0 = Math.floor(cx / TSZ), ty0 = Math.floor(cy / TSZ);
      for (let ty = ty0; ty <= ty0 + 17; ty += 1) for (let tx = tx0; tx <= tx0 + 30; tx += 2) if (L.tile(tx, ty) === '~' && L.tile(tx, ty - 1) !== '~') P.Light.add(tx * TSZ + 8 - cx, ty * TSZ + 4 - cy, 34 + Math.sin(L.t * 0.05 + tx) * 4, 0.55);
    },
    drawTile(L, c, ch, X0, Y0, tx, ty, st) {
      if (ch === 'T') { const v = L.igCr[tx + ',' + ty] || 0, f = v > 28 ? 2 : v > 8 ? 1 : 0; P.spr(c, 't_unstable', f, X0 + (f === 2 ? P.ri(-1, 1) : 0), Y0); if (f) P.drawGlow(c, X0 + 8, Y0 + 6, 10, '#ff6a1a', f * 0.18); }
      else if (ch === 'G') { P.spr(c, 't_gate', (L.t >> 5) % 2, X0, Y0); P.drawGlow(c, X0 + 8, Y0 + 8, 8, '#ff6a1a', 0.2); }
    },
    levelUpdate(L) {
      const p = L.player, st = p.st || {};
      const fog = (L.myFogT > 0 && !st.basalto) || darkAt(L, p.cx); if (L.myFogT > 0) L.myFogT--;
      L.darkK = (L.darkK || 0) + ((fog ? 1 : 0) - (L.darkK || 0)) * 0.06;
      // Toberas de Vapor: las fumarolas lanzan más alto
      if (st.vapor && p.vy <= -8.5 && p.vy >= -8.7 && !p._igBoost) { p.vy = -11; p._igBoost = true; } if (p.vy > 0) p._igBoost = false;
      // suelo que se agrieta: si te quedas encima se rompe y escupe lava por el hueco; vuelve a solidificarse
      if (p.onGround && !p.dead) { const ty = Math.floor((p.y + p.h + 1) / TSZ); for (let tx = Math.floor(p.x / TSZ); tx <= Math.floor((p.x + p.w - 1) / TSZ); tx++) if (L.tile(tx, ty) === 'T') { const k = tx + ',' + ty; L.igCr[k] = (L.igCr[k] || 0) + (st.basalto ? 0.6 : 1); if (L.t % 5 === 0) L.parts.add({ x: tx * TSZ + P.rand(2, 14), y: ty * TSZ, vy: -P.rand(0.3, 0.8), life: 26, col: P.pick(['#ff6a1a', '#ffb030']), size: 1, glow: 2 }); } }
      for (const k in L.igCr) if (L.igCr[k] >= 40) { const [tx, ty] = k.split(',').map(Number); delete L.igCr[k]; if (L.tile(tx, ty) !== 'T') continue; L.map[ty][tx] = '.'; L.igBroken.push({ tx, ty, t: 320 }); L.igSpurts.push({ x: tx * TSZ + 8, y: ty * TSZ + 16, t: 0 }); P.Audio.sfx('break'); L.parts.burst(tx * TSZ + 8, ty * TSZ + 8, 12, { col: P.pick(['#ff6a1a', '#ffb030', '#363028']), smin: 1, smax: 3, g: 0.2, size: 2 }); }
      for (const s of L.igSpurts) { s.t++; if (s.t % 2 === 0) L.parts.add({ x: s.x + P.rand(-3, 3), y: s.y - 4, vy: -P.rand(1.5, 3.5), g: 0.12, life: 24, col: P.pick(['#ff6a1a', '#ffb030', '#fff0a0']), size: 2, glow: 3 }); if (s.t > 8 && s.t < 34 && !p.dead && Math.abs(p.cx - s.x) < 10 && p.y + p.h > s.y - 48 && p.y < s.y) p.hurt(9, s.x, { env: true }); }
      L.igSpurts = L.igSpurts.filter(s => s.t < 40);
      for (const b of L.igBroken) if (--b.t <= 0) { const box = { x: b.tx * TSZ, y: b.ty * TSZ, w: TSZ, h: TSZ }; if (!P.overlap(box, p) && !L.ents.some(e => e.isEnemy && !e.dead && P.overlap(box, e))) { L.map[b.ty][b.tx] = 'T'; b.done = true; } else b.t = 20; }
      L.igBroken = L.igBroken.filter(b => !b.done);
    },
    levelDraw(L, c) {
      UA.levelDraw(L, c);
      // ondulación de calor sobre la lava cercana a la superficie
      const cx = Math.round(L.cam.x), cy = Math.round(L.cam.y), tx0 = Math.floor(cx / TSZ), ty0 = Math.floor(cy / TSZ);
      c.fillStyle = 'rgba(255,170,90,0.07)'; for (let ty = ty0; ty <= ty0 + 17; ty++) for (let tx = tx0; tx <= tx0 + 30; tx += 3) if (L.tile(tx, ty) === '~' && L.tile(tx, ty - 1) === '.') { for (let k = 1; k < 4; k++) c.fillRect(tx * TSZ - cx + Math.round(Math.sin(L.t * 0.08 + tx + k) * 2), ty * TSZ - cy - k * 6, 40, 1); }
    },
    owDraw(sc, c) { for (let i = 0; i < 18; i++) { const x = (i * 137 + 11) % P.W, y = P.H - ((i * 53 + sc.t * 0.5) % P.H), a = (Math.sin(sc.t * 0.07 + i) + 1) / 2; c.fillStyle = 'rgba(255,' + (100 + (i % 3) * 50) + ',40,' + (0.3 + a * 0.6) + ')'; c.fillRect(Math.round(x), Math.round(y), 1, 1); } }
  });

  // ---------- hitos, atrezo y arquitectura de las forjas ----------
  (function () {
    const cache = {}, HZ = 'rgba(120,30,20,0.3)', mk = (key, w, h, fn) => () => { if (cache[key]) return cache[key]; const p = new P.Painter(w, h); fn(p, P.RNG(P.hash(key))); const cv = p.canvas(), x = cv.getContext('2d'); x.globalCompositeOperation = 'source-atop'; x.fillStyle = HZ; x.fillRect(0, 0, w, h); return (cache[key] = cv); };
    const C = ['#1a0a10', '#2a1218', '#3a1a1e', '#4a2424'];
    P.LANDMARKS.ignaria = [
      mk('li0', 180, 170, (p, r) => P.Sprites.igVolcano(p, 90, 168, 85, 150, C, I.lava, r, true)),
      mk('li1', 150, 140, (p, r) => { P.Sprites.igVolcano(p, 75, 138, 70, 90, C, I.lava, r, false); for (let k = 0; k < 8; k++) p.ell(75 + r.range(-6, 6), 40 - k * 5, 6 + k, 4, k % 2 ? '#3a3230' : '#2a2422'); }),
      // ciudad suspendida en la ladera con chimeneas de forja
      mk('li2', 170, 130, (p, r) => { for (let y = 0; y < 120; y++) { const w = 80 * (1 - y / 120); p.rect(Math.round(85 - w), 128 - y, Math.round(w * 2), 1, C[(y >> 4) % 2 ? 1 : 2]); } for (let k = 0; k < 6; k++) { const x = 40 + k * 18, y = 100 - (k % 3) * 18; p.rect(x, y, 10, 12, '#3a2a22'); p.rect(x + 2, y + 3, 6, 3, I.lava[2]); p.rect(x + 7, y - 10, 2, 10, '#2a1e18'); } }),
      // columnas de basalto gigantes
      mk('li3', 160, 140, (p, r) => { for (let k = 0; k < 9; k++) { const h = 60 + r.int(0, 70); p.rect(10 + k * 16, 140 - h, 13, h, k % 2 ? '#2a1e1e' : '#3a2a26'); p.rect(10 + k * 16, 140 - h, 13, 2, '#4a3a34'); } })
    ];
    P.PROPS.ignaria = ['pi_vent', 'pi_rocks', 'pi_bones', 'pi_crystal'];
    Object.assign(P.PROP_LIGHT, { pi_vent: '#ff6a1a', pi_crystal: '#ffb030' });
  })();
  P.ARCH.ignaria = { civ: 'reptiliano', types: ['house', 'special', 'hut', 'shop', 'tower'], extra: [[-10, -1, 'lab'], [9, -1, 'hut'], [-4, 4, 'hut']] };
  P.Sprites.buildIgnariaExtra = function () {
    const O = { up: 0.1, down: 0.15 }, dim = (c2, f) => f ? c2 : P.Col.mix(c2, '#2a2422', 0.7);
    P.mk('pi_vent', 16, 14, 2, (p, f) => { p.sell(8, 11, 7, 3, [I.bas[1], I.bas[2], I.bas[3]]); p.ell(8, 10, 3, 1.4, f ? I.lava[2] : '#2a1a14'); }, O);
    P.mk('pi_rocks', 18, 12, 2, (p, f) => { for (let k = 0; k < 3; k++) p.sell(4 + k * 5, 8 - (k % 2) * 2, 3.6, 3, [I.bas[0], I.bas[2], I.bas[3]]); if (f) p.px(9, 6, I.lava[3]); }, O);
    P.mk('pi_bones', 22, 10, 2, (p, f) => { p.thick(2, 8, 20, 6, 2, dim('#d8c8b0', f)); for (let k = 0; k < 4; k++) p.line(5 + k * 4, 7, 4 + k * 4, 2, dim('#b8a890', f)); }, O);
    P.mk('pi_crystal', 14, 18, 2, (p, f) => { if (P.Sprites.umCrystal) { P.Sprites.umCrystal(p, 7, 18, 6, 16, f ? [I.lava[0], I.lava[1], I.lava[3], I.lava[4]] : I.ash, 0.05); P.Sprites.umCrystal(p, 3, 18, 3, 7, f ? [I.lava[0], I.lava[1], I.lava[3], I.lava[4]] : I.ash, -0.2); } }, O);
    // arquitectura reptiliana: vivienda excavada en la roca, templo volcánico, choza con chimenea, mercado bajo toldos
    // de cobre, torre de observación y centro de investigación térmica con calderas
    const TT = (type, f) => p => {
      const lit = f === 1, W = (x, y, w, h) => { p.rect(x, y, w, h, lit ? I.lava[2] : '#1a1210'); if (lit) p.px(x, y, I.lava[4]); };
      if (type === 'hut') { p.tri(2, 30, 28, 30, 15, 8, dim('#3a2a22', f)); p.rect(12, 20, 6, 10, '#0a0606'); p.rect(22, 6, 4, 14, dim('#2a1e18', f)); W(13, 21, 4, 3); if (lit) { p.ell(24, 4, 3, 2, '#3a3230'); p.ell(25, 1, 2, 1.6, '#2a2422'); } }
      if (type === 'house') { p.sell(22, 34, 21, 14, [dim('#120c0a', f), dim('#24201c', f), dim('#363028', f), dim('#4a4238', f)]); p.rect(16, 30, 12, 16, '#0a0606'); p.tri(16, 30, 28, 30, 22, 24, '#0a0606'); W(6, 30, 5, 4); W(33, 30, 5, 4); p.rect(4, 22, 36, 2, dim('#c8642a', f)); }
      if (type === 'tower') { for (let y = 0; y < 52; y++) { const w = 7 - y / 18; p.rect(Math.round(14 - w), 61 - y, Math.round(w * 2), 1, dim(['#2a1e18', '#3a2a22'][(y >> 3) % 2], f)); } p.rect(6, 6, 16, 6, dim('#8a3a14', f)); p.tri(6, 6, 22, 6, 14, 0, dim('#c8642a', f)); W(12, 22, 4, 4); W(12, 36, 4, 4); p.ell(14, 9, 2, 1.6, lit ? '#ffffff' : '#3a2a22'); }
      if (type === 'shop') { p.rect(2, 26, 42, 10, dim('#3a2a22', f)); for (let i = 0; i < 3; i++) { const x = 4 + i * 14; p.rect(x, 12, 1, 14, dim('#8a3a14', f)); p.rect(x + 11, 12, 1, 14, dim('#8a3a14', f)); p.tri(x - 1, 13, x + 13, 13, x + 6, 5, dim(['#c8642a', '#f0a060', '#8a3a14'][i], f)); } for (const x of [9, 23, 37]) p.sell(x, 24, 3, 2.4, lit ? [I.lava[0], I.lava[2], I.lava[3]] : I.ash.slice(0, 3)); }
      if (type === 'lab') { p.rect(2, 30, 44, 14, dim('#24201c', f)); for (const x of [10, 24, 38]) { p.sell(x, 24, 7, 9, [dim('#4a1e0a', f), dim('#8a3a14', f), dim('#c8642a', f)]); p.ell(x, 25, 3, 3, lit ? I.lava[3] : '#1a1210'); p.rect(x - 1, 8, 2, 8, '#7a86a4'); } p.line(10, 12, 38, 12, '#7a86a4'); p.px(40, 8, '#ff3050'); }
      if (type === 'special') { for (let k = 0; k < 4; k++) p.rect(4 + k * 5, 50 - (k + 1) * 9, 36 - k * 10, 9, dim(['#2a1e18', '#3a2a22'][k % 2], f)); p.rect(18, 22, 8, 10, '#0a0606'); p.tri(14, 14, 30, 14, 22, 2, dim('#c8642a', f)); if (lit) { p.ell(22, 18, 3, 2, I.lava[3]); for (let k = 0; k < 6; k++) p.px(19 + k, 1 - (k % 2), I.lava[2 + (k % 2)]); } }
    };
    for (const t in P.ARCH_SIZE) P.mk('ig_b_' + t, P.ARCH_SIZE[t][0], P.ARCH_SIZE[t][1], 2, (p, f) => TT(t, f)(p), { up: 0.1, down: 0.16, dark: 0.5 });
    P.mk('ig_column', 40, 56, 2, (p, f) => { const C = f ? [I.lava[0], I.lava[1], I.lava[3], I.lava[4]] : I.ash; p.sell(20, 54, 16, 3, [I.bas[0], I.bas[1], I.bas[2]]); if (P.Sprites.umCrystal) { P.Sprites.umCrystal(p, 20, 54, 9, 46, C, 0.02); P.Sprites.umCrystal(p, 10, 54, 5, 24, C, -0.15); P.Sprites.umCrystal(p, 30, 54, 6, 30, C, 0.12); } });
    P.mk('ig_rescrys', 20, 34, 3, (p, f) => { p.sell(10, 32, 9, 3, [I.bas[0], I.bas[2], I.bas[3]]); const C = f === 0 ? I.ash : f === 1 ? [I.lava[0], I.lava[1], I.lava[2], I.lava[3]] : [I.lava[1], I.lava[3], I.lava[4], '#ffffff']; if (P.Sprites.umCrystal) P.Sprites.umCrystal(p, 10, 32, 9, 30, C, 0); for (let k = 0; k < 3; k++) p.rect(3 + k * 5, 27, 3, 5, '#7a86a4'); });
    P.mk('ig_geyser', 20, 10, 2, (p, f) => { p.sell(10, 7, 9, 3, [I.bas[1], I.bas[2], I.bas[3]]); p.ell(10, 6, 4, 1.4, f ? I.lava[3] : '#2a1410'); });
    P.Sprites.registerLook('ashkar', Object.assign({}, P.CIV.reptiliano, { skin: '#c8642a', skinD: '#7a3010', hair: '#ffd166', hairD: '#c08a1a', cloth: '#2a1e18', clothD: '#120c0a', acc: '#ff6a1a', h: 23 }));
  };
  (function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildIgnariaExtra(); }; })();

  // ---------- entidades y mecánicas ----------
  // Cristal térmico (Z): guarda energía volcánica; al dispararle abre compuertas y hace emerger losas
  P.ThermalCrystal = class extends P.ResonanceCrystal {
    hit() { if (this.charge < 0.3) { P.Audio.sfx('block'); return; } P.umPulse(this.L, this.cx, this.cy, 150 + 140 * this.charge, this, '#ff7a2a'); this.charge = 0; this.flash = 8; }
    draw(c, cx, cy) { const x = Math.round(this.x - cx), y = Math.round(this.y - cy), full = this.charge >= 1; P.drawGlow(c, x + 8, y + 14, 18 + this.charge * 24, '#ff6a1a', 0.2 + this.charge * 0.35); P.spr(c, 'rescrys', full ? 2 : this.charge > 0.3 ? 1 : 0, x - 2, y - 2, { flash: this.flash > 0 }); c.fillStyle = '#1a0a06'; c.fillRect(x, y + 34, 16, 2); c.fillStyle = full ? '#fff0a0' : '#d0300a'; c.fillRect(x, y + 34, Math.round(16 * this.charge), 2); }
  };
  // Losa de basalto (J): emerge y se hunde en el magma; junto a un cristal térmico solo emerge con su energía
  P.BasaltSlab = class extends P.PetalPlatform {
    draw(c, cx, cy) {
      const x = Math.round(this.x - cx), y = Math.round(this.y - cy);
      if (!this.on) { if ((this.t >> 3) % 3 === 0) for (let k = 0; k < 3; k++) { c.fillStyle = '#ffb030'; c.fillRect(x + 4 + k * 16, y + 5 - ((this.t >> 2) % 3), 2, 2); } c.globalAlpha = 0.4; for (let k = 0; k < 3; k++) P.spr(c, 't_phase', 1, x + k * TSZ, y); c.globalAlpha = 1; return; }
      const sink = this.warn() ? ((this.t >> 2) % 2) : 0; P.drawGlow(c, x + 24, y + 8, 24, '#ff6a1a', 0.3); for (let k = 0; k < 3; k++) P.spr(c, 't_phase', 0, x + k * TSZ, y + sink);
    }
  };
  // Cristal de magma (Q): formación que se enciende cuando te acercas
  P.MagmaCrystal = class extends P.LumenChamber { constructor(L, x, y) { super(L, x, y); this.species = 'cristal_magma'; } };
  // Géiser de calor (Y): burbujea (aviso), estalla en una columna de fuego y descansa; con Toberas de Vapor te impulsa
  P.Geyser = class extends P.Ent {
    constructor(L, x, y) { super(L, x - 10, y - 10, 20, 10); this.ph = Math.floor(x / 7) % 200; }
    get phase() { const t = (this.L.t + this.ph) % 220; return t < 120 ? 0 : t < 165 ? 1 : 2; }
    update() {
      this.t++; const L = this.L, p = L.player, ph = this.phase;
      if (ph === 1 && this.t % 4 === 0) L.parts.add({ x: this.cx + P.rand(-6, 6), y: this.y + 4, vy: -P.rand(0.3, 0.8), life: 20, col: P.pick(['#ff6a1a', '#ffb030']), size: 1, glow: 2 });
      if (ph === 2) {
        if (this.t % 2 === 0) L.parts.add({ x: this.cx + P.rand(-5, 5), y: this.y, vy: -P.rand(3, 6), vx: P.rand(-0.4, 0.4), g: 0.08, life: 26, col: P.pick(['#ff6a1a', '#ffb030', '#fff0a0', '#ffffff']), size: P.pick([2, 3]), glow: 4 });
        if (!p.dead && Math.abs(p.cx - this.cx) < 11 && p.y + p.h > this.y - 84 && p.y < this.y + 4) { if (p.st && p.st.vapor) { if (p.vy > -7) p.vy = -9; } else p.hurt(10, this.cx, { env: true }); }
        if ((this.L.t + this.ph) % 220 === 165) { P.Audio.sfx('explode'); P.shake(2, 8); }
      }
    }
    umLight() { const ph = this.phase; return ph ? [this.cx, this.y - (ph === 2 ? 40 : 0), ph === 2 ? 70 : 30, 0.9] : null; }
    draw(c, cx, cy) {
      const x = Math.round(this.x - cx), y = Math.round(this.y - cy), ph = this.phase;
      P.spr(c, 'geyser', ph ? 1 : 0, x, y);
      if (ph === 1) P.drawGlow(c, x + 10, y + 4, 14, '#ff6a1a', 0.3 + ((this.t >> 2) % 2) * 0.2);
      if (ph === 2) { const g = c.createLinearGradient(0, y - 84, 0, y + 4); g.addColorStop(0, 'rgba(255,240,160,0)'); g.addColorStop(0.4, 'rgba(255,150,40,0.7)'); g.addColorStop(1, 'rgba(255,90,20,0.9)'); c.fillStyle = g; c.fillRect(x + 4 + Math.round(Math.sin(this.t * 0.5)), y - 84, 12, 88); c.fillStyle = 'rgba(255,248,200,0.8)'; c.fillRect(x + 8, y - 60, 4, 64); P.drawGlow(c, x + 10, y - 30, 30, '#ff8a3a', 0.5); }
    }
  };
  // Roca que se desprende (V): tiembla cuando pasas debajo y cae; se rompe al tocar el suelo y vuelve a formarse
  P.FallingRock = class extends P.Ent {
    constructor(L, x, y, m) { super(L, x - 6, m.y * TSZ, 12, 12); this.hx = this.x; this.hy = this.y; this.mode = 'hang'; this.st = 0; }
    update() {
      this.t++; this.st++; const L = this.L, p = L.player;
      if (this.mode === 'hang') { if (Math.abs(p.cx - this.cx) < 26 && p.y > this.y) { this.mode = 'shake'; this.st = 0; P.Audio.sfx('charge'); } }
      else if (this.mode === 'shake') { if (this.st % 6 === 0) L.parts.add({ x: this.cx + P.rand(-4, 4), y: this.y + 12, vy: 0.8, g: 0.1, life: 20, col: '#4a4442', size: 1 }); if (this.st > 36) { this.mode = 'fall'; this.vy = 0; } }
      else if (this.mode === 'fall') { this.vy = Math.min(this.vy + 0.35, 7); this.y += this.vy; if (!p.dead && P.overlap(this, p) && !(p.st && p.st.basalto)) p.hurt(12, this.cx, { env: true }); if (L.coll(Math.floor(this.cx / TSZ), Math.floor((this.y + this.h) / TSZ)) === 1 || this.y > L.H) { this.mode = 'gone'; this.st = 0; P.Audio.sfx('break'); L.parts.burst(this.cx, this.y + 10, 12, { col: P.pick(['#363028', '#ff6a1a', '#24201c']), smin: 1, smax: 3, g: 0.2, size: 2 }); } }
      else if (this.mode === 'gone' && this.st > 360) { this.mode = 'hang'; this.x = this.hx; this.y = this.hy; }
    }
    draw(c, cx, cy) { if (this.mode === 'gone') return; const x = Math.round(this.x - cx + (this.mode === 'shake' ? P.ri(-1, 1) : 0)), y = Math.round(this.y - cy); if (this.mode === 'shake') P.drawGlow(c, x + 6, y + 6, 10, '#ff6a1a', 0.3); P.spr(c, 'rock', this.mode === 'shake' ? 1 : 0, x, y); }
  };
  // Guardián de forja (W): mismo comportamiento que los guardianes de colmena, con escudo de obsidiana
  P.ForgeGuardian = class extends P.HiveGuardian { constructor(L, x, y) { super(L, x, y); this.kind = 'guardian_forja'; this.hp = this.maxhp = Math.round(48 * (L.diff || 1)); } };

  // marcadores reinterpretados en IGNÁRIA
  const rk = (e, kind) => { e.kind = kind; return e; }, gy = (L, m) => L.snapY(m.x, m.y);
  P.LV.ignaria.spawn = {
    c: (L, x, y) => L.add(rk(new P.Crab(L, x - 9, y, false), 'escoriapodo')),
    K: (L, x, y, m, R) => L.add(R ? rk(new P.Crab(L, x - 9, y, false), 'escoriapodo') : rk(new P.Crab(L, x - 10, y, true), 'escoriapodo_cy')),
    A: (L, x, y, m, R) => { if (!R) L.add(rk(new P.Alpha(L, x - 20, y), 'titan_menor')); },
    f: (L, x, y) => L.add(rk(new P.Frog(L, x - 7, y - 11), 'salamandra_brasa')),
    d: (L, x, y) => L.add(rk(new P.Fly(L, x - 8, y - 20, false), 'cenizalido')),
    D: (L, x, y, m, R) => { const fac = L.theme === 'facility' || L.theme === 'lab'; if (!R) { const e = L.add(new P.Fly(L, x - 8, y - 20, true)); if (!fac) e.kind = 'cenizalido_dron'; } else if (!fac) L.add(rk(new P.Fly(L, x - 8, y - 20, false), 'cenizalido')); },
    l: (L, x, y) => L.add(rk(new P.Slug(L, x - 10, y - 8), 'reptalava')),
    p: (L, x, y, m, R) => { if (!R) L.add(rk(new P.Maw(L, x - 6, y - 16), 'caliz_brasa')); else L.add(new P.Decor(L, x, y, 'fern_r', 'helecho_ceniza')); },
    v: (L, x, y, m) => L.add(rk(new P.VSnake(L, x, m.y * TSZ), 'acechador')),
    h: (L, x, y) => { const e = L.add(new P.HealPlant(L, x, y)); e.light = '#ffd166'; },
    Q: (L, x, y, m) => L.add(new P.MagmaCrystal(L, x, gy(L, m))),
    Y: (L, x, y, m) => L.add(new P.Geyser(L, x, gy(L, m))),
    Z: (L, x, y, m) => L.add(new P.ThermalCrystal(L, x, gy(L, m))),
    V: (L, x, y, m) => L.add(new P.FallingRock(L, x, y, m)),
    O: (L, x, y, m) => L.add(new P.SporeCloud(L, x, gy(L, m), m)),
    J: (L, x, y, m) => L.add(new P.BasaltSlab(L, x, y, m)),
    W: (L, x, y, m) => L.add(new P.ForgeGuardian(L, x, gy(L, m)))
  };
  P.LV.ignaria.overworld.vip = { look: 'ashkar', civ: 'reptiliano', talk: lib => [['ashkar', lib >= 10 ? 'El volcán vuelve a respirar tranquilo, {N}. Y dicen que el Gran Titán se baña otra vez en el lago de lava.' : 'Cada territorio liberado apaga una forja del régimen. El volcán lo nota.']] };

  // ---------- integración con el jugador: Cañón de Magma ----------
  const baseKill = P.Proj.prototype.kill;
  P.Proj.prototype.kill = function (spark) {
    if (this.magmaBurst && !this.magmaDone && !this.dead) { this.magmaDone = true; const L = this.L; for (const e of L.ents) if (e.isEnemy && !e.dead && !e.passive && P.dist(this.cx, this.cy, e.cx, e.cy) < 30) e.hit(this.dmg * 0.5, { x: this.cx }); L.fx.push({ k: 'ring', x: this.cx, y: this.cy, t: 0, life: 16, r: 28, col: '#ff6a1a' }); L.parts.burst(this.cx, this.cy, 10, { col: P.pick(['#ff6a1a', '#ffb030', '#fff0a0']), smin: 1, smax: 3, glow: 3 }); }
    return baseKill.call(this, spark);
  };
})();
