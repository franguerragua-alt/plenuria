'use strict';
// Gráficos: pintor de píxeles, registro de sprites, partículas, luz, interfaz
P.Col = {
  cache: {},
  rgb(h) {
    if (this.cache[h]) return this.cache[h];
    let s = h.replace('#', ''); if (s.length === 3) s = s.split('').map(c => c + c).join('');
    const v = [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
    this.cache[h] = v; return v;
  },
  hex(r, g, b) { return '#' + [r, g, b].map(v => P.clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join(''); },
  mix(a, b, t) { const A = this.rgb(a), B = this.rgb(b); return this.hex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); },
  shade(a, amt) { return amt >= 0 ? this.mix(a, '#ffffff', amt) : this.mix(a, '#000000', -amt); },
  u32(h) { const [r, g, b] = this.rgb(h); return ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0; },
  rgba(h, a) { const [r, g, b] = this.rgb(h); return `rgba(${r},${g},${b},${a})`; }
};

P.Painter = class {
  constructor(w, h) { this.w = w; this.h = h; this.d = new Uint32Array(w * h); this.glowMask = null; }
  px(x, y, c) { x |= 0; y |= 0; if (x < 0 || y < 0 || x >= this.w || y >= this.h || !c) return; this.d[y * this.w + x] = P.Col.u32(c); }
  get(x, y) { if (x < 0 || y < 0 || x >= this.w || y >= this.h) return 0; return this.d[y * this.w + x]; }
  clear(x, y) { if (x < 0 || y < 0 || x >= this.w || y >= this.h) return; this.d[y * this.w + x] = 0; }
  rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.px(x + i, y + j, c); }
  line(x0, y0, x1, y1, c) {
    x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0;
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let e = dx + dy;
    for (; ;) { this.px(x0, y0, c); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } }
  }
  thick(x0, y0, x1, y1, w, c) {
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
    for (let i = 0; i <= n; i++) { const t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; this.rect(Math.round(x - w / 2), Math.round(y - w / 2), w, w, c); }
  }
  ell(cx, cy, rx, ry, c) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry; if (dx * dx + dy * dy <= 1) this.px(x, y, c);
    }
  }
  // elipse sombreada: cols = [oscuro, base, claro, brillo]; luz desde arriba-izquierda
  sell(cx, cy, rx, ry, cols, lx = -0.55, ly = -0.8) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry, r2 = dx * dx + dy * dy; if (r2 > 1) continue;
      const nz = Math.sqrt(1 - r2), l = -(dx * lx + dy * ly) * 0.8 + nz * 0.45;
      let c = cols[1]; if (l < 0.12) c = cols[0]; else if (l > 0.78 && cols[3]) c = cols[3]; else if (l > 0.55) c = cols[2];
      this.px(x, y, c);
    }
  }
  tri(x0, y0, x1, y1, x2, y2, c) {
    const minX = Math.floor(Math.min(x0, x1, x2)), maxX = Math.ceil(Math.max(x0, x1, x2)), minY = Math.floor(Math.min(y0, y1, y2)), maxY = Math.ceil(Math.max(y0, y1, y2));
    const area = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0); if (!area) return;
    for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
      const px = x + 0.5, py = y + 0.5;
      const w0 = ((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py)) / area, w1 = ((x2 - px) * (y0 - py) - (x0 - px) * (y2 - py)) / area, w2 = 1 - w0 - w1;
      if (w0 >= -0.01 && w1 >= -0.01 && w2 >= -0.01) this.px(x, y, c);
    }
  }
  // contorno automático (4-vecinos)
  outline(c) {
    const o = P.Col.u32(c), src = this.d.slice(), w = this.w, h = this.h;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (src[y * w + x]) continue;
      if ((x > 0 && src[y * w + x - 1]) || (x < w - 1 && src[y * w + x + 1]) || (y > 0 && src[(y - 1) * w + x]) || (y < h - 1 && src[(y + 1) * w + x])) this.d[y * w + x] = o;
    }
  }
  // ---- utilidades de color sobre píxeles existentes ----
  static rgbOf(v) { return [v & 255, (v >> 8) & 255, (v >> 16) & 255]; }
  static u32Of(r, g, b) { return ((255 << 24) | (P.clamp(b, 0, 255) << 16) | (P.clamp(g, 0, 255) << 8) | P.clamp(r, 0, 255)) >>> 0; }
  // tramado ordenado (Bayer 4x4) entre dos colores
  dith(x, y, c1, c2, t) { const B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]; this.px(x, y, t * 16 > B[(y & 3) * 4 + (x & 3)] + 0.5 ? c2 : c1); }
  // degradado vertical con tramado por varias paradas de color
  grad(x0, y0, w, h, cols) {
    for (let y = 0; y < h; y++) {
      const f = (y / Math.max(1, h - 1)) * (cols.length - 1), i = Math.min(cols.length - 2, Math.floor(f)), t = f - i;
      for (let x = 0; x < w; x++) this.dith(x0 + x, y0 + y, cols[i], cols[i + 1], t);
    }
  }
  // mezcla un color sobre el píxel existente
  blend(x, y, c, a) {
    x |= 0; y |= 0; if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const v = this.d[y * this.w + x]; if (!v) { if (a > 0.5) this.px(x, y, c); return; }
    const [r, g, b] = P.Painter.rgbOf(v), [R, G, B] = P.Col.rgb(c);
    this.d[y * this.w + x] = P.Painter.u32Of(r + (R - r) * a, g + (G - g) * a, b + (B - b) * a);
  }
  // volumen automático: bordes superiores más claros, inferiores más oscuros
  edges(up = 0.16, down = 0.2) {
    const src = this.d.slice(), w = this.w, h = this.h;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const v = src[y * w + x]; if (!v) continue;
      const top = y === 0 || !src[(y - 1) * w + x], bot = y === h - 1 || !src[(y + 1) * w + x];
      if (top === bot) continue;
      const [r, g, b] = P.Painter.rgbOf(v);
      this.d[y * w + x] = top ? P.Painter.u32Of(r + (255 - r) * up, g + (255 - g) * up, b + (255 - b) * up) : P.Painter.u32Of(r * (1 - down), g * (1 - down), b * (1 - down));
    }
  }
  // contorno de color: tono oscuro del píxel vecino (estilo pixel art moderno)
  outlineAuto(dark = 0.62, tint = '#1a0c2a') {
    const src = this.d.slice(), w = this.w, h = this.h, [tr, tg, tb] = P.Col.rgb(tint);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (src[y * w + x]) continue;
      const n = (x > 0 && src[y * w + x - 1]) || (x < w - 1 && src[y * w + x + 1]) || (y > 0 && src[(y - 1) * w + x]) || (y < h - 1 && src[(y + 1) * w + x]);
      if (!n) continue;
      const [r, g, b] = P.Painter.rgbOf(n);
      this.d[y * w + x] = P.Painter.u32Of(r * (1 - dark) + tr * dark * 0.6, g * (1 - dark) + tg * dark * 0.6, b * (1 - dark) + tb * dark * 0.6);
    }
  }
  canvas() {
    const c = document.createElement('canvas'); c.width = this.w; c.height = this.h;
    const x = c.getContext('2d'), id = x.createImageData(this.w, this.h);
    new Uint32Array(id.data.buffer).set(this.d); x.putImageData(id, 0, 0); return c;
  }
};

