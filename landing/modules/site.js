// Utilities condivise. Script classici per funzionare anche aprendo lo ZIP offline.
window.Stalloni = (() => {
  const base = new URL('../', document.currentScript.src);
  const colors = ["#FFD323", "#00D5E8", "#FF239D", "#C1F600", "#FF7518", "#B57BFF"];
  function mount(name, html) {
    const host = document.querySelector(`[data-component="${name}"]`);
    if (!host) return;
    host.innerHTML = html;
    host.querySelectorAll('[src], [href]').forEach(el => {
      const attr = el.hasAttribute('src') ? 'src' : 'href';
      const value = el.getAttribute(attr);
      if (value && !value.startsWith('#')) el.setAttribute(attr, new URL(value, base).href);
    });
  }
  return { base, colors, mount };
})();
