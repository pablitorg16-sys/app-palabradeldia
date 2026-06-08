async function loadBook(book: string) {
  switch (book) {
    case "Mateo":
      return (await import("../data/bible/mateo")).mateo;
    case "Marcos":
      return (await import("../data/bible/marcos")).marcos;
    case "Lucas":
      return (await import("../data/bible/lucas")).lucas;
    case "Juan":
      return (await import("../data/bible/juan")).juan;
    default:
      return [];
  }
}

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

export async function getPassageFromReference(reference: string) {
  const parsed = parseReference(reference);
  if (!parsed) return "";

  const verses = await loadBook(parsed.book);

  const filtered = verses.filter(
    (verse) =>
      verse.chapter === parsed.chapter &&
      verse.verse >= parsed.startVerse &&
      verse.verse <= parsed.endVerse
  );

  const expectedCount = parsed.endVerse - parsed.startVerse + 1;

  if (filtered.length !== expectedCount) {
    console.warn(
      `Faltan versículos para ${reference}. Esperados: ${expectedCount}. Encontrados: ${filtered.length}.`
    );
  }

  return filtered.map((verse) => verse.text.trim()).join(" ");
}