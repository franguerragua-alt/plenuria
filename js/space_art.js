'use strict';
// Arte espacial: planetas procedurales de los 9 mundos, panorama con nebulosas, Esfera de Dyson y la nave Vigía del Alba
P.Space = {
  cache: {},
  // ---------- ruido 3D (valor) y fbm ----------
  h3(x, y, z, s) { let h = (x * 374761393 + y * 668265263 + z * 2147483647 + s * 1442695041) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; },
  n3(x, y, z, s) {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf), H = this.h3.bind(this);
    const l = (a, b, t) => a + (b - a) * t;
    return l(l(l(H(xi, yi, zi, s), H(xi + 1, yi, zi, s), u), l(H(xi, yi + 1, zi, s), H(xi + 1, yi + 1, zi, s), u), v),
      l(l(H(xi, yi, zi + 1, s), H(xi + 1, yi, zi + 1, s), u), l(H(xi, yi + 1, zi + 1, s), H(xi + 1, yi + 1, zi + 1, s), u), v), w);
  },
  fbm(x, y, z, s, oct = 4) { let a = 0.5, f = 1, t = 0, n = 0; for (let i = 0; i < oct; i++) { t += a * this.n3(x * f, y * f, z * f, s + i * 17); n += a; a *= 0.5; f *= 2.03; } return t / n; },
  BAYER: [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5],

  // ---------- estilos de superficie por planeta ----------
  // devuelve [r,g,b] para un punto (x,y,z) de la esfera unitaria
  surface(id, x, y, z, lib) {
    const F = (k, s, o) => this.fbm(x * k + 11, y * k + 7, z * k + 3, s, o), C = h => P.Col.rgb(h).slice();
    const pick = (cols, t) => C(cols[Math.max(0, Math.min(cols.length - 1, Math.floor(t * cols.length)))]);
    switch (id) {
      case 'verzara': {
        const land = F(1.4, 1), tox = F(2.2, 9), cl = F(2.4, 21, 3);
        if (cl > 0.62) return C(cl > 0.7 ? '#ffffff' : '#d8f0ff');
        if (land < 0.46) return pick(['#0a5a6a', '#127a80', '#1aa098'], land / 0.46);
        if (tox > 0.58 - lib * 0.25 && tox < 0.9 - lib * 0.4) return pick(['#5a1a7a', '#9a34b8', '#d860d8'], (tox - 0.55) * 3);
        return pick(['#0e5a24', '#1f8a2e', '#3ab83a', '#7ae04a'], (land - 0.46) * 2.4);
      }
      case 'khazir': {
        const n = F(2, 3), b = Math.sin(y * 9 + n * 5);
        if (F(3, 22, 3) > 0.68) return C('#fff0d8');
        if (Math.abs(n - 0.5) < 0.018) return C('#6a3010');
        return pick(['#b0601a', '#d88a2a', '#f0b050', '#ffd890'], (b * 0.5 + 0.5) * 0.7 + n * 0.3);
      }
      case 'nivorah': {
        const n = F(2.4, 4);
        if (Math.abs(n - 0.5) < 0.015) return C('#4ae0ff');
        if (Math.abs(y) > 0.8) return C('#ffffff');
        return pick(['#6a8ad0', '#a8c8f0', '#d8ecff', '#ffffff'], n);
      }
      case 'thalassyr': {
        const n = F(2, 5), sw = F(4, 25, 3);
        if (sw > 0.66) return C(sw > 0.72 ? '#ffffff' : '#c8f0ff');
        if (n > 0.66) return pick(['#2fb83a', '#e8d8a0'], (n - 0.66) * 3);
        return pick(['#06205a', '#0a3a8a', '#1a6ac0', '#3aa8e0', '#6ae0f0'], n * 1.3);
      }
      case 'umbrelia': {
        const n = F(2.6, 6);
        if (Math.abs(n - 0.5) < 0.03) return C(Math.abs(n - 0.5) < 0.012 ? '#ff6a5a' : '#c0283a');
        return pick(['#0e0812', '#1e1020', '#2e1a30', '#4a2440'], n);
      }
      case 'mykoris': {
        const n = F(2, 7), sp = F(7, 27, 2);
        if (sp > 0.68) return C(sp > 0.74 ? '#9afcff' : '#3ae0c0');
        return pick(['#3a1a6a', '#6a2aa8', '#a04ae0', '#d070f0'], n);
      }
      case 'xertha': {
        const n = F(2, 8), u = Math.atan2(x, z) * 6, v = y * 8, hx = Math.abs(((u + (Math.floor(v) % 2) * 0.5) % 1 + 1) % 1 - 0.5), hy = Math.abs(((v % 1) + 1) % 1 - 0.5);
        if (hx < 0.06 || hy < 0.06) return C('#7a4a08');
        return pick(['#c88a10', '#e8b020', '#ffd050', '#fff0a0'], n);
      }
      case 'ignaria': {
        const n = F(2.8, 10);
        if (Math.abs(n - 0.5) < 0.035) return C(Math.abs(n - 0.5) < 0.014 ? '#ffe070' : '#ff6a1a');
        return pick(['#1a0a08', '#2e1410', '#4a2016', '#6a2a1a'], n);
      }
      case 'aerthyon': {
        const n = F(2.2, 11), b = Math.sin(y * 7 + n * 6);
        if (F(5, 31, 2) > 0.74) return C('#ffffff');
        if (n < 0.34) return C('#2a3a7a');
        return pick(['#5a7ac0', '#8ab4e8', '#c0e0ff', '#ffffff'], b * 0.5 + 0.5);
      }
    }
    return [128, 128, 128];
  },
  ATMO: { verzara: '#7af0c0', khazir: '#ffc070', nivorah: '#c0f0ff', thalassyr: '#6ad8ff', umbrelia: '#c0283a', mykoris: '#d070ff', xertha: '#ffe080', ignaria: '#ff7a3a', aerthyon: '#d0e8ff' },
  NIGHT: { verzara: '#7afcff', ignaria: '#ff8a3a', umbrelia: '#ff3a4a', mykoris: '#9afcff', xertha: '#ffd050' },
  RINGS: { xertha: ['#ffd166', '#a06a10'], khazir: ['#e8c890', '#8a6a40'], aerthyon: ['#bfe8ff', '#5a7ab0'] },

  // planeta pixel art sombreado, con atmósfera, lado nocturno y anillos opcionales
  planet(id, R, lib = 0) {
    const key = id + R + '_' + Math.round(lib * 10);
    if (this.cache[key]) return this.cache[key];
    const pad = Math.ceil(R * 0.9) + 4, S = R * 2 + pad * 2, c = document.createElement('canvas'); c.width = c.height = S;
    const x = c.getContext('2d'), cx = S / 2, cy = S / 2, atmo = this.ATMO[id] || '#ffffff';
    // halo atmosférico
    const g = x.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.35); g.addColorStop(0, P.Col.rgba(atmo, 0.55)); g.addColorStop(1, P.Col.rgba(atmo, 0));
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    const ring = this.RINGS[id];
    const drawRing = (front) => {
      if (!ring) return;
      x.save(); x.translate(cx, cy); x.rotate(-0.35);
      for (let i = 0; i < 3; i++) { x.strokeStyle = i === 1 ? ring[0] : ring[1]; x.globalAlpha = i === 1 ? 0.9 : 0.6; x.lineWidth = Math.max(1, R * 0.08); x.beginPath(); x.ellipse(0, 0, R * (1.5 + i * 0.13), R * (0.32 + i * 0.03), 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2); x.stroke(); }
      x.restore(); x.globalAlpha = 1;
    };
    drawRing(false);
    const p = new P.Painter(S, S), L = [-0.62, -0.55, 0.56], night = this.NIGHT[id];
    for (let py = -R; py <= R; py++) for (let px = -R; px <= R; px++) {
      const dx = (px + 0.5) / R, dy = (py + 0.5) / R, d2 = dx * dx + dy * dy; if (d2 > 1) continue;
      const dz = Math.sqrt(1 - d2);
      let [r, gg, b] = this.surface(id, dx * 0.95 + dz * 0.3, dy, dz * 0.95 - dx * 0.3, lib);
      const l = dx * L[0] + dy * L[1] + dz * L[2];
      const th = this.BAYER[((py + R) & 3) * 4 + ((px + R) & 3)] / 16;
      let k = l > 0.55 ? 1.12 : l > 0.25 ? 1 : l > 0.02 + th * 0.12 ? 0.72 : l > -0.18 + th * 0.1 ? 0.42 : 0.2;
      r *= k; gg *= k; b *= k;
      if (k <= 0.2 && night && this.h3(px, py, 0, 7) > 0.93) [r, gg, b] = P.Col.rgb(night);
      // borde atmosférico
      if (d2 > 0.86) { const [ar, ag, ab] = P.Col.rgb(atmo), t = (d2 - 0.86) / 0.14 * (l > -0.1 ? 0.6 : 0.25); r += (ar - r) * t; gg += (ag - gg) * t; b += (ab - b) * t; }
      p.d[(cy + py) * S + (cx + px)] = P.Painter.u32Of(r, gg, b);
    }
    x.drawImage(p.canvas(), 0, 0);
    drawRing(true);
    this.cache[key] = c; return c;
  },
  drawPlanet(c, id, x, y, R, lib) { const im = this.planet(id, R, lib); c.drawImage(im, Math.round(x - im.width / 2), Math.round(y - im.height / 2)); },

  // estrella Plenuria encerrada en la Esfera de Dyson
  dyson(R) {
    const key = 'dyson' + R; if (this.cache[key]) return this.cache[key];
    const S = R * 6, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d'), m = S / 2;
    let g = x.createRadialGradient(m, m, R * 0.4, m, m, S / 2); g.addColorStop(0, 'rgba(255,230,160,0.9)'); g.addColorStop(0.25, 'rgba(255,170,80,0.35)'); g.addColorStop(1, 'rgba(255,120,60,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    x.fillStyle = '#fff6d0'; x.beginPath(); x.arc(m, m, R * 0.75, 0, 7); x.fill(); x.fillStyle = '#ffffff'; x.beginPath(); x.arc(m - R * 0.15, m - R * 0.15, R * 0.45, 0, 7); x.fill();
    // celosía de la esfera
    x.lineWidth = Math.max(1, R * 0.09);
    for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI; x.strokeStyle = i % 2 ? '#3a2a5a' : '#5a3a7a'; x.beginPath(); x.ellipse(m, m, R, R * Math.abs(Math.cos(a)) + 0.5, 0, 0, 7); x.stroke(); }
    for (let i = -2; i <= 2; i++) { const yy = m + i * R * 0.38, w = Math.sqrt(Math.max(0, R * R - (yy - m) ** 2)); x.strokeStyle = '#4a3468'; x.beginPath(); x.moveTo(m - w, yy); x.lineTo(m + w, yy); x.stroke(); }
    x.strokeStyle = '#7a5aa0'; x.beginPath(); x.arc(m, m, R, 0, 7); x.stroke();
    // paneles colectores con brillo
    for (let i = 0; i < 10; i++) { const a = i * 0.63, rr = R * 0.82; x.fillStyle = i % 2 ? '#ff5af0' : '#5ae8ff'; x.fillRect(Math.round(m + Math.cos(a) * rr), Math.round(m + Math.sin(a) * rr * 0.9), 2, 2); }
    this.cache[key] = c; return c;
  },

  // panorama espacial con nebulosas (fondo de las ventanas de la nave)
  panorama() {
    if (this.cache.pano) return this.cache.pano;
    const W = 1024, H = 270, p = new P.Painter(W, H), r = P.RNG(808);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const a = Math.cos(x / W * Math.PI * 2) * 1.6, b = Math.sin(x / W * Math.PI * 2) * 1.6;
      const n = this.fbm(a + 3, y / 90, b, 3, 4), m = this.fbm(a * 1.3, y / 70 + 5, b * 1.3, 9, 3);
      let R0 = 6 + y * 0.02, G0 = 6, B0 = 20 + y * 0.03;
      const t1 = Math.max(0, n - 0.48) * 3.2, t2 = Math.max(0, m - 0.52) * 3.2;
      const th = this.BAYER[(y & 3) * 4 + (x & 3)] / 16 * 0.18;
      const q1 = Math.floor((t1 + th) * 4) / 4, q2 = Math.floor((t2 + th) * 4) / 4;
      R0 += q1 * 150 + q2 * 20; G0 += q1 * 30 + q2 * 110; B0 += q1 * 130 + q2 * 150;
      p.d[y * W + x] = P.Painter.u32Of(R0, G0, B0);
    }
    for (let i = 0; i < 900; i++) { const x = r.int(0, W - 1), y = r.int(0, H - 1); p.px(x, y, r() < 0.1 ? '#bff6ff' : r() < 0.2 ? '#ffe0b0' : r() < 0.6 ? '#8890b8' : '#d8dcf0'); }
    for (let i = 0; i < 40; i++) { const x = r.int(2, W - 3), y = r.int(2, H - 3), c = r.pick(['#ffffff', '#bff6ff', '#ffd8f0']); p.px(x, y, '#ffffff'); p.px(x - 1, y, c); p.px(x + 1, y, c); p.px(x, y - 1, c); p.px(x, y + 1, c); if (r() < 0.4) { p.px(x - 2, y, '#5a6088'); p.px(x + 2, y, '#5a6088'); } }
    // galaxia espiral lejana
    for (let i = 0; i < 400; i++) { const a = i * 0.05, rr = i * 0.06; for (const s of [0, Math.PI]) p.px(760 + Math.cos(a + s) * rr * 1.6, 60 + Math.sin(a + s) * rr * 0.6, i < 80 ? '#fff0d0' : '#c8a0e0'); }
    const c = p.canvas();
    this.cache.pano = c; return c;
  }
};

