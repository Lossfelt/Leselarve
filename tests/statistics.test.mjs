import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  authorDistribution,
  bookRating,
  formatRating,
  isValidRating,
  ratingsByChooser,
  ratingsPerBook
} from "../src/statistics.ts";

const books = JSON.parse(
  readFileSync(new URL("./fixtures/catalog-2026-10-29.json", import.meta.url))
);
const genders = JSON.parse(readFileSync(new URL("../src/AUTHORS.json", import.meta.url)));
const makeBook = (overrides = {}) => ({
  ...books[0],
  author: "Known woman",
  chosenBy: "A",
  terningkastene: [],
  ...overrides
});
const casts = (...values) =>
  values.map((terningkast, index) => ({ medlem: `Voter ${index}`, terningkast }));
const testGenders = {
  "Known woman": "female",
  "Known man": "male",
  "Nonbinary author": "nonbinary",
  "Invalid category": "invalid"
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

test("received ratings are grouped by chooser and give each rated book equal weight", () => {
  const rows = ratingsByChooser([
    makeBook({ terningkastene: casts(6) }),
    makeBook({ terningkastene: casts(2, 2, 2, 0) }),
    makeBook(),
    makeBook({ terningkastene: casts(0, null, undefined, 7, 2.5, NaN) }),
    makeBook({ chosenBy: "B", terningkastene: casts(5) })
  ]);
  assert.deepEqual(
    rows.map(
      ({ name, average, ratingCount, bookCount, ratedBookCount, bookAverageSum }) => ({
        name,
        average,
        ratingCount,
        bookCount,
        ratedBookCount,
        bookAverageSum
      })
    ),
    [
      {
        name: "B",
        average: 5,
        ratingCount: 1,
        bookCount: 1,
        ratedBookCount: 1,
        bookAverageSum: 5
      },
      {
        name: "A",
        average: 4,
        ratingCount: 4,
        bookCount: 4,
        ratedBookCount: 2,
        bookAverageSum: 8
      }
    ]
  );
});

test("book averages are not rounded before aggregation and extra votes do not increase a book's weight", () => {
  const input = [
    makeBook({ terningkastene: casts(1, 1, 2) }),
    makeBook({ terningkastene: casts(5, 6) })
  ];
  const [row] = ratingsByChooser(input);
  assert.equal(row.average, (4 / 3 + 11 / 2) / 2);
  assert.notEqual(row.average, (1.33 + 5.5) / 2);
  const [duplicatedVotes] = ratingsByChooser([
    input[0],
    makeBook({ terningkastene: casts(5, 6, 5, 6) })
  ]);
  assert.equal(duplicatedVotes.average, row.average);
  assert.equal(duplicatedVotes.ratingCount, 7);
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
  assert.equal(formatRating(2357 / 540), "4,36");
});

test("author distribution counts each book once, including repeated authors and all categories", () => {
  const input = [
    makeBook(),
    makeBook(),
    makeBook({ author: "Known man" }),
    makeBook({ author: " Nonbinary author " }),
    makeBook({ author: "New author" }),
    makeBook({ author: "Invalid category" })
  ];
  const result = authorDistribution(input, testGenders);
  assert.deepEqual(result.counts, { female: 2, male: 1, nonbinary: 1, unknown: 2 });
  assert.equal(result.total, input.length);
  assert.equal(
    Object.values(result.counts).reduce((sum, count) => sum + count, 0),
    input.length
  );
});

test("no names are guessed, including punctuation, missing names and object prototype keys", () => {
  for (const author of ["Name & Name", "Family, Given", "toString", "__proto__", ""]) {
    assert.equal(
      authorDistribution([makeBook({ author })], testGenders).counts.unknown,
      1
    );
  }
  assert.equal(authorDistribution([], testGenders).total, 0);
});

test("author data contains only names and supported gender values", () => {
  for (const [name, gender] of Object.entries(genders)) {
    assert.ok(name.trim());
    assert.ok(["female", "male", "nonbinary", "unknown"].includes(gender));
  }
});

test("actual catalog totals and each member drill-down reconcile", () => {
  const overall = authorDistribution(books, genders);
  assert.equal(overall.total, 46);
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
      genders
    );
    assert.deepEqual(result.counts, { female, male, nonbinary: 0, unknown: 0 });
    total += result.total;
  }
  assert.equal(total, overall.total);
});

test("actual equal-book averages and counts, with seven zero placeholders excluded", () => {
  const expected = {
    Heidi: [134 / 5, 36, 7, 8],
    Ida: [1997 / 60, 37, 8, 8],
    Kyrre: [121 / 10, 17, 3, 3],
    Levin: [2357 / 60, 44, 9, 9],
    Silje: [2209 / 60, 42, 9, 9],
    Øivind: [2261 / 60, 45, 9, 9]
  };
  for (const row of ratingsByChooser(books)) {
    const [bookAverageSum, count, rated, total] = expected[row.name];
    assert.ok(Math.abs(row.bookAverageSum - bookAverageSum) < 1e-12);
    assert.equal(row.ratingCount, count);
    assert.equal(row.ratedBookCount, rated);
    assert.equal(row.bookCount, total);
    assert.ok(Math.abs(row.average - bookAverageSum / rated) < 1e-12);
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
