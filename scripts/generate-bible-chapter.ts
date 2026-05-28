import fs from "fs";
import path from "path";

import { parseBibleChapter } from "../app/utils/bibleParser";
import type { GospelBook } from "../app/data/bible/types";

const [, , rawBook, rawChapter] = process.argv;

if (!rawBook || !rawChapter) {
  console.error("Uso: npx tsx scripts/generate-bible-chapter.ts Juan 1");
  process.exit(1);
}

const book = rawBook.charAt(0).toUpperCase() + rawBook.slice(1).toLowerCase();
const gospelBooks: GospelBook[] = ["Mateo", "Marcos", "Lucas", "Juan"];

if (!gospelBooks.includes(book as GospelBook)) {
  console.error("Libro no soportado. Usa Mateo, Marcos, Lucas o Juan.");
  process.exit(1);
}

const gospelBook = book as GospelBook;

const chapter = Number(rawChapter);

if (Number.isNaN(chapter)) {
  console.error("El capítulo debe ser un número.");
  process.exit(1);
}

const bookFolder = book.toLowerCase();

const inputFileName = `${bookFolder}-${chapter}.txt`;

const inputPath = path.join(
  process.cwd(),
  "raw-bible",
  bookFolder,
  inputFileName
);

if (!fs.existsSync(inputPath)) {
  console.error(`No existe: raw-bible/${bookFolder}/${inputFileName}`);
  process.exit(1);
}

const rawText = fs.readFileSync(inputPath, "utf-8");

const verses = parseBibleChapter({
  book: gospelBook,
  chapter,
  rawText,
});

if (verses.length === 0) {
  console.error("No se encontraron versículos.");
  process.exit(1);
}

const bibleFilePath = path.join(
  process.cwd(),
  "app",
  "data",
  "bible",
  `${bookFolder}.ts`
);

const generatedContent = verses
  .map(
    (verse) => `  {
    book: "${verse.book}",
    chapter: ${verse.chapter},
    verse: ${verse.verse},
    text: ${JSON.stringify(verse.text)},
  },`
  )
  .join("\n");

const existingFile = fs.readFileSync(bibleFilePath, "utf-8");

const updatedFile = existingFile.replace(
  "];",
  `${generatedContent}\n];`
);

fs.writeFileSync(bibleFilePath, updatedFile, "utf-8");

console.log(`Capítulo ${book} ${chapter} añadido a ${bookFolder}.ts`);
console.log(`Versículos importados: ${verses.length}`);