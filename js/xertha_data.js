'use strict';
// XÉRTHA — datos, mecánicas del mundo colmena (resina, cámaras de energía biológica, tapones de cera, panales que se
// contraen y se extienden, polen, conductos orgánicos, nidos, guardianes), luz ámbar y arquitectura colménica.
(function () {
  const D = P.D, T = 'xertha', X = P.XEC, TSZ = 16;
  Object.assign(D.planet(T), { ready: true, lair: 'el Trono de ZYRKALIA' });
  Object.assign(D.BOSSES.zyrkalia, { col: '#ffb020', col2: '#3ae0d0' });

  // ---------- armas y mejoras ----------
  D.WEAPONS.aguijon = { name: 'Lanzaguijones Arturiano', icon: 'i_stinger', planet: T, desc: 'Ráfaga rápida de aguijones de quitina que atraviesan a un enemigo y lo envenenan.', dmg: 4, rate: 8, speed: 7.5, spr: 'xe_b_kspine', sting: true };
  Object.assign(D.UPGRADES, {
    adherencia: { name: 'Patas Adherentes', icon: 'i_grip', kind: 'Movimiento', planet: T, desc: 'La resina ya no te frena y corres más rápido sobre el panal.' },
    aguijon: { name: 'Lanzaguijones Arturiano', icon: 'i_stinger', kind: 'ATAQUE', planet: T, desc: 'Nueva arma: ráfaga de aguijones que atraviesan y envenenan. Cambia de arma con ' },
    cera: { name: 'Coraza de Cera', icon: 'i_wax', kind: 'DEFENSA', planet: T, desc: 'Placas de cera real: recibes un 12 % menos de daño y la miel rancia no te hace daño.' },
    enjambre: { name: 'Corazón del Enjambre', icon: 'i_swarm', kind: 'SUPERATAQUE', planet: T, desc: 'Núcleo arrancado de ZYRKALIA. El Pulso Solar suelta un enjambre que pica y envenena a todos los enemigos de la pantalla.' }
  });
  D.RECIPES.push({ id: 'aguijon_mk2', name: 'Lanzaguijones Mk II', desc: '+30 % de daño del Lanzaguijones Arturiano.', cost: { scrap: 18, crys: 3 }, req: [], needUp: 'aguijon', needNpc: 'zelvan' });

  // ---------- Archivo Biológico ----------
  const sp = o => Object.assign({ planet: T, variant: 'natural' }, o);
  const ZK = D.SPECIES.findIndex(s => s.id === 'zyrkalia'); if (ZK >= 0) D.SPECIES.splice(ZK, 1);
  D.SPECIES.push(
    sp({ id: 'quitinopodo', col: 'fauna', spr: 'xe_krazith', name: 'Quitinópodo', sci: 'Chitinopus pedunculatus', rarity: 'común', habitat: 'Llanuras de panal.', behavior: 'Caparazón en domo con ojos en pedúnculos. Embiste a los intrusos.', diet: 'Cera caída.', abilities: 'Sus celdas dorsales guardan miel de reserva.', danger: 2, eco: 'Limpia el panal de cera vieja.', lore: 'Los arturianos contaban sus celdas para saber su edad.', tasks: ['seen', { k: 'defeat', n: 3 }, { k: 'observe', n: 4 }] }),
    sp({ id: 'quitinopodo_cy', col: 'fauna', spr: 'xe_krazith_cy', name: 'Quitinópodo Cibernético', sci: 'Chitinopus pedunculatus (mod. Thersek)', rarity: 'poco común', variant: 'cibernética', base: 'quitinopodo', habitat: 'Perímetro de las extractoras.', behavior: 'Centinela blindado que dispara plasma.', diet: 'Miel refinada.', abilities: 'Placas de titanio sobre la quitina.', danger: 3, eco: 'Ninguno.', lore: 'Etiqueta: «LOTE X-Q. FÁBRICA MELÍFERA».', tasks: ['seen', { k: 'defeat', n: 6 }] }),
    sp({ id: 'acorazado', col: 'fauna', spr: 'xe_krazith_alfa', name: 'Acorazado Melífero', sci: 'Thoracomellis colossus (mutación inducida)', rarity: 'rara', variant: 'mutada', base: 'quitinopodo', habitat: 'Cámaras de incubación.', behavior: 'Mole de placas con un depósito de miel en el lomo. Embiste, salta y dispara púas.', diet: 'Jalea de las incubadoras.', abilities: 'Caparazón casi impenetrable.', danger: 4, eco: 'Protegía las cámaras de cría.', lore: 'Los arturianos lo llamaban «la muralla que camina».', tasks: ['seen', { k: 'defeat', n: 1 }] }),
    sp({ id: 'saltambar', col: 'fauna', spr: 'xe_frog', name: 'Saltámbar', sci: 'Saltoambra pellucida', rarity: 'común', habitat: 'Bosques de antenarias.', behavior: 'Saltador ágil de cuerpo de ámbar translúcido; escupe gotas de miel.', diet: 'Néctar.', abilities: 'Patas traseras enormes.', danger: 1, eco: 'Poliniza al saltar de flor en flor.', lore: 'Al trasluz se ve la miel moverse por dentro.', tasks: ['seen', { k: 'defeat', n: 3 }, { k: 'observe', n: 4 }] }),
    sp({ id: 'zumboptero', col: 'fauna', spr: 'xe_dfly', name: 'Zumbóptero', sci: 'Tetrapterus monoculus', rarity: 'común', habitat: 'Cielos y túneles.', behavior: 'Organismo de cuatro alas en cruz y un solo ojo. Patrulla y se lanza contra los intrusos.', diet: 'Polen.', abilities: 'Vuelo estacionario perfecto.', danger: 1, eco: 'Transporta polen entre colmenas.', lore: 'Su zumbido grave hace vibrar las paredes de cera.', tasks: ['seen', { k: 'observe', n: 3 }] }),
    sp({ id: 'zumboptero_dron', col: 'fauna', spr: 'xe_dfly_cy', name: 'Zumbóptero Dron', sci: 'Tetrapterus monoculus (mod. Thersek)', rarity: 'poco común', variant: 'cibernética', base: 'zumboptero', habitat: 'Fábrica melífera.', behavior: 'Patrulla y dispara láseres.', diet: 'Batería de miel.', abilities: 'Ojo convertido en lente.', danger: 2, eco: 'Ninguno.', lore: 'Thersek los llama «obreras».', tasks: ['seen', { k: 'defeat', n: 5 }] }),
    sp({ id: 'portamiel', col: 'fauna', spr: 'xe_slug', name: 'Portamiel', sci: 'Mellifer gerulus', rarity: 'común', habitat: 'Caminos de la colmena.', behavior: 'Transporta un globo de miel a la espalda de una colmena a otra.', diet: 'La miel que no entrega.', abilities: 'Su globo resiste golpes.', danger: 1, eco: 'Reparte la miel por todo el planeta.', lore: 'Un portamiel nunca se pierde: sigue el olor de su colmena.', tasks: ['seen', { k: 'defeat', n: 2 }, { k: 'restored' }] }),
    sp({ id: 'colgapanal', col: 'fauna', spr: 'xe_vsnake', name: 'Colgapanal', sci: 'Pendulofavus insidiator', rarity: 'poco común', habitat: 'Techos de los túneles.', behavior: 'Cuelga de un hilo de cera dentro de un panalito y cae sobre su presa.', diet: 'Zumbópteros jóvenes.', abilities: 'Panal dorsal que parece una celda más.', danger: 2, eco: 'Controla las poblaciones de los túneles.', lore: 'Las celdas del techo que tiemblan no son celdas.', tasks: ['seen', { k: 'defeat', n: 2 }] }),
    sp({ id: 'guardian_colmena', col: 'fauna', spr: 'xe_wraith', name: 'Guardián de Colmena', sci: 'Custos favi', rarity: 'poco común', habitat: 'Ciudades y profundidades.', behavior: 'Centinela acorazado con un escudo frontal. Bloquea todo lo que llega de frente y embiste.', diet: 'Jalea real.', abilities: 'Escudo de quitina hexagonal.', danger: 3, eco: 'Protege las cámaras de la colmena.', lore: 'Nunca da la espalda a un intruso. Casi nunca.', tasks: ['seen', { k: 'defeat', n: 3 }] }),
    sp({ id: 'pacipodo', col: 'fauna', spr: 'xe_grazer', name: 'Pacípodo', sci: 'Hexapodus mansuetus', rarity: 'rara', restoredOnly: true, habitat: 'Valles restaurados.', behavior: 'Caminante de seis patas que lleva una colmena diminuta en el lomo.', diet: 'Flores hexagonales.', abilities: 'Su colmena dorsal produce miel para otras especies.', danger: 0, eco: 'Convive con todas las especies.', lore: 'Los zumbópteros jóvenes se crían en el lomo de los pacípodos.', tasks: ['seen', { k: 'observe', n: 5 }] }),
    sp({ id: 'leviatan_cera', col: 'fauna', spr: 'xe_vellorn', name: 'Leviatán de Cera', sci: 'Leviathan cerifer', rarity: 'legendaria', restoredOnly: true, habitat: 'Solo aparece en una XÉRTHA completamente restaurada.', behavior: 'Coloso de las profundidades con un panal luminoso por espalda.', diet: 'Miel de las colmenas ancestrales.', abilities: 'Construye colmenas enteras sobre sí.', danger: 0, eco: 'Dicen que las colmenas-montaña son leviatanes dormidos.', lore: 'Los arturianos creían que el planeta entero descansa sobre uno.', tasks: ['seen', { k: 'observe', n: 6 }] }),
    sp({ id: 'zyrkalia', col: 'fauna', spr: 'zyrkalia', boss: true, name: 'ZYRKALIA', title: 'Reina Esférica Colménica', sci: 'Regina sphaerofava (mod. Thersek)', rarity: 'única', variant: 'cibernética', habitat: 'Trono de ZYRKALIA.', behavior: 'La mente de toda la colmena: mil ojos y una sola voluntad. Thersek le dio patas de acero y un taladro.', diet: 'Jalea real de todo el planeta.', abilities: 'Ojos que disparan miel, taladro sísmico, patas que golpean y enjambres.', danger: 5, eco: 'Coordinaba a todas las especies de la colmena.', lore: 'Los arturianos la consultaban antes de cada construcción.', tasks: ['seen', { k: 'defeat', n: 1 }] }),
    sp({ id: 'farol_nectar', col: 'flora', spr: 'xe_lamp', name: 'Farol de Néctar', sci: 'Nectarolampas', rarity: 'común', habitat: 'Toda la colmena.', behavior: 'Bulbo de néctar que brilla con luz propia.', diet: 'Azúcares.', abilities: 'Ilumina su entorno.', danger: 0, eco: 'Guía a los zumbópteros de noche.', lore: 'Las casas arturianas se iluminan con faroles de néctar.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'antenaria', col: 'flora', spr: 'xe_fern_r', name: 'Antenaria', sci: 'Antennaria vibrans', rarity: 'común', habitat: 'Bosques y llanuras.', behavior: 'Ramas articuladas que se agitan al notar movimiento.', diet: 'Vibraciones y luz.', abilities: 'Avisa a la colmena de los intrusos.', danger: 0, eco: 'Es el sistema de alarma del bosque.', lore: 'Un bosque de antenarias quieto es un bosque que te está escuchando.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'capsula_polen', col: 'flora', spr: 'xe_mush', name: 'Cápsula de Polen', sci: 'Pollinocapsa', rarity: 'poco común', habitat: 'Zonas contaminadas.', behavior: 'Revienta en nubes de polen ácido al notar vibraciones.', diet: 'Toxinas.', abilities: 'Polen irritante.', danger: 3, eco: 'Absorbe la podredumbre de la cera.', lore: 'Los arturianos la cultivaban como repelente.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'arbol_panal', col: 'flora', spr: 'xe_bigmush', name: 'Árbol Panal', sci: 'Arbor favosa', rarity: 'poco común', habitat: 'Bosques de la colmena.', behavior: 'Su copa es un panal que gotea miel.', diet: 'Savia dulce.', abilities: 'Produce miel sin abejas.', danger: 0, eco: 'Alimenta a medio bosque.', lore: 'Nadie sabe si es un árbol que aprendió a hacer miel o una colmena que echó raíces.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'camara_lumen', col: 'flora', spr: 'xe_column', name: 'Cámara de Incubación', sci: 'Incubaculum lucens', rarity: 'común', habitat: 'Interiores de la colmena.', behavior: 'Racimo de celdas que se encienden cuando alguien se acerca.', diet: 'Calor.', abilities: 'Mantiene templadas las crías.', danger: 0, eco: 'Sin ellas no nacería nada en XÉRTHA.', lore: 'Dentro de cada celda late algo.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'vejiga_nectar', col: 'flora', spr: 'xe_t_bulb_r', name: 'Vejiga de Néctar', sci: 'Vesica nectaris', rarity: 'común', habitat: 'Suelos de la colmena.', behavior: 'Saco elástico lleno de néctar.', diet: 'Néctar.', abilities: 'Impulsa a quien la pisa.', danger: 0, eco: 'Reserva de néctar de la colmena.', lore: 'Los mensajeros arturianos viajaban saltando de vejiga en vejiga.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'hilo_cera', col: 'flora', spr: 'xe_t_vine_r', name: 'Hilo de Cera', sci: 'Filum cereum', rarity: 'común', habitat: 'Muros de la colmena.', behavior: 'Cuerda de cera viva.', diet: 'Cera.', abilities: 'Resiste el peso de un cyborg.', danger: 0, eco: 'Une las celdas altas y bajas.', lore: 'Los puentes de la ciudad se tejen con hilo de cera.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'espina_quitina', col: 'flora', spr: 'xe_t_thorn_r', name: 'Espina de Quitina', sci: 'Spina chitinea', rarity: 'común', habitat: 'Fosos de la colmena.', behavior: 'Crece en púas donde la colmena quiere cerrar el paso.', diet: 'Minerales.', abilities: 'Púas afiladas.', danger: 2, eco: 'Defensa natural de la colmena.', lore: 'Cuando la colmena sana, sus puntas se vuelven doradas.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'caliz_ambar', col: 'flora', spr: 'xe_maw', name: 'Cáliz Ámbar', sci: 'Calyx ambrae vorax', rarity: 'poco común', variant: 'mutada', habitat: 'Zonas contaminadas.', behavior: 'Flor-trampa de pétalos de quitina.', diet: 'Carnívora.', abilities: 'Escupe semillas duras.', danger: 3, eco: 'En su forma natural, guardaba néctar.', lore: 'Su forma natural se llamaba «Copa del Rocío Dulce».', tasks: ['seen', { k: 'defeat', n: 2 }] }),
    sp({ id: 'jalea_real', col: 'flora', spr: 'xe_heal', name: 'Jalea Real', sci: 'Gelata regalis', rarity: 'poco común', habitat: 'Junto a las cámaras.', behavior: 'Gotas rosadas de jalea curativa.', diet: 'Néctar.', abilities: 'Repara tejidos y circuitos.', danger: 0, eco: 'Alimento de las crías.', lore: 'Solo la Reina podía decidir quién la probaba.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'flor_hexagonal', col: 'flora', spr: 'xe_orchid', name: 'Flor Hexagonal', sci: 'Flos hexagonus', rarity: 'rara', restoredOnly: true, habitat: 'Territorios liberados.', behavior: 'Sus pétalos crecen como celdas de panal.', diet: 'Luz.', abilities: 'Semillas hexagonales.', danger: 0, eco: 'Alimenta a los pacípodos.', lore: 'Zelvan quiere plantarlas en los Jardines de la nave.', tasks: ['seen', { k: 'scan' }] })
  );
  D.CODEX_REWARDS.xertha = {
    fauna: { name: 'Quitina Viva', desc: 'Mod cyborg: recibes un 5 % menos de daño.', mod: 'quitinaviva' },
    flora: { name: 'Néctar Real', desc: 'Mod cyborg: el superataque se carga un 10 % más rápido.', mod: 'nectar' },
    all: { name: 'Colmena de la nave + Leviatán de Cera', desc: 'Un panal vivo para los Jardines y el legendario Leviatán de Cera se traslada a la nave.', creature: 'leviatan_cera' }
  };
  Object.assign(D.MISSIONS, {
    s_ecos_x: { count: d => ['h49', 'h50', 'h51', 'h52', 'h53', 'h54', 'h55', 'h56'].filter(h => d.holos[h]).length, name: 'Ecos de la colmena', giver: 'ELARA', desc: 'Recupera los 8 registros holográficos ocultos en XÉRTHA.', goal: 8, reward: { xp: 320, crys: 3 } },
    s_zelvan: { name: 'El arquitecto de la colmena', giver: 'ELARA', desc: 'Un arturiano está prisionero en el Bosque de Antenarias.', goal: 1, reward: { xp: 170 } },
    s_flores_x: { count: d => d.seeds_s_flores_x || 0, name: 'Flores hexagonales', giver: 'Zelvan', desc: 'Zelvan necesita 5 semillas de Flor Hexagonal. Solo brotan en territorios liberados de XÉRTHA.', goal: 5, reward: { xp: 220, crys: 4 } }
  });
  D.ACHIEVEMENTS.push({ id: 'zyrkalia', name: 'Destronada', desc: 'Derrota a ZYRKALIA.' }, { id: 'lib_xertha', name: 'La colmena canta', desc: 'Libera los 10 territorios de XÉRTHA.' });
  Object.assign(D.HOLOS, {
    h49: { title: 'Bitácora de Zelvan · La colmena', text: 'La colmena ya no nos escucha. La Reina solo transmite una orden: producir. Las colmenas-montaña se secan una a una.' },
    h50: { title: 'Orden Esquelética 814 · Gerselle', text: 'La miel de XÉRTHA es el mejor combustible biológico del sistema. Producción máxima. Las larvas son prescindibles.' },
    h51: { title: 'Plano de los conductos', text: 'Los conductos orgánicos unen cámaras a cualquier altura. La colmena los abrió para que sus obreras viajaran sin cansarse.' },
    h52: { title: 'Registro de incubación', text: 'Celdas activas: 12 483. Celdas apagadas por el régimen: 9 102. Las cámaras siguen calentando huevos que nunca nacerán.' },
    h53: { title: 'Crónica de la ciudad', text: 'Arturianos y colmena construimos juntos. Nosotros dibujábamos los planos; la colmena los hacía crecer.' },
    h54: { title: 'Informe de producción', text: 'Rendimiento de la fábrica: 340 %. Pérdida de obreras: aceptable. Firmado: Thersek.' },
    h55: { title: 'Inscripción ancestral', text: '«La Reina no manda: escucha a todas a la vez y responde por todas. Cuando calle, la colmena dormirá.»' },
    h56: { title: 'Mensaje de N-0', text: '«Siete, en XÉRTHA guardaban los planos originales de la Esfera. Los arturianos la diseñaron… antes de que Merek la robara.»' }
  });
  Object.assign(D.MEMORIES, {
    m14: { title: 'Fragmento de memoria · Los planos', text: 'Ves a un ingeniero arturiano entregar unos planos hexagonales a un hombre de capa negra. «Es para proteger el sol», le dicen. Mienten.' },
    m15: { title: 'Fragmento de memoria · La colmena', text: 'Mil ojos te miran desde las celdas. Una voz que es muchas voces dice: «Gracias, unidad K. Volvemos a ser muchas».' }
  });
  D.BOSS_OUTRO.zyrkalia = { up: 'enjambre', skin: 'colmena', mem: 'm15', lines: [['elara', 'ZYRKALIA se detiene. Sus patas de acero ya no responden.'], ['zelvan', 'Escucha, {N}… la colmena vuelve a hablar con mil voces.'], ['elara', 'He extraído un núcleo del implante. Tu Pulso Solar soltará un enjambre que pica a todos los enemigos.'], ['hero', 'Siete piezas de ALBA. Y los planos de la Esfera eran arturianos.'], ['elara', 'Siete de nueve. Integrando… ahora.']] };
  D.POST_BOSS.zyrkalia = [['thersek', '¡Mi reina! ¿Sabes cuánta miel producía, K-7?'], ['gerselle', 'Thersek, ya basta de llorar. IGNÁRIA está lista.'], ['merek', 'Siete mundos. Ahora ya sabes de dónde salieron los planos de la Esfera, {N}. No cambia nada.'], ['elara', 'Transmisión cortada. La siguiente ruta aún no está abierta. Descansa, {N}.']];
  D.FIRST_CLEAR = D.FIRST_CLEAR || {};
  D.FIRST_CLEAR.xertha = (S, id) => { if (id === 1) { S.startMission('s_ecos_x'); S.startMission('s_zelvan'); } if (S.liberated(T) >= 10) S.ach('lib_xertha'); if (id === 11) S.ach('zyrkalia'); };
  D.RESCUE = D.RESCUE || {};
  D.RESCUE.zelvan = { name: 'Zelvan', mission: 's_zelvan', lines: [['zelvan', '¿Un cyborg de la República? Pensé que los habían desmontado a todos.'], ['zelvan', 'Soy Zelvan, arquitecto de la colmena. Me encerraron por esconder los planos antiguos.'], ['hero', 'Soy {N}. Vengo a liberar XÉRTHA.'], ['zelvan', 'Entonces tendrás que llegar hasta la Reina. Y la Reina ya no es ella misma.'], ['elara', 'Teletransporte preparado. Bienvenido a bordo, Zelvan.']],
    onRescue: S => { S.startMission('s_flores_x'); },
    ship: { room: 'laboratorio', off: 70, talk: S => [['zelvan', 'Estoy dibujando panales para la nave. ELARA dice que no caben. ELARA no entiende de panales.'], ['zelvan', 'Semillas de Flor Hexagonal: ' + (S.data.seeds_s_flores_x || 0) + '/5.']] } };
  P.SPEAKERS.zelvan = { name: 'Zelvan', por: 'por_zelvan', col: '#ffd060' };
  P.D.VILLAGER_LINES.arturiano.push('La colmena vuelve a cantar. Esta noche se oye por todo el valle.', 'Mi casa ha crecido una celda nueva. Gracias, viajero.', 'Las obreras vuelven a volar entre las torres.');

  // ---------- música ----------
  Object.assign(P.Audio.TRACKS, {
    xertha: { bpm: 96, root: 52, scale: [0, 2, 3, 5, 7, 8, 11], prog: [0, 5, 3, 4], lead: 'square', bass: 'triangle', arp: 'triangle', drums: 1, pad: true, seed: 711, marimba: true },
    xertha_r: { bpm: 100, root: 52, scale: [0, 2, 4, 5, 7, 9, 11], prog: [0, 4, 5, 3], lead: 'triangle', bass: 'sine', arp: 'sine', drums: 1, pad: true, seed: 711, marimba: true },
    xertha_ow: { bpm: 104, root: 55, scale: [0, 2, 4, 5, 7, 9, 11], prog: [0, 5, 3, 4], lead: 'triangle', bass: 'sine', arp: 'triangle', drums: 0, pad: true, seed: 717 }
  });

  // ---------- luz y ambiente ----------
  P.FX.GR.xertha = { bloomMul: 0.85, day: ['#ffe8a0', '#5a3a10', 0.26], golden: ['#ffb060', '#4a1a0a', 0.3], dusk: ['#ffb040', '#140a04', 0.32], cave: ['#ffb040', '#0e0602', 0.34], deep: ['#ffb040', '#0e0602', 0.34], sun: [360, 40], fog: '#ffe0a0', rays: '255,220,140' };
  const UA = P.ART.umbrelia;
  const darkAt = (L, px) => { for (const [a, b] of L.umDark || []) if (px >= a && px < b) return true; return false; };
  Object.assign(P.ART.xertha, {
    seedMission: 's_flores_x', seedName: 'Semilla de Flor Hexagonal', holoMission: 's_ecos_x',
    civs: ['arturiano', 'arturiano', 'reptiliano', 'arturiano', 'pleyadiano'], rigidTrees: [1], treeVariants: [0, 1],
    stone: ['#a06010', '#ffd050', '#5a2e0a', '#3ae0d0', '#a8ff3a'],
    strata: ['rgba(255,208,80,0.06)', 'rgba(0,0,0,0)', 'rgba(40,10,0,0.14)', 'rgba(0,0,0,0)', 'rgba(255,140,40,0.05)', 'rgba(20,6,0,0.1)'],
    postMap(L) { L.umDark = []; L.umCr = {}; L.umBroken = []; L.xeConduits = []; (L.def.rows || []).forEach(row => row.forEach((ch, i) => { if (P.XE_DARK.includes(ch)) L.umDark.push([i * 24 * TSZ, (i + 1) * 24 * TSZ]); })); },
    ambient(L, cx, cy, rf) {
      if (L.theme === 'facility' || L.theme === 'lab') return false;
      // motas de polen y resina que flotan y obreras diminutas que cruzan
      if (L.t % 4 === 0) L.parts.add({ x: cx + P.rand(0, P.W), y: cy + P.rand(0, P.H), vx: P.rand(-0.25, 0.25), vy: P.rand(-0.2, 0.15), life: P.ri(100, 180), col: Math.random() < 0.3 + rf * 0.6 ? P.pick(['#ffe080', '#ffb020', '#fff8d0', '#a8ff3a']) : P.pick(['#8a7a5a', '#6a5a3a']), size: 1, glow: Math.random() < 0.4 ? 3 : 0 });
      if (L.t % 70 === 0 && L.theme !== 'cave') { const y = cy + P.rand(20, P.H * 0.6), dir = Math.random() < 0.5 ? 1 : -1; for (let k = 0; k < 4; k++) L.parts.add({ x: dir > 0 ? cx - 10 - k * 8 : cx + P.W + 10 + k * 8, y: y + P.rand(-6, 6), vx: dir * P.rand(1.4, 2), vy: 0, life: 360, col: '#3a2410', size: 1, fn: q => { q.vy = Math.sin(q.life * 0.3) * 0.4; } }); }
      return true;
    },
    lightAmb(L, amb, rf) { if ((L.darkK || 0) < 0.02) return amb; const base = amb ? parseFloat(amb.split(',')[3]) : 0, a = base + (0.85 - base) * L.darkK; return 'rgba(10,4,0,' + a.toFixed(3) + ')'; },
    lights: UA.lights,
    drawTile(L, c, ch, X0, Y0, tx, ty, st) {
      if (ch === 'T') { P.spr(c, 't_unstable', (tx * 3 + ty) % 3, X0, Y0); if ((tx * 7 + (L.t >> 3)) % 11 === 0) { c.fillStyle = 'rgba(255,248,208,0.8)'; c.fillRect(X0 + (tx * 5) % 14, Y0 + 1, 2, 1); } }
      else if (ch === 'G') { P.spr(c, 't_gate', (L.t >> 5) % 2, X0, Y0); }
    },
    levelUpdate(L) {
      const p = L.player, st = p.st || {};
      const fog = (L.myFogT > 0 && !st.cera) || darkAt(L, p.cx); if (L.myFogT > 0) L.myFogT--;
      L.darkK = (L.darkK || 0) + ((fog ? 1 : 0) - (L.darkK || 0)) * 0.06;
      // resina pegajosa: frena mientras la pisas y un instante después (salvo con Patas Adherentes)
      if (!st.adherencia) { if (p.onGround && p.groundTile === 'T') L.xeSticky = 24; if (L.xeSticky > 0) { L.xeSticky--; const m = p.onGround && p.groundTile === 'T' ? 0.85 : 1.25; p.vx = P.clamp(p.vx, -m, m); if (L.t % 8 === 0 && Math.abs(p.vx) > 0.2) L.parts.add({ x: p.cx + P.rand(-3, 3), y: p.y + p.h, vy: P.rand(0.1, 0.4), g: 0.1, life: 30, col: '#ffb020', size: 1 }); if (!L.xeResinTip) { L.xeResinTip = true; P.toast('Resina pegajosa: te frena mientras la pisas', { col: '#ffd060', life: 140 }); } } }
      else if (p.onGround && (p.groundTile === '#' || p.groundTile === 'T') && Math.abs(p.vx) > 0.5) p.x += Math.sign(p.vx) * 0.25;
    },
    levelDraw(L, c) { UA.levelDraw(L, c); },
    owDraw(sc, c) { for (let i = 0; i < 12; i++) { const x = (i * 157 + sc.t * 0.6) % (P.W + 20) - 10, y = (i * 61) % (P.H - 20) + 10 + Math.sin(sc.t * 0.2 + i) * 2; c.fillStyle = '#3a2410'; c.fillRect(Math.round(x), Math.round(y), 2, 1); c.fillStyle = 'rgba(255,248,208,0.7)'; c.fillRect(Math.round(x), Math.round(y) - 1, 1, 1); } }
  });

  // ---------- hitos, atrezo y arquitectura colménica ----------
  (function () {
    const cache = {}, HZ = 'rgba(255,220,160,0.28)', mk = (key, w, h, fn) => () => { if (cache[key]) return cache[key]; const p = new P.Painter(w, h); fn(p, P.RNG(P.hash(key))); const cv = p.canvas(), x = cv.getContext('2d'); x.globalCompositeOperation = 'source-atop'; x.fillStyle = HZ; x.fillRect(0, 0, w, h); return (cache[key] = cv); };
    P.LANDMARKS.xertha = [
      // colmena-montaña con un pico afilado (como en la referencia)
      mk('lx0', 170, 170, p => { for (let y = 0; y < 160; y++) { const w = 80 * (1 - y / 160) ** 0.7; p.rect(Math.round(85 - w), 168 - y, Math.round(w * 2), 1, ['#c89860', '#b88450', '#d8a870'][(y >> 4) % 3]); } for (let k = 0; k < 14; k++) P.Sprites.xeHex(p, 40 + (k * 37) % 90, 150 - (k * 23) % 110, 3, k % 3 ? '#a07040' : '#ffe080', '#8a5a20', null); }),
      // torre orgánica con anillos de celdas encendidas
      mk('lx1', 90, 170, p => { for (let y = 0; y < 165; y++) { const w = 12 + Math.sin(y * 0.08) * 4 - y / 30; p.rect(Math.round(45 - w), 168 - y, Math.round(w * 2), 1, ['#a06010', '#c07a1a'][(y >> 3) % 2]); } for (let k = 0; k < 7; k++) P.Sprites.xeHex(p, 45 + (k % 2 ? 6 : -6), 150 - k * 20, 3, '#3ae0d0', '#0a4a4a', null); }),
      // colmena suspendida de un puente de cera
      mk('lx2', 180, 120, p => { p.thick(0, 20, 180, 30, 4, '#a06010'); for (let k = 0; k < 3; k++) { const x = 40 + k * 55; p.line(x, 24, x, 40, '#8a4a10'); P.Sprites.xeComb(p, x, 62, 18 - k * 3, 22 - k * 3, P.XEC.amb, { drips: 4, cell: 3 }); } }),
      // nido gigante con conductos
      mk('lx3', 170, 110, p => { P.Sprites.xeComb(p, 85, 70, 70, 38, ['#7a3a04', '#a06010', '#d89040', '#ffd080'], { cell: 4 }); for (let k = 0; k < 4; k++) p.thick(20 + k * 40, 108, 30 + k * 40, 70, 5, '#8a4a10'); })
    ];
    P.PROPS.xertha = ['px_comb', 'px_amber', 'px_eggs', 'px_drip'];
    Object.assign(P.PROP_LIGHT, { px_amber: '#ffd060', px_drip: '#ffb020' });
  })();
  P.ARCH.xertha = { civ: 'arturiano', types: ['house', 'special', 'hut', 'shop', 'tower'], extra: [[-10, -1, 'lab'], [9, -1, 'hut'], [-4, 4, 'hut']] };
  P.Sprites.buildXerthaExtra = function () {
    const O = { up: 0.1, down: 0.15 }, dim = (c2, f) => f ? c2 : P.Col.mix(c2, '#4a4438', 0.7), Dm = (A, f) => A.map(c2 => dim(c2, f));
    P.mk('px_comb', 18, 14, 2, (p, f) => P.Sprites.xeComb(p, 9, 8, 8, 5, Dm(X.amb, f), { cell: 2 }), O);
    P.mk('px_amber', 14, 18, 2, (p, f) => { P.Sprites.xeAmber(p, 7, 18, 7, 16, Dm(['#a06010', '#e0a020', '#ffe080', '#ffffff'], f), 0.08); P.Sprites.xeAmber(p, 3, 18, 3, 7, Dm(['#a06010', '#e0a020', '#ffe080', '#ffffff'], f), -0.2); }, O);
    P.mk('px_eggs', 16, 10, 2, (p, f) => { for (let k = 0; k < 4; k++) p.ell(3 + k * 3.4, 6 - (k % 2), 1.6, 2.2, dim('#f8f0e0', f)); }, O);
    P.mk('px_drip', 12, 16, 2, (p, f) => { p.rect(2, 0, 8, 3, dim('#a06010', f)); for (let k = 0; k < 3; k++) for (let j = 0; j < 5 + k * 4; j++) p.px(3 + k * 3, 3 + j, dim(j > 3 + k * 4 ? '#fff0a0' : '#ffb020', f)); }, O);
    // arquitectura colménica: vivienda de celdas apiladas, sala de la Reina, celda de cría, mercado de néctar,
    // torre de vigilancia con ventanas hexagonales y centro de investigación biológica con tanques
    const TT = (type, f) => p => {
      const lit = f === 1, Wl = (x, y) => P.Sprites.xeHex(p, x, y, 2.4, lit ? '#3ae0d0' : '#2a2016', dim('#5a2e0a', f), lit ? '#c8fff8' : null);
      if (type === 'hut') { P.Sprites.xeComb(p, 15, 18, 13, 11, Dm(X.amb, f), { cell: 3 }); p.rect(12, 20, 6, 10, '#2a1606'); P.Sprites.xeHex(p, 15, 8, 3, dim('#ffd050', f), dim('#7a3a04', f), null); }
      if (type === 'house') { for (const [x, y] of [[12, 36], [22, 36], [32, 36], [17, 27], [27, 27], [22, 18]]) P.Sprites.xeHex(p, x, y, 6, dim('#c07a1a', f), dim('#5a2e0a', f), dim('#ffd050', f)); p.rect(19, 38, 6, 8, '#2a1606'); Wl(12, 36); Wl(32, 36); Wl(22, 18); }
      if (type === 'tower') { for (let y = 0; y < 52; y++) { const w = 8 - y / 14; p.rect(Math.round(14 - w), 61 - y, Math.round(w * 2), 1, dim(['#a06010', '#c07a1a'][(y >> 3) % 2], f)); } P.Sprites.xeComb(p, 14, 9, 9, 7, Dm(X.amb, f), { cell: 2 }); for (let k = 0; k < 4; k++) Wl(14, 52 - k * 11); }
      if (type === 'shop') { P.Sprites.xeComb(p, 23, 12, 21, 9, Dm(X.amb, f), { drips: f ? 6 : 0, cell: 3 }); for (const x of [6, 40]) p.rect(x, 18, 2, 18, dim('#6a3a10', f)); p.rect(4, 28, 38, 8, dim('#8a4a10', f)); for (const x of [10, 22, 34]) p.sell(x, 26, 3.4, 3, Dm(['#7a3a04', '#ffb020', '#ffe080'], f)); }
      if (type === 'lab') { p.rect(2, 34, 44, 10, dim('#5a2e0a', f)); for (const x of [10, 24, 38]) { p.rect(x - 5, 12, 10, 24, dim('#3a4258', f)); p.rect(x - 4, 14, 8, 20, lit ? '#ffb020' : '#2a2016'); if (lit) for (let k = 0; k < 3; k++) p.ell(x, 18 + k * 6, 1.6, 1.4, '#fff8d0'); p.rect(x - 5, 12, 10, 1, '#7a86a4'); } P.Sprites.xeHex(p, 24, 6, 4, lit ? '#a8ff3a' : '#2a2016', dim('#5a2e0a', f), null); }
      if (type === 'special') { P.Sprites.xeComb(p, 22, 28, 20, 20, Dm(X.amb, f), { cell: 3, drips: f ? 6 : 0 }); for (let k = 0; k < 5; k++) Wl(10 + k * 6, 24 + (k % 2) * 6); p.rect(18, 40, 8, 10, '#2a1606'); P.Sprites.xeHex(p, 22, 6, 4, dim('#ffd050', f), dim('#7a3a04', f), dim('#ffffff', f)); }
    };
    for (const t in P.ARCH_SIZE) P.mk('xe_b_' + t, P.ARCH_SIZE[t][0], P.ARCH_SIZE[t][1], 2, (p, f) => TT(t, f)(p), { up: 0.1, down: 0.16, dark: 0.5 });
    // entidades del planeta
    P.mk('xe_column', 40, 56, 2, (p, f) => { for (const [x, y] of [[20, 50], [12, 44], [28, 44], [20, 38], [12, 32], [28, 32], [20, 26], [20, 14]]) P.Sprites.xeHex(p, x, y, 6, f ? '#ffb020' : '#6a5a3a', '#5a2e0a', f ? '#fff0a0' : '#8a7a5a'); for (const [x, y] of [[12, 44], [28, 32], [20, 26]]) p.ell(x, y, 1.6, 2, f ? '#f8f0e0' : '#9a8a70'); });
    P.mk('xe_rescrys', 20, 34, 3, (p, f) => { p.rect(4, 26, 12, 8, '#5a2e0a'); p.rect(4, 26, 12, 1, '#c07a1a'); P.Sprites.xeHex(p, 10, 16, 8, f === 0 ? '#5a4a30' : f === 1 ? '#c07010' : '#ffd050', '#3a1e06', f === 2 ? '#ffffff' : null); p.ell(10, 16, 3, 3, f === 0 ? '#2a2016' : f === 1 ? '#3ae0d0' : '#c8fff8'); for (let k = 0; k < 3; k++) p.line(4 + k * 6, 26, 6 + k * 4, 22, '#8a4a10'); });
    P.mk('xe_nest', 22, 24, 2, (p, f) => { p.line(11, 0, 11, 4, '#6a3a10'); P.Sprites.xeComb(p, 11, 14, 10, 10, f ? ['#7a3a04', '#c07010', '#ffb020', '#ffe080'] : ['#5a2e0a', '#8a4a10', '#c07a1a', '#f0b040'], { cell: 2 }); p.ell(11, 18, 3, 2.4, '#1a0e04'); p.px(11, 18, f ? '#ff3050' : '#3a1a08'); });
    P.mk('xe_conduit', 24, 28, 2, (p, f) => { p.sell(12, 18, 11, 10, ['#5a2e0a', '#8a4a10', '#c07a1a', '#f0b040']); for (let k = 0; k < 4; k++) p.line(2 + k * 6, 10 + (k % 2), 4 + k * 6, 27, '#5a2e0a'); p.ell(12, 16, 6, 7, '#1a0e04'); p.ell(12, 16, 4, 5, f ? '#ffb020' : '#7a3a04'); p.ell(12, 16, 2, 2.5, f ? '#fff0a0' : '#c07010'); });
    P.Sprites.registerLook('zelvan', Object.assign({}, P.CIV.arturiano, { skin: '#5aa4ff', skinD: '#2a64c8', cloth: '#c07a1a', clothD: '#7a3a04', acc: '#3ae0d0', h: 22 }));
  };
  (function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildXerthaExtra(); }; })();

  // ---------- entidades y mecánicas ----------
  // Cámara de energía biológica (Z): se recarga sola; al dispararle abre tapones de cera y extiende puentes de panal
  P.BioChamber = class extends P.ResonanceCrystal {
    hit() { if (this.charge < 0.3) { P.Audio.sfx('block'); return; } P.umPulse(this.L, this.cx, this.cy, 150 + 140 * this.charge, this, '#ffd060'); this.charge = 0; this.flash = 8; }
    draw(c, cx, cy) { const x = Math.round(this.x - cx), y = Math.round(this.y - cy), full = this.charge >= 1; P.drawGlow(c, x + 8, y + 14, 18 + this.charge * 24, '#ffd060', 0.2 + this.charge * 0.35); P.spr(c, 'rescrys', full ? 2 : this.charge > 0.3 ? 1 : 0, x - 2, y - 2, { flash: this.flash > 0 }); c.fillStyle = '#2a1606'; c.fillRect(x, y + 34, 16, 2); c.fillStyle = full ? '#fff0a0' : '#c07010'; c.fillRect(x, y + 34, Math.round(16 * this.charge), 2); }
  };
  // Panal flotante (J): se contrae y se expande a su ritmo, o se extiende con energía / polen dorado
  P.CombPlatform = class extends P.PetalPlatform {
    draw(c, cx, cy) {
      const x = Math.round(this.x - cx), y = Math.round(this.y - cy);
      if (!this.on) { c.globalAlpha = 0.5; for (let k = 0; k < 3; k++) P.spr(c, 't_phase', 1, x + k * TSZ, y); c.globalAlpha = 1; return; }
      if (this.warn() && (this.t >> 2) % 2) c.globalAlpha = 0.5;
      P.drawGlow(c, x + 24, y + 4, 24, '#ffd060', 0.3); for (let k = 0; k < 3; k++) P.spr(c, 't_phase', 0, x + k * TSZ, y); c.globalAlpha = 1;
    }
  };
  // Cámara de incubación (Q): racimo de celdas que se enciende cuando te acercas
  P.LumenChamber = class extends P.CrystalColumn {
    constructor(L, x, y) { super(L, x, y); this.species = 'camara_lumen'; }
    update() { P.Decor.prototype.update.call(this); const p = this.L.player; this.near += ((Math.abs(p.cx - this.cx) < 60 ? 1 : 0) - this.near) * 0.06; if (this.near > 0.5 && this.t % 12 === 0) this.L.parts.add({ x: this.cx + P.rand(-14, 14), y: this.y + P.rand(6, this.h - 6), vy: -0.3, life: 50, col: P.pick(['#fff0a0', '#ffb020']), size: 1, glow: 3 }); }
    umLight() { return [this.cx, this.cy, 40 + this.near * 50, 0.9]; }
    draw(c, cx, cy) { const on = this.L.restoredAt(this.cx), x = Math.round(this.x - cx), y = Math.round(this.y - cy); P.drawGlow(c, x + 20, y + 30, 26 + this.near * 22, '#ffb020', 0.15 + this.near * 0.35); P.spr(c, 'column', on || this.near > 0.5 ? 1 : 0, x, y); }
  };
  // Conducto orgánico (Y): entra y sales por el conducto pareja del mismo tramo
  P.Conduit = class extends P.Ent {
    constructor(L, x, y) { super(L, x - 12, y - 28, 24, 28); this.cool = 0; L.xeConduits.push(this); }
    partner() { const ch = Math.floor(this.cx / (24 * TSZ)); return this.L.xeConduits.find(o => o !== this && Math.floor(o.cx / (24 * TSZ)) === ch); }
    get interact() { return !!this.partner() && this.cool <= 0; }
    get prompt() { return 'Entrar al conducto'; }
    use() {
      const o = this.partner(), p = this.L.player; if (!o) return; P.Audio.sfx('dash');
      this.L.parts.burst(this.cx, this.cy, 12, { col: P.pick(['#ffb020', '#fff0a0']), smin: 0.5, smax: 2 });
      p.x = o.cx - p.w / 2; p.y = o.y + o.h - p.h - 1; p.vx = 0; p.vy = 0; o.cool = this.cool = 40;
      this.L.parts.burst(o.cx, o.cy, 14, { col: P.pick(['#ffb020', '#fff0a0']), smin: 0.5, smax: 2.5 }); P.shake(2, 8);
    }
    update() { this.t++; if (this.cool > 0) this.cool--; if (this.t % 10 === 0) this.L.parts.add({ x: this.cx + P.rand(-4, 4), y: this.y + 14, vy: -0.3, life: 30, col: '#ffe080', size: 1, glow: 2 }); }
    umLight() { return [this.cx, this.y + 14, 34, 0.8]; }
    draw(c, cx, cy) { const x = Math.round(this.x - cx), y = Math.round(this.y - cy); P.drawGlow(c, x + 12, y + 16, 16, '#ffb020', 0.3 + Math.sin(this.t * 0.08) * 0.1); P.spr(c, 'conduit', (this.t >> 4) % 2, x, y); }
  };
  // Nido (V): suelta zumbópteros mientras sigue en pie; se destruye a disparos
  P.HiveNest = class extends P.Ent {
    constructor(L, x, y) { super(L, x - 11, y - 24, 22, 24); this.isEnemy = true; this.hp = this.maxhp = 36; this.heavy = true; this.kids = []; this.nestT = 60; }
    hit(d) { if (this.dead) return; this.hp -= d; this.flash = 5; P.Audio.sfx('ehit'); if (this.hp <= 0) this.die(); }
    die() { if (this.dead) return; this.dead = true; P.Audio.sfx('break'); this.L.parts.burst(this.cx, this.cy, 18, { col: P.pick(['#ffb020', '#c07010', '#fff0a0']), smin: 1, smax: 3, g: 0.15, size: 2 }); P.drop(this.L, this.cx, this.cy, { xp: 12, bio: 3 }); }
    update() {
      this.t++; if (this.flash > 0) this.flash--; const L = this.L, p = L.player; this.kids = this.kids.filter(k => !k.dead);
      if (P.dist(p.cx, p.cy, this.cx, this.cy) < 230 && this.kids.length < 3 && --this.nestT <= 0) { this.nestT = 160; const e = L.add(new P.Fly(L, this.cx - 8, this.cy - 4, false)); e.kind = 'zumboptero'; this.kids.push(e); L.parts.burst(this.cx, this.cy + 4, 6, { col: '#ffe080', smin: 0.5, smax: 1.5 }); P.Audio.sfx('spine'); }
    }
    draw(c, cx, cy) { const x = Math.round(this.x - cx), y = Math.round(this.y - cy); P.drawGlow(c, x + 11, y + 16, 14, '#ffb020', 0.25); P.spr(c, 'nest', this.nestT < 30 ? 1 : 0, x, y, { flash: this.flash > 0 }); }
  };
  // Guardián de colmena (W): bloquea lo que llega de frente; al embestir baja el escudo
  P.HiveGuardian = class extends P.Enemy {
    constructor(L, x, y) { super(L, x - 8, y - 22, 16, 22, { kind: 'guardian_colmena', hp: 40, dmg: 14, xp: 14, drops: { bio: 3 }, natural: true, spr: 'wraith' }); this.mode = 'guard'; this.cd = 60; }
    hit(d, o = {}) {
      const front = o.x != null && Math.sign(o.x - this.cx) === this.face;
      if (front && this.mode !== 'lunge' && !o.super) { this.L.parts.burst(this.cx + this.face * 9, this.cy, 4, { col: '#ffe080', smin: 0.5, smax: 1.5 }); P.Audio.sfx('block'); if (this.t - (this.blkT || -99) > 60) { this.blkT = this.t; this.L.popups.push({ x: this.cx, y: this.y - 8, text: '¡BLOQUEO!', col: '#ffd060', t: 0 }); } return; }
      super.hit(d, o);
    }
    update() {
      if (this.commonUpdate()) { this.gravityMove(); return; }
      const p = this.L.player, d = p.cx - this.cx;
      if (this.mode === 'guard') { if (Math.abs(d) < 150) this.face = Math.sign(d) || 1; this.vx = Math.abs(this.cx - this.home.x) > 30 ? Math.sign(this.home.x - this.cx) * 0.4 : 0; if (--this.cd <= 0 && Math.abs(d) < 80 && Math.abs(p.cy - this.cy) < 30) { this.mode = 'wind'; this.st = 0; } }
      else if (this.mode === 'wind') { this.vx = 0; if (++this.st > 28) { this.mode = 'lunge'; this.st = 0; P.Audio.sfx('dash'); } }
      else if (this.mode === 'lunge') { this.vx = this.face * 3.2; if (++this.st > 22) { this.mode = 'rest'; this.st = 0; } }
      else if (this.mode === 'rest') { this.vx *= 0.8; if (++this.st > 50) { this.mode = 'guard'; this.cd = 70; } }
      this.gravityMove();
    }
    draw(c, cx, cy) { if (this.mode !== 'lunge') P.drawGlow(c, this.cx + this.face * 9 - cx, this.cy - cy, 10, '#ffd060', 0.25); this.drawSpr(c, cx, cy, this.mode === 'wind' ? 2 : this.mode === 'lunge' ? 1 : 0); }
  };

  // marcadores reinterpretados en XÉRTHA
  const rk = (e, kind) => { e.kind = kind; return e; }, gy = (L, m) => L.snapY(m.x, m.y);
  P.LV.xertha.spawn = {
    c: (L, x, y) => L.add(rk(new P.Crab(L, x - 9, y, false), 'quitinopodo')),
    K: (L, x, y, m, R) => L.add(R ? rk(new P.Crab(L, x - 9, y, false), 'quitinopodo') : rk(new P.Crab(L, x - 10, y, true), 'quitinopodo_cy')),
    A: (L, x, y, m, R) => { if (!R) L.add(rk(new P.Alpha(L, x - 20, y), 'acorazado')); },
    f: (L, x, y) => L.add(rk(new P.Frog(L, x - 7, y - 11), 'saltambar')),
    d: (L, x, y) => L.add(rk(new P.Fly(L, x - 8, y - 20, false), 'zumboptero')),
    D: (L, x, y, m, R) => { const fac = L.theme === 'facility' || L.theme === 'lab'; if (!R) { const e = L.add(new P.Fly(L, x - 8, y - 20, true)); if (!fac) e.kind = 'zumboptero_dron'; } else if (!fac) L.add(rk(new P.Fly(L, x - 8, y - 20, false), 'zumboptero')); },
    l: (L, x, y) => L.add(rk(new P.Slug(L, x - 10, y - 8), 'portamiel')),
    p: (L, x, y, m, R) => { if (!R) L.add(rk(new P.Maw(L, x - 6, y - 16), 'caliz_ambar')); else L.add(new P.Decor(L, x, y, 'fern_r', 'antenaria')); },
    v: (L, x, y, m) => L.add(rk(new P.VSnake(L, x, m.y * TSZ), 'colgapanal')),
    h: (L, x, y) => { const e = L.add(new P.HealPlant(L, x, y)); e.light = '#ff9ad8'; },
    Q: (L, x, y, m) => L.add(new P.LumenChamber(L, x, gy(L, m))),
    Y: (L, x, y, m) => L.add(new P.Conduit(L, x, gy(L, m))),
    Z: (L, x, y, m) => L.add(new P.BioChamber(L, x, gy(L, m))),
    V: (L, x, y, m) => L.add(new P.HiveNest(L, x, gy(L, m))),
    O: (L, x, y, m) => L.add(new P.SporeCloud(L, x, gy(L, m), m)),
    J: (L, x, y, m) => L.add(new P.CombPlatform(L, x, y, m)),
    W: (L, x, y, m) => L.add(new P.HiveGuardian(L, x, gy(L, m)))
  };
  P.LV.xertha.overworld.vip = { look: 'zelvan', civ: 'arturiano', talk: lib => [['zelvan', lib >= 10 ? 'La colmena entera vuelve a cantar, {N}. Y dicen que el Leviatán de Cera se ha despertado en las profundidades.' : 'Cada territorio liberado devuelve la voz a una parte de la colmena. Las torres vuelven a brillar.']] };
})();
