'use strict';
// Interfaz: diálogos, menús, Archivo Biológico, progresión, mapa galáctico, HUD
const U = P.UIC;
P.SPEAKERS = {
  elara: { name: 'ELARA', por: 'por_elara', col: '#5ee8ff' }, sylae: { name: 'Sylaë', por: 'por_sylae', col: '#7dffa0' },
  kairo: { name: 'Kaïro-Vel', por: 'por_kairo', col: '#ffd166' }, mnemo: { name: 'Mnemo', por: 'por_mnemo', col: '#ff8ad8' },
  ssaru: { name: 'Ssaru', por: 'por_ssaru', col: '#ff8a3a' }, gerselle: { name: 'GERSELLE · Primera Ministra', por: 'por_gerselle', col: '#ff4060', tx: true },
  thersek: { name: 'THERSEK · Vicepresidente', por: 'por_thersek', col: '#7dff5a', tx: true }, merek: { name: 'MEREK · Presidente', por: 'por_merek', col: '#ff3040', tx: true },
  nova: { name: 'NOVA', por: 'por_nova', col: '#ff8ad8' }, luma: { name: 'LUMA', por: 'por_luma', col: '#7dffa0' }, sirio: { name: 'SIRIO', por: 'por_sirio', col: '#bff6ff' }
};
P.speaker = function (who, nameOv) {
  if (who === 'hero') return { name: P.State.name, por: 'heropor_' + P.State.data.skin, col: '#ff9c86' };
  const s = P.SPEAKERS[who]; if (s) return s;
  const civ = Object.keys(P.CIV).find(k => who.startsWith(k));
  return { name: nameOv || (civ ? P.CIV[civ].name.replace(/s$/, '') : '???'), por: 'por_' + who, col: '#c8d4e8' };
};

// ---------- base de ventanas ----------
P.UIBase = class {
  constructor() { this.t = 0; this.sel = 0; }
  close() { P.closeUI(this); }
  nav(n, cols = 1) {
    const I = P.input; let s = this.sel;
    if (I.pressed('down')) s += cols; if (I.pressed('up')) s -= cols;
    if (cols > 1) { if (I.pressed('right')) s++; if (I.pressed('left')) s--; }
    s = (s + n) % n; if (s !== this.sel) { this.sel = s; P.Audio.sfx('move'); }
  }
  dim(c, a = 0.6) { c.fillStyle = `rgba(2,4,10,${a})`; c.fillRect(0, 0, P.W, P.H); }
  title(c, text, sub, col = U.cyan) {
    P.txt(c, text, 14, 10, col, { scale: 1 }); c.fillStyle = col; c.globalAlpha = 0.5; c.fillRect(14, 21, P.txtW(text) + 30, 1); c.globalAlpha = 1;
    if (sub) P.txt(c, sub, P.W - 14, 10, U.dim, { align: 'right' });
  }
  hints(c, list) { let x = 12; for (const [a, l] of list) x += P.keyHint(c, x, P.H - 13, a, l); }
};

// ---------- diálogo ----------
P.Dialog = class extends P.UIBase {
  constructor(lines, cb, transmission) { super(); this.lines = lines.map(l => [l[0], P.State.fmt(l[1]), l[2]]); this.i = 0; this.ch = 0; this.cb = cb; this.blip = 0; }
  update() {
    this.t++; const L = this.lines[this.i], full = L[1].length;
    if (this.ch < full) { this.ch += 1.4; if (++this.blip % 3 === 0) P.Audio.sfx('blip'); }
    if (P.input.pressed('confirm') || P.input.pressed('interact') || P.input.pressed('attack')) {
      if (this.ch < full) this.ch = full;
      else { this.i++; this.ch = 0; P.Audio.sfx('select'); if (this.i >= this.lines.length) { this.close(); if (this.cb) this.cb(); } }
    }
    if (P.input.pressed('back') && this.t > 10) { this.close(); if (this.cb) this.cb(); }
  }
  draw(c) {
    const L = this.lines[Math.min(this.i, this.lines.length - 1)], sp = P.speaker(L[0], L[2]);
    const x = 8, y = 192, w = 464, h = 72;
    P.panel(c, x, y, w, h, { border: sp.col, fill: 'rgba(5,10,22,0.94)' });
    // retrato
    c.fillStyle = 'rgba(255,255,255,0.05)'; c.fillRect(x + 5, y + 5, 64, 62);
    if (P.S[sp.por]) {
      if (sp.tx) { const g = c.createRadialGradient(x + 37, y + 36, 4, x + 37, y + 36, 40); g.addColorStop(0, P.Col.rgba(sp.col, 0.45)); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x + 5, y + 5, 64, 62); }
      if (sp.tx && this.t % 50 < 3) c.globalAlpha = 0.4;
      const ps = P.S[sp.por], psc = Math.max(1, Math.floor(64 / ps.w));
      P.spr(c, sp.por, 0, x + 5 + Math.round((64 - ps.w * psc) / 2), y + 4 + Math.round((64 - ps.h * psc) / 2), { scale: psc }); c.globalAlpha = 1;
      if (L[0] === 'elara' || sp.tx) P.scanlines(c, x + 5, y + 5, 64, 62, 0.12);
    }
    P.txt(c, sp.name, x + 78, y + 7, sp.col);
    if (sp.tx && this.t % 60 < 44) P.txt(c, '◄ TRANSMISIÓN', x + 86 + P.txtW(sp.name), y + 7, P.Col.mix(sp.col, '#ffffff', 0.3));
    const text = L[1].slice(0, Math.floor(this.ch));
    P.wrap(text, w - 92).slice(0, 5).forEach((ln, i) => P.txt(c, ln, x + 78, y + 21 + i * 10, '#e8f4ff'));
    if (this.ch >= L[1].length && this.t % 40 < 26) P.txt(c, '▼', x + w - 12, y + h - 12, sp.col);
    P.txt(c, (this.i + 1) + '/' + this.lines.length, x + w - 8, y + 7, U.dim, { align: 'right' });
  }
};

// ---------- registros holográficos y memorias ----------
P.LoreView = class extends P.UIBase {
  constructor(def, kind, cb) { super(); this.def = def; this.kind = kind; this.cb = cb; if (kind === 'mem') P.Audio.sfx('charge'); }
  update() { this.t++; if (this.t > 20 && (P.input.pressed('confirm') || P.input.pressed('back') || P.input.pressed('interact'))) { this.close(); P.Audio.sfx('select'); if (this.cb) this.cb(); } }
  draw(c) {
    this.dim(c, 0.7);
    const mem = this.kind === 'mem', col = mem ? '#ff8a5a' : U.cyan, w = 340, x = (P.W - w) / 2;
    const lines = P.wrap(P.State.fmt(this.def.text), w - 30), h = 50 + lines.length * 11, y = (P.H - h) / 2;
    if (mem && this.t % 30 < 2) c.translate(P.rand(-2, 2), 0);
    P.panel(c, x, y, w, h, { border: col, fill: mem ? 'rgba(30,6,10,0.95)' : 'rgba(4,16,28,0.95)' });
    P.spr(c, mem ? 'i_mem' : 'i_holo', 0, x + 10, y + 9);
    P.txt(c, mem ? 'FRAGMENTO DE MEMORIA RECUPERADO' : 'REGISTRO HOLOGRÁFICO', x + 26, y + 10, col);
    P.txt(c, this.def.title, x + 14, y + 26, '#ffffff');
    lines.forEach((l, i) => P.txt(c, l.slice(0, Math.floor(this.t * 2.5) - i * 40 > 0 ? undefined : 0), x + 14, y + 42 + i * 11, mem ? '#ffd8c8' : '#c8f4ff'));
    P.scanlines(c, x, y, w, h, 0.1);
    if (this.t > 20) P.txt(c, 'Continuar ▶', x + w - 10, y + h - 12, U.dim, { align: 'right' });
    c.setTransform(1, 0, 0, 1, 0, 0);
  }
};

P.UpgradeView = class extends P.UIBase {
  constructor(id, cb) { super(); this.u = P.D.UPGRADES[id]; this.cb = cb; this.id = id; }
  update() { this.t++; if (this.t > 40 && (P.input.pressed('confirm') || P.input.pressed('interact'))) { this.close(); if (this.cb) this.cb(); } }
  draw(c) {
    this.dim(c, 0.75);
    const k = Math.min(1, this.t / 20), w = 320, h = 120, x = (P.W - w) / 2, y = (P.H - h) / 2;
    for (let i = 0; i < 12; i++) { const a = i / 12 * 7 + this.t * 0.01; c.strokeStyle = 'rgba(255,209,102,0.12)'; c.beginPath(); c.moveTo(P.W / 2, y + 30); c.lineTo(P.W / 2 + Math.cos(a) * 300, y + 30 + Math.sin(a) * 300); c.stroke(); }
    c.globalAlpha = k;
    P.panel(c, x, y, w, h, { border: U.gold });
    P.txt(c, 'MEJORA PLANETARIA · ' + P.D.planet(this.u.planet).name, P.W / 2, y + 10, U.gold, { align: 'center' });
    P.drawGlow(c, P.W / 2, y + 38, 22, '#ffd166', 0.8); P.spr(c, this.u.icon, 0, P.W / 2 - 10, y + 28, { scale: 2 });
    P.txt(c, this.u.name.toUpperCase(), P.W / 2, y + 56, '#ffffff', { align: 'center', scale: 1 });
    P.txt(c, '[' + this.u.kind + ']', P.W / 2, y + 68, U.cyan, { align: 'center' });
    let desc = this.u.desc; if (this.id === 'espinas') desc += P.input.label('swap') + '.';
    P.wrap(desc, w - 30).forEach((l, i) => P.txt(c, l, P.W / 2, y + 82 + i * 10, '#c8d4e8', { align: 'center' }));
    c.globalAlpha = 1;
  }
};

P.BossIntro = class extends P.UIBase {
  constructor(boss, cb) { super(); this.b = boss; this.cb = cb; P.Audio.sfx('roar'); P.Audio.music(boss.music || 'boss', boss.music ? undefined : boss.name); } // jefes sin pista propia: tema de jefe único derivado de su nombre
  update() { this.t++; if (this.t > (this.b.final ? 280 : 200) || (this.t > 60 && P.input.pressed('confirm'))) { this.close(); this.cb(); } }
  draw(c) {
    const k = Math.min(1, this.t / 25), bar = 46 * k;
    c.fillStyle = '#000'; c.fillRect(0, 0, P.W, bar); c.fillRect(0, P.H - bar, P.W, bar);
    const slide = Math.max(0, 1 - (this.t - 10) / 20) * 300;
    c.fillStyle = 'rgba(40,0,30,0.55)'; c.fillRect(0, 96, P.W, 76);
    c.fillStyle = this.b.col || '#ff5af0'; c.fillRect(0, 96, P.W * Math.min(1, this.t / 30), 1); c.fillRect(P.W * (1 - Math.min(1, this.t / 30)), 171, P.W, 1);
    P.txt(c, this.b.name, P.W / 2 + slide, 108, '#ffffff', { align: 'center', scale: 5, outline: true, shadow: '#3a0a30', col2: this.b.col || '#ff8ad8' });
    if (this.t > 35) P.txt(c, '— ' + this.b.title.toUpperCase() + ' —', P.W / 2, 152, this.b.col2 || '#ffd166', { align: 'center' });
    if (this.t > 50) P.txt(c, this.b.final ? 'El último guardián · Señor de las tormentas de ' + P.D.planet(this.b.planet).name : 'Jefe planetario de ' + P.D.planet(this.b.planet).name + ' · modificado por Thersek', P.W / 2, P.H - 34, '#c8d4e8', { align: 'center' });
    if (this.b.final && this.t % 90 < 5) { c.globalAlpha = 0.25; c.fillStyle = '#bff6ff'; c.fillRect(0, 0, P.W, P.H); c.globalAlpha = 1; }
  }
};

