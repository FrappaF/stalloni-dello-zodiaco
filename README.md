# Stalloni dello Zodiaco

Tutti i prodotti digitali della community **Stalloni dello Zodiaco**.

## Progetti

| Cartella | Cosa | Stato |
|---|---|---|
| [`landing/`](landing/) | Home del progetto e caccia ai QR a Savona; `/stallonati/` ospita la schermata community e il form contatti | Pronta, contatti salvati su Formspree |
| [`brand/stickers/`](brand/stickers/) | Sticker coordinati al nuovo brand, con file stampa e QR tracciabili | Pronti per prova di stampa |

## Deploy

La cartella `landing/` viene pubblicata su GitHub Pages ad ogni push su `main`
(workflow in `.github/workflows/pages.yml`). Per attivarlo: *Settings → Pages → Source: GitHub Actions*.

## Design system

Lo stile segue `stalloni-design-system.md` (nella cartella condivisa del progetto): token in cima a `landing/style.css`,
font Bangers / Space Grotesk / Inter, immagini ottimizzate in `landing/assets/{brand,illustrations,backgrounds}/`.
Gli originali ad alta risoluzione sono nella cartella `Assets` del progetto.

## Memoria del progetto

Le informazioni confermate e le scelte di struttura sono in [`PROJECT_MEMORY.md`](PROJECT_MEMORY.md).
