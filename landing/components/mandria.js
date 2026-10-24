Stalloni.mount("mandria", `<section class="section join-section" id="mandria" aria-labelledby="mandria-title">
      <div class="container narrow">
        <div class="panel">
          <div class="join" id="join">
            <h2 id="mandria-title">Entra nella mandria</h2>
            <p class="lead">Seguici su Instagram: lì trovi le prossime uscite, i tavoli di gioco e tutta la gente.</p>
            <a class="button button-primary button-block social" id="igBtn" href="https://www.instagram.com/stalloni_official/" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm6.4-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0ZM21.9 8c-.1-1.6-.4-3-1.6-4.2C19 2.6 17.6 2.2 16 2.1c-1.6-.1-6.4-.1-8 0-1.6.1-3 .4-4.2 1.6C2.6 5 2.2 6.4 2.1 8c-.1 1.6-.1 6.4 0 8 .1 1.6.4 3 1.6 4.2 1.2 1.2 2.6 1.6 4.2 1.7 1.6.1 6.4.1 8 0 1.6-.1 3-.4 4.2-1.7 1.2-1.2 1.6-2.6 1.7-4.2.1-1.6.1-6.4 0-8Zm-2.1 9.7a3.3 3.3 0 0 1-1.8 1.8c-1.3.5-4.3.4-5.7.4s-4.4.1-5.7-.4a3.3 3.3 0 0 1-1.8-1.8c-.5-1.3-.4-4.3-.4-5.7s-.1-4.4.4-5.7a3.3 3.3 0 0 1 1.8-1.8c1.3-.5 4.3-.4 5.7-.4s4.4-.1 5.7.4a3.3 3.3 0 0 1 1.8 1.8c.5 1.3.4 4.3.4 5.7s.1 4.4-.4 5.7Z"/></svg>
              <span>Seguici su Instagram · @stalloni_official</span>
            </a>
            <ul class="trust">
              <li>Gratis, niente da comprare</li>
              <li>Nessuno spam</li>
              <li>Esci quando vuoi</li>
            </ul>
          </div>

          <form id="signup" novalidate>
            <p class="or"><span>oppure</span></p>
            <h3>Preferisci che ti scriviamo noi?</h3>

            <label class="field" for="contatto">
              <span class="label">Il tuo @instagram</span>
              <input name="contatto" id="contatto" type="text" autocomplete="off" autocapitalize="off" spellcheck="false"
                     placeholder="@nomeutente" required>
            </label>

            <!-- honeypot anti-bot: gli umani non lo vedono -->
            <input class="hp" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">

            <label class="check">
              <input type="checkbox" name="privacy" id="privacy" required>
              <span>Ho almeno 16 anni e accetto l'<a href="privacy.html" target="_blank" rel="noopener">informativa privacy</a> per ricevere i messaggi della community.</span>
            </label>

            <p class="error" id="formError" role="alert" hidden></p>
            <button class="button button-secondary button-block" type="submit" id="submitBtn">Scrivetemi voi</button>
          </form>

          <!-- STEP 2: facoltativo, dopo l'iscrizione -->
          <form id="profile" novalidate hidden>
            <img class="panel-mascot" src="assets/brand/logo-mascotte.webp" width="120" height="120" alt="">
            <h2>Sei dentro!</h2>
            <p class="lead">Ti scriviamo presto. Se ti va, raccontaci qualcosa di te. Sono tutte domande facoltative.</p>

            <label class="field" for="nome">
              <span class="label">Nome o soprannome</span>
              <input name="nome" id="nome" type="text" autocomplete="given-name" maxlength="60" placeholder="Es. Marco">
            </label>

            <fieldset class="field personaggi">
              <legend class="label">Scegli la tua classe <em>(ti giudicheremo)</em></legend>
              <div class="chips" id="chips"></div>
              <p class="verdict" id="verdict" aria-live="polite"></p>
            </fieldset>

            <p class="error" id="profileError" role="alert" hidden></p>
            <button class="button button-primary button-block" type="submit" id="profileBtn">Salva</button>
            <button class="linkbtn" type="button" id="skipBtn">Salta, va bene così</button>
          </form>

          <div class="success" id="success" hidden>
            <img class="panel-mascot" src="assets/brand/logo-mascotte.webp" width="120" height="120" alt="">
            <h2>Sei nella mandria!</h2>
            <p class="lead">Ci vediamo alla prossima. Porta qualcuno, più siamo meglio è.</p>
            <button class="button button-secondary button-block" type="button" id="shareBtn">Condividi il sito</button>
          </div>
        </div>
      </div>
    </section>`);
