export function TerningkastPrBok(books) {
  var data = [
    [
      { type: "string", label: "Bøker" },
      { type: "number", label: "Terningkast" },
      { id: "i0", type: "number", role: "interval" },
      { id: "i1", type: "number", role: "interval" },
      { id: "i2", type: "number", role: "interval" },
      { id: "i3", type: "number", role: "interval" },
      { id: "i4", type: "number", role: "interval" },
      { id: "i5", type: "number", role: "interval" }
    ]
  ];

  books.forEach(element => {
    var gjennomsnittligTerningkast = 0;
    element.terningkastene.forEach(terning => {
      gjennomsnittligTerningkast += terning.terningkast;
    });
    gjennomsnittligTerningkast =
      Math.round(
        (gjennomsnittligTerningkast / element.terningkastene.length) * 10
      ) / 10;
    var detSomSkalDyttesTilData = [element.title, gjennomsnittligTerningkast];
    element.terningkastene.forEach(element => {
      detSomSkalDyttesTilData.push(element.terningkast);
    });
    while (detSomSkalDyttesTilData.length < data[0].length) {
      detSomSkalDyttesTilData.push(gjennomsnittligTerningkast);
    }
    data.push(detSomSkalDyttesTilData);
  });

  var options = {
    title: "Terningkast pr bok",
    //curveType: "function",
    series: [{ color: "#004c6d" }],
    intervals: { style: "boxes" },
    lineWidth: 1,
    legend: "none",
    backgroundColor: "#d6eeff",
    vAxis: {
      viewWindowMode: "explicit",
      viewWindow: {
        max: 6.5,
        min: -0.5
      }
    }
  };

  var begge = [data, options];

  return begge;
}
