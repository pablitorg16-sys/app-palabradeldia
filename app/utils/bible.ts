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

function filterVerses(
  verses: { chapter: number; verse: number; text: string }[],
  parsed: ParsedRange
) {
  return verses.filter((verse) => {
    if (parsed.startChapter === parsed.endChapter) {
      return (
        verse.chapter === parsed.startChapter &&
        verse.verse >= parsed.startVerse &&
        verse.verse <= parsed.endVerse
      );
    }
    if (verse.chapter === parsed.startChapter) return verse.verse >= parsed.startVerse;
    if (verse.chapter === parsed.endChapter) return verse.verse <= parsed.endVerse;
    return verse.chapter > parsed.startChapter && verse.chapter < parsed.endChapter;
  });
}

// Handles discontinuous ranges separated by dots: "Lucas 1, 57-66.80"
// The dot is the liturgical notation for skipping intermediate verses.
async function getPassageFromDiscontinuousReference(reference: string): Promise<string> {
  // Split "Book Chapter, seg1.seg2" → book+chapter prefix + segments
  const bookMatch = reference.trim().match(/^([A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+)\s(\d+),\s*(.+)$/);
  if (!bookMatch) return "";

  const book = bookMatch[1].trim();
  const chapter = Number(bookMatch[2]);
  const versePart = bookMatch[3]; // e.g. "57-66.80" or "1-2.11-18"

  const verses = await loadBook(book);
  const seen = new Set<number>();
  const result: { chapter: number; verse: number; text: string }[] = [];

  for (const segment of versePart.split(".")) {
    const trimmed = segment.trim();
    const rangeMatch = trimmed.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!rangeMatch) continue;

    const startVerse = Number(rangeMatch[1]);
    const endVerse = rangeMatch[2] ? Number(rangeMatch[2]) : startVerse;

    for (const v of verses) {
      if (v.chapter === chapter && v.verse >= startVerse && v.verse <= endVerse) {
        const key = v.chapter * 1000 + v.verse;
        if (!seen.has(key)) {
          seen.add(key);
          result.push(v);
        }
      }
    }
  }

  return result.map((v) => v.text.trim()).join(" ");
}

export async function getPassageFromReference(reference: string): Promise<string> {
  // Dot in the verse section indicates discontinuous ranges within same chapter
  const dotInVerses = /\d\.\d/.test(reference);
  if (dotInVerses) {
    const text = await getPassageFromDiscontinuousReference(reference);
    if (!text) console.warn(`Sin versículos para: ${reference}`);
    return text;
  }

  const parsed = parseReference(reference);
  if (!parsed) return "";

  const verses = await loadBook(parsed.book);
  const filtered = filterVerses(verses, parsed);

  if (filtered.length === 0) {
    console.warn(`Sin versículos para: ${reference}`);
    return "";
  }

  return filtered.map((verse) => verse.text.trim()).join(" ");
}