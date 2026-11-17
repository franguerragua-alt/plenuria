'use strict';
// Datos del universo de PLENURIA
P.D = {};
P.D.SHIP_NAME = 'Vigía del Alba';
P.D.DEFAULT_NAME = 'K-7';

P.D.PLANETS = [
  { id: 'verzara', name: 'VÉRZARA', desc: 'Selva venenosa', title: 'La Fronda Bioluminiscente', civ: 'pleyadiano', col: ['#1f7a3a', '#5ccf4a', '#7a3fb0'], orbit: 70, size: 10, ready: true,
    boss: 'krazthor', info: 'Selva alienígena de árboles colosales, pantanos tóxicos y ríos fluorescentes. Cuna de la botánica pleyadiana. Especie dominante: los Krazith espinados.' },
  { id: 'khazir', name: 'KHAZIR', desc: 'Dunas desérticas', title: 'El Mar de Arena Cantora', civ: 'reptiliano', col: ['#c08a3a', '#ffd08a', '#7a4a1a'], orbit: 92, size: 9, boss: 'zarmakh',
    info: 'Desiertos infinitos, cañones, templos enterrados y tormentas de arena. Hogar ancestral de los clanes reptilianos.' },
  { id: 'nivorah', name: 'NÍVORAH', desc: 'Mundo helado', title: 'El Glaciar de las Auroras', civ: 'arturiano', col: ['#8ab4e8', '#e8f4ff', '#4a5aa0'], orbit: 112, size: 9, boss: 'glorvax',
    info: 'Glaciares, cuevas de cristal y auroras. Los arturianos construyeron aquí sus observatorios y estaciones médicas.' },
  { id: 'thalassyr', name: 'THALASSYR', desc: 'Mundo oceánico', title: 'El Abismo de Coral Eléctrico', civ: 'lemuriano', col: ['#1a6aa0', '#5ef0e0', '#0a2a5a'], orbit: 132, size: 11, boss: 'thalzor',
    info: 'Océanos profundos, ciudades sumergidas lemurianas y arrecifes que brillan con electricidad.' },
  { id: 'umbrelia', name: 'UMBRÉLIA', desc: 'Mundo oscuro', title: 'La Penumbra Carmesí', civ: 'andromedano', col: ['#2a1a2a', '#c0283a', '#0a0a10'], orbit: 152, size: 9, boss: 'arachnara',
    info: 'Bosques sombríos de vegetación rojiza. Los andromedanos guardaban aquí sus archivos más secretos.' },
  { id: 'mykoris', name: 'MYKORIS', desc: 'Mundo fúngico', title: 'El Bosque de las Esporas Pensantes', civ: 'pleyadiano', col: ['#6a3ac0', '#5ef0a0', '#c04ad0'], orbit: 170, size: 10, boss: 'mykaron',
    info: 'Hongos gigantes, esporas flotantes y ciudades orgánicas simbióticas.' },
  { id: 'xertha', name: 'XÉRTHA', desc: 'Mundo colmena', title: 'La Gran Colmena Hexagonal', civ: 'arturiano', col: ['#d0a020', '#ffe080', '#7a5010'], orbit: 188, size: 10, boss: 'zyrkalia',
    info: 'Paisajes de estructuras hexagonales, túneles y cámaras de incubación de una sociedad insectoide.' },
  { id: 'ignaria', name: 'IGNÁRIA', desc: 'Mundo ígneo', title: 'Las Forjas del Núcleo', civ: 'reptiliano', col: ['#3a0a0a', '#ff5a1a', '#ffd166'], orbit: 206, size: 9, boss: 'magnarok',
    info: 'Volcanes, ríos de lava y antiguas fundiciones donde se forjaron las armas de la República.' },
  { id: 'aerthyon', name: 'AERTHYON', desc: 'Mundo del viento', title: 'El Archipiélago de las Tormentas', civ: 'andromedano', col: ['#3a4a8a', '#bfe8ff', '#1a1a3a'], orbit: 224, size: 11, boss: 'azhyrion',
    info: 'Islas flotantes, ciudades aéreas y tormentas eléctricas perpetuas. Último bastión antes de la Esfera.' }
];
P.D.planet = id => P.D.PLANETS.find(p => p.id === id);

P.D.BOSSES = {
  krazthor: { name: 'KRAZTHOR', title: 'Cangrejo Espinado Gigante', planet: 'verzara', col: '#ff5af0', col2: '#5cc06a' },
  zarmakh: { name: 'ZARMAKH', title: 'Gusano Gigante Cibernético', planet: 'khazir' },
  glorvax: { name: 'GLORVAX', title: 'Glorborg Flotante Gigante', planet: 'nivorah' },
  thalzor: { name: 'THALZOR', title: 'Pulpo Eléctrico Gigante', planet: 'thalassyr' },
  arachnara: { name: 'ARACHNARA', title: 'Madre Arácnida Roja', planet: 'umbrelia' },
  mykaron: { name: 'MYKARON', title: 'Rey Hongo', planet: 'mykoris' },
  zyrkalia: { name: 'ZYRKALIA', title: 'Reina Esférica Colménica', planet: 'xertha' },
  magnarok: { name: 'MAGNAROK', title: 'Mastodonte de Fuego', planet: 'ignaria' },
  azhyrion: { name: 'AZHYRION', title: 'Dragón de las Nubes', planet: 'aerthyon' }
};

