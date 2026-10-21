# Sticker ufficiali · Stalloni dello Zodiaco

Tre creatività coordinate al brand Instagram e al sito. Tutti i testi parlano di **persone**, **gente** e **community**, senza usare un genere come universale.

## File pronti per la stampa

| Variante | Formato finito | Uso |
|---|---:|---|
| `sticker-01-mandria-tondo-85mm` | tondo 85 mm | Identità e riconoscimento del marchio |
| `sticker-02-gruppo-quadrato-85mm` | quadrato 85 mm | Problema/beneficio, ideale per locali e bacheche |
| `sticker-03-savona-verticale-70x90mm` | 70×90 mm | Lancio locale a Savona |

La cartella `print/` contiene PNG RGB a 300 dpi e PDF a 300 dpi. Le dimensioni dei file includono 3 mm di abbondanza per lato. La cartella `preview/` contiene copie WebP leggere.

## Regole QR

- QR nero su fondo bianco, senza grafiche sovrapposte.
- Correzione errore Q e quiet zone di quattro moduli.
- Dimensione stampata superiore a 25 mm.
- Ogni variante usa un parametro `src` differente, registrato in `qr-destinazioni.csv`.
- Prima dell'ordine, provare i file fisici al 100% da iPhone e Android.

## Rigenerazione

Il generatore usa Pillow e il pacchetto Python `qrcode`:

```bash
python3 -m pip install qrcode pillow
python3 brand/stickers/genera_sticker.py
```

La destinazione corrente è il sito GitHub Pages ufficiale. Quando verrà collegato il dominio definitivo, aggiornare `BASE_URL` e rigenerare i file prima della stampa.
