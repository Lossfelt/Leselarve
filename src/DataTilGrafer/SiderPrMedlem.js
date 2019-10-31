export function SiderPrMedlem(books) {
  var siderPrMedlem = [
    {
      Navn: "Levin",
      totaltSider: 0,
      antallBøker: 0,
      gjennomsnittligAntallSider: 0
    },
    {
      Navn: "Øivind",
      totaltSider: 0,
      antallBøker: 0,
      gjennomsnittligAntallSider: 0
    },
    {
      Navn: "Silje",
      totaltSider: 0,
      antallBøker: 0,
      gjennomsnittligAntallSider: 0
    },
    {
      Navn: "Ida",
      totaltSider: 0,
      antallBøker: 0,
      gjennomsnittligAntallSider: 0
    },
    {
      Navn: "Heidi",
      totaltSider: 0,
      antallBøker: 0,
      gjennomsnittligAntallSider: 0
    }
  ];

  books.forEach(element => {
    siderPrMedlem.forEach(medlem => {
      if (element.chosenBy === medlem.Navn) {
        medlem.totaltSider += element.pages;
        medlem.antallBøker += 1;
      }
    });
  });
  siderPrMedlem.forEach(entry => {
    entry.gjennomsnittligAntallSider = Math.floor(
      entry.totaltSider / entry.antallBøker
    );
  });

  var data = [["Medlemmer", "Gjennomsnitt"]];
  siderPrMedlem.forEach(entry => {
    data.push([entry.Navn, entry.gjennomsnittligAntallSider]);
  });

  var muligheter = {
    title: "Gjennomsnittlig antall sider per person",
    hAxis: {
      title: "Medlemmer",
      minValue: 0
    },
    vAxis: {
      title: "Antall sider"
    },
    backgroundColor: "#d6eeff"
  };

  var begge = [data, muligheter];

  return begge;
}
