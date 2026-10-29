import { useId, useMemo, useState } from "react";
import authorsData from "../AUTHORS.json";
import { authorDistribution, GENDER_GROUPS, type AuthorProfiles } from "../statistics.ts";
import type { Book } from "../types.ts";

const profiles = authorsData as AuthorProfiles;

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
  const { counts, total, bookCount, entries } = authorDistribution(
    selectedBooks,
    profiles
  );

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
          {selectedMember || "Hele klubben"} · {bookCount} bøker · {total} forfatterbidrag
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
                <span>{total ? Math.round((counts[key] / total) * 100) : 0} %</span>
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
        Én telling per forfatter per valgt bok, ikke unike personer. Samme forfatter i to
        bøker teller to ganger. Ved flere forfattere telles hver av dem. Også bøker uten
        terningkast er med.
      </p>
      <details className="stat-details">
        <summary>Se bøker, forfattere og kilder ({entries.length})</summary>
        <p className="stat-method">
          Kategoriene bygger på offentlig omtale i forfatter-, forlags- og
          institusjonsbiografier, kontrollert 29. oktober 2026, ikke på navn eller bilder.
          Omtale og pronomen er ikke en uttømmende beskrivelse av kjønnsidentitet.
          Manglende eller uavklarte opplysninger telles som «Uavklart», aldri automatisk
          som kvinne eller mann. Ferrante telles etter den offentlige
          forfatteridentiteten, ikke den ukjente private identiteten.
        </p>
        <ul className="author-source-list">
          {entries.map(({ book, name, profile }) => (
            <li key={`${book.numberInLine}-${name}`}>
              <div>
                <strong>{book.title}</strong>
                <span className="stat-source-book">Valgt av {book.chosenBy}</span>
              </div>
              <div>
                {name}{" "}
                <span className="stat-source-category">
                  · {GENDER_GROUPS.find(({ key }) => key === profile.gender)?.label}
                </span>
                {profile.source ? (
                  <a href={profile.source.url} target="_blank" rel="noreferrer">
                    Kilde: {profile.source.title}{" "}
                    <span className="sr-only">(åpnes i ny fane)</span>
                  </a>
                ) : (
                  <span className="stat-source-book">
                    Ingen verifisert kilde registrert
                  </span>
                )}
                {profile.note && <span className="stat-source-book">{profile.note}</span>}
              </div>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
