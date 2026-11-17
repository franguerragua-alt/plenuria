'use strict';
// Plataforma: navegador / app web instalable (PWA), app de escritorio (Electron) o APK de Android (Capacitor).
// Incluye la copia de partidas entre dispositivos (exportar e importar), porque cada app guarda sus partidas por separado.
P.PLATFORM = window.Capacitor ? 'android' : /Electron/i.test(navigator.userAgent) ? 'desktop' : 'web';
// app web instalable: funciona sin conexión una vez abierta (solo en la versión publicada en https)
if (P.PLATFORM === 'web' && 'serviceWorker' in navigator && location.protocol === 'https:') window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { }));

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
    return items0.call(this).concat([
      { l: 'Exportar partidas (copia de seguridad)', v: '▶', act: () => P.SavePort.exportSaves() },
      { l: 'Importar partidas desde archivo', v: '▶', act: () => P.SavePort.importFile() },
      { l: 'Importar partidas pegando el texto', v: '▶', act: () => P.SavePort.importPaste() }
    ]);
  };
})();
