'use strict';
// SHADERS — capa de postproceso WebGL y materiales de energía.
// · P.GLFX: se ejecuta sobre el búfer de 480x270 justo antes de copiarlo a pantalla, a la resolución original (el escalado
//   final sigue siendo «vecino más cercano», así que los píxeles no se emborronan). Efectos: bloom por umbral, luces de
//   color dinámicas (proyectiles, explosiones, estructuras, jefes), ondas de distorsión ajustadas al píxel, aberración
//   cromática breve en golpes fuertes, niebla volumétrica por planeta y un retoque de color suave. Sin WebGL o con la
//   calidad «Baja» se usa el sistema 2D de siempre.
// · P.Energy: materiales de energía animados (electricidad, plasma, fuego, hielo, escudo, portal, láser, energía oscura,
//   energía cósmica, reactor) dibujados en 2D con píxeles nítidos.
P.GLFX = {
  ok: false, gl: null, lights: [], waves: [], chroma: 0, bloom: 0.6, fogCol: [0, 0, 0], fogK: 0, mask: 0, flash: 0, flashCol: [1, 1, 1],
  level() { return P.settings.gfx == null ? 2 : P.settings.gfx; },
  on() { return this.level() > 0 && this.init(); },
  init() {
    if (this.ok) return true; if (this.failed) return false;
    try {
      const cv = document.createElement('canvas'); cv.width = P.W; cv.height = P.H;
      const gl = cv.getContext('webgl', { premultipliedAlpha: false, preserveDrawingBuffer: true, antialias: false }); if (!gl) throw new Error('sin WebGL');
      this.cv = cv; this.gl = gl;
      const VS = 'attribute vec2 a;varying vec2 v;void main(){v=a*0.5+0.5;gl_Position=vec4(a,0.,1.);}';
      const BRIGHT = 'precision mediump float;uniform sampler2D t;uniform vec2 px;uniform float th;varying vec2 v;vec3 s(vec2 o){vec3 c=texture2D(t,v+o*px).rgb;float l=dot(c,vec3(.299,.587,.114));return c*smoothstep(th,th+.22,l);}void main(){gl_FragColor=vec4((s(vec2(-.5,-.5))+s(vec2(.5,-.5))+s(vec2(-.5,.5))+s(vec2(.5,.5)))*.25,1.);}';
      const BLUR = 'precision mediump float;uniform sampler2D t;uniform vec2 d;varying vec2 v;void main(){vec3 c=texture2D(t,v).rgb*.227;c+=(texture2D(t,v+d).rgb+texture2D(t,v-d).rgb)*.194;c+=(texture2D(t,v+d*2.).rgb+texture2D(t,v-d*2.).rgb)*.121;c+=(texture2D(t,v+d*3.).rgb+texture2D(t,v-d*3.).rgb)*.054;c+=(texture2D(t,v+d*4.).rgb+texture2D(t,v-d*4.).rgb)*.016;gl_FragColor=vec4(c,1.);}';
      const FINAL = [
        'precision mediump float;uniform sampler2D t;uniform sampler2D b;uniform vec2 res;uniform float tm;uniform float bk;uniform vec4 wv[4];uniform float chroma;',
        'uniform vec4 L[24];uniform vec3 LC[24];uniform int nL;uniform vec3 fogC;uniform float fogK;uniform vec4 hud0;uniform vec4 hud1;uniform float flash;uniform vec3 flashC;varying vec2 v;',
        'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
        'bool inR(vec2 p,vec4 r){return p.x>=r.x&&p.y>=r.y&&p.x<r.x+r.z&&p.y<r.y+r.w;}',
        'void main(){vec2 sp=vec2(v.x*res.x,(1.-v.y)*res.y);float m=(inR(sp,hud0)||inR(sp,hud1))?0.:1.;vec2 off=vec2(0.);',
        'for(int i=0;i<4;i++){vec4 w=wv[i];if(w.w>0.){vec2 d=sp-w.xy;float ds=length(d);float ring=smoothstep(w.z-14.,w.z,ds)*(1.-smoothstep(w.z,w.z+14.,ds));off+=(ds>.5?d/ds:vec2(0.))*ring*w.w*5.;}}',
        'off=floor(off*m+.5);vec2 q=sp+off;vec2 uv=vec2(q.x/res.x,1.-q.y/res.y);vec2 cs=vec2(floor(chroma*m+.5)/res.x,0.);',
        'vec3 c=vec3(texture2D(t,uv+cs).r,texture2D(t,uv).g,texture2D(t,uv-cs).b);float lu=dot(c,vec3(.299,.587,.114));',
        'vec3 add=vec3(0.);for(int i=0;i<24;i++){if(i>=nL)break;vec4 l=L[i];float ds=distance(sp,l.xy);float a=l.w*pow(max(0.,1.-ds/l.z),2.);add+=LC[i]*a;}',
        'c+=(c*add*1.15+add*.10)*m;',
        'if(fogK>0.){float f=n(sp*.012+vec2(tm*.012,tm*.004))*.6+n(sp*.03-vec2(tm*.02,0.))*.4;f*=fogK*(.25+.75*sp.y/res.y);c=mix(c,fogC*(.4+.6*lu),clamp(f*(.3+.7*lu),0.,.16)*m);}',
        'c+=texture2D(b,v).rgb*bk;c=mix(vec3(lu),c,1.06);c=mix(c,flashC,flash*m);gl_FragColor=vec4(c,1.);}'
      ].join('\n');
      const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
      const prog = fs => { const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); for (let i = 0; i < n; i++) { const nm = gl.getActiveUniform(p, i).name.replace('[0]', ''); u[nm] = gl.getUniformLocation(p, nm); } return { p, u }; };
      this.pB = prog(BRIGHT); this.pL = prog(BLUR); this.pF = prog(FINAL);
      const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const tex = (w, h, filt) => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filt); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filt); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); if (w) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null); return t; };
      const fbo = t => { const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0); return f; };
      this.base = tex(0, 0, gl.NEAREST); this.bw = P.W >> 1; this.bh = P.H >> 1;
      this.t1 = tex(this.bw, this.bh, gl.LINEAR); this.t2 = tex(this.bw, this.bh, gl.LINEAR); this.f1 = fbo(this.t1); this.f2 = fbo(this.t2); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      this.La = new Float32Array(24 * 4); this.LCa = new Float32Array(24 * 3); this.Wa = new Float32Array(16);
      this.ok = true; return true;
    } catch (e) { this.failed = true; console.warn('GLFX desactivado:', e.message); return false; }
  },
  quad(p) { const gl = this.gl, loc = gl.getAttribLocation(p.p, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); },
  // efectos puntuales
  wave(x, y, power = 1) { if (this.level() < 1) return; this.waves.push({ x, y, r: 4, v: 4 + power * 2.2, p: Math.min(1.6, power), life: 1 }); if (this.waves.length > 4) this.waves.shift(); },
  pulseChroma(k = 1) { this.chroma = Math.max(this.chroma, k); },
  flashScreen(col = '#ffffff', k = 0.5) { this.flash = Math.max(this.flash, k); this.flashCol = this.rgb(col); },
  rgb(col) { const h = col.replace('#', ''); const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h.slice(0, 6), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; },
  addLight(x, y, r, i, col) { if (x < -r || y < -r || x > P.W + r || y > P.H + r) return; this.lights.push([x, y, r, i, col]); },
  // recoge las luces de la escena de nivel en curso
  gather(L) {
    if (!this.on() || this.level() < 1) return; const cx = Math.round(L.cam.x), cy = Math.round(L.cam.y), p = L.player;
    const A = L.A || {}, glow = (P.PAL[L.planet] && P.PAL[L.planet].r && P.PAL[L.planet].r.glow) || '#ffffff';
    if (p && !p.dead) this.addLight(p.cx - cx, p.cy - cy, 44, 0.16, (P.HERO_SKINS[P.State.data.skin] || {}).eg || '#ff6a5a');
    for (const e of L.ents) {
      if (e instanceof P.Proj) { if (!e.dead) this.addLight(e.cx - cx, e.cy - cy, e.big ? 46 : 26, e.owner === 'p' ? 0.5 : 0.42, e.glow || (e.owner === 'p' ? '#ffd166' : '#ff4a6a')); continue; }
      if (e.umLight && !e.dead) { const l = e.umLight(); if (l) this.addLight(l[0] - cx, l[1] - cy, l[2] * 1.2, 0.22 * (l[3] || 1), e.lightCol || glow); }
      if (e.boss && !e.dead && e.glowCol) this.addLight(e.cx - cx, e.cy - cy, 140, 0.25, e.glowCol);
    }
    for (const f of L.fx) if (f.k === 'ring' && f.t >= 0) { const k = 1 - f.t / (f.life || 30); if (k > 0) this.addLight(f.x - cx, f.y - cy, (f.r || 40) * 1.3, 0.55 * k, f.col || '#ffffff'); if (f.t === 1 && (f.r || 0) >= 50) this.wave(f.x - cx, f.y - cy, Math.min(1.4, f.r / 110)); }
    if (P.shakeT > 0 && P.shakeM >= 7) this.pulseChroma(Math.min(2, P.shakeM / 6));
    if (L.boss && L.boss.phase !== this._ph) { if (this._ph && L.boss.phase > this._ph) { this.wave(L.boss.cx - cx, L.boss.cy - cy, 1.6); this.pulseChroma(2); this.flashScreen('#ffffff', 0.35); } this._ph = L.boss.phase; }
    const G = (P.FX.GR && P.FX.GR[L.planet]) || {}, th = L.theme, dark = th === 'cave' || th === 'deep';
    if (G.fog && this.level() >= 2) { this.fogCol = this.rgb(G.fog); this.fogK = dark ? 0.42 : th === 'facility' || th === 'lab' ? 0.12 : L.sky === 'dusk' ? 0.26 : 0.18; } else this.fogK = 0;
    this.mask = 1;
  },
  render(src) {
    const gl = this.gl, lv = this.level(), W = P.W, H = P.H;
    gl.bindTexture(gl.TEXTURE_2D, this.base); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.bindBuffer(gl.ARRAY_BUFFER, null); gl.bindBuffer(gl.ARRAY_BUFFER, this._vb || (this._vb = (() => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW); return b; })()));
    const bloomOn = lv >= 2 && this.bloom > 0;
    if (bloomOn) {
      gl.viewport(0, 0, this.bw, this.bh);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.f1); gl.useProgram(this.pB.p); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.base); gl.uniform1i(this.pB.u.t, 0); gl.uniform2f(this.pB.u.px, 1 / W, 1 / H); gl.uniform1f(this.pB.u.th, 0.76); this.quad(this.pB);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.f2); gl.useProgram(this.pL.p); gl.bindTexture(gl.TEXTURE_2D, this.t1); gl.uniform1i(this.pL.u.t, 0); gl.uniform2f(this.pL.u.d, 1 / this.bw, 0); this.quad(this.pL);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.f1); gl.bindTexture(gl.TEXTURE_2D, this.t2); gl.uniform2f(this.pL.u.d, 0, 1 / this.bh); this.quad(this.pL);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, W, H); const F = this.pF, u = F.u; gl.useProgram(F.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.base); gl.uniform1i(u.t, 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.t1); gl.uniform1i(u.b, 1); gl.activeTexture(gl.TEXTURE0);
    gl.uniform2f(u.res, W, H); gl.uniform1f(u.tm, P.frame || 0); gl.uniform1f(u.bk, bloomOn ? this.bloom : 0);
    // ondas (avanzan y se apagan solas)
    this.Wa.fill(0); this.waves.forEach((w, i) => { w.r += w.v; w.life -= 0.035; this.Wa.set([w.x, w.y, w.r, Math.max(0, w.p * w.life)], i * 4); }); this.waves = this.waves.filter(w => w.life > 0);
    gl.uniform4fv(u.wv, this.Wa); gl.uniform1f(u.chroma, this.chroma); this.chroma = Math.max(0, this.chroma - 0.15);
    // luces: las más intensas primero
    const Ls = this.mask ? this.lights.sort((a, b) => b[3] * b[2] - a[3] * a[2]).slice(0, 24) : []; this.La.fill(0); this.LCa.fill(0);
    Ls.forEach((l, i) => { this.La.set([l[0], l[1], l[2], l[3]], i * 4); this.LCa.set(this.rgb(l[4]), i * 3); });
    gl.uniform4fv(u.L, this.La); gl.uniform3fv(u.LC, this.LCa); gl.uniform1i(u.nL, Ls.length);
    gl.uniform3fv(u.fogC, this.fogCol); gl.uniform1f(u.fogK, this.mask ? this.fogK : 0);
    // la interfaz no recibe luces, niebla ni distorsión
    const lvl = P.scene instanceof P.LevelScene, uiOpen = P.ui && P.ui.length > 0;
    gl.uniform4f(u.hud0, 0, 0, lvl ? 176 : 0, lvl ? 48 : 0); if (uiOpen) gl.uniform4f(u.hud1, 0, 0, P.W, P.H); else gl.uniform4f(u.hud1, 0, P.H - 28, P.W, lvl && P.scene.boss ? 28 : 0);
    gl.uniform1f(u.flash, this.flash); gl.uniform3fv(u.flashC, this.flashCol); this.flash = Math.max(0, this.flash - 0.04);
    this.quad(F); this.lights = []; this.mask = 0; this.fogK = 0;
    return this.cv;
  }
};
// la escena de nivel entrega sus luces cada fotograma (el resto de escenas solo reciben bloom y ondas)
(function () { const LS = P.LevelScene; if (!LS) return; const base = LS.prototype.draw; LS.prototype.draw = function (c) { base.call(this, c); P.GLFX.gather(this); }; })();
// el bloom 2D antiguo se omite cuando el de los shaders está activo, y le pasa su intensidad
P.GLFX.hookPost = function () { if (!P.FX || P.FX._glHook) return; P.FX._glHook = true; const base = P.FX.post.bind(P.FX); P.FX.post = function (c, g) { if (g && P.GLFX.on() && P.GLFX.level() >= 2) { P.GLFX.bloom = Math.min(0.34, (g.bloom || 0.4) * 0.42); return base(c, Object.assign({}, g, { bloom: 0 })); } return base(c, g); }; };