P.LevelDone = class extends P.UIBase {
  constructor(res, cb) { super(); this.r = res; this.cb = cb; }
  update() { this.t++; if (this.t > 50 && (P.input.pressed('confirm') || P.input.pressed('interact'))) { this.close(); P.Audio.sfx('select'); this.cb(); } }
  draw(c) {
    this.dim(c, 0.55 * Math.min(1, this.t / 20));
    const w = 280, h = 150, x = (P.W - w) / 2, y = (P.H - h) / 2, r = this.r;
    P.panel(c, x, y, w, h, { border: U.green });
    P.txt(c, r.boss ? 'JEFE PLANETARIO DERROTADO' : 'TERRITORIO LIBERADO', P.W / 2, y + 12, U.green, { align: 'center', scale: 1 });
    P.txt(c, r.name, P.W / 2, y + 26, '#ffffff', { align: 'center' });
    const rows = [['Tiempo', P.fmtTime(r.time)], ['Enemigos neutralizados', r.kills], ['Objetos recuperados', r.stars], ['Pasajes secretos', r.secrets], ['Sin recibir daño', r.noDmg ? 'SÍ ★' : 'no']];
    rows.forEach(([a, b], i) => { if (this.t > 15 + i * 8) { P.txt(c, a, x + 24, y + 48 + i * 14, U.dim); P.txt(c, String(b), x + w - 24, y + 48 + i * 14, '#ffffff', { align: 'right' }); } });
    if (r.first && this.t > 60) P.txt(c, 'La selva recupera este territorio', P.W / 2, y + h - 26, '#9cff6a', { align: 'center' });
    if (this.t > 50 && this.t % 40 < 28) P.txt(c, 'Continuar ▶', P.W / 2, y + h - 13, U.cyan, { align: 'center' });
  }
};

// ---------- menú genérico ----------
P.ListMenu = class extends P.UIBase {
  constructor(o) { super(); Object.assign(this, { title: '', items: [], x: P.W / 2 - 90, y: 80, w: 180 }, o); }
  update() {
    this.t++; this.nav(this.items.length);
    if (P.input.pressed('confirm')) { const it = this.items[this.sel]; if (it.disabled) { P.Audio.sfx('back'); return; } P.Audio.sfx('select'); it.action(this); }
    else if (P.input.pressed('back') && this.onBack !== false) { P.Audio.sfx('back'); this.close(); if (this.onBack) this.onBack(); }
  }
  draw(c) {
    if (this.dimBg !== false) this.dim(c, 0.6);
    const h = 26 + this.items.length * 15;
    P.panel(c, this.x, this.y, this.w, h, { border: this.col || U.cyan });
    P.txt(c, this.title, this.x + this.w / 2, this.y + 8, this.col || U.cyan, { align: 'center' });
    this.items.forEach((it, i) => {
      const y = this.y + 24 + i * 15, s = i === this.sel;
      if (s) { c.fillStyle = 'rgba(94,232,255,0.15)'; c.fillRect(this.x + 4, y - 3, this.w - 8, 13); P.txt(c, '▶', this.x + 8, y, U.cyan); }
      P.txt(c, it.label, this.x + 18, y, it.disabled ? '#4a5468' : s ? '#ffffff' : '#c8d4e8');
      if (it.sub) P.txt(c, it.sub, this.x + this.w - 8, y, U.dim, { align: 'right' });
    });
    if (this.footer) P.txt(c, this.footer, this.x + this.w / 2, this.y + h + 6, U.dim, { align: 'center' });
  }
};
P.confirm = function (text, yes) { P.openUI(new P.ListMenu({ title: text, w: Math.max(200, P.txtW(text) + 30), x: P.W / 2 - Math.max(200, P.txtW(text) + 30) / 2, items: [{ label: 'Sí', action: m => { m.close(); yes(); } }, { label: 'No', action: m => m.close() }] })); };

P.PauseMenu = class extends P.ListMenu {
  constructor(scene) {
    super({ title: 'PAUSA', y: 60, items: [] }); this.scene = scene;
    const S = P.State;
    this.items = [
      { label: 'Continuar', action: m => m.close() },
      { label: 'Estado del agente', action: () => P.openUI(new P.StatusUI()) },
      { label: 'Misiones', action: () => P.openUI(new P.MissionsUI()) },
      { label: 'Archivo Biológico', action: () => P.openUI(new P.CodexUI()), disabled: !S.data.rooms.archivo },
      { label: 'Logros y estadísticas', action: () => P.openUI(new P.StatsUI()) },
      { label: 'Opciones', action: () => P.openUI(new P.OptionsUI()) }
    ];
    if (scene instanceof P.LevelScene && scene.sim) this.items.push({ label: 'Terminar simulación', action: () => P.goto(new P.ShipScene('entrenamiento')) });
    else if (scene instanceof P.LevelScene) this.items.push({ label: 'Abandonar el nivel', action: () => P.confirm('¿Volver al mapa? (se conserva lo obtenido)', () => { P.State.autosave(); P.goto(new P.OverworldScene(scene.planet, scene.id)); }) });
    if (scene instanceof P.OverworldScene) this.items.push({ label: 'Volver a la nave', action: () => { P.State.autosave(); P.goto(new P.ShipScene('navegacion')); } });
    this.items.push({ label: 'Menú principal', action: () => P.confirm('¿Salir al menú principal? (guardado automático)', () => { P.State.autosave(); P.goto(new P.TitleScene()); }) });
  }
};

P.DeathMenu = class extends P.ListMenu {
  constructor(L) {
    super({ title: 'UNIDAD DESACTIVADA', col: U.red, y: 100, onBack: false, items: [
      { label: 'Reiniciar desde la baliza', action: m => { m.close(); L.respawn(); } },
      { label: L.sim ? 'Terminar simulación' : 'Volver al mapa del planeta', action: () => { P.goto(L.sim ? new P.ShipScene('entrenamiento') : new P.OverworldScene(L.planet, L.id)); } },
      { label: 'Volver a la nave', action: () => { P.goto(new P.ShipScene('navegacion')); } }] });
  }
  draw(c) { c.fillStyle = 'rgba(40,0,8,0.5)'; c.fillRect(0, 0, P.W, P.H); this.dimBg = false; super.draw(c); P.txt(c, 'Tu progreso en el nivel se conserva.', P.W / 2, 86, '#ffb0b8', { align: 'center' }); }
};

// ---------- estado del agente ----------
P.StatusUI = class extends P.UIBase {
  update() { this.t++; if (P.input.pressed('back') || P.input.pressed('confirm')) { this.close(); P.Audio.sfx('back'); } }
  draw(c) {
    this.dim(c, 0.85); const S = P.State, d = S.data, st = S.stat();
    this.title(c, 'ESTADO DEL AGENTE · ' + d.name, P.D.SHIP_NAME);
    P.panel(c, 14, 30, 140, 200, { border: '#ff8a7a' });
    P.drawGlow(c, 84, 100, 40, '#ff5a5a', 0.3);
    P.spr(c, 'hero_' + d.skin, Math.floor(this.t / 30) % 2, 64, 62, { scale: 2 });
    P.txt(c, d.name, 84, 118, '#ffffff', { align: 'center' });
    P.txt(c, P.HERO_SKINS[d.skin].name, 84, 130, U.dim, { align: 'center' });
    P.txt(c, 'NIVEL ' + d.lv, 84, 150, U.gold, { align: 'center' });
    P.bar(c, 34, 162, 100, 6, d.xp / S.xpNeed(d.lv), U.cyan); P.txt(c, d.xp + ' / ' + S.xpNeed(d.lv) + ' XP', 84, 172, U.dim, { align: 'center' });
    P.txt(c, 'Puntos de habilidad: ' + d.sp, 84, 190, d.sp ? U.gold : U.dim, { align: 'center' });
    const rows = [['Salud máxima', st.maxHP], ['Multiplicador de daño', '×' + st.dmgMul.toFixed(2)], ['Cadencia', st.rateMul < 1 ? '+20 %' : 'base'], ['Crítico', Math.round(st.crit * 100) + ' %'],
      ['Barrera (DEFENSA)', st.shieldMax], ['Membrana reflectante', st.reflect ? 'sí' : 'no'], ['Carga de SUPERATAQUE', '×' + st.superGain.toFixed(1)], ['Rayo prismático', st.prism ? 'sí' : 'no'],
      ['Doble salto', st.dbl ? 'sí' : 'no'], ['Arma equipada', P.D.WEAPONS[d.weapon].name],
      ['Biomasa · Chatarra · Cristal', d.res.bio + ' · ' + d.res.scrap + ' · ' + d.res.crys], ['Tiempo de juego', P.fmtTime(d.playtime)]];
    P.panel(c, 164, 30, 302, 200);
    rows.forEach(([a, b], i) => { P.txt(c, a, 176, 42 + i * 15, U.dim); P.txt(c, String(b), 454, 42 + i * 15, '#ffffff', { align: 'right' }); });
    this.hints(c, [['back', 'Volver']]);
  }
};

P.MissionsUI = class extends P.UIBase {
  update() { this.t++; const n = Object.keys(P.State.data.missions).length || 1; this.nav(n); if (P.input.pressed('back')) { this.close(); P.Audio.sfx('back'); } }
  draw(c) {
    this.dim(c, 0.88); const S = P.State, ms = Object.entries(S.data.missions).sort((a, b) => (a[1].state === 'done') - (b[1].state === 'done'));
    this.title(c, 'REGISTRO DE MISIONES', 'Agente ' + S.name);
    // misión principal
    const cp = P.D.planet(S.currentPlanet()), B = P.D.BOSSES[cp.boss], lib = S.liberated(cp.id), boss = S.data.planets[cp.id] && S.data.planets[cp.id].boss;
    P.panel(c, 14, 28, 452, 34, { border: U.gold });
    P.txt(c, 'PRINCIPAL · Liberar ' + cp.name, 22, 34, U.gold);
    P.txt(c, boss ? B.name + ' ha caído. ' + cp.name + ' es libre. Nuevas señales en el mapa galáctico.' : lib < 10 ? 'Libera los territorios de ' + cp.name + ' (' + lib + '/10) destruyendo las extractoras.' : 'Desciende a ' + (cp.lair || 'la guarida del jefe') + ' y derrota a ' + B.name + '.', 22, 47, '#e8f4ff');
    if (!ms.length) P.txt(c, 'Sin misiones secundarias por ahora.', 22, 76, U.dim);
    ms.forEach(([id, m], i) => {
      const def = P.D.MISSIONS[id], y = 70 + i * 26, sel = i === this.sel;
      P.panel(c, 14, y, 452, 23, { border: m.state === 'done' ? '#3a6a4a' : sel ? U.cyan : '#2a3a5a', noAccent: true });
      P.txt(c, (m.state === 'done' ? '✓ ' : '') + def.name, 22, y + 4, m.state === 'done' ? '#7dffa0' : '#ffffff');
      P.txt(c, 'de ' + def.giver, 458, y + 4, U.dim, { align: 'right' });
      P.txt(c, def.desc.slice(0, 82), 22, y + 14, '#a8b4c8');
      if (def.goal > 1) P.txt(c, Math.min(m.prog, def.goal) + '/' + def.goal, 458, y + 14, U.gold, { align: 'right' });
    });
    this.hints(c, [['back', 'Volver']]);
  }
};

