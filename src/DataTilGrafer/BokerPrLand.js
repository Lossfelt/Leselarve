export function BokerPrLand(books) {
  var data = [
    ["Land", "Antall", { role: "tooltip", type: "string", p: { html: true } }]
  ];

  var landeneJegHarVærtGjennom = [];
  var landeneOgAntall = [];

  books.forEach(element => {
    if (!landeneJegHarVærtGjennom.includes(element.authorNationality)) {
      landeneJegHarVærtGjennom.push(element.authorNationality);
      landeneOgAntall.push([
        element.authorNationality,
        1,
        element.title + "<br>"
      ]);
    } else {
      landeneOgAntall.forEach(entry => {
        if (entry[0] === element.authorNationality) {
          entry[1] += 1;
          entry[2] += element.title + "<br>";
        }
      });
    }
  });

  landeneOgAntall.forEach(element => {
    data.push(element);
  });
  //console.log(data);
  var options = {
    /* title: "Bøker pr land", */
    tooltip: { isHtml: true, trigger: "visible" },
    magnifyingGlass: { enable: true, zoomFactor: 5.0 },
    legend: { position: "none" },
    backgroundColor: "#d6eeff",
    colorAxis: { colors: ["#61ceff", "#004c6d"] } // light blue to dark blue
  };

  var begge = [data, options];

  return begge;
}