// ---------- armas y mejoras ----------
P.D.WEAPONS = {
  blaster: { name: 'Bláster Solar K-1', icon: 'i_blaster', desc: 'Arma reglamentaria de la antigua República. Disparos rápidos de plasma solar de largo alcance.', dmg: 6, rate: 11, speed: 6.6, spr: 'b_blaster' },
  espinas: { name: 'Lanzaespinas Krazith', icon: 'i_spines', planet: 'verzara', desc: 'Dispara un abanico de tres espinas venenosas cultivadas a partir del caparazón Krazith. Corto alcance, envenena a criaturas y máquinas.', dmg: 4, rate: 24, speed: 5.4, spr: 'b_spine', poison: true }
};
P.D.UPGRADES = {
  doble_salto: { name: 'Propulsor de Esporas', icon: 'i_jump', kind: 'Movimiento', planet: 'verzara', desc: 'Cámaras de gas de Saltabulbo integradas en las botas. Permite un segundo salto en el aire. Abre rutas antes inaccesibles.' },
  espinas: { name: 'Lanzaespinas Krazith', icon: 'i_spines', kind: 'ATAQUE', planet: 'verzara', desc: 'Nueva arma: abanico de espinas venenosas. Cambia de arma con ' },
  membrana: { name: 'Membrana Quitinosa', icon: 'i_shield', kind: 'DEFENSA', planet: 'verzara', desc: 'Refuerza la barrera con quitina viva: el escudo REFLEJA los proyectiles y la parada perfecta aturde a los enemigos cercanos.' },
  prisma: { name: 'Cañón Prismático', icon: 'i_energy', kind: 'SUPERATAQUE', planet: 'verzara', desc: 'Núcleo arrancado del cañón de Krazthor. El Pulso Solar añade un rayo prismático que atraviesa toda la pantalla.' }
};

// ---------- árbol de habilidades ----------
P.D.SKILLS = [
  { id: 'a1', br: 0, name: 'Calibración I', desc: '+15 % de daño de todas las armas.', req: [] },
  { id: 'a2', br: 0, name: 'Cadencia Rápida', desc: 'Disparas un 20 % más rápido.', req: ['a1'] },
  { id: 'a3', br: 0, name: 'Disparo Cargado', desc: 'Mantén ATAQUE para cargar un disparo triple de energía.', req: ['a1'] },
  { id: 'a4', br: 0, name: 'Calibración II', desc: '+20 % de daño adicional.', req: ['a2'] },
  { id: 'a5', br: 0, name: 'Golpe Crítico', desc: '12 % de probabilidad de causar daño doble.', req: ['a4'] },
  { id: 'd1', br: 1, name: 'Placas Reforzadas', desc: '+25 de salud máxima.', req: [] },
  { id: 'd2', br: 1, name: 'Escudo Eficiente', desc: 'La DEFENSA consume un 35 % menos de energía de barrera.', req: ['d1'] },
  { id: 'd3', br: 1, name: 'Reflejos de Combate', desc: 'Ventana de parada perfecta más amplia.', req: ['d1'] },
  { id: 'd4', br: 1, name: 'Placas Reforzadas II', desc: '+35 de salud máxima.', req: ['d2'] },
  { id: 'd5', br: 1, name: 'Nanorreparación', desc: 'Recuperas salud lentamente si no recibes daño durante 5 s.', req: ['d4'] },
  { id: 'e1', br: 2, name: 'Batería Ampliada', desc: 'El SUPERATAQUE se carga un 30 % más rápido.', req: [] },
  { id: 'e2', br: 2, name: 'Esquiva Fantasma', desc: 'Esquiva más larga e invulnerable; recarga un 25 % más rápida.', req: ['e1'] },
  { id: 'e3', br: 2, name: 'Imán de Recursos', desc: 'Atraes XP y recursos desde mucho más lejos.', req: ['e1'] },
  { id: 'e4', br: 2, name: 'Pulso Solar II', desc: '+40 % de daño del SUPERATAQUE.', req: ['e2'] },
  { id: 'e5', br: 2, name: 'Sobrecarga', desc: 'El SUPERATAQUE devuelve el 25 % de su energía.', req: ['e4'] }
];
P.D.SKILL_BRANCHES = ['ATAQUE', 'DEFENSA', 'ENERGÍA'];

// ---------- taller ----------
P.D.RECIPES = [
  { id: 'blaster_mk2', name: 'Bláster Mk II', desc: '+25 % de daño del Bláster Solar.', cost: { scrap: 12, crys: 1 }, req: [] },
  { id: 'blaster_mk3', name: 'Bláster Mk III', desc: '+25 % de daño adicional del Bláster Solar.', cost: { scrap: 25, crys: 4 }, req: ['blaster_mk2'], needNpc: 'kairo' },
  { id: 'espinas_mk2', name: 'Espinas Reforzadas', desc: 'El Lanzaespinas dispara 5 espinas.', cost: { bio: 15, scrap: 8, crys: 2 }, req: [], needUp: 'espinas' },
  { id: 'escudo_cap', name: 'Condensador de Barrera', desc: '+40 de energía de barrera (DEFENSA).', cost: { scrap: 10, bio: 6 }, req: [] },
  { id: 'vitalidad', name: 'Matriz de Vitalidad', desc: '+15 de salud máxima.', cost: { bio: 20, crys: 2 }, req: [] },
  { id: 'bateria', name: 'Batería Solar', desc: 'Empiezas cada nivel con 40 de energía de SUPERATAQUE.', cost: { crys: 3, scrap: 6 }, req: [], needNpc: 'kairo' },
  { id: 'rep_observatorio', name: 'Reparar: Observatorio', desc: 'Restaura los ventanales de observación de la nave.', cost: { scrap: 15, crys: 2 }, req: [], room: 'observatorio' },
  { id: 'rep_habitaciones', name: 'Reparar: Habitaciones', desc: 'Hogares para los supervivientes rescatados.', cost: { scrap: 10, bio: 10 }, req: [], room: 'habitaciones' },
  { id: 'rep_jardin', name: 'Reparar: Jardines', desc: 'Hábitats controlados para criaturas rescatadas.', cost: { bio: 25, crys: 1 }, req: [], room: 'jardin' },
  { id: 'rep_entrenamiento', name: 'Reparar: Zona de entrenamiento', desc: 'Sala de práctica con dianas holográficas.', cost: { scrap: 12 }, req: [], room: 'entrenamiento' }
];

