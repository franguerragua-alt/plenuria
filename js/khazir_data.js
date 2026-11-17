'use strict';
// KHAZIR — datos del planeta, criaturas propias y reglas del mundo
(function () {
  const D = P.D, K = 'khazir';
  Object.assign(D.planet(K), { ready: true, lair: 'la Garganta de Arena' });
  D.planet('verzara').lair = 'la Fosa de Coral Espinado';
  Object.assign(D.BOSSES.zarmakh, { col: '#ffb030', col2: '#2fe0c0' });

  // ---------- armas y mejoras ----------
  D.WEAPONS.arena = { name: 'Cañón de Arena', icon: 'i_sand', planet: K, desc: 'Arma de los clanes reptilianos. Dispara cristales de arena solar que atraviesan hasta cuatro enemigos.', dmg: 9, rate: 22, speed: 7.5, spr: 'kz_b_crys' };
  Object.assign(D.UPGRADES, {
    garras: { name: 'Garras Reptilianas', icon: 'i_claw', kind: 'Movimiento', planet: K, desc: 'Garras ancestrales del clan solar. Te aferras a las paredes, resbalas despacio y puedes SALTAR DE UNA PARED A OTRA.' },
    arena: { name: 'Cañón de Arena', icon: 'i_sand', kind: 'ATAQUE', planet: K, desc: 'Nueva arma: cristales de arena solar que atraviesan a varios enemigos. Cambia de arma con ' },
    escamas: { name: 'Escamas de Basilisco', icon: 'i_scale', kind: 'DEFENSA', planet: K, desc: 'Forjadas por Zul-Ankar. Cada parada perfecta te cura y la barrera se regenera más deprisa.' },
    sismico: { name: 'Núcleo Sísmico', icon: 'i_quake', kind: 'SUPERATAQUE', planet: K, desc: 'Núcleo arrancado de ZARMAKH. El Pulso Solar lanza además una onda sísmica que recorre el suelo.' }
  });
  D.RECIPES.push({ id: 'arena_mk2', name: 'Cañón de Arena Mk II', desc: '+30 % de daño del Cañón de Arena.', cost: { scrap: 14, crys: 3 }, req: [], needUp: 'arena', needNpc: 'zul' });

  // ---------- Archivo Biológico ----------
  const sp = (o) => Object.assign({ planet: K, variant: 'natural' }, o);
  const ZK = D.SPECIES.findIndex(s => s.id === 'zarmakh');
  if (ZK >= 0) D.SPECIES.splice(ZK, 1);
  D.SPECIES.push(
    sp({ id: 'escorpion', col: 'fauna', spr: 'kz_krazith', name: 'Escorpión de Duna', sci: 'Scorpio arenarius', rarity: 'común',
      habitat: 'Dunas bajas y sombra de las rocas.', behavior: 'Territorial. Embiste con las pinzas y alza el aguijón cuando algo invade su madriguera.',
      diet: 'Insectos de duna y semillas caídas.', abilities: 'Caparazón que refleja el calor del mediodía.', danger: 2,
      eco: 'Airea la arena con sus madrigueras y deja pasar el agua de lluvia.', lore: 'Los cachorros reptilianos aprendían a cazar imitando su paso lateral.', tasks: ['seen', { k: 'defeat', n: 3 }, { k: 'observe', n: 4 }] }),
    sp({ id: 'escorpion_cy', col: 'fauna', spr: 'kz_krazith_cy', name: 'Escorpión Ciberacorazado', sci: 'Scorpio arenarius (mod. Thersek)', rarity: 'poco común', variant: 'cibernética', base: 'escorpion',
      habitat: 'Perímetro de las extractoras.', behavior: 'Centinela obediente. Dispara plasma por el aguijón.', diet: 'Sondas de nutrientes del régimen.', abilities: 'Blindaje de titanio y óptica roja.', danger: 3,
      eco: 'Ninguno: desplaza a los kharvex naturales.', lore: 'Grabado en su cola: «LOTE S-K. EXCAVADORA PRIMA».', tasks: ['seen', { k: 'defeat', n: 6 }] }),
    sp({ id: 'escorpion_rey', col: 'fauna', spr: 'kz_krazith_alfa', name: 'Kharvex Soberano', sci: 'Scorpio imperator (mutación inducida)', rarity: 'rara', variant: 'mutada', base: 'escorpion',
      habitat: 'Mar de Dunas Cantoras.', behavior: 'Antiguo patriarca de la especie, enloquecido por la radiación. Embiste, salta y lanza aguijones.', diet: 'Omnívoro voraz.', abilities: 'Corona de púas doradas.', danger: 4,
      eco: 'Mantenía el orden entre las colonias del desierto.', lore: 'Los clanes lo llamaban «el que no cede la sombra».', tasks: ['seen', { k: 'defeat', n: 1 }] }),
    sp({ id: 'escarabajo', col: 'fauna', spr: 'kz_frog', name: 'Escarabajo Bombardero', sci: 'Brachinus solaris', rarity: 'común',
      habitat: 'Orillas de los oasis y grietas húmedas.', behavior: 'Salta con sus patas traseras y lanza un chorro de ácido hirviente.', diet: 'Larvas y hongos de oasis.', abilities: 'Glándula química explosiva.', danger: 2,
      eco: 'Controla las plagas que dañan las raíces de las Umbráceas.', lore: 'Su caparazón azul se usaba como espejo en las bodas reptilianas.', tasks: ['seen', { k: 'defeat', n: 3 }, { k: 'observe', n: 4 }] }),
    sp({ id: 'buitre', col: 'fauna', spr: 'kz_dfly', name: 'Buitre de Cañón', sci: 'Gyps canyonis', rarity: 'común',
      habitat: 'Cornisas y corrientes de aire caliente.', behavior: 'Planea en círculos y se lanza en picado contra los intrusos cuando el aire está contaminado.', diet: 'Carroña.', abilities: 'Vista capaz de ver el calor.', danger: 1,
      eco: 'Limpia el desierto de restos y evita epidemias.', lore: 'Ver tres buitres juntos anunciaba lluvia en la tradición del clan solar.', tasks: ['seen', { k: 'observe', n: 3 }] }),
    sp({ id: 'halcon_dron', col: 'fauna', spr: 'kz_dfly_cy', name: 'Halcón-Dron', sci: 'Gyps canyonis (mod. Thersek)', rarity: 'poco común', variant: 'cibernética', base: 'buitre',
      habitat: 'Cielos de las refinerías.', behavior: 'Patrulla y dispara láseres.', diet: 'Batería de plasma.', abilities: 'Alas de aleación y cañón ventral.', danger: 2,
      eco: 'Ninguno.', lore: 'Thersek los llama «ojos del gusano».', tasks: ['seen', { k: 'defeat', n: 5 }] }),
    sp({ id: 'tortuga', col: 'fauna', spr: 'kz_slug', name: 'Tortuga de Arena', sci: 'Testudo dunaria', rarity: 'común',
      habitat: 'Llanuras de arena compacta.', behavior: 'Lenta y acorazada. Embiste si la molestan.', diet: 'Cactus y raíces.', abilities: 'Caparazón casi indestructible.', danger: 1,
      eco: 'Dispersa semillas de cactus con sus excrementos.', lore: 'Hay tortugas más viejas que la República Solar.', tasks: ['seen', { k: 'defeat', n: 2 }, { k: 'restored' }] }),
    sp({ id: 'serpiente', col: 'fauna', spr: 'kz_vsnake', name: 'Serpiente de Cornisa', sci: 'Crotalus rupestris', rarity: 'poco común',
      habitat: 'Techos de cuevas y salientes del cañón.', behavior: 'Cuelga inmóvil como una raíz seca y cae sobre su presa.', diet: 'Pequeños escarabajos.', abilities: 'Camuflaje y veneno paralizante.', danger: 2,
      eco: 'Regula la población de escarabajos.', lore: 'Varkh asegura que es más paciente que cualquier cazador.', tasks: ['seen', { k: 'defeat', n: 2 }] }),
    sp({ id: 'arenicola', col: 'fauna', spr: 'kz_worm', name: 'Vorágulo', sci: 'Vermis arenae', rarity: 'poco común',
      habitat: 'Bajo la arena suelta de las dunas.', behavior: 'Espera enterrada y muerde cuando algo pisa cerca. Luego escupe arena y vuelve a hundirse.', diet: 'Todo lo que cae a su alcance.', abilities: 'Anillos de dientes y piel que «nada» en la arena.', danger: 3,
      eco: 'Remueve las dunas y entierra la materia orgánica.', lore: 'Es pariente diminuto del Gran Gusano. Los clanes la temen y la respetan.', tasks: ['seen', { k: 'defeat', n: 3 }] }),
    sp({ id: 'dromotauro', col: 'fauna', spr: 'kz_grazer', name: 'Dromotauro', sci: 'Camelobos placidus', rarity: 'rara', restoredOnly: true,
      habitat: 'Dunas restauradas.', behavior: 'Herbívoro tranquilo que viaja en caravana de oasis en oasis.', diet: 'Hierba de duna y flores de cactus.', abilities: 'Sus jorobas almacenan agua durante meses.', danger: 0,
      eco: 'Abre senderos entre los oasis que usan las demás especies.', lore: 'Los clanes viajaban sobre ellos. Cada clan pintaba sus jorobas con su color.', tasks: ['seen', { k: 'observe', n: 5 }] }),
    sp({ id: 'esfinge', col: 'fauna', spr: 'kz_vellorn', name: 'Ssynthra de Cristal', sci: 'Leo crystallinus', rarity: 'legendaria', restoredOnly: true,
      habitat: 'Desconocido. Solo aparece en un KHAZIR completamente restaurado.', behavior: 'Guardiana silenciosa de los templos enterrados.', diet: 'Luz solar filtrada por las geodas.', abilities: 'Melena de cristal que canta con el viento.', danger: 0,
      eco: 'Se dice que su canto despierta los oasis.', lore: 'Las dunas «cantan» porque la Esfinge les enseñó a hacerlo.', tasks: ['seen', { k: 'observe', n: 6 }] }),
    sp({ id: 'zarmakh', col: 'fauna', spr: 'zarmakh', boss: true, name: 'ZARMAKH', title: 'Gusano Gigante Cibernético', sci: 'Vermis colossus (mod. Thersek)', rarity: 'única', variant: 'cibernética', base: 'arenicola',
      habitat: 'Garganta de Arena, bajo el nido ancestral.', behavior: 'El Gran Gusano dormía bajo KHAZIR desde antes de la República. Thersek perforó su nido y le injertó un cerebro artificial.', diet: 'Energía de las refinerías y arena mineral.', abilities: 'Cuerpo blindado, embestidas subterráneas, escupitajos de arena y rayo de plasma.', danger: 5,
      eco: 'Sus túneles mantenían vivas las aguas subterráneas de todo el planeta.', lore: 'Los clanes reptilianos no lo combatían: le cantaban para que siguiera durmiendo.', tasks: ['seen', { k: 'defeat', n: 1 }] }),
    // flora
    sp({ id: 'cactus_farol', col: 'flora', spr: 'kz_lamp', name: 'Cactus Farol', sci: 'Cereus lucerna', rarity: 'común', habitat: 'Dunas y cuevas.', behavior: 'Su flor almacena luz de día y la libera de noche.', diet: 'Luz y agua de rocío.', abilities: 'Ilumina su entorno.', danger: 0, eco: 'Guía a los insectos nocturnos.', lore: 'Las caravanas se orientaban con hileras de Cactus Farol.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'salvia_roja', col: 'flora', spr: 'kz_fern_r', name: 'Salvia Roja de Duna', sci: 'Salvia arenaria', rarity: 'común', habitat: 'Laderas de las dunas.', behavior: 'Sus hojas se cierran durante las tormentas.', diet: 'Fotosíntesis.', abilities: 'Raíces que fijan la arena.', danger: 0, eco: 'Impide que las dunas se desplacen.', lore: 'Se quemaba en las ceremonias del clan solar.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'bulbo_azufre', col: 'flora', spr: 'kz_mush', name: 'Bulbo de Azufre', sci: 'Sulfurella toxica', rarity: 'poco común', habitat: 'Grietas volcánicas y cuevas contaminadas.', behavior: 'Expulsa nubes de gas sulfuroso al detectar vibraciones.', diet: 'Minerales.', abilities: 'Gas irritante.', danger: 3, eco: 'Fija el azufre del subsuelo.', lore: 'Diluido, curaba las escamas resecas.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'palmera_cristal', col: 'flora', spr: 'kz_bigmush', name: 'Cristalia Cantora', sci: 'Crystallofrons cantans', rarity: 'poco común', habitat: 'Oasis y geodas.', behavior: 'Sus hojas de cristal cantan con el viento.', diet: 'Agua subterránea.', abilities: 'Concentra la luz en sus dátiles de ámbar.', danger: 0, eco: 'Da sombra y alimento a toda la fauna del oasis.', lore: 'El sonido de las Cristalias dio nombre al Mar de Arena Cantora.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'calabaza_geiser', col: 'flora', spr: 'kz_t_bulb_r', name: 'Calabaza Géiser', sci: 'Cucurbita saliens', rarity: 'común', habitat: 'Bordes de los barrancos.', behavior: 'Acumula vapor y lo expulsa de golpe.', diet: 'Vapor del subsuelo.', abilities: 'Impulsa a quien la pisa.', danger: 0, eco: 'Lanza sus semillas a gran altura.', lore: 'Los cachorros jugaban a ver quién volaba más alto.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'cuerda_duna', col: 'flora', spr: 'kz_t_vine_r', name: 'Cuerda de Duna', sci: 'Funis deserti', rarity: 'común', habitat: 'Paredes del cañón.', behavior: 'Cuelga de las cornisas y busca la humedad de la roca.', diet: 'Rocío.', abilities: 'Fibras más resistentes que el acero.', danger: 0, eco: 'Une las cornisas; es un camino para la fauna.', lore: 'Las cuerdas del clan se trenzaban con ella.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'cardo_vidrio', col: 'flora', spr: 'kz_t_thorn_c', name: 'Cardo de Vidrio', sci: 'Carduus vitreus', rarity: 'común', habitat: 'Suelos alterados por las extractoras.', behavior: 'Cristaliza la arena contaminada a su alrededor.', diet: 'Toxinas del suelo.', abilities: 'Espinas de vidrio afiladísimas.', danger: 2, eco: 'Atrapa las toxinas en cristal.', lore: 'Cuando el desierto sana, el Cardo florece en dorado.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'cactus_fauces', col: 'flora', spr: 'kz_maw', name: 'Cactus Fauces', sci: 'Opuntia vorax', rarity: 'poco común', variant: 'mutada', habitat: 'Oasis contaminados.', behavior: 'Cactus carnívoro que muerde y escupe semillas.', diet: 'Carnívoro.', abilities: 'Mandíbulas espinosas.', danger: 3, eco: 'En su forma natural atrapaba moscas.', lore: 'Su versión natural se llamaba «Sonrisa del Oasis».', tasks: ['seen', { k: 'defeat', n: 2 }] }),
    sp({ id: 'aloe_solar', col: 'flora', spr: 'kz_heal', name: 'Aloe Solar', sci: 'Aloe heliaca', rarity: 'poco común', habitat: 'Junto a los templos.', behavior: 'Su bulbo concentra savia regenerativa.', diet: 'Agua subterránea.', abilities: 'Restaura tejidos y circuitos.', danger: 0, eco: 'Medicina de la fauna herida.', lore: 'Ningún cazador del clan salía al desierto sin una hoja de Aloe Solar.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'loto_oasis', col: 'flora', spr: 'kz_lily', name: 'Loto del Oasis', sci: 'Nelumbo oasis', rarity: 'poco común', restoredOnly: true, habitat: 'Aguas limpias.', behavior: 'Solo florece cuando el agua deja de ser cristal.', diet: 'Fotosíntesis acuática.', abilities: 'Purifica el agua.', danger: 0, eco: 'Oxigena los oasis.', lore: 'Su flor blanca era el símbolo de la paz entre clanes.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'rosa_desierto', col: 'flora', spr: 'kz_orchid', name: 'Coronela Solar', sci: 'Adenium solare', rarity: 'rara', restoredOnly: true, habitat: 'Territorios liberados.', behavior: 'Brota en cuanto la arena sana.', diet: 'Luz solar pura.', abilities: 'Sus semillas resisten siglos.', danger: 0, eco: 'Alimenta a la Ssynthra de Cristal.', lore: 'Varkh quiere plantarlas en el santuario de su clan.', tasks: ['seen', { k: 'scan' }] })
  );
  D.CODEX_REWARDS.khazir = {
    fauna: { name: 'Piel de Duna', desc: 'Mod cyborg: recibes un 10 % menos de daño.', mod: 'duna' },
    flora: { name: 'Rocío del Oasis', desc: 'Mod cyborg: todas las curaciones son un 25 % más potentes.', mod: 'rocio' },
    all: { name: 'Oasis de Khazir + Esfinge', desc: 'Un oasis para los Jardines y la legendaria Ssynthra de Cristal se traslada a la nave.', creature: 'esfinge' }
  };

  // ---------- misiones, logros, historia ----------
  Object.assign(D.MISSIONS, {
    s_ecos_k: { count: d => ['h9', 'h10', 'h11', 'h12', 'h13', 'h14', 'h15', 'h16'].filter(h => d.holos[h]).length, name: 'Ecos del desierto', giver: 'ELARA', desc: 'Recupera los 8 registros holográficos ocultos en KHAZIR.', goal: 8, reward: { xp: 220, crys: 3 } },
    s_varkh: { name: 'El jefe enjaulado', giver: 'ELARA', desc: 'Un jefe de clan reptiliano está prisionero en el Oasis Marchito.', goal: 1, reward: { xp: 120 } },
    s_zul: { name: 'La forja dormida', giver: 'Varkh', desc: 'Zul-Ankar, la forjadora del clan, se escondió en la Necrópolis. Busca un muro de tierra en un zigurat.', goal: 1, reward: { xp: 150, scrap: 10 } },
    s_rosas: { count: d => d.seeds_s_rosas || 0, name: 'Rosas para el santuario', giver: 'Varkh', desc: 'Varkh necesita 5 semillas de Coronela Solar. Solo brotan en territorios liberados de KHAZIR.', goal: 5, reward: { xp: 180, crys: 4 } }
  });
  D.ACHIEVEMENTS.push({ id: 'zarmakh', name: 'Canción de cuna', desc: 'Derrota a ZARMAKH.' }, { id: 'lib_khazir', name: 'Las dunas cantan', desc: 'Libera los 10 territorios de KHAZIR.' });
  Object.assign(D.HOLOS, {
    h9: { title: 'Registro de caravana · Clan Solar', text: 'Tercer día sin viento. El oasis de Ssa-Khor brilla de un color que no es agua. Los quelvaros se niegan a beber. Mañana volvemos a casa por el cañón.' },
    h10: { title: 'Orden Esquelética 207 · Gerselle', text: 'Los oasis de KHAZIR concentran energía geotérmica pura. Cristalícenlos. El agua es un lujo que los reptilianos ya no necesitan.' },
    h11: { title: 'Inscripción del zigurat', text: '«Somos la fuerza del Pacto. Cuando la República llame, los clanes responderán. Cuando el Gusano duerma, el desierto cantará.»' },
    h12: { title: 'Diario de Zul-Ankar', text: 'He escondido los planos del Cañón de Arena en las geodas. Si los Esqueléticos los encuentran, convertirán nuestras armas en cadenas.' },
    h13: { title: 'Canción de la duna', text: '«Duerme, gusano, bajo el mar de sal; la arena te arrulla, nadie te hará mal. Cinco pueblos cantan, cinco guardan tu sueño; mientras el sol brille, el desierto es tu dueño.»' },
    h14: { title: 'Bitácora de Thersek · Proyecto Z', text: 'Excavación al 94 %. El espécimen ocupa una cámara de doce kilómetros. Su sistema nervioso es primitivo: perfecto para el implante neural.' },
    h15: { title: 'Registro de la República · Unidades K', text: 'Las unidades K no son armas. Cada una guarda una parte de la llave del Proyecto ALBA. Si la Esfera cae en malas manos, solo juntas podrán abrirla.' },
    h16: { title: 'Bitácora de Thersek · Unidad K-7', text: 'La unidad roja avanza. Merek exige que la destruya. Yo prefiero estudiarla. Un corazón ALBA, despierto y con voluntad propia... qué desperdicio sería romperlo.' }
  });
  Object.assign(D.MEMORIES, {
    m4: { title: 'Fragmento de memoria · El desierto', text: 'Dunas doradas bajo un sol entero. Una reptiliana de escamas naranjas te ajusta una pieza del brazo: «Aguanta, Siete. La armadura de la República es buena, pero la forja del clan es mejor».' },
    m5: { title: 'Fragmento de memoria · La llave', text: 'Cinco luces se encienden dentro de tu pecho, una tras otra. ELARA, con otra voz, más joven: «Si algún día despiertas sin recordar nada, sigue a las luces. Te llevarán a casa».' }
  });
  D.BOSS_OUTRO.zarmakh = { up: 'sismico', skin: 'duna', mem: 'm5', lines: [['elara', 'ZARMAKH se detiene... el implante de Thersek se ha fundido.'], ['varkh', 'Mira, {N}. Vuelve a enterrarse... despacio. Como antes de la invasión. Está volviendo a dormir.'],
    ['elara', 'He recuperado el núcleo sísmico del implante. Es compatible con tu Pulso Solar.'], ['hero', 'Otra pieza que encaja conmigo. Cada vez son más, ELARA.'], ['elara', 'Lo sé. Integrándolo... ahora.']] };
  D.POST_BOSS.zarmakh = [['thersek', 'Mi gusano... mi precioso gusano. ¿Sabes cuántos ciclos me costó cablear ese cerebro, K-7?'], ['merek', 'Basta, Thersek. Has perdido dos planetas por tu curiosidad.'], ['merek', 'Escúchame bien, {N}. Cada mundo que liberas debilita la Esfera. Y cada vez que la Esfera se debilita, Plenuria se enfría para todos.'],
    ['elara', 'Transmisión cortada. Miente a medias, {N}: la Esfera no alimenta a Plenuria, la asfixia.'], ['elara', 'Las rutas hacia NÍVORAH siguen bloqueadas por la flota. Mientras tanto, el desierto ya canta otra vez. Descansa.']];
  D.FIRST_CLEAR = D.FIRST_CLEAR || {};
  D.FIRST_CLEAR.khazir = (S, id) => {
    if (id === 1) { S.startMission('s_ecos_k'); S.startMission('s_varkh'); }
    if (S.liberated(K) >= 10) S.ach('lib_khazir');
    if (id === 11) S.ach('zarmakh');
  };

  // ---------- rescates ----------
  D.RESCUE = D.RESCUE || {};
  Object.assign(D.RESCUE, {
    varkh: { name: 'Varkh', mission: 's_varkh', lines: [['varkh', 'Hssss... ¿Otra prueba de Thersek? Abre la jaula y te arrancaré los cables.'], ['hero', 'Ya está abierta. Soy {N}. Vengo a liberar KHAZIR.'], ['varkh', '...Un metálico con el sello de la República. Soy Varkh, jefe del Clan Solar.'], ['varkh', 'Mi pueblo está enterrado en estas dunas. Llévame a tu nave y te enseñaré dónde golpear al régimen.'], ['elara', 'Teletransporte preparado. Bienvenido a bordo, Varkh.']],
      onRescue: S => { S.startMission('s_rosas'); S.startMission('s_zul'); },
      ship: { room: 'civs', off: 70, talk: S => { const m = S.data.missions.s_rosas, n = S.data.seeds_s_rosas || 0; return [['varkh', S.liberated(K) >= 10 ? 'Las dunas cantan otra vez, {N}. Mi clan nunca lo olvidará.' : 'Cada territorio que liberas devuelve una caravana a casa.'], ['varkh', m && m.state === 'done' ? 'Las Coronelas Solares ya crecen en el santuario. Huelen a lluvia.' : 'Semillas de Coronela Solar: ' + n + '/5. Brotan cuando la arena sana.']]; } } },
    zul: { name: 'Zul-Ankar', mission: 's_zul', lines: [['zul', '¡Quieto! Llevo tres ciclos escondida aquí con mi martillo. Lo usaré.'], ['varkh', 'Zul, baja eso. Es el metálico del que te hablé.'], ['zul', '...Hmpf. Tu armadura es buena, pero está mal remachada. Soy Zul-Ankar, forjadora del Clan Solar.'], ['zul', 'Llévame a tu taller y haré que ese Cañón de Arena escupa fuego.']],
      ship: { room: 'taller', off: 170, talk: S => [['zul', S.data.ups.arena ? 'Tráeme chatarra y cristales y forjaré el Cañón de Arena Mk II.' : 'Encuentra el Cañón de Arena en las geodas y te lo mejoraré.'], ['zul', 'Y deja de golpear las paredes con la cabeza. Usa las garras.']] } }
  });
  P.SPEAKERS.varkh = { name: 'Varkh', por: 'por_varkh', col: '#3ae0c0' };
  P.SPEAKERS.zul = { name: 'Zul-Ankar', por: 'por_zul', col: '#ff8a3a' };
  P.D.VILLAGER_LINES.reptiliano.push('Las dunas vuelven a cantar. Hacía ciclos que no las oía.', 'Mi caravana sale mañana hacia el oasis. Por fin hay agua.');

  // ---------- música ----------
  const HIJAZ = [0, 1, 4, 5, 7, 8, 10];
  Object.assign(P.Audio.TRACKS, {
    khazir: { bpm: 96, root: 45, scale: HIJAZ, prog: [0, 1, 3, 0], lead: 'triangle', bass: 'triangle', arp: 'square', drums: 2, pad: false, seed: 141, marimba: true },
    khazir_r: { bpm: 100, root: 48, scale: [0, 2, 4, 5, 7, 9, 10], prog: [0, 3, 4, 0], lead: 'triangle', bass: 'sine', arp: 'triangle', drums: 2, pad: true, seed: 141, marimba: true },
    khazir_ow: { bpm: 108, root: 50, scale: HIJAZ, prog: [0, 4, 3, 1], lead: 'square', bass: 'triangle', arp: 'triangle', drums: 1, pad: false, seed: 151 }
  });

  // ---------- arte: extras de juego ----------
  Object.assign(P.ART.khazir, {
    seedMission: 's_rosas', seedName: 'Semilla de Coronela Solar', holoMission: 's_ecos_k',
    strata: ['rgba(255,214,150,0.10)', 'rgba(0,0,0,0)', 'rgba(110,30,20,0.13)', 'rgba(110,30,20,0.13)', 'rgba(255,236,190,0.07)', 'rgba(0,0,0,0)', 'rgba(60,10,30,0.10)'],
    rigidTrees: [1], treeVariants: [0, 0, 1],
    civs: ['reptiliano', 'reptiliano', 'arturiano', 'reptiliano', 'pleyadiano'],
    stone: ['#b8784a', '#e0a870', '#7a4a2e', '#ffd166', '#2ad8c0'],
    // partículas de ambiente: granos de arena, motas doradas y pétalos del desierto restaurado
    ambient(L, cx, cy, rf) {
      if (L.theme === 'facility' || L.theme === 'lab') return false;
      if (L.theme === 'cave') { if (L.t % 6 === 0) L.parts.add({ x: cx + P.rand(0, P.W), y: cy + P.rand(0, P.H), vy: -0.15, life: P.ri(60, 120), col: P.pick(Math.random() < rf ? ['#5ae8e0', '#ffd166', '#ffffff'] : ['#ff5ad0', '#c04ad0', '#ffb030']), size: 1, glow: 3 }); return true; }
      if (L.t % 4 === 0) { const r = Math.random() < rf; L.parts.add({ x: cx + P.rand(-30, P.W), y: cy + P.rand(0, P.H), vx: P.rand(0.5, 1.3), vy: P.rand(-0.15, 0.15), life: P.ri(60, 120), col: r ? P.pick(['#fff0c0', '#ffd890', '#ffffff']) : P.pick(['#e8a090', '#d8a058', '#ff9af0']), size: 1 }); }
      if (L.t % 16 === 0 && Math.random() < rf) L.parts.add({ x: cx + P.rand(-20, P.W), y: cy - 4, vx: P.rand(0.4, 0.9), vy: 0.4, life: 400, col: P.pick(['#ff5a8a', '#ffd166', '#ff8a3a']), size: 2, fade: false, fn: q => { q.vx = 0.6 + Math.sin(q.life * 0.05) * 0.6; q.vy = 0.4 + Math.cos(q.life * 0.07) * 0.2; } });
      return true;
    },
    // tormenta de arena: ráfagas periódicas que empujan al jugador (agacharse o la DEFENSA las resisten)
    levelUpdate(L) {
      if (!L.def.storm || L.restoredAll || L.def.boss) return;
      const s = L.storm || (L.storm = { dir: 1, a: 0 }), T = L.t % 480, p = L.player;
      if (T === 90) { s.dir = P.pick([-1, 1]); if (!L.stormTold) { L.stormTold = true; P.toast('¡Ráfaga de arena! Agáchate o usa la DEFENSA para resistir', { col: P.UIC.gold, life: 150 }); } }
      s.a = T < 90 ? 0 : T < 150 ? (T - 90) / 60 * 0.35 : T < 320 ? 1 : T < 380 ? 1 - (T - 320) / 60 : 0;
      if (s.a > 0.5 && !p.dead && !p.climb && !p.mantle && !L.cutscene && !L.scanning) {
        const calm = L.restoredAt(p.cx) ? 0.35 : 1, brace = p.crouch || p.shieldOn ? 0.12 : 1;
        p.move(s.dir * 0.8 * s.a * calm * brace, 0);
      }
      if (s.a > 0 && L.t % 2 === 0) for (let i = 0; i < 2; i++) L.parts.add({ x: L.cam.x + (s.dir > 0 ? -10 : P.W + 10), y: L.cam.y + P.rand(0, P.H), vx: s.dir * P.rand(4, 7) * s.a, vy: P.rand(-0.3, 0.3), life: 90, col: P.pick(L.A.stormCols || ['#e8b070', '#ffd8a0', '#c88a4a']), size: P.pick([1, 1, 2]) });
    },
    levelDraw(L, c) {
      const s = L.storm; if (!s || s.a <= 0) return;
      const calm = L.restoredFrac(); c.fillStyle = 'rgba(' + (L.A.stormHaze || '214,140,70') + ',' + (0.32 * s.a * (1 - calm * 0.6)) + ')'; c.fillRect(0, 0, P.W, P.H);
      for (let i = 0; i < 34; i++) { const y = (i * 37 + 11) % P.H, len = 24 + (i * 13) % 44, sp = 7 + (i % 4) * 2, x = ((L.t * sp * s.dir + i * 97) % (P.W + 90) + P.W + 90) % (P.W + 90) - 45; c.fillStyle = i % 3 ? 'rgba(' + (L.A.stormStreak || '255,226,180') + ',' + (0.5 * s.a) + ')' : 'rgba(' + (L.A.stormStreak2 || '200,120,60') + ',' + (0.45 * s.a) + ')'; c.fillRect(Math.round(x), y, len, i % 5 ? 1 : 2); }
    }
  });

  // ---------- criaturas propias ----------
  // Vorágulo: espera bajo la arena, muerde al jugador cercano, escupe arena y se vuelve a hundir
  P.SandWorm = class extends P.Enemy {
    constructor(L, x, y) { super(L, x - 8, y - 22, 16, 22, { kind: 'arenicola', hp: 16, dmg: 13, xp: 8, drops: { bio: 2 }, natural: true, spr: 'worm', heavy: true }); this.state = 'hide'; this.cd = P.ri(20, 60); this.untouchable = true; this.harmless = true; this.face = -1; }
    update() {
      if (this.commonUpdate()) return;
      const p = this.L.player, dx = p.cx - this.cx, dy = Math.abs(p.cy - this.cy); this.st++;
      if (this.state !== 'hide' && Math.abs(dx) > 2) this.face = Math.sign(dx);
      switch (this.state) {
        case 'hide':
          this.untouchable = true; this.harmless = true;
          if (this.t % 20 === 0) this.L.parts.add({ x: this.cx + P.rand(-6, 6), y: this.y + this.h - 2, vy: -P.rand(0.3, 1), life: 16, col: '#d8a058', size: 1 });
          if (this.passive) { if (this.st > 240) { this.state = 'peek'; this.st = 0; } }
          else if (--this.cd <= 0 && Math.abs(dx) < 56 && dy < 40) { this.state = 'rise'; this.st = 0; P.Audio.sfx('step'); }
          break;
        case 'peek': this.untouchable = false; this.harmless = true; if (this.st > 90 || !this.passive) { this.state = 'hide'; this.st = 0; this.cd = 40; } break;
        case 'rise': if (this.st > 12) { this.state = 'bite'; this.st = 0; this.untouchable = false; this.harmless = false; P.Audio.sfx('hit'); this.L.parts.burst(this.cx, this.y + this.h, 10, { col: '#e8a440', smin: 1, smax: 3, g: 0.2, size: 2 }); } break;
        case 'bite': if (this.st > 22) { this.state = 'out'; this.st = 0; } break;
        case 'out':
          this.harmless = false;
          if (this.st === 24 && Math.abs(dx) < 170) { this.L.add(new P.Proj(this.L, this.cx + this.face * 6, this.y + 4, this.face * P.clamp(Math.abs(dx) / 50, 1.3, 3), -2.8, { dmg: 9, spr: 'b_glob', grav: 0.14, life: 120 })); P.Audio.sfx('splash'); }
          if (this.st > 56) { this.state = 'sink'; this.st = 0; }
          break;
        case 'sink': this.harmless = true; if (this.st > 12) { this.state = 'hide'; this.st = 0; this.cd = P.ri(70, 110); this.untouchable = true; } break;
      }
      if (this.passive && this.state !== 'hide' && this.state !== 'peek') { this.state = 'sink'; }
    }
    draw(c, cx, cy) { const f = { hide: 3, peek: 1, rise: 1, bite: 2, out: this.st > 18 && this.st < 30 ? 2 : 0, sink: 1 }[this.state]; this.drawSpr(c, cx, cy, f); }
  };

  // KHAZIR reinterpreta los marcadores de entidades de la biblioteca de chunks
  const rk = (e, kind) => { e.kind = kind; return e; };
  P.LV.khazir.spawn = {
    c: (L, x, y) => L.add(rk(new P.Crab(L, x - 9, y, false), 'escorpion')),
    K: (L, x, y, m, R) => L.add(R ? rk(new P.Crab(L, x - 9, y, false), 'escorpion') : rk(new P.Crab(L, x - 10, y, true), 'escorpion_cy')),
    A: (L, x, y, m, R) => { if (!R) L.add(rk(new P.Alpha(L, x - 20, y), 'escorpion_rey')); },
    f: (L, x, y) => L.add(rk(new P.Frog(L, x - 7, y - 11), 'escarabajo')),
    d: (L, x, y) => L.add(rk(new P.Fly(L, x - 8, y - 20, false), 'buitre')),
    D: (L, x, y, m, R) => { const fac = L.theme === 'facility' || L.theme === 'lab'; if (!R) { const e = L.add(new P.Fly(L, x - 8, y - 20, true)); if (!fac) e.kind = 'halcon_dron'; } else if (!fac) L.add(rk(new P.Fly(L, x - 8, y - 20, false), 'buitre')); },
    l: (L, x, y) => L.add(rk(new P.Slug(L, x - 10, y - 8), 'tortuga')),
    p: (L, x, y, m, R) => { if (!R) L.add(rk(new P.Maw(L, x - 6, y - 16), 'cactus_fauces')); else L.add(new P.Decor(L, x, y, 'fern_r', 'salvia_roja')); },
    v: (L, x, y, m) => L.add(rk(new P.VSnake(L, x, m.y * TS), 'serpiente')),
    w: (L, x, y) => L.add(new P.SandWorm(L, x, y))
  };
  // personaje especial del mapa exterior
  P.LV.khazir.overworld.vip = { look: 'varkh', civ: 'reptiliano', talk: lib => [['varkh', lib >= 10 ? '¿Lo oyes, {N}? Las dunas cantan. La Ssynthra de Cristal ha vuelto a las Dunas del Amanecer.' : 'Mi clan vuelve a las dunas, {N}. Cada territorio liberado es una caravana que regresa.']] };
})();
