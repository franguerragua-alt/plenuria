'use strict';
// Pantalla de título e introducción
P.TitleScene = class {
  enter() {
    this.t = 0; this.sel = 0; this.parts = new P.Particles();
    P.Audio.music('title');
    this.latest = this.findLatest();
    this.items = [];
    if (this.latest) this.items.push({ label: 'Continuar', sub: this.latest.d.name + ' · Nv ' + this.latest.d.lv, fn: () => this.loadAndGo(this.latest.slot) });
    this.items.push({ label: 'Nueva partida', fn: () => this.latest ? P.confirm('¿Empezar una nueva partida? (las ranuras manuales se conservan)', () => this.newGame()) : this.newGame() });
    this.items.push({ label: 'Cargar partida', fn: () => P.openUI(new P.SaveUI('load', () => this.go())) });
    this.items.push({ label: 'Opciones', fn: () => P.openUI(new P.OptionsUI()) });
    this.items.push({ label: 'Créditos', fn: () => P.openUI(new P.LoreView({ title: 'PLENURIA — The Solar Reclamation', text: 'Dirección, diseño, programación, arte pixel y música generados por código para este proyecto. Universo, planetas, jefes y personajes según la visión del desarrollador. Fase actual: VÉRZARA completa, nave central y sistemas para los nueve mundos.' }, 'holo')) });
  }
  findLatest() {
    let best = null;
    for (const s of ['auto', '1', '2', '3']) { const d = P.State.peek(s); if (d && (!best || (d.saved || 0) > (best.d.saved || 0))) best = { slot: s, d }; }
    return best;
  }
  loadAndGo(slot) { if (P.State.load(slot)) this.go(); }
  go() { const d = P.State.data; P.goto(d.flags.prologueDone ? new P.ShipScene('puente') : new P.ShipScene('camarote')); }
  // antes de empezar se elige la dificultad de la partida
  newGame() { P.openUI(new P.DifficultyUI('normal', id => { P.State.newGame(P.D.DEFAULT_NAME); P.State.data.diff = id; P.goto(new P.IntroScene()); }, true)); }
  update() {
    this.t++; const I = P.input;
    if (I.pressed('down')) { this.sel = (this.sel + 1) % this.items.length; P.Audio.sfx('move'); }
    if (I.pressed('up')) { this.sel = (this.sel + this.items.length - 1) % this.items.length; P.Audio.sfx('move'); }
    if (I.pressed('confirm')) { P.Audio.unlock(); P.Audio.sfx('select'); this.items[this.sel].fn(); }
    this.parts.update();
    if (this.t % 3 === 0) this.parts.add({ x: P.rand(0, P.W), y: P.H + 2, vy: -P.rand(0.2, 0.6), life: 400, col: P.pick(['#5ef0d0', '#9cff6a', '#b46aff', '#ffd166']), size: 1, glow: 2 });
  }
  draw(c) {
    const pano = P.Space.panorama(), po = -((this.t * 0.12) % pano.width); c.drawImage(pano, Math.round(po), 0); c.drawImage(pano, Math.round(po + pano.width), 0);
    // la estrella encerrada en la Esfera de Dyson
    const dy = P.Space.dyson(18); c.drawImage(dy, Math.round(384 - dy.width / 2), Math.round(96 - dy.height / 2));
    // VÉRZARA
    P.Space.drawPlanet(c, 'verzara', 86, 214, 62, 0.4);
    // la Vigía del Alba cruzando el sistema
    const shx = (this.t * 0.4) % 820 - 220, shy = 112 + Math.sin(this.t * 0.03) * 4;
    for (let i = 0; i < 3; i++) P.drawGlow(c, shx + 6, shy + [30, 44, 58][i] * 88 / 88, 10 + Math.sin(this.t * 0.4 + i) * 2, '#6ae0ff', 0.7);
    P.spr(c, 'ship_big', Math.floor(this.t / 6) % 2, shx, shy);
    if (this.t % 3 === 0) this.parts.add({ x: shx + 4, y: shy + P.pick([30, 44, 58]), vx: -P.rand(1, 2.5), life: 30, col: P.pick(['#6ae0ff', '#bff6ff']), size: 1, glow: 2 });
    this.parts.draw(c, 0, 0);
    P.FX.post(c, P.FX.profTitle());
    // título
    P.txt(c, 'PLENURIA', P.W / 2, 28, '#fff6d8', { align: 'center', scale: 5, outline: true, shadow: '#3a1a08', col2: '#ffb040' });
    P.txt(c, 'THE  SOLAR  RECLAMATION', P.W / 2, 68, '#5ee8ff', { align: 'center', outline: true, shadow: '#04141a' });
    // menú
    const mx = P.W / 2 - 70, my = 160;
    P.panel(c, mx, my - 8, 140, this.items.length * 15 + 12, { fill: 'rgba(4,8,18,0.75)' });
    this.items.forEach((it, i) => {
      const y = my + i * 15, s = i === this.sel;
      if (s) { c.fillStyle = 'rgba(94,232,255,0.15)'; c.fillRect(mx + 4, y - 3, 132, 13); P.txt(c, '▶', mx + 8, y, '#5ee8ff'); }
      P.txt(c, it.label, mx + 18, y, s ? '#ffffff' : '#a8b8cc');
      if (it.sub && s) P.txt(c, it.sub, mx + 136, y, P.UIC.dim, { align: 'right' });
    });
    P.txt(c, 'Teclado o mando · F9 modo desarrollador', P.W / 2, P.H - 12, '#4a5468', { align: 'center' });
  }
};