// ---------- registro de sprites ----------
P.S = {};
P.mk = function (name, w, h, n, fn, o = {}) {
  const frames = [];
  for (let i = 0; i < n; i++) {
    const p = new P.Painter(w, h); fn(p, i, n);
    if (o.outline !== false) {
      if (o.vol !== false) p.edges(o.up, o.down);
      if (!o.outline || o.outline === 'auto') p.outlineAuto(o.dark); else p.outline(o.outline);
    }
    frames.push(p.canvas());
  }
  P.S[name] = { w, h, f: frames, ff: [], wf: [], sf: {} };
  return P.S[name];
};
P.mkCanvas = function (name, canvases) { P.S[name] = { w: canvases[0].width, h: canvases[0].height, f: canvases, ff: [], wf: [], sf: {} }; };
P._flip = function (c) { const o = document.createElement('canvas'); o.width = c.width; o.height = c.height; const x = o.getContext('2d'); x.translate(c.width, 0); x.scale(-1, 1); x.drawImage(c, 0, 0); return o; };
P._tint = function (c, col) { const o = document.createElement('canvas'); o.width = c.width; o.height = c.height; const x = o.getContext('2d'); x.drawImage(c, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, c.width, c.height); return o; };
P.sprPrefix = '';
P.SP = function (name) { const k = P.sprPrefix && P.S[P.sprPrefix + name] ? P.sprPrefix + name : name; return P.S[k]; };
P.spr = function (ctx, name, frame, x, y, o = {}) {
  const s = P.SP(name); if (!s) return;
  const i = ((frame | 0) % s.f.length + s.f.length) % s.f.length;
  let c = s.f[i];
  if (o.sil) { const k = o.sil + i; c = s.sf[k] || (s.sf[k] = P._tint(s.f[i], o.sil)); if (o.flip) c = P._flip(c); }
  else if (o.flash) { c = s.wf[i] || (s.wf[i] = P._tint(s.f[i], '#ffffff')); if (o.flip) { c = s.wf['f' + i] || (s.wf['f' + i] = P._flip(c)); } }
  else if (o.flip) c = s.ff[i] || (s.ff[i] = P._flip(s.f[i]));
  if (o.alpha != null) ctx.globalAlpha = o.alpha;
  if (o.fit) { const sc = Math.min(o.fit / s.w, o.fit / s.h); const w = Math.max(1, Math.round(s.w * sc)), h = Math.max(1, Math.round(s.h * sc)); ctx.drawImage(c, Math.round(x + (o.fit - w) / 2), Math.round(y + (o.fit - h) / 2), w, h); }
  else if (o.scale) ctx.drawImage(c, Math.round(x), Math.round(y), s.w * o.scale, s.h * o.scale);
  else ctx.drawImage(c, Math.round(x), Math.round(y));
  if (o.alpha != null) ctx.globalAlpha = 1;
};

