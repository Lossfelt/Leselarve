export type Terningkast = {
  medlem: string;
  terningkast: number;
};

export type Book = {
  title: string;
  author: string;
  /** Explicit author names for co-authored books; author remains the display credit. */
  authors?: string[];
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
