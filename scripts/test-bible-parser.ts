import { parseBibleChapter } from "../app/utils/bibleParser";

const rawText = `
1 Yo soy la verdadera vid, y mi Padre es el labrador.

2 Todo sarmiento que en mí no da fruto, le cortará.

3 Ya vosotros estáis limpios.
`;

const verses = parseBibleChapter({
  book: "Juan",
  chapter: 15,
  rawText,
});

console.log(JSON.stringify(verses, null, 2));