// Solo per la destinazione dei QR: /stallonati/.
(function () {
  const COLORS = Stalloni.colors;
  // Titolo principale lettera per lettera, ognuna col suo colore neon.
  // Parte alla fine dell'intro, così le lettere rimbalzano davanti agli occhi.
  const big = document.getElementById("headline-accent");
  const word = big.textContent;
  big.style.visibility = "hidden";
  function buildTitle() {
    big.textContent = "";
    [...word].forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = ch;
      s.style.setProperty("--c", COLORS[i % COLORS.length]);
      s.style.setProperty("--i", i);
      big.appendChild(s);
    });
    big.style.visibility = "";
  }

  // Coriandoli: simboli della community che esplodono dal centro
  const CONFETTI = ["🐴", "⭐", "🍺", "🎲", "🃏", "🪩", "✨", "🌷", "♈", "♌", "♏", "🔥"];
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  function burst(n) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = (canvas.width = innerWidth * dpr);
    const H = (canvas.height = innerHeight * dpr);
    const parts = [];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = (6 + Math.random() * 12) * dpr;
      parts.push({
        x: W / 2, y: H * 0.45,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6 * dpr,
        r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
        size: (18 + Math.random() * 22) * dpr,
        e: CONFETTI[i % CONFETTI.length],
      });
    }
    const t0 = performance.now();
    (function frame(t) {
      const life = (t - t0) / 2200;
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = Math.max(0, 1 - life * life);
      parts.forEach((p) => {
        p.vy += 0.35 * dpr; p.vx *= 0.99;
        p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.font = p.size + "px serif";
        ctx.fillText(p.e, -p.size / 2, p.size / 2);
        ctx.restore();
      });
      if (life < 1) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, W, H);
    })(t0);
  }

  // Intro: una volta per sessione; tocca per saltarla
  const intro = document.getElementById("intro");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let seen = false;
  try { seen = sessionStorage.getItem("stallonato") === "1"; } catch (_) {}
  if (reduced || seen) {
    intro.remove();
    buildTitle();
  } else {
    try { sessionStorage.setItem("stallonato", "1"); } catch (_) {}
    let ended = false;
    const timers = [];
    const end = () => {
      if (ended) return;
      ended = true;
      timers.forEach(clearTimeout);
      intro.className = "intro skip";
      setTimeout(() => intro.remove(), 300);
      buildTitle();
    };
    // Il timbro atterra a ~1.3s: tremolio, vibrazione e coriandoli
    timers.push(setTimeout(() => {
      intro.classList.add("shake");
      try { navigator.vibrate && navigator.vibrate([60, 40, 90]); } catch (_) {}
      burst(70);
    }, 1300));
    timers.push(setTimeout(end, 2500));
    intro.addEventListener("click", end);
  }

})();
