// Solo per /stallonati/: splash completo, saltato con movimento ridotto.
(function () {
  "use strict";
  const COLORS = ["#FFD323", "#00D5E8", "#FF239D", "#C1F600", "#FF7518", "#B57BFF"];
  const SYMBOLS = ["🐴", "⭐", "🍺", "🎲", "🃏", "🪩", "✨", "🌷", "♈", "♌", "♏", "🔥"];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const intro = document.getElementById("intro");
  const big = document.getElementById("headline-accent");
  const replay = document.getElementById("introReplay");
  const canvas = document.getElementById("confetti");
  const word = big.textContent;
  let animation;
  let timers = [];
  let active = false;
  let returnFocus = null;

  function buildTitle() {
    big.setAttribute("aria-hidden", "true");
    big.textContent = "";
    let index = 0;
    word.split(" ").forEach((part, wordIndex) => {
      if (wordIndex) big.appendChild(document.createTextNode(" "));
      const group = document.createElement("span");
      group.className = "title-word";
      [...part].forEach((ch) => {
        const span = document.createElement("span");
        span.className = "ch";
        span.textContent = ch;
        span.style.setProperty("--c", COLORS[index % COLORS.length]);
        span.style.setProperty("--i", index++);
        group.appendChild(span);
      });
      big.appendChild(group);
    });
    big.style.visibility = "";
    big.classList.add("title-enter");
  }

  function clearConfetti() {
    cancelAnimationFrame(animation);
    const ctx = canvas.getContext("2d");
    if (ctx) { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.globalAlpha = 1; }
  }

  function burst() {
    if (reduced.matches) return;
    clearConfetti();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const width = canvas.width = innerWidth * dpr;
    const height = canvas.height = innerHeight * dpr;
    const parts = Array.from({ length: 70 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = (6 + Math.random() * 12) * dpr;
      return { x: width / 2, y: height * .45, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 6 * dpr, r: Math.random() * 6, vr: (Math.random() - .5) * .3, size: (18 + Math.random() * 22) * dpr, symbol: SYMBOLS[i % SYMBOLS.length] };
    });
    const start = performance.now();
    let previous = start;
    function frame(now) {
      const life = (now - start) / 2200;
      const delta = Math.min((now - previous) / 16.67, 3);
      previous = now;
      ctx.clearRect(0, 0, width, height);
      if (life >= 1 || reduced.matches) { ctx.globalAlpha = 1; return; }
      ctx.globalAlpha = Math.max(0, 1 - life * life);
      parts.forEach((p) => {
        p.vy += .35 * dpr * delta; p.vx *= Math.pow(.99, delta);
        p.x += p.vx * delta; p.y += p.vy * delta; p.r += p.vr * delta;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.font = p.size + "px serif"; ctx.fillText(p.symbol, -p.size / 2, p.size / 2); ctx.restore();
      });
      animation = requestAnimationFrame(frame);
    }
    animation = requestAnimationFrame(frame);
  }

  function finish(skipped = false) {
    if (!active) return;
    active = false;
    timers.forEach(clearTimeout); timers = [];
    document.removeEventListener("keydown", onKey);
    if (skipped || reduced.matches) clearConfetti();
    const focusedInside = intro.contains(document.activeElement);
    intro.classList.remove("shake");
    intro.classList.add("skip");
    if (skipped || reduced.matches) intro.hidden = true;
    else timers.push(setTimeout(() => { intro.hidden = true; }, 300));
    buildTitle();
    if (focusedInside) (returnFocus || document.getElementById("top")).focus({ preventScroll: true });
  }

  function onKey(event) {
    if (event.key === "Escape" || event.key === "Tab") finish(true);
  }

  function play(fromReplay = false) {
    if (reduced.matches || active) return;
    timers.forEach(clearTimeout); timers = [];
    clearConfetti();
    // Ricrea i nodi per riavviare le animazioni anche durante un replay.
    const scene = intro.querySelector(".intro-scene");
    scene.replaceWith(scene.cloneNode(true));
    returnFocus = fromReplay ? replay : null;
    active = true;
    big.classList.remove("title-enter");
    big.style.visibility = "hidden";
    intro.classList.remove("shake", "skip");
    intro.hidden = false;
    try { sessionStorage.setItem("stallonato", "splash-v3"); } catch (_) {}
    document.addEventListener("keydown", onKey);
    if (fromReplay) document.getElementById("introSkip").focus({ preventScroll: true });
    timers.push(setTimeout(() => { intro.classList.add("shake"); burst(); }, 1300));
    timers.push(setTimeout(() => finish(), 2800));
  }

  intro.addEventListener("click", () => finish(true));
  replay.addEventListener("click", () => play(true));
  replay.hidden = reduced.matches;
  reduced.addEventListener("change", () => {
    replay.hidden = reduced.matches;
    if (reduced.matches) { finish(true); clearConfetti(); }
  });
  let seen = false;
  try { seen = sessionStorage.getItem("stallonato") === "splash-v3"; } catch (_) {}
  if (!reduced.matches && !seen && !location.hash) play();
  else buildTitle();
})();
