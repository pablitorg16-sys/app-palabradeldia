import type { BibleVerse, GospelBook } from "../data/bible/types";

type ParseChapterOptions = {
  book: GospelBook;
  chapter: number;
  rawText: string;
};

function cleanVerseText(text: string) {
  return text
    .replace(/\|/g, "")
    .replace(/[*_#]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[-–—.:;,\])}»”'" ]+/, "")
    .trim();
}

export function parseBibleChapter({
  book,
  chapter,
  rawText,
}: ParseChapterOptions): BibleVerse[] {
  const normalized = rawText
    .replace(/\r/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const maxVerseSearch = 200;
  const markers: Array<{ verse: number; index: number; endIndex: number }> = [];

  for (let verse = 1; verse <= maxVerseSearch; verse += 1) {
    const markerRegex = new RegExp(
      `(^|\\s)${verse}(?=\\D)`,
      "g"
    );

    const match = markerRegex.exec(normalized);

    if (!match) {
      break;
    }

    const index = match.index + match[1].length;
    const endIndex = index + String(verse).length;

    markers.push({
      verse,
      index,
      endIndex,
    });
  }

  const verses: BibleVerse[] = [];

  for (let i = 0; i < markers.length; i += 1) {
    const current = markers[i];
    const next = markers[i + 1];

    const rawVerseText = normalized.slice(
      current.endIndex,
      next ? next.index : normalized.length
    );

    const verseText = cleanVerseText(rawVerseText);

    if (!verseText) continue;

    verses.push({
      book,
      chapter,
      verse: current.verse,
      text: verseText,
    });
  }

  return verses;
}