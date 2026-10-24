(function () {
  // Palette del design system (stessi valori dei token in style.css)
  const COLORS = ["#FFD323", "#00D5E8", "#FF239D", "#C1F600", "#FF7518", "#B57BFF"];

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

  // Classi in stile D&D al posto dei segni zodiacali: [icona, classe, abilità speciale]
  const PERSONAGGI = [
    ["🧙", "Mago della Lore", "Lancia «In realtà…» a volontà. Nessuno sopravvive a una discussione su Star Wars."],
    ["🪓", "Barbaro del Rage Quit", "Ira: +10 alla forza contro joystick e tastiere. Danni permanenti al divano."],
    ["🎲", "Chierico del Tiro Critico", "Prega su ogni dado prima di tirarlo. Fa 1. Sempre."],
    ["🪩", "Bardo della Pista", "Ispirazione bardica: chi balla con te resta in pista fino alla chiusura."],
    ["🥃", "Paladino dell'Ultimo Shottino", "Giuramento sacro: «Dai, l'ultimo». Non l'ha mai rispettato."],
    ["🗝️", "Ladro della Lista VIP", "Furtività leggendaria: entra ovunque, non paga mai l'ingresso."],
    ["🌷", "Druido di Amsterdam", "Parla con le piante. Le piante rispondono. Lui annuisce, serissimo."],
    ["🚲", "Ranger dei Canali", "Orientamento: −5. Ha attraversato lo stesso ponte sei volte e lo rifarebbe."],
    ["💃", "Warlock di Barcellona", "Ha stretto un patto con un club. Il patron chiede in cambio solo la siesta."],
    ["🍕", "Monaco degli Snack delle 3", "Digiuno ascetico tutto il giorno. Alle 3 di notte svuota il frigo in un turno."],
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
    input.addEventListener("change", () => { verdict.textContent = "Abilità speciale: " + line; });
    chips.appendChild(l);
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  // Form in due step: 1) Instagram + consenso, 2) profilo facoltativo
  const form = document.getElementById("signup");
  const errorBox = document.getElementById("formError");
  const btn = document.getElementById("submitBtn");
  const profile = document.getElementById("profile");
  const profileError = document.getElementById("profileError");
  const profileBtn = document.getElementById("profileBtn");
  const success = document.getElementById("success");
  const cfg = window.STALLONI_CONFIG || {};

  const IG_RE = /^@?(?=.*[a-z])[a-z0-9._]{2,30}$/i;
  const params = new URLSearchParams(location.search);
  const fonte = params.get("src") || params.get("utm_source") || "qr";

  // Accetta solo un nome utente Instagram
  function kindOf(value) {
    const v = value.trim();
    if (IG_RE.test(v)) return "instagram";
    return null;
  }

  function showError(box, msg) {
    box.textContent = msg;
    box.hidden = !msg;
  }

  async function send(fields, button, busyLabel) {
    const data = new URLSearchParams(fields);
    if (!cfg.FORM_ENDPOINT) {
      console.warn("[Stalloni] FORM_ENDPOINT non configurato: modalità demo, dati NON salvati.", Object.fromEntries(data));
      return;
    }
    const label = button.textContent;
    button.disabled = true;
    button.textContent = busyLabel;
    try {
      if (cfg.PROVIDER === "google") {
        await fetch(cfg.FORM_ENDPOINT, { method: "POST", mode: "no-cors", body: data });
      } else {
        const res = await fetch(cfg.FORM_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        if (!res.ok) {
          // Formspree spiega il motivo in JSON: lo riportiamo per capire cosa non va
          let detail = "";
          try {
            const body = await res.json();
            detail = (body.errors || []).map((x) => x.message).join(", ") || body.error || "";
          } catch (_) {}
          throw new Error("HTTP " + res.status + (detail ? ": " + detail : ""));
        }
      }
    } finally {
      button.disabled = false;
      button.textContent = label;
    }
  }

  // Piano B: invio classico del form (pagina di conferma di Formspree),
  // funziona anche quando l'invio in background viene rifiutato
  function nativeSubmit(fields) {
    const f = document.createElement("form");
    f.method = "POST";
    f.action = cfg.FORM_ENDPOINT;
    Object.entries(fields).forEach(([k, v]) => {
      const i = document.createElement("input");
      i.type = "hidden"; i.name = k; i.value = v;
      f.appendChild(i);
    });
    document.body.appendChild(f);
    f.submit();
  }

  function show(el) {
    [form, profile, success].forEach((x) => { x.hidden = x !== el; });
    // Il pulsante Instagram resta visibile tranne durante il profilo
    document.getElementById("join").hidden = el === profile;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  let contatto = "";
  let tipo = null;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = form.elements.contatto;
    const privacy = form.elements.privacy;
    form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
    tipo = kindOf(input.value);
    if (!tipo) {
      input.classList.add("invalid");
      return showError(errorBox, "Scrivi il tuo nome utente Instagram.");
    }
    if (!privacy.checked) {
      privacy.closest(".check").classList.add("invalid");
      return showError(errorBox, "Spunta la casella per entrare nella community.");
    }
    showError(errorBox, "");
    contatto = input.value.trim();
    if (tipo === "instagram") contatto = "@" + contatto.replace(/^@/, "");

    // Bot che compilano il campo nascosto: fingiamo successo e non inviamo nulla
    if (form.elements._gotcha.value) return show(profile);

    const fields = {
      step: "iscrizione",
      contatto,
      tipo_contatto: tipo,
      [tipo]: contatto,
      eta_16_plus: "si",
      consenso_privacy: "si",
      consenso_timestamp: new Date().toISOString(),
      fonte,
      pagina: location.href,
    };
    try {
      await send(fields, btn, "Un attimo…");
      show(profile);
    } catch (err) {
      console.error(err);
      if (cfg.PROVIDER !== "google" && navigator.onLine !== false) {
        showError(errorBox, "Ti porto alla pagina di conferma…");
        return nativeSubmit(fields);
      }
      showError(errorBox, "Non siamo riusciti a salvarti (" + err.message + "). Controlla la connessione e riprova.");
    }
  });

  profile.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = profile.elements.nome.value.trim();
    const personaggio = (profile.querySelector("input[name=personaggio]:checked") || {}).value || "";
    profile.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
    showError(profileError, "");
    if (!nome && !personaggio) return show(success);
    const fields = { step: "profilo", contatto, tipo_contatto: tipo, nome, personaggio, fonte };
    try {
      await send(fields, profileBtn, "Salvo…");
      show(success);
    } catch (err) {
      console.error(err);
      showError(profileError, "Non siamo riusciti a salvare. Riprova o salta: la prima adesione è già registrata.");
    }
  });

  // Pulsante Instagram: link da config.js, "in arrivo" se manca
  [["igBtn", cfg.INSTAGRAM_URL]].forEach(([id, url]) => {
    const a = document.getElementById(id);
    if (url) { a.href = url; return; }
    a.removeAttribute("href");
    a.classList.add("soon");
    a.setAttribute("aria-disabled", "true");
    a.querySelector("span").textContent += " (in arrivo)";
  });

  document.getElementById("skipBtn").addEventListener("click", () => show(success));

  // Condivisione: invita altre persone nella mandria
  document.getElementById("shareBtn").addEventListener("click", async () => {
    const url = location.origin + location.pathname + "?src=share";
    const text = "Hai trovato la mandria! 🐴 Stalloni dello Zodiaco: serate, game night e viaggi. Scopri la community:";
    if (navigator.share) {
      try { await navigator.share({ title: "Stalloni dello Zodiaco", text, url }); } catch (_) {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        document.getElementById("shareBtn").textContent = "Link copiato!";
      } catch (_) {
        window.prompt("Copia il link e condividilo:", url);
      }
    }
  });
})();
