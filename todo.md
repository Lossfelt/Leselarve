# Moderniseringsplan for Leselarve

---

## Fase 1 — Teknisk fundament ✅

- [x] Vite + React 19 + funksjonskomponenter
- [ ] TypeScript — utsatt
- [ ] ESLint + Prettier — utsatt

## Fase 2 — Kodekvalitet og bugfikser ✅

## Fase 3 — Visuell redesign: bokhylle ✅

Gjenstår som valgfri polish:
- [ ] Dekor (plante, klode, småbøker) — venter på assets
- [ ] Sidevanger med Asset 4 — ikke i bruk
- [ ] Sentrering av siste rad / dekor i tomme celler

## Fase 4 — Polering

- [x] Responsivt design
- [x] Tilgjengelighet (lang, alt, tastatur, noscript)
- [x] Lazy-loading
- [x] Font Awesome konsolidert
- [x] Favicon med bokorm
- [x] `prefers-reduced-motion`
- [ ] **Modal-tilgjengelighet**: Esc lukker, focus-trap, returnér fokus ved lukking
- [x] ~~Lås Google Maps API-nøkkel~~ — obsolet, GeoChart erstattet med react-simple-maps (ingen nøkkel)

## Fase 5 — Grafer / statistikk ✅

- [x] Recharts + react-simple-maps i stedet for Google Charts
- [x] Stilt etter bokhylle-paletten
- [x] Lazy-lastet som egen chunk

---

## Notater

- Detaljpanelet kan etterhvert utvides med: anmeldelser fra hvert medlem, "lest dato", lenke til Goodreads/Bokelskere
- 43 bøker → 7 fulle rader + 1 bok alene i siste rad