// ---------- materiales de energía (2D, píxeles nítidos) ----------
P.Energy = {
  // electricidad: arcos quebrados que se regeneran cada pocos fotogramas
  arc(c, x0, y0, x1, y1, t, col = '#bff6ff', w = 1, jit = 6) { const n = Math.max(3, Math.round(Math.hypot(x1 - x0, y1 - y0) / 7)), r = P.RNG((t >> 1) * 7919 + Math.round(x0 + y1)); let px = x0, py = y0; c.fillStyle = col; for (let i = 1; i <= n; i++) { const k = i / n, nx = x0 + (x1 - x0) * k + (i < n ? r.range(-jit, jit) : 0), ny = y0 + (y1 - y0) * k + (i < n ? r.range(-jit, jit) : 0), m = Math.max(Math.abs(nx - px), Math.abs(ny - py)) | 0; for (let s = 0; s <= m; s++) c.fillRect(Math.round(px + (nx - px) * s / Math.max(1, m)), Math.round(py + (ny - py) * s / Math.max(1, m)), w, w); px = nx; py = ny; } },
  // plasma: núcleo blanco, anillos que laten y chispas que orbitan
  plasma(c, x, y, r, t, cols = ['#ff3af0', '#ff8af8', '#ffffff']) { P.drawGlow(c, x, y, r * 2.2, cols[0], 0.45); for (let k = 0; k < 3; k++) { const rr = r * (0.5 + k * 0.25) + Math.sin(t * 0.2 + k) * 1.2; c.fillStyle = cols[Math.min(2, 2 - k)]; c.beginPath(); c.arc(Math.round(x), Math.round(y), Math.max(1, rr * (k === 2 ? 0.35 : 1) | 0), 0, 6.3); if (k === 2) c.fill(); } c.fillStyle = cols[1]; for (let k = 0; k < 6; k++) { const a = t * 0.12 + k * 1.05; c.fillRect(Math.round(x + Math.cos(a) * r), Math.round(y + Math.sin(a) * r * 0.7), 1, 1); } },
  // fuego: lenguas que suben con ruido, del blanco al rojo
  fire(c, x, y, w, h, t) { const C = ['#fff4c0', '#ffd166', '#ff8a2a', '#d0300a']; for (let i = 0; i < w; i++) { const hh = h * (0.5 + 0.5 * Math.abs(Math.sin(i * 0.7 + t * 0.21) * Math.cos(i * 0.31 - t * 0.13))); for (let j = 0; j < hh; j++) { const k = j / hh; c.fillStyle = C[Math.min(3, Math.floor(k * 4))]; c.fillRect(Math.round(x - w / 2 + i), Math.round(y - j), 1, 1); } } P.drawGlow(c, x, y - h / 2, Math.max(w, h), '#ff6a1a', 0.3); },
  // hielo: facetas que destellan
  ice(c, x, y, r, t) { const C = ['#5a9ad8', '#b8e4ff', '#ffffff']; for (let k = 0; k < 6; k++) { const a = k * 1.047; c.fillStyle = C[(k + (t >> 4)) % 3]; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); c.lineTo(x + Math.cos(a + 1.047) * r, y + Math.sin(a + 1.047) * r); c.fill(); } if ((t >> 3) % 6 === 0) { c.fillStyle = '#ffffff'; c.fillRect(Math.round(x - r * 0.4), Math.round(y - r * 0.4), 2, 2); } },
  // escudo: burbuja hexagonal con una onda que la recorre y se ilumina donde recibe un impacto
  shield(c, x, y, r, t, col = '#5ae0ff', hit = 0) { P.drawGlow(c, x, y, r * 1.4, col, 0.15 + hit * 0.4); for (let a = 0; a < 6.28; a += 0.05) { const wv = Math.sin(a * 6 + t * 0.15) * 1.2; c.fillStyle = Math.sin(a * 3 - t * 0.08) > 0.6 ? '#ffffff' : col; c.globalAlpha = 0.5 + hit * 0.5; c.fillRect(Math.round(x + Math.cos(a) * (r + wv)), Math.round(y + Math.sin(a) * (r + wv)), 1, 1); } for (let k = 0; k < 7; k++) { const a = k * 0.9 + t * 0.01, rr = r * 0.6; c.globalAlpha = 0.25; c.fillRect(Math.round(x + Math.cos(a) * rr), Math.round(y + Math.sin(a) * rr), 3, 1); } c.globalAlpha = 1; },
  // portal: espiral que gira hacia dentro
  portal(c, x, y, rx, ry, t, cols = ['#7a3aff', '#c08aff', '#ffffff']) { P.drawGlow(c, x, y, Math.max(rx, ry) * 1.6, cols[0], 0.4); for (let k = 0; k < 90; k++) { const s = k / 90, a = s * 14 - t * 0.12, rr = 1 - s; c.fillStyle = cols[k % 3]; c.fillRect(Math.round(x + Math.cos(a) * rx * rr), Math.round(y + Math.sin(a) * ry * rr), 1, 1); } },
  // láser: núcleo blanco, borde de color y una vibración de anchura
  laser(c, x0, y0, x1, y1, t, col = '#ff3050', w = 3) { const ww = w + (t % 4 < 2 ? 1 : 0), ang = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(ang), ny = Math.cos(ang), n = Math.ceil(Math.hypot(x1 - x0, y1 - y0)); for (let i = 0; i <= n; i += 1) { const x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * i / n; c.fillStyle = col; c.fillRect(Math.round(x + nx * ww / 2), Math.round(y + ny * ww / 2), 1, 1); c.fillRect(Math.round(x - nx * ww / 2), Math.round(y - ny * ww / 2), 1, 1); c.fillStyle = '#ffffff'; c.fillRect(Math.round(x), Math.round(y), 1, 1); } P.drawGlow(c, x1, y1, w * 6, col, 0.6); },
  // energía oscura: zarcillos negro-violeta con borde que brilla
  dark(c, x, y, r, t) { for (let k = 0; k < 7; k++) { let px = x, py = y, a = k * 0.9 + Math.sin(t * 0.03 + k) * 0.6; for (let j = 0; j < r; j++) { a += Math.sin(j * 0.2 + t * 0.05 + k) * 0.15; px += Math.cos(a); py += Math.sin(a); c.fillStyle = j % 5 === 0 ? '#c08aff' : '#140820'; c.fillRect(Math.round(px), Math.round(py), j < r / 2 ? 2 : 1, j < r / 2 ? 2 : 1); } } P.drawGlow(c, x, y, r, '#7a3aff', 0.25); },
  // energía cósmica: polvo de estrellas que gira alrededor de un centro
  cosmic(c, x, y, r, t) { for (let k = 0; k < 40; k++) { const a = k * 2.4 + t * 0.02 * (1 + (k % 3)), rr = r * ((k * 37 % 100) / 100); c.fillStyle = ['#ffffff', '#bff6ff', '#ffd166', '#c08aff'][k % 4]; c.fillRect(Math.round(x + Math.cos(a) * rr), Math.round(y + Math.sin(a) * rr * 0.6), 1, 1); } P.drawGlow(c, x, y, r * 0.8, '#5a7aff', 0.25); },
  // reactor: núcleo que late con anillos de energía que se expanden
  reactor(c, x, y, r, t, col = '#5ae0ff') { const k = (Math.sin(t * 0.08) + 1) / 2; P.drawGlow(c, x, y, r * (1.6 + k * 0.4), col, 0.35 + k * 0.25); for (let i = 0; i < 3; i++) { const ph = ((t * 0.01 + i / 3) % 1), rr = r * (0.4 + ph); c.strokeStyle = col; c.globalAlpha = 1 - ph; c.beginPath(); c.arc(Math.round(x), Math.round(y), rr, 0, 6.3); c.stroke(); } c.globalAlpha = 1; c.fillStyle = '#ffffff'; c.beginPath(); c.arc(Math.round(x), Math.round(y), Math.max(2, r * 0.3 + k * 1.5), 0, 6.3); c.fill(); }
};
P.GLFX.hookPost();
