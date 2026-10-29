import type { Book } from "./types.ts";

export type AuthorGender = "female" | "male" | "nonbinary" | "unknown";
export type AuthorProfile = {
  gender: AuthorGender;
  source?: { url: string; title: string };
  evidence?: string;
  checkedAt?: string;
  note?: string;
};
export type AuthorProfiles = Record<string, AuthorProfile>;
export const GENDER_GROUPS: { key: AuthorGender; label: string }[] = [
  { key: "female", label: "Kvinner" },
  { key: "male", label: "Menn" },
  { key: "nonbinary", label: "Ikke-binære / annen kjønnsidentitet" },
  { key: "unknown", label: "Uavklart" }
];

// A missing or unsourced classification must never become a name-based guess.
export function authorProfile(name: string, profiles: AuthorProfiles): AuthorProfile {
  const profile = Object.hasOwn(profiles, name) ? profiles[name] : undefined;
  if (!profile?.source || !GENDER_GROUPS.some(({ key }) => key === profile.gender)) {
    return { ...profile, gender: "unknown" };
  }
  return profile;
}

export function bookAuthors(book: Book): string[] {
  // Multiple authors must be entered explicitly; do not split names on punctuation.
  const names = (book.authors?.length ? book.authors : [book.author])
    .map((name) => name.trim())
    .filter(Boolean);
  return [...new Set(names.length ? names : ["Ukjent forfatter"])];
}

export function authorDistribution(books: Book[], profiles: AuthorProfiles) {
  const counts: Record<AuthorGender, number> = {
    female: 0,
    male: 0,
    nonbinary: 0,
    unknown: 0
  };
  const entries = books.flatMap((book) =>
    bookAuthors(book).map((name) => {
      const profile = authorProfile(name, profiles);
      counts[profile.gender] += 1;
      return { book, name, profile };
    })
  );
  return { counts, total: entries.length, bookCount: books.length, entries };
}

export function isValidRating(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 6;
}

export function bookRating(book: Book) {
  const ratings = book.terningkastene
    .map((rating) => rating.terningkast)
    .filter(isValidRating);
  const sum = ratings.reduce((total, value) => total + value, 0);
  return {
    count: ratings.length,
    sum,
    average: ratings.length ? sum / ratings.length : null,
    min: ratings.length ? Math.min(...ratings) : null,
    max: ratings.length ? Math.max(...ratings) : null
  };
}

export function ratingsPerBook(books: Book[]) {
  return books.map((book) => {
    const rating = bookRating(book);
    return {
      name: book.title,
      snitt: rating.average,
      range: rating.count ? [rating.min!, rating.max!] : null,
      count: rating.count
    };
  });
}

export function ratingsByChooser(books: Book[]) {
  const members = new Map<
    string,
    {
      name: string;
      bookCount: number;
      ratedBookCount: number;
      ratingCount: number;
      sum: number;
    }
  >();
  for (const book of books) {
    const row = members.get(book.chosenBy) ?? {
      name: book.chosenBy,
      bookCount: 0,
      ratedBookCount: 0,
      ratingCount: 0,
      sum: 0
    };
    const rating = bookRating(book);
    row.bookCount += 1;
    row.ratedBookCount += Number(rating.count > 0);
    row.ratingCount += rating.count;
    row.sum += rating.sum;
    members.set(book.chosenBy, row);
  }
  return [...members.values()]
    .map((row) => ({
      ...row,
      average: row.ratingCount ? row.sum / row.ratingCount : null
    }))
    .sort(
      (a, b) =>
        (b.average ?? -1) - (a.average ?? -1) || a.name.localeCompare(b.name, "nb")
    );
}

export function formatRating(value: number | null): string {
  return value === null
    ? "Ingen kast ennå"
    : value.toLocaleString("nb-NO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
}
