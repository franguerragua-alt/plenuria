'use strict';
// Render de la nave «Vigía del Alba»: espacio tras ventanas reales, paredes por capas, primer plano e iluminación
// Capas: panorama espacial (parallax) → contenido de ventanas → vidrio → pared con huecos → marcos → atrezo
//        → suelo brillante → personajes → mamparos en primer plano → luz aditiva → viñeta → HUD
(function () {
  const RW = 192, FY = 214, TOP = 38;
  // ventanas por sala (coordenadas relativas a la sala)
  const WIN = {
    puente: [{ k: 'rect', x: 14, y: 46, w: 164, h: 100, r: 10 }],
    observatorio: [{ k: 'arch', x: 10, y: 42, w: 172, h: 150 }],
    camarote: [{ k: 'circ', x: 96, y: 86, r: 24 }],
    navegacion: [{ k: 'circ', x: 30, y: 66, r: 10 }, { k: 'circ', x: 162, y: 66, r: 10 }],
    invernadero: [{ k: 'rect', x: 16, y: 42, w: 160, h: 26, r: 4 }],
    jardin: [{ k: 'rect', x: 16, y: 42, w: 160, h: 30, r: 4 }],
    trofeos: []
  };
  const winsFor = id => WIN[id] || [{ k: 'circ', x: 48, y: 72, r: 12 }, { k: 'circ', x: 144, y: 72, r: 12 }];
  const shapePath = (c, w, x0) => {
    if (w.k === 'circ') { c.moveTo(x0 + w.x + w.r, w.y); c.arc(x0 + w.x, w.y, w.r, 0, Math.PI * 2, true); }
    else if (w.k === 'arch') { const x = x0 + w.x, rr = w.w / 2; c.moveTo(x, w.y + w.h); c.lineTo(x + w.w, w.y + w.h); c.lineTo(x + w.w, w.y + rr * 0.6); c.ellipse(x + rr, w.y + rr * 0.6, rr, rr * 0.6, 0, 0, Math.PI, true); c.closePath(); }
    else { const x = x0 + w.x, r = w.r; c.moveTo(x + r, w.y); c.lineTo(x + w.w - r, w.y); c.quadraticCurveTo(x + w.w, w.y, x + w.w, w.y + r); c.lineTo(x + w.w, w.y + w.h - r); c.quadraticCurveTo(x + w.w, w.y + w.h, x + w.w - r, w.y + w.h); c.lineTo(x + r, w.y + w.h); c.quadraticCurveTo(x, w.y + w.h, x, w.y + w.h - r); c.lineTo(x, w.y + r); c.quadraticCurveTo(x, w.y, x + r, w.y); c.closePath(); }
  };
  const winPath = (c, id, x0) => { c.beginPath(); for (const w of winsFor(id)) shapePath(c, w, x0); };
  const wallPath = (c, id, x0) => { c.beginPath(); c.rect(x0, TOP, RW, FY - TOP); for (const w of winsFor(id)) shapePath(c, w, x0); };

  P.ShipScene.prototype.draw = function (c) {
  this.zones = [];
    const cx = Math.round(this.cam.x), S = P.State, d = S.data;
    // 1 · espacio con nebulosas (parallax)
    const pano = P.Space.panorama(), off = -((cx * 0.12) % pano.width);
    c.drawImage(pano, Math.round(off), 0); c.drawImage(pano, Math.round(off + pano.width), 0);
    // 2 · salas (fondo)
    for (let i = 0; i < P.SHIP_ORDER.length; i++) { const x0 = i * RW - cx; if (x0 > P.W || x0 + RW < 0) continue; this.drawRoom(c, P.SHIP_ORDER[i], x0); }
    // 3 · personajes
    for (const n of this.npcs) { const x = n.x - cx; if (x < -20 || x > P.W + 20) continue; c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(Math.round(x - 5), FY - 1, 11, 2); P.spr(c, 'npc_' + n.look, n.walk > 0 ? 2 + Math.floor(n.t / 8) % 4 : Math.floor(n.t / 40) % 2, Math.round(x - 6), FY - 24, { flip: n.face < 0 }); }
    const pl = this.pl, F = P.HERO_F;
    const fr = !pl.ground ? (pl.vy < 0 ? F.jump : F.fall) : Math.abs(pl.vx) > 0.3 ? F.run + Math.floor(pl.af) % 6 : F.idle + Math.floor(this.t / 30) % 2;
    c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(Math.round(pl.x - 7 - cx), FY - 1, 14, 2);
    P.spr(c, 'hero_' + d.skin, fr, Math.round(pl.x - 12 - cx), Math.round(pl.y - 28), { flip: pl.face < 0 });
    // reflejo en el suelo pulido
    c.save(); c.globalAlpha = 0.18; c.translate(0, FY * 2 + 1); c.scale(1, -1);
    P.spr(c, 'hero_' + d.skin, fr, Math.round(pl.x - 12 - cx), Math.round(pl.y - 28), { flip: pl.face < 0 }); c.restore();
    this.parts.draw(c, cx, 0);
    // 4 · primer plano y luz
    for (let i = 0; i < P.SHIP_ORDER.length; i++) { const x0 = i * RW - cx; if (x0 > P.W + 20 || x0 + RW < -20) continue; this.drawLights(c, P.SHIP_ORDER[i], x0); }
    for (let i = 0; i <= P.SHIP_ORDER.length; i++) { const x0 = i * RW - cx; if (x0 < -20 || x0 > P.W + 20) continue; this.drawBulkhead(c, i, x0); }
    // tuberías del techo en primer plano
    c.fillStyle = '#0a0e1a'; c.fillRect(0, 26, P.W, 6); c.fillStyle = '#2a344e'; c.fillRect(0, 27, P.W, 1);
    for (let x = -((cx * 1.15) % 64); x < P.W; x += 64) { c.fillStyle = '#141a2c'; c.fillRect(Math.round(x), 24, 6, 10); c.fillStyle = '#3a4668'; c.fillRect(Math.round(x), 24, 1, 10); }
    // viñeta
    const vg = c.createRadialGradient(P.W / 2, P.H / 2, P.H * 0.45, P.W / 2, P.H / 2, P.W * 0.62); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(2,2,10,0.45)'); c.fillStyle = vg; c.fillRect(0, 0, P.W, P.H);
    P.FX.post(c, P.FX.profShip());
    this.drawHUD(c, cx);
  };

  P.ShipScene.prototype.drawRoom = function (c, id, x0) {
    const S = P.State, d = S.data, op = this.open(id), col = P.ROOM_COL[id], t = this.t;
    // contenido especial de las ventanas
    c.save(); winPath(c, id, x0); c.clip();
    if (id === 'puente') { const pid = d.lastPlanet || 'verzara', lib = S.liberated ? S.liberated(pid) / 10 : 0; P.Space.drawPlanet(c, pid, x0 + 128 + Math.sin(t * 0.003) * 2, 104, 40, lib); c.drawImage(P.Space.dyson(5), x0 + 30, 52);
      // destino recién desbloqueado y aún no visitado: aparece a lo lejos
      const nx = P.D.PLANETS.find(pp => pp.id !== pid && S.revealed(pp.id) && !(d.planets[pp.id] && Object.keys(d.planets[pp.id].levels || {}).length)); if (nx) P.FX.revealPlanet(c, this, nx, x0 + 62, 82, 8); }
    if (id === 'observatorio') {
      const dy = P.Space.dyson(14); c.drawImage(dy, Math.round(x0 + 96 - dy.width / 2), Math.round(108 - dy.height / 2));
      P.D.PLANETS.forEach((pp, i) => { if (!S.revealed(pp.id)) return; const a = t * 0.0015 * (240 / pp.orbit) + i * 2.1, rr = 30 + i * 8, px = x0 + 96 + Math.cos(a) * rr * 1.1, py = 108 + Math.sin(a) * rr * 0.35; P.FX.revealPlanet(c, this, pp, px, py, 4 + (pp.size > 10 ? 1 : 0)); });
    }
    if (id === 'camarote') P.Space.drawPlanet(c, 'verzara', x0 + 108, 96, 14, 0);
    // vidrio: tinte azulado y reflejos diagonales
    c.fillStyle = op ? 'rgba(90,160,255,0.07)' : 'rgba(255,40,60,0.08)'; c.fillRect(x0, TOP, RW, FY - TOP);
    c.globalAlpha = 0.07; c.fillStyle = '#ffffff';
    for (let k = 0; k < 3; k++) { const sx = x0 + 20 + k * 60; c.beginPath(); c.moveTo(sx, TOP); c.lineTo(sx + 14, TOP); c.lineTo(sx - 46, FY); c.lineTo(sx - 60, FY); c.fill(); }
    c.globalAlpha = 1; c.restore();
    // pared con huecos para las ventanas
    const tint = op ? P.Col.mix('#1a2440', col, 0.07) : '#1a1218', tint2 = op ? P.Col.mix('#0c1222', col, 0.04) : '#0c080e';
    const wg = c.createLinearGradient(0, TOP, 0, FY); wg.addColorStop(0, tint); wg.addColorStop(1, tint2);
    c.fillStyle = wg; wallPath(c, id, x0); c.fill('evenodd');
    c.save(); wallPath(c, id, x0); c.clip('evenodd');
    // paneles, costillas y zócalo
    for (let i = 0; i < 5; i++) { const px = x0 + 6 + i * 38; c.fillStyle = 'rgba(255,255,255,0.03)'; c.fillRect(px, TOP + 4, 34, FY - TOP - 46); c.fillStyle = 'rgba(255,255,255,0.08)'; c.fillRect(px, TOP + 4, 1, FY - TOP - 46); c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(px + 33, TOP + 4, 1, FY - TOP - 46); }
    for (let y = TOP + 40; y < FY - 40; y += 40) { c.fillStyle = 'rgba(0,0,0,0.22)'; c.fillRect(x0, y, RW, 1); c.fillStyle = 'rgba(255,255,255,0.05)'; c.fillRect(x0, y + 1, RW, 1); }
    c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(x0, FY - 40, RW, 40); c.fillStyle = op ? P.Col.rgba(col, 0.5) : 'rgba(255,40,60,0.4)'; c.fillRect(x0, FY - 40, RW, 1);
    for (let i = 0; i < 6; i++) { c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(x0 + 12 + i * 30, FY - 32, 18, 2); c.fillRect(x0 + 12 + i * 30, FY - 26, 18, 2); }
    c.restore();
    // marcos metálicos de las ventanas
    for (const w of winsFor(id)) {
      c.lineWidth = 4; c.strokeStyle = '#2a3450'; c.beginPath(); shapePath(c, w, x0); c.stroke();
      c.lineWidth = 1; c.strokeStyle = '#8a9ac8'; c.beginPath(); shapePath(c, w, x0); c.stroke();
      if (w.k === 'circ') { for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; c.fillStyle = '#c8d4f0'; c.fillRect(Math.round(x0 + w.x + Math.cos(a) * (w.r + 1)), Math.round(w.y + Math.sin(a) * (w.r + 1)), 1, 1); } if (!op) { c.strokeStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.moveTo(x0 + w.x - w.r * 0.6, w.y - w.r * 0.2); c.lineTo(x0 + w.x, w.y + 2); c.lineTo(x0 + w.x + w.r * 0.4, w.y - w.r * 0.5); c.moveTo(x0 + w.x, w.y + 2); c.lineTo(x0 + w.x + 2, w.y + w.r * 0.7); c.stroke(); } }
      if (w.k === 'rect' && w.w > 100) for (let k = 1; k < 4; k++) { c.fillStyle = '#2a3450'; c.fillRect(x0 + w.x + Math.round(w.w * k / 4) - 1, w.y, 3, w.h); c.fillStyle = '#5a6a98'; c.fillRect(x0 + w.x + Math.round(w.w * k / 4) - 1, w.y, 1, w.h); }
      if (w.k === 'arch') for (let k = 1; k < 4; k++) { c.fillStyle = '#2a3450'; c.fillRect(x0 + w.x + Math.round(w.w * k / 4) - 1, w.y + 6, 3, w.h - 6); c.fillStyle = '#5a6a98'; c.fillRect(x0 + w.x + Math.round(w.w * k / 4) - 1, w.y + 6, 1, w.h - 6); }
    }
    // techo con lámparas
    c.fillStyle = '#121a2c'; c.fillRect(x0, 30, RW, 8); c.fillStyle = '#2c3654'; c.fillRect(x0, 37, RW, 1);
    for (const lx of [48, 144]) { c.fillStyle = '#3a4668'; c.fillRect(x0 + lx - 14, 36, 28, 4); c.fillStyle = op ? '#f4fbff' : (t % 70 < 6 ? '#ff6a7a' : '#3a2028'); c.fillRect(x0 + lx - 11, 39, 22, 2); }
    // suelo pulido
    const fg = c.createLinearGradient(0, FY, 0, P.H); fg.addColorStop(0, op ? '#2e3a5c' : '#2a1c24'); fg.addColorStop(1, '#0c101c'); c.fillStyle = fg; c.fillRect(x0, FY, RW, P.H - FY);
    c.fillStyle = op ? P.Col.rgba(col, 0.6) : 'rgba(255,60,80,0.4)'; c.fillRect(x0, FY, RW, 1); c.fillStyle = 'rgba(255,255,255,0.12)'; c.fillRect(x0, FY + 1, RW, 1);
    for (let i = 0; i < RW; i += 24) { c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(x0 + i, FY + 3, 1, P.H - FY); }
    for (const lx of [48, 144]) { const g = c.createLinearGradient(0, FY, 0, FY + 40); g.addColorStop(0, op ? P.Col.rgba(P.Col.mix('#ffffff', col, 0.4), 0.18) : 'rgba(255,60,80,0.08)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x0 + lx - 18, FY + 2, 36, 40); }
    if (!op) { this.drawDamaged(c, id, x0); return; }
    this.drawProps(c, id, x0);
  };

  P.ShipScene.prototype.drawDamaged = function (c, id, x0) {
    const t = this.t;
    c.fillStyle = '#1a1018'; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(x0 + 20 + i * 36, FY); c.lineTo(x0 + 34 + i * 36, FY - 14 - (i % 3) * 8); c.lineTo(x0 + 50 + i * 36, FY); c.fill(); }
    c.fillStyle = '#2a1e28'; c.save(); c.translate(x0 + 120, 120); c.rotate(0.5); c.fillRect(-30, -3, 60, 6); c.restore();
    if (t % 90 < 4) { c.fillStyle = '#ffd166'; c.fillRect(x0 + 60 + (t % 7) * 10, 40, 2, 6); this.parts.add({ x: x0 + 70 + this.cam.x, y: 42, vx: P.rand(-1, 1), vy: P.rand(0, 2), g: 0.1, life: 20, col: '#ffd166' }); }
    P.txt(c, 'SECCIÓN DAÑADA', x0 + RW / 2, 110, '#ff6a7a', { align: 'center', outline: true, shadow: '#1a0008' });
    const room = P.D.ROOMS.find(r => r.id === id); P.wrap(room.lock || '', 160).forEach((l, i) => P.txt(c, l, x0 + RW / 2, 124 + i * 10, '#d08a94', { align: 'center' }));
  };

  // luz aditiva por sala (conos de lámparas, resplandor de ventanas) y emergencia en salas dañadas
  P.ShipScene.prototype.drawLights = function (c, id, x0) {
    const op = this.open(id), col = P.ROOM_COL[id], t = this.t;
    c.save(); c.globalCompositeOperation = 'lighter';
    for (const lx of [48, 144]) {
      const g = c.createLinearGradient(0, 40, 0, FY); const lc = op ? P.Col.mix('#ffffff', col, 0.35) : '#ff2a40', a = op ? 0.10 : (0.05 + Math.sin(t * 0.08) * 0.04);
      g.addColorStop(0, P.Col.rgba(lc, a)); g.addColorStop(1, P.Col.rgba(lc, 0));
      c.fillStyle = g; c.beginPath(); c.moveTo(x0 + lx - 10, 40); c.lineTo(x0 + lx + 10, 40); c.lineTo(x0 + lx + 44, FY); c.lineTo(x0 + lx - 44, FY); c.fill();
    }
    if (op && (id === 'invernadero' || id === 'jardin')) {
      for (let k = 0; k < 4; k++) { const bx = x0 + 30 + k * 42, g = c.createLinearGradient(0, 70, 0, FY); g.addColorStop(0, 'rgba(255,240,170,0.16)'); g.addColorStop(1, 'rgba(160,255,140,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(bx, 70); c.lineTo(bx + 22, 70); c.lineTo(bx + 40, FY); c.lineTo(bx + 14, FY); c.fill(); }
    }
    if (op && (id === 'puente' || id === 'observatorio')) { const g = c.createRadialGradient(x0 + 110, FY, 4, x0 + 110, FY, 90); g.addColorStop(0, 'rgba(120,255,200,0.12)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x0, FY - 90, RW, 140); }
    c.restore();
    if (!op) { c.fillStyle = 'rgba(6,0,6,0.35)'; c.fillRect(x0, TOP, RW, P.H - TOP); P.drawGlow(c, x0 + 96, 44, 40 + Math.sin(t * 0.1) * 8, '#ff2a40', 0.35); }
  };

  // mamparo entre salas (primer plano, delante de los personajes)
  P.ShipScene.prototype.drawBulkhead = function (c, i, x0) {
    const id = P.SHIP_ORDER[Math.min(i, P.SHIP_ORDER.length - 1)], prev = P.SHIP_ORDER[Math.max(0, i - 1)];
    const lit = this.open(id) || this.open(prev), col = this.open(id) ? P.ROOM_COL[id] : '#ff3a50';
    c.fillStyle = '#0c1020'; c.fillRect(x0 - 6, 24, 12, P.H - 24);
    c.fillStyle = '#2a3452'; c.fillRect(x0 - 5, 24, 2, P.H - 24); c.fillStyle = '#05070e'; c.fillRect(x0 + 4, 24, 2, P.H - 24);
    c.fillStyle = col; c.globalAlpha = lit ? 0.9 : 0.5; c.fillRect(x0 - 1, 70, 2, 26); c.globalAlpha = 1;
    P.drawGlow(c, x0, 83, 10, col, lit ? 0.5 : 0.25);
    for (let y = FY + 6; y < P.H; y += 6) { c.fillStyle = (y / 6) % 2 ? '#ffcc00' : '#1a1a22'; c.fillRect(x0 - 6, y, 12, 3); }
    for (const y of [44, 140, 196]) { c.fillStyle = '#5a6a98'; c.fillRect(x0 - 3, y, 1, 1); c.fillRect(x0 + 2, y, 1, 1); }
  };

  P.ShipScene.prototype.drawHUD = function (c, cx) {
    const d = P.State.data, id = P.SHIP_ORDER[P.clamp(Math.floor(this.pl.x / RW), 0, P.SHIP_ORDER.length - 1)], room = P.D.ROOMS.find(x => x.id === id), op = this.open(id);
    const head = P.D.SHIP_NAME.toUpperCase() + ' · ' + (room ? room.name : ''), sub = op ? room.fn : 'SECCIÓN DAÑADA · ' + (room.lock || '');
    P.panel(c, 4, 4, Math.max(200, P.txtW(head), P.txtW(sub)) + 14, 28, { fill: 'rgba(6,12,26,0.85)', border: op ? P.ROOM_COL[id] : P.UIC.red, noAccent: true });
    P.txt(c, head, 10, 9, op ? P.ROOM_COL[id] : P.UIC.red); P.txt(c, sub, 10, 20, op ? '#c8d4e8' : '#ff8a8a');
    let x = P.W - 6; for (const k of ['crys', 'scrap', 'bio']) { const s = String(d.res[k]); x -= P.txtW(s); P.txt(c, s, x, 7, '#ffffff'); x -= 13; P.spr(c, 'i_' + k, 0, x, 6); x -= 8; }
    P.txt(c, 'Integridad ' + Math.round(Object.keys(d.rooms).length / P.SHIP_ORDER.length * 100) + ' %', P.W - 6, 20, P.UIC.dim, { align: 'right' });
    // plano de la nave con la sala actual
    const mx = P.W / 2 - 70; P.panel(c, mx - 4, P.H - 13, 148, 10, { cut: 2, noAccent: true, fill: 'rgba(4,8,18,0.8)', border: '#2a3a5a' });
    for (let i = 0; i < P.SHIP_ORDER.length; i++) { const sid = P.SHIP_ORDER[i]; c.fillStyle = sid === id ? '#ffffff' : this.open(sid) ? P.ROOM_COL[sid] : '#4a2028'; c.fillRect(mx + i * 9, P.H - 10, 7, 4); }
    if (this.focus) { const f = this.focus, fx = Math.round(f.x - cx), w = P.txtW(f.label) + P.txtW(P.input.label('interact')) + 14; P.panel(c, fx - w / 2, FY - 52, w, 13, { cut: 2, noAccent: true }); P.keyHint(c, fx - w / 2 + 3, FY - 49, 'interact', f.label, '#e8f4ff'); }
    else P.txt(c, '← → moverse · ' + P.input.label('interact') + ' interactuar · M plano de la nave · ' + P.input.label('pause') + ' menú', P.W / 2, P.H - 34, P.UIC.dim, { align: 'center' });
  };
})();

// Vestidor de la sala de trajes: un único armario; dentro se ve solo el traje equipado
P.Sprites.wardrobe = function (c, x, FY, d, t) {
  const W = 52, H = 92, y = FY - H;
  c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(x + 3, FY - 3, W, 4);
  c.fillStyle = '#2a3150'; c.fillRect(x, y, W, H); c.fillStyle = '#4a5680'; c.fillRect(x, y, W, 3); c.fillRect(x, y, 2, H); c.fillStyle = '#161b2e'; c.fillRect(x + W - 2, y, 2, H);
  c.fillStyle = '#ff8a7a'; c.fillRect(x + 4, y + 5, W - 8, 1); P.txt(c, 'VESTIDOR', x + W / 2, y + 8, '#ffb0a0', { align: 'center' });
  // vitrina iluminada
  const gx = x + 6, gy = y + 18, gw = W - 12, gh = H - 30;
  const g = c.createLinearGradient(0, gy, 0, gy + gh); g.addColorStop(0, '#24345a'); g.addColorStop(1, '#0e1426'); c.fillStyle = g; c.fillRect(gx, gy, gw, gh);
  c.fillStyle = '#8a98bc'; c.fillRect(gx + 4, gy + 4, gw - 8, 1); c.fillRect(gx + gw / 2, gy + 4, 1, 4);
  P.drawGlow(c, gx + gw / 2, gy + gh / 2, 22, '#5ee8ff', 0.22 + Math.sin(t * 0.05) * 0.06);
  P.spr(c, 'hero_' + (d.skin || 'rojo'), 0, gx + gw / 2 - 12, gy + 10);
  c.fillStyle = 'rgba(190,230,255,0.10)'; c.fillRect(gx, gy, gw / 2, gh); c.fillStyle = 'rgba(255,255,255,0.25)'; c.fillRect(gx + 3 + ((t >> 2) % (gw + 10)) - 6, gy, 2, gh);
  c.strokeStyle = '#6a7aa8'; c.lineWidth = 1; c.strokeRect(gx + 0.5, gy + 0.5, gw - 1, gh - 1); c.fillRect(gx + gw / 2, gy, 1, gh);
  c.fillStyle = '#ffd166'; c.fillRect(gx + gw / 2 - 3, gy + gh / 2, 1, 4); c.fillRect(gx + gw / 2 + 3, gy + gh / 2, 1, 4);
  // cajón con indicador de trajes disponibles
  c.fillStyle = '#20263e'; c.fillRect(x + 4, FY - 10, W - 8, 8); const sl = P.WARDROBE_SLOTS();
  for (let i = 0; i < sl.length; i++) { c.fillStyle = d.skins.includes(sl[i]) ? '#7dffa0' : '#3a4458'; c.fillRect(x + 6 + i * 4.5, FY - 7, 3, 2); }
};
