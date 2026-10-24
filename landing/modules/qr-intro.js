(function () {
  "use strict";
  const COLORS = ["#FFD323", "#00D5E8", "#FF239D", "#C1F600", "#FF7518", "#B57BFF"];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const big = document.getElementById("headline-accent");
  const word = big.textContent;
  big.setAttribute("aria-hidden", "true");
  big.textContent = "";
  let index = 0;
  word.split(" ").forEach((part, wordIndex) => {
    if (wordIndex) big.appendChild(document.createTextNode(" "));
    const group = document.createElement("span");
    group.className = "title-word";
    [...part].forEach((ch) => {
      const span = document.createElement("span");
      span.className = "ch"; span.textContent = ch;
      span.style.setProperty("--c", COLORS[index++ % COLORS.length]);
      group.appendChild(span);
    });
    big.appendChild(group);
  });
  // Splash solo con JS; si salta con click, Tab o Esc. Nessuna vibrazione.
  const intro = document.getElementById("intro");
  let seen = false;
  try { seen = sessionStorage.getItem("stallonato") === "1"; } catch (_) {}
  if (!reduced.matches && !seen && !location.hash) {
    intro.hidden = false;
    try { sessionStorage.setItem("stallonato", "1"); } catch (_) {}
    let timer;
    const end = () => {
      clearTimeout(timer);
      intro.hidden = true;
      document.removeEventListener("keydown", keyHandler);
      if (intro.contains(document.activeElement)) document.getElementById("top").focus({ preventScroll: true });
    };
    const keyHandler = (e) => { if (e.key === "Escape" || e.key === "Tab") end(); };
    intro.addEventListener("click", end);
    document.addEventListener("keydown", keyHandler);
    timer = setTimeout(end, 1800);
    reduced.addEventListener("change", (e) => { if (e.matches) end(); }, { once: true });
  }
})();
