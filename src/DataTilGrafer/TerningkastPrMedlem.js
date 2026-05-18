export function TerningkastPrMedlem(books) {
  const medlemmer = new Map();
  for (const book of books) {
    for (const t of book.terningkastene) {
      const fordeling = medlemmer.get(t.medlem) ?? [0, 0, 0, 0, 0, 0];
      if (t.terningkast >= 1 && t.terningkast <= 6) {
        fordeling[t.terningkast - 1] += 1;
      }
      medlemmer.set(t.medlem, fordeling);
    }
  }

  const data = [["Medlem", "1", "2", "3", "4", "5", "6"]];
  for (const [navn, fordeling] of medlemmer) {
    data.push([navn, ...fordeling]);
  }

  const options = {
    title: "Terningkast pr medlem",
    backgroundColor: "#d6eeff",
    legend: "none"
  };

  return [data, options];
}
