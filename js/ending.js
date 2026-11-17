'use strict';
// FINAL — «El destino de las civilizaciones». Secuencia cinematográfica tras derrotar a MEREK (HISTORIA.md §6 y §7):
// 1 la Esfera colapsa y Plenuria brilla entera · 2 los nueve mundos reciben la luz · 3 se constituye el Consejo de las Cinco
// Civilizaciones · 4 recuerdos de la invasión, la caída y la proclamación · 5 la revelación: el protagonista es Anunnaki ·
// 6 la reconstrucción con los restos de la Esfera · 7 FIN y créditos. Cada parte avanza sola; CONFIRMAR la acelera.
Object.assign(P.Audio.TRACKS, {
  ending: { bpm: 70, root: 48, scale: [0, 2, 4, 5, 7, 9, 11], prog: [0, 5, 3, 4], lead: 'triangle', bass: 'sine', arp: 'sine', drums: 0, pad: true, seed: 1201, motif: [2, null, 1, 0, 1, null, 4, null] },
  reveal: { bpm: 60, root: 45, scale: [0, 2, 3, 5, 7, 9, 10], prog: [0, 3, 5, 4], lead: 'sine', bass: 'sine', arp: 'triangle', drums: 0, pad: true, seed: 1207, motif: [0, null, 'r', 2, 4, null, 5, null] },
  credits: { bpm: 96, root: 48, scale: [0, 2, 4, 5, 7, 9, 11], prog: [0, 4, 5, 3], lead: 'triangle', bass: 'sine', arp: 'triangle', drums: 1, pad: true, seed: 1213, motif: [2, null, 1, 0, 1, null, 4, null] }
});
P.EndingScene = class {
  enter() {
    this.t = 0; this.part = 0; this.pt = 0; P.GB.build(); P.Audio.music('ending'); const S = P.State; for (const m of ['m20', 'm21', 'm22', 'm23', 'm24']) S.data.mems[m] = true; S.autosave();
    this.parts = [
      { k: 'collapse', len: 620, lines: [[30, 'elara', 'La Esfera se rompe, {N}. Sin Merek, nada la sostiene.'], [220, 'zelvan', '¡Todas las naves fuera! ¡Ahora!'], [420, 'elara', 'Mira… Plenuria. El sol completo. Como en tus recuerdos.']] },
      { k: 'worlds', len: 560, lines: [[20, 'elara', 'La luz vuelve a los nueve mundos. VÉRZARA, KHAZIR, NÍVORAH, THALASSYR, UMBRÉLIA…'], [280, 'elara', '…MYKORIS, XÉRTHA, IGNÁRIA y AERTHYON. Libres. Todos.']] },
      { k: 'council', len: 760, lines: [[20, 'sylae', 'Los pleyadianos devolverán la vida a cada jardín que la Esfera secó.'], [150, 'ashkar', 'Los reptilianos forjaremos herramientas, no placas. Nunca más placas.'], [280, 'zelvan', 'Los arturianos desmontaremos la Esfera pieza a pieza. Su metal construirá ciudades.'], [410, 'vaelis', 'Los andromedanos guardaremos la memoria de lo que pasó. Para que no vuelva a pasar.'], [540, 'maelis', 'Y los lemurianos… cuidaremos de que este Consejo no olvide para quién gobierna.'], [660, 'elara', 'El Consejo de las Cinco Civilizaciones queda constituido. Solo falta una cosa, {N}.']] },
      { k: 'memories', len: 960, lines: [[20, 'elara', 'Tu memoria está volviendo. Toda. Déjala venir.']] },
      { k: 'reveal', len: 1100, music: 'reveal', lines: [[40, 'elara', 'Hace siglos, los Anunnaki vinieron a Plenuria. La mayoría quiso gobernarla. Merek fue su líder.'], [230, 'elara', 'Uno de ellos se negó. Se quedó con las cinco civilizaciones y ayudó a fundar la República.'], [420, 'elara', 'El Pacto de las Cinco lo eligió Presidente. A ti, {N}.'], [600, 'elara', 'Cuando la Esfera se cerró, te escondí en esta armadura y borré tu memoria para que Merek no te encontrara.'], [790, 'hero', 'Por eso me llamaba K-7… Para que olvidara que tenía un nombre.'], [940, 'elara', 'Eres Anunnaki, {N}. El último que eligió protegerlos en lugar de gobernarlos.']] },
      { k: 'rebuild', len: 9 * 130 + 120, music: 'ending', lines: [] },
      { k: 'end', len: 1e9, music: 'credits', lines: [] }
    ];
    this.rebuildText = ['VÉRZARA · Los jardines pleyadianos crecen sobre placas de la Esfera.', 'KHAZIR · Las ciudades reptilianas beben de oasis que ya nadie roba.', 'NÍVORAH · Los observatorios arturianos vuelven a mirar las auroras.', 'THALASSYR · Las ciudades lemurianas emergen, iluminadas por el sol entero.', 'UMBRÉLIA · Los archivos andromedanos se abren a todos los pueblos.', 'MYKORIS · El micelio vuelve a pensar en voz alta, y alguien lo escucha.', 'XÉRTHA · Las colmenas cantan con mil voces. Ninguna de ellas es una orden.', 'IGNÁRIA · Las forjas hacen arados con el metal de la Esfera.', 'AERTHYON · AZHYRION duerme en las tormentas. Las islas vuelven a subir.'];
  }
  update() {
    const I = P.input; this.t++; this.pt++; P.toasts.length = 0; const part = this.parts[this.part];
    if (part.k === 'collapse' && (this.pt === 120 || this.pt === 260 || this.pt === 380)) { P.Audio.sfx('bigexplode'); P.shake(10, 40); P.GLFX.flashScreen('#fff4c0', 0.6); P.GLFX.wave(240, 110, 1.5); }
    if (part.k === 'reveal' && this.pt === 520) { P.Audio.sfx('restore'); P.GLFX.flashScreen('#ffd166', 0.8); P.GLFX.wave(240, 140, 1.4); }
    const fast = this.pt > 40 && I.pressed('confirm');
    if (part.k === 'end') { if (this.pt > 600 && I.pressed('confirm')) { P.Audio.stopMusic(); P.goto(new P.TitleScene()); } return; }
    if (this.pt >= part.len || fast) { this.part++; this.pt = 0; const np = this.parts[this.part]; if (np && np.music) P.Audio.music(np.music); }
  }
  sub(c, part) { const ln = part.lines.filter(l => l[0] <= this.pt).pop(); if (!ln) return; const sp = P.SPEAKERS[ln[1]] || { name: ln[1] === 'hero' ? P.State.name : ln[1].toUpperCase(), col: '#ffffff' }, k = this.pt - ln[0], tx = P.State.fmt(ln[2]);
    const lines = P.wrap(tx, 440); P.txt(c, ln[1] === 'hero' ? P.State.name.toUpperCase() : sp.name, 18, P.H - 34, sp.col || '#ffffff'); let shown = Math.floor(k * 1.4); lines.forEach((l, i) => { const s = l.slice(0, Math.max(0, shown)); shown -= l.length; P.txt(c, s, 18, P.H - 24 + i * 9, '#e8f0ff'); }); }
  draw(c) {
    const t = this.t, pt = this.pt, part = this.parts[this.part]; if (!part) return;
    c.fillStyle = '#03030a'; c.fillRect(0, 0, P.W, P.H); for (let i = 0; i < 90; i++) { c.fillStyle = i % 4 ? '#4a5270' : '#ffffff'; c.fillRect((i * 97) % P.W, (i * 53 + t * 0.05) % P.H, 1, 1); }
    if (part.k === 'collapse') { const k = Math.min(1, pt / 500), R = 90; // la Esfera se resquebraja y la luz escapa
      P.drawGlow(c, 240, 120, 60 + k * 260, '#fff4c0', 0.3 + k * 0.6);
      for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2, d = R + Math.max(0, pt - 120 - (i % 6) * 20) * (0.6 + (i % 5) * 0.3); c.save(); c.translate(240 + Math.cos(a) * d, 120 + Math.sin(a) * d); c.rotate(a + pt * 0.01 * (i % 3)); c.fillStyle = i % 2 ? '#1e2432' : '#2c3446'; c.fillRect(-7, -4, 14, 8); c.fillStyle = '#ff2a4a'; c.fillRect(-7, -4, 14, 1); c.restore(); }
      c.fillStyle = '#ffffff'; c.beginPath(); c.arc(240, 120, 10 + k * 18, 0, 6.3); c.fill();
      for (let i = 0; i < 5; i++) { const im = P.S['gb_c' + i].f[0], x = 70 + i * 85, y = 230 - Math.min(80, pt * 0.15) - (i % 2) * 8; c.drawImage(im, Math.round(x - im.width / 4), Math.round(y), Math.round(im.width / 2), Math.round(im.height / 2)); } }
    if (part.k === 'worlds') { P.drawGlow(c, 240, 120, 70, '#fff4c0', 0.9); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(240, 120, 16, 0, 6.3); c.fill();
      P.D.PLANETS.forEach((p, i) => { const a = t * 0.004 * (240 / p.orbit) + i * 0.7, x = 240 + Math.cos(a) * p.orbit * 0.9, y = 120 + Math.sin(a) * p.orbit * 0.38, lit = pt > 40 + i * 50; P.Space.drawPlanet(c, p.id, x, y, Math.round(p.size * 0.8), lit ? 1 : 0); if (lit) { c.strokeStyle = 'rgba(125,255,160,' + Math.min(1, (pt - 40 - i * 50) / 30) + ')'; c.beginPath(); c.arc(x, y, p.size * 0.8 + 3, 0, 6.3); c.stroke(); } }); }
    if (part.k === 'council') { // la mesa del Consejo: cinco naves en círculo alrededor de la luz
      P.drawGlow(c, 240, 110, 60, '#fff4c0', 0.5); c.fillStyle = '#1c141e'; c.beginPath(); c.ellipse(240, 130, 120, 28, 0, 0, 6.3); c.fill(); c.strokeStyle = '#c0962a'; c.stroke();
      P.GB.CIVS.forEach((cv2, i) => { const a = -Math.PI / 2 + (i - 2) * 0.62, x = 240 + Math.cos(a + Math.PI) * 150 * -1, y = 130 + Math.sin(a + Math.PI) * 40 * -1 - 20, im = P.S['gb_c' + i].f[0], on = this.parts[2].lines[Math.min(4, i)][0] <= pt; c.globalAlpha = on ? 1 : 0.35; c.drawImage(im, Math.round(x - im.width / 4), Math.round(y - im.height / 4), Math.round(im.width / 2), Math.round(im.height / 2)); if (on) P.drawGlow(c, x, y, 26, cv2.col, 0.4); P.txt(c, cv2.name, x, y + 22, cv2.col, { align: 'center' }); c.globalAlpha = 1; });
      if (pt > 660) P.txt(c, 'CONSEJO DE LAS CINCO CIVILIZACIONES', 240, 30, '#ffd166', { align: 'center', outline: true, shadow: '#000' }); }
    if (part.k === 'memories') { const ids = ['m20', 'm21', 'm22'], i = Math.min(2, Math.floor(pt / 320)), k = (pt % 320) / 320, mem = P.D.MEMORIES[ids[i]];
      c.globalAlpha = Math.min(1, k * 4, (1 - k) * 4); P.panel(c, 40, 30, 400, 150, { border: '#ffd166' });
      if (i === 0) { for (let j = 0; j < 12; j++) P.DS.ship(c, 80 + j * 30 + Math.sin(t * 0.02 + j) * 4, 80 + (j % 3) * 20, 1, j % 3, '#06040a', '#ff2a4a', t); c.fillStyle = '#5a1a2a'; c.fillRect(60, 60, 4, 100); }
      if (i === 1) { c.fillStyle = '#ffd166'; c.beginPath(); c.arc(240, 100, 26, 0, 6.3); c.fill(); c.strokeStyle = '#1c141e'; c.lineWidth = 3; for (let j = 0; j < 8; j++) { c.beginPath(); c.arc(240, 100, 26 + (1 - Math.min(1, k * 2)) * 60, j * 0.785, j * 0.785 + 0.6); c.stroke(); } c.lineWidth = 1; }
      if (i === 2) { c.fillStyle = 'rgba(255,240,200,0.3)'; c.fillRect(200, 40, 80, 130); for (let j = 0; j < 5; j++) { const im = P.S['gb_c' + j].f[0]; c.drawImage(im, 70 + j * 76, 120, im.width / 3, im.height / 3); } c.fillStyle = '#ffffff'; c.fillRect(238, 80, 4, 30); P.drawGlow(c, 240, 90, 24, '#ffd166', 0.7); }
      P.txt(c, mem.title, 240, 152, '#ffd166', { align: 'center' }); P.wrap(mem.text, 380).slice(0, 2).forEach((l, j) => P.txt(c, l, 240, 162 + j * 9, '#e8f0ff', { align: 'center' })); c.globalAlpha = 1; }
    if (part.k === 'reveal') { // la armadura se abre: debajo hay luz dorada y una silueta anunnaki
      const open = Math.max(0, Math.min(1, (pt - 420) / 140)), cx2 = 240, cy2 = 128;
      P.drawGlow(c, cx2, cy2, 40 + open * 120, '#ffd166', 0.2 + open * 0.6);
      if (open > 0) { c.globalAlpha = open; c.fillStyle = '#fff4c0'; c.beginPath(); c.ellipse(cx2, cy2 - 6, 14, 30, 0, 0, 6.3); c.fill(); c.beginPath(); c.arc(cx2, cy2 - 46, 10, 0, 6.3); c.fill(); c.fillStyle = '#ffd166'; c.beginPath(); c.moveTo(cx2 - 10, cy2 - 52); c.lineTo(cx2, cy2 - 74); c.lineTo(cx2 + 10, cy2 - 52); c.fill(); for (let j = 0; j < 12; j++) { const a = j / 12 * Math.PI * 2 + t * 0.01; c.fillRect(Math.round(cx2 + Math.cos(a) * (40 + open * 20)), Math.round(cy2 + Math.sin(a) * (40 + open * 20)), 2, 2); } c.globalAlpha = 1; }
      const s = P.S['hero_' + (P.State.data.skin || 'rojo')] || P.S.hero_rojo; if (s) { const fr = s.f[0], sc2 = 3; for (const [sd, w] of [[-1, 0], [1, 1]]) { c.save(); c.translate(cx2 + sd * open * 40, cy2 - fr.height * sc2 / 2 + 8); c.beginPath(); c.rect(w ? 0 : -fr.width * sc2 / 2, -10, fr.width * sc2 / 2, fr.height * sc2 + 20); c.clip(); c.imageSmoothingEnabled = false; c.globalAlpha = 1 - open * 0.6; c.drawImage(fr, -fr.width * sc2 / 2, 0, fr.width * sc2, fr.height * sc2); c.restore(); } c.globalAlpha = 1; }
      if (pt > 940) { c.globalAlpha = Math.min(1, (pt - 940) / 40); P.txt(c, 'ERES ANUNNAKI', 240, 30, '#ffd166', { align: 'center', outline: true, shadow: '#3a2a00', scale: 2 }); c.globalAlpha = 1; } }
    if (part.k === 'rebuild') { const i = Math.min(8, Math.floor(pt / 130)), k = (pt % 130) / 130, pl = P.D.PLANETS[i], col = pl.col;
      const g = c.createLinearGradient(0, 0, 0, P.H); g.addColorStop(0, col[2]); g.addColorStop(0.6, col[0]); g.addColorStop(1, '#03030a'); c.fillStyle = g; c.globalAlpha = Math.min(1, k * 5, (1 - k) * 5); c.fillRect(0, 0, P.W, P.H);
      P.drawGlow(c, 380, 50, 50, '#fff4c0', 0.7); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(380, 50, 12, 0, 6.3); c.fill();
      const r = P.RNG(900 + i); for (let j = 0; j < 9; j++) { const x = 30 + j * 50 + r.int(-8, 8), h = 50 + r.int(0, 80) * Math.min(1, k * 2), w = 10 + r.int(0, 10); c.fillStyle = col[0]; c.fillRect(x - w / 2, 220 - h, w, h); c.fillStyle = col[1]; c.fillRect(x - w / 2, 220 - h, w, 2); for (let y = 220 - h + 6; y < 216; y += 6) if ((x + y) % 3) { c.fillStyle = '#ffffff'; c.fillRect(x - 2, y, 2, 2); } c.fillStyle = '#3ac8f0'; c.fillRect(x - w / 2 - 2, 220 - h * 0.5, w + 4, 2); }
      c.fillStyle = '#06060c'; c.fillRect(0, 220, P.W, 50); c.fillStyle = col[1]; c.fillRect(0, 220, P.W, 1);
      P.txt(c, this.rebuildText[i], 240, 26, '#ffffff', { align: 'center', outline: true, shadow: '#000' }); P.txt(c, 'Reconstruido con las piezas de la Esfera de Dyson', 240, 38, '#bff6ff', { align: 'center', outline: true, shadow: '#000' }); c.globalAlpha = 1; }
    if (part.k === 'end') { P.drawGlow(c, 240, 70, 80, '#fff4c0', 0.6); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(240, 70, 16, 0, 6.3); c.fill();
      const y0 = 300 - pt * 0.35, credits = ['PLENURIA', 'THE SOLAR RECLAMATION', '', 'FIN', '', 'Una aventura en nueve mundos', 'y una Esfera de Dyson', '', 'Gracias por jugar, ' + P.State.name + '.', '', 'El sol vuelve a ser de todos.'];
      credits.forEach((l, i) => { const y = Math.max(110 + i * 12, y0 + i * 16); P.txt(c, l, 240, y, i === 3 ? '#ffd166' : i < 2 ? '#ff8a9a' : '#e8f0ff', { align: 'center', outline: true, shadow: '#000', scale: i === 3 ? 2 : 1 }); });
      if (pt > 600) P.txt(c, P.input.label('confirm') + ' · volver al título', 240, P.H - 12, '#5e6a86', { align: 'center' }); }
    // franjas y subtítulos
    if (part.k !== 'end') { c.fillStyle = '#000'; c.fillRect(0, 0, P.W, 18); c.fillRect(0, P.H - 44, P.W, 44); this.sub(c, part); P.txt(c, P.input.label('confirm') + ' · avanzar', P.W - 8, 6, '#3a4258', { align: 'right' }); }
  }
};