// ---------- salas de la nave ----------
P.D.ROOMS = [
  { id: 'camarote', name: 'Camarote', fn: 'Guardar partida · cambiar nombre' },
  { id: 'puente', name: 'Puente de mando', fn: 'ELARA · historia y misiones' },
  { id: 'navegacion', name: 'Sala de navegación galáctica', fn: 'Mapa galáctico' },
  { id: 'archivo', name: 'Archivo Biológico de Plenuria', fn: 'Bestiario y Herbario', lock: 'Se reactiva tras liberar el primer territorio' },
  { id: 'taller', name: 'Taller de reparaciones', fn: 'Fabricación y reparaciones', lock: 'Se reactiva tras liberar el primer territorio' },
  { id: 'laboratorio', name: 'Laboratorio de modificaciones cyborg', fn: 'Árbol de habilidades', lock: 'Requiere liberar el Pantano de Fluorita' },
  { id: 'arsenal', name: 'Arsenal', fn: 'Armas, mejoras y armaduras', lock: 'Requiere tu primera mejora planetaria' },
  { id: 'invernadero', name: 'Invernaderos', fn: 'Flora recuperada', lock: 'Requiere una botánica a bordo' },
  { id: 'comunicaciones', name: 'Centro de comunicaciones', fn: 'Transmisiones y registros', lock: 'Requiere liberar la Extractora Gris-7' },
  { id: 'hangar', name: 'Bahía de apoyo', fn: 'Selección de compañeros (2 espacios)', lock: 'Requiere liberar el Nido de Krazith' },
  { id: 'entrenamiento', name: 'Zona de entrenamiento', fn: 'Práctica de combate', lock: 'Repárala en el Taller o rescata a un maestro' },
  { id: 'observatorio', name: 'Observatorio espacial', fn: 'Ventanales y estado del sistema', lock: 'Repárala en el Taller' },
  { id: 'jardin', name: 'Jardines', fn: 'Hábitats de criaturas rescatadas', lock: 'Repárala en el Taller' },
  { id: 'habitaciones', name: 'Habitaciones', fn: 'Hogar de los rescatados', lock: 'Repárala en el Taller' },
  { id: 'trofeos', name: 'Sala de trofeos', fn: 'Trofeos, logros y estadísticas', lock: 'Requiere derrotar a un jefe planetario' },
  { id: 'civs', name: 'Salón de las Cinco Civilizaciones', fn: 'Espacios de cada pueblo', lock: 'Requiere rescatar a un superviviente' }
];

// ---------- compañeros de apoyo ----------
P.D.COMPANIONS = [
  { id: 'luma', name: 'LUMA', role: 'Sanación', planet: 'nivorah', por: 'por_luma', spr: 'luma',
    desc: 'Robot médico arturiano. Repara tu armadura cuando tu salud baja (recarga de 20 s) y emite pulsos curativos.', mission: 'La Estación Médica Congelada (NÍVORAH)',
    hint: 'Una antigua estación médica yace bajo el hielo de NÍVORAH. Algo duerme en su cámara criogénica.' },
  { id: 'twins', name: 'BRASA y BRISA', role: 'Apoyo ofensivo', planet: 'thalassyr', por: 'por_twins', spr: 'brasa',
    desc: 'Robots gemelos de combate (rojo y azul). Te siguen y disparan láseres básicos a los enemigos cercanos. Ocupan un solo espacio.', mission: 'El Laboratorio Sumergido (THALASSYR)',
    hint: 'Un laboratorio lemuriano sumergido en THALASSYR todavía emite una señal doble.' },
  { id: 'nova', name: 'NOVA', role: 'Rescate de emergencia', planet: 'umbrelia', por: 'por_nova', spr: 'nova',
    desc: 'Cuando tu salud llega a cero, aparece para rescatarte: recupera el 75 % de tu salud y elimina la mitad de los enemigos (o daña al jefe). Una vez por nivel.', mission: 'El Refugio Secreto (UMBRÉLIA)',
    hint: 'Tus archivos personales mencionan un refugio en UMBRÉLIA. Y un nombre: N-0.' },
  { id: 'sirio', name: 'SIRIO', role: 'Sabueso Celestial', planet: 'aerthyon', por: 'por_sirio', spr: 'sirio',
    desc: 'Lobo blanco de origen desconocido. Detecta enemigos, trampas y secretos, muerde a los enemigos cercanos, a veces te protege de golpes peligrosos y alerta de la presencia de jefes.', mission: 'Ruinas Flotantes (AERTHYON, nivel 1)',
    hint: 'Algo aúlla entre las ruinas flotantes del primer nivel de AERTHYON.' }
];

