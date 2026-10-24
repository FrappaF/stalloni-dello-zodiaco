(function () {
  "use strict";
  const base = new URL("../", document.currentScript.src);
  const COLORS = ["#FFD323", "#00D5E8", "#FF239D", "#C1F600", "#FF7518", "#B57BFF"];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  // Coriandoli solo dopo una scelta, senza richieste di rete né persistenza.
  const canvas = document.getElementById("confetti");
  let animation;
  function burst() {
    if (reduced.matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    cancelAnimationFrame(animation);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const width = canvas.width = innerWidth * dpr;
    const height = canvas.height = innerHeight * dpr;
    const symbols = ["🐴", "⭐", "🎲", "✨"];
    const parts = Array.from({ length: 28 }, (_, i) => ({ x: width / 2, y: height * .6, vx: (Math.random() - .5) * 14 * dpr, vy: (-4 - Math.random() * 8) * dpr, symbol: symbols[i % symbols.length] }));
    const start = performance.now();
    let previous = start;
    function frame(now) {
      const life = (now - start) / 1100;
      const delta = Math.min((now - previous) / 16.67, 3);
      previous = now;
      ctx.clearRect(0, 0, width, height);
      if (life >= 1 || reduced.matches) return;
      ctx.globalAlpha = 1 - life;
      ctx.font = 24 * dpr + "px serif";
      parts.forEach((p) => { p.vy += .28 * dpr * delta; p.x += p.vx * delta; p.y += p.vy * delta; ctx.fillText(p.symbol, p.x, p.y); });
      animation = requestAnimationFrame(frame);
    }
    animation = requestAnimationFrame(frame);
  }
  const PERSONAGGI = [
    ["🧙", "Mago della Lore", "Lancia «In realtà…» a volontà. Nessuna discussione su Star Wars finisce in un solo turno."],
    ["🪓", "Barbaro del Rage Quit", "Annuncia che è l’ultima partita. È ancora lì tre ore dopo."],
    ["🎲", "Chierico del Tiro Critico", "Prega su ogni dado prima di tirarlo. Fa 1. Sempre."],
    ["🪩", "Bardo della Pista", "Ispirazione bardica: chi balla con te resta in pista fino alla chiusura."],
    ["🛡️", "Paladino del Piano B", "Il locale è pieno? Ha già trovato un altro posto e prenotato per tutti."],
    ["🗝️", "Ladro della Lista VIP", "Conosce qualcuno che conosce qualcuno. Alla fine saluta anche il guardaroba."],
    ["🌷", "Druido di Amsterdam", "Parla con le piante. Le piante rispondono. Lui annuisce, serissimo."],
    ["🚲", "Ranger dei Canali", "Orientamento: −5. Ha attraversato lo stesso ponte sei volte e lo rifarebbe."],
    ["💃", "Warlock di Barcellona", "Ha stretto un patto con la pista da ballo. Il prezzo da pagare è una lunga siesta."],
    ["🍕", "Monaco degli Snack delle 3", "Trova una pizzeria aperta a qualsiasi ora. Il vero potere del gruppo."],
  ];
  const chips = document.getElementById("chips");
  const verdict = document.getElementById("verdict");
  PERSONAGGI.forEach(([icon, name, line], i) => {
    const label = document.createElement("label");
    label.className = "chip"; label.style.setProperty("--c", COLORS[i % COLORS.length]);
    const input = document.createElement("input");
    input.type = "radio"; input.name = "personaggio"; input.value = name;
    const emoji = document.createElement("span");
    emoji.className = "ico"; emoji.setAttribute("aria-hidden", "true"); emoji.textContent = icon;
    const text = document.createElement("span"); text.textContent = name;
    input.addEventListener("change", () => { verdict.textContent = "Abilità speciale: " + line; burst(); });
    label.append(input, emoji, text); chips.appendChild(label);
  });
  document.getElementById("classe").hidden = false;
  const shareBtn = document.getElementById("shareBtn");
  const status = document.getElementById("shareStatus");
  const fallback = document.getElementById("shareFallback");
  const shareUrl = document.getElementById("shareUrl");
  shareBtn.hidden = false;
  shareBtn.addEventListener("click", async () => {
    const url = new URL(base); url.searchParams.set("src", "share");
    const data = { title: "Stalloni dello Zodiaco", text: "Hai trovato la mandria! Serate, giochi e viaggi: scopri gli Stalloni dello Zodiaco.", url: url.href };
    status.textContent = ""; fallback.hidden = true; shareBtn.disabled = true;
    try {
      if (navigator.share) {
        try { await navigator.share(data); return; } catch (err) { if (err.name === "AbortError") return; }
      }
      if (navigator.clipboard && window.isSecureContext) {
        try { await navigator.clipboard.writeText(url.href); status.textContent = "Link copiato! Ora puoi incollarlo dove vuoi."; return; } catch (_) {}
      }
      fallback.hidden = false; shareUrl.value = url.href; shareUrl.focus(); shareUrl.select();
      status.textContent = "Seleziona e copia il link qui sotto.";
    } finally { shareBtn.disabled = false; }
  });
})();