P.StatsUI = class extends P.UIBase {
  update() { this.t++; this.nav(P.D.ACHIEVEMENTS.length, 2); if (P.input.pressed('back')) { this.close(); P.Audio.sfx('back'); } }
  draw(c) {
    this.dim(c, 0.9); const d = P.State.data, s = d.stats;
    this.title(c, 'LOGROS Y ESTADÍSTICAS', Object.keys(d.ach).length + '/' + P.D.ACHIEVEMENTS.length);
    const rows = [['Enemigos neutralizados', s.kills], ['Criaturas cibernéticas', s.cyber], ['Desactivaciones', s.deaths], ['Disparos', s.shots], ['Daño recibido', s.dmgTaken], ['Paradas perfectas', s.parries],
      ['Secretos', s.secrets], ['Supervivientes rescatados', s.rescues], ['Territorios liberados', s.levels], ['Jefes derrotados', s.bossKills], ['Especies observadas', s.observed], ['Rescates de NOVA', s.novaSaves], ['Tiempo de juego', P.fmtTime(d.playtime)]];
    P.panel(c, 10, 28, 170, 226);
    rows.forEach(([a, b], i) => { P.txt(c, a, 18, 36 + i * 16, U.dim); P.txt(c, String(b), 172, 36 + i * 16, '#fff', { align: 'right' }); });
    P.D.ACHIEVEMENTS.forEach((a, i) => {
      const x = 188 + (i % 2) * 142, y = 28 + Math.floor(i / 2) * 28, got = d.ach[a.id], sel = i === this.sel;
      P.panel(c, x, y, 138, 25, { border: got ? U.violet : sel ? U.cyan : '#2a3a5a', noAccent: true, fill: got ? 'rgba(40,20,60,0.9)' : U.panel });
      P.spr(c, got ? 'i_trophy' : 'i_lock', 0, x + 4, y + 7);
      P.txt(c, a.name, x + 18, y + 4, got ? '#ffffff' : '#7c8aa8');
      P.txt(c, a.desc.length > 26 ? a.desc.slice(0, 25) + '…' : a.desc, x + 18, y + 14, '#8090a8');
    });
    const a = P.D.ACHIEVEMENTS[this.sel]; P.txt(c, a.desc, 470, P.H - 13, '#c8d4e8', { align: 'right' });
    this.hints(c, [['back', 'Volver']]);
  }
};

// ---------- Archivo Biológico ----------
P.CodexUI = class extends P.UIBase {
  constructor(focusId) {
    super(); this.col = 'fauna'; this.detail = null;
    // se abre en el planeta donde estás (o el último visitado)
    const S = P.State, cur = (S.data && (S.data.lastPlanet || S.currentPlanet())) || 'verzara';
    this.pi = Math.max(0, P.D.PLANETS.findIndex(p => p.id === cur && p.ready && S.revealed(p.id)));
    if (focusId) { const sp = P.D.species(focusId); if (sp) { this.col = sp.col; this.pi = P.D.PLANETS.findIndex(p => p.id === sp.planet); this.sel = Math.max(0, this.list().indexOf(sp)); } }
  }
  list() { const pl = P.D.PLANETS[this.pi].id; return P.D.SPECIES.filter(s => s.planet === pl && s.col === this.col); }
  update() {
    this.t++; const I = P.input, list = this.list();
    if (this.detail) {
      if (I.pressed('back') || I.pressed('confirm')) { this.detail = null; P.Audio.sfx('back'); }
      if (I.pressed('right') || I.pressed('left')) { const i = list.indexOf(this.detail), n = (i + (I.pressed('right') ? 1 : -1) + list.length) % list.length; if (this.known(list[n])) { this.detail = list[n]; this.sel = n; this.markRead(list[n]); P.Audio.sfx('move'); } }
      return;
    }
    if (list.length) this.nav(list.length, 5);
    if (I.pressed('swap')) { this.col = this.col === 'fauna' ? 'flora' : 'fauna'; this.sel = 0; P.Audio.sfx('select'); }
    if (I.pressed('dash')) { const rd = this.planets(); this.pi = rd[(rd.indexOf(this.pi) + 1) % rd.length]; this.sel = 0; P.Audio.sfx('select'); }
    // clic en las pestañas de planeta o de Bestiario/Herbario
    const ck = I.click; if (ck && P.frame - ck.t < 3) { I.click = null; for (const tb of this.tabs || []) if (ck.x >= tb.x && ck.x <= tb.x + tb.w && ck.y >= tb.y && ck.y <= tb.y + tb.h) { if (tb.pi != null) this.pi = tb.pi; else if (tb.step) { const rd = this.planets(); this.pi = rd[(rd.indexOf(this.pi) + tb.step + rd.length) % rd.length]; } else this.col = tb.col; this.sel = 0; P.Audio.sfx('select'); break; } }
    if (I.pressed('confirm')) { const sp = list[this.sel]; if (sp && this.known(sp)) { this.detail = sp; this.markRead(sp); P.Audio.sfx('codex'); } else P.Audio.sfx('back'); }
    if (I.pressed('back')) { this.close(); P.Audio.sfx('back'); }
  }
  planets() { const out = []; P.D.PLANETS.forEach((p, i) => { if (i === 0 || (p.ready && P.State.revealed(p.id))) out.push(i); }); return out; }
  known(sp) { const e = P.State.data.codex[sp.id]; return e && e.seen; }
  markRead(sp) { const e = P.State.data.codex[sp.id]; if (e) e.isNew = false; }
  draw(c) {
    c.fillStyle = '#04080f'; c.fillRect(0, 0, P.W, P.H);
    for (let i = 0; i < 30; i++) { c.fillStyle = 'rgba(94,232,255,0.04)'; c.fillRect(0, i * 9, P.W, 1); }
    if (this.detail) return this.drawDetail(c, this.detail);
    const S = P.State, pl = P.D.PLANETS[this.pi], list = this.list();
    this.title(c, 'ARCHIVO BIOLÓGICO DE PLENURIA', 'Conservador: ' + (S.data.npcs.mnemo ? 'Mnemo' : 'ELARA'));
    // pestañas
    ['fauna', 'flora'].forEach((k, i) => { const x = 14 + i * 90, a = this.col === k; P.panel(c, x, 26, 86, 15, { border: a ? U.green : '#2a3a5a', fill: a ? 'rgba(20,60,40,0.9)' : U.panel, noAccent: true }); P.spr(c, k === 'fauna' ? 'i_paw' : 'i_leaf', 0, x + 5, 29); P.txt(c, k === 'fauna' ? 'BESTIARIO' : 'HERBARIO', x + 18, 30, a ? '#fff' : U.dim); });
    this.tabs = [{ x: 14, y: 26, w: 86, h: 15, col: 'fauna' }, { x: 104, y: 26, w: 86, h: 15, col: 'flora' }];
    // pestañas de planeta: tira desplazable que sigue al planeta activo, con flechas cuando hay más a los lados
    {
      const rd = this.planets(), x0 = 198, x1 = P.W - 8, ws = rd.map(i => P.txtW(P.D.PLANETS[i].name) + 12), total = ws.reduce((a, b) => a + b + 4, 0) - 4;
      const over = total > x1 - x0, pad = over ? 11 : 0, vx = x0 + pad, vw = x1 - x0 - pad * 2, k0 = Math.max(0, rd.indexOf(this.pi));
      let ax = 0; for (let k = 0; k < k0; k++) ax += ws[k] + 4;
      let target = this.tabOff == null ? 0 : this.tabOff; if (ax < target) target = ax; if (ax + ws[k0] > target + vw) target = ax + ws[k0] - vw; target = P.clamp(target, 0, Math.max(0, total - vw));
      this.tabOff = this.tabOff == null ? target : this.tabOff + (target - this.tabOff) * 0.3; if (Math.abs(this.tabOff - target) < 0.5) this.tabOff = target;
      c.save(); c.beginPath(); c.rect(vx, 24, vw, 19); c.clip();
      let tx = vx - Math.round(this.tabOff);
      rd.forEach((i, k) => {
        const pl = P.D.PLANETS[i], a = i === this.pi, w = ws[k];
        if (tx + w > vx && tx < vx + vw) { P.panel(c, tx, 26, w, 15, { border: a ? pl.col[1] : '#2a3a5a', fill: a ? 'rgba(30,40,70,0.95)' : U.panel, noAccent: true }); P.txt(c, pl.name, tx + 6, 30, a ? '#fff' : U.dim); const cx0 = Math.max(tx, vx), cx1 = Math.min(tx + w, vx + vw); this.tabs.push({ x: cx0, y: 26, w: cx1 - cx0, h: 15, pi: i }); }
        tx += w + 4;
      });
      c.restore();
      if (over) for (const [d, ax2, on] of [[-1, x0, this.tabOff > 0.5], [1, x1 - 9, this.tabOff < total - vw - 0.5]]) {
        const ay = 33, blink = on && this.t % 50 < 35; c.fillStyle = on ? (blink ? '#ffffff' : U.cyan) : '#2a3a5a'; c.beginPath();
        if (d < 0) { c.moveTo(ax2 + 8, ay - 5); c.lineTo(ax2 + 8, ay + 5); c.lineTo(ax2 + 2, ay); } else { c.moveTo(ax2 + 1, ay - 5); c.lineTo(ax2 + 1, ay + 5); c.lineTo(ax2 + 7, ay); }
        c.fill(); this.tabs.push({ x: ax2 - 1, y: 24, w: 11, h: 19, step: d });
      }
    }
    // panel del planeta
    const ready = pl.ready;
    P.panel(c, 14, 46, 150, 196, { border: pl.col[1] });
    P.txt(c, pl.name, 22, 53, pl.col[1]); P.txt(c, pl.desc, 22, 64, U.dim);
    if (ready) {
      const ff = S.planetCodex(pl.id, 'fauna'), fl = S.planetCodex(pl.id, 'flora');
      P.txt(c, 'Bestiario', 22, 82, '#c8d4e8'); P.bar(c, 22, 92, 134, 5, ff, U.green); P.txt(c, Math.round(ff * 100) + ' %', 156, 82, '#fff', { align: 'right' });
      P.txt(c, 'Herbario', 22, 104, '#c8d4e8'); P.bar(c, 22, 114, 134, 5, fl, U.green); P.txt(c, Math.round(fl * 100) + ' %', 156, 104, '#fff', { align: 'right' });
      const R = P.D.CODEX_REWARDS[pl.id], cl = S.data.codexClaim;
      P.txt(c, 'RECOMPENSAS', 22, 128, U.gold);
      [['fauna', 'Bestiario 100 %'], ['flora', 'Herbario 100 %'], ['all', 'Archivo 100 %']].forEach(([k, lab], i) => {
        const got = cl[pl.id + '_' + k], y = 140 + i * 32;
        P.spr(c, got ? 'i_trophy' : 'i_lock', 0, 22, y); P.txt(c, lab, 36, y + 1, got ? U.gold : U.dim);
        P.wrap(R[k].name, 116).slice(0, 2).forEach((l, j) => P.txt(c, l, 36, y + 12 + j * 9, got ? '#fff' : '#6a7890'));
      });
    } else { P.wrap('Señal bloqueada por la Esfera de Dyson. Las especies de este mundo permanecen sin documentar.', 134).forEach((l, i) => P.txt(c, l, 22, 84 + i * 10, U.dim)); }
    // cuadrícula
    const gx = 172, gy = 46;
    list.forEach((sp, i) => {
      const x = gx + (i % 5) * 60, y = gy + Math.floor(i / 5) * 62, s = i === this.sel, e = S.data.codex[sp.id], kn = e && e.seen;
      P.panel(c, x, y, 56, 58, { border: s ? U.cyan : kn ? (P.D.RARITY_COL[sp.rarity] || '#2a3a5a') : '#1e2a40', noAccent: true, cut: 3, fill: s ? 'rgba(20,50,70,0.95)' : 'rgba(6,12,24,0.95)' });
      if (P.S[sp.spr]) P.spr(c, sp.spr, Math.floor(this.t / 20), x + 8, y + 4, { fit: 40, sil: kn ? null : '#141c2c' });
      else P.txt(c, '?', x + 28, y + 20, '#2a3a5a', { align: 'center', scale: 2 });
      if (kn && sp.variant !== 'natural') P.txt(c, sp.variant === 'cibernética' ? 'CIB' : 'MUT', x + 52, y + 4, sp.variant === 'cibernética' ? '#ff8a3a' : '#c46bff', { align: 'right' });
      const nm = kn ? sp.name : '???';
      P.txt(c, nm.length > 10 ? nm.slice(0, 9) + '…' : nm, x + 28, y + 41, kn ? '#e8f4ff' : '#4a5468', { align: 'center' });
      if (kn) P.bar(c, x + 6, y + 51, 44, 3, S.pct(sp.id), e.done ? U.gold : U.green);
      if (e && e.isNew && this.t % 40 < 26) P.txt(c, '¡NUEVO!', x + 3, y + 3, U.gold);
    });
    if (!list.length) P.txt(c, 'Sin especies registradas.', gx + 10, gy + 10, U.dim);
    const sp = list[this.sel];
    if (sp) P.txt(c, this.known(sp) ? sp.name + ' · ' + sp.rarity.toUpperCase() + (sp.restoredOnly ? ' · solo en territorio restaurado' : '') : (sp.boss ? '??? — ' + sp.title : '??? — Especie no descubierta' + (sp.restoredOnly ? ' (aparece en territorio restaurado)' : '')), 172, P.H - 26, '#c8d4e8');
    this.hints(c, [['confirm', 'Ver ficha'], ['swap', 'Bestiario/Herbario'], ['dash', 'Planeta'], ['back', 'Salir']]);
  }
  drawDetail(c, sp) {
    const S = P.State, e = S.data.codex[sp.id], pl = P.D.planet(sp.planet), rc = P.D.RARITY_COL[sp.rarity];
    this.title(c, (sp.col === 'fauna' ? 'BESTIARIO' : 'HERBARIO') + ' · ' + pl.name, pl.title);
    // holograma
    P.panel(c, 14, 28, 170, 170, { border: rc });
    const cx = 99, cy = 104;
    c.fillStyle = 'rgba(94,232,255,0.06)'; c.beginPath(); c.ellipse(cx, 178, 60, 8, 0, 0, 7); c.fill();
    P.drawGlow(c, cx, cy, 70, sp.variant === 'cibernética' ? '#ff8a3a' : '#5ee8ff', 0.25);
    const s = P.S[sp.spr], sc = Math.max(1, Math.min(4, Math.floor(130 / Math.max(s.w, s.h))));
    c.globalAlpha = 0.9 + Math.sin(this.t * 0.2) * 0.05;
    P.spr(c, sp.spr, Math.floor(this.t / 15), cx - s.w * sc / 2 + Math.sin(this.t * 0.03) * 2, 170 - s.h * sc, { scale: sc });
    c.globalAlpha = 1; P.scanlines(c, 15, 29, 168, 168, 0.18);
    c.fillStyle = 'rgba(94,232,255,0.12)'; c.fillRect(15, 29 + (this.t * 2) % 168, 168, 2);
    P.txt(c, sp.name, 99, 206, '#ffffff', { align: 'center' });
    if (sp.title) P.txt(c, sp.title, 99, 217, U.gold, { align: 'center' });
    P.txt(c, sp.sci, 99, sp.title ? 228 : 217, U.dim, { align: 'center' });
    // datos
    P.panel(c, 192, 28, 276, 222);
    let y = 34;
    P.txt(c, sp.rarity.toUpperCase(), 200, y, rc); P.txt(c, 'Variante: ' + sp.variant + (sp.base ? ' (de ' + P.D.species(sp.base).name + ')' : ''), 460, y, sp.variant === 'natural' ? '#9cff6a' : '#ff8a3a', { align: 'right' }); y += 13;
    const pct = S.pct(sp.id), tasksDone = (i) => { const t = sp.tasks[i], need = typeof t === 'string' ? 1 : (t.n || 1); return e.prog[i] >= need; };
    const field = (lab, val, unlocked) => { P.txt(c, lab, 200, y, U.cyan); y += 10; P.wrap(unlocked ? val : '— datos insuficientes —', 256).slice(0, 3).forEach(l => { P.txt(c, l, 206, y, unlocked ? '#d8e4f4' : '#4a5468'); y += 9; }); y += 3; };
    const lvl1 = pct > 0.3, lvl2 = pct >= 0.99;
    field('Hábitat', sp.habitat, true);
    field('Comportamiento', sp.behavior, lvl1);
    field('Alimentación', sp.diet, lvl1);
    field('Habilidades', sp.abilities, lvl1);
    P.txt(c, 'Peligrosidad', 200, y, U.cyan); for (let i = 0; i < 5; i++) P.spr(c, i < sp.danger ? 'i_skull' : 'i_lock', 0, 270 + i * 12, y - 2); y += 13;
    field('Rol en el ecosistema', sp.eco, lvl1);
    field('Notas del Archivo', sp.lore, lvl2);
    // tareas de investigación
    P.txt(c, 'INVESTIGACIÓN ' + Math.round(pct * 100) + ' %', 99, 240, U.gold, { align: 'center' }); P.bar(c, 34, 251, 130, 4, pct, pct >= 1 ? U.gold : U.green);
    const tn = { seen: 'Avistamiento', defeat: 'Neutralizar', observe: 'Observar en libertad', scan: 'Escanear', restored: 'Ver en territorio restaurado' };
    let tx = 200, ty = Math.max(y + 2, 226);
    sp.tasks.forEach((t, i) => {
      const k = typeof t === 'string' ? t : t.k, need = typeof t === 'string' ? 1 : (t.n || 1), lab = tn[k] + (need > 1 ? (k === 'observe' ? ' ' + need + ' s' : ' ×' + need) : '');
      const w = P.txtW('· ' + lab) + 10; if (tx + w > 466) { tx = 200; ty += 10; }
      const ok = tasksDone(i); P.txt(c, (ok ? '✓ ' : '· ') + lab, tx, ty, ok ? '#7dffa0' : '#8090a8'); tx += w;
    });
    this.hints(c, [['left', 'Anterior/siguiente'], ['back', 'Volver']]);
  }
};

