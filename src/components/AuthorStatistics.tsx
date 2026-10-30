import { useId, useMemo, useState } from "react";
import authorsData from "../AUTHORS.json";
import { authorDistribution, GENDER_GROUPS, type AuthorGenders } from "../statistics.ts";
import type { Book } from "../types.ts";

const genders = authorsData as AuthorGenders;

export default function AuthorStatistics({ books }: { books: Book[] }) {
  const [member, setMember] = useState("");
  const selectId = useId();
  const members = useMemo(
    () =>
      [...new Set(books.map((book) => book.chosenBy))].sort((a, b) =>
        a.localeCompare(b, "nb")
      ),
    [books]
  );
  const selectedMember = members.includes(member) ? member : "";
  const selectedBooks = selectedMember
    ? books.filter((book) => book.chosenBy === selectedMember)
    : books;
  const { counts, total } = authorDistribution(selectedBooks, genders);

  return (
    <section
      className="stat-card stat-card--wide"
      aria-labelledby={`${selectId}-heading`}
    >
      <header className="stat-card-header stat-card-header--split">
        <div>
          <h2 className="stat-card-title" id={`${selectId}-heading`}>
            Kjønnsfordeling blant forfatterne
          </h2>
          <p className="stat-card-desc">
            Hvem har vi valgt å lese? Se hele klubben eller bøkene valgt av ett medlem.
          </p>
        </div>
        <div className="stat-filter">
          <label htmlFor={selectId}>Bøker valgt av</label>
          <select
            id={selectId}
            value={selectedMember}
            onChange={(event) => setMember(event.target.value)}
          >
            <option value="">Hele klubben</option>
            {members.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </header>
      <div aria-live="polite" aria-atomic="true">
        <p className="stat-scope">
          {selectedMember || "Hele klubben"} · {total} bøker
        </p>
        <dl className="gender-counts">
          {GENDER_GROUPS.map(({ key, label }) => (
            <div key={key} className={`gender-count gender-count--${key}`}>
              <dt>
                <span className={`gender-dot gender-dot--${key}`} aria-hidden="true" />
                {label}
              </dt>
              <dd>
                {counts[key]}{" "}
                <span>
                  {(total ? (counts[key] / total) * 100 : 0).toLocaleString("nb-NO", {
                    maximumFractionDigits: 1
                  })}{" "}
                  %
                </span>
              </dd>
            </div>
          ))}
        </dl>
        {total > 0 ? (
          <div className="gender-bar" aria-hidden="true">
            {GENDER_GROUPS.map(
              ({ key }) =>
                counts[key] > 0 && (
                  <span
                    key={key}
                    className={`gender-segment gender-dot--${key}`}
                    style={{ width: `${(counts[key] / total) * 100}%` }}
                  />
                )
            )}
          </div>
        ) : (
          <p>Ingen bøker i dette utvalget.</p>
        )}
      </div>
      <p className="stat-method">
        Én telling per valgt bok, ikke unike personer. Samme forfatter i to bøker teller
        to ganger. Også bøker uten terningkast er med.
      </p>
    </section>
  );
}
