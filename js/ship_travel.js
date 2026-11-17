'use strict';
// Viaje rápido por la nave: el plano de dos cubiertas (tecla M o clic en la barra de salas) lleva a cualquier sala
// al instante con un fundido corto.
(function () {
  const U = P.UIC;
  const SHORT = { camarote: ['Camarote'], puente: ['Puente', 'de mando'], navegacion: ['Navegación'], archivo: ['Archivo', 'Biológico'], taller: ['Taller'], laboratorio: ['Lab.', 'cyborg'], arsenal: ['Arsenal'], hangar: ['Bahía de', 'apoyo'], invernadero: ['Inver-', 'naderos'], jardin: ['Jardines'], comunicaciones: ['Comunica-', 'ciones'], entrenamiento: ['Entrena-', 'miento'], observatorio: ['Observa-', 'torio'], habitaciones: ['Habita-', 'ciones'], trofeos: ['Trofeos'], civs: ['Salón de', 'pueblos'] };
  const roomName = id => (P.D.ROOMS.find(r => r.id === id) || { name: id }).name;
  // tecla de número pulsada en este fotograma (índice de sala) o -1
  // detección propia de pulsaciones (una vez por fotograma), también para toques muy rápidos
  const KB = {}; let lastF = -1, cur = {};
  const scan = () => cur;
  const rescan = () => { const I = P.input; cur = {}; for (const k of ['KeyM']) { const d = !!I.keys[k]; cur[k] = (d && !KB[k]) || (!!I.latch[k] && !KB[k]); KB[k] = d; } return cur; };
  const mapPressed = () => !!scan().KeyM;

  P.ShipScene.prototype.travel = function (id) {
    if (this.warp) return;
    const i = P.SHIP_ORDER.indexOf(id); if (i < 0) return;
    if (id === this.curRoom) { P.Audio.sfx('back'); return; }
    if (!this.open(id)) { P.Audio.sfx('back'); P.toast('Sección dañada: ' + roomName(id), { col: U.red, life: 90 }); return; }
    P.Audio.sfx('door'); this.warp = { t: 0, x: i * this.RW + 96, id };
  };
  const baseUpd = P.ShipScene.prototype.update;
  P.ShipScene.prototype.update = function () {
    // fundido corto: 10 fotogramas a negro, cambio de sala y 10 de vuelta
    rescan();
    if (this.warp) {
      const w = this.warp; w.t++; this.t++;
      if (w.t === 10) { const pl = this.pl; pl.x = w.x; pl.vx = 0; pl.vy = 0; pl.y = this.FY; pl.ground = true; pl.face = 1; this.updateCam(true); this.curRoom = w.id; this.roomT = 0; }
      if (w.t >= 20) this.warp = null;
      this.parts.update(); return;
    }
    if (!P.ui.length) {
      if (mapPressed()) { P.Audio.sfx('select'); P.openUI(new P.ShipMapUI(this)); return; }
      // clic sobre la barra de salas del HUD
      const ck = P.input.click; if (ck && P.frame - ck.t < 3) { const mx = P.W / 2 - 70, i = Math.floor((ck.x - mx) / 9); if (ck.y >= P.H - 13 && ck.y <= P.H - 3 && i >= 0 && i < P.SHIP_ORDER.length) { P.input.click = null; P.Audio.sfx('select'); const m = new P.ShipMapUI(this); m.sel = i; P.openUI(m); return; } }
    }
    baseUpd.call(this);
    // paso algo más rápido por los pasillos
    const I = P.input, dir = (I.down('right') ? 1 : 0) - (I.down('left') ? 1 : 0);
    if (dir && !P.ui.length) this.pl.x = P.clamp(this.pl.x + dir * (I.down('dash') ? 0.9 : 0.6), 12, this.W - 12);
  };
  const baseHUD = P.ShipScene.prototype.drawHUD;
  P.ShipScene.prototype.drawHUD = function (c, cx) {
    baseHUD.call(this, c, cx);
    // números sobre la barra de salas
    const mx = P.W / 2 - 70;
    if (this.warp) { const k = this.warp.t < 10 ? this.warp.t / 10 : 1 - (this.warp.t - 10) / 10; c.fillStyle = 'rgba(2,4,10,' + k.toFixed(2) + ')'; c.fillRect(0, 0, P.W, P.H); if (this.warp.t >= 6 && this.warp.t <= 14) P.txt(c, roomName(this.warp.id), P.W / 2, P.H / 2 - 4, P.ROOM_COL[this.warp.id], { align: 'center' }); }
  };

  // plano de la nave en dos cubiertas
  P.ShipMapUI = class extends P.UIBase {
    constructor(sc) { super(); this.sc = sc; this.sel = Math.max(0, P.SHIP_ORDER.indexOf(sc.curRoom)); }
    go(i) { const id = P.SHIP_ORDER[i]; if (!this.sc.open(id)) { P.Audio.sfx('back'); return; } this.close(); this.sc.travel(id); }
    update() {
      this.t++; rescan(); const I = P.input, n = P.SHIP_ORDER.length, half = Math.ceil(n / 2);
      if (I.pressed('right')) { this.sel = (this.sel + 1) % n; P.Audio.sfx('move'); }
      if (I.pressed('left')) { this.sel = (this.sel + n - 1) % n; P.Audio.sfx('move'); }
      if (I.pressed('down') || I.pressed('up')) { this.sel = this.sel < half ? Math.min(n - 1, this.sel + half) : this.sel - half; P.Audio.sfx('move'); }
      if (I.pressed('confirm') || I.pressed('interact')) { this.go(this.sel); return; }
      if (I.pressed('back') || mapPressed()) { this.close(); P.Audio.sfx('back'); return; }
      const ck = I.click; if (ck && P.frame - ck.t < 3) { I.click = null; const hit = this.cells().findIndex(r => ck.x >= r.x && ck.x <= r.x + r.w && ck.y >= r.y && ck.y <= r.y + r.h); if (hit >= 0) { if (hit === this.sel) this.go(hit); else { this.sel = hit; P.Audio.sfx('move'); } } }
    }
    cells() { const n = P.SHIP_ORDER.length, half = Math.ceil(n / 2), out = []; for (let i = 0; i < n; i++) { const row = i < half ? 0 : 1, col = i % half; out.push({ x: 8 + col * 58, y: 62 + row * 76, w: 55, h: 58 }); } return out; }
    draw(c) {
      c.fillStyle = 'rgba(2,4,12,0.88)'; c.fillRect(0, 0, P.W, P.H);
      P.txt(c, 'PLANO DE LA ' + P.D.SHIP_NAME.toUpperCase(), 10, 14, U.cyan); P.txt(c, 'Elige una sala: el teletransporte interno te lleva al instante', 10, 27, U.dim);
      P.txt(c, 'CUBIERTA SUPERIOR', 10, 51, '#8a9ab8'); P.txt(c, 'CUBIERTA INFERIOR', 10, 127, '#8a9ab8');
      // casco de la nave alrededor de las dos cubiertas
      c.strokeStyle = '#2a3a5a'; c.strokeRect(4.5, 46.5, 466, 160);
      const cells = this.cells();
      cells.forEach((r, i) => {
        const id = P.SHIP_ORDER[i], op = this.sc.open(id), cur = id === this.sc.curRoom, sel = i === this.sel, col = op ? P.ROOM_COL[id] : '#6a3038';
        c.fillStyle = sel ? 'rgba(40,60,100,0.9)' : 'rgba(12,18,34,0.9)'; c.fillRect(r.x, r.y, r.w, r.h);
        c.strokeStyle = sel ? '#ffffff' : col; c.globalAlpha = sel ? 1 : 0.6; c.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1); c.globalAlpha = 1;
        c.fillStyle = col; c.fillRect(r.x + 3, r.y + 3, r.w - 6, 3);
        (SHORT[id] || [roomName(id)]).forEach((l, k) => P.txt(c, l, r.x + r.w / 2, r.y + 20 + k * 10, op ? '#e8eef8' : '#8a5a60', { align: 'center' }));
        if (!op) P.txt(c, 'DAÑADA', r.x + r.w / 2, r.y + r.h - 10, '#ff6a6a', { align: 'center' });
        if (cur) { P.txt(c, 'AQUÍ', r.x + r.w / 2, r.y + r.h - 10, U.green, { align: 'center' }); c.fillStyle = U.green; c.fillRect(r.x + r.w / 2 - 1, r.y - 4, 3, 3); }
      });
      // escalera central entre cubiertas y ficha de la sala elegida
      c.fillStyle = '#2a3a5a'; for (let y = 122; y < 138; y += 3) c.fillRect(234, y, 8, 1);
      { const id = P.SHIP_ORDER[this.sel], room = P.D.ROOMS.find(r => r.id === id) || {}, op = this.sc.open(id); P.txt(c, roomName(id), 10, 214, op ? P.ROOM_COL[id] : '#ff6a6a'); P.txt(c, op ? (room.fn || '') : 'Sección dañada · ' + (room.lock || ''), 10, 225, op ? '#c8d4e8' : '#d08a94'); }
      this.hints(c, [['left', 'Elegir'], ['confirm', 'Ir'], ['back', 'Cerrar']]);
    }
  };
})();
