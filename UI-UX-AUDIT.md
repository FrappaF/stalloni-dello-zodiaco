# Revisione UI/UX e copy — 24 ottobre 2026

Ambito: home della caccia ai QR a Savona, `/stallonati/`, contenuti condivisi, privacy, stati interattivi e condivisione. Revisione integrata sul commit remoto `7a9ccbb`, successivo alla copia iniziale dell’ambiente.

Brand preservato: mascotte, illustrazioni, palette neon, Bangers / Space Grotesk / Inter. Canale confermato dall’utente: **@stalloni_official**; WhatsApp escluso.

## Criticità e risoluzioni

| Priorità | Criticità | Correzione applicata |
| --- | --- | --- |
| Alta | CTA «Entra» e conferme del form suggerivano un ingresso immediato; il flusso in realtà raccoglieva un recapito. | Contatto diretto al profilo Instagram, con istruzioni per scrivere in Direct; eliminati modulo, invio e conferme ambigue. |
| Alta | Informativa con dati del titolare, recapito e tempi di conservazione non compilati. | Rimossa la raccolta di recapiti. Privacy riscritta sui comportamenti reali: hosting, memoria tecnica, link a Instagram, gioco e condivisione; nessun dato anagrafico inventato. |
| Alta | Il vecchio backend prevedeva successo dimostrativo senza endpoint, invii non verificabili e reindirizzamenti automatici in caso di errore. | Rimossi il backend inutilizzato e i relativi percorsi di invio; nessuna richiesta POST o dato di contatto raccolto dal sito. |
| Alta | Contenuti condivisi montati soltanto da JavaScript: senza JS sparivano navigazione, presentazione e contatti. | HTML statico completo generato da componenti condivisi; contenuti, FAQ e Instagram disponibili anche senza JS. |
| Alta | Ridimensionando il testo al 200% comparivano ingombri in header, titolo e pulsanti. | Titoli spezzabili tra parole, contenitori flessibili, wrapping delle CTA e header adattivo; nessun overflow nei casi verificati. |
| Media | Il lungo pannello di adesione precedeva la spiegazione delle attività e del gruppo. | Percorso ordinato: caccia nella home, attività, chi siamo, contatto Instagram e FAQ. CTA della home verso `#caccia` e `#mandria`. |
| Media | La caccia poteva essere interpretata come una collezione da completare. | Testi espliciti: nessun numero fisso e nessuna necessità di trovarli tutti; conta trovare quello giusto. Premio mantenuto a sorpresa 👀. |
| Media | «Gratis, niente da comprare» confondeva adesione alla community e costi delle attività. | Nessun abbonamento alla community; costi di uscite, locali e viaggi da verificare per ogni attività. |
| Media | Testi generici e promesse «Sei dentro», «Ti scriviamo presto» senza un esito corrispondente. | CTA che descrivono l’apertura del profilo e copy concreto su come conoscere il gruppo, senza tempi di risposta promessi. |
| Media | Dubbi di chi arriva da solo, non ha esperienza di gioco o cerca le prossime attività. | FAQ accessibili con elementi nativi `details`/`summary`, disponibili anche senza JS. |
| Media | Splash non saltabile da tastiera, vibrazione e animazione canvas non sempre coerente con movimento ridotto. | Splash di 2,8 secondi più dissolvenza solo sulla pagina QR, saltata con pulsante/clic, Esc o Tab; disattivata con movimento ridotto e nelle visite con ancora. Nessuna vibrazione. |
| Media | Il titolo a lettere separate poteva produrre una lettura frammentata con tecnologie assistive. | Nome accessibile completo sull’H1 e lettere decorative nascoste agli screen reader. |
| Media | Il gioco delle classi era legato al profilo, mischiava divertimento e raccolta dati. | Bonus pubblico e facoltativo, separato dal contatto; scelta non salvata né inviata, radio navigabili da tastiera e risultato annunciato. |
| Media | Condivisione senza feedback e dipendente da WhatsApp nel fallback. | Condivisione nativa, copia negli appunti con conferma e link selezionabile in caso di permessi negati. Annullamento gestito senza errori. Nessuna dipendenza da WhatsApp. |
| Media | Il link condiviso poteva conservare la destinazione QR e parametri della visita. | Condivisione della home con il solo `src=share`, senza hash o parametri precedenti. Gli URL dei QR stampati restano validi. |
| Media | Font remoti, possibile variazione del layout e richiesta a un servizio esterno. | Font WOFF2 locali con `font-display: swap`, preload del display e licenze OFL incluse. |
| Media | Contrasto e leggibilità sopra sfondi ricchi; titoli rosa e focus poco uniformi. | Rosa dei testi schiarito, sfondi oscurati, focus visibile, link distinguibili, bersagli principali da almeno 44–48 px e offset delle ancore sotto l’header. |
| Bassa | Metadati social con percorsi relativi, home e QR poco distinti e possibile cache obsoleta. | URL assoluti per immagine/canonical/OG, descrizioni distinte e hash del contenuto per CSS/JS. |
| Bassa | Componenti e documentazione descrivevano ancora comportamenti dismessi. | Componenti condivisi in HTML, renderer senza dipendenze, README e memoria aggiornati. Backend e script di montaggio non utilizzati rimossi. |

