# Memoria del progetto

## Informazioni confermate dall’utente — 24 ottobre 2026

- QR sparsi per Savona; il numero è indefinito. Non bisogna trovarli tutti: si vince un premio trovando «quello giusto».
- Il premio resta una sorpresa 👀. Tipo, verifica della vincita e ritiro non sono stati specificati: non inventarli.
- La home spiega progetto e caccia ai QR. «Hai trovato la mandria» rimane sotto `/stallonati/`, senza link di iscrizione diretti a questa destinazione.
- Instagram ufficiale: `stalloni_official`. WhatsApp eliminato: l’utente ha confermato che non verrà usato.
- Richiesta attuale: valutare UI/UX e tutto il copy, elencare criticità, risolverle e pubblicare.

## Struttura

- Sito statico in `landing/`. GitHub Pages pubblica questa cartella tramite `.github/workflows/pages.yml` ai push su `main`.
- `landing/index.html`: home della caccia. `landing/stallonati/index.html`: pagina community per QR.
- Percorsi relativi compatibili con `/stalloni-dello-zodiaco/` e anteprima offline. Preservare entrambi gli URL e i QR stampati.
- Componenti comuni in `landing/components/*.html`; contenuti unici e head in `site-source/`.
- `python3 render-site.py` genera HTML statico completo e aggiorna gli hash CSS/JS nei riferimenti. `--check` verifica che sia aggiornato. Committare gli output; nessuna build è richiesta per il deploy.
- Questa generazione sostituisce i precedenti componenti montati via JS: contenuti e CTA devono funzionare anche senza JavaScript.
- `landing/modules/community.js`: classi facoltative e condivisione; `qr-intro.js` è caricato solo in `/stallonati/`. Lo splash non deve apparire sulla home. L’utente ha chiesto di mantenere le animazioni e renderlo iconico: rotazione completa del logo, orbita zodiacale neon, grande timbro «SEI STATO STALLONATO», onda d’impatto, tremolio, coriandoli e titolo a rimbalzo. Non semplificare di nuovo la sequenza; dura 2,8 secondi più dissolvenza e si può ripetere con «Rivedi l’intro».
- CTA interne per conoscere la community verso `#mandria`; Instagram apre il profilo ufficiale. Nessun link dalla home a `/stallonati/`.

## Revisione UI/UX

- Percorso: scoperta della caccia (home), attività, chi siamo, contatto Instagram, FAQ; gioco delle classi separato e facoltativo.
- Il contatto avviene direttamente su Instagram. Il vecchio modulo e i backend inutilizzati sono stati rimossi: l’informativa aveva campi del titolare non compilati e il form poteva mostrare falsi successi. Nessuna raccolta di recapiti nel sito.
- Nessuna analisi delle visite. `src` resta compatibile negli URL ma non viene elaborato. La condivisione propone sempre la home con `src=share`, senza riproporre altri parametri.
- Classi non salvate né inviate. `sessionStorage` solo per non ripetere l’intro nella sessione. Nessuna vibrazione; movimento ridotto rispettato anche dal canvas.
- Font locali con licenze OFL; nessuna richiesta a Google Fonts o incorporamento social.
- Chiarire che l’assenza di abbonamento non rende gratuite tutte le uscite o i viaggi. Evitare promesse su tempi di risposta, eventi fissati o premi non confermati.
- Criticità e verifiche in `UI-UX-AUDIT.md`.

## Pubblicazione

Sincronizzare con `origin/main` prima della pubblicazione. La copia iniziale dell’ambiente era precedente al commit `7a9ccbb`: la revisione incorpora la separazione home/QR e le scelte sopra senza ripristinare la vecchia landing come home.
