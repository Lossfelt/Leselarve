export function TerningkastPrMedlem(books) {
  var data = [
    ["Medlem", "1", "2", "3", "4", "5", "6"],
    ["Øivind", 0, 0, 0, 0, 0, 0],
    ["Silje", 0, 0, 0, 0, 0, 0],
    ["Levin", 0, 0, 0, 0, 0, 0],
    ["Ida", 0, 0, 0, 0, 0, 0],
    ["Heidi", 0, 0, 0, 0, 0, 0],
    ["Kyrre", 0, 0, 0, 0, 0, 0]
  ];

  books.forEach(element => {
    element.terningkastene.forEach(terning => {
      data.forEach(medlem => {
        if (terning.medlem === medlem[0]) {
          if (terning.terningkast === 1) {
            medlem[1] += 1;
          } else if (terning.terningkast === 2) {
            medlem[2] += 1;
          } else if (terning.terningkast === 3) {
            medlem[3] += 1;
          } else if (terning.terningkast === 4) {
            medlem[4] += 1;
          } else if (terning.terningkast === 5) {
            medlem[5] += 1;
          } else if (terning.terningkast === 6) {
            medlem[6] += 1;
          }
        }
      });
    });
  });

  var options = {
    title: "Terningkast pr medlem",
    backgroundColor: "#d6eeff",
    legend: "none"
  };

  var begge = [data, options];

  return begge;
}
