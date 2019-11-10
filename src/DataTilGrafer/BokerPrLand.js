export function BokerPrLand(books) {
  var data = [["Land", "Antall"]];

  var landeneJegHarVærtGjennom = [];
  var landeneOgAntall = [];

  books.forEach(element => {
    if (!landeneJegHarVærtGjennom.includes(element.authorNationality)) {
      landeneJegHarVærtGjennom.push(element.authorNationality);
      landeneOgAntall.push([element.authorNationality, 1]);
    } else {
      landeneOgAntall.forEach(entry => {
        if (entry[0] === element.authorNationality) {
          entry[1] += 1;
        }
      });
    }
  });

  landeneOgAntall.forEach(element => {
    data.push(element);
  });
  /* console.log(data); */
  var options = {
    /* title: "Bøker pr land", */
    legend: { position: "none" },
    backgroundColor: "#d6eeff",
    colorAxis: { colors: ["#61ceff", "#004c6d"] } // light blue to dark blue
  };

  var begge = [data, options];

  return begge;
}
