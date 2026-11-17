'use strict';
// Escena de nivel lateral
P.SOLID = { '#': 1, R: 1, M: 1, B: 1, S: 1, b: 1, I: 1, T: 1, G: 1, '=': 2, '-': 2, j: 2 };
P.TUT_L1 = [
  null,
  () => 'ATAQUE: ' + P.input.label('attack') + ' (mantén para disparar en ráfaga). Los Krazith defienden su territorio.',
  () => 'Mantén la dirección para CORRER. Salta sobre los desniveles.',
  () => 'Las BALIZAS guardan tu posición en el nivel y reparan tu armadura.',
  () => 'ESQUIVA con ' + P.input.label('dash') + ': un impulso rápido e invulnerable.',
  () => 'Mantén ↑ junto a una liana de Vidlumbre para TREPAR. Pulsa ' + P.input.label('interact') + ' cerca de plantas para ESCANEARLAS.',
  () => 'Destruye la EXTRACTORA para liberar el territorio. DEFENSA: mantén ' + P.input.label('defend') + ' para bloquear disparos.',
  () => 'SUPERATAQUE (' + P.input.label('super') + ') cuando la barra dorada esté llena. Se carga al golpear.',
  () => 'El portal pleyadiano se abre cuando no quedan extractoras activas.'
];