P.IntroScene = class {
  enter() {
    this.t = 0;
    this.lines = ['Hace siglos, cinco civilizaciones gobernaban juntas el sistema solar de PLENURIA:',
      'arturianos, pleyadianos, reptilianos, andromedanos y lemurianos.',
      'Su República Solar fue la más brillante que jamás conocieron las estrellas.',
      'Hasta que llegaron los Esqueléticos, una facción corrupta de los antiguos Anunnaki.',
      'MEREK, THERSEK y GERSELLE encerraron la estrella en una Esfera de Dyson',
      'y drenaron su luz para alimentar su maquinaria de guerra.',
      'Los nueve mundos se marchitaron. Las civilizaciones se dispersaron.',
      'En una nave olvidada en órbita, algo despierta.'];
    P.Audio.music('title');
  }
  update() {
    this.t++;
    if (P.input.pressed('confirm') || P.input.pressed('back') || this.t > this.lines.length * 150 + 120) P.goto(new P.ShipScene('camarote'));
  }
  draw(c) {
    c.fillStyle = '#020208'; c.fillRect(0, 0, P.W, P.H);
    const r = P.RNG(7); for (let i = 0; i < 120; i++) { c.fillStyle = `rgba(255,255,255,${r.range(0.1, 0.5)})`; c.fillRect(r.int(0, P.W), (r.int(0, P.H) + this.t * 0.1) % P.H, 1, 1); }
    const cur = Math.floor(this.t / 150);
    let y = 34;
    this.lines.forEach((l, i) => {
      const wl = P.wrap(l, 440);
      if (i <= cur) {
        const a = i === cur ? Math.min(1, (this.t % 150) / 40) : 0.45;
        c.globalAlpha = a; wl.forEach((s, j) => P.txt(c, s, P.W / 2, y + j * 11, i === this.lines.length - 1 ? '#ffd166' : '#d8e4f4', { align: 'center' })); c.globalAlpha = 1;
      }
      y += wl.length * 11 + 12;
    });
    P.txt(c, 'Pulsa ' + P.input.label('confirm') + ' para continuar', P.W / 2, P.H - 14, '#4a5468', { align: 'center' });
  }
};
