'use strict';
// ESFERA DE DYSON · EL TRONO DEL IMPERIO (nivel 14): la cúpula de Merek cae ante las cinco naves del Consejo (cinemática) y,
// dentro, el salón del trono: palacio imperial, centro de mando galáctico y reactor, con ventanales al espacio donde se ve la
// estrella Plenuria enjaulada. Aquí se libra el combate contra MEREK (boss_merek.js); después llega el final (ending.js).
(function () {
  const D = P.DSC, M = D.m, W = 640, H = P.H, SET = P.DS.SETS, mk = () => new P.Painter(W, H), cv = p => p.canvas(), B4 = P.BAYER4;
  const BK = ['#06040a', '#100a12', '#1c141e', '#2a1e2a', '#3e2c3a'], RD = D.red, GO = D.gold;
  SET.throne = () => {
    const r = P.RNG(8101), sky = new P.Painter(P.W, H); P.DS.space(sky, ['#020206', '#06040e', '#0e0618', '#1a0a20', '#24081c'], r, { neb: ['#3a0a1a', '#5a1424', '#7a1a2a'], nebY: 90 });
    // Plenuria enjaulada: la estrella detrás de los barrotes de la Esfera
    for (let y = 0; y < 200; y++) for (let x = 140; x < 340; x++) { const d = Math.hypot(x - 240, y - 96) / 96; if (d < 1 && B4[y & 3][x & 3] / 16 < (1 - d) * 0.8) sky.px(x, y, d < 0.35 ? '#ffffff' : d < 0.6 ? '#fff4c0' : '#ffb050'); }
    for (let k = -4; k <= 4; k++) { sky.line(240 + k * 22, 0, 240 + k * 26, 200, '#1c141e'); sky.line(240 + k * 22 + 1, 0, 240 + k * 26 + 1, 200, '#100a12'); } for (let y = 20; y < 200; y += 30) sky.rect(140, y, 200, 2, '#1c141e');
    const far = mk(); for (let i = 0; i < 3; i++) { const x = 30 + i * 220; far.rect(x, 0, 30, H, BK[2]); far.rect(x, 0, 3, H, BK[4]); far.rect(x + 27, 0, 3, H, BK[0]); far.rect(x - 6, 0, 42, 14, GO[1]); far.rect(x - 6, H - 50, 42, 10, GO[1]); for (let y = 30; y < H - 60; y += 22) far.rect(x + 12, y, 6, 6, RD[1]); }
    for (let x = 0; x < W; x++) { const y = Math.round(18 + Math.abs(((x % 220) - 110) / 110) * -14 + 14); far.rect(x, 0, 1, y, BK[1]); far.px(x, y, GO[1]); }
    const mid = mk(); const cores = []; for (let i = 0; i < 4; i++) { const x = 80 + i * 160; mid.rect(x - 10, 40, 20, H - 40, BK[2]); mid.rect(x - 10, 40, 3, H - 40, BK[4]); mid.rect(x - 16, H - 70, 32, 10, GO[1]); mid.rect(x - 14, 40, 28, 8, GO[1]); cores.push({ x, y: 110 }); }
    const mid2 = mk(); // estrado y trono tecnológico
    for (let k = 0; k < 5; k++) mid2.rect(200 + k * 12, H - 40 - k * 8, 240 - k * 24, 8, k % 2 ? BK[3] : BK[2]); mid2.rect(296, H - 150, 48, 110, BK[1]); mid2.rect(300, H - 146, 40, 66, RD[0]); mid2.rect(296, H - 150, 48, 3, GO[2]); for (const sd of [-1, 1]) { mid2.thick(320 + sd * 20, H - 150, 320 + sd * 34, H - 180, 4, BK[3]); mid2.thick(320 + sd * 34, H - 180, 320 + sd * 26, H - 196, 3, BK[3]); } mid2.sell(320, H - 162, 10, 11, [D.bone[0], D.bone[1], D.bone[2], D.bone[3]]); mid2.rect(314, H - 164, 4, 4, BK[0]); mid2.rect(322, H - 164, 4, 4, BK[0]);
    const near = mk(); for (let x = 0; x < W; x += 28) { near.rect(x, H - 24, 4, 24, BK[2]); near.sell(x + 2, H - 26, 4, 3, [GO[0], GO[1], GO[2], GO[3]]); } near.rect(0, H - 14, W, 3, BK[3]); near.rect(0, H - 14, W, 1, GO[1]);
    return { sky: sky.canvas(), L: [{ im: cv(far), par: 0.1, y: 0 }, { im: cv(mid), par: 0.22, y: 0 }, { im: cv(mid2), par: 0.36, y: 0 }, { im: cv(near), par: 0.6, y: 0 }],
      fx(L, c, cx, vy, k) { const t = L.t;
        if (k === 0) { P.drawGlow(c, 240, 96 + vy * 0.03, 110 + Math.sin(t * 0.02) * 8, '#ffb050', 0.25); }
        if (k === 2) { const off = -((cx * 0.22) % W); for (const q of cores) for (const rep of [off, off + W]) { const X = rep + q.x, Y = q.y + vy * 0.22; if (X < -40 || X > P.W + 40) continue; P.Energy.reactor(c, X, Y, 9, t + q.x, '#ff2a4a'); for (let j = 0; j < 6; j++) { c.fillStyle = (j + (t >> 3)) % 3 === 0 ? '#ff8a9a' : '#6a0a1a'; c.fillRect(Math.round(X) - 1, Math.round(Y + 20 + j * 14), 2, 8); } } }
        if (k === 3) { const off = -((cx * 0.36) % W); for (const rep of [off, off + W]) { const X = rep + 320, Y = H - 120 + vy * 0.36; if (L.boss && L.boss.phase > 1) continue; P.drawGlow(c, X, Y - 40, 40, '#ff2a4a', 0.2 + Math.sin(t * 0.05) * 0.1); } }
        if (k === 0 && L.boss && L.boss.phase >= 2) { c.globalCompositeOperation = 'lighter'; c.fillStyle = 'rgba(255,40,70,' + (0.05 + Math.sin(t * 0.05) * 0.03) + ')'; c.fillRect(0, 0, P.W, P.H); c.globalCompositeOperation = 'source-over'; } } };
  };

  P.LV.dyson.levels.push({ id: 14, name: 'El Trono del Imperio', sub: 'El corazón del régimen', theme: 'boss', bg: 'throne', area: 4, music: 'boss', boss: 'merek', sky: 'dusk', arena: 'merek', cinematic: 'DomeCinematic',
    intro: [['merek', 'Por fin. Nueve mundos, tres de los míos… y aquí estás. Sin recordar siquiera por qué viniste.'], ['hero', 'Vine a apagar tu Esfera, Merek.'], ['merek', 'Mi Esfera. Mi trono. Mi república. Todo lo que tú dejaste caer.'], ['elara', '{N}, su firma de energía no deja de crecer. Prepárate.']] });
  P.LV.dyson.levels.sort((a, b) => a.id - b.id);
  P.D.BOSSES.merek = Object.assign(P.D.BOSSES.merek || {}, { name: 'MEREK', title: 'El Presidente', planet: 'dyson', col: '#ff2a4a', col2: '#ffd166', music: 'merek', final: true });
  Object.assign(P.D.MEMORIES, {
    m20: { title: 'Fragmento de memoria · La invasión', text: 'Naves negras salen de una grieta en el espacio. Los Esqueléticos. Tú estás en el puente de la nave insignia de la República y das órdenes con una voz que reconoces como tuya.' },
    m21: { title: 'Fragmento de memoria · La caída', text: 'La Esfera se cierra sobre Plenuria. Las cinco civilizaciones se dispersan. ELARA te mete en una cápsula: «Duerme. Volverás cuando el sol lo necesite».' },
    m22: { title: 'Fragmento de memoria · La proclamación', text: 'Un Parlamento lleno de luz. Cinco pueblos en pie. «Por voluntad del Pacto de las Cinco, proclamamos Presidente de la República Solar a…» Y dicen tu nombre. Tu verdadero nombre.' },
    m23: { title: 'Fragmento de memoria · La revelación', text: 'Tu armadura se abre por primera vez. Debajo no hay circuitos: hay luz dorada. Eres Anunnaki. De los que se negaron a seguir a Merek.' },
    m24: { title: 'Fragmento de memoria · El amanecer', text: 'Plenuria brilla entera. Con los restos de la Esfera, cinco pueblos levantan ciudades nuevas en nueve mundos. Y por primera vez en siglos, nadie mira al cielo con miedo.' }
  });
  P.D.BOSS_OUTRO.merek = { lines: [['elara', 'MEREK ha caído…'], ['merek', 'No… lo entiendes. Yo solo ocupé… el sillón que tú dejaste vacío.'], ['hero', '¿Qué quieres decir?'], ['merek', 'Pregúntale… a tu armadura… qué hay debajo…'], ['elara', '¡La Esfera está colapsando, {N}! ¡El Consejo nos saca de aquí!']],
    after: L => { const S = P.State, lv = S.lvState('dyson', 14), first = !lv.done; lv.done = true; S.data.flags.gameComplete = true; if (first) S.ach('merek'); S.autosave(); P.goto(new P.EndingScene()); } };
  P.D.ACHIEVEMENTS.push({ id: 'merek', name: 'El sol completo', desc: 'Derrota a MEREK y libera Plenuria.' });
  Object.assign(P.Audio.TRACKS, {
    dome: { bpm: 112, root: 45, scale: [0, 2, 3, 5, 7, 8, 10], prog: [0, 5, 6, 4], lead: 'sawtooth', bass: 'sawtooth', arp: 'square', drums: 2, pad: true, seed: 1091, motif: [0, null, 0, 1, 0, -1, -3, null] },
    merek: { bpm: 120, root: 36, scale: [0, 1, 3, 5, 7, 8, 10], prog: [0, 6, 5, 1], lead: 'sawtooth', bass: 'sawtooth', arp: 'square', drums: 2, pad: true, seed: 1093, motif: [0, null, 0, 1, 0, -1, -3, null], motifB: [4, null, 3, 1, 0, null, -2, -3] },
    merek_2: { bpm: 132, root: 37, scale: [0, 1, 3, 5, 6, 8, 10], prog: [0, 1, 6, 5], lead: 'square', bass: 'sawtooth', arp: 'sawtooth', drums: 2, pad: true, seed: 1097, motif: [0, null, 0, 1, 0, -1, -3, null] },
    merek_3: { bpm: 156, root: 38, scale: [0, 1, 3, 4, 6, 8, 9], prog: [0, 1, 0, 6], lead: 'sawtooth', bass: 'square', arp: 'sawtooth', drums: 2, pad: true, seed: 1099, motif: [0, null, 0, 1, 0, -1, -3, null], motifB: [4, null, 3, 1, 0, null, -2, -3] }
  });

  // cinemática de la cúpula: el enjambre la defiende; las cinco naves del Consejo la rompen con un ataque sincronizado
  P.DomeCinematic = class extends P.UIBase {
    constructor(L, cb) { super(); this.L = L; this.cb = cb; this.t = 0; P.GB.build(); P.Audio.music('dome'); this.swarm = []; for (let i = 0; i < 220; i++) this.swarm.push({ a: Math.random() * 6.28, r: 70 + Math.random() * 60, v: (Math.random() < 0.5 ? 1 : -1) * (0.006 + Math.random() * 0.01), y: Math.random(), alive: true });
      this.lines = [[20, 'elara', 'La cúpula del Trono. Y un enjambre entero protegiéndola.'], [170, 'zelvan', 'Consejo, fijad el blanco. ¡Fuego coordinado sobre la cúpula!'], [300, 'maelis', '¡Las cinco naves a la vez! ¡Ahora!'], [520, 'elara', '¡La cúpula se rompe! {N}, el Trono es tuyo.']]; }
    update() { this.t++; const t = this.t; if (t === 300) { P.Audio.sfx('super'); P.shake(6, 40); } if (t === 470) { P.Audio.sfx('bigexplode'); P.shake(14, 60); P.GLFX.flashScreen('#ffffff', 0.9); P.GLFX.wave(240, 120, 1.6); }
      for (const s of this.swarm) { s.a += s.v; if (t > 300 && t < 470 && s.alive && Math.random() < 0.012) s.alive = false; }
      if (t > 640 || (t > 60 && P.input.pressed('confirm'))) { this.close(); P.Audio.stopMusic(); this.cb(); } }
    draw(c) { const t = this.t; c.fillStyle = '#04030a'; c.fillRect(0, 0, P.W, P.H); for (let i = 0; i < 70; i++) { c.fillStyle = i % 3 ? '#4a5270' : '#ffffff'; c.fillRect((i * 97) % P.W, (i * 53 + t * 0.1) % P.H, 1, 1); }
      // palacio y cúpula
      const cx = 240, cy = 170; c.fillStyle = '#100a12'; c.fillRect(140, cy, 200, 100); for (let k = 0; k < 7; k++) c.fillRect(150 + k * 28, cy - 30 - (k % 3) * 18, 12, 30 + (k % 3) * 18); c.fillStyle = '#c0962a'; c.fillRect(140, cy, 200, 2);
      const broken = t >= 470, crack = Math.max(0, Math.min(1, (t - 300) / 170));
      if (!broken) { c.globalAlpha = 0.35 + Math.sin(t * 0.08) * 0.08; c.strokeStyle = '#ff2a4a'; c.beginPath(); c.arc(cx, cy, 110, Math.PI, 0); c.stroke(); for (let k = 0; k < 14; k++) { const a = Math.PI + k * Math.PI / 14; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * 110, cy + Math.sin(a) * 110); c.stroke(); } c.globalAlpha = 1; P.drawGlow(c, cx, cy - 50, 120, '#ff2a4a', 0.2);
        c.strokeStyle = '#ffffff'; for (let k = 0; k < Math.floor(crack * 16); k++) { const a = Math.PI + (k * 1.7 % 3.14), r0 = 40 + (k * 13) % 60; c.beginPath(); c.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); c.lineTo(cx + Math.cos(a + 0.2) * (r0 + 30), cy + Math.sin(a + 0.2) * (r0 + 30)); c.stroke(); } }
      else { const k = t - 470; for (let i = 0; i < 60; i++) { const a = Math.PI + i * 0.052, d = 110 + k * (1 + (i % 5) * 0.5); c.globalAlpha = Math.max(0, 1 - k / 150); c.fillStyle = i % 2 ? '#ff8a9a' : '#ffffff'; c.fillRect(Math.round(cx + Math.cos(a) * d), Math.round(cy + Math.sin(a) * d * 0.9), 3, 2); } c.globalAlpha = 1; }
      // enjambre
      for (const s of this.swarm) if (s.alive && !broken) { c.fillStyle = '#ff2a4a'; c.fillRect(Math.round(cx + Math.cos(s.a) * s.r * 1.4), Math.round(cy - 40 + Math.sin(s.a) * s.r * 0.5 - s.y * 30), 1, 1); }
      // las cinco naves del Consejo y su ataque sincronizado
      for (let i = 0; i < 5; i++) { const im = P.S['gb_c' + i].f[0], arrive = Math.min(1, Math.max(0, (t - 60 - i * 30) / 80)), x = 50 + i * 95, y = 300 - arrive * 70 + Math.sin(t * 0.03 + i) * 2; c.drawImage(im, Math.round(x - im.width / 4), Math.round(y - im.height / 4), Math.round(im.width / 2), Math.round(im.height / 2));
        if (t > 300 && t < 470) P.Energy.laser(c, x, y - 14, cx, cy - 60, t + i * 7, P.GB.CIVS[i].col, 3); }
      if (t > 300 && t < 470) P.Energy.reactor(c, cx, cy - 60, 6 + crack * 14, t, '#ffffff');
      // subtítulos y franjas
      c.fillStyle = '#000'; c.fillRect(0, 0, P.W, 22); c.fillRect(0, P.H - 22, P.W, 22);
      const ln = this.lines.filter(l => l[0] <= t).pop(); if (ln) { const sp = P.SPEAKERS[ln[1]] || { name: ln[1].toUpperCase(), col: '#ffffff' }, k = t - ln[0], tx = P.State.fmt(ln[2]); P.txt(c, sp.name, 14, P.H - 18, sp.col || '#ffffff'); P.txt(c, tx.slice(0, Math.floor(k * 1.5)), 14, P.H - 9, '#e8f0ff'); }
      if (t > 60) P.txt(c, P.input.label('confirm') + ' · saltar', P.W - 8, 8, '#5e6a86', { align: 'right' });
      if (broken && t > 520) P.txt(c, 'LA CÚPULA DE MEREK HA CAÍDO', P.W / 2, 40, '#ffd166', { align: 'center', outline: true, shadow: '#000' }); }
  };
})();
