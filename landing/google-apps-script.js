// Da incollare in Google Sheets → Estensioni → Apps Script (vedi README.md).
// Ogni iscrizione diventa una riga nel primo foglio.
const COLUMNS = [
  "ricevuto_il", "nome", "telefono", "email", "personaggio",
  "eta_16_plus", "consenso_privacy", "consenso_timestamp", "fonte", "pagina",
];

function doPost(e) {
  // Evita righe sovrapposte se arrivano più iscrizioni insieme
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    return saveRow(e);
  } finally {
    lock.releaseLock();
  }
}

function saveRow(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);

  const p = e.parameter || {};
  if (p._gotcha) return ContentService.createTextOutput("ok");

  const row = COLUMNS.map((c) => (c === "ricevuto_il" ? new Date() : String(p[c] || "").slice(0, 200)));
  sheet.appendRow(row);
  return ContentService.createTextOutput("ok");
}
