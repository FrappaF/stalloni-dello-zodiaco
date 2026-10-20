# Landing "Sei stato stallonato!"

Pagina statica (HTML/CSS/JS, nessuna build) aperta dal QR code. Pensata per smartphone.

| File | Cosa fa |
|---|---|
| `index.html` | La pagina: titolo, oroscopo scherzoso, form contatti, schermata di successo con condivisione |
| `style.css` | Stile neon/graffiti preso dal logo |
| `script.js` | Animazioni, validazione e invio del form |
| `config.js` | **Dove si configura il backend del form** |
| `privacy.html` | Informativa privacy: completare i campi in giallo `[...]` |
| `assets/` | Logo ottimizzato, favicon, immagine di anteprima per WhatsApp/social |

## Provarla in locale

```bash
cd landing && python3 -m http.server 8000
# poi apri http://localhost:8000
```

## Collegare la raccolta contatti (da decidere)

Finché `FORM_ENDPOINT` in `config.js` è vuoto, il form è in **modalità demo**: mostra il successo ma non salva niente.

### Opzione A: Formspree (più semplice)
1. Crea un account su formspree.io e un nuovo form.
2. Copia l'URL (`https://formspree.io/f/xxxx`) in `FORM_ENDPOINT`, lascia `PROVIDER: "formspree"`.
3. I contatti arrivano via email e si esportano in CSV. Il piano gratuito ha un limite mensile di invii.

### Opzione B: Google Sheets (gratis, dati in un foglio)
1. Crea un Google Sheet, poi *Estensioni → Apps Script*.
2. Incolla il contenuto di [`google-apps-script.js`](google-apps-script.js) e salva.
3. *Esegui il deployment → Nuovo deployment → App web*, "Esegui come: me", "Chi ha accesso: chiunque".
4. Copia l'URL `/exec` in `FORM_ENDPOINT` e imposta `PROVIDER: "google"`.

## Parametro sorgente

Aggiungi `?src=nome` all'URL del QR (es. `?src=locandina-bar`) per sapere da dove arriva ogni iscritto: finisce nella colonna `fonte`.
