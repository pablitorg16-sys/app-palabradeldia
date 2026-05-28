import { torresAmatGospels } from "../data/bible";

function parseReference(reference: string) {
  const [bookPart, versesPart] = reference.trim().split(",");

  if (!bookPart || !versesPart) return null;

  const bookTokens = bookPart.trim().split(" ");
  const chapter = Number(bookTokens.pop());
  const book = bookTokens.join(" ");

  const [startVerse, endVerse] = versesPart
    .trim()
    .split("-")
    .map((value) => Number(value.trim()));

  return {
    book,
    chapter,
    startVerse,
    endVerse: endVerse ?? startVerse,
  };
}

export function getPassageFromReference(reference: string) {
  const parsed = parseReference(reference);

  if (!parsed) return "";

  const verses = torresAmatGospels.filter(
    (verse) =>
      verse.book === parsed.book &&
      verse.chapter === parsed.chapter &&
      verse.verse >= parsed.startVerse &&
      verse.verse <= parsed.endVerse
  );

  const expectedCount = parsed.endVerse - parsed.startVerse + 1;

  if (verses.length !== expectedCount) {
    console.warn(
      `Faltan versículos para ${reference}. Esperados: ${expectedCount}. Encontrados: ${verses.length}.`
    );
  }

  return verses.map((verse) => verse.text.trim()).join(" ");
}