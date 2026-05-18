export type Terningkast = {
  medlem: string;
  terningkast: number;
};

export type Book = {
  title: string;
  author: string;
  authorNationality: string;
  published: number;
  chosenBy: string;
  pages: number;
  numberInLine: number;
  terningkastene: Terningkast[];
  picture: string;
};

export type SortKey = "numberInLine" | "title" | "author" | "published" | "pages";

export type View = "Bøker" | "Statistikk";