// ---------- árbol de habilidades ----------
P.SkillUI = class extends P.UIBase {
  update() {
    this.t++; this.nav(15, 3);
    if (P.input.pressed('confirm')) {
      const sk = this.order()[this.sel], S = P.State, d = S.data;
      if (d.skills[sk.id]) { P.Audio.sfx('back'); return; }
      if (d.sp <= 0 || !sk.req.every(r => d.skills[r])) { P.Audio.sfx('back'); P.toast(d.sp <= 0 ? 'Sin puntos de habilidad' : 'Requiere la habilidad anterior', { col: U.red, life: 80 }); return; }
      d.sp--; d.skills[sk.id] = true; P.Audio.sfx('unlock'); P.toast('Modificación instalada: ' + sk.name, { col: U.gold, icon: 'i_star' });
    }
    if (P.input.pressed('back')) { this.close(); P.Audio.sfx('back'); }
  }
  order() { const out = []; for (let r = 0; r < 5; r++) for (let b = 0; b < 3; b++) out.push(P.D.SKILLS.filter(s => s.br === b)[r]); return out; }
  draw(c) {
    c.fillStyle = '#06060e'; c.fillRect(0, 0, P.W, P.H);
    const d = P.State.data, ord = this.order();
    this.title(c, 'LABORATORIO DE MODIFICACIONES CYBORG', 'Puntos: ' + d.sp, U.gold);
    const cols = ['#ff6a5a', '#5ee8ff', '#ffd166'];
    P.D.SKILL_BRANCHES.forEach((b, i) => { const x = 40 + i * 140; P.txt(c, b, x + 50, 32, cols[i], { align: 'center' }); });
    ord.forEach((sk, i) => {
      const b = sk.br, r = Math.floor(i / 3), x = 40 + b * 140, y = 46 + r * 34, own = d.skills[sk.id], can = sk.req.every(q => d.skills[q]), s = i === this.sel;
      if (r > 0) { c.fillStyle = own ? cols[b] : '#2a3a5a'; c.fillRect(x + 50, y - 8, 1, 8); }
      P.panel(c, x, y, 100, 24, { border: s ? '#ffffff' : own ? cols[b] : can ? '#4a5a7a' : '#1e2a40', fill: own ? P.Col.rgba(cols[b], 0.22) : U.panel, noAccent: true, cut: 3 });
      P.txt(c, sk.name, x + 50, y + 8, own ? '#ffffff' : can ? '#c8d4e8' : '#4a5468', { align: 'center' });
      if (own) P.txt(c, '✓', x + 92, y + 3, cols[b]);
    });
    const sk = ord[this.sel];
    P.panel(c, 14, 220, 452, 30); P.txt(c, sk.name, 22, 226, cols[sk.br]); P.txt(c, sk.desc, 22, 238, '#e8f4ff');
    if (sk.req.length) P.txt(c, 'Requiere: ' + sk.req.map(r => P.D.SKILLS.find(s => s.id === r).name).join(', '), 458, 226, U.dim, { align: 'right' });
    this.hints(c, [['confirm', 'Instalar (1 punto)'], ['back', 'Salir']]);
  }
};

