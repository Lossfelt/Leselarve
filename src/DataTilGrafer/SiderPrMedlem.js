export function SiderPrMedlem(books) {
  const totaler = new Map();
  for (const book of books) {
    const m = totaler.get(book.chosenBy) ?? { sider: 0, antall: 0 };
    m.sider += book.pages;
    m.antall += 1;
    totaler.set(book.chosenBy, m);
  }

  const data = [["Medlemmer", "Gjennomsnitt"]];
  for (const [navn, { sider, antall }] of totaler) {
    data.push([navn, Math.floor(sider / antall)]);
  }

  const options = {
    title: "Gjennomsnittlig antall sider per person",
    hAxis: { minValue: 0 },
    backgroundColor: "#d6eeff"
  };

  return [data, options];
}
