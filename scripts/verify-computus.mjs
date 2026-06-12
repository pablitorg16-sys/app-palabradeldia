function easterSunday(year) {
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
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

// Use local date methods to avoid UTC timezone shift
function fmt(d) {
  const days = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day} (${days[d.getDay()]})`;
}

for (const year of [2026, 2027, 2028]) {
  const e = easterSunday(year);
  console.log(`\n=== ${year} ===`);
  console.log("Pascua:                " + fmt(e));
  console.log("Pentecostés (+49):     " + fmt(addDays(e, 49)));
  console.log("Trinidad (+56):        " + fmt(addDays(e, 56)));
  console.log("Corpus Christi (+60):  " + fmt(addDays(e, 60)));
  console.log("Sagrado Corazón (+68): " + fmt(addDays(e, 68)));
  console.log("Cor.Inmac.María (+69): " + fmt(addDays(e, 69)));
}
