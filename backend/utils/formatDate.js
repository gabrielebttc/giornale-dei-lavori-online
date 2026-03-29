/**
 * Converte una data UTC in una stringa localizzata italiana
 * Gestisce automaticamente ora solare (+1) e legale (+2)
 */
function utcToItaly(utcDateString) {
  const date = new Date(utcDateString);
  
  return date.toLocaleString("it-IT", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

/**
 * Prende una data/ora intesa come "locale italiana" e la converte in UTC ISO
 */
function italyToUtc(year, month, day, hour = 0, minute = 0) {
  // Creiamo una stringa che specifichi il fuso orario di Roma
  // Mese -1 perché in JS i mesi partono da 0 (Gennaio = 0)
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
  
  // Usiamo Intl per trovare l'offset attuale di Roma per quella specifica data
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Rome",
    timeZoneName: "shortOffset"
  });
  
  // Questa parte serve a capire se in quella data Roma è +1 o +2
  const parts = formatter.formatToParts(new Date(dateStr));
  const offset = parts.find(p => p.type === 'timeZoneName').value; // es. "GMT+2"

  // Convertiamo "+2" → "+02:00" (formato richiesto da Date)
  const rawOffset = offset.replace("GMT", ""); // "+2" o "+1"
  const sign = rawOffset[0]; // "+" o "-"
  const hours = rawOffset.slice(1).padStart(2, '0'); // "02" o "01"
  const isoOffset = `${sign}${hours}:00`;

  // Costruiamo una data che JS capisce essere riferita a Roma e la convertiamo in ISO (UTC)
  const finalDate = new Date(dateStr + isoOffset);
  return finalDate.toISOString();
}

module.exports = { utcToItaly, italyToUtc };