export type GospelBook = "Mateo" | "Marcos" | "Lucas" | "Juan";

export type BibleVerse = {
  book: GospelBook;
  chapter: number;
  verse: number;
  text: string;
};