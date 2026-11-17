'use strict';
// NÍVORAH — datos del planeta, criaturas y reglas propias
(function () {
  const D = P.D, N = 'nivorah';
  Object.assign(D.planet(N), { ready: true, lair: 'el Corazón del Glaciar' });
  Object.assign(D.BOSSES.glorvax, { col: '#7ad8ff', col2: '#ff5af0' });

  // ---------- armas y mejoras ----------
  D.WEAPONS.crio = { name: 'Cañón Criogénico', icon: 'i_crio', planet: N, desc: 'Arma arturiana de investigación glaciar. Sus esferas de frío congelan a los enemigos durante un instante.', dmg: 7, rate: 20, speed: 5.6, spr: 'nv_b_crio', freeze: 50 };
  Object.assign(D.UPGRADES, {
    planeo: { name: 'Capa de Planeo', icon: 'i_glide', kind: 'Movimiento', planet: N, desc: 'Capa térmica arturiana. Mantén SALTO mientras caes para PLANEAR y cruzar grandes abismos.' },
    crio: { name: 'Cañón Criogénico', icon: 'i_crio', kind: 'ATAQUE', planet: N, desc: 'Nueva arma: esferas de frío que congelan a los enemigos. Cambia de arma con ' },
    termico: { name: 'Núcleo Térmico', icon: 'i_thermo', kind: 'DEFENSA', planet: N, desc: 'Calienta tu armadura: el agua helada o contaminada ya no te daña.' },
    boreal: { name: 'Corazón Boreal', icon: 'i_aurora', kind: 'SUPERATAQUE', planet: N, desc: 'Núcleo arrancado de GLORVAX. El Pulso Solar congela a todos los enemigos de la pantalla.' }
  });
  D.RECIPES.push({ id: 'crio_mk2', name: 'Cañón Criogénico Mk II', desc: '+30 % de daño del Cañón Criogénico.', cost: { scrap: 14, crys: 3 }, req: [], needUp: 'crio', needNpc: 'yrsa' });

  // ---------- Archivo Biológico ----------
  const sp = o => Object.assign({ planet: N, variant: 'natural' }, o);
  const GV = D.SPECIES.findIndex(s => s.id === 'glorvax'); if (GV >= 0) D.SPECIES.splice(GV, 1);
  D.SPECIES.push(
    sp({ id: 'gloton', col: 'fauna', spr: 'nv_krazith', name: 'Glotón Ártico', sci: 'Gulo glacialis', rarity: 'común', habitat: 'Llanuras nevadas.', behavior: 'Territorial. Carga de frente cuando algo se acerca a su madriguera.', diet: 'Raíces congeladas y carroña.', abilities: 'Pelaje que repele la nieve.', danger: 2, eco: 'Abre túneles en la nieve que usan otras especies.', lore: 'Los arturianos decían que un glotón nunca se pierde en la ventisca.', tasks: ['seen', { k: 'defeat', n: 3 }, { k: 'observe', n: 4 }] }),
    sp({ id: 'gloton_cy', col: 'fauna', spr: 'nv_krazith_cy', name: 'Glotón Ciberblindado', sci: 'Gulo glacialis (mod. Thersek)', rarity: 'poco común', variant: 'cibernética', base: 'gloton', habitat: 'Perímetro de las extractoras.', behavior: 'Centinela que dispara desde el lomo.', diet: 'Sondas del régimen.', abilities: 'Blindaje térmico.', danger: 3, eco: 'Ninguno.', lore: 'Placa de serie: «LOTE G-L. CRIOLABORATORIO THETA».', tasks: ['seen', { k: 'defeat', n: 6 }] }),
    sp({ id: 'mamut', col: 'fauna', spr: 'nv_krazith_alfa', name: 'Mamut de Escarcha', sci: 'Mammuthus boreal (mutación inducida)', rarity: 'rara', variant: 'mutada', base: 'gloton', habitat: 'Ventisca Eterna.', behavior: 'Gigante pacífico enloquecido por los implantes. Embiste y lanza fragmentos de hielo.', diet: 'Líquenes.', abilities: 'Colmillos de hielo vivo.', danger: 4, eco: 'Sus pisadas abrían caminos en la nieve.', lore: 'Los arturianos los guiaban con cánticos durante las migraciones.', tasks: ['seen', { k: 'defeat', n: 1 }] }),
    sp({ id: 'pinguino', col: 'fauna', spr: 'nv_frog', name: 'Pingüino Saltarín', sci: 'Saltospheniscus nivalis', rarity: 'común', habitat: 'Orillas de los lagos helados.', behavior: 'Salta con sus patas y lanza bolas de nieve con las aletas.', diet: 'Peces de deshielo.', abilities: 'Plumas que no se congelan.', danger: 1, eco: 'Controla los peces de los lagos.', lore: 'Las crías arturianas aprendían a lanzar bolas de nieve imitándolos.', tasks: ['seen', { k: 'defeat', n: 3 }, { k: 'observe', n: 4 }] }),
    sp({ id: 'polilla', col: 'fauna', spr: 'nv_dfly', name: 'Polilla Aurora', sci: 'Lepidoptera borealis', rarity: 'común', habitat: 'Cielos nocturnos.', behavior: 'Vuela siguiendo la luz de las auroras.', diet: 'Polen de Estrellina Polar.', abilities: 'Alas que reflejan la aurora.', danger: 1, eco: 'Poliniza las flores del glaciar.', lore: 'Se dice que las auroras son millones de lumivelas volando a la vez.', tasks: ['seen', { k: 'observe', n: 3 }] }),
    sp({ id: 'dron_gelido', col: 'fauna', spr: 'nv_dfly_cy', name: 'Dron Gélido', sci: 'Lepidoptera borealis (mod. Thersek)', rarity: 'poco común', variant: 'cibernética', base: 'polilla', habitat: 'Cielos de las estaciones.', behavior: 'Patrulla y dispara láseres.', diet: 'Batería criogénica.', abilities: 'Óptica térmica.', danger: 2, eco: 'Ninguno.', lore: 'Thersek los llama «copos obedientes».', tasks: ['seen', { k: 'defeat', n: 5 }] }),
    sp({ id: 'foca', col: 'fauna', spr: 'nv_slug', name: 'Foca Glaciar', sci: 'Phoca glacialis', rarity: 'común', habitat: 'Bordes del hielo.', behavior: 'Lenta en tierra, embiste si la acorralan.', diet: 'Peces y algas de hielo.', abilities: 'Grasa que resiste el frío extremo.', danger: 1, eco: 'Mantiene limpios los agujeros de respiración del hielo.', lore: 'Su canto bajo el hielo da nombre al Lago de los Susurros.', tasks: ['seen', { k: 'defeat', n: 2 }, { k: 'restored' }] }),
    sp({ id: 'murcielago', col: 'fauna', spr: 'nv_vsnake', name: 'Murciélago de Hielo', sci: 'Chiroptera crystallina', rarity: 'poco común', habitat: 'Techos de cuevas heladas.', behavior: 'Cuelga inmóvil y cae en picado sobre lo que pasa debajo.', diet: 'Insectos atrapados en el hielo.', abilities: 'Alas casi transparentes.', danger: 2, eco: 'Controla los insectos de las cavernas.', lore: 'Sus colonias brillan como lámparas cuando reflejan la luz.', tasks: ['seen', { k: 'defeat', n: 2 }] }),
    sp({ id: 'alce_boreal', col: 'fauna', spr: 'nv_grazer', name: 'Alce Boreal', sci: 'Alces crystallicornis', rarity: 'rara', restoredOnly: true, habitat: 'Tundra restaurada.', behavior: 'Pasta tranquilo bajo la aurora.', diet: 'Liquen Azul.', abilities: 'Cornamenta de cristal que capta la luz.', danger: 0, eco: 'Dispersa las esporas del Liquen Azul.', lore: 'Su cornamenta solo crece donde la aurora vuelve a brillar.', tasks: ['seen', { k: 'observe', n: 5 }] }),
    sp({ id: 'fenix_boreal', col: 'fauna', spr: 'nv_vellorn', name: 'Ylvaris Boreal', sci: 'Avis aurorae', rarity: 'legendaria', restoredOnly: true, habitat: 'Solo aparece en una NÍVORAH completamente restaurada.', behavior: 'Ave de hielo cuya cola enciende las auroras.', diet: 'Luz de las estrellas.', abilities: 'Plumas de hielo vivo.', danger: 0, eco: 'Se dice que cada aurora es un vuelo del fénix.', lore: 'Los arturianos fechaban sus calendarios por sus apariciones.', tasks: ['seen', { k: 'observe', n: 6 }] }),
    sp({ id: 'glorvax', col: 'fauna', spr: 'glorvax', boss: true, name: 'GLORVAX', title: 'Glorborg Flotante Gigante', sci: 'Echinoglobus aurorae (mod. Thersek)', rarity: 'única', variant: 'cibernética', habitat: 'Corazón del Glaciar.', behavior: 'Criatura de las auroras que flotaba en silencio sobre el lago helado. El chip de Thersek la volvió agresiva.', diet: 'Luz de las auroras.', abilities: 'Púas de hielo, embestida, granizo y rayo ocular.', danger: 5, eco: 'Sus púas sembraban cristales que alimentaban el bosque de Candelabros.', lore: 'Los arturianos la llamaban «el ojo del glaciar».', tasks: ['seen', { k: 'defeat', n: 1 }] }),
    sp({ id: 'farol_escarcha', col: 'flora', spr: 'nv_lamp', name: 'Farol de Escarcha', sci: 'Campanula glacialis', rarity: 'común', habitat: 'Llanuras y cuevas.', behavior: 'Su campana de hielo brilla en la oscuridad polar.', diet: 'Luz de las auroras.', abilities: 'Ilumina su entorno.', danger: 0, eco: 'Guía a las lumivelas nocturnas.', lore: 'Los caminos arturianos se marcaban con Faroles de Escarcha.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'liquen_azul', col: 'flora', spr: 'nv_fern_r', name: 'Liquen Azul', sci: 'Cladonia caerulea', rarity: 'común', habitat: 'Rocas y nieve.', behavior: 'Crece unos milímetros cada siglo.', diet: 'Fotosíntesis débil.', abilities: 'Sobrevive congelado durante años.', danger: 0, eco: 'Alimento de los Alces Boreales.', lore: 'Los arturianos medían la edad de las rocas por su liquen.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'hongo_gelido', col: 'flora', spr: 'nv_mush', name: 'Hongo Gélido', sci: 'Cryomyces toxicus', rarity: 'poco común', habitat: 'Zonas contaminadas.', behavior: 'Suelta esporas heladas al detectar vibraciones.', diet: 'Toxinas.', abilities: 'Esporas que congelan.', danger: 3, eco: 'Absorbe toxinas del suelo helado.', lore: 'Sus esporas se usaban para conservar medicinas.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'arbol_cristal', col: 'flora', spr: 'nv_bigmush', name: 'Arbusto de Cristal', sci: 'Crystalloramus nivalis', rarity: 'poco común', habitat: 'Bosques helados.', behavior: 'Sus ramas de cristal tintinean con el viento.', diet: 'Minerales del deshielo.', abilities: 'Refracta la luz en arcoíris.', danger: 0, eco: 'Refugio de las lumivelas.', lore: 'Cada rama marca un invierno de su vida.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'fumarola', col: 'flora', spr: 'nv_t_bulb_r', name: 'Fumarola Termal', sci: 'Vent geotermal', rarity: 'común', habitat: 'Grietas volcánicas del glaciar.', behavior: 'Expulsa vapor a presión.', diet: 'Calor del subsuelo.', abilities: 'Impulsa a quien la pisa.', danger: 0, eco: 'Crea oasis de calor donde vive la flora.', lore: 'Los arturianos construían sus estaciones junto a ellas.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'enredadera_artica', col: 'flora', spr: 'nv_t_vine_r', name: 'Enredadera Ártica', sci: 'Hedera glacialis', rarity: 'común', habitat: 'Paredes heladas.', behavior: 'Trepa buscando el calor de la roca.', diet: 'Fotosíntesis.', abilities: 'Fibras flexibles incluso congeladas.', danger: 0, eco: 'Une cornisas y refugios.', lore: 'Las cuerdas de escalada arturianas se trenzaban con ella.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'espina_hielo', col: 'flora', spr: 'nv_t_thorn_c', name: 'Espina de Hielo', sci: 'Glacies acuta', rarity: 'común', habitat: 'Suelos alterados.', behavior: 'Cristaliza la humedad contaminada en púas.', diet: 'Agua contaminada.', abilities: 'Púas afiladas.', danger: 2, eco: 'Encapsula las toxinas en hielo.', lore: 'Cuando la tierra sana, sus púas se derriten en flores.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'flor_caramb', col: 'flora', spr: 'nv_maw', name: 'Flor Carámbano', sci: 'Dionaea glacialis', rarity: 'poco común', variant: 'mutada', habitat: 'Orillas contaminadas.', behavior: 'Planta carnívora con fauces de hielo.', diet: 'Carnívora.', abilities: 'Mandíbulas heladas.', danger: 3, eco: 'En su forma natural, cazaba mosquitos de deshielo.', lore: 'Su forma natural se llamaba «Campanita de Thara».', tasks: ['seen', { k: 'defeat', n: 2 }] }),
    sp({ id: 'musgo_termal', col: 'flora', spr: 'nv_heal', name: 'Musgo Termal', sci: 'Bryum calidum', rarity: 'poco común', habitat: 'Junto a fumarolas.', behavior: 'Acumula savia caliente.', diet: 'Calor geotermal.', abilities: 'Calienta y repara tejidos.', danger: 0, eco: 'Refugio de la fauna en invierno.', lore: 'Los médicos arturianos lo usaban en cada cura.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'nenufar_termal', col: 'flora', spr: 'nv_lily', name: 'Nenúfar Termal', sci: 'Nymphaea calida', rarity: 'poco común', restoredOnly: true, habitat: 'Aguas limpias.', behavior: 'Flota en las zonas templadas del lago.', diet: 'Fotosíntesis acuática.', abilities: 'Mantiene el agua sin congelar.', danger: 0, eco: 'Respiraderos para la vida bajo el hielo.', lore: 'Su flor rosa marcaba los lugares seguros para bañarse.', tasks: ['seen', { k: 'scan' }] }),
    sp({ id: 'edelweiss', col: 'flora', spr: 'nv_orchid', name: 'Estrellina Polar', sci: 'Leontopodium stellare', rarity: 'rara', restoredOnly: true, habitat: 'Territorios liberados.', behavior: 'Florece bajo la aurora.', diet: 'Luz estelar.', abilities: 'Sus semillas brillan en la noche.', danger: 0, eco: 'Alimenta al Ylvaris Boreal.', lore: 'Yrsa quiere plantarlas en el observatorio de la nave.', tasks: ['seen', { k: 'scan' }] })
  );
  D.CODEX_REWARDS.nivorah = {
    fauna: { name: 'Pelaje de Escarcha', desc: 'Mod cyborg: +30 de energía de barrera.', mod: 'escarcha' },
    flora: { name: 'Savia de Aurora', desc: 'Mod cyborg: el SUPERATAQUE se carga un 15 % más rápido.', mod: 'aurora' },
    all: { name: 'Glaciar de la nave + Fénix', desc: 'Un rincón helado para los Jardines y el legendario Ylvaris Boreal se traslada a la nave.', creature: 'fenix_boreal' }
  };

  // ---------- misiones, logros, historia ----------
  Object.assign(D.MISSIONS, {
    s_ecos_n: { count: d => ['h17', 'h18', 'h19', 'h20', 'h21', 'h22', 'h23', 'h24'].filter(h => d.holos[h]).length, name: 'Ecos del glaciar', giver: 'ELARA', desc: 'Recupera los 8 registros holográficos ocultos en NÍVORAH.', goal: 8, reward: { xp: 240, crys: 3 } },
    s_yrsa: { name: 'La astrónoma perdida', giver: 'ELARA', desc: 'Una científica arturiana está prisionera en el Lago de los Susurros.', goal: 1, reward: { xp: 130 } },
    s_luma: { name: 'La cápsula criogénica', giver: 'Yrsa', desc: 'Reúne 3 componentes médicos en la Estación Médica Congelada y reactiva el generador.', goal: 1, reward: { xp: 200, crys: 2 } },
    s_edelweiss: { count: d => d.seeds_s_edelweiss || 0, name: 'Flores para el observatorio', giver: 'Yrsa', desc: 'Yrsa necesita 5 semillas de Estrellina Polar. Solo brotan en territorios liberados de NÍVORAH.', goal: 5, reward: { xp: 180, crys: 4 } }
  });
  D.ACHIEVEMENTS.push({ id: 'glorvax', name: 'Rompehielos', desc: 'Derrota a GLORVAX.' }, { id: 'lib_nivorah', name: 'Bajo la aurora', desc: 'Libera los 10 territorios de NÍVORAH.' }, { id: 'luma', name: 'Despertar médico', desc: 'Reactiva a LUMA.' });
  Object.assign(D.HOLOS, {
    h17: { title: 'Diario de Yrsa · Observatorio', text: 'Ciclo 900. La Esfera tapa ya el 60 % de Plenuria. Las auroras se apagan una a una. Sin luz, el glaciar avanza un metro cada día.' },
    h18: { title: 'Orden Esquelética 301 · Gerselle', text: 'Desmantelen los observatorios. Nadie en NÍVORAH debe volver a mirar las estrellas. Un pueblo que no ve el cielo no sueña con recuperarlo.' },
    h19: { title: 'Registro de Vel-Thara', text: 'Proyecto ALBA: el corazón solar de las unidades K se calibró aquí, con la luz de la aurora. Cada unidad guarda un fragmento del espectro.' },
    h20: { title: 'Nota de la Dra. Vel-Ora', text: 'He ocultado a LUMA en la cámara criogénica. Si alguien con el sello de la República llega, que la despierte. Ella sabrá qué hacer.' },
    h21: { title: 'Canción de la ventisca', text: '«Cierra los ojos, que el viento no ve; la aurora te guarda, la nieve también. Cinco luces en el cielo, cinco voces en la noche; cuando el sol regrese, volverá el derroche.»' },
    h22: { title: 'Bitácora de Thersek · Proyecto G', text: 'El espécimen G flota sin propósito sobre el lago. Le he dado uno: proteger la extractora central. Las criaturas de las auroras son tan… dóciles.' },
    h23: { title: 'Informe arturiano · Unidad K-7', text: 'La unidad K-7 muestra algo que ninguna otra unidad mostró: iniciativa. Recomendamos no borrar su memoria. El Consejo lo ha denegado.' },
    h24: { title: 'Transmisión interceptada · Merek', text: 'Si K-7 libera el tercer mundo, activaremos el protocolo NÉMESIS. No quiero errores esta vez, Gerselle.' }
  });
  Object.assign(D.MEMORIES, {
    m6: { title: 'Fragmento de memoria · La aurora', text: 'Estás tumbado en la nieve junto a una armadura rosada. Sobre vosotros, la aurora baila. «¿Crees que algún día veremos el sol completo?» Tú respondes que sí. Lo prometes.' },
    m7: { title: 'Fragmento de memoria · Borrado', text: 'Una sala fría. Una voz del Consejo: «Borrad su memoria». ELARA, joven, se niega: «Si lo borráis, deja de ser él». Después, oscuridad.' }
  });
  D.BOSS_OUTRO.glorvax = { up: 'boreal', skin: 'glaciar', mem: 'm7', lines: [['elara', 'GLORVAX se detiene. El chip de Thersek se ha quebrado como el hielo.'], ['yrsa', 'Mira, {N}… vuelve a flotar en silencio sobre el lago. Como antes. Las auroras regresan.'],
    ['elara', 'He recuperado un núcleo boreal del implante. Tu Pulso Solar podrá congelar a los enemigos.'], ['hero', 'Cada jefe lleva un trozo de tecnología ALBA dentro. Como yo.'], ['elara', 'Sí. Y empiezo a sospechar por qué. Integrando… ahora.']] };
  D.POST_BOSS.glorvax = [['gerselle', 'Tres mundos, K-7. Has costado a la República más que cualquier rebelión de la historia.'], ['merek', 'Gerselle, activa el protocolo NÉMESIS. Si la unidad quiere jugar a ser héroe, le daremos un rival a su altura.'], ['gerselle', 'Con gusto, presidente. Hasta pronto, {N}.'],
    ['elara', 'Transmisión cortada. NÉMESIS… no aparece en ningún archivo que pueda leer.'], ['elara', 'La ruta hacia THALASSYR se está abriendo, pero aún no podemos atravesar su tormenta. Descansa, {N}. LUMA cuidará de ti.']];
  D.FIRST_CLEAR = D.FIRST_CLEAR || {};
  D.FIRST_CLEAR.nivorah = (S, id) => {
    if (id === 1) { S.startMission('s_ecos_n'); S.startMission('s_yrsa'); }
    if (S.liberated(N) >= 10) S.ach('lib_nivorah');
    if (id === 11) S.ach('glorvax');
  };

  // ---------- rescate de Yrsa ----------
  D.RESCUE = D.RESCUE || {};
  D.RESCUE.yrsa = { name: 'Yrsa', mission: 's_yrsa', lines: [['yrsa', '¿Un cyborg de la República? Pensé que estaba alucinando por el frío.'], ['yrsa', 'Soy Yrsa, astrónoma de Vel-Thara. Me encerraron por negarme a desmontar los telescopios.'], ['hero', 'Soy {N}. Vengo a devolverle la luz a este mundo.'], ['yrsa', 'Entonces necesitarás a LUMA. Está dormida en la Estación Médica. Te ayudaré a despertarla.'], ['elara', 'Teletransporte preparado. Bienvenida a bordo, Yrsa.']],
    onRescue: S => { S.startMission('s_luma'); S.startMission('s_edelweiss'); },
    ship: { room: 'observatorio', off: 60, talk: S => [['yrsa', S.data.comps.unlocked.luma ? 'LUMA está bien. Dice que tu armadura «necesita amor». Yo diría que mucho.' : 'La cápsula de LUMA sigue en la Estación Médica. Tres componentes y el generador volverá a funcionar.'], ['yrsa', 'Semillas de Estrellina Polar: ' + (S.data.seeds_s_edelweiss || 0) + '/5. Florecen bajo la aurora.']] } };
  // si el observatorio aún no está reparado, Yrsa espera en el salón de las civilizaciones
  const shipRoom = D.RESCUE.yrsa.ship; Object.defineProperty(shipRoom, 'room', { get: () => (P.State.data && P.State.data.rooms.observatorio ? 'observatorio' : 'civs') });
  P.SPEAKERS.yrsa = { name: 'Yrsa', por: 'por_yrsa', col: '#bff6ff' };
  P.D.VILLAGER_LINES.arturiano.push('La aurora ha vuelto. Hacía generaciones que no la veíamos tan clara.', 'Reconstruiremos los observatorios, piedra a piedra.');

  // ---------- música (lidia, etérea, con campanas) ----------
  Object.assign(P.Audio.TRACKS, {
    nivorah: { bpm: 84, root: 50, scale: [0, 2, 4, 6, 7, 9, 11], prog: [0, 5, 3, 4], lead: 'sine', bass: 'triangle', arp: 'triangle', drums: 1, pad: true, seed: 211, marimba: true },
    nivorah_r: { bpm: 88, root: 53, scale: [0, 2, 4, 7, 9], prog: [0, 3, 4, 2], lead: 'sine', bass: 'sine', arp: 'triangle', drums: 1, pad: true, seed: 211, marimba: true },
    nivorah_ow: { bpm: 96, root: 52, scale: [0, 2, 4, 6, 7, 9, 11], prog: [0, 4, 5, 3], lead: 'triangle', bass: 'sine', arp: 'sine', drums: 0, pad: true, seed: 223 }
  });

  // ---------- reglas de arte y ambiente ----------
  const KA = P.ART.khazir;
  Object.assign(P.ART.nivorah, {
    seedMission: 's_edelweiss', seedName: 'Semilla de Estrellina Polar', holoMission: 's_ecos_n',
    civs: ['arturiano', 'arturiano', 'pleyadiano', 'arturiano', 'andromedano'], rigidTrees: [1], treeVariants: [0, 0, 0, 1],
    stone: ['#c8d4e8', '#ffffff', '#8a98bc', '#5ef0ff', '#ff8ad8'],
    strata: ['rgba(200,230,255,0.08)', 'rgba(0,0,0,0)', 'rgba(10,20,60,0.12)', 'rgba(0,0,0,0)', 'rgba(150,200,255,0.06)', 'rgba(10,20,60,0.08)'],
    stormCols: ['#ffffff', '#d8ecff', '#a8c8e8'], stormHaze: '200,220,245', stormStreak: '255,255,255', stormStreak2: '170,200,235',
    levelUpdate: KA.levelUpdate, levelDraw: KA.levelDraw,
    // copos de nieve (y destellos de aurora cuando el territorio sana)
    ambient(L, cx, cy, rf) {
      if (L.theme === 'facility' || L.theme === 'lab') return false;
      if (L.theme === 'cave') { if (L.t % 6 === 0) L.parts.add({ x: cx + P.rand(0, P.W), y: cy + P.rand(0, P.H), vy: 0.2, life: P.ri(60, 120), col: P.pick(['#bfefff', '#ffffff', '#b48cff']), size: 1, glow: 2 }); return true; }
      if (L.t % 3 === 0) L.parts.add({ x: cx + P.rand(-20, P.W + 20), y: cy - 4, vx: P.rand(-0.3, 0.3), vy: P.rand(0.4, 0.9), life: 400, col: Math.random() < rf ? '#ffffff' : '#c8c0dc', size: P.pick([1, 1, 2]), fade: false, fn: q => { q.vx = Math.sin((q.life + q.x) * 0.03) * 0.4; } });
      if (L.t % 20 === 0 && Math.random() < rf) L.parts.add({ x: cx + P.rand(0, P.W), y: cy + P.rand(0, P.H * 0.6), vy: -0.1, life: 90, col: P.pick(['#5ef0c0', '#b48cff']), size: 1, glow: 4 });
      return true;
    },
    // exterior: nevada suave y matiz de aurora cuando se liberan territorios
    owDraw(sc, c, cx, cy) {
      const lf = P.State.liberated(N) / 10;
      if (sc.t % 2 === 0) sc.parts.add({ x: cx + P.rand(-20, P.W + 20), y: cy - 4, vx: P.rand(-0.3, 0.3), vy: P.rand(0.5, 1), life: 320, col: '#ffffff', size: 1, fade: false });
      if (lf > 0) { c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(0, 0, 0, 90); g.addColorStop(0, 'rgba(94,240,192,' + (0.12 * lf) + ')'); g.addColorStop(1, 'rgba(180,140,255,0)'); c.fillStyle = g; c.fillRect(0, 0, P.W, 90); c.globalCompositeOperation = 'source-over'; }
    }
  });

  // ---------- entidades propias ----------
  // Carámbano: cuelga del techo, cruje cuando pasas debajo y cae; vuelve a crecer
  P.Icicle = class extends P.Ent {
    constructor(L, x, y, top) { super(L, x - 4, top, 8, 16); this.top = top; this.state = 'hang'; this.st = 0; }
    update() {
      this.t++; this.st++; const p = this.L.player;
      if (this.state === 'hang') { if (!p.dead && Math.abs(p.cx - this.cx) < 22 && p.y > this.y && p.y - this.y < 150) { this.state = 'shake'; this.st = 0; P.Audio.sfx('step'); } }
      else if (this.state === 'shake') { if (this.st > 26) { this.state = 'fall'; this.vy = 0; } }
      else if (this.state === 'fall') {
        this.vy = Math.min(this.vy + 0.35, 8); this.y += this.vy;
        if (!p.dead && P.overlap(this, p)) { p.hurt(14, this.cx); this.shatter(); }
        else if (this.L.coll(Math.floor(this.cx / TS), Math.floor((this.y + this.h) / TS)) === 1 || this.y > this.L.H) this.shatter();
      } else if (this.state === 'gone' && this.st > 260) { this.state = 'hang'; this.y = this.top; this.st = 0; }
    }
    shatter() { this.state = 'gone'; this.st = 0; P.Audio.sfx('break'); this.L.parts.burst(this.cx, this.y + this.h, 10, { col: '#bfefff', smin: 1, smax: 3, g: 0.2, size: 2 }); }
    draw(c, cx, cy) { if (this.state === 'gone') { const k = Math.min(1, this.st / 260); if (k > 0.3) { c.globalAlpha = k; P.spr(c, 'icicle', 0, Math.round(this.x - 1 - cx), Math.round(this.top - cy - (1 - k) * 8)); c.globalAlpha = 1; } return; } P.spr(c, 'icicle', this.state === 'shake' ? 1 : 0, Math.round(this.x - 1 - cx + (this.state === 'shake' ? (this.st % 4 < 2 ? 1 : -1) : 0)), Math.round(this.y - cy)); }
  };
  // Generador de la cápsula criogénica de LUMA
  P.MedGenerator = class extends P.Ent {
    constructor(L, x, y) { super(L, x - 14, y - 40, 28, 40); this.interact = !P.State.data.comps.unlocked.luma; }
    get prompt() { return 'Reactivar generador'; }
    comps() { const L = this.L; return (L.def.stars || []).filter((s, i) => s.t === 'comp' && L.lvs.stars['s' + i]).length; }
    use() {
      const S = P.State, n = this.comps();
      if (n < 3) { P.Audio.sfx('back'); P.toast('Faltan componentes médicos (' + n + '/3)', { col: P.UIC.red }); return; }
      this.interact = false; P.Audio.sfx('restore');
      this.L.say([['elara', 'Componentes instalados. Generador en línea… La cápsula se abre.'], ['luma', 'Bip… bip. Sistemas médicos activos. ¿Paciente? Detecto armadura dañada en un 43 %.'], ['hero', 'Soy {N}. Hola, LUMA.'], ['luma', 'Hola, {N}. A partir de ahora cuidaré de ti. Puedes llevarme como apoyo desde la Bahía de la nave.']], () => {
        S.data.comps.unlocked.luma = true; S.missionDone('s_luma'); S.ach('luma'); S.addXP(60); this.open = 1;
        P.toast('LUMA se une a tu equipo (Bahía de apoyo)', { col: P.UIC.green, icon: 'por_luma', life: 260 });
        for (let i = 0; i < 30; i++) this.L.parts.add({ x: this.cx + P.rand(-8, 8), y: this.y + P.rand(0, 30), vy: -P.rand(1, 3), life: 40, col: '#57ff7a', size: 2, glow: 4 });
      });
    }
    update() { this.t++; }
    draw(c, cx, cy) {
      const x = Math.round(this.x - cx), y = Math.round(this.y - cy), on = !!P.State.data.comps.unlocked.luma, n = this.comps();
      c.fillStyle = '#2e3346'; c.fillRect(x, y + 6, 28, 34); c.fillStyle = '#4e5872'; c.fillRect(x, y + 6, 28, 2); c.fillStyle = '#8a98bc'; c.fillRect(x, y + 6, 1, 34);
      c.fillStyle = on ? 'rgba(87,255,122,0.25)' : 'rgba(150,200,255,0.3)'; c.fillRect(x + 4, y + 10, 20, 24);
      if (!on) P.spr(c, 'luma', 0, x + 6, y + 14 + Math.round(Math.sin(this.t * 0.05)));
      c.strokeStyle = '#bfefff'; c.strokeRect(x + 4.5, y + 10.5, 19, 23);
      for (let i = 0; i < 3; i++) { c.fillStyle = i < n || on ? '#57ff7a' : '#3a2a3a'; c.fillRect(x + 6 + i * 6, y + 2, 4, 3); }
      P.drawGlow(c, x + 14, y + 22, 18, on ? '#57ff7a' : '#7ad8ff', 0.3 + Math.sin(this.t * 0.06) * 0.1);
    }
  };
  // los marcadores de la biblioteca de chunks se reinterpretan en NÍVORAH
  const rk = (e, kind) => { e.kind = kind; return e; };
  P.LV.nivorah.spawn = {
    c: (L, x, y) => L.add(rk(new P.Crab(L, x - 9, y, false), 'gloton')),
    K: (L, x, y, m, R) => L.add(R ? rk(new P.Crab(L, x - 9, y, false), 'gloton') : rk(new P.Crab(L, x - 10, y, true), 'gloton_cy')),
    A: (L, x, y, m, R) => { if (!R) { const e = L.add(rk(new P.Alpha(L, x - 20, y), 'mamut')); } },
    f: (L, x, y) => { const e = L.add(rk(new P.Frog(L, x - 7, y - 11), 'pinguino')); e.natural = true; },
    d: (L, x, y) => L.add(rk(new P.Fly(L, x - 8, y - 20, false), 'polilla')),
    D: (L, x, y, m, R) => { const fac = L.theme === 'facility' || L.theme === 'lab'; if (!R) { const e = L.add(new P.Fly(L, x - 8, y - 20, true)); if (!fac) e.kind = 'dron_gelido'; } else if (!fac) L.add(rk(new P.Fly(L, x - 8, y - 20, false), 'polilla')); },
    l: (L, x, y) => L.add(rk(new P.Slug(L, x - 10, y - 8), 'foca')),
    p: (L, x, y, m, R) => { if (!R) L.add(rk(new P.Maw(L, x - 6, y - 16), 'flor_caramb')); else L.add(new P.Decor(L, x, y, 'fern_r', 'liquen_azul')); },
    v: (L, x, y, m) => L.add(rk(new P.VSnake(L, x, m.y * TS), 'murcielago')),
    w: (L, x, y, m) => { let ty = m.y; while (ty > 0 && L.coll(m.x, ty - 1) !== 1) ty--; if (ty > 0 && m.y - ty < 12) L.add(new P.Icicle(L, x, y, ty * TS)); }
  };
  P.LV.nivorah.levels.find(l => l.id === 6).events[0].spawn = (L, x, y) => L.add(new P.MedGenerator(L, x, y));
  P.LV.nivorah.overworld.vip = { look: 'yrsa', civ: 'arturiano', talk: lib => [['yrsa', lib >= 10 ? '¿Ves el cielo, {N}? La aurora ha vuelto entera. Y dicen que el Ylvaris Boreal sobrevuela la Llanura de Escarcha.' : 'Cada territorio liberado devuelve un poco de color a la aurora. Sigue así, {N}.']] };
})();
