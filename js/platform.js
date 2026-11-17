'use strict';
// Plataforma: navegador / app web instalable (PWA), app de escritorio (Electron) o APK de Android (Capacitor).
// Incluye la copia de partidas entre dispositivos (exportar e importar), porque cada app guarda sus partidas por separado.
P.PLATFORM = window.Capacitor ? 'android' : /Electron/i.test(navigator.userAgent) ? 'desktop' : 'web';
// app web instalable: funciona sin conexión una vez abierta (solo en la versión publicada en https)
if (P.PLATFORM === 'web' && 'serviceWorker' in navigator && location.protocol === 'https:') window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { }));

// Pantalla completa. Android (navegador), iPad, escritorio y la app de Windows usan la API del navegador.
// En iPhone, Safari no la permite: el modo pantalla completa es la app instalada desde «Añadir a pantalla de inicio»
// (se abre sin barras de Safari) u «Ocultar barra de herramientas». Se muestra una guía paso a paso.
P.FullScreen = {
  isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),
  installed() { return navigator.standalone === true || !!(window.matchMedia && (matchMedia('(display-mode: fullscreen)').matches || matchMedia('(display-mode: standalone)').matches)); },
  on() { return !!(document.fullscreenElement || document.webkitFullscreenElement); },
  active() { return this.on() || this.installed() || P.PLATFORM === 'android'; },
  can() { const el = document.documentElement; return !!(el.requestFullscreen || el.webkitRequestFullscreen) && !!(document.fullscreenEnabled || document.webkitFullscreenEnabled); },
  toggle() {
    if (P.PLATFORM === 'android') return; // el APK ya va siempre a pantalla completa
    const d = document, el = d.documentElement;
    if (this.on()) { (d.exitFullscreen || d.webkitExitFullscreen).call(d); return; }
    if (this.can()) {
      try { const p = (el.requestFullscreen || el.webkitRequestFullscreen).call(el, { navigationUI: 'hide' }); if (p && p.then) p.then(() => { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => { }); }, () => this.guide()); }
      catch (e) { this.guide(); }
      return;
    }
    this.guide();
  },
  guide() {
    if (document.getElementById('fsguide')) return;
    const box = document.createElement('div'); box.id = 'fsguide';
    box.style.cssText = 'position:fixed;inset:0;z-index:30;background:rgba(3,4,10,0.94);color:#e8f4ff;font:15px/1.45 system-ui,sans-serif;display:flex;align-items:center;justify-content:center;padding:16px;touch-action:auto';
    const ios = this.isIOS;
    box.innerHTML = '<div style="max-width:560px;background:#0b1424;border:2px solid #5ee8ff;border-radius:12px;padding:18px 20px;max-height:100%;overflow:auto">' +
      '<div style="font-weight:800;font-size:18px;color:#5ee8ff;margin-bottom:8px">Pantalla completa' + (ios ? ' en iPhone' : '') + '</div>' +
      (ios ? '<p style="margin:6px 0"><b style="color:#ffd166">Recomendado: instalar PLENURIA.</b> Se abre siempre a pantalla completa, sin barras de Safari, y funciona sin conexión.</p>' +
        '<ol style="margin:6px 0 10px 20px;padding:0"><li>Pulsa el botón <b>Compartir</b> de Safari (el cuadrado con la flecha <b>⬆︎</b>).</li><li>Elige <b>«Añadir a pantalla de inicio»</b> y pulsa <b>Añadir</b>.</li><li>Abre PLENURIA desde el <b>icono nuevo</b>. Tu partida de Safari no pasa sola: usa Opciones → Exportar/Importar partidas.</li></ol>' +
        '<p style="margin:6px 0"><b style="color:#ffd166">Sin instalar:</b> pulsa <b>«aA»</b> (o el icono de la página) en la barra de Safari y elige <b>«Ocultar barra de herramientas»</b>.</p>'
        : '<p style="margin:6px 0">Este navegador no deja activar la pantalla completa desde la página. Instala el juego desde el menú del navegador (<b>«Instalar app»</b> o <b>«Añadir a pantalla de inicio»</b>) y ábrelo desde su icono.</p>') +
      '<div style="text-align:center;margin-top:12px"><button id="fsok" style="font:700 16px system-ui,sans-serif;background:#5ee8ff;color:#05060c;border:0;border-radius:8px;padding:10px 28px">Entendido</button></div></div>';
    document.body.appendChild(box);
    const close = e => { e.preventDefault(); e.stopPropagation(); box.remove(); };
    box.querySelector('#fsok').addEventListener('click', close); box.querySelector('#fsok').addEventListener('touchend', close);
    for (const ev of ['touchstart', 'touchmove', 'touchend']) box.addEventListener(ev, e => e.stopPropagation(), { passive: true });
  }
};