P.LevelScene = class {
  constructor(planet, id) {
    this.planet = planet; this.id = id; this.def = P.LV[planet].levels.find(l => l.id === id);
    this.theme = this.def.theme;
  }
  enter() {
    const d = this.def, S = P.State;
    this.lvs = S.lvState(this.planet, this.id); this.sim = !!d.sim;
    this.A = P.ART[this.planet] || P.ART.verzara; this.pal = P.PAL[this.planet] || P.PAL.verzara;
    this.sky = d.sky || (this.planet === 'verzara' ? ({ 4: 'golden', 7: 'golden', 9: 'dusk', 11: 'golden' }[this.id] || 'day') : 'day');
    this.restoredAll = this.lvs.done && !d.boss;
    this.waves = []; this.ents = []; this.parts = new P.Particles(); this.popups = []; this.fx = []; this.pending = []; this.tileHP = {}; this.bounce = {};
    this.diff = (1 + (this.id - 1) * 0.07) * P.DIFF.get().hp; this.noDmg = true; this.t = 0; this.kills0 = S.data.stats.kills; this.cutscene = false; this.arena = null; this.scanning = null; this.tip = null; this.tipT = 0; this.tutIdx = -1;
    this.buildMap();
    this.minX = 0; this.maxX = this.W;
    this.player = new P.Player(this, this.start.x, this.start.y - 20);
    this.checkpoint = { x: this.start.x, y: this.start.y - 20 };
    P.sprPrefix = this.A.p || ''; this.spawnAll(); P.sprPrefix = '';
    this.companions = P.makeCompanions(this);
    this.extractorsLeft = this.ents.filter(e => e instanceof P.Extractor).length;
    this.cam = { x: 0, y: 0 }; this.snapCam();
    this.musVar = this.planet + ':' + this.id; // cada nivel tiene su propia variación del tema del planeta
    P.Audio.music(this.restoredAll && P.Audio.TRACKS[d.music + '_r'] ? d.music + '_r' : d.music, this.musVar);
    this.banner = 170;
    if (!this.lvs.visited && d.intro) { this.lvs.visited = true; this.introPending = true; }
    else if (d.boss) this.introPending = true;
  }
  // ---------- mapa ----------
  buildMap() {
    const d = this.def;
    let rows;
    if (d.boss) rows = ((P.ARENAS && P.ARENAS[d.arena]) || P.BOSS_ARENA).slice();
    else {
      rows = [];
      for (const crow of d.rows) {
        const block = []; for (let i = 0; i < 17; i++) block.push('');
        for (const cid of crow) { const c = P.CHUNKS[cid]; if (!c) console.warn('chunk?', cid); for (let i = 0; i < 17; i++) block[i] += (c || P.CHUNKS.air)[i]; }
        rows.push(...block);
      }
      const w = Math.max(...rows.map(r => r.length)); rows = rows.map(r => r.padEnd(w, '.'));
    }
    this.cols = rows[0].length; this.rows = rows.length; this.W = this.cols * TS; this.H = this.rows * TS;
    this.map = rows.map(r => r.split(''));
    this.markers = [];
    const ENT = 'PEkXCh*uncKAfdDlpvsgyoLFmUrwQZVOJWY';
    for (let y = 0; y < this.rows; y++) for (let x = 0; x < this.cols; x++) {
      const c = this.map[y][x];
      if (ENT.includes(c)) { this.markers.push({ c, x, y }); this.map[y][x] = '.'; }
    }
    if (this.A && this.A.postMap) this.A.postMap(this);
    // árboles gigantes decorativos sobre el suelo
    this.bigTrees = [];
    if (!['facility', 'lab', 'cave'].includes(this.theme) && !d.boss) {
      const R = P.RNG(this.id * 97 + 3);
      // solo sobre suelo firme y continuo (nunca sobre bloques flotantes, ramas ni bordes de abismo)
      const firm = (tx, ty) => P.SOLID[this.tile(tx, ty)] === 1 && P.SOLID[this.tile(tx, ty + 1)] === 1 && this.tile(tx, ty - 1) === '.';
      for (let x = 90; x < this.cols * TS - 40; x += R.int(170, 300)) {
        const tx = Math.floor(x / TS); let gy = null;
        for (let ty = this.rows - 2; ty >= this.rows - 5; ty--) if (firm(tx, ty)) { gy = ty; break; }
        if (gy == null) continue;
        let ok = true; for (let k = -2; k <= 2; k++) if (!firm(tx + k, gy)) ok = false;
        if (ok) this.bigTrees.push({ x, y: gy * TS, v: this.A.treeVariants ? R.pick(this.A.treeVariants) : R.int(0, 1) });
      }
    } else if (d.boss) this.bigTrees = [{ x: 70, y: 14 * TS, v: 0 }, { x: 420, y: 14 * TS, v: 1 }];
    this.buildSupports();
    const st = this.markers.find(m => m.c === 'P') || { x: 2, y: this.rows - 4 };
    this.start = { x: st.x * TS + 3, y: (st.y + 1) * TS };
  }
  tile(tx, ty) { if (ty < 0 || ty >= this.rows || tx < 0 || tx >= this.cols) return '.'; return this.map[ty][tx]; }
  coll(tx, ty) { if (tx < 0 || tx >= this.cols) return 1; if (ty < 0 || ty >= this.rows) return 0; return P.SOLID[this.map[ty][tx]] || 0; }
  isLiquid(tx, ty) { return this.tile(tx, ty) === '~'; }
  isHazard(tx, ty) { return this.tile(tx, ty) === '^'; }
  isVine(tx, ty) { return this.tile(tx, ty) === '|'; }
  restoredAt(px) { if (this.restoredAll) return true; for (const w of this.waves) if (Math.abs(px - w.x) < w.r) return true; return false; }
  restoredFrac() { if (this.restoredAll) return 1; let f = 0; for (const w of this.waves) f += Math.min(1, w.r * 2 / this.W); return Math.min(1, f); }
  damageTile(tx, ty, dmg) {
    const c = this.tile(tx, ty); if (c !== 'B' && c !== 'S') return;
    const k = tx + ',' + ty; this.tileHP[k] = (this.tileHP[k] == null ? (c === 'B' ? 14 : 10) : this.tileHP[k]) - dmg;
    if (this.tileHP[k] <= 0) {
      this.map[ty][tx] = '.'; P.Audio.sfx('break');
      this.parts.burst(tx * TS + 8, ty * TS + 8, 12, { col: c === 'B' ? '#6a5a80' : '#4a3a28', smin: 1, smax: 3, g: 0.2, size: 2 });
      if (c === 'S' && !this.lvs.secrets[k]) { this.lvs.secrets[k] = true; P.State.data.stats.secrets++; if (P.State.data.stats.secrets >= 10) P.State.ach('secretos'); if (!this.secretToast) { this.secretToast = true; P.toast('¡Pasaje secreto!', { col: P.UIC.gold, icon: 'i_star' }); P.Audio.sfx('unlock'); } }
    }
  }
  bounceTile(tx, ty) { this.bounce[tx + ',' + ty] = 12; }
  findSecretsNear(x, y, r) {
    const out = [];
    for (let ty = Math.floor((y - r) / TS); ty <= Math.floor((y + r) / TS); ty++) for (let tx = Math.floor((x - r) / TS); tx <= Math.floor((x + r) / TS); tx++) if (this.tile(tx, ty) === 'S') out.push({ x: tx * TS + 8, y: ty * TS + 8 });
    for (const e of this.ents) if ((e instanceof P.Item || (e instanceof P.Chest && !e.open)) && P.dist(x, y, e.cx, e.cy) < r) out.push({ x: e.cx, y: e.y });
    return out.slice(0, 4);
  }
  add(e) { this.ents.push(e); return e; }
  fl(k, d) { return (this.A.flora || {})[k] || d; }
  // Detecta estructuras que no tocan el suelo ni los bordes (ramas, rejillas, bloques, ruinas sueltas)
  // y genera soportes decorativos hasta la superficie de abajo, para que nada parezca flotar.
  buildSupports() {
    this.supports = [];
    const R = this.rows, C = this.cols, seen = new Uint8Array(R * C), isS = (x, y) => x >= 0 && y >= 0 && x < C && y < R && P.SOLID[this.map[y][x]];
    for (let y0 = 0; y0 < R; y0++) for (let x0 = 0; x0 < C; x0++) {
      if (!isS(x0, y0) || seen[y0 * C + x0]) continue;
      const comp = [], q = [[x0, y0]]; seen[y0 * C + x0] = 1; let grounded = false;
      while (q.length) {
        const [x, y] = q.pop(); comp.push([x, y]);
        if (y === R - 1 || y === 0 || x === 0 || x === C - 1) grounded = true;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (isS(nx, ny) && !seen[ny * C + nx]) { seen[ny * C + nx] = 1; q.push([nx, ny]); } }
      }
      if (grounded) continue;
      // columnas de apoyo: extremos de la fila inferior (y el centro si es ancha)
      const bottom = Math.max(...comp.map(c => c[1])), row = comp.filter(c => c[1] === bottom).map(c => c[0]).sort((a, b) => a - b);
      const xs = [row[0], row[row.length - 1]]; if (row.length > 8) xs.push(row[Math.floor(row.length / 2)]);
      const uniq = [...new Set(row.length <= 2 ? [row[0]] : xs)];
      for (const sx of uniq) {
        let gy = bottom + 1; while (gy < R && !P.SOLID[this.map[gy][sx]]) gy++;
        if (gy - bottom - 1 < 1) continue;
        const ch = this.map[bottom][sx], kind = ch === '=' ? 'wood' : (ch === '-' || ch === 'M') ? 'metal' : ch === 'R' || ch === 'I' ? 'stone' : 'root';
        this.supports.push({ x: sx * TS + 8, y0: (bottom + 1) * TS - (ch === '=' || ch === '-' ? 10 : 0), y1: gy * TS, kind, seed: sx * 31 + bottom });
      }
    }
  }
  drawSupports(c, cx, cy) {
    for (const s of this.supports) {
      const x = Math.round(s.x - cx), y0 = Math.round(s.y0 - cy), y1 = Math.round(s.y1 - cy);
      if (x < -20 || x > P.W + 20 || y1 < 0 || y0 > P.H) continue;
      const st = this.restoredAt(s.x) ? 'r' : 'c', pal = this.pal[st], h = y1 - y0;
      if (s.kind === 'metal') {
        c.fillStyle = '#2e3346'; c.fillRect(x - 2, y0, 4, h); c.fillStyle = '#8a98bc'; c.fillRect(x - 2, y0, 1, h);
        for (let yy = y0 + 6; yy < y1 - 4; yy += 14) { c.fillStyle = '#4e5872'; c.fillRect(x - 4, yy, 8, 2); c.fillStyle = '#ffcc00'; c.fillRect(x - 1, yy + 6, 2, 1); }
      } else if (s.kind === 'stone') {
        const SC = this.A.stone || ['#b8c2dc', '#f4fbff', '#8a90b8', '#e8a020', '#3ae0a0'];
        c.fillStyle = SC[0]; c.fillRect(x - 4, y0, 8, h); c.fillStyle = SC[1]; c.fillRect(x - 4, y0, 2, h); c.fillStyle = SC[2]; c.fillRect(x + 3, y0, 1, h);
        c.fillStyle = SC[3]; c.fillRect(x - 5, y0, 10, 2); c.fillRect(x - 5, y1 - 3, 10, 3); c.fillStyle = SC[4]; c.fillRect(x - 1, y0 + Math.floor(h / 2), 2, 2);
      } else {
        // tronco (ramas) o raíz gruesa (bloques de tierra), con hojas y lianas
        const T = pal.trunk, w = s.kind === 'wood' ? 8 : 10;
        c.fillStyle = T[1]; c.fillRect(x - w / 2, y0, w, h); c.fillStyle = T[2]; c.fillRect(x - w / 2, y0, 2, h); c.fillStyle = T[0]; c.fillRect(x + w / 2 - 2, y0, 2, h);
        for (let yy = y0 + 5; yy < y1; yy += 9) { c.fillStyle = T[0]; c.fillRect(x - 1 + ((yy * 7 + s.seed) % 3) - 1, yy, 1, 5); }
        c.fillStyle = T[1]; c.beginPath(); c.moveTo(x - w / 2 - 6, y1); c.lineTo(x - w / 2, y1 - 8); c.lineTo(x + w / 2, y1 - 8); c.lineTo(x + w / 2 + 6, y1); c.fill();
        const L = pal.leaf;
        for (let yy = y0 + 8; yy < y1 - 10; yy += 22) { const side = ((yy + s.seed) >> 3) % 2 ? 1 : -1; c.fillStyle = L[1]; c.fillRect(x + side * (w / 2) - (side < 0 ? 5 : 0), yy, 5, 3); c.fillStyle = L[2]; c.fillRect(x + side * (w / 2) - (side < 0 ? 4 : -1), yy, 3, 1); }
        if (s.kind === 'wood') { c.fillStyle = L[1]; c.fillRect(x - 7, y0, 14, 4); c.fillStyle = L[2]; c.fillRect(x - 6, y0, 9, 1); c.fillStyle = pal.flower[0]; c.fillRect(x + 4, y0 + 1, 2, 2); }
      }
    }
  }
  // altura de la primera superficie (sólida, plataforma o líquido) bajo una celda
  snapY(tx, ty) {
    for (let yy = ty + 1; yy < this.rows && yy <= ty + 12; yy++) { const c = this.coll(tx, yy); if (c === 1 || c === 2 || this.isLiquid(tx, yy) || this.tile(tx, yy) === '^') return yy * TS; }
    return (ty + 1) * TS;
  }
  // ---------- entidades ----------
  // enemigos extra de las mismas especies del nivel (según la dificultad), junto a los originales y sobre suelo libre
  cloneable(e) { return e instanceof P.Enemy && !e.boss && !e.passive && !e.noClone && !(P.Alpha && e instanceof P.Alpha); }
  cloneCell(tx, ty, fly) {
    if (tx < 1 || tx >= this.cols - 1 || ty < 2 || ty >= this.rows - 1) return false;
    const free = (x, y) => this.coll(x, y) === 0 && !this.isLiquid(x, y);
    if (!free(tx, ty) || !free(tx, ty - 1)) return false;
    return fly ? true : this.coll(tx, ty + 1) >= 1 && !this.isLiquid(tx, ty + 1);
  }
  extraFoes(foes, one) {
    const D = P.DIFF.get(); if (!D.extra || this.def.boss || this.def.scene || this.sim) return;
    const rng = P.RNG(P.hash(this.planet + ':' + this.id + ':' + P.DIFF.id()) + 11), sx = Math.floor(this.start.x / TS), used = new Set(foes.map(([m]) => m.x + ':' + m.y));
    for (const [m, e] of foes) {
      const n = Math.floor(D.extra) + (rng() < D.extra % 1 ? 1 : 0);
      for (let k = 0; k < n; k++) for (let tries = 0; tries < 8; tries++) {
        const tx = m.x + (rng() < 0.5 ? -1 : 1) * (2 + Math.floor(rng() * 4)), ty = m.y;
        if (Math.abs(tx - sx) < 12 || used.has(tx + ':' + ty) || !this.cloneCell(tx, ty, e.flying)) continue;
        used.add(tx + ':' + ty); one({ c: m.c, x: tx, y: ty, clone: true }); break;
      }
    }
  }
  spawnAll() {
    const d = this.def, S = P.State, R = this.restoredAll; this.spawnMap = (P.LV[this.planet] || {}).spawn || {};
    let si = 0, ni = 0, ui = 0, yi = 0, gi = 0;
    const theme = this.theme;
    const villagers = [];
    const one = m => {
      // los objetos estáticos (plantas, cofres, balizas, portales...) se apoyan siempre en la superficie de debajo
      const x = m.x * TS + 8, y = 'EkXChupLFmUrynC'.includes(m.c) ? this.snapY(m.x, m.y) : (m.y + 1) * TS;
      const ov = this.spawnMap[m.c]; if (ov) { ov(this, x, y, m, R); return; }
      switch (m.c) {
        case 'E': this.add(new P.Gate(this, x, y)); villagers.push(x - 40); break;
        case 'k': this.add(new P.Beacon(this, x, y)); villagers.push(x + 30); break;
        case 'X': if (!R) this.add(new P.Extractor(this, x, y)); else villagers.push(x); break;
        case 'C': { const key = this.id + '_' + m.x + '_' + m.y; this.add(new P.Chest(this, x, y, key, !!this.lvs.chests[key])); break; }
        case 'h': this.add(new P.HealPlant(this, x, y)); break;
        case '*': {
          const def = (d.stars || [])[si] || { t: 'res', crys: 1 }, key = 's' + si; si++;
          if (!this.lvs.stars[key]) this.add(new P.Item(this, x, y - 4, def, key));
          break;
        }
        case 'u': {
          const up = (d.ups || [])[ui++];
          this.add(new P.Decor(this, x, y, 'pedestal', null));
          if (up && !S.data.ups[up]) this.add(new P.Item(this, x, y - 18, { t: 'up', id: up }, 'u_' + up));
          break;
        }
        case 'n': {
          const ev = (d.events || [])[ni++]; if (!ev) break;
          if (ev.spawn) { ev.spawn(this, x, y, ev); break; }
          if (ev.t === 'tip') { this.tutorial = true; }
          if (ev.t === 'rescue' && !S.data.npcs[ev.npc]) {
            if (ev.hidden) { const w = new P.Walker(this, x, y, ev.npc, null, null, null); w.rescueNpc = ev.npc; w.use = () => this.rescueTalk(ev.npc, w); this.add(w); }
            else { const w = new P.Walker(this, x, y, ev.npc, null, null, null); w.interact = false; w.caged = true; w.update = function () { this.t++; this.vy = Math.min(this.vy + 0.3, 6); this.move(0, this.vy); }; this.add(w); const cg = this.add(new P.Cage(this, x, y, ev.npc)); cg.walker = w; }
          }
          if (ev.t === 'transmission' && !this.lvs['tx_' + ni]) this.pending.push({ k: 'trigger', x, once: 'tx_' + ni, lines: ev.lines });
          if (R) villagers.push(x + 20);
          break;
        }
        case 'c': this.add(new P.Crab(this, x - 9, y, false)); break;
        case 'K': if (!R) this.add(new P.Crab(this, x - 10, y, true)); else this.add(new P.Crab(this, x - 9, y, false)); break;
        case 'A': if (!R) this.add(new P.Alpha(this, x - 20, y)); break;
        case 'f': this.add(new P.Frog(this, x - 7, y - 11)); break;
        case 'd': this.add(new P.Fly(this, x - 8, y - 20, false)); break;
        case 'D': if (!R) this.add(new P.Fly(this, x - 8, y - 20, true)); else if (theme !== 'facility' && theme !== 'lab') this.add(new P.Fly(this, x - 8, y - 20, false)); break;
        case 'l': this.add(new P.Slug(this, x - 10, y - 8)); break;
        case 'p': if (!R) this.add(new P.Maw(this, x - 6, y - 16)); else this.add(new P.Decor(this, x, y, 'fern_r', 'helecho')); break;
        case 'v': this.add(new P.VSnake(this, x, m.y * TS)); break;
        case 's': if (!R) this.add(new P.Soldier(this, x - 5, y - 14)); else villagers.push(x); break;
        case 'g': this.pending.push({ k: 'grazer', x, y }); if (gi++ === 0 && this.id === 1 && S.liberated(this.planet) >= 10) this.pending.push({ k: 'vellorn', x: x + 60, y }); break;
        case 'y': this.pending.push({ k: 'orchid', x, y, key: 'y' + (yi++) }); break;
        case 'o': for (let i = 0; i < 3; i++) this.add(new P.Pickup(this, x + (i - 1) * 6, y - 6, P.pick(['bio', 'bio', 'scrap']), { vx: 0, vy: 0, life: 99999 })); break;
        case 'L': this.add(new P.Decor(this, x, y, 'lamp', this.fl('L', 'lumbrela'), { light: '#3fe0d0', lightR: 60 })); break;
        case 'F': this.add(new P.Decor(this, x, y, R ? 'fern_r' : 'fern_c', this.fl('F', 'helecho'))); break;
        case 'm': this.add(new P.Decor(this, x, y, 'mush', this.fl('m', 'toxomiceto'), { toxic: true, puff: 0 })); break;
        case 'U': this.add(new P.Decor(this, x, y, 'bigmush', this.fl('U', 'sombrilla'), { light: '#9a7aff', lightR: 50 })); break;
        case 'r': this.add(new P.Decor(this, x, y, 'o_pillar', null, { frame: P.hash(m.x + ':' + m.y) % 2 })); break;
      }
    };
    const foes = [];
    for (const m of this.markers) { const n0 = this.ents.length; one(m); const e = this.ents.slice(n0).find(q => this.cloneable(q)); if (e) foes.push([m, e]); }
    this.extraFoes(foes, one);
    // nenúfares en aguas restauradas
    for (let y = 1; y < this.rows; y++) for (let x = 0; x < this.cols; x++) if (this.map[y][x] === '~' && this.map[y - 1][x] === '.' && (P.hash(x + ':' + y) % 5 === 0)) this.pending.push({ k: 'lily', x: x * TS + 8, y: y * TS + 4 });
    // pobladores en territorios liberados
    if (R) {
      const civs = this.A.civs || ['pleyadiano', 'pleyadiano', 'arturiano', 'reptiliano', 'andromedano'];
      villagers.slice(0, 5).forEach((vx, i) => { const civ = civs[(this.id + i) % civs.length]; const ty = this.groundBelow(vx); if (ty != null) this.add(new P.Walker(this, vx, ty, civ + ((this.id + i) % 3), civ)); });
    }
    // objetos del nivel sin hueco '*' en sus fragmentos: se reparten sobre suelo firme a lo largo del recorrido
    const stars = d.stars || [];
    for (let k = si; k < stars.length; k++) {
      const key = 's' + k, spot = this.freeSpot(Math.floor(this.cols * (0.15 + 0.7 * (k - si + 1) / (stars.length - si + 1))));
      if (spot && !this.lvs.stars[key]) this.add(new P.Item(this, spot[0], spot[1] - 4, stars[k], key));
    }
    // jefe
    if (d.boss) {
      this.boss = this.add(new P.BOSS_CLASS[d.boss](this, 22 * TS, 14 * TS)); this.boss.face = -1;
      const D = P.DIFF.get(), b = this.boss; // vida del jefe según la dificultad
      if (b.FORM_HP) { b.FORM_HP = b.FORM_HP.map(v => Math.round(v * D.boss)); b.maxhp = b.hp = b.FORM_HP[0]; }
      else b.maxhp = b.hp = Math.round(b.maxhp * (b._hp0 === b.maxhp ? D.boss / D.hp : D.boss));
    }
    this.resolvePending(true);
  }
  // suelo transitable más bajo cerca de la columna tx0 (sin líquido ni pinchos y con hueco para el jugador)
  freeSpot(tx0) {
    for (let d = 0; d < 40; d++) for (const tx of [tx0 + d, tx0 - d]) {
      if (tx < 2 || tx >= this.cols - 2) continue;
      for (let ty = this.rows - 2; ty > 2; ty--) {
        const c = this.coll(tx, ty); if (c !== 1 && c !== 2) continue;
        if (this.coll(tx, ty - 1) || this.coll(tx, ty - 2) || this.isLiquid(tx, ty - 1) || this.isLiquid(tx, ty) || this.tile(tx, ty) === '^' || this.tile(tx, ty - 1) === '^') continue;
        return [tx * TS + 8, ty * TS];
      }
    }
    return null;
  }
  groundBelow(px) { const tx = Math.floor(px / TS); for (let ty = 0; ty < this.rows; ty++) if (this.coll(tx, ty) === 1 && this.coll(tx, ty - 1) === 0 && ty > 5) return ty * TS; return null; }
  resolvePending(initial) {
    for (const p of this.pending) {
      if (p.done || p.k === 'trigger') continue;
      if (!this.restoredAt(p.x)) continue;
      p.done = true;
      if (p.k === 'grazer') this.add(new P.Grazer(this, p.x - 15, p.y, this.fl('g', 'grazer')));
      if (p.k === 'vellorn') this.add(new P.Grazer(this, p.x - 13, p.y, this.fl('legend', 'vellorn')));
      if (p.k === 'lily') this.add(new P.Decor(this, p.x, p.y + 2, 'lily', this.fl('lily', 'nenufar')));
      if (p.k === 'orchid') {
        this.add(new P.Decor(this, p.x, p.y, 'orchid', this.fl('y', 'orquidea'), { light: '#ffd166', lightR: 30 }));
        if (!this.lvs.stars[p.key]) this.add(new P.Item(this, p.x, p.y - 16, { t: 'seed', m: this.A.seedMission }, p.key));
      }
      if (!initial) this.parts.burst(p.x, p.y - 6, 8, { col: '#ffd166', smin: 0.5, smax: 1.5, lmin: 20, lmax: 40, glow: 3 });
    }
  }
  // ---------- eventos ----------
  say(lines, cb) { P.openUI(new P.Dialog(lines, cb)); }
  collectItem(it) {
    it.dead = true; const S = P.State, d = it.def;
    this.lvs.stars[it.key] = true;
    P.Audio.sfx('unlock');
    this.parts.burst(it.cx, it.cy, 16, { col: '#ffd166', smin: 0.5, smax: 2.5, glow: 3 });
    if (d.t === 'holo') { S.data.holos[d.id] = true; S.missionProg(this.A.holoMission || 's_ecos'); if (Object.keys(S.data.holos).length >= 8) S.ach('archivista'); S.addXP(20); P.openUI(new P.LoreView(P.D.HOLOS[d.id], 'holo')); }
    else if (d.t === 'mem') { S.data.mems[d.id] = true; S.addXP(40); P.openUI(new P.LoreView(P.D.MEMORIES[d.id], 'mem')); }
    else if (d.t === 'up') { S.giveUpgrade(d.id); if (P.D.WEAPONS[d.id]) { this.player.weapon = d.id; S.data.weapon = d.id; } this.player.st = S.stat(); P.Audio.sfx('levelup'); P.openUI(new P.UpgradeView(d.id)); }
    else if (d.t === 'seed') { const m = d.m || 's_semillas', k = m === 's_semillas' ? 'seeds' : 'seeds_' + m; S.data[k] = (S.data[k] || 0) + 1; S.missionProg(m); P.toast((this.A.seedName || 'Semilla de Orquídea Solar') + ' (' + S.data[k] + '/5)', { col: P.UIC.gold, icon: 'seed' }); }
    else if (d.t === 'comp') { const n = (this.def.stars || []).filter((s2, i) => s2.t === 'comp' && this.lvs.stars['s' + i]).length; P.toast('Componente médico (' + n + '/3)', { col: P.UIC.cyan, icon: 'i_thermo' }); }
    else { for (const k of ['bio', 'scrap', 'crys']) if (d[k]) { S.addRes(k, d[k]); P.toast('+' + d[k] + ' ' + { bio: 'Biomasa', scrap: 'Chatarra', crys: 'Cristal solar' }[k], { icon: 'i_' + k, col: P.UIC.gold }); } }
  }
  onCageBroken(cg) {
    const w = cg.walker; if (!w) return;
    this.cutscene = true;
    setTimeout(() => { }, 0);
    this.rescueTalk(cg.npc, w);
  }
  rescueTalk(npc, w) {
    const N = {
      sylae: [['sylae', '¿Un cyborg... rojo? Pensé que los Esqueléticos venían a terminar el trabajo.'], ['sylae', 'Soy Sylaë, botánica de Lirae. Mi gente cuidaba esta selva antes de las extractoras.'], ['sylae', 'Tu armadura lleva el sello de la República Solar... ¿Quién eres?'], ['hero', 'Mi designación es {N}. No recuerdo mucho más.'], ['sylae', 'Entonces, {N}, déjame ir a tu nave. Si recupero semillas, haré florecer tus invernaderos.'], ['elara', 'Teletransporte preparado. Bienvenida a bordo de la Vigía del Alba, Sylaë.']],
      kairo: [['kairo', 'Ese sello... ¡República Solar! Creía que no quedaba nadie.'], ['kairo', 'Soy Kaïro-Vel, ingeniero arturiano. Me obligaron a calibrar estas extractoras.'], ['kairo', 'Llévame a tu nave, {N}. Con un taller decente, haré que tus armas canten.']],
      mnemo: [['mnemo', 'Shh... los registros escuchan. Llevo ciclos escondido entre estos muros.'], ['mnemo', 'Soy Mnemo, archivista andromedano. Guardo la memoria de las especies de Plenuria.'], ['mnemo', 'Tu nave tiene un Archivo Biológico, ¿verdad? Déjame cuidarlo. Juntos documentaremos los nueve mundos.']],
      ssaru: [['ssaru', '¡Atrás, metálico! ...Espera. No hueles a Esquelético.'], ['ssaru', 'Soy Ssaru, del clan de cazadores reptilianos. Los Krazith eran nuestros hermanos de caza.'], ['ssaru', 'Thersek los convirtió en monstruos. Llévame contigo: te enseñaré a pelear de verdad.']]
    }[npc] || P.D.RESCUE[npc].lines;
    this.cutscene = true;
    this.say(N, () => {
      P.State.rescue(npc); P.State.addXP(40);
      P.Audio.sfx('restore');
      for (let i = 0; i < 30; i++) this.parts.add({ x: w.cx + P.rand(-6, 6), y: w.y + P.rand(0, 20), vy: -P.rand(1, 3), life: 40, col: '#5ee8ff', size: 2, glow: 4 });
      w.dead = true; this.cutscene = false;
      P.toast(((P.D.RESCUE && P.D.RESCUE[npc] && P.D.RESCUE[npc].name) || { sylae: 'Sylaë', kairo: 'Kaïro-Vel', mnemo: 'Mnemo', ssaru: 'Ssaru' }[npc] || npc) + ' se ha trasladado a la nave', { col: P.UIC.cyan, icon: 'npc_' + npc });
    });
  }
  startScan(target) { this.scanning = { target, t: 0 }; P.Audio.sfx('scan'); }
  onExtractorDestroyed(e) {
    this.waves.push({ x: e.cx, r: 0 }); this.extractorsLeft--;
    P.Audio.sfx('restore');
    if (this.extractorsLeft <= 0) { P.toast('¡Territorio liberado! El portal se ha abierto.', { col: P.UIC.green, icon: 'i_leaf', life: 260 }); if (P.Audio.TRACKS[this.def.music + '_r']) { P.Audio.stopMusic(); P.Audio.music(this.def.music + '_r', this.musVar); } }
    else P.toast('Extractora destruida. Quedan ' + this.extractorsLeft, { col: P.UIC.green, icon: 'i_leaf' });
  }
  startArena(e) {
    const x0 = Math.floor(e.home.x / (24 * TS)) * 24 * TS; this.arena = { x0, x1: x0 + 24 * TS, e };
    this.minX = x0; this.maxX = x0 + 24 * TS; P.Audio.sfx('roar'); P.shake(4, 20);
    P.toast('¡' + ((P.D.species(e.kind) || {}).name || 'Krazith Alfa').toUpperCase() + '!', { col: P.UIC.red, icon: (P.D.species(e.kind) || {}).spr || 'krazith_alfa' }); P.Audio.music('boss', 'alfa:' + this.musVar);
  }
  endArena() { this.arena = null; this.minX = 0; this.maxX = this.W; P.Audio.music(this.extractorsLeft <= 0 && P.Audio.TRACKS[this.def.music + '_r'] ? this.def.music + '_r' : this.def.music, this.musVar); }
  onPlayerZero() {
    const nova = this.companions.find(c => c instanceof P.Nova && !c.used);
    const p = this.player;
    if (nova) { p.hp = 1; p.iframes = 240; this.cutscene = true; nova.appear(); this.novaT = 0; return; }
    p.dead = true; p.vy = -3; P.Audio.sfx('death'); P.State.data.stats.deaths++; this.deadT = 0;
    this.parts.burst(p.cx, p.cy, 30, { col: '#ff5a5a', smin: 1, smax: 4, g: 0.15, size: 2 });
  }
  novaStrike(nova) {
    const p = this.player, S = P.State;
    p.hp = Math.round(p.maxHP * 0.75); p.iframes = 120; this.cutscene = false;
    S.data.stats.novaSaves++; S.ach('nova');
    P.Audio.sfx('super'); P.shake(6, 30); P.hitstop = 8;
    this.fx.push({ k: 'ring', x: nova.cx, y: nova.cy, t: 0, life: 40, r: 260, col: '#ff6fb3' });
    const boss = this.ents.find(e => e.boss && !e.dead && !e.dying);
    if (boss) {
      const d = Math.round(boss.maxhp * 0.15); boss.hp = Math.max(1, boss.hp - d); boss.flash = 20;
      this.popups.push({ x: boss.cx, y: boss.y - 20, text: '-' + d, col: '#ff8ad8', t: 0, big: true });
      this.fx.push({ k: 'bolt', x0: nova.cx, y0: nova.cy, x1: boss.cx, y1: boss.cy, t: 0, life: 30 });
    } else {
      const foes = this.ents.filter(e => e.isEnemy && !e.dead && !e.objective && !e.passive && !(e instanceof P.Cage) && !e.boss);
      foes.sort(() => Math.random() - 0.5);
      foes.slice(0, Math.ceil(foes.length / 2)).forEach((e, i) => { this.fx.push({ k: 'bolt', x0: nova.cx, y0: nova.cy, x1: e.cx, y1: e.cy, t: -i * 3, life: 30 }); e.die(); });
    }
    p.heal(0, false);
    P.toast('NOVA: «¡Te tengo, ' + S.name + '!»', { col: '#ff8ad8', icon: 'por_nova', life: 200 });
  }
  onBossDefeated(b) {
    this.cutscene = true; P.Audio.stopMusic(); P.Audio.sfx('victory');
    const S = P.State, O = P.D.BOSS_OUTRO[this.def.boss];
    setTimeout(() => {
      this.say(O.lines, () => {
        if (O.up) S.giveUpgrade(O.up);
        if (O.skin && !S.data.skins.includes(O.skin)) S.data.skins.push(O.skin);
        const extra = (P.SKIN_BONUS[O.skin] || []).filter(k => P.HERO_SKINS[k] && !S.data.skins.includes(k)); for (const k of extra) S.data.skins.push(k);
        if (O.mem) S.data.mems[O.mem] = true;
        S.data.planets[this.planet].boss = true;
        this.player.st = S.stat();
        const end = () => { if (O.after) { O.after(this); return; } if (O.skin) P.toast('Nueva armadura: ' + P.HERO_SKINS[O.skin].name + ' (Arsenal)', { col: P.UIC.green, icon: 'i_star', life: 260 }); for (const k of extra) P.toast('Nueva armadura: ' + P.HERO_SKINS[k].name + ' (Arsenal)', { col: P.UIC.green, icon: 'i_star', life: 260 }); this.finish(true); };
        const mem = () => O.mem ? P.openUI(new P.LoreView(P.D.MEMORIES[O.mem], 'mem', end)) : end();
        if (O.up) P.openUI(new P.UpgradeView(O.up, mem)); else mem();
      });
    }, 1200);
  }
  finish(boss) {
    if (this.finished) return; this.finished = true;
    const S = P.State, first = S.completeLevel(this.planet, this.id, { noDmg: this.noDmg });
    const res = { name: this.def.name, kills: S.data.stats.kills - this.kills0, time: this.t / 60, noDmg: this.noDmg, first, boss: !!boss,
      stars: Object.keys(this.lvs.stars).length, secrets: Object.keys(this.lvs.secrets).length };
    if (first) S.addXP(boss ? 0 : 50 + this.id * 10);
    this.cutscene = true; P.Audio.stopMusic(); P.Audio.sfx('victory');
    S.autosave();
    P.openUI(new P.LevelDone(res, () => {
      if (boss) { if (first) S.data.flags.postBoss = this.def.boss; /* los diálogos de la nave solo la primera vez */ S.save('auto'); P.goto(new P.ShipScene('navegacion')); return; }
      const after = this.def.outro && first ? this.def.outro : null;
      const go = () => P.goto(new P.OverworldScene(this.planet, this.id));
      if (after) { after.forEach(l => S.msg(l[0], l[1])); P.openUI(new P.Dialog(after, go, true)); } else go();
    }));
  }
  respawn() {
    const p = this.player, cp = this.checkpoint;
    p.dead = false; p.hp = p.maxHP; p.x = cp.x; p.y = cp.y; p.vx = p.vy = 0; p.iframes = 90; p.hurtT = 0; p.climb = false; p.energy = Math.max(p.energy, 0);
    for (const c of this.companions) { c.x = p.x - 10; c.y = p.y; }
    this.snapCam();
  }
  // ---------- actualización ----------
  update() {
    const p = this.player, I = P.input;
    this.t++;
    if (this.boss && this.boss.phase && !this.boss.dead) P.Audio.setIntensity(this.boss.dying ? 1 : (this.boss.intensity || this.boss.phase)); // la música sube con las fases del jefe
    if (this.introPending && this.t > 20) {
      this.introPending = false;
      const go = () => { if (this.def.boss) P.openUI(new P.BossIntro(P.D.BOSSES[this.def.boss], () => { this.boss.active = true; this.boss.state = 'roar'; this.boss.st = 0; P.Audio.sfx('roar'); })); };
      const intro = () => { if (this.def.intro && (!this.def.boss || !this.lvs.bossSeen)) { this.lvs.bossSeen = true; this.say(this.def.intro, go); } else go(); };
      // cinemática propia del nivel antes de la presentación (p. ej. la caída de la cúpula de Merek)
      if (this.def.cinematic && P[this.def.cinematic] && !this.lvs.cineSeen) { this.lvs.cineSeen = true; P.openUI(new P[this.def.cinematic](this, intro)); } else intro();
      return;
    }
    if (I.pressed('pause') && !this.finished) { P.openUI(new P.PauseMenu(this)); return; }
    if (this.banner > 0) this.banner--;
    // escaneo
    if (this.scanning) {
      const s = this.scanning; s.t++; p.vx = 0;
      if (s.t >= 50) { if (s.target.species) P.State.task(s.target.species, 'scan'); else if (s.target.tileSpecies) P.State.task(s.target.tileSpecies, 'scan'); this.scanning = null; }
    } else p.update();
    for (const c of this.companions) c.update();
    // olas de restauración
    for (const w of this.waves) if (w.r < this.W) {
      w.r += 7;
      if (this.t % 2 === 0) for (const s of [-1, 1]) { const x = w.x + s * w.r, ty = this.groundBelow(x); if (ty != null) this.parts.add({ x, y: ty - 2, vy: -P.rand(1, 3), vx: s * 0.5, life: 40, col: P.pick(['#9cff6a', '#5ef0d0', '#ffd166']), size: 2, glow: 4 }); }
    }
    if (this.waves.length || this.restoredAll) {
      for (const e of this.ents) {
        if (!e.isEnemy || e.dead || e.boss || e.objective || e instanceof P.Cage) continue;
        if (!this.restoredAt(e.cx)) continue;
        if (!e.natural && !e.mini) { if (e.cyber || e instanceof P.Soldier || e instanceof P.Maw) { e.die(); } }
        else if (e.natural && !e.angry && !e.passive) { e.passive = true; e.state = 'idle'; }
      }
      if (this.t % 15 === 0) this.resolvePending(false);
    }
    // entidades
    for (const e of this.ents) if (!e.dead) e.update();
    if (this.A.levelUpdate) this.A.levelUpdate(this);
    this.ents = this.ents.filter(e => !e.dead);
    this.parts.update();
    for (const pp of this.popups) pp.t++; this.popups = this.popups.filter(pp => pp.t < 45);
    for (const f of this.fx) f.t++; this.fx = this.fx.filter(f => f.t < f.life);
    for (const k in this.bounce) if (--this.bounce[k] <= 0) delete this.bounce[k];
    // disparadores
    for (const tr of this.pending) if (tr.k === 'trigger' && !tr.done && p.cx > tr.x - 40) { tr.done = true; this.lvs[tr.once] = true; tr.lines.forEach(l => P.State.msg(l[0], l[1])); this.say(tr.lines); }
    // tutorial
    if (this.tutorial) { const ci = Math.floor(p.cx / (24 * TS)); if (ci !== this.tutIdx) { this.tutIdx = ci; const fn = ci === 0 ? () => 'Muévete con ' + P.input.label('left') + '/' + P.input.label('right') + ' · Salta con ' + P.input.label('jump') + ' (mantén para saltar más alto)' : P.TUT_L1[ci]; if (fn) { this.tip = fn(); this.tipT = 420; } } }
    if (this.tipT > 0) this.tipT--;
    // especies vegetales en teselas
    if (this.t % 30 === 0) this.checkTileFlora();
    // techo invisible por encima del mapa
    if (p.y < -40) { p.y = -40; if (p.vy < 0) p.vy = 0; }
    // caída al vacío
    if (!p.dead && p.y > this.H + 10) {
      p.hurt(20, p.cx, { env: true, noKnock: true });
      if (!p.dead) { p.x = p.lastSafe.x; p.y = p.lastSafe.y - 4; p.vx = p.vy = 0; p.iframes = 80; }
    }
    if (p.dead) { this.deadT++; if (this.deadT === 100) P.openUI(new P.DeathMenu(this)); }
    // NOVA: animación en curso
    this.updateCam();
    // interacción
    this.focus = null;
    if (!p.dead && !this.cutscene && !this.scanning) {
      let best = null, bd = 28;
      for (const e of this.ents) if (e.interact && !e.dead) { const d = P.dist(p.cx, p.cy, e.cx, e.cy + (e.h > 20 ? 4 : 0)); if (d < bd) { bd = d; best = e; } }
      if (!best) best = this.tileFloraNear(p);
      this.focus = best;
      if (best && I.pressed('interact')) { if (best.tileSpecies) this.startScan(best); else best.use(); }
    }
  }
  checkTileFlora() {
    const c = this.cam, sp = this.A.tileFlora || { b: 'bulbo', '|': 'vidlumbre', '^': 'espinaria' };
    const seen = {};
    for (let ty = Math.floor(c.y / TS); ty <= Math.floor((c.y + P.H) / TS); ty++) for (let tx = Math.floor(c.x / TS); tx <= Math.floor((c.x + P.W) / TS); tx++) { const s = sp[this.tile(tx, ty)]; if (s) seen[s] = true; }
    for (const s in seen) { const e = P.State.data.codex[s]; if (!e || !e.seen) P.State.see(s); }
  }
  tileFloraNear(p) {
    const sp = this.A.tileFlora || { b: 'bulbo', '|': 'vidlumbre', '^': 'espinaria' };
    for (let ty = Math.floor((p.cy - 20) / TS); ty <= Math.floor((p.cy + 20) / TS); ty++) for (let tx = Math.floor((p.cx - 20) / TS); tx <= Math.floor((p.cx + 20) / TS); tx++) {
      const s = sp[this.tile(tx, ty)]; if (!s) continue;
      const e = P.State.data.codex[s], def = P.D.species(s), i = def.tasks.findIndex(t => t.k === 'scan');
      if (e && e.prog[i] >= 1) continue;
      return { tileSpecies: s, cx: tx * TS + 8, cy: ty * TS + 8, x: tx * TS, y: ty * TS, w: 16, h: 16, prompt: 'Escanear' };
    }
    return null;
  }
  snapCam() { this.updateCam(true); }
  updateCam(snap) {
    const p = this.player, c = this.cam;
    let tx = p.cx - P.W / 2 + p.face * 36, ty = p.cy - P.H / 2 - 10;
    let x0 = 0, x1 = this.W - P.W;
    if (this.arena) { x0 = this.arena.x0 - (P.W - 24 * TS) / 2; x1 = x0; }
    tx = P.clamp(tx, x0, Math.max(x0, x1)); ty = P.clamp(ty, 0, Math.max(0, this.H - P.H));
    if (snap) { c.x = tx; c.y = ty; } else { c.x += (tx - c.x) * 0.1; c.y += (ty - c.y) * 0.12; }
    c.x = P.clamp(c.x, 0, Math.max(0, this.W - P.W)); c.y = P.clamp(c.y, 0, Math.max(0, this.H - P.H));
  }
  debugInfo() { return `ents ${this.ents.length} parts ${this.parts.a.length} x ${Math.round(this.player.x / 16)}`; }
  onLevelUp() { const p = this.player, old = p.maxHP; p.st = P.State.stat(); p.maxHP = p.st.maxHP; p.hp += p.maxHP - old; }

  // ---------- dibujo ----------
  draw(c) {
    const cx = Math.round(this.cam.x), cy = Math.round(this.cam.y), rf = this.restoredFrac();
    P.sprPrefix = this.A.p || '';
    this.drawBG(c, cx, cy, rf);
    P.FX.afterBG(this, c, cx, cy);
    this.drawSupports(c, cx, cy);
    this.drawTiles(c, cx, cy, false);
    P.FX.props(this, c, cx, cy); P.FX.shadows(this, c, cx, cy);
    const afx = this.planet === 'dyson' && P.AnimFX;
    for (const e of this.ents) if (!(e instanceof P.Proj) && !(e instanceof P.Pickup) && e.onScreen(60)) { if (afx && e.isEnemy && !e.boss) P.AnimFX.wrap(c, e, cx, cy, () => e.draw(c, cx, cy)); else e.draw(c, cx, cy); }
    for (const k of this.companions) k.draw(c, cx, cy);
    this.player.draw(c, cx, cy);
    for (const e of this.ents) if ((e instanceof P.Proj || e instanceof P.Pickup) && e.onScreen(20)) e.draw(c, cx, cy);
    this.drawTiles(c, cx, cy, true);
    this.parts.draw(c, cx, cy);
    this.drawFX(c, cx, cy);
    this.drawLight(c, cx, cy, rf);
    this.ambient(cx, cy, rf);
    if (this.A.levelDraw) this.A.levelDraw(this, c);
    for (const pp of this.popups) P.txt(c, pp.text, pp.x - cx, pp.y - cy - pp.t * 0.6, pp.col, { align: 'center', outline: true, shadow: '#000', scale: pp.big ? 1 : 1 });
    this.drawScan(c, cx, cy);
    if (this.arena) { for (const x of [this.arena.x0, this.arena.x1]) { c.globalAlpha = 0.4 + Math.sin(this.t * 0.2) * 0.2; c.fillStyle = '#ff3a5a'; c.fillRect(x - cx - 2, 0, 3, P.H); c.globalAlpha = 1; } }
    if (P.BGL && P.FX.outdoor(this)) P.BGL.front(this, c, cx, cy);
    P.FX.front(this, c, cx, cy); P.FX.post(c, P.FX.profLevel(this, rf));
    P.sprPrefix = '';
    P.HUD.draw(c, this);
  }
  drawBG(c, cx, cy, rf) {
    if (this.A.drawBG) { this.A.drawBG(this, c, cx, cy, rf); return; }
    const th = this.theme, vy = (this.H - P.H - cy);
    if (th === 'facility' || th === 'lab' || th === 'cave' || th === 'deep') {
      c.fillStyle = '#05060a'; c.fillRect(0, 0, P.W, P.H);
      const bg = P.SP(th === 'deep' ? 'bg_deep' : th === 'cave' ? 'bg_cave' : th === 'lab' ? 'bg_lab' : 'bg_fac').f[0];
      const off = -((cx * 0.35) % bg.width);
      for (let x = off; x < P.W; x += bg.width) c.drawImage(bg, Math.round(x), Math.round(vy * 0.2));
      return;
    }
    const layer = (name, f, yo) => { const im = P.SP(name).f[0]; const off = -((cx * f) % im.width); for (let x = off - (off > 0 ? im.width : 0); x < P.W; x += im.width) c.drawImage(im, Math.round(x), Math.round(yo)); };
    const hazeCol = (this.A.skies || P.SKIES)[this.sky];
    const draw = (st, a) => {
      if (a <= 0) return; c.globalAlpha = a;
      c.drawImage(P.SP('bg_sky_' + st + '_' + this.sky).f[0], 0, Math.round(vy * 0.05));
      const fx = this.A.bgFx; if (fx) fx(this, c, cx, vy, 0, st, a);
      layer('bg_far_' + st, 0.12, vy * 0.12 + 14); if (fx) fx(this, c, cx, vy, 1, st, a);
      // bruma atmosférica entre capas
      const g = c.createLinearGradient(0, 150, 0, P.H); g.addColorStop(0, P.Col.rgba(hazeCol[st][3], 0)); g.addColorStop(1, P.Col.rgba(hazeCol[st][3], 0.45)); c.fillStyle = g; c.fillRect(0, 150, P.W, P.H - 150);
      if (P.BGL) P.BGL.layer(this, c, cx, vy, 0, st);
      layer('bg_mid_' + st, 0.3, vy * 0.25 + 22); if (fx) fx(this, c, cx, vy, 2, st, a); P.FX.landmarks(this, c, cx, vy); if (P.BGL) P.BGL.layer(this, c, cx, vy, 1, st);
      layer('bg_near_' + st, 0.55, vy * 0.45 + 6); if (fx) fx(this, c, cx, vy, 3, st, a); if (P.BGL) P.BGL.layer(this, c, cx, vy, 2, st);
      c.globalAlpha = 1;
    };
    draw('c', 1); draw('r', rf);
    // matiz del momento del día
    if (this.sky === 'golden') { c.fillStyle = 'rgba(255,170,90,0.08)'; c.fillRect(0, 0, P.W, P.H); }
    if (this.sky === 'dusk') { c.fillStyle = 'rgba(90,30,110,0.16)'; c.fillRect(0, 0, P.W, P.H); }
    // árboles gigantes del plano medio (fijos al mundo)
    for (const t of this.bigTrees) {
      const x = t.x - cx - 55, y = t.y - cy - 186; if (x > P.W || x < -120) continue;
      const st = this.restoredAt(t.x) ? 'r' : 'c';
      P.drawSway(c, 'bigtree_' + st, t.v, x, y, { t: this.t, ph: t.x * 0.013, amp: (this.A.rigidTrees || []).includes(t.v) ? 0 : 2.4, flutter: 0.6, base: 186 });
    }
  }
  drawTiles(c, cx, cy, liquidPass) {
    const tx0 = Math.floor(cx / TS) - 1, tx1 = Math.floor((cx + P.W) / TS) + 1, ty0 = Math.floor(cy / TS) - 1, ty1 = Math.floor((cy + P.H) / TS) + 1;
    const metal = this.theme === 'facility' || this.theme === 'lab', ruins = this.theme === 'ruins';
    const af = Math.floor(this.t / 10) % 4;
    if (liquidPass) c.globalAlpha = this.A.liqAlpha || (this.theme === 'deep' ? 0.5 : 0.82);
    for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) {
      const ch = this.tile(tx, ty); if (ch === '.') continue;
      const X = tx * TS - cx, Y = ty * TS - cy, h = (tx * 7 + ty * 13) % 3, st = this.restoredAt(tx * TS + 8) ? 'r' : 'c';
      if (liquidPass) { if (ch === '~') { if (this.A.drawLiquid) this.A.drawLiquid(this, c, X, Y, tx, ty, st); else P.spr(c, (this.tile(tx, ty - 1) === '~' ? 't_liqb_' : 't_liq_') + st, af + tx, X, Y); } continue; }
      const up = this.tile(tx, ty - 1), air = u => u === '.' || u === '~' || u === '|' || u === '^' || u === '=' || u === '-';
      switch (ch) {
        case '#': case 'S':
          if (metal) { P.spr(c, 't_metal', h, X, Y); if (air(up)) P.spr(c, 't_metaltop', 0, X, Y); break; }
          P.spr(c, 't_soil_' + st, h, X, Y);
          if (this.A.strata) { c.fillStyle = this.A.strata[((ty % this.A.strata.length) + this.A.strata.length) % this.A.strata.length]; c.fillRect(X, Y, 16, 16); }
          { let dep = 0; while (dep < 4 && P.SOLID[this.tile(tx, ty - dep - 1)] === 1) dep++; if (dep) { c.fillStyle = 'rgba(20,4,30,' + dep * 0.11 + ')'; c.fillRect(X, Y, 16, 16); } }
          if (air(this.tile(tx - 1, ty))) { c.fillStyle = 'rgba(255,255,255,0.12)'; c.fillRect(X, Y, 1, 16); c.fillStyle = 'rgba(30,0,40,0.25)'; c.fillRect(X + 1, Y, 1, 16); }
          if (air(this.tile(tx + 1, ty))) { c.fillStyle = 'rgba(30,0,40,0.3)'; c.fillRect(X + 14, Y, 2, 16); }
          if (air(up)) {
            P.spr(c, 't_top_' + st, h, X, Y - 3);
            const hh = (tx * 31 + ty * 17) % 7;
            if (up === '.' && hh < 4) P.spr(c, 'tdeco_' + st, (tx * 5 + ty * 3) % 6, X, Y - 13);
          }
          if (air(this.tile(tx, ty + 1)) && this.tile(tx, ty + 1) !== '~') P.spr(c, 't_bot_' + st, h % 2, X, Y + 16);
          break;
        case 'R': P.spr(c, 't_ruin', h, X, Y); if (air(up)) P.spr(c, 't_ruintop', 0, X, Y - 2); break;
        case 'M': P.spr(c, 't_metal', h, X, Y); if (air(up)) P.spr(c, 't_metaltop', 0, X, Y); break;
        case 'B': P.spr(c, 't_crack', 0, X, Y); break;
        case 'I': P.spr(c, 't_ice_' + st, h, X, Y); if (air(up)) { c.fillStyle = 'rgba(255,255,255,0.55)'; c.fillRect(X, Y, 16, 1); } break;
        case '=': P.spr(c, 't_branch_' + st, h % 2, X, Y); break;
        case '-': P.spr(c, 't_grate', 0, X, Y); break;
        case '^': P.spr(c, 't_thorn_' + st, Math.floor(this.t / 30 + tx) % 2, X, Y); break;
        case '|': P.spr(c, 't_vine_' + st, (tx + ty) % 2, X, Y); break;
        default: if (this.A.drawTile) this.A.drawTile(this, c, ch, X, Y, tx, ty, st); break;
        case 'b': { const b = this.bounce[tx + ',' + ty]; P.spr(c, 't_bulb_' + st, b ? (b > 6 ? 1 : 2) : 0, X, Y); P.drawGlow(c, X + 8, Y + 6, 10, st === 'r' ? '#2fd0b0' : '#c04ad0', 0.35); break; }
      }
    }
    c.globalAlpha = 1;
  }
  drawFX(c, cx, cy) {
    for (const f of this.fx) {
      if (f.t < 0) continue;
      const k = f.t / f.life;
      if (f.k === 'ring') { c.strokeStyle = f.col; c.globalAlpha = 1 - k; c.lineWidth = 3; c.beginPath(); c.arc(f.x - cx, f.y - cy, f.r * k, 0, 7); c.stroke(); c.lineWidth = 1; c.globalAlpha = 1; P.drawGlow(c, f.x - cx, f.y - cy, f.r * k * 0.6, f.col, 0.4 * (1 - k)); }
      if (f.k === 'beam') { c.globalAlpha = 1 - k; c.fillStyle = '#ffd166'; c.fillRect(f.x0 - cx, f.y - cy, f.x1 - f.x0, f.h); for (let i = 0; i < 4; i++) { c.fillStyle = ['#ff5af0', '#5ee8ff', '#7dffa0', '#ffffff'][i]; c.fillRect(f.x0 - cx, f.y - cy + 2 + i * 3, f.x1 - f.x0, 2); } c.globalAlpha = 1; }
      if (f.k === 'bolt') { c.strokeStyle = '#ff8ad8'; c.globalAlpha = 1 - k; c.lineWidth = 2; c.beginPath(); c.moveTo(f.x0 - cx, f.y0 - cy); for (let i = 1; i < 6; i++) { const t = i / 6; c.lineTo(P.lerp(f.x0, f.x1, t) - cx + P.rand(-6, 6), P.lerp(f.y0, f.y1, t) - cy + P.rand(-6, 6)); } c.lineTo(f.x1 - cx, f.y1 - cy); c.stroke(); c.lineWidth = 1; c.globalAlpha = 1; P.drawGlow(c, f.x1 - cx, f.y1 - cy, 16, '#ff6fb3', 1 - k); }
    }
  }
  drawLight(c, cx, cy, rf) {
    let amb = null;
    if (this.sky === 'dusk') amb = 'rgba(20,8,40,' + (0.38 - rf * 0.12) + ')';
    else if (this.theme === 'facility' || this.theme === 'lab') amb = 'rgba(10,8,24,0.18)';
    else if (this.theme === 'cave') amb = 'rgba(14,6,30,0.3)';
    else if (this.theme === 'deep') amb = 'rgba(2,14,40,0.1)';
    if (this.A.lightAmb) amb = this.A.lightAmb(this, amb, rf);
    // de día no se oscurece la escena: solo un suave matiz violeta si está contaminada
    if (!amb) { if (rf < 1) { c.fillStyle = 'rgba(80,20,110,' + (0.08 * (1 - rf)) + ')'; c.fillRect(0, 0, P.W, P.H); } return; }
    P.Light.begin(amb);
    const p = this.player;
    P.Light.add(p.cx - cx, p.cy - cy, 90, 1);
    for (const e of this.ents) {
      if (e.dead) continue;
      if (e.light && e.onScreen(60)) P.Light.add(e.cx - cx, e.y + 6 - cy, e.lightR || 50, 0.9);
      else if (e instanceof P.Proj && e.glow) P.Light.add(e.cx - cx, e.cy - cy, 24, 0.7);
      else if (e instanceof P.Extractor || e instanceof P.Gate || e instanceof P.Beacon || e instanceof P.Item || e.boss) P.Light.add(e.cx - cx, e.cy - cy, e.boss ? 120 : 50, 0.8);
    }
    for (const k of this.companions) if (!k.hidden) P.Light.add(k.cx - cx, k.cy - cy, 34, 0.6);
    for (const f of this.fx) if (f.k === 'ring') P.Light.add(f.x - cx, f.y - cy, f.r, 1 - f.t / f.life);
    if (this.A.lights) this.A.lights(this, cx, cy);
    P.Light.end(c);
  }
  ambient(cx, cy, rf) {
    if (P.BGL) P.BGL.ambient(this, cx, cy, rf);
    if (this.A.ambient && this.A.ambient(this, cx, cy, rf)) return;
    if (this.theme === 'facility' || this.theme === 'lab') { if (this.t % 6 === 0) this.parts.add({ x: cx + P.rand(0, P.W), y: cy + P.rand(0, P.H), vy: -0.2, life: 80, col: '#6c7488', size: 1 }); return; }
    if (this.t % 4 === 0) {
      const r = Math.random() < rf, day = this.sky !== 'dusk' && this.theme !== 'cave';
      this.parts.add({ x: cx + P.rand(0, P.W), y: cy + P.rand(0, P.H), vx: P.rand(-0.2, 0.2), vy: r ? P.rand(-0.3, 0.1) : P.rand(0.05, 0.3), life: P.ri(80, 160),
        col: r ? P.pick(day ? ['#ffffff', '#fff4a0', '#d0ff90'] : ['#9cff6a', '#5ef0d0', '#ffd166']) : P.pick(['#c8ff4a', '#ff8af0']), size: 1, glow: day ? 0 : 3, fn: q => { q.vx += Math.sin((q.life + q.x) * 0.05) * 0.01; } });
    }
    // pétalos y hojas que caen con el viento
    if (this.theme !== 'cave' && this.t % 14 === 0) {
      const r = Math.random() < rf, col = r ? P.pick(['#ff6ab0', '#ffd166', '#6ee44a', '#ff9ad0']) : P.pick(['#e05ed8', '#a834b8', '#c8ff4a']);
      this.parts.add({ x: cx + P.rand(-20, P.W), y: cy - 4, vx: P.rand(0.3, 0.8), vy: P.rand(0.3, 0.6), life: 400, col, size: 2, fade: false, fn: q => { q.vx = 0.5 + Math.sin(q.life * 0.05) * 0.6; q.vy = 0.45 + Math.cos(q.life * 0.07) * 0.2; } });
    }
  }
  drawScan(c, cx, cy) {
    const p = this.player, f = this.focus;
    if (this.scanning) {
      const s = this.scanning, t = s.target, k = s.t / 50;
      c.strokeStyle = '#5ee8ff'; c.globalAlpha = 0.6;
      const ex = p.cx - cx + p.face * 4, ey = p.y + 5 - cy;
      for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(ex, ey); c.lineTo(t.x - cx + Math.random() * t.w, t.y - cy + (t.h * ((k * 3 + i / 3) % 1))); c.stroke(); }
      c.globalAlpha = 1; c.strokeRect(Math.round(t.x - cx) - 1.5, Math.round(t.y - cy) - 1.5, t.w + 3, t.h + 3);
      P.bar(c, Math.round(t.cx - cx - 15), Math.round(t.y - cy - 10), 30, 4, k, '#5ee8ff');
      P.txt(c, 'ESCANEANDO', t.cx - cx, t.y - cy - 20, '#5ee8ff', { align: 'center' });
    } else if (f && !this.cutscene) {
      const label = f.prompt || 'Interactuar', x = Math.round(f.cx - cx), y = Math.round(f.y - cy - 16 + Math.sin(this.t * 0.15) * 1.5);
      const w = P.txtW(label) + P.txtW(P.input.label('interact')) + 14;
      P.panel(c, x - w / 2, y - 3, w, 13, { cut: 2, noAccent: true });
      P.keyHint(c, x - w / 2 + 3, y, 'interact', label, '#e8f4ff');
    }
  }
};
