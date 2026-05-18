export function BokerPrAarstall(books) {
  const data = [["Bøker", "Utgivelsesår"]];
  for (const book of books) {
    data.push([book.title, book.published]);
  }

  const options = {
    title: "Bøker lest per utgivelsestiår",
    legend: { position: "none" },
    backgroundColor: "#d6eeff",
    histogram: { bucketSize: 10 },
    hAxis: { format: 0 }
  };

  return [data, options];
}