## Verifiche completate

- Home e pagina QR in Chromium a **320, 360, 390, 600, 768, 1024 e 1440 px**: nessuno scorrimento orizzontale; tutte le immagini e i font caricati. Screenshot mobile e desktop esaminati.
- Testo al **200% a 320 px**: home, pagina QR e privacy senza overflow.
- **JavaScript disattivato**: contenuti, contatti e FAQ utilizzabili su entrambe le pagine. Pulsanti dipendenti da JS e gioco non vengono proposti.
- **Tastiera**: salto al contenuto, navigazione, FAQ, radio con frecce, chiusura intro con Tab/Esc e focus successivo.
- **Movimento ridotto**: niente intro o coriandoli. **Session storage bloccato**: pagina QR e interazioni ancora funzionanti.
- **Condivisione**: copia riuscita, appunti negati, funzione nativa riuscita, annullata o fallita; fallback manuale e ripristino del pulsante verificati.
- **axe-core 4.14.0**, regole WCAG 2 A/AA, 2.1 A/AA e best practice, su home, QR e privacy a 320 e 1440 px con FAQ e gioco aperti: **zero violazioni rilevate**. Questo non costituisce una certificazione di accessibilità.
- Per i contrasti su sfondi illustrati/gradienti, che axe segnala come da verificare, confronto dei colori del testo con il fondo effettivamente renderizzato a 320 e 1440 px: nessun valore sotto 4,5:1 per testo normale o 3:1 per testo grande negli stati esaminati. Minimo complessivo 4,09:1, riferito a testo grande della pagina QR desktop.
- Nessun errore JavaScript o risposta HTTP di errore per le risorse locali durante le prove; nessuna risorsa esterna o richiesta POST nel caricamento e nelle interazioni locali verificate.
- `node --check` per entrambi i moduli, `python3 render-site.py --check` e `git diff --check` superati.

## Limiti e informazioni da non inventare

La caccia rimane descrittiva: il progetto non contiene un sistema di verifica della vincita, conteggio QR, assegnazione o ritiro del premio. Non sono state aggiunte regole o promesse non confermate. L’apertura del profilo Instagram è collegata all’account indicato dall’utente; disponibilità dell’app, login e Direct dipendono da Instagram. Le prove browser sono state eseguite in Chromium, senza verifica su dispositivi fisici iOS/Android.

## Aggiornamento splash — 25 ottobre 2026

Su richiesta dell’utente, lo splash di `/stallonati/` è stato reso più riconoscibile: logo in rotazione completa, orbita con dodici simboli zodiacali neon, alone e griglia sullo sfondo cosmico, onda d’impatto, grande timbro lime «SEI STATO STALLONATO» con bordi cyan/magenta, tremolio, esplosione di coriandoli e titolo a rimbalzo dopo l’uscita. Durata 2,8 secondi più dissolvenza, senza vibrazione.

«Rivedi l’intro» permette di ripetere l’esperienza nella stessa sessione. Il valore tecnico della sessione è aggiornato per mostrare la nuova sequenza anche a chi aveva visto la versione precedente. Restano salto con clic/Tab/Esc, ripristino del focus, preferenza movimento ridotto anche quando cambia a pagina aperta, contenuti disponibili senza JavaScript e home senza splash.

Verificato in Chromium a 320×720, 390×844, 1440×900 e 844×390: animazioni attive, canvas con coriandoli, nessun overflow orizzontale, uscita automatica, replay, focus e comportamento tra visite. Controllati movimento ridotto, sua modifica durante lo splash, JavaScript disattivato e assenza dell’intro nella home. Nessun errore JavaScript nelle prove. Esaminati screenshot dell’impatto e del timbro leggibile.
