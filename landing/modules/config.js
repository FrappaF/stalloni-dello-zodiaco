// Configurazione della raccolta contatti.
// Finché FORM_ENDPOINT è vuoto il form funziona in "modalità demo":
// mostra il messaggio di successo ma NON salva nulla (lo scrive solo in console).
// Vedi landing/README.md per come collegare Formspree o un Google Sheet.
window.STALLONI_CONFIG = {
  // Profilo ufficiale della community.
  INSTAGRAM_URL: "https://www.instagram.com/stalloni_official/",

  // Formspree:     "https://formspree.io/f/xxxxxxx"
  // Google Sheets: "https://script.google.com/macros/s/xxxxxxx/exec"
  FORM_ENDPOINT: "https://formspree.io/f/xrpevdwb",

  // "formspree" legge la risposta del server; "google" invia in modalità no-cors
  // (Apps Script non restituisce header CORS, quindi la risposta non è leggibile).
  PROVIDER: "formspree",
};