// Balanceo natural de vegetación: tres ondas de periodos distintos (nunca se repite igual) más un leve
// aleteo de hojas en la copa. La base queda fija; el desplazamiento crece con la altura.
P.wind = t => Math.sin(t * 0.017) * 0.55 + Math.sin(t * 0.0061 + 1.3) * 0.45;
P.drawSway = function (ctx, name, frame, x, y, o = {}) {
  const s = P.SP(name); if (!s) return;
  const i = ((frame | 0) % s.f.length + s.f.length) % s.f.length; let im = s.f[i];
  if (o.flip) im = s.ff[i] || (s.ff[i] = P._flip(s.f[i]));
  const t = o.t || 0, ph = o.ph || 0, amp = o.amp == null ? 2 : o.amp, H = s.h, base = o.base || H, step = o.step || 2, fl = o.flutter || 0;
  if (!amp && !fl) { ctx.drawImage(im, Math.round(x), Math.round(y)); return; }
  const wave = P.wind(t + ph * 40) * 0.7 + Math.sin(t * 0.043 + ph * 1.9) * 0.3;
  const X = Math.round(x), Y = Math.round(y);
  for (let yy = 0; yy < H; yy += step) {
    const k = Math.max(0, (base - yy) / base), h = Math.min(step, H - yy);
    const off = Math.round(amp * k * k * wave + (fl ? Math.sin(t * 0.11 + yy * 0.37 + ph) * fl * k * k : 0));
    ctx.drawImage(im, 0, yy, s.w, h, X + off, Y + yy, s.w, h);
  }
};