// ---------- Archivo Biológico ----------
// tareas: 'seen' | {k:'defeat',n} | {k:'observe',n:segundos} | {k:'scan'} | {k:'restored'}
P.D.SPECIES = [
  // fauna de Vérzara
  { id: 'krazith', col: 'fauna', planet: 'verzara', spr: 'krazith', name: 'Krazith Espinado', sci: 'Spinocancer verzarae', rarity: 'común', variant: 'natural',
    habitat: 'Suelos húmedos y raíces de Ceibárbora.', behavior: 'Territorial. Patrulla en pequeños grupos y embiste con sus pinzas cuando algo invade su zona.',
    diet: 'Detritívoro: hojas caídas, hongos y restos orgánicos.', abilities: 'Caparazón con púas que se regeneran cada estación.', danger: 2,
    eco: 'Recicla la materia orgánica del suelo de la selva. Sin ellos, las raíces se asfixiarían.', lore: 'Los pleyadianos los consideraban guardianes de las raíces. Sus mudas servían para fabricar instrumentos musicales.',
    tasks: ['seen', { k: 'defeat', n: 3 }, { k: 'observe', n: 4 }] },
  { id: 'krazith_cy', col: 'fauna', planet: 'verzara', spr: 'krazith_cy', name: 'Krazith Ciberacorazado', sci: 'Spinocancer verzarae (mod. Thersek)', rarity: 'poco común', variant: 'cibernética', base: 'krazith',
    habitat: 'Alrededor de las extractoras invasoras.', behavior: 'Agresivo y obediente. Un chip neural anula su instinto territorial y lo convierte en centinela.',
    diet: 'Alimentado por sondas de nutrientes del régimen.', abilities: 'Placas de blindaje y una torreta dorsal de plasma.', danger: 3,
    eco: 'Ninguno: su presencia desplaza a los Krazith naturales.', lore: 'Etiqueta grabada en el blindaje: «LOTE K-Z. PROPIEDAD DEL VICEPRESIDENTE THERSEK».',
    tasks: ['seen', { k: 'defeat', n: 6 }] },
  { id: 'krazith_alfa', col: 'fauna', planet: 'verzara', spr: 'krazith_alfa', name: 'Krazith Alfa', sci: 'Spinocancer rex (mutación inducida)', rarity: 'rara', variant: 'mutada', base: 'krazith',
    habitat: 'Riberas del Río Fluorescente.', behavior: 'Líder de colonia mutado por la radiación de las extractoras. Embiste y lanza púas.',
    diet: 'Omnívoro voraz.', abilities: 'Corona de púas doradas, fuerza descomunal.', danger: 4,
    eco: 'Originalmente regulaba la población de su colonia.', lore: 'Antes de la invasión, el Alfa solo luchaba una vez al año, en la Danza de las Mudas.',
    tasks: ['seen', { k: 'defeat', n: 1 }] },
  { id: 'frog', col: 'fauna', planet: 'verzara', spr: 'frog', name: 'Fluorílido', sci: 'Luminorana acida', rarity: 'común', variant: 'natural',
    habitat: 'Pantanos de fluorita y orillas de los ríos.', behavior: 'Salta largas distancias. Escupe glóbulos ácidos cuando se siente amenazado.',
    diet: 'Insectos lumínicos y larvas de Zumbadera.', abilities: 'Glándulas ácidas y piel bioluminiscente.', danger: 2,
    eco: 'Controla las plagas de insectos del pantano.', lore: 'Su canto nocturno marca las horas en las aldeas pleyadianas.',
    tasks: ['seen', { k: 'defeat', n: 3 }, { k: 'observe', n: 4 }] },
  { id: 'dfly', col: 'fauna', planet: 'verzara', spr: 'dfly', name: 'Zumbadera Lumínica', sci: 'Odonata fulgens', rarity: 'común', variant: 'natural',
    habitat: 'Dosel y claros iluminados.', behavior: 'Vuela en trayectorias ondulantes. Se lanza en picado contra intrusos cuando el aire está contaminado.',
    diet: 'Néctar de Lumbrela y polen.', abilities: 'Alas que dispersan luz.', danger: 1,
    eco: 'Principal polinizadora de la Lumbrela.', lore: 'Las niñas y niños de Lirae aprendían a leer siguiendo sus destellos.',
    tasks: ['seen', { k: 'observe', n: 3 }] },
  { id: 'dfly_cy', col: 'fauna', planet: 'verzara', spr: 'dfly_cy', name: 'Zumbadrón', sci: 'Odonata fulgens (mod. Thersek)', rarity: 'poco común', variant: 'cibernética', base: 'dfly',
    habitat: 'Perímetro de las instalaciones invasoras.', behavior: 'Dron de vigilancia construido sobre un cuerpo vivo. Dispara láseres.',
    diet: 'Batería de plasma.', abilities: 'Óptica de rastreo y cañón láser.', danger: 2,
    eco: 'Ninguno.', lore: 'Thersek llamaba a estos híbridos «polinizadores de obediencia».',
    tasks: ['seen', { k: 'defeat', n: 5 }] },
  { id: 'slug', col: 'fauna', planet: 'verzara', spr: 'slug', name: 'Limaco Ácido', sci: 'Limax corrodens', rarity: 'común', variant: 'natural',
    habitat: 'Cuevas húmedas y suelos podridos.', behavior: 'Lento y resistente. Deja un rastro ácido a su paso.',
    diet: 'Madera muerta y minerales.', abilities: 'Mucosa corrosiva, cuerpo blando muy resistente.', danger: 1,
    eco: 'Descompone troncos caídos y libera minerales.', lore: 'Su rastro, diluido, era un fertilizante muy apreciado.',
    tasks: ['seen', { k: 'defeat', n: 2 }, { k: 'restored' }] },
  { id: 'vsnake', col: 'fauna', planet: 'verzara', spr: 'vsnake', name: 'Gorgovaina', sci: 'Serpens lianoides', rarity: 'poco común', variant: 'natural',
    habitat: 'Techos de cuevas y ramas altas.', behavior: 'Se camufla como una liana y cae sobre sus presas.',
    diet: 'Pequeños anfibios.', abilities: 'Camuflaje vegetal perfecto.', danger: 2,
    eco: 'Mantiene equilibrada la población de Fluorílidos.', lore: 'Los recolectores pleyadianos tiraban de cada liana antes de trepar.',
    tasks: ['seen', { k: 'defeat', n: 2 }] },
  { id: 'grazer', col: 'fauna', planet: 'verzara', spr: 'grazer', name: 'Bramoco', sci: 'Bovimuscus placidus', rarity: 'rara', variant: 'natural', restoredOnly: true,
    habitat: 'Claros restaurados.', behavior: 'Herbívoro tranquilo que pasta en manadas. Solo regresa cuando el suelo deja de estar contaminado.',
    diet: 'Musgo bioluminiscente.', abilities: 'El musgo de su lomo brilla más cuanto más sano está el ecosistema.', danger: 0,
    eco: 'Indicador vivo de la salud de la selva.', lore: 'Un dicho pleyadiano: «Donde pasta el Bramoco, la selva respira».',
    tasks: ['seen', { k: 'observe', n: 5 }] },
  { id: 'vellorn', col: 'fauna', planet: 'verzara', spr: 'vellorn', name: 'Vellorn de Lirae', sci: 'Cervus lumenarius', rarity: 'legendaria', variant: 'natural', restoredOnly: true,
    habitat: 'Desconocido. Solo aparece en una Vérzara completamente restaurada.', behavior: 'Esquivo y sabio. Observa a quienes sanan la selva.',
    diet: 'Rocío de Orquídea Solar.', abilities: 'Astas de cristal que almacenan luz solar.', danger: 0,
    eco: 'Se dice que sus astas guardan la memoria de la selva.', lore: 'Leyenda pleyadiana: el Vellorn solo se muestra ante quien devuelve la vida a toda Vérzara.',
    tasks: ['seen', { k: 'observe', n: 6 }] },
  { id: 'krazthor', col: 'fauna', planet: 'verzara', spr: 'krazthor', boss: true, name: 'KRAZTHOR', title: 'Cangrejo Espinado Gigante', sci: 'Spinocancer imperator (mod. Thersek)', rarity: 'única', variant: 'cibernética', base: 'krazith',
    habitat: 'Fosa de Coral Espinado, corazón del pantano.', behavior: 'Antiguo rey de los Krazith. Un cañón prismático robótico domina su mente y su cuerpo.',
    diet: 'Energía del cañón y biomasa contaminada.', abilities: 'Pinzas trituradoras, lluvia de púas, enterramiento y rayo prismático.', danger: 5,
    eco: 'Era el patriarca de todas las colonias de Krazith.', lore: 'El núcleo de su cañón emite una firma energética idéntica a la de tu propio núcleo.',
    tasks: ['seen', { k: 'defeat', n: 1 }] },
  // flora de Vérzara
  { id: 'helecho', col: 'flora', planet: 'verzara', spr: 'fern_r', name: 'Helecho Plumífero', sci: 'Pteris plumosa', rarity: 'común', variant: 'natural',
    habitat: 'Sotobosque.', behavior: 'Sus frondas se orientan hacia la bioluminiscencia.', diet: 'Fotosíntesis de luz débil.', abilities: 'Esporas que aromatizan el aire.', danger: 0,
    eco: 'Refugio de larvas e insectos.', lore: 'Se tejían sus frondas en las capas ceremoniales pleyadianas.', tasks: ['seen', { k: 'scan' }] },
  { id: 'lumbrela', col: 'flora', planet: 'verzara', spr: 'lamp', name: 'Lumbrela', sci: 'Lucerna verzarae', rarity: 'común', variant: 'natural',
    habitat: 'Claros y senderos.', behavior: 'Su bulbo acumula luz durante el día y la libera de noche.', diet: 'Luz y néctar mineral.', abilities: 'Ilumina su entorno.', danger: 0,
    eco: 'Guía a los polinizadores nocturnos.', lore: 'Las aldeas de Lirae se alumbraban con Lumbrelas plantadas en hileras.', tasks: ['seen', { k: 'scan' }] },
  { id: 'toxomiceto', col: 'flora', planet: 'verzara', spr: 'mush', name: 'Tóxomiceto Ámbar', sci: 'Amanita fumosa', rarity: 'poco común', variant: 'natural',
    habitat: 'Zonas sombrías y contaminadas.', behavior: 'Libera nubes de esporas tóxicas al detectar vibraciones.', diet: 'Materia en descomposición.', abilities: 'Esporas venenosas.', danger: 3,
    eco: 'Descompone materia y filtra toxinas del suelo.', lore: 'En dosis mínimas, sus esporas eran un potente anestésico.', tasks: ['seen', { k: 'scan' }] },
  { id: 'bulbo', col: 'flora', planet: 'verzara', spr: 't_bulb_r', name: 'Saltabulbo', sci: 'Bulbus saliens', rarity: 'común', variant: 'natural',
    habitat: 'Bordes de barrancos.', behavior: 'Se comprime y expulsa gas para dispersar semillas a gran altura.', diet: 'Gases del subsuelo.', abilities: 'Impulsa a quien lo pisa.', danger: 0,
    eco: 'Dispersa semillas por toda la selva.', lore: 'Su gas inspiró el Propulsor de Esporas.', tasks: ['seen', { k: 'scan' }] },
  { id: 'vidlumbre', col: 'flora', planet: 'verzara', spr: 't_vine_r', name: 'Vidlumbre', sci: 'Vitis luminosa', rarity: 'común', variant: 'natural',
    habitat: 'Troncos y paredes de roca.', behavior: 'Trepa buscando la luz. Resiste el peso de un cyborg.', diet: 'Fotosíntesis.', abilities: 'Fibras extremadamente resistentes.', danger: 0,
    eco: 'Conecta el suelo con el dosel; es una autopista para la fauna.', lore: 'Las cuerdas pleyadianas se trenzaban con Vidlumbre.', tasks: ['seen', { k: 'scan' }] },
  { id: 'espinaria', col: 'flora', planet: 'verzara', spr: 't_thorn_c', name: 'Espinaria Púrpura', sci: 'Rubus violaceus', rarity: 'común', variant: 'natural',
    habitat: 'Suelos alterados.', behavior: 'Crece a gran velocidad donde la tierra fue dañada.', diet: 'Toxinas del suelo.', abilities: 'Espinas afiladas.', danger: 2,
    eco: 'Protege el suelo dañado mientras se recupera.', lore: 'Cuando la selva sana, la Espinaria florece en rosa.', tasks: ['seen', { k: 'scan' }] },
  { id: 'fauces', col: 'flora', planet: 'verzara', spr: 'maw', name: 'Fauces Purpúreas', sci: 'Dionaea vorax', rarity: 'poco común', variant: 'mutada',
    habitat: 'Pantanos tóxicos.', behavior: 'Planta carnívora que muerde y escupe semillas. La contaminación la volvió gigantesca.', diet: 'Carnívora.', abilities: 'Mandíbulas vegetales y semillas proyectil.', danger: 3,
    eco: 'En su forma natural, del tamaño de una mano, controlaba insectos.', lore: 'Su versión natural se llamaba «Boquita de Lirae».', tasks: ['seen', { k: 'defeat', n: 2 }] },
  { id: 'salvia', col: 'flora', planet: 'verzara', spr: 'heal', name: 'Raíz de Salvia Celeste', sci: 'Salvia caelestis', rarity: 'poco común', variant: 'natural',
    habitat: 'Junto a las ruinas pleyadianas.', behavior: 'Su bulbo acumula savia regenerativa.', diet: 'Agua subterránea.', abilities: 'Restaura tejidos y circuitos biológicos.', danger: 0,
    eco: 'Medicina de la fauna herida.', lore: 'Los sanadores pleyadianos la cultivaban junto a cada templo.', tasks: ['seen', { k: 'scan' }] },
  { id: 'nenufar', col: 'flora', planet: 'verzara', spr: 'lily', name: 'Nenúfar de Fluorita', sci: 'Nymphaea fluorita', rarity: 'poco común', variant: 'natural', restoredOnly: true,
    habitat: 'Aguas limpias.', behavior: 'Solo florece cuando el agua deja de ser tóxica.', diet: 'Fotosíntesis acuática.', abilities: 'Purifica el agua.', danger: 0,
    eco: 'Oxigena ríos y pantanos.', lore: 'Su flor rosa era el símbolo del Consejo de Vérzara.', tasks: ['seen', { k: 'scan' }] },
  { id: 'orquidea', col: 'flora', planet: 'verzara', spr: 'orchid', name: 'Orquídea Solar', sci: 'Orchis heliaca', rarity: 'rara', variant: 'natural', restoredOnly: true,
    habitat: 'Territorios liberados.', behavior: 'Brota instantáneamente cuando la luz y el suelo sanan.', diet: 'Luz solar pura.', abilities: 'Sus semillas almacenan luz.', danger: 0,
    eco: 'Alimenta al legendario Vellorn.', lore: 'Sylaë cree que podría volver a florecer incluso dentro de una nave.', tasks: ['seen', { k: 'scan' }] },
  { id: 'sombrilla', col: 'flora', planet: 'verzara', spr: 'bigmush', name: 'Sombrilla Micélica', sci: 'Mycena gigantea', rarity: 'poco común', variant: 'natural',
    habitat: 'Bosque de esporas.', behavior: 'Hongo gigante cuyo micelio conecta árboles lejanos.', diet: 'Simbiosis con raíces.', abilities: 'Comunicación química entre plantas.', danger: 0,
    eco: 'La «red nerviosa» de la selva.', lore: 'Mnemo sospecha que estos hongos guardan recuerdos de la selva.', tasks: ['seen', { k: 'scan' }] }
];
// jefes de los demás planetas (siluetas hasta que se enfrenten)
for (const id in P.D.BOSSES) if (id !== 'krazthor') {
  const b = P.D.BOSSES[id];
  P.D.SPECIES.push({ id, col: 'fauna', planet: b.planet, spr: 'sil_' + id, boss: true, name: b.name, title: b.title, rarity: 'única', variant: 'cibernética', hidden: true,
    habitat: '???', behavior: '???', diet: '???', abilities: '???', danger: 5, eco: '???', lore: 'Señal colosal detectada en ' + P.D.planet(b.planet).name + '.', tasks: ['seen', { k: 'defeat', n: 1 }] });
}
P.D.species = id => P.D.SPECIES.find(s => s.id === id);
P.D.RARITY_COL = { 'común': '#c8d4e8', 'poco común': '#7dffa0', 'rara': '#5ee8ff', 'legendaria': '#ffd166', 'única': '#ff8ad8' };
P.D.CODEX_REWARDS = {
  verzara: {
    fauna: { name: 'Instinto Krazith', desc: 'Mod cyborg: +12 % de daño contra criaturas.', mod: 'instinto' },
    flora: { name: 'Fotosíntesis', desc: 'Mod cyborg: regeneras salud lentamente fuera de combate.', mod: 'fotosintesis' },
    all: { name: 'Santuario de Vérzara + Vellorn', desc: 'Decoración para los Jardines y el legendario Vellorn se traslada a un hábitat de la nave.', creature: 'vellorn' }
  }
};

