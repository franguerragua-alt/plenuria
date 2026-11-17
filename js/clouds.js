'use strict';
// Nubes de pixel art con volumen: bocanadas irregulares (base, cúmulos superiores y jirones), sombreado por luz,
// borde iluminado y bordes tramados que se deshilachan. Sustituye a las nubes hechas con filas de elipses.
//   P.paintCloud(p, cx, by, w, h, C, r, o) · p = Painter · (cx, by) = centro de la base · C = tonos de claro a oscuro
//   o.lit: 'top' (sol arriba) | 'bottom' (luz de lava desde abajo) · o.rim: color del borde iluminado · o.flat: base plana
P.BAYER4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
P.paintCloud = function (p, cx, by, w, h, C, r, o = {}) {
  const lit = o.lit || 'top', B = P.BAYER4, pf = [], flat = o.flat !== false;
  const n = Math.max(3, Math.round(w / Math.max(6, h * 0.8)));
  // fila base: más alta en el centro, irregular
  for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, env = Math.pow(Math.sin(t * Math.PI), 0.6), rr = Math.max(2.5, h * (0.3 + 0.45 * env) * r.range(0.8, 1.15)); pf.push({ x: cx - w / 2 + t * w + r.range(-2, 2), y: by - rr * 0.7, r: rr }); }
  // cúmulos superiores
  const m = Math.max(1, Math.round(n * 0.6));
  for (let i = 0; i < m; i++) { const t = r.range(0.18, 0.82), env = Math.sin(t * Math.PI), rr = Math.max(2.5, h * (0.25 + 0.4 * env) * r.range(0.75, 1.2)); pf.push({ x: cx - w / 2 + t * w, y: by - h * 0.45 - env * h * 0.35 + r.range(-2, 2), r: rr }); }
  // torres altas en las nubes grandes
  if (h > 12) for (let i = 0; i < 3; i++) { const t = r.range(0.3, 0.7); pf.push({ x: cx - w / 2 + t * w + r.range(-4, 4), y: by - h * 0.85 + r.range(-2, 3), r: h * r.range(0.18, 0.3) }); }
  // jirones sueltos en los extremos
  for (let i = 0; i < 2; i++) { const sd = i ? 1 : -1; pf.push({ x: cx + sd * (w / 2 + r.range(-h * 0.1, h * 0.12)), y: by - r.range(1, h * 0.2), r: Math.max(2.5, h * r.range(0.16, 0.24)) }); }
  const x0 = Math.floor(cx - w / 2 - h), x1 = Math.ceil(cx + w / 2 + h), y0 = Math.floor(by - h * 1.8), y1 = Math.ceil(by + (flat ? 1 : h * 0.6));
  const W = x1 - x0 + 1, H = y1 - y0 + 1, val = new Float32Array(W * H), lt = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const X = x0 + x, Y = y0 + y; let best = 0, bq = null;
    for (const q of pf) { const v = 1 - ((X - q.x) ** 2 + (Y - q.y) ** 2) / (q.r * q.r); if (v > best) { best = v; bq = q; } }
    if (!bq) continue;
    if (flat && Y > by + Math.round(Math.sin(X * 0.6 + bq.x) * 0.8)) continue;
    const ny = (Y - bq.y) / bq.r, nx = (X - bq.x) / bq.r;
    val[y * W + x] = best;
    // relieve local de cada bocanada (suave); el degradado general se suma después por columnas
    lt[y * W + x] = lit === 'bottom' ? 0.5 + ny * 0.5 : 0.5 - ny * 0.5 - nx * 0.3;
  }
  // degradado continuo por columna (de la cima a la base de la nube): evita costuras entre bocanadas
  const top = new Int16Array(W).fill(-1), bot = new Int16Array(W).fill(-1);
  for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) if (val[y * W + x] > 0) { if (top[x] < 0) top[x] = y; bot[x] = y; }
  const k = C.length;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const v = val[y * W + x]; if (v <= 0) continue;
    const X = x0 + x, Y = y0 + y, b = B[Y & 3][X & 3] / 16;
    if (v < 0.14 && b > v / 0.14) continue; // borde tramado
    const cv = (y - top[x]) / Math.max(4, bot[x] - top[x]);
    let s = lit === 'bottom' ? 0.72 * Math.pow(cv, 1.25) + 0.28 * lt[y * W + x] : 0.7 * (1 - cv) + 0.3 * lt[y * W + x];
    s += (b - 0.5) * 0.2; s = Math.max(0, Math.min(0.999, s));
    let col = C[k - 1 - Math.floor(s * k)];
    const up = y > 0 ? val[(y - 1) * W + x] : 0, dn = y < H - 1 ? val[(y + 1) * W + x] : 0;
    if (lit === 'top' && up <= 0 && s > 0.3) col = o.rim || C[0];
    if (lit === 'bottom' && dn <= 0 && o.rim) col = o.rim;
    p.px(X, Y, col);
  }
};
// banco de estratos: nubes bajas y alargadas con bordes deshilachados (en vez de tiras rectas)
P.paintStratus = function (p, cx, by, w, C, r, o = {}) {
  const n = Math.max(2, Math.round(w / 45));
  for (let i = 0; i < n; i++) P.paintCloud(p, cx - w / 2 + (i + 0.5) * w / n + r.range(-5, 5), by + r.range(-2, 2), w / n * r.range(1.1, 1.4), r.range(5, 8), C, r, o);
};
// lienzo auxiliar para pintar nubes sobre un contexto 2D
P.cloudLayer = function (fn) { const p = new P.Painter(P.W, P.H); fn(p); return p.canvas(); };
