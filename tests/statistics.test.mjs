import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  authorDistribution,
  bookAuthors,
  bookRating,
  formatRating,
  isValidRating,
  ratingsByChooser,
  ratingsPerBook
} from "../src/statistics.ts";

const books = JSON.parse(
  readFileSync(new URL("./fixtures/catalog-2026-10-29.json", import.meta.url))
);
const profiles = JSON.parse(
  readFileSync(new URL("../src/AUTHORS.json", import.meta.url))
);
const makeBook = (overrides = {}) => ({
  ...books[0],
  author: "Known woman",
  chosenBy: "A",
  terningkastene: [],
  ...overrides
});
const casts = (...values) =>
  values.map((terningkast, index) => ({ medlem: `Voter ${index}`, terningkast }));
const testProfiles = {
  "Known woman": {
    gender: "female",
    source: { url: "https://example.org/woman", title: "Biography" }
  },
  "Known man": {
    gender: "male",
    source: { url: "https://example.org/man", title: "Biography" }
  },
  "Nonbinary author": {
    gender: "nonbinary",
    source: { url: "https://example.org/nonbinary", title: "Biography" }
  },
  Unsourced: { gender: "male" }
};

test("ratings include only integer dice rolls from 1 to 6", () => {
  assert.deepEqual(
    [0, -1, 7, 2.5, NaN, Infinity, undefined, "5"].map(isValidRating),
    Array(8).fill(false)
  );
  assert.deepEqual([1, 2, 3, 4, 5, 6].map(isValidRating), Array(6).fill(true));
  assert.deepEqual(bookRating(makeBook({ terningkastene: casts(0, 6, 3, 7, NaN) })), {
    count: 2,
    sum: 9,
    average: 4.5,
    min: 3,
    max: 6
  });
});

test("received ratings are grouped by chooser, not by voter, and weighted per cast", () => {
  const rows = ratingsByChooser([
    makeBook({ terningkastene: casts(6) }),
    makeBook({ terningkastene: casts(2, 2, 2, 0) }),
    makeBook(),
    makeBook({ chosenBy: "B", terningkastene: casts(5) })
  ]);
  assert.deepEqual(
    rows.map(({ name, average, ratingCount, bookCount, ratedBookCount, sum }) => ({
      name,
      average,
      ratingCount,
      bookCount,
      ratedBookCount,
      sum
    })),
    [
      { name: "B", average: 5, ratingCount: 1, bookCount: 1, ratedBookCount: 1, sum: 5 },
      { name: "A", average: 3, ratingCount: 4, bookCount: 3, ratedBookCount: 2, sum: 12 }
    ]
  );
});

test("unrated books/members remain visible without fabricated zero averages or ranges", () => {
  const input = [makeBook(), makeBook({ chosenBy: "B", terningkastene: casts(0, 0) })];
  assert.ok(
    ratingsByChooser(input).every(
      (row) => row.average === null && row.ratedBookCount === 0
    )
  );
  assert.ok(
    ratingsPerBook(input).every((row) => row.snitt === null && row.range === null)
  );
  assert.deepEqual(ratingsByChooser([]), []);
  assert.deepEqual(ratingsPerBook([]), []);
  assert.equal(formatRating(null), "Ingen kast ennå");
  assert.equal(formatRating(191 / 44), "4,34");
});

test("author contributions count once per author per book, repeat across books, preserve all categories", () => {
  const input = [
    makeBook(),
    makeBook(),
    makeBook({
      authors: ["Known woman", "Known man", "Known man", " Nonbinary author "]
    }),
    makeBook({ author: "New author" }),
    makeBook({ author: "Unsourced" })
  ];
  const result = authorDistribution(input, testProfiles);
  assert.deepEqual(result.counts, { female: 3, male: 1, nonbinary: 1, unknown: 2 });
  assert.equal(result.total, 7);
  assert.equal(result.bookCount, 5);
});

test("no names are guessed, including punctuation, missing names and object prototype keys", () => {
  for (const author of ["Name & Name", "Family, Given", "toString", "__proto__", ""]) {
    assert.equal(
      authorDistribution([makeBook({ author })], testProfiles).counts.unknown,
      1
    );
  }
  assert.deepEqual(bookAuthors(makeBook({ authors: [] })), ["Known woman"]);
  assert.deepEqual(bookAuthors(makeBook({ authors: [" ", ""] })), ["Ukjent forfatter"]);
  assert.equal(authorDistribution([], testProfiles).total, 0);
});

test("every current author classification has a source and audit evidence", () => {
  for (const [name, profile] of Object.entries(profiles)) {
    assert.ok(profile, `Missing metadata: ${name}`);
    assert.ok(["female", "male", "nonbinary", "unknown"].includes(profile.gender));
    assert.match(profile.source.url, /^https:\/\//);
    assert.ok(profile.source.title && profile.evidence && profile.checkedAt);
  }
  assert.match(profiles["Elena Ferrante"].note, /offentlige forfatteridentiteten/);
});

test("actual catalog totals and each member drill-down reconcile", () => {
  const overall = authorDistribution(books, profiles);
  assert.equal(overall.bookCount, 46);
  assert.deepEqual(overall.counts, { female: 23, male: 23, nonbinary: 0, unknown: 0 });
  const expected = {
    Heidi: [5, 3],
    Ida: [4, 4],
    Kyrre: [1, 2],
    Levin: [4, 5],
    Silje: [5, 4],
    Øivind: [4, 5]
  };
  let total = 0;
  for (const [name, [female, male]] of Object.entries(expected)) {
    const result = authorDistribution(
      books.filter((book) => book.chosenBy === name),
      profiles
    );
    assert.deepEqual(result.counts, { female, male, nonbinary: 0, unknown: 0 });
    total += result.total;
  }
  assert.equal(total, overall.total);
});

test("actual received rating sums and counts, with seven zero placeholders excluded", () => {
  const expected = {
    Heidi: [138, 36, 7, 8],
    Ida: [155, 37, 8, 8],
    Kyrre: [69, 17, 3, 3],
    Levin: [191, 44, 9, 9],
    Silje: [169, 42, 9, 9],
    Øivind: [186, 45, 9, 9]
  };
  for (const row of ratingsByChooser(books)) {
    const [sum, count, rated, total] = expected[row.name];
    assert.equal(row.sum, sum);
    assert.equal(row.ratingCount, count);
    assert.equal(row.ratedBookCount, rated);
    assert.equal(row.bookCount, total);
    assert.equal(row.average, sum / count);
  }
  assert.equal(
    ratingsPerBook(books).find((book) => book.name === "Et øye lukket").snitt,
    null
  );
  assert.equal(
    ratingsPerBook(books).find((book) => book.name === "Ein Lykkeleg Slutt").snitt,
    17 / 3
  );
});
