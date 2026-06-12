/**
 * Calculates Easter Sunday for a given year using the Meeus/Jones/Butcher
 * algorithm for the Gregorian calendar. Accurate for all years >= 1583.
 */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 1-based
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** Formats a local Date as "YYYY-MM-DD" without UTC conversion. */
function toIsoLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export type MoveableFeast = {
  date: Date;
  isoDate: string; // "YYYY-MM-DD"
  name: string;
  offsetFromEaster: number;
};

/**
 * Returns the moveable feasts that depend on Easter for a given year.
 * All offsets follow the Roman Rite calendar.
 *
 * Corpus Christi: Thursday (+60). Some local churches transfer it to
 * the following Sunday (+63). The Thursday date is returned here.
 */
export function moveableFeasts(year: number): MoveableFeast[] {
  const easter = easterSunday(year);

  const feasts: Array<{ name: string; offset: number }> = [
    { name: "Pentecostés", offset: 49 },
    { name: "Santísima Trinidad", offset: 56 },
    { name: "Corpus Christi", offset: 60 },       // Thursday
    { name: "Sagrado Corazón de Jesús", offset: 68 },  // Friday
    { name: "Corazón Inmaculado de María", offset: 69 }, // Saturday
  ];

  return feasts.map(({ name, offset }) => {
    const date = addDays(easter, offset);
    const isoDate = toIsoLocal(date);
    return { date, isoDate, name, offsetFromEaster: offset };
  });
}