// ================= EXTERIOR DE LA NAVE «VIGÍA DEL ALBA» =================
// Nave de exploración con anillo solar, cúpula de mando, alas de vela y tres motores. Coordenadas base 192x88.
P.Sprites.shipSide = function (p, W, H, f = 0) {
  const sx = W / 192, sy = H / 88, X = v => v * sx, Y = v => v * sy, R = v => v * Math.min(sx, sy);
  const HULL = ['#4a5478', '#9aa6c8', '#dce4f4', '#ffffff'], RED = ['#7a0a24', '#d41e3c', '#ff6a6a'], GOLD = ['#8a5a0a', '#e8a020', '#ffd166', '#fff4c0'], GL = ['#0a2a4a', '#1a7ac0', '#6ae0ff', '#e0ffff'];
  // anillo solar (mitad trasera)
  for (let a = Math.PI * 0.5; a <= Math.PI * 1.5; a += 0.02) p.thick(X(96 + Math.cos(a) * 9), Y(44 + Math.sin(a) * 40), X(96 + Math.cos(a) * 9), Y(44 + Math.sin(a) * 40), Math.max(1, R(4)), GOLD[0]);
  // vela dorsal y ventral
  p.tri(X(64), Y(30), X(110), Y(30), X(52), Y(4), RED[1]); p.tri(X(70), Y(30), X(104), Y(30), X(60), Y(9), RED[2]); p.line(X(56), Y(8), X(100), Y(29), '#ffffff');
  p.tri(X(70), Y(58), X(106), Y(58), X(58), Y(82), HULL[0]); p.tri(X(76), Y(58), X(100), Y(58), X(66), Y(76), HULL[1]);
  // góndolas de motor
  for (const [ey, s] of [[30, 1], [58, 1], [44, 1.2]]) { p.sell(X(30), Y(ey), R(16 * s), R(6 * s), ['#2e3654', '#5a6488', '#9aa6c8', '#e0e8f8']); p.rect(X(10), Y(ey - 4 * s), Math.max(1, X(8)), Math.max(1, Y(8 * s)), '#1a2034'); p.ell(X(11), Y(ey), R(2.5 * s), R(3.5 * s), f ? '#bff6ff' : '#6ae0ff'); }
  // casco principal
  p.sell(X(98), Y(44), X(76), Y(15), HULL);
  p.tri(X(150), Y(31), X(190), Y(44), X(150), Y(57), HULL[1]); p.tri(X(158), Y(36), X(190), Y(44), X(158), Y(44), HULL[2]);
  p.ell(X(120), Y(54), X(40), Y(5), HULL[0]); for (let i = 0; i < 6; i++) p.rect(X(92 + i * 10), Y(53), Math.max(1, X(6)), Math.max(1, Y(3)), '#2e3654');
  // franja roja de la República y líneas de panel
  p.rect(X(40), Y(41), X(132), Math.max(1, Y(3)), RED[1]); p.rect(X(40), Y(41), X(132), Math.max(1, Y(1)), RED[2]);
  for (let i = 0; i < 9; i++) p.line(X(48 + i * 14), Y(33), X(46 + i * 14), Y(55), HULL[1]);
  // ventanillas
  for (let i = 0; i < 9; i++) { p.rect(X(58 + i * 10), Y(36), Math.max(1, X(4)), Math.max(1, Y(3)), GL[2]); p.px(X(58 + i * 10), Y(36), GL[3]); }
  // cúpula de mando
  p.sell(X(150), Y(36), X(18), Y(9), GL); p.line(X(140), Y(31), X(156), Y(30), GL[3]); p.ell(X(150), Y(39), X(16), Y(2), GL[0]);
  // emblema de las cinco civilizaciones
  for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 - 1.57; p.ell(X(120 + Math.cos(a) * 4), Y(47 + Math.sin(a) * 4), R(1.4), R(1.4), ['#3ae890', '#5aa4ff', '#46c24a', '#7a5ad8', '#3ae0d0'][i]); }
  p.ell(X(120), Y(47), R(1.6), R(1.6), GOLD[2]);
  // antenas de proa
  p.line(X(176), Y(40), X(192), Y(30), HULL[2]); p.line(X(170), Y(50), X(186), Y(60), HULL[1]); p.px(X(191), Y(30), '#ff3a5a');
  // anillo solar (mitad delantera) con nodos de energía
  for (let a = -Math.PI * 0.5; a <= Math.PI * 0.5; a += 0.02) p.thick(X(96 + Math.cos(a) * 9), Y(44 + Math.sin(a) * 40), X(96 + Math.cos(a) * 9), Y(44 + Math.sin(a) * 40), Math.max(1, R(4)), GOLD[1]);
  for (let a = -Math.PI * 0.45; a <= Math.PI * 0.45; a += 0.04) p.px(X(96 + Math.cos(a) * 9) - 1, Y(44 + Math.sin(a) * 40), GOLD[3]);
  for (const a of [-1.2, -0.6, 0.6, 1.2]) p.ell(X(96 + Math.cos(a) * 9), Y(44 + Math.sin(a) * 40), R(2), R(2), f ? '#ffffff' : '#5ae8ff');
};
