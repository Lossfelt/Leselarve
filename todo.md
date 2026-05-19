# Moderniseringsplan for Leselarve

---

## Fase 1 — Teknisk fundament ✅

- [x] Vite + React 19 + funksjonskomponenter
- [x] TypeScript (strict, alle filer typet, BOOKS.json typet via `Book[]`-cast)
- [x] ESLint v10 (flat config) + Prettier 3

## Fase 2 — Kodekvalitet og bugfikser ✅

## Fase 3 — Visuell redesign: bokhylle ✅



### Backlog (forsøkt / forkastet)

- Sidevanger med Asset 4: prøvd som CSS-pseudo-elementer (vertikale stolper med skygge på bakveggen). Resultat ble unaturlig. Kan vurderes igjen senere med annen asset eller annen tilnærming (f.eks. faktiske vinklede sidekanter via SVG, eller integrert i et helt nytt sammensatt asset).

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

- Detaljpanelet kan etterhvert utvides med: anmeldelser fra hvert medlem, "lest dato", lenke til Goodreads/Bokelskere. Utsatt fordi vi ikke har lest-dato tilbake i tid.
- 43 bøker → 7 fulle rader + 1 bok alene i siste rad

## Til slutt

- [ ] Be Claude hente bildene fra Imgur og lagre den som en del av repoet isteden.


