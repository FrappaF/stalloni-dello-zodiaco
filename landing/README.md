# Stalloni dello Zodiaco: home e pagina QR

Sito statico, pensato per smartphone. La **home** presenta la caccia ai QR a Savona; **`/stallonati/`** accoglie chi scopre la community. Il contatto è **[@stalloni_official](https://www.instagram.com/stalloni_official/)**. Non è previsto un gruppo WhatsApp.

## Modificare i contenuti

- `../site-source/home.html`: hero e spiegazione della caccia.
- `../site-source/qr.html`: hero della pagina QR.
- `../site-source/head.html`, `intro.html`: metadati e splash riservato alla pagina QR.
- `components/*.html`: header, attività, chi siamo, contatto Instagram, FAQ, gioco delle classi e footer condivisi.
- `style.css`: token del brand, layout responsive, font locali e movimento ridotto.
- `modules/community.js`: gioco delle classi e condivisione. `modules/qr-intro.js`: splash animato con orbita zodiacale, timbro e coriandoli solo su `/stallonati/`.
- `privacy.html`: comportamenti effettivi della pagina e servizi esterni.
- `assets/`: mascotte, illustrazioni, sfondi, immagini social e font con licenze OFL.

Dalla radice del repository:

```bash
python3 render-site.py
python3 render-site.py --check
python3 -m http.server 8000 --directory landing
```

Il renderer senza dipendenze scrive `index.html` e `stallonati/index.html` già completi, a partire dai componenti condivisi, e aggiorna le versioni CSS/JS basate sui contenuti. Committare anche gli HTML generati. Il deploy non richiede una build. Lettura, FAQ e collegamenti funzionano senza JavaScript e aprendo i file offline; gioco e condivisione vengono mostrati solo quando JS è disponibile.

## Dati e comportamento

Non ci sono moduli, invii a Formspree, analytics o raccolta di recapiti. La scelta della classe non viene salvata. `sessionStorage` conserva solo l'indicatore tecnico dell'intro, saltata con Esc, Tab o clic e con movimento ridotto. Senza memoria disponibile il sito resta utilizzabile. Lo splash dura 2,8 secondi più dissolvenza e si può ripetere con «Rivedi l’intro».

I QR stampati e i parametri `?src=...` restano compatibili, ma il sito non li usa per statistiche. La condivisione propone la home con `?src=share`, eliminando parametri della visita e senza diffondere la destinazione riservata ai QR.

La caccia è descrittiva: non sono implementati verifica della vincita, conteggio QR o assegnazione/ritiro del premio. Non inventare queste modalità né rivelare il tipo di premio.

## Pubblicazione e verifiche

Il workflow `.github/workflows/pages.yml` pubblica `landing/` ai push su `main`: `https://frappaf.github.io/stalloni-dello-zodiaco/`.

Criticità, risoluzioni e verifiche in [`../UI-UX-AUDIT.md`](../UI-UX-AUDIT.md). Controllare entrambe le pagine, mobile e desktop, tastiera, testo al 200%, movimento ridotto, JavaScript disattivato e alternative di condivisione.
