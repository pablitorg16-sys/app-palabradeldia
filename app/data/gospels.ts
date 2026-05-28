import type { Gospel } from "../types";

function getTodayIsoDate() {
  const today = new Date();

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
}

export const gospels: Gospel[] = [
  {
    date: "2026-05-14",
    reference: "Juan 14, 27",
    title: "La paz os dejo",
    text: "La paz os dejo, mi paz os doy; no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.",
  },
  {
    date: "2026-05-13",
    reference: "Juan 15, 9-11",
    title: "Permaneced en mi amor",
    text: "Como el Padre me ha amado, así os he amado yo; permaneced en mi amor.",
  },
  {
    date: "2026-05-12",
    reference: "Mateo 5, 14-16",
    title: "Vosotros sois la luz del mundo",
    text: "Vosotros sois la luz del mundo. No se puede ocultar una ciudad puesta en lo alto.",
  },
];

export function getTodayGospel() {
  const today = getTodayIsoDate();

  return gospels.find((gospel) => gospel.date === today) ?? gospels[0];
}

export function getGospelByDate(date: string) {
  return gospels.find((gospel) => gospel.date === date);
}