// ---------- misiones ----------
P.D.MISSIONS = {
  s_semillas: { count: d => d.seeds || 0, name: 'Semillas de luz', giver: 'Sylaë', desc: 'Sylaë necesita 5 semillas de Orquídea Solar. Solo brotan en territorios liberados de Vérzara.', goal: 5, reward: { xp: 150, crys: 3 } },
  s_ecos: { count: d => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8'].filter(h => d.holos[h]).length, name: 'Ecos de Lirae', giver: 'ELARA', desc: 'Recupera los 8 registros holográficos ocultos en Vérzara.', goal: 8, reward: { xp: 200, crys: 2 } },
  s_cazador: { name: 'Cazador de quimeras', giver: 'Ssaru', desc: 'Destruye 12 criaturas cibernéticas de Thersek.', goal: 12, reward: { xp: 120, scrap: 15 } },
  s_kairo: { name: 'El ingeniero cautivo', giver: 'ELARA', desc: 'Una señal arturiana parpadea en una celda de la Extractora Gris-7.', goal: 1, reward: { xp: 100 } },
  s_mnemo: { name: 'El archivero oculto', giver: 'ELARA', desc: 'Alguien susurra entre los muros de las Ruinas de Lirae. Busca un muro agrietado en lo alto.', goal: 1, reward: { xp: 100 } },
  s_ssaru: { name: 'Hermano de caza', giver: 'Sylaë', desc: 'Un guerrero reptiliano fue visto en el Nido de Krazith.', goal: 1, reward: { xp: 100 } },
  s_codex: { name: 'La memoria de la selva', giver: 'Mnemo', desc: 'Completa al 100 % el Bestiario y el Herbario de VÉRZARA.', goal: 1, reward: { xp: 300 } }
};

// ---------- logros ----------
P.D.ACHIEVEMENTS = [
  { id: 'despertar', name: 'Despertar', desc: 'Inicia tu misión en Plenuria.' },
  { id: 'liberador', name: 'Liberador', desc: 'Libera tu primer territorio.' },
  { id: 'selva', name: 'La selva respira', desc: 'Libera los 10 territorios de VÉRZARA.' },
  { id: 'krazthor', name: 'Rompecaparazones', desc: 'Derrota a KRAZTHOR.' },
  { id: 'zoologo', name: 'Zoólogo', desc: 'Completa el Bestiario de VÉRZARA.' },
  { id: 'botanico', name: 'Botánico', desc: 'Completa el Herbario de VÉRZARA.' },
  { id: 'archivista', name: 'Archivista', desc: 'Recupera los 8 registros holográficos.' },
  { id: 'intacto', name: 'Sin un rasguño', desc: 'Libera un territorio sin recibir daño.' },
  { id: 'parada', name: 'Maestro de la barrera', desc: 'Realiza 10 paradas perfectas.' },
  { id: 'nivel10', name: 'Unidad extraordinaria', desc: 'Alcanza el nivel 10.' },
  { id: 'rescatador', name: 'Rescatador', desc: 'Rescata a 4 supervivientes.' },
  { id: 'secretos', name: 'Explorador', desc: 'Descubre 10 secretos.' },
  { id: 'artesano', name: 'Artesano', desc: 'Fabrica 5 mejoras en el Taller.' },
  { id: 'escuadra', name: 'Escuadra completa', desc: 'Lleva dos compañeros de apoyo a un nivel.' },
  { id: 'nova', name: 'Segunda oportunidad', desc: 'NOVA te rescata.' },
  { id: 'observador', name: 'Paciencia de botánico', desc: 'Observa a 5 especies en su estado natural.' }
];

// ---------- historia ----------
P.D.HOLOS = {
  h1: { title: 'Diario de campo · Sylaë', text: 'Día 3.402 en Lirae. Las Lumbrelas florecieron todas a la vez esta noche. Desde el dosel, la selva parecía un cielo al revés. Los Krazith cantan con sus caparazones. Nunca me cansaré de este mundo.' },
  h2: { title: 'Aviso del Consejo de la República', text: 'A todos los ciudadanos de Vérzara: la flota de Merek ha cruzado el cinturón exterior. Diríjanse a los refugios del templo. Las cinco civilizaciones resistirán juntas. Repetimos: juntas.' },
  h3: { title: 'Orden Esquelética 114 · Gerselle', text: 'Instalen extractoras en cada nodo de raíz del planeta. La selva es un depósito de energía con hojas. La Esfera necesita el 4 % de su luz vital antes del próximo ciclo. Sin excepciones.' },
  h4: { title: 'Archivo del Templo de Lirae', text: 'El Pacto de las Cinco: los arturianos aportaron la ingeniería; los pleyadianos, la vida; los reptilianos, la fuerza; los andromedanos, la memoria; los lemurianos, el océano. Juntos, encendieron el Proyecto ALBA.' },
  h5: { title: 'Bitácora de Thersek · Sujeto K-Z', text: 'El rey Krazith resiste el chip neural. Fascinante. He decidido injertarle el prototipo prismático recuperado del laboratorio de la República. Si su cuerpo no lo rechaza, tendremos un guardián digno.' },
  h6: { title: 'Registro de la Extractora Gris-7', text: 'Cuota diaria: 12 teravatios hacia la Esfera. Producción actual: 14. Excedente asignado al palacio presidencial. Bajas del personal pleyadiano esclavizado: no registradas.' },
  h7: { title: 'Canción de las esporas', text: '«Duerme, semilla, bajo la raíz; la luz que te falta volverá por ti. Cinco manos te cuidan, cinco voces te ven; cuando el sol despierte, despertarás también.»' },
  h8: { title: 'Bitácora de Thersek · Núcleo prismático', text: 'El núcleo del cañón es tecnología ALBA. La misma firma que las unidades K. Merek insiste en que todas fueron destruidas. Yo no estoy tan seguro. Una de ellas falta en el inventario: K-7.' }
};
P.D.MEMORIES = {
  m1: { title: 'Fragmento de memoria · Luz verde', text: 'Una voz suave, entre interferencias: «Siete, ¿me oyes? Si despiertas solo, busca la luz verde. Vérzara siempre nos protegió. Te encontraré.»' },
  m2: { title: 'Fragmento de memoria · La sala blanca', text: 'Una sala blanca. Cinco figuras, una de cada civilización, rodean tu cápsula. Un arturiano dice: «No es un soldado. Nunca lo fue. Es una llave.»' },
  m3: { title: 'Fragmento de memoria · N-0', text: 'Una armadura rosada te tiende la mano bajo un sol completo: «Prométeme que lo volveremos a ver así». El nombre de su placa se borra antes de que puedas leerlo… solo queda «N-0».' }
};

// desenlaces de los jefes (escena tras la victoria) y transmisión al volver a la nave
P.D.BOSS_OUTRO = {
  krazthor: { up: 'prisma', skin: 'selvatica', mem: 'm3', lines: [['elara', 'KRAZTHOR ha caído. Sus constantes se estabilizan... el chip neural de Thersek se ha apagado.'],
    ['elara', 'El núcleo del cañón sigue intacto. {N}... su firma energética es idéntica a la tuya.'], ['hero', '¿Idéntica? ¿Qué significa eso, ELARA?'],
    ['elara', 'No lo sé. Pero el núcleo es compatible con tu Pulso Solar. Integrándolo... ahora.']] }
};
P.D.POST_BOSS = {
  krazthor: [['merek', 'Así que has despertado, K-7. Qué inconveniente.'], ['merek', 'VÉRZARA era solo un jardín. Riégalo cuanto quieras.'], ['merek', 'La luz de Plenuria me pertenece. Mi Esfera es eterna. Nos veremos… si llegas tan lejos, {N}.'],
    ['elara', 'Transmisión cortada. Origen: Palacio Presidencial, Esfera de Dyson.'], ['elara', 'Él te llamó K-7… igual que en la bitácora de Thersek. Investigaré los archivos.'], ['elara', 'Hay buenas noticias: una nueva señal en KHAZIR. Las dunas nos llaman. Pero primero, descansa. Te lo has ganado.']]
};
// ---------- estructura planificada del final (aún no jugable; ver HISTORIA.md) ----------
// Solo datos de referencia para futuras implementaciones: nada del juego actual los lee todavía.
// Regla: la identidad del protagonista (Anunnaki) no se revela hasta el final (memoria m23).
P.D.ENDGAME = {
  council: { name: 'Consejo de las Cinco Civilizaciones', civs: ['arturiano', 'pleyadiano', 'reptiliano', 'andromedano', 'lemuriano'], ships: 5, unlock: 'liberar los nueve planetas', ready: false },
  spaceBattle: { id: 'asalto_orbital', name: 'Asalto a la Esfera', mode: 'naves 2D, desplazamiento vertical', goal: 'abrir el escudo de la Esfera', ready: false },
  dyson: [
    { id: 'dominio', name: 'El Dominio Exterior', levels: 4, boss: 'nemesis', ready: false },
    { id: 'corazon', name: 'El Corazón Tecnológico', levels: 4, boss: 'thersek', arena: 'corazón nuclear de experimentación', ready: false },
    { id: 'imperio', name: 'El Imperio Esquelético', levels: 4, boss: 'gerselle', bossForm: 'traje robótico de combate', ready: false },
    { id: 'trono', name: 'El Trono del Imperio', levels: 1, event: 'enjambre · las cinco naves del Consejo destruyen la cúpula', boss: 'merek', ready: false }
  ],
  finalBoss: { id: 'merek', phases: ['cuerpo a cuerpo', 'gigante en el fondo (patrón de jefe gigante)', 'mutación'], ready: false },
  ending: { events: ['destrucción de la Esfera', 'reconstrucción de la República y los nueve mundos con sus restos'], ready: false },
  memories: { m20: 'La invasión', m21: 'La caída de la República', m22: 'La proclamación presidencial', m23: 'La revelación (Anunnaki)', m24: 'La reconstrucción' }
};
