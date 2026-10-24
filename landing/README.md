# Sito Stalloni dello Zodiaco

Sito statico HTML/CSS/JS, senza build. GitHub Pages pubblica questa cartella.

## Pagine

- `index.html`: progetto e caccia ai QR a Savona. Vince chi trova «quello giusto», senza un numero fisso di QR.
- `stallonati/index.html`: destinazione QR con intro «Sei stato stallonato».
- `privacy.html`: informativa privacy.

## Componenti e moduli condivisi

Ogni sezione comune ha una sola sorgente in `components/`: `header.js`, `mandria.js`, `activities.js`, `about.js`, `footer.js`. Le pagine dichiarano contenitori `data-component` e caricano gli stessi componenti.

`modules/site.js` espone `Stalloni.mount`, la base URL del sito e la palette condivisa. Risolve i percorsi di immagini e link rispetto alla radice del sito, anche sotto il prefisso GitHub Pages. Caricarlo prima dei componenti.

`modules/community.js` gestisce il form in due passaggi, le classi, i social e la condivisione. Caricarlo dopo i componenti e `modules/config.js`.

`modules/qr-intro.js` gestisce solo intro e coriandoli, ed è caricato esclusivamente su `/stallonati/`. Le CTA di iscrizione puntano a `#mandria` e non aprono questa pagina.

Gli script sono classici, senza import o fetch di template: lo ZIP è consultabile anche aprendo `index.html` direttamente nel browser. Titoli, metadati e contenuti specifici delle pagine restano nei rispettivi HTML. Stili condivisi in `style.css`, stili della home in `home.css`.

## Form e provenienza

L’endpoint Formspree è in `modules/config.js`, insieme al profilo Instagram ufficiale `stalloni_official`. Se `FORM_ENDPOINT` è vuoto il form mostra il successo ma non salva nulla.

Per usare Google Sheets, pubblicare `google-apps-script.js` come app web e impostare endpoint e `PROVIDER: "google"` nella configurazione.

Il parametro `?src=...` (o `utm_source`) viene letto dal modulo su entrambe le pagine. Senza parametro la fonte è `home` sulla home e `qr` sulla destinazione QR. I QR già stampati puntano alla home con `src`; non viene implementato un sistema di verifica o assegnazione premi.

## Anteprima

```bash
cd landing
python3 -m http.server 8000
```

Aprire `http://localhost:8000` sulla stessa macchina del server; un ambiente remoto richiede l’inoltro della porta.
