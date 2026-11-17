'use strict';
// PLENURIA — núcleo: bucle, escenas, entrada, almacenamiento
const P = window.P = {};
P.W = 480; P.H = 270; P.TS = 16;
P.frame = 0;
P.debug = false;

// ---------- utilidades ----------
P.clamp = (v, a, b) => v < a ? a : v > b ? b : v;
P.lerp = (a, b, t) => a + (b - a) * t;
P.rand = (a, b) => a + Math.random() * (b - a);
P.ri = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
P.pick = arr => arr[Math.floor(Math.random() * arr.length)];
P.approach = (v, t, d) => v < t ? Math.min(v + d, t) : Math.max(v - d, t);
P.dist = (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay);
P.overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
P.RNG = function (seed) {
  let s = (seed >>> 0) || 1;
  const f = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  f.range = (a, b) => a + f() * (b - a);
  f.int = (a, b) => Math.floor(a + f() * (b - a + 1));
  f.pick = a => a[Math.floor(f() * a.length)];
  return f;
};
P.hash = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
P.fmtTime = (sec) => { sec = Math.floor(sec); const h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = sec % 60; return (h ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0'); };

// ---------- almacenamiento ----------
P.Store = {
  get(k) { try { const v = localStorage.getItem('plenuria_' + k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem('plenuria_' + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  del(k) { try { localStorage.removeItem('plenuria_' + k); } catch (e) { } }
};

// ---------- ajustes ----------
P.DEFAULT_KEYS = {
  left: ['ArrowLeft', 'KeyA'], right: ['ArrowRight', 'KeyD'], up: ['ArrowUp', 'KeyW'], down: ['ArrowDown', 'KeyS'],
  jump: ['Space'], attack: ['KeyJ', 'KeyZ'], defend: ['KeyK', 'KeyX'], super: ['KeyL', 'KeyC'],
  dash: ['ShiftLeft', 'ShiftRight'], interact: ['KeyE', 'KeyF'], swap: ['KeyQ'], pause: ['Escape', 'KeyP'],
  confirm: ['Enter', 'Space', 'KeyJ', 'KeyZ'], back: ['Escape', 'Backspace', 'KeyX']
};
P.ACTION_NAMES = { left: 'Izquierda', right: 'Derecha', up: 'Arriba / Trepar', down: 'Agacharse', jump: 'Saltar', attack: 'ATAQUE', defend: 'DEFENSA', super: 'SUPERATAQUE', dash: 'Esquivar', interact: 'Interactuar / Escanear', swap: 'Cambiar arma', pause: 'Pausa' };
P.settings = { music: 0.6, sfx: 0.8, shake: true, keys: null, scale: 0, showTips: true, dev: false, gfx: 2 };
P.loadSettings = function () {
  const s = P.Store.get('settings');
  if (s) Object.assign(P.settings, s);
  const k = JSON.parse(JSON.stringify(P.DEFAULT_KEYS));
  if (P.settings.keys) for (const a in P.settings.keys) if (k[a]) k[a] = P.settings.keys[a];
  P.input.binds = k;
};
P.saveSettings = function () {
  const keys = {};
  for (const a in P.ACTION_NAMES) keys[a] = P.input.binds[a];
  P.settings.keys = keys;
  P.Store.set('settings', P.settings);
};

// ---------- entrada ----------
P.input = {
  keys: {}, a: {}, prev: {}, binds: null, text: null, lastKey: null, gpActive: false, capture: null,
  init() {
    window.addEventListener('keydown', e => {
      if (P.Audio) P.Audio.unlock();
      if (this.capture) { e.preventDefault(); const c = this.capture; this.capture = null; c(e.code); return; }
      if (this.text) {
        const t = this.text, el = this.textEl;
        if (e.key === 'Enter') { t.done = true; e.preventDefault(); }
        else if (e.key === 'Escape') { t.cancel = true; e.preventDefault(); }
        else if (el && document.activeElement !== el) el.focus();
        return;
      }
      this.keys[e.code] = true; this.latch[e.code] = true; this.lastKey = e.code;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Backspace'].includes(e.code)) e.preventDefault();
      if (e.code === 'F9') { P.settings.dev = !P.settings.dev; P.toast(P.settings.dev ? 'Modo desarrollador ACTIVADO (F9)' : 'Modo desarrollador desactivado'); }
      if (e.code === 'F3') P.debug = !P.debug;
    });
    window.addEventListener('keyup', e => { this.keys[e.code] = false; });
    window.addEventListener('blur', () => { this.keys = {}; });
    window.addEventListener('mousedown', e => { if (P.Audio) P.Audio.unlock(); const r = P.canvas.getBoundingClientRect(); if (r.width) P.input.click = { x: (e.clientX - r.left) / r.width * P.W, y: (e.clientY - r.top) / r.height * P.H, t: P.frame }; });
  },
  poll() {
    const gp = this.readPad();
    for (const act in this.binds) {
      let d = false;
      for (const k of this.binds[act]) if (this.keys[k] || this.latch[k]) { d = true; break; }
      if (!d && gp) d = !!gp[act];
      this.a[act] = d;
    }
    this.latch = {};
  },
  latch: {},
  readPad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const p = pads && Array.from(pads).find(x => x && x.connected);
    if (!p) return null;
    const b = i => p.buttons[i] && p.buttons[i].pressed;
    const ax = p.axes[0] || 0, ay = p.axes[1] || 0;
    const g = {
      left: b(14) || ax < -0.4, right: b(15) || ax > 0.4, up: b(12) || ay < -0.5, down: b(13) || ay > 0.5,
      jump: b(0), dash: b(1), attack: b(2), interact: b(3), defend: b(4) || b(6), swap: b(5), super: b(7),
      pause: b(9), confirm: b(0), back: b(1)
    };
    for (const k in g) if (g[k]) { this.gpActive = true; if (P.Audio) P.Audio.unlock(); break; }
    return g;
  },
  // edición de texto mediante un <input> oculto (teclados físicos, virtuales, pegar)
  startText(field) {
    this.text = field;
    let el = this.textEl;
    if (!el) {
      el = this.textEl = document.createElement('input');
      el.type = 'text'; el.autocomplete = 'off'; el.spellcheck = false;
      el.style.cssText = 'position:fixed;left:-2000px;top:0;width:200px;opacity:0';
      document.body.appendChild(el);
      el.addEventListener('input', () => { if (this.text) { this.text.value = el.value.replace(/[^\wÁÉÍÓÚÑÜáéíóúñü \-\.]/g, '').slice(0, this.text.max); el.value = this.text.value; P.Audio.sfx('blip'); } });
      el.addEventListener('blur', () => { if (this.text) setTimeout(() => el.focus(), 0); });
    }
    el.maxLength = field.max; el.value = field.value;
    setTimeout(() => { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }, 0);
  },
  endText() { this.text = null; if (this.textEl) this.textEl.blur(); this.keys = {}; this.clear(); },
  down(a) { return !!this.a[a]; },
  pressed(a) { return !!this.a[a] && !this.prev[a]; },
  released(a) { return !this.a[a] && !!this.prev[a]; },
  endFrame() { for (const k in this.a) this.prev[k] = this.a[k]; },
  consume(a) { this.prev[a] = true; },
  clear() { for (const k in this.a) { this.prev[k] = true; } },
  keyName(code) {
    if (!code) return '—';
    const M = { ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓', Space: 'Espacio', Escape: 'Esc', Enter: 'Enter', Backspace: 'Retroceso', ShiftLeft: 'Shift', ShiftRight: 'Shift D', ControlLeft: 'Ctrl', Tab: 'Tab' };
    return M[code] || code.replace('Key', '').replace('Digit', '').replace('Numpad', 'Num ');
  },
  label(a) { return this.keyName((this.binds[a] || [])[0]); }
};

// ---------- notificaciones ----------
P.toasts = [];
P.toast = function (text, opts = {}) {
  P.toasts.push({ text, icon: opts.icon || null, col: opts.col || '#bff6ff', t: 0, life: opts.life || 220 });
  if (P.toasts.length > 4) P.toasts.shift();
};

// ---------- escenas y superposiciones ----------
P.scene = null; P.ui = []; P.fade = null; P.shakeT = 0; P.shakeM = 0; P.hitstop = 0;
P.goto = function (scene, instant) {
  if (instant || !P.scene) { if (P.scene && P.scene.exit) P.scene.exit(); P.scene = scene; P.ui.length = 0; if (scene.enter) scene.enter(); return; }
  if (P.fade) return;
  P.fade = { t: 0, phase: 'out', next: scene };
};
P.openUI = function (ui) { P.ui.push(ui); ui.closed = false; if (ui.open) ui.open(); P.input.clear(); return ui; };
P.closeUI = function (ui) { const i = P.ui.indexOf(ui); if (i >= 0) P.ui.splice(i, 1); ui.closed = true; if (ui.onClose) ui.onClose(); P.input.clear(); };
P.shake = function (mag, t) { if (!P.settings.shake) return; P.shakeM = Math.max(P.shakeM, mag); P.shakeT = Math.max(P.shakeT, t); };

P.update = function () {
  P.input.poll();
  if (P.fade) {
    const f = P.fade; f.t++;
    if (f.phase === 'out' && f.t >= 18) {
      if (P.scene && P.scene.exit) P.scene.exit();
      P.ui.length = 0; P.scene = f.next; if (P.scene.enter) P.scene.enter();
      f.phase = 'in'; f.t = 0;
    } else if (f.phase === 'in' && f.t >= 18) P.fade = null;
  } else if (P.hitstop > 0) {
    P.hitstop--;
  } else {
    const top = P.ui[P.ui.length - 1];
    if (top) { top.update(); if (top.passthrough && P.scene) P.scene.update(); }
    else if (P.scene) P.scene.update();
    if (top && top.pauses === false && P.scene) P.scene.update();
  }
  for (const t of P.toasts) t.t++;
  P.toasts = P.toasts.filter(t => t.t < t.life);
  if (P.shakeT > 0) { P.shakeT--; if (P.shakeT <= 0) P.shakeM = 0; }
  if (P.State && P.State.data) P.State.data.playtime += 1 / 60;
  P.input.endFrame();
  P.frame++;
};

P.draw = function () {
  const c = P.ctx;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  if (P.scene) P.scene.draw(c);
  for (const u of P.ui) { c.save(); u.draw(c); c.restore(); }
  P.drawToasts(c);
  if (P.fade) {
    const f = P.fade, a = f.phase === 'out' ? f.t / 18 : 1 - f.t / 18;
    c.fillStyle = 'rgba(3,4,10,' + P.clamp(a, 0, 1) + ')'; c.fillRect(0, 0, P.W, P.H);
  }
  if (P.debug && P.scene) { P.txt(c, 'FPS ' + P.fps + ' ' + (P.scene.debugInfo ? P.scene.debugInfo() : ''), 4, P.H - 10, '#0f0'); }
  // copia al lienzo visible
  const s = P.sctx;
  s.imageSmoothingEnabled = false;
  let ox = 0, oy = 0;
  if (P.shakeT > 0) { ox = Math.round(P.rand(-P.shakeM, P.shakeM)) * P.scale; oy = Math.round(P.rand(-P.shakeM, P.shakeM)) * P.scale; }
  s.fillStyle = '#000'; s.fillRect(0, 0, P.canvas.width, P.canvas.height);
  // capa de shaders (WebGL) a la resolución original; si no hay WebGL o la calidad es «Baja», se copia el búfer tal cual
  let src = P.buf; if (P.GLFX && P.GLFX.on()) { try { src = P.GLFX.render(P.buf); } catch (e) { P.GLFX.failed = true; P.GLFX.ok = false; src = P.buf; } }
  s.drawImage(src, ox, oy, P.W * P.scale, P.H * P.scale);
};

P.drawToasts = function (c) {
  let y = P.scene instanceof P.LevelScene ? 30 : 6;
  for (const t of P.toasts) {
    const a = Math.min(1, t.t / 10, (t.life - t.t) / 20);
    const w = P.txtW(t.text) + (t.icon ? 22 : 12);
    const x = Math.round(P.clamp(P.W / 2 + 40 - w / 2, 142, P.W - 4 - w));
    c.globalAlpha = a;
    P.panel(c, x, y, w, 15, { fill: 'rgba(6,14,28,0.88)', border: t.col });
    if (t.icon) P.spr(c, t.icon, 0, x + 4, y + 2, { fit: 11 });
    P.txt(c, t.text, x + (t.icon ? 18 : 6), y + 4, t.col);
    c.globalAlpha = 1;
    y += 18;
  }
};

P.resize = function () {
  if (P.settings.scale) { const sc = P.settings.scale; P.scale = sc; P.canvas.width = P.W * sc; P.canvas.height = P.H * sc; P.canvas.style.width = P.canvas.style.height = ''; return; }
  // automático: ocupa toda la ventana o pantalla (móvil, tableta, escritorio) manteniendo la proporción y los píxeles nítidos
  const fit = Math.min(window.innerWidth / P.W, window.innerHeight / P.H), dpr = Math.min(3, window.devicePixelRatio || 1);
  const sc = Math.max(1, Math.min(8, Math.ceil(fit * dpr - 0.01)));
  P.scale = sc; P.canvas.width = P.W * sc; P.canvas.height = P.H * sc;
  P.canvas.style.width = Math.floor(P.W * fit) + 'px'; P.canvas.style.height = Math.floor(P.H * fit) + 'px';
};

P.init = function () {
  P.canvas = document.getElementById('screen');
  P.sctx = P.canvas.getContext('2d');
  P.buf = document.createElement('canvas'); P.buf.width = P.W; P.buf.height = P.H;
  P.ctx = P.buf.getContext('2d');
  P.ctx.imageSmoothingEnabled = false;
  P.input.init();
  P.loadSettings();
  P.resize();
  window.addEventListener('resize', P.resize);
  P.Font.build();
  P.Gfx.build();
  P.State.init();
  P.goto(new P.TitleScene(), true);
  let last = performance.now(), acc = 0, fc = 0, ft = 0;
  P.fps = 60;
  const step = 1000 / 60;
  const loop = (now) => {
    let dt = now - last; last = now;
    if (dt > 250) dt = 250;
    acc += dt; ft += dt; fc++;
    if (ft > 1000) { P.fps = fc; fc = 0; ft = 0; }
    let n = 0;
    while (acc >= step && n < 5) {
      try { P.update(); } catch (e) { console.error(e); P.lastError = e; }
      acc -= step; n++;
    }
    if (n >= 5) acc = 0;
    try { P.draw(); } catch (e) { console.error(e); P.lastError = e; }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
};
