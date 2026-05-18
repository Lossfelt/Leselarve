export function BokerPrLand(books) {
  const perLand = new Map();
  for (const book of books) {
    const eksisterende = perLand.get(book.authorNationality);
    if (eksisterende) {
      eksisterende.antall += 1;
      eksisterende.titler += `${book.title}<br>`;
    } else {
      perLand.set(book.authorNationality, {
        antall: 1,
        titler: `${book.title}<br>`
      });
    }
  }

  const data = [
    ["Land", "Antall", { role: "tooltip", type: "string", p: { html: true } }]
  ];
  for (const [land, { antall, titler }] of perLand) {
    data.push([land, antall, titler]);
  }

  const options = {
    tooltip: { isHtml: true, trigger: "visible" },
    magnifyingGlass: { enable: true, zoomFactor: 5.0 },
    legend: { position: "none" },
    backgroundColor: "#d6eeff",
    colorAxis: { colors: ["#61ceff", "#004c6d"] }
  };

  return [data, options];
}
