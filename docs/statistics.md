# Statistikk: forfattere og mottatte terningkast

## Forfatterfordeling

- Teller **én gang per valgt bok**, ikke unike personer. En forfatter med to valgte bøker teller to ganger. Bøker uten terningkast er med.
- Det obligatoriske feltet `Book.author` er eneste kilde til forfatternavn, både i bokvisningen og i statistikken.
- `src/AUTHORS.json` inneholder bare forfatternavn og kjønn, for eksempel `"Jon Fosse": "male"`. Det brukes ingen automatisk kategorisering ut fra navn eller foto.
- Kategoriene er kvinner, menn, ikke-binære / annen kjønnsidentitet og uavklart. Disse er en oppsummering av offentlig biografisk omtale, ofte pronomen, **ikke en uttømmende eller direkte verifikasjon av privat kjønnsidentitet**. Oppdater ved en tydeligere offentlig opplysning. Uregistrerte forfattere og ugyldige kategorier havner i uavklart, ikke i en binær kategori.
- Elena Ferrante er et pseudonym. Kategorien følger den offentlige forfatteridentiteten på forfatterens nettsted, uten å forsøke å identifisere privatpersonen.
- Medlemsfilteret bruker `chosenBy`, ikke den som har gitt et terningkast.

## Gjennomsnitt etter bokvelger

For hvert medlem beregnes først gjennomsnittet av alle gyldige kast på hver bok de har valgt. Deretter summeres bokgjennomsnittene og deles på antall vurderte bøker. **Hver vurderte bok teller likt**, uansett antall kast. Det brukes ingen avrunding underveis; bare det endelige snittet avrundes ved visning, til to desimaler.

Eksempel: Bok A har ett kast på 6 (bokgjennomsnitt 6), og bok B har tre kast på 2 (bokgjennomsnitt 2). Resultatet er `(6 + 2) / 2 = 4,00`, ikke gjennomsnittet av alle enkeltkastene på 3,00. En tredje bok uten gyldige kast endrer ikke resultatet.

Gyldige kast er heltall 1–6. Nullverdier, manglende kast og ugyldige verdier utelates. Bøker uten gyldige kast teller som valgte, men ikke som vurderte, og utelates både fra summen av bokgjennomsnitt og fra nevneren. Et medlem uten kast vises med «Ingen kast ennå», ikke 0. Antall kast, vurderte bøker og totalt valgte bøker vises ved hvert snitt. Samme validering brukes i bokdiagrammet, terningkastfordelingen og bokdetaljene. Bokdiagrammet bruker null/hull ved bøker uten kast.

## Kontrollert datasett

46 bøker: 23 med kvinnelig og 23 med mannlig forfatter, 0 uavklarte og 0 ikke-binære / annen kjønnsidentitet etter den beskrevne metoden.

| Bokvelger | Kvinner | Menn | Antall kast | Vurderte / valgte bøker | Snitt |
| --- | ---: | ---: | ---: | ---: | ---: |
| Heidi | 5 | 3 | 36 | 7 / 8 | 3,83 |
| Ida | 4 | 4 | 37 | 8 / 8 | 4,16 |
| Kyrre | 1 | 2 | 17 | 3 / 3 | 4,03 |
| Levin | 4 | 5 | 44 | 9 / 9 | 4,36 |
| Silje | 5 | 4 | 42 | 9 / 9 | 4,09 |
| Øivind | 4 | 5 | 45 | 9 / 9 | 4,19 |

`npm test` tester kanttilfeller og disse regnetallene mot en frosset katalog-fixture fra 29. oktober 2026. Nye bøker eller kast krever ikke at gamle forventninger endres. Nye forfattere uten registrert kjønn blir «Uavklart».
