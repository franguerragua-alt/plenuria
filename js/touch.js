'use strict';
// Controles táctiles para móviles y tabletas (Android, iPhone, iPad). Aparecen con el primer toque.
// Izquierda: palanca flotante (aparece donde apoyas el pulgar). Derecha: botones como en un mando
// (A salto/aceptar · B esquiva/volver · X disparo · Y usar) y encima DEFENSA, ARMA y SÚPER. Arriba: pausa.
// Se integra con P.input como un mando más, así que todas las pantallas del juego funcionan igual.
P.Touch = {
  on: false, state: {}, latch: {}, held: {}, tmap: {}, stick: null, cv: null, ctx: null, L: null, dpr: 1, fsTried: false,
  BTN: [
    { id: 'A', acts: ['jump', 'confirm'], label: 'SALTO', menu: 'ACEPTAR', col: '#57ff7a', inMenu: true },
    { id: 'B', acts: ['dash', 'back'], label: 'ESQUIVA', menu: 'VOLVER', col: '#ff5a6a', inMenu: true },
    { id: 'X', acts: ['attack'], label: 'DISPARO', col: '#5ee8ff' },
    { id: 'Y', acts: ['interact'], label: 'USAR', col: '#ffd166' },
    { id: 'L', acts: ['defend'], label: 'DEFENSA', col: '#b48cff', pill: true },
    { id: 'R', acts: ['swap'], label: 'ARMA', col: '#a8b4cc', pill: true },
    { id: 'S', acts: ['super'], label: 'SÚPER', col: '#ff8a3a', pill: true },
    { id: 'P', acts: ['pause'], label: 'II', col: '#c8d4e8', small: true }
  ],
  init() {
    const opt = { passive: false };
    window.addEventListener('touchstart', e => this.onStart(e), opt);
    window.addEventListener('touchmove', e => this.onMove(e), opt);
    window.addEventListener('touchend', e => this.onEnd(e), opt);
    window.addEventListener('touchcancel', e => this.onEnd(e), opt);
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('orientationchange', () => setTimeout(() => this.resize(), 250));
    // se integra con la lectura de controles y con el dibujado
    const poll0 = P.input.poll.bind(P.input);
    P.input.poll = function () {
      poll0(); const T = P.Touch; if (!T.on) return;
      for (const act in T.state) if (T.state[act]) this.a[act] = true;
      for (const act in T.latch) if (T.latch[act]) this.a[act] = true;
      T.latch = {};
    };
    const draw0 = P.draw; P.draw = function () { draw0.apply(this, arguments); P.Touch.render(); };
  },
  enable() {
    if (this.on) return; this.on = true; document.body.classList.add('touch');
    const cv = this.cv = document.createElement('canvas'); cv.id = 'touchui'; document.body.appendChild(cv); this.ctx = cv.getContext('2d');
    if (P.settings && P.settings.scale) { P.settings.scale = 0; P.resize(); }
    this.resize();
  },
  resize() {
    if (!this.cv) return; const W = window.innerWidth, H = window.innerHeight; this.dpr = Math.min(3, window.devicePixelRatio || 1);
    this.cv.width = Math.round(W * this.dpr); this.cv.height = Math.round(H * this.dpr); this.cv.style.width = W + 'px'; this.cv.style.height = H + 'px';
    const u = Math.min(W, H), m = Math.max(14, u * 0.045), r = Math.max(24, Math.min(46, u * 0.085)), cx = W - m - r * 2.5, cy = H - m - r * 2.4, pw = r * 1.9, ph = r * 0.85, py = cy - r * 2.95;
    const pos = { A: [cx, cy + r * 1.3], B: [cx + r * 1.3, cy], X: [cx - r * 1.3, cy], Y: [cx, cy - r * 1.3], L: [W - m - pw * 2.5 - 12, py], R: [W - m - pw * 1.5 - 6, py], S: [W - m - pw * 0.5, py], P: [W / 2, m + r * 0.5] };
    this.L = { W, H, m, r, pw, ph, pos, stick: { x: m + r * 2.1, y: H - m - r * 2.1, R: r * 1.7 } };
  },
  menuMode() { const s = P.scene; return P.ui.length > 0 || !s || s instanceof P.TitleScene || (P.IntroScene && s instanceof P.IntroScene) || (P.EndingScene && s instanceof P.EndingScene); },
  visible(b) { return this.menuMode() ? !!b.inMenu : true; },
  hit(x, y) {
    const L = this.L; if (!L) return null;
    for (const b of this.BTN) {
      if (!this.visible(b)) continue; const [bx, by] = L.pos[b.id];
      if (b.pill) { if (Math.abs(x - bx) <= L.pw / 2 + 4 && Math.abs(y - by) <= L.ph / 2 + 6) return b; }
      else { const rr = b.small ? L.r * 0.75 : L.r * 1.12; if ((x - bx) * (x - bx) + (y - by) * (y - by) <= rr * rr) return b; }
    }
    return null;
  },
  press(id) {
    this.held[id] = (this.held[id] || 0) + 1; const b = this.BTN.find(q => q.id === id);
    for (const a of b.acts) { this.state[a] = true; this.latch[a] = true; }
    if (id === 'A' && P.input.text) P.input.text.done = true;
    if (navigator.vibrate) try { navigator.vibrate(8); } catch (e) { }
  },
  release(id) {
    this.held[id] = Math.max(0, (this.held[id] || 0) - 1); if (this.held[id]) return;
    for (const a of this.BTN.find(q => q.id === id).acts) this.state[a] = false;
  },
  setDirs(l, r, u, d) { this.state.left = l; this.state.right = r; this.state.up = u; this.state.down = d; if (l) this.latch.left = true; if (r) this.latch.right = true; if (u) this.latch.up = true; if (d) this.latch.down = true; },
  updStick() {
    const s = this.stick; if (!s) { this.setDirs(false, false, false, false); return; }
    const R = this.L.stick.R; let dx = s.knob.x - s.base.x, dy = s.knob.y - s.base.y; const d = Math.hypot(dx, dy);
    if (d > R) { const k = (d - R) / d; s.base.x += dx * k; s.base.y += dy * k; dx = s.knob.x - s.base.x; dy = s.knob.y - s.base.y; } // la base sigue al dedo
    this.setDirs(dx < -R * 0.3, dx > R * 0.3, dy < -R * 0.5, dy > R * 0.5);
  },
  tapClick(x, y) { const r = P.canvas.getBoundingClientRect(); if (r.width) P.input.click = { x: (x - r.left) / r.width * P.W, y: (y - r.top) / r.height * P.H, t: P.frame }; },
  onStart(e) {
    e.preventDefault(); this.enable(); if (P.Audio) P.Audio.unlock();
    for (const t of e.changedTouches) {
      const x = t.clientX, y = t.clientY, b = this.hit(x, y);
      if (b) { this.tmap[t.identifier] = { k: 'btn', id: b.id }; this.press(b.id); continue; }
      if (!this.menuMode() && !P.input.text && x < this.L.W * 0.42 && y > this.L.H * 0.18 && !this.stick) { this.stick = { id: t.identifier, base: { x, y }, knob: { x, y } }; this.tmap[t.identifier] = { k: 'stick' }; this.updStick(); continue; }
      // toque libre: pulsa elementos de la interfaz (pestañas, tarjetas...); si arrastras, hace de palanca para navegar
      this.tmap[t.identifier] = { k: 'tap', x0: x, y0: y }; this.tapClick(x, y);
    }
  },
  onMove(e) {
    e.preventDefault();
    for (const t of e.changedTouches) {
      const m = this.tmap[t.identifier]; if (!m) continue; const x = t.clientX, y = t.clientY;
      if (m.k === 'stick' && this.stick) { this.stick.knob.x = x; this.stick.knob.y = y; this.updStick(); }
      else if (m.k === 'tap' && !this.stick && Math.hypot(x - m.x0, y - m.y0) > 14) { this.stick = { id: t.identifier, base: { x: m.x0, y: m.y0 }, knob: { x, y } }; m.k = 'stick'; this.updStick(); }
      else if (m.k === 'btn' && 'ABXY'.includes(m.id)) { const b = this.hit(x, y); if (b && b.id !== m.id && 'ABXY'.includes(b.id)) { this.release(m.id); m.id = b.id; this.press(b.id); } } // deslizar entre botones
    }
  },
  onEnd(e) {
    e.preventDefault(); if (P.Audio) P.Audio.unlock();
    for (const t of e.changedTouches) {
      const m = this.tmap[t.identifier]; delete this.tmap[t.identifier]; if (!m) continue;
      if (m.k === 'btn') this.release(m.id);
      else if (m.k === 'stick') { this.stick = null; this.updStick(); }
      else if (m.k === 'tap' && P.input.text && P.input.textEl) P.input.textEl.focus(); // abre el teclado del teléfono
    }
    this.goFull();
  },
  // pantalla completa y horizontal en Android (en iPhone se consigue instalando la app en la pantalla de inicio)
  goFull() {
    if (this.fsTried || P.PLATFORM !== 'web' || !(window.matchMedia && matchMedia('(pointer: coarse)').matches)) return; this.fsTried = true;
    const el = document.documentElement, rq = el.requestFullscreen || el.webkitRequestFullscreen; if (!rq || document.fullscreenElement) return;
    try { const p = rq.call(el, { navigationUI: 'hide' }); if (p && p.then) p.then(() => { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => { }); }).catch(() => { }); } catch (err) { }
  },
  render() {
    if (!this.on || !this.L) return; const c = this.ctx, L = this.L, menu = this.menuMode();
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); c.clearRect(0, 0, L.W, L.H);
    // palanca
    if (!menu || this.stick) {
      const s = this.stick, bx = s ? s.base.x : L.stick.x, by = s ? s.base.y : L.stick.y, kx = s ? s.knob.x : bx, ky = s ? s.knob.y : by, R = L.stick.R;
      const dx = kx - bx, dy = ky - by, d = Math.hypot(dx, dy) || 1, kk = Math.min(1, R * 0.62 / d);
      c.globalAlpha = s ? 0.55 : 0.28; c.fillStyle = 'rgba(160,190,255,0.12)'; c.strokeStyle = 'rgba(200,220,255,0.7)'; c.lineWidth = 2;
      c.beginPath(); c.arc(bx, by, R, 0, 7); c.fill(); c.stroke();
      c.globalAlpha = s ? 0.85 : 0.4; c.fillStyle = 'rgba(220,235,255,0.55)'; c.beginPath(); c.arc(bx + dx * kk, by + dy * kk, R * 0.42, 0, 7); c.fill();
    }
    // botones
    for (const b of this.BTN) {
      if (!this.visible(b)) continue; const [x, y] = L.pos[b.id], on = this.held[b.id] > 0, label = menu && b.menu ? b.menu : b.label;
      c.globalAlpha = on ? 0.9 : 0.5; c.lineWidth = 2; c.strokeStyle = b.col; c.fillStyle = on ? b.col : 'rgba(10,16,30,0.55)';
      c.beginPath();
      if (b.pill) { const w = L.pw, h = L.ph, rr = h / 2; c.moveTo(x - w / 2 + rr, y - h / 2); c.arcTo(x + w / 2, y - h / 2, x + w / 2, y + h / 2, rr); c.arcTo(x + w / 2, y + h / 2, x - w / 2, y + h / 2, rr); c.arcTo(x - w / 2, y + h / 2, x - w / 2, y - h / 2, rr); c.arcTo(x - w / 2, y - h / 2, x + w / 2, y - h / 2, rr); }
      else c.arc(x, y, b.small ? L.r * 0.5 : L.r, 0, 7);
      c.fill(); c.stroke();
      c.globalAlpha = on ? 1 : 0.85; c.fillStyle = on ? '#05060c' : '#ffffff'; c.textAlign = 'center'; c.textBaseline = 'middle';
      if (b.pill || b.small) { c.font = '700 ' + Math.round(L.r * (b.small ? 0.42 : 0.36)) + 'px system-ui, sans-serif'; c.fillText(label, x, y + 1); }
      else { c.font = '800 ' + Math.round(L.r * 0.62) + 'px system-ui, sans-serif'; c.fillText(b.id, x, y - L.r * 0.16); c.font = '700 ' + Math.round(L.r * 0.27) + 'px system-ui, sans-serif'; c.fillStyle = on ? '#05060c' : b.col; c.fillText(label, x, y + L.r * 0.45); }
    }
    c.globalAlpha = 1;
  }
};
window.addEventListener('load', () => P.Touch.init());