// ---------- arsenal ----------
P.ArsenalUI = class extends P.UIBase {
  rows() {
    const d = P.State.data, out = [];
    out.push({ h: 'ARMAS' });
    for (const w in P.D.WEAPONS) out.push({ k: 'w', id: w, own: d.weapons.includes(w) });
    for (let i = 1; i < 9; i++) if (!Object.values(P.D.WEAPONS).some(w => w.planet === P.D.PLANETS[i].id)) out.push({ k: 'lock', label: 'Arma de ' + (P.State.revealed(P.D.PLANETS[i].id) ? P.D.PLANETS[i].name : '???') });
    out.push({ h: 'ARMADURAS' });
    for (const s in P.HERO_SKINS) out.push({ k: 's', id: s, own: d.skins.includes(s) });
    out.push({ h: 'MEJORAS PLANETARIAS' });
    for (const u in P.D.UPGRADES) out.push({ k: 'u', id: u, own: !!d.ups[u] });
    out.push({ h: 'MODS DEL ARCHIVO' });
    for (const pid in P.D.CODEX_REWARDS) for (const col of ['fauna', 'flora']) { const R = P.D.CODEX_REWARDS[pid][col]; out.push({ k: 'm', id: R.mod, own: !!d.mods[R.mod], name: R.name, desc: R.desc, planet: pid }); }
    return out;
  }
  update() {
    this.t++; const rows = this.rows().filter(r => !r.h); this.nav(rows.length);
    if (P.input.pressed('confirm')) {
      const r = rows[this.sel], d = P.State.data;
      if (r.k === 'w' && r.own) { d.weapon = r.id; P.Audio.sfx('select'); }
      else if (r.k === 's' && r.own) { d.skin = r.id; P.Audio.sfx('select'); }
      else P.Audio.sfx('back');
    }
    if (P.input.pressed('back')) { this.close(); P.Audio.sfx('back'); }
  }
  draw(c) {
    c.fillStyle = '#080608'; c.fillRect(0, 0, P.W, P.H);
    const d = P.State.data, all = this.rows();
    this.title(c, 'ARSENAL', 'Equipo del agente ' + d.name, '#ff8a7a');
    let i = 0, y = 30 - Math.max(0, this.sel - 13) * 12;
    let selRow = null;
    c.save(); c.beginPath(); c.rect(0, 26, 260, 222); c.clip();
    for (const r of all) {
      if (r.h) { P.txt(c, r.h, 18, y + 2, U.gold); y += 13; continue; }
      const s = i === this.sel; if (s) selRow = r;
      let name, col = '#c8d4e8', tag = '';
      if (r.k === 'w') { name = r.own ? P.D.WEAPONS[r.id].name : '???'; tag = d.weapon === r.id ? 'EQUIPADA' : ''; }
      else if (r.k === 's') { name = r.own ? P.HERO_SKINS[r.id].name : '??? (sin descubrir)'; tag = d.skin === r.id ? 'EN USO' : ''; }
      else if (r.k === 'u') { name = r.own ? P.D.UPGRADES[r.id].name : '??? · ' + P.D.UPGRADES[r.id].kind; tag = r.own ? P.D.UPGRADES[r.id].kind : ''; }
      else if (r.k === 'm') { name = r.own ? r.name : '??? (completa el Archivo)'; }
      else { name = r.label + ' · bloqueada'; col = '#3a4458'; }
      if (r.k !== 'lock' && !r.own) col = '#5a6478';
      if (s) { c.fillStyle = 'rgba(255,138,122,0.15)'; c.fillRect(14, y - 2, 240, 12); }
      P.txt(c, (s ? '▶ ' : '  ') + name, 18, y, s ? '#fff' : col); if (tag) P.txt(c, tag, 250, y, U.green, { align: 'right' });
      y += 12; i++;
    }
    c.restore();
    P.panel(c, 266, 28, 202, 222, { border: '#ff8a7a' });
    const r = selRow;
    if (r && r.k === 's') { P.drawGlow(c, 366, 110, 40, '#ff5a5a', 0.3); P.spr(c, 'hero_' + (r.own ? r.id : 'rojo'), Math.floor(this.t / 30) % 2, 346, 70, { scale: 2, sil: r.own ? null : '#1a1a24' }); P.txt(c, r.own ? 'Pulsa para vestir esta armadura.' : 'Se obtiene al derrotar jefes.', 366, 130, U.dim, { align: 'center' }); }
    else if (r && r.k === 'w') { const W = P.D.WEAPONS[r.id]; P.spr(c, W.icon, 0, 350, 46, { scale: 3 }); P.txt(c, W.name, 366, 86, '#fff', { align: 'center' }); P.wrap(W.desc, 186).forEach((l, j) => P.txt(c, l, 274, 102 + j * 10, '#c8d4e8')); P.txt(c, 'Daño base ' + W.dmg + ' · Cadencia ' + (60 / W.rate).toFixed(1) + '/s', 274, 160, U.gold); P.txt(c, 'Cambia en combate con ' + P.input.label('swap'), 274, 174, U.dim); }
    else if (r && r.k === 'u') { const u = P.D.UPGRADES[r.id]; P.spr(c, u.icon, 0, 350, 46, { scale: 3, sil: r.own ? null : '#1a1a24' }); P.txt(c, r.own ? u.name : '???', 366, 86, '#fff', { align: 'center' }); P.txt(c, u.kind + ' · ' + (P.State.revealed(u.planet) ? P.D.planet(u.planet).name : '???'), 366, 98, U.cyan, { align: 'center' }); if (r.own) P.wrap(u.desc, 186).forEach((l, j) => P.txt(c, l, 274, 114 + j * 10, '#c8d4e8')); }
    else if (r && r.k === 'm') { P.txt(c, r.own ? r.name : '???', 366, 60, '#fff', { align: 'center' }); P.wrap(r.own ? r.desc : 'Recompensa del Archivo Biológico de ' + (P.State.revealed(r.planet) ? P.D.planet(r.planet).name : 'un mundo aún desconocido') + '.', 186).forEach((l, j) => P.txt(c, l, 274, 80 + j * 10, '#c8d4e8')); }
    else if (r) P.wrap('Cada planeta proporciona su propio armamento característico. Libera ' + r.label.replace('Arma de ', '') + ' para descubrirlo.', 186).forEach((l, j) => P.txt(c, l, 274, 60 + j * 10, U.dim));
    this.hints(c, [['confirm', 'Equipar'], ['back', 'Salir']]);
  }
};

// ---------- taller ----------
P.WorkshopUI = class extends P.UIBase {
  list() { const d = P.State.data; return P.D.RECIPES.filter(r => (!r.room || !d.rooms[r.room] || d.crafted[r.id])); }
  update() {
    this.t++; const L = this.list(); this.nav(L.length);
    if (P.input.pressed('confirm')) {
      const r = L[this.sel], S = P.State, d = S.data;
      const why = this.blocked(r);
      if (why) { P.Audio.sfx('back'); P.toast(why, { col: U.red, life: 90 }); return; }
      S.pay(r.cost); d.crafted[r.id] = true; d.stats.crafted++; if (d.stats.crafted >= 5) S.ach('artesano');
      if (r.room) S.unlockRoom(r.room); else { P.Audio.sfx('levelup'); P.toast('Fabricado: ' + r.name, { col: U.gold, icon: 'i_star' }); }
    }
    if (P.input.pressed('back')) { this.close(); P.Audio.sfx('back'); }
  }
  blocked(r) {
    const S = P.State, d = S.data;
    if (d.crafted[r.id]) return 'Ya fabricado';
    if (r.req.some(q => !d.crafted[q])) return 'Requiere ' + P.D.RECIPES.find(x => x.id === r.req[0]).name;
    if (r.needNpc && !d.npcs[r.needNpc]) return 'Requiere a Kaïro-Vel a bordo';
    if (r.needUp && !d.ups[r.needUp]) return 'Requiere el Lanzaespinas';
    if (!S.canPay(r.cost)) return 'Recursos insuficientes';
    return null;
  }
  draw(c) {
    c.fillStyle = '#0a0806'; c.fillRect(0, 0, P.W, P.H);
    const d = P.State.data, L = this.list();
    this.title(c, 'TALLER DE REPARACIONES', d.npcs.kairo ? 'Ingeniero: Kaïro-Vel' : 'Drones de mantenimiento de ELARA', U.gold);
    let x = 300; for (const k of ['bio', 'scrap', 'crys']) { P.spr(c, 'i_' + k, 0, x, 26); P.txt(c, String(d.res[k]), x + 13, 27, '#fff'); x += 55; }
    L.forEach((r, i) => {
      const y = 42 + i * 19, s = i === this.sel, done = d.crafted[r.id], bl = this.blocked(r);
      P.panel(c, 14, y, 452, 17, { border: s ? U.gold : done ? '#3a6a4a' : '#2a3a5a', noAccent: true, cut: 2 });
      P.txt(c, (done ? '✓ ' : '') + r.name, 22, y + 5, done ? '#7dffa0' : bl ? '#8090a8' : '#ffffff');
      let cx = 458; for (const k of ['crys', 'scrap', 'bio']) if (r.cost[k]) { const ok = d.res[k] >= r.cost[k]; cx -= P.txtW(String(r.cost[k])) + 2; P.txt(c, String(r.cost[k]), cx, y + 5, ok ? '#fff' : U.red); cx -= 13; P.spr(c, 'i_' + k, 0, cx, y + 4); cx -= 6; }
    });
    const r = L[this.sel]; if (r) { P.panel(c, 14, 226, 452, 24); P.txt(c, r.desc, 22, 234, '#e8f4ff'); const b = this.blocked(r); if (b) P.txt(c, b, 458, 234, b === 'Ya fabricado' ? U.green : U.red, { align: 'right' }); }
    this.hints(c, [['confirm', 'Fabricar'], ['back', 'Salir']]);
  }
};

// ---------- compañeros ----------
P.CompanionUI = class extends P.UIBase {
  update() {
    this.t++; this.nav(4, 2);
    if (P.input.pressed('confirm')) {
      const cp = P.D.COMPANIONS[this.sel], S = P.State;
      if (!S.compUnlocked(cp.id)) { P.Audio.sfx('back'); P.toast('Bloqueado: ' + (S.revealed(cp.planet) ? cp.mission : 'señal en un mundo aún desconocido'), { col: U.red, life: 120 }); return; }
      const eq = S.data.comps.equipped;
      if (!eq.includes(cp.id) && eq.length >= 2) { P.Audio.sfx('back'); P.toast('Máximo DOS personajes de apoyo', { col: U.red }); return; }
      S.toggleComp(cp.id); P.Audio.sfx('select');
    }
    if (P.input.pressed('back')) { this.close(); P.Audio.sfx('back'); }
  }
  draw(c) {
    c.fillStyle = '#060a10'; c.fillRect(0, 0, P.W, P.H);
    const S = P.State, eq = S.data.comps.equipped;
    this.title(c, 'BAHÍA DE APOYO · SELECCIÓN DE COMPAÑEROS', 'Espacios: ' + eq.length + '/2');
    P.txt(c, 'El agente ' + S.name + ' siempre está presente y no ocupa espacio.', 14, 26, U.dim);
    P.D.COMPANIONS.forEach((cp, i) => {
      const x = 14 + (i % 2) * 228, y = 38 + Math.floor(i / 2) * 104, s = i === this.sel, un = S.compUnlocked(cp.id), on = eq.includes(cp.id);
      P.panel(c, x, y, 224, 100, { border: s ? '#ffffff' : on ? U.green : un ? U.cyan : '#2a3a5a', fill: on ? 'rgba(14,40,28,0.95)' : U.panel });
      c.fillStyle = 'rgba(255,255,255,0.05)'; c.fillRect(x + 6, y + 6, 64, 64);
      P.spr(c, cp.por, 0, x + 6, y + 6, { scale: 2, sil: un ? null : '#0e1420' });
      if (!un) P.txt(c, '?', x + 38, y + 30, '#3a4a6a', { align: 'center', scale: 2 });
      P.txt(c, un ? cp.name : '???', x + 78, y + 8, un ? '#fff' : '#5a6478');
      P.txt(c, cp.role.toUpperCase(), x + 78, y + 19, un ? U.gold : '#4a5468');
      P.txt(c, on ? 'EQUIPADO' : un ? 'DISPONIBLE' : 'BLOQUEADO', x + 218, y + 8, on ? U.green : un ? U.cyan : U.red, { align: 'right' });
      P.wrap(un ? cp.desc : P.State.revealed(cp.planet) ? cp.hint : 'Una señal débil llega desde un mundo que todavía no has descubierto.', 140).slice(0, 5).forEach((l, j) => P.txt(c, l, x + 78, y + 32 + j * 9, un ? '#c8d4e8' : '#6a7890'));
      P.txt(c, (un ? 'Origen: ' : 'Misión: ') + (un || P.State.revealed(cp.planet) ? cp.mission : '???'), x + 6, y + 88, U.dim);
    });
    this.hints(c, [['confirm', 'Equipar / retirar'], ['back', 'Salir']]);
    if (P.settings.dev) P.txt(c, 'Modo desarrollador: compañeros desbloqueados para pruebas', P.W - 12, P.H - 13, U.pink, { align: 'right' });
  }
};