// ---------- brillo y luz ----------
P.glowCache = {};
P.glow = function (col, r) {
  const k = col + r; if (P.glowCache[k]) return P.glowCache[k];
  const c = document.createElement('canvas'); c.width = c.height = r * 2; const x = c.getContext('2d');
  const g = x.createRadialGradient(r, r, 0, r, r, r); g.addColorStop(0, P.Col.rgba(col, 0.9)); g.addColorStop(0.35, P.Col.rgba(col, 0.35)); g.addColorStop(1, P.Col.rgba(col, 0));
  x.fillStyle = g; x.fillRect(0, 0, r * 2, r * 2); P.glowCache[k] = c; return c;
};
P.drawGlow = function (ctx, x, y, r, col, a = 1) {
  const g = P.glow(col, Math.max(2, Math.round(r)));
  ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a;
  ctx.drawImage(g, Math.round(x - r), Math.round(y - r));
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
};
P.Light = {
  c: null, x: null, mask: null,
  init() {
    this.c = document.createElement('canvas'); this.c.width = P.W; this.c.height = P.H; this.x = this.c.getContext('2d');
    const m = document.createElement('canvas'); m.width = m.height = 128; const mx = m.getContext('2d');
    const g = mx.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.5, 'rgba(255,255,255,0.7)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    mx.fillStyle = g; mx.fillRect(0, 0, 128, 128); this.mask = m;
  },
  begin(ambient) { const x = this.x; x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1; x.clearRect(0, 0, P.W, P.H); x.fillStyle = ambient; x.fillRect(0, 0, P.W, P.H); x.globalCompositeOperation = 'destination-out'; },
  add(px, py, r, a = 1) { if (px < -r || py < -r || px > P.W + r || py > P.H + r) return; this.x.globalAlpha = P.clamp(a, 0, 1); this.x.drawImage(this.mask, px - r, py - r, r * 2, r * 2); },
  end(ctx) { this.x.globalAlpha = 1; this.x.globalCompositeOperation = 'source-over'; ctx.drawImage(this.c, 0, 0); }
};

// ---------- partículas ----------
P.Particles = class {
  constructor() { this.a = []; }
  add(o) {
    const p = Object.assign({ x: 0, y: 0, vx: 0, vy: 0, life: 30, col: '#fff', size: 1, g: 0, drag: 1, glow: 0, shrink: false, fade: true }, o);
    p.max = p.life; this.a.push(p); if (this.a.length > 900) this.a.shift(); return p;
  }
  burst(x, y, n, o) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, s = P.rand(o.smin || 0.5, o.smax || 2.5); this.add(Object.assign({}, o, { x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - (o.up || 0), life: P.ri(o.lmin || 15, o.lmax || 35) })); } }
  update() {
    for (const p of this.a) { p.vy += p.g; p.vx *= p.drag; p.vy *= p.drag; p.x += p.vx; p.y += p.vy; p.life--; if (p.fn) p.fn(p); }
    this.a = this.a.filter(p => p.life > 0);
  }
  draw(ctx, cx, cy) {
    for (const p of this.a) {
      const t = p.life / p.max, s = p.shrink ? Math.max(1, Math.round(p.size * t)) : p.size;
      const x = Math.round(p.x - cx), y = Math.round(p.y - cy);
      if (x < -20 || y < -20 || x > P.W + 20 || y > P.H + 20) continue;
      ctx.globalAlpha = p.fade ? Math.min(1, t * 1.5) : 1;
      ctx.fillStyle = p.col; ctx.fillRect(x - (s >> 1), y - (s >> 1), s, s);
      if (p.glow) { ctx.globalAlpha = 1; P.drawGlow(ctx, x, y, p.glow, p.col, 0.5 * t); }
    }
    ctx.globalAlpha = 1;
  }
};

