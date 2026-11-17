'use strict';
// Sala de trofeos como galería: los nueve jefes en cuadros enmarcados (3x3) que caben en la pared,
// con focos sobre los conseguidos, y una vista de galería a pantalla completa para verlos de cerca.
(function () {
  const U = P.UIC;
  const bossOf = i => { const pl = P.D.PLANETS[i]; return { pl, id: pl.boss, b: P.D.BOSSES[pl.boss], sp: P.D.species(pl.boss), got: !!(P.State.data.planets[pl.id] && P.State.data.planets[pl.id].boss) }; };
  // cuadro enmarcado: marco dorado con moldura, lienzo con los colores del planeta y el retrato del jefe (o tapado con una tela)
  P.drawTrophyFrame = function (c, x, y, w, h, i, t, big) {
    const o = bossOf(i), col = o.pl.col || ['#2a2a3a', '#5a5a7a', '#1a1a2a'];
    c.fillStyle = '#5a3a10'; c.fillRect(x - 3, y - 3, w + 6, h + 6);
    c.fillStyle = o.got ? '#ffd166' : '#8a7a5a'; c.fillRect(x - 2, y - 2, w + 4, 1); c.fillRect(x - 2, y - 2, 1, h + 4);
    c.fillStyle = o.got ? '#a07a20' : '#4a3a20'; c.fillRect(x + w + 1, y - 2, 1, h + 4); c.fillRect(x - 2, y + h + 1, w + 4, 1);
    for (const [cx2, cy2] of [[x - 3, y - 3], [x + w + 1, y - 3], [x - 3, y + h + 1], [x + w + 1, y + h + 1]]) { c.fillStyle = o.got ? '#fff0b0' : '#8a7a5a'; c.fillRect(cx2, cy2, 2, 2); }
    if (o.got) {
      const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, col[2]); g.addColorStop(1, col[0]); c.fillStyle = g; c.fillRect(x, y, w, h);
      c.fillStyle = 'rgba(255,255,255,0.06)'; for (let k = 0; k < h; k += 3) c.fillRect(x, y + k, w, 1);
      if (o.sp && P.S[o.sp.spr]) { c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); P.spr(c, o.sp.spr, 0, x + 2, y + 2, { fit: Math.min(w, h) - 4 }); c.restore(); }
      c.fillStyle = 'rgba(255,255,255,' + (0.08 + Math.sin(t * 0.03 + i) * 0.04) + ')'; c.fillRect(x + 2, y + 2, Math.round(w * 0.35), 1);
    } else {
      c.fillStyle = '#141a2a'; c.fillRect(x, y, w, h); c.fillStyle = '#20283e'; for (let k = 0; k < w; k += 4) c.fillRect(x + k, y, 2, h);
      P.txt(c, '?', x + w / 2 - 2, y + h / 2 - 4, '#5a6a8a');
    }
    if (big) P.txt(c, o.got ? o.b.name : '???', x + w / 2, y + h + 6, o.got ? '#ffd166' : '#6a7898', { align: 'center' });
  };
  // pared de la sala: 3x3 cuadros dentro del ancho de la sala (192 px)
  P.drawTrophyWall = function (sc, c, x0, t) {
    const d = P.State.data;
    for (let i = 0; i < 9; i++) {
      const fx = x0 + 18 + (i % 3) * 40, fy = 46 + Math.floor(i / 3) * 40, pl = P.D.PLANETS[i], got = d.planets[pl.id] && d.planets[pl.id].boss;
      if (got) P.drawGlow(c, fx + 15, fy + 13, 22, '#ffd8a0', 0.35);
      P.drawTrophyFrame(c, fx, fy, 30, 27, i, t, false);
      if (got) sc.zones.push({ x: fx - 3, y: fy - 3, w: 36, h: 33, fn: () => P.openUI(new P.CodexUI(pl.boss)) });
    }
    c.fillStyle = '#3a3020'; c.fillRect(x0 + 15, 168, 116, 3); c.fillStyle = '#ffd166'; c.fillRect(x0 + 15, 167, 116, 1);
    // vitrina de logros
    const FY = sc.FY; c.fillStyle = '#2c3654'; c.fillRect(x0 + 146, FY - 70, 34, 70); c.fillStyle = 'rgba(150,200,255,0.18)'; c.fillRect(x0 + 149, FY - 66, 28, 40);
    c.fillStyle = '#ffd166'; c.fillRect(x0 + 160, FY - 52, 6, 10); c.fillRect(x0 + 158, FY - 42, 10, 2);
    P.txt(c, Object.keys(d.ach).length + '/' + P.D.ACHIEVEMENTS.length, x0 + 163, FY - 20, P.UIC.violet, { align: 'center' });
  };
  // vista de la galería a pantalla completa
  P.TrophyGalleryUI = class extends P.UIBase {
    constructor() { super(); this.sel = 0; }
    rects() { const out = []; for (let i = 0; i < 9; i++) out.push({ x: 40 + (i % 3) * 140, y: 40 + Math.floor(i / 3) * 62, w: 84, h: 42 }); return out; }
    update() {
      this.t++; const I = P.input;
      if (I.pressed('right')) { this.sel = (this.sel + 1) % 9; P.Audio.sfx('move'); }
      if (I.pressed('left')) { this.sel = (this.sel + 8) % 9; P.Audio.sfx('move'); }
      if (I.pressed('down')) { this.sel = (this.sel + 3) % 9; P.Audio.sfx('move'); }
      if (I.pressed('up')) { this.sel = (this.sel + 6) % 9; P.Audio.sfx('move'); }
      const open = () => { const o = bossOf(this.sel); if (o.got && o.sp) { P.Audio.sfx('select'); P.openUI(new P.CodexUI(o.id)); } else P.Audio.sfx('back'); };
      if (I.pressed('confirm') || I.pressed('interact')) open();
      if (I.pressed('back')) { this.close(); P.Audio.sfx('back'); return; }
      const ck = I.click; if (ck && P.frame - ck.t < 3) { I.click = null; const k = this.rects().findIndex(r => ck.x >= r.x - 3 && ck.x <= r.x + r.w + 3 && ck.y >= r.y - 3 && ck.y <= r.y + r.h + 3); if (k >= 0) { if (k === this.sel) open(); else { this.sel = k; P.Audio.sfx('move'); } } }
    }
    draw(c) {
      c.fillStyle = '#1a1420'; c.fillRect(0, 0, P.W, P.H); c.fillStyle = '#221a2a'; for (let x = 0; x < P.W; x += 24) c.fillRect(x, 0, 12, P.H);
      c.fillStyle = '#3a2a1a'; c.fillRect(0, P.H - 44, P.W, 44); c.fillStyle = '#5a3a1a'; c.fillRect(0, P.H - 44, P.W, 2);
      P.txt(c, 'GALERÍA DE TROFEOS', 14, 12, U.gold);
      const n = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(i => bossOf(i).got).length; P.txt(c, 'Guardianes liberados: ' + n + '/9', P.W - 14, 12, U.dim, { align: 'right' });
      this.rects().forEach((r, i) => {
        const o = bossOf(i);
        if (o.got) { c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(0, r.y - 16, 0, r.y + r.h); g.addColorStop(0, 'rgba(255,220,150,0.14)'); g.addColorStop(1, 'rgba(255,220,150,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(r.x + r.w / 2 - 6, r.y - 16); c.lineTo(r.x + r.w / 2 + 6, r.y - 16); c.lineTo(r.x + r.w + 4, r.y + r.h); c.lineTo(r.x - 4, r.y + r.h); c.fill(); c.restore(); }
        P.drawTrophyFrame(c, r.x, r.y, r.w, r.h, i, this.t, true);
        if (i === this.sel) { c.strokeStyle = '#ffffff'; c.strokeRect(r.x - 5.5, r.y - 5.5, r.w + 11, r.h + 11); }
      });
      const o = bossOf(this.sel), rev = P.State.revealed(o.pl.id);
      P.txt(c, o.got ? o.b.name + ' · ' + o.b.title + ' · ' + o.pl.name : rev ? 'Guardián de ' + o.pl.name + ': aún no liberado' : 'Un guardián de un mundo aún desconocido', P.W / 2, P.H - 34, o.got ? '#ffe8b0' : '#8a98b8', { align: 'center' });
      this.hints(c, [['left', 'Elegir'], ['confirm', 'Ver ficha'], ['back', 'Salir']]);
    }
  };
})();