// ---------- comunicaciones ----------
P.CommsUI = class extends P.UIBase {
  items() { const d = P.State.data, out = []; for (const m of d.msgs) out.push({ t: 'msg', m }); for (const id in P.D.HOLOS) out.push({ t: 'holo', id, got: d.holos[id] }); for (const id in P.D.MEMORIES) out.push({ t: 'mem', id, got: d.mems[id] }); return out; }
  update() {
    this.t++; const it = this.items(); this.nav(it.length);
    if (P.input.pressed('confirm')) { const x = it[this.sel]; if (x.t !== 'msg' && x.got) P.openUI(new P.LoreView(x.t === 'holo' ? P.D.HOLOS[x.id] : P.D.MEMORIES[x.id], x.t)); else if (x.t === 'msg') P.openUI(new P.Dialog([[x.m.from, x.m.text]])); }
    if (P.input.pressed('back')) { this.close(); P.Audio.sfx('back'); }
  }
  draw(c) {
    c.fillStyle = '#050a10'; c.fillRect(0, 0, P.W, P.H);
    this.title(c, 'CENTRO DE COMUNICACIONES', 'Transmisiones y archivos');
    const it = this.items(), off = Math.max(0, this.sel - 15);
    it.slice(off, off + 17).forEach((x, j) => {
      const i = j + off, y = 30 + j * 13, s = i === this.sel;
      if (s) { c.fillStyle = 'rgba(94,232,255,0.15)'; c.fillRect(12, y - 2, 456, 12); }
      if (x.t === 'msg') { const sp = P.speaker(x.m.from); P.txt(c, '◆ ' + sp.name + ': ' + x.m.text.slice(0, 60) + (x.m.text.length > 60 ? '…' : ''), 16, y, sp.col); }
      else { const d = x.t === 'holo' ? P.D.HOLOS[x.id] : P.D.MEMORIES[x.id]; P.spr(c, x.t === 'holo' ? 'i_holo' : 'i_mem', 0, 16, y - 1, { sil: x.got ? null : '#2a3a5a' }); P.txt(c, x.got ? d.title : '??? — ' + (x.t === 'holo' ? 'registro no recuperado' : 'fragmento perdido'), 30, y, x.got ? '#e8f4ff' : '#4a5468'); }
    });
    this.hints(c, [['confirm', 'Reproducir'], ['back', 'Salir']]);
  }
};

// ---------- mapa galáctico ----------
P.GalaxyMap = class extends P.UIBase {
  constructor(onTravel) {
    super(); this.onTravel = onTravel; P.Audio.music('galaxy');
    // empieza seleccionado el planeta donde está la nave (o la Esfera)
    const cur = P.State.data && P.State.data.lastPlanet, i = P.D.PLANETS.findIndex(p => p.id === cur);
    this.sel = cur === 'dyson' ? 9 : Math.max(0, i);
  }
  update() {
    this.t++; const I = P.input;
    if (I.pressed('right') || I.pressed('down')) { this.sel = (this.sel + 1) % 10; P.Audio.sfx('move'); }
    if (I.pressed('left') || I.pressed('up')) { this.sel = (this.sel + 9) % 10; P.Audio.sfx('move'); }
    if (I.pressed('confirm')) {
      if (this.sel < 9 && P.D.PLANETS[this.sel].ready && P.State.planetUnlocked(P.D.PLANETS[this.sel].id)) { P.Audio.sfx('door'); this.close(); this.onTravel(P.D.PLANETS[this.sel].id); }
      else if (this.sel === 9 && P.D.DYSON && P.D.DYSON.unlocked()) { P.Audio.sfx('door'); this.close(); this.onTravel('dyson'); }
      else P.Audio.sfx('back');
    }
    if (I.pressed('back')) { this.close(); P.Audio.sfx('back'); P.Audio.music('ship'); }
  }
  ppos(i) { const p = P.D.PLANETS[i], a = this.t * 0.0015 * (240 / p.orbit) + i * 2.4; return { x: 150 + Math.cos(a) * p.orbit * 0.55, y: 138 + Math.sin(a) * p.orbit * 0.38, p }; }
  draw(c) {
    const pano = P.Space.panorama(), po = -((this.t * 0.1) % pano.width); c.drawImage(pano, Math.round(po), 0); c.drawImage(pano, Math.round(po + pano.width), 0);
    c.fillStyle = 'rgba(2,3,10,0.25)'; c.fillRect(0, 0, P.W, P.H);
    const S = P.State;
    // órbitas
    for (let i = 0; i < 9; i++) { const p = P.D.PLANETS[i]; c.strokeStyle = i === this.sel ? 'rgba(255,255,255,0.35)' : 'rgba(140,200,255,0.14)'; c.setLineDash(i === this.sel ? [] : [2, 3]); c.beginPath(); c.ellipse(150, 138, p.orbit * 0.55, p.orbit * 0.38, 0, 0, 7); c.stroke(); }
    c.setLineDash([]);
    // estrella Plenuria y Esfera de Dyson
    const dy = P.Space.dyson(14); c.drawImage(dy, Math.round(150 - dy.width / 2), Math.round(138 - dy.height / 2));
    if (this.sel === 9) { c.strokeStyle = '#ff5a6a'; c.lineWidth = 1; c.beginPath(); c.arc(150, 138, 20 + Math.sin(this.t * 0.1) * 2, 0, 7); c.stroke(); }
    // planetas (ordenados por profundidad)
    const list = []; for (let i = 0; i < 9; i++) list.push(Object.assign({ i }, this.ppos(i)));
    list.sort((a2, b2) => a2.y - b2.y);
    for (const { x, y, p, i } of list) {
      const s2 = i === this.sel, R = Math.round(p.size * 0.75) + (s2 ? 2 : 0), lib = p.ready ? S.liberated(p.id) / 10 : 0;
      P.Space.drawPlanet(c, p.id, x, y, R, lib);
      const rv = S.revealed(p.id);
      if (!p.ready || !rv) { c.fillStyle = rv ? 'rgba(4,4,12,0.5)' : 'rgba(4,4,12,0.88)'; c.beginPath(); c.arc(x, y, R + 1, 0, 7); c.fill(); }
      if (!rv) { c.strokeStyle = 'rgba(140,200,255,0.25)'; c.beginPath(); c.arc(x, y, R + 1, 0, 7); c.stroke(); if (s2) P.txt(c, '?', x - 2, y - 3, '#8aa0c8'); }
      if (p.ready && S.data.planets[p.id] && S.data.planets[p.id].boss) { c.strokeStyle = '#7dffa0'; c.beginPath(); c.arc(x, y, R + 4, 0, 7); c.stroke(); }
      if (s2) { const k = 4 + Math.sin(this.t * 0.15) * 1.5; c.strokeStyle = '#ffffff'; for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const cx2 = x + sx * (R + k), cy2 = y + sy * (R + k); c.beginPath(); c.moveTo(cx2, cy2 - sy * 4); c.lineTo(cx2, cy2); c.lineTo(cx2 - sx * 4, cy2); c.stroke(); } }
      if (p.id === (S.data.lastPlanet || 'verzara')) P.spr(c, 'o_ship', Math.floor(this.t / 8) % 2, x + R - 2, y - R - 16, { fit: 26 });
      if (s2 || (p.ready && rv)) P.txt(c, rv ? p.name : '???', x, y + R + 5, s2 ? '#fff' : '#c8d4e8', { align: 'center', outline: true, shadow: '#04060e' });
    }
    P.txt(c, 'SISTEMA SOLAR DE PLENURIA', 14, 10, U.cyan); P.txt(c, 'Sala de navegación galáctica', 14, 21, U.dim);
    // panel de información
    P.panel(c, 300, 30, 170, 210);
    if (this.sel === 9) {
      P.txt(c, 'ESFERA DE DYSON', 385, 40, '#ff5a6a', { align: 'center' }); P.txt(c, 'Corazón del régimen', 385, 52, U.dim, { align: 'center' });
      P.wrap('Megaestructura construida por los Esqueléticos alrededor de la estrella Plenuria. El Dominio Exterior (NÉMESIS), el Corazón Tecnológico con el Área de Investigación (THERSEK) y el Imperio Esquelético con el Área Burguesa (GERSELLE). En el centro, el Palacio Presidencial de MEREK.', 150).forEach((l, i) => P.txt(c, l, 310, 70 + i * 10, '#c8d4e8'));
      if (P.D.DYSON && P.D.DYSON.unlocked()) P.txt(c, 'Pulsa para lanzar el asalto', 385, 214, '#ffd166', { align: 'center' }); else P.txt(c, 'Requiere liberar los 9 planetas', 385, 214, U.red, { align: 'center' });
    } else {
      const p = P.D.PLANETS[this.sel], st = S.data.planets[p.id], lib = p.ready ? S.liberated(p.id) : 0;
      if (!S.revealed(p.id)) {
        c.fillStyle = '#0a0e1c'; c.beginPath(); c.arc(322, 52, 14, 0, 7); c.fill(); c.strokeStyle = 'rgba(140,200,255,0.3)'; c.stroke(); P.txt(c, '?', 320, 49, '#8aa0c8');
        P.txt(c, '???', 392, 40, '#8aa0c8', { align: 'center' }); P.txt(c, 'Señal desconocida', 385, 52, U.dim, { align: 'center' });
        P.wrap('Un mundo oculto tras la flota Esquelética. Sus datos se revelarán al liberar ' + (this.sel > 0 && S.revealed(P.D.PLANETS[this.sel - 1].id) ? P.D.PLANETS[this.sel - 1].name : 'el mundo anterior') + '.', 150).forEach((l, i) => P.txt(c, l, 310, 82 + i * 10, '#a8b8cc'));
        P.txt(c, 'Ruta bloqueada', 385, 214, U.red, { align: 'center' });
        this.hints(c, [['left', 'Seleccionar'], ['confirm', 'Viajar'], ['back', 'Salir']]); return;
      }
      P.Space.drawPlanet(c, p.id, 322, 52, 14, lib / 10);
      P.txt(c, p.name, 392, 40, p.col[1], { align: 'center' }); P.txt(c, p.desc, 385, 52, U.dim, { align: 'center' }); P.txt(c, '«' + p.title + '»', 385, 64, '#e8f4ff', { align: 'center' });
      P.wrap(p.info, 150).forEach((l, i) => P.txt(c, l, 310, 82 + i * 10, '#a8b8cc'));
      P.txt(c, 'Civilización: ' + P.CIV[p.civ].name, 310, 150, U.cyan);
      const b = P.D.BOSSES[p.boss], bseen = S.data.codex[p.boss] && S.data.codex[p.boss].seen;
      P.txt(c, 'Jefe: ' + (bseen ? b.name : '???'), 310, 162, '#ff8ad8');
      if (p.ready && !S.planetUnlocked(p.id)) P.wrap('Ruta bloqueada por la flota Esquelética. Libera ' + P.D.PLANETS[this.sel - 1].name + ' para fijar el rumbo.', 150).forEach((l, i) => P.txt(c, l, 310, 184 + i * 10, U.red));
      else if (p.ready) { P.txt(c, 'Territorios liberados: ' + lib + '/10', 310, 178, '#7dffa0'); P.bar(c, 310, 190, 150, 5, lib / 10, U.green); P.txt(c, st && st.boss ? 'PLANETA LIBERADO' : 'Pulsa para descender', 385, 214, st && st.boss ? U.gold : U.cyan, { align: 'center' }); }
      else if (S.planetUnlocked(p.id)) P.wrap('Señal detectada. Expedición en preparación: el contenido de este mundo llegará en una próxima fase.', 150).forEach((l, i) => P.txt(c, l, 310, 184 + i * 10, U.gold));
      else P.txt(c, 'Señal bloqueada por la Esfera', 385, 214, U.red, { align: 'center' });
    }
    this.hints(c, [['left', 'Seleccionar'], ['confirm', 'Viajar'], ['back', 'Salir']]);
  }
};

