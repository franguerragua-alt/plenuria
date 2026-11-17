'use strict';
// UMBRÉLIA — datos, mecánicas exclusivas (oscuridad, resonancia, cristales explosivos, suelo inestable,
// corrupción, plataformas cristalinas), luz carmesí, arquitectura andromedana y entidades propias.
(function () {
  const D = P.D, T = 'umbrelia', U = P.UMC;
  Object.assign(D.planet(T), { ready: true, lair: 'el Nido de ARACHNARA' });
  Object.assign(D.BOSSES.arachnara, { col: '#ff3a4a', col2: '#ffd8cc' });

  // ---------- armas y mejoras ----------
  D.WEAPONS.esquirla = { name: 'Lanzaesquirlas Umbrío', icon: 'i_shardgun', planet: T, desc: 'Arma andromedana. Dispara un cristal que estalla al impactar en cuatro esquirlas.', dmg: 9, rate: 24, speed: 5.6, spr: 'um_b_orb', shard: true };
  Object.assign(D.UPGRADES, {
    vision: { name: 'Ojo Umbrío', icon: 'i_umbra_eye', kind: 'Movimiento', planet: T, desc: 'Visor andromedano: tu luz llega mucho más lejos en la oscuridad y los umbrátiles se ven siempre.' },
    esquirla: { name: 'Lanzaesquirlas Umbrío', icon: 'i_shardgun', kind: 'ATAQUE', planet: T, desc: 'Nueva arma: un cristal que estalla en esquirlas al impactar. Cambia de arma con ' },
    obsidiana: { name: 'Piel de Obsidiana', icon: 'i_obsidian', kind: 'DEFENSA', planet: T, desc: 'La corrupción ya no te afecta y el suelo inestable tarda el doble en romperse.' },
    eclipse: { name: 'Corazón del Eclipse', icon: 'i_eclipse', kind: 'SUPERATAQUE', planet: T, desc: 'Núcleo arrancado de ARACHNARA. El Pulso Solar lanza una corona de doce esquirlas de cristal.' }
  });
  D.RECIPES.push({ id: 'esquirla_mk2', name: 'Lanzaesquirlas Mk II', desc: '+30 % de daño del Lanzaesquirlas Umbrío.', cost: { scrap: 16, crys: 4 }, req: [], needUp: 'esquirla', needNpc: 'kaelun' });

  // ---------- Archivo Biológico ----------
  const sp = o => Object.assign({ planet: T, variant: 'natural' }, o);
  const AR = D.SPECIES.findIndex(s => s.id === 'arachnara'); if (AR >= 0) D.SPECIES.splice(AR, 1);
  D.SPECIES.push(
    sp({ id: 'fractarido', col: 'fauna', spr: 'um_krazith', name: 'Fractárido', sci: 'Crystallopes fractus', rarity: 'común', habitat: 'Llanuras de obsidiana.', behavior: 'Reptador de patas finas con un lomo de cristales. Embiste a quien pisa su territorio.', diet: 'Minerales disueltos.', abilities: 'Su lomo crece un cristal nuevo cada estación.', danger: 2, eco: 'Esparce semillas de cristal al caminar.', lore: 'Los andromedanos leían el tiempo contando sus cristales.', tasks: ['seen', { k: 'defeat', n: 3 }, { k: 'observe', n: 4 }] }),
    sp({ id: 'fractarido_cy', col: 'fauna', spr: 'um_krazith_cy', name: 'Fractárido Cibernético', sci: 'Crystallopes fractus (mod. Thersek)', rarity: 'poco común', variant: 'cibernética', base: 'fractarido', habitat: 'Perímetro de las extractoras.', behavior: 'Centinela blindado que dispara plasma.', diet: 'Energía de los cristales.', abilities: 'Placas de titanio sobre el lomo apagado.', danger: 3, eco: 'Ninguno.', lore: 'Etiqueta: «LOTE U-F. FORJA DE LA PENUMBRA».', tasks: ['seen', { k: 'defeat', n: 6 }] }),
    sp({ id: 'geodonte', col: 'fauna', spr: 'um_krazith_alfa', name: 'Geodonte', sci: 'Geodontus colossus (mutación inducida)', rarity: 'rara', variant: 'mutada', base: 'fractarido', habitat: 'Montes de la Grieta.', behavior: 'Coloso con caparazón de geoda partido. Embiste, salta y dispara esquirlas.', diet: 'Vetas enteras de mineral.', abilities: 'Un núcleo rojo late dentro de su geoda.', danger: 4, eco: 'Abría galerías por las que corría el agua subterránea.', lore: 'Los andromedanos lo llamaban «el que guarda el fuego dentro».', tasks: ['seen', { k: 'defeat', n: 1 }] }),
    sp({ id: 'pulsapodo', col: 'fauna', spr: 'um_frog', name: 'Pulsápodo', sci: 'Saltocrystallus pulsans', rarity: 'común', habitat: 'Bosques de cuarzo.', behavior: 'Saco de cristal que salta y destella al escupir.', diet: 'Luz de los cristales.', abilities: 'Brilla más cuanto más alto salta.', danger: 1, eco: 'Reparte la luz de los cristales grandes.', lore: 'Sus destellos de cortejo iluminan los bosques en la noche larga.', tasks: ['seen', { k: 'defeat', n: 3 }, { k: 'observe', n: 4 }] }),
    sp({ id: 'lucerna', col: 'fauna', spr: 'um_dfly', name: 'Lucerna Umbría', sci: 'Lucerna ocellata', rarity: 'común', habitat: 'Cielos del valle.', behavior: 'Polilla de alas negras con ocelos que brillan. Se lanza contra los intrusos.', diet: 'Polen de cristal.', abilities: 'Sus ocelos dan luz propia.', danger: 1, eco: 'Poliniza las rosas de obsidiana.', lore: 'Un enjambre de lucernas parece un cielo de ojos.', tasks: ['seen', { k: 'observe', n: 3 }] }),
    sp({ id: 'lucerna_dron', col: 'fauna', spr: 'um_dfly_cy', name: 'Lucerna Dron', sci: 'Lucerna ocellata (mod. Thersek)', rarity: 'poco común', variant: 'cibernética', base: 'lucerna', habitat: 'Instalaciones del régimen.', behavior: 'Patrulla y dispara láseres.', diet: 'Batería de cristal.', abilities: 'Ocelos convertidos en lentes.', danger: 2, eco: 'Ninguno.', lore: 'Thersek las llama «mis lamparitas».', tasks: ['seen', { k: 'defeat', n: 5 }] }),
    sp({ id: 'velo_ceniza', col: 'fauna', spr: 'um_slug', name: 'Velo de Ceniza', sci: 'Velum cinereum', rarity: 'común', habitat: 'Suelos de obsidiana.', behavior: 'Criatura plana de sombra con brasas en el lomo. Embiste si la acorralan.', diet: 'Ceniza mineral.', abilities: 'Se confunde con el suelo negro.', danger: 1, eco: 'Pule la obsidiana y deja paso a los cristales jóvenes.', lore: 'Los niños andromedanos jugaban a pisar sus brasas sin quemarse.', tasks: ['seen', { k: 'defeat', n: 2 }, { k: 'restored' }] }),
    sp({ id: 'colgacuarzo', col: 'fauna', spr: 'um_vsnake', name: 'Colgacuarzo', sci: 'Stalactovorus illex', rarity: 'poco común', habitat: 'Techos de las cavernas.', behavior: 'Estalactita viva que se descuelga sobre quien se acerca a su señuelo.', diet: 'Pequeñas criaturas atraídas por la luz.', abilities: 'Señuelo luminoso en la punta.', danger: 2, eco: 'Controla las poblaciones de las cuevas.', lore: 'Un techo con demasiadas estalactitas rojas es mala señal.', tasks: ['seen', { k: 'defeat', n: 2 }] }),
    sp({ id: 'umbratil', col: 'fauna', spr: 'um_wraith', name: 'Umbrátil', sci: 'Umbra errans', rarity: 'poco común', habitat: 'Cavernas sin luz.', behavior: 'Espectro de sombra que solo se deja ver cerca de la luz. Se acerca despacio y atraviesa la roca.', diet: 'Calor.', abilities: 'Invisible en la oscuridad; dos ojos rojos lo delatan.', danger: 3, eco: 'Desconocido. Quizá guarda la memoria de la luz que se fue.', lore: 'Los andromedanos dejaban una geoda encendida en cada puerta para que no entraran.', tasks: ['seen', { k: 'defeat', n: 3 }] }),
    sp({ id: 'pacevidrio', col: 'fauna', spr: 'um_grazer', name: 'Pacevidrio', sci: 'Vitripes mansuetus', rarity: 'rara', restoredOnly: true, habitat: 'Llanuras restauradas.', behavior: 'Zancudo pacífico que pasta entre los cristales.', diet: 'Musgo de ascuas.', abilities: 'Astas de cristal que suenan al chocar.', danger: 0, eco: 'Sus astas caídas se convierten en nuevos cristales.', lore: 'Un pacevidrio en la llanura anuncia que la luz ha vuelto.', tasks: ['seen', { k: 'observe', n: 5 }] }),
    sp({ id: 'coronalux', col: 'fauna', spr: 'um_vellorn', name: 'Corona Lumínica', sci: 'Lucicorona aeterna', rarity: 'legendaria', restoredOnly: true, habitat: 'Solo aparece en una UMBRÉLIA completamente restaurada.', behavior: 'Medusa de cristal que flota sobre el valle como un segundo sol.', diet: 'Resonancia de los cristales.', abilities: 'Ilumina el valle entero.', danger: 0, eco: 'Se dice que fue la primera luz del planeta.', lore: 'Los andromedanos la llamaban «el sol que no se apaga».', tasks: ['seen', { k: 'observe', n: 6 }] }),
    sp({ id: 'arachnara', col: 'fauna', spr: 'arachnara', boss: true, name: 'ARACHNARA', title: 'Madre Arácnida Roja', sci: 'Arachnocrystallis mater (mod. Thersek)', rarity: 'única', variant: 'cibernética', habitat: 'Nido de ARACHNARA.', behavior: 'Tejía redes de luz entre los cristales para guardar el calor del planeta. Thersek le dio hambre.', diet: 'Energía de los cristales.', abilities: 'Patas de cristal, hilos de luz, crías y lluvia de esquirlas.', danger: 5, eco: 'Sus redes conservaban la luz durante la noche larga.', lore: 'Las madres andromedanas cantaban a ARACHNARA para que tejiera sobre las cunas.', tasks: ['seen', { k: 'defeat', n: 1 }] }),
    sp({ id: 'farolgeoda', col: 'flora', spr: 'um_lamp', name: 'Farol de Geoda', sci: 'Geodolampas erecta', rarity: 'común', habitat: 'Todo el valle.', behavior: 'Abre su geoda al anochecer y da luz.', diet: 'Minerales y calor.', abilities: 'Ilumina su entorno.', danger: 0, eco: 'Refugio de las lucernas.', lore: 'Las puertas andromedanas tenían siempre un farol al lado.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'brasaluz', col: 'flora', spr: 'um_fern_r', name: 'Brasaluz', sci: 'Pteris ignita', rarity: 'común', habitat: 'Grietas del suelo.', behavior: 'Frondas negras rígidas que terminan en ascuas.', diet: 'Calor del subsuelo.', abilities: 'Sus puntas brillan sin quemar.', danger: 0, eco: 'Marca dónde hay agua caliente bajo la roca.', lore: 'Sus ascuas guiaban a los caminantes en la noche larga.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'ceniciela', col: 'flora', spr: 'um_mush', name: 'Ceniciela', sci: 'Cinerimyces toxicus', rarity: 'poco común', habitat: 'Zonas contaminadas.', behavior: 'Suelta esporas negras al detectar vibraciones.', diet: 'Corrupción.', abilities: 'Esporas irritantes.', danger: 3, eco: 'Absorbe la corrupción del suelo.', lore: 'Los andromedanos la llamaban «la que se come la sombra».', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'umbracaliz', col: 'flora', spr: 'um_bigmush', name: 'Umbracáliz', sci: 'Calyx crystallifer', rarity: 'poco común', habitat: 'Cavernas y bosques de cuarzo.', behavior: 'Cáliz orgánico que crece fusionado con cristales.', diet: 'Luz de los cristales.', abilities: 'Su copa guarda cristales vivos.', danger: 0, eco: 'Une la vida y el mineral.', lore: 'Nadie sabe si es una planta que come cristal o un cristal que aprendió a crecer.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'monolito', col: 'flora', spr: 'um_column', name: 'Monolito Carmesí', sci: 'Crystallus monolithus', rarity: 'común', habitat: 'Llanuras y cavernas.', behavior: 'Organismo cristalino que late con luz propia y reacciona a quien se acerca.', diet: 'Resonancia del suelo.', abilities: 'Ilumina el valle.', danger: 0, eco: 'Es la fuente de luz de todo el planeta.', lore: 'Crece un palmo cada siglo. Los más altos son más viejos que el régimen.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'geoda_resonante', col: 'flora', spr: 'um_t_bulb_r', name: 'Geoda Resonante', sci: 'Geoda resonans', rarity: 'común', habitat: 'Suelos de las cavernas.', behavior: 'Vibra con fuerza al pisarla.', diet: 'Vibraciones.', abilities: 'Impulsa a quien la pisa.', danger: 0, eco: 'Mantiene vivas las galerías.', lore: 'Los niños jugaban a ver quién subía más alto.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'filamina', col: 'flora', spr: 'um_t_vine_r', name: 'Filamina', sci: 'Filum mineralis', rarity: 'común', habitat: 'Paredes de roca.', behavior: 'Hebra mineral que crece hacia el calor.', diet: 'Minerales.', abilities: 'Resiste el peso de un cyborg.', danger: 0, eco: 'Une las rocas sueltas.', lore: 'Las cuerdas andromedanas se trenzaban con filamina.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'espinacristal', col: 'flora', spr: 'um_t_thorn_c', name: 'Espinacristal', sci: 'Acanthocrystallus', rarity: 'común', habitat: 'Fosos y abismos.', behavior: 'Crece en púas donde el suelo se hundió.', diet: 'Minerales.', abilities: 'Púas afiladas.', danger: 2, eco: 'Protege los fosos donde crecen los cristales jóvenes.', lore: 'Cuando la luz vuelve, sus puntas se vuelven rojas.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'fauce_geodica', col: 'flora', spr: 'um_maw', name: 'Fauce Geódica', sci: 'Geodostoma vorax', rarity: 'poco común', variant: 'mutada', habitat: 'Zonas contaminadas.', behavior: 'Geoda carnívora que se abre en dos valvas con dientes de cuarzo.', diet: 'Carnívora.', abilities: 'Escupe semillas de cristal.', danger: 3, eco: 'En su forma natural, guardaba agua dentro.', lore: 'Su forma natural se llamaba «Cántaro de Piedra».', tasks: ['seen', { k: 'defeat', n: 2 }] }),
    sp({ id: 'granatina', col: 'flora', spr: 'um_heal', name: 'Granatina', sci: 'Granatum medicum', rarity: 'poco común', habitat: 'Junto a los monolitos.', behavior: 'Forma bayas de granate llenas de savia.', diet: 'Luz roja.', abilities: 'Repara tejidos y circuitos.', danger: 0, eco: 'Medicina de la fauna herida.', lore: 'Una baya tarda una estación en madurar.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'rosa_obsidiana', col: 'flora', spr: 'um_orchid', name: 'Rosa de Obsidiana', sci: 'Rosa nigra', rarity: 'rara', restoredOnly: true, habitat: 'Territorios liberados.', behavior: 'Abre sus pétalos negros cuando los cristales laten.', diet: 'Resonancia.', abilities: 'Semillas que guardan luz.', danger: 0, eco: 'Alimenta a la Corona Lumínica.', lore: 'Kaelun quiere plantarlas en los Jardines de la nave.', tasks: ['seen', { k: 'scan' }] })
  );
  D.CODEX_REWARDS.umbrelia = {
    fauna: { name: 'Instinto de la Sombra', desc: 'Mod cyborg: +8 % de daño.', mod: 'sombra' },
    flora: { name: 'Savia de Granate', desc: 'Mod cyborg: +15 de salud máxima.', mod: 'granate' },
    all: { name: 'Geoda de la nave + Corona Lumínica', desc: 'Una geoda viva para los Jardines y la legendaria Corona Lumínica se traslada a la nave.', creature: 'coronalux' }
  };
  Object.assign(D.MISSIONS, {
    s_ecos_u: { count: d => ['h33', 'h34', 'h35', 'h36', 'h37', 'h38', 'h39', 'h40'].filter(h => d.holos[h]).length, name: 'Ecos de la penumbra', giver: 'ELARA', desc: 'Recupera los 8 registros holográficos ocultos en UMBRÉLIA.', goal: 8, reward: { xp: 280, crys: 3 } },
    s_kaelun: { name: 'El guardián de los cristales', giver: 'ELARA', desc: 'Un andromedano está prisionero en el Bosque de Cuarzo Rojo.', goal: 1, reward: { xp: 150 } },
    s_nova: { name: 'El Refugio Secreto', giver: 'Kaelun', desc: 'Recarga los cristales de la cámara del Refugio Secreto para abrir la cápsula de N-0.', goal: 1, reward: { xp: 240, crys: 3 } },
    s_rosas_u: { count: d => d.seeds_s_rosas_u || 0, name: 'Rosas de obsidiana', giver: 'Kaelun', desc: 'Kaelun necesita 5 semillas de Rosa de Obsidiana. Solo brotan en territorios liberados de UMBRÉLIA.', goal: 5, reward: { xp: 200, crys: 4 } }
  });
  D.ACHIEVEMENTS.push({ id: 'arachnara', name: 'Tejedora caída', desc: 'Derrota a ARACHNARA.' }, { id: 'lib_umbrelia', name: 'Los cristales laten', desc: 'Libera los 10 territorios de UMBRÉLIA.' }, { id: 'nova_found', name: 'N-0', desc: 'Despierta a NOVA en el Refugio Secreto.' });
  Object.assign(D.HOLOS, {
    h33: { title: 'Bitácora de Kaelun · La luz', text: 'El régimen eclipsó nuestro sol con una pantalla orbital. Desde entonces solo los cristales nos dan luz… y ahora también se la llevan.' },
    h34: { title: 'Orden Esquelética 588 · Gerselle', text: 'Los cristales de UMBRÉLIA almacenan energía mejor que cualquier batería. Drénenlos. Que el planeta se quede a oscuras.' },
    h35: { title: 'Inscripción de los puentes', text: '«Cruza cuando el cristal cante. Espera cuando calle. El abismo no tiene prisa; tú tampoco.»' },
    h36: { title: 'Informe geológico andromedano', text: 'La obsidiana fina de los montes se rompe bajo cualquier peso. Volverá a crecer, pero no esperes que te sostenga dos veces.' },
    h37: { title: 'Registro del refugio · N-0', text: '«Unidad N-0 en estasis voluntaria. Si alguien me despierta, que sea Siete. Si no es Siete… que se vaya.»' },
    h38: { title: 'Canción de la resonancia', text: '«Cristal que flota, cristal que canta; la luz se esconde, la luz levanta. Cuando la madre teja otra vez, el sol eclipsado volverá a nacer.»' },
    h39: { title: "Crónica de Vel'Umbra", text: 'Nuestra capital no cayó: se volvió mineral. Los cristales la cubrieron para protegerla del régimen. Siguen esperando.' },
    h40: { title: 'Bitácora de Thersek · Proyecto A', text: 'La tejedora produce hilos que conducen la luz. Con un buen implante, cada hilo será un cable hacia la Esfera.' }
  });
  Object.assign(D.MEMORIES, {
    m10: { title: 'Fragmento de memoria · N-0', text: 'Una cyborg rosa te tiende la mano en un hangar a oscuras: «Si un día no me encuentras, búscame donde el sol no llega».' },
    m11: { title: 'Fragmento de memoria · El eclipse', text: 'Desde la órbita ves cómo la pantalla del régimen tapa el sol de UMBRÉLIA. N-0 susurra: «La Esfera necesita la luz de todos. Por eso apaga a los mundos».' }
  });
  D.BOSS_OUTRO.arachnara = { up: 'eclipse', skin: 'umbria', mem: 'm11', lines: [['elara', 'ARACHNARA se detiene. El implante de Thersek se ha fundido.'], ['kaelun', 'Mírala, {N}… vuelve a tejer. Hilos de luz otra vez, entre los cristales.'], ['elara', 'He extraído un núcleo de eclipse del implante. Tu Pulso Solar lanzará una corona de esquirlas.'], ['hero', 'Otra pieza de ALBA. Y esta vez, N-0 está con nosotros.'], ['elara', 'Cinco de nueve. Integrando… ahora.']] };
  D.POST_BOSS.arachnara = [['thersek', '¡Mi tejedora! Esos hilos iban a cablear media Esfera, K-7.'], ['gerselle', 'Y la unidad N-0 despierta. Merek no va a estar contento.'], ['merek', 'Cinco mundos. Y has recuperado a N-0. Disfrútalo, {N}: os quedan cuatro mundos para perderla otra vez.'], ['elara', 'Transmisión cortada. La siguiente ruta aún no está abierta. Descansa, {N}. NOVA ya monta guardia.']];
  D.FIRST_CLEAR = D.FIRST_CLEAR || {};
  D.FIRST_CLEAR.umbrelia = (S, id) => { if (id === 1) { S.startMission('s_ecos_u'); S.startMission('s_kaelun'); } if (S.liberated(T) >= 10) S.ach('lib_umbrelia'); if (id === 11) S.ach('arachnara'); };
  D.RESCUE = D.RESCUE || {};
  D.RESCUE.kaelun = { name: 'Kaelun', mission: 's_kaelun', lines: [['kaelun', 'Una luz roja que camina… No, es un cyborg. Con el sello de la República.'], ['kaelun', 'Soy Kaelun, guardián de los cristales de Vel\'Umbra. Me encerraron por esconder los cristales de resonancia.'], ['hero', 'Soy {N}. Vengo a devolverle la luz a UMBRÉLIA.'], ['kaelun', 'Entonces debes saber algo: en las montañas hay un refugio que no es nuestro. Dentro duerme una de los tuyos.'], ['elara', 'Teletransporte preparado. Bienvenido a bordo, Kaelun.']],
    onRescue: S => { S.startMission('s_nova'); S.startMission('s_rosas_u'); },
    ship: { room: 'civs', off: 150, talk: S => [['kaelun', S.data.comps.unlocked.nova ? 'NOVA no deja de mirar por la ventana. Dice que echaba de menos las estrellas.' : 'El Refugio Secreto está en los montes. Recarga los cristales de la cámara para abrir la cápsula.'], ['kaelun', 'Semillas de Rosa de Obsidiana: ' + (S.data.seeds_s_rosas_u || 0) + '/5.']] } };
  P.SPEAKERS.kaelun = { name: 'Kaelun', por: 'por_kaelun', col: '#ff8a7a' };
  P.D.VILLAGER_LINES.andromedano.push('Los cristales vuelven a latir. Esta noche dormiremos con luz.', 'Mi farol de geoda se ha abierto solo. Gracias, viajero.', "Vel'Umbra sigue bajo los cristales. Algún día la despertaremos.");

  // ---------- música (grave, lenta, con campanas de cristal) ----------
  Object.assign(P.Audio.TRACKS, {
    umbrelia: { bpm: 70, root: 45, scale: [0, 1, 3, 5, 7, 8, 10], prog: [0, 5, 3, 4], lead: 'triangle', bass: 'sawtooth', arp: 'sine', drums: 1, pad: true, seed: 517, marimba: true },
    umbrelia_r: { bpm: 76, root: 45, scale: [0, 2, 3, 5, 7, 8, 10], prog: [0, 3, 5, 4], lead: 'sine', bass: 'triangle', arp: 'sine', drums: 1, pad: true, seed: 517, marimba: true },
    umbrelia_ow: { bpm: 82, root: 47, scale: [0, 2, 3, 5, 7, 8, 11], prog: [0, 5, 6, 4], lead: 'triangle', bass: 'sine', arp: 'triangle', drums: 0, pad: true, seed: 523 }
  });

  // ---------- luz y ambiente ----------
  P.FX.GR.umbrelia = { bloomMul: 1.15, day: ['#ff6a5a', '#0a0414', 0.3], golden: ['#ff8a5a', '#140612', 0.3], dusk: ['#ff4a5a', '#04040e', 0.34], cave: ['#ff4a4a', '#06020a', 0.34], deep: ['#ff4a5a', '#04020a', 0.34], sun: [330, 46], fog: '#6a7aa0', rays: '255,90,90' };
  const TSZ = 16;
  // zonas de oscuridad absoluta: columnas de los chunks «um_dark_*»
  const darkAt = (L, px) => { for (const [a, b] of L.umDark || []) if (px >= a && px < b) return true; return false; };
  Object.assign(P.ART.umbrelia, {
    seedMission: 's_rosas_u', seedName: 'Semilla de Rosa de Obsidiana', holoMission: 's_ecos_u',
    civs: ['andromedano', 'andromedano', 'arturiano', 'andromedano', 'pleyadiano'], rigidTrees: [0, 1], treeVariants: [0, 0, 1],
    stone: ['#1e1924', '#2c2434', '#0c0a10', '#ff2a3a', '#ff9a4a'],
    strata: ['rgba(255,40,60,0.05)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.18)', 'rgba(0,0,0,0)', 'rgba(255,120,60,0.04)', 'rgba(0,0,0,0.12)'],
    postMap(L) {
      L.umDark = []; L.umCr = {}; L.umBroken = [];
      const rows = L.def.rows || []; for (const row of rows) row.forEach((ch, i) => { if ((P.UM_DARK || []).includes(ch)) L.umDark.push([i * 24 * TSZ, (i + 1) * 24 * TSZ]); });
    },
    ambient(L, cx, cy, rf) {
      if (L.theme === 'facility' || L.theme === 'lab') return false;
      // ceniza que flota y motas rojas que se desprenden de los cristales
      if (L.t % 4 === 0) L.parts.add({ x: cx + P.rand(0, P.W), y: cy + P.rand(0, P.H), vx: P.rand(-0.15, 0.15), vy: P.rand(-0.25, -0.05), life: P.ri(80, 150), col: Math.random() < 0.35 + rf * 0.4 ? P.pick(['#ff4a5a', '#ff8a5a', '#c8142a']) : P.pick(['#3a3046', '#5a4a66']), size: 1, glow: Math.random() < 0.5 ? 3 : 0 });
      return true;
    },
    // oscuridad: dentro de una zona oscura la luz ambiente casi desaparece (solo quedan tu luz y la de los cristales)
    lightAmb(L, amb, rf) {
      if (L.darkK < 0.02) return amb;
      const base = amb ? parseFloat(amb.split(',')[3]) : 0, a = base + (0.9 - base) * L.darkK;
      return 'rgba(3,1,6,' + a.toFixed(3) + ')';
    },
    lights(L, cx, cy) {
      const p = L.player; if (p.st && p.st.vision) P.Light.add(p.cx - cx, p.cy - cy, 150, 0.9);
      for (const e of L.ents) if (e.umLight && !e.dead && e.onScreen(80)) { const l = e.umLight(); if (l) P.Light.add(l[0] - cx, l[1] - cy, l[2], l[3]); }
      for (const f of L.fx) if (f.k === 'ring' && f.um) P.Light.add(f.x - cx, f.y - cy, f.r * 1.2, 1 - f.t / f.life);
    },
    // teselas propias: suelo inestable (T), barrera de cristal (G); las plataformas (j) las dibuja su entidad
    drawTile(L, c, ch, X, Y, tx, ty, st) {
      if (ch === 'T') { const v = L.umCr[tx + ',' + ty] || 0, f = v > 30 ? 2 : v > 10 ? 1 : 0; P.spr(c, 't_unstable', f, X + (f === 2 ? P.ri(-1, 1) : 0), Y); if (f) P.drawGlow(c, X + 8, Y + 4, 10, '#ff4a3a', f * 0.15); }
      else if (ch === 'G') { P.spr(c, 't_gate', (tx + ty) % 2, X, Y); if ((tx + ty + (L.t >> 4)) % 3 === 0) P.drawGlow(c, X + 8, Y + 8, 12, '#ff3a4a', 0.35); }
    },
    levelUpdate(L) {
      const p = L.player, st = p.st || {};
      L.darkK = (L.darkK || 0) + ((darkAt(L, p.cx) ? 1 : 0) - (L.darkK || 0)) * 0.06;
      // suelo inestable: se agrieta mientras lo pisas, se rompe y vuelve a crecer
      if (p.onGround && !p.dead) { const ty = Math.floor((p.y + p.h + 1) / TSZ); for (let tx = Math.floor(p.x / TSZ); tx <= Math.floor((p.x + p.w - 1) / TSZ); tx++) if (L.tile(tx, ty) === 'T') { const k = tx + ',' + ty; L.umCr[k] = (L.umCr[k] || 0) + (st.obsidiana ? 0.5 : 1); if (L.t % 6 === 0) L.parts.add({ x: tx * TSZ + P.rand(2, 14), y: ty * TSZ + 14, vy: P.rand(0.3, 1), life: 30, col: P.pick(['#2c2434', '#ff4a3a']), size: 1 }); } }
      for (const k in L.umCr) if (L.umCr[k] >= 44) {
        const [tx, ty] = k.split(',').map(Number); delete L.umCr[k]; if (L.tile(tx, ty) !== 'T') continue;
        L.map[ty][tx] = '.'; L.umBroken.push({ tx, ty, t: 330 }); P.Audio.sfx('break');
        L.parts.burst(tx * TSZ + 8, ty * TSZ + 8, 10, { col: '#2c2434', smin: 1, smax: 3, g: 0.25, size: 2 }); L.parts.burst(tx * TSZ + 8, ty * TSZ + 4, 4, { col: '#ff4a3a', smin: 0.5, smax: 2, glow: 3 });
      }
      for (const b of L.umBroken) if (--b.t <= 0) { const box = { x: b.tx * TSZ, y: b.ty * TSZ, w: TSZ, h: TSZ }; if (!P.overlap(box, p) && !L.ents.some(e => e.isEnemy && !e.dead && P.overlap(box, e))) { L.map[b.ty][b.tx] = 'T'; b.done = true; L.parts.burst(b.tx * TSZ + 8, b.ty * TSZ + 8, 6, { col: '#5a2a3a', smin: 0.3, smax: 1 }); } else b.t = 20; }
      L.umBroken = L.umBroken.filter(b => !b.done);
    },
    // fuera de una zona oscura se ve oscura desde lejos; reflejos rojos sobre el suelo negro junto a los cristales
    levelDraw(L, c) {
      const cx = Math.round(L.cam.x), k = 1 - (L.darkK || 0);
      if (k > 0.02) for (const [a, b] of L.umDark || []) { const x0 = a - cx, x1 = b - cx; if (x1 < 0 || x0 > P.W) continue; const g = c.createLinearGradient(x0, 0, x0 + 48, 0); g.addColorStop(0, 'rgba(3,1,6,0)'); g.addColorStop(1, 'rgba(3,1,6,' + (0.72 * k) + ')'); c.fillStyle = g; c.fillRect(x0, 0, 48, P.H); c.fillStyle = 'rgba(3,1,6,' + (0.72 * k) + ')'; c.fillRect(x0 + 48, 0, x1 - x0 - 96, P.H); const g2 = c.createLinearGradient(x1 - 48, 0, x1, 0); g2.addColorStop(0, 'rgba(3,1,6,' + (0.72 * k) + ')'); g2.addColorStop(1, 'rgba(3,1,6,0)'); c.fillStyle = g2; c.fillRect(x1 - 48, 0, 48, P.H); }
    },
    owDraw(sc, c, cx, cy) {
      // destellos en las grietas y los cristales del valle
      for (let i = 0; i < 14; i++) { const x = (i * 131 + 17) % P.W, y = (i * 71 + 29) % P.H, a = (Math.sin(sc.t * 0.04 + i) + 1) / 2; if (a > 0.7) { c.fillStyle = 'rgba(255,90,90,' + (a - 0.6) + ')'; c.fillRect(x, y, 1, 1); } }
    }
  });

  // ---------- hitos lejanos, atrezo y arquitectura andromedana ----------
  (function () {
    const cache = {}, HZ = 'rgba(40,40,70,0.35)', mk = (key, w, h, fn) => () => { if (cache[key]) return cache[key]; const p = new P.Painter(w, h); fn(p, P.RNG(P.hash(key))); const cv = p.canvas(), x = cv.getContext('2d'); x.globalCompositeOperation = 'source-atop'; x.fillStyle = HZ; x.fillRect(0, 0, w, h); return (cache[key] = cv); };
    const B = ['#06050a', '#0e0b12', '#16121c'];
    P.LANDMARKS.umbrelia = [
      // aguja de cristal colosal
      mk('lu0', 120, 170, (p, r) => { p.sell(60, 168, 40, 6, B); P.Sprites.umCrystal(p, 60, 168, 22, 160, U.r, 0.02); P.Sprites.umCrystal(p, 38, 168, 10, 70, U.r, -0.12); P.Sprites.umCrystal(p, 84, 168, 12, 90, U.r, 0.12); }),
      // arco imposible con un cristal flotando en el centro
      mk('lu1', 180, 130, (p, r) => { for (let k = 0; k <= 40; k++) { const a = Math.PI * k / 40; p.thick(90 - Math.cos(a) * 70, 130 - Math.sin(a) * 110, 90 - Math.cos(a) * 70, 130 - Math.sin(a) * 110, 12, B[1]); } P.Sprites.umCrystal(p, 90, 70, 10, 26, U.r, 0); }),
      // templo andromedano escalonado medio tragado por cristales
      mk('lu2', 160, 110, (p, r) => { for (let k = 0; k < 5; k++) p.rect(20 + k * 12, 110 - (k + 1) * 16, 120 - k * 24, 16, B[(k % 2) + 1]); p.rect(74, 26, 12, 14, '#2a0610'); P.Sprites.umCluster(p, 30, 110, 1, U.r, r, 4); P.Sprites.umCluster(p, 130, 110, 0.9, U.g, r, 3); }),
      // rocas suspendidas en el aire con cristales colgando
      mk('lu3', 170, 120, (p, r) => { for (const [x, y, w] of [[40, 30, 26], [110, 50, 34], [70, 86, 20]]) { p.tri(x - w, y, x + w, y, x + 4, y + w * 1.2, B[1]); p.rect(x - w, y - 4, w * 2, 5, B[2]); P.Sprites.umCrystal(p, x - 6, y - 4, 5, 14, U.r, -0.05); } })
    ];
    P.PROPS.umbrelia = ['pu_shard', 'pu_obelisk', 'pu_bones', 'pu_geode'];
    Object.assign(P.PROP_LIGHT, { pu_shard: '#ff3a4a', pu_geode: '#ff6a3a' });
  })();
  P.ARCH.umbrelia = { civ: 'andromedano', types: ['house', 'special', 'hut', 'shop', 'tower'], extra: [[-10, -1, 'lab'], [9, -1, 'hut'], [-4, 4, 'hut']] };
  P.Sprites.buildUmbreliaExtra = function () {
    const O = { up: 0.1, down: 0.15 }, B = ['#06050a', '#0e0b12', '#16121c', '#241e2e', '#3a3046'];
    P.mk('pu_shard', 14, 18, 2, (p, f) => { P.Sprites.umCrystal(p, 7, 18, 6, 16, f ? U.r : U.c, 0.05); P.Sprites.umCrystal(p, 3, 18, 3, 7, f ? U.r : U.c, -0.2); }, O);
    P.mk('pu_obelisk', 12, 28, 2, (p, f) => { for (let y = 4; y < 28; y++) { const w = 3 + y / 9; p.rect(6 - w, y, w * 2, 1, B[(y >> 2) % 2 ? 2 : 3]); } p.tri(3, 4, 9, 4, 6, 0, B[3]); for (const y of [10, 16, 22]) p.px(6, y, f ? '#ff2a3a' : '#3a1a24'); }, O);
    P.mk('pu_bones', 22, 10, 2, (p, f) => { p.thick(2, 8, 20, 6, 2, f ? '#3a3046' : '#241e2e'); for (let k = 0; k < 4; k++) p.line(5 + k * 4, 7, 4 + k * 4, 2, f ? '#4a4058' : '#2c2434'); if (f) p.px(18, 5, '#ff4a5a'); }, O);
    P.mk('pu_geode', 16, 12, 2, (p, f) => { p.sell(8, 8, 7, 4.5, [B[0], B[2], B[3]]); p.ell(8, 7, 4, 2.4, f ? '#c8142a' : '#2a1030'); for (let k = 0; k < 3; k++) p.px(6 + k * 2, 6, f ? '#ffd8cc' : '#5a2a6a'); }, O);
    // arquitectura andromedana: torre de cristal, casa angular fusionada con cristal, templo escalonado,
    // bajada subterránea, mercado bajo dosel de cristal y cámara de energía (investigación)
    const W = (p, x, y, w, h, lit) => { p.rect(x, y, w, h, lit ? '#ff4450' : '#140e18'); if (lit) p.px(x, y, '#ffd8cc'); };
    const TT = (type, f) => p => {
      const lit = f === 1, C = lit ? U.r : U.c;
      if (type === 'hut') { p.sell(15, 26, 14, 8, [B[0], B[1], B[2], B[3]]); p.rect(9, 18, 12, 12, '#050407'); for (let k = 0; k < 4; k++) p.rect(10 + k, 20 + k * 2, 10 - k * 2, 1, B[3]); p.ell(15, 22, 4, 2, lit ? '#c8142a' : '#2a1030'); P.Sprites.umCrystal(p, 4, 26, 3, 9, C, -0.2); P.Sprites.umCrystal(p, 26, 26, 3, 11, C, 0.2); }
      if (type === 'house') { p.tri(2, 46, 42, 46, 14, 8, B[2]); p.tri(14, 8, 42, 46, 30, 18, B[1]); p.tri(30, 18, 42, 46, 42, 30, B[0]); P.Sprites.umCrystal(p, 26, 22, 7, 24, C, 0.12); P.Sprites.umCrystal(p, 34, 26, 4, 12, C, 0.25); W(p, 10, 32, 4, 5, lit); p.rect(16, 36, 7, 10, '#050407'); p.px(19, 34, lit ? '#ff9a4a' : '#3a1a24'); }
      if (type === 'tower') { for (let y = 16; y < 62; y++) { const w = 5 + (y - 16) / 10; p.rect(14 - w, y, w * 2, 1, B[(y >> 3) % 2 ? 1 : 2]); p.px(14 - w, y, B[3]); } P.Sprites.umCrystal(p, 14, 18, 9, 18, C, 0); for (let k = 0; k < 3; k++) { const a = k / 3 * 6.28 + 0.5; P.Sprites.umCrystal(p, 14 + Math.cos(a) * 11, 12 + Math.sin(a) * 3, 3, 6, C, 0); } W(p, 12, 30, 4, 4, lit); W(p, 12, 44, 4, 4, lit); p.rect(11, 54, 6, 8, '#050407'); }
      if (type === 'shop') { p.rect(2, 26, 42, 10, B[2]); p.rect(2, 26, 42, 1, B[3]); for (let i = 0; i < 3; i++) { const x = 4 + i * 14; p.rect(x, 10, 1, 16, B[3]); p.rect(x + 11, 10, 1, 16, B[3]); p.tri(x - 1, 11, x + 13, 11, x + 6, 3, lit ? ['#c8142a', '#ff6a3a', '#7a0a20'][i] : '#2a1a2a'); } for (const x of [9, 23, 37]) P.Sprites.umCrystal(p, x, 26, 4, 6, C, 0); }
      if (type === 'lab') { p.rect(4, 14, 40, 30, B[1]); p.rect(4, 14, 40, 2, B[3]); p.rect(18, 6, 12, 38, B[2]); p.rect(20, 10, 8, 30, '#050407'); for (let y = 12; y < 38; y += 3) p.rect(21, y, 6, 1, lit ? (y % 6 ? '#c8142a' : '#ff6a3a') : '#2a1030'); p.ell(24, 24, 5, 5, lit ? '#ff4450' : '#3a1030'); p.px(23, 23, lit ? '#ffffff' : '#5a2a6a'); for (const x of [8, 36]) { p.rect(x, 18, 4, 26, '#3a4258'); p.rect(x, 20, 4, 1, '#7a86a4'); } p.line(12, 22, 18, 22, '#7a86a4'); p.line(30, 22, 36, 22, '#7a86a4'); }
      if (type === 'special') { for (let k = 0; k < 4; k++) p.rect(4 + k * 5, 50 - (k + 1) * 8, 36 - k * 10, 8, B[(k % 2) + 1]); p.rect(19, 22, 6, 8, '#050407'); P.Sprites.umCrystal(p, 22, 14, 8, 12, C, 0); p.ell(22, 6, 4, 1.5, lit ? 'rgba(255,90,90,0.6)' : '#2a1030'); for (const x of [6, 38]) p.px(x, 44, lit ? '#ff4450' : '#3a1a24'); }
    };
    for (const t in P.ARCH_SIZE) P.mk('um_b_' + t, P.ARCH_SIZE[t][0], P.ARCH_SIZE[t][1], 2, (p, f) => TT(t, f)(p), { up: 0.1, down: 0.16, dark: 0.5 });
    // cristales interactivos y cápsula de NOVA
    P.mk('um_column', 40, 96, 2, (p, f) => { const r = P.RNG(1301 + f); p.sell(20, 94, 18, 3, [B[0], B[1], B[2]]); P.Sprites.umCrystal(p, 20, 94, 12, 90, f ? U.r : U.c, 0.02); P.Sprites.umCrystal(p, 9, 94, 6, 40, f ? U.r : U.c, -0.12); P.Sprites.umCrystal(p, 31, 94, 7, 52, f ? U.r : U.c, 0.1); });
    P.mk('um_rescrys', 20, 34, 3, (p, f) => { p.sell(10, 32, 9, 3, [B[0], B[2], B[3]]); const C = f === 0 ? U.c : f === 1 ? U.g : U.o; P.Sprites.umCrystal(p, 10, 32, 9, 30, C, 0); for (let k = 0; k < 3; k++) p.px(5 + k * 5, 31, '#3a4258'); p.ell(10, 18, 2, 3, f === 2 ? '#ffffff' : C[2]); });
    P.mk('um_excrys', 16, 22, 2, (p, f) => { const C = f ? ['#ffd8cc', '#ffffff', '#ffffff', '#ffffff'] : U.o; p.sell(8, 21, 7, 2, [B[0], B[2], B[3]]); P.Sprites.umCrystal(p, 8, 21, 7, 18, C, 0); P.Sprites.umCrystal(p, 3, 21, 3, 8, C, -0.25); P.Sprites.umCrystal(p, 13, 21, 3, 9, C, 0.25); for (let k = 0; k < 4; k++) p.px(5 + k * 2, 12 + (k % 2) * 3, f ? '#ff2a3a' : '#7a1a06'); });
    P.mk('um_float', 14, 24, 2, (p, f) => { P.Sprites.umCrystal(p, 7, 18, 6, 16, f ? U.r : U.c, 0); for (let y = 18; y < 24; y++) { const w = (24 - y) / 2; p.rect(7 - w, y, w * 2, 1, f ? U.r[0] : U.c[0]); } });
    P.mk('um_pod', 32, 44, 2, (p, f) => { p.rect(2, 38, 28, 6, '#2e3346'); p.rect(2, 38, 28, 1, '#8a98bc'); p.sell(16, 22, 13, 18, ['#1a1c2a', '#2e3346', '#4e5872', '#8a98bc']); p.ell(16, 22, 9, 13, f ? '#120a16' : '#3a2440'); for (const y of [10, 34]) p.rect(8, y, 16, 1, '#8a98bc'); for (let k = 0; k < 3; k++) p.px(9 + k * 7, 39, f ? '#3a3046' : '#ff6fb3'); });
    P.Sprites.registerLook('kaelun', Object.assign({}, P.CIV.andromedano, { skin: '#3a2a5a', skinD: '#1e1638', cloth: '#16121c', clothD: '#0a080e', acc: '#ff3a4a', freckle: '#ff8a7a', h: 21 }));
  };
  (function () { const base = P.Sprites.buildWorld; P.Sprites.buildWorld = function () { base(); P.Sprites.buildUmbreliaExtra(); }; })();

  // ---------- entidades propias ----------
  // Pulso de resonancia: abre barreras, purga la corrupción, despierta plataformas y alimenta mecanismos
  P.umPulse = function (L, x, y, r, src, col) {
    L.fx.push({ k: 'ring', x, y, t: 0, life: 40, r, col: col || '#ff4450', um: true }); P.Audio.sfx('super'); P.shake(2, 10);
    // barreras de cristal: se disuelve la columna entera que toque el pulso
    const seen = {}, q = [];
    for (let ty = Math.floor((y - r) / TSZ); ty <= Math.floor((y + r) / TSZ); ty++) for (let tx = Math.floor((x - r) / TSZ); tx <= Math.floor((x + r) / TSZ); tx++) if (L.tile(tx, ty) === 'G' && P.dist(x, y, tx * TSZ + 8, ty * TSZ + 8) < r) q.push([tx, ty]);
    while (q.length) { const [tx, ty] = q.pop(), k = tx + ',' + ty; if (seen[k] || L.tile(tx, ty) !== 'G') continue; seen[k] = 1; L.map[ty][tx] = '.'; L.parts.burst(tx * TSZ + 8, ty * TSZ + 8, 5, { col: P.pick(['#ff4450', '#ffd8cc', '#c8142a']), smin: 0.5, smax: 2.5, g: 0.1, glow: 3 }); q.push([tx + 1, ty], [tx - 1, ty], [tx, ty + 1], [tx, ty - 1]); }
    if (Object.keys(seen).length) { P.Audio.sfx('unlock'); if (!L.umGateTip) { L.umGateTip = true; P.toast('La barrera de cristal se disuelve', { col: '#ff8a7a', life: 120 }); } }
    for (const e of L.ents) if (e.onPulse && !e.dead && P.dist(x, y, e.cx, e.cy) < r * (e.pulseReach || 1)) e.onPulse(src);
  };
  // Monolito de cristal (Q): late con luz propia y reacciona cuando te acercas
  P.CrystalColumn = class extends P.Decor {
    constructor(L, x, y) { super(L, x, y, 'column', 'monolito'); this.ph = Math.random() * 6; this.near = 0; }
    update() { super.update(); const p = this.L.player, d = Math.abs(p.cx - this.cx); this.near += ((d < 70 ? 1 : 0) - this.near) * 0.05; const on = this.L.restoredAt(this.cx); if (this.t % (this.near > 0.5 ? 3 : 14) === 0) this.L.parts.add({ x: this.cx + P.rand(-12, 12), y: this.y + P.rand(10, this.h - 10), vy: -P.rand(0.2, 0.7), vx: P.rand(-0.2, 0.2), life: 70, col: on ? P.pick(['#ff4450', '#ffd8cc', '#ff8a5a']) : P.pick(['#9a6a96', '#5e2c5c']), size: 1, glow: 3 }); }
    pulse() { return 0.5 + Math.sin(this.t * 0.04 + this.ph) * 0.25 + this.near * 0.35; }
    umLight() { return [this.cx, this.y + this.h * 0.45, (this.L.restoredAt(this.cx) ? 80 : 50) + this.pulse() * 30, 0.95]; }
    draw(c, cx, cy) {
      const on = this.L.restoredAt(this.cx), x = Math.round(this.x - cx), y = Math.round(this.y - cy), k = this.pulse();
      P.drawGlow(c, x + 20, y + this.h * 0.5, 46 + k * 16, on ? '#ff3a4a' : '#8a3a8a', 0.22 + k * 0.18);
      P.spr(c, this.spr, on ? 1 : 0, x + (this.near > 0.8 && this.t % 30 < 2 ? 1 : 0), y);
      // reflejo rojo sobre el suelo negro
      c.globalAlpha = 0.25 + k * 0.2; c.fillStyle = on ? '#ff3a4a' : '#7a3a8a'; c.fillRect(x - 6, y + this.h - 1, this.w + 12, 1); c.fillRect(x + 4, y + this.h + 1, this.w - 8, 1); c.globalAlpha = 1;
    }
  };
  // Cristal suspendido (Y): flota, gira la luz y sirve de faro en la oscuridad
  P.FloatCrystal = class extends P.Ent {
    constructor(L, x, y) { super(L, x - 7, y - 30, 14, 24); this.by = this.y; this.ph = Math.random() * 6; }
    update() { this.t++; this.y = this.by + Math.sin(this.t * 0.03 + this.ph) * 4; if (this.t % 20 === 0) this.L.parts.add({ x: this.cx + P.rand(-3, 3), y: this.y + 22, vy: P.rand(0.2, 0.5), life: 40, col: '#ff4450', size: 1, glow: 2 }); }
    umLight() { return [this.cx, this.cy, 64 + Math.sin(this.t * 0.05) * 8, 0.9]; }
    draw(c, cx, cy) { const on = this.L.restoredAt(this.cx), x = Math.round(this.x - cx), y = Math.round(this.y - cy); P.drawGlow(c, x + 7, y + 10, 26, on ? '#ff3a4a' : '#8a3a8a', 0.35); P.spr(c, 'float', on ? 1 : 0, x, y); }
  };
  // Cristal de resonancia (Z): se carga solo; al dispararle libera un pulso cuyo alcance depende de la carga
  P.ResonanceCrystal = class extends P.Ent {
    constructor(L, x, y) { super(L, x - 8, y - 32, 16, 32); this.isEnemy = true; this.passive = true; this.hp = 9999; this.charge = 1; this.harmless = true; this.dmg = 0; }
    die() {}
    hit() { if (this.charge < 0.3) { this.L.parts.burst(this.cx, this.cy, 3, { col: '#9a6a96', smin: 0.3, smax: 1 }); P.Audio.sfx('block'); return; } P.umPulse(this.L, this.cx, this.cy, 120 + 140 * this.charge, this); this.charge = 0; this.flash = 8; }
    update() { this.t++; if (this.flash > 0) this.flash--; this.charge = Math.min(1, this.charge + 1 / 220); if (this.charge >= 1 && this.t % 10 === 0) this.L.parts.add({ x: this.cx + P.rand(-5, 5), y: this.y + P.rand(4, 26), vy: -0.4, life: 30, col: '#ffd8cc', size: 1, glow: 3 }); }
    umLight() { return [this.cx, this.cy, 34 + this.charge * 50, 0.95]; }
    draw(c, cx, cy) {
      const x = Math.round(this.x - cx), y = Math.round(this.y - cy), full = this.charge >= 1, f = full ? 2 : this.charge > 0.3 ? 1 : 0, vib = full && this.t % 40 < 6 ? P.ri(-1, 1) : 0;
      P.drawGlow(c, x + 8, y + 16, 20 + this.charge * 26, '#ff3a4a', 0.2 + this.charge * 0.35);
      P.spr(c, 'rescrys', f, x - 2 + vib, y - 2, { flash: this.flash > 0 });
      c.fillStyle = '#16121c'; c.fillRect(x, y + 34, 16, 2); c.fillStyle = full ? '#ffd8cc' : '#c8142a'; c.fillRect(x, y + 34, Math.round(16 * this.charge), 2);
    }
  };
  // Cristal explosivo (V): al dispararle parpadea y estalla; daña enemigos, rompe muros agrietados y encadena otros cristales
  P.ExplosiveCrystal = class extends P.Ent {
    constructor(L, x, y) { super(L, x - 8, y - 22, 16, 22); this.isEnemy = true; this.passive = true; this.harmless = true; this.dmg = 0; this.hp = 9999; this.armed = 0; this.gone = 0; }
    get untouchable() { return this.gone > 0 || this.armed > 0; }
    set untouchable(v) {}
    die() {}
    hit() { if (this.gone > 0 || this.armed > 0) return; this.armed = 32; P.Audio.sfx('charge'); }
    update() {
      this.t++; const L = this.L;
      if (this.gone > 0) { if (--this.gone === 0) L.parts.burst(this.cx, this.cy, 8, { col: '#ff6a3a', smin: 0.3, smax: 1.2, glow: 3 }); return; }
      if (this.armed > 0 && --this.armed === 0) this.boom();
    }
    boom() {
      const L = this.L, x = this.cx, y = this.cy, R = 58; this.gone = 600; P.Audio.sfx('bigexplode'); P.shake(6, 18); P.hitstop = 3;
      L.fx.push({ k: 'ring', x, y, t: 0, life: 26, r: R + 20, col: '#ff6a3a', um: true });
      for (let i = 0; i < 26; i++) { const a = Math.random() * 7; L.parts.add({ x, y, vx: Math.cos(a) * P.rand(1, 4), vy: Math.sin(a) * P.rand(1, 4) - 1, g: 0.12, life: P.ri(20, 40), col: P.pick(['#ff4450', '#ff9a4a', '#ffd8cc']), size: 2, glow: 4, shrink: true }); }
      for (const e of L.ents) if (e !== this && e.isEnemy && !e.dead && !e.passive && P.dist(x, y, e.cx, e.cy) < R + e.w / 2) e.hit(45, { x });
      for (const e of L.ents) if (e instanceof P.ExplosiveCrystal && e !== this && !e.gone && !e.armed && P.dist(x, y, e.cx, e.cy) < R + 30) e.armed = 14;
      for (let ty = Math.floor((y - R) / TSZ); ty <= Math.floor((y + R) / TSZ); ty++) for (let tx = Math.floor((x - R) / TSZ); tx <= Math.floor((x + R) / TSZ); tx++) if (P.dist(x, y, tx * TSZ + 8, ty * TSZ + 8) < R) L.damageTile(tx, ty, 40);
      const p = L.player; if (!p.dead && P.dist(x, y, p.cx, p.cy) < 34) p.hurt(8, x);
    }
    umLight() { return this.gone ? null : [this.cx, this.cy, this.armed ? 70 : 30, 0.9]; }
    draw(c, cx, cy) {
      if (this.gone > 0) { if (this.gone < 90 && this.t % 8 < 4) { c.globalAlpha = 0.4; P.spr(c, 'excrys', 0, Math.round(this.x - cx), Math.round(this.y - cy)); c.globalAlpha = 1; } return; }
      const x = Math.round(this.x - cx), y = Math.round(this.y - cy), blink = this.armed > 0 && (this.armed >> 2) % 2 === 0;
      P.drawGlow(c, x + 8, y + 12, this.armed ? 30 : 16, '#ff6a3a', this.armed ? 0.6 : 0.3);
      P.spr(c, 'excrys', blink ? 1 : 0, x + (this.armed ? P.ri(-1, 1) : 0), y);
      if (this.armed) { c.strokeStyle = 'rgba(255,120,80,' + (1 - this.armed / 32) + ')'; c.beginPath(); c.arc(x + 8, y + 12, 58 * (1 - this.armed / 40), 0, 7); c.stroke(); }
    }
  };
  // Corrupción (O): humo oscuro que respira. Dentro te drena poco a poco, pero nunca por debajo de 1 punto de salud.
  // Un pulso de resonancia la disipa unos segundos; la Piel de Obsidiana te hace inmune.
  P.Corruption = class extends P.Ent {
    constructor(L, x, y) { super(L, x - 26, y - 72, 52, 72); this.purged = 0; this.pulseReach = 1.3; }
    onPulse() { this.purged = 480; this.L.parts.burst(this.cx, this.cy, 16, { col: '#ffd8cc', smin: 1, smax: 3, glow: 3 }); }
    update() {
      this.t++; const L = this.L, p = L.player; if (this.purged > 0) this.purged--;
      if (L.restoredAt(this.cx)) return;
      const on = this.purged <= 0, w = this.w * (0.85 + Math.sin(this.t * 0.03) * 0.15), box = { x: this.cx - w / 2, y: this.y, w, h: this.h };
      if (on && this.t % 3 === 0) L.parts.add({ x: this.cx + P.rand(-w / 2, w / 2), y: this.y + this.h - P.rand(0, 10), vy: -P.rand(0.3, 0.9), vx: P.rand(-0.2, 0.2), life: P.ri(50, 90), col: P.pick(['#1a0a20', '#2a0e30', '#120614', '#9a3a8a']), size: P.pick([2, 3]), fade: true });
      if (on && !p.dead && P.overlap(box, p) && !(p.st && p.st.obsidiana)) {
        L.umCorrupt = 6; if (!L.umCorruptTip) { L.umCorruptTip = true; P.toast('Corrupción: te drena hasta 1 punto de salud. Un pulso de resonancia la disipa.', { col: '#c88aff', life: 220 }); }
        if (this.t % 40 === 0 && p.hp > 1) { p.hp = Math.max(1, p.hp - 3); L.popups.push({ x: p.cx, y: p.y - 6, text: '-3', col: '#c88aff', t: 0 }); L.parts.burst(p.cx, p.cy, 4, { col: '#9a3a8a', smin: 0.5, smax: 1.5 }); }
      }
    }
    draw(c, cx, cy) {
      if (this.L.restoredAt(this.cx) || this.purged > 0) return;
      const x = Math.round(this.cx - cx), y = Math.round(this.y - cy), w = this.w * (0.85 + Math.sin(this.t * 0.03) * 0.15);
      const g = c.createLinearGradient(0, y, 0, y + this.h); g.addColorStop(0, 'rgba(20,6,26,0)'); g.addColorStop(0.5, 'rgba(30,8,40,0.45)'); g.addColorStop(1, 'rgba(50,10,60,0.6)'); c.fillStyle = g; c.fillRect(x - w / 2, y, w, this.h);
      c.fillStyle = 'rgba(200,60,160,0.35)'; for (let i = 0; i < 4; i++) c.fillRect(x - w / 2 + ((this.t * 0.7 + i * 13) % w), y + this.h - 4 - ((this.t + i * 19) % this.h), 1, 3);
      P.drawGlow(c, x, y + this.h - 6, w * 0.6, '#9a3a8a', 0.3);
    }
  };
  // Plataforma cristalina (J): 3 casillas. Rítmica (aparece y se apaga con aviso) o, junto a un cristal de resonancia, se despierta con el pulso
  P.PhasePlatform = class extends P.Ent {
    constructor(L, x, y, m) {
      super(L, (m.x - 1) * TSZ, m.y * TSZ, TSZ * 3, 8); this.tx = m.x; this.ty = m.y; this.pulseReach = 1.4;
      this.pulseMode = L.markers.some(k => k.c === 'Z' && Math.abs(k.x - m.x) < 18 && Math.abs(k.y - m.y) < 10); this.act = 0; this.grp = Math.floor(m.x / 6) % 2;
      this.on = false; this.set(!this.pulseMode && this.phaseOn());
    }
    phaseOn() { const t = (this.L.t + this.grp * 120) % 240; return t < 160; }
    set(v) { if (v === this.on) return; this.on = v; for (let k = -1; k <= 1; k++) if (this.L.tile(this.tx + k, this.ty) === '.' || this.L.tile(this.tx + k, this.ty) === 'j') this.L.map[this.ty][this.tx + k] = v ? 'j' : '.'; if (v) this.L.parts.burst(this.cx, this.y + 3, 6, { col: '#ff8a7a', smin: 0.3, smax: 1.2, glow: 2 }); }
    onPulse() { if (this.pulseMode) { this.act = 360; this.set(true); } }
    warn() { if (this.pulseMode) return this.act > 0 && this.act < 90; const t = (this.L.t + this.grp * 120) % 240; return t >= 115 && t < 160; }
    update() { this.t++; if (this.pulseMode) { if (this.act > 0 && --this.act === 0) this.set(false); } else this.set(this.phaseOn()); }
    umLight() { return this.on ? [this.cx, this.y + 4, 40, 0.8] : null; }
    draw(c, cx, cy) {
      const x = Math.round(this.x - cx), y = Math.round(this.y - cy);
      if (!this.on) { c.globalAlpha = 0.45; for (let k = 0; k < 3; k++) P.spr(c, 't_phase', 1, x + k * TSZ, y); c.globalAlpha = 1; return; }
      if (this.warn() && (this.t >> 2) % 2) c.globalAlpha = 0.45;
      P.drawGlow(c, x + 24, y + 4, 26, '#ff3a4a', 0.35); for (let k = 0; k < 3; k++) P.spr(c, 't_phase', 0, x + k * TSZ, y); c.globalAlpha = 1;
    }
  };
  // Umbrátil (W): espectro que solo se ve cerca de la luz; se acerca despacio y atraviesa la roca
  P.Wraith = class extends P.Enemy {
    constructor(L, x, y) { super(L, x - 8, y - 30, 16, 20, { kind: 'umbratil', hp: 18, dmg: 10, xp: 9, drops: { bio: 2 }, natural: true, spr: 'wraith', flying: true }); this.ph = Math.random() * 7; this.vis = 0; }
    hit(d, o = {}) { super.hit(d, o); if (!this.dead) { this.vx = Math.sign(this.cx - (o.x != null ? o.x : this.L.player.cx)) * 2.2; this.vis = 1; } }
    update() {
      if (this.commonUpdate()) return;
      const L = this.L, p = L.player, d = P.dist(this.cx, this.cy, p.cx, p.cy);
      if (!this.passive && d < 170 && !p.dead) { const a = Math.atan2(p.cy - this.cy, p.cx - this.cx); this.vx += Math.cos(a) * 0.05; this.vy += Math.sin(a) * 0.05; }
      else { this.vx += Math.cos(this.t * 0.02 + this.ph) * 0.02; this.vy += Math.sin(this.t * 0.03 + this.ph) * 0.02; }
      this.vx *= 0.95; this.vy *= 0.95; this.x += P.clamp(this.vx, -0.9, 0.9); this.y += P.clamp(this.vy, -0.7, 0.7); this.face = this.vx >= 0 ? 1 : -1;
      // visible cerca de tu luz, de los cristales o con el Ojo Umbrío
      let lit = d < 80 || (p.st && p.st.vision) || !L.umDark || !L.umDark.some(([a, b]) => this.cx >= a && this.cx < b);
      if (!lit) for (const e of L.ents) if (e.umLight && !e.dead && P.dist(this.cx, this.cy, e.cx, e.cy) < 70) { lit = true; break; }
      this.vis += ((lit ? 1 : 0.08) - this.vis) * 0.08;
    }
    draw(c, cx, cy) {
      const s = P.SP('wraith'); const x = Math.round(this.cx - 10 - cx), y = Math.round(this.y - 2 - cy + Math.sin(this.t * 0.08) * 2);
      c.globalAlpha = P.clamp(this.vis, 0.08, 1); P.spr(c, 'wraith', this.flash > 0 ? 2 : Math.floor(this.t / 14) % 2, x, y, { flip: this.face < 0, flash: this.flash > 0 }); c.globalAlpha = 1;
      if (this.vis < 0.5) { c.fillStyle = '#ff2a3a'; c.fillRect(x + 6, y + 8, 2, 1); c.fillRect(x + 12, y + 8, 2, 1); }
    }
  };
  // Cápsula de NOVA (evento del Refugio Secreto): se abre cuando la alcanzan los pulsos de dos cristales distintos
  P.NovaPod = class extends P.Ent {
    constructor(L, x, y) { super(L, x - 16, y - 44, 32, 44); this.got = new Set(); this.pulseReach = 2; this.open = !!P.State.data.comps.unlocked.nova; }
    get interact() { return !this.open && !this.L.cutscene; }
    get prompt() { return 'Examinar la cápsula'; }
    use() { this.L.say([['elara', 'Cápsula de estasis de la República. Carga: ' + this.got.size + '/2.'], ['elara', 'Dispara a los cristales de resonancia de la cámara: sus pulsos la recargarán.']]); }
    onPulse(src) {
      if (this.open || !src) return; this.got.add(src); P.toast('Cápsula de estasis: carga ' + Math.min(2, this.got.size) + '/2', { col: '#ff8ad8', life: 120 });
      if (this.got.size >= 2) { this.open = true; const S = P.State; P.Audio.sfx('unlock'); this.L.parts.burst(this.cx, this.cy, 30, { col: P.pick(['#ff6fb3', '#ffd0f0', '#ffffff']), smin: 1, smax: 3, glow: 4 });
        this.L.say([['elara', 'La cápsula se abre… firma de una unidad K. Designación: N-0.'], ['nova', '¿Siete? … ¿De verdad eres tú? Te dije que no vinieras todavía.'], ['hero', 'Llevo cinco mundos buscándote, N-0.'], ['nova', 'Entonces llámame NOVA. Y deja que te cubra la espalda: si caes, te levanto.'], ['elara', 'NOVA se une al equipo. Bienvenida a casa.']], () => {
          S.data.comps.unlocked.nova = true; S.missionDone('s_nova'); S.ach('nova_found'); S.addXP(80); P.toast('NOVA se une a tu equipo (Bahía de apoyo)', { col: P.UIC.green, icon: 'por_nova', life: 260 });
        }); }
    }
    umLight() { return [this.cx, this.cy, this.open ? 40 : 60, 0.9]; }
    draw(c, cx, cy) { const x = Math.round(this.x - cx), y = Math.round(this.y - cy); P.drawGlow(c, x + 16, y + 22, 26, '#ff6fb3', this.open ? 0.15 : 0.3 + Math.sin(this.t * 0.06) * 0.1); P.spr(c, 'pod', this.open ? 1 : 0, x, y); if (!this.open) { P.spr(c, 'nova', 0, x + 7, y + 10, { alpha: 0.85 }); c.fillStyle = '#ff6fb3'; c.fillRect(x + 4, y + 2, Math.round(24 * this.got.size / 2), 2); } }
  };

  // marcadores reinterpretados en UMBRÉLIA
  const rk = (e, kind) => { e.kind = kind; return e; }, gy = (L, m) => L.snapY(m.x, m.y);
  P.LV.umbrelia.spawn = {
    c: (L, x, y) => L.add(rk(new P.Crab(L, x - 9, y, false), 'fractarido')),
    K: (L, x, y, m, R) => L.add(R ? rk(new P.Crab(L, x - 9, y, false), 'fractarido') : rk(new P.Crab(L, x - 10, y, true), 'fractarido_cy')),
    A: (L, x, y, m, R) => { if (!R) L.add(rk(new P.Alpha(L, x - 20, y), 'geodonte')); },
    f: (L, x, y) => L.add(rk(new P.Frog(L, x - 7, y - 11), 'pulsapodo')),
    d: (L, x, y) => L.add(rk(new P.Fly(L, x - 8, y - 20, false), 'lucerna')),
    D: (L, x, y, m, R) => { const fac = L.theme === 'facility' || L.theme === 'lab'; if (!R) { const e = L.add(new P.Fly(L, x - 8, y - 20, true)); if (!fac) e.kind = 'lucerna_dron'; } else if (!fac) L.add(rk(new P.Fly(L, x - 8, y - 20, false), 'lucerna')); },
    l: (L, x, y) => L.add(rk(new P.Slug(L, x - 10, y - 8), 'velo_ceniza')),
    p: (L, x, y, m, R) => { if (!R) L.add(rk(new P.Maw(L, x - 6, y - 16), 'fauce_geodica')); else L.add(new P.Decor(L, x, y, 'fern_r', 'brasaluz')); },
    v: (L, x, y, m) => L.add(rk(new P.VSnake(L, x, m.y * TSZ), 'colgacuarzo')),
    h: (L, x, y) => { const e = L.add(new P.HealPlant(L, x, y)); e.light = '#ff4a5a'; },
    Q: (L, x, y, m) => L.add(new P.CrystalColumn(L, x, gy(L, m))),
    Y: (L, x, y, m) => L.add(new P.FloatCrystal(L, x, (m.y + 1) * TSZ)),
    Z: (L, x, y, m) => L.add(new P.ResonanceCrystal(L, x, gy(L, m))),
    V: (L, x, y, m) => L.add(new P.ExplosiveCrystal(L, x, gy(L, m))),
    O: (L, x, y, m) => L.add(new P.Corruption(L, x, gy(L, m))),
    J: (L, x, y, m) => L.add(new P.PhasePlatform(L, x, y, m)),
    W: (L, x, y, m) => L.add(new P.Wraith(L, x, (m.y + 1) * TSZ))
  };
  P.LV.umbrelia.levels.find(l => l.id === 6).events[1].spawn = (L, x, y) => L.add(new P.NovaPod(L, x, y));
  P.LV.umbrelia.overworld.vip = { look: 'kaelun', civ: 'andromedano', talk: lib => [['kaelun', lib >= 10 ? 'Los cristales laten en todo el valle, {N}. Y dicen que la Corona Lumínica vuelve a flotar sobre la llanura.' : 'Cada territorio liberado devuelve la luz a una parte del valle. Los cristales lo notan.']] };

  // ---------- integración con el jugador: Lanzaesquirlas, Corazón del Eclipse ----------
  // el cristal del Lanzaesquirlas estalla en cuatro esquirlas al impactar
  const baseKill = P.Proj.prototype.kill;
  P.Proj.prototype.kill = function (spark) {
    if (this.shard && !this.splitDone && !this.dead) { this.splitDone = true; const L = this.L; for (const a of [-Math.PI * 0.85, -Math.PI * 0.62, -Math.PI * 0.38, -Math.PI * 0.15]) { L.add(new P.Proj(L, this.cx - this.vx, this.cy - 2, Math.cos(a) * 2.6, Math.sin(a) * 2.6, { grav: 0.12, dmg: this.dmg * 0.45, owner: 'p', spr: 'um_b_glob', life: 22, w: 6, h: 6, glow: '#ff6a3a' })); } L.parts.burst(this.cx, this.cy, 6, { col: '#ff8a5a', smin: 0.5, smax: 2, glow: 3 }); }
    return baseKill.call(this, spark);
  };
})();
