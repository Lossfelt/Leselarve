import { useMemo } from "react";
import { formatRating, ratingsByChooser } from "../statistics.ts";
import type { Book } from "../types.ts";

export default function ChooserRatings({ books }: { books: Book[] }) {
  const rows = useMemo(() => ratingsByChooser(books), [books]);
  return (
    <section
      className="stat-card stat-card--wide"
      aria-labelledby="chooser-ratings-heading"
    >
      <header className="stat-card-header">
        <h2 className="stat-card-title" id="chooser-ratings-heading">
          Gjennomsnittlig terningkast etter hvem som valgte boka
        </h2>
        <p className="stat-card-desc">
          Hvor godt likte klubben bøkene hver av oss valgte?
        </p>
      </header>
      <p className="stat-method">
        Alle gyldige terningkast (1–6) fra alle medlemmer på bøkene valgt av personen
        legges sammen og deles på antall kast. Hvert kast teller likt, så bøker med flere
        kast veier mer. Dette er ikke personens egne terningkast eller et snitt av
        bokgjennomsnittene. 0, manglende kast og bøker uten gyldige kast påvirker ikke
        snittet.
      </p>
      {rows.length ? (
        <ol className="chooser-ratings-list">
          {rows.map((row) => (
            <li key={row.name}>
              <div className="chooser-rating-topline">
                <strong>{row.name}</strong>
                <span className="chooser-rating-value">
                  {formatRating(row.average)}
                  {row.average !== null && <small> / 6</small>}
                </span>
              </div>
              <div className="chooser-rating-track" aria-hidden="true">
                <span style={{ width: `${((row.average ?? 0) / 6) * 100}%` }} />
              </div>
              <p>
                {row.ratingCount} kast · {row.ratedBookCount} av {row.bookCount} valgte
                bøker vurdert
                {row.bookCount > row.ratedBookCount && (
                  <span> · {row.bookCount - row.ratedBookCount} uten kast</span>
                )}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <p>Ingen valgte bøker ennå.</p>
      )}
    </section>
  );
}