// ---------- guardar / cargar ----------
P.SaveUI = class extends P.UIBase {
  constructor(mode, onLoad) { super(); this.mode = mode; this.onLoad = onLoad; this.slots = mode === 'load' ? ['auto', '1', '2', '3'] : ['1', '2', '3']; }
  update() {
    this.t++; this.nav(this.slots.length);
    if (P.input.pressed('confirm')) {
      const sl = this.slots[this.sel];
      if (this.mode === 'save') { const go = () => { P.State.save(sl); P.Audio.sfx('unlock'); P.toast('Partida guardada en la ranura ' + sl, { col: U.green }); }; if (P.State.peek(sl)) P.confirm('¿Sobrescribir la ranura ' + sl + '?', go); else go(); }
      else { if (P.State.load(sl)) { P.Audio.sfx('unlock'); this.close(); this.onLoad(); } else P.Audio.sfx('back'); }
    }
    if (P.input.pressed('back')) { this.close(); P.Audio.sfx('back'); }
  }
  draw(c) {
    this.dim(c, 0.85);
    this.title(c, this.mode === 'save' ? 'GUARDAR PARTIDA' : 'CARGAR PARTIDA', '');
    this.slots.forEach((sl, i) => {
      const d = P.State.peek(sl), y = 40 + i * 50, s = i === this.sel;
      P.panel(c, 60, y, 360, 44, { border: s ? U.cyan : '#2a3a5a' });
      P.txt(c, sl === 'auto' ? 'AUTOGUARDADO' : 'RANURA ' + sl, 70, y + 6, s ? U.cyan : U.dim);
      if (!d) { P.txt(c, '— vacía —', 70, y + 22, '#4a5468'); return; }
      P.spr(c, 'heropor_' + (d.skin || 'rojo'), 0, 380, y + 6);
      P.txt(c, d.name + ' · Nivel ' + d.lv, 70, y + 19, '#ffffff');
      let lib = 0, bosses = 0; for (const pid in d.planets) { const pl = d.planets[pid]; for (const k in pl.levels || {}) if (pl.levels[k].done) lib++; if (pl.boss) bosses++; }
      P.txt(c, 'Territorios ' + lib + ' · Planetas libres ' + bosses + ' · ' + P.fmtTime(d.playtime) + ' · ' + new Date(d.saved || d.created).toLocaleString('es'), 70, y + 30, '#a8b4c8');
    });
    this.hints(c, [['confirm', this.mode === 'save' ? 'Guardar' : 'Cargar'], ['back', 'Volver']]);
  }
};

// ---------- nombre ----------
P.NameEntry = class extends P.UIBase {
  constructor(initial, cb, cancelable) { super(); this.cb = cb; this.cancelable = cancelable; this.field = { value: initial || '', max: 14, done: false, cancel: false }; P.input.startText(this.field); }
  update() {
    this.t++; const f = this.field;
    if (f.done) { P.input.endText(); const v = f.value.trim() || P.D.DEFAULT_NAME; this.close(); P.Audio.sfx('unlock'); this.cb(v); }
    else if (f.cancel) { if (this.cancelable) { P.input.endText(); this.close(); } else f.cancel = false; }
  }
  draw(c) {
    this.dim(c, 0.7);
    const w = 360, x = (P.W - w) / 2, y = 90;
    P.panel(c, x, y, w, 90);
    P.txt(c, 'DESIGNACIÓN DEL AGENTE', P.W / 2, y + 10, U.cyan, { align: 'center' });
    P.txt(c, 'Escribe el nombre que quieras. Podrás cambiarlo en el Camarote.', P.W / 2, y + 24, U.dim, { align: 'center' });
    c.fillStyle = 'rgba(94,232,255,0.1)'; c.fillRect(x + 40, y + 40, w - 80, 20); c.fillStyle = U.cyan; c.fillRect(x + 40, y + 59, w - 80, 1);
    const v = this.field.value; P.txt(c, v, P.W / 2, y + 44, '#ffffff', { align: 'center', scale: 1 });
    if (this.t % 40 < 22) { c.fillStyle = '#ffffff'; c.fillRect(P.W / 2 + P.txtW(v) / 2 + 2, y + 43, 5, 9); }
    P.txt(c, 'ENTER confirmar · RETROCESO borrar' + (this.cancelable ? ' · ESC cancelar' : ''), P.W / 2, y + 72, U.dim, { align: 'center' });
  }
};

// ---------- opciones ----------
P.OptionsUI = class extends P.UIBase {
  items() {
    const s = P.settings;
    return [
      ...(P.State.data ? [{ l: 'Dificultad de la partida', v: P.DIFF.get().name, adj: d => { const o = P.DIFF_ORDER; P.State.data.diff = o[(o.indexOf(P.DIFF.id()) + (d || 1) + 4) % 4]; } }] : []),
      { l: 'Volumen de música', v: Math.round(s.music * 10) + '/10', adj: d => { s.music = P.clamp(s.music + d * 0.1, 0, 1); P.Audio.applyVolume(); } },
      { l: 'Volumen de efectos', v: Math.round(s.sfx * 10) + '/10', adj: d => { s.sfx = P.clamp(s.sfx + d * 0.1, 0, 1); P.Audio.applyVolume(); P.Audio.sfx('select'); } },
      { l: 'Vibración de pantalla', v: s.shake ? 'Sí' : 'No', adj: () => { s.shake = !s.shake; } },
      { l: 'Calidad gráfica', v: ['Baja', 'Media', 'Alta'][s.gfx == null ? 2 : s.gfx], adj: d => { s.gfx = ((s.gfx == null ? 2 : s.gfx) + (d || 1) + 3) % 3; } },
      { l: 'Escala de pantalla', v: s.scale ? s.scale + 'x' : 'Auto', adj: d => { s.scale = (s.scale + d + 6) % 6; P.resize(); } },
      { l: 'Configurar controles', v: '▶', act: () => P.openUI(new P.KeysUI()) },
      { l: 'Modo desarrollador (F9)', v: s.dev ? 'Sí' : 'No', adj: () => { s.dev = !s.dev; } }
    ];
  }
  update() {
    this.t++; const it = this.items(); this.nav(it.length);
    const I = P.input, x = it[this.sel];
    if (x.adj && (I.pressed('left') || I.pressed('right'))) { x.adj(I.pressed('right') ? 1 : -1); P.Audio.sfx('move'); }
    if (I.pressed('confirm')) { if (x.act) x.act(); else if (x.adj) x.adj(1); P.Audio.sfx('select'); }
    if (I.pressed('back')) { P.saveSettings(); this.close(); P.Audio.sfx('back'); }
  }
  draw(c) {
    this.dim(c, 0.88); this.title(c, 'OPCIONES', '');
    this.items().forEach((it, i) => { const y = 34 + i * 16, s = i === this.sel; if (s) { c.fillStyle = 'rgba(94,232,255,0.15)'; c.fillRect(80, y - 4, 320, 15); } P.txt(c, it.l, 90, y, s ? '#fff' : '#c8d4e8'); P.txt(c, (it.adj && s ? '◄ ' : '') + it.v + (it.adj && s ? ' ►' : ''), 390, y, U.cyan, { align: 'right' }); });
    P.wrap('El modo desarrollador desbloquea todos los niveles y compañeros para pruebas. No altera tu partida guardada salvo lo que hagas con él.', 320).forEach((l, i) => P.txt(c, l, 80, 38 + this.items().length * 16 + i * 10, U.dim));
    this.hints(c, [['left', 'Ajustar'], ['back', 'Volver']]);
  }
};
P.KeysUI = class extends P.UIBase {
  acts() { return Object.keys(P.ACTION_NAMES); }
  update() {
    this.t++; if (this.wait) return;
    const a = this.acts(); this.nav(a.length + 1);
    if (P.input.pressed('confirm')) {
      if (this.sel === a.length) { P.input.binds = JSON.parse(JSON.stringify(P.DEFAULT_KEYS)); P.saveSettings(); P.Audio.sfx('unlock'); return; }
      const act = a[this.sel]; this.wait = act;
      setTimeout(() => { P.input.capture = code => { if (code !== 'Escape') { P.input.binds[act] = [code].concat(P.input.binds[act].filter(k => k !== code).slice(1)); P.saveSettings(); P.Audio.sfx('select'); } this.wait = null; P.input.clear(); }; }, 120);
    }
    if (P.input.pressed('back')) { this.close(); P.Audio.sfx('back'); }
  }
  draw(c) {
    this.dim(c, 0.92); this.title(c, 'CONTROLES', 'Teclado · también compatible con mando');
    const a = this.acts();
    a.forEach((k, i) => { const y = 32 + i * 15, s = i === this.sel; if (s) { c.fillStyle = 'rgba(94,232,255,0.15)'; c.fillRect(70, y - 3, 340, 13); } P.txt(c, P.ACTION_NAMES[k], 80, y, s ? '#fff' : '#c8d4e8'); P.txt(c, this.wait === k ? 'Pulsa una tecla…' : P.input.binds[k].map(x => P.input.keyName(x)).join(' / '), 400, y, this.wait === k ? U.gold : U.cyan, { align: 'right' }); });
    const y = 32 + a.length * 15, s = this.sel === a.length; if (s) { c.fillStyle = 'rgba(94,232,255,0.15)'; c.fillRect(70, y - 3, 340, 13); } P.txt(c, 'Restablecer valores por defecto', 80, y, s ? '#fff' : U.dim);
    this.hints(c, [['confirm', 'Reasignar'], ['back', 'Volver']]);
  }
};