P.SavePort = {
  dump() { const data = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('plenuria_')) data[k] = localStorage.getItem(k); } return { game: 'PLENURIA', v: 1, at: new Date().toISOString(), data }; },
  copy(txt) { try { if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(txt).then(() => true, () => false); } catch (e) { } return Promise.resolve(false); },
  exportSaves() {
    if (P.State.data && P.State.save) try { P.State.save('auto'); } catch (e) { }
    const txt = JSON.stringify(this.dump());
    this.copy(txt).then(ok => {
      if (P.PLATFORM === 'android') { P.toast(ok ? 'Partidas copiadas al portapapeles: pégalas en una nota o mensaje para guardarlas' : 'No se pudo copiar al portapapeles', { col: ok ? P.UIC.green : P.UIC.red, life: 300 }); return; }
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'application/json' })); a.download = 'plenuria-partidas.json';
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
      P.toast('Partidas exportadas a «plenuria-partidas.json»' + (ok ? ' (y copiadas al portapapeles)' : ''), { col: P.UIC.green, life: 300 });
    });
  },
  importText(txt) {
    let o = null; try { o = JSON.parse(String(txt || '').trim()); } catch (e) { }
    if (!o || o.game !== 'PLENURIA' || !o.data) { P.toast('Eso no es una copia de partidas de PLENURIA', { col: P.UIC.red, life: 240 }); return; }
    const n = Object.keys(o.data).filter(k => /^plenuria_slot_/.test(k)).length;
    P.confirm('¿Reemplazar las partidas de este dispositivo por las ' + n + ' del archivo?', () => {
      for (const k in o.data) if (k.startsWith('plenuria_')) localStorage.setItem(k, o.data[k]);
      P.toast('Partidas importadas. Reiniciando…', { col: P.UIC.green }); setTimeout(() => location.reload(), 700);
    });
  },
  importFile() {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json,text/plain'; inp.style.display = 'none'; document.body.appendChild(inp);
    inp.onchange = () => { const f = inp.files && inp.files[0]; inp.remove(); if (f) f.text().then(t => this.importText(t)); };
    inp.click();
  },
  importPaste() {
    const ask = () => this.importText(window.prompt('Pega aquí el texto de tus partidas exportadas:') || '');
    try { if (navigator.clipboard && navigator.clipboard.readText) { navigator.clipboard.readText().then(t => t && t.includes('PLENURIA') ? this.importText(t) : ask(), ask); return; } } catch (e) { }
    ask();
  }
};

// opciones nuevas: copiar partidas entre el navegador, el móvil y el ordenador
(function () {
  const items0 = P.OptionsUI.prototype.items;
  P.OptionsUI.prototype.items = function () {
    return items0.call(this).concat(P.PLATFORM === 'android' ? [] : [{ l: 'Pantalla completa', v: P.FullScreen.on() || P.FullScreen.installed() ? 'Sí' : 'No', act: () => P.FullScreen.toggle() }], [
      { l: 'Exportar partidas (copia de seguridad)', v: '▶', act: () => P.SavePort.exportSaves() },
      { l: 'Importar partidas desde archivo', v: '▶', act: () => P.SavePort.importFile() },
      { l: 'Importar partidas pegando el texto', v: '▶', act: () => P.SavePort.importPaste() }
    ]);
  };
})();
