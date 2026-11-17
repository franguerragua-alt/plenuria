'use strict';
// Estado de la partida: progresión, Archivo Biológico, misiones, logros y guardado
// la Armadura Solar (prototipo de la República) se recupera junto a la de Duna al vencer a ZARMAKH
P.SKIN_BONUS = { duna: ['solar'] };
P.State = {
  data: null, slot: null,
  init() { },
  fresh(name) {
    const d = {
      v: 1, name: name || P.D.DEFAULT_NAME, created: Date.now(), saved: 0, playtime: 0,
      xp: 0, lv: 1, sp: 0, skills: {},
      weapons: ['blaster'], weapon: 'blaster', ups: {}, skin: 'rojo', skins: ['rojo'], mods: {}, crafted: {},
      res: { bio: 0, scrap: 0, crys: 0 },
      planets: { verzara: { levels: {}, boss: false } },
      codex: {}, missions: {}, rooms: { camarote: true, puente: true, navegacion: true },
      npcs: {}, creatures: {}, comps: { unlocked: {}, equipped: [] },
      holos: {}, mems: {}, seeds: 0, ach: {}, msgs: [], flags: {},
      stats: { kills: 0, deaths: 0, shots: 0, dmgTaken: 0, secrets: 0, parries: 0, crafted: 0, observed: 0, rescues: 0, bossKills: 0, levels: 0, cyber: 0, novaSaves: 0 },
      ow: null, codexClaim: {}
    };
    return d;
  },
  newGame(name) { this.data = this.fresh(name); this.slot = null; this.ach('despertar'); },
  get name() { return this.data ? this.data.name : P.D.DEFAULT_NAME; },
  fmt(s) {
    return String(s).replace(/\{N\}/g, this.name)
      .replace(/\{attack\}/g, P.input.label('attack')).replace(/\{defend\}/g, P.input.label('defend'))
      .replace(/\{super\}/g, P.input.label('super')).replace(/\{dash\}/g, P.input.label('dash')).replace(/\{swap\}/g, P.input.label('swap'))
      .replace(/\{interact\}/g, P.input.label('interact')).replace(/\{jump\}/g, P.input.label('jump'));
  },
  // ---------- guardado ----------
  save(slot) {
    const d = this.data; if (!d) return false;
    d.saved = Date.now();
    const ok = P.Store.set('slot_' + slot, d);
    if (slot !== 'auto') this.slot = slot;
    return ok;
  },
  autosave() { if (this.data) { this.save('auto'); P.toast('Guardado automático', { col: P.UIC.dim, life: 90 }); } },
  load(slot) {
    const d = P.Store.get('slot_' + slot); if (!d) return false;
    const base = this.fresh(d.name);
    for (const k in base) if (d[k] === undefined) d[k] = base[k];
    for (const k in base.stats) if (d.stats[k] === undefined) d.stats[k] = 0;
    // trajes que llegan junto a otro (p. ej. el prototipo Solar con el de Duna): se reparan también en partidas antiguas
    for (const k in P.SKIN_BONUS) if (d.skins.includes(k)) for (const x of P.SKIN_BONUS[k]) if (!d.skins.includes(x)) d.skins.push(x);
    this.data = d; this.slot = slot === 'auto' ? null : slot; return true;
  },
  peek(slot) { return P.Store.get('slot_' + slot); },
  // ---------- estadísticas derivadas ----------
  has(skill) { return !!(this.data && this.data.skills[skill]); },
  stat() {
    const d = this.data, s = this.has.bind(this), cr = d.crafted;
    return {
      maxHP: 100 + (d.lv - 1) * 6 + (s('d1') ? 25 : 0) + (s('d4') ? 35 : 0) + (cr.vitalidad ? 15 : 0) + (d.mods.perla ? 20 : 0) + (d.mods.granate ? 15 : 0),
      dmgMul: (1 + (d.lv - 1) * 0.04) * (s('a1') ? 1.15 : 1) * (s('a4') ? 1.2 : 1) * (d.mods.sombra ? 1.08 : 1) * (d.mods.escoria ? 1.08 : 1) * (d.mods.cefiro ? 1.08 : 1),
      rateMul: s('a2') ? 0.8 : 1, crit: s('a5') ? 0.12 : 0, charge: s('a3'),
      shieldMax: 100 + (cr.escudo_cap ? 40 : 0) + (d.mods.escarcha ? 30 : 0), shieldDrain: s('d2') ? 0.65 : 1, parryWin: s('d3') ? 16 : 10,
      superGain: (s('e1') ? 1.3 : 1) * (d.mods.aurora ? 1.15 : 1) * (d.mods.hifa ? 1.1 : 1) * (d.mods.nectar ? 1.1 : 1), superDmg: s('e4') ? 1.4 : 1, superRefund: s('e5') ? 25 : 0,
      dashIF: s('e2') ? 22 : 14, dashCD: s('e2') ? 30 : 40, magnet: s('e3') ? 90 : 36,
      regen: s('d5'), photo: !!d.mods.fotosintesis, beastDmg: d.mods.instinto ? 1.12 : 1,
      swim: !!d.ups.branquias, tormenta: !!d.ups.tormenta, vision: !!d.ups.vision, obsidiana: !!d.ups.obsidiana, eclipse: !!d.ups.eclipse, resorte: !!d.ups.resorte, quitina: !!d.ups.quitina, micorriza: !!d.ups.micorriza, adherencia: !!d.ups.adherencia, cera: !!d.ups.cera, enjambre: !!d.ups.enjambre, vapor: !!d.ups.vapor, basalto: !!d.ups.basalto, erupcion: !!d.ups.erupcion, corriente: !!d.ups.corriente, egida: !!d.ups.egida, tempestad: !!d.ups.tempestad,
      glide: !!d.ups.planeo, thermal: !!d.ups.termico, boreal: !!d.ups.boreal,
      walljump: !!d.ups.garras, escamas: !!d.ups.escamas, quake: !!d.ups.sismico, dmgTaken: (d.mods.duna ? 0.9 : 1) * (d.ups.nacar ? 0.85 : 1) * (d.ups.quitina ? 0.9 : 1) * (d.ups.cera ? 0.88 : 1) * (d.mods.quitinaviva ? 0.95 : 1) * (d.ups.basalto ? 0.88 : 1) * (d.ups.egida ? 0.88 : 1), healMul: (d.mods.rocio ? 1.25 : 1) * (d.mods.marea ? 1.15 : 1) * (d.mods.micelio ? 1.1 : 1) * (d.mods.brasa ? 1.1 : 1) * (d.mods.nimbo ? 1.1 : 1),
      startEnergy: cr.bateria ? 40 : 0, reflect: !!d.ups.membrana, prism: !!d.ups.prisma, dbl: !!d.ups.doble_salto,
      weaponMul: { blaster: (cr.blaster_mk2 ? 1.25 : 1) * (cr.blaster_mk3 ? 1.25 : 1), espinas: 1, arena: cr.arena_mk2 ? 1.3 : 1, crio: cr.crio_mk2 ? 1.3 : 1, arpon: cr.arpon_mk2 ? 1.3 : 1, esquirla: cr.esquirla_mk2 ? 1.3 : 1, lanzaesporas: cr.lanzaesporas_mk2 ? 1.3 : 1, aguijon: cr.aguijon_mk2 ? 1.3 : 1, magma: cr.magma_mk2 ? 1.3 : 1, rayo: cr.rayo_mk2 ? 1.3 : 1 }, spines: cr.espinas_mk2 ? 5 : 3
    };
  },
  xpNeed(lv) { return 50 + (lv - 1) * 35; },
  addXP(n) {
    const d = this.data; d.xp += Math.round(n);
    while (d.xp >= this.xpNeed(d.lv)) {
      d.xp -= this.xpNeed(d.lv); d.lv++; d.sp++;
      P.Audio.sfx('levelup'); P.toast('¡NIVEL ' + d.lv + '! +1 punto de habilidad', { col: P.UIC.gold, icon: 'i_star' });
      if (P.scene && P.scene.onLevelUp) P.scene.onLevelUp();
      if (d.lv >= 10) this.ach('nivel10');
    }
  },
  addRes(k, n) { this.data.res[k] = (this.data.res[k] || 0) + n; },
  canPay(cost) { for (const k in cost) if ((this.data.res[k] || 0) < cost[k]) return false; return true; },
  pay(cost) { for (const k in cost) this.data.res[k] -= cost[k]; },
  // ---------- Archivo Biológico ----------
  cx(id) {
    const c = this.data.codex;
    if (!c[id]) { const sp = P.D.species(id); c[id] = { seen: false, prog: sp ? sp.tasks.map(() => 0) : [], done: false, isNew: false }; }
    return c[id];
  },
  see(id, restored) {
    const sp = P.D.species(id); if (!sp) return;
    const e = this.cx(id);
    if (!e.seen) {
      e.seen = true; e.isNew = true;
      P.Audio.sfx('codex'); P.toast('Nueva especie: ' + sp.name + (sp.col === 'flora' ? ' (Herbario)' : ' (Bestiario)'), { col: P.UIC.green, icon: sp.spr });
    }
    this.task(id, 'seen');
    if (restored) this.task(id, 'restored');
  },
  task(id, kind, amount = 1) {
    const sp = P.D.species(id); if (!sp) return;
    const e = this.cx(id); if (e.done) return;
    if (kind !== 'seen' && !e.seen) this.see(id);
    let changed = false;
    sp.tasks.forEach((t, i) => {
      const k = typeof t === 'string' ? t : t.k, need = typeof t === 'string' ? 1 : (t.n || 1);
      if (k === kind && e.prog[i] < need) { e.prog[i] = Math.min(need, e.prog[i] + amount); changed = true; if (kind === 'observe' && e.prog[i] >= need) { this.data.stats.observed++; if (this.data.stats.observed >= 5) this.ach('observador'); P.toast('Comportamiento registrado: ' + sp.name, { col: P.UIC.cyan, icon: sp.spr }); } if (kind === 'scan') P.toast('Escaneo completado: ' + sp.name, { col: P.UIC.cyan, icon: sp.spr }); }
    });
    if (changed && this.pct(id) >= 1 && !e.done) {
      e.done = true; e.isNew = true; P.Audio.sfx('unlock');
      P.toast('Registro completo: ' + sp.name, { col: P.UIC.gold, icon: sp.spr });
      this.addXP(sp.boss ? 0 : 15);
      this.checkCodex(sp.planet);
    }
  },
  pct(id) {
    const sp = P.D.species(id), e = this.data.codex[id]; if (!sp || !e) return 0;
    let tot = 0, got = 0;
    sp.tasks.forEach((t, i) => { const need = typeof t === 'string' ? 1 : (t.n || 1); tot += 1; got += Math.min(1, e.prog[i] / need); });
    return got / tot;
  },
  planetCodex(planet, col) {
    const list = P.D.SPECIES.filter(s => s.planet === planet && (!col || s.col === col));
    if (!list.length) return 0;
    return list.reduce((a, s) => a + (this.data.codex[s.id] && this.data.codex[s.id].done ? 1 : 0), 0) / list.length;
  },
  checkCodex(planet) {
    const R = P.D.CODEX_REWARDS[planet]; if (!R) return;
    const claim = this.data.codexClaim;
    for (const col of ['fauna', 'flora']) {
      const key = planet + '_' + col;
      if (!claim[key] && this.planetCodex(planet, col) >= 1) {
        claim[key] = true; this.data.mods[R[col].mod] = true;
        P.Audio.sfx('levelup'); P.toast('¡' + (col === 'fauna' ? 'Bestiario' : 'Herbario') + ' completo! Recompensa: ' + R[col].name, { col: P.UIC.gold, icon: 'i_trophy', life: 320 });
        this.ach(col === 'fauna' ? 'zoologo' : 'botanico');
      }
    }
    const key = planet + '_all';
    if (!claim[key] && this.planetCodex(planet) >= 1) {
      claim[key] = true; this.data.creatures[R.all.creature] = true; this.data.flags['santuario_' + planet] = true; if (planet === 'verzara') this.data.flags.santuario = true;
      P.toast('¡Archivo de ' + P.D.planet(planet).name + ' al 100 %! ' + R.all.name, { col: P.UIC.gold, icon: 'i_trophy', life: 360 });
      if (planet === 'verzara') this.missionDone('s_codex');
    }
  },
  // ---------- misiones ----------
  mission(id) { return this.data.missions[id]; },
  startMission(id) {
    if (this.data.missions[id]) return;
    const m = this.data.missions[id] = { state: 'active', prog: 0 }, def = P.D.MISSIONS[id];
    P.toast('Nueva misión: ' + def.name, { col: P.UIC.gold, icon: 'i_star' }); P.Audio.sfx('unlock');
    // lo recogido antes de recibir la misión también cuenta
    if (def.count) { m.prog = Math.min(def.goal, def.count(this.data)); if (m.prog >= def.goal) this.missionDone(id); }
  },
  missionProg(id, n = 1) {
    const m = this.data.missions[id]; if (!m || m.state !== 'active') return;
    m.prog += n; const def = P.D.MISSIONS[id];
    if (m.prog >= def.goal) this.missionDone(id);
  },
  missionDone(id) {
    let m = this.data.missions[id];
    if (!m) m = this.data.missions[id] = { state: 'active', prog: 0 };
    if (m.state === 'done') return;
    m.state = 'done'; const def = P.D.MISSIONS[id]; m.prog = def.goal;
    const r = def.reward || {};
    if (r.xp) this.addXP(r.xp);
    for (const k of ['bio', 'scrap', 'crys']) if (r[k]) this.addRes(k, r[k]);
    P.toast('Misión completada: ' + def.name, { col: P.UIC.gold, icon: 'i_trophy' }); P.Audio.sfx('victory');
  },
  // ---------- logros ----------
  ach(id) {
    if (!this.data || this.data.ach[id]) return;
    const a = P.D.ACHIEVEMENTS.find(x => x.id === id); if (!a) return;
    this.data.ach[id] = Date.now();
    P.toast('Logro: ' + a.name, { col: P.UIC.violet, icon: 'i_trophy' });
  },
  // ---------- mundo ----------
  lvState(planet, id) {
    const pl = this.data.planets[planet] || (this.data.planets[planet] = { levels: {}, boss: false });
    return pl.levels[id] || (pl.levels[id] = { done: false, stars: {}, chests: {}, secrets: {}, npcs: {} });
  },
  lvUnlocked(planet, id) { if (P.settings.dev) return true; return id === 1 || this.lvState(planet, id - 1).done; },
  lvDone(planet, id) { return !!(this.data.planets[planet] && this.data.planets[planet].levels[id] && this.data.planets[planet].levels[id].done); },
  liberatedAll() { let n = 0; for (const p of P.D.PLANETS) n += this.liberated(p.id); return n; },
  liberated(planet) { let n = 0; for (let i = 1; i <= 10; i++) if (this.lvDone(planet, i)) n++; return n; },
  completeLevel(planet, id, info) {
    const s = this.lvState(planet, id), first = !s.done;
    s.done = true;
    if (first) {
      this.data.stats.levels++;
      this.ach('liberador');
      if (info && info.noDmg) this.ach('intacto');
      if (planet === 'verzara' && this.liberated(planet) >= 10) this.ach('selva');
      this.onFirstClear(planet, id);
    }
    return first;
  },
  unlockRoom(id, silent) {
    if (this.data.rooms[id]) return;
    this.data.rooms[id] = true;
    const r = P.D.ROOMS.find(x => x.id === id);
    if (!silent && r) { P.toast('Nave: sala desbloqueada — ' + r.name, { col: P.UIC.cyan, icon: 'i_star', life: 300 }); P.Audio.sfx('unlock'); }
  },
  rescue(npc) {
    if (this.data.npcs[npc]) return;
    this.data.npcs[npc] = true; this.data.stats.rescues++;
    if (this.data.stats.rescues >= 4) this.ach('rescatador');
    this.unlockRoom('civs');
    const m = { kairo: 's_kairo', mnemo: 's_mnemo', ssaru: 's_ssaru' }[npc]; if (m) this.missionDone(m);
    const RD = P.D.RESCUE && P.D.RESCUE[npc]; if (RD) { if (RD.mission) this.missionDone(RD.mission); if (RD.onRescue) RD.onRescue(this); }
    if (npc === 'sylae') { this.unlockRoom('invernadero'); this.startMission('s_semillas'); }
    if (npc === 'ssaru') { this.unlockRoom('entrenamiento'); this.startMission('s_cazador'); }
    if (npc === 'mnemo') this.startMission('s_codex');
  },
  msg(from, text) { this.data.msgs.unshift({ from, text: this.fmt(text), t: Date.now(), planet: this.data.lastPlanet || 'verzara' }); if (this.data.msgs.length > 40) this.data.msgs.pop(); },
  // planeta revelado (nombre, datos, especies): igual que desbloqueado; antes es una señal desconocida
  revealed(id) { return this.planetUnlocked(id); },
  // planeta desbloqueado: el anterior debe estar liberado (jefe derrotado)
  planetUnlocked(id) { if (P.settings.dev) return true; const i = P.D.PLANETS.findIndex(p => p.id === id); if (i <= 0) return true; const prev = this.data.planets[P.D.PLANETS[i - 1].id]; return !!(prev && prev.boss); },
  // planeta en curso: el primero disponible que aún no está liberado
  currentPlanet() { const ps = P.D.PLANETS.filter(p => p.ready && this.planetUnlocked(p.id)); return (ps.find(p => !(this.data.planets[p.id] && this.data.planets[p.id].boss)) || ps[ps.length - 1]).id; },
  onFirstClear(planet, id) {
    const hook = P.D.FIRST_CLEAR && P.D.FIRST_CLEAR[planet]; if (hook) hook(this, id);
    if (planet !== 'verzara') { if (id === 11 && planet !== 'dyson') { this.unlockRoom('trofeos'); this.data.planets[planet].boss = true; this.data.stats.bossKills++; this.ach(P.D.planet(planet).boss); } return; }
    if (id === 1) { this.unlockRoom('archivo'); this.unlockRoom('taller'); this.startMission('s_ecos'); this.startMission('s_kairo'); }
    if (id === 2) this.unlockRoom('laboratorio');
    if (id === 3) this.startMission('s_mnemo');
    if (id === 6) { this.unlockRoom('comunicaciones'); this.startMission('s_ssaru'); }
    if (id === 8) this.unlockRoom('hangar');
    if (id === 11) { this.unlockRoom('trofeos'); this.data.planets.verzara.boss = true; this.data.stats.bossKills++; this.ach('krazthor'); }
  },
  giveUpgrade(id) {
    const d = this.data; if (d.ups[id]) return;
    d.ups[id] = true;
    if (P.D.WEAPONS[id] && !d.weapons.includes(id)) d.weapons.push(id);
    this.unlockRoom('arsenal');
  },
  // ---------- compañeros ----------
  compUnlocked(id) { return !!this.data.comps.unlocked[id] || P.settings.dev; },
  toggleComp(id) {
    const eq = this.data.comps.equipped, i = eq.indexOf(id);
    if (i >= 0) { eq.splice(i, 1); return true; }
    if (!this.compUnlocked(id)) return false;
    if (eq.length >= 2) return false;
    eq.push(id); return true;
  }
};
