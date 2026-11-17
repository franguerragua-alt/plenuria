'use strict';
// Dificultad por partida (se guarda con la partida en S.data.diff). Afecta a la vida de enemigos y jefes, al daño que recibes,
// a las curaciones que sueltan los enemigos y a cuántos enemigos extra (de las mismas especies del nivel) aparecen.
P.DIFFS = {
  facil: { name: 'FÁCIL', col: '#7dffa0', hp: 0.7, boss: 0.75, dmg: 0.6, heal: 1.6, extra: 0.2, desc: 'Enemigos más débiles y menos daño. Para disfrutar de la historia y la exploración.' },
  normal: { name: 'NORMAL', col: '#5ee8ff', hp: 1, boss: 1, dmg: 1, heal: 1, extra: 0.5, desc: 'La experiencia pensada para PLENURIA: combates exigentes pero justos.' },
  dificil: { name: 'DIFÍCIL', col: '#ffb03a', hp: 1.3, boss: 1.3, dmg: 1.4, heal: 0.7, extra: 0.85, desc: 'Más enemigos, más resistentes y que golpean más fuerte. Menos curaciones.' },
  leyenda: { name: 'LEYENDA', col: '#ff3a5a', hp: 1.6, boss: 1.6, dmg: 1.8, heal: 0.4, extra: 1.2, desc: 'Hordas implacables y jefes colosales. Casi no hay curaciones: cada golpe cuenta.' }
};
P.DIFF_ORDER = ['facil', 'normal', 'dificil', 'leyenda'];
P.DIFF = {
  id() { const d = P.State && P.State.data; return d && P.DIFFS[d.diff] ? d.diff : 'normal'; },
  get() { return P.DIFFS[this.id()]; }
};

// elección de dificultad (al empezar una partida y desde Opciones)
P.DifficultyUI = class extends P.UIBase {
  constructor(cur, cb, cancel) { super(); this.cb = cb; this.cancel = cancel; this.sel = Math.max(0, P.DIFF_ORDER.indexOf(cur || 'normal')); }
  card(i) { return { x: 40, y: 40 + i * 51, w: 400, h: 47 }; }
  choose() { const id = P.DIFF_ORDER[this.sel]; P.Audio.sfx('select'); this.close(); this.cb(id); }
  update() {
    this.t++; this.nav(4); const I = P.input;
    const ck = I.click; if (ck && P.frame - ck.t < 3) { for (let i = 0; i < 4; i++) { const r = this.card(i); if (ck.x >= r.x && ck.x <= r.x + r.w && ck.y >= r.y && ck.y <= r.y + r.h) { I.click = null; if (this.sel === i) { this.choose(); return; } this.sel = i; P.Audio.sfx('move'); } } }
    if (I.pressed('confirm')) this.choose();
    else if (this.cancel && I.pressed('back')) { P.Audio.sfx('back'); this.close(); }
  }
  draw(c) {
    const U = P.UIC; this.dim(c, 0.92); this.title(c, 'DIFICULTAD DE LA PARTIDA', 'Se puede cambiar después en Opciones');
    P.DIFF_ORDER.forEach((id, i) => {
      const D = P.DIFFS[id], r = this.card(i), s = i === this.sel;
      P.panel(c, r.x, r.y, r.w, r.h, { border: s ? D.col : '#2a3a5a', fill: s ? 'rgba(18,28,48,0.97)' : U.panel, noAccent: !s });
      P.txt(c, D.name, r.x + 10, r.y + 6, s ? D.col : '#c8d4e8');
      for (let k = 0; k < 4; k++) { c.fillStyle = k <= i ? (s ? D.col : '#6a7890') : '#1e2a40'; c.fillRect(r.x + r.w - 58 + k * 12, r.y + 7, 8, 6); }
      P.wrap(D.desc, r.w - 20).slice(0, 2).forEach((l, j) => P.txt(c, l, r.x + 10, r.y + 17 + j * 9, s ? '#e8f4ff' : U.dim));
      P.txt(c, 'Vida enemiga ' + Math.round(D.hp * 100) + ' %  ·  Daño recibido ' + Math.round(D.dmg * 100) + ' %  ·  Enemigos extra +' + Math.round(D.extra * 100) + ' %', r.x + 10, r.y + 36, s ? D.col : '#4a5468');
    });
    this.hints(c, [['confirm', 'Elegir']].concat(this.cancel ? [['back', 'Volver']] : []));
  }
};
