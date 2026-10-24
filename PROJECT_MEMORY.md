# Memoria del progetto

## Informazioni confermate dall’utente — 24 ottobre 2026

- Gli Stalloni dello Zodiaco hanno QR sparsi per Savona.
- Il numero di QR è indefinito. Non bisogna trovarli tutti: si vince un premio trovando «quello giusto» (chiarimento che sostituisce il brief iniziale).
- Il premio resta una sorpresa nella comunicazione: 👀. Tipo di premio, verifica della vincita e ritiro non sono stati specificati; non inventarli.
- La home deve spiegare il progetto e la caccia ai QR.
- La precedente schermata «Hai trovato la mandria» va sotto `/stallonati`.

## Struttura e ambiente

- Repository: `stalloni-dello-zodiaco`; sito statico in `landing/`, senza build.
- GitHub Pages pubblica `landing/` tramite `.github/workflows/pages.yml` ai push su `main`.
- `landing/index.html`: home del progetto; `landing/stallonati/index.html`: schermata community con form originale.
- CSS, script, configurazione, privacy e asset condivisi restano nella radice `landing/`.
- Usare percorsi relativi compatibili con il prefisso GitHub Pages `/stalloni-dello-zodiaco/`.
- I QR già stampati puntano alla home con `?src=...`; preservare la fonte nei link dalla home a `stallonati/`.
- La caccia è descritta nella landing; non è stato implementato un sistema di tracciamento o assegnazione premi.
- Formspree è già configurato. Link WhatsApp e Instagram non ancora configurati.

## Componente community condiviso

- «Entra nella mandria» nella home scorre a `#mandria`, senza passare da `/stallonati/` e senza intro.
- `landing/components/mandria.js` contiene il markup condiviso del modulo e dei social; `landing/modules/community.js` ne gestisce interazioni e invio su entrambe le pagine.
- `landing/modules/qr-intro.js` contiene timbro, coriandoli e titolo animato; è caricato esclusivamente da `/stallonati/`, destinazione riservata ai QR.
- Non aggiungere link di iscrizione verso `/stallonati/`: usare `#mandria`.
- La provenienza `src` viene letta direttamente dal modulo su entrambe le pagine. Senza parametro, la home usa `home`.

## Organizzazione condivisa

- Tutti i componenti comuni sono in `landing/components/`: header, mandria, activities, about, footer. Il markup compare una sola volta.
- Le utility (`Stalloni.mount`, base URL, palette), configurazione, logica community e intro sono in `landing/modules/`.
- Caricare site.js, componenti, config.js, community.js in quest’ordine; qr-intro.js solo nella pagina QR.
- Mantenere script classici e assenza di build per compatibilità con GitHub Pages e anteprima ZIP offline.
- Privacy rimanda a `./#mandria` per evitare l’intro QR.

## Sincronizzazione prima del deploy

Integrato il commit remoto c02a8d8: Instagram ufficiale `stalloni_official`, contatti solo Instagram, nessun campo telefono o WhatsApp. Pannello iscrizione centrato con padding responsive e spaziatura uniforme.

## Cache e controllo presentazione

I riferimenti CSS/JS negli HTML hanno `?v=<hash contenuto>`: aggiornare gli hash quando cambiano i file per evitare stili obsoleti dalla cache. Il modulo ha distacco desktop tra 64 e 96 px, separato dalle regole mobile.
