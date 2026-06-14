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

type ParsedRange = {
  book: string;
  startChapter: number;
  startVerse: number;
  endChapter: number;
  endVerse: number;
};

function parseReference(reference: string): ParsedRange | null {
  const ref = reference.trim();

  const bookMatch = ref.match(/^([A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+)\s(\d.*)$/);
  if (!bookMatch) return null;

  const book = bookMatch[1].trim();
  const rest = bookMatch[2].trim();

  const crossChapterMatch = rest.match(
    /^(\d+)[,\s]+(\d+)\s*-\s*(\d+)[,\s]+(\d+)$/
  );

  if (crossChapterMatch) {
    return {
      book,
      startChapter: Number(crossChapterMatch[1]),
      startVerse: Number(crossChapterMatch[2]),
      endChapter: Number(crossChapterMatch[3]),
      endVerse: Number(crossChapterMatch[4]),
    };
  }

  const sameChapterMatch = rest.match(/^(\d+)[,\s]+(\d+)(?:\s*-\s*(\d+))?$/);
  if (sameChapterMatch) {
    const chapter = Number(sameChapterMatch[1]);
    const startVerse = Number(sameChapterMatch[2]);
    const endVerse = sameChapterMatch[3] ? Number(sameChapterMatch[3]) : startVerse;

    return {
      book,
      startChapter: chapter,
      startVerse,
      endChapter: chapter,
      endVerse,
    };
  }

  return null;
}

export async function getPassageFromReference(reference: string): Promise<string> {
  const parsed = parseReference(reference);
  if (!parsed) return "";

  const verses = await loadBook(parsed.book);

  const filtered = verses.filter((verse) => {
    if (parsed.startChapter === parsed.endChapter) {
      return (
        verse.chapter === parsed.startChapter &&
        verse.verse >= parsed.startVerse &&
        verse.verse <= parsed.endVerse
      );
    }

    if (verse.chapter === parsed.startChapter) {
      return verse.verse >= parsed.startVerse;
    }
    if (verse.chapter === parsed.endChapter) {
      return verse.verse <= parsed.endVerse;
    }
    return verse.chapter > parsed.startChapter && verse.chapter < parsed.endChapter;
  });

  if (filtered.length === 0) {
    console.warn(`Sin versículos para: ${reference}`);
    return "";
  }

  return filtered.map((verse) => verse.text.trim()).join(" ");
}