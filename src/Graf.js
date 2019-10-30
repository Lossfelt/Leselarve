import React from "react";
import Chart from "react-google-charts";

class Graf extends React.Component {
  render() {
    var books = this.props.books;
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

    var gdata = [["Medlemmer", "Gjennomsnitt"]];
    siderPrMedlem.forEach(entry => {
      gdata.push([entry.Navn, entry.gjennomsnittligAntallSider]);
    });
    /* console.log(gdata); */

    return (
      <div>
        <h1>Dette er Google Charts</h1>

        <Chart
          /* width={300}
          height={300} */
          chartType="ColumnChart"
          loader={<div>Loading Chart</div>}
          data={gdata}
          options={{
            title: "Gjennomsnittlig antall sider per person",
            hAxis: {
              title: "Medlemmer",
              minValue: 0
            },
            vAxis: {
              title: "Antall sider"
            }
          }}
          legendToggle
        />
      </div>
    );
  }
}

export default Graf;