// ---------- interfaz ----------
P.UIC = { cyan: '#5ee8ff', gold: '#ffd166', red: '#ff5a6a', green: '#7dffa0', dim: '#7c8aa8', text: '#e8f4ff', pink: '#ff8ad8', violet: '#b48cff', panel: 'rgba(7,14,30,0.9)' };
P.panel = function (c, x, y, w, h, o = {}) {
  x = Math.round(x); y = Math.round(y);
  const b = o.border || P.UIC.cyan, cut = o.cut != null ? o.cut : 4;
  c.fillStyle = o.fill || P.UIC.panel;
  c.beginPath(); c.moveTo(x + cut, y); c.lineTo(x + w, y); c.lineTo(x + w, y + h - cut); c.lineTo(x + w - cut, y + h); c.lineTo(x, y + h); c.lineTo(x, y + cut); c.closePath(); c.fill();
  c.fillStyle = b;
  c.fillRect(x + cut, y, w - cut, 1); c.fillRect(x, y + h - 1, w - cut, 1); c.fillRect(x, y + cut, 1, h - cut); c.fillRect(x + w - 1, y, 1, h - cut);
  for (let i = 0; i < cut; i++) { c.fillRect(x + cut - 1 - i, y + i, 1, 1); c.fillRect(x + w - cut + i, y + h - 1 - i, 1, 1); }
  if (!o.noAccent) { c.globalAlpha = 0.5; c.fillRect(x + 2, y + 2, Math.min(14, w / 4), 1); c.fillRect(x + w - 2 - Math.min(14, w / 4), y + h - 3, Math.min(14, w / 4), 1); c.globalAlpha = 1; }
};
P.bar = function (c, x, y, w, h, f, col, o = {}) {
  f = P.clamp(f, 0, 1);
  c.fillStyle = o.bg || 'rgba(0,0,0,0.6)'; c.fillRect(x, y, w, h);
  if (o.ghost != null) { c.fillStyle = '#ffffff'; c.globalAlpha = 0.5; c.fillRect(x + 1, y + 1, Math.round((w - 2) * P.clamp(o.ghost, 0, 1)), h - 2); c.globalAlpha = 1; }
  c.fillStyle = col; c.fillRect(x + 1, y + 1, Math.round((w - 2) * f), h - 2);
  c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(x + 1, y + 1, Math.round((w - 2) * f), 1);
  if (o.border) { c.strokeStyle = o.border; c.lineWidth = 1; c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); }
  if (o.ticks) { c.fillStyle = 'rgba(0,0,0,0.45)'; for (let i = 1; i < o.ticks; i++) c.fillRect(x + Math.round(w * i / o.ticks), y + 1, 1, h - 2); }
};
P.scanlines = function (c, x, y, w, h, a = 0.12) { c.fillStyle = `rgba(0,0,0,${a})`; for (let j = y; j < y + h; j += 2) c.fillRect(x, j, w, 1); };
P.keyHint = function (c, x, y, action, label, col = P.UIC.dim) {
  const k = P.input.gpActive ? ({ jump: 'A', attack: 'X', dash: 'B', interact: 'Y', defend: 'LB', super: 'RT', swap: 'RB', pause: 'START', confirm: 'A', back: 'B' }[action] || '?') : (P.Touch && P.Touch.on) ? ({ jump: 'A', attack: 'X', dash: 'B', interact: 'Y', defend: 'DEFENSA', super: 'SÚPER', swap: 'ARMA', pause: 'II', confirm: 'A', back: 'B' }[action] || P.input.label(action)) : (P.input.label(action));
  const w = P.txtW(k) + 6;
  c.fillStyle = 'rgba(255,255,255,0.12)'; c.fillRect(x, y - 2, w, 11); c.fillStyle = col; c.fillRect(x, y + 8, w, 1);
  P.txt(c, k, x + 3, y, '#ffffff');
  return w + 4 + P.txt(c, label, x + w + 4, y, col) + 8;
};

P.Gfx = {
  build() {
    P.Light.init();
    P.Sprites.buildChars();
    P.Sprites.buildWorld();
  }
};
P.Sprites = {};
