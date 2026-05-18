# Moderniseringsplan for Leselarve

Mål: modernisere det tekniske fundamentet og redesigne siden som en virtuell bokhylle
(jf. inspirasjonsbilde fra mai 2026).

Anbefalt rekkefølge: fase 1 → 2 → 3 → 4 → 5. Fase 1 er forutsetning for resten.

---

## Fase 1 — Teknisk fundament

Bytt ut verktøykjeden før noe annet, slik at videre arbeid skjer på et moderne grunnlag.

- [ ] Migrer fra `react-scripts` til **Vite**
  - Ny `package.json`, `vite.config.js`, `index.html` flyttes til prosjektrot
  - Fjern `public/`-mappens CRA-spesifikke konvensjoner
- [ ] Oppgrader **React 16.8.6 → 19** (eller 18 hvis Google Charts-erstatning krever det)
  - `ReactDOM.render` → `createRoot`
- [ ] Skriv om alle class-komponenter til funksjonskomponenter med hooks
  - `Presentation`, `Book`, `Topnav`, `Grafer`
- [ ] Vurder **TypeScript**. Liten kodebase, lav kostnad å konvertere, god gevinst for `BOOKS.json`-skjema
- [ ] Sett opp ESLint + Prettier (moderne flat config)
- [ ] Oppdater `.gitignore` for Vite (`dist/` i stedet for `build/`)
- [ ] Oppdater `now.json` / hosting-konfig om nødvendig (Vercel støtter Vite direkte)

## Fase 2 — Kodekvalitet og bugfikser

Rydd opp samtidig som du skriver om komponentene.

- [ ] **Bugfiks:** `books.sort(...)` i `Presentation.js:69` muterer `props`. Bruk `[...books].sort(...)`
- [ ] **Bugfiks:** `handleSortClick` (Presentation.js:19–32) leser `this.state.sortBy` etter `setState` — race condition. Forsvinner med `useState` og funksjonell oppdatering
- [ ] **Bugfiks:** manglende `key`-prop på liste-elementer (Presentation.js:72–78)
- [ ] **Bugfiks:** typo `heigth="100"` i `Book.js:27`
- [ ] Utled medlemslisten dynamisk fra `BOOKS.json` (unike `chosenBy`), fjern hardkoding i Presentation.js og Topnav.js
- [ ] Erstatt repetitiv knapp-markup i Topnav med `sortKeys.map(...)` og `members.map(...)`
- [ ] `var` → `const` / `let` i hele kodebasen
- [ ] Bytt tabell-layout i `Book.js` til CSS Grid eller Flexbox (ugyldig HTML i dag med nøstede `<tr>`)

## Fase 3 — Visuell redesign: bokhylle

Hovedendringen. Bygg en virtuell hylle som matcher inspirasjonsbildet.

### Layout og struktur
- [ ] Ny topnav: lys bakgrunn, logo + navn, søkefelt, ev. profil-ikon
  - Anbefaler å begrense ruter til **Hjem / Bøker / Statistikk** — droppe Lister/Forfattere/Om oss inntil videre
- [ ] Hero-seksjon: stor tittel ("Finn din neste bok" eller "Bokhylla vår") + undertittel
- [ ] **Filter-chips** øverst i stedet for dropdown-meny: "Alle", "Nyeste", per medlem, sjanger (hvis i data)
- [ ] Søkefelt for tittel/forfatter

### Bokhylle-komponenten
- [ ] Tre-tekstur som bakgrunn (SVG-mønster eller bilde, valnøttbrun tone)
- [ ] Hver hylle er en rad med:
  - Trebrett under bøkene (mørkere brun stripe med skygge)
  - Lys-gradient øverst som simulerer LED-belysning
  - Indre skygge for dybde
- [ ] Bokomslag som flate rektangler stående på hyllen
  - Fast aspect-ratio (anbefaler 2:3), `object-fit: cover`
  - Subtil skygge på siden for å gi 3D-følelse
  - Lett rotasjon (±1–2°) på hvert kort for "ekte hylle"-følelse — eller fjern hvis det ser rotete ut
- [ ] Forfatter/tittel under boka i serif-font, små versaler — som i inspirasjonsbildet
- [ ] **Hover:** boka løftes (translateY) og får sterkere skygge
- [ ] **Klikk:** åpner detaljpanel (side-drawer eller modal) med tittel, forfatter, sider, valgt av, terningkast per medlem, ev. omtale

### Dekor (valgfritt, til slutt)
- [ ] Plante, globus, lite bunke med bøker på enden av hyllene
- [ ] Implementeres som absolutt-posisjonerte SVG/PNG, kun på store skjermer

### Fargepalett (forslag)
- Bakgrunn: varm beige `#f3eee3`
- Hylletre: `#6b4a2b` til `#8a5a35` gradient
- Tekst: mørk brun/svart
- Accent (chips, knapper): olivengrønn `#6b7a3a` eller terrakotta

## Fase 4 — Polering

- [ ] Responsivt design: 4 bøker per hylle på desktop, 3 på tablet, 2 på mobil
- [ ] Tilgjengelighet:
  - `<html lang="no">` (er `en` i dag)
  - `alt`-tekster på bokomslag ("Forsiden av {tittel} av {forfatter}")
  - Tastaturnavigasjon på bok-kort (Tab + Enter åpner detaljpanel)
  - Erstatt `<noscript>`-engelsk tekst med norsk
  - Riktig kontrast i chips og knapper
- [ ] Lazy-loading av bokomslag (`loading="lazy"`)
- [ ] Behold kun én Font Awesome-versjon (i dag lastes både v4 og v5 fra CDN)
- [ ] **Lås Google Maps API-nøkkel** i Google Cloud Console til prod-domenet (HTTP referrer restriction)
- [ ] Sett opp riktig favicon og `<title>`
- [ ] `prefers-reduced-motion`-respekt for hover-animasjoner

## Fase 5 — Grafer / statistikk

- [ ] Flytt grafer til egen rute `/statistikk` (med react-router eller liknende minimal løsning)
- [ ] Vurder å bytte fra `react-google-charts` til **Recharts** eller **Chart.js**:
  - Lettere bundle
  - Bedre kontroll over styling (matche bokhylle-paletten)
  - Slipper Google Maps-nøkkel hvis vi finner enklere kartløsning, ev. dropper kartet
- [ ] Visuell harmonisering: samme typografi, farger og kortstil som bokhylle-siden

---

## Notater

- Datamodellen i `BOOKS.json` ser ut til å holde — ingen migrering nødvendig
- Hvis vi går på TypeScript: definer `Book`-typen tidlig, importer i alle komponenter
- Detaljpanelet kan etterhvert utvides med: anmeldelser fra hvert medlem, "lest dato", lenke til Goodreads/Bokelskere
