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
        Snittet av bokgjennomsnittene for bøkene personen har valgt. Hver vurderte bok
        teller likt, uansett antall terningkast. Bokas snitt beregnes fra alle medlemmenes
        gyldige terningkast (1–6). 0, manglende og ugyldige terningkast utelates. Bøker
        uten gyldige terningkast tas ikke med i gjennomsnittet.
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
                {row.ratingCount} terningkast · {row.ratedBookCount} av {row.bookCount}{" "}
                valgte bøker vurdert
                {row.bookCount > row.ratedBookCount && (
                  <span> · {row.bookCount - row.ratedBookCount} uten terningkast</span>
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
