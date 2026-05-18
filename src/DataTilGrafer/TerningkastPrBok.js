export function TerningkastPrBok(books) {
  const header = [
    { type: "string", label: "Bøker" },
    { type: "number", label: "Terningkast" },
    { id: "i0", type: "number", role: "interval" },
    { id: "i1", type: "number", role: "interval" },
    { id: "i2", type: "number", role: "interval" },
    { id: "i3", type: "number", role: "interval" },
    { id: "i4", type: "number", role: "interval" },
    { id: "i5", type: "number", role: "interval" }
  ];

  const data = [header];
  for (const book of books) {
    const sum = book.terningkastene.reduce((s, t) => s + t.terningkast, 0);
    const snitt = Math.round((sum / book.terningkastene.length) * 10) / 10;

    const rad = [book.title, snitt, ...book.terningkastene.map((t) => t.terningkast)];
    while (rad.length < header.length) rad.push(snitt);
    data.push(rad);
  }

  const options = {
    title: "Terningkast pr bok",
    series: [{ color: "#004c6d" }],
    intervals: { style: "boxes" },
    lineWidth: 1,
    legend: "none",
    backgroundColor: "#d6eeff",
    vAxis: {
      viewWindowMode: "explicit",
      viewWindow: { max: 6.5, min: 0.5 }
    }
  };

  return [data, options];
}