// ================= HUD =================
P.HUD = {
  draw(c, L) {
    const p = L.player, S = P.State, d = S.data;
    // panel de estado
    P.panel(c, 4, 4, 132, 38, { fill: 'rgba(6,12,26,0.78)', border: '#ff8a7a', noAccent: true });
    P.spr(c, 'heropor_' + d.skin, 0, 6, 6, { fit: 20 });
    P.txt(c, d.name, 28, 7, '#ffffff'); P.txt(c, 'NV ' + d.lv, 132, 7, U.gold, { align: 'right' });
    P.bar(c, 28, 17, 104, 7, p.hp / p.maxHP, p.hp / p.maxHP < 0.3 && L.t % 20 < 10 ? '#ffffff' : '#ff3a5a', { ticks: 4 });
    P.txt(c, Math.ceil(p.hp) + '', 30, 18, '#ffffff', { shadow: '#000' });
    const full = p.energy >= 100;
    P.bar(c, 28, 26, 104, 5, p.energy / 100, full && L.t % 16 < 8 ? '#fff6c0' : '#ffd166');
    P.bar(c, 28, 33, 104, 3, p.shield / p.st.shieldMax, p.st.reflect ? '#9cff6a' : '#5ee8ff');
    if (full) P.txt(c, 'SUPER ' + P.input.label('super'), 132, 44, U.gold, { align: 'right' });
    // arma
    const W = P.D.WEAPONS[p.weapon];
    P.spr(c, W.icon, 0, 6, 46); P.txt(c, W.name, 19, 47, '#c8d4e8');
    // recursos y objetivo
    let x = P.W - 6;
    for (const k of ['crys', 'scrap', 'bio']) { const s = String(d.res[k]); x -= P.txtW(s); P.txt(c, s, x, 7, '#ffffff'); x -= 13; P.spr(c, 'i_' + k, 0, x, 6); x -= 8; }
    if (!L.def.boss) {
      const tot = L.ents.filter(e => e instanceof P.Extractor).length + (L.restoredAll ? 0 : 0);
      const msg = L.restoredAll ? 'TERRITORIO LIBERADO' : L.extractorsLeft > 0 ? 'EXTRACTORAS ACTIVAS: ' + L.extractorsLeft : '¡PORTAL ABIERTO!';
      P.txt(c, msg, P.W - 6, 20, L.extractorsLeft > 0 && !L.restoredAll ? '#ff8ad8' : '#7dffa0', { align: 'right' });
    }
    // compañeros
    let cx = 6;
    const seen = {};
    for (const k of L.companions) {
      if (seen[k.id]) continue; seen[k.id] = true;
      const h = k.hud; P.panel(c, cx, P.H - 22, 18, 18, { cut: 2, noAccent: true, border: h.used ? '#4a3a4a' : '#5ee8ff', fill: 'rgba(6,12,26,0.8)' });
      P.spr(c, h.used ? 'i_heartg' : h.spr, 0, cx + 2, P.H - 20, { fit: 14 });
      if (h.cd > 0 && !h.used) { c.fillStyle = 'rgba(0,0,0,0.6)'; c.fillRect(cx + 1, P.H - 21, 16, Math.round(16 * h.cd)); }
      cx += 21;
    }
    // jefe
    const b = L.ents.find(e => e.boss && !e.dead && e.active);
    if (b && b.drawBar) b.drawBar(c);
    else if (b) {
      const w = 300, x0 = (P.W - w) / 2, y0 = P.H - 20;
      P.txt(c, b.name, x0, y0 - 11, '#ff8ad8', { outline: true, shadow: '#3a0a30' }); P.txt(c, b.title, x0 + w, y0 - 11, U.dim, { align: 'right' });
      b.ghost = b.ghost == null ? b.hp : P.approach(b.ghost, b.hp, b.maxhp * 0.004);
      P.bar(c, x0, y0, w, 8, b.hp / b.maxhp, b.phase === 3 ? '#ff3a8a' : '#c04ad0', { ghost: b.ghost / b.maxhp, border: '#ff8ad8' });
      for (const f of [0.66, 0.33]) { c.fillStyle = '#ffffff'; c.fillRect(Math.round(x0 + w * f), y0, 1, 8); }
    }
    // cartel de nivel
    if (L.banner > 0 && !L.def.boss) {
      const a = Math.min(1, L.banner / 30, (170 - L.banner) / 20); c.globalAlpha = Math.max(0, a);
      c.fillStyle = 'rgba(0,0,0,0.5)'; c.fillRect(0, 96, P.W, 50);
      P.txt(c, L.sim ? 'SIMULACIÓN HOLOGRÁFICA' : P.D.planet(L.planet).name + ' · TERRITORIO ' + L.def.id + (L.restoredAll ? ' · LIBERADO' : ''), P.W / 2, 101, U.green, { align: 'center' });
      P.txt(c, L.def.name.toUpperCase(), P.W / 2, 113, '#ffffff', { align: 'center', scale: 2, outline: true, shadow: '#04140a' });
      P.txt(c, L.def.sub, P.W / 2, 134, U.dim, { align: 'center' });
      c.globalAlpha = 1;
    }
    // consejos
    if (L.tip && L.tipT > 0 && P.settings.showTips) {
      const a = Math.min(1, L.tipT / 30); c.globalAlpha = a;
      const lines = P.wrap(L.tip, 380), h = lines.length * 10 + 8, y = 62;
      P.panel(c, P.W / 2 - 200, y, 400, h, { border: U.gold, fill: 'rgba(20,16,6,0.85)', noAccent: true });
      lines.forEach((l, i) => P.txt(c, l, P.W / 2, y + 5 + i * 10, '#fff6c0', { align: 'center' }));
      c.globalAlpha = 1;
    }
  }
};

// ---------- vestidor: selección de trajes ----------
// 9 espacios: los trajes que existen y huecos bloqueados para los que llegarán con los próximos planetas
P.WARDROBE_SLOTS = () => { const ids = Object.keys(P.HERO_SKINS); while (ids.length < 9) ids.push('futuro_' + ids.length); return ids.slice(0, Math.max(9, ids.length)); };
P.WardrobeUI = class extends P.UIBase {
  constructor() { super(); this.ids = P.WARDROBE_SLOTS(); this.sel = Math.max(0, this.ids.indexOf(P.State.data.skin)); this.top = 0; this.cols = Math.max(5, Math.ceil(this.ids.length / 2)); }
  slot(i) { const C = this.cols, gap = 6, w = Math.min(84, Math.floor((P.W - 16 - (C - 1) * gap) / C)), h = 96, x0 = Math.round((P.W - (C * w + (C - 1) * gap)) / 2); return { x: x0 + (i % C) * (w + gap), y: 30 + Math.floor(i / C) * (h + 6), w, h }; }
  equip() { const id = this.ids[this.sel], d = P.State.data; if (!P.HERO_SKINS[id] || !d.skins.includes(id)) { P.Audio.sfx('back'); return; } if (d.skin !== id) { d.skin = id; P.Audio.sfx('select'); P.toast('Traje equipado: ' + P.HERO_SKINS[id].name, { col: P.UIC.green }); } }
  update() {
    this.t++; const I = P.input, n = this.ids.length;
    if (I.pressed('right')) { this.sel = (this.sel + 1) % n; P.Audio.sfx('move'); }
    if (I.pressed('left')) { this.sel = (this.sel + n - 1) % n; P.Audio.sfx('move'); }
    if (I.pressed('down') && this.sel + this.cols < n) { this.sel += this.cols; P.Audio.sfx('move'); }
    if (I.pressed('up') && this.sel >= this.cols) { this.sel -= this.cols; P.Audio.sfx('move'); }
    if (I.pressed('confirm')) this.equip();
    const ck = I.click; if (ck && P.frame - ck.t < 3) { I.click = null; for (let i = 0; i < n; i++) { const r = this.slot(i); if (ck.x >= r.x && ck.x <= r.x + r.w && ck.y >= r.y && ck.y <= r.y + r.h) { if (this.sel === i) this.equip(); else { this.sel = i; P.Audio.sfx('move'); } } } }
    if (I.pressed('back')) { this.close(); P.Audio.sfx('back'); }
  }
  draw(c) {
    c.fillStyle = '#06070c'; c.fillRect(0, 0, P.W, P.H); const d = P.State.data;
    this.title(c, 'VESTIDOR', 'Trajes del agente ' + d.name, '#ff8a7a');
    const owned = this.ids.filter(i => d.skins.includes(i)).length;
    P.txt(c, 'Trajes: ' + owned + '/' + this.ids.length, P.W - 14, P.H - 12, U.dim, { align: 'right' });
    for (let i = 0; i < this.ids.length; i++) {
      const id = this.ids[i], r = this.slot(i), real = !!P.HERO_SKINS[id], own = real && d.skins.includes(id), sel = i === this.sel, on = d.skin === id;
      P.panel(c, r.x, r.y, r.w, r.h, { border: sel ? '#ff8a7a' : on ? '#3a8a5a' : '#2a3a5a', noAccent: !sel });
      c.fillStyle = '#8a98bc'; c.fillRect(r.x + 8, r.y + 8, r.w - 16, 2); c.fillRect(r.x + r.w / 2, r.y + 10, 1, 5);
      if (sel) P.drawGlow(c, r.x + r.w / 2, r.y + 48, 30, own ? '#ff6a5a' : '#5a6478', 0.25 + Math.sin(this.t * 0.08) * 0.08);
      const bob = sel && own ? Math.round(Math.sin(this.t * 0.08) * 1.5) : 0;
      if (real) P.spr(c, 'hero_' + id, sel && own ? Math.floor(this.t / 30) % 2 : 0, r.x + r.w / 2 - 24, r.y + 18 + bob, { scale: 2, sil: own ? null : '#141a28' });
      else { P.spr(c, 'hero_rojo', 0, r.x + r.w / 2 - 24, r.y + 18, { scale: 2, sil: '#141a28' }); P.txt(c, '?', r.x + r.w / 2 - 2, r.y + 40, '#3a4a6a'); }
      if (on) P.txt(c, '✓', r.x + r.w - 12, r.y + r.h - 12, U.green);
      else if (!own) P.spr(c, 'i_lock', 0, r.x + r.w - 14, r.y + r.h - 14);
    }
    { const id = this.ids[this.sel], real = !!P.HERO_SKINS[id], own = real && d.skins.includes(id), on = d.skin === id;
      P.txt(c, own ? P.HERO_SKINS[id].name : '??? · traje sin descubrir', P.W / 2, 236, own ? '#fff' : U.dim, { align: 'center' });
      P.txt(c, on ? 'EQUIPADO' : own ? 'Pulsa para vestir este traje' : 'Se obtiene al liberar un planeta', P.W / 2, 246, on ? U.green : U.dim, { align: 'center' }); }
    this.hints(c, [['left', 'Elegir'], ['confirm', 'Vestir'], ['back', 'Salir']]);
  }
};
