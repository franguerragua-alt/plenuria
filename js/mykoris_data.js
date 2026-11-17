'use strict';
// MYKORIS — datos, mecánicas del ecosistema fúngico (setas elásticas, esporas, red micelial, hongos reactivos,
// flores que se abren y cierran, zonas de crecimiento), luz bioluminiscente por zonas y arquitectura simbiótica.
(function () {
  const D = P.D, T = 'mykoris', M = P.MYC, TSZ = 16;
  const zone = L => P.MY_ZONE[L.id] || ['#5ef0a0', '#c06aff'];
  Object.assign(D.planet(T), { ready: true, lair: 'el Trono de MYKARON' });
  Object.assign(D.BOSSES.mykaron, { col: '#ff7ad8', col2: '#5ac8ff' });

  // ---------- armas y mejoras ----------
  D.WEAPONS.lanzaesporas = { name: 'Lanzaesporas Pleyadiano', icon: 'i_sporegun', planet: T, desc: 'Lanza una cápsula de esporas que envenena y deja una nube que sigue dañando a los enemigos.', dmg: 7, rate: 22, speed: 4.6, spr: 'my_b_orb', spore: true };
  Object.assign(D.UPGRADES, {
    resorte: { name: 'Pies Micelares', icon: 'i_spring', kind: 'Movimiento', planet: T, desc: 'Las setas elásticas y las setas resorte te lanzan mucho más alto.' },
    lanzaesporas: { name: 'Lanzaesporas Pleyadiano', icon: 'i_sporegun', kind: 'ATAQUE', planet: T, desc: 'Nueva arma: cápsulas de esporas que envenenan y dejan una nube dañina. Cambia de arma con ' },
    quitina: { name: 'Coraza Fúngica', icon: 'i_chitin', kind: 'DEFENSA', planet: T, desc: 'Placas de quitina viva: recibes un 10 % menos de daño y la niebla de esporas no te ciega.' },
    micorriza: { name: 'Corazón Micorrizo', icon: 'i_mycorrhiza', kind: 'SUPERATAQUE', planet: T, desc: 'Núcleo arrancado de MYKARON. El Pulso Solar hace brotar un anillo de hongos que estallan y te curan.' }
  });
  D.RECIPES.push({ id: 'lanzaesporas_mk2', name: 'Lanzaesporas Mk II', desc: '+30 % de daño del Lanzaesporas Pleyadiano.', cost: { scrap: 16, bio: 10 }, req: [], needUp: 'lanzaesporas', needNpc: 'ylmira' });

  // ---------- Archivo Biológico ----------
  const sp = o => Object.assign({ planet: T, variant: 'natural' }, o);
  const MK = D.SPECIES.findIndex(s => s.id === 'mykaron'); if (MK >= 0) D.SPECIES.splice(MK, 1);
  D.SPECIES.push(
    sp({ id: 'sporocarpo', col: 'fauna', spr: 'my_krazith', name: 'Sporocarpo', sci: 'Sporocarpus ambulans', rarity: 'común', habitat: 'Bosques de hongos.', behavior: 'Bola de esporas que camina sobre zancos. Embiste y, al morir, siembra el suelo.', diet: 'Materia en descomposición.', abilities: 'Lleva miles de esporas en el lomo.', danger: 2, eco: 'Es el jardinero del bosque: planta hongos allí donde camina.', lore: 'Los pleyadianos decían que cada sporocarpo lleva un bosque dormido a cuestas.', tasks: ['seen', { k: 'defeat', n: 3 }, { k: 'observe', n: 4 }] }),
    sp({ id: 'sporocarpo_cy', col: 'fauna', spr: 'my_krazith_cy', name: 'Sporocarpo Cibernético', sci: 'Sporocarpus ambulans (mod. Thersek)', rarity: 'poco común', variant: 'cibernética', base: 'sporocarpo', habitat: 'Perímetro de las extractoras.', behavior: 'Centinela blindado que dispara plasma.', diet: 'Podredumbre del régimen.', abilities: 'Esporas esterilizadas bajo placas de titanio.', danger: 3, eco: 'Ninguno.', lore: 'Etiqueta: «LOTE M-S. LABORATORIO DE CULTIVO».', tasks: ['seen', { k: 'defeat', n: 6 }] }),
    sp({ id: 'micoloso', col: 'fauna', spr: 'my_krazith_alfa', name: 'Micoloso', sci: 'Mycocolossus custos (mutación inducida)', rarity: 'rara', variant: 'mutada', base: 'sporocarpo', habitat: 'Llanura de las Esporas.', behavior: 'Seta colosal que camina. Guardiana del bosque enloquecida.', diet: 'Raíces antiguas.', abilities: 'Embiste, salta y dispara esporas duras.', danger: 4, eco: 'Protegía los claros donde nacían los hongos jóvenes.', lore: 'Los pleyadianos le pedían permiso antes de entrar en un claro.', tasks: ['seen', { k: 'defeat', n: 1 }] }),
    sp({ id: 'saltahongo', col: 'fauna', spr: 'my_frog', name: 'Saltahongo', sci: 'Saltopileus oculatus', rarity: 'común', habitat: 'Claros y pantanos.', behavior: 'Sombrero saltarín con un ojo bajo las láminas. Escupe esporas.', diet: 'Insectos de las setas.', abilities: 'Salta el triple de su altura.', danger: 1, eco: 'Dispersa esporas al saltar.', lore: 'Los niños pleyadianos jugaban a imitar su salto.', tasks: ['seen', { k: 'defeat', n: 3 }, { k: 'observe', n: 4 }] }),
    sp({ id: 'hifalida', col: 'fauna', spr: 'my_dfly', name: 'Hifálida', sci: 'Hyphalis volans', rarity: 'común', habitat: 'Cielos del bosque.', behavior: 'Vuela con alas de láminas y esparce esporas luminosas.', diet: 'Néctar de hongo.', abilities: 'Sus alas brillan al batir.', danger: 1, eco: 'Lleva las esporas de un hongo a otro.', lore: 'Un enjambre de hifálidas al anochecer parece una lluvia de estrellas al revés.', tasks: ['seen', { k: 'observe', n: 3 }] }),
    sp({ id: 'hifalida_dron', col: 'fauna', spr: 'my_dfly_cy', name: 'Hifálida Dron', sci: 'Hyphalis volans (mod. Thersek)', rarity: 'poco común', variant: 'cibernética', base: 'hifalida', habitat: 'Laboratorio de cultivo.', behavior: 'Patrulla y dispara láseres.', diet: 'Batería biológica.', abilities: 'Alas de láminas metálicas.', danger: 2, eco: 'Ninguno.', lore: 'Thersek las llama «mis fumigadoras».', tasks: ['seen', { k: 'defeat', n: 5 }] }),
    sp({ id: 'reptamicelio', col: 'fauna', spr: 'my_slug', name: 'Reptamicelio', sci: 'Mycoserpens lucens', rarity: 'común', habitat: 'Redes de micelio.', behavior: 'Gusano segmentado que se desliza sobre los hilos de micelio.', diet: 'Savia del micelio.', abilities: 'Sus segmentos brillan en verde y turquesa.', danger: 1, eco: 'Mantiene limpia la red micelial.', lore: 'Por donde pasa un reptamicelio, el micelio brilla más.', tasks: ['seen', { k: 'defeat', n: 2 }, { k: 'restored' }] }),
    sp({ id: 'colgaseta', col: 'fauna', spr: 'my_vsnake', name: 'Colgaseta', sci: 'Pendulopileus insidiator', rarity: 'poco común', habitat: 'Techos de las cavernas.', behavior: 'Seta que cuelga de un hilo y se descuelga sobre su presa.', diet: 'Pequeños voladores.', abilities: 'Un punto de luz como señuelo.', danger: 2, eco: 'Regula las poblaciones de hifálidas.', lore: 'Los mineros pleyadianos miraban siempre al techo.', tasks: ['seen', { k: 'defeat', n: 2 }] }),
    sp({ id: 'camuflongo', col: 'fauna', spr: 'my_wraith', name: 'Camuflongo', sci: 'Mimopileus vorax', rarity: 'poco común', habitat: 'Cavernas y bosques.', behavior: 'Parece una seta inofensiva hasta que algo se acerca: entonces abre la boca y salta.', diet: 'Lo que pase cerca.', abilities: 'Camuflaje perfecto entre los hongos.', danger: 3, eco: 'Protege los hongos jóvenes de los herbívoros.', lore: 'Dicen que si una seta te mira, no es una seta.', tasks: ['seen', { k: 'defeat', n: 3 }] }),
    sp({ id: 'pacespora', col: 'fauna', spr: 'my_grazer', name: 'Pacespora', sci: 'Sporopascens collilongus', rarity: 'rara', restoredOnly: true, habitat: 'Claros restaurados.', behavior: 'Rumiante de cuello largo que pasta esporas en el aire.', diet: 'Esporas.', abilities: 'Lleva una seta viva en la cabeza.', danger: 0, eco: 'Su seta suelta esporas nuevas cada mañana.', lore: 'Un pacespora en el claro significa que el bosque está sano.', tasks: ['seen', { k: 'observe', n: 5 }] }),
    sp({ id: 'micoforo', col: 'fauna', spr: 'my_vellorn', name: 'Gran Micóforo', sci: 'Mycophorus caelestis', rarity: 'legendaria', restoredOnly: true, habitat: 'Solo aparece en un MYKORIS completamente restaurado.', behavior: 'Ballena fúngica que flota sobre el bosque con un jardín en el lomo.', diet: 'Luz de las lunas.', abilities: 'Su lomo es un bosque entero.', danger: 0, eco: 'Siembra bosques allí donde se posa.', lore: 'Los pleyadianos dicen que MYKORIS entero nació del lomo de un micóforo.', tasks: ['seen', { k: 'observe', n: 6 }] }),
    sp({ id: 'mykaron', col: 'fauna', spr: 'mykaron', boss: true, name: 'MYKARON', title: 'Rey Hongo', sci: 'Mycorex regalis (mod. Thersek)', rarity: 'única', variant: 'cibernética', habitat: 'Trono de MYKARON.', behavior: 'Pensaba con un millón de raíces. El chip de Thersek lo dejó con una sola voz: la del régimen.', diet: 'Energía de la red micelial.', abilities: 'Garras larguísimas, esferas de esporas, raíces que brotan del suelo y crías.', danger: 5, eco: 'Era la mente de todo el bosque.', lore: 'Los pleyadianos le consultaban antes de cada cosecha.', tasks: ['seen', { k: 'defeat', n: 1 }] }),
    sp({ id: 'farolfungo', col: 'flora', spr: 'my_lamp', name: 'Farolfungo', sci: 'Lucicampana minor', rarity: 'común', habitat: 'Todo el bosque.', behavior: 'Campana que brilla y gotea luz.', diet: 'Humedad y azúcares.', abilities: 'Ilumina su entorno.', danger: 0, eco: 'Atrae a las hifálidas.', lore: 'Las casas pleyadianas se iluminan con farolfungos.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'velohifa', col: 'flora', spr: 'my_fern_r', name: 'Velohifa', sci: 'Hyphavelum plumosum', rarity: 'común', habitat: 'Suelos húmedos.', behavior: 'Frondas de hifas plumosas que se mecen sin viento.', diet: 'Materia orgánica.', abilities: 'Sus puntas brillan.', danger: 0, eco: 'Sujeta el suelo del bosque.', lore: 'Las almohadas pleyadianas se rellenan con velohifa.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'bombaspora_flor', col: 'flora', spr: 'my_mush', name: 'Bombaspora', sci: 'Sporobomba tumescens', rarity: 'poco común', habitat: 'Zonas contaminadas y pantanos.', behavior: 'Se hincha al detectar movimiento y suelta un soplo de esporas.', diet: 'Gases del pantano.', abilities: 'Soplo que empuja; estalla si la golpean.', danger: 2, eco: 'Dispersa esporas a gran distancia.', lore: 'Los pleyadianos las usaban para sembrar campos enteros de una vez.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'copa_lunar', col: 'flora', spr: 'my_bigmush', name: 'Copa Lunar', sci: 'Calyx lunaris', rarity: 'poco común', habitat: 'Claros abiertos.', behavior: 'Sombrero plano que gotea luz verde.', diet: 'Luz de las lunas.', abilities: 'Acumula luz de día y la suelta de noche.', danger: 0, eco: 'Refugio de los saltahongos.', lore: 'Bajo una copa lunar nadie se pierde.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'seta_faro', col: 'flora', spr: 'my_column', name: 'Seta Faro', sci: 'Pharopileus colossus', rarity: 'común', habitat: 'Bosques y cavernas.', behavior: 'Hongo gigante que reacciona a quien se acerca abriendo sus láminas luminosas.', diet: 'Energía del micelio.', abilities: 'Ilumina como un faro.', danger: 0, eco: 'Guía a toda la fauna de noche.', lore: 'Las más viejas tienen más años que la propia ciudad.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'seta_resorte', col: 'flora', spr: 'my_t_bulb_r', name: 'Seta Elástica', sci: 'Elastopileus saltator', rarity: 'común', habitat: 'Claros y cavernas.', behavior: 'Su sombrero se comprime y te devuelve hacia arriba.', diet: 'Humedad.', abilities: 'Impulsa a quien la pisa.', danger: 0, eco: 'Las crías de pacespora juegan sobre ellas.', lore: 'Los mensajeros pleyadianos cruzaban el bosque saltando de seta en seta.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'cordon_hifal', col: 'flora', spr: 'my_t_vine_r', name: 'Cordón Hifal', sci: 'Funis hyphalis', rarity: 'común', habitat: 'Cavernas y raíces.', behavior: 'Cuerda de hifas que cuelga del techo.', diet: 'Savia.', abilities: 'Resiste el peso de un cyborg.', danger: 0, eco: 'Une el techo y el suelo de las cuevas.', lore: 'Los puentes pleyadianos se tejen con cordones hifales.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'espinagarra', col: 'flora', spr: 'my_t_thorn_r', name: 'Espinagarra', sci: 'Acanthomyces', rarity: 'común', habitat: 'Fosos y bordes.', behavior: 'Hongo de púas venenosas.', diet: 'Minerales.', abilities: 'Púas punzantes.', danger: 2, eco: 'Protege los claros de los herbívoros.', lore: 'Cuando el bosque sana, sus púas se vuelven violetas.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'trampa_laminar', col: 'flora', spr: 'my_maw', name: 'Trampa Laminar', sci: 'Lamellotrap vorax', rarity: 'poco común', variant: 'mutada', habitat: 'Zonas contaminadas.', behavior: 'Sombrero carnívoro que se abre en láminas dentadas.', diet: 'Carnívora.', abilities: 'Escupe esporas duras.', danger: 3, eco: 'En su forma natural, recogía agua de lluvia.', lore: 'Su forma natural se llamaba «Cuenco del Rocío».', tasks: ['seen', { k: 'defeat', n: 2 }] }),
    sp({ id: 'seta_balsamo', col: 'flora', spr: 'my_heal', name: 'Seta Bálsamo', sci: 'Balsamopileus medicus', rarity: 'poco común', habitat: 'Junto a las setas faro.', behavior: 'Racimo de setas con savia curativa.', diet: 'Luz.', abilities: 'Repara tejidos y circuitos.', danger: 0, eco: 'Medicina de la fauna herida.', lore: 'Los sanadores pleyadianos la cultivan en sus casas.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'orquidea_micelial', col: 'flora', spr: 'my_orchid', name: 'Orquídea Micelial', sci: 'Orchis mycorrhiza', rarity: 'rara', restoredOnly: true, habitat: 'Territorios liberados.', behavior: 'Flor que solo crece unida a la red micelial.', diet: 'Simbiosis con el micelio.', abilities: 'Sus semillas llevan micelio dentro.', danger: 0, eco: 'Alimenta al Gran Micóforo.', lore: 'Ylmira quiere plantarlas en los Jardines de la nave.', tasks: ['seen', { k: 'scan' }] })
  );
  D.CODEX_REWARDS.mykoris = {
    fauna: { name: 'Sangre de Hifa', desc: 'Mod cyborg: el superataque se carga un 10 % más rápido.', mod: 'hifa' },
    flora: { name: 'Savia Micelial', desc: 'Mod cyborg: las curaciones son un 10 % más potentes.', mod: 'micelio' },
    all: { name: 'Bosque de la nave + Gran Micóforo', desc: 'Un jardín de setas para la nave y el legendario Gran Micóforo se traslada a la nave.', creature: 'micoforo' }
  };
  Object.assign(D.MISSIONS, {
    s_ecos_m: { count: d => ['h41', 'h42', 'h43', 'h44', 'h45', 'h46', 'h47', 'h48'].filter(h => d.holos[h]).length, name: 'Ecos del bosque', giver: 'ELARA', desc: 'Recupera los 8 registros holográficos ocultos en MYKORIS.', goal: 8, reward: { xp: 300, crys: 3 } },
    s_ylmira: { name: 'La jardinera de esporas', giver: 'ELARA', desc: 'Una pleyadiana está prisionera en el Valle del Micelio.', goal: 1, reward: { xp: 160 } },
    s_orquideas: { count: d => d.seeds_s_orquideas || 0, name: 'Orquídeas para la nave', giver: 'Ylmira', desc: 'Ylmira necesita 5 semillas de Orquídea Micelial. Solo brotan en territorios liberados de MYKORIS.', goal: 5, reward: { xp: 210, crys: 4 } }
  });
  D.ACHIEVEMENTS.push({ id: 'mykaron', name: 'Leñador de reyes', desc: 'Derrota a MYKARON.' }, { id: 'lib_mykoris', name: 'El bosque piensa', desc: 'Libera los 10 territorios de MYKORIS.' });
  Object.assign(D.HOLOS, {
    h41: { title: 'Bitácora de Ylmira · El bosque', text: 'El bosque ya no habla. MYKARON solo repite una frase, día y noche: «Obedece». Las setas se pudren donde él mira.' },
    h42: { title: 'Orden Esquelética 702 · Gerselle', text: 'La red micelial de MYKORIS conecta todo el planeta. Si controlamos al rey, controlamos cada raíz.' },
    h43: { title: 'Canción del pantano', text: '«Agua que respira, hongo que piensa; donde cae una espora, un bosque empieza.»' },
    h44: { title: 'Plano de los Pies Micelares', text: 'Suelas de micelio vivo: se agarran al hongo un instante y luego te devuelven al cielo.' },
    h45: { title: 'Registro de la ciudad', text: 'No construimos casas: les pedimos a los hongos que nos dejaran vivir dentro. Algunos dijeron que sí.' },
    h46: { title: 'Informe de la República · MYKORIS', text: 'La red micelial transmite señales más rápido que nuestros cables. Los pleyadianos la usan como biblioteca viva.' },
    h47: { title: 'Bitácora de Thersek · Proyecto M', text: 'El rey hongo procesa la información de un planeta entero. Con mi chip, será el servidor de la Esfera.' },
    h48: { title: 'Mensaje de N-0', text: '«Siete: cuando lleguemos a MYKORIS, escucha al bosque. Dice cosas sobre la Esfera que Merek no quiere que sepas.»' }
  });
  Object.assign(D.MEMORIES, {
    m12: { title: 'Fragmento de memoria · El jardín', text: 'Recuerdas un jardín de setas luminosas en una nave. N-0 y tú lo regabais a escondidas. «Algún día plantaremos uno de verdad», decía.' },
    m13: { title: 'Fragmento de memoria · La red', text: 'Por un instante, el micelio te muestra la Esfera desde dentro: millones de raíces de luz que bajan hacia un solo corazón.' }
  });
  D.BOSS_OUTRO.mykaron = { up: 'micorriza', skin: 'micelial', mem: 'm13', lines: [['elara', 'MYKARON se detiene. El chip de Thersek se ha podrido con él.'], ['ylmira', 'Escucha, {N}… el bosque vuelve a hablar. Mil voces otra vez.'], ['elara', 'He extraído un núcleo micorrizo del implante. Tu Pulso Solar hará brotar hongos que estallan y te curan.'], ['hero', 'Seis piezas de ALBA. El bosque ha vuelto a pensar.'], ['elara', 'Seis de nueve. Integrando… ahora.']] };
  D.POST_BOSS.mykaron = [['thersek', '¡Mi servidor! ¿Sabes cuántos datos había en esas raíces, K-7?'], ['gerselle', 'Thersek, deja de llorar. La Esfera tiene más jardines.'], ['merek', 'Seis mundos. El bosque te habrá contado cosas. No las creas todas, {N}.'], ['elara', 'Transmisión cortada. La siguiente ruta aún no está abierta. Descansa, {N}.']];
  D.FIRST_CLEAR = D.FIRST_CLEAR || {};
  D.FIRST_CLEAR.mykoris = (S, id) => { if (id === 1) { S.startMission('s_ecos_m'); S.startMission('s_ylmira'); } if (S.liberated(T) >= 10) S.ach('lib_mykoris'); if (id === 11) S.ach('mykaron'); };
  D.RESCUE = D.RESCUE || {};
  D.RESCUE.ylmira = { name: 'Ylmira', mission: 's_ylmira', lines: [['ylmira', '¿Un cyborg rojo en el Valle del Micelio? El bosque me dijo que vendrías. No le creí.'], ['ylmira', 'Soy Ylmira, jardinera de esporas. Me encerraron por esconder las semillas de la Orquídea Micelial.'], ['hero', 'Soy {N}. Vengo a devolverle la voz al bosque.'], ['ylmira', 'Entonces tendrás que hablar con MYKARON. O con lo que queda de él.'], ['elara', 'Teletransporte preparado. Bienvenida a bordo, Ylmira.']],
    onRescue: S => { S.startMission('s_orquideas'); },
    ship: { room: 'jardin', off: 60, talk: S => [['ylmira', 'Las setas de la nave crecen torcidas. Les falta el micelio de casa.'], ['ylmira', 'Semillas de Orquídea Micelial: ' + (S.data.seeds_s_orquideas || 0) + '/5.']] } };
  P.SPEAKERS.ylmira = { name: 'Ylmira', por: 'por_ylmira', col: '#5ef0a0' };
  P.D.VILLAGER_LINES.pleyadiano.push('El bosque vuelve a hablar. Esta noche lo escucharé.', 'Mi casa ha crecido una habitación nueva. Gracias, viajero.', 'Las esporas doradas vuelven a volar. Buena señal.');

  // ---------- música ----------
  Object.assign(P.Audio.TRACKS, {
    mykoris: { bpm: 74, root: 50, scale: [0, 2, 3, 6, 7, 9, 10], prog: [0, 3, 4, 5], lead: 'sine', bass: 'triangle', arp: 'sine', drums: 1, pad: true, seed: 611, marimba: true },
    mykoris_r: { bpm: 80, root: 50, scale: [0, 2, 4, 6, 7, 9, 11], prog: [0, 4, 5, 3], lead: 'sine', bass: 'sine', arp: 'triangle', drums: 1, pad: true, seed: 611, marimba: true },
    mykoris_ow: { bpm: 88, root: 52, scale: [0, 2, 4, 6, 7, 9, 11], prog: [0, 5, 3, 4], lead: 'triangle', bass: 'sine', arp: 'sine', drums: 0, pad: true, seed: 617 }
  });

  // ---------- luz y ambiente ----------
  P.FX.GR.mykoris = { bloomMul: 1.05, day: ['#9affd0', '#10203a', 0.28], golden: ['#ffb0e0', '#1a0a3a', 0.3], dusk: ['#7affc8', '#06061e', 0.34], cave: ['#7af0e0', '#04080e', 0.34], deep: ['#7af0e0', '#04080e', 0.34], sun: [360, 44], fog: '#7af0c8', rays: '160,255,210' };
  const UA = P.ART.umbrelia;
  const darkAt = (L, px) => { for (const [a, b] of L.umDark || []) if (px >= a && px < b) return true; return false; };
  Object.assign(P.ART.mykoris, {
    seedMission: 's_orquideas', seedName: 'Semilla de Orquídea Micelial', holoMission: 's_ecos_m',
    civs: ['pleyadiano', 'pleyadiano', 'lemuriano', 'pleyadiano', 'arturiano'], rigidTrees: [1], treeVariants: [0, 1],
    stone: ['#cdbfa0', '#fff4dc', '#a89878', '#5ef0a0', '#ff7ad8'],
    strata: ['rgba(94,240,160,0.05)', 'rgba(0,0,0,0)', 'rgba(20,0,40,0.12)', 'rgba(0,0,0,0)', 'rgba(192,106,255,0.05)', 'rgba(0,0,20,0.1)'],
    postMap(L) { L.umDark = []; L.umCr = {}; L.umBroken = []; L.myGrow = []; L.myLinks = []; (L.def.rows || []).forEach(row => row.forEach((ch, i) => { if (P.MY_DARK.includes(ch)) L.umDark.push([i * 24 * TSZ, (i + 1) * 24 * TSZ]); })); },
    ambient(L, cx, cy, rf) {
      if (L.theme === 'facility' || L.theme === 'lab') return false;
      const Z = zone(L);
      // esporas luminosas que suben despacio y motas de polen; en zonas contaminadas, esporas grises enfermas
      if (L.t % 3 === 0) L.parts.add({ x: cx + P.rand(0, P.W), y: cy + P.H + 2, vx: P.rand(-0.15, 0.15), vy: -P.rand(0.15, 0.45), life: P.ri(160, 260), col: Math.random() < 0.25 + rf * 0.6 ? P.pick([Z[0], Z[1], '#ffe08a', '#ffffff']) : P.pick(['#6a6278', '#8a8098']), size: Math.random() < 0.2 ? 2 : 1, glow: 3, fn: q => { q.vx = Math.sin((q.life + q.x) * 0.03) * 0.25; } });
      return true;
    },
    lightAmb(L, amb, rf) {
      if ((L.darkK || 0) < 0.02) return amb; const base = amb ? parseFloat(amb.split(',')[3]) : 0, a = base + (0.82 - base) * L.darkK; return 'rgba(2,8,10,' + a.toFixed(3) + ')';
    },
    lights: UA.lights,
    drawTile(L, c, ch, X, Y, tx, ty, st) {
      if (ch === 'T') { P.spr(c, 't_unstable', 0, X, Y); if ((tx + ty + (L.t >> 4)) % 4 === 0) P.drawGlow(c, X + 8, Y + 8, 10, '#e07aff', 0.3); }
      else if (ch === 'G') { P.spr(c, 't_gate', (L.t >> 5) % 2, X, Y); P.drawGlow(c, X + 8, Y + 8, 10, '#5ef0a0', 0.25); }
    },
    levelUpdate(L) {
      const p = L.player, st = p.st || {};
      const fog = (L.myFogT > 0 && !st.quitina) || darkAt(L, p.cx); if (L.myFogT > 0) L.myFogT--;
      L.darkK = (L.darkK || 0) + ((fog ? 1 : 0) - (L.darkK || 0)) * 0.06;
      // Pies Micelares: el rebote de las setas elásticas lanza más alto
      if (st.resorte && p.vy <= -8.5 && p.vy >= -8.7 && !p._myBoost) { p.vy = -11.2; p._myBoost = true; } if (p.vy > 0) p._myBoost = false;
      // zonas de crecimiento: la carne fúngica retraída vuelve a crecer (avisa brotando antes)
      for (const g of L.myGrow) if (--g.t <= 0) { const box = { x: g.tx * TSZ, y: g.ty * TSZ, w: TSZ, h: TSZ }; if (!P.overlap(box, p) && !L.ents.some(e => e.isEnemy && !e.dead && P.overlap(box, e))) { L.map[g.ty][g.tx] = 'T'; g.done = true; L.parts.burst(g.tx * TSZ + 8, g.ty * TSZ + 12, 5, { col: '#e07aff', smin: 0.3, smax: 1.2 }); } else g.t = 15; }
      L.myGrow = L.myGrow.filter(g => !g.done);
      for (const k of L.myLinks) k.t++; L.myLinks = L.myLinks.filter(k => k.t < 50);
    },
    levelDraw(L, c) {
      UA.levelDraw(L, c);
      const cx = Math.round(L.cam.x), cy = Math.round(L.cam.y);
      // energía que corre por el micelio desde el nodo hasta lo que activa
      for (const k of L.myLinks) { const a = 1 - k.t / 50, n = 14; c.fillStyle = 'rgba(94,240,160,' + (0.35 * a) + ')'; for (let i = 0; i <= n; i++) { const t = i / n, x = k.x0 + (k.x1 - k.x0) * t, y = k.y0 + (k.y1 - k.y0) * t + Math.sin(t * 9 + k.t * 0.3) * 3; c.fillRect(Math.round(x - cx), Math.round(y - cy), 2, 2); } const tt = Math.min(1, k.t / 24), hx = k.x0 + (k.x1 - k.x0) * tt, hy = k.y0 + (k.y1 - k.y0) * tt; P.drawGlow(c, hx - cx, hy - cy, 10, '#d8ffe0', 0.7 * a); }
      // brotes que avisan de que la carne fúngica va a volver
      for (const g of L.myGrow) if (g.t < 90 && (g.t >> 3) % 2) P.spr(c, 't_unstable', 1, g.tx * TSZ - cx, g.ty * TSZ - cy);
    },
    owDraw(sc, c) { for (let i = 0; i < 16; i++) { const x = (i * 137 + sc.t * 0.2) % P.W, y = P.H - ((i * 53 + sc.t * 0.35) % P.H), a = (Math.sin(sc.t * 0.05 + i) + 1) / 2; c.fillStyle = 'rgba(' + (i % 2 ? '94,240,160' : '192,106,255') + ',' + (0.3 + a * 0.5) + ')'; c.fillRect(Math.round(x), Math.round(y), 1, 1); } }
  });

  // ---------- hitos lejanos, atrezo y arquitectura simbiótica pleyadiana ----------
  (function () {
    const cache = {}, HZ = 'rgba(60,140,140,0.32)', mk = (key, w, h, fn) => () => { if (cache[key]) return cache[key]; const p = new P.Painter(w, h); fn(p, P.RNG(P.hash(key))); const cv = p.canvas(), x = cv.getContext('2d'); x.globalCompositeOperation = 'source-atop'; x.fillStyle = HZ; x.fillRect(0, 0, w, h); return (cache[key] = cv); };
    P.LANDMARKS.mykoris = [
      mk('lm0', 160, 170, () => (p => P.Sprites.myShroom(p, 80, 168, 130, 70, M.gre, M.tq, M.stem, { shape: 'flat', capH: 20, drips: 16 }))),
      mk('lm1', 140, 170, (p) => { P.Sprites.myShroom(p, 70, 168, 150, 22, M.vio, M.gre, M.stem, { shape: 'cone', capH: 30 }); for (let k = 0; k < 4; k++) P.Sprites.myShroom(p, 70, 120 - k * 28, 2, 30 - k * 5, M.vio, M.gre, M.stem, { shape: 'flat', capH: 5 }); }),
      mk('lm2', 180, 120, (p) => { for (let k = 0; k < 5; k++) P.Sprites.myShroom(p, 20 + k * 35, 118, 40 + (k % 2) * 30, 18, [M.cap, M.mag, M.vio, M.gre, M.tq][k], M.gill, M.stem, { shape: 'dome', capH: 12, spots: 5 }); }),
      mk('lm3', 170, 140, (p) => { for (let k = 0; k < 9; k++) { const a = Math.PI * k / 8; p.thick(85 - Math.cos(a) * 70, 138 - Math.sin(a) * 90, 85 - Math.cos(a) * 64, 138 - Math.sin(a) * 84, 4, M.stem[1]); } P.Sprites.myShroom(p, 85, 60, 1, 30, M.mag, M.gill, M.stem, { shape: 'dome', capH: 14, spots: 6 }); })
    ];
    P.LANDMARKS.mykoris[0] = mk('lm0b', 160, 170, p => P.Sprites.myShroom(p, 80, 168, 130, 70, M.gre, M.tq, M.stem, { shape: 'flat', capH: 20, drips: 16 }));
    P.PROPS.mykoris = ['pm_cluster', 'pm_log', 'pm_puff', 'pm_bell'];
    Object.assign(P.PROP_LIGHT, { pm_bell: '#5af0f0', pm_cluster: '#5ef0a0' });
  })();
  P.ARCH.mykoris = { civ: 'pleyadiano', types: ['house', 'special', 'hut', 'shop', 'tower'], extra: [[-10, -1, 'lab'], [9, -1, 'hut'], [-4, 4, 'hut']] };
  P.Sprites.buildMykorisExtra = function () {
    const O = { up: 0.1, down: 0.15 }, dim = (c2, f) => f ? c2 : P.Col.mix(c2, '#3a3448', 0.7), Dm = (A, f) => A.map(c2 => dim(c2, f));
    P.mk('pm_cluster', 18, 16, 2, (p, f) => { for (let k = 0; k < 4; k++) P.Sprites.myShroom(p, 3 + k * 4, 15, 4 + (k % 2) * 4, 3, Dm(M.gre, f), Dm(M.gre, f), Dm(M.stem, f), { shape: 'bell' }); }, O);
    P.mk('pm_log', 26, 12, 2, (p, f) => { p.rect(1, 6, 24, 5, dim('#4e3222', f)); p.rect(1, 6, 24, 1, dim('#6a4a32', f)); for (let k = 0; k < 4; k++) P.Sprites.myShroom(p, 4 + k * 6, 7, 2, 3, Dm(M.cap, f), Dm(M.gill, f), Dm(M.stem, f), {}); }, O);
    P.mk('pm_puff', 14, 12, 2, (p, f) => { p.sell(7, 7, 6, 5, Dm(M.stem, f)); for (let k = 0; k < 4; k++) p.px(4 + k * 2, 5, dim('#c8b8c8', f)); }, O);
    P.mk('pm_bell', 12, 18, 2, (p, f) => P.Sprites.myShroom(p, 6, 17, 10, 5, Dm(M.tq, f), Dm(M.tq, f), Dm(M.stem, f), { shape: 'bell', capH: 6, drips: f ? 3 : 0 }), O);
    // arquitectura cultivada: casa dentro de un tallo, archivo-cúpula de láminas, choza-bejín, mercado bajo sombrero,
    // torre de sombreros, cámara de cultivo (investigación)
    const TT = (type, f) => p => {
      const lit = f === 1, W = (x, y, w, h) => { p.rect(x, y, w, h, lit ? '#ffe08a' : '#2a2026'); if (lit) p.px(x, y, '#ffffff'); };
      if (type === 'hut') { p.sell(15, 20, 13, 10, Dm(M.stem, f)); for (let k = 0; k < 5; k++) p.px(6 + k * 4, 13 + (k % 2), dim('#a89878', f)); p.rect(12, 21, 6, 9, '#2a1a12'); W(8, 17, 3, 3); P.Sprites.myShroom(p, 25, 29, 6, 4, Dm(M.cap, f), Dm(M.gill, f), Dm(M.stem, f), { spots: 2 }); }
      if (type === 'house') { for (let i = 0; i < 30; i++) { const w = 10 - i / 10; p.rect(Math.round(22 - w), 45 - i, Math.round(w * 2), 1, Dm(M.stem, f)[(i >> 3) % 2 ? 1 : 2]); } P.Sprites.myShroom(p, 22, 16, 1, 22, Dm(M.cap, f), Dm(M.gill, f), Dm(M.stem, f), { shape: 'dome', capH: 14, spots: 6 }); p.rect(19, 36, 6, 10, '#2a1a12'); W(15, 26, 4, 4); W(26, 30, 4, 4); for (let k = 0; k < 3; k++) P.Sprites.myShroom(p, 6 + k * 2, 45, 3 + k, 2, Dm(M.vio, f), Dm(M.vio, f), Dm(M.stem, f), {}); }
      if (type === 'tower') { for (let i = 0; i < 56; i++) p.rect(11, 61 - i, 6, 1, Dm(M.stem, f)[(i >> 2) % 2 ? 1 : 2]); for (let k = 0; k < 4; k++) { const yy = 52 - k * 13, w = 13 - k * 2; for (let q = 0; q < 5; q++) { const ww = w * Math.sqrt(1 - (q / 5) ** 2); p.rect(Math.round(14 - ww), yy - q, Math.round(ww * 2), 1, Dm(M.vio, f)[q < 2 ? 0 : 1]); } p.line(14 - w, yy + 1, 14 + w, yy + 1, dim('#5ef0a0', f)); } W(12, 56, 4, 5); }
      if (type === 'shop') { P.Sprites.myShroom(p, 23, 35, 18, 22, Dm(M.cap, f), Dm(M.gill, f), Dm(M.stem, f), { shape: 'flat', capH: 8, spots: 8 }); p.rect(4, 26, 38, 8, dim('#6a4a32', f)); p.rect(4, 26, 38, 1, dim('#a07a50', f)); for (const x of [10, 22, 34]) P.Sprites.myShroom(p, x, 26, 2, 3, Dm(P.pick([M.gre, M.vio, M.mag]), f), Dm(M.gill, f), Dm(M.stem, f), {}); }
      if (type === 'lab') { p.rect(2, 36, 44, 8, dim('#4e3222', f)); p.sell(24, 30, 19, 16, lit ? ['#0a4a5a', '#1aa0b0', '#5af0f0', '#d8ffff'] : ['#1e1a28', '#2e2a3a', '#3e3a4e', '#504a64']); for (let k = 0; k < 5; k++) P.Sprites.myShroom(p, 12 + k * 6, 38, 4 + (k % 3) * 3, 3, Dm([M.gre, M.mag, M.cap][k % 3], f), Dm(M.gill, f), Dm(M.stem, f), {}); p.rect(40, 8, 2, 20, '#8a98bc'); p.px(41, 7, '#ff3050'); }
      if (type === 'special') { for (let i = 0; i < 20; i++) p.rect(17, 49 - i, 10, 1, Dm(M.stem, f)[(i >> 2) % 2 ? 1 : 2]); P.Sprites.myShroom(p, 22, 30, 1, 21, Dm(M.mag, f), Dm(M.gill, f), Dm(M.stem, f), { shape: 'dome', capH: 20, spots: 8 }); for (let k = -9; k <= 9; k++) p.line(22, 31, 22 + k * 2.2, 33, dim(k % 2 ? '#3a8ae8' : '#9ad8ff', f)); p.rect(19, 40, 6, 10, '#2a1a12'); }
    };
    for (const t in P.ARCH_SIZE) P.mk('my_b_' + t, P.ARCH_SIZE[t][0], P.ARCH_SIZE[t][1], 2, (p, f) => TT(t, f)(p), { up: 0.1, down: 0.16, dark: 0.5 });
    // entidades del planeta
    P.mk('my_column', 40, 96, 2, (p, f) => P.Sprites.myShroom(p, 20, 95, 78, 19, Dm(M.gre, f), Dm(M.tq, f), Dm(M.stem, f), { shape: 'flat', capH: 9, drips: f ? 9 : 2, lean: 0.05 }), { up: 0.1, down: 0.15, dark: 0.5 });
    P.mk('my_rescrys', 20, 34, 3, (p, f) => { for (let k = 0; k < 5; k++) p.line(10, 32, 2 + k * 4, 33, '#5ef0a0'); p.sell(10, 26, 5, 6, ['#0a4a2a', '#1aa050', '#5ef0a0', '#d8ffe0']); P.Sprites.myShroom(p, 10, 22, 6, 8, f === 0 ? Dm(M.gre, 0) : f === 1 ? M.gre : M.tq, M.gill, M.stem, { shape: 'bell', capH: 7, drips: f * 2 }); p.ell(10, 12, 2, 2, f === 2 ? '#ffffff' : '#a8ff7a'); });
    P.mk('my_excrys', 16, 22, 3, (p, f) => { const r = [5, 7, 6][f]; p.rect(7, 18, 2, 4, M.stem[1]); p.sell(8, 18 - r, r + 1, r, f === 2 ? ['#ffffff', '#ffffff', '#ffe0ff', '#ffffff'] : ['#5a0a3a', '#a01a6a', '#e03a9a', '#ff9ad8']); for (let k = 0; k < 4; k++) p.px(5 + k * 2, 16 - r, '#ffffff'); });
    P.mk('my_spring', 32, 24, 3, (p, f) => { const sq = [0, 5, 2][f]; p.rect(14, 12 + sq, 4, 12 - sq, M.stem[1]); for (let yy = 0; yy < 10 - sq; yy++) { const ww = 15 * Math.sqrt(1 - (yy / (10 - sq)) ** 2) + sq; p.rect(Math.round(16 - ww), 13 + sq - yy, Math.round(ww * 2), 1, yy < 2 ? M.mag[0] : yy > 6 ? M.mag[2] : M.mag[1]); } for (let k = 0; k < 5; k++) p.ell(5 + k * 5.5, 8 + sq, 1.4, 1.2, M.mag[3]); });
    P.Sprites.registerLook('ylmira', Object.assign({}, P.CIV.pleyadiano, { skin: '#d8ffe0', skinD: '#8ae0b0', hair: '#c06aff', hairD: '#7a3ac0', cloth: '#1aa050', clothD: '#0a4a2a', acc: '#ff9a3a', h: 21 }));
  };
  (function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildMykorisExtra(); }; })();

  // ---------- entidades y mecánicas ----------
  // energía micelial: el pulso del nodo corre por la red (abre membranas, retrae la carne fúngica, hace brotar plataformas)
  P.myPulse = function (L, x, y, r, src) {
    for (let ty = Math.floor((y - r) / TSZ); ty <= Math.floor((y + r) / TSZ); ty++) for (let tx = Math.floor((x - r) / TSZ); tx <= Math.floor((x + r) / TSZ); tx++) if (L.tile(tx, ty) === 'T' && P.dist(x, y, tx * TSZ + 8, ty * TSZ + 8) < r) { L.map[ty][tx] = '.'; L.myGrow.push({ tx, ty, t: 420 }); L.parts.burst(tx * TSZ + 8, ty * TSZ + 8, 4, { col: P.pick(['#e07aff', '#5a1a5a']), smin: 0.3, smax: 1.5, g: 0.1 }); if ((tx + ty) % 2 === 0) L.myLinks.push({ x0: x, y0: y + 10, x1: tx * TSZ + 8, y1: ty * TSZ + 8, t: 0 }); }
    for (const e of L.ents) if (e.onPulse && !e.dead && e !== src && P.dist(x, y, e.cx, e.cy) < r * (e.pulseReach || 1)) L.myLinks.push({ x0: x, y0: y + 10, x1: e.cx, y1: e.cy, t: 0 });
    for (let ty = Math.floor((y - r) / TSZ); ty <= Math.floor((y + r) / TSZ); ty++) for (let tx = Math.floor((x - r) / TSZ); tx <= Math.floor((x + r) / TSZ); tx++) if (L.tile(tx, ty) === 'G' && L.tile(tx, ty + 1) !== 'G') L.myLinks.push({ x0: x, y0: y + 10, x1: tx * TSZ + 8, y1: ty * TSZ + 8, t: 0 });
    P.umPulse(L, x, y, r, src, '#5ef0a0');
  };
  // Nodo micelial (Z): se recarga solo; al dispararle envía la energía por el micelio
  P.MycoNode = class extends P.ResonanceCrystal {
    hit() { if (this.charge < 0.3) { P.Audio.sfx('block'); return; } P.myPulse(this.L, this.cx, this.cy, 150 + 130 * this.charge, this); this.charge = 0; this.flash = 8; }
    draw(c, cx, cy) { const x = Math.round(this.x - cx), y = Math.round(this.y - cy), full = this.charge >= 1; P.drawGlow(c, x + 8, y + 14, 18 + this.charge * 24, '#5ef0a0', 0.2 + this.charge * 0.35); P.spr(c, 'rescrys', full ? 2 : this.charge > 0.3 ? 1 : 0, x - 2, y - 2, { flash: this.flash > 0 }); c.fillStyle = '#0a2a1a'; c.fillRect(x, y + 34, 16, 2); c.fillStyle = full ? '#d8ffe0' : '#1aa050'; c.fillRect(x, y + 34, Math.round(16 * this.charge), 2); }
  };
  // Bombaspora (V): se hincha cuando te acercas y te empuja con un soplo; si le disparas, estalla (daña enemigos y rompe costra)
  P.Bombaspora = class extends P.ExplosiveCrystal {
    update() {
      super.update(); if (this.gone > 0 || this.armed > 0) return; const p = this.L.player, d = P.dist(p.cx, p.cy, this.cx, this.cy);
      if (this.inf > 0) { if (--this.inf === 0) { P.Audio.sfx('dash'); const s = Math.sign(p.cx - this.cx) || 1; if (d < 46 && !p.dead) { p.vx = s * 4.5; p.vy = -4.5; } for (let i = 0; i < 14; i++) { const a = Math.random() * 7; this.L.parts.add({ x: this.cx, y: this.cy, vx: Math.cos(a) * 2, vy: Math.sin(a) * 2 - 0.5, life: 40, col: P.pick(['#ff9ad8', '#e03a9a', '#ffffff']), size: 2, fade: true }); } this.cool = 90; } }
      else if ((this.cool = (this.cool || 0) - 1) <= 0 && d < 40) this.inf = 22;
    }
    draw(c, cx, cy) { if (this.gone > 0) return; const x = Math.round(this.x - cx), y = Math.round(this.y - cy); P.drawGlow(c, x + 8, y + 12, this.armed ? 28 : 14, '#ff7ad8', this.armed ? 0.6 : 0.25); P.spr(c, 'excrys', this.armed && (this.armed >> 2) % 2 === 0 ? 2 : this.inf > 0 ? 1 : 0, x + (this.armed || this.inf > 0 ? P.ri(-1, 1) : 0), y); }
  };
  // Nube de esporas (O): niebla que ciega (salvo con Coraza Fúngica) o esporas doradas que hacen florecer pétalos ocultos
  P.SporeCloud = class extends P.Ent {
    constructor(L, x, y, m) { super(L, x - 30, y - 60, 60, 60); this.reveal = L.markers.some(k => k.c === 'J' && Math.abs(k.x - m.x) < 14) && !L.markers.some(k => k.c === 'Z' && Math.abs(k.x - m.x) < 14); }
    update() {
      this.t++; const L = this.L, p = L.player, inside = !p.dead && P.overlap(this, p);
      if (this.t % 4 === 0) L.parts.add({ x: this.cx + P.rand(-28, 28), y: this.y + this.h - P.rand(0, 20), vx: P.rand(-0.2, 0.2), vy: -P.rand(0.2, 0.6), life: 80, col: this.reveal ? P.pick(['#ffe08a', '#fff4c0', '#ffd060']) : P.pick(['#6a8a7a', '#4a6a5a', '#8aa898']), size: 2, glow: this.reveal ? 3 : 0, fade: true });
      if (!inside) return;
      if (this.reveal) { for (const e of L.ents) if (e instanceof P.PhasePlatform && P.dist(this.cx, this.cy, e.cx, e.cy) < 260) e.onPulse(); if (!L.myRevealTip) { L.myRevealTip = true; P.toast('Las esporas doradas hacen florecer pétalos ocultos', { col: '#ffe08a', life: 160 }); } }
      else { L.myFogT = 40; if (!L.myFogTip) { L.myFogTip = true; P.toast('Niebla de esporas: apenas se ve. Busca la luz de las setas.', { col: '#9ad8c0', life: 160 }); } }
    }
    draw(c, cx, cy) { const x = Math.round(this.cx - cx), y = Math.round(this.cy - cy), g = c.createRadialGradient(x, y + 10, 4, x, y + 10, 40); g.addColorStop(0, this.reveal ? 'rgba(255,220,120,0.32)' : 'rgba(120,150,130,0.4)'); g.addColorStop(1, 'rgba(120,150,130,0)'); c.fillStyle = g; c.fillRect(x - 40, y - 30, 80, 80); }
  };
  // Plataforma-pétalo (J): flor que se abre y se cierra a su ritmo; junto a un nodo o a esporas doradas solo florece cuando la activan
  P.PetalPlatform = class extends P.PhasePlatform {
    constructor(L, x, y, m) { super(L, x, y, m); if (!this.pulseMode && L.markers.some(k => k.c === 'O' && Math.abs(k.x - m.x) < 14)) { this.pulseMode = true; this.set(false); } }
    draw(c, cx, cy) {
      const x = Math.round(this.x - cx), y = Math.round(this.y - cy);
      if (!this.on) { c.globalAlpha = 0.5; for (let k = 0; k < 3; k++) P.spr(c, 't_phase', 1, x + k * TSZ, y); c.globalAlpha = 1; return; }
      if (this.warn() && (this.t >> 2) % 2) c.globalAlpha = 0.5;
      P.drawGlow(c, x + 24, y + 4, 24, '#e07aff', 0.35); for (let k = 0; k < 3; k++) P.spr(c, 't_phase', 0, x + k * TSZ, y); c.globalAlpha = 1;
    }
  };
  // Seta faro (Q): abre sus láminas luminosas y suelta esporas cuando te acercas
  P.ShroomBeacon = class extends P.CrystalColumn {
    constructor(L, x, y) { super(L, x, y); this.species = 'seta_faro'; }
    update() { P.Decor.prototype.update.call(this); const p = this.L.player; this.near += ((Math.abs(p.cx - this.cx) < 70 ? 1 : 0) - this.near) * 0.05; const Z = zone(this.L); if (this.t % (this.near > 0.5 ? 4 : 16) === 0) this.L.parts.add({ x: this.cx + P.rand(-18, 18), y: this.y + 12, vy: P.rand(0.1, 0.4), vx: P.rand(-0.15, 0.15), life: 90, col: this.L.restoredAt(this.cx) ? P.pick([Z[0], Z[1], '#ffffff']) : '#8a8098', size: 1, glow: 3 }); }
    umLight() { return [this.cx, this.y + 14, (this.L.restoredAt(this.cx) ? 86 : 52) + this.pulse() * 26, 0.95]; }
    draw(c, cx, cy) { const on = this.L.restoredAt(this.cx), x = Math.round(this.x - cx), y = Math.round(this.y - cy), k = this.pulse(), Z = zone(this.L); P.drawGlow(c, x + 20, y + 12, 40 + k * 18, on ? Z[0] : '#7a6a8a', 0.2 + k * 0.2); P.spr(c, 'column', on ? 1 : 0, x, y); if (this.near > 0.3) P.drawGlow(c, x + 20, y + 16, 24, '#ffffff', this.near * 0.25); }
  };
  // Seta resorte gigante (Y): al caer sobre ella te lanza muy alto
  P.SpringShroom = class extends P.Ent {
    constructor(L, x, y) { super(L, x - 16, y - 20, 32, 20); this.sq = 0; }
    update() { this.t++; if (this.sq > 0) this.sq--; const p = this.L.player; if (!p.dead && p.vy > 0.5 && p.x + p.w > this.x + 3 && p.x < this.x + this.w - 3 && p.y + p.h >= this.y + 2 && p.y + p.h <= this.y + 12) { p.y = this.y + 2 - p.h; p.vy = p.st && p.st.resorte ? -13.5 : -11.5; p.usedDouble = false; this.sq = 14; P.Audio.sfx('djump'); this.L.parts.burst(this.cx, this.y + 4, 10, { col: P.pick(['#ff9ad8', '#ffffff', '#e03a9a']), smin: 0.5, smax: 2 }); } }
    umLight() { return [this.cx, this.y + 8, 40, 0.7]; }
    draw(c, cx, cy) { const x = Math.round(this.x - cx), y = Math.round(this.y - cy); P.drawGlow(c, x + 16, y + 8, 22, '#ff7ad8', 0.3); P.spr(c, 'spring', this.sq > 8 ? 1 : this.sq > 0 ? 2 : 0, x, y - 4); }
  };
  // Camuflongo (W): parece una seta; cuando te acercas abre la boca y salta
  P.Camuflongo = class extends P.Enemy {
    constructor(L, x, y) { super(L, x - 8, y - 18, 16, 18, { kind: 'camuflongo', hp: 20, dmg: 12, xp: 9, drops: { bio: 2 }, natural: true, spr: 'wraith' }); this.awake = false; }
    update() {
      if (this.commonUpdate()) { this.gravityMove(); return; }
      const p = this.L.player, d = P.dist(this.cx, this.cy, p.cx, p.cy);
      if (!this.awake) { if (d < 50 && !this.passive) { this.awake = true; this.face = p.cx > this.cx ? 1 : -1; this.vy = -4.2; this.vx = this.face * 2.4; P.Audio.sfx('roar'); } }
      else { if (this.onGround) { this.vx *= 0.8; if (this.t % 60 === 0 && d < 160) { this.face = p.cx > this.cx ? 1 : -1; this.vy = -3.6; this.vx = this.face * 2; } } }
      this.gravityMove();
    }
    draw(c, cx, cy) { this.drawSpr(c, cx, cy, !this.awake ? 0 : this.onGround ? 1 : 2); }
  };
  // nube que deja el Lanzaesporas
  P.SporePuff = class extends P.Ent {
    constructor(L, x, y, dmg) { super(L, x - 14, y - 14, 28, 28); this.dmg = dmg; this.life = 90; }
    update() { this.t++; if (--this.life <= 0) { this.dead = true; return; } if (this.t % 3 === 0) this.L.parts.add({ x: this.cx + P.rand(-12, 12), y: this.cy + P.rand(-10, 10), vy: -0.2, life: 30, col: P.pick(['#5ef0a0', '#a8ff7a']), size: 2, fade: true }); if (this.t % 20 === 0) for (const e of this.L.ents) if (e.isEnemy && !e.dead && !e.passive && P.overlap(this, e)) e.hit(this.dmg, { x: this.cx, poison: true }); }
    draw(c, cx, cy) { P.drawGlow(c, this.cx - cx, this.cy - cy, 16, '#5ef0a0', 0.3 * this.life / 90); }
  };

  // marcadores reinterpretados en MYKORIS
  const rk = (e, kind) => { e.kind = kind; return e; }, gy = (L, m) => L.snapY(m.x, m.y);
  P.LV.mykoris.spawn = {
    c: (L, x, y) => L.add(rk(new P.Crab(L, x - 9, y, false), 'sporocarpo')),
    K: (L, x, y, m, R) => L.add(R ? rk(new P.Crab(L, x - 9, y, false), 'sporocarpo') : rk(new P.Crab(L, x - 10, y, true), 'sporocarpo_cy')),
    A: (L, x, y, m, R) => { if (!R) L.add(rk(new P.Alpha(L, x - 20, y), 'micoloso')); },
    f: (L, x, y) => L.add(rk(new P.Frog(L, x - 7, y - 11), 'saltahongo')),
    d: (L, x, y) => L.add(rk(new P.Fly(L, x - 8, y - 20, false), 'hifalida')),
    D: (L, x, y, m, R) => { const fac = L.theme === 'facility' || L.theme === 'lab'; if (!R) { const e = L.add(new P.Fly(L, x - 8, y - 20, true)); if (!fac) e.kind = 'hifalida_dron'; } else if (!fac) L.add(rk(new P.Fly(L, x - 8, y - 20, false), 'hifalida')); },
    l: (L, x, y) => L.add(rk(new P.Slug(L, x - 10, y - 8), 'reptamicelio')),
    p: (L, x, y, m, R) => { if (!R) L.add(rk(new P.Maw(L, x - 6, y - 16), 'trampa_laminar')); else L.add(new P.Decor(L, x, y, 'fern_r', 'velohifa')); },
    v: (L, x, y, m) => L.add(rk(new P.VSnake(L, x, m.y * TSZ), 'colgaseta')),
    h: (L, x, y) => { const e = L.add(new P.HealPlant(L, x, y)); e.light = '#ffb070'; },
    Q: (L, x, y, m) => L.add(new P.ShroomBeacon(L, x, gy(L, m))),
    Y: (L, x, y, m) => L.add(new P.SpringShroom(L, x, gy(L, m))),
    Z: (L, x, y, m) => L.add(new P.MycoNode(L, x, gy(L, m))),
    V: (L, x, y, m) => L.add(new P.Bombaspora(L, x, gy(L, m))),
    O: (L, x, y, m) => L.add(new P.SporeCloud(L, x, gy(L, m), m)),
    J: (L, x, y, m) => L.add(new P.PetalPlatform(L, x, y, m)),
    W: (L, x, y, m) => L.add(new P.Camuflongo(L, x, gy(L, m)))
  };
  P.LV.mykoris.overworld.vip = { look: 'ylmira', civ: 'pleyadiano', talk: lib => [['ylmira', lib >= 10 ? 'El bosque entero vuelve a pensar, {N}. Y dicen que el Gran Micóforo flota otra vez sobre los claros.' : 'Cada territorio liberado devuelve la voz a una parte del bosque. El micelio lo nota.']] };

  // ---------- integración con el jugador: Lanzaesporas ----------
  const baseKill = P.Proj.prototype.kill;
  P.Proj.prototype.kill = function (spark) { if (this.spore && !this.sporeDone && !this.dead) { this.sporeDone = true; this.L.add(new P.SporePuff(this.L, this.cx, this.cy, Math.max(2, this.dmg * 0.35))); } return baseKill.call(this, spark); };
})();
