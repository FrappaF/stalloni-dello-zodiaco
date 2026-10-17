(function () {
  const COLORS = ["#ffd60a", "#2ee6e6", "#ff2e93", "#b6f22e", "#ff8a1f", "#8b5cf6"];
  const SIGNS = "♈♉♊♋♌♍♎♏♐♑♒♓★✦";

  // Titolo "stallonato!" lettera per lettera, ognuna col suo colore neon.
  // Parte alla fine dell'intro, così le lettere rimbalzano davanti agli occhi.
  const big = document.getElementById("stallonato");
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

  // Cielo con simboli zodiacali fluttuanti
  const sky = document.querySelector(".sky");
  for (let i = 0; i < 26; i++) {
    const s = document.createElement("span");
    s.textContent = SIGNS[Math.floor(Math.random() * SIGNS.length)];
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.setProperty("--s", 12 + Math.random() * 18 + "px");
    s.style.setProperty("--c", COLORS[i % COLORS.length]);
    s.style.setProperty("--d", 6 + Math.random() * 8 + "s");
    s.style.animationDelay = -Math.random() * 10 + "s";
    sky.appendChild(s);
  }

  // Oroscopo stallone
  const PROPHECIES = [
    "Mercurio è retrogrado, tu invece vai avanti a birre.",
    "Venere entra nel tuo segno e ne esce subito: ha visto il tuo ex.",
    "Oggi le stelle ti consigliano di non rispondere a quel messaggio delle 3 di notte.",
    "Marte ti dà energia. La userai per alzarti dal divano. Forse.",
    "Giove ti porta fortuna a carte. Non alla prima mano, non alla seconda…",
    "La Luna in Acquario dice: un altro giro e poi a casa. Mente.",
    "Saturno ti mette alla prova: chi offre stasera?",
    "Il tuo ascendente è Stallone. Non ci sono altre domande.",
    "Plutone non è più un pianeta, ma tu resti uno stallone.",
    "Previsto incontro con uno sconosciuto affascinante. È il buttafuori.",
  ];
  const prophecy = document.getElementById("prophecy");
  let last = 0;
  function reroll() {
    let n;
    do { n = Math.floor(Math.random() * PROPHECIES.length); } while (n === last);
    last = n;
    prophecy.textContent = PROPHECIES[n];
  }
  document.getElementById("reroll").addEventListener("click", reroll);
  reroll();

  // Personaggi al posto dei segni zodiacali
  const PERSONAGGI = [
    ["🧙", "Il Master di D&D che uccide tutti", "Un Master. Il party non sopravvive, ma la serata sì."],
    ["🎮", "Il Rage Quitter seriale", "Il joystick ha già chiesto il trasferimento."],
    ["🤓", "Quello che corregge la lore", "Tecnicamente avresti ragione. Tecnicamente."],
    ["🪩", "L'ultimo a lasciare la pista", "Il DJ ti conosce per nome. E ha paura."],
    ["🥃", "Quello del «dai, ultimo shottino»", "Non era l'ultimo. Non lo è mai."],
    ["📋", "Il PR che ti mette in lista", "Sei in lista. Sei sempre in lista."],
    ["🌷", "Il filosofo di Amsterdam", "Hai capito l'universo. Poi te lo sei scordato."],
    ["🚲", "Il ciclista perso sui canali", "Cercavi la Centrale, hai trovato tre volte lo stesso ponte."],
    ["💃", "Il socio del club di Barcellona", "Tessera, siesta, fiesta. In quest'ordine."],
    ["🍕", "Il cacciatore di snack delle 3", "Il frigo ha un tuo ritratto in cornice."],
  ];
  const chips = document.getElementById("chips");
  const verdict = document.getElementById("verdict");
  PERSONAGGI.forEach(([ico, name, line], i) => {
    const l = document.createElement("label");
    l.className = "chip";
    l.style.setProperty("--c", COLORS[i % COLORS.length]);
    l.innerHTML = '<input type="radio" name="personaggio" id="pg' + i + '"><span class="ico" aria-hidden="true"></span><span class="name"></span>';
    const input = l.querySelector("input");
    input.value = name;
    l.querySelector(".ico").textContent = ico;
    l.querySelector(".name").textContent = name;
    input.addEventListener("change", () => { verdict.textContent = line; });
    chips.appendChild(l);
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  // Form
  const form = document.getElementById("signup");
  const errorBox = document.getElementById("formError");
  const btn = document.getElementById("submitBtn");
  const success = document.getElementById("success");
  const cfg = window.STALLONI_CONFIG || {};

  const PHONE_RE = /^\+?[0-9\s().-]{8,20}$/;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden = !msg;
  }

  function validate() {
    const f = form.elements;
    const problems = [];
    form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
    const mark = (el, msg) => {
      (el.type === "checkbox" ? el.closest(".check") : el).classList.add("invalid");
      problems.push(msg);
    };
    if (!f.nome.value.trim()) mark(f.nome, "Dicci almeno come ti chiami.");
    if (!PHONE_RE.test(f.telefono.value.trim())) mark(f.telefono, "Il numero non sembra valido.");
    if (!EMAIL_RE.test(f.email.value.trim())) mark(f.email, "L'email non sembra valida.");
    if (!f.eta.checked) mark(f.eta, "Devi avere almeno 16 anni.");
    if (!f.privacy.checked) mark(f.privacy, "Serve il consenso privacy per tenerti aggiornato.");
    return problems;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const problems = validate();
    if (problems.length) {
      showError(problems[0]);
      return;
    }
    showError("");

    // Bot che compilano il campo nascosto: fingiamo successo e non inviamo nulla
    if (form.elements._gotcha.value) return done();

    const params = new URLSearchParams(location.search);
    const data = new URLSearchParams({
      nome: form.elements.nome.value.trim(),
      telefono: form.elements.telefono.value.trim(),
      email: form.elements.email.value.trim(),
      personaggio: (form.querySelector("input[name=personaggio]:checked") || {}).value || "",
      eta_16_plus: "si",
      consenso_privacy: "si",
      consenso_timestamp: new Date().toISOString(),
      fonte: params.get("src") || params.get("utm_source") || "qr",
      pagina: location.href,
    });

    if (!cfg.FORM_ENDPOINT) {
      console.warn("[Stalloni] FORM_ENDPOINT non configurato: modalità demo, dati NON salvati.", Object.fromEntries(data));
      return done();
    }

    btn.disabled = true;
    btn.textContent = "Consulto le stelle…";
    try {
      if (cfg.PROVIDER === "google") {
        await fetch(cfg.FORM_ENDPOINT, { method: "POST", mode: "no-cors", body: data });
      } else {
        const res = await fetch(cfg.FORM_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
      }
      done();
    } catch (err) {
      console.error(err);
      showError("Le stelle sono offline. Riprova tra un attimo.");
      btn.disabled = false;
      btn.textContent = "Fammi stallone 🔥";
    }
  });

  function done() {
    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Condivisione: porta altri amici nella mandria
  document.getElementById("shareBtn").addEventListener("click", async () => {
    const url = location.origin + location.pathname + "?src=share";
    const text = "Sei stato stallonato! 🐴✨ Entra nella mandria:";
    if (navigator.share) {
      try { await navigator.share({ title: "Stalloni dello Zodiaco", text, url }); } catch (_) {}
    } else {
      window.open("https://wa.me/?text=" + encodeURIComponent(text + " " + url), "_blank", "noopener");
    }
  });
})();
