# Moderniseringsplan for Leselarve

Mål: modernisere det tekniske fundamentet og redesigne siden som en virtuell bokhylle
(jf. inspirasjonsbilde fra mai 2026).

---

## Fase 1 — Teknisk fundament ✅

- [x] Migrer fra `react-scripts` til **Vite**
- [x] Oppgrader **React 16.8.6 → 19**, `createRoot`
- [x] Skriv om alle class-komponenter til funksjonskomponenter med hooks
- [ ] Vurder **TypeScript** — utsatt
- [ ] Sett opp ESLint + Prettier — utsatt
- [x] Oppdatert `.gitignore` for Vite

## Fase 2 — Kodekvalitet og bugfikser ✅

- [x] Fjernet mutasjon av props i sort
- [x] Race condition i sortering forsvant med hooks
- [x] `key`-prop på listeelementer
- [x] Typo `heigth` fjernet
- [x] Medlemslisten utledes dynamisk
- [x] Topnav-knapper bruker `.map`
- [x] `var` → `const`/`let`
- [x] Tabell-layout i Book.jsx erstattet

## Fase 3 — Visuell redesign: bokhylle ✅

- [x] Header med logo, søk og navigasjon
- [x] Filter-chips + sortering som toolbar
- [x] Bokhylle med fotorealistiske tre-assets fra ChatGPT
  - Bakvegg: Asset 1 (seamless valnøtt)
  - Hyllerader med LED-lys: Asset 3 (magenta-versjon, beskåret til kant-til-kant)
  - Gulvplanke uten lys: Asset 5 (beskåret, dekker LED-planken i bunnraden)
- [x] Bokomslag i 2:3-format med drop-shadow, hover-løft
- [x] Klikk åpner detaljpanel (modal)
- [x] 3D-dybde via lyskanter på rammen + innskygger på bakveggen
- [ ] **Dekor** (plante, klode, småbøker) — venter på assets fra deg
- [ ] **Sidevanger** med Asset 4 — ikke i bruk ennå
- [ ] Lett rotasjon på bøker for "ekte hylle"-følelse — droppet (kan virke rotete)

## Fase 4 — Polering

- [x] Responsivt design (auto-fill grid, mobile breakpoint på 720px)
- [x] `<html lang="no">`
- [x] `alt`-tekster på bokomslag
- [x] Tastaturnavigasjon på bok-kort
- [x] Norsk noscript
- [x] Lazy-loading (`loading="lazy"`)
- [x] Kun én Font Awesome-versjon i bruk
- [x] Favicon med bokorm
- [x] `prefers-reduced-motion`
- [ ] **Modal-tilgjengelighet**: Esc lukker, focus-trap, returnér fokus ved lukking
- [ ] **Lås Google Maps API-nøkkel** i Google Cloud Console (din oppgave)

## Fase 5 — Grafer / statistikk

- [ ] Bytt fra `react-google-charts` til **Recharts** eller annet lettere bibliotek
- [ ] Stil grafene til å matche bokhylle-paletten (varm beige, valnøtt, olivengrønn)
- [ ] Vurder å droppe GeoChart (krever Google Maps-nøkkel), eller erstatte med enklere visualisering
- [ ] Egen rute/visning for statistikk (allerede skilt via view-state, men kan dyttes til router senere)

---

## Notater

- Datamodellen i `BOOKS.json` ser ut til å holde — ingen migrering nødvendig
- Detaljpanelet kan etterhvert utvides med: anmeldelser fra hvert medlem, "lest dato", lenke til Goodreads/Bokelskere
- 43 bøker → 7 fulle rader + 1 bok alene i siste rad. Sentrering av siste rad eller dekor i tomme celler er en mulig forbedring.
