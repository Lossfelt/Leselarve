# Statistikk: forfattere og mottatte terningkast

## Forfatterfordeling

- Teller **forfatterbidrag per valgt bok**, ikke unike personer. En forfatter med to valgte bøker teller to ganger. Bøker uten terningkast er med.
- `Book.author` er visningsnavnet og brukes for bøker med én forfatter. Ved flere forfattere registreres de eksplisitt i `Book.authors`, én oppføring per person. Navn splittes aldri automatisk på komma, & eller «og». Duplikater innen samme bok fjernes. En bok med to forfattere bidrar med to tellinger.
- `src/AUTHORS.json` kobler eksakte forfatternavn til publisert biografisk omtale, kilde, kontroll-dato og kort kildegrunnlag. Kilder ble lest 29. oktober 2026; ingen kategorisering ut fra navn eller foto.
- Kategoriene er kvinner, menn, ikke-binære / annen kjønnsidentitet og uavklart. Disse er en oppsummering av offentlig biografisk omtale, ofte pronomen, **ikke en uttømmende eller direkte verifikasjon av privat kjønnsidentitet**. Oppdater ved en tydeligere offentlig opplysning. Nye, manglende og udokumenterte profiler havner i uavklart, ikke i en binær kategori.
- Elena Ferrante er et pseudonym. Kategorien følger den offentlige forfatteridentiteten på forfatterens nettsted, uten å forsøke å identifisere privatpersonen.
- Medlemsfilteret bruker `chosenBy`, ikke den som har gitt et terningkast. Kildelisten filtreres på samme bokutvalg og bruker vanlige tastaturtilgjengelige HTML-kontroller.

## Gjennomsnitt etter bokvelger

For hvert medlem summeres alle gyldige terningkast på bøkene de har valgt, delt på antall gyldige kast. **Hvert kast teller likt.** Bøker med flere kast får dermed større vekt. Dette er ikke medlemmets egne kast eller et uvektet gjennomsnitt av bokgjennomsnittene. Det rundes bare av ved visning, til to desimaler.

Gyldige kast er heltall 1–6. Nullverdier, manglende kast og ugyldige verdier utelates. Bøker uten gyldige kast teller som valgte, men ikke som vurderte. Et medlem uten kast vises med «Ingen kast ennå», ikke 0. Antall kast, vurderte bøker og totalt valgte bøker vises ved hvert snitt. Samme validering brukes i bokdiagrammet, terningkastfordelingen og bokdetaljene. Bokdiagrammet bruker null/hull ved bøker uten kast.

## Kontrollert datasett

46 bøker: 23 kvinnelige og 23 mannlige forfatterbidrag, 0 uavklarte og 0 ikke-binære / annen kjønnsidentitet etter den beskrevne metoden.

| Bokvelger | Kvinner | Menn | Sum kast | Antall kast | Vurderte / valgte bøker | Snitt |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Heidi | 5 | 3 | 138 | 36 | 7 / 8 | 3,83 |
| Ida | 4 | 4 | 155 | 37 | 8 / 8 | 4,19 |
| Kyrre | 1 | 2 | 69 | 17 | 3 / 3 | 4,06 |
| Levin | 4 | 5 | 191 | 44 | 9 / 9 | 4,34 |
| Silje | 5 | 4 | 169 | 42 | 9 / 9 | 4,02 |
| Øivind | 4 | 5 | 186 | 45 | 9 / 9 | 4,13 |

`npm test` tester kanttilfeller og disse regnetallene mot en frosset katalog-fixture fra 29. oktober 2026. Nye bøker eller kast krever ikke at gamle forventninger endres. Nye forfattere uten metadata blir «Uavklart»; legg inn en kontrollert kilde for å kategorisere dem.
