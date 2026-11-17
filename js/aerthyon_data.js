'use strict';
// AERTHYON — datos, mecánicas atmosféricas (corrientes de viento que cambian de dirección, corrientes ascendentes,
// torbellinos, islas a la deriva, relámpagos con aviso, cristales y sellos de tormenta, puentes de nube), destellos de
// tormenta que iluminan la escena, SIRIO en las ruinas flotantes y arquitectura andromedana de las alturas.
(function () {
  const D = P.D, T = 'aerthyon', A = P.AEC, TSZ = 16;
  Object.assign(D.planet(T), { ready: true, lair: 'el Santuario Celestial' });
  Object.assign(D.BOSSES.azhyrion, { col: '#5ae0ff', col2: '#ffd166', final: true, music: 'azhyrion' });

  // ---------- armas y mejoras ----------
  D.WEAPONS.rayo = { name: 'Lanzarrayos Celeste', icon: 'i_bolt', planet: T, desc: 'Dispara un rayo veloz que salta a un segundo enemigo cercano.', dmg: 10, rate: 18, speed: 7.5, spr: 'ae_b_bolt', bolt: true };
  Object.assign(D.UPGRADES, {
    corriente: { name: 'Velas de Corriente', icon: 'i_wind', kind: 'Movimiento', planet: T, desc: 'Las corrientes a favor te impulsan más, las de cara te frenan la mitad y las ascendentes te suben más alto.' },
    rayo: { name: 'Lanzarrayos Celeste', icon: 'i_bolt', kind: 'ATAQUE', planet: T, desc: 'Nueva arma: un rayo veloz que salta a un segundo enemigo. Cambia de arma con ' },
    egida: { name: 'Égida de Nimbo', icon: 'i_aegis', kind: 'DEFENSA', planet: T, desc: 'Recibes un 12 % menos de daño y los relámpagos te hacen la mitad.' },
    tempestad: { name: 'Corazón de la Tempestad', icon: 'i_tempest', kind: 'SUPERATAQUE', planet: T, desc: 'Núcleo celeste de AZHYRION. El Pulso Solar hace caer un relámpago sobre cada enemigo de la pantalla.' }
  });
  D.RECIPES.push({ id: 'rayo_mk2', name: 'Lanzarrayos Celeste Mk II', desc: '+30 % de daño del Lanzarrayos Celeste.', cost: { scrap: 22, crys: 5 }, req: [], needUp: 'rayo', needNpc: 'vaelis' });

  // ---------- Archivo Biológico ----------
  const sp = o => Object.assign({ planet: T, variant: 'natural' }, o);
  const AZ = D.SPECIES.findIndex(s => s.id === 'azhyrion'); if (AZ >= 0) D.SPECIES.splice(AZ, 1);
  D.SPECIES.push(
    sp({ id: 'nubicola', col: 'fauna', spr: 'ae_krazith', name: 'Nubícola', sci: 'Nubicola cristallipes', rarity: 'común', habitat: 'Islas flotantes.', behavior: 'Pequeño caminante de patas de cristal con un caparazón de nube en el lomo. Embiste a quien se acerca a su isla.', diet: 'Rocío de las nubes.', abilities: 'Su caparazón le sirve de paracaídas.', danger: 2, eco: 'Siembra esporas de nube en las islas.', lore: 'Los niños andromedanos los cuentan para dormir: un nubícola, dos nubícolas…', tasks: ['seen', { k: 'defeat', n: 3 }, { k: 'observe', n: 4 }] }),
    sp({ id: 'nubicola_cy', col: 'fauna', spr: 'ae_krazith_cy', name: 'Nubícola Cibernético', sci: 'Nubicola cristallipes (mod. Thersek)', rarity: 'poco común', variant: 'cibernética', base: 'nubicola', habitat: 'Perímetro de las extractoras.', behavior: 'Centinela blindado que dispara plasma.', diet: 'Baterías de tormenta.', abilities: 'Placas de titanio sobre la nube.', danger: 3, eco: 'Ninguno.', lore: 'Etiqueta: «LOTE A-N. OBSERVATORIO».', tasks: ['seen', { k: 'defeat', n: 6 }] }),
    sp({ id: 'coloso_nimbo', col: 'fauna', spr: 'ae_krazith_alfa', name: 'Coloso de Nimbo', sci: 'Nimbotitan cornutus (mutación inducida)', rarity: 'rara', variant: 'mutada', base: 'nubicola', habitat: 'Ciudad flotante.', behavior: 'Bestia acorazada con una melena de nubes de tormenta. Sus cuernos cargan electricidad antes de embestir.', diet: 'Corrientes eléctricas.', abilities: 'Cuernos de pararrayos.', danger: 4, eco: 'Atraía los rayos lejos de las ciudades.', lore: 'Los andromedanos lo llamaban «el que se come las tormentas».', tasks: ['seen', { k: 'defeat', n: 1 }] }),
    sp({ id: 'saltabrisa', col: 'fauna', spr: 'ae_frog', name: 'Saltabrisa', sci: 'Saltabrisa velifera', rarity: 'común', habitat: 'Bordes de las islas.', behavior: 'Saltadora con aletas membranosas que planea un instante en cada salto.', diet: 'Insectos de corriente.', abilities: 'Planea de isla en isla.', danger: 1, eco: 'Poliniza las flores aurora.', lore: 'Si una saltabrisa se te posa en el hombro, el viento te quiere.', tasks: ['seen', { k: 'defeat', n: 3 }, { k: 'observe', n: 4 }] }),
    sp({ id: 'velacielo', col: 'fauna', spr: 'ae_dfly', name: 'Velacielo', sci: 'Velacaelum manta', rarity: 'común', habitat: 'Cielos abiertos.', behavior: 'Raya planeadora de alas violetas con cintas luminosas en la cola.', diet: 'Plancton de nube.', abilities: 'No toca el suelo en toda su vida.', danger: 1, eco: 'Dispersa las semillas del árbol cometa.', lore: 'Las cometas andromedanas imitan su silueta.', tasks: ['seen', { k: 'observe', n: 3 }] }),
    sp({ id: 'velacielo_dron', col: 'fauna', spr: 'ae_dfly_cy', name: 'Velacielo Dron', sci: 'Velacaelum manta (mod. Thersek)', rarity: 'poco común', variant: 'cibernética', base: 'velacielo', habitat: 'Observatorio de tormentas.', behavior: 'Patrulla y dispara láseres.', diet: 'Batería eléctrica.', abilities: 'Alas de aleación.', danger: 2, eco: 'Ninguno.', lore: 'Thersek los llama «cometas».', tasks: ['seen', { k: 'defeat', n: 5 }] }),
    sp({ id: 'oruga_estratos', col: 'fauna', spr: 'ae_slug', name: 'Oruga de Estratos', sci: 'Stratoeruca nivea', rarity: 'común', habitat: 'Cornisas de piedra nacarada.', behavior: 'Oruga de segmentos nacarados con penachos de nube.', diet: 'Líquenes de altura.', abilities: 'Sus penachos la sostienen en el aire si cae.', danger: 1, eco: 'Limpia la piedra de los templos.', lore: 'Los templos más blancos son los que tienen más orugas.', tasks: ['seen', { k: 'defeat', n: 2 }, { k: 'restored' }] }),
    sp({ id: 'pacenube', col: 'fauna', spr: 'ae_grazer', name: 'Pacenube', sci: 'Nubipascens sexpes', rarity: 'rara', restoredOnly: true, habitat: 'Praderas de las islas.', behavior: 'Herbívoro de seis patas con sacos de aire que le hacen flotar a ratos.', diet: 'Hierba de altura.', abilities: 'Flota cuando se asusta.', danger: 0, eco: 'Convive con todas las especies de las islas.', lore: 'Un rebaño de pacenubes flotando es la señal de que viene buen tiempo.', tasks: ['seen', { k: 'observe', n: 5 }] }),
    sp({ id: 'ballena_celeste', col: 'fauna', spr: 'ae_vellorn', name: 'Ballena Celeste', sci: 'Caelocetus magnus', rarity: 'legendaria', restoredOnly: true, habitat: 'Solo aparece en un AERTHYON completamente restaurado.', behavior: 'Coloso que nada entre las nubes cantando a las tormentas.', diet: 'El rocío de las nubes altas.', abilities: 'Su canto calma el viento.', danger: 0, eco: 'Dicen que las nubes la siguen.', lore: 'Los andromedanos la llaman «la que canta a AZHYRION».', tasks: ['seen', { k: 'observe', n: 6 }] }),
    sp({ id: 'azhyrion', col: 'fauna', spr: 'azhyrion', boss: true, name: 'AZHYRION', title: 'Dragón de las Nubes', sci: 'Draco tempestas (mod. Thersek)', rarity: 'única', variant: 'cibernética', habitat: 'Santuario Celestial.', behavior: 'Más antiguo que los andromedanos. Thersek le arrancó el cuerpo y le dejó la cabeza y una sola cola de tormenta.', diet: 'Las tormentas del planeta entero.', abilities: 'Viento, relámpagos y presión atmosférica.', danger: 5, eco: 'Gobernaba las tormentas y las repartía por el mundo.', lore: 'Los primeros templos se construyeron para escucharle.', tasks: ['seen', { k: 'defeat', n: 1 }] }),
    sp({ id: 'farol_nimbo', col: 'flora', spr: 'ae_lamp', name: 'Farol de Nimbo', sci: 'Nimbolampas', rarity: 'común', habitat: 'Todo el archipiélago.', behavior: 'Esfera de luz atada al suelo por un tallo nacarado.', diet: 'Electricidad del aire.', abilities: 'Ilumina su entorno.', danger: 0, eco: 'Atrae a las velacielo de noche.', lore: 'Los andromedanos iluminan sus calles con faroles de nimbo.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'helecho_viento', col: 'flora', spr: 'ae_fern_r', name: 'Helecho de Viento', sci: 'Pteris ventosa', rarity: 'común', habitat: 'Praderas de las islas.', behavior: 'Frondas en cinta que se doblan con la corriente.', diet: 'Humedad del aire.', abilities: 'Indica la dirección del viento.', danger: 0, eco: 'Sujeta la tierra de las islas.', lore: 'Los marineros del cielo leían el viento en sus frondas.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'vaina_estratos', col: 'flora', spr: 'ae_mush', name: 'Vaina de Estratos', sci: 'Stratocapsa', rarity: 'poco común', habitat: 'Zonas contaminadas.', behavior: 'Vaina violeta que estalla en una nube eléctrica al notar vibraciones.', diet: 'Electricidad estática.', abilities: 'Descarga eléctrica.', danger: 3, eco: 'Absorbe la estática de las tormentas del régimen.', lore: 'Su descarga es pequeña, pero se nota.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'arbol_cometa', col: 'flora', spr: 'ae_bigmush', name: 'Árbol Cometa', sci: 'Arbor cometes', rarity: 'poco común', habitat: 'Bosques celestes.', behavior: 'Tronco curvo y ligero con frondas violetas translúcidas; sus semillas flotan durante días.', diet: 'Luz y viento.', abilities: 'Sus raíces flotan en el aire.', danger: 0, eco: 'Sostiene islas enteras con sus raíces.', lore: 'Nunca han tocado la tierra. Tampoco la necesitan.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'faro_nimbo', col: 'flora', spr: 'ae_column', name: 'Faro de Nimbo', sci: 'Pharus tempestatis', rarity: 'común', habitat: 'Ciudades y templos.', behavior: 'Formación de cristal que guarda la energía de las tormentas y se enciende cuando algo se acerca.', diet: 'Relámpagos.', abilities: 'Brilla más durante las tormentas.', danger: 0, eco: 'Guía a los viajeros en la niebla.', lore: 'Los cristales de los sellos se tallan de estas formaciones.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'respiradero', col: 'flora', spr: 'ae_t_bulb_r', name: 'Respiradero', sci: 'Spiraculum caeli', rarity: 'común', habitat: 'Suelos de las islas.', behavior: 'Orificio por el que respira la isla: lanza aire hacia arriba.', diet: 'Corrientes internas.', abilities: 'Impulsa a quien lo pisa.', danger: 0, eco: 'Mantiene las islas a flote.', lore: 'Si una isla deja de respirar, se hunde en las nubes.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'liana_plata', col: 'flora', spr: 'ae_t_vine_r', name: 'Liana de Plata', sci: 'Liana argentea', rarity: 'común', habitat: 'Bordes de las islas.', behavior: 'Enredadera metálica que cuelga hacia el vacío.', diet: 'Plata disuelta en el rocío.', abilities: 'Resiste el peso de un cyborg.', danger: 0, eco: 'Une las islas cercanas.', lore: 'Los puentes andromedanos se trenzan con liana de plata.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'espina_cristal', col: 'flora', spr: 'ae_t_thorn_r', name: 'Espina de Cristal', sci: 'Spina crystallina', rarity: 'común', habitat: 'Cumbres.', behavior: 'Crece en púas de cristal celeste.', diet: 'Minerales del aire.', abilities: 'Púas afiladísimas.', danger: 2, eco: 'Protege los nidos de velacielo.', lore: 'Cantan cuando sopla el viento.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'boca_tormenta', col: 'flora', spr: 'ae_maw', name: 'Boca de Tormenta', sci: 'Fauces tonitrui', rarity: 'poco común', variant: 'mutada', habitat: 'Zonas contaminadas.', behavior: 'Planta carnívora de mandíbulas que crepitan.', diet: 'Carnívora.', abilities: 'Escupe chispas.', danger: 3, eco: 'En su forma natural recogía el agua de lluvia.', lore: 'Su forma natural se llamaba «Copa de Lluvia».', tasks: ['seen', { k: 'defeat', n: 2 }] }),
    sp({ id: 'rocio_celeste', col: 'flora', spr: 'ae_heal', name: 'Rocío Celeste', sci: 'Ros caelestis', rarity: 'poco común', habitat: 'Junto a los respiraderos.', behavior: 'Gotas turquesa de rocío condensado.', diet: 'Nubes.', abilities: 'Repara tejidos y circuitos.', danger: 0, eco: 'Medicina de la fauna herida.', lore: 'Los viajeros del cielo lo guardan en frascos de cristal.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'flor_aurora', col: 'flora', spr: 'ae_orchid', name: 'Flor Aurora', sci: 'Flos aurorae', rarity: 'rara', restoredOnly: true, habitat: 'Territorios liberados.', behavior: 'Flor gigantesca que se abre en las alturas al amanecer.', diet: 'Luz.', abilities: 'Sus semillas vuelan con el viento.', danger: 0, eco: 'Alimenta a los pacenubes.', lore: 'Vaelis quiere plantarlas en los Jardines de la nave.', tasks: ['seen', { k: 'scan' }] })
  );
  D.CODEX_REWARDS.aerthyon = {
    fauna: { name: 'Sangre de Céfiro', desc: 'Mod cyborg: +8 % de daño.', mod: 'cefiro' },
    flora: { name: 'Rocío de Nimbo', desc: 'Mod cyborg: las curaciones son un 10 % más potentes.', mod: 'nimbo' },
    all: { name: 'Mirador celeste + Ballena Celeste', desc: 'Un mirador de nubes para los Jardines y la legendaria Ballena Celeste se traslada a la nave.', creature: 'ballena_celeste' }
  };
  Object.assign(D.MISSIONS, {
    s_ecos_a: { count: d => ['h65', 'h66', 'h67', 'h68', 'h69', 'h70', 'h71', 'h72'].filter(h => d.holos[h]).length, name: 'Ecos del cielo', giver: 'ELARA', desc: 'Recupera los 8 registros holográficos ocultos en AERTHYON.', goal: 8, reward: { xp: 360, crys: 3 } },
    s_vaelis: { name: 'El cartógrafo del viento', giver: 'ELARA', desc: 'Un andromedano está prisionero en el Bosque Celeste.', goal: 1, reward: { xp: 190 } },
    s_sirio: { name: 'El aullido de las ruinas', giver: 'ELARA', desc: 'Algo aúlla entre las ruinas flotantes de las Islas Flotantes.', goal: 1, reward: { xp: 120 } },
    s_flores_a: { count: d => d.seeds_s_flores_a || 0, name: 'Flores aurora', giver: 'Vaelis', desc: 'Vaelis necesita 5 semillas de Flor Aurora. Solo brotan en territorios liberados de AERTHYON.', goal: 5, reward: { xp: 240, crys: 4 } }
  });
  D.ACHIEVEMENTS.push({ id: 'azhyrion', name: 'El cielo es libre', desc: 'Derrota a AZHYRION.' }, { id: 'lib_aerthyon', name: 'Bajo un cielo limpio', desc: 'Libera los 10 territorios de AERTHYON.' }, { id: 'sirio', name: 'Un amigo en las nubes', desc: 'Encuentra a SIRIO en las ruinas flotantes.' });
  Object.assign(D.HOLOS, {
    h65: { title: 'Bitácora de Vaelis · Las islas', text: 'Las islas se hunden. El régimen ha tapado los respiraderos para robar el aire de las corrientes. Sin aire, la piedra pesa.' },
    h66: { title: 'Orden Esquelética 977 · Gerselle', text: 'Cada tormenta que no llega a la Esfera es energía perdida. Encadenad el cielo.' },
    h67: { title: 'Cuaderno de un cartógrafo', text: 'El viento del valle cambia cada pocos minutos. Antes de saltar, mira hacia dónde vuelan las hojas.' },
    h68: { title: 'Crónica de Ael-Vira', text: 'Construimos la ciudad sobre nubes porque AZHYRION nos lo pidió. A cambio, le cantamos cada amanecer.' },
    h69: { title: 'Inscripción del Primer Templo', text: '«Cuando la cabeza baje a la tierra, el cielo escuchará. Cuando la cola se apague, el cielo descansará.»' },
    h70: { title: 'Informe del observatorio', text: 'La cabeza de AZHYRION baja al suelo tras cada descarga: se queda sin energía durante unos segundos. Aseguraos de que nadie lo sepa.' },
    h71: { title: 'Canción de los acantilados', text: '«Una cabeza de dragón y una cola de tormenta; sin alas, sin patas, sin cuerpo: el cielo entero es su cuerpo.»' },
    h72: { title: 'Mensaje de N-0', text: '«Siete, el corazón de la Esfera se alimenta de las tormentas de AERTHYON. Libera a AZHYRION y el corazón se quedará sin pulso.»' }
  });
  Object.assign(D.MEMORIES, {
    m18: { title: 'Fragmento de memoria · El templo', text: 'Una sacerdotisa andromedana te enseña a escuchar el viento. «Si cierras los ojos», dice, «el cielo te dice dónde pisar.»' },
    m19: { title: 'Fragmento de memoria · La tormenta', text: 'AZHYRION baja la cabeza hasta tocar tu casco. Sus ojos ya no tienen cadenas. El trueno suena lejos, como una despedida.' }
  });
  D.BOSS_OUTRO.azhyrion = { up: 'tempestad', skin: 'celeste', mem: 'm19', lines: [['elara', 'AZHYRION se detiene. La cadena de Thersek se ha roto en su frente.'], ['vaelis', 'Míralo, {N}… la tormenta vuelve a ser suya. El cielo se está despejando.'], ['elara', 'He extraído un núcleo celeste del implante. Tu Pulso Solar hará caer relámpagos sobre tus enemigos.'], ['hero', 'Nueve piezas de ALBA.'], ['elara', 'Nueve de nueve. ALBA está completa. Integrando… ahora.']] };
  D.POST_BOSS.azhyrion = [['thersek', '¡No! ¡Era la última batería de la Esfera!'], ['gerselle', 'Sin las tormentas, el Anillo Norte no arrancará, Merek.'], ['merek', 'Nueve mundos, {N}. Has liberado mi sistema entero.'], ['merek', 'Te espero en la Esfera. Ven a buscarme, si puedes atravesarla.'], ['elara', 'La Esfera de Dyson aparece en el mapa galáctico… pero su escudo aún no nos deja pasar. Descansa, {N}. Lo has conseguido.'], ['elara', 'Una cosa más: las cinco civilizaciones quieren reunirse a bordo. Hablan de refundar su Consejo… y de cinco naves.']];
  D.FIRST_CLEAR = D.FIRST_CLEAR || {};
  D.FIRST_CLEAR.aerthyon = (S, id) => { if (id === 1) { S.startMission('s_ecos_a'); S.startMission('s_vaelis'); } if (S.liberated(T) >= 10) S.ach('lib_aerthyon'); if (id === 11) S.ach('azhyrion'); };
  D.RESCUE = D.RESCUE || {};
  D.RESCUE.vaelis = { name: 'Vaelis', mission: 's_vaelis', lines: [['vaelis', '¿Un cyborg rojo? ¿Aquí arriba? El viento lleva días hablando de ti.'], ['vaelis', 'Soy Vaelis, cartógrafo del viento. Me encerraron por dibujar las corrientes que el régimen quería esconder.'], ['hero', 'Soy {N}. Vengo a liberar el cielo.'], ['vaelis', 'Entonces tendrás que hablar con AZHYRION. Le han puesto una cadena en la frente.'], ['elara', 'Teletransporte preparado. Bienvenido a bordo, Vaelis.']],
    onRescue: S => { S.startMission('s_flores_a'); },
    ship: { room: 'observatorio', off: 120, talk: S => [['vaelis', 'Desde este ventanal se ven las corrientes del sistema entero. Nunca había visto un mapa tan bonito.'], ['vaelis', 'Semillas de Flor Aurora: ' + (S.data.seeds_s_flores_a || 0) + '/5.']] } };
  P.SPEAKERS.vaelis = { name: 'Vaelis', por: 'por_vaelis', col: '#bfe8ff' };
  (P.D.VILLAGER_LINES.andromedano = P.D.VILLAGER_LINES.andromedano || []).push('Las islas vuelven a respirar. Esta mañana la mía ha subido un palmo.', 'El viento vuelve a cantar en los templos. Gracias, viajero.', 'Los pacenubes han vuelto a flotar sobre las praderas.');

  // ---------- música ----------
  Object.assign(P.Audio.TRACKS, {
    aerthyon: { bpm: 84, root: 50, scale: [0, 2, 4, 6, 7, 9, 11], prog: [0, 4, 5, 3], lead: 'triangle', bass: 'sine', arp: 'triangle', drums: 0, pad: true, seed: 911 },
    aerthyon_r: { bpm: 90, root: 52, scale: [0, 2, 4, 6, 7, 9, 11], prog: [0, 5, 3, 4], lead: 'triangle', bass: 'sine', arp: 'sine', drums: 1, pad: true, seed: 913 },
    aerthyon_ow: { bpm: 80, root: 48, scale: [0, 2, 4, 7, 9], prog: [0, 3, 4, 0], lead: 'triangle', bass: 'sine', arp: 'triangle', drums: 0, pad: true, seed: 917 },
    azhyrion: { bpm: 128, root: 45, scale: [0, 2, 3, 5, 7, 8, 11], prog: [0, 5, 3, 4], lead: 'sawtooth', bass: 'sawtooth', arp: 'square', drums: 2, pad: true, seed: 919 },
    azhyrion_3: { bpm: 146, root: 46, scale: [0, 1, 3, 5, 7, 8, 11], prog: [0, 1, 5, 4], lead: 'sawtooth', bass: 'sawtooth', arp: 'square', drums: 2, pad: true, seed: 923 }
  });

  // ---------- luz y ambiente ----------
  P.FX.GR.aerthyon = { bloomMul: 1.1, day: ['#bfe8ff', '#0a1a4a', 0.22], golden: ['#ffd8b0', '#2a1450', 0.26], dusk: ['#7ab8ff', '#04081c', 0.3], cave: ['#7ab8ff', '#04081c', 0.32], deep: ['#7ab8ff', '#04081c', 0.34], sun: [360, 56], fog: '#bfe8ff', rays: '220,240,255' };
  const UA = P.ART.umbrelia;
  const free = (L, x, y0, y1) => { const tx = Math.floor(x / TSZ); for (let ty = Math.floor(y0 / TSZ); ty <= Math.floor((y1 - 1) / TSZ); ty++) if (L.coll(tx, ty) === 1) return false; return true; };
  const pushX = P.aePushX = (L, e, dx) => { if (!dx || e.dead) return; const nx = e.x + dx; if (free(L, dx > 0 ? nx + e.w : nx, e.y + 2, e.y + e.h - 2)) e.x = nx; };
  Object.assign(P.ART.aerthyon, {
    seedMission: 's_flores_a', seedName: 'Semilla de Flor Aurora', holoMission: 's_ecos_a',
    civs: ['andromedano', 'andromedano', 'pleyadiano', 'andromedano', 'lemuriano'], rigidTrees: [1], treeVariants: [0, 1],
    stone: ['#c8cce4', '#ffd166', '#6a7094', '#5ae0ff', '#ffffff'],
    strata: ['rgba(190,230,255,0.06)', 'rgba(0,0,0,0)', 'rgba(10,20,60,0.14)', 'rgba(0,0,0,0)', 'rgba(255,220,140,0.04)', 'rgba(10,20,50,0.1)'],
    postMap(L) { L.umDark = []; L.darkK = 0; L.aeFlash = 0; },
    ambient(L, cx, cy, rf) {
      if (L.theme === 'facility' || L.theme === 'lab') { if (L.t % 5 === 0) L.parts.add({ x: cx + P.rand(0, P.W), y: cy + P.H, vy: -P.rand(0.5, 1.2), life: 120, col: P.pick(['#5ae0ff', '#bff6ff']), size: 1, glow: 3 }); return true; }
      const storm = P.aeStorm(L), wind = 0.4 + storm * 1.6;
      // motas luminosas suspendidas, hojas y plumas que viajan con el viento, lluvia en las tormentas
      if (L.t % 4 === 0) L.parts.add({ x: cx + P.rand(-20, P.W), y: cy + P.rand(0, P.H), vx: wind * 0.4, vy: P.rand(-0.15, 0.1), life: P.ri(120, 200), col: Math.random() < 0.3 + rf * 0.5 ? P.pick(['#ffffff', '#bff6ff', '#ffd166']) : '#8a94ac', size: 1, glow: 3, fn: q => { q.vy += Math.sin(q.life * 0.05) * 0.01; } });
      if (L.t % 9 === 0) L.parts.add({ x: cx - 10, y: cy + P.rand(20, P.H - 40), vx: wind * P.rand(1, 2), vy: P.rand(-0.2, 0.2), life: 260, col: P.pick(rf > 0.5 ? ['#a898ff', '#56dcd8', '#ffffff'] : ['#6a7490', '#8a94ac']), size: 1, fn: q => { q.vy = Math.sin(q.life * 0.08) * 0.5; } });
      if (storm > 0.4) for (let k = 0; k < 2; k++) L.parts.add({ x: cx + P.rand(0, P.W + 60), y: cy - 4, vx: -wind * 0.8, vy: 5, life: 60, col: '#8ab4f0', size: 1 });
      return true;
    },
    // la tormenta oscurece el cielo y los relámpagos lo iluminan de golpe
    lightAmb(L, amb, rf) { const base = amb ? parseFloat(amb.split(',')[3]) : 0, a = Math.max(0, (base + P.aeStorm(L) * 0.12) * (1 - (L.aeFlash || 0))); return 'rgba(6,10,30,' + a.toFixed(3) + ')'; },
    lights(L, cx, cy) { UA.lights(L, cx, cy); },
    drawTile(L, c, ch, X0, Y0, tx, ty, st) { if (ch === 'G') { P.spr(c, 't_gate', (L.t >> 5) % 2, X0, Y0); P.drawGlow(c, X0 + 8, Y0 + 8, 8, '#5ae0ff', 0.2); } },
    levelUpdate(L) {
      const p = L.player, S = P.State;
      if (!L._aeInit) { L._aeInit = true;
        // SIRIO aúlla en las ruinas flotantes del primer nivel
        const row = (L.def.rows || [[]])[0] || [], i = row.indexOf('ae_sirio');
        if (i >= 0 && !S.data.comps.unlocked.sirio) { const tx = i * 24 + 12; let gy = null; for (let ty = L.rows - 1; ty > 0; ty--) if (L.coll(tx, ty) === 1 && L.coll(tx, ty - 1) !== 1) { gy = ty * TSZ; break; } if (gy != null) { L.add(new P.SirioShrine(L, tx * TSZ, gy)); S.startMission('s_sirio'); } } }
      if (L.aeFlash) L.aeFlash = L.aeFlash < 0.02 ? 0 : L.aeFlash * 0.86;
      if (p.aeDizzy > 0) { p.aeDizzy--; pushX(L, p, Math.sin(L.t * 0.35) * 0.8); }
    },
    levelDraw(L, c) {
      UA.levelDraw(L, c);
      if ((L.aeFlash || 0) > 0.02) { c.globalCompositeOperation = 'lighter'; c.fillStyle = 'rgba(190,230,255,' + (L.aeFlash * 0.22).toFixed(3) + ')'; c.fillRect(0, 0, P.W, P.H); c.globalCompositeOperation = 'source-over'; }
    },
    owDraw(sc, c) { for (let i = 0; i < 22; i++) { const x = ((i * 137 + sc.t * (0.2 + (i % 3) * 0.1)) % (P.W + 20)) - 10, y = (i * 53) % P.H + Math.sin(sc.t * 0.03 + i) * 4, a = (Math.sin(sc.t * 0.05 + i) + 1) / 2; c.fillStyle = 'rgba(' + (i % 3 ? '220,240,255,' : '255,220,140,') + (0.25 + a * 0.6) + ')'; c.fillRect(Math.round(x), Math.round(y), 1, 1); } }
  });

  // ---------- hitos, atrezo y arquitectura de las alturas ----------
  (function () {
    const cache = {}, HZ = 'rgba(150,190,240,0.25)', mk = (key, w, h, fn) => () => { if (cache[key]) return cache[key]; const p = new P.Painter(w, h); fn(p, P.RNG(P.hash(key))); const cv = p.canvas(), x = cv.getContext('2d'); x.globalCompositeOperation = 'source-atop'; x.fillStyle = HZ; x.fillRect(0, 0, w, h); return (cache[key] = cv); };
    const C = ['#2a3460', '#3e4c84', '#5c6ea8', '#8a9cd0'], G = [A.turq[1], A.turq[2], A.turq[3]];
    P.LANDMARKS.aerthyon = [
      mk('la0', 180, 170, (p, r) => { P.Sprites.aePeak(p, 70, 120, 40, 100, C, ['#c8dcf8', '#ffffff'], r, 0.4); P.Sprites.aePeak(p, 120, 126, 46, 118, C, ['#c8dcf8', '#ffffff'], r, 0.4); }),
      mk('la1', 150, 140, (p, r) => { P.Sprites.aeIsland(p, 75, 80, 60, 46, C, G, r); for (let k = 0; k < 4; k++) p.rect(52 + k * 14, 62, 4, 17, '#e4e8f6'); p.rect(48, 58, 58, 4, A.gold[2]); p.tri(48, 58, 106, 58, 77, 44, '#c8cce4'); }),
      mk('la2', 170, 150, (p, r) => { P.Sprites.aeIsland(p, 85, 110, 70, 36, C, null, r); for (let k = 0; k < 6; k++) { const x = 30 + k * 20, h = 30 + r.int(0, 50); p.rect(x, 110 - h, 9, h, k % 2 ? '#e4e8f6' : '#b8bcd4'); p.ell(x + 4, 110 - h, 6, 4, A.gold[2]); for (let y = 114 - h; y < 106; y += 7) p.rect(x + 3, y, 3, 2, A.elec[1]); } }),
      mk('la3', 160, 160, (p, r) => { for (let k = 0; k <= 40; k++) { const a = Math.PI * k / 40; p.thick(80 - Math.cos(a) * 60, 150 - Math.sin(a) * 120, 80 - Math.cos(a) * 60, 150 - Math.sin(a) * 120, 6, k % 4 ? '#c8cce4' : A.gold[2]); } p.ell(80, 34, 6, 6, A.elec[1]); })
    ];
    P.PROPS.aerthyon = ['pa_chime', 'pa_stones', 'pa_feather', 'pa_crystal'];
    Object.assign(P.PROP_LIGHT, { pa_chime: '#ffd166', pa_crystal: '#5ae0ff' });
  })();
  P.ARCH.aerthyon = { civ: 'andromedano', types: ['house', 'special', 'hut', 'shop', 'tower'], extra: [[-10, -1, 'lab'], [9, -1, 'hut'], [-4, 4, 'tower']] };
  P.Sprites.buildAerthyonExtra = function () {
    const O = { up: 0.1, down: 0.15 }, dim = (c2, f) => f ? c2 : P.Col.mix(c2, '#3a4052', 0.65);
    P.mk('pa_chime', 14, 22, 2, (p, f) => { p.rect(6, 2, 2, 20, A.pearl[1]); p.rect(2, 2, 10, 1, A.pearl[2]); for (const x of [2, 7, 11]) { p.rect(x, 3, 1, 4 + (x % 3), A.pearl[2]); p.rect(x - 1, 7 + (x % 3), 3, 2, f ? A.gold[2] : A.pearl[1]); } }, O);
    P.mk('pa_stones', 18, 12, 2, (p, f) => { for (let k = 0; k < 3; k++) p.sell(4 + k * 5, 8 - (k % 2) * 2, 3.4, 2.8, [A.pearl[0], A.pearl[1], A.pearl[3]]); if (f) p.px(9, 5, A.elec[2]); }, O);
    P.mk('pa_feather', 16, 12, 2, (p, f) => { p.line(2, 10, 13, 3, A.pearl[2]); for (let k = 0; k < 6; k++) { p.line(3 + k * 2, 9 - k, 1 + k * 2, 6 - k, dim('#ffffff', f)); p.line(3 + k * 2, 9 - k, 6 + k * 2, 10 - k, dim(A.vio[4], f)); } }, O);
    P.mk('pa_crystal', 14, 18, 2, (p, f) => { if (P.Sprites.umCrystal) { P.Sprites.umCrystal(p, 7, 18, 6, 16, f ? [A.elec[0], A.elec[1], A.elec[2], '#ffffff'] : A.storm, 0.05); P.Sprites.umCrystal(p, 3, 18, 3, 7, f ? [A.vio[1], A.vio[2], A.vio[3], A.vio[4]] : A.storm, -0.2); } }, O);
    // arquitectura andromedana: cápsula sobre pilotes, casa con cúpula de cristal, torre de observación, pabellón de
    // velas, centro de investigación atmosférica con turbinas y palacio de agujas
    const TT = (type, f) => p => {
      const lit = f === 1, W = (x, y, w, h) => { p.rect(x, y, w, h, lit ? A.elec[1] : '#1a2040'); if (lit) p.px(x, y, '#ffffff'); }, ST = dim('#e4e8f6', f), SD = dim('#b8bcd4', f), GD = dim(A.gold[2], f);
      if (type === 'hut') { p.rect(8, 22, 2, 8, SD); p.rect(20, 22, 2, 8, SD); p.sell(15, 16, 11, 8, [dim('#9aa0c4', f), SD, ST, dim('#ffffff', f)]); W(11, 14, 8, 3); p.line(15, 2, 15, 8, GD); }
      if (type === 'house') { p.rect(6, 26, 32, 20, ST); p.rect(6, 26, 1, 20, '#ffffff'); p.sell(22, 26, 15, 13, [dim('#3a6ab8', f), dim('#5a8ad8', f), dim('#8ad4ff', f), dim('#ffffff', f)]); p.rect(6, 24, 32, 2, GD); p.rect(19, 34, 6, 12, '#1a2040'); W(10, 32, 5, 4); W(29, 32, 5, 4); }
      if (type === 'tower') { for (let y = 0; y < 50; y++) { const w = 5 - y / 22; p.rect(Math.round(14 - w), 61 - y, Math.round(w * 2), 1, (y >> 3) % 2 ? ST : SD); } p.rect(7, 6, 14, 6, GD); p.tri(9, 6, 19, 6, 14, -2, dim(A.elec[1], f)); W(12, 22, 4, 4); W(12, 36, 4, 4); p.ell(14, 9, 2, 1.6, lit ? '#ffffff' : '#3a4052'); }
      if (type === 'shop') { p.rect(2, 28, 42, 8, SD); for (let i = 0; i < 3; i++) { const x = 4 + i * 14; p.rect(x, 10, 1, 18, ST); p.tri(x + 1, 10, x + 1, 26, x + 12, 22 - i, dim([A.vio[3], '#ffffff', A.turq[2]][i], f)); } for (const x of [9, 23, 37]) p.sell(x, 25, 3, 2.4, lit ? [A.elec[0], A.elec[1], A.elec[2]] : A.storm.slice(0, 3)); }
      if (type === 'lab') { p.rect(2, 28, 44, 16, SD); p.rect(2, 28, 44, 2, GD); for (const x of [10, 24, 38]) { p.rect(x - 1, 8, 2, 20, ST); for (let k = 0; k < 3; k++) { const a = k * 2.09 + (lit ? 0.4 : 0); p.line(x, 8, x + Math.cos(a) * 7, 8 + Math.sin(a) * 7, ST); } p.ell(x, 8, 1.4, 1.4, GD); } W(8, 34, 6, 4); W(30, 34, 6, 4); p.px(40, 30, '#ff3050'); }
      if (type === 'special') { for (let k = 0; k < 3; k++) p.rect(6 + k * 6, 50 - (k + 1) * 10, 32 - k * 12, 10, k % 2 ? SD : ST); for (const [x, h] of [[8, 30], [22, 46], [36, 30]]) { p.rect(x - 2, 50 - h, 4, h - 20, ST); p.tri(x - 3, 50 - h, x + 3, 50 - h, x, 50 - h - 10, GD); } p.rect(19, 36, 6, 14, '#1a2040'); if (lit) { p.ell(22, 30, 3, 2, A.elec[2]); } }
    };
    for (const t in P.ARCH_SIZE) P.mk('ae_b_' + t, P.ARCH_SIZE[t][0], P.ARCH_SIZE[t][1], 2, (p, f) => TT(t, f)(p), { up: 0.1, down: 0.16, dark: 0.45 });
    // faro de nimbo (Q): marco de cristal con una esfera de tormenta flotando dentro
    P.mk('ae_column', 40, 56, 2, (p, f) => { p.sell(20, 54, 14, 3, [A.pearl[0], A.pearl[1], A.pearl[2]]); for (const x of [9, 31]) { p.rect(x - 1, 10, 3, 44, A.pearl[2]); p.rect(x - 1, 10, 1, 44, '#ffffff'); } p.rect(7, 8, 27, 3, A.gold[2]); p.sell(20, 30, 8, 8, f ? [A.elec[0], A.elec[1], A.elec[2], '#ffffff'] : A.storm); if (f) for (let k = 0; k < 4; k++) p.line(20, 30, 20 + Math.cos(k * 1.6) * 11, 30 + Math.sin(k * 1.6) * 11, A.elec[2]); });
    // cristal de tormenta (Z) con abrazaderas de plata
    P.mk('ae_rescrys', 20, 34, 3, (p, f) => { p.sell(10, 32, 9, 3, [A.pearl[0], A.pearl[1], A.pearl[2]]); const C = f === 0 ? A.storm : f === 1 ? [A.elec[0], A.elec[1], A.elec[2], '#ffffff'] : [A.elec[1], A.elec[2], '#ffffff', '#ffffff']; if (P.Sprites.umCrystal) P.Sprites.umCrystal(p, 10, 32, 9, 30, C, 0); for (let k = 0; k < 3; k++) p.rect(3 + k * 5, 26, 3, 6, A.pearl[2]); });
    // isla a la deriva (v)
    P.mk('ae_drift', 48, 22, 1, p => P.Sprites.aeIsland(p, 24, 3, 23, 16, ['#3c4676', '#5c6aa0', '#8e9cd0', '#c8d0ec'], [A.turq[1], A.turq[2], A.turq[3]], P.RNG(77), { glow: A.elec[2] }));
    P.Sprites.registerLook('vaelis', Object.assign({}, P.CIV.andromedano, { skin: '#a898ff', skinD: '#6a5ad0', cloth: '#e4e8f6', clothD: '#9aa0c4', acc: '#ffd166', h: 24 }));
  };
  (function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildAerthyonExtra(); }; })();

  // ---------- entidades y mecánicas ----------
  // Cristal de tormenta (Z): al dispararle libera energía que abre sellos y hace aparecer puentes de nube
  P.StormCrystal = class extends P.ResonanceCrystal {
    hit() { if (this.charge < 0.3) { P.Audio.sfx('block'); return; } P.umPulse(this.L, this.cx, this.cy, 150 + 140 * this.charge, this, '#5ae0ff'); this.L.aeFlash = 0.5; this.charge = 0; this.flash = 8; }
    draw(c, cx, cy) { const x = Math.round(this.x - cx), y = Math.round(this.y - cy), full = this.charge >= 1; P.drawGlow(c, x + 8, y + 14, 18 + this.charge * 24, '#5ae0ff', 0.2 + this.charge * 0.35); P.spr(c, 'rescrys', full ? 2 : this.charge > 0.3 ? 1 : 0, x - 2, y - 2, { flash: this.flash > 0 }); c.fillStyle = '#0a1028'; c.fillRect(x, y + 34, 16, 2); c.fillStyle = full ? '#ffffff' : '#5ae0ff'; c.fillRect(x, y + 34, Math.round(16 * this.charge), 2); }
  };
  // Losa de nube (J): aparece y se disuelve; junto a un cristal de tormenta solo aparece con su energía
  P.CloudSlab = class extends P.PhasePlatform {
    draw(c, cx, cy) {
      const x = Math.round(this.x - cx), y = Math.round(this.y - cy);
      if (!this.on) { c.globalAlpha = 0.35; for (let k = 0; k < 3; k++) P.spr(c, 't_phase', 1, x + k * TSZ, y); c.globalAlpha = 1; return; }
      if (this.warn() && (this.t >> 2) % 2) c.globalAlpha = 0.5; P.drawGlow(c, x + 24, y + 4, 24, '#bff6ff', 0.3); for (let k = 0; k < 3; k++) P.spr(c, 't_phase', 0, x + k * TSZ, y + Math.round(Math.sin(this.t * 0.05 + k) * 0.6)); c.globalAlpha = 1;
    }
  };
  // Faro de nimbo (Q): se enciende al acercarte y destella con cada relámpago
  P.StormLantern = class extends P.LumenChamber {
    constructor(L, x, y) { super(L, x, y); this.species = 'faro_nimbo'; }
    umLight() { return [this.cx, this.cy, 40 + this.near * 50 + (this.L.aeFlash || 0) * 60, 0.9]; }
    draw(c, cx, cy) { const on = this.L.restoredAt(this.cx), x = Math.round(this.x - cx), y = Math.round(this.y - cy), f = this.L.aeFlash || 0; P.drawGlow(c, x + 20, y + 30, 26 + this.near * 22 + f * 30, '#5ae0ff', 0.15 + this.near * 0.35 + f * 0.4); P.spr(c, 'column', on || this.near > 0.5 || f > 0.2 ? 1 : 0, x, y); }
  };
  // Corriente ascendente (Y): te eleva mientras estés dentro de la columna
  P.Updraft = class extends P.Ent {
    constructor(L, x, y) { super(L, x - 12, y - 11 * TSZ, 24, 11 * TSZ); this.gy = y; }
    update() {
      this.t++; const L = this.L, p = L.player, st = p.st || {};
      if (!p.dead && P.overlap(this, p)) { const k = Math.max(0.25, (p.y + p.h - this.y) / this.h), cap = st.corriente ? -5.6 : -4.4; p.vy = Math.max(p.vy - (0.55 + 0.25 * k), cap); p.onGround = false; }
      if (this.t % 3 === 0) L.parts.add({ x: this.cx + P.rand(-10, 10), y: this.gy - 2, vy: -P.rand(2.5, 4), life: 44, col: P.pick(['#ffffff', '#bff6ff', '#dceaff']), size: 1, fn: q => { q.vx = Math.sin(q.life * 0.2) * 0.4; } });
    }
    draw(c, cx, cy) { const x = Math.round(this.x - cx), y = Math.round(this.y - cy); c.fillStyle = 'rgba(220,240,255,0.08)'; c.fillRect(x + 2, y, 20, this.h); for (let k = 0; k < 7; k++) { const yy = this.h - ((this.t * 3 + k * 26) % this.h); c.fillStyle = 'rgba(255,255,255,' + (0.18 + (k % 2) * 0.12) + ')'; c.fillRect(x + 4 + ((k * 7) % 16), y + yy, 1, 10); } P.spr(c, 't_bulb_r', (this.t >> 3) % 3, x + 4, Math.round(this.gy - cy) - 16); P.drawGlow(c, x + 12, Math.round(this.gy - cy) - 6, 16, '#bff6ff', 0.3); }
  };
  // Corriente de viento (V): empuja en una dirección y cambia con aviso; cada cambio empieza con una ráfaga
  P.WindCurrent = class extends P.Ent {
    constructor(L, x, y, m) { super(L, (m.x - 7) * TSZ, (m.y - 4) * TSZ, 16 * TSZ, 9 * TSZ); this.ph = (m.x * 37) % 400; }
    get cyc() { return (this.L.t + this.ph) % 400; }
    get dir() { const t = this.cyc; return t < 200 ? 1 : -1; }
    get warn() { const t = this.cyc % 200; return t >= 160; }
    update() {
      this.t++; const L = this.L, p = L.player, st = p.st || {}, t = this.cyc % 200, d = this.dir, gust = t < 24;
      if (!p.dead && P.overlap(this, p)) { let f = gust ? 1.9 : 0.9; if (st.corriente) f *= (p.face === d ? 1.45 : 0.5); pushX(L, p, d * f); }
      for (const e of L.ents) if (e.isEnemy && !e.dead && !e.boss && !e.passive && e.vx !== undefined && P.overlap(this, e) && !(e instanceof P.Fly)) pushX(L, e, d * 0.5);
      if (t === 0) { P.Audio.sfx('dash'); }
      if (this.t % (gust ? 1 : 3) === 0) L.parts.add({ x: d > 0 ? this.x : this.x + this.w, y: this.y + P.rand(0, this.h), vx: d * P.rand(2.5, 4.5) * (gust ? 1.6 : 1), life: 60, col: P.pick(['#ffffff', '#dceaff', '#bff6ff']), size: 1, fn: q => { q.vy = Math.sin(q.life * 0.15) * 0.2; } });
    }
    draw(c, cx, cy) {
      const x = Math.round(this.x - cx), y = Math.round(this.y - cy), d = this.dir;
      c.fillStyle = 'rgba(220,240,255,0.12)'; for (let k = 0; k < 9; k++) { const yy = y + 8 + k * 15, xx = x + (((this.t * 2.4 * d + k * 53) % this.w) + this.w) % this.w; c.fillRect(Math.round(xx), yy, 26, 1); c.fillRect(Math.round(xx) + 6 * d, yy + 2, 14, 1); }
      if (this.warn && (this.t >> 3) % 2) { // aviso: flechas en el sentido que viene
        c.fillStyle = '#ffd166'; for (let k = 0; k < 3; k++) { const ax = x + this.w / 2 - 14 + k * 12, nd = -d; for (let j = 0; j < 4; j++) c.fillRect(ax + (nd > 0 ? 4 - j : j), y + 8 - j, 1, 1 + j * 2); } }
    }
  };
  // Torbellino (O): recorre el suelo de un lado a otro; si te atrapa te lanza hacia arriba y te desorienta un momento
  P.Whirlwind = class extends P.Ent {
    constructor(L, x, y) { super(L, x - 11, y - 44, 22, 44); this.hx = x; this.d = 1; this.cool = 0; }
    update() {
      this.t++; const L = this.L, p = L.player; if (this.cool > 0) this.cool--;
      const nx = this.x + this.d * 0.7; if (Math.abs(nx + 11 - this.hx) > 5 * TSZ || !free(L, this.d > 0 ? nx + this.w : nx, this.y + 4, this.y + this.h - 4)) this.d = -this.d; else this.x = nx;
      if (!p.dead && this.cool === 0 && P.overlap(this, p)) { this.cool = 70; p.vy = -7.6; p.onGround = false; p.aeDizzy = 40; pushX(L, p, this.d * 6); P.Audio.sfx('dash'); L.parts.burst(p.cx, p.y + p.h, 10, { col: '#ffffff', smin: 1, smax: 3 }); }
      if (this.t % 2 === 0) L.parts.add({ x: this.cx + P.rand(-10, 10), y: this.y + this.h - 2, vx: P.rand(-1, 1), vy: -P.rand(1, 3), life: 26, col: P.pick(['#c8cce4', '#ffffff', '#8a94ac']), size: 1 });
    }
    draw(c, cx, cy) { const x = Math.round(this.cx - cx), y = Math.round(this.y - cy); for (let k = 0; k < 11; k++) { const w = 3 + k * 1.3, yy = y + this.h - k * 4, s = Math.sin(this.t * 0.4 + k * 0.8) * (2 + k * 0.4); c.globalAlpha = 0.35 + (k % 2) * 0.25; c.fillStyle = k % 3 ? '#e8f0ff' : '#ffffff'; c.fillRect(Math.round(x - w + s), yy, Math.round(w * 2), 2); c.fillStyle = '#8a94ac'; c.fillRect(Math.round(x + s + Math.cos(this.t * 0.4 + k) * w), yy, 2, 1); } c.globalAlpha = 1; }
  };
  // Isla a la deriva (v): plataforma que flota de un lado a otro y te lleva consigo
  P.DriftIsle = class extends P.Ent {
    constructor(L, x, y, m) { super(L, (m.x - 1) * TSZ, m.y * TSZ, 48, 8); this.hx = this.x; this.ty = m.y; this.owned = []; this.ph = m.x * 0.7; this.set(); }
    set() { const L = this.L, t0 = Math.floor(this.x / TSZ), want = []; for (let k = 0; k < 4; k++) want.push(t0 + k);
      for (const tx of this.owned) if (!want.includes(tx) && L.tile(tx, this.ty) === 'j') L.map[this.ty][tx] = '.';
      this.owned = want.filter(tx => { const ch = L.tile(tx, this.ty); if (ch === '.' || ch === 'j') { L.map[this.ty][tx] = 'j'; return true; } return false; }); }
    update() {
      this.t++; const L = this.L, p = L.player, ox = this.x;
      this.x = this.hx + Math.sin(this.t * 0.012 + this.ph) * 3 * TSZ; const dx = this.x - ox;
      const on = !p.dead && p.onGround && Math.abs(p.y + p.h - this.ty * TSZ) < 3 && p.cx > this.x - 6 && p.cx < this.x + 54;
      if (on) pushX(L, p, dx);
      if (Math.floor(this.x / TSZ) !== Math.floor(ox / TSZ)) this.set();
    }
    umLight() { return [this.cx, this.y + 10, 36, 0.7]; }
    draw(c, cx, cy) { const x = Math.round(this.x - cx), y = Math.round(this.y - cy); P.drawGlow(c, x + 24, y + 14, 20, '#bff6ff', 0.2); P.spr(c, 'drift', 0, x, y - 3); }
  };
  // Punto de impacto de relámpagos (W): el suelo brilla (aviso) y cae un rayo; con la Égida de Nimbo hace la mitad
  P.LightningSpot = class extends P.Ent {
    constructor(L, x, y) { super(L, x - 12, y - 8, 24, 8); this.ph = (x * 3) % 240; }
    get per() { return P.aeStorm(this.L) > 0.6 ? 180 : 240; }
    get ct() { return (this.L.t + this.ph) % this.per; }
    update() {
      this.t++; const L = this.L, p = L.player, ct = this.ct, per = this.per, strikeAt = per - 40;
      if (ct === strikeAt - 50) P.Audio.sfx('charge');
      if (ct >= strikeAt - 50 && ct < strikeAt && this.t % 4 === 0) L.parts.add({ x: this.cx + P.rand(-12, 12), y: this.y + 6, vy: -P.rand(0.4, 1.2), life: 16, col: P.pick(['#5ae0ff', '#ffffff']), size: 1, glow: 3 });
      if (ct === strikeAt) { P.Audio.sfx('explode'); P.shake(3, 10); L.aeFlash = Math.max(L.aeFlash || 0, 0.8); L.parts.burst(this.cx, this.y + 6, 14, { col: P.pick(['#ffffff', '#bff6ff', '#5ae0ff']), smin: 1, smax: 3.5, g: 0.12, size: 2, glow: 3 }); }
      if (ct >= strikeAt && ct < strikeAt + 10 && !p.dead && Math.abs(p.cx - this.cx) < 15 && p.y + p.h > this.y - 70) p.hurt(p.st && p.st.egida ? 6 : 12, this.cx, { env: true });
    }
    umLight() { const ct = this.ct, s = this.per - 40; return ct >= s - 50 && ct < s + 10 ? [this.cx, this.y - 10, ct >= s ? 120 : 40, 1] : null; }
    draw(c, cx, cy) {
      const x = Math.round(this.cx - cx), y = Math.round(this.y - cy) + 8, ct = this.ct, s = this.per - 40;
      if (ct >= s - 50 && ct < s) { const k = (ct - (s - 50)) / 50; c.globalAlpha = 0.3 + k * 0.5 + ((this.t >> 2) % 2) * 0.2; c.fillStyle = '#5ae0ff'; c.fillRect(x - 13, y - 2, 26, 2); c.fillStyle = '#ffffff'; c.fillRect(x - Math.round(13 * k), y - 1, Math.round(26 * k), 1); c.globalAlpha = 1; P.drawGlow(c, x, y - 4, 10 + k * 14, '#5ae0ff', 0.3 + k * 0.3); }
      if (ct >= s && ct < s + 10) { P.aeBolt(c, x + ((ct * 7) % 9) - 4, -Math.round(cy) % 30 - 10, x, y - 2, this.L.t, '#ffffff', 2, 2); P.drawGlow(c, x, y - 10, 40, '#bff6ff', 0.8); }
    }
  };
  // SIRIO en las ruinas flotantes: lo retiene un sello de viento del régimen
  P.SirioShrine = class extends P.Ent {
    constructor(L, x, y) { super(L, x - 18, y - 30, 36, 30); this.interact = !P.State.data.comps.unlocked.sirio; this.howl = 0; }
    get prompt() { return 'Romper el sello de viento'; }
    use() {
      const S = P.State, L = this.L; this.interact = false; P.Audio.sfx('restore'); L.aeFlash = 0.7;
      L.say([['elara', 'Un sello de viento del régimen… y algo vivo dentro. Lo desactivo.'], ['sirio', '¡Auuuuu!'], ['hero', 'Tranquilo, amigo. Soy {N}.'], ['elara', 'Un lobo blanco de origen desconocido. Te ha olido y… creo que ya ha decidido que eres de su manada.'], ['elara', 'Puedes llevarlo como apoyo desde la Bahía de la nave. Se llama SIRIO: lo pone en su collar.']], () => {
        S.data.comps.unlocked.sirio = true; S.missionDone('s_sirio'); S.ach('sirio'); S.addXP(60); this.free = 1;
        P.toast('SIRIO se une a tu equipo (Bahía de apoyo)', { col: P.UIC.green, icon: 'por_sirio', life: 260 }); P.Audio.sfx('bark');
        for (let i = 0; i < 30; i++) L.parts.add({ x: this.cx + P.rand(-12, 12), y: this.y + P.rand(0, 26), vy: -P.rand(1, 3), life: 40, col: P.pick(['#ffffff', '#bff6ff']), size: 2, glow: 4 });
      });
    }
    update() { this.t++; if (this.free) { this.free++; return; } const p = this.L.player, d = Math.abs(p.cx - this.cx); if (d < 320 && this.t - this.howl > 300) { this.howl = this.t; P.Audio.sfx('bark'); if (!this.L._aeHowl) { this.L._aeHowl = true; P.toast('Se oye un aullido entre las ruinas…', { col: '#bff6ff', life: 160 }); } } }
    umLight() { return [this.cx, this.cy, 60, 0.9]; }
    draw(c, cx, cy) {
      const x = Math.round(this.x - cx), y = Math.round(this.y - cy);
      if (this.free) { if (this.free < 90) { c.globalAlpha = 1 - this.free / 90; P.spr(c, 'sirio', 0, x + 2, y + 9); c.globalAlpha = 1; } return; }
      P.drawGlow(c, x + 18, y + 18, 30, '#bff6ff', 0.35 + Math.sin(this.t * 0.06) * 0.1);
      P.spr(c, 'sirio', (this.t % 400) < 300 ? 9 : 0, x + 2, y + 9);
      for (let k = 0; k < 14; k++) { const a = this.t * 0.06 + k * 0.45, r = 16 + Math.sin(this.t * 0.03 + k) * 2; c.fillStyle = k % 3 ? 'rgba(220,240,255,0.7)' : '#5ae0ff'; c.fillRect(Math.round(x + 18 + Math.cos(a) * r * 1.2), Math.round(y + 18 + Math.sin(a) * r * 0.8), 2, 1); }
      c.fillStyle = '#3a4258'; c.fillRect(x + 4, y + 28, 28, 2); for (const sx of [6, 28]) { c.fillStyle = '#7a86a4'; c.fillRect(x + sx, y + 4, 2, 24); c.fillStyle = '#ff3050'; c.fillRect(x + sx, y + 6, 2, 2); }
    }
  };

  // marcadores reinterpretados en AERTHYON
  const rk = (e, kind) => { e.kind = kind; return e; }, gy = (L, m) => L.snapY(m.x, m.y);
  P.LV.aerthyon.spawn = {
    c: (L, x, y) => L.add(rk(new P.Crab(L, x - 9, y, false), 'nubicola')),
    K: (L, x, y, m, R) => L.add(R ? rk(new P.Crab(L, x - 9, y, false), 'nubicola') : rk(new P.Crab(L, x - 10, y, true), 'nubicola_cy')),
    A: (L, x, y, m, R) => { if (!R) L.add(rk(new P.Alpha(L, x - 20, y), 'coloso_nimbo')); },
    f: (L, x, y) => L.add(rk(new P.Frog(L, x - 7, y - 11), 'saltabrisa')),
    d: (L, x, y) => L.add(rk(new P.Fly(L, x - 8, y - 20, false), 'velacielo')),
    D: (L, x, y, m, R) => { const fac = L.theme === 'facility' || L.theme === 'lab'; if (!R) { const e = L.add(new P.Fly(L, x - 8, y - 20, true)); if (!fac) e.kind = 'velacielo_dron'; } else if (!fac) L.add(rk(new P.Fly(L, x - 8, y - 20, false), 'velacielo')); },
    l: (L, x, y) => L.add(rk(new P.Slug(L, x - 10, y - 8), 'oruga_estratos')),
    p: (L, x, y, m, R) => { if (!R) L.add(rk(new P.Maw(L, x - 6, y - 16), 'boca_tormenta')); else L.add(new P.Decor(L, x, y, 'fern_r', 'helecho_viento')); },
    h: (L, x, y) => { const e = L.add(new P.HealPlant(L, x, y)); e.light = '#5ae0ff'; },
    Q: (L, x, y, m) => L.add(new P.StormLantern(L, x, gy(L, m))),
    Y: (L, x, y, m) => L.add(new P.Updraft(L, x, gy(L, m))),
    Z: (L, x, y, m) => L.add(new P.StormCrystal(L, x, gy(L, m))),
    V: (L, x, y, m) => L.add(new P.WindCurrent(L, x, y, m)),
    O: (L, x, y, m) => L.add(new P.Whirlwind(L, x, gy(L, m))),
    J: (L, x, y, m) => L.add(new P.CloudSlab(L, x, y, m)),
    W: (L, x, y, m) => L.add(new P.LightningSpot(L, x, gy(L, m))),
    v: (L, x, y, m) => L.add(new P.DriftIsle(L, x, y, m))
  };
  P.LV.aerthyon.overworld.vip = { look: 'vaelis', civ: 'andromedano', talk: lib => [['vaelis', lib >= 10 ? 'Las islas vuelven a subir, {N}. Y anoche una Ballena Celeste cantó sobre el templo.' : 'Cada territorio liberado abre un respiradero. Las islas lo notan.']] };

  // ---------- integración con el jugador: Lanzarrayos Celeste ----------
  const baseKill = P.Proj.prototype.kill;
  P.Proj.prototype.kill = function (spark) {
    if (this.chainBolt && !this.chainDone && !this.dead) { this.chainDone = true; const L = this.L; let best = null, bd = 96;
      for (const e of L.ents) if (e.isEnemy && !e.dead && !e.passive && !e.harmless) { const d = P.dist(this.cx, this.cy, e.cx, e.cy); if (d > 10 && d < bd) { bd = d; best = e; } }
      if (best) { best.hit(this.dmg * 0.6, { x: this.cx }); for (let k = 0; k <= 10; k++) L.parts.add({ x: this.cx + (best.cx - this.cx) * k / 10 + P.rand(-2, 2), y: this.cy + (best.cy - this.cy) * k / 10 + P.rand(-3, 3), life: 10, col: k % 2 ? '#ffffff' : '#5ae0ff', size: 1, glow: 3 }); } }
    return baseKill.call(this, spark);
  };
})();
