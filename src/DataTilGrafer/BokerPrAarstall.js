export function BokerPrAarstall(books) {
  var data = [["Bøker", "Utgivelsesår"]];
  books.forEach(element => {
    data.push([element.title, element.published]);
  });

  var options = {
    title: "Bøker lest per utgivelsestiår",
    legend: { position: "none" },
    backgroundColor: "#d6eeff",
    histogram: { bucketSize: 10 },
    hAxis: { format: 0 }
  };

  var begge = [data, options];

  return begge;
}
